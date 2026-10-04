// functions/api/talep.js — PARSEL BAZLI HİDROJEOLOJİK ÖN DEĞERLENDİRME talebi.
//
// İŞ: POST /api/talep → gövdedeki TEKNİK talebi KV'ye (WA_SAYAC) yazar.
// - Harici e-posta servisi YOK; talep KV'de birikir. Okuma yolu (04.10.2026):
//   GET /olay (SAYAC_ANAHTAR) yanıtındaki `parseller` alanı ya da
//   `arac/temas-sayac.sh --parsel`. Önek: `p:`.
// - ÖNEK DÜZELTMESİ (04.10.2026 denetimi): eski uygulama WhatsApp tıklama
//   sayacıyla AYNI `t:` önekini kullanıyordu → tıklama sayısı form
//   gönderimleriyle şişiyordu. Talep artık `p:` yazar.
// - HUKUKİ SINIR (bağlayıcı): bu uç yalnız TEKNİK veri talebi toplar.
//   Dilekçe/avukatlık/hukuki danışmanlık metni veya vaadi taşımaz.
// - KVKK: yalnız kullanıcının açık rızasıyla (onay) alınan alanlar yazılır;
//   IP/UA SAKLANMAZ. Honeypot doluysa istek sessizce yutulur.
// - KV bağı yoksa 503 döner → istemci mailto'ya düşer (veri kaybolmaz).
// - Gövde sınırı 10 KB; tüm metin alanları kontrol karakterlerinden arınır.
//
// ZORUNLU: il, ilce, telefon, onay. OPSİYONEL: adaParsel, sayfa.
import { rateLimit } from '../_limit.js';
import { temizKirp as kirp, jsonOku } from '../_util.js';

const OMUR_SN = 60 * 60 * 24 * 365; // ~1 yıl (talep kapanınca silinir)

const trGun = (ms) => new Date(ms + 3 * 3600 * 1000).toISOString().slice(0, 10);
const rastgele = () => {
  try { return crypto.randomUUID().slice(0, 8); } catch { return Math.random().toString(36).slice(2, 10); }
};

const json = (govde, kod = 200) =>
  new Response(JSON.stringify(govde), {
    status: kod,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Kaynak': 'fn',
      'X-Content-Type-Options': 'nosniff',
      'Cross-Origin-Resource-Policy': 'same-origin',
    },
  });

// Türkiye cep/sabit hattı: yalnız rakam; 0 veya 90 öneki kabul, 10 hane gövde.
function telNormalize(ham) {
  let d = String(ham || '').replace(/\D/g, '');
  if (d.startsWith('90')) d = d.slice(2);
  if (d.startsWith('0')) d = d.slice(1);
  if (d.length !== 10) return '';
  return '0' + d;
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST') return json({ hata: 'yalnız POST' }, 405);

  // KAYNAK KONTROLÜ: yalnız kendi sitemizden POST kabul edilir.
  let origin = '';
  try { origin = new URL(request.url).origin; } catch { origin = ''; }
  const gelenOrigin = request.headers.get('origin');
  if (gelenOrigin && origin && gelenOrigin !== origin) return json({ hata: 'geçersiz kaynak' }, 403);

  // RATE LIMIT: IP+UA başına 5 istek / 10 dakika.
  const rl = await rateLimit(request, env, 'talep', 5, 600);
  if (!rl.ok) return json({ hata: 'Çok fazla istek. Lütfen biraz sonra tekrar deneyin.' }, 429);

  const okuma = await jsonOku(request, 10000);
  if (okuma.hata) {
    return json({ hata: okuma.hata }, okuma.hata === 'gövde çok büyük' ? 413 : 400);
  }
  const veri = okuma.veri && typeof okuma.veri === 'object' ? okuma.veri : {};

  // Honeypot — botlar doldurur; sessiz başarı dön.
  if (kirp(veri.website, 50)) return json({ ok: true });

  const telefon = telNormalize(veri.telefon);
  const talep = {
    tur: 'parsel-hidrojeolojik-on-talep',
    il: kirp(veri.il, 60),
    ilce: kirp(veri.ilce, 60),
    adaParsel: kirp(veri.adaParsel, 80),
    telefon,
    onay: veri.onay === true || veri.onay === 'on' || veri.onay === 'true',
    sayfa: kirp(veri.sayfa, 200),
    zaman: new Date().toISOString(),
  };

  if (!talep.il || !talep.ilce || !telefon || !talep.onay) {
    return json({ hata: 'zorunlu alan eksik (il, ilçe, telefon, KVKK onayı)' }, 400);
  }

  const kv = env && env.WA_SAYAC;
  if (!kv) return json({ hata: 'talep deposu yapılandırılmadı' }, 503);

  try {
    const simdi = Date.now();
    const anahtar = `p:${trGun(simdi)}:${simdi}-${rastgele()}`;
    // Yazma ONAYLANMADAN başarı dönülmez (sessiz kayıp yasağı).
    await kv.put(anahtar, JSON.stringify(talep), { expirationTtl: OMUR_SN });
    return json({ ok: true });
  } catch {
    return json({ hata: 'kayıt başarısız' }, 500);
  }
}
