# GECE RAPORU — 27/28 Temmuz 2026

**Worktree:** `/home/suha/projeler/suharitasi-gece` · **dal:** `gece-2026-07-27`
**MERGE YAPILMADI.** Canlı cron'lara, ana ağaç `izleme/state`'ine ve canlı
script davranışına DOKUNULMADI. Tüm koşumlar canlıya karşı **okuma**, tüm
yazımlar worktree içinde.

**DUR — merge ve cron kararları sizin.**

---

## 0. Brief ön kapısı (CLAUDE.md zorunlu)

`node arac/brief-denetci.mjs cikti/brief/2026-07-27T2100-gece-paketi.md`
→ **ENGEL 0 · UYARI 4** (iş sürdü):

| Kod | Uyarı | Bu gece nasıl karşılandı |
|---|---|---|
| T1 | GECE-RAPORU.md repoda yok, bağlam belirsiz | Üretim çıktısıdır — bu dosya |
| T6 | "commit" var ama git kilidi anılmamış | Worktree'de tek koşucu var, canlı kilit kullanılmadı; ana ağaca yazım yok |
| T6 | "canlı" var ama dist-sun/canlı-koşul anılmamış | Ölçümler **canlı URL'ye** karşı yapıldı (dist-sun'dan güçlü); md13 hariç hepsi TABAN=https://suharitasi.com |
| T8 | "kaldır" var ama geri dönüş yolu tanımsız | Her kaldırma ayrı commit → `git revert`; dotfile'lar için dosya yedeği alındı |

**Düşman geçişi (D1–D4).** Briefi FAIL ettirecek dört nokta arandı ve
üçü gerçekten çıktı — hepsi rapora işlendi:
- **D1 (boş referans):** brief `ana ağaçtaki veri/ham/` diyor; **ana ağaçta
  `veri/ham/` YOK**. Ham veri `suharitasi-potansiyel` worktree'sinde (NHYP
  1,7 GB + DEM 474 MB). Salt-okunur oradan kullanıldı, yeniden indirme
  yapılmadı. → Faz F ve I bu sayede koştu.
- **D2 (yanlış sayı):** brief "eksik 13 havza" diyor, ilk ölçüm 14 verdi —
  `konya` ↔ `Konya Kapalı Havzası` slug uyumsuzluğu. Düzeltildi, 13 doğru.
- **D3 (geçemeyecek şart):** "md4 bugün merge edildiyse Faz A atlanır" —
  merge edilmemiş ama iş `md4-2026-07-27` dalında tamamdı. Yeniden yazmak
  yerine cherry-pick + doğrulama yapıldı.
- **D4 (kanıt hafifletme):** Faz F'in "sığıyorsa hesapla" kapısı ilk
  ölçümde 5,76 GB / 5,9 GB ile *kıl payı geçiyordu*. Kabul edilmedi;
  gerçek ölçek testi koşuldu → 12,6 GB çıktı, kapı GEÇMEDİ.

---

## 1. Özet tablo

| Faz | Sonuç | Commit |
|---|---|---|
| 0 — Durum | md4 dalda tam, main'e merge edilmemiş → Faz A koştu | — |
| A — md4 medya | 🟢 cherry-pick + doğrulandı, canlı 6/6 | `bf08d52` |
| B — K2 paketi | 🟢 md10 kaldırıldı, sonBasariliKosu düzeltildi, `--kok` eklendi | `88ce643` |
| C — su-izleme F4-3 | 🟢 4/4 senaryo, gerileme yok | `e1ed964` |
| D — OpenAlex artımlı | 🟡 **kota duvarı** — kök neden bulundu, koşum sürüyor | (aşağıda) |
| E — RG nöbetçisi | 🟢 `--test` kanıtı: 109 satır ayrıştırıldı | `1ef88e1` |
| F — TWI | 🔴 **sığmıyor** — ölçüldü (12,6 GB / 5,9 GB) | `cbcd74d` |
| G — Kontrast kalemi | 🟢 md13 eklendi; **2 gerçek bulgu** | `4547006` |
| I — 153 kütle koordinat | 🟢 **doğrulanamadı 153 → 120** | `a0d086e` |
| J — Su Kanunu taslağı | ⚠ **bulundu ama yayım kısıtlı** — hukuk kararı sizde | `198c331` |
| K — Engelli kaynaklar | 🟢 **TÜİK açıldı** → ilçe doğrulaması 0 fark | `f5ac081` |
| L — imlec.js kalıntısı | 🟢 üç kanal no-op kanıtı, ölü dal kaldırıldı | `67156f5` |
| M — Hijyen | 🟢 PATH düzeltildi + kanıtlandı; temizlik komutları aşağıda | (depo dışı) |
| N — NHYP nöbetçisi | 🟢 iki kanal, ikisi de sağlığını kanıtlıyor | `3342749` |
| EK — canlı 2 kırmızı | 🟢 menü kırmızısı **yanlış alarmmış**, kapandı | `e430d66` |
| H — Tam denetim | aşağıda | — |

