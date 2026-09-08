# Üç rehberin "dizinde tutunamama" teşhisi — YALNIZ ÖLÇÜM (08.09.2026 18:34–19:37Z)

Brief: `cikti/brief/2026-09-09-rehber-indeks-teshis.md` (denetçi: 1 ENGEL →
kapsam mührü eklendi → 1 UYARI, T1 robots/llms canlıdan okunur). Hiçbir
dosya değişmedi; tek çıktı bu rapor. Ölçüm kaynakları: GSC URL Inspection
API (iki istemci: MCP `gsc_inspect_url` ve servis hesabıyla doğrudan
`searchconsole.v1`, ikisi de `tr-TR`), GSC Search Analytics (date+page),
canlı HTML (`cikti/canli-0909/`, 10 rehber + 81 il), robots/llms/sitemap
canlı, yerel Lighthouse (PSI API kotası 429 → `npx lighthouse`, mobil),
WebSearch/WebFetch (rakipler). Ham dosyalar: `cikti/indeks-dagilim-0909.json`
(519 URL), `cikti/teshis-olcum.txt`, `cikti/lh-*.json`.

## 0 — Kapı
`/home/suha/projeler/suharitasi`, remote `suharitasi/suharitasi`, git temiz
(HEAD 455c981, ahead/behind 0), SITE-DURUM 17:31Z SARI (md17).

## 1 — Durum sabitleme: BRİEF'İN ÖNCÜLÜ ÖLÇÜMDE TUTMADI

**1a/1b — 10 rehberin URL Inspection sonucu, zaman sırasıyla (aynı URL, aynı
`lastCrawlTime`, aynı dil):**

| URL | son tarama | 08.09 08:43Z (MCP) | 11:52Z (MCP) | 17:16Z (SA*) | 18:34Z (MCP) | ~18:40Z (SA tam tarama) | 19:36Z (SA ×2) | 19:37Z (MCP) |
|---|---|---|---|---|---|---|---|---|
| /rehberler/kuyu-ruhsati/ | 08.09 11:38:49 | tarandı-eklenmedi (tarama 18.07) | **dizinde** | tarandı-eklenmedi | tarandı-eklenmedi | **dizinde** | **dizinde, dizinde** | **dizinde** |
| /rehberler/su-tahsisi-oncelik-sirasi/ | 08.09 11:38:50 | keşfedildi-eklenmedi | **dizinde** | tarandı-eklenmedi | tarandı-eklenmedi | **dizinde** | **dizinde, dizinde** | — |
| /rehberler/kuyu-tasima/ | 08.09 11:38:50 | bilinmiyor | **dizinde** | tarandı-eklenmedi | tarandı-eklenmedi | **dizinde** | **dizinde, dizinde** | — |
| /rehberler/ruhsatsiz-kuyu-cezalari/ | 28.08 03:54 | dizinde | — | — | tarandı-eklenmedi | dizinde | — | — |
| /rehberler/kuyu-belgesi-iptal-davalari/ | 28.08 04:11 | dizinde | — | — | tarandı-eklenmedi | dizinde | — | — |
| /rehberler/kaynak-suyu-kiralama/ | 28.08 01:03 | dizinde | — | — | tarandı-eklenmedi | dizinde | — | — |
| /rehberler/jeotermal-ruhsat/ | 30.07 17:28 | dizinde | — | — | tarandı-eklenmedi | dizinde | — | — |
| /rehberler/baraj-kamulastirmasi/ | 31.07 01:44 | dizinde | — | — | tarandı-eklenmedi | dizinde | — | — |
| /rehberler/yeralti-suyu-isletme-sahasi/ | 13.08 05:41 | dizinde | — | — | tarandı-eklenmedi | dizinde | — | — |
| /rehberler/kaynak-hakki-komsu-su/ | 28.08 01:40 | dizinde | — | — | tarandı-eklenmedi | dizinde | — | — |

*SA = servis hesabı (haftalık betik / tam tarama betiği). Tüm sütunlarda:
robotsTxtState ALLOWED · indexingState INDEXING_ALLOWED · pageFetchState
SUCCESSFUL · crawledAs MOBILE.

