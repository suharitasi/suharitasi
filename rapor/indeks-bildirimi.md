# OTOMATİK DİZİN BİLDİRİMİ (IndexNow) — kapanış raporu

Brief: `cikti/brief/2026-08-25T09-52-56Z-indeks-bildirimi.md`
(düzeltilmiş: `...-duzeltilmis.md`) · Worktree: `suharitasi-indeks`
(dal `indeks-bildirimi`) · Model: Fable 5 · Sınıf: BÜYÜK İŞ (beyan
brief'te) · Başlangıç: 2026-08-25T09:52Z.

## 0. Rejim kapısı (denetim + düşman geçişi + amaç özeti)

### 0a. Brief denetçisi
Orijinal koşum: **1 ENGEL + 3 UYARI** (T5 commit+push anılmamış; T1
rapor referansı, T6 git kilidi, T6 canlı-koşul). Yalnız-ekleme
düzeltmesi (E1-E4) sonrası: **ENGEL 0, 1 UYARI** — kalan uyarı T1'dir
ve E4'te açıklanmıştır (`rapor/indeks-bildirimi.md` bu işin YENİ
çıktısıdır). Denetim raporları: `cikti/denetim/brief/2026-08-25T09-53-41Z.md`
ve `...T09-53-57Z.md`.

### 0b. Amaç özeti
- **Amaç:** yayımlanan her sayfanın arama motorlarına OTOMATİK
  bildirilmesi; kullanıcının elle dizin isteği yapmaması. Araçlar:
  IndexNow (kurulabilirse) + Google Indexing API (yalnız uygunsa) +
  sitemap tazelik sinyalinin dürüstleştirilmesi.
- **Dokunulmazlar:** arslanhukuk.tr ve BIST (dokunulmadı) · sahte
  tazelik (build saati lastmod/damga basılmaz) · var olmayan sayfayı
  bildirmek · sırların depoya/günlüğe girmesi · PANEL/ÜCRETLİ adımlar
  (yapılmaz, kullanıcı listesine yazılır) · AY İLKESİ (bu iş DAĞITIM
  sınıfı — uygun).
- **Bitti-tanımı:** Faz 0 ölçümleri kaynaklı-tarihli · kurulabilen yol
  kurulu + falsifikasyonlar geçmiş · ilk kademeli bildirim yanıtlarla
  kayıtlı · KAPI kalemleri yeşil · bu rapor + kullanıcı adım listesi.
- **Kanıtlar:** canlı ölçümler (robots/sitemap/anahtar/surum.json) ·
  resmî kaynak URL+tarih · uç nokta HTTP yanıtları · bekçi
  falsifikasyon çıktıları · `--tam` sağlık koşusu.

### 0c. Düşman geçişi (D1-D4)
- **D1 — FAIL yolu:** (i) var olmayan/henüz deploy edilmemiş sayfayı
  bildirmek. Karşı şart: bildirici URL'leri YALNIZ canlı sitemap'ten
  okur, canlı `surum.json` imzasını kaydeder, anahtar dosyasının
  canlıda birebir eşleştiğini doğrular; yeni URL'ler tek tek canlıda
  200 doğrulanır. (ii) Sahte tazelik: lastmod build gününden basılıyordu
  — kaldırıldı; tarih yalnız sayfanın kendi `dateModified` beyanından
  (o da veri kaydından, `guncellik.js`). (iii) İlk koşumda 519 URL'nin
  tek seferde gitmesi — state yokken betik kendini `CEKIRDEK_SINIR=20`
  ile sınırlar; ilk toplu bildirim elle kademeli yapıldı. (iv) State
  commit'lenirse her koşum deploy tetikler (6×/gün boş build) —
  state `.gitignore`'da, diskte kalır, gecelik yedeğe girer.
