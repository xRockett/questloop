#!/usr/bin/env bash
set -euo pipefail

if [ -z "${DOMAIN:-}" ]; then echo "Please export DOMAIN=yourdomain.com"; exit 1; fi
if [ -z "${ACME_EMAIL:-}" ]; then echo "Please export ACME_EMAIL=you@example.com"; exit 1; fi

# Install Docker
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker $USER || true
fi

# Install compose plugin
if ! docker compose version >/dev/null 2>&1; then
  sudo apt-get update && sudo apt-get install -y docker-compose-plugin
fi

# Create .env from template if not present
if [ ! -f api/.env ]; then
  cp api/.env.example api/.env
  sed -i "s/YOUR_DOMAIN/${DOMAIN}/g" api/.env
  sed -i "s#https://YOUR_DOMAIN#https://${DOMAIN}#g" api/.env
fi

# Ensure NEXT_PUBLIC_API_URL uses api subdomain
sed -i "s|NEXT_PUBLIC_API_URL:.*|NEXT_PUBLIC_API_URL: \"https://api.${DOMAIN}\"|g" docker-compose.prod.yml

# Build & up
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

echo "Deployment started. Ensure your DNS has A records:"
echo "  @ -> your VPS IP"
echo "  api -> your VPS IP"
echo "Caddy will issue HTTPS automatically."
