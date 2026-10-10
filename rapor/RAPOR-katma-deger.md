# RAPOR — katma değer brifi (10.10.2026 — sürüyor)

## 0. Brif denetimi, düşman geçişi, amaç özeti
- Brif kopyası: `cikti/brief/20261010T070746Z-katma-deger.md`; denetçi ilk tur: 3 ENGEL (T1: `izleme/SITE-DURUM.md` izlenmeyen durum dosyası; S raporu depo dışı; `rapor/RAPOR-katma-deger.md` üretim hedefi) + 2 UYARI (T1 `rapor/HUKUK-SORULARI.md` üretim; T6 canlı koşul kapısı anılmamış). Düzeltme: yalnız netleştirme eki (silme/daraltma yok) → `…-duzeltilmis.md` TEMİZ (rapor `cikti/denetim/brief/2026-10-10T07-15-17Z.md`).
- **Düşman geçişi D1–D4:** D1 çelişen şart: KARARLAR §9 (H1 yok) ↔ 2.9; §5 ↔ 2.6/3.6; §4 ↔ 1.4; §10/§11 ↔ 1.5/3.5/4.6; AY İLKESİ ↔ K-1; §14 ↔ tek ajan; EN reddi ↔ 2.8 → sahibe soruldu, 8 kararla çözüldü (DURUM). D2 geçemeyecek test: "her formun … beyanı uyumlu" (K.Ö.5) KV içeriği görülemeyince tam sınanamaz → KV abone sayısı "bakılamadı" diye yazılır; "Lighthouse ortancası düşmez" (K.Ö.7) yerel ölçüm gürültülü → aynı makinede önce/sonra 3'er koşu. D3 boş referans: brifteki "~/denetim/S_rapor.md" gerçek yolu `~/denetim/suharitasi/S_rapor.md` (bulundu); `/su-hukuku/` KARARLAR §26'da "rota kapanışı" denmişti ama dist'te var (doğrulandı: sayfa yayında). D4 ölçülemez ifade: "hedef kitlenin diliyle değişsin" → ölçüt: 3.3'teki sözcük listesinin dist'teki sayısı 0; "menü en çok altı madde" → sayılır.
- **Amaç özeti:** amaç = yayındaki güven kırıcı hataları (tahmin, veri tutarsızlığı, kalıntı, sentetik veri, beyan uyumsuzluğu) gidermek, ince/örtüşen sayfaları budamak, ana sayfayı tek kitleye indirmek, yeni rehber/araç/veri değeri eklemek. Dokunulmazlar: diğer projeler, DNS, ücretli servis, veri silme; hukuki metin onaysız main'e girmez. Bitti-tanımı: 10 kabul ölçütü. Kanıtlar: build çıktısı, öz denetim (konsol 0/kırık 0), Lighthouse 3-koşu, izleme yeşil, ekran görüntüleri, bağımsız inceleme.

## 1. Okunan kural dosyaları
CLAUDE.md · BRIEF.md · DESIGN.md · KARARLAR.md · CODE-FREEZE.md · ODUL-USTU.md ("Korunacaklar") · VIZYON.md · .claude/commands/geo-audit.md, seo-audit.md, site-tarama.md · docs/ACIK-VERI-KAYNAKLARI.md, GSC-FAZ1-2-BASELINE.md, NEHIRLER-SERP-TESHISI.md · SIRADAKILER.md · izleme/SITE-DURUM.md · ~/denetim/suharitasi/S_rapor.md. (Alt dizinlerde başka CLAUDE.md yok; global ~/.claude/CLAUDE.md yok.)

