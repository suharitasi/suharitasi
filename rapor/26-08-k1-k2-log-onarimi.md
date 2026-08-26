# 26.08.2026 — K1 + K2 onarımı: trap tabanlı çıkış kaydı + tek, arşivli log

**İş:** 26.08 cron doğrulama turunda açılan iki kusurun onarımı.
**Kapsam dışı (dokunulmadı):** Telegram yolu (`arac/uyari-gonder.sh`),
K3 (md17 — dış sunucu kaynaklı), `arac/gsc-haftalik.py`.

## ŞERH — brief sınıfı uyuşmazlığı

Brief "KÜÇÜK İŞ" beyan etti. CLAUDE.md "İki kademeli brief rejimi"
ölçütüne göre bu iş **BÜYÜK** sınıfına düşüyor: üç şarttan ikisi
sağlanmıyor — (1) tek dosyaya dokunmuyor (sarmalayıcı + crontab +
log dosyaları + kayıtlar), (3) **mimariye dokunuyor** (cron satırı +
script çıktı sözleşmesi). İş durdurulmadı; gerekçe: brief zaten
bitti-tanımı, falsifikasyon matrisi ve kapsam-dışı listesi taşıyor,
yani BÜYÜK rejimin talep ettiği içeriği fiilen içeriyor. Sınıf
uyuşmazlığı burada kayda geçiriliyor.

## Adım 0 — konum kapısı (kanıt)

```
/home/suha/projeler/suharitasi
origin	https://github.com/suharitasi/suharitasi.git (fetch)
origin	https://github.com/suharitasi/suharitasi.git (push)
```
Ağaç koşum öncesi temiz. arslanhukuk.tr ve bist-* dizinlerine girilmedi.

## 1 — K1'in kök nedeni ve çözümü