- **D2 — boş çıkabilecek varsayımlar:** (i) "Google Indexing API genel
  sayfalar için kullanılabilir" — resmî belgeden YANLIŞLANDI (yalnız
  JobPosting/BroadcastEvent; §2.4). (ii) "Bing'e site kayıtlı" —
  gösterge bulunamadı (BingSiteAuth.xml 404, DNS TXT'de yalnız Google
  kaydı); panel içi durum bu ortamdan ÖLÇÜLEMEZ → kullanıcı adımı.
  (iii) "dateModified her sayfada var" — ölçüldü: 508/519; kalan 11
  sayfada lastmod dürüstçe basılmıyor. (iv) "geçersiz anahtar anında
  403 verir" — ölçüldü (§5.2): uç nokta ilk gönderimde 200/202 dönebilir
  (anahtar doğrulaması asenkron); falsifikasyon buna göre okundu.
- **D3 — değen maddeler:** sitemap üretimi ↔ md1/md16 sağlık kalemleri
  (URL kümesi birebir korundu, fark 0) · bekçi ↔ yeni state dosyası
  (state yokken ilk koşum öncesi alarm penceresi — merge'den hemen
  sonra ilk koşum yapılarak kapatıldı) · kirli-ağaç dersi ↔ state'in
  git dışında tutulması.
- **D4 — yarıda kesilme:** tek commit merge edildi; bildirici çalışmasa
  bile site davranışı değişmez (sitemap dürüstleşir, anahtar dosyası
  pasif durur). Bildirim partisi yarıda kalırsa gönderilemeyen URL'ler
  state'e yazılmaz ve sonraki koşumda yeniden denenir (atomik state
  yazımı: geçici dosya + rename).

## 1. Faz 0 — ölçümler (tümü 2026-08-25, canlıdan/resmî kaynaktan)

### 1.1 Mevcut durum
| Ölçüm | Değer |
|---|---|
| Canlı sitemap | `https://suharitasi.com/sitemap.xml` — HTTP 200, 519 `<url>` |
| lastmod | 519/519 vardı ama HEPSİ build günü (`2026-08-25`) — astro.config `new Date()` basıyordu → **sahte tazelik, Faz 3'te düzeltildi** |
| robots.txt | HTTP 200; `Sitemap: https://suharitasi.com/sitemap.xml` satırı doğru; Googlebot/Bingbot/AI botları açık |
| Canlı sayfa | 519/519 HTTP 200 (site-sağlık `--tam` 2026-08-25T09:34Z, md2) |
| sitemap-index.xml | 404 (yok; tek sitemap kullanılıyor — sorun değil) |

### 1.2 IndexNow şartları (resmî: indexnow.org/documentation, okundu 25.08.2026)
- Anahtar: 8-128 karakter, [a-zA-Z0-9-]; **anahtar dosyası** site
  kökünde `https://host/{anahtar}.txt`, içeriği anahtarın kendisi.
  **Anahtar SIR DEĞİLDİR** — protokol gereği herkese açık yayımlanır;
  `.env`'e konmaz (bu depoda `public/{anahtar}.txt`).
- Toplu gönderim: `POST /indexnow` — **tek istekte en çok 10.000 URL**;
  JSON alanları `host`, `key`, `urlList` (+isteğe bağlı `keyLocation`).
- Yanıt kodları: 200 başarı · 202 alındı/anahtar doğrulaması beklemede ·
  400 biçim · 403 anahtar geçersiz · 422 URL host'a ait değil ·
  429 oran aşımı. Açık günlük sayı limiti yazılmıyor; "çok sık
  gönderme" uyarısı var — partiler arası bekleme kondu.
- Katılımcı motorlar (indexnow.org/searchengines.json, 25.08.2026):
  Bing, Yandex, Seznam, Naver, Yep, Internet Archive, Amazonbot.
  Tek uç noktaya bildirim TÜM katılımcılara paylaşılır; genel uç nokta
  `https://api.indexnow.org/indexnow` kullanıldı. **Google IndexNow
  üyesi DEĞİLDİR** — Google tarafı sitemap lastmod + GSC ile kalır.

