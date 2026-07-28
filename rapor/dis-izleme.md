# DIŞ İZLEME — gereklilik, seçenekler, adım listesi (B2.2)

Tarih: 2026-07-28 · **Hiçbir hesap AÇILMADI, hiçbir servise kayıt olunmadı.**
Uygulanan tek şey §5'teki geçici köprüdür.

---

## 1. Neden gerekli — mevcut alarmların ortak kör noktası

Bugün üç alarm yolu var ve **üçü de sunucunun İÇİNDE**:

| Yol | Nerede biter |
|---|---|
| `UYARI-SAGLIK.md`, `UYARI-BARAJ.md` | depoya yazılır → push ile görünür |
| `log/pipeline.log` | sunucudaki dosya |
| `izleme/SITE-DURUM.md` | sunucudaki dosya (oturum açılışında okunur) |

Üçünün de çalışması için **sunucunun ayakta ve cron'un çalışıyor olması**
gerekir. Yani:

> Sunucu donarsa, cron ölürse, disk dolarsa ya da makine kapanırsa —
> **alarmın kendisi de susar.** Sistem "sessiz ölüm"ü yakalamak için
> kurulmuş ama alarm yolu aynı sessizliğe tabi.

Bu teorik değil: **23 Temmuz'da sunucu iki kez cevapsız kaldı**
(kullanılabilir RAM 90 MB, swap 6.047 MB — `rapor/sunucu-donma.md`).
O sırada hiçbir bildirim dışarı çıkmadı; durum sonradan elle fark edildi.

Ayrıca hatırlatma: **site sunucudan bağımsızdır** (Cloudflare Pages). Sunucu
ölse site ayakta kalır — ama veri üretimi durur ve bunu kimse görmez. İzlenmesi
gereken iki ayrı şey var:
1. **Site ayakta mı** (Cloudflare tarafı),
2. **Veri üretimi çalışıyor mu** (sunucu tarafı) ← asıl kör nokta.

---

## 2. Ücretsiz seçenekler — kıyas

| # | Seçenek | Ne izler | Maliyet | Ticari kullanım | Not |
|---|---|---|---|---|---|
| **D1** | **GitHub Actions zamanlanmış iş** | ikisi de (site HTTP + veri tazeliği) | **0 ₺** | **Serbest** | **Yeni sağlayıcı YOK** — depo zaten GitHub'da. Depo özel (`404` döndü → public değil); özel depoda Free plan **2.000 dk/ay** verir, 30 dakikada bir ~1 dk'lık iş ≈ **1.440 dk/ay** — sınırın içinde ama payı dar. 60 dakikada bir çalıştırmak payı ikiye katlar. |
| D2 | UptimeRobot ücretsiz | yalnız site HTTP | 0 ₺ | **HAYIR** — ücretsiz plan "kişisel, ticari olmayan kullanım" ile sınırlı | Site bir hukuk bürosunun ticari altyapısı → ücretsiz plan **uygun değil**. Ücretli $7/ay. |
| D3 | healthchecks.io ücretsiz (Hobbyist) | **veri üretimi** (ölü adam düğmesi) | 0 ₺ · 20 iş | **doğrulanmadı** — ToS'tan teyit gerekir; açık kaynak/kâr amacı gütmeyene ücretsiz Business veriyorlar, bu ticari kullanımın ücretsiz katmanda kısıtlı olabileceğini düşündürüyor | Modeli tam bizim ihtiyacımız: cron her koştuğunda bir URL'e ping atar; ping gelmezse SERVİS uyarır. Sunucu ölse bile uyarı çıkar. |
| D4 | Cloudflare Health Checks | yalnız site HTTP | **ücretli** (Pro+) | — | Kapsam dışı (satın alma yok). |
| D5 | İkinci bir makine (ör. kişisel bilgisayar) cron'u | ikisi de | 0 ₺ | Serbest | Makine sürekli açık değilse güvenilmez. |

