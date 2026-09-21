// AÇIK VERİ UÇ NOKTASI — /api/v1/il/[il].json  (build-time STATİK; sunucu/DB yok)
// Kaynak: yalnız mevcut doğrulanmış veri modülleri. Uydurma alan YOK (K7).
// Hüküm/ceza tutarı ÜRETİLMEZ; yalnız mevzuat DAYANAĞI listelenir.
import { tumIlProfilleri } from '../../../../data/il-profil.js';
import { ilKayitlari } from '../../../../data/kisit-sorgu.js';

export function getStaticPaths() {
  return tumIlProfilleri().map((p) => ({ params: { il: p.slug }, props: { p } }));
}

export function GET({ props }: any) {
  const p = props.p;
  let kisit: any[] = [];
  try {
    kisit = ilKayitlari(p.il) || [];
  } catch {
    kisit = [];
  }
  const govde = {
    il: p.il,
    slug: p.slug,
    sayfa: `https://suharitasi.com/kuyu-ruhsati/${p.slug}/`,
    dsiBolgeleri: (p.dsiBolgeleri || []).map((b: any) => ({
      no: b.no, merkez: b.merkez,
    })),
    suIdaresi: p.suIdaresi ?? null,
    havzalar: (p.havzalar || []).map((h: any) => ({ ad: h.ad, slug: h.slug })),
    rgKisitKayitlari: kisit.map((r: any) => ({
      durum: r.durum ?? null,
      tarih: r.tarih ?? null,
      ilce: r.ilce ?? null,
      kaynak_url: r.kaynak_url ?? r.url ?? null,
    })),
    mevzuatDayanagi: [
      { kanun: '167 sayılı Yeraltısuları Hakkında Kanun', madde: 8, konu: 'Belge (arama/kullanma/ıslah-tadil) zorunluluğu' },
      { kanun: '167 sayılı Yeraltısuları Hakkında Kanun', madde: 18, konu: 'İdari para cezası ve kuyu kapatma' },
      { kanun: '2577 sayılı İYUK', madde: 7, konu: 'İdari dava açma süresi (60 gün)' },
    ],
    kaynak: 'Su Haritası Açık Hidroloji ve Hukuk İndeksi (2026)',
    not: 'Yalnız doğrulanmış kaynaklardan derlenmiştir; hukuki görüş değildir.',
  };
  return new Response(JSON.stringify(govde, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
