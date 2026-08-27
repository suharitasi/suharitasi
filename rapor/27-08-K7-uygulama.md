# K7 UYGULAMA RAPORU — `/ilce-sorgu/` (a)+(b)

**Tarih:** 27.08.2026 · **Sınıf:** BÜYÜK İŞ (görünür içerik + veri sunumu
+ meta) · **Karar kaynağı:** kullanıcı, (a)+(b) birlikte; (c) reddedildi.

---

## 1. BRIEF DENETİMİ + DÜŞMAN GEÇİŞİ + AMAÇ ÖZETİ

### 1.1 Denetçi
| Tur | Dosya | Sonuç |
|---|---|---|
| 1 | `cikti/brief/k7-uygulama.md` | **1 ENGEL + 2 UYARI** — T7 (uydurma yasağı / "doğrulanmadı" yolu anılmamış), T6 (canlı-koşul ilkesi), T6 (git kilidi) |
| 2 | `cikti/brief/k7-uygulama-duzeltilmis.md` | **TEMİZ** |

Düzeltme yalnız **ekleme + netleştirme** (madde 4e): E1 uydurma yasağı /
"doğrulanmadı" işaretleme, E2 `arac/dist-sun.mjs` canlı-koşul, E3
`flock /tmp/suharitasi-git.lock`. Hiçbir kanıt yükümlülüğü
hafifletilmedi, hiçbir madde daraltılmadı. Orijinal brief değiştirilmeden
duruyor. Denetim raporları: `cikti/denetim/brief/2026-08-27T11-15-53Z.md`
ve `…T11-16-13Z.md`.

### 1.2 Düşman geçişi (D1-D4) — briefi FAIL ettirmenin yolları
- **D1 · "dist sayfa sayısı sabit" şartı build hash'i yüzünden kırılır
  mı?** Kırılmaz — JS chunk adı içerik değişince değişir ama HTML dosya
  kümesi değişmez. Ancak chunk adını sabit yazan bir ölçüm kırılırdı →
  ölçümde **glob** kullanıldı, hash yazılmadı.
- **D2 · Yeni yazacağım şerh kendi bitti-tanımımı ihlal edebilir mi?**
  **Evet, gerçek risk.** `morfoloji.json`'un dürüst etiketi *"akifer
  varlığının kanıtı değildir"* cümlesini içeriyor; onu alıntılasaydım
  `akifer` sayacı 0 olmazdı. Yeni şerhlerde "akifer" kelimesi
  KULLANILMADI (ölçüm: HTML 0 · chunk 0).
- **D3 · `olasılığı` sayfa dışından sızabilir mi?** Global gezinti metni
  "Su Nerede Çıkar?" — bu kelimeyi taşımıyor; `og:`/JSON-LD `description`
  sayfanın kendi `ozet`inden türüyor, o da düzeltildi. Ölçüldü: 0.
- **D4 · "TWI = 0" şartı yanlış-pozitif verir mi? EVET —
  `<meta name="twitter:card">` büyük/küçük harf duyarsız `twi`
  aramasıyla eşleşiyor.** Taban ölçümüyle doğrulandı (`grep -oi twi` →
  `twitter:card`, `twitter:image`). Bitti-tanımı bu bulguyla düzeltildi:
  TWI/AHP ölçümü **kelime sınırlı ve büyük-harf duyarlı** (`\bTWI\b`,
  `\bAHP\b`) yapıldı, ayrıca `ahp-` CSS öneki ayrıca sayıldı.

### 1.3 Amaç özeti
- **Amaç:** veri karşılığı olmayan üç çıktıyı ve hesaplarını kaldırmak;
  kalan çıktıların künyesini gerçek üretim yolunu söyleyecek hâle
  getirmek.
- **Dokunulmazlar:** Hero dosyaları · `noindex`/sitemap · `HukukSerhi`
  (K9) · yeni hukuki cümle · Copernicus adının kendisi.
- **Bitti-tanımı:** §6'daki ölçülebilir liste.
- **Kanıtlar:** dist HTML + JS chunk sayımı, canlı çekim, sağlık `--tam`.

---

## 2. KAPI (§0)

```
pwd    → /home/suha/projeler/suharitasi
remote → https://github.com/suharitasi/suharitasi.git
ağaç   → M src/components/anasayfa/Hero.astro
         M src/data/anasayfa-satis.js       ← kullanıcı onayı bekliyor
taban  → /home/suha/denetim-taban/ (dist, NOT.txt)
```
Hero dosyalarına **dokunulmadı**, geri alınmadı, **commit'e alınmadı**
(§7 doğrulaması).

