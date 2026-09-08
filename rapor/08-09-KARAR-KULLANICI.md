# 08.09.2026 — KULLANICI KARARI BEKLEYEN KALEMLER (güncel durum)

Kaynak işler: `rapor/08-09-gsc-ticari-whatsapp.md` (sabah, GSC + WhatsApp)
ve `rapor/08-09-karar-kapatma.md` (akşam, karar dosyası kapatma + tekrar
önleyiciler). Brief kuralı: dört sınıf (hukuki metin · ücretli adım · geri
alınamaz silme · marka kimliği) uygulanmaz, burada KULLANICI KALEMİ olarak
kalır. Aşağıda önce durum tablosu, sonra kalan kalemler adım adım.

## Durum tablosu

| Kalem | Sabah kararı | Akşam durumu |
|---|---|---|
| §A akademik künyeler — seçenek 3 (alaka süzgeci) | öneri | **UYGULANDI** (1.979 → 1.118 künye; 777 → 494 yazar adı; 3 ilde açık şerh) |
| §A seçenek 2 (yazar adını düşürme, KVKK) | kullanıcı | **KULLANICI KALEMİ** (aşağıda) |
| §B OSM tip çelişkisi | kullanıcı | **UYGULANDI** (39 kayıt DSİ/EPİAŞ atfıyla yerelde düzeltildi; 18 doğrulanamayan kayıt şerhli) — kalan 18 aşağıda |
| §C üç rehber dizinde değil | kullanıcı | **İZLEME KURULDU** (haftalık, Çar 10:30 UTC) — dizin kararı Google'da; aşağıda |
| §D6 şema telefon alanı | kullanıcı | **UYGULANDI** (Organization.telephone, 520 sayfa) |
| §D7 tıklama ölçümü | kullanıcı | **KOD HAZIR** (Pages Function + KV); **KV bağlama + secret panelden — KULLANICI ADIMI** (aşağıda) |
| §D7 Cloudflare Web Analytics | kullanıcı | **KULLANICI ADIMI** (panel; kod tarafında iş yok) |
| §E WhatsApp düğmesi canlı onayı | kullanıcı | **KULLANICI KALEMİ** |
| Deploy sessizliği / cron tıkanması (tekrar önleyici) | — | **UYGULANDI** (md25 deploy yaşı + Telegram; cron açık dosya listesi; ata-kontrollü pull) |

---

## KULLANICI KALEMİ 1 — §D7: WhatsApp sayacını canlıya bağlama (panel, ~5 dk)

Kod canlıda: `functions/whatsapp.js` her `/whatsapp/` isteğinde 302 → wa.me
döner (KV yokken de — kanıtlı). Sayım, KV bağlanınca başlar.

1. **KV namespace oluştur:** Cloudflare panel → **Workers KV** (sol menü
   "Storage & Databases" altında) → **Create instance** → ad:
   `suharitasi-wa-sayac` → Create.
2. **Pages projesine bağla:** **Workers & Pages** → `suharitasi` (Pages) →
   **Settings** → **Bindings** → **Add** → **KV namespace** →
   Variable name: `WA_SAYAC` (aynen, büyük harf) → KV namespace:
   `suharitasi-wa-sayac` → ortam sorulursa **Production** ve **Preview**
   ikisini de seç → Save.
3. **Okuma anahtarı (secret):** aynı proje → **Settings** → **Variables and
   Secrets** → **Add** → Variable name: `SAYAC_ANAHTAR` → Value: sunucudaki
   `/home/suha/projeler/suharitasi/.env` dosyasındaki `WA_SAYAC_ANAHTAR=`
   satırının değeri (bu oturumda üretildi; buraya yazılmadı) → **Encrypt**
   → Save. (Bu adım atlanırsa sayım yine çalışır, yalnız okuma yolu kapalı
   kalır.)
