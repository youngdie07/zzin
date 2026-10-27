import { parseImages } from "./images";

export const PROFILE_FIELDS = {
  authenticity: ['korean', 'classic', 'mixed', 'localized'],
  priceValue: ['great', 'fair', 'poor'],
  crowd: ['korean', 'mixed', 'local']
} as const;

export type ProfileKey = keyof typeof PROFILE_FIELDS;

export const sanitizeProfile = (body: Record<string, unknown>) => {
  const out: Partial<Record<ProfileKey, string | null>> = {};
  (Object.keys(PROFILE_FIELDS) as ProfileKey[]).forEach((k) => {
    if (body[k] === undefined) return;
    out[k] = (PROFILE_FIELDS[k] as readonly string[]).includes(body[k] as string) ? (body[k] as string) : null;
  });
  return out;
};

const distribution = (reviews: any[], key: ProfileKey) => {
  const values = PROFILE_FIELDS[key];
  const counts: Record<string, number> = Object.fromEntries(values.map((v) => [v, 0]));
  let total = 0;
  for (const r of reviews) {
    if (r[key] in counts) {
      counts[r[key]]++;
      total++;
    }
  }
  const top = total ? values.reduce((a, b) => (counts[b] > counts[a] ? b : a)) : null;
  return { counts, total, top };
};

export const buildProfile = (reviews: any[]) => ({
  authenticity: distribution(reviews, 'authenticity'),
  priceValue: distribution(reviews, 'priceValue'),
  crowd: distribution(reviews, 'crowd')
});

// 가성비 점수 0~1 (정렬용)
export const valueScore = (profile: ReturnType<typeof buildProfile>) => {
  const pv: any = profile.priceValue;
  if (pv.editor) return pv.top === 'great' ? 1 : pv.top === 'fair' ? 0.5 : 0;
  const { counts, total } = profile.priceValue;
  return total ? (counts.great + counts.fair * 0.5) / total : 0;
};

// ---- 키워드 / 입맛 포인트 / 누구랑 / 추천 메뉴 / 주문 팁 ----
export const KEYWORD_KEYS = [
  'korean_staff', 'big_portion', 'banchan', 'parking', 'no_wait', 'waiting', 'drinks',
  'reservation', 'clean', 'kind', 'late', 'takeout', 'low_tip', 'delivery_only', 'food_truck', 'food_court'
] as const;
export const SITUATION_KEYS = ['solo', 'friends', 'kids', 'group'] as const;
const ORDER_TIP_MAX = 120;

export const parseList = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string' && value) {
    try {
      const p = JSON.parse(value);
      return Array.isArray(p) ? p.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
};

const pickList = (value: unknown, allowed: readonly string[]) => {
  const list = parseList(value).filter((k) => allowed.includes(k));
  return list.length ? JSON.stringify([...new Set(list)]) : null;
};

export const sanitizeExtras = (body: Record<string, unknown>) => {
  const out: { keywords?: string | null; situations?: string | null; menus?: string | null; orderTip?: string | null } = {};
  if (body.keywords !== undefined) out.keywords = pickList(body.keywords, KEYWORD_KEYS);
  if (body.situations !== undefined) out.situations = pickList(body.situations, SITUATION_KEYS);
  if (body.menus !== undefined) {
    const list = parseList(body.menus).map((m) => m.trim().slice(0, 30)).filter(Boolean).slice(0, 5);
    out.menus = list.length ? JSON.stringify(list) : null;
  }
  if (body.orderTip !== undefined) {
    const tip = typeof body.orderTip === 'string' ? body.orderTip.trim().slice(0, ORDER_TIP_MAX) : '';
    out.orderTip = tip || null;
  }
  return out;
};

const topCounts = (items: string[], limit: number, keyFn: (s: string) => string = (s) => s) => {
  const map = new Map<string, { name: string; count: number }>();
  for (const it of items) {
    const k = keyFn(it);
    const cur = map.get(k);
    if (cur) cur.count++;
    else map.set(k, { name: it, count: 1 });
  }
  return [...map.values()].sort((a, b) => b.count - a.count).slice(0, limit);
};

const countKeys = (reviews: any[], field: string) =>
  topCounts(reviews.flatMap((r) => parseList(r[field])), 20).map((x) => ({ key: x.name, count: x.count }));

export const buildHighlights = (reviews: any[]) => ({
  keywords: countKeys(reviews, 'keywords'),
  situations: countKeys(reviews, 'situations'),
  menus: topCounts(reviews.flatMap((r) => parseList(r.menus)), 6, (s) => s.toLowerCase().replace(/\s+/g, '')),
  orderTips: reviews.map((r) => r.orderTip).filter(Boolean).slice(0, 5) as string[]
});

export const serializeReview = (r: any) => ({
  ...r,
  images: parseImages(r.images),
  keywords: parseList(r.keywords),
  situations: parseList(r.situations),
  menus: parseList(r.menus)
});
