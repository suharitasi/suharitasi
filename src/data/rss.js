// RSS 2.0 ÜRETECİ (Adım 3, 24.09.2026) — tek kaynak.
// Site geneli akış (src/pages/feed.xml.ts) DEĞİŞMEDİ; bu üreteç yeni il
// akışları için ortak XML gövdesi kurar. Uydurma yok: item'lar çağıran
// tarafından doğrulanmış veriden verilir.
const kacir = (s) =>
  String(s ?? '').replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));

/** item: { title, link, desc, date } — date Date|string. */
export function rssOlustur({ baslik, link, aciklama, self, items = [], sonTarih = new Date() }) {
  const rfc = (d) => {
    const t = d instanceof Date ? d : new Date(d);
    return isNaN(t) ? new Date().toUTCString() : t.toUTCString();
  };
  const govde = items
    .map(
      (i) => `<item>
<title>${kacir(i.title)}</title>
<link>${kacir(i.link)}</link>
<guid isPermaLink="true">${kacir(i.link)}</guid>
<description>${kacir(i.desc)}</description>
<pubDate>${rfc(i.date)}</pubDate>
</item>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${kacir(baslik)}</title>
<link>${kacir(link)}</link>
<description>${kacir(aciklama)}</description>
<language>tr-TR</language>
<lastBuildDate>${rfc(sonTarih)}</lastBuildDate>
<atom:link href="${kacir(self)}" rel="self" type="application/rss+xml" />
${govde}
</channel>
</rss>`;
}