**Tavsiye: D1 (GitHub Actions) + D3 (healthchecks.io, ToS teyidiyle).**
D1 tek başına da yeter ve hiçbir yeni hesap gerektirmez; D3 eklenirse
"cron hiç koşmadı" durumu için ikinci, bağımsız bir tanık olur.

---

## 3. D1 — kullanıma hazır iş akışı (KURULMADI)

Aşağıdaki dosya **repoya konmadı.** `.github/workflows/` altına konulan her
YAML push anında etkinleşir; bu, kullanıcı kararı olmadan dışarıya iş
başlatmak olurdu. Karar verilince tek dosya + tek gizli anahtar yeter.

`.github/workflows/dis-nabiz.yml`:

```yaml
name: dis-nabiz
on:
  schedule:
    - cron: '0 */1 * * *'      # saat başı (dakika bütçesi için; 30 dk da olur)
  workflow_dispatch:
jobs:
  nabiz:
    runs-on: ubuntu-latest
    steps:
      - name: Site ayakta mı
        run: |
          kod=$(curl -s -o /dev/null -w '%{http_code}' https://suharitasi.com/)
          echo "apex: $kod"
          [ "$kod" = "200" ] || { echo "SITE DOWN: $kod"; exit 1; }
      - uses: actions/checkout@v4
      - name: Veri üretimi çalışıyor mu (depoya son yazım yaşı)
        run: |
          # Sunucu ölürse pipeline commit atamaz; commit yaşı sunucunun
          # nabzıdır. Eşik 30 saat: en seyrek günlük iş 24 saatte bir yazar.
          son=$(git log -1 --format=%ct)
          yas=$(( ( $(date +%s) - son ) / 3600 ))
          echo "son commit: ${yas} saat önce"
          [ "$yas" -lt 30 ] || { echo "VERI URETIMI DURMUS: ${yas} saat"; exit 1; }
      - name: Arıza varsa haber ver
        if: failure()
        run: |
          curl -sS --fail -m 20 \
            --data-urlencode "chat_id=${{ secrets.TELEGRAM_CHAT_ID }}" \
            --data-urlencode "text=🔴 suharitasi dış nabız: ${{ github.job }} düştü — ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}" \
            "https://api.telegram.org/bot${{ secrets.TELEGRAM_BOT_TOKEN }}/sendMessage"
```

**Bu iş akışının değeri:** GitHub'ın makinelerinde çalışır. Hetzner tamamen
ölse bile hem "site ayakta mı"yı hem "veri üretimi durdu mu"yu görür ve
haber verir. Sunucudan tamamen bağımsız tek seçenek budur.

**Dikkat:** GitHub zamanlanmış işleri yoğun saatlerde **gecikebilir**
(dakikası garanti değildir). Saatlik nabız için sorun değil.

---

## 4. Panel adımları — sırayla (SİZİN YAPMANIZ GEREKEN)

### 4.A Telegram kanalı (hem §5 köprüsü hem D1 için gerekli)
1. Telegram'da **@BotFather**'a yazın → `/newbot` → bot adı verin.
2. BotFather'ın verdiği **token**'ı saklayın (`123456:ABC-...` biçiminde).
3. Yeni botunuza Telegram'dan bir mesaj gönderin ("merhaba" yeter).
4. Tarayıcıda açın: `https://api.telegram.org/bot<TOKEN>/getUpdates` →
   dönen JSON'da `"chat":{"id":...}` alanındaki sayı sizin **chat id**'nizdir.
5. Sunucuda `/home/suha/projeler/suharitasi/.env` dosyasına iki satır ekleyin:
   ```
   TELEGRAM_BOT_TOKEN=<token>
   TELEGRAM_CHAT_ID=<chat id>
   ```
6. Doğrulama (sunucuda):
   `arac/uyari-gonder.sh "kurulum testi" "kanal çalışıyor"` → telefonunuza
   mesaj gelmeli. Gelmezse `log/uyari.log` sebebi yazar.

