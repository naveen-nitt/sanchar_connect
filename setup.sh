#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)

echo "[1/6] Backend virtualenv setup"

if [ ! -d "$ROOT_DIR/.venv" ]; then
  python3 -m venv "$ROOT_DIR/.venv"
fi

source "$ROOT_DIR/.venv/bin/activate"
pip install --upgrade pip
pip install -r "$ROOT_DIR/backend/requirements.txt"

if [ ! -f "$ROOT_DIR/backend/.env" ]; then
  cp "$ROOT_DIR/backend/.env.example" "$ROOT_DIR/backend/.env"
  echo "Created backend/.env from template"
fi

echo "[2/6] Frontend dependencies"
cd "$ROOT_DIR/frontend"
npm install
cd "$ROOT_DIR"

cat <<MSG

Setup completed.

Next steps:
1) Update backend/.env with MySQL credentials.
2) Create MySQL database: sanchar_connect
3) Run migrations:
   cd backend && source ../.venv/bin/activate && alembic upgrade head
4) Start services:
   ./start.sh

MSG