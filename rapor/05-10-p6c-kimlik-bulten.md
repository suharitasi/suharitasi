# RAPOR — P6-C Kimlik Bağları (sameAs) + Bülten/GA4 Durumu (05.10.2026)

Brief: `cikti/brief/2026-10-05T1130-p6c-kimlik-duzeltilmis.md` (2 UYARI; sürdü).
Kaynak: kuyruk P6 kalanı.

## 1) sameAs tamamlandı

- Tek kaynak `src/data/site.ts` → `KURUM_SOSYAL`:
  Wikidata `Q141582057` + Zenodo DOI `10.5281/zenodo.23002678` (ikisi de
  doğrulanmış adres; uydurma yok).
- **Eksik iki özel şema bağlandı:** ana sayfa (`index.astro` Organization) ve
  `/harita/` (`#kurum` Organization). Layout (`Sayfa.astro`) zaten yayıyordu.
- Kanıt (dist grep): `index.html`, `harita/index.html`, `gizlilik/index.html`
  → `"sameAs":["…Q141582057","…zenodo.23002678"]` birebir.
- LinkedIn/GBP/X/YouTube adresleri KULLANICI varlığı — gelene dek EKLENMEZ
  (site.ts'teki kural: doğrulanmamış profil sinyal güvenilirliğini düşürür).

## 2) Bülten (Buttondown) — durum: kullanıcı adı bekliyor

- Form (`Bulten.astro`), CSP izni (`form-action buttondown.com`), çift-onay
  talimatı (`README-BULTEN.md`) hazır. Tek eksik: `src/data/bulten.ts`
  `BUTTONDOWN_KULLANICI` — hesap açılıp kullanıcı adı verilince TEK satır.
- Dürüstlük kapısı korunuyor: adres boşken form hiçbir sayfada render EDİLMEZ
  (sessiz başarısızlık yasağı).

## 3) GA4 okuma — durum

- Admin+Data API + SA çalışıyor (pozitif kontrol: arslanhukuk.tr sorgusu).
- Kullanıcı doğru mülke (G-NRJZLX0CPR) Görüntüleyici eklediğini bildirdi.
- **HAM KANIT (11:26 UTC, MCP baypas, SA token):** `accountSummaries` ve
  `accounts` uçları birebir şunu döndürüyor — tek hesap
  `accounts/352815414 «Arslan Hukuk Bürosu»` + tek mülk
  `properties/486437917 «arslanhukuk.tr»`. **Suharitasi mülkü SA'ya görünmüyor.**
- EN OLASI NEDEN: grant, Google Cloud **IAM**'de verilmiş olabilir (GA4 veri
  erişimi VERMEZ) veya GA profilinde yanlış mülk/hesap seçilmiş ya da e-posta
  birebir değil. Doğru yol (4 adım): GA4 → **o mülk** → Yönetici → **Mülk
  erişim yönetimi** → "+" → `gsc-okuyucu@suharitasi-gsc.iam.gserviceaccount.com`
  → Rol **Görüntüleyici** → Ekle. (GCP konsolu DEĞİL.)
- İSTENEN EK BİLGİ: G-NRJZLX0CPR'yi taşıyan mülkün **sayısal Property ID'si**
  + sol üstteki **hesap adı** — gelince doğrudan `properties/<id>` ile 403/200
  ayrımını kanıtlar, doğru yere grant yapıldığını teyit ederim.

## Kanıtlar
Build EXIT 0 · 1190 sayfa · dist sameAs grep'leri (3 yüzey) · **CANLI
(`973e347`):** ana sayfa + /harita/ sameAs birebir · `--hizli` **YEŞİL** ·
GA4 list çıktısı (11:17 — yalnız arslanhukuk.tr).

## Öz-eleştiri ("daha iyisi olabilirdi")
- sameAs'e X/YouTube eklenmesi kullanıcı profili açılana dek bekler; sıralama
  önerisi site.ts yorumunda.
- GA4 görünürlüğü gecikirse property hangi hesapta sorusu netleşmeli
  (kullanıcıya tek satır).
