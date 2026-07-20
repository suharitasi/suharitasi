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
