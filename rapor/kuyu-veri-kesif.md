# Kuyu / Su Verisi Kaynak Keşfi — Değerlendirme Raporu

Tarih: 2026-07-20 · Yöntem: 4 paralel araştırma ajanı, her URL curl ile (HTTP + exit kodu) doğrulandı · Sunucu: TR-IP · İndirme: toplam <10 MB (yalnız erişim/format doğrulaması).

Amaç: "Kuyu/su ticari ve hukuki merkezi" vizyonunun VERİ ayağının bugün neye dayanabileceğini tespit etmek. Bu bir KEŞİF çıktısıdır — üretim/arşivleme kararları bu raporun altındaki karar listesiyle kullanıcıya bırakılmıştır. Uydurma yoktur: yalnız curl ile erişilip içeriği görülen kaynak "bulundu" işaretlidir; erişilemeyen "erişilemedi", aranıp çıkmayan "bulunamadı (2026-07-20)".

---

## Özet karar (10 saniyelik)

Türkiye'de **nokta düzeyi (koordinatlı kuyu) açık veri YOK.** Açık ve yayına hazır olan tek katman **havza çözünürlüğünde** DSİ resmi istatistikleridir (yeraltısuyu potansiyeli + rezerv + tahsis, Excel, ücretsiz, güncel). Akifer/formasyon ve nokta düzeyi veri ya ücretli (MTA), ya kapalı (DSİ hidrojeolojik etütleri), ya da dağınık akademik yayında. Şirket vakaları KAP API'sinden yarı-otomatik, düşük hacimle çıkarılabilir (kanıtlandı). Projenin ayırt edici gücü açık koddan değil, **avukat yetkisiyle edinilecek özel veri + arşivden** gelecek (CLAUDE.md HENDEK ilkesiyle birebir uyumlu).

---

## Katman katman: ne bulundu / bulunamadı / ne üretilebilir

### (a) NEREDE SU ÇIKMIŞ — fiili kayıt

