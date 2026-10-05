# RAPOR — P1 Dayanıklılık Onarımı (05.10.2026)

Brief: `cikti/brief/2026-10-05T0807-p1-dayaniklilik.md` · Kaynak bulgular:
`rapor/05-10-odul-ustu-denetim.md` (K1, K2, S8, S9).
Şablon değil, kanıt raporu: her madde komut çıktısına bağlıdır.

## Brief-denetçi ön-denetim (uyarılar — iş sürdü, ENGEL yok)
- [T1] `izleme/crontab-onceki-…` denetim anında repoda yoktu; iş sırasında
  üretildi: `izleme/crontab-onceki-20261005-p1.txt` (114 satır).
- [T1] `rapor/05-10-p1-dayaniklilik.md` denetim anında yoktu; bu dosyadır.
- [T6] "Canlı" tetiği: bu iş site yayınını değiştirmez; canlı koşul kapısı
  uygulanmadı. Kanıt: `src/` ve `public/` bu işte değişmedi (git diff boş).

---

## 1. K1 — Off-site yedek: kök neden ve onarım

**Kök neden (ölçüldü):** 04.10 20:41'de yapılan ufw sertleştirmesi
(`default deny outgoing`) yalnız 53/80/443/123 çıkışlarına izin veriyordu;
restic off-site SFTP bağlantısı port **23/tcp** kullanır ve izin listesinde
yoktu. Zaman çizelgesi kanıtı: 04.10 19:42 off-site başarılı; 20:41 kural
değişikliği (auth journal: `suha TTY=pts/0 COMMAND=/usr/sbin/ufw default
deny outgoing`); 05.10 01:06 ilk koşum — "server unexpectedly closed
connection" + timeout.

**Onarım:**
1. `sudo ufw allow out 23/tcp comment 'Restic off-site SFTP (Storage Box)'`
   → durum çıktısı: `23/tcp ALLOW OUT Anywhere` (v4+v6).
2. TCP testi: `SB:23 ACIK` (öncesi: iki ailede de KAPALI).
3. `sudo systemctl start restic-yedek.service` → **SERVIS_EXIT:0**,
   `systemctl is-failed` → `inactive`.
4. Journal: `snapshot 884c32fa saved` · `yedek zinciri tamam: yerel + off-site`
   · budama: 2 snapshot silindi, 10 kaldı.

**D1 falsifikasyonu (yalnız exit 0 yetmez):**
- Off-site repo `snapshots`: **4 snapshot** (bugünkü dâhil) — bağlantı kurulup
  yazıldığı kanıtlı.
- Yerel `restic check`: `no errors were found` (11 snapshot tarandı).
- Geri-dönüş tatbikatı: `restore latest --include …/arac/git-kilit.sh` →
  orijinal ↔ geri dönen **sha256 bitesit** (`fa7070a9…`).

## 2. Sessiz hata görünürlüğü — systemd → Telegram köprüsü

- Yeni birim: `/etc/systemd/system/telegram-bildir@.service` (User=suha,
  ExecStart=`arac/systemd-bildir.sh %i`).
- Drop-in: `/etc/systemd/system/restic-yedek.service.d/onfailure.conf` →
  `OnFailure=telegram-bildir@%N.service` (`systemctl show` ile doğrulandı).
- **Uçtan uca test:** geçici `p1-test-fail` birimi fail etti → köprü koştu →
  Telegram gönderimi `message_id 8782` (journal: `Deactivated successfully`).
- Süreklilik: `saglik-bekcisi.sh` (h) maddesi artık
  `systemctl is-failed restic-yedek.service` durumunu da izliyor; bekçi
  koşumu: `sağlık OK … exit 0`.

## 3. K2 — Sahte-başarı scripti + çift cron

- `arac/restic-master-backup.sh` yeniden yazıldı: RESTIC_REPOSITORY'siz
  `restic backup` + koşulsuz "başarıyla tamamlandı" satırları KALDIRILDI;
  artık `exec sudo -n systemctl start restic-yedek.service` (gerçek zincir).
- Crons: 113 ve 114. satırlar (birebir aynı) silindi. Kanıt: yedek dosya +
  `diff <(crontab -l) <(grep -v … yedek)` → **DIFF TEMIZ**; kalan iş listesi
  son 6 satır çıktısıyla doğrulandı.

## 4. S9 — 6 bakım scripti sözleşmeye bağlandı

