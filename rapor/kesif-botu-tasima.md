# KEŞİF BOTU — ROOT'TAN `suha`'YA TAŞIMA PLANI (M12)

Tarih: 2026-07-29 · **DURUM: UYGULANDI (kullanıcı root olarak koştu) ve
DOĞRULANDI.** Aşağıdaki plan olduğu gibi korunuyor; doğrulama §6'da.

## 0. Neden durdu (ölçüm)

| Gereken | Ölçülen |
|---|---|
| `/root/araclar/kesif-botu/` okunması | `Permission denied` |
| `sudo` ile ayrıcalık yükseltme | `sudo: a password is required` (parolasız sudo YOK) |
| `/etc/systemd/system/bist-kesif.service` düzenlenmesi | root gerekir |
| `systemctl daemon-reload` | root gerekir |

Taşımanın **her adımı** root ayrıcalığı istiyor. Brief'in DUR kuralı
("kullanıcı kararı/ayrıcalık gerektiren adım") burada geçerli.
**Dosya kopyalanmadı, birim dosyasına dokunulmadı, hiçbir şey
değiştirilmedi.**

## 1. BIST bağı — ölçüldü, **BAĞ YOK**

Birim tanımından (root gerektirmeden `systemctl cat` ile okunabildi):

```
Description=GÜNLÜK KEŞİF AJANI (AI radarı) — /root/araclar/kesif-botu · BIST'ten bağımsız
WorkingDirectory=/root/araclar/kesif-botu
EnvironmentFile=-/root/araclar/kesif-botu/.kesif.env
ExecStart=/root/araclar/kesif-botu/.venv/bin/python .../kesif_ajani.py
StandardOutput=append:/root/araclar/kesif-botu/log/kesif.log
```

| Kontrol | Sonuç |
|---|---|
| BIST dizinine (`/root/bist-projesi`) referans | **YOK** |
| BIST venv/kütüphanesine referans | **YOK** — kendi `.venv`'i var |
| BIST veritabanı/portuna referans | **YOK** |
| `bist-*` birimleriyle `After=`/`Requires=` bağı | **YOK** (yalnız `network-online.target`) |
| "bist" kelimesinin birim içinde geçişi | **2** — ikisi de yalnız *birim adı* ve *"BIST'ten bağımsız"* açıklaması |

**Sonuç: keşif botu BIST'ten teknik olarak bağımsızdır.** Tek bağ
**isimlendirme**: birim `bist-kesif.service` adını taşıyor. Bu bir
kalıntıdır (birimin kendi açıklaması bunu söylüyor).

**G5 UYARISI:** taşıma, adı `bist-` ile başlayan bir birimi silmeyi/yeniden
adlandırmayı gerektirir. Brief "BIST'e dokunulmaz (mutlak)" diyor.
Teknik olarak bu birim BIST değildir, ama **ad çakışması nedeniyle
kullanıcı onayı olmadan dokunulmamalıdır.** Bu ikinci DUR sebebidir.

## 2. BIST API taban ölçümü (değişmediğinin kanıtı için)

Taşıma yapılırsa "BIST bozulmadı" ancak öncesi/sonrası kıyasla kanıtlanır.
Bugünkü taban:

