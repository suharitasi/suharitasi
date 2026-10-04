# RAPOR — 10 Skill Eş Zamanlı Tam Site Taraması ve Dönüşüm (04.10.2026 · KARARLAR §59)

Sahip talimatı: 10 otonom skill tüm siteyi (1190 sayfa + src) eş zamanlı tarasın,
alanına giren değişiklikleri uygulasın; sonra `EXIT 0` + `GENEL YEŞİL` kapısı.
Uygulama protokolü: 5 bağımsız salt-okunur denetim ajanı paralel koştu; dosya
değişiklikleri çakışma olmaması için TEK elden (bu oturum) yapıldı; sonra
build + tarayıcı öz-denetimi + sağlık kapısı.

## 1. Uygulanan değişiklikler (skill bazında)

### suharitasi-donusum-hunisi — jargon temizliği (asıl büyük iş)
- **198 dist dosyasında bulunan görünür jargon → 0.** Kapsam dışı bırakılanlar
  bilinçli istisna: JSON-LD (makine katmanı), kod yorumları, kapalı `<details>`
  (tahmin.astro "Akademik ve Teknik Yöntem Detayları"), `/api-dokumantasyonu/`
  teknik parantezi (Developer Hub — skill script'inde allowlist).
- İlk geçişte açık ad → sonra sade: "NASA'nın yerçekimi uydu ölçümleri",
  "uydu su ölçümü", "eğilim gerçek mi testi", "düz-eğilim testi".
- Değişen başlıca şablonlar: `havzalar/[slug]`, `HavzaKahraman`, `HavzaPaneli`,
  `HavzaYasBandi`, `HavzaSuTablasiGostergesi`, `GraceEgilim`, `KuraklikAlarmi`,
  `DegerTeklifi`, `harita`, `su-riski-endeksi`, `havza-riski`, `veri/gundem`,
  `basin`, `veri/raporlar`, `en/index`, `feed.xml`, `kuyu-ruhsati/[il]`,
  `il-profil.js`, `su-riski.js`, `vitrin.js`, `content/raporlar/2026-10.md`,
  `public/s/{su-riski,kisit-sorgu,su-uyum}.js`.
- Tarama kapısı: `.agents/skills/.../jargon-tara.sh` → **0 bulgu**.

### suharitasi-ui-hig — boşluk/whitespace turu
- Tablo hücre padding'i site genelinde `0.6rem 0.75rem`'e çekildi (14 dosya:
  tahmin, yeralti-suyu, api-dokumantasyonu, su-riski-endeksi, veri/iklim,
  istihbarat, acik-veri, NehirSnippet, su-verimliligi-sayaci, api-loglari,
  IlPotansiyel, IlKurumTablosu, BarajDoluluk, havzalar/[slug], islem-matrisi).
- `Katman.astro` üst boşluğu `1rem → clamp(1.4rem,3vh,1.9rem)` (7-8 katman
  üst üste binen bölümlerde bölüm sınırı görünür oldu).
- `su-riski-endeksi`: bölüm arası `2rem → clamp(2.6rem,6vh,3.4rem)`, formül
  ölçüsü `80ch → 68ch`.
- Liste/kart boşlukları: veri/index (0.6→0.75 + alt başlık 1.6→2.2rem),
  resmi-gazete (0.5→0.7), sozluk (0.4→0.7), basin (0.6→0.8),
  KurumsalHizmetler (0.6→0.8), su-verimliligi iç listeler, islem-matrisi
  bölüm arası 2.6→3.2rem.

### suharitasi-programatik-seo + suharitasi-schema-botu — başlık/şema
- Başlık denetimi (1191 HTML): seviye atlaması 0, boş H1 yok, çoklu H1 yok.
- `/su-hukuku/` H1'i "Su hukuku" → **"Su hukuku rehberi: izin, ceza ve dava
  yolları"** (title ile hizalandı).
- `HukukDanismanlik` tekrar eden H2'si konuya göre benzersizleştirildi
  ("… — {konu}"); `su-verimliligi-sayaci` ve `sektor` içindeki tekrar eden
  H3'ler öğe adıyla benzersizleştirildi.
- `/harita/` H1 yokluğu **BİLİNÇLİ İSTİSNA**: kaynakta "h1 YOKLUĞU
  BİLİNÇLİDİR — KULLANICI KARARI 28.07.2026 … düzeltilmez" kayıtlı; geri
  alınmadı.
- Şema taraması: `FAQPage` **509** · `SoftwareApplication` **2** ·
  `Dataset` **121** · `BreadcrumbList` **1107** · `TechArticle` **2** ·
  `aggregateRating` **0** · `Review` **0**.

### suharitasi-hukuk-uyum + suharitasi-build-guvenlik
- `uyari-tarama.sh`: **0 bulgu** (disclaimer var, yasak vaat dili yok).
- Build: **EXIT 0 · 1190 sayfa · sitemap 1104**; dışarıdan `/api/loglar` 401
  (önceki doğrulama), `.env` eşleşmesi 200/200.

### suharitasi-cbs-veri — veri tutarlılığı onarımları
- **RG homonim il sızması düzeltildi:** "Orta Gediz Havzası" kaydının
  `il` listesi `[Kütahya, Manisa, Çankırı] → [Manisa, İzmir]` (Orta/Gediz
  ilçe adlarından sızmış yanlış iller; saha metni Manisa+Kemalpaşa/İzmir).
  Kaynak: `veri/potansiyel/isletme-sahalari.json`; dist `kisit.json` ile
  doğrulandı. (Kök neden notu: eşleyici havza adını ilçe sanıyor.)
- **Baraj ortalaması as-of düzeltmesi:** `il-profil.js:barajOzeti` artık
  farklı tarihli serileri karıştırmıyor; tek bir "en güncel doluluk bildiren
  gün" seçilip yalnız o günü bildiren barajlar ortalanıyor (bayat seri taze
  veriye karışmaz). 81 il sayfasının baraj satırı bu kuralla yeniden üretildi.
