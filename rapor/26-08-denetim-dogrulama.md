# DENETİM — BULGU DOĞRULAMALARI (Faz 1.5 hazırlığı, 27.08.2026)

EK-A'daki (rapor/26-08-denetim-DURUM.md) bulguların sınıflandırılabilmesi
için yapılan ölçümler. Kural: **beyan kanıt sayılmaz** — her sınıf önerisi
burada ölçümle sınandı. Bu turda hiçbir dosya değiştirilmedi.

---

## D1 — SİLME ADAYLARININ REFERANSSIZLIĞI: KESİN KANITLANDI

Tarama yüzeyi: `dist/` içindeki **her metin dosyası** (html, js, css, xml,
txt, json, webmanifest — `grep -r --binary-files=without-match`), `src/`,
`public/s/`, `public/_headers`, `public/_redirects`, `public/robots.txt`,
`astro.config.mjs`.

| Varlık | dist referans | src+config referans | Boyut |
|---|---|---|---|
| `sahne1..6.webm` (6 dosya) | **0** | **0** | 9,0 MB |
| `hedef-hero.webp` | **0** | **0** | 992 KB |
| `hedef/hedef-1472.{avif,jpg,webp}` | **0** | 1 (`HedefSahne.astro`) | 444 KB |
| `hedef/hedef-2944.{avif,jpg,webp}` | **0** | 1 (`HedefSahne.astro`) | 1,3 MB |
| `public/s/su-sim.js` | **0** | **0** | 9,3 KB |

**Falsifikasyon — dinamik uzantı üretimi var mı?** (En olası yanlış-negatif:
JS `.mp4` → `.webm` değiştiriyor olabilir.)
- `grep -rn "webm" src public astro.config.mjs` → **HİÇ YOK**.
- `grep -rln "webm" dist --include=*.html --include=*.js --include=*.css
  --include=*.xml --include=*.txt --include=*.json` → **HİÇ YOK**.
- `<source>` etiketi yalnız `HedefSahne.astro:11,16`'da (erişilemez bileşen).
- Ana sayfanın gerçek video kaynakları ölçüldü: `sahne1.mp4` (src) +
  `sahne2..6.mp4` (data-src) + `sahne1..6.jpg` (poster). **webm yok.**
- `webm` geçen tek yer `arac/` altındaki ÖLÇÜM araçları
  (`duzeltme-teshis.mjs:39-40,52`, `site-saglik.mjs:373`,
  `gerileme-denetim.mjs:68`, `dist-sun.mjs:50`) — bunlar gözlenen isteği
  SÜZER, istek ÜRETMEZ. Dosya silinse bu süzgeçler boş küme görür, kırılmaz.

**Geri alınabilirlik ölçüldü:** dördü de `git ls-files` ile **İZLİ** →
silme `git checkout <commit> -- <yol>` ile geri alınabilir; bu yüzden
"geri alınamaz adım" istisnasına GİRMEZ.

