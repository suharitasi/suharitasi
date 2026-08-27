# DESIGN.md — SU-DİLİ ANAYASASI (suharitasi.com)

Bu belge bağlayıcıdır; çelişen karar kaybeder. Sürüm 3.1 (2026-07-20 —
§17 Sayfa Mimarisi eklendi, Faz 0 teşhisine dayanır).
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
koyulaşır. **Yürürlükteki set: aday C — "açık su-mavisi zemin + koyu
lacivert metin + kehribar kritik" (22.07 kullanıcı kararı; kıyas turu
`cikti/denetim/faz8-palet/RAPOR.md`).** Derinlik=anlam eşlemesi aynen
korunur; değişen yalnız ailenin ton ekseni — adaçayı-petrolden okyanus
mavisine.

| Katman | Hex | Rol | Kullanım |
|---|---|---|---|
| **YÜZEY** | `#E9F0F4` | açık su-mavisi zemin | İş sayfası zemini, özet/giriş katmanı |
| **YÜZEY-kart** | `#DFE9F0` | bir kademe derin yüzey | Kart/künye zeminleri |
| **SIĞ** | `#2E7EA0` | sığ su | Dekoratif hairline, hover ışıması, su hattı. Metin olarak YALNIZ ≥1.5rem puntoda (3.96:1) |
| **DERİN** | `#0C5A7C` | okyanus mavisi | **VURGU SESİ:** kicker, vurgu kelimesi, bağlantı hover (YÜZEY üstünde 6.59:1 AA) |
| **DİP** | `#0A2740` | gece laciverti | Koyu dünya zemini (menü katmanı, deneyim sahneleri, derin veri blokları) |
| Mürekkep | `#132A3F` | koyu lacivert | Metin (12.75:1) |
| Soluk | `#48627A` | — türev | İkincil metin (kart zemininde 5.16:1 AA) |
| Köpük | `#DBEAF4` | su köpüğü | DİP üstünde metin (12.41:1) |
| Süreç ailesi | `#2C5570` | lacivert-çelik | Kart kimliği "süreç" (§8) |
| Işıma | `#57BAE0` | SIĞ'ın parlak türevi | Koyu dünyada ışıma/sparkline (DİP üstünde 6.90:1) |
| Plato kehribarı | `#C0883A` (hairline) / `#875518` (metin) | sıcak ikinci ses | Kritik-vurgu; metin daima koyu türev. Mavi zeminde ayrışsın diye metin türevi C'de koyulaştırıldı (`#7D5B24`→`#875518`, YÜZEY üstünde 5.46:1) |
| ~~Kehribar-koyu~~ `#6B4412` | EMEKLİ (23.07 v3) | kehribarın bir tık koyu türevi | **EMEKLİ — kullanımdan kalktı.** Gerekçesi "yalnız ana sayfa soru şeridi α.80 açık plaka hedef satırı"ydı; v3'te (soru hiyerarşisi) şerit opak DİP "soru güvertesi"ne dönüştü, hedef etiketi koyu zemin üstünde `--isima #57BAE0` (6.90:1) kullanır. Açık-plaka koyu-kehribar ihtiyacı kalmadı; öksüz değişken bırakılmadı (`index.astro`'dan silindi). Kritik-vurgu `#875518` DEĞİŞMEZ. Yeniden bir açık plaka doğarsa `#6B4412` geri gelebilir. |

