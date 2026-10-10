# HUKUK SORULARI — avukatın kararına sunulan hukuki noktalar (10.10.2026)

Kural: burada yazan her hukuki cümle resmî metne dayanır ve kaynağı + erişim tarihiyle durur. Hafızadan tutar/süre yazılmadı; bulunamayan "doğrulanamadı" diye işaretlidir. Kararlar avukatındır; panel yalnız seçenek sunar.

Resmî metin kopyaları (erişim 10.10.2026, mevzuat.gov.tr PDF): 167 (Yeraltı Suları Hakkında Kanun), 5326 (Kabahatler), 2577 (İYUK), 2942 (Kamulaştırma), 5686 (Jeotermal). Resmî Gazete 27.11.2025 sayı 33090: VUK Genel Tebliği Sıra No 585.

## a) Ceza tutarı — "1.000–5.000 TL / 500–2.000 TL"
- **Geçtiği yerler:** /rehberler/ruhsatsiz-kuyu-cezalari/, /su-hukuku/ tablosu (2 satır), /kuyu-karar-motoru/ ve /hesaplayicilar/kuyu-cezasi-hesaplama/ (JS: `public/s/hesap-ceza.js`, `karar-motoru.js`), il sayfaları (81; "ceza desteği" bloğu), mevzuat 167 m.18 sayfası.
- **Kanun metni (167 m.18, Değişik 23/1/2008-5728/270):** (a) belge almadan 8. maddedeki işleri yapanlar ile kasten yanlış bilgi verenler **bin TL'den beşbin TL'ye kadar** idarî para cezası; ayrıca DSİ mahzur görürse kuyu kapatılır, masrafı açtırandan alınır. (b) 10 ve 11. maddelere aykırı hareket edenler, şartlara riayet etmeyenler, form bilgisi vermeyenler, 8. madde son fıkra mecburiyetine uymayanlar **beşyüz TL'den ikibin TL'ye kadar**; ayrıca kuyu kapatılır. Cezayı **mahallî mülkî amir** verir.
- **Yeniden değerleme:** 5326 sayılı Kabahatler Kanunu m.17/7: "İdarî para cezaları her takvim yılı başından geçerli olmak üzere o yıl için 4.1.1961 tarihli ve 213 sayılı VUK mükerrer 298. maddesi hükümleri uyarınca tespit ve ilân edilen yeniden değerleme oranında artırılarak uygulanır. Bu suretle idarî para cezasının hesabında bir Türk Lirasının küsuru dikkate alınmaz." → **Evet, tabidir** (nispi cezalar hariç).
- **2026 yılı oranı:** VUK Genel Tebliği (Sıra No: 585), RG 27.11.2025/33090: "yeniden değerleme oranı 2025 yılı için % 25,49 olarak tespit edilmiştir" (2026'da uygulanır).
- **2026'da uygulanan tutar:** 2008'den bu yana her yılın oranıyla birikimli artış gerekir; GİB'in yıl-yıl oran tablosu (gib.gov.tr) betikle okunamayan bir sayfa, 2009–2024 tebliğleri tek tek Resmî Gazete'den çekilmedi → **tutar DOĞRULANAMADI (hesaplanmadı)**. DSİ ya da kaymakamlıkların yıllık ceza tablosu yayımladığı resmî bir kaynak bulunamadı.
- **Seçenekler:** (1) Sitede yalnız kanun metnindeki tutar + "her yıl yeniden değerleme oranında artırılarak uygulanır (5326 m.17/7); 2026 oranı %25,49 (585 No'lu Tebliğ)" notu; "uygulanan tutar DSİ bölge müdürlüğünden teyit edilir" cümlesi. (2) Ben 2009–2025 tebliğlerini Resmî Gazete'den tek tek çekip birikimli tutarı hesaplarım, her yılın tebliğ künyesiyle sunarım; siz onaylarsanız iki sütunlu sayfa (4.2) bu hesapla yayına girer. (3) İkisi: önce (1) yayınlanır, (2) hazırlanınca eklenir. **Önerim: 3.**

## b) Süre ve merci
- **Sihirbaz/hesaplayıcı JS'inde hesaplanan süreler:** yalnız iki sabit: "15 gün (sulh ceza)" ve "60 gün (idare mahkemesi)" — tebliğ tarihine eklenerek son gün üretiliyor (`public/s/karar-motoru.js:67`, `hesap-ceza.js:34-40`). Dayanak sayfada yazmıyor.
  - 15 gün: 5326 m.27/1 — "İdarî para cezası … kararına karşı, kararın tebliği veya tefhimi tarihinden itibaren en geç onbeş gün içinde, sulh ceza mahkemesine başvurulabilir. Bu süre içinde başvurunun yapılmamış olması halinde idarî yaptırım kararı kesinleşir." (m.27/2: mücbir sebepte kalkmasından itibaren 7 gün.) Not: 2014'te sulh ceza mahkemeleri kaldırıldı; görev sulh ceza hâkimliğindedir — bu dönüşümün dayanağı (6545 sayılı Kanun) **doğrulanamadı**, avukat teyidi.
  - 60 gün: 2577 m.7/1 — "Dava açma süresi, özel kanunlarında ayrı süre gösterilmeyen hallerde Danıştayda ve idare mahkemelerinde altmış … gündür"; m.7/2-a: idari uyuşmazlıklarda yazılı bildirimin yapıldığı tarihi izleyen günden başlar. m.11: dava açılmadan önce üst makama (yoksa işlemi yapan makama) başvuru dava süresini durdurur.
  - **Açık soru (avukat):** 167 m.18 cezası için başvuru yolu sulh ceza (Kabahatler) mı, kapatma kararı için idari yargı mı? Sihirbaz ikisini aynı tebliğ tarihinden sayıyor; kapatma kararı ile para cezası ayrı işlemler olabilir. Seçenek: ekranda "para cezasına 15 gün — sulh ceza hâkimliği (5326 m.27); kuyu kapatma/belge iptali işlemine 60 gün — idare mahkemesi (2577 m.7)" ayrımı + "tebliğ tarihini izleyen günden" notu.
- **/su-hukuku/ tablosu:** 35 satırın 28'inde "Doğrulanmış süre yok" (brif doğru; liste aşağıda). Resmî metinden bulunabilenler:
  | Satır | Resmî metinden öneri | Kaynak |
  |---|---|---|
  | Kamulaştırma — usulüne uygun kamulaştırma | tebligattan itibaren **30 gün** içinde idari yargıda iptal / adli yargıda düzeltim davası | 2942 m.14 |
  | Kamulaştırma — kamulaştırmasız el atma | 2942 Geçici m.6 (uzlaşma/dava usulü) metni incelenmeli; süre bu turda çıkarılamadı | 2942 Geç. m.6 — **doğrulanamadı** |
  | Ecrimisil | 2886 m.75 (ecrimisil) ve itiraz: Hazine Taşınmazlarının İdaresi Hakkında Yönetmelik — **doğrulanamadı** (yönetmelik çekilmedi) | — |
  | Jeotermal — geçiş rejimi/yetki | genel kural 2577 m.7: 60 gün | 2577 m.7 |
  | Kaynak hakkı (asliye hukuk) | özel hak davası; TMK'da hak düşürücü süre yok (el atmanın önlenmesi) — **avukat teyidi** | — |
  | Kaynak suyu kiralama (idari işlem) satırları (3) | 2577 m.7: 60 gün; ihale işlemlerinde 2886 m.? — **doğrulanamadı** | 2577 m.7 |
  | Kuyu belgesi ret/iptal (4 satır) | başvuruya 1 ay içinde cevap (167 m.13); zımni ret/ret işlemine 60 gün (2577 m.7, m.10: 60 gün cevap verilmezse istek reddedilmiş sayılır) | 167 m.13; 2577 m.7, m.10 |
  | Kuyu ruhsatı — ıslah/tadil; kuyu taşıma (3 satır) | başvuruya 1 ay içinde cevap (167 m.13) | 167 m.13 |
  | Ruhsatsız kuyu cezaları (2 satır) | para cezasına 15 gün sulh ceza (5326 m.27); kapatma işlemine 60 gün (2577 m.7) | 5326 m.27; 2577 m.7 |
  | Cezaya/kapatmaya karşı yargı yolu | aynı | aynı |
  | Su tahsisi (4 satır) | Yönetmelikte başvuruya cevap süresi var mı — m.9–12 metni incelenecek; **bu turda doğrulanamadı** | — |
  | İşletme sahası ilanı (4 satır) | süre niteliğinde hüküm yok; "süre yok" doğru | — |
  Not: 2577 m.10 metni bu dosyada henüz alıntılanmadı; yayın öncesi birebir aktarılır.

## c) Su tahsisi öncelik sırası
- Rehber (`src/content/rehberler/su-tahsisi-oncelik-sirasi.md`): "Yönetmelik metinlerinde sayısal bağlayıcı bir sıra yoktur; sıralama Tüzük m.15'ten gelir" — **YANLIŞ**: Su Tahsisleri Hakkında Yönetmelik m.7/1 açık bir öncelik sırası koyar: a) içme ve kullanma suyu, b) çevresel su ihtiyacı, c) tarımsal sulama ve su ürünleri, ç) enerji üretimi ve sınai, d) ticari, turizm, rekreasyon, madencilik, taşıma, ulaşım ile sair (sitedeki madde sayfası resmî metni taşıyor).
- YAS Tüzüğü m.15 ise yeraltı suyunda "faydalı ihtiyaç" hesabı için 6'lı sıra verir: içme, temizlik, belediye hizmetleri, hayvan sulaması, zirai sulama, maden ve sanayi suyu, sportif ve benzeri tesisler.
- **Seçenek:** rehber iki sırayı ayrı başlıkta anlatır: "yüzey/tahsis genel kuralı: Yönetmelik m.7 (5'li)" ve "yeraltı suyu faydalı ihtiyaç: Tüzük m.15 (6'lı)"; "bağlayıcı sıra yoktur" cümlesi kaldırılır. Hukuki onaya tabi.

