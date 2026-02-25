const BASE = 'https://ezanvakti.imsakiyem.com/api';

const CACHE_PREFIX = 'imsakiye-api-';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours – reduces "too many requests" from API

function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { data, expiresAt } = JSON.parse(raw) as { data: T; expiresAt: number };
    if (Date.now() > expiresAt) return null;
    return data;
  } catch {
    return null;
  }
}

function setCache(key: string, data: unknown): void {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
      data,
      expiresAt: Date.now() + CACHE_TTL_MS,
    }));
  } catch {
    // ignore quota or other errors
  }
}

/** Parse response as JSON; if body is not JSON (e.g. plain text error), throw a clear error. */
async function parseJsonResponse<T>(res: Response, fallbackError: string): Promise<T> {
  const text = await res.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    if (res.ok) throw new Error(fallbackError);
    const msg = text.length <= 120 ? text : text.slice(0, 117) + '…';
    throw new Error(msg || fallbackError);
  }
  return json as T;
}

export async function fetchCountries(): Promise<{ _id: string; name: string; name_en: string }[]> {
  const res = await fetch(`${BASE}/locations/countries`, { headers: { Accept: 'application/json' } });
  const json = await parseJsonResponse<{ success?: boolean; data?: unknown; message?: string }>(res, 'Ülkeler yüklenemedi.');
  if (!json.success || !json.data) throw new Error(json.message || 'Ülkeler yüklenemedi.');
  return json.data as { _id: string; name: string; name_en: string }[];
}

export async function fetchStates(countryId: string): Promise<{ _id: string; name: string; name_en: string }[]> {
  const cacheKey = `states-${countryId}`;
  const cached = getCached<{ _id: string; name: string; name_en: string }[]>(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${BASE}/locations/states?countryId=${countryId}`, { headers: { Accept: 'application/json' } });
  const json = await parseJsonResponse<{ success?: boolean; data?: unknown; message?: string }>(res, 'Şehirler yüklenemedi.');
  if (!json.success || !json.data) throw new Error(json.message || 'Şehirler yüklenemedi.');
  const data = json.data as { _id: string; name: string; name_en: string }[];
  setCache(cacheKey, data);
  return data;
}

export async function fetchDistricts(stateId: string): Promise<{ _id: string; name: string; name_en: string }[]> {
  const cacheKey = `districts-${stateId}`;
  const cached = getCached<{ _id: string; name: string; name_en: string }[]>(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${BASE}/locations/districts?stateId=${stateId}`, { headers: { Accept: 'application/json' } });
  const json = await parseJsonResponse<{ success?: boolean; data?: unknown; message?: string }>(res, 'İlçeler yüklenemedi.');
  if (!json.success || !json.data) throw new Error(json.message || 'İlçeler yüklenemedi.');
  const data = json.data as { _id: string; name: string; name_en: string }[];
  setCache(cacheKey, data);
  return data;
}

/** Local date as YYYY-MM-DD so prayer times match the user's current day (not UTC). */
function todayLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export interface DailyPrayerItem {
  date: string;
  hijri_date: { full_date: string };
  times: Record<string, string>;
  district_id?: { name: string; state_id?: { name: string } };
}

export async function fetchDailyPrayerTimes(districtId: string, date?: string): Promise<DailyPrayerItem[]> {
  const d = date || todayLocal();
  const res = await fetch(
    `${BASE}/prayer-times/${districtId}/range?startDate=${d}&endDate=${d}`,
    { headers: { Accept: 'application/json' } }
  );
  const json = await parseJsonResponse<{ success?: boolean; data?: DailyPrayerItem | DailyPrayerItem[]; message?: string }>(res, 'Ezan vakitleri yüklenemedi.');
  if (!json.success || !json.data) throw new Error(json.message || 'Ezan vakitleri yüklenemedi.');
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
  const json = await parseJsonResponse<{ success?: boolean; data?: DailyPrayerItem | DailyPrayerItem[]; message?: string }>(res, 'Ezan vakitleri yüklenemedi.');
  if (!json.success || !json.data) throw new Error(json.message || 'Ezan vakitleri yüklenemedi.');
  return Array.isArray(json.data) ? json.data : [json.data];
}
