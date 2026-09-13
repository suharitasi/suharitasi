// functions/olay.js — Cloudflare Pages Function: temas/iletişim tıklama sayacı.
// (13.09.2026 — ölçüm altyapısı. WhatsApp kanalının kanıtlanmış deseni
//  functions/whatsapp.js'ten uyarlanmıştır; aynı KV bağını (WA_SAYAC) kullanır.)
//
// İŞ: /olay?o=<olay>&y=<yol>&h=<hedef> isteğini KV'ye YAZAR (yanıtı beklemeden),
//     204 döner. Sayım başarısız olsa da kullanıcı deneyimi etkilenmez.
// - Çerez YOK, kişisel veri YOK: anahtar = 'o:' + gün + ':' + olay + ':' + zaman-rastgele.
//   IP / User-Agent / Referer DEĞERİ saklanmaz; yalnız olay adı ve sayfa yolu sayılır.
// - Sayım yalnız tarayıcı gezinmesi/beacon: Sec-Fetch-Dest dolu ya da aynı-köken
//   Referer. Botlar ve sunucu-taraflı fetch'ler sayılmaz.
// - KV'de atomik artış yok → her tıklama AYRI anahtar; okuma list({prefix}) ile toplar.
// - OKUMA: GET /olay?sayac=<SAYAC_ANAHTAR> → {"olaylar":{olay:{gun:n}}, "toplam":n}
//   Anahtar yok/yanlış → 204 (sayaç okunmaz).
// - KV bağı yoksa (env.WA_SAYAC tanımsız) sayaç sessizce atlanır; endpoint yine 204 döner.

const OMUR_SN = 60 * 60 * 24 * 400; // ~400 gün
const GECERLI = new Set(['telefon', 'eposta', 'whatsapp', 'iletisim-form']);

const trGun = (ms) => new Date(ms + 3 * 3600 * 1000).toISOString().slice(0, 10);

const rastgele = () => {
  try { return crypto.randomUUID().slice(0, 8); } catch { return Math.random().toString(36).slice(2, 10); }
};

const bosYanit = () =>
  new Response(null, {
    status: 204,
    headers: {
      'Cache-Control': 'no-store',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-Kaynak': 'fn',
    },
  });

async function sayacOku(kv) {
  const olaylar = {};
  let cursor, toplam = 0;
  do {
    const s = await kv.list({ prefix: 'o:', cursor });
    for (const k of s.keys) {
      // anahtar biçimi: o:<gun>:<olay>:<zaman>-<rand>
      const parca = k.name.split(':');
      const gun = parca[1];
      const olay = parca[2];
      if (!gun || !olay) continue;
      olaylar[olay] = olaylar[olay] || {};
      olaylar[olay][gun] = (olaylar[olay][gun] || 0) + 1;
      toplam++;
    }
    cursor = s.list_complete ? undefined : s.cursor;
  } while (cursor);
  return { olaylar, toplam };
}

// Hızlı danışma formundan gelen lead'ler (prefix 'd:'). En yeni 50 kayıt.
async function danismalariOku(kv) {
  const anahtarlar = [];
  let cursor;
  do {
    const s = await kv.list({ prefix: 'd:', cursor });
    for (const k of s.keys) anahtarlar.push(k.name);
    cursor = s.list_complete ? undefined : s.cursor;
  } while (cursor);
  anahtarlar.sort().reverse();
  const secili = anahtarlar.slice(0, 50);
  const kayitlar = [];
  for (const a of secili) {
    try {
      const v = await kv.get(a);
      if (v) kayitlar.push(JSON.parse(v));
    } catch { /* bozuk kayıt atlanır */ }
  }
  return { danismalar: kayitlar, danismaToplam: anahtarlar.length };
}

export async function onRequest(context) {
  const { request, env } = context;
  const kv = env && env.WA_SAYAC;
  let url;
  try { url = new URL(request.url); } catch { return bosYanit(); }

  // OKUMA YOLU — yalnız gizli anahtar tanımlı VE eşleşiyorsa.
  if (kv && env.SAYAC_ANAHTAR && url.searchParams.get('sayac') === env.SAYAC_ANAHTAR) {
    try {
      const sonuc = await sayacOku(kv);
      const leads = await danismalariOku(kv);
      return new Response(JSON.stringify({ ...sonuc, ...leads, okuma: new Date().toISOString() }), {
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Kaynak': 'fn' },
      });
    } catch (e) {
      return new Response(JSON.stringify({ hata: 'sayaç okunamadı', sebep: String((e && e.message) || e) }), {
        status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
      });
    }
  }

  // SAYIM — yalnız geçerli olay adı + tarayıcı isteği.
  const olay = (url.searchParams.get('o') || '').slice(0, 24);
  if (kv && GECERLI.has(olay)) {
    const gezinme = !!request.headers.get('sec-fetch-dest')
      || (request.headers.get('referer') || '').startsWith(url.origin + '/');
    if (gezinme && (request.method === 'GET' || request.method === 'POST')) {
      try {
        const simdi = Date.now();
        const anahtar = `o:${trGun(simdi)}:${olay}:${simdi}-${rastgele()}`;
        const yaz = kv.put(anahtar, '', { expirationTtl: OMUR_SN }).catch(() => {});
        if (typeof context.waitUntil === 'function') context.waitUntil(yaz);
      } catch { /* sayım kaybı yanıtı durdurmaz */ }
    }
  }
  return bosYanit();
}
