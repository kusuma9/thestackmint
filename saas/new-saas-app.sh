#!/usr/bin/env bash
# Create a new SaaS app from the template
# Usage: bash new-saas-app.sh <app-name>
#   e.g: bash new-saas-app.sh myapp
set -euo pipefail

TEMPLATE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/template" && pwd)"
SAAS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ---------------------------------------------------------------------------
# Validate input
# ---------------------------------------------------------------------------
if [[ $# -lt 1 ]]; then
  echo "Usage: bash new-saas-app.sh <app-name>"
  echo "       app-name must be lowercase letters, numbers, hyphens only"
  exit 1
fi

APP_NAME="$1"

if ! [[ "$APP_NAME" =~ ^[a-z0-9-]+$ ]]; then
  echo "ERROR: app-name must contain only lowercase letters, numbers, and hyphens."
  exit 1
fi

DEST_DIR="$SAAS_DIR/$APP_NAME"

if [[ -d "$DEST_DIR" ]]; then
  echo "ERROR: $DEST_DIR already exists. Choose a different name or delete it first."
  exit 1
fi

# ---------------------------------------------------------------------------
# Copy template and replace placeholders
# ---------------------------------------------------------------------------
echo "Creating SaaS app: $APP_NAME"
echo "Destination: $DEST_DIR"

cp -r "$TEMPLATE_DIR" "$DEST_DIR"

# Replace APP_NAME placeholder in all files
find "$DEST_DIR" -type f | while read -r file; do
  sed -i "s/APP_NAME/$APP_NAME/g" "$file"
done

# Rename any files named APP_NAME
find "$DEST_DIR" -name "*APP_NAME*" | while read -r file; do
  mv "$file" "$(echo "$file" | sed "s/APP_NAME/$APP_NAME/g")"
done

# ---------------------------------------------------------------------------
# Create web/ scaffold directory
# ---------------------------------------------------------------------------
mkdir -p "$DEST_DIR/web"
cat > "$DEST_DIR/web/Dockerfile" <<'DOCKERFILE'
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
DOCKERFILE

echo ""
echo "Done! App scaffold created at: $DEST_DIR"
echo ""
echo "Next steps:"
echo "  1. cd $DEST_DIR"
echo "  2. cp .env.example .env && nano .env   # fill in secrets"
echo "  3. Add your Next.js app code to web/"
echo "  4. docker compose build"
echo "  5. docker compose up -d"
echo "  6. Visit https://${APP_NAME}.mystackmint.com"
