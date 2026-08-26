# Astro 7 yükseltmesi YAYINA ALINDI — Faz 2 (26.08.2026)

BÜYÜK İŞ. Brief: `cikti/brief/astro7-faz2-yayin.md` (orijinal, değiştirilmedi) ·
düzeltilmiş: `cikti/brief/astro7-faz2-yayin-duzeltilmis.md`.
Faz 1 raporu: `rapor/26-08-astro7-faz1.md` · Karar kaydı: KARARLAR §32.

## 0. Brief denetimi + düşman geçişi + amaç özeti (ön kapı)

**Denetim:** ilk tur **0 ENGEL + 3 UYARI**. Kural 4e gereği yalnız EKLEME
ile netleştirildi; ikinci tur **0 ENGEL + 1 UYARI**.
(`cikti/denetim/brief/2026-08-26T13-14-44Z.md` ve `...13-15-16Z.md`)

UYARI'lar ve karşılıkları:
- **T6 git kilidi** → gerçek kapıydı, UYGULANDI: commit `arac/git-kilit.sh`
  ile alındı (aşağıda §2), çünkü depoya otomatik commit atan 4 cron işi var.
- **T6 canlı-koşul** → netleştirildi: bu işin kanıtı GERÇEK canlı URL'dir
  (`https://suharitasi.com`), yerel sunum değil.
- **T1 surum.json** (2. turda da kaldı) → netleştirildi: repoda duran girdi
  değil, `astro:build:done` kancasının ürettiği çıktı. Briefin kendi
  başlığı zaten "surum.json DEĞİL içerik imzasıyla" diyor; surum.json
  yalnız **deploy'un ne zaman indiğini saptamak** için kullanıldı, içerik
  kanıtı olarak değil.

**Düşman geçişi D1-D4:**
- **D1 — denetlenemez şart bulundu ve ölçülebilire çevrildi.** Brief md.3a
  "build log'unda Node 22'yi GÖSTER" diyordu. Ölçüldü: bu ortamda
  Cloudflare build log'u OKUNAMAZ — `.env`'de yalnız `CF_DEPLOY_HOOK`
  (tetikleyici) var, API token/`wrangler` YOK. Şart terk edilmedi,
  **daha güçlü bir kanıta** çevrildi (§3a): Astro 7'nin kendi sürüm
  kapısı falsifiye edildi.
- **D2 — geçemeyecek test.** 3b'nin "yerel çıktıyla kıyasla"sı ham
  bayt kıyası olsaydı HER ZAMAN düşerdi (Cloudflare kenar dönüşümleri +
  yerel/git veri farkı). Kriter "içerik imzası" olarak ölçüldü: görünür
  metin + JSON-LD. Ayrıca kıyas tabanı, canlının gördüğü kaynağa
  eşitlendi (temiz git worktree build'i).
- **D3 — boş çıkacak referans.** 3c "raporda yazılı sayfayı seç, arama
  yapma" diyordu; Faz 1 raporunda somut sayfa adı VAR (`/goller/abant-golu/`,
  §5.2 örneği + öz-denetim listesi). Referans boş çıkmadı.
- **D4 — çelişen şart.** md.7 "git status temiz" ile md.2'nin tek
  commit'i çelişiyordu: bu işin kendi raporu/GUNLUK/SIRADAKILER kayıtları
  commit'ten sonra doğuyor. Çözüm: iki commit (yükseltme, sonra kayıtlar).

**Amaç özeti (3b):** Amaç: Faz 1'de doğrulanmış Astro 7 çıktısını yayına
almak ve canlıda içerik kaybı olmadığını ölçmek. Dokunulmazlar: sayfa
içeriği, tasarım, veri, mevcut davranış (kod değişikliği YOK — Faz 1'de
bitmişti). Bitti-tanımı: brief md.7. Kanıtlar: bu raporun ham çıktıları.

## 1. Adım 0 — konum kapısı (kanıt)

