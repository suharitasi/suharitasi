# 26.08.2026 — Cron log envanteri (YALNIZ ÖLÇÜM, onarım yok)

**Kapsam:** gsc-haftalik dışındaki cron satırları. **Hiçbir şey onarılmadı.**
**Yasak, girilmedi:** arslanhukuk.tr (`/home/suha/saglik/`, `/home/suha/yedek/`),
bist-*.

## Adım 0 — kapı

```
/home/suha/projeler/suharitasi
origin	https://github.com/suharitasi/suharitasi.git (fetch/push)
```
Ölçüm başlarken ağaç temizdi.

## SAYIM DÜZELTMESİ

Önceki raporumda "diğer 12 cron satırı" demiştim — **yanlıştı**. Gerçek:
`crontab -l` (suha) 18 iş satırı taşıyor, gsc-haftalik hariç **17**.
Bunun **4'ü arslanhukuk.tr'ye ait** (satır 13-16: `/home/suha/saglik/*`,
`/home/suha/yedek/*`) ve yasak kapsamda — betikleri okunmadı, logları
ölçülmedi. Kalan **13 satır / 10 benzersiz log** ölçüldü.

`sudo crontab -l` → **"no crontab for root"**. Root cron'u yok.
Sistem cron'ları (`/etc/cron.d`, `run-parts`, `debian-sa1`) paket
kaynaklı, kapsam dışı.

## BULGU 0 — sistem logrotate bu logların HİÇBİRİNİ kapsamıyor

`logrotate.timer` günlük koşuyor (son: 2026-08-26 00:00:01) ama
`/etc/logrotate.d/` altında `/home/suha` veya `suharitasi` eşleşmesi
YOK. Kullanıcı crontab'ında da logrotate satırı yok. Yani bu 10 dosyanın
tek olası koruması betiklerin kendi mekanizmasıdır — ve aşağıda
görüleceği gibi **hiçbirinde yok**.

## 1 — ENVANTER TABLOSU

