# DAĞITIM DURUM RAPORU (B4.1 + B4.2)

Tarih: 2026-07-28 · Ölçümler canlı siteye ve gerçek tarayıcıya karşı.
**Panele girilmedi, hesap açılmadı.**

---

## 1. ÖZET — tek cümle

Site teknik olarak dağıtıma **tam hazır** (sitemap, robots, llms, şema,
canonical hepsi yerinde ve ölçüldü) ama **dışarıya hiç ulaşmamış**:
aradığımız hiçbir sorguda görünmüyor, ziyaretçi verisi toplanmıyor,
dış bağlantı sayılamıyor.

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

### 4.1b DOĞRULAMA 29.07.2026 — panel açıldı, **BEACON HÂLÂ YOK**

Kullanıcı Web Analytics'i açtığını bildirdi. Gerçek tarayıcıyla canlı
sitede, **üç sayfada** ölçüldü:

| Sayfa | DOM'da beacon | `data-cf-beacon` | cloudflareinsights isteği | CSP ihlali |
|---|---|---|---|---|
| `/` | **YOK** | **YOK** | **0** | 0 |
| `/kuyu-ruhsati/manisa/` | **YOK** | **YOK** | **0** | 0 |
| `/nerede-su-cikar/` | **YOK** | **YOK** | **0** | 0 |

Ham HTML'de de (tarayıcısız, masaüstü UA ile) **0** isabet — apex ve
`www` hostname'lerinin ikisinde de.

**AYIRT EDİCİ BULGU — sorun CSP'de ya da bizim tarafta DEĞİL:**

| Kanıt | Ölçüm | Anlamı |
|---|---|---|
| CSP `script-src` | `… https://static.cloudflareinsights.com` **canlıda** | beacon'a izin var |
| CSP `connect-src` | `'self' https://cloudflareinsights.com` **canlıda** | POST'a izin var |
| Konsol CSP ihlali | **0** | engellenen bir şey YOK — enjekte edilen de yok |
| `static.cloudflareinsights.com/beacon.min.js` | **HTTP 200** | script erişilebilir, ağ sorunu yok |
| **Cloudflare HTML yeniden yazıcısı** | `/cdn-cgi/l/email-protection` **2 isabet** | **Cloudflare bu yanıtlarda HTML'i GERÇEKTEN yeniden yazıyor** (e-posta gizlemesi çalışıyor) — ama RUM beacon'ını eklemiyor |
| `/cdn-cgi/rum` | 404 | — |

Son satır kritik: **rewriter çalışıyor ama beacon enjekte edilmiyor.**
Yani "otomatik enjeksiyon açık ama bir şey engelliyor" değil; **bu hostname
için RUM otomatik kurulumu devrede değil.**

**En olası sebep (doğrulanmadı — panel görünümü gerekir):** Web Analytics
iki ayrı yerde bulunur ve **yalnız biri beacon enjekte eder**:
1. **Workers & Pages → suharitasi → Metrics** — Pages'in *sunucu tarafı*
   istek metrikleri. Beacon YOKTUR, ziyaretçi davranışı ölçmez.
2. **Alan adı (zone) → Analytics & Logs → Web Analytics** → site eklenir
   ve **"Automatic Setup"** seçilir. Beacon'ı enjekte eden **budur.**

Ölçüm, (1) açılmış ama (2) açılmamış olduğuna işaret ediyor.

**Sıradaki adım (sizde):** zone tarafındaki **Web Analytics → Add a site →
suharitasi.com → Automatic Setup**. Alternatif olarak aynı ekrandaki
**manuel snippet** verilirse ben `Sayfa.astro`'ya ekleyebilirim (CSP zaten
hazır) — o yol otomatik enjeksiyona bağımlı değildir.

**Ölçüm tekrarı:** panel değişince tek komutla doğrularım —
`scratchpad/beacon-olc.mjs` üç sayfayı gerçek tarayıcıyla tarar.
**Panelin "aktif" demesi kanıt sayılmaz** (bu, 28.07'deki yanlış kaydın
tam olarak sebebiydi).

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