**Okuma:** 18:34Z'de **on rehberin onu da** "Tarandı - şu anda dizine
eklenmiş değil" döndü — kıyas grubu diye seçilen 7 rehber dahil; bunların
`lastCrawlTime`'ı değişmemişti (28.08/13.08/31.07). Bir saat sonra aynı
URL'ler, aynı tarama damgasıyla, iki farklı istemciden "Gönderildi ve
dizine eklendi" döndü ve 30 sn arayla iki turda sabit kaldı. Ana sayfa da
aynı davranışı gösterdi (18:38Z SA: tarandı-eklenmedi; 19:37Z MCP: dizinde;
tarama 03.09 22:14). Yani "sabah dizine girdi, akşam çıkarıldı" öyküsü
**URL Inspection API'nin aynı gün içinde çelişkili yanıt vermesinden**
kaynaklanıyor; tarama-değerlendirme-çıkarma dizisine dair hiçbir kanıt yok
(yeni tarama yok, canonical değişmedi, engel yok). Kıyas grubu ile üçlü
arasında bir fark ÖLÇÜLEMEDİ: hepsi aynı anda aynı değeri veriyor.

**1c — Google canonical:** 519 URL'nin 519'unda Google'ın seçtiği
canonical = kendisi (`googleCanonical ≠ url` sayısı **0**). Üç rehber dahil.
Başka bir URL'ye bağlanma yok.

**Destekleyici seri (Search Analytics, 25.08–06.09, page+date):** 7 "kıyas"
rehberinden 6'sı bu 13 günde gösterim aldı (kaynak-suyu-kiralama 38,
kaynak-hakki 28, iptal-davalari 17, cezalar 13, jeotermal 5, baraj-kamul. 2,
işletme-sahası 1); üç rehber **0** (beklendiği gibi: 08.09'a kadar hiç
dizinde değillerdi). 08.09 sonrası günler henüz GSC'de yok (2–3 gün gecikme).

## 2 — Hipotez 1: Kanibalizasyon (81 il sayfası ↔ rehber)

**2a — Title/H1/description örtüşmesi (canlı HTML, 81 il × 10 rehber):**
il sayfası deseni "Adana Kuyu Ruhsatı — Yetkili Merci ve Başvuru" / H1
"Kuyu ruhsatı — Adana" / description "… havzaları sınırları içindedir; kuyu
ruhsatı başvurusunun muhatabı DSİ N. Bölge Müdürlüğü…".

| Rehber | grup | Jaccard ort. (meta kelime) | rehber kelimelerinin il metasında payı | ortak kelimeler |
|---|---|---|---|---|
| kuyu-ruhsati | ÜÇ | **0,08** | **0,16** | dsi, kuyu, ruhsatı |
| kuyu-tasima | ÜÇ | 0,04 | 0,07 | kuyu, ruhsatı |
| su-tahsisi-oncelik-sirasi | ÜÇ | 0,03 | 0,05 | dsi |
| kuyu-belgesi-iptal-davalari | kıyas | 0,05 | 0,08 | dsi, kuyu |
| yeralti-suyu-isletme-sahasi | kıyas | 0,04 | 0,08 | dsi |
| ruhsatsiz-kuyu-cezalari | kıyas | 0,02 | 0,05 | kuyu |
| kaynak-suyu-kiralama | kıyas | 0,02 | 0,04 | yetkili |
| jeotermal / baraj-kamul. / kaynak-hakki | kıyas | 0,00 | 0,00 | — |

En yüksek örtüşme kuyu-ruhsati rehberinde (%16) ama üç kelime: "kuyu",
"ruhsatı", "dsi". Title'lar farklı (rehber: "Kuyu ruhsatı: yeraltı suyu
arama, kullanma ve ıslah-tadil belgeleri"; il: "<İl> Kuyu Ruhsatı — Yetkili
Merci ve Başvuru").

**2b — Kıyas grubunda il ailesi var mı?** Hayır: il sayfası ailesi
(`/kuyu-ruhsati/{il}/`, 81) yalnız kuyu-ruhsati rehberinin konusunu taşıyor;
diğer 9 rehberin böyle bir ailesi yok. Ancak hipotezin test edebileceği
bir fark da yok: 18:34Z'de il ailesi olmayan 7 rehber de aynı "tarandı-
eklenmedi" değerini verdi; 19:36Z'de il ailesi olan kuyu-ruhsati de
"dizinde". Tam taramada 81 il sayfasının 81'i dizinde, rehber de dizinde →
Google ikisini birden tutuyor, birini "gereksiz" saymıyor.

