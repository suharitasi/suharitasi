// functions/_limit.js — KV tabanlı hız sınırlama yardımcısı (13.09.2026).
// `_` öneki: Cloudflare Pages bu dosyayı ROTA olarak yayınlamaz; yalnız import.
//
// YÖNTEM: sabit pencere sayacı (KV). IP+UA SHA-256 ile kısaltılıp anahtara
// gömülür — ham IP SAKLANMAZ (pseudonim, kısa TTL). KV eventually-consistent
// olduğundan eşzamanlı isteklerde sayım tam kesin değildir; amaç kesin kota
// değil, kaba abuse frenidir. KV bağı yoksa sınır uygulanmaz (fail-open).
export async function rateLimit(request, env, endpoint, limit, pencereSn = 60) {
  const kv = env && env.WA_SAYAC;
  if (!kv) return { ok: true, kalan: limit };
  // IP: Cloudflare edge'de cf-connecting-ip her zaman vardır ve istemci
  // tarafından sahtelenemez. x-forwarded-for yalnız yerel/kenar-dışı koşumda
  // (ör. birim sınaması) yedektir — üretimde cf-connecting-ip kazanır.
  let hash;
  try {
    const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '';
    const ua = request.headers.get('user-agent') || '';
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip + '|' + ua));
    hash = [...new Uint8Array(buf)].slice(0, 8).map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Hash üretilemezse ORTAK bir 'yok' kovasına düşmek TÜM kullanıcıları
    // birlikte kilitlerdi (fail-closed DoS). Sınır atlanır (fail-open):
    // KV yokluğuyla aynı sözleşme.
    return { ok: true, kalan: limit };
  }
  const pencere = Math.floor(Date.now() / (pencereSn * 1000));
  const key = `r:${endpoint}:${pencere}:${hash}`;
  let n = 0;
  try { const v = await kv.get(key); n = v ? parseInt(v, 10) || 0 : 0; } catch { return { ok: true, kalan: limit }; }
  if (n >= limit) return { ok: false, kalan: 0 };
  try { await kv.put(key, String(n + 1), { expirationTtl: pencereSn * 2 }); } catch { /* sayım kaybı freni durdurmaz */ }
  return { ok: true, kalan: Math.max(0, limit - n - 1) };
}
