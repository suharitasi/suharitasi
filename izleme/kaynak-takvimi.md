# KAYNAK TAKVİMİ — sunucuda ne, ne zaman, ne kadar

Kalıcı belge (B2.1, 2026-07-28). **Sunucu PAYLAŞIMLIDIR:** suharitasi
dışında BIST/ScalpHub, arslan-* ve muvekkil-* projeleri aynı makinede
zamanlanmış iş çalıştırır. Yeni bir iş zamanlanmadan ÖNCE bu tablo okunur.

**Sunucu:** Hetzner VPS · 4 çekirdek · 7,6 GB RAM · **6,0 GB swap
(`/swapfile`, prio -2)** · 75 GB disk (%34 dolu) · sistem saati **UTC**.
BIST timer'ları `Europe/Istanbul` (UTC+3) tanımlıdır; aşağıdaki tabloda
**hepsi UTC'ye çevrilmiştir**.

---

## 1. suharitasi işleri (crontab, UTC)

| Saat (UTC) | İş | Süre | Tepe RSS | Ölçüm |
|---|---|---|---|---|
| `*/10` | `arac/bellek-log.sh` | 0,01 sn | 4 MB | ölçüldü 28.07 |
| **02:10** | `arac/yedek-al.sh` **(YENİ)** | 27 sn (ilk) / 11 sn (değişmemiş) | 180 MB | ölçüldü 28.07 |
| **02:40 Pzt** | `arac/grace-guncelle.sh` *(06:00'dan taşındı)* | ölçülmedi | **ölçülmedi** | bkz. §3.1 |
| 04:20 Sal | `arac/rg-nobetci.py --kosum` | 13,1 sn | 24 MB | ölçüldü (`--test`) |
| 04:40 Çar | `arac/nhyp-yayin-nobetci.py --kosum` | 27,7 sn | 24 MB | ölçüldü (`--test`) |
| **05:45** | `izleme/su-izleme.sh` *(05:30'dan taşındı)* | ölçülmedi | ölçülmedi | ağ-bağımlı |
| 06:40 | `arac/site-saglik.mjs --tam` | **452 sn** | **1.917 MB** | ölçüldü (rapor/sunucu-donma.md) |
| 07:00 | `saglik-bekcisi.sh` | 1,97 sn | 11 MB | ölçüldü 28.07 |
| **15:05** | `arac/baraj-gunluk.sh` *(15:00'dan taşındı)* | ölçülmedi | ölçülmedi | ağ-bağımlı (EPİAŞ) |
| **16:15** | `izleme/su-izleme.sh` *(16:00'dan taşındı)* | ölçülmedi | ölçülmedi | ağ-bağımlı |
| 19:30 | `arac/site-saglik.mjs --tam` | 452 sn | 1.917 MB | ölçüldü |
| **20:10 (ayın 1'i)** | `site-saglik.mjs --tam --dis-link-tam` **(YENİ)** | **~27 dk** | ~1.917 MB | 29.07 ölçümü: 1.039 link × ≥0,7 sn + koşumun kalanı; 25 dk'lık denemede bitmedi |
| **05:20 Çar** | `arac/mevzuat-radar.sh` *(sarmalayıcı; doğrudan .py yerine, 04.10.2026)* | ~30 sn | düşük | `.py` yazıyordu ama commit etmiyordu → kirli ağaç; sarmalayıcı yalnız `data/kamu/mevzuat-*.json` commit eder |
| **21:00** | `arac/kesif/kesif-gunluk.sh` **(YENİ, 04.10.2026)** | ~40 sn / ~39 hedef | düşük | Ölçüm: 19:30 `--tam` ~19:38 biter; ayın 1'i 20:10 tam dış-link ~27 dk; indexnow :25 yalnız çift saat → 21:00 boş. Kaynak yoklama + otorite filtresi + aday kuyruğu + Telegram |

`--hizli` (deploy sonrası, zamanlanmamış): 68 sn / 1.074 MB.
`arac/altin-ornek.mjs` (md23): 0,31 sn / 43 MB — sağlık koşumunun içinde.

## 2. Diğer projelerin işleri (systemd timer, UTC'ye çevrildi)

Maliyetleri **ölçülmedi** — başka projelerin işleridir, bu revizyonun
kapsamı dışında. Yalnız ZAMANLARI çakışma analizi için listelenir.

| Saat (UTC) | Timer | Kaynak tanımı |
|---|---|---|
| **05:00** | **`kesif-botu`** (suha) | 08:00 TR — 29.07.2026'da `/root/araclar/kesif-botu` → `/home/suha/araclar/kesif-botu` taşındı; eski `bist-kesif.timer` **disabled**. Komşuluk: 04:40 nhyp-nöbetçi (Çar) ve 05:00 `bist-kesif` **artık ateşlemiyor** → çakışma YOK. İlk koşum 30.07 05:00 UTC. |
| her 5 dk | `arslan-monitor`, `muvekkil-saglik` | `OnUnitActiveSec=5min` |
| her saat :00 | `arslan-analytics` | `OnCalendar=hourly` |
| `*:00/10` | `sysstat-collect` | — |
| 23:30 | `bist-tefas` | 02:30 TR |
| 00:00 | `bist-midday`, `bist-portfoy` | 03:00 TR |
| 00:20 | `bist-mail-backup` | 03:20 TR |
| 00:45 | `bist-health` | 03:45 TR |
| 01:40 | `bist-temettu` | 04:40 TR |
| 03:30 | `bist-scalp` (06:30 TR) · `muvekkil-yedek` (UTC) | — |
| 04:30 | `bist-imar` | 07:30 TR |
| ~~05:00~~ | ~~`bist-kesif`~~ | **DEVRE DIŞI 29.07.2026** — `kesif-botu` olarak `suha`ya taşındı (yukarıda) |
| 05:20 → 17:20 (2 saatte bir, Pzt-Cum) | `bist-watch` | 08..20:20 TR |
| 05:30 → 18:30 (her saat :30, Pzt-Cum) | `bist-alerts` | 08..21:30 TR |
| 06,08,10,12,14,16:00 | `bist-health` | 09..19:00 TR |
| 07:00 → 15:00 (her saat, Pzt-Cum) | `bist-screener-intraday` | 10..18:00 TR |
| 07:00,09,11,13 (Pzt-Cum) | `bist-midday` | 10,12,14,16 TR |
| 07:05 → 14:05/20 (Pzt-Cum) | `bist-scalp-live` | 10..17:05/20 TR |
| 07:15 → 15:15 (her saat :15, Pzt-Cum) | `bist-light` | 10..18:15 TR |
| 07:30 | `bist-katilim` | 10:30 TR |
| 07:30 → 15:30 (her saat :30, Pzt-Cum) | `bist-flow` | 10..18:30 TR |
| 15:45 | `bist-intraday-archive` | 18:45 TR |
| 16:30 | `bist-yabanci` | 19:30 TR |

**Yoğun pencere: 07:00-15:30 UTC (10:00-18:30 TR)** — BIST seansı. Bu
pencerede aynı anda 5-6 timer ateşleyebilir.

---

## 3. Çakışma analizi ve yapılan dağıtım

Ölçülen çakışmalar (aynı dakikada ateşleme):

| Çakışma | Karşı taraf | Karar |
|---|---|---|
| GRACE 06:00 Pzt | `bist-health` 06:00 **+ 40 dk sonra `--tam` (1.917 MB)** | **TAŞINDI → 02:40 Pzt** |
| su-izleme 05:30 | `bist-alerts` 05:30 (Pzt-Cum) | **TAŞINDI → 05:45** |
| su-izleme 16:00 | `bist-health` 16:00 | **TAŞINDI → 16:15** |
| baraj 15:00 | `bist-screener-intraday` 15:00 (Pzt-Cum) | **TAŞINDI → 15:05** |
| bekçi 07:00 | `bist-midday` + `bist-screener` 07:00 | **DEĞİŞMEDİ** — iş 1,97 sn / 11 MB; taşımanın faydası ölçülemez, ayrıca bekçi 06:40 `--tam` koşumunu denetlemek için ondan SONRA çalışmalıdır. |
| yedek 02:10 (yeni) | — | çakışma yok (en yakın: 01:40 ve 03:30) |
| `--tam` 06:40 / 19:30 | — | çakışma yok (28.07'de zaten taşınmıştı) |

### 3.0 AYLIK TAM DIŞ BAĞLANTI TARAMASI (29.07.2026 — eksik bulundu)
`--tam` her koşuda dış bağlantıların **%5'ini** (52/1039) tarar; tam tarama
`--dis-link-tam` bayrağıyla yapılır ve **cron'da KAYDI YOKTU** (ölçüldü:
`crontab -l | grep dis-link-tam` → 0). Yani "aylık tam tarama" fiilen
hiç koşmuyordu. Eklendi: **ayın 1'i 20:10 UTC**.
Saat gerekçesi: 19:30 `--tam` ~19:38'de biter; sonraki komşu 23:30
(`bist-tefas`) → 3 saatten fazla açıklık. 27 dakikalık koşum bu pencereye
rahat sığar; 03:xx penceresi `bist-scalp`/`muvekkil-yedek` (03:30) ile
çakışırdı.

### 3.1 En güçlü gerekçe: GRACE ile `--tam` üst üste binebiliyordu
GRACE 06:00 Pzt'de başlıyordu; `--tam` 06:40'ta başlıyor ve **1.917 MB**
tepe yapıyor. GRACE 507 MB'lık NetCDF'i GDAL ile bant bant okur; süresi
**ölçülmedi** (koşum canlı `data/canli/*.json` dosyalarını yeniden yazar,
ölçüm için ayrı kopya gerekir — bu revizyonda yapılmadı). 40 dakikadan uzun
sürerse iki iş çakışırdı. 02:40'a taşınınca en yakın komşuya **50 dakika**
mesafe kaldı.
*Not: GRACE'in bellek dizisi küçüktür (240 ay × 14 satır × 40 sütun × 8 B ≈
1,1 MB); baskın maliyet GDAL'ın dosya G/Ç'sidir.*

---

### 3.2 KEŞİF BOTU TAŞINDI (29.07.2026) — çakışma etkisi
Bot artık `suha` kullanıcısında ve **aynı saatte** (05:00 UTC) koşuyor;
toplam yük değişmedi, yalnız sahibi değişti. Doğrulandı (root gerekmeden,
`systemctl` ile): `kesif-botu.timer` **enabled**, sonraki koşum
**30.07 05:00 UTC**; `bist-kesif.timer` **disabled** (`0 timers listed`).
BIST bozulmadı: `bist-api` **active**, `127.0.0.1:8001/health` → **403**
(28.07 tabanıyla aynı).

## 4. Swap ve gerçek bellek baskısı (ölçüldü)

`~/bellek-log.txt` — 1.012 ölçüm, 21.07 21:48 → 28.07 22:06 (7 gün).

| | Değer |
|---|---|
| Swap | **VAR — 6,0 GB** (`/swapfile`) · kullanılan **132 MB** |
| Ortanca kullanılabilir RAM (24 saat boyunca) | **6,40-6,46 GB** — saatten saate neredeyse sabit |
| Son 5 günün (24-28.07) en düşüğü | **5.013 MB** |

**Baskı yalnız iki anda görüldü, ikisi de 23 Temmuz'da:**

| Zaman | Kullanılabilir | Swap |
|---|---|---|
| 23.07 14:20 | **90 MB** | **6.047 MB** |
| 23.07 16:10 | 173 MB | 2.315 MB |

24 Temmuz'dan bu yana **hiçbir ölçümde 5 GB'ın altına inilmedi.** Yani:
- **Swap ekleme önerisi YOK** — swap zaten var ve neredeyse hiç kullanılmıyor.
- Sistem ayarı (swappiness vb.) **DEĞİŞTİRİLMEDİ** (brief: sistem
  değişikliği uygulanmaz).
- 23.07 olayları `rapor/sunucu-donma.md`'de ayrıca teşhis edildi; oradaki
  dürüst kayıt korunuyor: **çakışma ölçüldü, şiddeti kanıtlanmadı.** Bu
  belgedeki dağıtım da aynı statüdedir — **önlemdir, kanıtlanmış kök neden
  düzeltmesi değildir.**

---

## 5. Yeni iş eklerken kural

1. Bu tabloyu oku; hedef dakikada başka iş var mı bak (UTC'ye çevir!).
2. Ağır iş (>500 MB veya >2 dk) **07:00-15:30 UTC penceresine konmaz.**
3. Ağır iş, `--tam` koşumlarının (06:40 / 19:30) **±30 dakikasına konmaz.**
4. Depoya commit atacaksa `flock /tmp/suharitasi-git.lock` kullanır.
5. Eklendikten sonra bu dosya **aynı commit'te** güncellenir.
