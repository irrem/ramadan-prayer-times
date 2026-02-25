import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { PrayerTimes } from '../types';

const PRAYER_ORDER: (keyof PrayerTimes)[] = ['imsak', 'gunes', 'ogle', 'ikindi', 'aksam', 'yatsi'];

function parseTime(t: string): Date {
  const [h, m] = t.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function getNextPrayer(times: PrayerTimes): { key: keyof PrayerTimes; time: string; at: Date } | null {
  const now = new Date();
  for (const key of PRAYER_ORDER) {
    const at = parseTime(times[key]);
    if (at > now) return { key, time: times[key], at };
  }
  return null;
}

function formatDiffHMS(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000) % 60;
  const h = Math.floor(ms / 3600000);
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

const PRAYER_KEYS: Record<keyof PrayerTimes, string> = {
  imsak: 'prayer.imsak',
  gunes: 'prayer.gunes',
  ogle: 'prayer.ogle',
  ikindi: 'prayer.ikindi',
  aksam: 'prayer.iftar',
  yatsi: 'prayer.yatsi',
};

interface CountdownsProps {
  times: PrayerTimes;
}

export function Countdowns({ times }: CountdownsProps) {
  const { t } = useLanguage();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const next = getNextPrayer(times);
  const iftarAt = parseTime(times.aksam);
  const iftarMs = iftarAt.getTime() - now.getTime();
  const iftarPassed = iftarMs <= 0;
  const nextMs = next ? next.at.getTime() - now.getTime() : 0;

  return (
    <section className="countdowns-wrapper">
      <div className="countdowns-card countdowns-card-iftar">
        <h2>{t('countdown.title')}</h2>
        {iftarPassed ? (
          <p className="countdowns-passed">{t('countdown.passed')}</p>
        ) : (
          <p className="countdowns-main" aria-live="polite">{formatDiffHMS(iftarMs)}</p>
        )}
      </div>
      <div className="countdowns-card countdowns-card-next">
        <h2>{t('countdown.nextPrayerTitle')}</h2>
        {next ? (
          <>
            <p className="countdowns-main" aria-live="polite">{formatDiffHMS(nextMs)}</p>
            <p className="countdowns-next-label">
              {t(PRAYER_KEYS[next.key])} {next.time}
            </p>
          </>
        ) : (
          <p className="countdowns-passed">{t('countdown.nextImsakTomorrow')}</p>
        )}
      </div>
    </section>
  );
}
