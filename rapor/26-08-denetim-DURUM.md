# DENETİM — DEVRALMA DURUM RAPORU (27.08.2026)

Tam denetim (5 faz, 10 boyut) model kotası bitince ortada durdu. Bu belge
**yalnız durum tespitidir**: ne yapıldı, ne yapılmadı, devam edilebilir mi.
Bu turda hiçbir onarım yapılmadı, hiçbir yeni ölçüm başlatılmadı, commit
atılmadı. EK-A'daki bulgular yeni ölçüm DEĞİL — kesilme anında yalnız
oturum belleğinde duran, diske hiç yazılmamış Faz 1 çıktılarının kayda
geçirilmesidir (kayıp riski vardı).

---

## 0. KAPI — GEÇTİ

| Kontrol | Ölçülen | Beklenen | Sonuç |
|---|---|---|---|
| pwd | `/home/suha/projeler/suharitasi` | aynı | ✓ |
| remote | `https://github.com/suharitasi/suharitasi.git` | suharitasi/suharitasi | ✓ |
| node | v22.23.2 | v22.x | ✓ |

`arslanhukuk.tr` ve `bist-*` dizinlerine bu turda da girilmedi.

---

## 1a. GIT DURUMU

**Çalışma ağacı (`git status --short`):**
```
 M src/components/anasayfa/Hero.astro
 M src/data/anasayfa-satis.js
```
İzlenmeyen dosya: **yok** (`--untracked-files=all` ile doğrulandı).

**Son commit'ler:**
```
a717abe Su izleme: 2026-08-27T05-45-01Z (olay=1 hata=0) (otomatik)
7746ed8 Denetim Faz 0: brief + denetçi geçişi + karar dosyası iskeleti + taban ölçümü
22e3e86 kayıt: kuyruk kapatma raporuna Faz C commit karması işlendi (23f9614)
```

Denetimden çıkan **tek commit 7746ed8**, içeriği tek dosya:
`rapor/26-08-denetim-KARARLAR-BEKLEYEN.md` (37 satır). Push'landı.
`a717abe` denetime ait değil — cron'un otomatik su-izleme commit'i.

---

## 1b. TABAN — ALINMIŞ, KIYAS MÜMKÜN

`/home/suha/denetim-taban/` **var**, NOT.txt **yerinde** (608 bayt):

```
Tarih: 2026-08-27T04:44:34Z
Commit: 22e3e86a730b891a14d0a15ff240580651f67e1b
Astro sürümü: 7.2.7 · Node: v22.23.2
Build: 522 sayfa · 6,26 sn (astro) / 7,30 sn duvar · dist 45 MB (45348 KB)
Sitemap: 519 URL
DİKKAT: taban, bekleyen hero değişikliği DAHİLKEN alındı (brief 0b talimatı).
```

Dizin ölçümü: 45 MB, 522 `index.html`.

**Ek doğrulama (bu turda yapıldı):** çalışma ağacındaki `dist/` ile taban
kopyası `diff -rq` ile karşılaştırıldı → **BİT-EŞİT**. Yani taban geçerli,
kıyas noktası bozulmamış, aradan geçen sürede kimse build almamış.

---

## 1c. ON BOYUTUN DURUMU

Faz 1 (ölçüm) fazıydı; hiçbir dosya değiştirilmeyecekti ve değiştirilmedi.
Ölçümlerin bir kısmı tamamlandı, sonuçları **diske yazılmadan** kesildi.
Aşağıdaki tablo, kesilme anındaki gerçek durumdur. Tamamlanan boyutların
bulgu metinleri bu belgenin EK-A'sındadır.

| # | Boyut | Durum | Kanıt / eksik |
|---|---|---|---|
| 1.1 | Mimari ve kod | **TAMAM** | EK-A.1 — 16 erişilemez dosya, ~12,6 MB referanssız yayın varlığı, 16 tekrar bloğu, esbuild hayalet bağımlılığı |
| 1.2 | Tasarım / DESIGN.md | **TAMAM** | EK-A.2 — ölü B2B palet bloğu (22 token), 3 fantom token, bit-eşit literal seti, 60+ font-size, 20 breakpoint |
| 1.3 | Erişilebilirlik | **TAMAM (statik)** | EK-A.3 — 523 sayfa tarandı; 2 bulgu. Tarayıcı-gerektiren kısım ölçülmedi (sağlık md13/md15/md21 zaten kapsıyor) |
| 1.4 | Performans | **KISMİ** | EK-A.4 — dist dağılımı, görsel/font/JS envanteri, md9 skorları, canlı /harita/ mobil LH alındı. **Eksik:** beş şablon türü için ayrı mobil+masaüstü turu; gerçek-kullanıcı CWV (CrUX ve PSI API kotası dolu / anahtarsız) |
| 1.5 | İçerik ve dil | **BAŞLANDI, DÜŞTÜ** | Ajan kota hatasıyla rapor üretmeden sonlandı. **Uydurma denetimi dahil hiçbir çıktı yok.** En kritik boşluk |
| 1.6 | Veri bütünlüğü | **TAMAM** | EK-A.5 — 3 künyesiz iklim/uydu katmanı, 8 KAYNAKLAR boşluğu, sentetik ilçe-morfoloji bulgusu, bayat hat 0 |
| 1.7 | SEO | **BÜYÜK ÖLÇÜDE TAMAM** | EK-A.6 — site-tarama 49 bulgu, canonical 522/522, yetim 3 sayfa, yamyamlık GSC ile ölçüldü, URL yapısı temiz. **Eksik:** dış bağlantı tazeliği (md17 sağlıkta 🟡, 52/1037 örneklem) |
| 1.8 | GEO | **BÜYÜK ÖLÇÜDE TAMAM** | EK-A.7 — 13 şema tipi envanteri, JSON-LD parse hatası 0, robots/llms Tier-1 açık, FAQ örneklemi. **Eksik:** alıntılanabilirlik ve E-E-A-T derin değerlendirmesi |
| 1.9 | Güvenlik ve başlıklar | **TAMAM** | EK-A.8 — 6 başlık canlıda doğrulandı, CSP kalem kalem, sızıntı taraması temiz (2 küçük kalem) |
| 1.10 | Hukuki yüzey | **TAMAM** | EK-A.9 — KVKK/aydınlatma yok, künye eksikleri, analitik fiilen yüklü değil, yönlendirici dil envanteri |

