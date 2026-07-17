# DESIGN.md — SU-DİLİ ANAYASASI (suharitasi.com)

Bu belge bağlayıcıdır; çelişen karar kaybeder. Sürüm 3.0 (2026-07-16).
Kaynak soru: **"Su nedir ve suyun sitesi nasıl görünür?"** Su yalnız renk
değil davranıştır; bu belge o davranışı sisteme çevirir. Sitenin en
görkemli karesi HEDEF görselidir (referans/HEDEF.png) — dil onu taklit
etmez, ona hizmet eder.

Hukuk bürosu tasarım belgesinden yalnız ZANAAT METODOLOJİSİ alınmıştır
(kararlaştırılmışlık, kicker mantığı, başarısızlık listeleri); renk/font
DNA'sı alınmamıştır.

## 1. Ruh

İtkan — kusursuz işçilik, cesur sahne; hedef ödül-üstü. Sadelik amaç
değildir; yasak olan kalabalık değil özensizliktir. **Sükûnet ilkesi:**
site bağırmaz — cömert boşluk, yoğunluk yerine derinlik. Bölüm arası
düşey boşluk ≥ 4rem; ölçü ≤ 68ch; bir ekranda birden fazla "yıldız" öğe
olmaz.

## 2. DERİNLİK SKALASI — renk = anlam

Su sütunu yukarıdan aşağı: içerik yüzeyde açık başlar, derinleştikçe
koyulaşır. Tüm tonlar HEDEF görselinden örneklenmiştir (px koordinatlı
denetim 2026-07-16).

| Katman | Hex | Görseldeki kaynağı | Kullanım |
|---|---|---|---|
| **YÜZEY** | `#E9EBE7` | gümüş gök `#CDCED2` → kâğıda yükseltildi | İş sayfası zemini, özet/giriş katmanı |
| **YÜZEY-kart** | `#E0E5DF` | gök + adaçayı karışımı | Kart/künye zeminleri |
| **SIĞ** | `#4F7B78` | sığ deniz `#517270` | Dekoratif hairline, hover ışıması, su hattı. Metin olarak YALNIZ ≥1.5rem puntoda (3.94:1) |
| **DERİN** | `#175E56` | derin deniz `#0C362D`/`#2D4E4B` rafinesi | **VURGU SESİ:** kicker, vurgu kelimesi, bağlantı hover (YÜZEY üstünde 6.31:1 AA) |
| **DİP** | `#0C332C` | deniz dibi `#0C362D` | Koyu dünya zemini (menü katmanı, deneyim sahneleri, derin veri blokları) |
| Mürekkep | `#1C2B24` | koyu kara `#16301F` | Metin (12.3:1) |
| Soluk | `#5A6B62` | — türev | İkincil metin |
| Köpük | `#DFE3E2` | su kavisleri/köpük | DİP üstünde metin (10.6:1) |
| Plato kehribarı | `#B8863B` (hairline) / `#7D5B24` (metin) | plato altını `#F4D585`→`#AD945F` | Sıcak ikinci ses; metin daima koyu türev |

**Kıyas kaydı (zorunluydu, yapıldı):**
- *Skala A — "Gün ışığı su sütunu" (yukarıdaki):* HEDEF'in kendi suyu;
  gök gümüşü → petrol dip. **SEÇİLDİ.** Gerekçe: (1) dilin kaynağı
  sitenin yıldız karesinin kendisi olur, iki-dünya istisnası ("harita
  adası") ortadan kalkar — tek aile; (2) derinlik=anlam eşlemesi görselde
  fiziksel olarak var; (3) sıcak plato altını doğal ikinci ses verir.
- *Skala B — "Gece denizi" (eski site: `#04121F`→`#4FC3D0`):* Güçlü
  atmosfer ama HEDEF'in gün ışığıyla kavga eder (mevcut sitede /harita/
  "istisna adası" ilan etmek zorunda kalmıştık — istisna, dil hatasının
  itirafıdır). ELENDİ.
