# R İmsakiye

Namaz vakitleri, Ramazan ritmi ve sakin öneriler için tek sayfa web uygulaması. React (Vite) + TypeScript.

## Özellikler

- **Konum**: Ülke → şehir → ilçe (Diyanet verisi).
- **Geri sayım**: İftara kalan süre, sıradaki ezan.
- **Günün Sözü**: Günlük bir cümle.
- **Bugün ne pişirsem?**: Günlük tek menü önerisi.
- **Bugünkü vakitler**: İmsak, güneş, öğle, ikindi, akşam, yatsı.
- **Okunacak dualar**: Accordion + odak modu (açık dua vurgulu).
- **Sayfalar**: Ana sayfa, Hakkında, Gizlilik.

## Route yapısı

| Path      | Açıklama                    |
|-----------|-----------------------------|
| `/`       | Ana uygulama (vakitler, dualar, yemek vb.) |
| `/about`  | Bu proje nedir? (3 cümle)   |
| `/privacy`| Gizlilik (kısa, read-only) |

## Yerel çalıştırma

```bash
cd imsakiye-web
npm install
npm run dev
```

Tarayıcıda aç: http://localhost:5173

## Build (production)

```bash
npm run build
npm run preview   # isteğe bağlı: build önizleme
```

Çıktı: `dist/` (static site).

## Vercel’de yayınlama (deploy)

1. Projeyi GitHub’a push et.
2. [Vercel](https://vercel.com) → Import Project → bu repo.
3. Root Directory: `imsakiye-web` (veya repo kökü imsakiye-web ise boş bırak).
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Deploy.

`vercel.json` ile SPA fallback tanımlı; tüm route’lar `index.html`’e yönlenir.

**Domain**: Vercel dashboard → Settings → Domains → Add Domain → DNS’te CNAME veya A record ile yönlendir.

## Veri kaynağı

Namaz vakitleri: [Prayer Times İmsakiyem API](https://ezanvakti.imsakiyem.com/) (Diyanet İşleri Başkanlığı).

## Tech

- React 19, TypeScript, Vite 7, React Router
- CSS (Plus Jakarta Sans, Amiri); çerez / login yok
