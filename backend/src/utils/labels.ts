// 시트의 한글 표기 -> 내부 값. 영문 내부 값을 그대로 써도 인정합니다.
export const LABELS = {
  authenticity: { '한국 맛 그대로': 'korean', 반반: 'mixed', 현지화됨: 'localized' },
  priceValue: { '가성비 좋음': 'great', 가격만큼: 'fair', 아쉬움: 'poor' },
  crowd: { '한국인 많음': 'korean', 반반: 'mixed', '현지인 많음': 'local' },
  tip: { '팁 안 받아요': 'no_tip', '팁 포함': 'included', '팁 선택': 'optional', '팁 필수': 'standard' },
  situations: { '가족 모임': 'goodForFamily', '차별 없음': 'noDiscrimination', '한국인 입맛': 'koreanFriendly' },
  keywords: {
    '한국어 주문 가능': 'korean_staff', '양 푸짐': 'big_portion', '반찬 리필': 'banchan', '주차 편함': 'parking',
    '웨이팅 적음': 'no_wait', '웨이팅 김': 'waiting', '혼밥 OK': 'solo', '소주·술 OK': 'drinks',
    '아이 동반 OK': 'kids', '단체·회식 OK': 'group', '예약 필수': 'reservation', '깔끔·청결': 'clean',
    '직원 친절': 'kind', '늦게까지 영업': 'late', '포장 편함': 'takeout'
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
