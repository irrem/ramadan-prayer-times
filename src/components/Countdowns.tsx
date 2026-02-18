import { useState, useEffect } from 'react';
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

function formatDiffShort(ms: number): string {
  if (ms <= 0) return '0m';
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000) % 60;
  const h = Math.floor(ms / 3600000);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatDiffHMS(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000) % 60;
  const h = Math.floor(ms / 3600000);
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

const PRAYER_LABELS: Record<keyof PrayerTimes, string> = {
  imsak: 'İmsak',
  gunes: 'Güneş',
  ogle: 'Öğle',
  ikindi: 'İkindi',
  aksam: 'İftar (Akşam)',
  yatsi: 'Yatsı',
};

interface CountdownsProps {
  times: PrayerTimes;
}

export function Countdowns({ times }: CountdownsProps) {
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
    <section className="countdowns card">
      <h2>İftara kalan süre</h2>
      {iftarPassed ? (
        <p className="countdowns-passed">Bugünkü iftar vakti geçti. Bir sonraki iftar yarın.</p>
      ) : (
        <p className="countdowns-main" aria-live="polite">{formatDiffHMS(iftarMs)}</p>
      )}
      <p className="countdowns-next">
        {next
          ? <>Sonraki vakit: {PRAYER_LABELS[next.key]} {next.time} ( {formatDiffShort(nextMs)} ) sonra</>
          : <>Sıradaki namaz yarın İmsak.</>}
      </p>
    </section>
  );
}
