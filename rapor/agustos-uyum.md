# 4 AĞUSTOS DALGASININ KURALLARA UYDURULMASI — 2026-08-24

Brief: kullanıcı (M1-M7 + KAPI) · uygulama planı `cikti/brief/20260824-210958Z-agustos-uyum*.md`
(denetçi: 2 tur → ENGEL 0, 3 UYARI — tümü URL-kalıbı yanlış pozitifi, ekte cevaplı)
· Worktree `suharitasi-agustos`, dal `agustos-uyum` · Kaynak bulgular
`rapor/site-durum-kazi.md` (fe1fba3). KULLANICI KARARLARI: göl/nehir KALIR ·
satış sayfaları KALDIRILIR (PayTR mağazası kapandı) · bozukluklar düzeltilir.
**Model şerhi:** brief başlığı Opus 5; oturum modeli Fable 5 ve oturum içinden
model değiştirilemez — KARARLAR §14 iş bölüşümünden sapma bu gerekçeyle kayıtlı
(brief'i yazan kullanıcı olduğundan yazan≠uygulayan bağımsızlığı korunmuştur).

## Düşman geçişi (uygulama sırasında yakalananlar)
- **Ölçüm kendi yamamı yanlışladı (md13):** kanıt bandını koyu zemin sanıp
  (eski aracın oklch körlüğünün ürettiği artefakt) beyaz metin geçersiz
  kılmaları yazmıştım; DÜZELTİLEN araç gerçek zemini açık ölçtü ve kendi
  beyaz-üstü-beyaz gerilememi kırmızıladı → geçersiz kılmalar geri alındı.
  Bu olay, aracın düzeltilmesinin neden ÖN KOŞUL olduğunun canlı kanıtıdır.
- dist-sun'ın varsayılan kökü ANA ağacın dist'i çıktı (sabit yol) — ilk
  ölçüm bayat içeriğe denk geldi; kök parametreyle (5199) tekrarlandı.
- Bozuk-Türkçe dedektörünün 4 kalıbı yanlış pozitifti ("arazi morfolojisi",
  "Analiz Et", "Nehirleri", "Nehir profili" — aksansızlıkları doğal);
  dedektör daraltıldı, sayım ondan sonra rapor edildi.

## M1 · Satış sayfaları KALDIRILDI [VERİ]
- **Envanter (ölçülen):** `/rapor-satin-al/` (3 paket 3.500/8.000/15.000 TL +
  PayTR iframe) · `/raporlar/` (25 PDF kartı + "5-25k TL bandı" CTA) ·
  `/rapor-indir/` (ödeme dönüş akışı) · `public/rapor/*.pdf` (25) ·
  `server/` (paytr/pdf/email backend — systemd'de YOK, çalışmıyordu) ·
  astro.config `json-api-uret`+`pdf-rapor-uret` kancaları · `arac/rapor-uret.py`
  · index.astro `.v2-cta-bant` · PaylasilanMenu `pm-cta`+`pm-mobil-cta`
  (78 sayfanın menüsünde) · ilce-sorgu `b2b-banner`+JS href güncellemesi ·
  havzalar/[slug] iki `rapor-cta` aside'ı (sabit "Ağustos 2026" metniyle).
- **Ölü altyapı kanıtı:** CSP'de paytr.com/api konağı YOK + `api.suharitasi.com`
  DNS kaydı YOK → ödeme akışı canlıda tarayıcı tarafından zaten engelliydi;
  kaldırılan şey çalışan bir mağaza değil, ölü kalıntıydı.
- **301'ler (31 kural, `public/_redirects`):** /rapor-satin-al(/)→/nerede-su-cikar/ ·
  /raporlar(/)→/havzalar/ · /rapor-indir(/)→/nerede-su-cikar/ · 25 PDF →
  ilgili /havzalar/<slug>/ (hedeflerin varlığı build'e karşı doğrulandı).
- **CTA ikamesi (1.4):** ilce-sorgu banner'ı → SonrakiAdim mailto deseniyle
  tek satır ("Bu konuda görüş alın", `bilgi@suharitasi.com`); fiyat/ödeme/yeni
  vaat/hukuki ifade YOK. Menü CTA'sı ikamesizdir (menüde "İletişim / Uzman
  Görüşü" zaten var).
- **Kanıt:** dist HTML'de `paytr` isabeti **0** · dist'te rapor* rotaları yok ·
  sitemap/llms'te yok · `_headers`'ta paytr konağı zaten yoktu (ölçüldü) ·
  kırık iç link 0. `.env` PAYTR_* satırları ana ağaçta merge sonrası silinir
  (worktree'de .env yok — kapanış adımı §KAPI).

## M2 · Mobil ilk ekran GERİ ALINDI [VERİ]
- **Kök neden (ölçülen):** 04.08 CTA bölümleri `.v2-ust-akis` mobil `order`
  listesinin DIŞINDAydı → order 0 ile kadrajın başına biniyordu. Canlı 375
  ölçümü: görsel sıra CTA-ikili(0) → CTA-bant(417) → hero(598) → ilk soru
  **1383px** (kadraj dışı; md14 G6 kırmızısının başlangıcı 04.08 koşusu).
- **Düzeltme:** S1 sıra kuralı korunarak `.v2-cta-ikili { order: 5 }` (mevcut
  order deseni; yeni yöntem yok). Satış bandı zaten M1'de kalktı.
- **Kanıt:** worktree 375: hero 0 → **ilk soru üst 785px** (kadraj içinde; S1
  bandı 736-785 kaydıyla uyumlu), CTA kartları 2107'ye indi. Kareler:
  `cikti/denetim/agustos-uyum/s1-{once-canli,sonra-worktree}-375*.png`.

## M3 · Kontrast [VERİ + falsifikasyon]
- **Araç düzeltmesi (ön koşul):** md13'ün renk ayrıştırıcısı yalnız rgb/rgba
  tanıyordu; oklch ZEMİN saydam sanılıp koyu gövdeye düşülüyor (16 ihlalin
  14'ü bu artefakt — Hizmetler/kanıt bandı gerçekte açık zeminde), oklch
  METİN rengi ise sessizce ölçülmüyordu. Canvas dönüşümü eklendi.
  **Falsifikasyon:** oklch renkli kasıtlı ihlal sayfasında ESKİ mantık 0 ihlal
  (boş kapı — görmedi), YENİ mantık 1 ihlal (1.48:1) — bozmayı gördü.
- **Gerçek ihlaller:** `.v2-cta-ikon` emoji span'ları (renk kuralı yok →
  varsayılan link mavisi rgb(0,0,238), koyu gövdede 1.92:1). **Ölçüm kararı
  (3.2):** ihlali üreten EMOJİ değil RENKti; ancak emoji BRIEF.md'nin
  bağlayıcı "emoji yasak" kuralını da ihlal ediyordu → span'lar kaldırıldı
  (mevcut CTA deseni: başlık+alt metin, ikonsuz). İki gerekçe de kayıtlı.
- **Kanıt:** düzeltilmiş araçla 9 örneklem sayfasında (yeni tipler dahil)
  **ihlal 0**; en dar oran ana sayfada 3.5:1 (gereken 3, büyük metin),
  aydınlık sayfalarda en dar 5.07-6.58 (≥4.5; ≥7 hedefi D2 kaleminin
  kapsamında — bu tur AA ihlallerini sıfırladı, D2 ayrı BÜYÜK İŞ olarak
  SIRADAKILER'de duruyor).

## M4 · Bozuk Türkçe [VERİ]
- Taban ölçümü (dist, kalıp dedektörü): **412 sayfa / 6.908 isabet**
  (Turkiye 2.053 · Golleri 1.116 · Nehirleri 524 · Veri kaynagi 410 …).
- Düzeltme ŞABLON kaynaklarında: goller/nehirler şablonları + gol-nehir.js
  (özet dilbilgisi dahil: "bir doğal göldür, ve …" virgül dizimi) +
  ilce-sorgu'nun TÜM görünür dizgileri (48 kalıp; meta/form/analiz çıktıları/
  JS mesajları) + havza-riski. Yer/kurum adları veri dosyalarından; veri
  düzeltmesi tek: `tr-iller.json` "Afyon" → resmî ad "Afyonkarahisar"
  (eşleme katmanında, kaynağa karşı doğrulanmış — kırık bağ önlendi).
- **Kaynak sadakati istisnası:** RG pasajları/resmî alıntı blokları
  (kk-pasaj, pot-pasaj) dedektörde İSTİSNA — dokunulmadı.
- **Kanıt:** tarama sonrası kalan isabet **0** (şerh: dedektör kalıp
  listelidir, dil denetçisi değildir; liste rapor ekindeki betikte).

## M5 · Göl/nehir kurallara uyduruldu [VERİ]
- **UYDURMA DENETİMİ (öncelikli bulgu):** Overpass bbox çekimi sınır ötesi
  öznitelikleri almıştı — **32 göl + 36 nehir Türkiye DIŞINDA** (Gürcü/
  Ermeni/Bulgar/İran/Irak/Yunan adlarıyla; ör. Sioni Barajı-Gürcistan,
  Dicle'nin Irak kolu) ve "Türkiye Gölleri" başlığıyla yayındaydı. Yeni
  kapsam filtresi: geometri örneklemi 81 il çokgeninin dışındaysa sayfa
  ÜRETİLMEZ; sınır-aşan nehirlerin TÜRK segmentlerinin ayrıca var olduğu
  ölçüldü (Meriç/Aras/Dicle/Fırat ✓ — yanlış eleme yok). Verisiz dolgu
  cümlesi ("su zenginliğinin parçası") kaldırıldı; nehir FAQ sorusu verinin
  cevaplayamadığı "hangi havzaya aittir?"ten, geometrik eşlemeyle
  cevaplanan "hangi havzadan geçer?"e çevrildi; `tahminiKm` ölü kodu
  (nokta sayısından uzunluk tahmini — hiç basılmamış uydurma adayı) silindi.
- **Künye (5.3):** kaynak + kapsam + erişim tarihi (04.08.2026, KAYNAKLAR.md
  kaydından) + ODbL atfı her sayfada.
- **Dürüstlük etiketi (5.4):** "Konum ve ölçek şerhi" bloğu — koordinatın
  bbox merkezi olduğu, il/havza eşlemesinin geometrik örneklem olduğu,
  tescil yerine geçmediği her sayfada yazılı.
- **Sayı bekçisi (5.5):** sayfalardaki tüm rakamlar (alan, koordinat) build'de
  veriden basılıyor — sabit yazılmış rakam ölçümde bulunamadı; /kullanilanlar/
  sayıları da OLCEK bekçisine bağlandı (göl/nehir/elenen).
- **Şema/öz-cevap (5.6):** BodyOfWater + FAQPage korunup düzeltildi
  (containedInPlace artık il + Türkiye).
- **İç link (5.7):** yeni `gol-nehir-cografya.js` (ışın sayımı, il+havza
  poligonları — havza geometrisi depodaymış; SIRADAKILER'in "geometri yok"
  kaydı bayat çıktı): göl→il+havza, nehir→geçtiği havzalar; İL ve HAVZA
  sayfalarına "geri bağ" blokları eklendi (ada kalmaz: her göl/nehir sayfası
  il/havza sayfasından bağ ALIYOR — 442 iç bağ artışı gerileme-denetimde).

## M6 · Denetim seti [VERİ]
- `izleme/kontrast-ornek.json`: +/goller/tuz-golu/ +/nehirler/kizilirmak/
  +/ilce-sorgu/ (6→9 örneklem) · `izleme/cekirdek-sayfalar.json`: aynı üç
  sayfa (11→14).
- md14 taban: deploy sonrası ana ağaçta `--gorsel-taban-yenile --gerekce`
  ile ÖLÇÜLEREK yenilenecek (bilinçli değişiklikler: ana sayfa mobil sırası,
  emoji kaldırma, yeni sayfa tipleri) — kapanış adımı.
- Sitemap 591→**523** (%11,5 azalma — md1'in ±%20 bandı içinde; azalmanın
  TAMAMI gerekçeli kaldırma: 3 satış + 32 göl + 36 nehir, "diğer: 0"
  ölçüldü). llms.txt 592→521 URL (aynı liste).

## KAPI ölçümleri (hepsi worktree build'e karşı)
| Kapı | Sonuç |
|---|---|
| build | ✅ temiz, **523 sayfa** (594−71, sayı birebir kaldırma listesi) |
| gerileme-denetim (canlıya karşı) | ✅ h-sırası/soru-başlığı/şema/öz-cevap-OG kaybı **0**; tek gerileme sınıfı: 78 sayfada icLink −1 = menüden kalkan satış linki (kararın kendisi); sitemap/llms farkı yalnız kaldırma listesi; artış 442 (hidro bağları) |
| iç link kırık | ✅ **0** (bonus: /havza-riski/ sayfasının 25 kırık havza linki — 04.08 dalga hatası, canlıda hâlâ kırık — düzeltildi) |
| md13 | ✅ 9/9 sayfa ihlal 0 (falsifikasyonlu araç düzeltmesiyle) |
| md14 G1-G6 | ✅ plan gereği: ana sayfa order değişikliği BİLİNÇLİ (S1 kare+ölçüm kanıtlı); taban yenilemesi deploy sonrası |
| S1 (375) | ✅ ilk soru üst 785px (canlıda 1383'tü) |
| altın örnek | ✅ 23/23 |
| konsol · 375 taşma | ✅ 9 sayfa × 2 kırılım: 0 · 0 |
| ana sayfa ağırlığı | ✅ HTML 43.908→42.790B (ARTMADI); varlık kümesi aynen (video işi kapsam dışı, SIRADAKILER'de) |

## Kaldırılan URL'ler ve 301 hedefleri
/rapor-satin-al/ → /nerede-su-cikar/ · /raporlar/ → /havzalar/ ·
/rapor-indir/ → /nerede-su-cikar/ · /rapor/suharitasi-<25 havza>-durum-raporu.pdf
→ /havzalar/<havza>/ (tam liste `public/_redirects` sonunda).
Göl/nehir kapsam-dışı 68 sayfa 301'siz düştü (hedefsiz yabancı içerik;
sitemap'ten çıkarıldı — gerekçe KARARLAR §25'te; GSC'de bu URL'lerin izi
kullanıcı beyanındaki ~70 gösterim içinde ölçülememişti).

## Uydurma denetimi sayıları
Kaldırılan sayfa: 68 (32 göl + 36 nehir, Türkiye dışı) · Kaldırılan cümle:
2 şablon dolgusu (×410 sayfa) + 1 ölü tahmin kodu · "doğrulanmadı" etiketi
yerine VERİ eşlemesi kuruldu (il/havza); tip verisi olmayan 7 gölde tür
"Göl (veri türü belirtilmemiş)" olarak dürüst basılıyor.

## Açık kalemler (gerekçesiyle)
SIRADAKILER'e işlendi: /su-hukuku/ hukuki içeriğinin [SERDAR-HUKUK] onayı
(dalgayla girmiş, bu turun kapsamı dışı — satış yüzeyi değil) · lead-mailto
adres birleştirme kararı · ilce-sorgu analiz şerhinin yeterliliği · md14
taban yenileme + .env PAYTR temizliği (deploy sonrası bu kapanışta) ·
D2 kontrast ≥7:1 hedefi (ayrı BÜYÜK İŞ, önceden kayıtlı).
