# FAZ J — Su Kanunu Nisan 2026 taslağı: keşif sonucu

Tarih: 2026-07-27 gece · Kapsam: yalnız keşif + doğrulama. Siteye hiçbir
içerik basılmadı, canlı `izleme/su-izleme.sh` ve `izleme/hedefler.conf`
DEĞİŞTİRİLMEDİ.

## Sonuç: BULUNDU — ama yayım kısıtlı. [SERDAR-HUKUK] kararı gerekli.

Nisan 2026 taslağının tam metni erişilebilir bir URL'de bulundu; **ancak
belgenin kendi üst yazısı kamuya açık yayımı açıkça men ediyor.** Bu
yüzden "kamuya açık taslak bulundu" DEMİYORUM — durum üçüncü bir hâl.

### Bulunan belge

| Alan | Değer |
|---|---|
| URL | `https://samsuntso.org.tr/api/v1/file/5f11b9347a396eb99623a136cd33cd01.pdf` |
| Bulunduğu sayfa | `https://dinartso.org.tr/detay/su-kanunu-taslagi-2251` (Dinar TSO duyurusu) |
| HTTP | 200 · `application/pdf` · 725.513 bayt |
| Last-Modified | Tue, 28 Apr 2026 10:44:15 GMT |
| PDF CreationDate | 24 Nisan 2026 15:20 UTC |
| Sayfa | 23 |
| İçerik | TOBB üst yazısı + Genel Gerekçe (4 s.) + **Su Kanunu Taslağı (17 s., MADDE 1–…)** + Görüş Bildirme Formu (1 s.) |

Doğrulama (metinden, ölçüldü — PDF yerel kopyası
`cikti/denetim/faz-j/aday-samsuntso.pdf`, depoya girmez):

- TOBB Genel Sekreter Yardımcılığı yazısı, `E-34221550-045.99-5862`,
  tarih **24.04.2026**, konu "Su Kanunu Taslağı", muhatap "Tüm Oda ve
  Borsalar".
- Taslak metni gerçekten içinde: `SU KANUNU TASLAĞI / BİRİNCİ BÖLÜM /
  Amaç ve kapsam / MADDE 1- …`, MADDE 10 (izleme noktaları), MADDE 11
  (**su tahsisi yetkisi DSİ'ye aittir**), MADDE 12–15 vb.
- Görüş son tarihi 30 Nisan 2026.

### KISIT — belgenin kendi ifadesi

Üst yazıda aynen: *"taslak metnin yalnızca ilgili üyelerle paylaşılması,
Oda ve Borsalarımızın internet siteleri dâhil kamuya açık mecralarda
yayımlanmaması ve üçüncü taraflarla aleni şekilde paylaşılmaması önemle
rica edilmektedir."*

Yani bulunan kopya, **yayımlanmaması istenmiş bir belgenin bir odanın
sitesinde yayımlanmış hâlidir**. Bakanlık taslağı 15 Nisan 2026'da 268
kuruma yazıyla göndermiş; kamuya açık resmî yayın YAPILMAMIŞ (aşağıdaki
resmî kaynak taraması bunu doğruluyor).

**Bu bir hukuk kararıdır, teknik karar değil.** suharitasi.com'un tüm
konumu "su hukukunda otorite" olduğu için, yayımlanmaması istenen bir
belgeyi alıntılamanın/işlemenin itibari ve hukuki sonucunu Serdar
değerlendirmelidir. Bu gece hiçbir yönde adım atılmadı.

Seçenekler (karar kullanıcının):
1. Hiç dokunma — resmî yayına kadar bekle (en muhafazakâr).
2. Yalnız iç kullanım: taslağı bilgi olarak izle, sitede alıntılama.
3. Kamuya açık ikincil kaynaklara (basın özetleri) dayanan içerik üret —
   taslak metnine değil, haberlere atıfla.

### Resmî kaynak taraması (kamuya açık yayın var mı?)

| Kaynak | Sonuç |
|---|---|
| `tarimorman.gov.tr/SYGM` duyuruları | 2026 taslağı için kamuya açık yayın bulunamadı |
| `tarimorman.gov.tr/SYGM/Belgeler/Havza HİE-Sunumlar/Su Kanunu Taslağı.pdf` | 200, ama **Last-Modified 31 Eki 2019** — ESKİ taslak (hâlen izlediğimiz hedef) |
| `tarimorman.gov.tr/SYGM/Belgeler/Su Kalitesi HİE Haber 2019/Su Kanunu Taslağı.pdf` | 200, Last-Modified 9 Nis 2019 — ESKİ |
| mevzuat.gov.tr / TBMM kanun teklifleri | Nisan 2026 taslağı için kayıt bulunamadı (henüz TBMM'ye sevk edilmemiş; hedef "2026'da yasalaşma") |

TR-IP engeli şüphesi: **YOK.** Bu fazda engellenen istek olmadı; tüm
adaylar sunucudan 200 döndü. Bulunamama sebebi erişim engeli değil,
belgenin kamuya açık yayımlanmamış olması.

## İzleme hedefi önerisi (HAZIRLANDI — UYGULANMADI)

Mevcut satır (`izleme/hedefler.conf` s.16) 2019 sürümünü izliyor; Nisan
2026 taslağı ayrı bir belge olduğu için bu hedef **yeni taslağı asla
göremez**. Bu, F4-8'in asıl bulgusudur.

Önerilen değişiklik — üç aday, hiçbiri uygulanmadı:

```conf
# (A) MEVCUT — 2019 sürümü; kalsın (tarihsel değişim yakalar)
su-kanunu-taslak-pdf      | K4 | pdfhead | https://www.tarimorman.gov.tr/SYGM/Belgeler/Havza%20H%C4%B0E-Sunumlar/Su%20Kanunu%20Tasla%C4%9F%C4%B1.pdf

# (B) ÖNERİ — SYGM mevzuat/duyuru sayfası: 2026 taslağı KAMUYA açıldığında
#     ilk burada görünür. HTML izleme, hukuki kısıt yok.
sygm-duyurular            | K4 | html    | https://www.tarimorman.gov.tr/SYGM

# (C) ÖNERİ — TBMM kanun teklifleri zaten izleniyor mu kontrol edilsin;
#     taslak TBMM'ye sevk edildiğinde asıl kamuya açık metin orada doğar.
```

Oda kopyasının (samsuntso URL) izleme listesine EKLENMESİ önerilmiyor:
(i) yayım kısıtına aykırı yayımlandığı için her an kaldırılabilir → 404
gürültüsü, (ii) hukuki değerlendirme yapılmadan sisteme yerleştirmek
doğru değil.

## Kanıt dosyaları

- `cikti/denetim/faz-j/aday-samsuntso.pdf` — indirilen kopya (gitignore'lu,
  depoya girmez; kullanıcı incelemesi için yerelde duruyor).
