# TÜRKİYE SU İDARESİ — TUR 1A-2: TERİM GENİŞLEMESİYLE YENİDEN TARAMA VE KAPANIŞ DENETİMİ

> Bu rapor TUR 1A-2'ye aittir; seri KAPANDI. Güncel nihai durum için `rapor/su-idaresi-tur1a3.md`'ye bakınız (155 kurum).

**Tarih:** 2026-07-23 · **Kapsam:** keşif + veri üretimi; site/kod değişikliği YOK.
**Önceki tur:** `rapor/su-idaresi-tur1a.md` (commit 32c6943) — LİSTE KAPANMADI.
**Bütçe:** 50 istek (üst sınır 100), istekler arası ≥5 sn.

---

## GÜNCEL NİHAİ DURUM

> ## LİSTE KAPANMADI — düşen şartlar: (1), (2), (4)
> Kapanmaya TUR 1A'da sanıldığından **daha uzak** olduğu görüldü: bu turda
> **38 yeni kurum** kayda girdi ve kuyrukta **36 kurum beklemede** kaldı.

| | TUR 1A sonu | TUR 1A-2 sonu |
|---|---|---|
| Kurum kaydı | 99 | **137** (+38) |
| Doğrulanmamış aday | 2 | **0** (ikisi de doğrulanıp listeye alındı) |
| Terim havuzu | 107 | **119** (+12, tur 3) |
| Ç3 kuyruğu | 59 işlendi / 15 beklemede / 71 toplam *(tutarsız)* | **101 işlendi / 36 beklemede / 137 toplam** |

### Kapanış tablosu (dört şart, tamamı bu turun verisiyle YENİDEN ölçüldü)

| # | Şart | Ölçüt | Bu turun ölçümü | Sonuç |
|---|---|---|---|---|
| 1 | Ç3'te TAMAMLANMIŞ bir turda yeni kurum ≤2 | tur 4 | tur 4 **tamamlanmadı** (36 beklemede) ve **23 yeni kurum** çıktı | ❌ |
| 2 | Ç4-BAĞIMSIZ DENETİM'de (yeni kaynaklarla) kaçırılan kurum ≤2 | 3 yeni kaynak | **9 kaçırılan kurum** | ❌ |
| 3 | Ç1-TEKRAR kapsamı %100 | 1 ve 4 s. CBK tam metin | **%100** (13.305 + 15.049 satır, 38+59 bölüm; metnin tamamı tarandı) | ✅ |
| 4 | Terim havuzu kapandı ya da "işlevsel kapanış" | 39 tur-2 terimi yeni kurum getirdi mi? | Ç1-TEKRAR'da **0**, ancak Ç2b-EK'te **8 yeni kurum** | ❌ |

**Sıradaki adım:** TUR 1A-3 gereklidir (otomatik başlatılmaz). Yapılacaklar listesi raporun sonunda.

---

## 0b. GEÇMİŞ ÖLÇÜM DENETİMİ — TUR 1A şart (1) ölçümü İPTAL

TUR 1A, şart (1)'i "Ç3 tur 3 → 0 yeni kurum" diyerek sağlanmış saymıştı.
**Bu ölçüm eksik veriyle alınmıştı ve iptal edilmiştir:** o anda kuyrukta
işlenmemiş kayıtlar duruyordu; beklemede kayıt varken tur TAMAMLANMIŞ sayılamaz.
Şart (1) bu turda yeniden ölçüldü ve **düştü**.

Denetim sırasında `ct3-kuyruk.json`'da üç ayrı veri bütünlüğü hatası bulundu:

1. **Özet aritmetiği tutmuyordu:** "59 işlendi / 15 beklemede / 71 toplam"
   (59+15=74≠71). Dosyadaki gerçek dağılım 59 işlendi / **12** beklemede / 71 toplam idi.
2. **Raporda sayılan 15 addan 3'ü kuyrukta hiç yoktu:** İSKİ Teftiş ve Kontrol
   Kurulu, EPDK, Mahalli İdare Birlikleri.
3. **Listedeki 30 kayıt kuyruğa hiç girmemişti** (Ç3 tur-1 sonrası ve Ç4/Ç5'te
   açılan kayıtlar kuyruğa yazılmamış). Kar topu kanalı bu kayıtlar üzerinden
   hiç yürütülmemiş görünüyor.

Üçü de bu turda onarıldı: kuyruk artık listeyle bire bir eşit (137 = 137) ve
`ozet` alanında hatanın kaydı duruyor.

