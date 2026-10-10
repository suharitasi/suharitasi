// GÖL/NEHİR VERİ MODÜLÜ — GeoJSON verisinden slug → detay eşlemesi.
// 24.08.2026 (agustos-uyum M4+M5): 04.08 sürümünün üç kusuru ölçülerek
// düzeltildi:
//   1) KAPSAM: Overpass bbox çekimi sınır ötesi öznitelikleri de almıştı
//      (ölçüm: 32 göl + 36 nehir Türkiye dışında — Gürcü/Ermeni/Bulgar/
//      İran/Irak/Yunan adlarıyla). Bunlar "Türkiye Gölleri" başlığıyla
//      yayındaydı = kaynağı olmayan coğrafya iddiası. Artık geometri
//      örneklemi 81 il çokgeninin (tr-iller.json) dışında kalanlar
//      ÜRETİLMEZ; elenenler elenenGoller()/elenenNehirler() ile raporlanır.
//   2) TÜRKÇE: şablon metinleri aksansızdı ("Dogal gol", "Turkiye") ve
//      özet cümlesi virgül dizimiyle bozuktu ("bir doğal göldür, ve ...").
//   3) UYDURMA ADAYI: nokta sayısından "tahmini uzunluk" üreten ÖLÜ KOD
//      (tahminiKm) silindi — hiç basılmamıştı, veri karşılığı yoktu.
// Erişim/kapsam künyesi KAYNAKLAR.md kaydından: Overpass çekimi 04.08.2026,
// göllerde 0,5 km² üstü filtre; OSM verisi ODbL 1.0.
import { readFileSync } from 'node:fs';
import { cografyaEsle } from './gol-nehir-cografya.js';
import { TIP_DUZELTME } from './gol-tip-duzeltme.js';

// JSON'lar fs ile okunur (Vite + çıplak node testinde aynı davranış).
const goller = JSON.parse(readFileSync('src/data/tr-goller.json', 'utf8'));
const nehirler = JSON.parse(readFileSync('src/data/tr-nehirler.json', 'utf8'));

export const GOLNEHIR_ERISIM = '04.08.2026';
export const GOLNEHIR_KAPSAM_GOL = 'OpenStreetMap (natural=water) + Natural Earth 10m; 0,5 km² üstü';
export const GOLNEHIR_KAPSAM_NEHIR = 'OpenStreetMap (waterway=river) ana akarsu hatları';
export const GOLNEHIR_LISANS = '© OpenStreetMap katkıcıları (ODbL 1.0) · Natural Earth kamu malı';

// K19 (27.08.2026): otorite bağı — 342 göl/nehir sayfası kaynak ADINI
// yazıp bağ vermiyordu. URL'ler bu sunucudan sınandı (HTTP 200):
//   openstreetmap.org/copyright · naturalearthdata.com 10m fiziki vektörler
// Doğrulanamayan hiçbir adres yazılmadı.
export const KAYNAK_BAGLARI = {
  'OpenStreetMap': 'https://www.openstreetmap.org/copyright',
  'Natural Earth (10m)': 'https://www.naturalearthdata.com/downloads/10m-physical-vectors/',
  'Natural Earth': 'https://www.naturalearthdata.com/downloads/10m-physical-vectors/',
};
/** Kaynak adına karşılık gelen resmî adres; bilinmiyorsa null (uydurma yasağı). */
export function kaynakBagi(ad) {
  return KAYNAK_BAGLARI[ad] ?? null;
}

const TR_ASCII = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u',
                   Ç: 'C', Ğ: 'G', I: 'I', İ: 'i', Ö: 'O', Ş: 'S', Ü: 'U' };

export function golNehirSlug(ad) {
  const slug = ad
    .split('')
    .map((c) => TR_ASCII[c] ?? c)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || 'isimsiz';
}

// Göl türü: veri alanı `tip` → çekimli Türkçe karşılık. Veri tip taşımıyorsa
// genel "göl" denir — tahmin YAZILMAZ.
const TIP_METNI = {
  reservoir: { ad: 'Baraj gölü', cekim: 'bir baraj gölüdür' },
  lake:      { ad: 'Doğal göl',  cekim: 'bir doğal göldür' },
  lagoon:    { ad: 'Lagün',      cekim: 'bir lagündür' },
  pond:      { ad: 'Gölet',      cekim: 'bir gölettir' },
};
export function golTipi(gol) {
  // Faz E (08.09.2026): ad ile kaynak türü çelişiyor ve depo içi kaynakla
  // düzeltilemediyse yanlış sınıf ("bir doğal göldür") BASILMAZ — nötr
  // ifade + şerh (sayfada kaynağın ne dediği açıkça yazılır).
  if (gol.tip_celiski && !gol.tip_duzeltme) {
    return { ad: 'Tür kaynakta çelişkili', cekim: 'bir su kütlesidir (tür kaynakta çelişkili, doğrulanmadı)' };
  }
  return TIP_METNI[gol.tip] ?? { ad: 'Göl', cekim: 'bir göldür' };
}

