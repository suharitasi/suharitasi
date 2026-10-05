# RAPOR — P6-B Veri Tazelik Panosu (05.10.2026)

Brief: `cikti/brief/2026-10-05T1100-p6b-veri-tazelik-duzeltilmis.md` (1 UYARI).
Kaynak: denetim katma değer #2 — "CHIRPS tipi sessiz bayatlık bir daha saklanamaz".

## 1) Ne kuruldu

- **`arac/veri-tazelik.mjs` (tek kaynak):** 11 kümeli kayıt defteri; as-of
  YALNIZ veri künyesinden (uydurma yasağı); iş takvimleri crontab ile birebir.
  CLI: `--kontrol` (otomatik sınıf; eşik aşımı/bilinmeyen → listeler + exit 1),
  `--json`, `VT_SAHTE_GUN` (test simülasyonu).
- **Görünür pano:** `/acik-veri/` "Veri tazeliği" tablosu (build-time, aynı
  modülden) — veri kümesi · kaynak · as-of · tazeleyen iş · durum.
- **Makine-okunur uç:** `/veri/veri-tazelik.json` (Astro endpoint, aynı modül).
- **Health:** `saglik-bekcisi.sh` (j) maddesi — `--kontrol` exit≠0 → 🔴 + Telegram.

## 2) Kanıtlar

- **Temiz koşum:** 11 küme · 0 sorun · exit 0 (baraj 1g · chirps 0g · grace 81g
  (kaynak gecikmesi sınıfı, eşik 120) · mevzuat 1g · rg 6g · nhyp 5g · yargı 13g;
  statikler `bilgi`).
- **Kırmızı yol (VT_SAHTE_GUN=2026-12-01):** 7 küme gecikmiş + exit 1 — kural
  kanıtlı (gerçek tarih değiştirilmedi).
- **Build/dist:** EXIT 0 · 1190 sayfa; `/acik-veri/` tablosunda **7 Güncel +
  4 Statik/manuel + 0 Gecikmiş**; endpoint JSON gerçek tarihlerle.
- **Canlı (commit `ae542e9`):** `surum.json` ✓ · `/acik-veri/` tablosu canlıda
  (7 Güncel + 4 Statik) · `/veri/veri-tazelik.json` 200 (11 satır; chirps
  `2026-10-05 · guncel`) · `site-saglik --hizli` **YEŞİL**.

## 3) Bu turda çıkan iç düzeltmeler (ölçüm disiplini)

1. **Build KOK çözümü:** Astro build'de `import.meta.url` yeniden yazıldığından
   okumalar null dönüyordu → env → cwd → modül konumu sırası + `package.json`/
   `data` işaret doğrulaması (yanlış kök sessizce null üretmez).
2. **Bekçi bellek dedupe:** 09:20'deki geçici swap artığı 24s penceresinde her
   koşumda yeniden bildiriliyordu → `izleme/state/bekci-bellek-son.txt` ile
   yalnız DAHA YENİ olay bildirilir. Kanıt: bekçi koşumu artık **`sağlık OK`**.

## Öz-eleştiri ("daha iyisi olabilirdi")

- `--kontrol` zamanlaması bekçiye bağlı (günlük 07:00); istenirse site-saglik
  `--tam`a da eklenebilir (çekirdek dokunuşu riskli bulundu — bilinçli).
- NASA POWER statik kalemi tarihsiz (klimatoloji damgası yok) — "bilinmiyor"
  yerine sınıfı gereği `bilgi` gösterildi; veri kaynağı tarih kazanırsa eklenir.
- Eşikler takvim+pay ile türetildi; ilk 2-4 hafta gözlem sonrası kalibrasyon
  notu düşülebilir (yanlış alarm gözlenirse).
