// DURAK 2 (brif 2.2): mevzuat maddesi dizin ölçütü ve kapatılan maddelerin tam listesi.
// Çıktı: rapor/olcum/mevzuat-dizin-listesi.md (ölçüt src/data/mevzuat-dizin.js'ten; elle yazılmaz).
import { readFileSync, writeFileSync } from 'node:fs';
import { maddeDizinKarari, SU_DUZENLEMELERI, SU_SOZCUKLERI } from '../src/data/mevzuat-dizin.js';
import { maddeIndekslenir } from '../src/data/mevzuat-metin.js';

const d = JSON.parse(readFileSync('data/kamu/mevzuat-maddeleri.json', 'utf8'));
const say = {};
const kapali = {};
for (const m of d.maddeler) {
  const k = maddeDizinKarari(m);
  const s = (say[m.kanunKisa] ??= { toplam: 0, onceAcik: 0, sonraAcik: 0, ad: m.kanun });
  s.toplam++;
  if (maddeIndekslenir(m)) s.onceAcik++;
  if (k.dizin) s.sonraAcik++;
  else (kapali[m.kanunKisa] ??= []).push({ madde: m.madde, baslik: m.baslik, neden: k.neden, yeni: maddeIndekslenir(m) });
}
const t = Object.values(say).reduce((a, s) => ({ toplam: a.toplam + s.toplam, once: a.once + s.onceAcik, sonra: a.sonra + s.sonraAcik }), { toplam: 0, once: 0, sonra: 0 });
let md = `# Mevzuat maddeleri — dizin ölçütü ve kapatılan maddeler (brif 2.2, ${new Date().toISOString().slice(0, 10)})\n\n`;
md += 'Sayfalar silinmez; kapatılan madde sayfası robots noindex alır ve site haritası ile llms.txt\'den düşer. Ölçüt kodda: src/data/mevzuat-dizin.js.\n\n';
md += '## Ölçüt\n1. Metin durumu: boş, yalnız mülga notu, kesik ya da yürürlük tablosu artığı taşıyan madde kapalı (önceden de kapalıydı).\n';
md += '2. Yalnız yürürlük ya da yürütme bildiren tek cümlelik madde kapalı (her düzenlemede).\n';
md += `3. Su konulu düzenlemelerin kalan maddeleri açık: ${[...SU_DUZENLEMELERI].join(', ')}.\n`;
md += `4. Genel kanunlarda (5393, 2886, 2942) madde yalnız şu durumda açık: metninde ya da başlığında su sözcüklerinden biri geçiyor (${SU_SOZCUKLERI.join(', ')}; * = ekli biçimler) ya da sitede bir rehber, emsal karar, karar alıntısı veya sayfa bu maddeye bağlanıyor. Diğerleri "su ile bağ yok".\n\n`;
md += `## Sayılar\nToplam ${t.toplam} madde · dizinlenebilir önce ${t.once} → sonra ${t.sonra} · bu turda kapanan ${t.once - t.sonra}\n\n| Düzenleme | Madde | Önce açık | Sonra açık |\n|---|---|---|---|\n`;
for (const [k, s] of Object.entries(say)) md += `| ${k} — ${s.ad} | ${s.toplam} | ${s.onceAcik} | ${s.sonraAcik} |\n`;
md += '\n## Kapatılan maddeler (bu turda kapananlar ★)\n';
for (const [k, l] of Object.entries(kapali)) {
  md += `\n### ${k} (${l.length})\n`;
  for (const x of l) md += `- ${x.yeni ? '★ ' : ''}${x.madde}${x.baslik ? ` — ${x.baslik}` : ''} · ${x.neden}\n`;
}
writeFileSync('rapor/olcum/mevzuat-dizin-listesi.md', md);
console.log(`dizinlenebilir madde: ${t.once} → ${t.sonra} (kapanan ${t.once - t.sonra}) · liste: rapor/olcum/mevzuat-dizin-listesi.md`);
