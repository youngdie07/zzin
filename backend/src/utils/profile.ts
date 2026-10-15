import { parseImages } from "./images";

export const PROFILE_FIELDS = {
  authenticity: ['korean', 'mixed', 'localized'],
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
  const { counts, total } = profile.priceValue;
  return total ? (counts.great + counts.fair * 0.5) / total : 0;
};

// ---- 키워드 / 추천 메뉴 ----
export const KEYWORD_KEYS = [
  'korean_staff', 'big_portion', 'banchan', 'parking', 'no_wait', 'waiting', 'solo', 'drinks',
  'kids', 'group', 'reservation', 'clean', 'kind', 'late', 'takeout', 'low_tip'
] as const;

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

export const sanitizeExtras = (body: Record<string, unknown>) => {
  const out: { keywords?: string | null; menus?: string | null } = {};
  if (body.keywords !== undefined) {
    const list = parseList(body.keywords).filter((k) => (KEYWORD_KEYS as readonly string[]).includes(k));
    out.keywords = list.length ? JSON.stringify([...new Set(list)]) : null;
  }
  if (body.menus !== undefined) {
    const list = parseList(body.menus).map((m) => m.trim().slice(0, 30)).filter(Boolean).slice(0, 5);
    out.menus = list.length ? JSON.stringify(list) : null;
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

export const buildHighlights = (reviews: any[]) => ({
  keywords: topCounts(reviews.flatMap((r) => parseList(r.keywords)), 20).map((x) => ({ key: x.name, count: x.count })),
  menus: topCounts(reviews.flatMap((r) => parseList(r.menus)), 6, (s) => s.toLowerCase().replace(/\s+/g, ''))
});

export const serializeReview = (r: any) => ({
  ...r,
  images: parseImages(r.images),
  keywords: parseList(r.keywords),
  menus: parseList(r.menus)
});
