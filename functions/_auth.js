// functions/_auth.js — sayaç okuma anahtarı doğrulaması (22.09.2026).
// `_` öneki: Cloudflare Pages bu dosyayı ROTA olarak yayınlamaz; yalnız import.
//
// NEDEN: okuma anahtarı eskiden yalnız `?sayac=` sorgu dizesiyle geliyordu.
// Sorgu dizesi Cloudflare istek günlüklerine/Logpush'a DÜZ METİN düşer; tek
// sızıntı üç uçtaki tüm lead/PII ve abone listesini açığa çıkarır. Tercih
// edilen taşıma artık Authorization: Bearer başlığıdır; sorgu dizesi eski
// çağrılar için YEDEK olarak korunur (geriye dönük uyum).

/** İstekten okuma anahtarını çıkar.
 *
 * YALNIZ başlık: `Authorization: Bearer …` ya da `X-Sayac-Anahtar: …`.
 * Sorgu dizesi taşıması (04.10.2026 denetimi) KALDIRILDI: sorgu dizesi
 * Cloudflare istek günlüklerine/Logpush'a düz metin düşer; tek sızıntı
 * üç uçtaki tüm lead/PII ve abone listesini açar. Depodaki tüm çağıranlar
 * (whatsapp-sayac.sh, temas-sayac.sh, alarm-tetikle.py) zaten Bearer
 * kullanıyor; geriye dönük uyum yalnız sızıntı yüzeyiydi.
 */
export function sayacAnahtari(request) {
  const h = request.headers.get('authorization') || '';
  const m = /^Bearer\s+(.+)$/i.exec(h);
  if (m) return m[1].trim();
  const x = request.headers.get('x-sayac-anahtar');
  if (x) return x.trim();
  return '';
}

/** Sabit zamanlı karşılaştırma (uzunluk/zamanlama sızıntısını azaltır). */
export function anahtarEsit(a, b) {
  const s1 = String(a || '');
  const s2 = String(b || '');
  if (s1.length !== s2.length) return false;
  let f = 0;
  for (let i = 0; i < s1.length; i++) f |= s1.charCodeAt(i) ^ s2.charCodeAt(i);
  return f === 0;
}
