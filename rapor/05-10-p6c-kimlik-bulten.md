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
- Kullanıcı doğru mülke (G-NRJZLX0CPR) Görüntüleyici eklediğini bildirdi; bu
  raporun yazıldığı anda `ga4_list_properties` hâlâ YALNIZ arslanhukuk.tr
  gösteriyor (propagasyon olasılığı) — yeniden ölçüm sonucu kayıt commit'inde.

## Kanıtlar
Build EXIT 0 · 1190 sayfa · dist sameAs grep'leri (3 yüzey) · CANLI: deploy
sonrası curl + `--hizli` (kayıt commit'inde) · GA4 list çıktısı.

## Öz-eleştiri ("daha iyisi olabilirdi")
- sameAs'e X/YouTube eklenmesi kullanıcı profili açılana dek bekler; sıralama
  önerisi site.ts yorumunda.
- GA4 görünürlüğü gecikirse property hangi hesapta sorusu netleşmeli
  (kullanıcıya tek satır).
