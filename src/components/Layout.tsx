import { Outlet, Link } from 'react-router-dom';

export function Layout() {
  return (
    <div className="layout">
      <header className="sticky-header">
        <div className="sticky-header-inner">
          <Link to="/" className="logo-link">
            <span className="logo-text">Rukiye İmsakiye</span>
          </Link>
          <nav className="header-nav">
            <Link to="/about">Hakkında</Link>
            <Link to="/privacy">Gizlilik</Link>
          </nav>
        </div>
      </header>

      <main className="layout-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p className="footer-copy">© 2026 Rukiye İmsakiye</p>
        <p className="footer-links">
          <Link to="/privacy">Gizlilik</Link>
        </p>
        <p className="footer-credit">Vakitler Diyanet İşleri Başkanlığı verilerine göredir.</p>
      </footer>
    </div>
  );
}
