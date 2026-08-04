# ASTRO SÜRÜM YÜKSELTMESİ — KEŞİF VE ENGEL (İş A)

Tarih: 2026-07-29 · Worktree: `suharitasi-astro` · **MERGE YOK.**
Brief kapısı: `cikti/brief/2026-07-29-uc-is.md` → **TEMİZ** (0 ENGEL).

---

## 0. SONUÇ ÖNCE

**Yükseltme YAPILAMADI — tek sebep Node sürümü.** Kod tarafında engel
neredeyse yok: Astro 6 ve 7'nin kırıcı değişiklikleri ölçüldü, **hiçbiri
bu projeye dokunmuyor**. Node 22.12+ kurulduğu gün yükseltme büyük
olasılıkla tek `npm install` + bir build turu meselesidir.

---

## A0. ENVANTER (ölçüldü, `npm view`)

| Paket | Kurulu | En güncel | Atlanacak ana sürüm |
|---|---|---|---|
| **astro** | 5.18.2 | **7.1.5** | **5 → 7 (iki ana sürüm)** |
| maplibre-gl | 5.24.0 | 6.0.0 | 5 → 6 |
| lighthouse (dev) | 12.8.2 | 13.4.1 | 12 → 13 |
| playwright-core (dev) | 1.61.1 | 1.62.0 | — (minör) |
| three | 0.185.1 | 0.185.1 | güncel |
| pixelmatch | 7.2.0 | 7.2.0 | güncel |
| pngjs | 7.0.0 | 7.0.0 | güncel |

**Astro 5 hattı zaten sonuncuda:** 5.x son sürümü **5.18.2** — üzerindeyiz.
Yani "5 içinde güncelleme" diye bir seçenek yok.

## A0.1 ENGEL — Node sürümü (yetkili kaynak: paketlerin `engines` alanı)

```
node -v                     → v20.20.2   (apt: 20.20.2-1nodesource1, nvm YOK)

astro@5.18.2   engines.node → 18.20.8 || ^20.3.0 || >=22.0.0     ✔ uyuyor
astro@6.0.0-6.0.5           → ^20.19.1 || >=22.12.0              ✔ (dar pencere)
astro@6.0.6 … 6.4.8         → >=22.12.0                          ✘
astro@7.1.5                 → >=22.12.0                          ✘
lighthouse@13.4.1           → >=22.19                            ✘
maplibre-gl@6.0.0           → >=16.14.0                          ✔
playwright-core@1.62.0      → >=20                               ✔
```

Astro 6'nın **yalnız ilk altı yamasında** Node 20 destekleniyor; 6.0.6'da
düşürülmüş. Yani Node 20 ile gidilebilecek en uzak nokta **astro 6.0.5**
— kapanmış bir dal, hedeflenen 7.1.5'e ulaşmıyor.