**Bağımlılık şerhi:** `public/hedef/*`'ı yalnız `HedefSahne.astro`
kullanıyor, onu da yalnız `arsiv/harita-stil/index.astro:7,161`.
`arsiv/` build dışında (`src/pages/arsiv` yok, astro.config'te atıf yok) —
yani silme yayını etkilemez, ama arşiv sayfası ileride geri getirilirse
görselleri git geçmişinden çağırmak gerekir.

**SONUÇ:** brief'in koşulu ("referanssızlık KESİN kanıtlanırsa UYGULAMA")
**sağlandı**.

---

## D2 — "CanliSayi palet dışına düşüyor" İDDİASI: **ÇÜRÜTÜLDÜ**

EK-A.2'deki D2 bulgusu, `CanliSayi.astro:62-66,80,92`'deki
`var(--v2-kart,#fff)` / `var(--v2-primary,#2b6a86)` / `var(--sh-eo, ease)`
fallback'lerinin `/nerede-su-cikar/` sayfasında **fiilen render edildiğini**
öne sürüyordu (gerekçe: `--v2-*` yalnız `anasayfa-v2.css`'te tanımlı, onu da
yalnız `index.astro` import ediyor).

**Ölçüm bunu yanlışladı.** Vite, `anasayfa-v2.css`'i paylaşılan
`pages.dLcRBfmy.css` chunk'ına koyuyor ve `/nerede-su-cikar/` bu dosyayı
yüklüyor:
```
dist/nerede-su-cikar/index.html: <link rel="stylesheet" href="/_astro/pages.dLcRBfmy.css"
```
Chunk içindeki tanım bloğunun seçicisi ölçüldü: **`:root`** —
```
:root{…--v2-kart:oklch(100% 0 0);--v2-primary:oklch(50% .09 215);
--v2-muted-fg:#3c5266;--v2-border:oklch(90% .015 220);
--sh-eo:cubic-bezier(.23, 1, .32, 1);…}
```
Yani tokenlar o sayfada **çözülüyor**, fallback'ler devreye girmiyor;
kanıt bandı ana sayfayla AYNI renkleri kullanıyor.

**SINIF: REDDEDİLDİ** (kusur değil — yanlış hipotez, ölçümle elendi).
Yan bilgi olarak kayda değer: v2 tokenları paylaşılan chunk üzerinden
tüm `pages` grubuna sızıyor (27.07 GUNLUK'taki "chunk sızıntısı" deseninin
aynısı) — bu sefer zararsız, hatta bulguyu çürüten şey.

---

## D3 — TOKEN ERİŞİLEBİLİRLİĞİ: literal→token adaylarının sayfa-başına sınaması

Yöntem: her hedef sayfanın yüklediği TÜM `_astro/*.css` dosyaları + sayfa
içi `<style>` blokları birleştirilip token tanımı (`--ad:`) arandı.
Token tanımlı DEĞİLSE `var(--ad)` yazmak fallback'siz geçersiz değer üretir
ve **görünür çıktıyı bozar** — yani o kalem UYGULAMA olamaz.

| Sayfa | Token durumu |
|---|---|
| `/ilce-sorgu/` | `--kehribar-metin` VAR · `--su-700` VAR · `--kopuk` VAR · `--krem` VAR · `--cizgi` VAR |
| `/havza-riski/` | `--kehribar-metin` VAR · `--cizgi` VAR |
| `/durumum/` | `--kopuk` VAR · `--krem` VAR |
| `/hangi-kurum/` | `--kopuk` VAR |
| `/havzalar/sakarya/` | `--kopuk` VAR · `--krem` VAR · `--murekkep-900` VAR |
| `/rehberler/kuyu-tasima/` | `--krem` VAR · `--kopuk` VAR |
| **`/harita/`** | **`--krem` YOK · `--murekkep-900` YOK** · `--kopuk` VAR |
| `/nerede-su-cikar/` | `--v2-primary` VAR · `--sh-eo` VAR (bkz. D2) |

**Sonuçlar:**
- `--kehribar-600` fantom tokenı → `--kehribar-metin` ile değiştirmek
  **güvenli**: fallback `#875518`, tokenın değeri de `#875518`
  (`Sayfa.astro:211`) — **aynı**, ve token her iki sayfada da tanımlı.
  **UYGULAMA.**
- `#DBEAF4` → `--kopuk` ve `#E9F0F4` → `--krem` geçişleri
  `HavzaPaneli`, `durumum/index`, `hangi-kurum/index`, `kuyu-tasima`,
  `durumum/[persona]` bağlamlarında **güvenli** (token tanımlı + değer
  birebir aynı). **UYGULAMA.**
- **`harita.astro:239,255`'teki `#E9F0F4` ve `#132A3F` token'a
  ÇEKİLEMEZ** — o sayfada `--krem`/`--murekkep-900` tanımlı değil;
  `var()` fallback'siz yazılırsa renk kaybolur. EK-A.2'nin bu alt kalemi
  **REDDEDİLDİ** (öneri hatalıydı; sayfa kendi `:root`'unu taşıyor).

---

## D4 — ÖLÜ B2B PALET BLOĞU: kullanılmıyor ama CSS'e BASILIYOR

`src/layouts/Sayfa.astro:217-241` — 04.08.2026 tarihli "B2B MODERN PALET"
bloğu: 16 renk + 3 gradyan + 2 gölge + 2 radius tokenı.

**Kullanım ölçümü:** `grep -rn "var(--b2b-\|--b2b-" src public arac arsiv
astro.config.mjs`, tanım satırları hariç → **HİÇ KULLANIM YOK** (repo
genelinde, arşiv ve araçlar dahil).

**Ama:** blok yayına çıkıyor — `dist/_astro/SayfaBasi.O9QLLH85.css`
içinde `b2b` geçiyor. Yani silinirse **üretilen CSS bit-eşit KALMAZ**
(dosya küçülür).

**Bağlam (yeniden açılan karar değil, kimlik tespiti):** bu palet
04.08 "satış/B2B dalgası"nın kalıntısı; o dalga KARARLAR §25 ile
kaldırıldı (satış sayfaları + PayTR kalıntıları 31 × 301 ile).
Palet bloğu o temizlikte gözden kaçmış.

**SINIF: KARAR.** Gerekçe: brief'in UYGULAMA koşulu iki şart koyuyordu —
(i) seçici gerçekten kullanılmıyor, (ii) üretilen CSS bit-eşit kalıyor.
(i) sağlandı, **(ii) sağlanmadı**. "Şüphede KARAR" kuralı gereği
uygulanmadı; karar dosyasına tavsiyesiyle yazıldı.
(Teknik not: CSS özel değişkenleri hiçbir kural tarafından
referans edilmediğinden render'ın değişmesi mümkün değildir; brief'in
bit-eşitlik ölçütü bu vaka için fazla dar kalıyor. Karar kullanıcınındır.)

---

## D5 — SEO BULGULARININ AYIKLANMASI: 49 bulgunun kaçı YENİ?

`node arac/site-tarama.mjs dist` 49 bulgu üretti. Her biri bilinen taban ve
kapanmış kararlarla karşılaştırıldı:

| Bulgu | Sayı | Durum |
|---|---|---|
| `title-uzun` | 16 | **md16 tabanında KABUL EDİLMİŞ** (11 içerik başlığı [SERDAR-HUKUK] kararında + 5 uzun sektör adı). Yeni değil. |
| `oz-cevap-uzun` | 12 | 10 rehber + `/vaka/meysu/` = **11 indeksli sayfa = SIRADAKILER:330'daki "11 uzun öz-cevap" kalemi** ([SERDAR-HUKUK]). 12.'si `/stil-pilot/` (noindex). Yeni değil. |
| `soru-baslik-yok` | 4 | md16 tabanında. Yeni değil. |
| `h1-yok` | 1 | `/harita/` — KARARLAR §9 kapanmış karar. |
| `canonical-yok` | 2 | `/404/` + `/stil-pilot/` — **ikisi de `noindex`** (ölçüldü: 404 `noindex`, stil-pilot `noindex, nofollow`). Noindex sayfada canonical gerekmez. **REDDEDİLDİ.** |
| `meta-desc-yok` · `icerik-dom-disi` | 1+1 | `/404/` — noindex hata sayfası; 128 karakterlik gövde kasıtlı sadelik. **REDDEDİLDİ.** |
| `og-eksik` · `json-ld-yok` | 3+3 | `/stil-pilot/`, `/harita-pilot/` (noindex pilotlar). **REDDEDİLDİ.** |
| `sitemap-disi` | 3 | `/harita-pilot/`, `/stil-pilot/`, `/kullanilanlar/` — üçü de noindex, sitemap dışı olmaları **doğru davranış**. **REDDEDİLDİ.** |

**Sonuç: site-tarama'nın 49 bulgusundan YENİ ve gerçek kusur olan SIFIR.**
Hepsi ya kabul edilmiş taban, ya kapanmış karar, ya da noindex sayfa
kaynaklı yanlış-pozitif.

**Bağımsız doğrulamalar (aracın dışında):** canonical 522/522 doğru ·
sitemap ↔ dist farkı yalnız 3 noindex sayfa · URL yapısında büyük harf /
alt çizgi / boşluk **0** · **dist'te title tekrarı 0** · yetim sayfa yalnız
o 3 noindex sayfa · yamyamlık GSC'de yalnız bilinen Ergene ailesi (izleme
kalemi §30/4).

**Tek GERÇEK yeni SEO/içerik bulgusu:** 6 sayfa latin-dışı alfabeyle
başlıklanmış (OSM ad alanından): `/goller/gol-1/` "گل ناور" ·
`/nehirler/nehir-1/` "Велека" · `/nehirler/nehir-2/` "نهر عفرين" ·
`/nehirler/mutludere/` "Резовска река - Mutludere" · `/nehirler/meric/`
"Έβρος/Meriç/Марица" · `/nehirler/aras-2/` "Aras / Արաքս".
Kaynak: `src/data/tr-goller.json` (279 kayıtta 29 latin-dışı ad),
`src/data/tr-nehirler.json` (131'de 41). Türkçe sitede yabancı alfabeyle
başlık hem kullanıcı hem arama motoru için anlamsız. **SINIF: KARAR**
(görünür içerik + veri kararı; ad değiştirmek/gizlemek içerik anlamını
değiştirir, ayrıca 24.08'de sınır-ötesi öznitelik temizliği yapılmışken
adların bilinçli bırakılmış olması ihtimali var).

---

## D6 — ÜÇ İKLİM/UYDU KATMANI: sitede YAYINLANMIYOR

`data/canli/chirps.json`, `jrc-yuzey-suyu.json`, `era5-toprak.json`
künyeleri okundu (birebir):
- CHIRPS: `{"kaynak":"CHIRPS v2.0 (UCSB/CHG)","cozunurluk":"0.05°","lisans":"CC BY 4.0",…}`
- JRC: `{"kaynak":"JRC Global Surface Water 1984-2021 (Landsat)","lisans":"Free and open (CC BY 4.0)",…}`
- ERA5: `{"kaynak":"ERA5-Land (ECMWF/Copernicus)","lisans":"Copernicus License (ucretsiz, kayitli)",…}`

**KAYNAKLAR.md'de üçünün de kaydı YOK** (grep: CHIRPS/JRC/ERA5/chirps/jrc/era5 → hepsi 0).

**Yayın durumu ölçüldü:** üçü de `src/` içinde hiçbir yerden import
EDİLMİYOR; `dist/`'te "CHIRPS" 0 sayfa, "Global Surface Water" 0 sayfa.
"ERA5" 12 sayfada geçiyor ama **bizim verimiz değil** — OpenAlex'ten gelen
akademik yayın BAŞLIKLARINDA ("Doğu Anadolu'da Hidroklimatolojik
Değişkenlerin ERA5-Land ile … Analizi").

**Depo görünürlüğü:** `curl -sI https://github.com/suharitasi/suharitasi`
→ **404** = depo herkese açık değil.

**SONUÇ:** veri sitede yayınlanmadığı ve depo kapalı olduğu için CC BY
atıf yükümlülüğü BUGÜN doğmuş değil. Ancak KAYNAKLAR.md projenin tek
köken kaydıdır ve üç katman orada hiç görünmüyor.
**SINIF: UYGULAMA** — KAYNAKLAR.md'ye künye eklemek görünür çıktıyı
(dist) hiç değiştirmez, veri zaten depoda ve künyeleri kendi dosyalarında
yazılı (uydurma yok, birebir aktarım). Sayfada görünür atıf GEREKMİYOR
(yayınlanmıyorlar) — o yüzden KARAR sınıfına girmiyor.
ŞERH kayda geçirildi: bu katmanlar ileride bir sayfada yayınlanırsa
CC BY 4.0 görünür atıf ZORUNLU olur.

---

## D7 — DİĞER DOĞRULAMALAR

| Bulgu | Ölçüm | Sonuç |
|---|---|---|
| Ana sayfada `<main>` yok | `grep -c "<main" dist/index.html` → **0**; `dist/havzalar/sakarya/index.html` → 1; `src/pages/index.astro`'da `<main>` yok | Doğrulandı. Risk taraması: `body` flex/grid DEĞİL (yalnız background/color/font, `index.astro:133-139`), anasayfa CSS'inde kardeş seçici (`+`/`~`) **yok** → sarmalama düzen-nötr görünüyor, kanıt Faz 2'de pixel + görünür-metin kıyasıyla |
| `kullanilanlar.astro:57` "Astro 5" | kurulu sürüm **7.2.7** | Doğrulandı. Görünür içerik → **KARAR** |
| `esbuild` hayalet bağımlılık | `astro.config.mjs:186` `await import('esbuild')`; package.json deps = astro/maplibre-gl/three, devDeps = lighthouse/pixelmatch/playwright-core/pngjs → **esbuild YOK** | Doğrulandı. **UYGULAMA** (yalnız package.json; dist değişmez) |
| KAYNAKLAR:41 `harita/isaretler.js` | dosya YOK; gerçek yer `src/harita-3d/isaretler.js` | Doğrulandı. **UYGULAMA** (yol düzeltme) |
| KAYNAKLAR:285 EPİAŞ "İlk kayıt: henüz yok" | `baraj.json` künyesi `"kayitBaslangici": "2026-07-16"`, `"sonDurum":"ok"`; `data/arsiv/baraj` altında **925 json** | Doğrulandı — kayıt bayat. **UYGULAMA** (ölçülen değerle güncelleme) |
| 158 `http://hdl.handle.net` bağlantısı | https karşılıkları sınandı: 3/3 **HTTP 200** · JSON-LD'de **geçmiyor** (0) · görünür bağlantı metni "yayın" (URL değil) · kaynak `veri/potansiyel/akademik-kunye.json` + `zenginlestirme.json` | https'e çevirmek görünür metni ve JSON-LD'yi değiştirmez. **UYGULAMA** (düşük etki) |
| `acikerisim.pau.edu.tr:8080` 9 bağlantı | http + standart-dışı port | Sunucu https/8080 desteklemeyebilir — Faz 2'de sınanacak, geçmezse dokunulmaz |

---

## D8 — "ANALİTİK YÜKLÜ DEĞİL" İDDİASI: KANIT SAYILMADI (bilinen tuzak)

EK-A.10, Cloudflare Web Analytics beacon'ının ne dist'te ne canlıda
bulunduğunu, dolayısıyla analitiğin fiilen çalışmadığını söylüyordu.

**Ölçüm tekrarlandı ve aynı negatif sonucu verdi:**
- `curl -s https://suharitasi.com/ | grep cloudflareinsights|data-cf-beacon` → **eşleşme yok**
- `grep -rl "cloudflareinsights|data-cf-beacon" dist --include=*.html` → **yok**
- `public/_headers` CSP'de `cloudflareinsights.com` izni **var** (atıl duruyor)

**AMA BU KANIT DEĞİLDİR.** SIRADAKILER'deki 29.07 kaydı bu tam ölçümü
zaten yapmış ve dersini yazmış: panelde 7 ziyaret + 7 sayfa görüntüleme +
Core Web Vitals görünüyordu (LCP %100 Good, 1.314 ms) — ve CWV yalnız
tarayıcıdaki beacon'dan üretilebilir, yani beacon gerçek ziyaretçilerde
çalışıyordu. Aynı kayıt şunu ekliyor: *"bu sunucudan yapılan HTML ölçümü
beacon'ı GÖRMÜYOR (0/20 istek, 3 tarayıcı kimliği, apex+www) — sebebi
doğrulanmadı, muhtemelen PoP farkı"* ve dersi: **"tek vantaj noktasından
negatif ölçüm, CDN'in istek başına değişen davranışında kanıt DEĞİLDİR."**

**SINIF: REDDEDİLDİ** — yeni bulgu değil, bilinen ve kayıtlı gözlemin
tekrarı. Bu sunucudan "analitik yok" demek, projenin kendi yazdığı ölçüm
hatasını tekrarlamak olurdu. Analitiğin fiilî durumu ancak Cloudflare
panelinden ya da Web Analytics API'sinden doğrulanabilir (API erişimi
zaten açık kullanıcı kalemi).

**Yan sonuç:** 1.10'daki "çerez/analitik bildirimi gerekiyor mu" sorusu
bu belirsizlik yüzünden bu denetimde KAPATILAMADI — karar dosyasına
belirsizlik şerhiyle taşındı.

---

## D9 — DİĞER YAPISAL DOĞRULAMALAR

| Kalem | Ölçüm | Sınıf |
|---|---|---|
| `server/` 67 MB yetim dizin | İçinde yalnız `node_modules` (192 paket, express+bare-* ailesi); **git izli dosya 0**; `.gitignore:54` `server/node_modules/`. Yani silme **git'ten geri alınamaz** — webm'lerin aksine. | **KARAR** (geri alınamaz silme) |
| `goller`/`nehirler` 66 satırlık `.kunye` CSS kopyası | Normalize kıyas: **65/66 satır birebir aynı** (`goller/[slug].astro:108` ↔ `nehirler/[slug].astro:102`) | **KARAR** — tekilleştirme Astro scoped `<style>`'ı paylaşılan/global CSS'e taşımayı gerektirir; kapsam 342 yayınlanmış sayfa, kazanç yalnız bakım kolaylığı. Riski kullanıcı tartsın. |
| `src/data/anasayfa-sorular.js` bayat | Canlı ana sayfa `SORULAR_V2` (6 soru) kullanıyor; bu dosya `SORULAR` (7 soru) taşıyor ve metinler FARKLI (ör. eski "Su nerelerde çıkar?" ↔ yeni "Türkiye'de su nerelerde çıkabilir?"). Tek tüketici `arac/anasayfa-asama2-denetim.mjs:15`; **cron'da yok, sağlık çağırmıyor** — uykuda tarihsel araç. | **KARAR** (düşük öncelik; iki dosyanın akıbeti birlikte kararlaştırılmalı) |

---

## D10 — LATİN-DIŞI BAŞLIKLAR: kök neden ve kapsam ölçüldü

D5'te bulunan 6 sayfanın kökü tek: OSM `ad` alanı latin-dışı alfabede
olduğunda slug üretimi boş kalıyor ve **sıra numarasına düşüyor**.

| Sayfa | Başlık | Sitemap |
|---|---|---|
| `/goller/gol-1/` | گل ناور — Türkiye Gölleri | **içinde** |
| `/nehirler/nehir-1/` | Велека — Türkiye Nehirleri | **içinde** |
| `/nehirler/nehir-2/` | نهر عفرين — Türkiye Nehirleri | **içinde** |
| `/nehirler/mutludere/` | Резовска река - Mutludere | içinde |
| `/nehirler/meric/` | Έβρος/Meriç/Марица | içinde |
| `/nehirler/aras-2/` | Aras / Արաքս | içinde |

İlk üçünde **URL de anlamsız** (`gol-1`, `nehir-1`, `nehir-2`) — yer
tutucu slug yayında. Altısı da sitemap'te, yani indekslenmeye açık.

Veri ölçümü: `src/data/tr-goller.json` 279 kayıt (ad'ı boş olan 0, latin
dışı 29), `src/data/tr-nehirler.json` 131 kayıt (boş 0, latin dışı 41).
Yani latin-dışı adların çoğu Türkçe bir ada da sahip olan sınır ötesi su
kütleleri; yalnız 6'sında Türkçe ad hiç yok ve o hâliyle yayınlanıyor.

**SINIF: KARAR.** Gerekçe: (i) düzeltme seçenekleri (Türkçe ad verme /
sayfayı yayından çıkarma / slug düzeltme) görünür içeriği ve URL'yi
değiştirir; (ii) URL değişimi yönlendirme gerektirir (yayın zinciri);
(iii) 24.08'de bu sayfa ailesinde bilinçli bir temizlik yapılmıştı
(KARARLAR §25) — adların o turda kasten bırakılmış olma ihtimali var,
tek taraflı değiştirmek o kararı ezebilir.
**ETKİ: orta** — 6 sayfa; Türkçe bir sitede yabancı alfabeyle başlık hem
kullanıcıya hem arama motoruna anlamsız görünür, ayrıca 3'ünde URL de
bilgi taşımıyor.

---

## D11 — `/havza-riski/` PUANININ %40'I SABİT: BAĞIMSIZ DOĞRULANDI

1.5a ajanının B-04 bulgusu (rapor/26-08-denetim-15a-uydurma.md) bu turda
kaynak + veri + yayınlanmış çıktı üzerinden **bağımsız yeniden ölçüldü**
ve doğrulandı. Bu, denetimin en ağır bulgusudur.

**Kusur 1 — havza adı eşleşmiyor (0/25).**
`src/data/havza-risk.js:42` `baraj.havzalar?.[vd?.ad]` ile arıyor.
- `data/havza-veri.json` adları: `Meriç-Ergene Havzası`, `Marmara Havzası`,
  `Gediz Havzası` … (hepsi " Havzası" ekli)
- `data/canli/baraj.json` anahtarları: `Doğu Akdeniz`, `Ceyhan`,
  `Batı Karadeniz`, `Antalya`, `Van Gölü`, `Seyhan` … (ek yok)
- Ölçüm: **EŞLEŞEN 0 / 25.**

**Kusur 2 — alan adı da yanlış.**
`havza-risk.js:54` `b.doluluk` okuyor. Gerçek baraj kaydının alanları
ölçüldü: `['seri']` — yani doluluk `b.seri[tarih].doluluk` altında.
`doluluk` alanı kayıtta **yok**. Yani ad eşleşmesi düzelse bile bileşen
yine boş dönerdi.

**Sonuç:** `barajSkor` her havzada varsayılan **0,5**'te kalıyor (ağırlık %25).

**Üçüncü bileşen de sabit:** `tahsisSkor` — `data/havza-veri.json`'da
`tahsis` alanı **25/25 havzada null** (ölçüldü) → kod nötr 0,5 veriyor
(ağırlık %15).

**YAYINLANMIŞ KANIT (en güçlü delil):**
```
$ grep -o "baraj doluluk etkisi: [0-9]*/100" dist/havza-riski/index.html | sort | uniq -c
     25 baraj doluluk etkisi: 50/100
```
25 havzanın 25'inde aynı değer — JSON-LD `Observation` şemasının içinde,
yani arama motorlarına ve AI sistemlerine yapılandırılmış veri olarak
sunuluyor.

**Sayfanın kendi iddiası (dist, birebir):**
> "Türkiye'nin 25 su havzası için **6 göstergeden** (GRACE uydu verisi,
> **baraj doluluk**, YAS rezervi, **tahsis durumu**, yüzey suyu
> potansiyeli) hesaplanan bileşik su riski…"

Yani puanın **%40'ı** (baraj %25 + tahsis %15) her havzada aynı sabit
değerken, sayfa bunları çalışan gösterge olarak ilan ediyor.

**YAYIN YÜZEYİ ÖLÇÜLDÜ (etki için belirleyici):**

| | `/havza-riski/` | `/ilce-sorgu/` |
|---|---|---|
| sitemap.xml | **içinde** | **içinde** |
| robots meta | yok → **indekslenebilir** | yok → **indekslenebilir** |
| llms.txt (AI içindekiler) | **içinde** | — |
| iç link veren sayfa | **521** | **521** |

İkisi de tam yayın yüzeyinde; site genelinden link alıyorlar.

**SINIF: KARAR.** Gerekçe: onarım (bileşenlerin düzeltilmesi ya da
göstergenin dürüstçe "veri yok" olarak işaretlenmesi) **yayınlanmış
sayıları ve JSON-LD'yi değiştirir** — 2b bit-eşitlik kuralı gereği
UYGULAMA sınıfına giremez. Ayrıca hangi yolun seçileceği (bug'ı düzelt /
bileşeni kaldır / "veri yok" yaz) ürün ve dürüstlük kararıdır.
**ETKİ: YÜKSEK** — sitenin `/hakkinda/` sayfasındaki kendi taahhüdüyle
doğrudan çelişiyor: *"Doğrulanamayan hiçbir veri doğrulanmış gibi
gösterilmez… tahmin veya ara değer üretilmez."*

---

## D12 — GEO BULGULARINDAN İKİSİ BAĞIMSIZ DOĞRULANDI

**B2-3 — Person şeması ikiye bölünmüş, `url`'leri çelişiyor.** Doğrulandı
(`dist/rehberler/kuyu-ruhsati/index.html` JSON-LD, birebir):
- Düğüm 1: `@id: https://suharitasi.com/#yazar` · `url:
  https://suharitasi.com/hakkinda/` · `jobTitle`, `description`,
  `knowsAbout`, `worksFor` **dolu** (zengin düğüm)
- Düğüm 2: `@id: https://suharitasi.com/hakkinda/#yazar` · `url:
  https://arslanhukuk.tr` (farklı!)
- `Article.author` **düğüm 2'yi** gösteriyor → zengin düğüm makaleye bağlı
  değil, yazar kimliği iki parçaya bölünmüş ve `url` alanları çelişiyor.

**B3-1 — Observation şemasında ölçüm değeri yanlış alanda.** Doğrulandı
(`dist/havza-riski/index.html`, 25 Observation):
```
{"@type":"Observation","name":"Asi Havzası Su Riski Puani: 63/100 (yuksek)",
 "measuredProperty":{"@type":"PropertyValue","name":"Su Riski Puani","value":63},
 "observationAbout":{"@type":"Place","name":"Asi Havzası"}}
value alanı olan: 0/25 · observationDate olan: 0/25
```
Sayısal değer `measuredProperty` içinde saklı; `Observation.value` ve
`observationDate` **hiçbir kayıtta yok**. Makine tarafında "değeri
olmayan gözlem" olarak okunur.

**İKİSİ DE SINIF: KARAR.** Gerekçe: onarım **JSON-LD'yi değiştirir**;
brief 2b açıkça "görünür metin ve JSON-LD BİT-EŞİT kalmalı, değilse o
onarım UYGULAMA sınıfı değilmiş demektir" diyor. Görünür metin
değişmese de yapısal veri değişiyor → UYGULAMA sınıfına giremezler.

**Bu kural bu denetimde bağlayıcı oldu:** JSON-LD'ye dokunan tüm GEO
onarımları (FAQPage yaygınlaştırma, Observation alanları, Person
birleştirme, DataCatalog bağı) KARAR sınıfına taşındı — hiçbiri
uygulanmadı.

---

## D13 — ÜÇ KATMANIN İÇERİĞİ: ikisi BOŞ/İŞLENMEMİŞ (künye yazımı için kritik)

U3 kalemini yazmadan önce üç dosyanın içeriği açıldı. Sonuç, künye
metnini doğrudan belirledi — "veri kaynağı" diye kaydetmek ikisinde
**uydurma** olurdu:

| Dosya | Gerçek içerik | Doğru kayıt |
|---|---|---|
| `data/canli/chirps.json` (79 KB) | `havzalar` → 25 havza × aylık yağış serisi (2017-…). **Gerçek veri var.** Arşiv: `data/arsiv/chirps/` 10 NetCDF | "çekildi ve türetildi, sitede yayınlanmıyor" |
| `data/canli/jrc-yuzey-suyu.json` (2,5 KB) | `tile'lar: {}` **boş**; 25/25 havza `"durum": "islenmedi (tile bazli hesap gerekir)"` | **İskele dosya** — veri YOK |
| `data/canli/era5-toprak.json` (274 bayt) | `aylik: {}` **tamamen boş**; yalnız künye | **İskele dosya** — veri YOK |

Üreticiler mevcut: `arac/chirps-cek.py`, `arac/jrc-isle.py`,
`arac/era5-toprak.py`.

**Sonuç:** KAYNAKLAR.md kaydı üçünü de "veri seti" diye yazamaz;
CHIRPS için "veri var, yayınlanmıyor", JRC ve ERA5 için "çekim
başlatıldı, işlenmedi/boş" yazılmalıdır. Bu, K7'deki bulguyla da
tutarlı: `/ilce-sorgu/` "JRC/yüzey suyu" bileşeni gösterirken kaynak
dosya 25/25 havzada `islenmedi` diyor.

---

## D14 — 1.7 DIŞ BAĞLANTI TAM TARAMASI: ÖLÜ BAĞLANTI **0**

md17 sağlık kalemi haftalık %5 örneklem tarıyor (52/1037). Bu denetimde
**tamamı** tarandı — üretim kodunun kendi fonksiyonlarıyla
(`arac/kapsam-kalemleri.mjs` → `disLinkleriTopla` + `disLinkDenetle`),
vekil ölçüm kullanılmadan.

```
toplam 1037 · taranan 1037 · süre 2057 sn (34 dk)
ÖLÜ (404/410): 0
ŞÜPHE (zaman aşımı/5xx): 109
HEAD-reddetti-GET-geçti: 10
```

**ŞÜPHE dağılımı — kusur değil, bilinen erişim deseni:**

| Konak | Adet | Yorum |
|---|---:|---|
| `www.resmigazete.gov.tr` | **75** | Resmî TR kaynaklarının bu sunucudan (yurtdışı IP) engellenmesi KAYNAKLAR.md'de zaten kayıtlı bilinen desendir |
| `hdl.handle.net` | 20 | 500 dönenler geçici sunucu hatası |
| `avesis.*` (3 üniversite) | 7 | 500 / zaman aşımı |
| `doi.org` | 5 | zaman aşımı |
| `www.mevzuat.gov.tr` | 1 | zaman aşımı |
| `acikerisim.pau.edu.tr:8080` | 1 | standart dışı port |

Kod dağılımı: zaman aşımı 89 · HTTP 500 20. **404/410 sıfır.**

**SONUÇ: 1.7'de onarılacak kırık dış bağlantı YOK.** md17'nin 🟡 sarısı
dış sunucu kaynaklıdır ve tam tarama bunu doğruladı: örneklemdeki 19
şüphe, tam taramada 109'a çıkıyor ama ölü sayısı **her iki ölçümde de 0**.
Not: 109/1037 = %10,5'lik şüphe oranının dörtte üçü tek konaktan
(resmigazete.gov.tr) geliyor.

---

## D15 — FAZ 2 BİT-EŞİTLİK ÖLÇÜMÜ (2b) — ve ölçüm aracının kendi kusuru

**Önce araç kusuru (dürüstlük kaydı):** ilk yazdığım karşılaştırma aracı
HTML etiketlerini `\x01` ayracıyla değiştiriyordu; bu, eklediğim `<main>`
etiketini "görünür metin farkı" gibi gösterdi. Yani araç, **metin
içeriğini değil yapıyı** ölçüyordu. Araç ikiye ayrıldı ve ölçüm
tekrarlandı:

| Ölçüm | Yöntem | Sonuç |
|---|---|---|
| **Saf görünür metin** | etiketler tamamen silinir, varlıklar çözülür, boşluk normalize | **0 / 523 sayfa farklı** |
| **JSON-LD** | her `application/ld+json` ayrıştırılıp anahtar-sıralı kanonik JSON'a çevrilir | **0 / 523 sayfa farklı** |
| **Yapı** (etiket dizisi) | etiket adları dizisi | **1 sayfa**: `index.html` |

`index.html` yapı farkının tamamı ölçüldü:
```
taban etiket sayısı: 717 · hedef: 719 · fark: 2
DEĞİŞEN: <main   0 → 1
DEĞİŞEN: </main  0 → 1
```
Yani tek yapısal değişiklik **kasten eklenen `<main>` sarmalayıcısıdır**;
başka hiçbir etiket eklenmedi/silinmedi.

**Sayfa envanteri:** kaybolan sayfa 0 · yeni sayfa 0 · sitemap 519 (taban
ile aynı) · build 522 sayfa (taban ile aynı).
**dist boyutu: 45 MB → 35 MB** (U1 silmeleri).

---

## D16 — 1.4 PERFORMANS TURU (canlı site, şablon başına 3 tur MEDYAN)

Ölçüm: yerel Lighthouse, canlı `https://suharitasi.com` hedefli, her sayfa
için mobil + masaüstü × 3 tur, **medyan** (CLAUDE.md: tek ölçümle karar
verilmez). Boş makinede koşuldu.

| Şablon | Kırılım | perf | LCP | CLS | TBT | FCP |
|---|---|---:|---:|---:|---:|---:|
| anasayfa `/` | mobil | **81** | **4325 ms** | 0 | 0 ms | 2590 ms |
| anasayfa | masaüstü | 98 | 930 ms | 0,002 | 0 ms | 850 ms |
| havza `/havzalar/sakarya/` | mobil | 90 | 2896 ms | 0,001 | 0 ms | 2896 ms |
| havza | masaüstü | 98 | 840 ms | 0,002 | 0 ms | 840 ms |
| rehber `/rehberler/kuyu-ruhsati/` | mobil | 91 | 2755 ms | 0 | 0 ms | 2755 ms |
| rehber | masaüstü | 99 | 794 ms | 0,004 | 0 ms | 794 ms |
| arşiv `/arsiv/` | mobil | 91 | 2754 ms | 0,023 | 0 ms | 2754 ms |
| arşiv | masaüstü | 99 | 795 ms | 0,014 | 0 ms | 795 ms |
| il `/kuyu-ruhsati/adana/` | mobil | 92 | 2681 ms | 0,006 | 0 ms | 2681 ms |
| il | masaüstü | 99 | 764 ms | 0,008 | 0 ms | 764 ms |

**BULGU P1 — ana sayfa mobil LCP 4325 ms, sitenin en yavaş kalemi.**
Diğer üç şablon mobilde 2755-2896 ms bandında; ana sayfa ~1,5 kat daha
yavaş ve tek 80'ler puanı orada. LCP öğesi ölçüldü:
`div.v2-sahne-alan > figure.v2-kadraj > div#v2-videolar > img#v2-kadraj-poster`
— yani hero sahnesinin **video posteri**. Lighthouse'un
"Preload Largest Contentful Paint image" denetimi **skor 1** (geçiyor),
yani preload zaten var; darboğaz görselin kendisi/boyutu.
**SINIF: KARAR** — hero görsel/sahne alanı görsel kimliktir (md14 G1-G6
taban kapsamında); optimizasyon görünür çıktıyı etkileyebilir.
**ETKİ: Orta** — mobil ilk izlenim ve CWV sinyali.

**CLS:** hepsi eşik altında (en yüksek `/arsiv/` mobil 0,023; iyi eşiği
0,1). Boyutsuz `<img>` taraması 523 sayfada **tek 1 adet** bulmuştu
(`harita.astro:274` hero) — CLS ölçümü bunu doğruluyor, sorun üretmiyor.

**TBT: 0 ms** — beş şablonun onunda da. Site pratikte JS'siz (dist toplam
JS 18 KB).

