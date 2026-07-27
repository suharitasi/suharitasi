# FAZ 5 RAPORU — morfoloji (GLO-90)

Tarih: 2026-07-27 · Araç: `arac/morfoloji-hesap.py` (izole venv: numpy+tifffile)
Çıktı: `veri/potansiyel/morfoloji.json`

## 5.1 Kaynak kapısı (ölçülen)
- Gereken karo: **122** (il bbox'larından; N35-42 × E25-44).
- Örnek boyutlar (HEAD): 1,16 / 4,86 / 5,41 MB → tahmin ~0,5 GB.
- Gerçekleşen: **474 MB** (veri/ham/dem/, gitignore) · disk sonrası 47G boş.
- RAM: karo başına 1200×1200 float32 ≈ 6 MB — karo karo işlendi. KAPI GEÇTİ.
- 1 karo AWS'de yok (404 — tam deniz karosu); veri kaybı değil.
- (Brief kaydı: GLO-30 elenmişti — 2C/4GB + il ölçeği için 90 m yeterli.)

## 5.2 İl sınırları
`src/data/tr-iller.json` (OSM türevi, ODbL — repoda mevcut; GADM
KULLANILMADI). "Afyon"→"Afyonkarahisar" ad düzeltmesi. Maske: satır-tarama
even-odd rasterizasyon (delikler dahil), piksel merkezinden.

## 5.3 Hesap
- **Düşük eğim oranı**: eğim% = 100·√(gx²+gy²), 3-arcsec merkezî fark
  (dx enlemle ölçekli); eşik < %2; il alanına oran (piksel alanı enleme
  göre km² ağırlıklı).
- **Vadi tabanı göstergesi**: eğim < %2 VE 1 km (11×11) pencerede yerel
  çukurluk < 10 m. Bu, akış birikimi DEĞİLDİR — yaklaşık morfolojik
  göstergedir (yöntem alanı JSON'da açıkça yazılı).
- **TWI: hesaplanmadı** — akış birikimi tüm-DEM global işlem ister,
  2C/4GB sunucu bütçesini aşar (brief 5.3 "yalnız kaynak yeterse" koşulu).

## Sonuç ve akıl-sağlığı kontrolleri
**81/81 il için değer üretildi; "hesaplanamadı" kaydı 0.**

| İl | Hesaplanan alan (km²) | Düşük eğim % | Vadi tabanı % |
|---|---|---|---|
| Konya | 40.934,5 (resmî ~40,8 bin — %0,3 sapma) | 43,4 | 40,1 |
| Şanlıurfa | 19.602,3 | 36,8 | 29,8 |
| Ankara | 25.761,5 | 10,7 | 9,1 |
| Rize | 3.634,2 | 0,4 | 0,4 |
| Artvin | 7.738,4 | 0,3 | 0,2 |

Ova illeri yüksek, Doğu Karadeniz illeri ~0 — coğrafyayla tutarlı.
Alan sapmaları (Rize 3,6k vs resmî 3,9k) OSM poligon basitleştirmesinden;
oranlar aynı poligonla hesaplandığından iç tutarlı.

## Sabit etiket (brief 5.4 — JSON'da AYNEN)
"Sayısal yükseklik modelinden türetilmiş morfolojik göstergedir; akifer
varlığının kanıtı değildir."

## BİTTİ-TANIMI
81 il için değer VEYA "hesaplanamadı" kaydı: **81 değer / 0 hesaplanamadı** ✓
