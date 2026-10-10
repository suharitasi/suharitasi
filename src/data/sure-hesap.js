// SÜRE HESABI — TEK MODÜL (DURAK 1 A-b, 10.10.2026; hukuki onay bekliyor).
// Kurallar data/kamu/sure-tablosu.json'dan parametre olarak gelir (tarayıcıda sayfadaki JSON'dan).
// Sayfalar bu dosyayı /s/sure-hesap.js adresinden (src/pages/s/sure-hesap.js.ts) alır; Astro bileşenleri doğrudan içe aktarır.
const iki = (n) => String(n).padStart(2, '0');
const ayGun = (d) => `${iki(d.getMonth() + 1)}-${iki(d.getDate())}`;

export function tatilMi(d, kurallar) {
  if (d.getDay() === 0) return true; // Pazar — 2429 m.3/A
  return (kurallar.tatil.sabit || []).includes(ayGun(d));
}

/** { son, sonUzamis, araVerme, notlar } — son: tebliğe göre son gün (Date). */
export function sonGun(tebligISO, yolId, kurallar) {
  const yol = kurallar.yollar[yolId];
  const t = new Date(`${tebligISO}T00:00:00`);
  if (!yol || Number.isNaN(t.getTime())) return null;
  const son = new Date(t.getTime());
  son.setDate(son.getDate() + yol.gun); // "izleyen günden başlar" → tebliğ + gün
  const notlar = [];
  let uzama = 0;
  if (yol.kural === '2577m8') {
    while (tatilMi(son, kurallar)) { son.setDate(son.getDate() + 1); uzama++; }
    if (uzama) notlar.push(`Son gün tatile rastladığı için ${uzama} gün uzadı (2577 m.8/2).`);
    const av = kurallar.ara_verme;
    const yil = son.getFullYear();
    const bas = new Date(`${yil}-${av.bas}T00:00:00`), bit = new Date(`${yil}-${av.son}T00:00:00`);
    let araVerme = null;
    if (son >= bas && son <= bit) {
      araVerme = new Date(bit.getTime()); araVerme.setDate(araVerme.getDate() + av.uzama_gun);
      notlar.push(`Son gün adli ara vermeye rastlıyor: idare mahkemeniz ara vermeden yararlanıyorsa süre ${araVerme.toLocaleDateString('tr-TR')} tarihine uzar (${av.dayanak}). ${av.not}`);
    }
    notlar.push(...(kurallar.tatil.notlar || []));
    return { son, uzama, araVerme, notlar };
  }
  if (yol.hesap_notu) notlar.push(yol.hesap_notu);
  return { son, uzama: 0, araVerme: null, notlar };
}

export function kalanGun(son) {
  const b = new Date(); b.setHours(0, 0, 0, 0);
  return Math.round((son.getTime() - b.getTime()) / 86400000);
}
