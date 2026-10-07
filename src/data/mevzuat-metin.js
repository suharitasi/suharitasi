// MEVZUAT MADDE METNİ YARDIMCILARI (07.10.2026 denetimi, sahip kararı EK-2/1).
// Saf fonksiyonlar: başlık/açıklama/öz-cevap üretimi ve dizin kararı tek yerden.
// Metin ÜRETİLMEZ; yalnız kaynak kaydındaki alanlar kırpılır ve sınıflanır.

/** Kanun kısa adı → <title> için okunur kısa ad (resmî adın kısaltması). */
export const KANUN_KISA_AD = {
  '167': '167 Sayılı Yeraltı Suları Kanunu',
  'YAS Tüzüğü': 'Yeraltı Suları Tüzüğü',
  'Su Tahsisleri Yön.': 'Su Tahsisleri Yönetmeliği',
  '2942': '2942 Sayılı Kamulaştırma Kanunu',
  '2886': '2886 Sayılı Devlet İhale Kanunu',
  '831': '831 Sayılı Sular Hakkında Kanun',
  '5686': '5686 Sayılı Jeotermal Kaynaklar Kanunu',
  '5393': '5393 Sayılı Belediye Kanunu',
  '6200': '6200 Sayılı DSİ Kanunu',
};

export const TITLE_SINIR = 60;
export const OZ_CEVAP_SINIR = 280;

const SON_NOKTA = /[.;!?)\]"”’»]\s*$/;
const MULGA_YALNIZ = /^\(\s*(?:Ek:[^()]*;\s*)?Mülga[^()]*\)(?:\s*\(\s*Mülga[^()]*\))?\s*$/i;
const TABLO_KIRI = /\d{1,2}\/\d{1,2}\/\d{4}\s+\d{3,5}\s+\d/;
const SAYILI_KUYRUK = /\b\d{3,4}\s+SAYILI\s*$/;

/** Metni kelime sınırında, en çok `enCok` karaktere kırpar; kırpıldıysa "…" ekler. */
export function kelimeSinirindaKes(metin, enCok) {
  const t = String(metin ?? '').replace(/\s+/g, ' ').trim();
  if (t.length <= enCok) return t;
  const parca = t.slice(0, enCok - 1).replace(/\s+\S*$/u, '').replace(/[\s,;:(–—-]+$/u, '');
  return `${parca}…`;
}

/** Madde metninin durumu: bos · mulgaYalniz · kesik · kirli (yürürlük tablosu artığı). */
export function metinDurumu(metin) {
  const t = String(metin ?? '').trim();
  const bos = t.length === 0;
  const mulgaYalniz = !bos && MULGA_YALNIZ.test(t);
  const kirli = !bos && (TABLO_KIRI.test(t) || SAYILI_KUYRUK.test(t));
  const kesik = !bos && !mulgaYalniz && !SON_NOKTA.test(t);
  return { bos, mulgaYalniz, kesik, kirli };
}

/** Sayfa dizine açık mı? Gövdesi olmayan (boş / yalnız mülga notu), kesik ya da
 *  tablo artığı taşıyan madde noindex alır; metin tamamlanınca kural kendiliğinden
 *  sayfayı yeniden açar (sahip kararı EK-2/1c). */
export function maddeIndekslenir(m) {
  const d = metinDurumu(m?.metin);
  return !(d.bos || d.mulgaYalniz || d.kesik || d.kirli);
}

/** <title>: kanun adını içeren ilk ≤60 karakterlik aday. Editoryal seoBaslik öncelikli. */
export function maddeTarayiciBaslik(m, editoryal = null) {
  if (editoryal?.seoBaslik && editoryal.seoBaslik.length <= TITLE_SINIR) return editoryal.seoBaslik;
  const kisa = KANUN_KISA_AD[m.kanunKisa] ?? m.kanun ?? m.kanunKisa;
  const adaylar = [
    m.baslik ? `${kisa} ${m.madde}: ${m.baslik}` : null,
    `${kisa} ${m.madde}`,
    `${m.kanun} ${m.madde}`,
    `${m.kanunKisa} ${m.madde}`,
  ].filter(Boolean);
  return adaylar.find((a) => a.length <= TITLE_SINIR) ?? `${m.kanunKisa} ${m.madde}`;
}

/** Meta açıklama HAM metni: kanun + madde (+ başlık) + resmî metin. Kırpımı
 *  Sayfa.astro'nun merkezî cümle/kelime sınırı kuralı yapar (kelime ortası yok). */
export function maddeAciklama(m) {
  const bas = `${m.kanun} ${m.madde}${m.baslik ? ` (${m.baslik})` : ''}`;
  const t = String(m.metin ?? '').replace(/\s+/g, ' ').trim();
  return t ? `${bas}: ${t}` : `${bas}. Resmî madde metni ve ilgili rehberler Su Haritası mevzuat motorunda.`;
}

/** Öz-cevap (≤280): maddenin kendi resmî metninden, kelime sınırında. */
export function maddeOzCevap(m) {
  return kelimeSinirindaKes(maddeAciklama(m), OZ_CEVAP_SINIR);
}