| | |
|---|---|
| **Bulundu** | DSİ Resmi Su Kaynakları İstatistikleri (Excel): su sondaj kuyusu sayıları, işletme rezervi, gözlem kuyuları — havza/sektör/yıl toplamı. `dsi.gov.tr/Sayfa/Detay/1344` (200, örnek xlsx 35 KB doğrulandı). |
| **Bulunamadı** | Koordinatlı kuyu noktası açık veri seti; il bazlı kuyu envanteri; DSİ açık veri portalı/API/WMS (tahmini alt alanların tümü DNS'te yok). |
| **Ne üretilebilir** | Havza düzeyinde "kaç kuyu / ne kadar rezerv / ne kadar tahsis" göstergesi — mevcut 25-havza şemasına oturur. Nokta pin'i (harita üzerinde gerçek kuyu) **üretilemez** açık kaynaktan. |
| **Ne üretilemez** | "Şu koordinatta kuyu var/vardı" iddiası — veri kapalı/ücretli. |

### (b) NERELERDEN ÇIKABİLİR — potansiyel

| | |
|---|---|
| **Bulundu** | ★ DSİ "Havzalara Göre Yıllık Yeraltısuyu Potansiyeli (2013-2024)" XLSX (200, 41 KB) + İşletme Rezervi + Sektör Tahsisi. Adı birebir "yeraltısuyu potansiyeli" olan tek doğrudan resmî kamu kaynağı. |
| **Bulunamadı** | Akifer/alt-havza/nokta düzeyi potansiyel; MTA açık hidrojeoloji haritası (viewer'da katman yok, satışta ürün yok); DSİ hidrojeolojik etüt raporları (var ama kamuya kapalı). |
| **Ne üretilebilir** | **Havza granülaritesinde** resmî dayanaklı potansiyel katmanı: "X havzasında yıllık YAS potansiyeli ~N milyon m³, ~M'si tahsisli." Bugün yayına hazır. |
| **Ne üretilemez (özel kural)** | Akifer/nokta düzeyi "nereyi delersen su çıkar" — resmî açık dayanak yok → **tahmin etiketiyle sınırlı / yayınlanamaz.** Ancak DSİ'ye resmî başvuru veya harita edinimi/avukat yetkisiyle elde edilirse yayınlanabilir hale gelir. |

### (c) SU ÇIKAN YERLERİN ÖZELLİKLERİ — akifer/formasyon/derinlik

| | |
|---|---|
| **Bulundu** | MTA 1/500.000 **JEOLOJİ** (formasyon) — yerbilimleri.mta.gov.tr viewer + arka uç GeoServer WMS (`portalcbs.mta.gov.tr:8085/geoserver/wms`). DergiPark'ta havza-ölçekli tekil akademik çalışmalar. DSİ Yeraltısuları Kitabı + Hidrojeolojik Etüt Şartnamesi (metodoloji). |
| **Bulunamadı** | Türkiye ölçeğinde açık + indirilebilir + makine-okunur AKİFER poligonu / kuyu derinliği / verim veri seti; MTA hidrojeoloji haritasının açık dijital sürümü; TUCBS'te hidrojeoloji katmanı. |
| **Ne üretilebilir** | Formasyon (jeoloji) altlığı — akifer değil ama akiferin türetildiği zemin. WMS erişimi doğrulanabilirse harita altlık katmanı olur. |
| **Ne üretilemez** | Ulusal akifer tipi/derinlik/verim katmanı — açık kaynakta yok; akademik derleme + kurumsal talep gerektirir. |

### (d) ŞİRKET VAKALARI — KAP/ÇED

| | |
|---|---|
| **Bulundu** | KAP JSON API çalışıyor: `POST /tr/api/disclosure/members/byCriteria`. 7 gerçek bildirim doğrulandı (MEYSU mineralli su ruhsatı; Zorlu Enerji jeotermal ruhsatları — şirket+tarih+URL 200). |
| **Bulunamadı / kısıt** | KAP'ta full-text arama yok; tek sorgu 2000 kayıt sınırı; su nadir konu. ÇED sorgu portalları (eced.csb.gov.tr) bu sunucudan timeout → doğrulanamadı. |
| **Ne üretilebilir** | Yarı-otomatik vaka akışı: periyodik byCriteria taraması + su-regex (`summary`/`subject`) + hedefli izleme listesi (mineralli/kaynak suyu şişeleyiciler, jeotermal [5686], madencilik) + gövde-fetch doğrulama. Hacim: çeyrekte birkaç vaka. |
| **Ne üretilemez (şu an)** | ÇED su-temini bölümlerinden sistematik çıkarım — erişim engeli nedeniyle test edilemedi. |

---

## HENDEK değerlendirmesi — arşiv adayları (İNDİRME YOK)

Kurumlar veri siliyor/değiştiriyor (DSİ dersi: eski istatistik dosyaları sürüm değişince kayboluyor). Aşağıdakiler **arşivlenmeye değer aday** olarak işaretlenir; bu raporda indirilmedi, karar kullanıcının:

1. **DSİ Resmi Su Kaynakları İstatistikleri (tüm xlsx seti)** — havza potansiyeli, rezerv, tahsis, gözlem kuyuları, sondaj kuyusu sayıları. En yüksek öncelik: küçük (<1 MB toplam), resmî, sürüm değişince eski seri kaybolur. baraj/GRACE arşiv pipeline'ına benzer bir "yıllık DSİ istatistik çekimi" eklenebilir.
2. **DSİ Yeraltısuları Kitabı + Hidrojeolojik Etüt Şartnamesi (PDF)** — metodoloji referansı, içerik/rehber yazımı için; tek seferlik arşiv yeter.
3. **KAP su/ruhsat bildirimleri (byCriteria + gövde)** — hukuki vaka arşivi çekirdeği; olay bazlı, süregelen izleme. Şirket adı+ruhsat+tarih zaten kamusal.
4. **MTA 1/500.000 jeoloji WMS** — erişim doğrulanırsa altlık; ham veri satın alma dışında arşivlenemez (WMS canlı servis).

Not: (1) ve (3) HENDEK ilkesinin "veri arşivi" ayağını doğrudan besler; ikisi de düşük hacimli ve süregelen çekime uygun.

---

## MapLibre bağlantısı (SIRADAKILER 31)

Havza çözünürlüğündeki DSİ potansiyel/rezerv/tahsis verisi (katman b), planlanan MapLibre havza haritasına **doğrudan girdi olur** — mevcut 25-havza GeoJSON şemasıyla aynı granülaritede olduğu için hover'da "potansiyel/rezerv/tahsis/risk" göstergesine birebir bağlanır ve GRACE değişim haritasıyla (SIRADAKILER 31) aynı katmanda katmanlanabilir. Buna karşılık akifer/formasyon (katman c) ve nokta kuyu (katman a) MapLibre'ye **bugün bağlanamaz**: nokta verisi kapalı, MTA jeoloji WMS'i ise ancak `portalcbs.mta.gov.tr:8085/geoserver/wms?request=GetCapabilities` gerçek TR-IP tarayıcıda doğrulanırsa raster altlık olarak eklenebilir (akifer değil, formasyon zemini).

---

## KARAR LİSTESİ

**Üretime hazır (açık kaynak, bugün):**
- Havza düzeyi yeraltısuyu potansiyeli / işletme rezervi / sektör tahsisi göstergesi — DSİ resmi istatistikleri (katman b). MapLibre havza haritasına ve içerik sayfalarına girdi.

**Kullanıcı-temini bekliyor (engelli/kapalı, avukat yetkisi veya edinim gerekir):**
- MTA hidrojeoloji haritaları (ana host engelli + ürün ücretli/kapalı).
- DSİ hidrojeolojik etüt/YAS planlama raporları (alt-havza/akifer potansiyeli — kamuya kapalı, resmî başvuru).
- Koordinatlı kuyu envanteri (DSİ, izne bağlı) veya MTA Termal/Mineralli Sular Envanteri (ücretli, nokta düzeyi).
- ÇED su-temini portalı (bu sunucudan timeout — kullanıcı ağından test edilmeli).

**Yapılamaz (açık kaynaktan çözülmez):**
- Ulusal ölçekte açık akifer tipi/derinlik/verim veri seti (yok).
- Nokta düzeyi "nereyi delersen su çıkar" açık dayanaklı iddia (yayınlanamaz).

**Arşiv adayları (HENDEK, indirme kararı ayrı brief):**
- DSİ istatistik xlsx seti (öncelik 1), KAP su/ruhsat bildirimleri (öncelik 2), DSİ metodoloji PDF'leri, MTA jeoloji WMS (erişim doğrulanırsa).

**Doğrulama gerektiren tek teknik açık:** MTA GeoServer WMS endpoint'i (`portalcbs.mta.gov.tr:8085`) bu sunucudan DNS ile çözülemedi; gerçek TR-IP tarayıcıda GetCapabilities denenirse jeoloji altlığının MapLibre'ye bağlanabilirliği kesinleşir.
