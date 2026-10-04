// API erişim günlüğü testi (04.10.2026).
// Koşum: node arac/test/loglar-fn.test.mjs
// Sınanan sözleşmeler: (1) yetkisiz okuma YOK, (2) toplulaştırma sayıları,
// (3) 429 ayrımı, (4) ters-zamanlı anahtar sırası (en yeni ilk),
// (5) KV yokken yazım çökmüyor (fail-open), (6) TTL 30 gün.
import assert from 'node:assert/strict';
import { onRequest } from '../../functions/api/loglar.js';
import { erisimKaydet, LOG_TTL_SN } from '../../functions/_log.js';

function kvYap() {
  const m = new Map();
  return {
    _m: m,
    async put(k, v, o) { m.set(k, { v, o }); },
    async get(k) { return m.has(k) ? m.get(k).v : null; },
    async list({ prefix = '' } = {}) {
      const ad = [...m.keys()].filter((k) => k.startsWith(prefix)).sort();
      return { keys: ad.map((name) => ({ name })), list_complete: true };
    },
  };
}

const bekle = [];
const ctx = (env, headers = {}, method = 'GET', url = 'https://suharitasi.com/api/loglar') => ({
  request: new Request(url, { method, headers }),
  env,
  waitUntil: (p) => bekle.push(p),
});

const sonuc = [];
const kaydet = (ad, ok, ek = '') => {
  sonuc.push([ad, ok, ek]);
  console.log(`${ok ? 'GEÇTİ' : 'KALDI'} · ${ad}${ek ? ' · ' + ek : ''}`);
};

// 1) KV/anahtar yok → 503
{
  const r = await onRequest(ctx({}));
  kaydet('depo yapılandırılmadı → 503', r.status === 503);
}
// 2) Yanlış/eksik anahtar → 401
{
  const env = { WA_SAYAC: kvYap(), SAYAC_ANAHTAR: 'gizli123' };
  kaydet('anahtarsız → 401', (await onRequest(ctx(env))).status === 401);
  kaydet('yanlış anahtar → 401',
    (await onRequest(ctx(env, { authorization: 'Bearer yanlis' }))).status === 401);
}
// 3) Yazım + toplulaştırma + 429 ayrımı + ters-zaman
{
  const kv = kvYap();
  const env = { WA_SAYAC: kv, SAYAC_ANAHTAR: 'gizli123' };
  const yaz = (ip, uc, durum) => {
    bekle.length = 0;
    erisimKaydet(ctx(env, { 'cf-connecting-ip': ip }), uc, durum);
    return Promise.allSettled(bekle);
  };
  await yaz('1.2.3.4', '/api/v1/havzalar', 200);
  await yaz('1.2.3.4', '/api/v1/havzalar', 429);
  await yaz('1.2.3.4', '/api/v1/kuraklik', 200);
  await yaz('5.6.7.8', '/mcp', 200);

  const hAnahtarlar = [...kv._m.keys()].filter((k) => k.startsWith('h:'));
  kaydet('4 kayıt h: önekiyle yazıldı', hAnahtarlar.length === 4, `adet=${hAnahtarlar.length}`);
  const ilkDeger = JSON.parse(kv._m.get(hAnahtarlar.sort()[0]).v);
  kaydet('anahtar ters-zamanlı (en yeni ilk)', ilkDeger.u === '/mcp', `ilk uç=${ilkDeger.u}`);
  const ornek = kv._m.get(hAnahtarlar.sort()[0]);
  kaydet('TTL 30 gün', ornek.o && ornek.o.expirationTtl === LOG_TTL_SN);

  const r = await onRequest(ctx(env, { authorization: 'Bearer gizli123' }));
  const g = await r.json();
  kaydet('doğru anahtar → 200', r.status === 200);
  kaydet('toplam sayılan 4', g.ozet.sayilan === 4, `sayilan=${g.ozet.sayilan}`);
  kaydet('429 sayısı 1', g.ozet.red_429 === 1, `red=${g.ozet.red_429}`);
  kaydet('en çok istek: 1.2.3.4 → 3', g.ipler[0].ip === '1.2.3.4' && g.ipler[0].adet === 3);
  kaydet('uç toplamı havzalar → 2/1', g.ucler['/api/v1/havzalar'].toplam === 2 && g.ucler['/api/v1/havzalar'].red429 === 1);
  kaydet('son kayıtlar yeni→eski', g.son.length === 4 && g.son[0].u === '/mcp', `son[0]=${g.son[0].u}`);
  kaydet('kesildi bayrağı yok (500 altı)', g.ozet.kesildi === false);
  kaydet('IP günlüklenir (form ucu değil)', g.son.every((k) => k.i === '1.2.3.4' || k.i === '5.6.7.8'));
}
// 4) KV yokken yazım çökmüyor (fail-open)
{
  const once = bekle.length;
  erisimKaydet(ctx({}), '/api/v1/havzalar', 200);
  kaydet('KV yokken erisimKaydet sessiz', bekle.length === once);
  // put senkron fırlatsa da çökmemeli
  erisimKaydet(ctx({ WA_SAYAC: { put: () => { throw new Error('patlama'); } } }), '/mcp', 200);
}
// 5) Yöntem denetimi
{
  const env = { WA_SAYAC: kvYap(), SAYAC_ANAHTAR: 'k' };
  kaydet('POST → 405', (await onRequest(ctx(env, {}, 'POST'))).status === 405);
}

const kalan = sonuc.filter((s) => !s[1]);
console.log(`\nSONUÇ: ${sonuc.length - kalan.length}/${sonuc.length} geçti`);
assert.equal(kalan.length, 0, 'kalan var');
