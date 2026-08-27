# JRC yüzey suyu — ARŞİVE ALINDI (27.08.2026, K7-E)

**Neden.** `jrc-yuzey-suyu.json` 25/25 havzada
`"durum": "islenmedi (tile bazli hesap gerekir)"` — yani dosya hiçbir
zaman veri taşımadı. Ölçüm (27.08):

- `src/` içinde **hiç import edilmiyordu**. `/ilce-sorgu/` sayfasındaki
  "Yüzey Suyu" bileşeni bu dosyadan değil `Math.min(1, duz_oran*1.5)`
  ile arazi morfolojisinden üretiliyordu (K7 ile kaldırıldı).
- `arac/jrc-isle.py` üreticisini çağıran cron, pipeline ya da sağlık
  kalemi **yok**.
- `izleme/*.json` yapılandırmalarında referansı **yok**.

**Sonuç.** Ölü yüzey kapatıldı; veri ve üretici silinmedi, buraya
taşındı. JRC yüzey suyu gerçekten işlenecekse (tile bazlı hesap) ayrı
bir iş olarak briflenir ve `arac/` altına geri alınır.

Kaynak kayıt: `rapor/26-08-denetim-KARARLAR-BEKLEYEN.md` K7-E ·
`rapor/27-08-kapatma.md`.
