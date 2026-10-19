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
  '식당명': 'name', '한글명': 'nameKorean', '음식종류': 'cuisine', '주소': 'address', '가격대': 'price',
  '전화': 'phone', '영업상태': 'status', '맛스타일': 'authenticity', '가성비': 'priceValue', '손님층': 'crowd',
  '팁': 'tip', '상황': 'situations', '키워드': 'keywords', '추천메뉴': 'menus', '한줄평': 'note',
  '위도': 'lat', '경도': 'lng'
};

// "식당명(영문)", "가격대(1-4)" 처럼 괄호 설명이 붙어 있어도 인식
const headerKey = (h: string) => COLUMNS[h.replace(/\(.*?\)/g, '').replace(/\s+/g, '')];

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
      if (!v) result.errors.push(`${label}: '${cell[key]}' 는 ${key} 칸에 쓸 수 없는 값이에요.`);
      return v;
    };
    const multi = (key: string, group: LabelGroup): string[] => {
      const out: string[] = [];
      for (const part of splitMulti(cell[key] ?? '')) {
        const v = toValue(group, part);
        if (v) out.push(v);
        else result.errors.push(`${label}: '${part}' 는 ${key} 칸에 쓸 수 없는 값이에요.`);
      }
      return [...new Set(out)];
    };

    const editor = {
      editorAuthenticity: single('authenticity', 'authenticity'),
      editorPriceValue: single('priceValue', 'priceValue'),
      editorCrowd: single('crowd', 'crowd'),
      editorTip: single('tip', 'tip'),
      editorSituations: JSON.stringify(multi('situations', 'situations')),
      editorKeywords: JSON.stringify(multi('keywords', 'keywords')),
      editorMenus: JSON.stringify(splitMulti(cell.menus ?? '').slice(0, 8).map((m) => m.slice(0, 30))),
      editorNote: cell.note || null
    };
    const status = cell.status ? toValue('status', cell.status) : null;
    if (cell.status && !status) result.errors.push(`${label}: '${cell.status}' 는 영업상태 칸에 쓸 수 없는 값이에요. (영업중 / 폐업)`);

    const existing = await prisma.restaurant.findFirst({ where: { name: cell.name } });
    const price = cell.price ? Math.min(4, Math.max(1, parseInt(cell.price, 10) || 2)) : undefined;
    const basics = {
      ...(cell.nameKorean ? { nameKorean: cell.nameKorean } : {}),
      ...(cell.cuisine ? { cuisineType: cell.cuisine } : {}),
      ...(cell.address ? { address: cell.address } : {}),
      ...(cell.phone ? { phoneNumber: cell.phone } : {}),
      ...(price ? { priceRange: price } : {}),
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
  if (/^\s*</.test(text)) throw new Error("시트가 CSV가 아니에요. 구글 시트에서 '웹에 게시 > CSV'로 게시한 링크인지 확인해 주세요.");
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
