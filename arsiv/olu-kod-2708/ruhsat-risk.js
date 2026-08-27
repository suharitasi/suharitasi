// RUHSAT RISK ISi HARiTASI — il bazlı su ruhsatı zorluk endeksi.
// Göstergeler: kapalı havza sayısı, kapatma kaydı varlığı, DSİ bölge tipi
import ilKurum from '../../data/il-kurum.json';
import havzaVeri from '../../data/havza-veri.json';
import { tumIlProfilleri } from './il-profil.js';

/**
 * İl bazlı ruhsat risk skoru (0-100).
 * Yüksek skor = ruhsat almak daha zor (kapalı havza, kısıtlı bölge vs.)
 */
export function ilRuhsatRisk(ilAdi) {
  const profiller = tumIlProfilleri();
  const profil = profiller.find((p) => p.il === ilAdi);
  if (!profil) return null;

  let skor = 0;
  const detay = [];

  // 1. Kapalı/kısıtlı havzada mı? (her kapalı havza +25 puan)
  for (const h of profil.havzalar) {
    const vd = havzaVeri.havzalar.find((v) => v.ad === h.ad);
    if (vd?.tahsis) {
      const t = String(vd.tahsis).toLowerCase();
      if (t.includes('kapalı') || t.includes('kisitli') || t.includes('yasak')) {
        skor += 25;
        detay.push(`${h.ad}: kapalı/kısıtlı havza`);
      }
    }
  }

  // 2. Kapatma kaydı var mı? (proxy: il-kurum.json'dan)
  // Kapatma kayıtları veri/potansiyel/ altında, burada il ataması
  // doğrulanmadığı için direkt kullanılmaz. Yerine DSİ bölge notu.
  const bolgeler = profil.dsiBolgeleri || [];
  for (const b of bolgeler) {
    // Bazı bölgelerde ek kısıt olabilir
    if (b.not && String(b.not).toLowerCase().includes('kısıt')) {
      skor += 10;
      detay.push(`DSİ ${b.no}. Bölge: kısıt notu mevcut`);
    }
  }

  // 3. GRACE durumu (düşüş var mı?)
  if (profil.graceEgilim && profil.graceEgilim.yon === 'azalma') {
    skor += 15;
    detay.push(`GRACE: su depolaması azalma eğiliminde`);
  }

  // 4. Havza sayısına göre ek risk (çok havzalı illerde bürokrasi karmaşık)
  if (profil.havzalar.length >= 3) {
    skor += 5;
    detay.push(`${profil.havzalar.length} havzaya yayılıyor — çoklu yetki alanı`);
  }

  // Renk ve seviye
  let seviye = 'dusuk';
  let renk = '#2E7D32';
  if (skor >= 50) { seviye = 'yuksek'; renk = '#C62828'; }
  else if (skor >= 25) { seviye = 'orta'; renk = '#E65100'; }

  return {
    il: ilAdi,
    puan: Math.min(100, skor),
    seviye,
    renk,
    detay,
    havzalar: profil.havzalar.map((h) => h.ad),
    bolgeler: bolgeler.map((b) => `DSİ ${Number(b.no)}. Bölge (${b.merkez})`),
  };
}

/** Tüm iller için ruhsat risk skoru */
export function tumIlRiskleri() {
  const profiller = tumIlProfilleri();
  return profiller
    .map((p) => ilRuhsatRisk(p.il))
    .filter(Boolean)
    .sort((a, b) => b.puan - a.puan);
}

/** MapLibre choropleth için il → renk eşlemesi (GeoJSON join) */
export function riskRenkHaritasi() {
  const riskler = tumIlRiskleri();
  const harita = {};
  for (const r of riskler) {
    harita[r.il] = { puan: r.puan, renk: r.renk, seviye: r.seviye };
  }
  return harita;
}
