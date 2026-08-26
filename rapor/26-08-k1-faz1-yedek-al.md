# 26.08.2026 — K1 yaygınlaştırması Faz 1: yedek-al.sh (BÜYÜK iş rejimi)

## 1. BRIEF DENETİMİ (ön kapı)

Brief olduğu gibi `cikti/brief/20260826-111731.md`'ye yazıldı, düzeltilmiş hâli
`cikti/brief/20260826-111731-duzeltilmis.md`. **Not:** `cikti/` .gitignore'dadır,
bu yüzden brief dosyaları commit'e girmez (mevcut uygulama böyle);
denetçi çıktıları aşağıda tam olarak alıntılanmıştır.

**İlk tur: 1 ENGEL + 2 UYARI.**
```
  KALDI/UYARI  [T1] cikis-kaydi.sh — repoda yok, bağlam belirsiz (üretim mi girdi mi?) [s.14]
  KALDI/UYARI  [T6] git kilidi — tetik "push" var ama gerekli kapı (git kilid / git-kilit / flock...) anılmamış [s.67]
  KALDI/ENGEL  [T7] veri/keşif — doğrulanmadı yolu — tetik "envanter" var ama gerekli kapı (doğrulanmadı / dogrulanmadi / uydurma yasağı...) anılmamış [s.7]
SONUÇ: 1 ENGEL + 2 UYARI
```

ENGEL mekanikti; yalnız **ekleme + netleştirme** ile kapatıldı (E1-E4;
hiçbir şart silinmedi, daraltılmadı, kanıt hafifletilmedi). **İkinci tur:**
```
  KALDI/UYARI  [T1] cikis-kaydi.sh — repoda yok, bağlam belirsiz [s.14]
  KALDI/UYARI  [T1] arac/cikis-kaydi.sh — repoda yok, bağlam belirsiz [s.87]
SONUÇ: 2 UYARI
```
**Kalan 2 UYARI beklenen ve kabul edildi:** `cikis-kaydi.sh` bu işin
ÜRETECEĞİ dosyadır, girdi değil (E2'de yazıldı); denetçi metin taraması
yaptığı için ayrımı göremiyor. CLAUDE.md gereği UYARI iş sürdürür.

## 2. DÜŞMAN GEÇİŞİ (D1-D4)

**D1 — "Yardımcı yazıldı ama aslında hiçbir şeyi garanti etmiyor."**
En kolay FAIL yolu: trap kurulmadan önceki pencerede düşmek. Ölçüldü ve
pencere daraltıldı — yardımcı `mkdir`'den ÖNCE bağlandı. Pencere sıfır
DEĞİL: `cikis_kaydi_kur` kendi `mkdir -p`'sinde düşerse (log dizini
yaratılamıyorsa) satır yazılamaz — ama o durumda log'un kendisi de
yazılamaz. Sınır raporlanıyor, gizlenmiyor.

**D2 — "4e uydurma test olur."** yedek-al.sh'de mevcut trap YOK (ölçüldü:
`grep -c "trap.*EXIT" arac/yedek-al.sh` → `0`). Brief "mevcut trap
yoksa uygulanamaz diye geç, uydurma test kurma" diyor. Bu betiğe sahte
trap eklemedim. Bunun yerine zincirleme, **yardımcının kendi birim
sınamasıyla** kanıtlandı (§5-4e) — yardımcı ortak araç olduğu için
zincirleme onun sözleşmesidir ve ileride trap'i OLAN betiklere (ör.
su-izleme.sh:65) bağlanacaktır.

**D3 — "Testler gerçek yedeği bozar."** En pahalı FAIL. E4 kapısı
eklendi: testlerden önce manifest sha256 alındı, 4g'de karşılaştırıldı.
Ayrıca yedek yalnız hash ile değil **gerçek klonla** geri okundu.

**D4 — "K2 uğruna K1'den ödün verilir."** Brief madde 3 bunu yasakladı.
Ödün verilmedi: döndürme yardımcının içinde, K1 yolundan bağımsız;
4a-4d (K1) ile 4f (K2) ayrı ayrı kanıtlandı.

## 3. AMAÇ ÖZETİ (3b)

- **Amaç:** yedek-al.sh koşumunun ne zaman ve hangi çıkışla bittiği
  log'dan okunabilsin (K1); log'un tavanı olsun (K2). Çözüm ortak bir
  yardımcıya çıkarılsın ama **yalnız bu betiğe** bağlansın.
