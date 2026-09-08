# 08.09.2026 — Karar dosyasının kapatılması + tekrar önleyiciler (BÜYÜK, 6 faz)

Brief: `cikti/brief/2026-09-08-karar-kapatma.md` (aslı) · `…-duzeltilmis.md`
(denetçi tamamlaması, yalnız ekleme). Denetçi: 1 ENGEL + 2 UYARI →
tamamlama sonrası TEMİZ (rapor `cikti/denetim/brief/2026-09-08T11-52-00Z.md`).
Düşman geçişi: (D1) A1d/A2e/B5/F1d falsifikasyonları ham çıktı ister — beyan
kabul edilmez; (D2) D2 süzgeç ölçütü elle liste olursa "uydurma" — ölçüt
kural + veriyle sınama + bağımsız çürütme turuyla kuruldu; (D3) E3 "adında
baraj geçiyor" tek başına dayanak değil — depo içi baraj listeleriyle
eşleme, eşleşmeyen şerhli; (D4) C4 numara 523 sayfanın kaynağına girer —
raporda açık, geri alma tek satır. Amaç özeti: tekrar önleyiciler (deploy
sessizliği alarmı, cron kirli-ağaç bağışıklığı, ölçmeden uygulama yasağı)
→ karar dosyasındaki uygulanabilir kalemlerin kapatılması → kalanların
adım adım kullanıcı kalemi olarak yazılması. Dokunulmazlar: hukuki metin,
ücretli adım, geri alınamaz silme, marka kimliği, veri kaynağı dosyaları,
Indexing API.

Önceki iş: `rapor/08-09-gsc-ticari-whatsapp.md` · karar dosyası
`rapor/08-09-KARAR-KULLANICI.md` (bu işte güncellenir).

## 0 — Kapı
`/home/suha/projeler/suharitasi`, remote `suharitasi/suharitasi` ✓ ·
`git status` temiz, ahead 0 / behind 0 (11:47Z; HEAD 461825a = Faz E
kapanışı) · SITE-DURUM 09:26Z SARI (tek sarı md17 dış bağlantı) · taban
`/home/suha/denetim-taban/` (22e3e86, 27.08) + bu işin kendi "önce" kopyası
`cikti/dist-once2` (HEAD 461825a build'i, 522 sayfa).
Keşif: salt-okunur Workflow (6 ajan + 1 çürütme ajanı) — cron commit
mekanizması, sağlık kalemi yapısı, Pages Functions öncelik/KV, künye
süzgeç ölçütü, OSM tip çelişkisi, GSC haftalık betik. Bulgular fazlarda.

## F1a — Üç rehberin indeks tabanı (ölçüm 11:52Z, URL Inspection API)
Kullanıcı elle dizin isteği yapmış; Google üçünü de **11:38–11:39Z'de
taradı ve dizine aldı**:

| URL | 08.09 08:43Z (önceki iş) | 08.09 11:52Z (bu iş, taban) |
|---|---|---|
| /rehberler/kuyu-ruhsati/ | Tarandı, dizine eklenmedi (son tarama 18.07) | **Gönderildi ve dizine eklendi**, tarama 11:38:49Z |
| /rehberler/su-tahsisi-oncelik-sirasi/ | Keşfedildi, dizine eklenmedi | **Gönderildi ve dizine eklendi**, tarama 11:38:50Z |
| /rehberler/kuyu-tasima/ | URL Google tarafından bilinmiyor | **Gönderildi ve dizine eklendi**, tarama 11:38:50Z |

İzlenecek sonraki eşik: ilk gösterim / ilk tıklama (F1b haftalık koşum).

## FAZ A — Tekrar önleyiciler

### A1 — Deploy sessizliği alarmı (md25 `25-deploy-yasi`)
- **A1a yapı:** `arac/site-saglik.mjs` kalem sözleşmesi `kaydet(ad, durum,
  mesaj, olcum, modlar)` + mod kapısı `korumali(ad, modlar, fn)`; yeni kalem
  md24'ün ardına yerleşti (fonksiyon `md25_deployYasi`, kayıt
  `korumali('25-deploy-yasi', ['hizli','tam'], …)`). Tek fetch + iki git
  okuması → kaynak kapısı gereği hem `--hizli` hem `--tam`.
