# "EMİN" SIFATININ UYGULANMASI (İş B)

Tarih: 2026-07-29 · Worktree: `suharitasi-emin` · Kaynak: **DESIGN.md §18**
Brief kapısı: `cikti/brief/2026-07-29-uc-is.md` → **TEMİZ**

---

## B0. MEVCUT DURUM — ölçüm (6 sayfa tipi, 1440 px, aydınlık düğümler)

Ölçer düğümleri **role göre** ayırır; §18.2'nin hedefi *gövde metni*dir,
bağlantı/etiket değil.

| Sayfa tipi | En dar GÖVDE — ÖNCE | SONRA | <7,0 düğüm ÖNCE → SONRA |
|---|---|---|---|
| ana | **5,22** | **7,04** ✓ | 44 → **14** |
| kapı | 7,04 ✓ | 7,04 ✓ | 90 → 87 |
| il | 6,58 | 6,58 | 111 → 111 |
| rehber | 7,04 ✓ | 7,04 ✓ | 124 → 124 |
| arşiv | 7,04 ✓ | 7,04 ✓ | 89 → 89 |
| kurum | 6,58 | 6,58 | 87 → 87 |

**Ölçüm artefaktı (kayda geçti):** ana sayfada `1:1` görünen 4 düğüm
gerçek değil. İletişim formu `background: rgba(255,255,255,0.05)` taşıyor;
ölçer alfa 0,05'i "opak beyaz" sayıp koyu bölümü aydınlık sandı. Bu
düğümler **koyu** bölümdedir. Ölçer hero/görsel üstü düğümleri zaten
dışlıyor; bu alfa vakası da rapora yazıldı.

---

## B1. RENK — iki kopya-token çatalı kapatıldı

**Bulgu:** 28.07'de `--murekkep-500` #48627A → #3C5266 koyulaştırılmıştı
(KARARLAR §22). Ama üç yerde **token elle kopyalanmıştı** ve düzeltme
oralara ULAŞMAMIŞTI — ölçümle bulundu:

| Yer | Neydi | Ne oldu | Ölçülen kontrast |
|---|---|---|---|
| `anasayfa-v2.css` `--v2-muted-fg` | `oklch(0.52 0.03 225)` = #576D76 | **#3C5266** | 5,22 → **7,77** (#F6FBFD) · 5,45 → **8,11** (#FFFFFF) |
| `index.astro` `.v2-altkap --metin-soluk` | #48627A | **#3C5266** | 5,52 → **7,04** |
| `HavzaPaneli.astro` `--pk-soluk` | #48627A | **#3C5266** | 5,52 → **7,04** |

**Yeni renk İCAT EDİLMEDİ** (B1 şartı): üç yerde de değer, paletteki
`--murekkep-500`'ün kendisi. Ana sayfa kendi `v2-*` token ailesini
kullandığı için düzeltme oraya taşınmıştı; artık aynı değeri taşıyor.

**Ders (kopya-token deseni):** aynı hex'in üç ayrı yerde elle yazılması,
bir düzeltmenin sessizce yarım kalmasına yol açtı. Bu, `/hangi-kurum/`da
28.07'de kapatılan çatalın **üç kardeşiydi**. Kalan tek kopya
`stil-pilot.astro` — `noindex, nofollow` pilot sayfası, yayın yüzeyi değil.

### B1 — KAPANMAYAN: il + kurum gövdesi 6,58 · **TOKEN YOK, KARAR GEREKLİ**

İl ve kurum sayfalarının gövdesi `--adacayi-krem #DFE9F0` kart zemininde
duruyor; `#3C5266` orada **6,58** veriyor (hedef ≥7,0, açık **0,42**).

Paletteki tüm adaylar ölçüldü:

| Aday (paletten) | #DFE9F0 üstünde | Uygun mu |
|---|---|---|
| `--murekkep-500` #3C5266 (mevcut) | **6,58** | hedefin altında |
| `--yesil-kara` #2C5570 | 6,46 | daha kötü |
| `--su-700` #0C5A7C | 6,16 | daha kötü |
| `--murekkep-900` #132A3F | 11,92 | ✔ ama **gövde renginin kendisi** — ikincil metin ayrımı yok olur |

