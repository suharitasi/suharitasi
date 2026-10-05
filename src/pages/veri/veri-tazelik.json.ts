import type { APIRoute } from 'astro';
import { tazelikTablosu } from '../../../arac/veri-tazelik.mjs';

// /veri/veri-tazelik.json — VERİ TAZELİK PANOSU (P6-B, 05.10.2026).
// Aynı modülden (/acik-veri/ panosu + sağlık bekçisi) beslenir; uydurma yok:
// as-of yalnız veri künyesinden. _headers: /veri/*.json indirme başlığı alır.
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({ uretildi: new Date().toISOString(), kaynak: 'arac/veri-tazelik.mjs', veri: tazelikTablosu() }, null, 2),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
  );