**Özet: 6 boyut tamam · 2 boyut büyük ölçüde tamam · 1 kısmi · 1 düştü.**

Faz 2 (onarım), Faz 3 (katma değer), Faz 4 (kapanış) **hiç başlamadı**.

---

## 1d. KARAR DOSYASI

`rapor/26-08-denetim-KARARLAR-BEKLEYEN.md` **var** (2.341 bayt, commit'li).

Kalem sayısı: **3** — hepsi A bölümünde, denetim öncesinden devralınan
açık kararlar (A1 rozet "DANIŞMANLIK" · A2 logo seçimi · A3 hero kıyas
kareleri onayı). B bölümü ("denetim bulgularından doğan kararlar")
**boş** — Faz 1 kesildiği için doldurulmadı.

EK-A'daki bulgular arasında karar sınıfına girecek çok sayıda kalem var
(en az 15-20 aday); bunlar henüz karar dosyasına işlenmedi.

---

## 1e. AĞAÇTA YARIM İŞ — YOK

Çalışma ağacındaki **tek değişiklik**, kullanıcı onayı bekleyen hero
düzeltmesidir:

| Dosya | Değişiklik | Kimin |
|---|---|---|
| `src/components/anasayfa/Hero.astro` | 1 satır silinmiş (birincil CTA "Ücretsiz Ön Görüşme Alın") | **Hero işi — dokunulmadı** |
| `src/data/anasayfa-satis.js` | +26/−12 (HERO_ALT dört-sayılı cümle + dört-sayı bekçisi) | **Hero işi — dokunulmadı** |

**Denetimden kalmış değişiklik: SIFIR.** İzlenmeyen dosya da yok.
Geri alınacak bir şey bulunmadı; hiçbir şey geri alınmadı.

Gerekçe açık: denetim Faz 1'de kesildi, Faz 1 zaten "tek dosya bile
değiştirme" fazıydı. Kesilme, onarım başlamadan gerçekleşti — en temiz
kesilme noktası.

---

## 1f. DURUM RAPORU — DÖRT SORU

**· Taban alınmış mı, kıyas mümkün mü?**
EVET. `/home/suha/denetim-taban/` NOT.txt'li duruyor; çalışma ağacı dist'i
tabanla bit-eşit doğrulandı. Faz 2'nin "görünür çıktı bit-eşit" kontrolü
bugün olduğu gibi yapılabilir.

**· Hangi boyutlar bitti, hangileri kaldı?**
Bitti: mimari/kod · tasarım · erişilebilirlik (statik) · veri bütünlüğü ·
güvenlik · hukuki yüzey. Büyük ölçüde bitti: SEO · GEO.
Kaldı: **içerik ve dil (hiç çıktı yok — uydurma denetimi dahil)** ve
**performans (şablon-başına Lighthouse turu + gerçek-kullanıcı CWV)**.

**· Ağaçta yarım iş var mı, güvenli mi?**
Yarım iş yok. Ağaçta yalnız onay bekleyen hero değişikliği duruyor,
denetim ona dokunmadı. Build kırılmıyor: dist tabanla bit-eşit, sağlık
`--tam` koşumu 04:57'de 🔴0 · 🟡1 · 🟢22 verdi (tek sarı: md17 dış
bağlantı — bilinen, dış sunucu kaynaklı, taban durumu).
**Durum güvenli, temizlik gerekmiyor.**

**· Devam edilebilir mi?**
EVET, temiz bir noktadan. Devam sırası: (1) 1.5 içerik/dil ölçümü —
uydurma denetimi bu denetimin en kritik kalemiydi ve hiç yapılmadı;
(2) 1.4 performansın eksik turu; (3) EK-A'daki bulguların UYGULAMA /
KARAR ayrımıyla karar dosyasına işlenmesi; (4) Faz 2 onarımları.

**Tek risk kalemi (bu turda kapatıldı):** EK-A'daki bulgular kesilme
anında yalnız oturum belleğindeydi, diskte hiçbir izi yoktu. Bu belgeye
yazıldılar; artık oturum kaybolsa da duruyorlar.

