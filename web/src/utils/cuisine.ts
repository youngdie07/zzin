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
