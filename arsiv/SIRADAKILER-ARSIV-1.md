# SIRADAKILER ARŞİVİ — 1 (taşıma: 25.08.2026, kalanlar paketi)

Ana dosyadan taşınan, İÇİNDE AÇIK MADDE KALMAMIŞ kapanmış bloklar.
Hiçbir satır silinmedi; bloklar olduğu gibi taşındı.

REDUCED-MOTION KADRAJ ARIZASI — KAPANDI (28 Tem, md14 Faz 0 ölçümünün
bulduğu): hero yazımından kalan `.v2-videolar { display:none }` kuralı
hareket-azaltma kullanan ziyaretçiye kadrajı HİÇ göstermiyordu. Ölü kural
kaldırıldı; iki modda da kadraj 832×464 (ölçüldü). Ders: erişilebilirlik
kuralları yapı değişince gözden geçirilmezse sessizce zararlı hale gelir.


SAĞLIK md4/md12/md10 YANLIŞ ALARMLARI — KAPANDI (28 Tem 2026, canlıda
doğrulandı: 11 kontrol geçti): Su-potansiyeli merge'ü (5e08611) sabahtan beri
deploy olmamış TÜM günü canlıya taşıdı; ana sayfa v2 DOM'unda #world/.sw-*
yok (yeni: section.v2-hero > .v2-katman > #v2-videolar, 6 video, lazy).
izleme/medya-beklenen.json hâlâ '#world .sw-scene' bektiği için md4 6/6
"sahne DOM'da yok" veriyor. CANLI MEDYA SAĞLIKLI — ölçüldü: sahne1
readyState=4, currentTime=2.85, paused=false; mp4'ler 200; konsol 0.
REVİZYON YAPILDI (27 Tem akşam, kullanıcı onaylı; dal md4-2026-07-27,
MERGE EDİLDİ 28.07): md4 zaman-döngüsü ölçümüne çevrildi (aktif-sahne
poll + 206 Range normal + döngü-eksiği kontrolü); K2 kalemlerine
DOKUNULMADI. Kanıt: canlıya karşı koşu GENEL YESIL — 6/6 sahne (6 farklı
sahne adı, hepsi readyState 4 + currentTime>0), diğer 5 kontrol değişmedi;
falsifikasyon: yanlış seçici → kırmızı (ölçüldü). MERGE EDİLDİ ve CANLIDA DOĞRULANDI (28.07): md4 6/6 geçti.
AYNI DESEN İKİ YERDE DAHA ÇIKTI (gece paketi):
  · md12 etkileşim, silinmiş #sv-menu DOM'unu arıyordu → menü AYLARDIR
    hiç test edilmiyordu (24.07 arızasının senaryosu açıktaydı). Revizyon
    sonrası 4/4 geçiyor — menü canlıda çalışıyor.
  · md10 GRACE tazeliği yapısal olarak imkânsız bir şart koşuyordu
    (grace-turkiye.json ~aylık değişir, eşik 8 gün) → md10 tümden kaldırıldı;
    veri tazeliği bekçinin işi (pipeline kendini denetleyemez).
  · sonBasariliKosu artık "koşum tamamlandı" damgası — tek kırmızı bekçide
    ikinci yanlış alarm ("sağlık sistemi koşmuyor") doğurmuyor.
DERS: her DOM/yeniden-tasarım işi, ona bağlı izleme yapılandırmasını da
günceller; yoksa kontrol sessizce körelir ve kırmızısı "bilinen arıza"
sayılmaya başlar.


OPENALEX EKSİK 32 İL — KAPANDI (28 Tem 2026): il kapsamı 49/81 → 81/81,
künye 1226 → 1979, hata 0, DOI/açık-URL'siz kayıt 0 (baski_uygun tüm
1979 kayıtta işaretli). zenginlestirme-birlestir.py yeniden koşuldu.
KÖK NEDEN: OpenAlex kredi tabanlı kotaya geçmiş (x-ratelimit-limit 1000,
10 kredi/istek, retry-after 4174 sn). Sabit saniye merdiveni bu ~70 dk'lik
pencereyi ASLA aşamazdı; script artık Retry-After başlığını OKUYUP
sunucunun söylediği süreyi bekliyor (90 dk tavan). Pencere açılınca 32 il
tek koşuda indi.
[ESKİ TANIM] OpenAlex kalıcı 429 kotası nedeniyle 32 ilin künyeleri eksikti
(veri/potansiyel/akademik-kunye.json hatalar listesi). `python3
arac/akademik-kunye.py` artımlıdır — birkaç saat sonra tek koşu tamamlar;
sonra `arac/zenginlestirme-birlestir.py` yeniden koşulur. 4.B DergiPark→OpenAlex ikamesi ONAYLANDI (27 Tem 2026) — şart: basılacak
her künye DOI/açık-erişim URL'si taşır, taşımayan basılmaz (baski_uygun
etiketi veride).