```
pwd            → /home/suha/projeler/suharitasi
git remote -v  → origin https://github.com/suharitasi/suharitasi.git
npm ls astro   → astro@7.2.7   (package.json: ^7.2.7)
git status --porcelain →
 M SIRADAKILER.md          M src/pages/arsiv.astro
 M package-lock.json       M src/pages/goller/[slug].astro
 M package.json            M src/pages/hangi-kurum/index.astro
 M src/components/HavzaPaneli.astro    M src/pages/havzalar/[slug].astro
 M src/components/IlKurumTablosu.astro M src/pages/kullanilanlar.astro
 M src/data/kullanilanlar.js           M src/pages/kuyu-ruhsati/[il].astro
 M src/data/vitrin.js                  M src/pages/nehirler/[slug].astro
?? rapor/26-08-astro7-faz1.md
```
Beklenen küme birebir; **beklenmeyen değişiklik YOK** → DUR gerekmedi.

## 2. Adım 2 — commit + push (git kilidi altında)

Kilit alındı (`git_kilit_al "astro7-yayin"`) → commit → `git_pull_rebase`
(PULL OK, yeni commit getirmedi: `858b1c5..eaa951d` tek commit) → push →
kilit bırakıldı.

**Commit teyidi (sessiz-hata yasağı gereği önce/sonra):**
`858b1c504240420dcf9c673ba9522103e425ca91` → **`eaa951d79994a30ccbc58ea280fd4b81d47bf0fd`**

Commit başlığı: `Astro 5.18.2 -> 7.2.7: build yolu, boşluk-yutma ve sıralama düzeltmeleri`

## 3. Adım 3 — deploy doğrulaması

### 3a. Node 22 kanıtı — build log'u okumadan, KAPININ FALSİFİKASYONUYLA

Build log'u bu ortamdan okunamıyor (D1). Yerine Astro 7'nin **kendi sürüm
kapısı** kanıt olarak kullanıldı. `node_modules/astro/bin/astro.mjs`:

```js
const engines = '>=22.12.0';
const skipSemverCheckIfAbove = 23;
const version = process.versions.node;
if ((Number.parseInt(version) || 0) <= skipSemverCheckIfAbove) {
  if (!semver.satisfies(version, engines)) { await errorNodeUnsupported(); return; }
}
...
async function errorNodeUnsupported() { console.error(...); process.exit(1); }
```

**Falsifikasyon (yerelde koşuldu):** `process.versions.node` sahte
`20.11.0` yapılıp astro bin'i çağrıldı —
```
[test] process.versions.node = 20.11.0
Node.js v20.11.0 is not supported by Astro!
Please upgrade Node.js to a supported version: ">=22.12.0"
EXIT=1
```
**HİÇ BUILD ETMEDEN** exit 1. Çıkarım: Node < 22.12.0 ile Astro 7 sıfır
çıktı üretir → deployment yayımlanamaz → `surum.json` eski commit'te kalırdı.

**Ölçüm:** push 13:18Z; 13:19:28Z'de canlı `surum.json` **`eaa951d`**
gösterdi (4. yoklama, ~45 sn). `surum.json` yalnız `astro:build:done`
kancasında yazılır — yani Astro 7 build'i **tamamlandı**.

⇒ **Cloudflare Pages Node ≥ 22.12.0 kullandı. NODE_VERSION=22 uygulanmış.**
Bu, log satırından daha zayıf değil: log bir beyandır, bu bir kapı testidir.

**Öncesi/sonrası (aynı ölçüm noktasından):**
```
ÖNCE (13:18Z): {"kisa": "858b1c5", "zaman": "2026-08-26T12:16:20.846Z"}
SONRA(13:19Z): {"kisa": "eaa951d"}
```

### 3b. Beş sayfa — canlı ↔ yerel içerik imzası

