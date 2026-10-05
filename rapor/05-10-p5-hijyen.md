# RAPOR — P5 Hukuk & Hijyen: Nötr CTA Dili + Geniş Tarama + Depo (05.10.2026)

Brief: `cikti/brief/2026-10-05T0930-p5-hijyen-duzeltilmis.md`
(özgün + düzeltilmiş; 2 ENGEL → mekanik tamamlama → 2 UYARI).
Kaynak: `rapor/05-10-odul-ustu-denetim.md` S4 + S10 + katma değer #6.

## Brief-denetçi notu (uyarılar — iş sürdü)
- [T1] `arac/tek-seferlik/` ve `rapor/05-10-p5-hijyen.md` denetim anında
  yoktu; ikisi de bu turun çıktısıdır.

## 1) TBB nötr CTA dili
- `AcilDestekBar.astro` · `CtaBlok.astro` · `hizli-danisma.astro`:
  **"Hemen ara" → "Telefon"**; tel linki/numara/`data-olay` DEĞİŞMEDİ.
- `KurumsalHizmetler.astro`: "Zaman kazanın:" nötrleştirildi ("Haftalarca veri
  toplamak yerine…").
- Ölçüm: dist'te **"Hemen ara" 1109 dosya → 0** · `>Telefon<` 1109 dosya ·
  "Zaman kazanın"/"kazanın" **0**. Yeni hukuki iddia/metin YOK.

## 2) Geniş tarama — `arac/hukuk-tarama.sh` (yeni, repo-commit)
- Kapsam: **tüm dist HTML** (1190 sayfa) yasak vaat dili + 7 hukuk ailesinde
  disclaimer varlığı. Bulgu sayısı + exit kodu.
- Sonuç: **1190 sayfa · 0 bulgu · exit 0**.
- **Negatif test (D3):** kasten eklenen bulgu → `exit=1` + 2/1 bulgu satırı;
  silince → `exit=0`. Kırmızı yol kanıtlı (ilk ölçümdeki "exit 0" boru
  artefaktıydı; doğru ölçümle 1/0).
- **Süreklilik:** `saglik-bekcisi.sh`e (i) maddesi olarak bağlandı
  (günlük 07:00; bulguda 🔴 + Telegram). Gerekçe: `site-saglik.mjs` çekirdeğine
  riskli dokunuş yerine kanıtlı bekçi deseni.

## 3) Depo hijyeni
- 12 tek-seferlik Temmuz scripti → `arac/tek-seferlik/` (git mv; kod aynı,
  yalnız yol). Kökte `*.mjs` yalnız `astro.config.mjs`.
- `BACKUP-AJAN-…` (izlenen) → `arsiv/`; `BACKUP-KESIF-…` → `arsiv/`;
  `.gitignore` tek kural: `BACKUP-*/`. Kökte `BACKUP-*` **0**.
- `public/_redirects` www notu güncellendi: panel kuralı **KURULDU**,
  md24 yeşil (bayat "SARI verir" ifadesi düzeltildi).

## 4) Kanıtlar
- Build **EXIT 0 · 1190 sayfa**; grep sayımları; tarayıcı çıktısı; bekçi
  koşumu exit 0 + yeni madde sessiz (temiz dist).
- Bekçi notu: bu koşumda **bizden bağımsız** geçici swap uyarısı üretti
  (09:20 `swap=2095MB > eşik` — ağır Lighthouse/Chrome turları; şu an
  `1,4Gi`). P5 ile ilgisi yok; şeffaflık için kayıtta.
- **CANLI (commit `8402d5e`):** `surum.json` yeni SHA · ana sayfa ve
  `/mevzuat/167/madde-8/` (CtaBlok) canlıda "Hemen ara" **0** / "Telefon"
  mevcut · `site-saglik --hizli` **YEŞİL**.

## KULLANICI ONAYI BEKLİYOR
Görünür CTA metni değişti — canlı görsel/içerik onayı kullanıcıda
(İş kapanış kuralı).

## Öz-eleştiri ("daha iyisi olabilirdi")
- `kazanın` kalıbı geniş: su sitesinde "kazan" (boiler) geçen bir içerik
  doğarsa yanlış-pozitif olabilir → bulgu insan incelemesine düşer (hata değil).
- Tarama dist sonrası koşar; `--hizli`ye bağlanmadı (bekçi/günlük yeterli).
- `arsiv/BACKUP-*` izlenmiyor (bilinçli; ignore tek kural) — kalıcı silme
  veya repoya alma ayrı karar.
