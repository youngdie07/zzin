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
  바비큐: { emoji: '🍖', from: '#c79081', to: '#7b4397' },
  인도: { emoji: '🍛', from: '#f7971e', to: '#ffd200' },
  지중해: { emoji: '🥙', from: '#56ccf2', to: '#2f80ed' },
  디저트: { emoji: '🍰', from: '#fbc2eb', to: '#a6c1ee' },
  술집: { emoji: '🍺', from: '#f6d365', to: '#c79081' },
};

export const getCuisineStyle = (cuisine: string) =>
  styles[cuisine] ?? { emoji: '🍽️', from: '#bdc3c7', to: '#2c3e50' };

export const CUISINES = ['전체', ...Object.keys(styles)];

// 한식 세부 종류
export const KOREAN_SUBS = [
  { key: 'general', emoji: '🍚', label: '종합 한식' },
  { key: 'bbq', emoji: '🥩', label: '고기구이' },
  { key: 'tofu', emoji: '🍲', label: '순두부·찌개' },
  { key: 'soup', emoji: '🥘', label: '국밥·탕' },
  { key: 'chicken', emoji: '🍗', label: '치킨' },
  { key: 'bunsik', emoji: '🍜', label: '분식' },
  { key: 'pocha', emoji: '🍶', label: '포차·술집' },
  { key: 'banchan', emoji: '🥡', label: '반찬·도시락' },
  { key: 'fusion', emoji: '🌯', label: '퓨전' },
] as const;

export const findSub = (key?: string | null) => KOREAN_SUBS.find((s) => s.key === key);

// "한식 · 고기구이" 처럼 음식 종류와 세부 종류를 함께 표시
export const cuisineLabel = (r: { cuisineType: string; subCuisine?: string | null }) =>
  findSub(r.subCuisine) ? `${r.cuisineType} · ${findSub(r.subCuisine)!.label}` : r.cuisineType;

// 1인 기준 가격대 (구글맵과 같은 구간)
export const PRICE_BANDS = [
  { key: 'u10', label: '$10 미만' },
  { key: '10_20', label: '$10–20' },
  { key: '20_30', label: '$20–30' },
  { key: '30_50', label: '$30–50' },
  { key: '50_100', label: '$50–100' },
  { key: '100p', label: '$100 이상' },
] as const;

export const priceLabel = (band?: string | null) => PRICE_BANDS.find((p) => p.key === band)?.label;

// 누구랑 가기 좋은지 (리뷰·시트의 situations)
export const SITUATIONS = [
  { key: 'family', emoji: '👨‍👩‍👧', label: '가족 모임', desc: '가족끼리 편하게' },
  { key: 'parents', emoji: '👵', label: '부모님 모시고', desc: '어른들 입맛·분위기에 맞아요' },
  { key: 'kids', emoji: '👶', label: '아이 동반', desc: '아이와 가기 편해요' },
  { key: 'date', emoji: '💑', label: '데이트', desc: '분위기 좋아요' },
  { key: 'group', emoji: '🍻', label: '회식·단체', desc: '여럿이 가기 좋아요' },
  { key: 'solo', emoji: '🧍', label: '혼밥', desc: '혼자 가도 편해요' },
] as const;

export const findSituation = (key: string) => SITUATIONS.find((s) => s.key === key);

export const NO_DISCRIMINATION = { emoji: '🛡️', label: '차별 없음', desc: '인종차별 걱정 없이 편해요' };

// 한국인 입맛 포인트 (왜 입맛에 맞는지/안 맞는지)
export const PALATE = [
  { key: 'salty', emoji: '🧂', label: '많이 짜요' },
  { key: 'sweet', emoji: '🍯', label: '많이 달아요' },
  { key: 'greasy', emoji: '🧈', label: '느끼해요' },
  { key: 'spicy', emoji: '🌶️', label: '매콤해요' },
  { key: 'mild', emoji: '🍃', label: '담백해요' },
  { key: 'rice', emoji: '🍚', label: '밥 생각나는 맛' },
  { key: 'soup', emoji: '🍲', label: '국물 있음' },
  { key: 'hangover', emoji: '🥣', label: '해장 가능' },
] as const;

export const findPalate = (key: string) => PALATE.find((p) => p.key === key);

// 홈 화면 입맛 필터에 노출할 포인트 (찾아가고 싶은 이유가 되는 것만)
export const QUICK_PALATE = ['spicy', 'mild', 'rice', 'soup', 'hangover'];

// 본토 느낌: 음식 종류마다 "어느 나라 맛"인지
const ORIGINS: Record<string, string> = {
  한식: '한국', 일식: '일본', 중식: '중국', 태국: '태국', 멕시칸: '멕시코', 베트남: '베트남', 이탈리안: '이탈리아', 인도: '인도', 바비큐: '텍사스',
};

