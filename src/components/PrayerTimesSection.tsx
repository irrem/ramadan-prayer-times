import { useState, useEffect, useMemo } from 'react';
import { fetchPrayerTimesRange, type DailyPrayerItem } from '../api/prayerTimes';
import { useLanguage } from '../context/LanguageContext';
import type { PrayerTimes } from '../types';

const TIME_KEYS: (keyof PrayerTimes)[] = ['imsak', 'gunes', 'ogle', 'ikindi', 'aksam', 'yatsi'];
const TIME_LABEL_KEYS: Record<keyof PrayerTimes, string> = {
  imsak: 'prayer.imsak',
  gunes: 'prayer.gunes',
  ogle: 'prayer.ogle',
  ikindi: 'prayer.ikindi',
  aksam: 'prayer.iftar',
  yatsi: 'prayer.yatsi',
};

const MONTH_KEYS = ['month.jan', 'month.feb', 'month.mar', 'month.apr', 'month.may', 'month.jun', 'month.jul', 'month.aug', 'month.sep', 'month.oct', 'month.nov', 'month.dec'];

interface PrayerTimesSectionProps {
  districtId: string;
  times: PrayerTimes;
  hijriDate: string;
}

function formatGregorianDate(d: Date, t: (k: string) => string): string {
  return `${d.getDate()} ${t(MONTH_KEYS[d.getMonth()])} ${d.getFullYear()}`;
}

function formatShortDate(dateStr: string, t: (k: string) => string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${t(MONTH_KEYS[d.getMonth()]).slice(0, 3)}`;
}

function imsakiyeRange(t: (k: string) => string): { start: string; end: string; title: string } {
  const year = new Date().getFullYear();
  const start = new Date(year, 1, 19);
  const end = new Date(year, 2, 31);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
    title: t('range.title'),
  };
}

/** Parse hijri full_date e.g. "27 Ramazan 1447" or "1 Rebiülevvel 1447" -> { day, monthName, year } */
function parseHijriFullDate(fullDate: string): { day: number; monthName: string; year: number } | null {
  if (!fullDate || typeof fullDate !== 'string') return null;
  const parts = fullDate.trim().split(/\s+/);
  if (parts.length < 3) return null;
  const day = parseInt(parts[0], 10);
  const year = parseInt(parts[parts.length - 1], 10);
  if (Number.isNaN(day) || Number.isNaN(year)) return null;
  const monthName = parts.slice(1, -1).join(' ');
  return { day, monthName, year };
}

export function PrayerTimesSection({ districtId, times, hijriDate }: PrayerTimesSectionProps) {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'daily' | 'all'>('daily');
  const [monthData, setMonthData] = useState<DailyPrayerItem[] | null>(null);
  const [monthLoading, setMonthLoading] = useState(false);
  const [monthError, setMonthError] = useState('');

  const { start, end, title } = imsakiyeRange(t);
  const todayGregorian = formatGregorianDate(new Date(), t);

  useEffect(() => {
    if (viewMode !== 'all') {
      setMonthData(null);
      return;
    }
    let cancelled = false;
    setMonthLoading(true);
    setMonthError('');
    fetchPrayerTimesRange(districtId, start, end)
      .then((data) => { if (!cancelled) setMonthData(data); })
      .catch((e) => { if (!cancelled) setMonthError(e.message); })
      .finally(() => { if (!cancelled) setMonthLoading(false); });
    return () => { cancelled = true; };
  }, [viewMode, districtId, start, end]);

  const lastRamadanDayInData = useMemo(() => {
    if (!monthData || monthData.length === 0) return null;
    let last = 0;
    for (const day of monthData) {
      const h = parseHijriFullDate(day.hijri_date?.full_date ?? '');
      if (h && h.monthName === 'Ramazan' && h.day > last) last = h.day;
    }
    return last > 0 ? last : null;
  }, [monthData]);

  return (
    <section className="prayer-times-section card">
      <div className="prayer-times-section-head">
        <h2>{t('prayer.sectionTitle')}</h2>
        <div className="view-toggle">
          <button
            type="button"
            className={viewMode === 'daily' ? 'active' : ''}
            onClick={() => setViewMode('daily')}
          >
            {t('prayer.daily')}
          </button>
          <button
            type="button"
            className={viewMode === 'all' ? 'active' : ''}
            onClick={() => setViewMode('all')}
          >
            {t('prayer.all')}
          </button>
        </div>
      </div>
      {viewMode === 'daily' && (
        <>
          {hijriDate && (
            <p className="hijri">
              {hijriDate} <span className="miladi">({todayGregorian})</span>
            </p>
          )}
          <ul className="times-list">
            {(Object.keys(TIME_LABEL_KEYS) as (keyof PrayerTimes)[]).map((key) => (
              <li key={key}>
                <span className="label">
                  {key === 'imsak' ? t('prayer.imsakSahur') : key === 'aksam' ? t('prayer.aksamIftar') : t(TIME_LABEL_KEYS[key])}
                </span>
                <span className="time">{times[key]}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {viewMode === 'all' && (
        <div className="prayer-times-month">
          <p className="range-title">{title}</p>
          {monthLoading && <p className="loading">{t('common.loading')}</p>}
          {monthError && <p className="error">{monthError}</p>}
          {monthData && monthData.length > 0 && (
            <>
              <div className="month-scroll">
                <table className="month-table">
                  <thead>
                    <tr>
                      <th>{t('month.day')}</th>
                      <th className="th-badge" />
                      {TIME_KEYS.map((k) => (
                        <th key={k}>{t(TIME_LABEL_KEYS[k])}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {monthData.map((day) => {
                      const h = parseHijriFullDate(day.hijri_date?.full_date ?? '');
                      const isRamadan = h?.monthName === 'Ramazan';
                      /* Kadir Gecesi: 26'yı 27'ye bağlayan gece → 26 Ramazan satırında göster (Diyanet) */
                      const isKadir = isRamadan && h?.day === 26;
                      const isArife = isRamadan && lastRamadanDayInData !== null && h?.day === lastRamadanDayInData;
                      const isBayram = h?.monthName === 'Şevval' && h?.day >= 1 && h?.day <= 3;
                      const rowClass = isKadir ? 'row-kadir' : isArife ? 'row-arife' : isBayram ? 'row-bayram' : '';
                      return (
                        <tr key={day.date} className={rowClass}>
                          <td className="day-num">{formatShortDate(day.date, t)}</td>
                          <td className="day-badge">
                            {isKadir && <span className="badge badge-kadir">{t('badge.kadir')}</span>}
                            {isArife && !isKadir && <span className="badge badge-arife">{t('badge.arife')}</span>}
                            {isBayram && !isKadir && !isArife && <span className="badge badge-bayram">{t('badge.bayram')}</span>}
                          </td>
                          {TIME_KEYS.map((k) => (
                            <td key={k}>{(day.times as unknown as PrayerTimes)[k]}</td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