- Akuamarin `#4FC3D0` hakkında: önceki brief'in "sitenin altını" ataması
  bağlayıcı değildi; deneme sonucu KAYBETTİ — görselin suyu petroldür,
  parlak akuamarin bu ailede elektrik kaçağı gibi durur. Koyu dünyada
  ışıma tonu olarak SIĞ'ın parlak türevi `#7FB5AE` kullanılır.
- Eski paletten korunanlar (gerekçeli): krem-kâğıt ailesi (görselin gök
  ışığıyla aynı sıcaklık bandı — YÜZEY tonu zaten oraya evrildi) ve
  kehribar (artık kaynağı görselin platosu; alışkanlık değil örnekleme).

## 3. AKIŞ — suyun ivmesi (easing sözlüğü)

Su aniden durmaz, aniden fırlamaz. Dört adlandırılmış eğri; HER geçiş
bunlardan birini kullanır, başkası yasak:

| Ad | Değer | Davranış | Kullanım |
|---|---|---|---|
| `--e-suzul` | `cubic-bezier(0.22, 1, 0.36, 1)` | uzun süzülme, yumuşak durma | hover kalkışı, reveal, panel açılışı |
| `--e-kabar` | `cubic-bezier(0.35, 0, 0.15, 1)` | yavaş ivmelenen kabarma | giriş koreografisi, sahne kuruluşu |
| `--e-akinti` | `cubic-bezier(0.45, 0.05, 0.55, 0.95)` | sabit akış | renk/opaklık geçişleri |
| `--e-cekil` | `cubic-bezier(0.55, 0, 0.85, 0.5)` | hızlanarak çekilme | kapanış/çıkış animasyonları |

Süre ölçeği: 120ms mikro · 240ms standart · 420ms panel · 700ms+ yalnız
deneyim sınıfı.

## 4. IŞIK KIRILMASI — vurgu dili

Başlık vurgu kelimesi düz boya DEĞİL, su yüzeyinden kırılan ışık:
italik + tanımlı kırılma gradyanı —
`linear-gradient(105deg, #175E56 0%, #4F7B78 45%, #2E6B62 60%, #175E56 100%)`
`background-clip: text` ile; iş sayfalarında STATİK, deneyim sayfalarında
hafif kayma (8s `--e-akinti` döngü) serbest. Her ana başlıkta EN FAZLA
bir vurgu kelimesi; kelime anlam taşır, rastgele seçilmez.
Ayraçlar "su çizgisi"dir: 1px, uçları eriyen degrade (SIĞ tonu).

## 5. ÖLÇÜM ESTETİĞİ — hidrolojik enstrüman

Veri sunumu bir su seviyesi göstergesinin zarafetini taşır:
- Rakam: mono (`tabular-nums`) veya Cormorant 500 — bantta tek seçim.
- Etiket: mono uppercase; her bandın altında kaynak+tarih künyesi
  (mono 0.66rem) — künyesiz sayı bandı YAYINLANMAZ.
- **Kot cetveli motifi:** bandın sol kenarında ince ölçek çizgileri
  (2px/6px tick ritmi, SIĞ tonu %40) — enstrüman imzası.
- Sayaç animasyonu yalnız ilk görünümde, 700ms `--e-suzul`, yalnız gerçek
  veriyle; reduced-motion'da anında. İş sayfasında statik de olabilir.
- Metafor sunumda kalır; VERİ GERÇEK — uydurma yasağı aynen (boş alan
  "veri yok (tarih)").

## 6. TİPOGRAFİ — üç katman

| Katman | Font | Görev |
|---|---|---|
| Display | **Cormorant** 400–500 + italik | başlık, vurgu kelimesi |
| Gövde | **Manrope** 400–600 | paragraf, arayüz; satır 1.75 |
| Etiket | **IBM Plex Mono** 400–500 | kicker, künye, veri etiketi, kot |

**Kıyas kaydı (zorunluydu, yapıldı):**
- *İkili 1 — Cormorant + Manrope:* **SEÇİLDİ.** Cormorant hakkak/atlas
  geleneğinin seslisi; italiği vurgu-kelime sistemi için olağanüstü;
  HEDEF'in klasik kabartma-harita ruhuyla örtüşür. Manrope'un geometrik
  sıcaklığı gümüş-yeşil yüzeyde yumuşak okunur.
