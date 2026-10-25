import api from './api';
import { Review, ReviewsResponse } from '../types';

export const reviewService = {
  // 리뷰 생성
  async createReview(data: {
    restaurantId: string;
    rating: number;
    content: string;
    images?: string[];
    tasteRating?: number;
    serviceRating?: number;
    atmosphereRating?: number;
    noDiscrimination?: boolean;
    authenticity?: string;
    palateFit?: string;
    priceValue?: string;
    crowd?: string;
    keywords?: string[];
    palate?: string[];
    situations?: string[];
    menus?: string[];
    orderTip?: string;
    tipReport?: string;
  }): Promise<{ message: string; review: Review }> {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  // 도움이 됐어요 토글
  async toggleHelpful(reviewId: string): Promise<{ helpful: boolean; count: number }> {
    const response = await api.post(`/reviews/${reviewId}/helpful`);
    return response.data;
  },

  // 리뷰 수정
  async updateReview(
    reviewId: string,
    data: Partial<{
      rating: number;
      content: string;
      images: string[];
      tasteRating: number;
      serviceRating: number;
      atmosphereRating: number;
      goodForFamily: boolean;
      noDiscrimination: boolean;
      authenticKorean: boolean;
      koreanFriendly: boolean;
    }>
  ): Promise<{ message: string; review: Review }> {
    const response = await api.put(`/reviews/${reviewId}`, data);
    return response.data;
  },

  // 리뷰 삭제
  async deleteReview(reviewId: string): Promise<{ message: string }> {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  // 사용자 리뷰 목록
  async getUserReviews(): Promise<Review[]> {
    const response = await api.get<Review[]>('/reviews/user');
    return response.data;
  },

  // 음식점 리뷰 목록
  async getRestaurantReviews(
    restaurantId: string,
    params?: {
      sortBy?: 'recent' | 'rating_high' | 'rating_low' | 'helpful';
      page?: number;
      limit?: number;
    }
  ): Promise<ReviewsResponse> {
    const response = await api.get<ReviewsResponse>(
      `/reviews/restaurant/${restaurantId}`,
      { params }
    );
    return response.data;
  },
};
