# 04.10.2026 — GROWTH SEO · ŞEMA · HUKUKİ ENTEGRASYON · ANAHTAR ONARIMI

**Sınıf:** BÜYÜK İŞ · **Brief:** `cikti/brief/2026-10-04T1745-growth-seo.md`
(brief-denetci: TEMİZ) · **Kaynak:** sahip talimatı (master growth turu).

---

## 1. HEDEFLİ SEO + CTA BAŞLIKLARI (uygulandı)

| Sayfa | Eski başlık/meta | Yeni |
|---|---|---|
| `/` | "Türkiye'nin su verisi ve su hukuku tek haritada" | **"Türkiye Su Havzaları ve Yeraltı Suyu Haritası \| Sorgulayın"** |
| `/` meta | veri envanteri | "25 su havzası, yeraltı suyu verileri ve günlük baraj durumu tek haritada. İlinizi seçin; kuraklık eğilimini resmî kaynaklardan sorgulayın." |
| `/harita/` | "Harita — Su Haritası" | **"Türkiye Su Havzaları Haritası: 25 Havza, Canlı Veri \| DSİ"** + 160 bekçili meta |
| `/tahmin/` | "Su Projeksiyonu: 6 Aylık Tahmin (Tahminsel)" | **"Kuraklık Tahmini ve Havza Su Projeksiyonu \| 6 Aylık"** + `metaAciklamaHam` (160) |

**Dürüstlük notu:** Örnek metindeki "Ulusal Su Bilgi Sistemi verileriyle"
İFADESİ KULLANILMADI — NHYP = Nehir Havza Yönetim Planı'dır; USBS entegrasyonu
yok. Kaynak iddiaları yalnız gerçek kaynaklar (DSİ 2024, EPİAŞ, NASA GRACE,
SYGM). "Parseliniz" yerine "iliniz" yazıldı: parsel akışı anlık sorgu değil,
teknik ön değerlendirme formudur.

## 2. ZENGİN SONUÇLAR (Schema)

- **YENİ `SoftwareApplication`:** `/harita/` (havza veri paneli) ve
  `/ilce-sorgu/` (sorgu aracı) — `offers 0 TL`, `featureList`, publisher.
  **`aggregateRating`/yıldız ÜRETİLMEDİ** (sahte değerlendirme hem Google
  politikasına hem projenin uydurma yasağına aykırı).
- **Zaten mevcut:** `FAQPage` 12 sayfa ailesinde (nerede-su-cikar, havzalar,
  nehirler, göller, kuyu-ruhsati[il], basin, 4 rehber/sayaç, kapatma-kaydı);
  `Dataset` /veri, /tahmin, /harita, kuyu-ruhsati'ta. `/harita/`'ya görünür
  SSS olmadığından FAQPage EKLENMEDİ (Google görünmeyen içerik kuralı).
- **Canlı doğrulama (schema MCP):** `/harita/` tipleri arasında
  `SoftwareApplication` + `BreadcrumbList` + `Dataset` OK;
  `/yeralti-suyu/adana/` → `WebPage + ItemList + BreadcrumbList` OK.

## 3. HUKUK + VERİ KOMBİNASYONU (harita modülü)

`HavzaPaneli` (25 kart) her karta **hukuki statü satırı** aldı:
- 1 havzada (Sakarya) "Hukuki çerçeve: yayımlandı" (doğrulanmış `hukuk`
  bloğu mevcut), 24'ünde dürüstçe **"Hukuki kısıt: doğrulanmadı"**.
- Panel altına açıklama: satır, havza sayfasındaki "Bu havzada hukuki durum"
  bloğunun durumudur; doğrulanmamış kısıt yazılmaz.
- Havza sayfalarındaki mevcut hukuki blok + kuyu ruhsatı köprüleri korunur.
- **Yeni hukuki iddia yazılmadı** (hüküm yazma yasağı; [APILEX] kalemi).

## 4. MARKA FİLİGRANI

- **Global yazdırma kuralı** (`Sayfa.astro`, `@media print`):
  "suharitasi.com Tarafından Üretilmiştir" — sabit, −32° döndürülmüş, %10
  alfa; ekran görünümü DEĞİŞMEZ. `Ctrl+P` ve `window.print()` akışlarının
  tamamını kapsar.
- `/harita/` kendi head'ini kullandığından aynı kural orada da tanımlı
  (`dist/_astro/harita.*.css` doğrulandı).
- Kendi belgesini üreten 2 araç: `su-uyum.js` ve `kisit-sorgu.js` PDF/print
  çıktısında filigran taşır.
- **Dürüstlük:** sitede GÖRSEL/CSV export yok (yalnız .ics takvim indirme) →
  olmayan export için "filigran eklendi" denmedi.

## 5. PROGRAMATİK SEO — `/yeralti-suyu/[il]/` (81 sayfa)

