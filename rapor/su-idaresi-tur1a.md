# TÜRKİYE SU İDARESİ — TUR 1A: KURUM KEŞFİ VE LİSTE KAPANIŞI

**Tarih:** 2026-07-23 · **Kapsam:** keşif + veri üretimi; site/kod değişikliği YOK.
**Çıktı:** `data/kamu/su-birimleri.json` (99 kayıt + 2 doğrulanmamış aday),
`data/kamu/su-terim-havuzu.json` (107 terim), `data/kamu/ct3-kuyruk.json`.
**Bütçe:** ~77 istek (üst sınır 150).

---

## KAPANIŞ KARARI

> ## LİSTE KAPANMADI — TUR 1A-2 GEREKLİ
> Düşen şart: **(4) terim havuzu kapanmadı.** Diğer üç şart sağlandı.

| # | Şart | Ölçüt | Sonuç |
|---|---|---|---|
| 1 | Ç3'te tamamlanmış bir turda yeni kurum ≤2 | tur 3 → **0 yeni** | ✅ |
| 2 | Ç4, Ç1-Ç3'ün kaçırdığı ≤2 kurum bulmuş | **2 kurum** | ✅ |
| 3 | Ç1 ve Ç2 bütçe içinde tamamlanmış | Ç1 %100 / Ç2b 3-3 küme | ✅ |
| 4 | Terim havuzu kapanmış (son turda ≤2 yeni terim) | tur 2 → **+39 yeni** | ❌ |

**Şart (3) tanımı gereği doğrulama:** Ç1 = 1 sayılı CBK'daki **17/17** bakanlık
bölümü + 4 sayılı CBK'daki **57/57** bağlı/ilgili/ilişkili kuruluş bölümü işlendi
(%100). Ç2b = üç kümenin de sorgu turu koştu, küme başına seçilen sonuçlar açıldı.

---

## KAPANIŞ TABLOSU — Ç3 kar topu turları

| Ç3 turu | işlenen kurum | yeni kurum | harcanan istek | kümülatif kurum |
|---|---|---|---|---|
| 1 | 71 | 22 | 16 | 93 |
| 2 | 22 | 3 | 7 | 96 |
| 3 | 3 | 0 | 3 | 96 |

Kuyruk durumu (`ct3-kuyruk.json`): **59 işlendi / 15 beklemede / 71 toplam.**
Beklemede kalanlar rastgele değil, kuruluş mevzuatı bu turda AÇILMAYANLAR
(her biri gerekçesiyle dosyada): Bilimsel Değerlendirme Komisyonu, Mahalli Çevre
Kurulu, Havza Yönetim Heyeti, İl Su Yönetimi Koordinasyon Kurulu, Su Yönetimi
Koordinasyon Kurulu, İSKİ Teftiş ve Kontrol Kurulu, TOBB, Türkiye Belediyeler
Birliği, TÜBİTAK, TÜİK, Strateji ve Bütçe Başkanlığı, AFAD, SHOD, EPDK, Mahalli
İdare Birlikleri.

## TERİM HAVUZU BÜYÜMESİ

| tur | yeni terim | kümülatif | kaynak |
|---|---|---|---|
| 1 | 68 | 68 | Su Verimliliği Yön. tanımlar · 167/831/6200/5686 s.K. · site rehber+kütüphane içeriği |
| 2 | 39 | 107 | Ç2b'de açılan 13 yönetmeliğin tanımlar maddeleri + CBK görev metinleri (kar topu) |

Küme dağılımı: işlem 50 · kaynak 34 · koruma-risk 23. Tohum: yalnız "su".
**Havuz KAPANMADI** — tur 2'de 39 yeni terim eklendi (eşik ≤2).

### Ç1 sonrası havuza eklenen terimler (ek talimat 4)
Ç1 ve Ç2b, havuzun **68 terimlik tur-1 hâliyle** koştu. Aşağıdaki 39 terim
sonradan eklendi ve **Ç1'in bakanlık görev metinleri bu terimlerle YENİDEN
TARANMADI** (bütçe kararı; TUR 1A-2 kapsamına girer):

