import { defineConfig } from 'astro/config';
import { readdir, writeFile, readFile, mkdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
// Normalizasyon TEK KAYNAK: src/data/ortak-normalize.js (src/data modülleriyle aynı).
import { kisitNormalize, islemJoin } from './src/data/ortak-normalize.js';

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
              // lastmod SAYFANIN KENDİ beyanından: JSON-LD dateModified alanı
              // guncellik.js üzerinden veri kaydı tarihini taşır (uydurma
              // yasağı: build günü basılmaz; tarihi belirsiz sayfada lastmod
              // hiç yazılmaz — indeks-bildirimi briefi Faz 3, 2026-08-25).
              const tarihler = [...html.matchAll(/"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})/g)]
                .map((m) => m[1]).sort();
              urller.push({
                loc: gorece === '' ? `${SITE}/` : `${SITE}/${gorece}/`,
                lastmod: tarihler.at(-1) ?? null,
              });
            }
          }
        }
        await tara(kok);
        // Eski davranışla birebir aynı sıra (kod-birimi sırası; locale değil).
        urller.sort((a, b) => (a.loc < b.loc ? -1 : a.loc > b.loc ? 1 : 0));
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          urller.map((u) =>
            `  <url>\n    <loc>${u.loc}</loc>\n` +
            (u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : '') +
            `  </url>`
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

// kisit.json: kısıt sorgu motoru için il-eşlemeli RG kayıtları (build-time).
// Kaynak: veri/potansiyel/isletme-sahalari*.json. Sınıflama ÜRETİLMEZ; yalnız
// gerçek RG ilanları (il, durum, tarih, resmî link) dışa aktarılır.
function kisitJsonOlustur() {
  return {
    name: 'kisit-json',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const kok = fileURLToPath(dir);
        const proje = fileURLToPath(new URL('.', import.meta.url));
        const oku = (p) => JSON.parse(readFileSync(join(proje, p), 'utf8'));
        const ana = oku('veri/potansiyel/isletme-sahalari.json');
        const ek = oku('veri/potansiyel/isletme-sahalari-ek.json');
        const kayitlar = kisitNormalize(ana.kayitlar, ek.kayitlar);
        await writeFile(join(kok, 'kisit.json'), JSON.stringify(kayitlar), 'utf8');
        logger.info(`kisit.json: ${kayitlar.length} RG kaydı`);
      },
    },
  };
}

// veri API: sitenin makine-okunur açık veri katmanı (dist/veri/*.json).
// AI ajanları ve geliştiriciler için kanonik kaynak. Kaynak JSON'lardan
// build anında türetilir; uydurma yok.
function veriApiOlustur() {
  return {
    name: 'veri-api',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const kok = fileURLToPath(dir);
        const proje = fileURLToPath(new URL('.', import.meta.url));
        const oku = (p) => JSON.parse(readFileSync(join(proje, p), 'utf8'));
        const veriDir = join(kok, 'veri');
        await mkdir(veriDir, { recursive: true });
        const yaz = (ad, veri) => writeFile(join(veriDir, ad), JSON.stringify(veri), 'utf8');

        const hv = oku('data/havza-veri.json');
        await yaz('havzalar.json', hv.havzalar.map((h) => ({
          no: h.no, ad: h.ad, yagisAlani_km2: h.yagisAlani_km2,
          yuzeysuyuPotansiyeli_km3: h.yuzeysuyuPotansiyeli_km3, yasBeslenimi_hm3: h.yasBeslenimi_hm3,
          yasIsletmeRezervi_hm3: h.yasIsletmeRezervi_hm3, yil: h.yuzeysuyuYili,
          nehirHavzasiYonetimPlani: h.nehirHavzasiYonetimPlani,
        })));

        const ilk = oku('data/il-kurum.json');
        const ilBolge = {}, ilHavza = {};
        for (const [no, b] of Object.entries(ilk.dsiBolgeleri)) for (const il of b.iller) (ilBolge[il] = ilBolge[il] || []).push({ no, merkez: b.merkez });
        const havzaByNo = Object.fromEntries(hv.havzalar.map((h) => [h.no, h.ad]));
        for (const [no, h] of Object.entries(ilk.havzaIlleri)) for (const il of h.iller) (ilHavza[il] = ilHavza[il] || []).push(havzaByNo[no] || no);
        const iller = Object.keys({ ...ilBolge, ...ilHavza, ...ilk.suIdareleri }).sort((a, b) => a.localeCompare(b, 'tr'))
          .map((il) => ({ il, dsiBolgeleri: ilBolge[il] || [], havzalar: ilHavza[il] || [], suIdaresi: ilk.suIdareleri[il] || null }));
        await yaz('iller.json', iller);

        const si = oku('data/kamu/su-islemleri.json'), hk = oku('data/kamu/hangi-kapi.json'), sb = oku('data/kamu/su-birimleri.json');
        await yaz('islemler.json', islemJoin(si.islemler, hk.satirlar, sb.kayitlar));

        const mv = oku('data/kamu/mevzuat-maddeleri.json');
        await yaz('mevzuat.json', mv.maddeler.map((m) => ({
          kanunKisa: m.kanunKisa, kanun: m.kanun, tur: m.tur, madde: m.madde, metin: m.metin,
          kaynak: m.kaynakUrl, merci: m.merci || null, sure: m.sure || null, yorum: m.yorum || null,
        })));
        await yaz('emsal.json', oku('data/kamu/emsal-kararlar.json').kararlar);
        await yaz('sozluk.json', oku('data/kamu/su-terim-havuzu.json').terimler);
        await yaz('mevzuat-surum.json', oku('data/kamu/mevzuat-surum.json'));
        logger.info('veri API: havzalar · iller · islemler · mevzuat · emsal · sozluk');
      },
    },
  };
}