### 4.B GitHub Actions (D1)
1. Depo → **Settings → Secrets and variables → Actions → New repository
   secret** → `TELEGRAM_BOT_TOKEN` ve `TELEGRAM_CHAT_ID` ekleyin.
2. Bana "Actions hazır" deyin — §3'teki YAML `.github/workflows/` altına
   konur ve ilk koşumu elle tetiklenip **ölçülür** (yeşil koşu + kasten
   bozulmuş eşikle kırmızı koşu).
3. Aylık dakika kullanımını bir hafta sonra kontrol edin
   (**Settings → Billing**); 2.000 dk sınırına yaklaşıyorsa cron'u
   `0 */2 * * *`'ye seyreltin.

### 4.C healthchecks.io (D3 — isteğe bağlı)
1. Önce **ToS'ta ücretsiz planın ticari kullanıma açık olup olmadığını
   teyit edin** (bu rapor bunu doğrulayamadı).
2. Uygunsa hesap açın → her cron işi için bir "check" oluşturun
   (`baraj`, `grace`, `su-izleme`, `site-saglik`, `yedek`).
3. Her check'in ping URL'sini bana verin — ilgili script'in **başarı
   yolunun sonuna** (commit teyidinden SONRA) tek satır `curl` eklenir.
   Kritik: ping başarı teyidinden sonra atılmalı, yoksa "çalıştı ama
   başarısız oldu" durumu yeşil görünür.

---

## 5. UYGULANAN GEÇİCİ KÖPRÜ — `arac/uyari-gonder.sh`

Dış izleme kurulana kadar en azından uyarıyı **sunucudan çıkaran** bir yol
kuruldu.

| Ne | Nasıl |
|---|---|
| Kanal | Telegram Bot API (`sendMessage`) |
| Yapılandırma | `.env` → `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` |
| Bağlanan iş | `saglik-bekcisi.sh` — kırmızı olduğunda çağırır |
| Kurulmamışsa | **arıza sayılmaz**: log'a + stdout'a "KANAL YAPILANDIRILMADI" yazar, `exit 0` — çağıran işi düşürmez |
| Gönderim başarısızsa | log'a yazar, `exit 1` — hata YUTULMAZ |
| root bağımlılığı | **YOK** — `/root` altındaki BIST bildirim altyapısına dokunulmaz, ayrı bot |

**Falsifikasyon ölçüldü (3/3):**

| Senaryo | Beklenen | Ölçülen |
|---|---|---|
| Kanal yapılandırılmamış | uyarı ver, çağıranı düşürme | `exit 0` + "KANAL YAPILANDIRILMADI" ✓ |
| Sahte token | gönderim başarısız, hata görünür | `exit 1` + log satırı ✓ |
| Bekçi kırmızı yolu (sanal kök) | UYARI.md yazılsın + köprü çağrılsın | ikisi de ✓ (`uyari.log`'da kayıt) |

### 5.1 KÖPRÜNÜN SINIRI — açıkça
> Bu köprü **sunucu çalışırken** oluşan uyarıları dışarı taşır.
> **Sunucu tamamen kapanırsa hiçbir mesaj gitmez** — kapalı makine mesaj
> gönderemez. "Sessizlik" ile "her şey yolunda" hâlâ ayırt edilemiyor.
> Bu ayrımı yalnız **dış** bir izleyici (D1/D3) yapabilir; o karar sizde.

---

## 6. Kullanıcı kararı bekleyenler
1. Telegram kanalı kurulsun mu (§4.A — 5 dakika, ücretsiz)? **Bu yapılmadan
   köprü çalışmaz.**
2. GitHub Actions dış nabzı açılsın mı (§4.B — ücretsiz, yeni sağlayıcı yok)?
3. healthchecks.io ToS'u ticari kullanıma uygun mu; uygunsa açılsın mı (§4.C)?

**Sources:**
- [UptimeRobot free plan limits](https://stillup.org/blog/uptimerobot-free-plan-limits)
- [Healthchecks.io pricing](https://healthchecks.io/pricing/)
