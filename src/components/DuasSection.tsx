import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { Dua } from '../types';
import { duas } from '../data/duas';

const CATEGORY_KEYS: Record<Dua['category'] | 'all', string> = {
  all: 'duas.filterAll',
  iftar: 'duas.filterIftar',
  sahur: 'duas.filterSahur',
  ramadan: 'duas.filterRamadan',
  general: 'duas.filterGeneral',
};

export function DuasSection() {
  const { locale, t } = useLanguage();
  const [category, setCategory] = useState<Dua['category'] | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = category === 'all' ? duas : duas.filter((d) => d.category === category);

  return (
    <section className="duas card">
      <h2>{t('duas.title')}</h2>
      <p className="duas-intro">{t('duas.intro')}</p>
      <div className="duas-filters">
        {(['all', 'iftar', 'sahur', 'ramadan', 'general'] as const).map((c) => (
          <button
            key={c}
            type="button"
            className={category === c ? 'active' : ''}
            onClick={() => setCategory(c)}
          >
            {t(CATEGORY_KEYS[c])}
          </button>
        ))}
      </div>
      <ul className="duas-list" data-focus-mode={expandedId ?? undefined}>
        {filtered.map((dua) => (
          <li key={dua.id} className={`dua-item ${expandedId === dua.id ? 'dua-item--focused' : ''}`}>
            <button
              type="button"
              className="dua-header"
              onClick={() => setExpandedId(expandedId === dua.id ? null : dua.id)}
              aria-expanded={expandedId === dua.id}
            >
              <span>{locale === 'en' ? dua.titleEn : dua.titleTr}</span>
              <span className="dua-header-right">
                <span className="dua-category">{t(CATEGORY_KEYS[dua.category])}</span>
                <span className="dua-chevron" aria-hidden>{expandedId === dua.id ? '▼' : '▶'}</span>
              </span>
            </button>
            {expandedId === dua.id && (
              <div className="dua-body">
                <p className="dua-arabic">{dua.arabic}</p>
                {dua.transliteration && (
                  <p className="dua-transliteration">{dua.transliteration}</p>
                )}
                <p className="dua-translation">{locale === 'en' ? dua.translationEn : (dua.translationTr ?? dua.translationEn)}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
