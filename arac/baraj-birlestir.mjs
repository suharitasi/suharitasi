/* BARAJ NORMALİZE ÇEKİRDEĞİ — saf işlev (B1.3, 2026-07-28).
 *
 * NEDEN AYRI DOSYA: bu mantık `baraj-cek.mjs` içinde `calis()` gövdesine
 * gömülüydü ve ağ çağrılarıyla iç içeydi; bilinen girdi → bilinen çıktı
 * testi yazılamıyordu. Davranış AYNEN taşındı (satır satır), yalnız
 * yeri değişti. Artık `arac/altin-ornek.mjs` bunu sabit veriyle koşar.
 *
 * SAF: ağ yok, dosya yok, saat yok. `bugun` ve `cekimUTC` dışarıdan verilir
 * ki test deterministik olsun.
 */

/**
 * @param {object} girdi
 * @param {Record<string,string[]>} girdi.eslesme   havza → baraj adları
 * @param {object} girdi.setler                     EPİAŞ kayıt setleri
 * @param {object} girdi.canli                      mevcut baraj.json (mutasyona uğrar)
 * @param {string} girdi.bugun                      YYYY-MM-DD
 * @param {string} girdi.cekimUTC                   ISO zaman damgası
 * @returns {{canli: object, islenen: number}}
 */
export function birlestir({ eslesme, setler, canli, bugun, cekimUTC }) {
  const c = canli.kunye;
  if (!c.kayitBaslangici) c.kayitBaslangici = bugun;
  c.sonGuncelleme = bugun;
  c.sonDurum = 'ok';

  const dolulukla = new Map(setler['active-fullness'].map((k) => [`${k.basin}|${k.dam}`, k]));
  const kotla = new Map(setler['daily-kot'].map((k) => [`${k.basin}|${k.dam}`, k]));

  let islenen = 0;
  for (const [havza, barajlar] of Object.entries(eslesme)) {
    const H = (canli.havzalar[havza] ??= { barajlar: {} });
    for (const baraj of barajlar) {
      const B = (H.barajlar[baraj] ??= { seri: {} });
      const d = dolulukla.get(`${havza}|${baraj}`);
      const k = kotla.get(`${havza}|${baraj}`);
      if (d || k) {
        B.seri[bugun] = {
          ...(d?.activeFullnessAmount != null && { doluluk: d.activeFullnessAmount }),
          ...(k?.dailyKot != null && { kot: k.dailyKot }),
        };
        islenen++;
      }
      // veri gelmeyen baraja o gün için kayıt YAZILMAZ (boş obje bile değil)
    }
  }
  canli.gunler[bugun] = { cekimUTC, durum: 'ok', barajKaydi: islenen };
  return { canli, islenen };
}
