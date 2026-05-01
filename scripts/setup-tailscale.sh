#!/usr/bin/env bash
# Tailscale VPN setup for MyStackMint VPS
# Run after harden.sh. Admin services (Gitea, Woodpecker, Portainer, Traefik, Glances)
# are locked to Tailscale IP range 100.64.0.0/10 via the tailscale-only@file middleware.
set -euo pipefail

[[ $EUID -ne 0 ]] && { echo "Run as root"; exit 1; }

echo "Installing Tailscale..."
curl -fsSL https://tailscale.com/install.sh | sh

echo ""
echo "Starting Tailscale. You will be prompted to authenticate in a browser."
tailscale up --hostname=mystackmint --advertise-exit-node=false

TAILSCALE_IP=$(tailscale ip -4 2>/dev/null || echo "not connected yet")
echo ""
echo "========================================"
echo "  Tailscale IP: $TAILSCALE_IP"
echo "========================================"
echo ""
echo "Next steps:"
echo "  1. Install Tailscale on your laptop/phone from: https://tailscale.com/download"
echo "  2. Join the same Tailscale network (same account)"
echo "  3. Admin services are now accessible at their subdomains ONLY when connected to Tailscale:"
echo "     - https://traefik.mystackmint.com"
echo "     - https://git.mystackmint.com"
echo "     - https://ci.mystackmint.com"
echo "     - https://portainer.mystackmint.com"
echo "     - https://glances.mystackmint.com"
echo "     - https://db.mystackmint.com"
echo ""
echo "  The tailscale-only middleware in traefik/config/middlewares.yml"
echo "  restricts these to the Tailscale CGNAT range: 100.64.0.0/10"
echo ""
echo "  4. (Optional) Self-host the control server with Headscale:"
echo "     https://headscale.net — lets family join without Tailscale accounts"
