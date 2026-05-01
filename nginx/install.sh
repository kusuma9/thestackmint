#!/usr/bin/env bash
# Deploy Nginx + SSL configs from repo to the host machine
# Run as root on the VPS after: apt install nginx certbot python3-certbot-dns-cloudflare
set -euo pipefail

[[ $EUID -ne 0 ]] && { echo "Run as root: sudo bash install.sh"; exit 1; }

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"

# 1. WebSocket upgrade map (http context — must be in conf.d, not snippets)
cp "$REPO_DIR/conf.d/websocket-upgrade.conf" /etc/nginx/conf.d/
echo "[OK] WebSocket map → /etc/nginx/conf.d/"

# 2. Install snippets
mkdir -p /etc/nginx/snippets
cp "$REPO_DIR/snippets/"*.conf /etc/nginx/snippets/
echo "[OK] Snippets → /etc/nginx/snippets/"

# 3. Install + enable site configs
mkdir -p /etc/nginx/sites-available
for conf in "$REPO_DIR/sites-available/"*; do
  name=$(basename "$conf")
  cp "$conf" /etc/nginx/sites-available/"$name"
  ln -sf /etc/nginx/sites-available/"$name" /etc/nginx/sites-enabled/"$name"
  echo "[OK] Enabled: $name"
done

# 4. Remove default nginx site if it exists
[[ -L /etc/nginx/sites-enabled/default ]] && rm /etc/nginx/sites-enabled/default && echo "[OK] Removed default site"

# 5. Test and reload
nginx -t && systemctl reload nginx
echo ""
echo "Nginx configs deployed and reloaded."
echo ""
echo "Next: issue the wildcard SSL cert if not already done:"
echo "  chmod 600 /etc/cloudflare.ini"
echo "  certbot certonly --dns-cloudflare \\"
echo "    --dns-cloudflare-credentials /etc/cloudflare.ini \\"
echo "    --email satish.technology9@gmail.com --agree-tos --no-eff-email \\"
echo "    -d 'mystackmint.com' -d '*.mystackmint.com'"
echo "  systemctl reload nginx"
