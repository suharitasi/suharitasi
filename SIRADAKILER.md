# SIRADAKILER.md — projenin tek iş kuyruğu

Öncelik sırasıyla; biten iş kuyruktan düşer, yeni istekler kuyruğa eklenir.

KUYRUK BAŞI (sıradaki iş): Su Kanunu TBMM izleme sistemi.

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
32. HENDEK FAZ 2 — il rejimi aracı + programatik il sayfaları — YAPILDI
    (2026-07-16): TEK üretici (src/data/il-profil.js) → /arac/il-rejimi/
    (JS'siz çekirdek: 81 statik linke düşer; JS'le panel + ?il= paylaşım)
    + /kuyu-ruhsati/[il]/ 81 sayfa + indeks. İnce içerik eşiği 81/81
    geçti (dürüst denetim: 14×3, 43×4, 24×5 unsur); genel süreç
    kopyalanmadı (kontrol: 0 ihlal, ana rehbere link); uydurma kontrolü
    5 örnek ilde temiz; JSON-LD 330 nesne geçerli; sitemap yalnız
    üretilen sayfaları içeriyor (81+2). GRACE eğim hesabı tek bakım
    noktasına alındı (grace-hesap.js — 3 kopya tekilleşti). Görsel
    onay: il-konya/il-bolu/arac-*.png. Not: baraj/GRACE verisi cron'la
    güncellendikçe il sayfaları da sonraki build'de tazelenir.
33. TASARIM ANAYASASI FAZ 0 — KULLANICI ONAYI BEKLİYOR (2026-07-16):
    DESIGN.md 2.0 yazıldı (üç font hiyerarşisi: Cormorant + Manrope +
    IBM Plex Mono; kicker sistemi; 6 kart ton ailesi — düz ton kararı;
    easing/durum sözlüğü; veri bandı dili; iki hız sınıfı; 11 maddelik
    başarısızlık listesi; akuamarin çift-ton kuralı #4FC3D0/#0F7A8A).
    Örnek sayfa /stil-pilot/ canlıda (noindex, sitemap dışı) — kuyu
    ruhsatı rehberi yeni dille. ONAY KAPISI: kullanıcı canlıda "bu dil,
    devam" demeden FAZ 1 (toplu giydirme), FAZ 2 (menü), FAZ 3 (deneyim
    sahnesi) BAŞLAMAZ.
34. YÖN YÜKSELTMESİ — SU-DİLİ FAZ 0 — ONAYLANDI (2026-07-16;
    Varyant A + iç sayfa dili "bu dil, devam"): DESIGN.md 3.0 su-dili
    anayasası (derinlik skalası HEDEF'ten örneklenmiş — kıyas kayıtlı:
    petrol skalası kazandı, akuamarin/gece-lacivert elendi; 4 akış
    eğrisi; ışık kırılması vurgusu; kot cetveli ölçüm esteti; TEK MOD
    kararı gerekçeli; mobil birinci sınıf). /stil-pilot/ v3 skalasına
    güncellendi. /harita-stil/ (varyant A: sol üst dikey) +
    /harita-stil/b/ (alt kenar yatay) kuruldu — HEDEF sahnelemesi
    (retina 1x/2x, AVIF/WebP/JPEG, LQIP blur-up, mobilde Türkiye
    merkezde, menü renkleri görselden örnekli + AA kanıtlı, overlay
    menü çalışır). ONAY: kullanıcı canlıda (1) iç sayfa dili
    /stil-pilot/, (2) menü varyantı A mı B mi — ikisini birden
    bildirmeden FAZ 1-2-3 başlamaz.
35. WebGL DENEYİM SAHNESİ — RAFTA (yön yükseltmesi kararı, 2026-07-16):
    canlı su sahnesi iptal değil ertelendi; öncelik su-dili + HEDEF
    sahnelemesi. Kullanıcı isterse ayrı brief'le döner.
36. SU-DİLİ FAZ 1 — TÜM İŞ SAYFALARI GİYDİRİLDİ — KULLANICI ONAYI
    BEKLİYOR (2026-07-17): 5 tür, 5 ayrı commit (FAZ1-a..e): çekirdek+
    indeksler / 9 rehber / 25 havza / 81 il+indeks / araç+hakkında+
    su-kanunu. Kicker sistemi, derinlik skalası, su-ivmesi easing'leri,
    kırılma vurgusu, kot-cetvelli veri bandları, kart aileleri, tanımlı
    hover/focus/press her türde; içerik/veri/URL/JSON-LD değişmedi.
    Görsel slot sözleşmesi: src/data/gorseller.js (rehber-hero /
    havza-kart-zemini / bolum-vinyeti) — Midjourney görselleri gelince
    TEK config değişimiyle oturur; şimdilik skala-degrade placeholder.
    Denetimde yakalanıp düzeltilen: çifte hero bandı, scrim z-katmanı,
    mobil nav hedefleri 26→45px, soluk metin kontrastı 4.42→4.85 (AA).
    Kanıt: konsol 0, kırık link 0/124, Lighthouse il 100/100/100/100 +
    rehber 97/100, görüntüler cikti/faz1/ (masaüstü 9 + mobil 4 tür).
    Kullanıcı canlı turu sonrası: FAZ 2 (menü) + /harita-stil/ taşıma
    kararı birlikte.
