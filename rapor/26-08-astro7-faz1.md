# Astro 5.18.2 → 7.2.7 yükseltmesi — Faz 1: build'i geçirmek (26.08.2026)

BÜYÜK İŞ. Brief: `cikti/brief/astro7-faz1-build.md` (orijinal, değiştirilmedi) ·
düzeltilmiş: `cikti/brief/astro7-faz1-build-duzeltilmis.md`.
COMMIT YOK, PUSH YOK — ağaç yükseltilmiş haliyle bırakıldı (brief md. 6).

## 0. Brief denetimi + düşman geçişi + amaç özeti (ön kapı)

**Denetim:** `arac/brief-denetci.mjs` ilk tur: 1 ENGEL + 4 UYARI. Kural 4e
gereği yalnız EKLEME ile düzeltildi (T7 uydurma-yasağı kapısı 3. maddeye,
T6 netleştirmeleri 6. maddeye); ikinci tur: **0 ENGEL, 1 UYARI**
(denetim raporları: `cikti/denetim/brief/2026-08-26T12-32-07Z.md` ve
`...12-32-45Z.md`).

**Kalan UYARI (T1):** `dist/data/arsiv/baraj` — bağlam belirsizliği.
Netleştirme briefte: bu yol repoda duran dizin değil, hatalı çözülen bir
OKUMA yoludur; 3. adımda ölçüldü (aşağıda §4: `src/data/vitrin.js` KOK
türetimi).

**Düşman geçişi D1-D4:**
- D1 çelişen şart: Adım 0'ın "ağaç kirli olmalı" öngörüsü gerçekle
  çelişti — ağaç TEMİZ ölçüldü (astro@latest kurulumu bu ağaçta yoktu).
  DUR şartı "bunlar dışında değişiklik varsa" idi; başka değişiklik yok,
  temizlik 1a'yı kendiliğinden sağladı. Sapma olarak kaydedildi, iş sürdü.
- D2 geçemeyecek test: 5c "diff'le" şartı hash'li varlık adları yüzünden
  hiçbir zaman boş diff veremezdi — kriter "fark varsa göster ve açıkla"
  olduğundan FAIL üretmez; hash-normalize + görünür-metin ölçümüyle
  ölçülebilir kılındı.
- D3 boş referans: `/home/suha/astro5-referans/` iş başında yoktu — 1c'de
  üretildi, şart sağlandı.
- D4 denetlenemez şart: yok; tüm bitti-tanımı kalemleri ölçülebilir.

**Amaç özeti (3b):** Amaç: Astro 7'de build'i, Astro 5 referansıyla
içerik-eşdeğer geçirmek. Dokunulmazlar: çıktı içeriği, tasarım, veri,
commit/push. Bitti-tanımı: brief md. 7. Kanıtlar: ham build logları
(scratchpad), 523-sayfa otomatik kıyas ölçümleri, bu rapor.

## 1. Adım 0 — konum kapısı (kanıt)

