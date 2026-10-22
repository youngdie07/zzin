import { Outlet, Link, useLocation } from 'react-router-dom';
import { authService } from '../services/auth.service';
import './Layout.css';

function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <h1>찐 (ZZIN)</h1>
            <p>오스틴 한인 맛집</p>
          </Link>
          <nav className="nav">
            <Link to="/search" className="nav-link">검색</Link>
            <Link to="/map" className="nav-link">지도</Link>
            <Link to="/bookmarks" className="nav-link">북마크</Link>
            {authService.isAuthenticated() ? (
              <Link to="/my-page" className="nav-link">마이페이지</Link>
            ) : (
              <Link to="/login" className="nav-link">로그인</Link>
            )}
          </nav>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-nav">
            <Link to="/" className={`footer-link ${isActive('/')}`}>
              <span className="icon">🏠</span>
              <span>홈</span>
            </Link>
            <Link to="/search" className={`footer-link ${isActive('/search')}`}>
              <span className="icon">🔍</span>
              <span>검색</span>
            </Link>
            <Link to="/map" className={`footer-link ${isActive('/map')}`}>
              <span className="icon">🗺️</span>
              <span>지도</span>
            </Link>
            <Link to="/bookmarks" className={`footer-link ${isActive('/bookmarks')}`}>
              <span className="icon">⭐</span>
              <span>북마크</span>
            </Link>
            <Link to="/my-page" className={`footer-link ${isActive('/my-page')}`}>
              <span className="icon">👤</span>
              <span>MY</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