**2c/2d — İçerik örtüşmesi (8 kelimelik shingle, main metni):**

| Rehber | grup | kelime | il sayfalarıyla ortak shingle | diğer rehberlerle ortak (şablon) | benzersiz |
|---|---|---|---|---|---|
| kuyu-ruhsati | ÜÇ | 2.643 | **%3,0** | %20 | %80 |
| kuyu-tasima | ÜÇ | 2.691 | %3,1 | %26 | %74 |
| su-tahsisi | ÜÇ | 867 | %9,3 | %34 | %66 |
| kuyu-belgesi-iptal-davalari | kıyas | 780 | **%16,4** | %45 | %55 |
| yeralti-suyu-isletme-sahasi | kıyas | 851 | %15,0 | %51 | %49 |
| ruhsatsiz-kuyu-cezalari | kıyas | 859 | %9,1 | %51 | %49 |
| jeotermal-ruhsat | kıyas | 958 | %8,5 | %32 | %68 |
| kaynak-hakki-komsu-su | kıyas | 862 | %4,6 | %31 | %70 |
| baraj-kamulastirmasi | kıyas | 884 | %4,4 | %26 | %74 |
| kaynak-suyu-kiralama | kıyas | 1.000 | %3,8 | %24 | %76 |

Suçlanan sayfa (kuyu-ruhsati) il sayfalarıyla EN AZ örtüşen rehber (%3);
en çok örtüşen, en iyi CTR'li iptal-davalari (%16; ortak kısım "Dikkat/
Dayanak/İlgili rehberler" bileşenleri). Ortak paragraf yok; ortak cümleler
şablon bileşenlerinden.
**Hüküm: H1 desteklenmiyor** — örtüşme ölçütlerinde üçlü kıyas grubundan
ayrışmıyor, tersine kuyu-ruhsati en benzersiz içerik; il ailesi olmayan
rehberler de aynı API dalgalanmasını gösterdi.

## 3 — Hipotez 2: İçerik yetersizliği

**3a — Özellik tablosu (canlı HTML):**

| Rehber | grup | kelime | benzersiz % | H2 | H3 | tablo | img | giden iç | giden dış | gelen iç | güncelleme | şema (Article dışı ek) | LH mobil perf / LCP |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| kuyu-ruhsati | ÜÇ | 2.643 | 80 | 10 | 0 | 2 | 0 | 93 | 4 | 99 | 26.07 | HowTo(4 adım) | 82 / 3,6 s |
| kuyu-tasima | ÜÇ | 2.691 | 74 | 7 | 7 | 3 | 0 | 10 | 1 | 6 | 21.07 | FAQPage(4)+HowTo(7) | 99 / 1,8 s |
| su-tahsisi-oncelik-sirasi | ÜÇ | 867 | 66 | 8 | 0 | 1 | 0 | 11 | 5 | 94 | 25.07 | — | — |
| ruhsatsiz-kuyu-cezalari | kıyas | 859 | 49 | 6 | 0 | 1 | 0 | 8 | 5 | 90 | 25.07 | — | — |
| kuyu-belgesi-iptal-davalari | kıyas | 780 | 55 | 6 | 0 | 1 | 0 | 8 | 7 | 7 | 25.07 | — | 94 / 2,5 s |
| kaynak-suyu-kiralama | kıyas | 1.000 | 76 | 9 | 0 | 1 | 0 | 8 | 8 | 5 | 25.07 | — | 90 / 2,9 s |
| jeotermal-ruhsat | kıyas | 958 | 68 | 8 | 0 | 1 | 0 | 8 | 5 | 4 | 25.07 | — | — |
| baraj-kamulastirmasi | kıyas | 884 | 74 | 8 | 0 | 1 | 0 | 8 | 3 | 2 | 25.07 | — | — |
| yeralti-suyu-isletme-sahasi | kıyas | 851 | 49 | 7 | 0 | 1 | 0 | 10 | 4 | 7 | 25.08 | — | — |
| kaynak-hakki-komsu-su | kıyas | 862 | 69 | 8 | 0 | 1 | 0 | 8 | 5 | 5 | 25.07 | — | — |

Ortak: hepsinde Organization/Person/WebSite/WebPage/BreadcrumbList/Article;
görsel 0; hepsi 21–26.07 tarihli (biri 25.08). Dış atıf 1–8.

