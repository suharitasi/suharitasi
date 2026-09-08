// B5 falsifikasyonu — functions/whatsapp.js KV'siz ve KV hatalıyken de 302 dönmeli.
// Koşum: node arac/test/whatsapp-fn.test.mjs  (Node 22: Request/Response yerleşik)
// Wrangler kurulmadan, Workers çalışma zamanı taklit edilmeden: yalnız modülün
// dışa aktardığı onRequest(context) sözleşmesi sınanır. Canlı kanıt ayrıca
// deploy sonrası `curl -sI https://suharitasi.com/whatsapp/` (x-kaynak: fn).
import assert from 'node:assert/strict';
import { onRequest } from '../../functions/whatsapp.js';

const URL_ = 'https://suharitasi.com/whatsapp/';
const bekle = [];
const ctx = (env, headers = {}, method = 'GET', url = URL_) => ({
  request: new Request(url, { method, headers }),
  env,
  waitUntil: (p) => bekle.push(p),
});
const sonuc = [];
const kaydet = (ad, ok, ek = '') => { sonuc.push([ad, ok, ek]); console.log(`${ok ? 'GEÇTİ' : 'KALDI'} · ${ad}${ek ? ' · ' + ek : ''}`); };

// 1) KV bağlı değil (env boş) → 302 + Location + X-Kaynak
{
  const r = await onRequest(ctx({}));
  kaydet('KV yokken 302', r.status === 302 && r.headers.get('location') === 'https://wa.me/905324497144' && r.headers.get('x-kaynak') === 'fn',
    `status=${r.status} location=${r.headers.get('location')}`);
}
// 2) env tamamen undefined → yine 302 (hata fırlatmaz)
{
  const r = await onRequest({ request: new Request(URL_), env: undefined });
  kaydet('env undefined iken 302', r.status === 302);
}
// 3) KV bağlı ama put reddediyor → 302 yine döner, hata yutulur
{
  const kv = { put: async () => { throw new Error('KV 429'); }, list: async () => ({ keys: [], list_complete: true }) };
  const r = await onRequest(ctx({ WA_SAYAC: kv }, { 'sec-fetch-dest': 'document' }));
  await Promise.allSettled(bekle.splice(0));
  kaydet('KV put hata verirken 302', r.status === 302);
}
// 4) KV put senkron fırlatıyor (bozuk bağlama) → 302
{
  const kv = { put: () => { throw new Error('sync patlama'); } };
  const r = await onRequest(ctx({ WA_SAYAC: kv }, { 'sec-fetch-dest': 'document' }));
  kaydet('KV senkron hata verirken 302', r.status === 302);
}
// 5) Gezinme isteği sayılır (sec-fetch-dest: document) — anahtar biçimi ve TTL
{
  const yazilan = [];
  const kv = { put: async (k, v, o) => { yazilan.push([k, v, o]); }, list: async () => ({ keys: [], list_complete: true }) };
  const r = await onRequest(ctx({ WA_SAYAC: kv }, { 'sec-fetch-dest': 'document', 'user-agent': 'Mozilla/5.0 test', 'x-forwarded-for': '1.2.3.4' }));
  await Promise.allSettled(bekle.splice(0));
  const [k, v, o] = yazilan[0] || [];
  const gun = new Date(Date.now() + 3 * 3600 * 1000).toISOString().slice(0, 10);
  kaydet('gezinme sayıldı (1 put)', r.status === 302 && yazilan.length === 1, `anahtar=${k}`);
  kaydet('anahtar biçimi t:<TR günü>:<ms>-<8>', typeof k === 'string' && k.startsWith(`t:${gun}:`) && /^t:\d{4}-\d{2}-\d{2}:\d+-[0-9a-z-]{8}$/.test(k));
  kaydet('değer boş, TTL 400 gün, IP/UA anahtarda yok', v === '' && o && o.expirationTtl === 400 * 86400 && !k.includes('1.2.3.4') && !k.includes('Mozilla'));
}
// 6) Aynı-köken Referer ile de sayılır; Node-fetch benzeri (başlıksız) istek SAYILMAZ; HEAD sayılmaz
{
  const yazilan = [];
  const kv = { put: async (k) => { yazilan.push(k); }, list: async () => ({ keys: [], list_complete: true }) };
  await onRequest(ctx({ WA_SAYAC: kv }, { referer: 'https://suharitasi.com/havzalar/gediz/' }));
  await onRequest(ctx({ WA_SAYAC: kv }, {}));                                  // sağlık betiği gibi
  await onRequest(ctx({ WA_SAYAC: kv }, { referer: 'https://baska-site.example/' }));
  await onRequest(ctx({ WA_SAYAC: kv }, { 'sec-fetch-dest': 'document' }, 'HEAD'));
  await Promise.allSettled(bekle.splice(0));
  kaydet('yalnız gezinme sayılır (1/4)', yazilan.length === 1, `sayılan=${yazilan.length}`);
}
// 7) Okuma yolu: anahtar doğruysa JSON (gün → sayı), yanlışsa 302, anahtar tanımsızsa 302
{
  const keys = ['t:2026-09-08:1-a', 't:2026-09-08:2-b', 't:2026-09-09:3-c'].map((name) => ({ name }));
  const kv = { put: async () => {}, list: async () => ({ keys, list_complete: true }) };
  const env = { WA_SAYAC: kv, SAYAC_ANAHTAR: 'gizli123' };
  const dogru = await onRequest(ctx(env, {}, 'GET', URL_ + '?sayac=gizli123'));
  const govde = await dogru.json();
  kaydet('okuma: doğru anahtar → JSON', dogru.status === 200 && govde.toplam === 3 && govde.gunler['2026-09-08'] === 2 && govde.gunler['2026-09-09'] === 1, JSON.stringify(govde.gunler));
  const yanlis = await onRequest(ctx(env, {}, 'GET', URL_ + '?sayac=yanlis'));
  kaydet('okuma: yanlış anahtar → 302', yanlis.status === 302);
  const tanimsiz = await onRequest(ctx({ WA_SAYAC: kv }, {}, 'GET', URL_ + '?sayac=gizli123'));
  kaydet('okuma: SAYAC_ANAHTAR tanımsız → 302 (sızıntı yok)', tanimsiz.status === 302);
  // list sayfalama: cursor ile ikinci sayfa
  let cagri = 0;
  const kv2 = { put: async () => {}, list: async ({ cursor }) => (++cagri === 1
    ? { keys: keys.slice(0, 2), list_complete: false, cursor: 'c2' }
    : { keys: keys.slice(2), list_complete: true }) };
  const s2 = await (await onRequest(ctx({ WA_SAYAC: kv2, SAYAC_ANAHTAR: 'k' }, {}, 'GET', URL_ + '?sayac=k'))).json();
  kaydet('okuma: list sayfalama (cursor)', s2.toplam === 3 && cagri === 2);
}
// 8) WA_HEDEF ezmesi
{
  const r = await onRequest(ctx({ WA_HEDEF: 'https://wa.me/1' }));
  kaydet('WA_HEDEF ezmesi', r.headers.get('location') === 'https://wa.me/1');
}
const kalan = sonuc.filter((s) => !s[1]);
console.log(`\nSONUÇ: ${sonuc.length - kalan.length}/${sonuc.length} geçti`);
assert.equal(kalan.length, 0, 'kalan var');
