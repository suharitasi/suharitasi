#!/usr/bin/env node
// SEO denetimi — dist/ statik HTML üzerinde. Sayfa başına: title (varlık/uzunluk
// ≤60/teklik), meta description (varlık/50-160), canonical, h1 tekliği, img alt
// eksikleri, OG temel etiketleri; site düzeyi: title tekliği + sitemap kapsama.
// Salt-okunur; hiçbir sayfayı DEĞİŞTİRMEZ. Bulgu üretir.
//
// Şiddet: K=eksik zorunlu öğe, O=uzunluk/format ihlali, D=iyileştirme.
// CLI:  node arac/seo-audit.mjs [dist-yolu]   (varsayılan: dist)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tumHtmlDosyalari, oku, sayfaYolu, titleMetni, metaIcerik, canonicalVar,
  h1ler, imgAltEksik, ogEtiket } from './seo-geo-ortak.mjs';

const OG_TEMEL = ['title', 'description', 'url', 'type', 'image'];

// Tek sayfa SEO bulguları (site-tarama bunu import eder)
export function seoSayfa(html, yol) {
  const b = [];
  const ekle = (kod, kural, detay) => b.push({ kod, kural, sayfa: yol, detay });

  const title = titleMetni(html);
  if (!title) ekle('K', 'title-yok', 'sayfada <title> yok');
  else if (title.length > 60) ekle('O', 'title-uzun', `title ${title.length} karakter (>60)`);

  const desc = metaIcerik(html, 'description');
  if (desc === null) ekle('K', 'meta-desc-yok', 'meta description yok');
  else if (desc.length < 50 || desc.length > 160) ekle('O', 'meta-desc-uzunluk', `description ${desc.length} karakter (50-160 dışı)`);

  if (!canonicalVar(html)) ekle('K', 'canonical-yok', 'rel=canonical yok');

  const hs = h1ler(html);
  if (hs.length === 0) ekle('K', 'h1-yok', 'sayfada <h1> yok');
  else if (hs.length > 1) ekle('O', 'h1-coklu', `${hs.length} adet <h1> (teklik ihlali)`);

  const { toplam, eksik } = imgAltEksik(html);
  if (eksik > 0) ekle('D', 'img-alt-eksik', `${eksik}/${toplam} <img> alt özniteliksiz`);

  const ogEksik = OG_TEMEL.filter((o) => ogEtiket(html, o) === null);
  if (ogEksik.length) ekle('D', 'og-eksik', `eksik OG: ${ogEksik.map((o) => 'og:' + o).join(', ')}`);

  return { title, bulgular: b };
}

// Site düzeyi: title tekliği + sitemap kapsama
export function seoSite(sayfalar, distKok) {
  const b = [];
  // title tekliği
  const gruplar = new Map();
  for (const s of sayfalar) {
    if (!s.title) continue;
    const k = s.title.toLowerCase();
    if (!gruplar.has(k)) gruplar.set(k, []);
    gruplar.get(k).push(s.yol);
  }
  for (const [t, yollar] of gruplar) {
    if (yollar.length > 1) b.push({ kod: 'O', kural: 'title-tekrar', sayfa: yollar.join(' , '), detay: `aynı title ${yollar.length} sayfada: "${t.slice(0, 50)}"` });
  }
  // sitemap kapsama
  const smPath = join(distKok, 'sitemap.xml');
  let smUrls = new Set();
  try {
    const sm = readFileSync(smPath, 'utf8');
    for (const m of sm.matchAll(/<loc>([^<]+)<\/loc>/gi)) {
      let u = m[1].trim().replace(/^https?:\/\/[^/]+/, '');
      if (u !== '/' && !u.endsWith('/')) u += '/';
      smUrls.add(u);
    }
  } catch { b.push({ kod: 'K', kural: 'sitemap-yok', sayfa: 'sitemap.xml', detay: 'dist/sitemap.xml okunamadı' }); return b; }
  // sitemap index olabilir (alt sitemap'ler) — o durumda kapsama kontrolü atlanır
  const smIndex = smUrls.size === 0;
  if (!smIndex) {
    for (const s of sayfalar) {
      if (/\/404\/?$/.test(s.yol)) continue; // 404 sitemap'e girmez (normal)
      if (!smUrls.has(s.yol)) b.push({ kod: 'D', kural: 'sitemap-disi', sayfa: s.yol, detay: 'sayfa sitemap.xml kapsamında değil' });
    }
  }
  return b;
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const kok = process.argv[2] || 'dist';
  const dosyalar = tumHtmlDosyalari(kok);
  const sayfalar = []; const tum = [];
  for (const p of dosyalar) {
    const yol = sayfaYolu(kok, p);
    const { title, bulgular } = seoSayfa(oku(p), yol);
    sayfalar.push({ yol, title });
    tum.push(...bulgular);
  }
  tum.push(...seoSite(sayfalar, kok));
  const say = (k) => tum.filter((x) => x.kod === k).length;
  console.log(`SEO denetimi — ${dosyalar.length} sayfa · bulgu: ${tum.length} (K:${say('K')} O:${say('O')} D:${say('D')})`);
  for (const x of tum) console.log(`  [${x.kod}] ${x.kural} — ${x.sayfa} — ${x.detay}`);
}
