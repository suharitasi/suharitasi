// functions/mcp.js — MCP (Model Context Protocol) uç noktası (22.09.2026).
//
// NE: /mcp yolu, salt-okunur su hukuku/veri araçlarını MCP istemcilerine
// (Claude, ChatGPT, geliştirici ajanları) açar. POST = JSON-RPC 2.0
// (Streamable HTTP, oturumsuz); GET = sunucu kartı (keşif).
//
// KAYNAK İLKESİ (uydurma yasağı): araçlar YALNIZ sitenin yayımlı JSON
// çıktısını okur (dist/veri/*.json, /kisit.json). Hiçbir alan üretilmez;
// kaynak okunamazsa JSON-RPC -32603 döner, uydurma yanıt verilmez.
//
// VERİ ERİŞİMİ: env.ASSETS (Pages statik varlık bağlaması); yoksa aynı-köken
// fetch'e düşer. Sonuç isolate başına önbelleklenir.
//
// GÜVENLİK: salt-okunur; yalnız GET/POST/OPTIONS; KV varsa IP+UA başına
// 60 istek/dk (KV yoksa sınır uygulanmaz, fail-open). HSTS/CORS burada
// verilir — _headers bir Function yanıtına uygulanmaz (whatsapp.js notu).
import { rateLimit } from './_limit.js';
import { jsonOku } from './_util.js';
import { erisimKaydet } from './_log.js';

const PROTOKOL = '2025-06-18';
const SUNUCU = { name: 'su-haritasi', version: '1.0.0' };
const SITE = 'https://suharitasi.com';

const KAYNAK_YOLU = {
  havzalar: '/veri/havzalar.json',
  iller: '/veri/iller.json',
  mevzuat: '/veri/mevzuat.json',
  emsal: '/veri/emsal.json',
  sozluk: '/veri/sozluk.json',
  islemler: '/veri/islemler.json',
  suRiski: '/veri/su-riski.json',
  kisit: '/kisit.json',
};

const KAYNAK_ACIKLAMA = {
  havzalar: '25 su havzası künyesi (yağış alanı, rezerv, NHYP)',
  iller: '81 il → DSİ bölgesi, havza ve su idaresi eşlemesi',
  mevzuat: '469 mevzuat maddesi (resmî metin + kaynak)',
  emsal: 'Danıştay/Yargıtay su hukuku emsal kararları',
  sozluk: '126 su hukuku/yönetimi terimi',
  islemler: '20 idari su işlemi → kurum, dayanak, başvuru kanalı',
  suRiski: 'İl/havza Su Riski Endeksi (şeffaf bileşik gösterge)',
  kisit: 'Resmî Gazete işletme sahası/kısıt kayıtları',
};

// Isolate ömrü boyunca yayımlı JSON önbelleği (soğuk başlangıçta bir kez okunur).
const onbellek = new Map();

function norm(s) {
  return String(s ?? '').toLocaleLowerCase('tr').trim();
}

function yaz(v) {
  if (Array.isArray(v)) {
    return v.length ? v.map((d) => `- ${kisaltMetin(d)}`).join('\n') : '—';
  }
  if (v && typeof v === 'object') {
    return Object.entries(v)
      .filter(([, x]) => x !== null && x !== '' && !(Array.isArray(x) && !x.length))
      .map(([k, x]) => `${k}: ${kisaltMetin(x)}`)
      .join(' · ');
  }
  return kisaltMetin(v);
}

function kisaltMetin(v) {
  if (v === null || v === undefined) return '—';
  const s = typeof v === 'string' ? v : JSON.stringify(v);
  return s.length > 320 ? s.slice(0, 320) + '…' : s;
}

