// functions/api/v1/havzalar.js — DaaS ucu: 25 havza künyesi (JSON).
// Rate-limit: IP+UA başına 60 istek/dk (_limit.js, KV). CORS açık (public API).
// Veri kaynağı: sitenin kendi statik /veri/havzalar.json ucu (tek gerçek kaynak).
import { rateLimit } from '../../_limit.js';
import { erisimKaydet } from '../../_log.js';

const UC = '/api/v1/havzalar';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

const json = (g, kod = 200, ek = {}) =>
  new Response(JSON.stringify(g), {
    status: kod,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'X-Kaynak': 'fn',
      'X-Content-Type-Options': 'nosniff',
      ...CORS, ...ek,
    },
  });

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'GET' && request.method !== 'HEAD') return json({ hata: 'yalnız GET' }, 405);

  const rl = await rateLimit(request, env, 'v1-havzalar', 60, 60);
  if (!rl.ok) {
    erisimKaydet(context, UC, 429);
    return json({ hata: 'Hız sınırı aşıldı (60/dk). Başlıklar: Retry-After.' }, 429, { 'Retry-After': '60' });
  }

  let veri;
  try {
    const url = new URL(request.url);
    const r = await fetch(new URL('/veri/havzalar.json', url.origin), { cf: { cacheTtl: 300 } });
    veri = await r.json();
  } catch {
    erisimKaydet(context, UC, 503);
    return json({ hata: 'kaynak veri geçici olarak okunamadı' }, 503);
  }
  const kayit = Array.isArray(veri) ? { havzalar: veri, kayit_sayisi: veri.length } : veri;
  const yanit = json({ api: 'v1', uc: 'havzalar', kalan_kota: rl.kalan, ...kayit });
  erisimKaydet(context, UC, yanit.status);
  return yanit;
}