- **A1b ölçüm:** mevcut imza `/surum.json` (`astro.config.mjs` surumDamgasi:
  commit, kisa, zaman, dal). `zaman` build anıdır ve **deploy hook aynı
  commit'i her gün yeniden derliyor** (27.08–07.09 her gün "deploy hook
  tetiklendi HTTP 200" — data/arsiv/baraj/log/cron.log) → `zaman`'a bakan
  kalem olayda hiç ateşlemezdi. Bu yüzden `commit` → `git log -1 --format=%ct`
  (canlı commit yerelde yoksa build zamanına düşer ve bunu mesajda söyler).
  Ek: `origin/main N commit ileride` notu.
- **A1c eşik:** `izleme/kapsam-taban.json` → `deploy: {sariSaat:72,
  kirmiziSaat:168}`; gerekçe cron takviminden (baraj push günlük 15:05 UTC,
  sağlıklı yaş ≤28 s; 72 s = üç kaçırılmış deploy; 168 s = 7 gün, bekçi
  GRACE sınıfı). Olayda ilk sarı 30.08 19:30, ilk kırmızı 03.09 19:30 olurdu
  (gerçekte 12 gün sessiz kaldı). **Telegram yolu:** ölçüm site-saglik'te
  Telegram çağrısı OLMADIĞINI gösterdi (SMTP .env'de boş, `mailGonder`
  "beklemede") → `bitir()` durum-değişiminde `arac/uyari-gonder.sh`'yi de
  çağırıyor (`telegramGonder`); sarı yine sessiz (E3 tekrar koruması korunur).
- **A1d falsifikasyon (ham çıktı):**
  1. `SAGLIK_DEPLOY_ZAMAN=2026-08-31T16:48:17Z node arac/site-saglik.mjs --hizli`
     → `[KIRMIZI] 25-deploy-yasi — canlı içerik 192 saattir aynı (32b66bb) —
     >168s (7 gün); deploy zinciri kopmuş olabilir [FALSİFİKASYON:
     SAGLIK_DEPLOY_ZAMAN]` · `GENEL: KIRMIZI — kırmızı 1 · sarı 0 · geçti 12`
     · durum dosyası `sonBildirim.telegram: {gonderildi:true}` · `log/uyari.log`
     **message_id 8664** (16:49:36Z, gerçek kanal).
  2. Ezme kaldırıldı, `--hizli` → `[GEÇTİ] 25-deploy-yasi — canlı 32b66bb
     (main) · içerik 0.6s · build 0.5s önce` · `GENEL: YESIL — 0/0/13` ·
     Telegram "ONARILDI — tüm kontroller geçti" **message_id 8665** (16:51:17Z).
     SITE-DURUM.md satır 25: `🟢 25-deploy-yasi`.

### A2 — Cron'un kirli ağaçta takılması
- **A2a/A2d envanter (14 suharitasi cron satırı; brief "13" dedi — su-izleme
  ×2 ve site-saglik ×3 ayrı satırlar sayılınca 14; 4 arslanhukuk satırı
  kapsam dışı):**

