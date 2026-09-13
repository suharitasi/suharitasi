// functions/_middleware.js — CSP script hash enjeksiyonu (13.09.2026).
//
// AMAÇ: CSP'den `script-src 'unsafe-inline'` KALDIRMAK. Sayfadaki çalıştırılabilir
// inline <script> bloklarının SHA-256 özeti hesaplanır ve CSP başlığına
// `'sha256-...'` olarak eklenir; böylece XSS yüzeyi kapanır.
//
// SINIR: `style-src 'unsafe-inline'` KORUNUR — sitede 90+ inline `style="..."`
// niteliği var; bunların hash'i kırılgan olur. Script-src (asıl XSS vektörü)
// sıkılaştırılır.
//
// GÜVENLİK: FAIL-OPEN. Hata olursa _headers'taki CSP (unsafe-inline ile) aynen
// döner; site ASLA kırılmaz.
const VERI_TIP = /type=["']application\/(ld\+json|json)["']/i;

export async function onRequest(context) {
  const response = await context.next();
  const ct = response.headers.get('content-type') || '';
  if (!ct.includes('text/html')) return response;

  let html;
  try { html = await response.text(); } catch { return response; }

  const don = () => new Response(html, { status: response.status, headers: response.headers });
  try {
    const hashes = [];
    const re = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
    let m;
    while ((m = re.exec(html))) {
      const attrs = m[1] || '';
      if (/\bsrc=/i.test(attrs)) continue;      // harici script: 'self' yeter
      if (VERI_TIP.test(attrs)) continue;        // veri bloğu: yürütülmez
      const kod = m[2];
      if (!kod || !kod.trim()) continue;
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(kod));
      const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
      hashes.push(`'sha256-${b64}'`);
    }
    const csp = response.headers.get('content-security-policy');
    if (csp) {
      const yeni = csp.replace(/script-src ([^;]*)/, (mm, grup) => {
        const temiz = grup.replace(/'unsafe-inline'/g, '').trim();
        const ek = hashes.length ? ' ' + hashes.join(' ') : '';
        return `script-src ${temiz}${ek}`.replace(/\s+/g, ' ');
      });
      response.headers.set('content-security-policy', yeni);
    }
    return don();
  } catch {
    return don(); // fail-open: site kırılmaz
  }
}