// Faz E (08.09.2026, karar §B): ad ↔ OSM türü çelişkisi (kural tabanlı, liste
// bakımı yok). Yalnız SERT çelişkiler: adında "baraj" geçip tür reservoir
// değilse; adında "gölet" geçip tür lake ise; adında "lagün/dalyan" geçip
// tür lagoon değilse. "Gölet" adlı + reservoir ÇELİŞKİ SAYILMAZ (ikisi de
// yapay; DSİ'nin kendisi 12 "Göleti"ni "Barajı" diye listeliyor — adlandırma
// farkı). Ölçüm (247 kayıt): 25 baraj-adlı ≠ reservoir · 18 gölet-adlı =
// lake · 1 lagün · 2 jenerik ad ("Baraj Gölü", "Gölet" — tesis belirsiz).
// NOT: arac/fetch_hydro.py:196 OSM'de water=* etiketi olmayan yolları da
// 'lake' yazar; bu yüzden şerh "OSM doğal göl diyor" DEMEZ, "kaynakta 'göl'
// olarak kayıtlı ya da etiketsiz" der.
export function tipCeliskisi(ad, tip) {
  const a = String(ad ?? '').toLocaleLowerCase('tr');
  const jenerik = /^(baraj gölü|gölet|göl|baraj|lagün)$/.test(a.trim());
  if (/\bbaraj/.test(a) && tip !== 'reservoir') return { adIma: 'baraj gölü', kaynakta: tip, jenerik };
  if (/gölet/.test(a) && tip === 'lake') return { adIma: 'gölet', kaynakta: tip, jenerik };
  if (/lagün|dalyan/.test(a) && tip !== 'lagoon') return { adIma: 'lagün', kaynakta: tip, jenerik };
  return null;
}

/** Sayfada basılacak tür şerhi (Tür satırı) — Faz E. */
export function golTurSerhi(gol) {
  if (gol.tip_duzeltme) {
    const osm = gol.tip_duzeltme.osm ?? 'belirtilmemiş';
    return `yerel düzeltme — kaynakta (OSM/Natural Earth) tür "${osm}"; dayanak: ${gol.tip_duzeltme.kaynak} (08.09.2026)`;
  }
  if (gol.tip_celiski) {
    const c = gol.tip_celiski;
    const kaynakta = c.kaynakta == null ? 'tür alanı yok (Natural Earth)' : `kaynakta "${c.kaynakta}" olarak kayıtlı ya da etiketsiz (OSM)`;
    const ek = c.jenerik ? '; kaynak yalnız jenerik ad veriyor, hangi tesis olduğu belirlenemedi' : '';
    return `kaynak çelişkisi: ad "${c.adIma}" diyor, ${kaynakta}; depo içi DSİ/EPİAŞ listelerinde il + ad eşleşmesi bulunamadı — doğrulanmadı (08.09.2026)${ek}`;
  }
  return null;
}

