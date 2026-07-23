# TÜRKİYE SU İDARESİ — TUR 1A-3 (SERİNİN SON TURU): ULUSAL SU PLANI EYLEM TABLOLARI + HANGİ-KAPI KEŞFİ

**Tarih:** 2026-07-23 · **Kapsam:** keşif + veri üretimi; site/kod değişikliği YOK.
**Önceki tur:** `rapor/su-idaresi-tur1a2.md` (commit 9a541e0) — 137 kurum, liste kapanmadı.
**Bütçe:** ~24 istek (üst sınır 50; ana iş yerel dosya, 0 ağ isteği).
**Seri kuralı:** Bu, TUR 1A serisinin SON turudur. Sonuç ne olursa olsun TUR 1A-4 ÖNERİLMEZ.

---

## GÜNCEL NİHAİ DURUM

> ## SERİ KAPANDI — kalan boşluklar "BİLİNEN EKSİKLER"e devredildi
> Dört kapanış şartından üçü bu turda sağlandı; şart (4) doğası gereği
> sağlanamaz (aşağıda). Seri kuralı uyarınca yeni tur açılmaz.

| | TUR 1A-2 sonu | TUR 1A-3 sonu |
|---|---|---|
| Kurum kaydı | 137 | **155** (+18) |
| Doğrulanmamış aday | 0 | 0 |
| Terim havuzu | 119 | **126** (+7, tur 4) |
| Ç3 kuyruğu | 101/36/137 | **137 işlendi / 0 beklemede / 137** |
| İşlem envanteri (yeni) | — | **20 işlem** (`su-islemleri.json`) |
| Hangi-kapı eşlemesi (yeni) | — | **20 satır** (`hangi-kapi.json`) |
| USP eylem bağı olan kayıt (yeni) | — | **64 kayıt** (`usp_*_eylemler[]`) |

### Kapanış tablosu (dört şart, bu turun verisiyle ölçüldü)

| # | Şart | Ölçüt | Bu turun ölçümü | Sonuç |
|---|---|---|---|---|
| 1 | Ç3'te TAMAMLANMIŞ turda yeni kurum ≤2 | tur 5 | tur 5 **tamamlandı** (0 beklemede); Ç3'ün kendisi **0 yeni kurum** (kar topu doygun) | ✅ |
| 2 | Ç4'te (yeni kaynaklarla) kaçırılan kurum ≤2 | 2 yeni kaynak | **0 yeni tescil edilebilir Türk kurumu** | ✅ |
| 3 | Ana kaynak kapsamı %100 | USP eylem tabloları | **141/141 eylem** okundu (koordinat tabanlı ayrıştırma) | ✅ |
| 4 | Terim havuzu kapandı (son turda ≤2 yeni terim) | USP eylem başlıkları | **+7 yeni terim** | ❌ |

**Şart (4) hakkında:** terim havuzu her yeni birincil kaynakta büyümeye devam
ediyor (tur 1: 68, tur 2: +39, tur 3: +12, tur 4: +7). Azalan ama sıfırlanmayan
bir eğri — her yeni belge birkaç yeni terim getirir. Bu, kurum kapsamının
kapanmadığı anlamına GELMEZ: tur 4 terimlerinin hiçbiri yeni kurum getirmedi
(USP kurumları zaten eylem sütunlarından çıkarılmıştı). Şart (4) bu serinin
ölçeğinde **yapısal olarak sağlanamaz**; seri kuralı bu nedenle vardır.

---

## 0b. FORMAT ÖN KONTROLÜ — OCR gerekmedi

Ulusal Su Planı 2026-2035 PDF'i **Microsoft Word LTSC** üretimi; metin katmanı
sağlam. Üç rastgele sayfa testi: s.20 → 3.461, s.60 → 3.915, s.100 → 2.335
karakter. `pdftotext` doğrudan çalıştı; tesseract/OCR yoluna gerek kalmadı.
(NACE dersi uygulandı — taranmış PDF tuzağı önce test edildi.)

---

## 1. ANA İŞ — ULUSAL SU PLANI 2026-2035 EYLEM TABLOLARI (yerel dosya, 0 istek)

Plan s.91-109'daki eylem tabloları (141 eylem) okundu. Tablo hücreleri dikey
ortalanmış ve sütunlar dar olduğu için düz `pdftotext` sütunları karıştırıyordu;
`pdftotext -bbox-layout` ile **kelime koordinatları** çıkarılıp sütun sınırları
kelime-x histogramının çukurlarından kalibre edildi (315 / 457 / 587 / 652 pt).
Satır bantları "Eylem N.N.N" çapası + Strateji/Hedef ayraç satırlarından
hesaplandı.