37. CC ROOT'TAN SUHA'YA TAŞINDI — YAPILDI (2026-07-17): proje
    /home/suha/projeler/suharitasi (mv+chown, güvenlik: /root izolasyonu
    korundu), suha kullanıcısı + sudo + SSH, CC 2.1.212 bypassPermissions
    (agresif mod fiili test edildi), MCP Playwright çalışır, cron suha'ya
    taşındı (root boş), git credential store (token URL'den çıkarıldı).
    Arşiv 26 değişmez varlık birebir sha256. AÇIK: sızan eski GitHub PAT
    kullanıcı tarafından İPTAL+YENİLENMELİ (transkriptte göründü).
38. SUNUM REFORMU FAZ 0+1 — YAPILDI (2026-07-20): üç temsilci sayfa
    teşhisi (B1-B17, K1-K4; kanıt cikti/denetim/faz0/) + DESIGN.md §17
    "Sayfa Mimarisi" (3-saniye, katmanlı sunum, veri kahraman, kart
    dili, mobil-öncelik, SU-DİLİ uyumu). Kullanıcı ilke onayı verildi.
39. SUNUM REFORMU FAZ 2a — HAVZA KALIBI PİLOTU (Sakarya) — KULLANICI
    ONAYI BEKLİYOR (2026-07-20): kalip:2 frontmatter kapısı (yalnız
    Sakarya; 24 havza + diğer sayfalar bit-değişmedi, curl kanıtlı).
    HavzaKahraman bandı (6,01 km³/yıl + YAS rezervi + GRACE ↓azalma +
    59-ay sparkline + künye) + Katman bileşeni (native details, JS 0,
    7 katman varsayılan kapalı; --e-suzul 420ms açılış, reduced-motion
    korumalı). Çifte özet kaldırıldı (ozet yalnız meta/kartlarda).
    Metrikler: masaüstü 6,0→2,1 ekran; 375px 10,7→3,2; ilk ekran görsel
    öğe 0→2 (büyük değer + sparkline). Lighthouse 96/100/100/100.
    GEO kanıtı: öz-cevap + FAQPage JSON-LD + katman içi tam metin
    curl'la JS'siz doğrulandı. Kanıt: cikti/denetim/faz2/ (AB-* yan
    yana dahil). Mobil menü dar-şerit yalnız MOCK (koda girmedi;
    faz2-sakarya-mobil-menumock.jpeg) — menü reformu üç kalıp onayı
    sonrası ayrı site-geneli adım. ONAY SONRASI: rehber + vaka kalıbı
    pilotları (kullanıcı onayı gelmeden BAŞLANMAZ). → Onay geldi
    (2026-07-21); 2b+2c pilotları yapıldı (madde 40-41).
40. SUNUM REFORMU FAZ 2b — REHBER KALIBI PİLOTU (kuyu-ruhsati) —
    TAMAM (kullanıcı canlı onayı 2026-07-21): kalip:2 kapısı (yalnız
    kuyu-ruhsati; diğer 8 rehber DOM-eşit — tek fark görünmez scoped-css
    kimlik attribute'u; 25 havza + tüm diğer sayfalar bit-eşit). İlk
    ekran: 280-cevap + "bu rehber ne çözer" (frontmatter cozer, damıtık)
    + içindekiler kartları (başlıklardan otomatik, BÖLÜM sayacıyla aynı
    numara). Katmanlar (varsayılan kapalı): madde metinleri + 81-il
    tablosu. Başvuru akışı tablosu → 4 numaralı adım kartı (dikey ray;
    hücre metinleri birebir korundu). Giriş koreografisi: .gk sıralı
    fadeUp 100ms kademe, --e-suzul, reduced-motion/print korumalı;
    başlık bloğu LCP için gizlenmeden süzülür. Belge tablosu kendi
    kabında kayar (375px gövde taşması 0). Metrikler: masaüstü 12,8→6,0
    ekran; 375px 22,9→9,4; ilk ekran görsel öğe 0→3; kesintisiz metin
    17→7 satır. Lighthouse 94/100/100/100 (pilot dışı referans 96).
    GEO: 280-cevap + Article JSON-LD + madde/il/adım tam metinleri
    curl'la JS'siz DOM'da doğrulandı. Kanıt: cikti/denetim/faz2/faz2b-*.
41. SUNUM REFORMU FAZ 2c — VAKA KALIBI PİLOTU (/vaka/meysu/) —
    TAMAM (kullanıcı canlı onayı 2026-07-21): yol teyidi — sayfa
    /vaka/meysu/ (brief'teki "meysu-su-guvensi" değil; slug dosya
    adından). B17 gereği içerik KISALTILMADI (görünür kelime 226→257):
    sahne eklendi. Kahraman stat kartları ilk ekranda (3.395,33 ha /
    2056 / 3 bildirim — frontmatter kahraman alanı, her değer KAP
    1604957 künyeli; <4 nokta → grafik değil stat kartı, dataviz
    eşiği). Olay akışı → dikey zaman çizgisi (su-degrade şerit + tarih
    düğümleri; son düğüm dolu = sonuç). Üçlü özet tekilleşti: görünür
    tek özet öz-cevap (ozet meta/listede; gövde paragrafı özet değil,
    akış girişi — aynen durur). Giriş koreografisi 2b ile aynı sözlük.
    Metrikler: ilk ekran görsel öğe 0→4 (masaüstü); kesintisiz metin
    15→10; mobil 3,9→4,4 ekran (sahne eklendi, içerik korundu).
    Lighthouse 100/100/100/100. GEO: öz-cevap + Article JSON-LD +
    olay/kahraman tam metinleri curl'la JS'siz doğrulandı. Pilot
    izolasyonu: bit düzeyinde tek değişen sayfa /vaka/meysu/. Kanıt:
    cikti/denetim/faz2/faz2c-*. Not: kalıpların koreografi/katman CSS'i
    yayılım fazında tekilleştirilecek (şimdilik pilot-başına scoped).
42. SİTE-GENELİ MOBİL MENÜ REFORMU (FAZ A-ÖN + FAZ A) — TAMAM
    (2026-07-21: push d2fea9d..fd4ec5e canlı, kullanıcı canlı onayı):
    (a) FAZ A-ÖN: landing header'ı tek kaynağa alındı (UstMenu tema
    varyantı aydinlik/koyu; landing src/pages/index.astro'ya taşındı,
    eski statik arsiv/landing-statik/). Görsel birebir: pixelmatch
    %0,000 (1440+375), computed birebir, canlı↔yerel SEO/GEO eşit.
    (b) FAZ A: mock'tan dar şerit — ≤640px'te marka+MENÜ, kapalı işgal
    içerik 226,4→85,8px / landing 104,6→84,8px (hedef 85±4); linkler
    DOM'da kalır (JS'siz crawl), panel=TamEkranMenu, yeni JS 0 bayt.
    Denetimin yakaladığı CANLIDA DA VAR hata düzeltildi: landing <main>
    nav tıklamalarını yutuyordu (masaüstü 5/5 link engelliydi) →
    header.koyu z-index (görsel fark 0 piksel). Lighthouse sakarya
    4×100, kuyu-ruhsati medyan 96 (A/B gürültü kanıtlı). Kanıt:
    cikti/denetim/faz-a-on/ + cikti/denetim/menu/ (RAPOR.md'ler).
    Push yapıldı, canlı onaylandı; Cloudflare cache purge gerekirse
    kullanıcı panelden yapar (otomasyon yok). Gerçek iOS Safari testi
    kullanıcıda (emülasyon şerhi).
43. FAZ 3 — /HARİTA/ CANLI VERİ PANELİ — TAMAM (2026-07-21: push
    d2fea9d..fd4ec5e canlı, kullanıcı canlı onayı): hero altında 25 havza kartı (HavzaPaneli,
    build-time statik, çalışma anı JS 0); GRACE eğimine göre sıralı, eşik
    A ≤-1,5 (5 kritik: Asi, Fırat-Dicle, Van Gölü, Ceyhan, Seyhan; onaylı),
    mobil iki kolon (onaylı), YAS rezerv havza-bazlı teyitli. Hero pixel
    %0,000 değişmedi (1440+375); Lighthouse medyan 74→75; 25 kart→25
    benzersiz link 0 kırık; düz-çizgi kuralı sentetik+gerçek seriyle
    kanıtlı; konsol 0, taşma 0. Bilinçli sapmalar raporda (yön dili tek
    bakım noktası; tr-TR yuvarlama). Kanıt: cikti/denetim/faz3/RAPOR.md.
