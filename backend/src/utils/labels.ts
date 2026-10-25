// 시트의 한글 표기 -> 내부 값. 영문 내부 값을 그대로 써도 인정합니다.
export const LABELS = {
  // 한식은 한식 스타일(요즘 한국 / 그 시절 / 미국식 한식), 나머지는 본토 느낌. 예전 표기도 계속 인정
  authenticity: {
    '본토 맛 그대로': 'korean', '한국 맛 그대로': 'korean', 반반: 'mixed', 미국식: 'localized', 현지화됨: 'localized',
    '체인점 스타일': 'localized', '요즘 한국 스타일': 'korean', '그 시절 한국 맛': 'classic', '미국식 한식': 'localized'
  },
  // 기대치 가이드: 한국 맛 기준으로 어느 정도 기대하면 되는지
  expectation: { '한국 맛 기대해도 돼요': 'high', '그리울 때 무난한 한 끼': 'comfort', '현지 친구랑 가기 좋아요': 'casual' },
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
