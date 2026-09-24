// /nehirler/<slug>/geojson.json — nehir CBS geometrisi (Adım 5, 24.09.2026).
// Mevcut OpenStreetMap geometrisi olduğu gibi sunulur; yeni veri üretilmez.
// Künye: kaynak + lisans + sayfa bağlantısı. Saha uzmanı/CBS için indirilebilir.
import type { APIRoute } from 'astro';
import { tumNehirler, GOLNEHIR_ERISIM, GOLNEHIR_KAPSAM_NEHIR, GOLNEHIR_LISANS } from '../../../data/gol-nehir.js';

const SITE = 'https://suharitasi.com';

export function getStaticPaths() {
  return tumNehirler().map((n) => ({ params: { slug: n.slug }, props: { n } }));
}

export const GET: APIRoute = ({ props }) => {
  const n = (props as { n: ReturnType<typeof tumNehirler>[number] }).n;
  const fc = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: n.geometry,
        properties: {
          ad: n.ad,
          slug: n.slug,
          tur: 'nehir',
          kaynak: n.kaynak,
          kapsam: GOLNEHIR_KAPSAM_NEHIR,
          erisim: GOLNEHIR_ERISIM,
          lisans: GOLNEHIR_LISANS,
          sayfa: `${SITE}/nehirler/${n.slug}/`,
        },
      },
    ],
  };
  return new Response(JSON.stringify(fc, null, 1), {
    headers: {
      'Content-Type': 'application/geo+json; charset=utf-8',
      'Content-Disposition': `attachment; filename="nehir-${n.slug}.geojson"`,
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
