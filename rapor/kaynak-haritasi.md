# KAYNAK HARİTASI — Su Verisi Kaynak Keşfi (HENDEK FAZ 0)

*Denetim tarihi: 15 Temmuz 2026. Yöntem: her kaynak bu sunucudan (Hetzner DE,
çıkış IP 89.167.42.221 — TR dışı) `curl` ile fiilen test edildi; HTTP kodu ve
örnek kayıt kanıtı olmayan hiçbir kaynak "erişilir" sayılmadı. Salt araştırma —
kod/site değişikliği yok, hiçbir servise kayıt/abonelik başlatılmadı.*

**Kritik genel bulgu:** "gov.tr = yurt dışına kapalı" varsayımı YANLIŞ çıktı.
dsi.gov.tr, cdniys.tarimorman.gov.tr (DSİ dosya CDN'i), tarimorman.gov.tr/SYGM,
mgm.gov.tr, eticaret.mta.gov.tr, yerbilimleri.mta.gov.tr bu sunucudan tam
erişilir. Gerçek engelliler: İSKİ (tüm hostlar), DSİ doluluk portalı
(yagisbarajdoluluk), mta.gov.tr ana site, geodata.tarimorman.gov.tr, TÜİK veri
API'si (403), veri.gov.tr, BUSKİ, acikveri.ankara.bel.tr.

---

## TABLO 1 — Baraj/hazne doluluk (canlı/periyodik)

| Kaynak | URL | Yıl aralığı / son veri | Kapsam | Format | Lisans | TR-IP | Erişim testi (2026-07-15) | Uygunluk |
|---|---|---|---|---|---|---|---|---|
| DSİ doluluk portalı | yagisbarajdoluluk.dsi.gov.tr | doğrulanamadı | Tüm DSİ barajları (iddia) | — | Kamu | **Engelli** | **000** (45 sn timeout; WebFetch de ECONNREFUSED). Arşiv derinliği doğrulanamadı | Resmî ana kaynak ama bu sunucudan kullanılamaz — TR-IP gerekli |
| DSİ bölge müdürlükleri | bolge01/03/14/26.dsi.gov.tr | — | — | HTML | Kamu | Açık | 200 (4/4) ama anasayfalarda doluluk sayfası bulunamadı | Doluluk için verimsiz |
| **EPİAŞ Şeffaflık** | seffaflik.epias.com.tr (API: `electricity-service/v1/dams/data/active-fullness`) | **30.10.2018 → bugün, günlük**; "limitsiz tarihsel veri, ücretsiz" (EPİAŞ SSS) | Enerji barajları (DSİ bildirimi): kot, aktif doluluk %, hacim, enerjik karşılık | JSON API | Ücretsiz, kayıt şart | Site açık; API kayıt+oturum (TGT) ister | Site 200; API **401 AUTH002** — gövdede `clientIp: 89.167.42.221` görüldü (uç canlı, oturum yok). Kayıt başlatılmadı | **En sağlam resmî+canlı+arşivli yol.** Tek bedel: ücretsiz kayıt (+ web servis için Yardım Masası'na IP bildirimi) |
| İSKİ | iski.istanbul, iski.gov.tr, api.iski.istanbul, grafikgoster.iski.gov.tr | doğrulanamadı | İstanbul 10 baraj | — | — | **Engelli** | **000** (5 host, tekrar denendi). e-Devlet sayfası 200 ama login duvarı | TR-IP gerekli |
| **İBB Açık Veri (İSKİ arşivi)** | data.ibb.gov.tr — dataset `istanbul-barajlari-gunluk-doluluk-oranlari` | **2000-10-23 → 2024-02-19** (8.520 kayıt, günlük) — **Mart 2024'ten beri güncellenmiyor** | İstanbul 10 baraj | XLSX + CKAN datastore JSON | İBB Açık Veri Lisansı | Açık | **200**; örnek son kayıt: `2024-02-19, Ömerli 0.8868` | En derin AÇIK tarihsel arşiv; canlı değil. 24 yıllık seri trend analizi için altın |
| ASKİ (Ankara) | aski.gov.tr/tr/Baraj.aspx | Sayfada 13.07.2026 tarihi | Ankara toplam+aktif doluluk | HTML+AJAX JSON | Kamu | Kısmi | HTML 200; JSON ucu `Baraj.aspx/Counter1` bu sunucudan **404** (GitHub Actions'tan çalıştığı biliniyor). Ayna: `13.07.2026 toplam %46.36, aktif %40.11` | Doğrudan çekim güvenilmez; GitHub aynası üzerinden alınabilir |
| GitHub arşiv: SkywaterBrown/Ankara-Baraj-Doluluk | github.com (raw) | 2026-05-15 → bugün, 8 saatte bir | Ankara (ASKİ) | JSON | Repo lisansına bakılmalı | Açık | raw erişim 200 | Ankara için pratik köprü |
| İzmir Açık Veri | acikveri.bizizmir.com — dataset `barajlarin-doluluk-oranlari` | Anlık kesit; son güncelleme **2026-04-14 (3 ay bayat)** | İzmir 5 baraj + koordinat + kapasite | CSV + CKAN JSON | Açık veri | Açık | **200**; örnek: `Tahtalı Barajı, DOLULUK_ORANI 53.04, DURUM_TARIHI 2026-04-13` | Yapısal olarak en temiz uç ama bakımsız; tarihsel seri yok |
| İZSU resmî API | openapi.izmir.bel.tr/api/izsu/barajdurum | — | İzmir | JSON | Açık | Uç var, bozuk | **500** (2 deneme): `{"message":"Unexpected error"}` | İzlemeye değer; şu an kullanılamaz |
| MUSKİ (Muğla) | muski.gov.tr/baraj-doluluk-orani | Son güncelleme **13.11.2025 (8 ay bayat)** | Muğla barajları | HTML | Kamu | Açık | **200**; örnek: `Marmaris Atatürk Barajı %92` | Bayat; düşük öncelik |
| ASAT / KOSKİ / ESKİ(Erzurum) / SASKİ | çeşitli | — | — | JS-render | — | Karışık | ASAT 200 ama veri JS'te, online.asat 000; KOSKİ 200 boş kabuk; ESKİ 200 JS; SASKİ'de sayfa yok | Headless render gerektirir; maliyetine değmez |
| BUSKİ (Bursa) | buski.gov.tr | — | — | — | — | **Engelli** | **000** (2 deneme) | TR-IP gerekli |
| veri.gov.tr (ulusal portal) | veri.gov.tr | — | — | — | — | **Engelli** | **000** (timeout ×2); Wayback'te en yakın snapshot 2018 | TR-IP gerekli; arşiv yolu da zayıf |
| acikveri.ankara.bel.tr | — | — | — | — | — | **Engelli** | **000**; seffaf.ankara.bel.tr 200 ama CKAN API 404 | TR-IP gerekli |
| **dolulukorani.com** (agregatör) | www.dolulukorani.com | Günlük; **14 Temmuz 2026 verisi görüldü** | 81 il (DSİ+belediye kaynaklı) | HTML (gömülü JSON) | Belirsiz (özel site) | Açık | **200**; örnek: `Ömerli fillRate:85; İstanbul %68.4, Ankara %34.2, İzmir %18.7` | Bu sunucudan canlı İstanbul verisine ulaşan tek pratik yol; ama üçüncü el — kaynak gösterimi/güvenilirlik sorunu |
| barajdolulukoranlari.com (agregatör) | barajdolulukoranlari.com | Temmuz 2026 | TR geneli + EPİAŞ verisi | HTML | Belirsiz | Açık | **200**; örnek: Türkiye geneli %70.8 | Yedek agregatör |
| turkiyebarajlar.com / barajdoluluk.com | — | — | — | — | — | — | **403** (bot koruması) / **522** (origin down) | Kullanılamaz |
| suyuizle (açık kaynak) | github.com/emrebaranarca/water-watch | — | 13+ şehir, günlük | Next.js + Val.town scraper | MIT | Açık | 200 (repo doğrulandı) | Scraper mimarisi örnek alınabilir |
| DSİ Tablo 4.7 (elimizde) | kaynak/dsi/4.7...xls | **2010–2024, havza bazında, yıllık** | 25 havza | XLS | Kamu istatistik | — | Yerelde mevcut | Yıllık havza doluluk serisinin temeli; canlı veriyle birleştirilecek |

**Arşiv sorusunun cevabı:** Yıllara yayılı açık doluluk arşivi üç yerde var:
İBB (2000–2024 günlük, kesilmiş), EPİAŞ (2018→bugün, kayıt şart), DSİ Tablo 4.7
(2010–2024 yıllık, elimizde). Bunun dışında kaynaklar yalnız anlık kesit yayımlıyor.

---

## TABLO 2 — Su miktarı/potansiyeli resmî istatistikleri (yıllık)

### 2a. DSİ Resmî Su Kaynakları İstatistikleri — yıl bazlı envanter

Seri **2014–2024 baskılarından** oluşuyor (DSİ duyuru belgesi
`istatistiki_duyurular_11_12_2025.docx` seriyi "2014-2015-...-2024" olarak
sayıyor; 2013 ayrı baskı değil, tabloların başlangıç yılı). **2025 baskısı
henüz yayımlanmadı** (Detay/2186 bugün hâlâ "2024 Yılı" başlıklı; 2024 baskısı
Aralık 2025'te çıktı → 2025 baskısı ~Aralık 2026 beklenir). 2026 baskısı yok.

| Baskı yılı | Sayfa | HTTP | Sayfa durumu | Dosya erişimi (cdniys CDN) | Kanıt (Tablo 1.2 xlsx) |
|---|---|---|---|---|---|
| 2014 | dsi.gov.tr/Sayfa/Detay/1347 | 200 | Sağlam, 20 xlsx | CANLI — `DosyaGaleri/883/` | 200, 35.937 B, PK imzası |
| 2015 | Detay/1338 | 200 | Sağlam, 20 xlsx | CANLI — `DosyaGaleri/866/` | 200, 36.238 B, PK |
| 2016 | Detay/1009 | 200 | Sayfadaki 42 link KIRIK (iç IP 10.10.1.31) | CANLI — arşivden kurtarılan `KonuIcerik/1009/1357/` | 200, 35.989 B, PK |
| 2017 | Detay/974 | 200 | 48 link kırık (iç IP) | CANLI — `KonuIcerik/974/1322/` | 200, 37.466 B, PK |
| 2018 | Detay/972 | 200 | 48 link kırık (iç IP) | CANLI — `KonuIcerik/972/1320/` | 200, 39.633 B, PK |
| 2019 | Detay/1344 | 200 | Sağlam, 28 dosya | CANLI — `KonuIcerik/1344/1697/` | 200, 40.702 B, PK |
| 2020 | Detay/1499 | 200 | İçerik boşaltılmış | CANLI — Wayback'ten (21.06.2022) kurtarılan `DosyaGaleri/2471/` hâlâ çalışıyor | 200, 41.732 B, PK |
| 2021 | Detay/1622 | 200 | İçerik boşaltılmış | **KURTARILAMADI** — Wayback'te snapshot yok, CDX'te dosya izi yok | availability API: boş |
| 2022 | Detay/1847 | 200 | İçerik boşaltılmış | **KURTARILAMADI** — tek snapshot (05.09.2025) da boş | 0 istatistik dosyası |
| 2023 | Detay/1916 | 200 | İçerik boşaltılmış | CANLI — Wayback'ten (15.02.2025) kurtarılan `DosyaGaleri/7072/` | 200, 45.560 B, PK |
| 2024 | Detay/2186 | 200 | SAĞLAM (güncel), 19+ xlsx `DosyaGaleri/8848/` | CANLI (elimizde: 1.2, 1.3, 1.5, 4.7) | 200, 46.249 B, PK |
| 2025 | — | — | **YAYIMLANMAMIŞ** (arandı + 2186 canlı içerik okundu) | — | — |
| 2026 | — | — | YOK | — | — |

Notlar:
- **2021–2022 müstakil tabloları internette yok** (ne canlı ne Wayback). Veri
  kaybı yok: 2023/2024 baskı tabloları kümülatif seri içeriyor (1.2/1.3:
  2013–2024; 1.5: 1995–2024).
- Wayback'te eski `dsi.gov.tr/dsi-resmi-istatistikler` sayfası 31.12.2012'ye
  kadar arşivli; 2013–2015 dönemi tabloları oradan iniyor (test: 200, 12.485 B,
  PK) — seri fiilen ~2012'ye uzatılabilir.
- **ACİL ARŞİV UYARISI:** 2016–2020 ve 2023 dosyaları "sayfasız/kırık linkli"
  ama CDN'de canlı. DSİ eski galerileri boşaltabiliyor (2021–2022 örneği) —
  kurtarılan cdniys URL'lerindeki tüm xlsx'ler bir sonraki oturumda yerel
  arşive (kaynak/dsi/) indirilmeli.

### 2b. Diğer resmî istatistik kaynakları

| Kaynak | URL | Yıl aralığı / son veri | Kapsam | Format | Lisans | TR-IP | Erişim testi | Uygunluk |
|---|---|---|---|---|---|---|---|---|
| DSİ faaliyet raporları | dsi.gov.tr/Sayfa/Detay/759 | **2005–2025 KESİNTİSİZ** (2025 raporu: 200, 9,5 MB — dosya adı `.dsi_2025_yili_idare_faaliyet_raporu.pdf`) | Su/baraj/sulama verisi, yıllık | PDF | Kamu | Açık | Test edilenler: 2005 (3,5 MB), 2015, 2019, 2023, 2024 (8,7 MB) hepsi 200 %PDF | 2021–2022 istatistik boşluğunun ikame kaynağı |
| SYGM Nehir Havza Yönetim Planları | tarimorman.gov.tr/SYGM Detay.aspx?SayfaId=49 | Plan bazlı (statik) | **12 havza, 56 PDF** (Akarçay, B.Akdeniz, Burdur, B.Menderes, Gediz, Konya, Kuzey Ege, K.Menderes, Meriç-Ergene, Sakarya, Susurluk, Yeşilırmak) | PDF | Kamu | Açık | Sakarya NHYP: 200, 23 MB; Akarçay: 200, 12,3 MB | Havza sayfalarının derin veri kaynağı |
| SYGM Kuraklık Yönetim Planları | SayfaId=61 | Plan bazlı | **~20 havza, 76 PDF** | PDF | Kamu | Açık | Konya KYP Cilt 3: 200, 28,3 MB | Risk katmanı için birincil |
| SYGM Sektörel Su Tahsis Planları | SayfaId=10 | 9 havza; 3'ü 2025 eklemesi (B.Akdeniz, B.Menderes, Kuzey Ege) | **9 havza, 20 PDF** (kararname + yönetici özeti) | PDF | Kamu | Açık | Konya özeti: 200, 10,2 MB; Kuzey Ege 2025: 200, 1,5 MB | **Havza tahsis boşluğunu kısmen kapatır** (KAYNAKLAR.md'de "tahsis verisi yok" kaydıyla birlikte okunmalı: ülke çapı tablo yok ama 9 havzanın planı var) |
| SYGM Havza Koruma Eylem Planları | SayfaId=6 | Plan bazlı | Sayfada 10 PDF; klasörde sayfada listelenmeyenler de var (Yeşilırmak, Kızılırmak, Konya: 206 %PDF) | PDF | Kamu | Açık | Sakarya HKEP: 200, ~290 MB | Elimizdeki 21/25 doğrulamasının üstüne klasör taraması eklenebilir |
| TÜİK su/çevre istatistikleri | veriportali.tuik.gov.tr (data.tuik.gov.tr buraya taşınmış) | Bilinen bültenler: Su-Atıksu **2020, 2022, 2024** (2024 yayını 09.12.2025 — basından teyit; içeriği test edilemedi) | Belediye/sanayi su göstergeleri | HTML/XLS | Kamu | **API engelli** | Kabuk 200; **veri API'si 403 Forbidden** (4 uç, headless konsolda kayıtlı) — bülten içeriği TR dışından fiilen alınamıyor | TR-IP gerekli; il bazlı belediye su verisi için tek resmî kaynak |
| TÜİK MEDAS | biruni.tuik.gov.tr/medas | — | — | Web uygulaması | Kamu | Belirsiz | Sayfa 200 (73 KB uygulama); veri sorgusu uçtan uca test edilmedi — "erişilir" denemez | Doğrulanmadı |
| MGM yağış/kuraklık | mgm.gov.tr | Yıllık alansal yağış PDF'leri en az 2015'e iner (2015-16: 200, 4,6 MB; 2023: 7,6 MB); 2025 iklim raporu: 200, 7,9 MB; aylık bültenler güncel (Ekim 2025: 5,3 MB) | TR geneli + havza yağışı + SPI kuraklık | PDF/HTML/PNG | Kamu | Açık | `yagis-raporu.aspx`, `havzalara-gore-yagis.aspx`, `kuraklik-analizi.aspx` hepsi 200 | Kuraklık/yağış bağlamı için tam açık |
| MGM MEVBİS (istasyon ham verisi) | mevbis.mgm.gov.tr | İstasyon serileri | Nokta ham veri | — | **Ücretli/üyelik — aday** | Açık (sayfa) | 200; kayıt başlatılmadı | Ücretsiz alternatif: ERA5 (CDS) |
| veri.gov.tr | — | — | — | — | — | **Engelli** | 000 ×2; Wayback zayıf (son 2018) | TR-IP gerekli |

---

## TABLO 3 — Yeraltı suyu / "nerede su çıkar" (hidrojeoloji)

### 3a. Yerli kaynaklar

| Kaynak | URL | Yıl aralığı | Kapsam / çözünürlük | Format | Lisans | TR-IP | Erişim testi | Uygunluk |
|---|---|---|---|---|---|---|---|---|
| DSİ YAS istatistikleri | dsi.gov.tr (Detay/754, /972, /1299, /1499, /1628) | Tablolar: beslenim/rezerv 2013–2024, işletme rezervi 1995–2024 (elimizde) | Havza/ova ölçeği tablo (TR toplamı: ~23 milyar m³ rezerv, 18 emniyetli, ~17 tahsisli) | HTML/XLSX/PDF | Kamu | **Açık** (beklenenin aksine) | Tüm sayfalar 200; cdniys CDN 200 (test PDF 989 KB indi) | Resmî rezerv rakamlarının omurgası |
| DSİ YAS işletme sahaları / kapalı saha ilanları | Resmî Gazete + bölge md. | Karar bazlı | Ova/saha | RG metni | Kamu | Açık | resmigazete.gov.tr **200**; konsolide açık liste BULUNAMADI | RG taramasıyla derlenebilir — başka yerde yok |
| MTA ana site | mta.gov.tr | — | — | — | — | **Engelli** | **000** (http+https+www) | TR-IP gerekli |
| MTA Yerbilimleri Görüntüleyici | yerbilimleri.mta.gov.tr | — | 1/25K–1/500K jeoloji | Web viewer | Görüntüleme serbest, indirme yok | Açık | **200** (başlık görüldü); `/arcgis/rest/services` **404** — makine-okur uç doğrulanamadı | Görsel referans; veri çekilemez |
| MTA E-Ticaret | eticaret.mta.gov.tr | Rapor arşivi 1935→güncel | İl/pafta jeoloji-hidrojeoloji haritaları; il hidrojeolojik etüt + DSİ sondaj profili raporları ("hidrojeoloji" aramasında Konya su sondaj profilleri, Akyazı, Şarkikaraağaç görüldü) | JPEG/vektör/PDF | **Ücretli — aday** (il 1/500K: 4.680 TL; 1/25K vektör pafta: 1.400 TL) | Açık | **200**, fiyatlar canlı görüldü | B2B rapor üretiminde nokta atışı derinlik için satın alma adayı; ücretsiz alternatif: WHYMAP + WISE |
| MGM (beslenim girdisi) | mgm.gov.tr | Normaller 1991–2020; SPI aylık | İl/ilçe | HTML/PNG | Kamu | Açık | 200 | YAS beslenim tahmini girdisi |
| TRGM CBS | geodata.tarimorman.gov.tr | — | — | WMS/REST | — | **Engelli** | **000** (https+http) — bilinen engel yeniden doğrulandı | TR-IP gerekli (havza geometrisi doğrulaması da buna bağlı — SIRADAKILER 12) |

### 3b. Uluslararası kaynaklar (TR-IP engeli yok)

| Kaynak | URL | Yıl aralığı | TR kapsamı / çözünürlük | Format | Erişim şartı | Erişim testi | Uygunluk |
|---|---|---|---|---|---|---|---|
| NASA GRACE/GRACE-FO (JPL mascon) | grace.jpl.nasa.gov, podaac.jpl.nasa.gov | **2002–2026** (2017-18 boşluk) | TR tam; 0,5° gride yazılmış **~3° gerçek çözünürlük (~300 km)** — il ayrımı YAPAMAZ | NetCDF | **Earthdata login şart** (ücretsiz; başlatılmadı) | Siteler 200; dosya indirme **401 → urs.earthdata.nasa.gov** (login kanıtı) | Havza/bölge ölçekli "yeraltı suyu azalıyor" anlatısı için |
| **GRACE-DA haftalık GWS (UNL)** | nasagrace.unl.edu/globaldata/ | **Haftalık, 2003-02-03 → 2026-07-13** (son dosya görüldü: `GRACE_GWS_AS_20260713.png/pdf`) | Asya haritası TR'yi içerir; 0,25° (~25 km) | PNG/PDF açık dizin (NetCDF yalnız ABD) | **Kayıtsız, tamamen açık** | **200** — dizin listelendi, son klasör kanıtlandı | Bugün kullanılabilir en pratik YAS kuraklık görseli |
| Copernicus Land | land.copernicus.eu | 2015→ | Yüzey suyu/Water Bodies 10–100 m; doğrudan YAS katmanı yok | GeoTIFF | Ücretsiz kayıt | 200 | Yüzey suyu tamamlayıcısı |
| Copernicus CDS (ERA5) | cds.climate.copernicus.eu | **1940–2026** | 0,25° yağış/toprak nemi/buharlaşma | NetCDF/GRIB, API | Ücretsiz CDS hesabı (başlatılmadı) | 200 | Beslenim modellemesi girdisi; MEVBİS'in ücretsiz alternatifi |
| **EEA WISE (EIONET)** | eea.europa.eu, water.europa.eu, sdi.eea.europa.eu | 2002–2025 (Water Quantity 2025 seti) | **TR yeraltı suyu kütlesi (groundwater body) POLİGONLARI VAR** — metadata XML'inde "Turkey" grep kanıtı | GDB/SHP/CSV | Açık (EEA standart, CC-BY benzeri) | Siteler 200; doğrudan indirme ucu bu oturumda 400 — indirme portal içinden | **Türkiye'nin en ince açık YAS poligon verisi** — bir sonraki adımda portal içinden indirilip doğrulanmalı |
| FAO AQUASTAT | fao.org/aquastat, data.apps.fao.org/aquastat | ~1960'lar→, yıllık | Ülke düzeyi, 180+ değişken (YAS çekimi dahil) | Web'den CSV (100 bin satır) | Açık, kayıtsız | İki adres 200; denenen 2 API ucu **404** — API yolu doğrulanamadı | Ülke düzeyi bağlam/karşılaştırma |
| Dünya Bankası API | api.worldbank.org | **1960–2025 (66 gözlem); son dolu değer 2022 = 2.671,2 m³/kişi**; son güncelleme 2026-07-13 | Ülke düzeyi (ER.H2O.INTR.PC vb.) | JSON/CSV API | Açık, kayıtsız | **200** — JSON fiilen çekildi | "Türkiye su stresi" anlatı rakamları |
| **WHYMAP (BGR/UNESCO)** | services.bgr.de/wms/grundwasser/whymap_gwr/ | Statik (son revizyon ~2008/2015) | Dünya hidrojeoloji; TR akifer/beslenim dahil; 1/25M (kaba) | **WMS canlı** | Açık, kayıtsız | whymap.org ve bgr.bund.de 000 AMA **WMS 200** — GetCapabilities'ten katmanlar çekildi ("Groundwater resources and recharge (mm/a)", "Area of saline groundwater") | Haritaya BUGÜN eklenebilir tek akifer katmanı |
| IGRAC GGIS | ggis.un-igrac.org | 2009–2025 sürümleri | Küresel göstergeler (recharge depth, depletion m/yr, development stress) — TR'yi kapsar, TR özel katmanı YOK (grep: 0) | WMS/GeoServer | Açık | ggis **200** (3 MB GetCapabilities indirildi); un-igrac.org ana site 403 | Küresel bağlam katmanı |
| GLDAS (NASA) | hydro1.gesdisc.eosdis.nasa.gov | **2000–2026** (dizinden kanıtlı) | 0,25° toprak nemi/süzülme | NetCDF4 | Dizin açık, dosya **Earthdata login** (401 kanıtlı) | 200 dizin / 401 dosya | Beslenim modeli girdisi |
| ISRIC SoilGrids | files.isric.org | 2020 sürümü | 250 m küresel toprak hidrolik özellikleri | GeoTIFF/VRT açık dizin | CC-BY, kayıtsız | **200** — dizin listelendi | Süzülme/beslenim modellemesi girdisi |
| USGS kuyu logları | — | — | TR verisi yok (ABD sistemi) | — | — | Test edilmedi — kapsam dışı | — |

### 3c. Özel/ücretli adaylar

| Aday | Ne satar | Durum | Ücretsiz alternatifi |
|---|---|---|---|
| MTA E-Ticaret | İl/pafta haritaları (1.400–4.680 TL), il hidrojeolojik etüt + DSİ sondaj profili raporları | **Ücretli — aday**; yurt dışından 200, fiyatlar canlı | WHYMAP WMS (kaba) + yerbilimleri viewer (görüntüleme) + EEA WISE poligonları |
| MGM MEVBİS | İstasyon bazlı ham yağış serileri | **Ücretli/üyelik — aday**; 200, kayıt başlatılmadı | ERA5 (CDS, ücretsiz kayıt) |
| Yerli jeofizik/sondaj firmaları (SSMA, Alamur vb.) | Nokta rezistivite etüdü + "su bulma" raporu (sondaj 2026: ~1.800–3.500 TL/m) | Veri servisi değil saha hizmeti — **lead alıcısı olarak asıl hedef kitle** | — |
| Küresel YAS SaaS | TR kapsamlı abonelikli "groundwater data SaaS" **bulunamadı** (arama sonuçsuz — doğrulanmadı) | — | GRACE + GLDAS ücretsiz |

---

## ÖNERİ

### Veri türü 1 — Baraj doluluk: **EPİAŞ Şeffaflık API**
Gerekçe: resmî (DSİ bildirimi), günlük, 30.10.2018'den bugüne kesintisiz
tarihsel seri, JSON API, ücretsiz — üç kritik özelliği (resmî + canlı + arşivli)
birleştiren tek kaynak. Uç bu sunucudan canlı (401 gövdesinde `clientIp`
görüldü); tek eksik oturum. Destek katmanı: İBB arşivi (2000–2024 İstanbul
günlük serisi — trend grafiği için) + DSİ Tablo 4.7 (2010–2024 havza yıllık,
elimizde) + dolulukorani.com (belediye barajları için günlük yedek).

### Veri türü 2 — Resmî su istatistikleri: **DSİ istatistik serisi 2014–2024 + faaliyet raporları 2005–2025**
Gerekçe: cdniys CDN yurt dışından tam açık; 2021–2022 hariç her baskının
dosyaları bugün fiilen indirilebilir ve kümülatif 2024 tabloları o boşluğu da
kapatıyor. İlk iş (ayrı oturumda): kurtarılan 2014–2020 + 2023 cdniys
URL'lerindeki xlsx'leri kaynak/dsi/ altına arşivlemek — DSİ galerileri
silebiliyor (2021–2022 kanıtı). SYGM planları (NHYP 12 + KYP ~20 + SSTP 9
havza) havza sayfalarını derinleştirir; SSTP'ler "tahsis verisi yok"
boşluğunu 9 havza için kapatır.

### Veri türü 3 — Yeraltı suyu: **EEA WISE poligonları + WHYMAP WMS + UNL GRACE haftalık**
Gerekçe: il/ilçe ölçeğinde "nerede su çıkar" diyen tek bir açık veri seti YOK —
en iyi açık kombinasyon: WISE TR yeraltı suyu kütle poligonları (en ince açık
vektör) + WHYMAP akifer/beslenim WMS'i (bugün eklenebilir, kayıtsız) + UNL
GRACE haftalık GWS haritaları (2003→13.07.2026, kayıtsız) + MGM SPI + resmî
DSİ rezerv tabloları (elimizde). Nokta kesinliği ancak MTA ücretli
raporlarıyla (aday) veya sahada jeofizik etütle sağlanır — bu boşluk sitenin
B2B rapor + sondaj lead tezini doğruluyor.

### Kullanıcıdan istenecekler (TR-IP / hesap gerektirenler)
1. **EPİAŞ Şeffaflık kaydı** (ücretsiz) — kayıt.epias.com.tr üzerinden; web
   servis kullanımı için Yardım Masası'na sunucu IP'sinin (89.167.42.221)
   bildirilmesi. Baraj doluluk omurgası buna bağlı.
2. **TR-IP'li erişim** (VPN/proxy veya kullanıcının TR bağlantısından tek
   seferlik indirme) şu dört hedef için: (a) yagisbarajdoluluk.dsi.gov.tr —
   arşiv derinliği tespiti, (b) TÜİK Su-Atıksu 2020/2022/2024 bülten ekleri,
   (c) geodata.tarimorman.gov.tr — havza geometrisi doğrulaması (SIRADAKILER
   12 ile aynı iş), (d) veri.gov.tr envanter taraması.
3. **NASA Earthdata hesabı** (ücretsiz) — GRACE mascon NetCDF + GLDAS
   indirmeleri için (yalnız ham grid istenirse; UNL PNG'leri hesapsız).
4. **Copernicus CDS hesabı** (ücretsiz) — ERA5 beslenim girdileri için.
5. Karar: MTA E-Ticaret'ten pilot il için hidrojeolojik etüt raporu satın
   alınacak mı (1.400–4.680 TL bandı; B2B rapor ürününün derinlik testi).

### Tespit edilen boşluklar → HENDEK FAZ 5 bilgi-edinme adayları
Hiçbir yerde açık olmayan veriler (4982 sayılı Bilgi Edinme Kanunu başvuru adayları):
1. **DSİ kuyu/sondaj logları ve YAS gözlem kuyusu seviye serileri** — hiçbir
   kanalda açık değil; sitenin ticari omurgası için en değerli veri.
2. **Kapalı/kısıtlı YAS sahalarının konsolide listesi** — yalnız dağınık RG
   ilanlarından derlenebilir (RG erişilebilir; emek yoğun tarama).
3. **Havza bazlı sektörel su tahsis tablosu** (ülke çapı) — DSİ istatistikleri
   ülke toplamı veriyor; SSTP yalnız 9 havzayı kapsıyor; USBS'nin anonim ucu yok.
4. **İl/ilçe ölçeğinde su verimi/akifer potansiyeli haritası** — MTA'da ücretli
   parça parça; açık ve bütünleşik hâli yok.
5. **DSİ 2021–2022 istatistik baskılarının müstakil dosyaları** — internetten
   silinmiş; kurumdan istenebilir (düşük öncelik: kümülatif tablolar boşluğu
   kapatıyor).
6. **İSKİ günlük doluluk arşivinin 2024 sonrası** — İBB açık verisi Şubat
   2024'te kesilmiş; İBB/İSKİ'ye veri setinin güncellenmesi talebi iletilebilir.
