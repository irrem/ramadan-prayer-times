import { Outlet, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function Layout() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className="layout">
      <header className="sticky-header">
        <div className="sticky-header-inner">
          <Link to="/" className="logo-link">
            <span className="logo-text">{t('logo')}</span>
          </Link>
          <nav className="header-nav">
            <button
              type="button"
              className={`lang-toggle ${locale === 'tr' ? 'active' : ''}`}
              onClick={() => setLocale('tr')}
              aria-pressed={locale === 'tr'}
              title="Türkçe"
            >
              TR
            </button>
            <button
              type="button"
              className={`lang-toggle ${locale === 'en' ? 'active' : ''}`}
              onClick={() => setLocale('en')}
              aria-pressed={locale === 'en'}
              title="English"
            >
              EN
            </button>
            <Link to="/about">{t('nav.about')}</Link>
            <Link to="/privacy">{t('nav.privacy')}</Link>
          </nav>
        </div>
      </header>

      <main className="layout-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <p className="footer-copy">{t('footer.copy')}</p>
        <p className="footer-links">
          <Link to="/privacy">{t('nav.privacy')}</Link>
        </p>
        <p className="footer-credit">{t('footer.credit')}</p>
      </footer>
    </div>
  );
}
