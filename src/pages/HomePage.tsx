import { useState, useEffect, useCallback } from 'react';
import { LocationPicker } from '../components/LocationPicker';
import { PrayerTimesSection } from '../components/PrayerTimesSection';
import { Countdowns } from '../components/Countdowns';
import { DuasSection } from '../components/DuasSection';
import { QuoteOfDay } from '../components/QuoteOfDay';
import { fetchDailyPrayerTimes, type DailyPrayerItem } from '../api/prayerTimes';
import { useLanguage } from '../context/LanguageContext';
import type { PrayerTimes } from '../types';

export function HomePage() {
  const { t } = useLanguage();
  const [districtId, setDistrictId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('imsakiye-districtId');
    } catch {
      return null;
    }
  });
  const [stateId, setStateId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('imsakiye-stateId');
    } catch {
      return null;
    }
  });
  const [districtName, setDistrictName] = useState('');
  const [stateName, setStateName] = useState('');
  const [today, setToday] = useState<{ times: PrayerTimes; hijriDate: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = useCallback((id: string, dName: string, sName: string, newStateId: string) => {
    setDistrictId(id);
    setStateId(newStateId);
    setDistrictName(dName);
    setStateName(sName);
    setError('');
    try {
      localStorage.setItem('imsakiye-districtId', id);
      localStorage.setItem('imsakiye-stateId', newStateId);
    } catch {}
  }, []);

  useEffect(() => {
    if (!districtId) {
      setToday(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchDailyPrayerTimes(districtId)
      .then((data: DailyPrayerItem[]) => {
        if (cancelled) return;
        const first = data[0];
        if (!first?.times) {
          setToday(null);
          return;
        }
        if (first.district_id) {
          setDistrictName(first.district_id.name);
          if (first.district_id.state_id) setStateName(first.district_id.state_id.name);
        }
        setToday({
          times: first.times as unknown as PrayerTimes,
          hijriDate: first.hijri_date?.full_date || '',
        });
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
        setToday(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [districtId]);

  return (
    <div className="app home-page">
      <section className="hero">
        <h1 className="hero-title">{t('hero.title')}</h1>
     </section>

      <div className="section-spacer" />
      <LocationPicker
        selectedDistrictId={districtId}
        selectedStateId={stateId}
        onSelect={handleSelect}
      />

      {error && <p className="app-error">{error}</p>}
      {loading && <p className="app-loading">{t('home.loading')}</p>}

      {today && (
        <>
          <div className="section-spacer" />
          {districtName && stateName && (
            <p className="location-label">
              <strong>{districtName}</strong>, {stateName} {t('home.prayerTimesFor')}
            </p>
          )}
          <Countdowns times={today.times} />
        </>
      )}

      <div className="section-spacer" />
      <QuoteOfDay />

      {today && districtId && (
        <>
          <div className="section-spacer" />
          <PrayerTimesSection
            districtId={districtId}
            times={today.times}
            hijriDate={today.hijriDate}
          />
        </>
      )}

      <div className="section-spacer" />
      <DuasSection />
    </div>
  );
}