---

## 1. Ç3-KUYRUK TAMAMLAMA (tur 4) — 15 istek

Beklemede duran 12 kaydın kuruluş mevzuatı açıldı (10 kanun/KHK/CBK + 3
yönetmelik indirildi), kuyruğa hiç girmemiş 30 kaydın kaynak durumu tek tek
denetlendi.

| kayıt | bu turda açılan metin | sonuç |
|---|---|---|
| AFAD | 7269 s. Umumi Hayata Müessir Afetler K. | su baskını tedbirleri açıkça DSİ'ye bırakılmış — yeni kurum yok |
| Bilimsel Değerlendirme Komisyonu | Doğal Mineralli Sular Hk. Yön. (RG 25657) | **bağlı bakanlık DOĞRULANDI: Sağlık Bakanlığı** (Yön. md.4/1-a) |
| Mahalli Çevre Kurulu | Yüksek Çevre Kurulu ve Mahalli Çevre Kurulları Yön. | bileşim doğrulandı (md.18); **yeni organ: Çevre Teknik Komitesi** |
| SHOD | 4 s. CBK md.392-397 (yerelde) | 30 s.K. mevzuat.gov.tr'de **bulunamadı** (dogrulanmadi) |
| Strateji ve Bütçe Bşk. | 13 s. CBK | su terimi içeren görev maddesi YOK |
| TÜBİTAK / TÜİK / TOBB | 278, 5429, 5174 s.K. | üçünde de su terimi içeren görev maddesi YOK — DOLAYLI (Ulusal Su Kurulu üyeliği) korunuyor |
| Türkiye Belediyeler Birliği | 5355 s.K. (yerelde) | birlik tüzüğü ayrı metin, erişilmedi |
| Havza Yönetim Heyeti | Havza Yön. Planları Yön. yeniden | **bileşim düzenlemesi bu yönetmelikte YOK** (dogrulanmadi) |
| İl Su Yönetimi Koord. Kurulu | — | kuruluş genelgesi/yönergesine atıf bulunamadı (dogrulanmadi) |
| Su Yönetimi Koord. Kurulu | — | 2012/7 s. Başbakanlık Genelgesi metnine erişilemedi (dogrulanmadi) |
| ÖÇK Kurumu / OSB / Ziraat Bankası / Tarım Kredi / üniversite merkezleri | 383 s. KHK, 4562, 4603, 1581, 2547 | yeni kurum çıkmadı; **2547 md.7/d DOĞRULANDI** |
| DPT | 540 s. KHK | mevzuat.gov.tr indirmesi 302 döndü — **açılamadı** (dogrulanmadi) |

### Turun asıl bulgusu: terim kapısı su mevzuatının içindeki kurumları kaçırıyor

TUR 1A'nın kurum çıkarımı, **kurum adının havuz terimi geçen bir cümlede
bulunmasını** şart koşuyordu. Bu, su mevzuatının kendi görev/yetki maddelerini
kaçırır. Kanıt — 2872 s. Çevre K. md.12:

> "Bu Kanun hükümlerine uyulup uyulmadığını denetleme yetkisi … Gerektiğinde bu
> yetki, Bakanlıkça; İklim Değişikliği Başkanlığına, il özel idarelerine, …
> **Türkiye Çevre Ajansına, Emniyet Genel Müdürlüğüne, Jandarma Genel
> Komutanlığına ve Sahil Güvenlik Komutanlığına** devredilir."

Cümlede tek bir havuz terimi yok; ama metnin tamamı su kirliliği hükümlerini de
içeren çevre mevzuatıdır. Bu turda, **su-özgü belgelerde (27 metin) terim kapısı
kaldırılıp belge geneli kurum çıkarımı** yapıldı. Ç3 tur-4'ün 23 yeni kurumunun
çoğu buradan geldi — hepsi TUR 1A'da **zaten açılmış** metinlerin içindeydi.

**Tur 4 kapanmadı:** bu turda kayda giren 36 kurumun kuruluş mevzuatı açılmadı,
kuyrukta tur-5 için beklemede. Şart (1) bu nedenle ayrıca düşer.

---

## 2. Ç1-TEKRAR — 0 istek (metinler yerelde), kapsam %100

39 tur-2 terimiyle 1 sayılı CBK (13.305 satır, 38 bölüm) ve 4 sayılı CBK
(15.049 satır, 59 bölüm) **tam metin** yeniden tarandı. Yalnız yeni terimler
kullanıldı; eski 68 terimle tekrar tarama yapılmadı.