- *İkili 2 — Fraunces + Inter:* Fraunces gün ışığı sıcaklığına uyar ama
  "dergi kapağı" kokar; enstrüman zarafetini (ölçüm esteti) bozar. Inter
  nötrlüğü Manrope karakterine karşı kayıptır. ELENDİ.
- Mono: IBM Plex Mono (latin-ext tam, cetvel karakteri); JetBrains Mono
  "kod editörü" kokusundan elendi. Mono asla gövde metni olmaz.
- Cormorant'ta `₺` glifi YOKTUR (bozuk render kanıtlı) — para/özel
  simgeler mono katmanında yazılır.

## 7. KICKER SİSTEMİ (zanaat metodolojisi)

```
[hairline 1.6rem SIĞ] [KICKER — mono uppercase .22em DERİN]
[kicker-sub — mono 0.68rem soluk]  (opsiyonel)
[Başlık — Cormorant; tek kırılma-vurgulu kelime]
```
Kicker metni içerikten türer (tür/bölüm/numara); süs metni uydurulmaz.
Bölüm numarası CSS sayaçla ("BÖLÜM 01") türetilebilir.

## 8. KART KİMLİKLERİ — beş aile (tümü görselden)

Aydınlık dünyada DÜZ ton + tür-renkli detay (üst hairline 2px + kicker
+ hover'da %6-8 tür-tonlu zemin). Gradyan kart yok — kâğıt düzlüğü;
gradyan yalnız koyu dünya zeminlerinde.

| Aile | Hairline / metin | İçerik türü |
|---|---|---|
| Derin petrol | `#175E56` / aynı | Canlı veri, araç, mevzuat |
| Sığ turkuaz | `#4F7B78` / `#175E56` | Havzalar |
| Yeşil kara | `#3E5C44` / aynı | Süreç rehberleri |
| Plato kehribarı | `#B8863B` / `#7D5B24` | Uyuşmazlık rehberleri |
| Mürekkep | `#1C2B24` / aynı | Kurumsal (hakkında, yazar, künye) |

## 9. KARARLAŞTIRILMIŞLIK — durum sözlüğü

- Link hover: renk → DERİN, 120ms `--e-akinti`; gövdede alt çizgi 1→2px.
- Kart hover: `translateY(-2px)` 240ms `--e-suzul` + tür-tonlu zemin +
  hairline parlar. Gölge yok.
- Press: `translateY(0) scale(0.985)` 120ms.
- `:focus-visible`: 2px DERİN çerçeve, offset 3px; koyu dünyada köpük.
  `outline: none` asla.
- Form odağı: kenar DERİN + `0 0 0 3px` DERİN %18 glow.
- Menü linki hover: belirme + harf aralığı açılması (.22em→.3em)
  240ms `--e-suzul` — suya ait tek zarif tepki.

## 10. İKİ HIZ SINIFI + ANİMASYON REJİMİ

| Sınıf | Sayfalar | Rejim |
|---|---|---|
| Deneyim | `/`, `/harita/`, `/harita-stil/`, tam ekran menü | Büyüleyici ama akıcı; Lighthouse hedefsiz; takılma = başarısızlık |
| İş | diğer her sayfa | Az ve anlamlı; çalışma anı JS ~0 (araç istisnası); Lighthouse ≥ 90 |

`prefers-reduced-motion`: koreografi kapanır, İÇERİK ASLA GİZLİ KALMAZ.
WebGL canlı sahne RAFTA (SIRADAKILER) — kullanıcı isterse döner.

## 11. RENK MODU KARARI (bilinçli)

**TEK MOD.** Gerekçe: derinlik skalasında koyu/açık zaten ANLAMDIR
(yüzey=özet, dip=derin veri); ikinci bir "dark mode" bu anlamı temaya
çevirip skalayı bozar. `prefers-color-scheme` dinlenmez; iki dünya tek
tasarlanmış sudur. Bu karar ancak anayasa değişikliğiyle bozulur.

## 12. MOBİL — BİRİNCİ SINIF

- Her çıktı (pilot sayfalar dahil) masaüstü + mobil viewport'ta üretilir
  ve raporlanır. "Desktop şahane, mobil ezik" = başarısızlık.
- Dokunma hedefi ≥ 44×44px; menü linkleri mobilde dikey ve seyrek.
- Derinlik skalası küçük ekranda test edilir (küçük puntoda SIĞ metin
  yasağı mobilde de geçerli).
- HEDEF sahnelemesinde dar/dikey ekranda Türkiye MERKEZDE kalır
  (`object-position`); Türkiye'nin kesilmesi başarısızlıktır.

## 13. HEDEF SAHNELEME STANDARDI

HEDEF.png yeniden üretilmez, üzerine canlı sahne denenmez; olduğu gibi
kusursuz sahnelenir:
- Retina: 1x (1472w) + 2x (2944w orijinal). Upscale YASAK.
- Format: AVIF + WebP + JPEG fallback; boyut/kalite raporlanır.
- Art direction: genişte tam kadraj; darda Türkiye merkezde.
- Yükleme: gömülü LQIP blur-up; beyaz/boş ekran anı ASLA.
- Üzerine binen tipografi görselin KENDİ paletinden örneklenir (hex +
  kontrast raporlu); kutu/bar yasak, gerekirse görsel-tonlu ≤%12 scrim.
- **Menü yerleşimi (KULLANICI KARARI 2026-07-16): VARYANT A** — sol üst,
  dikey dizilim, koyu petrol `#12312B`. Dar-oran davranışı A'nın KENDİ
  zarafetidir (B'ye düşülmez): kolon gök bandında kalır (üst sınır
  ~56vh); viewport oranı 4:3'ten darsa kolon alt-sol DENİZE iner ve
  metin bölge zeminine göre köpüğe (`#E8ECEA`) döner; her iki halde
  görselin kendi tonundan ≤%12 yumuşak scrim eşlik eder.

## 14. İÇ SAYFA GÖRSEL AİLESİ (HEDEF ailesinden)

Yer/format tanımları — görseller kullanıcı tarafından üretilecek
(Midjourney), sahneleme işçiliği (retina + AVIF + blur-up) aynen:
- **Rehber hero bandı:** 2400×800 kırpım; sayfa üstünde 180-240px bant;
  üzerine kicker+başlık biner (scrim kuralı geçerli).
- **Havza kart zemini:** 1200×675; kart hover'da %8 tür tonu ALTINDA
  durur, metni boğmaz (metin zemini daima düz katman).
- **Bölüm ayracı vinyeti:** 1600×400, çok soluk (%20 opaklık) su motifi.
Gerekli görseller listesi ve prompt önerileri rapor edilir; görsel
gelmeden bu alanlar DÜZ derinlik tonlarıyla yaşar (placeholder görsel
kullanılmaz).

## 15. BAŞARISIZLIK KRİTERLERİ — "varsa geri git"

Genel: (1) kart donuk/default; (2) font düşmüş halde kanıt
(`document.fonts.ready` beklenmemiş); (3) devam yolu görünmüyor;
(4) menü takılıyor; (5) bölüm/tablo görünmez (reveal/print);
(6) kicker'sız önemli bölüm ya da vurgusuz KURGULANMIŞ ana başlık (özel ad/varlık başlıkları — "Sakarya Havzası" gibi — vurgu zorunluluğu dışındadır); (7) YÜZEY
üstünde SIĞ küçük-punto metin (kontrast); (8) sözlük dışı easing/süre;
(9) iş sayfası Lighthouse < 90; (10) emoji/damla ikonu/royal-blue/keskin
tepe; (11) künyesiz veya uydurma sayı; (12) mobilde ezik çıktı.

`/harita-stil/` özel: menü "yapıştırılmış" duruyor · görsel yaygın
ekranda pikselleşiyor · mobilde Türkiye kadraj dışı · yüklenirken boş
ekran anı · menü okunmuyor VEYA görsele hükmediyor.

## 16. KIRMIZI ÇİZGİLER

Su damlası ikonu yok. Emoji yok. Royal-blue yok. Keskin tepeli kontur
klişesi yok. Kehribar/SIĞ küçük puntoda metin olamaz. Arayüz dili
Türkçe. Veri dürüstlüğü ve kopyalanma direnci (CLAUDE.md) her yüzeyde.
