# Su Verisi — Geriye Dönük Eksik-Denetim Raporu

Üretim (UTC): **2026-10-05T21:00:01Z**

Kaynak kataloğu: **33** · kapsanan: **16** · eksik/açık: **3** · açık yayımı yok: **2** · aday: **12** · kayıt dışı kurumsal host: **8**

## 1. Entegre edilebilir boşluklar (kaynak açık, henüz bağlanmadı)

- **Nehir Havza Yönetim Planları (NHYP)** — parametre: kutle_bazli_tedbir, su_kutlesi_kunye, kirletici_analizi  
  12/25 havza yayımlı (doğrulandı 2026-07-27); kalan 13'ün 6'sı hazırlıkta, 7'si izsiz. Yayımlanmayan cadde veri uydurulmaz.
- **Meteoroloji Genel Müdürlüğü — Gözlem/Tahmin** — parametre: yagis_gozlem, sicaklik, kuraklik_analizi  
  MGM açık toplu veri API'si yayımlamıyor (doğrulanmadı); yalnız HTML gözlem. Bilgi edinme adayı.
- **TÜİK Su ve Atıksu İstatistikleri** — parametre: belediye_su_cekim, atiksu, kisi_basi_su  
  Ulusal kırılım var; il kırılımı headless tarayıcı gerektirir. Veri yok değil, erişim yöntemi belirsiz.

## 2. Açık yayımı doğrulanmamış boşluklar (UYDURULMAZ; bilgi edinme adayı)

- **DSİ Anlık Akım Gözlem (debi)** — parametre: anlik_debi, akim_gozlem  
  'Anlık debi düşüşleri' talebi: DSİ açık makine-okunur yayımlamıyor. Bilgi edinme dilekçesi adayı. UYDURULMAZ.
- **Yeraltı Suyu Kalite/Kirlilik Ölçümleri** — parametre: yeralti_su_kalitesi, kirlilik  
  NHYP YAS künyelerinde kısmi; konsolide açık veri YOK. UYDURULMAZ.

## 3. Aday kaynak kuyruğu (insan onayı bekliyor)

- **NASA GES DISC — GLDAS Karasal Su Bütçesi** (resmi) — toprak_nemi, kar_su_esdegeri, yer_alti_su
- **SPEI Global Kuraklık Monitörü** (akademik) — tarimsal_kuraklik_endeksi, spei
- **GRDC — Küresel Akım/Deşarj Veri Merkezi** (resmi) — akim, desarj
- **WRI Aqueduct — Su Riski Atlası** (kurumsal) — su_stresi, sel_riski, kuraklik_riski, su_kalitesi_riski
- **FAO AQUASTAT — Ülke Su İstatistikleri** (resmi) — cekilen_su, sulama, su_kaynaklari
- **JRC Global Surface Water** (resmi) — yuzey_suyu_degisimi, su_kalici_alani
- **HydroSHEDS / HydroATLAS** (kurumsal) — hidrografik_ag, havza_ozellikleri, akim_yonu
- **ESA CCI Soil Moisture** (resmi) — toprak_nemi
- **Global Dam Watch Veritabanı** (akademik) — baraj_envanteri, rezervuar_hacmi
- **IGRAC Küresel Yeraltı Suyu İzleme Ağı (GGMN)** (kurumsal) — yeralti_su_seviyesi, kuyu_gozlem
- **Avrupa Çevre Ajansı — Su Verisi (WISE)** (resmi) — su_kalitesi, su_kutlesi_durumu
- **Open-Meteo (ticari aracı API)** (belirsiz) — yagis, sicaklik

## 4. Kayıt dışı kurumsal URL'ler (taramada bulundu, katalogda yok)

- `dergipark.gov.tr`
- `dergipark.org.tr`
- `doi.org`
- `earth.gsfc.nasa.gov`
- `emsal.uyap.gov.tr`
- `karararama.yargitay.gov.tr`
- `search.trdizin.gov.tr`
- `www.trdizin.gov.tr`

---
_arac/kesif/kesif-motoru.py denetim · uydurma yasağı: yalnız gözlem._
