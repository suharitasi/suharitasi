# RAPOR — Otonom Skill Mimarisi ve Denetim (04.10.2026, KARARLAR §58)

Sahip talimatı: 10 maddelik otonom skill mimarisi, sıralamaya göre uygula.
Bu iş bir SİTE ÖZELLİĞİ değil, yerel ajan altyapısıdır (CLAUDE.md: `.agents/`
repoya commit edilmez); site kodu değişmedi.

## 1. Kurulan skill'ler (sıralamaya göre)

| # | Talep | Skill (yerel: `.agents/skills/`) | Dayandığı hazır altyapı |
|---|---|---|---|
| 1 | Apple standart UI/UX + boşluk | `suharitasi-ui-hig` | apple-design + frontend-design + emil-design-eng; DESIGN.md; `site-saglik --gorsel-taban-yenile`; `oz-denetim.mjs` |
| 2 | Doğrudan yanıt + dönüşüm hunisi | `suharitasi-donusum-hunisi` + `scripts/jargon-tara.sh` | `CtaBlok`, `HukukDanismanlik`; `data-olay`; TBB kuralı |
| 3 | Otonom programatik SEO + zengin sonuç | `suharitasi-programatik-seo` | Google SEO MCP (GSC/schema); sitemap/llms kancaları; `yayinlananIller()` |
| 4 | Sıfır hata build + güvenlik nöbetçisi | `suharitasi-build-guvenlik` | `npm run build`; `site-saglik.mjs`; `sayac-anahtar-esle.sh`; `flock` git kilidi |
| 5 | Hukuki dil + mevzuat uyumu | `suharitasi-hukuk-uyum` + `scripts/uyari-tarama.sh` | `HukukSerhi`/`HukukDanismanlik`; uydurma yasağı; İYUK m.7; RG kayıtları |
| 6 | Yapısal veri / şema botu | `suharitasi-schema-botu` + `scripts/sema-tara.sh` | Google SEO MCP `schema_*`; FAQPage/Dataset mimarisi |
| 7 | Core Web Vitals + varlık | `suharitasi-performans` | Google SEO MCP `lighthouse_*`, `crux_*`; `dist-sun.mjs`; esbuild hattı |
| 8 | Coğrafi veri senkronu | `suharitasi-cbs-veri` | `altin-ornek.mjs` (23/23); `il-profil.js`; pipeline kuralları |
| 9 | Simüle UX + sürtünme avcısı | `suharitasi-surtunme-avi` | Playwright MCP; `oz-denetim.mjs`; `21-dokunma` |
| 10 | Genişletilebilir mimari | `suharitasi-skill-mimarisi` | Router tablosu + ekleme kuralları (skill-creator) |

## 2. Doğrulama (bu oturumda koşuldu)

- **Frontmatter:** 10/10 skill `name` + `description` + gövde OK (Python
  ayrıştırıcı, 0 hata).
- **`sema-tara.sh`:** FAQPage **509** · SoftwareApplication **2** ·
  Dataset **121** · BreadcrumbList **1107** · TechArticle **2** ·
  `aggregateRating` **0** · Review **0**.
- **`uyari-tarama.sh`:** hukuki sayfalarda disclaimer var, yasak vaat dili
  yok → **0 bulgu**.
- **`jargon-tara.sh` (yeni bulgu):** açık metinde jargon tespit edilen
  dist dosyası **198** — ağırlık `/havzalar/*`, `/harita/`, `/veri/*`,
  `/basin/`, `/en/` şablonları ve dipnot kaynak atıfları (`GRACE`).
  `/tahmin/` temiz. Bu tarama mimarinin ilk somut çıktısıdır: temizlik
  kuyruğa alındı (aşağıda), karar gerektiren tek nokta dipnot atıflarıdır
  (kaynak adı küçük punto bilimsel atıf olarak kalabilir mi? — aksi halde
  sadeleştirilir).

## 3. Genişletme kuralları (özet)

1. Yeni skill'den önce ara: user-scope skill veya mevcut proje skill'i aynı
   işi yapıyorsa yenisini yazma, mevcudu güncelle (çift üretim yasak).
2. Üretim `skill-creator` döngüsüyle: taslak → test promptları → değerlendirme.
3. Yer: `.agents/skills/<ad>/SKILL.md` (yerel, commit dışı); uzun referans
   `references/`, deterministik iş `scripts/` (set -euo pipefail + çıkış kodu).
4. Tetikleyici bilgisi yalnız `description` alanında, "ne zaman kullan"
   vurgusuyla; gövde kanıt/ölçüm disiplinini öğretir.
5. Kayıt: KARARLAR (gerekçe) + SIRADAKILER (ilk görev) + bu rapor.

## 4. Kuyruğa alınan ilk görevler

- [ ] **Jargon temizliği (198 dosya):** şablon düzeyinde (havzalar, harita,
  veri, basin, en) sade karşılık; dipnot kaynak atıfları için karar
  (korunacak mı, parantez içi mi). Araç: `jargon-tara.sh` — hedef 0.
- [ ] Her yeni skill için ilk gerçek kullanımda tetikleme doğrulaması
  (description optimizasyonu isteğe bağlı).
