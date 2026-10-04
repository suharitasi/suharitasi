// functions/whatsapp.js — Cloudflare Pages Function (karar-kapatma Faz B, 08.09.2026;
// rapor/08-09-karar-kapatma.md §B · karar dosyası §D7 seçenek c).
// Yol: /whatsapp ve /whatsapp/ (Pages yönlendiricisinde sondaki eğik çizgi
// isteğe bağlıdır — developers.cloudflare.com/pages/functions/routing).
//
// İŞ: düğme tıklamasını KV'ye YAZ (yanıtı bekletmeden), HER DURUMDA 302 → wa.me.
// - KV bağlı değilse (env.WA_SAYAC tanımsız) ya da yazım hata verirse yönlendirme
//   ETKİLENMEZ (B5 kanıtı: arac/test/whatsapp-fn.test.mjs).
// - Çerez YOK. Kişisel veri YOK: anahtar = 't:' + gün + ':' + zaman + rastgele;
//   IP / User-Agent / Referer değeri SAKLANMAZ. Yalnız gün → sayı türetilir.
// - Sayım yalnız tarayıcı gezinmesi: Sec-Fetch-Dest: document ya da aynı-köken
//   Referer. Sağlık betiği (md3, Node fetch) ve botlar bu başlıkları taşımaz →
//   sayılmaz (ölçüldü: Node 22 fetch başlıklarında sec-fetch-dest ve referer yok).
// - KV'de atomik artış YOKTUR (aynı anahtara 1 yazma/sn, eventual consistency);
//   bu yüzden her tıklama AYRI anahtar, okuma list({prefix}) ile toplar.
//   Ücretsiz kota: 1.000 yazma/gün, 1.000 list/gün (kv/platform/pricing).
// - Aynı yolda public/_redirects kuralı DURUYOR: Cloudflare, Function'ın servis
//   ettiği isteğe _redirects UYGULAMAZ (kural yedek: kota bitince "Fail open"
//   statik sunum, yerel arac/dist-sun.mjs, sağlık onarımı). Hedef değişirse
//   İKİ YERDE değiştir: burada HEDEF + public/_redirects.
// - _headers Function yanıtına uygulanmaz → HSTS/Cache-Control burada verilir.
// - OKUMA (B3): GET /whatsapp/?sayac=<SAYAC_ANAHTAR> → {"gunler":{"YYYY-MM-DD":n},"toplam":n}.
//   SAYAC_ANAHTAR Pages "Variables and Secrets" (Encrypt) ile tanımlanır; yerelde
//   .env WA_SAYAC_ANAHTAR (arac/whatsapp-sayac.sh). Anahtar yok/yanlış → normal 302.
import { sayacAnahtari, anahtarEsit } from './_auth.js';

const HEDEF = 'https://wa.me/905324497144';
const OMUR_SN = 60 * 60 * 24 * 400; // anahtar ömrü ~400 gün (KV alt sınırı 60 sn)

// Türkiye günü (UTC+3, yaz saati yok) — baraj-cek.mjs ile aynı kural.
const trGun = (ms) => new Date(ms + 3 * 3600 * 1000).toISOString().slice(0, 10);

const rastgele = () => {
  try { return crypto.randomUUID().slice(0, 8); } catch { return Math.random().toString(36).slice(2, 10); }
};

function yonlendir(env) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: (env && env.WA_HEDEF) || HEDEF,
      'Cache-Control': 'no-store',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-Kaynak': 'fn', // canlı ölçüm: bu başlık varsa isteği Function karşıladı, _redirects değil
    },
  });
}

async function sayacOku(kv) {
  const gunler = {};
  let cursor, toplam = 0;
  do {
    const s = await kv.list({ prefix: 't:', cursor }); // sayfa başına en çok 1.000 anahtar
    for (const k of s.keys) {
      // ÖNEK AYRIMI (04.10.2026 denetimi): 27.09–04.10 arası api/talep.js aynı
      // 't:' önekine JSON yazıyordu. Tıklama kayıtları BOŞ değerlidir; boş
      // olmayan değer eski parsel kaydıdır → WhatsApp sayımına katılmaz.
      try { const v = await kv.get(k.name); if (v) continue; } catch { /* okunamayan kayıt eski davranışla sayılır */ }
      const g = k.name.slice(2, 12);
      gunler[g] = (gunler[g] || 0) + 1;
      toplam++;
    }
    cursor = s.list_complete ? undefined : s.cursor; // list_complete esas (boş dizi yetmez)
  } while (cursor);
  return { gunler, toplam };
}

export async function onRequest(context) {
  const { request, env } = context;
  const kv = env && env.WA_SAYAC; // bağlama yoksa undefined → sayım atlanır
  let url;
  try { url = new URL(request.url); } catch { return yonlendir(env); }

  // OKUMA YOLU — yalnız gizli anahtar tanımlı VE eşleşiyorsa.
  if (kv && env.SAYAC_ANAHTAR && anahtarEsit(sayacAnahtari(request), env.SAYAC_ANAHTAR)) {
    try {
      const sonuc = await sayacOku(kv);
      return new Response(JSON.stringify({ ...sonuc, okuma: new Date().toISOString() }), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Kaynak': 'fn',
          'X-Content-Type-Options': 'nosniff', 'Cross-Origin-Resource-Policy': 'same-origin',
        },
      });
    } catch (e) {
      return new Response(JSON.stringify({ hata: 'sayaç okunamadı', sebep: String(e && e.message || e) }), {
        status: 500, headers: {
          'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff', 'Cross-Origin-Resource-Policy': 'same-origin',
        },
      });
    }
  }

  // SAYIM — yanıtı bekletmez; her hata yutulur, yönlendirme koşulsuz döner.
  const gezinme = request.headers.get('sec-fetch-dest') === 'document'
    || (request.headers.get('referer') || '').startsWith(url.origin + '/');
  if (kv && gezinme && request.method === 'GET') {
    try {
      const simdi = Date.now();
      const anahtar = `t:${trGun(simdi)}:${simdi}-${rastgele()}`;
      const yaz = kv.put(anahtar, '', { expirationTtl: OMUR_SN }).catch(() => {});
      if (typeof context.waitUntil === 'function') context.waitUntil(yaz);
    } catch { /* sayım kaybı yönlendirmeyi durdurmaz */ }
  }
  return yonlendir(env);
}
