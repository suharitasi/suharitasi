#!/usr/bin/env node
/* ============================================================================
   DANIŞTAY KARAR ARAMA ÇEKİCİ — ADIM 5 (v6.0), 22.09.2026.
   ----------------------------------------------------------------------------
   KAYNAK: T.C. Danıştay Başkanlığı Karar Arama (karararama.danistay.gov.tr).
   Doğrulanan sözleşme (canlı ölçüldü):
     POST /aramalist  Content-Type: application/json
       body: {"data":{"andKelimeler":["\"kelime\""],"orKelimeler":[],
                      "notAndKelimeler":[],"notOrKelimeler":[],
                      "pageSize":N,"pageNumber":M}}
       yanıt: {data:{data:[{id,daireKurul,esasNo,kararNo,kararTarihi,...}],
                     recordsTotal,recordsFiltered}, metadata:{FMTY}}
     GET /getDokuman?id=<id>&arananKelime=<kelime>  → karar tam metni (HTML)

   K7 (uydurma yasağı): bu araç YALNIZ resmî karar künyesini ve metnini çeker;
   hüküm/özet ÜRETMEZ. Toplanan veri ham dizine yazılır, YAYINA GİRMEZ;
   emsal matrisine ancak [SERDAR-HUKUK] teyidinden sonra alınır.

   NEZAKET/NİZAM (ölçüldü: hızlı ardışık istek sunucuda hataya yol açıyor):
   - İstekler arası varsayılan GECİKME 2500 ms; artan bekleme ile 3 deneme.
   - reCaptcha isteği algılanırsa o tohum DURDURULUR ve loglanır (zorlanmaz).
   - SayfaSayısı ve tohum kümeleri SINIRLIDIR; tüm arşivi indirmez.

   KULLANIM:
     node arac/danistay-cek.mjs [--sayfa 20] [--boyut 50] [--gecikme 2500]
                               [--metin 0]        # ilk N kararın tam metnini çek
   ÇIKTI: veri/ham/danistay/kunye.json · veri/ham/danistay/metin/<id>.txt
   ÇIKIŞ: hata yok & en az 1 künye → 0; hiç künye yok → 2; beklenmeyen → 1.
   ========================================================================== */
import { writeFileSync, mkdirSync, appendFileSync, existsSync, readFileSync, renameSync } from 'node:fs';
import { join } from 'node:path';

const KOK = process.cwd();
const BASE = 'https://karararama.danistay.gov.tr';
const UA = 'suharitasi-arastirma/1.0 (+https://suharitasi.com; iletisim: avserdararslan@hotmail.com)';

const arg = (ad, vars) => { const i = process.argv.indexOf(ad); return i >= 0 && process.argv[i + 1] ? Number(process.argv[i + 1]) : vars; };
const SAYFA = arg('--sayfa', 20);       // tohum başına en çok sayfa
const BOYUT = arg('--boyut', 50);       // sayfa boyutu
const GECIKME = arg('--gecikme', 2500); // istekler arası bekleme (ms)
const METIN = arg('--metin', 0);        // tam metni çekilecek karar sayısı
const SADECE_METIN = process.argv.includes('--sadece-metin'); // künyeyi yeniden çekme

// Hedef tohumlar: su hukuku (yeraltı suyu / 167). Hacimler canlı ölçüldü.
const SEEDLER = [
  { ad: 'yeraltı-suyu', kelimeler: ['"yeraltı suyu"'], toplam: 756 },
  { ad: 'yeraltı-suyu-167', kelimeler: ['"yeraltı suyu"', '"167"'], toplam: 82 },
  { ad: 'su-tahsisi', kelimeler: ['"su tahsisi"'], toplam: 47 },
  { ad: 'kuyu-ruhsati', kelimeler: ['"kuyu ruhsatı"'], toplam: 3 },
];

