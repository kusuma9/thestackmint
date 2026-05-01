# Backup System — Restic → Hetzner Object Storage

Encrypted daily backups of all Docker volumes and compose configs.
Retention: 7 daily, 4 weekly, 3 monthly snapshots.
Alerts via self-hosted Ntfy (`backup-alerts` topic).

## Setup

```bash
# 1. Install dependencies
apt-get install -y restic jq

# 2. Copy and fill the backup env file (root-only)
cp .env.backup.example /root/.env.backup
chmod 600 /root/.env.backup
# Edit: set RESTIC_REPOSITORY, RESTIC_PASSWORD, AWS_*, and confirm NTFY_URL

# 3. Install cron jobs + logrotate (run as root)
bash install-cron.sh

# 4. Test — run backup manually first
bash backup.sh

# 5. Confirm snapshot was created
source /root/.env.backup && restic snapshots
```

## Restore

```bash
# Interactive restore to /srv/restore
bash restore.sh

# Restore to a custom path
bash restore.sh /tmp/restore-test
```

## Weekly integrity check

Runs automatically via cron every Sunday at 03:00.

```bash
# Run manually
bash verify.sh
```

## What is backed up

| Included | Excluded |
|----------|----------|
| All Docker named volumes (`/var/lib/docker/volumes`) | Jellyfin cache volume (`jellyfin_jellyfin_cache`) |
| All compose configs (`/srv/mystackmint`) | Hetzner Volume raw media (`/media`) |

Raw media (movies, TV, music) lives on a separate Hetzner Volume at `/media` and is excluded — it is too large to back up with restic. Only metadata (Jellyfin config, Navidrome DB) is backed up.

## Ntfy alerts

Requires `infra/ntfy/` to be deployed first. The backup env points to `https://ntfy.mystackmint.com/backup-alerts`. Deploy Ntfy, then subscribe to `backup-alerts` on your phone to receive backup success/failure notifications.
