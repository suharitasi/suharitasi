#!/bin/bash
# SAĞLIK BEKÇİSİ — pipeline'dan BAĞIMSIZ gözcü (günlük 07:00 UTC).
# baraj/grace scriptlerini ÇAĞIRMAZ; yalnız git log + dosya mtime okur; pipeline
# kendini denetleyemez, bu yüzden ayrı. Sessiz ölümü yakalar: cron durur / veri
# bayatlarsa UYARI-SAGLIK.md + log/pipeline.log satırı üretir, exit 1 döner.
#
# EŞİK GEREKÇELERİ (gerçek mtime kalibrasyonu, 2026-07-20 — sessiz hata denetimi):
#  - baraj "bugün" DEĞİL "son 26s": çekim 15:00 UTC, bekçi 07:00 UTC → sağlıklı
#    dosya bile ~16s eski; takvim-günü kontrolü her sabah YANLIŞ alarm verirdi.
#  - grace canlılığı grace-havza.json DEĞİL durum.json mtime: havza.json yalnız
#    GSFC yeni sürüm yayınlayınca (~aylık) değişir → 8-gün tazelik aylarca yanlış
#    alarm. durum.json HER haftalık koşuda (başarı/değişiklik-yok/hata) yeniden
#    yazılır → "cron gerçekten koştu mu" doğru sinyali.
set -euo pipefail
KOK=/home/suha/projeler/suharitasi
cd "$KOK" || exit 1
mkdir -p "$KOK/log"
LOGP="$KOK/log/pipeline.log"
UYARI="$KOK/UYARI-SAGLIK.md"
NOW=$(date -u +%s)
SORUN=""
ekle(){ SORUN="${SORUN}- $1"$'\n'; }

# (a) son commit yaşı > 26s → pipeline commit atmıyor olabilir
CTS=$(git log -1 --format=%ct 2>>"$LOGP" || echo 0)
if [ "$CTS" -eq 0 ]; then
  ekle "git log okunamadı (repo erişilemez?)"
else
  CS=$(( (NOW - CTS) / 3600 ))
  [ "$CS" -gt 26 ] && ekle "son commit ${CS} saat önce (>26s) — pipeline commit atmıyor olabilir"
fi

# (b) baraj.json tazeliği (günlük 15:00 UTC; eşik 26s — yukarıdaki gerekçe)
if [ -f data/canli/baraj.json ]; then
  BS=$(( (NOW - $(date -u -r data/canli/baraj.json +%s)) / 3600 ))
  [ "$BS" -gt 26 ] && ekle "baraj.json ${BS} saat güncellenmedi (>26s) — günlük baraj çekimi durmuş olabilir"
else
  ekle "data/canli/baraj.json YOK"
fi

# (c) grace canlılığı: durum.json her koşuda yazılır (haftalık Pzt; eşik 8 gün)
if [ -f data/arsiv/grace/durum.json ]; then
  GS=$(( (NOW - $(date -u -r data/arsiv/grace/durum.json +%s)) / 86400 ))
  [ "$GS" -gt 8 ] && ekle "GRACE cron ${GS} gündür koşmadı (durum.json bayat, >8g)"
else
  ekle "data/arsiv/grace/durum.json YOK"
fi

# (d) su-izleme canlılığı: DURUM.md HER koşuda yeniden yazılır (05:30+16:00 UTC).
#     eşik 14s gerekçe: 16:00→05:30 arası en uzun boşluk 13.5s; 05:30 koşusu
#     kaçarsa 07:00 bekçisinde DURUM.md ~15s eski görünür → alarm. Sağlıklı
#     işleyişte 07:00'de DURUM ~1.5s taze. (grace durum.json deseniyle aynı
#     mantık: "cron gerçekten koştu mu" sinyali.)
if [ -f izleme/DURUM.md ]; then
  IS=$(( (NOW - $(date -u -r izleme/DURUM.md +%s)) / 3600 ))
  [ "$IS" -gt 14 ] && ekle "su-izleme ${IS} saat koşmadı (DURUM.md bayat, >14s) — Su Kanunu izleme cron'u durmuş olabilir"
else
  ekle "izleme/DURUM.md YOK — su-izleme hiç koşmamış olabilir"
fi

