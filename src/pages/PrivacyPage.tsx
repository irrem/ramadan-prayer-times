import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function PrivacyPage() {
  const { t } = useLanguage();
  return (
    <div className="app static-page privacy-page">
      <div className="static-content card">
        <h1>{t('privacy.title')}</h1>
        <p>{t('privacy.p1')}</p>
        <p>{t('privacy.p2')}</p>
        <p>{t('privacy.p3')}</p>
        <p className="static-back">
          <Link to="/">{t('privacy.back')}</Link>
        </p>
      </div>
    </div>
  );
}
