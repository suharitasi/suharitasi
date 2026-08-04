# K2 — KEŞİF (salt-okunur, uygulama YOK)

Tarih: 2026-07-25 21:30-21:34 UTC · main = `6d0e209` (K1'in 2 commit'i push
edilmemiş, 05:30 koşumunu bekliyor) · Hiçbir proje dosyası değiştirilmedi;
tek yazılan dosya bu rapordur. Commit/push YAPILMADI (Y2).

## 0. Ön kontrol

| Kontrol | Beklenen | Bulunan | Sonuç |
|---|---|---|---|
| `date -u` | 05:30 koşumuna >20 dk | 21:30 UTC (≈8 saat) | ✅ |
| dal | main | main | ✅ |
| `git rev-parse main` | 6d0e209… | `6d0e209167c4f18cbf2249f3e586a430bad6e33e` | ✅ |
| status (dist hariç) | — | yalnız `?? UYARI-SAGLIK.md` | ✅ |
| `rev-list --count @{u}..HEAD` | 2 | 2 | ✅ |

---

## 1. md10 NEDİR

### 1.1 Üreten kod — `arac/site-saglik.mjs:476-494`

```js
async function md10_veriTazeligi() {
  const kurallar = [
    { dosya: 'data/canli/baraj.json', saat: 48, ad: 'baraj' },
    { dosya: 'data/canli/grace-turkiye.json', saat: 8 * 24, ad: 'GRACE' },
  ];
  const bayat = [], olcum = [];
  for (const k of kurallar) {
    const tam = join(KOK, k.dosya);
    if (!existsSync(tam)) { bayat.push({ ...k, yas: 'dosya YOK' }); continue; }
    const { mtime } = statSync(tam);
    const yasSaat = (Date.now() - new Date(mtime).getTime()) / 3600000;
    olcum.push({ ad: k.ad, yasSaat: +yasSaat.toFixed(1), esikSaat: k.saat });
    if (yasSaat > k.saat) bayat.push({ ...k, yasSaat: +yasSaat.toFixed(1) });
  }
  kaydet('10-veri-tazeligi', bayat.length ? 'kirmizi' : 'gecti',
    bayat.length ? `${bayat.map((b) => `${b.ad} ${b.yasSaat ?? b.yas}`).join(', ')} — eşik aşıldı`
                 : olcum.map((o) => `${o.ad} ${o.yasSaat}s/${o.esikSaat}s`).join(' · '),
    { olcum, bayat }, ['tam']);
}
```