- `altin-ornek.mjs`: **23/23 yeşil**.

### suharitasi-performans · suharitasi-surtunme-avi · suharitasi-skill-mimarisi
- Performans envanteri çıkarıldı; site kodu değişmedi. `public/s/*.js` minify
  hattı çalışıyor (%35,7 küçülme); hero LCP preload `fetchpriority=high`
  yerinde; videolar `preload=none` (bilinçli).
- Sürtünme: huni sayfaları headless yüründü — konsol **0**, **102 iç link
  0 kırık**; CTA'lar (/whatsapp/, /hizli-danisma/, tel, e-posta) yerinde.
- Router/mimari: `.agents/skills/suharitasi-skill-mimarisi` güncel.

## 2. Bilinçli yapılmayanlar (kayıtlı gerekçe)
- `/harita/` H1 eklenmedi (kullanıcı kararı 28.07 — kaynakta yazılı).
- `/api-dokumantasyonu/` teknik terimleri korundu (Developer Hub istisnası).
- JSON-LD/kod yorumları/kapalı details jargonu korundu (makine katmanı).

## 3. Kuyruğa alınan (kanıtlı, düşük risk ama karar/onay gerektiren)
- Ölü hero seti silme (`hedef-1472.*`, `hedef-2944.*`, ~1,7 MB) — önce
  Cloudflare erişim günlüğünde dış istek kontrolü.
- Sahne posterleri için AVIF/WebP türetme (LCP deneyi; görsel iş, onay ister).
- 420px altı ızgaraları tek kolona indirme (durumum/rehberler/kuyu-tasima/
  api-loglari) ve kart ailesine 2px üst hairline (DESIGN §8) — kozmetik tur.
- Baraj verisinde çift anahtar temizliği (`ARAÇ BARAJI`, `GÜRSÖĞÜT-1`).

## 4. Kanıt özeti
- Build EXIT 0 · 1190 sayfa · sitemap 1104 · jargon 0 · altın örnek 23/23 ·
  öz-denetim konsol 0 / 102 link 0 kırık · commit `80f925d` + kayıt commit'i ·
  canlı dağıtım + `site-saglik --hizli` + gerekçeli görsel taban yenilemesi
  (aşağıda canlı doğrulama).
