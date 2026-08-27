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