| Script | Değişiklik | Kanıt |
|---|---|---|
| `sys-check.sh` | `set -euo pipefail` + çıkış kaydı + Telegram | Gerçek koşum: exit=0, `ÇIKIŞ · exit=0` satırı |
| `disk-guard.sh` | `sudo -n` (journalctl/apt) + Telegram + çıkış kaydı | `bash -n` OK; %78 < 80 olduğundan tetiklenmedi (tasarlanan davranış) |
| `restic-verify.sh` | Root repo + parola dosyası (sır yazılmaz) + `--read-data-subset=1%` + Telegram | Gerçek koşum: 1,57 sn, `no errors were found`, exit=0 |
| `aide-check.sh` | `--config /etc/aide/aide.conf` + rc sınıfları + Telegram | `bash -n` OK; tam koşum haftalık işte (bkz. §5) |
| `pg-maintenance.sh` | `sudo -n -u postgres vacuumdb` + hata görünürlüğü | Gerçek koşum: 2,36 sn, exit=0, `ÇIKIŞ · exit=0` |
| `restic-master-backup.sh` | Sahte başarı → systemd tetikleyici | §3 |

Hepsi `bash -n` geçti; gerçek koşum kanıtı 3/3 denendi (kalanı zamanlanmış iş).

## 5. AIDE düzeni (S9 eki)

- Baseline promote edildi: `/var/lib/aide/aide.db` = 160 MB (03:07 üretimi,
  `_aide` sahipliği korundu) — boş dosya dönemi kapandı.
- Debian `dailyaidecheck.timer` (günde ~53 dk, `COMMAND=update`,
  `COPYNEWDB=no`, raporu postfix ölü olduğu için SESSİZ) **kapatıldı**;
  geri açma: `sudo systemctl enable --now dailyaidecheck.timer`.
- P1 sonrası durum için baseline arka planda tazeleniyor:
  `aide-baseline-yenile.service` (`nice=19`, log:
  `/var/log/aide/baseline-yenile.log`). Bitince haftalık `aide-check.sh`
  temiz tabandan başlar.

## 6. S8 — Disk (silme YOK; kullanıcı onayı bekliyor)

`df /`: %78 (56G/75G). Temizlenebilir adaylar (ölçülü):
- `cikti/denetim` **294 MB** (eski denetim görüntüleri/logları)
- `cikti/dist-once`…`dist-once6` **~220 MB** (6 eski dist snapshot'ı)
- `denetim/kare` **54 MB**
- (küçükler: `BACKUP-AJAN` 76 KB, `BACKUP-KESIF` 564 KB — öneri: `BACKUP-*`
  politikası ayrı karar)
Geri alınamaz işlem olduğundan **silinmedi**; onay verilirse tek komutla
temizlenir. `disk-guard.sh` artık %80'de gerçekten çalışır ve Telegram'a
haber verir.

## 7. Kapsam dışı / dokunulmayanlar (brief'e uygun)

- `/root/site-tools/backup.sh` değiştirilmedi (yalnız okundu).
- `src/`, `public/`, yayın zinciri değişmedi; site sağlığı etkilenmez.
- Hetzner panel işi yok; başka projelere dokunulmadı.

## Kullanıcı kalemleri (karar/onay bekler)

1. **Disk temizliği:** §6 listesi — silme onayı.
2. **postfix@-.service:** `systemctl --failed`'da bir diğer arızalı birim
   (MTA, `/etc/postfix/main.cf` yok, kullanılmıyor). Kapatılsın mı?
   (Systemd hata postaları zaten teslim edilemiyor.)
3. **dailyaidecheck kapalı kalsın mı:** öneri EVET (sessiz + haftalık
   Telegram'lı denetim var). Geri açma komutu §5'te.
4. **ufw 23/tcp izni:** şu an genel çıkış izni; istenirse Storage Box IP'sine
   daraltılabilir (hostname → IP çözümü değişebilir; genel izin kısa vadede
   daha dayanıklı).

## Kanıt özeti

`systemctl is-failed` boş/restic yok · off-site 4 snapshot · `restic check`
temiz · sha256 bitesit restore · message_id 8782 · crontab diff temiz (yedekli)
· 6 script `bash -n` + 3 gerçek koşum · bekçi exit 0 · disk listesi (silme yok)
· commit: bu rapor + §60 + scriptler.

## Öz-eleştiri ("daha iyisi olabilir miydi")

- AIDE tam `--check` koşumu ~53 dk sürdüğünden bu oturumda bitirilemedi;
  arka plan tazeleme + haftalık iş ile kapanıyor — ilk Pazar koşumu izlenecek.
- OnFailure köprüsü şimdilik yalnız restic-yedek'e bağlı; diğer kritik
  birimlere (muvekkil-yedek, baraj pipeline) yaygınlaştırma P6'ya yazıldı.
- pg-maintenance tek koşumla kanıtlandı; haftalık ilk koşum (Pazar 03:00)
  sonrası kalıcılık teyidi alınacak.
- Off-site erişimin 6 saat boyunca sessiz kalması, ufw'nin uygulama-farkında
  olmadığını gösterdi; "kurulum sonrası bağımlılık taraması" fikri
  gelecek sertleştirme işlerine kural olarak önerilir (kuyruğa P6 notu).
