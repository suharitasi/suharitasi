# SIRADAKILER.md — projenin tek iş kuyruğu

Öncelik sırasıyla; biten iş kuyruktan düşer, yeni istekler kuyruğa eklenir.

═══ AY İLKESİ YÜRÜRLÜKTE (28 Tem 2026, CLAUDE.md) ═══
Bu dönemde YENİ ÖZELLİK AÇILMAZ. Öncelik iki bacak: DAĞITIM (indeks, atıf,
temas, analitik) + DAYANIKLILIK (yedek, altın örnek, kurtarma, dış izleme).
Yeni özellik talebi reddedilmez, buraya yazılır ve iki bacak hizaya gelmeden
BAŞLATILMAZ. Bakım/onarım bu kuralın dışındadır.

═══ ASTRO 5→7 YAYINDA (26.08.2026, 9. seans; KARARLAR §32;
rapor/26-08-astro7-faz1.md + rapor/26-08-astro7-faz2-yayin.md) ═══
KAPANAN:
- [x] **Astro 5.18.2 → 7.2.7 yayına alındı.** commit eaa951d, push
  13:18Z, Cloudflare deploy'u ~45 sn'de landi (surum.json eaa951d).
- [x] **Cloudflare NODE_VERSION=22** (kullanıcı panelde yaptı).
  Kanıt log okumadan kuruldu: astro@7 bin'i <22.12'de HİÇ BUILD
  ETMEDEN exit 1 veriyor (yerel falsifikasyon: sahte node 20.11.0 →
  "not supported"), dolayısıyla yeni çıktı üretilmiş olması Node 22'nin
  kanıtıdır. KALICI ÖN KOŞUL: değişken silinirse yayın build'i KIRILIR.