**Neden C (22.07 kararı):** site ilk bakışta "su/mavi" kimliği alsın
istendi — Görünürlük kuralı gereği belirgin olan seçildi. C tüm metin/zemin
çiftlerinde en yüksek kontrast bandını verir ve kritik-vurgu kehribarı
soğuk mavi zeminde MEVCUT'takinden daha net ayrışır (sıcak-soğuk zıtlığı
artar). Bedeli kabul edildi: krem-kâğıt sıcaklığı ve "tonlar HEDEF
görselinden px-örneklemeli" gerekçesi terk edildi — palet artık görselden
değil su-kimliğinden türer; HEDEF rasterı (harita hero'su) palet-bağımsız
olduğu için değişmez. "Jenerik kurumsal mavi" riski bilinçli karşılandı:
zemin tonu (`#E9F0F4`) yaygın soğuk-slate `#F8FAFC` yerine ılık tutuldu ve
serif başlık + kehribar ikinci ses korundu (frontend-design uyarısı).

### Önceki palet — arşiv notu (geri-dönüş yolu)

22.07'ye kadar yürürlükte olan "Gün ışığı su sütunu" seti, tonları HEDEF
görselinden px-örneklemeliydi:
`krem #E9EBE7` · `adacayi-krem #E0E5DF` · `murekkep-900 #1C2B24` ·
`murekkep-500 #54655C` · `su-700 #175E56` · `su-400 #4F7B78` ·
`kehribar #B8863B` · `kehribar-metin #7D5B24` · `yesil-kara #3E5C44` ·
`deniz #0C332C` · `akuamarin #7FB5AE` · `kopuk #DFE3E2`.
Gerekçesi: dilin kaynağı sitenin yıldız karesinin kendisi olsun, krem-kâğıt
görselin gök ışığıyla aynı sıcaklık bandında kalsın. Bu set terk edildi
ama SİLİNMEDİ — geri dönülmek istenirse tek commit'lik yol açıktır
(bkz. FAZ 8 uygulama raporu, "geri dönüş" bölümü).

**Daha eski kıyas kaydı (korunur):**
- *Skala "Gece denizi" (eski site: `#04121F`→`#4FC3D0`):* Güçlü atmosfer
  ama gün ışığı yönüyle kavga ediyordu; ana palet olarak ELENDİ. Landing
  ve /harita/ adasında bilinçli istisna olarak yaşar (aşağıdaki bölüm).
- Akuamarin `#4FC3D0` hakkında: "sitenin altını" ataması bağlayıcı
  değildi, deneme sonucu kaybetti; koyu dünyada ışıma tonu SIĞ'ın parlak
  türevidir (C'de `#57BAE0`).
- Kehribar her iki sette de korundu — alışkanlık değil, sıcak ikinci sesin
  kritik-vurgu işlevi.

### Ada Paletleri İstisnası (bilinçli — palet denetiminden muaf)

**Güncellendi 27.08.2026 (denetim K33).** Tablo eski landing hero'nun
`:root`'unu listeliyordu; o palet artık orada yaşamıyor. Ölçüm: eski
değerler bugün **yalnız `src/pages/harita.astro`** içinde duruyor; ana
sayfa ise kendi **v0** ailesini kullanıyor (`src/styles/anasayfa-v2.css`).
İstisnanın adresi landing'den harita adasına kaydı.

Bu "adalar" SU-DİLİ aydınlık derinlik skalasının DIŞINDADIR ve bilinçli
tasarım kararıdır: giriş atmosferi/koreografisi taşırlar, iç sayfaların
aydınlık iş dilini değil. Palet uyum denetimlerinde İSTİSNA sayılırlar —
"palet-dışı hex" bulgusu değildir. Renkler değiştirilmez, belgelenir.

**Ada 1 — `/harita/`** (kaynak: `src/pages/harita.astro` `:root`,
27.08.2026 okuması):

| Değişken | Hex |
|---|---|
| `--deniz` | `#04121F` |
| `--kopuk` | `#A8DDE0` |
| `--akuamarin` | `#4FC3D0` |
| `--metin-soluk` | `#6C8A96` |

**Ada 2 — ana sayfa (v0 ailesi)** (kaynak: `src/styles/anasayfa-v2.css`
`:root`, 27.08.2026 okuması):

| Değişken | Hex / değer |
|---|---|
| `--v0-koyu` | `#08202f` |
| `--v0-dip` | `#061824` |
| `--v0-beyaz` | `#ffffff` |
| `--v2-muted-fg` | `#3C5266` (site paletiyle ortak — M15/KARARLAR §22) |
| `--v2-randevu-metin` | `#0a2438` |
| `--kopuk` | `#DBEAF4` (site paletiyle ortak — K30) |
| `--mavi-soluk` | `#93AFC4` (site paletiyle ortak — K34) |

**Artık istisna DEĞİL:** eski tablodaki `--yukselti`, `--akis-sonuk`,
`--akis-canli`, `--metin`, `--bakir` ve "en dip gölge" değerleri
depoda hiçbir yerde kullanılmıyor (27.08 ölçümü) — tablodan çıkarıldı.

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
`linear-gradient(105deg, #0C5A7C 0%, #2E7EA0 45%, #186789 60%, #0C5A7C 100%)`
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
| Derin okyanus | `#0C5A7C` / aynı | Canlı veri, araç, mevzuat |
| Sığ su | `#2E7EA0` / `#0C5A7C` | Havzalar |
| Lacivert-çelik | `#2C5570` / aynı | Süreç rehberleri |
| Plato kehribarı | `#C0883A` / `#875518` | Uyuşmazlık rehberleri |
| Mürekkep | `#132A3F` / aynı | Kurumsal (hakkında, yazar, künye) |

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

## 17. SAYFA MİMARİSİ — sunum reformu (2026-07-20)

Dayanak: Faz 0 teşhisi (rapor B1–B17, K1–K4; ekran kanıtları
cikti/denetim/faz0/). Kullanıcı tespiti: "bilgi yığını; kimse havzalara
tek tek tıklamaz." Sorun içerik değil SUNUM mimarisidir; içerik/veri/
SEO-GEO katmanları korunur. Bu bölüm şablon-düzeyi kuraldır: kalıp
düzelince ondan türeyen her sayfa düzelir.

### (a) 3-SANİYE KURALI
İlk ekran tek bakışta ana mesajı verir: büyük değer VEYA damıtılmış
cevap + eğilim + tek cümle. İlk ekranda kesintisiz metin ≤ 3 satır.
- *Gerekçe:* Teşhiste üç sayfanın üçünde de ilk ekran %100 metindi
  (B1, B7, B15); rehberde fold'a kadar ~15 satır kesintisiz metin
  ölçüldü. "Su verisi portalı" ilk bakışta metin sitesi gibi görünüyor
  (K1).
- Çifte özet yasağı: `ozet` + `ozCevap` art arda iki paragraf olarak
  RENDER EDİLMEZ (K3); göz hiyerarşisinde tek özet yaşar, diğeri
  meta/arka plan katmanına iner (DOM'dan silinmez — bkz. b).

### (b) KATMANLI SUNUM
Detay varsayılan KAPALIDIR (accordion/sekme/`<details>`); metin duvarı
yasaktır. Referans blokları (81-il tablosu, madde metinleri, künye
ayrıntısı) katmana iner.
- *Gerekçe:* Rehberde 5.000px'lik il tablosu sayfanın %44'ünü kaplayıp
  "Dikkat/Dayanak/Emsal" bölümlerini eziyordu (B9); kanun alıntıları
  gövdede açıktı (B12); sitede accordion kullanımı sıfırdı (K4).
  ui-ux-pro-max kuralı: uzun içerik kes + genişlet; her şeyi baştan
  yükleme.
- SEO/GEO DOKUNULMAZI: 280-cevap, JSON-LD, tüm metin içerik DOM'da
  eksiksiz kalır ve JS'siz erişilebilir olur (İş sınıfı sayfada çalışma
  anı JS ~0 — §10). Katman yalnız GÖZ hiyerarşisini yönetir, arama/AI
  botunun gördüğünü değil.

### (c) VERİ GÖRSEL KAHRAMAN
Sayı, eğilim ve grafik metinden önce gelir. Havza tipi sayfada ilk
ekran kahramanı VERİdir (büyük değer + eğilim oku + sparkline); sayı
paragraf içine gömülmez. Sparkline okunur boyutta çizilir — süs değil
enstrüman (§5 ölçüm estetiği aynen geçerli: künyesiz sayı yayınlanmaz).
- *Gerekçe:* Sakarya'da sitenin koz verileri 857–3.000px aralığına
  gömülüydü (B1, B5); vakada kahraman sayı (3.395,33 ha / 2056) paragraf
  içindeydi (B15).
- Eşik (ui-ux-pro-max chart DB): ≥4 veri noktası varsa çizgi/sparkline;
  <4 noktada stat kartı — 3 noktalık seriye grafik çizilmez.

### (d) KART DİLİ
Çoklu öğe (havza listesi, içindekiler, baraj satırları, olay adımları)
liste-yığını değil KART/GRID dilinde sunulur; §8 kart aileleri ve SU-DİLİ
paleti aynen. Gerçek sıralar (başvuru akışı, olay şeridi) görsel sıra
dilini hak eder: adım kartı / zaman şeridi — süs numarası değil, gerçek
kronoloji/prosedür olduğu için (frontend-design: "yapı bilgidir").
- *Gerekçe:* Sakarya'da kart dili var/yok salınıyordu (B4); baraj
  tablosu ham 6 satırdı (B6); MEYSU "olay akışı" zaman çizgisi değil
  çizgili listeydi (B14); rehberin "Başvuru akışı" süreci görsel adım
  dili taşımıyordu (B11).

### (e) MOBİL-ÖNCELİK
Her kalıp önce 375px'te tasarlanır, masaüstüne genişletilir (§12'yi
sertleştirir: "mobilde de iyi" değil, "mobilde DOĞAR"). İlk ekran bütçesi
375×812'de hesaplanır; üst menü ilk ekranın küçük bir şeridini aşamaz.
- *Gerekçe:* Mobil menü iki satıra kırılıp ilk ekranın ~%28'ini yiyordu
  (K2, B2); rehber 375px'te 22,9 ekran kesintisiz kaydırmaydı (B7).
  Trafiğin çoğu mobil olacak.

### (f) SU-DİLİ UYUMU
§1–16 aynen geçerlidir; bu bölüm onları TAMAMLAR, çelişmez. Çelişki
görünürse §1–16 kazanır ve çelişki rapor edilir. Görünürlük kuralı
(CLAUDE.md) burada da bağlayıcı: katmanlama efektleri ilk bakışta fark
edilir olmalı, görünmezleşene kadar kısılmaz.

---

## 18. MARKA SIFATI: **"EMİN"** (2026-07-29, kullanıcı kararı)

Sitenin tek marka sıfatı **"emin"**dir. Bu bölüm §1-17'yi TAMAMLAR,
çelişmez; çelişki görünürse §1-16 kazanır ve çelişki rapor edilir.

**Karar gerekçesi (kullanıcı):** ziyaretçi ceza/ruhsat derdiyle geliyor;
aradığı his **"doğru yere geldim"**. Reddedilenler: *"çarpıcı"* — malzeme
yetersiz, dikkat dağıtır · *"resmî"* — soğuk, müvekkil çekmez.
Kayıt: `KARARLAR.md` §18.

Sıfat iki yönlüdür: **ziyaretçi emin olur** ve **site emin konuşur**
(abartmaz, uydurmaz, bilmediğini söyler). İkincisi zaten uygulanıyor —
sayı bekçisi, künye zorunluluğu, "doğrulanmadı" etiketi, il eşlemesinin
durdurulması. Sıfat bunlara **görsel karşılık** verir.

### 18.1 TİPOGRAFİ SONUÇLARI

| Kural | Karar |
|---|---|
| Font ailesi | **DEĞİŞMEZ.** Cormorant + Manrope + IBM Plex Mono (§6) zaten kurumsal-emin dili taşıyor; kıyas kaydı §6'da duruyor. |
| **Rakamlar LINING figür** | **ZORUNLU.** `font-variant-numeric: lining-nums tabular-nums`. Cormorant'ın varsayılan rakamları eski-stil: 200px'te 3/5/7/9 taban çizgisinin 54px ALTINA sarkıyor, 6 → 132px (0/1: 79px) — ölçüm 28.07, canvas mürekkep taraması. "472" ekranda "47²" gibi okunuyordu. **Sarkık rakam "emin" değil, "el yazması" hissi verir.** Ayrıca yedek font Georgia lining kullanır; lining olmadan font yüklenene kadar rakamın BİÇİMİ değişir. |
| Sayı sunumu | Kanıt rakamları **tek bileşenden** çıkar: `src/components/CanliSayi.astro`. Yeni yerde elle rakam dizgisi kurulmaz. |
| Binlik ayraç | `Intl.NumberFormat('tr-TR')` — biçim tek yerde. |
| Başlık ağırlığı | w600'de kalır; daha kalın "bağırma", daha ince "kararsızlık" okunur. |
| **Belirsizlik dili** | Emin olmak *her şeyi bilmek* değil, **neyi bilmediğini söylemek**tir. "doğrulanmadı", "veri yok", "ölçülemedi" ifadeleri **küçültülmez, soluklaştırılmaz, dipnota itilmez** — iddianın yanında, aynı okunaklılıkta durur. |

### 18.2 RENK SONUÇLARI

| Kural | Karar |
|---|---|
| Palet | **DEĞİŞMEZ.** §2 derinlik skalası ve §11 tek-mod kararı korunur. |
| **Aydınlık bölüm kontrastı** | **HEDEF ≥ 7:1** (bugün 5,52 ölçüldü; koyu bölümler 8,67-18,04). AA'yı geçiyor ama **emin soluk konuşmaz.** Ayrıntı: `rapor/tasarim-kimligi.md` D2. Uygulama AYRI İŞ (SIRADAKILER). |
| Vurgu rengi | Altın/vurgu **iddiaya** eşlik eder, süse değil: bir renk vurgusu varsa orada ölçülmüş bir sayı ya da kaynak künyesi olmalı. |
| Uyarı/şerh renkleri | Şerh bloğu zeminden **ayrışır** ama alarm rengi taşımaz; emin bir kaynak şerhi utanç gibi saklamaz, telaş gibi de sunmaz. |

### 18.3 HAREKET SONUÇLARI

| Kural | Karar |
|---|---|
| **Hareket bir şeyi KANITLAMALI** | Dekoratif hareket eklenmez. Geçer örnek: sayım animasyonu (rakamın *sayıldığını* gösterir) · hero sahne akışı (sahanın kendisini gösterir). Geçmez örnek: giriş için parallax, dikkat çekmek için titreşim/parıltı. |
| Süre | §10 rejimi geçerli. Mikro-etkileşim 150-300 ms. **İstisna: anlatı taşıyan hareket** (sayım) 900 ms'e kadar çıkabilir — gerekçesi bileşende yazılır. |
| `prefers-reduced-motion` | §10 aynen: koreografi kapanır, **içerik asla gizli kalmaz**. Sayım animasyonunda son değer **anında** yazılıdır (sunucudan öyle gelir). |
| Sıçrama yasağı | Sayı/etiket değişirken düzen zıplamaz: `tabular-nums` zorunlu. Emin bir arayüz gözün altında kaymaz. |

### 18.4 BU BÖLÜMÜN DENETİMİ

- Lining figür kuralı `CanliSayi` bileşeninde uygulanmıştır; başka yerde
  büyük rakam dizgisi doğarsa **bileşene taşınır**, kural kopyalanmaz.
- Kontrast hedefi (≥7:1) bugün **karşılanmıyor**; md13 kontrast kalemi
  AA eşiğinde ölçmeye devam eder, 7:1 hedefi ayrı işin bitti-tanımıdır.
- Yeni bir görsel iş bu bölümle çelişiyorsa iş DURUR ve çelişki raporlanır.
