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
  priceRange: number;
  website?: string;
  hours?: any;
  images: string[];
  description?: string;
  avgRating: number;
  reviewCount: number;
  bookmarkCount: number;
  koreanStats: KoreanStats;
  profile: RestaurantProfile;
  highlights: { keywords: { key: string; count: number }[]; menus: { name: string; count: number }[] };
  tags?: RestaurantTag[];
  reviews?: Review[];
}

// 식당 성향 집계
export interface ProfileDist {
  counts: Record<string, number>;
  total: number;
  top: string | null;
}

export interface RestaurantProfile {
  authenticity: ProfileDist;
  priceValue: ProfileDist;
  crowd: ProfileDist;
}

// 한국인 맞춤 통계
export interface KoreanStats {
  goodForFamilyCount: number;
  noDiscriminationCount: number;
  authenticKoreanCount: number;
  koreanFriendlyCount: number;
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
  goodForFamily: boolean;
  noDiscrimination: boolean;
  authenticKorean: boolean;
  koreanFriendly: boolean;
  authenticity?: string | null;
  priceValue?: string | null;
  crowd?: string | null;
  keywords?: string[];
  menus?: string[];
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
