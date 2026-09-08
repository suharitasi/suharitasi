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

## FAZ D — §A akademik künyeler: alaka süzgeci (KULLANICI KARARI: seçenek 3)

**D2 ölçüt (tekrar üretilebilir; `src/data/akademik-suzgec.js`):** başlık +
dergi adı yerel-bağımsız normalize edilir (İ/I→i, küçük harf, ı→i, NFKD
aksan atma, [a-z0-9] dışı → boşluk) ve SU-TERİMİ sözlüğünden en az biri
kelime sınırında eşleşirse künye basılır. Sözlük iki kaynaktan türetildi:
(a) toplama betiğinin sorgu terimleri (`arac/akademik-kunye.py:91` "yeraltı
suyu", "hidrojeoloji"); "potansiyel" ve çıplak "yeraltı" veride konu dışı
eşleştiği için (ısı pompası/turizm potansiyeli; yeraltı çarşısı/madenciliği)
ALINMADI; (b) hidroloji-hidrojeoloji alan sözlüğü: su kökü (yalnız Türkçe
çekim ekleriyle — suyu/suları/sular/suya/sulu/susuz; sunum/suç/sultan/Şubat/
sürdürülebilir eşleşmez) ve bileşikleri (yeraltısuyu, atıksu, içmesuyu,
akarsu), hidro-/hydro- (hidroterapi/hidrokarbon/hidrojen hariç), water,
akifer/aquifer, kuyu, havza/basin, sulama/sulak/irrigation, yağış/yağmur/
precipitation/rainfall, kurak/drought, baraj/dam, göl/lake, akarsu/nehir/
çay/dere/river/stream/spring/şelale/çağlayan, taşkın/sel/flood, jeotermal/
geothermal, karst, kaplıca, drenaj/drainage. Veriyle ELENEN adaylar (tek
başına eşleşmeleri konu dışıydı): jeoloji (66 ayrıcalıklı eşleşme: cevher,
jeoteknik zemin), iklim (49), kaynak ("afet kaynaklı"), kirlilik, sondaj,
sediman, deniz ("Denizli"), ova, çıplak termal. Ek şartlar: DOI/URL var
(önceden vardı) + başlık boş değil (1 kayıt: Aksaray W4255776210 başlıksız).
Süzgeç yalnız basım katmanında; `veri/potansiyel/akademik-kunye.json`
DEĞİŞMEDİ. Sınır sözcük testi 76/76 (arac/test/akademik-suzgec.test.mjs).
Python paritesi: aynı regex + normalizasyonla 1.118 / 861 / 494 — node ile
birebir.

**D3 gerçek sayılar:** 1.979 künye → **1.118 kalan / 861 elenen (%43,5)**;
farklı yazar adı **777 → 494** (sitede ilk-3 kuralıyla görünen 440);
farklı openalex_id 509 → 309. Beklenti ~1.282 / ~500 idi: ad tutuyor,
künye beklenenin altında — 08.09 karar dosyasındaki 697 sayısı jeoloji ve
iklim terimlerini "su terimi" saymıştı (V1+jeoloj+iklim = 1.271); bu iki
terimin tek başına eşleşmeleri veride konu dışı olduğundan dışarıda tutuldu.
İl başına kalan min 1 / maks 39.

**Kanıt örnekleri (seed 8; tam çıktı `cikti/d2-suzgec-node.txt`):**
- Elenen 10: Beşyol zemin incelemesi (jeoteknik) · Afetler ve Çevre Sağlığı
  · Peyzaj karakter alanları · "Sur le climat de la plaine de Bafra" ·
  başlıksız Aksaray kaydı · dijitalleşme ve vergilendirme · afetlerde aile
  hekimliği · toprak kirliliği zenginleştirme faktörleri · 1955 Jeoloji
  Kongresi tutanağı · CBS çalıştayı raporu → 10/10 doğru eleme.
- Kalan 10: Çivril-Baklan yeraltısuyuna iklim etkisi · Water-Food Nexus ·
  Denizli groundwater levels · Kahramanmaraş sel ve taşkınları · Van
  Havzası mera toprak kalitesi (zayıf) · Seyfe Gölü sulak alanı · Konya
  Ovası yeraltı suyu · Bolluk-Tersakan Gölleri InSAR · Türkiye jeotermal
  enerji · Trakya su kaynakları → 9 su konulu, 1 zayıf.
- Sınır/elenen 10 (geniş yer-bilimi terimi taşıyan): Bozdağ iklimi,
  yeraltı yapıları sismik analizi, Bafra Ovası iklimi, Ekinözü jeolojik
  özellikleri, Erzincan çevre jeolojisi, deprem parkları, planlamada
  jeolojik eşik, Thornthwaite iklim tipleri (tek tartışmalı), demir
  cevherleşmesi, deprem hasar riski → 9/10 doğru eleme, 1 sınırda.
- Sınır/kalan 10 (tek zayıf terim): karst jeomorfolojisi, İznik Gölü ağır
  metal, akifer DNAPL, Harran yeraltı suyu kirliliği, Bakırçay Havzası
  arazi kullanımı (zayıf), Ilıca Kaplıcaları termal turizm (zayıf),
  Korkuteli su kalitesi, Aşağı Seyhan yeraltı/yüzey suları, Aksu River
  flow, katı atık depolama–water → 8 ilgili, 2 zayıf. Kuralla ayıklanamayan
  kabul edilmiş kalıntı.

**D4 boş bölüm:** süzgeç sonrası künyesi kalmayan **3 il (Adıyaman, Karabük,
Şırnak)**: akademik `<details>` bloğu hiç basılmıyor (mevcut koşul), boş
başlık yok; sessiz kaybolma olmasın diye "Kaynak künyeleri" listesinde tek
satır: "Akademik yayın künyeleri: su konulu açık erişim yayın bulunamadı
(2 künye alaka süzgecinde elendi)". Diğer 78 ilde `<summary>` elenen sayıyı
açıkça yazar ("Açık erişim akademik yayınlar (8; 22 künye su konusu dışı
olduğu için basılmadı)"). Dist ölçümü: 78 sayfada bölüm var, basılan künye
toplamı **1.118**, summary'lerde elenen toplamı 855 (+ 3 ilin 6'sı = 861).
"İbrahim Furkan Sarkım" artık 0 sayfada (künyesi konu dışı sınıfındaydı).

