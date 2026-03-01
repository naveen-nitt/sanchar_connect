#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)
source "$ROOT_DIR/.venv/bin/activate"

(cd "$ROOT_DIR/backend" && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload) &
BACK_PID=$!
(cd "$ROOT_DIR/frontend" && npm run dev) &
FRONT_PID=$!

echo "Backend PID: $BACK_PID"
echo "Frontend PID: $FRONT_PID"

trap 'kill $BACK_PID $FRONT_PID' EXIT
wait
