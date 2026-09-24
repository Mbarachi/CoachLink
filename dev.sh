#!/usr/bin/env bash
#
# Runs the CoachLink app against the live Firebase project.
#
#   ./dev.sh              the app in a desktop browser (http://localhost:5173)
#   ./dev.sh --emulate    the app against local Firebase emulators
#
# There is no API server to start any more. The NestJS service and its Postgres
# container were removed once Firebase won; the backend now lives in the sibling
# repo coachlink-firebase as Cloud Functions, and the app talks to it directly.
#
# Nor is there a tunnel: a device build reaches Firebase over HTTPS on its own,
# so a phone needs nothing from this machine.
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FIREBASE_DIR="$(cd "$ROOT/.." && pwd)/coachlink-firebase"
NODE_VERSION="22.21.1"

USE_EMULATORS=false
[ "${1:-}" = "--emulate" ] && USE_EMULATORS=true

# The shell's default node is too old for Vite, so pin the version here.
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "$HOME/.nvm/nvm.sh"
  nvm use "$NODE_VERSION" >/dev/null || {
    echo "✗ Node $NODE_VERSION not installed. Run: nvm install $NODE_VERSION"
    exit 1
  }
fi
echo "▸ node $(node --version)"

if [ "$USE_EMULATORS" = true ]; then
  if [ ! -d "$FIREBASE_DIR" ]; then
    echo "✗ Expected the backend repo at $FIREBASE_DIR"
    echo "  git clone git@github.com:Mbarachi/coachlink-firebase.git"
    exit 1
  fi

  cleanup() {
    echo
    echo "▸ stopping emulators and the app…"
    pkill -f "firebase emulators:start" 2>/dev/null || true
    for port in 5173 5174 5175; do
      lsof -ti:$port -sTCP:LISTEN 2>/dev/null | xargs -r kill 2>/dev/null || true
    done
  }
  trap cleanup EXIT INT TERM

  echo "▸ starting emulators…"
  (cd "$FIREBASE_DIR" && npm run emulate > /tmp/coachlink-emulators.log 2>&1) &

  printf '▸ waiting for Firestore'
  for _ in $(seq 1 60); do
    if curl -sf "http://127.0.0.1:8080" >/dev/null 2>&1; then break; fi
    printf '.'; sleep 1
  done

  if ! curl -sf "http://127.0.0.1:8080" >/dev/null 2>&1; then
    echo ' failed'
    echo "✗ Emulators didn't come up. Last 30 lines of /tmp/coachlink-emulators.log:"
    tail -30 /tmp/coachlink-emulators.log
    exit 1
  fi
  echo ' ready'
  echo
  echo "  Emulator UI  http://127.0.0.1:4000"
  echo "  The app only reaches these if VITE_USE_EMULATORS=true is set in mobile/.env"
else
  echo "▸ using the live Firebase project (coachlink-mvp)"
fi

echo
echo "▸ starting the app…"
cd "$ROOT/mobile" && npm run dev
