// 사용자 타입
export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  phoneNumber?: string;
  createdAt: string;
}

// 음식점 타입
export interface Restaurant {
  id: string;
  name: string;
  nameKorean?: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber?: string;
  cuisineType: string;
  subCuisine?: string | null;
  priceBand?: string | null;
  website?: string;
  hours?: any;
  images: string[];
  description?: string;
  avgRating: number;
  reviewCount: number;
  bookmarkCount: number;
  koreanStats: KoreanStats;
  profile: RestaurantProfile;
  tip: TipInfo;
  noDiscrimination: boolean;
  editor: {
    authenticity: string | null;
    palateFit: string | null;
    priceValue: string | null;
    crowd: string | null;
    tip: string | null;
    palate: string[];
    situations: string[];
    keywords: string[];
    menus: string[];
    orderTip: string | null;
    note: string | null;
    source: 'editor' | 'ai';
    aiNote: string | null;
    updatedAt: string | null;
  } | null;
  businessStatus?: string;
  highlights: {
    keywords: KeyCount[];
    palate: KeyCount[];
    situations: KeyCount[];
    menus: { name: string; count: number; editor?: boolean }[];
    orderTips: string[];
  };
  tags?: RestaurantTag[];
  reviews?: Review[];
}

export interface KeyCount {
  key: string;
  count: number;
  editor?: boolean;
}

// 식당 성향 집계
export interface ProfileDist {
  counts: Record<string, number>;
  total: number;
  top: string | null;
  editor?: boolean;
}

export interface TipInfo {
  policy: 'no_tip' | 'included' | 'optional' | 'standard' | 'unknown';
  source: 'editor' | 'users' | 'ai' | null;
  confidence: number | null;
  noTipNeeded: boolean;
  userReports: { counts: Record<string, number>; total: number };
  ai: {
    policy: string | null;
    confidence: number | null;
    evidence: { source: string; url?: string; summary: string }[];
    checkedAt: string | null;
  };
}

export interface RestaurantProfile {
  authenticity: ProfileDist;
  palateFit: ProfileDist;
  priceValue: ProfileDist;
  crowd: ProfileDist;
}

// 한국인 맞춤 통계
export interface KoreanStats {
  noDiscriminationCount: number;
  totalReviews: number;
}

// 리뷰 타입
export interface Review {
  id: string;
  userId: string;
  restaurantId: string;
  rating: number;
  content: string;
  images: string[];
  tasteRating?: number;
  serviceRating?: number;
  atmosphereRating?: number;
  noDiscrimination: boolean;
  authenticity?: string | null;
  palateFit?: string | null;
  priceValue?: string | null;
  crowd?: string | null;
  keywords?: string[];
  palate?: string[];
  situations?: string[];
  menus?: string[];
  orderTip?: string | null;
  tipReport?: string | null;
  helpedByMe?: boolean;
  likes: number;
  isHelpful: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    profileImage?: string;
  };
  restaurant?: {
    id: string;
    name: string;
    nameKorean?: string;
  };
}

// 태그 타입
export interface Tag {
  id: string;
  name: string;
  nameKorean: string;
  description?: string;
  icon?: string;
  category: string;
}

// 음식점-태그 매핑
export interface RestaurantTag {
  tagId: string;
  count: number;
  tag: Tag;
}

// 북마크 타입
export interface Bookmark {
  id: string;
  userId: string;
  restaurantId: string;
  note?: string;
  createdAt: string;
  restaurant: Restaurant;
}

// 인증 응답
export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// 페이지네이션 타입
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 음식점 목록 응답
export interface RestaurantsResponse {
  restaurants: Restaurant[];
  pagination: Pagination;
}

// 리뷰 목록 응답
export interface ReviewsResponse {
  reviews: Review[];
  pagination: Pagination;
}