---

# EK-A — KESİLME ANINDA ELDE OLAN FAZ 1 BULGULARI

> Bu ek, tamamlanmış ölçümlerin kayda geçirilmesidir. Sınıf önerileri
> ölçüm turundan gelir; **hiçbiri kullanıcı onayından geçmedi ve hiçbiri
> uygulanmadı.** Karar dosyasına işlenmesi ayrı adımdır.

## A.1 — MİMARİ VE KOD

**Erişilemez kod (16 dosya).** Sayfa köklerinden import grafiği çıkarıldı:
- `src/harita-3d/*.js` (10 dosya) + `src/harita-2d/maplibre-main.js` —
  yalnız `arsiv/` referans veriyor. **RED**: CLAUDE.md yol haritasında
  planlı iş (MapLibre 2D + Three.js hero), park edilmiş kaynak.
- `src/scripts/scrub-engine.js` — CSP `media-src blob:` direktifinin
  gerekçesi olarak `arac/site-saglik.mjs:1755-1757`'de kayıtlı. **KARAR**
  (silme + CSP kararına zincirli).
- `src/components/HedefSahne.astro` + `src/data/hedef-lqip.txt` — tek
  tüketici `arsiv/harita-stil/index.astro`. **KARAR**.
- `src/data/anasayfa-sorular.js` — ana sayfa `SORULAR_V2`
  (`anasayfa-v2.js`) kullanıyor; bu dosyayı yalnız
  `arac/anasayfa-asama2-denetim.mjs:15` okuyor → denetim aracı bayat veri
  setini sınıyor olabilir. **KARAR**.
- Tam yetim (repo genelinde 0 referans): `src/data/menu.ts`,
  `src/data/ruhsat-risk.js`, `src/assets/arslan-logo.svg`. **KARAR**
  (silme geri alınamaz).

**Yayına çıkan referanssız varlıklar (~12,6 MB = dist'in %28'i).**
- `public/deneyim/video/sahne1..6.webm` — **9,0 MB**, dist'te 0 referans
  (`grep -rl webm dist --include='*.html' --include='*.js'` → 0); ana
  sayfa yalnız `.mp4` + `.jpg` çekiyor. **KARAR** (silme + "webm'i geri
  devreye al" ürün kararı). Etki: yüksek.
- `public/hedef-hero.webp` — 992 KB, `hedef-hero.v2.webp` ile **bit-eşit
  kopya** (md5 `f776de2a…` ikisinde de aynı); v1'e 0 referans, v2'ye 2.
  **KARAR**.
- `public/hedef/*` (6 dosya, 1,7 MB) — dist'te 0 referans, tek tüketicisi
  erişilemez `HedefSahne.astro`. **KARAR**.
- `public/s/su-sim.js` (9,3 KB) — 0 sayfadan yükleniyor ama build kancası
  her build'de küçültüp yayınlıyor. **KARAR**. (KARARLAR §23 kararını
  yeniden açmaz; bulgu dosyanın referanssızlığıdır.)

**Tekrar eden kod (16 blok, ≥15 normalize satır).** Hepsi **UYGULAMA**:
- `goller/[slug].astro:108` ↔ `nehirler/[slug].astro:102` — 66 satır
  birebir `.kunye` CSS. Etki: orta (342 sayfa üretiyor).
- `havzalar/[slug].astro:231↔361` ve `:304↔436` — kalıp-2/eski kalıp
  dallarında il-kurum + konum SVG kopyası (43 + 31 satır).
- `vaka/[slug].astro:122↔183` — KAP zaman çizelgesi (34 satır).
- `rehberler/index.astro:120,123,136,146` ↔ `su-kanunu/index.astro:58,94`
  ↔ `havzalar/index.astro:78,91` — liste-kart stilleri, kontrast yorumu
  dahil birebir. Etki: orta (kontrast kararı üç kopyada yaşıyor).
- `HavzaKahraman.astro:157` ↔ `vaka/[slug].astro:227` (24 satır);
  JSON-LD kurulumu vaka/kuyu-tasima/[slug] arasında 15-19 satır.

**Bağımlılıklar.**
- `esbuild` **hayalet bağımlılık**: `astro.config.mjs` `sKlasoruKucult()`
  içinde import ediliyor, package.json'da bildirilmemiş; astro/vite'ın
  geçişli paketiyle çalışıyor. **UYGULAMA** (devDependencies'e kayıt;
  çıktı değişmez). Etki: orta — vite esbuild'i bırakırsa küçültme kancası
  ve deploy kırılır.
- `maplibre-gl` + `three` yalnız erişilemez modüllerce kullanılıyor,
  dist'e girmiyor (dist/_astro toplam 136 KB). **RED** (yol haritasında).
- `server/` dizini: package.json'suz, kodsuz, 67 MB yetim node_modules;
  gitignore'lu. **KARAR** (silme).

**dist dağılımı (45 MB / 523 html):** HTML 20,5 MB · webm 9,1 MB
(tamamı referanssız) · mp4 8,1 MB · webp 2,5 MB · jpg 1,25 MB · CSS 92 KB
· **JS yalnız 18 KB**.

