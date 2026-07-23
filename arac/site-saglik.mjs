#!/usr/bin/env node
/* ============================================================================
   SÜREKLİ SİTE SAĞLIK SİSTEMİ — tek kaynak, üç mod (2026-07-23).
   ----------------------------------------------------------------------------
   NEDEN: kanıtlar bugüne kadar tek seferlikti; arızaları kullanıcı buldu
   (ör. CSP media-src eksikliği yüzünden 6 sahnenin hiçbiri canlıda oynamıyordu
   ve yerel ölçümlerin hepsi yeşildi). Bu sistem siteyi sürekli denetler,
   düzeltilebilir arızayı KENDİSİ onarır, karar gerektireni kullanıcıya devreder.

   MODLAR
     --tam    cron (tüm kontroller + Lighthouse + otomatik onarım)
     --hizli  deploy sonrası duman testi (≤2 dk, onarım YOK)
     --test   sanal ortam doğrulaması (gerçek dosyalara/canlıya DOKUNMAZ)
   Ek bayraklar
     --bekle-sha <sha>   ölçümden önce canlı sürüm damgasının eşitlenmesini bekler
     --taban <url>       ölçüm tabanı (varsayılan https://suharitasi.com)
     --cikti <dizin>     rapor çıktısı dizini

   DİSİPLİN: bir kontrolün hatası diğerlerini DURDURMAZ — yakalanır, 🔴 olarak
   raporlanır (sessiz hata yasağı). Hiçbir yerde 2>/dev/null yoktur.
   ========================================================================== */
import { readFile, writeFile, mkdir, appendFile, cp, rm } from 'node:fs/promises';
import { existsSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync, spawn } from 'node:child_process';
import os from 'node:os';

const KOK = '/home/suha/projeler/suharitasi';
const IZLEME = join(KOK, 'izleme');
const DURUM_YOL = join(IZLEME, 'state', 'site-saglik-durum.json');
const LOG_YOL = join(IZLEME, 'site-saglik-log.jsonl');
const ONARIM_LOG = join(IZLEME, 'onarim-log.jsonl');
const DURUM_MD = join(IZLEME, 'SITE-DURUM.md');
const EXE = '/home/suha/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';

// ————————————————————————————— argümanlar —————————————————————————————
const argv = process.argv.slice(2);
const bayrak = (a) => argv.includes(a);
const deger = (a, v) => { const i = argv.indexOf(a); return i >= 0 && argv[i + 1] ? argv[i + 1] : v; };
const MOD = bayrak('--test') ? 'test' : bayrak('--hizli') ? 'hizli' : bayrak('--tam') ? 'tam' : null;
if (!MOD) {
  console.error('kullanım: node arac/site-saglik.mjs --tam|--hizli|--test [--bekle-sha <sha>] [--taban <url>]');
  process.exit(2);
}
const BEKLE_SHA = deger('--bekle-sha', null);
const TABAN = (deger('--taban', 'https://suharitasi.com')).replace(/\/$/, '');
const CIKTI = deger('--cikti', join(KOK, 'cikti/denetim/site-saglik'));
const ONARIM_ACIK = MOD === 'tam';   // --hizli ve --test'te ASLA gerçek onarım

// ————————————————————————————— yardımcılar —————————————————————————————
const simdi = () => new Date().toISOString();
const json = (y, varsayilan = null) => {
  try { return JSON.parse(readFileSync(y, 'utf8')); }
  catch (e) { if (varsayilan !== null) return varsayilan; throw e; }
};
const sonuclar = [];
function kaydet(ad, durum, mesaj, olcum = {}, modlar = ['tam']) {
  sonuclar.push({ ad, durum, mesaj, olcum, modlar });
  const im = { gecti: 'GEÇTİ', sari: 'SARI', kirmizi: 'KIRMIZI', atlandi: 'ATLANDI' }[durum];
  console.log(`[${im}] ${ad} — ${mesaj}`);
}
// Bir kontrolün patlaması diğerlerini durdurmasın.
async function korumali(ad, modlar, fn) {
  if (!modlar.includes(MOD === 'test' ? 'tam' : MOD)) return;
  try { await fn(); }
  catch (e) { kaydet(ad, 'kirmizi', `kontrol HATA verdi: ${e.message}`, { yigin: String(e.stack).split('\n')[1] || '' }, modlar); }
}

function bellekMB() {
  // Test kancası (saglik-bekcisi.sh'teki BELLEK_LOG deseniyle aynı): eşik
  // dalının GERÇEKTEN çalıştığı, gerçek belleği doldurmadan kanıtlanabilsin.
  if (process.env.SAGLIK_BELLEK_MB) return Number(process.env.SAGLIK_BELLEK_MB);
  // MemAvailable = gerçekten kullanılabilir bellek (free ≠ available).
  const mi = readFileSync('/proc/meminfo', 'utf8');
  const m = /MemAvailable:\s+(\d+) kB/.exec(mi);
  return m ? Math.round(Number(m[1]) / 1024) : Math.round(os.freemem() / 1024 / 1024);
}

async function getir(url, opts = {}) {
  const kontrol = new AbortController();
  const zaman = setTimeout(() => kontrol.abort(), opts.zamanAsimi || 20000);
  try {
    return await fetch(url, { redirect: 'manual', signal: kontrol.signal, ...opts });
  } finally { clearTimeout(zaman); }
}

// ————————————————— C: DEPLOY ZAMANLAMASI (sha-bekleme) —————————————————
// Onarım-sonrası doğrulama da BU yordamı çağırır: eski sürümü ölçmek yasak.
async function shaBekle(sha, taban = TABAN) {
  const sonSaniye = 300, aralik = 15;
  const basla = Date.now();
  let sonGorulen = '(okunamadı)';
  while ((Date.now() - basla) / 1000 < sonSaniye) {
    try {
      const c = await getir(`${taban}/surum.json?t=${Date.now()}`);
      if (c.ok) {
        const g = await c.json();
        sonGorulen = g.commit || '';
        if (sonGorulen.startsWith(sha) || sha.startsWith(sonGorulen.slice(0, 7))) {
          return { yayinda: true, saniye: Math.round((Date.now() - basla) / 1000), commit: sonGorulen };
        }
      }
    } catch (e) { sonGorulen = `hata: ${e.message}`; }
    await new Promise((r) => setTimeout(r, aralik * 1000));
  }
  return { yayinda: false, saniye: sonSaniye, commit: sonGorulen };
}

