# FAZ 3 RAPORU — işletme sahaları / kapalı sahalar (hukuki katman)

Tarih: 2026-07-27 · Araç: `arac/rg-tara.py` · Çıktı: `veri/potansiyel/isletme-sahalari.json`

## 3.1 RG taraması (Faz 0.4'te doğrulanan JSON ucu, başlık araması)

| Varyant | Beyan (recordsTotal) | Alınan |
|---|---|---|
| "yeraltısuyu işletme sahası" (bitişik) | 93 | 93 |
| "yeraltı suyu işletme sahası" (ayrı) | 16 | 16 |
| "YAS işletme sahası" | 0 | 0 |

Tekilleştirme sonrası **109 benzersiz kayıt** (URL+başlık anahtarıyla;
`bulan_varyantlar` alanı hangi varyantların bulduğunu tutar).
Ham cevap sayfaları `veri/ham/rg/` (gitignore).

### Kayıt alanları ve dürüstlük etiketleri
- `saha_adi` = RG başlığı AYNEN (ayrıştırma yapılmadı — resmî tanım).
- `il`/`ilceler`: başlıktan TAM KELİME çıkarımı (81 il + OSM ilçe dizini).
  **73 tek-il · 13 çok-il · 23 "belirsiz (başlıktan çıkarılamadı)"**.
- `durum` sınıflaması: **108 "işletme sahası ilanı/değişikliği" · 1 belirsiz**
  ("Gebze - Çayırova Yeraltısuyu İşletme Sahası" — başlıkta eylem yok).
  Tahsise-kapatma / kapalı-ova sınıfına düşen kayıt bu taramada ÇIKMADI.
- Her kayıtta RG tarih + sayı + fihrist URL → **kaynaksız kayıt: 0** ✓
- Geliştirmede yakalanan 2 sınıflama hatası düzeltildi (kanıtlı): çift
  boşluk + "Sahaları" çoğulu 7 kaydı düşürüyordu; dd.mm.yyyy string
  sıralaması yanlıştı → (yyyy,mm,dd) anahtarı.

## KAPSAM BOŞLUĞU (dürüstlük bulgusu — kullanıcı bilmeli)

Başlık araması kayıtları **14.12.1963 – 02.11.1980** aralığında. 1980
sonrası YAS işletme sahası ilanları başlık dizininde görünmüyor; ölçülen
kanıt: aynı kelimenin **içerik araması (searchtype=4) 83 isabet (1994'e
uzanan)** ve **ilan araması (searchtype=5) 121 isabet (2017'ye uzanan)**
veriyor — ama bunlar yalnız "gazete günü" işaretçisi (başlık/saha adı yok),
G3 gereği kayda DÖNÜŞTÜRÜLMEDİ (sayılar JSON `ek_tarama_isabetleri`nde).
1980 sonrası ilanlara ulaşmak için seçenekler: (a) 204 gazete-günü
sayfasının içerik taraması (ayrı iş — onayla), (b) DSİ bilgi edinme
(0.6'daki aday), (c) Van-Erçek gibi güncel ilanlar için DSİ duyuru arşivi.

## 3.2 Çapraz doğrulama — YAPILAMADI (koşul oluşmadı)

Brief 3.2 "Faz 0.6'da resmî kapalı-saha listesi bulunduysa" koşuluna bağlı;
0.6'da açık liste BULUNAMADI (bilgi edinme adayı). Çapraz doğrulama
yapılacak resmî liste yok — kayıt: bilgi edinme dilekçesi kullanıcıda.

## BİTTİ-TANIMI kontrolü

Kaynaksız (RG künyesiz VE belge URL'siz) kayıt: **SIFIR** ✓ (109/109
kayıtta tarih+sayı+URL üçü birden var).
