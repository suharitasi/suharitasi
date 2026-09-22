#!/usr/bin/env node
/* ============================================================================
   YARGI KARAR ÇEKİCİ (Adalet "Karar Arama" ailesi) — ADIM 5 (v6.0), 22.09.2026.
   ----------------------------------------------------------------------------
   KAYNAKLAR (canlı doğrulanan sözleşmeler):
     1) danistay  https://karararama.danistay.gov.tr   (idari; 416.546 karar)
        POST /arama · POST /aramalist  body {"data":{andKelimeler:[".."], orKelimeler:[],
             notAndKelimeler:[], notOrKelimeler:[], pageSize, pageNumber}}
        GET /getDokuman?id=&arananKelime=  → HTML
     2) uyap      https://emsal.uyap.gov.tr            (BAM + mahkemeler; 853.687)
        POST /arama · POST /aramalist  body {"data":{aranan:"..", arananKelime:"..",
             pageSize, pageNumber, [hukuk:"birim"]}}
        GET /getDokuman?id=&arananKelime=  → JSON {"data":"<html>.."}
     3) yargitay  https://karararama.yargitay.gov.tr   (9.989.207 karar; Adalet ailesi)
        NOT: bu sunucudan 212.175.130.144:80/443 AĞ SEVİYESİNDE FİLTELİ — ulaşılamazsa
        nazikçe atlanır; izinli bir ağdan çalıştırıldığında aynı sözleşmeyle çalışır.

   K7: YALNIZ resmî künye + metin çekilir; hüküm/özet ÜRETİLMEZ. Veri YAYINA
   GİRMEZ; emsal matrisine [SERDAR-HUKUK] teyidinden sonra alınır.
   NEZAKET: ≥2,5 sn gecikme, artan beklemeli 3 deneme (429 + HTML hata sayfası),
   reCAPTCHA'da sorgu DURDURULUR. Arşivin tamamı indirilmez.

   KULLANIM:
     node arac/yargi-cek.mjs [--kaynak hepsi|danistay|uyap|yargitay]
                             [--sayfa 20] [--boyut 50] [--gecikme 2500]
                             [--metin 0] [--sadece-metin]
   ÇIKTI: veri/ham/yargi/<kaynak>/kunye.json · metin/<id>.txt   (yerel; gitignore)
   ÇIKIŞ: en az 1 künye → 0; hiç yok → 2; beklenmeyen → 1.
   ========================================================================== */
import { writeFileSync, mkdirSync, appendFileSync, existsSync, readFileSync, renameSync } from 'node:fs';
import { join } from 'node:path';

const KOK = process.cwd();
const UA = 'suharitasi-arastirma/1.0 (+https://suharitasi.com; iletisim: iletisim@suharitasi.com)';
const HAM = join(KOK, 'veri/ham/yargi');
const LOG = join(KOK, 'log/yargi-cek.log');

const arg = (ad, vars) => { const i = process.argv.indexOf(ad); return i >= 0 && process.argv[i + 1] ? Number(process.argv[i + 1]) : vars; };
const SAYFA = arg('--sayfa', 20);
const BOYUT = arg('--boyut', 50);
const GECIKME = arg('--gecikme', 2500);
const METIN = arg('--metin', 0);
const SADECE_METIN = process.argv.includes('--sadece-metin');
const KAYNAK_ARG = (() => { const i = process.argv.indexOf('--kaynak'); return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : 'hepsi'; })();

function logla(m) {
  const s = `${new Date().toISOString()} [yargi] ${m}`;
  console.log(s);
  try { mkdirSync(join(KOK, 'log'), { recursive: true }); appendFileSync(LOG, s + '\n'); } catch { /* konsol yeterli */ }
}
const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
function atomikYaz(yol, icerik) { const g = yol + '.tmp'; writeFileSync(g, icerik, 'utf8'); renameSync(g, yol); }

