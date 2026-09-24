# GSC FAZ 1+2 — 28 Günlük Baz (Baseline) Kütüğü

> **MÜHÜR / SEAL.** Bu dosya, Faz 1 (P1) + Faz 2 (P2) canlıya alındıktan SONRA
> ölçülen 28 günlük Google Search Console baz değerlerini dondurur. Amaç: GSC'nin
> 24–72 saatlik tarama gecikmesi geçtikten sonra **aynı 28 günlük pencere
> mantığıyla** karşılaştırma yapabilmek. Bu dosya değiştirilmez; yeni ölçüm ayrı
> dosyada tutulur (`docs/GSC-FAZ1-2-SONRA-*.md` gibi).

## Künye
- **Mülk:** `sc-domain:suharitasi.com` (Google Search Console)
- **Kaynak:** Search Console Search Analytics API
- **Ölçüm tarihi (mühür):** 2026-09-24
- **Veri penceresi (bu dönem):** 2026-08-25 … 2026-09-21 (28 gün)
- **Önceki dönem:** 2026-07-28 … 2026-08-24 (28 gün)
- **Faz 1+2 commit:** `5ab66b5` (Faz 1 `5ab66b5` içinde; Faz 2 aynı commit)
- **Derleme:** 1.016 sayfa · `sitemap.xml` 1.012 URL

## Baz değerler (MÜHÜRLÜ)
| Metrik | Bu dönem (25.08–21.09) | Önceki dönem (28.07–24.08) |
|---|---|---|
| Tıklama | **258** | 108 |
| Gösterim | **23.613** | 5.881 |
| CTR | **%1,09** | %1,84 |
| Ortalama konum | **9,54** | 9,08 |

Kırılım (bu dönem):
- Ülke: Türkiye 254 tık / 23.036 gösterim; Almanya 3/46.
- Cihaz: Mobil 151 tık / 18.186 göst. (%0,83 CTR) · Masaüstü 106 / 4.941 (%2,15) · Tablet 1/486.
- Gösterim liderleri (düşük CTR): `/nehirler/gokirmak/` ~5.033 göst. (%0,02) ·
  `/nehirler/esen-cayi/` ~2.420 (%0,04) · `/nehirler/zap-suyu/` ~1.161 (%0,17).
- Tık liderleri: `/havzalar/` 64 · `/nerede-su-cikar/` 27 (%9,7 CTR).

## Bu bazdan sonra canlıya alınanlar (karşılaştırma bağlamı)
- Faz 1: BreadcrumbList `item` onarımı · `/nehirler/` + `/goller/` hub (342 varlık) ·
  `sitemap-index.xml` GSC temizliği · Cloudflare Web Analytics bileşeni (token boş) ·
  navbar/footer bağları.
- Faz 2: H1 altı `Özet bilgi` · gövde semantik SSS (FAQPage ile tek kaynak) ·
  gerçek OSM geometrisinden statik SVG · `İlgili Havza Varlıkları` tablosu ·
  3 mevzuat maddesinde editoryal özet · `durumum` NACE kapsam girişi.

## Karşılaştırma yöntemi (sonraki ölçüm)
1. Mühürden **en az 14 gün** (ideal 28 gün) sonra, GSC'de **eşit uzunlukta**
   pencere seç (mühür penceresiyle aynı takvim hizası: Pazartesi–Pazar).
2. Aynı boyutlarda karşılaştır: toplam (tık/gösterim/CTR/konum), `query`, `page`,
   `device`, `country`.
3. Özellikle izlenecek: değişen nehir/göl sayfalarının CTR'ı; `/nehirler/` ve
   `/goller/` hub tıklamaları; mevzuat editoryal sayfalarının (5393 m.75,
   süre 2886 m.17, 6200 ek m.9) gösterim/tık değişimi; ortalama konumun 9,5 → <7 eğilimi.
4. Tarama gecikmesi payı: GSC verisi ~2 gün gecikmelidir; pencereyi buna göre kaydır.

## Sınırlar / dürüstlük notu
- GA4 Admin API etkin değil → arama dışı kanallar (doğrudan/sosyal/referans) bu bazda YOK.
- CrUX/PSI anahtarı yok → Core Web Vitals bu bazda yok.
- AI Overview / harita paketi varlığı DataForSEO kimliği olmadığından ölçülemedi;
  düşük CTR yorumu ölçülmüş Gösterim/CTR ile sınırlıdır (kanıt: gsc_ctr_opportunities).
- Bu belge bir **ölçüm kaydıdır**, hukuki görüş değildir.
