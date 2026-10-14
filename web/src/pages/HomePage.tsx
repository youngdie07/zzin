import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Restaurant } from '../types';
import { restaurantService } from '../services/restaurant.service';
import RestaurantCard from '../components/RestaurantCard';
import { CUISINES, KOREAN_TAGS, getCuisineStyle } from '../utils/cuisine';

function HomePage() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [cuisine, setCuisine] = useState('전체');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sort, setSort] = useState('rating');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const params: Record<string, unknown> = { sort, limit: 50 };
    if (cuisine !== '전체') params.cuisineType = cuisine;
    activeTags.forEach((t) => (params[t] = true));

    setLoading(true);
    restaurantService
      .getRestaurants(params)
      .then((res) => setRestaurants(res.restaurants))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [cuisine, activeTags, sort]);

  const toggleTag = (param: string) =>
    setActiveTags((prev) => (prev.includes(param) ? prev.filter((t) => t !== param) : [...prev, param]));

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div>
      <section className="hero">
        <div className="container">
          <p className="hero-eyebrow">AUSTIN, TX · 한인 전용 맛집 평가</p>
          <h2>
            미국 평점 말고,
            <br />
            <span>한국인이 직접 먹어본</span> 오스틴 맛집
          </h2>
          <p className="hero-desc">한식이든 아니든 상관없어요. 한국인 입맛과 상황에 맞는지만 봅니다.</p>
          <form className="hero-search" onSubmit={onSearch}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="식당 이름, 음식 종류로 검색 (예: 라멘, 국밥)"
            />
            <button type="submit">검색</button>
          </form>
        </div>
      </section>

      <div className="container">
        <h3 className="section-title">어떤 상황이세요?</h3>
        <div className="situation-grid">
          {KOREAN_TAGS.map((t) => (
            <button
              key={t.param}
              className={`situation ${activeTags.includes(t.param) ? 'on' : ''}`}
              onClick={() => toggleTag(t.param)}
            >
              <span className="situation-emoji">{t.emoji}</span>
              <strong>{t.label}</strong>
              <small>{t.desc}</small>
            </button>
          ))}
        </div>

        <div className="chip-row">
          {CUISINES.map((c) => (
            <button key={c} className={`chip ${cuisine === c ? 'on' : ''}`} onClick={() => setCuisine(c)}>
              {c !== '전체' && getCuisineStyle(c).emoji} {c}
            </button>
          ))}
        </div>

        <div className="list-head">
          <h3 className="section-title" style={{ margin: 0 }}>
            {loading ? '불러오는 중...' : `${restaurants.length}곳`}
          </h3>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="select">
            <option value="rating">한인 평점순</option>
            <option value="reviews">리뷰 많은순</option>
            <option value="recent">최신 등록순</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : restaurants.length ? (
          <div className="r-grid">
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        ) : (
          <div className="empty">조건에 맞는 식당이 아직 없어요. 필터를 줄여보세요.</div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
