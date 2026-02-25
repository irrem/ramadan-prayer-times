import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function AboutPage() {
  const { t } = useLanguage();
  return (
    <div className="app static-page about-page">
      <div className="static-content card">
        <h1>{t('about.title')}</h1>
        <p>{t('about.p1')}</p>
        <p>{t('about.p2')}</p>
        <p>{t('about.p3')}</p>
        <p className="static-back">
          <Link to="/">{t('about.back')}</Link>
        </p>
      </div>
    </div>
  );
}
