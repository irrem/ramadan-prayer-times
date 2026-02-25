import { useLanguage } from '../context/LanguageContext';
import type { PrayerTimes } from '../types';

const LABEL_KEYS: Record<keyof PrayerTimes, string> = {
  imsak: 'prayer.imsakSahur',
  gunes: 'prayer.gunes',
  ogle: 'prayer.ogle',
  ikindi: 'prayer.ikindi',
  aksam: 'prayer.aksamIftar',
  yatsi: 'prayer.yatsi',
};

interface PrayerTimesTodayProps {
  times: PrayerTimes;
  hijriDate?: string;
}

export function PrayerTimesToday({ times, hijriDate }: PrayerTimesTodayProps) {
  const { t } = useLanguage();
  return (
    <section className="prayer-times-today card">
      <h2>{t('prayer.todayTitle')}</h2>
      {hijriDate && <p className="hijri">{hijriDate}</p>}
      <ul className="times-list">
        {(Object.keys(LABEL_KEYS) as (keyof PrayerTimes)[]).map((key) => (
          <li key={key}>
            <span className="label">{t(LABEL_KEYS[key])}</span>
            <span className="time">{times[key]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
