// functions/danisma.js — HIZLI DANIŞMA lead yakalama (Cloudflare Pages Function).
// (13.09.2026, agresif dönüşüm katmanı; 04.10.2026 denetimiyle sertleştirildi.)
//
// İŞ: POST /danisma → gövdedeki lead'i KV'ye yazar (WA_SAYAC, 'd:' öneki),
// {ok:true} döner.
// - E-posta GÖNDERMEZ (harici API yok); lead KV'de birikir, okuma aracı:
//   `arac/temas-sayac.sh --lead` (GET /olay, SAYAC_ANAHTAR ile).
// - KVKK: yalnız kullanıcının açık rızasıyla (onay alanı) alınan alanlar yazılır;
//   honeypot doluysa istek sessizce yutulur.
// - KV bağı yoksa (env.WA_SAYAC tanımsız) 503 döner — form istemcide mailto'ya düşer.
// - Kişisel veri: ad, telefon, il, konu, mesaj. IP/UA SAKLANMAZ.
// - Gövde sınırı 12 KB; metin alanları kontrol karakterlerinden arınır
//   (terminal/ANSI kaçışları lead görüntüleyicisine sızamaz).
import { rateLimit } from './_limit.js';
import { temizKirp as kirp, jsonOku } from './_util.js';

const OMUR_SN = 60 * 60 * 24 * 180; // ~180 gün (talep kapanınca silinir notu ile uyumlu)

const trGun = (ms) => new Date(ms + 3 * 3600 * 1000).toISOString().slice(0, 10);
const rastgele = () => {
  try { return crypto.randomUUID().slice(0, 8); } catch { return Math.random().toString(36).slice(2, 10); }
};

const json = (govde, kod = 200) =>
  new Response(JSON.stringify(govde), {
    status: kod,
    headers: {
      'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Kaynak': 'fn',
      // _headers bir Function yanıtına uygulanmaz (whatsapp.js notu): güvenlik
      // başlıkları burada elle verilir.
      'X-Content-Type-Options': 'nosniff', 'Cross-Origin-Resource-Policy': 'same-origin',
    },
  });

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST') return json({ hata: 'yalnız POST' }, 405);

  // KAYNAK KONTROLÜ (13.09.2026): yalnız kendi sitemizden POST kabul edilir
  // (siteler arası form suistimalini kapatır). Origin başlığı varsa eşleşmeli.
  let origin;
  try { origin = new URL(request.url).origin; } catch { origin = ''; }
  const gelenOrigin = request.headers.get('origin');
  if (gelenOrigin && origin && gelenOrigin !== origin) return json({ hata: 'geçersiz kaynak' }, 403);

  // RATE LIMIT: IP+UA başına 5 istek / 10 dakika (abuse freni).
  const rl = await rateLimit(request, env, 'danisma', 5, 600);
  if (!rl.ok) return json({ hata: 'Çok fazla istek. Lütfen biraz sonra tekrar deneyin.' }, 429);

  const okuma = await jsonOku(request, 12000);
  if (okuma.hata) {
    return json({ hata: okuma.hata }, okuma.hata === 'gövde çok büyük' ? 413 : 400);
  }
  const veri = okuma.veri && typeof okuma.veri === 'object' ? okuma.veri : {};

  // Honeypot — botlar doldurur; sessiz başarı dön (botu bilgilendirme).
  if (kirp(veri.website, 50)) return json({ ok: true });

  const lead = {
    ad: kirp(veri.ad, 120),
    telefon: kirp(veri.telefon, 40),
    il: kirp(veri.il, 60),
    konu: kirp(veri.konu, 120),
    mesaj: kirp(veri.mesaj, 4000),
    onay: veri.onay === true || veri.onay === 'on' || veri.onay === 'true',
    zaman: new Date().toISOString(),
    sayfa: kirp(veri.sayfa, 200),
  };

  if (!lead.ad || !lead.telefon || !lead.mesaj || !lead.onay) {
    return json({ hata: 'zorunlu alan eksik (ad, telefon, mesaj, onay)' }, 400);
  }

  const kv = env && env.WA_SAYAC;
  if (!kv) {
    // KV bağlı değil → istemci mailto'ya düşsün diye 503.
    return json({ hata: 'lead deposu yapılandırılmadı' }, 503);
  }

  try {
    const simdi = Date.now();
    const anahtar = `d:${trGun(simdi)}:${simdi}-${rastgele()}`;
    // Yazma ONAYLANMADAN başarı dönülmez: lead sessizce kaybolmasın.
    await kv.put(anahtar, JSON.stringify(lead), { expirationTtl: OMUR_SN });
    return json({ ok: true });
  } catch {
    return json({ hata: 'kayıt başarısız' }, 500);
  }
}
