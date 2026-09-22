# Denetim kapsamı — boşlukların kapatılması (28.07.2026)

Brief: `cikti/brief/2026-07-28-kapsam.md` (denetçi: 2 ENGEL → ekleme ile TEMİZ).
Kaynak: `rapor/denetim-kapsami.md` (5671ea3). Tüm kalemler SALT-ÖLÇÜM;
otomatik onarım yok. Kalem sayısı **14 → 21**.

## Kalem başına taban / eşik / falsifikasyon

| M | Kalem | Taban (ölçüldü) | Eşik + gerekçe | Falsifikasyon |
|---|---|---|---|---|
| M1 | md15 erişilebilirlik | 10 sayfa × 2 kırılım = **100/100, ihlal 0, varyans 0** | <100 SARI, <90 KIRMIZI. Varyans 0 olduğu için medyan GEREKMEZ | alt+aria silindi → **90, `button-name`+`image-alt`** yakalandı ✓ |
| M2 | md16 SEO/GEO geniş | 174 sayfa (3 noindex dışlandı), **199 bulgu**, kritik 1 | Yeni kritik → KIRMIZI; toplam artışı → SARI | taban 0 → 198 artış SARI ✓ |
| M3 | md17 dış bağlantı | **1.039 benzersiz** dış link (`<a href>` only) | %5 örneklem (52/hafta) — toplamdan türetildi; 404/410 KIRMIZI, 5xx/timeout SARI | sahte 404 URL → KIRMIZI; sağlam URL → sessiz ✓ |
| M4 | md18 veri bütünlüğü | `veri/potansiyel` **11 dosya** (472 kütle, 419 RG, 948 ilçe…) | Kayıt DÜŞÜŞÜ KIRMIZI, şema değişimi SARI, artış sessiz | taban 9999 → "DÜŞTÜ" KIRMIZI ✓; şema → SARI ✓ |
| M5 | md19 başlık+OG+CTA | 6 başlık + 4 CSP direktifi + 1 og:image + **17 mailto** | Eksik başlık/direktif/kırık og/mailto kaybı → KIRMIZI | başlık silindi ✓ · media-src silindi ✓ · mailto silindi ✓ · sağlıklı → sessiz ✓ · **canlı yanlış-pozitif düzeltildi (aşağıda)** |
| M6 | md20 nöbetçi | 4 nöbetçi; tolerans **kaynağın yayın takvimine** göre (su-izleme 72h, baraj 48h, RG 336h, NHYP 840h) | Aşım SARI, iki katı KIRMIZI; dosya yok → SARI | tolerans 0.001h → KIRMIZI ✓; olmayan dosya → SARI ✓ |
| M7 | md20 npm audit | **1 düşük + 3 yüksek** (sharp/libvips) | Taban absorbe; yalnız YENİ açıkta ateşler | taban 0 → "YENİ yüksek 0→3" KIRMIZI ✓ |
| M8 | md21 dokunma | 6 sayfa, **201 ihlal** (bağımsız denetimler) | Artışta SARI (regresyon dedektörü) | taban 0 → artış SARI ✓ |
| M9 | md20 404 | `public/404.html` **VAR ve markalı** ("Bu derinlikte bir şey yok.") | Özel sayfa yok → SARI; 404 dönmüyor → KIRMIZI | üç senaryo da beklendiği gibi ✓ |
| M10 | md20 yedek | dsi-arsiv **55 MB** + data/arsiv **23 MB** — depo dışı yedek **YOK** | Yedeksiz varlık → SARI (kırmızı değil) | sahte yedek → sessiz; yoksa → SARI ✓ |

**Falsifikasyon toplamı: 19/19 senaryo beklendiği gibi.** (M10'un ilk turu
düştü — sebep kalem değil TESTİMDİ: aday dizine basename yerine kök verdim;
düzeltilmiş testle geçti. "Testi geçmeyen kalem yayına girmez" kuralının izi.)

## Bilinçli değişiklikler (bit-eşit istisnaları)

**M2 — md7'ye DOKUNULMADI.** md16 tüm dist'i tarar ama md7'nin dört
alt-kontrolünü (canonical/öz-cevap/JSON-LD/title-yok) ATLAR — çift alarm
yasak. Kanıt: md7 çıktısı önce/sonra birebir aynı (`9/10 sayfada öz-cevap +
JSON-LD + title + canonical tam · muaf: /(ozCevap)`).

