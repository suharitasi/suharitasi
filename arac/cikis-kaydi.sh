#!/usr/bin/env bash
# ORTAK ÇIKIŞ KAYDI + LOG DÖNDÜRME YARDIMCISI (26.08.2026, 8. seans)
#
# NİYE VAR: 26.08 cron log envanteri (rapor/26-08-cron-log-envanteri.md)
# ölçtü — 13/13 cron satırında exit kodu log'a yazılmıyor (K1) ve 10/10
# log'da tavan/döndürme yok (K2). Aynı düzeltmeyi her betiğe elle
# kopyalamak yerine sözleşme tek yerde tutulur.
#
# NASIL KULLANILIR (source edilir, ÇALIŞTIRILMAZ):
#   source "$(dirname "$0")/cikis-kaydi.sh"
#   cikis_kaydi_kur "yedek" "$LOG"        # ad · log yolu
#   cikis_kaydi_tek_log                   # (istege bagli) TTY yoksa stdout+stderr log'a
#   ...
#   cikis_kaydi_dosya "$DOSYA" "$BOYUT"   # başarı yolunda, üretilen çıktı
#
# SÖZLEŞME (gsc-haftalik.sh'de kanıtlanmış biçimle AYNI):
#   <ISO-8601 UTC> <ad>: ÇIKIŞ · exit=<kod> · dosya=<yol> · bayt=<n>
#   Çıktı üretilmemişse dosya/bayt alanları "-"; satır YİNE yazılır.
#   Başarı, hata ve sinyal — üç durumda da yazılması garanti.
#
# ─────────────────────────────────────────────────────────────────────
# KRİTİK KISIT — ÖLÇÜLDÜ (envanter §4, deney çıktısı raporda):
#   bash'te ikinci `trap ... EXIT` birincisini SESSİZCE EZER. Çağıranın
#   kendi temizliği hiç çalışmaz. (node `process.on('exit')` ve python
#   `atexit` YIĞILIR — bu sorun yalnız bash'e özgüdür.)
#   Bu yüzden bu yardımcı EXIT trap'ini EZMEZ: `trap -p EXIT` ile mevcut
#   olanı OKUR ve ZİNCİRLER — önce çağıranın kendi trap'i çalışır (temizlik
#   kaybolmasın), sonra çıkış satırı yazılır.
#   Aynı koruma sinyaller için de geçerli: HUP/INT/TERM yalnız o sinyalde
#   trap YOKSA kurulur; varsa dokunulmaz.
#
# TEK HATA NOKTASI ŞERHİ: bu dosya bozulursa ona bağlı her betik düşer.
# Bu yüzden (a) yalnız fonksiyon tanımlar, source anında iş yapmaz,
# (b) her betiğe bağlanmadan önce falsifikasyondan geçirilir.
# ─────────────────────────────────────────────────────────────────────

# Eşikler env ile ezilebilir — YALNIZ SINAMA İÇİN (üretimde ayarlanmaz).
CIKIS_KAYDI_TAVAN="${CIKIS_KAYDI_TAVAN:-$((512 * 1024))}"   # 512 KB
CIKIS_KAYDI_ARSIV="${CIKIS_KAYDI_ARSIV:-5}"                 # en fazla 5 arşiv

_cikis_kaydi_logla() {
  echo "$(date -u +%FT%TZ) ${CIKIS_KAYDI_AD}: $*" >> "$CIKIS_KAYDI_LOG"
}

# Kayan arşiv: log .1'e taşınır, arşivler bir numara kayar, tavanı aşan
# en eski arşiv SİLİNİR. KIRPMA YOK — gsc-haftalik'te "döndürme" diye
# duran `tail -c` aslında verinin ilk yarısını atıyordu; tekrarı yasak.
# Garanti edilen: arşiv SAYISI sınırlı. Arşivin BOYUTU tavanı aşabilir
# (döndürme anındaki boyut dondurulur) — ölçüldü, 26.08 K1/K2 raporu.
_cikis_kaydi_dondur() {
  local L="$CIKIS_KAYDI_LOG" T="$CIKIS_KAYDI_TAVAN" A="$CIKIS_KAYDI_ARSIV" b i
  [ -f "$L" ] || return 0
  b=$(stat -c %s "$L")
  [ "$b" -gt "$T" ] || return 0
  if [ -f "$L.$A" ]; then rm -f "$L.$A"; fi
  i=$((A - 1))
  while [ "$i" -ge 1 ]; do
    if [ -f "$L.$i" ]; then mv "$L.$i" "$L.$((i + 1))"; fi
    i=$((i - 1))
  done
  mv "$L" "$L.1"
  : > "$L"
  _cikis_kaydi_logla "log döndürüldü ($b > $T bayt) → $L.1 · arşiv tavanı $A"
}

