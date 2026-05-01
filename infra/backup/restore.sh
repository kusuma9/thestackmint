#!/usr/bin/env bash
# Interactive restore from restic snapshot
set -euo pipefail

ENV_FILE="/root/.env.backup"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: $ENV_FILE not found." >&2
  exit 1
fi
# shellcheck source=/dev/null
source "$ENV_FILE"
export RESTIC_REPOSITORY RESTIC_PASSWORD AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY

RESTORE_TARGET="${1:-/srv/restore}"

echo "============================================"
echo " MyStackMint — Restic Restore"
echo "============================================"
echo ""
echo "Available snapshots:"
restic snapshots --tag mystackmint
echo ""

read -rp "Enter snapshot ID to restore (or 'latest'): " SNAPSHOT_ID

echo ""
echo "WARNING: This will restore to: $RESTORE_TARGET"
echo "         Existing files at that path will be overwritten."
read -rp "Continue? [y/N]: " CONFIRM

if [[ "${CONFIRM,,}" != "y" ]]; then
  echo "Aborted."
  exit 0
fi

mkdir -p "$RESTORE_TARGET"

echo ""
echo "Restoring snapshot $SNAPSHOT_ID to $RESTORE_TARGET ..."
restic restore "$SNAPSHOT_ID" --target "$RESTORE_TARGET"

echo ""
echo "Restore complete. Files are in: $RESTORE_TARGET"
echo ""
echo "Next steps:"
echo "  1. Review restored files in $RESTORE_TARGET"
echo "  2. Stop running containers:  docker compose down"
echo "  3. Copy Docker volumes:      cp -a $RESTORE_TARGET/var/lib/docker/volumes/. /var/lib/docker/volumes/"
echo "  4. Copy compose configs:     cp -a $RESTORE_TARGET/srv/mystackmint/. /srv/mystackmint/"
echo "  5. Fix permissions:          chmod 600 /srv/mystackmint/traefik/acme.json"
echo "  6. Restart containers:       docker compose up -d"