**Tutarlılık düzeltmeleri (yan bulgu, ölçülen):** site geneli sayaçlar
hâlâ "1.979 açık erişim yayın (81 il)" diyordu (`kapi.js`, `vitrin.js`,
`kullanilanlar.js`) — süzgeç sonrası yanlış iddia olurdu → "1.118 su konulu
açık erişim yayın (78 il; 1.979 toplanan, alaka süzgeci)" biçimine çekildi
(/nerede-su-cikar/, /kullanilanlar/, /arsiv/ Dataset şeması). OpenAlex
başlıklarındaki HTML varlık kalıntısı (58 başlıkta `&amp;#039;`, `&quot;`…)
harfiyen basılıyordu → basım katmanında çözüldü (yeni metin yok).

**D5:** seçenek 2 (yazar adını düşürme) karar dosyasında KULLANICI KALEMİ
olarak duruyor (kalan 494 ad, KVKK m.28 değerlendirmesi hukukçunun).

**D6 doğrulama:** build 522 sayfa / sitemap 519 (küme-eş); Faz C build'i
(`cikti/dist-once4`) ile kıyas: görünür metin değişen 83 sayfa = 80 il
sayfası + /nerede-su-cikar/ + /kullanilanlar/ + /arsiv/ (sayaç cümleleri);
kalan **440 sayfa bit-eşit**. Bir il sayfası (elenen 0 olan) değişmedi.

## FAZ E — §B OSM tip ↔ ad çelişkisi

**E1 yaygınlık (247 Türkiye-kapsamlı göl kaydı; `cikti/e-dogrulama.json`):**
adında "baraj" geçip tür ≠ reservoir **25** (lake 22 + tür alanı yok 3:
Keban/Atatürk/Karakaya — Natural Earth kayıtlarında `tip` yok) · adında
"gölet" geçip tür = lake **18** · adında "gölet" geçip tür = reservoir 49
(adlandırma farkı: ikisi de yapay; DSİ'nin kendisi 12 "Göleti"ni "Barajı"
diye listeliyor — çelişki sayılmadı) · lagün adlı ≠ lagoon **1** (Hersek) ·
jenerik ad 2 ("Baraj Gölü"/Karaman, "Gölet"/Edirne — tesis belirsiz). Kök
bulgu: `arac/fetch_hydro.py:196` OSM'de `water=*` etiketi olmayan yolları
`lake` yazıyor → "tip: lake" = "OSM doğal göl diyor" DEĞİL; ham Overpass
yanıtı depoda yok, ayrıştırılamaz. Nehirlerde tip alanı yok (çelişki
tanımsız).

