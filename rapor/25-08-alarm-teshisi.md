# 25.08 alarmlarının teşhisi — ölçüm raporu

**Koşum:** 2026-08-25 19:25–20:0x UTC · tek oturum
**Sonuç:** adım 1 (1a/1b/1c/1d) **KAPANDI** · adım 2 **DUR KAPISI TETİKLENDİ →
kullanıcı kararı alındı ("paylaşımlı kalsın, cron bağını kur")** · adım 3-4
(cron bağı + falsifikasyon) **TAMAMLANDI**

---

## Adım 0 — KONUM KANITI (kapı elle geçildi, şerhli)

Kapı ilk ölçümde **kırmızı** verdi:

```
=== oturum pwd ===
/var/www/arslanhukuk.tr          ← beklenen: /home/suha/projeler/suharitasi
=== whoami ===
suha
=== oturum dizini git remote ===
(boş — arslanhukuk.tr'de remote tanımlı değil)
```

Hedef depo ayrıca ölçüldü ve sağlam bulundu:

```
drwxr-xr-x 28 suha suha /home/suha/projeler/suharitasi
origin  https://github.com/suharitasi/suharitasi.git (fetch)
origin  https://github.com/suharitasi/suharitasi.git (push)
## main...origin/main
```

Durup kullanıcıya bildirildi; kullanıcı **2. seçeneği** (bu oturumdan
mutlak yollarla çalışma) açıkça yetkilendirdi. **ŞERH: adım 0'ın kapı
işlevi bu koşumda elle geçilmiştir.** Tüm iş `git -C` ve mutlak yollarla
yürütüldü; `/var/www/arslanhukuk.tr` ve `bist-*` dizinlerine hiçbir
adımda girilmedi (`grep --exclude-dir='bist-*'` ile dışlandı).

---

## 1a — YEDEK HATTI: alarm gerçek değil, hat sağlam (kanıtlı)

### Şu anki durum: envanter ile disk UYUŞUYOR

Envanter (`arac/yedek-al.sh:49-53`) ile diskteki gerçek durum, isim
isim karşılaştırıldı:

```
=== ENVANTER ===              === DİSK ===
data/arsiv/grace/ham          VAR  507M  (2 dosya)
kaynak/tr-atlas-master.png    VAR   24M  (1 dosya)
kaynak-video                  VAR   22M  (6 dosya)
```

**Fark: YOK.** Ne envanter yanlış, ne dosyalar gitmiş. Üçü de yerinde.

### Kök neden: alarm üretim kökünden gelmedi

`arac/yedek-al.sh:86-88` yalnız **üç varlığın üçü birden** yoksa ölür:

```bash
MEVCUT=()
for v in "${VARLIKLAR[@]}"; do [ -e "$KOK/$v" ] && MEVCUT+=("$v"); done
if [ ${#MEVCUT[@]} -eq 0 ]; then
  olduc "yedeklenecek varlık bulunamadı — envanter ile disk uyuşmuyor"
fi
```

Belirleyici kanıt: **08:57:34Z kırmızısının satırı `log/yedek.log`'da
yok.** Log yolu `LOG="$KOK/log/yedek.log"` olduğuna göre, o koşumda
`$KOK` depo değildi — yani `YEDEK_KOK` test kancası devredeydi:

```
$ grep "2026-08-25T08:5\|2026-08-25T09:0" log/yedek.log
481:2026-08-25T08:57:50Z yedek: başlıyor → /tmp/claude-1000/.../scratchpad/yedek-yesil
482:2026-08-25T08:57:51Z yedek: varlık imzası değişti — yeniden paketleniyor
502:2026-08-25T09:01:36Z yedek: bitti · 226 sn · 1162 MB · varlık: yenilendi
```

Bu, dünkü oturumun **kasten-boz → kırmızı-ölç → geri-al → yeşil-göster**
disiplininin izidir. Depodaki kayıt bunu bağımsız olarak doğruluyor
(`rapor/kalanlar-paketi.md:140-150`):

```
| Hat   | Kasıtlı bozma        | Kırmızı kanıtı  | Yeşil kanıtı                      |
| yedek | git'siz `YEDEK_KOK`  | message_id 4665 | gerçek koşum (scratch hedefe, 226 sn) |
NOT: 4662-4666 mesajları falsifikasyon TESTİDİR, gerçek arıza değil.
```

**Onarım yapılmadı — onarılacak kusur yok.** (Uydurma onarım yasağı.)

### Gerçek yedek alındı ve GERİ OKUNDU

