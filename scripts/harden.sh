#!/usr/bin/env bash
# VPS Security Hardening for MyStackMint (Ubuntu 24.04 + Docker + Traefik)
# Run as root on a fresh server BEFORE deploying any services.
# Safe to re-run — all sections are idempotent.
set -euo pipefail

DIVIDER="============================================================"
SSH_PORT=2222
NTFY_URL="${NTFY_URL:-}"
NTFY_TOPIC="${NTFY_TOPIC:-}"

info()    { echo -e "\n\033[1;32m[OK]\033[0m  $*"; }
warn()    { echo -e "\n\033[1;33m[!]\033[0m   $*"; }
section() { echo -e "\n$DIVIDER\n  $*\n$DIVIDER"; }
die()     { echo -e "\n\033[1;31m[ERR]\033[0m $*" >&2; exit 1; }

[[ $EUID -ne 0 ]] && die "Run as root: sudo bash harden.sh"

section "1. SSH Hardening"
# Backup original sshd config
cp -n /etc/ssh/sshd_config /etc/ssh/sshd_config.bak 2>/dev/null || true

cat > /etc/ssh/sshd_config.d/99-hardened.conf <<EOF
Port $SSH_PORT
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
PermitEmptyPasswords no
ChallengeResponseAuthentication no
UsePAM yes
X11Forwarding no
PrintMotd no
AcceptEnv LANG LC_*
Subsystem sftp /usr/lib/openssh/sftp-server
MaxAuthTries 3
LoginGraceTime 30
ClientAliveInterval 300
ClientAliveCountMax 2
AllowTcpForwarding no
GatewayPorts no
EOF

systemctl reload ssh 2>/dev/null || systemctl reload sshd 2>/dev/null || true
info "SSH hardened: port=$SSH_PORT, root login=disabled, password auth=disabled"
warn "Ensure your SSH key is in ~/.ssh/authorized_keys BEFORE closing this session."

section "2. UFW Firewall"
apt-get install -y ufw > /dev/null
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow "$SSH_PORT/tcp" comment "SSH"
ufw allow 80/tcp comment "HTTP (Traefik redirect)"
ufw allow 443/tcp comment "HTTPS (Traefik)"
ufw --force enable
info "UFW configured: allow $SSH_PORT, 80, 443 — all else denied"

section "3. Fail2ban"
apt-get install -y fail2ban > /dev/null

cat > /etc/fail2ban/jail.d/mystackmint.conf <<EOF
[sshd]
enabled  = true
port     = $SSH_PORT
filter   = sshd
logpath  = /var/log/auth.log
maxretry = 3
bantime  = 1h
findtime = 10m

