# 26.08.2026 — ALTYAPI KUYRUĞU KAPATMA (üç faz)

Brief: `cikti/brief/2026-08-26T1611-kuyruk-kapatma.md` (kullanıcı briefi,
olduğu gibi) · düzeltilmiş: `-duzeltilmis.md` (yalnız ekleme).

## 0. Brief denetimi + düşman geçişi + amaç özeti

**Denetçi:** ilk tur 1 ENGEL (T7 envanter kapısı) + 3 UYARI; düzeltilmiş
sürümde ENGEL 0, kalan 1 UYARI: **T1 NOT.txt** — dosya repo dışıdır
(/home/suha/astro5-referans/NOT.txt, Astro 5 referans şerhi), üretim girdisi
değildir; denetçinin "repoda yok" mekanik uyarısı bu yüzden kalır, iş sürer.
Denetim raporları: `cikti/denetim/brief/2026-08-26T16-13-*.md`.

**Düşman geçişi (D1-D4):**
- D1 (çelişen şart): "SITE-DURUM yeşil" hedefi, bu işten BAĞIMSIZ md9
  kalemiyle çelişebilirdi — GERÇEKLEŞTİ (aşağıda, Faz A/A5). md9 kara
  liste kalemidir, bu iş büyütülmedi.
- D2 (geçemeyecek test): md17 %5 örneklemi MTA'yı içermeyebilirdi —
  falsifikasyon bu yüzden hedefli izole koşucuyla yapıldı (gerçek
  fonksiyonlar, MTA örneklemi); nihai kanıt --tam'ın kendi örnekleminde.
- D3 (boş referans): brief'in "SIRADAKILER'de bugün yazılan AY İLKESİ eki"
  kaydı ÖLÇÜLDÜ ve BULUNAMADI (grep: "AY İLKESİ eki" / "yeni altyapı" 0
  eşleşme). Güncellenecek kayıt yok; bu adım "kayıt mevcut değil" ile
  kapandı. AY İLKESİ ana bloğu (satır 5) yürürlükte; bu iş yeni özellik
  değil, mevcut kalemlerin bakım/kapanışıdır.
- D4 (iç çelişki): C2 başlığı "DÜZELTME." diyor, gövdesi "KARARLA
  KAPATILDI" — gövde esas alındı (düzeltme YAPILMADI, karar yazıldı).

**Amaç özeti:** amaç = altyapı kuyruğunu üç fazda kapatmak (her kalem
ONARILDI/KARARLA/TARİHLİ). Dokunulmazlar: arslanhukuk.tr, bist-*,
astro5-referans içeriği, npm audit fix, yeni bekçi yazmak, Sayfa.astro:362.
Bitti-tanımı brief §12; kanıtlar: A3/A4 + B4 + B6/B7/B8 ham çıktıları,
sağlık --tam, curl.

## Adım 0 — kapı

```
/home/suha/projeler/suharitasi
origin  https://github.com/suharitasi/suharitasi.git (fetch/push)
v22.23.2
```
arslanhukuk.tr ve bist-* dosyalarına dokunulmadı.

Oturum açılışı: SITE-DURUM 🔴 (md17 — zaten bu işin Faz A hedefi).

═══════════════════════════════════════════════════════════════════
## FAZ A — md17 (ONARILDI · commit d4c4f86)

### A1. Teşhis kodda doğrulandı
- `arac/kapsam-kalemleri.mjs:37` (onarım öncesi): `<a ... href="...">` ham
  HTML'de regex ile toplanıyor, varlık kaçışı ÇÖZÜLMÜYOR — iddiayla aynı. ✓
- dist ölçümü: `&amp;` içeren href **408 geçiş / 340 benzersiz** (rapordaki
  "376" ile birebir değil — benim ölçümüm grep ile index.html'lerdeki href
  öznitelikleri; sayı farkı raporlandı, iddiaya uydurulmadı; davranış aynı).
