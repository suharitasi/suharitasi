// ORTAK NORMALİZASYON (13.09.2026) — build-time kancaları ile src/data
// modülleri arasındaki tekrarı kaldırır. Saf fonksiyonlar; JSON importu YOK
// (astro.config.mjs'ten de import edilebilir).
const BELIRSIZ = /belirsiz/i;

/** Kısıt sorgu kayıtlarını normalize et (il/ilçe/durum/tarih/kaynak).
 *  ana + ek JSON dosyalarının `kayitlar` dizilerini alır. */
export function kisitNormalize(anaKayitlar = [], ekKayitlar = []) {
  const gorulen = new Set();
  const out = [];
  for (const k of [...anaKayitlar, ...ekKayitlar]) {
    const ilHam = k.il;
    const iller = (Array.isArray(ilHam) ? ilHam : (ilHam ? [ilHam] : [])).filter((x) => x && !BELIRSIZ.test(x));
    if (!iller.length) continue;
    const saha = (k.saha_adi || '').replace(/\s+/g, ' ').trim().slice(0, 200);
    const anahtar = `${k.kaynak_url || ''}|${k.rg_tarih || ''}|${saha.slice(0, 60)}`;
    if (gorulen.has(anahtar)) continue;
    gorulen.add(anahtar);
    out.push({
      il: iller,
      ilce: k.ilceler && typeof k.ilceler === 'object' ? Object.keys(k.ilceler) : [],
      durum: k.durum || 'belirsiz',
      tarih: k.rg_tarih || '',
      kaynak: k.kaynak_url || '',
      saha,
    });
  }
  out.sort((a, b) => (b.tarih || '').localeCompare(a.tarih || ''));
  return out;
}

/** Su işlemlerini yetkili kurum + dayanak + kanalla birleştir. */
export function islemJoin(suIslemleri = [], hangiKapi = [], suBirimleri = []) {
  const kb = Object.fromEntries(suBirimleri.map((k) => [k.id, k]));
  const hb = Object.fromEntries(hangiKapi.map((s) => [s.islem_id, s]));
  return suIslemleri.map((i) => {
    const s = hb[i.id] || {};
    return {
      id: i.id, ad: i.islem_adi, dayanak: i.dayanak, kaynak: i.kaynak,
      yetkiliKurumlar: (s.yetkili_kurum_id || []).map((id) => ({ id, ad: (kb[id] || {}).ad_resmi || id, kisaltma: (kb[id] || {}).kisaltma || null })),
      kurumlar: (s.yetkili_kurum_id || []).map((id) => ({ id, ad: (kb[id] || {}).ad_resmi || id, kisaltma: (kb[id] || {}).kisaltma || null })),
      mevzuatDayanagi: s.mevzuat_dayanagi || null,
      basvuruKanali: s.basvuru_kanali || null,
      durum: s.durum || null,
      ilgiliRehber: s.ilgili_rehber || null,
    };
  });
}