**Content collections:** 4 koleksiyonun 4'ünde zod şeması var, şema-dışı
alan 0. `guncelleme` 2 dosyada yok — şema geri-düşümü belgeli, **RED**.
Küçük **UYGULAMA**: 4 şemada kopya olan `baslik/ozet/tarih/guncelleme`
dörtlüsü ortak `temel` objesine alınabilir.

**Astro 7 kalıntısı:** `src/pages/kullanilanlar.astro:57` hâlâ
"Astro 5 — statik site üretimi (SSG)" diyor; kurulu sürüm **7.2.7**.
**KARAR** (görünür içerik). Etki: orta — şeffaflık sayfasında yanlış olgu.
Diğer taramalar temiz: TODO/FIXME/workaround/polyfill = 0, eski Astro API
kullanımı = 0.

## A.2 — TASARIM VE DESIGN.md UYUMU

**Fantom tokenlar (tanımsız `var()`, fallback hep devrede):**
- `--kehribar-600` → `ilce-sorgu.astro:191`, `havza-riski.astro:110`;
  fallback `#875518` = `--kehribar-metin` değeriyle **AYNI**
  (`Sayfa.astro:211`). **UYGULAMA** (bit-eşit).
- `--su-800` → `ilce-sorgu.astro:162`, fallback `#08405A` palette yok.
  **KARAR**.
- `--zemin-kart-hover` → `ilce-sorgu.astro:190`, `havza-riski.astro:90`,
  fallback `#f0f4f7` palet dışı. **KARAR**.

**Ölü B2B palet bloğu — en ağır tekil bulgu.** `Sayfa.astro:217-241`:
22 renk + 3 gradyan + 2 gölge + 2 radius tanımlı, `var(--b2b-` kullanımı
repo genelinde **0**. DESIGN.md bu aileyi hiç tanımıyor; içinde `#1565C0`
(materyal mavisi), `#C62828`, `#E65100` gibi palet-dışı değerler var ve
blok her sayfaya gönderiliyor. **KARAR** (renk/palet = BÜYÜK İŞ kapısı).
Etki: yüksek.

**Bit-eşit literal → token adayları (hepsi UYGULAMA, değer aynı):**
`#DBEAF4` = `--kopuk` → `HavzaPaneli.astro:193`, `durumum/index.astro:164`,
`hangi-kurum/index.astro:243`, `kuyu-tasima.astro:626`,
`durumum/[persona].astro:257` · `#E9F0F4` = `--krem` →
`kuyu-tasima.astro:624,627`, `durumum/[persona].astro:255,258`,
`harita.astro:239` · `#132A3F` = `--murekkep-900` → `harita.astro:255` ·
`rgba(19,42,63,0.14)` = `--cizgi` (4 yerde) · `rgba(78,134,168,0)` →
`rgba(46,126,160,0)` (tam-şeffaf durak; premultiplied interpolasyon
nedeniyle render değişmez) → `Sayfa.astro:440,443`, `stil-pilot.astro:146`.
**Not:** `harita.astro` kendi `:root`'unda bu tokenları taşımıyor — o
sayfada token'a çekmeden önce tanım zinciri doğrulanmalı.

**Palet dışı renkler (KARAR):** odak halkası `#7fd0ef` ×3
(`PaylasilanMenu.astro:130`, `anasayfa-v2.css:808`, `index.astro:142`) —
DESIGN.md §9 "odak köpük" der, bu ne köpük ne ışıma · **CanliSayi
fallback'leri canlı render ediliyor**: bileşen `nerede-su-cikar.astro`'da
da kullanılıyor ama `--v2-*` tokenları yalnız `anasayfa-v2.css`'te tanımlı
→ o sayfada fiilen `#2b6a86`/`#dfe7ec`/`#566`/`ease` çiziliyor
(`CanliSayi.astro:62-66,80,92`), etki yüksek · `#C2D6E4`, `#F6EDDE`,
`#e0e0e0`, `#D3E2ED`, `#dcecf5`, `#93AFC4`, `#12293a` · `rgba(72,98,122,…)`
= **eski** `--murekkep-500` türevleri (M15'te taban koyulaştı, türevler
eski değerde kaldı — 5 konum).

**Hareket:** sözlük dışı easing 14 satır / 6 dosya. Öne çıkan:
`AltBilgi.astro:138` `color 0.2s ease` (site geneli footer),
`PaylasilanMenu.astro:62` kendi `cubic-bezier(0.23,1,0.32,1)`,
`public/s/imlec.js:46,53` **taşmalı yay eğrileri** (`0.34,1.56` /
`0.34,1.8`) — "su aniden fırlamaz" ilkesiyle karakter çelişkisi. Hepsi
**KARAR**. `hareket.css:6-7`'deki istisna beyanı "landing hero +
/deneyim/" diyor ama `anasayfa-v2.css` tüm ana sayfayı kapsıyor —
istisnanın yazılı kapsamı ile fiilî kapsam ayrışık.
Olumlu: 18 `prefers-reduced-motion` bloğu, dekoratif dikkat-dağıtıcı
hareket bulunmadı.