**Sonuç: mevcut token'larla ≥7,0'a çıkılamıyor.** Çıkmanın iki yolu var,
ikisi de DESIGN.md değişikliği = **kullanıcı kararı**:
1. **Yeni palet değeri** — ölçüldü: `#34495C` → #DFE9F0'da **7,57**,
   #E9F0F4'te 8,09. `--murekkep-500`'ü bununla değiştirmek tüm sayfaları
   ≥7,0'a çıkarır. (Bu bir *icat*tır; B1 gereği uygulanmadı.)
2. **Kart zeminini açmak** — `--adacayi-krem`'i `--krem`e yaklaştırmak.
   Reddedilir: kart yüzeyi sayfa zemininden ayrışmaz olur, §8 kart
   kimliği bozulur.

**Öneri (uygulanmadı):** seçenek 1, çünkü tek bir token değişimiyle
altı sayfa tipinin tamamı hedefe ulaşır ve renk ailesi (soğuk lacivert-gri)
korunur.

### Bağlantı ve etiket renkleri — §18.2 kapsamı DIŞINDA (bilgi)

| Renk | Rol | #DFE9F0 / #E9F0F4 | Not |
|---|---|---|---|
| `--su-700` #0C5A7C | bağlantı (133+150 düğüm) | 6,16 / 6,59 | Koyulaştırmak bağlantı sesini gövdeye yaklaştırır; §2 "vurgu sesi" bozulur |
| `--kehribar-metin` #875518 | risk/uyarı etiketi | **5,10** / 5,46 | **En düşük gerçek değer.** "Emin" açısından rahatsız edici: uyarı, sayfanın en soluk öğesi. Koyulaştırmak yeni kehribar değeri ister → karar |

Hiçbiri AA'yı ihlal etmiyor (eşik 4,5; en düşük 5,10).

---

## B2. TİPOGRAFİ — iki ihlal bulundu, ikisi de düzeltildi

### B2a — "kanıt sayıları tek bileşenden" (§18.1)
Ölçüm: `font-variant-numeric` kullanan **serif** seçiciler tarandı.
`CanliSayi` dışında **beş** yerde daha büyük rakam basılıyordu ve
hiçbirinde `lining-nums` yoktu — yani **"472 → 47²" hatası oralarda
hâlâ canlıydı**:

| Seçici | Dosya | Durum |
|---|---|---|
| `.kahraman-deger` | HavzaKahraman.astro | **lining eklendi** |
| `.kart-stat` | HavzaPaneli.astro | **lining eklendi** |
| `.yas-deger` | HavzaYasBandi.astro | **lining eklendi** |
| `.stat-deger` | vaka/[slug].astro | **lining eklendi** |
| `.rakam` | stil-pilot.astro | **dokunulmadı** — `noindex, nofollow` pilot, yayın yüzeyi değil |

Doğrulama: tarama tekrarlandı → yayın yüzeyinde **lining eksik seçici 0**.

**Kapanmayan (bilinçli):** bu beş yerin `CanliSayi` bileşenine
*taşınması* yapılmadı. Her biri farklı düzen (birim eki, flex baseline,
`data-canlan` animasyon motoru) taşıyor; taşıma bir mimari iştir ve kendi
briefini hak eder. §18.1'in **ölçülebilir** kısmı (lining figür) kapandı.

### B2b — "belirsizlik dili küçültülmez" (§18.1)
Tarama: belirsizlik ifadesi (`doğrulanmadı`, `veri yok`, `bulunamadı`,
`şerh`…) taşıyan bloklar ve punto'ları eşleştirildi. **Bir ihlal:**

`IlPotansiyel.astro` `.pot-dipnot` — `"veri yok" satırlarının nedenini`
açıklayan blok **0,82rem**, komşu gövde (`.pot-rg li`) **0,93rem**.
Yani belirsizliğin açıklaması iddiadan küçük basılıyordu.
**Düzeltildi: 0,82 → 0,93rem** (komşu gövdeyle eşit).

---

## B3. HAREKET — envanter çıkarıldı, KALDIRMA YOK

Sekiz animasyon ve 60+ geçiş tarandı. §18.3 ölçütü: *hareket bir şeyi
kanıtlamalı*.