**Kök neden (brief'te verildi, kodda doğrulandı):** çıkış satırı betiğin
SON SATIRINDAKİ `echo`'ydu. `set -euo pipefail` altında betik erken
düşerse o satır hiç çalışmaz — dolayısıyla "koştu mu, hangi çıkışla?"
sorusu log'dan cevaplanamıyordu. 26.08 doğrulamasında exit 0'a ancak
dolaylı akıl yürütmeyle varılabilmişti.

**Çözüm:** `trap cikis_kaydi EXIT`. Ek olarak sinyal, exit'e çevrildi
(`trap 'exit 143' TERM` vb.) — çünkü bash'te sinyalle ölürken EXIT
trap'inin koşması garanti değildir.

```bash
CIKAN_DOSYA="-"
CIKAN_BOYUT="-"
cikis_kaydi() {
  local kod=$?
  logla "ÇIKIŞ · exit=$kod · dosya=$CIKAN_DOSYA · bayt=$CIKAN_BOYUT"
}
trap cikis_kaydi EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM
```

## 2 — Log satırı biçimi

`<ISO-8601 UTC> gsc-haftalik: ÇIKIŞ · exit=<kod> · dosya=<yol> · bayt=<n>`

Dosya üretilmemişse `dosya=-` ve `bayt=-`; satır **yine yazılır**.

## 3a — 512 KB beyanı: KODDA DOĞRULANDI, ama döndürme biçimi kusurluydu

Beyanın **eşik kısmı doğru**:

```
31:LOG_TAVAN=$((512 * 1024))   # 512 KB
```
= **524288 bayt**. Falsifikasyon 5d bu değerle koşuldu.

**Beyanın örtmediği kusur — bulundu ve bildiriliyor:** döndürme vardı ama
**arşivsizdi ve veri kaybediyordu**. Eski kod:

```bash
tail -c $((LOG_TAVAN / 2)) "$LOG" > "$LOG.tmp"
mv "$LOG.tmp" "$LOG"
```
Yani tavan aşılınca log'un **ilk yarısı kalıcı olarak atılıyordu**.
"Boyut sınırıyla döndürülür" ifadesi teknik olarak doğruydu, fakat
döndürme = kırpma idi. 3b'nin istediği arşiv mekanizması **hiç yoktu**;
sıfırdan kuruldu.

## 3b — Arşiv: sayı sınırlı, veri kırpılmıyor

`ARSIV_TAVAN=5`. Tavan aşılınca log `.1`'e taşınır, arşivler bir numara
kayar, `.5`'i aşan **en eski arşiv silinir**. Hiçbir satır kırpılmaz.

Kod yorumunda ilk yazdığım "üst sınır (1+5)×512 KB ≈ 3 MB" ifadesi
**yanlıştı ve düzeltildi**: arşiv, döndürme ANINDAKİ boyutu dondurur,
yani tavanı aşabilir — 5d'de arşivler 726 KB oldu. Garanti edilen tek
şey arşiv **sayısının** sınırlı olmasıdır.

## 4 — Cron `>>` kaldırıldı, ikinci log silindi

Sarmalayıcı artık TTY yoksa (= cron) stdout+stderr'i kendi log'una
yönlendirir: `if [ ! -t 1 ]; then exec >> "$LOG" 2>&1; fi`. Bu sayede
crontab'da yönlendirmeye gerek kalmaz, cron mail'i üretilmez ve bash'in
kendi hata mesajları dahil hiçbir çıktı kaybolmaz. `/dev/null`
kullanılmadı.

`gsc-haftalik-cron.log` silindi; içindeki iki satır önce tek log'a
taşındı (veri kaybı yok):

```
2026-08-26T10:51:07Z gsc-haftalik: --- gsc-haftalik-cron.log TAŞINDI (K2 onarımı, 26.08.2026) · aşağıdaki 2 satır o dosyadan geldi, zaman damgası yoktu ---
2026-08-26T10:51:07Z gsc-haftalik: [taşındı] GSC HAFTALIK TAMAM · /home/suha/gsc-cikti/2026-08-22.md · 2672 bayt
2026-08-26T10:51:07Z gsc-haftalik: [taşındı] GSC HAFTALIK TAMAM · /home/suha/gsc-cikti/2026-08-23.md · 2531 bayt
2026-08-26T10:51:07Z gsc-haftalik: --- taşıma sonu · gsc-haftalik-cron.log SİLİNDİ ---
```

Ayrıca üç `echo` (başarı · hata · flock-atlandı) TTY koşuluna bağlandı;
aksi halde cron'da log'a **zaman damgasız** satır düşüyordu (ilk 5a
koşumunda ölçüldü ve düzeltildi).

## 5 — FALSİFİKASYON (ham çıktılar)

### 5a — BAŞARILI KOŞUM
```
2026-08-26T10:52:15Z gsc-haftalik: başlıyor → /home/suha/gsc-cikti
2026-08-26T10:52:16Z gsc-haftalik: python çıktısı: yazıldı: /home/suha/gsc-cikti/2026-08-23.md
2026-08-26T10:52:16Z gsc-haftalik: bitti · /home/suha/gsc-cikti/2026-08-23.md · 2531 bayt
2026-08-26T10:52:16Z gsc-haftalik: ÇIKIŞ · exit=0 · dosya=/home/suha/gsc-cikti/2026-08-23.md · bayt=2531
```

### 5b — ERKEN HATA (ilk API çağrısından ÖNCE: anahtar ön kapısı)
Bozma: `ANAHTAR=/home/suha/gsc-anahtar-YOK-5b.json`
```
2026-08-26T10:52:32Z gsc-haftalik: başlıyor → /home/suha/gsc-cikti
2026-08-26T10:52:32Z gsc-haftalik: HATA: GSC servis hesabı anahtarı yok/okunamıyor: /home/suha/gsc-anahtar-YOK-5b.json
uyarı gönderildi
2026-08-26T10:52:32Z gsc-haftalik: ÇIKIŞ · exit=1 · dosya=- · bayt=-
```
Geri alındı; betik md5 **bit-eşit**: `d90b0b112733839462dc4f1bf16c58aa` (önce = sonra).

### 5c — GEÇ HATA (çıktı yazma anında)
**İlk denemem geçersizdi ve bildiriliyor:** çıktı DİZİNİNİ yazılamaz
yaptım (`chmod 500`) — koşum **exit 0** döndü. Neden: hedef dosya zaten
vardı, mevcut dosyaya yazmak dizin yazma izni gerektirmez. Vekil kriter
yerine gerçek kriter kullanıldı: çıktı **dosyası** yazılamaz yapıldı
(`chmod 400`).
```
  File "/home/suha/projeler/suharitasi/arac/gsc-haftalik.py", line 124, in <module>
    cikti.write_text("\n".join(satirlar), encoding="utf-8")
PermissionError: [Errno 13] Permission denied: '/home/suha/gsc-cikti/2026-08-23.md'
2026-08-26T10:53:30Z gsc-haftalik: HATA: python koşumu exit≠0 (ayrıntı yukarıdaki log satırlarında)
uyarı gönderildi
2026-08-26T10:53:30Z gsc-haftalik: ÇIKIŞ · exit=1 · dosya=- · bayt=-
```
Geri alındı (izin `rw-rw-r--`); çıktı içeriği bozulmadı, md5 önce = sonra
= `aedd4495f18f1f724cb1c433ef40c38e`.

5b ile 5c **ayrı noktalar**: 5b ön kapıda (API'den önce), 5c python
koşumunun içinde. Trap ikisinde de yazdı. Python traceback'i de log'a
düştü — `exec` yönlendirmesinin çalıştığının yan kanıtı.

### 5c-ek — SİNYAL (trap'in üçüncü ayağı)
```
2026-08-26T10:56:28Z gsc-haftalik: başlıyor → /home/suha/gsc-cikti
2026-08-26T10:56:29Z gsc-haftalik: ÇIKIŞ · exit=143 · dosya=- · bayt=-
```
**Sınır, dürüstçe:** TERM betiğin ilk milisaniyelerinde (trap kurulmadan
önce) gelirse satır yazılmaz — ilk denemede tam bu oldu, exit 143 döndü
ama log'a satır düşmedi. Gecikmeli sinyalle (0,35 sn) trap çalıştı.
Bu kaçınılmazdır: trap kurulmadan önceki pencere kapatılamaz.

### 5d — DÖNDÜRME + ARŞİV SINIRI
Eşik: 3a'da doğrulanan **524288 bayt**. 6 tur; her turda log dolguyla
eşiğin üstüne çıkarıldı ve gerçek koşum yapıldı.
```
--- TUR 1: kosum ONCESI log=730855 bayt (esik 524288, asiyor mu: EVET) ---
    kosum SONRASI log=529 bayt
    arsivler: log/gsc-haftalik.log.1
...
--- TUR 6: kosum ONCESI log=726564 bayt (esik 524288, asiyor mu: EVET) ---
    kosum SONRASI log=529 bayt
    arsivler: log/gsc-haftalik.log.1 ... log/gsc-haftalik.log.5
```
Kayan arşiv doğrulaması (her arşivin taşıdığı tur işareti):
```
log/gsc-haftalik.log.1       DOLGU-SINAMA-ISARETI TUR-6
log/gsc-haftalik.log.2       DOLGU-SINAMA-ISARETI TUR-5
log/gsc-haftalik.log.3       DOLGU-SINAMA-ISARETI TUR-4
log/gsc-haftalik.log.4       DOLGU-SINAMA-ISARETI TUR-3
log/gsc-haftalik.log.5       DOLGU-SINAMA-ISARETI TUR-2

TUR-1 HİÇBİR DOSYADA YOK — en eski arşiv SİLİNDİ ✓
.6 YOK — sınır tutuyor ✓
```
Döndürme satırı ve arşivde duran gerçek veri:
```
2026-08-26T10:54:25Z gsc-haftalik: log döndürüldü (726564 > 524288 bayt) → /home/suha/projeler/suharitasi/log/gsc-haftalik.log.1 · arşiv tavanı 5
```
```
(log.5 içindeki dolgu-dışı satırlar — kırpılmadan duruyor)
2026-08-26T10:54:20Z gsc-haftalik: başlıyor → /home/suha/gsc-cikti
2026-08-26T10:54:21Z gsc-haftalik: bitti · /home/suha/gsc-cikti/2026-08-23.md · 2531 bayt
2026-08-26T10:54:21Z gsc-haftalik: ÇIKIŞ · exit=0 · dosya=/home/suha/gsc-cikti/2026-08-23.md · bayt=2531
```
Dolgu ve sınama arşivleri temizlendi; log 5d öncesi hâline geri yüklendi
ve sınama kaydı düşüldü. Arşiv sayısı temizlik sonrası: 0.

### 5e — CRONTAB (yeni hâl, `>>` yok)
```
# K2 ONARIMI (26.08.2026): `>>` YONLENDIRMESI KALDIRILDI. Sarmalayici
# TTY yoksa stdout+stderr'i kendi log'una (log/gsc-haftalik.log)
# yonlendirir; ikinci ve TAVANSIZ gsc-haftalik-cron.log SILINDI
# (iki satiri tek log'a tasindi). Tek log 512 KB tavan + en fazla
# 5 arsiv kuralina tabidir. Cron mail'i uretilmez, hicbir cikti kaybolmaz.
30 10 * * 3 nice -n 10 /home/suha/projeler/suharitasi/arac/gsc-haftalik.sh
```
Cron saati (`30 10 * * 3`), kullanıcı, `nice -n 10` ve sarmalayıcı yolu
DEĞİŞMEDİ. Değişiklik öncesi crontab: `izleme/crontab-onceki-20260826.txt`.

## 6 — Telegram yolu

DEĞİŞTİRİLMEDİ. `git status --porcelain arac/uyari-gonder.sh` boş.
5b ve 5c'de Telegram'a hata düşmesi beklenen davranıştır ve düştü
("uyarı gönderildi"); ayrıca sınanmadı (25.08'de ölçülmüştü).

## Kalan not

**K4 (not, kusur değil):** cron koşumu 10:30:01 → 10:30:02, ~1 sn.
İki GSC API çağrısı için hızlı; içerik farkı gerçek veri geldiğini
kanıtladığı için şüphe yok.

**K3:** kapsam dışı, onarılmadı (md17 dış sunucu kaynaklı).

## GERİ ALMA

```bash
# 1) Sarmalayıcı
cd /home/suha/projeler/suharitasi
git revert <bu commit>          # ya da: git checkout <önceki sha> -- arac/gsc-haftalik.sh

# 2) Crontab (>> yönlendirmesini geri getirir)
crontab /home/suha/projeler/suharitasi/izleme/crontab-onceki-20260826.txt
crontab -l | grep -A1 "GSC haftalik"

# 3) Ayrı cron log'unu geri istersen (gerekmez; tek log zaten taşıyor)
#    Eski dosya SİLİNDİ, iki satırı log/gsc-haftalik.log içinde
#    "[taşındı]" etiketiyle duruyor. Geri getirmek gerekirse:
grep '\[taşındı\]' log/gsc-haftalik.log

# 4) Arşiv dosyaları (varsa) sadece log; silmek veri kaybı DEĞİL
rm -f log/gsc-haftalik.log.[1-5]
```
Geri alma sonrası tek doğrulama: `./arac/gsc-haftalik.sh; tail -3 log/gsc-haftalik.log`
