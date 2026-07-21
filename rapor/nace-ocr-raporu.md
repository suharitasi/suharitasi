# NACE Ek-2 OCR Raporu (GECE PAKETİ v2 — Bölüm A)

*2026-07-21*

## Amaç
Su Verimliliği Yönetmeliği Ek-2 (NACE kodu bazında, yeşil su verimliliği
belgesi yükümlüsü faaliyetler) listesini taranmış/görüntü-tabanlı ekler
PDF'inden OCR ile çıkarmak; doğrulanan satırlardan NACE-türevli persona üretmek.

## Araç zinciri
- Kaynak: `data/arsiv/mevzuat/su-verimliligi-yonetmeligi-ekler-20241227-3-1.pdf`
  (16 sayfa; metin katmanı yalnız filigran — gövde CCITT görüntü).
- tesseract 5.3.4 + `tur` dil paketi (kullanıcı elle kurdu — sudo parolası
  otomasyona kapalıydı; kurulum notu aşağıda).
- `pdftoppm -r 600` → ImageMagick `-colorspace Gray -normalize -sharpen` ön-işleme
  → `tesseract -l tur --psm 4` (tek kolon, değişken font — tablo için --psm 6'dan
  belirgin daha temiz sonuç verdi).
- Ek-2 içeriği sayfa **3-9** arasında; diğer sayfalar Ek-1/Ek-3/Ek-4/Ek-5.

## Kurulum notu (tesseract)
`apt-get install` bu ortamda sudo parolası istedi (non-interaktif otomasyona
kapalı); paket kullanıcı tarafından elle kuruldu. Sonrasında OCR tam otomatik
yürütüldü. Tekrar için: `sudo apt-get install -y tesseract-ocr tesseract-ocr-tur`.

## Sayımlar (güven kuralı)
| Katman | Toplam | Doğrulandı | Şüpheli/ayrıştırılamayan |
|---|---|---|---|
| Ana faaliyet (2-haneli NACE + sektör adı) | 31 | **31** | 0 |
| Detay alt-kod (NN.NN) — regex ile yakalanan | 90 | 83 | 7 (nokta düşmüş) |
| Detay alt-kod — otomatik ayrıştırılamayan | ~58 | — | ~58 (çok-satırlı/bitişik kolon) |
| Detay nominal (belgede yaklaşık) | ~148 | 83 | ~65 |

**Güven kuralı uygulaması:** Ana faaliyet satırları temiz OCR'dan birebir
transkripsiyon (31/31 doğrulandı). Detay alt-kodlar regex ile çıkarıldı; yalnız
`NN.NN` deseni **temiz** olanlar `dogrulandi`. Nokta düşmüş / bozuk desen
`dogrulanmadi` — **ham kod korunur, sessiz düzeltme YOK** (ör. `1041` → `10.41`
diye düzeltilmedi; ham `1041` olarak şüpheli işaretlendi). Çok-satırlı açıklama
veya bitişik iki-kolon nedeniyle tek-satır desenine oturmayan ~58 satır detay
listesine GİRMEDİ; sayı olarak burada raporlanır (sessizce atlanmadı).

**Persona kaynağı = ana faaliyet düzeyi** (31 doğrulanmış sektör). Detay alt-kodlar
belgeleme amaçlı `nace-ek2.json`'da güven-işaretli durur; şüpheli/eksik detay
satırları persona ÜRETMEDİ.

## 5 örnek (ham OCR ↔ ayrıştırılmış)
1. **Ana faaliyet (temiz):** ham `7 10 Gıda ürünlerinin imalatı imalatı`
   → `{sira:7, kod:"10", ad:"Gıda ürünlerinin imalatı", guven:"dogrulandi"}`.
   (Filigran "imalatı" yinelemesi ad'a KATILMADI — resmî ad birebir.)
2. **Ana faaliyet (çapraz doğrulanan):** ham `15 ,9 O | Kok kömürü ve rafine
   edilmiş petrol...` — 2-haneli kod OCR'da gürültülü (`,9 O`). Aynı satırın
   detay alt-kodu `63 1920 Rafine edilmiş petrol ürünleri imalatı` ile kod **19**
   çapraz doğrulandı → `{kod:"19", guven:"dogrulandi", not:"alt-kod 19.20 ile
   çapraz doğrulandı"}`. Tahminle DEĞİL, belgedeki ikinci kayıtla teyit.
3. **Detay (temiz):** ham `16 10.12 Kümes hayvanları etlerinin işlenmesi ve
   saklanması` → `{kod:"10.12", guven:"dogrulandi"}`.
4. **Detay (nokta düşmüş — şüpheli):** ham `29 1041 Sıvı ve katı yağ imalatı`
   → `{hamKod:"1041", kod:null, guven:"dogrulanmadi"}`. `10.41` olduğu
   muhtemel ama nokta OCR'da yok → düzeltilmedi, şüpheli.
5. **Detay (nokta düşmüş — şüpheli):** ham `40 1107 Alkolsüz içeceklerin
   imalatı; maden sularının...` → `{hamKod:"1107", kod:null,
   guven:"dogrulanmadi"}`.

## Çıktılar
- `data/lead/nace-ek2.json` — 31 ana faaliyet (doğrulandı) + 90 detay satır
  (güven-işaretli) + sayımlar + araç künyesi.
- `data/lead/persona.json` — 31 NACE-türevli persona eklendi (kaynak
  `nace-ek2`, `nace` alanı, yükümlülük = yeşil su verimliliği belgesi,
  son tarih **2029-12-27** `dogrulandi` [gövde md.(3): Ek-2 faaliyetleri "en
  fazla beş yıl içinde"]). Toplam persona: 11 → **42**. Build assert temiz,
  42/42 benzersiz slug.

## Şerh (kullanıcı kararına)
- 31 ana-sektör personası büyük bir küme; bir kısmı mevcut genel personalarla
  (Gıda-içecek, Maden işletmecisi) kavramsal örtüşür. NACE personaları
  `kaynak:"nace-ek2"` etiketiyle ayrık tutuldu — canlı incelemede budama
  kolaydır. Sayfalaşma/ızgara Bölüm D'de.
- Detay alt-kod listesi eksiksiz DEĞİL (~58 satır otomatik ayrıştırılamadı).
  Tam detay liste gerekirse: daha yüksek DPI + hücre-bazlı segmentasyon veya
  RG makine-okunur sürüm. Persona üretimi ana faaliyet düzeyinde tam olduğundan
  bu eksik lead hedeflemesini engellemez.
