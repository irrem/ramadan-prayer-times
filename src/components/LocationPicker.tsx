import { useState, useEffect, useRef } from 'react';
import { fetchCountries, fetchStates, fetchDistricts } from '../api/prayerTimes';

const TURKEY_ID = '2';

interface LocationPickerProps {
  onSelect: (districtId: string, districtName: string, stateName: string, stateId: string) => void;
  selectedDistrictId: string | null;
  selectedStateId: string | null;
}

export function LocationPicker({ onSelect, selectedDistrictId, selectedStateId }: LocationPickerProps) {
  const [countries, setCountries] = useState<{ _id: string; name: string }[]>([]);
  const [states, setStates] = useState<{ _id: string; name: string }[]>([]);
  const [, setDistricts] = useState<{ _id: string; name: string }[]>([]);
  const [countryId, setCountryId] = useState(TURKEY_ID);
  const [stateId, setStateId] = useState(selectedStateId || '');
  const [, setDistrictId] = useState(selectedDistrictId || '');
  const [loading, setLoading] = useState<'idle' | 'countries' | 'states' | 'districts'>('idle');
  const [error, setError] = useState('');
  const stateRef = useRef<{ _id: string; name: string } | undefined>(undefined);

  const state = states.find((s) => s._id === stateId);
  stateRef.current = state;

  useEffect(() => {
    let cancelled = false;
    setLoading('countries');
    fetchCountries()
      .then((data) => { if (!cancelled) setCountries(data); })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading('idle'); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!countryId) return;
    let cancelled = false;
    const restore = countryId === TURKEY_ID && (selectedStateId || selectedDistrictId);
    setStateId(restore && selectedStateId ? selectedStateId : '');
    setDistrictId(restore && selectedDistrictId ? selectedDistrictId : '');
    setDistricts([]);
    setLoading('states');
    fetchStates(countryId)
      .then((data) => { if (!cancelled) setStates(data); })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading('idle'); });
    return () => { cancelled = true; };
  }, [countryId, selectedStateId, selectedDistrictId]);

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
  }, [stateId, selectedStateId, selectedDistrictId]);

  return (
    <section className="location-picker card">
      <h2>Konum seçin</h2>
      {error && <p className="error">{error}</p>}
      <div className="pickers">
        <label>
          <span>Ülke</span>
          <select
            value={countryId}
            onChange={(e) => setCountryId(e.target.value)}
            disabled={loading === 'countries'}
          >
            {countries.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Şehir</span>
          <select
            value={stateId}
            onChange={(e) => setStateId(e.target.value)}
            disabled={loading === 'states'}
          >
            <option value="">— Şehir seçin —</option>
            {states.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </label>
      </div>
      {(loading === 'states' || loading === 'districts') && <p className="loading">Yükleniyor…</p>}
      {state && (
        <p className="selected-location">
          <strong>{state.name}</strong>
        </p>
      )}
    </section>
  );
}