### 1.3 Bing Webmaster Tools durumu
- `BingSiteAuth.xml` → 404; DNS TXT'de yalnız `google-site-verification`
  var (GSC doğrulaması DNS yoluyla — ölçüldü `dig TXT`).
- Bing `site:suharitasi.com` sorgusu bot yanıtında güvenilir sonuç
  vermedi (alakasız sonuçlar döndü) — **Bing dizin/kayıt durumu bu
  ortamdan doğrulanamadı (25.08.2026)**. Kayıt/doğrulama PANEL İŞİ →
  kullanıcı adım listesi §7 (GSC'den içe aktarma yolu dahil).
- IndexNow bildirimi Bing kaydı olmadan da protokolce kabul edilir;
  ancak Bing Webmaster kaydı hem raporlama hem GEO (ChatGPT arama
  katmanı Bing indeksi) için kullanıcı adımı olarak önerildi.

### 1.4 Google Indexing API (resmî: developers.google.com/search/apis/indexing-api/v3/quickstart, okundu 25.08.2026)
Resmî kısıt: *"The Indexing API can only be used to crawl pages with
either JobPosting or BroadcastEvent embedded in a VideoObject."*
Hizmet hesabı gerekir; başlangıç kotası 200 istek. Bu sitede iş ilanı /
canlı yayın yapılandırılmış verisi YOK ve eklenmesi uydurma olur →
**Faz 2 UYGUN DEĞİL ile kapandı** (brief 2.3): betik hazırlanmadı,
hizmet hesabı adımı çıkarılmadı. Google tarafı için mevcut meşru
kanallar: dürüst sitemap lastmod (bu işte kuruldu) + GSC sitemap/tekil
istek (kullanıcı, zaten listede).

### 1.5 Cloudflare Crawler Hints (developers.cloudflare.com/cache/advanced-configuration/crawler-hints/, okundu 25.08.2026)
Cloudflare'ın hazır IndexNow entegrasyonu VAR (Crawler Hints; Free plan
dahil; Caching → Configuration'da tek anahtar). Aktif olup olmadığı
PANEL'den görülür — bu ortamdan ölçülemedi (doğrulanmadı, 25.08.2026).
Kendi bildiricimiz kuruldu çünkü Crawler Hints önbellek-MISS
sinyalinden çıkarım yapar (hangi URL'nin ne zaman bildirildiği
ölçülemez, kanıt disiplinine kapalı); bizim yol deterministik ve
loglu. İkisi çakışmaz — kullanıcı isterse paneldeki anahtarı da açar
(isteğe bağlı, §7).

### 1.6 Yayın tetiği seçimi (brief 0.6)
Deploy'lar TEK aktörden çıkmıyor: baraj cron'u (günlük 15:05), su-izleme
(05:45+16:15), rg/nhyp nöbetçileri (haftalık), elle merge'ler. Sunucuda
"deploy bitti" diyen tek kanca yok; Cloudflare tarafı kanca ise API
sırrı + panel ister.
- **(a) deploy-doğrulama akışına bağlanmak:** akış tek değil — 4+ betik
  değişir, elle merge'leri yine kaçırır. RED.
- **(c) Cloudflare tarafı otomasyon:** SIR (API token) + panel işi. RED.
- **(b) zamanlanmış sitemap farkı — SEÇİLDİ:** bildirici cron'la koşar;
  canlı `surum.json` imzasını kaydeder, canlı sitemap'i son bildirilen
  durumla (loc+lastmod) karşılaştırır, yalnız yeni/değişen URL'leri
  bildirir. Deploy kim tarafından tetiklenirse tetiklensin yakalanır;
  bildirim tanım gereği canlıda VAR OLAN içerik için çıkar (brief 1.4'ü
  yapısal olarak sağlar). Önkoşulu Faz 3'tü: lastmod build günü
  olduğu sürece her deploy 519 URL'yi "değişti" gösterirdi — o yüzden
  lastmod düzeltmesi bildiriciyle AYNI commit'te yayına girdi.

## 2. Kurulanlar

### 2.1 Sitemap tazelik (Faz 3)
`astro.config.mjs sitemapOlustur`: lastmod artık sayfanın kendi JSON-LD
`dateModified` beyanından (en yenisi) okunur; `dateModified` yoksa
lastmod BASILMAZ. `dateModified` dünkü güncellik damgası işiyle
`src/data/guncellik.js` üzerinden VERİ KAYDI tarihinden gelir — zincir
uçtan uca veri-tarihli, build saati hiçbir yerde yok.
Ölçüm (worktree build): 519 URL (loc kümesi canlıyla `diff` FARK 0),
508 lastmod'lu (dağılım: 342×2026-08-04 · 82×07-27 · 45×07-21 ·
28×08-25 · 8×07-25 · 07-26/07-23/07-14 birer), 11 sayfada lastmod yok
(ana sayfa dahil — tarihi belirsiz, dürüstçe boş). XML `ElementTree`
ile geçerli. robots.txt sitemap satırı doğruydu, dokunulmadı (3.3 ✓).

