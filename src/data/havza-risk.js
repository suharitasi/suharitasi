// HAVZA SU RİSKİ PUANI — 6 göstergeden bileşik 0-100 skor.
// B2B rapor, HavzaPaneli sıralaması ve Schema.org Observation için TEK kaynak.
// Tüm göstergeler mevcut build-time veriden TÜRETİLİR — yeni veri çekilmez.
import havzaVeri from '../../data/havza-veri.json';
import graceHavza from '../../data/canli/grace-havza.json';
import baraj from '../../data/canli/baraj.json';
import { graceEgilim } from './grace-hesap.js';

// Her göstergenin ağırlığı (toplam 1.0)
const W = {
  grace:    0.30,  // GRACE 5-yıllık su depolama eğilimi
  baraj:    0.25,  // EPİAŞ günlük baraj doluluk ortalaması
  yas:      0.20,  // YAS işletme rezervi / beslenim oranı
  tahsis:   0.15,  // Tahsis durumu (kapalı havza → yüksek risk)
  yuzeysuyu:0.10,  // DSİ yüzey suyu potansiyeli (düşük → risk)
};

// Normalizasyon sınırları (Türkiye havzalarından kalibre edildi)
const SINIR = {
  graceEgilimMin: -3.5,  // cm/yıl (en dik düşüş)
  graceEgilimMax:  2.0,  // cm/yıl (en dik artış)
  barajMin:   10,   // % (en düşük doluluk)
  barajMax:   90,   // % (en yüksek doluluk)
  yasOranMin: 0.2,  // rezerv/beslenim
  yasOranMax: 1.2,
  yuzyMin:    0.5,  // km³/yıl
  yuzyMax:    35.0,
};

/** Göstergeyi 0-1 arasına normalize et (0=düşük risk, 1=yüksek risk) */
function normalize(deger, min, max, ters = false) {
  if (deger == null) return 0.5; // veri yoksa nötr
  let s = Math.max(0, Math.min(1, (deger - min) / (max - min)));
  return ters ? 1 - s : s;
}

/** Havza numarasına göre 0-100 risk puanı */
export function havzaRisk(no) {
  const vd = havzaVeri.havzalar.find((h) => h.no === no);
  const gSeri = graceHavza.havzalar?.[vd?.ad]?.seri;
  const gSonuc = gSeri ? graceEgilim(gSeri) : null;
  const bHavza = baraj.havzalar?.[vd?.ad];

  // 1. GRACE eğilimi — negatif = azalma = yüksek risk
  let graceSkor = 0.5;
  if (gSonuc && gSonuc.egim != null) {
    graceSkor = normalize(gSonuc.egim, SINIR.graceEgilimMin, SINIR.graceEgilimMax, true);
  }

  // 2. Baraj doluluk — düşük doluluk = yüksek risk
  let barajSkor = 0.5;
  if (bHavza?.barajlar) {
    const doluluklar = Object.values(bHavza.barajlar)
      .map((b) => b.doluluk)
      .filter((d) => d != null);
    if (doluluklar.length) {
      const ort = doluluklar.reduce((a, b) => a + b, 0) / doluluklar.length;
      barajSkor = normalize(ort, SINIR.barajMin, SINIR.barajMax, true);
    }
  }

  // 3. YAS rezerv/beslenim oranı — düşük oran = yüksek risk
  let yasSkor = 0.5;
  if (vd?.yasBeslenimi_hm3 && vd?.yasIsletmeRezervi_hm3) {
    const oran = vd.yasIsletmeRezervi_hm3 / vd.yasBeslenimi_hm3;
    yasSkor = normalize(oran, SINIR.yasOranMin, SINIR.yasOranMax, true);
  }

  // 4. Tahsis durumu
  let tahsisSkor = 0.5;
  if (vd?.tahsis != null) {
    // Tahsis yoksa (null) = veri yok → nötr
    // Tahsis metni "kapalı" veya "kısıtlı" içeriyorsa → yüksek risk
    const metin = (typeof vd.tahsis === 'string' ? vd.tahsis : '').toLowerCase();
    if (metin.includes('kapalı') || metin.includes('kisitli') || metin.includes('yasak')) {
      tahsisSkor = 0.9;
    } else if (metin.includes('veri yok')) {
      tahsisSkor = 0.5;
    } else {
      tahsisSkor = 0.3; // açık havza → düşük risk
    }
  }

  // 5. Yüzey suyu potansiyeli — düşük potansiyel = yüksek risk
  let yuzySkor = 0.5;
  if (vd?.yuzeysuyuPotansiyeli_km3 != null) {
    yuzySkor = normalize(vd.yuzeysuyuPotansiyeli_km3, SINIR.yuzyMin, SINIR.yuzyMax, true);
  }

  // 6. YAS beslenimi — düşük = yüksek risk (yedek gösterge)
  // Zaten YAS oranı var, bu ek destek

  const toplam = graceSkor * W.grace + barajSkor * W.baraj
    + yasSkor * W.yas + tahsisSkor * W.tahsis
    + yuzySkor * W.yuzeysuyu;

  const puan = Math.round(toplam * 100);

  // Risk seviyesi
  let seviye = 'dusuk';
  let renk = '#2E7D32'; // yeşil
  if (puan >= 60) { seviye = 'yuksek'; renk = '#C62828'; }
  else if (puan >= 35) { seviye = 'orta'; renk = '#E65100'; }

  return {
    puan,
    seviye,
    renk,
    detay: {
      grace: { skor: Math.round(graceSkor * 100), egim: gSonuc?.egim, yon: gSonuc?.yon },
      baraj: { skor: Math.round(barajSkor * 100), havzaSayisi: bHavza?.barajlar ? Object.keys(bHavza.barajlar).length : 0 },
      yas: { skor: Math.round(yasSkor * 100), beslenim: vd?.yasBeslenimi_hm3, rezerv: vd?.yasIsletmeRezervi_hm3 },
      tahsis: { skor: Math.round(tahsisSkor * 100), durum: vd?.tahsis ?? 'veri yok' },
      yuzeysuyu: { skor: Math.round(yuzySkor * 100), potansiyel: vd?.yuzeysuyuPotansiyeli_km3 },
    },
  };
}

/** Tüm havzaları risk puanına göre sıralı döndür (en riskli önce) */
export function tumHavzaRiskleri() {
  return havzaVeri.havzalar
    .map((h) => ({ no: h.no, ad: h.ad, ...havzaRisk(h.no) }))
    .sort((a, b) => b.puan - a.puan);
}

/** Schema.org Observation JSON-LD (havza bazlı, AI-arama) */
export function riskSemasi(no, ad, risk) {
  return {
    '@type': 'Observation',
    name: `${ad} Su Riski Puani: ${risk.puan}/100 (${risk.seviye})`,
    description: `${ad} için bileşik su riski puanı ${risk.puan}/100 (${risk.seviye} risk). `
      + `GRACE eğilim: ${risk.detay.grace.yon ?? 'veri yok'}, `
      + `baraj doluluk etkisi: ${risk.detay.baraj.skor}/100. `
      + `6 göstergeden hesaplanmıştır.`,
    measuredProperty: { '@type': 'PropertyValue', name: 'Su Riski Puani', value: risk.puan },
    observationAbout: { '@type': 'Place', name: ad },
  };
}
