# KAPI-RAPORU.md — /nerede-su-cikar/ giriş kapısı sayfası

Brief: 2026-07-28, 4 faz · Worktree `suharitasi-kapi` · Dal `kapi-2026-07-28`
(main `3b878e4`'ten) · **MERGE EDİLMEDİ — kullanıcı onayı bekliyor.**
Kareler ve ham ölçümler: `cikti/denetim/kapi/`.

Bu rapordaki her sayı ölçümdür. Ölçüm tabanı `arac/dist-sun.mjs`
(CSP + `_redirects` uygulanır) — CANLI KOŞUL İLKESİ gereği
`python3 -m http.server` kullanılmadı.

---

## Kullanıcı kararlarının uygulanması

| # | Karar | Uygulama |
|---|---|---|
| 1 | Menüye eklensin, tek kaynak kanıtıyla | `VERI_ROTALARI`'na tek kayıt. Kanıt: dizi 1 yerde tanımlı, `PaylasilanMenu` onu `pm-rotalar` (masaüstü) + `pm-mobil-alt` (mobil) olarak render ediyor → her sayfada 2 geçiş, tek kaynak. 174/175 sayfada mevcut (eksik yalnız `/stil-pilot/`, PaylasilanMenu kullanmıyor — önceden böyle). |
| 2 | `SORULAR_V2[5]` dokunulmaz | Dokunulmadı. Ölçüm: `/havzalar/` hedefi yerinde, "Türkiye'de nerede su var?" metniyle. |
| 3 | KAYNAKLAR.md ölçülen değerle düzeltilsin | `1.226 künye / 49 il` → **`1.979 künye / 81/81 il`**. 1.2d metni bundan sonra kuruldu. |

---

## FAZ 1 — sayfa (commit `9ae099b`)

**Üretilenler:** `src/pages/nerede-su-cikar.astro` · `src/data/kapi.js` ·
`src/data/kapi-sss.js` · `KAYNAKLAR.md` düzeltmesi.

| Kalem | Ölçüm |
|---|---|
| Build | exit 0, 175 sayfa |
| Öz-cevap | **255 karakter** (sınır 280) |
| İl seçici | **81** benzersiz link, dist'te eksik hedef **0** |
| Şema | `WebPage · FAQPage(5) · ItemList(81, numberOfItems=81) · BreadcrumbList` + Organization/Person/WebSite |
| Meta | title · description (öz-cevaptan) · canonical `https://suharitasi.com/nerede-su-cikar/` · 9 OG etiketi |
| h-sırası | atlama **0** (h1 → 2×h2 → 4×h3 → h2 → 5×h3) |
| Soru başlığı | **8** |

### Sabit sayı yok — her rakam build anında sayılıyor

`src/data/kapi.js` içinde tek bir elle yazılmış rakam yoktur. Öz-cevaptaki
ve katman kartlarındaki tüm değerler `veri/potansiyel/*.json`'dan sayılır:
12 havza planı · 472 kütle · 347 eşleşme (37 il) · 419 RG kaydı
(109 başlık + 310 pasaj, 1963-2017, 70 il) · 122 DEM karosu / 81 il ·
356 MTA + 1.979 akademik künye · 1.239 kaynak + 487 kuyu işareti · 81 il sayfası.

RG yıl aralığı ayrıştırılarak hesaplanır: tarihler `GG.AA.YYYY` biçiminde
ve dizge olarak sıralandığında **yanlış** aralık verir (Faz 0'da bu hataya
düşüldü, 1972→1968 çıkmıştı). Ayrıca tarihsiz kayıt varsa build düşer.

### Uydurma yasağı — nasıl uygulandı

- **Dürüstlük etiketi kopyalanmadı**: `ilPotansiyel()` üreticisinden okunuyor,
  il bloklarındaki metinle aynı nesne.
- **Kuyu ruhsatı cevabı** rehberin kendi frontmatter `ozCevap`'ından
  `getCollection` ile geliyor — kopyası tutulmuyor.
- **Kalan 3 SSS cevabı** `IlPotansiyel.astro`'nun **ham metnine** karşı build
  anında doğrulanıyor (Vite `?raw`); eşleşme koparsa build düşer.
- Katman metinleri veri alanları + KAYNAKLAR.md künye adlarından kuruldu.
- Model bilgisinden tek bir jeoloji/hukuk cümlesi yazılmadı.

İki mekanik uyarlama (kod yorumunda kayıtlı): 2. cevapta il adı parametresi
düştü, gövde birebir; 3. cevapta cümle başı `"veri yok" satırları:` →
`"veri yok" satırlarında` çevrildi, gövde birebir.

### Falsifikasyon — guard'lar gerçekten çalışıyor mu

| Deney | Sonuç |
|---|---|
| Alıntı bozuldu ("kanıtı değildir" → "KESİN kanıtıdır") | build **exit 1**, kaynak adını veren hata |
| Öz-cevap 316 karaktere çıkarıldı | build **exit 1**, "280 sınırı aşıldı" |
| İkisi geri alındı | build **exit 0** |

---

## FAZ 2 — link yönlendirme (commit `3361c05`)

Değişen dosya: **`src/data/anasayfa-v2.js`** (tek dosya).

| Konum | Eski hedef | Yeni hedef |
|---|---|---|
| `SORULAR_V2[0]` "Türkiye'de su nerelerde çıkabilir?" (masaüstü + mobil, tek kayıt) | `/havzalar/` | `/nerede-su-cikar/` |
| `HIZMETLER[1]` "Sondaj İşlemleri" kartı | `/havzalar/` | `/nerede-su-cikar/` |
| `VERI_ROTALARI` — yeni kayıt "Nerede su çıkar? — 81 il" | (yoktu) | `/nerede-su-cikar/` |
| `SORULAR_V2[5]` "Türkiye'de nerede su var?" | `/havzalar/` | **değişmedi** (karar 2) |

Ölçüm: ana sayfada `/nerede-su-cikar/` **5 kez** — menü 2 + soru 2 + kart 1.
İçerik bağlamındaki meşru `/havzalar/` linklerine dokunulmadı.

---

## FAZ 3 — kanıt paketi

### 3.1 Sayfa ölçümleri (`arac/kapi-denetim.mjs`, exit 0)

| Kalem | Sonuç |
|---|---|
| HTTP | 200 |
| Konsol (1440 + 375) | **0** hata/uyarı (ortam GL gürültüsü 0) |
| İç link (sayfa içi) | 103 benzersiz, **kırık 0** |
| Kontrast | **127 metin düğümü** ölçüldü, **ihlal 0**; en dar pay **5,16:1** (eşik 4,5) `p.kapi-kunye` 10,9px |
| 375px | belge 375px / görünüm 375px, **yatay taşma 0px**, **sağ taşan öğe 0** |
| İl seçici | 81 görünür link |

**Kareler:** `kapi-1440-tam.png` · `kapi-375-tam.png` · `kapi-1440-il-secici.png`

**İl seçici "açık hal" şerhi:** brief katlanır bir seçici varsayıyordu. Mevcut
il listesi deseni (`/kuyu-ruhsati/` indeksi) katlanır DEĞİL — her zaman açık
ızgara. Desen birebir izlendiği için sayfada da katlanma yok; ölçümle
doğrulandı (`katlanirMi: false`). "Açık hal" = varsayılan hal.

**İl ızgarası tabanla özdeş (kopya disiplini kanıtı):**

| Kırılım | Yeni kapı | `/kuyu-ruhsati/` tabanı |
|---|---|---|
| 1440 | 3 kolon · 672px · 1352px · 81 link | 3 kolon · 672px · 1352px · 81 link |
| 375 | 1 kolon · 335px · 4069px · 81 link | 1 kolon · 335px · 4069px · 81 link |

**Zemine gözle bakıldı.** Her iki tam sayfa karesi açılıp incelendi: krem-mavi
zemin (`--krem` ailesi) ve lacivert şerit site geneliyle aynı; öz-cevap
kutusunun sol mavi çizgisi, katman kartlarının üst `--su-700` kuralı ve mono
ölçüm/künye satırları mevcut içerik sayfası diliyle tutarlı; dürüstlük etiketi
il bloklarındakiyle aynı çerçeve. Yeni renk/font/desen icat edilmedi.
GPU KURALI: bu sunucuda yazılımsal GL var — kareler yerleşim/taşma/varlık
kanıtıdır, **görsel kalite kanıtı değildir**; nihai yargı canlı testinizde.

### 3.2 Taban-gerileme denetimi (`arac/gerileme-denetim.mjs`, yerel ↔ canlı)

| Ölçü | Sonuç |
|---|---|
| sitemap | canlı 172 · yerel **173** · **KAYIP 0** · yeni 1 (`/nerede-su-cikar/`) |
| llms.txt | canlı 173 benzersiz URL · yerel **174** · gerileme yok |
| Ortak sayfa | 172 |
| **GERİLEME** | **0** |
| Artış | 172 sayfa (her biri `icLink +1` — menü kaydı; `/` 21→22) |

Ölçülen boyutlar: h-sırası atlaması · soru başlığı · JSON-LD blok + @type
kümesi · title/canonical/öz-cevap/OG varlığı · iç link · llms · sitemap.

**Site geneli kırık link:** 175 sayfa, 176 benzersiz iç link, **kırık 0**.

**Konsol (değişen sayfalar):** `/` · `/nerede-su-cikar/` · `/hangi-kurum/` ·
`/kuyu-ruhsati/manisa/` → hepsinde **0**.

### 3.3 Süreklilik (CLAUDE.md SÜREKLİLİK İLKESİ)

`izleme/cekirdek-sayfalar.json`'a `/nerede-su-cikar/` eklendi (çekirdek set
8 → 9 sayfa), gerekçesiyle: sayfanın içeriğinin tamamı build-time sayımdır,
`veri/potansiyel/*.json` küçülürse rakamlar sessizce yanlışlanır; 81 il linki
de buradan üretildiği için il sayfası düşerse kapı kırık link verir.

