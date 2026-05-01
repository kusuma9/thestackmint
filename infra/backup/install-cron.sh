#!/usr/bin/env bash
# Install backup cron jobs and logrotate config for root
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "$EUID" -ne 0 ]]; then
  echo "Error: must run as root" >&2
  exit 1
fi

# Make scripts executable
chmod +x "$SCRIPT_DIR/backup.sh" "$SCRIPT_DIR/restore.sh" "$SCRIPT_DIR/verify.sh"

# Add cron jobs if not already present
add_cron() {
  local job="$1"
  if crontab -l 2>/dev/null | grep -qF "${job##* }"; then
    echo "[exists] $job"
  else
    (crontab -l 2>/dev/null; echo "$job") | crontab -
    echo "[added]  $job"
  fi
}

add_cron "0 2 * * * $SCRIPT_DIR/backup.sh >> /var/log/mystackmint-backup.log 2>&1"
add_cron "0 3 * * 0 $SCRIPT_DIR/verify.sh >> /var/log/mystackmint-backup.log 2>&1"

# Install logrotate config
cp "$SCRIPT_DIR/logrotate.conf" /etc/logrotate.d/mystackmint-backup
echo "[installed] /etc/logrotate.d/mystackmint-backup"

echo ""
echo "Done. Verify cron jobs with: crontab -l"
