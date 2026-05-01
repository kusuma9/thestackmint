#!/usr/bin/env bash
# Add a new user to Authelia — prints the YAML block to paste into users_database.yml
set -euo pipefail

USERNAME=${1:?"Usage: $0 <username> <group>"}
GROUP=${2:?"Usage: $0 <username> <group>"}

case "$GROUP" in
  admins|family|kids|guests) ;;
  *) echo "Error: group must be one of: admins, family, kids, guests"; exit 1 ;;
esac

read -rsp "Password for $USERNAME: " PASSWORD
echo

HASH=$(docker run --rm authelia/authelia:4.38 \
  authelia crypto hash generate argon2 --password "$PASSWORD" 2>/dev/null \
  | grep -oP '(?<=Digest: ).+')

if [[ -z "$HASH" ]]; then
  echo "Error: failed to generate password hash" >&2
  exit 1
fi

cat <<EOF

Paste the following into infra/authelia/users_database.yml under "users:":

  ${USERNAME}:
    displayname: "${USERNAME^}"
    password: "${HASH}"
    email: ${USERNAME}@mystackmint.com
    groups:
      - ${GROUP}

EOF
