# SİTE DURUM DENETİMİ + DIŞ FAYDA KAZISI — 2026-08-24

Brief: `cikti/brief/20260824-191806Z-site-durum-kazi.md` (orijinal) +
`-duzeltilmis.md` (ekleme-yalnız düzeltme) · **BÜYÜK İŞ** · Salt-okunur +
rapor — site koduna dokunulmadı, hiçbir öneri uygulanmadı, hiçbir dış araç
kurulmadı. Kanıt kareleri: `cikti/denetim/durum-kazi/`.
Etiketler: **[VERİ]** ölçüldü · **[YÖNTEM]** okunan kaynaktan aktarım ·
**[VARSAYIM]** yorum/çıkarım. Doğrulanamayan **"doğrulanmadı"**, kayıtta
bulunamayan **"kayıtta yok"** olarak işaretlidir.

> **KULLANICIDAN BEKLENEN EK GİRDİ (beklenmedi, not düşüldü):** GSC
> Performans ekranı görüntüsü — hangi sorgular, hangi sayfalar,
> tıklama/gösterim. Gelirse sentezdeki sorgu-sayfa eşlemesi bu veriyle
> güncellenir. Bu rapor kullanıcı beyanı "~70 gösterim" ile yetinmiştir.

## 0. Brief ön kapısı (zorunlu ilk bölüm)

**Denetim:** ilk koşu **2 ENGEL** (T5 commit kuralı anılmamış, T7 hukuk
kapısı — "ceza" tetikleyicisi) + 3 UYARI → ekleme-yalnız düzeltme turu 1'de
T5/T7 kapandı, T1 yanlış-pozitifi ("rapor/denetim" sözü yol sanıldı) turu
2'de netleştirildi → **ENGEL 0, 2 UYARI**. Kalan UYARI'lar: T1 `llms.txt`
bağlamı — ikisi de ÜRETİM ÇIKTISI (canlı `https://suharitasi.com/llms.txt`)
kastıdır, düzeltme ekinde açıklandı; engel değil.
Denetçi raporları: `cikti/denetim/brief/2026-08-24T19-18-*.md`.

**Amaç özeti (3b):** Amaç = sitenin bugünkü çalışır/eksik/geliştirilebilir
fotoğrafı + dış fayda aday listesiyle kullanıcının karar verebileceği tek
rapor. Dokunulmazlar = site kodu, veri, yayın zinciri, izleme state'leri,
Caddy/cron. Bitti-tanımı = A0-A4 + B4 + C1-C3 + sentez bölümleri, her
bulgu etiketli ve kanıt referanslı; kareler diskte. Kanıtlar = canlı
ölçümler (curl/Playwright), state/log dosyaları, ajan araştırma çıktıları
(kaynak URL + tarih).

**Düşman geçişi (D1-D4):**
- **D1 çelişki:** (i) "salt-okunur" vs proje commit+push kuralı → commit
  yalnız rapor + kanıt kareleri + brief dosyaları; site koduna sıfır dokunuş
  (`git status` kanıtı sentez sonunda). (ii) Brief "--tam sağlık koşusu"
  ister; kendi koşumumu başlatmak 19:30 UTC cron koşusuyla TEK-KOŞUM
  KİLİDİNDE çarpışacak ve cron'un Lighthouse ölçümünü kirletecekti → çözüm:
  19:30 cron koşusunun sonucu "güncel --tam sonucu" olarak alındı; tarayıcı
  ölçümleri cron bitene kadar bekletildi (kirletme önlendi).
- **D2 geçilemeyecek test:** B4'te `site:` operatörünü arama aracı
  desteklemiyor → "indekslenmemiş" ÇIKARIMI YAPILMADI, şerhle raporlandı.
  Cloudflare katmanında AI-bot engeli buradan ölçülemez → "doğrulanmadı".
- **D3 boş referans:** Brief'teki "uçuşan sorular" = ana sayfa `.v2-sorular`
  soru şeridi; "il seçici" = `/ilimde-kim-yetkili/` `#il-secim` +
  `/nerede-su-cikar/` il ızgarası; "bekletilen 6 satış kalemi" =
  SIRADAKILER "BEKLETİLEN PAKET"teki 6 kalem — üçü de diskten doğrulandı.
- **D4 etiket ayrımı:** ölçülen [VERİ], aktarılan [YÖNTEM], yorum
  [VARSAYIM]; hüküm yazılmadı ("ruhsatsız kuyu cezası" yalnız sorgu olarak
  ölçüldü).

**Çalışma dizini şerhi [VERİ]:** Oturum `/var/www/arslanhukuk.tr` kökünde
açıldı; brief'in tüm referansları (`rapor/`, `cikti/denetim/`, SIRADAKILER,
23 kalem, `/kapatma-kaydi/` …) yalnız `/home/suha/projeler/suharitasi`
içinde çözüldü ve iş orada yürütüldü. arslanhukuk.tr deposuna hiçbir yazma
yapılmadı.

---

## B4 · GÖRÜNÜRLÜK KARŞILAŞTIRMASI [VERİ, sınırlı]

**ŞERH (zorunlu) [YÖNTEM]:** Tüm sorgular Claude Code WebSearch aracıyla
ölçüldü — ABD merkezli, kişiselleştirilmemiş, Google SERP'in birebir
kopyası DEĞİL (hangi indeksi kullandığı doğrulanmadı). Mutlak sıralama
değil, görünürlük fotoğrafıdır; Türkiye konumlu gerçek Google ölçümü ve
GSC sorgu raporu bunun yerini tutar. Tüm aramalar 2026-08-24.

**Ek sorgu seçimi [YÖNTEM]:** `rapor/sorgu-haritasi.md` aday havuzundan,
sitede birebir/yakın sayfası olanlara öncelikle 6 sorgu seçildi:
"kuyu ruhsatı nasıl alınır" (birebir: /rehberler/kuyu-ruhsati/),
"DSİ idari para cezasına itiraz" (/rehberler/ruhsatsiz-kuyu-cezalari/),
"yeraltı suyu işletme sahası ilanı ne demek", "su hukuku avukatı",
"su verimliliği belgesi kimler almak zorunda", "kaynak suyu kiralama
ihalesi".