## d) Emsal kararlar (`data/kamu/emsal-kararlar.json`, 26 kayıt)
- Resmî sunucuda (karararama.danistay.gov.tr getDokuman) **11 künye doğrulandı** (esas ve karar numarası belge metninde): 8.D. 2025/5198-2025/10204; 2024/2630-2025/6289; 2024/532-2025/6286; 2024/2635-2025/6285; 2024/2079-2025/6287; 2024/4487-2025/6288; 13.D. 2025/44-2025/778; 2020/1104-2023/4576; 2021/2712-2023/4291; 2020/1499-2023/2585; (ve 2022/1487-2023/870 erişim hatası — yeniden denenecek).
- **8 kayıt** ikincil kaynak sayfasına bağlı (bağlantı genel bir sayfaya düşüyor, künye metinde yok): 8.D. 2018/6147-2024/72; 2023/663-2023/829; 2021/5225-2023/6171; 13.D. 2015/4133-2021/4015; 8.D. 2018/2016-2020/4396; 13.D. 2013/263-2018/2731; Yargıtay 14.HD 2013/5715-2013/7588; 7.HD 2011/3727-2012/3244 → resmî doğrulama **yapılamadı** (Danıştay arama arayüzü JS; Yargıtay sunucusu bu ağdan erişilemiyor).
- **7 kayıt** kaynaksız ("kunye"): Yargıtay 7.HD 2024/1239-2024/2246; 2023/5423-2024/4816; 2023/4572-2023/5915; Danıştay 13.D. 2020/1093-2023/2584; 8.D. 2022/3005-2022/3470; 10.D. 2017/40-2021/4632; 13.D. 2012/253-2018/3787 → **doğrulanamadı**.
- Brif bulguları: "2020/1093 E. 2023/2584 K." ile "2020/1104 E. 2023/4576 K." iki ayrı kayıt (doğru; ilkinde `not: Künye çelişkisi` var); "kaynaklı/künye" etiketlerinin tanımı sayfada yok (veride var); karar tarihi alanı veride yok (doğru); "Danıştay" öneki 11 kayıtta eksik ("8. Daire", "13. Daire") (doğru); 9 özet kesik/kısa (doğru); 167 m.18 için rehberlerde farklı emsal (ruhsatsiz-kuyu-cezalari: 8.D. 2022/3005 ve 2023/663; kuyu-ruhsati: Yargıtay 7.HD 2011/3727) (doğru); idari yaptırıma hukuk dairesi kararı (7.HD 2011/3727 "ruhsatsız kuyu cezaları" rehberinde) (doğru); işletme sahası rehberinin tek emsali 8.D. 2018/6147 (jeotermal/belge geçişi) — konuyla doğrudan ilgili değil (doğru).
- **Seçenekler:** (1) 4.4'te emsal sayfaları açılırken yalnız resmî sunucuda doğrulanan 11 (+1) karar dizine açık; kalan 15 "doğrulanamadı" sekmesinde, dizine kapalı; rehberlerden kaynaksız künye bağlantıları kaldırılır (metin kalır, "doğrulanamadı" etiketiyle). (2) Avukat künyeleri UYAP/arşivden kendisi teyit eder, teyit ettiklerini "hukuki onay" ile açarız. **Önerim: 1 + 2 birlikte.**