**ÖLÇÜLEMEYEN — dürüstçe:**
- **INP** saha metriğidir, laboratuvarda ölçülmez. TBT vekildir ama INP
  YERİNE KONMADI.
- **Gerçek-kullanıcı CWV (CrUX)**: `crux_current` API anahtarı istiyor
  (`CRUX_API_KEY` yok; hesap açma yasak) → **ölçülemedi**.
- **PageSpeed Insights API**: günlük kota doldu (HTTP 429) → **ölçülemedi**.
  Bu iki kaynak olmadan saha verisi alınamaz; yalnız laboratuvar verisi var.

**ÖLÇÜM HATASI KAYDI (kendi hatam):** ilk turda il şablonu için
`/nerede-su-cikar/adana/` kullanıldı — o rota **404** (il sayfaları
`/kuyu-ruhsati/[il]/` altında). Araç bunu "perf 0 · ÖLÇÜLEMEDİ" diye
dürüstçe raporladı (null-güvenli medyan sayesinde 0 sanılmadı) ve ölçüm
doğru URL ile tekrarlandı.

**İKİNCİ ÖLÇÜM HATASI KAYDI:** ilk perf turu, dış link taraması sürerken
koşulmuştu ve "ağ kirlenmesi" şüphesi doğmuştu (ana sayfa mobil 82 vs
md9'un 92'si). Boş makinede tekrar koşuldu: **81** çıktı — yani kirlenme
YOKTU, fark md9'un kendi belgelediği mobil yayılımdır
(`site-saglik.mjs:1112` yorumu: "/hangi-kurum/ mobilde 11 PUAN (88-99)").
Şüphe ölçümle kapatıldı, varsayımla değil.

