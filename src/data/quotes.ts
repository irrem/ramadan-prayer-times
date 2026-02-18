/** Günün cümlesi – her gün aynı cümle (gün indexine göre) veya rastgele. */
export const quotes: string[] = [
  'Sabır, ışığa açılan kapıdır.',
  'İftar vakti, paylaşmanın en güzel anıdır.',
  'Ramazan, kalbi arındıran bir aydır.',
  'Sahurla başlayan gün, bereketle dolar.',
  'Az söz, çok öz.',
  'Yüreğin sakin olsun; her şey vaktinde güzel.',
  'Oruç, nefsi terbiye eden bir ibadettir.',
  'Bugün bir iyilik yap; yarın seni bulur.',
  'Sükût bazen en güzel cevaptır.',
  'Ramazan, rahmet ve mağfiret ayıdır.',
  'İftar sofrası, birlikte olmanın tadıdır.',
  'Sabahın bereketi, niyetle başlar.',
  'Küçük iyilikler, büyük sevaba dönüşür.',
  'Kalp temiz olunca, dua kabul olur.',
  'Bugün dünü affet; yarın bugünü güzelleştir.',
  'Oruç, sadece aç kalmak değil; gönül terbiyesidir.',
  'Paylaştıkça artan tek şey sevgidir.',
  'Sahur vakti, sessiz bir niyettir.',
  'Ramazan biter; güzel alışkanlıklar kalır.',
  'Sakin bir nefes, büyük bir nimettir.',
];

export function getQuoteOfDay(): string {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = Date.now() - start.getTime();
  const dayIndex = Math.floor(diff / (1000 * 60 * 60 * 24));
  return quotes[dayIndex % quotes.length];
}
