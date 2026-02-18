/** Bugün ne pişirsem? – günlük sabit bir öneri (aynı gün herkese aynı). */
export const meals: string[] = [
  'Mercimek çorbası + pilav',
  'Zeytinyağlı taze fasulye + bulgur',
  'Etli nohut + salata',
  'Tarhana çorbası + makarna',
  'Kuru fasulye + pilav',
  'İmam bayıldı + yoğurt',
  'Tavuk sote + pirinç pilavı',
  'Karnıyarık + cacık',
  'Ispanak yemeği + bulgur',
  'Köfte + patates püresi',
  'Bamya + pilav',
  'Tavuk çorbası + makarna',
  'Kıymalı kabak + salata',
  'Nohut yemeği + pilav',
  'Kısır + gözleme',
  'Biber dolması + yoğurt',
  'Tavuk göğsü + sebze',
  'Kuru köfte + pilav',
  'Pırasa yemeği + bulgur',
  'Etli yaprak sarma + cacık',
];

export function getMealOfDay(): string {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = Date.now() - start.getTime();
  const dayIndex = Math.floor(diff / (1000 * 60 * 60 * 24));
  return meals[dayIndex % meals.length];
}
