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
# 예전에 만든 .env 에 시트 주소가 비어 있으면 .env.example 의 주소를 채워 넣음
if ! grep -q '^SHEET_CSV_URL=.' .env; then
  sed -i.bak '/^SHEET_CSV_URL=/d' .env && rm -f .env.bak
  grep '^SHEET_CSV_URL=' .env.example >> .env
fi
FIRST_RUN=0
[ -f prisma/dev.db ] || FIRST_RUN=1
npm install --no-workspaces --no-audit --no-fund
npx prisma generate
npx prisma migrate deploy
if [ "$FIRST_RUN" = 1 ]; then npm run seed; fi
npm run research:apply
npm run sheet:sync || echo "구글 시트를 못 읽었어요. 시트 공유 설정과 인터넷 연결을 확인하세요. (앱은 그대로 켜집니다)"

trap 'trap - EXIT; kill 0' EXIT INT TERM
npm run dev &

cd ../web
npm install --no-workspaces --no-audit --no-fund
echo "브라우저가 열립니다 (http://localhost:3001). 종료는 Ctrl+C"
npm run dev -- --open