**Doğrulama:** 141 eylemin tamamı ayrıştı; "uygulama dönemi" sütunu yyyy-yyyy
kalıbıyla her satırda çapraz kontrol edildi (şüpheli satır: 0). İki satır
(5.2.11, 8.2.10) ham layout'a karşı elle doğrulandı — sütunlar doğru.

### a-b. Kurum çıkarımı — 18 yeni kayıt

Eylem tablolarının "sorumlu" ve "ilgili kuruluş" sütunlarındaki jetonlar
(kısaltma sözlüğü USP s.11-13'ten) mevcut 137 kayıtla eşlendi. Listede olmayan
ve kamu kurumu olan her jeton, CBK/kanun atfı yerel metinden teyit edilerek
eklendi:

| kayıt | dayanak (yerelden teyitli) |
|---|---|
| Eğitim ve Yayın Dairesi Bşk. (TOB) | 1 s. CBK md.412/1-ö; USP'de 6 eylemde sorumlu |
| Bilgi Teknolojileri GM (TOB) | 1 s. CBK md.412/1-j; USP Eylem 5.2.11 |
| AB ve Dış İlişkiler GM (TOB) | 1 s. CBK md.412/1-h, md.422 |
| Gıda ve Kontrol GM | 1 s. CBK md.412/1-a, md.413 |
| Harita GM | 4 s. CBK md.168-169 (MSB bağlı kuruluşu); USP Eylem 3.1.2 |
| Devlet Hava Meydanları İşletmesi GM | USP Eylem 3.3.2 |
| Gençlik ve Spor Bakanlığı | 1 s. CBK md.184; USP Eylem 3.3.2 — *TUR 1A'nın "kayıt açılmayan 5 bakanlık"ından biriydi* |
| Çalışma ve Sosyal Güvenlik Bakanlığı | 1 s. CBK md.170 vd.; USP Eylem 7.3.2 — *aynı 5 bakanlıktan biriydi* |
| Yükseköğretim Kurulu | 2547 s.K. md.7/d; USP'de 4 eylemde sorumlu — *TUR 1A-2'de reddedilmişti, USP kararı düşürdü* |
| Üniversiteler | USP'de 3 sorumlu + 12 ilgili eylem |
| Valilikler | 5442 s.K.; USP'de 9 sorumlu + 12 ilgili; Su Kurulları Yön. md.8 |
| Kaymakamlıklar | 5442 s.K.; USP Eylem 4.1.5 |
| TCDD | USP Eylem 4.1.1 + 4 ilgili |
| TRT | USP'de 3 eylemde sorumlu (afet farkındalığı) |
| RTÜK | USP Eylem 8.1.2 |
| Türkiye Ziraat Odaları Birliği (TZOB) | USP Eylem 5.4.3 |
| OSB Üst Kuruluşu (OSBÜK) | 4562 s.K. md.2, md.3/1-i; USP Eylem 8.2.3 |
| Mekânsal Planlama GM | 1 s. CBK md.101-102 |

### c. Faaliyet çıkarımı — 64 kayıtta USP eylem bağı

64 kayda `usp_sorumlu_eylemler[]` ve `usp_ilgili_eylemler[]` alanları eklendi
(eylem no + kısa başlık). En yoğunları: Tarım ve Orman Bakanlığı (109 sorumlu /
36 ilgili), DSİ (64/11), SYGM (62/23), Belediyeler (41/17), ÇŞİDB (37/27).
Bu, **TUR 1B'nin (kurum × faaliyet matrisi) hazır girdisidir.**

### d. Terim havuzu — +7 (tur 4)

Eylem başlıkları ve gösterge sütunundan: kurakçıl peyzaj, alt havza, su iletişim
planı, atıksu geri kazanımı, nitrat, taşkın erken uyarı sistemi (TEUS), ulusal
su bilgi sistemi (USBS). Havuz 119 → 126.

---

## 2. Ç3-KUYRUK TAMAMLAMA (tur 5) — 11 istek · TAMAMLANDI

36 "beklemede" kaydın tamamı işlendi. 11 kuruluş kanunu indirildi:
6107 (İller Bankası), 2692 (Sahil Güvenlik), 3201 (Emniyet), 2803 (Jandarma),
6001 (Karayolları), 6083 (Tapu Kadastro), 5648 (TKDK), 4457 (TÜRKAK),
7261 (Türkiye Çevre Ajansı), 5449 (Kalkınma Ajansları), 2863 (Kültür ve Tabiat
Varlıkları). Kalan kayıtlar yerelde açık metinler ya da USP ile teyitli.

**Ç3'ün kendi getirisi: 0 yeni kurum.** İndirilen 11 kanunun su-bağlamlı belge
geneli taramasında listede olmayan Türk su kurumu çıkmadı (yalnız zaten kayıtlı
TÜRKAK ve konu-dışı organlar). Kar topu doygunluğu doğrulandı → **şart (1) ✅**.

Tek erişilemeyen: **132 s. Türk Standardları Enstitüsü Kuruluş K.** —
mevzuat.gov.tr PDF ucu 302 döndü. TSE kaydı DOLAYLI dayanağıyla (İçme-Kullanma
Suyu Havzaları Yön. TSE atfı) ayakta; beklemede bırakılmadı.

---

## 3. Ç4-BAĞIMSIZ DENETİM — 2 istek · İKİ YENİ KAYNAK · şart (2) ✅

Önceki turların kaynakları (TUR 1A: Sayıştay, yatırım programı, TÜİK, TBMM;
TUR 1A-2: Ulusal Su Planı kurum tablosu, 12. Kalkınma Planı, 1. Su Şûrası)
kullanılmadı. İki yeni bağımsız kaynak:

| # | kaynak | neden seçildi | kaçırılan Türk kurumu |
|---|---|---|---|
| 1 | **AB İlerleme Raporu — Türkiye 2025** (ab.gov.tr, 24.11.2025) | Fasıl 27 su müktesebatı muhatapları, dış bağımsız bakış | **0** |
| 2 | **TÜBA — Su Kaynakları Yönetiminde Havza Ölçekli Faaliyetler** (raporu) | Akademik/üniversite kaynağı, katkı veren kurum listeleri | **0** |

AB raporunda çıkan listede-olmayan adaylar yalnız **yabancı/uluslararası
organlar** (Avrupa Konseyi, Avrupa Komisyonu, Ortaklık Konseyi vb.) ve zaten
kayıtlı **TÜRKAK**'tı — Türk su idaresi kurumu değil. TÜBA raporunda çıkanlar
SYGM'nin **iç daire adları** parçalarıydı (aşağıda, BİLİNEN EKSİKLER).

**Kaçırılan Türk su kurumu: 0 (≤2) → şart (2) ✅.** Sahte 0 değil: iki gerçek
yeni kaynak tarandı, çıkanların hiçbiri tescil ölçütünü sağlayan yeni Türk kurumu
değildi.

---

## 4. "HANGİ KAPI" — İŞLEM KEŞFİ + EŞLEME

### 4a. İşlem keşfi (`su-islemleri.json`) — 20 işlem

41 su-özgü belgede işlem sözcükleri (izin, ruhsat, belge, başvuru, bildirim,
tahsis, onay, beyan, tescil, görüş) tarandı → **1001 ham aday**. Vatandaşın/
şirketin bizzat yaptığı işlemler süzüldü (kurumlar arası "uygun görüş"
hükümleri, denetim/ceza fıkraları ve ayrıştırma gürültüsü elendi) → **20 işlem**.
Liste elle yazılmadı; keşiften çıktı.

Örnekler: yeraltı suyu arama/kullanma/ıslah-tadil belgesi (167 s.K.), su tahsis
talebi (Su Tahsisleri Yön.), su ve kanalizasyon durum belgesi (2560), atıksu
bağlantı izni (SKKY md.44), su verimliliği belgesi (Su Verimliliği Yön. md.7-9),
jeotermal arama/işletme ruhsatı (5686), su ürünleri ruhsat tezkeresi (1380).

### 4b-c. Hangi-kapı eşlemesi (`hangi-kapi.json`) — 20 satır

Her işlem, mevzuatta yazan yetkili kuruma eşlendi. Hukuki yorum yapılmadı;
yalnız mevzuattaki yetki atfı aktarıldı. Başvuru kanalı yalnız mevzuatta ya da
kurumun resmî sayfasında açıkça yazıyorsa dolduruldu.

**Olgunluk özeti:**

| durum | satır | anlam |
|---|---|---|
| `dogrulandi` | **11** | yetkili kurum + başvuru kanalı mevzuattan teyitli |
| `birden_fazla_kurum` | 5 | yetki yerleşime göre değişiyor (İSKİ/belediye/büyükşehir) |
| `dayanak_eksik` | 3 | kurum belli, başvuru kanalı mevzuatta yazmıyor |
| `belirsiz` | 1 | kanalizasyona bağlantı — başvuru usulü ayrı düzenlenmemiş |

**[APILEX teyit] bekleyen: 9 satır** (doğrulanmayan başvuru kanalları). Bu
satırlar canlı kurum sayfası/APILEX teyidiyle tamamlanacak; tahmin yazılmadı.

---

## VERİ ÖZETİ

**155 kayıt** (137 → +18), **0 doğrulanmamış aday**.

| tür | TUR 1A-2 | TUR 1A-3 |
|---|---|---|
| kuruluş | 28 | 33 |
| kurul | 27 | 29 |
| GM | 21 | 25 |
| bakanlık | 22 | 24 |
| yerel | 19 | 21 |
| daire | 12 | 13 |
| birlik | 7 | 9 |
| merkez | 1 | 1 |

Su ilgisi: DOĞRUDAN 94 · DOLAYLI 61. Durum: aktif 136 · mülga 18 · ad değişikliği 1.

**Bu turda:** eklenen 18, güncellenen 64 (USP eylem alanları), mükerrer birleşme 0.
**Referans bütünlüğü (sonda kontrol):** kırık `ust_kurum_id` **0**, kırık `halef_id` **0**.

### Şema değişikliği (`_sema_surumu: 2`)

`su-birimleri.json`'a iki opsiyonel alan eklendi: `usp_sorumlu_eylemler[]`,
`usp_ilgili_eylemler[]`. Yalnız USP eylem tablolarında adı geçen 64 kayıtta
bulunur; eski kayıtlarda yokluğu hata değildir. Şema notu dosyanın başında
`_sema_notu` alanında.

### Terim havuzu

| tur | yeni | kümülatif | kaynak |
|---|---|---|---|
| 1 | 68 | 68 | Su Verimliliği Yön. + 4 kanun + site |
| 2 | 39 | 107 | Ç2b yönetmelikleri + CBK görev metinleri |
| 3 | 12 | 119 | TUR 1A-2 yönetmelikleri + Ulusal Su Planı kurum tablosu |
| 4 | 7 | 126 | Ulusal Su Planı eylem tabloları |

---

## BİLİNEN EKSİKLER (seri kapanış — TUR 1A-4 açılmaz)

Bu boşluklar bilinçli olarak açık bırakıldı; rehber sayfası bu şerhle yayınlanır.

1. **SYGM iç daire başkanlıkları** — TÜBA raporunda "Havza Yönetimi Daire
   Başkanlığı", "Su Politikası Daire Başkanlığı" geçiyor. SYGM'nin teşkilat
   yönetmeliği açılmadı; DSİ'nin 8 dairesi kayıtlıyken SYGM daireleri değil.
   Kaynak açılırsa TUR 1B'de eklenir (uydurma yasağı: mevzuat görülmeden yazılmadı).
2. **132 s. TSE Kuruluş Kanunu** — mevzuat.gov.tr'de 302; TSE kaydı DOLAYLI
   dayanağıyla ayakta ama kuruluş metni doğrulanmadı.
3. **Havza Yönetim Heyeti üye bileşimi** — üç turda da bulunamadı (Havza Yön.
   Planları Yön.'de tanım var, bileşim maddesi yok).
4. **İl Su Yönetimi Koordinasyon Kurulu, Su Yönetimi Koordinasyon Kurulu** —
   kuruluş genelgeleri (2012/7 vb.) erişilemedi.
5. **540 s. KHK (DPT)** — mevzuat.gov.tr'de 302.
6. **Hangi-kapı 9 satır [APILEX teyit] bekliyor** — başvuru kanalları mevzuatta
   açıkça yazmıyor; canlı kurum sayfası/APILEX teyidiyle tamamlanacak.
7. **Ç5 sayımları** (sulama birliği adedi, SKİ adedi, kurulu havza yönetim
   heyeti sayısı, üniversite su merkezi sayısı) — TUR 1A'dan beri "doğrulanmadı".
8. **Su-islemleri süzme eşiği** — 1001 ham adaydan 20 işlem süzüldü; süzme elle
   yapıldı, alt sınır (ör. il düzeyi rutin başvurular) dışarıda kaldı.

---

## SONUÇ

**Seri KAPANDI.** Üç şart (1, 2, 3) sağlandı; şart (4) serinin ölçeğinde yapısal
olarak sağlanamaz. Üç turda liste 99 → 137 → **155 kurum**; kaynak çeşitliliği
teşkilat mevzuatı + yönetmelikler + Ulusal Su Planı (kurum tablosu + eylem
tabloları) + bağımsız denetim (7 farklı kaynak) düzeyine ulaştı. Kalan boşluklar
BİLİNEN EKSİKLER'de. TUR 1A-4 önerilmez.

**TUR 1B'ye devreden hazır girdiler:** 64 kayıtta USP eylem bağı (kurum ×
faaliyet matrisi), 20 işlemlik hangi-kapı iskeleti (11'i doğrulandı, 9'u APILEX
teyit bekliyor).

---

## YÖNTEM NOTU — bu turda kullanılan araçlar

- `usp-eylem2.py` — `pdftotext -bbox-layout` koordinatlarıyla eylem tablosu
  ayrıştırıcı (sütun sınırları kelime-x histogramından kalibre).
- `usp-eslesme.py` — jeton → kayıt id eşleyici (kısaltma sözlüğü USP s.11-13).
- `islem-kesif.py` — işlem sözcüğü + ad tamlaması çıkarıcı (41 belge).
- `birlestir.py` — id'ye göre idempotent birleştirme (seriden devraldı).
