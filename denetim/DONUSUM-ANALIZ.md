# SİTE DÖNÜŞÜM MOTORU — keşif, kurulum, analiz

Tarih: 2026-07-25 21:35–22:10 UTC · main = `6d0e209` (K1'in 2 commit'i push
edilmemiş) · **Hiçbir site dosyası değiştirilmedi, commit/push yapılmadı.**
Ölçüm kaynağı: `dist/` (24 Tem 2026 23:16 derlemesi, 174 sayfa) + canlı HTTP
başlıkları. Sitemap 172 URL bildiriyor; fark aşağıda açıklanıyor.

---

## 🔴 ANALİTİK DURUMU — raporun tamamını belirler

**Ziyaretçi verisi yok. Bu rapordaki tüm dönüşüm önerileri varsayıma dayanır,
ölçüme değil.**

Kanıt:
- `grep -rn "gtag|googletagmanager|analytics|plausible|umami|beacon" src/ public/ astro.config.*` → **0 isabet**.
- Canlı ana sayfa HTML'inde `beacon.min.js` / `cloudflareinsights` / `gtag` → **0 isabet** (`curl` ile çekilip tarandı).
- Sunucu başlıkları `server: cloudflare` · `cf-ray` · `cf-cache-status: DYNAMIC` — site Cloudflare arkasında.

Ayrım (dürüstlük kaydı): Cloudflare **zone analitiği** (istek sayısı, bant
genişliği, en çok istenen yollar) beacon olmadan da panelde bulunur ve
proxy'li alan adında her zaman açıktır. Ama bu sunucu-tarafı trafik verisidir;
**hangi bloğun okunduğu, nereye kadar kaydırıldığı, hangi linke tıklandığı
ölçülmez.** Cloudflare **Web Analytics**'in (davranış ölçen ürün) açık olup
olmadığı koddan ayırt edilemez — beacon yokluğu güçlü bir işaret ama
**panelden doğrulanmalı.**

**İlk öneri, sıradaki her şeyin önünde: analitik kurulumu.** Ücretsiz seçenekler:

| Seçenek | Maliyet | Kurulum | Not |
|---|---|---|---|
| **Cloudflare Web Analytics** | Ücretsiz, sınırsız | Panelden aç → beacon otomatik enjekte | Site zaten Cloudflare Pages'te; çerezsiz, KVKK dostu, ek istek yok. **En düşük sürtünme.** |
| Umami (self-host) | Ücretsiz (sunucu var) | Docker + Postgres | Olay/hedef takibi daha zengin; sunucuya yük bindirir |
| Plausible (self-host) | Ücretsiz (AGPL) | Docker + ClickHouse | Umami'den ağır; barındırılan sürümü **ücretli** (Y4) |

Not: Plausible ve Umami'nin *barındırılan* sürümleri ücretlidir ve Y4 gereği
kurulmadı. Yalnız kendi sunucuda çalışan ücretsiz sürümleri değerlendirildi.

---

## 1. TARAMA VE KALİTE SÜZGECİ

### Taranan