const HAM = join(KOK, 'veri/ham/danistay');
const METIN_DIZIN = join(HAM, 'metin');
const LOG = join(KOK, 'log/danistay-cek.log');

function logla(m) {
  const s = `${new Date().toISOString()} [danistay] ${m}`;
  console.log(s);
  try { mkdirSync(join(KOK, 'log'), { recursive: true }); appendFileSync(LOG, s + '\n'); } catch { /* log yazılamazsa konsol yeterli */ }
}
const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

function atomikYaz(yol, icerik) {
  const gecici = yol + '.tmp';
  writeFileSync(gecici, icerik, 'utf8');
  renameSync(gecici, yol);
}

// /aramalist — artan beklemeyle 3 deneme; reCaptcha'da hemen döner.
async function listele(kelimeler, sayfa) {
  const govde = { data: {
    andKelimeler: kelimeler, orKelimeler: [], notAndKelimeler: [], notOrKelimeler: [],
    pageSize: BOYUT, pageNumber: sayfa,
  } };
  let sonHata = null;
  for (let d = 1; d <= 3; d++) {
    try {
      const r = await fetch(`${BASE}/aramalist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'User-Agent': UA },
        body: JSON.stringify(govde),
      });
      const j = await r.json();
      if (j?.metadata?.FMTY === 'ERROR') {
        const m = j.metadata.FMTE || '';
        if (/reCaptcha/i.test(m)) throw new Error(`RECAPTCHA:${m}`);
        throw new Error(m || 'FMTY=ERROR');
      }
      return j.data; // {data:[], recordsTotal, recordsFiltered}
    } catch (e) {
      sonHata = e;
      if (String(e).startsWith('Error: RECAPTCHA')) throw e;
      logla(`liste denemesi ${d}/3 başarısız: ${e} — bekleniyor`);
      await bekle(GECIKME * d * 2);
    }
  }
  throw sonHata;
}

// /getDokuman — karar tam metni (HTML) → düz metin
async function tamMetin(id, arananKelime) {
  for (let d = 1; d <= 3; d++) {
    try {
      const r = await fetch(`${BASE}/getDokuman?id=${encodeURIComponent(id)}&arananKelime=${encodeURIComponent(arananKelime || '')}`, { headers: { 'User-Agent': UA } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const html = await r.text();
      return html;
    } catch (e) {
      logla(`metin denemesi ${d}/3 başarısız (id=${id}): ${e}`);
      await bekle(GECIKME * d * 2);
    }
  }
  return null;
}

// Sunucu, kararı DIŞ kabuk içinde KAÇIŞLI (&lt;html&gt;…) olarak döndürüyor.
// Bu yüzden önce varlık çözümü, sonra etiket sökümü yapılır.
function htmlToMetin(raw) {
  return raw
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n')
    .trim();
}

// İlk METIN kararın tam metnini çekip veri/ham/danistay/metin/ altına yazar.
async function metinCek(liste, cekim) {
  mkdirSync(METIN_DIZIN, { recursive: true });
  const metinIndeks = [];
  for (const k of liste.slice(0, METIN)) {
    const html = await tamMetin(k.id, k._arananKelime);
    if (html) {
      const metin = htmlToMetin(html);
      atomikYaz(join(METIN_DIZIN, `${k.id}.txt`), `# ${k.daireKurul} ${k.esasNo} E., ${k.kararNo} K. (${k.kararTarihi})\n# Kaynak: ${BASE}/getDokuman?id=${k.id}\n\n${metin}\n`);
      metinIndeks.push({ id: k.id, dosya: `${k.id}.txt`, uzunluk: metin.length });
      logla(`  metin çekildi: ${k.id} (${metin.length} krk)`);
    }
    await bekle(GECIKME);
  }
  atomikYaz(join(HAM, 'metin-indeks.json'), JSON.stringify({ _cekim: cekim, adet: metinIndeks.length, kayitlar: metinIndeks }, null, 1) + '\n');
  logla(`tam metin: ${metinIndeks.length} dosya yazıldı`);
}

async function main() {
  mkdirSync(HAM, { recursive: true });
  let istekSayisi = 0;

  if (SADECE_METIN) {
    // Künyeyi yeniden çekmeden var olan kunye.json'dan metin çek.
    const yol = join(HAM, 'kunye.json');
    if (!existsSync(yol)) { logla('--sadece-metin: kunye.json yok; önce normal çekim gerekir'); process.exit(2); }
    const mevcut = JSON.parse(readFileSync(yol, 'utf8'));
    logla(`--sadece-metin: mevcut künye ${mevcut.kararlar?.length ?? 0} karar`);
    if (METIN > 0) await metinCek(mevcut.kararlar || [], mevcut._cekim);
    logla(`BİTTİ (sadece metin) — künye: ${mevcut.kararlar?.length ?? 0}`);
    return;
  }

  const kararlar = new Map(); // id → kayıt

  for (const seed of SEEDLER) {
    let sayfa = 1, done = false;
    logla(`tohum başladı: ${seed.ad} (${seed.kelimeler.join(' + ')})`);
    while (!done && sayfa <= SAYFA) {
      let veri;
      try {
        veri = await listele(seed.kelimeler, sayfa);
      } catch (e) {
        if (String(e).startsWith('Error: RECAPTCHA')) { logla(`tohum DURDURULDU (reCaptcha): ${seed.ad} — sayfa ${sayfa}`); break; }
        logla(`tohum hata: ${seed.ad} sayfa ${sayfa}: ${e}`);
        break;
      }
      istekSayisi++;
      const satirlar = veri?.data || [];
      for (const k of satirlar) {
        const mevcut = kararlar.get(k.id);
        if (mevcut) { if (!mevcut.seedler.includes(seed.ad)) mevcut.seedler.push(seed.ad); continue; }
        kararlar.set(k.id, {
          id: k.id, daireKurul: k.daireKurul, esasNo: k.esasNo, kararNo: k.kararNo,
          kararTarihi: k.kararTarihi, seedler: [seed.ad],
          _arananKelime: k.arananKelime || seed.kelimeler.join(' '),
        });
      }
      logla(`  sayfa ${sayfa}: ${satirlar.length} satır (toplam benzersiz ${kararlar.size})`);
      const toplam = veri?.recordsFiltered ?? 0;
      done = satirlar.length === 0 || sayfa * BOYUT >= toplam;
      sayfa++;
      if (!done) await bekle(GECIKME);
    }
    await bekle(GECIKME);
  }

  const liste = [...kararlar.values()];
  const cekim = new Date().toISOString();
  const cikti = {
    _kaynak: 'T.C. Danıştay Başkanlığı Karar Arama (karararama.danistay.gov.tr)',
    _yontem: 'POST /aramalist (JSON; andKelimeler ifade araması) — resmî künye. Tam metin: GET /getDokuman.',
    _k7: 'Yalnız resmî künye çekildi; hüküm/özet ÜRETİLMEDİ. Yayına girmeden [SERDAR-HUKUK] teyidi gerekir.',
    _cekim: cekim,
    _seedler: SEEDLER.map((s) => ({ ad: s.ad, kelimeler: s.kelimeler, bildirilenToplam: s.toplam })),
    toplam: liste.length,
    kararlar: liste,
  };
  atomikYaz(join(HAM, 'kunye.json'), JSON.stringify(cikti, null, 1) + '\n');
  logla(`künye yazıldı: ${liste.length} benzersiz karar · ${istekSayisi} sayfa isteği`);

  if (METIN > 0 && liste.length) await metinCek(liste, cekim);

  logla(`BİTTİ — benzersiz karar: ${liste.length}`);
  if (!liste.length) process.exitCode = 2;
}

main().catch((e) => { logla(`BEKLENMEYEN HATA: ${e?.stack || e}`); process.exitCode = 1; });
