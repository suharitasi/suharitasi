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
- Kullanıcı doğru mülke (G-NRJZLX0CPR) Görüntüleyici eklediğini bildirdi;
  **11:17 UTC ölçümü** hâlâ YALNIZ arslanhukuk.tr gösteriyor. Olası nedenler:
  (a) Google erişim yayılımı gecikmesi (dakikalar–nadiren saatler),
  (b) property'nin farklı bir GA **hesabında** olması ve o hesapta grant'ın
  henüz görünmemesi. KULLANICI KONTROL LİSTESİ: (1) GA4 → ilgili mülk →
  Yönetici → Mülk erişim yönetimi'nde SA satırı **görünüyor mu**;
  (2) sol üstte mülkün bağlı olduğu **hesap adı** ne? (3) 10 dk sonra bana
  "hazır" de — yeniden ölçerim.

## Kanıtlar
Build EXIT 0 · 1190 sayfa · dist sameAs grep'leri (3 yüzey) · **CANLI
(`973e347`):** ana sayfa + /harita/ sameAs birebir · `--hizli` **YEŞİL** ·
GA4 list çıktısı (11:17 — yalnız arslanhukuk.tr).

## Öz-eleştiri ("daha iyisi olabilirdi")
- sameAs'e X/YouTube eklenmesi kullanıcı profili açılana dek bekler; sıralama
  önerisi site.ts yorumunda.
- GA4 görünürlüğü gecikirse property hangi hesapta sorusu netleşmeli
  (kullanıcıya tek satır).
