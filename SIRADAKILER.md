# SIRADAKILER.md — projenin tek iş kuyruğu

Öncelik sırasıyla; biten iş kuyruktan düşer, yeni istekler kuyruğa eklenir.

SU POTANSİYELİ KATMANI — 81 İLDE, KULLANICI ONAYI BEKLİYOR (MERGE=YAYIN;
27 Tem 2026): "Bu ilde su nerelerde çıkabilir?" bloğu 81 il sayfasında
(worktree suharitasi-potansiyel, dal potansiyel-2026-07-27). Pilot onaylı;
81-il denetimi: blok 81/81, öz-cevap ≤280 (maks 237), kütle satırı 354/354,
kırık link 0/9665, gerileme 0 (kanıt: cikti/denetim/potansiyel-pilot/ +
rapor/potansiyel-faz*.md). MERGE YALNIZ KULLANICI ONAYIYLA. Açık kalemler:
OpenAlex 32 il kotası, ilçe dizini resmî çapraz doğrulama, RG izleme cron
(Faz 6 sonrası), TWI (8GB), 3 belirsiz kütle.

TWI YENİDEN DEĞERLENDİRME (27 Tem 2026, kullanıcı kararı): Faz 5 TWI'yi
"4GB yetmez" bayat varsayımıyla atlamıştı; sunucu gerçekte 8GB (ölçüldü).
Akış birikimi + TWI hesabı 8GB bütçesiyle yeniden değerlendirilecek
(karo-birleştirmeli D8; morfoloji.json'a twi alanı eklenir). ŞİMDİ
HESAPLANMAZ — ayrı iş.

KALICI RG İŞLETME-SAHASI İZLEME CRON'U (27 Tem 2026, kullanıcı kararı —
FAZ 6 SONRASI KURULUR, ŞİMDİ KURULMAZ): RG /Home/Filter JSON ucuyla
"yeraltısuyu işletme sahası" (+ayrı yazım) başlık/ilan araması periyodik
koşup yeni kayıtları isletme-sahalari*.json'a ekleyecek; site-saglik
veri-bütünlüğü kontrolüne bağlanacak (SÜREKLİLİK İLKESİ). Altyapı hazır:
arac/rg-tara.py + arac/rg-icerik-tara.py.

OPENALEX EKSİK 32 İL (27 Tem 2026, su potansiyeli Faz 4.B): OpenAlex
kalıcı 429 kotası nedeniyle 32 ilin akademik künyeleri eksik
(veri/potansiyel/akademik-kunye.json hatalar listesi). `python3
arac/akademik-kunye.py` artımlıdır — birkaç saat sonra tek koşu tamamlar;
sonra `arac/zenginlestirme-birlestir.py` yeniden koşulur. 4.B DergiPark→OpenAlex ikamesi ONAYLANDI (27 Tem 2026) — şart: basılacak
her künye DOI/açık-erişim URL'si taşır, taşımayan basılmaz (baski_uygun
etiketi veride).

İLÇE DİZİNİ ÇAPRAZ DOĞRULAMA (27 Tem 2026, kullanıcı kararı A — su
potansiyeli Faz 2): kütle→il eşlemesinde kullanılan ilçe→il dizini OSM
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

SAGLIK SISTEMI — LIGHTHOUSE TEK ATIŞ (27 Tem 2026, KULLANICI KARARI BEKLİYOR)
`arac/site-saglik.mjs:447` Lighthouse'u sayfa başına BİR KEZ çağırıyor.
CLAUDE.md kuralı "3 tur medyan" diyor. Ölçüldü: aynı build'de mobil puan
82-99 arasında oynuyor — sistem düzenli olarak yanlış regresyon alarmı
üretecek. Performans eşiği otomatik onarım KARA LİSTESİNDE olduğu için
DEĞİŞTİRİLMEDİ. Karar: 3 tur medyana çevrilsin mi (koşu süresi ~3 katına
çıkar), yoksa eşik gevşetilsin mi?

BENİM REGRESYONUM KAPANDI (27 Tem, `d64d5de`): breadcrumb sayfası olmayan
ara halkayı link yapıyordu → /arac/ 404. 175 sayfa tarandı, kırık link 0.
Ders kuyruğa: örnek sayfa öz-denetimi TAM SİTE taramasının yerine geçmez.

AĞIRLIK KAYDI (27 Tem): IA turu + D3-A sonrası ortalama HTML sayfa
24,3 → 28,9 KB (+%19), havza sayfası 40,8 → 50,2 KB, /durumum/ aktarılan
bayt +%11,6 · DOM +%11,8. Lighthouse'a yansıması ayırt edilemedi.

ANA SAYFA v2 (emilkowalski + v0 spesifikasyonu) — CANLIDA (2026-07-27,
merge c7fbe40→de01fbd + push + canlı doğrulama; ayrıntı GUNLUK). v0 ince
ayar turu (A=28 fark) dahil; 13 GEO commit'i de aynı merge ile yayınlandı.
Kullanıcının canlı görsel onayı nihai kapanış. Açık maddeler:
- [x] Sondaj kartı — KAPANDI (27.07): /havzalar/ hedefine bağlandı;
      "su nerelerde çıkabilir" sorusu da /havzalar/'a eşitlendi (0.8:
      YAS potansiyeli 25 havza sayfasında basılıyor; /harita/ değil).
      Aynı sayfada iki giriş aynı hedefe — kasıtlı.
- [ ] SITE-DURUM 🔴 (GRACE tazeliği 262,6 gün) — bu iş kapsamı dışında
- [ ] "Su nerelerde çıkabilir" cevabı nerede — HENDEK FAZ 2.5 (yeraltı suyu
      potansiyeli katmanı) yapıldı mı, YAS verisi 25 havza sayfasında
      basılıyor mu, sıralama sayfası var mı. Ana sayfadaki soru şu an
      geçici hedefe bağlı (/harita/).