## e) Avukatın bakacağı ifadeler (geçtiği dosya / sayfa sayısı; değiştirme kararı avukatta)
| İfade | Kaynak dosya | Sayfa | Sade seçenek |
|---|---|---|---|
| "İlk görüşme ücretsizdir" | anasayfa/Iletisim.astro | 1 | kaldır ya da "ilk görüşmede ücret alınmaz" yerine koşulları sizin yazdığınız metin |
| "uzmanlık", "deneyim" | anasayfa/Hakkinda.astro (+3) | 4 / 3 | "uzmanlık" TBB reklam yasağı açısından hassas; "çalışma alanı" |
| "temsil" | 4 dosya | 21 | "vekillik" ya da bağlama göre "başvuru hazırlığı" |
| "tek çatı altında", "yanınızdayız" | anasayfa/Hizmetler.astro | 1 | sade: "aynı büroda" / kaldır |
| "Suyun hukukunu bilen bir avukatla çalışın" | anasayfa/Hakkinda.astro | 1 | "su hukuku alanında çalışan büro" |
| "güvencesiyle" | PaylasilanMenu.astro, AltBilgi.astro | 1107 | "Arslan Hukuk Bürosu" (güvence sözü kaldırılır) |
| "Acil hukuki destek" bloğu | CtaBlok.astro, AcilDestekBar.astro | 1109 | "Hukuki destek" / "İletişim"; 1.5 ile birlikte tek form |
| "{İl}'de kuyu ruhsatı / ceza desteği", "erken adım hak kaybını önler" | kuyu-ruhsati/[il].astro | 81 | "{İl} için kuyu ruhsatı rehberi"; süre cümlesi dayanaklı yazılır (b) |
| "erken adım sonucu değiştirir", "Süre kaybı hak kaybıdır" | CtaBlok.astro, kuyu-karar-motoru.astro | 10–11 | "Süreler kısadır: 15/60 gün (dayanak …)" |
| "uzman değerlendirmesi" | kuyu-karar-motoru, hesaplayicilar | 3 | "avukat değerlendirmesi" |
| "| DSİ" (başlık) | harita.astro, 2 rehber | 4 | DSİ kurum adının markayla yan yana geçmesi karışıklık yaratır; "DSİ verisiyle" |
| "independent" | en/index.astro | 4 | "law-firm run" / kaldır |
| /vaka/meysu/ gerçek şirket adı | src/content (vaka) | 1 | kamuya açık yargı kararı ise künyeyle; değilse anonimleştir |
| Sihirbazın "dilekçe taslağı" ve "iptal gerekçesi" üretmesi | HukukiIptalAnalizi.astro, idare-emsal-matrisi.json, kuyu-karar-motoru.astro | 2 | hukuki metin üreten araç → "AVUKAT ONAYI BEKLİYOR"; seçenek: taslak yerine "avukata iletilecek bilgi özeti" üretsin |

## f) Diğer
- **İstanbul / İSKİ:** il sayfası "Kuyu belgeleri için başvuru mercii: DSİ 14. Bölge Müdürlüğü (İstanbul). Su ve kanalizasyon idaresi: İSKİ" — İSKİ'nin yeraltı suyu kuyularındaki rolü (2560 sayılı Kanun kapsamında kuyu izni/denetimi) yazılmıyor; resmî metin bu turda çekilmedi → **doğrulanamadı**; seçenek: 3.6'da büyükşehir su idaresi rolü resmî metinle (2560 m.?) yazılır, onaya sunulur.
- **Lisans beyanı:** sitede "kaynak gösterilerek kullanım (CC BY 4.0 uyumlu)" cümlesi (1 yer, /acik-veri/ veya /basin/); veri setleri DSİ, SYGM, EPİAŞ ("kaynak gösterilmek suretiyle çoğaltılabilir" — EPİAŞ beyanı), Resmî Gazete, MTA, CHIRPS (CC BY 4.0), OSM (ODbL), Natural Earth (kamu malı), NASA (kamu malı) türevi. **CC BY 4.0 ancak kendi türetimlerimize uygulanabilir; OSM türevi ODbL (paylaşım aynı lisansla) gerektirir** — brif doğru. Düzeltilmiş beyan 2.11 tablosuyla hazırlanır (hukuki onay).
- **Form saklama ve KVKK metni:** gerçek durum — /danisma 180 gün, /api/talep 365 gün, /takip 730 gün, /api/alarm 730 gün, /olay 400 gün (sayaç, e-posta yok); gizlilik metni yalnız "~180 gün" diyor; ana sayfa "form bir sunucuya veri göndermez" (form yalnız mailto + olay sayacı: kısmen doğru); alarm ve parsel formları gizlilik metninde yok; sihirbaz talep düğmesinde KVKK onayı yok (doğrulandı). Düzeltilmiş beyan metni 1.5 tablosundan üretilir (hukuki onay).

## Kullanıcıdan istenen bilgiler (3.4, 3.5)
Baro ve sicil no · büro açık adresi · kısa özgeçmiş · yayınlar · dönüş süresi ve ücret metni · WhatsApp numarası · veri sorumlusu kimliği/adresi (gizlilik) · Zenodo için yazar adı ve ORCID.

## DURAK 1 sonrası — a) Ceza tutarı: sonuç (HUKUKİ ONAYA)

