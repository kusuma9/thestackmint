# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MyStackMint.com** is a self-hosted personal & SaaS platform on a Hetzner VPS (Ubuntu 24.04). Each service is a Docker Compose stack. **Nginx is installed on the host** (not in Docker) as the reverse proxy. The unified homepage (`homepage/`) is the only custom-developed frontend.

Reference documents in `G:\Development\Claude\HomeLab\Docs\`:
- `mystackmint-execution-plan.html` — original 6-prompt execution plan
- Second document — security enhancements, roles/groups, Git strategy, 4 additional prompts (7–10)

## Working with the Infrastructure

All infrastructure lives on the Hetzner VPS at `/srv/mystackmint/` mirroring this repo's structure.

**First-time server setup (run in order):**
```bash
apt install nginx certbot python3-certbot-dns-cloudflare
bash scripts/setup-docker-networks.sh   # create the 3 Docker networks
bash scripts/harden.sh                  # security hardening
bash scripts/setup-tailscale.sh         # VPN for admin access
# Issue wildcard SSL cert first:
chmod 600 /etc/cloudflare.ini
certbot certonly --dns-cloudflare \
  --dns-cloudflare-credentials /etc/cloudflare.ini \
  --email satish.technology9@gmail.com --agree-tos --no-eff-email \
  -d 'mystackmint.com' -d '*.mystackmint.com'
# Deploy nginx configs:
cd nginx && sudo bash install.sh
# Start core services:
cd infra/authelia && cp .env.example .env && docker compose up -d
cd infra/backup && bash backup.sh       # first manual backup test
```

**Deploy a stack:**
```bash
cd /srv/mystackmint/<service>/
docker compose up -d
docker compose logs -f     # watch startup
docker compose ps          # verify running
```

**Restart / pull updates:**
```bash
docker compose pull && docker compose up -d
```

**Validate a compose file:**
```bash
docker compose config
```

**Verify security posture:**
```bash
bash scripts/verify-security.sh
```

## Unified Homepage (Astro)

Located at `homepage/`. Dev commands run locally before building the Docker image.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production static build
npm run preview    # preview build locally
```

**Docker deploy:**
```bash
docker compose build --no-cache && docker compose up -d
```

**Adding a tool:** edit `homepage/src/tools.config.ts` — one object per tool (`id`, `name`, `description`, `url`, `icon`, `category`, `tags[]`, optional `adminOnly`). No other file changes needed.

## Architecture

### Traffic Flow
```
Browser → Cloudflare (DNS + DDoS proxy) → Hetzner VPS :443 → Nginx (host) → 127.0.0.1:PORT → Docker container
```

Admin services additionally require **Tailscale VPN** (100.64.0.0/10 IP range enforced by `nginx/snippets/admin-auth.conf`).

### Nginx on Host
Nginx is installed via `apt install nginx`, **not** as a Docker container. Each service binds to a `127.0.0.1:PORT` on the host so only nginx can reach it.

Site configs live in `nginx/sites-available/` (one file per service). Deploy with:
```bash
sudo bash nginx/install.sh
```

SSL is a single wildcard cert (`*.mystackmint.com`) issued by certbot with the Cloudflare DNS plugin. All site configs reference the same cert via `include snippets/ssl.conf`.

### Port Map
| Host Port | Service | Internal Port |
|-----------|---------|--------------|
| 8000 | homepage | 80 |
| 8001 | authelia | 9091 |
| 8002 | uptime-kuma | 3001 |
| 8003 | ntfy | 80 |
| 8004 | vaultwarden | 80 |
| 8005 | nextcloud | 80 |
| 8006 | immich-server | 2283 |
| 8007 | jellyfin | 8096 |
| 8008 | navidrome | 4533 |
| 8009 | kavita | 5000 |
| 8010 | paperless | 8000 |
| 8011 | vikunja | 3456 |
| 8012 | actual-budget | 5006 |
| 8013 | mealie | 9000 |
| 8014 | grocy | 80 |
| 8015 | stirling-pdf | 8080 |
| 8016 | linkwarden | 3000 |
| 8017 | filebrowser | 80 |
| 8018 | portainer | 9000 |
| 8019 | gitea | 3000 |
| 8020 | woodpecker-server | 8000 |
| 8021 | glances | 61208 |
| 8022 | umami | 3000 |
| 8023 | adminer | 8080 |

### Server Directory Structure
```
/srv/mystackmint/
├── nginx/                # Host nginx configs (install.sh deploys to /etc/nginx/)
│   ├── sites-available/  # One file per service — source of truth
│   ├── snippets/         # ssl.conf, security-headers.conf, authelia-*.conf, etc.
│   └── conf.d/           # websocket-upgrade.conf (http-level map)
├── homepage/             # Astro static site at root domain
├── personal/             # Family apps: nextcloud, immich, jellyfin, vaultwarden,
│                         #   mealie, grocy, actual-budget, navidrome, kavita,
│                         #   stirling-pdf, linkwarden, vikunja, paperless-ngx,
│                         #   filebrowser
├── saas/                 # SaaS: template/, new-saas-app.sh, umami/ (analytics)
├── infra/                # authelia, uptime-kuma, gitea (+ woodpecker), ntfy,
│                         #   portainer, watchtower, glances, backup/, crowdsec/
└── scripts/              # harden.sh, verify-security.sh, setup-*.sh
```

