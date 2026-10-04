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

import { rateLimit } from './_limit.js';
import { sayacAnahtari, anahtarEsit } from './_auth.js';

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
  let cursor, toplam = 0, kesildi = false;
  // SINIR: sayaç ~400 gün ve tıklama başına bir anahtar büyür. Workers'ın
  // alt-istek/CPU tavanına dayanmamak için tarama sınırlandırılır; sınıra
  // gelinirse sonuç `kesildi:true` ile AÇIKÇA kısmi bildirilir (sessizce
  // yanlış toplam döndürmek yasak).
  const SINIR = 10000;
  do {
    const s = await kv.list({ prefix: 'o:', cursor });
    for (const k of s.keys) {
      if (toplam >= SINIR) { kesildi = true; break; }
      // anahtar biçimi: o:<gun>:<olay>:<zaman>-<rand>
      const parca = k.name.split(':');
      const gun = parca[1];
      const olay = parca[2];
      if (!gun || !olay) continue;
      olaylar[olay] = olaylar[olay] || {};
      olaylar[olay][gun] = (olaylar[olay][gun] || 0) + 1;
      toplam++;
    }
    if (kesildi) break;
    cursor = s.list_complete ? undefined : s.cursor;
  } while (cursor);
  return { olaylar, toplam, ...(kesildi ? { kesildi: true, sinir: SINIR } : {}) };
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

// Parsel talepleri (prefix 'p:'; 04.10.2026 önek ayrımı). En yeni 50 kayıt.
// Eski sürüm api/talep.js aynı 't:' önekini kullandığından geriye dönük kayıp
// olmasın diye 't:' altındaki JSON değerli kayıtlar da taranır (WhatsApp
// tıklama kayıtları BOŞ değerlidir; JSON.parse onları eler). Eski tarama en
// çok 200 anahtar; sınır aşılırsa `parselKesildi:true` ile açıkça bildirilir.
async function parselleriOku(kv) {
  const kayitlar = [];
  const anahtarlar = [];
  let cursor;
  do {
    const s = await kv.list({ prefix: 'p:', cursor });
    for (const k of s.keys) anahtarlar.push(k.name);
    cursor = s.list_complete ? undefined : s.cursor;
  } while (cursor);
  anahtarlar.sort().reverse();
  for (const a of anahtarlar.slice(0, 50)) {
    try {
      const v = await kv.get(a);
      if (v) kayitlar.push(JSON.parse(v));
    } catch { /* bozuk kayıt atlanır */ }
  }
  let kesildi = false;
  let tarandi = 0;
  const eski = [];
  cursor = undefined;
  do {
    const s = await kv.list({ prefix: 't:', cursor });
    for (const k of s.keys) {
      if (tarandi >= 200) { kesildi = true; break; }
      tarandi++;
      eski.push(k.name);
    }
    if (kesildi) break;
    cursor = s.list_complete ? undefined : s.cursor;
  } while (cursor);
  for (const a of eski.sort().reverse().slice(0, 50)) {
    try {
      const v = await kv.get(a);
      if (!v) continue;
      const kayit = JSON.parse(v);
      if (kayit && kayit.tur === 'parsel-hidrojeolojik-on-talep') kayitlar.push(kayit);
    } catch { /* boş değer (WhatsApp tıklaması) */ }
  }
  kayitlar.sort((a, b) => (b.zaman || '').localeCompare(a.zaman || ''));
  return { parseller: kayitlar.slice(0, 50), parselToplam: anahtarlar.length, ...(kesildi ? { parselKesildi: true } : {}) };
}

export async function onRequest(context) {
  const { request, env } = context;
  const kv = env && env.WA_SAYAC;
  let url;
  try { url = new URL(request.url); } catch { return bosYanit(); }

  // OKUMA YOLU — yalnız gizli anahtar tanımlı VE eşleşiyorsa.
  if (kv && env.SAYAC_ANAHTAR && anahtarEsit(sayacAnahtari(request), env.SAYAC_ANAHTAR)) {
    try {
      const sonuc = await sayacOku(kv);
      const leads = await danismalariOku(kv);
      const parseller = await parselleriOku(kv);
      return new Response(JSON.stringify({ ...sonuc, ...leads, ...parseller, okuma: new Date().toISOString() }), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Kaynak': 'fn',
          'X-Content-Type-Options': 'nosniff', 'Cross-Origin-Resource-Policy': 'same-origin',
        },
      });
    } catch (e) {
      return new Response(JSON.stringify({ hata: 'sayaç okunamadı', sebep: String((e && e.message) || e) }), {
        status: 500, headers: {
          'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff', 'Cross-Origin-Resource-Policy': 'same-origin',
        },
      });
    }
  }

  // SAYIM — yalnız geçerli olay adı + tarayıcı isteği.
  const olay = (url.searchParams.get('o') || '').slice(0, 24);
  if (kv && GECERLI.has(olay)) {
    // KAYNAK KONTROLÜ: Origin varsa kendi sitemiz olmalı.
    const gelenOrigin = request.headers.get('origin');
    if (gelenOrigin && gelenOrigin !== url.origin) return bosYanit();
    // RATE LIMIT: IP+UA başına 120 beacon / dakika (kaba abuse freni).
    const rl = await rateLimit(request, env, 'olay', 120, 60);
    if (!rl.ok) return bosYanit();
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
