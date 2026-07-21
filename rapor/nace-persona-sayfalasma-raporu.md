# NACE Persona Sayfalaşması (GECE PAKETİ v2 — Bölüm D)

*2026-07-21*

## Bağımlılık
Bölüm A başarılı (31 NACE ana faaliyet doğrulandı) → Bölüm D **çalıştı**
(atlanmadı).

## Ne yapıldı
1. **Sonuç sayfaları** (`/durumum/[persona]/`): 31 NACE personası, mevcut
   ONAYLI kalıpla (`durumum/[persona].astro`) **birebir** render edilir —
   **yeni tasarım YOK**. Hepsinin son tarihi persona.json'un doğrulanmış
   alanından: **2029-12-27** (`sonTarihDurum:dogrulandi`) → sayfada "Son
   başvuru 27 Aralık 2029" basılır. (Doğrulanmamış tarih olsaydı basılmaz,
   "süre teyidi bekleniyor" gösterilirdi — ama 31'inin hepsi doğrulanmış
   olduğundan bu dal tetiklenmedi; şablon değişmedi.)
2. **Giriş kart ızgarası** (`durumum/index.astro`): 42 kart duvara dönmesin
   diye kaynağa göre **gruplandı** (rehberler indeksindeki kume deseniyle aynı
   mono etiket dili): "Sektör kapıları" (11 genel, öneri vurguları korunur) +
   "NACE Ek-2 faaliyetleri · yeşil su verimliliği belgesi" (31, NACE kod
   sırasıyla, kicker = "NACE NN"). Aynı `.pk` kartı; uzun NACE yükümlülükleri
   grid ritmi için 3 satırda kesilir (tam metin sonuç sayfasında).
3. **Arama listesi**: `#durumum-izgara` sarmalayıcısı korundu → `durumum.js`
   arama (`#durumum-izgara .pk`) 42 kartı da kapsar; grup yapısı aramayı
   bozmadı ("tekstil" → tam NACE 13 kartı, canlı test).

## Kanıt
- Build: 174 sayfa, hata 0. **durumum: 42 persona** (31 NACE + 11 genel).
- 3 örnek NACE persona (curl, JS'siz DOM): `gida-urunleri-imalati-nace-10`,
  `tekstil-urunleri-imalati-nace-13`, `ana-metal-sanayii-nace-24` — her birinde
  öz-cevap ("yeşil su verimliliği belgesi başvurusu") + **FAQPage JSON-LD** +
  "27 Aralık 2029" doğrulandı.
- İndeks gruplama: iki grup etiketi + 31 NACE kartı DOM'da.
- **Kırık iç link: 0** (index + 2 persona, 84 iç link tarandı).
- **375px yatay taşma: 0** (index; 42 kart, 2-kolon). Konsol: **0 hata**.
- Arama işlevi 375'te canlı test edildi (grup yapısıyla çalışıyor).
- Görüntüler: `cikti/denetim/faz-d/durumum-index-1440.png` + `-375.png`.

## Şerh (kullanıcı kararına)
- 31 NACE ana-sektör personası büyük bir küme; bir kısmı genel personalarla
  (Gıda-içecek, Maden) kavramsal örtüşür. `kaynak:"nace-ek2"` ile ayrık
  gruplandı — canlı incelemede budama tek satır filtre. Nihai küratörlük
  kullanıcıda (İş kapanış kuralı).
- Sonuç sayfaları kalıbı hiç değişmedi; yalnız index güncellendi (grup etiketi
  + .pk-y satır sınırı). Nihai görsel/hukuki onay kullanıcının canlı testinde.