Kaynaklar (erişim 10.10.2026): 167 s. Kanun m.18 (değişik: 5728 s. Kanun m.270; 5728 RG 08.02.2008 sayı 26781, m.579 "yayımı tarihinde yürürlüğe girer"); 5326 s. Kanun m.17/7 (mevzuat.gov.tr metni); 2008–2025 VUK Genel Tebliğleri (her biri Resmî Gazete'den tek tek okundu).

5326 m.17/7 (birebir): "İdarî para cezaları her takvim yılı başından geçerli olmak üzere o yıl için 4.1.1961 tarihli ve 213 sayılı Vergi Usul Kanununun mükerrer 298 inci maddesi hükümleri uyarınca tespit ve ilân edilen yeniden değerleme oranında artırılarak uygulanır. Bu suretle idarî para cezasının hesabında bir Türk Lirasının küsuru dikkate alınmaz. Bu fıkra hükmü, nispi nitelikteki idarî para cezaları açısından uygulanmaz."

Yöntem (onayınıza sunulan okuma): Y yılı başında, Y−1 yılı için ilan edilen oran uygulanır; her yıl 1 TL küsuru atılır; başlangıç 2008 kanun tutarları. Eksik yıl yok (18/18).

| Uygulama yılı | Oran (yılı) | Tebliğ · RG | m.18/a (TL) | m.18/b (TL) |
|---|---|---|---|---|
| 2008 | kanun metni | 5728 · 08.02.2008/26781 | 1.000–5.000 | 500–2.000 |
| 2009 | %12 (2008) | Sıra No 387 · 20.11.2008/27060 | 1.120–5.600 | 560–2.240 |
| 2010 | %2.2 (2009) | Sıra No 392 · 14.11.2009/27406 | 1.144–5.723 | 572–2.289 |
| 2011 | %7.7 (2010) | Sıra No 401 · 12.11.2010/27757 | 1.232–6.163 | 616–2.465 |
| 2012 | %10.26 (2011) | Sıra No 410 · 17.11.2011/28115 | 1.358–6.795 | 679–2.717 |
| 2013 | %7.80 (2012) | Sıra No 419 · 10.11.2012/28463 | 1.463–7.325 | 731–2.928 |
| 2014 | %3.93 (2013) | Sıra No 430 · 19.11.2013/28826 | 1.520–7.612 | 759–3.043 |
| 2015 | %10.11 (2014) | Sıra No 441 · 15.11.2014/29176 | 1.673–8.381 | 835–3.350 |
| 2016 | %5.58 (2015) | Sıra No 457 · 10.11.2015/29528 | 1.766–8.848 | 881–3.536 |
| 2017 | %3.83 (2016) | Sıra No 474 · 11.11.2016/29885 | 1.833–9.186 | 914–3.671 |
| 2018 | %14.47 (2017) | Sıra No 484 · 11.11.2017/30237 | 2.098–10.515 | 1.046–4.202 |
| 2019 | %23.73 (2018) | Sıra No 503 · 30.11.2018/30611 | 2.595–13.010 | 1.294–5.199 |
| 2020 | %22.58 (2019) | Sıra No 512 · 23.12.2019/30987 | 3.180–15.947 | 1.586–6.372 |
| 2021 | %9.11 (2020) | Sıra No 521 · 28.11.2020/31318 | 3.469–17.399 | 1.730–6.952 |
| 2022 | %36.20 (2021) | Sıra No 533 · 27.11.2021/31672 | 4.724–23.697 | 2.356–9.468 |
| 2023 | %122.93 (2022) | Sıra No 542 · 24.11.2022/32023 | 10.531–52.827 | 5.252–21.107 |
| 2024 | %58.46 (2023) | Sıra No 554 · 25.11.2023/32380 | 16.687–83.709 | 8.322–33.446 |
| 2025 | %43.93 (2024) | Sıra No 574 · 27.11.2024/32735 | 24.017–120.482 | 11.977–48.138 |
| 2026 | %25.49 (2025) | Sıra No 585 · 27.11.2025/33090 | 30.138–151.192 | 15.029–60.408 |

Doğrulanamayan / onayınıza bırakılan: (1) "o yıl için ilan edilen oran" ifadesinin "bir önceki yıl için ilan edilen oran" diye uygulanması — yerleşik uygulama olduğu varsayıldı, resmî bir yorum metni aranmadı; (2) 5326'da yıla özgü istisna yok (metin tarandı); başka kanunlarda belirli bir yıl için idari para cezası artışını sınırlayan hüküm olup olmadığı taranmadı — doğrulanmadı; (3) 5728'in Şubat 2008 yürürlüğüne rağmen 2009 başında 2008 oranının tamamının uygulanması.

Yayın yüzeyleri (hepsi tek dosyadan: data/kamu/ceza-yeniden-degerleme.json → src/data/ceza-tutar.js; önizlemede "AVUKAT ONAYI BEKLİYOR"): /hesaplayicilar/kuyu-cezasi-hesaplama/ (sayfa + sonuç ekranı), /rehberler/ruhsatsiz-kuyu-cezalari/ (öz cevap, SSS, karar tablosu, yıl yıl tablo), /mevzuat/167/madde-18/ (yorum + tablo), /su-hukuku/ (karar matrisi), /kuyu-karar-motoru/ (sihirbaz sonucu), /rehberler/kuyu-tasima/, /veri/mevzuat.json (API yorum alanı). Bir yılın tebliği eksik olursa derleme durur (güncel tutar yayımlanmaz). Önceki taslaktaki "2026 yılı için %25,49" ifadesi yanlıştı (tebliğ bu oranı 2025 yılı için ilan eder) — düzeltildi.

## DURAK 1 sonrası — b) Süreler: 5326 m.27 bulgusu (HUKUKİ ONAYA)

5326 m.27/1 (birebir): "İdarî para cezası ve mülkiyetin kamuya geçirilmesine ilişkin idarî yaptırım kararına karşı, kararın tebliği veya tefhimi tarihinden itibaren en geç onbeş gün içinde, sulh ceza mahkemesine başvurulabilir. …"

5326 m.27/8 (birebir; Ek: 6/12/2006-5560/34 md.): "İdarî yaptırım kararının verildiği işlem kapsamında aynı kişi ile ilgili olarak idarî yargının görev alanına giren kararların da verilmiş olması halinde; idarî yaptırım kararına ilişkin hukuka aykırılık iddiaları bu işlemin iptali talebiyle birlikte idarî yargı merciinde görülür." (Kaynak: mevzuat.gov.tr 5326, erişim 10.10.2026.)

Sihirbaz için önerilen ayrı dal: "Aynı kararda idari para cezası ile kuyu kapatma/belge iptali birlikte mi verildi?" → Evet ise: para cezasına ilişkin iddialar da iptal davasıyla birlikte idare mahkemesinde (dava süresi: 2577 m.7 — 60 gün; süre hesabı kuralları resmî metinden ayrıca eklenecek). Hayır ise: para cezası → sulh ceza hakimliği 15 gün (5326 m.27/1); kapatma/iptal → idare mahkemesi 60 gün. Kuyu kapatmanın "idarî yargının görev alanına giren karar" sayılması avukat değerlendirmesine bırakıldı.


## DURAK 1 sonrası — b) Süre tablosu ve 28 hücre: sonuç (HUKUKİ ONAYA)

Tek kaynak: data/kamu/sure-tablosu.json (yollar, birebir madde metinleri, tatil ve ara verme kuralları) + src/data/sure-hesap.js (hesap). Kullanan: hesaplayıcı, sihirbaz (yeni dal: "kararda neler var?"), süre sayacı, süre rozeti, ön değerlendirme bağlantısı. Hepsi önizlemede "AVUKAT ONAYI BEKLİYOR".

Hesap kuralları ve dayanakları: 60 gün — 2577 m.7/1, m.7/2-a; tebliği izleyen gün başlar, tatil günleri dahil, son gün tatile rastlarsa izleyen çalışma gününe uzar, ara vermeye rastlarsa ara verme bitiminden 7 gün uzar (2577 m.8; ara verme 20 Temmuz–31 Ağustos, 2577 m.61/1 — tek idare mahkemeli yerlerde uygulanmaz, bu yüzden ayrı not). Tatil: Pazar ve 2429 m.2 sabit günleri (1 Ocak, 23 Nisan, 1 Mayıs, 19 Mayıs, 15 Temmuz, 30 Ağustos, 29 Ekim). Dini bayramlar hesaba katılmadı (tarihleri resmî kaynaktan bu turda çekilemedi; Diyanet sayfası sorgu formuyla çalışıyor) — not düşülüyor. Cumartesi ve arefe (2429: 13.00'ten itibaren) tatil sayılmadı — gösterilen tarih erken olabilir, geç olamaz. 15 gün — 5326 m.27/1; 5326'da süre hesabı kuralı yok ve CMK'ya genel atıf bulunamadı → tebliğ tarihine 15 gün eklenir, tatil uzaması uygulanmaz, "doğrulanamadı" notu gösterilir. Aynı işlemde para cezası + kapatma → 5326 m.27/8 (idari yargı, 60 gün).

Resmî dayanaklı süre hücresi olan satırlar (18; bunların 15'i bu turda dolduruldu, 3'ü önceden doluydu):
- [baraj-kamulastirmasi] Usulüne uygun kamulaştırma → Tebligat ya da gazete ilanından itibaren 30 gün: idari yargıda iptal, adli yargıda düzeltim (2942 m.14)
- [baraj-kamulastirmasi] İmar kısıtlılığı → İmar planı yürürlüğünden itibaren beş yıl (2942 Ek m.1)
- [jeotermal-ruhsat] Geçiş rejimi ve yetki uyuşmazlığı → Yazılı bildirimi izleyen günden itibaren 60 gün, idare mahkemesi (2577 m.7; süre hesabı m.8)
- [kaynak-suyu-kiralama] İhalesiz kiralama → Yazılı bildirimi izleyen günden itibaren 60 gün, idare mahkemesi (2577 m.7; süre hesabı m.8)
- [kaynak-suyu-kiralama] Özel mülkiyetteki kaynağın kiralanabilirliği → Yazılı bildirimi izleyen günden itibaren 60 gün, idare mahkemesi (2577 m.7; süre hesabı m.8)
- [kuyu-belgesi-iptal-davalari] Belge başvurusunun reddi → Başvuruya bir ay içinde cevap zorunlu (167 m.13)
- [kuyu-belgesi-iptal-davalari] Mevcut belgenin iptali / rejim geçişi → Yazılı bildirimi izleyen günden itibaren 60 gün, idare mahkemesi (2577 m.7; süre hesabı m.8)
- [kuyu-belgesi-iptal-davalari] Yetkisiz idarece tesis edilen işlem → Yazılı bildirimi izleyen günden itibaren 60 gün, idare mahkemesi (2577 m.7; süre hesabı m.8)
- [kuyu-belgesi-iptal-davalari] Sondajın çevredeki kaynaklara etkisi → Yazılı bildirimi izleyen günden itibaren 60 gün, idare mahkemesi (2577 m.7; süre hesabı m.8)
- [kuyu-ruhsati] Bulunan suyu kullanma → Arama belgesine dayanarak bir ay içinde müracaat (167 m.10)
- [kuyu-ruhsati] Mevcut kuyuda teknik müdahale (ıslah-tadil) → Başvuruya bir ay içinde cevap (167 m.13); ret işlemine karşı 60 gün, idare mahkemesi (2577 m.7)
- [kuyu-tasima] Kuruyan/çöken kuyu (onarılabilir) → Başvuruya bir ay içinde cevap (167 m.13); ret işlemine karşı 60 gün, idare mahkemesi (2577 m.7)
- [kuyu-tasima] Kuyu taşıma (yeni noktada sondaj) → Başvuruya bir ay içinde cevap (167 m.13); ret işlemine karşı 60 gün, idare mahkemesi (2577 m.7)
- [ruhsatsiz-kuyu-cezalari] Belgesiz kuyu açma veya kasten yanlış bilgi verme → Para cezasına tebliğden itibaren 15 gün, sulh ceza (5326 m.27/1); kapatma aynı işlemdeyse idari yargı, 60 gün (5326 m.27/8)
- [ruhsatsiz-kuyu-cezalari] Belge şartlarına aykırı su kullanma (m.10-11 ihlali) → Para cezasına tebliğden itibaren 15 gün, sulh ceza (5326 m.27/1); kapatma aynı işlemdeyse idari yargı, 60 gün (5326 m.27/8)
- [ruhsatsiz-kuyu-cezalari] Kesilen cezaya veya kapatma kararına karşı yargı yolu → Ceza: 15 gün sulh ceza (5326 m.27/1); kapatma: 60 gün idare mahkemesi (2577 m.7); aynı işlemdeyse ikisi idari yargıda (5326 m.27/8)
- [su-tahsisi-oncelik-sirasi] Su tahsisi talebi → 30 gün içinde cevap verilmezse istek reddedilmiş sayılır; 60 gün içinde idare mahkemesi (2577 m.10/2, m.7)
- [yeralti-suyu-isletme-sahasi] Mevcut belge sahibinin kazanılmış hakkı → Yazılı bildirimi izleyen günden itibaren 60 gün, idare mahkemesi (2577 m.7; süre hesabı m.8)

Doğrulanamadı kalan hücreler (13; arama sürüyor):
- [baraj-kamulastirmasi] Kamulaştırmasız el atma (taşınmaz su altında)
- [baraj-kamulastirmasi] Ecrimisil (fiilî kullanım bedeli)
- [kaynak-hakki-komsu-su] Araziden çıkan kaynağa el atma
- [kaynak-hakki-komsu-su] Başkasının arazisindeki kaynak hakkı
- [kaynak-hakki-komsu-su] Suyu yetmeyen komşunun yararlanması
- [kaynak-suyu-kiralama] Kaynağı kiraya verme (yetki sorunu)
- [kuyu-tasima] Kirlenen kuyu
- [su-tahsisi-oncelik-sirasi] Talebin değerlendirilmesi
- [su-tahsisi-oncelik-sirasi] Kullanım öncelik sırası
- [su-tahsisi-oncelik-sirasi] Yürürlükten önceki eski tahsisler
- [yeralti-suyu-isletme-sahasi] İşletme sahası ilanı
- [yeralti-suyu-isletme-sahasi] Belgeli kuyu derinliği sınırı
- [yeralti-suyu-isletme-sahasi] Sürekli denetim ve uygunsuzluk tespiti

Ayrıca düzeltilen hata: süre sayacı "İdari para cezası" türünde de 60 gün (idare mahkemesi) hesaplıyordu; artık sulh ceza, 15 gün. Sayacın "süre geçtiyse 2577 m.11 uyarınca üst makama başvuru" önerisi kaldırıldı (m.11 başvurusu ancak "idari dava açma süresi içinde" yapılabilir — 2577 m.11/1 metni); yerine nötr cümle (onaya).


## DURAK 1 sonrası — d) Emsal: sonuç

Yöntem (10.10.2026): Danıştay karar arama sunucusunda (karararama.danistay.gov.tr) esas ve karar numarasıyla detaylı arama + karar metninde esas/karar numarası, daire ve karar tarihi kontrolü.

- Önceki 11 künye yeniden doğrulandı (önceki turda erişim hatası veren 13. Daire 2022/1487 E., 2023/870 K. dahil).
- **Yeni doğrulanan 9 künye** (ikincil kaynağa bağlı ya da kaynaksız iken resmî metinde bulundu; ikincil bağlantılar kaynak_onceki alanında saklandı) — sahip kararı gereği dizine alındı ("yalnız resmî sunucuda doğrulanan" ölçütü):
  - Danıştay 8. Daire 2018/6147 E., 2024/72 K. — karar tarihi 17.01.2024 — https://karararama.danistay.gov.tr/getDokuman?id=1053502600&arananKelime=2018/61476147%2C2024/7272
  - Danıştay 8. Daire 2023/663 E., 2023/829 K. — karar tarihi 24.02.2023 — https://karararama.danistay.gov.tr/getDokuman?id=986587100&arananKelime=2023/663663%2C2023/829829
  - Danıştay 8. Daire 2021/5225 E., 2023/6171 K. — karar tarihi 23.11.2023 — https://karararama.danistay.gov.tr/getDokuman?id=1047987800&arananKelime=2021/52255225%2C2023/61716171
  - Danıştay 13. Daire 2020/1093 E., 2023/2584 K. — karar tarihi 24.05.2023 — https://karararama.danistay.gov.tr/getDokuman?id=1012015000&arananKelime=2020/10931093%2C2023/25842584
  - Danıştay 10. Daire 2017/40 E., 2021/4632 K. — karar tarihi 07.10.2021 — https://karararama.danistay.gov.tr/getDokuman?id=721349200&arananKelime=2017/4040%2C2021/46324632
  - Danıştay 13. Daire 2015/4133 E., 2021/4015 K. — karar tarihi 25.11.2021 — https://karararama.danistay.gov.tr/getDokuman?id=735283600&arananKelime=2015/41334133%2C2021/40154015
  - Danıştay 8. Daire 2018/2016 E., 2020/4396 K. — karar tarihi 14.10.2020 — https://karararama.danistay.gov.tr/getDokuman?id=677647400&arananKelime=2018/20162016%2C2020/43964396
  - Danıştay 13. Daire 2013/263 E., 2018/2731 K. — karar tarihi 08.10.2018 — https://karararama.danistay.gov.tr/getDokuman?id=585424600&arananKelime=2013/263263%2C2018/27312731
  - Danıştay 13. Daire 2012/253 E., 2018/3787 K. — karar tarihi 07.12.2018 — https://karararama.danistay.gov.tr/getDokuman?id=585634000&arananKelime=2012/253253%2C2018/37873787
- **Künye çelişkisi (1):** "Danıştay 8. Daire 2022/3005 E., 2022/3470 K." numaraları resmî sunucuda İdare Dava Daireleri Kurulu kararına (01.12.2022) çıkıyor. Rehberlerde "künye çelişkisi, doğrulanamadı" diye işaretlendi. Karar: daire "İdare Dava Daireleri Kurulu" diye düzeltilip içeriğin rehberdeki iddiayı (arama belgesi rejimi) karşılayıp karşılamadığı sizin değerlendirmenizle mi dizine alınsın, yoksa doğrulanamadı olarak mı kalsın?
- **Doğrulanamadı (5, tümü Yargıtay):** 7.HD 2024/1239–2024/2246; 7.HD 2023/5423–2024/4816; 7.HD 2023/4572–2023/5915; 14.HD 2013/5715–2013/7588; 7.HD 2011/3727–2012/3244. Yargıtay karar arama sunucusuna (karararama.yargitay.gov.tr) bu sunucudan bağlanılamıyor (zaman aşımı); başka bir ağdan denenmesi gerekir. Rehberlerdeki 11 atıf "(resmî kaynaktan doğrulanamadı)" diye işaretlendi; ayrı ve dizine kapalı sayfada: /emsal-kararlar/dogrulanamadi/.
- Özetler: doğrulanan künyelerin özet (ozet) alanlarının bir kısmı ikincil kaynaktan gelmiştir; özetin karar metnine uygunluğu ayrıca kontrol edilmedi (4.4 karar sayfalarında resmî metinden alıntı kullanılacak).


## 4.4 sonrası — Rehberdeki karar özetleri ile resmî karar metni (10.10.2026)

Karar sayfaları (/emsal-kararlar/<künye>/) özet yazmaz; "uyuşmazlık · gerekçe · sonuç" resmî metinden birebir alıntıdır (data/kamu/emsal-alinti.json; birebirlik testle sınandı: 20/20). Alıntılar okunurken rehberlerdeki özetlerin bir kısmının karar metniyle uyuşmadığı görüldü. Aynı rehber ifadeleri **canlı sitede de yayında** (main). Hukuki metin olduğu için hiçbirine dokunulmadı; dalda yalnız işaret kondu. Karar sizde:

| Künye | Rehberdeki ifade (özet) | Resmî metindeki sonuç (birebir) | Gözlem |
|---|---|---|---|
| Danıştay 8. D. 2018/6147 E., 2024/72 K. | "mevcut belgeye sahip kuyular yönünden ret hukuka aykırı, belgesiz kuyu yönünden ret hukuka uygundur"; "167 belgesi 5686'ya otomatik intibak ettirilemez" (yeraltı-suyu-işletme-sahası gövde + liste; kuyu-belgesi-iptal-davaları; jeotermal-ruhsat) | "…davanın reddine karar verilmesi gerekirken dava konusu işlemin, yeraltı suyu kullanma belgesine sahip iki adet kuyu yönünden iptaline ilişkin Mahkeme kararına yönelik istinaf isteminin reddinde hukuki isabet bulunmamaktadır." · "…kararının BOZULMASINA" | Rehberdeki görüş ilk derece mahkemesinindir; Danıştay onu bozmuştur. **Çelişki.** |
| Danıştay 8. D. 2023/663 E., 2023/829 K. | "izin aşımı tespiti DSİ'nindir; yerel idare tarife/abonelik konusu yapamaz" (ruhsatsız-kuyu-cezaları; kuyu-belgesi-iptal-davaları) | "TEMYİZ İSTEMİNİN SÜRE AŞIMI NEDENİYLE REDDİNE" | Danıştay esasa girmemiştir; aktarılan gerekçe ilk derece mahkemesinin kararındadır (Danıştay metninde özet olarak). **Atıf yanlış mercie.** |
| Danıştay 8. D. 2021/5225 E., 2023/6171 K. | "yetkisiz idarenin 167 mantığıyla idari para cezası tesis etmesi yetki yönünden sakattır" (kuyu-belgesi-iptal-davaları; jeotermal-ruhsat) | "…suyun niteliği belirlendikten sonra Mahkemece idari para cezası verilmesine ilişkin işlemin yetkili makam tarafından verilip verilmediği hususu da dikkate alarak yeniden karar vermesi gerektiği açıktır." · "BOZULMASINA" | Yetki yönünden sakatlık hükmü bu kararda değil, aynı uyuşmazlığın sonraki kararı 8. D. 2025/5198 E., 2025/10204 K.'dadır (doğrulandı). **Atıf yanlış karara.** |
| Danıştay 10. D. 2017/40 E., 2021/4632 K. | "teknik değerlendirme yapılmalıdır; yalnızca soyut gerekçeyle işlem tesis edilemez" | "…keşif ve bilirkişi incelemesi yaptırılmak suretiyle … etkisi araştırılarak karar verilmesi gerekmekte olup…" · iptal kararının "BOZULMASINA" | İlk yarı metinle uyumlu; "soyut gerekçeyle işlem tesis edilemez" kısmı metinde bulunmadı. Bozulan karar idarenin işlemini iptal eden karardır. |
| Danıştay 13. D. 2015/4133 E., 2021/4015 K. | "167, kaynak suyu kiralamasını 2886'ya bağlar; idare yasal dayanak olmaksızın düzenleme yapamaz" | 2886 m.51/g pazarlık usulü koşulları; ilk derece iptal kararı "yukarıda belirtilen GEREKÇEYLE" onanmış | İkinci yarı ("yasal dayanak olmaksızın düzenleme") bu kararda bulunmadı; o ifade 8. D. 2018/2016 E. kararındaki gerekçeye benziyor. |
| Danıştay 13. D. 2013/263 E., 2018/2731 K. | "2886'ya uygun ihale yapılmadan, yalnızca ölçüm ve kullanım bedeli tespitiyle kiralama hukuka aykırıdır" | "…2886 sayılı Kanun uyarınca herhangi bir ihale yapılmaksızın müdahile kiralanmasına ilişkin dava konusu işlemde hukuka uygunluk bulunmamaktadır." | Çekirdek uyumlu; "ölçüm ve kullanım bedeli tespitiyle" kısmı alıntılanan bölümde yok. |
| Danıştay 13. D. 2022/1487 E., 2023/870 K. | su-tahsisi-öncelik-sırası rehberine bağlı (rehberler alanı) | Dava, "Batı Akdeniz Havzası Su Tahsis Planı Hazırlanması Projesi Danışmanlık Hizmet Alım İşi" ihalesine ilişkin (şehir plancısı şartı) | Tahsis sırasıyla doğrudan ilgisi zayıf; bağın kalıp kalmayacağı sizde. |
| 8. D. 2024/2630, 2024/532, 2024/2635, 2024/2079, 2024/4487 (5 karar) | yeraltı-suyu-işletme-sahası ve kuyu-ruhsatı rehberlerine bağlı | İSKİ ihtarnamesinin "ön bildirim" niteliğinde olduğu, kesin ve yürütülebilir işlem olmadığı gerekçesiyle incelenmeksizin ret onanmış | Konu etiketi "Yeraltı suyu"; içerik usul (dava edilebilir işlem) kararı. Bilgi için. |
| 13. D. 2025/44 E., 2025/778 K. | kaynak-suyu-kiralama, kaynak-hakkı rehberlerine bağlı | Kaynak suyu kiralama ihalesine karşı dava, 2577 m.20/A 30 günlük süre aşımı nedeniyle reddedilmiş; onanmış | Bilgi için (süre konusu). |
| 8. D. 2018/2016, 13. D. 2012/253, 13. D. 2020/1093 · 2020/1104 · 2020/1499 · 2021/2712, 8. D. 2025/5198 | — | — | Rehber özetleri alıntılanan bölümlerle uyumlu görünüyor; yine de onayınıza tabi. 2020/1093 ile 2020/1104 iki ayrı karar (ikisi de doğrulandı); rehberdeki "çelişki doğrulanacaktır" notu buna göre güncellendi. |

Dalda yapılan: 9 yeni doğrulanan kararın rehberlerdeki "(ikincil kaynak; resmî doğrulama bekliyor)" işareti, karar sayfasına bağlantılı "künye resmî kaynakta doğrulandı; özetin karar metnine uygunluğu avukat onayında" işaretiyle değişti. İlk üç satırdaki kararlar için işaret "bu özet karar metniyle çelişiyor, avukat incelemesinde" biçiminde. Ayrıca kuyu-belgesi-iptal-davaları rehberindeki tablo satırları (2018/6147 → "sebep unsuru", "geçiş rejimi/kazanılmış hak"; 2021/5225 → "yetki"; 2023/663 → "tarife/abonelik/DSİ yetkisi") ve kuyu karar motorundaki iptal analizi bağı (USUL-1 → 2021/5225) da aynı değerlendirmeye bağlıdır.

Kişisel veri notu: Bir resmî karar metninde (8. D. 2018/6147) anonimleştirilmemiş gerçek kişi ve şirket adı bulunuyor. Ham metinler bu yüzden depoya konmadı (cikti/emsal-resmi/, git dışı); sayfalara giren alıntılarda kişi adı yok (taranarak kontrol edildi).

## A-b ek — Sihirbazdaki dilekçe denetimi (10.10.2026)

Tebliğ Aldım sihirbazının altındaki "Dilekçe taslağı ve canlı denetim" bileşeni süreyi kendi başına hesaplıyordu: her dosyayı 60 gün sayıyor, para cezası yolunu (5326 m.27/1, 15 gün) ve tatil uzamasını (2577 m.8) bilmiyor, süre geçtikten sonra "İYUK m. 11 uyarınca üst makama başvuru veya olağanüstü kanun yolları değerlendirilmelidir" diyordu. 2577 m.11/1 başvuruyu "idari dava açma süresi içinde" arar; süre sayacındaki aynı hata önceki turda düzeltilmişti. Dalda: bileşen artık sihirbazın tek süre modülünün hesapladığı son günleri kullanıyor; son 15 günde ve süre geçince yalnız yol adı + son gün + kalan gün yazıyor; m.11 ve "olağanüstü kanun yolları" cümlesi kaldırıldı (tarayıcıda 5 senaryo sınandı). Onayınıza:
- Aynı bileşendeki "hasım tüzel kişiliği haiz 'DSİ Genel Müdürlüğü' olarak gösterilmelidir" uyarısı ve dilekçe ön taslağındaki hazır cümleler ("İşlemin sebep unsuru somut ve teknik dayanaktan yoksundur; mevcut belge/statü dikkate alınmamıştır.") resmî bir metne bağlı değil; değiştirilmedi.
- Süre rozetindeki "Olağanüstü yollar değerlendirilmelidir." cümlesi e) listesinde; değiştirilmedi.

## e) Avukat ifadeleri — durak listesi (sayım: 10.10.2026 dal derlemesi, 1.203 sayfa, görünür metin; mevzuat metinleri hariç). Hiçbiri değiştirilmedi.

| # | İfade (nerede) | Sayfa | Seçenek 1 | Seçenek 2 |
|---|---|---|---|---|
| 1 | "İlk görüşme ücretsizdir" (ana sayfa iletişim) | 0 (10.10'da kaldırıldı, canlıda) | kaldırılmış kalsın | koşullarını sizin yazdığınız metin |
| 2 | "en kısa sürede size dönelim" (ana sayfa iletişim) | 1 | "Mesajınıza dönüş yapılır." (süre yok) | kaldır |
| 3 | "Arslan Hukuk Bürosu güvencesiyle" (alt bilgi) | 1.120 | "Arslan Hukuk Bürosu tarafından hazırlanır" | "Arslan Hukuk Bürosu" |
| 4 | "Acil hukuki destek" (alt çubuk + çağrı kutusu başlığı) | 274 | "Hukuki destek" | "İletişim" |
| 5 | "Acil durumunuz mu var? Süre kaybı hak kaybıdır. … erken adım sonucu değiştirir." (rehber çağrı kutusu) | 10–11 | "Süreler kısadır: para cezasına başvuru 15 gün, iptal davası 60 gün." (tek süre tablosundan, dayanaklı) | "Sorunuz için iletişim bilgileri aşağıda." |
| 6 | "… erken adım hak kaybını önler" (il kuyu ruhsatı sayfaları) | 81 | 5'teki süre cümlesi | "{İl} için kuyu ruhsatı rehberi" (vaatsiz) |
| 7 | "Somut durumunuz için hukuki değerlendirme" (danışmanlık kutusu) | 14 | olduğu gibi kalsın (vaat yok) | "İletişim" |
| 8 | "… itiraz/dava yolunu ve süresini değerlendirelim" (hesaplayıcı çağrıları) | 7 | "… tebliğ tarihinizi ve fiili iletin." | olduğu gibi |
| 9 | "Su hukuku ve yeraltı suyu mevzuatında uzmanlık · DSİ ve idari kurum süreçlerinde deneyim" (ana sayfa) | 1 | "Çalışma alanı: su hukuku ve yeraltı suyu mevzuatı" | kaldır |
| 10 | "idari yargıda temsil" (ana sayfa hizmet kartı) | 1 | "idari yargıda vekillik" | olduğu gibi |
| 11 | "tek çatı altında … su hukukunun tüm alanlarında yanınızdayız" (ana sayfa) | 1 | "Su hukukunun bu alanlarında çalışıyoruz." | kaldır |
| 12 | "Suyun hukukunu bilen bir avukatla çalışın" (ana sayfa başlık) | 1 | "Su hukuku alanında çalışan büro" | kaldır |
| 13 | "uzman değerlendirmesi" (hesaplayıcılar) | 3 | "avukat değerlendirmesi" | "hukukçu değerlendirmesi" |
| 14 | "{İl} için parsel bazlı ön değerlendirme … teknik ön değerlendirme talebi oluşturun" (il yeraltı suyu sayfaları) ve "Ön Değerlendirme Başvurusu" (sihirbaz) | 84 + 1 | "{İl} için bilgi talebi" | olduğu gibi |
| 15 | "Hızlı danışma" (alt çubuk düğmesi) | 1.122 | "Form" | "Yazılı danışma" |
| 16 | "Olağanüstü yollar değerlendirilmelidir." (süre rozeti, süre geçince görünür) | 2 | "Süre dolmuş görünüyor; somut dosya avukatla değerlendirilmeli." | kaldır |
| 17 | "an independent, source-cited portal" (/en/) | 1 | "run by Arslan Law Office" | "independent" kelimesi kalksın |

Ayrıca (ifade değil, hukuki doğruluk): sihirbazdaki "Ön Değerlendirme" kutusunun ilk cümlesi (1 sayfa: /kuyu-karar-motoru/) "İdari para cezası, mühürleme ve ruhsat iptali işlemleri; 2577 sayılı İYUK uyarınca … yargı denetimine tabidir" diyor. 5326 m.27/1'e göre idari para cezasına karşı başvuru yeri sulh ceza hakimliğidir; idari yargı yalnız m.27/8 durumunda (aynı işlemde idari yargıya giren karar da varsa). Önerilen düzeltme: "Mühürleme ve ruhsat iptali gibi işlemlere karşı idari yargı yolu açıktır (2577 m.2); idari para cezasına karşı başvuru yeri kural olarak sulh ceza hakimliğidir (5326 m.27/1), aynı işlemde idari yargıya giren karar da varsa idare mahkemesidir (5326 m.27/8)." Değiştirilmedi; onayınıza.