**DESIGN.md belge kayması:** §2 "Landing İstisnası" tablosu eski hero
`:root`'unu listeliyor; bugünkü landing v0 paletini kullanıyor, tablodaki
değerler artık yalnız `harita.astro:174-177`'de yaşıyor. **KARAR**
(belge güncellemesi).

**Ölçek envanteri:** 53 farklı sabit font-size + 14 clamp() = **60+ değer**;
yakın-mükerrer kümeler (0.92-0.98 arası 7 komşu değer; 1.02-1.18 arası 10).
DESIGN.md sayısal ölçek tanımlamıyor, `--fs-*` tokenı yok. **KARAR**.
**Breakpoint envanteri:** 20 farklı sorgu; çekirdek 1023px×13, 560px×11,
640px×7 tutarlı, ama `860 vs 859`, `639 vs 640`, `559 vs 560` karışık.
**KARAR** (düşük-orta).

## A.3 — ERİŞİLEBİLİRLİK (523 sayfa, statik)

**Temiz çıkanlar (kanıtlı):** 535 `<img>`'de alt eksik **0**, anlamsız alt
**0**, boş alt 7 (hepsi `role="tab"` + `aria-label`'lı butonların içindeki
dekoratif kareler — doğru desen) · 1.359 inline `<svg>`'nin tamamı
`aria-hidden` kapsamında · h1>1 **0**, atlanan seviye yalnız `/harita/`
(kapanmış karar §9) · 10 form öğesinin 10'unda etiket, adsız buton/link
**0**, pozitif `tabindex` **0** · `lang="tr"` **523/523** ·
`:focus-visible` 26 yerde, alternatifsiz `outline:none` **0**.

**Bulgu E-1 — skip-link sitede hiç yok.** 523 sayfanın tamamı;
`grep -rlE 'ceri[gğ]e atla|skip-link'` → 0. WCAG 2.4.1 (A). Axe'in
varsayılan setinde best-practice olduğu için md15'in 100/100'ü bunu
yakalamıyor — sağlığın ölçmediği boşluk. **KARAR** (odaklanınca görünür
öğe = görsel kimlik).

**Bulgu F-1 — ana sayfada `<main>` landmark'ı yok.** `dist/index.html`'de
`grep -c '<main'` → 0; diğer 518 sayfada var. **UYGULAMA** (görünmez
semantik onarım, sitenin en çok ziyaret edilen sayfası şablonlarla
tutarsız).

**Tarayıcısız ölçülemeyenler:** gerçek odak sırası ve klavye tuzağı, odak
stillerinin görsel yeterliliği, JS ile enjekte edilen aria durumları,
`prefers-reduced-motion`'ın fiilî davranışı, ekran okuyucu okuma sırası.

## A.4 — PERFORMANS (KISMİ)

**Alınan ölçümler:**
- md9 (sağlık, 04:57 koşumu, masaüstü/mobil): `/` 99/92 ·
  `/nerede-su-cikar/` 99/94 · `/arsiv/` 99/88 · **`/harita/` 94/72** ·
  `/havzalar/sakarya/` 98/91 · `/rehberler/kuyu-ruhsati/` 98/82 ·
  `/durumum/` 99/85 · `/goller/tuz-golu/` 99/88 · `/ilce-sorgu/` 98/85
  (14 sayfa).
- Canlı Lighthouse (yerel koşum, mobil, `https://suharitasi.com/harita/`):
  perf 72 · **LCP 8,3 sn** · CLS 0 · TBT 0 ms · FCP 2,5 sn. LCP tek
  başına en zayıf metrik; sayfa 2.944×1.648 `hedef-hero.v2.webp`
  (992 KB) preload ediyor (`harita.astro:168,274`).
- CLS kaynağı taraması: 523 sayfada boyutsuz `<img>` **tek 1 adet** —
  `harita.astro:274`'teki hero (`width`/`height` yok; doğal ölçü
  2944×1648 ölçüldü). 6 video etiketinin 6'sında `width`+`height` var.
  Ölçülen CLS zaten 0 olduğundan bu potansiyel kalem.
- Font: Google Fonts `display=swap` + `preconnect` ×2, yerel woff yok.
- JS yükü: toplam 18 KB (en büyük `ilce-sorgu` 5,9 KB, `su-sim.js`
  5,7 KB — o da referanssız, bkz. A.1).
- Video: `/` sayfasında 1 `preload="metadata"` + 5 `preload="none"`.

**Eksik kalanlar:** beş şablon türü için ayrı mobil+masaüstü 3-tur medyan;
gerçek-kullanıcı CWV — **CrUX API anahtarsız** (hesap açma yasak),
**PSI API günlük kotası dolu (HTTP 429)**. Bu iki kaynak olmadan
saha verisi ölçülemez; laboratuvar verisiyle yetinildi.

## A.5 — VERİ BÜTÜNLÜĞÜ

**KAYNAKLAR.md'de kaydı olmayan veri (hepsi UYGULAMA — veri zaten depoda):**
- `data/canli/chirps.json` + `data/arsiv/chirps/` (10 NetCDF ~735 MB) —
  iç künye "CHIRPS v2.0 (UCSB/CHG), CC BY 4.0"; KAYNAKLAR'da "CHIRPS"
  hiç geçmiyor. **CC BY = atıf zorunlu**, merkezi kayıtta görünmüyor.
