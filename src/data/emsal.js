// EMSAL KARARLAR — TEK MODÜL (DURAK 1 A-d, 10.10.2026).
// Dizinde yalnız resmî karar arama sunucusunda doğrulanan künyeler listelenir; doğrulanamayanlar ayrı,
// dizine kapalı sayfada gerekçesiyle durur. Durum: data/kamu/emsal-kararlar.json → resmi_dogrulama.
import emsal from '../../data/kamu/emsal-kararlar.json';

export const EMSAL_TUM = emsal.kararlar;
export const EMSAL_SERH = emsal.serh;
export const dogrulandiMi = (k) => k?.resmi_dogrulama?.durum === 'dogrulandi';
export const EMSAL_DOGRULANAN = EMSAL_TUM.filter(dogrulandiMi);
export const EMSAL_DOGRULANAMAYAN = EMSAL_TUM.filter((k) => !dogrulandiMi(k));
export const emsalById = Object.fromEntries(EMSAL_TUM.map((k) => [k.id, k]));
export const EMSAL_DOGRULAMA_TARIHI = '10.10.2026';

{
  const eksik = EMSAL_TUM.filter((k) => !k.resmi_dogrulama);
  if (eksik.length) throw new Error(`emsal: ${eksik.length} kaydın resmî doğrulama durumu yok.`);
  for (const k of EMSAL_DOGRULANAN) {
    if (!k.resmi_dogrulama.url || !k.resmi_dogrulama.karar_tarihi) throw new Error(`emsal: ${k.id} doğrulandı ama resmî bağlantı/karar tarihi eksik.`);
  }
}
