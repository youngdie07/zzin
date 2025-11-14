import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { Restaurant, Review } from '../types';
import { restaurantService } from '../services/restaurant.service';
import { RootStackParamList } from '../navigation/types';

type RestaurantDetailRouteProp = RouteProp<RootStackParamList, 'RestaurantDetail'>;
type RestaurantDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RestaurantDetail'
>;

const RestaurantDetailScreen = () => {
  const route = useRoute<RestaurantDetailRouteProp>();
  const navigation = useNavigation<RestaurantDetailNavigationProp>();
  const { restaurantId } = route.params;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    loadRestaurant();
  }, [restaurantId]);

  const loadRestaurant = async () => {
    try {
      setLoading(true);
      const data = await restaurantService.getRestaurant(restaurantId);
      setRestaurant(data);
    } catch (error) {
      console.error('Failed to load restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    try {
      const result = await restaurantService.toggleBookmark(restaurantId);
      setIsBookmarked(result.bookmarked);
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const handleCall = () => {
    if (restaurant?.phoneNumber) {
      Linking.openURL(`tel:${restaurant.phoneNumber}`);
    }
  };

  const handleWebsite = () => {
    if (restaurant?.website) {
      Linking.openURL(restaurant.website);
    }
  };

  const handleWriteReview = () => {
    navigation.navigate('ReviewWrite', { restaurantId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.loadingContainer}>
        <Text>음식점을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 이미지 갤러리 */}
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
        {restaurant.images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={styles.image}
          />
        ))}
      </ScrollView>

      <View style={styles.content}>
        {/* 기본 정보 */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.name}>{restaurant.name}</Text>
            {restaurant.nameKorean && (
              <Text style={styles.nameKorean}>{restaurant.nameKorean}</Text>
            )}
          </View>
          <TouchableOpacity onPress={handleBookmark} style={styles.bookmarkButton}>
            <Icon
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={28}
              color="#FF6B6B"
            />
          </TouchableOpacity>
        </View>

        {/* 평점 */}
        <View style={styles.ratingSection}>
          <View style={styles.ratingBox}>
            <Icon name="star" size={24} color="#FFD700" />
            <Text style={styles.ratingText}>{restaurant.avgRating.toFixed(1)}</Text>
          </View>
          <Text style={styles.reviewCountText}>
            {restaurant.reviewCount}개의 리뷰
          </Text>
          <Text style={styles.priceRange}>
            {'$'.repeat(restaurant.priceRange)}
          </Text>
        </View>

        {/* 한국인 맞춤 통계 */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>한국인 평가</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Icon name="people" size={24} color="#4CAF50" />
              <Text style={styles.statLabel}>가족 동반</Text>
              <Text style={styles.statValue}>
                {restaurant.koreanStats.goodForFamilyCount}명 추천
              </Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="shield-checkmark" size={24} color="#2196F3" />
              <Text style={styles.statLabel}>차별 없음</Text>
              <Text style={styles.statValue}>
                {restaurant.koreanStats.noDiscriminationCount}명 인증
              </Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="checkmark-circle" size={24} color="#FF9800" />
              <Text style={styles.statLabel}>정통 한식</Text>
              <Text style={styles.statValue}>
                {restaurant.koreanStats.authenticKoreanCount}명 추천
              </Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="heart" size={24} color="#E91E63" />
              <Text style={styles.statLabel}>한국인 친화</Text>
              <Text style={styles.statValue}>
                {restaurant.koreanStats.koreanFriendlyCount}명 추천
              </Text>
            </View>
          </View>
        </View>

        {/* 상세 정보 */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>정보</Text>

          <View style={styles.infoItem}>
            <Icon name="location" size={20} color="#666" />
            <Text style={styles.infoText}>{restaurant.address}</Text>
          </View>

          {restaurant.phoneNumber && (
            <TouchableOpacity style={styles.infoItem} onPress={handleCall}>
              <Icon name="call" size={20} color="#666" />
              <Text style={styles.infoText}>{restaurant.phoneNumber}</Text>
            </TouchableOpacity>
          )}

          {restaurant.website && (
            <TouchableOpacity style={styles.infoItem} onPress={handleWebsite}>
              <Icon name="globe" size={20} color="#666" />
              <Text style={styles.infoText}>웹사이트</Text>
            </TouchableOpacity>
          )}

          <View style={styles.infoItem}>
            <Icon name="restaurant" size={20} color="#666" />
            <Text style={styles.infoText}>{restaurant.cuisineType}</Text>
          </View>
        </View>

        {/* 설명 */}
        {restaurant.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>소개</Text>
            <Text style={styles.description}>{restaurant.description}</Text>
          </View>
        )}

        {/* 리뷰 섹션 */}
        <View style={styles.reviewSection}>
          <View style={styles.reviewHeader}>
            <Text style={styles.sectionTitle}>리뷰</Text>
            <TouchableOpacity onPress={handleWriteReview}>
              <Text style={styles.writeReviewButton}>리뷰 작성</Text>
            </TouchableOpacity>
          </View>

          {restaurant.reviews && restaurant.reviews.length > 0 ? (
            restaurant.reviews.slice(0, 3).map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewerInfo}>
                  <Image
                    source={{
                      uri: review.user?.profileImage || 'https://via.placeholder.com/40',
                    }}
                    style={styles.reviewerAvatar}
                  />
                  <View>
                    <Text style={styles.reviewerName}>{review.user?.name}</Text>
                    <View style={styles.reviewRating}>
                      <Icon name="star" size={14} color="#FFD700" />
                      <Text style={styles.reviewRatingText}>{review.rating.toFixed(1)}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewContent}>{review.content}</Text>
                <View style={styles.reviewBadges}>
                  {review.goodForFamily && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>가족 추천</Text>
                    </View>
                  )}
                  {review.authenticKorean && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>정통 한식</Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noReviews}>아직 리뷰가 없습니다.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 400,
    height: 250,
    backgroundColor: '#e0e0e0',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  nameKorean: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  bookmarkButton: {
    padding: 8,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  reviewCountText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
  },
  priceRange: {
    marginLeft: 12,
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  statsSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  infoSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  descriptionSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  reviewSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  writeReviewButton: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  reviewRatingText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  reviewContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  reviewBadges: {
    flexDirection: 'row',
    marginTop: 8,
  },
  badge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    color: '#fff',
  },
  noReviews: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 24,
  },
});

export default RestaurantDetailScreen;
