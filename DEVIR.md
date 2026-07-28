# DEVIR.md — projeyi devralacak kişi için

Amaç: bu projeyi bugüne kadar yürüten kişi ortadan kalkarsa, yerine geçecek
kişinin **siteyi ayakta tutmak ve veri akışını sürdürmek** için bilmesi
gereken her şey. (İngilizcede "bus factor" denen risk.)

**Sır/anahtar bu dosyaya YAZILMAZ.** Yalnız nerede durdukları yazılır.

Son güncelleme: 2026-07-28.

---

## 0. Otuz saniyelik özet

- **Site** (suharitasi.com) **Cloudflare Pages**'te barınır, **statiktir** ve
  **Hetzner sunucusundan bağımsız ayakta kalır.** Sunucu tamamen ölse site
  çalışmaya devam eder; yalnız veri tazelenmesi durur.
- **Sunucu** (Hetzner VPS, 4 çekirdek / 8 GB) yalnız **veri üretir ve
  denetler**: cron'lar veriyi çeker, depoya commit eder, site sağlığını
  ölçer.
- **Yayın zinciri:** git `main`'e push → Cloudflare Pages otomatik derler →
  canlı. **Merge = yayın.** Ayrı "yayınla" düğmesi yoktur.
- Kararların gerekçesi **KARARLAR.md**'de, açık işler **SIRADAKILER.md**'de,
  günlük kayıt **GUNLUK.md**'de, kurallar **CLAUDE.md**'de.

---

## 1. Erişimler — nerede durur

| Ne | Nerede | Not |
|---|---|---|
| Git deposu | `https://github.com/suharitasi/suharitasi.git` (origin) | Tek uzak kopya. Veri arşivinin BÜYÜK kısmı buradadır (bkz. §5). |
| Sunucu | Hetzner VPS · kullanıcı `suha` · proje `/home/suha/projeler/suharitasi` | SSH anahtarı kullanıcının kendi makinesindedir. |
| Sırlar | Sunucuda `/home/suha/projeler/suharitasi/.env` — **gitignore'da, hiçbir yedekte yok** | İçindeki anahtar ADLARI: `EPIAS_USER`, `EPIAS_PASS`, `CF_DEPLOY_HOOK`. Değerler yalnız bu dosyada. |
| Cloudflare | Pages projesi + DNS + WAF/rate-limit kuralları | Hesap erişimi kullanıcıdadır. Panelden yapılan hiçbir ayar repoda değildir. |
| EPİAŞ | Baraj/enerji verisi API'si | Kullanıcı adı/şifre `.env` içinde. |

**Devralan ilk gün ne yapmalı:** `.env`'in bir kopyasını güvenli bir yere
(şifre yöneticisi) alın. Bu dosya kaybolursa baraj pipeline'ı ve deploy hook
çalışmaz; EPİAŞ hesabı yeniden alınabilir ama gecikme olur.

---

## 2. Dizin haritası

```
suharitasi/
├── src/               Astro kaynak — sayfalar, bileşenler, veri modülleri
│   ├── pages/         Yayımlanan her sayfa (174 sayfa)
│   ├── components/    Bileşenler
│   └── data/          Build anında okunan veri modülleri (sayı bekçileri burada)
├── public/            Doğrudan kopyalanan varlıklar (görsel, video, /s/*.js)
├── data/              ÜRETİLEN veri
│   ├── canli/         Sitenin okuduğu güncel veri (baraj.json, grace-turkiye.json)
│   ├── arsiv/         Tarihsel arşiv (grace 507 MB, mevzuat 23 MB, baraj 1,6 MB)
│   ├── havzalar/      25 havza künyesi
│   └── il-kurum.json  81 il → DSİ bölgesi + su idaresi eşlemesi
├── veri/potansiyel/   Su potansiyeli katmanı verisi (11 dosya, git'te)
├── kaynak/dsi-arsiv/  DSİ belge arşivi (230 dosya, git'te)
├── arac/              Tüm scriptler (pipeline, sağlık, denetim)
├── izleme/            Sağlık sistemi yapılandırması + üretilen durum dosyaları
├── rapor/, denetim/   İş raporları (tarihsel kayıt)
└── log/               Pipeline günlükleri (gitignore — yalnız diskte)
```

