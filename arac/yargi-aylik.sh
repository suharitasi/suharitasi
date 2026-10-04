#!/bin/bash
# Yargı/emsal aylık hat sarmalayıcısı (04.10.2026 tam denetim).
#
# NEDEN: cron satırı iki .mjs'i `&&` ile zincirliyordu — exit kodu hiçbir
# yere yazılmıyor, log tavansız büyüyor (B8) ve ilk komut düşünce ikincisi
# sessizce atlanıyordu. Sarmalayıcı: sıralı koşum + çıkış kodu + tavanlı log
# (arac/cikis-kaydi.sh sözleşmesi). ONAY KAPISI DEĞİŞMEDİ: aday havuzu
# (data/emsal-adaylari.json) insan değerlendirmesi bekler; bu hat git
# commit ATMAZ (bilinçli; yayın ayrı ve onaylı bir iştir).
set -euo pipefail
KOK=/home/suha/projeler/suharitasi
cd "$KOK" || exit 1
mkdir -p "$KOK/log"
. "$KOK/arac/cikis-kaydi.sh"
cikis_kaydi_kur "yargi-aylik" "$KOK/log/yargi-cek-cron.log"
cikis_kaydi_tek_log
uyar() { "$KOK/arac/uyari-gonder.sh" "$1" "${2:-}" || true; }

KOD=0
nice -n 15 /usr/bin/node "$KOK/arac/yargi-cek.mjs" --kaynak hepsi --sayfa 6 --boyut 50 --gecikme 3000 --metin 0 || KOD=$?
if [ "$KOD" -eq 0 ]; then
  nice -n 15 /usr/bin/node "$KOK/arac/emsal-aday-uret.mjs" --limit 120 || KOD=$?
fi

if [ "$KOD" -ne 0 ]; then
  uyar "yargı aylık hattı: koşum hata verdi (exit $KOD)" "Log: log/yargi-cek-cron.log"
fi
exit "$KOD"