**Çöken faz yok.** Her faz sonuç üretti.

---

## 2. Gecenin en önemli üç bulgusu

### 2.1 Sağlık sistemi kendi kendine yanlış alarm üretiyordu (üç ayrı yerde)

Aynı hata deseni üç bağımsız yerde çıktı: **yapılandırma, siteden sonra
güncellenmemiş.**

| Kontrol | Neyi arıyordu | Gerçek | Sonuç |
|---|---|---|---|
| md4 medya | `#world .sw-scene` | v2 hero `#v2-videolar` | dün teşhis edildi |
| md12 etkileşim | `#sv-menu` / `.sv-menu-ac` | `#pm-menu-dugme` / `#pm-mobil-panel` | **bu gece bulundu** |
| md10 GRACE | `grace-turkiye.json` 192s tazelik | dosya ~aylık değişir | **yapısal olarak imkânsız şart** |

md12'nin ağırlığı ayrı: menü **aylardır hiç test edilmiyordu**. 24.07
menü arızasının senaryosu açıktaydı ve kimse görmüyordu — kontrol her
koşuda kırmızı verdiği için "bilinen arıza" sayılıyordu. Revizyondan
sonra 4/4 geçiyor: **menü canlıda gerçekten çalışıyor.**

Buna bağlı ikinci sıra etki: bir tek kırmızı, `sonBasariliKosu` damgasını
donduruyor, bekçi de "sağlık sistemi koşmuyor — 22 saat" diye **ikinci bir
yanlış alarm** üretiyordu (bu sabahki `UYARI-SAGLIK.md` tam olarak buydu).
Artık canlılık damgası kırmızıdan bağımsız.

> Ana ağaçtaki `UYARI-SAGLIK.md` bu sabahtan kalma ve bayat. Bekçinin
> bir sonraki 07:00 koşumu sorunsuz geçerse dosyayı **kendisi silecek**
> (o dal zaten çalışıyor — bu gece izole kancayla koşuldu: "sağlık OK").

### 2.2 Nisan 2026 Su Kanunu Taslağı bulundu — ama yayımlanmaması istenmiş