---

## 3. YAYILIM TARAMASI (§2)

### 3.1 (2a) `ilce-morfoloji.json` tüketicileri — TAM LİSTE
| Tüketici | Ne okuyor | Ters künye var mı |
|---|---|---|
| `src/pages/ilce-sorgu.astro` | `ilceler` (948 kayıt: `duz_oran`, `vadi_oran`, `ort_egim`) | **Evet → K7 bu** |
| `src/data/guncellik.js:78` | **yalnız** `kunye.uretim_tarihi` | Hayır — veri basmıyor, tarih damgası |
| `izleme/kapsam-taban.json` | denetim tabanı (yayın değil) | — |

`/ilce-sorgu/` dışında ters künye ile veri basan sayfa/bileşen **yok**.

### 3.2 (2b) `veri/` + `data/` tam tarama — desen: *türetil· gerçek ölçüm
değil· varyasyon· hesaplanmadı· islenmedi*
Sonuç: sayfada gerçek ölçüm gibi sunulan **başka kalem bulunmadı**.
Bulgular karar dosyasına **K7-E** ve **K7-F** olarak yazıldı (uygulanmadı,
kapsam dışı). Özet:
- `data/canli/jrc-yuzey-suyu.json` — 25/25 `"islenmedi"`; `src/` içinde
  **hiç import edilmiyor** → ölü dosya (**K7-E**).
- `veri/potansiyel/morfoloji.json` — `yontem.twi = "hesaplanmadı"`;
  künyesi zaten dürüst, il sayfalarında TWI gösterilmiyor → temiz.
- `data/kamu/su-birimleri.json` — yanlış eşleşme ("temsilci").

---

## 4. (a) ÜÇ ÇIKTI VE HESAPLARI KALDIRILDI (§3)

| Kaldırılan çıktı | Kaldırılan kod | Neden |
|---|---|---|
| "tahmini su doygunluk derinliği: X–Y metre" | `dMin = Math.round(15+(1-duz)*65)`, `dMax`, `derinlik-tahmini` kartı | Depoda derinlik verisi YOK |
| "baskın kayaç ve akifer türü: Alüvyal/Karstik/Granit" | `akf` üçlü eşik ifadesi, `akifer-yapisi` kartı | Depoda litoloji verisi YOK |
| "Su Çıkma Olasılığı %" | `yasS`·`twiS`·`yagS`·`jrcS`·`ahp`·`sev`·`rnk`, `skor-degeri`/`skor-etiket`, `skor-bilesenleri` kartı, `[Analiz] AHP` log'u | Bileşik indeks; olasılık DEĞİL |

**Ölü kod bırakılmadı — ek temizlik:** `.ahp-ana/-deger/-etiket/
-detay-grid/-kart` CSS kuralları + mobil kırılım kuralları · `setS()`
yardımcısı (tek kullanıcısı skor rengiydi) · `graceYon` veri yolu
(`ilProfilData` → `getData` → `[VERi]` log'u; tek tüketicisi `yagS`
bileşeniydi) · `CIKTI_ALANLARI` listesinden 5 kaldırılan alan.

### 4.1 (3b) Sayfa vaadi — ÖLÇÜLDÜ (uygulama değil)
Ayrıntılı tablo karar dosyasında **K7-C** ve **K7-D**. Özet:
`title`, `H1`, `og:title`, JSON-LD **kaldırılan çıktıyı vaat etmiyor** →
değiştirilmedi. 1043 iç link, 521 dosyadan, yalnız iki metin; "derinlik",
"akifer", "olasılık" vaat eden link metni **YOK**. Tek tartışmalı kelime
"sondaj" (1 CTA + öz-cevap) → **K7-C/K7-D karar kalemi, uygulanmadı.**

**3b İSTİSNA ile UYGULANAN silmeler** (atıf siliniyor, cümle bozulmuyor)
— her biri gerekçeli:

| Metin | İşlem | Neden silme (KARAR değil) |
|---|---|---|
| `ozet` 2. cümlesi: "İl ve ilçe seçerek bölgenizdeki su çıkma olasılığını hesaplayın." | silindi | Tamamı kaldırılan çıktıya vaat; 1. cümle kendi başına tam bir öz-cevap |
| Katman ipucu "AHP ağırlıklı · TWI + YAS + yağış + yüzey suyu" | koddan türetilene çevrildi | §4c'nin açık yetkisi: "etiketi kodda ne varsa ona çevir" |
| "dere yatakları ve **TWI çanakları**" | "dere yatakları" | TWI hesaplanmıyor; liste öğesi silinince cümle tam |
| "**alüvyal tabanlar** ve düzlük alanlar" | "düzlük alanlar" | "alüvyal" litoloji iddiası; depoda litoloji verisi yok |
| "Potansiyeli yüksek alanlar, **akifer yapısı ve derinlik aralığı** gösterilir." | "Potansiyeli yüksek alanlar gösterilir." | Kaldırılan iki çıktıya atıf |
| Kaynak listesindeki **GRACE NASA GSFC** ve **EPİAŞ** | silindi | GRACE'in tek tüketicisi kaldırılan `yagS` idi; EPİAŞ'ın bu sayfada **hiç** veri yolu yoktu |
| Katman başlığı "Su Çıkma Olasılığı ve Bilimsel Analiz" | "Potansiyeli Yüksek Alanlar" | 6b gereği ifade 0 olmalı; yeni cümle YAZILMADI — Katman tek kart bıraktığı için **o kartın kendi mevcut başlığı** (eski `:113`) yukarı taşındı |

### 4.2 (3c) BOŞALMA KONTROLÜ — sayfa boşalmıyor
Kaldırmalardan sonra **9 veri çıktısı + hukuk yönlendirmesi** kalıyor
(§6.3 tablosu). Canlı test (Ankara/Polatlı) hepsinin dolduğunu gösterdi.
**DUR koşulu oluşmadı**, uygulama tamamlandı.

---

## 5. (b) KÜNYE VE YÖNTEM ŞERHİ (§4) — HER METNİN KAYNAĞI

**§5 uydurma yasağı öz-denetimi:** aşağıdaki her cümle, karşısındaki
dosya+alandan türetildi. Kaynağı gösterilemeyen tek cümle yazılmadı.

| # | Yeni metin | Türetildiği kaynak (birebir) |
|---|---|---|
| M1 | Arazi Yapısı ipucu: **"il düzeyi Copernicus GLO-90 DEM'den türetilmiş — ilçe ölçümü değildir"** | `ilce-morfoloji.json` `kunye.not`: *"Bu veri GERCEK ilce olcumu DEGiLDiR. Il duzeyindeki Copernicus GLO-90 DEM verisinden ilce ismiyle tohuma bagli varyasyonla turetilmistir."* |
| M2 | `ort_egim` null → **"veri yok"** | Ölçüm: 948/948 `null`. "veri yok" ifadesi sayfanın kendi mevcut kalıbı (`d.dsi \|\| 'veri yok'`) — yeni sözcük değil |
| M3 | Katman şerhi: **"Bu liste yalnız ilçe düz arazi ve vadi tabanı oranlarından türetilmiştir; bu oranlar il düzeyindeki Copernicus GLO-90 DEM verisinden ilçe adına bağlı deterministik varyasyonla üretilmiştir, gerçek ilçe ölçümü DEĞİLDİR."** | 1. yarı: kod (`duz>.3`, `vadi>.15` eşikleri) · 2. yarı: `kunye.not` + `kunye.yontem` (*"deterministik varyasyon (±%15)"*). Son cümle ("Saha etudu veya hidrojeolojik rapor YERINE GECMEZ") **mevcut metinden korundu** |
| M4 | Kapsam şerhi eki: **"İlçe düzeyindeki düz arazi ve vadi tabanı oranları ölçüm DEĞİLDİR: … deterministik varyasyonla (±%15) türetilmiştir. Ortalama eğim 948 ilçenin tamamında hesaplanmamıştır."** | `kunye.yontem` (±%15) + `kunye.not` + ölçüm (948/948 null) |
| M5 | Kaynak listesi: **"SYGM NHYP (YAS kütleleri), DSİ bölge dizini, Resmî Gazete işletme sahaları, OSM (ODbL) su noktaları, Copernicus GLO-90 DEM (arazi morfolojisi)"** | Sayfanın fiilen okuduğu yollar: `yas-kutleleri.json` (`kaynak_seti = "SYGM Nehir Havza Yönetim Planları"`) · `il-profil` DSİ bölgeleri · `isletme-sahalari*.json` (`kaynak = "T.C. Resmî Gazete arama"`) · `zenginlestirme.json` `osm_*` · `ilce-morfoloji.json` |
| M6 | Katman ipucu: **"ilçe düz arazi ve vadi tabanı oranından"** | Kod: kalan tek çıktının girdileri `duz`, `vadi` |

