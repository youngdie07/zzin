import { Link } from 'react-router-dom';
import { Restaurant } from '../types';
import { findKeyword, findOption, getCuisineStyle, KOREAN_TAGS, PROFILE_KEYS } from '../utils/cuisine';

function RestaurantCard({ restaurant: r }: { restaurant: Restaurant }) {
  const style = getCuisineStyle(r.cuisineType);
  const total = r.koreanStats?.totalReviews || 0;

  const profileBadges = PROFILE_KEYS.map((k) => {
    const d = r.profile?.[k];
    if (!d?.top) return null;
    if (!d.editor && (d.total < 1 || d.counts[d.top] / d.total < 0.5)) return null;
    const o = findOption(k, d.top);
    return o ? { key: k, text: `${o.emoji} ${o.short}`, pct: d.total ? Math.round((d.counts[d.top] / d.total) * 100) : 100 } : null;
  }).filter(Boolean) as { key: string; text: string; pct: number }[];

  const situationBadges = KOREAN_TAGS.filter((t) => t.param !== 'authenticKorean')
    .map((t) => ({ ...t, pct: total ? Math.round(((r.koreanStats as any)[t.statKey] / total) * 100) : 0 }))
    .filter((t) => t.pct >= 60 || !!r.editor?.situations.includes(t.param))
    .slice(0, Math.max(0, 4 - profileBadges.length));

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
          {r.bookmarkCount > 0 && <span className="r-muted">· ☆ {r.bookmarkCount}</span>}
        </div>
        <div className="r-card-badges">
          {r.tip?.noTipNeeded && (
            <span className="badge tip">
              💵 {r.tip.policy === 'included' ? '팁 포함' : '팁 안 받아요'}
              {r.tip.source === 'ai' ? ' (AI 조사)' : ''}
            </span>
          )}
          {profileBadges.map((b) => (
            <span key={b.key} className="badge profile">
              {b.text}
            </span>
          ))}
          {situationBadges.map((b) => (
            <span key={b.param} className="badge">
              {b.emoji} {b.label}
            </span>
          ))}
          {r.highlights?.keywords.slice(0, 2).map((k) => {
            const info = findKeyword(k.key);
            return info ? (
              <span key={k.key} className="badge kw">
                {info.emoji} {info.label}
              </span>
            ) : null;
          })}
          {!profileBadges.length && !situationBadges.length && r.reviewCount === 0 && (
            <span className="r-muted">첫 리뷰를 기다리고 있어요</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default RestaurantCard;
