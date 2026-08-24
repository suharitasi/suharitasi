# RG ARA SERTİFİKA ONARIMI + TELEGRAM UYARI YOLU + TELAFİ — 2026-08-24

Brief: `cikti/brief/20260824-200234Z-rg-onarim-telegram.md` (+ `-duzeltilmis.md`)
· **BÜYÜK İŞ** (veri hattı + script sözleşmesi) · Kullanıcı talimatı 2026-08-24.
Denetçi: ilk koşu 3 ENGEL + 3 UYARI → 2 ekleme-yalnız turda **ENGEL 0, 1 UYARI**
(kalan: `rapor/rg-onarim.md` "repoda yok" — bu dosya işin ÜRETİMİdir, yanlış pozitif).

## 0. Amaç özeti + düşman geçişi (D1-D4)

**Amaç:** (1) resmigazete.gov.tr erişimini eksik ara sertifikayı yerelde
tamamlayarak onarmak (doğrulama kapatılmadan); (2) veri hatlarının
kırmızısını SMTP'den bağımsız, LLM'siz Telegram yoluna bağlamak;
(3) uyarı yolunu kasıtlı bozarak message_id ile kanıtlamak; (4) 06-24
Ağustos fihrist penceresini mükerrer koruması korunarak telafi taramak.
**Dokunulmazlar:** site içeriği/yayın hattı, DURUM.md sözleşmesi (telafi
"son koşu" sayılmaz), rg-nobetci `--test` sözleşmesi ("hiçbir yere gönderim
yapmaz"), doğrulama (-k YASAK), keşif botunun LLM hattı.

- **D1 çelişki (yakalandı ve çözüldü):** Falsifikasyon b başta `--test`
  kipiyle planlanmıştı; `--test` sözleşmesi "hiçbir yere gönderim yapmaz"
  der — Telegram göndermek sözleşmeyi bozardı. Çözüm: bildirim YALNIZ
  `--kosum`'da; falsifikasyon b `--kosum`la yapıldı.
- **D2 boş kapı:** Uyarı yolunun kapısı falsifikasyonla iki hatta da
  kırmızı verdi (message_id 4656 · 4657) ve onarımla yeşile döndü —
  kapı boş değil. 24 saatlik imza koruması falsifikasyon sonrası gerçek
  alarmı bastırmasın diye imza state'i silindi (kayıtlı adım).
- **D3 var olmayan referans:** `izleme/arsiv/rg/` (son giriş 2026-08-24),
  `arac/uyari-gonder.sh`, keşif kanalı env dosyası — üçü de `ls`/grep ile
  doğrulandı. Kanalın hangi sohbete bağlı olduğu ölçülemezdi →
  falsifikasyon mesajının kendisi ölçtü (chat: kullanıcının sohbeti).
- **D4 sıra:** sertifika onarımı → falsifikasyon → telafi. Telafi
  sürücüsü ilk `hata` çıkışında DURUR (bozuk hatla 19 gün taranamaz).
  Brief'in "tek commit" geri-alma varsayımı gerçekte üç parçaya ayrıldı
  (falsifikasyonun otomatik commit'i + kod commit'i + kapanış); geri alma
  yolu commit listesiyle §5'te.

## 1. Kök neden ve onarım [VERİ]

- Arıza: 2026-08-06'dan beri `www.resmigazete.gov.tr` TLS zincirinde
  YALNIZ leaf gönderiyor (`openssl s_client`: zincir=1, leaf
  `CN=*.tccb.gov.tr`, issuer `GeoTrust TLS RSA CA G1`). curl exit 60,
  python `CERTIFICATE_VERIFY_FAILED`. Etki: günlük fihrist 38 ardışık
  hata; haftalık nöbetçi 2 koşudur 0 satır.
- Onarım: ara sertifika leaf'in AIA ucundan indirildi
  (`http://cacerts.geotrust.com/GeoTrustTLSRSACAG1.crt`), zinciri ölçüldü:
  `openssl verify -untrusted ara leaf → OK` (kök: DigiCert Global Root G2,
  sistem deposunda). SHA-256 `C0:6E:...:23:0E`, geçerlilik 2027-11-02'ye
  kadar. Depoya kondu: `izleme/lib/rg-ara-sertifika.pem` (başlıkta kaynak +
  parmak izi + doğrulama komutu).
- Bağlama: her koşumda sistem CA demeti + ara sertifika →
  `izleme/state/.rg-ca-demeti.pem` (gitignore'da; sistem demeti donmaz).
  `su-izleme.sh` M1 çekimleri `--cacert` ile bu demeti kullanır;
  `rg-nobetci.py` aynı demetle `ssl.create_default_context(cafile=…)`.
  Doğrulama hiçbir yerde kapatılmadı. Onarım öncesi canlı kanıt:
  curl fihrist **200 / 17931B / 0,43s** · python **200**.

## 2. Telegram uyarı yolu [VERİ]

- "Mevcut kanal": keşif botunun Telegram botu/sohbeti (kullanıcıya taşınmış
  altyapı). İki değer `.env`'e `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID`
  olarak kopyalandı (0600, gitignore'da — commit edilmedi). Gönderim yolu
  **LLM'siz ve e-postasız**: `arac/uyari-gonder.sh` → Bot API sendMessage.
- `su-izleme.sh`: koşum sonunda `HATA_SAYAC>0` ise 🔴 hedef listesi
  gönderilir. Alarm yorgunluğu koruması: 🔴 kimliklerinden imza;
  **aynı imza 24 saat içinde tekrar gönderilmez**, imza değişirse hemen
  gönderilir (`izleme/state/uyari-imza-su-izleme.txt`). Gönderim hatası
  koşuyu düşürmez, loglanır.
- `rg-nobetci.py`: `--kosum`'da sorgu hatası varsa bildirim (haftalık
  kadans — imza koruması gerekmez, gerekçe kodda). `--test` sözleşmesi
  korundu: test kipinde gönderim YOK.
- Bilinçli yan etki: `.env` dolunca `saglik-bekcisi.sh`'ın mevcut
  uyari-gonder çağrıları da aktifleşti — SIRADAKILER "Telegram kanalı"
  bekleyeninin fiilî kapanışı (kayda işlendi).

## 3. Falsifikasyon — kasıtlı bozma → Telegram kanıtı → yeşil [VERİ]

| Hat | Bozma | Sonuç | Kanıt | Yeşile dönüş |
|---|---|---|---|---|
| su-izleme M1 | `SU_IZLEME_RG_CA=/dev/null` + `--rg-tarih 2026-08-23` | M1 🔴 "fihrist çekilemedi", exit 1 | Telegram **message_id 4656** (log/uyari.log, sendMessage yanıtı; alıcı: kullanıcının sohbeti) | telafi taramasında aynı tarih dahil tüm günler hatasız (§4) |
| rg-nobetci | `RG_NOBETCI_CA=<geçerli-ama-işe-yaramaz self-signed CA>` + `--kosum` | 3/3 sorgu `CERTIFICATE_VERIFY_FAILED`, taranan 0, exit 3 | Telegram **message_id 4657** | gerçek demetle `--kosum`: **109 satır, 0 hata, exit 0** |

Falsifikasyonun bulduğu ek kusur (düzeltildi): `RG_NOBETCI_CA=/dev/null`
bağlam KURULURKEN modül düzeyinde çöküyordu — hata yakalama ve uyarı yolu
hiç çalışmadan. Düzeltme: demet yüklenemezse ÇÖKME yerine sistem
varsayılanına düş + stderr uyarısı → istek-zamanı hatası yakalanır ve
Telegram'a çıkar. (Kasıtlı bozma bu yüzden geçerli-ama-yanlış CA ile
yapıldı — gerçek arızayla aynı hata sınıfı.)
Falsifikasyon sonrası imza state'i silindi (gerçek alarm 24s penceresine
takılmasın).

