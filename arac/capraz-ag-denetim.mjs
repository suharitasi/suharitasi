#!/usr/bin/env node
/* ============================================================================
   ÇAPRAZ AĞ (TOPIC CLUSTER) DENETİMİ — Faz 5 (v5.2, 21.09.2026).
   ----------------------------------------------------------------------------
   NE YAPAR: dist/ içindeki statik HTML'lerden iç linkleri çıkarır ve
   (1) kırık iç linkleri, (2) göl/nehir/havza/kuyu-ruhsatı kümesinin
   bütünlüğünü (yalnız düğüm, eksik kenar) ölçer. AĞ KULLANMAZ, salt okunur.
   NEDEN: /veri/gundem/ ad-hoc Türkçe slugify yüzünden 3 kırık havza linki
   üretiyordu (Batı Akdeniz → bat-akdeniz). site-saglik md6 kırık linki
   yakalar ama "eksik kenar / yalnız düğüm" ölçmez; bu araç o boşluğu kapatır.

   KULLANIM:  node arac/capraz-ag-denetim.mjs [dist-dizini]
   ÇIKIŞ:     kırık link veya yalnız düğüm varsa 1, temizse 0.
   ========================================================================== */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = process.argv[2] || join(process.cwd(), 'dist');

if (!existsSync(DIST)) {
  console.error(`[capraz-ag] dist bulunamadı: ${DIST} — önce "npm run build".`);
  process.exit(2);
}

function yuru(d, cikti = []) {
  for (const ad of readdirSync(d)) {
    const p = join(d, ad);
    if (statSync(p).isDirectory()) yuru(p, cikti);
    else if (ad.endsWith('.html')) cikti.push(p);
  }
  return cikti;
}

// _redirects: tam-yol kuralları (yorum/boş satır atlanır)
function yonlendirmeler() {
  const m = new Map();
  const yol = join(DIST, '_redirects');
  if (!existsSync(yol)) return m;
  for (const satir of readFileSync(yol, 'utf8').split('\n')) {
    const t = satir.trim();
    if (!t || t.startsWith('#')) continue;
    const [kaynak, hedef] = t.split(/\s+/);
    if (kaynak && hedef) m.set(kaynak, hedef);
  }
  return m;
}

function sayfaVarMi(yol) {
  if (yol === '/' || yol === '') return existsSync(join(DIST, 'index.html'));
  const rel = yol.split('#')[0].split('?')[0].replace(/^\//, '');
  return [
    join(DIST, rel),
    join(DIST, rel, 'index.html'),
    join(DIST, rel + '.html'),
    join(DIST, rel.replace(/\/$/, ''), 'index.html'),
  ].some((a) => existsSync(a) && statSync(a).isFile());
}

const yon = yonlendirmeler();
const dosyalar = yuru(DIST);
const hrefRe = /href\s*=\s*"([^"]+)"/g;
const sayfaLinkleri = new Map();

for (const dosya of dosyalar) {
  const rel = relative(DIST, dosya).replace(/\\/g, '/');
  const sayfaYolu = rel === 'index.html' ? '/' : '/' + rel.replace(/index\.html$/, '');
  // script/style gövdesi çıkarılır: inline JS şablon literalleri sahte-kırık
  // üretmesin ("/havzalar/${e.slug}/" gibi).
  const html = readFileSync(dosya, 'utf8')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');
  const set = new Set();
  let m;
  while ((m = hrefRe.exec(html))) {
    let h = m[1];
    if (!h.startsWith('/') || h.startsWith('//')) continue;
    h = h.split('#')[0].split('?')[0];
    if (h) set.add(h);
  }
  sayfaLinkleri.set(sayfaYolu, set);
}

const kirik = [];
for (const [sayfa, linkler] of sayfaLinkleri) {
  for (const h of linkler) {
    if (yon.has(h)) continue;
    if (!sayfaVarMi(h)) kirik.push({ sayfa, hedef: h });
  }
}

const tur = (y) =>
  /^\/goller\/[^/]+\/$/.test(y) ? 'gol'
  : /^\/nehirler\/[^/]+\/$/.test(y) ? 'nehir'
  : /^\/havzalar\/[^/]+\/$/.test(y) ? 'havza'
  : /^\/kuyu-ruhsati\/[^/]+\/$/.test(y) ? 'il'
  : y === '/kuyu-karar-motoru/' ? 'sihirbaz'
  : y === '/kuyu-kisit-sorgu/' ? 'kisit'
  : null;

const gelen = new Map();
for (const [sayfa, linkler] of sayfaLinkleri) {
  if (!tur(sayfa)) continue;
  for (const h of linkler) {
    if (!tur(h)) continue;
    if (!gelen.has(h)) gelen.set(h, new Set());
    gelen.get(h).add(sayfa);
  }
}

// Beklenen kenarlar (FAZ 5/6 sözleşmesi). Veri-koşullu bir hedef türü
// hiç yoksa (ör. gölün havzası eşlenmemiş) bu bir KUSUR DEĞİLDİR — rapor
// yalnız sayar; karar veriye bırakılır.
const EKSIK_BEKLENEN = {
  gol: ['il', 'havza'], nehir: ['havza', 'il'], havza: ['il', 'gol', 'nehir'],
  il: ['havza', 'sihirbaz'], sihirbaz: [], kisit: [],
};
const eksik = [];
for (const [sayfa, linkler] of sayfaLinkleri) {
  const t = tur(sayfa);
  if (!t) continue;
  const varMi = (k) => [...linkler].some((h) => tur(h) === k);
  for (const k of EKSIK_BEKLENEN[t] || []) if (!varMi(k)) eksik.push({ sayfa, tur: t, eksik: k });
}

const yalnizDugum = [...sayfaLinkleri.keys()].filter((y) => tur(y) && !(gelen.get(y)?.size));

const ozet = {
  dist: DIST,
  toplamSayfa: dosyalar.length,
  kirikLinkSayisi: kirik.length,
  kirikLink: kirik.slice(0, 100),
  kumeSayfaSayisi: [...sayfaLinkleri.keys()].filter(tur).length,
  yalnizDugumSayisi: yalnizDugum.length,
  yalnizDugumler: yalnizDugum.slice(0, 50),
  eksikKenarSayisi: eksik.length,
  eksikKenarlar: eksik,
};

console.log(JSON.stringify(ozet, null, 2));
if (kirik.length || yalnizDugum.length) {
  console.error(`[capraz-ag] KIRMIZI — kırık ${kirik.length} · yalnız düğüm ${yalnizDugum.length}`);
  process.exit(1);
}
console.log(`[capraz-ag] YEŞİL — ${dosyalar.length} sayfa · kırık 0 · yalnız düğüm 0 · eksik kenar ${eksik.length} (veri-koşullu)`);
