// MEVZUAT MADDESİ DİZİN ÖLÇÜTÜ — brif 2.2 (10.10.2026). Sayfa silinmez; yalnız robots
// noindex alır, site haritası ve llms.txt üreticileri sayfayı atlar.
// Ölçüt (sırayla):
//  1. Metin durumu (mevzuat-metin.js): boş, yalnız mülga notu, kesik ya da yürürlük tablosu
//     artığı taşıyan madde kapalı.
//  2. Yalnız yürürlük ya da yürütme bildiren tek cümlelik madde kapalı (her düzenlemede).
//  3. Su konulu düzenlemelerin (167, 5686, 6200, 831, YAS Tüzüğü, Su Tahsisleri Yönetmeliği)
//     kalan maddeleri açık.
//  4. Genel kanunlarda (5393, 2886, 2942) madde açık kalır ancak: metninde ya da başlığında su
//     sözcüklerinden biri geçiyorsa, ya da sitede bir rehber, emsal karar, karar alıntısı ya da
//     sayfa bu maddeye bağlanıyorsa. Diğerleri "su ile bağ yok" gerekçesiyle kapalı.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { maddeIndekslenir, metinDurumu } from './mevzuat-metin.js';

export const SU_DUZENLEMELERI = new Set(['167', '5686', '6200', '831', 'YAS Tüzüğü', 'Su Tahsisleri Yön.']);
export const SU_SOZCUKLERI = [
  'su', 'suyu', 'suyun', 'suya', 'sudan', 'sular', 'suları', 'suların', 'sulara', 'sulama*', 'sulak*',
  'içme suyu*', 'içmesuyu*', 'atık su*', 'atıksu*', 'kanalizasyon*', 'baraj*', 'gölet*', 'göl', 'gölü', 'gölün',
  'göller*', 'dere', 'dereler*', 'akarsu*', 'ırmak*', 'nehir*', 'havza*', 'taşkın*', 'yeraltı*', 'yer altı*',
  'kuyu*', 'devlet su işleri*', 'dsi*', 'jeotermal*', 'mineralli*', 'kıyı*', 'arıtma*',
];
const kalip = SU_SOZCUKLERI.map((s) => s.endsWith('*') ? `${s.slice(0, -1)}\\p{L}*` : s).join('|');
const SU_RE = new RegExp(`(?<![\\p{L}\\p{N}])(?:${kalip})(?![\\p{L}\\p{N}])`, 'u');
export const suSozcuguVar = (s) => SU_RE.test(String(s ?? '').toLocaleLowerCase('tr'));

const YURURLUK_RE = /(yürürlüğe girer|yürütür|yürütülür)\.?\s*$/u;
export function yururlukMaddesi(m) {
  const t = String(m?.metin ?? '').trim();
  return t.length > 0 && t.length < 260 && (t.match(/\./g) ?? []).length <= 1 && YURURLUK_RE.test(t) && !suSozcuguVar(t);
}

const slugla = (s) =>
  String(s).toLocaleLowerCase('tr').replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u')
    .replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Sitede bir maddeye verilen bağlar: rehber/sayfa/veri dosyalarındaki /mevzuat/<kanun>/<madde>/ adresleri
// ve emsal karar alıntılarında anılan maddeler.
function siteBaglari() {
  const kok = process.cwd();
  const bag = new Set();
  const tara = (dizin, uzantilar) => {
    for (const f of readdirSync(join(kok, dizin), { recursive: true })) {
      if (!uzantilar.some((u) => String(f).endsWith(u))) continue;
      const t = readFileSync(join(kok, dizin, String(f)), 'utf8');
      for (const m of t.matchAll(/\/mevzuat\/([a-z0-9-]+)\/((?:ek-|gecici-)?madde-[0-9a-z-]+)\//g)) bag.add(`${m[1]}/${m[2]}`);
    }
  };
  tara('src/content', ['.md']);
  tara('src/pages', ['.astro']);
  tara('src/data', ['.js', '.json']);
  const alinti = JSON.parse(readFileSync(join(kok, 'data/kamu/emsal-alinti.json'), 'utf8'));
  for (const k of Object.values(alinti.kararlar)) for (const m of k.anilan_maddeler) bag.add(`${slugla(m.kanun)}/${slugla(m.madde)}`);
  return bag;
}
const BAGLAR = siteBaglari();

export function maddeDizinKarari(m) {
  const d = metinDurumu(m.metin);
  if (!maddeIndekslenir(m)) {
    const neden = d.bos ? 'metin yok' : d.mulgaYalniz ? 'yalnız mülga notu' : d.kesik ? 'metin kesik' : 'yürürlük tablosu artığı';
    return { dizin: false, neden };
  }
  if (yururlukMaddesi(m)) return { dizin: false, neden: 'yalnız yürürlük ya da yürütme bildiren tek cümle' };
  if (SU_DUZENLEMELERI.has(m.kanunKisa)) return { dizin: true, neden: 'su konulu düzenleme' };
  if (suSozcuguVar(m.metin) || suSozcuguVar(m.baslik)) return { dizin: true, neden: 'metinde ya da başlıkta su sözcüğü' };
  if ((m.rehberler ?? []).length || (m.emsaller ?? []).length || BAGLAR.has(`${slugla(m.kanunKisa)}/${slugla(m.madde)}`)) {
    return { dizin: true, neden: 'sitede rehber, emsal ya da sayfa bağı' };
  }
  return { dizin: false, neden: 'su ile bağ yok' };
}
