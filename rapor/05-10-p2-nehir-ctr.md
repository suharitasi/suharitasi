# RAPOR — P2 Nehir Sıçraması: Title ≤60 + İç-Bağ Ağı (05.10.2026)

Brief: `cikti/brief/2026-10-05T0840-p2-nehir-ctr-duzeltilmis.md`
(özgün: `…-p2-nehir-ctr.md`; 1 ENGEL → mekanik tamamlama → 1 UYARI, iş sürdü).
Kaynak bulgular: `rapor/05-10-odul-ustu-denetim.md` S1+S2.

## Brief-denetçi notu (uyarı — iş sürdü)
- [T1] `rapor/05-10-p2-nehir-ctr.md` denetim anında yoktu; bu dosyadır.

## Ne değişti

1. **Nehir title deseni — uzunluk-farkında zincir (≤60 krk):**
   - `{ad} Hangi Akarsuyun Kolu, Nereye Dökülür? | Su Haritası`
   - sığmazsa `{ad} Hangi Akarsuyun Kolu? | Su Haritası`
   - sığmazsa `{ad} Nerede? | Su Haritası`
   - Kolu verisi olmayan nehirlerde: `{ad} Nerede ve Nereye Dökülür?` →
     `{ad} Nerede, Nereye Dökülür?` → `{ad} Nerede?` (uy durma yasağı korunur;
     "kolu/dökülür" yalnız DOLU veriden — değişmedi).
   - **Kalıcı kapı:** hiçbir aday ≤60 değilse `throw` → build düşer (>100
     sınırı → >60'a çekildi).
2. **Havza title deseni aynı mantık:** `{havza} Su Rezervi ve DSİ İzinleri` →
   `{havza} Su Rezervi`; yıl parantezi title'dan çıktı (sayfa içeriğinde kalır).
3. **Nehir kardeş bağı 2 → 8** ("İlgili Havza Varlıkları" tablosu).
4. **Tek sayfa title'ları:** `/havzalar/` (84→57), `/veri/` (61→54),
   `/nerede-su-cikar/` (93→58), `/veri/raporlar/<dönem>/` (68→54; kalıcı kapı
   ile dönem etiketi korunur).

## Ölçümler (kanıt)

- **title-uzun: 123 → 0** (`node arac/seo-audit.mjs dist`).
- Örnek title'lar (krk):
  - 60 · `Gökırmak Hangi Akarsuyun Kolu, Nereye Dökülür? | Su Haritası`
  - 59 · `Mustafakemalpaşa Çayı Nerede, Nereye Dökülür? | Su Haritası`
  - 56 · `Sakarya Havzası Su Rezervi ve DSİ İzinleri | Su Haritası`
  - 47 · `Batı Karadeniz Havzası Su Rezervi | Su Haritası`
  - 58 · `Arazimde Su Çıkar mı? Parsel Bazlı Sorgulama | Su Haritası`
- **İç-bağ (D3):** `/nehirler/gokirmak/` → 4 link/3 kaynak sayfa iken
  **9 link / 8 kaynak sayfa** (havza + 5 kardeş nehir + hub + kastamonu).
- **Değişmeyenler (D4):** build 1190 sayfa EXIT 0 · FAQPage 509 (sabit) ·
  og:title 1107 dosya · H1'ler değişmedi (title/og ayrı alan) · JSON-LD
  dokunulmadı · sayfa/sitemap sayısı korundu.

## Ölçüm planı (D1 — beyan değil)

"CTR artacak" DENMEZ. 2-4 hafta sonra `gsc_quick_wins` + `gsc_ctr_opportunities`
ile nehir ailesi (gökırmak/eşen/kelkit/hezil/zap…) karşılaştırılır; artış
yoksa kök neden analizi (AIO / sıralama) yapılır ve dürüstçe raporlanır.

## DUR / kullanıcı

- **KULLANICI ONAYI BEKLİYOR:** canlı SERP görünümü (İş kapanış kuralı).
- IndexNow: 125 URL bildirildi (HTTP 200) — `cikti/indexnow-p2-urls.txt`.
- Canlı doğrulama: `surum.json=bee9e31`; örnek başlıklar canlıda yeni;
  `site-saglik --hizli` **GENEL YEŞİL** (0 kırmızı · 0 sarı).

## Öz-eleştiri ("daha iyisi olabilir miydi")

- Gökırmak title'ı tam 60 krk sınırında; pixel tabanlı kırpma ölçülmedi
  (char ölçüsü vekil kriterdi). Sonraki turda SERP genişliği canlı araçla
  doğrulanabilir.
- Kardeş bağı "ilk 8" alfabetik koleksiyon sırasına bağlı; ileride
  "en yakın/önemli" sıralama veri gelirse gerekçeli iyileştirilebilir.
- `soru-baslik-yok` 4 sayfa bilinçli olarak P5'e (hukuk turu) bırakıldı.