async function oku(context, anahtar) {
  const yol = KAYNAK_YOLU[anahtar];
  if (!yol) throw new Error(`bilinmeyen kaynak: ${anahtar}`);
  if (onbellek.has(anahtar)) return onbellek.get(anahtar);
  const tam = new URL(yol, SITE).toString();
  const istek = new Request(tam, { headers: { accept: 'application/json' } });
  let yanit;
  const assets = context.env && context.env.ASSETS;
  if (assets && typeof assets.fetch === 'function') yanit = await assets.fetch(istek);
  else yanit = await fetch(istek);
  if (!yanit || !yanit.ok) {
    throw new Error(`kaynak okunamadı: ${yol} (${yanit ? yanit.status : 'yanıt yok'})`);
  }
  const govde = await yanit.json();
  onbellek.set(anahtar, govde);
  return govde;
}

function liste(kayitlar, ad, limit = 10) {
  if (!kayitlar.length) return `Eşleşen ${ad} bulunamadı.`;
  const goster = kayitlar.slice(0, limit);
  const govde = goster.map((k, i) => `${i + 1}. ${yaz(k)}`).join('\n\n');
  const ek = kayitlar.length > limit ? `\n\n(${kayitlar.length} kayıttan ilk ${limit} gösterildi.)` : '';
  return `${govde}${ek}\n\nKaynak: Su Haritası açık verisi. Hukuki görüş değildir.`;
}

function ara(kayitlar, alanlar, sorgu) {
  const q = norm(sorgu);
  if (!q) return kayitlar;
  return kayitlar.filter((k) => {
    const hedef = alanlar.map((a) => norm(k[a])).join(' ');
    return hedef.includes(q);
  });
}