| # | Sorgu | suharitasi görünür mü | Önündekiler (kategori) | Eşleşen sayfa |
|---|---|---|---|---|
| 1 | kuyu ruhsatı | **Görünmüyor (bu araçta)** | tamamı sondaj/mühendislik firması (kuyuruhsati.wixsite, efesondaj, geomekanik, kuyuruhsati.net…) | /rehberler/kuyu-ruhsati/ |
| 2 | ruhsatsız kuyu cezası | **Görünmüyor (bu araçta)** | sondaj firması blogları (ssma ×2, simseksondaj, uzaysondaj…) + ziraat danışmanlık + emlak portalı | /rehberler/ruhsatsiz-kuyu-cezalari/ |
| 3 | nerede su çıkar | **Görünmüyor (bu araçta)** | karışık niyet: vakıf, dergi, arıtma/sondaj firmaları, 2 hastane ("kulağa su kaçması") | /nerede-su-cikar/ |
| 4 | su tahsisi | **Görünmüyor (bu araçta)** | haber, **resmigazete.gov.tr** (Su Tahsisleri Yönetmeliği), FAO ×2, sosyal medya gürültüsü | /rehberler/su-tahsisinde-oncelik-sirasi/ |
| 5 | kuyu ruhsatı nasıl alınır | **Görünmüyor (bu araçta)** | tamamı sondaj/pompa firması blogu; üç firma aynı "2026 DSİ Başvuru Rehberi" başlık kalıbında | /rehberler/kuyu-ruhsati/ |
| 6 | DSİ idari para cezasına itiraz | **Görünmüyor (bu araçta)** | pwc, **anayasa.gov.tr**, 4 hukuk bürosu, meslek odası — DSİ'ye özgü içerik YOK | /rehberler/ruhsatsiz-kuyu-cezalari/ |
| 7 | yeraltı suyu işletme sahası ilanı ne demek | **Görünmüyor (bu araçta)** | jmo.org.tr, **mevzuat.gov.tr**, lexpera, **tarimorman.gov.tr** PDF, 4 yerel haber | (birebir sayfa kayıtta yok) |
| 8 | su hukuku avukatı | **Görünmüyor (bu araçta)** | "Su" adlı/soyadlı genel bürolar + alakasız branş sayfaları — gerçek su hukuku uzmanı sonucu YOK | (hizmet sayfası yok) |
| 9 | su verimliliği belgesi kimler almak zorunda | **Görünmüyor (bu araçta)** | **suverimliligi.gov.tr** ×2 + 6 çevre/ISO danışmanlık firması | (sayfa yok — sorgu-haritasi "öneri") |
| 10 | kaynak suyu kiralama ihalesi | **Görünmüyor (bu araçta)** | 7 yerel/ulusal haber + **csb.gov.tr** PDF | /rehberler/kaynak-suyu-kiralama/ |