---

## D17 — KARAR DOSYASINA GİREN İKİ İDDİANIN BAĞIMSIZ SAYIMI

**K5 (Person şeması bölünmesi) — doğrulandı, sayı birebir:**
```
Article toplam: 92
  author → hakkinda/#yazar (zengin OLMAYAN düğüm): 92
  author → #yazar (zengin düğüm): 0
```
Yani 92 makalenin **92'si** `jobTitle`/`description`/`knowsAbout`
taşımayan düğüme bağlı; zengin düğüm hiçbir makaleden referans almıyor.

**K9 (hukuki şerh dağılımı) — bu denetimde YENİDEN ölçüldü ve
ajan raporundan farklı, daha kritik bir tablo çıktı:**
```
şerhli: 425 · şerhsiz: 97 · toplam: 522
şerhsiz dağılımı: durumum 43 · havzalar 26 · rehberler 11 · su-kanunu 3 ·
vaka 2 · (ana, kuyu-ruhsati, nerede-su-cikar, arsiv, kapatma-kaydi,
ilimde-kim-yetkili, harita, kullanilanlar, ilce-sorgu, havza-riski) 1'er
```
**Yeni bulgu:** sitenin en iddialı iki türetilmiş çıktısını üreten sayfa —
`/ilce-sorgu/` ("su çıkma olasılığı", akifer türü, kuyu derinliği) ve
`/havza-riski/` (bileşik risk puanı) — **ikisi de şerhsiz.** K9 bu
ölçümle güncellendi.