const ARACLAR = [
  {
    name: 'havza_sorgu',
    description: 'Türkiye su havzası künyesi: yağış alanı, yüzey suyu potansiyeli, yeraltısuyu beslenimi/işletme rezervi ve NHYP bağlantısı. Havza numarası veya adıyla arar.',
    inputSchema: { type: 'object', properties: { sorgu: { type: 'string', description: 'Havza no (ör. 01) veya ad (ör. Ergene)' } }, required: ['sorgu'] },
    calistir: async (ctx, a) => {
      const d = await oku(ctx, 'havzalar');
      const bul = (Array.isArray(d) ? d : []).filter((h) => norm(h.no).includes(norm(a.sorgu)) || norm(h.ad).includes(norm(a.sorgu)));
      return liste(bul, 'havza');
    },
  },
  {
    name: 'il_sorgu',
    description: 'Bir ilin bağlı olduğu DSİ bölge müdürlüğü, havzalar ve su/kanalizasyon idaresi. İl adıyla arar.',
    inputSchema: { type: 'object', properties: { il: { type: 'string', description: 'İl adı (ör. Adana)' } }, required: ['il'] },
    calistir: async (ctx, a) => {
      const d = await oku(ctx, 'iller');
      const bul = ara(Array.isArray(d) ? d : [], ['il'], a.il);
      return liste(bul, 'il');
    },
  },
  {
    name: 'mevzuat_sorgu',
    description: 'Su mevzuatı maddelerini resmî metniyle arar (167, 831, 2886, 2942, 5393, 5686, 6200, YAS Tüzüğü, Su Tahsisleri Yön.). Kelime, kanun kısaltması veya madde numarasıyla.',
    inputSchema: {
      type: 'object',
      properties: {
        kelime: { type: 'string', description: 'Arama kelimesi (metin içinde)' },
        kanun: { type: 'string', description: 'Kanun kısaltması (ör. 167, YAS Tüzüğü)' },
        limit: { type: 'integer', description: 'En çok kaç kayıt (varsayılan 5, en çok 20)' },
      },
    },
    calistir: async (ctx, a) => {
      const d = await oku(ctx, 'mevzuat');
      let bul = Array.isArray(d) ? d : [];
      if (a.kanun) bul = ara(bul, ['kanunKisa', 'kanun'], a.kanun);
      if (a.kelime) bul = ara(bul, ['madde', 'metin', 'tur'], a.kelime);
      const limit = Math.min(Math.max(parseInt(a.limit, 10) || 5, 1), 20);
      return liste(bul, 'mevzuat maddesi', limit);
    },
  },
  {
    name: 'emsal_sorgu',
    description: 'Danıştay/Yargıtay su hukuku emsal kararlarını arar (künye + özet + kaynak). Konu, merci veya yılla.',
    inputSchema: {
      type: 'object',
      properties: {
        kelime: { type: 'string', description: 'Konu/özet içinde arama' },
        merci: { type: 'string', description: 'Daire (ör. 8. Daire)' },
        yil: { type: 'integer', description: 'Karar yılı' },
        limit: { type: 'integer', description: 'En çok kaç kayıt (varsayılan 5, en çok 20)' },
      },
    },
    calistir: async (ctx, a) => {
      const d = await oku(ctx, 'emsal');
      let bul = Array.isArray(d) ? d : [];
      if (a.merci) bul = ara(bul, ['merci'], a.merci);
      if (a.kelime) bul = ara(bul, ['konu', 'ozet', 'esas', 'karar'], a.kelime);
      if (a.yil) bul = bul.filter((k) => String(k.yil) === String(a.yil));
      const limit = Math.min(Math.max(parseInt(a.limit, 10) || 5, 1), 20);
      return liste(bul, 'emsal karar', limit);
    },
  },
  {
    name: 'sozluk_sorgu',
    description: 'Su hukuku/yönetimi sözlüğünde terim arar (terim + mevzuat kaynağı).',
    inputSchema: { type: 'object', properties: { kelime: { type: 'string', description: 'Terim' }, limit: { type: 'integer' } }, required: ['kelime'] },
    calistir: async (ctx, a) => {
      const d = await oku(ctx, 'sozluk');
      const bul = ara(Array.isArray(d) ? d : [], ['terim', 'kume', 'kaynak'], a.kelime);
      const limit = Math.min(Math.max(parseInt(a.limit, 10) || 10, 1), 40);
      return liste(bul, 'terim', limit);
    },
  },
  {
    name: 'kisit_sorgu',
    description: 'Resmî Gazete işletme sahası / su tahsisine kapatma-kısıt kayıtlarını il veya kelimeyle arar (tarih + kaynak bağlantısı).',
    inputSchema: {
      type: 'object',
      properties: {
        il: { type: 'string', description: 'İl adı' },
        kelime: { type: 'string', description: 'Saha/durum içinde arama' },
        limit: { type: 'integer' },
      },
    },
    calistir: async (ctx, a) => {
      const d = await oku(ctx, 'kisit');
      let bul = Array.isArray(d) ? d : [];
      if (a.il) {
        const q = norm(a.il);
        bul = bul.filter((r) => (Array.isArray(r.il) ? r.il : [r.il]).some((x) => norm(x).includes(q)));
      }
      if (a.kelime) bul = ara(bul, ['durum', 'saha'], a.kelime);
      const limit = Math.min(Math.max(parseInt(a.limit, 10) || 10, 1), 50);
      return liste(bul, 'kısıt kaydı', limit);
    },
  },
  {
    name: 'islem_sorgu',
    description: 'İdari su işlemlerini arar: hangi işlem için hangi kurum, hangi mevzuat dayanağı ve başvuru kanalı.',
    inputSchema: { type: 'object', properties: { kelime: { type: 'string', description: 'İşlem adı/dayanak' }, limit: { type: 'integer' } }, required: ['kelime'] },
    calistir: async (ctx, a) => {
      const d = await oku(ctx, 'islemler');
      const bul = ara(Array.isArray(d) ? d : [], ['ad', 'dayanak', 'mevzuatDayanagi', 'basvuruKanali'], a.kelime);
      const limit = Math.min(Math.max(parseInt(a.limit, 10) || 10, 1), 20);
      return liste(bul, 'işlem', limit);
    },
  },
  {
    name: 'su_riski_sorgu',
    description: 'Su Riski Endeksi: il veya havza için puan, kategori ve bileşenler (GRACE, baraj, YAS, tahsis, yüzey suyu). Şeffaf bileşik göstergedir; resmî sınıflama değildir.',
    inputSchema: { type: 'object', properties: { il: { type: 'string' }, havza: { type: 'string' } } },
    calistir: async (ctx, a) => {
      const d = await oku(ctx, 'suRiski');
      const parcalar = [];
      if (d && d.ozet) parcalar.push(`Özet: ${yaz(d.ozet)}`);
      if (d && Array.isArray(d.iller) && a.il) {
        const bul = d.iller.filter((x) => norm(x.il).includes(norm(a.il)));
        parcalar.push('İller:\n' + (bul.length ? bul.map((x) => `- ${yaz(x)}`).join('\n') : 'eşleşen il yok'));
      }
      if (d && Array.isArray(d.havzalar) && a.havza) {
        const bul = d.havzalar.filter((x) => norm(x.ad).includes(norm(a.havza)) || norm(x.no).includes(norm(a.havza)));
        parcalar.push('Havzalar:\n' + (bul.length ? bul.map((x) => `- ${yaz(x)}`).join('\n') : 'eşleşen havza yok'));
      }
      if (!a.il && !a.havza && d && Array.isArray(d.iller)) {
        parcalar.push('En yüksek riskli 10 il:\n' + d.iller.slice(0, 10).map((x) => `- ${x.il}: ${x.puan} (${x.kategori})`).join('\n'));
      }
      const not = (d && d._not) || 'Şeffaf bileşik gösterge; resmî sınıflama değildir.';
      return parcalar.join('\n\n') + `\n\nNot: ${not}`;
    },
  },
];