- `data/canli/jrc-yuzey-suyu.json` — "JRC Global Surface Water, CC BY 4.0",
  KAYNAKLAR'da yok.
- `data/canli/era5-toprak.json` — "ERA5-Land (ECMWF/Copernicus)", kayıtlı
  erişim koşulu merkezi kayıtta yok.
- `data/arsiv/dsi-yas/` 15 xlsx (2024-seti + **2019-seti**) ve
  `havza-yas.json` hiçbir girişte adlandırılmamış.
- `veri/potansiyel/zenginlestirme.json` + `ilce-morfoloji.json` —
  giriş 11 dosya sayıyor, dizinde 13 var.
- `data/kamu/` 5 dosya (`su-birimleri.json` 155 kayıt sağlık md11'de
  sayılıyor) — katman başlığı yok; ayrıca `hangi-kapi.json`'ın atfı
  Apilex'e işaret ediyor ama dosya kaynağın doğrudan mevzuat metni
  olduğunu söylüyor → **atıf yanlış yöne gidiyor**.
- `data/lead/` 2 dosya — `nace-ek2.json` **OCR çıkarımı** (tesseract
  5.3.4, sha256'lı kaynak PDF); OCR hata şerhi yalnız dosya içinde.

**Bayat KAYNAKLAR kayıtları (UYGULAMA):** `harita/isaretler.js` yolu ölü
(gerçek yer `src/harita-3d/isaretler.js`) · EPİAŞ girişi "İlk kayıt: henüz
yok" diyor ama `baraj.json` `kayitBaslangici: 2026-07-16`, arşivde 969
dosya · mevzuat arşivi girişi 2 dosya sayıyor, dizinde 3 var.

**Üçlü künye (kaynak+lisans+tarih) eksikleri:** il-kurum, SYGM HKEP, SYGM
kuraklık, Apilex, Su Kanunu takip kayıtlarında **lisans/kullanım satırı
yok**; CHIRPS/JRC/ERA5/kamu/lead katmanlarında üçlünün tamamı yok.

**KARAR adayı — sentetik veri sunumu.** `veri/potansiyel/ilce-morfoloji.json`
kendi künyesinde "GERÇEK ilçe ölçümü DEĞİLDİR; il düzeyi GLO-90 DEM'den
ilçe ismiyle tohuma bağlı ±%15 deterministik varyasyonla türetildi" diyor
(948 ilçe). `src/pages/ilce-sorgu.astro:14` bunu import ediyor ve
`:347-348`'de "tahmini su doygunluk derinliği: X–Y metre" cümlesi
üretiyor. Sayfada genel "TEMSİLÎDİR" şerhi var (`:151`) ama sentetik
türetme ne sayfada ne KAYNAKLAR'da açıklanıyor; kaynak listesi Copernicus
DEM'i gerçek kaynak gibi sayıyor. **KARAR** (içerik/hukuk sınırı).

**Veri hatları:** baraj · GRACE · su-izleme · RG · NHYP · site-saglik ·
yedek · IndexNow → **bayat hat 0**, hepsi beklenen aralıkta. GSC haftalık
henüz ilk gerçek koşumunu bekliyor (25-26.08'deki "BAŞARISIZ" satırları
falsifikasyon testleri). Not: ağaç kirli olduğu için su-izleme "pull
ertelendi" + exit=3 üretiyor — kirlilik sürerse tekrarlar (bilgi).

**Kapsama özeti:** data/canli %43 · data/kök %100 · data/kamu %0 ·
data/lead %0 · data/arsiv ~%97,5 · veri/potansiyel %85 · kaynak/ %100.

## A.6 — SEO

`node arac/site-tarama.mjs dist` → 523 sayfa, **49 bulgu** (K:5 · O:28 · D:16):

| Şiddet | Kural | Sayfa | Not |
|---|---|---|---|
| K | canonical-yok | 2 | `/404/`, `/stil-pilot/` — ikisi de noindex |
| K | meta-desc-yok · icerik-dom-disi | 1 | `/404/` (128 karakterlik gövde) |
| K | h1-yok | 1 | `/harita/` — **kapanmış karar §9** |
| O | title-uzun (>60) | 16 | 11'i [SERDAR-HUKUK] karar kalemi, 5'i uzun sektör adı — **md16 tabanında kabul edilmiş** |
| O | oz-cevap-uzun (>280) | 12 | 282-298 karakter bandı |
| D | soru-baslik-yok | 4 | md16 tabanında |
| D | og-eksik · json-ld-yok | 3+3 | `/stil-pilot/`, `/harita-pilot/` (noindex) |
| D | sitemap-disi | 3 | `/harita-pilot/`, `/kullanilanlar/`, `/stil-pilot/` |

**Bağımsız doğrulamalar:** canonical **522/522** doğru (yalnız
`/stil-pilot/` yok, noindex) · sitemap ↔ dist farkı yalnız 3 noindex
sayfa · URL yapısında büyük harf/alt çizgi/boşluk **0** · **title tekrarı
dist'te 0** (sağlıktaki `title-tekrar×1` canlı ölçümden, yerel build'de
üremiyor).

