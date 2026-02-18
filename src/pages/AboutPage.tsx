import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <div className="app static-page about-page">
      <div className="static-content card">
        <h1>Bu proje nedir?</h1>
        <p>
          Rukiye İmsakiye, namaz vakitleri ve Ramazan günlüğünü tek sayfada sunan, sade ve kullanıcı dostu bir web uygulamasıdır.
        </p>
        <p>
          Konumunuza göre vakitleri gösterir; iftara kalan süre, günün cümlesi, yemek önerisi ve okunacak dualarla günlük ritminize eşlik eder.
        </p>
        <p>
          Veri kaynağı Diyanet İşleri Başkanlığıdır; giriş veya hesap gerektirmez.
        </p>
        <p className="static-back">
          <Link to="/">← Ana sayfaya dön</Link>
        </p>
      </div>
    </div>
  );
}
