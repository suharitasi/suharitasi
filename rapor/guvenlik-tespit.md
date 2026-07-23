# Güvenlik Tespit Raporu — Faz A (keşif, salt-tespit)

**Tarih:** 2026-07-23 · **Brief:** GÜVENLİK SERTLEŞTİRME v3 (`cikti/brief/guvenlik-v3.md`)
**Kapsam:** yalnız tespit + rapor. Hiçbir ayar değiştirilmedi, servis restart edilmedi,
paket kurulmadı/güncellenmedi, sır rotasyonu yapılmadı. Tek yazma: bu rapor + commit/push.
**Sır koruma:** hiçbir sırrın DEĞERİ okunmadı/yazılmadı; yalnız anahtar ADLARI, dosya:satır
ve imza sınıflandırması raporlandı.

---

## 0. Brief ön-kapı denetimi + düşman geçişi + amaç özeti

**Denetçi (`arac/brief-denetci.mjs`):** ilk koşuda 1 ENGEL (T7 uydurma-yasağı kapısı) + 2 UYARI.
Üçü de mekanik (ekleme/netleştirme) → `guvenlik-v3-duzeltilmis.md`'de yalnız EKLEME ile giderildi
(silme/daraltma yok, madde 4e). İkinci koşu: **0 ENGEL**, 1 UYARI kaldı.
- **Kalan UYARI [T1]:** `rapor/guvenlik-tespit.md` repoda yok → bu, üretilecek ÇIKTI dosyasıdır
  (bu rapor). False positive; iş sürdü.

**Düşman geçişi (D1–D4):**
- **D1 çelişen şart:** "hiçbir ayar değiştirilmez" ↔ "rapor commit+push" — çelişki değil, brief'te
  açık istisna. ✓
- **D2 geçemeyecek test:** sudo gerektiren kontroller (sshd -T, ufw, lastb) Claude Code'da geçemez;
  brief bunları önceden "KULLANICI KOMUTU GEREKLİ" tanımlamış → sessiz atlama yok, etiketlendi. ✓
- **D3 boş referans:** `rapor/guvenlik-tespit.md` (üretilecek çıktı) + `CLAUDE-SECURITY-...` (var, okundu). ✓
- **D4 kanıt hafifletme:** SIR KORUMA gövde yazımını yasaklar ↔ B4 "dosya:satır ver" — dosya:satır
  sır değildir, çelişki yok. ✓

**Amaç özeti (3b):**
- **Amaç:** statik site (Cloudflare Pages) + pipeline sunucusunun (Hetzner) güvenlik durumunu üç
  katmanda TESPİT etmek; değişiklik yapmadan rapor üretmek.
- **Dokunulmazlar:** ayarlar, servisler, paketler, sır rotasyonu, sır DEĞERLERİ (yazılmaz).
- **Bitti-tanımı:** bu rapor + sondaki 4 liste + commit/push (git kilidiyle).
- **Kanıtlar:** komut çıktıları, dosya:satır, canlı üretim URL'sinden (https://suharitasi.com)
  alınan başlıklar, imza-tabanlı uzak sızıntı testi.

---

## 1. KÖR NOKTALAR (mükerrer taramayı önlemek için açıkça işaretlenir)

