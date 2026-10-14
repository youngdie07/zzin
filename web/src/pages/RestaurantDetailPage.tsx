import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Restaurant } from '../types';
import { restaurantService } from '../services/restaurant.service';
import { authService } from '../services/auth.service';
import { getCuisineStyle, KOREAN_TAGS } from '../utils/cuisine';

const stars = (n: number) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));

function RestaurantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [r, setR] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    restaurantService
      .getRestaurant(id)
      .then(setR)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
    if (authService.isAuthenticated()) {
      restaurantService
        .getUserBookmarks()
        .then((b) => setBookmarked(b.some((x) => x.restaurantId === id)))
        .catch(() => undefined);
    }
  }, [id]);

  const onBookmark = async () => {
    if (!authService.isAuthenticated()) return navigate('/login');
    const res = await restaurantService.toggleBookmark(id!);
    setBookmarked(res.bookmarked);
  };

  if (loading)
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  if (!r) return <div className="container empty">식당을 찾을 수 없어요.</div>;

  const style = getCuisineStyle(r.cuisineType);
  const total = r.koreanStats.totalReviews;

  return (
    <div>
      <div className="detail-cover" style={{ background: `linear-gradient(135deg, ${style.from}, ${style.to})` }}>
        <span>{style.emoji}</span>
      </div>

      <div className="container detail">
        <Link to="/" className="back">
          ← 목록으로
        </Link>

        <div className="detail-head">
          <div>
            <h2>{r.nameKorean || r.name}</h2>
            <p className="r-muted">
              {r.name} · {r.cuisineType} · {'$'.repeat(r.priceRange)}
            </p>
          </div>
          <button className={`btn-bookmark ${bookmarked ? 'on' : ''}`} onClick={onBookmark}>
            {bookmarked ? '★ 저장됨' : '☆ 저장'}
          </button>
        </div>

        <div className="score-box">
          <div className="score-big">
            <strong>{r.reviewCount ? r.avgRating.toFixed(1) : '-'}</strong>
            <span className="r-star">{stars(r.avgRating)}</span>
            <small>한인 리뷰 {r.reviewCount}개</small>
          </div>
          <div className="score-bars">
            {KOREAN_TAGS.map((t) => {
              const pct = total ? Math.round(((r.koreanStats as any)[t.statKey] / total) * 100) : 0;
              return (
                <div key={t.param} className="bar-row">
                  <span className="bar-label">
                    {t.emoji} {t.label}
                  </span>
                  <div className="bar">
                    <div className="bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="bar-pct">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {r.description && <p className="detail-desc">{r.description}</p>}

        <div className="info-list">
          <div>📍 {r.address}</div>
          {r.phoneNumber && <div>📞 {r.phoneNumber}</div>}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name + ' ' + r.address)}`}
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            🗺️ 구글맵에서 보기
          </a>
        </div>

        <div className="list-head">
          <h3 className="section-title" style={{ margin: 0 }}>
            한인 리뷰 {r.reviewCount}
          </h3>
          <Link to={`/review/write/${r.id}`} className="btn btn-primary btn-sm">
            ✏️ 리뷰 쓰기
          </Link>
        </div>

        {r.reviews?.map((rv) => (
          <div key={rv.id} className="review">
            <div className="review-head">
              <div className="avatar">{rv.user?.name?.[0]}</div>
              <div>
                <strong>{rv.user?.name}</strong>
                <div className="r-muted small">{new Date(rv.createdAt).toLocaleDateString('ko-KR')}</div>
              </div>
              <span className="review-rating">
                <span className="r-star">★</span> {rv.rating.toFixed(1)}
              </span>
            </div>
            <p>{rv.content}</p>
            <div className="r-card-badges">
              {KOREAN_TAGS.filter((t) => (rv as any)[t.param]).map((t) => (
                <span key={t.param} className="badge">
                  {t.emoji} {t.label}
                </span>
              ))}
            </div>
            {rv.tasteRating && (
              <div className="subratings">
                맛 {rv.tasteRating} · 서비스 {rv.serviceRating} · 분위기 {rv.atmosphereRating}
              </div>
            )}
          </div>
        ))}
        {!r.reviews?.length && <div className="empty">아직 리뷰가 없어요. 첫 리뷰를 남겨주세요!</div>}
      </div>
    </div>
  );
}

export default RestaurantDetailPage;
