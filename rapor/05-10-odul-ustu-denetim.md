# RAPOR — Ödül Üstü Tam Denetim (05.10.2026)

Sahip talimatı: "suharitasi projesini baştan sona denetle; hataları/eksikleri
bul ve düzelt; bilginin güncel ve sürekli olmasını sağla; görünür pazarlamayı
doğru yap; sitenin niteliğini, tasarımını ve her şeyini puanla; ödül üstü
katma değer önerilerinde bulun."

Yöntem: 3 bağımsız SALT-OKUNUR denetim ajanı (içerik/hukuk/güncellik ·
mimari/güvenlik/network · performans/varlık) + GSC/MCP ölçümleri + canlı
tarayıcı kontrolü. Her bulgu kanıtlı (dosya:satır / komut çıktısı). Ajan
bulgularından kritik olanlar bu oturumda bizzat doğrulandı; doğrulanamayanlar
"doğrulanamadı" işaretlidir.

---

## 1. PUAN KARTI (10 boyut · 100 üzerinden 80 = 8,0/10)

| # | Boyut | Puan | Kanıt özeti |
|---|---|---|---|
| 1 | İçerik & hukuk & güncellik | 8,0 | Baraj/GRACE/mevzuat kanıtlı taze; CHIRPS 3 ay bayat; damga eksikleri |
| 2 | Tasarım & erişilebilirlik | 9,0 | a11y 21/21 = 100, kontrast AA+, dokunma tabanı, konsol 0, HIG turu |
| 3 | Performans & varlık | 8,5 | 3. taraf 0 · ort. sayfa 14,2 KB gzip · /harita hero srcset yok · _astro 4s cache |
| 4 | Teknik SEO & GEO | 8,5 | +%77,5 tık (28g) · title-uzun×123 · nehir ailesi CTR ~0 · llms.txt+bots iyi |
| 5 | Güvenlik | 9,0 | CSP/HSTS/COOP · functions disiplini · .env 600 · sır taraması temiz |
| 6 | Mimari & kod kalitesi | 7,5 | 1190 sayfa EXIT 0 · TODO 0 · ama 6 bakım scripti untracked + sessiz-hata ihlali |
| 7 | Dayanıklılık & yedek | 6,0 | Off-site restic KOPUK + bekçi görmüyor · sahte-başarı script · disk %78 |
| 8 | Dağıtım & pazarlama | 7,5 | IndexNow canlı · GEO katmanı güçlü · GA4 kapalı · bülten/sameAs bekliyor |
| 9 | Veri hattı & otomasyon | 7,5 | Baraj günlük, GRACE haftalık, bekçiler canlı; CHIRPS/emsal hattı durmuş |
| 10 | Bilgi doğruluğu & uydurma yasağı | 9,0 | "doğrulanmadı" disiplini 108 sayfa · altın örnek 23/23 · uydurma bulgusu 0 |

**Genel: 8,0/10 — "ödül sınırında, üstü görünür".** K onarımlar + nehir
programı + GA4 ile 9,2-9,5 bandı gerçekçi hedef.

---

## 2. KRİTİK BULGULAR (K) — önce bunlar

**K1. Off-site yedek kopuk ve hiçbir bekçi görmüyor.** (bizzat doğrulandı)
- `systemctl --failed` → `restic-yedek.service failed since 2026-10-05 01:10:45`;
  journal: `unable to open repository at sftp:storagebox:restic-repo … server
  unexpectedly closed connection`; yerel bacak başarılı.
- `saglik-bekcisi.sh` yalnız yerel `son-yedek.json` tazeliğine bakıyor;
  systemd birimi kapsam dışı. `postfix@-.service failed` → systemd hata postası da
  teslim edilemiyor (çift kör nokta).
- Etki: makine/disk kaybına karşı tek koruma olan off-site bacak sessiz düştü.

**K2. `arac/restic-master-backup.sh` sahte başarı + çift cron.** (bizzat doğrulandı)
- Script 5 satır, `set -euo pipefail` yok, `RESTIC_REPOSITORY` yok; `restic backup`
  başarısız oluyor ama son satır koşulsuz "Süreç başarıyla tamamlandı" yazıyor.
- `crontab -l` 113 ve 114. satırlar birebir aynı (`0 2 * * *`) → her gece çift koşum.
- Etki: "Sessiz hata yasağı"nın doğrudan ihlali; yedek alındı sanılırken alınmıyor.

