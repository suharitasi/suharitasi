# 08.09.2026 — GSC bulguları + ticari omurga + WhatsApp kanalı (BÜYÜK rejim, 5 faz)

Brief: `cikti/brief/2026-09-08-gsc-ticari-whatsapp.md` (aslı) ·
`…-duzeltilmis.md` (denetçi tamamlaması, yalnız ekleme).
Denetçi: ilk koşum 2 ENGEL + 3 UYARI → tamamlama sonrası 1 UYARI
(T1: `cikti/denetim/whatsapp-dugme/` bu işte üretilir; cikti/ .gitignore'da).
Düşman geçişi: (D1) "title etkisi kanıtlanmadı" şartı B1a'yı GSC günlük
seriyle ölçmeye zorlar, kör tur yok; (D2) A4 kişisel veri → kaynak kanıtı
olmadan kaldırma yok; (D3) C1 "ölçülmüş kusur" — ölçüm yoksa dokunulmaz;
(D4) D7 ölçüm kurulamazsa uydurma çözüm yok, karar dosyası.
Amaç özeti: ölç → yalnız kanıtlananı düzelt → WhatsApp kanalı → 28 gün
sonra kıyaslanacak taban. Dokunulmazlar: hukuki metin, ücretli adım,
geri alınamaz silme, marka kimliği, e-posta, WhatsApp yeşili, yeni sayfa.

Veri kaynağı (tüm GSC sayıları): GSC MCP `webmasters.searchanalytics.query`,
property `sc-domain:suharitasi.com`, dönem 09.08–05.09.2026 (28 gün; GSC
son tam günü 05.09). Ham çıktılar: oturum tool-results dosyaları;
türetilmiş tablolar `cikti/b6-baglanti-grafi.txt`, `cikti/b6a-envanter.txt`.

## FAZ 0 — Kapı ve ağaç temizliği

- 0a: `/home/suha/projeler/suharitasi`, remote `suharitasi/suharitasi` ✓.
- 0b: Hero.astro + anasayfa-satis.js commit `3aac89a` ("hero: ön görüşme
  butonu kaldırıldı, alt metin veri künyesine çevrildi"). Commit öncesi
  build alındı: 522 sayfa / sitemap 519, bekçi (dört-sayı kalıbı) geçti.
  Push `8b39efe..c11e1b8` (34 bekleyen otomatik commit + 2). Canlı
  `surum.json` = c11e1b8 (08:37Z). Cron blokajı kalktı: pipeline.log'daki
  "pull ertelendi: çalışma ağacı kirli" nedeni ortadan kalktı.
- 0b UYARI-SAGLIK.md içeriği (08.09 07:00 UTC): *"indexnow son başarılı
  bildirim 274 saat önce (>96s) — sitemap farkı ya da gönderim bozulmuş
  olabilir"*. Teşhis: indexnow-bildir.mjs 6×/gün koşuyor, her koşumda
  "canlı=8b39efe sitemap=519 URL, fark=0 — bildirim çıkmadı". 27.08'den
  beri deploy yoktu; bildirilecek URL olmadığı için bildirim çıkmadı. Bekçi
  eşiği "deploy yok" ile "gönderim bozuk"u ayırt etmiyor (yanlış alarm
  sınıfı). Dosya: bekçi üretir (satır 256), sağlıklı koşuda siler (satır
  270) → SITE-DURUM.md ile aynı sınıf → `.gitignore` (commit `c11e1b8`).
- 0c: taban `/home/suha/denetim-taban/` (22e3e86, 27.08, 522 sayfa,
  sitemap 519; hero değişikliği DAHİL alınmıştı — NOT.txt).

## FAZ A — Kişisel veri riski

**A1 — Nerede?** "İbrahim Furkan Sarkım" yalnız iki dosyada:
`veri/potansiyel/akademik-kunye.json` (6 geçiş) ve ondan türeyen
`veri/potansiyel/zenginlestirme.json` (6 geçiş), alan `yazarlar[]`.
Basan bileşen: `src/components/IlPotansiyel.astro:176` (ilk 3 yazar + "vd.").
dist'te 4 sayfa: /kuyu-ruhsati/{aydin,hatay,kahramanmaras,sivas}/ —
GSC "5 il" değil 4 (GSC sorgu+sayfa çıktısı da 4 sayfa; Kahramanmaraş iki
sorgu varyantıyla iki satır).

**A2 — Köken (kanıt):** OpenAlex API (metadata CC0). Kayıt:
`openalex_id: https://openalex.org/W7166515079`, DOI
`10.58830/ozgur.pub1352.c5357`, başlık "Afet Yönetiminde İlaç ve Kimyasal
Maddelerin Güvenli Yönetimi", yazarlar ["Şahin Yıldırım","İbrahim Furkan
Sarkım"], `bulan_sorgu: ["Aydın yeraltı suyu potansiyel"]`. Üretici:
`arac/akademik-kunye.py` (FAZ 4.B, DergiPark→OpenAlex ikamesi, is_oa:true,
sorgu başına ilk 25). Şablon/örnek/test verisi DEĞİL; RG/DSİ/xlsx DEĞİL —
yayımlanmış eser künyesi (yazar adı bibliyografik veri).

**A3 — Yaygınlık:** baskı-uygun 1.979 künye, **777 farklı yazar adı**,
3.685 yazar geçişi, 81/81 il sayfasında (dist taraması: adlar YALNIZ
/kuyu-ruhsati/ sayfa türünde; rehber/vaka/arşiv/göl/nehir/havza'da
akademik yazar adı 0). Diğer kişi adı kaynağı: yalnız "Av. Serdar Arslan"
(406 geçiş, site yazarı). MTA katalog (rapor adı/url, yazar alanı yok),
RG işletme sahası, DSİ duyuru: yazar/kişi alanı yok.
En çok ilde görünen yazarlar: Hüseyin E. Çelik (35 il), Sara Sengir (30),
Fethi Ahmet Canpolat (30), Nurdan BORAN (30).

**A3-ek — alaka ölçümü (yeni bulgu):** 1.979 künyenin **697'sinde (%35)**
başlık ve dergi adında hiçbir su/hidrojeoloji terimi yok (afet yönetimi,
katı atık, kataliz, deprem hasarı…). OpenAlex "alaka sıralı ilk 25"
sorgusu il adını eşleştirip konu dışı eser getiriyor. Sarkım künyesi de bu
sınıfta.

**A4 — Sınıf:** KAYNAKTAN GELİYOR (OpenAlex, DOI'li) → uydurma değil →
KALDIRILMADI. KVKK/yayın kararı kullanıcının; seçenekler karar dosyasında
(`rapor/08-09-KARAR-KULLANICI.md` §A).

**A5:** dosya değişikliği yok.

## FAZ B — Ölçüm (dosya değişmedi)

Önce düzeltme: ilk raporda "sıçramanın kaynağı Ergene" denmişti. Günlük
seri bunu YANLIŞLADI (aşağıda B1a/B2c).

### B1 — Ergene

**B1a.** Havza title'ları soru biçimine 25.08 13:18Z'de çıktı (commit
55cd794; canlı surum.json aynı gün). "ergene havzası nerede" günlük
serisi (GSC date+query, tık/göst/poz):

| Tarih | Göst | Poz |   | Tarih | Göst | Poz |
|---|---|---|---|---|---|---|
| 10.08 | 69 | 11,5 | | 20.08 | 254 | 10,1 |
| 11.08 | 136 | 11,1 | | 22.08 | 191 | 9,9 |
| 15.08 | 172 | 10,7 | | 23.08 | 88 | 10,4 |
| 18.08 | 174 | 10,1 | | 24.08 | 12 | 10,6 |
| 19.08 | 178 | 10,2 | | **25.08 (title)** | 8 | 11,0 |
| | | | | 26.08 | 21 | 11,4 |
| | | | | 27.08 | 26 | 11,0 |
| | | | | 28.08–05.09 | 0 satır | — |

Tıklama tüm seride 0. Pozisyon title öncesi 9,9–11,5, sonrası 11,0–11,4:
**değişmedi.** Talep 10–22.08 arası bir dalgaydı: Google Trends (TR,
"ergene havzası", 3 ay) 11.08 = 88 ve 19.08 = 100 zirveleri, öncesi 0,
25.08 sonrası 15–30 bandı. Dalga 23.08'de, title değişikliğinden İKİ GÜN
ÖNCE söndü. **Title hipotezi çürük:** ne pozisyon ne CTR kıpırdadı; hacim
düşüşü talep düşüşüdür. Havza sayfa türü toplamı da aynı şeyi söylüyor
(Ergene hariç, 09–24.08 → 26.08–05.09): tık 22→4, göst 928→337, CTR
%2,4→%1,2, poz 8,0→8,7 — iyileşme kanıtı yok (küçük sayılar, ama yönü
ters).

**B1b.** SERP ilk 10 (WebSearch, 08.09): haberturk.com, hurriyet.com.tr,
tr.wikipedia.org, sabah.com.tr (×2), marmara.gov.tr PDF, eodev.com,
tarimorman.gov.tr/SYGM PDF, expresscevap.net, bir kiralık-daire blogu.
İlk 5'in ölçümü (WebFetch):

| Site | Tür | Tarih | Cevap konumu | Kelime | Harita | İller | Kaynak |
|---|---|---|---|---|---|---|---|
| Habertürk | soru-cevap | 23.08.2025 | 2. paragraf | ~900 | yok | Tekirdağ, Edirne, Kırklareli | yok |
| Hürriyet | seyahat | 06.2020 | 3. paragraf | ~1.200 | yok | ilçe adları | yok |
| Vikipedi | ansiklopedi | — | 1. cümle | ~650 | yok | 3 il, 12.438 km² | 2 kaynak |
| Sabah (eğitim) | haber | 17.05.2023 | 2. bölüm | ~450 | yok | yok (bölge) | yok |
| marmara.gov.tr | PDF rapor | 2018 | — | — | — | — | resmî |

Bizde olmayan hiçbir şey yok: rakiplerin hiçbirinde harita yok, çoğunda
kaynak yok, cevap 2–3. paragrafta. Farklar: (i) onlar "Ergene Havzası"
(12.438 km², 3 il) — biz resmî "Meriç-Ergene Havzası" (14.486 km², 4 il,
İstanbul dahil); sayfada "Ergene Havzası ile Meriç-Ergene Havzası aynı yer
mi?" bölümü var; (ii) alan otoritesi (ulusal haber siteleri + Vikipedi).

**B1c.** Sayfa cevap veriyor: title "Meriç-Ergene Havzası Nerede? Kapsadığı
İller ve Haritası" (56 kr), H1 soru, öz-cevap ilk ekranda: "Meriç-Ergene
Havzası Edirne, Kırklareli, Tekirdağ ve İstanbul illerini kapsar…", harita
+ il/kurum tablosu hemen altında; 705 kelime, 9 H2.
**Sonuç:** içerik eksiği ölçülemedi; pozisyon 10–11 otorite kaynaklı.
C2'de dokunulmayacak.

### B2 — CTR açığı

**B2a.** Sıfır tıklama, en çok gösterim (28 gün; sorgu → sayfa):

| Göst | Poz | Sorgu | Sayfa |
|---|---|---|---|
| 2294 | 10,5 | ergene havzası nerede | /havzalar/meric-ergene/ |
| 444 | 7,9 | eşen akarsuyu nerede | /nehirler/esen-cayi/ |
| 424 | 11,0 | eşen çayı nerede | /nehirler/esen-cayi/ |
| 191 | 7,4 | ergene havzası harita | /havzalar/ (117) + meric-ergene (74) |
| 156 | 11,4 | zap suyu nerede | /nehirler/zap-suyu/ |
| 104 | 11,5 | köprüçay nerede | /nehirler/koprucay/ |
| 89 | 12,6 | gediz havzası nerede | /havzalar/gediz/ |
| 83 | 10,3 | ergene havzası nerde | /havzalar/meric-ergene/ |
| 78 | 7,8 | arin gölü nerede | /goller/arin-golu/ |
| 72 | 8,6 | havzalar | /havzalar/ |
| 72 | 10,8 | kızılırmak havzası illeri | /havzalar/kizilirmak/ |
| 70 | 7,9 | ergene havzası nerede harita | /havzalar/ |
| 62 | 9,2 | bakırçay nehri nerede | /nehirler/bakircay/ |
| 52 | 8,7 | asi nehri harita | /nehirler/asi-nehri/ |
| 44 | 11,3 | hezil çayı nerede | /nehirler/hezil-cayi/ |
| 39 | 9,5 | baraj gölleri haritası | /goller/baraj-golu/ |
| 38 | 7,7 | eşen çayı harita | /nehirler/esen-cayi/ |
| 37 | 7,6 | harşit akarsuyu nerede | /nehirler/harsit-cayi/ |
| 35 | 10,0 | avlan nerede | /goller/avlan-golu/ |
| 35 | 9,7 | türkiye havza haritası | /havzalar/ |

**B2b.** Title/description örtüşmesi: 20 sorgunun 9'u nehir sayfasına,
3'ü göl sayfasına düşüyor. Nehir title kalıbı "Eşen Çayı — Türkiye
Nehirleri — Su Haritası", description "Eşen Çayı, Batı Akdeniz
Havzası'ndan geçen bir akarsudur (kaynak: OpenStreetMap, erişim
04.08.2026)." → "nerede" sorusuna **il/konum cevabı yok** (yalnız havza),
title'da sorgu niyeti yok. Göl description'ı ise il taşıyor ("Arin Gölü,
Bitlis ili sınırlarında bir doğal göldür…"). Havza title'ları zaten
soru biçiminde (25.08). Örtüşmeyenler: 9 nehir sorgusunun 9'u (esen-cayi
×3, zap-suyu, koprucay, bakircay, asi-nehri, hezil-cayi, harsit-cayi).
Ayrıca veri notu: /goller/baraj-golu/ (Karaman) OSM'de `tip: lake` —
sayfa "doğal göldür" diyor; adı "Baraj Gölü". Kaynak böyle; düzeltme
kaynak düzeltmesi ister (karar dosyası §B).

**B2c. DESEN (asıl bulgu).** Gösterim sıçraması 29.08'de başladı ve
kaynağı göl/nehir sayfa türü (GSC date+page):

| Tür | 09–28.08 (20 g) | 29.08–05.09 (8 g) |
|---|---|---|
| nehirler | 0 tık / 124 göst | 16 tık / 4.543 göst / CTR %0,35 / poz 10,7 |
| goller | 1 / 91 | 18 / 2.016 / %0,89 / 10,2 |
| havzalar | 73 / 4.707 / %1,55 / 9,2 | 26 / 554 / %4,69 / 8,4 |
| kuyu-ruhsati | 11 / 286 | 3 / 71 |
| rehberler | 9 / 181 | 6 / 68 |

Göl/nehir sayfaları (342 sayfa, 04.08 üretimi) 26.08'den sonra dizine
girdi ve 8 günde 6.559 gösterim aldı; tamamı "X nerede / harita"
coğrafya sorguları, pozisyon 10–11 (2. sayfa sınırı). Sitenin CTR'sinin
%3,3'ten %1,5'e düşmesi bir title kusuru değil, **karışım etkisi**: yeni
indekslenen, düşük pozisyonlu, geniş bir kuyruk. Bu pozisyonda tıklama
beklenmez. Ölçülebilen tek kusur: nehir description'ı "nerede" sorusuna
il cevabı vermiyor (veri `nehir.cografya.il` mevcut, sayfada "Örneklenen
il" satırı basılıyor ama özete girmiyor); göl özetinde il var ve göl
CTR'si nehrin 2,5 katı (%0,89 / %0,35, pozisyon ~aynı). → C1 kalemi.

### B3 — "terme ve kelkit çayı hangi akarsu"
Sorgu ilk kez 28.08'de göründü (yeni indeks), 8 günde 230 göst / 1 tık,
poz 6,2–8,5; varyantları: "kelkit çayı hangi akarsu üzerinde" 26,
"…hangi akarsuyun kolu" 3+1. Hepsi /nehirler/kelkit-cayi/ sayfasına.
Sayfa "Kelkit Çayı, Yeşilırmak Havzası'ndan geçen bir akarsudur" diyor;
"Terme" sitede yalnız ilçe olarak (/ilce-sorgu/) geçiyor, Terme Çayı
sayfası YOK (OSM ana akarsu kümesinde değil). "Hangi akarsuyun kolu"
sorusunun veri karşılığı yok: tr-nehirler.json kaydında yalnız ad,
kaynak, geometri var; havza eşlemesi geometrik. Cevap kısmen var
(Yeşilırmak havzası), "kol" ilişkisi kaynaksız → C3'te uydurulmaz.

### B4 — www/apex
B4a canlı (08.09 08:40Z): www.suharitasi.com/havzalar/gediz/ → 301 →
apex; …/rehberler/kaynak-hakki-komsu-su/ → 301; www kökü → 301. Çalışıyor.
B4b: www gösterimlerinin tamamı 05.08–23.08 arasında (son satır 23.08,
kaynak-hakki 2 göst). 26.08 sonrası www satırı 0 → geçmiş veri. B4c gerekmez.

### B5 — Ne çalışıyor
/havzalar/: title "Havzalar — Su Haritası" (22 kr), H1 "Havzalar",
öz-cevap "Türkiye'nin 25 su havzası, havza bazında veri künyeleriyle";
25 havza kartı, her kartta yağış alanı + yüzey suyu potansiyeli (DSİ 2024);
553 kelime, H2 yok. Tıklamalar "dsi su havzaları haritası" (14, poz 4,8),
"dsi havza haritası" (5, poz 4,0), "dsi su haritası" (2). Gelen bağlantı:
her sayfada (menü+footer+kırıntı).
/rehberler/kuyu-belgesi-iptal-davalari/: title 82 kr (>60!), H1 aynı,
öz-cevap tek cümlede hukuki sonuç ("…idari işlemdir ve iptal davasına
konu olur"), ardından Danıştay ölçütleri; 793 kelime; H2: eksenler,
işlem türleri, hükümler, dayanak, emsal kararlar, ilgili rehberler.
Gelen içerik bağlantısı **7** (yalnız diğer rehberlerden), coğrafyadan 0.
Poz 3,3, CTR %9.
**Kazanan desen tanımı (ölçülen ortak özellikler):**
1. Title'ın İLK kelimeleri sorgunun varlık adıdır (Havzalar; Kuyu belgesi
   … iptal davaları). Soru biçimi değil, varlık-önce.
2. Öz-cevap ilk ekranda ve SOMUT: sayı (25 havza, km², km³) ya da hukuki
   sonuç cümlesi. Genel tanım değil.
3. Sorgu dar ve rakipsiz (pozisyon ≤5); CTR pozisyonun ürünü.
4. Bağlantı yoğunluğu desenin parçası DEĞİL (7 gelen bağlantı ile en iyi
   CTR; 90+ gelen bağlantı ile 0 tık — B6e).
5. Title uzunluğu desenin parçası DEĞİL (22 kr ve 82 kr ikisi de çalışıyor).

### B6 — Ticari omurga envanteri
**B6a.** 10 rehber + dizin; 81 il sayfası + dizin. Tam liste
`cikti/b6a-envanter.txt`. Rehberler (tık/göst/poz, gelen içerik bağlantısı,
GSC indeks durumu — URL Inspection 08.09):

| Rehber | Tık | Göst | Poz | Gelen | İndeks |
|---|---|---|---|---|---|
| kaynak-suyu-kiralama | 6 | 74 | 4,1 | 5 | dizinde (28.08) |
| kuyu-belgesi-iptal-davalari | 4 | 44 | 3,3 | 7 | dizinde (28.08) |
| kaynak-hakki-komsu-su | 3 | 68 | 9,0 | 5 | dizinde (28.08) |
| yeralti-suyu-isletme-sahasi | 2 | 4 | 2,8 | 7 | dizinde (13.08) |
| jeotermal-ruhsat | 0 | 39 | 6,1 | 4 | dizinde (30.07) |
| ruhsatsiz-kuyu-cezalari | 0 | 12 | 10,4 | 90 | dizinde (28.08) |
| baraj-kamulastirmasi | 0 | 8 | 10,9 | 2 | dizinde (31.07) |
| **kuyu-ruhsati** | 0 | 0 | — | 99 | **Tarandı, dizine eklenmedi** (son tarama 18.07) |
| **su-tahsisi-oncelik-sirasi** | 0 | 0 | — | 94 | **Keşfedildi, dizine eklenmedi** |
| **kuyu-tasima** | 0 | 0 | — | 6 | **URL Google tarafından bilinmiyor** |

Rehber toplam 15 tık / 249 göst. İl sayfaları toplam 14 tık / 354 göst;
81 ilin 63'ü gösterim aldı, 11'i tıklama aldı, 18'i 0 gösterim. En
iyiler: Çorum 3 tık, Kilis 2; Malatya 52 göst/0 tık (poz 8,3), Edirne
32/0 (poz 4,2). /kuyu-ruhsati/ dizini 0 tık / 3 göst (dizinde, 28.08).
Hukuk payı: 29 / 194 tık (%15) — brief'teki ölçümle aynı.
**Ticari omurganın üç ana rehberinden ikisi (kuyu ruhsatı, su tahsisi)
Google dizininde DEĞİL; üçüncüsü (kuyu taşıma) Google'a hiç ulaşmamış.**
"kuyu ruhsatı" sorgusunun 0 gösterim olmasının nedeni talep değil,
sayfanın dizinde olmaması. Sitemap'te var (519), robots izinli, canonical
doğru, 99 iç bağlantı — "tarandı, dizine eklenmedi" Google'ın kalite/
tekrar kararıdır (81 il sayfası aynı "kuyu ruhsatı" başlığını taşıyor;
hipotez, kanıtlanmadı).

**B6b.** 81/81 ilde kuyu-ruhsatı sayfası var (il-kurum.json 81 il ↔
dist/kuyu-ruhsati 81 dizin, eksik 0, fazla 0). Kapsam açığı YOK; karar
dosyasına "eksik il" kalemi girmez.

**B6c.** İçerik bağlantıları (main içi, kırıntı hariç; `cikti/b6-baglanti-grafi.txt`):

| Kaynak tür | Sayfa | Hukuk sayfasına bağlanan | Kenar | Hedef |
|---|---|---|---|---|
| goller | 247 | 247 (%100) | 247 | ilin kuyu-ruhsatı sayfası |
| nehirler | 95 | 95 (%100) | 95 | ilin kuyu-ruhsatı sayfası |
| havzalar | 25 | 25 (%100) | 193 | havzanın illerinin kuyu-ruhsatı sayfaları |
| nerede-su-cikar | 1 | 1 | 82 | 81 il + rehber |
| ilce-sorgu | 1 | 1 | 2 | rehber ×2 |
| havza-riski | 1 | 0 | 0 | — |

/havzalar/gediz/ → /kuyu-ruhsati/{izmir,kutahya,manisa,usak}/ **1 tık**;
rehbere 2 tık (il sayfası üzerinden). Göl/nehir/havza → REHBER doğrudan
bağlantı: **0**. Coğrafya→il köprüsü tam; coğrafya→rehber köprüsü yok.

**B6d.** Her rehber 3–4 rehbere bağlanıyor; yetim hukuk sayfası 0
(gelen-tüm=0 olan yok). Ancak 7 rehberin gelen içerik bağlantısı 2–7
(yalnız rehber ailesinden); baraj-kamulastirmasi 2 ile en zayıf.
İl sayfaları: her il 3 sabit rehbere bağlanıyor (kuyu-ruhsati, cezalar,
tahsis); gelen içerik bağlantısı min 6 / orta 12 / maks 27, coğrafyadan
613 kenar.

**B6e.** kuyu-belgesi-iptal-davalari 7 gelen bağlantı, CTR %9, poz 3,3.
Kıyas: 99/94/90 gelen bağlantılı üç rehber 0 tık (ikisi dizinde değil,
üçüncüsü poz 10,4). **Bağlantı yoğunluğu performansı açıklamıyor;**
dizin durumu ve sorgu-varlık uyumu açıklıyor. → C6'da "bağlantı ekle"
kararı yoğunluk gerekçesiyle DEĞİL, yalnız kullanıcı yolu (coğrafya→rehber
0) ve alaka gerekçesiyle, sınırlı verilir.

**Yan bulgu (E6 tabanı için):** Cloudflare Web Analytics canlıda YOK
(ana sayfa ve /havzalar/gediz/ HTML'inde beacon 0 — _headers'taki 28.07
ölçümüyle aynı). Brief'in "kurulu" öncülü yanlış → D7'de ele alınır.

## FAZ C — Uygulama (yalnız B'de kanıtlananlar)

| Kalem | Karar | Dayanak (ölçüm) |
|---|---|---|
| C1 title | **DOKUNULMADI** | B1a: soru-title'ın etkisi ölçülemedi (Ergene poz 10–11 sabit; havza türü CTR %2,4→%1,2). B5 kazanan desen varlık-önce; nehir/göl title'ları zaten varlık-önce. Değiştirmek "daha iyi olur" sınıfı. |
| C1 description | **nehir özeti il cümlesi aldı** (95 sayfa) | B2b: sıfır-tık ilk 20'nin 9'u "<nehir> nerede", özet il/konum vermiyordu; göl özeti il taşıyor, göl CTR %0,89 / nehir %0,35 (poz 10,2 / 10,7). Veri: `nehir.cografya.il` (sayfada zaten "Örneklenen il"). Metin: "…; hattı Muğla ili sınırlarından geçer" — geometrik örnekleme şerhi sayfada durur. Description bandı 126–148 kr (≤160). Öz-cevap + FAQ cevabı aynı kaynaktan (`nehirOzet`). |
| C2 Ergene | **DOKUNULMADI — sebep bulunamadı** | B1b/B1c: içerik eksiği yok (harita, kaynak, öz-cevap ilk ekranda; rakiplerde hiçbiri yok). Pozisyon 10–11 = alan otoritesi (haberturk/hurriyet/sabah/wikipedia). Title değişikliği pozisyonu oynatmadı. Kör deneme yapılmadı. |
| C3 Kelkit | **DOKUNULMADI — veri karşılığı yok** | "Hangi akarsuyun kolu" ilişkisi tr-nehirler.json'da yok (ad, kaynak, geometri); Terme Çayı veri kümesinde yok. C1 ile özet "Sivas ili" aldı; "Yeşilırmak Havzası" cevabı zaten vardı. |
| C4 uydurma veri | yok | A4: kaynaklı (OpenAlex). |
| C5 yönlendirme | gerekmez | B4a: 301 çalışıyor; bölünme geçmiş veri. |
| C6a köprü | **il sayfası → yeraltı suyu işletme sahası rehberi** (81 sayfa) | B6c/B6d: rehberin gelen içerik bağlantısı 7 (yalnız rehber ailesi), il/coğrafyadan 0; 70 il sayfası RG işletme sahası kaydı basıyor ve hemen altındaki cümle "İşletme sahası ilanının kuyu ruhsatına etkisi…" diyor ama o rehbere bağlanmıyordu. Bağlantı metni: "yeraltı suyu işletme sahası rehberi" (mevcut cümle içinde, yeni bölüm yok). |
| C6b köprü | **baraj gölü sayfası → baraj kamulaştırması rehberi** (150 sayfa, yalnız `tip=reservoir`) | B6c: göl→rehber 0/247; B6d: baraj-kamulastirmasi 2 gelen (en düşük), coğrafyadan 0, 8 göst. Mevcut "İlgili resmî veriler" satırına eklendi; doğal göl/gölet/lagünde eklenmedi. |
| C6e | il sayfası açılmadı | B6b: 81/81 zaten var. |

Bağlantı listesi (C6c):
- Kaynak /kuyu-ruhsati/<il>/ (81) → /rehberler/yeralti-suyu-isletme-sahasi/ · metin "yeraltı suyu işletme sahası rehberi" · ölçüm B6c/B6d.
- Kaynak /goller/<baraj-gölü>/ (150) → /rehberler/baraj-kamulastirmasi/ · metin "baraj kamulaştırması rehberi" · ölçüm B6c/B6d.

**Değişiklik sonrası kıyas** (build 522 sayfa / sitemap 519 = önce ile küme-eş;
kıyas tabanı `cikti/dist-once` = değişiklik öncesi aynı HEAD build'i):
değişen sayfa 327 = nehirler 95 + kuyu-ruhsati 81 + goller 150 (yalnız baraj
gölleri) + /kullanilanlar/ 1 (araç sayısı 91→92: `arac/whatsapp-kare.mjs`
eklendi, sayfa `arac/` dizinini sayıyor). havzalar/rehberler/durumum/kök/
diğer 195 sayfa BİT-EŞİT. 27.08 denetim tabanına göre ek farklar veri-güdümlü
(güncelleme damgası, baraj arşivi) — o taban hero değişikliğini de içeriyordu.
**Uydurma öz-denetimi:** yeni metin iki cümle kalıbı; "hattı X ili
sınırlarından geçer" ↔ `cografya.il` (95/95 dolu), bağlantı metinleri
hedef sayfa başlığıyla birebir konu. Yeni sayı, yeni hukuki iddia yok.

## FAZ D — Sabit WhatsApp düğmesi

Bileşen `src/components/WhatsAppDugme.astro`; dahil edildiği yerler:
`Sayfa.astro` (AltBilgi'den sonra, 518 iç sayfa), `index.astro`,
`harita.astro`, `harita-pilot.astro`, `stil-pilot.astro` (koyu adalarda
`koyu` prop'u) ve `public/404.html` (statik; markup+CSS tekrar). Skill notu:
CLAUDE.md tasarım skill kuralı gereği ui-ux-pro-max/frontend-design önerileri
bu işte DESIGN.md §9 durum sözlüğü (odak, hover eğrisi `--e-akinti`, gölge
yok) ve K30/K34 palet kararlarıyla sınırlı uygulandı; yeni renk/eğri
üretilmedi.

| Madde | Ölçüm (dist-sun, CSP + _redirects uygulanır) |
|---|---|
| D1 konum | `position: fixed`, sağ alt, z-index 50 (menü barı 60, mobil panel 59 üstte kalır; "içeriğe atla" 999). Kutu 430px: x288 y874 128×44 · 1440px: x1290 y834 128×44. Kapatılamaz, animasyon yok. |
| D1 çakışma | Sabit öğeler envanteri: menü barı (top, z60), mobil panel (top, z59), atla bağlantısı (z999, odakta), /harita/ ve pilot yüzer öğeler (üst/sağ-orta, z6-7). Sağ alt köşede başka sabit öğe yok → kesişme 0. |
| D2 renk | Aydınlık: zemin `--su-700` #0C5A7C, metin #fff → **7,58:1**. Koyu adalar: zemin `--kopuk`, metin `--deniz` → **12,41:1** (ana sayfa ölçümü). WhatsApp yeşili yok, palet dışı hex yok. Simge (Simple Icons yolu, CC0, inline SVG, currentColor) + "WhatsApp" etiketi birlikte. Çağrı dili yok. |
| D3 erişilebilirlik | dokunma hedefi 128×44 (≥44) · kontrast 7,58 / 12,41 (≥4,5) · `aria-label="WhatsApp ile iletişim"` (görünür metni içerir) · klavye: Tab ile odaklanıyor (`activeElement` doğrulandı), odak halkası aydınlıkta `2px #0C5A7C offset 3px`, koyuda `2px #DBEAF4 offset 3px` (K30 sözlüğü) · ekran okuyucu: `<a>` + etiket; SVG `aria-hidden`. |
| D4 numara | dist'te 523 HTML'in 0'ında numara geçiyor. href `/whatsapp/` → `_redirects` 302 → wa.me (yalnız o dosyada). JS kapalı test (Playwright, javaScriptEnabled:false): tıklama → `/whatsapp/` → 302 → `https://wa.me/905324497144` → api.whatsapp.com'a ulaştı. Satır içi script yok (bileşende script yok). |
| D5 mobil | 430×932'de kaplama **%1,4** (1440×900'de %0,43). İlk ölçümde ana sayfada sayfa sonunda imza satırıyla ("suharitasi.com · Arslan Hukuk Bürosu güvencesiyle") kesişme ölçüldü → `AltBilgi.astro` ≤720px'te `padding-bottom: calc(1.4rem + 44px + 1rem)`; ikinci ölçümde 3 sayfa × 2 genişlik sayfa sonunda kesişen öğe **0**. Hukuki şerh ("Bu sayfa hukuki görüş değildir", main içinde) kesişmiyor. |
| D6 şema | Organization `telephone` EKLENMEDİ — D4 ile çelişir (JSON-LD HTML'dedir). Karar dosyası §D. LegalService düğümü sitede yok; alan uydurulmadı. |
| D7 ölçüm | KURULAMADI: canlıda CF Web Analytics beacon 0; CF Web Analytics özel olay desteklemez; GA4 Admin API kapalı (403) ve çerez metni ister. Altyapı hazırlandı (`/whatsapp/` edge isteği); üç seçenek karar dosyası §D7. |
| D8 kareler | `cikti/denetim/whatsapp-dugme/{once,sonra}-{anasayfa,havza-gediz,rehber-iptal}-{430,1440}[-son|-odak].png` + `*-olcum.json` (24 kare + 2 ölçüm dosyası; cikti/ depo dışı). |
| D9a | 523/523 HTML'de düğme (522 sayfa + 404). |
| D9b | beş ölçüm yukarıda; taban seviyesinin altına düşen yok. |
| D9c | JS kapalı: çalışıyor (D4 satırı). |
| D9d | 3 sayfa × 2 genişlik konsol hata/uyarı 0 (dist-sun CSP altında; CSP ihlali 0). |
| D9e | Faz E'de `--tam` (md14 görsel taban, md21 dokunma). |
| D9f | Faz E'de canlı. |
| D9g | Ölçüm yok → tetiklenemez (D7). |

Süreklilik: `izleme/beklenen-301.json`'a `/whatsapp` ve `/whatsapp/` (302 →
wa.me) eklendi — md3 yönlendirme kalemi bundan sonra izler.
Görünür metin kıyası (Faz D): C'de dokunulmayan 97 sayfanın görünür metni,
"WhatsApp" etiketi düşülünce dist-once ile **bit-eşit**; sayfa 522 /
sitemap 519 küme-eş.
