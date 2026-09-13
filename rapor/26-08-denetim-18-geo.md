# Denetim 1.8 — GEO (AI görünürlüğü) derin analiz

*27 Ağustos 2026 · SALT-OKUNUR · hiçbir dosya değiştirilmedi, build alınmadı, tarayıcı açılmadı*

Ölçüm tabanı: mevcut `dist/` (523 HTML, sitemap 519 URL, 4 noindex).
Depo HEAD: `a717abe`. `dist/index.html` damgası: 27.08.2026 04:44.

Kapsam: (1) alıntılanabilirlik, (2) E-E-A-T sinyalleri, (3) yapısal veri
derinliği. Yüzeysel şema envanteri ve robots/llms varlık kontrolü ÖNCEKİ
turda alındı; burada tekrarlanmadı — yalnız alan düzeyi kalite ölçüldü.

**Toplam bulgu: 27** (B1 alıntılanabilirlik 11 · B2 E-E-A-T 9 · B3 yapısal
veri 7).

---

## Puanlama yöntemi (vekil kriter kullanılmadı)

Alıntılanabilirlik puanı, "kelime sayısı" gibi vekil ölçütlerle DEĞİL, bir
AI motorunun sayfayı bağlamdan koparıp alıntılayabilmesi için gereken beş
ikili koşulla hesaplandı. Her koşul dist HTML'inden makineyle ölçüldü
(betik: `arac` dışı, geçici; komutlar bölüm sonunda):

| Kod | Koşul | Nasıl ölçüldü |
|---|---|---|
| A1 | Sayfada damıtılmış öz-cevap bloğu var | `p.oz-cevap` düğümü mevcut |
| A2 | Öznesi belli — öz-cevabın **ilk cümlesi** sayfanın konu adını taşıyor | h1'in çekirdek adı (ilk 2 kelime) ilk cümlede geçiyor |
| A3 | Olgu yoğunluğu ≥ 2 | öz-cevapta sayı + tarih + kurum adı + mevzuat atfı regex sayımı |
| A4 | Kaynak alıntının **içinde** | öz-cevapta kurum adı, mevzuat maddesi veya `kaynak:`/`erişim` ibaresi |
| A5 | Çıkarımı kolaylaştıran yapı | ≥1 soru-formunda h2/h3 **veya** `<table>` |

PUAN = (A1+A2+A3+A4+A5)/5 × 5. Ölçütlerin hepsi "alıntı bağlamdan
koparıldığında kendi kendine yeter mi" sorusunun doğrudan bileşenidir;
uzunluk, okunabilirlik skoru vb. hiçbir vekil kullanılmadı.