const JENERIK_ADLAR = new Set(['baraj gölü', 'gölet', 'göl', 'baraj', 'gölü', 'nehir', 'çay', 'dere', 'ırmak']);
function insaEt(features, onek) {
  const seen = new Set();
/** K11 (27.08.2026): OSM `name` alanı sınır sularında ÇOK DİLLİ gelir
 *  ("Έβρος/Meriç/Марица", "Резовска река - Mutludere", "Aras / Արաքս").
 *  Sayfa başlığı bu ham dizeyi basıyordu. Burada latin-harfli bileşen
 *  AYIKLANIR — çeviri YAPILMAZ, ad UYDURULMAZ: yalnız kaynakta zaten
 *  yazan parça seçilir. Latin bileşen yoksa ham ad korunur.
 *  Tam ad künyede `ad_kaynakta` olarak saklanır. */
/** Ayıklanmış ad başka bir kayıtla ÇAKIŞIYORSA ham ad korunur — aksi
 *  halde iki ayrı su kütlesi aynı başlığı taşır (ölçülen vaka: OSM'de
 *  "Aras" ve "Aras / Արաքս" iki ayrı kayıt; ayıklama ikisini de "Aras"
 *  yapıp <title> tekrarı üretmişti). */
function benzersizAd(ham, gorulen) {
  const ad = gorunenAd(ham);
  const secim = gorulen.has(ad) ? ham : ad;
  gorulen.add(secim);
  return secim;
}

function gorunenAd(ham) {
  const parcalar = String(ham ?? '').split(/\s*[/|·]\s*|\s+-\s+/).map((x) => x.trim()).filter(Boolean);
  if (parcalar.length < 2) return ham;
  const latin = parcalar.filter((x) => /^[A-Za-zÇĞİIÖŞÜçğıiöşü0-9\s.'-]+$/u.test(x));
  return latin.length ? latin[0] : ham;
}

  const icinde = [], elenen = [];
  const adlar = new Set();
  let adsiz = 0;
  for (const f of features) {
    const p = f.properties;
    const b = f.bbox || [0, 0, 0, 0];
    const cografya = cografyaEsle(f.geometry);
    if (!cografya.turkiyede) { elenen.push({ ad: p.ad, kaynak: p.kaynak, neden: 'Türkiye dışı' }); continue; }
    // 10.10.2026 (brif 1.11): adı olmayan, Latin harf içermeyen (Arap/Kiril/Yunan/Ermeni
    // yazımlı sınır suları) ve yalnız jenerik ad taşıyan ("Baraj Gölü", "Gölet") ya da
    // göl olmayan ("… Springs") kayıtlar YAYINDAN ÇEKİLİR — ad uydurulmaz, kaynak dosyaya
    // dokunulmaz; elenenler /kullanilanlar şerhinde sayılır.
    const gorunen = gorunenAd(p.ad);
    const latinVar = /[A-Za-zÇĞİIÖŞÜçğıiöşü]/u.test(String(gorunen ?? ''));
    const jenerik = JENERIK_ADLAR.has(String(gorunen ?? '').trim().toLocaleLowerCase('tr'));
    if (!String(p.ad ?? '').trim()) { elenen.push({ ad: p.ad, kaynak: p.kaynak, neden: 'adsız kayıt' }); continue; }
    if (!latinVar) { elenen.push({ ad: p.ad, kaynak: p.kaynak, neden: 'Türkçe/Latin ad yok (yabancı alfabe)' }); continue; }
    if (jenerik) { elenen.push({ ad: p.ad, kaynak: p.kaynak, neden: 'yalnız jenerik ad; tesis belirlenemedi' }); continue; }
    if (/\bsprings?\b/i.test(String(gorunen))) { elenen.push({ ad: p.ad, kaynak: p.kaynak, neden: 'kaynak/pınar kaydı, göl değil (OSM İngilizce etiket)' }); continue; }
    let slug = golNehirSlug(p.ad);
    if (slug === 'isimsiz') slug = `${onek}-${++adsiz}`;
    if (seen.has(slug)) { let i = 2; while (seen.has(`${slug}-${i}`)) i++; slug = `${slug}-${i}`; }
    seen.add(slug);
    // Faz E (08.09.2026): yerel tür düzeltmesi (yalnız göller; nehirde tip yok)
    // ve ad↔tür çelişki şerhi. Kaynak JSON'a dokunulmaz; tip_kaynakta ham değer.
    const tipKaynakta = p.tip ?? null;
    const duzeltme = onek === 'gol' ? (TIP_DUZELTME[slug] ?? null) : null;
    const tip = duzeltme ? duzeltme.tip : tipKaynakta;
    icinde.push({
      slug, ad: benzersizAd(p.ad, adlar), ad_kaynakta: p.ad, kaynak: p.kaynak,
      alan_km2: p.alan_km2 ?? null, tip,
      tip_kaynakta: tipKaynakta, tip_duzeltme: duzeltme,
      tip_celiski: onek === 'gol' ? tipCeliskisi(p.ad, tipKaynakta) : null,
      bbox: b, merkez: [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2],
      geometry: f.geometry, cografya,
      // V6 (10.09.2026): akarsu topolojisi artık JSON'dan okunur (scripts/
      // build_river_topology.py türetip yazar; JS tarafı hesaplamaz). Alan
      // yoksa null — özet/şema yalan cümle BASMAZ (uydurma yasağı).
      ...(onek === 'nehir' ? {
        kolu_oldugu_akarsu: p.kolu_oldugu_akarsu ?? null,
        dokuldugu_yer: p.dokuldugu_yer ?? null,
      } : {}),
    });
  }
  // Aynı görünen adı taşıyan birden çok kayıt (Gölcük, Acıgöl, Göksu…): başlığa il
  // ya da havza eklenir — slug (adres) DEĞİŞMEZ, yalnız `ad` ayrışır (brif 1.11).
  const adSayac = new Map();
  for (const k of icinde) adSayac.set(k.ad, (adSayac.get(k.ad) ?? 0) + 1);
  for (const k of icinde) {
    if ((adSayac.get(k.ad) ?? 0) > 1) {
      const ayrac = k.cografya.il?.ad ?? k.cografya.havzalar?.[0]?.ad ?? null;
      if (ayrac) k.ad = `${k.ad} (${ayrac})`;
    }
  }
  return { icinde, elenen };
}

let _gol = null, _nehir = null;
function golVeri() { if (!_gol) _gol = insaEt(goller.features, 'gol'); return _gol; }
function nehirVeri() { if (!_nehir) _nehir = insaEt(nehirler.features, 'nehir'); return _nehir; }

/** Türkiye kapsamındaki göller (il/havza eşlemeli) */
export function tumGoller() { return golVeri().icinde; }
/** Türkiye kapsamındaki nehirler */
export function tumNehirler() { return nehirVeri().icinde; }
/** Kapsam dışı bırakılanlar (rapor + /kullanilanlar şerhi için) */
export function elenenGoller() { return golVeri().elenen; }
export function elenenNehirler() { return nehirVeri().elenen; }

/** Göl için özet metin (öz-cevap + meta description) — her parça VERİDEN. */
export function golOzet(gol) {
  const tur = golTipi(gol);
  const gIller = gol.cografya.iller ?? (gol.cografya.il ? [gol.cografya.il] : []);
  const yer = gIller.length ? `${gIller.map((x) => x.ad).join(', ')} ${gIller.length > 1 ? 'illeri' : 'ili'} sınırlarında ` : '';
  const gövde = `${gol.ad}, ${yer}${tur.cekim}`;
  const alan = gol.alan_km2 != null
    ? `; yaklaşık ${gol.alan_km2.toLocaleString('tr-TR')} km² yüzey alanına sahiptir`
    : '';
  return `${gövde}${alan} (kaynak: ${gol.kaynak}, erişim ${GOLNEHIR_ERISIM}).`;
}

/** Nehir için özet metin — havza ve il bilgisi geometrik örneklemden.
 *  C1 (08.09.2026, GSC ölçümü): 28 günde sıfır tıklamalı ilk 20 sorgunun
 *  9'u "<nehir> nerede" biçimindeydi ve nehir özeti il/konum cevabı
 *  vermiyordu (göl özeti il taşıyor; göl CTR'si nehrin 2,5 katı, pozisyon
 *  aynı). İl verisi zaten sayfada "Örneklenen il" olarak basılıyordu;
 *  yalnız özete alındı. Yeni iddia yok: "hattı … ili sınırlarından geçer"
 *  = örneklenmiş hat noktalarından en az biri o il çokgeninde
 *  (gol-nehir-cografya.js şerhi sayfada durur). */
export function nehirOzet(nehir) {
  const h = nehir.cografya.havzalar;
  const havzaMetni = h.length === 0
    ? `Türkiye sınırları içinde akan bir akarsudur`
    : h.length === 1
      ? `${h[0].ad.replace(/\s*Havzası\s*$/, '')} Havzası'ndan geçen bir akarsudur`
      : `${h.map((x) => x.ad.replace(/\s*Havzası\s*$/, '')).join(', ')} havzalarından geçen bir akarsudur`;
  const il = nehir.cografya.il;
  const nIller = nehir.cografya?.iller ?? (il ? [il] : []);
  const ilMetni = nIller.length ? `; hattı ${nIller.map((x) => x.ad).join(', ')} ${nIller.length > 1 ? 'illerinden' : 'ili sınırlarından'} geçer` : '';
  // V6 (10.09.2026): topoloji cümlesi YALNIZ veride türetilmişse eklenir.
  // kolu → "… akarsuyunun önemli kollarından biridir"; dokuldugu (doğal göl)
  // → "… bölgesine dökülmektedir". Alan null ise cümle ÜRETİLMEZ.
  const kolu = nehir.kolu_oldugu_akarsu;
  const dokuldugu = nehir.dokuldugu_yer;
  const topolojiMetni = kolu
    ? `; ${kolu} akarsuyunun önemli kollarından biridir`
    : dokuldugu
      ? `; ${dokuldugu} bölgesine dökülmektedir`
      : '';
  return `${nehir.ad}, ${havzaMetni}${ilMetni}${topolojiMetni} (kaynak: ${nehir.kaynak}, erişim ${GOLNEHIR_ERISIM}).`;
}

/** Ters eşleme (il/havza sayfalarının "geri bağı" — M5.7 ada-kalmaz kuralı). */
export function ilinGolleri(ilSlug) {
  return tumGoller().filter((g) => g.cografya.il?.slug === ilSlug);
}
export function ilinNehirleri(ilSlug) {
  return tumNehirler().filter((n) => n.cografya.il?.slug === ilSlug);
}
export function havzaninGolleri(havzaSlug) {
  return tumGoller().filter((g) => g.cografya.havzalar.some((h) => h.slug === havzaSlug));
}
export function havzaninNehirleri(havzaSlug) {
  return tumNehirler().filter((n) => n.cografya.havzalar.some((h) => h.slug === havzaSlug));
}
