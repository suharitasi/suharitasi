# Su Kanunu İzleme — Kaynak Keşfi (salt-okunur)

**Amaç:** Su Kanunu TBMM izleme sisteminin (günde 2x cron + fark motoru + arşiv)
kurulabileceği resmî kaynakların gerçek erişilebilirliğini tespit. Sistem KURULMADI;
yalnız tespit.

**Test ortamı:** Bu sunucu — IP `89.167.42.221`, **Hetzner Online GmbH, Almanya (DE)**,
AS24940. **TR-IP DEĞİL.** Dolayısıyla aşağıdaki "TR-IP engeli" sütunu, yurt dışı bir
çıkıştan görünen engeli ölçer; hiçbir hedef bu çıkıştan engellenmedi.

**Tarih:** 2026-07-21 (test penceresi ~12:30–12:49 UTC).
**Bütçe:** ~33 istek (limit 60); istekler arası ≥5 sn; UA gerçekçi (Firefox 128);
robots.txt'e uyuldu (hiçbir Disallow yolu çekilmedi). `set -euo pipefail`, `2>/dev/null` yok.
**Doğrulanmayan hiçbir şey "erişildi" diye yazılmadı.**

---

## ÖZET KARAR

| Katman | En iyi izleme hedefi | Erişim | İzleme yöntemi |
|---|---|---|---|
| **K2 Resmî Gazete** | `/fihrist?tarih=YYYY-MM-DD` + `/eskiler/…/YYYYMMDD-N.htm` | 200, engelsiz | **Deterministik URL — fark motoruna gerek yok, tarih üret+çek** |
| **K1 TBMM** | `/yasama/kanun-teklifleri` sorgu + Çevre / Tarım-Orman komisyon sayfaları | 200, engelsiz | Sonuçlar AJAX/POST+CSRF; JS-render veya POST reverse |
| **K4 SYGM/Bakanlık** | `/Haber/{id}` + `/SYGM/…` + `dsi.gov.tr/duyuru/duyuruListe` | 200, engelsiz | Duyuru/haber listesi fark motoru |
| **K3 Mevzuat (mevzuat.gov.tr)** | `POST /aramasonuc` | 200, engelsiz | **Yalnız yasalaşma SONRASI** anlamlı (yürürlük metni) |

**K0 (hazır kanal) sonucu:** Hiçbir hedefte RSS/Atom/JSON içerik beslemesi veya resmî
API ucu YOK (detay aşağıda). Fark motoru + Resmî Gazete deterministik URL şeması esas
alınmalı.

**En kritik iki bulgu:**
1. **Resmî Gazete tarih-parametreli, makine-okunur URL şeması sunuyor** — fark motoru bile
   gereksiz; tarih üretip fihristi çekmek yeterli. En sağlam kanal bu.
2. **Yayındaki Su Kanunu Taslağı PDF'i 2019 tarihli** (`Last-Modified: 2019-10-31`).
   Nisan 2026 görüş turu metninin kamuya açık bir URL'i bu keşifte **doğrulanamadı** —
   görüş turu iç/dış paydaşa kapalı yürüyor olabilir (bkz. K4 + tarayıcı-testi listesi).

---

## K0 — HAZIR KANAL TARAMASI (öncelikli)

Her hedefin ana sayfa kaynağı `<link rel="alternate">`, `/rss`, `/feed`, JSON/API izi
için tarandı.

| Kaynak | Hazır kanal | Sonuç |
|---|---|---|
| tbmm.gov.tr | — | RSS/Atom/JSON **yok**. Yalnız "E-Posta" ibaresi (besleme değil). |
| resmigazete.gov.tr | — | "feed" izi = Bootstrap `form-control-feedback` (false-positive). Besleme **yok**. |
| mevzuat.gov.tr | — | Aynı `feedback` false-positive. Besleme **yok**. |
| tarimorman.gov.tr | — | Tek `rel="alternate"` = `/_vti_bin/spsdisco.aspx` (SharePoint keşif ucu, robots-Disallow; içerik beslemesi **değil**). |
| dsi.gov.tr | — | Ana sayfada 29 `/api/` izi çıktı — **hepsi** `cdniys.tarimorman.gov.tr/api/File/…` CMS medya-dosya API'si (resim/PDF servisi). İzlenebilir veri ucu **değil**. |

