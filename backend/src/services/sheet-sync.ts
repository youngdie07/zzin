import { readFile } from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';
import { toValue, LabelGroup } from '../utils/labels';

// RFC 4180 CSV 파서 (따옴표, 줄바꿈, BOM 처리)
export function parseCsv(input: string): string[][] {
  const text = input.replace(/^﻿/, '');
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}

const COLUMNS: Record<string, string> = {
  '식당명': 'name', '한글명': 'nameKorean', '음식종류': 'cuisine', '세부종류': 'subCuisine', '주소': 'address', '가격대': 'price',
  '전화': 'phone', '영업상태': 'status', '본토느낌': 'authenticity', '맛스타일': 'authenticity',
  '한국인입맛': 'palateFit', '입맛포인트': 'palate', '가성비': 'priceValue', '손님층': 'crowd',
  '팁': 'tip', '상황': 'situations', '누구랑': 'situations', '키워드': 'keywords', '추천메뉴': 'menus',
  '주문팁': 'orderTip', '한줄평': 'note', 'AI메모': 'aiNote', '검증완료': 'verified',
  '위도': 'lat', '경도': 'lng'
};

// "식당명(영문)", "가격대(1-4)" 처럼 괄호 설명이 붙어 있어도 인식
const headerKey = (h: string) => COLUMNS[h.replace(/\(.*?\)/g, '').replace(/\s+/g, '')];

// 오류 메시지에 쓸 칸 이름
const COLUMN_NAMES: Record<string, string> = {
  status: '영업상태', price: '가격대', subCuisine: '세부 종류', authenticity: '본토 느낌', palateFit: '한국인 입맛', palate: '입맛 포인트', priceValue: '가성비',
  crowd: '손님층', tip: '팁', situations: '상황', keywords: '키워드'
};

// 키워드에서 상황으로 옮긴 항목은 어디에 적으면 되는지 알려줌
const MOVED_TO_SITUATIONS: Record<string, string> = { '아이 동반 OK': '아이 동반', '단체·회식 OK': '회식·단체', '혼밥 OK': '혼밥' };

const AUSTIN_CENTER = { lat: 30.2672, lng: -97.7431 };
const splitMulti = (s: string) => s.split(/[,，;/]/).map((x) => x.trim()).filter(Boolean);

export interface SyncResult {
  created: number;
  updated: number;
  unchanged: number;
  errors: string[];
  warnings: string[];
}

