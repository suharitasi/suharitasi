# DAĞITIM DURUM RAPORU (B4.1 + B4.2)

Tarih: 2026-07-28 · Ölçümler canlı siteye ve gerçek tarayıcıya karşı.
**Panele girilmedi, hesap açılmadı.**

---

## 1. ÖZET — tek cümle

Site teknik olarak dağıtıma **tam hazır** ve artık **ölçülüyor** (Web
Analytics 29.07'de veri toplamaya başladı: 7 ziyaret, CWV LCP %100 Good;
`www` de 200 dönüyor) — ama **görünürlük hâlâ düşük**: aradığımız
sorgularda çıkmıyor, dış bağlantı sayılamıyor. Yani ölçüm boşluğu
kapandı, **dağıtım boşluğu duruyor**.

Yani sorun **üretimde değil, dağıtımda.** AY İLKESİ'nin (CLAUDE.md)
gerekçesi tam olarak budur.

---

## 2. TEKNİK YÜZEYLER — ölçüldü, hepsi ÇALIŞIYOR

| Yüzey | Ölçüm | Sonuç |
|---|---|---|
| `sitemap.xml` | `<loc>` sayısı | **174** (yerelde 175 — yeni sayfa) |
| `robots.txt` | canlı içerik | Googlebot/Bingbot/Applebot **Allow** · GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended **Allow** · Bytespider ve CCBot **Disallow** (kullanıcı kararı) |
| `llms.txt` | HTTP | **200** |
| Örnek sayfalar | HTTP | `/` 200 · `/nerede-su-cikar/` 200 · `/rehberler/kuyu-ruhsati/` 200 |
| JSON-LD | ana sayfa `@graph` | **3 nesne** geçerli (Organization + Person + WebSite) |
| Güvenlik başlıkları | md19 | 6 başlık + CSP yerinde |
| **`www.` alt alan adı** | 3 ölçüm (29.07 11:00) | **200 — DÜZELDİ** · Pages custom domain olarak eklendi · canonical apex'i gösteriyor |

**Sonuç:** arama motorunun ve AI botunun siteyi okumasını engelleyen
teknik bir şey **yok** (www dışında).

---

## 3. GÖRÜNÜRLÜK — ÖLÇÜLDÜ, SONUÇ SIFIR

| Sorgu | Sonuç |
|---|---|
| `suharitasi.com su hukuku yeraltı suyu kuyu ruhsatı` | İlk sayfada **7 sonuç: hepsi sondaj/ruhsat firması** (tarimimar, adzemin, besaltisondaj, simseksondaj, kuyuruhsati.net, kuzeydogusondaj, efesondaj). **suharitasi.com YOK.** |
| `"suharitasi.com"` (tam alan adı) | **Hiçbir sonuç alan adıyla eşleşmedi.** |

**DÜRÜSTLÜK ŞERHİ:** bu ölçüm **tek bir arama indeksi** üzerinden ve
**ABD bölgesinden** yapıldı. Google Türkiye sonuçları farklı olabilir;
**Google indeks durumu DOĞRULANMADI** (Search Console erişimi gerekir,
bu revizyonun kapsamı dışında).

Yine de sinyal güçlü: kendi alan adıyla tam eşleşme aramasının bile
sonuç vermemesi, sitenin bu indekste **hiç bulunmadığını** gösterir.

### 3.1 Google Search Console — kurulu DEĞİL (ölçüldü)
Canlı HTML'de `google-site-verification` etiketi **yok**. Doğrulama
başka yöntemle (DNS TXT / dosya) yapılmış olabilir — **doğrulanmadı**.
GSC olmadan şunlar bilinemez: kaç sayfa indekslendi, hangi sorguda kaç
gösterim, hangi sayfa taranamadı.

### 3.2 Dış bağlantı (backlink) — SAYILAMADI
Backlink sayımı ücretli araç (Ahrefs/Semrush/Moz) ya da GSC gerektirir.
**Ölçülemedi → "doğrulanmadı".** Dolaylı işaret: alan adı tam eşleşme
aramasında hiçbir sayfada geçmemesi, dış bağlantının **çok az ya da
hiç olmadığını** düşündürür ama kanıtlamaz.

---

## 4. B4.2 — ANALYTICS TEŞHİSİ: **KURULU DEĞİL** (kayıt yanlış)

`SIRADAKILER.md` şöyle diyor: *"CF Web Analytics KURULU; veri
görünürlüğü ayrı iş."* **Bu kayıt ölçümle YANLIŞLANDI.**

Gerçek tarayıcıyla, canlı ana sayfada (28.07.2026):

| Ölçüm | Sonuç |
|---|---|
| Toplam ağ isteği | **22** |
| Analitikle ilgili istek (`cloudflareinsights`, `beacon`, `gtag`, `plausible`, `umami`, `matomo`) | **0** |
| DOM'da beacon izi | **YOK** |
| CSP ihlal mesajı | **0** |
| Sayfanın istek yaptığı dış konaklar | yalnız `suharitasi.com`, `fonts.googleapis.com`, `fonts.gstatic.com` |

