# PERSONA + ÇATI TÜRETME RAPORU
*2026-07-21 · ODUL-USTU FAZ 7 AŞAMA 0 · uydurma yasağı denetimli*

## 1. Kaynaklar (yalnız doğrulanmış)
- `data/arsiv/mevzuat/su-verimliligi-yonetmeligi-20241227.htm` — gövde metni
  (yükümlülük maddeleri makine-okunur).
- `data/lead/nace-ek2.json` — Ek-2 NACE listesi BOŞ (`liste: []`).
- Mevcut 9 rehber + Meysu vakası başlıkları (persona→içerik eşlemesi).

## 2. Süre aritmetiği (yönetmelik metninden; hesap burada, sayfaya kesin tarih olarak yalnız "dogrulandi" olanlar girer)
| Yükümlülük | Metin dayanağı | Hesap | Sonuç | Durum |
|---|---|---|---|---|
| Yeşil su verimliliği belgesi son başvuru | md.(3) "en fazla beş yıl içinde" + yürürlük 27.12.2024 | 2024-12-27 + 5y | **2029-12-27** | dogrulandi |
| Uzatma (iş termin planı + Bakanlık uygun görüşü) | md.(4) "en fazla yedi yıla uzatılabilir" | 2024-12-27 + 7y | 2031-12-27 | dogrulandi (koşullu) |
| Belge geçerlilik | gövde "beş yıldır" | — | 5 yıl | dogrulandi |
| Ek-1 sektör bazında sistem kurulum süresi | md. "Ek-1'de belirlenen süre" | — | — | **dogrulanamadi** (Ek-1 taranmış ekte; metin katmanı yok) |

**Yürürlük 27.12.2024:** RG tarihi (dosya adı 20241227 + json künyesi + gövde
"yayımı tarihinde yürürlüğe girer"). Kesin RG madde numarası taranmamıştır ama
tarih üç bağımsız kaynakta tutarlı.

## 3. Persona doğrulama izi
"dogrulandi" son tarih YALNIZ yönetmelik md.(3)'te ADIYLA sayılan kategorilerde:
- **Sanayi/OSB yatırımcısı** ← "organize sanayi bölgeleri, serbest bölge,
  endüstri bölgeleri" (2029-12-27).
- **Konaklamalı turizm (250 oda+)** ← "250 oda ve üstü kapasiteli konaklamalı
  turizm işletmeleri" (2029-12-27, öneri).
- **Üniversite kampüsü** ← "üniversite kampüsleri" (2029-12-27, öneri).
- **Havalimanı** ← "havalimanları" (2029-12-27, öneri).

"dogrulanamadi" (sayfaya kesin tarih GİRMEZ):
- Sondaj/arıtma, Gayrimenkul, Ziraat/kooperatif, Enerji (HES/JES): süreç/proje
  bağlı; sabit yasal son tarih yok → yükümlülük anlatılır, tarih verilmez.
- Site/AVM: md.(3) listesinde açıkça YOK; kapsam Ek-2'ye bağlı.
- Maden, Gıda-içecek: Ek-2 NACE'e bağlı olabilir ama Ek-2 listesi doğrulanmadı
  → yeşil-belge yükümlülüğü "Ek-2 doğrulanınca netleşir" kaydıyla koşullu.

## 4. NACE Ek-1/Ek-2 — BLOK (uydurma yasağı)
- Gövde HTML Ek-1/Ek-2/NACE'yi **anar** ama listeleri İÇERMEZ; ekler ayrı PDF'te.
- Ekler PDF taranmış/görüntü-tabanlı (pdftotext yalnız "Ekleri Film 20-N"
  filigranını verir; NACE tablosu görüntü içinde). OCR olmadan güvenilir
  çıkarım yok.
- **Tahmini NACE listesi ÜRETİLMEDİ.** persona.json `naceEk2.durum = "liste beklemede"`.
- **KULLANICI GÖREVİ:** Ek-2 NACE'in makine-okunur kaynağı (RG makine-okunur
  sürüm / doğrulanmış OCR / resmî tablo) verilince NACE-özgü personalar eklenir.
  → bu, AŞAMA 0 md.2a'nın "DUR, kullanıcıdan ek belge URL'i iste" kapısıdır;
  genel personalar bundan bağımsız üretildi (madde silinmedi, isimle raporlandı).

## 5. Çatı diff (ODUL-USTU.md)
- Eklendi: **FAZ 7 — SONUÇ ZİNCİRİ VE PAZARLAMA** (zincir 3 halka + sektör
  kapıları + risk/ceza [APILEX] + "Kuyu Çıkar Mı" ayrı-faz notu + 7 pazarlama
  kanalı).
- Eklendi: Faz numaraları SABİT; uygulama sırası **1→7→2→3→4→5** (6 paralel).
- Eklendi: DİL NOTU (TBB-çekingen dil kaldırıldı; profesyonel/sonuç-odaklı serbest).
- Güncellendi: Faz 1 DURUM=TAMAM; açık kararlarda /deneyim/ + harita-3d KAPANDI;
  Faz 7 rota adı + risk-bloğu dili AŞAMA 1 onayına bırakıldı.

## 6. AŞAMA 0 BİTTİ kontrolü
- [x] persona.json (11 persona; 4 doğrulanmış tarih; NACE bloğu işaretli)
- [x] rapor/sorgu-haritasi.md (hacim uydurmadan; öneri etiketli)
- [x] rapor/geo-nabiz-plan.md (20 soru; yöntem A/B; ücretli yalnız not)
- [x] rapor/persona-turetme.md (bu belge)
- [x] ODUL-USTU FAZ 7 çatı diff'i
- [ ] Commit + push (bu rapordan sonra)

**AÇIK / KULLANICIYA:** Ek-2 NACE makine-okunur kaynağı (bkz. §4).
