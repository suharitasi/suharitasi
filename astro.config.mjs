import { defineConfig } from 'astro/config';
import { readdir, writeFile } from 'node:fs/promises';
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

export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  integrations: [sitemapOlustur()],
});
