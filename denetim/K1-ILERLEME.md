# K1 — git/log hijyeni (25 Tem 2026)

Denetim bulguları **F4-2** (commit pull'dan sonra geliyor), **F0-1**
(izlenmeyen grace/cron.log), **F4-7** (git işlemleri log kaydı siliyor)
kapsamında dört script + .gitignore düzeltildi.

## Bölüm 1 — Keşif (B1)

**B1.1 — kilit yapısı (üç shell script; baraj / grace / su-izleme):**

| Adım | baraj | grace | su-izleme | Konum |
|---|---|---|---|---|
| `[ -e ... ] && git add` | 26-28 | 83-87 | 303 | kilit DIŞINDA |
| `if ! git diff --cached --quiet` | 34 | 89 | 305 | kapı, staged'a bakar |
| `git_kilit_al` | 37 | 92 | 308 | |
| `git_pull_rebase` | 41 | 96 | 312 | |
| `git commit` | 44 | 98 | 314 | |
| `git push` | 54 | 104 | 322 | |
| `git_kilit_birak` | 58 | 105 | 328 | |

Sıra: add → pull → commit. **F4-2'nin kendisi.**
Kilit: `git-kilit.sh:22` `exec {GIT_KILIT_FD}>` + `:23` `flock -w`; alt kabuk yok.

**B1.2 — `git-kilit.sh:42 git_pull_rebase()`:** `--autostash` YOK. Gövde:
`pull -q` başarılıysa `return 0`; değilse `git rebase --abort || true; return 1`.
Log yazmıyor. Çağıranlar: baraj:41 `|| true` (sessiz yutuyor), grace:96 ve
su-izleme:312 `|| logla` (loglayan var). `git-kilit.sh:6` belgesi eski sırayı
tarif ediyordu ("kilit al → pull → add/commit → push").

**B1.4 — izlenen log: 13 dosya** (`git ls-files | grep -icE '\.log$'` → 13,
25 Tem 2026 21:09 UTC'de diskten doğrulandı):
`data/arsiv/baraj/log/2026-07-16.log` … `2026-07-25.log` (10 dosya) ·
`data/arsiv/baraj/log/cron.log` · `data/arsiv/grace/log-2026-07.log` ·
`izleme/log/cron.log`.
`data/arsiv/grace/cron.log` İZLENMİYOR (F0-1).

**B1.5 —** `/log/` altında `.log` ile bitmeyen izlenen dosya YOK. Desen `*.log`
güvenli; açık liste gerekmiyor (ve günlük üretilen dosyalarda ertesi gün bayatlardı).

**B1.7 —** `git fetch origin main` = 0.79 sn; `flock -w 600`; koşular arası en
küçük aralık 30 dk. Kilit içine pull koymak güvenli.

**B1.9 — write-set ⊆ add-set**, üç script'te de kapsam dışı yazılan dosya YOK:
baraj dizin add (`data/arsiv/baraj` + `data/canli/baraj.json` + `UYARI-BARAJ.md`),
grace dosya-dosya add (4 çıktıyla birebir), su-izleme dizin add (`izleme/`).
→ kalıcı tıkanma imkânsız; **kirlilik ön-kapısı gereksiz, `--autostash` gereksiz**.

**B1.8 — kapsam dışı bulgular (düzeltilmedi, kuyruğa alındı):**
- (a) 🟡 Kilit yalnız git bloğunu kapsıyor, veri yazımını kapsamıyor.
  Kanıt: `baraj-gunluk.sh:19` (node baraj-cek.mjs) kilit `:37`'den önce;
  `grace-guncelle.sh:77` (grace-isle.py) kilit `:92`'den önce; su-izleme veri
  yazımı `:296` civarı, kilit `:308`. Emin miyim: EVET.
- (b) 🟡 site-saglik pull sonrası karışık commit/revert kapsamı
  (`site-saglik.mjs:701-706`, `:713-714` shaBekle, `:730` git revert).
  Emin miyim: HAYIR — doğrulanmadı (onarım hiç tetiklenmemiş).
- (c) 🟡 grace dosya-dosya add kırılganlığı: `grace-isle.py` ileride yeni izlenen
  dosya yazarsa add listesinden düşer. Emin miyim: EVET.

## Bölüm 2 — Senaryo testleri (scratch repo, `/tmp/k1-test`)

Kurulum: bare `uzak` + iki klon (`yerel`, `digeri`). Test edilen yapı, canlıya
uygulanan yapının birebir aynısı (commit → pull → koşullu push + ayırt edici log).

| # | Senaryo | Sonuç | Kanıt |
|---|---|---|---|
| 9a | Uzakta çakışan commit varken koşum | **GEÇTİ** | `COMMIT GECTI` + `SCRIPT SONU`, EXIT=0, stash BOŞ, `HEAD:durum.json` içinde conflict marker YOK (grep 0), v301 kaybolmadı, abort sonrası status BOŞ |
| 9b | Kirli ağaç, 3 ardışık koşum | **GEÇTİ** | 3/3 EXIT=0, `SCRIPT SONU` basıldı, log `kirli agac - pull ertelendi` (rebase-çatışması mesajı DEĞİL) → ayırt edici log çalışıyor; bekleyen commit 1→2→3 birikti |
| 9c | Boş koşum (değişiklik yok) | **GEÇTİ** | `KAPI KAPALI - commit atlandi` + `SCRIPT SONU`, EXIT=0 |
| 9d | Olmayan dosyaya `git add` | **GEÇTİ** | `SCRIPT SONU`, EXIT=0 — `[ -e ] &&` set -e altında scripti öldürmüyor |
| 9e | İki temiz koşum art arda (idempotans) | **GEÇTİ** | 2/2 `COMMIT GECTI → PULL GECTI → PUSH GECTI → SCRIPT SONU`, EXIT=0, stash BOŞ, bekleyen 0 |

**Brief'te bulunan iki tutarsızlık (test sırasında yakalandı):**
1. 9b döngüsü `durum.json`'a `{"v":31i}` yazıyor, ama çağırdığı `s9a.sh` üzerine
   sabit içerik yazıyordu → kapı kapanıyor, senaryo hiç koşmuyordu ("KAPI KAPALI").
2. 9e aynı sabit-içerik nedeniyle ikinci koşumda kapıyı kapatıyordu; brief ise
   "iki koşumda da COMMIT GECTI" bekliyordu.
   Çözüm: içeriği parametre alan `s9b.sh` varyantı (mantık birebir aynı).
   Bu, kapının içerik-tabanlı olduğunun da kanıtı: aynı içerik = commit yok.

## Bölüm 3 — Uygulama (B3)

- **B3.1** `.gitignore`: mevcut `/log/` satırı korundu, altına gerekçeli yorum +
  `*.log` deseni eklendi. 13 dosya `git rm --cached` ile izlemeden çıkarıldı;
  **13/13 diskte VAR** olarak tek tek doğrulandı.
- **B3.2** Üç shell script: `git add` ve kapı koşulu YERİNDE bırakıldı; yalnız
  kilit içi blok yeniden sıralandı (commit → pull → koşullu push), ayırt edici
  log ve bekleyen-commit sayacı eklendi.
- **B3.3** `git_pull_rebase` gövdesine DOKUNULMADI, `--autostash` EKLENMEDİ.
  baraj:41'deki `|| true` sessiz yutması yapısal olarak ortadan kalktı (pull
  başarısızlığı artık açık if/else ile loglanıyor). `git-kilit.sh` başlık
  belgesindeki eski sıra tarifi güncellendi (yalnız yorum; gövde diff'i boş).
- **B3.4** `site-saglik.mjs`: `kilitliGit` stdout döndürür oldu; kilit içi sıra
  add → commit → pull → push; pull koparsa push atlanır, devir listesine +
  `onarim-log.jsonl`'a kayıt düşer, script hata FIRLATMAZ. `:702` add deseni ve
  `:730` revert'e dokunulmadı.
- **B3.5** `bash -n` 4/4 OK · `node --check` OK.

**B3.6 — yapısal diff (satır no):**

| Script | add | kapı | kilit al | commit | pull | push | kilit bırak |
|---|---|---|---|---|---|---|---|
| baraj ÖNCE | 26-28 | 34 | 37 | 44 | **41** | 54 | 58 |
| baraj SONRA | 26-28 | 34 | 37 | **46** | **56** | 57 | 81 |
| grace ÖNCE | 83-87 | 89 | 92 | 98 | **96** | 104 | 105 |
| grace SONRA | 83-87 | 89 | 92 | **100** | **106** | 107 | 126 |
| su-izleme ÖNCE | 303 | 305 | 308 | 314 | **312** | 322 | 328 |
| su-izleme SONRA | 303 | 305 | 308 | **316** | **325** | 326 | 349 |

## Bölüm 4 — Claude Code'un kendi verdiği kararlar

1. **`logla` biçimi:** grace ve su-izleme'de mevcut `logla()` fonksiyonu
   kullanıldı. baraj'da `logla` fonksiyonu YOK; dosyanın mevcut üslubu
   (`echo "[$(date -u +%FT%TZ)] ..." >> "$HATALOG"`) korundu. Gerekçe: D-5
   "üslup" der, fonksiyon şartı koymaz; yeni fonksiyon eklemek kapsam genişletirdi.
2. **Sayaç bloğunun yeri:** her script'in kendi kilit bloğunun içine kondu,
   `git-kilit.sh`'e değil. Gerekçe: sayaç log'a yazıyor, log hedefi (`$HATALOG`
   / `logla`) script'e özgü; ortak dosyaya koymak git-kilit.sh'i log bağımlısı yapardı.
3. **Değişken kapsamı:** `BEKLEYEN` ve `PUSH_ERTELENDI` yerel, düz atama
   (script'lerde `local` kullanılamaz, üst seviye kod).
4. **Commit teyidi (ONCE/SONRA) korundu:** brief'in B3.2 şablonu bu satırları
   göstermiyordu; silmek CLAUDE.md "başarı metriği = commit teyidi" kuralını
   zayıflatırdı (madde 4e: kanıt hafifletme YASAK). Korundu.
5. **Pull koptuğunda çıkış kodu:** baraj `PUSH_HATA=1`, su-izleme
   `PUSH_ERTELENDI=1` → exit 0 DÖNÜLMEZ. Gerekçe: push yapılmamıştır; bu, push
   kopmasıyla aynı sınıf arızadır, mevcut sessiz-hata yasağı garantisi korunur.
   grace'te davranış değiştirilmedi (mevcut kodu da push kopmasında `logla`
   deyip devam ediyordu; kapsam genişletilmedi).
6. **Scratch dizini:** `rm -rf /tmp/k1-test` izin kuralıyla engellendi; eski
   dizin `mv` ile `/tmp/k1-test-onceki-tur`'a alındı, `/tmp/k1-test` yolu birebir
   korundu (hiçbir şey silinmedi).
7. **9a sonrası uzlaşma:** yerel/uzak ayrışması `reset --hard` YERİNE
   `pull --rebase` + elle çözüm ile kapatıldı (M10 kuralına uyum).
8. **`git-kilit.sh` başlık yorumu güncellendi:** gövde değişmedi; belge artık
   gerçeğe aykırı sıra tarif etmiyor. Ekleme+netleştirme sınıfında.

## Bölüm 5 — Kapsam dışı bırakılanlar

- B1.8 (a), (b), (c) — SIRADAKILER'e yazıldı.
- Faz D (canlı doğrulama): bir sonraki pipeline koşumundan sonra yapılacak.
  **Bu kontrol yapılana kadar K1 "doğrulandı" SAYILMAZ.**
- Yabancı worktree `/tmp/claude-1000/.../wt-base` (detached HEAD) — karar bekliyor.