| Ölçüm | Değer |
|---|---|
| `bist-api.service` | **active** |
| Dinlenen adres | `127.0.0.1:8001` (uvicorn `api:app`, PID 786483, 29.07 06:25'ten beri) |
| `GET /health` | **403** — uç yetkilendirme istiyor; "ayakta" kanıtı olarak 403 de geçerlidir (bağlantı kuruluyor, uygulama cevap veriyor) |
| Diğer dinleyenler | 8010 (501), 8020 (404), 5432 (postgres) |
| `bist-kesif.service` son koşum | 29.07 05:00 → **05:02:54 başarıyla bitti** (`status=0/SUCCESS`, 4,4 sn CPU) |

**Not:** `/health` uçları 403/501/404 döndürüyor — bunlar *uygulamanın
ayakta olduğunu* gösterir. "200 bekleniyor" varsayımı ölçümle
yanlışlandı; taşıma sonrası kıyas **aynı kodlarla** yapılmalıdır.

## 3. TAŞIMA PLANI (kullanıcı root olarak koşar)

Adımlar sırayla; her adımın kanıtı yanında.

```bash
# 0) ÖNCE TABAN: BIST bozulmadı kanıtı için önce/sonra aynı komut
systemctl is-active bist-api.service                    # beklenen: active
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8001/health   # beklenen: 403

# 1) Kopyala (TAŞIMA DEĞİL — önce kopya, eski yerinde kalsın)
sudo mkdir -p /home/suha/araclar
sudo cp -a /root/araclar/kesif-botu /home/suha/araclar/
sudo chown -R suha:suha /home/suha/araclar/kesif-botu
sudo chmod 600 /home/suha/araclar/kesif-botu/.kesif.env

# 2) venv'i yeniden kur (mutlak yol gömülü olduğu için kopya çalışmaz)
sudo -u suha bash -c 'cd /home/suha/araclar/kesif-botu && rm -rf .venv \
  && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt'
#   requirements.txt yoksa: .venv/bin/pip freeze > requirements.txt  (ESKİ venv'de)

# 3) ELLE KOŞUM — taşıma sonrası bot gerçekten çalışıyor mu
sudo -u suha /home/suha/araclar/kesif-botu/.venv/bin/python \
     /home/suha/araclar/kesif-botu/kesif_ajani.py
#   Kanıt: çıkış kodu 0 + Telegram'a mesaj düşmesi + log satırı

# 4) YENİ birim (BIST adından ayrılır)
sudo tee /etc/systemd/system/kesif-ajani.service >/dev/null <<'UNIT'
[Unit]
Description=Gunluk Kesif Ajani (AI radari) — BIST'ten bagimsiz
After=network-online.target
Wants=network-online.target
[Service]
Type=oneshot
User=suha
Group=suha
WorkingDirectory=/home/suha/araclar/kesif-botu
EnvironmentFile=-/home/suha/araclar/kesif-botu/.kesif.env
ExecStart=/home/suha/araclar/kesif-botu/.venv/bin/python /home/suha/araclar/kesif-botu/kesif_ajani.py
TimeoutStartSec=600
Nice=15
StandardOutput=append:/home/suha/araclar/kesif-botu/log/kesif.log
StandardError=append:/home/suha/araclar/kesif-botu/log/kesif.log
UNIT

sudo tee /etc/systemd/system/kesif-ajani.timer >/dev/null <<'UNIT'
[Unit]
Description=Kesif Ajani — her sabah 08:00 (Europe/Istanbul)
[Timer]
OnCalendar=*-*-* 08:00:00 Europe/Istanbul
Persistent=true
[Install]
WantedBy=timers.target
UNIT

sudo systemctl daemon-reload
sudo systemctl enable --now kesif-ajani.timer

# 5) ESKİYİ DURDUR (silme — geri dönüş kalsın)
sudo systemctl disable --now bist-kesif.timer
#    bist-kesif.service `static`; timer kapanınca tetiklenmez.

# 6) SONRA: BIST bozulmadı kanıtı (0. adımla AYNI komutlar)
systemctl is-active bist-api.service                    # beklenen: active
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8001/health   # beklenen: 403
systemctl list-timers 'bist-*' --all --no-pager         # kesif dışındakiler değişmemeli

# 7) Bir hafta sonra sorun yoksa eski dizin silinir (geri alınamaz — ayrı karar)
```

## 4. Riskler

| Risk | Önlem |
|---|---|
| venv mutlak yol gömer, kopya çalışmaz | Adım 2: venv **yeniden kurulur**, kopyalanmaz |
| `.kesif.env` içindeki Telegram token izinleri gevşer | Adım 1: `chmod 600` + `chown suha` |
| `suha` kullanıcısının erişemediği bir kaynak varsa bot sessizce boş koşar | Adım 3: **elle koşum + Telegram mesajı** zorunlu kanıt |
| `bist-kesif` adlı birime dokunmak BIST sanılır | Adım 5 yalnız **timer'ı kapatır**, birim dosyası SİLİNMEZ |
| İki bot aynı anda koşar (eski + yeni) | Adım 4 ve 5 **aynı oturumda** yapılır |

## 5. Kullanıcı kararı bekleyen

1. Taşıma yapılsın mı? (Kazanç: bot root'tan çıkar, `suha` altında
   denetlenebilir olur; log ve env kullanıcı erişimine girer.)
2. Yeni birim adı `kesif-ajani` olsun mu (BIST adından ayrılma)?
3. Eski `/root/araclar/kesif-botu` ne zaman silinsin? (Öneri: bir hafta
   sonra, ayrı karar — geri alınamaz işlem.)

---

## 6. UYGULAMA DOĞRULAMASI (29.07.2026, root gerekmeden ölçüldü)

Kullanıcı taşımayı root olarak koştu. Doğrulanabilir her şey `systemctl`
ve dosya sistemi üzerinden **bağımsız olarak** ölçüldü:

| Kontrol | Beklenen | Ölçülen |
|---|---|---|
| Yeni birim var mı | `kesif-botu.service` | **VAR** |
| Çalıştıran kullanıcı | `suha` | **`User=suha`** |
| Çalışma dizini | `/home/suha/araclar/kesif-botu` | **aynı** |
| Timer etkin mi | enabled | **enabled** |
| Sonraki koşum | 30 Tem 05:00 UTC | **Thu 2026-07-30 05:00:00 UTC** |
| Saat (TR) | 08:00 | `OnCalendar=*-*-* 08:00:00 Europe/Istanbul` |
| Eski timer | devre dışı | **`bist-kesif.timer` disabled · `0 timers listed`** |
| Dizin sahipliği | suha | `drwxr-xr-x suha suha` |
| Sırlar | 0600 | **`-rw------- suha suha .kesif.env`** |
| venv | suha altında, çalışır | `suha suha` · **Python 3.12.3** |
| Log dizini | yazılabilir | `drwxr-xr-x suha suha log/` |
| **BIST bozulmadı** | 28.07 tabanıyla aynı | **`bist-api` active** · `127.0.0.1:8001/health` → **403** (taban: 403) |

**Doğrulanmadı (root gerektirir / dış sistem):**
- `/root/araclar/kesif-botu` kopyasının durduğu — kullanıcı beyanı;
  `/root` okunamıyor.
- Telegram testi `message_id 4449` — kullanıcı beyanı; bot token'ı
  `.kesif.env`'de (0600) ve gönderim kaydı Telegram tarafında.

**Kalan tek karar:** eski `/root/araclar/kesif-botu` kopyası ne zaman
silinsin (öneri: bir hafta gözlem sonrası; geri alınamaz işlem, ayrı karar).