**İç bağlantı grafiği (522 sayfa):** yetim (0 iç link) **3** — üçü de
noindex pilot/yardımcı sayfa, gerçek yetim yok. Zayıf (1 iç link) 2:
`/goller/gokceada-baraj-golu/`, `/goller/gol-1/`.

**Latin-dışı adlı sayfalar (6).** OSM verisinden gelen sınır-ötesi su
kütleleri Türkçe sitede kendi alfabesiyle yayınlanıyor:
`/goller/gol-1/` "گل ناور" · `/nehirler/nehir-1/` "Велека" ·
`/nehirler/nehir-2/` "نهر عفرين" · `/nehirler/mutludere/` "Резовска река -
Mutludere" · `/nehirler/meric/` "Έβρος/Meriç/Марица" · `/nehirler/aras-2/`
"Aras / Արաքս". Kaynak: `src/data/tr-goller.json` (279 kayıttan 29 latin
dışı ad), `src/data/tr-nehirler.json` (131'den 41). **KARAR** (görünür
içerik + veri kararı; 24.08'de sınır-ötesi öznitelik temizliği yapılmıştı
ama adlar kaldı).

**Yamyamlık (GSC, 28 gün, sc-domain:suharitasi.com):** yalnız bilinen
Ergene ailesi — "ergene havzası harita" `/havzalar/` 110 gösterim ↔
`/havzalar/meric-ergene/` 90; "ergene havzası nerede harita" 62 ↔ 10;
üçüncü satır 1 gösterimlik gürültü. **Zaten izleme kalemi** (§30/4),
yeniden açılmadı.

**Kırık bağlantı:** iç 0 (sağlık md6: 91 benzersiz link). Dış: md17 🟡 —
19 bağlantı yanıt vermedi, **ölü 0**, 52/1037 örneklem. Tam tarama
yapılmadı.

## A.7 — GEO

**Şema envanteri (523 sayfa, parse hatası 0):** Organization 520 ·
Person 520 · WebSite 520 · BreadcrumbList 519 · FAQPage 413 ·
BodyOfWater 342 · Article 92 · Observation 25 · WebPage 7 · ItemList 4 ·
Dataset 2 · HowTo 2 · DataCatalog 1.

**AI erişimi:** `robots.txt` Tier-1 botların **hepsini açıkça açıyor**
(Googlebot, Bingbot, Applebot, GPTBot, OAI-SearchBot, ChatGPT-User,
ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot, Perplexity-User,
Google-Extended, Applebot-Extended, GoogleOther, Amazonbot, FacebookBot);
yalnız Bytespider ve CCBot engelli — ikisi de gerekçeli kullanıcı kararı.
`llms.txt` build'de üretiliyor (`astro.config.mjs:93`), 546 satır, her
girdi başlık + öz-cevap taşıyor.

**FAQ şeması ↔ görünür metin (5 sayfa örneklem).** Havza sayfalarında
FAQ **soruları** görünür DOM'da birebir yok (cevaplar öz-cevap ve YAS
bandında var; sorular H1/H2'de yeniden ifade edilmiş). Kaynak:
`havzalar/[slug].astro:186-213` — sorular ölçülen sorgu kalıplarından
üretiliyor, cevaplar veriden. Bu **§29 kararının bilinçli sonucu**;
bulgu olarak değil şerh olarak kaydedildi. Rehber/göl/vaka örneklerinde
uyuşmazlık çıkmadı.

**Eksik:** sayfa-başına alıntılanabilirlik puanlaması ve E-E-A-T derin
değerlendirmesi yapılmadı.

## A.8 — GÜVENLİK VE BAŞLIKLAR

**Canlı doğrulama (`curl -sI https://suharitasi.com/`), 6/6 başlık
`public/_headers` ile uyumlu:** HSTS `max-age=31536000; includeSubDomains;
preload` · `X-Content-Type-Options: nosniff` · `X-Frame-Options: DENY` ·
`Referrer-Policy: strict-origin-when-cross-origin` ·
`Permissions-Policy: camera=(), microphone=(), geolocation=()` · CSP.

**CSP kalem kalem:** `default-src 'self'` · `object-src 'none'` ·
`base-uri 'self'` · `frame-ancestors 'none'` (en sıkı değerler) ·
`script-src` ve `style-src`'de **`unsafe-inline`** (Astro'nun sayfa-içi
`<style>`/`<script type="module">` üretimi buna dayanıyor) — **KARAR**
(nonce/hash geçişi build mimarisi kararı) · `form-action` direktifi
**yok** (CSP3'te default-src'den türemez; tek form `mailto:` olduğu için
pratik etkisi yok) — **KARAR/not** · `blob:` izinleri sahne motoru için
belgeli.

**CSP ihlali üreten satır: 0.** 523 sayfada `on*=` olay özniteliği **0**;
inline script/style'ların hepsi mevcut izinlerle çalışıyor.

