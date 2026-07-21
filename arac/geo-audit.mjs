#!/usr/bin/env node
// GEO (Generative Engine Optimization) denetimi — dist/ statik HTML. Sayfa başına:
// öz-cevap bloğu varlık + ≤280 karakter, JSON-LD sözdizim geçerliliği + tip,
// içeriğin JS'siz DOM'da varlığı, soru-formatlı başlık varlığı.
// Salt-okunur. Şiddet: K=eksik zorunlu, O=uzunluk/format, D=iyileştirme.
// CLI:  node arac/geo-audit.mjs [dist-yolu]
import { tumHtmlDosyalari, oku, sayfaYolu, jsonLdBloklari, ozCevapMetni,
  govdeMetin, soruBasligiVar } from './seo-geo-ortak.mjs';

// İçerik sayfası mı? (öz-cevap + soru başlığı yalnız içerik sayfalarında zorunlu-ish)
function icerikSayfasi(yol) {
  return /^\/(rehberler|vaka|havza)\//.test(yol) || /^\/(kuyu-ruhsati|harita)\/?$/.test(yol);
}

export function geoSayfa(html, yol) {
  const b = [];
  const ekle = (kod, kural, detay) => b.push({ kod, kural, sayfa: yol, detay });
  const icerik = icerikSayfasi(yol);

  // öz-cevap bloğu
  const oz = ozCevapMetni(html);
  if (oz === null) {
    ekle(icerik ? 'K' : 'D', 'oz-cevap-yok', icerik ? 'içerik sayfasında öz-cevap bloğu yok' : 'öz-cevap bloğu yok (yardımcı sayfa)');
  } else if (oz.length > 280) {
    ekle('O', 'oz-cevap-uzun', `öz-cevap ${oz.length} karakter (>280)`);
  }

  // JSON-LD sözdizim + tip
  const ldler = jsonLdBloklari(html);
  if (ldler.length === 0) {
    ekle('D', 'json-ld-yok', 'JSON-LD (application/ld+json) yok');
  } else {
    const tipler = new Set();
    ldler.forEach((raw, i) => {
      try {
        const j = JSON.parse(raw);
        const gez = (o) => {
          if (Array.isArray(o)) return o.forEach(gez);
          if (o && typeof o === 'object') {
            if (o['@type']) [].concat(o['@type']).forEach((t) => tipler.add(t));
            Object.values(o).forEach(gez);
          }
        };
        gez(j);
      } catch (e) {
        ekle('K', 'json-ld-gecersiz', `JSON-LD blok #${i + 1} sözdizim hatası: ${String(e.message).slice(0, 60)}`);
      }
    });
    if (tipler.size === 0 && ldler.length) ekle('O', 'json-ld-tipsiz', 'JSON-LD var ama @type yok');
  }

  // içeriğin JS'siz DOM'da varlığı (Astro SSG → olmalı)
  const govde = govdeMetin(html);
  if (govde.length < 200) ekle('K', 'icerik-dom-disi', `JS'siz gövde metni yalnız ${govde.length} karakter (içerik JS ile mi geliyor?)`);

  // soru-formatlı başlık (GEO alıntı sinyali)
  if (icerik && !soruBasligiVar(html)) ekle('D', 'soru-baslik-yok', 'soru-formatlı H1/H2 yok (GEO alıntı sinyali zayıf)');

  return { bulgular: b, ozLen: oz === null ? null : oz.length };
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const kok = process.argv[2] || 'dist';
  const dosyalar = tumHtmlDosyalari(kok);
  const tum = [];
  for (const p of dosyalar) {
    const yol = sayfaYolu(kok, p);
    const { bulgular } = geoSayfa(oku(p), yol);
    tum.push(...bulgular);
  }
  const say = (k) => tum.filter((x) => x.kod === k).length;
  console.log(`GEO denetimi — ${dosyalar.length} sayfa · bulgu: ${tum.length} (K:${say('K')} O:${say('O')} D:${say('D')})`);
  for (const x of tum) console.log(`  [${x.kod}] ${x.kural} — ${x.sayfa} — ${x.detay}`);
}
