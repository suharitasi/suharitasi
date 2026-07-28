# VITRIN-RAPORU.md — görünmeyen varlık denetimi + teşhir

Brief: 2026-07-28 (`cikti/brief/2026-07-28-vitrin.md`, düzeltilmiş
`-duzeltilmis.md`) · Dal `vitrin-2026-07-28` · Kanıt: `cikti/denetim/vitrin/`.
**FAZ 1, 2, 4 uygulandı. FAZ 3 DURDURULDU — gerekçe ölçümle §FAZ 3'te.**

## 0. Brief ön kapısı

Denetçi ilk koşu **2 ENGEL** (T5 commit kuralı, T7 hukuk kapısı) + 1 UYARI
(T6 canlı koşul) → ekleme-yalnız düzeltmeyle ikinci koşu **TEMİZ**.

**Amaç özeti:** Amaç = veri/, arsiv/, data/ altındaki görünmeyen varlıkları
ölçmek ve doğru sayfalara yerleştirmek. Dokunulmazlar = v0 ana sayfa düzeni,
S1 mobil kazanımı, dürüstlük etiketleri, mevcut palet/tipografi. Bitti-tanımı
= gerileme 0 + kontrast AA + S1 korundu + kanıt kareleri. Kanıtlar = build,
gerileme-denetim, vitrin-denetim, kareler.

**Düşman geçişi:** D1 — "her rakam build'de sayılır" ile "hiçbir mevcut sayfaya
oturmayan setler" çelişmez, ikisi de uygulandı. D2 — geçilemeyecek test:
FAZ 3'ün "RG tarih+**sayı** künyesi" şartı; ölçüldü, veri bu alanı hiç
taşımıyor (0/23). D3 — brief "229 DSİ dosyası" diyordu, ölçüm **230**; ölçülen
esas alındı. D4 — FAZ 3'ün il ataması bağımsız kontrolle sınandı (aşağıda).

---

## FAZ 1 — görünmezlik envanteri (ölçüm)

Yöntem: her veri dosyası için `src/` altında import/referans taraması +
kayıt sayımı. "Görünür" = sitede bir URL'de basılıyor.

| Varlık | Sayım | Durum (bu iş ÖNCESİ) |
|---|---|---|
| `veri/potansiyel/yas-kutleleri.json` | 12 havza planı / 472 kütle | Görünür — il sayfaları, /nerede-su-cikar/ |
| `veri/potansiyel/kutle-il.json` | 472 kayıt (347 eşleşti) | Görünür — il sayfaları |
| `veri/potansiyel/isletme-sahalari*.json` | 419 kayıt (109+310), 1963-2017 | Görünür — il sayfaları |
| `veri/potansiyel/morfoloji.json` | 122 karo / 81 il | Görünür — il sayfaları |
| `veri/potansiyel/zenginlestirme.json` | 81 il (MTA 356 · akademik 1.979 · OSM 1.239+487) | Görünür — il sayfaları |
| `veri/potansiyel/mta-katalog.json` · `akademik-kunye.json` · `osm-su-noktalari.json` | ham setler | Dolaylı görünür (zenginleştirme üzerinden) |
| `data/canli/grace-havza.json` | 25 havza × 254 ay | Görünür — havza sayfaları |
| `data/canli/havza-yas.json` | 25 havza × 12 yıl | Görünür — havza sayfaları |
| `data/canli/baraj.json` | 17 havza, 12 günlük seri | Görünür — havza sayfaları |
| `data/kamu/su-birimleri.json` · `su-islemleri.json` · `hangi-kapi.json` | 155 kurum · 20 işlem | Görünür — /hangi-kurum/ |
| `data/lead/persona.json` | 42 persona | Görünür — /durumum/ |
| **`data/canli/grace-turkiye.json`** | **254 ay (2002-04 → 2026-03)** | **GÖRÜNMEZ** |
| **`data/arsiv/baraj/`** | **13 günlük dizin, 286 dosya** | **GÖRÜNMEZ** |
| **`kaynak/dsi-arsiv/`** | **230 dosya** | **GÖRÜNMEZ** |
| `veri/potansiyel/dsi-duyurular.json` | 2 kayıt | GÖRÜNMEZ |
| `veri/potansiyel/ilce-il-dizini.json` | iç dizin | GÖRÜNMEZ (iç araç) |
| `data/kamu/su-terim-havuzu.json` | 126 terim | GÖRÜNMEZ (iç sözlük) |
| `data/kamu/ct3-kuyruk.json` | iş kuyruğu | GÖRÜNMEZ (iç araç) |
| `data/lead/nace-ek2.json` | 31 faaliyet | Dolaylı görünür (persona üzerinden) |
| `arsiv/*` (7 dizin) | eski sayfa sürümleri | GÖRÜNMEZ (tarihçe — kasıtlı) |

