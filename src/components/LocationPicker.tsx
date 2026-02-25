import { useState, useEffect, useRef } from 'react';
import { fetchCountries, fetchStates, fetchDistricts } from '../api/prayerTimes';
import { useLanguage } from '../context/LanguageContext';

const TURKEY_ID = '2';

type LocationItem = { _id: string; name: string; name_en?: string };

interface LocationPickerProps {
  onSelect: (districtId: string, districtName: string, stateName: string, stateId: string) => void;
  selectedDistrictId: string | null;
  selectedStateId: string | null;
}

function displayName(item: LocationItem, locale: 'tr' | 'en'): string {
  if (locale === 'en' && item.name_en) return item.name_en;
  return item.name;
}

export function LocationPicker({ onSelect, selectedDistrictId, selectedStateId }: LocationPickerProps) {
  const { locale, t } = useLanguage();
  const isEn = locale === 'en';

  const [countries, setCountries] = useState<LocationItem[]>([]);
  const [countryId, setCountryId] = useState(TURKEY_ID);
  const [states, setStates] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [stateId, setStateId] = useState(selectedStateId || '');
  const [districtId, setDistrictId] = useState(selectedDistrictId || '');
  const [loading, setLoading] = useState<'idle' | 'countries' | 'states' | 'districts'>('idle');
  const [error, setError] = useState('');
  const stateRef = useRef<LocationItem | undefined>(undefined);

  const state = states.find((s) => s._id === stateId);
  stateRef.current = state;

  const hasExistingSelection = Boolean(selectedStateId || selectedDistrictId);

  // TR: load Turkey states only. EN: load countries first (states loaded in next effect).
  useEffect(() => {
    if (isEn) {
      let cancelled = false;
      setLoading('countries');
      fetchCountries()
        .then((data) => { if (!cancelled) setCountries(data); })
        .catch((e) => { if (!cancelled) setError(e.message); })
        .finally(() => { if (!cancelled) setLoading('idle'); });
      return () => { cancelled = true; };
    }
    let cancelled = false;
    setStateId(hasExistingSelection && selectedStateId ? selectedStateId : '');
    setDistrictId(hasExistingSelection && selectedDistrictId ? selectedDistrictId : '');
    setDistricts([]);
    setLoading('states');
    fetchStates(TURKEY_ID)
      .then((data) => { if (!cancelled) setStates(data); })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading('idle'); });
    return () => { cancelled = true; };
  }, [isEn, hasExistingSelection, selectedStateId, selectedDistrictId]);

  // EN: when country selected load states; restore existing il/ilçe selection so it shows as city in EN
  useEffect(() => {
    if (!isEn) return;
    if (!countryId) return;
    let cancelled = false;
    if (hasExistingSelection) {
      setStateId(selectedStateId || '');
      setDistrictId(selectedDistrictId || '');
    } else {
      setStateId('');
      setDistrictId('');
    }
    setDistricts([]);
    setLoading('states');
    fetchStates(countryId)
      .then((data) => { if (!cancelled) setStates(data); })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading('idle'); });
    return () => { cancelled = true; };
  }, [isEn, countryId, hasExistingSelection, selectedStateId, selectedDistrictId]);

  // When state selected: load districts and (if EN) auto-pick first district.
  // Also run when isEn changes so that switching back to TR refetches districts (TR effect clears them).
  useEffect(() => {
    if (!stateId) return;
    let cancelled = false;
    if (stateId !== selectedStateId) setDistrictId('');
    setLoading('districts');
    fetchDistricts(stateId)
      .then((data) => {
        if (!cancelled) {
          setDistricts(data);
          const state = stateRef.current;
          const toUse = selectedDistrictId && data.some((d) => d._id === selectedDistrictId)
            ? data.find((d) => d._id === selectedDistrictId)!
            : data[0];
          if (toUse && state) {
            setDistrictId(toUse._id);
            onSelect(toUse._id, toUse.name, state.name, stateId);
          }
        }
      })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading('idle'); });
    return () => { cancelled = true; };
  }, [stateId, selectedStateId, selectedDistrictId, isEn]);

  const onCountryChange = (newCountryId: string) => {
    setCountryId(newCountryId);
    setStateId('');
    setDistrictId('');
    setDistricts([]);
    setStates([]);
  };

  const onStateChange = (newStateId: string) => {
    setStateId(newStateId);
    setDistrictId('');
    setDistricts([]);
  };

  const onDistrictChange = (newDistrictId: string) => {
    setDistrictId(newDistrictId);
    const district = districts.find((d) => d._id === newDistrictId);
    const stateObj = stateRef.current;
    if (district && stateObj) {
      onSelect(district._id, district.name, stateObj.name, stateId);
    }
  };

  const [showInfo, setShowInfo] = useState(false);

  return (
    <section className="location-picker card">
      <div className="location-picker-head">
        <h2>{t('location.title')}</h2>
        <button
          type="button"
          className="location-info-btn"
          onClick={() => setShowInfo(!showInfo)}
          aria-expanded={showInfo}
          title={t('location.dataSourceShort')}
          aria-label={t('location.dataSourceShort')}
        >
          i
        </button>
      </div>
      {showInfo && (
        <div className="location-info-panel" role="region" aria-label="Veri kaynağı bilgisi">
          <p>{t('location.dataSource')}</p>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      <div className="pickers">
        {isEn && (
          <label>
            <span>{t('location.country')}</span>
            <select
              value={countryId}
              onChange={(e) => onCountryChange(e.target.value)}
              disabled={loading === 'countries'}
            >
              {countries.map((c) => (
                <option key={c._id} value={c._id}>{displayName(c, locale)}</option>
              ))}
            </select>
          </label>
        )}
        <label>
          <span>{t('location.state')}</span>
          <select
            value={stateId}
            onChange={(e) => onStateChange(e.target.value)}
            disabled={loading === 'states'}
          >
            <option value="">{t('location.selectState')}</option>
            {states.map((s) => (
              <option key={s._id} value={s._id}>{displayName(s, locale)}</option>
            ))}
          </select>
        </label>
        {!isEn && (
          <label>
            <span>{t('location.district')}</span>
            <select
              value={districtId}
              onChange={(e) => onDistrictChange(e.target.value)}
              disabled={loading === 'districts' || !stateId || districts.length === 0}
            >
              <option value="">{t('location.selectDistrict')}</option>
              {districts.map((d) => (
                <option key={d._id} value={d._id}>{displayName(d, locale)}</option>
              ))}
            </select>
          </label>
        )}
      </div>
      {(loading === 'states' || loading === 'districts') && <p className="loading">{t('location.loading')}</p>}
      {state && districtId && (() => {
        const district = districts.find((d) => d._id === districtId);
        if (isEn) {
          return <p className="selected-location"><strong>{displayName(state, locale)}</strong></p>;
        }
        return district ? (
          <p className="selected-location">
            <strong>{displayName(district, locale)}</strong>, {displayName(state, locale)}
          </p>
        ) : null;
      })()}
    </section>
  );
}
