# Sunucu donma teşhisi + koşum koruması (28 Tem 2026)

Brief: `cikti/brief/2026-07-28-sunucu-donma.md` (orijinal, değiştirilmedi) ·
düzeltilmiş: `cikti/brief/2026-07-28-sunucu-donma-duzeltilmis.md`
Denetçi: 2 ENGEL + 3 UYARI → ekleme/netleştirmeyle 0 ENGEL + 1 UYARI
(`cikti/denetim/yuk/` o an yoktu — üretilecek çıktı dizini, şimdi var).
Kanıtlar: `cikti/denetim/yuk/`

---

## 1. Kaynak envanteri (ölçüldü 28.07, 20:34 UTC)

| Kalem | Ölçüm |
|---|---|
| RAM | 7,6 GB toplam · 5,7 GB kullanılabilir |
| **SWAP** | **VAR — 6,0 GB swapfile** (`/swapfile`, kullanılan 132 MB, prio -2) |
| Çekirdek | 4 |
| Disk | 75 GB · %32 dolu · 50 GB boş |
| Yük | 0,19 / 0,08 / 0,27 |
| Uptime | 7 gün 14 saat (son yeniden başlatma 21 Tem 06:26) |
| vm.swappiness | 60 · overcommit_memory 0 |

**Briefin "swap yokluğu" hipotezi ölçümle yanlışlandı** — swap zaten var.
Bu yüzden "swap ekle" önerisi yazılmadı; aşağıda swap'ın rolü ayrıca ele alındı.

## 2. OOM/kill izleri

| Kaynak | Sonuç |
|---|---|
| `dmesg` | **DOĞRULANMADI** — "read kernel buffer failed: Operation not permitted" |
| `journalctl -k` | **DOĞRULANMADI** — kullanıcı `adm`/`systemd-journal` grubunda değil |
| `/var/log/kern.log`, `/var/log/syslog` | **DOĞRULANMADI** — Permission denied |
| `sudo -n` | **DOĞRULANMADI** — parola istiyor (etkileşimsiz oturumda alınamaz) |

Hangi sürecin çekirdek tarafından öldürüldüğü **doğrulanmadı**. Aşağıdaki bulgu
OOM-killer kaydına DEĞİL, sistem yük geçmişine ve dosya izlerine dayanır.

Erişilebilen alternatif kanıt: `sysstat` kurulu ve 10 dk'da bir örnekliyor
(`/var/log/sysstat/sa20..sa28`), ayrıca projenin kendi `bellek-log.txt`'si
(1003 ölçüm) canlı ve eksiksiz.

## 3. Koşum maliyeti (ölçüldü — `arac/kosum-olc.sh`, 0,5 sn aralık)

Ölçü tanımı: süreç ağacının toplam RSS'i (MB); eşzamanlı chrome = aynı anda
yaşayan chrome/chromium PID sayısı (sistem geneli; taban 5 süreç).

| Koşum | Süre | Tepe ağaç RSS | Eşz. chrome | En düşük boş bellek | Tepe yük |
|---|---|---|---|---|---|
| `--hizli` | 67,6 sn | **1074 MB** | 13 | 5592 MB | 2,33 |
| `--tam` (dist yok) | 452,2 sn | **1917 MB** | 17 | 4843 MB | 3,18 |
| `--tam` (dist var, tam kapsam) | 566,3 sn | **1919,5 MB** | 17 | 4853 MB | 3,17 |
| `npm run build` | 8,4 sn | 505,6 MB | 3 | 5477 MB | 1,01 |
| `--test` | 8,5 sn | 1065,7 MB | 13 | 5600 MB | 1,13 |

Hiçbir koşumda swap kullanımı artmadı (sabit 133 MB).

## 4. Çakışma takvimi

Suha crontab'ı (UTC): 04:20 Sal RG · 04:40 Çar NHYP · 05:30 + 16:00 su-izleme ·
06:00 Pzt GRACE · 07:00 bekçi · 07:30 + 19:30 sağlık `--tam` · 15:00 baraj ·
*/10 bellek-log.

Sistemde **ikinci bir proje** var: BIST + arslan + müvekkil portalı, **30+ root
systemd timer'ı, hiçbirinde `MemoryMax` yok** (`MemoryMax=infinity` ölçüldü).
Timer'lar Europe/Istanbul saatiyle tanımlı; yoğun pencere 10:00-18:30 TR =
**07:00-15:30 UTC**.

**Ölçülen çakışma:** `--tam`'ın sabah koşumu 07:30 UTC'ydi; `systemd-analyze`
ile doğrulandı ki `bist-flow` ve `bist-katilim` **tam aynı dakikada** ateşliyor
(next elapse 07:30:00 UTC), `bist-alerts` da hafta içi :30'da. 19:30 UTC ölçüldü
ve **temiz** bulundu (BIST timer'ları 18:30 UTC'de biter).

