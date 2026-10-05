# RAPOR — P3 Damga & Tazelik Turu (05.10.2026)

Brief: `cikti/brief/2026-10-05T0900-p3-tazelik.md` (denetçi: ENGEL yok, 5 uyarı).
Kaynak bulgular: `rapor/05-10-odul-ustu-denetim.md` K3 + S3 + S5 + S7.

## Brief-denetçi uyarıları (iş sürdü)
- [T1] `arsiv/resmi-gazete/` (rota yazımı), `surum.json` (üretim çıktısı),
  `rapor/05-10-p3-tazelik.md` (bu dosya) — bağlam netleştirildi.
- [T6] git kilidi + canlı koşul kapıları: commit'ler `flock`/git-kilit ile;
  canlı doğrulama deploy sonrası curl + `--hizli` ile yapılır.

## 1) CHIRPS tazeleme (K3) — KAPANDI

- **Önce:** son ay `2026-06` (künye 04.08.2026) — 3 ay bayat.
- **Ortam:** `.venv`'e `shapely` eklendi (netCDF4 zaten vardı); 2026 önbellek
  dosyası silinip resmî kaynaktan yeniden indirildi (log kanıtı).
- **Sonra:** `2017-01 → 2026-08` · **116 ay** · künye `2026-10-05T08:40:29Z`
  (`data/canli/chirps.json`). Eylül verisi kaynakta henüz yayımlanmadı
  (CHIRPS gecikmesi ~2-3 hafta) — dürüst durum.
- **Süreklilik:** `arac/chirps-guncelle.sh` (çıkış kaydı + tazelik kapısı:
  son ay < (bu ay − 2) ise UYARI + exit≠0 + Telegram; commit teyitli push)
  + cron `40 4 5 * *` (yedek: `izleme/crontab-onceki-20261005-p3.txt`,
  diff temiz).

## 2) dateModified (S3) — KAPANDI (kapsam ölçülü)

- `guncellik.js`e üç kaynak eklendi: `mevzuat` (mevzuat-surum.son_kontrol),
  `rgArsiv` (isletme-sahalari + ek üretim tarihi), `emsal`
  (emsal-kararlar.olusturma). Tarihler yalnız veri künyesinden (uydurma yok).
- Şemaya bağlandı: `/mevzuat/` (470 dosya), `/yeralti-suyu/` (81), `/emsal-kararlar/`
  (1), `/arsiv/resmi-gazete/` (1), `/tahmin/` (1) + `/mevzuat/degisiklikler/`.
- **Sitemap:** lastmod'lu URL **586 → 1.072 / 1.104**. Kalan 32 URL tarihsiz
  (ör. harita/ajan erişimi gibi veri künyesi olmayan yüzeyler) — dürüst sınır.

## 3) Mevzuat radarı dürüstlüğü (S5) — KAPANDI

- `mevzuat-radar.py`: kısmi hatada `hata_sayisi` + `erisilemeyenler` durum
  dosyasına yazılır, `exit 1` döner (sarmalayıcı zaten Telegram'a taşır).
- `/mevzuat/degisiklikler/`: hata > 0 ise "Uyarı: N kaynak erişilemedi …
  önceki kayıt korundu" satırı görünür (koşullu).
- Kanıt: `--kuru` gerçek koşum exit=0 (9 mevzuat, 0 değişiklik);
  `py_compile` temiz. SINIR: hata senaryosu canlıda henüz tetiklenmedi —
  ilk gerçek kaynak hatasında Telegram + satır birlikte görülecek (izleme notu).

## 4) `/api/loglar` hız sınırı (S7) — KAPANDI

- `rateLimit` yetki kontrolünden ÖNCE (kaba kuvvet yüzeyi kapatıldı).
- Test: **16/16 geçti** (`node arac/test/loglar-fn.test.mjs`).

## 5) era5 boş verisi

- `src/` içinde tüketici **0** (grep). Veri SİLİNMEDİ; "kullanılmıyor"
  notu bu raporda; arşiv/silme kararı kullanıcıya (DUR-1).

## 6) Rozetler ([SERDAR-HUKUK] onayıyla — §62)

- "CERN Tescilli" → "Zenodo DOI'li Bilimsel Veri (CERN altyapısı)";
  "Google & AI Onaylı" → "Wikidata'da Kayıtlı Varlık (Q141582057)";
  KanitBandi açıklamaları hizalandı. Build sonrası dist'te doğrulandı.

## Kanıt özeti

chirps 116 ay + indirme logu · cron diff temiz · dateModified sayımları ·
sitemap 1072/1104 · radar kuru koşum · loglar 16/16 · build EXIT 0 · 1190 sayfa.

**Canlı doğrulama (commit `017d25f`):** `surum.json` yeni SHA · rozetler yeni
metinle canlı · `/mevzuat/167/madde-8/` → `"dateModified":"2026-10-04"` canlı ·
`site-saglik --hizli` **GENEL YEŞİL** (0 kırmızı · 0 sarı).

## Kullanıcı kalemleri

- Canlı doğrulama (bu commit'in deploy'u) — İş kapanış kuralı.
- era5 arşiv kararı; emsal ilk otomatik koşu doğrulaması 03.11.2026.

## Öz-eleştiri ("daha iyisi olabilirdi")

- Mevzuat ailesinde 470 dosyada dateModified var; kalan 2-3 sayfa
  (endeks/sayaç) veri künyesiz — bilinçli dışarıda, ileride tek tek karar.
- Sitemap'te kalan 32 tarihsiz URL için "tarih uydurma" yerine dürüst
  boşluk korundu; yeni veri künyesi doğdukça kendiliğinden dolacak.
- Radar hata yolu gerçek olayla henüz kanıtlanmadı (yukarıda şerh).
