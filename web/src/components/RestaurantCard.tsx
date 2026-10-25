import { Link } from 'react-router-dom';
import { KeyCount, Restaurant } from '../types';
import {
  cuisineLabel, findKeyword, findOption, findPalate, findSituation, getCuisineStyle, priceLabel, PROFILE_KEYS,
} from '../utils/cuisine';

function RestaurantCard({ restaurant: r }: { restaurant: Restaurant }) {
  const style = getCuisineStyle(r.cuisineType);
  const total = r.koreanStats?.totalReviews || 0;
  // 에디터가 골랐거나 리뷰 절반 이상이 고른 항목만 카드에 노출
  const strong = (h: KeyCount) => h.editor || (total > 0 && h.count / total >= 0.5);

  const profileBadges = PROFILE_KEYS.map((k) => {
    const d = r.profile?.[k];
    if (!d?.top) return null;
    if (!d.editor && (d.total < 1 || d.counts[d.top] / d.total < 0.5)) return null;
    const o = findOption(k, d.top, r.cuisineType);
    return o ? { key: k, text: `${o.emoji} ${o.short}`, pct: d.total ? Math.round((d.counts[d.top] / d.total) * 100) : 100 } : null;
  }).filter(Boolean) as { key: string; text: string; pct: number }[];

  const room = Math.max(0, 4 - profileBadges.length);
  const palateBadges = (r.highlights?.palate ?? []).filter(strong).map((h) => findPalate(h.key)).filter(Boolean).slice(0, 1);
  const situationBadges = (r.highlights?.situations ?? [])
    .filter(strong)
    .map((h) => findSituation(h.key))
    .filter(Boolean)
    .slice(0, Math.max(0, room - palateBadges.length));

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
        <span className="r-card-cuisine">{cuisineLabel(r)}</span>
      </div>
      <div className="r-card-body">
        <div className="r-card-title">
          <h3>{r.nameKorean || r.name}</h3>
          {priceLabel(r.priceBand) && <span className="r-card-price">{priceLabel(r.priceBand)}</span>}
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
          {palateBadges.map((b) => (
            <span key={b!.key} className="badge palate">
              {b!.emoji} {b!.label}
            </span>
          ))}
          {situationBadges.map((b) => (
            <span key={b!.key} className="badge">
              {b!.emoji} {b!.label}
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