| Cron | Betik | Commit? | `git add` biçimi (önce → sonra) |
|---|---|---|---|
| 15:05 günlük | baraj-gunluk.sh | evet | `data/arsiv/baraj` (dizin) → gün dizini `data/arsiv/baraj/<TR günü>` + durum.json + canli/baraj.json + UYARI-BARAJ.md |
| Pzt 02:40 | grace-guncelle.sh | yalnız yeni GSFC sürümünde | açık liste (değişmedi); **hata yolu kilitsiz/pull'suz commit+push** → kilit + ata-kontrollü pull |
| 07:00 | saglik-bekcisi.sh | hayır | — |
| 05:45 + 16:15 | su-izleme.sh | evet (her koşum) | **`git add izleme/` (dizinin tamamı)** → açık liste: DURUM.md, OLAYLAR.md, arsiv/, state/*.sha·*.son.txt·*.lastmod, uyari-imza-su-izleme.txt, rg-nobetci-durum.json, nhyp-yayin-durum.json |
| */10 | bellek-log.sh | hayır | — |
| 06:40 + 19:30 + aylık | site-saglik.mjs --tam | yalnız onarım yolunda (üretimde hiç koşmadı) | **`git add -A public/ izleme/`** → `git add -- public/_headers public/_redirects`; satır içi pull → ata-kontrol |
| Sal 04:20 | rg-nobetci.py | hayır (çıktısını su-izleme taşır) | — |
| Çar 04:40 | nhyp-yayin-nobetci.py | hayır | — |
| 02:10 | yedek-al.sh | hayır (bundle, aynı kilit) | — |
| 6×/gün | indexnow-bildir.mjs | hayır | — |
| Çar 10:30 | gsc-haftalik.sh | hayır (depo dışına yazar) | — |

  `git add .`, çıplak `-A`, `commit -a` hiçbir betikte yoktu; kusur iki
  dizin-deseni + bir `-A`. Kanıt (süpürme vakaları): `izleme/su-izleme.sh`
  6 otomatik commit'te (dac501c 26.08, 7a268ef 24.08, 4171891/6243715/bc3aacf/
  b8cb692 21.07), `izleme/kapsam-taban.json` b9b3472, `rg-ara-sertifika.pem`
  7a268ef, geçici `.dsi-duyuru-listesi.tmp.html` 948dcbc/3279ac9.
- **A2b/A2c kök neden ve çözüm:** "pull ertelendi: çalışma ağacı kirli"
  log/pipeline.log'da 68 satır, hepsi su-izleme; baraj cron-hata.log'da 27;
  gerçek rebase çatışması **0/94**. Sebep `git pull --rebase`'in unstaged
  değişiklikte reddi (autoStash kapalı) — oysa uzak ilerlememişse rebase
  gereksiz. `arac/git-kilit.sh` `git_pull_rebase`: `git fetch` +
  `merge-base --is-ancestor @{u} HEAD` → atasıysa pull ATLANIR (ağaca hiç
  dokunulmaz), push fast-forward; yalnız uzak ilerlemişse eski yol.
  `--autostash` bilerek kullanılmadı (kullanıcı dosyasına çatışma işareti
  sızdırabilir). Üç bash cron'u tek fonksiyondan düzeldi; site-saglik'in
  satır içi kopyası ayrıca aynı mantığa çekildi.