İLÇE DİZİNİ ÇAPRAZ DOĞRULAMA — KAPANDI, 0 FARK (28 Tem 2026):
TÜİK engeli KALKMIŞ (biruni.tuik.gov.tr 200, favori_raporlar.xlsx 3,7 MB
indi; YÖK Tez de 200). Resmî "İLÇE NÜFUSU" listesi (31 Ara 2021 ADNKS)
OSM diziniyle karşılaştırıldı: adlı ilçe ortak 897 → il eşlemesi AYNI 897,
çatışan 0; merkez ilçesi olan il TÜİK 51 = OSM 51, fark 0.
kutle-il.json'da yeniden değerlendirilecek ilçe ÇIKMADI.
SINIR: TÜİK dosyası 2021 tarihli; 2021 sonrası yeni ilçe kurulmadığı ayrıca
doğrulanmadı. Hâlâ erişilemeyen: e-İçişleri (zaman aşımı). illeridaresi.gov.tr
ise ENGEL DEĞİL — sertifikası yahyali.gov.tr adına, barındırma arızası.
Kanıt: cikti/denetim/faz-k/ilce-capraz-dogrulama.json
[ESKİ TANIM] kütle→il eşlemesinde kullanılan ilçe→il dizini OSM
Overpass'tan (ODbL) üretildi (veri/potansiyel/ilce-il-dizini.json).
Kullanıcı TR-IP'den resmî listeyi (e-İçişleri MulkiIdariBolumleri / TÜİK
idari bölünüş) indirdiğinde OSM diziniyle ÇAPRAZ DOĞRULANACAK; fark çıkan
ilçeler kutle-il.json'da yeniden değerlendirilecek. Sunucudan resmî
kaynaklara erişim yok (6 kaynak denemesi: rapor/potansiyel-faz2.md).


KONTRAST ARIZASI — KAPANDI (27.07, kontrast-2026-07-27 canlıda,
512ada3): index.astro'nun is:global body{#061824} stili Vite ortak
chunk'ıyla 173 içerik sayfasına sızmıştı (menü birleştirme yan etkisi;
il/persona 1.16:1, rehber 2.84:1). T1: kurallar html.v2-sayfa kapsamına
alındı; 10 tip canlıda 5.16–12.33 AA. Ders: paylaşılan bileşen + sayfa
is:global birleşimi chunk sızıntısı yaratır — sayfa-küresel stiller kök
sınıfla kapsanır. site-saglik'e kontrast kontrolü eklenmesi DEĞERLENDİRİLMELİ
(md.9 a11y açığı maddesiyle birleşir).


BENİM REGRESYONUM KAPANDI (27 Tem, `d64d5de`): breadcrumb sayfası olmayan
ara halkayı link yapıyordu → /arac/ 404. 175 sayfa tarandı, kırık link 0.
Ders kuyruğa: örnek sayfa öz-denetimi TAM SİTE taramasının yerine geçmez.


SU İDARESİ KURUM LİSTESİ — TUR 1A SERİSİ KAPANDI (TUR 1A-3, 2026-07-23).
Güncel nihai durum: rapor/su-idaresi-tur1a3.md. Çıktı: su-birimleri.json
(**155 kayıt**, şema_sürümü 2, 64 kayıtta USP eylem bağı), su-terim-havuzu.json
(**126 terim**), ct3-kuyruk.json (**137 işlendi / 0 beklemede**), + YENİ:
su-islemleri.json (20 işlem), hangi-kapi.json (20 satır; 11 doğrulandı, 9 APILEX bekliyor).
Kapanış: 4 şarttan 3'ü (1,2,3) sağlandı; şart (4) yapısal olarak sağlanamaz
(terim havuzu her yeni birincil kaynakta büyüyor). TUR 1A-4 AÇILMAZ — kalan
boşluklar raporun "BİLİNEN EKSİKLER" başlığında (SYGM daireleri, 132 s.K.,
Havza Yönetim Heyeti bileşimi, Ç5 sayımları, 9 APILEX satırı).
TUR 1B'ye hazır girdi: kurum×faaliyet matrisi (USP eylem bağı) + hangi-kapı iskeleti.
site-saglik.mjs veri-bütünlüğü kontrolü: KAPANDI (2026-07-23) — /hangi-kurum/ işiyle
md11-veri-butunlugu eklendi (JSON geçerli mi🔴 + kayıt azaldı mı🟡 + şema tanınıyor mu🟡).
