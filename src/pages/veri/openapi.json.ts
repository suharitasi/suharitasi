// /veri/openapi.json — Açık veri API'si için OpenAPI 3.1 şeması (13.09.2026).
import type { APIRoute } from 'astro';

const SITE = 'https://suharitasi.com';

const yollar = {
  '/veri/havzalar.json': 'Türkiye’nin 25 su havzası: yağış alanı, yüzey suyu potansiyeli, YAS beslenimi/rezervi.',
  '/veri/iller.json': '81 il → DSİ bölge müdürlüğü, havza(lar) ve su/kanalizasyon idaresi eşlemesi.',
  '/veri/islemler.json': '20 su işlemi → yetkili kurum, mevzuat dayanağı, başvuru kanalı.',
  '/veri/mevzuat.json': '469 mevzuat maddesi (167, YAS Tüzüğü, Su Tahsisleri ve ilgili kanunlar) — resmî metin.',
  '/veri/emsal.json': 'Danıştay/Yargıtay su hukuku emsal kararları (künye + özet).',
  '/veri/sozluk.json': '126 su hukuku/yönetimi terimi ve mevzuat kaynağı.',
  '/veri/su-riski.json': 'İl/havza Su Riski Endeksi: puan, kategori, bileşenler, zaman serileri, su bütçesi.',
  '/veri/mevzuat-surum.json': 'İzlenen mevzuatın madde bazlı SHA-256 anlık görüntüsü (değişiklik radarı).',
  '/kisit.json': 'Resmî Gazete işletme sahası ve tahsise kapatma/kısıt kayıtları (il eşlemeli).',
  '/arama.json': 'Site içi arama indeksi (tüm sayfaların başlık/açıklama kaydı).',
};

// Dizi değil nesne dönen uçlar — şema tipi buna göre verilir (yanlış `array`
// beyanı, makine tüketicilerinin geçerli yanıtı reddetmesine yol açıyordu).
const NESNE = new Set(['/veri/su-riski.json', '/veri/mevzuat-surum.json']);

export const GET: APIRoute = () => {
  const spec = {
    openapi: '3.1.0',
    info: {
      title: 'Su Haritası Açık Veri API',
      version: '1.0.0',
      description:
        'Türkiye’nin su verisi, havzaları ve su mevzuatı — makine-okunur JSON uçları. ' +
        'Kimlik doğrulama gerekmez. Kaynak gösterilerek kullanılabilir. ' +
        'Ajanlar için MCP ucu: ' + SITE + '/mcp (JSON-RPC 2.0; doküman: ' + SITE + '/ajan-erisimi/).',
      license: { name: 'Kaynak gösterilerek kullanım (CC BY 4.0 uyumlu)', url: `${SITE}/gizlilik/` },
      contact: { name: 'Su Haritası', url: SITE },
    },
    servers: [{ url: SITE }],
    paths: Object.fromEntries(
      Object.entries(yollar).map(([yol, aciklama]) => [
        yol,
        {
          get: {
            summary: aciklama,
            operationId: yol.replace(/[/.]/g, '_').replace(/^_/, ''),
            responses: {
              '200': {
                description: 'Başarılı JSON yanıtı',
                content: { 'application/json': { schema: { type: NESNE.has(yol) ? 'object' : 'array' } } },
              },
            },
          },
        },
      ])
    ),
    components: {},
  };
  return new Response(JSON.stringify(spec, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
};
