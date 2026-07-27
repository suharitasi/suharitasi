# FAZ 1 RAPORU — NHYP / YAS kütleleri çıkarımı

Tarih: 2026-07-27 · Worktree: suharitasi-potansiyel · Araçlar:
`arac/nhyp-indir.sh` (indirici) + `arac/nhyp-cikar.py` (çıkarıcı)
Çıktı: `veri/potansiyel/yas-kutleleri.json`

## 1.1 İndirme (ölçülen)

- Manifest: 12 havza, 38 PDF (yerüstü-yalnız belgeler elendi).
- Sonuç: **38/38 başarılı, 0 hata** (`veri/ham/nhyp/indirme-log.txt` SONUÇ satırı).
- Boyut: 892 MB (PDF) + metinlerle 970 MB. Disk koşu sonrası: 49G boş → yeterli.
- Doğrulama: `pdfinfo` 38/38 geçerli PDF, bozuk 0.
- veri/ham/ `.gitignore`'a eklendi (G6) — yalnız türetilmiş JSON + rapor commit.

## 1.2 Çıkarım (pdftotext -layout → format-özel ayrıştırıcılar)

Kütle tabloları havzadan havzaya FARKLI belge ve formatlarda; 6 ayrı
ayrıştırıcı yazıldı (hangi havza hangi belge — JSON `kaynak` alanında satır +
sayfa numarasıyla):

| Format | Havzalar | Kaynak tablo |
|---|---|---|
| AB OUT_27 | Büyük Menderes, Konya, Meriç-Ergene, Susurluk | "Nihai durum sınıflandırması" özet tablosu |
| 3-Pilot (AKARÇAY) | Akarçay | Tablo 29 Durum Değerlendirmesi, Yeraltı Suları |
| 3-Pilot (İyi/Zayıf Durum) | Batı Akdeniz, Yeşilırmak | Tablo 31 / Tablo 30 |
| Kuzey Ege | Kuzey Ege | Tablo 6.20 (font kodlaması Ġ→İ, Ģ→ş normalize edildi) |
| Küçük Menderes | Küçük Menderes | Tablo 5.8 Kütlelerin Nihai YAS Durumu |
| Burdur | Burdur | Tablo 5.4 YAS Kütleleri Genel Durumu |
| Gediz | Gediz | Tablo 3.26 + 3.27 (yalnız baskı/risk — aşağıda) |
| Sakarya künye | Sakarya | YAS Kütleleri Künyeleri 1-3 (alan+akifer+durumlar) |

## 1.3 KALİTE KAPISI — 12/12 YEŞİL, KIRMIZI LİSTE BOŞ

Beyan = PDF'in kendi metninden regex ile çekilen sayı (kaynak satır+alıntı
JSON `beyan` alanında). Çıkarılan = ayrıştırılan tekil kütle kodu sayısı.

| Havza | Beyan | Çıkarılan | Kapı |
|---|---|---|---|
| Akarçay | 14 | 14 | YEŞİL |
| Batı Akdeniz | 67 | 67 | YEŞİL |
| Burdur | 27 | 27 | YEŞİL |
| Büyük Menderes | 38 | 38 | YEŞİL |
| Gediz | 76 | 76 | YEŞİL |
| Konya Kapalı | 18 | 18 | YEŞİL |
| Küçük Menderes | 42 | 42 | YEŞİL |
| Kuzey Ege | 31 | 31 | YEŞİL |
| Meriç-Ergene | 12 | 12 | YEŞİL |
| Sakarya | 71 | 71 | YEŞİL |
| Susurluk | 22 | 22 | YEŞİL |
| Yeşilırmak | 54 | 54 | YEŞİL |
| **TOPLAM** | **472** | **472** | — |

Ayrıştırıcı geliştirmede yakalanan ve düzeltilen hatalar (kanıtlı):
- İçindekiler çakışması: tablo başlığının İLK geçişi TOC'a denk geliyordu
  (kuzey-ege/km/burdur 0 satır) → SON geçiş kuralı.
- "Tablo 5.8" tek başına SKKY sektör tablolarına da çarpıyordu → tam başlık.
- 3-Pilot beyanında yanlış sütun (Genel yerine Miktar; Yetersiz Veri satırı
  toplamı düşürüyordu) → soldaki ilk çift.
- KM satır-kaydırmalı ad ("Çeşme-"/"Dalyanköy") → devam satırı birleştirme.
- Konya yıldızlı durum ("Zayıf durum*") ada sızıyordu → yıldız `ek.dipnot`e.
- BM ad-kaydırma (TR07YAS08004 üç satıra bölünmüş ad) → önceki+sonraki satır.

## 1.4 Alan doluluk istatistiği (472 kütle)

- kutle_kodu, kutle_adi, havza, miktar_durumu, kimyasal_durum: 472/472
  (Gediz'in 76'sında durum="veri yok" — aşağıda).
- nihai_durum: 396/472 dolu (Gediz 76 null — kaynakta yok).
- alan_km2: yalnız Sakarya 71/71 (künyede yazıyor); diğerlerinde null
  (durum tablolarında alan sütunu yok).
- akifer_tipi: yalnız Sakarya 71/71; KM EK-8 künyesinin metin katmanı bozuk
  ("Serb est") → çıkarılmadı, null.
- **Tahminle doldurulmuş alan: SIFIR.** Her değer ya kaynaktan regex ile
  çıkarıldı ya null/"veri yok".

Durum dağılımı (örnek): Sakarya kimyasal 55 Zayıf / 16 İyi; Batı Akdeniz
miktar 56 İyi / 11 Zayıf; Meriç-Ergene kimyasal 12/12 Zayıf.

## Dürüstlük şerhleri

1. **Gediz**: planda (TÜBİTAK/SYGM-2017 formatı) İyi/Zayıf DURUM sınıflaması
   YOK; yalnız baskı/risk sınıfları yayımlı. miktar/kimyasal="veri yok";
   risk sınıfları `ek` alanında (miktar_baski/miktar_risk/kirletici_risk).
2. **Sakarya kimyasal+nihai**: künyedeki "Tedbirler Öncesi" bloğu sütun-hizalı
   ayrıştırıldı (başlık ofsetine en yakın değer). Örnekle doğrulandı
   (Ilgın: Zayıf/Zayıf/Zayıf — PDF görüntüsüyle birebir).
3. "Bornava-2" (KM) gibi kaynak yazım hataları DÜZELTİLMEDİ (kaynağa sadakat).
4. Doğrulama: 6 havzadan 6 kayıt, JSON'daki kaynak satırından ham metinle
   birebir kıyaslandı — 6/6 eşleşti (Konya yıldız vakası bu kontrolde çıktı).

## BİTTİ-TANIMI kontrolü

- JSON şeması geçerli (json.load + alan denetimi) ✓
- Kırmızı liste raporlu: **BOŞ** ✓
- Tahminle doldurulmuş alan SIFIR ✓