- **Dokunulmazlar:** diğer 9 betik · Telegram yolu · yedek verisinin
  kendisi · arslanhukuk.tr ve bist-* · yedek-al.sh'in başarı ölçütü
  (dosya varlığı + sha256, exit kodu değil).
- **Bitti-tanımı:** §8'de madde madde işaretli.
- **Kanıtlar:** 4a-4g ham çıktıları (§5).

## 4. ADIM 0 — KAPI

```
/home/suha/projeler/suharitasi
origin	https://github.com/suharitasi/suharitasi.git (fetch/push)
--- status ---
(bos = temiz)
```
arslanhukuk.tr ve bist-* dizinlerine girilmedi.

### E1 kapısı — envanter iddiaları YENİDEN ölçüldü

Brief eki E1: hatırlanan değer kullanılmaz, yeniden ölçülür.
```
  yedek-al.sh'de trap EXIT: 0        → envanter DOĞRU (trap yok)
  bekcide yedek kalemi    : 0        → envanter DOĞRU (bekçi kapsamıyor)
  log/yedek.log boyut     : 31644
  log/yedek.log dondurme  : 2        → İLK BAKIŞTA ÇELİŞKİ, incelendi:
  log/yedek-cron.log boyut: 1784
```
"2 eşleşme" envanterin "döndürme YOK" iddiasını yanlışlıyor gibi
görünüyordu; satırlar okundu:
```
77:  # Kuşak döndürme: güncel → önceki (yalnız gerçek yenilemede)
81:    mv "$HEDEF"/guncel/varliklar-*.tar.gz "$HEDEF/onceki/" || olduc "kuşak döndürme başarısız"
```
İkisi de **yedek paketi** kuşak döndürmesi, **log** döndürmesi değil.
Envanterin iddiası ayakta. (Grep'in kendisi vekil kriterdi; satır
okunmadan sonuç yazılsaydı yanlış olurdu.)

## 5. FALSİFİKASYON (ham çıktılar)

### 4a — BAŞARILI
```
real	3m24.562s
kabuktan gorulen exit=0
2026-08-26T11:25:56Z yedek: bitti · 205 sn · 1162 MB · varlık: degismedi
2026-08-26T11:25:56Z yedek: ÇIKIŞ · exit=0 · dosya=/home/suha/yedek/suharitasi/son-yedek.json · bayt=1218971523
```
"Üretilen dosya" alanı için `son-yedek.json` seçildi: bu dosya ANCAK
manifest doğrulamasından SONRA yazılır, yani varlığı yedeğin
doğrulandığının kanıtıdır.

### 4b — ERKEN HATA (ilk iş adımından ÖNCE)
Betiğin **kendi test kancasıyla** (`YEDEK_HEDEF`) düşürüldü; betik
dosyası değiştirilmedi, dolayısıyla geri alınacak bir şey yok.
```
betik md5 ONCE: 91a1ca8b08a9b46789bd03a729c7d15e
kabuktan gorulen exit=1
mkdir: cannot create directory ‘/root’: Permission denied
2026-08-26T11:26:13Z yedek: ÇIKIŞ · exit=1 · dosya=- · bayt=-
betik md5 SONRA: 91a1ca8b08a9b46789bd03a729c7d15e
BETIK DEGISMEDI ✓
```
**K1'in değerini tam burada gösteriyor:** bu hata `olduc` yolundan
geçmediği için **Telegram'a gitmedi** — eskiden hiçbir yerde izi
kalmazdı. Artık log'da kaydı var.

### 4c — GEÇ HATA (çıktı yazma anında)
Vekil kriter kullanılmadı (dizin izni değil): durum **dosyası**
yazılamaz yapıldı.
```
ONCE izin: -rw-rw-r--
bozuldu -> -r--------
kabuktan gorulen exit=1
./arac/yedek-al.sh: line 158: /home/suha/yedek/suharitasi/son-yedek.json: Permission denied
2026-08-26T11:30:01Z yedek: ÇIKIŞ · exit=1 · dosya=- · bayt=-
--- GERI AL ---
durum dosyasi md5 once=89c3e65ce40dfdbdf650da6a80a84a3d sonra=89c3e65ce40dfdbdf650da6a80a84a3d
DURUM DOSYASI BOZULMADI ✓
```