**AJAN RAPORU DÜZELTMESİ (kayda geçirildi):** 1.5a raporu K1'in emsalini
`src/data/il-profil.js:553` diye gösteriyordu; dosya **127 satır**.
Doğru konum **34-35** ve orada uyuşmazlığın nedeni yorumda yazılı:
*"EPİAŞ havza adı çıplaktır ('Sakarya'); site başlığı 'Sakarya Havzası'"*.
Bu düzeltme K1'i **güçlendiriyor**: depo bu uyuşmazlığı biliyor ve bir
yerde doğru çözüyor, risk hesabında çözmüyor. Yanlış satır atfı üç
rapordan da temizlendi.

---

## D18 — D16 PERFORMANS TABLOSU GEÇERSİZ: ölçüm protokolü hatalıydı

**D16'daki tablo, projenin kendi ölçüm protokolüne aykırı bir betikle
alınmıştır ve sayıları sistematik olarak DÜŞÜKTÜR.**

**Nasıl yakalandı.** D16'da "ana sayfa mobil 81, sitenin en yavaş kalemi"
diye bulgu açılmıştı (K37). Aynı gün md9 sağlık kalemi aynı sayfayı
**94** ölçtü. 5 turluk tekrar ölçümüm 75-84 bandında kaldı — yani fark
gürültü değil **sistematikti**.

