import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Restaurant } from '../types';
import { restaurantService } from '../services/restaurant.service';
import { authService } from '../services/auth.service';
import { reviewService } from '../services/review.service';
import {
  cuisineLabel, findKeyword, findOption, findPalate, findSituation, findTip, getCuisineStyle, NO_DISCRIMINATION, PROFILE_KEYS,
  priceLabel, profileFor,
} from '../utils/cuisine';

const stars = (n: number) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));

function RestaurantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [r, setR] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [saves, setSaves] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    restaurantService
      .getRestaurant(id)
      .then((d) => {
        setR(d);
        setSaves(d.bookmarkCount);
      })
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
    setSaves((n) => n + (res.bookmarked ? 1 : -1));
  };

  const onShare = async () => {
    await navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const onHelpful = async (reviewId: string) => {
    if (!authService.isAuthenticated()) return navigate('/login');
    try {
      const res = await reviewService.toggleHelpful(reviewId);
      setR((prev) =>
        prev
          ? {
              ...prev,
              reviews: prev.reviews?.map((x) =>
                x.id === reviewId ? { ...x, helpedByMe: res.helpful, isHelpful: res.count } : x
              ),
            }
          : prev
      );
    } catch (e: any) {
      alert(e.response?.data?.error || '처리하지 못했어요.');
    }
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
  const pctOf = (n: number) => (total ? Math.round((n / total) * 100) : 0);
  // 점수 옆 막대: 차별 없음 + 리뷰에서 많이 꼽힌 "누구랑" 상위 3개
  const bars = [
    { key: 'noDiscrimination', emoji: NO_DISCRIMINATION.emoji, label: NO_DISCRIMINATION.label, pct: pctOf(r.koreanStats.noDiscriminationCount) },
    ...r.highlights.situations
      .filter((h) => h.count > 0)
      .slice(0, 3)
      .map((h) => ({ key: h.key, emoji: findSituation(h.key)?.emoji, label: findSituation(h.key)?.label, pct: pctOf(h.count) })),
  ];
  const hasHighlights =
    r.highlights.keywords.length > 0 || r.highlights.menus.length > 0 || r.highlights.palate.length > 0 ||
    r.highlights.situations.length > 0 || r.highlights.orderTips.length > 0;

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
              {r.name} · {cuisineLabel(r)}
              {priceLabel(r.priceBand) && ` · 1인 ${priceLabel(r.priceBand)}`}
            </p>
          </div>
          <button className={`btn-bookmark ${bookmarked ? 'on' : ''}`} onClick={onBookmark}>
            {bookmarked ? '★ 저장됨' : '☆ 저장'} {saves}
          </button>
        </div>

        {r.editor?.note && (
          <div className="editor-note">
            ✍️ <b>에디터 한줄평</b> {r.editor.note}
          </div>
        )}

        {r.businessStatus === 'closed' && (
          <div className="notice warn">이 식당은 폐업한 것으로 확인돼요. 기록 보관용으로만 남겨두었어요.</div>
        )}

        <div className="action-row">
          {r.phoneNumber && (
            <a href={`tel:${r.phoneNumber}`} className="action-btn">
              📞 전화
            </a>
          )}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(r.name + ' ' + r.address)}`}
            target="_blank"
            rel="noreferrer"
            className="action-btn"
          >
            🧭 길찾기
          </a>
          <button className="action-btn" onClick={onShare}>
            {copied ? '✅ 복사됨' : '🔗 공유'}
          </button>
        </div>

        <div className="score-box">
          <div className="score-big">
            <strong>{r.reviewCount ? r.avgRating.toFixed(1) : '-'}</strong>
            <span className="r-star">{stars(r.avgRating)}</span>
            <small>한인 리뷰 {r.reviewCount}개</small>
          </div>
          <div className="score-bars">
            {bars.map((b) => (
              <div key={b.key} className="bar-row">
                <span className="bar-label">
                  {b.emoji} {b.label}
                </span>
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${b.pct}%` }} />
                </div>
                <span className="bar-pct">{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-box">
          <h3 className="section-title" style={{ marginTop: 0 }}>
            💵 팁 정보
          </h3>
          {(() => {
            const t = r.tip;
            const opt = findTip(t.policy);
            return (
              <>
                <div className="tip-head">
                  {opt ? (
                    <strong className={t.noTipNeeded ? 'tip-good' : ''}>
                      {opt.emoji} {opt.label}
                    </strong>
                  ) : (
                    <strong>❔ 아직 확인되지 않았어요</strong>
                  )}
                  {t.source === 'editor' && <span className="badge tip">찐 에디터 확인</span>}
                  {t.source === 'users' && <span className="badge">한인 리뷰 {t.userReports.total}명 기준</span>}
                  {t.source === 'ai' && <span className="badge profile">AI 웹 조사 · 신뢰도 {Math.round((t.confidence ?? 0) * 100)}%</span>}
                </div>
                {t.userReports.total > 0 && t.source !== 'users' && (
                  <div className="r-muted small" style={{ marginTop: 6 }}>
                    한인 제보 {t.userReports.total}건 (3명 이상 같은 답이 모이면 반영돼요)
                  </div>
                )}
                {t.ai.evidence.length > 0 && (
                  <ul className="evidence">
                    {t.ai.evidence.map((e, i) => (
                      <li key={i}>
                        {e.url ? (
                          <a href={e.url} target="_blank" rel="noreferrer">
                            {e.source}
                          </a>
                        ) : (
                          <span>{e.source}</span>
                        )}
                        {' - '}
                        {e.summary}
                      </li>
                    ))}
                  </ul>
                )}
                {t.source !== 'editor' && (

                <div className="r-muted small" style={{ marginTop: 8 }}>
                  AI가 웹 검색으로 조사한 정보라 틀릴 수 있어요
                  {t.ai.checkedAt ? ` (조사일 ${new Date(t.ai.checkedAt).toLocaleDateString('ko-KR')})` : ''}. 다녀오셨다면 리뷰에서
                  알려주세요.
                </div>

                )}
              </>
            );
          })()}
        </div>

        <div className="profile-box">
          <h3 className="section-title" style={{ marginTop: 0 }}>
            이 식당은 어떤 곳?
          </h3>
          {PROFILE_KEYS.map((k) => {
            const d = r.profile[k];
            const def = profileFor(k, r.cuisineType);
            const pick = findOption(k, d.top, r.cuisineType);
            return (
              <div key={k} className="profile-row">
                <div className="profile-title">{def.title}</div>
                {d.editor && pick && (
                  <div className="editor-pick">
                    ✍️ 찐 에디터 선정 · {pick.emoji} {pick.label}
                  </div>
                )}
                {d.total ? (
                  <>
                    <div className="seg-bar">
                      {def.options.map((o, i) =>
                        d.counts[o.value] ? (
                          <div key={o.value} className={`seg seg-${i}`} style={{ flex: d.counts[o.value] }} />
                        ) : null
                      )}
                    </div>
                    <div className="seg-legend">
                      {def.options.map((o, i) => (
                        <span key={o.value} className={d.top === o.value ? 'top' : ''}>
                          <i className={`dot seg-${i}`} />
                          {o.emoji} {o.short} {Math.round((d.counts[o.value] / d.total) * 100)}%
                        </span>
                      ))}
                    </div>
                  </>
                ) : d.editor ? null : (
                  <div className="r-muted">아직 답변이 없어요</div>
                )}
              </div>
            );
          })}
        </div>

        {hasHighlights && (
          <div className="profile-box">
            {r.highlights.palate.length > 0 && (
              <div className="profile-row">
                <div className="profile-title">😋 한국인 입맛 포인트</div>
                <div className="r-card-badges">
                  {r.highlights.palate.map((h) => {
                    const info = findPalate(h.key);
                    return info ? (
                      <span key={h.key} className="badge palate">
                        {info.emoji} {info.label} {h.count > 0 && <b>{h.count}</b>}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            {r.highlights.orderTips.length > 0 && (
              <div className="profile-row">
                <div className="profile-title">💡 이렇게 주문하세요</div>
                <ul className="order-tips">
                  {r.highlights.orderTips.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
            {r.highlights.situations.length > 0 && (
              <div className="profile-row">
                <div className="profile-title">누구랑 가기 좋아요</div>
                <div className="r-card-badges">
                  {r.highlights.situations.map((h) => {
                    const info = findSituation(h.key);
                    return info ? (
                      <span key={h.key} className="badge">
                        {info.emoji} {info.label} {h.count > 0 && <b>{h.count}</b>}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            {r.highlights.menus.length > 0 && (
              <div className="profile-row">
                <div className="profile-title">🍽️ 이거 시켜 드세요 (한인 추천 메뉴)</div>
                <div className="r-card-badges">
                  {r.highlights.menus.map((m) => (
                    <span key={m.name} className="badge menu">
                      {m.name} {m.count > 1 && <b>{m.count}</b>}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {r.highlights.keywords.length > 0 && (
              <div className="profile-row">
                <div className="profile-title">이런 점이 자주 언급돼요</div>
                <div className="r-card-badges">
                  {r.highlights.keywords.map((k) => {
                    const info = findKeyword(k.key);
                    return info ? (
                      <span key={k.key} className="badge kw">
                        {info.emoji} {info.label} {k.count > 0 && <b>{k.count}</b>}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        )}

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
            {!!rv.menus?.length && <div className="r-muted small" style={{ marginBottom: 8 }}>🍽️ 추천: {rv.menus.join(', ')}</div>}
            {rv.orderTip && <div className="r-muted small" style={{ marginBottom: 8 }}>💡 주문 팁: {rv.orderTip}</div>}
            <div className="r-card-badges">
              {PROFILE_KEYS.map((k) => {
                const o = findOption(k, rv[k], r.cuisineType);
                return o ? (
                  <span key={k} className="badge profile">
                    {o.emoji} {o.short}
                  </span>
                ) : null;
              })}
              {findTip(rv.tipReport) && (
                <span className="badge tip">
                  {findTip(rv.tipReport)!.emoji} {findTip(rv.tipReport)!.short}
                </span>
              )}
              {rv.keywords?.map((key) => {
                const info = findKeyword(key);
                return info ? (
                  <span key={key} className="badge kw">
                    {info.emoji} {info.label}
                  </span>
                ) : null;
              })}
              {rv.palate?.map((key) => {
                const info = findPalate(key);
                return info ? (
                  <span key={key} className="badge palate">
                    {info.emoji} {info.label}
                  </span>
                ) : null;
              })}
              {rv.situations?.map((key) => {
                const info = findSituation(key);
                return info ? (
                  <span key={key} className="badge">
                    {info.emoji} {info.label}
                  </span>
                ) : null;
              })}
              {rv.noDiscrimination && (
                <span className="badge">
                  {NO_DISCRIMINATION.emoji} {NO_DISCRIMINATION.label}
                </span>
              )}
            </div>
            <button className={`helpful ${rv.helpedByMe ? 'on' : ''}`} onClick={() => onHelpful(rv.id)}>
              👍 도움이 됐어요 {rv.isHelpful > 0 && rv.isHelpful}
            </button>
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