export async function syncSheet(prisma: PrismaClient, csv: string): Promise<SyncResult> {
  const result: SyncResult = { created: 0, updated: 0, unchanged: 0, errors: [], warnings: [] };
  const [header, ...body] = parseCsv(csv);
  if (!header) {
    result.errors.push('시트가 비어 있어요.');
    return result;
  }
  const cols = header.map(headerKey);
  if (!cols.includes('name')) {
    result.errors.push("'식당명' 열을 찾지 못했어요. 첫 줄(헤더)을 확인해 주세요.");
    return result;
  }

  for (let i = 0; i < body.length; i++) {
    const rowNo = i + 2;
    const cell: Record<string, string> = {};
    cols.forEach((key, idx) => {
      if (key) cell[key] = (body[i][idx] ?? '').trim();
    });
    if (!cell.name) continue;
    const label = `${rowNo}행 ${cell.name}`;

    const single = (key: string, group: LabelGroup): string | null => {
      if (!cell[key]) return null;
      const v = toValue(group, cell[key]);
      if (!v) result.errors.push(`${label}: '${cell[key]}' 는 ${COLUMN_NAMES[key] ?? key} 칸에 쓸 수 없는 값이에요.`);
      return v;
    };
    const multi = (key: string, group: LabelGroup): string[] => {
      const out: string[] = [];
      for (const part of splitMulti(cell[key] ?? '')) {
        const v = toValue(group, part);
        if (v) out.push(v);
        else if (key === 'keywords' && MOVED_TO_SITUATIONS[part])
          result.errors.push(`${label}: '${part}' 는 이제 상황 칸에 '${MOVED_TO_SITUATIONS[part]}'(으)로 적어주세요.`);
        else result.errors.push(`${label}: '${part}' 는 ${COLUMN_NAMES[key] ?? key} 칸에 쓸 수 없는 값이에요.`);
      }
      return [...new Set(out)];
    };

    const editor = {
      editorAuthenticity: single('authenticity', 'authenticity'),
      editorPalateFit: single('palateFit', 'palateFit'),
      editorPalate: JSON.stringify(multi('palate', 'palate')),
      editorPriceValue: single('priceValue', 'priceValue'),
      editorCrowd: single('crowd', 'crowd'),
      editorTip: single('tip', 'tip'),
      editorSituations: JSON.stringify(multi('situations', 'situations')),
      editorKeywords: JSON.stringify(multi('keywords', 'keywords')),
      editorMenus: JSON.stringify(splitMulti(cell.menus ?? '').slice(0, 8).map((m) => m.slice(0, 30))),
      editorOrderTip: cell.orderTip ? cell.orderTip.slice(0, 120) : null,
      editorNote: cell.note || null,
      // AI 메모가 있고 '검증완료' 체크 전이면 AI 추정값으로 표시
      editorSource: cell.aiNote && cell.verified?.toUpperCase() !== 'TRUE' ? 'ai' : 'editor',
      editorAiNote: cell.aiNote || null,
      // 가격대·세부 종류도 시트가 기준: 비우면 지움
      priceBand: /^\d$/.test(cell.price ?? '') ? null : single('price', 'priceBand'),
      subCuisine: single('subCuisine', 'subCuisine')
    };
    if (/^\d$/.test(cell.price ?? ''))
      result.errors.push(`${label}: 가격대는 이제 '$10–20' 처럼 1인 기준 구간으로 적어주세요. (예전 1~4 단계는 무시했어요)`);
    const status = cell.status ? toValue('status', cell.status) : null;
    if (cell.status && !status) result.errors.push(`${label}: '${cell.status}' 는 영업상태 칸에 쓸 수 없는 값이에요. (영업중 / 폐업)`);

    const existing = await prisma.restaurant.findFirst({ where: { name: cell.name } });
    const basics = {
      ...(cell.nameKorean ? { nameKorean: cell.nameKorean } : {}),
      ...(cell.cuisine ? { cuisineType: cell.cuisine } : {}),
      ...(cell.address ? { address: cell.address } : {}),
      ...(cell.phone ? { phoneNumber: cell.phone } : {}),
      ...(cell.lat && !isNaN(+cell.lat) ? { latitude: +cell.lat } : {}),
      ...(cell.lng && !isNaN(+cell.lng) ? { longitude: +cell.lng } : {}),
      ...(status ? { businessStatus: status } : {})
    };

    if (!existing) {
      if (!cell.address || !cell.cuisine) {
        result.errors.push(`${label}: 새 식당은 '주소'와 '음식 종류'가 꼭 필요해요.`);
        continue;
      }
      if (!('latitude' in basics)) result.warnings.push(`${label}: 위도/경도가 없어 오스틴 중심 좌표로 넣었어요.`);
      await prisma.restaurant.create({
        data: {
          name: cell.name,
          address: cell.address,
          cuisineType: cell.cuisine,
          latitude: AUSTIN_CENTER.lat,
          longitude: AUSTIN_CENTER.lng,
          images: '[]',
          ...basics,
          ...editor,
          editorUpdatedAt: new Date()
        }
      });
      result.created++;
      continue;
    }

    const next = { ...basics, ...editor } as Record<string, unknown>;
    const changed = Object.entries(next).some(([k, v]) => (existing as Record<string, unknown>)[k] !== v);
    if (!changed) {
      result.unchanged++;
      continue;
    }
    await prisma.restaurant.update({ where: { id: existing.id }, data: { ...next, editorUpdatedAt: new Date() } });
    result.updated++;
  }
  return result;
}

export async function loadCsv(source: string): Promise<string> {
  if (!/^https?:\/\//.test(source)) return readFile(source, 'utf8');
  const res = await fetch(source, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`시트를 불러오지 못했어요 (HTTP ${res.status}).`);
  const text = await res.text();
  if (/^\s*</.test(text)) throw new Error("시트가 CSV가 아니에요. 구글 시트 공유가 '링크가 있는 모든 사용자: 뷰어'인지(또는 '웹에 게시 > CSV' 링크인지) 확인해 주세요.");
  return text;
}

export async function syncFromSource(prisma: PrismaClient, source: string): Promise<SyncResult> {
  return syncSheet(prisma, await loadCsv(source));
}

export function startSheetSync(prisma: PrismaClient) {
  const source = process.env.SHEET_CSV_URL;
  if (!source) return;
  const minutes = Number(process.env.SHEET_SYNC_MINUTES) || 10;
  const run = async () => {
    try {
      const r = await syncFromSource(prisma, source);
      if (r.created || r.updated || r.errors.length) {
        console.log(`[sheet] 새 식당 ${r.created} / 수정 ${r.updated} / 변경 없음 ${r.unchanged}`);
      }
      r.errors.forEach((e) => console.warn(`[sheet] ${e}`));
      r.warnings.forEach((w) => console.warn(`[sheet] ${w}`));
    } catch (e: any) {
      console.warn(`[sheet] 동기화 실패: ${e?.message ?? e}`);
    }
  };
  run();
  setInterval(run, minutes * 60_000).unref();
  console.log(`[sheet] ${minutes}분마다 시트와 동기화합니다.`);
}