Tam metin erişilebilir: TOBB üst yazısı 24.04.2026, Genel Gerekçe 4 s. +
**Su Kanunu Taslağı 17 s.** (MADDE 1–…, md. 11: su tahsis yetkisi DSİ'de) +
görüş formu. 23 sayfa, bir ticaret odasının sitesinde.

**Ama üst yazı aynen şunu diyor:** *"taslak metnin … Oda ve Borsalarımızın
internet siteleri dâhil kamuya açık mecralarda yayımlanmaması ve üçüncü
taraflarla aleni şekilde paylaşılmaması önemle rica edilmektedir."*

Yani bulunan kopya, yayımlanmaması istenen bir belgenin ricaya aykırı
yayımlanmış hâli. Bakanlık 268 kuruma yazıyla göndermiş; **resmî kamuya
açık yayın yapılmamış** (tarimorman.gov.tr'de yalnız 2019 sürümü var).

Bu teknik değil hukuk kararıdır ve sizindir. Bu gece hiçbir yönde adım
atılmadı: siteye tek satır girmedi, `hedefler.conf` değişmedi. Ayrıntı ve
üç seçenek: `rapor/gece-faz-j-su-kanunu-taslak.md`.

**Yan bulgu (asıl F4-8 arızası):** izlediğimiz hedef `Su Kanunu
Taslağı.pdf`'in Last-Modified'ı **31 Ekim 2019**. Nisan 2026 taslağı ayrı
bir belge — mevcut izleme hedefi onu **asla göremez**.

### 2.3 TÜİK engeli kalkmış — kapalı bir kuyruk maddesi kapandı

Faz 2'de "TR-IP engeli" denilen kaynaklar yeniden denendi:

| Kaynak | Önce | Şimdi |
|---|---|---|
| TÜİK MEDAS / data.tuik.gov.tr | erişilemiyordu | **200** (MEDAS JS istiyor, veri portalı açık) |
| tuik.gov.tr favori_raporlar.xlsx | denenmemişti | **200, 3,7 MB indi** |
| YÖK Tez | erişilemiyordu | **200** |
| e-İçişleri MulkiIdariBolumleri | 000 | **hâlâ 000** (45 sn zaman aşımı) |
| illeridaresi.gov.tr | 000 | **boş yanıt** — sertifika `yahyali.gov.tr` adına; bu **engel değil, barındırma arızası** |

TÜİK'in "İLÇE NÜFUSU" sayfasından resmî il/ilçe listesi çıkarıldı ve OSM
türevi dizinle karşılaştırıldı:

- adlı ilçe ortak **897** → il eşlemesi **aynı 897, çatışan 0**
- merkez ilçesi olan il: TÜİK **51** = OSM **51**, fark **0**

**`kutle-il.json`'da yeniden değerlendirilecek ilçe çıkmadı.** Kuyruktaki
"İLÇE DİZİNİ ÇAPRAZ DOĞRULAMA" maddesi kapanabilir. Sınır kayıtlı: TÜİK
dosyası 2021 ADNKS tarihli.

---

## 3. Faz ayrıntıları

### Faz A + B — sağlık sistemi (commit `bf08d52`, `88ce643`)

md4 revizyonu `md4-2026-07-27` dalından cherry-pick edildi ve doğrulandı.

- **B1** — md10'un GRACE kalemi kaldırıldı. Kalem yapısal olarak yanlıştı:
  `grace-turkiye.json` cron koştuğunda değil GSFC yeni MASCON sürümü
  yayımladığında (~aylık) değişir; 8 günden eski olması **sağlıklı
  sistemde de normaldir**. Doğru sinyal bekçide zaten var (`durum.json`
  her koşuda yazılır).
- **B3** — md10'un baraj kalemi bekçiyle mükerrerdi (md10 48s, bekçi 26s
  ve bekçininki gerçek cron takvimine kalibre). İki kalem de kalkınca
  **md10 tümden kaldırıldı** — veri tazeliği pipeline'ın *dışından*
  denetlenir, site-saglik canlı siteyi denetler.
- **B2** — `sonBasariliKosu` artık "koşum tamamlandı" damgası. Kırmızısız
  koşum zamanı bilgi kaybı olmasın diye `sonKirmizisizKosu`'da korunuyor.
  Bekçi metni "son başarılı koşu" → "son koşu" olarak düzeltildi.
- **`--kok <dizin>`** eklendi: depo kökü artık parametre, worktree'de
  canlı state/log kirletmeden koşum yapılabiliyor. **İzole kökte otomatik
  onarım zorla kapalı** (yanlış dala commit riski).

**B4 kanıtı** — düzeltilmiş script izole kökte, canlıya karşı okuma:

```
ana ağaç 19:33 --tam : 4 kırmızı  (md4, GRACE, geo-seo, etkileşim)
gece worktree --tam  : 2 kırmızı  (geo-seo, kontrast) + etkileşim GEÇTİ
                       sahte kırmızı 0/2 · gerçek sorunlar duruyor
```

### Faz C — su-izleme Last-Modified koruması (commit `e1ed964`)

HTTP 200 + boş `Last-Modified` başlığı iki yönlü bozuktu: taban `""` ile
eziliyor **ve** "BÜYÜK OLAY: Su Kanunu Taslağı güncellendi" yanlış alarmı
üretiliyordu. Üstelik taban kaybolduğu için arada gerçek bir değişiklik
olsa **görülmezdi**. Başlığın yokluğu sunucu yapılandırmasıdır, belgenin
değişmesi değil.

Kalıcı test bırakıldı: `arac/test/su-izleme-lastmod.test.sh` — gerçek
fonksiyon metnini dosyadan çıkarıp koşuyor (kopya değil). **4/4:**

| Senaryo | Sonuç |
|---|---|
| taban kurulu + lm="" | taban ezilmedi, olay 0, hata 0, LASTMOD-BOS logu |
| taban yok + lm="" | boş taban yazılmadı |
| gerçek değişiklik | **hâlâ olay üretiyor** (gerileme yok) |
| değişmeyen başlık | mükerrer olay yok |

### Faz D — OpenAlex: kök neden bulundu, kota duvarı

Eski geri-çekilme merdiveni (30/75/150 sn) **yapısal olarak yetersizdi.**
Ölçülen gerçek 429 cevabı:

```
x-ratelimit-limit: 1000 · x-ratelimit-remaining: 0
x-ratelimit-credits-required: 10 · retry-after: 4215
```

OpenAlex **kredi tabanlı kotaya** geçmiş: istek başına 10 kredi, pencere
~70 dakikada sıfırlanıyor. Saniyelik merdiven ne kadar uzatılsa da bu
pencereyi aşamaz. Script `Retry-After` başlığını okuyup **sunucunun
söylediği süreyi** bekleyecek biçimde düzeltildi (90 dk tavanla).

- 32 il × 2 sorgu = 64 istek = 640 kredi → **1000 kredilik tek pencereye
  sığar.** Kota sıfırlandığında koşum tek seferde bitmeli.
- Koşum rapor yazılırken hâlâ bekleme fazındaydı; **il kapsamı 49/81'de
  değişmedi.** Sabah `log/openalex-gece2.log` bakılmalı.
- `baski_uygun` alanı künyeye eklendi (DOI/açık URL yoksa `false`);
  basım katmanı zaten süzüyordu, artık veride de denetlenebilir.

### Faz F — TWI: sığmıyor, ölçüldü (commit `cbcd74d`)

`arac/twi-kapi.py` gerçek TWI zincirini (priority-flood → D8 → akış
birikimi → TWI) koşup süre ve tepe belleği ölçüyor.

**İlk tahmin yanlıştı ve kabul edilmedi.** Dizi sayımıyla 5,76 GB
çıkmıştı (5,9 GB'a kıl payı sığıyor). Gerçek ölçek testi koşuldu:

| Mozaik | Mpx | s/Mpx | tepe RSS |
|---|---|---|---|
| 1×1 karo | 1,44 | 7,73 | 144 MB |
| 2×2 karo | 5,76 | 9,30 | 380 MB |
| 3×3 karo | 12,96 | 10,44 | 771 MB |

Maliyet **süperlineer** (priority-flood O(n log n)); bellek marjinal
maliyeti **54,3 MB/Mpx**. Türkiye mozaiği 230,4 Mpx →

- **RAM: ~12,6 GB gerekli / 5,9 GB var → KAPI GEÇMEZ**
- süre: ~0,9 saat (sorun süre değil, bellek)

81 il TWI **hesaplanmadı**. `morfoloji.json`'daki bayat "2C/4GB" gerekçesi
ölçülen değerle değiştirildi.

**Geçerli tasarım hazır (uygulanmadı):** havza-bazlı D8. Hidrolojik olarak
**doğru**, yaklaşıklık değil — akış havza sınırını geçmez. En büyük havza
~2,8 GB → sığar. Bu gece uygulanmadı: doğrulanmamış bir hidroloji modelini
kamuya açık, maddi karara yönlendiren bir veri katmanına sokmak
"altyapıda hızlı, iddiada yavaş" ilkesine aykırı. Ayrı brief ister.

### Faz G — md13 kontrast kalemi (commit `4547006`)

27.07 kontrast arızasını **kullanıcı bulmuştu**; sistemde onu görecek
kontrol yoktu. Artık var. Örneklem tip başına bir sayfa (sızıntı tip
bazında yayılıyor). Ölçüm gerçek zemini alfa-harmanlayarak buluyor.

Kanıt koşumu — 6 tip, 1328 düğüm:

| Tip | Sonuç |
|---|---|
| il · rehber · persona · havza | **ihlal 0** |
| ana (`/`) | 4 ihlal, en kötü **1,58:1** — `span.no` dekoratif adım numaraları, `rgba(255,255,255,0.15)` 48px |
| araç (`/hangi-kurum/`) | 4 ihlal, **4,42:1** (gereken 4,5) — `span.ik-rozet.ik-teyit`, **9,28px** metin |

**İkisi de sizin kararınız** (tasarım kara listede):
- `/` — "01/02/03/04" numaraları bilinçli hayalet mi? Öyleyse istisna
  yazılır. Değilse alfa yükseltilir.
- `/hangi-kurum/` — 9,28px metin 4,42:1'de. Eşiğin hemen altı, **küçük
  metinde 4,5 şart**. Rengi bir tık koyulaştırmak yeter. Bence bu
  düzeltilmeli, istisna yazılmamalı.

İstisna mekanizması eklendi ama **liste boş bırakıldı** — istisna yazma
yetkisi sizde. Karar çıkana kadar md13 kırmızı kalır; bu bilinçlidir.

### Faz I — kütle koordinatları: 153 → 120 (commit `a0d086e`)

NHYP izleme tablolarında **kuyu kodu kütle kodunu içeriyor**
(`TR04050204` + `0147` → `TR040502040147`) — kuyunun koordinatı kütlenin
içindeki bir noktadır. Geçerli konum kanıtı.

**İki hata ölçülerek elendi:**

1. ±2 satır penceresi **komşu kuyunun** koordinatını kapıyordu —
   `TR04050208`'e tablonun 2. satırının (`TR04050206`) koordinatı
   atanmıştı. Aynı-satır kuralı sızıntıyı yapısal olarak imkânsız kılar.
2. UTM dilim belirsizliği: aynı (E,N) çifti 35/36/37'de farklı boylam
   verir ve PDF'lerin çoğu dilimi **beyan etmiyor** (yalnız Gediz "Zone
   35" yazıyor). Dilim, havzanın *doğrulanmış* il kümesine düşme şartıyla
   seçildi; birden çok dilim geçerliyse koordinat kullanılmadı.

**Dönüşüm bağımsız doğrulandı:** PDF'in kendi ondalık derecesini de
taşıyan **224 satırda** sapma ortanca **191,9 m**, azami 192,7 m — sabit
ofset, ED50↔WGS84 datum farkı. İl ölçeğinde önemsiz.

| | önce | sonra |
|---|---|---|
| eşleşti | 314 | **347** |
| belirsiz | 5 | 5 |
| doğrulanamadı | 153 | **120** |

33 kütle eşleşti (29 tek il, 4 kütle gerçekten iki ile yayılıyor — kuyu
sayıları kanıtta). Koordinatsız 120 kütle **"doğrulanamadı" kaldı**;
tahmin ataması sıfır.

### Faz L — imlec.js ölü dalı (commit `67156f5`)

Üç kanal + gizli tetik taraması, hepsi sıfır:

1. **sınıfı ekleyen 0** — kaynak, ana ağaç `dist/` ve canlı 4 sayfada
   `classList.add/toggle` · `className=` · `setAttribute` eşleşmesi yok;
   canlı HTML'de `sv-menu-goruntude` geçişi 0.
2. **dinleyici 0** — 5 `addEventListener`'ın hiçbiri bu sınıfa bağlı
   değil; hepsi `baslat()` içinde, `baslat()` koşullu.
3. **koşulsuz yan etki 0** — `baslat()` dışında çalışan tek kod iki
   `matchMedia`.
4. gizli tetik: dinamik sınıf adı kurulumu 0; "goruntude" parçası
   kaynakta yalnız o iki kuralda.

İki ölü CSS kuralı kaldırıldı, `node --check` geçti.

---

## 4. Merge'e hazır liste

Sıra önerisiyle. Hepsi tek dalda (`gece-2026-07-27`), tek tek revert
edilebilir.

| # | Commit | Ne | Risk |
|---|---|---|---|
| 1 | `bf08d52` | md4 medya revizyonu (md4 dalından) | düşük — ölçüm kodu |
| 2 | `88ce643` | K2: md10 kaldırma + sonBasariliKosu + `--kok` | düşük — varsayılanlar değişmedi |
| 3 | `e1ed964` | su-izleme F4-3 + kalıcı test | düşük — 4/4 test |
| 4 | `67156f5` | imlec.js ölü dal | düşük — üç kanal kanıtı |
| 5 | `e430d66` | md12 menü revizyonu | düşük — kırmızıyı yeşile çevirdi |
| 6 | `4547006` | md13 kontrast kalemi | **orta** — merge sonrası md13 kırmızı verecek (2 açık karar) |
| 7 | `f5ac081` | ilçe çapraz doğrulama kaydı | düşük — yalnız metadata |
| 8 | `a0d086e` | kütle koordinat ikinci geçişi | **orta** — 33 kütle **il sayfalarında görünmeye başlar** (yayın) |
| 9 | `cbcd74d` | TWI ölçüm kapısı + gerekçe düzeltmesi | düşük |
| 10 | `1ef88e1` `3342749` | iki nöbetçi scripti | düşük — cron'a bağlı değil |
| 11 | `198c331` | Faz J raporu | düşük — yalnız rapor |

**8 numara yayın kararıdır**: `kutle-il.json`'daki 33 yeni eşleşme il
sayfalarındaki "su nerelerde çıkabilir" bloğuna girer. Kanıt zinciri
sağlam ama karar sizin.

---

## 5. Cron kurulum satırları — EKLENMEDİ

İkisi de yazıldı, `--test` ile kanıtlandı, **crontab'a dokunulmadı.**
Merge sonrası onayınızla:

```cron
# RG işletme sahası nöbetçisi — haftalık Sal 04:20 UTC (mevcut cron'larla çakışmaz)
20 4 * * 2 nice -n 10 /usr/bin/python3 /home/suha/projeler/suharitasi/arac/rg-nobetci.py --kosum >> /home/suha/projeler/suharitasi/log/rg-nobetci.log 2>&1

# NHYP yayın nöbetçisi — haftalık Çar 04:40 UTC
40 4 * * 3 nice -n 10 /usr/bin/python3 /home/suha/projeler/suharitasi/arac/nhyp-yayin-nobetci.py --kosum >> /home/suha/projeler/suharitasi/log/nhyp-nobetci.log 2>&1
```

Çakışma denetimi: mevcut cron'lar 06:00/07:00/07:30/15:00/16:00/19:30 ve
her 10 dk bellek logu. 04:20 ve 04:40 boş.

**Kurulumdan sonra yapılacak** (SÜREKLİLİK İLKESİ): her iki nöbetçinin
`izleme/state/*.json` damgası `saglik-bekcisi.sh`'e canlılık kalemi
olarak eklenmeli — yoksa nöbetçinin kendi sessiz ölümünü kimse görmez.
Bu gece eklenmedi çünkü dosyalar henüz doğmadı (kontrol kırmızı verirdi).

---

## 6. TR-IP listesi — sizden denenecekler

Bu sunucudan **hâlâ** erişilemeyenler:

| Kaynak | Ölçülen | Yorum |
|---|---|---|
| `e-icisleri.gov.tr/Anasayfa/MulkiIdariBolumleri.aspx` | 45 sn zaman aşımı, 000 | TR-IP kısıtı şüphesi sürüyor |
| `illeridaresi.gov.tr` | boş yanıt; sertifika `yahyali.gov.tr` adına | **engel değil** — barındırma/yönlendirme arızası. Sizin bağlantınızdan da açılmayabilir |

**Artık gerekmiyor:** e-İçişleri'ni istememizin sebebi ilçe→il çapraz
doğrulamasıydı; TÜİK resmî listesiyle **0 farkla** yapıldı (§2.3).

**Faz J'de TR-IP engeli çıkmadı** — tüm adaylar 200 döndü. Taslağın
bulunamamasının sebebi erişim engeli değil, resmî kamuya açık yayının
yapılmamış olması.

---

## 7. Hijyen (Faz M)

### (a) Dal/worktree durumu — komutlar YAZILDI, ÇALIŞTIRILMADI

| Dal | main'e göre | Worktree kirliliği |
|---|---|---|
| `denetim-2026-07-25` `duzeltme-2026-07-25` `k1-git-log-hijyeni` | MERGED | worktree yok |
| `kontrast-2026-07-27` `menu-2026-07-27` `menujs-2026-07-27` `potansiyel-2026-07-27` `temizlik-2026-07-27` | MERGED | yalnız `node_modules` |
| `donusum-2026-07-26` | MERGED | **commit edilmemiş dosyalar var** |
| `md4-2026-07-27` | açık (1 commit) | temiz — içeriği bu gece cherry-pick edildi |
| `gece-2026-07-27` | açık (13 commit) | bu gecenin işi |

**`donusum` worktree'sinde kaybolacak dosyalar var** — silmeden önce:
`denetim/DONUSUM-ANALIZ.md`, `denetim/K2-KESIF.md`, `denetim/kare/canli-sonrasi/`,
`donusum-kare.mjs`, `kare-canli.mjs`. (İlk ikisi ana ağaçta da untracked duruyor.)

```bash
# ÖNCE: donusum worktree'sindeki üretilmiş dosyaları kurtar
cp -r /home/suha/projeler/suharitasi-donusum/denetim/kare /tmp/kare-yedek

# Merge edilmiş worktree'ler + dalları
for w in kontrast menu menujs potansiyel temizlik donusum; do
  git worktree remove --force /home/suha/projeler/suharitasi-$w
done
git branch -d kontrast-2026-07-27 menu-2026-07-27 menujs-2026-07-27 \
              potansiyel-2026-07-27 temizlik-2026-07-27 donusum-2026-07-26 \
              denetim-2026-07-25 duzeltme-2026-07-25 k1-git-log-hijyeni
git push origin --delete donusum-2026-07-26 potansiyel-2026-07-27

# md4: içeriği gece dalına alındı — gece merge edilirse gereksiz
git worktree remove /home/suha/projeler/suharitasi-md4 && git branch -D md4-2026-07-27
git push origin --delete md4-2026-07-27
```

> `potansiyel` worktree'si **1,7 GB NHYP + 474 MB DEM ham veri tutuyor** ve
> bunlar başka hiçbir yerde yok. Silinirse yeniden indirilmesi gerekir.
> Silmeden önce `veri/ham/`'ı kalıcı bir yere taşıyın.

### (b) PATH tekrarı — DÜZELTİLDİ ve kanıtlandı

Brief 4× diyordu, ölçülen **6×**. Kaynak: hem `~/.profile` hem `~/.bashrc`
`~/.local/bin`'i **koşulsuz** ekliyor ve `.profile` `.bashrc`'yi source
ediyor → iç içe her kabuk bir tane daha ekliyor.

İkisi de idempotent yapıldı (`case ":$PATH:"`). Temiz ortamda ölçüm:

| | login+interactive | 3 kat iç içe |
|---|---|---|
| eski hal | 2 | **3** (büyüyor) |
| yeni hal | **1** | **1** (sabit) |

Öncelik korundu — `~/.local/bin` hâlâ ilk sırada. Yedekler:
`cikti/denetim/profile.yedek`, `cikti/denetim/bashrc.yedek`.
*(Not: bu değişiklik depo dışıdır, merge'e bağlı değil, zaten etkin.
Açık kabuklarınız eski PATH'i taşımaya devam eder.)*

### (c) Yabancı worktree

`/tmp/claude-1000/.../scratchpad/wt-base` — başka bir oturumun scratch
worktree'si, detached HEAD, yalnız `node_modules` kirli.
`git worktree prune` ile düşer.

---

## 8. Tam sistem denetimi (Faz H)

Gecenin kendi değişiklikleri dahil. Etiketler: **[VERİ]** ölçülmüş ·
**[YÖNTEM]** yaklaşım · **[VARSAYIM]** doğrulanmamış.

### 8.1 Yüksek — düzeltme brief'i hazır

**H1. `public/s/*.js` build hattını atlıyor; yorumlarıyla ham yayımlanıyor.**
**[VERİ]** Canlı ölçüm:

| Dosya | Boyut | Yorum satırı | İlk satır |
|---|---|---|---|
| `su-sim.js` | 9.309 B | 12 | `/* Gerçek zamanlı su yüzeyi simülasyonu…` |
| `imlec.js` | 5.571 B | 6 | `/* Su damlası imleç (sv-imlec)…` |
| `sayfa.js` | 2.318 B | 5 | `/* İçerik sayfası davranışları…` |
| `canlan.js` `durumum.js` `hangi-kurum.js` | 1.777 / 1.533 / 988 B | 1 / 3 / 1 | ham |

CLAUDE.md "Kopyalanma direnci" m.1-2 build çıktısında minify+obfuscate ve
sourcemap üretilmemesini şart koşuyor. `_astro/` varlıkları bu kurala
uyuyor (sourceMappingURL 0). Ama `public/` Astro/Vite tarafından
**işlenmez** — oradaki altı dosya, Türkçe açıklama yorumlarıyla birlikte
aynen yayımlanıyor. *(Ek kanıt: silinmiş `menu.js` hâlâ Cloudflare edge
cache'inden 200 dönüyor — `cf-cache-status: HIT`, `s-maxage=604800`;
hiçbir sayfa ona link vermiyor, zararsız ama 7 güne kadar erişilebilir.)*

> **Düzeltme brief'i taslağı:** `public/s/*.js` → `src/scripts/` altına
> taşınıp Astro/Vite hattına sokulur (`import` ile veya
> `astro:build:done` kancasında esbuild `minify:true, sourcemap:false`).
> Bitti tanımı: canlı `/s/*.js` yolları 404 **veya** minify edilmiş;
> yorum satırı 0; Lighthouse ≥90 korunur; md4/md5/md12 yeşil kalır.
> Not: `imlec.js` `Sayfa.astro:519`'dan, `sayfa.js` aynı yerden yükleniyor
> — taşıma sırasında `is:inline` kaldırılmalı.

**H2. `/harita/` sayfasında h1 YOK.**
**[VERİ]** `curl` ile ölçüldü: `<h1>` sayısı **0**, başlık hiyerarşisi
`<h2>25 havzada suyun durumu nedir?` ile başlıyor. Örneklenen diğer 10
sayfa tipinin hepsinde tam olarak bir h1 var. Hem erişilebilirlik hem SEO
kaybı; sitenin ikinci en önemli sayfası.

**H3. Ana sayfada öz-cevap bloğu yok.**
**[VERİ]** Örneklenen 11 sayfa tipinden 10'unda `doc-abstract` var, `/`'de
yok. CLAUDE.md "İçerik ilkesi" öz-cevabı "her içerik sayfası (rehber,
havza, araç)" için şart koşuyor — v2 hero bir landing. **[VARSAYIM]** Bu
bir kapsam sorusu olabilir, arıza değil. Karar: ya `/`'ye öz-cevap girer,
ya `cekirdek-sayfalar.json`'a "landing muaf" notu düşülür. Şu hâliyle
`7-geo-seo` sürekli kırmızı kalır ve alarm değeri aşınır.

### 8.2 Orta

**H4. `SIRADAKILER.md` 811 satıra ulaştı.** **[VERİ]** 41 açık madde, 13
"ONAY BEKLİYOR" (5'i `[ESKİ]` etiketli tarihsel kayıt), 18 "YAPILDI".
Tek iş kuyruğu olma işlevi aşınıyor — her oturum başında okunması gereken
dosya artık taranamıyor. **[YÖNTEM]** Öneri: kapanmış maddeler
`arsiv/SIRADAKILER-2026-07.md`'ye taşınır, ana dosya açık maddeler +
onay bekleyenlerle sınırlanır.

**H5. Merge bekleyen 6 iş birikti.** md4, su potansiyeli katmanı (81 il),
hangi-kurum, palet yenileme, hero ve bu gece — hepsi "KULLANICI ONAYI
BEKLİYOR". Bu, "iş kapanış kuralı"nın doğru çalıştığının işareti ama
birikme riski üretiyor: onay sırası uzadıkça dallar birbirinden uzaklaşıyor
ve bu gece görüldüğü gibi (md4 ↔ gece) cherry-pick gerektiriyor.

**H6. `BRIEF.md` yol haritası gerçeğin gerisinde.** **[VERİ]** Aşama 1
(derin kazı), 2 (veri modeli) ve 4 (hukuk/içerik) `[ ]` işaretli; oysa
`KAYNAKLAR.md` var, 172 sayfalık içerik katmanı canlı, 11 rehber + 82 il
sayfası + 26 havza sayfası yayında. Ayrıca BRIEF'teki "2 vCPU/4GB" kaydı
bayat (CLAUDE.md'de düzeltilmiş: 4C/8GB). Brief çatı belge olduğu için
gerçeği yansıtmalı.

### 8.3 Düşük / temiz çıkanlar

- **Mimari:** `package.json` bağımlılıkları `astro`, `maplibre-gl`, `three`
  — React/Next izi **0**. Stack kuralı korunuyor. **[VERİ]**
- **Pipeline hijyeni:** 9 script tarandı; `set -euo pipefail` her yerde,
  `git add … 2>/dev/null` **0 gerçek kullanım** (grep isabetlerinin hepsi
  "kaldırıldı" diyen yorum satırı), commit teyidi commit atan üç scriptin
  üçünde de var, hepsi aynı `flock` kilidini kullanıyor. **[VERİ]**
- **Güvenlik başlıkları:** CSP + HSTS(preload) + `nosniff` +
  `referrer-policy` + `permissions-policy` tam. **[VERİ]**
- **robots.txt:** Googlebot/Bingbot/Applebot + GPTBot/OAI-SearchBot açık
  — SEO/GEO önceliği kopyalama-önlemeden önce, kural korunuyor. **[VERİ]**
- **SEO/GEO kapsamı:** 11 sayfa tipinde title 11/11, meta-desc 11/11,
  canonical 11/11, JSON-LD 11/11, OG 11/11, **alt'sız görsel 0**. **[VERİ]**
- **Emoji kuralı:** `src/` altındaki emoji geçişlerinin hepsi kod
  yorumunda; kullanıcı arayüzünde emoji yok. **[VERİ]**
- **Dark mode:** `prefers-color-scheme: dark` kuralı **0** — light-only
  kararı korunuyor. **[VERİ]**
- **Ticari hiza:** BRIEF'in 1. gelir kalemi (otorite vitrini) sahada
  karşılığını buluyor — `/hakkinda/` künye + randevu bağı var, "dava
  alırız" dili yok, TBB tavrı korunmuş. 2. kalem (B2B raporlar) için
  altyapı birikiyor (81 il potansiyel katmanı, kütle verisi) ama **ürün
  yüzeyi henüz yok**. **[YÖNTEM]**

### 8.4 Gecenin kendi işine dönük eleştiri

- **`--kok` bayrağı** canlı davranışı değiştirmiyor (varsayılan sabit) ama
  yeni bir kod yolu ekledi. İzole kökte onarımın zorla kapatılması bunu
  güvenli kılıyor; yine de merge sonrası ilk cron koşumunda
  `SITE-DURUM.md`'nin normal yazıldığı **doğrulanmalı**. **[VARSAYIM]**
- **md13 kontrast** ilk hâlinde sayfa başına 400 düğüm sınırı vardı ve
  sınıra dayanınca **susuyordu** — CLAUDE.md'nin "sessiz kap yasağı"na
  aykırı. Denetim sırasında yakalandı ve **gece içinde düzeltildi**: sınır
  aşılırsa artık 🟡 + `kapsam kırpıldı: rehber 400/543` yazıyor. Ölçüm
  gerçekti — o sayfada 143 düğüm görülmüyordu. Sınır 1500'e çıkarıldı,
  yeniden koşuldu: kırpma **0**, bulgu seti değişmedi (aynı 2 ihlal). Yani
  §8.1'deki bulgular **tam kapsamla** doğrulanmış oldu. **[VERİ]**
- **Faz I'de** 4 kütlenin iki ile yayıldığı sonucuna kuyu sayısı çokluğuyla
  varıldı; kütlenin gerçek sınır poligonu **elimizde yok**. Kuyular iki ilde
  diye kütle iki ile yayılıyor demek makul ama **kanıtlanmış değil**.
  Kanıt alanında kuyu sayıları açıkça yazıyor. **[VARSAYIM]**
- **Faz K'de** TÜİK dosyası 2021 ADNKS. 2021 sonrası yeni ilçe kurulmadığı
  **doğrulanmadı**; kayıt `sinir` alanına yazıldı. **[VARSAYIM]**

---

## 9. Sabah için kısa liste

1. **Karar:** md13'ün iki bulgusu — `/` hayalet numaralar (istisna mı,
   düzeltme mi) ve `/hangi-kurum/` 9,28px rozet (bence düzeltme).
2. **Karar:** Su Kanunu taslağı — yayım kısıtı karşısında ne yapılacak.
3. **Karar:** merge sırası; özellikle 8 numara (33 kütle yayına girer).
4. **Karar:** cron kurulumu (E ve N).
5. **Bak:** `log/openalex-gece2.log` — kota penceresi açıldıysa 32 il inmiş
   olmalı.
6. **Kuyruktan düşebilir:** "İLÇE DİZİNİ ÇAPRAZ DOĞRULAMA" (0 fark),
   "md4 yanlış alarm" (kapandı), "imlec.js kalıntısı" (kapandı).
