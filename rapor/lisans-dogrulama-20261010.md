# Veri kaynaklarının kullanım koşulları — resmî sayfalardan doğrulama (erişim 10.10.2026)

Brif 2.11 için. Her koşul kaynağın kendi sayfasından okundu; ham sayfalar sunucuda (scratchpad/lisans-ham, depo dışı). "Kısıtlanmamış": metin amaca sınır koymuyor, "ticari" sözcüğü açıkça geçmiyor.

| # | Kaynak | Koşul sayfası | Lisans / beyan | Ticari | Yeniden dağıtım | Atıf | Durum |
|---|---|---|---|---|---|---|---|
| 1 | OpenStreetMap | openstreetmap.org/copyright · opendatacommons.org/licenses/odbl/1-0/ | ODbL 1.0 ("These rights explicitly include commercial use") | serbest | koşullu: atıf, ODbL belirtilir, değiştirilen veri aynı lisansla | evet | doğrulandı |
| 2 | Natural Earth | naturalearthdata.com/about/terms-of-use/ | kamu malı ("in the public domain") | serbest | serbest | hayır | doğrulandı |
| 3 | alpers/Turkey-Maps-GeoJSON (il sınırları) | github.com/alpers/Turkey-Maps-GeoJSON LICENSE | Apache-2.0 | kısıtlanmamış | koşullu (lisans kopyası, bildirimler korunur) | evet | doğrulandı; verinin kendi kaynağı belirsiz |
| 4 | AWS Terrain Tiles (Mapzen) | registry.opendata.aws/terrain-tiles · tilezen/joerd attribution.md | alt kaynağa göre (TR: SRTM, GMTED, ETOPO1) | belirtilmemiş | koşullu (atıf bloğu + alt lisanslar) | evet | doğrulandı |
| 5 | Copernicus DEM GLO-90 | dataspace.copernicus.eu COP-DEM lisans PDF'i | Licence for Copernicus WorldDEM™-90, ücretsiz | kısıtlanmamış | koşullu: kaynak bildirimi + zorunlu sorumluluk reddi cümlesi | evet | doğrulandı |
| 6 | NASA GSFC GRACE/GRACE-FO mascon | earth.gsfc.nasa.gov/geo/data/grace-mascons | lisans adı yok ("please cite" Loomis vd. 2019) | belirtilmemiş | belirtilmemiş | rica | koşul yazılmamış; Earthdata politikası açılamadı (403) |
| 7 | NASA POWER | power.larc.nasa.gov/docs/referencing/ | lisans adı yok; atıf koşulu | belirtilmemiş | koşullu (bildirim rica) | evet | doğrulandı (atıf) |
| 8 | CHIRPS v2.0 | chc.ucsb.edu/data/chirps | kamu malı (telif feragati) | kısıtlanmamış | kısıtlanmamış | belirtilmemiş | doğrulandı |
| 9 | ERA5-Land (CDS) | cds.climate.copernicus.eu katalog kaydı | CC BY 4.0 | serbest | koşullu (atıf) | evet | doğrulandı |
| 10 | EPİAŞ Şeffaflık Platformu | seffaflik.epias.com.tr alt bilgi | "Sunulan tüm içerik ve veriler kaynak gösterilmek suretiyle çoğaltılabilir ve kullanılabilir." | belirtilmemiş | koşullu (kaynak gösterilerek) | evet | doğrulandı |
| 11 | DSİ | dsi.gov.tr/Sayfa/Detay/787 (Yasal Uyarı) | "…kaynak gösterilmek suretiyle yayımlanabilir; ancak bu bilgilerin ticari amaçlarla kullanımı DSİ'nün yazılı iznine tabidir." | **yazılı izne bağlı** | koşullu (kaynak gösterilerek) | evet | doğrulandı |
| 12 | Tarım ve Orman Bakanlığı / SYGM | tarimorman.gov.tr | "Tüm Hakları Saklıdır" | belirtilmemiş | belirtilmemiş | belirtilmemiş | koşul yazılmamış |
| 13 | Resmî Gazete | resmigazete.gov.tr alt bilgi | "Tüm Hakları Saklıdır…" (anılan bildirim bulunamadı) | belirtilmemiş | belirtilmemiş | belirtilmemiş | koşul yazılmamış |
| 14 | Mevzuat Bilgi Sistemi | mevzuat.gov.tr alt bilgi | aynı biçim; bildirim bulunamadı | belirtilmemiş | belirtilmemiş | belirtilmemiş | koşul yazılmamış |
| 15 | Danıştay Karar Arama | karararama.danistay.gov.tr | beyan yok | belirtilmemiş | belirtilmemiş | belirtilmemiş | koşul yazılmamış |
| 16 | OpenAlex | help.openalex.org/access/pricing · snapshot LICENSE.txt | CC0 1.0 | serbest | serbest | hayır | doğrulandı |
| 17 | MTA rapor künyeleri | mta.gov.tr | "Her Hakkı Saklıdır" | belirtilmemiş | belirtilmemiş | belirtilmemiş | künye için koşul yazılmamış |
| 18 | ArcGIS "Türkiye Havzalar" (havza sınırları) | arcgis.com öğe 8bb6457512914c359fc6be676f0aa391 | licenseInfo boş | belirtilmemiş | belirtilmemiş | belirtilmemiş | koşul yazılmamış — **öğe özeti: "Esri Türkiye Eğitim Hizmetleri tarafından eğitim verisi olarak hazırlanmıştır… varsayımsal veriler olup gerçeği yansıtmayabilir."** |

Açık konular (sahibe): (a) DSİ verisinin ticari kullanımı DSİ'nin yazılı iznine bağlı; site bir hukuk bürosunun tanıtım işlevi de görüyor — izin istenip istenmeyeceği sizin kararınız. (b) Havza sınırı geometrisi kendini "varsayımsal eğitim verisi" diye tanımlayan bir öğeden geliyor; resmî CBS kaynağı (cbs.dsi.gov.tr / geodata.tarimorman.gov.tr) bu sunucudan erişilemiyordu (KAYNAKLAR.md, 14.07.2026). (c) Kamu kurumlarının çoğunda yalnız "Tüm hakları saklıdır" yazıyor; açık kullanım koşulu yok.