Yeni kalıcı araç: `arac/kapi-denetim.mjs` (konsol · 375 taşma · iç link ·
WCAG AA kontrast · kareler; başarısızlıkta exit≠0).

---

## Ölçüm sırasında düzeltilen iki araç hatası

Bunlar sitede değil, **denetim araçlarında** çıktı; ikisi de yanlış alarmdı ve
düzeltilmeden rapora sayı yazılmadı.

1. **375 taşma sayacı sol-parkı taşma sanıyordu.** `.sv-damla` imleç damlası
   her sayfada `-108px`'e park edilmiş 6 öğedir ve yatay kaydırma yaratmaz.
   Taban ölçümü: `/hangi-kurum/` ve `/kuyu-ruhsati/manisa/` sayfalarında da
   aynı 6 sol-park var. Sayaç sağ taşma / sol park olarak ayrıldı; sağ taşma
   yeni sayfada 0, mevcut sayfalarda 148 ve 35 (tablo kaydırma kapları, üçünde
   de yatay kaydırma 0).
2. **Kırık link tarayıcısı `<script>` gövdesini sayıyordu.** `/arac/il-rejimi/`
   içindeki `` `href="/havzalar/${e.slug}/"` `` bir JS şablon değişmezidir,
   bağlantı değil. Ana depo dist'inde ve canlıda da aynen var; iki dist
   arasındaki tek href farkı `+ /nerede-su-cikar/`, silinen yok. Script/style
   gövdeleri çıkarıldı → kırık 0.

