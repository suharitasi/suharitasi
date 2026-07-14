# SIRADAKILER.md — projenin tek iş kuyruğu

Öncelik sırasıyla; biten iş kuyruktan düşer, yeni istekler kuyruğa eklenir.

1. HEDEF.png hero — YAPILDI: görselin kendisi tam ekran hero oldu; 3D
   atmosfer sahnesi src/harita-3d/ altına arşivlendi (silinmedi)
2. Kullanıcı onayı → canlıya deploy (Production kontrolü)
3. Landing giriş koreografisi + Arslan Hukuk footer imzası — YAPILDI,
   DENETLENDİ (2026-07-14): kelime kelime animasyon + imza kökte MEVCUT
4. www.suharitasi.com custom domain ekleme — YAPILDI (2026-07-14):
   kullanıcı panelden ekledi, test edildi
5. suharitasi.tr → suharitasi.com 301 — YAPILDI (2026-07-14):
   kullanıcı panelden kurdu, çalışıyor (test edildi)
6. Search Console + sitemap — YAPILDI (2026-07-14)
7. Kullanıcı kendi logosunu üretince /harita/ sayfasına logo eklenecek
   (2026-07-14: logo + "konsept görsel" atıfı kaldırıldı, sayfa salt görsel)
8. Sunucu reboot (bekleyen kernel) — YAPILDI (2026-07-14)
9. Faz 3B: kamera + ekrana damla sıçraması (Sondaj Anı-1)
10. Aşama 1 derin kazı: havza GeoJSON + DSİ verisi + KAYNAKLAR —
    YAPILDI (2026-07-14): 25 havza GeoJSON (data/havzalar/, 90KB web
    sürümü) + DSİ 2024 veri künyesi (data/havza-veri.json) + mevzuat
    kütüphanesi + Su Kanunu taslak takibi + Sakarya gerçek veriyle
    dolduruldu. AÇIK KALAN: havza geometrisi resmî kaynakla
    doğrulanamadı (gov CBS yurt dışına kapalı); tahsis verisi yok.
11. Kalan 24 havza sayfası — YAPILDI (2026-07-14): 25/25 havza sayfası
    havza-veri.json künyelerinden üretildi
12. Havza geometrisinin resmî kaynakla doğrulanması (TR IP'den
    geodata.tarimorman.gov.tr / cbs.dsi.gov.tr denenecek)
13. Aşama 2 pipeline → canlı baraj doluluğu (VIZYON-5) — NOT: DSİ
    Tablo 4.7 (havza bazında doluluk 2010-2024) kaynak/dsi/ yolunda hazır
14. Konum tabanlı kişisel açılış (VIZYON sırası 3)
15. İl/kurum katmanı — YAPILDI (2026-07-14): data/il-kurum.json (81 il,
    26 DSİ bölgesi, 25 havza-il listesi) + havza sayfalarında "İller ve
    yetkili kurumlar" bloğu + kuyu-ruhsati rehberinde 81 il tablosu
16. Mevzuat rehberleri paketi — YAPILDI (2026-07-14): 9 rehber
    (Apilex çıktısından, kaynak/apilex-sumevzuat.md) + taslak-takibi'ne
    Bölüm 12 tespiti. YAYIN KİLİDİ: madde 17 kapanmadan yayına alınmaz.
17. Karar künyelerinin doğrulaması (YAYIN KİLİDİ) — 9 rehberdeki tüm
    Yargıtay/Danıştay künyeleri resmî kaynaktan doğrulanacak; özellikle
    çelişkili Danıştay 13. D. künyesi çözülecek: 2020/1104 E.-2023/4576 K.
    vs 2020/1093 E.-2023/2584 K. (kaynak-suyu-kiralama rehberi)
18. Eksik rehber verileri ayrı kanaldan tamamlanacak: su kirliliği
    cezaları (2872/SKKY), koruma alanı yasak listesi, TBB reklam yasağı
    uyumu (KAYNAKLAR.md "VERİ YOK" bölümü)
19a. Tarayıcı öz-denetim altyapısı — YAPILDI (2026-07-14): Playwright
    MCP kuruldu (.mcp.json; yeni oturumda araç olarak aktif), protokol
    CLAUDE.md'de, script yedeği arac/oz-denetim.mjs; deneme denetimi
    temiz (0 hata, 0 kırık link, 3 görüntü cikti/denetim/).
19. Menü + içerik sayfaları görsel yenileme (su hissi) — YAPILDI
    (2026-07-14): su damlası imleç, WebGL menü su simülasyonu, dergi
    listeler, hero şeridi. KULLANICI ONAYI BEKLİYOR: tarayıcıda menüyü
    açıp imleci gezdirerek nihai onay verilecek; onaysız yayına alınmaz.