Çağrı: `arac/site-saglik.mjs:653` —
`await korumali('10-veri-tazeligi', ['tam'], md10_veriTazeligi);`
Yalnız `--tam` modunda koşar (`--hizli`'da koşmaz).

### 1.2 Ölçtüğü veri kalemleri

İki kalem — **yalnız GRACE değil**:
1. `data/canli/baraj.json` (ad: "baraj")
2. `data/canli/grace-turkiye.json` (ad: "GRACE")

### 1.3 Eşikler

| Kalem | Eşik | Birim |
|---|---|---|
| baraj | 48 | saat |
| GRACE | `8 * 24` = 192 | saat (kodda saat cinsinden; 8 gün) |

Karşılaştırma **saat** cinsinden yapılır (`yasSaat > k.saat`).

### 1.4 NEYİ okuyor — A/B/C ayrımı

**(A) yerel dosya mtime'ı.** `statSync(tam).mtime`. Dosya içindeki tarih alanı
okunmuyor (B değil), uzak kaynağın Last-Modified'ı sorulmuyor (C değil).
Tek yan kural: dosya yoksa `yas: 'dosya YOK'` ile bayat sayılır.

Şu anki ölçüm (2026-07-25 21:33 UTC):

| Kalem | mtime | yaş | eşik | durum |
|---|---|---|---|---|
| baraj.json | 2026-07-25 15:00 | 6.6 saat | 48 s | geçer |
| grace-turkiye.json | 2026-07-16 08:59 | 228.6 saat | 192 s | **aşıyor** |

### 1.5 SITE-DURUM.md'yi yazan tek yol mu?

**Evet.** `grep -rn "SITE-DURUM"` kaynak dosyalarda yalnız iki isabet verdi,
ikisi de aynı dosyada:
- `arac/site-saglik.mjs:33` — `const DURUM_MD = join(IZLEME, 'SITE-DURUM.md');`
- `arac/site-saglik.mjs:806` — dosyayı üreten şablon metni.

Başka hiçbir script SITE-DURUM.md yazmıyor.

---

## 2. BEKÇİ KARŞILAŞTIRMASI

### 2.1 `saglik-bekcisi.sh:41-47` — GRACE ölçümünün tam kodu

```bash
# (c) grace canlılığı: durum.json her koşuda yazılır (haftalık Pzt; eşik 8 gün)
if [ -f data/arsiv/grace/durum.json ]; then
  GS=$(( (NOW - $(date -u -r data/arsiv/grace/durum.json +%s)) / 86400 ))
  [ "$GS" -gt 8 ] && ekle "GRACE cron ${GS} gündür koşmadı (durum.json bayat, >8g)"
else
  ekle "data/arsiv/grace/durum.json YOK"
fi
```

Dosyanın başındaki gerekçe (satır 10-13) bu seçimi açıkça belgeliyor:

> grace canlılığı grace-havza.json DEĞİL durum.json mtime: havza.json yalnız
> GSFC yeni sürüm yayınlayınca (~aylık) değişir → 8-gün tazelik aylarca yanlış
> alarm. durum.json HER haftalık koşuda (başarı/değişiklik-yok/hata) yeniden
> yazılır → "cron gerçekten koştu mu" doğru sinyali.

### 2.2 Ne okuyor, eşiği kaç

**(A) yerel dosya mtime'ı** — `data/arsiv/grace/durum.json`. Eşik **8 gün**
(saniye cinsinden hesap, `/86400`). Şu an: durum.json mtime 2026-07-20 06:00 →
5.6 gün → **eşik altında, YEŞİL**.

### 2.3 Bekçinin ölçtüğü TÜM kalemler

| # | Kalem | Okuduğu | Tip | Eşik |
|---|---|---|---|---|
| (a) | son commit yaşı | `git log -1 --format=%ct` | (B) depo metaverisi | 26 saat |
| (b) | `data/canli/baraj.json` | mtime | (A) | 26 saat |
| (c) | `data/arsiv/grace/durum.json` | mtime | (A) | 8 gün |
| (d) | `izleme/DURUM.md` | mtime | (A) | 14 saat |
| (e) | `~/bellek-log.txt` (env `BELLEK_LOG`) | içerik, pencere tabanlı | (B) | son 6 ölçümde swap >2048MB **veya** son 3'te available <500MB |
| (f) | `izleme/state/site-saglik-durum.json` → `sonBasariliKosu` | **dosya İÇİNDEKİ tarih alanı** | (B) | 14 saat |

(a)'yı A/B/C üçlüsüne tam oturtmak zorlama: dosya mtime'ı değil, git commit
zaman damgası. Rapor bunu ayrı tip olarak işaretliyor.

### 2.4 Kalem listelerinin karşılaştırması

**Örtüşen (1 kalem):**
- `data/canli/baraj.json` mtime — **her ikisi de aynı dosyayı, aynı yöntemle
  ölçüyor.** Eşikler farklı: md10 48 saat, bekçi 26 saat. Bekçi daha sıkı, yani
  md10'un baraj kalemi pratikte hiçbir zaman bekçiden önce alarm veremez —
  **bu kalem tam mükerrer ve zayıf kopyadır.**

**Yalnız md10'da (1 kalem):**
- `data/canli/grace-turkiye.json` mtime, 192 saat.

**Yalnız bekçide (5 kalem):**
- son commit yaşı · `data/arsiv/grace/durum.json` · `izleme/DURUM.md` ·
  bellek penceresi · `site-saglik-durum.json:sonBasariliKosu`.

**GRACE özelinde kritik ayrım — aynı konuyu ölçüyorlar ama FARKLI DOSYAYI:**

| | md10 | bekçi |
|---|---|---|
| dosya | `data/canli/grace-turkiye.json` | `data/arsiv/grace/durum.json` |
| ne zaman yazılır | **yalnız GSFC yeni sürüm yayınlayınca** (~aylık, gerçekte 17 Haz'dan beri hiç) | **her haftalık koşuda** (başarı / değişiklik-yok / hata) |
| eşik | 192 saat (8 gün) | 8 gün |
| şu anki değer | 228.6 saat → **AŞIYOR** | 5.6 gün → geçer |
| fiilen ölçtüğü | "kaynakta yeni veri çıktı mı" | "cron gerçekten koştu mu" |

Çelişki buradan doğuyor: **iki ölçüm aynı eşiği farklı olguya uyguluyor.**
Bekçinin dosya başındaki gerekçesi (satır 10-13) md10'un yaptığı hatayı ismen
tarif ediyor ("havza.json yalnız GSFC yeni sürüm yayınlayınca değişir → 8-gün
tazelik aylarca yanlış alarm") — md10 tam da bu tuzağa, kardeş dosya
`grace-turkiye.json` üzerinden düşmüş.

### 2.5 Çıktı hedefleri

| | md10 (site-saglik.mjs) | bekçi (saglik-bekcisi.sh) |
|---|---|---|
| birincil | `izleme/SITE-DURUM.md` (`:806`) | `UYARI-SAGLIK.md` (`:109`) |
| ham kayıt | `izleme/site-saglik-log.jsonl` (`LOG_YOL`) | `log/pipeline.log` (`:111`) |
| durum | `izleme/state/site-saglik-durum.json` | — |
| çıkış kodu | — | sorun varsa `exit 1` (`:114`) |
| e-posta | durum DEĞİŞİMİNDE (`:772-777`) | yok |

**Ortak dosya yok** — iki sistem birbirinin çıktısını okumuyor. Tek bağ: bekçinin
(f) kalemi, site-saglik'in `sonBasariliKosu` alanını okur (tek yönlü).

---

## 3. GRACE KAYNAĞININ GERÇEK DURUMU

### 3.1 Kullanılan tam URL

`arac/grace-guncelle.sh:17`:
```
https://earth.gsfc.nasa.gov/sites/default/files/geo/gsfc.glb_.200204_202603_rl06v2.0_obp-ice6gd_halfdegree.nc
```

Aynı dosya adı iki yerde daha **sabit kodlu**:
- `arac/grace-guncelle.sh:70` — indirilen geçici dosya bu ada `mv` edilir.
- `arac/grace-isle.py:27` — `HAM = f'{KOK}/data/arsiv/grace/ham/gsfc.glb_.200204_202603_rl06v2.0_obp-ice6gd_halfdegree.nc'`

### 3.2 Mevcut URL'in başlığı (`curl -sSI`, EXIT=0)

```
HTTP/1.1 200 OK
Date: Sat, 25 Jul 2026 21:31:16 GMT
Server: Apache
Last-Modified: Wed, 17 Jun 2026 12:55:41 GMT
ETag: "1fa48d90-6547293b1ae47"
Content-Length: 530877840
Content-Type: application/x-netcdf
```

- HTTP kodu: **200**
- Last-Modified: **Wed, 17 Jun 2026 12:55:41 GMT** (38 gün önce)
- Content-Length: 530877840 (~506 MiB)
- Location: **yok** (yönlendirme yok)

### 3.3 Dosya adı deseni — YOKLAMA

URL veri dönemini **kodluyor**: `..._200204_202603_...` (başlangıç 2002-04,
bitiş 2026-03). Bitiş dönemi `202603` değiştirilerek sonraki altı ay yoklandı:

| Dönem | HTTP kodu |
|---|---|
| 202604 | 404 |
| 202605 | 404 |
| 202606 | 404 |
| 202607 | 404 |
| 202608 | 404 |
| 202609 | 404 |

**Yorum:** mevcut ad 200 veriyor, sonraki altı dönemin hiçbiri yok. Yani kaynak
**taşınmamış**; GSFC henüz 2026-03'ten sonrasını kapsayan bir sürüm yayınlamamış.

**Sınır (dürüstlük kaydı):** yoklama yalnız **bitiş dönemi** alanını değiştirdi.
Adın diğer bileşenleri (`rl06v2.0`, `obp-ice6gd`, `halfdegree`, `gsfc.glb_.`)
değişirse bu test onu yakalamaz. Sürüm/işleme etiketi değişmiş bir yeni yayın
olasılığı **DENETLENEMEDİ** (dizin listesi çekilmedi — Y5 gereği indirme yok).

### 3.4 Yerel verinin içerik tarihi (mtime değil)

```
-rw-r--r-- 1 suha suha     19 Jul 20 06:00 data/arsiv/grace/durum.json
-rw-r--r-- 1 suha suha 141668 Jul 16 09:00 data/canli/grace-havza.json
-rw-r--r-- 1 suha suha   5951 Jul 16 08:59 data/canli/grace-turkiye.json
```

`durum.json` içeriği: `{"ardisikHata": 0}` — **tarih alanı yok**, yalnız sayaç.

`grace-turkiye.json` içeriğinde tarih alanları **VAR** (üst düzey `kunye` +
`seri`):

| Alan | Değer |
|---|---|
| `kunye.islemeTarihi` | **2026-07-16** |
| `kunye.aySayisi` | 254 |
| `kunye.kapsam` | Türkiye kara hücreleri, kutu 35.5-42.5K 25.5-45.5D (431 hücre) |
| `seri` ilk ay | 2002-04 |
| `seri` **son ay** | **2026-03** |

(İlk `grep -oE` deseni isabet vermedi çünkü alan adı `islemeTarihi` — desendeki
küçük harfli `tarih` parçasını büyük `T` ile taşıyor. Yapılandırılmış okuma ile
bulundu.)

`data/arsiv/grace/ham/.son-degisiklik` = `Wed, 17 Jun 2026 12:55:41 GMT` —
**uzak kaynağın Last-Modified'ı ile birebir aynı.** Yani script doğru çalışıyor
ve "değişiklik yok" kararı doğrudur.

`ham-sha256.txt` = `71ac8c31…c115cb1  …_200204_202603_….nc` — indirilen ham dosya
hâlâ 202603 sürümü.

### 3.5 En son GRACE koşumunun logu

`data/arsiv/grace/log-2026-07.log` (EXIT=0) — **dosyanın tamamı tek satır**:
```
[2026-07-17T05:11:01Z] değişiklik yok (kaynak: Wed, 17 Jun 2026 12:55:41 GMT)
```

`data/arsiv/grace/cron.log` (EXIT=0) — **tek satır**, zaman damgasız (ham stdout):
```
değişiklik yok (kaynak: Wed, 17 Jun 2026 12:55:41 GMT)
```

**stat çıktısı (olgu):**

| Dosya | Modify | Birth |
|---|---|---|
| `grace/cron.log` | 2026-07-23 18:53:52 | 2026-07-23 18:53:52 |
| `grace/log-2026-07.log` | 2026-07-23 11:14:04 | 2026-07-25 21:18:03 * |
| `grace/durum.json` | 2026-07-20 06:00:01 | 2026-07-16 09:02:29 |

\* Birth 2026-07-25 21:18 = K1 Faz C2'de yedekten `cp -p` ile geri koyma anı
(mtime korundu, inode yenilendi). Kayıt bütünlüğü için not edildi.

**BULGU — F4-7'nin bağımsız doğrulaması.** `durum.json`'ın mtime'ı
2026-07-20 06:00 (Pazartesi cron saati) — yani **20 Temmuz koşumu gerçekten
oldu**. Ama `log-2026-07.log` o koşumun satırını **içermiyor**; dosyada yalnız
17 Temmuz kaydı var ve dosyanın Modify damgası **2026-07-23 11:14:04**, denetimde
belgelenen `git reset` anıyla (23.07 11:14) saniye düzeyinde örtüşüyor.
Yani 20 Temmuz GRACE log satırı git tarafından geri yazılıp **kayboldu**.
Bu, K1'in YOL A kararını bağımsız olarak doğrular.

**AÇIK TUTARSIZLIK — DENETLENEMEDİ.** `grace/cron.log` 2026-07-23 18:53'te
*yaratılmış* ve tek satır içeriyor; ama o koşum gerçekleşseydi
"değişiklik yok" dalı `durum.json`'ı da yeniden yazacaktı
(`grace-guncelle.sh:53-56`), oysa `durum.json` mtime'ı 2026-07-20 06:00'da
kalmış. İki damga uzlaşmıyor. Eldeki kanıtla nedeni belirlenemedi; tahmin
yürütülmedi. Pratik sonuç: **"GRACE cron'u en son ne zaman koştu" sorusu tek
kaynaktan cevaplanamıyor** — bekçinin (c) kalemi tam da bu dosyaya (`durum.json`)
güveniyor.

---

## 4. UYARI-SAGLIK.md BAYATLIĞI (F4-6i)

### 4.1 Kim yazıyor, hangi koşulda

Tek yazar: `saglik-bekcisi.sh`. (`grep -rn "UYARI-SAGLIK\|UYARI="` → yalnız bu
dosyada 3 isabet: `:5` yorum, `:19` tanım, `:109` yazma.)

```bash
UYARI="$KOK/UYARI-SAGLIK.md"                                    # :19
...
if [ -n "$SORUN" ]; then                                        # :108
  printf '# SAĞLIK BEKÇİSİ UYARISI\n\n%s\n\n%s' "$(date -u)" "$SORUN" > "$UYARI"
```

Koşul: (a)-(f) kalemlerinden **en az biri** sorun bildirmişse. Dosya `>` ile
**üzerine yazılır** (biriktirmez).

### 4.2 Kim siliyor / temizliyor

**Temizleyen VAR** — aynı script, satır 117-118:
```bash
# sorun yok: eski uyarı dosyası varsa temizle (durum düzelmiş)
[ -f "$UYARI" ] && rm -f "$UYARI"
```
Yani bekçi **hiçbir** kalemde sorun bulmazsa dosyayı siler. Başka hiçbir yerden
silinmiyor; site-saglik.mjs bu dosyaya hiç dokunmuyor.

**Ama pratikte temizlenemiyor** — bulgu 4.3'te.

### 4.3 Mevcut içerik ve tarih

```
-rw-rw-r-- 1 suha suha 144 Jul 25 07:00 UYARI-SAGLIK.md
```
```
# SAĞLIK BEKÇİSİ UYARISI

Sat Jul 25 07:00:01 AM UTC 2026

- 🔴 sağlık sistemi koşmuyor — son başarılı koşu 23 saat önce (>14s)
```

**BULGU — iddia yanlış, ama script doğru çalışıyor.** Site sağlık sistemi
koşuyor: SITE-DURUM.md'ye göre 2026-07-25'te hem 07:33 hem 19:33 koşumu
tamamlandı. Bekçinin okuduğu alan "koştu mu" değil, "**kırmızısız** koştu mu":

`arac/site-saglik.mjs:769` — `if (!kirmizi.length) durum.sonBasariliKosu = simdi();`

Disk durumu (`izleme/state/site-saglik-durum.json`):
- `sonBasariliKosu` = **2026-07-24T07:33:01.764Z** (md10'un kırmızıya döndüğü
  24.07 19:33 koşumundan önceki son temiz koşum)
- `sonBildirim.imza` = `10-veri-tazeligi`
- `sonBildirim.mail.gonderildi` = **false**, sebep: `.env`'de SMTP_HOST,
  SMTP_USER, SMTP_PASS, ALARM_TO eksik

**Kısır döngü:** md10 kırmızı kaldıkça `sonBasariliKosu` donuyor → bekçinin (f)
kalemi 14 saat eşiğini her gün aşıyor → `UYARI-SAGLIK.md` her sabah 07:00'de
yeniden yazılıyor ve **asla silinemiyor** (silme yalnız "hiç sorun yok" dalında).
Tek yanlış kalem (md10), ondan bağımsız ikinci bir alarm sistemini de kalıcı
kırmızıya kilitliyor. Üstelik e-posta kanalı SMTP eksikliğinden kapalı, yani
uyarı yalnız iki dosyada duruyor.

---

## 5. ÜÇ SORUYA CEVAP

### A) md10 tamamen mükerrer mi, kısmen mi, farklı amaçlı mı?

**KISMEN MÜKERRER — kalem kalem farklı sonuç veriyor.** (Kanıt: 2.4 + 1.5)

- **baraj kalemi: TAM MÜKERRER ve zayıf kopya.** Aynı dosya (`baraj.json`), aynı
  yöntem (mtime), md10 eşiği 48 saat, bekçi eşiği 26 saat. Bekçi her zaman önce
  alarm verir; md10'un bu kalemi hiçbir bilgi eklemiyor.
- **GRACE kalemi: MÜKERRER DEĞİL — ama ölçtüğü şeyi yanlış temsil ediyor.**
  Bekçi `durum.json`'ı okuyup "cron koştu mu" sorusunu cevaplıyor; md10
  `grace-turkiye.json`'ı okuyup fiilen "kaynakta yeni veri çıktı mı" sorusunu
  cevaplıyor — ama sonucu "veri tazeliği/cron sağlığı" gibi raporluyor. İki
  ölçüm çelişmiyor; **farklı soruları aynı isim altında cevaplıyorlar.**
- **Çıktı yolları ayrı** (2.5) ve SITE-DURUM.md'nin tek yazarı site-saglik.mjs
  (1.5), yani md10 kaldırılırsa SITE-DURUM'da o satır tümden kaybolur —
  bekçi onu telafi etmez (bekçi SITE-DURUM'a yazmaz).

### B) GRACE kaynağı durgun mu, taşındı mı, dosya adı mı değişti?

**DURGUN.** (Kanıt: 3.2 + 3.3)
- Mevcut URL **200** dönüyor, yönlendirme yok, Last-Modified 17 Haz 2026.
- Sonraki altı dönemin (202604-202609) hepsi **404**.
- Yerel `.son-degisiklik` uzak Last-Modified ile birebir aynı → script'in
  "değişiklik yok" kararı **doğru**, sessiz hata yok.
- Yani F4-4'ün öngördüğü "yeni ay yeni adla geldi, script göremedi" senaryosu
  **bu an için gerçekleşmemiş**. Risk yapısal olarak duruyor (URL üç yerde sabit
  kodlu: `grace-guncelle.sh:17`, `:70`, `grace-isle.py:27`) ama şu anda tetiklenmiş
  değil.
- **Sınır:** yoklama yalnız dönem alanını değiştirdi; sürüm/işleme etiketi
  (`rl06v2.0`, `obp-ice6gd`) değişmiş bir yeni yayın olasılığı **DENETLENEMEDİ**.

### C) SITE-DURUM'un kırmızısını üreten tam zincir

```
data/canli/grace-turkiye.json   mtime = 2026-07-16 08:59 UTC
        │  (yalnız GSFC yeni sürüm yayınlayınca yeniden yazılır;
        │   kaynak 17 Haz'dan beri durgun → dosya 9.5 gündür değişmedi)
        ▼
arac/site-saglik.mjs:485-486    statSync(...).mtime → yasSaat = 228.6
        ▼
arac/site-saglik.mjs:488        yasSaat (228.6) > k.saat (8*24 = 192)  → bayat
        ▼
arac/site-saglik.mjs:490-493    kaydet('10-veri-tazeligi', 'kirmizi',
                                "GRACE 226.6 — eşik aşıldı")
        ▼
arac/site-saglik.mjs:760        genel = kirmizi.length ? 'KIRMIZI' : …
        ├──▶ arac/site-saglik.mjs:806  → izleme/SITE-DURUM.md satır 3 + satır 22
        └──▶ arac/site-saglik.mjs:769  sonBasariliKosu GÜNCELLENMEZ (donar)
                    ▼
             saglik-bekcisi.sh:88-101  sonBasariliKosu yaşı > 14 saat
                    ▼
             saglik-bekcisi.sh:109     UYARI-SAGLIK.md (her sabah 07:00, silinemez)
```

Kök neden tek cümleyle: **192 saatlik eşik, ayda bir güncellenen (ilan edilmiş
gecikme ~40-60 gün) bir kaynaktan türetilen dosyanın mtime'ına uygulanıyor.**
Eşik veri türüyle uyumsuz; ölçüm sağlıklı işleyişte de er ya da geç kırmızıya
döner. Kaynak durgunluğu bir arıza değil, GRACE'in normal yayın ritmi.

---

## EK — K1'den devreden kalemler (K2 kapsamı dışı, kayıt için)

1. **Üç script tutarsız exit davranışı.** K1 sonrası push ertelenince baraj
   `PUSH_HATA=1`, su-izleme `PUSH_ERTELENDI=1` ile exit≠0 dönüyor; grace
   dönmüyor. "Ertelendi" bir hata değil geçici durum; cron'un bunu hata sayması
   alarm yorgunluğu üretebilir. Kuyruk maddesi.
2. **Scratch dizinleri duruyor:** `/tmp/k1-test` ve `/tmp/k1-test-onceki-tur`
   (`rm` izin kuralıyla engellendiği için silinmedi). Temizlik kuyruk maddesi.

---

## ÖNERİ (uygulanmadı)

Uygulama briefi yazılmadı; aşağıdakiler yalnız tasarım önerisidir.

1. **md10'un GRACE kalemini "kaynak tazeliği"ne çevir, mtime'ı bırak.** Doğru
   ölçüm ya `kunye.islemeTarihi` / `seri` son ayı (B tipi, veri gerçekten ne
   kadar geriye ait), ya da uzak Last-Modified (C tipi). Her ikisi de "GSFC
   yayınlamadı" durumunu alarm saymaz. Eşik GRACE'in ilan edilmiş ~40-60 günlük
   gecikmesine göre kalibre edilir (ör. seri son ayı > 120 gün geride ise 🟡).
2. **md10'un baraj kalemini kaldır ya da bekçiyle eşitle.** Şu haliyle bekçinin
   daha sıkı eşiğinin gölgesinde, hiçbir zaman ilk alarmı veremiyor.
3. **`sonBasariliKosu`'nu "koştu" ile "temiz koştu" olarak ikiye ayır.** Bekçinin
   (f) kalemi "sistem koşuyor mu" sorusunu sormalı; şu an "her şey yeşil mi"
   sorusunu soruyor ve tek bir kalıcı kırmızı ikinci alarm sistemini de
   kilitliyor (4.3).
4. **GRACE URL'ini üç yerden tek yere indir** (`grace-guncelle.sh:17`, `:70`,
   `grace-isle.py:27`). F4-4 riski hâlâ yapısal; dönem alanı değişkene alınırsa
   ileride yoklama otomatikleştirilebilir.
5. **SMTP eksikliği ayrı bir kalem olarak izlensin.** Alarm kanalı kapalıyken
   sistem "bildirdim" sanıyor; `sonBildirim.mail.gonderildi=false` sessizce
   birikiyor.
