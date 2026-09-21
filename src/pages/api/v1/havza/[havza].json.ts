// AÇIK VERİ UÇ NOKTASI — /api/v1/havza/[havza].json  (build-time STATİK)
// Kaynak: mevcut 'havzalar' içerik koleksiyonu. Uydurma alan YOK (K7).
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
    kaynak: 'Su Haritası Açık Hidroloji ve Hukuk İndeksi (2026)',
    not: 'Mevcut içerik koleksiyonundan derlenmiştir; hukuki görüş değildir.',
  };
  return new Response(JSON.stringify(govde, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
