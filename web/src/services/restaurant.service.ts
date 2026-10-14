import api from './api';
import { Restaurant, RestaurantsResponse, Bookmark } from '../types';

export const restaurantService = {
  // 음식점 목록 조회
  async getRestaurants(params?: Record<string, unknown> | {
    search?: string;
    cuisineType?: string;
    priceRange?: number;
    minRating?: number;
    tags?: string[];
    latitude?: number;
    longitude?: number;
    radius?: number;
    page?: number;
    limit?: number;
  }): Promise<RestaurantsResponse> {
    const response = await api.get<RestaurantsResponse>('/restaurants', {
      params,
    });
    return response.data;
  },

  // 음식점 상세 조회
  async getRestaurant(id: string): Promise<Restaurant> {
    const response = await api.get<Restaurant>(`/restaurants/${id}`);
    return response.data;
  },

  // 음식점 생성
  async createRestaurant(data: {
    name: string;
    nameKorean?: string;
    address: string;
    latitude: number;
    longitude: number;
    phoneNumber?: string;
    cuisineType: string;
    priceRange?: number;
    website?: string;
    hours?: any;
    images?: string[];
    description?: string;
  }): Promise<{ message: string; restaurant: Restaurant }> {
    const response = await api.post('/restaurants', data);
    return response.data;
  },

  // 북마크 토글
  async toggleBookmark(
    restaurantId: string
  ): Promise<{ message: string; bookmarked: boolean }> {
    const response = await api.post(`/restaurants/${restaurantId}/bookmark`);
    return response.data;
  },

  // 사용자 북마크 목록
  async getUserBookmarks(): Promise<Bookmark[]> {
    const response = await api.get<Bookmark[]>('/restaurants/bookmarks');
    return response.data;
  },

  // 근처 음식점 검색
  async getNearbyRestaurants(
    latitude: number,
    longitude: number,
    radius: number = 5
  ): Promise<RestaurantsResponse> {
    return this.getRestaurants({
      latitude,
      longitude,
      radius,
      limit: 50,
    });
  },

  // 한국인 추천 음식점
  async getKoreanRecommended(params?: {
    goodForFamily?: boolean;
    authenticKorean?: boolean;
    koreanFriendly?: boolean;
    page?: number;
  }): Promise<RestaurantsResponse> {
    // 백엔드에서 한국인 맞춤 필터링 로직 구현 필요
    return this.getRestaurants(params);
  },
};