```
pwd  → /home/suha/projeler/suharitasi
git remote -v → origin https://github.com/suharitasi/suharitasi.git
node -v → v22.23.2
git status --porcelain → (BOŞ — temiz)
```
SAPMA: brief "package.json kirli olmalı" diyordu; ağaç temizdi ve hem
package.json hem node_modules astro **5.18.2**'deydi. Yani önceki
astro@latest kurulumu bu çalışma ağacında durmuyordu. Bu, 1a'daki geri
dönüşü gereksiz kıldı (zaten Astro 5'teydik); DUR gerektiren "başka
değişiklik" yoktu.

## 2. Adım 1 — referans (Astro 5, Node 22)

**1b — Node 22'de Astro 5 ÇALIŞIYOR: EVET.** `npm run build` exit 0,
"522 page(s) built in 8.11s" (log: scratchpad `build-astro5.log`).
Geri dönüş yolu AÇIK; Node 20'ye dönüş GEREKMEZ.

**1c — referans:** `dist/` → `/home/suha/astro5-referans/` (depo dışı,
`cp -a`). İş sonunda yerinde duruyor.

**1d — referans ölçüleri:**
| Ölçü | Değer |
|---|---|
| HTML sayfa | 523 (522 index.html + 404.html) |
| sitemap.xml URL | 519 |
| dist toplam | 42.662.149 bayt (45M) |
| /arsiv/ verisi | "23 ilan pasajı (1966-2014)" · 24 GG.AA.YYYY tarih düğümü · 53 `<li>` |

**1e — lightningcss ':global' uyarısı Astro 5'te ÇIKMIYOR.** Astro 5
esbuild css minify kullanıyor ve ondan 2 farklı uyarı çıkıyor
(`css-syntax-error`: kural dışına taşmış `display: block; padding...`
bloğu — kaynağı §7'de). Yani ':global' uyarısı 7'ye özgü YENİ bir
uyarıdır; ama işaret ettiği kusur ESKİ (§7).

## 3. Adım 2 — yükseltme ve ilk hata

`npm install astro@latest` → **astro@7.2.7**. İlk build beklenen hatayla
düştü: `ENOENT: scandir '/home/suha/projeler/suharitasi/dist/data/arsiv/baraj'`,
hata yığını `dist/.prerender/chunks/vitrin_*.mjs:321`.

**Kök neden (ölçüldü):** `src/data/vitrin.js:26`
`KOK = fileURLToPath(new URL('../../', import.meta.url))` — bundle'ın
dizin derinliğine bağlı. Astro 5 chunk'ı `dist/chunks/` altında koşuyordu
(`../../` = proje kökü); Astro 7 `dist/.prerender/chunks/` altında koşuyor
(`../../` = `dist/`). Yol bir seviye kaydı, `dist/data/arsiv/baraj` doğdu.

## 4. Adım 3 — kapsam taraması (düzeltme ÖNCESİ, grep ile)

Build sırasında dosya sistemi okuyan kaynak dosyalar (readdirSync ·
readFileSync · statSync · existsSync tam taraması, `src/` + astro.config):

| Yer | Yol kuruluşu | Durum |
|---|---|---|
| `src/data/vitrin.js:26` | `import.meta.url` + `../../` | KIRIK (Astro 7'de dist'e çözülür) |
| `src/data/kullanilanlar.js:18` | `import.meta.url` + `../..` | KIRIK (aynı desen) |
| `src/data/gol-nehir-cografya.js:21-22` | cwd-göreli (`'src/data/...'`) | SAĞLAM — dosyanın 18-20. satırındaki yorum bu tuzağı 14.07'de ölçmüş |
| `src/data/gol-nehir.js:20-21` | cwd-göreli | SAĞLAM |
| `src/data/guncellik.js:16` | cwd-göreli (çağıranlar göreli yol verir) | SAĞLAM |
| `astro.config.mjs` (sitemap/llms/surum/s-kucult entegrasyonları) | `astro:build:done`in verdiği `dir` parametresi | SAĞLAM — bilinçli dist işlemi, build SONRASI kancası |
| `arac/*.mjs` (dist-sun, seo-audit, site-saglik...) | dist okur | KAPSAM DIŞI — build'in parçası değil, build-sonrası araçlar |

"Doğrulanmadı" kalemi: yok — tüm fs-okuyanlar yukarıda; grep'in
bulamadığı şüpheli yer kalmadı.

## 5. Adım 4 — düzeltmeler (sırayla, her biri build ile doğrulandı)

**5.1 KOK düzeltmesi (2 dosya).** `vitrin.js` ve `kullanilanlar.js`:
`KOK = process.cwd()` (projenin `gol-nehir-cografya.js`'te belgelenmiş
mevcut deseni). Kullanılmayan `fileURLToPath`/`dirname` importları
temizlendi. → Build GEÇTİ: exit 0, 522 sayfa, sitemap 519.

**5.2 Boşluk-yutma (Astro 7 davranış değişikliği).** 523 sayfanın
görünür-metin kıyası (hash-normalize + etiket-soyma + boşluk-normalize,
scratchpad `tumfark.py`) İLK build'de **453 sayfada** fark buldu. Kök
neden: Astro 7, satır sonundaki `{ifade}` ile sonraki satırın metni
arasındaki (ya da tersi yöndeki) boşluğu compress sırasında tümüyle
atıyor; Astro 5 satır sonunu koruyordu. Örnek: "Batı Karadeniz Havzası
rezerv ve doluluk verisi" → "Havzası**rezerv**" (bitişik!).
Düzeltme ilkesi: Astro 5 çıktısındaki boşluk `{' '}` ile AÇIK hale
getirildi (kod tabanında zaten kullanılan deyim, örn. [il].astro:162) —
kelime eklenmedi, içerik değişmedi. Dokunulan şablonlar:

| Dosya | Yer | Ref deseni (yutulan) |
|---|---|---|
| `src/pages/goller/[slug].astro:99` | `{havza.ad}` → "rezerv..." | "Havzası rezerv" (247 sayfa) |
| `src/pages/nehirler/[slug].astro:93` | aynı | (95 sayfa) |
| `src/pages/kuyu-ruhsati/[il].astro:139` | "km²" → ", yüzey..." | "km² ," (81 il ×N) |
| `src/pages/kuyu-ruhsati/[il].astro:231` | `{barajKaynak}` → "verisidir." | "Platformu verisidir." |
| `src/pages/havzalar/[slug].astro:268,398` | `{havzaIl.not...}` → "Büyükşehir" | "girebilir. Büyükşehir" (25 havza) |
| `src/pages/arsiv.astro:84` | "içeren" → `{KAPATMA_OZET.sayi}` | "içeren 23" |
| `src/pages/hangi-kurum/index.astro:130,131` | "·" → `{dagilim...}` | "· 5", "· 1" |
| `src/pages/kullanilanlar.astro:96-106` | 10 sınır | "planından 472" vb. |
| `src/components/HavzaPaneli.astro:96` | `{potYil}` → "(yüzey" | "2024 (yüzey" |
| `src/components/IlKurumTablosu.astro:78` | "Derleme:" → `{derlemeTarihi}` | "Derleme: 2026-07-14." |

İterasyon ölçümü: 453 → 22 → 7 → **boşluk-yutma 0**.

**5.3 getCollection sıra değişimi.** Astro 7'de `getCollection` dönüş
sırası id-alfabetik; Astro 5'te content-layer store'unun ekleme sırasıydı.
Etkilenen: `havzalar/[slug].astro` `kesisenHavzalar` (ortak-il eşitliğinde
sıra koleksiyon sırasına yaslanıyordu) ve `stil-pilot.astro` ilgili-kart
listesi. **Falsifikasyon deneyi:** kaynak yamaları stash'lenip Astro 5
yeniden kuruldu, art arda iki build alındı: A=B (kendi içinde
deterministik) ama **ikisi de sabahki referanstan FARKLI** (antalya,
konya-kapali, dogu-karadeniz satırları). Yani Astro 5'in eşitlik sırası
`.astro/` store'unun tarihsel durumuna bağlıydı ve store tazelenince
Astro 5'in kendisi bile referans sırayı üretemiyor — referans eşitlik
sırası yeniden-üretilebilir bir "içerik" değildi (canlı sitedeki sıra da
Cloudflare'ın kendi build'inden geldiği için muhtemelen yerel referansla
zaten birebir değildi). Kalıcı çözüm: eşitlik AÇIKÇA bozuldu —
`.sort((a,b) => (b.ortak - a.ortak) || (a.id < b.id ? -1 : 1))`.
Bundan sonra sıra sürüm/ortam/store'dan bağımsız.

## 6. Adım 5 — doğrulama (referansla kıyas, ham ölçümler)

**5a — sayfa sayısı ve listesi:** 523 = 523; `find`-listeleri
**BİREBİR AYNI** (diff boş). Eksik/fazla sayfa YOK.

**5b — sitemap:** 519 = 519 URL; `<loc>` listeleri **BİREBİR AYNI**.

**5c — içerik kıyası.** Beş-sayfa diff'i, hash'li varlık adları ve
minify farkları yüzünden satır-diff'iyle anlamsızdı; onun yerine 523
sayfanın TAMAMINDA üç katmanlı ölçüm yapıldı:
- **Görünür metin** (etiketler soyulmuş, boşluk-normalize): fark kalan
  sayfa **6/523**, tamamı açıklamalı:
  - `havzalar/{antalya, dogu-akdeniz, konya-kapali, sakarya}` — kesisen-
    havza eşitlik sırası (§5.3). Üçünde yalnız SIRA değişti (aynı 5 link);
    `konya-kapali`de 5-kesiti değişti: eşit ortak-il sayısında referans
    **Burdur**'u, yeni sıralama alfabetik gereği **Akarçay**'ı gösteriyor
    (ikisi de doğru veri; hangi 5'in görüneceği eşitlik kuralına bağlı).
  - `stil-pilot` — noindex+sitemap-dışı pilot sayfa; 4 ilgili-rehber
    kartı aynı, sırası koleksiyon sırasıyla değişti. Kabul edildi.
  - `su-kanunu/taslak-takibi` — tek karakter: `”Su → “Su`. Kaynak md'de
    düz tırnak var; Astro 5 smartypants YANLIŞ yön (kapatan) üretiyordu,
    Astro 7 doğru yön (açan) üretiyor. İyileşme; kabul edildi.
- **JSON-LD (application/ld+json):** 523/523 sayfada **BİT-EŞİT**.
- **Satır içi JS:** 521 sayfada bayt farkı — JS küçültücü değişti
  (esbuild → oxc): `const→var`, `"→\``, değişken adları. Aynı kaynak
  scriptler, davranış eşdeğer; öz-denetimde konsol 0 (aşağıda).
- Etiketler arası boşluk/satır-sonu yazımı da değişti (`> <head>` →
  satır kırılımı vb.) — DOM eşdeğeri, görünür etkisi yok.

**5d — /arsiv/ veri tablosu:** "hatasız ama boş" senaryosu ELENDİ:
"23 ilan pasajı bulundu (1966-2014)" metni var; 24 tarih düğümü listesi
referansla **birebir aynı** (`['17.04.2014','08.04.2014','03.06.2011',...]`);
53 `<li>` = 53; 82 `ar-kapatma` düğümü = 82. Gerçek kayıt örneği
(dist'ten): "Bu kayıtların hangi ile ait olduğu doğrulanmadı; il eşlemesi
yapılmamıştır. Kayıtlar Resmî Gazete arşivinin taranmasıyla derlenmiştir..."

**5e — lightningcss uyarısı:** 1e'ye göre **YENİ** (Astro 5'te yok) ama
**kusur eski, bozulma yok**:
- Uyarının hedefi `src/layouts/Sayfa.astro:362`:
  `is:global` blok İÇİNDE `:global()` kullanımı — anlamsız, derleyici
  dönüştürmüyor. Geçersiz seçicili kural `.sv-hero-slot :global(.gorsel-slot){height:100%}`
  **İKİ sürümün çıktısında da AYNEN var** (ref `arsiv.DzdZHCh4.css`, yeni
  `SayfaBasi.O9QLLH85.css`); tarayıcı iki tarafta da bu kuralı atar.
  Davranış farkı: SIFIR. lightningcss yalnızca sesli söylüyor.
- Astro 5'in esbuild uyarılarının hedefi `src/components/PaylasilanMenu.astro:133-135`:
  seçicisi olmayan yetim bildirimler (`display: block; ... #C0883A...`) —
  kaynak kusuru. Astro 5 bu çöpü CSS'e aynen basıyordu; lightningcss
  DÜŞÜRDÜ (ölü/geçersiz CSS temizliği; iki durumda da tarayıcıda hiç
  uygulanmıyordu). Meşru `#C0883A` kullanımları (kehribar fallback)
  çıktıda korunuyor — ölçüldü (`kehribar,#c0883a` 4/4, lightningcss
  yalnız harfleri küçültmüş).
- CSS toplamı: 98.284 → 95.109 bayt (12 = 12 dosya); fark minify üslubu
  + düşen çöp.

**Ek kıyaslar:** `_headers` · `_redirects` · `robots.txt` · `llms.txt`
**BİT-EŞİT**; `surum.json` yalnız build zaman damgası; HTML-dışı dosya
listesi aynı; `_astro/` 13 = 13 dosya. dist toplamı 42.662.149 →
43.306.812 bayt (+%1,5).

**Tarayıcı öz-denetimi (ön eleme, kullanıcı onayı yerine geçmez):**
`arac/dist-sun.mjs` (CSP + _redirects uygulanarak) + `arac/oz-denetim.mjs`,
8 etkilenen sayfa (/, /havzalar/, /havzalar/antalya/, /arsiv/,
/kullanilanlar/, /goller/abant-golu/, /kuyu-ruhsati/adana/, /hangi-kurum/):
**konsol hata/uyarı 0 · 74 tekil iç link, kırık 0** · kareler
`cikti/denetim/*.png`. (GPU kuralı: kareler görsel kalite kanıtı değildir;
metin ölçümleri esastır.)

## 7. Kapsam dışı bulgular (uygulanmadı → SIRADAKILER'e yazıldı)

1. `src/components/PaylasilanMenu.astro:131-135` — seçicisiz yetim CSS
   bloğu (kaynak kusuru; iki sürümde de ölü). Temizliği görsel kimliğe
   dokunabilir → kara liste, elle karar ister.
2. `src/layouts/Sayfa.astro:362` — `is:global` içinde `:global()`.
   DÜZELTİLİRSE bugüne dek hiç uygulanmamış `height:100%` kuralı AKTİF
   olur = görünür değişiklik riski → bilinçli bırakıldı.
3. stil-pilot ilgili-kart sırası koleksiyon sırasına bağlı (noindex pilot
   sayfa; istenirse frontmatter `ilgili` sırasına sabitlenebilir).
4. npm audit çıktıları (brief md. 9 gereği dokunulmadı).

## 8. Bitti-tanımı karşılığı (brief md. 7)

- [x] adım 0 kanıtı raporda (§1)
- [x] 1b net: **EVET, Astro 5 Node 22'de çalışıyor** (§2)
- [x] referans `/home/suha/astro5-referans/` altında duruyor
- [x] 3. adım tarama listesi raporda (§4)
- [x] build hatasız geçiyor (exit 0, 522 sayfa — son log scratchpad
      `build-astro7-final.log`)
- [x] 5a-5e referansla kıyaslı, ham çıktılar raporda (§6)
- [x] commit yok, push yok (`git status`: 13 modified, hepsi ağaçta)
- [x] rapor + SIRADAKILER işlendi

## 9. GERİ ALMA

```
git checkout package.json package-lock.json src/ && npm install && npm run build
```
(`src/` de geri alınır çünkü boşluk-`{' '}` yamaları ve KOK düzeltmesi
Astro 5'te de zararsız ama geri alma "işten önceki hal" demektir. Yalnız
paketleri geri alıp kaynak yamalarını tutmak da GÜVENLİDİR — yamalar
Astro 5 çıktısını değiştirmez, `{' '}` zaten var olan boşluğu açık yazar.)

Node 20'ye dönüş GEREKMİYOR — 1b kanıtı: Astro 5, Node 22'de çalışıyor;
Node 22 kurulumu bu işten bağımsız kalıcıdır. Yine de istenirse:
```
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs
```

## 10. Kullanıcıya kalan kararlar

- **Cloudflare Pages panel:** NODE_VERSION hâlâ 20 → push edilirse canlı
  build KIRILIR. Panelden NODE_VERSION=22 yapılmadan commit/push yok.
  (Astro 7 Node ≥20.3 istiyor gibi görünse de canlıda bizim ölçümümüz
  Node 22; panel adımı ve commit kararı kullanıcının.)
- konya-kapali 5-kesiti (Burdur→Akarçay) kabul mü? Alternatif: kesit 5
  yerine ortak-il eşiğiyle sıralama — karar kullanıcının.
