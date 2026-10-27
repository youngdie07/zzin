// 시트의 한글 표기 -> 내부 값. 영문 내부 값을 그대로 써도 인정합니다.
export const LABELS = {
  // 한식은 한식 스타일(요즘 한국 / 그 시절 / 미국식 한식), 나머지는 본토 느낌. 예전 표기도 계속 인정
  authenticity: {
    '본토 맛 그대로': 'korean', '한국 맛 그대로': 'korean', 반반: 'mixed', 미국식: 'localized', 현지화됨: 'localized',
    '체인점 스타일': 'localized', '요즘 한국 스타일': 'korean', '그 시절 한국 맛': 'classic', '미국식 한식': 'localized'
  },
  // 예전 표기(가성비 좋음/가격만큼/아쉬움)도 인정
  priceValue: { '가성비 좋아요': 'great', 적당해요: 'fair', '가격대 있어요': 'poor', '가성비 좋음': 'great', 가격만큼: 'fair', 아쉬움: 'poor' },
  crowd: { '한국인 많음': 'korean', 반반: 'mixed', '현지인 많음': 'local' },
  tip: { '팁 안 받아요': 'no_tip', '팁 포함': 'included', '팁 선택': 'optional', '팁 필수': 'standard' },
  // 예전 표기(가족 모임·부모님 모시고·회식·단체 → 단체, 데이트 → 친구랑)도 인정
  situations: {
    혼밥: 'solo', 친구랑: 'friends', '아이 동반': 'kids', 단체: 'group',
    '가족 모임': 'group', '부모님 모시고': 'group', '회식·단체': 'group', 데이트: 'friends'
  },
  keywords: {
    '한국어 주문 가능': 'korean_staff', '양 푸짐': 'big_portion', '반찬 리필': 'banchan', '주차 편함': 'parking',
    '웨이팅 적음': 'no_wait', '웨이팅 김': 'waiting', '소주·술 OK': 'drinks', '예약 필수': 'reservation',
    '깔끔·청결': 'clean', '직원 친절': 'kind', '늦게까지 영업': 'late', '포장 편함': 'takeout',
    '배달 전문': 'delivery_only', 푸드트럭: 'food_truck', 푸드코트: 'food_court'
  },
  status: { 영업중: 'open', 폐업: 'closed' },
  // 1인 기준 가격대 (구글맵 표기와 같은 구간)
  priceBand: {
    '$10 미만': 'u10', '$10–20': '10_20', '$20–30': '20_30', '$30–50': '30_50', '$50–100': '50_100', '$100 이상': '100p',
    '$10-20': '10_20', '$20-30': '20_30', '$30-50': '30_50', '$50-100': '50_100'
  },
  // 한식 세부 종류
  subCuisine: {
    '종합 한식': 'general', 고기구이: 'bbq', '순두부·찌개': 'tofu', '국밥·탕': 'soup', 치킨: 'chicken', 분식: 'bunsik',
    '포차·술집': 'pocha', '반찬·도시락': 'banchan', 퓨전: 'fusion',
    '카페·디저트': 'cafe'
  }
} as const;

export type LabelGroup = keyof typeof LABELS;

export const toValue = (group: LabelGroup, input: string): string | null => {
  const map = LABELS[group] as Record<string, string>;
  const v = input.trim();
  if (map[v]) return map[v];
  return Object.values(map).includes(v) ? v : null;
};
