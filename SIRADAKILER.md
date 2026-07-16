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
19. Menü + içerik sayfaları görsel yenileme (su hissi) — KULLANICI
    ONAYI BEKLİYOR (2026-07-14): ilk sürüm canlıda başarısız (sim
    görünmüyor, imleç topak, şerit soluk); düzeltme b32f7fa push'landı
    (sim görünürlüğü + FPS ısınması + SVG damla + belirgin şerit).
    Kullanıcı canlıda tekrar test edecek; onaysız kapatılmaz.
20. Pazarlama/CRO skill kazısı + danışmanlık raporu — YAPILDI
    (2026-07-14): 25 aday puanlandı, 2 skill seti kuruldu
    (marketingskills + claude-seo, ~/.claude/skills/), 11 sayfa canlı
    tarandı, rapor/pazarlama-danismanligi.md yazıldı (salt analiz,
    uygulama yok).
21. Dalga 1 — rapor uygulaması (İLK 5 HAMLE + 2 ek) — KULLANICI ONAYI
    BEKLİYOR (2026-07-15): landing nav + üç kapı ("Yakında" kalktı),
    E-E-A-T paketi (künye satırı + yazar kutusu + Article/Person/
    Breadcrumb/Organization/WebSite JSON-LD + og:image), rehber ağı
    (ilgili rehberler + iki küme), Sakarya hukuk bloğu pilotu, yazdırma
    düzeltmesi, 3 kolonlu footer, KOD-6/KOD-9. Headless kanıt temiz
    (build 40 sayfa, konsol 0, kırık link 0, JSON-LD 130 nesne
    schema.org uyumlu, yazdırmada gizli 0); nihai görsel yargı
    kullanıcının canlı testinde.
22. AÇIK — Su Kanunu bülteni canlıya alınamadı: Buttondown hesabı
    kullanıcıda. Form kodu hazır ve test edildi; src/data/bulten.ts'ye
    kullanıcı adı yazılınca açılır (README-BULTEN.md). Hesap açılana
    dek form hiçbir sayfada görünmez (sahte form yayınlanmaz).
23. AÇIK — FAQPage şeması eklenmedi: 9 rehberin hiçbirinde görünür
    soru-cevap bölümü yok (5'inde "Dikkat" tek paragraf, 4'ünde yok).
    Olmayan içeriği işaretlemek Google kurallarına aykırı. Rehberlere
    gerçek SSS bölümü eklenirse (Serdar'ın kalemi) şema da eklenir.
24. Dalga 2+ adayları (rapordan, onay bekler): bölgesel rapor sayfası
    (TAKTİK-3), kuyu ruhsatı kontrol listesi PDF (TAKTİK-5), 81 il
    programatik sayfa (TAKTİK-7), kalan 24 havzanın hukuk bloğu
    (içerik kullanıcıdan).
25. Dalga 2 — menü vitrini + deneyim yenileme — KULLANICI ONAYI
    BEKLİYOR (2026-07-15): tam ekran menü keşif yüzeyine dönüştü
    (sol: 5 bölüm + alt-etiket; sağ vitrin: son 3 rehber + kanun son
    durum + öne çıkan havza — tümü build-time otomatik, elle metin
    yok); iki menü kodu tekilleşti (/harita/ artık src/pages/
    harita.astro, ortak TamEkranMenu). Headless kanıt: 38/38 test
    (ESC/focus trap/reduced-motion/mobil/kaydırma), kaynak→menü veri
    eşlemesi 5/5, konsol 0, kırık link 0. Su simülasyonu GPU'suz
    görüntülenemedi — nihai onay kullanıcının canlı menü gezintisi.
26. 280 KARAKTER ÖZ-CEVAP KATMANI — YAPILDI (2026-07-16): 9 rehber +
    25 havza sayfasına başlık altı öz-cevap kutusu; rehber özleri elle
    doğrulanmış metinden damıtıldı (künye no yok), havza özleri
    havza-veri.json + GRACE'ten otomatik. Meta description'lar öz-cevaptan
    türüyor. Kanıt: meta==kutu 34/34, uydurma kontrolü temiz, build temiz.
    [ESKİ NOT] 280 KARAKTER KATMANI: mevcut 9 rehber + havza sayfalarına geriye
    dönük ÖZ CEVAP bloğu eklenir (yukarıdaki ilkeye göre). Örnek/
    kuyu-ruhsati: 'Su temini için kuyu açmadan önce DSİ'den belge şart
    (167 s.K. m.8). Üç belge: arama, kullanma, ıslah-tadil. Başvuru DSİ
    Bölge Müdürlüğü'ne, cevap süresi bir ay, belgeler harçtan muaf.
    Belgesiz kuyu: idari para cezası + kuyu kapatma.'
27. SU NABZI KATMANI (GRACE): kaynak keşfinde doğrulanan UNL GRACE
    haftalık yeraltı suyu verisinden (2003–13.07.2026, kayıtsız açık,
    TR-IP yok) — (a) menü/landing'e tek satır canlı gösterge (son 12
    ayda yeraltı suyu en çok azalan/toparlayan havza), (b) ayrı 'su
    nerede azalıyor/artıyor' değişim haritası. HENDEK FAZ 1 verisi
    kurulunca yapılır.
