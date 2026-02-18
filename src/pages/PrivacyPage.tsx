import { Link } from 'react-router-dom';

export function PrivacyPage() {
  return (
    <div className="app static-page privacy-page">
      <div className="static-content card">
        <h1>Gizlilik</h1>
        <p>
          Rukiye İmsakiye read-only bir uygulamadır: giriş yok, kullanıcı hesabı yok, toplanan kişisel veri yok.
        </p>
        <p>
          Seçtiğiniz konum (ülke, şehir, ilçe) yalnızca tarayıcınızda (localStorage) saklanır; sunucuya gönderilmez. Çerez kullanılmamaktadır.
        </p>
        <p>
          Vakit verisi Diyanet İşleri Başkanlığı API’sinden alınır; ödeme veya kayıt gerektirmez.
        </p>
        <p className="static-back">
          <Link to="/">← Ana sayfaya dön</Link>
        </p>
      </div>
    </div>
  );
}