**CLAUDE-SECURITY-20260722** taraması bilinçli KAPSAM DIŞI bıraktığı 7 alan (kör nokta,
bu taramada da kod-düzeyi denetlenmedi): `.claude/`, `arsiv/`, `cikti/`, `icerik-taslak/`,
`kaynak/`, `rapor/`, `referans/`. Not: bu taramada bunların yalnız **sır sızıntısı** açısından
kontrolü yapıldı (`.claude/settings.local.json` gitignore'da ✓; loglarda sır izi yok ✓);
kod-güvenlik açısından hâlâ kör nokta.

**Bu Faz A taramasının kendi kör noktaları (sudo/panel gerektirenler):**
1. Etkin sshd yapılandırması (`sshd -T`) — sudo → KULLANICI KOMUTU.
2. ufw kural seti — sudo → KULLANICI KOMUTU.
3. Başarısız giriş denemeleri (`/var/log/btmp`, lastb) — sudo → KULLANICI KOMUTU.
4. Cloudflare panel: 2FA, API token kapsamı, deploy hook sahipliği → KULLANICI PANELİ.
5. GitHub panel: 2FA, PAT/deploy-key kapsamı, Actions izinleri → KULLANICI PANELİ.
6. `50-cloud-init.conf` içeriği (root-okunur, 27 bayt) → KULLANICI KOMUTU.
7. Git geçmişi: yalnız desen (pickaxe) taraması yapıldı; entropi/gizli-blob taraması değil.
8. Eş-barındırılan `arslanhukuk.tr` uygulamaları (uvicorn) denetlenmedi — kapsam dışı, ama B2'de
   çapraz-risk notu var.

---

## 2. KATMAN-0 — HESAPLAR VE ERİŞİM (statik sitede asıl saldırı yüzeyi)

### K0.1 Cloudflare hesabı — **DURUM: KULLANICI PANELİ GEREKLİ** · RİSK 🟡 (doğrulanamadı)
2FA / API token kapsamı / deploy hook sahipliği panelden görülür; sunucudan doğrulanamaz.
`.env`'de yalnız `CF_DEPLOY_HOOK` var (aşağıda K0.3). **Faz B:** panelden 2FA açık mı, token
Global API Key mi yoksa Zone-scoped mi teyit (adım tarifi §Liste-3).

### K0.2 GitHub deposu — **DURUM: var (private ✓)** · RİSK 🟢 / 2FA doğrulanamadı 🟡
- **KANIT:** yetkisiz istek `github.com/suharitasi/suharitasi → HTTP 404` = **PRIVATE** (push çalışıyor,
  yani mevcut ve private). Depo aynı zamanda tracked veri için offsite yedektir (bkz. B6).
- 2FA / PAT kapsamı / Actions izni panel gerektirir (`gh` CLI kurulu değil) → KULLANICI PANELİ.

### K0.3 Sunucudaki token kapsamları — **DURUM: var** · RİSK 🟢 (değer okunmadı)
- **KANIT:** `cut -d= -f1 .env` → `EPIAS_USER`, `EPIAS_PASS`, `CF_DEPLOY_HOOK` (3 anahtar; DEĞER OKUNMADI).
  `.env.example` ayrıca `EARTHDATA_TOKEN` listeler ama gerçek `.env`'de yok (GRACE ham indirme için,
  şu an kullanılmıyor ya da başka yolla).
- **Yetki genişliği değerlendirmesi:**
  - `CF_DEPLOY_HOOK`: yalnız TETİKLEME URL'si (Cloudflare Pages build tetikler); hesap-geneli yetki
    DEĞİL. Sızsa etki: yetkisiz deploy tetikleme (içerik değiştiremez). Düşük yetki. 🟢
  - `EPIAS_USER`/`EPIAS_PASS`: EPİAŞ şeffaflık platformu giriş bilgisi (kamusal veri portalı);
    parasal/kritik yetki değil. Sızsa etki sınırlı. 🟡 (yine de rotasyon adayı).

### K0.4 Erişim envanteri — **DURUM: var** · RİSK 🔴 (root doğrudan internetten — bkz. B1)
- **KANIT:** `~/.ssh/authorized_keys` = 3 anahtar (ANAHTAR yazılmadı, yalnız tip+yorum):
  `1: ed25519 arslan_family@mac` · `2: ed25519 root@ubuntu-4gb-hel1-2` · `3: ed25519 samet@AvSerdar-ARSLAN-2.local`.
  → **İnceleme gerektiren:** anahtar #3 (`samet@...`) — bu üçüncü kişi (Samet) erişimi bilinçli mi?
  Anahtar #2 sunucuda root olarak üretilmiş bir anahtarın suha hesabını yetkilendirmesi.