# EXIT trap gövdesi: ÖNCE çağıranın kendi trap'i, SONRA çıkış satırı.
# eval yalnız `trap -p` çıktısından gelen, betiğin KENDİ yazdığı komutu
# çalıştırır (dış girdi değil). Çağıranın trap'i hata verse bile çıkış
# satırı yazılır — kayıt, temizliğe bağlı olmamalı.
_cikis_kaydi_calistir() {
  local kod=$?
  if [ -n "${CIKIS_KAYDI_ONCEKI_TRAP:-}" ]; then
    eval "$CIKIS_KAYDI_ONCEKI_TRAP" || _cikis_kaydi_logla "UYARI: zincirlenen önceki EXIT trap'i hata verdi"
  fi
  _cikis_kaydi_logla "ÇIKIŞ · exit=$kod · dosya=${CIKIS_DOSYA:--} · bayt=${CIKIS_BOYUT:--}"
}

# Sinyal: yalnız o sinyalde trap YOKSA kur (mevcut olanı ezme).
# Sinyali exit'e çeviriyoruz, çünkü bash'te sinyalle ölürken EXIT
# trap'inin koşması garanti DEĞİLDİR (gsc-haftalik'te kanıtlandı).
_cikis_kaydi_sinyal() {
  if [ -z "$(trap -p "$1")" ]; then trap "exit $2" "$1"; fi
}

cikis_kaydi_kur() {
  CIKIS_KAYDI_AD="$1"
  CIKIS_KAYDI_LOG="$2"
  CIKIS_DOSYA="-"
  CIKIS_BOYUT="-"
  mkdir -p "$(dirname "$CIKIS_KAYDI_LOG")"

  # Döndürme, olası exec yönlendirmesinden ÖNCE koşmalı: sonra koşsaydı
  # mv, exec'in açtığı fd'yi eski inode'a bağlı bırakır ve o koşumun
  # satırları kaybolurdu (gsc-haftalik'te ölçüldü).
  _cikis_kaydi_dondur

  # ── Trap zincirleme (ezme YOK) ──
  local p
  p=$(trap -p EXIT)
  CIKIS_KAYDI_ONCEKI_TRAP=""
  if [ -n "$p" ]; then
    # `trap -- 'KOMUT' EXIT` → KOMUT. Bash tek tırnağı '\'' olarak kaçar.
    CIKIS_KAYDI_ONCEKI_TRAP=$(printf '%s' "$p" | sed -E "s/^trap -- '(.*)' EXIT$/\1/")
    CIKIS_KAYDI_ONCEKI_TRAP=${CIKIS_KAYDI_ONCEKI_TRAP//\'\\\'\'/\'}
    _cikis_kaydi_logla "mevcut EXIT trap'i ZİNCİRLENDİ (ezilmedi): $CIKIS_KAYDI_ONCEKI_TRAP"
  fi
  trap _cikis_kaydi_calistir EXIT
  _cikis_kaydi_sinyal HUP  129
  _cikis_kaydi_sinyal INT  130
  _cikis_kaydi_sinyal TERM 143
}

# TTY yoksa (= cron) stdout+stderr log'a gider. Böylece crontab'da `>>`
# yönlendirmesine gerek kalmaz — ikinci, TAVANSIZ log dosyası doğmaz ve
# cron mail'i üretilmez. /dev/null KULLANILMAZ (CLAUDE.md sessiz hata yasağı).
cikis_kaydi_tek_log() {
  if [ ! -t 1 ]; then exec >> "$CIKIS_KAYDI_LOG" 2>&1; fi
}

# Başarı yolunda üretilen çıktıyı bildir (yol + boyut).
cikis_kaydi_dosya() {
  CIKIS_DOSYA="$1"
  CIKIS_BOYUT="$2"
}