| kanal | eklenen terimler |
|---|---|
| Ç2b (yönetmelik tanımları) | genel sular · çevresel su ihtiyacı · kadim hak · emniyetli su · alıcı ortam · çatı suları · havza planı · hidromorfoloji · su kütlesi · kıyı suları · geçiş suları · yüzeysel su · akım gözlem istasyonu · su kaynakları izleme · içme suyu havza koruma planı · havza yönetim planı · taşkın risk haritası · taşkın yönetim planı · kuraklık yönetim planı · tarımsal kuraklık · su kayıpları · kentsel atıksu · rüsubat · su ürünleri yetiştiriciliği · su yapıları denetimi |
| Ç1 (CBK görev metinleri, geç çıkarıldı) | istihsal sahası · nehir havza yönetim planı · sınır aşan sular · sucul ekosistem · nitrata duyarlı hassas alan · su ile ilgili hassas alan · gölet · su kullanım hakkı anlaşması · orman içi su kaynağı · erozyon ve rüsubat kontrolü · amenajman planı · ulusal su planı · içme ve kullanma suyu güvenliği planı · su verimliliği il planı |

## KANAL ETKİNLİĞİ

| kanal | kurum kaydı | harcanan istek | not |
|---|---|---|---|
| Ç1 teşkilat omurgası | 49 | 2 | En verimli kanal — 2 PDF ile 17 bakanlık + 57 kuruluş |
| Ç2b mevzuat taraması | 22 | 29 | Kurul/heyet katmanını açan tek kanal |
| Ç3 kar topu | 25 | 26 | Yerel yapılar, kooperatif/birlikler, mülga kurumlar |
| Ç4 çapraz denetim | 2 | 6 | Etkinlik düşük = Ç1-Ç3 kapsayıcı çalışmış |
| Ç5 yerel/özel | 7 | 8 | Tür düzeyi + sayısal büyüklük |

### YALNIZ Ç4'TE ÇIKANLAR (Ç1-Ç3 kaçırdı)
1. **Yerel Yönetimler Genel Müdürlüğü** (ÇŞİDB) — 1 s. CBK md.99/1-a'da hizmet
   birimi olarak sayılı, ama görev metninde havuz terimi yok. Su ilgisi TÜİK Su ve
   Atıksu İstatistikleri metodolojisinden geldi: 2012'den beri köy su şebekesi ve
   arıtma tesisi verisi bu GM'den alınıyor.
2. **TBMM Meclis Araştırması Komisyonu** (küresel iklim değişikliği/kuraklık/su
   kaynaklarının verimli kullanımı; 25/2/2021 t. 1279 s. karar, rapor 1/2/2022).
   Geçici komisyon — `durum: mülga`.

---

## ÖN ADIM — ARAÇ TESPİTİ (kullanılan yol)

mevzuat.gov.tr araması **otomatikleştirilebilir çıktı** — rapor/su-kanunu-kaynak-kesif.md'nin
"POST/ASP.NET" tespiti doğru ama aşılabilir. Çalışan uç:

```
POST https://www.mevzuat.gov.tr/Anasayfa/MevzuatDatatable   (JSON, 200)
parameters: {AranacakIfade, AranacakYer(1 tümü/2 başlık/3 içerik),
             MevzuatTur, YonetmelikMevzuatTur, TamCumle}
```
CSRF gerekmedi; `Referer` + `X-Requested-With` yeterli. Tam metin:
`GET /mevzuatmetin/1.<tertip>.<no>.pdf` (kanun) ve
`GET /File/GeneratePdf?mevzuatNo=..&mevzuatTur=KurumVeKurulusYonetmeligi&mevzuatTertip=5`
(yönetmelik). Yedek yollara (Resmî Gazete fihristi, kategori gezinme, web araması)
**gerek kalmadı**.

**Sınırlılık:** `TamCumle=true` kelime sınırı vermiyor — "su" araması "usul",
"husus", "suç" içinde eşleşiyor. Bu yüzden tarama ayırt edici çok kelimeli
ifadelerle yapıldı ("yeraltı suları", "içme suyu", "su tahsis", "atıksu", "havza",
"taşkın", "su kirliliği", "kuraklık", "sulak alan", "su ürünleri", "sulama",
"su yapıları").

---

## Ç1 — TEŞKİLAT OMURGASI (2 istek)

1 sayılı CBK tam metni (13.305 satır) ve 4 sayılı CBK tam metni (15.049 satır)
indirildi, `pdftotext -layout` ile açıldı, **tamamı** 68 terimlik havuzla
kelime-sınırlı taramadan geçirildi. Bakanlık seçilmedi.