**K3. CHIRPS yağış verisi 3+ aydır tazelenmiyor; cron yok.** (kısmen doğrulandı)
- `data/canli/chirps.json` künye `son_guncelleme: 2026-08-04`; `crontab -l`'de
  chirps/era5 işi YOK; `arac/chirps-cek.py` zamanlanmamış.
- Tüketici: `src/data/su-riski.js:13`, `src/data/gundem.js:8` → /havza-riski/,
  /veri/gundem/. `data/canli/era5-toprak.json` boş (`"aylik": {}`) ama damgalı.
- Etki: "güncel su riski" sunan sayfa Haziran yağışıyla hesaplanıyor — sessiz bayatlık.
  (Ajanın "son ay 2026-06" detayı bu oturumda ayrıca doğrulanmadı.)

---

## 3. SARI BULGULAR (S)

**S1. Title-uzun×123 + soru-başlık-yok×4 (SITE-DURUM md16).** (bizzat ölçüldü)
- Dağılım: 95 `/nehirler/`, 26 `/havzalar/`, 2 tek sayfa. Uzunluk: 41×61-70,
  79×71-80, 3×81+. Aynı aile GSC'de en büyük fırsat (aşağıda §4).
- Soru-başlık eksik: /kuyu-ruhsati/, /rehberler/, /vaka/, /vaka/meysu/.

**S2. Nehir ailesi CTR çöküşü — sitenin 1 numaralı büyüme fırsatı.** (bizzat ölçüldü)
- GSC 28g: 332 tık (+%77,5) · 25.843 gösterim (+%111) · CTR %1,28 (-%15,9) · poz 8,82.
- CTR fırsatı: /nehirler/gokirmak/ 5.558 gösterim %0,018 CTR (tahmini +110 tık);
  eşen-cayi +78; kelkit +24; hezil +13; bakircay +9; harsit +7.
- Quick-wins: "gökırmak hangi akarsuyun kolu" 1.367 gösterim 0 tık (poz 9,1);
  "gökırmak nerede" 1.008/0; "eşen akarsuyu nerede" 967/0; "zap suyu nerede" 673;
  "eşen çayı nerede" 637; "terme ve kelkit çayı hangi akarsu" 357 (poz 5,8).
- Kök neden adayları: düşük sıralama (7-11) + cevap-kutusu/AI Overview soğurması +
  zayıf iç bağ. Ölçüldü: `/nehirler/gokirmak/` sayfasına yalnız **4 iç bağ**
  (kızılırmak havza, kastamonu kuyu-ruhsati, nehirler hub) — 95 sayfalık ailede
  kardeş-link ağı yok. Title zaten soru kalıbında ama 73 krk (kırpılıyor).
- Sayfa içeriği iyi: "KISA CEVAP" bloğu + kompakt tablo; H1 "Gökırmak".

**S3. Kilit veri sayfalarında dateModified / sitemap lastmod yok (518 URL).**
- mevzuat 472, yeralti-suyu 81, RG arşivi, emsal, tahmin aileleri damgasız;
  `astro.config.mjs:29-37` lastmod'u yalnız JSON-LD dateModified'dan üretiyor.
- Etki: yeniden-tarama sinyali ve E-E-A-T tazelik damgası yok.

**S4. TBB nötr-etiket ihlali: "Hemen ara" 1.109 HTML'de.** (bizzat doğrulandı)
- `CtaBlok.astro:28`, `AcilDestekBar.astro:16`, `hizli-danisma.astro:21`;
  projenin kendi kuralı "Telefon" der; `uyari-tarama.sh` deseni kaçırıyor
  ("hemen arayın" var, "hemen ara" yok) ve yalnız 4 sayfayı tarıyor.

**S5. Mevzuat radarı kısmi hatada exit=0 / "Son kontrol" tam sanılıyor.**
- `log/mevzuat-radar.log`: 167 için `Temporary failure in name resolution`;
  sayfa "Son kontrol 04.10 · 9 mevzuat · 469 madde" diyor.

**S6. Emsal aday hattı 03.10'da düştü; havuz 22.09'da dondu.**
- `yargi-cek-cron.log`: "aday dosyası yok/bozuk"; düzeltme 04.10'da yapıldı
  (`yargi-aylik.sh` cd+exit teyidi) ama ilk doğrulama 03.11'de.

**S7. Güvenlik küçük açığı: `/api/loglar` yetki denetimi rate-limit'ten önce.**
- `functions/api/loglar.js:44-49` — anahtar yanlışsa 401; sınırsız çevrimiçi deneme.