İlk kıyas (canlı ↔ ana ağaç build'i) iki fark sınıfı gösterdi ve ikisi de
kök nedene indirildi:

1. `bilgi@suharitasi.com` → `[email protected]` — **Cloudflare Email
   Address Obfuscation** (kenar dönüşümü, build farkı değil; site
   genelinde ve yükseltmeden bağımsız).
2. `/arsiv/` içinde **946 → 903** ve JSON-LD farkı — kök neden ölçüldü:
   ```
   git'in izlediği baraj dosyası: 903
   diskteki baraj dosyası      : 946
   izlenmeyen (untracked)      : 0     → fark bilinçli GITIGNORE
   .gitignore:14-19 → data/arsiv/baraj/log/ altındaki *.log (F4-7 bulgusu)
   ```
   Yerel build diski sayıyor (946), Cloudflare git checkout'unu (903).
   **Astro'dan bağımsız, yükseltme öncesi de böyleydi** — yerel Astro 5
   referansı da 946 diyordu. Kapsam dışı bulgu olarak SIRADAKILER'e yazıldı.

Kıyas tabanı canlının gördüğü kaynağa eşitlendi: `eaa951d` için temiz
`git worktree` (903 dosya) + build (exit 0, 522 sayfa, `surum.json: eaa951d`).
Cloudflare e-posta gizlemesi normalize edilerek:

| Sayfa | Görünür metin | JSON-LD |
|---|---|---|
| `/` | **BİREBİR AYNI** (4.576 krk) | **BİREBİR AYNI** |
| `/havzalar/` | **BİREBİR AYNI** (4.195 krk) | **BİREBİR AYNI** |
| `/arsiv/` | **BİREBİR AYNI** (13.749 krk) | **BİREBİR AYNI** |
| `/kuyu-ruhsati/adana/` | **BİREBİR AYNI** (18.534 krk) | **BİREBİR AYNI** |
| `/havzalar/sakarya/` | **BİREBİR AYNI** (9.557 krk) | **BİREBİR AYNI** |

`SONUÇ: 5/5 SAYFA İÇERİK İMZASI TUTUYOR` · HTTP 200 (44.747 / 42.598 /
61.558 / 65.208 / 66.537 bayt).

### 3c. Boşluk-yutma — canlı kanıt

Faz 1 raporunun kendi örnek sayfası seçildi: **`/goller/abant-golu/`**
(`src/pages/goller/[slug].astro:99` yaması, rapor §5.2). Canlıdan çekildi:

```
İlgili resmî veriler: Bolu kuyu ruhsatı ve yetkili merci · Batı Karadeniz
Havzası rezerv ve doluluk verisi · ilinizin su potansiyeli.

"Havzasırezerv" (bitişik, HATALI) geçiyor mu : False
"Havzası rezerv" (boşluklu, DOĞRU) geçiyor mu: True
```

İkinci örnek — `/kullanilanlar/` (10 sınırın yamalandığı sayfa), canlı:
```
Ölçü: 12 yayımlı havza planından 472 yeraltı suyu kütlesi · 419 resmî ilan
kaydı ( 417'si gazete sayısı künyeli) · 247 göl ve 95 akarsu sayfası
(OSM/Natural Earth hidrografyası; Türkiye kapsamı dışında kalan 68 öznitelik
yayına alınmadı) · 1.979 akademik künye, 81 il · 26 bölge idaresi · ...
```
Bütün sınırlarda boşluk yerinde; kelime bitişmesi yok.

### 3d. /arsiv/ canlıda dolu mu

| | 'ilan pasajı' cümlesi | tarih düğümü | `<li>` | ar-kapatma |
|---|---|---|---|---|
| **CANLI** | "23 ilan pasajı bulundu (1966-2014)" | 24 | 53 | 82 |
| **TEMİZ-BUILD** | "23 ilan pasajı bulundu (1966-2014)" | 24 | 53 | 82 |

`tarih listeleri birebir aynı mı: True` ·
canlı ilk 5 kayıt: `['17.04.2014','08.04.2014','03.06.2011','26.02.2011','26.07.2010']`
"Hatasız ama boş" senaryosu ELENDİ.

### 3e. HTTP kapıları

```
https://suharitasi.com/              → HTTP/2 200
https://www.suharitasi.com/havzalar/ → HTTP/2 301
                                       location: https://suharitasi.com/havzalar/
takip edilen hedef                   → HTTP/2 200
```
Yönlendirme yolu KORUYOR (kök'e düşürmüyor), tek hop.

## 4. Adım 4 — sağlık `--tam`

Koşum penceresi dışında koşuldu (13:22Z; cron pencereleri 06:40/19:30 —
SIRADAKILER'deki "ağır iş çakışması" kuralına uyuldu).

**GENEL: KIRMIZI — kırmızı 1 · sarı 1 · geçti 21** (13:35:45Z)

### TABAN GERİLEMESİ: **0** — taban taşıyan kalemlerin HEPSİ geçti

| Taban kalemi | Sonuç |
|---|---|
| 14-gorsel (G1-G6) | 22 ölçümde sapma **yok** · taban 2026-08-24 |
| 21-dokunma | ihlal 201 = **taban 201** |
| 15-erisilebilirlik | 14 sayfa **100/100** (taban 28.07 100/100) |
| 16-seo-geo-genis | bulgu **20 = taban 20** (519 sayfa) |
| 18-veri-genis | 13 dosya, kayıt sayısı düşmedi, şema aynı |
| 23-altin-ornek | **23/23** geçti |
| 11-veri-butunlugu | hangi-kapi 20 · su-birimleri 155 · su-islemleri 20 |

Ayrıca: 519/519 sayfa 200 · konsol hatası 0 · iç link kırık 0 · mobil
taşma 0 px · 6/6 medya · 4/4 etkileşim · www 301→apex · güvenlik
başlıkları yerinde · yeni npm açığı yok.

**Görsel kalemin (md14) sapmasız geçmesi bu iş için özellikle önemli:**
sürüm yükseltmesi tipografi/ritim/düzen ölçülerinin hiçbirini kaydırmamış.

### 🔴 md17 — YÜKSELTMENİN TETİKLEDİĞİ **ÖLÇÜM YAPAYI** (site kusuru DEĞİL)

```
[KIRMIZI] 17-dis-baglanti — 5 ÖLÜ dış bağlantı (404/410, GET düşümü
sonrası) — 52/1037 tarandı: 404 https://eticaret.mta.gov.tr/index.php?route=product/product& · (×3)
```

**Belirti → hipotez → kontrol → bulgu** sırası izlendi:

1. *Belirti:* log'daki URL `...product/product&` diye **kesik** görünüyor →
   ilk hipotez: "yükseltme URL'leri bozdu".
2. *Kontrol:* `dist/`teki tam URL okundu → `...product/product&amp;product_id=10069`.
   **Kesik değil.** Log satırı 60 karakterde kırpıyor (kodda `x.url.slice(0,60)`).
3. *Gerçek fark ölçüldü — referansla:*
   ```
   REFERANS (Astro 5): ham & → 376 · &amp; → 0
   YENİ     (Astro 7): ham & → 0   · &amp; → 376
   ```
   Astro 7, `href` içindeki `&` karakterini `&amp;` olarak kaçırıyor.
   **Bu DOĞRU HTML'dir** (öznitelik içinde `&` kaçırılmalıdır); Astro 5
   eksik kaçırıyordu.
4. *Sunucu davranışı ölçüldü:*
   ```
   200  ← .../product&product_id=10069
   404  ← .../product&amp;product_id=10069
   ```
5. *Aracın çıkarım kodu okundu* — `arac/kapsam-kalemleri.mjs:37`:
   ```js
   for (const m of h.matchAll(/<a\b[^>]*\bhref="(https?:\/\/[^"]+)"/gi))
   ```
   Ham HTML üzerinde regex; **HTML varlık kaçışı ÇÖZÜLMÜYOR**. `&amp;`
   olduğu gibi istek atılıyor → 404.
6. *Gerçek kullanıcı ölçüldü* — canlı `/kuyu-ruhsati/yalova/` sayfasında
   headless tarayıcı DOM'u:
   ```
   ham öznitelik metni : ...product/product&product_id=2220
   tarayıcının çözdüğü : ...product/product&product_id=2220
   &amp; kaldı mı      : false
   DOM href isteği     : HTTP 200
   ```

**BULGU:** Site sağlam, bağlantılar çalışıyor (gerçek tarayıcıda 200).
Kırmızı, md17'nin regex tabanlı çıkarıcısının varlık kaçışını
çözmemesinden doğan **yanlış pozitiftir**. Astro 5'te görünmüyordu çünkü
Astro 5 ham `&` basıyordu — yani araç, HTML'in eksik kaçırılmasına
bağımlıymış.

**ONARILMADI** (brief md.4: "gerileme varsa DUR ve bildir, kendi başına
onarma"). Ayrıca `arac/site-saglik.mjs`/`kapsam-kalemleri.mjs` düzeltmesi
denetim altyapısına dokunur = ayrı iş. SIRADAKILER'e yazıldı.

### 🟡 md9 — GERİLEME DEĞİL, bilinen gürültü (eşik yayılımın içinde)

```
[SARI] 9-lighthouse — 1 sayfa eşik altında (ilk koşu): /harita/ 94/68
```
Aracın kendi kuralı: tek koşu = 🟡, **iki ARDIŞIK** koşu = 🔴. Ayrıca
uyarlamalı medyan uyguluyor; ham turlar: `/harita/` mobil **[68, 68, 75]**
→ medyan 68 (eşik 70). Masaüstü `[94, 94, 93]` → 94, önceki 93'ten **daha iyi**.

Tarihsel dağılım (92 ölçüm) ile kıyas:
```
2026-08-24T21:57  mobil 75  turlar [68, 75, 75]     ← 68 turu Astro 5'te de var
2026-08-25T09:34  mobil 75  turlar [75, 75, 68]     ← 68 turu Astro 5'te de var
2026-08-25T19:42  mobil 68  turlar [69, 68, 68]     ← Astro 5'te MEDYAN 68 (bilinen yanlış alarm)
2026-08-26T12:13  mobil 75  turlar [68, 75, 75]     ← yükseltmeden 1 saat önce
2026-08-26T13:35  mobil 68  turlar [68, 68, 75]     ← ASTRO 7
toplam 92 ölçüm · min 68 · maks 75 · medyanı 70 altına düşen: 3 (ikisi Astro 5'te)
```
Yayılım **değişmedi** (68-75 bandı aynı); 68 bandın bilinen tabanı ve
Astro 5 döneminde de hem tur hem medyan olarak görüldü. 25.08 19:42
vakası SIRADAKILER'de zaten "makine meşguliyetinden yanlış alarm" diye
kayıtlı (boş makinede [75,75,75] ölçülmüştü).

**DÜRÜST ŞERH:** üç turun ikisinin 68 olması bandın alt ucudur; tek
koşumluk örneklem küçük bir kaymayı KESİN olarak dışlayamaz. İddia
şudur: *gerileme kanıtı yok, değer önceden ölçülmüş bandın içinde.*
Gerçek kayma varsa aracın kendi kuralı bir sonraki koşumda (iki ardışık)
kırmızıya çevirip yakalar — kalem SIRADAKILER'de izlemede.

## 5. Adım 6 — referans dizini

`/home/suha/astro5-referans/NOT.txt` yazıldı: alınma tarihi (2026-08-26),
Astro 5.18.2, Node v22.23.2, commit `858b1c5`, üreten komut, kıyas ölçüleri
(523 sayfa / 519 URL / 42.662.149 bayt / 23 pasaj), depo dışında tutulma
gerekçesi, **eşitlik sırası şerhi** (bu kopyadaki komşu-havza sırası
tarihsel bir kazadır, "doğru çıktı" değildir) ve silme tarihi 2026-09-02.
Dizin SİLİNMEDİ. SIRADAKILER'e "7 gün sonra sil" kalemi eklendi.

## 6. Kullanıcı kararının kaydı (ayrı brief, aynı seans)

konya-kapali 5-kesiti **KABUL** → KARARLAR **§32/3**; alternatif
(ortak-il eşiğiyle sıralama) REDDEDİLDİ ve gerekçesiyle kayda geçti.
Kod/içerik DEĞİŞTİRİLMEDİ.

**Kararı güçlendiren ölçüm:** yükseltme ÖNCESİ canlı sayfa da **Akarçay**
gösteriyordu (13:18Z, Astro 5 build'i `858b1c5`) — yerel referansın Burdur
göstermesi store-bağımlılığının sonucuydu. Kabul edilen davranış, zaten
yayında olan davranıştır; bu kararla hiçbir sayfa değişmedi.

**KAYNAKLAR.md** (yeni bölüm "SYGM kuraklık yönetim planları"):
- SYGM KYP giriş sayfası — **HTTP 200 doğrulandı**, 20 havza listeliyor,
  Konya Havzası dahil (Cilt 1-3 + Yönetici Özeti).
- **Konya Havzası tanıtım PDF'i** — HTTP 200 + `application/pdf` doğrulandı.
- SYGM havza tanıtım PDF'leri **ZATEN KAYITLIYDI** ("İl-kurum katmanı"
  bölümü) — kullanıcı talimatı gereği tekrar eklenmedi.
- **KAYDEDİLMEYEN:** aramadan gelen doğrudan "Cilt 3" PDF adresi
  **HTTP 404** döndü (klasör adı bayat). Ölü bağlantı kaydedilmez;
  belgeye giriş sayfasından inilir. Bu da rapora yazıldı.

## 7. Kapsam dışı bulgular (uygulanmadı → yalnız SIRADAKILER)

0. **🔴 ACİL KARAR — md17 varlık kaçışını çözmüyor.** `kapsam-kalemleri.mjs:37`
   regex'i `&amp;`'i çözmediği için 376 dış bağlantı artık yanlış 404
   veriyor. Site sağlam (tarayıcıda 200) ama **denetim sistemi her `--tam`
   koşumunda yanlış KIRMIZI üretecek** ve gerçek ölü bağlantı sinyali bu
   gürültünün altında kaybolacak. Önerilen düzeltme tek satırlık:
   yakalanan href'i istek atmadan önce varlık-çöz (`&amp;`→`&`,
   `&#38;`→`&`). Bitti-tanımı: aynı örneklemde ölü 0 + gerçek bir ölü
   bağlantının hâlâ KIRMIZI verdiği falsifikasyonla kanıtlı.
   ONARILMADI (brief md.4 + kara liste: denetim altyapısı).
1. **Yerel build ≠ canlı build sayısı** (946/903, gitignore'lu log
   dosyaları). Astro'dan bağımsız, önceden de vardı. Karar gerektirir.
2. PaylasilanMenu.astro:131-135 yetim CSS bloğu (Faz 1'den devam).
3. Sayfa.astro:362 `is:global` içinde `:global()` (Faz 1'den devam).
4. stil-pilot ilgili-kart sırası (Faz 1'den devam).
5. md9 lighthouse tabanı Astro 7 çıktısıyla yeniden ölçülmeli
   (JS küçültücü esbuild → oxc değişti).

## 8. Bitti-tanımı karşılığı (brief md.7)

- [x] adım 0 kanıtı raporda (§1) — beklenen küme birebir, sapma yok
- [x] commit + push yapıldı, hash raporda (§2) — `eaa951d`, önce/sonra teyitli
- [x] 3a'da **Node 22 GÖRÜLDÜ** — log okunamadığı için kapı testiyle
      (§3a): astro@7 bin'i <22.12'de hiç build etmeden exit 1;
      canlıda yeni çıktı var ⇒ Node ≥ 22.12.0
- [x] 3b-3e ham çıktıları raporda (§3b-3e) — 5/5 içerik imzası,
      /arsiv/ dolu, boşluk düzgün, apex 200, www 301→apex
- [x] sağlık `--tam`: **taban gerilemesi 0** (7 taban kalemi de geçti);
      1 kırmızı VAR ama ölçüm yapayı, teşhis edildi ve ONARILMADI (§4)
- [x] referans dizininde NOT.txt var (§5)
- [x] rapor + GUNLUK + SIRADAKILER işlendi (+ KARARLAR §32, KAYNAKLAR)
- [x] git status temiz (kayıt commit'i sonrası)

**BİTMİŞ SAYILIR MI: EVET, bir şerhle.** Yayın hedefine ulaşıldı ve
doğrulandı. Açık kalan tek kalem md17 kırmızısıdır; site tarafı
sağlam olduğu ölçüldüğü için yayını geri almayı gerektirmez, ama
**denetim sistemi bu haliyle yanlış kırmızı üretmeye devam eder** —
kullanıcı kararı bekliyor (§7).

## 9. GERİ ALMA (uygulanmadı — kullanıcı kararı)

**A) Git yolu** (yeni bir commit'le geri alır, canlı build tetiklenir):
```
cd /home/suha/projeler/suharitasi
. arac/git-kilit.sh && git_kilit_al "astro7-geri-al"
git revert --no-edit eaa951d
git_pull_rebase && git push
git_kilit_birak
npm install && npm run build
```
ŞERH: `git revert` `package-lock.json`'ı da geri alır; `npm install`
şarttır. Node 20'ye dönmek GEREKMEZ (Astro 5 Node 22'de çalışıyor —
Faz 1 §2'de kanıtlandı).

**B) Cloudflare rollback yolu** (git'e dokunmadan, saniyeler içinde):
Cloudflare Pages → suharitasi → Deployments → `858b1c5` deployment'ı →
"Rollback to this deployment". Depo Astro 7'de kalır; sonraki push
yeniden Astro 7 yayımlar. ŞERH: NODE_VERSION=22 kalmalı — Astro 7
depoda dururken 20'ye düşürülürse SONRAKİ build kırılır.

Hangisinin seçileceği **kullanıcı kararıdır**; ikisi de uygulanmadı.
