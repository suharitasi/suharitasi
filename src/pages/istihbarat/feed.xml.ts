// /istihbarat/feed.xml — BİRLEŞİK SU İSTİHBARATI AKIŞI (Adım 3).
import type { APIRoute } from 'astro';
import { rssOlustur } from '../../data/rss.js';
import { tumItemlari } from '../../data/istihbarat.js';

const SITE = 'https://suharitasi.com';

export const GET: APIRoute = () =>
  new Response(
    rssOlustur({
      baslik: 'Su Haritası — Su İstihbaratı (birleşik)',
      link: `${SITE}/istihbarat/`,
      aciklama: 'Resmî Gazete yeraltı suyu kayıtları ve mevzuat değişiklikleri — tüm Türkiye.',
      self: `${SITE}/istihbarat/feed.xml`,
      items: tumItemlari(),
    }),
    { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } }
  );
