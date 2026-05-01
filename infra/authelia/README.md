# Authelia — SSO + 2FA

Single sign-on at `https://auth.mystackmint.com`. One login covers all apps; 2FA required for admin tools and Vaultwarden.

## First-time setup

```bash
# 1. Generate secrets (run openssl rand -hex 32 three times)
openssl rand -hex 32  # → AUTHELIA_JWT_SECRET
openssl rand -hex 32  # → AUTHELIA_SESSION_SECRET
openssl rand -hex 32  # → AUTHELIA_STORAGE_ENCRYPTION_KEY

# 2. Copy and fill .env
cp .env.example .env
# Edit .env: paste the three secrets above
# Also set AUTHELIA_NOTIFIER_SMTP_PASSWORD (Gmail App Password)
# or switch configuration.yml to the filesystem notifier if email isn't ready

# 3. Hash passwords for each user
docker run --rm authelia/authelia:4.38 \
  authelia crypto hash generate argon2 --password 'your_password_here'
# Paste the Digest output into users_database.yml

# 4. Deploy (Traefik must already be running)
docker compose up -d

# 5. Verify
curl https://auth.mystackmint.com/api/health
# Expect: {"status":"OK"}
```

## Adding a user

```bash
bash add-user.sh <username> <group>
# group: admins | family | kids | guests
# Prints the YAML block — paste it into users_database.yml
```

Authelia hot-reloads `users_database.yml` (`watch: true`) — no restart needed.

## Adding Authelia protection to a new service

```yaml
# 1FA (most family apps)
- "traefik.http.routers.<name>.middlewares=authelia@file,security-headers@file"

# 2FA (vault, sensitive services)
- "traefik.http.routers.<name>.middlewares=authelia-2fa@file,security-headers@file"

# Tailscale + 2FA (infra tools)
- "traefik.http.routers.<name>.middlewares=admin-only@file,security-headers@file"
```

Middlewares are defined in `traefik/config/middlewares.yml`.

## SMTP notifier

Email is used for password resets and TOTP enrollment. The default configuration uses Gmail SMTP. Set `AUTHELIA_NOTIFIER_SMTP_PASSWORD` in `.env` to a Gmail App Password (myaccount.google.com/apppasswords).

If you don't have SMTP ready yet, switch to the filesystem notifier in `configuration.yml`:
1. Comment out the `smtp:` block
2. Uncomment `filesystem:` block
3. `docker compose up -d` to reload

## Access control groups

| Group | Access |
|-------|--------|
| `admins` | Everything, 2FA always |
| `family` | All personal apps, 2FA for vault |
| `kids` | Jellyfin + Kavita + Navidrome only |
| `guests` | Jellyfin only |

Admin infra tools (`traefik`, `git`, `ci`, `portainer`, `glances`, `analytics`) are additionally restricted to Tailscale IPs by Traefik — Authelia is a second layer.