// arama.json: statik site içi arama indeksi. dist'ten üretilir (title +
// meta description + h1 + bölüm). Sayfa başına ~200 bayt; ~530 sayfa ≈ 110 KB.
// İçerik elle yazılmaz — sayfa çıktısından türetilir, bayatlamaz.
function aramaOlustur() {
  const BOLUM_ADI = {
    rehberler: 'Rehber', havzalar: 'Havza', goller: 'Göl', nehirler: 'Nehir',
    'kuyu-ruhsati': 'Kuyu ruhsatı', durumum: 'Sektör', 'su-kanunu': 'Mevzuat',
    'su-hukuku': 'Su hukuku', 'islem-matrisi': 'İşlem matrisi', 'emsal-kararlar': 'Emsal karar',
    sozluk: 'Sözlük', vaka: 'Vaka', 'hangi-kurum': 'Kurum', 'ilimde-kim-yetkili': 'İl aracı',
    'nerede-su-cikar': 'Giriş', 'kapatma-kaydi': 'Kapatma kaydı', 'ilce-sorgu': 'İlçe sorgu',
    hakkinda: 'Hakkında', harita: 'Harita', arsiv: 'Arşiv',
  };
  return {
    name: 'arama-olustur',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const kok = fileURLToPath(dir);
        const kayitlar = [];
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
              const h = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
              if (!t) throw new Error(`arama.json: ${gorece || '/'} sayfasında <title> yok.`);
              const temiz = (s) => (s || '').replace(/<[^>]+>/g, ' ').replace(/&#39;/g, "'")
                .replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
              const bolum = gorece.split('/')[0] || 'ana';
              kayitlar.push({
                y: gorece === '' ? '/' : `/${gorece}/`,
                b: temiz(t[1]).replace(/\s*—\s*Su Haritası\s*$/, ''),
                a: temiz(d ? d[2] : ''),
                h: temiz(h ? h[1] : ''),
                k: BOLUM_ADI[bolum] ?? 'Sayfa',
              });
            }
          }
        }
        await tara(kok);
        kayitlar.sort((a, b) => a.y.localeCompare(b.y));
        await writeFile(join(kok, 'arama.json'), JSON.stringify(kayitlar), 'utf8');
        logger.info(`arama.json: ${kayitlar.length} kayıt`);
      },
    },
  };
}

