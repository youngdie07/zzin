import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Restaurant } from '../types';
import { restaurantService } from '../services/restaurant.service';
import RestaurantCard from '../components/RestaurantCard';
import {
  CUISINES, NO_DISCRIMINATION, PROFILE, ProfileKey, QUICK_KEYWORDS, QUICK_PALATE, SITUATIONS, findKeyword, findPalate, getCuisineStyle,
} from '../utils/cuisine';

function HomePage() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [cuisine, setCuisine] = useState('전체');
  const [situation, setSituation] = useState('');
  const [noDiscrimination, setNoDiscrimination] = useState(false);
  const [palate, setPalate] = useState('');
  const [sort, setSort] = useState('rating');
  const [profileFilter, setProfileFilter] = useState<Partial<Record<ProfileKey, string>>>({});
  const [query, setQuery] = useState('');
  const [keyword, setKeyword] = useState('');
  const [noTip, setNoTip] = useState(false);

  useEffect(() => {
    const params: Record<string, unknown> = { sort, limit: 1000 };
    if (cuisine !== '전체') params.cuisineType = cuisine;
    if (situation) params.situation = situation;
    if (noDiscrimination) params.noDiscrimination = true;
    if (palate) params.palate = palate;
    if (keyword) params.keyword = keyword;
    if (noTip) params.tip = 'none';
    Object.entries(profileFilter).forEach(([k, v]) => v && (params[k] = v));

    setLoading(true);
    restaurantService
      .getRestaurants(params)
      .then((res) => setRestaurants(res.restaurants))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [cuisine, situation, noDiscrimination, palate, sort, profileFilter, keyword, noTip]);

  const toggleProfile = (key: ProfileKey, value: string) =>
    setProfileFilter((prev) => ({ ...prev, [key]: prev[key] === value ? undefined : value }));

  const pickRandom = () => {
    if (!restaurants.length) return;
    const r = restaurants[Math.floor(Math.random() * restaurants.length)];
    navigate(`/restaurant/${r.id}`);
  };

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
        <h3 className="section-title">누구랑 가세요?</h3>
        <div className="situation-grid">
          {SITUATIONS.map((s) => (
            <button
              key={s.key}
              className={`situation ${situation === s.key ? 'on' : ''}`}
              onClick={() => setSituation(situation === s.key ? '' : s.key)}
            >
              <span className="situation-emoji">{s.emoji}</span>
              <strong>{s.label}</strong>
              <small>{s.desc}</small>
            </button>
          ))}
        </div>

        <div className="filter-groups">
          {(Object.keys(PROFILE) as ProfileKey[]).map((k) => (
            <div key={k} className="filter-group">
              <span className="filter-group-title">{PROFILE[k].title}</span>
              {PROFILE[k].options
                .filter((o) => !(k === 'priceValue' && o.value === 'fair') && !['mixed', 'ok'].includes(o.value))
                .map((o) => (
                  <button
                    key={o.value}
                    className={`chip sm ${profileFilter[k] === o.value ? 'on' : ''}`}
                    onClick={() => toggleProfile(k, o.value)}
                    title={o.desc}
                  >
                    {o.emoji} {o.short}
                  </button>
                ))}
            </div>
          ))}
        </div>

        <div className="filter-groups" style={{ marginTop: 8 }}>
          <div className="filter-group">
            <span className="filter-group-title">입맛 포인트</span>
            {QUICK_PALATE.map((k) => {
              const info = findPalate(k)!;
              return (
                <button key={k} className={`chip sm ${palate === k ? 'on' : ''}`} onClick={() => setPalate(palate === k ? '' : k)}>
                  {info.emoji} {info.label}
                </button>
              );
            })}
          </div>
          <div className="filter-group">
            <span className="filter-group-title">편의</span>
            <button className={`chip sm ${noDiscrimination ? 'on' : ''}`} onClick={() => setNoDiscrimination(!noDiscrimination)}>
              {NO_DISCRIMINATION.emoji} {NO_DISCRIMINATION.label}
            </button>
            <button className={`chip sm ${noTip ? 'on' : ''}`} onClick={() => setNoTip(!noTip)}>
              💵 팁 안 줘도 돼요
            </button>
            {QUICK_KEYWORDS.map((k) => {
              const info = findKeyword(k)!;
              return (
                <button
                  key={k}
                  className={`chip sm ${keyword === k ? 'on' : ''}`}
                  onClick={() => setKeyword(keyword === k ? '' : k)}
                >
                  {info.emoji} {info.label}
                </button>
              );
            })}
          </div>
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
          <button className="pick-btn" onClick={pickRandom} disabled={!restaurants.length}>
            🎲 오늘 뭐 먹지?
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="select">
            <option value="rating">한인 평점순</option>
            <option value="value">가성비순</option>
            <option value="saves">저장 많은순</option>
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
          <div className="empty">
            {noTip
              ? "아직 '팁 안 받는 곳'으로 확인된 식당이 없어요. 다녀오신 곳이 있다면 리뷰에서 팁 정보를 알려주세요!"
              : '조건에 맞는 식당이 아직 없어요. 필터를 줄여보세요.'}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
