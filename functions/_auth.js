// functions/_auth.js — sayaç okuma anahtarı doğrulaması (22.09.2026).
// `_` öneki: Cloudflare Pages bu dosyayı ROTA olarak yayınlamaz; yalnız import.
//
// NEDEN: okuma anahtarı eskiden yalnız `?sayac=` sorgu dizesiyle geliyordu.
// Sorgu dizesi Cloudflare istek günlüklerine/Logpush'a DÜZ METİN düşer; tek
// sızıntı üç uçtaki tüm lead/PII ve abone listesini açığa çıkarır. Tercih
// edilen taşıma artık Authorization: Bearer başlığıdır; sorgu dizesi eski
// çağrılar için YEDEK olarak korunur (geriye dönük uyum).

/** İstekten okuma anahtarını çıkar (başlık öncelikli, sorgu yedek). */
export function sayacAnahtari(request, url) {
  const h = request.headers.get('authorization') || '';
  const m = /^Bearer\s+(.+)$/i.exec(h);
  if (m) return m[1].trim();
  const x = request.headers.get('x-sayac-anahtar');
  if (x) return x.trim();
  return url ? (url.searchParams.get('sayac') || '') : '';
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
