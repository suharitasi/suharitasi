// functions/_util.js — ortak doğrulama/yanıt yardımcıları (04.10.2026 denetimi).
// `_` öneki: Cloudflare Pages bu dosyayı ROTA olarak yayınlamaz; yalnız import.
//
// NEDEN: kullanıcı girişi taşıyan uçlarda (talep/danisma/takip/alarm/olay)
// iki açık vardı: (1) gövde boyut sınırı yoktu — büyük gövdeyle CPU/bellek
// sömürülebilirdi; (2) kırpma yalnız trim+slice yapıyordu — ANSI/terminal
// kaçışları ve kontrol karakterleri lead kaydına düz geçiyordu. İkisi de
// tek kaynaktan kapatılır.

// Kullanıcı metni: kontrol karakterlerini (C0/C1 + DEL, ANSI kaçışları dahil)
// boşluğa çevirir; kırpar ve üst sınırı uygular. Sayı/boolean alanlara
// uygulanmaz (çağıran taraf tip denetimi yapar).
export const temizKirp = (s, n) =>
  typeof s === 'string'
    ? s.replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ').trim().slice(0, n)
    : '';

// Gövde okuma + boyut sınırı. Content-Length beyanı yoksa (chunked) okuma
// sonrası bayt sayısıyla denetlenir. Dönüş: { veri } ya da { hata }.
export async function jsonOku(request, enCokBayt = 10000) {
  const cl = Number(request.headers.get('content-length') || '0');
  if (Number.isFinite(cl) && cl > enCokBayt) return { hata: 'gövde çok büyük' };
  let ham;
  try {
    ham = await request.text();
  } catch {
    return { hata: 'gövde okunamadı' };
  }
  if (new TextEncoder().encode(ham).length > enCokBayt) return { hata: 'gövde çok büyük' };
  try {
    return { veri: JSON.parse(ham) };
  } catch {
    return { hata: 'geçersiz gövde' };
  }
}