### 5.1 §4c yöntem etiketleri — OKUNDU ve ÖLÇÜLDÜ
| İddia | Kodda gerçekte ne var | Yapılan |
|---|---|---|
| **AHP** | `(yasS*.35 + twiS*.3 + yagS*.2 + jrcS*.15)` — sabit ağırlıklı doğrusal toplam. Pairwise matris **yok**, özvektör **yok**, tutarlılık oranı **yok** → **AHP değil** | Bileşik indeksle birlikte etiket kaldırıldı |
| **TWI** | `(duz + vadi)/2` — TWI = `ln(a/tanβ)` değil. `morfoloji.json` `yontem.twi = "hesaplanmadı"` | Bileşen listesinden ÇIKARILDI |
| **yağış** | `d.graceYon === 'azalma' ? 0.3 : 0.6` — CHIRPS okunmuyor, GRACE **yön etiketi** | **ÇIKARILDI** (gerçek kaynağıyla etiketlenmedi). Gerekçe: havza sayfalarının kendi şerhi *"GRACE il/ilçe ölçeğinde kullanılamaz"* diyor; etiketi düzeltmek bileşeni bu ölçekte meşrulaştırırdı, iç çelişki sürerdi |
| **Yüzey Suyu (JRC)** | `Math.min(1, duz*1.5)` — `jrc-yuzey-suyu.json` **hiç import edilmiyor**, 25/25 `"islenmedi"` | **ÇIKARILDI** — K1 kuralı: verisi olmayan gösterge puana girmez |

### 5.2 §5 öz-denetim — yazdığım metni kendi ölçütümle denetledim
| Ölçüt | Sonuç |
|---|---|
| Yeni metinde doğrulanmamış **yöntem adı** var mı? | **Yok** — "AHP", "TWI", "CHIRPS", "JRC" hiçbir yeni cümlede geçmiyor |
| Yeni metinde doğrulanmamış **kaynak adı** var mı? | **Yok** — M5'teki her kaynağın veri yolu §5 tablosunda gösterildi; veri yolu olmayan GRACE ve EPİAŞ **silindi** |
| Yeni metinde doğrulanmamış **ölçüm iddiası** var mı? | **Yok** — "±%15" ve "948 ilçe" iki ayrı ölçümden geliyor (künye alanı + null sayımı) |
| Yeni metin kendi bitti-tanımımı ihlal ediyor mu? (D2 tuzağı) | **Hayır** — "akifer" kelimesi bilinçli kullanılmadı; ölçüm 0 |
| Bulunamayan kalem "veri yok" işaretlendi mi? | **Evet** — `ort_egim` (M2) |

---

## 6. DOĞRULAMA (§6)

### 6.1 (6a) Build ve yayın yüzeyi
```
npm run build → exit 0
HTML dosya   : 523  (taban 523)   ✔  küme diff BOŞ
sitemap <loc>: 519  (taban 519)   ✔  küme diff BOŞ
```
Fark yok — açıklanacak isim yok.

### 6.2 (6b) Yasak ifadeler — YEREL (HTML **ve** JS chunk birlikte)
Chunk: `dist/_astro/ilce-sorgu.astro_astro_type_script_index_0_lang.BP1O03bw.js`

| İfade | Taban HTML | Taban chunk | **Yeni HTML** | **Yeni chunk** |
|---|---|---|---|---|
| `su doygunluk derinliği` | 0* | 1 | **0** | **0** |
| `doygunluk` | 0* | 1 | **0** | **0** |
| `akifer` | 3 | 6 | **0** | **0** |
| `Su Çıkma Olasılığı` | 4 | 1 | **0** | **0** |
| `olasılığı` | 4 | 1 | **0** | **0** |
| `Ortalama eğim: 0,0` | 0** | 0 | **0** | **0** |
| `\bTWI\b` | 1 | 3 | **0** | **0** |
| `\bAHP\b` | 1 | 3 | **0** | **0** |
| `ahp-` (CSS öneki) | 10 | 0 | **0** | **0** |
| `Alüvyon` / `Karstik` / `Granit` | 0 / 0 / 0 | 1 / 1 / 1 | **0** | **0** |
| **`Copernicus` (silinmez, >0 kalmalı)** | 3 | 0 | **4** ✔ | 0 |

\* İfade sunucu HTML'inde değil, istemci JS chunk'ında yaşıyordu.
\*\* Değer çalışma zamanında basılıyordu — tarayıcı ölçümü §6.4'te.