---

## FAZ 2 — teşhir (uygulandı)

### `/arsiv/` — yeni sayfa (8 set)
Saf künye listesi: kaynak · kapsam · sayım · erişim. Editoryal metin yok.
"İndirme yok" durumu açıkça yazılı. Öz-cevap 229 karakter (sınır 280),
şablondan + sayımdan kuruldu. Şema: WebPage + ItemList(8) + BreadcrumbList.

### Ana sayfa kanıt bandı — 3 varlık
Seçim kriteri **ölçülebilir** (üçü birden): (a) başka kaynakta toplu
bulunmayan, (b) kayıt sayısı yüksek, (c) ticari omurgaya doğrudan bağlı.

| Sayı | Varlık | Neden seçildi |
|---|---|---|
| **472** | yeraltı suyu kütlesi | (a) 12 plan tek envanterde · (b) en yüksek · (c) potansiyel |
| **419** | Resmî Gazete kaydı | (a) toplu derleme yok · (b) 419 · (c) ruhsat/ceza |
| **155** | su kurumu | (a) matris yok · (b) 155 · (c) ruhsat muhatabı |

**Elenenler ve gerekçesi** (`src/data/vitrin.js` yorumunda kalıcı): akademik
künye 1.979 → (a) düşer (OpenAlex'te toplu) · MTA 356 → (a) düşer · GRACE
254 ay → (a) ve (c) düşer · morfoloji 81 il → (c) düşer.

**Konum ölçümle seçildi:** bant `MobilSorular`'dan SONRA, `Hizmetler`'den
ÖNCE. Hero ile soru listesi arasına girseydi S1 kazanımı bozulurdu.

### İl sayfasına yeni blok EKLENMEDİ — gerekçe
Brief "en fazla 1 yeni blok" izni veriyordu. Ölçüm: il ölçekli varlıkların
tamamı `IlPotansiyel` bloğunda ZATEN basılıyor (kütleler, RG kayıtları,
morfoloji, MTA/akademik/OSM künyeleri). Eklenecek güvenli il-ölçekli görünmez
varlık FAZ 3'ün kapatma kayıtlarıydı; o durduruldu. İl sayfası değişmedi.

---

## FAZ 3 — DURDURULDU (tahsise kapalı saha teşhiri)

Brief: "419 RG kaydındaki 23 kapatma/kısıt kaydı ilgili il sayfalarında
gösterilir… her kayıt RG tarih+sayı künyesiyle."

**Ölçüm sonucu iki şart da karşılanmıyor:**

**(1) Künye şartı veriyle sağlanamıyor.** 23 kaydın **0'ında** `rg_sayi`
alanı var (23/23'ünde RG ilan URL'si var). Brief'in dayattığı "tarih+sayı"
künyesi üretilemez; uydurmak yasak.

**(2) İl ataması güvenilir değil — bağımsız kontrolle kanıtlandı.**
İlk kontrol (il adı pasajda geçiyor mu): 11 doğrudan, 7 ilçe üzerinden,
3 belirsiz, 2 dayanaksız. İlçe türetmeleri ayrıca bağlamıyla okundu ve
**klasik yanlış-eşleşme tuzakları çıktı:**

| İl | Eşleşen dizge | Gerçekte ne | Karar |
|---|---|---|---|
| Van | "A. **ÖZALP**" | Bakan imzası; ilan **Antalya** sahası | **SAHTE** |
| Samsun | "Gölü **Havza**ları" | Ortak isim "havza"; ilan **Ankara** sahası | **SAHTE** |
| Denizli | "**Çardak** Köyleri" | **Nevşehir**'e bağlı köy | **SAHTE** |
| Gümüşhane | "**Kürtün** Irmağı" | **Samsun** ilanındaki akarsu | **SAHTE** |
| Burdur | Krom madeni kararnamesi | RG **fihrist** sayfası, su ilanı değil | **SAHTE** |
| Kastamonu | "TAŞKÖPRÜ OVASI … İLANI" | İlanın konusu | doğru |
| Mersin | "Anamur - Bozyazı Ovası" | İlanın konusu | doğru |
| Giresun | "Ordu ve **Bulancak** sahil" | İlanın konusu | doğru |

30 il-kayıt eşleşmesinin **en az 7'si dayanaksız veya sahte (~%23)**.
Pasajlar iki sütunlu RG sayfalarının OCR'ı olduğu için satırlar komşu
sütundan sızıyor; bazı kayıtlar birden çok ilanın parçasını taşıyor.

**Karar:** yayımlanmadı. Bir avukat sitesinde "ilinizdeki saha tahsise
kapatılmış olabilir" ifadesi maddi karara yönlendirir; %23 hatalı atamayla
basmak CLAUDE.md "uydurma yasağı" ve "altyapıda hızlı, iddiada yavaş"
(Kuyu Çıkar Mı emsali) kurallarının ikisini de çiğner. Doğru sıra: veri
düzeltme (RG sayı alanı + il atamasının pasaj-içi doğrulaması) → keşif
raporu → [SERDAR-HUKUK] onayı → uygulama briefi.

**Not:** 23/23 kayıtta gerçek yasak/kısıt dili VAR — sınıflandırmanın kendisi
savunulabilir; sorun kaydın hangi İLE ait olduğudur.

---

## FAZ 4 — kanıt

| Kalem | Sonuç |
|---|---|
| Build | exit 0, 176 sayfa |
| **Taban gerilemesi** | **0** / 173 ortak sayfa |
| sitemap | 173 → **174**, KAYIP 0 |
| llms.txt | 174 → **175** benzersiz URL |
| Kontrast | ana sayfa bandı **14 düğüm**, /arsiv/ **81 düğüm** — ihlal **0**, en dar pay +0,66 (5,16:1) |
| Konsol | 0 (1440 ve 375, iki sayfa) |
| 375 yatay kaydırma | **0** |
| **S1 kazanımı** | **KORUNDU** — "Ruhsatsız kuyu cezası aldım" 716-765, kadraj 812 içinde |
| Kareler | `anasayfa-{1440,375}` · `arsiv-{1440,375}` (+tam) · `kanit-bandi-{1440,375}` |

**Zemine gözle bakıldı.** Kanıt bandı karesi açıldı: serif rakamlar
`--v2-primary`, mono etiketler, 1rem yarıçaplı kart + 2px üst vurgu çizgisi —
hizmet kartı ailesiyle aynı; zemin Hizmetler ile aynı token. Geometri
ölçümle doğrulandı: bandın `.v2-ic` (1152) / ızgara (1152) / başlık (672)
değerleri Hizmetler bölümüyle **birebir aynı** — yeni desen icat edilmedi.
GPU kuralı: kareler yerleşim kanıtıdır, görsel kalite yargısı değildir.

### Ölçüm sırasında düzeltilen iki ARAÇ hatası (site değil)

1. **oklch() körlüğü — sessiz atlama.** Kontrast ölçeri yalnız `rgb()`
   ayrıştırıyordu; v2 paleti `oklch()` olduğu için ana sayfada 14 metin
   düğümünün 13'ü sessizce atlanıyor ve "kontrast temiz" görüntüsü doğuyordu.
   CSS Color 4 dönüşümü eklendi + **çözülemeyen renk sayacı** (artık sessizce
   atlamak yerine build'i düşürüyor).
2. **"Sağ taşan öğe" yanlış alarmı.** Ana sayfada 12 öğe kadrajı sağdan
   taşıyor; ölçüldü: **main tabanında da 12** (hero poster `scale(1.04)` +
   video `scale(1.02)`, `.v2-hero{overflow:hidden}` ile kırpılır, yatay
   kaydırma 0). Eşik yatay kaydırmaya çevrildi.

**Gerçek bulgu (site) düzeltildi:** kanıt bandındaki "veri arşivi" linkine
renk verilmemişti → tarayıcı varsayılanı `rgb(0,0,238)`, aydınlık zeminde
**1,92:1**. `--v2-primary` ile **5,45:1**.

---

## Kalan görünmezler ve gerekçeleri

| Varlık | Neden görünmez kalıyor |
|---|---|
| RG "tahsise kapatma/kısıt" 23 kaydı | İl ataması ~%23 hatalı (§FAZ 3). Veri düzeltmesi + hukuk onayı ister |
| `dsi-duyurular.json` (2 kayıt) | OCR gürültüsü; içerik değeri yok |
| `ilce-il-dizini.json`, `ct3-kuyruk.json` | İç türetme/iş kuyruğu araçları |
| `su-terim-havuzu.json` (126 terim) | İç sözlük; sözlük sayfası ayrı iş |
| `arsiv/*` (7 dizin) | Eski sayfa sürümleri — tarihçe, kasıtlı |
| Ham veri indirme (CSV/JSON) | PAZARLAMA-KAZI K3 kararı bekliyor (hendek gerilimi) |
