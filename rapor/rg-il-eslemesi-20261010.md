# Resmî Gazete işletme sahası kayıtları — il eşlemesi ve durum sınıflaması (10.10.2026)

Dayanak: sahibin 8 kararı (4-A tam, 10.10.2026) ve DURAK 1 kararı B. Üretici: `arac/rg-ilan-indir.py` (indirme), `arac/rg-ilan-ayristir.py` (ayrıştırma). Çıktı: `veri/potansiyel/isletme-sahalari-v2.json`. Eski dosyalar (`isletme-sahalari.json`, `isletme-sahalari-ek.json`) silinmedi; ek dosya artık okunmuyor, ana dosya yalnız künye sayımı ve gazete sayısı zemin doğruluğu (rg-sayi.js) için okunuyor.

## Yöntem
- Kaynak: eski kayıtların gösterdiği 148 Resmî Gazete adresi (110 arşiv PDF, 38 ilan sayfası) 10.10.2026'da resmigazete.gov.tr'den tek tek indirildi (148/148, hata 0; `cikti/rg-ham/`, depoya girmez).
- Kayıt birimi: DSİ ilan bloğu (güncel ilan sayfası) ya da "yeraltı suyu işletme sahası/sahaları/alanı" geçişinin çevresi (arşiv PDF); pencere karar/ilan sınırlarından bölünür, fihrist (İÇİNDEKİLER) satırı, bilanço, nüfus/mahkeme/seçim ve İçişleri köy adı ilanları elenir.
- İl yalnız resmî metinden: (1) ilan başlığında ya da metinde idari bağlamda il adı ("Konya İli", "Niğde - Bor Ovası", "Ankara’ya bağlı"); (2) ilçe adı → TÜİK ilçe–il dizini (`veri/potansiyel/ilce-il-dizini.json`, TÜİK ADNKS 31.12.2021 ile çapraz doğrulanmış): yalnız "X İlçesi/Kazası" biçiminde ya da ova zincirinin ilk adı olarak ("Merzifon - Gümüşhacıköy Ovası"); zincirdeki ilçeler aynı ile düşüyorsa hepsi; (3) RG fihrist başlığı yalnız başlığın yer adı pencerede de geçiyorsa. Tahmin yok; her il için metin parçası `il_kanit` alanında saklı.
- Elenen yanlış eşleşme sınıfları (eski veride vardı): kişi adı ("Bakanı S. BİNGÖL"), DSİ bölge müdürlüğü adı ("Devlet Su İşleri Adana VI ncı Bölge … (Amik Ovası)"), harita künyesindeki "ANKARA", nehir/havza adı olan ilçe (Ergene, Menderes, Gediz, Meriç, Seyhan, Dicle, Kızılırmak, Halkapınar), köy/kasaba adı olan ilçe (Akyaka Köyü, "Ayvalık ve Altınova", "Bozova Bucağı"), komşu ilan (nüfus kütüğü, Seçim Kurulu, köy adı değişikliği).
- Durum: fiilî yasak/kapatma ifadesi kuyu/su bağlamında → "tahsise kapatma/kısıt". "Rezerve erişildiğinde … yasaklanmıştır" KOŞULLU kuraldır (rezerv dolunca uygulanır) → işletme ilanı sayılır, dayanakta "[koşullu: …]" yazar. "Erişildiğinden/ulaştığından … yapılmayacaktır" fiilîdir. "Belgesiz kuyular kapatılır" yaptırım kuralıdır, kapatma sayılmaz.
- Sayım birimi: aynı gazete sayısı + aynı durum = 1 tekil ilan; fihrist başlığı ile aynı sayıdaki ilan metni birleşir. İl sayfaları, kısıt sorgusu, istihbarat RSS, arşiv il dağılımı ve `/kisit.json` aynı gruplardan beslenir (`src/data/rg-kaynak.js` → `rgGruplari`).

