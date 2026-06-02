#!/usr/bin/env bash
# Create all required Docker networks on a fresh server
# Run this once before deploying any stacks.
set -euo pipefail

NETWORKS=(infra-net saas-net)

for net in "${NETWORKS[@]}"; do
  if docker network inspect "$net" &>/dev/null; then
    echo "[exists] $net"
  else
    docker network create "$net"
    echo "[created] $net"
  fi
done

echo ""
echo "All Docker networks ready."
