// functions/danisma.js — HIZLI DANIŞMA lead yakalama (Cloudflare Pages Function).
// (13.09.2026, agresif dönüşüm katmanı.)
//
// İŞ: POST /danisma → gövdedeki lead'i KV'ye yazar (WA_SAYAC), {ok:true} döner.
// - E-posta GÖNDERMEZ (harici API yok); lead KV'de birikir, okuma aracı:
//   `arac/danisma-oku.sh` (SAYAC_ANAHTAR ile).
// - KVKK: yalnız kullanıcının açık rızasıyla (onay alanı) alınan alanlar yazılır;
//   honeypot doluysa istek sessizce yutulur.
// - KV bağı yoksa (env.WA_SAYAC tanımsız) 503 döner — form istemcide mailto'ya düşer.
// - Kişisel veri: ad, telefon, il, konu, mesaj. IP/UA SAKLANMAZ.
const OMUR_SN = 60 * 60 * 24 * 180; // ~180 gün (talep kapanınca silinir notu ile uyumlu)

const trGun = (ms) => new Date(ms + 3 * 3600 * 1000).toISOString().slice(0, 10);
const rastgele = () => {
  try { return crypto.randomUUID().slice(0, 8); } catch { return Math.random().toString(36).slice(2, 10); }
};
const kirp = (s, n) => (typeof s === 'string' ? s.trim().slice(0, n) : '');

const json = (govde, kod = 200) =>
  new Response(JSON.stringify(govde), {
    status: kod,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Kaynak': 'fn' },
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

  let veri;
  try {
    veri = await request.json();
  } catch {
    return json({ hata: 'geçersiz gövde' }, 400);
  }

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
    const yaz = kv.put(anahtar, JSON.stringify(lead), { expirationTtl: OMUR_SN });
    if (typeof context.waitUntil === 'function') context.waitUntil(yaz);
    else await yaz;
    return json({ ok: true });
  } catch (e) {
    return json({ hata: 'kayıt başarısız' }, 500);
  }
}
