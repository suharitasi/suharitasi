Önce BRIEF.md'yi oku — projenin çatı belgesi.

# suharitasi.com

Türkiye'nin su verisi, havzaları ve su mevzuatını tek haritada birleştiren portal.
Sahibi: Serdar — Arslan Hukuk Bürosu. Amaç: su hukuku alanında otorite konumu + B2B rapor altyapısı.

## Durum
- Şu an: "yakında" landing sayfası (index.html).
- Sırada: MapLibre ile 2D interaktif Türkiye havza haritası (25 havza, hover'da dolum animasyonu, rezerv/tahsis/risk verisi), Astro ile SEO'lu içerik katmanı (mevzuat rehberleri, havza sayfaları), Three.js hero (Anadolu DEM'inden terrain, imleçle canlanan su damarları).

## Kalıcı yetki kuralı (tam otomatik mod — kullanıcı onayı 2026-07-15)
Hiçbir iş için ÖN ONAY SORULMAZ: commit + push otomatik, fazlar arası
bekleme yok, dosya/komut izinleri otomatik. Yap, raporla, devam et;
kullanıcı çıktıyı incelerken müdahale eder.
TEK İSTİSNA — yalnız şunlar önce sorulur:
- geri alınamaz işlem (veri silme vb.),
- ücretli servis/abonelik başlatma,
- DNS/domain değişikliği.
Diğer her şey serbest. Not: "İş kapanış kuralı"ndaki KULLANICI ONAYI
BEKLİYOR etiketi ön onay değil, canlı test kaydıdır — iş yapılıp
push'lanır, etiket yalnız kuyrukta açık kalır.

## Sürekli site sağlık sistemi (2026-07-23)
Site sürekli denetlenir: `arac/site-saglik.mjs` (tek script, üç mod —
`--tam` cron, `--hizli` deploy sonrası, `--test` sanal doğrulama).
- **OTURUM AÇILIŞ KURALI:** her oturumun başında `izleme/SITE-DURUM.md`
  OKUNUR; 🔴 varsa SIRADAKILER'den ÖNCE kullanıcıya bildirilir.
- Cron: 07:30 ve 19:30 UTC (`--tam`). Bekçinin bekçisi: `saglik-bekcisi.sh`
  son başarılı koşu ≥14 saat eskiyse 🔴 verir.
- Otomatik onarım SINIRLIDIR (beyaz liste: CSP direktifi, kaybolan
  yönlendirme, sitemap'te 404, pipeline tekrarı). Performans, tasarım,
  içerik/hukuk, JSON-LD şeması, veri kaynağı değişimi, mimari = KARA LİSTE,
  asla otomatik onarılmaz — DUR + bildir.
- **CANLI KOŞUL İLKESİ:** yerel ölçüm `arac/dist-sun.mjs` ile yapılır
  (CSP + _redirects uygulanır); `python3 -m http.server` üzerinde alınan
  kanıt "canlı çalışıyor" SAYILMAZ. Ayrıntı: ODUL-USTU.md "Korunacaklar".
- **GÖRÜNTÜ KANIT DEĞİLDİR:** medya iddiası ölçümle (istek/readyState/
  currentTime) kanıtlanır; ekran karesi destekleyicidir.
- **SÜREKLİLİK İLKESİ:** her yapısal iş kalıcı bir kontrol maddesi bırakır
  (site-saglik.mjs + `izleme/*.json` yapılandırması güncellenir).
- Depoya otomatik commit atan tüm scriptler TEK kilit kullanır:
  `flock /tmp/suharitasi-git.lock` (`arac/git-kilit.sh`).

## Tarayıcı öz-denetim protokolü
Görsel/UI içeren HER işin bitti-tanımına şunlar dahildir (araç: Playwright
MCP — .mcp.json'da kayıtlı; MCP oturumda yoksa arac/oz-denetim.mjs):
1. Etkilenen sayfaları headless tarayıcıda aç.
2. Konsol hata/uyarılarını topla — 0 olmalı.
3. Kırık iç link tara — 0 olmalı.
4. Tam sayfa ekran görüntülerini cikti/denetim/ altına kaydet.
5. Etkileşimli öğeleri test et (menü aç/kapat, hover, ESC vb.).
6. Sonuçları rapora yaz.
Bu öz-denetim kullanıcı onayının yerine GEÇMEZ; ön elemedir.

## Tasarım skill kuralı (2026-07-20)
Tasarım/görsel/grafik içeren HER işte ilgili skill İŞ BAŞLAMADAN devreye
alınır (öncelik + kapsam global CLAUDE.md "TASARIM SKILL ÖNCELİK
KURALLARI"nda). Kısa özet:
- ui-ux-pro-max > frontend-design > dataviz > transitions-dev.
- dataviz her grafik/veri-görsel işinde ZORUNLU; ilk grafik satırından ÖNCE.
- transitions-dev: geçiş/hover/mikro-animasyon (t-* vanilla CSS; .agents/skills/).
- superpowers'tan YALNIZ brainstorming + verification-before-completion.
Raporda hangi skill'in ne önerdiği ve neyin uygulandığı belirtilir. Skill
altyapısı user-scope plugin + proje .agents/skills/ ile kurulu
(envanter/onarım kaydı 2026-07-20). Not: .agents/ ve .claude/skills/
symlink repoya COMMIT EDİLMEZ (yerel araç); gerekirse .gitignore'a alınır.

## Sunucu kaynakları (ölçüldü 2026-07-27, kullanıcı düzeltmesi)
Hetzner VPS: **4 çekirdek / 8 GB RAM** (free -h: 7,6Gi; nproc: 4).
BRIEF.md'deki "2 vCPU/4GB" kaydı ESKİDİR — kaynak bütçesi kararlarında
bu ölçüm esas alınır.

## GPU kuralı
Bu sunucunun headless tarayıcısında GPU YOKTUR (yazılımsal GL).
WebGL/canvas/animasyon içeren her işte:
- Headless test yalnız hata/link/etkileşim için geçerlidir; görsel
  kalite kanıtı SAYILMAZ.
- GPU'lu gerçek tarayıcı yolunun fallback'e düşmediği kod incelemesiyle
  satır satır doğrulanır ve raporlanır.
- FPS/performans eşikleri headless ölçümüne göre AYARLANMAZ.

## Görünürlük kuralı
Görsel efektlerde (doku, degrade, animasyon, imleç) "teknik olarak var"
yetmez — "İLK BAKIŞTA fark edilir" olmalıdır. DESIGN.md ilkesi geçerli:
sadelik amaç değildir; bir efekt kısılacaksa görünmez olana kadar değil,
zarif kalana kadar kısılır. Şüphede kalırsan soluk olanı değil belirgin
olanı üret; kısmak kolay, yok olanı fark etmek zordur.

## Altyapıda hızlı, iddiada yavaş (2026-07-23)
Geri alınabilir işler (içerik, altyapı, düzen) hızlı akar; kullanıcıyı maddi
karara yönlendiren iddialı araçlar (ör. Kuyu Çıkar Mı) hız hedefi TAŞIMAZ —
zorunlu sıra: keşif raporu → kullanıcı değerlendirme oturumu → [SERDAR-HUKUK]
onayı → uygulama briefi (ayrıntı: ODUL-USTU.md "Korunacaklar").

## İş kapanış kuralı
Görsel/UI işleri "YAPILDI" olarak işaretlenmez; "KULLANICI ONAYI
BEKLİYOR" olarak işaretlenir ve SIRADAKILER'de kullanıcı canlıda
onaylayana kadar açık kalır. Headless kanıt = ön eleme; nihai kanıt =
kullanıcının canlı testi.

## Kopyalanma direnci ilkesi
Kaynak kodun 'nasıl yapıldığı' kolayca çözülmesin ve toplu indirilmesin diye:
1. Build çıktısında JS/CSS minify + obfuscate (okunur değişken adları, yorumlar çıktıya girmez) — ANCAK çalışmayı, performansı (Lighthouse ≥90) ve erişilebilirliği bozmayacak seviyede; aşırıya kaçıp siteyi kırmak yasak.
2. Source map üretilmez (geliştirici araçlarında okunur koda dönüşmez).
3. Cloudflare'de kötü-niyetli scraper/site-kopyalama botlarına karşı koruma + rate-limit. KRİTİK İSTİSNA: arama motoru botları (Googlebot, Bingbot) ve izin verilen AI-arama botları (GPTBot, ClaudeBot, PerplexityBot) ASLA engellenmez — SEO/GEO hedefi kopyalama-önlemeden önce gelir. robots.txt ve Cloudflare kuralları bu ayrımı korur.
4. view-source/sağ-tık caydırması eklenebilir AMA meşru kullanıcının normal metin seçme/kopyalama davranışı engellenmez (yalnız kaynak-inceleme caydırılır, okuma serbest).
Not: Bu caydırıcıdır, mutlak değildir — hiçbir site tam kopyalanamaz yapılamaz. Asıl direnç koddan değil, veri arşivi + avukat yetkisiyle elde edilen özel veri + otoriteden gelir (bkz. HENDEK). Kod gizleme ikincil katmandır.
Her yeni sayfa/bileşen bu ilkeye uyar.

## İçerik ilkesi — cevap önce, dayanak sonra
Sitedeki her içerik sayfası (rehber, havza, araç) başlıktan hemen sonra ~280 karakterlik ÖZ CEVAP bloğu taşır: ziyaretçinin (avukat/işadamı dahil) sorusunun cevabını 10 saniyede veren damıtılmış özet. Madde/tablo/detay ALTTA kalır; isteyen derine iner. Ziyaretçi metin duvarı okumaz. Bu blok aynı zamanda meta-description ve FAQPage/AI-arama alıntı cümlesi kaynağıdır. İçerik yalnız mevcut doğrulanmış metinden damıtılır; yeni hukuki iddia üretilmez. Bağlayıcı ilkedir.

## Sessiz hata yasağı (pipeline scriptleri — 2026-07-20)
Veri çeken/yazan/commit eden her script (baraj, GRACE, gelecek pipeline'lar)
sessizce başarısız olup veri kaybetmemeli. Bağlayıcı kurallar:
- `set -euo pipefail` zorunlu. Hata-toleransı gereken satır KÖR set -e ile
  değil, tek tek `|| true` / `if ... fi` / `|| logla` ile ayrılır ve neden
  korunduğu yorumda belirtilir. Kör set -e yeni sessiz-durma yaratır.
- `2>/dev/null` yalnız GERÇEK beklenen gürültü için (örn. var-olmayan opsiyonel
  dosya). Hata gizleyen her `2>/dev/null` ya açılır ya `log/pipeline.log`'a
  yönlendirilir. Özellikle `git add ... 2>/dev/null` YASAK (eski bug ikizi).
- `git add` KOŞULLU: `[ -f DOSYA ] && git add DOSYA` — var-olmayan dosyada
  exit 128 + sessiz durma olmasın.
- Başarı metriği = commit teyidi: `git rev-parse HEAD` önce/sonra karşılaştırılır;
  commit atılmadıysa exit≠0 + log. Deploy hook HTTP kodu başarı SAYILMAZ.
  Push başarısızlığı loglanır ve exit 0 dönülmez.
- Hata sayacı / durum sıfırlaması ancak commit teyidinden SONRA yapılır;
  commit koparsa sayaç korunur (N-ardışık-hata uyarısı çalışsın).
- Bağımsız sağlık bekçisi (`saglik-bekcisi.sh`, günlük 07:00 UTC) pipeline'dan
  AYRI çalışır: son commit yaşı, baraj.json tazeliği, GRACE durum.json canlılığı.
  Pipeline kendini denetleyemez. Eşikler gerçek cron takvimine göre kalibre
  edilir (takvim-günü değil saat/gün penceresi — yanlış alarm üretme).

## İki kademeli brief rejimi (2026-07-28)
Brief rejimi işin ağırlığına göre iki kademelidir. **Sınıf, işe başlamadan
ÖNCE açıkça beyan edilir** ("Bu KÜÇÜK İŞ" / "Bu BÜYÜK İŞ"); beyan
edilmemişse BÜYÜK sayılır.

**KÜÇÜK İŞ** — üç şartın ÜÇÜ de sağlanmalı:
1. tek dosyaya dokunur,
2. geri alınabilir (tek `git revert` yeter, veri/dış durum bırakmaz),
3. şunların HİÇBİRİNE dokunmaz: veri (data/, veri/, kaynak/), yayın
   zinciri (sitemap, robots, llms, yönlendirme, canonical), mimari
   (build hattı, bağımlılık, cron/timer, script sözleşmesi), görsel
   kimlik (renk, tipografi, ritim, hero, md14 G1-G6 kapsamı).
Rejim: tek paragraf brief (ne · neden · bitti-tanımı), `brief-denetci`
turu YOK, düşman geçişi YOK. Kanıt yükümlülüğü DÜŞMEZ — ölçüm yine
yapılır ve rapora yazılır.

**BÜYÜK İŞ** — aşağıdakilerden HERHANGİ BİRİ varsa: veri · yayın ·
mimari · görsel kimlik · para · hukuki metin · geri alınamaz işlem.
Rejim: tam rejim (yukarıdaki "Brief denetçisi — ön kapı kuralı"nın
tamamı: cikti/brief'e yazım + `arac/brief-denetci.mjs` + düşman geçişi
D1-D4 + amaç özeti; ENGEL varsa uygulama başlamaz).

Şüphede kalınırsa BÜYÜK seçilir. Gerekçe: yanlış BÜYÜK seçmenin
maliyeti bir denetim turu; yanlış KÜÇÜK seçmenin maliyeti denetimsiz
giren yayın/veri değişikliğidir.

## AY İLKESİ — dağıtım ve dayanıklılık dönemi (2026-07-28) — KAPANDI 10.10.2026 (KARARLAR §71)
**Bu ilke 10.10.2026'da sahibin kararıyla kapandı; kayıt KARARLAR §71.** Aşağıdaki metin tarihsel kayıttır.
Önümüzdeki dönemde **yeni ÖZELLİK açılmaz.** Öncelik iki bacaktır:
(1) DAĞITIM — sitenin dış dünyaya ulaşması (indeks, atıf, temas,
analitik), (2) DAYANIKLILIK — verinin ve üretimin kaybolmaması
(yedek, altın örnek, kurtarma planı, dış izleme).
Yeni özellik talebi gelirse REDDEDİLMEZ, SIRADAKILER.md'ye yazılır ve
bu iki bacak hizaya gelmeden BAŞLATILMAZ. Mevcut özelliklerin
bakımı/onarımı bu kuralın dışındadır (özellik değil, bakımdır).
İlke kalkınca bu bölüm KARARLAR.md'ye kapanış tarihiyle taşınır.

## Brief ön-denetim kontrol listesi (2026-07-21)
Her brief tesliminden ÖNCE zorunlu ön-denetim listesi (kaynak: GUNLUK.md
21.07 "HATA KAYDI + KURAL" kaydı):
1. Her referans (dosya, mock, commit, yol) somut mu, yoksa "bulunur
   varsayımı" mı?
2. Her bitti-tanımı/şart ortamda GERÇEKTEN denetlenebilir mi?
   (denetlenemezler ölçülebilire çevrilir ya da kullanıcıya devredilir)
3. Belirsiz parametre kaldı mı? (breakpoint, eşik, tolerans — tanımsızsa
   "dur ve sor")
4. Kapsam dışı liste tam mı, brief kendi içinde çelişiyor mu?
5. Düşman geçişi: briefi FAIL ettirmenin yollarını ara — çelişen şart,
   geçemeyecek test, boş çıkacak referans. (Bulunanlar 1-4'e geri beslenir.)
Bu liste geçilmeden brief teslim edilmez; geçemeyen brief düzeltilir.
- Denetlenemez şart briefe yazılmaz (bit-kıyas, gerçek cihaz testi) —
  ölçülebilire çevrilir ya da kullanıcıya devredilir.
- Lighthouse tek ölçümle karar verilmez — 3 tur medyan; localhost
  gürültüsü eşik ihlali sanılmaz.

## Brief denetçisi — ön kapı kuralı (2026-07-23)
Her brief, UYGULANMADAN ÖNCE (i) `cikti/brief/<zaman>.md`'ye OLDUĞU GİBİ
yazılır, (ii) `node arac/brief-denetci.mjs <dosya>` ile denetlenir, (iii)
düşman geçişi (D1-D4) ve amaç özeti (3b: amaç/dokunulmazlar/bitti-tanımı/
kanıtlar) yanıtlanır. ENGEL varsa uygulama BAŞLAMAZ — mekanik eksiği Claude
Code tamamlar (yalnız ekleme+netleştirme; silme/daraltma/kanıt-hafifletme
YASAK, madde 4e), karar gerektireni kullanıcıya sorar. UYARI'lar raporun
başında listelenir, iş sürer. Denetim + düşman geçişi + amaç özeti her
raporun ilk bölümüdür. Düzeltme en fazla 2 tur; hâlâ ENGEL varsa DUR +
kullanıcıya devret. Orijinal brief değiştirilmeden saklanır; düzeltilmiş hal
`<zaman>-duzeltilmis.md`'ye yazılır. Kural kaynağı: `arac/brief-kurallari.json`
(kayıt-türetilmiş, tek gerçek kaynak) — yeni kural doğunca (GUNLUK'a hata
kaydı) bu json güncellenir. İSTİSNA: denetçinin kendi briefi kendi
tetik-kelimelerine takılır (use/mention); meta-briefler elle değerlendirilir
(kurulum raporu: rapor/brief-denetci.md).

### Brief yazarı öz-denetim kuralları (25 Tem 2026)

1. Ek madde, onay mesajı ve tek satırlık düzeltme de tam brief sayılır;
   aynı denetimden geçer. Hatalar burada çıkıyor.
2. Durum şartı yazmadan önce (ağaç temiz olmalı / dosya var olmalı /
   sayı N olmalı) projenin gerçek durumu kontrol edilir. Şart, bilinen
   olgulara karşı yanlışlanabilir olmalı.
3. Kriter seçerken sor: umursadığım şeyi mi ölçüyor, yoksa ölçmesi kolay
   bir vekili mi? Vekil kriter yasak.
4. Belirtiden nedene atlanmaz. Sıra: belirti → hipotez → kontrol → bulgu.
   Kontrol edilmemiş hipotez bulgu diye yazılmaz.
5. Beyan değil kanıt okunur. "Yapıyorum / geçiyorum" yapıldı demek
   değildir; iş bittiğinin kanıtı çıktıdır.
6. Claude Code için yazılan her kanıt kuralı, brief yazarını da bağlar.

## Kurallar
- Her işin sonunda commit + push OTOMATİK yapılır; push için ayrıca
  onay sorulmaz (kullanıcı kararı, 2026-07-14).
- Tasarım kararlarında DESIGN.md bağlayıcıdır, ondan sapma.
- Haritanın nihai deneyim hedefi VIZYON.md'dedir ("Sondaj Anı") — fazlar
  halinde, her fazda kullanıcı onayıyla yürünür.
- Her oturum başında SIRADAKILER.md'yi oku ve kullanıcıya ilk mesajında
  "Sıradaki 3 iş: ..." diye özetle; biten işi kuyruktan düş, yeni
  istekleri kuyruğa ekle.
- Stack: vanilla JS + Vite; içerik katmanı Astro; React/Next kullanma.
- Barındırma: Cloudflare Pages. Ağır sunucu bağımlılığı ekleme, site statik kalır.
- Arayüz dili Türkçe. Emoji yok.
