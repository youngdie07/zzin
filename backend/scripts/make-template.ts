// docs/restaurant-template.csv 생성: 현재 식당 목록을 채워 넣고 분류 칸은 비워둔 템플릿
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { realRestaurants } from '../prisma/data/austin-korean-restaurants';
import { tipResearch } from '../prisma/data/tip-research';
import { LABELS } from '../src/utils/labels';

const PRICE_BANDS: Record<number, string> = { 1: '10_20', 2: '20_30', 3: '30_50', 4: '50_100' };
// 내부 값 -> 시트에 적는 한글 표기 (처음 나오는 표기 사용)
const label = (group: 'subCuisine' | 'priceBand', value?: string) =>
  Object.entries(LABELS[group]).find(([, v]) => v === value)?.[0] ?? '';

const HEADER = [
  '식당명(영문)', '한글명', '음식 종류', '세부 종류', '주소', '가격대(1인)', '전화', '영업상태',
  '본토 느낌', '한국인 입맛', '입맛 포인트', '가성비', '손님층', '팁', '상황', '키워드', '추천 메뉴', '주문 팁',
  '한줄평', '위도', '경도'
];
const esc = (v: unknown) => {
  const s = v === undefined || v === null ? '' : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const closed = new Set(tipResearch.filter((t) => t.businessStatus === 'closed').map((t) => t.name));
const rows = realRestaurants.map((r) => [
  r.name, r.nameKorean, r.cuisine, label('subCuisine', r.sub), r.address, label('priceBand', PRICE_BANDS[r.price]), r.phone ?? '',
  closed.has(r.name) ? '폐업' : '',
  '', '', '', '', '', '', '', '', '', '', '', r.lat, r.lng
]);

const csv = '﻿' + [HEADER, ...rows].map((row) => row.map(esc).join(',')).join('\r\n') + '\r\n';
const out = join(__dirname, '../../docs/restaurant-template.csv');
writeFileSync(out, csv);
console.log(`템플릿 생성: ${out} (${rows.length}곳)`);