**Kök neden.** `arac/site-saglik.mjs:1117` şunu açıkça yazıyor:
> *"PARALEL YASAK: her ölçüm kendi tarayıcısını açar ve kapatır."*

Benim `perf-turu.mjs` betiğim **tek Chrome örneğini bütün turlarda ve
bütün sayfalarda paylaşıyordu.**

**Doğru protokolle (her tur için yeni tarayıcı) tekrar ölçüm:**
```
tur 1: perf 94 · LCP 2478 ms
tur 2: perf 90 · LCP 2932 ms
tur 3: perf 81 · LCP 3679 ms
MEDYAN: perf 90 · LCP 2932 ms   (paylaşılan tarayıcıda: 82 / 4515 ms)
```

**Sonuçlar.**
1. **K37 GERİ ÇEKİLDİ** — ana sayfa diğer şablonlarla aynı bantta
   (2681-2932 ms). Bulgu ölçüm aracımın kusuruydu.
2. **D16 tablosunun mutlak değerleri kullanılmamalıdır.** Tüm satırlar
   aynı hatalı protokolle alındığından karşılaştırmalı sıralama da
   güvenilir değildir.
3. **1.4 performans boyutu md9'a devredildi.** md9 doğru protokolü
   kullanıyor, uyarlamalı medyan uyguluyor (eşiğe 12 puandan yakınsa
   3 tur) ve 27.08 koşumunda **14 sayfanın 14'ü de eşiği geçti**:
   `/ 100/94 · /nerede-su-cikar/ 99/85 · /arsiv/ 99/100 · /harita/ 93/75 ·
   /havzalar/sakarya/ 100/93 · /rehberler/kuyu-ruhsati/ 100/86 ·
   /rehberler/kuyu-tasima/ 99/83 · /durumum/ 98/99 · /hangi-kurum/ 99/99 ·
   /vaka/meysu/ 99/93 · /kapatma-kaydi/ 98/86 · /goller/tuz-golu/ 99/91 ·
   /nehirler/kizilirmak/ 98/94 · /ilce-sorgu/ 98/94`
4. **CLS ve TBT gözlemleri ayakta kalıyor** (protokolden bağımsız):
   CLS her şablonda eşik altında (en yüksek 0,023), TBT 0 ms — site
   pratikte JS'siz (dist toplam JS 18 KB). Boyutsuz `<img>` 523 sayfada
   yalnız 1 adet.

**DERS (kayda geçirildi):** bir ölçüm mevcut bir sağlık kalemiyle
çelişiyorsa, önce **kendi aracımı** sorgulamalıyım. Bu denetimde bu
tersine sıra iki kez işe yaradı: burada ve D15'te (etiket ayracı).

---

## D19 — FAZ 3 CANLI DOĞRULAMA (deploy sonrası)

Deploy: commit `4a6ad62` canlıda (surum.json ile doğrulandı, ~2 dk sonra).

**Rotalar:**
```
apex  https://suharitasi.com/            → 200
www   https://www.suharitasi.com/havzalar/ → 301 · location: https://suharitasi.com/havzalar/
```

**Silinen varlıklar canlıda gerçekten kalktı mı:**
| URL | Durum |
|---|---|
| `/deneyim/video/sahne1.webm` | **404** ✓ |
| `/hedef-hero.webp` | **404** ✓ |
| `/s/su-sim.js` | **404** ✓ |

**Kullanılan varlıklar bozulmadı mı:**
| URL | Durum |
|---|---|
| `/deneyim/video/sahne1.mp4` | 200 ✓ |
| `/hedef-hero.v2.webp` | 200 ✓ |
| `/s/imlec.js` · `/s/sayfa.js` | 200 ✓ |

**Beş sayfanın canlı görünür metni ↔ yerel build:**
| Sayfa | Sonuç |
|---|---|
| `/havzalar/sakarya/` | **BİREBİR** (9035 = 9035 karakter) |
| `/rehberler/kuyu-ruhsati/` | **BİREBİR** (18672 = 18672) |
| `/kuyu-ruhsati/adana/` | **BİREBİR** (18198 = 18198) |
| `/` | FARKLI — **beklenen** (aşağıda) |
| `/arsiv/` | FARKLI — **beklenen** (aşağıda) |

**İki fark da kanıtlandı, ikisi de bu denetimin sonucu DEĞİL:**