**Dış kaynak:** ağ isteği üreten tek üçüncü taraf **Google Fonts**
(`fonts.googleapis.com` + `fonts.gstatic.com`). Dış `<script src>`,
`<img>`, `<iframe>`: **0**. Çıkış linkleri (CSP dışı): doi.org 1401 ·
arslanhukuk.tr 1053 · resmigazete 569 · dergipark 292 · **hdl.handle.net
205, bunların 158'i `http://`** → **UYGULAMA** (https'e çevirme, düşük).

**Sızıntı:** `.env` git'te değil (`.gitignore:24,52`, izin 600);
`TELEGRAM_BOT_TOKEN`, `EPIAS_*`, `CF_DEPLOY_HOOK` değerleri izli
dosyalarda **0**, `git log -S` ile geçmişte de **0**. dist'te görünür tek
e-posta `bilgi@suharitasi.com` (bilinçli CTA).
İki küçük kalem, ikisi de **KARAR**: `TELEGRAM_CHAT_ID` düz metin olarak
4 belgede (GUNLUK, KARARLAR, SIRADAKILER, rapor/25-08-alarm-teshisi) —
token'sız kullanılamaz ama kanal kimliğini ifşa eder · kişisel e-posta
`avserdararslan@hotmail.com` 3 araç betiğinde (`akademik-kunye.py:14,21`,
`rg-nobetci.py:45`, `rg-sayi-cikar.py:53`) kibar-scraping User-Agent'ı
olarak — dist'te yok.
Yanlış-pozitifler elendi: `izleme/arsiv/*/ham.html` içindeki `AIzaSy…`
DSİ'nin kendi sitesinin arşivlenmiş public tarayıcı anahtarı.

## A.9 — HUKUKİ YÜZEY (tamamı KARAR, yalnız tespit)

- **KVKK / aydınlatma / gizlilik / çerez metni: sitede yok.** 523 sayfada
  bu adlarda sayfa yok, sitemap'te 0 eşleşme, footer'da link yok. Tek
  kelime eşleşmesi `/vaka/meysu/`'daki "Kamuyu Aydınlatma Platformu"
  (alakasız). Bağlamsal olgu: çerez yok, analitik yüklü değil, tek form
  `mailto:` ile çalışıyor — sunucuya kişisel veri gönderen uç yok.
- **Künye — ne var:** içerik sorumlusu adı ve sıfatı ("Hukuki içerik:
  Av. Serdar Arslan — Arslan Hukuk Bürosu"), `bilgi@suharitasi.com`, büro
  sitesi linki, yöntem/kaynak politikası, güncelleme taahhüdü, sorumluluk
  sınırı cümlesi ("bilgilendirme amaçlıdır; hukuki görüş veya tavsiye
  niteliği taşımaz"). **Ne yok:** fiziki adres, telefon, ticaret unvanı,
  baro sicili, yer/içerik sağlayıcı beyanı. (Hukuki yorum yapılmadı.)
- **Analitik:** Cloudflare Web Analytics beacon'ı **ne dist'te ne canlıda
  var** (523 sayfada `cloudflareinsights` = 0). CSP'deki iki Cloudflare
  izni şu an atıl. Dolayısıyla çerez bildirimi sorusu şu an konusuz.
  **NOT:** bu, SIRADAKILER'deki "Web Analytics çalışıyor (29.07 panelde
  7 ziyaret)" kaydıyla çelişiyor gibi görünüyor — 29.07 kaydının kendi
  şerhi de "bu sunucudan yapılan ölçüm beacon'ı görmüyor" diyordu.
  Çelişki bu turda çözülmedi, kayda geçirildi.
- **Yönlendirici dil envanteri:** "yapmalısınız" → 42 sayfa, hepsi
  `durumum/*` şablonunun tek cümlesi ("İlk adımda ne yapmalısınız?" +
  3 genel adım + "Somut usul/süre için ilgili mevzuat esastır").
  "başvurmalısınız / hakkınız var / dava açın / itiraz edin / dava alırız
  / danışın / öneririz / tavsiye ederiz" → **0**. Sınır vakaları (envanter,
  yorumsuz): `durumum/*` CTA "Uyum planlaması için iletişim … ulaşın" ·
  ana sayfa "Ön görüşme talebi" · menüde "İletişim / Uzman Görüşü" ·
  footer "Arslan Hukuk Bürosu güvencesiyle".

---

## EK-B — ÖLÇÜM DOSYALARI (diskte duruyor)

| Dosya | İçerik |
|---|---|
| `/home/suha/denetim-taban/dist` + `NOT.txt` | Faz 0c tabanı (bit-eşit doğrulandı) |
| `cikti/brief/2026-08-27-tam-denetim.md` | Orijinal brief (değiştirilmedi) |
| `cikti/brief/2026-08-27-tam-denetim-duzeltilmis.md` | Düzeltilmiş brief + netleştirme eki |
| `cikti/denetim/brief/2026-08-27T04-4*.md` | Brief denetçisi 3 turu (1 ENGEL → 0 ENGEL / 4 UYARI) |
| `cikti/denetim/site-saglik/kosu-tam-son.json` | 04:57 `--tam` koşumu |
| scratchpad `site-tarama.md`, `taban-build.log`, `taban-saglik-tam.log` | Faz 1 ham çıktıları (geçici dizin — kalıcı değil) |