### 4d — SİNYAL
```
  TERM gonderildi (pid 2015271)
kabuktan gorulen exit=143  (143 = 128+SIGTERM)
2026-08-26T11:30:16Z yedek: başlıyor → /home/suha/yedek/suharitasi
2026-08-26T11:34:01Z yedek: ÇIKIŞ · exit=143 · dosya=- · bayt=-
```
**Ölçülen sınır, dürüstçe:** TERM 11:30:16'da gönderildi, satır
11:34:01'de yazıldı — **3 dk 45 sn gecikme**. Neden: sinyal, çalışan
`git bundle create` alt komutu bitene kadar işlenmedi (bash trap'i
foreground komut bittikten sonra işler). Kayıt **garanti**, ama sinyal
anında değil. Uzun süren alt komutu olan her betikte bu geçerlidir.

**Yan bulgu (mevcut betiğin ayrı kusuru, KAPSAM DIŞI):** sinyalle
ölünce geçici dosyalar kaldı — `.depo.bundle.tmp` **925 MB** ve
`.imza-yeni`. Betikte temizlik trap'i yok. Test artığı temizlendi,
kusur SIRADAKILER'e yazıldı, **onarılmadı**.

### 4e — TRAP ZİNCİRİ
**yedek-al.sh'de UYGULANAMAZ.** Ölçüm:
`grep -c "trap.*EXIT" arac/yedek-al.sh` → `0`. Bu betikte korunacak
mevcut trap yok; brief "uydurma test kurma" dediği için sahte trap
eklenmedi.

Zincirleme yeteneği **yardımcının kendi birim sınamasıyla** kanıtlandı
(betiğe bağlanmadan ÖNCE koşuldu):
```
=== BIRIM 1: mevcut trap + yardimci (zincir sinamasi) ===
  govde calisti
  >>> CAGIRANIN KENDI TRAP'I CALISTI (gecici dosya temizlendi)
  exit=0
--- log ---
2026-08-26T11:21:19Z birim: mevcut EXIT trap'i ZİNCİRLENDİ (ezilmedi): temizlik
2026-08-26T11:21:19Z birim: ÇIKIŞ · exit=0 · dosya=/tmp/ornek-cikti.bin · bayt=4242

=== BIRIM 2: mevcut trap + yardimci + HATA ===
  govde calisti — simdi HATA verilecek
  >>> CAGIRANIN TRAP'I CALISTI
  exit=1
--- log ---
2026-08-26T11:21:19Z birim: mevcut EXIT trap'i ZİNCİRLENDİ (ezilmedi): temizlik
2026-08-26T11:21:19Z birim: ÇIKIŞ · exit=1 · dosya=- · bayt=-
```
Çağıranın trap'i **ezilmedi**, ikisi de çalıştı, exit kodu korundu.
Bu, Faz 2'de `su-izleme.sh` (satır 65'te trap'i VAR) için ön koşuldur.

