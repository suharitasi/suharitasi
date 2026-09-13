// functions/takip.js — MEVZUAT DEĞİŞİKLİK TAKİP aboneliği (13.09.2026).
// POST /takip {eposta} → KV'ye (WA_SAYAC, 'a:' öneki) abone yazar.
// E-posta GÖNDERMEZ (harici servis yok); aboneler birikir, gönderim servisi
// bağlandığında kullanılır. KVKK: yalnız e-posta + açık rıza; IP/UA saklanmaz.
// Okuma: GET /takip?sayac=<SAYAC_ANAHTAR> → {aboneler:[...], toplam:n}
const OMUR_SN = 60 * 60 * 24 * 730; // ~2 yıl

const json = (g, k = 200) =>
  new Response(JSON.stringify(g), {
    status: k,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Kaynak': 'fn' },
  });
const kirp = (s, n) => (typeof s === 'string' ? s.trim().slice(0, n) : '');
const gecerli = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);

export async function onRequest(context) {
  const { request, env } = context;
  const kv = env && env.WA_SAYAC;
  let url;
  try { url = new URL(request.url); } catch { return json({ hata: 'gecersiz' }, 400); }

  if (kv && env.SAYAC_ANAHTAR && url.searchParams.get('sayac') === env.SAYAC_ANAHTAR) {
    const aboneler = [];
    let cursor;
    do {
      const s = await kv.list({ prefix: 'a:', cursor });
      for (const k of s.keys) {
        try { const v = await kv.get(k.name); if (v) aboneler.push(JSON.parse(v)); } catch {}
      }
      cursor = s.list_complete ? undefined : s.cursor;
    } while (cursor);
    aboneler.sort((a, b) => (b.zaman || '').localeCompare(a.zaman || ''));
    return json({ aboneler, toplam: aboneler.length });
  }

  if (request.method !== 'POST') return json({ hata: 'yalniz POST' }, 405);
  let veri;
  try { veri = await request.json(); } catch { return json({ hata: 'gecersiz govde' }, 400); }
  if (kirp(veri.website, 40)) return json({ ok: true }); // honeypot
  const eposta = kirp(veri.eposta, 160).toLowerCase();
  if (!gecerli(eposta)) return json({ hata: 'gecersiz e-posta' }, 400);
  if (!kv) return json({ hata: 'takip deposu yapilandirilmadi' }, 503);
  try {
    const simdi = Date.now();
    const anahtar = `a:${eposta}`; // aynı e-posta tek kez
    const kayit = { eposta, zaman: new Date().toISOString(), onay: true };
    const yaz = kv.put(anahtar, JSON.stringify(kayit), { expirationTtl: OMUR_SN });
    if (typeof context.waitUntil === 'function') context.waitUntil(yaz); else await yaz;
    return json({ ok: true });
  } catch { return json({ hata: 'kayit basarisiz' }, 500); }
}