1. **Ana sayfa** — fark tam olarak **bekleyen hero değişikliğidir**
   (kullanıcı onayı bekliyor, commit edilmedi):
   - git'te (canlıya giden): *"Kuyunuzun ilindeki 472 kütleden hangisinde
     olduğunu bilen avukatla konuşun — tahminle değil, resmî veriyle."*
   - çalışma ağacında (yerel build'e giren): *"472 yeraltısuyu kütlesi,
     25 havza ve 1963'e uzanan 419 Resmî Gazete kaydı — hepsi kaynağı
     gösterilmiş tek haritada."*

2. **`/arsiv/`** — "969 dosya" (yerel) vs "925 dosya" (canlı). Bu,
   SIRADAKILER'deki **bilinen açık karar kalemidir** (yerel build ile
   canlı build aynı sayıyı basmıyor). Ölçüldü:
   `find data/arsiv/baraj -type f` → **969** · `git ls-files` → **925** ·
   fark **44** = `.gitignore`'daki `*.log` deseni (F4-7 bulgusu, reflog
   ile kanıtlı bilinçli karar). Astro'dan ve bu denetimden bağımsızdır.

   *Not: kalem SIRADAKILER'de "946/903" sayılarıyla kayıtlı; bugünkü
   ölçüm 969/925. Fark büyüklüğü 43'ten 44'e çıkmış — log dosyaları
   günlük üretildiği için sayılar zamanla artıyor, kalem aynı kalem.*

**Not (28.07 kuralı uygulandı):** canlı karşılaştırmada Cloudflare
e-posta gizlemesi (`[email protected]`) normalize edildi; aksi halde
yerel-canlı farkı yanlış-pozitif üretirdi.

---

## D20 — FAZ 3 KAPANIŞ ÖLÇÜMLERİ (deploy sonrası)

### 3a · Sağlık `--tam` (canlı, commit 4a6ad62) — kalem kalem

| Kalem | Taban (04:57, denetim öncesi) | Faz 3 (08:45, deploy sonrası) |
|---|---|---|
| 22-kaynak | GEÇTİ | GEÇTİ |
| 1-sitemap | GEÇTİ · 519 URL | GEÇTİ · **519 URL** |
| 2-erisim | GEÇTİ · 519/519 · 200 | GEÇTİ · **519/519 · 200** |
| 3-yonlendirme | GEÇTİ · 6/6 | GEÇTİ · 6/6 |
| 24-www | GEÇTİ | GEÇTİ |
| 4-medya | GEÇTİ · 6/6 sahne oynuyor | **GEÇTİ · 6/6** (webm silindikten SONRA) |
| 5-konsol | GEÇTİ · hata 0 | GEÇTİ · hata 0 |
| 8-mobil | GEÇTİ · taşma 0 px | GEÇTİ · taşma 0 px |
| 13-kontrast | GEÇTİ · en dar 3.5:1 | GEÇTİ · en dar 3.5:1 |
| 7-geo-seo | GEÇTİ · 13/14 | GEÇTİ · 13/14 |
| 6-baglantilar | GEÇTİ · kırık 0 | GEÇTİ · kırık 0 |
| 12-etkilesim | GEÇTİ · 4/4 | GEÇTİ · 4/4 |
| 14-gorsel | GEÇTİ · G1-G6 sapma yok | **GEÇTİ · sapma yok** (`<main>` eklendikten SONRA) |
| 21-dokunma | GEÇTİ · ihlal 201 = taban | GEÇTİ · ihlal 201 = taban |
| 15-erisilebilirlik | GEÇTİ · 100/100 | GEÇTİ · 100/100 |
| 9-lighthouse | GEÇTİ · 14 sayfa | GEÇTİ · 14 sayfa (`/` 98/87) |
| 11-veri-butunlugu | GEÇTİ | GEÇTİ |
| 16-seo-geo-genis | GEÇTİ · bulgu 20 = taban | GEÇTİ · bulgu 20 = taban |
| **17-dis-baglanti** | **SARI** · 19 şüphe, ölü 0 | **SARI** · 20 şüphe, **ölü 0** |
| 18-veri-genis | GEÇTİ | GEÇTİ |
| 19-baslik-og-cta | GEÇTİ · 6 başlık + 22 mailto | GEÇTİ · 6 başlık + 22 mailto |
| 20-altyapi | GEÇTİ | GEÇTİ |
| 23-altin-ornek | GEÇTİ · 23/23 | GEÇTİ · 23/23 |

```
TABAN: GENEL: SARI — kırmızı 0 · sarı 1 · geçti 22
FAZ 3: GENEL: SARI — kırmızı 0 · sarı 1 · geçti 22
```
**TABAN GERİLEMESİ: 0.** Tek sarı, denetim öncesinde de sarı olan md17
(dış bağlantı) — ve tam tarama onun **ölü bağlantı içermediğini**
kanıtladı (D14: 1037/1037, ölü 0).

**İki kalem özellikle önemli:**
- **md4 (medya) GEÇTİ** — 6 sahnenin altısı da oynuyor. `.webm`
  dosyalarının silinmesi medyayı bozmadı (zaten hiç istenmiyorlardı).
- **md14 (görsel/düzen) GEÇTİ** — G1-G6 sapma yok. Ana sayfaya eklenen
  `<main>` sarmalayıcısı görsel düzeni bozmadı.

### 3b · Build ve sitemap sayıları

| | Taban | Faz 3 | Durum |
|---|---|---|---|
| Sayfa | 522 | **522** | aynı |
| Sitemap URL | 519 | **519** | aynı |
| dist boyutu | 45 MB | **35 MB** | **−10 MB** (U1 silmeleri — kasıtlı) |

Kaybolan sayfa **0**, yeni sayfa **0**. Boyut düşüşü tek fark ve
açıklaması U1'dir.

### 3e · SIRADAKILER

`git diff` ile doğrulandı: **SIRADAKILER.md bu denetimde HİÇ
DEĞİŞTİRİLMEDİ.** Denetimden doğan hiçbir bulgu kuyruğa yazılmadı;
hepsi karar dosyasında duruyor. Tarihli kalem doğmadı (mevcut tek
tarihli kalem 02.09.2026 astro5-referans silme kalemi, dokunulmadı).

---

# D21 — K1 · K2 · K3 · K9 UYGULAMASI (kullanıcı onaylı, 27.08.2026)

Kullanıcı dört kararı onayladı ("k1 k2 k3 ve k9'u onaylıyorum uygula").
K1 için onaylanan seçenek karar dosyasındaki **tavsiye (a)**'dır; (a)'nın
metni K12 (gösterge sayısı) ve K13 (yöntem künyesi) kalemlerinin bu turda
birlikte kapanacağını açıkça yazıyordu — ikisi de K1 kapsamında yapıldı.

Brief: `cikti/brief/2026-08-27-K1-K2-K3-K9-uygulama.md` (+ düzeltilmiş hâli).
Denetçi: **ENGEL 0 · UYARI 1** (uyarı, üretilecek bileşen dosyasıydı).
Düşman geçişi D1-D4 briefte; D2 iki gerçek kusur yakaladı ve brief
düzeltildi (8 havzada boş açıklama riski + kapsam aritmetiği).

## K1 — `/havza-riski/` risk puanı

**Yapılan (`src/data/havza-risk.js`):**
1. Baraj araması havza adını çıplaklaştırıyor (`il-profil.js:34-35` deseni).
2. Doluluk `barajlar[AD].seri[EN_SON_TARİH].doluluk` yolundan okunuyor.
3. **Verisi olmayan gösterge puana girmiyor** — nötr 0,5 dolgusu kaldırıldı;
   ağırlıklar havza bazında yeniden normalize ediliyor. **Ağırlık sabitleri
   (0.30/0.25/0.20/0.15/0.10) DEĞİŞMEDİ.**
4. Hiçbir göstergenin verisi yoksa puan `null` → sayfa "HESAPLANAMADI".
5. Tahsis kartı **silinmedi**, "veri yok — puana dahil edilmiyor" oldu;
   mantık korundu, veri gelirse kendiliğinden devreye girer.

**Ölçüm — ÖNCE / SONRA:**

