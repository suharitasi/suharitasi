# "KUYU ÇIKAR MI" — KAPSAM KEŞFİ + RAKİP TARAMASI (salt-okunur)

**Tarih:** 2026-07-22 · **Model:** Opus · **Tür:** TESPİT (kod/site değişikliği YOK).
**Sunucu:** Hetzner DE (89.167.42.221) — TR-IP DEĞİL (gov engelleri bu çıkıştan ölçüldü).
**Web arama motoru şerhi:** WebSearch US-çıkışlı; TR-yerel küçük araçlar eksik temsil
edilebilir — "bulunamadı" mutlak değil, "bu tarama penceresinde bulunamadı"dır.

## ÇERÇEVE (her bölümde korunur — bağlayıcı)
Araç bir **OLASILIK GÖSTERGESİDİR**, etüt/rapor değildir. Kademeli katmanla
"şu havzada beslenim/rezerv/trend şöyle, izin rejimi bu" der; **"şu noktada su
çıkar" DEMEZ.** Kesinlik dili YASAK. Nihai karar hidrojeolojik etüt + jeofizik
ölçümdür; araç o kararın ÖNÜNDEKİ ön-eleme ve hukuki yön katmanıdır. Bu keşif
aracı KURMAZ; v1 kapsamını mevcut veriyle sabitler.

---

## B1 — V1 VERİ ENVANTERİ (yalnız dosyadaki, doğrulandı)

### Eldeki katmanlar → hangi soruya cevap verir

| Dosya | İçerik | Granülarite | Cevapladığı soru | Kısıt |
|---|---|---|---|---|
| `data/canli/havza-yas.json` | 25 havza DSİ **YAS potansiyeli + işletme rezervi** (2013-2024) | Havza | "Beslenim/rezerv var mı" (havza ölçeğinde) | Değerler yıllar arası **sabit** (DSİ statik künye); yıllık dinamik değil |
| `data/canli/grace-havza.json` | 25 havza + ülke **GRACE TWS anomalisi** (aylık seri, eğim) | Havza (~3° gerçek çöz.) | "Su depolaması **düşüyor mu**" (trend/tükeniş yönü) | YAS değil TOPLAM su (YAS+toprak nemi+kar+yüzey); "havza yaklaşık" şerhi |
| `data/canli/baraj.json` | 17 havza **günlük baraj doluluk/kot** (EPİAŞ, 2026-07-16→) | Havza (17/25) | "Yüzey suyu stoğu ne durumda" (bağlamsal) | 8 havza YOK (Fırat-Dicle, Konya Kapalı vb.); kayıt yeni başladı |
| `data/havza-veri.json` | 25 havza künye: yağış alanı, yüzeysu potansiyeli, veri yılı | Havza | Havza fiziksel bağlam | Bazı alanlar null (uydurulmaz) |
| `data/il-kurum.json` | **il→DSİ bölge** (81 il) + **havza→iller** (25 havza) + su idaresi | İl + havza | "İzin rejimi ne / yetkili kurum kim" | — |
| `src/data/il-profil.js` | Yukarıdakileri birleştiren **tek üretici**; il→havza türetimi burada | İl | Girdi=il → havza+GRACE+baraj+kurum kartı | Build-time türetim |
| `data/lead/persona.json` | 42 persona (Ek-2 NACE + genel) | — | Lead zinciri / sektör kapısı | (aşağıda) |

### İl↔havza eşleme tablosu — **VAR (81/81 tam), türetilmiş**
Ayrı bir "81 il → havza" dosyası YOK; ama eşleme `il-kurum.json` içindeki
`havzaIlleri` (havza→iller) + `dsiBolgeleri` (il→bölge) alanlarından
`src/data/il-profil.js`'te build-time türetiliyor. **Doğrulama (bu keşifte
çalıştırıldı):** iki kaynağın benzersiz il kümesi de **81** ve **birebir örtüşüyor**
(havzada olup bölgede olmayan: 0; bölgede olup havzada olmayan: 0). Bir il birden
çok havzaya düşebiliyor (liste olarak tutuluyor). **Sonuç: eksik değil; v1 için
il→havza girdisi hazır.** (Not: eşleme kaynağı SYGM havza tanıtım PDF'leri +
taşkın planları — resmî havza sınır GeoJSON'uyla ayrıca doğrulanmadı; mevcut
"havza sınırı resmî kaynakla doğrulanamadı" açık kalemiyle aynı sınır.)

