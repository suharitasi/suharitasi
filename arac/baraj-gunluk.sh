#!/bin/bash
# HENDEK FAZ 1 — günlük baraj cron sarmalayıcısı (18:00 TR = 15:00 UTC).
# Çekim → değişiklik varsa commit+push (arşiv git'te yedeklenir; Pages
# git'e bağlıysa push build'i tetikler) → deploy hook (doluysa).
# .env ASLA commit edilmez (gitignore); şifre/TGT hiçbir çıktıya yazılmaz.
#
# SESSİZ HATA YASAĞI (2026-07-20): set -euo pipefail; hata-toleransı gereken
# satırlar tek tek || true / koşullu ile ayrıldı; git add koşullu; başarı
# git log commit teyidiyle ölçülür (deploy HTTP kodu başarı sayılmaz).
set -euo pipefail
KOK=/home/suha/projeler/suharitasi
cd "$KOK" || exit 1
mkdir -p "$KOK/log"
LOGP="$KOK/log/pipeline.log"
HATALOG="$KOK/data/arsiv/baraj/log/cron-hata.log"

# TELEGRAM UYARI KÖPRÜSÜ (2026-08-25, kalanlar paketi 5.3): bu hattın
# kırmızısı bugüne dek yalnız log dosyasında kalıyordu — 18-24.08 pull
# tıkanıklığı 7 gün görünmez kaldı (cron-hata.log kanıtı). rg-nobetci/
# su-izleme deseniyle dışarı bildirilir; gönderim hatası hattı DÜŞÜRMEZ.
uyar() { "$KOK/arac/uyari-gonder.sh" "$1" "$2" || true; }

# node başarısızlıkta da (exit 1) gün kaydı/log arşivlenmeli; çıkış kodu
# 'if' ile yakalanır — set -e scripti burada DURDURMAMALI (bilinçli tolerans).
# BARAJ_CEK_KOMUT: falsifikasyon kancası (SU_IZLEME_RG_CA emsali) — üretimde
# ayarlanmaz; kasıtlı bozma testi çekimi gerçek EPİAŞ'a gitmeden düşürür.
if ${BARAJ_CEK_KOMUT:-node arac/baraj-cek.mjs}; then CEKIM=0; else CEKIM=$?; fi
# 2 = .env doldurulmamış (kurulum eksik): commit'lik bir şey yok, sessiz çık.
[ "$CEKIM" -eq 2 ] && exit 2
[ "$CEKIM" -ne 0 ] && uyar "veri hattı baraj: çekim BAŞARISIZ (exit $CEKIM)" \
  "EPİAŞ günlük çekimi düştü; son geçerli veri sitede kalır. Log: data/arsiv/baraj/log/"

# Başarıda da başarısızlıkta da gün kaydı/log değişti — arşivle.
# git add KOŞULLU: var-olmayabilir dosyada exit 128 + set -e ile sessiz durma
# olmasın (eski bug ailesi: koşulsuz git add).
[ -e data/arsiv/baraj ]      && git add data/arsiv/baraj
[ -f data/canli/baraj.json ] && git add data/canli/baraj.json
[ -f UYARI-BARAJ.md ]        && git add UYARI-BARAJ.md

# ORTAK GIT KİLİDİ (2026-07-23): 4 otomatik commit'çi aynı depoya yazıyor;
# eşzamanlı commit/push çakışmasın diye tek flock kullanılır (arac/git-kilit.sh).
. "$KOK/arac/git-kilit.sh"

