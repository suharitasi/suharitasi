# Denetim kapsamı haritası (28.07.2026) — salt-okunur, uygulama yok

Yöntem: kalemler `arac/site-saglik.mjs`'ten `kaydet()` çağrıları ve mod
etiketleriyle ÇIKARILDI; araç envanteri `arac/*.mjs` başlıklarından;
boşluklar canlı sitede ölçüldü. Kafadan tahmin yok — her satırın dayanağı
ya kaynak satırı ya canlı ölçüm.

**Mevcut durum:** 14 otomatik kalem (`--tam` 13 + deploy), günde 2 kez
cron (07:30/19:30 UTC) + her deploy sonrası `--hizli` (6 kalem) + bağımsız
`saglik-bekcisi.sh` (07:00 UTC).

---

## Boyut haritası

| # | Boyut | Şu an denetleniyor mu | Kanıt | Boşluğun somut riski | İş |
|---|---|---|---|---|---|
| 1 | **Teknik erişim** | ✅ TAM | md1 sitemap (174 URL + ±%20 bandı) · md2 erişim (--tam 174/174, --hizli çekirdek 10) · md3 yönlendirme (4/4, `beklenen-301.json`) | — | — |
| 2 | **Konsol/JS hatası** | ✅ | md5 — çekirdek 10 sayfa | Çekirdek dışı 164 sayfada JS hatası görünmez | Küçük |
| 3 | **Medya oynatma** | ✅ | md4 — 6/6 sahne, readyState≥2 + currentTime>0 + döngü | — | — |
| 4 | **İç bağlantılar** | ✅ | md6 — 138 benzersiz link, kırık 0 (yalnız `--tam`) | — | — |
| 5 | **Veri doğruluğu (bütünlük)** | ⚠️ KISMİ | md11 — yalnız **3 dosya** (`hangi-kapi`, `su-birimleri`, `su-islemleri`) | `veri/potansiyel/*` (11 dosya: 472 kütle, 419 RG, morfoloji, 1.979 künye) ve `data/canli/*` (baraj, GRACE) **bütünlük denetimi dışında** — bir pipeline bunları bozarsa/küçültürse sessiz kalır. Sayfalardaki rakamlar build'de sayıldığı için YANLIŞ SAYI yayımlanır. | **Orta** |
| 6 | **Veri tazeliği** | ⚠️ KISMİ | `saglik-bekcisi.sh` — yalnız `baraj.json` + sağlık durum dosyası | RG nöbetçisi (Sal) ve NHYP nöbetçisi (Çar) crona kurulu ama **kendi state dosyalarının tazeliği izlenmiyor** (SIRADAKILER'de açık kalem). Nöbetçi sessizce ölürse kimse görmez. | Küçük |
| 7 | **Görsel/düzen** | ✅ YENİ | md14 G1-G6 (28.07) — metin-görsel örtme, ölçek, tipografi, ritim, ortalama, S1; taban `izleme/gorsel-taban.json`, falsifikasyon 6/6 | Kapsam: 10 sayfa × 2 kırılım. İl/rehber şablonlarının **tek örneği** ölçülüyor | — |
| 8 | **Etkileşim** | ✅ | md12 — 4/4 (menü/filtre/arama/bağ), varlık değil İŞLEV | — | — |
| 9 | **Kontrast (a11y alt kümesi)** | ✅ | md13 — 6 sayfa tipi, en dar pay 3,5:1 | — | — |
| 10 | **Erişilebilirlik (genel)** | ❌ **YOK** | md9 `onlyCategories: ['performance']` (ölçüldü: kaynak satır 707) | **En büyük boşluk.** Klavye tuzağı, odak sırası, ARIA hataları, eksik alt metin, form etiketi, başlık hiyerarşisi — hiçbiri ölçülmüyor. Bugün reduced-motion'da kadrajın gizlendiği arıza **insan gözüyle bile değil, tesadüfen** yakalandı. YMYL hukuk sitesinde erişilebilirlik hem etik hem itibar riski | **Küçük** (LH'ye kategori eklemek) |
| 11 | **Performans** | ✅ | md9 — 10 sayfa, LH performance (mobil 72-95, masaüstü 93-99) | ŞERH: tek atış, "3 tur medyan" kuralı uygulanmıyor (SIRADAKILER'de kullanıcı kararı bekliyor) — yanlış regresyon alarmı üretebilir | Küçük |
| 12 | **Mobil kullanılabilirlik** | ⚠️ KISMİ | md8 — yalnız yatay taşma (10 sayfa) · md14 G6 — S1 ilk ekran | **Dokunma hedefi boyutu (≥44px), yazı boyutu okunabilirliği, viewport meta, yatay kaydırma dışı mobil sorunlar** ölçülmüyor. `arac/rev1-dokunma-olc.mjs` VAR ama sağlık sistemine bağlı değil | Küçük |
| 13 | **SEO (teknik)** | ⚠️ KISMİ | md7 — çekirdek 10 sayfada 4 alan: öz-cevap, JSON-LD, title, canonical (ölçüldü) · `arac/seo-audit.mjs` 15 kalem VAR ama **cron'a bağlı değil** | md7 **meta-description, og:*, img-alt, title uzunluğu/tekrarı, h1 sayısı** ölçmüyor; seo-audit bunları ölçüyor ama elle çalıştırılıyor. 174 sayfada başlık tekrarı/eksik alt sessiz kalır | **Küçük** (mevcut aracı bağlamak) |
| 14 | **GEO (AI arama)** | ⚠️ KISMİ | md7 öz-cevap+JSON-LD · `arac/geo-audit.mjs` (öz-cevap ≤280, JSON-LD tip, JS'siz DOM, soru-başlık) cron dışı | llms.txt/robots.txt canlı doğrulaması otomatik değil; AI botlarının erişimi bir gün kapansa görülmez | Küçük |
| 15 | **Sosyal önizleme** | ❌ **YOK** | Ölçüldü: og:image **tüm sayfalarda aynı** (`og-suharitasi.v1.png`, 200/109 KB) | Kart görseli bozulsa/silinse (404) hiçbir kalem görmez; paylaşımlar kırık kartla çıkar. Sayfa-özel OG üretimi de yok (`arac/og-uret.mjs` var, kullanılmıyor) | Küçük |
| 16 | **Güvenlik başlıkları** | ⚠️ KISMİ | CSP izinli-kaynak listesi (`csp-izinli-kaynaklar.json`) md ile denetleniyor; canlıda 6 başlık var (HSTS, CSP, Permissions-Policy, Referrer-Policy, X-Content-Type, X-Frame) | Başlıkların **varlığı/değeri** düzenli doğrulanmıyor — biri düşse (Cloudflare ayarı, `_headers` düzenlemesi) sessiz kalır. CSP arızası 23.07'de tam olarak böyle yaşandı | Küçük |
| 17 | **Bağımlılık güvenliği** | ❌ **YOK** | Ölçüldü: `npm audit --omit=dev` → **4 açık (1 düşük, 3 yüksek)**, sharp/libvips CVE'leri | Yüksek açıklar denetimsiz birikiyor. Not: denetimde bu 3 high'ın tetiklediği özelliklerin kullanılmadığı kanıtlanmıştı (25.07) — ama **yeni bir açık geldiğinde kimse bakmıyor** | Küçük |
| 18 | **İçerik bütünlüğü (kaynak↔yayın)** | ⚠️ KISMİ | Build-time assert'ler: kapi.js/vitrin.js/rg-sayi.js/anasayfa-satis.js/RehberKapanis sayı bekçileri, kapi-sss ham-metin doğrulaması | Bunlar **build'de** çalışır; yayımlanmış sayfada içerik çürümesi (bayat künye, ölü dış link) ölçülmüyor. `KAYNAKLAR.md`'nin OpenAlex satırının aylarca bayat kalması bunun örneği | Orta |
| 19 | **Dış bağlantı sağlığı** | ❌ **YOK** | md6 yalnız İÇ linkleri tarıyor (kaynak: `bulunan` seti `/` ile başlayanlar) | RG arşivi, MTA katalog, OpenAlex DOI, DSİ bağlantıları — **yüzlerce dış künye linki** hiç kontrol edilmiyor. Künyeye dayalı otorite iddiasının altı boşalabilir | Orta |
| 20 | **Hukuki uyum** | ❌ **YOK** | Ölçüldü: sitede KVKK/aydınlatma/çerez/gizlilik sayfası **yok**; `/hakkinda/`da bu sözcükler geçmiyor (0 eşleşme) | Site kişisel veri toplamıyor gibi görünüyor (form yok, yalnız mailto — ölçüldü) ama **CF Web Analytics kurulu** ve bülten planlanıyor. Aydınlatma metni yokluğu KVKK riski; TBB reklam yasağı uyumu da denetimsiz | **Orta** (içerik kullanıcıdan/[SERDAR-HUKUK]) |
| 21 | **Dönüşüm yolları** | ❌ **YOK** | Ölçüldü: ana sayfada 1 mailto, form 0. Hiçbir kalem CTA'ların varlığını/hedefini doğrulamıyor | Bir CTA linki kırılsa ya da mailto bozulsa md6 (iç link) yakalamaz — `mailto:` iç link değil. Dönüşüm yolu sessizce ölür | Küçük |
| 22 | **404/hata sayfası** | ⚠️ KISMİ | Ölçüldü: `/olmayan-sayfa/` → 404 ✓, `dist/404.html` var ama `src/pages/404.astro` **yok** (Astro varsayılanı) | Marka dışı çıplak 404; kullanıcı kaybı. Kalem yok | Küçük |
| 23 | **Yedek/geri dönüş** | ⚠️ KISMİ | git + Cloudflare Pages sürümleri; `data/arsiv/` (baraj 13 gün, GRACE) | Veri arşivlerinin **depo dışı yedeği yok**; sunucu kaybında `kaynak/dsi-arsiv` (230 dosya, 54 MB) ve RG taramaları yeniden üretilemez (DSİ 2021-22 baskıları zaten silinmişti) | Orta |

---

## Öncelik sıralı öneri listesi

Sıralama ölçütü: **(riskin somutluğu × sessizlik süresi) ÷ iş**.

| Sıra | İş | Neden bu sırada | Boyut | İş |
|---|---|---|---|---|
| 1 | **LH'ye `accessibility` kategorisi ekle** (md9 `onlyCategories`) | Tek satırlık değişiklik, en büyük ölçüm boşluğunu kapatır. Eşik ölçülerek belirlenir (mevcut skorlar bilinmiyor — önce ölç, sonra eşik) | 10 | Küçük |
| 2 | **`seo-audit.mjs` + `geo-audit.mjs`'i md'ye bağla** | Araçlar YAZILI ve çalışıyor, yalnız cron'a bağlı değil. 174 sayfada meta/og/alt/title denetimi bedavaya gelir | 13, 14 | Küçük |
| 3 | **Dış bağlantı nöbeti** (haftalık, örneklemli) | Sitenin otorite iddiası künyelere dayanıyor; ölü künye = iddianın altı boş. Tam tarama pahalı → haftalık N örneklem + tümü aylık | 19 | Orta |
| 4 | **`veri/potansiyel/*` + `data/canli/*` bütünlük kalemine** | md11 deseni hazır (kayıt sayısı düşüşü + şema); 11 dosya eklemek mekanik. Yanlış sayı yayımlama riskini kapatır | 5 | Orta |
| 5 | **Güvenlik başlığı + og:image + CTA nöbeti** (tek kalem) | Üçü de "canlıda şu HTTP/varlık duruyor mu" tipinde; tek kalemde toplanır | 15, 16, 21 | Küçük |
| 6 | **Nöbetçi canlılık kalemleri** (rg-nobetci, nhyp-nobetci state tazeliği) | SIRADAKILER'de zaten açık; bekçi deseni hazır (baraj/GRACE emsali) | 6 | Küçük |
| 7 | **`npm audit` kalemi** (yüksek/kritik → sarı, yeni CVE → bildir) | Şu an 3 yüksek açık var ve kimse bakmıyor; otomatik onarım YOK, yalnız bildirim | 17 | Küçük |
| 8 | **Mobil dokunma hedefi kalemi** | `arac/rev1-dokunma-olc.mjs` var; md14 deseniyle bağlanır | 12 | Küçük |
| 9 | **KVKK/aydınlatma metni** | İş teknik değil İÇERİK: [SERDAR-HUKUK] kararı ister. CF Analytics kurulu + bülten planlı olduğu için ertelenmemeli | 20 | Orta (hukuki) |
| 10 | **Marka 404 sayfası** | Düşük risk, düşük iş; sıraya en sona | 22 | Küçük |
| 11 | **Depo dışı veri yedeği** | Gerçekleşme olasılığı düşük ama etkisi geri döndürülemez (silinen DSİ baskıları emsali). Karar kullanıcının: nereye, hangi maliyetle | 23 | Orta |

### Sıralamaya girmeyen, kayda geçen iki şerh
- **md9 tek atış** (performans): "3 tur medyan" kuralı uygulanmıyor; SIRADAKILER'de kullanıcı kararı bekliyor (koşu süresi ×3 vs eşik gevşetme). Yeni kalem değil, mevcut kalemin bilinen sınırı.
- **md14 kapsamı**: il/rehber şablonlarının tek örneği ölçülüyor. Şablon başına 1 örnek yeterli sayıldı (28.07 varyans ölçümü: aynı şablonun 5 örneği arasında G1/G3/G5 varyansı 0) — ama **G4 rehber grubunda sayfadan sayfaya değişiyordu**, yani rehber şablonunda ikinci bir örnek eklemek ölçülü bir iyileştirme olur.

---

**Uygulama yok** — bu harita karar için. Hangi sıradan başlanacağı kullanıcının.
