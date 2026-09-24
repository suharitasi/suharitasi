// /veri/su-uyum.json — UYUM DOSYASI ÜRETECİ VERİ UCU (Adım 4).
// İstemci (public/s/su-uyum.js) belgeyi bu uçtan kurar. Tüm içerik build-time
// doğrulanmış kaynaktan (src/data/su-uyum.js); uydurma yok.
import type { APIRoute } from 'astro';
import {
  ONAYLANDI, CERCEVE, FAALIYETLER, ISLEMLER_UYUM, EMSALLER, ILLER, CEKIRDEK_ISLEM,
} from '../../data/su-uyum.js';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({ ONAYLANDI, CERCEVE, FAALIYETLER, ISLEMLER: ISLEMLER_UYUM, EMSALLER, ILLER, CEKIRDEK_ISLEM }),
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    }
  );
