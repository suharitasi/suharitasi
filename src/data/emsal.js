// EMSAL KARARLAR — TEK MODÜL (DURAK 1 A-d + brif 4.4, 10.10.2026).
// Dizinde, karar sayfalarında, /veri/emsal.json'da, MCP'de, uyum dosyasında ve llms-full.txt'de
// yalnız resmî karar arama sunucusunda doğrulanan künyeler yer alır; doğrulanamayanlar ayrı,
// dizine kapalı sayfada gerekçesiyle durur. Durum: data/kamu/emsal-kararlar.json → resmi_dogrulama.
// Karar sayfasındaki alıntılar resmî metinden birebir kesilir: data/kamu/emsal-alinti.json
// (arac/emsal-alinti-uret.py). Dosyalar cwd'den okunur; modül astro.config.mjs'ten de kullanılır.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const oku = (yol) => JSON.parse(readFileSync(join(process.cwd(), yol), 'utf8'));
const emsal = oku('data/kamu/emsal-kararlar.json');
const alinti = oku('data/kamu/emsal-alinti.json');
const mevzuat = oku('data/kamu/mevzuat-maddeleri.json');

export const EMSAL_TUM = emsal.kararlar;
export const EMSAL_SERH = emsal.serh;
export const dogrulandiMi = (k) => k?.resmi_dogrulama?.durum === 'dogrulandi';
export const EMSAL_DOGRULANAN = EMSAL_TUM.filter(dogrulandiMi);
export const EMSAL_DOGRULANAMAYAN = EMSAL_TUM.filter((k) => !dogrulandiMi(k));
export const emsalById = Object.fromEntries(EMSAL_TUM.map((k) => [k.id, k]));
export const EMSAL_DOGRULAMA_TARIHI = '10.10.2026';
export const EMSAL_ALINTI_ERISIM = alinti.erisim.split('-').reverse().join('.');

export const slugla = (s) =>
  String(s).toLowerCase().replace(/ı/g, 'i').replace(/i̇/g, 'i').replace(/İ/g, 'i').replace(/ş/g, 's')
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const mahkemeAdi = (k) => (k.id.startsWith('yargitay') ? 'Yargıtay' : 'Danıştay');
export const daireAdi = (k) => k.merci.replace(/^(Danıştay|Yargıtay)\s+/, '');
export const tamMerci = (k) => `${mahkemeAdi(k)} ${daireAdi(k)}`;
export const kunyeKisa = (k) => `${tamMerci(k)} ${k.esas} E., ${k.karar} K.`;
export const emsalSlug = (k) => slugla(`${tamMerci(k)} ${k.esas} ${k.karar}`);
export const emsalYol = (k) => `/emsal-kararlar/${emsalSlug(k)}/`;
export const kararTarihiIso = (k) => k.resmi_dogrulama.karar_tarihi.split('.').reverse().join('-');

export const maddeYol = (kanunKisa, madde) => `/mevzuat/${slugla(kanunKisa)}/${slugla(madde)}/`;
const maddeAd = (kanunKisa, madde) => `${kanunKisa} ${madde}`;
const maddeVar = new Set(mevzuat.maddeler.map((m) => `${m.kanunKisa}|${m.madde}`));

// Sitede karara bağlanmış maddeler (mevzuat-maddeleri.json → emsaller) — editoryal bağ.
export const MADDE_BY_EMSAL = {};
for (const m of mevzuat.maddeler) {
  for (const eid of m.emsaller ?? []) {
    (MADDE_BY_EMSAL[eid] ??= []).push({ ad: maddeAd(m.kanunKisa, m.madde), yol: maddeYol(m.kanunKisa, m.madde) });
  }
}

// Alıntı parçalarını tek metne çevirir; atlanan kısım "[…]" ile gösterilir.
export const alintiMetni = (parcalar = []) =>
  parcalar.map((p) => `${p.bas_kesik ? '[…] ' : ''}${p.metin}${p.son_kesik ? ' […]' : ''}`).join(' ');

export function emsalAlinti(k) {
  const a = alinti.kararlar[k.id];
  if (!a) return null;
  return {
    uyusmazlik: a.uyusmazlik,
    gerekce: a.gerekce,
    sonuc: a.sonuc,
    uyusmazlikBolum: a.uyusmazlik_bolum,
    gerekceBolum: a.gerekce_bolum,
    sonucBolum: a.sonuc_bolum,
    anilanMaddeler: a.anilan_maddeler
      .filter((m) => maddeVar.has(`${m.kanun}|${m.madde}`))
      .map((m) => ({ ad: maddeAd(m.kanun, m.madde), yol: maddeYol(m.kanun, m.madde) })),
  };
}

// Dışarıya verilen kayıt biçimi (/veri/emsal.json, MCP emsal_sorgu, llms-full.txt, uyum dosyası).
export const emsalYayinKaydi = (k, site = '') => {
  const a = emsalAlinti(k);
  return {
    id: k.id,
    mahkeme: mahkemeAdi(k),
    merci: tamMerci(k),
    esas: k.esas,
    karar: k.karar,
    karar_tarihi: k.resmi_dogrulama.karar_tarihi,
    yil: k.yil,
    konu: k.konu,
    ozet: a ? alintiMetni(a.uyusmazlik) : '',
    ozet_turu: 'karar metninden birebir alıntı (dava konusu)',
    kaynak: k.resmi_dogrulama.url,
    sayfa: `${site}${emsalYol(k)}`,
    rehberler: k.rehberler ?? [],
    resmi_dogrulama: { tarih: k.resmi_dogrulama.tarih, sunucu: k.resmi_dogrulama.sunucu },
  };
};
export const EMSAL_YAYIN = (site = '') => EMSAL_DOGRULANAN.map((k) => emsalYayinKaydi(k, site));

{
  const eksik = EMSAL_TUM.filter((k) => !k.resmi_dogrulama);
  if (eksik.length) throw new Error(`emsal: ${eksik.length} kaydın resmî doğrulama durumu yok.`);
  for (const k of EMSAL_DOGRULANAN) {
    if (!k.resmi_dogrulama.url || !/^\d{2}\.\d{2}\.\d{4}$/.test(k.resmi_dogrulama.karar_tarihi || '')) {
      throw new Error(`emsal: ${k.id} doğrulandı ama resmî bağlantı/karar tarihi eksik.`);
    }
  }
  const sluglar = EMSAL_DOGRULANAN.map(emsalSlug);
  if (new Set(sluglar).size !== sluglar.length) throw new Error('emsal: karar sayfası adresleri çakışıyor.');
  for (const id of Object.keys(alinti.kararlar)) {
    if (!dogrulandiMi(emsalById[id])) throw new Error(`emsal: ${id} için alıntı var ama künye doğrulanmamış.`);
  }
}
