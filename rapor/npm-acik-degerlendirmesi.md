# NPM AÇIKLARI — ETKİ DEĞERLENDİRMESİ (M9)

Tarih: 2026-07-29 · Ölçüm: `npm audit --json` + kaynak taraması

## 0. Ana bulgu: taban BAYAT, ama tablo göründüğünden sakin

`izleme/kapsam-taban.json` tabanı **4 açık (3 yüksek)** diyor (28.07 ölçümü).
Bugün ölçüldü: **23 açık (6 yüksek, 16 orta, 1 düşük)**. Artış gerçek —
ama aşağıdaki nedenle **hiçbiri ziyaretçiye açık bir yüzey değildir.**

## 1. Neden ziyaretçi riski YOK

`suharitasi.com` **statik** bir sitedir (CLAUDE.md: "site statik kalır").
`node_modules` altındaki hiçbir paket:
- ziyaretçinin tarayıcısında çalışmaz (yayımlanan JS `src/` ve `public/s/`
  kaynaklıdır; ölçüldü: dist'te paket kodu yok),
- siteyi sunan makinede çalışmaz (Cloudflare Pages statik dosya sunar).

Yani açıkların tamamı **build-zamanı / geliştirme aracı** yüzeyindedir.
Gerçek risk modeli: *derleme yapan makinede kötü niyetli girdi işlemek*.

## 2. Açık açık, etki analizi

| Paket | Şiddet | Ne zaman çalışır | Bize dokunuyor mu | Ölçüm |
|---|---|---|---|---|
| **astro** ≤7.0.9 | yüksek | build | **HAYIR** — üç advisory de kullanmadığımız özelliklerde | `define:vars` **0** · `server:defer` **0** · `<slot name=` **0** · SSR/adapter **0** · `astro:actions/env` **0** (kaynak taraması) |
| **sharp** <0.35.0 (libvips CVE'leri) | yüksek | build (görsel işleme) | **HAYIR** — `astro:assets` / `<Image>` / `<Picture>` kullanılmıyor (**0** isabet); sharp hiç çağrılmıyor | kaynak taraması |
| **postcss** ≤8.5.17 | yüksek | build (CSS) | **EVET** (yol geçişi, sourceMappingURL) | **DÜZELTİLDİ → 8.5.24** |
| **@sentry/node**, **@opentelemetry/\*** (14 paket) | yüksek/orta | yalnız `lighthouse` çalışırken | Dolaylı — sağlık ölçümünde | aşağıda §3 |
| **brace-expansion / minimatch** | yüksek | build/dev (glob) | Dolaylı, DoS | lighthouse ağacı |
| **esbuild** 0.27.3-0.28.0 | düşük | dev sunucu, **yalnız Windows** | **HAYIR** — sunucu Linux | advisory kapsamı |

## 3. Uygulanan: kırıcı olmayan düzeltme

```
npm audit fix   →  postcss 8.5.17 → 8.5.24
23 açık → 22 açık (yüksek 6 → 5)
```
Doğrulandı: `npm run build` 177 sayfa, hata yok. Commit `e0812f4`.

## 4. UYGULANMADI — gerekçeli (SIRADAKILER'e devredildi)

### 4.1 `astro` 5.18.2 → 7.1.5 — **İKİ ANA SÜRÜM ATLAMA**
- npm'in "fix" dediği yol bu; ama **iki major** demek: build hattı,
  içerik koleksiyonları, entegrasyon API'si değişir.
- **Ve düzelttiği açıkların hiçbiri bizi etkilemiyor** (§2, ölçüldü).
- Bu bir güvenlik aciliyeti değil, **bakım kararıdır**: 175 sayfa, 3 özel
  entegrasyon (sitemap/llms/sürüm damgası + yeni s-küçültme) ve md14
  görsel tabanı yeniden doğrulanmalı.
- **Karar: ERTELENDİ.** Ayrı brief ister (BÜYÜK İŞ).

### 4.2 `lighthouse` 12.8.2 → 12.6.1 — **BU BİR DÜŞÜRME**
- npm "fix" olarak **daha ESKİ** sürümü öneriyor (12.8.2 → 12.6.1).
- Sağlık sisteminin md9 kalemi Lighthouse skorlarını **taban** olarak
  tutuyor; sürüm düşürmek skorları kaydırır ve tabanı geçersiz kılar.
- Kazanç: @sentry/@opentelemetry ağacındaki açıklar — hepsi **yalnız
  ölçüm koşarken**, kendi sunucumuzda, kendi sitemize karşı çalışır.
- **Karar: UYGULANMADI.** Güvenlik kazancı, ölçüm tabanını bozma
  maliyetinden küçük.

### 4.3 `sharp`
Astro'nun bağımlılığı; ayrı yükseltilemiyor (astro 7 ile geliyor).
Kullanılmadığı ölçüldüğü için beklemesi kabul edilebilir.

## 5. Taban güncellemesi

`izleme/kapsam-taban.json` `npmAudit` tabanı **22 açığa** güncellendi
(1 düşük / 16 orta / 5 yüksek). Kalem "YENİ açık" için ateşlemeye devam
eder; mevcutların giderilmesi bu raporun §4 maddeleridir.

**Taban neden yükseltildi, düşürülmedi:** taban bir *hedef* değil,
*değişim dedektörü*. Eski 4'lük tabanla kalem her koşuda kırmızı yanar ve
gürültüye dönüşür — asıl sinyal olan "bugün YENİ bir açık doğdu" kaybolur.

## 6. Yeniden değerlendirme tetikleri

Şu üçünden biri olursa bu rapor yeniden açılır:
1. Site **statik olmaktan çıkarsa** (SSR/adapter/Function eklenirse) —
   astro advisory'leri anında gerçek yüzeye döner.
2. `astro:assets` / `<Image>` kullanılmaya başlanırsa — sharp yüzeyi açılır.
3. `define:vars`, `server:defer` ya da adlı slot kullanılırsa.

Bu üç tetik `astro.config.mjs` ve `src/` taramasıyla ölçülebilir;
gelecekte bir sağlık kalemine bağlanabilir (SIRADAKILER).
