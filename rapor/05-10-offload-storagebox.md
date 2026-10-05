# RAPOR — Storage Box Parola Olayı + SSH Güvenliği + "Taşı ve Sil" Offload (05.10.2026)

Sahip talimatı: Storage Box (`u649379`) parolası sıfırlandı; yedek zinciri
kopmadan SSH-key tabanlı erişimin doğrulanması + `rsync -avc
--remove-source-files` mantığıyla "taşı ve sil" otomasyonu + kanıt.
Uygulama: kök yetkili systemd servisi/zamanlayıcısı + kanıtlı test turları.

## 1) Envanter — Storage Box'a bağlanan her şey

| Bileşen | Yol | Bağlantı biçimi |
|---|---|---|
| Ana yedek zinciri | `/root/site-tools/backup.sh` (systemd `restic-yedek.service/.timer`) | `sftp:storagebox:restic-repo` |
| SSH takma adı | `/root/.ssh/config` → `Host storagebox` (port 23, `storagebox_ed25519`) | anahtar |
| Doğrulama | suha cron `restic-verify.sh` (Pazar 04:00) | kök repo + `sudo` |
| Diğer | repo scriptleri / suha crontab | **storagebox referansı 0** (temiz ayrım) |

## 2) SSH anahtarı — parola HİÇ kullanılmadı

- Anahtar mevcut ve **çalışıyor**: `sftp` → `pwd=/home`, `ls` → `restic-repo`;
  `ssh storagebox` kısıtlı kabuk yanıtı veriyor (auth başarılı).
- **Parola sıfırlaması anahtarı bozmamış** — bu turda düz metin parolaya
  ihtiyaç DUYULMADI; parola hiçbir komuta, dosyaya veya loga yazılmadı.
- Parola denetimi: `sshpass|PASS=` taraması yedek scriptlerinde **0 ham parola**
  (`RESTIC_PASSWORD_FILE` yalnız repo şifresi — o ayrı ve dosyada 600).
- GÜVENLİK ÖNERİSİ: parola sohbet kanalına düz metin yazıldı → sızma riski
  kabul edilip panelden **bir kez daha döndürülmesi** önerilir (anahtar auth
  etkilenmez).

## 3) "Taşı ve Sil" otomasyonu

**Script:** `arac/offload-storagebox.sh` · **Zamanlayıcı:** `offload-storagebox.timer`
(Pazar 09:40 TR = 06:40 UTC, `Persistent=true`) · **Hata köprüsü:**
`OnFailure=telegram-bildir@offload-storagebox.service`.

**Kural (uygulandı):** `rsync -avc --remove-source-files` (arşiv + sağlama;
`-R` ile mutlak yol ağacı korunur) → aktarım ÖNCESİ yerel sha256 manifesti →
aktarım SONRASI uzak `sha256sum` karşılaştırması (kısıtlı kabuk `sha256sum`
destekliyor) → %100 eşleşme yoksa Telegram KRİTİK + exit≠0. Kaynak dosyayı
yalnız rsync'in alıcı-onayı sonrası silmesi + uzak sha256 kapısı birlikte.

**Kapsam v1 (tutucu):** `/var/log/**/*.gz` >14 gün · `log/*.log.[0-9]+` >30 gün ·
`cikti/**` >30 gün ve yalnız git-ignore'lu çıktılar. Kapsam dışı: `data/`,
`veri/`, `izleme/`, `.git`, `yedek/`. Kuru koşum: `--kuru`.

**Kanıt zinciri:**
1. Elle dummy (`/home/offload-test/offload-dummy-1.txt`): rsync taşıdı, yerel
   silindi, uzakta 46 bayt göründü.
2. Kuru koşum: **205 aday · 29 MB** listelendi (hiç dokunulmadı).
3. İlk gerçek koşumda **kritik bug yakalandı ve düzeltildi**: doğrulama
   döngüsündeki `ssh` çağrısı while-read stdin'ini yiyordu → doğrulama 1
   dosyada kalıyordu. `ssh -n` yalnız döngü çağrılarına eklendi (rsync
   kanalında `-n` YASAK — rc=12 ile kırıldığı ölçüldü).
4. Düzeltme sonrası 3 dummy: **doğrulanan 3 · uyuşmayan 0**; yerel dosyalar
   silindi; uzak sha256'lar birebir:
   `7adf0c2a…` · `3a65474b…` · `6571446a…`.
5. Uzak ağaç sayımı: **208 dosya** (= ilk koşumun 205'i + 3 dummy) —
   ilk koşumun taşıması geriye dönük doğrulandı.
6. Kayıt: `/var/lib/offload-storagebox/kayit.jsonl` (sha256'lı) ·
   log: `/var/log/offload-storagebox.log`.

**Zincir sağlamlığı:** `restic snapshots` off-site repo erişimi anahtarla
başarılı; `restic-yedek.service` yapılandırması DEĞİŞMEDİ.

## 4) Öz-eleştiri ("daha iyisi olabilirdi")

- İlk 205 dosyanın per-file doğrulaması döngü bug'ı nedeniyle yapılamadı;
  telafi: rsync rc=0 + uzak varlık sayımı (208) + sha256'lı journal. Bug
  düzeltildi, uçtan uca 3 dosyayla kanıtlandı; sonraki Pazar koşumundan
  itibaren her dosya sha256 ile doğrulanır.
- `/var/log` dışındaki büyük arşivler (ör. `data/arsiv/baraj/log`) v1'de
  bilinçli kapsam dışı (veri güvenliği); gerekirse ikinci faz.
- Rapor ilk 205 dosya için "per-file kanıt" yerine "toplam varlık kanıtı"
  sunar — dürüst sınır, gizlenmedi.