const KAYNAKLAR = Object.entries(KAYNAK_YOLU).map(([ad, yol]) => ({
  uri: `suharitasi://veri/${ad}`,
  name: ad,
  mimeType: 'application/json',
  description: `${yol} — ${KAYNAK_ACIKLAMA[ad] || ''}`.trim(),
}));

function cors(headers = {}) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id',
    'Cache-Control': 'no-store',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-Kaynak': 'fn',
    'X-Content-Type-Options': 'nosniff',
    ...headers,
  };
}

function jsonGovde(govde, kod = 200) {
  return new Response(JSON.stringify(govde), {
    status: kod,
    headers: cors({ 'Content-Type': 'application/json; charset=utf-8' }),
  });
}

function sonuc(id, result) {
  return { jsonrpc: '2.0', id: id ?? null, result };
}

function hata(id, kod, mesaj) {
  return { jsonrpc: '2.0', id: id ?? null, error: { code: kod, message: mesaj } };
}

async function aracCagir(context, id, params) {
  const ad = params && params.name;
  const arac = ARACLAR.find((x) => x.name === ad);
  if (!arac) return hata(id, -32602, `bilinmeyen araç: ${ad}`);
  const args = (params && params.arguments) || {};
  try {
    const metin = await arac.calistir(context, args);
    return sonuc(id, { content: [{ type: 'text', text: metin }], isError: false });
  } catch (e) {
    return sonuc(id, { content: [{ type: 'text', text: `Araç hatası: ${(e && e.message) || e}` }], isError: true });
  }
}

async function kaynakOku(context, id, params) {
  const uri = params && params.uri;
  const anahtar = KAYNAKLAR.find((k) => k.uri === uri)?.name
    || Object.keys(KAYNAK_YOLU).find((k) => uri === `suharitasi://veri/${k}`);
  if (!anahtar) return hata(id, -32602, `bilinmeyen kaynak: ${uri}`);
  const d = await oku(context, anahtar);
  const metin = JSON.stringify(d);
  const kesik = metin.length > 200000;
  return sonuc(id, {
    contents: [{
      uri,
      mimeType: 'application/json',
      text: kesik ? metin.slice(0, 200000) : metin,
    }],
  });
}