// — Kaynak tanımları —
const KAYNAKLAR = {
  danistay: {
    ad: 'Danıştay Karar Arama',
    taban: 'https://karararama.danistay.gov.tr',
    listele: (k, s, b) => ({ data: { andKelimeler: k, orKelimeler: [], notAndKelimeler: [], notOrKelimeler: [], pageSize: b, pageNumber: s } }),
    alan: (r) => ({ id: r.id, kurum: r.daireKurul, esasNo: r.esasNo, kararNo: r.kararNo, kararTarihi: r.kararTarihi }),
    detayJson: false,
    seedler: [
      { ad: 'yeraltı-suyu', kelimeler: ['"yeraltı suyu"'] },
      { ad: 'yeraltı-suyu-167', kelimeler: ['"yeraltı suyu"', '"167"'] },
      { ad: 'su-tahsisi', kelimeler: ['"su tahsisi"'] },
      { ad: 'kuyu-ruhsati', kelimeler: ['"kuyu ruhsatı"'] },
    ],
  },
  uyap: {
    ad: 'UYAP Emsal Karar Arama (BAM/mahkemeler)',
    taban: 'https://emsal.uyap.gov.tr',
    listele: (k, s, b) => { const t = k.join(' ').replace(/"/g, ''); return { data: { aranan: t, arananKelime: t, pageSize: b, pageNumber: s } }; },
    alan: (r) => ({ id: r.id, kurum: r.daire, esasNo: r.esasNo, kararNo: r.kararNo, kararTarihi: r.kararTarihi, durum: r.durum }),
    detayJson: true,
    seedler: [
      { ad: 'yeraltı-suyu', kelimeler: ['yeraltı suyu'] },
      { ad: 'kuyu-suyu', kelimeler: ['kuyu suyu'] },
      { ad: 'su-hakki', kelimeler: ['su hakkı'] },
    ],
  },
  yargitay: {
    ad: 'Yargıtay Karar Arama',
    taban: 'https://karararama.yargitay.gov.tr',
    listele: (k, s, b) => ({ data: { andKelimeler: k, orKelimeler: [], notAndKelimeler: [], notOrKelimeler: [], pageSize: b, pageNumber: s } }),
    alan: (r) => ({ id: r.id, kurum: r.daireKurul || r.daire, esasNo: r.esasNo, kararNo: r.kararNo, kararTarihi: r.kararTarihi }),
    detayJson: false,
    agNotu: 'Bu sunucudan 212.175.130.144:443 ağ seviyesinde filteli; ulaşılamazsa atlanır.',
    seedler: [
      { ad: 'yeraltı-suyu', kelimeler: ['"yeraltı suyu"'] },
      { ad: 'kuyu-ruhsati', kelimeler: ['"kuyu ruhsatı"'] },
    ],
  },
};

const secilen = KAYNAK_ARG === 'hepsi' ? ['danistay', 'uyap', 'yargitay'] : [KAYNAK_ARG];
for (const k of secilen) if (!KAYNAKLAR[k]) { console.error(`[yargi] bilinmeyen kaynak: ${k}`); process.exit(2); }

async function listele(kaynak, kelimeler, sayfa) {
  const K = KAYNAKLAR[kaynak];
  const govde = K.listele(kelimeler, sayfa, BOYUT);
  let sonHata = null;
  for (let d = 1; d <= 3; d++) {
    try {
      const r = await fetch(`${K.taban}/aramalist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'User-Agent': UA },
        body: JSON.stringify(govde),
        signal: AbortSignal.timeout(20000),
      });
      const t = await r.text();
      let j = null; try { j = JSON.parse(t); } catch { throw new Error(`JSON değil (HTTP ${r.status}) — muhtemelen hız sınırı/HTML hata sayfası`); }
      if (j?.metadata?.FMTY === 'ERROR') {
        const m = j.metadata.FMTE || '';
        if (/reCaptcha/i.test(m)) throw new Error(`RECAPTCHA:${m}`);
        throw new Error(m || 'FMTY=ERROR');
      }
      return j.data;
    } catch (e) {
      sonHata = e;
      const msg = String(e.message || e);
      if (String(e).startsWith('Error: RECAPTCHA')) throw e;
      // Ağ erişimi yoksa (host filteli) yeniden denemek anlamsız — hemen dön.
      if (/fetch failed|timeout|abort|ECONN|ENOTFOUND|EAI_AGAIN|ETIMEDOUT|EHOSTUNREACH/i.test(msg)) throw e;
      logla(`  ${kaynak} liste denemesi ${d}/3 başarısız: ${msg} — bekleniyor`);
      await bekle(GECIKME * d * 2);
    }
  }
  throw sonHata;
}

async function detayGetir(kaynak, id, kelime) {
  const K = KAYNAKLAR[kaynak];
  for (let d = 1; d <= 3; d++) {
    try {
      const r = await fetch(`${K.taban}/getDokuman?id=${encodeURIComponent(id)}&arananKelime=${encodeURIComponent(kelime || '')}`, {
        headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(20000),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const t = await r.text();
      if (K.detayJson) { const j = JSON.parse(t); return typeof j?.data === 'string' ? j.data : ''; }
      return t;
    } catch (e) {
      logla(`  metin denemesi ${d}/3 başarısız (${kaynak} id=${id}): ${e.message || e}`);
      await bekle(GECIKME * d * 2);
    }
  }
  return null;
}

function htmlToMetin(raw) {
  return String(raw)
    .replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<[^>]+>/g, '')
    .replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

async function kaynakCek(kaynak) {
  const K = KAYNAKLAR[kaynak];
  const kararlar = new Map();
  let istekSayisi = 0, ulasilamadi = false;
  logla(`KAYNAK başladı: ${K.ad} (${K.taban})${K.agNotu ? ' — ' + K.agNotu : ''}`);

  for (const seed of K.seedler) {
    let sayfa = 1, done = false;
    while (!done && sayfa <= SAYFA) {
      let veri;
      try { veri = await listele(kaynak, seed.kelimeler, sayfa); }
      catch (e) {
        if (String(e).startsWith('Error: RECAPTCHA')) { logla(`  ${kaynak} DURDURULDU (reCaptcha): ${seed.ad}`); break; }
        if (/fetch failed|timeout|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|abort/i.test(String(e.message || e))) { ulasilamadi = true; }
        logla(`  ${kaynak} tohum hata: ${seed.ad} sayfa ${sayfa}: ${e.message || e}`);
        break;
      }
      istekSayisi++;
      const satirlar = veri?.data || [];
      for (const r of satirlar) {
        const kayit = { ...K.alan(r), kaynak, seedler: [seed.ad], _arananKelime: r.arananKelime || seed.kelimeler.join(' ') };
        if (!kayit.id) continue;
        const mevcut = kararlar.get(kayit.id);
        if (mevcut) { if (!mevcut.seedler.includes(seed.ad)) mevcut.seedler.push(seed.ad); continue; }
        kararlar.set(kayit.id, kayit);
      }
      logla(`  ${seed.ad} sayfa ${sayfa}: ${satirlar.length} satır (${kararlar.size})`);
      const toplam = veri?.recordsFiltered ?? 0;
      done = satirlar.length === 0 || sayfa * BOYUT >= toplam;
      sayfa++;
      if (!done) await bekle(GECIKME);
    }
    if (ulasilamadi) break; // host filteli/erişilemez — diğer tohumları denemeye değmez
    await bekle(GECIKME);
  }

  const liste = [...kararlar.values()];
  if (!liste.length) { logla(`kaynak bitti: ${kaynak} — veri yok${ulasilamadi ? ' (AĞ ERİŞİMİ YOK)' : ''}`); return { kaynak, liste, istekSayisi, ulasilamadi }; }

  const dizin = join(HAM, kaynak);
  mkdirSync(dizin, { recursive: true });
  const cekim = new Date().toISOString();
  atomikYaz(join(dizin, 'kunye.json'), JSON.stringify({
    _kaynak: K.ad, _taban: K.taban,
    _yontem: 'POST /aramalist (JSON) — resmî künye. Tam metin: GET /getDokuman.',
    _k7: 'Yalnız resmî künye çekildi; hüküm/özet ÜRETİLMEDİ. Yayına girmeden [SERDAR-HUKUK] teyidi gerekir.',
    _cekim: cekim, _seedler: K.seedler, toplam: liste.length, kararlar: liste,
  }, null, 1) + '\n');
  logla(`kaynak bitti: ${kaynak} — ${liste.length} benzersiz karar · ${istekSayisi} sayfa isteği`);

  if (METIN > 0) {
    const metinDizin = join(dizin, 'metin');
    mkdirSync(metinDizin, { recursive: true });
    const indeks = [];
    for (const k of liste.slice(0, METIN)) {
      const html = await detayGetir(kaynak, k.id, k._arananKelime);
      if (html) {
        const metin = htmlToMetin(html);
        atomikYaz(join(metinDizin, `${k.id}.txt`), `# ${K.ad} · ${k.kurum || ''} ${k.esasNo} E., ${k.kararNo} K. (${k.kararTarihi})\n# Kaynak: ${K.taban}/getDokuman?id=${k.id}\n\n${metin}\n`);
        indeks.push({ id: k.id, dosya: `${k.id}.txt`, uzunluk: metin.length });
      }
      await bekle(GECIKME);
    }
    atomikYaz(join(dizin, 'metin-indeks.json'), JSON.stringify({ _cekim: cekim, adet: indeks.length, kayitlar: indeks }, null, 1) + '\n');
    logla(`  metin: ${indeks.length} dosya`);
  }
  return { kaynak, liste, istekSayisi, ulasilamadi };
}

async function main() {
  mkdirSync(HAM, { recursive: true });

  if (SADECE_METIN) {
    for (const kaynak of secilen) {
      const yol = join(HAM, kaynak, 'kunye.json');
      if (!existsSync(yol)) { logla(`--sadece-metin: ${kaynak}/kunye.json yok, atlandı`); continue; }
      const d = JSON.parse(readFileSync(yol, 'utf8'));
      logla(`--sadece-metin: ${kaynak} ${d.kararlar?.length ?? 0} karar`);
      if (METIN > 0) {
        const metinDizin = join(HAM, kaynak, 'metin'); mkdirSync(metinDizin, { recursive: true });
        const indeks = [];
        for (const k of (d.kararlar || []).slice(0, METIN)) {
          const html = await detayGetir(kaynak, k.id, k._arananKelime);
          if (html) { const m = htmlToMetin(html); atomikYaz(join(metinDizin, `${k.id}.txt`), `# ${k.kurum || ''} ${k.esasNo} E., ${k.kararNo} K.\n# Kaynak: ${KAYNAKLAR[kaynak].taban}/getDokuman?id=${k.id}\n\n${m}\n`); indeks.push({ id: k.id, dosya: `${k.id}.txt`, uzunluk: m.length }); }
          await bekle(GECIKME);
        }
        atomikYaz(join(HAM, kaynak, 'metin-indeks.json'), JSON.stringify({ adet: indeks.length, kayitlar: indeks }, null, 1) + '\n');
        logla(`  metin: ${indeks.length} dosya`);
      }
    }
    return;
  }

  const ozet = [];
  for (const kaynak of secilen) ozet.push(await kaynakCek(kaynak));
  const toplam = ozet.reduce((t, o) => t + o.liste.length, 0);
  logla(`BİTTİ — toplam benzersiz: ${toplam} · ${ozet.map((o) => `${o.kaynak}:${o.liste.length}${o.ulasilamadi ? '(ulaşılamadı)' : ''}`).join(' · ')}`);
  if (!toplam) process.exitCode = 2;
}

main().catch((e) => { logla(`BEKLENMEYEN HATA: ${e?.stack || e}`); process.exitCode = 1; });