**3b/3c:** Sistematik fark YOK; varsa tersine: üçlünün ikisi sitenin EN
UZUN (2.6k kelime) ve en zengin şemalı rehberleri, benzersiz oranları
%66–80 (kıyas grubu %49–76). su-tahsisi kıyas grubunun ortasında (867
kelime, %66). Kelime sayısı vekil kriter olarak da çürüyor: 780 kelimelik
iptal-davalari dizinde ve en iyi CTR. **Hüküm: H2 desteklenmiyor.**

## 4 — Hipotez 3: Teknik engel

**4a (canlı, 10 rehber):** HTTP 200, yönlendirme 0, canonical = kendisi,
robots meta yok, X-Robots-Tag yok, hreflang yok, sitemap'te var (10/10).
Dünkü değişiklikler (JSON-LD telephone, künye süzgeci) bunları bozmadı.
**4b:** İçerik statik HTML'de — JS'siz görünür metin main'de 780–2.691
kelime (yukarıdaki tablo), 5 script etiketi (JSON-LD + iki modül) içerik
üretmiyor; Googlebot'un aldığı HTML = tarayıcının aldığı HTML (Astro
statik; canlı HTML ile yerel build görünür metin birebir — 08.09 F4).
**4c:** robots.txt `Allow: /` (yalnız Bytespider/CCBot engelli); llms.txt
üç rehberi listeliyor (satır 16, 17, 19).
**4d:** PSI API günlük kotası dolu (429) → yerel Lighthouse (mobil,
simüle): kuyu-ruhsati 82 / LCP 3,6 s · kuyu-tasima 99 / 1,8 s · kıyas
kaynak-suyu-kiralama 90 / 2,9 s · iptal-davalari 94 / 2,5 s; CLS ≤0,04,
TBT 0. Fark yok; md9 tam koşumu da 98/94 ve 98/91 (17:31Z).
**Hüküm: H3 çürüdü.**

## 5 — Hipotez 4: Otorite

