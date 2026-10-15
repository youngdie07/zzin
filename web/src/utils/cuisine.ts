const styles: Record<string, { emoji: string; from: string; to: string }> = {
  한식: { emoji: '🍚', from: '#ff9a76', to: '#ff6b6b' },
  양식: { emoji: '🍔', from: '#f6d365', to: '#fda085' },
  일식: { emoji: '🍣', from: '#a1c4fd', to: '#6a85b6' },
  중식: { emoji: '🥟', from: '#f5576c', to: '#f093fb' },
  태국: { emoji: '🍜', from: '#43e97b', to: '#38f9d7' },
  멕시칸: { emoji: '🌮', from: '#fbc2eb', to: '#f6a54c' },
  베트남: { emoji: '🍲', from: '#84fab0', to: '#8fd3f4' },
  이탈리안: { emoji: '🍝', from: '#fccb90', to: '#d57eeb' },
  브런치: { emoji: '🥞', from: '#ffecd2', to: '#fcb69f' },
  퓨전: { emoji: '🌯', from: '#c471f5', to: '#fa71cd' },
};

export const getCuisineStyle = (cuisine: string) =>
  styles[cuisine] ?? { emoji: '🍽️', from: '#bdc3c7', to: '#2c3e50' };

export const CUISINES = ['전체', ...Object.keys(styles)];

export const KOREAN_TAGS = [
  { param: 'goodForFamily', statKey: 'goodForFamilyCount', emoji: '👨‍👩‍👧', label: '가족 모임', desc: '부모님·아이와 가기 좋아요' },
  { param: 'noDiscrimination', statKey: 'noDiscriminationCount', emoji: '🛡️', label: '차별 없음', desc: '인종차별 걱정 없이 편해요' },
  { param: 'authenticKorean', statKey: 'authenticKoreanCount', emoji: '🍚', label: '진짜 한식 느낌', desc: '한국에서 먹던 맛이에요' },
  { param: 'koreanFriendly', statKey: 'koreanFriendlyCount', emoji: '😋', label: '한국인 입맛', desc: '한국인 입맛에 잘 맞아요' },
] as const;

export type ProfileKey = 'authenticity' | 'priceValue' | 'crowd';

export const PROFILE: Record<
  ProfileKey,
  { title: string; question: string; options: { value: string; emoji: string; label: string; short: string; desc: string }[] }
> = {
  authenticity: {
    title: '맛 스타일',
    question: '한국 사람 기준으로 맛이 어때요?',
    options: [
      { value: 'korean', emoji: '🇰🇷', label: '한국 맛 그대로', short: '한국 맛 그대로', desc: '한국에서 먹던 그 맛' },
      { value: 'mixed', emoji: '🔀', label: '반반', short: '약간 현지화', desc: '한국 맛에 현지 느낌이 섞임' },
      { value: 'localized', emoji: '🤠', label: '현지화됨', short: '현지인 입맛', desc: '현지인 입맛에 맞게 변형됨' },
    ],
  },
  priceValue: {
    title: '가성비',
    question: '가격 대비 어땠어요?',
    options: [
      { value: 'great', emoji: '💰', label: '가성비 좋음', short: '가성비 좋음', desc: '가격보다 훨씬 만족' },
      { value: 'fair', emoji: '👌', label: '가격만큼', short: '가격만큼', desc: '낸 만큼은 함' },
      { value: 'poor', emoji: '💸', label: '아쉬움', short: '가격 대비 아쉬움', desc: '비싸거나 퀄리티가 아쉬움' },
    ],
  },
  crowd: {
    title: '주 손님층',
    question: '어떤 손님이 많이 보였어요?',
    options: [
      { value: 'korean', emoji: '👥', label: '한국인 많음', short: '한국인이 많이 찾음', desc: '한국 손님이 대부분' },
      { value: 'mixed', emoji: '🌎', label: '반반', short: '한국인+현지인', desc: '한국인과 현지인이 섞여 있음' },
      { value: 'local', emoji: '🤠', label: '현지인 많음', short: '현지인이 더 많음', desc: '현지 손님이 더 많음' },
    ],
  },
};

export const PROFILE_KEYS = Object.keys(PROFILE) as ProfileKey[];

export const findOption = (key: ProfileKey, value?: string | null) =>
  PROFILE[key].options.find((o) => o.value === value);

export const KEYWORDS = [
  { key: 'korean_staff', emoji: '🗣️', label: '한국어 주문 가능' },
  { key: 'big_portion', emoji: '🍖', label: '양 푸짐' },
  { key: 'banchan', emoji: '🥬', label: '반찬 리필' },
  { key: 'parking', emoji: '🅿️', label: '주차 편함' },
  { key: 'no_wait', emoji: '⏱️', label: '웨이팅 적음' },
  { key: 'waiting', emoji: '⏳', label: '웨이팅 김' },
  { key: 'solo', emoji: '🧍', label: '혼밥 OK' },
  { key: 'drinks', emoji: '🍶', label: '소주·술 OK' },
  { key: 'kids', emoji: '👶', label: '아이 동반 OK' },
  { key: 'group', emoji: '🍻', label: '단체·회식 OK' },
  { key: 'reservation', emoji: '📅', label: '예약 필수' },
  { key: 'clean', emoji: '✨', label: '깔끔·청결' },
  { key: 'kind', emoji: '😊', label: '직원 친절' },
  { key: 'late', emoji: '🌙', label: '늦게까지 영업' },
  { key: 'takeout', emoji: '🥡', label: '포장 편함' },
  { key: 'low_tip', emoji: '💵', label: '팁 부담 적음' },
] as const;

export const findKeyword = (key: string) => KEYWORDS.find((k) => k.key === key);

// 홈 화면 빠른 필터에 노출할 키워드
export const QUICK_KEYWORDS = ['korean_staff', 'parking', 'solo', 'drinks', 'kids', 'takeout'];
