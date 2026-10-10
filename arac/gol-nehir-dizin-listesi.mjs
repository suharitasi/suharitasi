// DURAK 2 (brif 2.4): göl/nehir dizin eşiği ve kapatılan adreslerin listesi.
// Çıktı: rapor/olcum/gol-nehir-dizin-listesi.md (eşik src/data/gol-nehir.js'ten; elle yazılmaz).
import { writeFileSync } from 'node:fs';
import { tumGoller, tumNehirler, golDizinKarari, nehirDizinKarari, golDoluluk } from '../src/data/gol-nehir.js';
const g = tumGoller(), n = tumNehirler();
const ga = g.filter((x) => golDizinKarari(x).dizin), na = n.filter((x) => nehirDizinKarari(x).dizin);
let md = `# Göl ve nehir sayfaları — dizin eşiği (brif 2.4, ${new Date().toISOString().slice(0, 10)})\n\n`;
md += 'Sayfalar silinmez; eşiği geçmeyen sayfa robots noindex alır, site haritası ve llms.txt\'den düşer. 4.9 zenginleştirmesiyle veri eklenince eşik kendiliğinden yeniden uygulanır.\n\n';
md += '- Göl: bilinen adı + en az bir ek veri (koruma statüsü, baraj künyesi, doluluk). Bugün sitede koruma statüsü ve baraj künyesi verisi yok; doluluk yalnız EPİAŞ günlük kaydıyla ad kökü ve havza adı birlikte eşleşen göllerde.\n';
md += '- Nehir: en az iki ek veri (kaynak, döküldüğü yer, geçtiği iller, üzerindeki barajlar). Bugün sitede kaynak ve baraj verisi yok; döküldüğü yer (ya da kolu olduğu akarsu) ve geçtiği iller sayılır.\n\n';
md += `Sayılar: göl ${g.length} → açık ${ga.length}; nehir ${n.length} → açık ${na.length}.\n\n## Açık kalan göller (${ga.length})\n`;
md += ga.map((x) => `- /goller/${x.slug}/ — ${x.ad} (doluluk: ${golDoluluk(x).baraj})`).join('\n') + '\n';
md += `\n## Açık kalan nehirler (${na.length})\n` + na.map((x) => `- /nehirler/${x.slug}/ — ${x.ad}`).join('\n') + '\n';
md += `\n## Kapatılan göller (${g.length - ga.length})\n` + g.filter((x) => !golDizinKarari(x).dizin).map((x) => `- /goller/${x.slug}/ — ${x.ad}`).join('\n') + '\n';
md += `\n## Kapatılan nehirler (${n.length - na.length})\n` + n.filter((x) => !nehirDizinKarari(x).dizin).map((x) => `- /nehirler/${x.slug}/ — ${x.ad} · ${nehirDizinKarari(x).neden}`).join('\n') + '\n';
writeFileSync('rapor/olcum/gol-nehir-dizin-listesi.md', md);
console.log(`göl ${g.length}→${ga.length} · nehir ${n.length}→${na.length} · rapor/olcum/gol-nehir-dizin-listesi.md`);
