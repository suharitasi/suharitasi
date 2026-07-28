#!/usr/bin/env bash
# ============================================================================
# KOŞUM MALİYETİ ÖLÇERİ (2026-07-28, sunucu donma teşhisi Faz 1.3)
# Bir komutu koşarken 0,5 sn aralıkla ölçer:
#   - süreç ağacının toplam RSS'i (MB)  → tepe RAM
#   - eşzamanlı yaşayan chrome/chromium PID sayısı
#   - sistem geneli MemAvailable (MB) ve swap kullanımı (MB)
# Çıktı: <cikti>/ornek.tsv (ham) + <cikti>/ozet.json (tepe değerler)
# Sessiz hata yasağı: örnekleyici ölçülen komuttan AYRI süreçtir; komut
# donsa bile örnek dosyası diskte kalır (kanıt kaybolmaz).
# ============================================================================
set -euo pipefail

CIKTI="$1"; shift
ETIKET="$1"; shift
mkdir -p "$CIKTI"
ORNEK="$CIKTI/ornek-$ETIKET.tsv"
OZET="$CIKTI/ozet-$ETIKET.json"

printf 'sn\tagac_rss_mb\tchrome_pid\tmem_avail_mb\tswap_used_mb\tyuk1\n' > "$ORNEK"

"$@" > "$CIKTI/stdout-$ETIKET.log" 2>&1 &
HEDEF=$!
BASLA=$(date +%s.%N)

while kill -0 "$HEDEF" 2>/dev/null; do
  # Süreç ağacı: hedef PID'in tüm alt soyunu topla.
  PIDLER=$(ps -eo pid,ppid --no-headers | awk -v kok="$HEDEF" '
    { ppid[$1]=$2; pids[NR]=$1 }
    END {
      soy[kok]=1; degisti=1
      while (degisti) { degisti=0
        for (i=1;i<=NR;i++) { p=pids[i]
          if (!(p in soy) && (ppid[p] in soy)) { soy[p]=1; degisti=1 } } }
      for (p in soy) printf "%s ", p
    }')
  RSS=0
  if [ -n "$PIDLER" ]; then
    # Süreç örnekleme sırasında ölebilir; ps'in "no such process" hatası
    # beklenen gürültüdür (|| true), ölçümü durdurmamalı.
    LISTE=$(echo "$PIDLER" | tr ' ' ',' | sed 's/,*$//')
    RSS=$(ps -o rss= -p "$LISTE" 2>/dev/null | awk '{s+=$1} END {printf "%.1f", s/1024}' || true)
    [ -z "$RSS" ] && RSS=0
  fi
  # pgrep bulamazsa exit 1 döner; sayaç 0 olmalı, koşum durmamalı.
  CHROME=$(pgrep -c -f 'chrome-linux64/chrome|chromium' || true)
  [ -z "$CHROME" ] && CHROME=0
  AVAIL=$(awk '/MemAvailable/{printf "%.0f", $2/1024}' /proc/meminfo)
  SWAPU=$(awk '/SwapTotal/{t=$2} /SwapFree/{f=$2} END{printf "%.0f", (t-f)/1024}' /proc/meminfo)
  YUK=$(awk '{print $1}' /proc/loadavg)
  SN=$(awk -v a="$BASLA" 'BEGIN{printf "%.1f", systime()-int(a)}')
  printf '%s\t%s\t%s\t%s\t%s\t%s\n' "$SN" "$RSS" "$CHROME" "$AVAIL" "$SWAPU" "$YUK" >> "$ORNEK"
  sleep 0.5
done

# wait, hedef başarısız çıksa da devam etmeli — çıkış kodu özete yazılır.
set +e; wait "$HEDEF"; KOD=$?; set -e
BITTI=$(date +%s.%N)
SURE=$(awk -v a="$BASLA" -v b="$BITTI" 'BEGIN{printf "%.1f", b-a}')

awk -v etiket="$ETIKET" -v sure="$SURE" -v kod="$KOD" -F'\t' '
  NR>1 { if ($2+0>trss) trss=$2+0; if ($3+0>tchrome) tchrome=$3+0
         if (navail=="" || $4+0<navail) navail=$4+0
         if ($5+0>tswap) tswap=$5+0; if ($6+0>tyuk) tyuk=$6+0; n++ }
  END { printf "{\"etiket\":\"%s\",\"sure_sn\":%s,\"cikis_kodu\":%s,\"ornek_sayisi\":%d,",
               etiket, sure, kod, n
        printf "\"tepe_agac_rss_mb\":%.1f,\"tepe_esz_chrome\":%d,", trss, tchrome
        printf "\"min_mem_avail_mb\":%d,\"tepe_swap_used_mb\":%d,\"tepe_yuk1\":%.2f}\n",
               navail, tswap, tyuk }
' "$ORNEK" > "$OZET"

cat "$OZET"
exit "$KOD"
