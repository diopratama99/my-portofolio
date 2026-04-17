#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/porto-diopratama/webapp"
SERVICE_NAME="porto-diopratama"

cd "$APP_DIR"

echo "[1/4] Pull latest code"
git pull origin main

echo "[2/4] Install dependencies"
npm ci

echo "[3/4] Build production app"
npm run build

echo "[4/4] Restart service (Cloudflare Tunnel auto-relay)"
sudo systemctl restart "$SERVICE_NAME"
sudo systemctl status "$SERVICE_NAME" --no-pager

echo "✓ Deploy selesai. App live di https://diopratama.site"