- HTTP ölçümü: ham `&` → **200**, `&amp;` → **404** (MTA product_id=10069). ✓

### A2. Onarım
`htmlVarlikCoz()` eklendi (`&amp; &lt; &gt; &quot; &#39; &apos; &#x..;
&#..;`); `disLinkleriTopla` href'i **listeye almadan önce** çözer. Regex
değişmedi. Tek geçiş: çift-kaçış (`&amp;lt;`) doğru sonucu verir.

### A3. Falsifikasyon 4/4 (izole koşucu — gerçek fonksiyonlar, MTA örneklemi)
```
ADIM 1 DÜZELTME YOKKEN:  SONUÇ: taranan 3 · ölü 3   (üçü de 404, &amp;'li)  → KIRMIZI
ADIM 2 DÜZELTME DEVREDE: SONUÇ: taranan 3 · ölü 0   (URL'ler ham &)        → YEŞİL
ADIM 3 ÇÖZÜCÜ KAPALI:    SONUÇ: taranan 3 · ölü 3                          → KIRMIZI
ADIM 4 GERİ ALINDI:      SONUÇ: taranan 3 · ölü 0                          → YEŞİL
```

### A4. Körleştirme sınaması
dist/index.html'e kasten ölü, varlık-kaçışlı link eklendi
(`google.com/olu-sayfa-korlestirme-sinamasi-2026?a=1&amp;b=2`; ölülüğü
önceden curl ile 404 doğrulandı):
```
TOPLANAN (varlık-çözülmüş): .../olu-sayfa-korlestirme-sinamasi-2026?a=1&b=2
SONUÇ: ölü 1 → ÖLÜ 404 (sayfa: /) → md17 GERÇEK ölüyü YAKALADI
```
Link kaldırıldı (grep: 0). Çözüm gerçek ölü tespitini BOZMUYOR.

### A5. Sağlık --tam (16:16-16:37 koşumu)
- **md17: KIRMIZIDAN ÇIKTI** — `[SARI] 17-dis-baglanti — 18 bağlantı yanıt
  vermedi (zaman aşımı/5xx — dış sunucu geçici olabilir) · 52/1037 tarandı,
  ölü 0`. Kalem kendi ölçümünde geçti; sarı dış sunucu davranışıdır (tasarım
  gereği sarı, bizim arıza değil).
- SITE-DURUM YEŞİL DEĞİL — iki kırmızı, İKİSİ DE md17'den bağımsız:
  - **md9 /harita/ mobil**: iki ardışık koşuda eşik altı → araç kuralı
    gereği kırmızı; KARA LİSTE (performans) — otomatik onarılmaz,
    kullanıcıya devredildi. SIRADAKILER'de zaten "izlemede + eşik payı
    kararı bekliyor" kaydı olan kalemdir. BÜYÜTÜLMEDİ.
  - **md23 altın örnek**: Faz B'de rg-nobetci'ye eklediğim import'un yan
    etkisi (aşağıda B-hata kaydı) — Faz B içinde düzeltildi, sonraki
    --tam'da yeşil (B9).

### A6. Commit + push
**d4c4f86** — yalnız `arac/kapsam-kalemleri.mjs` (cikti/ gitignore'da,
brief dosyaları yerelde).

**FAZ A GERİ ALMA:** `git revert d4c4f86` (tek dosya, veri/dış durum yok).

═══════════════════════════════════════════════════════════════════
## FAZ B — çıkış kayıtları + körlükler (ONARILDI)

### B1. Kapsam (envanterden sayıldı)
`rapor/26-08-cron-log-envanteri.md`: 13 ölçülen satır; gsc-haftalik zaten
kapsam dışı, yedek-al Faz 1'de bitti → **12 satır / 9 benzersiz betik**:
bash 5 (baraj-gunluk · grace-guncelle · saglik-bekcisi · su-izleme ·
bellek-log) · node 2 (site-saglik.mjs · indexnow-bildir.mjs) · python 2
(rg-nobetci.py · nhyp-yayin-nobetci.py). Dil dağılımı envanter §4 ile
birebir (envanterdeki 7 bash sayımı yedek-al + uyari-gonder dahildi;
uyari-gonder cron kalemi değil, kapsamda değil).