// llms.txt: AI istemcileri için sitenin makine-okunur içindekiler dosyası.
// İçerik dist'ten üretilir (title + meta description) — elle yazılmış metin
// yok, dolayısıyla bayatlamaz. Sitemap dışı (noindex) sayfalar hariç.
function llmsOlustur() {
  // K20 (27.08.2026): `arac/` öneki ÇIKARILDI — rota 28.07'de öldü, eşleşen
  // sayfa 0'dı. `goller/` ve `nehirler/` EKLENDİ: bu iki aile 342 sayfa
  // tutuyor ve önek olmadığı için tamamı "Diğer sayfalar" altına düşüyordu,
  // yani AI istemcilerine kategorisiz gidiyordu.
  const BOLUM = [
    ['acik-veri/', 'Açık veri ve geliştirici portalı (OpenAPI)'],
    ['veri/', 'Açık veri kataloğu (JSON API)'],
    ['su-riski-endeksi/', 'Su riski endeksi (il/havza)'],
    ['kuyu-karar-motoru/', 'Kuyu karar motoru (süre, merci, evrak)'],
    ['su-hukuku/', 'Su hukuku omurga sayfası (karar matrisi)'],
    ['rehberler/', 'Mevzuat rehberleri'],
    ['mevzuat/', 'Mevzuat maddeleri (madde madde)'],
    ['emsal-kararlar/', 'Emsal kararlar veritabanı'],
    ['kuyu-kisit-sorgu/', 'Yeraltı suyu kısıt sorgu motoru'],
    ['hesaplayicilar/', 'Su hukuku hesaplayıcıları'],
    ['islem-matrisi/', 'Su işlemleri ve yetkili kurum matrisi (81 il)'],
    ['su-kanunu/', 'Su Kanunu ve mevzuat kütüphanesi'],
    ['sozluk/', 'Su hukuku sözlüğü'],
    ['havzalar/', 'Havzalar (25 havza)'],
    ['kuyu-ruhsati/', 'Kuyu ruhsatında il bazında yetkili kurum (81 il)'],
    ['durumum/', 'Sektöre göre su hukuku durumu'],
    ['sektor/', 'Sektörel su izni ve dava yolları'],
    ['goller/', 'Göller'],
    ['nehirler/', 'Nehirler'],
    ['vaka/', 'Vaka incelemeleri'],
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
        metin += `Tam URL listesi: ${SITE}/sitemap.xml\n`;
        // ADIM 3 (v6.0): OpenAPI spesifikasyonunun tam URL'i AI istemcilerine
        // açıkça bildirilir (makine-okunur veri standardı).
        metin += `Makine-okunur API şeması (OpenAPI 3.0): ${SITE}/api/v1/openapi.json\n\n`;
        for (const [onek, ad] of BOLUM) {
          const grup = sayfalar.filter((x) => x.yol.startsWith(`/${onek}`));
          if (!grup.length) continue;
          grup.forEach((x) => kullanilan.add(x.yol));
          metin += `## ${ad}\n\n${grup.map(satir).join('\n')}\n\n`;
        }
        const kalan = sayfalar.filter((x) => !kullanilan.has(x.yol));
        if (kalan.length) metin += `## Diğer sayfalar\n\n${kalan.map(satir).join('\n')}\n\n`;
        await writeFile(join(kok, 'llms.txt'), metin, 'utf8');
        // llms-full.txt: derin tarayıcılar (Perplexity/SearchGPT/Claude) için
        // llms.txt ile AYNI kaynaktan (dist title + meta açıklama) üretilen
        // token-verimli tam indeks. Elle metin yok → bayatlamaz.
        let tam = `# Su Haritası — Tam İçerik İndeksi\n\n> ${ana.aciklama}\n\n`;
        tam += `Kaynak: ${SITE}/ · Hukuki içerik: Av. Serdar Arslan (Arslan Hukuk Bürosu).\n`;
        // ADIM 3 (v6.0): OpenAPI 3.0 tam URL + uç listesi (AI istemcileri için).
        tam += `\n## Makine-okunur API (OpenAPI 3.0)\n${SITE}/api/v1/openapi.json\n`;
        tam += `Uçlar: ${SITE}/api/v1/il/{il}.json · ${SITE}/api/v1/havza/{havza}.json\n`;
        tam += `Veri standardı ve atıf: ${SITE}/acik-veri/\n\n`;
        tam += `Her sayfa için başlık, kalıcı URL ve öz-cevap (meta açıklama):\n\n`;
        for (const x of sayfalar) {
          tam += `## ${x.baslik}\n${SITE}${x.yol}\n${x.aciklama}\n\n`;
        }
        await writeFile(join(kok, 'llms-full.txt'), tam, 'utf8');
        logger.info(`llms.txt: ${sayfalar.length} sayfa · llms-full.txt: ${tam.length} krk`);
      },
    },
  };
}

