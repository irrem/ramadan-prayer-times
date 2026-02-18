import { useMemo } from 'react';
import { getQuoteOfDay } from '../data/quotes';

export function QuoteOfDay() {
  const quote = useMemo(() => getQuoteOfDay(), []);

  return (
    <section className="quote-of-day card">
      <h2>Günün cümlesi</h2>
      <blockquote className="quote-text">{quote}</blockquote>
    </section>
  );
}