Tavan/döndürme, trap ve damga sütunları **koda bakılarak** dolduruldu;
beyana güvenilmedi (gsc-haftalik'te beyan yanlış çıkmıştı).

| # | Zamanlama (UTC) | TR | Betik | Log | Boyut | Tavan/ döndürme | Damga | Exit kodu | trap EXIT |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `5 15 * * *` | 18:05 | arac/baraj-gunluk.sh | data/arsiv/baraj/log/cron.log | 21761 | **YOK** | **VAR** 330/383 | yok | yok |
| 2 | `40 2 * * 1` | Pzt 05:40 | arac/grace-guncelle.sh | data/arsiv/grace/cron.log | 342 | **YOK** | yok 0/6 | yok | yok |
| 3 | `0 7 * * *` | 10:00 | saglik-bekcisi.sh | log/bekci-cron.log | 2322 | **YOK** | yok 0/38 | yok | yok |
| 4 | `45 5 * * *` | 08:45 | izleme/su-izleme.sh | izleme/log/cron.log | 4579 | **YOK** | yok 0/108 | yok | **VAR** (temizlik) |
| 5 | `15 16 * * *` | 19:15 | izleme/su-izleme.sh | *(aynı log)* | — | — | — | — | — |
| 6 | `*/10 * * * *` | her 10 dk | arac/bellek-log.sh | log/bellek-log-cron.log | **0** | **YOK** | — | yok | yok |
| 7 | `40 6 * * *` | 09:40 | arac/site-saglik.mjs --tam | log/site-saglik-cron.log | 144847 | **YOK** | yok 0/1591 | `process.exitCode` var, **log'a yazılmıyor** | **VAR** (kilit) |
| 8 | `30 19 * * *` | 22:30 | arac/site-saglik.mjs --tam | *(aynı log)* | — | — | — | — | — |
| 9 | `20 4 * * 2` | Sal 07:20 | arac/rg-nobetci.py | log/rg-nobetci.log | 2606 | **YOK** | yok 0/40 | yok | yok |
| 10 | `40 4 * * 3` | Çar 07:40 | arac/nhyp-yayin-nobetci.py | log/nhyp-nobetci.log | 3700 | **YOK** | yok 0/80 | yok | yok |
| 11 | `10 2 * * *` | 05:10 | arac/yedek-al.sh | log/yedek-cron.log | 1784 | **YOK** | yok 0/29 | yok | yok |
| 12 | `10 20 1 * *` | ayın 1'i 23:10 | site-saglik.mjs --dis-link-tam | *(aynı log)* | — | — | — | — | — |
| 17 | `25 0,4,8,...` | 4 saatte bir | arac/indexnow-bildir.mjs | log/indexnow-cron.log | 528 | **YOK** | yok 0/12 | yok | yok |

**Sonuç: 10/10 log'da tavan/döndürme YOK. 13/13 satırda exit kodu log'a
yazılmıyor.** Zaman damgası yalnız baraj'ın cron log'unda var.

İki `trap EXIT` bulundu, **ikisi de çıkış kaydı için değil**:
`izleme/su-izleme.sh:65` geçici dosya temizliği,
`arac/site-saglik.mjs:135` `process.on('exit', kilitBirak)` kilit bırakma.

### Betiklerin kendi iç logları (cron yönlendirmesinden ayrı)

| Log | Boyut | Damga | Tavan |
|---|---|---|---|
| log/pipeline.log | 56865 | 375/844 | **YOK** |
| log/yedek.log | 31644 | 105/554 | **YOK** |
| log/uyari.log (Telegram) | 9611 | — | **YOK** |
| log/indexnow.log | 2044 | 32/32 | **YOK** |
| izleme/log/hata.log | 594 | 6/6 | **YOK** |

Desen gsc-haftalik'tekiyle aynı: **cron log damgasız, iç log damgalı.**

## 2 — BÜYÜME HIZI (ölçüldü, tahmin edilmedi)

Yöntem: damgalı loglarda benzersiz gün sayısı; damgasızlarda koşum
imzası sayısı × cron sıklığı. Doyum süreleri bugünkü boyuttan itibaren.

| Log | Boyut | **bayt/gün** | 1 MB'a | 10 MB'a | Ölçüm temeli |
|---|---|---|---|---|---|
| log/site-saglik-cron.log | 144847 | **4080** | 0,6 yıl | 7 yıl | 71 koşum / 2 koşum-gün |
| log/pipeline.log | 56865 | 1537 | 1,8 yıl | 19 yıl | 37 benzersiz gün |
| log/yedek.log | 31644 | 1055 | 2,6 yıl | 27 yıl | 30 benzersiz gün |
| data/arsiv/baraj/log/cron.log | 21761 | 531 | 5,3 yıl | 54 yıl | 41 benzersiz gün |
| log/indexnow-cron.log | 528 | 528 | 5,4 yıl | 54 yıl | 6 koşum / 6 koşum-gün |
| log/uyari.log | 9611 | 320 | 8,9 yıl | 90 yıl | ~30 gün |
| log/nhyp-nobetci.log | 3700 | 106 | 27 yıl | 272 yıl | 5 koşum haftalık |
| log/rg-nobetci.log | 2606 | 93 | 31 yıl | 309 yıl | 4 koşum haftalık |
| log/bekci-cron.log | 2322 | 70 | 41 yıl | 408 yıl | 33 koşum günlük |
| log/yedek-cron.log | 1784 | 62 | 47 yıl | 467 yıl | 29 koşum günlük |
| data/arsiv/grace/cron.log | 342 | 8 | 353 yıl | 3528 yıl | 6 koşum haftalık |
| log/bellek-log-cron.log | 0 | **0** | asla | asla | 35+ gün boyunca 0 bayt |
| izleme/log/cron.log | 4579 | **?** | ? | ? | **ÖLÇÜLEMEDİ** — koşum imzası yok |

**`izleme/log/cron.log` dürüstçe ölçülemedi:** damgasız ve her koşumda
satır üretmiyor (içeriği git hata mesajları), koşum sayısı sayılamadı.
Boyutu küçük (4579 bayt), ama hızı bilinmiyor.

### ÖNCEKİ UYARIMI ÖLÇÜM SINIRLANDIRDI

26.08 K1/K2 raporunda "site-saglik-cron.log 144 KB, pipeline.log 56 KB —
büyüyorlar" diye uyarmıştım. Ölçüm bunu boyutlandırdı: **en hızlı büyüyen
log bile 1 MB'a 0,6 yılda, 10 MB'a 7 yılda varıyor.** Disk dolması riski
bu makinede **pratikte yok**. K2 (tavansız log) bu 13 satır için acil bir
tehlike DEĞİL.

### İLGİLİ İRONİ — kendi işimin gerekçesini düzeltiyor

gsc-haftalik haftada bir koşuyor ve koşum başına ~250 bayt yazıyor →
**~36 bayt/gün**. 512 KB tavanına ulaşması ~40 yıl sürerdi. Yani
**tavanı olan tek log, en yavaş büyüyendi**; dün onardığım K2'nin gerçek
kazancı disk değil, `tail -c` kırpmasının veri kaybını durdurmasıydı.
Asıl değerli onarım K1'di. Bu envanter aynı yanılgıyı buraya taşımamak
için ölçümle açılıyor.

## 3 — ÖNCELİK SIRASI

Kriter: **kalemin kritikliği × bekçi kapsamı × K1 açığı**; büyüme hızı
(K2) ölçüm sonrası **düşük ağırlıklı** — hiçbiri yıllar içinde sorun
olmuyor.

### Bekçi kapsamı ölçüldü (K1'in fiili telafisi)

`saglik-bekcisi.sh` kontrol kalemleri: (a) commit yaşı · (b) baraj.json ·
(c) grace durum.json · (d) su-izleme DURUM.md · (d2) rg + nhyp nöbetçileri ·
(d2) IndexNow · (e) bellek eşiği · (f) site-saglik durumu.

**Bekçinin KAPSAMADIĞI kalemler (grep ile doğrulandı):**
`yedek-al.sh` · `gsc-haftalik.sh` · **bekçinin kendisi**.

| Sıra | Kalem | Gerekçe |
|---|---|---|
| **1** | **arac/yedek-al.sh** | Kritiklik en yüksek: makinedeki tek veri kaybı koruması. **Bekçi kapsamıyor** — bekçide yedek kalemi YOK (ölçüldü). Cron sessizce durursa hiçbir şey yakalamaz; başarısızlık uyarısı var ama *hiç koşmama* hâli kör. K1 tam açık (0/29 damga, exit kodu yok). Büyüme önemsiz (62 B/gün) — bu kalem **K1 için** öncelikli, K2 için değil. |
| **2** | **saglik-bekcisi.sh (bekçinin kendisi)** | Bekçi ölürse (a)-(f) sekiz kalemin tamamı sessizce kör kalır — tek nokta. Suharitasi tarafında bekçiyi izleyen yok. K1 tam açık (0/38). Küçük log, düşük büyüme. |
| **3** | **arac/site-saglik.mjs** (3 cron satırı) | En büyük log (144847 B) ve **en hızlı büyüyen** (4080 B/gün); 1591 satırda **hiç zaman damgası yok**, yani "hangi koşum nerede bitti" okunamıyor — teşhis değeri düşük. `process.exitCode` hesaplanıyor ama log'a yazılmıyor. Bekçi (f) ile kapsanıyor, bu yüzden 1-2'nin altında. |
| **4** | **izleme/su-izleme.sh** (2 cron satırı) | Bekçi (d) kapsıyor. **Özel not:** mevcut `trap ... EXIT` (satır 65) geçici dosya temizliği yapıyor — ortak yardımcı buraya körlemesine eklenirse bu temizlik **ezilir** (bkz. §4 ölçümü). Log damgasız, içeriği git hata mesajları; büyüme ölçülemedi. |
| **5** | **arac/baraj-gunluk.sh** | Veri hattı, günlük, siteye veri besliyor. Bekçi (b) kapsıyor. **K1 kısmen zaten kapalı** — cron log'undaki tek damgalı kalem (330/383). En az iş gerektiren kalem. |
| **6** | **arac/indexnow-bildir.mjs** | Bekçi (d2) çift kalemle kapsıyor (koşum yaşı + bildirim yaşı). İç log **tam damgalı** (32/32). Dağıtım kalemi, veri kaybı riski yok. |
| **7** | **arac/rg-nobetci.py · arac/nhyp-yayin-nobetci.py** | Haftalık, düşük hacim (93/106 B/gün), bekçi (d2) kapsıyor. Python tarafı ayrı uygulama gerektirir (§4). |
| **8** | **arac/grace-guncelle.sh** | Haftalık, en yavaş büyüyen gerçek log (8 B/gün), bekçi (c) kapsıyor. |
| **9** | **arac/bellek-log.sh** | **Risk yok.** 35+ gündür 0 bayt — betik çıktı üretmiyor. Bekçi (e) kapsıyor. Onarılacak bir şey yok. |

## 4 — ORTAK YARDIMCI: ÖLÇÜLDÜ, KISMEN — ÜÇE BÖLÜNÜR VE BASH'TE TEHLİKELİ

### Dil dağılımı (ölçüldü)

7 bash (`baraj-gunluk`, `grace-guncelle`, `saglik-bekcisi`, `su-izleme`,
`bellek-log`, `yedek-al`, `uyari-gonder`) · 2 node (`site-saglik.mjs`,
`indexnow-bildir.mjs`) · 2 python (`rg-nobetci.py`,
`nhyp-yayin-nobetci.py`).

Yani "ortak yardımcı" tek parça olamaz: **en az 3 ayrı uygulama** gerekir.
Paylaşılan tek şey sözleşme (satır biçimi + arşiv kuralı) olur, kod değil.

### Ölçüm: bash'te EXIT trap'i EZER, node/python'da YIĞILIR

Deney (`/tmp/.../trap-deney.sh`), çağıranın trap'i + yardımcının trap'i:

```
=== DENEY 1: iki EXIT trap ust uste ===
  betik govdesi calisti
  [yardimcinin trap'i] CIKIS kaydi yazildi
```
Çağıranın `temizlik` fonksiyonu **hiç çalışmadı** — ikinci `trap ... EXIT`
birincisini **sessizce ezdi**. Bash'te EXIT için tek slot var.

```
=== NODE ===                          === PYTHON ===
  [cagiranin] kilit birakildi           [yardimcinin] CIKIS kaydi
  [yardimcinin] CIKIS kaydi exit=0      [cagiranin] temizlik
```
`process.on('exit')` ve `atexit.register` **yığılır**, ikisi de çalışır.

**Bu asimetri doğrudan bir kaleme dokunuyor:** `su-izleme.sh:65`'te
`trap 'rm -f "$STATUSF" "$EVENTF"' EXIT` var. Bash yardımcısı buraya
körlemesine `trap cikis_kaydi EXIT` koyarsa **geçici dosya temizliği
kaybolur** — sessiz bir gerileme. Aynı desen ileride başka betikte de
doğabilir.

Zincirleme mümkün ama bilinçli yazılmalı; `trap -p EXIT` mevcut trap'i
okuyabiliyor (ölçüldü):
```
  okunan trap: trap -- 'temizlik' EXIT
```

### Öneri (UYGULANMADI)

**Ortak yardımcı EVET, ama üç ayrı uygulama + sözleşme olarak; ve
zorunlu olarak trap-zincirleyen.**

1. **Tek gerçek kaynak sözleşme olsun, kod değil.** Satır biçimi
   (`<ISO-8601 UTC> <ad>: ÇIKIŞ · exit=<kod> · dosya=<yol> · bayt=<n>`),
   512 KB tavan ve "en fazla 5 arşiv, kayan, kırpmasız" kuralı bir
   belgeye yazılsın; üç uygulama ona uysun.
2. **Bash yardımcısı (`arac/log-cerceve.sh`) 7 betiği kapsar** — ama
   EXIT trap'ini **ezmeyecek**, `trap -p EXIT` ile mevcut olanı okuyup
   **zincirleyecek** biçimde yazılmalı. Bu, yardımcının tek zorunlu
   davranış şartıdır; sınaması da su-izleme deseniyle yapılmalı.
3. **Node ve Python tarafı ayrı, ama küçük** — `process.on('exit')` /
   `atexit.register` yığıldığı için mevcut kodu ezme riski yok;
   site-saglik'in kilit bırakması bozulmadan üstüne eklenebilir.
4. **Karşı argüman kayda geçsin:** ortak yardımcı **yeni bir tek hata
   noktası** yaratır — bozulursa 7 bash betiği birden düşer. Şu an her
   biri bağımsız. Bu yüzden yardımcı, kendi falsifikasyonu (gsc'deki
   5a/5b/5c/5d deseni) kurulmadan hiçbir betiğe bağlanmamalı.
5. **Sıra önerisi:** yardımcı önce **tek** betikte (öncelik 1:
   `yedek-al.sh`) kanıtlansın; 5/5 falsifikasyon geçmeden ikinci betiğe
   dokunulmasın.

**K2 tarafı için ölçüme dayalı öneri:** tavan/arşiv işi acil değil
(en hızlısı 1 MB'a 0,6 yıl). Öncelik **K1**'e verilmeli — asıl kayıp
disk değil, "koşum ne zaman ve hangi çıkışla bitti?" sorusunun
cevaplanamaması. K2, yardımcı zaten yazılıyorken bedavaya gelir.

## 5 — ONARIM YAPILMADI

Hiçbir betik, crontab satırı veya log dosyası değiştirilmedi. Yalnız
okuma + `/tmp` altında üç tek kullanımlık deney betiği (repo dışı).

**Şerh — adım 5 ile adım 6 çelişiyor:** adım 5 "git status temiz kalsın,
commit yok", adım 6 "rapor + SIRADAKILER işlensin" diyor. Kayıt yazmak
zorunlu olarak ağacı kirletir. Adım 6'yı uyguladım (rapor + SIRADAKILER
yazıldı), adım 5'in commit yasağına uydum (**commit atılmadı**). Ağaçta
yalnız bu iki kayıt dosyası duruyor; **onarım kaynaklı tek bir değişiklik
yok**. Commit kararı kullanıcıya ait.