/* public/s/*.js BUILD HATTINA ALINDI (M4, 29.07.2026).
 *
 * SORUN (ölçüldü): `public/` Astro/Vite tarafından İŞLENMEZ — altı dosya
 * (canlan, durumum, hangi-kurum, imlec, sayfa, su-sim) dist'e BİT-EŞİT
 * kopyalanıyordu (`cmp` ile doğrulandı) ve 28 Türkçe yorum satırı canlıya
 * çıkıyordu. Bu, CLAUDE.md "Kopyalanma direnci" m.1-2 ihlaliydi:
 * `_astro/` varlıkları kurala uyuyor (sourceMappingURL 0), `s/` uymuyordu.
 *
 * NEDEN BU YOL, TAŞIMA DEĞİL: dosyaları `src/scripts/` altına taşımak
 * Sayfa.astro'daki yükleme biçimini (`is:inline`) ve HER sayfanın çıktısını
 * değiştirirdi — 175 sayfada gerileme riski. Bu kanca YALNIZ dist'teki
 * dosyanın İÇERİĞİNİ küçültür; yol, ad, yükleme biçimi ve HTML aynı kalır.
 * Yani sayfa çıktıları bit-eşit korunur (G3).
 *
 * SINIR: sourcemap ÜRETİLMEZ (m.2). Küçültme "aşırıya kaçıp siteyi kırmak
 * yasak" kuralına uyar: esbuild `format: 'iife'` DEĞİL, dosyalar zaten
 * bağımsız script; yalnız boşluk/yorum/ad kısaltma yapılır.
 */
function sKlasoruKucult() {
  return {
    name: 's-klasoru-kucult',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const kok = fileURLToPath(dir);
        const sDizin = join(kok, 's');
        let girisler;
        try {
          girisler = await readdir(sDizin);
        } catch (e) {
          // Dizin yoksa bu bir arıza DEĞİL (public/s kaldırılmış olabilir),
          // ama sessiz de kalmaz.
          logger.warn(`s/ dizini okunamadı (${e.code}) — küçültme atlandı`);
          return;
        }
        const esbuild = await import('esbuild');
        let onceToplam = 0, sonraToplam = 0, sayi = 0;
        for (const ad of girisler.filter((a) => a.endsWith('.js'))) {
          const yol = join(sDizin, ad);
          const kaynak = await readFile(yol, 'utf8');
          const { code } = await esbuild.transform(kaynak, {
            minify: true, sourcemap: false, target: 'es2020', legalComments: 'none',
          });
          // Başarı ölçütü: çıktı BOŞ DEĞİL ve kaynaktan küçük.
          if (!code || code.length >= kaynak.length) {
            throw new Error(`s/${ad}: küçültme çıktısı geçersiz (${code.length}/${kaynak.length} bayt)`);
          }
          await writeFile(yol, code);
          onceToplam += kaynak.length; sonraToplam += code.length; sayi++;
        }
        if (!sayi) throw new Error('s/ altında .js bulunamadı — kanca boşa koştu');
        logger.info(`s/*.js küçültüldü: ${sayi} dosya · ${onceToplam} → ${sonraToplam} bayt `
          + `(%${Math.round((1 - sonraToplam / onceToplam) * 100)} azalma) · sourcemap yok`);
      },
    },
  };
}

// JSON API ihrac katmani: her havza ve il icin makine-okunur JSON yan cikti.
// (04.08 dalgasının json-api/pdf-rapor kancaları KALDIRILDI — 24.08, satış
// sayfaları kaldırma kararı; bkz. rapor/agustos-uyum.md M1.)

export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  integrations: [sitemapOlustur(), llmsOlustur(), aramaOlustur(), kisitJsonOlustur(), veriApiOlustur(), surumDamgasi(), sKlasoruKucult()],
});
