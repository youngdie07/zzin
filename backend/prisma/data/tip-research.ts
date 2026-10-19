// 웹 검색 조사 결과 (2026-10-19). 자료가 없으면 unknown 으로 둡니다.
// 갱신: `npm run tips:update` (Claude API + 웹 검색, ANTHROPIC_API_KEY 필요)
export interface TipResearch {
  name: string;
  tipPolicy: 'no_tip' | 'included' | 'optional' | 'standard' | 'unknown';
  confidence: number;
  businessStatus?: 'open' | 'closed';
  checkedAt: string;
  evidence: { source: string; url?: string; summary: string }[];
}

const CHECKED = '2026-10-19';
const NONE = (name: string): TipResearch => ({
  name,
  tipPolicy: 'unknown',
  confidence: 0,
  checkedAt: CHECKED,
  evidence: [{ source: '웹 검색', summary: '팁·서비스차지 정책을 밝힌 자료를 찾지 못했어요.' }],
});

export const tipResearch: TipResearch[] = [
  {
    name: 'Jjim BBQ',
    tipPolicy: 'no_tip',
    confidence: 0.8,
    businessStatus: 'closed',
    checkedAt: CHECKED,
    evidence: [
      {
        source: 'Austin Food Magazine',
        url: 'https://austinfoodmagazine.com/jjim-bbq/amp/',
        summary: '직원에게 공정한 임금을 주기 위해 엄격한 노팁 정책을 운영한다고 소개.',
      },
      {
        source: 'Community Impact (2020)',
        url: 'https://communityimpact.com/central-austin/impacts/new-korean-spot-jjim-bbq-to-open-in-lamar-union-this-fall/',
        summary: '자매 식당 Tso Chinese Delivery의 노팁 방침을 이 식당에도 적용한다고 오너가 밝힘.',
      },
      {
        source: 'Yelp',
        url: 'https://www.yelp.com/biz/jjim-korean-braised-bbq-austin',
        summary: '2026년 4월 기준 폐업(CLOSED)으로 표시됨. 폐업이라 목록에서 숨김.',
      },
    ],
  },
  {
    name: 'KPOT Korean BBQ & Hot Pot',
    tipPolicy: 'standard',
    confidence: 0.4,
    checkedAt: CHECKED,
    evidence: [
      {
        source: '체인 가격 안내글(타 지점 기준)',
        url: 'https://breakfastwithnick.com/2023/03/16/kpot-korean-bbq-hot-pot-columbus-ohio/',
        summary: '정액 요금에 음료와 팁은 별도라는 설명. 오스틴 지점을 직접 확인한 자료는 아니라서 신뢰도 낮음.',
      },
    ],
  },
  {
    name: 'Korea House',
    tipPolicy: 'unknown',
    confidence: 0.1,
    checkedAt: CHECKED,
    evidence: [
      {
        source: '행사 안내',
        url: 'https://ma.to/event/everyone-eats-free-korea-house-05-aug-2026',
        summary: '무료 식사 행사에서 팁은 선택이라는 안내만 있음. 평소 영업 정책이 아니라서 판단 근거로 쓰지 않음.',
      },
    ],
  },
  ...[
    'Chosun Galbi', 'Charm Korean BBQ', 'Chodang Tofu & BBQ', 'SoGongDong Tofu House', 'Honey Pig BBQ',
    'Gangnam Korean BBQ', 'Manna Korean Restaurant', 'Oseyo', 'SOHA Korean Restaurant', 'K-Bop',
    "Chi'Lantro (Domain/Burnet)", "Chi'Lantro (Downtown)", 'Korean Grill', 'An Nyeong K Tofu & BBQ',
    'Seoulju Korean Kitchen & Bar', "Mom's Taste", 'Gen Korean BBQ House', 'Gen Korean BBQ House (Pflugerville)',
    'K-Ramyun', 'Kochu Korean Eatery', 'Charm BBQ Chicken', 'Bonchon Round Rock',
  ].map(NONE),
];
