// GEÇİCİ SİTE HARİTASI — Aşama 2'de kapatılan (noindex) ve yönlendirilen adresler (KARARLAR §73/6,
// 10.10.2026). Amaç: arama motoru bu adresleri yeniden tarayıp noindex/301'i hızlı görsün.
// Birkaç hafta tutulur; kaldırma tarihi: 21.11.2026 (rapor/DURUM-katma-deger.md). Adresler ölçüt
// modüllerinden üretilir (elle yazılmaz): mevzuat-dizin.js, gol-nehir.js, persona.js, il-profil.js.
import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { maddeDizinKarari } from '../data/mevzuat-dizin.js';
import { maddeIndekslenir } from '../data/mevzuat-metin.js';
import { maddeYolu } from '../data/madde-baglari.js';
import { tumGoller, tumNehirler, golDizinKarari, nehirDizinKarari } from '../data/gol-nehir.js';
import { personalar } from '../data/persona.js';
import { yayinlananIller } from '../data/il-profil.js';

const SITE = 'https://suharitasi.com';
const TARIH = '2026-10-10';

export const GET: APIRoute = () => {
  const mevzuat = JSON.parse(readFileSync(join(process.cwd(), 'data/kamu/mevzuat-maddeleri.json'), 'utf8')).maddeler;
  const yollar = [
    ...mevzuat.filter((m: any) => maddeIndekslenir(m) && !maddeDizinKarari(m).dizin).map(maddeYolu),
    ...tumGoller().filter((g: any) => !golDizinKarari(g).dizin).map((g: any) => `/goller/${g.slug}/`),
    ...tumNehirler().filter((n: any) => !nehirDizinKarari(n).dizin).map((n: any) => `/nehirler/${n.slug}/`),
    ...yayinlananIller().map((p: any) => `/yeralti-suyu/${p.slug}/`),
    ...personalar.filter((p: any) => p.kaynak === 'nace-ek2').map((p: any) => `/durumum/${p.slug}/`),
  ];
  const govde = [...new Set(yollar)].map((y) => `  <url><loc>${SITE}${y}</loc><lastmod>${TARIH}</lastmod></url>`).join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${govde}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