Kaynak tarafında da doğrulandı: `src/`, `public/`, `astro.config.mjs`
içinde analitik izi **0 isabet**.

**Yorum:** CSP ihlali OLMAMASI kritik. Eğer beacon enjekte edilip
engellenseydi tarayıcı konsola ihlal yazardı. Yazmadı — demek ki
**beacon hiç enjekte edilmiyor.** Panel ayarı ne olursa olsun, bugün
**hiçbir ziyaretçi verisi toplanmıyor.**

### 4.1 İKİNCİ, GİZLİ ENGEL — CSP (DÜZELTİLDİ)

Panel açılsaydı bile beacon **sessizce engellenecekti**: eski CSP
`script-src 'self' 'unsafe-inline'` ve `connect-src 'self'` idi;
Cloudflare Web Analytics `static.cloudflareinsights.com`'dan script
yükler ve `cloudflareinsights.com`'a POST atar. İkisi de yasaktı.

**UYGULANDI** (`public/_headers`, gerekçe dosyada yorum olarak):
```
script-src  … https://static.cloudflareinsights.com
connect-src 'self' https://cloudflareinsights.com
```
`izleme/csp-izinli-kaynaklar.json` da güncellendi (otomatik CSP
onarımının beyaz listesi bu iki konağı artık tanıyor).

**İzin ATIL:** panel açılmadığı sürece hiçbir istek yapılmaz. Genişleme
dar tutuldu — iki konak, iki direktif.

### 4.1b ANALYTICS **ÇALIŞIYOR** — 29.07.2026 (önceki sonuç DÜZELTİLDİ)

**SONUÇ: Cloudflare Web Analytics veri topluyor.** Zone panelinde
**7 ziyaret · 7 sayfa görüntüleme**, Core Web Vitals ölçülüyor
(**LCP %100 "Good"**, sayfa yükleme **1.314 ms**), listede hem apex hem
`www` URL'leri var.

**Bu kanıt neden belirleyici:** Core Web Vitals (LCP, yükleme süresi)
**yalnız ziyaretçinin tarayıcısında çalışan bir beacon'dan** üretilebilir.
Sunucu tarafı istek metrikleri bu değerleri üretemez. Panelde CWV varsa
beacon gerçek ziyaretçilerde çalışıyordur.

#### ÖNCEKİ SONUÇ YANLIŞTI — ve nedeni kayda geçiyor

Bu rapor daha önce "beacon yok → zone Automatic Setup kapalı" demişti.
**Bu sonuç yanlıştı.** Ölçümün kendisi doğruydu, **çıkarım** yanlıştı.

Bugün bu sunucudan yapılan ölçüm (tekrarlandı, hepsi **0 beacon**):

| Deneme | Sonuç |
|---|---|
| 3 sayfa × gerçek tarayıcı (headless) | beacon 0 · istek 0 · CSP ihlali 0 |
| Ham HTML, tam tarayıcı başlık seti (`sec-ch-ua`, `sec-fetch-*`, `accept-language`) | 0 |
| Otomasyon bayrakları gizli (`navigator.webdriver=undefined`) | 0 |
| **Headless KAPALI** (gerçek pencere, Xvfb) | 0 |
| **20 ardışık istek** (önbellek kırıcı sorguyla) | **0/20** |
| 4 ek yol (`/hakkinda/`, `/rehberler/`, `/arsiv/`, `/harita/`) | 0 |
| `www` hostname | 0 |

Yani beacon **bu bakış açısına** hiç gelmiyor — ama gerçek ziyaretçilere
geliyor (panel verisi).

**Neden fark ettiği doğrulanmadı.** Gözlenen: bu sunucunun istekleri
Cloudflare'in **ARN (Stockholm)** PoP'una düşüyor (`cf-ray: …-ARN`, 3/3
ölçüm). Gerçek ziyaretçiler büyük olasılıkla İstanbul PoP'una düşüyor.
Enjeksiyonun PoP/bölge ya da istemci sınıflandırmasına göre değiştiği
**muhtemeldir ama kanıtlanmadı** — panel görünümü olmadan ayırt edilemez.

**Cloudflare bu yanıtlarda HTML'i yeniden yazıyor** (ölçüldü): canlı HTML
`</body>` öncesinde `/cdn-cgi/scripts/.../email-decode.min.js` taşıyor ve
yerel `dist`'ten **+490 bayt** büyük. Yani rewriter çalışıyor; RUM beacon'ı
bu bakış açısına eklenmiyor.

#### ÖLÇÜM DERSİ (kural haline geldi)

28.07'de kural şuydu: *"panelin 'aktif' demesi kanıt sayılmaz."* Bugün
bunun **karşılığı** öğrenildi:

> **Negatif ölçüm de tek başına kanıt değildir** — ölçülen şey bir CDN'in
> istek başına/bakış açısına göre değişen davranışıysa. "Benim gördüğüm
> HTML'de yok" ile "çalışmıyor" AYNI ŞEY DEĞİLDİR.
>
> RUM için belirleyici kanıt **toplanan veridir** (özellikle Core Web
> Vitals — sunucu tarafında üretilemez), tek bir vantaj noktasının HTML
> çıktısı değil.

