// SU VERİMLİLİĞİ YÖNETMELİĞİ — SAYAÇ VERİ KATMANI (Adım 2, 24.09.2026).
// TEK KAYNAK: data/lead/nace-ek2.json (31 ana faaliyet + 90 detay NACE kodu)
// ve data/lead/persona.json (31 NACE-türevli persona: yükümlülük + dayanak +
// son tarih). UYDURMA YASAĞI: burada yeni hukuki cümle ÜRETİLMEZ; yükümlülük
// ve dayanak yalnız doğrulanmış kaynaktan okunur. Sayılar build anında
// sayılır ve assert edilir (sessiz bayatlama yasak).
import naceEk2 from '../../data/lead/nace-ek2.json';
import { personalar, yonetmelik, tarihTR } from './persona.js';

export const SON_TARIH = yonetmelik?.dogrulanmisSureler?.yesilBelgeSonBasvuru?.tarih; // 2029-12-27
export const SON_TARIH_METIN = tarihTR(SON_TARIH);
export const YONETMELIK_AD = yonetmelik?.ad || 'Su Verimliliği Yönetmeliği';
export const YONETMELIK_RG = yonetmelik?.rgTarih || null;

if (!SON_TARIH || !SON_TARIH_METIN) {
  throw new Error('su-verimliligi: doğrulanmış yeşil belge son başvuru tarihi okunamadı.');
}

// — NACE kodu → persona eşlemesi —
const personaByNace = new Map();
for (const p of personalar) {
  if (p.nace) personaByNace.set(String(p.nace), p);
}

// — Detay kodlarını ana faaliyete bağla —
// OCR kaynaklı bozuk kodlar olabilir (ör. "75 30", "1041"): kod, bir ana
// faaliyet kodunun ÖNEKİ yse ona bağlanır; hiçbiriyle eşleşmezse
// "sınıflandırılamayan" kovasına düşer (uydurma eşleme YAPILMAZ).
const anaKodlarSirali = naceEk2.anaFaaliyetler
  .map((a) => String(a.kod))
  .sort((a, b) => b.length - a.length);
function anaBul(kod) {
  if (kod.includes('.')) {
    const p = kod.split('.')[0];
    if (anaKodlarSirali.includes(p)) return p;
  }
  for (const a of anaKodlarSirali) {
    if (kod.startsWith(a)) return a;
  }
  return null;
}

const detayByAna = new Map();
export const SINIFLANAMAYAN_KODLAR = [];
for (const d of naceEk2.detayKodlar) {
  const kod = String(d.kod || d.hamKod || '');
  const kayit = {
    kod,
    aciklama: (d.aciklama || '').trim(),
    guven: d.guven || 'dogrulanmadi',
  };
  const ana = anaBul(kod);
  if (!ana) {
    SINIFLANAMAYAN_KODLAR.push(kayit);
    continue;
  }
  if (!detayByAna.has(ana)) detayByAna.set(ana, []);
  detayByAna.get(ana).push(kayit);
}

export const ANA_FAALIYETLER = naceEk2.anaFaaliyetler.map((a) => {
  const kod = String(a.kod);
  const p = personaByNace.get(kod) || null;
  const detay = (detayByAna.get(kod) || [])
    .slice()
    .sort((x, y) => x.kod.localeCompare(y.kod, 'tr'))
    .map((d) => ({ ...d, dogrulandi: d.guven === 'dogrulandi' }));
  return {
    kod,
    ad: a.ad,
    kisaAd: a.kisaAd || a.ad,
    guven: a.guven || 'dogrulanmadi',
    detay,
    detayToplam: detay.length,
    detayDogrulandi: detay.filter((d) => d.dogrulandi).length,
    persona: p
      ? { slug: p.slug, ad: p.ad, yukumluluk: p.yukumluluk, dayanak: p.dayanak || [], ilgiliIcerik: p.ilgiliIcerik || [] }
      : null,
  };
});

// — Sayaç özetleri (hepsi veriden) —
export const ANA_SAYI = ANA_FAALIYETLER.length;
export const DETAY_SAYI = naceEk2.detayKodlar.length;
export const DETAY_DOGRULANDI = naceEk2.detayKodlar.filter((d) => d.guven === 'dogrulandi').length;
export const DETAY_DOGRULANMADI = DETAY_SAYI - DETAY_DOGRULANDI;
export const PERSONALI_ANA = ANA_FAALIYETLER.filter((f) => f.persona).length;

