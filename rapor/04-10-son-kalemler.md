# 04.10.2026 — SON KALEMLER RAPORU: D2 Kontrast · Mevzuat · API Log Paneli

**Sınıf:** BÜYÜK İŞ · **Brief:** `cikti/brief/2026-10-04T1715-son-kalemler.md`
(brief-denetci: TEMİZ) · **Kaynak:** sahip talimatı.

---

## 1. D2 KONTRAST ONARIMI (risk metinleri)

**Bulgu:** Risk renkleri 0,62–0,66rem metinde WCAG AA altındaydı. Ölçüm
(`#DFE9F0` zemin): turuncu `#E65100` **3,08:1** · yeşil `#2E7D32` **4,16:1**
· kırmızı `#C62828` **4,56:1** · kahve `#875518` **5,10:1**.

**Karar:** Grafik renkleri (SVG çizgi/dolgu) KİMLİK olarak aynen korundu;
metin için aynı ailelerin koyu türevleri token'landı (`--kehribar-metin`
deseni; yeni hue icat edilmedi) — `src/layouts/Sayfa.astro` K53 bloğu.

| Token | Değer | #DFE9F0 | #E9F0F4 | #FFFFFF |
|---|---|---|---|---|
| `--risk-kirmizi-metin` | `#8E1B1B` | 7,34 | 7,85 | 9,04 |
| `--risk-turuncu-metin` | `#7C2D12` | 7,61 | 8,14 | 9,37 |
| `--risk-yesil-metin` | `#14532D` | 7,40 | 7,91 | 9,11 |
| `--risk-kahve-metin` | `#5D3A0F` | 8,21 | 8,78 | 10,11 |
| `--risk-notr-metin` | `#2F4152` | 8,53 | 9,12 | 10,51 |

**Uygulama:** `HavzaSuTablasiGostergesi.astro` `[data-kategori]` metin
renkleri ve `havza-riski.astro` `.risk-seviye` etiketi (seviye→token eşlemesi)
bu türevleri kullanır; `risk-dolgu` çubuğu ve SVG sparkline `r.renk`/`RENK`
grafik paletinde DEĞİŞMEDİ. **Kanıt:** derlenen CSS'ten okunan değerlerle
minimum **7,34:1** (hedef ≥7,0); yerel `site-saglik --hizli` 14-gorsel
sapma 0.

## 2. MEVZUAT GÖVDE OPTİMİZASYONU

**Bulgu:** `/mevzuat/index.html` **686.930 bayt**; bunun **449.150 baytı**
her `<li>`'deki `data-madde` tam-metin kopyasıydı (DOM şişmesi + parse maliyeti).

**Çözüm (yetenek kaybı yok):**
- `data-madde` KALDIRILDI; tam metin arama indeksi yeni
  `/veri/mevzuat-arama.json` ucundan (Astro endpoint, cache 1 saat) yalnız
  **ilk aramada** tembel çekilir. İndeks gelene kadar görünür metinle
  (madde+başlık) süzülür; indeks adet/şema sözleşmesine uymazsa güvenli
  geri düşüş devrede kalır (yanlış eşleşme üretilmez).
- `public/s/mevzuat-filtre.js` yeniden yazıldı; `sKlasoruKucult` çıktısı
  minify (%34).
- **Ölçüm:** 686.930 → **231.214 bayt** (**%66,3 azalma**); indeks yalnız
  arama yapan ziyaretçide iner (Cloudflare sıkıştırması + 1 saat cache).
- JS'siz davranış değişmedi (tam liste görünür); GEO/curl ilkesi korunur.

**CSP `form-action`:** `_headers` global CSP'ye `https://buttondown.com`
eklendi (bülten formu hesap bağlanınca POST edecek; `BUTTONDOWN_KULLANICI`
boşken form render edilmez, izin atıl durur). `izleme/csp-izinli-kaynaklar.json`
izin listesi ve notu eşlendi; genişletme sınırı DAR (tek tam kaynak).

## 3. YENİ: API ERİŞİM GÜNLÜĞÜ + YÖNETİM PANELİ

**Veri hattı:**
- `functions/_log.js`: `/api/v1/havzalar`, `/api/v1/kuraklik` (200/429/503)
  ve `/mcp` POST (200/4xx/429) isteklerini KV'ye yazar. Alanlar: IP, uç,
  HTTP durum kodu, ISO zaman. TTL **30 gün**. Anahtar ters-zamanlı
  (`h:<9999999999999-ms>-<rand>`) → tarama EN YENİ kayıtları ilk görür.
  Yazım `waitUntil` + hata yutma: günlük arızası API yanıtını ASLA bozmaz.
