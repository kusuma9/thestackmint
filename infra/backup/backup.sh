#!/usr/bin/env bash
# Daily backup: Docker volumes + compose configs → Hetzner Object Storage via restic
# Cron: 0 2 * * * /srv/mystackmint/infra/backup/backup.sh >> /var/log/mystackmint-backup.log 2>&1
set -euo pipefail

ENV_FILE="/root/.env.backup"
LOG_PREFIX="[$(date '+%Y-%m-%d %H:%M:%S')] BACKUP"

# ---------------------------------------------------------------------------
# Load secrets
# ---------------------------------------------------------------------------
if [[ ! -f "$ENV_FILE" ]]; then
  echo "$LOG_PREFIX ERROR: $ENV_FILE not found. Copy .env.backup.example → $ENV_FILE and fill values." >&2
  exit 1
fi
# shellcheck source=/dev/null
source "$ENV_FILE"

: "${RESTIC_REPOSITORY:?Missing RESTIC_REPOSITORY in $ENV_FILE}"
: "${RESTIC_PASSWORD:?Missing RESTIC_PASSWORD in $ENV_FILE}"
: "${AWS_ACCESS_KEY_ID:?Missing AWS_ACCESS_KEY_ID in $ENV_FILE}"
: "${AWS_SECRET_ACCESS_KEY:?Missing AWS_SECRET_ACCESS_KEY in $ENV_FILE}"
: "${NTFY_URL:?Missing NTFY_URL in $ENV_FILE}"
: "${NTFY_TOPIC:?Missing NTFY_TOPIC in $ENV_FILE}"

export RESTIC_REPOSITORY RESTIC_PASSWORD AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY

notify() {
  local title="$1" msg="$2" priority="${3:-default}"
  curl -s -X POST "$NTFY_URL/$NTFY_TOPIC" \
    -H "Title: $title" \
    -H "Priority: $priority" \
    -d "$msg" > /dev/null || true
}

# ---------------------------------------------------------------------------
# Initialise repository if first run
# ---------------------------------------------------------------------------
if ! restic snapshots > /dev/null 2>&1; then
  echo "$LOG_PREFIX Initialising restic repository..."
  restic init
fi

# ---------------------------------------------------------------------------
# Run backup
# ---------------------------------------------------------------------------
echo "$LOG_PREFIX Starting backup..."
START_TIME=$(date +%s)

restic backup \
  /var/lib/docker/volumes \
  /srv/mystackmint \
  --exclude "/var/lib/docker/volumes/jellyfin_jellyfin_cache" \
  --exclude "/media" \
  --tag "mystackmint" \
  --tag "$(date '+%Y-%m-%d')"

BACKUP_EXIT=$?
END_TIME=$(date +%s)
DURATION=$(( END_TIME - START_TIME ))

if [[ $BACKUP_EXIT -ne 0 ]]; then
  echo "$LOG_PREFIX ERROR: backup failed (exit $BACKUP_EXIT)"
  notify "Backup FAILED" "mystackmint backup failed after ${DURATION}s. Check /var/log/mystackmint-backup.log" "urgent"
  exit $BACKUP_EXIT
fi

# ---------------------------------------------------------------------------
# Apply retention policy: 7 daily, 4 weekly, 3 monthly
# ---------------------------------------------------------------------------
echo "$LOG_PREFIX Applying retention policy..."
restic forget \
  --keep-daily 7 \
  --keep-weekly 4 \
  --keep-monthly 3 \
  --prune \
  --tag "mystackmint"

echo "$LOG_PREFIX Backup complete in ${DURATION}s."
SNAPSHOT_COUNT=$(restic snapshots --tag mystackmint --json 2>/dev/null | jq 'length' 2>/dev/null || echo "?")
notify "Backup OK" "mystackmint backup completed in ${DURATION}s. Total snapshots: ${SNAPSHOT_COUNT}" "low"
