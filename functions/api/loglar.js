// functions/api/loglar.js — API erişim günlüğü okuma ucu (04.10.2026).
//
// GET /api/loglar · Auth: Authorization: Bearer SAYAC_ANAHTAR (sorgu dizesi
// taşıması YOK — _auth.js sözleşmesi). Toplulaştırılmış özet döner; panel
// (/yonetim/api-loglari/) bu ucu tüketir.
//
// SINIRLAR (dürüstlük): tarama en çok 500 kayıt (KV alt-istek tavanı);
// sınıra gelinirse yanıt `ozet.kesildi:true` ile AÇIKÇA kısmi bildirilir —
// sessizce yanlış toplam döndürmek yasak. Kayıtlar ters-zaman anahtarlıdır,
// bu yüzden taranan 500 kayıt EN YENİ 500'dür.
import { rateLimit } from '../_limit.js';
import { sayacAnahtari, anahtarEsit } from '../_auth.js';

const SINIR = 500;
const TR_MS = 3 * 3600 * 1000; // TR = UTC+3 (yaz saati yok)

const json = (g, k = 200) =>
  new Response(JSON.stringify(g), {
    status: k,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Kaynak': 'fn',
      'X-Content-Type-Options': 'nosniff',
      'Cross-Origin-Resource-Policy': 'same-origin',
    },
  });

function trGun(ms) {
  return new Date(ms + TR_MS).toISOString().slice(0, 10);
}
function trDakika(ms) {
  return new Date(ms + TR_MS).toISOString().slice(11, 16);
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'GET') return json({ hata: 'yalnız GET' }, 405);

  const kv = env && env.WA_SAYAC;
  if (!kv || !env.SAYAC_ANAHTAR) {
    return json({ hata: 'günlük deposu yapılandırılmadı (WA_SAYAC / SAYAC_ANAHTAR)' }, 503);
  }
  // P3 (05.10.2026): hız sınırı yetki kontrolünden ÖNCE — anahtar denemesi
  // sınırsız kaba kuvvet yüzeyi olmasın (diğer uçların deseniyle aynı).
  const rl = await rateLimit(request, env, 'loglar', 30, 60);
  if (!rl.ok) return json({ hata: 'çok fazla istek' }, 429);
  if (!anahtarEsit(sayacAnahtari(request), env.SAYAC_ANAHTAR)) {
    return json({ hata: 'yetkisiz' }, 401);
  }

  // — En yeni kayıtlar: ters-zamanlı anahtar sayesinde ilk sayfalar yenidir.
  const kayitlar = [];
  let cursor, kesildi = false;
  do {
    const s = await kv.list({ prefix: 'h:', cursor });
    for (const k of s.keys) {
      if (kayitlar.length >= SINIR) { kesildi = true; break; }
      try {
        const v = await kv.get(k.name);
        if (v) kayitlar.push(JSON.parse(v));
      } catch { /* bozuk kayıt atlanır */ }
    }
    if (kesildi) break;
    cursor = s.list_complete ? undefined : s.cursor;
  } while (cursor);

  // Anahtar sırası zaten yeni→eski; yine de değere göre sabitle.
  kayitlar.sort((a, b) => String(b.t || '').localeCompare(String(a.t || '')));

  const simdi = Date.now();
  const bugunTR = trGun(simdi);
  const birSaatOnce = simdi - 3600 * 1000;
  const ozet = { sayilan: kayitlar.length, kesildi, bugun: 0, son_saat: 0, red_429: 0 };
  const ucler = {};
  const gunler = {};
  const dakikalar = {};
  const ipler = {};

  for (const k of kayitlar) {
    const t = Date.parse(k.t || '');
    if (!Number.isFinite(t)) continue;
    const s429 = String(k.s) === '429';
    const u = k.u || 'bilinmiyor';
    const ip = k.i || 'bilinmiyor';

    if (s429) ozet.red_429++;
    if (t >= birSaatOnce) ozet.son_saat++;
    if (trGun(t) === bugunTR) ozet.bugun++;

    ucler[u] = ucler[u] || { toplam: 0, red429: 0 };
    ucler[u].toplam++;
    if (s429) ucler[u].red429++;

    const gun = trGun(t);
    gunler[gun] = gunler[gun] || { toplam: 0, red429: 0 };
    gunler[gun].toplam++;
    if (s429) gunler[gun].red429++;

    if (t >= birSaatOnce) {
      const dk = trDakika(t);
      dakikalar[dk] = (dakikalar[dk] || 0) + 1;
    }

    ipler[ip] = ipler[ip] || { ip, adet: 0, red429: 0, son: k.t, ucler: {} };
    ipler[ip].adet++;
    if (s429) ipler[ip].red429++;
    if (String(k.t) > String(ipler[ip].son)) ipler[ip].son = k.t;
    ipler[ip].ucler[u] = (ipler[ip].ucler[u] || 0) + 1;
  }

  return json({
    ok: true,
    ozet,
    ucler,
    gunler: Object.entries(gunler).sort().map(([gun, v]) => ({ gun, ...v })).slice(-14),
    dakikalar: Object.entries(dakikalar).sort().map(([dk, adet]) => ({ dk, adet })).slice(-60),
    ipler: Object.values(ipler).sort((a, b) => b.adet - a.adet).slice(0, 20),
    son: kayitlar.slice(0, 80),
    sinir: SINIR,
  });
}