### 2.2 IndexNow anahtarı (Faz 1.1)
`public/f17a2487...8dda.txt` (64 hex, `openssl rand -hex 32`). SIR
DEĞİL — repo'da açık durması protokolün kendisi.

### 2.3 Bildirici: `arac/indexnow-bildir.mjs` (Faz 1.2)
- Sıra: anahtar dosyası CANLIDA birebir doğrulanır → canlı
  `surum.json` imzası kaydedilir → canlı sitemap çözülür → state
  farkı → yeni URL'ler tek tek 200 doğrulanır → partiler hâlinde
  `api.indexnow.org/indexnow`'a POST (parti 250 URL, arada 3 sn —
  10.000 limitinin çok altında) → her yanıt loglanır → state atomik
  yazılır. 200/202 dışı yanıtta DURUR: log + Telegram
  (`arac/uyari-gonder.sh`, RG hattı deseni) + exit 1; gönderilemeyen
  URL'ler state'e yazılmadığı için sonraki koşumda yeniden denenir.
- State: `izleme/state/indexnow-durum.json` — `.gitignore`'da (her
  koşumda commit → gereksiz deploy döngüsü olmasın; kirli-ağaç dersi).
  Kaybolursa betik ilk-koşum moduna döner ve tek koşumda en çok 20 URL
  bildirir (kademeli kural koda gömülü).
