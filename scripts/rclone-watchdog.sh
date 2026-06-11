#!/usr/bin/env bash
# Watchdog for the rclone homelaptop mount. If listing the mount hangs or
# fails, clear the stale FUSE mount and restart the service so it self-heals
# once the laptop is reachable again.
set -u

MOUNT=/mnt/homelaptop
SERVICE=rclone-homelaptop

if timeout 10 ls "$MOUNT" >/dev/null 2>&1; then
    # Host mount is healthy, but the container may still hold a stale FUSE
    # reference from before a remount (docker binds don't propagate remounts).
    if ! timeout 10 docker exec jellyfin ls /media/movies >/dev/null 2>&1; then
        echo "$(date -Is) host mount OK but container view broken, restarting jellyfin" | systemd-cat -t rclone-watchdog -p warning
        docker restart jellyfin >/dev/null 2>&1
    fi
    exit 0
fi

echo "$(date -Is) mount check failed, restarting $SERVICE" | systemd-cat -t rclone-watchdog -p warning
fusermount -uz "$MOUNT" 2>/dev/null
systemctl restart "$SERVICE"
