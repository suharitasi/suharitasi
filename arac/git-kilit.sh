#!/usr/bin/env bash
# ORTAK GIT KİLİDİ — tek kaynak (2026-07-23).
# NEDEN: depoda otomatik commit+push yapan 4 iş var (baraj, GRACE, su-izleme,
# site-saglik). İkisi aynı anda çalışırsa `git commit`/`git push` çakışır;
# push reddedilir ve veri sessizce yerelde kalır. Hepsi bu kilidi kullanır.
# SIRA: kilit al → git pull --rebase → add/commit → push → kilidi bırak.
# Kilit 10 dk'da alınamazsa iş ERTELENİR ve loglanır (sessiz kayıp YASAK).
#
# Kullanım (source ederek):
#   . "$(dirname "$0")/git-kilit.sh"          # yol scripte göre değişir
#   if ! git_kilit_al "baraj"; then logla "kilit alınamadı, ertelendi"; exit 0; fi
#   git_pull_rebase || logla "pull başarısız"
#   ...git add/commit/push...
#   git_kilit_birak

GIT_KILIT_YOL="${GIT_KILIT_YOL:-/tmp/suharitasi-git.lock}"
GIT_KILIT_BEKLE="${GIT_KILIT_BEKLE:-600}"   # saniye (10 dk)

# $1 = çağıran işin adı (log için). Başarılı: 0, zaman aşımı: 1.
git_kilit_al() {
  local ad="${1:-bilinmeyen}"
  exec {GIT_KILIT_FD}>"$GIT_KILIT_YOL" || return 1
  if flock -w "$GIT_KILIT_BEKLE" "$GIT_KILIT_FD"; then
    echo "$ad $$ $(date -u +%FT%TZ)" >&"$GIT_KILIT_FD"
    return 0
  fi
  exec {GIT_KILIT_FD}>&-
  return 1
}

git_kilit_birak() {
  if [ -n "${GIT_KILIT_FD:-}" ]; then
    flock -u "$GIT_KILIT_FD" || true
    exec {GIT_KILIT_FD}>&-
    unset GIT_KILIT_FD
  fi
}

# Kilit alındıktan SONRA çağrılır: uzaktaki commit'lerin üstüne yazmayı önler.
# Rebase çakışırsa yarım bırakmaz — rebase'i iptal eder ve 1 döner.
git_pull_rebase() {
  if git pull --rebase -q; then
    return 0
  fi
  git rebase --abort || true
  return 1
}
