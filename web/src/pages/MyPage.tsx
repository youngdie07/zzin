import { authService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

function MyPage() {
  const navigate = useNavigate();
  const user = authService.getStoredUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="container">
      <h2>마이페이지</h2>
      {user && (
        <div>
          <p>이름: {user.name}</p>
          <p>이메일: {user.email}</p>
          <button onClick={handleLogout} className="btn btn-primary" style={{ marginTop: '20px' }}>
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
export default MyPage;
