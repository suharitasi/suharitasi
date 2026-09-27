// AÇIK VERİ UÇ NOKTASI — /api/v1/havza/[havza].json (build-time STATİK)
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const havzalar = await getCollection('havzalar');
  return havzalar.map((h) => ({ params: { havza: h.id }, props: { id: h.id, data: h.data } }));
}

export function GET({ props }: any) {
  const { id, data } = props;
  const govde = {
    havza: id,
    ...(data?.baslik ? { baslik: data.baslik } : {}),
    veri: data ?? {},
    meta: {
      kaynak: 'Su Haritası Açık Hidroloji ve Hukuk İndeksi (2026)',
      surum: 'v1.0.0',
      lisans: 'CC-BY-4.0',
      doi: '10.5281/zenodo.23002678',
      entity: 'https://www.wikidata.org/wiki/Q141582057',
      uri: `https://suharitasi.com/api/v1/havza/${id}.json`,
      not: 'Mevcut içerik koleksiyonundan derlenmiştir; hukuki mütalaa veya resmi bildirim niteliği taşımaz.'
    }
  };
  return new Response(JSON.stringify(govde, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
  });
}
