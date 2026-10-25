import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reviewService } from '../services/review.service';
import { restaurantService } from '../services/restaurant.service';
import { TIP_OPTIONS, KEYWORDS, NO_DISCRIMINATION, PALATE, PROFILE_KEYS, ProfileKey, SITUATIONS, profileFor } from '../utils/cuisine';

function StarInput({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="star-input">
      <span>{label}</span>
      <div>
        {[1, 2, 3, 4, 5].map((n) => (
          <button type="button" key={n} className={n <= value ? 'on' : ''} onClick={() => onChange(n)}>
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

function ReviewWritePage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [rating, setRating] = useState(5);
  const [taste, setTaste] = useState(5);
  const [service, setService] = useState(5);
  const [atmosphere, setAtmosphere] = useState(5);
  const [content, setContent] = useState('');
  const [noDiscrimination, setNoDiscrimination] = useState(true);
  const [profile, setProfile] = useState<Partial<Record<ProfileKey, string>>>({});
  const [situations, setSituations] = useState<string[]>([]);
  const [palate, setPalate] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [menus, setMenus] = useState('');
  const [orderTip, setOrderTip] = useState('');
  const [tipReport, setTipReport] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!restaurantId) return;
    restaurantService.getRestaurant(restaurantId).then((r) => {
      setName(r.nameKorean || r.name);
      setCuisine(r.cuisineType);
    });
  }, [restaurantId]);

  const toggleIn = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (k: string) =>
    setter((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  const toggleKeyword = toggleIn(setKeywords);
  const toggleSituation = toggleIn(setSituations);
  const togglePalate = toggleIn(setPalate);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return setError('리뷰 내용을 작성해주세요.');
    try {
      setSaving(true);
      await reviewService.createReview({
        restaurantId: restaurantId!,
        rating,
        content,
        tasteRating: taste,
        serviceRating: service,
        atmosphereRating: atmosphere,
        noDiscrimination,
        ...profile,
        situations,
        palate,
        keywords,
        tipReport: tipReport || undefined,
        menus: menus.split(',').map((m) => m.trim()).filter(Boolean),
        orderTip: orderTip.trim() || undefined,
      });
      navigate(`/restaurant/${restaurantId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || '리뷰 작성에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 680 }}>
      <h2 className="page-title">{name ? `${name} 리뷰` : '리뷰 쓰기'}</h2>
      <form className="card form-card" onSubmit={submit}>
        <StarInput label="전체 평점" value={rating} onChange={setRating} />
        <StarInput label="맛" value={taste} onChange={setTaste} />
        <StarInput label="서비스" value={service} onChange={setService} />
        <StarInput label="분위기" value={atmosphere} onChange={setAtmosphere} />

        {PROFILE_KEYS.map((k) => (
          <div key={k} className="q-block">
            <h4>{profileFor(k, cuisine).question}</h4>
            <div className="opt-grid">
              {profileFor(k, cuisine).options.filter((o) => !o.hidden).map((o) => (
                <button
                  type="button"
                  key={o.value}
                  className={`situation ${profile[k] === o.value ? 'on' : ''}`}
                  onClick={() => setProfile({ ...profile, [k]: profile[k] === o.value ? undefined : o.value })}
                >
                  <span className="situation-emoji">{o.emoji}</span>
                  <strong>{o.label}</strong>
                  <small>{o.desc}</small>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="q-block">
          <h4>입맛 포인트를 골라주세요 (여러 개)</h4>
          <div className="kw-pick">
            {PALATE.map((p) => (
              <button
                type="button"
                key={p.key}
                className={`chip ${palate.includes(p.key) ? 'on' : ''}`}
                onClick={() => togglePalate(p.key)}
              >
                {p.emoji} {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="q-block">
          <h4>누구랑 가기 좋아요?</h4>
          <div className="kw-pick">
            {SITUATIONS.map((s) => (
              <button
                type="button"
                key={s.key}
                className={`chip ${situations.includes(s.key) ? 'on' : ''}`}
                onClick={() => toggleSituation(s.key)}
              >
                {s.emoji} {s.label}
              </button>
            ))}
            <button
              type="button"
              className={`chip ${noDiscrimination ? 'on' : ''}`}
              onClick={() => setNoDiscrimination(!noDiscrimination)}
            >
              {NO_DISCRIMINATION.emoji} {NO_DISCRIMINATION.label}
            </button>
          </div>
        </div>

        <div className="q-block">
          <h4>해당되는 걸 모두 골라주세요</h4>
          <div className="kw-pick">
            {KEYWORDS.map((k) => (
              <button
                type="button"
                key={k.key}
                className={`chip ${keywords.includes(k.key) ? 'on' : ''}`}
                onClick={() => toggleKeyword(k.key)}
              >
                {k.emoji} {k.label}
              </button>
            ))}
          </div>
        </div>

        <div className="q-block">
          <h4>팁은 어떻게 하셨어요?</h4>
          <div className="opt-grid four">
            {TIP_OPTIONS.map((o) => (
              <button
                type="button"
                key={o.value}
                className={`situation ${tipReport === o.value ? 'on' : ''}`}
                onClick={() => setTipReport(tipReport === o.value ? '' : o.value)}
              >
                <span className="situation-emoji">{o.emoji}</span>
                <strong>{o.label}</strong>
                <small>{o.desc}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="q-block">
          <h4>추천 메뉴 (쉼표로 구분, 최대 5개)</h4>
          <input className="input" placeholder="예: 갈비탕, 비빔밥" value={menus} onChange={(e) => setMenus(e.target.value)} />
        </div>

        <div className="q-block">
          <h4>주문 팁 (선택)</h4>
          <input
            className="input"
            maxLength={120}
            placeholder="예: 덜 짜게 해달라고(less salt) 하세요, 핫소스는 따로 달라고 해야 줘요"
            value={orderTip}
            onChange={(e) => setOrderTip(e.target.value)}
          />
        </div>

        <textarea
          className="input"
          rows={6}
          placeholder="한국인 입맛에는 어땠나요? 가족과 가기 좋은지, 직원 응대는 어땠는지도 알려주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {error && <div className="error-message">{error}</div>}
        <button className="btn btn-primary" style={{ width: '100%' }} disabled={saving}>
          {saving ? '등록 중...' : '리뷰 등록'}
        </button>
      </form>
    </div>
  );
}

export default ReviewWritePage;