| Animasyon | Ne yapıyor | Değerlendirme |
|---|---|---|
| Sayım (`CanliSayiMotor`) | rakamın sayıldığını gösterir | **KANITLIYOR** — kullanıcı kararı, kalır |
| Hero sahne akışı (6 sahne) | sahanın kendisini gösterir | **KANITLIYOR** — kullanıcı kararı, kalır |
| `katman-acil` | katmanın açıldığını gösterir | **KANITLIYOR** (durum değişimi) |
| `sv-yuzey` (imleç) | etkileşim geri bildirimi | **KANITLIYOR** (geri bildirim) |
| `gk-fadeup` / `gk-yuksel` | içeriğin geldiğini gösterir | sınırda — giriş animasyonu |
| `v2-zipla` (chevron, 1s sonsuz) | "aşağıda içerik var" | sınırda — yönlendirme ama **sonsuz** |
| `sh-drift` / `sh-spray` / `sh-mist` | hero'da damla/köpük/sis | **sınırda — süs mü, konu mu?** |

**Neden hiçbiri kaldırılmadı:** envanterde *kanıtlamayan ve anlamsız*
(§18.3'ün "dikkat çekmek için titreşim/parıltı" örneği) tek bir öğe
çıkmadı. Su damlası/köpük/sis bir **su hukuku sitesinin hero'sunda konuyu
resmediyor**; ayrıca hero 28.07'de kullanıcı onayıyla yeniden tasarlandı.
Onları tek taraflı kaldırmak, M14'te düşülmeyen tuzağın aynısı olurdu:
**yakın zamanda bilinçle onaylanmış bir tasarımı ölçüm bahanesiyle geri
almak.** Sınırda üç kalem **kullanıcı kararına** bırakıldı.

**Ölçülen ve GEÇEN şart:** hareket-azaltma kapsaması **8/8**.
Yedisi CSS `@media (prefers-reduced-motion)` bloklarında; `sv-yuzey`
statik taramada "yok?" göründü ama `imlec.js` motoru
`matchMedia('(prefers-reduced-motion: reduce)')` ile **hiç başlamıyor**
(kaynak doğrulandı).

---

## B4. KAPILAR

| Kapı | Hedef | Ölçülen |
|---|---|---|
| 6 sayfa tipinde gövde ≥7,0 | 6/6 | **4/6** — il + kurum **6,58** (token yok, §B1) |
| Taban gerilemesi | 0 | **GERİLEME 0** · 175 ortak URL · sitemap KAYIP 0 |
| md14 G1-G6 | sapma 0 | **🟢 sapma YOK** (22 ölçüm, taban 28.07) |
| S1 (375 ilk ekran dert-sorusu) | korunur | G6 içinde — **korundu** |
| Konsol | 0 | **0** (3 sayfa × 2 kırılım) |
| 375 yatay taşma | 0 px | **0 px** (6/6) |
| md13 kontrast / a11y | yeşil / düşmedi | merge sonrası `--tam` ile ölçülecek |

**Kanıt kareleri:** `cikti/denetim/emin/{ana,il,rehber}-{1440,375}-sonrasi.png`

**Kapı durumu:** brief B4 "6 sayfa tipinde en dar oran ≥7,0" diyordu;
**4/6 sağlandı.** Kalan iki sayfa tipi için engel ölçülüp adlandırıldı
(§B1) ve B1'in kendi şartı gereği ("uygun token yoksa karar gerekli")
renk **icat edilmedi**. Diğer bütün kapılar geçti.

---

## Kullanıcı kararı bekleyen (İş B)

1. **`--murekkep-500` #3C5266 → #34495C** yapılsın mı? Tek token
   değişimiyle il + kurum gövdesi 6,58 → **7,57**, altı sayfa tipinin
   tamamı hedefe ulaşır. Yeni palet değeri = DESIGN.md değişikliği.
2. **`--kehribar-metin` #875518 (5,10)** koyulaştırılsın mı? Risk/uyarı
   etiketi bugün sayfanın en soluk öğesi — "emin" ile en çelişen nokta.
3. **Hero süs animasyonları** (`sh-drift/spray/mist`) kalsın mı?
   §18.3 açısından sınırda; hero kullanıcı onaylı.
4. **`v2-zipla`** sonsuz zıplama yerine tek seferlik/duran bir ipucu mu?
5. Beş rakam bileşeninin `CanliSayi`'ya **taşınması** ayrı iş olarak
   açılsın mı? (Bugün yalnız lining figür kuralı uygulandı.)
