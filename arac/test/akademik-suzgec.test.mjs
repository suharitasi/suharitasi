// D2/D3 kanıtı — akademik künye alaka süzgeci: sayılar, örnekler, sınır sözcükler.
// Koşum: node arac/test/akademik-suzgec.test.mjs [--ornek]
// Kaynak veri DEĞİŞMEZ (salt okuma). Çıktı rapora aynen girer.
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { SU_TERIMI, suNorm, suKonulu, akademikBasilir } from '../../src/data/akademik-suzgec.js';

const d = JSON.parse(readFileSync(new URL('../../veri/potansiyel/akademik-kunye.json', import.meta.url), 'utf8'));

// 1) Sınır sözcük testi — eşleşmeli / eşleşmemeli
const ESLESIR = ['sular', 'suyu', 'suları', 'SULAR', 'suyun', 'suyunun', 'suya', 'suyla', 'sulu', 'susuz', 'yeraltısuyu', 'atıksuların', 'içmesuyu', 'akarsu',
  'hidrojeoloji', 'hydrogeology', 'groundwater', 'akifer', 'aquifer', 'kuyu', 'havzası', 'basin', 'sulama', 'irrigation', 'yağış', 'precipitation', 'kuraklık', 'drought',
  'baraj', 'dam', 'gölü', 'lake', 'nehri', 'çayı', 'deresi', 'river', 'spring', 'şelale', 'taşkın', 'sel', 'flood', 'jeotermal', 'karst', 'kaplıca', 'drenaj'];
const ESLESMEZ = ['sunum', 'suç', 'sultan', 'Şubat', 'sürdürülebilir', 'süreç', 'Sütçü', 'Süleyman', 'sürü', 'sur', 'Şuhut', 'Susurluk', 'Suriye', 'sulh',
  'gölge', 'golf', 'Selçuk', 'selenyum', 'derece', 'dereotu', 'hidroterapi', 'hidrokarbon', 'hidrojen', 'potansiyel', 'yeraltı', 'jeoloji', 'iklim', 'kaynak', 'Denizli', 'damla', 'damping'];
let hata = 0;
for (const w of ESLESIR) if (!SU_TERIMI.test(suNorm(w))) { console.log('KALDI · eşleşmeli ama eşleşmedi:', w); hata++; }
for (const w of ESLESMEZ) if (SU_TERIMI.test(suNorm(w))) { console.log('KALDI · eşleşmemeli ama eşleşti:', w); hata++; }
console.log(`sınır testi: ${ESLESIR.length + ESLESMEZ.length} sözcük, hata ${hata}`);

// 2) Sayılar
const hepsi = [];
for (const [il, ks] of Object.entries(d.iller)) for (const k of (Array.isArray(ks) ? ks : ks.kunyeler ?? [])) hepsi.push({ il, ...k });
const basilanTaban = hepsi.filter((k) => k.baski_uygun !== false && (k.doi || k.url));
const kalan = hepsi.filter(akademikBasilir), elenen = hepsi.filter((k) => !akademikBasilir(k));
const ad = (arr) => new Set(arr.flatMap((k) => (k.yazarlar || []).filter(Boolean)));
const adKalan = ad(kalan), adHepsi = ad(hepsi);
const ilKalan = {}; for (const k of kalan) ilKalan[k.il] = (ilKalan[k.il] || 0) + 1;
const ilToplam = {}; for (const k of hepsi) ilToplam[k.il] = (ilToplam[k.il] || 0) + 1;
const bosIl = Object.keys(ilToplam).filter((il) => !ilKalan[il]);
console.log(`künye: toplam ${hepsi.length} · basılan taban (doi|url) ${basilanTaban.length} · KALAN ${kalan.length} · ELENEN ${elenen.length} (%${(100 * elenen.length / hepsi.length).toFixed(1)})`);
console.log(`farklı yazar adı: ${adHepsi.size} → ${adKalan.size}`);
console.log(`farklı openalex_id: ${new Set(hepsi.map((k) => k.openalex_id)).size} → ${new Set(kalan.map((k) => k.openalex_id)).size}`);
console.log(`il: ${Object.keys(ilToplam).length} · hiç künyesi kalmayan il: ${bosIl.length} ${JSON.stringify(bosIl)}`);
console.log(`il başına kalan: min ${Math.min(...Object.values(ilKalan))} · maks ${Math.max(...Object.values(ilKalan))}`);

// 3) Örnekler (seed'li deterministik karıştırma — Mulberry32)
const rnd = (seed) => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const karistir = (arr, seed) => { const r = rnd(seed), a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const tekil = (arr) => { const g = new Set(); return arr.filter((k) => { const key = (k.baslik || '').toLowerCase(); if (g.has(key)) return false; g.add(key); return true; }); };
const satir = (k) => `[${k.il}] (${k.yil ?? '—'}) ${(k.baslik || '(başlıksız)').slice(0, 110)} || ${k.dergi ?? '—'} || ${(k.yazarlar || []).slice(0, 2).join('; ')}`;
if (process.argv.includes('--ornek')) {
  console.log('\n--- rastgele ELENEN 10 (seed 8) ---'); karistir(tekil(elenen), 8).slice(0, 10).forEach((k, i) => console.log(`${i + 1}. ${satir(k)}`));
  console.log('\n--- rastgele KALAN 10 (seed 8) ---'); karistir(tekil(kalan), 8).slice(0, 10).forEach((k, i) => console.log(`${i + 1}. ${satir(k)} → ${suNorm(k.baslik + ' | ' + (k.dergi ?? '')).match(SU_TERIMI)?.[0]}`));
  // Sınır: elenenlerde geniş yer-bilimi terimi taşıyanlar (yanlış eleme adayları)
  const genis = /\b(jeoloj|geolog|iklim|climat|kaynak|kirlil|pollut|sondaj|sediment|sediman|deniz|ova|termal|thermal|potansiyel|yeralti)/;
  console.log('\n--- SINIR: ELENEN ama geniş yer-bilimi terimi taşıyan 10 (yanlış eleme adayı) ---');
  karistir(tekil(elenen.filter((k) => genis.test(suNorm(k.baslik + ' | ' + (k.dergi ?? ''))))), 8).slice(0, 10).forEach((k, i) => console.log(`${i + 1}. ${satir(k)}`));
  console.log('\n--- SINIR: KALAN ama TEK zayıf terimle tutulan 10 (yanlış tutma adayı) ---');
  const tekTerim = kalan.filter((k) => { const n = suNorm(k.baslik + ' | ' + (k.dergi ?? '')); const m = n.match(new RegExp(SU_TERIMI.source, 'g')) || []; return new Set(m).size === 1; });
  karistir(tekil(tekTerim), 8).slice(0, 10).forEach((k, i) => console.log(`${i + 1}. ${satir(k)} → ${suNorm(k.baslik + ' | ' + (k.dergi ?? '')).match(SU_TERIMI)?.[0]}`));
}
assert.equal(hata, 0, 'sınır testi hatalı');
