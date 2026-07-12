Önce BRIEF.md'yi oku — projenin çatı belgesi.

# suharitasi.com

Türkiye'nin su verisi, havzaları ve su mevzuatını tek haritada birleştiren portal.
Sahibi: Serdar — Arslan Hukuk Bürosu. Amaç: su hukuku alanında otorite konumu + B2B rapor altyapısı.

## Durum
- Şu an: "yakında" landing sayfası (index.html).
- Sırada: MapLibre ile 2D interaktif Türkiye havza haritası (25 havza, hover'da dolum animasyonu, rezerv/tahsis/risk verisi), Astro ile SEO'lu içerik katmanı (mevzuat rehberleri, havza sayfaları), Three.js hero (Anadolu DEM'inden terrain, imleçle canlanan su damarları).

## Kurallar
- Tasarım kararlarında DESIGN.md bağlayıcıdır, ondan sapma.
- Stack: vanilla JS + Vite; içerik katmanı Astro; React/Next kullanma.
- Barındırma: Cloudflare Pages. Ağır sunucu bağımlılığı ekleme, site statik kalır.
- Arayüz dili Türkçe. Emoji yok.