| | ÖNCE | SONRA |
|---|---|---|
| baraj eşleşmesi | **0/25** | **17/25** |
| `baraj doluluk etkisi` farklı değer | **1** (25/25'te sabit `50/100`) | **15** |
| puanı değişen havza | — | **22/25** |
| puan aralığı | 39-63 | **32-62** |
| `"6 göstergeden"` (dist) | var | **0** |
| `"bilimsel"` (dist) | 1 | **0** |

Baraj verisi olmayan 8 havzada (Meriç-Ergene, Küçük Menderes, Burdur,
Akarçay, Konya Kapalı, Fırat-Dicle, Çoruh, Aras) şema açıklaması artık
"baraj doluluk etkisi" ifadesini **hiç basmıyor** — brief D2'de yakalanan
risk giderildi.

**K12:** gösterge sayısı sabit yazılmıyor, `gostergeAraligi()` ile koddan
türetiliyor (sayı bekçisi deseni).
**K13:** "bilimsel gösterge" ifadesi kaldırıldı; yerine puanın
suharitasi.com'un kendi bileşik göstergesi olduğu, resmî sınıflandırma
olmadığı ve ağırlıkların portal tarafından seçildiği yazıldı.
**Şema yapısı değişmedi** — `Observation.value`/`observationDate` eklemek
K6'dır ve onaylanmamıştır; yalnız yanlış olan açıklama metni düzeltildi.

## K2 — boşluk yutması

Kör düzeltme yapılmadı: önce kaynak dedektörü (satır sonu + satır-içi
etiket sınırı), sonra **dist üzerinde yer-gerçeği ölçümü** yazıldı.
Ölçüt daraltıldı: `span` CSS ile blok olabildiği için kapsam dışı
bırakıldı (yanlış-pozitif), yalnız `a|strong|em|abbr|b|i|q|cite`.

| | ÖNCE | SONRA |
|---|---|---|
| yapışma isabeti | **205** (115 sayfa) | **6** (4 sayfa) |
| `Arslan —<a` deseni | **519 sayfa** | **0** |

Kalan 6 isabetin tamamı **kasıtlı Türkçe ek yazımı ya da görsel olarak
ayrı öğe** — tek tek açıldı ve doğrulandı:
- `<em>anlam</em>dır` (`/kullanilanlar/`) — ek etiket dışında, kasıtlı.
- `<a>…kuyu ruhsatı rehberi</a>ne` (`/kuyu-ruhsati/`) — aynı desen.
- `/ilce-sorgu/` iki bitişik buton-bağlantı (`hukuk-yon-links`).
- `/harita-pilot/` (noindex) bitişik gezinme bağlantıları.

Düzeltilen dosyalar: `AltBilgi` (519 sayfa), `kuyu-ruhsati/[il]` (81×2),
`HavzaYasBandi` (25), `hakkinda` (4 yer), `arsiv` (2), `durumum/index` (2),
`kuyu-ruhsati/index`, `nerede-su-cikar`, `IlKurumTablosu`, `KanitBandi`,
`IlPotansiyel`.

**Yan bulgu (kendi hatam, ölçümle yakalandı):** K1 için yazdığım yeni
metin de aynı kusuru üretmişti ("…olurdu; ancak**havza** bazlı…");
ölçüm yakaladı, düzeltildi.

## K3 — kardeş il bağlantıları

`src/pages/kuyu-ruhsati/[il].astro:201` `{x.ad}` → `{x.il}`
(veri nesnesinde alan adı `il`; `il-profil.js:105`).

| | ÖNCE | SONRA |
|---|---|---|
| boş etiketli kardeş bağlantı | **230** (76 sayfa) | **0** |

Yan fayda ölçüldü: md21 dokunma hedefi ihlali **201 → 199** (bağlantılar
metin kazanınca hedef alanı büyüdü).

## K9 — hukuki şerh

Yeni bileşen `src/components/HukukSerhi.astro`, 16 şablona bağlandı.
**Yeni hukuki metin yazılmadı:** cümle `/hakkinda/`'da yayımlanmış
cümlenin sayfa-bağımsız hâli. Ölçümle doğrulandı — tek fark özne:
```
HAKKINDA : Rehberler bilgilendirme amaçlıdır; somut bir uyuşmazlığa dair hukuki görüş veya tavsiye niteliği taşımaz.
ŞERH     : Bu sayfa bilgilendirme amaçlıdır; somut bir uyuşmazlığa dair hukuki görüş veya tavsiye niteliği taşımaz.
Fark yalnız 'Rehberler'→'Bu sayfa' mı: True
```

| | ÖNCE | SONRA |
|---|---|---|
| şerhli sayfa | **425** | **516** |
| şerhsiz sayfa | **97** | **6** |
| çift basılan | — | **0** |

Kalan 6 şerhsiz sayfa, briefteki gerekçeli hariç tutma listesinin
**tamamı**: ana sayfa · `/harita/` · `/arsiv/` · `/kullanilanlar/` ·
`/stil-pilot/` · `/harita-pilot/` (son ikisi noindex).
Kapsam aritmetiği kapanıyor: 97 = 90 (eklendi) + 1 (`/havza-riski/`,
K1 kartının içine) + 6 (hariç).

## E1 — "yalnız amaçlanan değişiklik" kapısı

2b bit-eşitlik kuralı bu işte geçerli değildi (görünür çıktı BİLEREK
değişiyor); yerine her farkın onaylı bir kaleme bağlanabilmesi arandı:

```
görünür metni DEĞİŞEN sayfa: 519/523
  K9 (şerh eklendi):            91
  K2/K3 (boşluk + kardeş il):  428
  BAĞLANAMAYAN:                  0
```
Sayfa **522**, sitemap **519** — ikisi de tabanla aynı. Kaybolan/yeni
sayfa 0.

## E2 — md14 görsel taban

Brief, K9'un md14 kapsamındaki 5 sayfaya metin eklediğini ve kalemin
kırmızı verebileceğini öngörmüştü; taban yenilemesi hazırdı.
**Gerek kalmadı — md14 GEÇTİ:** *"22 ölçümde G1-G6 sapması yok · taban
2026-08-24"*. Alt bilgi üstüne eklenen tek satır G1-G6 ölçülerini
(metin-görsel örtüşmesi, ölçek, tipografi, ritim, ortalama, S1)
etkilemiyor. **Taban yenilenmedi, gerekçe kaydı açılmadı.**

## E4 — canlı doğrulama (deploy `bf21aed`)

```
apex 200 · www 301 → apex
/havza-riski/ 200 · /durumum/ 200 · /rehberler/kuyu-ruhsati/ 200 · /kuyu-ruhsati/adana/ 200
canlı /havza-riski/: "6 göstergeden" 0 · "bilimsel" 0 · farklı baraj skoru 15
canlı şerh: "Bu sayfa bilgilendirme amaçlıdır; …"
canlı künye: "Hukuki içerik: Av. Serdar Arslan — <a …>Arslan Hukuk Bürosu"
```

## E3 — sağlık kapısı (deploy sonrası, commit `bf21aed`)

```
TABAN (denetim öncesi, 04:57): GENEL: SARI — kırmızı 0 · sarı 1 · geçti 22
K1+K2+K3+K9 SONRASI  (10:34): GENEL: SARI — kırmızı 0 · sarı 1 · geçti 22
```
**TABAN GERİLEMESİ: 0.** Tek sarı yine md17 (dış bağlantı; denetim
öncesinde de sarıydı, tam tarama ölü 0 kanıtladı — D14).

Kritik kalemler:
- **md14 görsel** GEÇTİ — G1-G6 sapması yok (K9 metin eklemesine rağmen).
- **md21 dokunma** ihlal **201 → 199** — K3'ün yan faydası (bağlantılar
  metin kazanınca dokunma hedefi büyüdü). Taban korundu.
- **md15 a11y** 14 sayfa 100/100.
- **md9** 14/14 sayfa eşiği geçti (`/` 99/99).
- **md16** bulgu 20 = taban 20 (yeni SEO/GEO bulgusu doğmadı).
- **md4 medya** 6/6, **md5 konsol** 0 hata, **md6 iç link** kırık 0.

## KALEM DURUMU

| Karar | Durum |
|---|---|
| **K1** (+K12, +K13 — (a) seçeneğinin parçası) | **UYGULANDI** |
| **K2** | **UYGULANDI** |
| **K3** | **UYGULANDI** |
| **K9** | **UYGULANDI** |
| K4, K5, K6, K7, K8, K10, K11, K14-K36, K38 | karar dosyasında **BEKLİYOR** |

**Geri alma (tek commit):**
```
git revert bf21aed && npm run build && git push origin main
```