**Kaynaklar:** [Astro v6 yükseltme rehberi](https://docs.astro.build/en/guides/upgrade-to/v6/)
· [Astro v7 yükseltme rehberi](https://docs.astro.build/en/guides/upgrade-to/v7/)
· [maplibre-gl v6.0.0 sürüm notları](https://github.com/maplibre/maplibre-gl-js/releases/tag/v6.0.0)
· sürüm/engines verisi `npm view` ile ölçüldü.

---

## A1. RİSK HARİTASI — kırıcı değişiklikler bu projeye dokunuyor mu?

Her satır **ölçüldü** (kaynak taraması), tahmin yok.

| Kırıcı değişiklik (v6/v7) | Ölçüm | Sonuç |
|---|---|---|
| Legacy Content Collections API kaldırıldı | `src/content.config.ts` **Content Layer** kullanıyor (`glob` loader), legacy `schema:` fonksiyonu **0** | **ETKİSİZ** — zaten yeni API'deyiz |
| Zod v4'e geçiş | Kullanılan metodlar: `z.string/object/array/boolean/enum/literal/coerce.date` — hepsi v4'te değişmedi | **ETKİSİZ** |
| `Astro.glob()` kaldırıldı | **0** kullanım | **ETKİSİZ** |
| `<ViewTransitions />` kaldırıldı | **0** | **ETKİSİZ** |
| `getStaticPaths()` içinde `Astro` erişimi | 5 "isabet" **yanlış pozitif** — hepsi bileşen gövdesindeki `Astro.props`, `getStaticPaths` içinde değil | **ETKİSİZ** |
| `astro:build:done` `routes` parametresi kaldırıldı | 4 entegrasyonumuz `{ dir, logger }` alıyor · `routes` **0** | **ETKİSİZ** |
| SSR/adapter API değişimleri (`NodeApp`, `app.render`) | `adapter`/`output: server` **0** — site tamamen statik | **ETKİSİZ** |
| `@astrojs/db` kaldırıldı (v7) | **0** | **ETKİSİZ** |
| `astro:transitions` internals (v7) | `TRANSITION_*` **0** | **ETKİSİZ** |
| Markdown motoru değişti, remark/rehype ayrı paket (v7) | `astro.config.mjs`'te remark/rehype **0** | **ETKİSİZ** |
| `astro:assets` / `<Image>` davranış değişimleri | **0** kullanım | **ETKİSİZ** |
| CommonJS config desteği kalktı | `astro.config.mjs` (ESM) | **ETKİSİZ** |
| i18n varsayılan değişimi | i18n **0** | **ETKİSİZ** |
| **v7: kapanmamış etiket artık HATA** | 6 "dengesiz" bulgu tarandı — **6/6 yanlış pozitif** (etiket adları YORUM metninde geçiyor: `<li>`, `<noscript>`, `<details>`) | **RİSK DÜŞÜK** — build zaten temiz |
| **v7: `compressHTML` varsayılanı `'jsx'`** | Satır-içi öğelerde boşluk davranışı değişebilir | **İZLENECEK** — md14 G1-G6 ve dist bayt kıyası bunu yakalar |
| **v6: Vite 7 / v7: Vite 8** | 4 özel entegrasyonumuz Vite API'si kullanmıyor (yalnız `astro:build:done`) · `esbuild` doğrudan çağrılıyor (`sKlasoruKucult`) | **DÜŞÜK** — esbuild sürümü Vite ile gelebilir, kanca kendi `import`unu yapıyor |

**Özet: 13 kalem ETKİSİZ, 2 kalem düşük/izlenecek, 0 kalem gerçek engel.**

---

## A2-A4. UYGULANAMADI

Node 20.20.2 ile `astro@7.1.5` **kurulamaz** (`engines` reddi). Bu yüzden
A2 (yükselt), A3 (kapı) ve A4 (falsifikasyon) **koşulmadı** — yükseltilmiş
bir dist üretilemediği için ölçülecek bir şey yok. Bunları "geçti" ya da
"kaldı" diye işaretlemek uydurma olurdu.

**Diğer paketler neden yükseltilmedi:**

| Paket | Karar | Gerekçe (ölçülü) |
|---|---|---|
| `lighthouse` 12→13 | **YAPILMADI** | `engines: >=22.19` — aynı Node engeli |
| `maplibre-gl` 5→6 | **YAPILMADI, AYRI BRIEF** | v6 kırıcıları ağır: **ESM-only** (UMD kaldırıldı), **WebGL2 zorunlu** (WebGL1 desteği yok), `Map` mimarisi kompozisyona geçti, olay sınıfları değişti, `styleimagemissing` → `setMissingStyleImageResolver`. Tek tüketici `/harita/` ve **bu sunucuda GPU YOK** (CLAUDE.md GPU kuralı) — görsel doğrulama headless'ta kanıt sayılmaz. Bu iş kendi briefini hak ediyor. |
| `playwright-core` 1.61→1.62 | **YAPILMADI** | Ölçüm aracının kendisi. Chromium yapısı değişirse **md14 G1-G6 tabanı** (`chromium-1228` ile alınmış) ve md15 a11y skorları kayar. Güvenlik sürücüsü yok, kazanç yok, taban riski var. |
| `three`, `pixelmatch`, `pngjs` | gerek yok | zaten en güncel |

---

## A5. MERGE YOK — durum ve geri alma

Hiçbir kaynak dosyası değiştirilmedi; worktree yalnız bu raporu içeriyor.

```bash
# Worktree'yi kaldırmak (kanıt arşivlendikten sonra):
git worktree remove /home/suha/projeler/suharitasi-astro --force
git branch -D astro-2026-07-29
```

**Düşen kapı:** A2 — `astro@7.1.5` kurulamıyor (`engines.node >=22.12.0`,
kurulu 20.20.2). A3/A4 bu yüzden hiç koşmadı.

---

## Node yükseltmesinin YARIÇAPI (ölçüldü — sanılandan küçük)

Paylaşımlı sunucuda Node'u yükseltmek riskli görünüyordu; ölçüm bunu
büyük ölçüde çürüttü:

| Kontrol | Ölçüm |
|---|---|
| BIST / arslan-* / muvekkil-* birimlerinde `node` | **0** — hepsi python/uvicorn |
| suharitasi crontab'ında node kullanan satır | **3** (iki `--tam`, bir `--dis-link-tam`) |
| Depodaki node aracı | **43** `.mjs` |
| nvm (kullanıcı düzeyi sürüm yöneticisi) | **YOK** — sistem node'u tek |

Yani Node yükseltmesi **yalnız suharitasi'yi etkiler**; G5'in koruduğu
BIST tarafı node kullanmıyor. Yine de `/usr/bin/node` değişimi **root**
işlemidir ve sistem geneli olduğu için **kullanıcı kararıdır.**

**İki yol var:**
1. **Sistem Node'unu yükselt** (`nodesource` 22.x). Etki alanı yalnız
   suharitasi; ama tüm cron'lar aynı anda yeni Node'a geçer.
2. **nvm ile kullanıcı düzeyinde Node 22** kur, cron satırlarında tam
   yolu kullan (`/home/suha/.nvm/versions/node/v22.x/bin/node`). Sistem
   Node'una **hiç dokunulmaz**, geri dönüş tek satır. **Daha az riskli.**

Her iki durumda da yükseltme sonrası A3/A4 kapıları **aynen** koşulmalı.

---

## Kullanıcı kararı bekleyen

1. **Node 22.12+ kurulsun mu, hangi yolla?** (öneri: **nvm** — sistem
   node'una dokunmaz, geri dönüş kolay). Kurulunca Astro 5→7 yükseltmesi
   ayrı ve kısa bir iş olur: risk haritası **13/15 etkisiz** diyor.
2. **maplibre-gl 5→6** ayrı brief ister mi? (ESM-only + WebGL2; `/harita/`
   GPU'suz doğrulanamıyor.)
3. `lighthouse` 13 ve `playwright-core` 1.62, Node yükseltmesiyle birlikte
   ve **md14/md15 tabanları yenilenerek** ele alınmalı.

**Aciliyet notu:** Bu bir güvenlik aciliyeti DEĞİL. `rapor/npm-acik-degerlendirmesi.md`
§2'de ölçüldü — astro advisory'lerinin düzelttiği yüzeylerin (`define:vars`,
server islands, adlı slot, SSR) **hiçbiri bu projede kullanılmıyor**.