Yol gösterici belgeler: **BRIEF.md** (çatı) · **CLAUDE.md** (kurallar) ·
**KARARLAR.md** (neden böyle) · **SIRADAKILER.md** (iş kuyruğu) ·
**GUNLUK.md** (günlük kayıt) · **DESIGN.md** (tasarım bağlayıcı) ·
**VIZYON.md** (harita deneyim hedefi) · **KAYNAKLAR.md** (veri kaynağı +
lisans künyeleri).

---

## 3. Cron envanteri — ne, ne zaman, ne yapar

`crontab -l` ile görülür. Tamamı `nice -n 10` ile çalışır.

| Saat (UTC) | İş | Ne yapar | Log |
|---|---|---|---|
| `*/10` | `arac/bellek-log.sh` | Her 10 dk `free -m` ölçümü; sağlık bekçisinin bellek eşiği girdisi | `~/bellek-log.txt` |
| 04:20 Sal | `arac/rg-nobetci.py --kosum` | Resmî Gazete işletme sahası nöbetçisi (haftalık) | `log/rg-nobetci.log` |
| 04:40 Çar | `arac/nhyp-yayin-nobetci.py --kosum` | NHYP yayın nöbetçisi (haftalık, iki kanal) | `log/nhyp-nobetci.log` |
| 05:30 | `izleme/su-izleme.sh` | Su Kanunu izleme (RG fihrist + TBMM + Bakanlık/DSİ fark motoru) | `izleme/log/cron.log` |
| 06:00 Pzt | `arac/grace-guncelle.sh` | GRACE yeraltı suyu verisi (haftalık Last-Modified kontrolü) | `data/arsiv/grace/cron.log` |
| **06:40** | `arac/site-saglik.mjs --tam` | Tam site sağlık koşusu (22 kalem + Lighthouse) | `log/site-saglik-cron.log` |
| 07:00 | `saglik-bekcisi.sh` | **Bekçinin bekçisi** — pipeline'dan bağımsız sessiz-ölüm gözcüsü | `log/bekci-cron.log` |
| 15:00 | `arac/baraj-gunluk.sh` | Baraj doluluk verisi (EPİAŞ; 18:00 TR) | `data/arsiv/baraj/log/cron.log` |
| 16:00 | `izleme/su-izleme.sh` | Su Kanunu izleme (ikinci tur) | `izleme/log/cron.log` |
| **19:30** | `arac/site-saglik.mjs --tam` | Tam site sağlık koşusu (ikinci tur) | `log/site-saglik-cron.log` |

**Sunucu paylaşımlıdır.** Aynı makinede başka projelerin systemd timer'ları
çalışır (BIST/ScalpHub, arslan-monitor, muvekkil-*). Saat seçerken bunlar
hesaba katılmıştır — ayrıntı: `izleme/kaynak-takvimi.md`. 06:40 saati
2026-07-28'de çakışma teşhisiyle 07:30'dan taşındı.

**Kilit:** Depoya otomatik commit atan HER iş tek kilidi kullanır —
`flock /tmp/suharitasi-git.lock` (`arac/git-kilit.sh`). Kilit olmadan iki
iş aynı anda push edip biri sessizce yerelde kalırdı.

---

## 4. Pipeline'lar — ne yaparlar

Hepsi aynı dayanıklılık sözleşmesine uyar (CLAUDE.md "Sessiz hata yasağı"):
`set -euo pipefail` · başarı ölçütü **commit teyididir** (HTTP kodu değil) ·
hata sayacı ancak commit teyidinden sonra sıfırlanır · 3 ardışık hata →
UYARI dosyası.

1. **Baraj** (`arac/baraj-gunluk.sh` → `arac/baraj-cek.mjs`)
   EPİAŞ'tan günlük baraj doluluk verisi çeker → `data/canli/baraj.json` +
   `data/arsiv/baraj/` → değişiklik varsa commit+push → deploy hook.
   Tazelik eşiği: 48 saat (sağlık kalemi md10).