**A2'nin bilinen sınırı (dürüstlük şerhi):** ölçüt h1 çekirdeğinin birebir
geçmesini arar. Rehberlerde konu adı ilk cümlede eşanlamlıyla geçtiğinde
(ör. h1 "Kuyu ruhsatı…", ilk cümle "Su temini için kuyu açmadan önce
DSİ'den belge şart") ölçüt FAIL verir; bu, rehber öz-cevaplarının A2
puanını olduğundan düşük gösterir. Aşağıda rehberler için el
değerlendirmesi ayrıca yazıldı.

### Şablon başına sonuç

| Şablon | n | A1 | A2 | A3 | A4 | A5 | ort. olgu | ort. belirsizlik | PUAN/5 |
|---|---|---|---|---|---|---|---|---|---|
| goller/[slug] | 247 | 247 | 247 | 247 | 247 | 0 | 4,0 | 1,00 | **4,00** |
| nehirler/[slug] | 95 | 95 | 95 | 95 | 95 | 0 | 3,0 | 0,00 | **4,00** |
| kuyu-ruhsati/[il] | 81 | 81 | 81 | 81 | 81 | 81 | 3,4 | 0,00 | **5,00** |
| durumum/[persona] | 42 | 42 | 26 | 38 | 34 | 42 | 5,6 | 0,00 | **4,33** |
| havzalar/[slug] | 25 | 25 | 25 | 25 | 25 | 25 | 5,5 | 0,00 | **5,00** |
| rehberler/[slug] | 10 | 10 | 3 | 10 | 10 | 10 | 7,1 | 0,10 | **4,30**\* |
| su-kanunu/[slug] | 2 | 0 | 0 | 0 | 0 | 1 | 0,0 | 0,00 | **0,50** |
| nerede-su-cikar | 1 | 1 | 1 | 1 | 1 | 1 | 7,0 | 0,00 | **5,00** |
| arsiv | 1 | 1 | 0 | 1 | 1 | 1 | 9,0 | 0,00 | 4,00 |
| harita | 1 | 1 | 0 | 1 | 1 | 1 | 3,0 | 0,00 | 4,00 |
| vaka/[slug] | 1 | 1 | 1 | 1 | 1 | 0 | 7,0 | 0,00 | 4,00 |
| havza-riski | 1 | 1 | 0 | 1 | 1 | 0 | 9,0 | 0,00 | 3,00 |
| kapatma-kaydi | 1 | 1 | 0 | 1 | 1 | 0 | 7,0 | 0,00 | 3,00 |
| hangi-kurum | 1 | 1 | 0 | 0 | 0 | 1 | 1,0 | 0,00 | 2,00 |
| durumum (kapı) | 1 | 1 | 0 | 1 | 0 | 0 | 4,0 | 0,00 | 2,00 |
| ilce-sorgu | 1 | 1 | 0 | 0 | 0 | 0 | 0,0 | 0,00 | 1,00 |
| kullanilanlar | 1 | 1 | 0 | 0 | 0 | 0 | 0,0 | 0,00 | 1,00 |
| anasayfa | 1 | 0 | 0 | 0 | 0 | 1 | 0,0 | 0,00 | **1,00** |
| hakkinda | 1 | 0 | 0 | 0 | 0 | 1 | 0,0 | 0,00 | 1,00 |
| havzalar (kapı) | 1 | 0 | – | – | – | 0 | – | – | **0,00** |
| rehberler (kapı) | 1 | 0 | – | – | – | 0 | – | – | **0,00** |
| kuyu-ruhsati (kapı) | 1 | 0 | – | – | – | 0 | – | – | **0,00** |
| su-kanunu (kapı) | 1 | 0 | – | – | – | 0 | – | – | **0,00** |
| vaka (kapı) | 1 | 0 | – | – | – | 0 | – | – | **0,00** |
| ilimde-kim-yetkili | 1 | 0 | – | – | – | 0 | – | – | **0,00** |

\* rehberler A2 ölçüt sınırından etkilenmiştir; el değerlendirmesiyle 10/10
öz-cevap kendi kendine yetiyor (bkz. B1-5) — düzeltilmiş fiilî puan 5,00.

---

# BÖLÜM 1 — ALINTILANABİLİRLİK (11 bulgu)

## B1-1 · Öz-cevap 476/523 sayfada var; eksik olduğu yer tam da giriş kapıları

**NE:** Öz-cevap bloğu (`p.oz-cevap`) sitenin %91'inde var, ama YOK olduğu
12 indekslenen sayfanın 6'sı bölüm kapısı (hub), 2'si Su Kanunu içerik
sayfası, 1'i ana sayfa.

**NEREDE:** `/` · `/havzalar/` · `/rehberler/` · `/kuyu-ruhsati/` ·
`/su-kanunu/` · `/su-kanunu/taslak-takibi/` ·
`/su-kanunu/mevzuat-kutuphanesi/` · `/vaka/` · `/hakkinda/` ·
`/ilimde-kim-yetkili/` (+ noindex `/harita-pilot/`, `/stil-pilot/`).

**KANIT:** puan tablosunda A1=0 olan satırlar. Bu şablonların hepsi PUAN
0,00–1,00 bandında; sitenin geri kalanı 4,00–5,00 bandında.

**SINIF ÖNERİSİ:** KARAR — görünür metin eklenmesini gerektirir, yeni
cümle yazılması gerekir (mevcut metinden damıtılabilir ama damıtma da
yeni görünür içeriktir).

**GEREKÇE:** CLAUDE.md "İçerik ilkesi — cevap önce, dayanak sonra" bloğu
"Sitedeki her içerik sayfası" der; hub sayfalar bu bağlayıcı ilkenin
dışında bırakılmış.

**ETKİ:** Yüksek. Bölüm kapıları "Türkiye'de kaç su havzası var",
"su hukuku rehberleri" gibi kısa-kuyruk sorgularda yakalanır; AI yanıt
motoru alıntılayacak damıtılmış cümle bulamazsa listeyi değil rakibin
metnini alıntılar. Dayanak: sitenin kendi ölçümünde öz-cevaplı şablonların
olgu yoğunluğu 3,0–9,0, öz-cevapsızların 0,0.

---

## B1-2 · Su Kanunu sayfaları bir TARİH ile açılıyor, cevapla değil

**NE:** İki Su Kanunu içerik sayfasında h1'den sonraki ilk metin bloğu
güncelleme tarihidir; cevap-önce yapısı bozulmuştur.

**NEREDE:** `dist/su-kanunu/taslak-takibi/index.html`,
`dist/su-kanunu/mevzuat-kutuphanesi/index.html`

**KANIT:** (h1 sonrası ilk `<p>`, birebir)
```
taslak-takibi      → "Güncelleme: 25 Temmuz 2026"
mevzuat-kutuphanesi → "Güncelleme: 14 Temmuz 2026"
```
Sayfanın gerçek cevabı üçüncü blokta geliyor:
> "Bu sayfa, Su Kanunu taslağına ilişkin yalnızca doğrulanabilir
> gelişmeleri izler: her kayıt tarih ve kaynak bağlantısı taşır."

**SINIF ÖNERİSİ:** KARAR (görünür metin sırası değişikliği).

**GEREKÇE:** Su Kanunu, BRIEF.md'deki "neden şimdi" gerekçesinin
merkezidir ("Su Kanunu Taslağı Nisan 2026'da görüşe açıldı"). Sitenin en
zamanlı konusunda alıntılanabilirlik puanı 0,50/5.

**ETKİ:** Yüksek. "Su Kanunu ne zaman çıkacak / taslakta ne var" tipi
sorguların cevabı sayfada VAR ama ilk 280 karakterde yok.

---

## B1-3 · `/ilimde-kim-yetkili/` de aynı kalıpta açılıyor

**NE:** Araç sayfası h1'den sonra "Güncelleme: 27 Temmuz 2026" ile
başlıyor; öz-cevap bloğu yok, soru-başlık yok, tablo yok (A1–A5 = 0).

**NEREDE:** `dist/ilimde-kim-yetkili/index.html`

**KANIT:**
> "İlimde su işinden kim yetkili? Güncelleme: 27 Temmuz 2026 Kuyu
> belgelerinde hangi DSİ bölgesine başvurulur, iliniz hangi havzada,
> havzada su ne durumda — ilinizi seçin, özet tek ekranda."

Meta description (157 kr) sayfadaki hiçbir görünür bloğa karşılık gelmiyor.

**SINIF ÖNERİSİ:** KARAR.

**ETKİ:** Orta. Sayfa 81 ile hizmet eden bir araç kapısı; şu hâliyle AI
için "seçim kutusu içeren boş sayfa".

---

## B1-4 · Ana sayfa kendi h1 sorusunu cevaplamıyor

**NE:** Ana sayfanın h1'i bir sorudur; onu izleyen tek cümle o soruyu
cevaplamaz, veri hacmini ilan eder. Öz-cevap bloğu yok.

**NEREDE:** `dist/index.html`

**KANIT:**
```
H1:  Kuyunuz için ruhsat mı lazım, ceza mı geldi?
İlk paragraf: 472 yeraltısuyu kütlesi, 25 havza ve 1963'e uzanan 419
Resmî Gazete kaydı — hepsi kaynağı gösterilmiş tek haritada.
```
Aynı cümle meta description ve `llms.txt` özeti (`> …`) olarak da
kullanılıyor — yani sitenin AI'a verdiği TEK üst-özet, sorulan soruya
cevap değil.

**SINIF ÖNERİSİ:** KARAR.

**GEREKÇE:** `llms.txt`'nin `>` satırı ana sayfa meta'sından türetiliyor
(`astro.config.mjs` `llmsOlustur`, `> ${ana.aciklama}`). Ana sayfa özeti
zayıfsa AI'ın site hakkındaki tek cümlelik kavrayışı da zayıf oluyor.

**ETKİ:** Yüksek — tek noktada üç kanalı birden (SERP snippet, llms.txt
başlığı, og:description) etkiliyor.

---

## B1-5 · Rehber öz-cevapları sitenin en alıntılanabilir metni (KORUNACAK)

**NE:** 10 rehberin tamamında öz-cevap 282–300 karakter, ortalama **7,1
somut olgu** taşıyor, mevzuat atfı cümlenin İÇİNDE, belirsizlik dili
neredeyse yok (0,10/sayfa).

**NEREDE:** `dist/rehberler/*/index.html`

**KANIT:** (birebir, iki örnek)
> "Belgesiz kuyu açmak veya belge dışına çıkmak 167 s.K. m.18 uyarınca
> idari para cezası doğurur: m.18/a kapsamında 1.000–5.000 TL, m.18/b
> kapsamında 500–2.000 TL. Ceza yanında kuyu kapatılır ve masraf
> açtırandan alınır. Cezayı DSİ değil, mahallî mülkî amir
> (valilik/kaymakamlık) verir."

> "Jeotermal kaynaklar Devletin hüküm ve tasarrufundadır; faaliyet 5686
> s.K. ile ruhsata bağlıdır. Arama ruhsatında öncelik hakkı esastır, süre
> üç yıldır (m.5). İşletme ruhsatı için arama süresinin son günü akşamına
> kadar başvuru şarttır, aksi halde hak kaybı doğar; işletme süresi otuz
> yıldır (m.6)."

Her ikisi de bağlamdan koparıldığında kendi kendine yeter: özne belli,
sayı var, dayanak yanında, süre/tutar somut.

**SINIF ÖNERİSİ:** UYGULAMA yok — bu bir korunacak kalem. Yeni içerikte
şablon budur.

**ETKİ:** Bu 10 sayfa, sitenin AI-alıntı yüzeyinin çekirdeğidir.

---

## B1-6 · 342 göl/nehir sayfası: tek cümle, dört yerde birebir kopya

**NE:** Göl ve nehir sayfalarında öz-cevap = meta description =
`BodyOfWater.description` = FAQ `acceptedAnswer.text`, dördü birebir aynı
metin. Sayfada h2/h3 SIFIR. `<main>` gövdesi 134–153 kelime.

**NEREDE:** `dist/goller/*/` (247), `dist/nehirler/*/` (95)

**KANIT:**
```
Gölcük  → meta / oz-cevap / BodyOfWater.description / FAQ answer, hepsi:
"Gölcük, İzmir ili sınırlarında bir doğal göldür; yaklaşık 0,74 km²
yüzey alanına sahiptir (kaynak: OpenStreetMap, erişim 04.08.2026)."

Kirmir Çayı → aynı dört yerde:
"Kirmir Çayı, Sakarya Havzası'ndan geçen bir akarsudur (kaynak:
OpenStreetMap, erişim 04.08.2026)."

main kelime sayısı: golcuk 153 · kirmir-cayi 134 · (kıyas: gediz 630)
h2+h3 sayısı: goller/[slug] 0/247 · nehirler/[slug] 0/95
```

**SINIF ÖNERİSİ:** Şema tarafı UYGULAMA (bkz. B3-5, alt tip + havza alanı
— veri sitede zaten var, görünür metni değiştirmez). Görünür metnin
zenginleştirilmesi KARAR ve AY İLKESİ kapsamında **yeni özellik sayılır —
şimdi başlatılmaz**, SIRADAKILER'e yazılır.

**GEREKÇE:** Bu sayfalar tek olgu sunuyor ve o olguyu dört kez tekrar
ediyor. Alıntılanabilirlik ölçütlerini geçiyor (PUAN 4,00) ama
alıntılanacak tek şey var; 342 sayfa = sitenin %65'i.

**ETKİ:** Orta-yüksek. Dizin şişkinliği riski (thin content) ile AI
alıntı hacmi arasında gerilim. Şu an ölçülebilen zarar yok, ölçülebilen
kazanç da yok.

---

## B1-7 · Belirsizlik dili alıntılanabilirliği DÜŞÜRMÜYOR — ölçüldü

**NE:** Şüphe/kaçınma dilinin öz-cevapları zayıflattığı hipotezi test
edildi ve **doğrulanmadı**.

**KANIT:** Öz-cevap başına belirsizlik kelimesi ortalaması
(`olabilir|genellikle|değişebilir|muhtemelen|tahminen|yaklaşık|olasılıkla|gerekebilir|edilebilir|taşabilir|içerebilir|bulunabilir`):

```
goller/[slug]      1,00   ← tamamı "yaklaşık X km²"
rehberler/[slug]   0,10   ← 1 örnek: "ıslah-tadil yeterli olabilir"
nehirler, kuyu-ruhsati, durumum, havzalar, diğer tüm şablonlar: 0,00
```

Göllerdeki tek belirsizlik ifadesi OSM geometrisinden türetilen alan için
kullanılmış dürüst şerhtir ve `additionalProperty` içinde tam sayı ayrıca
verilmiştir (`{"name":"Yüzey alanı (km²)","value":0.74}`) — yani makine
kesin değeri, insan şerhli değeri alır.

**SINIF ÖNERİSİ:** Değişiklik ÖNERİLMEZ. Bu ifadeleri kısmak DESIGN.md
§18 "belirsizlik dili soluklaştırılmaz" ilkesine ve CLAUDE.md
"doğrulanmadı" disiplinine aykırı olur.

**ETKİ:** Bulgu negatif — kaynak buraya harcanmamalı.

---

## B1-8 · Soru-başlık kullanımı şablonlar arasında 3 kata varan uçurum gösteriyor

**NE:** AI çıkarımını en çok kolaylaştıran yapı (soru formunda h2/h3)
şablonlar arasında eşitsiz.

**KANIT:** (h2+h3 toplamı / soru formunda olanlar / oran)
```
durumum/[persona]     84 / 84  → %100
havzalar/[slug]      214 / 147 → %69
kuyu-ruhsati/[il]    837 / 557 → %67
nerede-su-cikar       12 / 7   → %58
rehberler/[slug]      84 / 32  → %38
su-kanunu/[slug]       7 / 2   → %29
arsiv                 10 / 1   → %10
anasayfa              16 / 1   → %6
goller, nehirler       0 / 0   → başlık YOK
hangi-kurum, kapatma-kaydi, havza-riski, ilce-sorgu, tüm hub'lar → %0
```

**SINIF ÖNERİSİ:** KARAR (görünür başlık metni).

**ETKİ:** Orta. `/hangi-kurum/` özellikle dikkat çekici: FAQPage şemasında
20 soru var, görünür sayfada soru-başlık 0 — şema ile sayfa arasında
yapısal uyumsuzluk.

---

## B1-9 · Bozuk OCR pasajları 82 sayfada gövde metnine gömülü

**NE:** Resmî Gazete arşivinden alınan tarihî ilan pasajları OCR
bozulmasıyla birlikte sayfa metnine giriyor.

**NEREDE:** `dist/kuyu-ruhsati/*/` (81 il sayfası) ve `dist/arsiv/`

**KANIT:** (`dist/kuyu-ruhsati/yalova/index.html` gövdesinden, birebir)
> "£ . IŞIL /. E V L t Y A O G L I YALOVA-TAŞKÖPRÜ SAHİL OVASI tmar ve
> iskân Bakanı Köy işleri ve Koop. Bakamı Orman Bakanı Y E R A L T I S U
> Y U İŞLETME SAHASI S. B A B Ü R O Ğ L U /. H . AYD1NOĞLU Prof. Dr- F .
> SAATÇİOĞLt"

**SINIF ÖNERİSİ:** Bulgu tespit edilmiştir; onarım KARAR (görünür metin +
veri hattı). AY İLKESİ kapsamında bakım sayılır ama veri dokunuşu
olduğundan BÜYÜK İŞ rejimi gerekir.

**GEREKÇE:** Sayfa bu pasajı dürüst biçimde şerhliyor ("taranmış
arşivden, dizgi hatası içerebilir") — bu doğru davranıştır. Ancak AI
motoru şerhi değil pasajı alıntılayabilir; okunamayan metin, sayfanın
güvenilirlik izlenimini de düşürür.

**ETKİ:** Orta. 82 sayfa; bunlar sitenin en yüksek alıntılanabilirlik
puanına (5,00) sahip şablonu — gürültü orada birikiyor.

---

## B1-10 · `llms.txt`'in %68'i etiketsiz "Diğer sayfalar" kovasında

**NE:** 518 satırın 351'i konu etiketi olmayan tek bir bölümde toplanmış;
göller ve nehirler için bölüm tanımı yok. Bölüm listesinde ise ARTIK
OLMAYAN bir önek duruyor.

**NEREDE:** `dist/llms.txt`; üretici `astro.config.mjs` `llmsOlustur()`,
`BOLUM` dizisi.

**KANIT:**
```
## Diğer sayfalar                                → 351 satır
## Kuyu ruhsatında il bazında yetkili kurum (81 il) → 82
## Sektöre göre su hukuku durumu                 → 43
## Havzalar (25 havza)                           → 26
## Mevzuat rehberleri                            → 11
## Su Kanunu ve mevzuat kütüphanesi              → 3
## Vaka incelemeleri                             → 2
```
`BOLUM` dizisinde `['arac/', 'Araçlar']` var; `/arac/` rotası 28.07 K2
taşımasıyla ölmüştür (Sayfa.astro yorumu: "'arac' girişi 28.07 K2
taşımasıyla öldü … ve temizlendi"). `goller/` ve `nehirler/` önekleri
dizide YOK.

**SINIF ÖNERİSİ:** UYGULAMA — `BOLUM` dizisine `goller/` ve `nehirler/`
eklenip ölü `arac/` çıkarılması görünür sayfa metnini değiştirmez, yeni
sayfa açmaz, veriyi değiştirmez; yalnız mevcut sayfaları doğru başlık
altına taşır. (Yayın zinciri dosyası olduğu için BÜYÜK İŞ rejimi.)

**ETKİ:** Orta-yüksek. `llms.txt` bölüm başlıkları AI istemcilerinin
yönlendirme sinyalidir; 342 su kütlesi sayfası bugün "diğer" diye
sunuluyor.

---

## B1-11 · `llms.txt`'te kesilmiş bir mevzuat atfı var

**NE:** Bir satırın açıklaması kapanmamış parantez ortasında bitiyor.

**NEREDE:** `dist/llms.txt`, `## Mevzuat rehberleri` bölümü.

**KANIT:**
> "- [Kaynak suyu kiralama: yetki, ihale zorunluluğu ve sözleşme](…):
> Kaynak suyu kiralamada iki soru belirleyici: kim yetkili ve hangi usul.
> Kullanım fazlası ile Devletin yerlerindeki sular il özel idaresince
> **(167 s.K.**"

Ölçüm: 518 satırın 1'inde kapanmamış parantez, 26'sı `…` ile bitiyor.
Kök neden: `Sayfa.astro`'daki `metaAciklama` kırpımı cümle sınırında
kesiyor ama parantez dengesini gözetmiyor — kesim noktası "(167 s.K." ile
biten bir cümle sonuna denk gelmiş.

**SINIF ÖNERİSİ:** UYGULAMA — kırpım fonksiyonuna parantez dengesi
kontrolü eklenmesi görünür sayfa metnini değiştirmez (meta 160 sınırı
zaten uygulanıyor), yalnız yarım atfı önler.

**ETKİ:** Düşük hacim, yüksek tekillik: kesilen şey bir KANUN ATFI.
Yarım mevzuat atfı AI tarafından hatalı alıntılanabilir.

---

# BÖLÜM 2 — E-E-A-T SİNYALLERİ (9 bulgu)

## B2-1 · Experience: sitede SIFIR birinci-el ifade

**NE:** Sitenin tamamında birinci şahıs deneyim/ölçüm ifadesi yok.

**KANIT:** 523 HTML üzerinde tarama:
```
/ölçtük|taradık|derledik|doğruladık|inceledik|gözlemledik|tespit ettik/  → 0 sayfa
/tarafımızca|kendimiz|elimizle|bizzat/                                   → 0 sayfa
/Danıştay|Yargıtay|AYM|içtihad/                                          → 10 sayfa
```
Site aynı işleri EDİLGEN dille anlatıyor:
> "419 Resmî Gazete kaydı tarandı" · "347'si il sınırına eşlendi" ·
> "Kayıtlar Resmî Gazete arşivinin taranmasıyla derlenmiştir" ·
> "yöntem 109 künyeli kayıtta doğrulanmıştır"

Vaka şablonu 1 sayfadır (`/vaka/meysu/`) ve o da KAP bildirimi
derlemesidir — üçüncü-el belge özeti, birinci-el deneyim değil:
> "KAP bildirimlerine göre şirket, Nisan 2026'daki ihale süreçlerinin
> ardından 3.395,33 hektarlık sahanın 2056 yılına kadar geçerli işletme
> ruhsatını edindiğini açıkladı."

**NE YOK:** saha gözlemi, dosya/uygulama tecrübesi anlatısı, "bu işi
yaparken şununla karşılaştık" tipi hiçbir pasaj.

**SINIF ÖNERİSİ:** KARAR (görünür metin; ayrıca TBB reklam yasağı
değerlendirmesi gerektirir — bu bir [SERDAR-HUKUK] kalemidir).

**GEREKÇE:** Edilgen dil TBB uyumu açısından güvenli tarafta duruyor;
ancak Google'ın E-E-A-T'sinde "Experience" ayrı bir ayaktır ve site bu
ayakta ölçülebilir hiçbir sinyal vermiyor. Yapılan iş VAR (419 kayıt
tarandı), sahiplenilmiyor.

**ETKİ:** Yüksek ama riskli. Dört harfin biri tamamen boş; öte yandan
düzeltmesi hukuki metin dokunuşudur, hız hedefi taşımaz (CLAUDE.md
"Altyapıda hızlı, iddiada yavaş").

---

## B2-2 · Yazar kutusu 523 sayfanın yalnız 11'inde

**NE:** `YazarKutusu` bileşeni (E-E-A-T kimlik sinyali olarak yazılmış —
kendi yorumu: "Sayfa sonu yazar kutusu: E-E-A-T kimlik sinyali") yalnızca
rehber ve vaka şablonlarında render ediliyor.

**KANIT:** `.yazar-kutusu` sınıfı geçen sayfa sayısı, şablon başına:
```
rehberler/[slug]  10/10   ✓
vaka/[slug]        1/1    ✓
kuyu-ruhsati/[il]  0/81   ✗   ← hukuki içerik taşıyor
durumum/[persona]  0/42   ✗   ← yükümlülük + son başvuru tarihi veriyor
havzalar/[slug]    0/25   ✗
su-kanunu/[slug]   0/2    ✗   ← mevzuat takibi
goller/nehirler    0/342  ✗
hakkinda           0/1    ✗
```

**NE VAR (telafi):** altbilgi künyesi 519/523 sayfada yazar adını ve
e-postayı taşıyor:
> "Künye Hukuki içerik: Av. Serdar Arslan — Arslan Hukuk Bürosu ·
> avserdararslan@hotmail.com"

İl sayfaları ayrıca başlık altında satır taşıyor:
> "Güncelleme: 27 Temmuz 2026 · Hukuki içerik: Av. Serdar Arslan"

**SINIF ÖNERİSİ:** KARAR (yeni görünür bölüm eklenmesi).

**ETKİ:** Orta. Footer künyesi taban sinyali sağlıyor; eksik olan,
sayfanın İÇERİĞİNE bağlı yazar atfı.

---

## B2-3 · Person şeması ikiye bölünmüş, iki düğümün `url`'ü çelişiyor

**NE:** Grafikte iki ayrı Person `@id`'si var ve `url` alanları farklı
yerleri gösteriyor. Article'ların yazarı, zengin ana düğüme DEĞİL,
ikincisine bağlanıyor.

**NEREDE:** `src/layouts/Sayfa.astro` (`yazarSema`, `#yazar`) ve
rehber/il/vaka şablonlarının kendi `sema` bloklarındaki author düğümü.

**KANIT:** (tüm dist taraması, benzersiz Person kimlikleri)
```
["https://suharitasi.com/#yazar",          url="https://suharitasi.com/hakkinda/"]
["https://suharitasi.com/hakkinda/#yazar", url="https://arslanhukuk.tr"]
Article.author → @id = https://suharitasi.com/hakkinda/#yazar  (92 sayfada)
```
`/hakkinda/` sayfasında İKİSİ BİRDEN aynı grafikte yayımlanıyor
(Person=2), farklı `knowsAbout` listeleriyle:
```
#yazar          knowsAbout: [Su hukuku, İdari yargı, Şirketler hukuku]
hakkinda/#yazar knowsAbout: [Su hukuku, Yeraltı suyu mevzuatı, İdari yargı,
                             Kamulaştırma hukuku]
```

**SINIF ÖNERİSİ:** UYGULAMA — iki düğümün tek `@id` altında birleştirilmesi
görünür metni değiştirmez; birleşecek alanların hepsi zaten sitede
yayımlanmış durumda (`src/data/site.js` YAZAR bloğu + hakkinda sayfası).

**GEREKÇE:** Aynı kişi için iki kimlik yayımlamak, `sameAs`'in olmadığı
bir sitede varlık çözümlemesini iyice zorlaştırır: AI/arama motoru hangi
düğümün otoritesini makaleye bağlayacağını bilemez. `#yazar` düğümü
Organization'ın `founder`'ıdır; Article'lar ona bağlanmadığı için
"yayıncı ↔ yazar ↔ makale" zinciri kopuk.

**ETKİ:** Yüksek — 92 Article'ın tamamını etkiliyor, bilinen `sameAs`
boşluğuyla birleşince tek kimlik sinyali kalmıyor.

---

## B2-4 · 81 Article'da `datePublished` yok

**NE:** Article şemasının 92 örneğinden 81'i yayın tarihi taşımıyor.

**KANIT:**
```
Article alan kapsamı (n=92):
  headline 92 · description 92 · dateModified 92 · inLanguage 92
  mainEntityOfPage 92 · image 92 · author 92 · publisher 92
  datePublished 11        ← 81 eksik
Eksik olanlar: dist/kuyu-ruhsati/<il>/index.html (81 il)
```
Aynı sayfalar görünür metinde tarih TAŞIYOR:
> "Kuyu ruhsatı — Yalova · Güncelleme: 27 Temmuz 2026"

**SINIF ÖNERİSİ:** UYGULAMA — veri sitede zaten var (`dateModified`
üretiliyor ve sayfada görünüyor), yeni alan uydurma değil. *Şerh:*
`datePublished` için doğru değer il sayfalarının ilk yayın tarihidir; bu
tarih depoda git geçmişinden ya da veri dosyasından ALINABİLİYORSA
uygulanır, ALINAMIYORSA uygulanmaz — `dateModified`'ı `datePublished`
diye yazmak uydurma olur.

**ETKİ:** Orta. Tazelik sinyali eksik; haber/mevzuat konulu içerikte AI
motorları yayın-güncelleme çiftini birlikte okur.

---

## B2-5 · Otorite bağı çok güçlü ama 402/523 sayfada HİÇ yok

**NE:** Sitenin dış otorite bağı hacmi yüksek, dağılımı aşırı eşitsiz.

**KANIT — NE VAR:** dış alan adı sayımı (dist geneli, font/kendi alanı hariç)
```
doi.org                1401     www.dsi.gov.tr           126
arslanhukuk.tr         1053     www.tarimorman.gov.tr     67
www.resmigazete.gov.tr  569     www.mevzuat.gov.tr        38
eticaret.mta.gov.tr     376     avesis.comu.edu.tr        25
dergipark.org.tr        292     acikerisim.pau.edu.tr      9
hdl.handle.net          205     www.kap.org.tr             4
                                trdizin / doaj / diğer avesis  8
```
Tek bir il sayfasında (`/kuyu-ruhsati/adana/`) 38 adet `doi.org` bağı var.

**KANIT — NE YOK:** otoriter dış bağı olan sayfa 121/523; **olmayan 402**:
```
goller/[slug]      247   ← metinde "kaynak: OpenStreetMap" yazıyor, LİNK YOK
nehirler/[slug]     95   ← aynı
durumum/[persona]   42   ← "Su Verimliliği Yönetmeliği Ek-2" diyor, mevzuat.gov.tr bağı YOK
+ 18 tekil sayfa (anasayfa, hub'lar, hangi-kurum, nerede-su-cikar, havza-riski,
  kapatma-kaydi, ilce-sorgu, ilimde-kim-yetkili, kullanilanlar, vaka, su-kanunu…)
```
Göl sayfasının TÜM dış bağları: `arslanhukuk.tr` ×2 (+ Google Fonts).

**SINIF ÖNERİSİ:** KARAR (görünür bağlantı eklenmesi = içerik değişikliği).

**GEREKÇE:** `/durumum/` en yüksek risk: 42 sayfa somut bir yükümlülük ve
son başvuru tarihi (27 Aralık 2029) bildiriyor, dayanağı olan yönetmeliğe
bağ vermiyor. Site kendi mevzuat kütüphanesinde bu bağı zaten tutuyor
(`/su-kanunu/mevzuat-kutuphanesi/`, mevzuat.gov.tr'ye 14.07.2026'da
erişilebilirliği doğrulanmış).

**ETKİ:** Yüksek. Otorite sinyali sitenin en iddialı sayfalarında değil,
il sayfalarında birikmiş.

---

## B2-6 · `rehberler/kuyu-tasima` mevzuat atfı yapıyor, mevzuat bağı vermiyor

**NE:** 10 rehberin 9'unda 2–4 `mevzuat.gov.tr` bağı var; birinde 0.

**KANIT:**
```
baraj-kamulastirmasi 2 · jeotermal-ruhsat 2 · kaynak-hakki-komsu-su 3
kaynak-suyu-kiralama 4 · kuyu-belgesi-iptal-davalari 3 · kuyu-ruhsati 2
kuyu-tasima 0            ← ✗
ruhsatsiz-kuyu-cezalari 2 · su-tahsisi-oncelik-sirasi 4
yeralti-suyu-isletme-sahasi 2
```
Oysa öz-cevabı atıf taşıyor:
> "Bu belgeler harca ve damga resmine tabi değildir (167 s.K. m.12)."

Kök neden: bu rehber tek başına `.astro` sayfası
(`src/pages/rehberler/kuyu-tasima.astro`, 303+ satır), diğerleri içerik
koleksiyonundan üretiliyor — kaynak-bağı alanı o yolda taşınmıyor.

**SINIF ÖNERİSİ:** KARAR (görünür bağlantı) — ancak diğer 9 rehberle
eşitleme olduğu için düşük tartışmalı.

**ETKİ:** Düşük hacim (1 sayfa), yüksek tekillik (rehber şablonu sitenin
otorite vitrinidir).

---

## B2-7 · Organization: üç sayfada üç farklı olgunlukta, aynı `@id` ile

**NE:** `https://suharitasi.com/#kurum` kimliği, sitenin üç yerinde farklı
alan kümeleriyle yayımlanıyor.

**KANIT:**
```
520 sayfa (Sayfa.astro): name url description email logo founder knowsAbout
/index.html            : name url description email founder knowsAbout   (logo YOK,
                         url = "https://suharitasi.com"  ← eğik çizgisiz)
/harita/index.html     : name url description founder                     (email, logo,
                         knowsAbout YOK; founder gömülü Person, @id'siz)
```
Yani `/harita/` ve `/` , diğer 520 sayfanın söylediğinden DAHA AZ şey
söyleyen aynı-kimlikli düğümler yayımlıyor. `/harita/` ve `/`,
`Sayfa.astro` çatısını kullanmıyor (kendi `<script type="application/ld+json">`
bloklarını yazıyorlar — `grep -rl 'application/ld+json' src/` → yalnız
`Sayfa.astro`, `harita.astro`, `index.astro`).

**NE YOK (Organization genelinde):** `sameAs` (bilinen, gerekçeli boş),
`address`, `telephone`, `foundingDate`, `areaServed`, `contactPoint`.
`logo` gerçek bir logo değil `favicon.svg` (kaynak yorumu bunu açıkça
kabul ediyor: "mevcut gerçek varlık favicon.svg — yeni görsel üretilmedi").

**SINIF ÖNERİSİ:** UYGULAMA — `/` ve `/harita/` Organization düğümlerinin
520 sayfadaki tam sürümle eşitlenmesi. Alanların hepsi `src/data/site.js`
içinde ZATEN var; görünür metin değişmez.

**ETKİ:** Orta-yüksek. Ana sayfa, varlık çözümlemesinde en çok taranan
sayfadır ve orada en eksik sürüm yayımlanıyor.

---

## B2-8 · "Hukuki görüş değildir" şerhi, hukuken EN AĞIR sayfalarda yok

**NE:** Sorumluluk sınırı beyanı 425/523 sayfada var; olmadığı 98 sayfa,
sitenin hukuki iddia taşıyan sayfalarıdır.

**KANIT:** `/hukuki görüş değildir|hukuki görüş, yatırım tavsiyesi/` eşleşmesi:
```
VAR:
  goller/[slug]      247/247
  nehirler/[slug]     95/95
  kuyu-ruhsati/[il]   81/81
  hangi-kurum          1/1
  ilce-sorgu           1/1
YOK:
  rehberler/[slug]     0/10   ← su hukuku rehberleri
  durumum/[persona]    0/42   ← yükümlülük + son başvuru tarihi
  havzalar/[slug]      0/25
  su-kanunu/[slug]     0/2    ← mevzuat takibi
  vaka/[slug]          0/1
  ayrıca: /arsiv/, /kapatma-kaydi/, /havza-riski/, /nerede-su-cikar/,
          tüm hub'lar, /
```
Göl sayfasındaki şerhin birebir hâli:
> "Bu sayfa hukuki görüş değildir."

**SINIF ÖNERİSİ:** KARAR — görünür hukuki metin. **[SERDAR-HUKUK] kalemi:
Claude Code tek başına karar vermez.**

**GEREKÇE:** Bir gölün yüzey alanını bildiren sayfa şerhli; idari para
cezası tutarı ve son başvuru tarihi bildiren sayfa şerhsiz. Bu ters
dizilim hem TBB uyumu hem Trustworthiness açısından denetlenmelidir.
Ayrıca `/rehberler/` sonlarında `SonrakiAdim` bileşeni "Bu konuda görüş
alın" mailto bağı sunuyor — şerh eksikliği o bağlamda ayrıca değerlendirilmeli.

**ETKİ:** Yüksek (hukuki + güven). Bu, raporun tek [SERDAR-HUKUK]
etiketli kalemidir.

---

## B2-9 · Kaynak şeffaflığı ve şerh dili sitenin en güçlü Trust ayağı (KORUNACAK)

**NE VAR:**
- Künye bloğu: 522/523 sayfa. İletişim (`mailto:`): 519/523.
- Veri tarihi görünürlüğü ("Güncelleme:" / "erişim …"): 503/523.
- Veri künyesi bloğu her veri sayfasında, kapsam + lisans + erişim tarihiyle:
  > "Veri künyesi: OpenStreetMap — kapsam: OpenStreetMap (natural=water) +
  > Natural Earth 10m; 0,5 km² üstü; erişim 04.08.2026. © OpenStreetMap
  > katkıcıları (ODbL 1.0) · Natural Earth kamu malı."
- Ölçek/yöntem şerhi ayrı blokta:
  > "Koordinat, gölün sınır kutusunun geometrik merkezidir; hidrografik
  > referans veya ölçüm noktası DEĞİLDİR."
- Negatif bulguyu gizlemeyen dil (84 sayfada "doğrulanmadı/doğrulanamadı"):
  > "Yayımlı nehir havza yönetim planlarında Yalova iline eşlenmiş yeraltı
  > suyu kütlesi kaydı bulunamadı. Bu, suyun olmadığı anlamına gelmez."
- Altbilgi veri politikası her sayfada:
  > "Sayısal veriler DSİ ve SYGM'nin kamuya açık kaynaklarından derlenir ve
  > her alanda kaynağıyla birlikte sunulur. Doğrulanamayan veri 'veri yok'
  > olarak işaretlenir."

**NE YOK:** "Güncelleme" satırı 20 sayfada eksik (tüm hub'lar, `/hakkinda/`,
`/hangi-kurum/`, `/havza-riski/`, `/kullanilanlar/`, `/`). Düzeltme
(erratum) günlüğü hiçbir sayfada yok.

**SINIF ÖNERİSİ:** Değişiklik önerilmez; korunacak kalem. Hub'lardaki
tarih eksiği KARAR (görünür metin), düşük öncelik.

**ETKİ:** Bu ayak sitenin rakiplerden ayrıştığı yerdir; AI motorlarının
"kaynak gösteren site" tercihinde doğrudan karşılığı vardır.

---

# BÖLÜM 3 — YAPISAL VERİ DERİNLİĞİ (7 bulgu)

## B3-1 · Observation ×25: ölçüm değeri YANLIŞ alanda, `value` ve `observationDate` yok

**NE:** `/havza-riski/` sayfasındaki 25 Observation düğümünde ölçülen sayı
`measuredProperty` içine gömülü bir PropertyValue'nun `value`'sunda
duruyor. schema.org'da `Observation.measuredProperty` **hangi özelliğin**
ölçüldüğünü söyler; ölçülen SAYI `Observation.value`'ya yazılır.
`observationDate` de yok — yani 25 gözlemin hiçbirinde tarih yok.

**NEREDE:** `dist/havza-riski/index.html` (kaynak: `src/pages/havza-riski.astro`)

**KANIT:**
```json
{
 "@type": "Observation",
 "name": "Asi Havzası Su Riski Puani: 63/100 (yuksek)",
 "description": "Asi Havzası için bileşik su riski puanı 63/100 (yuksek risk)…",
 "measuredProperty": { "@type": "PropertyValue", "name": "Su Riski Puani", "value": 63 },
 "observationAbout": { "@type": "Place", "name": "Asi Havzası" }
}
```
Alan kapsamı (n=25): `@type · name · description · measuredProperty ·
observationAbout` — `value` 0/25, `observationDate` 0/25, `marginOfError` 0/25.

**SINIF ÖNERİSİ:** UYGULAMA — `value: 63` ve `observationDate` eklenmesi
görünür metni değiştirmez; her iki değer de sayfada zaten görünür
("Risk puanı: 63/100", veri tarihleri risk hesabının künyesinde).

**GEREKÇE:** Şu hâliyle 25 gözlem makine tarafından "değeri olmayan
gözlem" olarak okunur; sayı yalnız serbest metinde kalıyor.

**ETKİ:** Orta-yüksek. Bu sayfa sitenin tek özgün TÜRETİLMİŞ verisidir
(6 göstergeden bileşik puan) — yani en çok alıntılanma potansiyeli olan
şey en zayıf makine sunumuna sahip.

---

## B3-2 · `includedInDataCatalog` bir DataCatalog'a değil WebSite'a işaret ediyor

**NE:** `/harita/` Dataset'i kendini bir katalog düğümüne bağlıyor, ama
verdiği `@id` sitenin WebSite düğümüdür. Sitenin gerçek DataCatalog'u
`/arsiv/`'de ve `@id` TAŞIMIYOR — dolayısıyla bağlanabilir değil.

**KANIT:**
```json
// dist/harita/index.html
"includedInDataCatalog": { "@id": "https://suharitasi.com/#site" }

// aynı grafikte:
{ "@type": "WebSite", "@id": "https://suharitasi.com/#site", … }

// dist/arsiv/index.html — asıl katalog, @id YOK:
{ "@type": "DataCatalog", "name": "Su Haritası veri arşivi",
  "description": "…", "url": "https://suharitasi.com/arsiv/",
  "inLanguage": "tr-TR", "dataset": [ … 8 Dataset … ] }
```

**SINIF ÖNERİSİ:** UYGULAMA — `/arsiv/` DataCatalog'una `@id`
(`…/arsiv/#katalog`) verilip `/harita/` Dataset'inin işaretinin ona
çevrilmesi; görünür metin değişmez, uydurma veri yok.

**GEREKÇE:** Tip uyuşmazlığı: `includedInDataCatalog` beklenen tip
`DataCatalog`, verilen düğüm `WebSite`. Bu, raporun ölçtüğü tek net
**şema tipi hatası**dır (uydurma ALAN adı bulunmadı — aşağı bkz.).

**ETKİ:** Orta. Site iki veri düğümüne sahip ve ikisi birbirine bağlanmıyor.

---

## B3-3 · Aynı tip, iki farklı olgunluk: `/harita/` Dataset'i zengin, `/kapatma-kaydi/` Dataset'i çıplak

**KANIT:**
```
/harita/#veri        : @id name description inLanguage isAccessibleForFree
                       creator includedInDataCatalog spatialCoverage
                       temporalCoverage variableMeasured citation isBasedOn
/kapatma-kaydi/      : name description temporalCoverage url inLanguage
                       isAccessibleForFree
                       ✗ @id ✗ creator ✗ spatialCoverage ✗ variableMeasured
                       ✗ citation ✗ isBasedOn
```
`/kapatma-kaydi/` sayfasında bu alanları dolduracak veri GÖRÜNÜR hâlde
duruyor: kaynak Resmî Gazete, kapsam Türkiye, ölçülen "kapatma/kısıt
hükmü içeren ilan pasajı sayısı = 23".

`DataCatalog` (n=1) alanları: `name description url inLanguage dataset` —
`publisher`, `license`, `creator`, `dateModified` YOK. İçindeki 8
Dataset'in hiçbirinde `license` yok; `temporalCoverage` bir kısmında yok.
`distribution` hiçbirinde yok — bu SAVUNULABİLİR, çünkü sayfa açıkça
"yalnız görüntüleme (indirme yok)" diyor; olmayan indirme bağı uydurmak
yasaktır.

**SINIF ÖNERİSİ:** UYGULAMA (yalnız sitede görünür veriden doldurulabilenler:
`creator` → `#kurum`, `spatialCoverage` → Türkiye, `citation` → sayfada
yazan Resmî Gazete künyesi, `publisher` → `#kurum`). `license` ve
`distribution` için sitede beyan YOK → **doldurulmaz** (uydurma yasağı).

**ETKİ:** Orta.

---

## B3-4 · Uydurma alan taraması: TEMİZ

**NE:** Tüm `@type × alan` matrisi çıkarıldı; schema.org'da o tipte
bulunmayan bir alan adına RASTLANMADI. Veriyle çelişen değer de
bulunmadı (örneklem: göl `additionalProperty` 0,74 km² ↔ görünür tablo
"0,7 km²" — yuvarlama, çelişki değil; havza FAQ "1.155,9 hm³" ↔ görünür
YAS bandı aynı sayı).

**KANIT:** Alan kapsam dökümü (n = o tipin toplam örneği):
```
Organization (520) @type @id name url description email(519) logo(518)
                   founder knowsAbout(519)
Person (520)       @type @id name jobTitle url description worksFor
                   knowsAbout image(1)
WebSite (520)      @type @id name url inLanguage publisher description(1)
BreadcrumbList(519) @type itemListElement
FAQPage (413)      @type dateModified(409) mainEntity
BodyOfWater (342)  @type name description geo additionalProperty containedInPlace
Article (92)       @type headline description dateModified inLanguage
                   mainEntityOfPage image author publisher datePublished(11)
Observation (25)   @type name description measuredProperty observationAbout
WebPage (7)        @type name description inLanguage dateModified(6) url(5)
                   isPartOf(5) @id(3) datePublished(2) primaryImageOfPage(1)
                   mainEntity(1)
ItemList (4)       @type name itemListElement numberOfItems(3) dateModified(1)
                   description(1)
Dataset (2)        (bkz. B3-3)
HowTo (2)          @type name description inLanguage step
DataCatalog (1)    @type name description url inLanguage dataset
```
Tek TİP hatası B3-2'dir; ALAN adı hatası yoktur. `Observation.measuredProperty`
alan adı geçerlidir, hatalı olan içine konan tiptir (B3-1).

**SINIF ÖNERİSİ:** Yok — bu bir temiz-rapor bulgusudur.

---

## B3-5 · 342 su kütlesi genel `BodyOfWater` ile etiketli; alt tipler ve havza alanı boş

**NE:** 247 göl `LakeBodyOfWater`, 95 nehir `RiverBodyOfWater` yerine genel
`BodyOfWater` tipiyle işaretli. Nehirlerde havza bilgisi metinde var,
şemada yok.

**KANIT:**
```
BodyOfWater n=342 (goller 247 + nehirler 95), alt tip kullanımı 0.

Nehir şeması: containedInPlace = { "@type":"Place", "name":"Türkiye" }
Nehir metni:  "Kirmir Çayı, Sakarya Havzası'ndan geçen bir akarsudur"
              → havza adı sayfada VAR, şemada YOK

Göl şeması:   containedInPlace = { "@type":"Place", "name":"İzmir, Türkiye" }
Göl tablosu:  İl=İzmir · Havza=Küçük Menderes Havzası
              → havza adı sayfada VAR, şemada YOK
```
Ayrıca göl/nehirlerde `additionalProperty` yalnız 1–2 çift taşıyor;
sayfadaki "Tür: Doğal göl" gibi değerler şemaya girmiyor.

**SINIF ÖNERİSİ:** UYGULAMA — alt tip (`LakeBodyOfWater`/`RiverBodyOfWater`)
ve `containedInPlace` zincirine havza eklenmesi; her iki değer de sayfada
görünür, uydurma yok, görünür metin değişmez.

**GEREKÇE:** Alt tip, varlığın ne olduğunu makineye tek adımda söyler;
havza bağı ise bu 342 sayfayı sitenin 25 havza sayfasına şema düzeyinde
bağlar — bugün bu bağ yalnız HTML linkinde var.

**ETKİ:** Orta-yüksek hacim (sitenin %65'i), düşük risk.

---

## B3-6 · FAQPage cevapları gerçekten cevap — ama 342'sinde şema yeni bilgi taşımıyor

**NE VAR (kalite kanıtı):** FAQ cevapları gerçek, dayanaklı ve
tek başına yeterli.
```
/hangi-kurum/ (20 soru):
  S: "Yeraltı suyu arama belgesi hangi kurumdan yapılır?"
  C: "Devlet Su İşleri Genel Müdürlüğü (DSİ). Dayanak: 167 s.K. md.8-9,
      md.13, md.15."

/havzalar/gediz/ (3 soru):
  S: "Gediz Havzası yeraltı suyu potansiyeli nedir?"
  C: "Gediz Havzası'nın yıllık yeraltı suyu (YAS) potansiyeli 2024
      itibarıyla 1.155,9 hm³'tür (DSİ). 2013-2024 döneminde %108,3 arttı."

/nerede-su-cikar/ (5 soru) — sınır bildiren dürüst cevap:
  S: "Bu veriler parselimde su çıkıp çıkmayacağını söyler mi?"
  C: "…Parsel düzeyinde tahmin değildir; kesin tespit hidrojeolojik etüt
      ve jeofizik ölçüm ister."
```

**NE ZAYIF:** 413 FAQPage'in 342'si (göl+nehir) tek soruludur ve cevabı
sayfanın öz-cevabıyla BİREBİR aynıdır (bkz. B1-6) — şema, HTML'de zaten
olanı tekrar eder, ek bilgi vermez. `dateModified` 409/413 (eksik:
`/hangi-kurum/`, `/nerede-su-cikar/`, `/kapatma-kaydi/` ve 1 rehber).

**SINIF ÖNERİSİ:** `dateModified` eşitlemesi UYGULAMA (tarih sayfada
görünür). Göl/nehir FAQ'ının zenginleştirilmesi görünür metne bağlıdır →
KARAR + AY İLKESİ gereği ertelenir.

---

## B3-7 · En büyük yapısal boşluk: 81 il sayfası 7 soru-cevap taşıyor, FAQPage YOK

**NE:** İl sayfaları soru-başlıklı bölümler ve altlarında cevaplarla
kurgulanmış (837 h2/h3'ün 557'si soru), ama yalnız Article şeması
yayımlıyor.

**KANIT:** `/kuyu-ruhsati/yalova/` görünür başlıkları ve cevapları:
```
"Bu ilde yetkili merci hangisi?"
  → "Kuyu belgeleri için başvuru mercii DSİ 1. Bölge Müdürlüğü (Bursa)"
"Havzada su durumu nedir?"
  → "Marmara Havzası: uydu ölçümüne göre son 5 yılda toplam su depolaması
     azalma eğiliminde (-0,86 cm/yıl, 60 gerçek aylık ölçümden…)"
"Bu ilde su nerelerde çıkabilir?"
  → "Yalova için yayımlı nehir havza yönetim planlarında il eşlemesi
     doğrulanmış yeraltı suyu kütlesi kaydı yoktur. Resmî Gazete'de 2
     işletme sahası kaydı bulunur."
"Arazi biçimi ne söylüyor?" …

Şema: Organization · Person · WebSite · BreadcrumbList · Article  (FAQPage YOK)
```
Aynı yapı `/havzalar/[slug]` (147 soru-başlık) ve `/rehberler/[slug]`
(32 soru-başlık, yalnız 1'inde FAQPage) için de geçerli.

**SINIF ÖNERİSİ:** **KARAR** — mevcut şemaya eksik ALAN eklemek değil,
yeni bir şema TİPİ eklemektir; ayrıca hangi soru-cevabın FAQ'a gireceği
editoryal seçimdir. Şema mimarisi değişikliği → BÜYÜK İŞ rejimi.
*Not:* AY İLKESİ'ne göre bu bir "yeni özellik" değil mevcut sayfanın
bakımıdır, ama yine de kullanıcı kararı gerektirir.

**ETKİ:** Sitedeki en yüksek hacimli tek yapısal veri fırsatı: 81 sayfa ×
7 soru = ~560 soru-cevap çifti, hepsi sitede görünür, hiçbiri şemada
yok. Aynı yapı havzalarda 147, rehberlerde 31 çift daha ekliyor.

---

# Özet — sınıf dağılımı

| Sınıf | Bulgu |
|---|---|
| **UYGULAMA** (şema alanı, görünür metin değişmiyor, veri sitede var) | B1-10, B1-11, B2-3, B2-4\*, B2-7, B3-1, B3-2, B3-3\*, B3-5, B3-6 (kısmî) |
| **KARAR** (görünür içerik/metin/bölüm) | B1-1, B1-2, B1-3, B1-4, B1-8, B1-9, B2-1, B2-2, B2-5, B2-6, B3-7, B1-6 (ertelenir) |
| **[SERDAR-HUKUK]** | B2-8 |
| **KORUNACAK / değişiklik önerilmez** | B1-5, B1-7, B2-9, B3-4 |

\* B2-4 ve B3-3'te bazı alanlar için veri sitede YOKTUR; o alanlar
doldurulmaz (uydurma yasağı) — şerhler ilgili bulguda.

---

# Kapanış — kapsam ve dürüstlük kaydı

**Taranan şablon sayısı:** 28 ayrı şablon/sayfa ailesi, 523 HTML dosyasının
tamamı (örnekleme değil, tam tarama). Şablon başına derinlemesine
incelenen örnek sayfa: 22.

**Taranan şablonlar:** anasayfa · havzalar/[slug] · havzalar (hub) ·
rehberler/[slug] · rehberler (hub) · nerede-su-cikar · goller/[slug] ·
nehirler/[slug] · durumum/[persona] · durumum (hub) · vaka/[slug] ·
vaka (hub) · hangi-kurum · ilce-sorgu · arsiv · kapatma-kaydi ·
su-kanunu/[slug] · su-kanunu (hub) · kuyu-ruhsati/[il] · kuyu-ruhsati (hub) ·
hakkinda · harita · havza-riski · ilimde-kim-yetkili · kullanilanlar ·
404 · stil-pilot (noindex) · harita-pilot (noindex).

**Kullanılan komutlar / betikler** (hepsi salt-okunur, `dist/` ve `src/`
üzerinde; geçici betikler scratchpad'de, depoya yazılmadı):
```
find dist -name '*.html' | wc -l                → 523
grep -c "<loc>" dist/sitemap.xml                → 519
grep -rl 'name="robots"' dist --include=*.html  → 4 (noindex)
grep -c "^- \[" dist/llms.txt                   → 518
awk '/^## /{s=$0;next} /^- \[/{c[s]++} …' dist/llms.txt   → bölüm dağılımı
grep -o 'href="https\?://[^"]*"' <sayfa> | sort | uniq -c

node <scratchpad>/ozcevap.mjs  <sayfalar>   → title/h1/meta/oz-cevap çıkarımı
node <scratchpad>/ld.mjs       <sayfalar>   → JSON-LD döküm (tip bazında)
node <scratchpad>/tipsablon.mjs             → şablon × tip × alan kapsam matrisi
node <scratchpad>/agrega.mjs                → şablon başına yapı/şerh sayımı
node <scratchpad>/puan.mjs                  → A1–A5 alıntılanabilirlik puanı
node -e '…'  (6 ayrı tek seferlik ölçüm: kimlik çakışması, otoriter dış bağ,
              deneyim dili, şerh kapsamı, gövde uzunluğu, llms.txt kesim)
```

**TARANAMAYANLAR — dürüst liste:**

1. **Gerçek AI motorlarında test EDİLMEDİ.** ChatGPT, Perplexity, Claude,
   Gemini veya Google AI Overviews'ta hiçbir sorgu çalıştırılmadı; sitenin
   fiilen alıntılanıp alıntılanmadığı BİLİNMİYOR. Bu rapordaki
   "alıntılanabilirlik" bir yapı ölçümüdür, bir sonuç ölçümü değildir.
2. **AI bot ziyaret kaydı incelenmedi.** GPTBot/ClaudeBot/PerplexityBot'un
   siteyi gerçekten taradığına dair sunucu logu okunmadı.
3. **Canlı site ölçülmedi.** Ölçüm yerel `dist/` üzerindedir; canlıda
   Cloudflare kuralları veya `_headers`/`_redirects` sonrası farklılık
   olup olmadığı bu turda doğrulanmadı (CANLI KOŞUL İLKESİ gereği
   `arac/dist-sun.mjs` ile teyit ayrı bir iştir).
4. **Tarayıcı açılmadı** (görev kısıtı). JS ile sonradan enjekte edilen
   şema veya metin varsa görülmedi — ancak site statik üretimdir ve
   `grep -rl 'application/ld+json' src/` yalnız üç build-time kaynağı
   gösterir, dolayısıyla risk düşüktür.
5. **Şema doğrulayıcı (Google Rich Results / schema.org validator)
   çalıştırılmadı** — ağ erişimi kullanılmadı. B3'teki tip/alan
   değerlendirmesi el incelemesine dayanır.
6. **Yasak dizinler** (`arslanhukuk*`, `bist-*`) hiç açılmadı; sitenin
   `arslanhukuk.tr`'ye verdiği 1053 dış bağın hedefi doğrulanmadı.
7. **Rakip karşılaştırması yapılmadı** — bulgular sitenin kendi içinde
   göreli, sektöre göre değil.
8. **A2 ölçütünün bilinen yanlılığı** rehberler için yukarıda şerh edildi;
   eşanlamlı özne kullanımını FAIL sayar.

**Hiçbir dosya değiştirilmedi, silinmedi; build alınmadı; tarayıcı
açılmadı. Bu rapor dosyası dışında yazma işlemi yapılmadı.**
