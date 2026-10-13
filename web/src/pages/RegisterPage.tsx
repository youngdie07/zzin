import { Link } from 'react-router-dom';
import './AuthPage.css';

function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>찐 (ZZIN)</h1>
          <p>오스틴 한인 맛집</p>
        </div>
        <div className="auth-form">
          <h2>회원가입</h2>
          <p style={{ textAlign: 'center', color: '#666' }}>준비 중입니다</p>
          <div className="auth-footer">
            <p>이미 계정이 있으신가요?</p>
            <Link to="/login" className="link">로그인</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