- Kaynak: `il-profil.js` (tek veri kaynağı) + `yayinlananIller()` ince-içerik
  kapısı (5 gerçek unsurdan ≥3'ü). **81 sayfa üretildi.**
- Her sayfa: ile özel H1/öz-cevap/meta (280/160 build bekçili), havza tablosu
  (yağış alanı, yüzey suyu, GRACE eğilimi, baraj doluluğu), hukuki köprü
  (kuyu-ruhsati[il] + mevzuat), harita/sorgu/projeksiyon iç bağları,
  `WebPage + ItemList` şeması.
- İç bağ: `/kuyu-ruhsati/[il]` sayfalarından yeni rotaya bağlantı (yetim yok).
- **sitemap.xml: 1023 → 1104 URL (+81)**; canlıda doğrulandı. arama.json ve
  llms.txt build kancalarıyla otomatik kapsandı.
- **Yamyamlık izlemesi (DUR-1):** `/kuyu-ruhsati/[il]` ile çakışma sinyali
  GSC'de 2-4 hafta izlenecek; birleştirme kararı o zaman.

## 6. GÜNDEM YÖNETİMİ — "Türkiye Kuraklık Alarmı"

- Yeni bant (ana sayfa): GRACE ölçümüne göre **en hızlı azalan 4 havza** +
  "bugün" ve "6 ay sonra (tahmin)" değerleri + anlamlılık notu + Türkiye
  geneli anomali (son ay) + üretim tarihi.
- Veri build anında `data/tahmin` + `data/canli` dosyalarından; sayı sabit
  yazılmaz, boş alan build'i düşürür.
- Etiket disiplini: "bugün"=ölçüm, "6 ay sonra"=TAHMİN; garanti dili yok.
- Yerleşim: `.v2-ust-akis` DIŞINDA (içeride mobil CSS order listesi var —
  order'sız çocuk S1 dert sorusunun önüne binerdi).

## 7. KRİTİK HATA ONARIMI

### 7.1 `WA_SAYAC_ANAHTAR` ↔ panel secret
- **Yeni araç:** `arac/sayac-anahtar-esle.sh` — `--kontrol` (değeri
  yazdırmaz; 401/302 teşhisi + yol haritası) ve `--ayarla` (panel değerini
  gizli okur, `.env`'i atomik günceller, canlı doğrular).
- **Güncel canlı teşhis:** `.env` anahtarı (32 karakter) ile
  `/api/loglar` **401**, `/whatsapp/` okuma **302** → değer hâlâ FARKLI.
  Kod tarafı sağlam; tek adım panel değerini `--ayarla` ile girmek.
- **Kritik not:** Cloudflare Pages env değişikliği YENİ DAĞITIM ister; araç
  401/405 derse son dağıtımdan sonra tekrar koşulur.

### 7.2 GA4 403 (graceful degradation)
- **Ölçüm:** build hattı/`arac` içinde GA4 çağrısı **0** (`gsc-haftalik.py`
  yalnız webmasters API). GA4 403 yalnız MCP sunucusunun opsiyonel
  yeteneğini kapatır; MCP bunu `degraded_not_broken` olarak raporlar.
  Build/site akışı etkilenmez — mimari zaten graceful.
- Etkinleştirme (oturum/ziyaretçi akışı ölçümü) kullanıcı panel adımıdır
  (DUR-4).

## 8. DOĞRULAMA

| Ölçüm | Sonuç |
|---|---|
| `npm run build` | **EXIT 0 · 1190 page** (1109+81) |
| sitemap | 1104 URL · yeni rota 81 loc · canlıda doğrulandı |
| Canlı `site-saglik --hizli` | **GENEL YEŞİL — 0 kırmızı · 0 sarı · 13/13** |
| Yerel sağlık | kırmızı 0 (bilinçli G4 sapması → gerekçeli taban yenilemesi) |
| Görsel taban | 04.10.2026T17:52Z · gerekçe kayıtlı (alarm bandı + panel satırı + terim sözlüğü) |
| Canlı spot | /yeralti-suyu/adana 200 · /konya 200 · alarm bandı var · başlık yeni · filigran CSS'te |
| Schema MCP | /harita/ + /yeralti-suyu/adana/ doğrulandı |

## 9. DUR / SONRAKİ

1. **DUR-1** Yamyamlık izlemesi (yeni rota ↔ kuyu-ruhsati[il]) — GSC 2-4 hafta.
2. **DUR-2** Panel secret değerinin girilmesi (`--ayarla`) + yeniden dağıtım.
3. **DUR-3** "Ulusal Su Bilgi Sistemi" hedefi: USBS veri kanalı doğrulanırsa
   ayrı içerik işi.
4. **DUR-4** GA4 Admin API etkinleştirme + bu turun canlı görsel onayı.
5. GSC etki ölçümü: başlık/şema değişiklikleri 2-4 hafta içinde
   `gsc_ctr_opportunities` ile yeniden ölçülür (özellikle `/harita/` ve
   `/tahmin/` CTR).

---

*Üreten: 04.10.2026 growth turu. Karar kaydı §55 ve SIRADAKILER
güncellemesiyle commit edilmiştir.*