| Kanal | Sorgu | Yüzeye çıkan |
|---|---|---|
| GitHub topic | `claude-skills`, `agent-skills`, `claude-plugin` | 5 929 / 11 714 / 1 502 depo (ilk 20'si incelendi) |
| GitHub topic | `marketing-skills`, `seo-skills`, `ai-agent-skills` | **14** / **7** / 89 depo (tamamı incelendi — ilk ikisi zaten küçük) |
| GitHub arama | GEO / AEO / AI search visibility (3 sorgu) | 51 + 41 + 5 depo |
| GitHub arama | CRO / information architecture / landing page copy (3 sorgu) | **4** + **4** + 15 depo |

**İncelenen benzersiz depo: ~120** (12 sorgunun ilk 12–20 sonucu, mükerrerler düşülerek).
**Klonlanan: 12.**

### Kalite süzgeci ölçümü (klonlanan 12)

| Repo | Son commit | SKILL.md | Ort. satır | Medyan |
|---|---|---|---|---|
| digital-marketing-pro | 2026-07-18 | 158 | 100 | 65 |
| openclaudia-skills | 2026-07-25 | 73 | 288 | 240 |
| claude-code-marketing-skills | 2026-06-16 | 53 | 286 | 203 |
| marketingskills | 2026-07-22 | 48 | 302 | 310 |
| openclaw-marketing-skills | 2026-06-02 | 39 | 276 | 264 |
| geo-skills | 2026-07-12 | 24 | 308 | 344 |
| ai-marketing-skills | 2026-05-27 | 22 | 158 | 169 |
| gtm-engineer-skills | 2026-06-07 | 12 | 305 | 259 |
| superseo-skills | 2026-05-12 | 11 | 144 | 135 |
| claude-cro-skills | 2026-03-10 | 6 | 310 | 358 |
| eGEOagents | 2026-07-25 | 5 | 99 | 77 |
| geo-optimizer-skill | 2026-07-17 | 1 | 209 | 209 |

**Tarih süzgeci: hiçbiri elenmedi** — en eskisi 2026-03-10, 6 aylık eşiğin
(2026-01-25) içinde.
**Uzunluk süzgeci: hiçbiri ortalama 40 satırın altında değil.** Yani mekanik
süzgeç bu 12'yi ayıramadı; ayrım **içerik** okumasıyla yapıldı.

### Elenenler (kurulmayanlar) ve sebebi — 12'nin 8'i

| Repo | Eleme sebebi |
|---|---|
| `claude-code-marketing-skills` | 53 skill'in çoğu GA4 / GTM / Google Ads / Meta CAPI bağımlı. **Analitik yok, reklam hesabı yok** → girdisi karşılanamaz |
| `digital-marketing-pro` | 158 skill, medyan 65 satır — ajans iş akışı (müşteri raporu, bütçe, teklif). Tek siteye uygulanabilir çekirdeği küçük, gürültüsü büyük |
| `claude-cro-skills` | 6 skill'in **tamamı** signup / form / paywall / onboarding / popup. Sitede hesap, form, ödeme **yok** → konu dışı |
| `openclaw-marketing-skills` | `marketingskills` ile büyük ölçüde aynı skill adları; daha eski (2026-06-02) ve `references/` yok |
| `openclaudia-skills` | Güçlü ama SEMrush / Search Console / SimilarWeb / Google Ads bağlantılı; GEO tarafı `geo-skills`'in gerisinde |
| `ai-marketing-skills` | Ortalama 158 satır, ağırlık video/podcast/outbound pipeline'ında; dört hedefe temas eden skill'i zayıf |
| `gtm-engineer-skills` | AEO içeriği iyi ama `geo-skills` ile örtüşüyor; kalanı backlink/Reddit odaklı (bu site için kapsam dışı) |
| `eGEOagents` | `content-scoring` 77 satır, 10 kriterlik sığ liste — `geo-citability`'nin 5 ağırlıklı kategorili rubriği aynı işi daha derin yapıyor |

**Ayrı kategori — `geo-optimizer-skill` (619 yıldız): kurulmadı, ama okundu.**
Bu bir skill değil, tam bir Python uygulaması (`pyproject.toml`, `Dockerfile`,
`install.sh`, `frontend/`, `render.yaml`, MCP sunucusu). Kurulumu sisteme paket
yazmayı gerektirir; Y3 (sudo yok) ve "ağır sunucu bağımlılığı ekleme" (CLAUDE.md)
ile çelişir. Ücretli servis **gerektirmiyor** (açık kaynak, kendi sunucunda
çalışır) — eleme sebebi ücret değil, ağırlık. Yöntemi (`SCORING_RUBRIC.md`,
Princeton GEO adımları, llms.txt üretimi) rapora girdi olarak alındı.

---

## 2. OKUNAN SKILL'LER

| Skill | Repo | Yöntem / çerçeve | Girdi | Çıktı | Bağımlılık | Skor/varyant/panel |
|---|---|---|---|---|---|---|
| **geo-citability** | geo-skills | 5 ağırlıklı kategoride 0-100 alıntılanabilirlik rubriği (Princeton/Georgia Tech/IIT Delhi 2024 bulgusuna dayanıyor: AI 134-167 kelimelik, kendine yeten, olgu-yoğun pasajları alıntılıyor) | Sayfa HTML/metni | Skor + pasaj bazlı yeniden yazım önerisi | Yok (Read/Grep/WebFetch) | **Skorlama VAR** (ağırlıklı) |
| **geo-crawlers** | geo-skills | AI bot erişim matrisi 3 kademe (Tier 1 kesin izin / Tier 2 izin / Tier 3 stratejik); robots + meta + HTTP + JS-render kontrolü | robots.txt, başlıklar | Erişim haritası + 0-100 görünürlük skoru | Yok | Skorlama var |
| **geo-schema** | geo-skills | JSON-LD tespit → doğrulama → tip seçimi; `sameAs` "entity recognition için KRİTİK"; `speakable` sesli/AI asistan için | Sayfa | Eksik şema listesi + üretilmiş JSON-LD | Yok | Yok |
| **site-architecture** | marketingskills | 3-tık kuralı · L0-L3 hiyerarşi · nav 4-7 öğe · **yetim sayfa yasağı** · hub-and-spoke · 1000 kelimede 5-10 iç link | Sayfa envanteri, iş hedefi | ASCII ağaç + Mermaid + URL tablosu + iç link planı | Yok (`references/` 3 dosya) | Yok |
| **cro** | marketingskills | 7 basamaklı çerçeve: değer önermesi netliği → başlık → CTA hiyerarşisi → **görsel hiyerarşi/taranabilirlik** → güven sinyalleri → itiraz karşılama → sürtünme | Sayfa + hedef | Hızlı kazanımlar / yüksek etki / test fikirleri / kopya alternatifleri | Yok | **Varyant üretimi VAR** |
| **content-strategy** | marketingskills | "Aranabilir vs paylaşılabilir" ayrımı · içerik sütunları + konu kümeleri · alıcı aşamasına göre anahtar kelime (farkındalık→değerlendirme→karar→uygulama) | İş bağlamı, rakip | İçerik yol haritası, küme planı | Anahtar kelime aracı (opsiyonel) | Yok |
| **featured-snippet-optimizer** | superseo-skills | 8 adım: mevcut snippet → sorgu biçimi sınıflandırma → sayfa analizi → boşluk → yeniden yazım. Biçim kuralları: paragraf snippet **40-60 kelime**, sıralı liste (nasıl), tablo (karşılaştırma) | Anahtar kelime + URL | Yeniden yazılmış bölüm | SERP görüntüsü (elle) | Yok |
| **eeat-audit** | superseo-skills | Experience / Expertise / Authoritativeness / Trustworthiness dört boyutta puanlama + her boyuta ne eklenecek | Sayfa | Boyut skorları + eksik listesi | Yok | Skorlama var |
| **marketing-council** | marketingskills | 12 danışmanlı simüle kurul; **zorunlu muhalif koltuk**; anlaşmazlık haritası → sentez. Uydurma alıntı yasağı, canlı araştırma turu | Karar sorusu | Danışman görüşleri + çatışma haritası + başkan sentezi | Yok (12 dosya `references/advisors/`) | **Uzman paneli VAR** |

### Skill'ler arası besleme sırası

```
content-strategy ──► site-architecture ──► (sayfa üretimi)
                            │
                            ▼
        geo-schema ◄── geo-citability ──► featured-snippet-optimizer
              ▲               ▲
              │               │
        geo-crawlers      eeat-audit
              │
              ▼
             cro  ──►  marketing-council (yön çatışması varsa geri besler)
```
`marketing-council` yürütme yapmaz; yön tıkandığında çağrılır ve kararı
`cro` / `content-strategy` / `site-architecture`'a devreder.

### Dört hedeften karşılanma durumu

| # | Hedef | Karşılandı mı | Hangi skill |
|---|---|---|---|
| 1 | İçerik/görsel yeri, sırası, biçimi | **Kısmen** | `cro` (görsel hiyerarşi + CTA yerleşimi). **Görsel SEÇİMİ/üretimi için skill YOK** |
| 2 | Hangi bilgi öne, hangisi geri | **Evet** | `content-strategy`, `featured-snippet-optimizer`, `geo-citability` |
| 3 | Sitede dolaşmayı sağlayan iç akış | **Evet** | `site-architecture` |
| 4 | GEO + SEO teknik | **Evet, en zengin alan** | `geo-citability`, `geo-crawlers`, `geo-schema`, `eeat-audit` |

**BULGU — pazarın boş tarafı.** İki alan GitHub'da fiilen boş:
- **Bilgi mimarisi:** `information architecture + agent skill` araması **4 depo**
  döndürdü, üçü konuyla ilgisiz (referans listesi, kod linter'ı, HR ajanı).
  Tek gerçek IA kaynağı `marketingskills/site-architecture`.
- **CRO:** `conversion rate optimization + claude skill` **4 depo**, en yükseği
  5 yıldız; hepsi SaaS signup/paywall odaklı. İçerik sitesi için CRO skill'i yok.

Buna karşılık GEO/AEO alanı **kalabalık ve olgun** (tek aramada 51 depo, 619
yıldızlı bir uygulama). Yani: **teknik AI-arama tarafında hazır bilgi bol,
"ziyaretçiyi yakalayan yerleşim" tarafında hazır bilgi yok.** Hedef 1 için
büyük ölçüde kendi muhakememize kalıyoruz — bu, aşağıdaki [VARSAYIM]
etiketlerinin neden 1 numaralı hedefte yoğunlaştığını açıklıyor.

---

## 3. KURULAN / KURULMAYAN

Kurulum yeri: `.agents/skills/<ad>/` + `.claude/skills/<ad>` symlink (mevcut
`transitions-dev` düzeniyle aynı). **İkisi de `.gitignore`'da (satır 33-34)**,
dolayısıyla depoya sızmaz — CLAUDE.md tasarım skill kuralına uygun.

**Kurulan 9:** `geo-citability` (319 satır) · `geo-crawlers` (345) ·
`geo-schema` (363) · `site-architecture` (357) · `cro` (187) ·
`marketing-council` (161 + 12 danışman dosyası) · `content-strategy` (365) ·
`featured-snippet-optimizer` (155) · `eeat-audit` (175).

**Kurulmayan:** yukarıdaki 8 repo + `geo-optimizer-skill` +
`marketing-psychology` (455 satır zihinsel model ansiklopedisi — genel
muhakemeyle büyük ölçüde örtüşüyor, statik bir hukuk-bilgi sitesinde marjinal
değeri düşük, çağrıldığında bağlam maliyeti yüksek).

**Kurulum sonrası git durumu — değişen proje dosyası YOK:**
```
?? UYARI-SAGLIK.md        (K1 öncesinden var)
?? denetim/K2-KESIF.md    (K2 raporu)
HEAD = 6d0e209...  (değişmedi)
```

---

## 4. KUYRUK ÇELİŞKİSİ — karar kullanıcıya bırakıldı

SIRADAKILER'de planlı üç bespoke skill zaten **kurulu ve çalışıyor**
(`/seo-audit`, `/geo-audit`, `/site-tarama` — oturum listesinde görünüyor,
`dist/` üzerinde salt-okunur tespit yapıyorlar). Yeni kurulan generic
skill'lerle ilişkileri:

| Bespoke plan | Yeni kurulan | Örtüşme | Değerlendirme |
|---|---|---|---|
| `/seo-audit` (title/meta/canonical/h1/img-alt/OG/sitemap) | — | Yok | **HÂLÂ GEREKLİ.** Kurulan skill'lerin hiçbiri klasik on-page teknik denetim yapmıyor |
| `/geo-audit` (öz-cevap ≤280, JSON-LD, JS'siz DOM, soru-başlık) | `geo-citability`, `geo-schema` | **Yüksek** | Bespoke olan *bu projenin kurallarını* ölçüyor (280 karakter öz-cevap kuralı CLAUDE.md'ye özgü). Generic olan *puanlıyor ve neden'ini öğretiyor*. **İkisi farklı iş** — bespoke = geçti/kaldı denetimi, generic = 0-100 skor + yeniden yazım reçetesi |
| `/site-tarama` (SEO+GEO tam site, öncelik tablosu) | `site-architecture` | Düşük | **HÂLÂ GEREKLİ.** `site-architecture` *planlama* skill'i, tarama yapmıyor |
| — | `geo-crawlers` | — | **YENİ YETENEK.** Bespoke planların hiçbirinde AI bot erişim analizi yoktu |

**Sonuç: hiçbir bespoke plan gereksizleşmedi; kuyruk maddesi SİLİNMEDİ.**
Tek gerçek karar noktası `/geo-audit` ile `geo-citability` arasında ve bu bir
"birini sil" kararı değil, bir "birleştir mi, ayrı mı" kararı — **kullanıcıya
bırakıldı.** Önerim (uygulanmadı): ayrı kalsınlar, `/geo-audit` kapı bekçisi
(CI'da geçti/kaldı), `geo-citability` danışman (iyileştirme turlarında).

---

## 5. MEVCUT DURUM — ölçüm

### 5.1 Sayfa envanteri (174 sayfa, `dist/`)

| Bölüm | Sayfa | Not |
|---|---|---|
| `/kuyu-ruhsati/<il>/` | **82** | 81 il + dizin. Sitenin en büyük bölümü |
| `/durumum/<sektör>/` | **43** | 42 persona + dizin |
| `/havzalar/` | 26 | 25 havza + dizin |
| `/rehberler/` | 11 | 10 rehber + dizin |
| `/su-kanunu/` | 3 · `/vaka/` 2 · tekil sayfalar 7 | |

Sitemap 172, `dist/` 174 → fark: `/harita-pilot/` ve `/stil-pilot/` sitemap'e
girmiyor (**doğru davranış**), ama `dist/`'te yayınlanıyor ve **sıfır iç link
alıyorlar** — yani indekslenmezler ama erişilebilirler.

### 5.2 index.astro — DOM sırası ve ilk ekran

Gövde sırası (`src/pages/index.astro:258-315`):
1. `.ust-sabit` → `UstMenu` + `TamEkranMenu` — **tam ekran menü işaretlemesi
   burada satır içi basılıyor** (ana sayfa HTML'inin ilk ~6,2 KB'si; "Son
   rehberler / Su Kanunu — son durum / Öne çıkan havza" vitrin blokları dahil)
2. `<div id="world"></div>` — **boş div.** 6 videolu kaydırma sahnesi buraya
   JS ile monte ediliyor (`scrub-engine.js`). **Metin içeriği: sıfır**
3. `<section class="guverte">` — öz-cevap (`role="doc-abstract"`) + **7 soru**,
   DOM'da gerçek `<a>` linki; S2 native `<details>` ile JS'siz açılıyor
4. `<section class="inis">` — **`<h1>` "Su, yerin altında konuşur."** + tek
   `/durumum/` satırı
5. `AltBilgi` (künye)

**Ölçüm:** ana sayfa HTML'i 17 093 bayt; `<h1>` yaklaşık 13 000. bayttan sonra
geliyor. Ana sayfada 436 kelime, 4 başlık, **0 soru-başlığı**, 0 tablo.

### 5.3 Başlık hiyerarşisi — sitenin tamamını etkileyen yapısal bulgu

**171 / 174 sayfada `<h1>`'den ÖNCE `<h2>` geliyor.** Sebep: tam ekran menü
bileşeni her sayfada üç vitrin `<h2>`'si basıyor ("Son rehberler", "Su
Kanunu — son durum", "Öne çıkan havza"). Ziyaretçi bunları menüyü açana kadar
görmez; **metin çıkaran her ayrıştırıcı (AI tarayıcı dahil) görür.**

### 5.4 İç link grafiği — çift kutuplu

| Gelen link | Sayfa sayısı | Kimler |
|---|---|---|
| **0** | 2 | `/harita-pilot/`, `/stil-pilot/` (yetim) |
| **1** | **42** | 42 persona sayfası — **yalnız `/durumum/`'dan** |
| 2 | 4 | |
| 4-7 | 92 | 81 il sayfası + havzalar |
| 8-29 | 15 | |
| 89-97 | 3 | |
| **171-173** | **14** | Genel menü/künyede olanlar (`/hakkinda/`, `/harita/`, `/havzalar/`, `/hangi-kurum/`, `/vaka/`, `/rehberler/kuyu-tasima/` …) |

Örnek doğrulama: `/durumum/ana-metal-sanayii-nace-24/` sayfasına link veren tek
sayfa `/durumum/`. Grafiğin ortası **boş**: ya menüde 172 link alıyorsun, ya
tek link. `site-architecture`'ın "hub-and-spoke" modelindeki *spoke→spoke* ve
*cross-section* bağları yok.

### 5.5 Rehber sayfası nasıl bitiyor

**Brief'teki "şu an hiçbir şey yok" varsayımı yanlış.**
`/rehberler/kuyu-ruhsati/` başlık dizisi: Rejimin mantığı → Üç belge tek zincir
→ Belge yapısı → Başvuru akışı → Dikkat → Dayanak → Emsal kararlar → Madde
metni → 81 il için yetkili kurumlar → **İlgili rehberler**.

Son blok iki ilgili rehberi başlık + açıklamayla sunuyor (kuyu taşıma, kuyu
cezaları). Yani **rehber→rehber devamlılığı var.** Olmayan şey: rehber→araç
(`/durumum/`, `/hangi-kurum/`), rehber→havza ve **rehber→büro** geçişi.

`mailto:iletisim@suharitasi.com` **171 sayfada var** — ama yalnız künyede,
sayfanın en dibinde, çağrı metni olmadan.

### 5.6 Görsel envanteri

| Ölçüm | Değer |
|---|---|
| `<img>` **veya** `<video>` içeren sayfa | **1 / 174** (`/harita/`: 1 `<img>`, 25 `<svg>`) |
| Statik `<video>` etiketi olan sayfa | **0** |
| Ana sayfada `.mp4` referansı | 6 (JSON veri bloğunda, JS ile monte) |
| Ana sayfada `.jpg` / `.png` | 7 / 2 (poster/arka plan) |

**173 sayfada hiç görsel yok.** Ana sayfadaki 6 video HTML'de `<video>` olarak
değil, JS'in `#world`'e monte ettiği öğeler olarak var. Sonuç: **`alt` metni
yok, `ImageObject` şeması yok, JS çalıştırmayan AI tarayıcı için ana sayfanın
görsel katmanı hiç yok.**

### 5.7 GEO durumu

**robots.txt — tamamı:**
```
User-agent: *
Allow: /

Sitemap: https://suharitasi.com/sitemap.xml
```
Tek joker kural. **GPTBot, ClaudeBot, PerplexityBot, Google-Extended,
OAI-SearchBot için açık kural YOK** — `Allow: /` altında hepsi teknik olarak
serbest, ama `geo-crawlers` skill'inin Tier-1 listesi **açık izin** öneriyor
(bot operatörleri belirsizlikte muhafazakâr davranabiliyor).
**`llms.txt` YOK** (`public/llms.txt`, `public/llms-full.txt` — ikisi de yok).

**JSON-LD (174 sayfada tip başına sayfa sayısı):**

| Tip | Sayfa | Tip | Sayfa |
|---|---|---|---|
| WebSite | 172 | FAQPage / Question / Answer | 69 |
| Person | 171 | Place · PropertyValue · Dataset · ImageObject · ItemList | 1'er |
| Organization | 171 | **`sameAs`** | **0 (sitede hiç yok)** |
| BreadcrumbList | 171 | JSON-LD hiç olmayan | 2 (pilot sayfalar) |
| WebPage 94 · Article 92 | | | |

Rehber sayfası `@graph` yapısı sağlam: Organization + WebSite + BreadcrumbList
+ Article (`author` = Person "Serdar Arslan / Avukat", `publisher` = kurum,
`datePublished`/`dateModified` dolu).

**Ama ana sayfada tek blok var ve içinde yalnız `WebSite` tipi bulunuyor** —
Organization yok, Person yok. Varlık çapası sitenin kökünde en zayıf yerde.

**Cevap-önce yapısı:** 164 / 174 sayfada öz-cevap (`role="doc-abstract"` veya
`.oz-cevap`) var. Olmayan 10: `/vaka/`, `/hakkinda/`, `/kuyu-ruhsati/`,
`/rehberler/`, `/arac/il-rejimi/`, `/havzalar/`, `/su-kanunu/`,
`/su-kanunu/taslak-takibi/`, `/su-kanunu/mevzuat-kutuphanesi/`,
`/harita-pilot/` — **dokuzu dizin/hub sayfası.**

**Soru-başlığı:** örneklenen 4 sayfada toplam **1** (yalnız `/hangi-kurum/`
H1'i "Su işimde hangi kuruma gideceğim?"). Rehberlerin H2'leri kavram adı
("Rejimin mantığı", "Belge yapısı"), soru değil.

### 5.8 Sayfa ağırlığı

| Sayfa | HTML |
|---|---|
| `/arac/il-rejimi/` | 71,0 KB |
| `/rehberler/kuyu-tasima/` | 65,3 KB |
| `/rehberler/kuyu-ruhsati/` | 64,2 KB |
| `/hangi-kurum/` | 57,1 KB |
| `/durumum/` | 53,2 KB |
| `/harita/` | 51,1 KB |
| `/havzalar/sakarya/` 39,6 · `/havzalar/kizilirmak/` 31,8 · `/havzalar/firat-dicle/` 29,5 · `/havzalar/yesilirmak/` 29,3 | |
| **Ortalama** | **23,8 KB** |

Sayfa ağırlığı **sorun değil.** SITE-DURUM'daki Lighthouse ölçümleri de bunu
doğruluyor (masaüstü 94-99, mobil 75-94). LCP riski varsa HTML'den değil,
ana sayfadaki 6 videodan gelir.

---

## 6. ANALİZ

### Skor tablosu — `geo-citability` rubriği uygulandı (0-100)

Ağırlıklar: Cevap Bloğu %30 · Kendine Yetme %25 · Yapısal Okunabilirlik %20 ·
İstatistik Yoğunluğu %15 · Özgünlük %10.

| Sayfa | Cevap | Kendine yetme | Yapısal | İstatistik | Özgünlük | **TOPLAM** |
|---|---|---|---|---|---|---|
| `/rehberler/kuyu-ruhsati/` | 80 | 75 | **55** | 90 | 85 | **76** |
| `/hangi-kurum/` | 85 | 65 | **60** | 55 | 90 | **71** |
| `/durumum/ana-metal-sanayii-nace-24/` | 75 | 70 | **55** | 90 | 60 | **71** |
| `/` (ana sayfa) | 55 | 45 | **40** | 90 | 40 | **53** |

Ham girdiler: kelime sayısı 2 789 / 2 118 / 471 / 436 · paragraf başına
ortalama kelime 24,0 / 10,6 / 11,4 / 9,0 · 500 kelimede olgu işareti
6,8 / 2,1 / 9,6 / 8,0 · soru-başlığı 0 / 1 / 0 / 0 · tablo 2 / 1 / 0 / 0.

**Örüntü: her sayfada en düşük kategori "Yapısal Okunabilirlik".** Tek sebep
iki yapısal kusur: (a) H1'den önce gelen üç menü H2'si, (b) soru-başlığı
yokluğu. İçerik kalitesi (istatistik yoğunluğu 90) zaten yüksek — **kayıp,
içerikte değil iskelette.**

### Kurul oturumu — `marketing-council` uygulandı

> Simüle kurul — her görüş danışmanın yayımlanmış çerçevelerinden kurulmuştur,
> gerçek incelemeleri değildir.

**Kurulun önündeki soru:** Ana sayfa ve rehber sonrası akış, siteyi bir *kamu
veri portalı* olarak mı yoksa bir *hukuk otoritesi* olarak mı öne sürmeli?
Ölçüm bağlamı: 125/174 sayfa programatik (81 il + 42 persona), persona
sayfaları 1 gelen link alıyor, ana sayfada H1 en sonda, büroya tek yol
künyedeki mailto.

**Koltuklar:** April Dunford (konumlandırma) · Ann Handley (içerik/ses) ·
Byron Sharp (**muhalif** — erişim/bulunurluk, farklılaşma şüphecisi).

**April Dunford — konumlandırma.**
İlk sorusu: *"Bu site olmasaydı ziyaretçi ne yapardı?"* Cevap: bir avukatı
arar, DSİ'ye telefon eder, ya da arama motoruna yazıp forum cevabı okur. Yani
gerçek rakip **statükodur ve statüko ücretsizdir.** Sitenin benzersiz
niteliği ölçülebilir: 81 ilin yetkili kurum eşlemesi, 20 su işlemi × kurum
matrisi, madde-düzeyinde dayanak. Bunların hiçbiri statükoda **tek yerde**
yok. Ama ana sayfa bunu söylemiyor: `<h1>` "Su, yerin altında konuşur." —
bu bir *tema*, kategori çerçevesi değil. Ziyaretçi hangi pazara baktığını
anlamıyor. Dunford'a göre öncelik, ana sayfanın ilk ekranında "bu, Türkiye su
mevzuatının tek haritalı başvuru noktasıdır" çerçevesini kurmak; "Su, yerin
altında konuşur." alt satıra iner.
**Alt satır:** Kategori çerçevesini H1'e taşı, şiiri altına al.

**Ann Handley — içerik ve ses.**
*"So what? Because…"* testini persona sayfalarına uyguluyor: 471 kelime, 1
gelen link, ana sayfadan görünmez. Bunlar bir okur için yazılmamış, bir dizin
için yazılmış. Handley'in "playing it too safe" uyarısı tam buraya oturuyor:
site elindeki en cesur varlığı — *bir avukatın kendi adıyla, madde numarasıyla
yazdığı hüküm* — 42 kez inceltilmiş halde tekrarlıyor. Buna karşılık H1'i
("Su, yerin altında konuşur.") savunuyor: logo silinse bu cümlenin kime ait
olduğu belli. Dunford'a itirazı burada. Ayrıca rehber sonundaki "İlgili
rehberler" bloğunu **doğru içgüdü ama eksik muhatap** buluyor: okuyucu o an
bir karar anında, kendisine bir sonraki *makale* değil bir sonraki *adım*
lazım.
**Alt satır:** Persona sayfalarını ya kalınlaştır ya birleştir; H1'in sesine
dokunma; rehber sonuna insan muhatabı koy.

**Byron Sharp — muhalif, kanıt temelli bulunurluk.**
İkisine de itiraz ediyor. Dunford'a: *farklılaşma alıcının algıladığı bir şey
değil*; ziyaretçi "tek haritalı başvuru noktası" ifadesini rakiplerden ayırt
etmez, çünkü rakip diye bir marka yok — arama sonucu var. Handley'e: 42 ince
sayfa **kusur değil, kategori giriş noktası**; her biri farklı bir arama
anına ("NACE 24 su yükümlülüğü", "Adana kuyu ruhsatı") karşılık geliyor ve
bulunurluk böyle kurulur. Sharp'ın asıl itirazı ölçüme: sitenin sorunu
konumlandırma ya da ses değil, **fiziksel bulunurluk** — 42 sayfa tek bir
kapıdan besleniyor, 2 sayfa hiç beslenmiyor, grafiğin ortası boş. Ayrıca
ayırt edici varlık uyarısı: ana sayfanın tek görsel imzası JS'e bağlı; JS
çalışmazsa ya da AI tarayıcı okursa **marka görsel olarak yok.**
**Alt satır:** Konumlandırma cümlesini tartışmayı bırakın; giriş noktalarını
çoğaltın ve iç link grafiğinin ortasını doldurun.

**Kurulun anlaşamadığı yerler**

1. **Persona sayfaları: incelik kusur mu, kapsam mı?** Handley "471 kelime bir
   okuru hak etmiyor" diyor; Sharp "her biri bir kategori giriş noktası, sayı
   erdemdir" diyor. Gerçek ödünleşme: **derinlik mi, yüzey alanı mı.**
   Ne çözerdi: sayfa başına arama girişi verisi — **analitik olmadığı için
   şu an çözülemez.** (🔴 bölümüne bağlanıyor.)
2. **Ana sayfa H1: çerçeve mi, ses mi?** Dunford kategoriyi, Handley sesi
   istiyor. Ödünleşme: **anlaşılırlık mı, akılda kalıcılık mı.** Ne çözerdi:
   ilk ekranda iki varyantın karşılaştırılması — ölçüm gerektirir.
3. **Sharp vs ikisi: sorun mesajda mı, dağıtımda mı?** Ölçüm Sharp'ı destekliyor
   (42 sayfa × 1 link, 2 yetim, grafiğin ortası boş), çünkü bu **mesajdan
   bağımsız, doğrulanmış bir kusur.** Diğer ikisi ölçüyle desteklenemiyor.

**Başkan sentezi.** Bu sitenin bağlayıcı kısıtı şu an **dağıtım, mesaj değil**
— çünkü dağıtım kusuru ölçüldü, mesaj kusuru ölçülemiyor. Sıra: (1) analitik,
(2) iç link grafiğinin ortasını doldur, (3) yapısal GEO kusurlarını gider
(H1/H2 sırası, soru-başlıkları, `sameAs`), (4) ancak ondan sonra H1 ve persona
derinliği tartışmasına dön — o zaman veriyle dönülür.
**Tetikleyici (Sharp'ın uyarısı):** JS'siz/AI-tarayıcı görünümünde ana sayfanın
görsel kimliği sıfır. Bu, ölçülmüş bir kusur ve mesaj tartışmasını beklemez.

---

### A) Ana sayfa: hero, 7 soru, blok sırası doğru mu?

**Ziyaretçi şu an ilk 5 saniyede ne görüyor:** kaydırma sahnesi (6 video) +
öz-cevap + 7 soru. **Metin ayrıştırıcının gördüğü:** menü vitrini (3 H2) →
boş div → öz-cevap + 7 soru → H1.

- **A1.** `<h1>` DOM'da öz-cevap ve 7 sorudan sonra, üç menü H2'sinin ardında
  geliyor; ana sayfa yapısal okunabilirlikte 40/100 aldı. H1'i menü
  işaretlemesinin önüne almak gerekiyor. **[VERİ]** (5.2, 5.3, skor tablosu) +
  **[YÖNTEM]** (`geo-citability` Kategori 3: "H1 > H2 > H3, asla atlama")
- **A2.** 7 soru gerçek `<a>` linki ve JS'siz çalışıyor — **bu doğru kurulmuş,
  dokunulmamalı.** Ama hiçbiri soru-başlığı (`<h2>`) değil, düz link. Soru
  metinlerini başlık düzeyine çıkarmak AI sorgu eşleşmesini artırır.
  **[VERİ]** (soru-başlığı = 0) + **[YÖNTEM]** (`featured-snippet-optimizer`
  adım 2: sorgu biçimi sınıflandırma)
- **A3.** Blok sırası (sahne → öz-cevap+sorular → H1+kapanış) ziyaretçi için
  savunulabilir; sorun sıra değil **H1'in konumu.** Sıralamayı bozmadan yalnız
  H1'i yukarı almak yeterli. **[VARSAYIM]** — ziyaretçinin sırayı nasıl
  deneyimlediği ölçülmedi
- **A4.** Ana sayfa 436 kelime ve özgünlük skoru 40 — ana sayfa hiçbir özgün
  olguyu barındırmıyor, hepsini devrediyor. Öz-cevabın altına 2-3 somut sayı
  (25 havza, 81 il, 20 su işlemi) eklemek özgünlüğü ve alıntılanabilirliği
  yükseltir. **[VERİ]** + **[YÖNTEM]** (`geo-citability` Kategori 4-5)

### B) Rehber bitince ziyaretçi ne yapmalı?

**Düzeltme: "hiçbir şey yok" doğru değil** — `İlgili rehberler` bloğu 2 ilgili
rehberi açıklamayla sunuyor **[VERİ]** (5.5). Eksik olan, rehberden *araca* ve
*büroya* geçiş.

| # | Seçenek | Etki | Efor | Kanıt |
|---|---|---|---|---|
| B1 | `İlgili rehberler` bloğuna araç satırı ekle ("Sektörünüz için: /durumum/" · "Hangi kurum: /hangi-kurum/") | Yüksek — grafiğin ortasını dolduran en ucuz hamle | Düşük (tek bileşen) | **[VERİ]** iç link grafiği çift kutuplu · **[YÖNTEM]** `site-architecture` cross-section linking |
| B2 | Rehber sonuna açık muhatap bloğu (künyedeki mailto'yu çağrı metniyle yukarı taşı) | Orta-yüksek | Düşük | **[VERİ]** mailto 171 sayfada ama yalnız künyede · **[YÖNTEM]** `cro` adım 3 (CTA hiyerarşisi) |
| B3 | İl-özel geçiş: rehberin "81 il" tablosundan ilgili `/kuyu-ruhsati/<il>/` sayfasına bağlam linki | Orta | Orta | **[VERİ]** il sayfaları 4-7 link alıyor, rehberden bağlam linki yok |
| B4 | "Sonraki adım" mikro-akışı (bu rehberi okuduysanız sırada X) | Orta | Orta-yüksek | **[YÖNTEM]** `content-strategy` alıcı aşaması (farkındalık→uygulama) |

Kurulun uyarısı (Handley): B1 tek başına yapılırsa okuyucuya yine *makale*
verilmiş olur; B2 ile birlikte yapılmalı.

### C) Hangi sayfalar gömülü, nasıl yüzeye çıkar?

**Gömülü olanlar ölçüldü [VERİ]:**
- **42 persona sayfası** — tek gelen link, kaynağı yalnız `/durumum/`
- **81 il sayfası** — 4-7 gelen link, ana sayfadan hiç link yok
- **2 yetim** — `/harita-pilot/`, `/stil-pilot/` (sitemap'te yok, iç link yok)

| # | Hamle | Etki | Efor | Kanıt |
|---|---|---|---|---|
| C1 | Persona ↔ persona çapraz link (aynı NACE ailesinden 3 komşu) | Yüksek — 42 sayfayı 1'den 4'e çıkarır | Düşük (veriden türetilebilir) | **[VERİ]** + **[YÖNTEM]** `site-architecture` "yetim sayfa yasağı", spoke↔spoke |
| C2 | Rehber → ilgili persona/il bağlam linki | Yüksek | Orta | **[VERİ]** grafiğin ortası boş |
| C3 | Persona → il ve il → persona kesişimi ("NACE 24 + Adana") | Orta | Yüksek | **[VARSAYIM]** — talebin var olduğu ölçülmedi |
| C4 | Pilot sayfaları: ya iç linkle ya `noindex`+kaldır | Düşük | Düşük | **[VERİ]** 0 gelen link, sitemap dışı |

Not (kurul, Sharp): C1 ve C2 "mesajdan bağımsız" düzeltmeler — analitik
beklemeden yapılabilir. C3 beklemelidir.

### D) Görseller

**Ölçüm: 173/174 sayfada görsel yok; ana sayfadaki 6 video JS ile monte
ediliyor, statik HTML'de `<video>` etiketi sıfır [VERİ]** (5.6).

⚠ **Aşağıdaki her görsel önerisi REFERANS GÖRSEL gerektirir. Öneri yalnız tarif
edilmiştir; "şu görsel yapılsın" denmemektedir — kullanıcı önce referans
görselle onaylayacaktır.**

| # | Öneri (tarif) | Etki | Efor | Kanıt | Referans görsel onayı |
|---|---|---|---|---|---|
| D1 | Ana sayfadaki mevcut video sahnelerine `<noscript>` içinde poster `<img>` + `alt` | Orta-yüksek (JS'siz + AI görünürlüğü) | Düşük — görsel zaten var, yalnız statik karşılığı yok | **[VERİ]** 6 mp4 var, 0 `<video>` · **[YÖNTEM]** `geo-crawlers` adım 5 (JS render bağımlılığı) | **GEREKMEZ** — mevcut kareler kullanılır |
| D2 | Rehber sayfalarına süreç şeması (başvuru akışı: kim → hangi belge → hangi kurum) | Yüksek | Yüksek | **[VERİ]** rehberde "Başvuru akışı" H2'si var ama görsel yok · **[YÖNTEM]** `geo-citability` Kategori 3 (süreçler için sıralı yapı) | **GEREKLİ** |
| D3 | Havza sayfalarına havza küçük haritası (statik SVG) | Orta | Orta | **[VERİ]** 26 havza sayfası, hepsi görselsiz | **GEREKLİ** |
| D4 | Persona sayfalarına sektör ikonu | Düşük | Düşük | **[VARSAYIM]** — dekoratif, ölçülmüş bir eksiği kapatmıyor | **GEREKLİ** |

DESIGN.md çelişkisi kontrolü: D1-D3 mevcut palet ve sadelik ilkesiyle çelişmiyor
(içerik görseli, dekor değil). D4 "sadelik amaç değildir ama efekt zarif kalana
kadar kısılır" ilkesiyle sınırda — **[VARSAYIM]** olduğu için zaten düşük öncelik.

### E) GEO/SEO teknik — AI aramada alıntılanmak için ne eksik

| # | Eksik | Etki | Efor | Kanıt |
|---|---|---|---|---|
| E1 | **`sameAs` sitede hiç yok (0 sayfa)** — varlık tanıma için baro/LinkedIn/kurum profilleri bağlanmalı | Yüksek | Düşük | **[VERİ]** + **[YÖNTEM]** `geo-schema` adım 5: "sameAs — entity recognition için KRİTİK" |
| E2 | **Ana sayfada yalnız `WebSite` şeması** — Organization ve Person yok; varlık çapası kökte en zayıf | Yüksek | Düşük | **[VERİ]** ana sayfa JSON-LD dökümü · **[YÖNTEM]** `geo-schema` "Organization — her iş sitesinde KRİTİK" |
| E3 | **171 sayfada H1'den önce H2** (menü bileşeni) | Yüksek | Orta (bileşen sırası) | **[VERİ]** 171/174 · **[YÖNTEM]** `geo-citability` Kategori 3 |
| E4 | **Soru-başlığı yok** — H2'ler kavram adı, AI sorgusuyla eşleşmiyor | Yüksek | Orta (içerik dokunuşu) | **[VERİ]** 4 sayfada 1 · **[YÖNTEM]** `featured-snippet-optimizer` + `geo-citability` ("What is X?" doğrudan eşleşir) |
| E5 | **robots.txt'te AI botlarına açık kural yok** — `Allow: /` var ama Tier-1 botlar isimle geçmiyor | Orta | Düşük | **[VERİ]** robots.txt tam metni · **[YÖNTEM]** `geo-crawlers` Tier-1 matrisi. **CLAUDE.md ile uyumlu** (madde 3: arama ve AI botları asla engellenmez) |
| E6 | **`llms.txt` yok** | Orta | Düşük | **[VERİ]** dosya yok · **[YÖNTEM]** `geo-optimizer-skill` adım 3 |
| E7 | **10 hub sayfasında öz-cevap yok** (9'u dizin sayfası) | Orta | Düşük | **[VERİ]** 164/174 · **[YÖNTEM]** CLAUDE.md içerik ilkesi + `geo-citability` Kategori 1 |
| E8 | **`HowTo` şeması yok** — "Başvuru akışı" bölümleri süreç, şeması yok | Orta | Orta | **[VERİ]** JSON-LD tip dökümü · **[YÖNTEM]** `geo-schema` |
| E9 | Sayfa hızı **eksik değil** — ortalama 23,8 KB, LH 94-99/75-94 | — | — | **[VERİ]** 5.8 + SITE-DURUM |

**E-E-A-T notu (`eeat-audit`):** Expertise ve Authoritativeness güçlü (adıyla
avukat yazar, madde düzeyinde dayanak, emsal kararlar). **Trustworthiness'ta
`sameAs` boşluğu** (E1) ve **Experience boyutunda birinci-el deneyim anlatısı
yok** — vaka sayfaları bunu kısmen karşılıyor ama 2 tane. **[YÖNTEM]**

### F) Künyeye/büroya ulaşma yolu

**Şu an nasıl işliyor [VERİ]:** `mailto:iletisim@suharitasi.com` 171 sayfanın
künyesinde; `/hakkinda/` sayfası menüde ve 173 gelen linkle sitenin en çok
linklenen sayfası. Yani **erişilebilirlik yüksek, görünürlük düşük** — bağlantı
her sayfada var ama sayfanın en dibinde, çağrı metni olmadan.

| # | Hamle | Etki | Efor | Kanıt |
|---|---|---|---|---|
| F1 | Rehber/araç sayfalarının sonuna, "İlgili rehberler"in yanına açık muhatap bloğu | Yüksek | Düşük | **[VERİ]** mailto yalnız künyede · **[YÖNTEM]** `cro` adım 3 |
| F2 | `/hakkinda/`'ya `sameAs` + Person şeması derinleştirme (baro kaydı, künye) | Orta-yüksek | Düşük | **[VERİ]** sameAs 0 · **[YÖNTEM]** `geo-schema` + `eeat-audit` |
| F3 | Öz-cevap bloğunun altına ince "bu konuda görüş" satırı | Orta | Düşük | **[VARSAYIM]** — konumu ölçülmedi; CLAUDE.md "iddiada yavaş" ilkesiyle sınırlı tutulmalı |

---

## 7. ÖNCELİK TABLOSU

| # | Öneri | Kanıt | Etki | Efor | DESIGN.md çelişkisi | Görsel onayı |
|---|---|---|---|---|---|---|
| 0 | **Analitik kur (Cloudflare Web Analytics)** | [VERİ] beacon 0 | **Çok yüksek** — sonrakilerin ölçülebilirliği buna bağlı | Düşük | Yok | — |
| 1 | `sameAs` ekle (E1) | [VERİ]+[YÖNTEM] | Yüksek | Düşük | Yok | — |
| 2 | Ana sayfaya Organization + Person şeması (E2) | [VERİ]+[YÖNTEM] | Yüksek | Düşük | Yok | — |
| 3 | H1'i menü H2'lerinin önüne al (E3, A1) | [VERİ]+[YÖNTEM] | Yüksek | Orta | Yok (DOM sırası, görünüm değişmez) | — |
| 4 | Rehber sonuna araç + muhatap bloğu (B1+B2, F1) | [VERİ]+[YÖNTEM] | Yüksek | Düşük | Yok | — |
| 5 | Persona ↔ persona çapraz link (C1) | [VERİ]+[YÖNTEM] | Yüksek | Düşük | Yok | — |
| 6 | Soru-başlıkları (E4, A2) | [VERİ]+[YÖNTEM] | Yüksek | Orta | Yok | — |
| 7 | robots.txt'e Tier-1 AI botları açıkça yaz (E5) | [VERİ]+[YÖNTEM] | Orta | Düşük | Yok (CLAUDE.md m.3 ile uyumlu) | — |
| 8 | 10 hub sayfasına öz-cevap (E7) | [VERİ]+[YÖNTEM] | Orta | Düşük | Yok (CLAUDE.md içerik ilkesi zaten emrediyor) | — |
| 9 | `<noscript>` poster + alt (D1) | [VERİ]+[YÖNTEM] | Orta-yüksek | Düşük | Yok | **Gerekmez** |
| 10 | `llms.txt` (E6) | [VERİ]+[YÖNTEM] | Orta | Düşük | Yok | — |
| 11 | Rehber → il/persona bağlam linki (B3, C2) | [VERİ] | Orta | Orta | Yok | — |
| 12 | Ana sayfa öz-cevabına somut sayılar (A4) | [VERİ]+[YÖNTEM] | Orta | Düşük | Yok | — |
| 13 | `HowTo` şeması (E8) | [VERİ]+[YÖNTEM] | Orta | Orta | Yok | — |
| 14 | Rehberlere süreç şeması (D2) | [VERİ]+[YÖNTEM] | Yüksek | Yüksek | Yok | **GEREKLİ** |
| 15 | Havza küçük haritaları (D3) | [VERİ] | Orta | Orta | Yok | **GEREKLİ** |
| 16 | Pilot sayfaları çöz (C4) | [VERİ] | Düşük | Düşük | Yok | — |
| 17 | Ana sayfa H1 çerçeve tartışması (A3, kurul çatışma 2) | [VARSAYIM] | ? | Orta | **Olası** — H1 sesi DESIGN.md/marka tonuna ait | — |
| 18 | Persona derinliği vs sayısı (kurul çatışma 1) | [VARSAYIM] | ? | Yüksek | Yok | — |
| 19 | Persona × il kesişim sayfaları (C3) | [VARSAYIM] | ? | Yüksek | Yok | — |
| 20 | Sektör ikonları (D4) | [VARSAYIM] | Düşük | Düşük | **Sınırda** | **GEREKLİ** |
| 21 | Öz-cevap altı görüş satırı (F3) | [VARSAYIM] | ? | Düşük | Yok ("iddiada yavaş" sınırı) | — |

**Sıra mantığı (kurul sentezi):** 0 → 1-3 (şema/iskelet, mesajdan bağımsız) →
4-6 (akış) → 7-13 (teknik GEO) → 14-16 (görsel, referans onayıyla) →
17-21 **analitik veri geldikten sonra.**

---

## ÖZET — kanıt etiketi sayımı

| Etiket | Sayı | Nerede yoğun |
|---|---|---|
| **[VERİ]** (madde 5 ölçümüne dayanıyor) | **16** | Şema, iç link, başlık hiyerarşisi, görsel envanteri |
| **[YÖNTEM]** (okunan skill çerçevesine dayanıyor) | **15** | 16'sının 15'i aynı zamanda [VERİ] etiketli — yani ölçüm + çerçeve birlikte |
| **[VARSAYIM]** (ikisine de dayanmıyor) | **5** | #17 H1 çerçevesi · #18 persona derinliği · #19 kesişim sayfaları · #20 ikonlar · #21 görüş satırı |

**Toplam 21 öneri; 16'sı ölçüme dayanıyor, 5'i muhakeme ürünü.** Beş
[VARSAYIM]'ın **tamamı** öncelik tablosunun en altında ve **hepsi analitik
verisi bekliyor** — bu tesadüf değil: ziyaretçi verisi olmadan "hangi mesaj
tutar" ve "hangi derinlik doğru" soruları ölçülemiyor. 🔴 uyarısının pratik
karşılığı budur.

---

## DENETLENEMEDİ

1. **Cloudflare Web Analytics'in panelden açık olup olmadığı.** Beacon canlı
   HTML'de yok — güçlü işaret ama kesin değil; panele erişimim yok.
   **Panelden doğrulanmalı.**
2. **Cloudflare zone analitiğinde hangi metriklerin biriktiği.** Site aylardır
   yayında; istek/yol düzeyinde geçmiş veri panelde olabilir. Erişilemedi.
3. **Sitenin gerçek arama görünürlüğü.** Search Console/SERP verisi yok; hangi
   sayfanın hangi sorguda göründüğü ölçülemedi. `featured-snippet-optimizer`'ın
   1. adımı (mevcut snippet'i kontrol et) bu yüzden koşturulamadı.
4. **AI aramada şu anki alıntılanma durumu.** Skorlama rubriği *potansiyeli*
   ölçüyor; ChatGPT/Perplexity'nin siteyi fiilen alıntılayıp alıntılamadığı
   ölçülmedi (`geo-brand-mentions` skill'i bunu yapıyor ama API anahtarı
   gerektiriyor — kurulmadı).
5. **Ziyaretçinin ana sayfa blok sırasını nasıl deneyimlediği.** Kaydırma
   derinliği, 7 sorudan hangisinin tıklandığı, hero'nun terk oranı — hiçbiri
   ölçülemedi (madde 0).
6. **Skor tablosundaki Kategori 1, 2 ve 5 değerleri kısmen takdiridir.**
   Kategori 3 (yapısal) ve 4 (istatistik) doğrudan sayımdan geldi; cevap bloğu
   kalitesi, kendine yetme ve özgünlük rubriğe göre okunarak takdir edildi.
   Bağımsız bir ikinci okuyucu ±10 puan sapabilir.
7. **`dist/` bir gün eski** (24 Tem 23:16). 25 Tem'de içerik commit'i olmadığı
   için yapısal ölçümler geçerli sayıldı, ama birebir canlı doğrulama yapılmadı.
8. **`geo-optimizer-skill`'in kendi skorlaması koşturulmadı** (kurulmadı).
   Yalnız yöntemi okundu; onun 0-100 skoru ile bu rapordaki `geo-citability`
   skoru karşılaştırılamadı.
9. **Persona ve il sayfalarının içerik kalitesi tek tek okunmadı.** 42+81 sayfa
   örnekleme ile değerlendirildi (her birinden 1 sayfa). Aralarında kalite
   sapması olabilir.
