// /feed.xml — RSS 2.0 akışı (13.09.2026). Veri gazetecileri ve araştırmacılar için.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import log from '../../data/kamu/mevzuat-degisiklik.json';

const SITE = 'https://suharitasi.com';

const esc = (s) => String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));

export const GET: APIRoute = async () => {
  const rehberler = await getCollection('rehberler');
  const items = rehberler.map((r) => ({
    title: r.data.baslik,
    link: `${SITE}/rehberler/${r.id}/`,
    desc: r.data.ozet,
    date: new Date(r.data.guncelleme ?? r.data.tarih),
  }));
  // Mevzuat değişiklik kayıtları (varsa)
  for (const k of (log.kayitlar || []).slice(0, 20)) {
    items.push({
      title: `Mevzuat değişikliği: ${k.kanun} ${k.madde} (${k.tip})`,
      link: `${SITE}/mevzuat/degisiklikler/`,
      desc: `${k.kanun} ${k.madde} hükmü ${k.tip}. Resmî metin farkı — Su Haritası mevzuat radarı.`,
      date: new Date(k.tarih),
    });
  }
  // Veri gündemi
  items.push({
    title: 'Veri gündemi: en riskli havzalar, kuraklık ve kapatma ilanları',
    link: `${SITE}/veri/gundem/`,
    desc: 'Baraj doluluk, uydu su ölçümü eğilimi ve Resmî Gazete verisinden otomatik derlenen gündem.',
    date: new Date(),
  });
  items.sort((a, b) => b.date - a.date);
  const rfc = (d) => d.toUTCString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/rss-style.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>Su Haritası</title>
<link>${SITE}/</link>
<description>Türkiye'nin su verisi, havzaları ve su mevzuatı — tek haritada.</description>
<language>tr-TR</language>
<atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
${items.slice(0, 50).map((i) => `<item>
<title>${esc(i.title)}</title>
<link>${i.link}</link>
<guid isPermaLink="true">${i.link}</guid>
<description>${esc(i.desc)}</description>
<pubDate>${rfc(i.date)}</pubDate>
</item>`).join('\n')}
</channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
};
