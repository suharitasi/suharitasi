# Nehir/Akarsu Sayfaları — SERP & CTR Sızıntısı Teşhisi

Tarih: 2026-09-21 · Yöntem: GSC (28g) + Google Suggest (TR) + şablon/şema denetimi
+ veri kapsam ölçümü. Ham SERP (AIO/maps) **ölçülemedi** (aşağıda sınır).

## 1. Tablo (GSC, 22.08–18.09.2026)
| Metrik | Değer |
|---|---|
| Tıklama | 229 |
| Gösterim | 21.789 |
| CTR | %1,05 |
| Ort. konum | 9,65 |

CTR fırsatı sayfaları (yüksek gösterim / ~sıfır tıklama):
`/nehirler/gokirmak/` 4.864 imp · %0,02 CTR · pos 9,84 ·
`/nehirler/esen-cayi/` 2.196 imp · %0,05 · pos 8,94 ·
`/nehirler/kelkit-cayi/` 569 imp · %0,18 · pos 7,53.

## 2. Arama niyeti (Google Suggest, hl=tr/gl=TR — GERÇEK, ücretsiz)
- **gökırmak** → "gökırmak **tjk**", "gökırmak **at**", "gökırmak **maden**",
  "gökırmak nehri", "gökırmak nerede". **Baskın niyet NEHİR DEĞİL**: ünlü yarış
  atı "Gökırmak" + maden. → 4.864 gösterimin büyük kısmı **yanlış-niyet**
  (at/maden arayanlar), bu yüzden CTR ~0. **Başlıkla düzeltilemez**; kullanıcı
  zaten nehri aramıyor.
- **esen/eşen çayı** → "nereye **dökülür**", "nereden **doğar**", "kapalı havza
  mı", "harita", "**deltası**". **Gerçek hidrografi niyeti** (doğar/dökülür).
- **kelkit çayı** → "nereden **doğar**", "nereye **dökülür**", "harita",
  "vadisi", "hangi akarsuyun kolu". **Gerçek nehir niyeti**.

## 3. Veri kapsamı (tr-nehirler.json, 95 nehir)
| Alan | Dolu |
|---|---|
| uzunluk | **0/95** (alan yok) |
| alan_km2 | 0/95 |
| dokuldugu_yer | 33/95 |
| kolu_oldugu_akarsu | 32/95 |
| kaynak (künye) | 95/95 |
- gökırmak → döküldüğü: **"Kızılırmak"** (dolu)
- esen-cayi → döküldüğü: **null** · kelkit-cayi → döküldüğü: **null**

## 4. Mevcut şablon/şema durumu (ZATEN VAR)
`src/pages/nehirler/[slug].astro`:
- `<title>` = `"{ad} Nerede? Hangi Havzadan Geçer"` (≤60, niyet hizalı).
- `BodyOfWater` şeması (geo/GeoCoordinates/GeoShape, containedInPlace,
  additionalProperty, kaynak) — **mevcut**.
- `FAQPage` (nerede + hangi havzadan geçer) — **mevcut**.
- Şablon yorumu, "doğar/dökülür" niyetinin **veri yokken title'a girmeyeceğini**
  bilinçli olarak yazmış (uydurma yasağı).

## 5. Şartnameyle çelişkiler (DUR)
1. **DUR — "…Uzunluğu" ve "…Nereden Doğar, Nereye Dökülür" başlığı:**
   `uzunluk` alanı 0/95; esen/kelkit için `dokuldugu_yer` null. Bu başlıklar
   **uydurma/yanıltıcı** olur → proje "uydurma yasağı" ihlali. Yalnız veri OLMAYAN
   nehirlerde uygulanamaz.
2. **DUR — "Su Kalitesi, Debisi … (2026)" başlığı:** sitede nehir-bazlı su
   kalitesi/debi verisi **yok** → tıklama tuzağı; yasak.
3. **DUR — gökırmak CTR hedefi:** baskın arama niyeti nehir değil (at/maden).
   Bu sayfanın CTR'ını "yükseltmek" nehir içeriğiyle mümkün değil; hedef
   gerçekçi değil.
4. **DUR — above-the-fold hızlı bilgi kartı:** görsel/düzen işi → tasarım skill
   + kullanıcı canlı onayı ister; ayrı brief.
5. **SINIR — canlı SERP/AIO teşhisi:** `serp_check` MCP, DataForSEO kimlik
   bilgisi ister (`DATAFORSEO_LOGIN/PASSWORD` yok). Google'ı başsız tarayıcıyla
   kazımak bot-kalkanı nedeniyle güvenilmez. Niyet, ücretsiz Suggest ile
   ölçüldü; AIO/maps kanıtı **alınamadı**.

## 6. Veri-koşullu, meşru öneri (uygulanabilir çekirdek)
Yalnız **veri olan** nehirlerde (dökülür 33 / kolu 32) `<title>` ve `FAQPage`'e
gerçek "Nereye dökülür / hangi akarsuyun kolu" bilgisi eklenir:
- title örn. `"{ad} Nerede? {dokuldugu_yer}'a Dökülür"` (≤60 guard korunur);
- veri yoksa (esen/kelkit gibi) **mevcut başlık AYNEN kalır** — dokunulmaz.
- gökırmak için "Kızılırmak'ın kolu" (gerçek) eklenir; at/maden arayan
  kullanıcı yine gelmez (kabul; yanlış-niyeti kovalamayız).
Ölçüm: değişen 33 sayfanın GSC CTR'ı 28g pencerede izlenir.

## 7. Karar gerekenler (kullanıcı)
- Öneri-6 uygulansın mı (veri-koşullu title/FAQ; ~33 sayfa)?
- Quick-facts kartı için ayrı görsel brief açılsın mı?
- `DATAFORSEO` kimliği sağlanacak mı (canlı AIO/maps teşhisi için)?
