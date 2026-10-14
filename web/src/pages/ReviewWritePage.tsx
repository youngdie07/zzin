import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reviewService } from '../services/review.service';
import { KOREAN_TAGS } from '../utils/cuisine';

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
  const [rating, setRating] = useState(5);
  const [taste, setTaste] = useState(5);
  const [service, setService] = useState(5);
  const [atmosphere, setAtmosphere] = useState(5);
  const [content, setContent] = useState('');
  const [flags, setFlags] = useState<Record<string, boolean>>({ noDiscrimination: true });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

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
        goodForFamily: !!flags.goodForFamily,
        noDiscrimination: !!flags.noDiscrimination,
        authenticKorean: !!flags.authenticKorean,
        koreanFriendly: !!flags.koreanFriendly,
      });
      navigate(`/restaurant/${restaurantId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || '리뷰 작성에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <h2 className="page-title">리뷰 쓰기</h2>
      <form className="card form-card" onSubmit={submit}>
        <StarInput label="전체 평점" value={rating} onChange={setRating} />
        <StarInput label="맛" value={taste} onChange={setTaste} />
        <StarInput label="서비스" value={service} onChange={setService} />
        <StarInput label="분위기" value={atmosphere} onChange={setAtmosphere} />

        <h4 style={{ margin: '20px 0 8px' }}>한국인에게 어떤 곳인가요?</h4>
        <div className="situation-grid">
          {KOREAN_TAGS.map((t) => (
            <button
              type="button"
              key={t.param}
              className={`situation ${flags[t.param] ? 'on' : ''}`}
              onClick={() => setFlags({ ...flags, [t.param]: !flags[t.param] })}
            >
              <span className="situation-emoji">{t.emoji}</span>
              <strong>{t.label}</strong>
              <small>{t.desc}</small>
            </button>
          ))}
        </div>

        <textarea
          className="input"
          rows={6}
          style={{ marginTop: 16 }}
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
