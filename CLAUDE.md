Önce BRIEF.md'yi oku — projenin çatı belgesi.

# suharitasi.com

Türkiye'nin su verisi, havzaları ve su mevzuatını tek haritada birleştiren portal.
Sahibi: Serdar — Arslan Hukuk Bürosu. Amaç: su hukuku alanında otorite konumu + B2B rapor altyapısı.

## Durum
- Şu an: "yakında" landing sayfası (index.html).
- Sırada: MapLibre ile 2D interaktif Türkiye havza haritası (25 havza, hover'da dolum animasyonu, rezerv/tahsis/risk verisi), Astro ile SEO'lu içerik katmanı (mevzuat rehberleri, havza sayfaları), Three.js hero (Anadolu DEM'inden terrain, imleçle canlanan su damarları).

## Tarayıcı öz-denetim protokolü
Görsel/UI içeren HER işin bitti-tanımına şunlar dahildir (araç: Playwright
MCP — .mcp.json'da kayıtlı; MCP oturumda yoksa arac/oz-denetim.mjs):
1. Etkilenen sayfaları headless tarayıcıda aç.
2. Konsol hata/uyarılarını topla — 0 olmalı.
3. Kırık iç link tara — 0 olmalı.
4. Tam sayfa ekran görüntülerini cikti/denetim/ altına kaydet.
5. Etkileşimli öğeleri test et (menü aç/kapat, hover, ESC vb.).
6. Sonuçları rapora yaz.
Bu öz-denetim kullanıcı onayının yerine GEÇMEZ; ön elemedir.

## Kurallar
- Her işin sonunda commit + push OTOMATİK yapılır; push için ayrıca
  onay sorulmaz (kullanıcı kararı, 2026-07-14).
- Tasarım kararlarında DESIGN.md bağlayıcıdır, ondan sapma.
- Haritanın nihai deneyim hedefi VIZYON.md'dedir ("Sondaj Anı") — fazlar
  halinde, her fazda kullanıcı onayıyla yürünür.
- Her oturum başında SIRADAKILER.md'yi oku ve kullanıcıya ilk mesajında
  "Sıradaki 3 iş: ..." diye özetle; biten işi kuyruktan düş, yeni
  istekleri kuyruğa ekle.
- Stack: vanilla JS + Vite; içerik katmanı Astro; React/Next kullanma.
- Barındırma: Cloudflare Pages. Ağır sunucu bağımlılığı ekleme, site statik kalır.
- Arayüz dili Türkçe. Emoji yok.