**Kapsam dışı (root):** BIST/keşif işlerinin kendi bellek tüketimi suha
oturumundan ölçülemedi. Çakışmanın varlığı ölçüldü, **şiddeti doğrulanmadı**.

## 5. BULGU

**Donma 23 Temmuz'da, iki kez oldu. Sebep sağlık koşumu DEĞİL.**

| Zaman (UTC) | RAM | Swap | Yük | %system / %iowait | Disk okuma |
|---|---|---|---|---|---|
| 23.07 14:20 | %94,86 (avail **90 MB**) | **%98,38** (6047 MB) | 1,84 | 2,9 / 4,1 | 7.060 blok/s |
| 23.07 16:10 | %93,36 (avail 173 MB) | %37,69 | 1,22 | 1,3 / 0,4 | 741 blok/s |
| 23.07 16:21 | %89,86 (avail 595 MB) | %85,73 (5213 MB) | **17,25** | **42,4 / 23,9** | **1.226.933 blok/s** |

Klasik takas yığılması (thrashing) imzası: çekirdek zamanı %42, G/Ç bekleme
%24, boşta yalnız %28, saniyede ~600 MB swap geri okuma. Sistem cevapsız kaldı.

**Cevapsızlığın bağımsız kanıtı:** `sysstat` toplayıcısı 16:20:01'de değil
**16:21:22'de** örnek alabildi — **81 sn gecikme**. Aynı gecikme projenin kendi
`bellek-log.txt` kaydında da var. 20-28 Tem arasında 30 sn üstü başka gecikme
YOK (21 Tem 06:26'daki 388 sn, çekirdek yükseltmesi sonrası **planlı yeniden
başlatmadır** — 6.8.0-134 → 6.8.0-136, donma değil).

**Süreç ölümü:** `plist-sz` 14:20→14:30 arasında 259→207 (52 süreç), 16:21→16:30
arasında 233→191 (42 süreç) düştü. Bellek, süreçler öldüğü için serbest kaldı.

**Sebebin adlandırılması.** İki olay penceresinde `/home/suha` altında dokunan
tek dosya Claude Code'un Playwright MCP kaydıdır ve iki olay da MCP sunucusunun
sonlanmasıyla **saniyesinde** biter:
- 14:20 olayı → `2026-07-22T19-55-37-187Z.jsonl`: "Sending SIGINT to MCP server
  process" **14:22:16**
- 16:21 olayı → `2026-07-23T15-07-27-561Z.jsonl`: aynı kayıt **16:21:22**

O gün sağlık koşumları 13:17-13:45 ve 19:32'de koştu — **iki olayın da
dışında**. Ölçülen maliyeti (1,9 GB) zaten ~13,5 GB'lık talebi açıklamıyor.

> **Bulgu:** donmanın sebebi, sınırlandırılmamış interaktif ajan oturumlarının
> (Claude Code + Playwright MCP + chromium filosu) bellek talebidir. RAM'in
> ardından 6 GB swap de tükendi; swap'ın varlığı donmayı **önlemedi, uzattı** —
> hızlı OOM yerine dakikalarca süren yığılma üretti.
>
> **Doğrulanmadı:** hangi sürecin öldürüldüğü (çekirdek kaydı root gerektiriyor).
> Yukarıdaki zincir korelasyondur; OOM kaydıyla teyit edilmemiştir.

### 5b. Yapısal arıza: donma 5 gün fark edilmedi

`bellek-log.txt` her iki olayı da **kaydetmiş**. Ama `saglik-bekcisi.sh`'in
eşiği ARDIŞIK pencere istiyordu: son **6** ölçümde swap >2048 MB **veya** son
**3** ölçümde available <500 MB. Olaylar 1-2 ölçüm sürüyor (süreçler ölünce
kendiliğinden "çözülüyor") — kural bu biçimi **yapısal olarak göremez**.

## 6. Uygulanan koruma (yalnız bulgunun gösterdiği sebebe)

**K1 — Bekçiye ANİ TEPE kalemi** (`saglik-bekcisi.sh`). Tek ölçümde ateşler,
pencereyi zaman damgasıyla keser (satır sayısıyla değil — logger duraksarsa
"son 24 saat" yalan olurdu). *Gerekçe: 5b'deki yapısal körlük; sebebin kendisi
bir daha sessizce geçmesin.*
Eşik **uydurulmadı, kalibre edildi**: 1003 ölçümlük gerçek log tarandı,
`available<500MB VEYA swap>2000MB` kuralı **3/1003** ateşledi — üçü de 23 Tem
donma örnekleri. Yanlış pozitif 0.