**E2/E3 çözüm — yerel liste + kural tabanlı şerh, kaynak JSON değişmedi:**
`src/data/gol-tip-duzeltme.js` (**39 kayıt**) yalnız depo içi kaynakla
doğrulananları taşır: DSİ 2024 4.1 (yapımı tamamlanan barajlar) / 4.6
(göletler) tablolarında **il + öz-ad birebir** eşleşen satır (ilçe adı
çakışması SAYILMADI — ör. "Erzurum-Şenkaya Sarıyar Barajı" Şenkaya Göleti'ni
doğrulamaz) ya da EPİAŞ Şeffaflık baraj listesi (`data/canli/baraj.json`:
EŞEN 1, ALADEREÇAM, BALKUSAN). Tür kuralı: 4.1 → reservoir, 4.6 → pond,
EPİAŞ → reservoir. Doğrulama iki bağımsız yolla: keşif ajanının BIFF8
satır ayrıştırması + bu oturumda `xls` dosyalarında UTF-16LE/cp1254 dize
çıkarımı ve ham bayt bağlam araması (ör. "Malatya-Polat Barajı",
"Şırnak-İdil Dirsekli Göleti", "Burdur-Karamanlı Barajı" satırları
görüldü). Örnek: Keban (tür yok → reservoir, "Elazığ-Keban Barajı"),
Kale Göleti (reservoir → pond, "Bingöl-Karlıova Kale Göleti"), Altınoluk
Baraj Gölü (lake → pond, "Sivas-Yıldızeli Altınoluk Göleti" — ajanın
"doğrulanmadı" dediği kayıt bu oturumda bulundu).
`gol-nehir.js`: `tipCeliskisi()` (kural), `golTurSerhi()` (Tür satırı
metni), `insaEt()` alanları `tip` (düzeltilmiş), `tip_kaynakta`,
`tip_duzeltme`, `tip_celiski`; `golTipi()` doğrulanamayan çelişkide yanlış
sınıf BASMAZ → "bir su kütlesidir (tür kaynakta çelişkili, doğrulanmadı)".
Şema: düzeltilen kayıtlarda `additionalProperty` "Tür kaynağı".

**E4 şerh yolu (dist ölçümü):** 247 göl sayfasında yerel düzeltme şerhi
**39**, kaynak çelişkisi şerhi **18** (Karakaya — DSİ ili Diyarbakır, site
ili Malatya: KISMİ; Kültepe Aksaray↔Kırşehir; Bayburt/Kars, Gülüç, Hersek,
Yüzüncü Yıl, Belevi, Kutlu Aktaş, Çağsere, Değirmi, Soğulca, Akbenli,
Kıranköy, İğdeli, Çerkezmüsellim, Şenkaya, İkizce + jenerik "Baraj Gölü"),
jenerik-ad şerhi 1; **baraj adlı sayfada "bir doğal göldür" ifadesi 0**
(önce 22). Örnek: /goller/baraj-golu/ → "Baraj Gölü, Karaman ili
sınırlarında bir su kütlesidir (tür kaynakta çelişkili, doğrulanmadı)…";
Tür satırı: "kaynak çelişkisi: ad 'baraj gölü' diyor, kaynakta 'lake'
olarak kayıtlı ya da etiketsiz (OSM); depo içi DSİ/EPİAŞ listelerinde il +
ad eşleşmesi bulunamadı — doğrulanmadı (08.09.2026); kaynak yalnız jenerik
ad veriyor…". Yan etki: C6b kamulaştırma köprüsü düzeltilmiş türü görür →
158 baraj gölü sayfası (önce 150; Keban, Atatürk dahil). Ada-kalmaz:
/kullanilanlar/ cümlesi "39 göl kaydında tür … yerelde düzeltildi, 18
kayıtta … çelişkisi şerhli"; KAYNAKLAR.md OSM bloğuna tür şerhi.
Doğrulama: build 522/519; Faz D build'i (`cikti/dist-once5`) ile kıyas
görünür metin değişen **58** = 57 göl + /kullanilanlar/; **465 sayfa
bit-eşit**; JSON-LD geçersiz 0.