### Docker Networks
| Network | Purpose |
|---------|---------|
| `personal-net` | Isolated to personal/family apps |
| `saas-net` | Isolated to SaaS projects + Umami |
| `infra-net` | Isolated to Authelia, Uptime Kuma, Gitea, Ntfy, Portainer |

Create all networks once: `bash scripts/setup-docker-networks.sh`

DB and Redis containers have **no `ports:` section** — they are only reachable by services on the same Docker network.

### Subdomain Map
| Subdomain | App | Access |
|-----------|-----|--------|
| `mystackmint.com` | Homepage | Public |
| `status.*` | Uptime Kuma | Public |
| `auth.*` | Authelia SSO | Public (login page) |
| `ntfy.*` | Ntfy | Public (native app auth) |
| `vault.*` | Vaultwarden | Family + 2FA |
| `cloud.*` | Nextcloud | Family |
| `photos.*` | Immich | Family |
| `media.*` | Jellyfin | Family + Kids + Guests |
| `music.*` | Navidrome | Family + Kids |
| `books.*` | Kavita | Family + Kids |
| `docs.*` | Paperless-NGX | Family |
| `tasks.*` | Vikunja | Family |
| `budget.*` | Actual Budget | Family |
| `recipes.*` | Mealie | Family |
| `home.*` | Grocy | Family |
| `pdf.*` | Stirling PDF | Family |
| `links.*` | Linkwarden | Family |
| `files.*` | Filebrowser | Family |
| `git.*` | Gitea | Admin + Tailscale + 2FA |
| `ci.*` | Woodpecker CI | Admin + Tailscale + 2FA |
| `portainer.*` | Portainer | Admin + Tailscale + 2FA |
| `glances.*` | Glances | Admin + Tailscale + 2FA |
| `analytics.*` | Umami | Admin + Tailscale + 2FA |
| `db.*` | Adminer | Admin + Tailscale + 2FA |

## Key Patterns

**Adding a new service to nginx:** create `nginx/sites-available/<name>` following the pattern in existing files, then run `sudo bash nginx/install.sh`.

**Nginx snippet reference:**
| Snippet | Use case |
|---------|----------|
| `snippets/ssl.conf` | Wildcard cert + TLS settings |
| `snippets/security-headers.conf` | CSP, HSTS, etc. — include in every server block |
| `snippets/proxy-params.conf` | Standard proxy headers + WebSocket support |
| `snippets/authelia-auth.conf` | Forward auth → Authelia (inside location block) |
| `snippets/authelia-location.conf` | Internal `/authelia` location (at server level) |
| `snippets/admin-auth.conf` | `allow 100.64.0.0/10; deny all;` — Tailscale only |

**Authelia groups:**
- `admins` — everything, 2FA always
- `family` — all personal apps, 2FA for vault
- `kids` — Jellyfin + Kavita only
- `guests` — Jellyfin read-only only

**Secrets rule:** `.env` files are never committed. Every stack has `.env.example` with all required keys documented. The `.gitignore` excludes all `.env` files.

**Git strategy:**
- **GitHub** — SaaS source code, Astro homepage
- **Gitea** (self-hosted, admin-only) — Docker Compose configs, Nginx/Authelia configs, scripts
- Conventional commits: `feat(service):`, `fix(service):`, `security(service):`

**New SaaS app:**
```bash
bash saas/new-saas-app.sh myapp
# → creates saas/myapp/ with all APP_NAME placeholders replaced
```

**Backup scope** (restic → Hetzner Object Storage, cron daily 2am + weekly verify):
- All Docker named volumes: `/var/lib/docker/volumes/`
- All compose configs: `/srv/mystackmint/`
- Excludes Jellyfin/Navidrome raw media (metadata only)

## Ntfy Alert Topics
| Topic | Trigger |
|-------|---------|
| `backup-alerts` | restic backup success/failure |
| `uptime-alerts` | Uptime Kuma downtime |
| `update-alerts` | Watchtower container updates |
| `security-alerts` | Fail2ban bans, new Authelia logins |
| `deploy-alerts` | Woodpecker CI deploy results |

## Deployment Priority Order
1. Nginx host install + wildcard SSL cert — nothing works without this
2. `infra/authelia/` — set up before any personal apps
3. `infra/backup/` — set up before adding real data
4. `homepage/` — Astro dashboard
5. `personal/vaultwarden/` — store all subsequent credentials here
6. `personal/immich/` — family photo backup
7. `personal/nextcloud/` — files, calendar, contacts
8. `infra/uptime-kuma/` — monitoring
9. `infra/ntfy/` — push notifications
10. `infra/portainer/` + `infra/watchtower/` — maintenance tooling
11. `infra/gitea/` — SaaS workflow (Phase 4)
12. Remaining personal apps + `saas/umami/`
