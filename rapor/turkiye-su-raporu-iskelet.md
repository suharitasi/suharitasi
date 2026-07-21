# "TÜRKİYE SU RAPORU" — çeyreklik iskelet
*ODUL-USTU FAZ 7 AŞAMA 1 · madde 6 · İSKELET (içerik üretimi ayrı)*

Çeyrekte bir yayımlanan, veriye dayalı basın/otorite ürünü. İçerik bu briefte
DEĞİL — bölümler + hangi veriden hangi grafik (dataviz kuralı) + dağıtım metni.
Her sayı mevcut canlı veriden otomatik beslenir (baraj/GRACE/mevzuat); uydurma yok.

## Bölümler ve grafik reçeteleri (dataviz kurallarına bağlı)
| # | Bölüm | Veri kaynağı | Form (dataviz) | Kural notu |
|---|---|---|---|---|
| 1 | Çeyreğin özeti | tüm veriler | 3-4 **stat tile** (hero number) | tek değer → grafik değil (form heuristiği) |
| 2 | Baraj doluluk eğilimi | data/canli/baraj.json (günlük seri) | **çizgi** (zaman) | tek eksen; seçili havzalar direkt etiket; ≥2 seri → lejant |
| 3 | Su depolaması: nerede azalıyor | data/canli/grace-havza.json | **diverging bar** | iki kutup (azalma=kehribar / toparlanma=DERİN) + nötr gri orta; renk sıralamaya değil havzaya bağlı |
| 4 | En kritik 5 havza | grace + havza-veri | **sıralı bar** + stat | kehribar vurgu yalnız eşik altı (≤−1,5) |
| 5 | Rezerv vs potansiyel | havza-veri + havza-yas | **küçük çoklu** (small multiples) | çift eksen YASAK → iki ölçü ayrı panel |
| 6 | Mevzuat hareketi | izleme/OLAYLAR + su-kanunu taslak | zaman çizgisi (metin) | veri yoksa "bu çeyrek hareket yok" |
| 7 | Yükümlülük takvimi | Su Verimliliği Yönetmeliği | **stat + sabit tarih** | 27.12.2029 son başvuru (doğrulanmış); "kalan gün" değil sabit tarih |

**Palet:** SU-DİLİ (DERİN #175E56 / kehribar #B8863B / nötr gri) — HavzaPaneli'nde
doğrulanmış; skill varsayılan paletini geçersiz kılar. Diverging = 2 hue + nötr
orta (rainbow YASAK). Her grafik: tek eksen, lejant ≥2 seri, tablo görünümü,
kaynak künyesi (künyesiz sayı yayınlanmaz — DESIGN §5).

## Görsel üretim
Rapor grafikleri build-time SVG (mevcut BarajDoluluk/HavzaKahraman/HavzaPaneli
deseni) veya `arac/linkedin-kart.mjs` kalıbıyla PNG (basın için). Grafik kodu
ilk satırından ÖNCE dataviz kuralları uygulanır (CLAUDE.md zorunlu).

## Basın dağıtım e-posta metni (taslak — [KULLANICI] imza)
> Konu: Türkiye Su Raporu — [ÇEYREK/YIL] · [tek manşet veri]
>
> Merhaba,
> suharitasi.com olarak Türkiye'nin su verisini çeyreklik derledik.
> Bu çeyreğin öne çıkanları:
> - [manşet 1: ör. Asi Havzası su deposu yılda −2,34 cm — en hızlı azalan]
> - [manşet 2: baraj doluluk / mevzuat]
> - Yükümlülük takvimi: yeşil su verimliliği belgesi son başvuru 27.12.2029.
> Tam rapor (grafikler + kaynaklar): [link]
> Görsel/veri kullanımı kaynak gösterilerek serbesttir.
> [KULLANICI: Av. Serdar Arslan · Arslan Hukuk Bürosu · iletişim]

## Dağıtım listesi (kullanıcı kararı)
Sektör basını (su/çevre/enerji/tarım), yerel gazeteler, sektör dernekleri,
OSB/oda bültenleri. Liste + gönderim aracı kullanıcıda (bülten altyapısıyla
ortak olabilir — Buttondown).
