# HAVZA SAYFALARININ ARAMA TALEBİNE UYDURULMASI — kapanış raporu

Brief: `cikti/brief/2026-08-25T11-00-19Z-havza-talep.md` (düzeltilmiş:
`...-duzeltilmis.md`) + GSC eki `...-ek1.md` (düzeltilmiş:
`...-ek1-duzeltilmis.md`) · Worktree: `suharitasi-havza-talep` (dal
`havza-talep`) · Model: Fable 5 · Sınıf: BÜYÜK İŞ (beyan brief'te) ·
Başlangıç: 2026-08-25T11:00Z.

## 0. Rejim kapısı

### 0a. Brief denetçisi
- Ana brief: **2 ENGEL + 2 UYARI** (T5 commit+push, T7 hüküm-yazma
  kapısı; T1 + T6) → yalnız-ekleme E1-E4 sonrası **ENGEL 0, 2 UYARI**
  (ikisi T1, açıklamalı: rapor yeni çıktı; surum.json build ürünü).
  Denetimler: `cikti/denetim/brief/2026-08-25T11-01-05Z.md` + `...T11-01-18Z.md`.
- GSC eki: **1 ENGEL** (T5 DUR kapısı) → E8 ile kapandı; E8'in kendisi
  T7 tetikledi → E9 ile kapandı → **ENGEL 0, 1 UYARI** (T1 surum.json,
  açıklamalı). Denetimler: `...T11-05-30Z.md`, `...T11-05-38Z.md`, `...T11-05-45Z.md`.

### 0b. Amaç özeti
- **Amaç:** GSC'de ölçülen coğrafya talebine (~3.900 gösterim, 19
  tıklama; "X havzası nerede/harita/iller") havza sayfalarının mevcut
  VERİYLE uydurulması; www/apex sinyal bölünmesinin kapatılması (E3);
  /havzalar/ indeksinin korunması (E4).
- **Dokunulmazlar:** uydurma yasağı (coğrafi/hidrolojik/hukuki ifade
  yalnız veri kaydından) · hüküm yazılmaz · yeni özellik yok (AY) ·
  yeni renk/font/desen yok · /havzalar/ yapısı · ağırlık artışı.
- **Bitti-tanımı:** Faz 0 teşhisi ölçümlü · 25 sayfada title/desc/H1/
  öz-cevap/sıra/SSS uygulanmış · KAPI yeşil · IndexNow bildirimi log'dan
  doğrulanmış · bu rapor.
- **Kanıtlar:** önce/sonra ölçüm tabloları · eşik ihlali 0 · izole kapı
  çıktısı · /havzalar/ bit-kıyası · canlı ölçümler · uydurma denetimi
  cümle-kaynak tablosu.