if ! git diff --cached --quiet; then
  # Kilit alınamazsa İŞ ERTELENİR (sessiz kayıp yasak): dosyalar diskte
  # durur, staged kalır, sonraki koşuda commit edilir.
  if ! git_kilit_al "baraj"; then
    echo "[$(date -u +%FT%TZ)] git kilidi 10 dk'da alınamadı — commit ERTELENDİ" >> "$HATALOG"
    uyar "veri hattı baraj: git kilidi alınamadı" "Commit ertelendi; dosyalar staged, sonraki koşuda denenir."
    exit 4
  fi
  # K1 (2026-07-25, bulgu F4-2): commit pull'DAN ÖNCE. Eski sıra (pull → commit)
  # rebase koptuğunda veriyi commit'siz bırakıyordu; artık veri önce kayda geçer,
  # pull ancak ondan sonra denenir, push yalnız pull başarılıysa yapılır.
  ONCE=$(git rev-parse HEAD)
  # commit teyidi: commit atılmazsa veri arşivlenmemiştir → gerçek hata (exit 1).
  git commit -q -m "Baraj arşivi: $(date -u +%Y-%m-%d) günlük çekim (otomatik)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" \
    || { echo "[$(date -u +%FT%TZ)] git commit BAŞARISIZ" >> "$LOGP"; exit 1; }
  SONRA=$(git rev-parse HEAD)
  if [ "$ONCE" = "$SONRA" ]; then
    echo "[$(date -u +%FT%TZ)] commit atlandı: HEAD değişmedi (staged değişiklik commit'lenmedi)" >> "$LOGP"
    exit 1
  fi
  # push başarısızlığı sessizce yutulmaz: log'a düşer, exit 0 DÖNÜLMEZ.
  if git_pull_rebase; then
    if ! git push -q; then
      echo "[$(date -u +%FT%TZ)] git push BAŞARISIZ (commit yerelde, sonraki koşuda denenir)" >> "$HATALOG"
      PUSH_HATA=1
    fi
  else
    # Ayırt edici log: "kirli ağaç" ile "rebase çatışması" farklı arızalardır.
    if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
      echo "[$(date -u +%FT%TZ)] pull ertelendi: çalışma ağacı kirli - commit yerelde, sonraki koşuda denenir" >> "$HATALOG"
      echo "[$(date -u +%FT%TZ)] kirli dosyalar: $(git status --porcelain --untracked-files=no | head -5 | tr '\n' ' ')" >> "$HATALOG"
    else
      echo "[$(date -u +%FT%TZ)] pull --rebase çatışması - commit yerelde, sonraki koşuda denenir" >> "$HATALOG"
    fi
    # push YAPILMADI → sessiz hata yasağı gereği exit 0 dönülmez (push hatasıyla aynı sınıf).
    PUSH_HATA=1
  fi
  # Bekleyen-commit sayacı: çatışma kronikleşirse commit'ler sessizce birikmesin.
  if git rev-parse --abbrev-ref --symbolic-full-name @{u} > /dev/null; then
    BEKLEYEN=$(git rev-list --count @{u}..HEAD)
    if [ "$BEKLEYEN" -gt 5 ]; then
      echo "[$(date -u +%FT%TZ)] UYARI: $BEKLEYEN commit push edilmemiş - sürekli çatışma olabilir" >> "$HATALOG"
    fi
  else
    echo "[$(date -u +%FT%TZ)] UYARI: upstream tanımlı değil, bekleyen commit sayılamadı" >> "$HATALOG"
  fi
  git_kilit_birak
fi

# Cloudflare deploy hook — SON adım. YALNIZ başarılı çekimde (CEKIM=0):
# veri alınamayan günde boşuna deploy yok. Pipeline'ı ASLA çökertmez:
# ağ/HTTP hatası yalnız log'lanır; asıl değer arşivdir, o zaten yazıldı.
if [ "$CEKIM" -eq 0 ]; then
  HOOK=""
  if [ -f .env ]; then
    HOOK=$(grep -E '^CF_DEPLOY_HOOK=.+' .env | cut -d= -f2- || true)
  fi
  if [ -n "${HOOK:-}" ]; then
    HKOD=$(curl -s -m 30 -o /dev/null -w "%{http_code}" -X POST "$HOOK" 2>>"$LOGP") || HKOD="AG-HATASI"
    if [ "$HKOD" = "200" ]; then
      echo "[$(date -u +%FT%TZ)] deploy hook tetiklendi (HTTP 200)" >> data/arsiv/baraj/log/cron.log
    else
      echo "[$(date -u +%FT%TZ)] deploy hook BAŞARISIZ ($HKOD) — arşiv yazıldı, pipeline başarılı sayılır; gerekirse manuel deploy" >> data/arsiv/baraj/log/cron.log
    fi
  fi
fi

# push koptuysa exit 0 dönme (sessiz hata yasağı); değilse çekim kodunu döndür.
# Telegram: pull/push arızası artık dışarı bildirilir (20 günlük kör nokta
# sınıfı — kirli dosya adları mesajda, teşhis uzaktan başlayabilsin).
if [ "${PUSH_HATA:-0}" -eq 1 ]; then
  KIRLI=$(git status --porcelain --untracked-files=no | head -3 | tr '\n' ' ')
  uyar "veri hattı baraj: pull/push ARIZASI — commit yerelde" \
    "Veri arşivlendi ama origin'e gidemedi. Kirli/çatışan durum: ${KIRLI:-yok}. Log: data/arsiv/baraj/log/cron-hata.log"
  exit 1
fi
exit "$CEKIM"