**M11 — md9 medyan: UYARLAMALI.** Ölçülen LH performans yayılımı
`/hangi-kurum/` mobilde **11 puan** (88→99), `/harita/` mobilde 5 → tek atış
yanlış alarm üretir, kör 3-tur md9'u üçe katlardı. Uygulanan: ilk atış eşiği
**12 puan** (gözlenen en büyük yayılım + pay) aşıyorsa tek atış yeterli;
aksi halde 2 atış daha + medyan. Aynı doğruluk, çok daha düşük maliyet.
Ayrıca a11y **aynı LH çağrısına** eklendi (ayrı koşum 145 sn sürerdi).
Önce/sonra: md9 mesaj biçimi aynı, `a11y` alanı ve `*Turlar` eklendi.

**M12 — md14 rehber örneklemi.** `/rehberler/su-tahsisi-oncelik-sirasi/`
eklendi (örneklem 10→11 sayfa, 20→22 ölçüm). Gerekçe: G4 ritmi rehber
grubunda sayfadan sayfaya değişiyordu (28.07 varyans ölçümü), tek örnek
yetersizdi.

## Kaynak kapısı (ölçüldü)
`--hizli` **49 → 69 sn (+%41)**, %50 kapısının altında → md19 ve md21
`--hizli`'da kalır. md16/17/18/20 yalnız `--tam`. `--tam` 561 sn.

## İlk gerçek koşumun bulduğu (kalemler işe yaradı)
- **md17: 3 gerçek ölü dış bağlantı** — `dergipark.gov.tr` (alan adı
  `dergipark.org.tr`'ye taşındı), `trdizin.gov.tr`, `doi.org/10.17341/
  gummfd.60377`. Künyeye dayalı otorite iddiasının altındaki boşluk.
- **md19: yanlış pozitif** (aşağıda) — kalem ilk gerçek koşumda kendini
  ele verdi ve düzeltildi.
- **md20: yedek yok** — `kaynak/dsi-arsiv` 55 MB + `data/arsiv` **529 MB**
  (worktree'deki 23 MB ölçümü eksikti; canlı depoda 529 MB) geri
  getirilemez veri, depo dışı kopya yok. Ayrıca rg + nhyp nöbetçileri
  hiç koşmamış (state dosyası yok).
- **Ölçüm sırasında iki yanlış pozitif düzeltildi:** `fonts.gstatic.com`
  preconnect'i "ölü link" sanılıyordu (artık yalnız `<a href>` sayılıyor);
  yerel sunucunun 404.html'i sunmaması "sayfa yok" sanılıyordu (artık
  depoda dosya varsa ayrımı açıkça yazıyor).

## İlk gerçek koşum md19'da YANLIŞ POZİTİF buldu — düzeltildi

`--tam` canlıda **md19 KIRMIZI: "hiçbir sayfada mailto CTA bulunamadı"**.
Sebep: kalem yerel `dist` üzerinde geliştirildi, orada 17 `mailto:` var;
**canlıda `mailto:` diye bir şey yok** — Cloudflare e-posta gizlemesi hepsini
`/cdn-cgi/l/email-protection#HEX`'e çeviriyor. Yani kalem gerçek bir olguyu
değil, yerel ortamın bir tesadüfünü ölçüyordu.

Düzeltme vekil değil: gizli biçim **çözülüyor** (`cfEpostaCoz` — ilk bayt
anahtar, kalan baytlar XOR) ve adres aynı biçim testinden geçiyor.
- Çözücü doğrulaması: `b4d6dd…` → `iletisim@suharitasi.com` ✓
- Canlı, düzeltme sonrası: **mailto 17, kırmızı 0** ✓
- Falsifikasyon (her iki biçim de silinmiş sayfa): **ateşledi** ✓

Ders: bir kalem yerel `dist`'te doğrulanmışsa **canlı katman (CDN yeniden
yazması) ayrıca doğrulanmalıdır**. CANLI KOŞUL İLKESİ'nin bu iş sırasında
kanıtlanmış uzantısı.

## Kapsam dışı → SIRADAKILER
KVKK/aydınlatma metni ([SERDAR-HUKUK]) · npm açıklarının giderilmesi ·
404 sayfası üretimi (zaten var, iyileştirme ayrı) · yedek stratejisi ·
keşif botu izlemesi (/root — okunamıyor, doğrulanmadı).
