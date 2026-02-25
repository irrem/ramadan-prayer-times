/**
 * Hadith of the day – Ramadan/fasting related.
 * Turkish translations from Diyanet İşleri Başkanlığı (Hadislerle İslâm, 40 Hadiste Ramazan).
 * Source: https://hadislerleislam.diyanet.gov.tr – https://yayin.diyanet.gov.tr
 */
export interface Hadith {
  arabic: string;
  tr: string;
  en: string;
}

export const hadiths: Hadith[] = [
  {
    arabic: 'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
    tr: 'Kim inanarak ve karşılığını Allah\'tan bekleyerek Ramazan orucunu tutarsa, geçmiş günahları bağışlanır.',
    en: 'Whoever fasts the month of Ramadan out of faith and in hope of reward, his previous sins will be forgiven.',
  },
  {
    arabic: 'إِذَا دَخَلَ رَمَضَانُ فُتِّحَتْ أَبْوَابُ الْجَنَّةِ وَغُلِّقَتْ أَبْوَابُ النَّارِ',
    tr: 'Ramazan girdiğinde sema (cennet) kapıları açılır, cehennem kapıları kapanır.',
    en: 'When Ramadan enters, the gates of Paradise are opened and the gates of Hell are closed.',
  },
  {
    arabic: 'الصَّوْمُ جُنَّةٌ',
    tr: 'Oruç (sahibini koruyan) bir kalkandır.',
    en: 'Fasting is a shield.',
  },
  {
    arabic: 'لِلصَّائِمِ فَرْحَتَانِ: فَرْحَةٌ عِنْدَ فِطْرِهِ وَفَرْحَةٌ عِنْدَ لِقَاءِ رَبِّهِ',
    tr: 'Oruçlunun iki sevinci vardır: Biri iftar ettiğinde, biri de Rabbi ile buluştuğunda.',
    en: 'The fasting person has two joys: one when he breaks his fast, and one when he meets his Lord.',
  },
  {
    arabic: 'تَسَحَّرُوا فَإِنَّ فِي السَّحُورِ بَرَكَةً',
    tr: 'Sahur yapın, zira sahurda bereket vardır.',
    en: 'Take suhoor, for in suhoor there is blessing.',
  },
  {
    arabic: 'مَنْ فَطَّرَ صَائِمًا كَانَ لَهُ مِثْلُ أَجْرِهِ',
    tr: 'Bir oruçluyu iftar ettiren, onun ecri gibi ecir alır.',
    en: 'Whoever gives a fasting person something to break his fast will have a reward like his.',
  },
  {
    arabic: 'رُبَّ صَائِمٍ لَيْسَ لَهُ مِنْ صِيَامِهِ إِلَّا الْجُوعُ وَالْعَطَشُ',
    tr: 'Nice oruçlu vardır ki orucundan eline geçen sadece açlık ve susuzluktur.',
    en: 'How many there are who fast but gain from their fasting only hunger and thirst.',
  },
  {
    arabic: 'إِذَا كَانَ يَوْمُ صَوْمِ أَحَدِكُمْ فَلَا يَرْفُثْ وَلَا يَصْخَبْ',
    tr: 'Oruçlu, saygısızlık yapmasın, ahlâksızca konuşmasın.',
    en: 'When one of you is fasting, let him not use foul language or shout.',
  },
  {
    arabic: 'الصِّيَامُ فَرْضٌ عَلَى كُلِّ مُسْلِمٍ',
    tr: 'Oruç her Müslüman üzerine farzdır.',
    en: 'Fasting is obligatory for every Muslim.',
  },
  {
    arabic: 'خَيْرُكُمْ مَنْ أَطْعَمَ الطَّعَامَ',
    tr: 'Sizin en hayırlınız yemek yedirendir.',
    en: 'The best of you are those who feed others.',
  },
  {
    arabic: 'الدِّينُ النَّصِيحَةُ',
    tr: 'Din nasihattir.',
    en: 'Religion is sincere advice.',
  },
  {
    arabic: 'طُوبَى لِمَنْ أَصْبَحَ وَأَمْسَى وَاللَّهُ رَبُّهُ',
    tr: 'Allah\'ı Rab bilerek sabahlayan ve akşamlayan kimseye ne mutlu.',
    en: 'Blessed is he who wakes in the morning and evening with Allah as his Lord.',
  },
  {
    arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِي رَجَبٍ وَشَعْبَانَ وَبَلِّغْنَا رَمَضَانَ',
    tr: 'Allah\'ım, Recep ve Şaban\'ı bize bereketli kıl, bizi Ramazan\'a ulaştır.',
    en: 'O Allah, bless us in Rajab and Sha\'ban and let us reach Ramadan.',
  },
  {
    arabic: 'مَنْ لَمْ يَدَعْ قَوْلَ الزُّورِ وَالْعَمَلَ بِهِ فَلَيْسَ لِلَّهِ حَاجَةٌ فِي أَنْ يَدَعَ طَعَامَهُ وَشَرَابَهُ',
    tr: 'Yalan sözü ve onunla ameli bırakmayanın, yemesini içmesini bırakmasına Allah\'ın ihtiyacı yoktur.',
    en: 'Whoever does not give up false speech and acting on it, Allah has no need of his giving up his food and drink.',
  },
  {
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
    tr: 'Ameller ancak niyetlere göredir.',
    en: 'Actions are judged only by intentions.',
  },
  {
    arabic: 'مَنْ صَامَ يَوْمًا فِي سَبِيلِ اللَّهِ بَعَّدَ اللَّهُ وَجْهَهُ عَنِ النَّارِ سَبْعِينَ خَرِيفًا',
    tr: 'Allah yolunda bir gün oruç tutanın yüzünü Allah yetmiş yıl cehennemden uzaklaştırır.',
    en: 'Whoever fasts one day for the sake of Allah, Allah will distance his face from the Fire by seventy years.',
  },
  {
    arabic: 'الصَّبْرُ نِصْفُ الْإِيمَانِ',
    tr: 'Sabır imanın yarısıdır.',
    en: 'Patience is half of faith.',
  },
  {
    arabic: 'الْجَنَّةُ تَحْتَ أَقْدَامِ الْأُمَّهَاتِ',
    tr: 'Cennet annelerin ayakları altındadır.',
    en: 'Paradise lies at the feet of mothers.',
  },
  {
    arabic: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
    tr: 'İnsanların en hayırlısı, insanlara en faydalı olandır.',
    en: 'The best of people are those most beneficial to people.',
  },
  {
    arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    tr: 'Sizden biri kendisi için sevdiğini kardeşi için de sevmedikçe tam iman etmiş olmaz.',
    en: 'None of you truly believes until he loves for his brother what he loves for himself.',
  },
];

export function getHadithOfDay(): Hadith {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = Date.now() - start.getTime();
  const dayIndex = Math.floor(diff / (1000 * 60 * 60 * 24));
  return hadiths[dayIndex % hadiths.length];
}
