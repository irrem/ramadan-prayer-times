import { useState } from 'react';
import type { Dua } from '../types';
import { duas } from '../data/duas';

const CATEGORIES: { value: Dua['category'] | 'all'; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'iftar', label: 'İftar' },
  { value: 'sahur', label: 'Sahur' },
  { value: 'ramadan', label: 'Ramazan' },
  { value: 'general', label: 'Genel' },
];

const CATEGORY_LABELS: Record<Dua['category'], string> = {
  iftar: 'İftar',
  sahur: 'Sahur',
  ramadan: 'Ramazan',
  general: 'Genel',
};

export function DuasSection() {
  const [category, setCategory] = useState<Dua['category'] | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = category === 'all' ? duas : duas.filter((d) => d.category === category);

  return (
    <section className="duas card">
      <h2>Okunacak dualar</h2>
      <p className="duas-intro">İftar, sahur ve Ramazan&apos;da okuyabileceğiniz dualar.</p>
      <div className="duas-filters">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            className={category === c.value ? 'active' : ''}
            onClick={() => setCategory(c.value)}
          >
            {c.label}
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
              <span>{dua.titleTr}</span>
              <span className="dua-header-right">
                <span className="dua-category">{CATEGORY_LABELS[dua.category]}</span>
                <span className="dua-chevron" aria-hidden>{expandedId === dua.id ? '▼' : '▶'}</span>
              </span>
            </button>
            {expandedId === dua.id && (
              <div className="dua-body">
                <p className="dua-arabic">{dua.arabic}</p>
                {dua.transliteration && (
                  <p className="dua-transliteration">{dua.transliteration}</p>
                )}
                <p className="dua-translation">{dua.translationTr ?? dua.translationEn}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
