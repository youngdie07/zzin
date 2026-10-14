import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Restaurant } from '../types';
import { restaurantService } from '../services/restaurant.service';
import RestaurantCard from '../components/RestaurantCard';

function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [input, setInput] = useState(q);
  const [results, setResults] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      restaurantService
        .getRestaurants(q ? { search: q, limit: 50 } : { limit: 50 })
        .then((res) => setResults(res.restaurants))
        .finally(() => setLoading(false));
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="container">
      <h2 className="page-title">검색</h2>
      <form
        className="search-bar"
        onSubmit={(e) => {
          e.preventDefault();
          setParams(input ? { q: input } : {});
        }}
      >
        <input
          autoFocus
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setParams(e.target.value ? { q: e.target.value } : {});
          }}
          placeholder="식당 이름, 음식 종류 (예: 국밥, 타코, 일식)"
        />
      </form>
      <p className="r-muted" style={{ margin: '12px 0' }}>
        {loading ? '검색 중...' : `${results.length}곳`}
      </p>
      <div className="r-grid">
        {results.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </div>
      {!loading && !results.length && <div className="empty">검색 결과가 없어요.</div>}
    </div>
  );
}

export default SearchPage;