**K2 — Tek koşum kilidi** (`/tmp/suharitasi-saglik.lock`). İkinci koşum ölçüm
yapmaz, SITE-DURUM'u ezmez, **sessizce çıkmaz — raporlar**. Bayat kilit
(çökmüş koşum) `/proc/<pid>/cmdline` kontrolüyle devralınır ve loglanır.
*Gerekçe: koşum donmanın sebebi değil ama bir donma anının üstüne binmesi hem
arızayı büyütür hem ölçümü bozar.*

**K3 — Kaynak tavanı.** Koşum başında boş bellek tavanın altındaysa koşum
yapılmaz, "kaynak yetersiz" olarak raporlanır. Tavan **ölçümden türetildi**:
tepe RSS + %30 pay → `--tam` 2500 MB, `--hizli` 1400 MB.
Süreklilik ayrıntısı: kaynak/kilit yüzünden duran koşum `sonBasariliKosu`
damgasını **VURMAZ** — yoksa sistem üst üste stand-down yaparken bekçiye
sağlıklı görünürdü. Damga vurulmayınca bekçi 14 saat kuralıyla 🔴 verir.

**K4 — Cron çakışması.** Sabah `--tam` 07:30 → **06:40 UTC** (09:40 TR).
07:30'da iki root timer'ıyla aynı dakikadaydı ve BIST yoğun penceresinin
(07:00-15:30 UTC) içindeydi; 06:40'ta hiçbir timer ateşlemiyor. 19:30 ölçülerek
temiz bulundu, **değiştirilmedi**. Bekçinin 14 saat penceresi korunur
(koşumlar arası 12s50d ve 11s10d). Yedek: `cikti/denetim/yuk/once/crontab-once.txt`.
*Not: bu koruma önlemdir — çakışma ölçüldü, şiddeti (BIST'in bellek tüketimi)
root olduğu için doğrulanmadı.*

**Uygulanmayan:** swap ekleme (zaten var), sistem geneli bellek tavanı
(`MemoryMax`, earlyoom) — kalıcı sistem yapılandırması, kullanıcı kararı (§8).

## 7. Faz 3 — kırmızının mod değiştirerek kaybolması

**Arıza:** `--tam` kırmızı bulduktan sonra koşan `--hizli`, "Son koşu" tablosunu
üzerine yazıyordu. `--hizli`, `--tam`'ın kalemlerini (md9/md16/md17…) **ölçmediği**
için kırmızı sessizce kayboluyordu.

**Çözüm:** kırmızı "sonraki koşu yeşil geldi" diye değil, **o kalemin kendisi
yeniden ölçülüp geçtiğinde** kapanır. SITE-DURUM'a eklenenler: başlıkta
`🔴 KIRMIZI (çözülmemiş)` işareti (bu koşu yeşil olsa bile), "Çözülmemiş kırmızı"
tablosu (kalem + mod + mesaj), "Mod başına son ölçüm" tablosu. Ölçüm yapmamış
(kilit/kaynak) koşumlar ne kırmızı açar ne kapatır.

**Bit-eşit istisnası (brief izniyle):** bu kalemin çıktısı bilinçli değişir.
Önce/sonra: `cikti/denetim/yuk/once/SITE-DURUM-*.md`.

## 8. Kullanıcı kararına bırakılanlar

1. **Sistem geneli bellek tavanı.** Asıl sebep sınırsız ajan oturumlarıydı ve
   sunucuda hiçbir birimde `MemoryMax` yok. Kalıcı sistem etkisi olduğu için
   uygulanmadı. Seçenekler: (a) `systemd-run --scope -p MemoryMax=…` ile ajan
   oturumlarını sarmak, (b) `earlyoom` kurup yığılma yerine hızlı OOM almak,
   (c) BIST birimlerine `MemoryMax` vermek (o depo ayrı karar).
2. **`vm.swappiness=60`.** 6 GB swap'ın tamamı tükenebildiği için donma
   dakikalarca sürdü. Düşürmek (ör. 10) yığılmayı kısaltır — sistem ayarı.
3. **Log erişimi.** `suha` `adm`/`systemd-journal` grubunda olsaydı OOM kaydı
   okunabilir ve bu teşhis korelasyonla değil kanıtla kapanırdı.
4. **md17 kırmızısı açık** — 3 ölü dış bağlantı (dergipark, trdizin, doi.org).
   İçerik/kaynak kararı, otomatik onarım kara listesinde.

## 9. Kanıt dosyaları

`cikti/` **`.gitignore`'da** (mevcut düzen — kanıtlar sunucuda yerel durur,
depoya girmez). Dosyalar `cikti/denetim/yuk/`: `ozet-{hizli,tam,tam-kanit,build,test}.json` (tepe RAM,
süre, eşzamanlı chrome) · `ornek-*.tsv` (ham 0,5 sn örnekler) · `stdout-*.log` ·
`once/crontab-once.txt` · `once/SITE-DURUM-tam-sonrasi.md` · `falsifikasyon.md`
