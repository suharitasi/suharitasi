# Bellek Logu → Sağlık Bekçisi (GECE PAKETİ v2 — Bölüm C)

*2026-07-21*

## Ne yapıldı
1. **Bellek logger** (`arac/bellek-log.sh`): her 10 dk `free -m` ölçümünü tek
   satır olarak `~/bellek-log.txt`'ye yazar — `swap_used_mb=N mem_avail_mb=M`.
   `set -euo pipefail`; alanlar awk ile kesin kolondan (Swap $3=used,
   Mem $7=available); sayısal değilse HATA satırı + exit 1 (sessiz yanlış
   satır üretmez). Log ~2000 satırla sınırlı (atomik tail+mv, ≈2 hafta).
2. **Cron** (idempotent): `*/10 * * * *` — mevcutsa eklenmez (kontrol:
   `crontab -l | grep -qF arac/bellek-log.sh`).
3. **Bekçi eşiği** (`saglik-bekcisi.sh` (e) bölümü): PENCERE-tabanlı —
   - SON 6 ÖLÇÜMÜN TAMAMINDA swap used > 2048MB, **veya**
   - SON 3 ÖLÇÜMÜN TAMAMINDA available < 500MB
   → UYARI-SAGLIK.md'ye `🔴 bellek eşiği — sunucu yükseltme değerlendirilmeli`
   satırı + pipeline.log + exit 1. **Tek ölçüm ASLA alarm üretmez**; pencere
   dolmamışsa (soğuk başlangıç) alarm yok (yanlış alarm koruması).

## "DURUM.md" yorumu (şerh)
Brief "DURUM.md'ye 🔴" diyor. Repodaki tek DURUM.md `izleme/DURUM.md`'dir ve
su-izleme her koşuda onu **yeniden yazar** → oraya yazmak alarmı ilk su-izleme
koşusunda siler (sessiz-hata anti-deseni). Bu yüzden alarm, bekçinin KALICI ve
kullanıcının gördüğü mevcut alarm kanalına yazıldı: **UYARI-SAGLIK.md** (durum
düzelince otomatik silinir). Emoji yalnız iç ops dosyasında (site içeriği değil).

## Test (gerçek loga dokunulmadı — BELLEK_LOG env ile kopya)
| Senaryo | Beklenen | Sonuç |
|---|---|---|
| swap used >2048MB × son 6 | ALARM | 🔴 ALARM ✓ |
| available <500MB × son 3 | ALARM | 🔴 ALARM ✓ |
| sağlıklı log | alarm yok | YOK ✓ |
| tek ölçüm aşımı (5 normal + 1 yüksek) | alarm yok | YOK ✓ |

Gerçek `~/bellek-log.txt` sentetik testte dokunulmadı (izole kopya + env).
`bash -n` sözdizim: her iki script temiz.

## Not
- İlk gerçek alarm ancak log ≥6 (swap) / ≥3 (avail) ölçüm biriktirdiğinde
  mümkün; logger yeni kuruldu (ilk ölçüm 21:48 UTC). Cron 10 dk'da bir
  biriktirir; eşik penceresi ~1 saatte (6 ölçüm) dolar.
- Bekçi zaten 07:00 UTC cron'da; bellek denetimi mevcut (a)-(d) denetimlerine
  eklendi, ayrı cron gerekmez.
