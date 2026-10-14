import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import './AuthPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || form.password.length < 6) {
      setError('이름, 이메일, 6자 이상의 비밀번호를 입력해주세요.');
      return;
    }
    try {
      setLoading(true);
      await authService.register(form);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>찐 (ZZIN)</h1>
          <p>오스틴 한인 맛집</p>
        </div>
        <form className="auth-form" onSubmit={submit}>
          <h2>회원가입</h2>
          {error && <div className="error-message">{error}</div>}
          <input className="input" placeholder="이름 (리뷰에 표시돼요)" value={form.name} onChange={set('name')} />
          <input className="input" type="email" placeholder="이메일" value={form.email} onChange={set('email')} />
          <input
            className="input"
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={form.password}
            onChange={set('password')}
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? '가입 중...' : '가입하기'}
          </button>
          <div className="auth-footer">
            <p>이미 계정이 있으신가요?</p>
            <Link to="/login" className="link">
              로그인
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
