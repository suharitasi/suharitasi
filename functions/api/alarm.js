// functions/api/alarm.js — Kullanıcıya özel dinamik alarm aboneliği (Modül 3;
// 04.10.2026 denetimiyle sertleştirildi).
//
// POST /api/alarm {eposta, havza, esik, yon, onay} → KV'ye ('al:' öneki) yazar.
// GET  /api/alarm?sayac... YOK: okuma yalnız Authorization: Bearer SAYAC_ANAHTAR
//   (sorgu dizesi taşıması 04.10.2026'da kaldırıldı — günlüklere sızıyordu).
// Rate-limit: IP+UA 5 istek/10 dk. KVKK: yalnız e-posta+havza+eşik+açık rıza;
// IP/UA SAKLANMAZ. Eşik aşıldığında gönderim VPS tetikleyicisi (arac/alarm-
// tetikle.py) tarafından yapılır (SMTP + Telegram); bu uç yalnız KAYIT tutar.
// Gövde sınırı 2 KB; metin alanları kontrol karakterlerinden arınır.
import { rateLimit } from '../_limit.js';
import { sayacAnahtari, anahtarEsit } from '../_auth.js';
import { temizKirp as kirp, jsonOku } from '../_util.js';

const OMUR_SN = 60 * 60 * 24 * 730; // ~2 yıl

const json = (g, k = 200) =>
  new Response(JSON.stringify(g), {
    status: k,
    headers: {
      'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Kaynak': 'fn',
      'X-Content-Type-Options': 'nosniff', 'Cross-Origin-Resource-Policy': 'same-origin',
    },
  });
const gecerliEposta = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);

export async function onRequest(context) {
  const { request, env } = context;
  const kv = env && env.WA_SAYAC;
  let url;
  try { url = new URL(request.url); } catch { return json({ hata: 'gecersiz' }, 400); }

  // — OKUMA (VPS tetikleyicisi): yalnız anahtarla —
  if (kv && env.SAYAC_ANAHTAR && anahtarEsit(sayacAnahtari(request), env.SAYAC_ANAHTAR)) {
    const aboneler = [];
    let cursor, kesildi = false;
    const SINIR = 5000;
    do {
      const s = await kv.list({ prefix: 'al:', cursor });
      for (const k of s.keys) {
        if (aboneler.length >= SINIR) { kesildi = true; break; }
        try { const v = await kv.get(k.name); if (v) aboneler.push(JSON.parse(v)); } catch { /* atla */ }
      }
      if (kesildi) break;
      cursor = s.list_complete ? undefined : s.cursor;
    } while (cursor);
    return json({ aboneler, toplam: aboneler.length, ...(kesildi ? { kesildi: true, sinir: SINIR } : {}) });
  }

  if (request.method !== 'POST') return json({ hata: 'yalniz POST' }, 405);
  const gelenOrigin = request.headers.get('origin');
  if (gelenOrigin && gelenOrigin !== url.origin) return json({ hata: 'gecersiz kaynak' }, 403);

  const rl = await rateLimit(request, env, 'alarm', 5, 600);
  if (!rl.ok) return json({ hata: 'Çok fazla istek. Lütfen sonra tekrar deneyin.' }, 429);

  if (!kv) return json({ hata: 'abonelik servisi geçici olarak devre dışı' }, 503);

  const okuma = await jsonOku(request, 2000);
  if (okuma.hata) {
    return json({ hata: okuma.hata }, okuma.hata === 'gövde çok büyük' ? 413 : 400);
  }
  const veri = okuma.veri && typeof okuma.veri === 'object' ? okuma.veri : {};
  if (kirp(veri.website, 50)) return json({ ok: true }); // honeypot

  const eposta = kirp(veri.eposta, 120);
  const havza = kirp(veri.havza, 60);
  const yon = veri.yon === 'ust' ? 'ust' : 'alt';
  const esik = Number(veri.esik);
  const onay = veri.onay === true || veri.onay === 'on' || veri.onay === 'true';

  if (!gecerliEposta(eposta)) return json({ hata: 'geçerli e-posta girin' }, 400);
  if (!havza) return json({ hata: 'havza seçin' }, 400);
  if (!Number.isFinite(esik) || esik < 0 || esik > 100) return json({ hata: 'eşik 0-100 arası olmalı' }, 400);
  if (!onay) return json({ hata: 'KVKK onayı gerekli' }, 400);

  const id = (() => { try { return crypto.randomUUID().slice(0, 12); } catch { return Math.random().toString(36).slice(2, 14); } })();
  const kayit = { eposta, havza, yon, esik: Math.round(esik * 100) / 100, onay: true, zaman: new Date().toISOString() };
  try {
    await kv.put('al:' + id, JSON.stringify(kayit), { expirationTtl: OMUR_SN });
  } catch {
    return json({ hata: 'kayıt yazılamadı, tekrar deneyin' }, 503);
  }
  return json({ ok: true, id });
}