- **Kapsam sınırı (KVKK minimizasyonu):** form/PII uçları
  (talep/danışma/takip/alarm) BİLİNÇLİ olarak günlüklenmez.
- `functions/api/loglar.js`: Bearer (`SAYAC_ANAHTAR`) ile toplulaştırılmış
  okuma — özet, uç kırılımı, 14 günlük hacim, son 60 dakika, top-20 IP,
  son 80 istek. Tarama sınırı 500; aşılırsa `ozet.kesildi:true` ile AÇIKÇA
  kısmi bildirilir.

**Panel:** `/yonetim/api-loglari/` — gizli (menüde bağlantı yok), `noindex`
(meta + `X-Robots-Tag` + `Cache-Control: no-store`), `_headers` bloğuyla.
Anahtar pakete gömülmez: kullanıcı girer, yalnız `sessionStorage`'da tutulur
ve istekler `Authorization: Bearer` ile gider (çerez yok). Tüm veri
`textContent` ile basılır (XSS yüzeyi yok). Görsel dil: sitenin token'larıyla
enstrüman estetiği — 4 KPI, **60 dakikalık nabız şeridi** (tek ifade öğesi,
hidrograf dili), top IP / uç tabloları, 14 günlük çubuklar, son istekler;
60 sn otomatik yenileme. Boş/eksik veride uydurma çizilmez.

**Test:** `arac/test/loglar-fn.test.mjs` **16/16** (yetki reddi, toplulaştırma,
429 ayrımı, ters-zaman sırası, TTL, fail-open, 405). Mevcut testler:
whatsapp-fn 15/15 · mcp-fn 12/12.

## 4. DOĞRULAMA KANITLARI

| Ölçüm | Sonuç |
|---|---|
| `npm run build` | EXIT 0 · 1109 page(s) · yeni HTML yalnız panel (1108→1109) |
| `/mevzuat/` | 686.930 → **231.214 bayt** · `data-madde` 0 |
| `mevzuat-arama.json` | 450.520 bayt (tembel; cache 1 saat) |
| Panel | `dist/yonetim/api-loglari/index.html` 63.155 bayt · robots noindex · sitemap/llms DIŞINDA (ölçüldü) |
| Kontrast | Derlenen CSS'ten: min **7,34:1** (≥7 hedefi) |
| `_headers` | `form-action 'self' https://buttondown.com` + `/yonetim/*` noindex/no-store |
| Testler | loglar 16/16 · whatsapp 15/15 · mcp 12/12 |
| Yerel `site-saglik --hizli` | kırmızı 0 · sarı 1 (yerelde Function rotası yok — beklenen) · G1-G6 sapma 0 · mobil taşma 0 |
| Panel betiği | Satır içi JS `node --check` OK (middleware hash'leyecek) |

## 5. DUR / OPERATÖR

1. **DUR-1 (hukuk):** `/gizlilik/` aydınlatma metnine "API erişim günlüğü
   (IP, uç, durum kodu; 30 gün)" satırı eklenmesi — [SERDAR-HUKUK] kalemi.
   Panel bunu kendi metninde açıkça yazar; hukuki metin bu işte değişmedi.
2. **DUR-2 (panel):** Cloudflare `SAYAC_ANAHTAR` secret eşleşmesi.
   **Canlı ölçüm (04.10.2026, dağıtım sonrası):** anahtarsız
   `GET /api/loglar` → **401 yetkisiz**; kod sırası gereği bu, `WA_SAYAC`
   bağlamasının ve `SAYAC_ANAHTAR`'ın üretimde TANIMLI olduğunu kanıtlar →
   **günlük yazımı AKTİF**. Panel için paneldeki secret değeri girilmeli;
   `.env`'deki `WA_SAYAC_ANAHTAR` bu değerle eşleşmiyor (bilinen kalem).
   Anahtar girilene kadar panel "Okunamadı: yetkisiz" gösterir (uydurma yok).
3. **DUR-3:** Panelin canlı görsel onayı (İş kapanış kuralı).

## 6. BİLİNEN SINIRLAR

- Kayıt başına 1 KV yazımı → ücretsiz katman günlük yazma kotası aşılırsa
  günlük seyrekleşir (yanıt etkilenmez); bu durum panelde kısmi sayımla
  görünür.
- Tarama 500 kayıt; üstü `kesildi` ile işaretlenir.
- 429 ayrımı HTTP durum kodundan; rate-limit KV yarışına bağlı kaba ettir
  (önceki karar §52 korunur).

---

*Üreten: 04.10.2026 oturumu. Karar kaydı §53 ve SIRADAKILER güncellemesiyle
birlikte commit edilmiştir.*