Üretim hedefine (`/home/suha/yedek/suharitasi`, scratch'e değil) koşuldu:

```
2026-08-25T19:32:33Z → YEDEK TAMAM · 214 sn · 1162 MB · varlık paketi: degismedi (exit=0)
```

**Boyut:**
```
924.832.162  depo.bundle          (önceki gece: 924.540.506 — büyüdü, tazelendi)
293.995.408  varliklar-20260728.tar.gz
1.2G         guncel/ toplam
```

**sha256 — bundle gerçekten yenilendi:**
```
ESKİ: 8380b8b31b6bde3f03f418d273ed8380965e7a1f5bc3dd026e9e2f896ea5b154
YENİ: 2d1efd97ca605ea7a1aacebbd24ed3bc16e96b4edce5a71a4d35c0007f64c308
manifest doğrulaması: ./varliklar-20260728.tar.gz: OK · ./depo.bundle: OK
```

**Geri okuma A — bundle'dan tam klon:**
```
klonlanan HEAD : 563bf95 Su izleme: 2026-08-25T19-30-49Z (olay=1 hata=0)
canlı depo HEAD: 563bf95 Su izleme: 2026-08-25T19-30-49Z (olay=1 hata=0)
fsck: (çıktı boş = temiz)
commit: 537   ref: 10
```
Klon, yedekten **6 dakika önce atılmış** commit'i içeriyor — yedeğin
gerçekten güncel içerikten üretildiğinin kanıtı.

**Geri okuma B/C — varlık paketinden dosya çıkarıp diskle kıyas:**
```
paket içeriği: 9 dosya (2 grace ham + 1 png + 6 video)
YEDEKTEN : 717528a98ce603b4fced8842771e0c641e6a83986bfd96246ac03135555d57f0
DİSKTEN  : 717528a98ce603b4fced8842771e0c641e6a83986bfd96246ac03135555d57f0
SONUÇ: BİREBİR AYNI ✔
```

**Sır kopyası izinleri:** `-rw------- env.kopya` · `drwx------ /home/suha/yedek/suharitasi` — beklendiği gibi.

### Kalan açık (onarılmadı, kullanıcı kararına bırakıldı)

Betik **kısmi** varlık kaybında ölmez. Üç varlıktan ikisi silinse
(`yedek-al.sh:60-68`) yalnız `logla "UYARI: varlık diskte yok"` yazılır;
`MEVCUT` dizisi boş olmadığı için `olduc` tetiklenmez, kalan tek varlık
paketlenir ve durum dosyasına `"sonuc": "basarili"` yazılır. Yani
"envanter ile disk uyuşmuyor" alarmı yalnız **topyekûn** kayıpta çalışır.

Ek ayrıntı (kod okumasıyla, ölçümle değil): kısmi kayıp imzayı
değiştirdiği için kuşak döndürme de çalışır — sağlam paket
`guncel/` → `onceki/` iner, yerine eksik paket yazılır. Durum sabit
kalırsa imza da sabit kalacağından sağlam kopya `onceki/`de korunur;
ama varlıklar kısmen eksikken değişmeye devam ederse sağlam kopya iki
kuşaktan da düşebilir.

Bu gerçek bir kör nokta, ama 25.08 alarmının nedeni **değil**. Üretim
uyarı mantığını istenmeden değiştirmemek için **dokunulmadı** →
SIRADAKILER'e kalem olarak yazıldı.

---

## 1b — SU-İZLEME 5 HATASI: kaynak taraflı, geçici; şimdi yeşil

### Hata sınıfı: saf zaman aşımı, TLS/DNS hatası DEĞİL

`log/pipeline.log`, 16:15 koşumu — ham:

```
[2026-08-25T16:15:01Z] SU-İZLEME başladı (2026-08-25T16-15-01Z)
curl: (28) Operation timed out after 45001 milliseconds with 0 bytes received
curl: (28) Operation timed out after 45002 milliseconds with 0 bytes received
curl: (28) Operation timed out after 45002 milliseconds with 0 bytes received
curl: (28) Operation timed out after 45001 milliseconds with 0 bytes received
curl: (28) Operation timed out after 45002 milliseconds with 0 bytes received
curl: (28) Operation timed out after 45002 milliseconds with 0 bytes received
curl: (28) Operation timed out after 45001 milliseconds with 0 bytes received
curl: (28) Operation timed out after 45001 milliseconds with 0 bytes received
curl: (28) Operation timed out after 45000 milliseconds with 0 bytes received
[2026-08-25T16:23:01Z] SU-İZLEME bitti: olay=1 hata=5
```

Tam **9** zaman aşımı = 4 html hedef × 2 deneme (iç retry) + 1 HEAD
(retry'siz). Sertifika/isim çözümleme hatası **yok**; hepsi 0 bayt.

### Bizim taraf mı? HAYIR — üç bağımsız ölçüm

1. **Kaynak tükenmesi yok.** Bellek logu (`arac/bellek-log.sh`, 10 dk'da bir):
```
2026-08-25T16:10:01Z swap_used_mb=167 mem_avail_mb=6467
2026-08-25T16:20:01Z swap_used_mb=167 mem_avail_mb=6462
```
2. **Çıkış bağlantısı, DNS ve TLS çalışıyordu.** Aynı koşumun
   *ortasında* `dsi-duyuru-listesi` **başarıyla** çekildi — üstelik
   `suverimliligi.gov.tr` ile **aynı IP'de** (212.175.143.60). Yani
   "hosting bloğu düştü" açıklaması da çürüyor.
3. **TLS doğrulaması hiçbir yerde kapatılmadı** (KARARLAR §24). `-k`
   kullanılmadı; kod da `-k` içermiyor (`izleme/su-izleme.sh:31`).

### Şu anki ölçüm: beşi de 200

```
tarimorman-sygm      kod=200 dns=0.008s tls=0.448s toplam=1.125s bayt=45825  ip=212.175.143.147
tarimorman-anasayfa  kod=200 dns=0.002s tls=0.433s toplam=1.572s bayt=87796  ip=212.175.143.147
susurasi             kod=200 dns=0.241s tls=0.648s toplam=1.046s bayt=59369  ip=212.175.143.172
suverimliligi        kod=200 dns=0.231s tls=0.648s toplam=0.993s bayt=86793  ip=212.175.143.60
--- kontrol (o koşumda yeşil olanlar) ---
dsi-duyuru           kod=200 toplam=1.031s ip=212.175.143.60
tbmm-kanun           kod=200 toplam=0.601s ip=185.160.114.41
```

### Gerçek koşum tekrarlandı — hata 0

```
[2026-08-25T19:30:49Z] SU-İZLEME başladı (2026-08-25T19-30-49Z)
[2026-08-25T19:31:50Z] SU-İZLEME bitti: olay=1 hata=0
```
Süre **480 sn → 61 sn**. `izleme/DURUM.md`:
```
| tarimorman-sygm      | K4 | 🟢 tamam | değişiklik yok |
| tarimorman-anasayfa  | K4 | ✳ OLAY   | içerik değişti (~14 satır) |
| su-kanunu-taslak-pdf | K4 | 🟢 tamam | Last-Modified değişmedi (Thu, 31 Oct 2019 08:20:54 GMT) |
| susurasi             | K4 | 🟢 tamam | değişiklik yok |
| suverimliligi        | K4 | 🟢 tamam | değişiklik yok |
```
Commit: `563bf95 Su izleme: 2026-08-25T19-30-49Z (olay=1 hata=0)`

### Neden geçiciydi — kanıtlanan ve TAHMİN olan kısım ayrı

- **Kanıtlanan:** arıza bizim tarafımızda değildi (yukarıdaki 3 ölçüm).
- **Kanıtlanan:** kendiliğinden geçti; onarım yapılmadan yeşile döndü.
- **TAHMİN (kaynağın içini göremiyoruz):** 16:15–16:23 UTC penceresinde
  `tarimorman.gov.tr` / `susurasi` / `suverimliligi` sunucularında
  bağlantı kabul edip yanıt üretmeyen geçici bir durum yaşandı. Bunu
  doğrulayacak veri bizde **yok**; tahmindir.
- **Emsal:** `izleme/log/hata.log` tüm ömür boyunca **yalnız iki** ağ
  olayı gösteriyor — 03.08'de `dsi` (kendiliğinden geçti), 25.08'de bu
  beşi. Yani ~ayda bir görülen, kendiliğinden kapanan sınıf.

**Onarım yapılmadı** (bizim taraf değil), **şerh düşüldü.**

---

## 1c — 08:56–10:07 KIRMIZILARI: hepsi kapandı, hiçbiri onarılmadı

Dördü de **falsifikasyon testi** çıktı. Kayda güvenmeyip her kancanın
**kodda gerçekten var olduğu** ayrıca doğrulandı:

```
BARAJ_CEK_KOMUT          arac/baraj-gunluk.sh:25       # falsifikasyon kancası
GRACE_URL_EZME           arac/grace-guncelle.sh:17     # falsifikasyon kancası
NHYP_NOBETCI_SYGM_EZME   arac/nhyp-yayin-nobetci.py:41 # falsifikasyon kancası
INDEXNOW_UC_NOKTA        arac/indexnow-bildir.mjs:41   # process.env ile ezilebilir uç nokta
```

| Alarm | msg | Şu anki ÖLÇÜLEN durum | Karar |
|---|---|---|---|
| baraj "çekim BAŞARISIZ (exit 1)" 08:56:17 | 4662 | 15:05 gerçek koşum tam: `TGT 201 · 88 kayıt → data/canli/baraj.json` (dosya 15:05 damgalı) | **kapandı** — onarılmadı |
| grace "ardışık 1" 08:56:28 | 4663 | `data/arsiv/grace/durum.json` → `{"ardisikHata": 0}` · cron.log "değişiklik yok" | **kapandı** — onarılmadı |
| nhyp "sonda/ağ arızası A🔴 B🔴 ağ 13" 08:56:40 | 4664 | 08:57:07 gerçek koşum: `A=🟢 B=🟢 · ağ hatası 0 · SYGM 200, 191076 bayt` | **kapandı** — onarılmadı |
| yedek "varlık bulunamadı" 08:57:34 | 4665 | bkz. 1a — envanter=disk, gerçek yedek geri okundu | **kapandı** — onarılmadı |

**IndexNow HTTP 500 (10:05:46, msg 4667) — "sahte hata" damgası:**
falsifikasyon testinin **kendisi**, gerçek arıza değil. Ayrım kanıtı:
(a) mesaj metninde kaynağın kendi yazdığı `sahte hata` ibaresi var;
(b) uç nokta `INDEXNOW_UC_NOKTA` ortam değişkeniyle ezilebiliyor
(`indexnow-bildir.mjs:41`); (c) GUNLUK 25.08/4: *"sahte uç nokta 500 →
exit 1 + Telegram msg 4667 + state yazılmadı"*. Şu anki ölçüm:
```
2026-08-25T15:15:30.909Z koşum: canlı=7f13d60 sitemap=519 URL, fark=88
2026-08-25T15:15:31.503Z parti 1: 88 URL → HTTP 200
2026-08-25T16:25:01.811Z koşum: canlı=348783d sitemap=519 URL, fark=0
sonKosum: 2026-08-25T16:25:01.814Z · sonBasariliBildirim: 2026-08-25T15:15:31.504Z
```
**Kapandı.**

**Bekçi uyarıları 10:07:09 / 10:07:11 (msg 4668, 4669)** — "48 saattir
koşmamış" / "son bildirim 120 saat önce": bunlar da eski-tarih
falsifikasyonu (GUNLUK: *"bekçi eski-tarih 2/2 ateşledi, gerçek state
yeşil"*). Gerçek state yukarıda; **kapandı.**

**msg 4666 (rg-nobetci "1 YENİ işletme sahası kaydı")** hata değil,
bilgi uyarısıdır — değerlendirme bekleyen gerçek bir bulgu.

---

## 1d — ORTAK NEDEN: tek olay, ama ağ kesintisi DEĞİL

Dört alarm 08:56:17 → 08:57:34 arasında, **~11 sn aralıklarla sırayla**
düştü. Ortak neden **vardır** ve şudur: dünkü oturumun (25.08/3. seans
"kalanlar paketi") §24 Telegram yolunu dört hatta genişletirken
**arka arkaya koşturduğu falsifikasyon testleri**.

Alternatif hipotezler ölçümle elendi:

| Hipotez | Ölçüm | Sonuç |
|---|---|---|
| Ağ kesintisi | 08:56:28'de baraj **deploy hook HTTP 200** aldı (`data/arsiv/baraj/log/cron.log`); 08:57:07'de nhyp SYGM'den **191076 bayt** çekti | **ELENDİ** — ağ o anda çalışıyordu |
| Kaynak tükenmesi | bellek logu 08:50 → `mem_avail_mb=6413`, 09:00 → `4965` (yedek paketleme yükü); swap sabit | **ELENDİ** — 8 GB'lik makinede sıkışma yok |
| 5 eşzamanlı shell | alarmlar eşzamanlı değil, 11 sn arayla **sıralı** | **ELENDİ** |
| Kasıtlı test dizisi | 4 kancanın 4'ü kodda mevcut; `rapor/kalanlar-paketi.md:140-150` tabloda msg 4662-4665'i tek tek eşliyor; yedek koşumunun logu üretim değil scratch köke düşmüş | **DOĞRULANDI** |

**Onarılacak bir şey yok.** Uydurma neden yazılmadı.

---

## Yan bulgu (briefte yoktu, ölçümde çıktı)

`izleme/log/cron.log` sonunda 13 kez:
```
error: cannot pull with rebase: You have unstaged changes.
error: Please commit or stash them.
fatal: No rebase in progress?
```
Bu, 25.08'de kapatılan **kirli-ağaç** sınıfının izidir (18–24.08 arası
41 tıkalı commit; günde 2 koşum × ~6,5 gün ≈ 13 — sayı birebir tutuyor).
**Onarım sonrası tekrarlamıyor:** bugünkü 19:30 koşumu temiz commit+push
yaptı ve `git rev-list --count @{u}..HEAD` = **0** (fetch sonrası da 0).
Yani log satırları geçmişe aittir, açık arıza değildir.

---

## Adım 2 — TELEGRAM SINIRI: **DUR. KANAL PAYLAŞILIYOR.**

### Kanıt

**Betik yolu:** `/home/suha/projeler/suharitasi/arac/uyari-gonder.sh`
**Token kaynağı:** `.env` → `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID`
(`uyari-gonder.sh:37-38`; ortam değişkeni varsa o önceliklidir)
**Bot:** id `8549777437` · `TraderBOT` · `@TraderSerdar_BOT`
**Chat:** `1490086481` · Av.Serdar (`@lawisloveorfail`, private)

**Kanıt 1 — message_id dizisinde boşluk.** `log/uyari.log`'da
suharitasi'nin gönderdiği tüm id'ler:
```
4656 4657 4658 [4659 4660 4661 EKSİK] 4662 4663 4664 4665 4666 4667 4668 4669 4670
```
4658 (24.08 20:13:55Z) ile 4662 (25.08 08:56:17Z) arasındaki **üç
mesajı suharitasi göndermedi**. Bot↔kullanıcı özel sohbetinde
`message_id` o bota özgü ve sıralıdır → o üç mesajı **aynı bot**, başka
bir gönderen yazmış.

**Kanıt 2 — ikinci kullanıcı isimle bulundu.**
`/home/suha/araclar/kesif-botu/kesif_ajani.py` (systemd
`kesif-botu.timer`, `OnCalendar=*-*-* 08:00:00 Europe/Istanbul`,
`User=suha`) aynı kanalı kullanıyor:
```
suharitasi bot id : 8549777437
kesif-botu bot id : 8549777437      >>> AYNI BOT ✔
suharitasi chat id: 1490086481
kesif-botu chat id: 1490086481      >>> AYNI SOHBET ✔
```
(Değerler `.env` / `.kesif.env`'den okundu, rapora **yazılmadı**;
yalnız bot kimliği ve chat id kıyaslandı.)

**Kanıt 3 — bot adı.** `TraderBOT` / `@TraderSerdar_BOT` adı, botun
kökeninin bu proje olmadığını gösteriyor.

### Ölçülemeyen — dürüst şerh

BIST tarafındaki kullanım **doğrulanmadı**: brief `bist-*` dizinlerine
girmeyi yasakladığı için oradaki betikler okunmadı (aramada
`--exclude-dir='bist-*'` uygulandı). Bot adı BIST'e işaret ediyor ama
bu **kanıt değil, karine**. Kesin olan: kanal en az bir başka projeyle
(`kesif-botu`) paylaşılıyor.

### Sonuç: DURULDU, SORULDU, KARAR ALINDI

Brief §2 gereği kanal **kendi kararımla değiştirilmedi**; durum kullanıcıya
kanıtlarıyla bildirildi ve karar soruldu.

**KULLANICI KARARI (25.08.2026): "Paylaşımlı kalsın, cron bağını kur."**

Bunun üzerine adım 3-4 koşuldu ve yeni işin hata yolu **aynı paylaşımlı
kanala** bağlandı. Kanal ayrımı yapılmadı; bu bilinçli kullanıcı kararıdır.

---

## Adım 3 — CRON BAĞI: kuruldu

### 3a — betiğin yazdığı dosyalar

`arac/gsc-haftalik.py` tek dosya yazar:
```
107: cikti_dizin = Path(os.environ.get("GSC_CIKTI_DIZIN") or (KOK / "rapor" / "gsc-haftalik"))
108: cikti = cikti_dizin / f"{bu_s.isoformat()}.md"
109: cikti.parent.mkdir(parents=True, exist_ok=True)
116: cikti.write_text(...)
```
Başka hiçbir yere yazmaz; **commit atmaz**. Anahtar yalnız
`GOOGLE_SEO_SERVICE_ACCOUNT_FILE`'dan (satır 36'da yoksa `sys.exit`).
Kota: koşum başına 4 Search Analytics sorgusu.

**Yapılan tek kaynak değişikliği (eklemeli):** çıktı dizini
`GSC_CIKTI_DIZIN` ile ezilebilir hâle getirildi; **ezme yoksa davranış
aynen eskisi gibi**. Bu, 3e kararının teknik ön şartıdır.

### 3b — mevcut zamanlanmış işler

`crontab -l` (suha) 65 satır · `sudo crontab -l` (root) → **`no crontab
for root`**. Dolu dakikalar (UTC):
```
02:10 yedek · 02:40 Pzt grace · 03:00 arslanhukuk-yedek · 04:20 Sal rg-nobetci
04:40 Çar nhyp · 05:00 gorsel-bekci · 05:45 su-izleme · 06:00 arslanhukuk-saglik
06:40 site-saglik --tam · 07:00 saglik-bekcisi + gozcu · 15:05 baraj
16:15 su-izleme · 19:30 site-saglik --tam · 20:10 (ayın 1'i) dis-link-tam
*/10 bellek-log · :25 (0,4,8,12,16,20) indexnow
```
systemd timer'ları (ayrıca ölçüldü): `arslan-analytics` **hourly (:00)** ·
00:00 logrotate+dpkg · 00:07 sysstat-summary · 00:20 mail-backup ·
01:06 restic-yedek · 03:00 muvekkil-yedek-db · 03:30 muvekkil-yedek ·
04:30 imar · 05:00 kesif-botu + muvekkil-sure · 05:30 Pzt muvekkil-kvkk ·
19:10 systemd-tmpfiles-clean · `apt-daily` (rastgele gecikmeli).

### 3c — koşum satırı rapordan alındı (uydurulmadı)

`rapor/gsc-mcp-optimizasyon.md:389` hazır satırı taşıyordu. **Ancak o satır
3f kuralını çiğniyordu** ve olduğu gibi kurulmadı:
```
25 6 * * 1  →  06:00 arslanhukuk-saglik'e 25 dk · 06:40 site-saglik --tam'a 15 dk
```
Komut gövdesi (yorumlayıcı, anahtar değişkeni, betik yolu) rapordan aynen
alındı; yalnız **zamanlama** 3f gereği değiştirildi ve gerekçesi yazıldı.

### 3d — sarmalayıcı: `arac/gsc-haftalik.sh`

| Kural | Uygulama |
|---|---|
| `set -euo pipefail` | satır 26 |
| `2>/dev/null` YASAK | **yorum dışında 0 adet** (ölçüldü: `grep -vE '^\s*#' \| grep -c` → 0) |
| mutlak yollar | KOK/BETIK/UYARICI/PY/ANAHTAR/CIKTI_DIZIN/LOG/KILIT hepsi mutlak |
| flock tek örnek | `flock -n` — ikinci koşum beklemez, "ATLANDI" yazıp **exit 0** |
| log mutlak + boyut sınırı | `/home/suha/projeler/suharitasi/log/gsc-haftalik.log`, 512 KB tavan, aşarsa son yarısı korunur (atomik `mv`) |

Ek: başarı ölçütü **komutun exit kodu değil, çıktı dosyasının varlığı +
boş olmaması**. Ön kapılar (python/betik/anahtar) koşumdan önce ölçülür.

### 3e — ÇIKTI KADERİ: **(a) depo dışına `/home/suha/gsc-cikti/`**

**Gerekçe:** briefin kriteri — "çıktı sitede yayımlanacaksa (c), yalnız
teşhisse (a)". Bu rapor siteye basılmaz; `SIRADAKILER`'deki "İZLEME
(1-4 hafta, haftalık koşumla ölçülür)" kalemlerini beslemek için okunur.
Dolayısıyla **(a)**. Git ağacı hiç kirlenmez, commit atılmaz —
18-24.08'de 41 commit'i tıkayan "depo içine yaz, ne yok say ne commit
et" tuzağı yapısal olarak doğamaz.

Ölçülen teyit: sarmalayıcı koşumundan sonra
```
$ git status --porcelain      # (koşum çıktısı için)
(boş)
```
Depoda duran eski test çıktısı (`rapor/gsc-haftalik/2026-08-22.md`,
commit 51199e7) **olduğu yerde bırakıldı**; ezme yokken betik hâlâ
oraya yazar — uçtan uca sınandı, üretilen dosya bit-eşit çıktı (git
farkı 0).

### 3f — zamanlama: **Çar 10:30 UTC (13:30 TR)**, kullanıcı `suha`

**Gün seçimi — ölçümle:** betiğin penceresi `bugün-9..bugün-3` ve
`bugün-16..bugün-10`. Yedi günün hangisinde iki pencerenin de tam takvim
haftasına oturduğu hesaplandı:

| koşum günü | BU HAFTA | ÖNCEKİ HAFTA | Pzt-Paz'a oturuyor mu |
|---|---|---|---|
| Pzt | 08-15 .. 08-21 | 08-08 .. 08-14 | hayır |
| Sal | 08-16 .. 08-22 | 08-09 .. 08-15 | hayır |
| **Çar** | **08-17 .. 08-23** | **08-10 .. 08-16** | **EVET ✔** |
| Per | 08-18 .. 08-24 | 08-11 .. 08-17 | hayır |
| Cum | 08-19 .. 08-25 | 08-12 .. 08-18 | hayır |
| Cmt | 08-20 .. 08-26 | 08-13 .. 08-19 | hayır |
| Paz | 08-21 .. 08-27 | 08-14 .. 08-20 | hayır |

**Veri gecikmesi gerekçesi:** bitiş tarihi her koşumda `bugün-3`, yani
GSC'nin ~2 günlük gecikmesinin **bir gün üstünde** — eksik son gün
riskiyle hafta karşılaştırması bozulmaz.

**Saat seçimi — ölçümle:** en yakın komşu `arslan-analytics`
(`OnCalendar=hourly`, :00) → 10:00 ve 11:00, **ikisi de tam 30 dk**.
Cron'da 10:00-11:00 arası boş; indexnow :25'te ama yalnız 0/4/8/12/16/20
saatlerinde — **10. saatte yok**.

30 dk kuralı dışında tutulanlar ve **ölçülen** maliyetleri (saniye altı,
kural bu yüzden uygulanamaz ve uygulanması anlamsız):
```
bellek-log       */10   tek `free -m`
muvekkil-saglik  5 dk   son koşum 0,06 sn
arslan-monitor   5 dk   son koşum 0,66 sn
sysstat-collect  10 dk  son koşum 0,01 sn
```
**ŞERH:** `apt-daily.timer` rastgele gecikmelidir (`RandomizedDelaySec`);
hiçbir saat ona karşı garanti edilemez.

Kurulan satır (`crontab -l | tail`, kullanıcı **suha**, root'a
dokunulmadı):
```
30 10 * * 3 nice -n 10 /home/suha/projeler/suharitasi/arac/gsc-haftalik.sh >> /home/suha/projeler/suharitasi/log/gsc-haftalik-cron.log 2>&1
```
Crontab yedeği: `izleme/crontab-onceki-20260825.txt` (65 satır).

### 3g — hata yolu: MEVCUT betik kullanıldı

Baraj/GRACE/yedek/NHYP uyarılarının kullandığı betik bulundu ve
**aynısı** kullanıldı, yenisi yazılmadı:
```
/home/suha/projeler/suharitasi/arac/uyari-gonder.sh
```
Sarmalayıcıdaki çağrı (satır ~48): `"$UYARICI" "GSC haftalık koşumu
BAŞARISIZ" "$*"`. Gönderim hatası çıkışı değiştirmez (exit 1 kalır),
ama sessiz de kalmaz (`UYARICI ÇAĞRISI DA BAŞARISIZ` loglanır).

---

## Adım 4 — FALSİFİKASYON: 3/3, ham çıktılar

### 4a — CRON BAĞI (cron ortamı, kısıtlı PATH)

Satır geçici olarak 2 dk sonrasına kuruldu, çıktı dosyası **silindi**
(cron gerçekten üretecek mi diye), beklendi:

```
=== 4a SONUÇ · 2026-08-25T20:36:08Z ===
--- cron log (sarmalayıcının stdout+stderr'i) ---
GSC HAFTALIK TAMAM · /home/suha/gsc-cikti/2026-08-22.md · 2672 bayt
--- gsc-haftalik.log ---
2026-08-25T20:36:01Z gsc-haftalik: başlıyor → /home/suha/gsc-cikti
2026-08-25T20:36:01Z gsc-haftalik: python çıktısı: yazıldı: /home/suha/gsc-cikti/2026-08-22.md
2026-08-25T20:36:02Z gsc-haftalik: bitti · /home/suha/gsc-cikti/2026-08-22.md · 2672 bayt
--- cron gerçekten mi tetikledi (syslog) ---
2026-08-25T20:36:01.267531+00:00 vps-yeni CRON[1912897]: (suha) CMD (/home/suha/projeler/suharitasi/arac/gsc-haftalik.sh >> /home/suha/projeler/suharitasi/log/gsc-haftalik-cron.log 2>&1)
```
Sonra gerçek zamanlamaya (`30 10 * * 3`) çevrildi; geçici satırın
kalktığı ölçüldü (`crontab -l | grep -c "36 20"` → 0) ve gsc satırının
**tek** olduğu doğrulandı (`grep -c gsc-haftalik.sh` → 1).

### 4b — KİMLİK HATASI (anahtar yolu kasten bozuldu)

```
sarmalayıcı sha256 (bozmadan önce): 1c239db181935550c7acbc5009ee22b70c8eab98a64750bcceae83fcd5a5a6f6
son message_id (bozmadan önce): "message_id":4670

=== ANAHTAR YOLUNU KASTEN BOZUYORUM ===
27:ANAHTAR="/home/suha/gsc-anahtar-YOK.json"   # KASTEN BOZULDU (4b)

=== KOŞUM (kırmızı beklenir) ===
GSC HAFTALIK HATASI: GSC servis hesabı anahtarı yok/okunamıyor: /home/suha/gsc-anahtar-YOK.json
uyarı gönderildi
exit=1  (0 OLMAMALI)
```

Telegram'a düştüğünün ham kanıtı (`log/uyari.log`):
```
{"ok":true,"result":{"message_id":4671,"from":{"id":8549777437,"is_bot":true,
"first_name":"TraderBOT","username":"TraderSerdar_BOT"},"chat":{"id":1490086481,
...},"text":"🔴 suharitasi — GSC haftalık koşumu BAŞARISIZ\n\nGSC servis hesabı
anahtarı yok/okunamıyor: /home/suha/gsc-anahtar-YOK.json\n\n2026-08-25T20:36:26Z · vps-yeni"}}
2026-08-25T20:36:26Z uyari: gönderildi: GSC haftalık koşumu BAŞARISIZ
```

Geri alma ve yeşile dönüş:
```
27:ANAHTAR="/home/suha/gsc-anahtar.json"
sha256 (geri aldıktan sonra): 1c239db181935550c7acbc5009ee22b70c8eab98a64750bcceae83fcd5a5a6f6
>>> DOSYA BİREBİR ESKİ HÂLİNDE ✔

=== YEŞİLE DÖNDÜ MÜ ===
GSC HAFTALIK TAMAM · /home/suha/gsc-cikti/2026-08-22.md · 2672 bayt
exit=0
```

### 4c — KİLİT (iki koşum aynı anda)

```
=== 4c: İKİ KOŞUM AYNI ANDA ===
2026-08-25T20:36:52.955575026Z
--- A (pid 1913133) exit=0 ---
GSC HAFTALIK TAMAM · /home/suha/gsc-cikti/2026-08-22.md · 2672 bayt
--- B (pid 1913134) exit=0 ---
ATLANDI: başka koşum sürüyor

=== log ===
2026-08-25T20:36:52Z gsc-haftalik: başlıyor → /home/suha/gsc-cikti
2026-08-25T20:36:52Z gsc-haftalik: başka bir koşum sürüyor (flock) — bu koşum ATLANDI
2026-08-25T20:36:53Z gsc-haftalik: python çıktısı: yazıldı: /home/suha/gsc-cikti/2026-08-22.md
2026-08-25T20:36:53Z gsc-haftalik: bitti · /home/suha/gsc-cikti/2026-08-22.md · 2672 bayt
```
İkincisi kilide takıldı, **temiz** çıktı (exit 0 — kota israfı arıza
değildir), birincisi işini bitirdi.

### 4d (ek) — LOG DÖNDÜRME: iddia sınandı

3d'de "log boyut sınırıyla döndürülür" yazdım; beyanla bırakmadım:

```
şişirilmiş boyut : 704839 bayt (tavan 524288)
koşum sonrası    : 262477 bayt
'log döndürüldü' satırı: VAR ✔
>>> DÖNDÜRME ÇALIŞTI ✔ (tavanın altına indi)
```
Sınama dolgusu sonra temizlendi; log'a ne yapıldığı dürüstçe yazıldı.

### 1a/1b onarımları için falsifikasyon — GEREKMEDİ

Brief "1a ve 1b'de yaptığın her onarım için aynı disiplin" diyor.
**Bu iki kalemde onarım YAPILMADI** (1a'da kusur yoktu, 1b kaynak
taraflıydı), dolayısıyla boz-ölç-geri al uygulanacak bir değişiklik de
yok. Uydurma onarım yapılıp uydurma falsifikasyon yazılmadı.

---

## Adım 5 — SAĞLIK: taban gerilemesi 0 (bir ara-gerileme ölçümle elendi)

### Önce gerileme GÖRÜLDÜ — ve nedeni bendim

19:30 UTC cron `--tam` koşumu tabanın altına düştü:

```
15:28 (taban) : SARI · 🔴0 🟡2 🟢21
19:42          : SARI · 🔴0 🟡3 🟢20      ← 1 kalem geriledi
```

Kalem kalem kıyasta tek fark bulundu:
```
*** DEĞİŞTİ  9-lighthouse: gecti -> sari
    önce : /harita/ 93/72
    sonra: /harita/ 93/68   (eşik: masaustu 90 / mobil 70)
```

**Nedeni kendi koşumumdur, gizlemiyorum:** gerçek yedeği 19:32:33–19:36:07
arasında aldım (214 sn, `tar -czf` + `git bundle`), cron'un `--tam`
koşumu ise 19:30:00–19:42:57 arasında sürüyordu. Lighthouse mobil
başarım ölçümü CPU çekişmesine duyarlıdır.

### Ayrıştırma: yayılım mı, gerçek gerileme mi

Betik zaten uyarlamalı medyan uyguluyor (`site-saglik.mjs:1125`;
eşik+12'nin altındaysa 3 atış, medyan alınır). Ham turlar:

| Koşum | `/harita/` mobil turlar | medyan | sonuç |
|---|---|---|---|
| 13:39 | **[68, 75, 75]** | 75 | geçti |
| 15:28 (taban) | [71, 75, 72] | 72 | geçti |
| 19:42 (yedeğimle çakışık) | [69, 68, 68] | 68 | **sarı** |
| 19:59 (makine boş) | [75, 75, 75] | 75 | geçti |
| 20:50 (cron bağından sonra) | [75, 72, 69] | 72 | geçti |

13:39 koşumunda da tek başına bir **68** var — yani 68 bu sayfanın doğal
yayılımı içinde ve eşik (70) tam bu yayılımın ortasında. Gerçek bir site
gerilemesi değil, ölçüm çekişmesi.

### İkinci ölçüm (19:59, makine boş) — taban geri geldi

```
zaman: 2026-08-25T19:59:32.368Z  genel: SARI  🔴 0  🟡 2  🟢 21
  SARI  24-www        : www 200 sunuyor (canonical apex ✓) — Cloudflare panel bekleniyor
  SARI  17-dis-baglanti: 19 bağlantı yanıt vermedi · 52/1037 tarandı, ölü 0
  /harita/ → mobilTurlar [75, 75, 75] · masaustuTurlar [93, 93, 94] · gecti: true
```

### Üçüncü ölçüm (20:38–20:50) — cron bağı ve falsifikasyonlardan SONRA

```
TABAN (19:59) : SARI 🔴0 🟡2 🟢21
ŞİMDİ 20:50:36: SARI 🔴0 🟡2 🟢21
KALEM FARKI   : YOK — taban gerilemesi 0 ✔
  SARI  24-www        : Cloudflare panel bekleniyor (bilinen)
  SARI  17-dis-baglanti: 18 bağlantı yanıt vermedi · 52/1037, ölü 0 (dış)
  /harita/ → mobilTurlar [75, 72, 69] · medyan 72 · gecti: true
```

Bu koşum sırasında **başka hiçbir ağır iş koşturulmadı** — aşağıdaki
dersin kendisi uygulandı.

**SONUÇ: TABAN GERİLEMESİ 0.** Kırmızı **0**; iki sarı da bilinen ve
açıklamalı (24-www panel bekliyor, 17-dis-baglanti dış sunucu).

**Ders (kayda değer):** `--tam` penceresinde (06:40 ve 19:30, ~13 dk)
ağır CPU/IO işi koşturmak md9'u yanlış-sarı yapabilir. Elle yedek/paket
koşumları bu iki pencerenin dışında yapılmalı. → SIRADAKILER.

---

## GERİ ALMA

Tek blok — sırayla koşulursa bu seansın TÜM izi silinir.

```bash
# ── 1) CRON SATIRINI SİL ────────────────────────────────────────────
# BİRİNCİL YOL — bu seansın BAŞINDAKİ crontab'ı birebir geri yükle
# (izleme/crontab-onceki-20260825.txt, 65 satır; gsc satırı ve yorum
#  bloğu tek hamlede kalkar, başka hiçbir satır etkilenmez):
crontab /home/suha/projeler/suharitasi/izleme/crontab-onceki-20260825.txt
crontab -l | grep -c gsc-haftalik.sh      # 0 dönmeli
# (Bu arada başka cron değişikliği yapıldıysa yedek onları da geri alır —
#  o durumda `crontab -e` ile yalnız gsc bloğunu elle silmek daha doğrudur:
#  '# GSC haftalik analiz' yorum satırından '30 10 * * 3 ...' satırına kadar.)

# ── 2) SARMALAYICIYI SİL ────────────────────────────────────────────
rm -f /home/suha/projeler/suharitasi/arac/gsc-haftalik.sh
rm -f /home/suha/projeler/suharitasi/log/gsc-haftalik.log
rm -f /home/suha/projeler/suharitasi/log/gsc-haftalik-cron.log

# ── 3) DEPO DIŞI ÇIKTI DİZİNİ (istenirse) ───────────────────────────
rm -rf /home/suha/gsc-cikti

# ── 4) COMMIT'LERİ GERİ AL ──────────────────────────────────────────
# (gsc-haftalik.py'nin GSC_CIKTI_DIZIN ezmesi de bu revert'lerle kalkar)
cd /home/suha/projeler/suharitasi
git revert --no-edit <CRON-COMMIT>     # cron bağı + KARARLAR §31 + kayıtlar
git revert --no-edit 3f9e8fa           # teşhis raporu + GUNLUK + SIRADAKILER
git revert --no-edit 563bf95           # su-izleme'nin rutin otomatik commit'i
git push

# ── 5) YEDEK: geri alınacak bir şey YOK ─────────────────────────────
# 19:32 koşumu gecelik işin aynısıdır; önceki kuşak zaten
# /home/suha/yedek/suharitasi/onceki/ altında durur. Dönülmek istenirse:
# cp /home/suha/yedek/suharitasi/onceki/depo.bundle /home/suha/yedek/suharitasi/guncel/

# ── 6) SCRATCH ARTEFAKTLARI (depo dışı) ─────────────────────────────
rm -rf /tmp/claude-1000/-var-www-arslanhukuk-tr/e8997e68-1f9f-4f62-8f77-e22b9c637926/scratchpad/geri-okuma
rm -f  /tmp/suharitasi-gsc-haftalik.lock
```

**Not:** `izleme/crontab-onceki-20260825.txt` bu seansın BAŞINDAKİ
crontab'ın birebir kopyasıdır (65 satır) — 1. adımdaki tek komutluk
geri yükleme yolu odur.
