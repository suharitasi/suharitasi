// MCP Function sözleşme sınaması — wrangler/Workers çalışma zamanı olmadan.
// Koşum: node arac/test/mcp-fn.test.mjs
// Yöntem: functions/mcp.js onRequest(context) sözleşmesi sahte env.ASSETS ile
// sınanır; veri gerçek dist/veri/*.json çıktısından okunur (uydurma fixture yok).
// Canlı kanıt ayrıca deploy sonrası: curl -s https://suharitasi.com/mcp (kart).
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { onRequest } from '../../functions/mcp.js';

const DIST = '/home/suha/projeler/suharitasi/dist';
const URL_ = 'https://suharitasi.com/mcp';

function assetsEnv() {
  return {
    ASSETS: {
      fetch: async (req) => {
        const u = new URL(req.url);
        const p = join(DIST, decodeURIComponent(u.pathname));
        if (!existsSync(p)) return new Response('yok', { status: 404 });
        return new Response(readFileSync(p), { headers: { 'content-type': 'application/json' } });
      },
    },
  };
}

const ctx = (govde, method = 'POST', env = assetsEnv()) => ({
  request: new Request(URL_, {
    method,
    headers: { 'content-type': 'application/json' },
    body: govde === undefined ? undefined : typeof govde === 'string' ? govde : JSON.stringify(govde),
  }),
  env,
});

const sonuc = [];
const kaydet = (ad, ok, ek = '') => {
  sonuc.push(ok);
  console.log(`${ok ? 'GEÇTİ' : 'KALDI'} · ${ad}${ek ? ' · ' + ek : ''}`);
};

// 1) GET → sunucu kartı
{
  const r = await onRequest(ctx(undefined, 'GET'));
  const g = await r.json();
  kaydet('GET kart 200 + araç listesi', r.status === 200 && Array.isArray(g.tools) && g.tools.length === 8 && g.endpoint === 'https://suharitasi.com/mcp', `araç=${g.tools ? g.tools.length : 0}`);
}

// 2) OPTIONS → 204 + CORS
{
  const r = await onRequest(ctx(undefined, 'OPTIONS'));
  kaydet('OPTIONS 204 + CORS *', r.status === 204 && r.headers.get('access-control-allow-origin') === '*');
}

// 3) initialize
{
  const r = await onRequest(ctx({ jsonrpc: '2.0', id: 1, method: 'initialize' }));
  const g = await r.json();
  kaydet('initialize protocolVersion + serverInfo', g.result && g.result.protocolVersion && g.result.serverInfo.name === 'su-haritasi', `pv=${g.result && g.result.protocolVersion}`);
}

// 4) tools/list
{
  const r = await onRequest(ctx({ jsonrpc: '2.0', id: 2, method: 'tools/list' }));
  const g = await r.json();
  const tam = g.result.tools.every((t) => t.name && t.description && t.inputSchema);
  kaydet('tools/list 8 araç + inputSchema', g.result.tools.length === 8 && tam);
}

// 5) tools/call havza_sorgu (gerçek veri)
{
  const r = await onRequest(ctx({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'havza_sorgu', arguments: { sorgu: 'Ergene' } } }));
  const g = await r.json();
  const metin = g.result.content[0].text;
  kaydet('havza_sorgu Ergene gerçek kayıt', g.result.isError === false && /Ergene/.test(metin) && /Kaynak: Su Haritası/.test(metin), metin.slice(0, 60).replace(/\n/g, ' '));
}

// 6) bilinmeyen araç → JSON-RPC hata
{
  const r = await onRequest(ctx({ jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'yok_boyle', arguments: {} } }));
  const g = await r.json();
  kaydet('bilinmeyen araç -32602', g.error && g.error.code === -32602);
}

// 7) bozuk JSON → -32700
{
  const r = await onRequest(ctx('{bozuk'));
  const g = await r.json();
  kaydet('bozuk JSON -32700', r.status === 400 && g.error.code === -32700);
}

// 8) bildirim (id yok) → 202, gövde yok
{
  const r = await onRequest(ctx({ jsonrpc: '2.0', method: 'notifications/initialized' }));
  kaydet('bildirim 202 + boş gövde', r.status === 202);
}

// 9) toplu istek → dizi yanıt
{
  const r = await onRequest(ctx([
    { jsonrpc: '2.0', id: 5, method: 'ping' },
    { jsonrpc: '2.0', id: 6, method: 'tools/list' },
  ]));
  const g = await r.json();
  kaydet('toplu istek dizi yanıt', Array.isArray(g) && g.length === 2 && g[0].id === 5);
}

// 10) resources/list
{
  const r = await onRequest(ctx({ jsonrpc: '2.0', id: 7, method: 'resources/list' }));
  const g = await r.json();
  kaydet('resources/list 8 kaynak', g.result.resources.length === 8 && g.result.resources[0].uri.startsWith('suharitasi://'));
}

// 11) kaynak okunamazsa → isError true, çökme yok (kaynağı yüklenmemiş kaynak)
{
  const bozukEnv = { ASSETS: { fetch: async () => new Response('yok', { status: 404 }) } };
  const r = await onRequest(ctx(
    { jsonrpc: '2.0', id: 8, method: 'tools/call', params: { name: 'islem_sorgu', arguments: { kelime: 'arama' } } },
    'POST', bozukEnv,
  ));
  const g = await r.json();
  kaydet('kaynak yoksa isError (çökme yok)', r.status === 200 && g.result.isError === true && /Araç hatası/.test(g.result.content[0].text));
}

// 12) bilinmeyen method → -32601
{
  const r = await onRequest(ctx({ jsonrpc: '2.0', id: 9, method: 'yok/method' }));
  const g = await r.json();
  kaydet('bilinmeyen method -32601', g.error && g.error.code === -32601);
}

const gecen = sonuc.filter(Boolean).length;
console.log(`\n${gecen}/${sonuc.length} GEÇTİ`);
process.exit(gecen === sonuc.length ? 0 : 1);