**Yöntem düzeltmesi:** TUR 1A'nın "kelime-sınırlı" eşleşmesi Türkçe eklerde
kırılıyordu — "nehir havza yönetim **planı**" terimi metindeki "nehir havza
yönetim **planları**" ifadesini yakalamıyordu. Bu turda ek-toleranslı gövde
eşleşmesi kullanıldı; isabet sayısı 17'den 38'e çıktı.

| CBK | isabet alan bölüm | bulunan kurum |
|---|---|---|
| 1 s. CBK | Tarım ve Orman Bakanlığı (19), ÇŞİDB (5), Dışişleri (4) | hepsi listede |
| 4 s. CBK | DSİ (5), DKMP (2), Orman GM (2), MAPEG (1) | hepsi listede |

**Sonuç: Ç1-TEKRAR'da 0 yeni kurum.** 39 terimin 27'si 1 s. CBK'da, 34'ü
4 s. CBK'da hiç geçmiyor — beklenen bir sonuç, çünkü bu terimlerin çoğu
yönetmelik tanımlarından gelmişti.

> Not: Aynı kaynağın (4 s. CBK) belge geneli yeniden taranmasından
> **Toprak Muhafaza ve Havza Islahı Dairesi Başkanlığı** (Orman GM) çıktı.
> Bu, 39 terimin değil yöntem değişikliğinin sonucudur; şart (4) ölçümüne
> dahil EDİLMEDİ.

### Terim havuzunda düzeltilen bir uydurma

`sucul ekosistem` terimi, kaynağı "1 s. CBK md.421/1-b" gösterilerek eklenmişti.
Maddenin tam metninde bu ifade **geçmiyor**; lafzı "sucul **çevre**nin ekolojik
ve kimyasal kalitesi"dir. Terim lafzi hâliyle düzeltildi ve düzeltme gerekçesi
kayda işlendi.

---

## 3. Ç2b-EK — 15 istek · şart (4)'ü düşüren kanal

39 terimden **ayırt edici** olan 8'i seçildi (tek kelimelik genel terimler
—"alıcı ortam", "havza planı", "yüzeysel su" gibi— genel mevzuat gürültüsü
ürettiği için dışlandı; "sınır aşan sular", "sucul çevre" gibi parafrazlar da
lafzi olmadıkları için dışarıda bırakıldı):

| terim | sonuç | yeni açılan metin |
|---|---|---|
| hidromorfoloji | 5 | 23129 (Hassas Su Kütleleri Yön.), 16806 (Yerüstü Su Kalitesi Yön.) |
| kadim hak | 1 | — (zaten açık) |
| çevresel su ihtiyacı | 0 | — |
| emniyetli su | 1 | 31582 (konu dışı çıktı) |
| akım gözlem istasyonu | 3 | 10837 (Karayolu Yolboyu Afet Yön.) |
| su kullanım hakkı anlaşması | 0 | — |
| kuraklık yönetim planı | 3 | 40323 (Tarımsal Üretimin Planlanması Yön.) |
| taşkın risk haritası | 4 | **40929 (Su Kurullarının Görevleri Hk. Yön.)** |

**Ç2b-EK'in getirisi 8 yeni kurum.** Belirleyici metin, TUR 1A'da hiç
açılmamış olan **Su Kurullarının Görevleri ile Çalışma Usul ve Esasları
Hakkında Yönetmelik** (1 s. CBK md.435/A dayanaklı): Ulusal Su Kurulu, havza su
kurulları ve il su kurullarının **bileşimini** veriyor. Bu bileşimden çıkan ve
listede olmayan kurumlar: Kalkınma Ajansları, İl Sağlık Müdürlükleri, İl Afet ve
Acil Durum Müdürlükleri, Sanayi ve Teknoloji İl Müdürlükleri, İl Kültür ve
Turizm Müdürlükleri, MGM Bölge Müdürlükleri. Ayrıca Tarımsal Üretimin
Planlanması Yön.'den Tarımsal Üretimin Planlanması Kurulu ve Hayvancılık GM.

Aynı yönetmelikle **Ulusal Su Kurulu, havza su kurulu ve il su kurulu
kayıtlarının "bileşim doğrulanmadı" işareti kalktı.**

