import { defineConfig } from 'astro/config';
import { readdir, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';

const SITE = 'https://suharitasi.com';

// dist'i tarayıp tüm index.html'lerden sitemap üretir; public'ten kopyalanan
// statik sayfalar (/, /harita/) da böylece otomatik dahil olur.
function sitemapOlustur() {
  return {
    name: 'sitemap-olustur',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const kok = fileURLToPath(dir);
        const urller = [];
        async function tara(dizin) {
          for (const giris of await readdir(dizin, { withFileTypes: true })) {
            const yol = join(dizin, giris.name);
            if (giris.isDirectory()) await tara(yol);
            else if (giris.name === 'index.html') {
              // noindex sayfalar (ör. /harita-pilot/) sitemap dışı kalır
              const html = await readFile(yol, 'utf8');
              if (/name=["']robots["'][^>]*noindex/i.test(html)) continue;
              const gorece = relative(kok, dizin).split('\\').join('/');
              urller.push(gorece === '' ? `${SITE}/` : `${SITE}/${gorece}/`);
            }
          }
        }
        await tara(kok);
        urller.sort();
        const bugun = new Date().toISOString().slice(0, 10);
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          urller.map((u) =>
            `  <url>\n    <loc>${u}</loc>\n    <lastmod>${bugun}</lastmod>\n  </url>`
          ).join('\n') +
          `\n</urlset>\n`;
        await writeFile(join(kok, 'sitemap.xml'), xml, 'utf8');
        logger.info(`sitemap.xml: ${urller.length} sayfa`);
      },
    },
  };
}

// SÜRÜM DAMGASI (2026-07-23) — sağlık sistemi "hangi sürüm yayında" sorusunu
// tahminle değil ölçümle cevaplasın diye her build'e commit sha'sı gömülür.
// Cloudflare Pages CF_PAGES_COMMIT_SHA verir; yerelde git'ten okunur.
// Bu olmadan deploy sonrası ölçüm ESKİ sürümü ölçüp "düzeldi" diyebilirdi.
function surumDamgasi() {
  return {
    name: 'surum-damgasi',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        let commit = process.env.CF_PAGES_COMMIT_SHA || '';
        if (!commit) {
          try {
            const { execSync } = await import('node:child_process');
            commit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
          } catch (e) {
            commit = 'bilinmiyor';
            logger.warn(`sürüm damgası: git okunamadı (${e.message})`);
          }
        }
        const govde = {
          commit,
          kisa: commit.slice(0, 7),
          zaman: new Date().toISOString(),
          dal: process.env.CF_PAGES_BRANCH || 'yerel',
        };
        await writeFile(join(fileURLToPath(dir), 'surum.json'),
          JSON.stringify(govde, null, 2) + '\n', 'utf8');
        logger.info(`surum.json: ${govde.kisa}`);
      },
    },
  };
}

// llms.txt: AI istemcileri için sitenin makine-okunur içindekiler dosyası.
// İçerik dist'ten üretilir (title + meta description) — elle yazılmış metin
// yok, dolayısıyla bayatlamaz. Sitemap dışı (noindex) sayfalar hariç.
function llmsOlustur() {
  const BOLUM = [
    ['rehberler/', 'Mevzuat rehberleri'],
    ['havzalar/', 'Havzalar (25 havza)'],
    ['kuyu-ruhsati/', 'Kuyu ruhsatında il bazında yetkili kurum (81 il)'],
    ['durumum/', 'Sektöre göre su hukuku durumu'],
    ['su-kanunu/', 'Su Kanunu ve mevzuat kütüphanesi'],
    ['vaka/', 'Vaka incelemeleri'],
    ['arac/', 'Araçlar'],
  ];
  return {
    name: 'llms-olustur',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const kok = fileURLToPath(dir);
        const sayfalar = [];
        async function tara(dizin) {
          for (const giris of await readdir(dizin, { withFileTypes: true })) {
            const yol = join(dizin, giris.name);
            if (giris.isDirectory()) await tara(yol);
            else if (giris.name === 'index.html') {
              const html = await readFile(yol, 'utf8');
              if (/name=["']robots["'][^>]*noindex/i.test(html)) continue;
              const gorece = relative(kok, dizin).split('\\').join('/');
              const t = html.match(/<title>([\s\S]*?)<\/title>/i);
              const d = html.match(/<meta\s+name=["']description["']\s+content=(["'])((?:(?!\1).)*)\1/i);
              if (!t) throw new Error(`llms.txt: ${gorece || '/'} sayfasında <title> yok.`);
              sayfalar.push({
                yol: gorece === '' ? '/' : `/${gorece}/`,
                baslik: t[1].replace(/\s*—\s*Su Haritası\s*$/, '').replace(/&#39;/g, "'").replace(/&amp;/g, '&').trim(),
                aciklama: (d ? d[2] : '').replace(/&#39;/g, "'").replace(/&amp;/g, '&').trim(),
              });
            }
          }
        }
        await tara(kok);
        sayfalar.sort((a, b) => a.yol.localeCompare(b.yol));
        const ana = sayfalar.find((x) => x.yol === '/');
        if (!ana) throw new Error('llms.txt: ana sayfa bulunamadı.');
        const satir = (x) => `- [${x.baslik}](${SITE}${x.yol})${x.aciklama ? `: ${x.aciklama}` : ''}`;
        const kullanilan = new Set(['/']);
        let metin = `# Su Haritası\n\n> ${ana.aciklama}\n\n`;
        metin += `Kaynak: ${SITE}/ · Hukuki içerik: Av. Serdar Arslan (Arslan Hukuk Bürosu).\n`;
        metin += `Tam URL listesi: ${SITE}/sitemap.xml\n\n`;
        for (const [onek, ad] of BOLUM) {
          const grup = sayfalar.filter((x) => x.yol.startsWith(`/${onek}`));
          if (!grup.length) continue;
          grup.forEach((x) => kullanilan.add(x.yol));
          metin += `## ${ad}\n\n${grup.map(satir).join('\n')}\n\n`;
        }
        const kalan = sayfalar.filter((x) => !kullanilan.has(x.yol));
        if (kalan.length) metin += `## Diğer sayfalar\n\n${kalan.map(satir).join('\n')}\n\n`;
        await writeFile(join(kok, 'llms.txt'), metin, 'utf8');
        logger.info(`llms.txt: ${sayfalar.length} sayfa`);
      },
    },
  };
}

export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  integrations: [sitemapOlustur(), llmsOlustur(), surumDamgasi()],
});
