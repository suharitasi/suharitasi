// İŞLEM MATRİSİ — TEK KAYNAK (13.09.2026).
// 20 su işlemini (su-islemleri.json) yetkili kurumla (hangi-kapi.json →
// su-birimleri.json), mevzuat dayanağıyla ve ilgili rehberle birleştirir;
// ayrıca il → DSİ bölgesi / havza / su idaresi eşlemesini üretir.
//
// UYDURMA YASAĞI: hiçbir eşleme burada ÜRETİLMEZ. Tüm alanlar mevcut
// doğrulanmış JSON'lardan okunur; eksik alan "doğrulanmadı" olarak kalır.
// Çift bakım noktası yasak: il/kurum kuralları burada yaşar.
import suIslemleri from '../../data/kamu/su-islemleri.json';
import hangiKapi from '../../data/kamu/hangi-kapi.json';
import suBirimleri from '../../data/kamu/su-birimleri.json';
import ilKurum from '../../data/il-kurum.json';
import havzaVeri from '../../data/havza-veri.json';

const kurumById = Object.fromEntries((suBirimleri.kayitlar ?? []).map((k) => [k.id, k]));
const kapiById = Object.fromEntries((hangiKapi.satirlar ?? []).map((s) => [s.islem_id, s]));

/** Yetkili kurum id'sini okunur kurum nesnesine çevirir. */
export function kurumCoz(id) {
  const k = kurumById[id];
  if (!k) return { id, ad: id, kisaltma: null, url: null };
  return { id, ad: k.ad_resmi, kisaltma: k.kisaltma, url: k.kaynak_url ?? null, tur: k.tur };
}

// 20 işlem: su-islemleri + hangi-kapi + kurum çözümü.
export const ISLEMLER = (suIslemleri.islemler ?? []).map((i) => {
  const kapi = kapiById[i.id] ?? null;
  const kurumlar = (kapi?.yetkili_kurum_id ?? []).map(kurumCoz);
  return {
    id: i.id,
    ad: i.islem_adi,
    dayanak: i.dayanak,
    kaynak: i.kaynak,
    kurumlar,
    basvuruKanali: kapi?.basvuru_kanali ?? null,
    durum: kapi?.durum ?? 'belirsiz',
    ilgiliRehber: kapi?.ilgili_rehber ?? null,
    mevzuatDayanagi: kapi?.mevzuat_dayanagi ?? null,
  };
});

// İşlem durumunun okunur etiketi (hangi-kapi durum_degerleri).
export const DURUM_ETIKET = {
  dogrulandi: 'Yetki doğrulandı',
  dayanak_eksik: 'Dayanak eksik',
  birden_fazla_kurum: 'Birden fazla yetkili kurum',
  belirsiz: 'Yetki belirsiz',
};

// — İl → bölge / havza / su idaresi —
const ilBolge = {}; // il → [{no, merkez, kaynak}]
for (const [no, b] of Object.entries(ilKurum.dsiBolgeleri)) {
  for (const il of b.iller) {
    (ilBolge[il] = ilBolge[il] ?? []).push({ no, merkez: b.merkez, kaynak: b.kaynak });
  }
}
const havzaByNo = Object.fromEntries((havzaVeri.havzalar ?? []).map((h) => [h.no, h]));
const ilHavza = {}; // il → [{no, ad}]
for (const [no, h] of Object.entries(ilKurum.havzaIlleri)) {
  const ad = havzaByNo[no]?.ad ?? `Havza ${no}`;
  for (const il of h.iller) {
    (ilHavza[il] = ilHavza[il] ?? []).push({ no, ad, kaynak: h.kaynak });
  }
}

/** Bir ilin bölge + havza + su idaresi özeti (yoksa null alanlar korunur). */
export function ilMatrisi(il) {
  return {
    il,
    bolgeler: ilBolge[il] ?? [],
    havzalar: ilHavza[il] ?? [],
    suIdaresi: ilKurum.suIdareleri[il] ?? null,
  };
}

/** Tüm iller (alfabetik), su idaresi olan iller dahil. */
export function tumIller() {
  const set = new Set([...Object.keys(ilBolge), ...Object.keys(ilHavza), ...Object.keys(ilKurum.suIdareleri)]);
  return [...set].sort((a, b) => a.localeCompare(b, 'tr'));
}

/** DSİ yetkili işlemler (matriste il bölgesiyle birlikte gösterilir). */
export const DSI_ISLEMLERI = ISLEMLER.filter((i) => i.kurumlar.some((k) => k.id === 'dsi'));

export const KAYNAK_NOTU =
  'İşlem → kurum eşlemesi yalnız mevzuatta açıkça yazılan yetki atfından aktarılır; ' +
  'hukuki yorum yapılmaz. Başvuru kanalı mevzuatta açık değilse "kanal doğrulanmadı" yazar.';
