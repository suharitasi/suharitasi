// /veri/su-riski.json — Su Riski Endeksi API ucu (Astro endpoint).
import type { APIRoute } from 'astro';
import { HAVZA_RISK, IL_RISK, FORMUL, AGIRLIK, OZET, SERILER, BUTCE } from '../../data/su-riski.js';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      _not: 'Su Haritası Su Riski Endeksi — şeffaf bileşik gösterge; resmî sınıflama değildir.',
      formul: FORMUL,
      agirliklar: AGIRLIK,
      ozet: OZET,
      havzalar: HAVZA_RISK,
      iller: IL_RISK,
      seriler: SERILER,
      butce: BUTCE,
    }),
    { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } }
  );