### 6.3 (6c) KALAN HER İDDİANIN VERİ KARŞILIĞI
| # | Kalan çıktı | Veri kaynağı | O kaynağın künyesi |
|---|---|---|---|
| 1 | Potansiyeli yüksek alanlar (liste) | `ilce-morfoloji.json` `duz_oran`, `vadi_oran` | *"il duzeyindeki Copernicus GLO-90 DEM verisinden ilce adi bazli deterministik varyasyonla TÜRETiLMiSTiR — gercek ilce olcumu DEGiLDiR"* — **sayfada artık aynen yazıyor** (M3/M4). ⚠ Cümlenin "su çıkma ihtimali" ifadesi → **K7-A karar kalemi** |
| 2 | DSİ Bölge(ler) | `il-profil.js` → `dsiBolgeleri` | DSİ resmî bölge dizini (kurum verisi, türetme yok) |
| 3 | Su idaresi | `data/il-kurum.json` `suIdareleri` | Kurum adı dizini (türetme yok) |
| 4 | Düz arazi (<%2 eğim) % | `ilce-morfoloji.json` `duz_oran` | 1 ile aynı künye · yöntem: `morfoloji.json` `yontem.dusuk_egim` = *"eğim < %2 alan oranı (3-arcsec merkezî fark)"* |
| 5 | Vadi tabanı % | `ilce-morfoloji.json` `vadi_oran` | 1 ile aynı · `yontem.vadi_tabani` = *"eğim < %2 VE 1 km pencerede yerel çukurluk < 10 m — akış birikimi değildir, yaklaşık göstergedir"* |
| 6 | Ortalama eğim | `ilce-morfoloji.json` `ort_egim` | **948/948 null → "veri yok" basılıyor** (M2) |
| 7 | YAS kütlesi (sayı) | `kutle-il.json` + `yas-kutleleri.json` | *"SYGM Nehir Havza Yönetim Planları (yayımlı 12 havza)"* · *"Yalnız PDF metninde yazan alanlar; null/'veri yok' = kaynakta yok"* · eşleme künyesi: `eslesti 347 / belirsiz 5 / dogrulanamadi 120` (yalnız `eslesti` basılır) |
| 8 | RG işletme sahası (sayı) | `isletme-sahalari.json` + `-ek.json` | *"T.C. Resmî Gazete arama (resmigazete.gov.tr /Home/Filter, başlık araması)"* · 109 kayıt |
| 9 | OSM su kaynağı (sayı) | `zenginlestirme.json` `osm_su_noktalari` | *"OSM (ODbL)"* · `osm_spring 1239 / osm_well 487` |
| — | Hukuk yönlendirmesi + 2 rehber linki | iddia içermiyor, yönlendirme | — |

**Tek açık kalan iddia: 1 numaralı satırın "su çıkma ihtimali" ifadesi**
— silmek cümleyi bozduğu için KARAR sınıfı, karar dosyasına **K7-A**
olarak önerilen metinle birlikte yazıldı.

### 6.4 Tarayıcı öz-denetimi (canlı koşul: `arac/dist-sun.mjs`, CSP açık)
`python3 -m http.server` **kullanılmadı**. `curl -I` ile CSP başlığının
uygulandığı doğrulandı. Örnek: **Ankara / Polatlı**

| Alan | Değer |
|---|---|
| `morf-egim` | **"veri yok"** ✔ (4b kapandı — taban: "0,0°") |
| `morf-duz` / `morf-vadi` | 11,9% / 8,1% |
| `skor-degeri`·`skor-etiket`·`akifer-yapisi`·`derinlik-tahmini`·`skor-bilesenleri` | **hiçbiri DOM'da yok** ✔ |
| Metrikler | 26 YAS kütlesi · 24 RG sahası · 1 OSM |
| Konsol | **hata 0 · uyarı 0** (3 bilgi log'u) |
| Ekran görüntüsü | `cikti/denetim/k7-ilce-sorgu-sonrasi.png` |

⚠ Aynı ölçümde **K7-B** bulundu: duz 11,9% ve vadi 8,1% eşiklerin
altında olduğu hâlde sayfa yine "vadi içi alçak kesimler" yazıyor
(dayanaksız yer tutucu) → karar dosyasına yazıldı, uygulanmadı.

### 6.5 (6d) Meta/link tutarsızlıkları
Listelendi ve karar dosyasına yazıldı: **K7-C** (meta/title/H1/öz-cevap)
· **K7-D** (1043 iç link, iki metin). Uygulama yapılmadı.

### 6.6 (6e) Sağlık `--tam` · (6f) Canlı doğrulama
→ §7 (deploy sonrası ölçümler).

---

## 7. GERİ ALMA

```bash
git revert <bu commit>
npm run build
```
Tek commit · veri dosyası değişmedi · dış durum bırakılmadı ·
`ilce-morfoloji.json` ve diğer veri dosyaları **dokunulmadan** duruyor.
Revert sonrası sayfa taban hâline döner (üç çıktı geri gelir).