// — Build-time assert (sessiz hata yasağı) —
{
  const s = naceEk2.sayimlar || {};
  const beklenen = [
    ['ana faaliyet', ANA_SAYI, s.anaFaaliyet_toplam],
    ['detay kod', DETAY_SAYI, s.detay_yakalanan],
    ['doğrulanmış detay', DETAY_DOGRULANDI, s.detay_dogrulandi],
  ];
  for (const [ad, sayilan, kaynakta] of beklenen) {
    if (kaynakta != null && sayilan !== kaynakta) {
      throw new Error(`su-verimliligi: ${ad} (${sayilan}) nace-ek2 sayımıyla (${kaynakta}) çelişiyor.`);
    }
  }
  if (PERSONALI_ANA !== ANA_SAYI) {
    throw new Error(`su-verimliligi: ${ANA_SAYI} ana faaliyetin ${PERSONALI_ANA} tanesi personaya bağlı — eşleme eksik.`);
  }
  // Gruplanan + sınıflandırılamayan = toplam detay (kayıp kod yasak).
  const gruplanan = ANA_FAALIYETLER.reduce((t, f) => t + f.detayToplam, 0);
  if (gruplanan + SINIFLANAMAYAN_KODLAR.length !== DETAY_SAYI) {
    throw new Error(
      `su-verimliligi: gruplanan ${gruplanan} + sınıflandırılamayan ` +
      `${SINIFLANAMAYAN_KODLAR.length} ≠ toplam ${DETAY_SAYI}.`
    );
  }
}

// — iCalendar (RFC 5545) üreteci —
// Metin kaçışı + 75 oktette satır katlama (CRLF). DTSTAMP sabit (yönetmelik
// RG tarihi) seçildi: her build'de dosyanın değişmemesi (determinizm).
function kacirIcs(s) {
  return String(s || '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}
function katla(satir) {
  const parcalar = [];
  let kalan = satir;
  const ilkSinir = 75;
  const devamSinir = 74; // devam satırı baştaki boşluğu sayar
  let sinir = ilkSinir;
  while (Buffer.byteLength(kalan, 'utf8') > sinir) {
    let kes = kalan.length;
    while (kes > 0 && Buffer.byteLength(kalan.slice(0, kes), 'utf8') > sinir) kes--;
    parcalar.push(kalan.slice(0, kes));
    kalan = kalan.slice(kes);
    sinir = devamSinir;
  }
  parcalar.push(kalan);
  return parcalar.join('\r\n ');
}

const PRODID = '-//Su Haritasi//Su Verimliligi Sayaci//TR';
const SAYFA_URL = 'https://suharitasi.com/mevzuat/su-verimliligi-sayaci/';
const DAMGA = (YONETMELIK_RG || SON_TARIH).replace(/-/g, '') + 'T000000Z';
const DTSTART = SON_TARIH.replace(/-/g, ''); // 20291227

/** Yeşil su verimliliği belgesi hatırlatıcısı (.ics). faaliyet null → genel. */
export function icsOlustur(faaliyet = null) {
  const kimlik = faaliyet ? `nace-${faaliyet.kod}` : 'genel';
  const konu = faaliyet
    ? `Yeşil su verimliliği belgesi son başvuru — ${faaliyet.kisaAd} (NACE ${faaliyet.kod})`
    : 'Yeşil su verimliliği belgesi son başvuru';
  const yukumluluk = faaliyet?.persona?.yukumluluk
    || `${YONETMELIK_AD} Ek-2 kapsamındaki faaliyetler için en fazla beş yıl içinde yeşil su verimliliği belgesi başvurusu yapılır.`;
  const aciklama =
    `${yukumluluk}\n` +
    `Son başvuru: ${SON_TARIH_METIN}. Dayanak: ${YONETMELIK_AD} md.(3) ve Ek-2.` +
    (faaliyet ? ` İlgili NACE kodu: ${faaliyet.kod}.` : '') +
    `\nBu hatırlatıcı bilgilendirme amaçlıdır; resmî teyit DSİ/il su idaresinden alınmalıdır. Kaynak: ${SAYFA_URL}`;
  const satirlar = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${PRODID}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${kimlik}@suharitasi.com`,
    `DTSTAMP:${DAMGA}`,
    `DTSTART;VALUE=DATE:${DTSTART}`,
    `SUMMARY:${kacirIcs(konu)}`,
    `DESCRIPTION:${kacirIcs(aciklama)}`,
    `URL:${SAYFA_URL}`,
    'BEGIN:VALARM',
    'TRIGGER:-P30D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${kacirIcs('30 gün kaldı — ' + konu)}`,
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-P7D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${kacirIcs('7 gün kaldı — ' + konu)}`,
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${kacirIcs('Yarın son gün — ' + konu)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return satirlar.map(katla).join('\r\n') + '\r\n';
}

export { naceEk2 };
export { tarihTR };
