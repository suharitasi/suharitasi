// functions/takip.js — MEVZUAT DEĞİŞİKLİK TAKİP aboneliği (13.09.2026;
// 04.10.2026 denetimiyle sertleştirildi).
// POST /takip {eposta} → KV'ye (WA_SAYAC, 'a:' öneki) abone yazar.
// E-posta GÖNDERMEZ (harici servis yok); aboneler birikir, gönderim servisi
// bağlandığında kullanılır. KVKK: yalnız e-posta + açık rıza; IP/UA saklanmaz.
// Okuma: GET /takip (Auth: Bearer SAYAC_ANAHTAR) → {aboneler:[...], toplam:n}
// Gövde sınırı 2 KB; e-posta/kontrol karakterleri arındırılır.
import { rateLimit } from './_limit.js';
import { sayacAnahtari, anahtarEsit } from './_auth.js';
import { temizKirp as kirp, jsonOku } from './_util.js';

const OMUR_SN = 60 * 60 * 24 * 730; // ~2 yıl

const json = (g, k = 200) =>
  new Response(JSON.stringify(g), {
    status: k,
    headers: {
      'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Kaynak': 'fn',
      'X-Content-Type-Options': 'nosniff', 'Cross-Origin-Resource-Policy': 'same-origin',
    },
  });
const gecerli = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);

export async function onRequest(context) {
  const { request, env } = context;
  const kv = env && env.WA_SAYAC;
  let url;
  try { url = new URL(request.url); } catch { return json({ hata: 'gecersiz' }, 400); }

  if (kv && env.SAYAC_ANAHTAR && anahtarEsit(sayacAnahtari(request), env.SAYAC_ANAHTAR)) {
    const aboneler = [];
    let cursor, kesildi = false;
    // SINIR: her abone için bir kv.get → Workers alt-istek tavanı. Tarama
    // sınırlandırılır ve kısmi sonuç `kesildi:true` ile bildirilir.
    const SINIR = 5000;
    do {
      const s = await kv.list({ prefix: 'a:', cursor });
      for (const k of s.keys) {
        if (aboneler.length >= SINIR) { kesildi = true; break; }
        try { const v = await kv.get(k.name); if (v) aboneler.push(JSON.parse(v)); } catch { /* bozuk kayıt atlanır */ }
      }
      if (kesildi) break;
      cursor = s.list_complete ? undefined : s.cursor;
    } while (cursor);
    aboneler.sort((a, b) => (b.zaman || '').localeCompare(a.zaman || ''));
    return json({ aboneler, toplam: aboneler.length, ...(kesildi ? { kesildi: true, sinir: SINIR } : {}) });
  }

  if (request.method !== 'POST') return json({ hata: 'yalniz POST' }, 405);
  // KAYNAK KONTROLÜ: yalnız kendi sitemizden POST kabul edilir.
  const gelenOrigin = request.headers.get('origin');
  if (gelenOrigin && gelenOrigin !== url.origin) return json({ hata: 'gecersiz kaynak' }, 403);
  // RATE LIMIT: 5 abonelik isteği / saat.
  const rl = await rateLimit(request, env, 'takip', 5, 3600);
  if (!rl.ok) return json({ hata: 'Cok fazla istek. Lutfen sonra tekrar deneyin.' }, 429);

  const okuma = await jsonOku(request, 2000);
  if (okuma.hata) {
    return json({ hata: okuma.hata }, okuma.hata === 'gövde çok büyük' ? 413 : 400);
  }
  const veri = okuma.veri && typeof okuma.veri === 'object' ? okuma.veri : {};
  if (kirp(veri.website, 40)) return json({ ok: true }); // honeypot

  const eposta = kirp(veri.eposta, 160).toLowerCase();
  if (!gecerli(eposta)) return json({ hata: 'gecersiz e-posta' }, 400);
  // Opsiyonel konu (il slug'ı ya da 'tum-turkiye'); yalnız slug karakterleri.
  // Geriye uyumlu: alan yoksa kayıt eskisi gibi {eposta, zaman, onay} olur.
  const konuHam = kirp(veri.konu, 60).toLowerCase().replace(/[^a-z0-9-]/g, '');
  const konu = konuHam || null;
  const onay = veri.onay === true || veri.onay === 'on' || veri.onay === 'true';
  if (!onay) return json({ hata: 'KVKK onayi gerekli' }, 400);
  if (!kv) return json({ hata: 'takip deposu yapilandirilmadi' }, 503);
  try {
    const simdi = Date.now();
    const anahtar = `a:${eposta}`; // aynı e-posta tek kez
    const kayit = { eposta, zaman: new Date().toISOString(), onay: true, ...(konu ? { konu } : {}) };
    // Abone yazımı onaylanmadan başarı dönülmez (sessiz kayıp yasağı).
    await kv.put(anahtar, JSON.stringify(kayit), { expirationTtl: OMUR_SN });
    return json({ ok: true });
  } catch { return json({ hata: 'kayit basarisiz' }, 500); }
}