28. KOPYALANMA DİRENCİ UYGULAMASI: (a) Astro build'e minify+obfuscate
    (çalışmayı/perf bozmadan) + source-map kapatma; (b) Cloudflare
    scraper koruması + rate-limit, arama/AI botları beyaz listede;
    (c) ölçülü view-source caydırma. KANIT: build sonrası JS okunamaz +
    source map yok teyidi; Googlebot/GPTBot hâlâ erişiyor testi;
    Lighthouse ≥90 korundu. Uygulama sırası: mevcut görsel/veri işleri
    sonrası, tek brief.
29. HENDEK FAZ 1 — EPİAŞ baraj pipeline — ÇALIŞIYOR (2026-07-16):
    kimlik .env'e girildi, İLK GERÇEK ÇEKİM BAŞARILI (TGT 201; 17 havza,
    116 baraj eşleme, 64 günlük kayıt; kayıt başlangıcı 2026-07-16;
    Sakarya sayfasında gerçek tablo doğrulandı). Altyapı: arac/baraj-cek.mjs (TGT + havza→baraj eşleme + doluluk/
    kot/hacim, sayfalı, ham arşiv data/arsiv/baraj/ + normalize
    data/canli/baraj.json) + günlük cron 18:00 TR kurulu + havza
    sayfalarında BarajDoluluk bloğu (build-time SVG; veri yokken hiç
    çıkmaz, tek günde "kayıt yeni başladı", ortalama yalnız gerçek
    kayıttan "N gün" ibresiyle). Mock testten geçti (mutlu yol + arıza
    yolu + sızıntı taraması 0). AÇIK KALAN: lisansın girişli
    ekrandan kesin teyidi + deploy hook (opsiyonel) kullanıcıda; EPİAŞ
    setinde Fırat-Dicle, Konya Kapalı vb. 8 havza YOK (kaynak vermiyor —
    kapsam şerhi sayfada), Ceyhan/Asi bugün 0 kayıt döndü (izlenecek). İlk çekim sonrası: EPİAŞ havza adları ↔ site havza
    eşleşmesi gözden geçirilecek (Fırat-Dicle gibi bileşik adlar).
30. HENDEK FAZ 1-B — GRACE "su nabzı" — ÇALIŞIYOR (2026-07-16): GSFC
    mascon (açık, tokensız — Earthdata GEREKMEDİ, test kanıtlı) 530MB
    indirildi, 25 havza + ülke serisi çıkarıldı (254 gerçek ay,
    2017-18 boşluğu dolgusuz), havza sayfalarında "su depolaması
    eğilimi" göstergesi (son 5 yıl eğimi, "N gerçek aydan" ibresiyle).
    Haftalık cron Pzt 06:00 UTC + deploy hook. VARSAYIM DÜZELTMESİ
    (raporlandı): GRACE yeraltı suyu değil TOPLAM su depolaması (YAS +
    toprak nemi + kar + yüzey suyu) değişimi verir — site dili buna
    göre "su depolaması eğilimi"; 0,25° çözünürlük UNL görsel ürünüydü,
    sayısal mascon ~3° — "havza yaklaşık" şerhi sayfada.
31. GRACE TAM DEĞİŞİM HARİTASI (MapLibre) — AYRI İŞ (FAZ 1-B kapsamı
    dışında bırakıldı): "su nerede azalıyor/artıyor" interaktif harita
    + menü/landing tek satır canlı gösterge (SIRADAKILER 27a) —
    data/canli/grace-havza.json hazır, harita işi onayla başlar.
