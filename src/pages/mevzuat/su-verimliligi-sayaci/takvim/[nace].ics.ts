// .ics HATIRLATICI UÇLARI (Adım 2, 24.09.2026).
// /mevzuat/su-verimliligi-sayaci/takvim/tum.ics  (genel)
// /mevzuat/su-verimliligi-sayaci/takvim/01.ics   (31 ana faaliyet, NACE kodu)
// İçerik yalnız doğrulanmış veriden (src/data/su-verimliligi.js); statik
// barındırma korunur, sunucu fonksiyonu gerekmez.
import type { APIRoute } from 'astro';
import { ANA_FAALIYETLER, icsOlustur } from '../../../../data/su-verimliligi.js';

export function getStaticPaths() {
  return [
    { params: { nace: 'tum' }, props: { faaliyet: null } },
    ...ANA_FAALIYETLER.map((f) => ({ params: { nace: f.kod }, props: { faaliyet: f } })),
  ];
}

export const GET: APIRoute = ({ props }) => {
  const faaliyet = (props as { faaliyet: (typeof ANA_FAALIYETLER)[number] | null }).faaliyet;
  const govde = icsOlustur(faaliyet);
  const ad = faaliyet ? `su-verimliligi-nace-${faaliyet.kod}.ics` : 'su-verimliligi-son-basvuru.ics';
  return new Response(govde, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${ad}"`,
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
