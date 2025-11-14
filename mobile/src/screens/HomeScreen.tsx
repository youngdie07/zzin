import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { Restaurant } from '../types';
import { restaurantService } from '../services/restaurant.service';
import { RootStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  const categories = [
    { id: 'all', name: '전체', icon: 'restaurant' },
    { id: 'korean', name: '한식', icon: 'bowl' },
    { id: 'american', name: '양식', icon: 'pizza' },
    { id: 'japanese', name: '일식', icon: 'fish' },
    { id: 'chinese', name: '중식', icon: 'nutrition' },
    { id: 'thai', name: '태국', icon: 'leaf' },
  ];

  const koreanFilters = [
    { id: 'family', label: '가족 동반 추천', icon: 'people' },
    { id: 'authentic', label: '정통 한식', icon: 'checkmark-circle' },
    { id: 'friendly', label: '한국인 친화적', icon: 'heart' },
    { id: 'no-discrimination', label: '차별 없음', icon: 'shield-checkmark' },
  ];

  useEffect(() => {
    loadRestaurants();
  }, [selectedCategory]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const response = await restaurantService.getRestaurants({
        cuisineType: selectedCategory === '전체' ? undefined : selectedCategory,
        limit: 20,
      });
      setRestaurants(response.restaurants);
    } catch (error) {
      console.error('Failed to load restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRestaurantCard = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() =>
        navigation.navigate('RestaurantDetail', { restaurantId: item.id })
      }
    >
      <Image
        source={{
          uri: item.images[0] || 'https://via.placeholder.com/300x200',
        }}
        style={styles.restaurantImage}
      />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        {item.nameKorean && (
          <Text style={styles.restaurantNameKorean}>{item.nameKorean}</Text>
        )}
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.avgRating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({item.reviewCount})</Text>
        </View>
        <Text style={styles.cuisineType}>{item.cuisineType}</Text>
        <Text style={styles.priceRange}>{'$'.repeat(item.priceRange)}</Text>

        {/* 한국인 맞춤 통계 */}
        <View style={styles.koreanStats}>
          {item.koreanStats.goodForFamilyCount > 0 && (
            <View style={styles.statBadge}>
              <Icon name="people" size={12} color="#4CAF50" />
              <Text style={styles.statText}>가족 {item.koreanStats.goodForFamilyCount}</Text>
            </View>
          )}
          {item.koreanStats.authenticKoreanCount > 0 && (
            <View style={styles.statBadge}>
              <Icon name="checkmark-circle" size={12} color="#2196F3" />
              <Text style={styles.statText}>정통 {item.koreanStats.authenticKoreanCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>찐 (ZZIN)</Text>
        <Text style={styles.headerSubtitle}>오스틴 한인 맛집</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Icon name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* 카테고리 필터 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.name && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category.name)}
          >
            <Icon
              name={category.icon}
              size={20}
              color={selectedCategory === category.name ? '#fff' : '#666'}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.name && styles.categoryTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 한국인 맞춤 필터 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
      >
        {koreanFilters.map((filter) => (
          <TouchableOpacity key={filter.id} style={styles.filterChip}>
            <Icon name={filter.icon} size={16} color="#FF6B6B" />
            <Text style={styles.filterText}>{filter.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 음식점 목록 */}
      {loading ? (
        <ActivityIndicator size="large" color="#FF6B6B" style={styles.loader} />
      ) : (
        <FlatList
          data={restaurants}
          renderItem={renderRestaurantCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={loadRestaurants}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF6B6B',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  searchButton: {
    position: 'absolute',
    right: 20,
    top: 50,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
  },
  categoryScroll: {
    backgroundColor: '#fff',
    paddingVertical: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  categoryButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  filterScroll: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    backgroundColor: '#fff',
  },
  filterText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#FF6B6B',
  },
  listContainer: {
    padding: 12,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  restaurantImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#e0e0e0',
  },
  restaurantInfo: {
    padding: 12,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  restaurantNameKorean: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  rating: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewCount: {
    marginLeft: 4,
    fontSize: 14,
    color: '#999',
  },
  cuisineType: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  priceRange: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 2,
  },
  koreanStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginTop: 4,
  },
  statText: {
    marginLeft: 4,
    fontSize: 11,
    color: '#666',
  },
  loader: {
    marginTop: 40,
  },
});

export default HomeScreen;