# (e) bellek eşiği (bellek-log.txt; her 10 dk). PENCERE-tabanlı: tek ölçüm ASLA
#     alarm üretmez. Eşik: SON 6 ÖLÇÜMÜN TAMAMINDA swap used > 2048MB VEYA
#     SON 3 ÖLÇÜMÜN TAMAMINDA available < 500MB. Pencere dolmamışsa (soğuk
#     başlangıç) alarm YOK — yanlış alarm üretme. Env BELLEK_LOG ile test
#     kopyası verilebilir (gerçek loga dokunmadan sentetik eşik testi).
BLOG="${BELLEK_LOG:-$HOME/bellek-log.txt}"
if [ -f "$BLOG" ]; then
  mapfile -t SW < <(grep -o 'swap_used_mb=[0-9]*' "$BLOG" | tail -6 | grep -o '[0-9]*$' || true)
  mapfile -t AV < <(grep -o 'mem_avail_mb=[0-9]*' "$BLOG" | tail -3 | grep -o '[0-9]*$' || true)
  if [ "${#SW[@]}" -eq 6 ]; then
    HEP=1; for v in "${SW[@]}"; do [ "$v" -gt 2048 ] || HEP=0; done
    if [ "$HEP" -eq 1 ]; then ekle "🔴 bellek eşiği — sunucu yükseltme değerlendirilmeli (son 6 ölçümde swap used >2048MB)"; fi
  fi
  if [ "${#AV[@]}" -eq 3 ]; then
    HEP=1; for v in "${AV[@]}"; do [ "$v" -lt 500 ] || HEP=0; done
    if [ "$HEP" -eq 1 ]; then ekle "🔴 bellek eşiği — sunucu yükseltme değerlendirilmeli (son 3 ölçümde available <500MB)"; fi
  fi
fi

# (f) BEKÇİNİN BEKÇİSİ (2026-07-23): site sağlık sistemi kendisi koşuyor mu?
# site-saglik.mjs siteyi denetler ama KENDİ durmasını denetleyemez — bu satır
# onun gözcüsüdür. Eşik 14 saat: cron 07:30 + 19:30 UTC (12 saat arayla), tek
# koşu kaçırılınca değil, İKİ koşu arası pencere aşılınca alarm verir.
SAGLIK_DURUM="$KOK/izleme/state/site-saglik-durum.json"
if [ -f "$SAGLIK_DURUM" ]; then
  # Bozuk JSON sessizce "boş" sayılmasın: python hatası LOGP'ye düşer, SON_KOSU
  # boş kalır ve aşağıdaki dal 🔴 verir.
  SON_KOSU=$(python3 -c "
import json
d=json.load(open('$SAGLIK_DURUM'))
print(d.get('sonBasariliKosu') or '')
" 2>>"$LOGP") || SON_KOSU=""
  if [ -z "$SON_KOSU" ]; then
    ekle "🔴 sağlık sistemi hiç BAŞARILI koşmamış (site-saglik-durum.json'da sonBasariliKosu yok)"
  else
    KOSU_TS=$(date -u -d "$SON_KOSU" +%s) || KOSU_TS=0
    if [ "$KOSU_TS" -eq 0 ]; then
      ekle "🔴 sağlık sisteminin son koşu damgası okunamadı ($SON_KOSU)"
    else
      KS=$(( (NOW - KOSU_TS) / 3600 ))
      [ "$KS" -gt 14 ] && ekle "🔴 sağlık sistemi koşmuyor — son başarılı koşu ${KS} saat önce (>14s)"
    fi
  fi
else
  ekle "🔴 sağlık sistemi koşmuyor — $SAGLIK_DURUM YOK (hiç koşmamış)"
fi

if [ -n "$SORUN" ]; then
  printf '# SAĞLIK BEKÇİSİ UYARISI\n\n%s\n\n%s' "$(date -u)" "$SORUN" > "$UYARI"
  printf '%s' "$SORUN" | while IFS= read -r s; do
    [ -n "$s" ] && echo "[$(date -u +%FT%TZ)] UYARI(saglik): ${s#- }" >> "$LOGP"
  done
  echo "SAĞLIK UYARISI oluştu → $UYARI"
  exit 1
fi

# sorun yok: eski uyarı dosyası varsa temizle (durum düzelmiş)
[ -f "$UYARI" ] && rm -f "$UYARI"
echo "sağlık OK (commit ${CS:-?}s, baraj ${BS:-?}s, grace ${GS:-?}g, su-izleme ${IS:-?}s)"
exit 0