## 4. Telafi taraması — 2026-08-06 → 2026-08-24 [VERİ]

Sürücü: her gün için `izleme/su-izleme.sh --rg-tarih <gün>` (nezaket 6 sn;
`hata` çıkışında durmalı — durma OLMADI). Mükerrer korumaları:
(1) M1 telafi kipi, `fihrist-ana-analiz.txt` dolu günü atlar (çift OLAY
imkânsız); (2) nöbetçi tarafında arşiv kimlik seti + çıktı URL seti.

| Ölçüm | Sonuç |
|---|---|
| Taranan gün | **19/19** (06–24 Ağustos, tamamı önceden BOŞtu — pencere birebir kesintiyle örtüştü) |
| Fihrist durumu | 19/19 gün YAYIN bulundu ve analiz edildi; ağ/sertifika hatası **0** |
| Toplam madde | 165 (gün başına 3–30) |
| Mükerrer sayı | 0/19 günde mükerrer fihrist çıktı (yoklama çalıştı, ardışık ilk boşta durdu) |
| KANUN maddesi / kelime eşleşmesi | 0 — her günün analizinde `KEYWORD-DURUM: eşleşme yok` satırı ÜRETİLDİ (kapı çalıştı, eşleşme sahiden yok; izlenen ifadeler: "su kanunu", "su yönetimi kanunu", "taşkın", "yeraltı suları") |
| OLAYLAR.md'ye eklenen | 0 (eşleşme olmadığı için — tasarım gereği yalnız eşleşme olay üretir) |
| Nöbetçi telafisi | `rg-nobetci.py --kosum`: **0→109 satır**, sorgu hatası 0, arşivde-zaten-var 109, YENİ KAYIT 0 → kesinti penceresinde kaçırılmış işletme-sahası ilanı YOK (penceresiz tam tarama + kimlik mükerrer koruması) |