**S8. Disk %78; bayat yerel çıktılar ~500 MB.** (bizzat doğrulandı)
- `cikti/denetim` 294M, `cikti/dist-once*` ~220M, `denetim/kare` 54M;
  `disk-guard.sh` sudo'suz `journalctl --vacuum-size`/`apt-get clean` çağırıyor —
  %80'de tetiklenirse sessiz başarısız olacak.

**S9. 6 bakım scripti git dışı + "sessiz hata yasağı" ihlali.** (bizzat doğrulandı)
- `arac/{sys-check,disk-guard,restic-verify,aide-check,pg-maintenance,restic-master-backup}.sh`
  untracked; hiçbirinde `set -euo pipefail` + çıkış-kaydı yok; `restic-verify.sh`
  aynı repo eksikliğiyle bozuk; `pg-maintenance.sh` yetki/çıkış denetimsiz.

**S10. Depo hijyeni:** `BACKUP-AJAN-*` 5 dosyası izleniyor, `BACKUP-KESIF-*`
ignore'da (tutarsız politika); 12 tek-seferlik Temmuz scripti kökte
(`kare-*.mjs`, `kontrast-*.mjs`); `public/_redirects` www yorumu bayat (canlıda
301 çalışıyor).

**S11. Performans:** (a) `/harita/` tek-sürüm 2200×1232 hero (289 KB, srcset/sizes
yok) — canlı mobil Lighthouse 91 (21 sayfanın tek <94'ü); (b) `_astro/*`
içerik-hash'li ama yalnız 4 saat cache, `_headers`'ta immutable kuralı yok.

**S12. Görsel iddia incelemesi (hukuk):** hero rozetleri "CERN Tescilli Bilimsel
Veri (Zenodo DOI)" ve "Google & AI Onaylı Varlık (Wikidata)" — kaynaklar mevcut
(Wikidata Q141582057, DOI 10.5281/zenodo.23002678) ama ifade biçimi
[SERDAR-HUKUK] teyidi istiyor (abartı/unvan riski).

---

## 4. DÜZEY (D) BULGULAR

- Ölü hero seti `public/hedef/*` 1,75 MB — canlı referans 0 (bizzat doğrulandı);
  silme ön koşulu CF erişim günlüğü kontrolü hâlâ açık.
- Sahne videoları 0,88-2,03 MB tutarsız bitrate (toplam 7,95 MB); posterler JPEG 333 KB.
- Görünür damga dili tutarsız (havzalar "04.10", durumum "21 Temmuz", nehir "4 Ağustos").
- `content-visibility` uzun listelerde yok; Speculation Rules yok.
- `oz-cevap-uzun` 29 sayfa (maks 341 krk; hedef 280) — hafif aşım.
- `/mevzuat/` 231 KB + 38 MB aile; tembel arama JSON'u var (kabul edilmiş risk).

---

## 5. TEMİZ ÇIKANLAR (özet)

a11y 21/21 100 · kontrast AA+ · dokunma tabanı · konsol 0 · mobil taşma 0 ·
3. taraf istek 0 · JS/CSS minify + sourcemap yok · brotli · font self-host
font-display swap · img alt 100% · CSP/HSTS/COOP/CORP · .env 600 + sır temiz ·
functions gövde tavanı + origin + sabit-zamanlı anahtar · www 301 → apex ·
robots AI politikası (14 açık / Bytespider+CCBot bilinçli kapalı) · llms.txt +
llms-full 200 · IndexNow canlı · altın örnek 23/23 · uydurma bulgusu 0 ·
kırık iç link 0 · içerik çürümesi 0 · yamyamlık yalnız 3 küçük vaka.

---

## 6. KATMA DEĞER ÖNERİLERİ (ödül üstü)

1. **Nehir Ailesi Sıçraması (en yüksek getiri):** 95 nehir + 26 havza title'ını
   ≤60 krk soru kalıbına indir; her nehir sayfasına soru-formatlı H2 + 40-60
   kelime kesin cevap; havza↔nehir çift yönlü "kollar/nehirler" modülü ile
   ailede iç-bağ ağı kur; değişen sayfaları IndexNow'a bildir. GSC beklentisi:
   mevcut 332 tık/28g'ye ek ~+200-300 tık/28g; 2-4 hafta sonra `gsc_quick_wins`
   ile ölçüm. (Projede `NehirSnippet.astro` altyapısı zaten var.)
2. **Veri Tazelik Panosu:** tüm kümelerin as-of + tazeleyen job + son başarısı
   tek JSON'da (`izleme/veri-tazelik.json`); `site-saglik --tam` kalemi;
   `/acik-veri/`de yayın. CHIRPS tipi sessiz bayatlık bir daha 3 ay saklanamaz.
3. **Damga Tamamlama:** `guncellik.js`e mevzuat/RG/emsal tarihlerini bağla →
   518 lastmod'suz URL + 475+ damgasız sayfa kapanır (SEO + E-E-A-T).
4. **Systemd → Telegram Köprüsü:** tüm birimlere `OnFailure=` drop-in'i
   (`uyari-gonder.sh` var); postfix arızasından bağımsız tek hata kanalı.
   Ek: aylık `restic restore` tatbikatı — "yedek var mı" değil "geri dönüyor mu".
5. **Cron Sözleşme Kapısı:** `--tam`'a kalem — crontab'daki her betikte
   `set -euo pipefail` + çıkış-kaydı ara; ihlal = sarı. (S9'daki 6 script bu
   kapıdan geçmeli.)
6. **Hukuk Tarama Sürekliliği:** `uyari-tarama.sh` desenine "hemen ara/arayın",
   "kazanın" ekle; tüm dist + hukuk ailelerine genişlet; site-saglik kalemi yap.
7. **GEO Alıntı Paketi:** soru-cevap ailelerinde FAQPage genişletmesi (görünür
   Q&A şartıyla), `SpeakableSpecification`, llms-full.txt'ye nehir/havza
   bölümleri; AI Overview alıntısı için 40-60 kelimelik tanım paragrafları.
8. **Medya Turu (tek iş):** videoları ~%35 küçült (7,95→~5 MB), posterleri
   AVIF'e çevir, ölü `hedef/*` setini CF günlüğü kontrolünden sonra sil.
9. **Ön-render & Akış Hızı:** yüksek-niyetli sayfalarda Speculation Rules;
   uzun listelerde `content-visibility:auto`; `_astro/*` immutable cache.
10. **Dağıtım Ölçümü:** GA4 Admin API aç (panel) → dönüşüm hunisi ölçülür;
    bülten (Buttondown) + LinkedIn/GBP/Wikidata `sameAs` profilleri → B2B.

---

## 7. ONARIM YOL HARİTASI (parçalı)

- **P1 DAYANIKLILIK:** K1+K2+S8+S9 — off-site restic onarımı + OnFailure→Telegram;
  sahte-başarı scripti onar/kaldır; çift cron sil; 6 script `set -euo pipefail`
  + çıkış-kaydı + doğru yetki; disk temizliği; hepsi commit.
- **P2 NEHİR & TITLE (S1+S2):** başlık ailesi + iç-bağ ağı + soru H2 + IndexNow;
  ölçüm 2-4 hafta.
- **P3 DAMGA & TAZELİK (K3+S3+S5+S6+S7):** chirps cron + era5 kararı; güncellik
  damgaları; mevzuat-radar hata yayını; emsal ilk koşu doğrulaması; loglar rate-limit.
- **P4 PERFORMANS (S11):** /harita srcset + _headers immutable + medya turu.
- **P5 HUKUK & HİJYEN (S4+S10+S12):** "Hemen ara"→"Telefon" + tarama genişletme;
  rozet ifade teyidi; depo hijyeni.
- **P6 DAĞITIM:** GA4 + bülten + sameAs + veri tazelik panosu yayını.

Her parça: brief (`cikti/brief/`) → uygula → build/ölçüm → commit+push → canlı
doğrula → SITE-DURUM + SIRADAKILER kaydı.

---

## 8. DENETİMİN ÖZ-ELEŞTİRİSİ ("daha iyisi olabilir miydi")

- SERP/AI Overview canlı teyidi yapılamadı (DataForSEO anahtarı yok) — nehir
  CTR kök nedeninde "AIO soğurması" hipotezi kanıtlanmadı; P2 ölçümüyle
  dolaylı test edilecek. Eksik: anahtar sağlanırsa `serp_aio_monitor` turu.
- Tasarım denetimi hafif kaldı: 2 kare + konsol; derin HIG ölçümü yerine
  projenin kendi md13/14/15/21 yeşillerine dayandı. P4'te Lighthouse/CLS ile derinleşmeli.
- Yargı aday hattının düzeltmesi ve pg/aide scriptlerinin gerçek koşum davranışı
  doğrulanamadı; P1/P3'te kanıtlanacak.
- Ajan bulgularından CHIRPS "son ay" ve damga sayıları bu oturumda ikinci kez
  ölçülmedi; P3 başında teyit edilecek.