**İndeks fotoğrafı [VERİ]:** `site:` operatörü bu araçta çalışmıyor
(çıkarım yapılmadı). Marka sorgusu "suharitasi" boş; alan-kısıtlı aramada
siteden dönen TEK sayfa `/havzalar/meric-ergene/` (6. sıra, "suharitasi.com
su haritası Türkiye" sorgusunda). Bu araçta derin sayfa görünürlüğü fiilen
sıfır — GSC ~70 gösterim/ay beyanıyla tutarlı, ama Google'ın gerçek durumu
buradan doğrulanamaz.

**Sentez [VERİ+VARSAYIM]:** Kuyu sorgu ailesini ticari, güncel-yıl damgalı,
şablonlaşmış sondaj-firması blogları domine ediyor; hukuk-niyetli
sorgularda alan resmî kaynaklar + genel hukuk bürolarında ve DSİ'ye özgü
itiraz içeriği üreten YOK [VERİ]. "Su hukuku avukatı" sorgusu isim
karmaşasına terk edilmiş — düşük rekabetli kimlik fırsatı [VARSAYIM].
Kaynaklar: efesondaj.com.tr · kuyuustasi.com · ssma.com.tr ·
resmigazete.gov.tr · mevzuat.gov.tr · anayasa.gov.tr · suverimliligi.gov.tr
· tarimorman.gov.tr (tümü 2026-08-24 erişimli).

---

## C · DIŞ FAYDA KAZISI [YÖNTEM — salt-okunur aday listesi]

Kurulum/çalıştırma YAPILMADI; her satır satın alma/kurulum KARARI için
aday maddesidir, kurulum ayrı karar ve ayrı brief'tir. Mükerrerlik tabanı:
23 sağlık kalemi + kurulu 9 pazarlama skill'i + emil/superpowers setleri +
mevcut arac/ pipeline'ları. Tüm erişimler 2026-08-24; kaynak URL'ler her
kalemde. Araştırma üç paralel ajanla yürütüldü; iddialar ajanların okuduğu
sayfalardan aktarımdır [YÖNTEM].

### C1 · GitHub derin kazı — adaylar

| Aday | Ne işe yarar / somut karşılık | Yük | Lisans | Güncellik | Durum |
|---|---|---|---|---|---|
| **Upptime** github.com/upptime/upptime | GitHub Actions+Pages ile sunucusuz uptime izleme + durum sayfası — SIRADAKILER 7 "GitHub Actions dış nabzı" kalemini hazır kapatır | küçük (tek YAML) | MIT | push 2026-08-24, 17k★ | **YENİ ADAY (dayanıklılık)** |
| **Litestream** github.com/benbjohnson/litestream | Pipeline SQLite'ının R2/S3'e sürekli akan yedeği — "makine dışı yedek" (KULLANICI KARARI 4) boşluğunun SQLite ayağı | küçük (tek binary+systemd) | Apache-2.0 | push 2026-08-21, 14k★ | **YENİ ADAY (dayanıklılık)** |
| **restic** github.com/restic/restic | Şifreli, tekilleştirmeli genel VPS yedeği (R2/B2/SFTP) — Litestream'i dosya tarafında tamamlar | küçük | BSD-2 | push 2026-08-01, 35k★ | **YENİ ADAY (dayanıklılık)** |
| **indexnow-action** github.com/bojieyang/indexnow-action | Sitemap'ten IndexNow ile Bing/Yandex'e URL bildirimi — dağıtım/indeks boşluğuna tek adım (Google IndexNow KULLANMAZ; etkisi Bing/Yandex sınırlı) | küçük | MIT | push 2026-08-10 | **YENİ ADAY (dağıtım)** |
| **astro-slop** github.com/yaroslav/astro-slop | Sayfa başına .md kardeş çıktı + content negotiation — GEO/AI-okunurluk katmanı. NOT: llms.txt sitede ZATEN VAR (592 URL, canlı ölçüldü); yeni olan sayfa-başına-Markdown kısmı | küçük | MIT | push 2026-05-11, 12★ genç | **KISMEN ÇAKIŞIR / dağıtım** |
| **Pagefind** github.com/Pagefind/pagefind | Statik site içi arama (WASM, sunucusuz) — sitede arama YOK | küçük | MIT | push 2026-08-20, 5,4k★ | **YENİ ÖZELLİK → ilke gereği kuyruğa** |
| **yargi-mcp** github.com/saidsurucu/yargi-mcp | 16 TR hukuk kaynağında (Yargıtay, Danıştay, AYM, Emsal…) arama MCP'si — içtihat ATIF TEYİDİ (hüküm yazmaz; mutfak aracı, AY ile uyumlu) | küçük-orta (uvx) | MIT | push 2026-08-06, 1,1k★ | **YENİ ADAY (mutfak)** |
| **mevzuat-mcp** github.com/saidsurucu/mevzuat-mcp | mevzuat.gov.tr madde-düzeyi erişim MCP'si — mevzuat atfı doğrulama | küçük-orta | MIT | push 2026-06-18 | **YENİ ADAY (mutfak)** |
| **mevzuat-gov-scraper** github.com/muhammetakkurtt/mevzuat-gov-scraper | Kanun metni+RG çıkarımı (Scrapy/Selenium) — mevcut RG nöbetçisine yöntem referansı | orta | MIT | push 2025-11 | KISMEN ÇAKIŞIR |
| **GoatCounter** github.com/arp242/goatcounter | Hafif self-host analitik — ÇALIŞAN CF Web Analytics ile çakışır; lisans EUPL/copyleft (tam metin doğrulanmadı) | küçük | EUPL? doğrulanmadı | push 2026-08-21 | **MEVCUTLA ÇAKIŞIR** |
| astro-seo (jonasmerlin) | SEO etiket ÜRETİM bileşeni — sayfalar zaten etiket taşıyor | küçük | MIT | push 2026-01 | KISMEN ÇAKIŞIR |
| pa11y · BackstopJS · Lost Pixel · Gatus | a11y/görsel-regresyon/izleme — sağlık sistemi kalemleriyle birebir çakışır (BackstopJS ayrıca bakımsız: push 2024-09) | — | LGPL/MIT | — | **ZATEN VAR** |
| kandilli-rasathanesi-api | Deprem/jeoloji verisi — yeni içerik alanı + **ticari kullanım Boğaziçi yazılı izni ister** | orta | özel (kısıt) | aktif | YENİ ÖZELLİK → kuyruğa + lisans riski |
| tr-geojson (cihadturhan) | İl sınırları GeoJSON — bakımsız (2022), lisans doğrulanmadı; projede OSM türevi kural zaten var (KARARLAR §2) | — | doğrulanmadı | bakımsız | ELENDİ |
| casoon/astro-site-files | sitemap+robots+llms tek entegrasyon — **Astro ≥6 ister, mevcut Astro 5 ile uyumsuz** | — | MIT | 2026-06 | UYUMSUZ |
| RG scraper depoları (14 adet tarandı) | tümü 0-2★ hobi — mevcut RG nöbetçisi daha olgun | — | — | — | ZATEN VAR |

### C2 · Ürün taraması — satın alma karar maddeleri

| Aday | Ne işe yarar | Fiyat | Durum |
|---|---|---|---|
| **Otterly.ai** otterly.ai/pricing | ChatGPT/AI Overviews/Perplexity'de marka-atıf izleme | **Lite 29$/ay, Standard 189$/ay — resmî sayfadan DOĞRULANDI (2026-08-24)** | YENİ ADAY (dağıtım) — önce Knowatoa ücretsiz katmanıyla Türkçe sorgu testi |
| **Knowatoa** knowatoa.com | 7 AI platformunda soru takibi | 0$ katman (10 soru); 99$/ay **doğrulanmadı** | YENİ ADAY — sıfır maliyetli ilk adım |
| Wincher / Mangools | Klasik sıralama takibi | ~29$/ay **doğrulanmadı** | KOŞULLU: GSC kurulup 3 ay veri birikmeden ALINMAZ (sıra hatası) |
| **wa.me derin bağlantısı** | Tıkla→WhatsApp; JS'siz, backend'siz | 0 TL | YENİ ADAY — bekletilen WhatsApp satış katmanının 0-maliyet ilk halkası; mailto KARARINI (KARARLAR §10) bozmaz, ek kanaldır |
| Web3Forms / Formspree | Statik form servisi | 0$ katmanlı; rakamlar **doğrulanmadı** | **MEVCUT KARARLA ÇAKIŞIR** (mailto bilinçli karar) — ancak karar revize edilirse ilk aday Web3Forms |
| Umami / Plausible / Fathom | Analitik | 0-20$/ay **doğrulanmadı** | **MEVCUTLA ÇAKIŞIR** (CF Web Analytics çalışıyor) |
| WhatsApp Business API (BSP) | Şablonlu mesaj/AI bot | TR birim fiyatı **doğrulanmadı** | ERKEN — satış katmanı canlanınca |

### C3 · Skill/MCP taraması

| Aday | Tür | Somut karşılık | Kimlik bilgisi | Durum |
|---|---|---|---|---|
| **yargi-mcp + mevzuat-mcp** (saidsurucu) | MCP | Mevzuat/içtihat atıf teyidi — "doğrulanmış metinden damıtma" ilkesinin kaynak ayağı; hüküm YAZMAZ | istemez (yerel uvx önerilir) | **EN DEĞERLİ ADAY** |
| **cloudflare/mcp (resmî)** github.com/cloudflare/mcp | MCP | GSC beklerken bugün-çalışır analitik okuma (GraphQL Analytics) + önbellek/başlık denetimi | CF OAuth/token — **salt-okunur dar token ŞART** | YENİ ADAY |
| **ahonn/mcp-server-gsc** | MCP | GSC sorgu/sayfa verisini Claude'a okutma | Google servis hesabı JSON | YENİ ADAY — **GSC kalemi kapanınca** (şimdi kurulamaz) |
| veelenga/claude-mermaid | MCP+skill | Sayfalara gömülecek dışa-aktarılmış SVG süreç şeması (tahsis/ruhsat/itiraz akışları) | yok | KISMEN ÇAKIŞIR (artifact-diagramming sayfa-içi değil) — üretimi sayfaya koymak YENİ ÖZELLİK → kuyruğa |
| stevysmith/og-image-skill | skill | OG görsel boru hattı (1200×630 + meta) | yok | KISMEN ÇAKIŞIR (canvas-design estetik, bu boru hattı) |
| TBB reklam yasağı uyum skill'i | — | **BULUNAMADI** (TR+EN arama) — en sağlıklı yol kurulu skill-creator ile TBB Reklam Yönetmeliği'nden YEREL skill yazmak | — | BOŞLUK (aday yok) |
| LanguageTool MCP | MCP | TR desteği YOK (25+ dil listesinde Türkçe yok) | — | ELENDİ |
| googleanalytics/google-analytics-mcp | MCP | GA4 okuma — sitede GA4 yok | — | KOŞULLU/İLGİSİZ |

---

## A1 · ÇALIŞMIYOR MU TARAMASI [VERİ]

### A1.1 Nöbetçi / pipeline son koşumları (state + log'lardan; keşif botu HARİÇ — ayrı teşhiste)

| Bileşen | Son koşum | Durum | Kanıt |
|---|---|---|---|
| **su-izleme / RG-gunluk (M1)** | 2026-08-24T16:15Z | 🔴 **2026-08-06'dan beri 38 ardışık "ağ hatası"** — RG günlük fihristi 18 gündür ÇEKİLEMİYOR | `log/pipeline.log` 107-740 |
| **rg-nobetci (haftalık)** | 2026-08-18 | 🔴 Son 2 koşumda (12+18 Ağu) 3/3 sorgu `SSL: CERTIFICATE_VERIFY_FAILED`, taranan satır 0 (önceki sağlıklı koşum: 109) — işletme sahası ilanı taraması KÖR | `log/rg-nobetci.log`, `izleme/state/rg-nobetci-durum.json` |
| **su-kanunu-taslak-pdf (K4)** | 2026-08-24 | 🔴 HTTP 404 — hedef `tarimorman.gov.tr/SYGM/Belgeler/...Su Kanunu Taslağı.pdf` taşınmış/kaldırılmış (md17'nin 4 ölü dış bağlantısı da aynı `SYGM/Belgeler` ağacında) | `izleme/DURUM.md` |
| su-izleme git adımı | her koşumda | 🟡 `git pull --rebase` "unstaged changes" ile düşüyor; sebep: `veri/potansiyel/isletme-sahalari-yeni.json` 18.08 rg-nobetci koşumundan beri commit'siz (1 satır) — commit'ler yine atılıyor, pull hatası günde 2 kez log kirletiyor | `izleme/log/cron.log`, `git status` |
| nhyp-yayin-nobetci (haftalık) | 2026-08-19 | 🟢 kanal A+B sağlam; eksik_havza 13 (bilinen) | state dosyası |
| baraj günlük çekimi | 2026-08-24 | 🟢 commit atılmış, bekçi "baraj 15s" | git log, `log/bekci-cron.log` |
| GRACE | — | 🟢 ardışıkHata 0, bekçi "grace 0g" | `data/arsiv/grace/durum.json` |
| saglik-bekcisi (günlük) | son 6 gün | 🟢 "sağlık OK" | `log/bekci-cron.log` |
| **Alarm e-postası** | — | 🔴 SMTP değişkenleri boş (`SMTP_HOST/USER/PASS, ALARM_TO`) — yukarıdaki kırmızıların HİÇBİRİ sunucudan dışarı bildirilmiyor (bilinen açık kalem, hâlâ açık) | `izleme/state/site-saglik-durum.json` |

**RG kesintisinin KÖK NEDENİ (ölçüldü) [VERİ]:** `openssl s_client -connect
www.resmigazete.gov.tr:443` → sunucu zincirde YALNIZ leaf sertifika
gönderiyor (`CN=*.tccb.gov.tr`, issuer `GeoTrust TLS RSA CA G1`, zincirdeki
sertifika sayısı = 1) → "unable to get local issuer certificate".
Karşı tarafın (resmigazete.gov.tr) sunucu yapılandırma hatası: ara
sertifika eksik; tarayıcılar AIA ile geçiyor, python/urllib ve curl
(exit 60) düşüyor. Başlangıç 2026-08-06 ≈ sertifika yenileme tarihi
[VARSAYIM]. Düzeltme adayları A4'te — uygulanmadı.

### A1.2 `--tam` sağlık koşusu — GÜNCEL sonuç (23 kalem) [VERİ]

Koşu: **2026-08-24T19:41:31Z**, mod `--tam`, hedef canlı site (19:30 UTC
cron koşusu; bkz. §0 D1 — ayrıca kendi koşum başlatılmadı, kilit/ölçüm
kirliliği önlendi). **GENEL: KIRMIZI — 3 kırmızı · 3 sarı · 16 yeşil.**
Sabah 06:50 koşusuyla aynı tablo (kırmızılar YENİ değil, ÇÖZÜLMEMİŞ).

| Kalem | Durum | Ölçüm |
|---|---|---|
| 13-kontrast | 🔴 | Ana sayfada AA altı: `.v2-cta-ikon` **emoji ikonlar** (🎯 ⚖️) `rgb(0,0,238)` (varsayılan link mavisi) koyu zeminde **1.92:1** (gereken 3) + `.cs-birim` 10.88px etiketler 2.23:1 (gereken 4.5). Not: emoji + varsayılan mavi, DESIGN/BRIEF yasaklarıyla da çelişir [VERİ]; kalem 31.07'den beri kırmızı |
| 14-gorsel | 🔴 | **G6: mobil ilk ekranda dert-sorusu kadraj DIŞI** — "Ruhsatsız kuyu cezası aldım…" alt kenarı 1383px > 812px (S1 nöbeti düşmüş) · G1: /harita/ masaüstünde metin görsel üstünde 8190px² (eşik 2000). Kalem **2026-08-04T19:40 koşusunda** kırmızıya döndü = özellik dalgası günü [VERİ] |
| 17-dis-baglanti | 🔴 | 4 ölü dış bağlantı — tümü `tarimorman.gov.tr/SYGM/Belgeler/…` (404); §A1.1'deki taslak-PDF 404'üyle aynı kök: SYGM belge ağacı taşınmış |
| 16-seo-geo-genis | 🟡 | 199 → **207 bulgu**: meta-desc-uzunluk ×153 · title-uzun ×50 · soru-baslik-yok ×4 (artışın kaynağı [VARSAYIM]: 04.08 göl/nehir şablon sayfaları — bkz. A3) |
| 18-veri-genis | 🟡 | Tabanda olmayan 2 yeni veri dosyası: `ilce-morfoloji.json` (948 ilçe) · `isletme-sahalari-yeni.json` — 04.08 dalgasının izi, taban güncellenmemiş |
| 20-altyapi | 🟡 | `kaynak/dsi-arsiv` (55 MB) uzak kopyası bayat: **42 commit push'lanmamış** (sabah 40'tı — büyüyor) |
| Kalan 16 kalem | 🟢 | sitemap 591 geçerli · 591/591 sayfa 200 · yönlendirmeler 4/4 · medya 6/6 · konsol 11 sayfada 0 · mobil taşma 0 · GEO çekirdek 10/11 tam · iç link kırık 0 · etkileşim 4/4 · dokunma tabanı korunuyor · a11y 11 sayfa 100/100 · Lighthouse (perf/─) / 97 · kuyu-ruhsati 98 · harita 94 · veri bütünlüğü tam · güvenlik başlıkları 6/6 · altın örnek 23/23 |

---

## A3 · EKSİK TARAMASI [VERİ + VARSAYIM ayrımıyla]

### A3.1 Sitemap sayfa tipleri (canlı, 591 URL) [VERİ]

`goller` **279** + `nehirler` **131** (ikisi birlikte sitenin **%69'u**) ·
`kuyu-ruhsati` 82 · `durumum` 43 · `havzalar` 26 · `rehberler` 11 ·
`su-kanunu` 3 · `vaka` 2 · araç/tekil sayfalar: nerede-su-cikar,
kapatma-kaydi, ilimde-kim-yetkili, ilce-sorgu, hangi-kurum, harita,
havza-riski, arsiv, hakkinda, su-hukuku, **rapor-satin-al · raporlar ·
rapor-indir** (satış), kök.

### A3.2 4 Ağustos özellik dalgası — kayıt bağı YOK [VERİ + kayıtta yok]

- `0deba47` (2026-08-04): **279 göl + 131 nehir sayfası** eklendi.
  KARARLAR.md, SIRADAKILER.md ve GUNLUK.md'de karşılığı arandı —
  **kayıtta yok** (GUNLUK'un son kaydı 28.07).
- `f412c45`→`6420255` (2026-08-02..04): B2B PDF rapor + **PayTR ödeme**
  (`/rapor-satin-al/` — 3.500 / 8.000 / 15.000 TL paketler) + `/raporlar/`
  + `/rapor-indir/` + `/ilce-sorgu/` (948 ilçe) + `/su-hukuku/` +
  `logo-lockup.svg`. Bu dalganın da karar/brief kaydı **kayıtta yok**;
  commit dili İngilizce/ASCII, proje disiplin belgeleriyle biçimsel olarak
  uyumsuz [VARSAYIM: rejim dışı ayrı oturum].
- Dalganın ölçülen yan etkileri [VERİ]: md14 G6/G1 kırmızısı 04.08
  koşusunda başladı (§A1.2) · md16 bulguları 199→207 · md18'de 2 kayıtsız
  veri dosyası · 279/279 göl sayfası başlığı **"Turkiye Golleri"**
  (Türkçe karakter yok), nehirlerde "Turkiye Nehirleri"; meta-description
  şablonu bozuk dil taşıyor ("bir doğal göldür, ve … sahiptir, (kaynak: …)").
- **AY İLKESİ notu:** dalga, "yeni özellik açılmaz" döneminin İÇİNDE
  yayına girmiş; SIRADAKILER'deki "BEKLETİLEN PAKET (WhatsApp şartlı)"
  satış kararıyla gerilim halinde. Değerlendirme kullanıcıya devredilir —
  bu rapor hüküm/karar yazmaz.
- Satış sayfaları **çekirdek denetim setinde YOK** (`cekirdek-sayfalar.json`
  11 sayfa) ve md12 etkileşim listesi PayTR/ilçe-seçici akışını içermiyor
  [VERİ] → sağlık sistemi bu kritik akışı yalnız "200 dönüyor" düzeyinde
  görüyor. Ödeme/mesafeli satış yüzeyinin hukuki yükümlülükleri bu raporda
  değerlendirilmedi — [SERDAR-HUKUK] alanı, **doğrulanmadı**.

### A3.3 Dönüşüm yolu: ziyaretçi → temas zinciri [VERİ + VARSAYIM]

Zincir bugün: içerik sayfası → mailto CTA (KARARLAR §10) **veya** yeni
PayTR sayfaları. Ölçülen kopukluklar:
1. **GSC hâlâ kurulu değil** (KULLANICI KARARI 1, 28.07'den beri) —
   hangi sorgunun geldiği görülemiyor; ~70 gösterim beyanı doğrulanamıyor.
2. **Mobil ilk ekranda dert-sorusu kadraj dışına itilmiş** (md14 G6,
   04.08'den beri) — mobil ziyaretçi ilk ekranda derdini göremiyor [VERİ].
3. Bekletilen 6 satış kalemi (SIRADAKILER "BEKLETİLEN PAKET", WhatsApp AI
   kanalı ŞARTINA bağlı; metinler `rapor/satis/`te hazır, UYGULANMADI —
   durum tespiti, uygulama önerisi değil): (1) CTA tekleştirme R1-QW1 ·
   (2) il sayfası görüşme köprüsü R1-QW2/R2-S3/R3-L3 · (3) rehber görüşme
   köprüsü R1-QW3 · (4) friction-reducer R3-L6 ("2 dakikada" parçası
   DOĞRULANMAMIŞ, hariç) · (5) risk-reversal mikro metni R2 ("ödeme
   bilgisi istenmez" teyit ister) · (6) teklif kapsamı R3-Verdict2.
   Kalıcı kapsam dışı: ceza tutarı niceleme (APILEX teyidi şart).
4. K3 çakışması açık: rehbere 3. CTA analitik verisi gelmeden
   eklenmemeli (kayıtlı karar, hâlâ geçerli).
5. Alarm e-postası kapalı (SMTP boş) → arıza bildirimi de bir "temas
   zinciri"dir ve kopuk [VERİ].

### A3.4 Kapanmış-ama-işaretlenmemiş / bayat kalemler [VERİ]

- SIRADAKILER 545 "logo dosyası kullanıcıdan bekleniyor (logo-su-hukuku.png
  yok)" ↔ `public/logo-lockup.svg` 04.08'den beri depoda — kalemin öncülü
  değişmiş, kayıt güncellenmemiş (logonun kullanıcı onayı **doğrulanmadı**).
- SIRADAKILER 517 "SITE-DURUM 🔴 GRACE tazeliği 262,6 gün" ↔ bugün GRACE
  yeşil (bekçi `grace 0g`) — bayat kayıt.
- `/harita-pilot/` ve `/stil-pilot/` canlıda 200, sitemap dışı; akıbet
  kararı SIRADAKILER 781'de hâlâ açık (kayıt doğru, davranış kayda uygun).
- `veri/potansiyel/isletme-sahalari-yeni.json` 18.08'den beri unstaged —
  su-izleme'nin günde 2 pull hatasının sebebi (§A1.1).

### A3.5 GEO / AI yüzeyi [VERİ]

- **robots.txt**: Tier-1 AI botların tümü açık (GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended…), Bytespider + CCBot engelli (kayıtlı
  kullanıcı kararı). Cloudflare KATMANINDA bu botların gerçekten
  engellenmediği buradan ölçülemez (SIRADAKILER 1151 açık kalem) —
  **doğrulanmadı**.
- **llms.txt**: canlı, 592 URL (göl/nehir sayfaları dahil), sitemap'le
  uyumlu; başlık cümlesi satış diliyle güncel [VERİ].
- **JSON-LD**: çekirdek 10/11 sayfada tam (md7 yeşil; ana sayfa ozCevap
  muafiyeti kayıtlı). Geniş taramada 207 bulgu (md16 SARI) — ağırlığı
  şablon meta-desc/title (A3.2 ile aynı kök) [VARSAYIM].
- **404**: gövdeli (5.309 B), markalı; kod 404 [VERİ].

### A1.3 Etkileşimli öğelerin canlı testi [VERİ]

Araç: Playwright (proje Chromium'u), canlı site, 1440×900. Betik:
oturum scratchpad `a1-etkilesim.mjs` (salt-okuma; siteye yazmadı).

| Test | Sonuç | Ölçüm |
|---|---|---|
| İl seçici (/ilimde-kim-yetkili/) | 🟢 | `#il-secim` JS ile görünür oldu; "Ankara" seçimi paneli doldurdu ("DSİ 5. Bölge Müdürlüğü…"); `?il=konya` paylaşım parametresi çalışıyor |
| /kapatma-kaydi/ araması | 🟢 | "Konya" → 0/23 + durum metni (il eşlemesi bilinçli yok — beklenen davranış); `?ara=iptal` → girdi doluyor, "4 kayıt eşleşti" |
| /kapatma-kaydi/ boş-sonuç hukuki şerhi | 🟢 | "**Bu, orada tahsise kapatma olmadığı anlamına gelmez**" cümlesi canlıda MEVCUT ve boş sonuçta görünüyor. (İlk ölçümde benim test desenim yanlış kelimeyi aradı ve KALDI verdi; kaynak+canlı HTML'den doğrulandı — kalan test kapısıydı, site değil. Kayda geçirildi: falsifikasyon disiplini kendi kapıma da uygulandı.) |
| Uçuşan sorular (ana sayfa soru şeridi) | 🟢 | "Sondaj ile alakalı neler yapılmalı?" → `/rehberler/kuyu-ruhsati/` → 200 |
| Rehber içi linkler | 🟢 | /rehberler/kuyu-ruhsati/ içinde 40 benzersiz iç link, kırık 0 |
| mailto CTA'lar | 🟢 | 6 sayfada 8 mailto bağı; tek adres `iletisim@suharitasi.com`, biçim geçerli. (Cloudflare e-posta gizlemesi şu an UYGULANMIYOR — düz mailto; GUNLUK 28.07 dersindeki `/cdn-cgi/l/email-protection` biçimi 0 sayıldı) |
| 404 davranışı | 🟢* | Kod 404, gövde 5.309 B, başlık "Sayfa bulunamadı — Su Haritası", 6 iç çıkış (M11 kapanışındaki tasarıma uygun). *Betiğimin "gövde ≥200 krk" eşiği görünür metinde 130 krk saydı ve KALDI dedi — eşik keyfîydi, sayfa tasarlanan hâlinde |
| Sayfa JS hataları | 🟢 | Test boyunca 0 |
| Konsol (6 sayfa tipi × 2 kırılım) | 🟢 | 12/12 ölçümde hata+uyarı 0 (A2 koşusundan) |

---

## A0+A2 · MOBİL / MASAÜSTÜ DENETİM [VERİ]

**A0 ölçüm determinizmi (ön koşul, SAĞLANDI):** sabit viewport 1440×900 ·
375×812, **DPR=1** (iki kırılımda da; kayda geçti), `prefers-reduced-motion:
reduce` (hero sahnesi bu kipte **sahne 0'da donuk** — md14 determinizm
düzeniyle aynı), enjekte CSS ile animasyon/geçiş kapalı, videolar
durdurulup t=0. Her sayfa×kırılım tam-sayfa karesi **3 kez** alındı ve
SHA-256 karşılaştırıldı: **12/12 ölçüm bit-eşit (deterministik)**;
"deterministik değil" işaretlenen ölçüm YOK. Ham veriler:
`cikti/denetim/durum-kazi/a2-olcum.json`.

**Kareler:** `cikti/denetim/durum-kazi/<sayfa>-<kırılım>.png` (temiz) ve
`…-isaretli.png` (kırmızı kesik çizgi = 1. ekran sınırı; turuncu çerçeve =
mailto/CTA/soru bağları).

### Sayfa başına ölçüm tablosu

| Sayfa | Kırılım | Yük | Yükseklik (≈ekran) | Gövde satırı | Dokunma<44* |
|---|---|---|---|---|---|
| / (ana) | 1440 | 1.970 KB | 5.260px (5,8) | 16,3px · 67 krk | — |
| / (ana) | 375 | **3.143 KB** | 9.206px (11,3) | 16,3px · 40 krk | 20 |
| /rehberler/kuyu-ruhsati/ | 1440 | 313 KB | 6.061px (6,7) | 17,0px · 79 krk | — |
| /rehberler/kuyu-ruhsati/ | 375 | 313 KB | 8.520px (10,5) | 17,0px · 40 krk | 109 |
| /kuyu-ruhsati/ankara/ | 1440 | 317 KB | 6.350px (7,1) | 17,0px · 79 krk | — |
| /kuyu-ruhsati/ankara/ | 375 | 317 KB | 9.635px (11,9) | 17,0px · 40 krk | 130 |
| /havzalar/sakarya/ | 1440 | 301 KB | 2.279px (2,5) | **10,6px · 117 krk** | — |
| /havzalar/sakarya/ | 375 | 301 KB | 3.127px (3,9) | **10,6px** · 55 krk | 39 |
| /nerede-su-cikar/ | 1440 | 279 KB | 4.732px (5,3) | 17,0px · 79 krk | — |
| /nerede-su-cikar/ | 375 | 279 KB | 6.937px (8,5) | 17,0px · 40 krk | 99 |
| /kapatma-kaydi/ | 1440 | 251 KB | 6.562px (7,3) | 17,0px · 79 krk | — |
| /kapatma-kaydi/ | 375 | 251 KB | **10.538px (13,0)** | 17,0px · 40 krk | 38 |

*Dokunma sütunu benim betiğimin ölçümü (görünür a/button, kısa kenar <44px;
satır içi metin linkleri dahil) — sağlık sistemi md21'in 6-sayfa tabanı
(201 ihlal, "taban korunuyor") ile ölçüt farkı vardır; iki sayı
karşılaştırılamaz, ikisi de kayda geçti.

### Bulgular

1. **Ana sayfanın mobil yükü 3,1 MB — masaüstünden %60 fazla** [VERİ].
   Sebep: `/deneyim/video/sahne1.mp4` mobil ölçümde İKİ yanıt olarak indi
   (1.332 + 1.172 KB; masaüstünde tek, 1.332 KB). Range/tekrar isteği
   ayrımı bu ölçümden kesin çıkarılamaz — **mobil veri tüketimi ana
   sayfada video kaynaklı ve yüksek** tespiti kesindir, ikilemenin kökü
   ayrıca ölçülmelidir (doğrulanmadı). Diğer 5 sahne videosu `preload=none`
   ve istenmemiş (doğru davranış) [VERİ].
2. **İlk ekran envanteri — mobil ana sayfada dert-sorusu ve kanıt bandı
   kadraj DIŞINDA** [VERİ]: 375×812'de görünen: H1 ("Kuyunuz için ruhsat
   mı lazım, ceza mı geldi?") + 🎯/⚖️ CTA kartları. S1 dert-sorusu şeridi
   1.383px'te (2. ekran), kanıt bandı (472/419/155) daha aşağıda — md14
   G6 kırmızısıyla bağımsız ölçüm örtüşüyor. Masaüstünde H1 + iki buton
   ("Ücretsiz Ön Görüşme Alın", "B2B Rapor Satın Al" üst barda) ilk
   ekranda [VERİ].
3. **Üst gezinme 04.08 dalgasında yeniden yazılmış** [VERİ]: bugünkü menü
   "Su Nerede Çıkar? · Su Hukuku & Cezalar · Canlı Harita & Katmanlar ·
   Havza & Veri Analizleri · İletişim / Uzman Görüşü · B2B Rapor Satın Al".
   BRIEF.md'deki menü (Harita/Havzalar/Rehberler/Su Kanunu/Hakkında) ve
   SIRADAKILER'deki 5'li yapı ile uyuşmuyor; karar kaydı **kayıtta yok**.
   "Ücretsiz Ön Görüşme", TBB gözden geçirme kalemi (SIRADAKILER 557)
   kapsamındadır — hüküm yazılmıyor, kalem hâlâ açık.
4. **Havza sayfası gövde metni 10,6px ve masaüstünde 117 karakterlik
   satır** [VERİ] — ölçülen ilk uzun paragraf künye/mono blok; hem boyut
   (16px kuralının altı) hem satır uzunluğu (66-80 bandının üstü)
   okunabilirlik sınırları dışında. md13'ün `.cs-birim` 10,88px bulgusuyla
   aynı aile.
5. **Kaydırma yükü**: mobilde kritik sayfalar 8,5-13 ekran; /kapatma-kaydi/
   mobilde 13 ekran (23 kaydın tamamı + şerhler tek sütun) [VERİ].
   Kritik içeriğe mesafe: ana sayfada dert-soru 2. ekranda; rehberde H1 +
   öz-cevap 1. ekranda [VERİ].
6. **Harici Google Fonts istekleri** (fonts.gstatic.com, ~63KB×2 aile)
   her sayfada [VERİ] — CSP izinli; performans/severlik değerlendirmesi
   A4'te.
7. Konsol: 12/12 ölçümde 0 hata 0 uyarı [VERİ].

---

## A4 · GELİŞTİRİLEBİLİR / KATMA DEĞER [VARSAYIM — öncelik sıralı, UYGULANMADI]

| # | Öneri | Dayandığı ölçüm | İş | AY sınıfı |
|---|---|---|---|---|
| 1 | RG erişim onarımı: resmigazete.gov.tr'nin eksik ara sertifikası betiklerin CA demetine eklenip (yalnız bu hedef için) doğrulama restore edilir; karşı tarafın düzeltmesi beklenmez | §A1.1 kök neden (zincir=1, 38 ardışık hata, 18 gün kör) | küçük-orta | **arıza** |
| 2 | SYGM hedef güncelleme: su-kanunu-taslak-pdf izleme hedefi + md17'nin 4 ölü linki için taşınmış yeni URL'ler bulunup `hedefler.conf` ve sayfa kaynakları güncellenir | §A1.1/§A1.2 (404'ler aynı `SYGM/Belgeler` ağacı) | küçük | **arıza** |
| 3 | `isletme-sahalari-yeni.json` unstaged durumu çözülür (rg-nobetci'ye commit adımı eklenir) → su-izleme pull hatası günde 2 kez üremeyi keser | §A1.1 | küçük | arıza/bakım |
| 4 | md13+md14 kırmızıları kapatılır: emoji CTA ikonları (🎯⚖️, varsayılan link mavisi 1.92:1 — DESIGN yasağı) ve mobil S1/G6 düzeni; görsel kimlik = BÜYÜK İŞ rejimi | §A1.2, §A2 bulgu 2 | orta | arıza (24 gündür kırmızı) |
| 5 | Göl/nehir şablonu onarımı: 410 sayfada "Turkiye Golleri/Nehirleri" → Türkçe karakterli doğru başlık + akıcı meta-description (md16 207 bulgusunun ağırlığı) — tıklamaya çevirme adayı | §A3.2 (279+131 ölçüldü) | orta (tek şablon + build) | dağıtım |
| 6 | 04.08 dalgası kayıt+denetim altına alınır: KARARLAR kaydı; satış sayfaları çekirdek sete; PayTR/il-ilçe seçici akışı md12 etkileşim listesine; md18 veri tabanı yenilenir | §A3.2 (kayıtta yok; çekirdek set 11 sayfa) | küçük-orta | dayanıklılık (süreklilik ilkesi) |
| 7 | `kaynak/dsi-arsiv` 42 push'lanmamış commit push'lanır (md20 SARI büyüyor: 40→42) | §A1.2 | küçük | dayanıklılık |
| 8 | Ana sayfa mobil video yükü: sahne1.mp4'ün mobilde çift inişinin kökü ölçülür; mobilde poster+tıkla-oynat veya daha düşük bit hızı değerlendirilir | §A2 bulgu 1 (3,1MB) | orta | bakım/dağıtım |
| 9 | Havza sayfası 10,6px gövde/117 krk satır okunabilirliği (md13 `.cs-birim` ailesiyle birlikte) — görsel kimlik = BÜYÜK İŞ | §A2 bulgu 4 | küçük-orta | bakım |
| 10 | İç link ağı: 410 göl/nehir sayfasından ilgili il/havza/rehber sayfalarına bağ (şu an şablonda zayıf [VARSAYIM — ölçümü yapılmadı, doğrulanmadı]) | §A3.1 + B4 (derin sayfalar görünmüyor) | orta | dağıtım |
| 11 | "Su hukuku avukatı" kimlik yüzeyi (hizmet/hakkında sayfası + GBP) — B4'te düşük rekabet ölçüldü; YENİ SAYFA gerektirir | §B4 sorgu 8 | orta | **yeni özellik → ilke gereği kuyruğa** |
| 12 | DSİ-itiraz içerik boşluğu ("DSİ idari para cezasına itiraz" sorgusunda özgü içerik yok) — mevcut ceza rehberinin başlık/bölüm hedeflemesi gözden geçirilir; yeni sayfa gerekirse kuyruğa | §B4 sorgu 6 | orta | dağıtım (mevcut sayfa) / yeni özellik kısmı kuyruğa |

## SENTEZ · TEK SAYFA EYLEM TABLOSU

> GSC Performans görüntüsü GELMEDİ — sorgu-sayfa eşlemesi yapılamadı;
> görüntü gelirse bu bölüm güncellenir. KARAR YAZILMADI, UYGULAMA YOK.

### 1 · ARIZA / EKSİK (ölçülmüş, öncelik sıralı)

| Öncelik | Kalem | Kanıt |
|---|---|---|
| 1 | RG veri akışı 18 gündür kör (günlük fihrist 38 ardışık hata + haftalık nöbetçi 2 koşudur 0 satır) — kök: resmigazete.gov.tr eksik ara sertifika | §A1.1 |
| 2 | Alarm e-postası kapalı (SMTP boş) → tüm kırmızılar sunucu içinde kalıyor | §A1.1 |
| 3 | md14 G6: mobil ilk ekranda dert-sorusu kadraj dışı (04.08'den beri) + md13 kontrast (emoji CTA 1.92:1, 31.07'den beri) | §A1.2, §A2 |
| 4 | Su Kanunu taslak PDF izlemesi 404 + 4 ölü SYGM dış linki | §A1.1/2 |
| 5 | 410 göl/nehir sayfasında bozuk Türkçe başlık + şablon meta (md16 207 bulgu) | §A3.2 |
| 6 | su-izleme git pull hatası (unstaged dosya) + dsi-arsiv 42 commit push'suz | §A1.1/2 |
| 7 | Ana sayfa mobil yükü 3,1MB (video) | §A2 |
| 8 | 04.08 dalgasının kayıt/denetim bağları yok (KARARLAR·GUNLUK·çekirdek set·md12·md18) | §A3.2 |

### 2 · HAZIR BEKLEYEN — kullanıcı adımı/kararı (kim-ne)

| Kalem | Kim-ne |
|---|---|
| GSC kurulumu (~15 dk) | KULLANICI panel adımı — 28.07'den beri 1 numaralı bekleyen; ~70 gösterim beyanı ancak bununla doğrulanır |
| SMTP 4 değişkeni + Telegram kanalı | KULLANICI (.env + kanal açma) — uyarılar dışarı çıkar |
| Bekletilen 6 satış kalemi | KULLANICI: WhatsApp AI kanalı kararı; metinler `rapor/satis/`te hazır (§A3.3) |
| 04.08 dalgası: AY İLKESİ/karar kaydı değerlendirmesi + PayTR sayfalarının hukuki yüzeyi | KULLANICI/[SERDAR-HUKUK] — bu rapor hüküm yazmaz |
| Canlı onay kuyruğu | KULLANICI: hero, kanıt bandı, /nerede-su-cikar/, CanliSayi, kapatma listesi "KULLANICI CANLI ONAYI BEKLİYOR" etiketleri hâlâ açık |
| D2 kontrast yükseltme (≥7:1) + M15 kalan pay | KULLANICI kararı → BÜYÜK İŞ brief'i |
| /harita-pilot/ · /stil-pilot/ akıbeti; /root eski keşif botu kopyası silme | KULLANICI kararı (geri alınamaz silme dahil) |

### 3 · DIŞ FAYDA ADAYLARI (yük · sınıf; kurulum ayrı brief)

| Aday | Yük | AY sınıfı |
|---|---|---|
| Upptime (dış nabız + durum sayfası) | küçük | dayanıklılık |
| Litestream + restic (SQLite/dosya dış yedeği — R2 kararıyla birleşir) | küçük | dayanıklılık |
| yargi-mcp + mevzuat-mcp (atıf teyidi; hüküm yazmaz) | küçük | mutfak/dayanıklılık |
| cloudflare/mcp (salt-okunur token ile analitik okuma) | küçük | dağıtım |
| Knowatoa ücretsiz katman → (test olumluysa) Otterly.ai Lite 29$/ay | küçük | dağıtım (tek doğrulanmış fiyat) |
| indexnow-action (Bing/Yandex bildirimi; Google'ı etkilemez) | küçük | dağıtım |
| ahonn/mcp-server-gsc | küçük | dağıtım — GSC kurulunca |
| wa.me bağlantısı (0 TL; mailto kararını bozmaz) | küçük | dağıtım — satış katmanı kararına bağlı |
| Pagefind (site içi arama) · claude-mermaid süreç şemaları · kandilli API | küçük-orta | **yeni özellik → ilke gereği kuyruğa** |
| TBB uyum skill'i: hazır paket YOK → skill-creator ile yerel yazım adayı | orta | mutfak |

---

*Rapor sonu. Ölçüm günü 2026-08-24; ölçüm ortamı: Hetzner VPS (site
sunucusu değil — site Cloudflare Pages'te), tek konum, kişiselleştirilmemiş
oturum. Görüntü kanıt değildir; her kare, yanındaki sayısal ölçümle
birlikte okunur.*