### Sondaj/jeofizik personası — **KISMEN (sondaj var, jeofizik/etüt ayrı yok)**
`persona.json`'da **"Sondaj / arıtma firması"** personası VAR (lead zincirinin ucu;
`ilgiliIcerik`: /rehberler/kuyu-ruhsati/, /rehberler/ruhsatsiz-kuyu-cezalari/).
Ancak **ayrı bir "jeofizik / hidrojeolojik etüt firması" personası YOK.** "Kuyu
çıkar mı" aracının doğal lead ucu tam da etüt firmasıdır (araç → "kesin karar için
etüt gerekir" → etüt firması). **İşaret: EKLENMELİ** — jeofizik/etüt firması
personası (sondajdan ayrı; araç çıktısındaki "saha yönlendirme" bloğunun hedefi).

### V1'in DÜRÜST SINIRI

**CEVAPLAYABİLİR (mevcut veriyle, bugün):**
- "X ilinin bağlı olduğu havza(lar)da yeraltısuyu **potansiyeli/rezervi** ne düzeyde" (havza ölçeği, DSİ).
- "Bu havzada su depolaması **trendi** artıyor mu/azalıyor mu" (GRACE eğim yönü).
- "Bu havzanın yüzey suyu stoğu (baraj) ne durumda" (17 havza için).
- "Bu ilde kuyu için **izin rejimi/yetkili DSİ bölgesi** hangisi, süreç ne" (hukuk katmanı).
- Bunları birleştiren **kademeli olasılık ŞERİDİ**: "beslenimli havza + düşmeyen trend + net izin yolu = görece elverişli bağlam / tersi = temkinli" (**yön**, kesinlik değil).

