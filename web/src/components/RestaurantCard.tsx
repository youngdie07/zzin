import { Link } from 'react-router-dom';
import { Restaurant } from '../types';
import { getCuisineStyle, KOREAN_TAGS } from '../utils/cuisine';

function RestaurantCard({ restaurant: r }: { restaurant: Restaurant }) {
  const style = getCuisineStyle(r.cuisineType);
  const total = r.koreanStats?.totalReviews || 0;
  const badges = KOREAN_TAGS.map((t) => ({
    ...t,
    pct: total ? Math.round(((r.koreanStats as any)[t.statKey] / total) * 100) : 0,
  }))
    .filter((t) => t.pct >= 60)
    .slice(0, 3);

  return (
    <Link to={`/restaurant/${r.id}`} className="r-card">
      <div
        className="r-card-cover"
        style={{
          background: r.images?.[0]
            ? `url(${r.images[0]}) center/cover`
            : `linear-gradient(135deg, ${style.from}, ${style.to})`,
        }}
      >
        {!r.images?.[0] && <span className="r-card-emoji">{style.emoji}</span>}
        <span className="r-card-cuisine">{r.cuisineType}</span>
      </div>
      <div className="r-card-body">
        <div className="r-card-title">
          <h3>{r.nameKorean || r.name}</h3>
          <span className="r-card-price">{'$'.repeat(r.priceRange)}</span>
        </div>
        {r.nameKorean && <p className="r-card-sub">{r.name}</p>}
        <div className="r-card-rating">
          <span className="r-star">★</span>
          <strong>{r.reviewCount ? r.avgRating.toFixed(1) : '-'}</strong>
          <span className="r-muted">한인 리뷰 {r.reviewCount}개</span>
        </div>
        <div className="r-card-badges">
          {badges.map((b) => (
            <span key={b.param} className="badge">
              {b.emoji} {b.label} {b.pct}%
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default RestaurantCard;