**Şart (4) değerlendirmesi:** 39 terim Ç1-TEKRAR'da 0 kurum getirdi, ancak
Ç2b-EK'te 8 kurum getirdi. Brief'in "işlevsel kapanış" tanımı ("39 terim yeni
kurum getirmediyse") **sağlanmadı** → şart (4) düştü.

---

## 4. Ç4-BAĞIMSIZ DENETİM — 3 istek + 1 arama · şart (2)'yi düşüren kanal

TUR 1A'nın dört kaynağı (Sayıştay, yatırım programı, TÜİK, TBMM) **kullanılmadı**.
Üç yeni kaynak seçildi:

| # | kaynak | neden seçildi | kaçırılan kurum |
|---|---|---|---|
| 1 | **Ulusal Su Planı 2026-2035** — "Su Yönetiminde Yer Alan Kurum ve Kuruluşlar ile Görevleri" tablosu | Resmî, birincil, kurum listesini **mevzuat atfıyla birlikte** veren tek belge; repo arşivinde zaten duruyordu (0 istek) | **7** |
| 2 | **On İkinci Kalkınma Planı (2024-2028)** su bölümü | Ulusal planlama belgesinde su politikası sorumluları | **0** |
| 3 | **1. Su Şûrası (Tarım ve Orman Bakanlığı, Ekim 2021)** katılımcı kurum listeleri | 66 üniversite + kamu + STK + özel sektör katılımıyla en geniş paydaş envanteri | **2** |

**Toplam kaçırılan: 9 kurum** (eşik ≤2) → şart (2) düştü.

### Kaynak 1'in bulduğu 7 kurum (Ulusal Su Planı kurum tablosu)

1. **İller Bankası A.Ş. (İLBANK)** — 6107 s.K. Tablodaki kaydı doğrulandıktan
   sonra yerel metinlerde de teyit edildi: 7478 s. Köy İçme Suları K. md.6 ve
   md.8, 1053 s.K. md.4.
2. **Türkiye Çevre Ajansı** — 7261 s.K.; 2872 md.12 denetim yetkisi devri.
3. **Meteoroloji Genel Müdürlüğü** — TUR 1A'nın doğrulanmamış adayıydı.
   4 s. CBK md.262 görev metninde havuz terimi yok (TUR 1A doğru tespit etmişti),
   ama Ulusal Su Planı kurum tablosunda sayılı ve Eylem 4.2.1 (kuraklık) ilgili
   kuruluşu. **Ana listeye alındı.**
4. **İklim Değişikliği Başkanlığı** — TUR 1A'nın diğer doğrulanmamış adayı.
   2872 md.12 + Ulusal Su Planı Eylem 4.2.1 ile doğrulandı. **Ana listeye alındı.**
5. **Avrupa Birliği Başkanlığı** — 4 s. CBK md.62; su faslı muhatabı.
6. **Bitkisel Üretim Genel Müdürlüğü** — 1 s. CBK md.414.
7. **Ticaret Bakanlığı** — 1 s. CBK md.441. TUR 1A bunu "kayıt açılmayan 5
   bakanlık"tan biri saymıştı; Ulusal Su Planı kurum tablosu bu kararı düşürdü.

3, 4, 6 ve 7 numaralı kayıtların CBK görev metinlerinde havuz terimi geçmiyor —
kayıt dayanağı Ulusal Su Planı tablosudur ve bu, her kaydın `erisim_notu`
alanında açıkça yazılıdır.

### Kaynak 3'ün bulduğu 2 kurum
- **Tarım ve Kırsal Kalkınmayı Destekleme Kurumu (TKDK)** — Şûra çalışma grubu
  katılımcısı; kendi mevzuatındaki su görevi **doğrulanmadı**, kuyrukta.
- **TBMM Çevre Komisyonu** — Şûra Başkanlık Divanı üyesi; daimî su görev tanımı
  **doğrulanmadı**, kuyrukta.

---

## VERİ ÖZETİ

**137 kayıt** (99 → +38), **0 doğrulanmamış aday** (2 → 0, ikisi de terfi etti).

| tur | TUR 1A | TUR 1A-2 |
|---|---|---|
| kuruluş | 14 | 28 |
| kurul | 20 | 27 |
| bakanlık | 19 | 22 |
| GM | 15 | 21 |
| yerel | 13 | 19 |
| daire | 10 | 12 |
| birlik | 7 | 7 |
| merkez | 1 | 1 |

Su ilgisi: DOĞRUDAN 91 · DOLAYLI 46. Durum: aktif 118 · mülga 18 · ad değişikliği 1.

**Bu turda:** eklenen 38, güncellenen 5 (Bilimsel Değerlendirme Komisyonu,
Üniversite Su Merkezleri, Ulusal/Havza/İl Su Kurulu), mükerrer birleşme 0.

**Referans bütünlüğü (sonda kontrol edildi):** kırık `ust_kurum_id` **0**,
kırık `halef_id` **0**.

**Tarihsel süreklilik:** 6 mülga kayıt eklendi — Denizcilik Müsteşarlığı
(→ Denizcilik GM), Çevre Müsteşarlığı (→ ÇŞİDB), Hazine Müsteşarlığı
(→ Hazine ve Maliye Bakanlığı), Nafıa Vekaleti, Devlet Personel Başkanlığı,
İstanbul Sular İdaresi Müdürler Kurulu (→ İSKİ Yönetim Kurulu), Tarım Bakanlığı
(→ Tarım Orman ve Köyişleri Bakanlığı).

### Terim havuzu

| tur | yeni | kümülatif | kaynak |
|---|---|---|---|
| 1 | 68 | 68 | Su Verimliliği Yön. + 167/831/6200/5686 s.K. + site içeriği |
| 2 | 39 | 107 | Ç2b'de açılan 13 yönetmelik + CBK görev metinleri |
| 3 | **12** | **119** | TUR 1A-2'de açılan 3 yönetmelik + Ulusal Su Planı 2026-2035 |

Havuz **kapanmadı** (eşik ≤2). Tur-3 terimleri: doğal mineralli su, jeotermal
kaynak, sanal su, su ayak izi, su güvenliği, su stresi, su bütçesi, kullanılabilir
su potansiyeli, tarımdan dönen su, arıtılmış atıksu, sektörel su tahsisi,
su kalitesi izleme, su tasarrufu, akım gözlem.

---

## UYDURMA YASAĞI — DOĞRULANAMAYANLAR

### Bu turda çözülenler
| kalem | TUR 1A durumu | TUR 1A-2 sonucu |
|---|---|---|
| Bilimsel Değerlendirme Komisyonu — bağlı bakanlık | varsayım | **DOĞRULANDI** (Doğal Mineralli Sular Hk. Yön. md.4/1-a: Sağlık Bakanlığı) |
| Üniversite su merkezleri — 2547 madde no | doğrulanmadı | **DOĞRULANDI** (2547 md.7/d) |
| Havza Yönetim Heyeti — üye bileşimi | doğrulanmadı | **hâlâ doğrulanmadı** (Havza Yön. Planları Yön.'de bileşim maddesi yok) |
| Ulusal/Havza/İl Su Kurulu — bileşim | kısmi | **DOĞRULANDI** (Su Kurulları Yön. md.4, 7, 8) |
| Meteoroloji GM — su ilgisi | aday | **DOĞRULANDI** (Ulusal Su Planı) |
| İklim Değişikliği Bşk. — su ilgisi | aday | **DOĞRULANDI** (2872 md.12 + Ulusal Su Planı) |

### Bu turda çözülemeyenler
- **30 s. Seyir ve Hidrografi Hizmetleri K.** — mevzuat.gov.tr başlık ve içerik
  aramasında bulunamadı (3 sorgu). SHOD kaydı 4 s. CBK md.392-397 ile ayakta.
- **540 s. KHK (DPT)** — mevzuat.gov.tr PDF ucu 302 döndü.
- **2012/7 s. Başbakanlık Genelgesi** (Su Yönetimi Koordinasyon Kurulu) — metne
  erişilemedi.
- **İl Su Yönetimi Koordinasyon Kurulu** kuruluş düzenlemesi — bulunamadı.
  (Not: bu kurul, Su Kurulları Yön.'ndeki **il su kurulu**ndan farklı bir
  yapıdır; ikisi karıştırılmadı, ayrı kayıtlar olarak duruyor.)
- **Ç5 sayımları** (sulama birliği adedi, SKİ adedi, kurulu havza yönetim heyeti
  sayısı, üniversite merkezi sayısı) — TUR 1A'daki "doğrulanmadı" işaretleri
  aynen duruyor; bu tur kapsamında değildi.

### Kayıt ölçütünü sağlamadığı için AÇILMAYAN adaylar (gerekçeli ret)
| aday | ret gerekçesi |
|---|---|
| Türkiye Atom Enerjisi Kurumu | 2872'deki atıf radyoaktif madde konusuna özgü, su görevi değil |
| Diyanet İşleri Başkanlığı | Mahalli Çevre Kurulu / Çevre Teknik Komitesi üyeliği; kurulun konusu su-özgü değil |
| Sosyal Güvenlik Kurumu | Atıksu Arıtma Tesisi Enerji Teşviki Yön.'nde yalnız "borcu yoktur" yazısı — usuli |
| Yükseköğretim Kurulu | 2547'de su terimi geçen görev maddesi yok; merkez kurma yetkisi tüm merkezler için genel |
| Bakanlar Kurulu / İcra Vekilleri Heyeti | genel siyasi karar organı, su idaresi birimi değil |
| İmar ve İskân Bakanlığı | 7269'da su baskını tedbirleri açıkça DSİ'ye bırakılmış |
| NATO POL Tesisleri İşletme Bşk. | akaryakıt ikmali; su görevi yok |
| Türkiye Milli Kooperatifler Birliği | TUR 1A'nın reddi doğrulandı — su görevi yok |
| Türkiye Cumhuriyet Merkez Bankası | 6446'daki atıf su ile ilgili değil |
| Devlet Bilgi Koordinasyon Kurulu | "emniyetli su" sorgusunda çıktı; konu dışı |
| Toplu Konut İdaresi Başkanlığı | tek bağlamsal geçiş; su görevi doğrulanamadı |

---

## KANAL ETKİNLİĞİ (bu tur)

| kanal | yeni kurum | harcanan istek | not |
|---|---|---|---|
| Ç3 kar topu (tur 4) | 23 | 15 | Belge geneli yeniden tarama — asıl getiri açılmış metinlerden |
| Ç2b-EK | 8 | 15 | Su Kurulları Yön. tek başına 6 kurum |
| Ç4 bağımsız denetim | 9 (7 tekil) | 4 | Ulusal Su Planı kurum tablosu (arşivde, 0 istek) |
| Ç1-TEKRAR | 0 | 0 | Metinler yereldeydi; kapsam %100 |

Kesişimler düşüldükten sonra bu turun net katkısı **38 kayıt**.

---

## TUR 1A-3 İÇİN YAPILACAKLAR

1. **Ç3 tur-5:** kuyrukta beklemede duran **36 kurumun** kuruluş mevzuatını aç.
   Şart (1) bu yapılmadan ölçülemez.
2. **Belge geneli taramayı tüm su mevzuatına yay** — bu turda 27 su-özgü metne
   uygulandı; Ç2b'de açılan 13 + bu turda açılan 6 yönetmeliğin tamamı ve su
   kanunları aynı yöntemle bir kez daha geçirilmeli.
3. **Ç2b'de açılmayan 21 sonucu aç** (TUR 1A'dan devreden madde — hâlâ açık).
4. **Ulusal Su Planı 2026-2035 eylem tablolarını** kurum kurum tara: bu turda
   yalnız kurum tablosu ve iki eylem okundu; 100+ eylemin sorumlu/ilgili kuruluş
   sütunları taranmadı. Yüksek getirili ve **0 istek** (arşivde).
5. **Erişilemeyen dört metin** için alternatif kaynak: 30 s.K., 540 s. KHK,
   2012/7 s. Genelge, İl Su Yönetimi Koordinasyon Kurulu düzenlemesi.
6. **Ç5 sayımlarını birincil kaynaktan doğrula** (DSİ faaliyet raporu, büyükşehir
   SKİ listesi, kurulu havza yönetim heyetleri) — TUR 1A'dan devreden madde.
7. **`site-saglik.mjs` kontrolü** — `su-birimleri.json` geçerli JSON mü + kayıt
   sayısı azaldı mı (azalma = 🟡). SIRADAKILER.md'de **hâlâ açık**; bu turda
   uygulanmadı (kod değişikliği kapsam dışıydı).

---

## YÖNTEM NOTU — bu turda kullanılan araçlar

- `mvara.sh` — mevzuat.gov.tr `POST /Anasayfa/MevzuatDatatable` arama ucu
  (TUR 1A'dan devraldı, değişmedi).
- Yönetmelik PDF ucu: `GET /File/GeneratePdf?mevzuatNo=..&mevzuatTur=KurumVeKurulusYonetmeligi&mevzuatTertip=5`.
  `mevzuatTur=Yonetmelik` denendi, **302 döndü** — çalışan tek değer
  `KurumVeKurulusYonetmeligi`.
- `tara.py` — ek-toleranslı gövde eşleşmesiyle terim tarayıcı.
- `kurumtara2.py` — su-özgü belgelerde terim kapısı olmadan kurum çıkarımı.
- `birlestir.py` — id'ye göre idempotent birleştirme (TUR 1A'dan devraldı).
