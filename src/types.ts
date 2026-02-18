export interface Country {
  _id: string;
  name: string;
  name_en: string;
}

export interface State {
  _id: string;
  name: string;
  name_en: string;
  country_id: string;
}

export interface District {
  _id: string;
  name: string;
  name_en: string;
  state_id: string;
}

export interface PrayerTimes {
  imsak: string;
  gunes: string;
  ogle: string;
  ikindi: string;
  aksam: string;
  yatsi: string;
}

export interface HijriDate {
  day: number;
  month: number;
  month_name: string;
  month_name_en: string;
  year: number;
  full_date: string;
}

export interface DailyPrayerData {
  date: string;
  hijri_date: HijriDate;
  times: PrayerTimes;
  district_id?: { name: string; name_en: string; state_id?: { name: string } };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Dua {
  id: string;
  titleEn: string;
  titleTr: string;
  arabic: string;
  transliteration?: string;
  translationEn: string;
  translationTr?: string;
  category: 'iftar' | 'sahur' | 'ramadan' | 'general';
}