- [x] **konya-kapali 5-kesiti — KULLANICI KARARI: KABUL.** Alfabetik
  eşitlik bozucu kalır, Akarçay görünür (KARARLAR §32/3; gerekçe resmî
  komşu listesi, künyeler KAYNAKLAR'da). Ölçüm notu: yükseltme ÖNCESİ
  canlı da Akarçay gösteriyordu — kabul edilen davranış zaten yayındaydı.
  Reddedilen alternatif: ortak-il eşiğiyle sıralama (liste uzunluğunu
  öngörülemez kılıyor).
- [x] Yayın doğrulaması: 5 sayfada canlı ↔ temiz-kaynak build görünür
  metin + JSON-LD BİREBİR · /arsiv/ canlıda dolu (23 pasaj / 24 tarih /
  53 li, tarih listesi birebir) · boşluk-yutma canlıda düzgün
  (/goller/abant-golu/: "Havzası rezerv") · apex 200 · www 301→apex.
AÇIK:
- [ ] **🔴 md17 KIRMIZI — ÖLÇÜM YAPAYI, SİTE SAĞLAM. ONARILMADI, KARAR
  BEKLİYOR.** Astro 7 `href`'teki `&`'i DOĞRU biçimde `&amp;` kaçırıyor
  (376 yerde; Astro 5 eksik kaçırıyordu). `arac/kapsam-kalemleri.mjs:37`
  ham HTML'de regex ile href topluyor ve **varlık kaçışını çözmüyor** →
  `...&amp;product_id=` diye istek atıp 404 alıyor.
  ÖLÇÜLDÜ: ham `&` URL → **200**, `&amp;` URL → **404**; gerçek tarayıcıda
  canlı sayfada DOM href'i ham `&`'e çözülüyor ve **HTTP 200**.
  YANİ: ziyaretçi etkilenmiyor, YALNIZ denetim yanılıyor.
  RİSK: her `--tam` koşumu yanlış KIRMIZI verecek; gerçek ölü bağlantı
  sinyali bu gürültünün altında kaybolur (alarm körelmesi).
  ÖNERİLEN DÜZELTME (tek satır): href'i istek atmadan önce varlık-çöz.
  BİTTİ-TANIMI: aynı örneklemde ölü 0 + gerçek bir ölü bağlantının HÂLÂ
  kırmızı verdiği falsifikasyon. (Denetim altyapısı = kara liste, elle.)
- [ ] **7 GÜN SONRA (2026-09-02'den itibaren): /home/suha/astro5-referans/
  SİL.** Astro 7 canlıda sorunsuz kalırsa. Dizinde NOT.txt var (hangi
  tarih/sürüm/commit + şerh). O tarihten ÖNCE SİLİNMEZ.
- [ ] md9 /harita/ mobil İZLEMEDE: yükseltme sonrası medyan 68 (turlar
  [68,68,75], eşik 70). GERİLEME KANITI YOK — 92 ölçümlük geçmişte band
  68-75 ve medyan 68 Astro 5'te de iki kez görüldü. Aracın kuralı gereği
  iki ARDIŞIK koşuda tekrarlarsa KIRMIZI olur; bir sonraki `--tam`
  koşumunda bakılacak. (Zaten açık olan "md9 eşik payı" kalemiyle aynı kök.)
- [ ] md9 lighthouse tabanının Astro 7 çıktısıyla yeniden ölçümü
  (JS küçültücü esbuild→oxc değişti; taban kayabilir).
- [ ] site-saglik/izleme'ye Astro sürüm kalemi (süreklilik ilkesi):
  "package.json astro major sürümü ile node_modules'daki eşleşiyor mu"
  + NODE_VERSION ön koşulunun kalıcı hatırlatması.
YENİ AÇILAN (kapsam dışı bulgular, uygulanmadı):
- [ ] **YEREL BUILD ile CANLI BUILD aynı sayıyı basmıyor.** /arsiv/ ve
  /kullanilanlar/ baraj arşiv dosya sayısı: yerelde 946, canlıda 903.
  Kök neden ölçüldü: 43 dosya `data/arsiv/baraj/log/*.log` ve bilinçli
  gitignore'lu (.gitignore:14-19, eski F4-7 bulgusu). Astro'dan BAĞIMSIZ,
  yükseltme öncesi de böyleydi. Karar gerekir: sayım git'in gördüğüyle mi
  sınırlansın (canlı=yerel olur), yoksa fark kabul mü edilsin.
- [ ] PaylasilanMenu.astro:131-135 seçicisiz yetim CSS bloğu (iki
  sürümde de ölü kod; temizlik görsel kimlik kararı ister).
- [ ] Sayfa.astro:362 `is:global` içinde `:global()` — düzeltilirse bugüne
  dek hiç uygulanmamış height:100% kuralı AKTİFLEŞİR; görsel risk,
  bilinçli bırakıldı.
- [ ] stil-pilot ilgili-kart sırası koleksiyon sırasına bağlı (noindex
  pilot; istenirse frontmatter sırasına sabitlenir).

═══ 26.08 CRON DOĞRULAMASI + K1/K2 LOG ONARIMI (26.08.2026, 8. seans;
rapor/26-08-k1-k2-log-onarimi.md) ═══
KAPANAN:
- [x] **GSC cron ilk gerçek koşumu** — çalıştığı kanıtlandı (yalnız
  tetiklenmedi): syslog + çıktı + içerik + exit 0 + Telegram sessiz.
- [x] **md24 www kalemi SARI → YEŞİL.** www 301 → apex canlıda
  doğrulandı (curl: HTTP/2 301, location https://suharitasi.com/,
  tek hop, hedef 200); md24 yeniden ölçüldü: `[GEÇTİ] 24-www`.
  İzole --hizli: kırmızı 0 · sarı 0 · geçti 12. Cloudflare panel
  Redirect Rule adımı TAMAMLANMIŞ — SIRADAKILER'deki www-522 zinciri
  bu kalemle kapandı.
- [x] **K1 — çıkış kaydı garanti değildi.** Son satırdaki echo,
  set -euo pipefail altında erken düşüşte hiç çalışmıyordu. `trap
  cikis_kaydi EXIT` + sinyalin exit'e çevrilmesiyle başarı/hata/sinyal
  üç durumda da tek satır garanti. Falsifikasyon 5a/5b/5c + sinyal.
- [x] **K2 — tavanı olan yanlış log'du.** Cron satırındaki `>>`
  kaldırıldı, tavansız gsc-haftalik-cron.log silindi (iki satırı tek
  log'a taşındı). Döndürme arşivli yapıldı: en fazla 5 arşiv, 6.'sı
  silinir, hiçbir satır kırpılmaz. Falsifikasyon 5d/5e.

AÇIK KALAN / KAPSAM DIŞI:
- [ ] **K3 — md17 SARI.** Dış sunucu kaynaklı; bu işte KAPSAM DIŞI
  bırakıldı, onarılmadı. Ayrıca `--hizli` sınıfında olmadığı için
  26.08 koşumunda ÖLÇÜLMEDİ — durumu bilinmiyor, sonraki `--tam`
  koşumunda görülecek.
- [ ] K4 (not, kusur değil): cron koşumu ~1 sn sürüyor. İki GSC API
  çağrısı için hızlı ama içerik farkı gerçek veriyi kanıtlıyor.

YENİ AÇILAN (bu seansın ölçümlerinden):
- [x] **Diğer cron işlerinde aynı iki kusur var mı?** → ENVANTER
  ÇIKARILDI (26.08.2026, aynı seans; rapor/26-08-cron-log-envanteri.md).
  Sayım düzeltmesi: "12 satır" YANLIŞTI — gsc hariç 17 satır var, 4'ü
  arslanhukuk.tr (yasak, ölçülmedi), ölçülen 13 satır / 10 log.
  BULGU: 10/10 log'da tavan/döndürme YOK · 13/13 satırda exit kodu
  log'a yazılmıyor · zaman damgası yalnız baraj'ın cron log'unda var ·
  sistem logrotate /home/suha'yı HİÇ kapsamıyor.
  ÖLÇÜM UYARIMI SINIRLANDIRDI: en hızlı büyüyen log (site-saglik-cron,
  4080 B/gün) bile 1 MB'a 0,6 yılda varıyor — K2 acil DEĞİL, öncelik
  K1'de. (İlgili ironi: gsc-haftalik ~36 B/gün büyüyordu, yani tavanı
  olan tek log en yavaş büyüyendi.)

═══ CRON LOG K1 AÇIĞI — ONARIM KUYRUĞU (26.08.2026; envanter raporu) ═══
Öncelik sırası ölçümle kuruldu: kritiklik × BEKÇİ KAPSAMI × K1 açığı.
Bekçinin kapsamadığı kalemler grep ile doğrulandı: yedek-al.sh ·
gsc-haftalik.sh · bekçinin kendisi.
- [x] **1. arac/yedek-al.sh** → **FAZ 1 YAPILDI** (26.08.2026;
  rapor/26-08-k1-faz1-yedek-al.md). Ortak yardımcı arac/cikis-kaydi.sh
  yazıldı ve YALNIZ bu betiğe bağlandı. Falsifikasyon 4a-4g; 4e bu
  betikte UYGULANAMAZ (mevcut trap yok, ölçüldü) — zincirleme
  yardımcının kendi birim sınamasıyla kanıtlandı. K2 de kapandı:
  512 KB tavan + 5 kayan arşiv, cron `>>` kaldırıldı, tavansız
  log/yedek-cron.log silindi (29 satırı tek log'a taşındı).
  Gerçek yedek alındı ve bundle'dan klonla GERİ OKUNDU (HEAD eşleşti,
  545 commit); varlık paketi bit-eşit korundu.
- [ ] **2. saglik-bekcisi.sh (bekçinin kendisi)** — ölürse (a)-(f)
  sekiz kalem birden sessizce kör kalır; suharitasi tarafında onu
  izleyen yok. K1 tam açık (0/38).
- [ ] **3. arac/site-saglik.mjs** (3 cron satırı) — en büyük ve en hızlı
  büyüyen log (144847 B, 4080 B/gün), 1591 satırda hiç damga yok;
  process.exitCode hesaplanıyor ama log'a yazılmıyor. Bekçi (f) kapsıyor.
- [ ] **4. izleme/su-izleme.sh** — bekçi (d) kapsıyor. DİKKAT: mevcut
  `trap ... EXIT` (satır 65) geçici dosya temizliği yapıyor; ortak
  yardımcı körlemesine eklenirse bu temizlik EZİLİR (ölçüldü).
- [ ] **5. arac/baraj-gunluk.sh** — bekçi (b) kapsıyor, K1 kısmen zaten
  kapalı (cron log'undaki tek damgalı kalem, 330/383). En az iş.
- [ ] **6. arac/indexnow-bildir.mjs** — bekçi (d2) çift kalemle kapsıyor,
  iç log tam damgalı (32/32).
- [ ] **7. rg-nobetci.py · nhyp-yayin-nobetci.py** — haftalık, düşük
  hacim, bekçi (d2) kapsıyor; python tarafı ayrı uygulama.
- [ ] **8. arac/grace-guncelle.sh** — haftalık, 8 B/gün, bekçi (c).
- [ ] **9. arac/bellek-log.sh** — RİSK YOK, 35+ gündür 0 bayt. Onarılacak
  bir şey yok.

═══ K1 FAZ 2+ — YARDIMCININ YAYGINLAŞTIRILMASI (26.08.2026 Faz 1'den) ═══
arac/cikis-kaydi.sh Faz 1'de yazıldı ve YALNIZ yedek-al.sh'e bağlandı.
Yardımcı kendi falsifikasyonundan geçti; yaygınlaştırma sıradaki fazlarda.
- [ ] **Faz 2 — kalan 9 betiğe bağlama.** Öncelik sırası envanterdeki
  gibi: saglik-bekcisi.sh → site-saglik.mjs → su-izleme.sh →
  baraj-gunluk.sh → indexnow-bildir.mjs → rg/nhyp → grace-guncelle.sh.
  (bellek-log.sh RİSK YOK, 35+ gündür 0 bayt — bağlanmasına gerek yok.)
  DİKKAT 1: su-izleme.sh:65'te MEVCUT trap var — 4e orada GERÇEKTEN
  uygulanabilir ve uygulanmalı (Faz 1'de uygulanamamıştı).
  DİKKAT 2: node (site-saglik, indexnow) ve python (rg, nhyp) için
  yardımcının AYRI uygulamaları gerekir; bash sürümü onlara sökülemez.
  DİKKAT 3: her betik kendi falsifikasyonundan ayrı geçmeli — yardımcı
  ortak diye kanıt ortaklaşmaz.
- [ ] **saglik-bekcisi.sh'in kendisi izlenmiyor** (envanter öncelik-2).
  Bekçi ölürse (a)-(f) sekiz kalem birden sessizce kör kalır. Bu, K1
  yardımcısıyla ÇÖZÜLMEZ — ayrı bir dış gözcü kalemi gerekir.
- [ ] **yedek-al.sh bekçi kapsamına alınsın.** Faz 1 K1'i kapattı ama
  bekçi hâlâ yedek kalemi taşımıyor: "hiç koşmama" hâli yine kör.
  son-yedek.json mtime eşiği doğal aday (grace durum.json deseniyle aynı).
- [ ] **yedek-al.sh'de temizlik trap'i yok** (Faz 1 yan bulgusu, ONARILMADI).
  Sinyal/hata ile ölünce .depo.bundle.tmp (925 MB!) ve .imza-yeni kalıyor.
  Yardımcı zincirleme desteklediği için temizlik trap'i eklenebilir.
- [ ] **site-saglik.mjs SIGTERM'de kilidini bırakmıyor** (Faz 1 yan
  bulgusu). Betik bayat kilidi kendisi devraldığı için arıza değil,
  ama process.on('exit') SIGTERM'de koşmuyor — kayıtta dursun.
- [ ] **Sinyal gecikmesi sınırı** (Faz 1'de ölçüldü): bash trap'i çalışan
  foreground alt komut bitene kadar işlemiyor; yedek-al.sh'de TERM 3 dk
  45 sn geç kaydedildi. Uzun alt komutu olan betiklerde akılda tutulacak.

ORTAK YARDIMCI KARARI (Faz 1'de UYGULANDI — aşağısı özgün öneri metnidir):
EVET ama tek parça DEĞİL. Diller: 7 bash · 2 node · 2 python → en az üç
ayrı uygulama; paylaşılan şey KOD değil SÖZLEŞME (satır biçimi + 512 KB
tavan + en fazla 5 kayan arşiv, kırpmasız).
ÖLÇÜLEN ZORUNLU ŞART: bash'te ikinci `trap ... EXIT` birincisini SESSİZCE
EZER (deney yapıldı); node `process.on('exit')` ve python `atexit` ise
YIĞILIR. Bu yüzden bash yardımcısı `trap -p EXIT` ile mevcut trap'i okuyup
ZİNCİRLEMEK ZORUNDA. Karşı argüman kayıtta: ortak yardımcı YENİ BİR TEK
HATA NOKTASI yaratır (bozulursa 7 bash betiği birden düşer) — bu yüzden
kendi falsifikasyonu (gsc'deki 5a/5b/5c/5d deseni) kurulmadan hiçbir
betiğe bağlanmamalı, ve önce YALNIZ öncelik-1 betiğinde kanıtlanmalı.

AYRICA AÇILDI (envanterin yan bulguları, onarılmadı):
- [ ] `izleme/log/cron.log` içeriği git hata mesajları
  ("cannot pull with rebase: You have unstaged changes") — büyüme hızı
  ölçülemedi (koşum imzası yok). İçerik ayrıca kendi başına incelenmeli.
- [ ] `log/uyari.log` (Telegram) tavansız ve döndürmesiz — 320 B/gün.
- [ ] `log/site-saglik-cron.log.uyum` (2508 B) — ne olduğu incelenmedi.

═══ 25.08 ALARM TEŞHİSİ (25.08.2026, 7. seans; rapor/25-08-alarm-teshisi.md) ═══
KAPANAN: 1a yedek (envanter=disk, gerçek yedek alındı+geri okundu) ·
1b su-izleme 5 hata (kaynak taraflı, kendiliğinden geçti, 0 hata ile
tekrar koştu) · 1c dört kırmızı + IndexNow 500 + bekçi ikilisi (hepsi
dünkü falsifikasyon testi, kancalar kodda doğrulandı) · 1d ortak neden
(tek olay = kasıtlı test dizisi; ağ/kaynak hipotezleri ölçümle elendi).
Canlı --tam: 🔴0 · 🟡2-açıklamalı · 🟢21, taban gerilemesi 0.
AYRICA: GSC haftalık koşumu cron'a BAĞLANDI (KARARLAR §31, falsifikasyon 3/3).

KULLANICI KARARI ALINDI (25.08.2026) — İKİSİ DE KAPANDI:
- [x] **Telegram kanal sınırı** → KARAR: "paylaşımlı kalsın". Bot
  8549777437 + chat 1490086481 kesif-botu ile ortak kalır; yeni işin
  hata yolu da MEVCUT arac/uyari-gonder.sh ile aynı kanala bağlandı.
  ŞERH KORUNUYOR: BIST tarafındaki kullanım DOĞRULANMADI (bist-*
  dizinlerine girme yasağı) — ileride kanal ayrımı istenirse bu ölçüm
  yeniden yapılmalı.
- [x] **Haftalık GSC cron bağı** → KURULDU: `30 10 * * 3` (Çar 10:30
  UTC = 13:30 TR), kullanıcı suha, sarmalayıcı arac/gsc-haftalik.sh,
  çıktı depo DIŞINA (/home/suha/gsc-cikti). Falsifikasyon 3/3
  (cron ortamı · kimlik hatası msg 4671 · flock). KARARLAR §31.
  İLK GERÇEK CRON KOŞUMU **TEYİT EDİLDİ** (26.08.2026, 8. seans):
  CRON[2009304] 10:30:01 UTC → 2026-08-23.md 2531 bayt 10:30:02,
  exit 0, Telegram'a hata yok. "Eski çıktı tekrarı" ihtimali üç
  ölçümle elendi (pencere ilerledi · veri değişti · önbellek yok).
  Rapor: rapor/26-08-k1-k2-log-onarimi.md.

YENİ AÇILAN KALEMLER (bu seansın ölçümlerinden):
- [ ] **yedek-al.sh kısmi kayıp kör noktası.** Üç varlıktan biri/ikisi
  silinse betik ölmez: `MEVCUT` boş olmadığı için `olduc` tetiklenmez,
  kalan paketlenir, durum "basarili" yazılır. "Envanter ile disk
  uyuşmuyor" alarmı yalnız TOPYEKÛN kayıpta çalışıyor. Kısmi kayıp
  imzayı değiştirdiğinden kuşak döndürme de çalışır (sağlam paket
  onceki/'ye iner). Üretim uyarı mantığı istenmeden değiştirilmesin
  diye DOKUNULMADI — onarılsın mı? Bitti-tanımı: eksik varlık sayısı
  >0 iken kırmızı + Telegram, falsifikasyonla kanıtlı.
- [ ] **--tam penceresinde ağır iş koşturma yasağı.** 19:30 koşumu
  benim yedek koşumumla (19:32-19:36) çakıştı ve md9 /harita/ mobil
  72→68 ile YANLIŞ SARI verdi; boş makinede [75,75,75] geçti. Elle
  yedek/paket/build koşumları 06:40 ve 19:30 pencerelerinin (~13 dk)
  dışında yapılmalı. Kalıcı kural yazılsın mı (CLAUDE.md/KARARLAR)?
- [ ] **md9 /harita/ eşik payı.** Ölçülen yayılım 68-75, eşik 70 —
  taban tam yayılımın ortasında, yanlış alarm üretmeye açık. Ya sayfa
  hızlandırılmalı ya eşik/medyan turu gözden geçirilmeli.

═══ GSC MCP + SEO/GEO TURU KAPANIŞI (25.08.2026, rapor/gsc-mcp-optimizasyon.md; KARARLAR §30) ═══
KAPANAN: google-seo-mcp v0.8.5 kuruldu (salt-okunur, çapraz doğrulama
4/4 birebir, 102 araç) · ilk tam indeks haritası (519 URL: 170 indeksli,
omurga TAM; 349 dışarıda, 340'ı göl/nehir) · 81 il <title> sorgu
kalıbında · Dataset şemaları (/arsiv/ + /kapatma-kaydi/) · kuyu-tasima
5→7, taslak-takibi 1→2 iç bağ · haftalık koşum hazır (cron'suz) ·
IndexNow 88 URL HTTP 200 · canlı --tam KIRMIZI 0.
İZLEME (1-4 hafta, haftalık koşumla ölçülür):
- [ ] Ergene ailesi (~2.350 göst) tıklama/pozisyon değişimi (dünkü havza
  işi + bugünkü tur; ~22 Eylül'deki mevcut GSC etki ölçümüyle birleşik).
- [ ] "malatya kuyu" / il sayfası CTR (bugünkü title değişimi).
- [ ] Yamyamlık ("ergene havzası harita"): birleşme olmazsa /havzalar/
  ayrıştırması yeniden değerlendirilir (KARARLAR §30/4).
- [ ] kuyu-tasima + taslak-takibi indekse girdi mi (URL denetimiyle).
KULLANICI KARARI BEKLEYEN (rapor §12):
- [ ] Haftalık GSC koşumu cron'a bağlansın mı — satır raporda; maliyet:
  4 sorgu/hafta.
- [ ] GSC panel: sitemap yeniden gönder + öncelikli sayfalara tekil
  dizin isteği (özellikle /rehberler/kuyu-ruhsati/ "tarandı—eklenmedi",
  son tarama 18.07 = iyileştirmeler öncesi).
- [ ] Knowatoa denemesi (ŞERH: dün kayıtlı "0$ katman" bugün sayfada
  doğrulanamadı; kredi kartsız deneme + 59/199$ planlar görünüyor) —
  adım listesi rapor §7.7; ücretli adım atılmadı.
- [ ] Göl/nehir kategori hub'ları (C5 №6): indeks ölçümüyle GÜÇLENDİ
  (340 sayfa dışarıda) ama AY gereği kuyrukta.

═══ HAVZA TALEP UYUMU KAPANIŞI (25.08.2026, rapor/havza-talep.md; KARARLAR §29) ═══
KAPANAN: 25 havza sayfası ölçülen sorgu ailesine uyduruldu (title ≤60
soru kalıbı · H1 soru · öz-cevap konum cümlesi · iller+konum haritası
öne · SSS 3 soru) · E4 /havzalar/ bit-eşit korundu · md24 üç durumlu ·
değişen 25 sayfa IndexNow'a bildirildi (13:26Z, HTTP 200) · uydurma
denetimi cümle-kaynak tablosuyla raporda.
KULLANICI ADIMLARI:
- [ ] **www → apex 301 (Cloudflare Redirect Rule, ~2 dk):** dash.cloudflare.com
  → suharitasi.com → Rules → Redirect Rules → şablon "Redirect from WWW
  to Root" → Deploy. (Pages _redirects alan-düzeyi yönlendirme
  desteklemiyor — ölçüldü + resmî belge; kurulana dek md24 SARI.)
- [ ] GSC etki ölçümü (1-4 hafta sonra, ~22 Eylül civarı): Ergene
  ailesi (~2.700 gösterimlik tek sayfa) tıklama/sıralama değişimi.
KULLANICI KARARI BEKLEYEN:
- [ ] "Havza ne demek/nedir" tanımı: sitede YOK; teknik/hukuki tanım
  [SERDAR-HUKUK] içerik kararı ister (rapor §8). Karar gelmeden (f)
  sorgu ailesi cevapsız.
- [ ] Açık/kapalı havza sınıflaması için resmî derli kaynak bulunursa
  veri kaydı olarak eklenmesi ((d) ailesi 4 sorgu; bugün veri yok).

═══ OTOMATİK DİZİN BİLDİRİMİ KAPANIŞI (25.08.2026, rapor/indeks-bildirimi.md; KARARLAR §28) ═══
KAPANAN: IndexNow kuruldu — anahtar canlıda, 519/519 URL bildirildi
(202→200), bildirici cron 6×/gün, tetik = canlı sitemap farkı, bekçide
2 eşik, falsifikasyon 5/5 (Telegram msg 4667 dahil) · sitemap lastmod
artık sayfanın dateModified'ından (build günü damgası kalktı; tarihi
belirsiz 11 sayfada lastmod dürüstçe yok) · Google Indexing API resmî
kapsam gereği UYGUN DEĞİL ile kapandı (yalnız JobPosting/BroadcastEvent).
KULLANICI ADIMLARI (panel işleri — ayrıntı rapor §7):
- [ ] Bing Webmaster Tools kaydı: bing.com/webmasters → "Sign in" →
  GSC hesabıyla "Import from Google Search Console" (en kısa yol; site
  GSC'de DNS ile doğrulu). Kayıt yoksa IndexNow bildirimleri Bing
  panelinde İZLENEMEZ (bildirim yine kabul ediliyor) ve ChatGPT arama
  katmanı (Bing indeksi) körlemesine kalır.
- [ ] (İsteğe bağlı) Cloudflare panel → suharitasi.com → Caching →
  Configuration → "Crawler Hints" anahtarı: Cloudflare'ın kendi IndexNow
  beslemesi; bizim deterministik yolla çakışmaz, ek sinyaldir.
- [ ] Bing kaydı yapılınca: panelde IndexNow bölümünden bildirimlerin
  görünüp görünmediğini kontrol et (kanıt: gönderilen URL sayısı).
AÇIK / İZLEME:
- [ ] İlk GERÇEK otomatik bildirim gözlemi: bir sonraki veri deploy'unda
  (baraj ~15:05 → cron 16:25) log/indexnow.log'da farkın yalnız değişen
  sayfalar olduğu doğrulanır (beklenti: havza + ana-veri sayfaları,
  519 değil).

═══ KALANLAR PAKETİ KAPANIŞI (25.08.2026, rapor/kalanlar-paketi.md) ═══
KAPANAN: Görünür güncellik damgası C5 №5 (509 sayfa görünür + 508 şema
dateModified; KARARLAR §27 K3) · veri hattı Telegram uyarı yolu 4 hatta
tamamlandı (baraj/grace/yedek/nhyp; message_id 4662-4666, §27 K2) ·
kirli-ağaç kök nedeni (rg-nobetci haftalık yazımı; §27 K1 — 18-24.08
vakası) · md24 www kalemi (www-522'nin açık kalemi; falsifikasyon 2/2) ·
--test 7/7 ölçülerek doğrulandı · md14 taban-yenileme kalemi (24.08'de
yapılmıştı, son --tam yeşil) · nöbetçi canlılık kalemi (bekçi satır 107,
M13) · "rg/nhyp nöbetçileri hiç koşmamış" bulgusu (state: 25.08 / 19.08) ·
K1 Faz D ölçümü (pull hatası BULUNDU ve kök nedeni giderildi) · yedek
geri-alma denemesi tazelendi (25.08: bundle klon + fsck temiz).
AÇIK / İZLEME:
- [ ] rg-nobetci ilk GERÇEK yeni-kayıt olayında zincirin uçtan uca gözlemi
  (Telegram bildirimi + ertesi su-izleme commit'i) — sentetik falsifikasyon
  geçti, gerçek olay tarihi bilinmiyor.
- [ ] SIRADAKILER kürasyonu KISMİ: 7 tamamen kapanmış blok
  arsiv/SIRADAKILER-ARSIV-1.md'ye taşındı; kalan karışık blokların
  kürasyonu ayrı tur ister.

═══ GEO/SEO TURU KAPANIŞI (25.08.2026, rapor/geo-seo-katma-deger.md) ═══
KAPANAN: 37 ölü dış bağlantı (md17 kırmızısının SYGM ailesi dahil) ·
/su-hukuku/ rota kapanışı (§26) · md21 Manisa borcu · md16'daki sahte
nehir bulguları (araç tırnak hatası, falsifikasyonlu düzeltme) ·
SEO bulgusu 303→26, GEO 59→23 · meta/title/öz-cevap şablon düzeltmeleri.
AÇIK / KULLANICI KARARI BEKLEYEN (ayrıntı raporun C bölümünde, sıralı):
- [ ] GSC: sitemap yeniden gönder + ~20 öncelikli sayfaya dizin isteği (C5 №1).
- [ ] Veri gazetecisi teması — temas-listesi §3 (C5 №2; e-posta kullanıcının).
- [ ] LinkedIn/GBP/Wikidata profilleri → sameAs (C5 №3).
- [x] md17 GET-düşümü KAPANDI (25.08, küçük iş): başarısız HEAD'de
  tarayıcı-UA GET; falsifikasyon 2/2 (gerçek ölü KIRMIZI kaldı,
  DergiPark yanlış-pozitifi SAĞLAM+notlu); 39 onarılan bağlantı ölü 0;
  süre +35,8 sn/52 örneklem (yalnız --tam'da koşar, --hizli 0).
- [x] Görünür güncellik damgası KAPANDI (25.08 kalanlar paketi; KARARLAR §27 K3;
  509 görünür + 508 dateModified, tarih yalnız veri kaydından).
- [ ] 11 içerik title'ı + 11 uzun öz-cevap + rehber H2 soru biçimi —
  [SERDAR-HUKUK] içerik kararı (C5 №9).
- [ ] 2 İÜC kitabı künyesi "doğrulanamadı" etiketiyle bekliyor
  (yayınevi sayfaları 404; yeni adres çıkarsa güncellenir).

4 AĞUSTOS DALGASI KURALLARA UYDURULDU (24.08.2026, kullanıcı kararlı brief;
KARARLAR §25 · rapor/agustos-uyum.md). KAPANAN: satış sayfaları + PayTR
kalıntıları (31 × 301 ile) · md13 kırmızısı (araç oklch düzeltmesi
falsifikasyonlu + emoji CTA kaldırma) · md14 G6 (S1 mobilde 785px'e döndü) ·
410 sayfadaki bozuk Türkçe (0 isabet) · göl/nehir uydurma denetimi (32+36
sınır ötesi öznitelik yayından düştü, künye+şerh+iç bağ kuruldu) ·
göl/nehir/ilçe-sorgu denetim setine alındı.
AÇIK KALAN (bu turda bilinçli dokunulmayan):
- [x] /su-hukuku/ KAPANDI (25.08, kullanıcı kararı — GEO/SEO briefi A5;
  KARARLAR §26): sayfa arsiv/su-hukuku-rota/'da, canlıda 301 →
  /rehberler/ruhsatsiz-kuyu-cezalari/ ölçüldü. Arşivden dönüş ancak
  [SERDAR-HUKUK] onayıyla.
- [x] Lead-mailto birleşmesi FİİLEN KAPANDI (25.08): /su-hukuku/ kalkınca
  canlı yüzeyde tek adres bilgi@suharitasi.com (ölçüldü; serdar@ src'de 0).
- [ ] /ilce-sorgu/ analiz çıktılarının (akifer türü/derinlik tahmini)
  yöntem şerhi mevcut "TEMSİLÎDİR" uyarısıyla sınırlı — yeterlilik kararı.
- [x] md14 görsel taban yenilemesi YAPILMIŞTI (24.08, taban tarihi SITE-DURUM'da);
  25.08 --tam ve izole kapıda md14 yeşil ölçüldü — kalem kapandı.
- [x] .env PAYTR_* satırları ana ağaçta SİLİNDİ (24.08 kapanışı; 6 satır).
- [x] Hidrografya çapraz bağları KAPANDI (25.08, GEO/SEO B-iv):
  [il].astro .capraz 44px min-height; Manisa 12→7=taban ölçüldü.
  3a genel borcu (90 öğe, diğer şablonlar) AÇIK — desen kararı bekliyor.
- [x] md18 veri tabanı yenilemesi YAPILDI (25.08): iki dosya kapsam-taban'a
  alındı; isletme-sahalari-yeni.json BOŞ (say=0) — akıbeti kullanıcı kararı
  (rapor/geo-seo-katma-deger.md C5 №10).

BEKLEYEN İŞLER PAKETİ — MERGE EDİLDİ (29 Tem 2026, ön-onaylı). 16 kalem.
KAPANANLAR: M1 üç ölü dış bağlantı (3/3 onarıldı, HTTP 200 + İÇERİK
doğrulamalı — trdizin'in base64 kimliğinden türeyen /318433 de 200 dönüyordu
ama BAŞKA yayındı; uydurmadan kıl payı dönüldü) · M2 mod-başına kırmızı
koruması ölçümle KAPALI · M3 --test senaryo (i) 6/7 → 7/7 (bayat seçici
+ bayat mutasyon) · M4 public/s/*.js küçültme kancası (%41, yorum 0) ·
M5 rg_sayi 363 → 417/419 (%99,5) · M6 OpenAlex zaten kapalı (81/81 il) ·
M8 5 belirsiz kütle: 0 açık il ifadesi → ATAMA SIFIR, negatif sonuç kalıcı ·
M9 npm postcss düzeltildi, kalanlar gerekçeli ertelendi · M10 il seçici
mobilde 2 kolon (4069 → 2056 px) · M11 404 paleti hizalandı, 1 → 6 çıkış,
dokunma 44px · M13 nöbetçiler bekçiye bağlandı (falsifikasyon 4/4) ·
M14 hiza tutarsızlığı ARIZA DEĞİL, kural (KARARLAR §21) · M15 ikincil metin
5,52 → 7,04 (KARARLAR §22).
KAPANMAYANLAR (gerekçeli):
▸ M7 İLÇE ÇAPRAZ DOĞRULAMA — ERTELENDİ. 27.07'de 0 farkla yapılmıştı; tek
  açık kalan "2021→2026 yeni ilçe var mı" sorusu. TÜİK dosyası bugün
  yeniden indirildi: AYNI 2021 tarihli dosya (3.736.479 bayt). Kaynak
  değişmeden tekrar koşum aynı 0 farkı üretir, yeni bilgi vermez.
  YENİDEN AÇILMA TETİĞİ: TÜİK 2021 sonrası idari bölünüş listesi yayımlarsa.
▸ M12 KEŞİF BOTU TAŞIMA — DUR (root erişimi yok). /root/araclar/kesif-botu
  okunamıyor, sudo parola istiyor. BIST bağı ÖLÇÜLDÜ: teknik bağ YOK
  (kendi venv'i, BIST dizinine/portuna referans yok); tek bağ birim ADI
  (`bist-kesif`). Taşıma planı + BIST taban ölçümü hazır:
  rapor/kesif-botu-tasima.md. KULLANICI ROOT OLARAK KOŞAR.
▸ M9 astro 5→7 — **KAPANDI 26.08.2026: YÜKSELTİLDİ VE YAYINA ALINDI**
  (astro@7.2.7, commit eaa951d; KARARLAR §32). Erteleme gerekçesi hâlâ
  doğruydu (açıkların hiçbiri bize dokunmuyordu) — yükseltme güvenlik
  değil bakım kararı olarak yapıldı. Lighthouse DÜŞÜRMESİ hâlâ AÇIK ve
  hâlâ reddediliyor (md9 skor tabanını geçersiz kılar).
▸ M15 kalan pay: #DFE9F0 zemininde 6,58 (<7). Yeni palet değeri ister =
  DESIGN.md değişikliği = kullanıcı kararı.

RG ARA SERTİFİKASI SÜRE KALEMİ (2026-08-24, KARARLAR §24): 
`izleme/lib/rg-ara-sertifika.pem` **2027-11-02'de dolar** — o tarihten önce
yenilenir (AIA ucundan indir + `openssl verify` + parmak izini dosya başına
işle). RG kendi zincirini düzeltirse (openssl s_client zincir ≥2 görürse)
demet zararsız fazlalıktır; kaldırma kararı o gün verilir. Bitti-tanımı:
yeni sertifikayla `su-izleme.sh --rg-tarih <dün>` hatasız + nöbetçi
`--test` sorgu hatası 0.

★ KULLANICI KARARI BEKLEYEN — SIRALI (yapısal revizyon, 28 Tem 2026)
Hepsi ücretsiz ve kısa; sıra etki büyüklüğüne göre.
 1. **GSC kurulumu** (~15 dk) — indeks körlüğü kapanır. Ölçüldü: sitenin
    kendi alan adıyla tam eşleşme aramasında bile sonuç YOK. rapor/dagitim-durumu.md
 2. ~~Web Analytics~~ **ÇALIŞIYOR — KAPANDI 29.07.** Panelde 7 ziyaret,
    7 sayfa görüntüleme, Core Web Vitals ölçülüyor (LCP %100 Good, yükleme
    1.314 ms), apex + www. CWV yalnız tarayıcıdaki beacon'dan üretilebilir
    → beacon gerçek ziyaretçilerde çalışıyor. CSP izni doğru, engel yok.
    NOT: bu sunucudan yapılan HTML ölçümü beacon'ı GÖRMÜYOR (0/20 istek,
    3 tarayıcı kimliği, apex+www) — sebebi doğrulanmadı, muhtemelen PoP
    farkı (buradan ARN'ye düşüyoruz). ÖLÇÜM DERSİ: tek vantaj noktasından
    negatif ölçüm, CDN'in istek başına değişen davranışında kanıt
    DEĞİLDİR. rapor/dagitim-durumu.md §4.1b
    AÇIK KALEM: "beacon var mı" sağlık kalemi EKLENEMEZ (buradan sürekli
    yanlış alarm verir); doğru kalem Web Analytics API'sinden "son 24
    saatte olay > 0" olurdu — API erişimi kullanıcı kararı.
 3. **.env kopyası şifre yöneticisine** (~5 dk) — kurtarma süresinin tek
    darboğazı; "günler → 15 dakika". rapor/kurtarma-plani.md K1
 4. **Makine dışı yedek konumu** — Cloudflare R2 ücretsiz katmanı önerildi
    (446 MB, 10 GB sınır, egress $0). rapor/yedek-envanteri.md §4
 5. ~~Telegram uyarı kanalı~~ **KAPANDI 24.08** — keşif botunun MEVCUT
    kanalı .env'e bağlandı (TELEGRAM_BOT_TOKEN/CHAT_ID; kullanıcı talimatı);
    uyari-gonder.sh + bekçi + veri hatları artık dışarı bildiriyor.
    Falsifikasyon kanıtı: message_id 4656/4657 (rapor/rg-onarim.md §3).
    AÇIK KARAR (küçük): ayrı/adanmış bir bot-kanal istenirse yalnız .env
    değerleri değiştirilir. rapor/dis-izleme.md §4.A
 6. ~~www 522~~ **KAPANDI 29.07** — Pages custom domain eklendi, 3/3 ölçüm
    200; canonical apex'i gösteriyor, mükerrer içerik riski yok.
    AÇIK KALEM KAPANDI (25.08): md24 www kalemi kuruldu (200 + canonical apex,
    falsifikasyon 2/2; KARARLAR §27 K4). rapor/www-522.md
 7. **GitHub Actions dış nabzı** — sunucudan bağımsız tek izleme seçeneği,
    yeni sağlayıcı gerektirmiyor. rapor/dis-izleme.md §3
 8. ~~Keşif botu taşınsın mı~~ **UYGULANDI + DOĞRULANDI 29.07** —
    kesif-botu.timer enabled (ilk koşum 30.07 05:00 UTC), User=suha,
    .kesif.env 0600, bist-kesif.timer disabled, BIST bozulmadı
    (bist-api active · 8001 → 403, taban ile aynı).
    KALAN KARAR: /root'taki eski kopya ne zaman silinsin (geri alınamaz).
    rapor/kesif-botu-tasima.md §6
 9. ~~astro 5→7 yükseltmesi yapılsın mı~~ **KAPANDI 26.08.2026 — YAPILDI
    VE YAYINDA.** astro@7.2.7, commit eaa951d, Cloudflare NODE_VERSION=22.
    KARARLAR §32 · rapor/26-08-astro7-faz1.md + rapor/26-08-astro7-faz2-yayin.md

NHYP KAYNAK PDF'LERİ GERİ GETİRİLDİ (29 Tem 2026, kullanıcı kararı;
KARARLAR.md §20). 41/41 dosya, 1,1 GB, 0 hata. Zincirin tamamı artık
depoda ve yeniden üretilebilir: nhyp-manifest-uret.py (YENİ) → nhyp-indir.sh
→ nhyp-metne-cevir.sh (YENİ) → nhyp-cikar.py. UÇTAN UCA TEKRAR koşuldu:
12/12 YEŞİL, 472 kütle, çıktı depodaki yas-kutleleri.json ile BİT-EŞİT.
veri/potansiyel/ DEĞİŞTİRİLMEDİ (git diff boş). Süreklilik: altın örnek
kaynak varlığını da ölçüyor — kısmen silinirse KIRMIZI (falsifikasyon
ölçüldü: 11/12 → 🔴, geri konunca 🟢 23/23).
Rapor: rapor/nhyp-geri-getirme.md · 6 yol-hatası kayda geçti.
AÇIK: 3 dosya kanonik havzaya eşlenemedi, "diger/" altında duruyor
(uydurulmadı; çıkarımda kullanılmıyor). 41 ≠ 38 farkı doğrulanamadı —
orijinal manifest kayıp.

MARKA SIFATI "EMİN" — KARAR VERİLDİ (29 Tem 2026), UYGULAMA AYRI İŞ.
Karar KARARLAR.md §18'de, sonuçları DESIGN.md §18'de. Kapanan tartışma;
yeniden açılmaz. UYGULANACAK TEK KALEM (kuyrukta, başlatılmadı):
▸ **D2 KONTRAST YÜKSELTME** — aydınlık bölümlerde gövde metni bugün
  5,52:1 (koyu bölümler 8,67-18,04). DESIGN.md §18.2 hedefi **≥7:1**.
  Kapsam: --v2-metin / --v2-muted-fg tokenları + etkilenen her bölüm.
  Bitti-tanımı: 6 sayfa tipinde ölçülen en dar oran ≥7,0 · md13 yeşil ·
  md14 G1-G6 sapma 0 (renk değişimi tipografi/ritmi bozmamalı) ·
  a11y 100/100 korunur · gerileme 0. BÜYÜK İŞ (görsel kimlik) — tam brief
  rejimi. AY İLKESİ notu: bu bir ÖZELLİK değil, karar sonucu bakımdır.
Zaten uygulanmış olan: rakamlarda lining figür (CanliSayi, 28.07).

AÇIK BULGULAR (yapısal revizyon, karar/iş bekliyor)
- [KAPANDI 29.07] D1 başlık hizası: ARIZA DEĞİL, kural — KARARLAR §21.
- K3 ÇAKIŞMA: rehberde üçüncü CTA (görüşme köprüsü) eklenirse aynı sayfada
  3 CTA olur. Analitik kurulmadan karar verilmemeli.
- TMMOB iletişim yolu doğrulanmadı (/icerik/iletisim 404);
  verigazeteciligi.com erişilemedi (000). rapor/temas-listesi.md
- kaynak/tr-atlas-master.png üretim kaydı bulunamadı — kullanıcı
  hatırlıyorsa KAYNAKLAR.md'ye yazılmalı.

YAPISAL REVİZYON — MERGE EDİLDİ (28 Tem 2026 gece, ön-onaylı).
20 madde. Yeni kalıcı belgeler: KARARLAR.md · DEVIR.md ·
izleme/kaynak-takvimi.md. Yeni araçlar: arac/yedek-al.sh ·
arac/altin-ornek.mjs (md23) · arac/uyari-gonder.sh · arac/dikis-teshis.mjs ·
arac/baraj-birlestir.mjs · arac/grace_geometri.py. Yeni sayfa:
/kapatma-kaydi/ (çekirdek sete eklendi 10→11). Yeni bileşen: CanliSayi +
CanliSayiMotor. Raporlar: rapor/{yedek-envanteri,kurtarma-plani,dis-izleme,
www-522,tasarim-kimligi,dagitim-durumu,temas-listesi}.md +
rapor/satis/TEKLIF-KATMANI-HAZIRLIK.md + icerik-taslak/su-kanunu-gunu-paketi.md
Ölçüldü: gerileme 0/174 · sitemap 174→175 KAYIP 0 · md14 G1-G6 sapma YOK ·
altın örnek 22/22 · konsol 0 · 375 taşma 0 · kontrast en dar 5,45 ihlal 0.
KULLANICI CANLI ONAYI BEKLİYOR (görsel iş: CanliSayi bileşeni + /kapatma-kaydi/).

/NEREDE-SU-CIKAR/ GİRİŞ KAPISI — MERGE EDİLDİ, KULLANICI CANLI ONAYI BEKLİYOR
(28 Tem 2026; dal kapi-2026-07-28 → main b5fc73c, push'landı). Ana sayfadaki
"su nerelerde çıkabilir" sorusunun tek kanonik hedefi; cevap il ölçeğinde
(81 il sayfası). Kullanıcı KARELERİ onayladı; İş kapanış kuralı gereği nihai
onay canlı testtir — etiket o zamana dek açık kalır.
Rapor: KAPI-RAPORU.md · kanıt: cikti/denetim/kapi/.
Ölçüldü: taban gerilemesi 0 (172 ortak sayfa) · sitemap 172→173 KAYIP 0 ·
llms 173→174 · kontrast 127 düğüm ihlal 0 (en dar 5,16:1) · 375 taşma 0 ·
konsol 0 · site geneli 176 link kırık 0 · öz-cevap 255 krk.
Sayfadaki HER rakam build anında veriden sayılır (src/data/kapi.js), SSS
cevapları mevcut sayfalardan birebir + ham-metin doğrulamalı (kapi-sss.js);
falsifikasyon: alıntı bozulunca / öz-cevap 280'i aşınca build exit 1.
Süreklilik: /nerede-su-cikar/ izleme/cekirdek-sayfalar.json çekirdek setine
eklendi (8→9); yeni araç arac/kapi-denetim.mjs.
KARARLAR (kullanıcı, 28.07): menüye tek kayıt EKLENDİ · SORULAR_V2[5]
"nerede su VAR" DOKUNULMADI (var/çıkabilir ayrımı kasıtlı) · KAYNAKLAR.md
OpenAlex satırı ölçülen değerle düzeltildi (1.226/49 il → 1.979/81 il).
AÇIK KALEM — İL SEÇİCİ MOBİL 2 KOLON (kullanıcı kararı 28.07: 1 kolon KALIR,
ayrı iş olarak kuyruğa): 375px'te il ızgarası 1 kolon / 4069px, 81 il tek
sütunda uzun kaydırma yapıyor. Bu TABANIN davranışıdır — /kuyu-ruhsati/
indeksi ölçüm olarak birebir aynı (1440: 3 kolon/672×1352; 375: 1 kolon/
335×4069). 2 kolona düşürülürse iki sayfa DESEN OLARAK AYRIŞIR; kararın
kapsamı "yalnız kapı" mı "her iki sayfa" mı önce netleşmeli.

SAĞLIK md14 — GÖRSEL/DÜZEN KALEMLERİ (G1-G6) KURULDU (28 Tem 2026, merge
0bcbc18). Bugün insan gözüyle yakalanan üç arıza artık ölçülüyor: metnin
görseli örtmesi (G1), kaynak üstü büyütme (G2), hero tipografi sapması (G3),
bölüm ritmi (G4), ortalanmış başlığın kayması (G5), 375 ilk-ekran dert-sorusu
(G6 = S1 nöbeti). SALT-OKUMA — otomatik onarım YOK.
Determinizm: sabit viewport+DPR + reduced-motion (hero sahnesi 0'da donar) +
animasyon dondurma; 8 ölçüm 3 turda BİT-EŞİT. Kaynak: 5-6 sn / 154 MB =
--hizli'nın %10,2'si → hem --hizli hem --tam.
Eşikler DOĞAL VARYANSTAN (13 sayfa × 2 kırılım): G1 0→2000px² · G2 1,00→1,05 ·
G3 0→±2px · G4 sayfa-başına ±2px · G5 0→2px · G6 812px.
Falsifikasyon 6/6 ölçülerek geçti; mevcut 13 kalemin çıktısı bit-eşit.
TABAN YENİLEME (kalem kilitlenmesin): bilinçli tasarım değişikliğinde
`node arac/site-saglik.mjs --gorsel-taban-yenile --gerekce "..."` (gerekçe
ZORUNLU). Yenilenmeden kalem KIRMIZI kalır. SITE-DURUM'da taban tarihi görünür.
AÇIK: taban 28.07'de YEREL dist'e karşı alındı; deploy sonrası canlıya karşı
ilk --tam koşumunda doğrulanır (fark çıkarsa taban canlıdan yenilenir).

HERO "SAHA KADRAJI" + Ş3 KÖK DÜZELTMESİ — MERGE EDİLDİ (28 Tem 2026,
ön-onaylı; merge b3046af). Kullanıcı şikâyetleri ölçümle doğrulanıp çözüldü:
Ş1 yazılar sahne üstünde/büyük → H1 72→41,6px, metin düz zemine indi
(kesişme 0px) · Ş2 işçiler görünsün → kadraj NATIVE 832×464 (upscale
×1,77→×1,00; kare kanıtı dizi-t4-sahne1) · Ş3 "aşağısı dağılmış" → KÖK:
`.v2-sayfa *` reseti tüm kuralları eziyordu, v0'ın 6rem padding'i ve başlık
ortalaması HİÇ uygulanmamıştı; reset :where()'e alındı, v0 ritmi ilk kez
devrede. Akış: 6 poster şerit (birleşik) → kadrajda adım adım sahneler →
sorular kadrajın YANINDA, aktif sahneyle senkron (t4/t9/t14 ölçümü).
Motor K-1 süreleri aynen; ağırlık: varlık kümesi birebir aynı.
Ölçüldü: gerileme 0/174 · S1 736-785 kadrajda (üç sıkma turu; pay 27px —
canlıda yeniden ölçülecek) · kontrast ihlal 0 · konsol 0 · taşma 0.
Rapor: rapor/hero-gorsel.md · kareler: cikti/denetim/hero/.
KULLANICI CANLI ONAYI BEKLİYOR (görsel iş — nihai yargı canlı test;
GPU'suz kare görsel kalite kanıtı değildir).

SATIŞ RAPORLARI UYGULAMASI (U1-U4) — MERGE EDİLDİ (28 Tem 2026, ön-onaylı).
Metinler rapor/satis/BIRLESIK-SATIS-RAPORU.md'den HARFIYEN (uygulamayla
birlikte main'e girdi): yeni H1 "Kuyunuz için ruhsat mı lazım, ceza mı
geldi?" + R3 master alt satırı (title/meta/OG/WebSite uyumlandı; eski H1 ve
beş-sayılı envanter cümlesi kalktı — R3-Line2 alternatifi de düştü, yerini
R3 master cümlesi aldı) · kanıt bandı masaüstünde hero-sonrası ilk blok
(MOBİL İSTİSNASI ÖLÇÜMLE: düz taşıma ilk soruyu 716→1502'ye itti, kadraj
dışı → mobilde CSS order ile eski sıra; S1 KORUNDU 716-765) · /nerede-su-
cikar/ öz-cevabı R2-Sayfa2 metniyle bit-eşit (181 krk) · 10/10 rehberde
R2-Sayfa4 kapanışı (RehberKapanis; SonrakiAdim'la bilinçli /durumum/
tekrarı — biri gövde kapanışı, öbürü gezinme). SAYI DİSİPLİNİ: onaylı
cümlelerdeki 472/12/347/419/1963/42 her build'de veriden sayılıp
karşılaştırılır; veri değişirse build düşer (sessiz bayatlama imkânsız).
Ölçüldü: gerileme 0/174 (tek fark artış: ana sayfa soru başlığı 1→2) ·
kontrast ihlal 0 · konsol 0 · kareler ÖNCE/SONRA cikti/denetim/satis-uygula/.
KULLANICI CANLI ONAYI BEKLİYOR (görsel iş — H1/hero değişimi).
U5 KONTROL SONUCU (R1-6, yalnız ölçüm): /hangi-kurum/ işlem→rehber köprüsü
MEVCUT — sayfada 22 /rehberler/ linki (tam tabloda 10, kart bölgesinde 15;
5 benzersiz rehber). Ekleme kararı GEREKMEDİ; kapsamı genişletmek (20
işlemin tamamına köprü) istenirse ayrı iş.

BEKLETİLEN PAKET — WhatsApp AI kanalı bağlanınca uygulanacak SATIŞ KATMANI
(28 Tem 2026 kullanıcı kararı; kaynak referanslarıyla, metinler
rapor/satis/'ta hazır): CTA tekleştirme (R1-QW1) · il sayfası görüşme
köprüsü (R1-QW2, R2-Sayfa3, R3-Line3) · rehber görüşme köprüsü (R1-QW3) ·
friction-reducer satırı (R3-Line6, "2 dakikada" parçası [DOĞRULANMAMIŞ]
hariç) · risk-reversal mikro metni (R2, "ödeme bilgisi istenmez"
[DOĞRULANMAMIŞ] teyit ister) · teklif kapsamı tanımı (R3-Verdict2).
Ayrıca kapsam-dışı kalıcı: ceza tutarı niceleme (R3-Line4) APILEX teyidi
ister. [DÜZELTME 28.07 gece] "CF Web Analytics KURULU" kaydı ÖLÇÜMLE
YANLIŞLANDI: canlı ana sayfada 22 ağ isteğinin 0'ı analitik, DOM'da beacon
yok. KURULU DEĞİL, ziyaretçi verisi toplanmıyor. CSP izni hazırlandı;
panel adımı kullanıcıda (rapor/dagitim-durumu.md §4).

GÖRÜNMEYEN VARLIK TEŞHİRİ — MERGE EDİLDİ (28 Tem 2026, ön-onaylı; merge
29dbc9c). /arsiv/ künye sayfası (8 veri seti) + ana sayfa KANIT BANDI
(472 kütle · 419 RG kaydı · 155 kurum). Seçim kriteri ölçülebilir, elenenlerin
gerekçesi src/data/vitrin.js'te kalıcı. Sayıların TAMAMI build'de sayılır.
Ölçüldü: gerileme 0/173 · sitemap 173→174 KAYIP 0 · llms 174→175 · kontrast
95 düğüm ihlal 0 · konsol 0 · yatay kaydırma 0 · S1 KORUNDU (716-765).
Süreklilik: /arsiv/ çekirdek sete (9→10); yeni araç arac/vitrin-denetim.mjs.
KULLANICI CANLI ONAYI BEKLİYOR (görsel iş — kanıt bandı).
İL SAYFASINA BLOK EKLENMEDİ: ölçüm, il ölçekli varlıkların tamamının
IlPotansiyel'de zaten basıldığını gösterdi (brief 1 blok izni kullanılmadı).

KAPATMA KAYITLARI — İL İDDİASI OLMADAN YAYIMLANDI (28 Tem 2026, kullanıcı
kararı): 23 kayıt /arsiv/ içinde tek liste — RG tarihi + durum + kaynak
bağlantısı + pasaj alıntısı. İl ataması YAPILMADI, il sayfalarına BASILMADI,
"hangi ile ait olduğu doğrulanmadı" şerhi kondu. Ölçüm: künyelerde il adı
0/23. SAHA ADI ALANI KULLANILMADI — ölçüldü: saha_adi 0/23, pasajdan çıkarım
11/23 ama temiz yalnız 6/23 (%26; bakan soyadı öneki "ÖZDEMIR/UYSAL", tarih
parçası). Yerine RG'nin kendi metni alıntılandı (mevcut pot-pasaj deseni).
Ayrıntı: VITRIN-RAPORU.md §FAZ 3-EK. KULLANICI CANLI ONAYI BEKLİYOR.

RG SAYI ÇIKARIMI — YAPILDI (28 Tem 2026). Gazete sayısı künyeli kayıt
109 → 363/419. Yöntem: RG arşiv URL dosya adı = gazete sayısı
(/arsiv/11581.pdf → 11581); src/data/rg-sayi.js.
İKİ BAĞIMSIZ DOĞRULAMA: (K1) zemin doğruluğu — 109 başlık kaydında rg_sayi
(API `resmiGazeteSayisi`) ile kaynak_url (API `url`) AYRI alanlardan gelir,
yani kıyas döngüsel değil: 109/109 eşleşti, çelişen 0. (K2) tarih
monotonluğu — 109 bilinen çiftte ihlal 0; türetilen 254 sayının 254'ü
eğriye oturdu. K1 HER BUILD'DE koşar; falsifikasyon: türetime +1 sapma
sokuldu → build exit 1 ("109 kayıt çelişti").
PASAJ ÇIKARIMI REDDEDİLDİ: URL ile örtüşen 30 kayıtta 29 uyuştu, 1 çatıştı
(26.07.1977 — URL 16008, pasaj 18001; tarih eğrisi 1977 için ~16000 diyor,
18001 ≈ 1983 → iki sütunlu taramanın OCR'ı sayıyı bozmuş). Tek doğrulanamayan
çatışma alanı güvenilmez kılar.
GÖRÜNÜM: türetilen sayılar * ile işaretli ve yöntem şerhi sayfada
(/arsiv/ + il sayfaları). Türetilemeyen 56 kayıtta (ilan sayfası URL'si
sayı taşımaz) alan BOŞ — uydurulmadı; kapatma listesinde 16 sayılı / 7 boş.
Ölçüldü: gerileme 0/174 · kontrast ihlal 0 · konsol 0 · S1 korundu ·
81 il sayfasında 522 künyenin 445'i sayılı (343'ü çıkarım).
AÇIK KALAN: 56 kayıtta sayı yok — RG ilan sayfası URL'si (/ilanlar/
eskiilanlar/YYYY/MM/...) sayı taşımıyor. Gerekirse o sayfaların HTML
başlığından çekmek ayrı iş; şimdilik alan boş bırakıldı.

[ESKİ TANIM] 🔵 RG SAYI ALANININ KAYNAKTAN ÇIKARILMASI (28 Tem 2026, kullanıcı
kararıyla ayrı iş olarak açıldı): 419 RG kaydının 310'u (ilan pasajı
kaynaklı) `rg_sayi` alanı TAŞIMIYOR; 109 başlık kaydında var. Kapatma
alt kümesinde 0/23. Etki: künyeler "RG tarih + URL" ile sınırlı kalıyor,
"tarih + sayı" standardı uygulanamıyor.
YAPILACAK: (a) pasaj metninde geçen "Sayı: NNNNN" / "Resmî Gazete ilan sayısı
NNNNN" kalıplarının çıkarılması — ölçülen örnekler var (ör. 05.05.1980
pasajında "Sayı: 16979", 03.06.2011 pasajında "ilan sayısı 13669");
(b) çıkarılamayanlar için kaynak_url'deki arşiv dosya adından türetme
denemesi (ör. /arsiv/11581.pdf → sayı 11581 — başlık kayıtlarında bu
eşleşme DOĞRULANABİLİR, önce orada sınanmalı);
(c) HER çıkarım kendi pasajına/URL'sine karşı doğrulanır ve doğrulama oranı
raporlanır (GUNLUK 28.07 kuralı) — %100 değilse alan yayımlanmaz, yalnız
veri dosyasında `rg_sayi_kaynak: "cikarim"` etiketiyle durur.
BİTTİ TANIMI: kaç kayıtta sayı çıkarıldı + doğrulama oranı ölçülür; /arsiv/
künyeleri ancak doğrulanan kayıtlarda "tarih + sayı" gösterir.

[ESKİ KAYIT — durdurma gerekçesi, tarihçe için korunuyor]
🔴 FAZ 3 DURDURULMUŞTU (RG "tahsise kapatma/kısıt" 23 kaydı):
Brief bu kayıtların il sayfalarında gösterilmesini istiyordu; iki şart da
veriyle karşılanmadı. (1) Künye: 23/23 kayıtta rg_sayi YOK (URL var).
(2) İl ataması güvenilmez — 30 il-kayıt eşleşmesinin en az 7'si dayanaksız
ya da SAHTE (~%23). Kanıtlanan tuzaklar: Van←"A. ÖZALP" (bakan imzası,
ilan Antalya) · Samsun←"Gölü Havzaları" (ortak isim, ilan Ankara) ·
Denizli←"Çardak Köyleri" (Nevşehir köyü) · Gümüşhane←"Kürtün Irmağı"
(Samsun ilanı) · Burdur←krom madeni kararnamesi (RG fihrist sayfası).
Kök neden: pasajlar iki sütunlu RG sayfalarının OCR'ı; satırlar komşu
sütundan sızıyor, bazı kayıtlar birden çok ilanın parçasını taşıyor.
NOT: 23/23'te gerçek yasak/kısıt dili VAR — sınıflandırma savunulabilir,
sorun kaydın hangi İLE ait olduğu.
YAPILACAK SIRA (iddiada yavaş / Kuyu Çıkar Mı emsali): veri düzeltme
(rg_sayi çıkarımı + il atamasının pasaj-içi doğrulanması, sütun ayrıştırma)
→ keşif raporu → [SERDAR-HUKUK] onayı → uygulama briefi. Ayrıntı ve tam
kanıt tablosu: VITRIN-RAPORU.md §FAZ 3.

S1+K2 UYGULAMASI — MERGE EDİLDİ (28 Tem 2026, ön-onaylı; mock kapısı
kullanıcı kararıyla kaldırıldı; merge 896d8b1). İki iş:
· S1 MOBİL İLK EKRAN: "Ruhsatsız kuyu cezası aldım" sorusu 375 kadrajı
  İÇİNDE (945-994 → 716-765). CSS-yalnız, 3 kural mobil kapsamda; masaüstü
  BİT-EŞİT kanıtlı (index.html CSS-hash normalize = özdeş; 1440 altı soru
  koordinatı önce=sonra birebir). Ödün (CSS yorumunda): mobil görsel sıra ≠
  DOM/odak sırası (tek öğe). KULLANICI CANLI ONAYI BEKLİYOR (İş kapanış
  kuralı — görsel iş; kanıt: cikti/denetim/s1k2/).
· K2 URL TAŞIMASI: /arac/il-rejimi/ → /ilimde-kim-yetkili/ (taslak-6 v2
  birebir: 4 dosya + 2 yorum + rota + _redirects 2 satır + beklenen-301.json;
  /arac/ bölümü kapandı, bolumAdlari temizlendi). Gerileme 0/172; sitemap
  kayıp yalnız taşınan rota. AÇIK İZLEME NOTU: 4-6 hafta sonra (≈ 25 Ağu -
  8 Eyl 2026) GSC Performans'ta eski/yeni URL tıklama devri kontrol edilir;
  eski URL'nin "sayfa yönlendirme içeriyor" durumu HATA DEĞİLDİR. İsteğe
  bağlı hızlandırıcı (kullanıcı paneli): URL Denetimi → yeni URL indeksleme.

[KAPANDI 29.07 M3; 25.08'de 7/7 ÖLÇÜLDÜ] site-saglik.mjs --test 6/7 (ölçüldü 28 Tem 2026, kapı işi
sırasında): senaryo (i) "CSP media-src kaldırıldı → md4 🔴" KALIYOR. Kapı
dalında da ana depoda da AYNI (6/7) — kapı işinin ürünü DEĞİL. Hipotez
(kontrol edilmedi): 27.07'deki md4 revizyonu kontrolü zaman-döngüsü ölçümüne
çevirince senaryo bayatladı, artık CSP'ye duyarlı değil. Bu, sağlık
sisteminin kendi öz-testinde sürekli bir kırmızı bırakıyor — "bilinen arıza"
sayılmaya başlarsa md4 revizyonu dersinin ikizi doğar. Yapılacak: senaryo (i)
md4'ün YENİ ölçüm biçimine göre yeniden yazılsın ya da gerekçeli kaldırılsın.

SU POTANSİYELİ KATMANI — 81 İLDE, KAPANDI (kullanıcı canlı onayı 28.07.2026)
(merge edildi 27 Tem 2026 / 5e08611; iş kapanış kuralı gereği etiket
kullanıcı canlıda onaylayana kadar açık kalır): "Bu ilde su nerelerde
çıkabilir?" bloğu 81 il sayfasında. Pilot onaylı;
81-il denetimi: blok 81/81, öz-cevap ≤280 (maks 237), kütle satırı 354/354,
kırık link 0/9665, gerileme 0 (kanıt: cikti/denetim/potansiyel-pilot/ +
rapor/potansiyel-faz*.md). Açık kalemlerin durumu (28.07): OpenAlex 32 il KAPANDI (81/81) · ilçe
dizini çapraz doğrulama KAPANDI (0 fark) · RG izleme cron KURULDU · TWI
ölçüldü, sığmıyor (havza-bazlı tasarım açık) · 3 belirsiz kütle DURUYOR ·
koordinat ikinci geçişiyle doğrulanamayan kütle 153 → 120.

TWI YENİDEN DEĞERLENDİRME (27 Tem 2026, kullanıcı kararı): Faz 5 TWI'yi
"4GB yetmez" bayat varsayımıyla atlamıştı; sunucu gerçekte 8GB (ölçüldü).
ÖLÇÜLDÜ (28 Tem 2026, arac/twi-kapi.py) — TÜM-TÜRKİYE MOZAİĞİ SIĞMIYOR:
ölçek testi 1x1/2x2/3x3 karo → s/Mpx 7,73→9,30→10,44 (süperlineer,
priority-flood O(n log n)), tepe RSS 144→380→771 MB (marjinal 54,3 MB/Mpx).
230 Mpx mozaiğe ekstrapolasyon: ~12,6 GB RAM gerekir, 5,9 GB var → KAPI
GEÇMEZ. (İlk dizi-sayımı tahmini 5,76 GB idi ve YANLIŞTI.) morfoloji.json
gerekçesi bayat "2C/4GB" metninden ölçülen değere güncellendi.
AÇIK KALAN — HAVZA-BAZLI D8 BRIEFİ: 25 havza ayrı işlenirse hidrolojik
olarak DOĞRU (akış havza sınırını geçmez, yaklaşıklık değil) ve sığar
(en büyük havza ~2,8 GB, toplam ~0,9 saat). UYGULANMADI: doğrulanmamış
hidroloji modeli kamuya açık, maddi karara yönlendiren veri katmanına
"iddiada yavaş" ilkesi gereği sokulmaz. Ayrı brief ister.
Kanıt: cikti/denetim/faz-f/twi-kapi-olcum.json

KALICI RG İŞLETME-SAHASI İZLEME CRON'U — KURULDU (28 Tem 2026,
kullanıcı onayı; crontab: Sal 04:20 UTC, arac/rg-nobetci.py --kosum).
Kanıt: --test koşumu 109 satır ayrıştırdı, kaynaksız 0, arşivde zaten
var 109 → yeni 0. Varsayılan kip TEST (yazım/gönderim yok).
AÇIK KALAN KAPANDI (M13 29.07 + 25.08 doğrulaması): nöbetçinin sessiz ölümü artık bekçide —
izleme/state/rg-nobetci-durum.json tazeliği saglik-bekcisi.sh'e canlılık
kalemi olarak eklenmeli (dosya ilk koşumdan sonra doğacak).
[ESKİ TANIM] RG /Home/Filter JSON ucuyla
"yeraltısuyu işletme sahası" (+ayrı yazım) başlık/ilan araması periyodik
koşup yeni kayıtları isletme-sahalari*.json'a ekleyecek; site-saglik
veri-bütünlüğü kontrolüne bağlanacak (SÜREKLİLİK İLKESİ). Altyapı hazır:
arac/rg-tara.py + arac/rg-icerik-tara.py.

YENİ AÇILAN KALEMLER (28 Tem 2026, gece paketi tam-sistem denetimi):

1. ANA SAYFA ÖZ-CEVAP — KAPANDI (28 Tem 2026, kullanıcı kararı):
   ana sayfaya blok EKLENMEZ, v0 tasarımı korunur. Gerekçe: öz-cevap İÇERİK
   sayfalarının (rehber, havza, il, araç) desenidir, landing'in değil;
   landing'in işi ziyaretçiyi doğru içerik sayfasına yöneltmektir, cevabı
   orada verir. CLAUDE.md "İçerik ilkesi" kapsamı da "her içerik sayfası"
   der. Ana sayfanın meta-description'ı ve JSON-LD'si AI-alıntı yüzeyini
   ayrıca karşılıyor (ölçüldü: title/meta-desc/canonical/JSON-LD/OG 5/5).
   UYGULAMA: izleme/cekirdek-sayfalar.json'da `/` için `"muaf": ["ozCevap"]`
   + gerekçe. Muafiyet md7 mesajında AÇIKÇA görünür ("muaf: /(ozCevap)"),
   sessizce gizlenmez. Kanıt: canlı --tam koşumu → kırmızı 0.

2. /harita/ h1 — KAPANDI (28 Tem 2026, kullanıcı kararı): DEĞİŞİKLİK
   YAPILMAZ. Sayfanın kuralı SALT HERO, üstünde öğe yok; hiyerarşi <h2> ile
   başlar, <h1> hiç yoktur. Bu bir tasarım kararıdır, arıza değil. Kural
   src/pages/harita.astro başlığına yazıldı ki denetim tekrar bulgu olarak
   açmasın.

3. public/s/*.js BUILD HATTINI ATLIYOR — "Kopyalanma direnci" m.1-2 ihlali.
   Altı dosya (su-sim 9.309 B/12 yorum, imlec 5.571/6, sayfa 2.318/5,
   canlan, durumum, hangi-kurum) Türkçe yorumlarıyla AYNEN yayımlanıyor;
   `public/` Astro/Vite tarafından işlenmez. _astro/ varlıkları kurala uyuyor
   (sourceMappingURL 0). Düzeltme: src/scripts/ altına taşıyıp hatta sokmak
   ya da astro:build:done kancasında esbuild (minify, sourcemap:false).
   Bitti tanımı: canlı /s/*.js 404 VEYA minify; yorum satırı 0; Lighthouse
   ≥90 korunur; md4/md5/md12 yeşil kalır. NOT: imlec.js ve sayfa.js
   Sayfa.astro:519-520'den yükleniyor, taşımada is:inline kalkmalı.
   (Ek gözlem: silinmiş menu.js hâlâ Cloudflare edge cache'inden 200
   dönüyor — s-maxage 604800; hiçbir sayfa link vermiyor, 7 güne kadar.)

4. SIRADAKILER HİJYENİ — bu dosya 900+ satır, 41 açık madde, 13 "ONAY
   BEKLİYOR" (5'i [ESKİ] tarihsel). Her oturum başında okunması gereken
   dosya artık taranamıyor. Öneri: kapanmış maddeler
   arsiv/SIRADAKILER-2026-07.md'ye taşınır, ana dosya açık maddelerle
   sınırlanır.

5. BRIEF.md YOL HARİTASI GERÇEĞİN GERİSİNDE — Aşama 1/2/4 hâlâ [ ] işaretli;
   oysa KAYNAKLAR.md var, 172 sayfalık içerik katmanı canlı (11 rehber +
   82 il + 26 havza). BRIEF'teki "2 vCPU/4GB" kaydı da bayat (gerçek 4C/8GB,
   CLAUDE.md'de düzeltilmiş). Çatı belge gerçeği yansıtmalı.

6. [KAPANDI 29.07 M13; 25.08'de bekçide ölçülerek doğrulandı] NÖBETÇİLERİN CANLILIK KALEMİ (SÜREKLİLİK) — rg-nobetci ve
   nhyp-yayin-nobetci crona kuruldu (Sal 04:20 / Çar 04:40 UTC) ama kendi
   sessiz ölümlerini kimse görmüyor. İlk koşumdan sonra
   izleme/state/{rg-nobetci-durum,nhyp-yayin-durum}.json doğacak; tazelikleri
   saglik-bekcisi.sh'e canlılık kalemi olarak eklenmeli (grace/su-izleme
   deseniyle aynı).

7. md13 KONTRAST — KAPANDI ama izlenmeli: /'de span.no 1,58→3,50:1,
   /hangi-kurum/ .ik-teyit 4,42→5,63:1, .ik-paylasim 4,52→5,60:1 (sonuncusu
   ihlal değildi, payı 0,02'ydi). Canlıda md13 GEÇTİ, en dar pay 3,5:1.
   izleme/kontrast-ornek.json istisna listesi BOŞ — istisna yazma yetkisi
   kullanıcıda.

8. SU KANUNU NİSAN 2026 TASLAĞI — izlemeye alındı (28.07 kullanıcı kararı),
   YALNIZ İZLEME. Belge depoya girmez (veri/ham/, gitignore), siteye içerik
   basılmaz, istek görgüsü değişmedi. Üst yazı (TOBB 24.04.2026) kamuya açık
   yayımı men ediyor. AÇIK: taslak yasalaşırsa/resmî yayımlanırsa içerik
   üretimi yeniden değerlendirilecek. Eski hedef (2019 sürümü) korunuyor.


SAGLIK SISTEMI — LIGHTHOUSE TEK ATIŞ (27 Tem 2026, KULLANICI KARARI BEKLİYOR)
`arac/site-saglik.mjs:447` Lighthouse'u sayfa başına BİR KEZ çağırıyor.
CLAUDE.md kuralı "3 tur medyan" diyor. Ölçüldü: aynı build'de mobil puan
82-99 arasında oynuyor — sistem düzenli olarak yanlış regresyon alarmı
üretecek. Performans eşiği otomatik onarım KARA LİSTESİNDE olduğu için
DEĞİŞTİRİLMEDİ. Karar: 3 tur medyana çevrilsin mi (koşu süresi ~3 katına
çıkar), yoksa eşik gevşetilsin mi?

AĞIRLIK KAYDI (27 Tem): IA turu + D3-A sonrası ortalama HTML sayfa
24,3 → 28,9 KB (+%19), havza sayfası 40,8 → 50,2 KB, /durumum/ aktarılan
bayt +%11,6 · DOM +%11,8. Lighthouse'a yansıması ayırt edilemedi.

ANA SAYFA v2 (emilkowalski + v0 spesifikasyonu) — CANLIDA (2026-07-27,
merge c7fbe40→de01fbd + push + canlı doğrulama; ayrıntı GUNLUK). v0 ince
ayar turu (A=28 fark) dahil; 13 GEO commit'i de aynı merge ile yayınlandı.
Kullanıcının canlı görsel onayı nihai kapanış. Açık maddeler:
- [x] Sondaj kartı — KAPANDI (27.07): /havzalar/ hedefine bağlandı;
      "su nerelerde çıkabilir" sorusu da /havzalar/'a eşitlendi (0.8:
      YAS potansiyeli 25 havza sayfasında basılıyor; /harita/ değil).
      Aynı sayfada iki giriş aynı hedefe — kasıtlı.
- [ ] SITE-DURUM 🔴 (GRACE tazeliği 262,6 gün) — bu iş kapsamı dışında
- [ ] "Su nerelerde çıkabilir" cevabı nerede — HENDEK FAZ 2.5 (yeraltı suyu
      potansiyeli katmanı) yapıldı mı, YAS verisi 25 havza sayfasında
      basılıyor mu, sıralama sayfası var mı. Ana sayfadaki soru şu an
      geçici hedefe bağlı (/harita/).
- [x] MENÜ TUTARSIZLIĞI — KAPANDI (27.07, menu-2026-07-27 canlıda):
      174 sayfada tek PaylasilanMenu; koşullu çapa (/#), Veriler 10 rota
      (+/hakkinda/), vitrin (son 3 rehber + kanun son durum + havza)
      menü paneline taşındı — kaybolan bağlantı 0.
- [x] Eski menü dosyaları — SİLİNDİ (27.07 temizlik, kullanıcı onayıyla
      M10 kaldırıldı): UstMenu.astro · TamEkranMenu.astro · UstBar.astro
      (iteratif eleme: UstBar+UstMenu tur 1, TamEkranMenu tur 2 —
      tek referansı öksüz UstMenu'dendi). KORUNAN: data/menu.ts
      (PaylasilanMenu kullanıyor) · public/s/menu.js (174 sayfada
      <script src> hâlâ çağırıyor — 2.4 kuralı).
- [x] /s/menu.js — KAPANDI (27.07 menujs turu, aff52eb canlıda):
      NO-OP kanıtlandı (üç kanal: sv-menu id'si 0 sayfada, guard çift
      koşullu; kökte document/window dinleyicisi yok; koşulsuz yan etki
      yok). Üç script etiketi + harita-pilot'taki öksüz tetik düğmesi +
      .sv-menu-ac CSS'leri kaldırıldı, dosya silindi; canlıda 404,
      referans 0, ~1 istek/sayfa kazanıldı. Kalıntı not: /s/imlec.js
      'sv-menu-goruntude' sınıfını okuyor — sınıf artık hiç oluşmuyor,
      zararsız ölü dal (imleç sistemi ayrı iş).
- [ ] Öksüz kalan bileşenler (silme kararı kullanıcıda, M10):
      src/data/anasayfa-sorular.js (7-soru güverte seti; artık hiçbir sayfa
      import etmiyor) · src/scripts/scrub-engine.js index kullanımı düştü
      (yalnız /harita-pilot/ noindex arşivi kullanıyor) · eski sayfa
      arsiv/anasayfa-guverte-v3/index.astro.
- [ ] Logo dosyası kullanıcıdan (logo-su-hukuku.png yok — metin marka
      kullanıldı).
- [ ] Gerçek deneyim yılı / dosya sayısı (v0'ın "15+ yıl / 500+ dosya /
      %98" uydurmaları M7 gereği YAZILMADI; yerine build'de sayılan
      25 havza · 81 il · 10 rehber).
- [ ] Telefon numarası: künyede doğrulanamadı → blok konmadı. "İstanbul"
      konumu da sitede doğrulanamadı → konum bloğu konmadı.
- [ ] Form altyapısı: şu an mailto (JS ile gövde; JS'siz doğrudan link).
- [ ] review-animations bulguları raporlandı, UYGULANMADI (brief 3.1;
      liste: cikti/denetim/anasayfa-v2/RAPOR.md).
- [ ] Hero alt metni: GEO için yazılmış 280'lik öz-cevap kullanıldı (K-3);
      pazarlama metni olarak gözden geçirilmeli.
- [ ] TBB gözden geçirme (rapor notu): "Ücretsiz Ön Görüşme Alın" /
      "Randevu Al" çağrıları v0'dan; sitenin mevcut "davetsiz/nesnel" TBB
      duruşundan ayrışıyor — hukuki değerlendirme kullanıcıda.

/HANGİ-KURUM/ SAYFASI — KAPANDI (kullanıcı canlı onayı 28.07.2026; ilk kayıt 2026-07-23). Su işlemlerinde
yetkili kurum rehberi: build-time hangi-kapi.json (20 işlem) + su-birimleri.json
(155 kurum) + su-islemleri.json'dan üretildi; üstte tek-tık filtre (details),
altta JS'siz tam tablo. FAQPage yalnız 11 doğrulanmış satır. Kanıt: LH masaüstü
98/mobil 85, kontrast AA, konsol 0, 375 taşma 0, link 0 kırık
(cikti/denetim/hangi-kurum/RAPOR.md). Menü iki kaynağa eklendi. AÇIK: brief "tel"
istedi, doğrulanmış numara yok → e-posta+künye kullanıldı; kullanıcı numara
verirse eklenecek. Kullanıcının canlı testi bekleniyor.

BRIEF DENETÇİSİ — KURULDU (2026-07-23). Her brief uygulanmadan önce
`node arac/brief-denetci.mjs <cikti/brief/dosya>` + düşman geçişi (D1-D4) +
amaç özeti (3b) yapılır; ENGEL uygulamayı durdurur. Kural kaynağı:
arac/brief-kurallari.json (kayıt-türetilmiş, T1-T8). Kurulum + 7 senaryo +
öz-denetim: rapor/brief-denetci.md. Kural CLAUDE.md "Brief denetçisi — ön
kapı kuralı"nda. Yeni kural doğunca (GUNLUK hata kaydı) json güncellenir.
BİLİNEN EKSİK: site-saglik v5 briefi diske kaydedilmemişti (denetlenemedi);
araç use/mention ayrımı yapamaz (meta-briefler elle değerlendirilir).

KUYU ÇIKAR MI — keşif tamam (bf8e5fd); KULLANICI DEĞERLENDİRME OTURUMU
bekleniyor, otomatik kur briefi YASAK. Sıra: keşif raporu → değerlendirme
oturumu (yayına değer mi / sorumluluk çerçevesi / saha doğrulaması) →
[SERDAR-HUKUK] onayı → uygulama briefi. (İlke: ODUL-USTU.md "Korunacaklar"
— altyapıda hızlı, iddiada yavaş.)

SÜREKLİ SİTE SAĞLIK SİSTEMİ — KURULDU (2026-07-23, commit 975a288).
arac/site-saglik.mjs: 10 kontrol, üç mod (--tam cron 07:30+19:30 UTC, --hizli
deploy sonrası, --test sanal doğrulama). Sınırlı otomatik onarım (beyaz liste)
+ kara liste (performans/tasarım/içerik/JSON-LD/veri kaynağı/mimari = DUR).
Ortak git kilidi 4 commit'çide kurulu; bekçinin bekçisi saglik-bekcisi.sh'te.
Kanıt: cikti/denetim/site-saglik/ (RAPOR.md + 7/7 test senaryosu + ilk tam
koşu + SHA-bekleme + bellek kuralı + kilit deneyi + crontab kaydı).
Sistem ilk koşuda 3 kırık iç link buldu (persona.json yanlış slug) — elle
düzeltildi, şimdi 167 linkte kırık 0.
KAPANDI (2026-07-23, b709c46): /harita/ öz-cevap + JSON-LD eklendi
  (WebPage + Dataset; şema gerekçesi RAPOR.md §6). SITE-DURUM.md artık
  🟢 YEŞİL — 10/10 kontrol geçti. Öz-cevap "canlı baraj doluluğu" DEMEZ:
  o veri bu sayfada yok, havza sayfalarında (uydurma yasağı).
YENİ KUYRUK MADDESİ — sağlık sistemi a11y açığı: md.9 Lighthouse yalnız
  `performance` ölçüyor. Somut bulgu: /harita/ MENÜ düğmesi (position:fixed,
  --kopuk) aydınlık panel üstünde düşük kontrast — FAZ 3'ten beri var, a11y
  kategorisi ölçülseydi yakalanırdı. Yapılacak: onlyCategories'e
  'accessibility' eklenip eşik tanımlanması + düğmenin panel bölgesinde DİP
  tonuna dönmesi (DESIGN.md kararı).
BEKLEMEDE: SMTP bilgileri (.env'de SMTP_HOST/SMTP_USER/SMTP_PASS/ALARM_TO).
  Gelince e-posta alarmı açılır + sentetik 🔴 ile test maili atılır.

ANA SAYFA — MENÜ/SÜZÜLME/ÖNCELİK v3: FAZ 1 (MENÜ ARIZASI) DÜZELTİLDİ,
KAPANDI (kullanıcı canlı onayı 28.07.2026). Kök neden REGRESYON DEĞİL, eski arıza:
akis-bitti (kaydırma dibi/scroll-restorasyonu) menü şeridini
pointer-events:none yapıyordu → menü ölü açılıyordu. Düzeltme: dipte menü
söndürülmez, aydınlık iniş üstünde okunaklı+açılır kalır (C paleti). EKLENDİ:
site-saglik md12 ETKİLEŞİM DENETİMİ (varlık değil işlev; menü/filtre/arama/bağ)
— falsifikasyonla kanıtlı (bozuk menü→md12 KIRMIZI). Kanıt:
cikti/denetim/menu-arizasi/RAPOR.md; 375 konsol 0/taşma 0. DUR — kullanıcı
canlıda menüyü doğrular (masaüstü+mobil, scroll-restorasyonu senaryosu).
SIRADA: FAZ 2 SÜZÜLME (mock, HAREKETLİ kare dizisi; A güverte İPTAL, opak
güverte kalkar) → FAZ 3 uygulama (süzülme + soru önceliği: su nerede çıkar→
kuyu ruhsatı→ceza; Su Kanunu geri çekilir). FAZ 2/3 ayrı commit, DUR'lu.
[TAMAMLANAN v3-öncesi] SORU HİYERARŞİSİ Aşama 2 (soru güvertesi) uygulanmıştı;
FAZ 2/3 bu güverteyi süzülmeyle DEĞİŞTİRECEK.
[ÖNCEKİ] ANA SAYFA — SORU HİYERARŞİSİ v3: AŞAMA 2 (KOD) UYGULANDI, KULLANICI ONAYI
BEKLİYOR (2026-07-23). Kararlar A/S2/iniş-kalksın/hedef-sabit uygulandı:
soru güvertesi (sahne üst bant, opak DİP panel → garantili AA 13,91:1),
öz-cevap ilk ekranda, "Su nerelerde çıkar?" S2 native <details> dürüst cevap
(/harita/ + garanti-değil uyarısı), iniş sektör ızgarası kalktı, --kehribar-koyu
DESIGN.md'de emekli. Motor/video/scrub DOKUNULMADI (6/6 sahne readyState 4).
Kanıt cikti/denetim/anasayfa-asama2-v3/: konsol 0, link 0, 375 taşma 0, 7/7 soru
ilk ekranda (öncesi 2/7), LH masaüstü 98/mobil 87 (mobil 85'ten iyileşti),
kontrast hepsi AA. Denetimde .s-uyari özgüllük hatası yakalanıp düzeltildi.
AÇIK KULLANICI GÖREVİ: (1) canlı test = nihai onay (scrub akıcılığı GPU'suz
kanıt sayılmaz + S2 hissi), (2) Cloudflare Purge. Geri dönüş: tek commit revert.
[AŞAMA 1 MOCK] Canlı ölçüm 3 şikâyeti doğruladı; A/B+S1/S2+sektör mock'landı
(cikti/denetim/anasayfa-soru-hiyerarsi/, yerel).
[ÖNCEKİ] ANA SAYFA — 6 SAHNE + 7 SÜZÜLEN SORU: AŞAMA 2 + CANLI TEST DÜZELTMELERİ
UYGULANDI; KAPANDI (kullanıcı canlı onayı 28.07.2026). [ilk kayıt 2026-07-23] Canlı ölçüm (dist-sun) 3 şikâyeti de
doğruladı: scroll 0'da yalnız 2/7 (1440) / 1/7 (375) soru görünür, öz-cevap+
sektör kartları %93 aşağıda (iniş bölümü); şerit kontrastı iyi, sorun konum+
belirginlik. İki alternatif: A "soru güvertesi" (sahne %52, opak DİP panel →
garantili AA, öneri) / B "süzülen büyük soru" (sinematik, AA riski Aşama 2'de
ölçülür). Boş kapı S1(6 soru)/S2(kalır+dürüst cevap). Sektör kartları cevap
içine (türetme: ilgiliIcerik∋/su-kanunu/=35 persona; D4: son-tarih berabere,
ikincil sıra gerekli). /hangi-kurum/ çakışması yok (farklı eksen). LH tabanı
masaüstü 99/mobil 85. Kanıt: cikti/denetim/anasayfa-soru-hiyerarsi/ (RAPOR.md
+ 6 kare + faz0 ölçüm). DUR — 4 karar: (i) A/B, (ii) S1/S2, (iii) iniş sektör
kaderi, (iv) /hangi-kurum. Onaysız Aşama 2 (kod) YOK.
[ÖNCEKİ] ANA SAYFA — 6 SAHNE + 7 SÜZÜLEN SORU: AŞAMA 2 + CANLI TEST DÜZELTMELERİ
UYGULANDI; KAPANDI (kullanıcı canlı onayı 28.07.2026). [ilk kayıt 2026-07-23] Koyu hero kalktı, sahne
akışı açılış oldu; R2 alt şerit; akış sonu iniş bölümü; /deneyim/ 301 → /.
Canlı testte çıkan üç arıza kapatıldı (üç ayrı commit, ayrı ayrı revert
edilebilir — RAPOR.md "GERİ DÖNÜŞ"):
  FAZ 1 (385be5a) SAHNELER OYNAMIYORDU. Kök neden CSP: _headers'ta `media-src`
    yoktu, `default-src 'self'` motorun blob: video kaynağını reddediyordu
    ("Media load rejected by URL safety check"). Fetch 200 dönüyordu, engellenen
    yalnız decode'du — bu yüzden ağ ölçümü arızayı göstermiyordu. Ayrıca sahne
    adı hapı (.sw-route__label) görsel katmandan çekildi (a11y adı korunarak).
  FAZ 2 (aff6fd2) ŞERİT GÖRÜNÜRLÜĞÜ. Ölçüm: 1440'ta şerit kadrajı 11px
    ÖRTÜYORDU, 375'te kadrajdan 181px KOPUKTU. Sahne kabı kadrajın kendisi
    kadar yapıldı, şerit onun 12px altına kilitlendi — iki kırılımda da 12px,
    örtüşme 0/14. Kırpma yok. Zincir yeniden ölçüldü: scrub/ritim/crossfade/
    preload DEĞİŞMEDİ.
  FAZ 3 (a45e786) "Barajlarımızda ne kadar su var?" → /havzalar/ (baraj doluluk
    verisi havza sayfalarında; /harita/ panelinde yok). Sıralama değişmedi,
    gerekmedi: iki /havzalar/ sorusu 4. ve 6. sırada, komşu değil; assert
    olduğu gibi geçti. Yan düzeltme: 375'te kırpılan tek soru için mobil etiket
    kısaltıldı, 7/7 sığıyor.
Kanıt: cikti/denetim/anasayfa-duzeltme/ (RAPOR.md + faz0-teshis.json +
40 kare + zincir/LH JSON'ları) ve cikti/denetim/anasayfa-asama2/.
Ölçüm: LH 3-tur medyan masaüstü 99 (eşik 85) / mobil 86 (eşik 70); 6/6 sahne
canlıda readyState 4 + currentTime 2,60; konsol 0, kırık link 0, taşma 0.
YENİ DENETİM ARACI: arac/dist-sun.mjs — dist'i Cloudflare gibi (CSP +
_redirects) servis eder. `python3 -m http.server` _headers'ı uygulamadığı için
CSP arızası yerelde HİÇ görünmüyordu; bundan sonra denetimler bu sunucuda.
AÇIK KULLANICI GÖREVİ: (1) canlı test = nihai onay, özellikle scrub akıcılığı
(headless GPU'suz, kanıt sayılmaz), (2) Cloudflare "Purge Everything".
Eski landing ve /deneyim/ SİLİNMEDİ: arsiv/landing-koyu/, arsiv/deneyim-rota/.

SAHNELERİN EVİ = ANA SAYFA (22.07 kullanıcı kararı): 6 sahne + 7 süzülen soru
ana sayfaya girer. /harita/ dönüşüm mock'u (fd699ff çıktısı) GEÇERSİZ;
/harita/ veri sayfası olarak kalır. /deneyim/ 301 planı ana sayfa Aşama 2'de
ele alınır. Aşağıdaki /harita/ dönüşüm briefi bu kararla HÜKÜMSÜZDÜR (kayıt
olarak duruyor).

AKTİF BRIEF (HÜKÜMSÜZ — 22.07 kararıyla iptal) — /HARİTA/ DÖNÜŞÜMÜ
(DENEYİM GÖMME v2 NİHAİ): AŞAMA 1 TAMAM
(2026-07-22, kod yok) — KAPANDI (kullanıcı canlı onayı 28.07.2026). Hero kalkar, 6 sahne
scroll-scrub /harita/'ya girer, panel+GEO aynen altta, /deneyim/ kapanır.
Çıktı: cikti/denetim/harita-donusum/ (yerlesim-semasi-1440.png + mock.html +
kareler/ + RAPOR.md). Ölçülen taban: /harita/ LH masaüstü medyan 94, mobil 72
(LCP 8,3sn = ağır hero webp 989KB); 6 video MP4 7,95MB, motor ZATEN lazy
(ilk yük yalnız sahne1 poster 51KB+sahne1.mp4 1,3MB). GEÇİŞ 2 alternatif:
A "yüzeye çıkış" (öneri, panel-reveal cross-blur) / B "kot cetveli eşiği".
KULLANICI KARARI: (1) geçiş A/B, (2) ağırlık tablosu kabul mü. Onaysız
AŞAMA 2 (taşıma + /deneyim/ 301 + menü + link + sitemap + kanıt) BAŞLAMAZ.

FAZ 8 — PALET YENİLEME: KAPANDI (kullanıcı canlı onayı 28.07.2026; uygulama 2026-07-22).
Kullanıcı aday C'yi seçti (mavi zemin + lacivert metin + kehribar kritik
#875518). Uygulandı: DESIGN.md §2 C setiyle yeniden yazıldı (eski palet
arşiv-notu olarak duruyor = geri-dönüş yolu), 191 değişiklik/29 dosya,
LinkedIn kart aracı C'ye alındı. Landing İstisnası + /deneyim/ + harita
adası + harita-2d/3d coğrafi renkler kapsam dışı (gerekçeli).
Kanıt: cikti/denetim/faz8-uygulama/ (RAPOR.md + 12 ekran + kontrast JSON +
LH a11y + değişim listesi). Ölçüm: 30 kontrast çifti AA, kıyas tablosundan
sapma 0; 375 taşma 0, konsol 0, kırık link 0; LH a11y 3-tur medyan 100×3.
Yan bulgu: 3 ÖNCEDEN VAR OLAN AA açığı (menü künyesi 3.04, vitrin özeti
3.77, liste sıra no 2.04) tespit edilip kapatıldı — görsel olarak fark
edilir, canlı testte bakılmalı.
AÇIK KULLANICI GÖREVİ: (1) canlı test = nihai onay, (2) Cloudflare
"Purge Everything" (palet tüm HTML/CSS'e dokundu), (3) eski 3 LinkedIn
kartının C ile yeniden üretilmesi kararı (silinmedi, üzerine yazılmadı).
Sonra FAZ 2 nabız şeridi. Uygulama sırası 1→7→8→2→3→4→5; FAZ 1, 7, 8 TAMAM.

FAZ 7 (Sonuç Zinciri) TAMAM (2026-07-21; AŞAMA 0 162d182 · AŞAMA 1 88c7a72 ·
AŞAMA 2 27dd472, push+canlı): /durumum/ sektör kapısı + 11 persona sonuç
sayfası canlı; pazarlama altyapısı (bülten/LinkedIn/webinar/rapor iskeletleri)
hazır. AÇIK (kullanıcı görevleri): Buttondown hesabı, Google Business Profile,
LinkedIn ritmi, webinar tarihi, GEO nabzı kurulum kararı, büro bilgileri
(künye şeması), vaka adayı seçimi (KAP yeni API ucu), soru havuzu Apilex
doldurma, Ek-2 NACE makine-okunur kaynağı, /durumum/ renk paleti (ayrı iş),
kuyu taşıma içeriği. Canlı test kullanıcıda.

Ödül-üstü programı — çatı: ODUL-USTU.md. Faz 1 (Sözlük ve Borç v2) TAMAM
(2026-07-21, 68e340a push+canlı; kullanıcı canlı testi açık — İş kapanış
kuralı bu brief kapsamında peşin onaylı). /deneyim/ menüye TAMAM (2026-07-21;
UstMenu+TamEkranMenu tek kaynak, landing birebir, 375px kanıtlı). src/harita-3d
arşivde kalır (route yok, teyit). Sıradaki ödül-üstü fazı: v5 sırasına göre
Faz 7 → sonra Faz 2 nabız şeridi.

TAMAM (2026-07-21): Su Kanunu TBMM izleme sistemi v3 KURULDU — izleme/ +
cron (05:30+16:00 UTC) + saglik-bekcisi tazelik kontrolü; T1-T5 kanıtlı
(cikti/denetim/su-izleme/KURULUM.md). ŞERH: ilk gerçek cron fire 16:00 UTC —
canlı teyit beklemede (İş kapanış kuralı). Kaynak keşfi v2 (700f216) da TAMAM.

İŞLENİYOR (2026-07-21): Opus paketi 5 bölüm (A belge arşivi · B kayıt ·
C UYAP künye teyidi · D SEO/GEO denetim skill · E NACE Ek-2 + KAP tarama);
durum tablosu PAKET SONU'nda. Kuyruk sırası korunur.

TAMAM (2026-07-21): GECE PAKETİ v2 — 4 bölüm push+canlı (894d7e3 A ·
459c3c6 B · d3b7a55 C · 08c2566 D). A: NACE Ek-2 OCR (tesseract-tur;
31 ana faaliyet doğrulandı → 31 persona; nace-ek2.json + persona.json).
B: /rehberler/kuyu-tasima/ rehberi (Apilex kaynağı yerleştirildi; ayrı
özel sayfa; hücre birebir; FAQPage+Article; LH a11y/best/seo 100). C:
bellek-log cron */10 + saglik-bekcisi pencere eşiği (4 senaryo test). D:
NACE persona sayfalaşması (durumum index gruplama). Canlı test kullanıcıda.
AÇIK (kullanıcı): (1) durumum iletişim-notu kontrastı — KAPANDI (625e3fe:
#9FB3AD→#C8D2CE, su-700 üstünde 3.44→4.89; LH a11y persona+index 100).
(2) 31 NACE personası küratörlük/budama
kullanıcıda. (3) m.18 güncel ceza tutarı [APILEX teyit]. (4) NACE detay
alt-kod listesi eksik (~58 satır ayrıştırılamadı; gerekirse yüksek-DPI
segmentasyon).

DÜZELTME TURU 1'DEN AÇIK KALANLAR (2026-07-25):

- [ ] Astro 5.18.2 → 6.0.5 ve maplibre-gl 5.24.0 → 6.0.0 ana sürüm
      yükseltmesi. ERTELENDİ (25 Tem 2026). Gerekçe: iki ana sürüm
      atlaması, 175 sayfa + harita bileşenini etkiliyor; denetimde
      güvenlik maruziyetinin düşük olduğu kanıtlandı (npm audit'teki
      3 high'ın tetiklediği özelliklerin hiçbiri kullanılmıyor), acele
      sebebi yok. Sakin bir seansta, tam görsel regresyon kontrolüyle
      yapılmalı. Denetim maddeleri: F1-2 + F3-1 (K4 kümesi), F1-1
      (astro check kurulumu), F1-3 (extraneous paket).

- [ ] Ana sayfa soru doğrulaması: mock-kure.astro:21'de bir build-zamanı
      bekçisi vardı (brief sırasındaki soru anasayfa-sorular.js'de yoksa
      throw). Rota arşive alınınca bu bekçi öldü. Ana sayfada (index.astro)
      eşdeğer bir doğrulama var mı kontrol edilmeli; yoksa eklenmesi
      değerlendirilmeli. DOĞRULANMADI.

- [ ] /harita-pilot/ ve /stil-pilot/ rotalarının akıbeti — karar bekliyor
      (denetim maddeleri F2-2, F2-3). mock-kure ile birlikte
      değerlendirilmedi, kapsam dışı bırakıldı.

1. HEDEF.png hero — YAPILDI: görselin kendisi tam ekran hero oldu; 3D
   atmosfer sahnesi src/harita-3d/ altına arşivlendi (silinmedi)
2. Kullanıcı onayı → canlıya deploy (Production kontrolü)
3. Landing giriş koreografisi + Arslan Hukuk footer imzası — YAPILDI,
   DENETLENDİ (2026-07-14): kelime kelime animasyon + imza kökte MEVCUT
4. www.suharitasi.com custom domain ekleme — YAPILDI (2026-07-14):
   kullanıcı panelden ekledi, test edildi
5. suharitasi.tr → suharitasi.com 301 — YAPILDI (2026-07-14):
   kullanıcı panelden kurdu, çalışıyor (test edildi)
6. Search Console + sitemap — YAPILDI (2026-07-14)
7. Kullanıcı kendi logosunu üretince /harita/ sayfasına logo eklenecek
   (2026-07-14: logo + "konsept görsel" atıfı kaldırıldı, sayfa salt görsel)
8. Sunucu reboot (bekleyen kernel) — YAPILDI (2026-07-14)
9. Faz 3B: kamera + ekrana damla sıçraması (Sondaj Anı-1)
10. Aşama 1 derin kazı: havza GeoJSON + DSİ verisi + KAYNAKLAR —
    YAPILDI (2026-07-14): 25 havza GeoJSON (data/havzalar/, 90KB web
    sürümü) + DSİ 2024 veri künyesi (data/havza-veri.json) + mevzuat
    kütüphanesi + Su Kanunu taslak takibi + Sakarya gerçek veriyle
    dolduruldu. AÇIK KALAN: havza geometrisi resmî kaynakla
    doğrulanamadı (gov CBS yurt dışına kapalı); tahsis verisi yok.
11. Kalan 24 havza sayfası — YAPILDI (2026-07-14): 25/25 havza sayfası
    havza-veri.json künyelerinden üretildi
12. Havza geometrisinin resmî kaynakla doğrulanması (TR IP'den
    geodata.tarimorman.gov.tr / cbs.dsi.gov.tr denenecek)
13. Aşama 2 pipeline → canlı baraj doluluğu (VIZYON-5) — NOT: DSİ
    Tablo 4.7 (havza bazında doluluk 2010-2024) kaynak/dsi/ yolunda hazır
14. Konum tabanlı kişisel açılış (VIZYON sırası 3)
15. İl/kurum katmanı — YAPILDI (2026-07-14): data/il-kurum.json (81 il,
    26 DSİ bölgesi, 25 havza-il listesi) + havza sayfalarında "İller ve
    yetkili kurumlar" bloğu + kuyu-ruhsati rehberinde 81 il tablosu
16. Mevzuat rehberleri paketi — YAPILDI (2026-07-14): 9 rehber
    (Apilex çıktısından, kaynak/apilex-sumevzuat.md) + taslak-takibi'ne
    Bölüm 12 tespiti. YAYIN KİLİDİ: madde 17 kapanmadan yayına alınmaz.
17. Karar künyelerinin doğrulaması (YAYIN KİLİDİ) — 9 rehberdeki tüm
    Yargıtay/Danıştay künyeleri resmî kaynaktan doğrulanacak; özellikle
    çelişkili Danıştay 13. D. künyesi çözülecek: 2020/1104 E.-2023/4576 K.
    vs 2020/1093 E.-2023/2584 K. (kaynak-suyu-kiralama rehberi)
18. Eksik rehber verileri ayrı kanaldan tamamlanacak: su kirliliği
    cezaları (2872/SKKY), koruma alanı yasak listesi, TBB reklam yasağı
    uyumu (KAYNAKLAR.md "VERİ YOK" bölümü)
19a. Tarayıcı öz-denetim altyapısı — YAPILDI (2026-07-14): Playwright
    MCP kuruldu (.mcp.json; yeni oturumda araç olarak aktif), protokol
    CLAUDE.md'de, script yedeği arac/oz-denetim.mjs; deneme denetimi
    temiz (0 hata, 0 kırık link, 3 görüntü cikti/denetim/).
19. Menü + içerik sayfaları görsel yenileme (su hissi) — SÜPERSEDE
    (2026-07-21 kapanış): bu "su hissi" katmanı SU-DİLİ anayasasıyla
    (madde 34 ONAYLANDI + madde 36 FAZ 1) tümüyle değiştirildi; eski
    sürüm sitede yok. Kapatıldı. Tarihsel not aşağıda korunur:
    [ESKİ] KULLANICI ONAYI BEKLİYOR (2026-07-14): ilk sürüm canlıda başarısız (sim
    görünmüyor, imleç topak, şerit soluk); düzeltme b32f7fa push'landı
    (sim görünürlüğü + FPS ısınması + SVG damla + belirgin şerit).
    Kullanıcı canlıda tekrar test edecek; onaysız kapatılmaz.
20. Pazarlama/CRO skill kazısı + danışmanlık raporu — YAPILDI
    (2026-07-14): 25 aday puanlandı, 2 skill seti kuruldu
    (marketingskills + claude-seo, ~/.claude/skills/), 11 sayfa canlı
    tarandı, rapor/pazarlama-danismanligi.md yazıldı (salt analiz,
    uygulama yok).
21. Dalga 1 — rapor uygulaması (İLK 5 HAMLE + 2 ek) — CANLI/ABSORBE
    (2026-07-21 kapanış): landing nav + üç kapı, E-E-A-T künye/yazar
    kutusu, rehber ağı, footer canlıda (curl doğrulandı) ve sonraki
    onaylı işlere (FAZ A-ÖN/A landing yeniden-inşası, madde 42) absorbe
    edildi. TEK AÇIK KALAN: landing WebSite/Organization JSON-LD FAZ A-ÖN
    yeniden-inşasında düşmüştü; WebSite şeması 2026-07-21 düzeltmesinde
    geri eklendi (DUZELTME.md madde 1), Organization/LegalService kapsam
    dışı (TBB dili — künye işi). İlk-sürüm ayrı canlı-onayı GUNLUK'ta
    kayıtlı değil; içerik canlı olduğundan kapatıldı. Tarihsel not:
    [ESKİ] KULLANICI ONAYI BEKLİYOR (2026-07-15): landing nav + üç kapı ("Yakında" kalktı),
    E-E-A-T paketi (künye satırı + yazar kutusu + Article/Person/
    Breadcrumb/Organization/WebSite JSON-LD + og:image), rehber ağı
    (ilgili rehberler + iki küme), Sakarya hukuk bloğu pilotu, yazdırma
    düzeltmesi, 3 kolonlu footer, KOD-6/KOD-9. Headless kanıt temiz
    (build 40 sayfa, konsol 0, kırık link 0, JSON-LD 130 nesne
    schema.org uyumlu, yazdırmada gizli 0); nihai görsel yargı
    kullanıcının canlı testinde.
22. AÇIK — Su Kanunu bülteni canlıya alınamadı: Buttondown hesabı
    kullanıcıda. Form kodu hazır ve test edildi; src/data/bulten.ts'ye
    kullanıcı adı yazılınca açılır (README-BULTEN.md). Hesap açılana
    dek form hiçbir sayfada görünmez (sahte form yayınlanmaz).
23. AÇIK — FAQPage şeması eklenmedi: 9 rehberin hiçbirinde görünür
    soru-cevap bölümü yok (5'inde "Dikkat" tek paragraf, 4'ünde yok).
    Olmayan içeriği işaretlemek Google kurallarına aykırı. Rehberlere
    gerçek SSS bölümü eklenirse (Serdar'ın kalemi) şema da eklenir.
24. Dalga 2+ adayları (rapordan, onay bekler): bölgesel rapor sayfası
    (TAKTİK-3), kuyu ruhsatı kontrol listesi PDF (TAKTİK-5), 81 il
    programatik sayfa (TAKTİK-7), kalan 24 havzanın hukuk bloğu
    (içerik kullanıcıdan).
25. Dalga 2 — menü vitrini + deneyim yenileme — CANLI/ABSORBE
    (2026-07-21 kapanış): TamEkranMenu vitrini canlıda (curl: sv-vitrin);
    menü kabuğu FAZ A site-geneli reformuyla (madde 42, onaylı+canlı)
    yeniden ele alındı. Absorbe edildi, kapatıldı. Tarihsel not:
    [ESKİ] KULLANICI ONAYI BEKLİYOR (2026-07-15): tam ekran menü keşif yüzeyine dönüştü
    (sol: 5 bölüm + alt-etiket; sağ vitrin: son 3 rehber + kanun son
    durum + öne çıkan havza — tümü build-time otomatik, elle metin
    yok); iki menü kodu tekilleşti (/harita/ artık src/pages/
    harita.astro, ortak TamEkranMenu). Headless kanıt: 38/38 test
    (ESC/focus trap/reduced-motion/mobil/kaydırma), kaynak→menü veri
    eşlemesi 5/5, konsol 0, kırık link 0. Su simülasyonu GPU'suz
    görüntülenemedi — nihai onay kullanıcının canlı menü gezintisi.
26. 280 KARAKTER ÖZ-CEVAP KATMANI — YAPILDI (2026-07-16): 9 rehber +
    25 havza sayfasına başlık altı öz-cevap kutusu; rehber özleri elle
    doğrulanmış metinden damıtıldı (künye no yok), havza özleri
    havza-veri.json + GRACE'ten otomatik. Meta description'lar öz-cevaptan
    türüyor. Kanıt: meta==kutu 34/34, uydurma kontrolü temiz, build temiz.
    [ESKİ NOT] 280 KARAKTER KATMANI: mevcut 9 rehber + havza sayfalarına geriye
    dönük ÖZ CEVAP bloğu eklenir (yukarıdaki ilkeye göre). Örnek/
    kuyu-ruhsati: 'Su temini için kuyu açmadan önce DSİ'den belge şart
    (167 s.K. m.8). Üç belge: arama, kullanma, ıslah-tadil. Başvuru DSİ
    Bölge Müdürlüğü'ne, cevap süresi bir ay, belgeler harçtan muaf.
    Belgesiz kuyu: idari para cezası + kuyu kapatma.'
27. SU NABZI KATMANI (GRACE): kaynak keşfinde doğrulanan UNL GRACE
    haftalık yeraltı suyu verisinden (2003–13.07.2026, kayıtsız açık,
    TR-IP yok) — (a) menü/landing'e tek satır canlı gösterge (son 12
    ayda yeraltı suyu en çok azalan/toparlayan havza), (b) ayrı 'su
    nerede azalıyor/artıyor' değişim haritası. HENDEK FAZ 1 verisi
    kurulunca yapılır.
28. KOPYALANMA DİRENCİ UYGULAMASI: (a) Astro build'e minify+obfuscate
    (çalışmayı/perf bozmadan) + source-map kapatma; (b) Cloudflare
    scraper koruması + rate-limit, arama/AI botları beyaz listede;
    (c) ölçülü view-source caydırma. KANIT: build sonrası JS okunamaz +
    source map yok teyidi; Googlebot/GPTBot hâlâ erişiyor testi;
    Lighthouse ≥90 korundu. Uygulama sırası: mevcut görsel/veri işleri
    sonrası, tek brief.
29. HENDEK FAZ 1 — EPİAŞ baraj pipeline — ÇALIŞIYOR (2026-07-16):
    kimlik .env'e girildi, İLK GERÇEK ÇEKİM BAŞARILI (TGT 201; 17 havza,
    116 baraj eşleme, 64 günlük kayıt; kayıt başlangıcı 2026-07-16;
    Sakarya sayfasında gerçek tablo doğrulandı). Altyapı: arac/baraj-cek.mjs (TGT + havza→baraj eşleme + doluluk/
    kot/hacim, sayfalı, ham arşiv data/arsiv/baraj/ + normalize
    data/canli/baraj.json) + günlük cron 18:00 TR kurulu + havza
    sayfalarında BarajDoluluk bloğu (build-time SVG; veri yokken hiç
    çıkmaz, tek günde "kayıt yeni başladı", ortalama yalnız gerçek
    kayıttan "N gün" ibresiyle). Mock testten geçti (mutlu yol + arıza
    yolu + sızıntı taraması 0). AÇIK KALAN: lisansın girişli
    ekrandan kesin teyidi + deploy hook (opsiyonel) kullanıcıda; EPİAŞ
    setinde Fırat-Dicle, Konya Kapalı vb. 8 havza YOK (kaynak vermiyor —
    kapsam şerhi sayfada), Ceyhan/Asi bugün 0 kayıt döndü (izlenecek). İlk çekim sonrası: EPİAŞ havza adları ↔ site havza
    eşleşmesi gözden geçirilecek (Fırat-Dicle gibi bileşik adlar).
30. HENDEK FAZ 1-B — GRACE "su nabzı" — ÇALIŞIYOR (2026-07-16): GSFC
    mascon (açık, tokensız — Earthdata GEREKMEDİ, test kanıtlı) 530MB
    indirildi, 25 havza + ülke serisi çıkarıldı (254 gerçek ay,
    2017-18 boşluğu dolgusuz), havza sayfalarında "su depolaması
    eğilimi" göstergesi (son 5 yıl eğimi, "N gerçek aydan" ibresiyle).
    Haftalık cron Pzt 06:00 UTC + deploy hook. VARSAYIM DÜZELTMESİ
    (raporlandı): GRACE yeraltı suyu değil TOPLAM su depolaması (YAS +
    toprak nemi + kar + yüzey suyu) değişimi verir — site dili buna
    göre "su depolaması eğilimi"; 0,25° çözünürlük UNL görsel ürünüydü,
    sayısal mascon ~3° — "havza yaklaşık" şerhi sayfada.
31. GRACE TAM DEĞİŞİM HARİTASI (MapLibre) — AYRI İŞ (FAZ 1-B kapsamı
    dışında bırakıldı): "su nerede azalıyor/artıyor" interaktif harita
    + menü/landing tek satır canlı gösterge (SIRADAKILER 27a) —
    data/canli/grace-havza.json hazır, harita işi onayla başlar.
32. HENDEK FAZ 2 — il rejimi aracı + programatik il sayfaları — YAPILDI
    (2026-07-16): TEK üretici (src/data/il-profil.js) → /arac/il-rejimi/
    (JS'siz çekirdek: 81 statik linke düşer; JS'le panel + ?il= paylaşım)
    + /kuyu-ruhsati/[il]/ 81 sayfa + indeks. İnce içerik eşiği 81/81
    geçti (dürüst denetim: 14×3, 43×4, 24×5 unsur); genel süreç
    kopyalanmadı (kontrol: 0 ihlal, ana rehbere link); uydurma kontrolü
    5 örnek ilde temiz; JSON-LD 330 nesne geçerli; sitemap yalnız
    üretilen sayfaları içeriyor (81+2). GRACE eğim hesabı tek bakım
    noktasına alındı (grace-hesap.js — 3 kopya tekilleşti). Görsel
    onay: il-konya/il-bolu/arac-*.png. Not: baraj/GRACE verisi cron'la
    güncellendikçe il sayfaları da sonraki build'de tazelenir.
33. TASARIM ANAYASASI FAZ 0 — SÜPERSEDE (madde 34 ile tekilleştirildi):
    DESIGN.md 2.0 önerisi, madde 34 "YÖN YÜKSELTMESİ — SU-DİLİ FAZ 0"
    ile DESIGN.md 3.0'a yükseltilip ONAYLANDI ("bu dil, devam"). Bu
    madde artık madde 34'e bağlıdır; tek geçerli tasarım onayı 34'tedir.
    Kapatıldı. Tarihsel not:
    [ESKİ] KULLANICI ONAYI BEKLİYOR (2026-07-16):
    DESIGN.md 2.0 yazıldı (üç font hiyerarşisi: Cormorant + Manrope +
    IBM Plex Mono; kicker sistemi; 6 kart ton ailesi — düz ton kararı;
    easing/durum sözlüğü; veri bandı dili; iki hız sınıfı; 11 maddelik
    başarısızlık listesi; akuamarin çift-ton kuralı #4FC3D0/#0F7A8A).
    Örnek sayfa /stil-pilot/ canlıda (noindex, sitemap dışı) — kuyu
    ruhsatı rehberi yeni dille. ONAY KAPISI: kullanıcı canlıda "bu dil,
    devam" demeden FAZ 1 (toplu giydirme), FAZ 2 (menü), FAZ 3 (deneyim
    sahnesi) BAŞLAMAZ.
34. YÖN YÜKSELTMESİ — SU-DİLİ FAZ 0 — ONAYLANDI (2026-07-16;
    Varyant A + iç sayfa dili "bu dil, devam"): DESIGN.md 3.0 su-dili
    anayasası (derinlik skalası HEDEF'ten örneklenmiş — kıyas kayıtlı:
    petrol skalası kazandı, akuamarin/gece-lacivert elendi; 4 akış
    eğrisi; ışık kırılması vurgusu; kot cetveli ölçüm esteti; TEK MOD
    kararı gerekçeli; mobil birinci sınıf). /stil-pilot/ v3 skalasına
    güncellendi. /harita-stil/ (varyant A: sol üst dikey) +
    /harita-stil/b/ (alt kenar yatay) kuruldu — HEDEF sahnelemesi
    (retina 1x/2x, AVIF/WebP/JPEG, LQIP blur-up, mobilde Türkiye
    merkezde, menü renkleri görselden örnekli + AA kanıtlı, overlay
    menü çalışır). ONAY: kullanıcı canlıda (1) iç sayfa dili
    /stil-pilot/, (2) menü varyantı A mı B mi — ikisini birden
    bildirmeden FAZ 1-2-3 başlamaz.
35. WebGL DENEYİM SAHNESİ — RAFTA (yön yükseltmesi kararı, 2026-07-16):
    canlı su sahnesi iptal değil ertelendi; öncelik su-dili + HEDEF
    sahnelemesi. Kullanıcı isterse ayrı brief'le döner.
36. SU-DİLİ FAZ 1 — TÜM İŞ SAYFALARI GİYDİRİLDİ — KULLANICI ONAYI
    BEKLİYOR (2026-07-17): 5 tür, 5 ayrı commit (FAZ1-a..e): çekirdek+
    indeksler / 9 rehber / 25 havza / 81 il+indeks / araç+hakkında+
    su-kanunu. Kicker sistemi, derinlik skalası, su-ivmesi easing'leri,
    kırılma vurgusu, kot-cetvelli veri bandları, kart aileleri, tanımlı
    hover/focus/press her türde; içerik/veri/URL/JSON-LD değişmedi.
    Görsel slot sözleşmesi: src/data/gorseller.js (rehber-hero /
    havza-kart-zemini / bolum-vinyeti) — Midjourney görselleri gelince
    TEK config değişimiyle oturur; şimdilik skala-degrade placeholder.
    Denetimde yakalanıp düzeltilen: çifte hero bandı, scrim z-katmanı,
    mobil nav hedefleri 26→45px, soluk metin kontrastı 4.42→4.85 (AA).
    Kanıt: konsol 0, kırık link 0/124, Lighthouse il 100/100/100/100 +
    rehber 97/100, görüntüler cikti/faz1/ (masaüstü 9 + mobil 4 tür).
    Kullanıcı canlı turu sonrası: FAZ 2 (menü) + /harita-stil/ taşıma
    kararı birlikte.
37. CC ROOT'TAN SUHA'YA TAŞINDI — YAPILDI (2026-07-17): proje
    /home/suha/projeler/suharitasi (mv+chown, güvenlik: /root izolasyonu
    korundu), suha kullanıcısı + sudo + SSH, CC 2.1.212 bypassPermissions
    (agresif mod fiili test edildi), MCP Playwright çalışır, cron suha'ya
    taşındı (root boş), git credential store (token URL'den çıkarıldı).
    Arşiv 26 değişmez varlık birebir sha256. AÇIK: sızan eski GitHub PAT
    kullanıcı tarafından İPTAL+YENİLENMELİ (transkriptte göründü).
38. SUNUM REFORMU FAZ 0+1 — YAPILDI (2026-07-20): üç temsilci sayfa
    teşhisi (B1-B17, K1-K4; kanıt cikti/denetim/faz0/) + DESIGN.md §17
    "Sayfa Mimarisi" (3-saniye, katmanlı sunum, veri kahraman, kart
    dili, mobil-öncelik, SU-DİLİ uyumu). Kullanıcı ilke onayı verildi.
39. SUNUM REFORMU FAZ 2a — HAVZA KALIBI PİLOTU (Sakarya) — TAMAM
    (kullanıcı canlı onayı 2026-07-21, GUNLUK KAPANIŞ; Sakarya kalip:2
    canlıda curl'la doğrulandı — zincirin ilk halkası): kalip:2 frontmatter kapısı (yalnız
    Sakarya; 24 havza + diğer sayfalar bit-değişmedi, curl kanıtlı).
    HavzaKahraman bandı (6,01 km³/yıl + YAS rezervi + GRACE ↓azalma +
    59-ay sparkline + künye) + Katman bileşeni (native details, JS 0,
    7 katman varsayılan kapalı; --e-suzul 420ms açılış, reduced-motion
    korumalı). Çifte özet kaldırıldı (ozet yalnız meta/kartlarda).
    Metrikler: masaüstü 6,0→2,1 ekran; 375px 10,7→3,2; ilk ekran görsel
    öğe 0→2 (büyük değer + sparkline). Lighthouse 96/100/100/100.
    GEO kanıtı: öz-cevap + FAQPage JSON-LD + katman içi tam metin
    curl'la JS'siz doğrulandı. Kanıt: cikti/denetim/faz2/ (AB-* yan
    yana dahil). Mobil menü dar-şerit yalnız MOCK (koda girmedi;
    faz2-sakarya-mobil-menumock.jpeg) — menü reformu üç kalıp onayı
    sonrası ayrı site-geneli adım. ONAY SONRASI: rehber + vaka kalıbı
    pilotları (kullanıcı onayı gelmeden BAŞLANMAZ). → Onay geldi
    (2026-07-21); 2b+2c pilotları yapıldı (madde 40-41).
40. SUNUM REFORMU FAZ 2b — REHBER KALIBI PİLOTU (kuyu-ruhsati) —
    TAMAM (kullanıcı canlı onayı 2026-07-21): kalip:2 kapısı (yalnız
    kuyu-ruhsati; diğer 8 rehber DOM-eşit — tek fark görünmez scoped-css
    kimlik attribute'u; 25 havza + tüm diğer sayfalar bit-eşit). İlk
    ekran: 280-cevap + "bu rehber ne çözer" (frontmatter cozer, damıtık)
    + içindekiler kartları (başlıklardan otomatik, BÖLÜM sayacıyla aynı
    numara). Katmanlar (varsayılan kapalı): madde metinleri + 81-il
    tablosu. Başvuru akışı tablosu → 4 numaralı adım kartı (dikey ray;
    hücre metinleri birebir korundu). Giriş koreografisi: .gk sıralı
    fadeUp 100ms kademe, --e-suzul, reduced-motion/print korumalı;
    başlık bloğu LCP için gizlenmeden süzülür. Belge tablosu kendi
    kabında kayar (375px gövde taşması 0). Metrikler: masaüstü 12,8→6,0
    ekran; 375px 22,9→9,4; ilk ekran görsel öğe 0→3; kesintisiz metin
    17→7 satır. Lighthouse 94/100/100/100 (pilot dışı referans 96).
    GEO: 280-cevap + Article JSON-LD + madde/il/adım tam metinleri
    curl'la JS'siz DOM'da doğrulandı. Kanıt: cikti/denetim/faz2/faz2b-*.
41. SUNUM REFORMU FAZ 2c — VAKA KALIBI PİLOTU (/vaka/meysu/) —
    TAMAM (kullanıcı canlı onayı 2026-07-21): yol teyidi — sayfa
    /vaka/meysu/ (brief'teki "meysu-su-guvensi" değil; slug dosya
    adından). B17 gereği içerik KISALTILMADI (görünür kelime 226→257):
    sahne eklendi. Kahraman stat kartları ilk ekranda (3.395,33 ha /
    2056 / 3 bildirim — frontmatter kahraman alanı, her değer KAP
    1604957 künyeli; <4 nokta → grafik değil stat kartı, dataviz
    eşiği). Olay akışı → dikey zaman çizgisi (su-degrade şerit + tarih
    düğümleri; son düğüm dolu = sonuç). Üçlü özet tekilleşti: görünür
    tek özet öz-cevap (ozet meta/listede; gövde paragrafı özet değil,
    akış girişi — aynen durur). Giriş koreografisi 2b ile aynı sözlük.
    Metrikler: ilk ekran görsel öğe 0→4 (masaüstü); kesintisiz metin
    15→10; mobil 3,9→4,4 ekran (sahne eklendi, içerik korundu).
    Lighthouse 100/100/100/100. GEO: öz-cevap + Article JSON-LD +
    olay/kahraman tam metinleri curl'la JS'siz doğrulandı. Pilot
    izolasyonu: bit düzeyinde tek değişen sayfa /vaka/meysu/. Kanıt:
    cikti/denetim/faz2/faz2c-*. Not: kalıpların koreografi/katman CSS'i
    yayılım fazında tekilleştirilecek (şimdilik pilot-başına scoped).
42. SİTE-GENELİ MOBİL MENÜ REFORMU (FAZ A-ÖN + FAZ A) — TAMAM
    (2026-07-21: push d2fea9d..fd4ec5e canlı, kullanıcı canlı onayı):
    (a) FAZ A-ÖN: landing header'ı tek kaynağa alındı (UstMenu tema
    varyantı aydinlik/koyu; landing src/pages/index.astro'ya taşındı,
    eski statik arsiv/landing-statik/). Görsel birebir: pixelmatch
    %0,000 (1440+375), computed birebir, canlı↔yerel SEO/GEO eşit.
    (b) FAZ A: mock'tan dar şerit — ≤640px'te marka+MENÜ, kapalı işgal
    içerik 226,4→85,8px / landing 104,6→84,8px (hedef 85±4); linkler
    DOM'da kalır (JS'siz crawl), panel=TamEkranMenu, yeni JS 0 bayt.
    Denetimin yakaladığı CANLIDA DA VAR hata düzeltildi: landing <main>
    nav tıklamalarını yutuyordu (masaüstü 5/5 link engelliydi) →
    header.koyu z-index (görsel fark 0 piksel). Lighthouse sakarya
    4×100, kuyu-ruhsati medyan 96 (A/B gürültü kanıtlı). Kanıt:
    cikti/denetim/faz-a-on/ + cikti/denetim/menu/ (RAPOR.md'ler).
    Push yapıldı, canlı onaylandı; Cloudflare cache purge gerekirse
    kullanıcı panelden yapar (otomasyon yok). Gerçek iOS Safari testi
    kullanıcıda (emülasyon şerhi).
43. FAZ 3 — /HARİTA/ CANLI VERİ PANELİ — TAMAM (2026-07-21: push
    d2fea9d..fd4ec5e canlı, kullanıcı canlı onayı): hero altında 25 havza kartı (HavzaPaneli,
    build-time statik, çalışma anı JS 0); GRACE eğimine göre sıralı, eşik
    A ≤-1,5 (5 kritik: Asi, Fırat-Dicle, Van Gölü, Ceyhan, Seyhan; onaylı),
    mobil iki kolon (onaylı), YAS rezerv havza-bazlı teyitli. Hero pixel
    %0,000 değişmedi (1440+375); Lighthouse medyan 74→75; 25 kart→25
    benzersiz link 0 kırık; düz-çizgi kuralı sentetik+gerçek seriyle
    kanıtlı; konsol 0, taşma 0. Bilinçli sapmalar raporda (yön dili tek
    bakım noktası; tr-TR yuvarlama). Kanıt: cikti/denetim/faz3/RAPOR.md.

K1 — GIT/LOG HİJYENİ (2026-07-25). Uygulandı, main'de (9f68604). Canlı
doğrulama açık:

- [x] K1 canlı doğrulama (Faz D) — 25.08 ÖLÇÜLDÜ: koşumlar başarılı, commit'ler
      teyitli; log'da PULL HATASI BULUNDU (18-24.08 kirli ağaç) ve kök nedeni
      giderildi (KARARLAR §27 K1). [ESKİ TANIM] Bir sonraki pipeline koşumundan sonra:
      koşum başarılı mı, log'da pull hatası var mı, commit atıldı mı,
      push geçti mi, log'larda kayıp var mı. Bu kontrol yapılana kadar
      K1 "doğrulandı" SAYILMAZ. Yedek: ~/yedek/k1-log-*

- [ ] K1 kapsam dışı bulgular: kilit/yarım dosya riski (B1.8a),
      site-saglik karışık commit/revert kapsamı (B1.8b), grace
      dosya-dosya add kırılganlığı.

- [ ] Arşiv log'larının git dışı yedeği. YOL A sonrası 13 log dosyası
      yalnız sunucu diskinde. rsync/ayrı repo/nesne depolama değerlendir.
      ACİLİYET ARTTI: merge sırasında git 13 log'u diskten sildi (yedekten
      geri kondu) — tek kopya riski somut.

- [ ] Yabancı worktree: /tmp/claude-1000/.../scratchpad/wt-base
      (d2fea9d, detached HEAD). Kapsam dışı bırakıldı, karar bekliyor.

- [ ] K1 scratch dizinleri /tmp/k1-test ve /tmp/k1-test-onceki-tur silinmedi
      (rm izin kuralıyla engelli). Zararsız, /tmp yeniden başlatmada temizlenir.

DÖNÜŞÜM SEANSI (26 Tem 2026) — dal `donusum-2026-07-26`, worktree
`../suharitasi-donusum`. Kullanıcı incelemesi bekliyor, main'e MERGE EDİLMEDİ.

- [ ] ANALİTİK KURULUMU — Cloudflare Web Analytics (ücretsiz, site Pages'te,
      panelden tek tık). KULLANICI PANEL İŞİ. Bu yapılana kadar 5 [VARSAYIM]
      önerisi ve tüm dönüşüm ölçümü askıda. Plausible/Umami barındırılan
      sürümleri ücretli olduğu için elendi.
- [ ] Cloudflare zone analitiği açık mı — panelden doğrulanmalı (istek/yol
      verir, davranış ölçmez).
- [ ] Dönüşüm SINIF C ([VARSAYIM], analitik verisi geldikten sonra):
      · #17 ana sayfa H1 çerçeve tartışması (kategori mi, ses mi)
      · #18 persona derinliği vs sayısı (471 kelime yeterli mi)
      · #19 persona × il kesişim sayfaları
      · #20 sektör ikonları (görsel onayı gerekli)
      · #21 öz-cevap altı görüş satırı
- [ ] Dönüşüm SINIF B (durak): #14 rehber süreç şeması ve #15 havza küçük
      haritaları — YENİ GÖRSEL ÜRETİMİ gerektiriyor, referans görsel onayı
      şart (askı yalnız 26 Tem brief'i için geçerliydi).
- [ ] K2 düzeltmesi: GRACE eşiği 192 saat → aylık + 40-60 gün gecikmeye uygun
      değer · sonBasariliKosu kısır döngüsü (site-saglik.mjs:769 — yalnız
      kırmızısız koşumda güncelliyor, md10 kırmızı kaldıkça alan 24 Tem
      07:33'te donmuş, bekçinin f kalemi 14 saat eşiğini her gün aşıyor,
      UYARI-SAGLIK.md her 07:00'de yeniden yazılıyor, silme yalnız "hiç sorun
      yok" dalında olduğu için asla temizlenmiyor) · md10'un baraj.json kalemi
      bekçiyle tam mükerrer (48s vs 26s, bekçi her zaman önce ateşliyor).
- [ ] K2 önerileri (uygulanmadı, aynen): (1) md10 GRACE kalemini kaynak
      tazeliğine çevir, mtime'ı bırak · (2) md10 baraj kalemini kaldır ya da
      bekçiyle eşitle · (3) sonBasariliKosu'nu "koştu" / "temiz koştu" diye
      ikiye ayır · (4) GRACE URL'ini üç yerden tek yere indir · (5) SMTP
      eksikliği ayrı kalem olarak izlensin.
- [ ] SMTP dört değişkeni eksik → alarm e-postası kapalı
      (sonBildirim.mail.gonderildi=false).
- [ ] grace/cron.log tutarsızlığı DENETLENEMEDİ: 23 Tem 18:53'te yaratılmış,
      tek satır içeriyor, ama o koşum olsaydı durum.json yeniden yazılırdı
      (mtime hâlâ 20 Tem 06:00). "GRACE cron'u en son ne zaman koştu" tek
      kaynaktan cevaplanamıyor.
- [ ] F4-4 riski yapısal olarak duruyor: GRACE URL'i üç yerde sabit kodlu,
      dönem alanı değişirse sessiz ölür. Tetiklenmemiş. Sınır: yalnız dönem
      alanı yoklandı; sürüm etiketi (rl06v2.0, obp-ice6gd) değişmiş bir yayın
      olasılığı DENETLENEMEDİ.
- [ ] K1 sonrası script tutarsızlığı: baraj (PUSH_HATA=1) ve su-izleme
      (PUSH_ERTELENDI=1) push ertelenince exit≠0 dönüyor, grace dönmüyor.
      "Ertelendi" hata değil geçici durum.
- [ ] /tmp/k1-test · /tmp/k1-test-onceki-tur · /tmp/skill-tarama temizliği.
- [ ] Yabancı worktree: /tmp/claude-1000/.../scratchpad/wt-base (d2fea9d,
      detached HEAD).
- [x] www.suharitasi.com 522 — KAPANDI 29.07 (custom domain, 3/3 200);
      25.08'den beri md24 kalemiyle sürekli izleniyor.
- [ ] robots.txt AI botları: Cloudflare "Managed Content" bloğu ClaudeBot/
      GPTBot/PerplexityBot'u engelliyor olabilir — panelden doğrulanmalı.
      GEO stratejisinin ön koşulu.
- [x] Dönüşüm TUR 2 (26 Tem 2026, gece) — SINIF A'da kalan 9 maddenin 8'i
      ele alındı, 6'sı UYGULANDI: #2 ana sayfa Organization+Person (`c91aa57`) ·
      #6 soru-başlıkları, 85 tanım / 458 başlık / 161 sayfa (`e74f540`) ·
      #7 robots.txt Tier-1 botları (`f71f490`) · #8 9 hub sayfasına öz-cevap
      (`5a14a15`) · #10 llms.txt build üreticisi (`16fde8d`) · #12 ana sayfa
      öz-cevabına somut sayılar (`0a84dd4`) · #13 HowTo şeması (`0f3e00e`).
      KULLANICI GÖRSEL/UI ONAYI ALINDI (26 Tem 2026). Dal push edildi;
      main'e merge EDİLMEDİ → canlıda değil.
- [ ] #1 `sameAs` — SINIF B (B-2). **Kullanıcıdan gerçek profil adresi
      gerekiyor:** LinkedIn (kişisel/büro), X, Google Business Profile, baro
      levhası sayfası, Wikidata, YouTube. M8 gereği hiçbiri uydurulmadı, alan
      hiç yazılmadı. 2-3 gerçek URL yeterli. Organization `logo` alanı da aynı
      sebeple boş (gerçek logo dosyası yok).
- [ ] #6'nın `/rehberler/kuyu-ruhsati/` kısmı — SINIF B (B-7). Kalıp-2
      "İçindekiler" menüsü başlık metnini `<h2>` dışında tekrar bastığı için
      başlık değişince 9 gövde kelimesi kayboluyor; mekanik M6 kuralı gereği
      geri alındı. **Kullanıcı kararı gerekli:** içindekiler başlıktan
      türediği için bu "gövde değişikliği" sayılmalı mı? Sayılmazsa tek
      komutla uygulanır.
- [x] ÖDÜL-ÜSTÜ TURU (26 Tem 2026, sabah) — 9 skill uygulandı, 7 commit.
      Görünür breadcrumb 0→170 sayfa (`b42c46f`) · menü niyet-önce + Kuyu
      Ruhsatı kapısı (`e8191dd`) · footer "Ne yapmam gerekiyor" sütunu
      (`157af82`) · robots.txt Tier-2 tamam + Bytespider engeli (`0665aa4`) ·
      persona operasyonel sonraki adım (`4e29078`) · il kardeş bağları
      (`0212d30`) · havza kardeş bağları (`423f4af`).
      `/kuyu-ruhsati/` iç link 1→82. Küme yatay bağı: havza 0/25→25/25,
      il 0/81→76/81. LH erişilebilirlik 100 (3 tur medyan).
      KULLANICI GÖRSEL/UI ONAYI ALINDI (26 Tem 2026). Dal push edildi;
      main'e merge EDİLMEDİ → canlıda değil.
- [ ] ÖDÜL-ÜSTÜ tripwire (Sharp uyarısı): analitik kurulduktan SONRA
      `/harita/` ve `/havzalar/` organik girişi düşerse menü sırası geri
      alınır. Şu an ölçülemez (madde 0 açık).
- [x] CCBot ENGELLENDİ (26 Tem 2026 kullanıcı kararı, `7ced41d`). Tier-1
      canlı AI arama botları (GPTBot, OAI-SearchBot, ClaudeBot,
      PerplexityBot, Google-Extended) açık kaldı.
- [ ] Lighthouse PERFORMANS yeniden ölçülmedi (bu turda yalnız erişilebilirlik).
      Ortalama sayfa ağırlığı 24,1 → 26,9 KB (+%11,6): breadcrumb + footer
      sütunu + kardeş bağları. Canlıya çıkınca LH perf tabanı doğrulanmalı.
- [x] Handley önerisi UYGULANDI (26 Tem 2026, `8b90a36`): menü öğeleri
      okuyucunun sorusunu söylüyor, bölüm adı mono etiket olarak bağlantı
      içinde korundu (çapa metni + taranabilirlik + M6 üçü de bozulmadı).
      Ölçüm gereği menü ölçeği ve öğe aralığı daraltıldı — masaüstü menüsü
      1058 px'e çıkıp kaydırma gerektiriyordu, şimdi 900/900.
- [x] #6'nın `/rehberler/kuyu-ruhsati/` kısmı UYGULANDI (`5bbc85e`) —
      görsel/UI onayı bu engeli kaldırdı. İçindekiler menüsündeki 9 eski
      başlık kelimesi bilerek düştü, gövde paragrafları değişmedi.
- [x] MERGE + CANLI YAYIN TAMAM (26 Tem 2026, `9851b2a`). 27 commit main'e
      birleşti, push edildi, Cloudflare Pages dağıttı. Canlı doğrulama:
      surum.json 9851b2a · robots/sitemap/llms.txt 200 ·
      `site-saglik --hizli` GENEL YESIL (6/6, 6 sahne oynuyor, konsol 0).
- [ ] REFERANS GÖRSEL TURU YAPILDI — **KULLANICI SEÇİMİ BEKLİYOR**
      (26 Tem 2026). Kıyas sayfası: `cikti/denetim/referans-gorsel/index.html`
      (kareler: kare-d3.png · kare-d2.png · kare-d4.png).
      **D3-A SEÇİLDİ VE UYGULANDI** (26 Tem 2026) — 25/25 havzada
      konumlandırıcı basıyor, altyazı "havza sınırı değildir" diyor,
      LH erişilebilirlik 100, SVG 5,4 KB.
      **D2-A (sütunlu ray) ve D4-A (NACE sigili) hâlâ SEÇİM BEKLİYOR.**
      · Üretici: `arac/referans-havza-harita.mjs` (build'e bağlı DEĞİL).
      · Ölçülmüş kısıt: #0C5A7C ile #2E7EA0 yan yana iki veri kategorisi
        OLAMAZ (dataviz doğrulayıcı, normal görüş ΔE 11,8 / eşik 15).
      · Higgsfield referans alınmadı: ev estetiği siyah zemin + lime aksan +
        sinematik AI görsel; site light-only krem/lacivert ve JS~0. Gerekçe
        ilerleme dosyasında.
- [ ] D3 VERİ AÇIĞI: depoda **havza sınır geometrisi yok**. Referans yönler
      havzanın kapsadığı İLLERİ boyuyor ve etiketi bunu söylüyor. Gerçek
      sınır isteniyorsa DSİ/SYGM geometrisi + lisans sorusu ayrı iş.
- [x] D3-A 25 havzanın hepsinde doğrulandı. En küçük kapsam Akarçay (2 il)
      ve okunur çıkıyor — "nokta gibi kalır" endişesi gerçekleşmedi.
- [ ] Sakarya (tek kalıp-2 havzası) sayfasında harita `<details>` katmanı
      içinde kapalı geliyor; diğer 24'te doğrudan görünür. Künye bloğuna
      (ilk ekran) taşınsın mı — karar.
- [x] #11 rehber → il/persona bağlam linki — TAMAMLANDI (`fb27d9d`).
      B3 (rehber → il) zaten karşılanmıştı: `/rehberler/kuyu-ruhsati/` 81 il
      sayfasına link veriyor. C2 (rehber → persona) uygulandı: 0 → 13 link,
      8 rehberde. Eşleşme elle yazılmadı, `persona.json`'daki `ilgiliIcerik`
      alanı tersine çevrilerek türetildi. Öz-denetim: 7 sayfa, konsol 0,
      113 tekil link 0 kırık. KULLANICI ONAYI BEKLİYOR.
- [ ] #11 görünüm kararı: persona satırı "Sonraki adım" kutusunun altında
      ince ayraçla, 0,9rem ikincil metin. Ana çağrı hiyerarşisini bozmasın
      diye bilinçli ikincil. Daha belirgin istenirse tek satır değişiklik.
- [ ] Ana sayfa (`/`) tarayıcı öz-denetimine alınamıyor: menü düğmesi
      kaydırma-sahnesi yüzünden ilk ekranda görünmez, `arac/oz-denetim.mjs`
      etkileşim adımı 30 sn'de zaman aşımına uğruyor. Araç ana sayfa için
      kaydırma-önce-tıkla adımı istiyor. Madde 11'den önce de böyleydi.

## Denetim kapsamı — kapsam dışı bırakılanlar (28.07.2026, brief kararı)
- [ ] **KVKK / aydınlatma metni** — [SERDAR-HUKUK]. Metin senin kalemin,
      biz basarız. Cloudflare Analytics çerezsizdir; yine de takdir senin.
- [ ] **npm açıklarının giderilmesi** — ölçülen taban: 1 düşük + 3 yüksek
      (sharp/libvips zinciri). md20 artık YALNIZ yeni açıkta ateşler;
      mevcut 4'ün kapatılması ayrı iş (sharp sürüm yükseltmesi build'i
      etkiler, ölçülmeden yapılmaz).
- [ ] **404 sayfası** — `public/404.html` VAR ve markalı. Kapsam
      haritasındaki "yok" varsayımı ölçümle yanlışlandı. İyileştirme
      (arama kutusu, popüler sayfalar) isteğe bağlı ayrı iş.
- [ ] **Depo dışı yedek** — md20 SARI veriyor: `kaynak/dsi-arsiv` 55 MB +
      `data/arsiv` 529 MB geri getirilemez veri, depo dışında kopyası yok.
      Karar gerekiyor: hedef (Hetzner ikinci disk / R2 / harici) + sıklık.
- [ ] **Keşif botu izlemesi** — sunucu erişim kayıtları `/root` altında,
      okunamadı. Cloudflare tarafından mı çekilecek, karar gerekiyor.

## Denetim kapsamı — ilk gerçek koşumun bulguları
- [ ] **3 ölü dış bağlantı (KIRMIZI, gerçek):**
      `dergipark.gov.tr/pajes/...` (alan adı `dergipark.org.tr`'ye taşındı),
      `trdizin.gov.tr/publication/...`, `doi.org/10.17341/gummfd.60377`.
      Künyeye dayalı otorite iddiasının altındaki boşluk — düzeltilmeli.
- [ ] **rg-nobetci ve nhyp-nobetci hiç koşmamış** (state dosyası yok).
      Cron kaydı var mı, doğrulanmalı.
- [x] **Yapısal risk — KAPANDI (28.07, dal yuk-2026-07-28):** `--tam` bir
      KIRMIZI bulduktan sonra çalışan `--hizli`, SITE-DURUM'un "Son koşu"
      tablosunu kendi alt kümesiyle üzerine yazıyor ve kırmızı görünmez
      oluyordu (md17 kırmızısı böyle kayboldu). ÇÖZÜM: kırmızı "sonraki koşu
      yeşil geldi" diye değil, O KALEM yeniden ölçülüp geçtiğinde kapanır.
      SITE-DURUM'a eklendi: başlıkta `🔴 KIRMIZI (çözülmemiş)` (bu koşu yeşil
      olsa bile), "Çözülmemiş kırmızı" tablosu (kalem+mod+mesaj), "Mod başına
      son ölçüm" tablosu. Ölçüm yapmamış (kilit/kaynak) koşum ne kırmızı açar
      ne kapatır. İKİ YÖNLÜ FALSİFİKASYON: gerçek md17 kırmızısından sonra
      koşan yeşil `--hizli` kırmızıyı EZMEDİ · kalem yeniden ölçülüp geçince
      kırmızı KAPANDI (kilitlenme yok). Kanıt: cikti/denetim/yuk/falsifikasyon.md

## Sunucu donma teşhisi (28 Tem 2026) — rapor/sunucu-donma.md
- [x] **BULGU:** donma 23 Tem'de iki kez oldu (14:20 ve 16:21 UTC); RAM+swap
      tükendi (avail 90 MB, swap %98,38), takas yığılması (%system 42,
      %iowait 24, 1,2M blok/s okuma), sistem cevapsız kaldı — sysstat
      toplayıcısı 81 sn geç örnekleyebildi. Sebep SAĞLIK KOŞUMU DEĞİL
      (ölçüldü: `--tam` 1,9 GB / 9,4 dk; `--hizli` 1,07 GB / 68 sn; o gün
      koşumlar olayların dışındaydı). İz, interaktif ajan oturumlarını
      (Claude Code + Playwright MCP + chromium) gösteriyor: iki olay da MCP
      sunucusunun sonlandığı saniyede bitiyor. SWAP ZATEN VAR (6 GB) —
      donmayı önlemedi, uzattı.
      DOĞRULANMADI: hangi sürecin öldürüldüğü (dmesg/kern.log/journalctl/sudo
      hepsi root istiyor). Zincir korelasyondur, OOM kaydıyla teyitli değil.
- [x] **Koruma uygulandı:** bekçiye ANİ TEPE kalemi (tek ölçümde ateşler;
      eşik 1003 ölçümlük gerçek loga karşı kalibre — 3/1003, üçü de 23 Tem,
      yanlış pozitif 0) · sağlık koşumuna tek koşum kilidi (raporlar, sessiz
      çıkmaz) · kaynak tavanı (ölçülen tepe +%30: tam 2500 / hızlı 1400 MB;
      duran koşum canlılık damgası VURMAZ, bekçi görsün) · sabah `--tam`
      07:30 → 06:40 UTC (07:30'da bist-flow + bist-katilim aynı dakikada
      ateşliyordu, doğrulandı; 19:30 ölçüldü, temiz, değişmedi).
- [ ] **KULLANICI KARARI — sistem geneli bellek tavanı.** Asıl sebep sınırsız
      ajan oturumları ve sunucuda hiçbir birimde `MemoryMax` yok (30+ root
      BIST timer'ı dahil, hepsi `infinity`). Kalıcı sistem etkisi olduğu için
      UYGULANMADI. Seçenekler: (a) ajan oturumlarını `systemd-run --scope -p
      MemoryMax=…` ile sarmak, (b) `earlyoom` (yığılma yerine hızlı OOM),
      (c) BIST birimlerine MemoryMax (ayrı depo kararı).
- [ ] **KULLANICI KARARI — `vm.swappiness=60`.** 6 GB swap'ın tamamı
      tükenebildiği için donma dakikalarca sürdü; düşürmek (ör. 10) süreyi
      kısaltır. Sistem ayarı, uygulanmadı.
- [ ] **KULLANICI KARARI — log erişimi.** `suha` `adm`/`systemd-journal`
      grubunda olsaydı OOM kaydı okunur, teşhis korelasyonla değil kanıtla
      kapanırdı. Bir sonraki donmada bu fark yine kritik olacak.
