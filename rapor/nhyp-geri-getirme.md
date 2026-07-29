# NHYP KAYNAK PDF'LERİ — GERİ GETİRME RAPORU

Tarih: 2026-07-29 · Sınıf: **BÜYÜK İŞ** (veri) · Brief:
`cikti/brief/2026-07-29-nhyp-yeniden-indirme.md` (+ `-duzeltilmis.md`)
Denetçi: 1 ENGEL + 3 UYARI → yalnız eklemeyle **0 ENGEL + 3 UYARI**.
Kullanıcı kararı: `KARARLAR.md` §20.

---

## 1. Neden

27.07'de indirilen NHYP kaynak PDF'leri (`veri/ham/nhyp/`) **kaybolmuştu**:
dizin `.gitignore`'da olduğu için main'e hiç girmedi ve iş bittiğinde
worktree silinirken onunla gitti. Site etkilenmemişti — türetilmiş
`veri/potansiyel/yas-kutleleri.json` git'te ve kalite kapısı yeşildi — ama
**kaynağa geri dönme imkânı yoktu**: JSON'daki her kütle kaydı dosya + satır
+ sayfa künyesi taşıyor, PDF elde olmadan bu künye doğrulanamıyordu.
Tespit: `rapor/yedek-envanteri.md` §2.1.

## 2. Yapılan — zincirin tamamı depoya alındı

Asıl kazanç indirilen dosyalar değil, **zincirin yeniden üretilebilir hâle
gelmesi**. Önceden manifest oturum scratchpad'indeydi ve PDF→metin adımı
hiç kayda geçmemişti; ikisi de artık depoda:

```
arac/nhyp-manifest-uret.py   (YENİ)  → arac/test/nhyp-manifest.json
arac/nhyp-indir.sh           (vardı) → veri/ham/nhyp/**/*.pdf
arac/nhyp-metne-cevir.sh     (YENİ)  → veri/ham/nhyp/**/*.txt
arac/nhyp-cikar.py           (vardı) → veri/potansiyel/yas-kutleleri.json
```

### 2.1 Manifest nasıl türetildi (uydurma yok)
Üç depo-içi kayıttan:
- **(a)** `arac/nhyp-yayin-nobetci.py` `BILINEN` sözlüğü — 12 havzanın
  27.07'de HTTP 200 ölçülmüş yolu. Buradan havza→**dizin** eşlemesi çıktı.
  Sözlük **import edildi, kopyalanmadı** (tek kaynak).
- **(b)** `yas-kutleleri.json` kaynak künyeleri — çıkarımın GERÇEKTEN
  okuduğu 12 dosya adı (`.txt` → `.pdf`).
- **(c)** SYGM NHYP liste sayfası canlı tarandı (`SayfaId=49`) — 56 PDF
  bağlantısı bulundu.

Her aday **HEAD ile yoklandı**; 200 dönmeyen manifeste yazılmadı.
Sonuç: **41 erişilebilir · 0 bulunamadı · 15 elendi** (yerüstü-yalnız
belgeler — orijinal manifestin eleme kuralı, `rapor/potansiyel-faz1.md:8`).

## 3. Ölçümler

| Kapı | Beklenen | Ölçülen |
|---|---|---|
| **B1** çekirdek dosya | ≥12 geçerli PDF | **12/12** indi |
| **B1** tüm manifest | — | **41/41 başarılı, 0 hatalı** |
| pdfinfo doğrulaması | bozuk 0 | **41 geçerli · 0 bozuk** |
| PDF→metin | hatalı 0 | **41 üretildi · 0 hatalı** |
| **B2** manifest | her satır HEAD 200 | **41/41 · 0 bulunamadı** |
| **B3** indirilemeyen | listelenmiş | **yok** (bulunamayan çıkmadı) |
| **B4** dokunulmaz | `veri/potansiyel/*` bit-eşit | **`git diff` BOŞ** |
| **B6** disk | ≥20 GB kalmalı | **48 GB boş** (1,1 GB indi) |
| Toplam boyut | — | **1,1 GB** (41 PDF + 41 metin) |

## 4. UÇTAN UCA TEKRAR — **BİT-EŞİT**

Briefin falsifikasyon adımı: çıkarım GEÇİCİ bir çıktı yoluna koşuldu
(`NHYP_CIKTI` ortam değişkeni — yeni, yalnız test içindir; üretimde
ayarlanmaz, `yas-kutleleri.json` **üzerine yazılmadı**).

```
akarcay        beyan= 14  çıkarılan= 14  YESIL
bati-akdeniz   beyan= 67  çıkarılan= 67  YESIL
yesilirmak     beyan= 54  çıkarılan= 54  YESIL
gediz          beyan= 76  çıkarılan= 76  YESIL
kuzey-ege      beyan= 31  çıkarılan= 31  YESIL
kucuk-menderes beyan= 42  çıkarılan= 42  YESIL
burdur         beyan= 27  çıkarılan= 27  YESIL
buyuk-menderes beyan= 38  çıkarılan= 38  YESIL
konya          beyan= 18  çıkarılan= 18  YESIL
meric-ergene   beyan= 12  çıkarılan= 12  YESIL
susurluk       beyan= 22  çıkarılan= 22  YESIL
sakarya        beyan= 71  çıkarılan= 71  YESIL
TOPLAM kütle: 472 | KIRMIZI: 0
```

Depodaki JSON ile karşılaştırma:

| Alan | Sonuç |
|---|---|
| `kaynak_seti` | **BİT-EŞİT** |
| `not` | **BİT-EŞİT** |
| `havzalar` (472 kütle, tüm alanlar) | **BİT-EŞİT** |
| `uretim_tarihi` | aynı (`2026-07-27` — sabit yazılı) |

**Anlamı:** 27.07'deki çıkarım bugün kaynaktan **birebir** yeniden
üretilebiliyor. Bu, tek bir sayının değil, **472 kütlenin her alanının**
(kod, ad, miktar/kimyasal/nihai durum, akifer, alan, kaynak satır+sayfa)
doğrulanması demektir.

### 4.1 Zinciri yeniden koşmak (gerekirse)
```bash
python3 arac/nhyp-manifest-uret.py > arac/test/nhyp-manifest.json   # ~1 dk
./arac/nhyp-indir.sh arac/test/nhyp-manifest.json                    # ~25 dk, 1,1 GB
./arac/nhyp-metne-cevir.sh                                           # ~3 dk
NHYP_CIKTI=/tmp/tekrar.json python3 arac/nhyp-cikar.py               # ~1 dk
```
Son satırda `NHYP_CIKTI` **verilmezse** üretim dosyası güncellenir —
kasıtlı değilse verin.

## 5. Süreklilik (SÜREKLİLİK İLKESİ)

Altın örnek NHYP kalemi yükseltildi: artık **kaynak varlığı** da ölçülüyor
(`arac/test/altin/nhyp.json` → `kaynakVarligi`). Davranış:

| Durum | Kalem |
|---|---|
| 12/12 var | 🟢 geçti |
| 0/12 var (temiz klon) | 🟢 geçti — `veri/ham/` gitignore'da, yokluk arıza değil |
| **kısmen eksik** | 🔴 **düşer** — yarısı silinmiş kaynak kümesi gerçek bozulmadır |

**Falsifikasyon ölçüldü:** bir kaynak metni gizlendi → `🔴 11/12 KISMEN
EKSİK` + geri getirme yolu mesajda; geri konuldu → `🟢 23/23`.

Bu kalem, 27.07'deki sessiz kaybın tekrarını imkânsız kılar: dosyalar
kısmen silinirse **sonraki sağlık koşusunda** görünür.

## 6. Yol boyunca çıkan hatalar (kayda geçti)

| # | Hata | Düzeltme |
|---|---|---|
| 1 | Manifest **TSV** üretiliyordu; `nhyp-indir.sh` **JSON** okuyor → 0 satır işlendi | Üretici JSON basıyor; sözleşme dosya başında yazılı |
| 2 | Ham URL (boşluk + Türkçe karakter) yazıldı; `head()` kendi içinde kodladığı için **HEAD 200 dönüyordu** ama curl'e ham gidiyordu → **41/41 HATA** | Manifest **yüzde-kodlanmış** URL taşıyor; iki taraf ayrışmıyor |
| 3 | Havza sabit dizinden (`split[3]`) çıkarılıyordu; yol derinlikleri farklı → 25 dosya `nehir-havza-yonetim-planlari-28-12-2022` adlı **sahte havzaya** düştü | Dosyanın **hemen üstündeki** klasör kullanılıyor |
| 4 | `slug()` yalnız "Havzası" siliyor, klasörler "HAVZASI" yazıyor → `akarcay-havzasi` gibi sahte anahtarlar | `havza_coz()` kanonik 12 havzaya eşliyor; tanınmayan **uydurulmuyor**, `diger`e düşüyor (3 dosya) |
| 5 | Eleme kuralı yalnız açık yazımı ("YERÜSTÜ") eliyordu → 87 MB'lık `Ek-7 KMN YÜS Künyeleri.pdf` gereksiz indi | Kural `\bYÜS\b` kısaltmasını da eliyor (YAS içerenler korunur) |
| 6 | Metne çevirme, indirme **sürerken** koşuldu → yarım dosyada `pdftotext` hatası | Hata sessiz kalmadı, loglandı; indirme bitince tekrar koşuldu, 0 hatalı |

Hataların hepsi **loglanarak** yakalandı; hiçbiri sessizce geçmedi.

## 7. Kapsam dışı kalanlar

- **Yeni çıkarım / JSON güncelleme:** yapılmadı, briefin dokunulmazı.
- **3 dosya `diger` havzasında** (`EK-VII_SUSURLUK YÜS TEDBİRLER.pdf`,
  `Burdur Havzasi Yonetim Plani.pdf`, `EK-1_İLGİLİ BÖLÜMLER.pdf`):
  klasör adları kanonik havzaya eşlenemedi. **Uydurulmadı**; indirildi ve
  `diger/` altında duruyor. Çıkarımda kullanılmıyorlar.
- **Yedeğe eklenmedi:** `veri/ham/nhyp` 1,1 GB; gecelik yedek tarball'ına
  konmadı çünkü **iki komutla yeniden indirilebilir** ve manifest artık
  git'te. Yedek envanterindeki gerçekten geri getirilemez varlıklar
  (ham video, atlas PNG) korunuyor.
- **41 ≠ 38:** orijinal koşum 38 dosya indirmişti, bugün 41. Fark
  açıklanamadı — orijinal manifest kayıp olduğu için birebir karşılaştırma
  **yapılamıyor** (**doğrulanmadı**). Çıkarımın kullandığı 12 dosya aynı
  ve çıktı bit-eşit; fark ek belgelerde.
