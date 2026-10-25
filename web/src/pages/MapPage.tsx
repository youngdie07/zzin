import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Restaurant } from '../types';
import { restaurantService } from '../services/restaurant.service';
import { KOREAN_SUBS, findSub, getCuisineStyle, cuisineLabel, priceLabel } from '../utils/cuisine';

const AUSTIN: [number, number] = [30.2672, -97.7431];

// 두 좌표 사이 거리 (마일)
const milesBetween = (a: [number, number], b: [number, number]) => {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b[0] - a[0]);
  const dLng = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(h));
};

const pinIcon = (r: Restaurant, active: boolean) => {
  const style = getCuisineStyle(r.cuisineType);
  const emoji = findSub(r.subCuisine)?.emoji ?? style.emoji;
  return L.divIcon({
    className: '',
    html: `<div class="map-pin ${active ? 'active' : ''}" style="background:linear-gradient(135deg,${style.from},${style.to})"><span>${emoji}</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -32],
  });
};

// 선택한 식당이나 내 위치로 지도를 이동
function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, Math.max(map.getZoom(), 14), { duration: 0.6 });
  }, [target, map]);
  return null;
}

function MapPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [me, setMe] = useState<[number, number] | null>(null);
  const [locError, setLocError] = useState('');
  const [target, setTarget] = useState<[number, number] | null>(null);

  useEffect(() => {
    const params: Record<string, unknown> = { limit: 1000 };
    if (sub) params.subCuisine = sub;
    setLoading(true);
    restaurantService
      .getRestaurants(params)
      .then((res) => setRestaurants(res.restaurants))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [sub]);

  const locate = () => {
    if (!navigator.geolocation) return setLocError('이 브라우저는 위치 확인을 지원하지 않아요.');
    setLocError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setMe(p);
        setTarget(p);
      },
      () => setLocError('위치 권한이 없어서 오스틴 중심 기준으로 보여드려요.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const list = useMemo(() => {
    const withDist = restaurants.map((r) => ({ r, dist: me ? milesBetween(me, [r.latitude, r.longitude]) : null }));
    return me ? withDist.sort((a, b) => a.dist! - b.dist!) : withDist;
  }, [restaurants, me]);

  const select = (r: Restaurant) => {
    setSelected(r.id);
    setTarget([r.latitude, r.longitude]);
    // 모바일에서는 목록이 지도 아래에 있어서 지도로 다시 올려줌
    document.querySelector('.map-wrap')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="map-page">
      <div className="container">
        <div className="chip-row">
          <button className={`chip ${!sub ? 'on' : ''}`} onClick={() => setSub('')}>
            전체 한식
          </button>
          {KOREAN_SUBS.map((s) => (
            <button key={s.key} className={`chip ${sub === s.key ? 'on' : ''}`} onClick={() => setSub(sub === s.key ? '' : s.key)}>
              {s.emoji} {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container map-layout">
        <div className="map-wrap">
          <MapContainer center={AUSTIN} zoom={11} scrollWheelZoom className="map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FlyTo target={target} />
            {me && <CircleMarker center={me} radius={8} pathOptions={{ color: '#fff', weight: 3, fillColor: '#3b82f6', fillOpacity: 1 }} />}
            {restaurants.map((r) => (
              <Marker
                key={r.id}
                position={[r.latitude, r.longitude]}
                icon={pinIcon(r, r.id === selected)}
                eventHandlers={{ click: () => setSelected(r.id) }}
              >
                <Popup>
                  <div className="map-popup">
                    <strong>{r.nameKorean || r.name}</strong>
                    <div>
                      {cuisineLabel(r)}
                      {priceLabel(r.priceBand) && ` · ${priceLabel(r.priceBand)}`} · ★ {r.reviewCount ? r.avgRating.toFixed(1) : '-'}
                    </div>
                    {r.tip?.noTipNeeded && <div>💵 {r.tip.policy === 'included' ? '팁 포함' : '팁 안 받아요'}</div>}
                    <Link to={`/restaurant/${r.id}`}>자세히 보기 →</Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          <button className="locate-btn" onClick={locate}>
            📍 내 주변
          </button>
        </div>

        <aside className="map-list">
          <div className="map-list-head">
            <strong>{loading ? '불러오는 중...' : `${restaurants.length}곳`}</strong>
            <span className="r-muted">{me ? '가까운 순' : '내 주변을 누르면 가까운 순으로 정렬돼요'}</span>
          </div>
          {locError && <p className="map-error">{locError}</p>}
          {list.map(({ r, dist }) => (
            <div
              key={r.id}
              role="button"
              tabIndex={0}
              className={`map-item ${r.id === selected ? 'on' : ''}`}
              onClick={() => select(r)}
              onKeyDown={(e) => e.key === 'Enter' && select(r)}
            >
              <span className="map-item-emoji">{findSub(r.subCuisine)?.emoji ?? getCuisineStyle(r.cuisineType).emoji}</span>
              <span className="map-item-body">
                <strong>{r.nameKorean || r.name}</strong>
                <span className="r-muted">
                  {cuisineLabel(r)} · ★ {r.reviewCount ? r.avgRating.toFixed(1) : '-'}
                  {dist !== null && ` · ${dist < 0.1 ? '바로 근처' : `${dist.toFixed(1)} mi`}`}
                </span>
              </span>
              <Link to={`/restaurant/${r.id}`} className="map-item-go" onClick={(e) => e.stopPropagation()}>
                →
              </Link>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

export default MapPage;
