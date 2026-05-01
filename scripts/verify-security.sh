#!/usr/bin/env bash
# Verify all security hardening measures are active
set -euo pipefail

SSH_PORT=2222
PASS=0
FAIL=0

ok()   { echo "  [PASS] $*"; ((PASS++)); }
fail() { echo "  [FAIL] $*"; ((FAIL++)); }
skip() { echo "  [SKIP] $*"; }
hdr()  { echo -e "\n--- $* ---"; }

echo "======================================"
echo "  MyStackMint — Security Verification"
echo "======================================"

hdr "SSH"
sshd_conf=$(cat /etc/ssh/sshd_config /etc/ssh/sshd_config.d/*.conf 2>/dev/null | tr '\n' ' ')
[[ "$sshd_conf" =~ "PermitRootLogin no" ]]    && ok "Root login disabled"       || fail "PermitRootLogin not disabled"
[[ "$sshd_conf" =~ "PasswordAuthentication no" ]] && ok "Password auth disabled" || fail "PasswordAuthentication not disabled"
[[ "$sshd_conf" =~ "Port $SSH_PORT" ]]         && ok "SSH on port $SSH_PORT"     || fail "SSH port not changed to $SSH_PORT"
ss -tlnp | grep -q ":$SSH_PORT"               && ok "SSH listening on $SSH_PORT" || fail "SSH not listening on $SSH_PORT"

hdr "UFW Firewall"
ufw status | grep -q "Status: active"         && ok "UFW active"                 || fail "UFW inactive"
ufw status | grep -q "$SSH_PORT"              && ok "SSH port allowed in UFW"    || fail "SSH port not in UFW rules"
ufw status | grep -q "443"                    && ok "HTTPS port 443 allowed"     || fail "HTTPS port 443 not allowed"

hdr "Fail2ban"
systemctl is-active fail2ban &>/dev/null      && ok "Fail2ban service running"   || fail "Fail2ban not running"
fail2ban-client status sshd &>/dev/null       && ok "SSH jail active"            || fail "SSH jail not active"

hdr "Crowdsec"
docker ps --filter "name=crowdsec" --format '{{.Names}}' | grep -q crowdsec \
                                               && ok "Crowdsec container running"  || fail "Crowdsec container not running"
docker exec crowdsec cscli collections list 2>/dev/null | grep -q "crowdsecurity/nginx" \
                                               && ok "Nginx collection installed"  || fail "Nginx collection missing"
docker exec crowdsec cscli bouncers list 2>/dev/null | grep -q "nginx" \
                                               && ok "Nginx bouncer registered"    || fail "Nginx bouncer not registered"

hdr "Docker Daemon"
docker info 2>/dev/null | grep -q "userns"    && ok "User namespace remapping enabled" || fail "User namespace remapping NOT enabled"
ICC=$(docker network inspect bridge --format '{{.Options}}' 2>/dev/null)
[[ "$ICC" =~ "com.docker.network.bridge.enable_icc:false" ]] \
                                               && ok "ICC disabled"               || fail "ICC (inter-container communication) not disabled"

hdr "Unattended Upgrades"
systemctl is-active unattended-upgrades &>/dev/null \
                                               && ok "Unattended upgrades running" || fail "Unattended upgrades not running"
[[ -f /etc/apt/apt.conf.d/20auto-upgrades ]]  && ok "Auto-upgrade config present" || fail "Auto-upgrade config missing"

hdr "Auditd"
systemctl is-active auditd &>/dev/null        && ok "Auditd running"             || fail "Auditd not running"
auditctl -l 2>/dev/null | grep -q "sudoers"   && ok "Sudoers audit rule active"  || fail "Sudoers audit rule missing"

hdr "Nginx"
systemctl is-active nginx &>/dev/null         && ok "Nginx service running"       || fail "Nginx not running"
nginx -t 2>/dev/null                          && ok "Nginx config valid"          || fail "Nginx config test failed"
curl -sk https://mystackmint.com -o /dev/null -w "%{http_code}" | grep -qE "^[23]" \
                                               && ok "Root domain reachable over HTTPS" || fail "Root domain not reachable"

hdr "Authelia"
docker ps --filter "name=authelia" --format '{{.Names}}' | grep -q authelia \
                                               && ok "Authelia container running" || fail "Authelia container not running"
curl -sk https://auth.mystackmint.com/api/health -o /dev/null -w "%{http_code}" | grep -q "200" \
                                               && ok "Authelia health endpoint OK" || fail "Authelia health check failed"

hdr "Backups"
[[ -f /root/.env.backup ]]                    && ok "/root/.env.backup exists"   || fail "/root/.env.backup missing"
chmod_val=$(stat -c "%a" /root/.env.backup 2>/dev/null || echo "000")
[[ "$chmod_val" == "600" ]]                   && ok "/root/.env.backup is 600"   || fail "/root/.env.backup not chmod 600"
crontab -l 2>/dev/null | grep -q "backup.sh"  && ok "Backup cron job registered" || fail "Backup cron not found — add to crontab"

echo ""
echo "======================================"
printf "  Results: %d passed, %d failed\n" "$PASS" "$FAIL"
echo "======================================"

[[ $FAIL -eq 0 ]] && echo "  All checks passed." || echo "  Fix the FAIL items above and re-run."
exit "$FAIL"
