// SEO/GEO denetim — ortak HTML ayrıştırma yardımcıları (yalnız Node built-in).
// Regex tabanlı; harici bağımlılık YOK. Astro SSG çıktısı statik HTML olduğundan
// tüm içerik JS'siz DOM'da bulunur — analiz bunun üzerinde çalışır.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export function tumHtmlDosyalari(kok) {
  const out = [];
  (function yuru(d) {
    for (const ad of readdirSync(d)) {
      const p = join(d, ad);
      const st = statSync(p);
      if (st.isDirectory()) yuru(p);
      else if (ad.endsWith('.html')) out.push(p);
    }
  })(kok);
  return out.sort();
}

export function oku(p) { return readFileSync(p, 'utf8'); }

// URL yolu: dist/kuyu-ruhsati/index.html -> /kuyu-ruhsati/
export function sayfaYolu(distKok, p) {
  let r = '/' + relative(distKok, p).replace(/\\/g, '/');
  r = r.replace(/index\.html$/, '').replace(/\.html$/, '');
  if (r !== '/' && !r.endsWith('/')) r += '/';
  return r;
}

const etiketSiz = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&#?\w+;/g, ' ').replace(/\s+/g, ' ').trim();
export { etiketSiz };

export function ilkEslesme(html, re) { const m = html.match(re); return m ? m[1] : null; }

export function metaIcerik(html, adAdi) {
  // <meta name="description" content="..."> (attr sırası değişebilir)
  const re = new RegExp('<meta[^>]+name=["\']' + adAdi + '["\'][^>]*>', 'i');
  const tag = html.match(re);
  if (!tag) return null;
  // ARAÇ HATASI DÜZELTMESİ (25.08.2026, GEO/SEO briefi): eski desen İLK
  // tırnak türünde kesiyordu — "Havzası'ndan" içindeki kesme işareti değeri
  // kırpıp 94 nehir sayfasında sahte "meta-desc-uzunluk" üretti (gerçek 95,
  // ölçülen 26). Doğrusu: açılış tırnağıyla aynı karakterde kapan (geri başvuru).
  const c = tag[0].match(/content=(["'])([\s\S]*?)\1/i);
  return c ? c[2].trim() : '';
}

export function ogEtiket(html, ozellik) {
  const re = new RegExp('<meta[^>]+property=["\']og:' + ozellik + '["\'][^>]*>', 'i');
  const tag = html.match(re);
  if (!tag) return null;
  // ARAÇ HATASI DÜZELTMESİ (25.08.2026, GEO/SEO briefi): eski desen İLK
  // tırnak türünde kesiyordu — "Havzası'ndan" içindeki kesme işareti değeri
  // kırpıp 94 nehir sayfasında sahte "meta-desc-uzunluk" üretti (gerçek 95,
  // ölçülen 26). Doğrusu: açılış tırnağıyla aynı karakterde kapan (geri başvuru).
  const c = tag[0].match(/content=(["'])([\s\S]*?)\1/i);
  return c ? c[2].trim() : '';
}

export function h1ler(html) {
  const out = [];
  const re = /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi; let m;
  while ((m = re.exec(html))) out.push(etiketSiz(m[1]));
  return out;
}

export function jsonLdBloklari(html) {
  const out = []; const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi; let m;
  while ((m = re.exec(html))) out.push(m[1].trim());
  return out;
}

export function imgAltEksik(html) {
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  let eksik = 0;
  for (const t of imgs) {
    // alt="" boş sayılmaz (dekoratif meşru); alt YOKSA eksik
    if (!/\balt\s*=/.test(t)) eksik++;
  }
  return { toplam: imgs.length, eksik };
}

export function ozCevapMetni(html) {
  // <... class="... oz-cevap ...">İÇERİK</...> — ilk oz-cevap bloğu
  const m = html.match(/<([a-zA-Z0-9]+)[^>]*class=["'][^"']*\boz-cevap\b[^"']*["'][^>]*>([\s\S]*?)<\/\1>/i);
  if (!m) return null;
  return etiketSiz(m[2]);
}

export function govdeMetin(html) {
  const b = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  const govde = b ? b[1] : html;
  const t = govde.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
  return etiketSiz(t);
}

// soru-formatlı başlık: h1/h2'de '?' ya da TR soru kalıbı
export function soruBasligiVar(html) {
  const bas = [];
  let m; const re = /<h[12]\b[^>]*>([\s\S]*?)<\/h[12]>/gi;
  while ((m = re.exec(html))) bas.push(etiketSiz(m[1]));
  const soru = /\?|\bnas[ıi]l\b|\bnedir\b|\bhangi\b|\bka[çc]\b|\bne\s+zaman\b|\bnereden\b|\bm[iıuü]\b/i;
  return bas.some((b) => soru.test(b));
}

export function canonicalVar(html) { return /<link[^>]+rel=["']canonical["']/i.test(html); }

export function titleMetni(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? etiketSiz(m[1]) : null;
}
