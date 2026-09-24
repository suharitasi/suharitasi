/* dist'i CLOUDFLARE GİBİ servis eden yerel sunucu (denetim için).
   Neden: `python3 -m http.server` _headers'ı UYGULAMAZ; CSP'siz ölçüm canlıyı
   temsil etmez — nitekim 23.07 arızası (media-src eksikliği) yalnız canlıda
   görünüyordu. Bu sunucu dist/_headers'taki `/*` bloğunu ve dist/_redirects'teki
   tam-yol kurallarını uygular.
   Kullanım: node arac/dist-sun.mjs [port] [kokDizini]
   kokDizini verilmezse <proje>/dist. --test senaryoları sanal bir dizini
   servis edebilsin diye parametrelidir.
   NOT: _headers ve _redirects HER İSTEKTE yeniden okunur — senaryo dosyayı
   değiştirince sunucuyu yeniden başlatmak gerekmesin (dosyalar birkaç satır). */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';

const PORT = Number(process.argv[2] || 5197);
const KOK = process.argv[3] || '/home/suha/projeler/suharitasi/dist';

// — _headers: `/*` + eşleşen yol blokları (Cloudflare semantiği) —
// Önceden yalnız `/*` bloğu uygulanıyordu; `/veri/*.json` gibi yola özgü
// bloklar (ör. Content-Disposition: attachment) yerel ölçümde GÖRÜNMÜYORDU.
// Artık tüm bloklar okunur; eşleşenler dosya sırasına göre uygulanır (sonraki
// blok öncekini ezer), böylece dist-sun canlıyı daha sadık temsil eder.
function desenEsles(desen, yol) {
  if (desen === '/*') return true;
  const re = new RegExp('^' + desen.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
  return re.test(yol);
}

function baslikOku(yol = '/') {
  const sonuc = {};
  if (!existsSync(join(KOK, '_headers'))) return sonuc;
  const bloklar = [];
  let desen = null;
  let blok = {};
  for (const satir of readFileSync(join(KOK, '_headers'), 'utf8').split('\n')) {
    if (satir.startsWith('#')) continue;
    if (satir.trim() === '') { if (desen) { bloklar.push([desen, blok]); desen = null; blok = {}; } continue; }
    if (!/^[ \t]/.test(satir)) { if (desen) bloklar.push([desen, blok]); desen = satir.trim(); blok = {}; continue; }
    if (!desen) continue;
    const i = satir.indexOf(':');
    if (i > 0) blok[satir.slice(0, i).trim()] = satir.slice(i + 1).trim();
  }
  if (desen) bloklar.push([desen, blok]);
  for (const [d, b] of bloklar) if (desenEsles(d, yol)) Object.assign(sonuc, b);
  return sonuc;
}

// — _redirects: tam-yol kuralları —
function yonlendirmeOku() {
  const yonlendirme = new Map();
  if (!existsSync(join(KOK, '_redirects'))) return yonlendirme;
  for (const satir of readFileSync(join(KOK, '_redirects'), 'utf8').split('\n')) {
    if (satir.startsWith('#') || satir.trim() === '') continue;
    const [kaynak, hedef, kod] = satir.trim().split(/\s+/);
    if (kaynak && hedef) yonlendirme.set(kaynak, { hedef, kod: Number(kod || 302) });
  }
  return yonlendirme;
}

const TUR = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.xml': 'application/xml',
  '.xsl': 'text/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2',
};

createServer(async (istek, cevap) => {
  const yol = decodeURIComponent(new URL(istek.url, 'http://x').pathname);
  for (const [ad, deger] of Object.entries(baslikOku(yol))) cevap.setHeader(ad, deger);

  const y = yonlendirmeOku().get(yol);
  if (y) { cevap.writeHead(y.kod, { Location: y.hedef }); cevap.end(); return; }

  let dosya = join(KOK, normalize(yol).replace(/^(\.\.[/\\])+/, ''));
  try {
    const bilgi = await stat(dosya);
    if (bilgi.isDirectory()) dosya = join(dosya, 'index.html');
  } catch {
    // Dizin/dosya yoksa Astro'nun klasör-index düzeni denenir; yoksa 404.
    if (!existsSync(dosya)) dosya = join(dosya, 'index.html');
  }
  try {
    const govde = await readFile(dosya);
    cevap.writeHead(200, { 'Content-Type': TUR[extname(dosya)] || 'application/octet-stream' });
    cevap.end(govde);
  } catch {
    /* 404'te Cloudflare Pages gibi davran (M11, 29.07.2026): Pages,
       bulunamayan yolda dist/404.html'i 404 durumuyla SUNAR. Bu sunucu
       düz metin "404" döndürüyordu — yani 404 sayfasının markalı olup
       olmadığı YERELDE ÖLÇÜLEMİYORDU ve ölçüm aracı canlıyı temsil
       etmiyordu (CLAUDE.md "canlı koşul ilkesi"). Dosya yoksa eski
       davranışa düşülür; sessizce yanlış 200 dönmez. */
    try {
      const ozel = await readFile(join(KOK, '404.html'));
      cevap.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      cevap.end(ozel);
    } catch {
      cevap.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      cevap.end('404');
    }
  }
}).listen(PORT, "127.0.0.1", () => console.log(`${KOK} -> http://127.0.0.1:${PORT}/ (CSP + _redirects uygulanıyor)`));
