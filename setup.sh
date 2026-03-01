#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

info() { echo "[INFO] $*"; }
warn() { echo "[WARN] $*"; }
err()  { echo "[ERROR] $*"; }

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    err "Required command '$1' not found. Please install it and re-run."
    exit 1
  fi
}

copy_env_if_missing() {
  local src="$1"
  local dst="$2"
  if [[ -f "$dst" ]]; then
    info "Env already exists: $dst"
  else
    cp "$src" "$dst"
    info "Created env file: $dst"
  fi
}

install_deps() {
  local dir="$1"
  info "Installing dependencies in $dir"
  (cd "$dir" && npm install)
}

check_mongo() {
  if command -v mongosh >/dev/null 2>&1; then
    if mongosh --quiet --eval "db.adminCommand('ping').ok" >/dev/null 2>&1; then
      info "MongoDB is reachable via mongosh."
      return
    fi
    warn "mongosh found, but MongoDB ping failed. Ensure MongoDB is running (default: mongodb://127.0.0.1:27017)."
    return
  fi

  if command -v nc >/dev/null 2>&1; then
    if nc -z 127.0.0.1 27017 >/dev/null 2>&1; then
      info "MongoDB port 27017 appears open."
      return
    fi
    warn "Port 27017 is not open. Start MongoDB before using the app."
    return
  fi

  warn "Could not verify MongoDB (mongosh/nc unavailable). Please ensure MongoDB is running manually."
}

start_services() {
  info "Starting backend and frontend in separate subshells..."
  info "Backend: http://localhost:5000 | Frontend: http://localhost:3000"
  info "Press Ctrl+C to stop both processes."

  (
    cd "$BACKEND_DIR"
    npm run dev
  ) &
  backend_pid=$!

  (
    cd "$FRONTEND_DIR"
    npm run dev
  ) &
  frontend_pid=$!

  cleanup() {
    info "Stopping services..."
    kill "$backend_pid" "$frontend_pid" >/dev/null 2>&1 || true
    wait "$backend_pid" "$frontend_pid" 2>/dev/null || true
  }

  trap cleanup INT TERM EXIT
  wait "$backend_pid" "$frontend_pid"
}

print_next_steps() {
  cat <<'MSG'

Setup complete.

Next steps:
1) Review backend/.env and set secure values (especially JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD).
2) Ensure MongoDB is running.
3) Start apps manually:
   - cd backend && npm run dev
   - cd frontend && npm run dev
4) Open:
   - Frontend: http://localhost:3000
   - Backend health: http://localhost:5000/health

Tip:
- Run with '--start' to auto-start both services after setup.
MSG
}

main() {
  local auto_start="false"
  if [[ "${1:-}" == "--start" ]]; then
    auto_start="true"
  fi

  require_cmd node
  require_cmd npm

  if [[ ! -d "$BACKEND_DIR" || ! -d "$FRONTEND_DIR" ]]; then
    err "Could not find backend/frontend directories under: $ROOT_DIR"
    exit 1
  fi

  copy_env_if_missing "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
  copy_env_if_missing "$FRONTEND_DIR/.env.example" "$FRONTEND_DIR/.env.local"

  install_deps "$BACKEND_DIR"
  install_deps "$FRONTEND_DIR"

  check_mongo

  if [[ "$auto_start" == "true" ]]; then
    start_services
  else
    print_next_steps
  fi
}

main "$@"
