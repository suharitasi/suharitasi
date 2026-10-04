// /veri/mevzuat-arama.json — /mevzuat/ indeksinin TEMBEL arama indeksi.
//
// NEDEN (04.10.2026 denetimi): indeks sayfası her <li> için tam madde metnini
// data-madde özniteliğinde ikinci kez taşıyordu; sayfa 686.930 bayttı ve bunun
// 449.150 baytı bu kopyaydı. Süzgeç (public/s/mevzuat-filtre.js) bu dosyayı
// yalnız sayfa boştayken bir kez çeker; ilk HTML/DOM bu metni taşımaz.
// Tam metin arama yeteneği KORUNUR (regresyon yok); sıra birebirdir:
// maddeler[] sırası = DOM'daki .mv-liste li sırası.
import type { APIRoute } from 'astro';
import mevzuat from '../../../data/kamu/mevzuat-maddeleri.json';

// İstemci Türkçe normalizasyonu uygular; sunucu HAM metni verir (tek kaynak,
// uydurma yok — yalnız yayımlanmış madde metni birleştirilir).
export const GET: APIRoute = () => {
  const metinler = mevzuat.maddeler.map(
    (m) => `${m.kanun} ${m.madde} ${m.baslik} ${m.metin}`
  );
  return new Response(
    JSON.stringify({ surum: 1, adet: metinler.length, metinler }),
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    }
  );
};
