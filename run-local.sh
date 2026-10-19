#!/usr/bin/env bash
# 내 컴퓨터에서 백엔드 + 웹을 한 번에 실행합니다: ./run-local.sh
set -e
cd "$(dirname "$0")"

if ! command -v node >/dev/null; then
  echo "Node.js가 필요해요. https://nodejs.org 에서 LTS 버전을 설치한 뒤 다시 실행하세요."
  exit 1
fi

cd backend
[ -f .env ] || cp .env.example .env
FIRST_RUN=0
[ -f prisma/dev.db ] || FIRST_RUN=1
npm install --no-workspaces --no-audit --no-fund
npx prisma generate
npx prisma migrate deploy
if [ "$FIRST_RUN" = 1 ]; then npm run seed; fi
npm run research:apply

trap 'trap - EXIT; kill 0' EXIT INT TERM
npm run dev &

cd ../web
npm install --no-workspaces --no-audit --no-fund
echo "브라우저가 열립니다 (http://localhost:3001). 종료는 Ctrl+C"
npm run dev -- --open
