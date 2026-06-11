# CLAUDE.md

This file provides guidance to AI assistants when working with code in this repository.

## Project Overview

**MyStackMint.com** is a self-hosted SaaS platform across **two VPS servers**. Each service is a Docker Compose stack. **Coolify manages Traefik** on each server as the reverse proxy — there is no Nginx on the host. The unified homepage (`homepage/`) is the only custom-developed frontend.

## Server Overview

| VPS | IP | SSH Key | Purpose |
|-----|----|---------|---------|
| **Hetzner** (Ubuntu 24.04) | `77.42.127.150` | `C:\SSH\id_ed25519` | SaaS apps, AI agents, admin tools |
| **Contabo** (Ubuntu 24.04) | `13.140.158.27` | `C:\SSH\contabo` | Media & storage-heavy OSS apps |

### What runs where

| Service | VPS | Subdomain |
|---------|-----|-----------|
| Homepage | Hetzner | `mystackmint.com` |
| Authelia SSO | Hetzner | `auth.*` |
| Portainer | Hetzner | `portainer.*` |
| Adminer | Hetzner | `db.*` |
| Jellyfin | Hetzner | `jellyfin.*` |
| Navidrome | Hetzner | `music.*` |
| Immich | Hetzner | `photos.*` |
| Hermes AI agent | Hetzner | `hermes.*` |
| Beszel (hub + agent) | Hetzner | `monitor.*` |
| Uptime Kuma | Hetzner | `uptime.*` |
| Beszel agent | Contabo | — (port 45876, Hetzner-only via ufw) |
| Personal SaaS apps | Hetzner | `<app>.*` |
| Future OSS/media apps | Contabo | `<app>.*` |

## Working with the Infrastructure

All infrastructure lives at `/srv/mystackmint/` on each VPS, mirroring this repo's structure.

**SSH into Hetzner:**
```powershell
ssh -i C:\SSH\id_ed25519 root@77.42.127.150
```

**SSH into Contabo:**
```powershell
ssh -i C:\SSH\contabo -p 2222 root@13.140.158.27
```

**Deploy a stack:**
```bash
cd /srv/mystackmint/<service>/
docker compose up -d
docker compose logs -f
docker compose ps
```

**Update a running stack:**
```bash
docker compose pull && docker compose up -d
```

**Sync a local file change to Hetzner:**
```powershell
scp -i C:\SSH\id_ed25519 "local\path\file" "root@77.42.127.150:/srv/mystackmint/path/file"
```

**Sync a local file change to Contabo:**
```powershell
scp -i C:\SSH\contabo -P 2222 "local\path\file" "root@13.140.158.27:/srv/mystackmint/path/file"
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
cd /srv/mystackmint/homepage
docker compose build --no-cache && docker compose up -d
```

**Adding a tool:** edit `homepage/src/tools.config.ts` — one object per tool (`id`, `name`, `description`, `url`, `icon`, `category`, `section`, `tags[]`, optional `adminOnly`). Rebuild the Docker image after changes.

## Architecture

### Traffic Flow
```
Browser → Cloudflare (DNS + DDoS proxy) → Hetzner VPS :443  → Traefik (coolify-proxy) → Docker container
                                        → Contabo VPS :443  → Traefik (coolify-proxy) → Docker container
```
DNS A records in Cloudflare determine which VPS each subdomain routes to.

### Traefik via Coolify
Traefik (`coolify-proxy`) is managed by Coolify and holds ports 80/443. Services are discovered via Docker labels. **There is no Nginx on the host.**

Every service that Traefik routes to must:
1. Be on the `coolify` Docker network
2. Have `traefik.enable=true` label
3. Have `traefik.docker.network=coolify` label — **required for all services on multiple networks**, otherwise Traefik may pick the wrong network IP and return 504
4. Have router, TLS, and service labels
5. Have `traefik.http.routers.<name>.middlewares=authelia@docker` for auth-protected routes

**Standard Traefik label block:**
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.<name>.rule=Host(`<subdomain>.mystackmint.com`)"
  - "traefik.http.routers.<name>.entrypoints=https"
  - "traefik.http.routers.<name>.tls=true"
  - "traefik.http.routers.<name>.tls.certresolver=letsencrypt"
  - "traefik.http.services.<name>.loadbalancer.server.port=<internal-port>"
  - "traefik.http.routers.<name>.middlewares=authelia@docker"
  - "traefik.docker.network=coolify"
