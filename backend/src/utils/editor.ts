import { parseList } from './profile';

const EDITOR_FIELDS = [
  'editorAuthenticity', 'editorPriceValue', 'editorCrowd', 'editorTip', 'editorSituations',
  'editorKeywords', 'editorMenus', 'editorNote', 'editorUpdatedAt'
] as const;

export const buildEditor = (r: any) => {
  const editor = {
    authenticity: r.editorAuthenticity ?? null,
    priceValue: r.editorPriceValue ?? null,
    crowd: r.editorCrowd ?? null,
    tip: r.editorTip ?? null,
    situations: parseList(r.editorSituations),
    keywords: parseList(r.editorKeywords),
    menus: parseList(r.editorMenus),
    note: r.editorNote ?? null,
    updatedAt: r.editorUpdatedAt ?? null
  };
  const hasAny =
    editor.authenticity || editor.priceValue || editor.crowd || editor.tip || editor.note ||
    editor.situations.length || editor.keywords.length || editor.menus.length;
  return hasAny ? editor : null;
};

export const stripEditorFields = <T extends Record<string, any>>(r: T) => {
  const copy: Record<string, any> = { ...r };
  for (const f of EDITOR_FIELDS) delete copy[f];
  return copy;
};

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');

// 리뷰 집계 결과(profile/highlights/koreanStats)에 에디터 분류를 덮어씌움
export const applyEditor = (o: any) => {
  const e = o.editor;
  const cs = o.koreanStats;
  o.situations = {
    goodForFamily: !!e?.situations.includes('goodForFamily') || cs.goodForFamilyCount > 0,
    noDiscrimination: !!e?.situations.includes('noDiscrimination') || cs.noDiscriminationCount > 0,
    authenticKorean: e?.authenticity === 'korean' || cs.authenticKoreanCount > 0,
    koreanFriendly: !!e?.situations.includes('koreanFriendly') || cs.koreanFriendlyCount > 0
  };
  if (!e) return o;

  for (const k of ['authenticity', 'priceValue', 'crowd'] as const) {
    if (e[k]) o.profile[k] = { ...o.profile[k], top: e[k], editor: true };
  }

  const kwCounts = new Map<string, number>(o.highlights.keywords.map((h: any) => [h.key, h.count]));
  o.highlights.keywords = [
    ...e.keywords.map((key: string) => ({ key, count: kwCounts.get(key) ?? 0, editor: true })),
    ...o.highlights.keywords.filter((h: any) => !e.keywords.includes(h.key))
  ];

  const menuCounts = new Map<string, number>(o.highlights.menus.map((m: any) => [norm(m.name), m.count]));
  const editorMenuKeys = new Set(e.menus.map(norm));
  o.highlights.menus = [
    ...e.menus.map((name: string) => ({ name, count: menuCounts.get(norm(name)) ?? 0, editor: true })),
    ...o.highlights.menus.filter((m: any) => !editorMenuKeys.has(norm(m.name)))
  ];
  return o;
};