- Bayraklar: `--kuru` (gönderimsiz fark) · `--url-dosya` (yalnız liste;
  canlı sitemap'te olmayan URL varsa reddeder) · `--sinir n` ·
  `--anahtar k` (falsifikasyon).

### 2.4 Bekçi kalemi (Faz 1.7)
`saglik-bekcisi.sh (d2)`: iki eşik — (1) son KOŞUM >26 saat (cron
6×/gün; commit/baraj kalemleriyle aynı "cron öldü" mantığı), (2) son
BAŞARILI BİLDİRİM >96 saat. Türetme: baraj verisi her gün güncellenip
havza sayfalarının dateModified→lastmod'unu oynattığından normalde her
gün bildirim doğar; baraj kaynağının kendi kesintisi ayrı kalemde
yakalandığı için eşik 24s değil 96s (yanlış alarm üretme ilkesi).
`INDEXNOW_DURUM` env'i ile gerçek state'e dokunmadan falsifikasyon
koşulabilir.

### 2.5 Cron
`25 0,4,8,12,16,20 * * *` → `arac/indexnow-bildir.mjs` (6×/gün;
baraj 15:05 ve su-izleme 05:45/16:15 push'larının deploy'ları 16:25 ve
08:25/20:25 koşumlarında yakalanır; elle merge'ler en geç 4 saatte).
Kayıt: §5.4.

## 3. Yayın ve canlı doğrulama

(§3 ve sonrası ilk bildirimden sonra dolduruldu — aşağıda.)
Merge `fa5fd95` (ff-only, git kilidiyle) → push 10:02Z → **deploy canlı
10:03:24Z** (`surum.json` kisa=fa5fd95 — içerik imzasıyla teyit).
Canlı ölçümler:
- Anahtar dosyası: `https://suharitasi.com/f17a2487...8dda.txt` →
  HTTP 200, gövde anahtarla birebir (KAPI kalemi ✓).
- Yeni sitemap canlıda: 519 URL, 508 `<lastmod>` (build-günü damgası
  kalktı; ana sayfa dahil 11 tarihi-belirsiz sayfada lastmod yok).

## 4. İlk kademeli bildirim (Faz 1.3) — uç nokta yanıtları

| Adım | URL sayısı | Yanıt |
|---|---|---|
| Çekirdek (kapı sayfaları + en değerli 20, `cikti/indexnow-cekirdek.txt`) | 20 | HTTP **202** (yeni anahtarda ilk doğrulama asenkron) |
| Parti 1 (kalanlar) | 250 | HTTP **200** |
| Parti 2 (kalanlar) | 249 | HTTP **200** |

Toplam **519/519 URL bildirildi** (10:05-10:06Z; log: `log/indexnow.log`,
state: `izleme/state/indexnow-durum.json`). 202→200 geçişi anahtarın uç
noktaca doğrulandığını gösteriyor. Ardışık koşum falsifikasyonu:
yeniden koşum `fark=0, bildirim çıkmadı` (idempotent — aynı içerik
yeniden bildirilmiyor).

## 5. Falsifikasyonlar (tümü kanıtla)

1. **Anahtar canlıda yokken (deploy öncesi koşum):** `DUR: anahtar
   dosyası canlıda doğrulanamadı (HTTP 404) — bildirim yapılmadı`,
   exit 1. Bildirim çıkmadı (brief 1.4 kapısı çalışıyor).
2. **Geçersiz anahtarla gönderim (brief 1.6a):** `--anahtar 0000...` ile
   1 URL → HTTP **202** döndü, senkron hata YOK — resmî davranış:
   anahtar doğrulaması asenkron ("202: key validation pending").
   Ölçülen ek kanıt çifti: (i) host uyuşmazlığı senkron **422** ile
   reddediliyor (curl ölçümü), (ii) geçerli anahtar sonraki
   gönderimlerde **200**'e geçti, geçersiz olan 202'de kalıyor.
   Betiğin savunması vekile değil yapıya dayanıyor: gönderilen anahtar
   HER koşumda canlı `{anahtar}.txt` ile birebir eşleşmek zorunda —
   yanlış anahtarla koşum zaten 1. maddedeki kapıya takılır.
3. **Gönderim hatası → uyarı (brief 1.5/1.6):** falsifikasyon kancası
   `INDEXNOW_UC_NOKTA` ile sahte uç nokta (HTTP 500) → `parti 1: ... →
   HTTP 500 (sahte hata)` + exit 1 + **gerçek Telegram uyarısı
   (message_id 4667)** + state yazılmadı (URL sonraki koşumda yeniden
   denenirdi).
4. **Geçerli gönderim (brief 1.6b):** §4 tablosu — 200/202 yanıtları
   uç noktadan ölçüldü.
5. **Bekçi kalemi (brief 1.7):** `INDEXNOW_DURUM` test kopyalarıyla —
   sonKosum 48s geriye → `indexnow bildiricisi 48 saattir koşmamış
   (>26s)` + exit 1 + Telegram; sonBasariliBildirim 120s geriye →
   `son başarılı bildirim 120 saat önce (>96s)` + exit 1 + Telegram;
   gerçek state ile → `sağlık OK`, exit 0, UYARI dosyası temizlendi.

## 6. KAPI

- build temiz: worktree build exit 0, 522 sayfa (519 sitemap + 404 vb.).
- sitemap URL kümesi: canlıyla `diff` FARK 0 (yalnız lastmod değişti).
- anahtar dosyası canlıda ölçüldü: 200 + birebir içerik.
- falsifikasyonlar: §5, beşi de geçti.
- cron kuruldu: `25 0,4,8,12,16,20 * * *` (6×/gün; crontab'a yazıldı).
- Canlı `--tam` sağlık koşusu: aşağıda (§6.1).

## 7. KULLANICI ADIM LİSTESİ (panel işleri — makine yapamaz)

1. **Bing Webmaster Tools kaydı** (~5 dk; hem IndexNow raporlaması hem
   ChatGPT/GEO görünürlüğü için):
   1. https://www.bing.com/webmasters → "Sign in" (Microsoft hesabı;
      yoksa Google hesabıyla da girilebilir).
   2. "Add your site" ekranında **"Import from Google Search Console"**
      seçeneğine tıkla → Google hesabınla yetkilendir → suharitasi.com'u
      seç. (Site GSC'de DNS TXT ile doğrulu — ölçüldü; içe aktarma bu
      doğrulamayı devralır, ayrıca DNS/dosya adımı gerekmez.)
   3. İçe aktarma bitince sol menü → "IndexNow" → gönderilen URL'lerin
      göründüğünü kontrol et (bizim bildirimler buraya düşecek).
2. **(İsteğe bağlı) Cloudflare Crawler Hints:** dash.cloudflare.com →
   suharitasi.com bölgesi → **Caching → Configuration → Crawler Hints**
   anahtarını aç. Cloudflare'ın kendi IndexNow beslemesi; bizim
   deterministik yolla çakışmaz, ek sinyaldir. (Aktif olup olmadığı
   panelden görülür; bu ortamdan ölçülemedi.)
3. **GSC** (önceden listede, C5 №1 — değişmedi): sitemap'i yeniden
   gönder + ~20 öncelikli sayfaya tekil dizin isteği. Google IndexNow
   üyesi olmadığı için Google tarafında tek hızlandırıcı bu + dürüst
   lastmod.

**Google hizmet hesabı adımı YOK:** Indexing API bu siteye uygun değil
(§1.4) — hesap açtırmak gereksiz iş olurdu.

## 8. Doğrulanamayan / kurulamayan kalemler

- Bing kayıt/dizin durumu: bu ortamdan doğrulanamadı (25.08.2026) —
  panel görünümü kullanıcıda.
- Cloudflare Crawler Hints'in mevcut açık/kapalı durumu: doğrulanamadı
  (25.08.2026) — panel işi.
- IndexNow bildirimlerinin dizine YANSIMA hızı: protokol garanti vermez;
  ölçüm yolu Bing paneli (kullanıcı adımı 1.3) + GSC (Google için
  geçerli değil). "Bildirildi" ≠ "dizine girdi" — bu rapor yalnız
  bildirimin kanıtını içerir.
- Google Indexing API: kurulmadı (resmî kapsam dışı, §1.4).

### 6.1 Canlı `--tam` sağlık koşusu (merge + ilk bildirim SONRASI, 10:12-10:22Z)

**GENEL: SARI — kırmızı 0 · sarı 1 · geçti 22.** Tek sarı md17
dış-bağlantı zaman aşımı (dış sunucular; iş ÖNCESİ 09:34Z koşusunda da
aynı sarıydı — bu işle ilgisiz). İşle ilişkili kalemler: md1 sitemap
519 URL geçerli XML (yeni lastmod biçimiyle) · md2 erişim 519/519 ·
md16 geniş tarama bulgu 20 (taban 20, gerileme 0) · md14 G1-G6 sapma 0
· md5 konsol 0 · md15 a11y 100/100 · md9 Lighthouse tabanda (ana sayfa
100/81) · md23 altın örnek 23/23. Ağırlık: sayfa içeriğine dokunulmadı
(değişen tek üretim dosyası sitemap.xml; 59.015→~55K bayt, lastmod'suz
11 satır eksildi).