```

### Port Map
| Host Port | Service | Internal Port |
|-----------|---------|--------------|
| — | homepage | 80 (Traefik only, no host port) |
| 8001 | authelia | 9091 |
| 8018 | portainer | 9000 |
| 8023 | adminer | 8080 |
| 8025 | beszel | 8090 (127.0.0.1 only) |
| 8026 | uptime-kuma | 3001 (127.0.0.1 only) |

### Server Directory Structure
```
/srv/mystackmint/
├── homepage/             # Astro static site at root domain
├── saas/                 # SaaS: umami/, template/, new-saas-app.sh
├── infra/                # authelia, portainer, adminer
├── media/                # jellyfin, navidrome, immich
├── monitoring/           # beszel (hub+agent), uptime-kuma; beszel-agent/ on Contabo
└── scripts/              # harden.sh, verify-security.sh, setup-*.sh
```

### Docker Networks
| Network | Purpose |
|---------|---------|
| `saas-net` | Isolated to SaaS projects |
| `infra-net` | Isolated to Authelia, Portainer, Adminer |
| `coolify` | Traefik routing network — all services must join this |

Create all networks once: `bash scripts/setup-docker-networks.sh`

DB and Redis containers have **no `ports:` section** — reachable only by services on the same Docker network.

### Subdomain Map
| Subdomain | App | VPS | Access |
|-----------|-----|-----|--------|
| `mystackmint.com` | Homepage | Hetzner | Public |
| `auth.*` | Authelia SSO | Hetzner | Public (login page) |
| `portainer.*` | Portainer | Hetzner | Admin + 2FA |
| `db.*` | Adminer | Hetzner | Admin + 2FA |
| `analytics.*` | Umami | Hetzner | Admin + 2FA |
| `hermes.*` | Hermes AI agent | Hetzner | Admin + 2FA |
| `jellyfin.*` | Jellyfin Media Server | Hetzner | Jellyfin own auth |
| `music.*` | Navidrome | Hetzner | Navidrome own auth |
| `photos.*` | Immich | Hetzner | Immich own auth |
| `monitor.*` | Beszel | Hetzner | Admin + 2FA |
| `uptime.*` | Uptime Kuma | Hetzner | Admin + 2FA |

## Hetzner Storage Box

Media storage for Navidrome and Immich is provided by a **Hetzner Storage Box** (1TB, `u589391.your-storagebox.de`, port 23), mounted on the Hetzner VPS via rclone SFTP.

### Mount points on Hetzner VPS
| Mount | Storage Box path | Used by |
|-------|-----------------|---------|
| `/mnt/storagebox/music` | `/Music` | Navidrome |
| `/mnt/storagebox/media` | `/Media` | Immich upload + external libraries |

### systemd services (auto-start on boot)
```bash
systemctl status rclone-storagebox-music
systemctl status rclone-storagebox-media
```

## Home Laptop Media Mount (Jellyfin)

Jellyfin media is served from the **home laptop** (`desktop-2a2oj5t`, Tailscale IP `100.119.69.2`) — its `G:` drive is mounted read-only on the Hetzner VPS at `/mnt/homelaptop` via rclone SFTP over Tailscale (`rclone-homelaptop.service`). **Playback only works while the laptop is on and connected to Tailscale.**

| Container path | Laptop folder |
|----------------|---------------|
| `/media/movies` | `G:\Movies` |
| `/media/series` | `G:\ShowSeries` |
| `/media/music` | `G:\Audio` |
| `/media/videosongs` | `G:\VideoSongs` |
| `/media/comedies` | `G:\Comedies` |

A watchdog (`rclone-homelaptop-watchdog.timer`, every 2 min, runs `scripts/rclone-watchdog.sh`) clears stale FUSE mounts and restarts the mount service, so it self-heals within ~2 minutes of the laptop coming back online. The mount uses aggressive rclone timeouts so reads **fail fast** instead of hanging Jellyfin when the laptop is off. Unit files are tracked in `media/jellyfin/`.

```bash
systemctl status rclone-homelaptop
systemctl list-timers rclone-homelaptop-watchdog.timer
```

Laptop-side requirements: Tailscale set to "Run unattended", SSH server auto-start, never sleep on AC power.

### Upload music/photos to Storage Box (from Windows)
WinSCP or any SFTP client:
- Host: `u589391.your-storagebox.de` | Port: `23` | User: `u589391`
- Drop music under `/Music/` — Navidrome scans every hour
- Drop photos under `/Media/Photos/` or `/Media/FamilyVideos/`

### Immich external libraries
Immich has the full Storage Box mounted read-only at `/mnt/storagebox` inside the container.
Add new photo folders via **Administration → Libraries** in the Immich UI — no compose edits needed.
Paths to use: `/mnt/storagebox/media/Photos`, `/mnt/storagebox/media/FamilyVideos`, etc.

## Key Patterns

**Authelia groups:**
- `admins` — everything, 2FA always

**Secrets rule:** `.env` files are never committed. Every stack has `.env.example` with all required keys. The `.gitignore` excludes all `.env` files.

**New SaaS app:**
```bash
bash saas/new-saas-app.sh myapp
# → creates saas/myapp/ with all APP_NAME placeholders replaced
```

## Deployment Notes
- Coolify manages Traefik — do not install or configure Nginx
- Always add `traefik.docker.network=coolify` to any service on more than one Docker network
- Homepage has no host port binding — it routes through Traefik only
- Authelia middleware is defined on the `authelia` container itself via Docker labels and referenced as `authelia@docker` by all protected services
