#!/usr/bin/env bash
# ORTAK GIT KİLİDİ — tek kaynak (2026-07-23).
# NEDEN: depoda otomatik commit+push yapan 4 iş var (baraj, GRACE, su-izleme,
# site-saglik). İkisi aynı anda çalışırsa `git commit`/`git push` çakışır;
# push reddedilir ve veri sessizce yerelde kalır. Hepsi bu kilidi kullanır.
# SIRA (K1, 2026-07-25 ile güncellendi): add → kilit al → commit → pull --rebase
# → (pull geçtiyse) push → kilidi bırak. Eski sıra (pull → commit) rebase
# koptuğunda veriyi commit'siz bırakıyordu; artık veri her hâlükârda kayda
# geçer, push yalnız pull başarılıysa denenir.
# Kilit 10 dk'da alınamazsa iş ERTELENİR ve loglanır (sessiz kayıp YASAK).
#
# Kullanım (source ederek):
#   . "$(dirname "$0")/git-kilit.sh"          # yol scripte göre değişir
#   if ! git_kilit_al "baraj"; then logla "kilit alınamadı, ertelendi"; exit 0; fi
#   git commit -m ...
#   if git_pull_rebase; then git push; else logla "pull koptu, commit yerelde"; fi
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
#
# A2 (08.09.2026, karar-kapatma Faz A): KİRLİ AĞAÇ BAĞIŞIKLIĞI.
# ÖLÇÜM: 27.08–07.09 arası 24 koşumda (su-izleme) + 27'de (baraj) push
# yalnız "çalışma ağacı kirli" diye atlandı; gerçek rebase çatışması 0/94
# (log/pipeline.log + data/arsiv/baraj/log/cron-hata.log). Kullanıcının
# bekleyen düzenlemesi (Hero.astro) yüzünden canlı 11,5 gün 8b39efe'de kaldı.
# NEDEN: `git pull --rebase` izlenen dosyada unstaged değişiklik varken
# reddeder (autoStash kapalı) — oysa uzak ilerlememişse rebase GEREKSİZDİR,
# push fast-forward olur ve kirli ağaç push'u engellemez.
# ÇÖZÜM: önce fetch + ata-kontrolü; uzak HEAD'in atasıysa pull ATLANIR (ağaca
# hiç dokunulmaz). Yalnız uzak gerçekten ilerlemişse eski yol (rebase) denenir.
# `--autostash` BİLEREK kullanılmadı: kullanıcı oturumu sırasında dosyalarını
# stash'leyip geri uygulamak çatışma işareti sızdırabilir.
git_pull_rebase() {
  if ! git fetch -q; then
    return 1
  fi
  local uzak
  uzak=$(git rev-parse '@{u}') || return 1
  if git merge-base --is-ancestor "$uzak" HEAD; then
    return 0
  fi
  if git pull --rebase -q; then
    return 0
  fi
  git rebase --abort || true
  return 1
}
