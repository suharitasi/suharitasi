# 13.09.2026 — Dönüşüm ve içerik raporu: su hukuku danışmanlık niyeti

**Veri kaynağı:** `google-seo` MCP → GSC `webmasters.searchanalytics.query`, mülk `sc-domain:suharitasi.com`, `fetched_at` 2026-09-13T18:40Z.
**Dönemler:** ana pencere 2026-08-14 → 09-10 (28 gün); kıyas için 2026-07-01 → 09-10 (72 gün).
**Taban:** `rapor/08-09-gsc-ticari-whatsapp.md` (09.08–05.09) · `rapor/09-09-rehber-indeks-teshis.md`.
**GA4:** bu turda yok (Admin API proje `suharitasi-gsc`'de 403 `SERVICE_DISABLED`).

Etiketler: **[Ö]** = GSC'de ölçülmüş · **[T]** = türev/çıkarım · **[K]** = karar gerektirir.

---

## 0. Yönetici özeti

1. **Danışmanlık niyeti taşıyan sorgular artık görünmeye başladı ama hacim çok küçük:** 28 günde hukuki sorgulardan **0 tık / 34 gösterim** [Ö]. Bunun bir kısmı veri eksikliğidir (bkz. §8): sorgu boyutu tıkların yalnız ~%25'ini gösteriyor.
2. **Buna karşılık hukuk sayfaları sayfa bazında tık üretiyor:** 28 günde hukuk kapısı sayfaları **37 tık / 444 gösterim** [Ö]. En iyi dönüştüren sayfa `/rehberler/kuyu-belgesi-iptal-davalari/` (4 tık, CTR %11, poz 3,7) ve `/rehberler/kaynak-suyu-kiralama/` (6 tık, CTR %7,4, poz 4,1).
3. **Dizin engeli kalktı:** 08.09 raporunda dizinde olmayan üç ana rehber (kuyu-ruhsati, su-tahsisi, kuyu-tasima) 09.09 teşhisinde dizinde göründü [Ö]. Artık asıl iş **içerik derinliği + niyet eşleşmesi**, dizin değil.
4. **Dönüşüm altyapısı var ama ölçüm yok:** her sayfada sabit WhatsApp düğmesi (08.09), rehber sonunda "Sonraki adım" bloğu (mailto + araç + büro), iletişim formu (mailto). WhatsApp tıklaması hâlâ **ölçülmüyor**.
5. **Odak:** en yüksek ticari değerli 4 sayfa → `ruhsatsiz-kuyu-cezalari`, `kuyu-belgesi-iptal-davalari`, `kaynak-hakki-komsu-su`, `kuyu-ruhsati`; bunlara kaçak kuyu / belge iptali / komşu su / ruhsat alma niyet kümeleriyle derinleştirme.

---

## 1. Hukuki / ticari niyetli sorgular — ne geldi

### 1.1 Görünür sorgular (28 gün) [Ö]

| Tık | Gösterim | Poz | Sorgu | İnen sayfa | Niyet |
|---:|---:|---:|---|---|---|
| 0 | 18 | 28,6 | su kanunu | /su-kanunu/ | bilgi (üst huni) |
| 0 | 2 | 35,0 | kaynak sularının kullanım hakkı | /rehberler/kaynak-hakki-komsu-su/ | hukuk |
| 0 | 1 | 26,0 | başkasının arazisinden su geçirme hakkı | /rehberler/kaynak-hakki-komsu-su/ | uyuşmazlık |
| 0 | 1 | 54,0 | izinsiz sondaj cezası | /rehberler/ruhsatsiz-kuyu-cezalari/ | **acil / yaptırım** |
| 0 | 1 | 67,0 | kaçak sondaj cezası | /rehberler/ruhsatsiz-kuyu-cezalari/ | **acil / yaptırım** |
| 0 | 1 | 37,0 | su borusu geçirme hakkı | /rehberler/kaynak-hakki-komsu-su/ | uyuşmazlık |
| 0 | 1 | 10,0 | işletme belgesi | /rehberler/kuyu-belgesi-iptal-davalari/ | **idari / dava** |
| 0 | 1 | 33,0 | su kanunu nedir | /su-kanunu/ | bilgi |

### 1.2 Görünür sorgular (72 gün, 28 güne ek) [Ö]

| Tık | Gösterim | Poz | Sorgu | İnen sayfa |
|---:|---:|---:|---|---|
| 0 | 1 | 34,0 | baraj istimlak bedelleri ne kadar | /rehberler/baraj-kamulastirmasi/ |
| 0 | 1 | 67,0 | tapulu araziden çıkan su kime aittir | /rehberler/kaynak-hakki-komsu-su/ |
| 0 | 1 | 62,0 | yeraltı suyu haritası | kök |

**Okuma:** Sorgular tam da istenen niyette (yaptırım, idari işlem, komşu su, kamulaştırma) ama **pozisyon 26–67** arası — 1. sayfa dışı. Bu, içerik eksiği değil, site yaşı + otorite eksiğidir; 08.09 raporundaki "Ergene" teşhisiyle aynı sınıf. Aksiyon: bu sorguları sayfa içinde başlık/öz-cevap/SSS düzeyinde **birebir karşılamak** ve iç bağlantı otoritesini bu sayfalara akıtmak.

### 1.3 Sayfa bazında toplamlar (28 gün) [Ö]

| Sayfa | Tık | Gösterim | CTR | Poz |
|---|---:|---:|---:|---:|
| /nerede-su-cikar/ | 19 | 135 | %14,1 | 6,7 |
| /rehberler/kaynak-suyu-kiralama/ | 6 | 81 | %7,4 | 4,1 |
| /rehberler/kuyu-belgesi-iptal-davalari/ | 4 | 36 | %11,1 | 3,7 |
| /rehberler/kaynak-hakki-komsu-su/ (+www) | 3 | 60 | %5,0 | 8,4 |
| /hangi-kurum/ | 1 | 27 | %3,7 | 6,8 |
| /rehberler/jeotermal-ruhsat/ | 0 | 26 | %0 | 5,6 |
| /su-kanunu/ | 0 | 21 | %0 | 26,5 |
| /rehberler/su-tahsisi-oncelik-sirasi/ | 0 | 18 | %0 | 5,1 |
| /rehberler/ruhsatsiz-kuyu-cezalari/ | 0 | 15 | %0 | 12,7 |
| /rehberler/baraj-kamulastirmasi/ | 1 | 9 | %11,1 | 9,7 |
| /rehberler/yeralti-suyu-isletme-sahasi/ | 2 | 4 | %50 | 2,8 |
| /rehberler/kuyu-ruhsati/ | 0 | 3 | %0 | 9,0 |
| /rehberler/kuyu-tasima/ | 0 | 1 | %0 | 1,0 |
| **Hukuk kapısı toplamı** | **37** | **444** | — | — |

**Dikkat çeken iki çelişki:**
- `/rehberler/ruhsatsiz-kuyu-cezalari/` **0 tık** ama sorguları en acil niyetli (kaçak/izinsiz sondaj cezası) ve poz 12,7 → **en büyük potansiyel açık**.
- `/rehberler/kuyu-ruhsati/` **0 tık / 3 gösterim** → ticari omurganın merkezi olması gereken sayfa neredeyse görünmez. Dizin sorunu 09.09'da çözüldü; şimdi içerik/otorite işi.

---

## 2. `/rehberler/` ve `/nerede-su-cikar/` sorgu kelimeleri (tam liste)

### 2.1 `/rehberler/*` sayfalarına inen görünür sorgular (72 gün) [Ö]

| Sayfa | Sorgu | Tık | Gösterim | Poz |
|---|---|---:|---:|---:|
| baraj-kamulastirmasi | baraj istimlak bedelleri ne kadar | 0 | 1 | 34,0 |
| jeotermal-ruhsat | evet *(alakasız/artık)* | 0 | 1 | 4,0 |
| kaynak-hakki-komsu-su | başkasının arazisinden su geçirme hakkı | 0 | 1 | 26,0 |
| kaynak-hakki-komsu-su | su borusu geçirme hakkı | 0 | 1 | 37,0 |
| kaynak-hakki-komsu-su | tapulu araziden çıkan su kime aittir | 0 | 1 | 67,0 |
| kaynak-hakki-komsu-su (www) | kaynak sularının kullanım hakkı | 0 | 3 | 34,7 |
| kuyu-belgesi-iptal-davalari | işletme belgesi | 0 | 1 | 10,0 |
| ruhsatsiz-kuyu-cezalari | izinsiz sondaj cezası | 0 | 1 | 54,0 |
| ruhsatsiz-kuyu-cezalari | kaçak sondaj cezası | 0 | 1 | 67,0 |

**Not:** `/rehberler/kaynak-suyu-kiralama/` sayfasının 6 tıkı ve `kuyu-belgesi-iptal-davalari`'nin diğer tıkı sorgu boyutunda görünmüyor (anonimleştirme). Yani yukarıdaki liste **eksik**; sayfa toplamları §1.3.

### 2.2 `/nerede-su-cikar/` sayfasına inen görünür sorgular (72 gün) [Ö]

| Sorgu | Tık | Gösterim | Poz |
|---|---:|---:|---:|
| dsi yeraltı su haritası | 1 | 7 | 12,1 |
| su neresi | 0 | 4 | 10,5 |
| yeraltı su haritası | 0 | 2 | 9,0 |
| yeraltı suları haritası | 0 | 2 | 20,0 |
| dsi yeraltı suları haritası | 0 | 1 | 11,0 |
| su nerde | 0 | 1 | 11,0 |
| su nerede | 0 | 1 | 12,0 |
| türkiye nin yeraltı su kaynakları haritası | 0 | 1 | 38,0 |
| türkiye yeraltı su haritası | 0 | 1 | 3,0 |

**Okuma:** `/nerede-su-cikar/` bir **"nerede/nasıl bulurum" kapısı**; niyet coğrafi, hukuki değil. 19 tıkın çoğu bu sorgulardan. Dönüşüm için doğru kullanım: bu sayfadan hukuk rehberlerine ve iletişime **köprü** vermek (sayfa şu an yalnız `/kuyu-ruhsati/` rehberine ve 81 il sayfasına bağlanıyor).

---

## 3. Mevcut dönüşüm mimarisi [Ö]

| Kanal | Yer | Durum |
|---|---|---|
| Sabit WhatsApp düğmesi | 523/523 HTML (Sayfa.astro + ana sayfa + harita + 404) | Var (08.09). `/whatsapp/` → 302 → wa.me. **Tıklama sayacı ölçülmüyor.** |
| "Sonraki adım" bloğu | Her rehber sonu | `/durumum/` + `/hangi-kurum/` + **"Bu konuda görüş alın" mailto** |
| İletişim formu | Ana sayfa `#iletisim` | JS ile mailto'ya çevrilir; sunucu yok |
| E-posta | `bilgi@suharitasi.com` | Footer + künye |
| Telefon | **Yok** | M7: numara doğrulanamadı → HTML'e konmadı |
| Yazar/büro künyesi | Her sayfa | Av. Serdar Arslan · Arslan Hukuk Bürosu (arslanhukuk.tr) |

**Kritik boşluk:** kullanıcının bahsettiği **telefonla arama** kanalı sitede hiç yok. Arayan kişi muhtemelen büro sitesi/künye üzerinden ulaştı. Telefonu siteye koymak [K] kararıdır (M7 doğrulama + TBB reklam sınırı).

**TBB notu:** Site bilinçli olarak "hizmet vaadi/çağrı yok" ilkesiyle yazılmış (`src/data/site.ts`). Bu raporun tüm önerileri bu sınır içindedir: **bilgilendirici içerik + nesnel iletişim kanalı**, agresif "hemen ara/dava aç" dili yok.

---

## 4. Önceliklendirme — hangi sayfa, hangi kelime

Sıralama: ticari değer × mevcut görünürlük açığı × niyet netliği.

| # | Sayfa | Neden | Mevcut [Ö] | Hedef niyet kümesi |
|---|---|---|---|---|
| **1** | `/rehberler/ruhsatsiz-kuyu-cezalari/` | En acil niyet, en büyük açık | 0 tık / 15 göst / poz 12,7 | kaçak kuyu cezası, izinsiz sondaj cezası, ruhsatsız kuyu para cezası, kuyu kapatma |
| **2** | `/rehberler/kuyu-belgesi-iptal-davalari/` | En iyi dönüştüren (CTR %11, poz 3,7) | 4 tık / 36 göst | işletme belgesi iptali, DSİ belge iptal davası, idari işlem iptali, yürütmeyi durdurma |
| **3** | `/rehberler/kaynak-hakki-komsu-su/` | Komşu su uyuşmazlığı = doğrudan müvekkil | 3 tık / 60 göst / poz 8,4 | başkasının arazisinden su geçirme, tapulu araziden su, mecra irtifakı, kaynak hakkı |
| **4** | `/rehberler/kuyu-ruhsati/` | Ticari omurganın merkezi, artık dizinde | 0 tık / 3 göst | kuyu ruhsatı nasıl alınır, yeraltı suyu kullanma belgesi, ıslah-tadil |
| **5** | `/rehberler/kaynak-suyu-kiralama/` | Zaten poz 4,1 ve tık üretiyor | 6 tık / 81 göst | kaynak suyu kiralama, ihalesiz kiralama iptali, kaynak suyu ihalesi |
| **6** | `/rehberler/su-tahsisi-oncelik-sirasi/` | Sanayi/ziraat yatırımcısı personası bağlı | 0 tık / 18 göst / poz 5,1 | su tahsis başvurusu, su tahsis önceliği, tahsis kriterleri |
| **7** | `/su-kanunu/` | Yüksek hacim (25 göst) ama poz 29 | 0 tık / 21 göst | su kanunu, 167 sayılı kanun, su kanunu maddeleri |
| **8** | `/nerede-su-cikar/` | En çok tık (19) ama hukuki değil | 19 tık / 135 göst | köprü: → ruhsat + ceza + iletişim |
| **9** | `/rehberler/baraj-kamulastirmasi/` | Kamulaştırma niyeti, düşük rekabet | 1 tık / 9 göst | baraj istimlak bedeli, kamulaştırmasız el atma, ecrimisil |
| **10** | `/rehberler/jeotermal-ruhsat/` | Enerji yatırımcısı personası bağlı | 0 tık / 26 göst / poz 5,6 | jeotermal ruhsat, jeotermal işletme ruhsatı |

### Persona sayfaları (dönüşüm hunisinin üstü) [Ö]
`/durumum/` altındaki yüksek değerli personalar zaten ilgili rehbere bağlı:
- **Enerji yatırımcısı (HES/JES)** → jeotermal-ruhsat + baraj-kamulastirmasi
- **Sondaj / arıtma firması** → kuyu-ruhsati + ruhsatsiz-kuyu-cezalari
- **Sanayi / OSB yatırımcısı**, **Ziraat odası / sulama kooperatifi**, **Maden işletmecisi** → su-tahsisi
- **Gayrimenkul geliştirici** → kaynak-hakki + kuyu-ruhsati
- **Gıda-içecek üreticisi** → kaynak-suyu-kiralama + vaka/meysu

Bu personalar ticari değeri en yüksek giriş noktaları; hukuk rehberleriyle çift yönlü bağ güçlendirilmeli.

---

## 5. Hedef anahtar kelime kümeleri

**[Ö]** = GSC'de görülmüş · **[T]** = doğal türev (uydurma hacim yok).

### Küme A — Kaçak / ceza (sayfa #1)
- [Ö] kaçak sondaj cezası · izinsiz sondaj cezası
- [T] ruhsatsız kuyu açma cezası · kaçak kuyu cezası ne kadar · kuyu kapatma kararı · belgesiz sondaj yaptırımı · kaçak kuyu şikayeti · sondaj firması cezası · 167 sayılı kanun 18. madde ceza

### Küme B — Belge iptali / idari dava (sayfa #2)
- [Ö] işletme belgesi (iptali)
- [T] kuyu belgesi iptal davası · DSİ belge iptali · idari işlem iptali su · yürütmeyi durdurma kuyu · kullanma belgesi iptali · ıslah-tadil belgesi reddi · belge başvurusu reddi dava

### Küme C — Komşu su / kaynak hakkı (sayfa #3)
- [Ö] başkasının arazisinden su geçirme hakkı · su borusu geçirme hakkı · tapulu araziden çıkan su kime aittir · kaynak sularının kullanım hakkı
- [T] mecra irtifakı · komşu parselden su alma · kaynak hakkı tescili · komşu su davası · kaynak suyu kime ait · yeraltı suyu komşu hakkı

### Küme D — Ruhsat / tahsis (sayfa #4, #6)
- [Ö] işletme belgesi · su kanunu
- [T] kuyu ruhsatı nasıl alınır · yeraltı suyu kullanma belgesi · arama belgesi · ıslah-tadil belgesi · DSİ kuyu ruhsatı başvurusu · su tahsis başvurusu · su tahsis öncelik sırası

### Küme E — Kiralama (sayfa #5)
- [T] kaynak suyu kiralama · kaynak suyu ihalesi · ihalesiz kiralama iptali · belediye kaynak suyu işletmesi · 167 sayılı kanun m.4 kiralama

### Küme F — Kamulaştırma / jeotermal (sayfa #9, #10)
- [Ö] baraj istimlak bedelleri ne kadar
- [T] baraj kamulaştırması · kamulaştırmasız el atma · ecrimisil baraj · jeotermal ruhsat · jeotermal işletme ruhsatı süresi

### Küme G — Genel hukuk / avukat (sayfa #7)
- [Ö] su kanunu · su kanunu nedir
- [T] 167 sayılı yeraltı suları kanunu · su hukuku nedir · su hukuku avukatı *(dikkat: TBB sınırı — bilgilendirici çerçeve)*

---

## 6. İçerik boşlukları ve öneriler

1. **`/su-hukuku/` hub sayfası yok** (25.08'de kaldırılmış). 10 hukuk rehberini niyet etiketli tek girişten toplayan bir hub, hem iç bağlantı otoritesini hem kullanıcı yolunu güçlendirir. [K] kapsam kararı.
2. **`ruhsatsiz-kuyu-cezalari` derinleştirme:** mevcut sayfa rejimi anlatıyor ama "ceza ne kadar (2026 tutarı)", "nasıl tespit edilir", "kapatma kararına itiraz", "uzlaşma/indirim", "sondaj şirketinin sorumluluğu" başlıkları yok. Kaçak kuyu sorguları bu sayfaya iniyor; SSS ile birebir karşılanmalı.
3. **`kuyu-belgesi-iptal-davalari` uygulama katmanı:** "iptal davası dilekçesinde hangi unsurlar", "süre", "yürütmeyi durdurma" pratik bölümleri. Sayfa zaten en iyi dönüştürüyor; derinleştirme doğrudan telefon/e-posta getirir.
4. **`kaynak-hakki-komsu-su` tapu/irtifak bölümü:** "kaynak hakkı nasıl tescil edilir", "mecra irtifakı şerhi" — komşu su uyuşmazlığı yaşayan malikin ilk aradığı şey.
5. **Coğrafya → hukuk köprüsü:** 08.09 raporu ölçtü — göl/nehir/havza sayfalarından hukuk rehberine doğrudan bağ **0**. İlgili coğrafya sayfalarına (ör. baraj gölleri → kamulaştırma; su havzası → tahsis) tek cümlelik bağ eklenmeli. [K] kapsam.
6. **`/nerede-su-cikar/` dönüşüm köprüsü:** 19 tık alan bu kapı, suyun bulunacağını söylüyor; "buldum, şimdi izin/ruhsat ne olacak?" sorusunu `kuyu-ruhsati` + `ruhsatsiz-kuyu-cezalari` + iletişime bağlamalı.

---

## 7. Ölçüm planı ve sonraki adım

1. **WhatsApp tıklama sayacı** (Pages Function + KV) çalışıyor mu? `/whatsapp/?sayac=<secret>` ve `arac/whatsapp-sayac.sh` ile okunmalı. Sayaç global; **sayfa bazlı kırılım** için path parametresi eklenmeli. Bu, hangi hukuk sayfasının telefon/WhatsApp getirdiğini ölçmenin tek yolu.
2. **GA4 kurulumu** (dönüşüm ölçümünün kalıcı çözümü): Analytics Admin + Data API'yi `suharitasi-gsc` projesinde aç, servis hesabına GA4 Viewer ver, siteye GA4 etiketi ekle. O zamana kadar tüm dönüşüm verisi WhatsApp sayacı + sunucu logu.
3. **Telefon kararı [K]:** arama kanalı siteye konsun mu? Konsun ise TBB çerçevesi içinde yalnız künyede/iletişim bloğunda, çağrı dili olmadan.
4. **06.10.2026 kıyası** (SIRADAKILER'de planlı): bu raporun tabanı — hukuk kapısı 37 tık/444 göst (28 gün), rehber dizin durumu, WhatsApp 0 ölçüm.

---

## 8. Veri uyarıları

- **Sorgu anonimleştirmesi:** GSC bu mülkte sorgu boyutunu büyük ölçüde gizliyor. 28 günde toplam 197 tıkın yalnız **50'si** sorguya atfedilebiliyor (%25). "Hukuki sorgu = 0 tık" sonucu bu nedenle eksiktir; §1.3 sayfa toplamları esas alınmalı.
- **Gösterim sıçraması (09-06):** 4.354 gösterim / 8 tık. Tek günlük; kaynağı doğrulanmadı.
- **Pozisyonlar 1. sayfa dışı (26–67):** küçük örneklemde tek satırlık sorgular; yön bilgisi verir, kesin sıralama değil.
- **GA4 yok:** dönüşüm oranı, kanal, cihaz kırılımı bu rapora giremedi.