2. **GRACE** (`arac/grace-guncelle.sh` → `arac/grace-isle.py`)
   NASA GRACE yeraltı suyu kütle anomalisi. Haftalık Last-Modified kontrolü;
   yeni sürüm varsa indir → sha256 → işle → `data/canli/grace-turkiye.json`.
   Ham NetCDF (`data/arsiv/grace/ham/`, 507 MB) **GitHub 100 MB dosya limiti
   yüzünden gitignore'dadır** — yalnız sha256 kaydı git'tedir. Bkz. §5.
   Tazelik eşiği: 8 gün.
3. **Su Kanunu izleme** (`izleme/su-izleme.sh`)
   Üç modül: RG günlük fihrist yoklaması (deterministik), TBMM fark motoru,
   Bakanlık/DSİ fark motoru. Hedefler `izleme/hedefler.conf` içinde.
   Yakalanan her değişiklik tarihli arşive girer.
4. **RG işletme sahası nöbetçisi** (`arac/rg-nobetci.py`) — haftalık,
   yeni işletme sahası ilanlarını yakalar.
5. **NHYP yayın nöbetçisi** (`arac/nhyp-yayin-nobetci.py`) — haftalık, iki
   kanaldan Nehir Havzası Yönetim Planı yayınlarını izler.
6. **Site sağlık sistemi** (`arac/site-saglik.mjs`) — üç mod: `--tam` (cron),
   `--hizli` (deploy sonrası), `--test` (sanal doğrulama). 22 kalem.
   Otomatik onarım BEYAZ LİSTEYLE SINIRLI (CSP direktifi, kaybolan
   yönlendirme, sitemap'te 404, pipeline tekrarı). Performans, tasarım,
   içerik/hukuk, JSON-LD, veri kaynağı, mimari = **kara liste, asla otomatik
   onarılmaz.** Sonuç `izleme/SITE-DURUM.md`'ye yazılır — **her oturumun
   başında okunması gereken dosya budur.**
7. **Sağlık bekçisi** (`saglik-bekcisi.sh`) — pipeline'ları ÇAĞIRMAZ; yalnız
   git log + dosya mtime okur. Son başarılı sağlık koşusu ≥14 saat eskiyse
   🔴 verir. Pipeline kendini denetleyemez, bu yüzden ayrıdır.
8. **Yedek** (`arac/yedek-al.sh`) — gecelik, ikinci konuma sıkıştırılmış
   yedek + sha256 manifest. Bkz. §5.

---

## 5. Veri: ne kayıp olur, ne olmaz

**GitHub'da (güvende):** `kaynak/dsi-arsiv/` (230 dosya) · `data/arsiv/`
(mevzuat, baraj, dsi-yas) · `veri/potansiyel/` (11 dosya) · `data/canli/` ·
`src/`, `public/`, tüm scriptler ve belgeler. Sunucu ölse bunlar durur.

**GitHub'da DEĞİL (yalnız sunucuda):**
- `data/arsiv/grace/ham/` — 507 MB ham NetCDF. GitHub 100 MB dosya limiti.
  **Yeniden indirilebilir** (NASA GSFC açık); sha256 kaydı git'tedir.
- `kaynak/tr-atlas-master.png` — 24 MB. `kaynak/` gitignore'da.
- `kaynak-video/` — 22 MB ham Midjourney videosu. Encode edilmiş sürümler
  `public/deneyim/video/` altında ve git'tedir; **ham dosyalar yeniden
  üretilemez** (ücretli üretim).
- `.env` — sırlar. Kasten yedeklenmez.
- `log/` — pipeline günlükleri.

Bu boşluk için gecelik yerel yedek kurulmuştur (§4.8) — **ama ikinci konum
aynı makinededir; makine ölümüne karşı korumaz.** Ayrıntı ve kullanıcı
kararı bekleyen seçenekler: `rapor/yedek-envanteri.md`, kurtarma planı:
`rapor/kurtarma-plani.md`.

---

## 6. Yayın zinciri

```
worktree'de iş → ölçüm (taban gerilemesi 0) → main'e merge → git push
   → Cloudflare Pages otomatik derleme → canlı
   → arac/site-saglik.mjs --hizli (deploy sonrası doğrulama)
```

- Ek tetik: bazı pipeline'lar `.env`'deki `CF_DEPLOY_HOOK` adresine POST
  atar. **Hook'un HTTP 200 dönmesi başarı SAYILMAZ** — başarı ölçütü canlı
  içerik imzasıdır.
- Yerel ölçüm **`arac/dist-sun.mjs`** ile yapılır (CSP + `_redirects`
  uygular). `python3 -m http.server` üzerinde alınan kanıt "canlı çalışıyor"
  saymaz.

---

## 7. Acil durum adımları

### 7.1 Deploy gelmiyor (push edildi ama canlı değişmedi)
1. `git log -1 origin/main` — commit gerçekten uzakta mı?
2. Cloudflare Pages panelinde son derleme durumu (başarısız derleme sessizce
   eski sürümü canlıda bırakır).
3. Canlı içerik imzasıyla doğrula: `curl -s https://suharitasi.com/ | grep -c "<beklenen dize>"`.
4. Cloudflare edge cache: silinen dosya 7 güne kadar 200 dönebilir
   (`s-maxage 604800`). Cache purge panelden.
5. Son çare: `.env`'deki `CF_DEPLOY_HOOK` adresine POST.

### 7.2 Cron düştü / veri bayatladı
1. `izleme/SITE-DURUM.md` oku — md10 (veri tazeliği) ve md20 (altyapı)
   kalemleri ne diyor?
2. `UYARI-SAGLIK.md` var mı? (Bekçi 3 ardışık hatada üretir.)
3. İlgili log: §3 tablosundaki dosya.
4. Elle koşum: ilgili scripti doğrudan çalıştır; **kilidi bekle**
   (`flock /tmp/suharitasi-git.lock`).
5. Cron servisi ayakta mı: `systemctl status cron`.
6. Sunucu donması geçmişte yaşandı (2026-07-28 teşhisi) — kaynak çakışması.
   `izleme/kaynak-takvimi.md` çakışma tablosunu okuyun.

### 7.3 Veri bozuldu (pipeline yanlış veri yazdı)
1. **Altın örnek testleri:** `node arac/altin-ornek.mjs` — bilinen girdi →
   bilinen çıktı. Sapma varsa ayrıştırıcı bozulmuştur.
2. `git log --oneline -- data/canli/<dosya>` → son iyi sürüme dön:
   `git checkout <commit> -- data/canli/<dosya>`.
3. Site sayı bekçileri build'i düşürür (exit 1) — yanlış sayı canlıya
   ÇIKAMAZ. Build hatası veriyorsa önce veriyi düzeltin.

### 7.4 Site kırmızı (sağlık koşusu 🔴)
1. `izleme/SITE-DURUM.md` — hangi kalem, hangi mesaj.
2. Kırmızı MOD BAŞINA korunur: başka modda yeşil koşu kırmızıyı KAPATMAZ.
3. Otomatik onarım beyaz listesi dışındaki hiçbir şey kendiliğinden
   düzelmez — kara liste kalemlerinde DUR ve kullanıcıya bildir.

### 7.5 Sunucu tamamen kayboldu
`rapor/kurtarma-plani.md` — adım adım, süre tahminiyle.

---

## 8. Devralanın ilk haftası — sıra

1. `.env`'i güvenli yere kopyala (§1).
2. GitHub ve Cloudflare erişimini devral.
3. `BRIEF.md` → `CLAUDE.md` → `KARARLAR.md` → `SIRADAKILER.md` sırasıyla oku.
4. `izleme/SITE-DURUM.md`'yi bir hafta her gün oku — sistemin nabzı orada.
5. Bir kez elle `node arac/site-saglik.mjs --test` koş (sanal doğrulama,
   siteye dokunmaz).
6. `rapor/kurtarma-plani.md`'yi oku ve kullanıcı kararı bekleyen kalemleri
   (depo dışı yedek konumu, ücretli seçenekler) karara bağla.