**17/17 bakanlık bölümü tarandı.** Su ilgisi kanıtlananlar (kayıt açılanlar):
Tarım ve Orman · Çevre, Şehircilik ve İklim Değişikliği · Dışişleri · Ulaştırma ve
Altyapı · Sağlık · Enerji ve Tabii Kaynaklar (DOĞRUDAN); İçişleri · Hazine ve
Maliye · Kültür ve Turizm · Millî Eğitim · Sanayi ve Teknoloji (DOLAYLI — 1 s. CBK
md.435/A Ulusal Su Kurulu üyeliği); Millî Savunma (DOLAYLI — bağlı kuruluşu SHOD).

**Kayıt AÇILMAYAN 5 bakanlık** (görev metninde havuz terimi yok + su mevzuatı
atfı yok): Adalet, Aile ve Sosyal Hizmetler, Çalışma ve Sosyal Güvenlik, Gençlik ve
Spor, Ticaret.

**57/57 kuruluş bölümü tarandı** (4 s. CBK). Kayıt açılanlar: DSİ, Orman GM,
Türkiye Su Enstitüsü, Doğa Koruma ve Milli Parklar GM, MAPEG, SHOD, AFAD.
Ayrıca DSİ'nin 8 su-özgü daire başkanlığı ve DKMP Sulak Alanlar Dairesi Başkanlığı
ayrı kayıt olarak açıldı.

**Ç1'in en yüksek getirisi:** 1 s. CBK md.435/A (Ek: 29/11/2023, 157 s. CBK) —
Ulusal Su Kurulu'nun kuruluşu ve üye kompozisyonu. Bu tek madde 11 bakanlığı,
Strateji ve Bütçe Başkanlığı'nı, TÜBİTAK'ı, TÜİK'i, TOBB'u ve Türkiye Belediyeler
Birliği'ni su idaresine bağlıyor; ayrıca "havza ve il su kurulları"nı adlandırıyor.

## Ç2 — TERİM KEŞFİ + MEVZUAT TARAMASI (33 istek)

**Ç2a (4 istek):** tohum "su". 167, 831, 6200, 5686 s. kanunların tam metinleri +
arşivdeki Su Verimliliği Yönetmeliği tanımları + site içeriği → 68 terim.

