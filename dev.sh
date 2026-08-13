#!/usr/bin/env bash
#
# Brings the whole CoachLink stack up in one go:
#   Postgres (Docker) -> NestJS API (:3000) -> Ionic app (:5173)
#
#   ./dev.sh              local development in a desktop browser
#   ./dev.sh --tunnel     also expose the API on a public HTTPS URL and write it
#                         to mobile/.env, for testing on a physical device
#
# Why a tunnel and not the LAN IP: a device build blocks plain http:// (iOS ATS
# and Android cleartext policy), and neither exception is configured here. An
# HTTPS tunnel sidesteps both without touching native config.
#
# Ctrl-C stops the API, the app and the tunnel. Postgres is left running so the
# data survives between sessions; stop it with `cd backend && docker compose down`.
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NODE_VERSION="20.19.3"
API_URL="http://localhost:3000/api/v1"

USE_TUNNEL=false
[ "${1:-}" = "--tunnel" ] && USE_TUNNEL=true

# The repo's default `node` is too old for Vite/Nest, so pin the version here.
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "$HOME/.nvm/nvm.sh"
  nvm use "$NODE_VERSION" >/dev/null || {
    echo "✗ Node $NODE_VERSION not installed. Run: nvm install $NODE_VERSION"
    exit 1
  }
fi
echo "▸ node $(node --version)"

# ── Postgres ────────────────────────────────────────────────────────────────
if ! docker info >/dev/null 2>&1; then
  echo "✗ Docker isn't running. Start Docker Desktop and try again."
  exit 1
fi

echo "▸ starting Postgres…"
(cd "$ROOT/backend" && docker compose up -d >/dev/null)

printf '▸ waiting for Postgres'
for _ in $(seq 1 30); do
  if docker exec backend-postgres-1 pg_isready -U coachlink >/dev/null 2>&1; then break; fi
  printf '.'; sleep 1
done
echo ' ready'

# ── API ─────────────────────────────────────────────────────────────────────
cleanup() {
  echo
  echo "▸ stopping API, app and tunnel (Postgres left running)…"
  # Kill by port: npm doesn't forward signals to the process it spawned.
  lsof -ti:3000 -sTCP:LISTEN 2>/dev/null | xargs -r kill 2>/dev/null || true
  for port in 5173 5174 5175; do
    lsof -ti:$port -sTCP:LISTEN 2>/dev/null | xargs -r kill 2>/dev/null || true
  done
  pkill -f "cloudflared tunnel --url" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

lsof -ti:3000 -sTCP:LISTEN 2>/dev/null | xargs -r kill 2>/dev/null || true

echo "▸ starting API…"
(cd "$ROOT/backend" && npm run start:dev > /tmp/coachlink-backend.log 2>&1) &

printf '▸ waiting for API'
for _ in $(seq 1 60); do
  if curl -sf "$API_URL" >/dev/null 2>&1; then break; fi
  printf '.'; sleep 1
done

if ! curl -sf "$API_URL" >/dev/null 2>&1; then
  echo ' failed'
  echo "✗ API didn't come up. Last 30 lines of /tmp/coachlink-backend.log:"
  tail -30 /tmp/coachlink-backend.log
  exit 1
fi
echo ' ready'

echo
echo "  API   $API_URL   (logs: tail -f /tmp/coachlink-backend.log)"
echo "  OTP codes are printed to that log as well as emailed."

# ── Public HTTPS tunnel (device builds) ─────────────────────────────────────
if [ "$USE_TUNNEL" = true ]; then
  if ! command -v cloudflared >/dev/null 2>&1; then
    echo "✗ cloudflared not installed. Run: brew install cloudflared"
    exit 1
  fi

  pkill -f "cloudflared tunnel --url" 2>/dev/null || true
  rm -f /tmp/cloudflared.log
  echo
  echo "▸ opening public tunnel…"
  cloudflared tunnel --url "http://localhost:3000" > /tmp/cloudflared.log 2>&1 &

  TUNNEL_URL=""
  for _ in $(seq 1 30); do
    TUNNEL_URL=$(grep -oE "https://[a-z0-9-]+\.trycloudflare\.com" /tmp/cloudflared.log 2>/dev/null | head -1 || true)
    [ -n "$TUNNEL_URL" ] && break
    printf '.'; sleep 1
  done

  if [ -z "$TUNNEL_URL" ]; then
    echo " failed"
    echo "✗ Tunnel didn't come up. See /tmp/cloudflared.log"
    exit 1
  fi

  # Vite inlines this at build time, so the APK must be rebuilt after it changes.
  cat > "$ROOT/mobile/.env" <<EOF
# Written by dev.sh --tunnel. Baked in at BUILD time — rebuild after it changes.
VITE_API_BASE_URL=$TUNNEL_URL/api/v1
EOF

  echo
  echo "  Tunnel  $TUNNEL_URL/api/v1"
  echo "  ↳ written to mobile/.env"
  echo
  echo "  This URL changes every restart. To rebuild the APK against it:"
  echo "      cd mobile && npm run build && npx cap sync android \\"
  echo "        && cd android && JAVA_HOME=\"/Applications/Android Studio.app/Contents/jbr/Contents/Home\" ./gradlew assembleDebug"
fi
echo

# ── Mobile app (foreground, so Ctrl-C stops everything) ─────────────────────
echo "▸ starting mobile app…"
cd "$ROOT/mobile" && npm run dev
