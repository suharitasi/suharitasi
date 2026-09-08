# 08.09.2026 — KULLANICI KARARI BEKLEYEN KALEMLER

Kaynak iş: `rapor/08-09-gsc-ticari-whatsapp.md` (GSC + ticari omurga +
WhatsApp). Brief kuralı: dört sınıf (hukuki metin · ücretli adım · geri
alınamaz silme · marka kimliği) uygulanmaz, buraya yazılır. Aşağıdaki her
kalem ölçümle geldi; hiçbiri uygulanmadı.

## §A — Kişisel veri: akademik künyelerdeki yazar adları (Faz A)

**Durum (ölçüldü):** `veri/potansiyel/akademik-kunye.json` → 81 il
sayfasının "Akademik künyeler" bölümünde **777 farklı kişi adı**, 3.685
geçiş (ilk 3 yazar + "vd."). Kaynak: OpenAlex API (bibliyografik metadata,
CC0), her kayıt DOI/URL'li. "İbrahim Furkan Sarkım" bunlardan biri (4 il:
Aydın, Hatay, Kahramanmaraş, Sivas; GSC'de adıyla 8 gösterim, 1 tıklama —
birisi kendi adını aratıp sitemize geldi).
**Sınıf:** yayımlanmış eserin yazar adı — kaynaklı, uydurma değil; ama
kişisel veridir ve kişi bizim sitede adının geçmesini beklemiyor.
**Ek bulgu:** 1.979 künyenin 697'si (%35) başlık/dergi adında hiçbir su
terimi taşımıyor (afet yönetimi, katı atık, kataliz…) — OpenAlex "il adı +
yeraltı suyu" sorgusu il adını eşleştirip konu dışı eser getirmiş. Sarkım
künyesi de bu sınıfta ("Afet Yönetiminde İlaç ve Kimyasal Maddelerin
Güvenli Yönetimi", Aydın sorgusuyla).

**Seçenekler:**
1. **Olduğu gibi bırak.** Bibliyografik atıf; KVKK m.28 kapsamı
   değerlendirmesi hukukçunun. Sonuç: 777 ad yayında kalır; ad aramaları
   il sayfalarına gelmeye devam eder.
2. **Yazar adını künyeden düşür** (başlık + yıl + dergi + DOI kalır).
   Uygulama: `IlPotansiyel.astro:176` tek satır; 81 sayfa değişir. Sonuç:
   kişisel veri 0, atıf bütünlüğü zayıflar (yazarsız künye).
3. **Alaka filtresi + yazar adı** — su terimi taşımayan 697 künyeyi
   basma (yazar adları kalır ama 777 → yaklaşık 500'e iner ve konu dışı
   içerik gider). Uygulama: `src/data/potansiyel.js` süzgeç; veri dosyası
   değişmez (geri alınabilir). Bu kalem "veri doğruluğu" sınıfına
   yaklaşıyor; ama silme etkisi olduğundan onaya bırakıldı.
4. 2 + 3 birlikte.

Önerim: **3**, ardından KVKK görüşüne göre 2. Gerekçe: konu dışı künye
sitenin "veri künyeli otorite" iddiasını zayıflatıyor; bu, ad meselesinden
bağımsız bir kalite sorunu.

## §B — Veri notu: OSM tipi ve göl adı çelişkisi
`/goller/baraj-golu/` (Karaman): OSM `tip: lake` → sayfa "Baraj Gölü …
bir doğal göldür" diyor. Kaynak böyle; düzeltme ya OSM'de ya da yerel bir
"tip düzeltme" listesiyle olur (veri kaynağı değişimi = kara liste, karar
sizin). 39 gösterim ("baraj gölleri haritası"), 0 tıklama.

## §C — Ticari omurganın 3 ana rehberi Google dizininde değil (B6a)
URL Inspection (08.09):
- `/rehberler/kuyu-ruhsati/` — "Tarandı, şu anda dizine eklenmiş değil";
  son tarama 18.07.2026. 99 iç bağlantı, sitemap'te, canonical doğru.
- `/rehberler/su-tahsisi-oncelik-sirasi/` — "Keşfedildi, dizine eklenmemiş".
- `/rehberler/kuyu-tasima/` — "URL Google tarafından bilinmiyor".
Diğer 7 rehber ve /rehberler/, /kuyu-ruhsati/ dizinleri dizinde.
"kuyu ruhsatı" sorgusunda 0 gösterim olmasının nedeni budur.
**Hipotez (kanıtlanmadı):** 81 il sayfası aynı "kuyu ruhsatı" varlığıyla
başlıklı; Google rehberi bu kümeyle tekrar saymış olabilir. Başka hipotez:
temmuzdan beri yeniden taranmamış olması (18.07) — sayfa o tarihten sonra
değişti (25.07 damgası) ama Google dönmedi.
**Seçenekler (hepsi kullanıcı adımı ya da politika sınırında):**
1. Search Console arayüzünde üç URL için "Dizine eklenmesini iste" (elle,
   günlük kota ~10; API'den yapılamıyor).
2. MCP'deki `google_indexing_publish` (Indexing API) — Google bunu resmen
   yalnız JobPosting/BroadcastEvent için tanımlıyor; genel sayfada
   kullanımı politika gri alanı. **Kendi kararımla kullanmadım.**
3. Bu iş IndexNow ile Bing/Yandex'e bildirildi (E3); Google'a etkisi yok.
28 gün sonraki ölçümde (E6) bu üç URL'nin dizin durumu yeniden bakılacak.

## §D — WhatsApp: şema telefon alanı ve dönüşüm ölçümü (Faz D)

**D6 — Organization/LegalService telefon alanı: EKLENMEDİ.** Sitede
`LegalService` düğümü yok; `Organization` (#kurum) var ve `telephone`
schema.org'da meşru alan. Ancak brief D4 "numara ham metin olarak HTML'e
basılmayacak" diyor; JSON-LD sayfa HTML'inin içindedir (523 sayfada
görünür kaynak). İki madde çelişiyor; D4 koruma amaçlı, D6 zenginleştirme
amaçlı — korumayı seçtim. İsterseniz tek satır: `Sayfa.astro` kurum
düğümüne `telephone: '+90 532 449 71 44'` (ve index/harita kopyaları).
Sonuç: bilgi paneli/LocalBusiness sinyali kazanılır, numara 523 sayfanın
kaynağında açık yazar.

**D7 — Tıklama ölçümü: KURULAMADI, sebep:**
1. Brief "Cloudflare Web Analytics kurulu" diyordu; **ölçüm: canlı HTML'de
   beacon 0** (ana sayfa ve /havzalar/gediz/, 08.09 08:44Z; _headers'taki
   28.07 ölçümüyle aynı). Panelde etkinleştirilmemiş; CSP izni hazır ama
   atıl.
2. Etkinleştirilse bile Cloudflare Web Analytics **özel olay (custom event)
   desteklemez** — yalnız sayfa görüntüleme + Core Web Vitals. Düğme
   tıklaması ölçülemez.
3. GA4: MCP'nin GCP projesinde Analytics Admin API kapalı (403,
   `analyticsadmin.googleapis.com`); GA4 etiketi ayrıca çerez/aydınlatma
   metni ister → "hukuki metin" sınıfı.
4. Yeni araç kurmak ve ücretli adım yasak.
**Yapılan altyapı (ölçümü mümkün kılar, kendisi ölçüm değildir):** düğme
`/whatsapp/` aynı-köken yoluna gider, `_redirects` 302 → wa.me. Her
tıklama Cloudflare edge'inde bir istek olarak GEÇER; sayılabilmesi için
üç seçenek:
  a. **Cloudflare panel → Web Analytics'i aç** (ücretsiz, çerezsiz): sayfa
     görüntülemeleri ölçülür; tıklama yine ölçülmez ama en azından trafik
     tabanı oluşur. Beacon otomatik enjekte edilir; CSP hazır.
  b. **Cloudflare Zaraz** (ücretsiz katman, panel): `/whatsapp/`e giden
     tıklamayı özel olay olarak sayabilir; üçüncü parti script (CSP'ye
     `zaraz` izni gerekir). Yeni araç = kullanıcı kararı.
  c. **Pages Function** (`functions/whatsapp.js`, ücretsiz katman): isteği
     KV sayacına yazıp 302 döner; sayfa koduna dokunmadan, çerezsiz, tam
     doğru sayım. KV bağlaması panelden yapılır. Kod tarafı bizde
     (~20 satır); "yeni analitik aracı" sayılıp sayılmayacağı sizin
     kararınız.
Önerim: **c** (tek doğru tıklama sayımı, üçüncü parti yok) + **a** (taban).
E6 tabanı: WhatsApp tıklaması = 0 (ölçüm yok); c kurulursa sayaç 0'dan başlar.

## §E — Canlı onay (CLAUDE.md iş kapanış kuralı)
WhatsApp düğmesi görsel/UI işidir: headless kanıt ön eleme; nihai kanıt
sizin canlı testiniz (üç sayfada düğme, mobilde imza satırı, wa.me açılışı).
SIRADAKILER'de "KULLANICI ONAYI BEKLİYOR".
