import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Restaurant } from '../types';
import { restaurantService } from '../services/restaurant.service';
import './HomePage.css';

function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const categories = [
    { id: 'all', name: '전체' },
    { id: '한식', name: '한식' },
    { id: '양식', name: '양식' },
    { id: '일식', name: '일식' },
    { id: '중식', name: '중식' },
    { id: '태국', name: '태국' },
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

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="container">
        {/* 카테고리 필터 */}
        <div className="categories">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* 한국인 맞춤 필터 */}
        <div className="korean-filters">
          <div className="filter-chip">👨‍👩‍👧‍👦 가족 동반 추천</div>
          <div className="filter-chip">🛡️ 차별 없음</div>
          <div className="filter-chip">✅ 정통 한식</div>
          <div className="filter-chip">❤️ 한국인 친화적</div>
        </div>

        {/* 음식점 목록 */}
        <div className="restaurants-grid">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              to={`/restaurant/${restaurant.id}`}
              className="restaurant-card"
            >
              <div
                className="restaurant-image"
                style={{
                  backgroundImage: `url(${restaurant.images?.[0] || 'https://via.placeholder.com/400x300'})`,
                }}
              />
              <div className="restaurant-info">
                <h3 className="restaurant-name">{restaurant.name}</h3>
                {restaurant.nameKorean && (
                  <p className="restaurant-name-korean">{restaurant.nameKorean}</p>
                )}
                <div className="restaurant-rating">
                  <span className="star">⭐</span>
                  <span className="rating">{restaurant.avgRating?.toFixed(1) || '0.0'}</span>
                  <span className="review-count">({restaurant.reviewCount || 0})</span>
                </div>
                <div className="restaurant-meta">
                  <span className="cuisine">{restaurant.cuisineType}</span>
                  <span className="price">{'$'.repeat(restaurant.priceRange || 2)}</span>
                </div>

                {/* 한국인 통계 */}
                {restaurant.koreanStats && (
                  <div className="korean-stats">
                    {restaurant.koreanStats.goodForFamilyCount > 0 && (
                      <span className="stat-badge">👨‍👩‍👧‍👦 {restaurant.koreanStats.goodForFamilyCount}</span>
                    )}
                    {restaurant.koreanStats.authenticKoreanCount > 0 && (
                      <span className="stat-badge">✅ {restaurant.koreanStats.authenticKoreanCount}</span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {restaurants.length === 0 && !loading && (
          <div className="empty-state">
            <p>음식점이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
