# ÖDÜL-ÜSTÜ FAZ 1 — SÖZLÜK VE BORÇ v2 · KANIT RAPORU
*2026-07-21 · reduced-motion deterministik denetim · PUSH ÖNCESİ*

## Özet
Üç iş yapıldı: (1) koreografi/sözlük CSS tekilleştirme, (2) hareket sözlüğü
(--e-suzul ailesi) yayılımı, (3) sayı-canlanma (yalnız gerçek büyüklükler).
Piksel regresyon %0,0000 (12/12 sayfa); Lighthouse taban altına düşmedi;
konsol 0, 375px taşma 0; sayı-canlanma JS bütçesi ham gzip 992B / min+gzip 473B
(≤1KB). Kullanıcı kararı (2026-07-21): canlanma yıl/küçük sayımı işaretlemez.

---

## FAZ A — ENVANTER (kod değişikliği yok)

### A1. Koreografi/animasyon tanımları (B3 bulgusuyla kıyas)
| Tanım | Önce (dosya) | Mükerrer? | Karar |
|---|---|---|---|
| `.gk` fadeUp + `@keyframes gk-fadeup/gk-yuksel` + print guard | `rehberler/[slug].astro` **ve** `vaka/[slug].astro` | **EVET — birebir kopya** (yalnız yorum farkı) | Tek kaynağa (`src/styles/hareket.css`) |
| `--e-suzul/--e-kabar/--e-akinti/--e-cekil` sözlüğü | `Sayfa.astro :root` (+ `stil-pilot` yerel kopya, noindex) | Kısmi (Sayfa global) | Tek kaynağa taşındı |
| `--pk-e-suzul` (dictionary değeri, yerel ad) | `HavzaPaneli.astro` | Değer kopyası | `--e-suzul`e çekildi |
| `.gk` Sakarya kalıbında | `havzalar/[slug].astro` | **YOK** (B3'ün "varsa" şerhi) — Sakarya HavzaKahraman+Katman kullanır | Değişiklik yok |

B3 bulgusu doğrulandı: mükerrer `.gk` **tam 2 pilotta**; Sakarya'da kopya yok.

### A2. Sayısal vitrin öğeleri
| Grup | Öğe | Değer tipi | Canlanma |
|---|---|---|---|
| HavzaPaneli (25 kart) | `.kart-stat` yüzey suyu potansiyeli | büyüklük (km³/yıl) | **EVET** |
| HavzaPaneli | `.kart-rezerv`, `.kart-egim` | küçük/eğilim | Hayır (öneri: dışarıda; tek hero değer canlanır — çoklu sayı = pano/loading hissi) |
| HavzaKahraman (havza sayfası) | `.kahraman-deger` potansiyel | büyüklük | **EVET** |
| Vaka stat (meysu) | `3.395,33 ha` | büyüklük | **EVET** (opt-in) |
| Vaka stat (meysu) | `2056` (ruhsat bitiş **YILI**), `3 bildirim` | yıl / küçük sayım | **Hayır** (kullanıcı kararı — sahte-yükleniyor yasağı) |

**Beklenmedik yapı → DUR ve seçenek sun (uygulandı):** vaka stat kartları
karışık (büyüklük + yıl + küçük sayım). Kullanıcı 2026-07-21: "Yalnız gerçek
büyüklükler". Uygulama opt-in (`canlan: true`) — script asla yanlış değeri seçmez.

### A3. Regresyon tabanı
6 sayfa × {1440, 375}, reduced-motion → `taban/` (12 PNG). Araç:
`arac/faz1-cek.sh` + `arac/faz1-goruntu.mjs`.

---

## FAZ B — UYGULAMA

### B1. Tekilleştirme
- Yeni tek kaynak: `src/styles/hareket.css` (sözlük + `.gk` koreografisi).
- `Sayfa.astro`: `import '../styles/hareket.css'`; yerel `--e-*` tanımları silindi.
- `harita.astro`: aynı dosyayı import eder (/harita/ sahne rotası da sözlüğe erişir).
- `rehberler/[slug]` + `vaka/[slug]`: `.gk` blokları silindi (davranış birebir).
- **Tekillik kanıtı:** `grep -rln gk-fadeup src public` → **yalnız** `src/styles/hareket.css`; pilot kopyaları **0**.

### B2. --e-suzul yayılımı (sözlüğe çekilenler)
| Dosya | Önce | Sonra |
|---|---|---|
| `HavzaPaneli.astro` | `--pk-e-suzul` + `background-color 240ms ease` | `--e-suzul` + `--e-akinti` |
| `harita.astro` (`.sv-menu-ac`) | `color 0.25s ease` | `color 0.25s var(--e-akinti)` |
| `Bulten.astro` | `color/border/bg 0.2s ease` | `var(--e-akinti)` |
| `su-kanunu/index.astro` (`.sv-baslik`) | `color 0.2s ease` | `var(--e-akinti)` |
| `Katman.astro` | — | zaten sözlükte (değişiklik yok) |

**İstisna adayları (DEĞİŞTİRİLMEDİ — gerekçeli, karar kullanıcıda):**
| Öğe | Gerekçe |
|---|---|
| `UstMenu`, `AltBilgi`, `TamEkranMenu` (renk/hover geçişleri) | Bu bileşenler **landing'de de** render ediliyor. Sözlüğe çekmek landing'i etkiler → **Landing İstisnası** (brief B2 exclusion). Tek CSS kuralı sayfa-başına farklılaşamaz. |
| `harita.astro` `.cerceve` (hero reveal `opacity 1s ease`) | /harita/ **hero reveal**'i; "hero'ya dokunulmadı" ilkesi. İnert (resting'te fark yok) ama ihtiyatла bırakıldı. |
| `index.astro` (landing hero: `surukle/akinti/belir/kelime-kay/imza-gec`) | Landing İstisnası — kendi sözlüğü. |
| `harita-pilot.astro`, `stil-pilot.astro` | noindex pilot sayfalar (sitemap dışı). |
| `src/harita-3d/*` | Arşiv/vendor (route üretmiyor). |

Şart karşılandı: "sözlük dışı = envanterde gerekçeli" (sıfır değil).

### B3. Sayı-canlanma
- Araç: `public/s/canlan.js` — tek IntersectionObserver, `[data-canlan]` opt-in,
  son %20'yi doldurur (0'dan değil), tr-TR biçim, son kare özgün metne **birebir**
  döner. `harita.astro`, `HavzaKahraman`, `vaka/[slug]` kalıp-2'de yüklenir
  (rehber/il/diğer sayfalarda YOK).