## Sayımlar
- Ham kayıt: 109 fihrist başlığı + 180 ilan metni = 289 (eski: 109 + 310 = 419).
- Tekil ilan: 174; ili doğrulanan 171, il belirtilmemiş 3.
- İlan metni durumu: {'işletme sahası ilanı/değişikliği': 135, 'tahsise kapatma/kısıt': 45}. Koşullu kural olarak ayrılan: 8.
- İl kaynağı (ilan metni kayıtları): metinde il adı 109, ilçe → TÜİK dizini 36, doğrulanamadı 6.
- Fihrist başlıklarının ili eski atamadan farklı: 36 (aşağıda).

## İl belirtilmemiş kayıtlar (sahibe — DURAK 1 B)
Metinde il ya da ilçe adı yok; sınır kararnamenin/ilanın ekli haritasında. Sitede "Ergene havzası — il belirtilmemiş; sınır kararnamenin ekli haritasında" notu, RG künyesi ve bağlantısıyla gösterilir; il sayfalarına girmez.
- RG 08.05.1974 — Ergene Havzası Batı Kesiminin Yeraltı Suyu İşletme Sahası Olarak Kabulü Hakkında Kararname — Ergene havzası — il belirtilmemiş; sınır kararnamenin ekli haritasında — https://www.resmigazete.gov.tr/arsiv/14880.pdf
- RG 24.11.1979 — Ergene Havzası Yeraltı Suyu İşletme Sahası ile Yer Altı Suyu Emniyetli İşletme Değiştirilmesi Hakkında Karar — Ergene havzası — il belirtilmemiş; sınır kararnamenin ekli haritasında — https://www.resmigazete.gov.tr/arsiv/16819.pdf
- RG 16.07.2005 — ERGENE HAVZASI YERALTISUYU İŞLETME SAHASI İLANI — Ergene havzası — il belirtilmemiş; sınır kararnamenin ekli haritasında — https://www.resmigazete.gov.tr/ilanlar/eskiilanlar/2005/07/20050716-4.htm
- Önceki listede sorulan diğer 4 kayıt kaynak metinden doğrulandı: 04.09.1970 Çatalca-Yalıkavak → İstanbul ("Çatalca - Yalıkavak (Podima) … ovalarının"); 13.06.1971 Cide Ovası → Kastamonu ("Cide İlçesinin … doğusu"); 06.07.1972 Seydişehir - İçeri Kışlak Vadisi → Konya; 09.08.1966 kaydı gazetenin İÇİNDEKİLER satırıydı — aynı sayıdaki gerçek ilanlar ayrı eşlendi (İzmit-Sapanca-Gölcük → Kocaeli, Korkuteli/Bucak → Antalya/Burdur, Kütahya Ovası, Artova-Çamlıbel → Tokat).

