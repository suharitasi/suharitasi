# RAPOR — P4 Performans: /harita srcset + Cache + Medya Turu (05.10.2026)

Brief: `cikti/brief/2026-10-05T0910-p4-performans-duzeltilmis.md`
(özgün + düzeltilmiş; 1 ENGEL → sayı biçimi netleştirildi → 1 UYARI).
Kaynak: `rapor/05-10-odul-ustu-denetim.md` S11 + medya bulguları.

## Brief-denetçi notu (uyarı — iş sürdü)
- [T1] `rapor/05-10-p4-performans.md` denetim anında yoktu; bu dosyadır.

## 1) /harita hero (LCP) — srcset
- Türevler (kaynak 2200×1232 · 289 KB):
  `hedef-hero-736.webp` **59 KB** · `hedef-hero-1100.webp` **104 KB**.
- `dist/harita/index.html`: `srcset` (736/1100/2200) + `sizes="100vw"` +
  `width/height="2200/1232"`; preload `imagesrcset/imagesizes` — grep kanıtlı.
- 412 px mobil artık 59 KB türevi seçer (önce 289 KB tek sürüm).

## 2) Önbellek (`_headers`)
- `/_astro/*` → `public, max-age=31536000, immutable` · `/fonts/*` → 30 gün.
- dist/_headers'ta doğrulandı; CANLI curl kaydı bu raporun alt bölümünde.

## 3) Poster turu
- 6 `sahne*.jpg` (~341 KB) → `sahne*.webp` (~230 KB, −%33); `index.astro`
  `still` ve preload `.webp`e çevrildi; dist'te `.jpg` referansı **0**.

## 4) Video turu (SSIM kapılı)
Toplam **7,95 MB → 4,36 MB (−%45)**; her klip 832×464 · 24 fps · 5,208 sn ·
sessiz — ffprobe birebir. SSIM (orijinal ↔ yeni):

| Klip | Önce | Sonra | SSIM |
|---|---|---|---|
| sahne1 | 1332 KB | 781 KB | 0,9821 |
| sahne2 | 2032 KB | 1079 KB | 0,9755 |
| sahne3 | 1009 KB | 517 KB | 0,9797 |
| sahne4 | 1206 KB | 544 KB | 0,9827 |
| sahne5 | 877 KB | 443 KB | 0,9810 |
| sahne6 | 1679 KB | 1100 KB | 0,9769 |

Kapı ≥0,97; altında kalan olsaydı orijinal korunacaktı — kalmadı.

## 5) Ölü hero seti
`public/hedef/*` (1,75 MB, canlı referans 0) → `arsiv/hedef-olu-set-2708/`
(git mv; dist'te artık yok: `dist/hedef` mevcut değil). Kalıcı silme kullanıcıda.

## 6) Kanıtlar
- Build **EXIT 0 · 1190 sayfa**; dist grep'leri (srcset/imagesrcset/sizes,
  `_headers` blokları, `.jpg` referansı 0, video toplam 4,36 MB).
- **CANLI (commit `8a26946`):** `surum.json` yeni SHA · `/_astro/api-loglari.*.css`
  → `cache-control: public, max-age=31536000, immutable` (Cloudflare `_headers`'ı
  uyguladı, curl kanıtlı) · `hedef-hero-736.webp` 200 · `sahne2.mp4` canlı
  **1,05 MB** (2,08'den) · `site-saglik --hizli` **YEŞİL**.
- **Lighthouse (yerel `dist-sun`, 3 tur medyan; PSI günlük kotası 429):**
  PERF **93/92/90 → medyan 92** · LCP 3,2 sn · CLS 0 · TBT 0; **LCP elemanı
  artık `hedef-hero-736.webp`** (srcset sahada çalışıyor). DÜRÜST NOT:
  brifteki "≥94" hedefi yerel medyanda TUTMADI (92); bayt kazancı gerçek
  (289→59 KB · video −%45). Canlı CDN'li sonuç 19:30 `--tam` md9 ile teyit
  edilecek; ek tur adayı: kritik CSS/font yolu.

## KULLANICI ONAYI BEKLİYOR
Görsel yüzey değişti (video/poster/hero türevleri) — nihai görsel onay kullanıcıda
(İş kapanış kuralı).

## Öz-eleştiri ("daha iyisi olabilirdi")
- SSIM nesnel kapıdır ama gözle onayın yerini tutmaz; kullanıcı canlı bakmalı.
- `/harita` PSI tek ölçüm olacak; tekrarlı ölçüm (3 tur) ideal olurdu — kayıt
  commit'inde tek koşum + gerekiyorsa ikinci koşum notlanır.
- Poster AVIF (poster attribute fallback sınırı) ve webm/AV1 video ayrı tur.
- Diğer görsellerin (göl/nehir OG) srcset turu kapsam dışı kaldı.
