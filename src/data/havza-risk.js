// HAVZA SU RİSKİ PUANI — bileşik 0-100 skor.
// B2B rapor, HavzaPaneli sıralaması ve Schema.org Observation için TEK kaynak.
// Tüm göstergeler mevcut build-time veriden TÜRETİLİR — yeni veri çekilmez.
//
// 27.08.2026 ONARIMI (denetim kararı K1, kullanıcı onaylı — seçenek (a);
// kanıt: rapor/26-08-denetim-dogrulama.md D11):
//  1) Baraj araması havza adını ÇIPLAK hâle getirir. Önceden
//     `baraj.havzalar["Gediz Havzası"]` aranıyordu; baraj.json anahtarı
//     "Gediz" — eşleşme 0/25 idi. Aynı çözüm il-profil.js:34-35'te zaten
//     vardı ve nedeni orada yazılıydı.
//  2) Doluluk `barajlar[AD].seri[EN_SON_TARİH].doluluk` yolundan okunur.
//     Önceden `b.doluluk` okunuyordu; o alan kayıtta HİÇ YOK.
//  3) VERİSİ OLMAYAN GÖSTERGE PUANA GİRMEZ. Önceden veri yokken nötr 0,5
//     basılıyordu; bu bir ARA DEĞERDİR ve /hakkinda/ sayfasındaki
//     "tahmin veya ara değer üretilmez" taahhüdünü ihlal ediyordu.
//     Sonuç: puanın %40'ı (baraj %25 + tahsis %15) 25/25 havzada SABİTTİ.
//     Artık ağırlıklar, o havzada verisi OLAN göstergeler arasında
//     yeniden normalize edilir. Ağırlık SABİTLERİ değişmedi.
//  4) Hiçbir göstergenin verisi yoksa puan `null` döner — sayfa "puan
//     hesaplanamadı" gösterir; uydurma sayı basılmaz.
import havzaVeri from '../../data/havza-veri.json';
import graceHavza from '../../data/canli/grace-havza.json';
import baraj from '../../data/canli/baraj.json';
import { graceEgilim } from './grace-hesap.js';
import { SITE } from './site';

