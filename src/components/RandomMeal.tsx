import { useMemo } from 'react';
import { getMealOfDay } from '../data/meals';

export function RandomMeal() {
  const meal = useMemo(() => getMealOfDay(), []);

  return (
    <section className="random-meal card">
      <h2>Bugün ne pişirsem?</h2>
      <p className="meal-suggestion">{meal}</p>
    </section>
  );
}
