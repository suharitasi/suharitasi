#!/usr/bin/env node
// SİTE TARAMA — seo-audit + geo-audit'i tüm dist/'e koşar; öncelik tablosu üretir:
// sorun (kural) × etkilenen sayfa sayısı × şiddet (K=eksik zorunlu, O=uzunluk/format,
// D=iyileştirme). Salt-okunur; TESPİT üretir, hiçbir sayfayı DÜZELTMEZ.
// CLI:  node arac/site-tarama.mjs [dist-yolu]   → Markdown rapor (stdout)
import { tumHtmlDosyalari, oku, sayfaYolu } from './seo-geo-ortak.mjs';
import { seoSayfa, seoSite } from './seo-audit.mjs';
import { geoSayfa } from './geo-audit.mjs';

const kok = process.argv[2] || 'dist';
const SIDDET_AD = { K: 'K — eksik zorunlu öğe', O: 'O — uzunluk/format ihlali', D: 'D — iyileştirme' };
const SIRA = { K: 0, O: 1, D: 2 };

const dosyalar = tumHtmlDosyalari(kok);
const sayfalar = [];
const tum = [];
for (const p of dosyalar) {
  const yol = sayfaYolu(kok, p);
  const html = oku(p);
  const s = seoSayfa(html, yol);
  const g = geoSayfa(html, yol);
  sayfalar.push({ yol, title: s.title });
  tum.push(...s.bulgular, ...g.bulgular);
}
tum.push(...seoSite(sayfalar, kok));

// kural bazında topla
const grup = new Map(); // kural -> {kod, sayfalar:Set, ornek}
for (const x of tum) {
  if (!grup.has(x.kural)) grup.set(x.kural, { kod: x.kod, sayfalar: new Set(), ornek: x.detay });
  grup.get(x.kural).sayfalar.add(x.sayfa);
}
const satirlar = [...grup.entries()].map(([kural, v]) => ({
  kural, kod: v.kod, adet: v.sayfalar.size, ornek: v.ornek,
})).sort((a, b) => (SIRA[a.kod] - SIRA[b.kod]) || (b.adet - a.adet));

const say = (k) => tum.filter((x) => x.kod === k).length;
const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');

let md = '';
md += '# SEO/GEO Site Taraması — ÖNCELİK TABLOSU\n\n';
md += `Tarih (UTC): ${now} · Taranan sayfa: **${dosyalar.length}** · Dist: \`${kok}\`\n\n`;
md += `Toplam bulgu: **${tum.length}** — K:${say('K')} · O:${say('O')} · D:${say('D')}\n\n`;
md += '> Bu rapor TESPİTTİR — hiçbir sayfa düzeltilmedi. Düzeltme kararları kullanıcı + Fable\'da.\n\n';
md += '## Öncelik tablosu (şiddet → etkilenen sayfa sayısı)\n\n';
md += '| Şiddet | Sorun (kural) | Etkilenen sayfa | Örnek detay |\n';
md += '|---|---|---:|---|\n';
for (const r of satirlar) md += `| ${r.kod} | ${r.kural} | ${r.adet} | ${r.ornek.replace(/\|/g, '\\|').slice(0, 80)} |\n`;
if (!satirlar.length) md += '| — | (bulgu yok) | 0 | temiz |\n';
md += '\n### Şiddet açıklaması\n';
for (const [k, v] of Object.entries(SIDDET_AD)) md += `- **${v}** — bulgu: ${say(k)}\n`;

// K/O bulgularının sayfa dökümü (D genelde çok → yalnız özet)
md += '\n## K + O bulguları — sayfa dökümü\n\n';
const ko = tum.filter((x) => x.kod !== 'D');
if (!ko.length) md += '_(K/O bulgusu yok)_\n';
else {
  md += '| Şiddet | Kural | Sayfa | Detay |\n|---|---|---|---|\n';
  for (const x of ko.sort((a, b) => SIRA[a.kod] - SIRA[b.kod]))
    md += `| ${x.kod} | ${x.kural} | ${x.sayfa.slice(0, 60)} | ${x.detay.replace(/\|/g, '\\|').slice(0, 80)} |\n`;
}
md += '\n---\n_Üretim: arac/site-tarama.mjs (seo-audit + geo-audit) · salt-okunur denetim_\n';

process.stdout.write(md);