**Ç2b (29 istek):** üç kümeye 12 sorgu turu; küme başına en fazla 8 sonuç açıldı
(toplam 13 metin). Açılmayanlar: "su ürünleri" 15 sonuçtan 7'si (5'i üniversite
merkezi yönetmeliği — Ç5'e devredildi), "havza" 11 sonuçtan 7'si (5'i üniversite
merkezi, 3'ü Ereğli Kömür Havzası — konu dışı), "sulama" 4 sonuçtan 2'si,
"atıksu" 4 sonuçtan 2'si, "yeraltı suları" 2 sonuçtan 1'i, "içme suyu"
2 sonuçtan 1'i, "su yapıları" 2 sonuçtan 1'i. **Toplam açılmayan: 21.**

Açılan 13 metin: Su Tahsisleri Hk. Yön. · Yüzeysel Sular ve YAS İzleme Yön. ·
Sulak Alanların Korunması Yön. · Su Ürünleri Yön. · İçme Suyu Temin Edilen Suların
Kalitesi Yön. · Sulama Birliklerine Başkan Görevlendirme Yön. · Kentsel Atıksu
Arıtımı Yön. · Su Yapıları Denetim Hizmetleri Yön. · Havza Yönetim Planları Yön. ·
Taşkın Yönetim Planları Yön. · İçme-Kullanma Suyu Havzalarının Korunması Yön. ·
Su Kirliliği Kontrolü Yön. · Tarımsal Kuraklık Yönetimi Yön.

**Ç2b'nin özgün katkısı:** kurul/heyet katmanı — Su Yönetimi Koordinasyon Kurulu,
Havza Yönetimi Merkez Kurulu, Havza Yönetim Heyeti, İl Su Yönetimi Koordinasyon
Kurulu, Tarımsal Kuraklık Yönetimi Koordinasyon Kurulu + 3 alt organı. Bunların
hiçbiri CBK'da geçmiyor.

**Ç2c doygunluk:** havuz kapanmadı (tur 2 → +39 terim).

## Ç3 — KAR TOPU (26 istek)

Kuyruk `ct3-kuyruk.json`'da; öncelik (a) DOĞRUDAN+kuruluş/GM (19), (b) DOĞRUDAN
diğer (39), (c) DOLAYLI+kuruluş/GM (5), (d) DOLAYLI diğer (8).

CBK dayanaklı kurumların kuruluş metni yerelde hazırdı (0 ek istek). Ek olarak
açılanlar: 6172 (Sulama Birlikleri), 2560 (İSKİ), 1380 (Su Ürünleri), 1053
(İçme/Kullanma/Endüstri Suyu Temini), 4373 (Taşkın Sulara Karşı Korunma), 3083
(Sulama Alanlarında Arazi Düzenlenmesi), 2872 (Çevre), 5216 (Büyükşehir), 5393
(Belediye), 5302 (İl Özel İdaresi), 6446 (Elektrik Piyasası), 2873 (Milli
Parklar), 3213 (Maden), 2804 (MTA), 5355 (Mahalli İdare Birlikleri), 5403 (Toprak
Koruma), 1163 (Kooperatifler) + 3 yönetmelik.

Tur 3'te 1163 s. Kooperatifler Kanunu ve 5403 taranıp **su görevi olan yeni kurum
bulunamadı** (Türkiye Milli Kooperatifler Birliği vb. genel yapılar — su_ilgisi
ölçütünü sağlamadıkları için kayıt AÇILMADI). Doygunluk ölçüldü, bütçe kalmıştı.

## Ç4 — BAĞIMSIZ ÇAPRAZ DENETİM (6 istek)

| alt kanal | sonuç |
|---|---|
| Sayıştay denetim raporları | DSİ, SUEN, İSKİ, ASAT, SASKİ, Tarım ve Orman Bakanlığı — **hepsi zaten listede** (SKİ'ler tür düzeyinde) |
| Cumhurbaşkanlığı/SBB yatırım programı | DSİ (sulama, göletler), ÇŞİDB — **yeni yok** |
| TÜİK su istatistiği kaynakları | **Yerel Yönetimler GM — YENİ** |
| TBMM su gündemi | **Meclis Araştırması Komisyonu — YENİ** |

`sayistay.gov.tr/reports/type/2` 404, `data.tuik.gov.tr/Kategori/GetKategori` 302
döndü; bu iki uç doğrudan çekilemedi, alan-kısıtlı web araması kullanıldı.

## Ç5 — YEREL/ÖZEL YAPILAR (8 istek)

| tür | dayanak | sayısal büyüklük |
|---|---|---|
| Su ve kanalizasyon idareleri | 2560 s.K. + 5216 s.K. | azami 30 (büyükşehir sayısı) — **fiilî sayım doğrulanmadı** |
| Sulama birlikleri | 6172 s.K. md.1 | **adet doğrulanmadı** (DSİ faaliyet raporu açılmadı) |
| Sulama kooperatifleri | 23333 s. Yön. + 1163 s.K. | **2.468** (2025 başı, TRGM verisi; 380 YÜS + 1.396 YAS devralmış) — birincil PDF açılmadı |
| Havza yönetim heyetleri | Havza Yön. Planları Yön. md.4/1-p | beklenen **25** (her havza için biri; Türkiye 25 nehir havzası) — fiilî kurulu sayı doğrulanmadı |
| Üniversite su uygulama-araştırma merkezleri | 2547 s.K. (madde no doğrulanmadı) | **28** (24 "su" + 4 "havza"), mevzuat.gov.tr Üniversite Yönetmelikleri başlık taraması — **TABAN sayı** |
| İl özel idareleri / YİKOB | 5302 s.K.; 5686 s.K. md.3/1-4 | il sayısı kadar — sayım yapılmadı (brief: il il sayım yok) |

DSİ işletmesindeki sulama tesisi: 3.165 (2025 başı, brüt 4,9 milyon ha).

---

## VERİ ÖZETİ

**99 kayıt** (+2 doğrulanmamış aday). Tür: kurul 20 · bakanlık 19 · GM 15 ·
kuruluş 14 · yerel 13 · daire 10 · birlik 7 · merkez 1.
Su ilgisi: DOĞRUDAN 80 · DOLAYLI 19. Durum: aktif 87 · mülga 11 · ad değişikliği 1.

**Tekilleştirme:** ad normalizasyonu + eş-kayıt birleştirme çalıştı;
**mükerrer birleşme 0** (id şeması baştan tekil kuruldu). MTA bir kez güncellendi
(Ç1'de DOĞRUDAN yazılmıştı, Ç3'te 2804 s.K. görev metninde havuz terimi
olmadığı görülünce DOLAYLI'ya çekildi).

**Referans bütünlüğü:** işin sonunda kontrol edildi — **kırık `ust_kurum_id` 0**,
kırık `halef_id` 0.

**Tarihsel süreklilik (12 mülga/ad değişikliği kaydı korundu):**
Orman ve Su İşleri Bakanlığı → Tarım ve Orman · Çevre ve Şehircilik → ÇŞİDB ·
Çevre ve Orman → Orman ve Su İşleri · Tarım ve Köyişleri / Tarım Orman ve
Köyişleri / Gıda, Tarım ve Hayvancılık / Köy İşleri ve Kooperatifler → Tarım ve
Orman · Özel Çevre Koruma Kurumu Bşk. → Çevre Yönetimi GM · İstanbul Sular
İdaresi → İSKİ · Maden İşleri GM → MAPEG · DPT → Strateji ve Bütçe Başkanlığı.

**Tekrar koşulabilirlik:** `birlestir.py` id'ye göre birleştirir, dosyanın üstüne
yazmaz; doğrulanmış alan "dogrulanmadi" ile ezilmez. Bu turda: eklenen 101,
güncellenen 1.

---

## UYDURMA YASAĞI — DOĞRULANAMAYANLAR

### Kayıt ölçütünü sağlamayan adaylar (`dogrulanmamis_adaylar`, listeden AYRI)
1. **Meteoroloji Genel Müdürlüğü** — 4 s. CBK md.262 görev metninde havuz terimi
   GEÇMİYOR. mevzuat.gov.tr'de "meteoroloji" başlıklı 11 yönetmeliğin hiçbiri su
   görevi vermiyor (hepsi personel/disiplin/rasat). Açılan 13 su yönetmeliğinde ve
   17 kanunda MGM'ye atıf **bulunamadı**. Su ilgisi TUR 1A-2'de aranmalı.
2. **İklim Değişikliği Başkanlığı** — 4 s. CBK md.792/A-C görev metninde havuz
   terimi doğrudan geçmiyor; su-iklim atfı bulunamadı.

### Kayıtlı ama içinde "doğrulanmadı" işareti taşıyan kalemler (8)
| kayıt | doğrulanmayan |
|---|---|
| Denizcilik Genel Müdürlüğü | madde numarası (görev metni CBK1 satır 11529-11539'da var) |
| Havza Yönetim Heyeti | üye bileşimi düzenlemesi |
| Bilimsel Değerlendirme Komisyonu | bağlı olduğu bakanlık (`ust_kurum_dogrulanmadi` — Sağlık Bakanlığı varsayıldı) |
| İSKİ Teftiş ve Kontrol Kurulu | madde numarası |
| Toprak Koruma Kurulu | madde numarası |
| Mahalli İdare Birlikleri | 5355 s.K.'daki su görev maddesi |
| Sulama birlikleri / SKİ'ler | adet |
| Üniversite su merkezleri | 2547 s.K. madde numarası; sayı taban |

### Brief varsayımı düştü
Brief, Ç2a kaynağı olarak "arşivdeki **Su Kanunu Taslağı**"nı gösteriyor.
`data/arsiv/mevzuat/` içinde **Su Kanunu Taslağı YOK** — dizinde yalnız Su
Verimliliği Yönetmeliği (htm + ek PDF) ve Ulusal Su Planı 2026-2035 var. Terim
havuzu bu kaynak olmadan üretildi; eksik telafisi için 167/831/6200/5686 s.
kanunların tam metinleri eklendi. (Not: `rapor/su-kanunu-kaynak-kesif.md`,
yayındaki taslak PDF'in 2019 tarihli olduğunu ve Nisan 2026 metninin kamuya açık
URL'inin doğrulanamadığını zaten kaydetmişti.)

---

## TUR 1A-2 İÇİN YAPILACAKLAR

1. **Ç1'i yeniden tara** — 39 yeni terimle 17 bakanlık + 57 kuruluş görev metni
   (metinler yerelde, ek istek gerekmez). Bu, kapanış şartı (4)'ü kırdı.
2. **Terim havuzunu doygunluğa taşı** — tur 3 çalıştırılmadı.
3. **Ç3 kuyruğunda beklemede kalan 15 kurumun** kuruluş mevzuatını aç.
4. **MGM ve İklim Değişikliği Başkanlığı** için su atfı ara (Ulusal Su Planı
   2026-2035 arşivde var, açılmadı; taşkın erken uyarı mevzuatı).
5. **Ç2b'de açılmayan 21 sonucu** aç.
6. **Ç5 sayımlarını birincil kaynaktan** doğrula (DSİ faaliyet raporu, büyükşehir
   SKİ listesi, kurulu havza yönetim heyetleri).
7. **`site-saglik.mjs` kontrolü** (SIRADAKILER'e eklendi): `su-birimleri.json`
   geçerli JSON mü + kayıt sayısı son koşuya göre azalmadı mı (azalma = 🟡).