- **KANIT:** `last root` → root **doğrudan internetten parolayla/anahtarla giriş yapıyor**:
  `5.27.203.220`, `176.33.68.212`, `31.143.51.157` (son günler, farklı IP'ler). Bu, B1 🔴'nın
  canlı kanıtıdır.
- Kullanıcılar (shell'li): `root`, `suha`, `postgres` (postgres = eş-barındırılan DB, bkz. B2).

---

## 3. KATMAN-1 — SİTE / CLOUDFLARE

### A1 Güvenlik başlıkları — **DURUM: var (6/6)** · RİSK 🟢 (tek 🟡: script-src 'unsafe-inline')
- **KANIT (canlı `curl -D -` https://suharitasi.com/):**
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` ✓ (mükemmel)
  - `X-Frame-Options: DENY` ✓ · `X-Content-Type-Options: nosniff` ✓
  - `Referrer-Policy: strict-origin-when-cross-origin` ✓
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()` ✓
  - `Content-Security-Policy:` `default-src 'self'`; `object-src 'none'`; `base-uri 'self'`;
    `frame-ancestors 'none'`; `connect-src 'self'` — hepsi ✓.
- **CSP yeterlilik:** güçlü. **Tek zayıflık:** `script-src 'self' 'unsafe-inline'` ve
  `style-src ... 'unsafe-inline'`. `'unsafe-inline'` XSS'e karşı savunmayı zayıflatır; statik sitede
  inline script/stil olduğu için konmuş. Kaynak kod olarak yönetiliyor: `public/_headers` (canlıyla birebir).
- **Faz B önerisi (UYGULANMADI):** inline script'leri nonce/hash'e taşıyıp `script-src`'den
  `'unsafe-inline'` kaldırmak (Astro CSP entegrasyonu). style-src için de aynı. Kırılma riski
  yüksek olduğundan ayrı bir işte, canlı testle.

### A2 Sızıntı testi (iki taraflı) — **DURUM: temiz** · RİSK 🟢
- **(a) YEREL dist/:** `.env*` yok, `.git*` yok, `node_modules` yok, `src/` yok, `*.map`=0,
  `*.bak/*.sql/*.log` yok, nokta-dosya yok. **KANIT:** `find dist ...` boş döndü.
- **(b) UZAK (imza kontrolü, SIR KORUMA):** 8 hassas yol test edildi — hepsi **HTTP 404 + HTML(404 sayfası)**,
  gerçek dosya imzası YOK:
  `/.env`, `/.git/config`, `/.git/HEAD`, `/package.json`, `/package-lock.json`, `/astro.config.mjs`,
  `/src/`, `/.env.example` → tümü `kod=404 imza=HTML`. **Kritik-durma (i) tetiklenmedi.** ✓

### A3 Kaynak sızıntısı — **DURUM: temiz** · RİSK 🟢
- **KANIT:** dist'te source map yok (`*.map`=0); `grep -rlnE '(/home/suha|EPIAS|CF_DEPLOY|api_key|BEGIN PRIVATE)' dist`
  → eşleşme YOK (iç yol/anahtar/e-posta izi yok).

### A4 Domain/yönlendirme — **DURUM: kısmen** · RİSK 🟡
- **KANIT (canlı):**
  - `http://suharitasi.com/ → 200 https://...` ✓ (HTTP→HTTPS)
  - `https://suharitasi.tr/ → 301 https://suharitasi.com/` ✓ (.tr → .com)
  - `https://www.suharitasi.com/ → 522` 🟡 (Cloudflare origin timeout — www düzgün yapılandırılmamış)
  - `http://suharitasi.tr/ → timeout (000)` 🟡 (.tr HTTP dinlemiyor; HTTPS çalışıyor)
- **CAA DNS kaydı: YOK** (`dig +short CAA suharitasi.com` boş) 🟡.
- **Faz B önerisi:** (1) `www` için Cloudflare'de apex'e 301 kuralı ekle; (2) CAA kaydı ekle
  (yalnız Cloudflare/izinli CA sertifika verebilsin), ör. `0 issue "cloudflare.com"` + Let's Encrypt/Google
  gerekiyorsa. İkisi de UYGULANMADI.

### A5 SEO/indeksleme — **DURUM: doğru** · RİSK 🟢
- **KANIT:** `robots.txt` → `User-agent: * → Content-Signal: search=yes,ai-train=no,use=reference; Allow: /`.
  Scraper botları engelli (`Amazonbot`, `Applebot-Extended`, `Bytespider` → Disallow: /).
  Arama + AI-arama botları (Googlebot/Bingbot/GPTBot/ClaudeBot/PerplexityBot) engelli DEĞİL →
  kopyalanma-direnci ilkesine uygun (SEO/GEO önce). `Sitemap: https://suharitasi.com/sitemap.xml` var,
  `sitemap.xml → 200`. Gizlenmesi gereken hassas yol yok (statik site).

---

## 4. KATMAN-2 — HETZNER SUNUCUSU

### B1 SSH etkin ayarı — **DURUM: eksik (sertleştirilmemiş)** · RİSK 🔴 ACİL
- **KANIT (ana config, sudosuz okundu `/etc/ssh/sshd_config`):** `PermitRootLogin yes`;
  `PasswordAuthentication` ve `PubkeyAuthentication` yorumlu (`#`) → varsayılan (password=yes).
- **KANIT (canlı):** root son günlerde farklı internet IP'lerinden GİRİŞ yaptı (K0.4). Yani root'a
  doğrudan internetten erişilebiliyor.
- **Include:** `/etc/ssh/sshd_config.d/` içinde yalnız `50-cloud-init.conf` (root-okunur, 27 bayt —
  içerik sudo gerektirir; Ubuntu'da bu dosya çoğ. `PasswordAuthentication` ezer).
- **ETKİN değerler için KULLANICI KOMUTU GEREKLİ** (§Liste-2). Beklenen: 🔴.
- **Faz B (brief kuralı):** SSH sertleştirmesi script'e BIRAKILMAZ — ikinci SSH oturumu açık tutularak
  ekran-ekran birlikte: `PermitRootLogin no` (veya `prohibit-password`), `PasswordAuthentication no`,
  `PubkeyAuthentication yes`. Erişim kaybı riski nedeniyle test edilerek.

### B2 Portlar / dinleyen servisler — **DURUM: var** · RİSK 🟡 (çapraz-barındırma) / 🟢 (izolasyon iyi)
- **KANIT (`ss -tulpn`, sudosuz):**
  - **Herkese açık:** `0.0.0.0:22` (SSH), `*:80` + `*:443` + `udp *:443` (**Caddy**, `Server: Caddy` teyitli).
  - **Localhost'a bağlı (iyi):** `127.0.0.1:5432` (postgres), `127.0.0.1:2019` (Caddy admin),
    `127.0.0.1:8001` + `127.0.0.1:8020` (uvicorn), `127.0.0.1:8010` (Python BaseHTTP).
- **80/443'ün ne servis ettiği (Caddy admin :2019'dan çözüldü):** `arslanhukuk.tr`, `serdararslan.tr`
  (+www) — **AYRI projeler**, suharitasi DEĞİL (suharitasi Cloudflare Pages'te). Caddy bunları
  `127.0.0.1:8001/8010/8020`'ye reverse-proxy ediyor + file_server.
- **Değerlendirme:** beklenmedik servis YOK (kritik-durma iii tetiklenmedi); pipeline servisleri
  127.0.0.1'e bağlı ✓. **Çapraz-risk 🟡:** aynı sunucuda suharitasi'nin `.env`'i + veri arşivi + eş-barındırılan
  `arslanhukuk.tr` uvicorn uygulamaları var. arslanhukuk uygulamasında bir açık → sunucu erişimi →
  suharitasi sırları/verisi. Eş-barındırma bilinçli mi, Faz B'de değerlendirilmeli.
- **ufw durumu:** KULLANICI KOMUTU GEREKLİ (§Liste-2).

### B3 Güncellemeler — **DURUM: var (otomatik açık)** · RİSK 🟡
- **KANIT:** `apt list --upgradable` → 3 güvenlik güncellemesi bekliyor: `libarchive13t64`,
  `libjbig2dec0`, `snapd`. `unattended-upgrades` config: `/etc/apt/apt.conf.d/20auto-upgrades`
  → `Update-Package-Lists "1"; Unattended-Upgrade "1";` = **otomatik güvenlik güncellemesi AÇIK** ✓.
  Bekleyen 3'ü otomatik uygulanacak.
- **Kesin etkinlik teyidi için KULLANICI KOMUTU** (§Liste-2). Kurulum YAPILMADI.

### B4 Sırlar — **DURUM: temiz (iyi hijyen)** · RİSK 🟢
- **KANIT:** `.env` izinleri `-rw-------` (600) ✓; `.gitignore:17 .env` ✓; `git log --all -- .env` **boş**
  (hiç commit edilmemiş) ✓.
- **Git geçmişi pickaxe (değer YAZILMADI):** `EPIAS_PASS=`→1, `CF_DEPLOY_HOOK=`→2, `password=`→1 commit.
  **Hepsi doğrulandı, gerçek sır DEĞİL:**
  - `.env.example` (placeholder, tanımı gereği), `README-BARAJ.md` (kurulum talimatı/placeholder).
  - `arac/baraj-gunluk.sh:67` + `arac/grace-guncelle.sh:117`: `HOOK=$(grep '^CF_DEPLOY_HOOK=.+' .env | cut -d= -f2-)`
    → değeri RUNTIME'da `.env`'den okuyor, literal YOK.
  - `arac/baraj-cek.mjs:54`: `password=${encodeURIComponent(env.EPIAS_PASS)}` → env değişkeni, literal YOK.
  - `SMTP_PASS`, `api_key`, `BEGIN PRIVATE KEY` → 0 commit.
- **Sonuç:** **git geçmişinde aktif sır YOK** (kritik-durma ii tetiklenmedi). Loglarda da sır izi yok.
- **(iii) BİLİNEN İFŞA DEĞERLERİ:** brief bu değerleri içermez, tahmin edilmedi →
  **kullanıcıdan bilinen ifşa listesi istendi** (§Liste-4).

### B5 Bağımlılıklar — **DURUM: var** · RİSK 🟡 (build-time/dev, üretimde değil)
- **KANIT (`npm audit`, salt okuma):** 3 zafiyet (1 low, 2 high). High'lar:
  `esbuild` (dev-server, yalnız Windows dosya okuma — dev bağımlılığı, üretim statik çıktısında YOK),
  `sharp`/libvips (CVE-2026-33327/33328/35590/35591 — build-time görsel işleme, servis edilmiyor).
  `package-lock.json` var ✓.
- **Değerlendirme:** ikisi de **build/dev-time**; deploy edilen statik siteye girmiyor → gerçek maruziyet düşük.
- **Faz B önerisi:** ayrı bir işte `npm audit fix` (breaking olmayan) + sharp/esbuild sürüm yükseltme,
  build çıktısı + Lighthouse regresyon testiyle. Bu fazda KALDIRILMADI/DÜZELTİLMEDİ.

### B6 Yedek durumu — **DURUM: kısmi (GitHub var, ikinci offsite yok)** · RİSK 🟡
- **KANIT (offsite = GitHub, private):**
  - `data/arsiv`: **209 dosya / ~24M TRACKED (GitHub'da)** ✓ — işlenmiş DSİ/baraj/GRACE verisi.
  - `kaynak/dsi-arsiv`: **56M / 231 dosya TRACKED** ✓ (gitignore istisnası) — ham DSİ arşivi.
  - Yani **"tacın mücevheri" DSİ verisi + kaynak kod GitHub'da (offsite mevcut).**
- **Offsite'sı OLMAYAN (gitignored + yalnız yerel):**
  - `data/arsiv/grace/ham`: **507M** NetCDF — sha256 git'te kayıtlı, NASA EARTHDATA'dan yeniden indirilebilir (yeniden-üretilebilir).
  - `kaynak-video`: **22M** ham Midjourney — encode sürümleri serviste; yeniden üretimi pahalı (asıl offsite açığı).
  - `cikti`: **190M** üretilen ekran görüntüsü/PDF — yeniden-üretilebilir.
  - `.env`: 173 bayt — değerleri geri-elde-edilebilir (EPİAŞ girişi, CF hook yeniden üretilir).
- **Yedek otomasyonu:** rsync KURULU ama kullanan yedek scripti YOK; rclone/restic/borg kurulu değil.
  Tek offsite = GitHub hesabı (tek nokta). Geri yükleme testi yapılmamış.
- **Faz B önerisi:** (1) GitHub-dışı ikinci offsite kopya (ör. haftalık rsync/rclone → Hetzner Storage Box
  ~ düşük maliyet; **ücretli hizmet — NOT edildi, seçilmedi**); en azından `kaynak-video` (22M) + `.env` için;
  (2) yıllık geri-yükleme testi. UYGULANMADI.

### B7 Log/izleme — **DURUM: kısmi** · RİSK 🟡 / 🟢
- **KANIT:** proje logları için `/etc/logrotate.d/` altında **suharitasi kaydı YOK** 🟡 — ama loglar
  şu an küçük (site-saglik-cron.log, pipeline.log = 4K). `fail2ban` **KURULU + active** ✓ (SSH brute-force
  kısmi azaltma). Loglarda sır izi YOK ✓ (`grep EPIAS_PASS|CF_DEPLOY_HOOK|password|token log/ ...` boş).
- **Sertifika:** suharitasi TLS = Cloudflare yönetir (oto-yenileme); Caddy eş-barındırılan siteler için
  oto-yönetir. suharitasi cert bitişi ayrıca izlenmiyor (Cloudflare-yönetimli, düşük risk).
- **Disk doluluk:** bekçide (`saglik-bekcisi.sh`) bellek var; disk doluluk uyarısı doğrulanmadı.
- **Faz B önerisi:** büyüyen jsonl/cron logları için logrotate kaydı; bekçiye disk-doluluk eşiği.

---

## 5. C — UYGULANAMAZ MADDELER (gerekçeli)

Statik site + sunucu-tarafı istek işleme YOK olduğundan:
- **SQL/parametreli sorgu** — uygulanamaz: site DB'ye sorgu atmaz (postgres eş-barındırılan başka proje için).
- **CSRF** — uygulanamaz: oturum/state-değiştiren form yok.
- **Dosya yükleme güvenliği** — uygulanamaz: yükleme yok.
- **Uygulama oran sınırı** — uygulanamaz: sunucu-tarafı endpoint yok (Cloudflare edge rate-limit ayrı katman).
- **Debug modu** — uygulanamaz: çalışan uygulama sunucusu yok (statik build).
- **TLS sertifika yenileme** — uygulanamaz (bizde): Cloudflare yönetir.
- **fail2ban-web** — uygulanamaz: web origin bizde değil (Cloudflare edge).
- **Host header doğrulaması / açık yönlendirme / SSRF** — uygulanamaz: sunucu-tarafı istek işleme/proxy yok
  (suharitasi tarafında; Caddy proxy'si arslanhukuk'a ait, kapsam dışı).

**UYARI — gelecekte yürürlüğe girer:** Buttondown/bülten veya herhangi bir FORM eklendiğinde brief'in
6. maddesi (sunucu-tarafı doğrulama, CSRF, honeypot, oran sınırı, e-posta header injection) YÜRÜRLÜĞE GİRER.
→ **Buttondown işinin ÖN KOŞULU olarak SIRADAKILER'e yazılmalı** (bu rapor öneriyor).

---

## 6. D — SÜREKLİLİK (Faz B'de `site-saglik.mjs`'e eklenecek kontrol adayları — BU FAZDA KOD YAZILMADI)

1. **Güvenlik başlıklarının varlığı** — 6 başlık canlı `curl -I` ile; eksilirse 🔴 (regresyon yakalar).
2. **Sızıntı yollarının gerçek içerik döndürmemesi** — `/.env`, `/.git/config`, `/package.json` → 404 + HTML imza
   beklenir; gerçek dosya imzası dönerse 🔴.
3. **Sertifika bitiş tarihi** — suharitasi.com TLS son kullanma < 21 gün → 🟡.
4. **Bekleyen güvenlik güncellemesi sayısı** — `apt list --upgradable | grep security` eşiği.
5. **Yedek tazeliği** — ikinci offsite kurulursa son yedek yaşı; kurulmadıysa "offsite yok" 🟡 bayrağı.
6. **CAA kaydı varlığı** — `dig CAA` boşsa 🟡 (A4).

**Kör nokta sürekliliği:** CLAUDE-SECURITY'nin kapsam dışı 7 alanı (§1) bu taramada da kod-güvenlik
açısından kör kaldı; gelecekte odaklı bir tarama gerekebilir.

---

## 7. SON — DÖRT LİSTE

### (1) 🔴 ACİL — kapanmayan açıklar (kritiklik sırasıyla)
1. **SSH: root doğrudan internetten erişilebilir + parola auth muhtemel** (B1, K0.4). Ana config
   `PermitRootLogin yes`; root son günlerde farklı internet IP'lerinden giriş yaptı. → Faz B'de
   ikinci oturum açık tutularak birlikte kapatılacak (script'e bırakılmaz). **Etkin değer için
   önce Liste-2 komutu çalıştırılmalı.**
2. *(Not: A2b uzak sızıntı, git geçmişi sır, beklenmedik servis — ÜÇÜ DE TEMİZ çıktı; ACİL değil.)*

### (2) KULLANICI KOMUTU GEREKENLER (tam komutlar — çıktıyı bana iletin)
```bash
# B1 — SSH etkin ayarı (include ezmelerini de gösterir):
sudo sshd -T | grep -Ei 'permitrootlogin|passwordauthentication|pubkeyauthentication'
# B1 — cloud-init ezme dosyası içeriği:
sudo cat /etc/ssh/sshd_config.d/50-cloud-init.conf
# B2 — güvenlik duvarı:
sudo ufw status verbose
# B2 — port süreç adları (tam):
sudo ss -tulpn
# B3 — otomatik güncelleme kesin çalışıyor mu:
sudo unattended-upgrades --dry-run --debug 2>&1 | tail -20
# B7 — başarısız SSH giriş denemeleri (brute-force göstergesi):
sudo lastb -n 20
# B7 — disk doluluk:
df -h /
```

### (3) KULLANICI PANELİ GEREKENLER (adım tarifleriyle)
- **Cloudflare (K0.1):**
  1. dash.cloudflare.com → sağ üst profil → **My Profile → Authentication** → 2FA açık mı?
  2. **My Profile → API Tokens** → token listesi: **Global API Key kullanılıyorsa** onu bırakıp
     yalnız Pages-deploy için **Zone-scoped/Pages-scoped token**'a geçmek daha güvenli (kapsam daraltma).
  3. suharitasi projesi → **Settings → Builds & deployments → Deploy hooks** → hook kimde/kaç tane.
- **GitHub (K0.2):**
  1. github.com → Settings → **Password and authentication** → 2FA açık mı?
  2. Settings → **Developer settings → Personal access tokens** → suharitasi push'u hangi PAT/deploy-key ile,
     kapsamı `repo` ile sınırlı mı (fazla yetki var mı)?
  3. Depo → Settings → **Actions → General** → workflow izinleri (varsa) read-only mı?

### (4) KULLANICIDAN İSTENEN BİLGİ
- **Bilinen ifşa edilmiş kimlik listesi (B4-iii):** geçmişte herhangi bir yerde (eski commit, ekran
  paylaşımı, e-posta, başka repo) sızmış olabileceğini bildiğin `EPIAS_PASS`, `CF_DEPLOY_HOOK`,
  `EARTHDATA_TOKEN` değeri var mı? Varsa (değerini DEĞİL, hangisi olduğunu söyle) rotasyon planına alınır.
  Brief bu değerleri içermedi, tahmin edilmedi.
- **Erişim doğrulama (K0.4):** `~/.ssh/authorized_keys` anahtar #3 `samet@AvSerdar-ARSLAN-2.local` —
  bu erişim (Samet) bilinçli ve güncel mi? Değilse Faz B'de kaldırılır.
- **Eş-barındırma (B2):** arslanhukuk.tr/serdararslan.tr aynı sunucuda; bu bilinçli mi, yoksa
  suharitasi'yi ayrı sunucuya taşımak/izole etmek gündemde mi?

---

**Faz A tamamlandı — DUR.** Hiçbir ayar değiştirilmedi. Faz B (SSH sertleştirme + kalan öneriler)
kullanıcı kararı ve canlı-oturum eşliğinde yapılır.
