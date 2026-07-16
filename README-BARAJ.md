# HENDEK FAZ 1 — Baraj pipeline: kullanıcı adımları

Pipeline kurulu ve mock testten geçti. Gerçek çekimin başlaması için
**tek eksik: EPİAŞ kimliği**. Şifre asla repoya/log'a girmez.

## 1) EPİAŞ kimliği (zorunlu, 1 dakika)

```bash
cd /root/projeler/suharitasi
cp .env.example .env
nano .env        # EPIAS_USER=üyelik e-postan, EPIAS_PASS=şifren
```

Doğrulama (şifre görüntülenmez, yalnız TGT alınıp alınmadığı görünür):

```bash
node arac/baraj-cek.mjs
```

Başarıda: `TGT alındı (HTTP 201)` → havza/baraj listeleri → günün ham
JSON'u `data/arsiv/baraj/YYYY-MM-DD/` altına düşer, normalize seri
`data/canli/baraj.json`'a işlenir. Cron zaten kurulu (her gün 18:00 TR);
ilk elle çalıştırma sonrası dokunmak gerekmez.

## 2) Cloudflare deploy hook (opsiyonel, tek ekran)

Pages projesi git'e bağlıysa cron'un günlük push'u build'i zaten tetikler —
hook GEREKMEZ. Yine de bağımsız tetikleyici istersen:

1. Cloudflare panel → Workers & Pages → suharitasi → **Settings**
2. **Builds & deployments → Deploy hooks → Add deploy hook**
3. Ad: `baraj-gunluk`, branch: `main` → **Add** → çıkan URL'yi kopyala
4. `.env` içine yapıştır: `CF_DEPLOY_HOOK=https://api.cloudflare.com/...`

## 3) Arıza uyarısı hakkında not

Sunucuda posta aracı (MTA) yok. 3 gün üst üste çekim başarısız olursa
pipeline `UYARI-BARAJ.md` dosyasını yazar ve push eder — GitHub'da görünür.
Gerçek e-posta uyarısı istersen SMTP bilgisi gerekir (ör. `msmtp` +
Gmail uygulama şifresi); isteyince kurarım.

## Kurcalama güvenliği

- `.env` gitignore'da; `git status` temiz kalır.
- Ham arşiv (`data/arsiv/baraj/`) EPİAŞ cevabının değiştirilmemiş halidir;
  değeri hamlığında — elle düzenleme yapılmaz.
- EPİAŞ geriye dönük veri vermez: kayıt başlangıcından önceki günler için
  veri YOKTUR; pipeline da site de sahte geçmiş üretmez.
