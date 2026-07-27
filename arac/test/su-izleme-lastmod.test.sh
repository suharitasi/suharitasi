#!/bin/bash
# FAZ C testi — izle_pdfhead'in GERÇEK metni dosyadan çıkarılır (kopya değil),
# çevresi saplamalarla kurulur, lm="" senaryosu koşulur. Yazımlar TMP'de.
set -euo pipefail
KAYNAK="$(dirname "$0")/../../izleme/su-izleme.sh"
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
IZ="$TMP/izleme"; mkdir -p "$IZ/state" "$IZ/log" "$IZ/arsiv"
RUN_UTC="2026-07-27T22-00-00Z"; HLOG="$IZ/log/hata.log"; HATA_SAYAC=0; OLAY_SAYAC=0
STATUSF="$TMP/durum.tsv"; EVENTF="$TMP/olay.md"; : > "$STATUSF"; : > "$EVENTF"
durum_satir(){ printf '%s\t%s\t%s\t%s\n' "$1" "$2" "$3" "$4" >> "$STATUSF"; }
olay_ekle(){ printf -- '- %s | %s | %s\n' "$RUN_UTC" "$1" "$2" >> "$EVENTF"; OLAY_SAYAC=$((OLAY_SAYAC+1)); }
logla(){ echo "[log] $*" >> "$TMP/pipeline.log"; }
# gerçek fonksiyon metni (satır aralığı dosyadan okunur)
BAS=$(grep -n '^izle_pdfhead(){' "$KAYNAK" | cut -d: -f1)
SON=$(awk -v b="$BAS" 'NR>b && /^}/ {print NR; exit}' "$KAYNAK")
eval "$(sed -n "${BAS},${SON}p" "$KAYNAK")"

ayir(){ echo; echo "── $1"; }
ozet(){ echo "  taban dosyasi: $( [ -f "$IZ/state/t1.lastmod" ] && cat "$IZ/state/t1.lastmod" || echo '(YOK)')"
        echo "  durum       : $(tail -1 "$STATUSF" 2>/dev/null || echo '-')"
        echo "  olay sayaci : $OLAY_SAYAC · hata sayaci: $HATA_SAYAC"; }

ayir "S1 — taban KURULU (gercek tarih), sunucu Last-Modified GONDERMIYOR (200|bos)"
printf '%s\n' "Wed, 01 Apr 2026 09:00:00 GMT" > "$IZ/state/t1.lastmod"
http_head(){ echo "200|"; }
izle_pdfhead t1 M3 "https://ornek/taslak.pdf"
ozet
[ "$(cat "$IZ/state/t1.lastmod")" = "Wed, 01 Apr 2026 09:00:00 GMT" ] && echo "  ✓ TABAN EZILMEDI" || { echo "  ✗ TABAN EZILDI"; exit 1; }
[ "$OLAY_SAYAC" -eq 0 ] && echo "  ✓ ALARM CALMADI" || { echo "  ✗ YANLIS ALARM"; exit 1; }
[ "$HATA_SAYAC" -eq 0 ] && echo "  ✓ HATA SAYILMADI" || { echo "  ✗ hata sayildi"; exit 1; }
grep -q 'LASTMOD-BOS' "$HLOG" && echo "  ✓ LOGLANDI: $(grep LASTMOD-BOS "$HLOG")" || { echo "  ✗ loglanmadi"; exit 1; }

ayir "S2 — taban YOK, sunucu Last-Modified GONDERMIYOR (bos taban yazilmamali)"
rm -f "$IZ/state/t1.lastmod"
izle_pdfhead t1 M3 "https://ornek/taslak.pdf"
ozet
[ ! -f "$IZ/state/t1.lastmod" ] && echo "  ✓ BOS TABAN YAZILMADI" || { echo "  ✗ bos taban yazildi"; exit 1; }
[ "$OLAY_SAYAC" -eq 0 ] && echo "  ✓ ALARM CALMADI" || { echo "  ✗ YANLIS ALARM"; exit 1; }

ayir "S3 — GERILEME KONTROLU: gercek degisiklik hala OLAY uretiyor mu?"
printf '%s\n' "Wed, 01 Apr 2026 09:00:00 GMT" > "$IZ/state/t1.lastmod"
http_head(){ echo "200|Fri, 10 Jul 2026 12:00:00 GMT"; }
izle_pdfhead t1 M3 "https://ornek/taslak.pdf"
ozet
[ "$OLAY_SAYAC" -eq 1 ] && echo "  ✓ GERCEK DEGISIKLIK OLAY URETTI" || { echo "  ✗ gerileme: olay uretmedi"; exit 1; }
[ "$(cat "$IZ/state/t1.lastmod")" = "Fri, 10 Jul 2026 12:00:00 GMT" ] && echo "  ✓ TABAN GUNCELLENDI" || { echo "  ✗ taban guncellenmedi"; exit 1; }

ayir "S4 — degismeyen gercek baslik: olay YOK"
izle_pdfhead t1 M3 "https://ornek/taslak.pdf"
ozet
[ "$OLAY_SAYAC" -eq 1 ] && echo "  ✓ TEKRAR OLAY URETMEDI" || { echo "  ✗ mukerrer olay"; exit 1; }
echo; echo "TUM SENARYOLAR GECTI (4/4)"
