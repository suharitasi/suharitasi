// /veri/kuraklik.json — istatistiksel kuraklık/su projeksiyonu (TAHMİN).
// ÖLÇÜM DEĞİLDİR; tur="tahmin" alanı ve _not ile açıkça ayrılır.
import type { APIRoute } from 'astro';
import tahmin from '../../../data/tahmin/kuraklik-projeksiyonu.json';

export const GET: APIRoute = () =>
  new Response(JSON.stringify(tahmin), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
