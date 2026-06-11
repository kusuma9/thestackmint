#!/usr/bin/env bash
# Watchdog for the rclone homelaptop mount. If listing the mount hangs or
# fails, clear the stale FUSE mount and restart the service so it self-heals
# once the laptop is reachable again.
set -u

MOUNT=/mnt/homelaptop
SERVICE=rclone-homelaptop

if timeout 10 ls "$MOUNT" >/dev/null 2>&1; then
    exit 0
fi

echo "$(date -Is) mount check failed, restarting $SERVICE" | systemd-cat -t rclone-watchdog -p warning
fusermount -uz "$MOUNT" 2>/dev/null
systemctl restart "$SERVICE"
