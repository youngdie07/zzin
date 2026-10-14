import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { reviewService } from '../services/review.service';
import { Review } from '../types';

function MyPage() {
  const navigate = useNavigate();
  const user = authService.getStoredUser();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    reviewService.getUserReviews().then(setReviews).catch(() => undefined);
  }, []);

  const logout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <div className="card profile">
        <div className="avatar big">{user?.name?.[0]}</div>
        <div style={{ flex: 1 }}>
          <h2>{user?.name}</h2>
          <p className="r-muted">{user?.email}</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={logout}>
          로그아웃
        </button>
      </div>

      <h3 className="section-title">내가 쓴 리뷰 {reviews.length}</h3>
      {reviews.map((rv) => (
        <Link key={rv.id} to={`/restaurant/${rv.restaurantId}`} className="review" style={{ display: 'block' }}>
          <div className="review-head">
            <strong>{rv.restaurant?.nameKorean || rv.restaurant?.name}</strong>
            <span className="review-rating">
              <span className="r-star">★</span> {rv.rating.toFixed(1)}
            </span>
          </div>
          <p>{rv.content}</p>
        </Link>
      ))}
      {!reviews.length && <div className="empty">아직 작성한 리뷰가 없어요.</div>}
    </div>
  );
}

export default MyPage;
