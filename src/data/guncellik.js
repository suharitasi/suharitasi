/* GÖRÜNÜR GÜNCELLİK DAMGASI — veri tarih kaynağı (kalanlar paketi madde 1,
 * 2026-08-25; dayanak: eeat-audit №1 + C5 №5).
 *
 * KURAL (CLAUDE.md uydurma yasağı): buradaki her tarih, sayfanın dayandığı
 * VERİ KAYDININ KENDİ İÇİNDEN okunur (künye/uretim_tarihi/sonGuncelleme).
 * "Bugün" / build saati ÜRETİLMEZ — build tarihi damga DEĞİLDİR (her
 * deploy'da damganın oynaması sahte tazelik sinyali olur). Tarihi
 * okunamayan kaynak null döner ve o sayfada damga BASILMAZ.
 *
 * Görünür desen SayfaBasi'nın MEVCUT künye satırıdır (tarih prop'u);
 * yeni desen icat edilmez. Şemada karşılığı dateModified'dir.
 */
import { readFileSync } from 'node:fs';
import { GOLNEHIR_ERISIM } from './gol-nehir.js';

const oku = (y) => JSON.parse(readFileSync(y, 'utf8'));

/** YYYY-MM-DD biçim denetimi; geçmeyen değer damga olamaz (null). */
const iso = (t) => (typeof t === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : null);

/** Verilen ISO tarihlerin en yenisi; hiçbiri geçerli değilse null. */
export function enYeni(...tarihler) {
  const gecerli = tarihler.map(iso).filter(Boolean);
  return gecerli.length ? gecerli.sort().at(-1) : null;
}

/** gg.aa.yyyy — kayıtlı künye biçimi (HavzaYasBandi ile aynı). */
export function trTarih(isoTarih) {
  const t = iso(isoTarih);
  if (!t) return null;
  const [y, a, g] = t.split('-');
  return `${g}.${a}.${y}`;
}

// ── Kaynak tarihleri (hepsi veri dosyasının KENDİ künyesinden) ──

const baraj = oku('data/canli/baraj.json');
const grace = oku('data/canli/grace-turkiye.json');
const havzaVeri = oku('data/havza-veri.json');
const persona = oku('data/lead/persona.json');
const ilceMorfoloji = oku('veri/potansiyel/ilce-morfoloji.json');
const rgDurum = oku('izleme/state/rg-nobetci-durum.json');
const mevzuatSurum = oku('data/kamu/mevzuat-surum.json');
const mevzuatMaddeleri = oku('data/kamu/mevzuat-maddeleri.json');
const mevzuatDegisiklik = oku('data/kamu/mevzuat-degisiklik.json');
const emsalKararlar = oku('data/kamu/emsal-kararlar.json');
const RG_ARSIV_DOSYALAR = [
  'veri/potansiyel/isletme-sahalari.json',
  'veri/potansiyel/isletme-sahalari-ek.json',
  'veri/potansiyel/isletme-sahalari-v2.json',
];

/** İl sayfalarının dayandığı potansiyel derlemeleri (il-profil.js kümesi). */
const POTANSIYEL_DOSYALAR = [
  'veri/potansiyel/zenginlestirme.json',
  'veri/potansiyel/kutle-il.json',
  'veri/potansiyel/morfoloji.json',
  'veri/potansiyel/akademik-kunye.json',
  'veri/potansiyel/mta-katalog.json',
  'veri/potansiyel/isletme-sahalari.json',
  'veri/potansiyel/isletme-sahalari-ek.json',
  'veri/potansiyel/isletme-sahalari-v2.json',
];

export const TARIH = {
  /** EPİAŞ günlük çekiminin künyedeki son güncelleme günü. */
  baraj: iso(baraj?.kunye?.sonGuncelleme),
  /** GRACE türetiminin işleme tarihi (seri en son bu gün yeniden üretildi). */
  grace: iso(grace?.kunye?.islemeTarihi),
  /** DSİ/SYGM havza künyelerinin en yeni indirme/doğrulama tarihi. */
  havzaVeri: enYeni(
    ...Object.values(havzaVeri?.kaynaklar ?? {}).flatMap((k) => [
      k?.indirmeTarihi,
      k?.dogrulamaTarihi,
    ]),
  ),
  /** İl potansiyel derlemelerinin en yeni uretim_tarihi'si. */
  potansiyel: enYeni(
    ...POTANSIYEL_DOSYALAR.map((y) => {
      try { return oku(y)?.uretim_tarihi; } catch { return null; }
    }),
  ),
  /** Göl/nehir OSM çekim tarihi (gol-nehir.js künyesi, gg.aa.yyyy → ISO). */
  golNehir: iso(GOLNEHIR_ERISIM.split('.').reverse().join('-')),
  /** Persona/sektör veri temelinin kayıt tarihi. */
  persona: iso(persona?.kayitTarihi),
  /** İlçe morfoloji türetiminin üretim tarihi. */
  ilceMorfoloji: iso(ilceMorfoloji?.kunye?.uretim_tarihi),
  /** RG işletme-sahası arşivinin son nöbetçi taraması (gün). */
  rgTarama: iso((rgDurum?.son_kosum ?? '').slice(0, 10)),
  /** Mevzuat metninin VERİ tarihi (07.10.2026 denetimi): madde verisinin oluşturma
   *  günü ile radarın kaydettiği son gerçek madde değişikliği ("degisti/eklendi/
   *  kaldirildi") arasındaki en yenisi. Radarın her kontrol günü (son_kontrol)
   *  damga DEĞİLDİR — içerik değişmeden lastmod ilerliyordu (sahte tazelik;
   *  469 sayfa her taramada IndexNow'a yeniden bildiriliyordu). */
  mevzuat: enYeni(
    mevzuatMaddeleri?.olusturma,
    mevzuatMaddeleri?.duzeltme,
    ...(mevzuatDegisiklik?.kayitlar ?? []).map((k) => String(k?.tarih ?? '').slice(0, 10)),
  ),
  /** Radarın son kontrol günü — yalnız "en son ne zaman kontrol edildi" metni için. */
  mevzuatKontrol: iso(String(mevzuatSurum?.son_kontrol ?? '').slice(0, 10)),
  /** RG işletme-sahası arşivinin derleme (veri) tarihi — en yeni dosya. */
  rgArsiv: enYeni(
    ...RG_ARSIV_DOSYALAR.map((y) => {
      try { return oku(y)?.uretim_tarihi; } catch { return null; }
    }),
  ),
  /** Emsal karar veritabanının oluşturma tarihi (P3, 05.10.2026). */
  emsal: iso(emsalKararlar?.olusturma),
};
