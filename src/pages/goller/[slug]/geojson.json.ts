// /goller/<slug>/geojson.json — göl CBS geometrisi (Adım 5, 24.09.2026).
// Mevcut OpenStreetMap/Natural Earth geometrisi olduğu gibi sunulur; yeni
// veri üretilmez. Künye: kaynak + lisans + sayfa bağlantısı.
import type { APIRoute } from 'astro';
import { tumGoller, GOLNEHIR_ERISIM, GOLNEHIR_KAPSAM_GOL, GOLNEHIR_LISANS } from '../../../data/gol-nehir.js';

const SITE = 'https://suharitasi.com';

export function getStaticPaths() {
  return tumGoller().map((g) => ({ params: { slug: g.slug }, props: { g } }));
}

export const GET: APIRoute = ({ props }) => {
  const g = (props as { g: ReturnType<typeof tumGoller>[number] }).g;
  const fc = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: g.geometry,
        properties: {
          ad: g.ad,
          slug: g.slug,
          tur: g.tip ?? 'gol',
          kaynak: g.kaynak,
          kapsam: GOLNEHIR_KAPSAM_GOL,
          erisim: GOLNEHIR_ERISIM,
          lisans: GOLNEHIR_LISANS,
          alan_km2: g.alan_km2 ?? null,
          sayfa: `${SITE}/goller/${g.slug}/`,
        },
      },
    ],
  };
  return new Response(JSON.stringify(fc, null, 1), {
    headers: {
      'Content-Type': 'application/geo+json; charset=utf-8',
      'Content-Disposition': `attachment; filename="gol-${g.slug}.geojson"`,
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