Bu iki kural birlikte kullanılır: panel beyanı tek başına yetmez, tek
noktadan negatif ölçüm de yetmez; **veri akıyorsa çalışıyordur.**

#### Kalan iş (küçük)

- CSP izni (`static.cloudflareinsights.com` + `cloudflareinsights.com`)
  canlıda ve **doğru** — beacon engellenmiyor (CSP ihlali 0). Değişiklik
  gerekmiyor.
- **Süreklilik kalemi ERTELENDİ:** "beacon canlıda var mı" sağlık kalemi
  eklenemez — bu sunucudan yapılan ölçüm sistematik olarak 0 döndürüyor ve
  kalem sürekli yanlış alarm verirdi. Doğru kalem panel/API tarafında
  ("son 24 saatte olay sayısı > 0") olurdu; Web Analytics API erişimi
  gerektirir. Kullanıcı kararı.

### 4.2 Panel adımları (SİZİN YAPMANIZ)
1. Cloudflare panel → **Workers & Pages → suharitasi → Metrics /
   Web Analytics** (ya da alan adı → **Analytics & Logs → Web Analytics**).
2. **Enable / Add site** → *Automatic setup* seçin (beacon'ı Cloudflare
   enjekte eder; kod değişikliği gerekmez).
3. 15 dakika sonra bana haber verin — **ölçümle doğrularım**: gerçek
   tarayıcıyla canlı sayfada `cloudflareinsights` isteği görünüyor mu.
   **Panelin "aktif" demesi kanıt SAYILMAZ** (bugünkü yanlış kaydın
   sebebi tam olarak buydu).
4. Doğrulandıktan sonra süreklilik: "analitik beacon canlıda var mı"
   sağlık kalemi olarak eklenir — bir daha sessizce kaybolmasın.

---

## 5. SIRADAKİ ADIMLAR — etki sırasına göre (kullanıcı kararı)

| # | Adım | Maliyet | Neden bu sırada |
|---|---|---|---|
| **1** | **Google Search Console'a siteyi ekle + sitemap gönder** | ücretsiz, ~15 dk | İndeks durumu ölçülmeden hiçbir SEO kararı verilemez. Tek en yüksek getirili adım. |
| **2** | **Web Analytics panelini aç** (§4.2) | ücretsiz, ~5 dk | CSP hazır. Ziyaretçi verisi olmadan satış katmanı (B4.6) ölçülemez. |
| 3 | `www.` 522'yi düzelt | ücretsiz, ~5 dk | `rapor/www-522.md` §4 — yönlendirme kuralı |
| 4 | Bing Webmaster Tools | ücretsiz | GSC'den sitemap içe aktarılabilir |
| 5 | Veri gazetecisi teması | ücretsiz | `rapor/temas-listesi.md` §3 — en yüksek getirili dış bağlantı kanalı |
| 6 | LinkedIn şirket sayfası → `sameAs` | ücretsiz | Altyapı hazır (B4.3): `src/data/site.ts` `KURUM_SOSYAL` |
| 7 | Dizin/kayıt siteleri | ücretsiz | Wikidata kaydı, meslek örgütü bağlantı sayfaları |

---

## 6. B4.3 — SOSYAL / ATIF ALTYAPISI (uygulandı)

`src/data/site.ts` içine **tek kaynak** eklendi:

```ts
export const KURUM_SOSYAL: string[] = [];   // Organization.sameAs
export const YAZAR_SOSYAL: string[] = [];   // Person.sameAs
```

`src/layouts/Sayfa.astro` bu dizileri okur ve **yalnız DOLU olduklarında**
`sameAs` alanını şemaya yazar. Ölçüldü: canlı çıktıda `sameAs` **0 kez**
geçiyor, JSON-LD hâlâ geçerli (3 nesne).

**Neden boş dizi yazılmıyor:** `"sameAs": []` yayımlamak arama motoruna
"hiçbir yerde yokum" demektir — alanı hiç yazmamaktan kötüdür.

**Profil açılınca:** yalnız bu iki diziye satır eklenir; şema, künye ve
altbilgi otomatik beslenir. Başka dosyaya dokunulmaz.

**Aday sırası (profil AÇILMADI):**
1. LinkedIn şirket sayfası — B2B muhatabın baktığı ilk yer
2. Google Business Profile — yerel arama + bilgi paneli
3. X (Twitter) — gazeteci teması için
4. YouTube — yalnız video üretilirse
5. Wikidata kaydı — AI yanıt motorlarının varlık bağlaması için en
   yüksek getirili, en az bakım isteyen kayıt

---

## 7. KULLANICI KARARI BEKLEYENLER

1. **GSC kurulsun mu** (§5.1) — ücretsiz, indeks körlüğünü kapatır.
2. **Web Analytics paneli açılsın mı** (§4.2) — ücretsiz, CSP hazır.
3. **www 522 hangi seçenekle düzeltilsin** — `rapor/www-522.md` §4 (A önerildi).
4. **Hangi sosyal profiller açılsın** (§6) — altyapı hazır, hesap yok.
5. **Veri gazetecisi teması yapılsın mı** — `rapor/temas-listesi.md` §3.
