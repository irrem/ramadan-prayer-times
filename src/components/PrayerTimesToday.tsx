import type { PrayerTimes } from '../types';

const LABELS: Record<keyof PrayerTimes, string> = {
  imsak: 'İmsak (Sahur biter)',
  gunes: 'Güneş',
  ogle: 'Öğle',
  ikindi: 'İkindi',
  aksam: 'Akşam (İftar)',
  yatsi: 'Yatsı',
};

interface PrayerTimesTodayProps {
  times: PrayerTimes;
  hijriDate?: string;
}

export function PrayerTimesToday({ times, hijriDate }: PrayerTimesTodayProps) {
  return (
    <section className="prayer-times-today card">
      <h2>Bugünkü namaz vakitleri</h2>
      {hijriDate && <p className="hijri">{hijriDate}</p>}
      <ul className="times-list">
        {(Object.keys(LABELS) as (keyof PrayerTimes)[]).map((key) => (
          <li key={key}>
            <span className="label">{LABELS[key]}</span>
            <span className="time">{times[key]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