**CEVAPLAYAMAZ (açık kaynak yok → v1'de yapılmaz/etiketlenir):**
- "Şu **koordinatta/parselde** su çıkar mı" — nokta veri kapalı/ücretli (bkz. kuyu-veri-kesif).
- "**Kaç metrede** su çıkar" — akifer derinlik/verim ulusal açık set yok.
- "Bu noktanın **akifer tipi/formasyonu**" — MTA jeoloji WMS erişimi doğrulanamadı (B2).
- İlçe/mahalle granülaritesi — veri havza ölçeğinde; ilçe kırılımı üretilemez.
- Herhangi bir **kesin verim/debi** iddiası — yalnız etüt verir.

---

## B2 — V2 KAYNAK KEŞFİ (nazik: ≥5 sn ara; bütçe ~7 istek/40; robots'a uyuldu)

Ön koşul yerine getirildi: `rapor/kuyu-veri-kesif.md` + `rapor/su-kanunu-kaynak-kesif.md`
OKUNDU; mükerrer tarama yapılmadı — yalnız üzerine eklendi.

### 1. MTA il jeoloji/hidrojeoloji rapor arşivi — **ENGELLİ (TR-IP gerekli)**
| Host | DNS | Erişim (bu sunucu, DE) | Not |
|---|---|---|---|
| `www.mta.gov.tr` (ana arşiv host) | çözülüyor (212.174.27.163) | **timeout** (http+https, 20-25 sn) | Coğrafi engel şüphesi |
| `www.mta.gov.tr/v3.0/hizmetler/hidrojeoloji` | — | **ECONNREFUSED** (WebFetch ayrı altyapıdan da) | İki yoldan da erişilemedi |
| `yerbilimleri.mta.gov.tr` (jeoloji viewer) | çözülüyor (212.174.27.160) | **HTTP 200** (0,56 sn) | Viewer erişilebilir; il rapor arşivi değil |

**Tespit:** MTA'nın il jeoloji/hidrojeoloji rapor arşivi **`www.mta.gov.tr` altında**
(hidrojeoloji hizmet sayfası orada); bu host TR-dışı IP'den engelli. **URL yapısı /
PDF mi / metin katmanı var mı — bu sunucudan DOĞRULANAMADI** (3 örnek il PDF'i
alınamadı, çünkü host erişilmiyor). Arama sonuçları MTA hidrojeolojinin "rapor
hazırlanıp arşivlendiğini" doğruluyor ama **açık indirilebilir il-PDF seti teyit
edilemedi.** → **KULLANICI TR-IP TARAYICI TESTİ GEREKLİ** (WMS ile aynı durum).

### 2. MTA WMS (jeoloji altlığı) — **RETRY BAŞARISIZ (DNS çözülemedi)**
`portalcbs.mta.gov.tr:8085/geoserver/wms?request=GetCapabilities` — bu sunucudan
**DNS çözülemedi** (curl exit 6), prior rapordaki durumla birebir aynı. Diğer MTA
hostları (www, yerbilimleri) çözülürken bu alt-alan çözülmüyor → muhtemelen dışarı
kapalı/iç servis. **Durum: kullanıcı TR-IP tarayıcı testi bekleniyor** (GetCapabilities
gerçek TR tarayıcıda denenirse jeoloji altlığının MapLibre'ye bağlanabilirliği kesinleşir).

### 3. DSİ / YAS listeleri — **prior raporlara EK (mükerrer yok)**
`kuyu-veri-kesif.md` zaten şunu sabitledi ve bu keşif teyit etti: nokta kuyu açık
veri YOK; açık tek katman **havza ölçeğinde DSİ istatistikleri** (potansiyel/rezerv/
tahsis, xlsx). Yeni ek bulgular:
- **DSİ Hidrojeolojik Etüt Teknik Şartnamesi (PDF)** erişilebilir CDN'de:
  `cdniys.tarimorman.gov.tr/api/File/GetFile/425/.../hidrojeolojik-etut-teknik-sartnamesi_r01_20190527.pdf`
  → metodoloji referansı (jeofizik etüt rehberi B4 için kaynak); DSİ ana sitesi (`dsi.gov.tr`)
  engelli olsa da bu CDN ucu açık.
- **SYGM "Türkiye Su Kaynakları Haritası" (2020)** — fetch'le doğrulandı: **statik JPG**,
  yerüstü su odaklı, **yeraltısuyu/il-sorgu YOK, interaktif değil.** Kaynak değil, altlık değil.

---

## B3 — RAKİP / BENZER TARAMA + SORGU HARİTASI

**Bütçe:** sorgu başına 1 arama; toplam **4 fetch** (≤30 limit); ~12 arama.
**Yöntem:** her iddia arama sonucu başlığı/URL'i veya fetch'le doğrulandı; doğrulanmayan
"bulunamadı (2026-07-22)". Mutlak "yok" DENMEDİ.

### ANA BULGU — doğrudan rakip **bulunamadı (2026-07-22)**
Ulusal, il/ilçe seç → **su çıkma olasılığı** veren **interaktif** araç — üniversite,
kamu ya da özel — **bu tarama penceresinde bulunamadı.** Manzara iki kutba ayrılıyor:
(a) resmî **statik** haritalar (yeraltısuyu sorgusu yok), (b) sondaj firmalarının
**SEO blog** içerikleri (araç değil, satış hunisi). **Hiçbiri veri + olasılık +
HUKUK'u birleştirmiyor** — bizim ayırt ediciliğimiz burada sağlam.

### Rakip/benzer envanteri (doğrulandı)

| Aday | URL | İşlev | Bizden farkı |
|---|---|---|---|
| **Kuyu Ustası — İstanbul YAS haritası** | kuyuustasi.com/blog/istanbul-yeralti-suyu-haritasi.html | **En yakın kavram:** 16 ilçe tablosu (potansiyel/derinlik/risk) | **Tek şehir**, blog (interaktif değil), kaynak "kendi saha deneyimi", firma satış hunisi (CTA), hukuk yok, ulusal değil |
| SYGM Türkiye Su Kaynakları Haritası | tarimorman.gov.tr/SYGM/Haber/753 | Resmî **statik JPG** yerüstü su altlığı | Yeraltısuyu/il-sorgu yok, interaktif değil, hukuk yok |
| SSMA Sondaj (blog) | ssma.com.tr/blog/ | Yoğun 2026 SEO (metre fiyat, toprak analizi, "su nasıl bulunur jeofizik") | Firma içerik+lead; araç yok, veri yok, hukuk yok |
| Bizim/Uzay/Arama/Uzman Sondaj vb. | bizimsondaj.com, uzaysondaj.com, aramasondaj.com, uzmansondaj.net, susondaji.com.tr, sondajkuyusu.com, yozgatsondaj.com, hur.com.tr | Sondaj firması içerik+hizmet | Aynı: lead odaklı içerik, interaktif katman/hukuk yok |
| Armut / Arsa Lobisi | armut.com/fiyatlari/su-kuyusu-acma, arsalobisi.com | Pazar yeri / genel rehber | Fiyat-lead / genel; su verisi ve hukuk derinliği yok |
| Akademik (CBS/GIS) | dergipark/researchgate (Diyarbakır Ovası, Acıgöl vb.) | Havza-ölçekli tekil YAS-seviye CBS çalışmaları | Dağınık, tekil ova, araç değil, ulusal katman değil |

### Sorgu haritası ekleri — niyet × kapsam eşlemesi
(A) açık rakip araç? (b) hangi sayfamız cevaplıyor / **içerik fırsatı**.
"Planlanan" YALNIZ: SIRADAKILER.md, ODUL-USTU.md, rapor/sorgu-haritasi.md,
icerik-taslak/. Arama durumu: **[A]**=arandı, doğrulandı · **[E]**=mevcut sayfadan
eşlendi (arama harcanmadı — sayfamız zaten net).

**SU BULMA niyeti**
| Sorgu | Rakip araç? | Kapsama | Durum |
|---|---|---|---|
| kuyu açsam su çıkar mı / arazimde su var mı | Yok (sondaj blogları) | **Bu ARAÇ (v1)** — yok | [A] içerik+araç fırsatı (çekirdek) |
| su bulma / yeraltı suyu haritası / sorgulama | Statik+blog | Bu araç + havza sayfaları | [A] fırsat |
| İstanbul/il yeraltı suyu haritası | Kuyu Ustası (tek şehir blog) | Bu araç (ulusal, veriyle) | [A] farklılaşma fırsatı |
| çubukla su bulma / su bulan cihaz-makine (halk yöntemi) | Debunk içerik (evrimağacı, jeolog blog) | Yok | [A] **içerik fırsatı** (mit-çürütme + doğru yönteme köprü) |
| köyde su nasıl bulunur | Blog | Yok | [E→A] fırsat |

**KUYU AÇMA niyeti**
| Sorgu | Rakip | Kapsama | Durum |
|---|---|---|---|
| su kuyusu nasıl açılır / kuyu açmak istiyorum | Sondaj firmaları | /rehberler/kuyu-ruhsati/ (kısmen) | [A] fırsat (süreç+veri köprüsü) |
| kaç metrede su çıkar / sondaj metre fiyatı / maliyet | Sondaj firmaları (fiyat) | Yok | [A] **fiyat verisi bizde yok** — köprü/yönlendirme fırsatı |

**RUHSAT/HUKUK niyeti** (mevcut güç bizde)
| Sorgu | Rakip | Kapsama | Durum |
|---|---|---|---|
| su kuyusu ruhsatı / kuyu ruhsatı nasıl alınır / nereden | Sondaj firmaları (yüzeysel) | /rehberler/kuyu-ruhsati/ + /kuyu-ruhsati/[il] (81) | [A] **bizde daha güçlü** (hukuk+81 il) |
| ruhsatsız kuyu cezası / DSİ kuyu izni / kuyu belgesi | Firma içerik | /rehberler/ruhsatsiz-kuyu-cezalari/, kuyu-belgesi-iptal | [E] var |

**TAŞIMA/SORUN niyeti**
| Sorgu | Rakip | Kapsama | Durum |
|---|---|---|---|
| kuyum kurudu / kuyu derinleştirme izin / kuyu yeri değiştirme | Sondaj firmaları (teknik) | /rehberler/kuyu-tasima/ (var) + icerik-taslak/kuyu-tasima-kaynak.md | [A] hukuk-tarafı fırsat (teknik onlarda, izin/hukuk bizde) |
| kuyu çöktü / kuyu taşıma ruhsat | Firma | kuyu-tasima | [E] var/kısmi |

**ETÜT niyeti** (B4 lead ucu)
| Sorgu | Rakip | Kapsama | Durum |
|---|---|---|---|
| jeofizik rezistivite su / hidrojeolojik etüt / su etüdü fiyat / sondaj öncesi etüt | Sondaj+etüt firmaları | **Yok** → B4 iskelet önerisi | [A] **içerik fırsatı** (rehber + lead ucu) |

**Taranamadı (bütçe/başka):** "su bulma cihazı" tekil, "kuyu belgesi" tekil,
"kuyu açma maliyeti" tekil arama olarak ayrıca çalıştırılmadı — kümesindeki temsilci
sorgu tarandığından manzara temsil edildi; verbatim tekil arama gerekirse ikinci turda.

---

## B4 — V1 TASLAK MİMARİ + İÇERİK KÖPRÜSÜ (kod yok)

### Akış (girdi → çıktı kartı → bağ → lead)
```
[İl seç]  ──►  KUYU-BAĞLAM KARTI (havza ölçeği, OLASILIK dili)
                 ├─ Havza beslenimi/rezervi   (havza-yas.json · DSİ)
                 ├─ Su depolaması trendi ↑/↓  (grace-havza.json · yön, kesinlik değil)
                 ├─ [bağlam] baraj/yüzey stoğu (baraj.json · 17 havza)
                 ├─ İzin rejimi + yetkili DSİ  (il-kurum.json → /kuyu-ruhsati/[il])
                 └─ DÜRÜSTLÜK ŞERİDİ          (çerçeve: "olasılık göstergesi, etüt değil")
   │
   ├──►  /durumum/ (persona/sektör) ile bağ  — "sondaj/etüt firmasıysan / yatırımcıysan"
   ├──►  havza sayfası + /kuyu-ruhsati/[il] çapraz bağ
   └──►  SAHA YÖNLENDİRME BLOĞU (lead ucu):
            "Kesin karar = hidrojeolojik etüt + jeofizik ölçüm" →
            jeofizik/etüt firması personası (EKLENMELİ, B1) → sondaj firması
```
**Çıktı kartı alanları** doğrudan `il-profil.js` çıktısına oturur (havzalar[], egilim,
baraj, dsiBolgeleri, suIdaresi) — yeni üretici gerekmez; kart **olasılık/yön diliyle**
yeniden çerçevelenir. İçerik sayfası JS~0 korunur (ODUL-USTU "Korunacaklar").

### EK — "Sondajdan Önce Jeofizik Etüt (Rezistivite)" rehber İSKELETİ
(Bölüm başlıkları + cevapladığı sorgu; hukuki/teknik HÜKÜM YAZILMADI — iskelet.)
1. **Neden etüt? (çubukla su ≠ bilim)** → "çubukla su bulma gerçek mi", "su bulan cihaz"
2. **Jeofizik yöntemler: rezistivite / IP / sismik** → "jeofizik rezistivite su", "su nasıl bulunur"
3. **Hidrojeolojik etüt neyi ölçer (derinlik/tabaka/kalite)** → "hidrojeolojik etüt"
4. **Etütten ruhsata: DSİ neden etüt raporu ister** → "kuyu ruhsatı etüt raporu" (→ /rehberler/kuyu-ruhsati/)
5. **Maliyet çerçevesi (aralık, kesinlik yok)** → "su etüdü fiyat", "sondaj metre fiyatı"
6. **Ne zaman firma çağırılır (saha yönlendirme)** → lead ucu (etüt/sondaj personası)
*Kaynak: DSİ Hidrojeolojik Etüt Teknik Şartnamesi (B2, CDN'de erişilebilir) —
metodoloji; hüküm/rakam eklenmez.*

### [SERDAR-HUKUK] KAPILARI (BOŞ — kullanıcı yazar)
- **Sorumluluk reddi metni:** araç "olasılık göstergesi, etüt/hukuki mütalaa değildir"
  disclaimer'ı — **[SERDAR-HUKUK]**.
- **Araç adı + dili:** ("Kuyu Bağlam" / "Su Çıkar mı" / …) ve olasılık ifadelerinin
  hukuki ölçüsü (TBB dili, abartı yasağı) — **[SERDAR-HUKUK]**.
- Hukuki hüküm/ceza/rakam içeren her cümle — **[APILEX/SERDAR-HUKUK]** (Claude Code yazmaz).

---

## KAPSAM DIŞI / DÜRÜSTLÜK KAYDI
- Hiçbir dosya/kod değişmedi; yalnız bu rapor üretildi. `set -euo pipefail` kullanıldı; `2>/dev/null` yok.
- MTA il PDF metin-katmanı **doğrulanamadı** (host TR-dışı IP'den engelli) — TR-IP testi kullanıcıda.
- MTA WMS GetCapabilities **retry başarısız** (DNS) — TR-IP testi kullanıcıda.
- WebSearch US-çıkışlı: TR-yerel küçük araçlar eksik olabilir; "bulunamadı" tarama-penceresi kaydıdır.
- Bazı tekil sorgular küme temsilcisiyle karşılandı (B3 "taranamadı" notu) — bütçe korundu.
- Hiçbir hukuki/teknik hüküm üretilmedi; [SERDAR-HUKUK]/[APILEX] kapıları boş bırakıldı.
