# Su Kanunu bülteni — kurulum (5 dakika, kullanıcı yapar)

Form kodu HAZIR ve yerinde. Tek eksik: Buttondown hesabı ve kullanıcı adı.
Kullanıcı adı girilene kadar form **hiçbir sayfada görünmez** (bilinçli:
e-postayı alıp hiçbir yere göndermeyen sahte form yayınlanmaz).

## Adımlar

1. https://buttondown.com/register adresinden ücretsiz hesap aç
   (ücretsiz katman: 100 aboneye kadar, kredi kartı istemez).
2. Açılışta seçtiğin kullanıcı adını not et. Bülten adresin
   `buttondown.com/<kullanici-adi>` olur.
3. `src/data/bulten.ts` dosyasında tek satırı doldur:

   ```ts
   export const BUTTONDOWN_KULLANICI = 'suharitasi';   // ← kendi kullanıcı adın
   ```

4. `npm run build` → form `/su-kanunu/` ve `/su-kanunu/taslak-takibi/`
   sayfalarında canlanır. Başka hiçbir yere dokunmak gerekmez.
5. Buttondown panelinden **çift onay (double opt-in)** açık olsun:
   Settings → Subscribing → "Confirm subscriptions". KVKK açısından açık
   rıza kaydı bunu gerektirir.

## Test

Hesap bağlandıktan sonra kendi e-postanla kaydol; Buttondown panelinde
`Subscribers` altında `taslak-takibi` veya `su-kanunu` etiketiyle görünmeli
(form hangi sayfadan geldiğini etiketle işaretler).

## Neden Buttondown, neden Cloudflare Function değil

Raporun TAKTİK-2 maddesi iki yol öneriyordu; seçim gerekçesi:

| | Buttondown embed | Cloudflare Pages Function + Turnstile |
|---|---|---|
| Bugün canlı olabilir mi | Hayır — hesap kullanıcıda | Hayır — Turnstile anahtarları + KV binding de kullanıcıda |
| Site statik kalır mı | Evet, saf HTML POST | Hayır — Function + KV/D1 bağımlılığı (CLAUDE.md'ye aykırı) |
| KVKK sorumluluğu | Buttondown: çift onay, çıkış, silme hazır | Veri sorumlusu Serdar olur; rıza/silme altyapısı sıfırdan yazılır |
| Bakım | Yok | Function, binding, spam koruması, e-posta gönderimi ayrıca çözülür |

İki yol da kullanıcı kimlik bilgisi olmadan bugün canlıya alınamıyor —
yani Cloudflare yolu "daha canlı" değil, yalnızca aynı engel için daha çok
iş. Statiklik kısıtı ve KVKK sorumluluğu terazisi Buttondown'u seçtiriyor.