- Şema: `content.config.ts` `kahraman[].canlan?: boolean`; `meysu.md`'de yalnız
  `3.395,33` işaretli.
- **JS bütçesi:** ham gzip **992 B** (≤1024) · min+gzip **473 B** (≤1KB). PASS.
- **Progressive enhancement:** no-JS / reduced-motion → değer zaten son hâlinde
  DOM'da (aşağıda curl kanıtı).

---

## FAZ C — KANIT

### C1. Piksel regresyon (taban ↔ sonra, reduced-motion, eşik %0,5)
Tüm 12 sayfa **%0,0000** — aşan sayfa 0/12. (Araç: `arac/faz1-regresyon.mjs`.)
Tekilleştirme + marker `<span>` sarımı + easing değişimi resting-state'te birebir.

### C2. Sayı-canlanma kanıtı
- Normal motion (sakarya kahraman): t=0 **"5,11"** → 300ms **"5,94"** → 600ms
  **"6,01"** → 1000ms **"6,01"** (son %20 dolar, 0'dan değil). Kareler:
  `canlanma/canlanma-*ms.png`.
- Reduced-motion: **anında "6,01"** (animasyon kurulmaz) — `canlanma/reduced-aninda.png`.
- JS'siz DOM (curl/statik HTML): `data-canlan="6.006" …>6,01<` (sakarya),
  `data-canlan="3395.33" …>3.395,33<` (meysu). Tam değer curl'de mevcut.
- meysu: `2056` (yıl) ve `3` (bildirim) **işaretsiz** düz metin (toplam
  `data-canlan` = 1). HavzaPaneli 25/25 kart işaretli.

### C3. Tekillik kanıtı
`gk-fadeup` tanımı: 1 kaynak (`src/styles/hareket.css`); pilot kopya 0.

### C4. Lighthouse (aynı makine A/B, 3 tur medyan — git stash baseline)
| Sayfa | Taban | Sonra | Sonuç |
|---|---|---|---|
| sakarya | 87 (94/83/87) | 91 (91/92/83) | ↑ düşüş yok |
| kuyu-ruhsati | 82 (81/85/82) | 92 (99/92/90) | ↑ düşüş yok |
| /harita/ | 68 (68/68/75) | 70 (70/75/70) | ↑ düşüş yok |

GPU'suz localhost gürültüsü ±10; A/B eş koşulda alındı. **Hiçbir sayfada
taban altına düşüş yok.** (Araç: `arac/faz1-lh.mjs`; `lh-taban.json`/`lh-sonra.json`.)

### C5. Konsol / taşma / bütçe
- Konsol hata+uyarı: **0** (harita, sakarya, meysu; canlanma dinlenerek).
- 375px yatay taşma: **0/3**.
- JS bütçe: yukarıda (992B/473B ≤1KB).

---

## Skill → karar izi
- **transitions-dev:** "Number pop-in" (per-digit blurlu re-enter) **reddedildi** —
  güncelleme semantiği + blur "sahte-yükleniyor" hissi verir (brief yasağı);
  yerine count-up tween. Sözlük hizası: `--e-suzul = cubic-bezier(0.22,1,0.36,1)`
  transitions-dev varsayılan `--panel/dropdown/resize-ease` eğrisiyle **birebir** —
  yayılım bu eğriye çekti. Koreografi = transitions-dev panel-reveal fadeUp uyarlaması.
- **frontend-design / ui-ux-pro-max:** mevcut SU-DİLİ/DESIGN.md marka kimliği
  skill varsayılanlarından üstün (global kural) → sözlük eğrileri korundu,
  canlanma restraint (kart başına tek hero sayı, çoklu-sayı pano hissi reddi).
- **superpowers verification-before-completion:** her iddia komut çıktısıyla
  doğrulandı (regresyon, curl, grep, Lighthouse A/B) — kanıt-önce.

## Not (devDep + araç)
`pixelmatch`, `pngjs`, `lighthouse` devDependency olarak eklendi (regresyon +
Lighthouse harness'ı; shipped siteyi etkilemez). Araçlar `arac/faz1-*` altında
tekrar kullanılabilir.

## Kapanış
Görsel/UI işi — nihai kanıt kullanıcının canlı testi (İş kapanış kuralı).
Bu rapor ön eleme; headless GPU'suz olduğundan canlanma "his" kalitesi canlıda
teyit edilir.