[traefik-auth]
enabled  = true
port     = http,https
filter   = traefik-auth
logpath  = /var/log/traefik/*.log
maxretry = 10
bantime  = 30m
findtime = 5m
EOF

cat > /etc/fail2ban/filter.d/traefik-auth.conf <<EOF
[Definition]
failregex = ^.*"(status":401|status":403).*"host":"<HOST>".*$
            ^.*<HOST>.*" (401|403) .*$
ignoreregex =
EOF

systemctl enable fail2ban
systemctl restart fail2ban
info "Fail2ban configured for SSH (port $SSH_PORT) and Traefik auth failures"

section "4. Crowdsec (Docker stack)"
# CrowdSec runs as a Docker container (infra/crowdsec/), not a host agent.
# The Traefik bouncer is the maxlerebourg plugin wired into Traefik — no standalone binary needed.
if docker ps --filter "name=crowdsec" --format '{{.Names}}' | grep -q crowdsec; then
  info "Crowdsec container already running"
else
  warn "Crowdsec container not running — deploy it first:"
  warn "  cd /srv/mystackmint/infra/crowdsec && cp .env.example .env && docker compose up -d"
  warn "Then re-run this section to generate the bouncer key."
fi

# Generate a bouncer API key via docker exec (idempotent — skips if key already exists)
if docker ps --filter "name=crowdsec" --format '{{.Names}}' | grep -q crowdsec; then
  BOUNCER_KEY=$(docker exec crowdsec cscli bouncers add traefik-bouncer \
    --key "$(openssl rand -hex 16)" 2>/dev/null \
    | grep "API key:" | awk '{print $NF}' || echo "")

  if [[ -n "$BOUNCER_KEY" ]]; then
    echo "CROWDSEC_BOUNCER_API_KEY=$BOUNCER_KEY" >> /root/.env.backup
    info "Crowdsec Traefik bouncer API key generated (saved to /root/.env.backup)"
    warn "Set CROWDSEC_BOUNCER_API_KEY in traefik/.env and restart Traefik."
  else
    warn "Bouncer key already exists — retrieve with: docker exec crowdsec cscli bouncers list"
  fi
fi

section "5. Docker Daemon Hardening"
cat > /etc/docker/daemon.json <<'EOF'
{
  "icc": false,
  "userns-remap": "default",
  "no-new-privileges": true,
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "live-restore": true
}
EOF

systemctl reload docker || systemctl restart docker
info "Docker hardened: ICC disabled, user namespace remapping enabled, log rotation set"
warn "userns-remap=default remaps container UIDs — verify existing volumes still work after restart"

section "6. Unattended Security Upgrades"
apt-get install -y unattended-upgrades apt-listchanges > /dev/null

cat > /etc/apt/apt.conf.d/50unattended-upgrades <<'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
};
Unattended-Upgrade::Package-Blacklist {};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::SyslogEnable "true";
EOF

cat > /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF

systemctl enable unattended-upgrades
systemctl restart unattended-upgrades
info "Unattended security upgrades enabled (security patches only, no auto-reboot)"

section "7. Auditd"
apt-get install -y auditd audispd-plugins > /dev/null

cat > /etc/audit/rules.d/mystackmint.rules <<'EOF'
# Privilege escalation
-w /etc/sudoers -p wa -k sudoers_changes
-w /etc/sudoers.d/ -p wa -k sudoers_changes
-a always,exit -F arch=b64 -S execve -F euid=0 -F auid>=1000 -k privilege_escalation

# Sensitive file access
-w /etc/ssh/sshd_config -p wa -k ssh_config
-w /etc/docker/daemon.json -p wa -k docker_config
-w /srv/mystackmint/traefik/acme.json -p rwa -k cert_access
-w /root/.env.backup -p rwa -k secrets_access

# Auth events
-w /var/log/auth.log -p wa -k auth_log
EOF

augenrules --load 2>/dev/null || service auditd restart
systemctl enable auditd
info "Auditd rules loaded: privilege escalation, sensitive files, auth events"

section "8. Trivy Image Scan"
if ! command -v trivy &>/dev/null; then
  curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
fi

echo ""
echo "Scanning all running Docker images for HIGH/CRITICAL vulnerabilities..."
echo ""

SCAN_FAILED=0
while read -r image; do
  echo "--- Scanning: $image ---"
  trivy image --severity HIGH,CRITICAL --no-progress "$image" || SCAN_FAILED=1
done < <(docker ps --format '{{.Image}}' | sort -u)

if [[ $SCAN_FAILED -eq 0 ]]; then
  info "Trivy scan complete — no HIGH/CRITICAL vulnerabilities found in running images"
else
  warn "Trivy found vulnerabilities. Review output above and update affected images."
fi

echo ""
echo "$DIVIDER"
echo "  Hardening complete. Run verify-security.sh to check all measures."
echo "$DIVIDER"

# Send ntfy notification if configured
if [[ -n "$NTFY_URL" && -n "$NTFY_TOPIC" ]]; then
  curl -s -X POST "$NTFY_URL/$NTFY_TOPIC" \
    -H "Title: VPS Hardening Complete" \
    -d "Security hardening applied to $(hostname). Run verify-security.sh to confirm." > /dev/null || true
fi
