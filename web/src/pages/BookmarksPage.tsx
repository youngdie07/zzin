import { useEffect, useState } from 'react';
import { Restaurant } from '../types';
import { restaurantService } from '../services/restaurant.service';
import RestaurantCard from '../components/RestaurantCard';

function BookmarksPage() {
  const [items, setItems] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restaurantService
      .getUserBookmarks()
      .then((b) => setItems(b.map((x) => x.restaurant)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <h2 className="page-title">저장한 식당</h2>
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : items.length ? (
        <div className="r-grid">
          {items.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      ) : (
        <div className="empty">아직 저장한 식당이 없어요. 마음에 드는 곳에서 ☆ 저장을 눌러보세요.</div>
      )}
    </div>
  );
}

export default BookmarksPage;