**Karar:** Hazır resmî kanal yok. İzleme, aşağıdaki HTML kaynakları üzerinde
fark motoru + Resmî Gazete deterministik URL ile kurulmalı.

---

## K1 — TBMM (tbmm.gov.tr)

robots.txt: `200`, **gövde boş (0 bayt)** → kısıtlama yok.

| URL | HTTP | Format | TR-IP | İçerik kararlılığı | İzleme notu |
|---|---|---|---|---|---|
| `https://tbmm.gov.tr/yasama/kanun-teklifleri` | 200 | HTML (sorgu formu) | yok | **gürültülü** (yalnız `X-CSRF-TOKEN` değişiyor; içerik kararlı) | "KANUN TEKLİFİ SORGU FORMU". Sonuç tablosu ilk HTML'de YOK → `POST /Yasama/Kanun-Teklifleri-Sonuc` (CSRF gerekir) veya JS-render. |
| `https://tbmm.gov.tr/Arama/Sonuc?q=su%20kanunu` | 200 | HTML | yok | test edilmedi (aday değil) | Genel arama **GET** ile çalışıyor; ama sonuçlar AJAX ile yükleniyor (ilk HTML'de yalnız kategori sekmeleri). "su kanunu" araması sayfa döndürüyor; içerik JS ile gelir. |
| `https://tbmm.gov.tr/ihtisas-komisyonlari/liste` | 200 | HTML | yok | — | Komisyon listesi statik. Su Kanunu'na bakan iki komisyon: **Çevre** (`…/cevre-komisyonu/f72877d1-b46d-…`) ve **Tarım, Orman ve Köyişleri** (`…/tarim-orman-ve-koyisleri-komisyonu/f72877d1-b476-…`). |
| `https://tbmm.gov.tr/Gundem/KomisyonGundemleri` | 200 | HTML | yok | — | Komisyon gündemleri; Su Kanunu teklifi görüşülürken burada belirir. İzleme değeri yüksek. |

**Diğer stabil yollar (keşfedildi):** `/Yasama/Kanunlar` (yasalaşanlar),
`/yasama/komisyon-raporlari`, `/kanun-ve-karar-bilgi-sistemi`.

**Sorgu formu alanları:** `IcerikArama`, `MetinArama`, `SonDurumu`, `EsasNumarasi`,
`DonemYasamaYili`, `IlkImzaSahibi`, `BaslangicTarihi`/`BitisTarihi` + CSRF.
İzleme için: dönem seçili + `IcerikArama=su kanunu` ya da komisyon filtreli POST →
"SonDurumu" alanı yasama aşamasını verir.

**Uygunluk:** İzlenebilir, ama hazır kanal yok; sonuçlar client-side. Fark motoru ya
POST'u CSRF token'ı önce çekerek taklit etmeli ya da headless JS-render kullanmalı.

---

## K2 — Resmî Gazete (resmigazete.gov.tr) — EN GÜÇLÜ KAYNAK

robots.txt: `200`, `text/plain`. Yalnız birkaç eski PDF için **`Noindex`** (per-bot:
Googlebot/Bingbot/Slurp/Yandex). İçerik `Disallow` **yok** → tarama serbest.

**Deterministik URL şeması (ana sayfadan doğrulandı):**
- Fihrist (makine-okunur indeks): `/fihrist?tarih=YYYY-MM-DD` (+ `&mukerrer=N` mükerrer sayı için)
- Günlük bölümler: `/eskiler/YYYY/MM/YYYYMMDD-N.htm` (N=1..6, bölüm sayısı değişir)
- Tam sayı PDF: `/eskiler/YYYY/MM/YYYYMMDD.pdf`
- İlanlar: `/ilanlar/eskiilanlar/YYYY/MM/YYYYMMDD-N.htm`

| URL | HTTP | Format | TR-IP | İçerik kararlılığı | İzleme notu |
|---|---|---|---|---|---|
| `/fihrist?tarih=2026-07-21` (bugün) | 200 | HTML (yapısal fihrist) | yok | **gürültülü** (yalnız iletişim formunun `__RequestVerificationToken` + rastgele `formhelper_xxx` id'si değişir; **fihrist içeriği kararlı**) | Günün tüm KANUN/YÖNETMELİK/TEBLİĞ/KARAR başlıkları tek sayfada. "KANUN" satırı filtresi = izleme tetiği. |
| `/eskiler/2026/07/20260720-1.htm` (dün) | 200 | HTML | yok | — | Dün sayısı da erişildi → şema geçmiş tarihler için de geçerli. |
| `/eskiler/2026/07/20260721-1.htm` (bugün bölüm 1) | 200 | HTML | yok | **BAYT-EŞ (tam kararlı)** | Statik günlük bölüm; hiç gürültü yok. Arşive en temiz hedef. |

**Uygunluk (en yüksek):** Tarih parametreli olduğundan **fark motoru bile gerekmez** —
cron her gün fihristi çekip "KANUN" başlıklarını tarar; Su Kanunu yasalaşınca metin
buradan tam alınır. Günlük `.htm` bölümü bayt-eş → arşivleme deterministik.

---

## K3 — Mevzuat Bilgi Sistemi (mevzuat.gov.tr)

robots.txt: `200`, `text/plain`. Yalnız 2 yol için `Noindex`; içerik `Disallow` yok.
Yapı: sunucu-render **ASP.NET MVC** (jQuery/blockui/toastr; SPA değil).

| URL | HTTP | Format | TR-IP | İçerik kararlılığı | İzleme notu |
|---|---|---|---|---|---|
| `https://mevzuat.gov.tr/` (arama) | 200 | HTML | yok | test edilmedi | Arama formu: `POST /aramasonuc` (input: "Aranacak ifade/sayıyı yazınız…"). Anti-forgery token gerektirir; sonuç sunucu-render HTML. |

**Uygunluk:** Mevzuat.gov.tr **yürürlükteki** mevzuatı tutar; Su Kanunu şu an **taslak/teklif**
olduğundan burada henüz YOK. **Yalnızca yasalaşma sonrası** yürürlük metni + değişiklik
takibi için anlamlıdır. Şimdilik ikincil.

---

## K4 — Tarım ve Orman Bakanlığı / SYGM / DSİ

**tarimorman.gov.tr** robots.txt: `200` (→ `www`'ye yönlenir). `Disallow` yalnız SharePoint
admin yolları (`/_layouts/`, `/_vti_bin/`, `/_catalogs/`, `/BIDB/Yonetim`); içerik serbest.
**dsi.gov.tr** robots.txt: `404` (IIS hata sayfası) → robots yok, kısıt yok.

Su Kanunu'nun sorumlu birimi: **Su Yönetimi Genel Müdürlüğü (SYGM)** — `tarimorman.gov.tr/SYGM`.
İlgili alt siteler ana sayfadan keşfedildi: `susurasi.tarimorman.gov.tr` (Su Şûrası),
`suverimliligi.gov.tr` (Su Verimliliği).

| URL | HTTP | Format | TR-IP | İçerik kararlılığı | İzleme notu |
|---|---|---|---|---|---|
| `…/Haber/6900/Bakan-Yumakli-Su-Kanununun-2026da-Yasalasmasini-Diliyoruz` | 200 | HTML (SharePoint) | yok | **gürültülü — yoğun** (SharePoint `__VIEWSTATE` + Themable-CSS `CssLink-<guid>` + sayısal token'lar her istekte değişir; **haber gövdesi kararlı**) | Bakanlığın güncel duruşu ("2026'da yasalaşma"). Fark motoru için `__VIEWSTATE`/guid **normalize edilmeli**, yoksa her poll'de yanlış-pozitif. |
| `…/SYGM/Belgeler/Havza HİE-Sunumlar/Su Kanunu Taslağı.pdf` | 200 | PDF (1.24 MB) | yok | — | **`Last-Modified: 2019-10-31`** → yayındaki taslak **2019 sürümü**. Nisan 2026 görüş turu metni DEĞİL. |
| `https://dsi.gov.tr/duyuru/duyuruListe` | 200 | HTML | yok | **gürültülü** (yalnız arama formu `__RequestVerificationToken`; duyuru listesi kararlı) | Sunucu-render duyuru listesi (`/Duyuru/Detay/{id}`, sıralı ID). Fark motoruna uygun. |

**tarimorman duyuru şeması:** `/Duyuru/{id}/{slug}` sıralı ID (ör. 2618…2638), sunucu-render.
Su Kanunu görüş turu bir duyuru olarak yayımlanırsa burada belirir.

**Uygunluk:** İzlenebilir; ama SharePoint gürültüsü nedeniyle normalize şart. Kritik boşluk:
güncel (2026) taslak metninin kamuya açık URL'i doğrulanamadı.

---

## İÇERİK KARARLILIĞI TESTİ — ÖZET

Her aday ≥65 sn arayla 2 kez çekildi, bayt-normalize kıyaslandı.

| Aday | Sonuç | Gürültü türü | Normalize sonrası |
|---|---|---|---|
| RG `/eskiler/…/20260721-1.htm` | **kararlı** | — (bayt-eş) | Zaten temiz |
| RG `/fihrist?tarih=…` | gürültülü | Gömülü iletişim formu CSRF + `formhelper_<id>` | Kararlı (fihrist gövdesi değişmez) |
| TBMM `/yasama/kanun-teklifleri` | gürültülü | `X-CSRF-TOKEN` (1 alan) | Kararlı |
| DSİ `/duyuru/duyuruListe` | gürültülü | `__RequestVerificationToken` (1 alan) | Kararlı |
| Tarım-Orman `/Haber/6900/…` | gürültülü (yoğun) | SharePoint `__VIEWSTATE` + `CssLink-<guid>` + ~10 sayısal token | Normalize gerekli; sonrası kararlı |

**Sonuç:** Hiçbir adayda içerik gürültüsü yok; tüm fark yalnız oturum/anti-forgery/ViewState
alanlarında. Fark motoru bu alanları (hidden token input'ları, `__VIEWSTATE`, `formhelper_*`
ve `CssLink-*` guid'leri) çekmeden önce **silmelidir** — aksi halde her poll yanlış-pozitif üretir.

---

## TR-IP: KULLANICI TARAYICI TESTİ ÖNERİLEN

Bu keşifte **hiçbir hedef DE çıkışından engellenmedi** (tümü 200). Dolayısıyla kesin
TR-IP şüphesi işareti YOK. Yine de kesinleştirilmesi gerekenler:

1. **Güncel (Nisan 2026) Su Kanunu Taslağı metni:** Yayındaki PDF 2019 tarihli. Görüş turu
   metni SYGM sayfalarında veya e-posta/paydaş kanalıyla mı dağıtılıyor — TR'den bir
   tarayıcıyla `tarimorman.gov.tr/SYGM` ve `suyonetimi`/görüş portalı kontrol edilmeli.
2. **TBMM sorgu POST sonucu:** `POST /Yasama/Kanun-Teklifleri-Sonuc` gerçek sonuç tablosunu
   döndürüyor mu — tarayıcıda "su" araması ile teyit (bu keşifte POST denenmedi; CSRF akışı gerekir).

---

## KAPSAM DIŞI / YAPILMAYANLAR (dürüstlük kaydı)

- Hiçbir dosya/kod değişmedi; yalnız bu rapor üretildi.
- robots `Disallow` yolları çekilmedi (SharePoint admin, mevzuat 2 PDF).
- TBMM `POST /…-Sonuc` ve mevzuat `POST /aramasonuc` **denenmedi** (anti-forgery token akışı
  + durum değiştirme kaygısı); yalnız form yapısı okundu.
- Su Kanunu Taslağı PDF içeriği indirilmedi; yalnız HTTP başlığı (HEAD) alındı.
- İstek bütçesi aşılmadı (~33/60).
