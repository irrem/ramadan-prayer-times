import { useState, useEffect, useMemo } from 'react';
import { fetchPrayerTimesRange, type DailyPrayerItem } from '../api/prayerTimes';
import type { PrayerTimes } from '../types';

const TIME_KEYS: (keyof PrayerTimes)[] = ['imsak', 'gunes', 'ogle', 'ikindi', 'aksam', 'yatsi'];
const TIME_LABELS: Record<keyof PrayerTimes, string> = {
  imsak: 'İmsak',
  gunes: 'Güneş',
  ogle: 'Öğle',
  ikindi: 'İkindi',
  aksam: 'İftar',
  yatsi: 'Yatsı',
};

const GREGORIAN_MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

interface PrayerTimesSectionProps {
  districtId: string;
  times: PrayerTimes;
  hijriDate: string;
}

function formatGregorianDate(d: Date): string {
  return `${d.getDate()} ${GREGORIAN_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${GREGORIAN_MONTHS[d.getMonth()].slice(0, 3)}`;
}

/** 19 Şubat – Ramazan Bayramı'na kadar (yaklaşık 31 Mart) */
function imsakiyeRange(): { start: string; end: string; title: string } {
  const year = new Date().getFullYear();
  const start = new Date(year, 1, 19);
  const end = new Date(year, 2, 31);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
    title: "19 Şubat – Ramazan Bayramı'na kadar",
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
  const [viewMode, setViewMode] = useState<'daily' | 'all'>('daily');
  const [monthData, setMonthData] = useState<DailyPrayerItem[] | null>(null);
  const [monthLoading, setMonthLoading] = useState(false);
  const [monthError, setMonthError] = useState('');

  const { start, end, title } = imsakiyeRange();
  const todayGregorian = formatGregorianDate(new Date());

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
        <h2>Namaz vakitleri</h2>
        <div className="view-toggle">
          <button
            type="button"
            className={viewMode === 'daily' ? 'active' : ''}
            onClick={() => setViewMode('daily')}
          >
            Günlük
          </button>
          <button
            type="button"
            className={viewMode === 'all' ? 'active' : ''}
            onClick={() => setViewMode('all')}
          >
            Tümü
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
            {(Object.keys(TIME_LABELS) as (keyof PrayerTimes)[]).map((key) => (
              <li key={key}>
                <span className="label">
                  {key === 'imsak' ? 'İmsak (Sahur biter)' : key === 'aksam' ? 'Akşam (İftar)' : TIME_LABELS[key]}
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
          {monthLoading && <p className="loading">Yükleniyor…</p>}
          {monthError && <p className="error">{monthError}</p>}
          {monthData && monthData.length > 0 && (
            <>
              <div className="month-scroll">
                <table className="month-table">
                  <thead>
                    <tr>
                      <th>Gün</th>
                      <th className="th-badge" />
                      {TIME_KEYS.map((k) => (
                        <th key={k}>{TIME_LABELS[k]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {monthData.map((day) => {
                      const h = parseHijriFullDate(day.hijri_date?.full_date ?? '');
                      const isRamadan = h?.monthName === 'Ramazan';
                      const isKadir = isRamadan && h?.day === 27;
                      const isArife = isRamadan && lastRamadanDayInData !== null && h?.day === lastRamadanDayInData;
                      const isBayram = h?.monthName === 'Şevval' && h?.day >= 1 && h?.day <= 3;
                      const rowClass = isKadir ? 'row-kadir' : isArife ? 'row-arife' : isBayram ? 'row-bayram' : '';
                      return (
                        <tr key={day.date} className={rowClass}>
                          <td className="day-num">{formatShortDate(day.date)}</td>
                          <td className="day-badge">
                            {isKadir && <span className="badge badge-kadir">Kadir Gecesi</span>}
                            {isArife && !isKadir && <span className="badge badge-arife">Arife</span>}
                            {isBayram && !isKadir && !isArife && <span className="badge badge-bayram">Bayram</span>}
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
