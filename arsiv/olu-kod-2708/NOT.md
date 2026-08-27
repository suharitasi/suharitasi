# Ölü kod arşivi — 27.08.2026 (K27, K28)

Referans ölçümü `src/` + `arac/` üzerinde yapıldı; her dosya için sıfır
canlı tüketici bulundu. Dosyalar SİLİNMEDİ, buraya taşındı.

| Dosya | Ölçülen referans | Not |
|---|---|---|
| `anasayfa-sorular.js` | 1 → yalnız `anasayfa-asama2-denetim.mjs` | Bayat veri seti: 7 soru taşıyordu, canlı ana sayfa `SORULAR_V2` (6 soru, `anasayfa-v2.js`) kullanıyor. |
| `anasayfa-asama2-denetim.mjs` | 0 | Uykuda araç: cron'da yok, sağlık çağırmıyor. Bayat veriyi denetliyordu. |
| `ruhsat-risk.js` | 0 | — |
| `HedefSahne.astro` | 0 | Tek tüketicisi olan arşiv sayfası kalkmış. |
| `hedef-lqip.txt` | 1 → yalnız `HedefSahne.astro` | Yukarıdakiyle birlikte öldü. |

## K28'de ölü sanılan ama YAŞAYAN dosyalar (ölçümle düzeltildi)
- `src/data/menu.ts` — **9 referans** (`PaylasilanMenu.astro`,
  `Sayfa.astro`, `harita.astro` + 6 araç). Karar dosyasındaki "repo
  genelinde 0 referans" kaydı yanlıştı.
- `src/scripts/scrub-engine.js` — **2 referans**
  (`src/pages/harita-pilot.astro`, `arac/site-saglik.mjs`). CSP `blob:`
  kararına zincirli olduğu için dokunulmadı.
- `src/assets/arslan-logo.svg` — 0 referans, ama logo seçimi açık bir
  KULLANICI KALEMİ (karar dosyası §0.2). Marka kimliği sınıfına
  girdiğinden taşınmadı.