**5a dış domain:** ÖLÇÜLEMEDİ — bu ortamda backlink aracı yok (Ahrefs/
Majestic yok; GSC "Bağlantılar" raporu API'de yok, yalnız panel).
WebSearch `"suharitasi.com"` sitenin kendisi dışında 0 anlamlı sonuç
verdi — kanıt değil, gösterge. Panelde Bağlantılar → Dış bağlantılar
kullanıcı ölçümü.
**5b gelen iç bağlantı:** kuyu-ruhsati 99, su-tahsisi 94, kuyu-tasima 6;
kıyas 2–7 (iptal-davalari 7, CTR %9). Teyit: iç bağlantı ne dizin
durumunu ne tıklamayı açıklıyor.
**5c site dağılımı (519 sitemap URL'si, servis hesabı, ~18:36–19:30Z):**
dizinde **368** · tarandı-eklenmedi 102 · keşfedildi-eklenmedi 21 ·
bilinmiyor 28. Türe göre: kuyu-ruhsati il 81/82 dizinde · havzalar 26/26 ·
rehberler 11/11 · nehirler 86/95 · goller 153/247 (56 tarandı-eklenmedi,
21 bilinmiyor, 17 keşfedildi) · **durumum 0/43** (43'ü tarandı-eklenmedi)
· su-kanunu 2/3 · vaka 2/2. 25.08 taramasında 170 dizindeydi → 368
(göl/nehir girişi). Tek gerçek "tarandı-eklenmedi" kümesi: durumum
(NACE sektör sayfaları) ve göllerin bir kısmı — üç rehber bu örüntünün
parçası DEĞİL. Not: aynı tarama ana sayfayı "tarandı-eklenmedi" verdi,
bir saat sonra MCP "dizinde" — dalgalanma ana sayfada da var; 102'lik
sayı ±belirsiz.
**5d rakipler:** "kuyu ruhsatı nasıl alınır DSİ": ilk sonuçlar sondaj/
mühendislik firma blogları — tanismuhendislik.com (~2.100 kelime, 9 başlık,
adım listesi, mevzuat atfı YOK, 02.2025), unluturksondaj.com (~2.800
kelime, 7 başlık, 3 akış görseli, tablo, SSS, 167 s.K. atfı, 2026),
kuyuustasi.com (~2.900 kelime, 8 başlık, tablo, FAQ, 167 s.K. atfı,
03.2026/07.2026), wixsite kopya sayfaları. "su tahsisi öncelik sırası":
lexpera.com.tr, mevzuat.gov.tr PDF, tarimorman.gov.tr PDF, gidahatti,
FAO — yani yönetmelik metninin kendisi ve haber. "kuyu taşıma kuruyan
kuyu": doğrudan rakip yok, aynı sondaj blogları. Rakiplerin ortak
özelliği: sürekli yayın yapan, telefon/WhatsApp'lı ticari siteler; içerik
derinliği bizimkine eşdeğer (2.1–2.9k vs 2.6k), kaynak atfı bizde daha
yoğun. Otorite (domain yaşı/dış bağlantı) ölçülemedi.

## 6 — Hüküm

**6a.** Ölçüm, brief'in dayandığı olayı (sayfa dizine girdi → değerlendirildi
→ çıkarıldı) DOĞRULAMADI. Kanıt: aynı gün, aynı `lastCrawlTime` için URL
Inspection API 18:34Z'de on rehberin onu için (kıyas grubu dahil) ve ana
sayfa için "tarandı-eklenmedi", 18:40–19:37Z'de dört ayrı okumada "dizinde"
döndü; yeni tarama, canonical değişimi, engel yok. Bu bir **API/indeks
replikası tutarsızlığı**dır; "Google geri çıkardı" hükmü verilemez.
- H1 kanibalizasyon: **desteklenmiyor** (örtüşme üçlüde en düşük; il ailesi
  olmayan rehberler aynı davranışı gösterdi; il sayfaları + rehber birlikte
  dizinde).
- H2 içerik: **desteklenmiyor** (üçlü kıyastan uzun/zengin; kelime sayısı
  vekil olarak da çürük).
- H3 teknik: **çürüdü** (10/10 temiz, JS'siz içerik tam, hız farkı yok).
- H4 otorite: **ölçülemedi** (dış bağlantı aracı yok); iç bağlantı
  belirleyici değil (teyit). SERP'te rakipler ticari sondaj blogları.

**6b.** Dizinde tutunamama diye bir sebep BULUNAMADI; ölçülen gerçek durum
şu: üç rehber şu an dizinde (19:36Z, iki istemci, iki tur) ve 28 günlük
görünür veride 0 gösterim — yani sorun "dizinde olmama" değil, dizinde
olup **hiç görüntülenmeme** (sıralama/otorite). Bu, 08.09 sabah raporunun
"kuyu ruhsatı sorgusunda 0 gösterim = dizinde değil" çıkarımını da
zayıflatır: sayfa dizine 08.09'da girdi; sonraki haftaların Search
Analytics verisi asıl ölçümdür.

**6c.** Desteklenen hipotez olmadığından değişiklik ÖNERİLMİYOR. Tek
"en küçük değişiklik" ölçüm tarafında olurdu (uygulanmadı, ayrı brief):
haftalık indeks izlemesinin tek okumaya değil aynı koşumda iki okumaya
(≥60 sn ara) dayanması ve iki okuma çelişirse "dalgalanma" etiketi —
çünkü bugünkü tek okuma 17:16Z'de yanlış-pozitif "dizinde değil" kaydı
üretti ve Telegram'a düştü. Etki ölçümü: 09.09 ve 16.09 cron koşumlarında
state dosyasındaki coverageState ile bu rapordaki 19:36Z değerinin kıyası;
Search Analytics'te üç URL'nin 08.09 sonrası ilk gösterimi (beklenen
pencere 2–4 hafta; 06.10 kıyas kalemi).

**6d.** Kod tarafında yapılacak bir iş YOK: teknik engel yok, içerik
kıyas grubundan geride değil, dizin durumu bugün olumlu. Görünürlük
otorite/sıralama meselesi; dış bağlantı ölçümü panelden (Bağlantılar
raporu) ve zamanla Search Analytics'ten yapılır. İş uydurulmadı.

## Ölçülemeyenler (sebebiyle)
- Dış bağlantı sayısı: backlink aracı yok, GSC Links raporu API'de yok.
- PageSpeed Insights / CrUX: PSI kotası dolu (429); yerel Lighthouse ile
  ikame (lab verisi, alan verisi değil).
- 08.09 sonrası gösterim: GSC gecikmesi (son gün 06.09).
- API dalgalanmasının kökeni (replika/önbellek): Google tarafı, ölçülemez;
  yalnız davranışı kaydedildi (7 okuma, 2 istemci, 65 dk).
