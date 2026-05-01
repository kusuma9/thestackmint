#!/usr/bin/env bash
# Verify restic repository integrity without doing a full restore
set -euo pipefail

ENV_FILE="/root/.env.backup"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: $ENV_FILE not found." >&2
  exit 1
fi
# shellcheck source=/dev/null
source "$ENV_FILE"
export RESTIC_REPOSITORY RESTIC_PASSWORD AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY

: "${NTFY_URL:?}" "${NTFY_TOPIC:?}"

notify() {
  curl -s -X POST "$NTFY_URL/$NTFY_TOPIC" \
    -H "Title: $1" \
    -H "Priority: ${3:-default}" \
    -d "$2" > /dev/null || true
}

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting integrity check..."
restic check --with-cache

CHECK_EXIT=$?
if [[ $CHECK_EXIT -ne 0 ]]; then
  notify "Backup Integrity FAILED" "restic check returned errors. Repository may be corrupt. Run: restic check --read-data" "urgent"
  echo "INTEGRITY CHECK FAILED." >&2
  exit $CHECK_EXIT
fi

LATEST=$(restic snapshots --tag mystackmint --latest 1 --json 2>/dev/null \
  | jq -r '.[0].time[:19] // "none"' 2>/dev/null || echo "unknown")

echo "Integrity check passed. Latest snapshot: $LATEST"
notify "Backup Integrity OK" "Repository integrity check passed. Latest snapshot: $LATEST" "low"