- **A2e falsifikasyon (ham çıktı):** ağaçta 7 bekleyen izlenen değişiklik
  (bu fazın kendi düzenlemeleri: git-kilit.sh, su-izleme.sh, site-saglik.mjs,
  kapsam-taban.json…) + yapay `KESIF-POTANSIYEL.md` değişikliği + untracked
  `deneme-kirli-untracked.txt` varken `izleme/su-izleme.sh` elle koşturuldu
  (16:51:18Z, exit 0, 86 sn). Sonuç: commit **ccd90bc** "Su izleme:
  2026-09-08T16-51-18Z" — 13 dosya, hepsi izleme/ altında betiğin kendi
  çıktısı (DURUM.md, OLAYLAR.md, arsiv/rg + 2 hedef arşivi, 4 state
  dosyası); kirli/bekleyen dosyalardan commit'e giren **0**; koşum sonrası
  `git status` 7 M + 2 ?? aynen duruyor; `git fetch` sonrası ahead 0 /
  behind 0 → **push geçti** (eski kod bu ağaçta "pull ertelendi" derdi;
  pipeline.log'da bu koşum için erteleme satırı yok). Yapay dosyalar
  temizlendi (`git checkout -- KESIF-POTANSIYEL.md`, rm).

### A3 — Kalıcı kural
KARARLAR §37'ye "Ölçmeden uygulama yasağı" brief'teki metinle yazıldı;
A1/A2 kararları aynı bölümde.

## FAZ B — §D7 tıklama ölçümü: Pages Function sayacı (c) + Web Analytics (a)

**Doküman kanıtı (keşif ajanı, resmî Cloudflare markdown'ları):** aynı yolda
hem `_redirects` kuralı hem Function varsa **Function kazanır**; `_redirects`
"not applied to requests served by Pages Functions" (pages/configuration/
redirects). `functions/` dizini proje KÖKÜNDE olmalı (dist içinde değil);
`functions/whatsapp.js` → `/whatsapp`, sondaki eğik çizgi isteğe bağlı
(`[[path]]` gerekmez). KV'de atomik artış YOK (aynı anahtara 1 yazma/sn,
eventual consistency) → her tıklama ayrı anahtar, okuma `list({prefix})`.
Ücretsiz kota: Functions 100.000 istek/gün; KV 1.000 yazma + 1.000 list/gün.
`_headers` Function yanıtına uygulanmaz → HSTS/Cache-Control kodda.

**B1 — `functions/whatsapp.js` (68 satır):** `onRequest(context)`; sayım
yalnız `sec-fetch-dest: document` ya da aynı-köken Referer taşıyan GET'lerde
(sağlık betiği/bot sayılmaz — Node 22 fetch başlıklarında ikisi de yok,
ölçüldü); anahtar `t:<TR günü>:<ms>-<8 rastgele>`, değer boş, TTL 400 gün;
**IP/UA/Referer değeri saklanmaz, çerez yok.** `context.waitUntil` ile yazım
yanıtı bekletmez; her hata yutulur; **302 koşulsuz** (`Location`,
`Cache-Control: no-store`, HSTS, `X-Kaynak: fn`). `WA_HEDEF` ortam
değişkeniyle hedef ezilebilir. `_redirects` satırları YEDEK olarak kaldı
(kota bitince "Fail open", yerel dist-sun, sağlık onarımı) — yorumu
güncellendi; numara artık `_redirects` + Function (+ Faz C JSON-LD).
Sıra ölçümü (B1 son madde) deploy sonrası canlı `X-Kaynak` başlığıyla (§B
canlı bölümü).

**B2 — KV bağlaması (KULLANICI ADIMI):** karar dosyası §D7'de adım adım
(namespace adı `suharitasi-wa-sayac`, değişken adı `WA_SAYAC`, Production +
Preview, ardından yeniden deploy).

**B3 — okuma yolu:** `GET /whatsapp/?sayac=<SAYAC_ANAHTAR>` → JSON
`{gunler:{"YYYY-MM-DD":n}, toplam, okuma}`; anahtar yok/yanlış → normal 302
(sızıntı yok). Tek komut: `arac/whatsapp-sayac.sh` (`--ozet` ile tek satır),
anahtarı `.env` `WA_SAYAC_ANAHTAR`'dan okur (bu koşumda üretildi; değer rapora
girmez). Panelde `SAYAC_ANAHTAR` secret'ı aynı değerle tanımlanana kadar
betik "SAYAÇ HENÜZ KURULMADI" der (302'yi ayırt eder).

**B4 — Web Analytics (KULLANICI ADIMI):** doküman: Workers & Pages → proje →
**Metrics → Enable** (Web Analytics); beacon bir sonraki deploy'da otomatik
enjekte edilir. Kod tarafı: CSP `script-src static.cloudflareinsights.com` +
`connect-src 'self' cloudflareinsights.com` zaten yeterli; `Cache-Control:
public, no-transform` (enjeksiyonu engeller) `_headers`'ta yok → kod
değişikliği GEREKMEDİ.

**B5 — falsifikasyon (KV yokken):** `node arac/test/whatsapp-fn.test.mjs`
(Node 22 Request/Response, Workers taklidi yok) **13/13 geçti**: env boş →
302 + Location + X-Kaynak; env undefined → 302; KV `put` reddediyor → 302;
KV senkron fırlatıyor → 302; gezinme isteği 1 put (anahtar biçimi, TTL,
IP/UA yok); Node-fetch benzeri başlıksız istek / yabancı Referer / HEAD
sayılmaz (1/4); okuma yolu doğru anahtar → JSON (gün→sayı, cursor
sayfalama), yanlış/tanımsız anahtar → 302. Canlı kanıt aşağıda.

**Süreklilik:** `izleme/beklenen-301.json` `/whatsapp` kurallarına
`beklenenBaslik: {x-kaynak: fn}`; md3 artık yönlendirme çalışıp başlık
yoksa SARI verir ("Function devre dışı, _redirects yedeği servis ediyor —
sayaç saymıyor"); yönlendirme kopması yine KIRMIZI.

### Faz B — canlı ölçüm (deploy c78be94, 16:59Z)
- `/whatsapp/` ve `/whatsapp` → **302 + `x-kaynak: fn`** + `cache-control:
  no-store` + HSTS → isteği Function karşılıyor; `_redirects` bu yola
  uygulanmıyor (doküman + ölçüm uyumlu). Statik sayfada (`/havzalar/gediz/`)
  `x-kaynak` yok → Function yalnız /whatsapp'ta çağrılıyor (statik istekler
  ücretsiz sınıfta kalır). `_routes.json` elle yazmak gerekmedi.
- **B5 canlı:** KV bağlı değilken `/whatsapp/?sayac=<anahtar>` → 302 (JSON
  yok, sızıntı yok); düğme yolu çalışıyor. `arac/whatsapp-sayac.sh --ozet` →
  "SAYAÇ HENÜZ KURULMADI … KV bağlaması (WA_SAYAC) ya da SAYAC_ANAHTAR
  secret'ı panelde eksik" (exit 3) — kullanıcı KV'yi bağlamayı unutursa düğme
  kırılmaz, betik durumu söyler.

## FAZ C — §D6 şema telefon alanı (KULLANICI KARARI: eklenecek)
- C1: `Sayfa.astro` `kurum` (Organization #kurum), `index.astro` ve
  `harita.astro` Organization kopyalarına `telephone: '+90 532 449 71 44'`.
  C2: yeni düğüm yok; LegalService eklenmedi.
- C3 doğrulama: `telephone` schema.org `Organization` özelliğidir (Thing →
  Organization.telephone, Text). Build sonrası 523 HTML'in JSON-LD'si
  ayrıştırıldı: **geçersiz 0**; Faz C öncesi/sonrası JSON-LD farkı yalnız
  `"telephone"` alanı; alan **520 sayfada** (`404.html`, `harita-pilot`,
  `stil-pilot` Organization düğümü taşımıyor — 404 ve iki noindex pilot).
- **C4 açık beyan:** numara artık 520 sayfanın kaynağında JSON-LD içinde
  görünür (`view-source`da okunur); görünür metinde ve `href`'te yok.
  D4'ün bot-koruma amacı bilinçli olarak bilgi paneli/LocalBusiness
  sinyaline tercih edildi (kullanıcı kararı). Numaranın üç yeri: JSON-LD ·
  `functions/whatsapp.js` HEDEF · `public/_redirects` yedek.
- Görünür çıktı koruması: C düzenlemeleri stash'lenip HEAD build'i alındı
  (`cikti/dist-once3`), geri alınıp yeniden build → **523/523 görünür metin
  bit-eşit**, sitemap 519/519.