4. **Yeniden deploy:** bağlamalar bir sonraki deploy'da etkinleşir —
   **Deployments** → son deploy → **Retry deployment** (ya da herhangi bir
   push'u bekle; baraj cron'u her gün 15:05 UTC push'lar).
5. **Kota bitişi davranışı (isteğe bağlı, önerilir):** Settings →
   **Runtime** → **Fail open** (ücretsiz plan 100.000 Functions isteği/gün
   biterse statik `_redirects` yedeği devreye girer; düğme kırılmaz, yalnız
   sayım durur).
6. **Doğrulama (sunucuda tek komut):** `arac/whatsapp-sayac.sh --ozet` →
   "WhatsApp tıklama: bugün N · toplam N". Bağlama yoksa betik "SAYAÇ HENÜZ
   KURULMADI" der. Tek adres: `https://suharitasi.com/whatsapp/?sayac=<anahtar>`
   (JSON; gün → sayı; kişisel veri yok).
   Sağlık: md3 artık `/whatsapp` yanıtında `x-kaynak: fn` başlığını izler;
   Function devre dışı kalırsa SARI.

E6 tabanı: sayaç 0'dan başlar (KV bağlandığı gün). 06.10.2026 kıyasında
`arac/whatsapp-sayac.sh` çıktısı kullanılacak.

## KULLANICI KALEMİ 2 — §D7: Cloudflare Web Analytics (panel, ~1 dk)

Ölçüm: canlı HTML'de beacon yok (28.07 ve 08.09). Adımlar: **Workers &
Pages** → `suharitasi` → **Metrics** → Web Analytics altında **Enable**.
Beacon bir sonraki deploy'da otomatik enjekte edilir; CSP hazır
(`static.cloudflareinsights.com` + `connect-src 'self'`), `Cache-Control:
public, no-transform` engeli yok. Kod tarafında yapılacak iş YOK.
Doğrulama: deploy sonrası `curl -s https://suharitasi.com/ | grep -c
cloudflareinsights` → ≥1. Not: Web Analytics yalnız sayfa görüntüleme/CWV
ölçer; düğme tıklamasını Kalem 1'deki sayaç ölçer.

## KULLANICI KALEMİ 3 — §C: üç rehberin dizin durumu (Google kararı)

Zaman çizgisi (URL Inspection API, tr-TR):
- 08.09 08:43Z: kuyu-ruhsati "Tarandı, dizine eklenmedi" (son tarama
  18.07) · su-tahsisi "Keşfedildi, eklenmedi" · kuyu-tasima "URL bilinmiyor".
- Kullanıcı elle dizin isteği yaptı → 11:38Z'de üçü tarandı; 11:52Z
  ölçümü: **"Gönderildi ve dizine eklendi" (PASS)**.
- 17:16Z (haftalık betik) ve 17:17Z (MCP), AYNI 11:38Z taramasına ait
  sonuç: **"Tarandı - şu anda dizine eklenmiş değil" (NEUTRAL)**. Yani
  dizine giriş kalıcı olmadı; Google tarama sonrası değerlendirmede üçünü
  yeniden dışarıda bıraktı.
Kurulan izleme: her Çarşamba 10:30 UTC haftalık GSC koşumu üç URL'yi
denetler; durum/verdict değişince ya da ilk gösterim/tıklama gelince
Telegram'a düşer (`/home/suha/gsc-cikti/indeks-durum.json`, ilk kayıt
08.09 17:16Z).
Karar/hipotez (kanıtlanmadı): 81 il sayfası "kuyu ruhsatı" varlığıyla
başlıklı; Google rehberi bu kümeyle tekrar sayıyor olabilir. Seçenekler:
(a) beklemek — izleme raporlar; (b) rehber title/H1'ini il sayfalarından
ayrıştırmak — **ölçmeden uygulama yasağı** (KARARLAR §37): önce hipotez
testi tanımlanmalı (ör. tek rehberde değişiklik + 4 hafta izleme), ayrı
brief; (c) Indexing API — politika dışı, kullanılmayacak.