async function isle(context, istek) {
  const id = istek && istek.id !== undefined ? istek.id : null;
  const method = istek && istek.method;
  const params = istek && istek.params;
  if (!method) return hata(id, -32600, 'geçersiz istek: method yok');
  if (method.startsWith('notifications/')) return null;
  switch (method) {
    case 'initialize':
      return sonuc(id, {
        protocolVersion: PROTOKOL,
        capabilities: { tools: {}, resources: {} },
        serverInfo: SUNUCU,
        instructions: 'Su Haritası salt-okunur araçları: su mevzuatı, emsal kararlar, havza/il verisi, kısıt kayıtları ve su riski. Yanıtlar yayımlı resmî kaynaklardan derlenir; hukuki görüş değildir.',
      });
    case 'ping':
      return sonuc(id, {});
    case 'tools/list':
      return sonuc(id, { tools: ARACLAR.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) });
    case 'tools/call':
      return aracCagir(context, id, params);
    case 'resources/list':
      return sonuc(id, { resources: KAYNAKLAR });
    case 'resources/read':
      return kaynakOku(context, id, params);
    default:
      return hata(id, -32601, `bilinmeyen method: ${method}`);
  }
}

function kart() {
  return {
    name: SUNUCU.name,
    version: SUNUCU.version,
    protocolVersion: PROTOKOL,
    transport: 'http',
    endpoint: `${SITE}/mcp`,
    method: 'POST (JSON-RPC 2.0) · GET (bu kart)',
    tools: ARACLAR.map((a) => ({ name: a.name, description: a.description })),
    resources: KAYNAKLAR.map((k) => k.uri),
    belge: `${SITE}/ajan-erisimi/`,
    kaynak: 'Su Haritası açık verisi — kaynak gösterilerek kullanım. Hukuki görüş değildir.',
  };
}

export async function onRequest(context) {
  const { request, env } = context;
  const yontem = request.method;
  if (yontem === 'OPTIONS') return new Response(null, { status: 204, headers: cors() });
  if (yontem === 'GET') return jsonGovde(kart());
  if (yontem !== 'POST') return jsonGovde(hata(null, -32600, 'yalnız GET/POST'), 405);

  // Günlük yalnız POST yolunda tutulur (04.10.2026): makine istemcilerinin
  // gerçek çağrı trafiği; GET sunucu kartı günlüklenmez.
  const UCM = '/mcp';
  const don = (yanit) => { erisimKaydet(context, UCM, yanit.status); return yanit; };

  const rl = await rateLimit(request, env, 'mcp', 60, 60);
  if (!rl.ok) return don(jsonGovde(hata(null, -32000, 'çok fazla istek'), 429));

  const okuma = await jsonOku(request, 50000);
  if (okuma.hata) {
    return don(jsonGovde(hata(null, -32700, okuma.hata), okuma.hata === 'gövde çok büyük' ? 413 : 400));
  }
  const govde = okuma.veri;

  const toplu = Array.isArray(govde);
  // TOPLU İSTEK SINIRI (04.10.2026 denetimi): on binlerce alt çağrı içeren
  // tek istek CPU/kota sömürüsüne açıktı; toplu istek en çok 20 öğe kabul eder.
  if (toplu && govde.length > 20) {
    return don(jsonGovde(hata(null, -32600, 'toplu istek sınırı: en çok 20'), 413));
  }
  const istekler = toplu ? govde : [govde];
  const yanitlar = [];
  for (const istek of istekler) {
    let y;
    try {
      y = await isle(context, istek);
    } catch (e) {
      y = hata(istek && istek.id, -32603, `iç hata: ${(e && e.message) || e}`);
    }
    if (y !== null) yanitlar.push(y);
  }
  if (!yanitlar.length) return don(new Response(null, { status: 202, headers: cors() }));
  return don(jsonGovde(toplu ? yanitlar : yanitlar[0]));
}