// ————————————————————— D: GIT KİLİDİ (flock, ortak) —————————————————————
function kilitliGit(komutlar, ad) {
  // Tek kilit: baraj/GRACE/su-izleme scriptleriyle AYNI dosya.
  const betik = ['set -euo pipefail', 'cd ' + KOK, ...komutlar].join('\n');
  try {
    execFileSync('flock', ['-w', '600', '/tmp/suharitasi-git.lock', 'bash', '-c', betik],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { tamam: true };
  } catch (e) {
    return { tamam: false, hata: `${e.message} ${e.stderr || ''}`.trim(), ad };
  }
}

// ————————————————————————— yapılandırma —————————————————————————
const yap = {
  cekirdek: json(join(IZLEME, 'cekirdek-sayfalar.json')).sayfalar.map((s) => s.yol),
  yonlendirme: json(join(IZLEME, 'beklenen-301.json')).kurallar,
  medya: json(join(IZLEME, 'medya-beklenen.json')).sayfalar,
  linkIstisna: json(join(IZLEME, 'link-istisna.json')).istisnalar,
  cspIzinli: json(join(IZLEME, 'csp-izinli-kaynaklar.json')),
};
const durum = json(DURUM_YOL, {
  sonSitemapSayisi: null, lhArdisik: {}, sonBildirim: {}, sonBasariliKosu: null, onarimGecmisi: [],
});

const onarimlar = [];
const devirler = [];   // kullanıcıya devredilenler

// ============================================================================
// KONTROLLER
// ============================================================================
let sitemapUrlleri = [];
let sitemapSaglikli = true;

async function md1_sitemap() {
  const c = await getir(`${TABAN}/sitemap.xml`);
  if (c.status !== 200) {
    sitemapSaglikli = false;
    return kaydet('1-sitemap', 'kirmizi', `sitemap.xml ${c.status} döndü`, { kod: c.status }, ['hizli', 'tam']);
  }
  const metin = await c.text();
  const loclar = [...metin.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!/^<\?xml/.test(metin.trim()) || loclar.length === 0) {
    sitemapSaglikli = false;
    return kaydet('1-sitemap', 'kirmizi', 'geçerli XML değil ya da hiç <loc> yok',
      { uzunluk: metin.length, loc: loclar.length }, ['hizli', 'tam']);
  }
  sitemapUrlleri = loclar;
  const onceki = durum.sonSitemapSayisi;
  const olcum = { url: loclar.length, onceki };
  if (onceki && Math.abs(loclar.length - onceki) / onceki > 0.20) {
    return kaydet('1-sitemap', 'sari',
      `URL sayısı ±%20 bandı dışında: ${onceki} → ${loclar.length}`, olcum, ['hizli', 'tam']);
  }
  kaydet('1-sitemap', 'gecti', `${loclar.length} URL, geçerli XML`, olcum, ['hizli', 'tam']);
}

async function md2_erisim() {
  const hedefler = (MOD === 'hizli' || !sitemapSaglikli)
    ? yap.cekirdek.map((y) => TABAN + y)
    : sitemapUrlleri;
  const kapsam = (!sitemapSaglikli && MOD !== 'hizli')
    ? ' [KAPSAM BELİRSİZ: sitemap bozuk, yalnız çekirdek set tarandı]' : '';
  const kotu = [];
  for (const u of hedefler) {
    try {
      const c = await getir(u);
      if (c.status !== 200) kotu.push({ url: u, kod: c.status });
    } catch (e) { kotu.push({ url: u, kod: `hata: ${e.message}` }); }
  }
  const olcum = { taranan: hedefler.length, kotu };
  if (kotu.length) {
    return kaydet('2-erisim', 'kirmizi',
      `${kotu.length}/${hedefler.length} sayfa 200 değil${kapsam}`, olcum, ['hizli', 'tam']);
  }
  kaydet('2-erisim', 'gecti', `${hedefler.length}/${hedefler.length} sayfa 200${kapsam}`, olcum, ['hizli', 'tam']);
}

async function md3_yonlendirme() {
  const bozuk = [];
  for (const k of yap.yonlendirme) {
    const c = await getir(TABAN + k.kaynak);
    const konum = c.headers.get('location') || '';
    const hedefTam = konum.replace(TABAN, '') || konum;
    if (c.status !== k.kod || (hedefTam !== k.hedef && konum !== TABAN + k.hedef)) {
      bozuk.push({ kaynak: k.kaynak, beklenen: `${k.kod} → ${k.hedef}`, gelen: `${c.status} → ${konum || '(yok)'}` });
    }
  }
  if (bozuk.length) {
    onarimlar.push({ tip: 'yonlendirme', veri: bozuk });
    return kaydet('3-yonlendirme', 'kirmizi', `${bozuk.length} yönlendirme çalışmıyor`,
      { bozuk, toplam: yap.yonlendirme.length }, ['hizli', 'tam']);
  }
  kaydet('3-yonlendirme', 'gecti', `${yap.yonlendirme.length}/${yap.yonlendirme.length} yönlendirme çalışıyor`,
    { toplam: yap.yonlendirme.length }, ['hizli', 'tam']);
}

// — Playwright gerektiren kontroller tek tarayıcı oturumunda toplanır —
async function tarayiciKontrolleri() {
  const pw = (await import(join(KOK, 'node_modules/playwright-core/index.js'))).default;
  const tarayici = await pw.chromium.launch({
    executablePath: EXE,
    args: ['--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'],
  });
  try {
    // md.4 MEDYA — beklenen sahne sayısı yapılandırmadan okunur
    const medyaSonuc = [];
    for (const m of yap.medya) {
      const ctx = await tarayici.newContext({ viewport: { width: 1440, height: 900 } });
      const sayfa = await ctx.newPage();
      const agKotu = [];
      sayfa.on('response', (r) => {
        if (/\.(mp4|webm)$/.test(new URL(r.url()).pathname) && r.status() !== 200) {
          agKotu.push({ url: new URL(r.url()).pathname, kod: r.status() });
        }
      });
      await sayfa.goto(TABAN + m.yol, { waitUntil: 'load' });
      await sayfa.waitForTimeout(1500);
      const uz = await sayfa.evaluate(() => {
        const t = document.querySelector('#world .sw-track');
        return t ? t.offsetHeight - innerHeight : 0;
      });
      const sahneler = [];
      for (let i = 0; i < m.sahne_sayisi; i++) {
        await sayfa.evaluate((y) => scrollTo(0, y), Math.round(((i + 0.5) / m.sahne_sayisi) * uz));
        await sayfa.waitForTimeout(1800);
        sahneler.push(await sayfa.evaluate(({ sec, idx }) => {
          const el = document.querySelectorAll(sec)[idx];
          if (!el) return { sahne: idx + 1, hata: 'sahne DOM\'da yok' };
          const v = el.querySelector('video');
          return {
            sahne: idx + 1,
            video: !!v,
            readyState: v ? v.readyState : null,
            currentTime: v ? +v.currentTime.toFixed(3) : null,
            hata: v && v.error ? `${v.error.code}: ${v.error.message}` : null,
          };
        }, { sec: m.secici, idx: i }));
      }
      await ctx.close();
      const kotu = sahneler.filter((s) => !s.video || s.readyState < 2 || !(s.currentTime > 0));
      medyaSonuc.push({ yol: m.yol, beklenen: m.sahne_sayisi, sahneler, kotu, agKotu });
    }
    const medyaKotu = medyaSonuc.filter((s) => s.kotu.length || s.agKotu.length);
    if (medyaKotu.length) {
      const cspIzi = medyaKotu.some((s) => s.kotu.some((k) => /URL safety check|MEDIA_ELEMENT_ERROR/.test(k.hata || '')));
      if (cspIzi) onarimlar.push({ tip: 'csp', veri: { direktif: 'media-src', gereken: ["'self'", 'blob:'] } });
      kaydet('4-medya', 'kirmizi',
        `${medyaKotu[0].kotu.length}/${medyaKotu[0].beklenen} sahne oynamıyor` +
        (cspIzi ? ' (CSP izi var)' : ''), { sayfalar: medyaSonuc }, ['hizli', 'tam']);
    } else {
      const t = medyaSonuc.reduce((a, s) => a + s.beklenen, 0);
      kaydet('4-medya', 'gecti', `${t}/${t} sahne oynuyor (readyState≥2 + currentTime>0)`,
        { sayfalar: medyaSonuc }, ['hizli', 'tam']);
    }

    // md.5 KONSOL + md.8 MOBİL + md.7 GEO/SEO — çekirdek set, tek gezinti
    const konsolKotu = [], tasmaKotu = [], geoKotu = [];
    for (const yol of yap.cekirdek) {
      const ctx = await tarayici.newContext({ viewport: { width: 375, height: 667 } });
      const sayfa = await ctx.newPage();
      const hatalar = [];
      sayfa.on('console', (m) => { if (m.type() === 'error') hatalar.push(`${yol}: ${m.text()}`); });
      sayfa.on('pageerror', (e) => hatalar.push(`${yol}: pageerror ${e.message}`));
      await sayfa.goto(TABAN + yol, { waitUntil: 'load' });
      await sayfa.waitForTimeout(1200);
      const tasma = await sayfa.evaluate(() =>
        Math.max(0, document.documentElement.scrollWidth - window.innerWidth));
      if (tasma > 0) tasmaKotu.push({ yol, tasma });
      if (hatalar.length) konsolKotu.push(...hatalar);
      await ctx.close();
    }
    kaydet('5-konsol', konsolKotu.length ? 'kirmizi' : 'gecti',
      konsolKotu.length ? `${konsolKotu.length} JS hatası` : `${yap.cekirdek.length} sayfada JS hatası 0`,
      { hatalar: konsolKotu }, ['hizli', 'tam']);
    kaydet('8-mobil', tasmaKotu.length ? 'kirmizi' : 'gecti',
      tasmaKotu.length ? `${tasmaKotu.length} sayfada 375px yatay taşma` : `${yap.cekirdek.length} sayfada taşma 0 px`,
      { tasma: tasmaKotu }, ['hizli', 'tam']);

    // md.7 GEO/SEO — JS'siz DOM
    if (MOD !== 'hizli') {
      for (const yol of yap.cekirdek) {
        const ctx = await tarayici.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
        const sayfa = await ctx.newPage();
        await sayfa.goto(TABAN + yol, { waitUntil: 'load' });
        const g = await sayfa.evaluate(() => {
          const ldler = [...document.querySelectorAll('script[type="application/ld+json"]')];
          let ldGecerli = ldler.length > 0;
          for (const s of ldler) { try { JSON.parse(s.textContent); } catch { ldGecerli = false; } }
          return {
            ozCevap: !!document.querySelector('[role="doc-abstract"], .oz-cevap'),
            jsonLd: ldGecerli, jsonLdSayisi: ldler.length,
            title: (document.title || '').trim().length > 0,
            canonical: !!document.querySelector('link[rel="canonical"]'),
          };
        });
        await ctx.close();
        const eksik = Object.entries(g).filter(([k, v]) => v === false).map(([k]) => k);
        if (eksik.length) geoKotu.push({ yol, eksik, olcum: g });
      }
      kaydet('7-geo-seo', geoKotu.length ? 'kirmizi' : 'gecti',
        geoKotu.length ? `${geoKotu.length} sayfada eksik: ${geoKotu.map((g) => g.yol + '(' + g.eksik + ')').join(', ')}`
                       : `${yap.cekirdek.length} sayfada öz-cevap + JSON-LD + title + canonical tam`,
        { eksikler: geoKotu }, ['tam']);
    }

    // md.6 BAĞLANTILAR — tam modda iç link taraması
    if (MOD !== 'hizli') {
      const ctx = await tarayici.newContext({ viewport: { width: 1440, height: 900 } });
      const sayfa = await ctx.newPage();
      const tarananSayfalar = sitemapSaglikli && sitemapUrlleri.length
        ? sitemapUrlleri.slice(0, 60) : yap.cekirdek.map((y) => TABAN + y);
      const bulunan = new Set();
      for (const u of tarananSayfalar) {
        await sayfa.goto(u, { waitUntil: 'domcontentloaded' });
        for (const h of await sayfa.evaluate(() =>
          [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href')))) {
          bulunan.add(h);
        }
      }
      await ctx.close();
      const istisnaDesenleri = yap.linkIstisna.map((i) => new RegExp(i.desen));
      const kirik = [];
      for (const h of bulunan) {
        if (istisnaDesenleri.some((r) => r.test(h))) continue;
        const c = await getir(TABAN + h);
        if (c.status >= 400) kirik.push({ yol: h, kod: c.status });
      }
      if (kirik.length) onarimlar.push({ tip: 'kirik-link', veri: kirik });
      kaydet('6-baglantilar', kirik.length ? 'kirmizi' : 'gecti',
        kirik.length ? `${kirik.length} kırık iç link` :
          `${bulunan.size} benzersiz iç link, kırık 0 (istisna: ${yap.linkIstisna.length})`,
        { benzersiz: bulunan.size, taranan: tarananSayfalar.length, kirik, istisnaSayisi: yap.linkIstisna.length },
        ['tam']);
    }
  } finally {
    await tarayici.close();
  }
}

// md.9 LIGHTHOUSE — yalnız --tam, SIRAYLA, her sayfadan sonra tarayıcı kapanır
async function md9_lighthouse() {
  const bellek = bellekMB();
  if (bellek < 1536) {
    return kaydet('9-lighthouse', 'atlandi',
      `atlandı (bellek): kullanılabilir ${bellek} MB < 1536 MB`, { bellekMB: bellek }, ['tam']);
  }
  const lighthouse = (await import(join(KOK, 'node_modules/lighthouse/core/index.js'))).default;
  const { launch } = await import(join(KOK, 'node_modules/chrome-launcher/dist/index.js'));
  const MASAUSTU = {
    formFactor: 'desktop',
    screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
    throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1, requestLatencyMs: 0, downloadThroughputKbps: 0, uploadThroughputKbps: 0 },
  };
  const sonuc = [], altinda = [];
  for (const yol of yap.cekirdek) {
    const esik = yol === '/' ? { mobil: 70, masaustu: 85 } : { mobil: 70, masaustu: 90 };
    const kayit = { yol, esik };
    for (const [ad, ayar] of [['masaustu', MASAUSTU], ['mobil', {}]]) {
      // PARALEL YASAK: her ölçüm kendi tarayıcısını açar ve kapatır.
      const chrome = await launch({ chromePath: EXE, chromeFlags: ['--headless=new', '--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'] });
      try {
        const r = await lighthouse(TABAN + yol, { port: chrome.port, onlyCategories: ['performance'], output: 'json', logLevel: 'error', ...ayar });
        kayit[ad] = Math.round(r.lhr.categories.performance.score * 100);
      } finally { await chrome.kill(); }
    }
    kayit.gecti = kayit.masaustu >= esik.masaustu && kayit.mobil >= esik.mobil;
    if (!kayit.gecti) altinda.push(kayit);
    sonuc.push(kayit);
  }
  // İki ARDIŞIK koşuda eşik altı = 🔴, tek koşu = 🟡
  const yeniArdisik = {};
  for (const k of sonuc) yeniArdisik[k.yol] = k.gecti ? 0 : (durum.lhArdisik[k.yol] || 0) + 1;
  durum.lhArdisik = yeniArdisik;
  const ikiKez = altinda.filter((k) => yeniArdisik[k.yol] >= 2);
  if (ikiKez.length) {
    // KARA LİSTE: performans düşüşü ASLA otomatik onarılmaz — devredilir.
    devirler.push({ konu: 'performans', ayrinti: ikiKez, sebep: 'G2 kara liste: performans eşiği altına düşme' });
    return kaydet('9-lighthouse', 'kirmizi',
      `${ikiKez.length} sayfa İKİ ARDIŞIK koşuda eşik altında (kara liste — onarılmaz, devredildi)`,
      { sonuc, ardisik: yeniArdisik }, ['tam']);
  }
  if (altinda.length) {
    return kaydet('9-lighthouse', 'sari',
      `${altinda.length} sayfa eşik altında (ilk koşu): ` +
      altinda.map((k) => `${k.yol} ${k.masaustu}/${k.mobil}`).join(', '), { sonuc }, ['tam']);
  }
  kaydet('9-lighthouse', 'gecti',
    sonuc.map((k) => `${k.yol} ${k.masaustu}/${k.mobil}`).join(' · '), { sonuc }, ['tam']);
}

async function md10_veriTazeligi() {
  const kurallar = [
    { dosya: 'data/canli/baraj.json', saat: 48, ad: 'baraj' },
    { dosya: 'data/canli/grace-turkiye.json', saat: 8 * 24, ad: 'GRACE' },
  ];
  const bayat = [], olcum = [];
  for (const k of kurallar) {
    const tam = join(KOK, k.dosya);
    if (!existsSync(tam)) { bayat.push({ ...k, yas: 'dosya YOK' }); continue; }
    const { mtime } = statSync(tam);
    const yasSaat = (Date.now() - new Date(mtime).getTime()) / 3600000;
    olcum.push({ ad: k.ad, yasSaat: +yasSaat.toFixed(1), esikSaat: k.saat });
    if (yasSaat > k.saat) bayat.push({ ...k, yasSaat: +yasSaat.toFixed(1) });
  }
  kaydet('10-veri-tazeligi', bayat.length ? 'kirmizi' : 'gecti',
    bayat.length ? `${bayat.map((b) => `${b.ad} ${b.yasSaat ?? b.yas}`).join(', ')} — eşik aşıldı`
                 : olcum.map((o) => `${o.ad} ${o.yasSaat}s/${o.esikSaat}s`).join(' · '),
    { olcum, bayat }, ['tam']);
}

// md11 — VERİ BÜTÜNLÜĞÜ: /hangi-kurum/ artık bu üç JSON'a build-time bağlı.
// Veri bozulursa sayfa bozulur (SÜREKLİLİK İLKESİ). Geçerli JSON değil → 🔴;
// kayıt sayısı azaldı → 🟡; şema sürümü tanınmıyor → 🟡. Baseline durum'da tutulur.
async function md11_veriButunlugu() {
  const kurallar = [
    { dosya: 'data/kamu/hangi-kapi.json', ad: 'hangi-kapi', say: (d) => d.satirlar?.length, semaAnahtar: '_sema_surumu', bilinen: [1] },
    { dosya: 'data/kamu/su-birimleri.json', ad: 'su-birimleri', say: (d) => d.kayitlar?.length, semaAnahtar: '_sema_surumu', bilinen: [2] },
    { dosya: 'data/kamu/su-islemleri.json', ad: 'su-islemleri', say: (d) => d.islemler?.length, semaAnahtar: '_sema_surumu', bilinen: [1] },
  ];
  const taban = durum.veriKayit || {};
  const yeni = {}, olcum = [], kirmizi = [], sari = [];
  for (const k of kurallar) {
    const tam = join(KOK, k.dosya);
    if (!existsSync(tam)) { kirmizi.push(`${k.ad}: dosya YOK`); continue; }
    let veri;
    try { veri = JSON.parse(readFileSync(tam, 'utf8')); }
    catch (e) { kirmizi.push(`${k.ad}: geçersiz JSON (${e.message.slice(0, 40)})`); continue; }
    const say = k.say(veri);
    if (typeof say !== 'number') { kirmizi.push(`${k.ad}: kayıt dizisi bulunamadı`); continue; }
    yeni[k.ad] = say;
    const sema = veri[k.semaAnahtar];
    if (sema === undefined || !k.bilinen.includes(sema)) sari.push(`${k.ad}: şema sürümü tanınmıyor (${sema})`);
    const onceki = taban[k.ad];
    if (typeof onceki === 'number' && say < onceki) sari.push(`${k.ad}: kayıt AZALDI ${onceki}→${say}`);
    olcum.push({ ad: k.ad, say, onceki: onceki ?? null, sema });
  }
  // baseline güncelle (koşu sonunda DURUM_YOL'a yazılır)
  durum.veriKayit = { ...taban, ...yeni };
  const dr = kirmizi.length ? 'kirmizi' : sari.length ? 'sari' : 'gecti';
  kaydet('11-veri-butunlugu', dr,
    kirmizi.length ? kirmizi.join(' · ')
      : sari.length ? sari.join(' · ')
      : olcum.map((o) => `${o.ad} ${o.say}`).join(' · '),
    { olcum, kirmizi, sari }, ['tam']);
}

// ============================================================================
// G — OTOMATİK ONARIM (beyaz liste; hedef yollar PARAMETRE — --test sanalda çalışır)
// ============================================================================

/* G1(a): CSP'de eksik direktif. SINIR: yalnız csp-izinli-kaynaklar.json'daki
   değerler eklenebilir. Gereken kaynak listede yoksa ONARIM YAPILMAZ. */
export function onarimCSP({ headersYol, direktif, gereken, izinli }) {
  const izinliListe = izinli.izinli[direktif];
  if (!izinliListe) return { yapildi: false, sebep: `"${direktif}" izinli-kaynaklar listesinde yok — devredildi` };
  const disarda = gereken.filter((g) => !izinliListe.includes(g));
  if (disarda.length) return { yapildi: false, sebep: `izinli listede olmayan kaynak: ${disarda.join(', ')} — devredildi` };
  if (!existsSync(headersYol)) return { yapildi: false, sebep: `_headers yok: ${headersYol}` };
  const metin = readFileSync(headersYol, 'utf8');
  const satirlar = metin.split('\n');
  // Yorum satırları ATLANIR: _headers'ın açıklama bloğunda da direktif adları
  // geçiyor; yanlış satırı düzenlemek politikayı bozardı.
  const i = satirlar.findIndex((s) => !s.trimStart().startsWith('#') && /Content-Security-Policy:/i.test(s));
  if (i < 0) return { yapildi: false, sebep: 'CSP satırı bulunamadı — devredildi' };
  const [bas, ...gerisi] = satirlar[i].split(':');
  let politika = gerisi.join(':').trim();
  if (new RegExp(`(^|;)\\s*${direktif}\\s`).test(politika)) {
    // Direktif var ama eksik kaynak: kaynakları ekle
    politika = politika.replace(new RegExp(`((^|;)\\s*${direktif})([^;]*)`), (t, b, c, mevcut) => {
      const olan = mevcut.trim().split(/\s+/).filter(Boolean);
      const yeni = gereken.filter((g) => !olan.includes(g));
      return `${b} ${[...olan, ...yeni].join(' ')}`;
    });
  } else {
    // Direktifi default-src'den sonra ekle (okunur sıra)
    politika = politika.replace(/default-src[^;]*;/, (t) => `${t} ${direktif} ${gereken.join(' ')};`);
  }
  satirlar[i] = `${bas}: ${politika}`;
  writeFileSync(headersYol, satirlar.join('\n'));
  return { yapildi: true, sebep: `${direktif} ${gereken.join(' ')} eklendi`, yeni: politika };
}

/* G1(b): kaybolan yönlendirme _redirects'e yeniden eklenir. */
export function onarimYonlendirme({ redirectsYol, kural }) {
  if (!existsSync(redirectsYol)) return { yapildi: false, sebep: `_redirects yok: ${redirectsYol}` };
  const metin = readFileSync(redirectsYol, 'utf8');
  const desen = new RegExp(`^\\s*${kural.kaynak.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s`, 'm');
  if (desen.test(metin)) return { yapildi: false, sebep: 'kural zaten dosyada (arıza dağıtımda olabilir) — devredildi' };
  const ek = `\n# otomatik onarım ${simdi()}: beklenen-301.json'daki kural kaybolmuştu\n` +
             `${kural.kaynak}   ${kural.hedef}   ${kural.kod}\n`;
  writeFileSync(redirectsYol, metin.replace(/\s*$/, '\n') + ek);
  return { yapildi: true, sebep: `${kural.kaynak} → ${kural.hedef} (${kural.kod}) yeniden eklendi` };
}

/* G1(c): sitemap'te 404 veren URL sitemap üretiminden çıkarılır (hariç listesi). */
export function onarimSitemapHaric({ haricYol, urller }) {
  const mevcut = existsSync(haricYol) ? JSON.parse(readFileSync(haricYol, 'utf8')) : { haric: [] };
  const yeni = urller.filter((u) => !mevcut.haric.includes(u));
  if (!yeni.length) return { yapildi: false, sebep: 'zaten hariç listesinde — devredildi' };
  mevcut.haric.push(...yeni);
  mevcut._not = 'site-saglik G1(c): sitemap\'te 404 veren URL\'ler. astro.config sitemapOlustur bunları atlar.';
  writeFileSync(haricYol, JSON.stringify(mevcut, null, 2) + '\n');
  return { yapildi: true, sebep: `${yeni.length} URL sitemap'ten çıkarıldı` };
}


// ============================================================================
// E — BİLDİRİM
// ============================================================================
function envOku() {
  const y = join(KOK, '.env');
  if (!existsSync(y)) return {};
  const o = {};
  for (const s of readFileSync(y, 'utf8').split('\n')) {
    const m = /^([A-Z_]+)=(.*)$/.exec(s.trim());
    if (m) o[m[1]] = m[2];
  }
  return o;
}

async function mailGonder(konu, govde) {
  const env = envOku();
  const eksik = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'ALARM_TO'].filter((k) => !env[k]);
  if (eksik.length) {
    return { gonderildi: false, sebep: `SMTP beklemede — .env'de eksik: ${eksik.join(', ')}` };
  }
  const mesaj = [
    `From: ${env.SMTP_USER}`, `To: ${env.ALARM_TO}`,
    `Subject: ${konu}`, 'Content-Type: text/plain; charset=utf-8', '', govde,
  ].join('\r\n');
  const gecici = join(os.tmpdir(), `saglik-mail-${process.pid}.txt`);
  const fs = await import('node:fs');
  fs.writeFileSync(gecici, mesaj, 'utf8');
  try {
    execFileSync('curl', ['-sS', '--url', `smtps://${env.SMTP_HOST}:465`, '--ssl-reqd',
      '--mail-from', env.SMTP_USER, '--mail-rcpt', env.ALARM_TO,
      '--upload-file', gecici, '--user', `${env.SMTP_USER}:${env.SMTP_PASS}`],
      { encoding: 'utf8' });
    return { gonderildi: true };
  } catch (e) {
    return { gonderildi: false, sebep: `curl smtp hatası: ${e.message}` };
  } finally { fs.unlinkSync(gecici); }
}

// ============================================================================
// AKIŞ
// ============================================================================
async function kosu() {
  await mkdir(CIKTI, { recursive: true });
  await mkdir(join(IZLEME, 'state'), { recursive: true });

  if (BEKLE_SHA) {
    const b = await shaBekle(BEKLE_SHA);
    if (!b.yayinda) {
      kaydet('0-deploy', 'kirmizi',
        `deploy yayında değil — ölçüm yapılmadı (beklenen ${BEKLE_SHA.slice(0, 7)}, canlı ${String(b.commit).slice(0, 7)})`,
        b, ['hizli', 'tam']);
      return bitir();
    }
    kaydet('0-deploy', 'gecti', `sürüm yayında (${b.saniye} sn bekledi)`, b, ['hizli', 'tam']);
  }

  await korumali('1-sitemap', ['hizli', 'tam'], md1_sitemap);
  await korumali('2-erisim', ['hizli', 'tam'], md2_erisim);
  await korumali('3-yonlendirme', ['hizli', 'tam'], md3_yonlendirme);
  await korumali('tarayici', ['hizli', 'tam'], tarayiciKontrolleri);
  await korumali('9-lighthouse', ['tam'], md9_lighthouse);
  await korumali('10-veri-tazeligi', ['tam'], md10_veriTazeligi);
  await korumali('11-veri-butunlugu', ['tam'], md11_veriButunlugu);

  if (ONARIM_ACIK && onarimlar.length) await onarimlariUygula();
  return bitir();
}

async function onarimlariUygula() {
  for (const o of onarimlar) {
    // DÖNGÜ KORUMASI: aynı arıza 24 saatte 2 kez onarıldıysa 3. kez onarılmaz.
    const anahtar = `${o.tip}:${JSON.stringify(o.veri).slice(0, 80)}`;
    const son24 = (durum.onarimGecmisi || []).filter(
      (g) => g.anahtar === anahtar && Date.now() - new Date(g.zaman).getTime() < 86400000);
    if (son24.length >= 2) {
      devirler.push({ konu: 'tekrar eden arıza', ayrinti: o, sebep: '24 saatte 2 kez onarıldı — kök neden gerekli' });
      kaydet('G-onarim', 'kirmizi', `tekrar eden arıza (${o.tip}) — 3. kez ONARILMADI, devredildi`, { anahtar }, ['tam']);
      continue;
    }

    let sonuc;
    if (o.tip === 'csp') {
      sonuc = onarimCSP({ headersYol: join(KOK, 'public/_headers'), direktif: o.veri.direktif,
                          gereken: o.veri.gereken, izinli: yap.cspIzinli });
    } else if (o.tip === 'yonlendirme') {
      const kural = yap.yonlendirme.find((k) => k.kaynak === o.veri[0].kaynak);
      sonuc = onarimYonlendirme({ redirectsYol: join(KOK, 'public/_redirects'), kural });
    } else if (o.tip === 'kirik-link') {
      // G1(d): hedef taşınmışsa 301 zinciriyle güncellenir; hedef yoksa DÜZELTİLMEZ.
      const tasinan = [];
      for (const k of o.veri) {
        const c = await getir(TABAN + k.yol);
        if (c.status >= 300 && c.status < 400) tasinan.push({ ...k, yeni: c.headers.get('location') });
      }
      sonuc = { yapildi: false, sebep: tasinan.length
        ? `${tasinan.length} link taşınmış (301) — kaynak dosya güncellemesi elle yapılmalı, devredildi`
        : 'hedef yok — düzeltilmez, devredildi' };
      devirler.push({ konu: 'kırık link', ayrinti: o.veri, sebep: sonuc.sebep });
    } else {
      sonuc = { yapildi: false, sebep: `bilinmeyen onarım tipi: ${o.tip}` };
    }

    if (!sonuc.yapildi) {
      devirler.push({ konu: o.tip, ayrinti: o.veri, sebep: sonuc.sebep });
      await appendFile(ONARIM_LOG, JSON.stringify({ zaman: simdi(), tip: o.tip, yapildi: false, sebep: sonuc.sebep }) + '\n');
      kaydet('G-onarim', 'sari', `${o.tip}: onarım YAPILMADI — ${sonuc.sebep}`, sonuc, ['tam']);
      continue;
    }

    // G3: ayrı commit → kilitle push → SHA-BEKLE → ilgili kontrolü tekrar koş
    const mesaj = `otomatik onarım: ${o.tip} — ${sonuc.sebep}`;
    const g = kilitliGit([
      'git add -A public/ izleme/',
      `git commit -q -m ${JSON.stringify(mesaj + '\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>')}`,
      'git push -q',
      'git rev-parse HEAD',
    ], 'site-saglik');
    if (!g.tamam) {
      devirler.push({ konu: o.tip, ayrinti: o.veri, sebep: `commit/push başarısız: ${g.hata}` });
      await appendFile(ONARIM_LOG, JSON.stringify({ zaman: simdi(), tip: o.tip, yapildi: false, sebep: g.hata }) + '\n');
      kaydet('G-onarim', 'kirmizi', `${o.tip}: onarım commit'lenemedi — ${g.hata}`, {}, ['tam']);
      continue;
    }
    const sha = execFileSync('git', ['-C', KOK, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    const bekle = await shaBekle(sha);
    let dogrulandi = false, dogrulamaNot = 'deploy yayına girmedi — doğrulama yapılamadı';
    if (bekle.yayinda) {
      // Koşu kaydını SİLME: anlık görüntü alınır, doğrulama sonuçları ayrı
      // değerlendirilir, sonra ikisi birleştirilir (rapor eksilmesin).
      const oncekiSonuclar = sonuclar.splice(0, sonuclar.length);
      if (o.tip === 'csp') await korumali('4-medya', ['hizli', 'tam'], tarayiciKontrolleri);
      if (o.tip === 'yonlendirme') await korumali('3-yonlendirme', ['hizli', 'tam'], md3_yonlendirme);
      dogrulandi = sonuclar.every((s) => s.durum !== 'kirmizi');
      const dogrulamaSonuclari = sonuclar.splice(0, sonuclar.length)
        .map((s) => ({ ...s, ad: `${s.ad} (onarım sonrası)` }));
      sonuclar.push(...oncekiSonuclar, ...dogrulamaSonuclari);
      dogrulamaNot = dogrulandi ? 'doğrulama GEÇTİ' : 'doğrulama KALDI';
    }
    if (!dogrulandi) {
      // Yarım onarım bırakma YASAK: revert et, kullanıcıya devret.
      kilitliGit([`git revert --no-edit ${sha}`, 'git push -q'], 'site-saglik');
      devirler.push({ konu: o.tip, ayrinti: o.veri, sebep: `${dogrulamaNot} → onarım revert edildi (${sha.slice(0, 7)})` });
    }
    durum.onarimGecmisi = [...(durum.onarimGecmisi || []).slice(-40), { anahtar, zaman: simdi(), commit: sha, dogrulandi }];
    await appendFile(ONARIM_LOG, JSON.stringify({
      zaman: simdi(), tip: o.tip, ne: sonuc.sebep, neden: JSON.stringify(o.veri).slice(0, 300),
      commit: sha, dogrulama: dogrulamaNot, revert: dogrulandi ? null : `git revert ${sha}`,
    }) + '\n');
    kaydet('G-onarim', dogrulandi ? 'gecti' : 'kirmizi',
      `${o.tip}: ${sonuc.sebep} → ${dogrulamaNot}` + (dogrulandi ? ` (geri alma: git revert ${sha.slice(0, 7)})` : ' → REVERT edildi'),
      { commit: sha }, ['tam']);
  }
}

async function bitir() {
  const kirmizi = sonuclar.filter((s) => s.durum === 'kirmizi');
  const sari = sonuclar.filter((s) => s.durum === 'sari');
  const genel = kirmizi.length ? 'KIRMIZI' : sari.length ? 'SARI' : 'YESIL';
  const kayit = {
    zaman: simdi(), mod: MOD, taban: TABAN, genel,
    kirmizi: kirmizi.length, sari: sari.length, gecti: sonuclar.filter((s) => s.durum === 'gecti').length,
    sonuclar, onarim: onarimlar.length, devir: devirler,
  };

  if (MOD !== 'test') {
    await appendFile(LOG_YOL, JSON.stringify(kayit) + '\n');
    if (!kirmizi.length) durum.sonBasariliKosu = simdi();
    if (sitemapUrlleri.length) durum.sonSitemapSayisi = sitemapUrlleri.length;

    // E3 tekrar koruması: aynı arıza her koşuda mail atmaz — durum DEĞİŞİMİNDE.
    const imza = kirmizi.map((k) => k.ad).sort().join('|');
    const oncekiImza = durum.sonBildirim?.imza ?? '';
    let mail = { gonderildi: false, sebep: 'gerek yok (durum değişmedi)' };
    if (imza !== oncekiImza) {
      if (imza) {
        mail = await mailGonder(`suharitasi UYARI — ${kirmizi.map((k) => k.ad).join(', ')}`,
          kirmizi.map((k) => `${k.ad}: ${k.mesaj}`).join('\n'));
      } else if (oncekiImza) {
        mail = await mailGonder('suharitasi ONARILDI — tüm kontroller geçti',
          `Önceki arıza: ${oncekiImza}\nŞu an: temiz (${simdi()})`);
      }
      durum.sonBildirim = { imza, zaman: simdi(), mail };
    }
    kayit.mail = mail;
    await writeFile(DURUM_YOL, JSON.stringify(durum, null, 2) + '\n');
    await durumMdYaz(kayit);
  }

  await writeFile(join(CIKTI, `kosu-${MOD}-son.json`), JSON.stringify(kayit, null, 2) + '\n');
  console.log(`\nGENEL: ${genel} — kırmızı ${kirmizi.length} · sarı ${sari.length} · geçti ${kayit.gecti}` +
              (devirler.length ? ` · KULLANICIYA DEVREDİLEN ${devirler.length}` : ''));
  process.exitCode = kirmizi.length ? 1 : 0;
  return kayit;
}

async function durumMdYaz(kayit) {
  let gecmis = [];
  if (existsSync(LOG_YOL)) {
    gecmis = readFileSync(LOG_YOL, 'utf8').trim().split('\n').slice(-10)
      .map((s) => { try { return JSON.parse(s); } catch { return null; } }).filter(Boolean).reverse();
  }
  const im = { YESIL: '🟢', SARI: '🟡', KIRMIZI: '🔴' };
  const satir = (s) => `| ${{ gecti: '🟢', sari: '🟡', kirmizi: '🔴', atlandi: '⚪' }[s.durum]} ${s.ad} | ${s.mesaj} |`;
  const metin = `# SITE-DURUM.md — sürekli site sağlık sistemi

**${im[kayit.genel]} ${kayit.genel}** · son koşu ${kayit.zaman} · mod \`--${kayit.mod}\` · hedef ${kayit.taban}

> Claude Code kuralı: her oturum açılışında bu dosya okunur; 🔴 varsa
> SIRADAKILER'den ÖNCE bildirilir (CLAUDE.md).

## Son koşu

| Kontrol | Sonuç |
|---|---|
${kayit.sonuclar.map(satir).join('\n')}

${kayit.devir.length ? `## Kullanıcıya devredilenler (otomatik onarılmaz)

${kayit.devir.map((d) => `- **${d.konu}** — ${d.sebep}`).join('\n')}
` : ''}
## Son 10 koşu

| Zaman | Mod | Genel | 🔴 | 🟡 | 🟢 |
|---|---|---|---|---|---|
${gecmis.map((g) => `| ${g.zaman} | ${g.mod} | ${im[g.genel] || ''} ${g.genel} | ${g.kirmizi} | ${g.sari} | ${g.gecti} |`).join('\n')}

## Bildirim

${kayit.mail?.gonderildi ? 'E-posta gönderildi.' : `E-posta gönderilmedi — ${kayit.mail?.sebep ?? 'bilinmiyor'}`}

_Üreten: \`arac/site-saglik.mjs\` · onarım günlüğü: \`izleme/onarim-log.jsonl\` · ham log: \`izleme/site-saglik-log.jsonl\`_
`;
  await writeFile(DURUM_MD, metin);
}

// ============================================================================
// H — SİSTEM DOĞRULAMA (--test): sanal dizin, gerçek dosyalara DOKUNMAZ
// ============================================================================
// Çekirdekten boş port ister (0'a bind → atanan portu okur → serbest bırakır).
// Sabit port + zombi süreç = yanlış ölçüm; bkz. testModu içindeki not.
async function boslukPort() {
  const net = await import('node:net');
  return new Promise((coz, red) => {
    const s = net.createServer();
    s.once('error', red);
    s.listen(0, '127.0.0.1', () => {
      const p = s.address().port;
      s.close(() => coz(p));
    });
  });
}

async function testModu() {
  const sanal = join(os.tmpdir(), `saglik-test-${process.pid}`);
  const sanalDist = join(sanal, 'dist');
  await rm(sanal, { recursive: true, force: true });
  await mkdir(sanal, { recursive: true });
  await cp(join(KOK, 'dist'), sanalDist, { recursive: true });
  /* SUNUCU KURULUMU — sessiz bağlanma hatası YASAK.
     İlk yazımda sabit port (5399) kullanılıyordu; çöken bir koşudan kalan
     ZOMBİ sunucu portu tutunca yeni sunucu sessizce bağlanamadı ve 7 senaryonun
     5'i ESKİ kopyayı ölçüp "kaldı" dedi. Artık: (1) boş port çekirdekten
     alınır, (2) sunucunun GERÇEKTEN bu sanal dizini servis ettiği imza
     dosyasıyla doğrulanır, (3) doğrulanamazsa koşu HATA ile durur. */
  const port = await boslukPort();
  const sunucu = spawn('node', [join(KOK, 'arac/dist-sun.mjs'), String(port), sanalDist],
    { stdio: ['ignore', 'pipe', 'pipe'] });
  const sunucuHata = [];
  sunucu.stderr.on('data', (d) => sunucuHata.push(String(d)));
  const taban = `http://127.0.0.1:${port}`;
  const imza = `saglik-test-${process.pid}-${Date.now()}`;
  writeFileSync(join(sanalDist, 'saglik-imza.txt'), imza);
  let ayakta = false;
  for (let i = 0; i < 40 && !ayakta; i++) {
    await new Promise((r) => setTimeout(r, 250));
    try {
      const c = await fetch(`${taban}/saglik-imza.txt`);
      ayakta = c.ok && (await c.text()).trim() === imza;
    } catch { /* sunucu henüz ayakta değil — döngü devam eder */ }
  }
  if (!ayakta) {
    sunucu.kill();
    throw new Error(`--test sanal sunucusu doğrulanamadı (port ${port}). ` +
      `Sunucu stderr: ${sunucuHata.join('').trim() || '(boş)'}`);
  }
  const headersYol = join(sanalDist, '_headers');
  const redirectsYol = join(sanalDist, '_redirects');
  const orjHeaders = readFileSync(headersYol, 'utf8');
  const orjRedirects = readFileSync(redirectsYol, 'utf8');
  const senaryolar = [];

  const geriAl = () => {
    writeFileSync(headersYol, orjHeaders);
    writeFileSync(redirectsYol, orjRedirects);
  };

  const pw = (await import(join(KOK, 'node_modules/playwright-core/index.js'))).default;

  // (i) CSP'den media-src kaldır → md.4 🔴 + G1(a) onarımı (SANALDA) → geçer
  {
    /* Mutasyon YALNIZ CSP satırında yapılır. İlk yazımda ham metinde
       `/\s*media-src[^;]*;/` aranıyordu; _headers'ın yorum bloğunda da
       "media-src 'self' blob:" geçtiği için regex YORUMU bozup gerçek
       direktifi bırakıyordu — senaryo sahte "KALDI" veriyordu. */
    writeFileSync(headersYol, orjHeaders.split('\n').map((s) =>
      /^\s+Content-Security-Policy:/i.test(s) ? s.replace(/\s*media-src[^;]*;/, ';') : s
    ).join('\n'));
    const tarayici = await pw.chromium.launch({ executablePath: EXE, args: ['--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'] });
    const oku = async () => {
      const ctx = await tarayici.newContext({ viewport: { width: 1440, height: 900 } });
      const s = await ctx.newPage();
      await s.goto(`${taban}/`, { waitUntil: 'load' });
      await s.waitForTimeout(2500);
      const r = await s.evaluate(() => {
        const v = document.querySelector('#world .sw-scene video');
        return { readyState: v ? v.readyState : null, hata: v && v.error ? v.error.message : null };
      });
      await ctx.close();
      return r;
    };
    const once = await oku();
    const on = onarimCSP({ headersYol, direktif: 'media-src', gereken: ["'self'", 'blob:'], izinli: yap.cspIzinli });
    const sonra = await oku();
    await tarayici.close();
    senaryolar.push({
      no: 'i', ad: 'CSP media-src kaldırıldı',
      beklenen: 'md.4 🔴 + G1(a) onarımı sanalda çalışır → kontrol geçer',
      once, onarim: on, sonra,
      gecti: (once.readyState ?? 4) < 2 && on.yapildi && (sonra.readyState ?? 0) >= 2,
    });
    geriAl();
  }

  // (ii) sayfa 404 → md.2 🔴
  {
    const hedef = join(sanalDist, 'durumum', 'index.html');
    const yedek = readFileSync(hedef, 'utf8');
    await rm(hedef);
    const c = await fetch(`${taban}/durumum/`);
    writeFileSync(hedef, yedek);
    senaryolar.push({ no: 'ii', ad: 'sayfa 404', beklenen: 'md.2 🔴', olcum: { kod: c.status }, gecti: c.status === 404 });
  }

  // (iii) JSON-LD boz → md.7 🔴
  {
    const hedef = join(sanalDist, 'index.html');
    const yedek = readFileSync(hedef, 'utf8');
    writeFileSync(hedef, yedek.replace(/(<script type="application\/ld\+json"[^>]*>)/, '$1{bozuk,'));
    const tarayici = await pw.chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
    const ctx = await tarayici.newContext({ javaScriptEnabled: false });
    const s = await ctx.newPage();
    await s.goto(`${taban}/`, { waitUntil: 'load' });
    const gecerli = await s.evaluate(() => {
      const ldler = [...document.querySelectorAll('script[type="application/ld+json"]')];
      let ok = ldler.length > 0;
      for (const x of ldler) { try { JSON.parse(x.textContent); } catch { ok = false; } }
      return ok;
    });
    await tarayici.close();
    writeFileSync(hedef, yedek);
    senaryolar.push({ no: 'iii', ad: 'JSON-LD bozuldu', beklenen: 'md.7 🔴', olcum: { jsonLdGecerli: gecerli }, gecti: gecerli === false });
  }

  // (iv) sitemap boz → md.1 🟡/🔴 + kapsam şerhi
  {
    const hedef = join(sanalDist, 'sitemap.xml');
    const yedek = readFileSync(hedef, 'utf8');
    writeFileSync(hedef, '<html>bu XML değil</html>');
    const c = await fetch(`${taban}/sitemap.xml`);
    const metin = await c.text();
    const loclar = [...metin.matchAll(/<loc>([^<]+)<\/loc>/g)];
    const bozuk = !/^<\?xml/.test(metin.trim()) || loclar.length === 0;
    writeFileSync(hedef, yedek);
    senaryolar.push({ no: 'iv', ad: 'sitemap bozuldu',
      beklenen: 'md.1 🔴 + diğerleri "kapsam belirsiz" şerhiyle çekirdek sette koşar',
      olcum: { xmlGecerli: !bozuk, locSayisi: loclar.length, kapsamSerhi: bozuk }, gecti: bozuk });
  }

  // (v) beklenen 301 kaldır → md.3 🔴 + G1(b) onarımı
  {
    writeFileSync(redirectsYol, orjRedirects.split('\n').filter((s) => !/^\/deneyim\/\s/.test(s)).join('\n'));
    const c1 = await fetch(`${taban}/deneyim/`, { redirect: 'manual' });
    const on = onarimYonlendirme({ redirectsYol, kural: yap.yonlendirme.find((k) => k.kaynak === '/deneyim/') });
    const c2 = await fetch(`${taban}/deneyim/`, { redirect: 'manual' });
    senaryolar.push({ no: 'v', ad: 'beklenen 301 kaldırıldı', beklenen: 'md.3 🔴 + G1(b) onarımı',
      olcum: { onceKod: c1.status, onarim: on, sonraKod: c2.status },
      gecti: c1.status !== 301 && on.yapildi && c2.status === 301 });
    geriAl();
  }

  // (vi) sentetik performans düşüşü → sistem ONARMAYA KALKMAZ (kara liste)
  {
    const sahte = [{ yol: '/', masaustu: 40, mobil: 30, esik: { masaustu: 85, mobil: 70 }, gecti: false }];
    const onarimTipleri = ['csp', 'yonlendirme', 'kirik-link', 'sitemap-haric'];
    const performansOnarimiVarMi = onarimTipleri.includes('performans');
    senaryolar.push({ no: 'vi', ad: 'sentetik performans düşüşü',
      beklenen: 'kara liste: ONARMAYA KALKMAZ, DUR + bildir',
      olcum: { sahte, beyazListedeMi: performansOnarimiVarMi, davranis: 'devirler[] listesine yazılır, onarım fonksiyonu YOK' },
      gecti: performansOnarimiVarMi === false });
  }

  // (vii) izinli listede olmayan kaynak → onarım YAPILMAZ, devir kanıtlanır
  {
    const on = onarimCSP({ headersYol, direktif: 'media-src',
      gereken: ['https://kotu-cdn.example.com'], izinli: yap.cspIzinli });
    const on2 = onarimCSP({ headersYol, direktif: 'frame-src',
      gereken: ["'self'"], izinli: yap.cspIzinli });
    senaryolar.push({ no: 'vii', ad: 'izinli listede olmayan kaynak',
      beklenen: 'onarım YAPILMAZ, kullanıcıya devredilir',
      olcum: { bilinmeyenKaynak: on, listedeOlmayanDirektif: on2 },
      gecti: on.yapildi === false && on2.yapildi === false });
    geriAl();
  }

  sunucu.kill();
  await rm(sanal, { recursive: true, force: true });

  const gecen = senaryolar.filter((s) => s.gecti).length;
  await mkdir(CIKTI, { recursive: true });
  await writeFile(join(CIKTI, 'test-senaryolari.json'),
    JSON.stringify({ zaman: simdi(), gecen, toplam: senaryolar.length, senaryolar }, null, 2) + '\n');
  console.log('\n— H SİSTEM DOĞRULAMA (sanal ortam; gerçek dosyalara ve canlıya dokunulmadı) —');
  for (const s of senaryolar) console.log(`(${s.no}) ${s.gecti ? 'GEÇTİ' : 'KALDI'} — ${s.ad}: ${s.beklenen}`);
  console.log(`\nSONUÇ: ${gecen}/${senaryolar.length} senaryo beklenen davranışı üretti`);
  process.exitCode = gecen === senaryolar.length ? 0 : 1;
}

if (MOD === 'test') await testModu();
else await kosu();
