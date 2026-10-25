import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Restaurant } from '../types';
import { restaurantService } from '../services/restaurant.service';
import RestaurantCard from '../components/RestaurantCard';

const POPULAR = ['고기', '국밥', '순두부', '치킨', '해장', '가족모임', '회식', '혼밥', '냉면', '분식'];
const RECENT_KEY = 'zzin_recent_searches';

const loadRecent = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch {
    return [];
  }
};

function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [input, setInput] = useState(q);
  const [results, setResults] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>(loadRecent);

  useEffect(() => {
    if (!q) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => {
      setLoading(true);
      restaurantService
        .getRestaurants({ search: q, limit: 1000 })
        .then((res) => setResults(res.restaurants))
        .finally(() => setLoading(false));
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  const run = (term: string) => {
    const v = term.trim();
    setInput(v);
    setParams(v ? { q: v } : {});
    if (v) {
      const next = [v, ...recent.filter((x) => x !== v)].slice(0, 8);
      setRecent(next);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    }
  };

  const clearRecent = () => {
    setRecent([]);
    localStorage.removeItem(RECENT_KEY);
  };

  return (
    <div className="container">
      <h2 className="page-title">검색</h2>
      <form
        className="search-bar"
        onSubmit={(e) => {
          e.preventDefault();
          run(input);
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

      {!q && (
        <div className="search-suggest">
          {recent.length > 0 && (
            <>
              <h4>
                최근 검색어
                <button className="clear" onClick={clearRecent}>
                  전체 삭제
                </button>
              </h4>
              <div className="kw-pick">
                {recent.map((t) => (
                  <button key={t} className="chip sm" onClick={() => run(t)}>
                    🕘 {t}
                  </button>
                ))}
              </div>
            </>
          )}
          <h4>인기 검색어</h4>
          <div className="kw-pick">
            {POPULAR.map((t) => (
              <button key={t} className="chip sm" onClick={() => run(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {q && (
        <p className="r-muted" style={{ margin: '12px 0' }}>
          {loading ? '검색 중...' : `${results.length}곳`}
        </p>
      )}
      <div className="r-grid">
        {results.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </div>
      {q && !loading && !results.length && <div className="empty">검색 결과가 없어요.</div>}
    </div>
  );
}

export default SearchPage;
