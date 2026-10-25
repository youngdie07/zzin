// 시트의 한글 표기 -> 내부 값. 영문 내부 값을 그대로 써도 인정합니다.
export const LABELS = {
  // 예전 표기(한국 맛 그대로/현지화됨)도 계속 인정
  authenticity: {
    '본토 맛 그대로': 'korean', '한국 맛 그대로': 'korean', 반반: 'mixed', 미국식: 'localized', 현지화됨: 'localized',
    '체인점 스타일': 'localized'
  },
  palateFit: { '잘 맞아요': 'good', 무난해요: 'ok', '안 맞아요': 'bad' },
  palate: {
    '많이 짜요': 'salty', '많이 달아요': 'sweet', 느끼해요: 'greasy', 매콤해요: 'spicy', 담백해요: 'mild',
    '밥 생각나는 맛': 'rice', '국물 있음': 'soup', '해장 가능': 'hangover'
  },
  priceValue: { '가성비 좋음': 'great', 가격만큼: 'fair', 아쉬움: 'poor' },
  crowd: { '한국인 많음': 'korean', 반반: 'mixed', '현지인 많음': 'local' },
  tip: { '팁 안 받아요': 'no_tip', '팁 포함': 'included', '팁 선택': 'optional', '팁 필수': 'standard' },
  situations: {
    '가족 모임': 'family', '부모님 모시고': 'parents', '아이 동반': 'kids', 데이트: 'date', '회식·단체': 'group', 혼밥: 'solo',
    '차별 없음': 'noDiscrimination'
  },
  keywords: {
    '한국어 주문 가능': 'korean_staff', '양 푸짐': 'big_portion', '반찬 리필': 'banchan', '주차 편함': 'parking',
    '웨이팅 적음': 'no_wait', '웨이팅 김': 'waiting', '소주·술 OK': 'drinks', '예약 필수': 'reservation',
    '깔끔·청결': 'clean', '직원 친절': 'kind', '늦게까지 영업': 'late', '포장 편함': 'takeout'
  },
  status: { 영업중: 'open', 폐업: 'closed' }
} as const;

export type LabelGroup = keyof typeof LABELS;

export const toValue = (group: LabelGroup, input: string): string | null => {
  const map = LABELS[group] as Record<string, string>;
  const v = input.trim();
  if (map[v]) return map[v];
  return Object.values(map).includes(v) ? v : null;
};