// Her göstergenin ağırlığı (toplam 1.0). SABİTTİR — veri yokluğunda
// değiştirilmez, yalnız katkı verenler arasında yeniden normalize edilir.
export const W = {
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

/** Göstergeyi 0-1 arasına normalize et (0=düşük risk, 1=yüksek risk).
 *  DEĞER NULL GELMEZ — çağıran taraf veri yokluğunu kendisi eler (onarım 3). */
function normalize(deger, min, max, ters = false) {
  const s = Math.max(0, Math.min(1, (deger - min) / (max - min)));
  return ters ? 1 - s : s;
}

/** EPİAŞ havza adı çıplaktır ("Sakarya"); site başlığı "Sakarya Havzası".
 *  Aynı çözüm il-profil.js:34-35'te de var. */
const ciplakAd = (ad) => (ad ?? '').replace(/\s*Havzası\s*$/, '');

/** Havzadaki barajların EN SON tarihli doluluk ortalaması.
 *  Kayıt yapısı: barajlar[AD].seri["YYYY-MM-DD"].doluluk */
function barajSonDoluluk(bHavza) {
  if (!bHavza?.barajlar) return null;
  const son = [];
  const tarih = [];
  for (const kayit of Object.values(bHavza.barajlar)) {
    const seri = kayit?.seri;
    if (!seri) continue;
    const tarihler = Object.keys(seri).sort();
    for (let i = tarihler.length - 1; i >= 0; i--) {
      const d = seri[tarihler[i]]?.doluluk;
      if (d != null) { son.push(d); tarih.push(tarihler[i]); break; }
    }
  }
  if (!son.length) return null;
  return {
    ortalama: son.reduce((a, b) => a + b, 0) / son.length,
    barajSayisi: son.length,
    // K6 (27.08): Observation.observationDate icin GERCEK tarih — serideki
    // en son olcum gunu. Uydurulmus/derleme tarihi DEGILDIR.
    sonOlcumTarihi: tarih.sort().at(-1) ?? null,
  };
}

/** Havza numarasına göre 0-100 risk puanı (verisi olmayan gösterge puana girmez) */
export function havzaRisk(no) {
  const vd = havzaVeri.havzalar.find((h) => h.no === no);
  const gSeri = graceHavza.havzalar?.[vd?.ad]?.seri;
  const gSonuc = gSeri ? graceEgilim(gSeri) : null;
  const bHavza = baraj.havzalar?.[ciplakAd(vd?.ad)];
  const bDoluluk = barajSonDoluluk(bHavza);

  // Her gösterge: skor (0-1) ya da null (veri yok). NULL = PUANA GİRMEZ.
  const g = {};

  // 1. GRACE eğilimi — negatif = azalma = yüksek risk
  g.grace = (gSonuc && gSonuc.egim != null)
    ? normalize(gSonuc.egim, SINIR.graceEgilimMin, SINIR.graceEgilimMax, true) : null;

  // 2. Baraj doluluk — düşük doluluk = yüksek risk
  g.baraj = bDoluluk ? normalize(bDoluluk.ortalama, SINIR.barajMin, SINIR.barajMax, true) : null;

  // 3. YAS rezerv/beslenim oranı — düşük oran = yüksek risk
  g.yas = (vd?.yasBeslenimi_hm3 && vd?.yasIsletmeRezervi_hm3)
    ? normalize(vd.yasIsletmeRezervi_hm3 / vd.yasBeslenimi_hm3, SINIR.yasOranMin, SINIR.yasOranMax, true) : null;

  // 4. Tahsis durumu — havza bazlı açık tahsis verisi kamuya yayımlanmıyor;
  //    veri kaydı 25/25 null olduğu için bu gösterge fiilen devre dışıdır.
  //    Mantık KORUNUYOR: veri gelirse kendiliğinden puana girer.
  g.tahsis = null;
  if (vd?.tahsis != null) {
    const metin = (typeof vd.tahsis === 'string' ? vd.tahsis : '').toLowerCase();
    if (metin.includes('veri yok')) g.tahsis = null;
    else if (metin.includes('kapalı') || metin.includes('kisitli') || metin.includes('yasak')) g.tahsis = 0.9;
    else g.tahsis = 0.3; // açık havza → düşük risk
  }

  // 5. Yüzey suyu potansiyeli — düşük potansiyel = yüksek risk
  g.yuzeysuyu = (vd?.yuzeysuyuPotansiyeli_km3 != null)
    ? normalize(vd.yuzeysuyuPotansiyeli_km3, SINIR.yuzyMin, SINIR.yuzyMax, true) : null;

  // Bileşik puan: YALNIZ verisi olan göstergeler, ağırlıkları kendi
  // aralarında yeniden normalize edilerek. Ağırlık sabitleri değişmedi.
  const katkiVerenler = Object.keys(W).filter((k) => g[k] != null);
  const agirlikToplami = katkiVerenler.reduce((t, k) => t + W[k], 0);
  const puan = agirlikToplami > 0
    ? Math.round((katkiVerenler.reduce((t, k) => t + g[k] * W[k], 0) / agirlikToplami) * 100)
    : null;

  // Risk seviyesi — puan yoksa seviye de yok (uydurma yasağı)
  let seviye = null;
  let renk = '#3C5266'; // nötr mürekkep — "hesaplanamadı"
  if (puan != null) {
    seviye = 'dusuk'; renk = '#2E7D32';
    if (puan >= 60) { seviye = 'yuksek'; renk = '#C62828'; }
    else if (puan >= 35) { seviye = 'orta'; renk = '#E65100'; }
  }

  const kalem = (ad, ek) => ({
    veriVar: g[ad] != null,
    skor: g[ad] != null ? Math.round(g[ad] * 100) : null,
    // fiilî ağırlık: yeniden normalize edilmiş pay (yüzde)
    agirlik: g[ad] != null && agirlikToplami > 0 ? Math.round((W[ad] / agirlikToplami) * 100) : 0,
    ...ek,
  });

  return {
    puan,
    seviye,
    renk,
    gostergeSayisi: katkiVerenler.length,
    detay: {
      grace: kalem('grace', { egim: gSonuc?.egim, yon: gSonuc?.yon }),
      baraj: kalem('baraj', { barajSayisi: bDoluluk?.barajSayisi ?? 0, ortalamaDoluluk: bDoluluk?.ortalama ?? null, sonOlcumTarihi: bDoluluk?.sonOlcumTarihi ?? null }),
      yas: kalem('yas', { beslenim: vd?.yasBeslenimi_hm3, rezerv: vd?.yasIsletmeRezervi_hm3 }),
      tahsis: kalem('tahsis', { durum: vd?.tahsis ?? 'veri yok' }),
      yuzeysuyu: kalem('yuzeysuyu', { potansiyel: vd?.yuzeysuyuPotansiyeli_km3 }),
    },
  };
}

/** Puanı hesaplanabilen havzalarda kullanılan gösterge sayılarının kümesi —
 *  sayfa metni "N gösterge" derken bu kümeden türetir, sabit yazmaz. */
export function gostergeAraligi() {
  const sayilar = havzaVeri.havzalar
    .map((h) => havzaRisk(h.no).gostergeSayisi)
    .filter((n) => n > 0);
  return { enAz: Math.min(...sayilar), enCok: Math.max(...sayilar), toplamTanimli: Object.keys(W).length };
}

/** Tüm havzaları risk puanına göre sıralı döndür (en riskli önce) */
export function tumHavzaRiskleri() {
  return havzaVeri.havzalar
    .map((h) => ({ no: h.no, ad: h.ad, ...havzaRisk(h.no) }))
    // puanı hesaplanamayanlar (puan null) listenin SONUNA düşer
    .sort((a, b) => (b.puan ?? -1) - (a.puan ?? -1));
}

/** Schema.org Observation JSON-LD (havza bazlı, AI-arama) */
export function riskSemasi(no, ad, risk) {
  // 27.08 K1: açıklama YALNIZ verisi olan göstergelerden kurulur.
  // Önceden veri yokken bile "baraj doluluk etkisi: 50/100" basılıyordu
  // (25/25 havzada aynı sabit) ve "6 göstergeden" deniyordu (fiilen 5).
  // 27.08 K6: `value` ve `observationDate` EKLENDİ. Önceden değer yalnız
  // `measuredProperty.value` içindeydi; `Observation.value` 0/25,
  // `observationDate` 0/25 idi. observationDate UYDURULMAZ: risk hesabının
  // en taze girdisi olan baraj serisinin son ölçüm günü kullanılır; o veri
  // yoksa alan hiç yazılmaz.
  const parcalar = [];
  if (risk.detay.grace.veriVar) parcalar.push(`GRACE eğilim: ${risk.detay.grace.yon}`);
  if (risk.detay.baraj.veriVar) parcalar.push(`baraj doluluk etkisi: ${risk.detay.baraj.skor}/100`);
  if (risk.detay.yas.veriVar) parcalar.push(`YAS rezerv etkisi: ${risk.detay.yas.skor}/100`);
  if (risk.detay.yuzeysuyu.veriVar) parcalar.push(`yüzey suyu etkisi: ${risk.detay.yuzeysuyu.skor}/100`);

  const govde = risk.puan == null
    ? `${ad} için bileşik su riski puanı hesaplanamadı: hiçbir göstergenin verisi yok.`
    : `${ad} için bileşik su riski puanı ${risk.puan}/100 (${risk.seviye} risk). `
      + `${parcalar.join(', ')}. `
      + `${risk.gostergeSayisi} göstergeden hesaplanmıştır; verisi olmayan gösterge puana katılmaz.`;

  const olcumTarihi = risk.detay.baraj.sonOlcumTarihi;

  return {
    '@type': 'Observation',
    name: risk.puan == null
      ? `${ad} Su Riski Puani: hesaplanamadi`
      : `${ad} Su Riski Puani: ${risk.puan}/100 (${risk.seviye})`,
    description: govde,
    // Puan yoksa deger alanlari HIC yazilmaz (uydurma yasagi).
    ...(risk.puan != null && { value: risk.puan, unitText: 'puan (0-100)' }),
    measuredProperty: {
      '@type': 'PropertyValue',
      name: 'Su Riski Puani',
      ...(risk.puan != null && { value: risk.puan, minValue: 0, maxValue: 100 }),
    },
    ...(olcumTarihi && { observationDate: olcumTarihi }),
    observationAbout: { '@type': 'Place', name: ad },
    includedInDataCatalog: { '@id': `${SITE}/#veri-katalogu` },
  };
}