### B2. Sözleşme tek, uygulama dil başına
- bash: `arac/cikis-kaydi.sh` (Faz 1'den, kanıtlı) — B7 için
  `cikis_kaydi_gecici` eklendi.
- node: `arac/cikis-kaydi.mjs` (YENİ) — process.on('exit') yığılır.
- python: `arac/cikis_kaydi.py` (YENİ) — atexit yığılır; exit kodu
  sys.exit/excepthook sarmalarıyla yakalanır (davranış değişmez).
Birim sınamaları (bağlanmadan ÖNCE): node 3/3 (başarı 0 · istisna 1 ·
TERM 143; çağıranın exit dinleyicisi EZİLMEDİ) · python 4/4 (0 · 3 · 1 ·
143; çağıranın atexit'i EZİLMEDİ) · döndürme sınaması iki dilde de
(tavan 200 B → .1/.2 arşivleri doğdu, kırpma yok).

### B3. Bash trap zinciri
su-izleme'de kur çağrısı bilinçli olarak mevcut trap'ten (satır 65 mktemp
temizliği) SONRA; yardımcı zincirledi — kanıt log satırı:
```
2026-08-26T16:41:14Z su-izleme: mevcut EXIT trap'i ZİNCİRLENDİ (ezilmedi): rm -f "$STATUSF" "$EVENTF"
```

### B4. Elle koşum kanıtları — 9/9 (atlanan 0)
```
2026-08-26T16:41:01Z bekci:        ÇIKIŞ · exit=0 · dosya=- · bayt=-
2026-08-26T16:42:15Z su-izleme:    ÇIKIŞ · exit=3 · dosya=.../izleme/DURUM.md · bayt=2491
2026-08-26T16:42:28Z baraj:        ÇIKIŞ · exit=1 · dosya=data/canli/baraj.json · bayt=341711
2026-08-26T16:42:38Z grace:        ÇIKIŞ · exit=0 · dosya=.../grace/durum.json · bayt=19
2026-08-26T16:42:38Z bellek:       ÇIKIŞ · exit=0 · dosya=/home/suha/bellek-log.txt · bayt=111400
2026-08-26T16:42:53Z site-saglik:  ÇIKIŞ · exit=0 · dosya=- · bayt=-   (--test, 7/7)
2026-08-26T16:42:57Z indexnow:     ÇIKIŞ · exit=0 · dosya=.../indexnow-durum.json · bayt=35576
2026-08-26T16:43:10Z rg-nobetci:   ÇIKIŞ · exit=0 · dosya=- · bayt=-   (--test)
2026-08-26T16:43:39Z nhyp-nobetci: ÇIKIŞ · exit=0 · dosya=- · bayt=-   (--test)
```
Notlar (dürüst kayıt): su-izleme exit=3 ve baraj exit=1, koşum sırasında
BENİM kirli çalışma ağacım pull'u engellediği için push'un ertelenmesidir —
sözleşmenin tam da yakalaması gereken durum; commit'ler yerelde oluştu ve
16:49'da push'landı (cade48d'e kadar). baraj hattı bu sırada tasarımı
gereği 1 Telegram uyarısı düşürdü. bellek-log'un 16:40 CRON koşumu bile
yeni kodla satır basmıştı (bağlama anından itibaren canlı).

### B-HATA KAYDI (bu işte doğdu, bu işte kapandı)
İlk bağlamada python import'u `from cikis_kaydi import ...` idi;
altin-ornek.mjs rg-nobetci'yi `python3 -c` ile BAŞKA çalışma dizininden
yüklediğinde ModuleNotFoundError verdi → 16:16 --tam koşumunda md23
KIRMIZI. Düzeltme: `sys.path.insert(0, <arac/>)` güvencesi (iki python
betiğine de). Yeniden ölçüm: `ALTIN ÖRNEK: 23/23 geçti`.

### B5. Atlanan betik: YOK (9/9 bağlandı).

### B6. Yedek körlüğü — bekçi kalemi (g)
`son-yedek.json` mtime >26s → kırmızı (eşik türetme: günlük 02:10 koşumu +
2s pay — bekçinin (a)/(b) kalemleriyle aynı desen; dosya ANCAK manifest
doğrulamasından sonra yazıldığı için tek eşik hem "başarısız" hem "hiç
koşmadı" hâlini yakalar; dosya YOK hâli ayrıca kırmızı).
Falsifikasyon 3/3 (YEDEK_DURUM test kancasıyla, gerçek dosyaya dokunmadan):
```
1) dosya YOK   → exit 1 · "🔴 yedek durum dosyası YOK ... hiç koşmamış" · Telegram gitti
2) 30s bayat   → exit 1 · "🔴 yedek 30 saattir alınmamış (>26s)"        · Telegram gitti
3) gerçek taze → exit 0 · uyarı dosyası YOK (sessiz)
```

### B7. Yedek temizliği
`cikis-kaydi.sh`'e `cikis_kaydi_gecici` eklendi (çıkışta kayıtlı geçiciler
silinir; sıra: zincirli trap → temizlik → çıkış satırı). yedek-al.sh üç yol
kaydetti: `.imza-yeni` · `.depo.bundle.tmp` · `.depo.bundle.tmp.lock`.
**Yan bulgu (ölçüldü):** git bundle sinyalle ölünce kalıntıyı `.tmp` değil
kendi `.tmp.lock` dosyasında bırakıyor — o da listeye alındı.
Falsifikasyon (izole YEDEK_HEDEF, gerçek depo, süreç grubuna TERM):
```
kill anında .depo.bundle.tmp mevcut → süreç öldü →
2026-08-26T16:48:37Z yedek: geçici dosya temizlendi: .../.imza-yeni
2026-08-26T16:48:37Z yedek: geçici dosya temizlendi: .../guncel/.depo.bundle.tmp
2026-08-26T16:48:37Z yedek: ÇIKIŞ · exit=143 · dosya=- · bayt=-
```
Temizlik VE çıkış kaydı — İKİSİ BİRDEN. ✓
Bilinen sınır (Faz 1'den, değişmedi): bash trap'i koşan foreground alt
komut bitene kadar işlemez; süreç GRUBU öldürülmezse gecikir.

### B8. Bekçinin ölümü — ölü-adam anahtarı
- Bekçi her koşum BAŞINDA `izleme/state/bekci-damga.txt` basar (gitignore).
- İzleyici: **arac/indexnow-bildir.mjs** — gerekçe: (1) yedek-al OLAMAZ
  (B6 ile karşılıklı izleme doğardı; çift birlikte ölünce susar),
  (2) 6×/gün koşan en sık bağımsız kalem → ≤4s tespit gecikmesi,
  (3) işlevi sağlık/yedek zincirinden bağımsız. Eşik 26s (bekçi günlük
  07:00 + 2s pay). Baskılama: 24 saatte 1 Telegram (ölü bekçi 6 msj/gün
  spam üretmesin; durum sürerken günde 1 hatırlatma).
- **ORTAK HATA NOKTASI (ÇÖZÜLMEDİ, bilinçli kapsam dışı): cron'un kendisi
  ölürse hiçbir kalem koşmaz, hiçbir alarm düşmez.** Bu kısıt KARARLAR
  §33/K2'ye de yazıldı.
Falsifikasyon 3/3 (BEKCI_DAMGA kancası + --kuru):
```
1) 30s eski damga → "ALARM: bekçi damgası 30.0 saat eski (>26s) ... 8 izleme kalemi kör" · Telegram gitti
2) tekrar         → "... alarm BASKILANDI (son 24 saatte gönderildi)" (ikinci mesaj YOK)
3) taze damga     → sessiz · bekci-alarm-damga.txt temizlendi
```

### B9. Sağlık --tam + commit
(sonuç aşağıda "KAPANIŞ DOĞRULAMASI"nda — koşum bu rapor yazılırken
tamamlandı; commit hash'i commit bölümünde)

**FAZ B GERİ ALMA:** Faz B commit'i revert edilir; ayrıca
`izleme/state/bekci-damga.txt` + `bekci-alarm-damga.txt` silinir
(gitignore'lu yerel damgalar). Crontab DEĞİŞMEDİ — geri almada cron'a
dokunmak gerekmez.

### B9. Sağlık --tam (17:02 koşumu) — SONUÇ
```
GENEL: SARI — kırmızı 0 · sarı 1 · geçti 22
[GEÇTİ] 9-lighthouse — /harita/ 93/75 (bu koşumda eşik üstü; iki-ardışık kırmızı temizlendi)
[GEÇTİ] 23-altin-ornek — 23/23
[GEÇTİ] 20-altyapi — nöbetçiler canlı · yeni npm açığı yok · yedek durumu kayıtlı
[SARI]  17-dis-baglanti — 19 bağlantı yanıt vermedi (zaman aşımı/5xx) · 52/1037, ölü 0
```
Taban gerilemesi 0 (md16 bulgu 20/taban 20 · md21 ihlal 201/taban 201 ·
md14 G1-G6 sapma 0 · a11y 100/100). Kalan tek sarı md17'nin dış-sunucu
sınıfıdır (zaman aşımı/5xx = "bizim arızamız değil ama görünmeli" tasarımı);
büyük olasılıkla bugünkü tekrarlı taramaların MTA'da yavaşlık/kısıtlama
tetiklemesi. Ölü 0 — Faz A'nın bitti-tanımı bu.
**Faz B commit: abcfbc0** (push'landı). Not: izleme/su-izleme.sh
düzenlemesi, betiğin kendi `git add izleme/` satırı yüzünden 16:41'deki
su-izleme commit'iyle depoya girmişti (cade48d zincirinde) — içerik aynı.

═══════════════════════════════════════════════════════════════════
## FAZ C — karara bağlama

### C1. PaylasilanMenu yetim CSS bloğu — ONARILDI (sıfır etki kanıtlı)
Ölçülen konum src/components/PaylasilanMenu.astro **133-136** (brief
"131-135" diyordu; ölçülen yazıldı): seçicisiz 3 bildirim satırı + yetim
`}`. Ön kanıt: bloğun ayırt edici `color:#C0883A !important` bildirimi
dist CSS'inde 0 eşleşme (blok CSS hattında düşüyor). Kesin kanıt:
```
taban build (blok VAR)  → dist CSS 12 dosya sha256
silinmiş build (blok YOK)→ dist CSS 12 dosya sha256
diff → FARK YOK — 12/12 BİT-EŞİT
```
CSS DEĞİŞMEDİĞİ için C5'in canlı beş-sayfa kıyası gerekmedi (brief:
"değişmediyse yalnız kayıt commit'i"). Satır 138-139'daki boş
`@media (max-width:1023px){}` bloğuna DOKUNULMADI (C1 kapsamı dışı).

### C2. Sayfa.astro:362 — KARARLA KAPATILDI (KARARLAR §33/K3)
`<style is:global>` (satır 185) içinde `:global(.gorsel-slot)` — Astro
7'de de bilerek düzeltilmedi: düzeltilirse bugüne dek hiç uygulanmamış
`height:100%` AKTİFLEŞİR, görsel değişir; kıyas karesi + kullanıcı onayı
ister. Kod DEĞİŞMEDİ.

### C3. stil-pilot ilgili-kart sırası — KARARLA KAPATILDI (§33/K4)
noindex + sitemap dışı pilot; koleksiyon sırasına bağlı kalır.

### C4. NPM açıkları — KARARLA KAPATILDI (§33/K5)
24 açık (16 orta + 8 yüksek; brief sayımıyla birebir). Sınıflandırma
ölçümle:
- 22/24 **lighthouse zinciri** (opentelemetry×15 · @sentry/node ·
  puppeteer-core · @puppeteer/browsers · extract-zip · ip-address ·
  brace-expansion · lighthouse) — yalnız md9 ölçümünde sunucuda koşar.
- nanoid → astro→vite→postcss (build CSS işleme).
- sharp → astro görsel işleme (build).
**Yayınlanan çıktıya giren: SIFIR.** Kanıt: dist/ içinde
nanoid/opentelemetry/sentry imzası 0 eşleşme; site statik, bu paketlerden
hiçbiri ziyaretçiye kod göndermez. Güvenlik istisnası (DUR) TETİKLENMEDİ.
`npm audit fix` ÇALIŞTIRILMADI (talimat + lighthouse düşürmesi md9
tabanını bozar).

**FAZ C GERİ ALMA:** Faz C commit'i revert edilir (kaynak silmesi tek
blok + kayıt dosyaları; veri/dış durum yok).

═══════════════════════════════════════════════════════════════════
## 10. TARİHLİ KALEM
/home/suha/astro5-referans/NOT.txt YERİNDE (1629 bayt, 26.08 13:19).
Dizine dokunulmadı; silme 2026-09-02'den önce YAPILMAZ. SIRADAKILER'de
"TARİHLİ" başlığı altında.

## 11. KAPANIŞ DOĞRULAMASI
- 11a. Son --tam (17:02): **kırmızı 0** · sarı 1 · geçti 22 · taban
  gerilemesi 0. SITE-DURUM başlığı: **🟡 SARI** — YEŞİL DEĞİL; tek sarı
  md17 dış-sunucu zaman aşımı sınıfı (ölü 0; bizim arıza değil, sınıf
  tasarımı gereği görünür). Çözülmemiş-kırmızı bölümü BOŞ. 19:30
  cron koşumu doğal tekrar ölçümdür.
- 11b. `curl -sI https://suharitasi.com/` → HTTP/2 **200** (103 Early
  Hints sonrası) · `https://www.suharitasi.com/havzalar/` → **301** +
  `location: https://suharitasi.com/havzalar/` (apex). ✓
- 11c. SIRADAKILER altyapı blokları: K1 onarım kuyruğu 2-9 kapandı ·
  K1 Faz 2+ bloğunun 6 kalemi kapandı · envanter yan bulguları 3/3
  kapandı · Astro 7 AÇIK listesi kapandı (tek istisna aşağıda) ·
  TARİHLİ başlığı kuruldu (astro5-referans). Açık kalan TEK altyapı
  kalemi: "site-saglik'e Astro sürüm kalemi" — KAPANMADI, sebebi:
  brief kapsamında değildi ve onarım fazları (A/B) kapandı; büyütme
  yasağına uyuldu.

## 12. BİTTİ-TANIMI KARŞILAMASI
- adım 0 kanıtı ✓ · A1 teşhis kodda ✓ · A3 4/4 + A4 ham çıktı ✓
- üç faz üç commit: **d4c4f86** (A) · **abcfbc0** (B) · Faz C commit'i
  (bu raporla birlikte; hash commit mesajında ve git log'da)
- B4 9/9 kanıt satırı ✓ (atlanan 0) · B6/B7/B8 falsifikasyonları ham
  çıktıyla ✓ · B8 izleyici gerekçeli + döngüsel değil ✓ · cron ortak
  hata noktası yazılı ✓
- C1-C4 dördü karara bağlandı ✓ (hiçbiri "bekliyor" değil)
- --tam: kırmızı 0, taban gerilemesi 0 ✓ · SITE-DURUM SARI (yeşil değil —
  sebep dış sunucu, yukarıda) — sapma dürüstçe raporlandı
- git temiz + push ✓ (Faz C commit'inden sonra) · kayıtlar işlendi ✓ ·
  geri alma blokları faz başına ✓

═══════════════════════════════════════════════════════════════════
## KUYRUK DURUMU

### KAPANDI
- md17 varlık-kaçışı → **ONARILDI** (d4c4f86)
- K1 Faz 2: 9 betiğe çıkış kaydı → **ONARILDI** (abcfbc0)
- Bekçinin ölümü (ölü-adam anahtarı) → **ONARILDI** (B8)
- Yedek "hiç koşmama + başarısızlık" körlüğü → **ONARILDI** (B6)
- Yedek geçici dosya kalıntısı → **ONARILDI** (B7)
- site-saglik SIGTERM kilidi → **ONARILDI** (yardımcının yan kazancı)
- md9 izleme + md9 Astro7 taban ölçümü → **ONARILDI/ÖLÇÜLDÜ** (iki tam
  tur kayıtlı; eşik-payı kararı zaten açık kullanıcı kalemi)
- izleme/log/cron.log · log/uyari.log · site-saglik-cron.log.uyum →
  **ONARILDI/KARARLA** (ayrıntı SIRADAKILER kapanış notlarında)
- PaylasilanMenu yetim CSS → **ONARILDI** (bit-eşit kanıtlı silme)
- Sayfa.astro:362 → **KARARLA KAPATILDI** (§33/K3)
- stil-pilot kart sırası → **KARARLA KAPATILDI** (§33/K4)
- npm 24 açık → **KARARLA KAPATILDI** (§33/K5; tümü build-zamanı)
- astro5-referans silme → **TARİHLİ** (2026-09-02; NOT.txt teyitli)

### KAPANMADI
- **site-saglik'e Astro sürüm kalemi** (package.json ↔ node_modules major
  eşleşmesi + NODE_VERSION hatırlatması): brief kapsam listesinde yoktu
  (A=md17 · B=cron/yedek/bekçi · C=yalnız karar); onarım fazları kapandığı
  için büyütülmedi. SIRADAKILER'de tek açık altyapı kalemi olarak duruyor.
- **SITE-DURUM "yeşil" hedefi**: kapanışta 🟡 SARI — tek sarı md17
  dış-sunucu zaman aşımları (ölü 0). Bizim tarafta onarılacak şey yok;
  MTA normale dönünce kendi ölçümünde yeşile döner (19:30 cron doğal
  tekrar).

### BULUNAN AMA KUYRUĞA YAZILMAYAN (kapanış kuralı gereği yalnız raporda)
- git bundle sinyalle ölünce kalıntıyı `.depo.bundle.tmp.lock`'ta
  bırakıyor → bu işte temizlik listesine alınarak ÇÖZÜLDÜ (kuyruğa
  gerek kalmadı).
- python modül yolu tuzağı (başka dizinden `python3 -c` yüklemesi) →
  bu işte sys.path güvencesiyle ÇÖZÜLDÜ; ders GUNLUK'ta.
- baraj/su-izleme koşumları, benim kirli çalışma ağacım yüzünden push
  erteledi (exit 1/3 + 1 Telegram uyarısı) → Faz B push'uyla ÇÖZÜLDÜ;
  betik davranışı tasarıma uygundu, iş açılmadı.
- Sözleşme yan notu: cron `>>` yönlendirmeleri KORUNDU (K2 acil değil
  ölçümü); log döndürme çok nadir gerçekleştiğinde o koşumun cron-stdout
  satırları .1 arşivine düşebilir (fd eski inode'da kalır) — bilinen,
  zararsız, yıllar ölçeğinde bir kez.

## Telegram gürültü kaydı (bu işin ürettiği gerçek mesajlar)
B6 falsifikasyonu 2 · B8 falsifikasyonu 1 · baraj push-erteleme 1 —
dördü de kasıtlı/bilinen; yanlış alarm değil.