export type ProfileKey = 'authenticity' | 'palateFit' | 'priceValue' | 'crowd';

type ProfileDef = { title: string; question: string; options: { value: string; emoji: string; label: string; short: string; desc: string }[] };

const authenticityFor = (cuisine?: string): ProfileDef => {
  const origin = (cuisine && ORIGINS[cuisine]) || '본토';
  return {
    title: '본토 느낌',
    question: cuisine === '한식' ? '한국에서 먹던 맛이랑 비교하면?' : origin === '본토' ? '원래 그 나라 맛이랑 비교하면?' : `${origin} 현지 맛이랑 비교하면?`,
    options: [
      { value: 'korean', emoji: cuisine === '한식' ? '🇰🇷' : '📍', label: `${origin} 맛 그대로`, short: `${origin} 맛 그대로`, desc: `${origin}에서 먹는 그 맛` },
      // 텍사스 바비큐는 원래 미국 음식이라 "미국식" 대신 체인점 스타일로 표현
      ...(cuisine === '바비큐'
        ? [
            { value: 'mixed', emoji: '🔀', label: '반반', short: '반반', desc: '정통과 대중적인 맛 사이' },
            { value: 'localized', emoji: '🏪', label: '체인점 스타일', short: '체인점 스타일', desc: '정통보다 대중적인 맛' },
          ]
        : [
            { value: 'mixed', emoji: '🔀', label: '반반', short: '약간 미국식', desc: `${origin} 맛에 미국식이 섞임` },
            { value: 'localized', emoji: '🇺🇸', label: '미국식', short: '미국식', desc: '미국 사람 입맛에 맞게 바뀜' },
          ]),
    ],
  };
};

export const PROFILE: Record<ProfileKey, ProfileDef> = {
  authenticity: authenticityFor(),
  palateFit: {
    title: '한국인 입맛',
    question: '한국 사람 입맛에 맞았어요?',
    options: [
      { value: 'good', emoji: '😋', label: '잘 맞아요', short: '한국인 입맛에 맞음', desc: '한국 사람이 좋아할 맛' },
      { value: 'ok', emoji: '🙂', label: '무난해요', short: '입맛 무난', desc: '호불호 없이 먹을 만함' },
      { value: 'bad', emoji: '😕', label: '안 맞아요', short: '입맛 안 맞음', desc: '짜거나 달거나 느끼해서 아쉬움' },
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

// 음식 종류를 알면 본토 느낌 문구를 그 나라에 맞춰 바꿈
export const profileFor = (key: ProfileKey, cuisine?: string) => (key === 'authenticity' ? authenticityFor(cuisine) : PROFILE[key]);

export const findOption = (key: ProfileKey, value?: string | null, cuisine?: string) =>
  profileFor(key, cuisine).options.find((o) => o.value === value);

export const KEYWORDS = [
  { key: 'korean_staff', emoji: '🗣️', label: '한국어 주문 가능' },
  { key: 'big_portion', emoji: '🍖', label: '양 푸짐' },
  { key: 'banchan', emoji: '🥬', label: '반찬 리필' },
  { key: 'parking', emoji: '🅿️', label: '주차 편함' },
  { key: 'no_wait', emoji: '⏱️', label: '웨이팅 적음' },
  { key: 'waiting', emoji: '⏳', label: '웨이팅 김' },
  { key: 'drinks', emoji: '🍶', label: '소주·술 OK' },
  { key: 'reservation', emoji: '📅', label: '예약 필수' },
  { key: 'clean', emoji: '✨', label: '깔끔·청결' },
  { key: 'kind', emoji: '😊', label: '직원 친절' },
  { key: 'late', emoji: '🌙', label: '늦게까지 영업' },
  { key: 'takeout', emoji: '🥡', label: '포장 편함' },
] as const;

export const findKeyword = (key: string) => KEYWORDS.find((k) => k.key === key);

// 홈 화면 빠른 필터에 노출할 키워드
export const QUICK_KEYWORDS = ['korean_staff', 'parking', 'drinks', 'takeout'];

export const TIP_OPTIONS = [
  { value: 'no_tip', emoji: '💵', label: '팁 안 받아요', short: '팁 없음', desc: '노팁 정책, 팁을 받지 않음' },
  { value: 'included', emoji: '🧾', label: '팁 포함', short: '팁 포함', desc: '서비스 차지가 이미 포함됨' },
  { value: 'optional', emoji: '🙂', label: '팁 선택', short: '팁 선택', desc: '안 줘도 괜찮음 (카운터 주문 등)' },
  { value: 'standard', emoji: '💸', label: '팁 필수', short: '팁 필수(15~20%)', desc: '일반 식당처럼 팁을 줘야 함' },
] as const;

export const findTip = (v?: string | null) => TIP_OPTIONS.find((t) => t.value === v);
