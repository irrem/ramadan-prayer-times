const BASE = 'https://ezanvakti.imsakiyem.com/api';

export async function fetchCountries(): Promise<{ _id: string; name: string; name_en: string }[]> {
  const res = await fetch(`${BASE}/locations/countries`, { headers: { Accept: 'application/json' } });
  const json = await res.json();
  if (!json.success || !json.data) throw new Error(json.message || 'Ülkeler yüklenemedi.');
  return json.data;
}

export async function fetchStates(countryId: string): Promise<{ _id: string; name: string; name_en: string }[]> {
  const res = await fetch(`${BASE}/locations/states?countryId=${countryId}`, { headers: { Accept: 'application/json' } });
  const json = await res.json();
  if (!json.success || !json.data) throw new Error(json.message || 'Şehirler yüklenemedi.');
  return json.data;
}

export async function fetchDistricts(stateId: string): Promise<{ _id: string; name: string; name_en: string }[]> {
  const res = await fetch(`${BASE}/locations/districts?stateId=${stateId}`, { headers: { Accept: 'application/json' } });
  const json = await res.json();
  if (!json.success || !json.data) throw new Error(json.message || 'İlçeler yüklenemedi.');
  return json.data;
}

function todayISO(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export interface DailyPrayerItem {
  date: string;
  hijri_date: { full_date: string };
  times: Record<string, string>;
  district_id?: { name: string; state_id?: { name: string } };
}

export async function fetchDailyPrayerTimes(districtId: string, date?: string): Promise<DailyPrayerItem[]> {
  const d = date || todayISO();
  const res = await fetch(
    `${BASE}/prayer-times/${districtId}/range?startDate=${d}&endDate=${d}`,
    { headers: { Accept: 'application/json' } }
  );
  const json = await res.json();
  if (!json.success || !json.data) throw new Error(json.message || 'Namaz vakitleri yüklenemedi.');
  return Array.isArray(json.data) ? json.data : [json.data];
}

export async function fetchPrayerTimesRange(
  districtId: string,
  startDate: string,
  endDate: string
): Promise<DailyPrayerItem[]> {
  const res = await fetch(
    `${BASE}/prayer-times/${districtId}/range?startDate=${startDate}&endDate=${endDate}`,
    { headers: { Accept: 'application/json' } }
  );
  const json = await res.json();
  if (!json.success || !json.data) throw new Error(json.message || 'Namaz vakitleri yüklenemedi.');
  return Array.isArray(json.data) ? json.data : [json.data];
}