- [x] MENÜ TUTARSIZLIĞI — KAPANDI (27.07, menu-2026-07-27 canlıda):
      174 sayfada tek PaylasilanMenu; koşullu çapa (/#), Veriler 10 rota
      (+/hakkinda/), vitrin (son 3 rehber + kanun son durum + havza)
      menü paneline taşındı — kaybolan bağlantı 0.
- [x] Eski menü dosyaları — SİLİNDİ (27.07 temizlik, kullanıcı onayıyla
      M10 kaldırıldı): UstMenu.astro · TamEkranMenu.astro · UstBar.astro
      (iteratif eleme: UstBar+UstMenu tur 1, TamEkranMenu tur 2 —
      tek referansı öksüz UstMenu'dendi). KORUNAN: data/menu.ts
      (PaylasilanMenu kullanıyor) · public/s/menu.js (174 sayfada
      <script src> hâlâ çağırıyor — 2.4 kuralı).
- [x] /s/menu.js — KAPANDI (27.07 menujs turu, aff52eb canlıda):
      NO-OP kanıtlandı (üç kanal: sv-menu id'si 0 sayfada, guard çift
      koşullu; kökte document/window dinleyicisi yok; koşulsuz yan etki
      yok). Üç script etiketi + harita-pilot'taki öksüz tetik düğmesi +
      .sv-menu-ac CSS'leri kaldırıldı, dosya silindi; canlıda 404,
      referans 0, ~1 istek/sayfa kazanıldı. Kalıntı not: /s/imlec.js
      'sv-menu-goruntude' sınıfını okuyor — sınıf artık hiç oluşmuyor,
      zararsız ölü dal (imleç sistemi ayrı iş).
- [ ] Öksüz kalan bileşenler (silme kararı kullanıcıda, M10):
      src/data/anasayfa-sorular.js (7-soru güverte seti; artık hiçbir sayfa
      import etmiyor) · src/scripts/scrub-engine.js index kullanımı düştü
      (yalnız /harita-pilot/ noindex arşivi kullanıyor) · eski sayfa
      arsiv/anasayfa-guverte-v3/index.astro.
- [ ] Logo dosyası kullanıcıdan (logo-su-hukuku.png yok — metin marka
      kullanıldı).
- [ ] Gerçek deneyim yılı / dosya sayısı (v0'ın "15+ yıl / 500+ dosya /
      %98" uydurmaları M7 gereği YAZILMADI; yerine build'de sayılan
      25 havza · 81 il · 10 rehber).
- [ ] Telefon numarası: künyede doğrulanamadı → blok konmadı. "İstanbul"
      konumu da sitede doğrulanamadı → konum bloğu konmadı.
- [ ] Form altyapısı: şu an mailto (JS ile gövde; JS'siz doğrudan link).
- [ ] review-animations bulguları raporlandı, UYGULANMADI (brief 3.1;
      liste: cikti/denetim/anasayfa-v2/RAPOR.md).
- [ ] Hero alt metni: GEO için yazılmış 280'lik öz-cevap kullanıldı (K-3);
      pazarlama metni olarak gözden geçirilmeli.
- [ ] TBB gözden geçirme (rapor notu): "Ücretsiz Ön Görüşme Alın" /
      "Randevu Al" çağrıları v0'dan; sitenin mevcut "davetsiz/nesnel" TBB
      duruşundan ayrışıyor — hukuki değerlendirme kullanıcıda.

/HANGİ-KURUM/ SAYFASI — KULLANICI ONAYI BEKLİYOR (2026-07-23). Su işlemlerinde
yetkili kurum rehberi: build-time hangi-kapi.json (20 işlem) + su-birimleri.json
(155 kurum) + su-islemleri.json'dan üretildi; üstte tek-tık filtre (details),
altta JS'siz tam tablo. FAQPage yalnız 11 doğrulanmış satır. Kanıt: LH masaüstü
98/mobil 85, kontrast AA, konsol 0, 375 taşma 0, link 0 kırık
(cikti/denetim/hangi-kurum/RAPOR.md). Menü iki kaynağa eklendi. AÇIK: brief "tel"
istedi, doğrulanmış numara yok → e-posta+künye kullanıldı; kullanıcı numara
verirse eklenecek. Kullanıcının canlı testi bekleniyor.

BRIEF DENETÇİSİ — KURULDU (2026-07-23). Her brief uygulanmadan önce
`node arac/brief-denetci.mjs <cikti/brief/dosya>` + düşman geçişi (D1-D4) +
amaç özeti (3b) yapılır; ENGEL uygulamayı durdurur. Kural kaynağı:
arac/brief-kurallari.json (kayıt-türetilmiş, T1-T8). Kurulum + 7 senaryo +
öz-denetim: rapor/brief-denetci.md. Kural CLAUDE.md "Brief denetçisi — ön
kapı kuralı"nda. Yeni kural doğunca (GUNLUK hata kaydı) json güncellenir.
BİLİNEN EKSİK: site-saglik v5 briefi diske kaydedilmemişti (denetlenemedi);
araç use/mention ayrımı yapamaz (meta-briefler elle değerlendirilir).

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

KUYU ÇIKAR MI — keşif tamam (bf8e5fd); KULLANICI DEĞERLENDİRME OTURUMU
bekleniyor, otomatik kur briefi YASAK. Sıra: keşif raporu → değerlendirme
oturumu (yayına değer mi / sorumluluk çerçevesi / saha doğrulaması) →
[SERDAR-HUKUK] onayı → uygulama briefi. (İlke: ODUL-USTU.md "Korunacaklar"
— altyapıda hızlı, iddiada yavaş.)

SÜREKLİ SİTE SAĞLIK SİSTEMİ — KURULDU (2026-07-23, commit 975a288).
arac/site-saglik.mjs: 10 kontrol, üç mod (--tam cron 07:30+19:30 UTC, --hizli
deploy sonrası, --test sanal doğrulama). Sınırlı otomatik onarım (beyaz liste)
+ kara liste (performans/tasarım/içerik/JSON-LD/veri kaynağı/mimari = DUR).
Ortak git kilidi 4 commit'çide kurulu; bekçinin bekçisi saglik-bekcisi.sh'te.
Kanıt: cikti/denetim/site-saglik/ (RAPOR.md + 7/7 test senaryosu + ilk tam
koşu + SHA-bekleme + bellek kuralı + kilit deneyi + crontab kaydı).
Sistem ilk koşuda 3 kırık iç link buldu (persona.json yanlış slug) — elle
düzeltildi, şimdi 167 linkte kırık 0.
KAPANDI (2026-07-23, b709c46): /harita/ öz-cevap + JSON-LD eklendi
  (WebPage + Dataset; şema gerekçesi RAPOR.md §6). SITE-DURUM.md artık
  🟢 YEŞİL — 10/10 kontrol geçti. Öz-cevap "canlı baraj doluluğu" DEMEZ:
  o veri bu sayfada yok, havza sayfalarında (uydurma yasağı).
YENİ KUYRUK MADDESİ — sağlık sistemi a11y açığı: md.9 Lighthouse yalnız
  `performance` ölçüyor. Somut bulgu: /harita/ MENÜ düğmesi (position:fixed,
  --kopuk) aydınlık panel üstünde düşük kontrast — FAZ 3'ten beri var, a11y
  kategorisi ölçülseydi yakalanırdı. Yapılacak: onlyCategories'e
  'accessibility' eklenip eşik tanımlanması + düğmenin panel bölgesinde DİP
  tonuna dönmesi (DESIGN.md kararı).
BEKLEMEDE: SMTP bilgileri (.env'de SMTP_HOST/SMTP_USER/SMTP_PASS/ALARM_TO).
  Gelince e-posta alarmı açılır + sentetik 🔴 ile test maili atılır.

ANA SAYFA — MENÜ/SÜZÜLME/ÖNCELİK v3: FAZ 1 (MENÜ ARIZASI) DÜZELTİLDİ,
KULLANICI ONAYI BEKLİYOR (2026-07-24). Kök neden REGRESYON DEĞİL, eski arıza:
akis-bitti (kaydırma dibi/scroll-restorasyonu) menü şeridini
pointer-events:none yapıyordu → menü ölü açılıyordu. Düzeltme: dipte menü
söndürülmez, aydınlık iniş üstünde okunaklı+açılır kalır (C paleti). EKLENDİ:
site-saglik md12 ETKİLEŞİM DENETİMİ (varlık değil işlev; menü/filtre/arama/bağ)
— falsifikasyonla kanıtlı (bozuk menü→md12 KIRMIZI). Kanıt:
cikti/denetim/menu-arizasi/RAPOR.md; 375 konsol 0/taşma 0. DUR — kullanıcı
canlıda menüyü doğrular (masaüstü+mobil, scroll-restorasyonu senaryosu).
SIRADA: FAZ 2 SÜZÜLME (mock, HAREKETLİ kare dizisi; A güverte İPTAL, opak
güverte kalkar) → FAZ 3 uygulama (süzülme + soru önceliği: su nerede çıkar→
kuyu ruhsatı→ceza; Su Kanunu geri çekilir). FAZ 2/3 ayrı commit, DUR'lu.
[TAMAMLANAN v3-öncesi] SORU HİYERARŞİSİ Aşama 2 (soru güvertesi) uygulanmıştı;
FAZ 2/3 bu güverteyi süzülmeyle DEĞİŞTİRECEK.
[ÖNCEKİ] ANA SAYFA — SORU HİYERARŞİSİ v3: AŞAMA 2 (KOD) UYGULANDI, KULLANICI ONAYI
BEKLİYOR (2026-07-23). Kararlar A/S2/iniş-kalksın/hedef-sabit uygulandı:
soru güvertesi (sahne üst bant, opak DİP panel → garantili AA 13,91:1),
öz-cevap ilk ekranda, "Su nerelerde çıkar?" S2 native <details> dürüst cevap
(/harita/ + garanti-değil uyarısı), iniş sektör ızgarası kalktı, --kehribar-koyu
DESIGN.md'de emekli. Motor/video/scrub DOKUNULMADI (6/6 sahne readyState 4).
Kanıt cikti/denetim/anasayfa-asama2-v3/: konsol 0, link 0, 375 taşma 0, 7/7 soru
ilk ekranda (öncesi 2/7), LH masaüstü 98/mobil 87 (mobil 85'ten iyileşti),
kontrast hepsi AA. Denetimde .s-uyari özgüllük hatası yakalanıp düzeltildi.
AÇIK KULLANICI GÖREVİ: (1) canlı test = nihai onay (scrub akıcılığı GPU'suz
kanıt sayılmaz + S2 hissi), (2) Cloudflare Purge. Geri dönüş: tek commit revert.
[AŞAMA 1 MOCK] Canlı ölçüm 3 şikâyeti doğruladı; A/B+S1/S2+sektör mock'landı
(cikti/denetim/anasayfa-soru-hiyerarsi/, yerel).
[ÖNCEKİ] ANA SAYFA — 6 SAHNE + 7 SÜZÜLEN SORU: AŞAMA 2 + CANLI TEST DÜZELTMELERİ
UYGULANDI, KULLANICI ONAYI BEKLİYOR (2026-07-23). Canlı ölçüm (dist-sun) 3 şikâyeti de
doğruladı: scroll 0'da yalnız 2/7 (1440) / 1/7 (375) soru görünür, öz-cevap+
sektör kartları %93 aşağıda (iniş bölümü); şerit kontrastı iyi, sorun konum+
belirginlik. İki alternatif: A "soru güvertesi" (sahne %52, opak DİP panel →
garantili AA, öneri) / B "süzülen büyük soru" (sinematik, AA riski Aşama 2'de
ölçülür). Boş kapı S1(6 soru)/S2(kalır+dürüst cevap). Sektör kartları cevap
içine (türetme: ilgiliIcerik∋/su-kanunu/=35 persona; D4: son-tarih berabere,
ikincil sıra gerekli). /hangi-kurum/ çakışması yok (farklı eksen). LH tabanı
masaüstü 99/mobil 85. Kanıt: cikti/denetim/anasayfa-soru-hiyerarsi/ (RAPOR.md
+ 6 kare + faz0 ölçüm). DUR — 4 karar: (i) A/B, (ii) S1/S2, (iii) iniş sektör
kaderi, (iv) /hangi-kurum. Onaysız Aşama 2 (kod) YOK.
[ÖNCEKİ] ANA SAYFA — 6 SAHNE + 7 SÜZÜLEN SORU: AŞAMA 2 + CANLI TEST DÜZELTMELERİ
UYGULANDI, KULLANICI ONAYI BEKLİYOR (2026-07-23). Koyu hero kalktı, sahne
akışı açılış oldu; R2 alt şerit; akış sonu iniş bölümü; /deneyim/ 301 → /.
Canlı testte çıkan üç arıza kapatıldı (üç ayrı commit, ayrı ayrı revert
edilebilir — RAPOR.md "GERİ DÖNÜŞ"):
  FAZ 1 (385be5a) SAHNELER OYNAMIYORDU. Kök neden CSP: _headers'ta `media-src`
    yoktu, `default-src 'self'` motorun blob: video kaynağını reddediyordu
    ("Media load rejected by URL safety check"). Fetch 200 dönüyordu, engellenen
    yalnız decode'du — bu yüzden ağ ölçümü arızayı göstermiyordu. Ayrıca sahne
    adı hapı (.sw-route__label) görsel katmandan çekildi (a11y adı korunarak).
  FAZ 2 (aff6fd2) ŞERİT GÖRÜNÜRLÜĞÜ. Ölçüm: 1440'ta şerit kadrajı 11px
    ÖRTÜYORDU, 375'te kadrajdan 181px KOPUKTU. Sahne kabı kadrajın kendisi
    kadar yapıldı, şerit onun 12px altına kilitlendi — iki kırılımda da 12px,
    örtüşme 0/14. Kırpma yok. Zincir yeniden ölçüldü: scrub/ritim/crossfade/
    preload DEĞİŞMEDİ.
  FAZ 3 (a45e786) "Barajlarımızda ne kadar su var?" → /havzalar/ (baraj doluluk
    verisi havza sayfalarında; /harita/ panelinde yok). Sıralama değişmedi,
    gerekmedi: iki /havzalar/ sorusu 4. ve 6. sırada, komşu değil; assert
    olduğu gibi geçti. Yan düzeltme: 375'te kırpılan tek soru için mobil etiket
    kısaltıldı, 7/7 sığıyor.
Kanıt: cikti/denetim/anasayfa-duzeltme/ (RAPOR.md + faz0-teshis.json +
40 kare + zincir/LH JSON'ları) ve cikti/denetim/anasayfa-asama2/.
Ölçüm: LH 3-tur medyan masaüstü 99 (eşik 85) / mobil 86 (eşik 70); 6/6 sahne
canlıda readyState 4 + currentTime 2,60; konsol 0, kırık link 0, taşma 0.
YENİ DENETİM ARACI: arac/dist-sun.mjs — dist'i Cloudflare gibi (CSP +
_redirects) servis eder. `python3 -m http.server` _headers'ı uygulamadığı için
CSP arızası yerelde HİÇ görünmüyordu; bundan sonra denetimler bu sunucuda.
AÇIK KULLANICI GÖREVİ: (1) canlı test = nihai onay, özellikle scrub akıcılığı
(headless GPU'suz, kanıt sayılmaz), (2) Cloudflare "Purge Everything".
Eski landing ve /deneyim/ SİLİNMEDİ: arsiv/landing-koyu/, arsiv/deneyim-rota/.

SAHNELERİN EVİ = ANA SAYFA (22.07 kullanıcı kararı): 6 sahne + 7 süzülen soru
ana sayfaya girer. /harita/ dönüşüm mock'u (fd699ff çıktısı) GEÇERSİZ;
/harita/ veri sayfası olarak kalır. /deneyim/ 301 planı ana sayfa Aşama 2'de
ele alınır. Aşağıdaki /harita/ dönüşüm briefi bu kararla HÜKÜMSÜZDÜR (kayıt
olarak duruyor).

AKTİF BRIEF (HÜKÜMSÜZ — 22.07 kararıyla iptal) — /HARİTA/ DÖNÜŞÜMÜ
(DENEYİM GÖMME v2 NİHAİ): AŞAMA 1 TAMAM
(2026-07-22, kod yok) — KULLANICI ONAYI BEKLİYOR. Hero kalkar, 6 sahne
scroll-scrub /harita/'ya girer, panel+GEO aynen altta, /deneyim/ kapanır.
Çıktı: cikti/denetim/harita-donusum/ (yerlesim-semasi-1440.png + mock.html +
kareler/ + RAPOR.md). Ölçülen taban: /harita/ LH masaüstü medyan 94, mobil 72
(LCP 8,3sn = ağır hero webp 989KB); 6 video MP4 7,95MB, motor ZATEN lazy
(ilk yük yalnız sahne1 poster 51KB+sahne1.mp4 1,3MB). GEÇİŞ 2 alternatif:
A "yüzeye çıkış" (öneri, panel-reveal cross-blur) / B "kot cetveli eşiği".
KULLANICI KARARI: (1) geçiş A/B, (2) ağırlık tablosu kabul mü. Onaysız
AŞAMA 2 (taşıma + /deneyim/ 301 + menü + link + sitemap + kanıt) BAŞLAMAZ.

FAZ 8 — PALET YENİLEME: UYGULANDI, KULLANICI ONAYI BEKLİYOR (2026-07-22).
Kullanıcı aday C'yi seçti (mavi zemin + lacivert metin + kehribar kritik
#875518). Uygulandı: DESIGN.md §2 C setiyle yeniden yazıldı (eski palet
arşiv-notu olarak duruyor = geri-dönüş yolu), 191 değişiklik/29 dosya,
LinkedIn kart aracı C'ye alındı. Landing İstisnası + /deneyim/ + harita
adası + harita-2d/3d coğrafi renkler kapsam dışı (gerekçeli).
Kanıt: cikti/denetim/faz8-uygulama/ (RAPOR.md + 12 ekran + kontrast JSON +
LH a11y + değişim listesi). Ölçüm: 30 kontrast çifti AA, kıyas tablosundan
sapma 0; 375 taşma 0, konsol 0, kırık link 0; LH a11y 3-tur medyan 100×3.
Yan bulgu: 3 ÖNCEDEN VAR OLAN AA açığı (menü künyesi 3.04, vitrin özeti
3.77, liste sıra no 2.04) tespit edilip kapatıldı — görsel olarak fark
edilir, canlı testte bakılmalı.
AÇIK KULLANICI GÖREVİ: (1) canlı test = nihai onay, (2) Cloudflare
"Purge Everything" (palet tüm HTML/CSS'e dokundu), (3) eski 3 LinkedIn
kartının C ile yeniden üretilmesi kararı (silinmedi, üzerine yazılmadı).
Sonra FAZ 2 nabız şeridi. Uygulama sırası 1→7→8→2→3→4→5; FAZ 1, 7, 8 TAMAM.

FAZ 7 (Sonuç Zinciri) TAMAM (2026-07-21; AŞAMA 0 162d182 · AŞAMA 1 88c7a72 ·
AŞAMA 2 27dd472, push+canlı): /durumum/ sektör kapısı + 11 persona sonuç
sayfası canlı; pazarlama altyapısı (bülten/LinkedIn/webinar/rapor iskeletleri)
hazır. AÇIK (kullanıcı görevleri): Buttondown hesabı, Google Business Profile,
LinkedIn ritmi, webinar tarihi, GEO nabzı kurulum kararı, büro bilgileri
(künye şeması), vaka adayı seçimi (KAP yeni API ucu), soru havuzu Apilex
doldurma, Ek-2 NACE makine-okunur kaynağı, /durumum/ renk paleti (ayrı iş),
kuyu taşıma içeriği. Canlı test kullanıcıda.

Ödül-üstü programı — çatı: ODUL-USTU.md. Faz 1 (Sözlük ve Borç v2) TAMAM
(2026-07-21, 68e340a push+canlı; kullanıcı canlı testi açık — İş kapanış
kuralı bu brief kapsamında peşin onaylı). /deneyim/ menüye TAMAM (2026-07-21;
UstMenu+TamEkranMenu tek kaynak, landing birebir, 375px kanıtlı). src/harita-3d
arşivde kalır (route yok, teyit). Sıradaki ödül-üstü fazı: v5 sırasına göre
Faz 7 → sonra Faz 2 nabız şeridi.

TAMAM (2026-07-21): Su Kanunu TBMM izleme sistemi v3 KURULDU — izleme/ +
cron (05:30+16:00 UTC) + saglik-bekcisi tazelik kontrolü; T1-T5 kanıtlı
(cikti/denetim/su-izleme/KURULUM.md). ŞERH: ilk gerçek cron fire 16:00 UTC —
canlı teyit beklemede (İş kapanış kuralı). Kaynak keşfi v2 (700f216) da TAMAM.

İŞLENİYOR (2026-07-21): Opus paketi 5 bölüm (A belge arşivi · B kayıt ·
C UYAP künye teyidi · D SEO/GEO denetim skill · E NACE Ek-2 + KAP tarama);
durum tablosu PAKET SONU'nda. Kuyruk sırası korunur.

TAMAM (2026-07-21): GECE PAKETİ v2 — 4 bölüm push+canlı (894d7e3 A ·
459c3c6 B · d3b7a55 C · 08c2566 D). A: NACE Ek-2 OCR (tesseract-tur;
31 ana faaliyet doğrulandı → 31 persona; nace-ek2.json + persona.json).
B: /rehberler/kuyu-tasima/ rehberi (Apilex kaynağı yerleştirildi; ayrı
özel sayfa; hücre birebir; FAQPage+Article; LH a11y/best/seo 100). C:
bellek-log cron */10 + saglik-bekcisi pencere eşiği (4 senaryo test). D:
NACE persona sayfalaşması (durumum index gruplama). Canlı test kullanıcıda.
AÇIK (kullanıcı): (1) durumum iletişim-notu kontrastı — KAPANDI (625e3fe:
#9FB3AD→#C8D2CE, su-700 üstünde 3.44→4.89; LH a11y persona+index 100).
(2) 31 NACE personası küratörlük/budama
kullanıcıda. (3) m.18 güncel ceza tutarı [APILEX teyit]. (4) NACE detay
alt-kod listesi eksik (~58 satır ayrıştırılamadı; gerekirse yüksek-DPI
segmentasyon).

DÜZELTME TURU 1'DEN AÇIK KALANLAR (2026-07-25):

- [ ] Astro 5.18.2 → 6.0.5 ve maplibre-gl 5.24.0 → 6.0.0 ana sürüm
      yükseltmesi. ERTELENDİ (25 Tem 2026). Gerekçe: iki ana sürüm
      atlaması, 175 sayfa + harita bileşenini etkiliyor; denetimde
      güvenlik maruziyetinin düşük olduğu kanıtlandı (npm audit'teki
      3 high'ın tetiklediği özelliklerin hiçbiri kullanılmıyor), acele
      sebebi yok. Sakin bir seansta, tam görsel regresyon kontrolüyle
      yapılmalı. Denetim maddeleri: F1-2 + F3-1 (K4 kümesi), F1-1
      (astro check kurulumu), F1-3 (extraneous paket).

- [ ] Ana sayfa soru doğrulaması: mock-kure.astro:21'de bir build-zamanı
      bekçisi vardı (brief sırasındaki soru anasayfa-sorular.js'de yoksa
      throw). Rota arşive alınınca bu bekçi öldü. Ana sayfada (index.astro)
      eşdeğer bir doğrulama var mı kontrol edilmeli; yoksa eklenmesi
      değerlendirilmeli. DOĞRULANMADI.

- [ ] /harita-pilot/ ve /stil-pilot/ rotalarının akıbeti — karar bekliyor
      (denetim maddeleri F2-2, F2-3). mock-kure ile birlikte
      değerlendirilmedi, kapsam dışı bırakıldı.

1. HEDEF.png hero — YAPILDI: görselin kendisi tam ekran hero oldu; 3D
   atmosfer sahnesi src/harita-3d/ altına arşivlendi (silinmedi)
2. Kullanıcı onayı → canlıya deploy (Production kontrolü)
3. Landing giriş koreografisi + Arslan Hukuk footer imzası — YAPILDI,
   DENETLENDİ (2026-07-14): kelime kelime animasyon + imza kökte MEVCUT
4. www.suharitasi.com custom domain ekleme — YAPILDI (2026-07-14):
   kullanıcı panelden ekledi, test edildi
5. suharitasi.tr → suharitasi.com 301 — YAPILDI (2026-07-14):
   kullanıcı panelden kurdu, çalışıyor (test edildi)
6. Search Console + sitemap — YAPILDI (2026-07-14)
7. Kullanıcı kendi logosunu üretince /harita/ sayfasına logo eklenecek
   (2026-07-14: logo + "konsept görsel" atıfı kaldırıldı, sayfa salt görsel)
8. Sunucu reboot (bekleyen kernel) — YAPILDI (2026-07-14)
9. Faz 3B: kamera + ekrana damla sıçraması (Sondaj Anı-1)
10. Aşama 1 derin kazı: havza GeoJSON + DSİ verisi + KAYNAKLAR —
    YAPILDI (2026-07-14): 25 havza GeoJSON (data/havzalar/, 90KB web
    sürümü) + DSİ 2024 veri künyesi (data/havza-veri.json) + mevzuat
    kütüphanesi + Su Kanunu taslak takibi + Sakarya gerçek veriyle
    dolduruldu. AÇIK KALAN: havza geometrisi resmî kaynakla
    doğrulanamadı (gov CBS yurt dışına kapalı); tahsis verisi yok.
11. Kalan 24 havza sayfası — YAPILDI (2026-07-14): 25/25 havza sayfası
    havza-veri.json künyelerinden üretildi
12. Havza geometrisinin resmî kaynakla doğrulanması (TR IP'den
    geodata.tarimorman.gov.tr / cbs.dsi.gov.tr denenecek)
13. Aşama 2 pipeline → canlı baraj doluluğu (VIZYON-5) — NOT: DSİ
    Tablo 4.7 (havza bazında doluluk 2010-2024) kaynak/dsi/ yolunda hazır
14. Konum tabanlı kişisel açılış (VIZYON sırası 3)
15. İl/kurum katmanı — YAPILDI (2026-07-14): data/il-kurum.json (81 il,
    26 DSİ bölgesi, 25 havza-il listesi) + havza sayfalarında "İller ve
    yetkili kurumlar" bloğu + kuyu-ruhsati rehberinde 81 il tablosu
16. Mevzuat rehberleri paketi — YAPILDI (2026-07-14): 9 rehber
    (Apilex çıktısından, kaynak/apilex-sumevzuat.md) + taslak-takibi'ne
    Bölüm 12 tespiti. YAYIN KİLİDİ: madde 17 kapanmadan yayına alınmaz.
17. Karar künyelerinin doğrulaması (YAYIN KİLİDİ) — 9 rehberdeki tüm
    Yargıtay/Danıştay künyeleri resmî kaynaktan doğrulanacak; özellikle
    çelişkili Danıştay 13. D. künyesi çözülecek: 2020/1104 E.-2023/4576 K.
    vs 2020/1093 E.-2023/2584 K. (kaynak-suyu-kiralama rehberi)
18. Eksik rehber verileri ayrı kanaldan tamamlanacak: su kirliliği
    cezaları (2872/SKKY), koruma alanı yasak listesi, TBB reklam yasağı
    uyumu (KAYNAKLAR.md "VERİ YOK" bölümü)
19a. Tarayıcı öz-denetim altyapısı — YAPILDI (2026-07-14): Playwright
    MCP kuruldu (.mcp.json; yeni oturumda araç olarak aktif), protokol
    CLAUDE.md'de, script yedeği arac/oz-denetim.mjs; deneme denetimi
    temiz (0 hata, 0 kırık link, 3 görüntü cikti/denetim/).
19. Menü + içerik sayfaları görsel yenileme (su hissi) — SÜPERSEDE
    (2026-07-21 kapanış): bu "su hissi" katmanı SU-DİLİ anayasasıyla
    (madde 34 ONAYLANDI + madde 36 FAZ 1) tümüyle değiştirildi; eski
    sürüm sitede yok. Kapatıldı. Tarihsel not aşağıda korunur:
    [ESKİ] KULLANICI ONAYI BEKLİYOR (2026-07-14): ilk sürüm canlıda başarısız (sim
    görünmüyor, imleç topak, şerit soluk); düzeltme b32f7fa push'landı
    (sim görünürlüğü + FPS ısınması + SVG damla + belirgin şerit).
    Kullanıcı canlıda tekrar test edecek; onaysız kapatılmaz.
20. Pazarlama/CRO skill kazısı + danışmanlık raporu — YAPILDI
    (2026-07-14): 25 aday puanlandı, 2 skill seti kuruldu
    (marketingskills + claude-seo, ~/.claude/skills/), 11 sayfa canlı
    tarandı, rapor/pazarlama-danismanligi.md yazıldı (salt analiz,
    uygulama yok).
21. Dalga 1 — rapor uygulaması (İLK 5 HAMLE + 2 ek) — CANLI/ABSORBE
    (2026-07-21 kapanış): landing nav + üç kapı, E-E-A-T künye/yazar
    kutusu, rehber ağı, footer canlıda (curl doğrulandı) ve sonraki
    onaylı işlere (FAZ A-ÖN/A landing yeniden-inşası, madde 42) absorbe
    edildi. TEK AÇIK KALAN: landing WebSite/Organization JSON-LD FAZ A-ÖN
    yeniden-inşasında düşmüştü; WebSite şeması 2026-07-21 düzeltmesinde
    geri eklendi (DUZELTME.md madde 1), Organization/LegalService kapsam
    dışı (TBB dili — künye işi). İlk-sürüm ayrı canlı-onayı GUNLUK'ta
    kayıtlı değil; içerik canlı olduğundan kapatıldı. Tarihsel not:
    [ESKİ] KULLANICI ONAYI BEKLİYOR (2026-07-15): landing nav + üç kapı ("Yakında" kalktı),
    E-E-A-T paketi (künye satırı + yazar kutusu + Article/Person/
    Breadcrumb/Organization/WebSite JSON-LD + og:image), rehber ağı
    (ilgili rehberler + iki küme), Sakarya hukuk bloğu pilotu, yazdırma
    düzeltmesi, 3 kolonlu footer, KOD-6/KOD-9. Headless kanıt temiz
    (build 40 sayfa, konsol 0, kırık link 0, JSON-LD 130 nesne
    schema.org uyumlu, yazdırmada gizli 0); nihai görsel yargı
    kullanıcının canlı testinde.
22. AÇIK — Su Kanunu bülteni canlıya alınamadı: Buttondown hesabı
    kullanıcıda. Form kodu hazır ve test edildi; src/data/bulten.ts'ye
    kullanıcı adı yazılınca açılır (README-BULTEN.md). Hesap açılana
    dek form hiçbir sayfada görünmez (sahte form yayınlanmaz).
23. AÇIK — FAQPage şeması eklenmedi: 9 rehberin hiçbirinde görünür
    soru-cevap bölümü yok (5'inde "Dikkat" tek paragraf, 4'ünde yok).
    Olmayan içeriği işaretlemek Google kurallarına aykırı. Rehberlere
    gerçek SSS bölümü eklenirse (Serdar'ın kalemi) şema da eklenir.
24. Dalga 2+ adayları (rapordan, onay bekler): bölgesel rapor sayfası
    (TAKTİK-3), kuyu ruhsatı kontrol listesi PDF (TAKTİK-5), 81 il
    programatik sayfa (TAKTİK-7), kalan 24 havzanın hukuk bloğu
    (içerik kullanıcıdan).
25. Dalga 2 — menü vitrini + deneyim yenileme — CANLI/ABSORBE
    (2026-07-21 kapanış): TamEkranMenu vitrini canlıda (curl: sv-vitrin);
    menü kabuğu FAZ A site-geneli reformuyla (madde 42, onaylı+canlı)
    yeniden ele alındı. Absorbe edildi, kapatıldı. Tarihsel not:
    [ESKİ] KULLANICI ONAYI BEKLİYOR (2026-07-15): tam ekran menü keşif yüzeyine dönüştü
    (sol: 5 bölüm + alt-etiket; sağ vitrin: son 3 rehber + kanun son
    durum + öne çıkan havza — tümü build-time otomatik, elle metin
    yok); iki menü kodu tekilleşti (/harita/ artık src/pages/
    harita.astro, ortak TamEkranMenu). Headless kanıt: 38/38 test
    (ESC/focus trap/reduced-motion/mobil/kaydırma), kaynak→menü veri
    eşlemesi 5/5, konsol 0, kırık link 0. Su simülasyonu GPU'suz
    görüntülenemedi — nihai onay kullanıcının canlı menü gezintisi.
26. 280 KARAKTER ÖZ-CEVAP KATMANI — YAPILDI (2026-07-16): 9 rehber +
    25 havza sayfasına başlık altı öz-cevap kutusu; rehber özleri elle
    doğrulanmış metinden damıtıldı (künye no yok), havza özleri
    havza-veri.json + GRACE'ten otomatik. Meta description'lar öz-cevaptan
    türüyor. Kanıt: meta==kutu 34/34, uydurma kontrolü temiz, build temiz.
    [ESKİ NOT] 280 KARAKTER KATMANI: mevcut 9 rehber + havza sayfalarına geriye
    dönük ÖZ CEVAP bloğu eklenir (yukarıdaki ilkeye göre). Örnek/
    kuyu-ruhsati: 'Su temini için kuyu açmadan önce DSİ'den belge şart
    (167 s.K. m.8). Üç belge: arama, kullanma, ıslah-tadil. Başvuru DSİ
    Bölge Müdürlüğü'ne, cevap süresi bir ay, belgeler harçtan muaf.
    Belgesiz kuyu: idari para cezası + kuyu kapatma.'
27. SU NABZI KATMANI (GRACE): kaynak keşfinde doğrulanan UNL GRACE
    haftalık yeraltı suyu verisinden (2003–13.07.2026, kayıtsız açık,
    TR-IP yok) — (a) menü/landing'e tek satır canlı gösterge (son 12
    ayda yeraltı suyu en çok azalan/toparlayan havza), (b) ayrı 'su
    nerede azalıyor/artıyor' değişim haritası. HENDEK FAZ 1 verisi
    kurulunca yapılır.
28. KOPYALANMA DİRENCİ UYGULAMASI: (a) Astro build'e minify+obfuscate
    (çalışmayı/perf bozmadan) + source-map kapatma; (b) Cloudflare
    scraper koruması + rate-limit, arama/AI botları beyaz listede;
    (c) ölçülü view-source caydırma. KANIT: build sonrası JS okunamaz +
    source map yok teyidi; Googlebot/GPTBot hâlâ erişiyor testi;
    Lighthouse ≥90 korundu. Uygulama sırası: mevcut görsel/veri işleri
    sonrası, tek brief.
29. HENDEK FAZ 1 — EPİAŞ baraj pipeline — ÇALIŞIYOR (2026-07-16):
    kimlik .env'e girildi, İLK GERÇEK ÇEKİM BAŞARILI (TGT 201; 17 havza,
    116 baraj eşleme, 64 günlük kayıt; kayıt başlangıcı 2026-07-16;
    Sakarya sayfasında gerçek tablo doğrulandı). Altyapı: arac/baraj-cek.mjs (TGT + havza→baraj eşleme + doluluk/
    kot/hacim, sayfalı, ham arşiv data/arsiv/baraj/ + normalize
    data/canli/baraj.json) + günlük cron 18:00 TR kurulu + havza
    sayfalarında BarajDoluluk bloğu (build-time SVG; veri yokken hiç
    çıkmaz, tek günde "kayıt yeni başladı", ortalama yalnız gerçek
    kayıttan "N gün" ibresiyle). Mock testten geçti (mutlu yol + arıza
    yolu + sızıntı taraması 0). AÇIK KALAN: lisansın girişli
    ekrandan kesin teyidi + deploy hook (opsiyonel) kullanıcıda; EPİAŞ
    setinde Fırat-Dicle, Konya Kapalı vb. 8 havza YOK (kaynak vermiyor —
    kapsam şerhi sayfada), Ceyhan/Asi bugün 0 kayıt döndü (izlenecek). İlk çekim sonrası: EPİAŞ havza adları ↔ site havza
    eşleşmesi gözden geçirilecek (Fırat-Dicle gibi bileşik adlar).
30. HENDEK FAZ 1-B — GRACE "su nabzı" — ÇALIŞIYOR (2026-07-16): GSFC
    mascon (açık, tokensız — Earthdata GEREKMEDİ, test kanıtlı) 530MB
    indirildi, 25 havza + ülke serisi çıkarıldı (254 gerçek ay,
    2017-18 boşluğu dolgusuz), havza sayfalarında "su depolaması
    eğilimi" göstergesi (son 5 yıl eğimi, "N gerçek aydan" ibresiyle).
    Haftalık cron Pzt 06:00 UTC + deploy hook. VARSAYIM DÜZELTMESİ
    (raporlandı): GRACE yeraltı suyu değil TOPLAM su depolaması (YAS +
    toprak nemi + kar + yüzey suyu) değişimi verir — site dili buna
    göre "su depolaması eğilimi"; 0,25° çözünürlük UNL görsel ürünüydü,
    sayısal mascon ~3° — "havza yaklaşık" şerhi sayfada.
31. GRACE TAM DEĞİŞİM HARİTASI (MapLibre) — AYRI İŞ (FAZ 1-B kapsamı
    dışında bırakıldı): "su nerede azalıyor/artıyor" interaktif harita
    + menü/landing tek satır canlı gösterge (SIRADAKILER 27a) —
    data/canli/grace-havza.json hazır, harita işi onayla başlar.
32. HENDEK FAZ 2 — il rejimi aracı + programatik il sayfaları — YAPILDI
    (2026-07-16): TEK üretici (src/data/il-profil.js) → /arac/il-rejimi/
    (JS'siz çekirdek: 81 statik linke düşer; JS'le panel + ?il= paylaşım)
    + /kuyu-ruhsati/[il]/ 81 sayfa + indeks. İnce içerik eşiği 81/81
    geçti (dürüst denetim: 14×3, 43×4, 24×5 unsur); genel süreç
    kopyalanmadı (kontrol: 0 ihlal, ana rehbere link); uydurma kontrolü
    5 örnek ilde temiz; JSON-LD 330 nesne geçerli; sitemap yalnız
    üretilen sayfaları içeriyor (81+2). GRACE eğim hesabı tek bakım
    noktasına alındı (grace-hesap.js — 3 kopya tekilleşti). Görsel
    onay: il-konya/il-bolu/arac-*.png. Not: baraj/GRACE verisi cron'la
    güncellendikçe il sayfaları da sonraki build'de tazelenir.
33. TASARIM ANAYASASI FAZ 0 — SÜPERSEDE (madde 34 ile tekilleştirildi):
    DESIGN.md 2.0 önerisi, madde 34 "YÖN YÜKSELTMESİ — SU-DİLİ FAZ 0"
    ile DESIGN.md 3.0'a yükseltilip ONAYLANDI ("bu dil, devam"). Bu
    madde artık madde 34'e bağlıdır; tek geçerli tasarım onayı 34'tedir.
    Kapatıldı. Tarihsel not:
    [ESKİ] KULLANICI ONAYI BEKLİYOR (2026-07-16):
    DESIGN.md 2.0 yazıldı (üç font hiyerarşisi: Cormorant + Manrope +
    IBM Plex Mono; kicker sistemi; 6 kart ton ailesi — düz ton kararı;
    easing/durum sözlüğü; veri bandı dili; iki hız sınıfı; 11 maddelik
    başarısızlık listesi; akuamarin çift-ton kuralı #4FC3D0/#0F7A8A).
    Örnek sayfa /stil-pilot/ canlıda (noindex, sitemap dışı) — kuyu
    ruhsatı rehberi yeni dille. ONAY KAPISI: kullanıcı canlıda "bu dil,
    devam" demeden FAZ 1 (toplu giydirme), FAZ 2 (menü), FAZ 3 (deneyim
    sahnesi) BAŞLAMAZ.
34. YÖN YÜKSELTMESİ — SU-DİLİ FAZ 0 — ONAYLANDI (2026-07-16;
    Varyant A + iç sayfa dili "bu dil, devam"): DESIGN.md 3.0 su-dili
    anayasası (derinlik skalası HEDEF'ten örneklenmiş — kıyas kayıtlı:
    petrol skalası kazandı, akuamarin/gece-lacivert elendi; 4 akış
    eğrisi; ışık kırılması vurgusu; kot cetveli ölçüm esteti; TEK MOD
    kararı gerekçeli; mobil birinci sınıf). /stil-pilot/ v3 skalasına
    güncellendi. /harita-stil/ (varyant A: sol üst dikey) +
    /harita-stil/b/ (alt kenar yatay) kuruldu — HEDEF sahnelemesi
    (retina 1x/2x, AVIF/WebP/JPEG, LQIP blur-up, mobilde Türkiye
    merkezde, menü renkleri görselden örnekli + AA kanıtlı, overlay
    menü çalışır). ONAY: kullanıcı canlıda (1) iç sayfa dili
    /stil-pilot/, (2) menü varyantı A mı B mi — ikisini birden
    bildirmeden FAZ 1-2-3 başlamaz.
35. WebGL DENEYİM SAHNESİ — RAFTA (yön yükseltmesi kararı, 2026-07-16):
    canlı su sahnesi iptal değil ertelendi; öncelik su-dili + HEDEF
    sahnelemesi. Kullanıcı isterse ayrı brief'le döner.
36. SU-DİLİ FAZ 1 — TÜM İŞ SAYFALARI GİYDİRİLDİ — KULLANICI ONAYI
    BEKLİYOR (2026-07-17): 5 tür, 5 ayrı commit (FAZ1-a..e): çekirdek+
    indeksler / 9 rehber / 25 havza / 81 il+indeks / araç+hakkında+
    su-kanunu. Kicker sistemi, derinlik skalası, su-ivmesi easing'leri,
    kırılma vurgusu, kot-cetvelli veri bandları, kart aileleri, tanımlı
    hover/focus/press her türde; içerik/veri/URL/JSON-LD değişmedi.
    Görsel slot sözleşmesi: src/data/gorseller.js (rehber-hero /
    havza-kart-zemini / bolum-vinyeti) — Midjourney görselleri gelince
    TEK config değişimiyle oturur; şimdilik skala-degrade placeholder.
    Denetimde yakalanıp düzeltilen: çifte hero bandı, scrim z-katmanı,
    mobil nav hedefleri 26→45px, soluk metin kontrastı 4.42→4.85 (AA).
    Kanıt: konsol 0, kırık link 0/124, Lighthouse il 100/100/100/100 +
    rehber 97/100, görüntüler cikti/faz1/ (masaüstü 9 + mobil 4 tür).
    Kullanıcı canlı turu sonrası: FAZ 2 (menü) + /harita-stil/ taşıma
    kararı birlikte.
37. CC ROOT'TAN SUHA'YA TAŞINDI — YAPILDI (2026-07-17): proje
    /home/suha/projeler/suharitasi (mv+chown, güvenlik: /root izolasyonu
    korundu), suha kullanıcısı + sudo + SSH, CC 2.1.212 bypassPermissions
    (agresif mod fiili test edildi), MCP Playwright çalışır, cron suha'ya
    taşındı (root boş), git credential store (token URL'den çıkarıldı).
    Arşiv 26 değişmez varlık birebir sha256. AÇIK: sızan eski GitHub PAT
    kullanıcı tarafından İPTAL+YENİLENMELİ (transkriptte göründü).
38. SUNUM REFORMU FAZ 0+1 — YAPILDI (2026-07-20): üç temsilci sayfa
    teşhisi (B1-B17, K1-K4; kanıt cikti/denetim/faz0/) + DESIGN.md §17
    "Sayfa Mimarisi" (3-saniye, katmanlı sunum, veri kahraman, kart
    dili, mobil-öncelik, SU-DİLİ uyumu). Kullanıcı ilke onayı verildi.
39. SUNUM REFORMU FAZ 2a — HAVZA KALIBI PİLOTU (Sakarya) — TAMAM
    (kullanıcı canlı onayı 2026-07-21, GUNLUK KAPANIŞ; Sakarya kalip:2
    canlıda curl'la doğrulandı — zincirin ilk halkası): kalip:2 frontmatter kapısı (yalnız
    Sakarya; 24 havza + diğer sayfalar bit-değişmedi, curl kanıtlı).
    HavzaKahraman bandı (6,01 km³/yıl + YAS rezervi + GRACE ↓azalma +
    59-ay sparkline + künye) + Katman bileşeni (native details, JS 0,
    7 katman varsayılan kapalı; --e-suzul 420ms açılış, reduced-motion
    korumalı). Çifte özet kaldırıldı (ozet yalnız meta/kartlarda).
    Metrikler: masaüstü 6,0→2,1 ekran; 375px 10,7→3,2; ilk ekran görsel
    öğe 0→2 (büyük değer + sparkline). Lighthouse 96/100/100/100.
    GEO kanıtı: öz-cevap + FAQPage JSON-LD + katman içi tam metin
    curl'la JS'siz doğrulandı. Kanıt: cikti/denetim/faz2/ (AB-* yan
    yana dahil). Mobil menü dar-şerit yalnız MOCK (koda girmedi;
    faz2-sakarya-mobil-menumock.jpeg) — menü reformu üç kalıp onayı
    sonrası ayrı site-geneli adım. ONAY SONRASI: rehber + vaka kalıbı
    pilotları (kullanıcı onayı gelmeden BAŞLANMAZ). → Onay geldi
    (2026-07-21); 2b+2c pilotları yapıldı (madde 40-41).
40. SUNUM REFORMU FAZ 2b — REHBER KALIBI PİLOTU (kuyu-ruhsati) —
    TAMAM (kullanıcı canlı onayı 2026-07-21): kalip:2 kapısı (yalnız
    kuyu-ruhsati; diğer 8 rehber DOM-eşit — tek fark görünmez scoped-css
    kimlik attribute'u; 25 havza + tüm diğer sayfalar bit-eşit). İlk
    ekran: 280-cevap + "bu rehber ne çözer" (frontmatter cozer, damıtık)
    + içindekiler kartları (başlıklardan otomatik, BÖLÜM sayacıyla aynı
    numara). Katmanlar (varsayılan kapalı): madde metinleri + 81-il
    tablosu. Başvuru akışı tablosu → 4 numaralı adım kartı (dikey ray;
    hücre metinleri birebir korundu). Giriş koreografisi: .gk sıralı
    fadeUp 100ms kademe, --e-suzul, reduced-motion/print korumalı;
    başlık bloğu LCP için gizlenmeden süzülür. Belge tablosu kendi
    kabında kayar (375px gövde taşması 0). Metrikler: masaüstü 12,8→6,0
    ekran; 375px 22,9→9,4; ilk ekran görsel öğe 0→3; kesintisiz metin
    17→7 satır. Lighthouse 94/100/100/100 (pilot dışı referans 96).
    GEO: 280-cevap + Article JSON-LD + madde/il/adım tam metinleri
    curl'la JS'siz DOM'da doğrulandı. Kanıt: cikti/denetim/faz2/faz2b-*.
41. SUNUM REFORMU FAZ 2c — VAKA KALIBI PİLOTU (/vaka/meysu/) —
    TAMAM (kullanıcı canlı onayı 2026-07-21): yol teyidi — sayfa
    /vaka/meysu/ (brief'teki "meysu-su-guvensi" değil; slug dosya
    adından). B17 gereği içerik KISALTILMADI (görünür kelime 226→257):
    sahne eklendi. Kahraman stat kartları ilk ekranda (3.395,33 ha /
    2056 / 3 bildirim — frontmatter kahraman alanı, her değer KAP
    1604957 künyeli; <4 nokta → grafik değil stat kartı, dataviz
    eşiği). Olay akışı → dikey zaman çizgisi (su-degrade şerit + tarih
    düğümleri; son düğüm dolu = sonuç). Üçlü özet tekilleşti: görünür
    tek özet öz-cevap (ozet meta/listede; gövde paragrafı özet değil,
    akış girişi — aynen durur). Giriş koreografisi 2b ile aynı sözlük.
    Metrikler: ilk ekran görsel öğe 0→4 (masaüstü); kesintisiz metin
    15→10; mobil 3,9→4,4 ekran (sahne eklendi, içerik korundu).
    Lighthouse 100/100/100/100. GEO: öz-cevap + Article JSON-LD +
    olay/kahraman tam metinleri curl'la JS'siz doğrulandı. Pilot
    izolasyonu: bit düzeyinde tek değişen sayfa /vaka/meysu/. Kanıt:
    cikti/denetim/faz2/faz2c-*. Not: kalıpların koreografi/katman CSS'i
    yayılım fazında tekilleştirilecek (şimdilik pilot-başına scoped).
42. SİTE-GENELİ MOBİL MENÜ REFORMU (FAZ A-ÖN + FAZ A) — TAMAM
    (2026-07-21: push d2fea9d..fd4ec5e canlı, kullanıcı canlı onayı):
    (a) FAZ A-ÖN: landing header'ı tek kaynağa alındı (UstMenu tema
    varyantı aydinlik/koyu; landing src/pages/index.astro'ya taşındı,
    eski statik arsiv/landing-statik/). Görsel birebir: pixelmatch
    %0,000 (1440+375), computed birebir, canlı↔yerel SEO/GEO eşit.
    (b) FAZ A: mock'tan dar şerit — ≤640px'te marka+MENÜ, kapalı işgal
    içerik 226,4→85,8px / landing 104,6→84,8px (hedef 85±4); linkler
    DOM'da kalır (JS'siz crawl), panel=TamEkranMenu, yeni JS 0 bayt.
    Denetimin yakaladığı CANLIDA DA VAR hata düzeltildi: landing <main>
    nav tıklamalarını yutuyordu (masaüstü 5/5 link engelliydi) →
    header.koyu z-index (görsel fark 0 piksel). Lighthouse sakarya
    4×100, kuyu-ruhsati medyan 96 (A/B gürültü kanıtlı). Kanıt:
    cikti/denetim/faz-a-on/ + cikti/denetim/menu/ (RAPOR.md'ler).
    Push yapıldı, canlı onaylandı; Cloudflare cache purge gerekirse
    kullanıcı panelden yapar (otomasyon yok). Gerçek iOS Safari testi
    kullanıcıda (emülasyon şerhi).
43. FAZ 3 — /HARİTA/ CANLI VERİ PANELİ — TAMAM (2026-07-21: push
    d2fea9d..fd4ec5e canlı, kullanıcı canlı onayı): hero altında 25 havza kartı (HavzaPaneli,
    build-time statik, çalışma anı JS 0); GRACE eğimine göre sıralı, eşik
    A ≤-1,5 (5 kritik: Asi, Fırat-Dicle, Van Gölü, Ceyhan, Seyhan; onaylı),
    mobil iki kolon (onaylı), YAS rezerv havza-bazlı teyitli. Hero pixel
    %0,000 değişmedi (1440+375); Lighthouse medyan 74→75; 25 kart→25
    benzersiz link 0 kırık; düz-çizgi kuralı sentetik+gerçek seriyle
    kanıtlı; konsol 0, taşma 0. Bilinçli sapmalar raporda (yön dili tek
    bakım noktası; tr-TR yuvarlama). Kanıt: cikti/denetim/faz3/RAPOR.md.

K1 — GIT/LOG HİJYENİ (2026-07-25). Uygulandı, main'de (9f68604). Canlı
doğrulama açık:

- [ ] K1 canlı doğrulama (Faz D). Bir sonraki pipeline koşumundan sonra:
      koşum başarılı mı, log'da pull hatası var mı, commit atıldı mı,
      push geçti mi, log'larda kayıp var mı. Bu kontrol yapılana kadar
      K1 "doğrulandı" SAYILMAZ. Yedek: ~/yedek/k1-log-*

- [ ] K1 kapsam dışı bulgular: kilit/yarım dosya riski (B1.8a),
      site-saglik karışık commit/revert kapsamı (B1.8b), grace
      dosya-dosya add kırılganlığı.

- [ ] Arşiv log'larının git dışı yedeği. YOL A sonrası 13 log dosyası
      yalnız sunucu diskinde. rsync/ayrı repo/nesne depolama değerlendir.
      ACİLİYET ARTTI: merge sırasında git 13 log'u diskten sildi (yedekten
      geri kondu) — tek kopya riski somut.

- [ ] Yabancı worktree: /tmp/claude-1000/.../scratchpad/wt-base
      (d2fea9d, detached HEAD). Kapsam dışı bırakıldı, karar bekliyor.

- [ ] K1 scratch dizinleri /tmp/k1-test ve /tmp/k1-test-onceki-tur silinmedi
      (rm izin kuralıyla engelli). Zararsız, /tmp yeniden başlatmada temizlenir.

DÖNÜŞÜM SEANSI (26 Tem 2026) — dal `donusum-2026-07-26`, worktree
`../suharitasi-donusum`. Kullanıcı incelemesi bekliyor, main'e MERGE EDİLMEDİ.

- [ ] ANALİTİK KURULUMU — Cloudflare Web Analytics (ücretsiz, site Pages'te,
      panelden tek tık). KULLANICI PANEL İŞİ. Bu yapılana kadar 5 [VARSAYIM]
      önerisi ve tüm dönüşüm ölçümü askıda. Plausible/Umami barındırılan
      sürümleri ücretli olduğu için elendi.
- [ ] Cloudflare zone analitiği açık mı — panelden doğrulanmalı (istek/yol
      verir, davranış ölçmez).
- [ ] Dönüşüm SINIF C ([VARSAYIM], analitik verisi geldikten sonra):
      · #17 ana sayfa H1 çerçeve tartışması (kategori mi, ses mi)
      · #18 persona derinliği vs sayısı (471 kelime yeterli mi)
      · #19 persona × il kesişim sayfaları
      · #20 sektör ikonları (görsel onayı gerekli)
      · #21 öz-cevap altı görüş satırı
- [ ] Dönüşüm SINIF B (durak): #14 rehber süreç şeması ve #15 havza küçük
      haritaları — YENİ GÖRSEL ÜRETİMİ gerektiriyor, referans görsel onayı
      şart (askı yalnız 26 Tem brief'i için geçerliydi).
- [ ] K2 düzeltmesi: GRACE eşiği 192 saat → aylık + 40-60 gün gecikmeye uygun
      değer · sonBasariliKosu kısır döngüsü (site-saglik.mjs:769 — yalnız
      kırmızısız koşumda güncelliyor, md10 kırmızı kaldıkça alan 24 Tem
      07:33'te donmuş, bekçinin f kalemi 14 saat eşiğini her gün aşıyor,
      UYARI-SAGLIK.md her 07:00'de yeniden yazılıyor, silme yalnız "hiç sorun
      yok" dalında olduğu için asla temizlenmiyor) · md10'un baraj.json kalemi
      bekçiyle tam mükerrer (48s vs 26s, bekçi her zaman önce ateşliyor).
- [ ] K2 önerileri (uygulanmadı, aynen): (1) md10 GRACE kalemini kaynak
      tazeliğine çevir, mtime'ı bırak · (2) md10 baraj kalemini kaldır ya da
      bekçiyle eşitle · (3) sonBasariliKosu'nu "koştu" / "temiz koştu" diye
      ikiye ayır · (4) GRACE URL'ini üç yerden tek yere indir · (5) SMTP
      eksikliği ayrı kalem olarak izlensin.
- [ ] SMTP dört değişkeni eksik → alarm e-postası kapalı
      (sonBildirim.mail.gonderildi=false).
- [ ] grace/cron.log tutarsızlığı DENETLENEMEDİ: 23 Tem 18:53'te yaratılmış,
      tek satır içeriyor, ama o koşum olsaydı durum.json yeniden yazılırdı
      (mtime hâlâ 20 Tem 06:00). "GRACE cron'u en son ne zaman koştu" tek
      kaynaktan cevaplanamıyor.
- [ ] F4-4 riski yapısal olarak duruyor: GRACE URL'i üç yerde sabit kodlu,
      dönem alanı değişirse sessiz ölür. Tetiklenmemiş. Sınır: yalnız dönem
      alanı yoklandı; sürüm etiketi (rl06v2.0, obp-ice6gd) değişmiş bir yayın
      olasılığı DENETLENEMEDİ.
- [ ] K1 sonrası script tutarsızlığı: baraj (PUSH_HATA=1) ve su-izleme
      (PUSH_ERTELENDI=1) push ertelenince exit≠0 dönüyor, grace dönmüyor.
      "Ertelendi" hata değil geçici durum.
- [ ] /tmp/k1-test · /tmp/k1-test-onceki-tur · /tmp/skill-tarama temizliği.
- [ ] Yabancı worktree: /tmp/claude-1000/.../scratchpad/wt-base (d2fea9d,
      detached HEAD).
- [ ] www.suharitasi.com 522 bulgusu — tek ölçüme dayanıyor, bağımsız
      kontrolde üretilemedi, üç kez tekrar ölçülmeli.
- [ ] robots.txt AI botları: Cloudflare "Managed Content" bloğu ClaudeBot/
      GPTBot/PerplexityBot'u engelliyor olabilir — panelden doğrulanmalı.
      GEO stratejisinin ön koşulu.
- [x] Dönüşüm TUR 2 (26 Tem 2026, gece) — SINIF A'da kalan 9 maddenin 8'i
      ele alındı, 6'sı UYGULANDI: #2 ana sayfa Organization+Person (`c91aa57`) ·
      #6 soru-başlıkları, 85 tanım / 458 başlık / 161 sayfa (`e74f540`) ·
      #7 robots.txt Tier-1 botları (`f71f490`) · #8 9 hub sayfasına öz-cevap
      (`5a14a15`) · #10 llms.txt build üreticisi (`16fde8d`) · #12 ana sayfa
      öz-cevabına somut sayılar (`0a84dd4`) · #13 HowTo şeması (`0f3e00e`).
      KULLANICI GÖRSEL/UI ONAYI ALINDI (26 Tem 2026). Dal push edildi;
      main'e merge EDİLMEDİ → canlıda değil.
- [ ] #1 `sameAs` — SINIF B (B-2). **Kullanıcıdan gerçek profil adresi
      gerekiyor:** LinkedIn (kişisel/büro), X, Google Business Profile, baro
      levhası sayfası, Wikidata, YouTube. M8 gereği hiçbiri uydurulmadı, alan
      hiç yazılmadı. 2-3 gerçek URL yeterli. Organization `logo` alanı da aynı
      sebeple boş (gerçek logo dosyası yok).
- [ ] #6'nın `/rehberler/kuyu-ruhsati/` kısmı — SINIF B (B-7). Kalıp-2
      "İçindekiler" menüsü başlık metnini `<h2>` dışında tekrar bastığı için
      başlık değişince 9 gövde kelimesi kayboluyor; mekanik M6 kuralı gereği
      geri alındı. **Kullanıcı kararı gerekli:** içindekiler başlıktan
      türediği için bu "gövde değişikliği" sayılmalı mı? Sayılmazsa tek
      komutla uygulanır.
- [x] ÖDÜL-ÜSTÜ TURU (26 Tem 2026, sabah) — 9 skill uygulandı, 7 commit.
      Görünür breadcrumb 0→170 sayfa (`b42c46f`) · menü niyet-önce + Kuyu
      Ruhsatı kapısı (`e8191dd`) · footer "Ne yapmam gerekiyor" sütunu
      (`157af82`) · robots.txt Tier-2 tamam + Bytespider engeli (`0665aa4`) ·
      persona operasyonel sonraki adım (`4e29078`) · il kardeş bağları
      (`0212d30`) · havza kardeş bağları (`423f4af`).
      `/kuyu-ruhsati/` iç link 1→82. Küme yatay bağı: havza 0/25→25/25,
      il 0/81→76/81. LH erişilebilirlik 100 (3 tur medyan).
      KULLANICI GÖRSEL/UI ONAYI ALINDI (26 Tem 2026). Dal push edildi;
      main'e merge EDİLMEDİ → canlıda değil.
- [ ] ÖDÜL-ÜSTÜ tripwire (Sharp uyarısı): analitik kurulduktan SONRA
      `/harita/` ve `/havzalar/` organik girişi düşerse menü sırası geri
      alınır. Şu an ölçülemez (madde 0 açık).
- [x] CCBot ENGELLENDİ (26 Tem 2026 kullanıcı kararı, `7ced41d`). Tier-1
      canlı AI arama botları (GPTBot, OAI-SearchBot, ClaudeBot,
      PerplexityBot, Google-Extended) açık kaldı.
- [ ] Lighthouse PERFORMANS yeniden ölçülmedi (bu turda yalnız erişilebilirlik).
      Ortalama sayfa ağırlığı 24,1 → 26,9 KB (+%11,6): breadcrumb + footer
      sütunu + kardeş bağları. Canlıya çıkınca LH perf tabanı doğrulanmalı.
- [x] Handley önerisi UYGULANDI (26 Tem 2026, `8b90a36`): menü öğeleri
      okuyucunun sorusunu söylüyor, bölüm adı mono etiket olarak bağlantı
      içinde korundu (çapa metni + taranabilirlik + M6 üçü de bozulmadı).
      Ölçüm gereği menü ölçeği ve öğe aralığı daraltıldı — masaüstü menüsü
      1058 px'e çıkıp kaydırma gerektiriyordu, şimdi 900/900.
- [x] #6'nın `/rehberler/kuyu-ruhsati/` kısmı UYGULANDI (`5bbc85e`) —
      görsel/UI onayı bu engeli kaldırdı. İçindekiler menüsündeki 9 eski
      başlık kelimesi bilerek düştü, gövde paragrafları değişmedi.
- [x] MERGE + CANLI YAYIN TAMAM (26 Tem 2026, `9851b2a`). 27 commit main'e
      birleşti, push edildi, Cloudflare Pages dağıttı. Canlı doğrulama:
      surum.json 9851b2a · robots/sitemap/llms.txt 200 ·
      `site-saglik --hizli` GENEL YESIL (6/6, 6 sahne oynuyor, konsol 0).
- [ ] REFERANS GÖRSEL TURU YAPILDI — **KULLANICI SEÇİMİ BEKLİYOR**
      (26 Tem 2026). Kıyas sayfası: `cikti/denetim/referans-gorsel/index.html`
      (kareler: kare-d3.png · kare-d2.png · kare-d4.png).
      **D3-A SEÇİLDİ VE UYGULANDI** (26 Tem 2026) — 25/25 havzada
      konumlandırıcı basıyor, altyazı "havza sınırı değildir" diyor,
      LH erişilebilirlik 100, SVG 5,4 KB.
      **D2-A (sütunlu ray) ve D4-A (NACE sigili) hâlâ SEÇİM BEKLİYOR.**
      · Üretici: `arac/referans-havza-harita.mjs` (build'e bağlı DEĞİL).
      · Ölçülmüş kısıt: #0C5A7C ile #2E7EA0 yan yana iki veri kategorisi
        OLAMAZ (dataviz doğrulayıcı, normal görüş ΔE 11,8 / eşik 15).
      · Higgsfield referans alınmadı: ev estetiği siyah zemin + lime aksan +
        sinematik AI görsel; site light-only krem/lacivert ve JS~0. Gerekçe
        ilerleme dosyasında.
- [ ] D3 VERİ AÇIĞI: depoda **havza sınır geometrisi yok**. Referans yönler
      havzanın kapsadığı İLLERİ boyuyor ve etiketi bunu söylüyor. Gerçek
      sınır isteniyorsa DSİ/SYGM geometrisi + lisans sorusu ayrı iş.
- [x] D3-A 25 havzanın hepsinde doğrulandı. En küçük kapsam Akarçay (2 il)
      ve okunur çıkıyor — "nokta gibi kalır" endişesi gerçekleşmedi.
- [ ] Sakarya (tek kalıp-2 havzası) sayfasında harita `<details>` katmanı
      içinde kapalı geliyor; diğer 24'te doğrudan görünür. Künye bloğuna
      (ilk ekran) taşınsın mı — karar.
- [x] #11 rehber → il/persona bağlam linki — TAMAMLANDI (`fb27d9d`).
      B3 (rehber → il) zaten karşılanmıştı: `/rehberler/kuyu-ruhsati/` 81 il
      sayfasına link veriyor. C2 (rehber → persona) uygulandı: 0 → 13 link,
      8 rehberde. Eşleşme elle yazılmadı, `persona.json`'daki `ilgiliIcerik`
      alanı tersine çevrilerek türetildi. Öz-denetim: 7 sayfa, konsol 0,
      113 tekil link 0 kırık. KULLANICI ONAYI BEKLİYOR.
- [ ] #11 görünüm kararı: persona satırı "Sonraki adım" kutusunun altında
      ince ayraçla, 0,9rem ikincil metin. Ana çağrı hiyerarşisini bozmasın
      diye bilinçli ikincil. Daha belirgin istenirse tek satır değişiklik.
- [ ] Ana sayfa (`/`) tarayıcı öz-denetimine alınamıyor: menü düğmesi
      kaydırma-sahnesi yüzünden ilk ekranda görünmez, `arac/oz-denetim.mjs`
      etkileşim adımı 30 sn'de zaman aşımına uğruyor. Araç ana sayfa için
      kaydırma-önce-tıkla adımı istiyor. Madde 11'den önce de böyleydi.