## 2. Bulgu doğrulama tablosu (brif bulgusu → doğru / yanlış / kısmen / doğrulanmadı)
(Aşama 0'da dolduruldu; DURUM-katma-deger.md "Aşama 0 — keşif bulguları" ile aynı kanıtlar.)
| Bulgu | Sonuç | Kanıt |
|---|---|---|
| 1.1 uydu ufku geçmişte (son ölçüm 2026-03, projeksiyon 04–09) | doğru | `data/tahmin/kuraklik-projeksiyonu.json` son_gozlem 2026-03 |
| 1.1 "6 ay sonra" = trend+mevsim; Asi trend −0,8 vs sayfa −16,7 | doğru (mekanizma) | tahmin-uret.py:109 `slope*(…)+mevsim[hedef_ay]`; dist/tahmin tablo |
| 1.1 baraj tahmini eksi (Marmara −21,25; K.Ege −22,79) ve hesap hatası | doğru | dist/tahmin tablo 1 (16,61; −0,862; −21,25) |
| 1.1 "Son 60 gün" ↔ 84 günlük seri | kısmen | metin "Son 60 gün" var; API serisi uzunluğu Aşama 1'de ölçülecek |
| 1.1 Konya Kapalı +0,98 ↔ "Kritik düşüş" | kısmen | etiket yıllık eğilimden (egilim-sinif.js ESIK −1,5 cm/yıl), son değişimden değil; açıklama eksik |
| 1.1 ana sayfa −5,43 cm kaynağı | yanlış (kaynak var) | KuraklikAlarmi.astro ← grace-turkiye.json (2026-03) |
| 1.1 tazelik 120 gün eşiği | incelenecek | guncellik.js |
| 1.2 gündem beş havza %50,7 ve en yeni ilan 2014 | incelenecek (gundem.js yagisDegisim: CHIRPS havza = TR ortalaması kopyası → aynı değer olası) | chirps-cek.py:138-150 (S raporu c) |
| 1.3 risk endeksi tahsis boş, baraj 8 havzada yok | incelenecek | havza-risk.js |
| 1.4 iklim tek nokta (bbox merkezi) | doğru | nasa-power-cek.mjs:26 bboxMerkez |
| 1.5 form beyanları | doğru | DURUM 1.5 tablosu |
| 1.6 "gönderim servisi bağlandığında" e-posta toplama | doğru | takip.js → KV 730 gün |
| 1.7 kalıntılar | doğru (sutohum 0) | DURUM 1.7 sayıları |
| 1.8 "Hakkari'da", "QR kodhttps", "Aşi" | doğrulanmadı (worktree build'de 0) | grep |
| 1.8 diğer yazım | doğru | DURUM 1.8 |
| 1.9 ilçe ±%15 | doğru | ilce-morfoloji-uret.py |
| 1.11 hatalı göl/nehir kayıtları | doğru | dist slug listesi; kaynak adları |
| 1.12 Wikidata yok | yanlış | Q141582057 API 200 |
| 0.3 depoda README/lisans yok | doğru | ls |
| 0.6 OpenAPI 3.0.3/2 yol ↔ 3.1.0/13 yol, lisans farklı | doğru | dist/api/v1/openapi.json, dist/veri/openapi.json |
| 0.6 ürün adının üç biçimi | kısmen (İndeksi 107, Veri Standardı 5, Hidro-Legal 1 sayfa) | grep dist |
| 0.6 e-posta her yerde aynı | doğru (tek adres, 5 yer) | grep |
| 3.1 ana sayfa ~15 bölüm 12 H2, harita yok | doğru | mobil ölçüm h2=12; 22,8 ekran |
| 2.9 /harita/ H1 yok | doğru (kullanıcı kararıyla değişti) | mobil ölçüm h1=[] |
(Devamı Aşama 1–4 ilerledikçe doldurulur.)

## 3. Kalem kalem durum
(Her numaralı kalem için yapıldı / yapılamadı (neden) / onay bekliyor — iş ilerledikçe.)

## 4. sudo ile yapılanlar
- `sudo /root/site-tools/gitleaks detect` (salt okuma, rapor scratchpad'e; değerler --redact).

## 5. Dış servislere istekler (görev kapsamında)
- mevzuat.gov.tr (167, 5326, 2577, 2942, 5686 PDF), resmigazete.gov.tr (27.11.2025 fihristi + 4 tebliğ sayfası), gib.gov.tr (oran sayfası — JS, okunamadı), wikidata.org (1 GET), zenodo.org API (1 GET), github.com (1 HEAD), karararama.danistay.gov.tr (20 GET, 2 sn aralık), karararama.yargitay.gov.tr (1 GET, erişilemedi), Google Search Console API (2 sorgu — K-2 tabanı), npm registry (npm ci).

## 6. Sınanmayanlar / bakılamayanlar
- Cloudflare paneli (Pages, KV içerikleri, Redirect/WAF) görülmedi; KV abone sayısı bakılamadı.
- GİB yıl-yıl yeniden değerleme tablosu okunamadı (JS); 2009–2024 tebliğleri çekilmedi.
- Yargıtay karar arama bu ağdan erişilemiyor.
