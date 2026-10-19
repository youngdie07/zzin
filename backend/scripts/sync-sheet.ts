// 시트(CSV)의 에디터 분류를 DB에 반영합니다.
//   npm run sheet:sync                  -> backend/.env 의 SHEET_CSV_URL 사용 (URL 또는 파일 경로)
//   npm run sheet:sync -- ../docs/x.csv -> 지정한 파일/URL 사용
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { syncFromSource } from '../src/services/sheet-sync';

async function main() {
  const source = process.argv[2] || process.env.SHEET_CSV_URL;
  if (!source) {
    console.error('SHEET_CSV_URL 이 없어요. backend/.env 에 시트 CSV 링크를 넣거나 파일 경로를 인자로 주세요.');
    process.exit(1);
  }
  const prisma = new PrismaClient();
  try {
    const r = await syncFromSource(prisma, source);
    console.log(`새 식당 ${r.created} / 수정 ${r.updated} / 변경 없음 ${r.unchanged}`);
    r.warnings.forEach((w) => console.warn(`주의: ${w}`));
    r.errors.forEach((e) => console.error(`오류: ${e}`));
    if (r.errors.length) process.exitCode = 2;
  } finally {
    await prisma.$disconnect();
  }
}
main();
