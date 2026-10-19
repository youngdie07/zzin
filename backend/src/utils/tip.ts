import { buildEditor, stripEditorFields } from './editor';

export const TIP_POLICIES = ['no_tip', 'included', 'optional', 'standard'] as const;
export type TipPolicy = (typeof TIP_POLICIES)[number];

export const isTipPolicy = (v: unknown): v is TipPolicy => (TIP_POLICIES as readonly string[]).includes(v as string);

export const sanitizeTipReport = (body: Record<string, unknown>) =>
  body.tipReport === undefined ? {} : { tipReport: isTipPolicy(body.tipReport) ? body.tipReport : null };

// 한인 리뷰 N명 이상이 같은 답을 하면 사용자 제보를 우선, 아니면 AI 조사 결과(신뢰도 기준 이상)를 사용
const MIN_USER_REPORTS = 3;
const MIN_USER_SHARE = 0.6;
const MIN_AI_CONFIDENCE = 0.6;

export const buildTip = (restaurant: any, reviews: any[]) => {
  const counts: Record<string, number> = Object.fromEntries(TIP_POLICIES.map((p) => [p, 0]));
  let total = 0;
  for (const r of reviews) {
    if (isTipPolicy(r.tipReport)) {
      counts[r.tipReport]++;
      total++;
    }
  }
  const top = total ? TIP_POLICIES.reduce((a, b) => (counts[b] > counts[a] ? b : a)) : null;

  let evidence: unknown[] = [];
  try {
    evidence = restaurant.tipEvidence ? JSON.parse(restaurant.tipEvidence) : [];
  } catch {
    evidence = [];
  }

  const aiPolicy = isTipPolicy(restaurant.tipPolicy) ? restaurant.tipPolicy : null;
  const aiConfidence = restaurant.tipConfidence ?? null;

  let policy: TipPolicy | 'unknown' = 'unknown';
  let source: 'editor' | 'users' | 'ai' | null = null;
  let confidence: number | null = null;

  if (isTipPolicy(restaurant.editorTip)) {
    policy = restaurant.editorTip;
    source = 'editor';
    confidence = 1;
  } else if (top && total >= MIN_USER_REPORTS && counts[top] / total >= MIN_USER_SHARE) {
    policy = top;
    source = 'users';
    confidence = counts[top] / total;
  } else if (aiPolicy && (aiConfidence ?? 0) >= MIN_AI_CONFIDENCE) {
    policy = aiPolicy;
    source = 'ai';
    confidence = aiConfidence;
  }

  return {
    policy,
    source,
    confidence,
    noTipNeeded: policy === 'no_tip' || policy === 'included',
    userReports: { counts, total },
    ai: { policy: aiPolicy, confidence: aiConfidence, evidence, checkedAt: restaurant.tipCheckedAt ?? null }
  };
};

export const withTip = <T extends Record<string, any>>(restaurant: T, reviews: any[]) => {
  const { tipPolicy, tipConfidence, tipEvidence, tipCheckedAt, ...rest } = restaurant;
  return { ...stripEditorFields(rest), editor: buildEditor(restaurant), tip: buildTip(restaurant, reviews) };
};
