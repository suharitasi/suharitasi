// functions/_log.js — API erişim günlüğü (04.10.2026, sahip talimatı).
// `_` öneki: Cloudflare Pages bu dosyayı ROTA olarak yayınlamaz; yalnız import.
//
// KAPSAM: yalnız MAKİNE uçları — /api/v1/havzalar, /api/v1/kuraklik, /mcp.
// Form/kişisel veri uçları (talep/danisma/takip/alarm) BİLİNÇLİ olarak
// günlüklenmez (veri minimizasyonu).
//
// VERİ: IP, uç, HTTP durum kodu, ISO zaman. IP kaynağı cf-connecting-ip
// (Cloudflare edge'de istemci sahtelemesi engelli); yedek x-forwarded-for
// yalnız yerel koşum içindir. Kayıt 30 gün sonra otomatik silinir (TTL).
//
// ANAHTAR SIRASI: `h:<9999999999999-epochMs>-<rastgele>` → KV list() anahtarı
// sözlük sırasıyla döndürdüğünden EN YENİ kayıt İLK gelir; panel taraması
// tüm geçmişi sayfalamak zorunda kalmaz (alt-istek tavanı korunur).
//
// SESSİZLİK: yazım hatası API yanıtını ASLA bozmaz (waitUntil + yut); KV
// bağı yoksa günlük sessizce atlanır — fail-open sözleşmesi.
export const LOG_TTL_SN = 60 * 60 * 24 * 30; // 30 gün
const TERS_TABAN = 9999999999999;

const rastgele = () => {
  try { return crypto.randomUUID().slice(0, 8); }
  catch { return Math.random().toString(36).slice(2, 10); }
};

export function erisimKaydet(context, uc, durum) {
  try {
    const { request, env } = context;
    const kv = env && env.WA_SAYAC;
    if (!kv) return;
    const hamIp = (request.headers.get('cf-connecting-ip')
      || request.headers.get('x-forwarded-for') || '').split(',')[0].trim();
    const simdi = Date.now();
    const kayit = JSON.stringify({
      t: new Date(simdi).toISOString(),
      i: hamIp.slice(0, 45) || 'bilinmiyor',
      u: String(uc || '').slice(0, 60),
      s: Number(durum) || 0,
    });
    const anahtar = `h:${TERS_TABAN - simdi}-${rastgele()}`;
    const yaz = kv.put(anahtar, kayit, { expirationTtl: LOG_TTL_SN }).catch(() => {});
    if (typeof context.waitUntil === 'function') context.waitUntil(yaz);
  } catch { /* günlük hatası yanıtı bozmaz */ }
}
