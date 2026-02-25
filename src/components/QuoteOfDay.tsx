import { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getHadithOfDay } from '../data/hadiths';

export function QuoteOfDay() {
  const { locale, t } = useLanguage();
  const hadith = useMemo(() => getHadithOfDay(), []);

  const translation = locale === 'en' ? hadith.en : hadith.tr;

  return (
    <section className="quote-of-day card hadith-section">
      <h2>{t('hadith.title')}</h2>
      <p className="hadith-arabic" dir="rtl" lang="ar">{hadith.arabic}</p>
      <blockquote className="hadith-translation">{translation}</blockquote>
      <p className="hadith-source">{t('hadith.source')}</p>
    </section>
  );
}