Sonuç: 18 günlük körlük penceresi kapandı; kaçan "büyük olay" (Su Kanunu
ilgili yayın) ölçülerek YOK bulundu — bu bir varsayım değil, 19 günün
fihristinin tek tek analiz çıktısıdır.

## 5. Doğrulama, geri alma, süreklilik

- `bash -n` temiz · `py_compile` temiz · kontrollü NORMAL kipte tam koşum
  yapıldı (sonuç §5.1) — yarınki 05:45 cron'un koşacağı yol aynen denendi.
- **Geri alma:** kod+kayıt değişiklikleri commit listesiyle geri alınır
  (`git revert`): falsifikasyon otomatik commit'i (7a268ef), kod commit'i
  (7a34873), telafi otomatik commit'leri, kapanış commit'i. `.env`'in
  TELEGRAM satırları commit dışıdır — elle silinirse köprü "yapılandırılmadı"
  moduna döner (uyari-gonder.sh sözleşmesi).
- **Süreklilik (kalıcı kontrol):** (1) veri hattı kırmızısı artık Telegram'a
  ÇIKIYOR — arıza bir daha sessiz kalamaz (falsifikasyonla kanıtlı);
  (2) bekçi `su-izleme` tazelik kontrolü aynen; (3) sertifika süresi
  2027-11-02 → SIRADAKILER'de tarihli yenileme kalemi; (4) KARARLAR §24.
- Kapsam dışı bırakılan (bilinçli): SMTP kurulumu (kullanıcıda, ayrı kanal);
  rg-nobetci çıktılarının commit'lenmemesi (haftalık 1 satırlık unstaged
  fark — su-izleme pull'u artık `sonraki koşuda denenir` yoluyla toparlıyor,
  kalıcı çözüm ayrı küçük iş adayı); `arac/rg-{tara,icerik-tara,sayi-cikar}.py`
  tek seferlik araçları (cron'da değiller; gerekirse aynı demet deseniyle
  güncellenir).

### 5.1 Kontrollü normal koşum (cron yolu doğrulaması) [VERİ]

2026-08-24T20:12:53Z, tam normal kip (`izleme/su-izleme.sh`):
- **RG-gunluk M1: 🟢 tamam** — "yayınlandı, eşleşme yok" (2026-08-06'dan
  beri İLK yeşil; 38 ardışık hatanın sonu).
- Kalan 🔴 1: `su-kanunu-taslak-pdf` HTTP 404 — bu brief'in KAPSAMI DIŞI
  (SYGM belge ağacı taşınması; durum raporu A4 madde 2'de aday olarak
  duruyor, kullanıcı kararı bekliyor).
- Uyarı yolu bu GERÇEK kırmızıyı Telegram'a bildirdi: **message_id 4658**
  ("• su-kanunu-taslak-pdf (K4): HTTP 404"). İmza state'i
  `su-kanunu-taslak-pdf` olarak yazıldı — aynı imza 24 saat bastırılır,
  imza değişirse (örn. RG yeniden bozulursa) hemen yeni mesaj gider.
- Çıkış kodu 1 (hedef hatası var — sözleşmeye uygun; bekçi görür).

## 6. Bitti-tanımı karşılaştırması

| Şart | Sonuç |
|---|---|
| curl+python RG canlı (demetle) | ✅ 200 (fihrist 17931B / ana sayfa 199398B) |
| `--rg-tarih` arşiv+analiz üretiyor | ✅ 19/19 gün |
| Falsifikasyonda Telegram message_id | ✅ 4656 (su-izleme) · 4657 (rg-nobetci); ayrıca gerçek alarm 4658 |
| Telafi 06–24 Ağu, hata 0 | ✅ 19 gün YAYIN, ağ/sertifika hatası 0, mükerrer koruması çalıştı (bugünkü normal koşum aynı günü yeniden işledi — telafi kipi korumasının kapsamı yalnız telafi kipidir, normal kip sözleşmesi değişmedi) |
| rg-nobetci `--kosum` sorgu hatası 0 | ✅ 109 satır, yeni 0 (pencerede kaçan ilan yok) |
| `bash -n` + `py_compile` | ✅ temiz |
| Normal cron yolu bozulmadı | ✅ §5.1 (RG-gunluk yeşil; kalan kırmızı kapsam dışı ve artık Telegram'a çıkıyor) |
| Commit + push | ✅ kapanış commit'i (bu dosyanın commit'i) + biriken telafi commit'leri push'landı |