### 4f — DÖNDÜRME
Eşik 524288 bayt. 6 tur: **tur 1 gerçek başarılı koşumla**, tur 2-6
aynı kod yolunun hızlı kipiyle (döndürme `cikis_kaydi_kur` içinde,
`mkdir`'den önce koşuyor — kip farkı döndürmeyi etkilemez). Kip
ayrımı burada açıkça bildiriliyor.
```
=== TUR 1: GERCEK BASARILI KOSUM ile dondurme ===
  kosum ONCESI log=706438 bayt (esik 524288, asiyor: EVET)
  exit=0
  kosum SONRASI log=1842 bayt · arsiv: log/yedek.log.1
=== TUR 2-6 ===
  TUR 2: once=672870 → sonra=332 · arsiv sayisi=2
  TUR 3: once=671360 → sonra=332 · arsiv sayisi=3
  TUR 4: once=671360 → sonra=332 · arsiv sayisi=4
  TUR 5: once=671360 → sonra=332 · arsiv sayisi=5
  TUR 6: once=671360 → sonra=332 · arsiv sayisi=5
```
Kayan arşiv + sınır:
```
log/yedek.log.1          DOLGU-ISARETI TUR-6
log/yedek.log.2          DOLGU-ISARETI TUR-5
log/yedek.log.3          DOLGU-ISARETI TUR-4
log/yedek.log.4          DOLGU-ISARETI TUR-3
log/yedek.log.5          DOLGU-ISARETI TUR-2

TUR-1 HICBIR DOSYADA YOK — en eski arsiv SILINDI ✓
.6 YOK — sinir tutuyor ✓
```
Eski **gerçek** veri arşivde kırpılmadan duruyor (log.5, dolgu dışı):
```
2026-08-26T11:34:51Z yedek: log döndürüldü (706438 > 524288 bayt) → .../log/yedek.log.1 · arşiv tavanı 5
2026-08-26T11:34:51Z yedek: başlıyor → /home/suha/yedek/suharitasi
2026-08-26T11:34:52Z yedek: varlık imzası aynı — paket korundu
```
Dolgu ve sınama arşivleri temizlendi, log geri yüklendi, sınama kaydı
düşüldü. Kalan arşiv: 0.

### 4g — GERÇEK YEDEK + GERİ OKUMA
```
exit=0
2026-08-26T11:42:13Z yedek: bitti · 207 sn · 1162 MB · varlık: degismedi
2026-08-26T11:42:13Z yedek: ÇIKIŞ · exit=0 · dosya=/home/suha/yedek/suharitasi/son-yedek.json · bayt=1218999835

--- sha256 dogrulamasi ---
./varliklar-20260728.tar.gz: OK
./depo.bundle: OK
sha256sum -c exit=0
```

**depo.bundle hash'i testlerden öncekinden FARKLI çıktı — açıklandı,
gizlenmedi.** Nedeni ölçüldü:
```
=== git bundle deterministik mi? (ayni depodan iki bundle) ===
  3bd80f0469b0cfaccf71d965bab9b7ef40cc52b19d7df6d75dcb6b2ce897512e
  f0b21caff6f66f92c19212a7eeda37bf1a75b35109f219a519a6666f3088f6d7
  → DETERMINISTIK DEGIL: ayni icerik farkli hash veriyor
```
Yani hash farkı bozulma değil, `git bundle`'ın doğası. Sağlamlık hash
ile değil **gerçek geri okumayla** kanıtlandı:
```
=== YEDEKTEN GERCEK GERI OKUMA: bundle'dan klon ===
  klon exit=0
  klonlanan HEAD : d46cee8e8ebdfc97af2bebf16777322d11b0f67c
  canli depo HEAD: d46cee8e8ebdfc97af2bebf16777322d11b0f67c
  ESLESIYOR ✓
  klondaki commit sayisi: 545 / canlidaki: 545
  klondaki ref sayisi: 10
```
Varlık paketi **bit-eşit korundu** (testlerden önce = şimdi):
```
  tar-gz hash ONCE = SIMDI: f869cd9613e583ae1a5a2e25874903020380840c7ee4ec410782e702523d4d57
  tar toplam girdi: 11
```
**E4 kapısı geçildi: testler yedeği bozmadı.**

## 6. K2 — cron `>>` kaldırıldı (brief madde 3'ün gereği)

**ŞERH:** brief bunu açıkça istemedi; madde 1 "yalnız yedek-al.sh" der.
Yaptım çünkü madde 3 "K2 bu işte bedavaya geliyor, ayrı iş açma" diyor
ve `>>` durursa **tavansız ikinci log** (`log/yedek-cron.log`) kalırdı —
K2 yarım kalırdı. Değişen tek şey crontab satırı; **hiçbir başka betiğe
dokunulmadı**. Karar itiraza açıktır, geri alma bloğu §9'da.

```
10 2 * * * nice -n 15 /home/suha/projeler/suharitasi/arac/yedek-al.sh
=== yedek satirinda >> kaldi mi === YOK ✓
=== yedek-cron.log === ls: cannot access 'log/yedek-cron.log': No such file or directory
=== tasinan satirlar tek log'da === 29
```
29 satırın tamamı `[taşındı]` etiketiyle `log/yedek.log`'a geçti;
veri kaybı yok. Değişiklik öncesi crontab: `izleme/crontab-onceki-20260826b.txt`.

## 7. DEĞİŞEN DOSYALAR

```
 M arac/yedek-al.sh        ← DEĞİŞEN TEK BETİK
?? arac/cikis-kaydi.sh     ← bu işin ÜRETTİĞİ yardımcı (yeni)
?? izleme/crontab-onceki-20260826b.txt   ← crontab geri alma yedeği
 M GUNLUK.md · SIRADAKILER.md · ?? rapor/…   ← kayıtlar
```
Başka betiğe dokunulmadığının denetimi:
```
=== BASKA BETIGE DOKUNULDU MU (arac/ + izleme/ + kok .sh/.mjs/.py) ===
  HAYIR — yalnizca yedek-al.sh (M) + cikis-kaydi.sh (yeni) ✓
```
`arac/yedek-al.sh` diff'i **30 ekleme / 2 silme**; eklenen işlevsel
satırlar (yorumlar hariç):
```
+source "$(cd "$(dirname "$0")" && pwd)/cikis-kaydi.sh"
+cikis_kaydi_kur "yedek" "$LOG"
+cikis_kaydi_tek_log
+  if [ -t 2 ]; then echo "YEDEK HATASI: $*" >&2; fi
+cikis_kaydi_dosya "$DURUM" "$BOYUT"
+if [ -t 1 ]; then echo "YEDEK TAMAM · $SURE sn · ..."; fi
```
Son iki satır (`-t` koşulları): cron'da bu echo'lar log'a **zaman
damgasız** düşerdi — gsc-haftalik'te ölçülen kusurdu, buraya taşınmadı.

### Sağlık `--tam` — taban gerilemesi 0

```
GENEL: SARI — kırmızı 0 · sarı 1 · geçti 22
```
Tek sarı, brief'in kapsam dışı bıraktığı kalem:
```
[SARI] 17-dis-baglanti — 18 bağlantı yanıt vermedi (zaman aşımı/5xx —
       dış sunucu geçici olabilir) · 52/1037 tarandı, ölü 0
```
Taban taşıyan kalemlerin hepsi korundu:
```
[GEÇTİ] 14-gorsel — G1-G6 sapması yok · taban 2026-08-24
[GEÇTİ] 21-dokunma — ihlal 201, taban 201
[GEÇTİ] 15-erisilebilirlik — 100/100 (taban 28.07: 100/100)
[GEÇTİ] 16-seo-geo-genis — bulgu 20 (taban 20)
[GEÇTİ] 18-veri-genis — kayıt sayısı düşmedi, şema aynı
[GEÇTİ] 20-altyapi — nöbetçiler canlı · yedek durumu kayıtlı
[GEÇTİ] 24-www — www 301 → apex (dünkü onarım korundu)
```
`--tam` otomatik onarım yapmadı: koşum sonrası ağaçta yalnız bu işin
kendi dosyaları var. **Not:** ilk `--tam` denemesi araç zaman aşımına
(10 dk) takıldı ve SIGTERM ile öldü; site-saglik.mjs o durumda kilidini
bırakmıyor, ama bayat kilidi kendisi devralıyor
(`[KİLİT] bayat kilit devralındı (PID 2016115…)`) — arıza değil, kayıtta.

## 8. BİTTİ-TANIMI

- [x] adım 0 kanıtı raporda → §4
- [x] 4a-4g ham çıktıları raporda → §5 (4e **uygulanamaz**, gerekçesi
      ve yerine konan birim sınaması §5-4e'de)
- [x] yalnız yedek-al.sh değişti, başka betik dokunulmadı → §7
      (`git diff --stat` + denetim çıktısı)
- [x] gerçek yedek alındı ve geri okundu → §5-4g (bundle'dan klon,
      HEAD eşleşti, 545 commit; varlık paketi bit-eşit)
- [x] sağlık `--tam` koşuldu, taban gerilemesi 0 → §7
- [x] git temiz, push'landı → commit karması §9'da
- [x] rapor + GUNLUK + SIRADAKILER işlendi
- [x] geri alma bloğu raporun sonunda → §9

**Brief'in kapsam dışı listesi (madde 5) uygulanmadı, SIRADAKILER'e
kalem olarak yazıldı:** diğer 9 betiğe bağlama (Faz 2) ·
saglik-bekcisi.sh'in kendisinin izlenmesi · yedek-al.sh'in bekçi
kapsamına alınması. Ayrıca Faz 1'in yan bulguları da kalem olarak
açıldı: yedek-al.sh'de temizlik trap'i yokluğu · site-saglik SIGTERM
kilidi · sinyal gecikmesi sınırı.

## 9. GERİ ALMA

```bash
cd /home/suha/projeler/suharitasi

# 1) yedek-al.sh + yardımcı
git revert 40aa627
#    (yardımcı yeni dosya; revert onu da kaldırır. Elle:
#     git checkout 40aa627~1 -- arac/yedek-al.sh && rm -f arac/cikis-kaydi.sh)

# 2) Crontab (>> yönlendirmesini geri getirir)
crontab /home/suha/projeler/suharitasi/izleme/crontab-onceki-20260826b.txt
crontab -l | grep -A1 'yedek-al.sh'

# 3) Silinen ikinci log gerekirse: 29 satırı tek log'da duruyor
grep '\[taşındı\]' log/yedek.log

# 4) Arşiv dosyaları (varsa) yalnız log; silmek veri kaybı DEĞİL
rm -f log/yedek.log.[1-5]
```
Geri alma sonrası tek doğrulama:
`./arac/yedek-al.sh; tail -3 log/yedek.log`