## KULLANICI KALEMİ 4 — §A seçenek 2: yazar adlarını düşürme (KVKK)

Süzgeç sonrası 81 il sayfasında **494 farklı yazar adı** (görünen biçim:
ilk 3 yazar, 440 ad). Hepsi OpenAlex DOI'li yayın künyesi; KVKK m.28
değerlendirmesi hukukçunun. Uygulanırsa tek satır:
`src/components/IlPotansiyel.astro` künye satırındaki
`{k.yazarlar.filter(Boolean).slice(0, 3).join(', ')}{k.yazarlar.length > 3 && ' vd.'} `
parçası kaldırılır (başlık + yıl + dergi + DOI kalır). Sonuç: kişisel veri
0, atıf bütünlüğü zayıflar (yazarsız künye). Karar sizin.

## KULLANICI KALEMİ 5 — §B: doğrulanamayan 18 göl kaydı

Ad ile kaynak türü çelişiyor, depo içi DSİ 2024 4.1/4.6 ve EPİAŞ
listelerinde il + ad eşleşmesi yok; sayfada "bir su kütlesidir (tür
kaynakta çelişkili, doğrulanmadı)" + Tür satırında açık şerh basılıyor:
- Baraj adlı, kaynakta "lake"/etiketsiz: Bayburt Baraj Gölü (Kars), Gülüç
  Baraj Gölü (Zonguldak), jenerik "Baraj Gölü" (Karaman; tesis belirsiz).
- Baraj adlı, il farklı (KISMİ): Karakaya Baraj Gölü (site il Malatya,
  DSİ "Diyarbakır-Karakaya Barajı" — gölü üç ile yayılır), Kültepe Baraj
  Gölü (Aksaray ↔ DSİ Kırşehir).
- Gölet adlı, kaynakta "lake": Kutlu Aktaş, Belevi (İzmir), Çağsere,
  Değirmi (Van), Yüzüncü Yıl (Amasya), Çerkezmüsellim (Tekirdağ), Soğulca
  (Ankara), Şenkaya (Erzurum; yalnız ilçe adı çakışıyor), Akbenli, İğdeli
  (Yozgat), Kıranköy (Uşak), İkizce (Ankara ↔ DSİ Antalya-Kaş).
- Lagün: Hersek Lagünü (Kocaeli) — depoda hiçbir kaynak.
Seçenekler: (a) olduğu gibi bırak (şerhli, yanlış iddia yok); (b) Karakaya
ve Kültepe için "il farklı olsa da aynı tesis" kararı — verirseniz iki
kayıt `src/data/gol-tip-duzeltme.js`'e eklenir (DSİ satırı hazır);
(c) jenerik "Baraj Gölü" ve "Gölet" sayfalarını (tesis belirlenemiyor)
yayından çekmek — sayfa kapatma kararı sizin; (d) OSM'de düzeltme (OSM
hesabı; kaynak değişimi = kara liste, sizin kararınız).

## KULLANICI KALEMİ 6 — §E: WhatsApp düğmesi canlı onayı

Üç sayfada (ana sayfa, bir havza, bir rehber) düğme; mobilde imza satırı
kapanmıyor mu; wa.me açılıyor mu. Kareler
`cikti/denetim/whatsapp-dugme/`. Not: JSON-LD'de telefon artık
`view-source`da görünür (kararınızla).

## Bilgi notu — yapılmayanlar ve sınırlar
- Indexing API (`google_indexing_publish`) kullanılmadı (politika).
- GA4: MCP projesinde Analytics Admin API kapalı (403); ayrıca çerez/
  aydınlatma metni gerektirdiğinden hukuki-metin sınıfı — açılmadı.
- Cloudflare panel adımları bu sunucudan yapılamaz (API token yok);
  yukarıdaki adımlar dokümandan (developers.cloudflare.com, 08.09.2026).
