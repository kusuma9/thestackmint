# Traefik v3 — Reverse Proxy & SSL

Entry point for all traffic. Issues a wildcard `*.mystackmint.com` certificate via Cloudflare DNS challenge. CrowdSec blocks threat intelligence IPs globally on the `websecure` entrypoint.

## First-time setup

```bash
# 1. Create the shared Docker network (once per server)
docker network create traefik-public

# 2. Fix acme.json permissions — Traefik refuses to start without this
chmod 600 acme.json

# 3. Deploy CrowdSec first so the bouncer API key is ready
cd ../infra/crowdsec
cp .env.example .env
# Edit .env: set CROWDSEC_BOUNCER_API_KEY to a strong random value
#   openssl rand -hex 32
docker compose up -d

# 4. Copy and fill Traefik secrets
cd ../../traefik
cp .env.example .env
# Edit .env: set CF_DNS_API_TOKEN, TRAEFIK_DASHBOARD_USERS, CROWDSEC_BOUNCER_API_KEY
# (CROWDSEC_BOUNCER_API_KEY must match what you set in infra/crowdsec/.env)

# 5. Deploy Traefik
docker compose up -d

# 6. Verify SSL + routing
curl -I https://test.mystackmint.com
# Expect: HTTP/2 200
```

## Generate dashboard credentials

```bash
# htpasswd installed locally
htpasswd -nb admin 'your_password'

# OR via Docker (no htpasswd needed)
docker run --rm httpd:2.4-alpine htpasswd -nb admin 'your_password'
```

Paste the output into `TRAEFIK_DASHBOARD_USERS` in `.env`. In the `.env` file, replace every `$` with `$$`.

## Verify dashboard

Visit `https://traefik.mystackmint.com` — requires Tailscale VPN + basic auth credentials.

## Removing the test container

Once routing is confirmed, remove the `whoami` service from `docker-compose.yml` and run `docker compose up -d`.

## Adding a new service

Every new service needs these labels (minimum):

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.<name>.rule=Host(`subdomain.mystackmint.com`)"
  - "traefik.http.routers.<name>.entrypoints=websecure"
  - "traefik.docker.network=traefik-public"
```

To add Authelia SSO (1FA):
```yaml
  - "traefik.http.routers.<name>.middlewares=authelia@file,security-headers@file"
```

To require 2FA (vault, admin panels):
```yaml
  - "traefik.http.routers.<name>.middlewares=authelia-2fa@file,security-headers@file"
```

To restrict to Tailscale + 2FA (infra tools):
```yaml
  - "traefik.http.routers.<name>.middlewares=admin-only@file,security-headers@file"
```

## CrowdSec

CrowdSec is applied globally — every HTTPS request passes through the bouncer before reaching any service. It reads Traefik access logs from the `traefik-logs` named Docker volume.

To check CrowdSec decisions:
```bash
docker exec crowdsec cscli decisions list
```

To add a manual ban:
```bash
docker exec crowdsec cscli decisions add --ip 1.2.3.4 --duration 24h --reason "manual"
```
