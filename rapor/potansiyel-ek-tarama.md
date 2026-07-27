# EK TARAMA RAPORU — RG içerik/ilan + DSİ duyuru arşivi

Tarih: 2026-07-27 · Onay: kullanıcı (Faz 4 geçiş mesajı — "aynı kanıt
kuralları geçerli") · Araçlar: `arac/rg-icerik-tara.py`, `arac/dsi-duyuru-tara.py`
Çıktılar: `veri/potansiyel/isletme-sahalari-ek.json`, `veri/potansiyel/dsi-duyurular.json`

## 1. RG gazete-günü içerik taraması

Girdi işaretçileri: ilan araması (st=5) 121 gazete-günü + içerik araması
(st=4) 83 gazete-günü (1981+ olan 2'si işlendi; 1963-1980 olanlar başlık
taramasıyla zaten kayıtlıydı).

**Sonuç: 310 pasaj-kayıt · kaynaksız 0 · işlenemeyen 2** (OCR'sız PDF).

| Kaynak türü | Kayıt |
|---|---|
| rg-ilan-pdf (eski ilan bölümü PDF'leri, pdftotext) | 251 |
| rg-ilan-icerik (HTML ilan sayfaları, 2005-2017) | 56 |
| rg-arsiv-pdf (st=4, 1983+1994) | 3 |

- Durum: 199 ilan/değişiklik · **23 tahsise kapatma/kısıt** · 88 belirsiz.
- İl: 171 tek-il · 105 çok-il · 34 belirsiz (etiketli).
- Yıl kapsamı: **1963-2017** — Faz 3'ün 1980 sonrası boşluğu 2005-2017
  ilanlarıyla (56 kayıt; ör. "Korkuteli Ovaları YAS İşletme Sahası İlanı",
  RG 09.12.2017) kapandı. 1995-2004 penceresinde arama isabeti yok
  (RG arama dizini o dönem için işaretçi döndürmedi — dürüstlük notu).
- Her kayıt: tarih + kaynak URL + AYNEN pasaj alıntısı (≤900 kr).
  Pasajlar OCR gürültülü (eski dizgi, kabine imza blokları karışabiliyor);
  kayıtlar Faz 6'da HAM HUKUK METNİ olarak DEĞİL, künyeli işaretçi olarak
  kullanılır (G3).

### Geliştirmede yakalanan ve düzeltilen 3 kusur (kanıtlı)
1. İlk koşuda 83 sayfa "pasaj bulunamadı" — kök neden: st=5 listesi eski
   yıllar için ARŞİV PDF URL'si döndürüyor, script HTML sanıp decode
   ediyordu → uzantıya göre PDF/HTML yol ayrımı; işlenemeyen 83→2.
2. HTML kodlaması hep windows-1254 varsayılıyordu → meta-charset tespiti.
3. Çakışan pasaj pencereleri aynı ilanı bölüyordu (Korkuteli çift kaydı) →
   aralık birleştirme.

## 2. DSİ duyuru + haber arşivi

Listelenen: **328 giriş** (duyuru + haber, tüm sayfalar). Filtreyle eşleşen:
**2 kayıt** — ikisi de haber, ikisi de işletme sahası İLANI DEĞİL (kuyu
açma haberi + YAS sulama şebekesi ihalesi). **Bulgu: DSİ merkezî
duyuru/haber arşivi YAS işletme sahası ilanlarını taşımıyor** (arşiv sığ —
görünür kayıtlar son yıllar; ilanlar RG kanalında). Van-Erçek (2025) tipi
güncel ilanlar için kalıcı izleme istenirse ayrı iş (RG günlük takibi
zaten su-izleme cron'unda değil — değerlendirme kullanıcıda).

## Kanıt kuralı denetimi
- Kaynaksız kayıt: RG ek 0/310 ✓ · DSİ 2/2'de başlık+URL (+tarih) ✓
- Ham arşiv: veri/ham/rg-pdf/ 203 MB (gitignore'da) · disk 48G boş.