### 0c. Düşman geçişi (D1-D4)
- **D1 — FAIL yolları:** (i) coğrafi iddia uydurmak ("Trakya'da",
  "kuzeybatıda") — karşı şart: konum cümlesi YALNIZ resmî il
  listesinden (il-kurum.json, SYGM tanıtım belgeleri); bölge/yön
  kelimesi hiç kullanılmadı. (ii) title >60 → md16 'title-uzun' taban
  gerilemesi — karşı şart: build içi guard (aşım build'i düşürür) +
  25/25 ölçüm 48-56. (iii) İçerik sırası değişimi md14/md21 tabanlarını
  kırar — karşı şart: izole kapı merge ÖNCESİ: G1-G6 sapma 0, dokunma
  201=201, konsol 0, taşma 0. (iv) merkezî desc kırpımı yarım sayı
  basar ("1,62…") — ölçüldü ve cümle-bütünlüklü 160 bütçesiyle çözüldü.
- **D2 — boş çıkabilecek varsayımlar:** (i) "açık/kapalı sınıflaması
  bir yerlerde vardır" — ÖLÇÜLDÜ ve YANLIŞLANDI: 25/25 havzada
  tahsis=null; sınıflama SSS'ye soru olarak KONULMADI, görünür dürüst
  şerh yazıldı. (ii) "Ergene ayrı sayfa/varlık ister" — YANLIŞLANDI:
  sitenin RG arşivi (isletme-sahalari-ek.json kayıt 36/37) "Ergene
  Havzası"nı resmî ilan adı olarak içeriyor; künyeli bölüm buradan
  kuruldu, yeni sayfa açılmadı. (iii) "havza tanımı sitede vardır"
  (Faz 3.3) — ARANDI, BULUNAMADI → tanım YAZILMADI, karar maddesi §7.
- **D3 — değen maddeler:** md24 beklentisi ↔ www yönlendirmesi (ilk
  deneme _redirects'le yapıldı, canlıda etkisiz ölçüldü; kalıcı çözüm
  panel adımı, md24 SARI ara durumu — §6.1) · sitemap lastmod ↔
  IndexNow (bugünkü içerik değişikliğini lastmod yakalamadı, elle
  bildirim yapıldı — §6.2) · breadcrumb/og:title marka ekiyle kaldı,
  yalnız <title> sorgu kalıbına geçti.
- **D4 — yarıda kesilme:** tek commit; kesilme anında main hep
  yayınlanabilirdi. İzole kapı merge öncesi koşuldu.

## 1. Faz 0 — teşhis (ölçümler 25.08.2026)

### 1.1 Sorgu-sayfa eşlemesi — ÖLÇÜLDÜ (GSC eki, varsayım kalmadı)
Kullanıcı GSC Sayfalar verisini iletti: Ergene ailesinin ~2.700
gösterimi **/havzalar/meric-ergene/** sayfasına düşüyor (2 tıklama,
binde 0,7). /havzalar/ indeksi 37/761 (%4,9) ile sitenin en iyi
sayfası. [VARSAYIM] etiketi gerekmedi; yanlış-sayfa-optimizasyonu
riski kalktı.

### 1.2 Neden tıklanmıyor — hipotez sonuçları
| Hipotez | Durum | Kanıt |
|---|---|---|
| (a) başlık sorguyla eşleşmiyor | **KANITLANDI** | 25/25 canlı title "[Ad] — Su Haritası"; "nerede/iller/harita" hiçbirinde yok |
| (b) açıklama şablon/teknik | **KANITLANDI** | 25/25 aynı kalıp: "DSİ 2024 verisine göre X km² yağış alanı..." — sorgunun cevabı değil |
| (c) sayfa "nerede"ye ilk ekranda cevap vermiyor | **KANITLANDI** | öz-cevap yalnız yağış alanı+GRACE; iller tablosu ve konum haritası sayfa SONUNDA |
| (d) sıralama geride | **ÖLÇÜLMEDİ** | sunucu Türkiye'de değil; karar dayanağı yapılmadı (brief 0.4d) |
| (E2) "Ergene" görünürlüğü | **ÖLÇÜLDÜ** | canlıda "Ergene" yalnız "Meriç-Ergene" bileşiğinde (title poz. 7); müstakil "Ergene Havzası" geçişi 0 |

**BULGU-2'nin ölçülen açıklaması** (indeks 37 tıklama alırken havza
sayfaları almıyor): /havzalar/ title'ı ("Havzalar — Su Haritası") ve
açıklaması ("Türkiye'nin 25 su havzası: sınırlar, su potansiyeli...")
tıklama alan sorgu ailesiyle ("su havzaları/havzalar haritası")
EŞLEŞİYOR ve harita ilk ekranda (svg ilk 15KB'ta). Havza sayfalarında
ise sorgu kalıbının hiçbir öğesi (nerede · iller · harita) title/desc/
ilk ekranda yoktu. Fark içerik eşleşmesidir; ölçülemeyen sıralama
etkeni karar dışı.

### 1.3 Ticari omurga şerhi (brief'ten, aynen)
146 sorguda kuyu ruhsatı / ruhsatsız kuyu cezası / su tahsisi HİÇ YOK —
gelen talep coğrafya talebidir. Bu iş o talebe cevaptır; ticari
sorgular için ayrı bir sonuç vaat edilmez.

### 1.4 Veri envanteri (0.5) — sorgu → veri eşleşmesi
| Sorgu kalıbı | Veri | Durum |
|---|---|---|
| (a) X nerede | il-kurum.json havzaIlleri 25/25 (SYGM tanıtım belgeleri) + konum SVG (havza-harita.js) | CEVAPLANIR (il listesi + harita; bölge/yön verisi YOK, yazılmadı) |
| (b) X harita | konum SVG (kapsanan iller haritası, dürüst etiketli) mevcuttu, sayfa SONUNDAYDI | CEVAPLANIR — öne taşındı |
| (c) X hangi iller | havzaIlleri 25/25 | CEVAPLANIR |
| (d) açık mı kapalı mı | havza-veri.json tahsis: 25/25 **null**; tek istisna resmî AD "Konya Kapalı Havzası" | **CEVAPLANAMAZ** — dürüst şerh basıldı, SSS'ye soru konulmadı (4 sorgu ailesi: Fırat-Dicle, Susurluk, Çoruh, Asi) |
| (e) havza sorgulama | /havzalar/ indeksi (menüden 1 tık, 25 kart) + il/ilçe yolları | MEVCUT — yeni araç yazılmadı (§5) |
| (f) havza ne demek | sitede tanım içeriği ARANDI: yok | **CEVAPLANAMAZ** — tanım yazılmadı; karar maddesi §7 |

### 1.5 E3 www/apex ölçümü
`https://www.suharitasi.com/havzalar/gediz/` → **HTTP 200** (yönlendirme
YOK), canonical apex ✓. Canonical doğru ama yönlendirme olmadığından GSC
iki host'u ayrı saydı (gediz apex 0/50 + www 2/49). Düzeltme denemesi
ve sonucu §6.1'de: `_redirects` host kuralı denendi, canlıda etkisiz
ölçüldü (Pages alan-düzeyi yönlendirme desteklemiyor — resmî belge),
kaldırıldı; kalıcı çözüm panel Redirect Rule = kullanıcı adımı (§7).
md24 üç durumlu güncellendi (KARARLAR §27'deki md24 kaydının yerini
alır; §29).

### 1.6 E5 şerhi
/su-hukuku/ GSC'de 0/2 ile görünüyor — sayfa 25.08 sabahı kaldırılıp
301 kondu (KARARLAR §26); GSC verisi gecikmelidir, arıza değildir,
işlem yapılmadı.

## 2. Uygulama (25 sayfada, tümü veriden)

### 2.1 Önce → sonra (şablon; içerik havza verisinden)
| Alan | ÖNCE (25/25 ölçüldü) | SONRA (25/25 ölçüldü) |
|---|---|---|
| title | `[Ad] — Su Haritası` (34-38 kr) | `[Ad] Nerede? Kapsadığı İller ve Haritası` (48-56 kr; >60 build'i düşürür) |
| H1 | `[Ad]` | `[Ad] nerede, hangi illeri kapsar?` |
| description | `[Ad], DSİ 2024 verisine göre X km² yağış alanı...` | `[Ad] E, F, G ve H illerini kapsar.` (+sığarsa su varlığı cümlesi; 50-160 bandı, cümle bütünlüğü korunur) |
| öz-cevap | yağış alanı + GRACE | **konum cümlesi önce** → su varlığı → (bütçe kalırsa GRACE); ≤280 |
| içerik sırası | künye/YAS ... iller+harita EN SONDA | **iller + konum haritası öz-cevabın hemen altında**; diğer bölümler sırasıyla korundu, hiçbiri silinmedi |
| SSS şeması | 1 soru (YAS) | 3 soru: nerede · hangi iller · YAS; açık/kapalı sorusu VERİ OLMADIĞI İÇİN KONULMADI |

Konum cümlesi kuralları: ≤5 il → tam liste ("Meriç-Ergene Havzası
Edirne, Kırklareli, Tekirdağ ve İstanbul illerini kapsar."); >5 il →
"aralarında A, B, C de bulunan N ilin topraklarını kapsar." (ilk üç =
kaynak listesindeki ilk üç; önem sıralaması İDDİA EDİLMEDİ). Ardışık
ad tekrarı önlendi (ikinci cümlenin öznesi "Havza"). "İller havzaya
kısmen girebilir" şerhi il bölümü kaynak notunda ve SSS cevabında.

### 2.2 Ergene (E2) önce → sonra
- ÖNCE: "Ergene" yalnız bileşik adda; müstakil "Ergene Havzası" geçişi 0.
- SONRA: title "Meriç-Ergene Havzası Nerede? Kapsadığı İller ve
  Haritası" (56 kr, Ergene poz. 7) · H1 soru biçimi · gövdeye künyeli
  yeni bölüm: **"Ergene Havzası ile Meriç-Ergene Havzası aynı yer mi?"**
  — kaynağı sitenin RG işletme-sahası arşivi (kayıt 36: RG 05.11.2009,
  sayı 27397, resmigazete.gov.tr bağlantısı; Ergene Havzası işletme
  rezervi 376,2 hm³/yıl, Meriç 59 hm³/yıl aktarımı). Müstakil "Ergene
  Havzası" geçişi 0 → 2. Hüküm yazılmadı — ilan VARLIĞI ve sayıları
  aktarıldı.

### 2.3 Açık/kapalı sınıflaması (2.3)
Veri kaydı yok (25/25 tahsis=null) → il bölümü kaynak notuna dürüst
şerh: "Açık/kapalı havza sınıflaması: havza bazlı tahsis ve kısıt
kararları resmî kaynakta kamuya açık ve derli biçimde yayımlanmadığından
bu sitede sınıflama verisi yer almaz; doğrulanmamış bilgi yazılmaz."
(Mevcut hukuk-kısıt fallback'iyle aynı dil ailesi.) Tahmin yazılmadı;
Konya için de ek iddia üretilmedi (resmî ad zaten "Kapalı" taşıyor).

## 3. Uydurma denetimi — eklenen her cümlenin kaynağı
| Eklenen ifade | Kaynak (veri kaydı / künyeli içerik) |
|---|---|
| "[Ad] ... illerini kapsar." | data/il-kurum.json havzaIlleri (SYGM havza tanıtım PDF'leri; her havzada `kaynak` URL'si) |
| "aralarında A, B, C de bulunan N ilin topraklarını kapsar" | aynı liste; N=uzunluk, A-C=listenin ilk üçü (sıralama iddiasız) |
| "Türkiye'nin 25 su havzasından biridir (DSİ)" (SSS) | data/havza-veri.json — 25 kayıt, DSİ kaynak künyesi; /havzalar/ mevcut açıklaması aynı sayıyı taşıyor |
| "İller havzaya kısmen girebilir; liste resmî havza belgesinden derlendi" (SSS) | sayfadaki MEVCUT kaynak-notu cümlesi (il-kurum derlemesi) |
| Açık/kapalı şerhi | mevcut hukuk-kısıt fallback metninin (künyeli) uyarlaması; yeni olgu iddiası içermez |
| Ergene bölümündeki tüm olgular | veri/potansiyel/isletme-sahalari-ek.json kayıt 36-37: RG 05.11.2009 · sayı 27397 · kaynak URL · pasajdan aktarılan rezerv sayıları |
| H1/title soru kalıpları | GSC sorgu verisi (kullanıcı, 25.08) — içerik iddiası değil biçim |

## 4. E4 — /havzalar/ koruma kanıtı
`src/pages/havzalar/index.astro` dokunulmadı. Bit-kıyas (canlı HTML vs
worktree build; surum damgası ayıklanarak): **fark yalnız Cloudflare
e-posta gizleme yeniden yazımı** (mailto → /cdn-cgi/l/email-protection +
decode script enjeksiyonu — GUNLUK 28.07'de kayıtlı CDN davranışı).
title/description/H1/ilk ekran/harita konumu bit-eşit.

## 5. Faz 4 — sorgulama yolu ve çapraz bağlar (ölçüm)
- "havza sorgulama": /havzalar/ indeksine menüden 1 tık; 25 havza kartı
  tek ekranda; il yolu (/kuyu-ruhsati/[il]/) ve /ilce-sorgu/ mevcut.
  YENİ ARAÇ YAZILMADI (AY); indeks zaten sitenin en çok tıklanan
  sayfası — görünürlük sorunu ölçülmedi.
- Çift yön: havza→il (il tablosu linkli) ✓ · havza→göl/nehir (M5.7
  bölümü) ✓ · göl/nehir→havza ✓ (agustos-uyum'da kurulmuştu) ·
  havza↔havza (kesişen iller) ✓. Yeni link EKLENMEDİ → md21 dokunma
  ölçümü değişmedi (izole: ihlal 201 = taban 201).

## 6. KAPI (izole, merge öncesi + canlı, merge sonrası)
İzole `--hizli` (dist-sun + --kok worktree): **11 GEÇTİ · 1 KIRMIZI =
md24** — beklenen geçiş penceresi: md24 canlı www'yi ölçer, canlıda 301
henüz yoktu; aynı zamanda yeni md24 mantığının falsifikasyonu (200
gördü → kırmızı). G1-G6 sapma 0 (taban yenileme bile gerekmedi) ·
dokunma 201=201 · konsol 0 · taşma 0 · sitemap 519 geçerli · build
temiz 522 · title/desc/öz-cevap eşik ihlali 25/25'te 0 · sitemap loc
kümesi canlıyla fark 0 · ağırlık: sayfa başına +0,5-1,3KB (bölüm
taşıma + SSS; medya/JS eklenmedi, Lighthouse canlı koşuda).

## 6.1 Yayın ve canlı doğrulama
- Merge 1: `55cd794` → deploy canlı 13:19:16Z (surum.json imzası).
  Canlı ölçüm: meric-ergene title/desc/H1 yeni biçimde ✓.
- www ÖLÇÜMÜ SONRASI DÜZELTME + İTİRAF: `_redirects`'e yazdığım host'lu
  kural canlıda ETKİSİZ ölçüldü (www hâlâ 200). Resmî belge okundu
  (developers.cloudflare.com/pages/configuration/redirects, 25.08.2026):
  Pages `_redirects` alan-düzeyi yönlendirmeyi DESTEKLEMEZ ("Domain-level
  redirects ❌") — ilk commit'teki "desteklenir" varsayımım yanlıştı.
  Kural kaldırıldı; çözüm Cloudflare panel Redirect Rule = KULLANICI
  ADIMI (§7). md24 üç durumlu yapıldı: 301=yeşil · 200+canonical
  apex=SARI ("panel adımı bekleniyor" — kalıcı kırmızı gürültüsü
  üretmeden eksik adımı görünür tutar) · diğer=kırmızı.
- Merge 2: `7e3740b` → deploy canlı 13:23:48Z.
- md24 falsifikasyonları (izole, SAGLIK_WWW_EZME): 301 hedefli URL
  (.tr) → GEÇTİ "www 301 → apex · hedef 200 + canonical apex" · 404
  URL → KIRMIZI. Sarı yol canlı `--tam`da ölçüldü (§6.2).

## 6.2 IndexNow bildirim kanıtı (KAPI)
İçerik değişen 25 havza sayfası `--url-dosya` ile yeniden bildirildi:
`2026-08-25T13:26:14Z koşum: canlı=7e3740b sitemap=519 URL, fark=25 →
parti 1: 25 URL → HTTP 200` (log/indexnow.log). Not: sayfaların sitemap
lastmod'u veri tarihinden geldiği ve bugünkü değerler sabah
bildirilenlerle aynı olduğu için otomatik fark bu İÇERİK değişikliğini
yakalayamazdı — elle liste bu yüzden kullanıldı; yarınki veri
güncellemesinde (baraj ~15:05) havza sayfaları olağan döngüde yeniden
bildirilecek.

## 7. KULLANICI ADIM LİSTESİ (panel işleri)
1. **www → apex 301 (Cloudflare Redirect Rule, ~2 dk):**
   dash.cloudflare.com → suharitasi.com bölgesi → sol menü **Rules** →
   **Redirect Rules** (veya Rules → Overview → Create rule) → hazır
   şablon **"Redirect from WWW to Root"** → kuralı seç → Deploy.
   Kurulunca md24 kendiliğinden SARI→YEŞİL döner (301 ölçümü); GSC'deki
   www satırları zamanla apex'te birleşir.
2. Önceki listeden değişmeden duranlar: Bing Webmaster kaydı + GSC
   sitemap/tekil istek + (isteğe bağlı) Crawler Hints
   (rapor/indeks-bildirimi.md §7).

## 8. Kullanıcı kararı bekleyenler
- **"Havza ne demek/nedir" tanımı (Faz 3.3):** sitede tanım içeriği
  YOK (dahili arama: rehberler + havza indeksi + sayfa şablonları).
  Teknik/hukuki tanım yazmak içerik kararıdır; kaynaklı bir tanım
  metni [SERDAR-HUKUK] onayıyla eklenebilir (ör. /havzalar/ girişine
  bir cümle + kaynak). O zamana dek (f) sorgu ailesi CEVAPSIZ kalıyor.
- Açık/kapalı sınıflaması için resmî derli kaynak bulunursa (DSİ/SYGM),
  veri kaydı olarak eklenip (d) ailesi cevaplanabilir — bugün veri yok.

## 9. BEKLENTİ ŞERHİ
Bu iş bir hipotez testidir, garanti değildir. Sayfalar zaten indekste
(gösterim alıyorlar); değişen şey sayfanın sorguyla eşleşme yüzeyi
(title/desc/H1/ilk ekran/SSS). Hedef sıralama ve tıklama oranı; etki
1-4 haftada GSC Performans'tan ölçülür (Ergene ailesi ~2.700 gösterimlik
tek sayfa = en net gözlem noktası). Sıralama hipotezi (d) hiç
ölçülmedi; iyileşme çıkmazsa bir sonraki şüpheli odur ve bu ortamdan
ölçülemez.

## 6.3 Canlı `--tam` sağlık koşusu (merge sonrası, 13:26-13:36Z)
**GENEL: SARI — kırmızı 0 · sarı 2 · geçti 21.** İki sarı da açıklamalı:
md24 = bu işte TASARLANAN ara durum ("www 200 + canonical apex — panel
Redirect Rule bekleniyor"; kullanıcı adımıyla yeşile döner) · md17 =
işten bağımsız dış-bağlantı zaman aşımı (sabahki koşularda da sarıydı).
İşle ilişkili kalemler: md16 bulgu 20 = taban 20 (yeni title'lar
'title-uzun' üretmedi; guard çalıştı) · md14 G1-G6 sapma 0 (bölüm
taşımaya rağmen; taban yenileme gerekmedi) · md13 kontrast AA ·
md21 dokunma 201 = taban 201 · md5 konsol 0 · md8 taşma 0 ·
md15 a11y 100/100 · md9 Lighthouse tabanda (/havzalar/sakarya/ 98/89) ·
md2 erişim 519/519 · md23 altın örnek 23/23. Taban gerilemesi 0.