## Önceden var olan, bu işin dışındaki bulgular

- `site-saglik.mjs --test` **6/7** senaryo veriyor; senaryo (i) (CSP media-src
  kaldırılınca md4 🔴) kalıyor. **Ana depoda da 6/7** — 27.07'deki md4
  revizyonundan (zaman-döngüsü ölçümüne geçiş) kalma bayat senaryo, bu işin
  ürünü değil. Ayrı kalem.
- Port 5198'de başka bir oturumdan kalmış `node` sunucusu (pid 531001) farklı
  bir dist'i servis ediyor. Dokunulmadı; ölçümler 5197'de yapıldı.

## Karar bekleyen tek kalem (değiştirilmedi)

Mobilde il ızgarası **1 kolon / 4069px**. Bu tabanın davranışıdır
(`/kuyu-ruhsati/` indeksi birebir aynı) ve brief "mevcut il listesi deseninden"
dediği için değiştirilmedi. 81 il tek sütunda uzun bir kaydırma yapıyor;
mobilde 2 kolona düşürmek isterseniz ayrı, küçük bir iş — ama bu tabandan
sapma olur ve iki sayfa arasında desen ayrışır.

---

## Merge

**Yapılmadı.** Dal `kapi-2026-07-28`, üç commit:
`9ae099b` (Faz 1) · `3361c05` (Faz 2) · Faz 3 kanıt commit'i.
Merge = yayın; kararınızı bekliyor. Onay gelirse merge sonrası deploy teyidi
içerik imzasıyla ölçülür (gelmezse boş commit tetiği).
