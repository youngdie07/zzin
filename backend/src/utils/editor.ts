import { parseList } from './profile';

const EDITOR_FIELDS = [
  'editorAuthenticity', 'editorPriceValue', 'editorCrowd', 'editorTip',
  'editorSituations', 'editorKeywords', 'editorMenus', 'editorOrderTip', 'editorNote', 'editorSource', 'editorAiNote', 'editorUpdatedAt'
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
    orderTip: r.editorOrderTip ?? null,
    note: r.editorNote ?? null,
    // ai 면 시트에서 AI가 채우고 아직 '검증완료' 체크 전인 값
    source: (r.editorSource === 'ai' ? 'ai' : 'editor') as 'ai' | 'editor',
    aiNote: r.editorAiNote ?? null,
    updatedAt: r.editorUpdatedAt ?? null
  };
  const hasAny =
    editor.authenticity || editor.priceValue || editor.crowd || editor.tip || editor.orderTip ||
    editor.note || editor.situations.length || editor.keywords.length || editor.menus.length;
  return hasAny ? editor : null;
};

export const stripEditorFields = <T extends Record<string, any>>(r: T) => {
  const copy: Record<string, any> = { ...r };
  for (const f of EDITOR_FIELDS) delete copy[f];
  return copy;
};

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');

// 에디터가 고른 항목을 앞에 세우고, 리뷰 집계 개수는 그대로 붙임
const mergeKeys = (counted: { key: string; count: number }[], picked: string[]) => {
  const counts = new Map(counted.map((h) => [h.key, h.count]));
  return [
    ...picked.map((key) => ({ key, count: counts.get(key) ?? 0, editor: true })),
    ...counted.filter((h) => !picked.includes(h.key))
  ];
};

// 리뷰 집계 결과(profile/highlights/koreanStats)에 에디터 분류를 덮어씌움
export const applyEditor = (o: any) => {
  const e = o.editor;
  o.noDiscrimination = o.koreanStats.noDiscriminationCount > 0;
  if (!e) return o;

  for (const k of ['authenticity', 'priceValue', 'crowd'] as const) {
    if (e[k]) o.profile[k] = { ...o.profile[k], top: e[k], editor: true };
  }

  o.highlights.keywords = mergeKeys(o.highlights.keywords, e.keywords);
  o.highlights.situations = mergeKeys(o.highlights.situations, e.situations);

  const menuCounts = new Map<string, number>(o.highlights.menus.map((m: any) => [norm(m.name), m.count]));
  const editorMenuKeys = new Set(e.menus.map(norm));
  o.highlights.menus = [
    ...e.menus.map((name: string) => ({ name, count: menuCounts.get(norm(name)) ?? 0, editor: true })),
    ...o.highlights.menus.filter((m: any) => !editorMenuKeys.has(norm(m.name)))
  ];
  if (e.orderTip) o.highlights.orderTips = [e.orderTip, ...o.highlights.orderTips];
  return o;
};
