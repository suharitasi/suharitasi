// /istihbarat/<il>/feed.xml — İL BAZINDA SU İSTİHBARATI AKIŞI (Adım 3).
// 81 il için statik RSS 2.0; item'lar o ilin Resmî Gazete kayıtları +
// ulusal mevzuat değişiklikleridir. Uydurma yok: kaynak rg-zaman.js.
import type { APIRoute } from 'astro';
import { rssOlustur } from '../../../data/rss.js';
import { AKISLAR, ilItemlari } from '../../../data/istihbarat.js';

const SITE = 'https://suharitasi.com';

export function getStaticPaths() {
  return AKISLAR.map((a) => ({ params: { il: a.slug }, props: { il: a.il, slug: a.slug } }));
}

export const GET: APIRoute = ({ props }) => {
  const { il, slug } = props as { il: string; slug: string };
  const items = ilItemlari(il);
  if (items.length === 0) {
    items.push({
      title: `${il} su istihbaratı — Su Haritası`,
      link: `${SITE}/istihbarat/`,
      desc: `${il} için derlenmiş yeni kayıt bulunmuyor. Yeni bir Resmî Gazete veya mevzuat kaydı eklendiğinde bu akışa düşer.`,
      date: new Date(),
    });
  }
  return new Response(
    rssOlustur({
      baslik: `Su Haritası — ${il} su istihbaratı`,
      link: `${SITE}/istihbarat/`,
      aciklama: `${il} için Resmî Gazete yeraltı suyu kayıtları ve mevzuat değişiklikleri.`,
      self: `${SITE}/istihbarat/${slug}/feed.xml`,
      items,
    }),
    { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } }
  );
};