## Fihrist başlıklarında değişen il atamaları
| RG tarihi | Başlık | Eski | Yeni | Dayanak |
|---|---|---|---|---|
| 16.04.1964 | Yeraltı Suyu İşletme Sahaları Hakkında Karar | belirsiz | Konya, Niğde, İzmir | aynı gazete sayısındaki ilan metni |
| 10.03.1966 | Yeraltı Suyu İşletme Sahaları Hakkında Karar | belirsiz | Samsun, Şanlıurfa | aynı gazete sayısındaki ilan metni |
| 22.03.1966 | Yeraltısuyu İşletme Sahası Hakkında Karar | belirsiz | Amasya | aynı gazete sayısındaki ilan metni |
| 24.03.1966 | Yeraltısuyu İşletme Sahası Hakkında Karar | belirsiz | İstanbul | aynı gazete sayısındaki ilan metni |
| 20.04.1966 | Yeraltısuyu İşletme Sahaları Hakkında Karar | belirsiz | Burdur, Denizli | aynı gazete sayısındaki ilan metni |
| 06.06.1966 | Devlet Su İşleri Adana VI nci Bölge Müdürlüğü Sınırları İçinde Bulunan | Adana | Hatay | aynı gazete sayısındaki ilan metni |
| 28.06.1966 | Berdan Ovası ve Mersin Limonlu-Lâmıs-Arası Sahil Ovaları,Dazkırı- Başm | Afyonkarahisar, Denizli, Mersin | Mersin | RG fihrist başlığında il adı |
| 09.08.1966 | Yeraltı Suyu İşletme Sahası Olarak Kabul Edilen Sahalar Hakkında Karar | belirsiz | Antalya, Burdur, Kocaeli, Kütahya, Tokat | aynı gazete sayısındaki ilan metni |
| 11.08.1966 | Ankara – Çubuk Ovası, Ankara Mürted Ovası, Çaldıran Ovası, Bayburt, Ha | Ankara, Bayburt, Van | Ankara, Bayburt | RG fihrist başlığında il adı |
| 23.05.1967 | Yeraltı Suyu İşletme Sahasına Dair Karar | belirsiz | Antalya, Hatay | aynı gazete sayısındaki ilan metni |
| 20.07.1967 | Yeraltısuyu İşletme Sahaları Hakkında Karar | belirsiz | Balıkesir, Manisa, İzmir | aynı gazete sayısındaki ilan metni |
| 17.11.1967 | Yeraltısuyu İşletme Sahası Olarak Kabul ve İlânı Hakkında Kararname | belirsiz | Denizli, İzmir | aynı gazete sayısındaki ilan metni |
| 30.01.1968 | Ordu ve Bulancak Sahil Ovaları Yeraltısuyu Sahalarının Yeraltısuyu İşl | Giresun, Ordu | Ordu | RG fihrist başlığında il adı |
| 13.02.1968 | Ayvacık, Gülpınar ve Geyikli Sahil Ovaları "Yeraltısuyu Sahalarının Ye | belirsiz | Bolu | aynı gazete sayısındaki ilan metni |
| 15.03.1968 | Aşağı Susurluk ve Karacabey Ovalarının Yeraltısuyu İşletme Sahası Olar | Balıkesir, Bursa | Bursa | RG fihrist başlığındaki ilçe adı → TÜİK ilçe-il dizini |
| 13.09.1968 | Bursa ve İzmirde Bazı Yerlerin Yeraltısuyu İşletme Sahası Olarak Kabul | Bursa | Bursa, İzmir | RG fihrist başlığında il adı |
| 26.09.1968 | Niğde ve Afyonda Bazı Yerlerin Yeraltısuyu İşletme Sahası Olarak Kabul | Niğde | Afyonkarahisar, Niğde | RG fihrist başlığında il adı |
| 11.11.1968 | Orta Gediz Havzasının (Manisa, Kemalpaşa, Saruhanlı, Turgutlu, Ahmetli | Manisa, İzmir | Manisa | RG fihrist başlığında il adı |
| 13.05.1969 | Yeraltısuyu İşletme Sahası Hakkında Karar | belirsiz | Kahramanmaraş | aynı gazete sayısındaki ilan metni |
| 09.04.1970 | Kadirli - Kozan ve Ceyhan Ovaları Yeraltısuyu İşletme Sahası Hakkında  | Adana, Osmaniye | Osmaniye | RG fihrist başlığındaki ilçe adı → TÜİK ilçe-il dizini |
| 26.06.1970 | Yeraltı Suyu İşletme Sahası Olarak Kabulü Hakkında Kararname | belirsiz | Erzurum | aynı gazete sayısındaki ilan metni |
| 04.09.1970 | Yeraltısuyu İşletme Sahası Hakkında Kararname | belirsiz | Muğla, İstanbul | aynı gazete sayısındaki ilan metni |
| 18.10.1970 | Yeraltısuyu İşletme Sahası Hakkında Kararname | belirsiz | Zonguldak | aynı gazete sayısındaki ilan metni |
| 20.10.1970 | Yeraltısuyu İşletme Sahası Olarak Kabul ve İlânı Hakkında Kararname | belirsiz | Zonguldak | aynı gazete sayısındaki ilan metni |
| 22.12.1970 | Aydıncık (Gilindire) Sahil Ovaları Yeraltısuyu İşletme Sahasına Dair K | belirsiz | Mersin | aynı gazete sayısındaki ilan metni |
| 12.04.1971 | Burhaniye - Armutova Gümeç ve Fethiye Ovası Yeraltısuyu İşletme Sahası | Balıkesir, Muğla | Balıkesir | RG fihrist başlığındaki ilçe adı → TÜİK ilçe-il dizini |
| 13.06.1971 | Yeraltısuyu İşletme Sahası Hakkında Kararname | belirsiz | Kastamonu | aynı gazete sayısındaki ilan metni |
| 28.07.1971 | Yeraltı Sahasının Yeraltısuyu İşletme Sahası Olarak Kabul ve İlânı Hak | belirsiz | Kocaeli, Kırklareli, Tekirdağ | aynı gazete sayısındaki ilan metni |
| 09.10.1972 | Yeraltısuyu İşletme Sahası Hakkında Kararname | belirsiz | Bursa, İstanbul | aynı gazete sayısındaki ilan metni |
| 11.01.1973 | Devlet Su İşleri Genel Müdürlüğü II. Bölge Müdürlüğü Hudutları İçinde  | belirsiz | İzmir | aynı gazete sayısındaki ilan metni |
| 08.05.1974 | Ergene Havzası Batı Kesiminin Yeraltı Suyu İşletme Sahası Olarak Kabul | Tekirdağ | — (il belirtilmemiş) | doğrulanamadı (başlıkta ve ilan metninde il/ilçe adı yok) |
| 19.02.1977 | Asi Havzası Yeraltı Suyu İşletme Sahasına Dair Karar | belirsiz | Gaziantep, Hatay | aynı gazete sayısındaki ilan metni |
| 18.03.1978 | Nevşehir – Güvercinlik ve Çardak Köyleri Çevresinin Yeraltı Suyu İşlet | Denizli, Nevşehir | Nevşehir | RG fihrist başlığında il adı |
| 24.11.1979 | Ergene Havzası Yeraltı Suyu İşletme Sahası ile Yer Altı Suyu Emniyetli | Tekirdağ | — (il belirtilmemiş) | doğrulanamadı (başlıkta ve ilan metninde il/ilçe adı yok) |
| 27.10.1980 | Yeraltısuyu İşletme Sahası Hakkında Karar | belirsiz | Manisa | aynı gazete sayısındaki ilan metni |
| 02.11.1980 | Yeraltısuyu İşletme Sahası Hakkında Karar | belirsiz | Manisa | aynı gazete sayısındaki ilan metni |

## Bilinen sınırlar
- Zincir içindeki ikinci/üçüncü ilçe adı başka ile düşüyorsa kullanılmaz (köy adı olabilir); bu yüzden bazı iller kaçabilir (ör. "Ordu ve Bulancak" → yalnız Ordu; "İzmit - Sapanca - Gölcük" → yalnız Kocaeli). Yanlış il yerine eksik il tercih edildi.
- 1960–1980 arşiv PDF'leri iki sütunlu OCR'dır; aynı sayıdaki birden çok kararname tek pencerede birleşebilir. Bu durumda il listesi o gazete sayısının bütün işletme sahası ilanlarını kapsar.
- İller bugünkü il sınırına göre yazılır (ör. 1973 "Karaman - Akçaşehir" → Karaman; o tarihte Konya'ya bağlıydı).
- Doğrulama kodla yapıldı; her eşleşme bağlamıyla 5 turda elle gözden geçirildi. Son döküm (her il için metin parçası): `cikti/rg-ham/il-denetim-son.txt` (depoya girmez; `python3 arac/rg-ilan-ayristir.py` ile yeniden üretilir). Hukuki nitelendirme değildir.
