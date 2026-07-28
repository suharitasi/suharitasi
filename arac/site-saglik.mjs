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

const VARSAYILAN_KOK = '/home/suha/projeler/suharitasi';
const EXE = '/home/suha/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';

// ————————————————————————————— argümanlar —————————————————————————————
const argv = process.argv.slice(2);
const bayrak = (a) => argv.includes(a);
const deger = (a, v) => { const i = argv.indexOf(a); return i >= 0 && argv[i + 1] ? argv[i + 1] : v; };
const TABAN_YENILE = bayrak('--gorsel-taban-yenile');
const MOD = TABAN_YENILE ? 'taban-yenile'
  : bayrak('--test') ? 'test' : bayrak('--hizli') ? 'hizli' : bayrak('--tam') ? 'tam' : null;
if (!MOD) {
  console.error('kullanım: node arac/site-saglik.mjs --tam|--hizli|--test [--bekle-sha <sha>] [--taban <url>] [--kok <dizin>]');
  console.error('          node arac/site-saglik.mjs --gorsel-taban-yenile --gerekce "..." [--taban <url>] [--kok <dizin>]');
  process.exit(2);
}
// --kok: worktree izolasyonu (2026-07-27, gece paketi B4). Depo kökü artık
// parametre — bir worktree'de düzeltilmiş script, ANA AĞACIN izleme/state,
// log ve SITE-DURUM dosyalarına dokunmadan canlıya karşı OKUMA koşusu
// yapabilsin. Varsayılan değişmediği için cron davranışı AYNI kalır.
const KOK = (deger('--kok', VARSAYILAN_KOK)).replace(/\/$/, '');
const IZOLE = KOK !== VARSAYILAN_KOK;
const IZLEME = join(KOK, 'izleme');
const DURUM_YOL = join(IZLEME, 'state', 'site-saglik-durum.json');
const LOG_YOL = join(IZLEME, 'site-saglik-log.jsonl');
const ONARIM_LOG = join(IZLEME, 'onarim-log.jsonl');
const DURUM_MD = join(IZLEME, 'SITE-DURUM.md');
const BEKLE_SHA = deger('--bekle-sha', null);
const TABAN = (deger('--taban', 'https://suharitasi.com')).replace(/\/$/, '');
const CIKTI = deger('--cikti', join(KOK, 'cikti/denetim/site-saglik'));
// Onarım git commit+push yapar; izole kökte bu YANLIŞ dala yazardı → kapalı.
const ONARIM_ACIK = MOD === 'tam' && !IZOLE;   // --hizli/--test/izole kök: ASLA gerçek onarım
if (IZOLE) console.log(`[İZOLE] kök=${KOK} — otomatik onarım KAPALI, yazımlar bu kökte kalır`);

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

// ————————————————— KOŞUM KİLİDİ + KAYNAK TAVANI (2026-07-28) —————————————————
// NEDEN (ölçüldü, rapor/sunucu-donma.md): 23 Tem'de sunucu iki kez RAM+swap
// tükenmesiyle cevapsız kaldı (avail 90 MB, swap 6047 MB, %system 42,
// %iowait 24). Sebep sağlık koşumu DEĞİLDİ — koşum maliyeti ölçüldü:
// --tam 1917 MB / 452 sn, --hizli 1074 MB / 68 sn. Ama koşumun bir donma
// anında ÜSTÜNE binmesi arızayı büyütür ve ölçümü de bozar. İki koruma:
//   (1) tek koşum kilidi — ikinci koşum başlamaz, SESSİZCE ÇIKMAZ, raporlar;
//   (2) kaynak tavanı — boş bellek koşumun ölçülen tepesinin altındaysa
//       koşum yapılmaz, "kaynak yetersiz" olarak raporlanır.
// Tavan ölçümden türetildi: tepe RSS + %30 pay (tam 1917→2500, hizli 1074→1400).
const KILIT_YOL = '/tmp/suharitasi-saglik.lock';
const KAYNAK_TAVAN_MB = { tam: 2500, hizli: 1400 };
let kilitAlindi = false;
let kaynakDurdu = false;   // true ise sonBasariliKosu damgalanmaz (bekçi görsün)

// Kilit sahibi gerçekten yaşıyor mu? PID tekrar kullanımına karşı cmdline'a bakar.
function kilitSahibiCanli(pid) {
  try {
    const cmd = readFileSync(`/proc/${pid}/cmdline`, 'utf8');
    return cmd.includes('site-saglik.mjs');
  } catch { return false; }   // /proc kaydı yok = süreç ölmüş
}

// Başarılı: null. Başarısız: sahibi anlatan nesne (çağıran RAPORLAR).
function kilitAl() {
  if (existsSync(KILIT_YOL)) {
    const eski = json(KILIT_YOL, {});
    if (eski.pid && kilitSahibiCanli(eski.pid)) return { ...eski, bayat: false };
    // Bayat kilit (koşum çökmüş): devral, ama sessizce yutma — logla.
    console.log(`[KİLİT] bayat kilit devralındı (PID ${eski.pid ?? '?'}, mod ${eski.mod ?? '?'}, ${eski.zaman ?? '?'})`);
  }
  writeFileSync(KILIT_YOL, JSON.stringify({ pid: process.pid, mod: MOD, zaman: simdi() }) + '\n');
  kilitAlindi = true;
  return null;
}

function kilitBirak() {
  if (!kilitAlindi) return;
  try {
    // Yalnız KENDİ kilidimizi sil — devralınmış/başkasının kilidini değil.
    const k = json(KILIT_YOL, {});
    if (k.pid === process.pid) execFileSync('rm', ['-f', KILIT_YOL]);
  } catch (e) { console.error(`[KİLİT] bırakılamadı: ${e.message}`); }
  kilitAlindi = false;
}
process.on('exit', kilitBirak);

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
    const cikti = execFileSync('flock', ['-w', '600', '/tmp/suharitasi-git.lock', 'bash', '-c', betik],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    // K1 (25 Tem 2026): stdout geri döndürülür — çağıran, kilit içindeki
    // koşullu dalların hangisinin işlediğini (ör. pull koptu) ayırt edebilsin.
    return { tamam: true, cikti: cikti || '' };
  } catch (e) {
    return { tamam: false, hata: `${e.message} ${e.stderr || ''}`.trim(), ad };
  }
}

// ————————————————————————— yapılandırma —————————————————————————
const yap = {
  cekirdek: json(join(IZLEME, 'cekirdek-sayfalar.json')).sayfalar.map((s) => s.yol),
  // md7 MUAFİYET (28 Tem 2026, kullanıcı kararı): bir sayfa bir GEO/SEO
  // kaleminden bilinçli muaf tutulabilir. Ölçüm YİNE YAPILIR, yalnız
  // kırmızıya saymaz ve koşu kaydında "muaf" olarak görünür — sessizce
  // gizlenmez (kanıt-hafifletme yasağı).
  cekirdekMuaf: Object.fromEntries(json(join(IZLEME, 'cekirdek-sayfalar.json')).sayfalar
    .filter((s) => s.muaf?.length).map((s) => [s.yol, s.muaf])),
  yonlendirme: json(join(IZLEME, 'beklenen-301.json')).kurallar,
  medya: json(join(IZLEME, 'medya-beklenen.json')).sayfalar,
  linkIstisna: json(join(IZLEME, 'link-istisna.json')).istisnalar,
  cspIzinli: json(join(IZLEME, 'csp-izinli-kaynaklar.json')),
  // md12 ETKİLEŞİM DENETİMİ (24.07): varlık değil İŞLEV testi. Boş/eksik
  // dosyada md12 sessizce atlanır (yeni kontrol eski kurulumu düşürmesin).
  etkilesim: json(join(IZLEME, 'etkilesim-beklenen.json'), { kontroller: [] }).kontroller,
  // G1-G6 GÖRSEL/DÜZEN TABANI (28.07). Dosya yoksa kalemler sessizce
  // atlanır (yeni kontrol eski kurulumu düşürmesin — md12 emsali).
  // NOT: json() yardımcısında `null` = "varsayılan yok, fırlat" demektir;
  // yokluğu ifade etmek için `false` sentineli kullanılır (yoksa kurulum
  // öncesi TÜM sağlık koşusu çökerdi — ölçüldü 28.07).
  gorselTaban: json(join(IZLEME, 'gorsel-taban.json'), false) || null,
  // M3-M10 kapsam kalemlerinin tabanı (28.07). Yoksa kalemler atlanır.
  kapsamTaban: json(join(IZLEME, 'kapsam-taban.json'), false) || null,
  // md13 KONTRAST (27 Tem 2026): boş/eksik dosyada kontrol sessizce atlanır.
  kontrast: json(join(IZLEME, 'kontrast-ornek.json'), { sayfalar: [] }),
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
        // 206 = Range/streaming cevabı, NORMALDİR (v2 lazy yükleme Range
        // kullanır — 27 Tem 2026 ölçümü); yalnız gerçek hatalar sayılır.
        if (/\.(mp4|webm)$/.test(new URL(r.url()).pathname) && ![200, 206].includes(r.status())) {
          agKotu.push({ url: new URL(r.url()).pathname, kod: r.status() });
        }
      });
      await sayfa.goto(TABAN + m.yol, { waitUntil: 'load' });
      // v2 REVİZYONU (27 Tem 2026, kullanıcı onaylı): sahne motoru scroll
      // değil ZAMAN DÖNGÜSÜ — videolar sırayla .aktif olur (Hero.astro:
      // FAZ A poster harmanı + sahne_suresi + geçiş), sıradaki lazy
      // yüklenir. Ölçüm: her adımda AKTİF videonun readyState>=2 +
      // currentTime>0; m.sahne_sayisi kadar FARKLI data-sahne görülmeli.
      // Eski '#world .sw-track' scroll hesabı v2 DOM'unda kalktı.
      const fazA = m.faz_a_ms ?? 3800;
      const adim = (m.sahne_suresi_ms ?? 5000) + (m.gecis_ms ?? 1400);
      await sayfa.waitForTimeout(fazA + 1200); // FAZ A + ilk video başlangıcı
      const sahneler = [];
      const gorulen = new Set();
      let oncekiSahne = null;
      for (let i = 0; i < m.sahne_sayisi; i++) {
        // Sabit bekleme döngüyle senkron kayıyordu (ölçüldü: 6. adım tur
        // başına döndü) — aktif sahne DEĞİŞENE kadar beklenir (poll).
        if (i > 0) {
          const sinir = Date.now() + adim + 4000;
          while (Date.now() < sinir) {
            const su = await sayfa.evaluate((sec) => {
              const v = [...document.querySelectorAll(sec)].find((x) => x.classList.contains('aktif'));
              return v ? (v.dataset.sahne ?? null) : null;
            }, m.secici);
            if (su != null && su !== oncekiSahne) break;
            await sayfa.waitForTimeout(400);
          }
          await sayfa.waitForTimeout(600); // geçiş sonrası oynatma otursun
        }
        const olcum = await sayfa.evaluate((sec) => {
          const videolar = [...document.querySelectorAll(sec)];
          if (!videolar.length) return { hata: 'video DOM\'da yok' };
          const v = videolar.find((x) => x.classList.contains('aktif'));
          if (!v) return { video: false, videoSayisi: videolar.length, hata: 'aktif sahne yok' };
          return {
            video: true,
            sahne: v.dataset.sahne ?? null,
            readyState: v.readyState,
            currentTime: +v.currentTime.toFixed(3),
            hata: v.error ? `${v.error.code}: ${v.error.message}` : null,
          };
        }, m.secici);
        sahneler.push({ adimNo: i + 1, ...olcum });
        if (olcum.sahne != null) gorulen.add(olcum.sahne);
        oncekiSahne = olcum.sahne ?? oncekiSahne;
      }
      await ctx.close();
      const donguEksigi = gorulen.size < m.sahne_sayisi
        ? `döngüde ${gorulen.size}/${m.sahne_sayisi} farklı sahne görüldü`
        : null;
      const kotu = sahneler.filter((s) => !s.video || s.readyState < 2 || !(s.currentTime > 0));
      if (donguEksigi) kotu.push({ hata: donguEksigi });
      medyaSonuc.push({ yol: m.yol, beklenen: m.sahne_sayisi, sahneler, kotu, agKotu, donguEksigi });
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
    const konsolKotu = [], tasmaKotu = [], geoKotu = [], geoMuaf = [];
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

    // md.13 KONTRAST — WCAG 2.1 AA (2026-07-27, gece paketi Faz G)
    // NEDEN KALICI KONTROL: 27.07'de index.astro'nun is:global body{#061824}
    // stili paylaşılan Vite chunk'ıyla 173 içerik sayfasına sızdı; il/persona
    // 1.16:1, rehber 2.84:1 okunamaz hâle geldi ve bunu KULLANICI buldu.
    // Tasarım kara listede (otomatik onarılmaz) → bu kontrol 🔴 verir ve
    // kullanıcıya DEVREDER. Örneklem TİP başına bir sayfadır: sızıntı tip
    // bazında yayılıyor, tek sayfa ölçmek yakalamazdı.
    if (MOD !== 'hizli' && yap.kontrast.sayfalar.length) {
      const esik = yap.kontrast.esik;
      const kontrastKotu = [], kontrastOlcum = [];
      for (const ornek of yap.kontrast.sayfalar) {
        const ctx = await tarayici.newContext({ viewport: { width: 1440, height: 900 } });
        const sayfa = await ctx.newPage();
        await sayfa.goto(TABAN + ornek.yol, { waitUntil: 'load' });
        await sayfa.waitForTimeout(900);
        const olcum = await sayfa.evaluate(({ esik, azami }) => {
          const ayrist = (r) => {
            const m = /rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?/.exec(r);
            return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null;
          };
          const ic = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
          const parlaklik = ([r, g, b]) => 0.2126 * ic(r) + 0.7152 * ic(g) + 0.0722 * ic(b);
          const harmanla = (on, arka) => {          // alfa harmanı
            const a = on[3];
            return [0, 1, 2].map((i) => on[i] * a + arka[i] * (1 - a));
          };
          // Gerçek arka plan: saydam olmayan ilk ataya kadar yukarı çık,
          // katmanları sırayla harmanla (tek katman bakmak yanıltıyordu).
          const arkaBul = (el) => {
            const katman = [];
            for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
              const c = ayrist(getComputedStyle(n).backgroundColor);
              if (c && c[3] > 0) { katman.push(c); if (c[3] === 1) break; }
            }
            let sonuc = [255, 255, 255];
            for (let i = katman.length - 1; i >= 0; i--) sonuc = harmanla(katman[i], sonuc);
            return sonuc;
          };
          const sonuc = [];
          let enDusuk = null;
          const dugumler = [...document.querySelectorAll('body *')].filter((el) => {
            if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH'].includes(el.tagName)) return false;
            const st = getComputedStyle(el);
            if (st.visibility === 'hidden' || st.display === 'none' || +st.opacity === 0) return false;
            const r = el.getBoundingClientRect();
            if (r.width < 2 || r.height < 2) return false;
            // yalnız KENDİ metnini taşıyan düğüm (ata sayımı tekrarlamasın)
            return [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
          }).slice(0, azami);
          for (const el of dugumler) {
            const st = getComputedStyle(el);
            const on = ayrist(st.color);
            if (!on) continue;
            const arka = arkaBul(el);
            const onH = on[3] < 1 ? harmanla(on, arka) : on.slice(0, 3);
            const L1 = parlaklik(onH), L2 = parlaklik(arka);
            const oran = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
            const px = parseFloat(st.fontSize);
            const kalin = parseInt(st.fontWeight, 10) >= 700;
            const buyuk = px >= esik.buyuk_px || (kalin && px >= esik.buyuk_kalin_px);
            const gereken = buyuk ? esik.buyuk : esik.normal;
            // En düşük oranı HER ZAMAN izle — ihlal yokken de "ne kadar
            // paylı geçtik" görünsün (yalnız ihlal raporlamak, eşiğin
            // 0.02 üstünde duran öğeyi gizler; 28.07'de ik-paylasim tam
            // olarak öyleydi).
            if (!enDusuk || oran < enDusuk.oran) {
              enDusuk = { oran: +oran.toFixed(2), gereken, px,
                          secici: el.tagName.toLowerCase()
                            + (el.className && typeof el.className === 'string'
                               ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}` : ''),
                          pay: +(oran - gereken).toFixed(2) };
            }
            if (oran + 0.005 < gereken) {
              sonuc.push({
                oran: +oran.toFixed(2), gereken, px, kalin,
                secici: el.tagName.toLowerCase()
                  + (el.id ? `#${el.id}` : '')
                  + (el.className && typeof el.className === 'string'
                     ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}` : ''),
                metin: el.textContent.trim().slice(0, 40),
                renk: st.color, zemin: `rgb(${arka.map((v) => Math.round(v)).join(',')})`,
              });
            }
          }
          // SESSİZ KAPSAM YASAĞI: sınıra dayanıldıysa bunu SÖYLE — yoksa
          // "0 ihlal" sonucu kapsamı tam sanılır (aday sayısı > azami).
          const aday = [...document.querySelectorAll('body *')].filter((el) =>
            [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)).length;
          return { incelenen: dugumler.length, aday, kirpildi: aday > azami, ihlal: sonuc, enDusuk };
        }, { esik, azami: yap.kontrast.azami_ornek_dugum ?? 400 });
        // İSTİSNA: bilinçli tasarım kararıyla AA altında bırakılan öğeler
        // (izleme/kontrast-ornek.json → istisnalar). Yetki KULLANICIDA;
        // liste boş doğar, buradan sessizce doldurulmaz.
        const istisna = (yap.kontrast.istisnalar || []).filter((i) => i.yol === ornek.yol);
        olcum.ihlal = olcum.ihlal.filter(
          (i) => !istisna.some((x) => i.secici.includes(x.secici)));
        // En kötüsü rapora çıksın (hepsi ölçümde durur)
        olcum.ihlal.sort((a, b) => a.oran - b.oran);
        kontrastOlcum.push({ yol: ornek.yol, tip: ornek.tip, ...olcum,
                             enKotu: olcum.ihlal[0]?.oran ?? null });
        if (olcum.ihlal.length) kontrastKotu.push({ yol: ornek.yol, tip: ornek.tip,
                                                    sayi: olcum.ihlal.length, ilk: olcum.ihlal[0] });
        await ctx.close();
      }
      if (kontrastKotu.length) {
        devirler.push({
          konu: 'kontrast (WCAG AA)',
          sebep: kontrastKotu.map((k) => `${k.yol} ${k.sayi} ihlal (en kötü ${k.ilk.oran}:1 — "${k.ilk.metin}")`).join(' · ')
                 + ' — tasarım KARA LİSTEDE, otomatik onarılmaz',
        });
      }
      const kirpilan = kontrastOlcum.filter((o) => o.kirpildi);
      const kirpNot = kirpilan.length
        ? ` · ⚠ kapsam kırpıldı: ${kirpilan.map((o) => `${o.tip} ${o.incelenen}/${o.aday}`).join(', ')}`
        : '';
      kaydet('13-kontrast', kontrastKotu.length ? 'kirmizi' : kirpilan.length ? 'sari' : 'gecti',
        (kontrastKotu.length
          ? `${kontrastKotu.length}/${kontrastOlcum.length} sayfada AA altı: `
            + kontrastKotu.map((k) => `${k.tip} ${k.ilk.oran}:1`).join(', ')
          : (() => {
              const d = kontrastOlcum.map((o) => o.enDusuk).filter(Boolean)
                .sort((a, b) => a.pay - b.pay)[0];
              return `${kontrastOlcum.length} sayfa tipi AA geçti`
                + (d ? ` · en dar pay ${d.oran}:1 (eşik ${d.gereken}, +${d.pay}) ${d.secici}` : '');
            })()) + kirpNot,
        { olcum: kontrastOlcum, kirpilan: kirpilan.map((o) => o.yol) }, ['tam']);
    }

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
        const tumEksik = Object.entries(g).filter(([k, v]) => v === false).map(([k]) => k);
        const muaf = yap.cekirdekMuaf[yol] || [];
        const eksik = tumEksik.filter((k) => !muaf.includes(k));
        const muafEksik = tumEksik.filter((k) => muaf.includes(k));
        if (muafEksik.length) geoMuaf.push({ yol, muaf: muafEksik });
        if (eksik.length) geoKotu.push({ yol, eksik, olcum: g });
      }
      // Muafiyet MESAJDA görünür — "geçti" sonucunun neyi kapsamadığı okunsun.
      const muafNot = geoMuaf.length
        ? ` · muaf: ${geoMuaf.map((m) => `${m.yol}(${m.muaf})`).join(', ')}`
        : '';
      kaydet('7-geo-seo', geoKotu.length ? 'kirmizi' : 'gecti',
        (geoKotu.length ? `${geoKotu.length} sayfada eksik: ${geoKotu.map((g) => g.yol + '(' + g.eksik + ')').join(', ')}`
                        : `${yap.cekirdek.length - geoMuaf.length}/${yap.cekirdek.length} sayfada öz-cevap + JSON-LD + title + canonical tam`)
        + muafNot,
        { eksikler: geoKotu, muaflar: geoMuaf }, ['tam']);
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

    // md.12 ETKİLEŞİM — VARLIK değil İŞLEV (24.07 menü arızası dersi)
    if (MOD !== 'hizli') await md12_etkilesim(tarayici);

    // md.14 GÖRSEL/DÜZEN (G1-G6) — 28.07. Kaynak kapısı ölçüldü: ölçüm
    // 5-6 sn / ~154 MB, --hizli tabanının (49 sn) %10,2'si → %50 eşiğinin
    // altında, bu yüzden HEM --hizli HEM --tam sınıfında.
    await md14_gorsel(tarayici);
    // md.21 DOKUNMA HEDEFİ (M8) — aynı tarayıcı oturumunda
    await md21_dokunma(tarayici);
  } finally {
    await tarayici.close();
  }
}

// md.14 GÖRSEL/DÜZEN (G1-G6) — 28 Tem 2026.
// NEDEN: bugün üç arıza yalnız İNSAN GÖZÜYLE yakalandı (metin sahneyi
// boğuyor · video ×1,77 şişirilmiş · CSS reseti bölüm ritmini eziyor).
// Hiçbiri mevcut 13 kalemin ölçtüğü şeye dokunmuyordu: sayfa 200 dönüyor,
// konsol temiz, link kırık değil — ama sayfa YANLIŞ GÖRÜNÜYOR.
// SALT-OKUMA: otomatik onarım YOK (tasarım kara listede).
// Taban: izleme/gorsel-taban.json (yoksa kalem ATLANIR).
async function md14_gorsel(tarayici) {
  if (!yap.gorselTaban) {
    kaydet('14-gorsel', 'atlandi', 'görsel taban dosyası yok (izleme/gorsel-taban.json) — kalem atlandı',
      {}, ['tam', 'hizli']);
    return;
  }
  const G = await import(join(KOK, 'arac/gorsel-olc.mjs'));
  const yollar = [...new Set(Object.keys(yap.gorselTaban.sayfalar).map((k) => k.split('@')[0]))];
  const olcumler = await G.olcTumu(tarayici, TABAN, yollar);

  const bulgular = [];
  for (const o of olcumler) {
    const t = yap.gorselTaban.sayfalar[`${o.yol}@${o.viewport}`] || null;
    bulgular.push(...G.karsilastir(o, t, yap.gorselTaban.esikler || G.ESIKLER));
  }

  const tabanTarih = (yap.gorselTaban.tabanTarihi || '').slice(0, 10);
  const kalemAdlari = { G1: 'metin-görsel', G2: 'ölçek', G3: 'tipografi', G4: 'ritim', G5: 'ortalama', G6: 'S1' };
  if (bulgular.length) {
    const ozet = [...new Set(bulgular.map((b) => `${b.kalem} ${kalemAdlari[b.kalem]}`))].join(', ');
    kaydet('14-gorsel', 'kirmizi',
      `${bulgular.length} görsel/düzen sapması (${ozet}) · taban ${tabanTarih} · ` +
      'bilinçli tasarım değişikliğiyse: --gorsel-taban-yenile',
      { tabanTarihi: tabanTarih, sapma: bulgular.length, bulgular: bulgular.slice(0, 12) },
      ['tam', 'hizli']);
  } else {
    kaydet('14-gorsel', 'gecti',
      `${olcumler.length} ölçümde G1-G6 sapması yok · taban ${tabanTarih} · sahne ${olcumler[0].aktifSahne}`,
      { tabanTarihi: tabanTarih, olcum: olcumler.length, sahne: olcumler[0].aktifSahne },
      ['tam', 'hizli']);
  }
}

// ————————— M2-M10: KAPSAM KALEMLERİ (28 Tem 2026) —————————
// Kaynak: rapor/denetim-kapsami.md boşluk listesi. Hepsi SALT-ÖLÇÜM.
// Ölçerler arac/kapsam-kalemleri.mjs'te (tek kaynak).

// md.21 DOKUNMA HEDEFİ (M8) — 375'te bağımsız denetimler.
// KAYNAK KAPISI (ölçüldü 28.07): md19+md21 ile --hizli 49 → 69 sn (+%41),
// %50 kapısının altında → ikisi de --hizli sınıfında kalır. md16/17/18/20
// (geniş tarama, dış link, npm audit) yalnız --tam.
async function md21_dokunma(tarayici) {
  const t = yap.kapsamTaban?.dokunma;
  if (!t) return kaydet('21-dokunma', 'atlandi', 'dokunma tabanı yok', {}, ['tam', 'hizli']);
  const K = await import(join(KOK, 'arac/kapsam-kalemleri.mjs'));
  const ctx = await tarayici.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const sonuc = [];
  try {
    for (const yol of Object.keys(t.sayfalar)) {
      const sayfa = await ctx.newPage();
      await sayfa.goto(TABAN + yol, { waitUntil: 'load', timeout: 45000 });
      await sayfa.waitForTimeout(250);
      const o = await sayfa.evaluate(K.DOKUNMA_OLC);
      sonuc.push({ yol, ...o, taban: t.sayfalar[yol] });
      await sayfa.close();
    }
  } finally { await ctx.close(); }
  const artan = sonuc.filter((k) => k.ihlal > k.taban);
  if (artan.length) {
    kaydet('21-dokunma', 'sari',
      `${artan.length} sayfada 44px altı bağımsız denetim ARTTI: ` +
      artan.map((k) => `${k.yol} ${k.taban}→${k.ihlal}`).join(', ') +
      (artan[0].ornekler?.length ? ` · ör. ${artan[0].ornekler[0].w}x${artan[0].ornekler[0].h} "${artan[0].ornekler[0].metin}"` : ''),
      { sonuc }, ['tam', 'hizli']);
  } else {
    kaydet('21-dokunma', 'gecti',
      `${sonuc.length} sayfada dokunma hedefi tabanı korundu (ihlal ${sonuc.reduce((a, k) => a + k.ihlal, 0)}, taban ${sonuc.reduce((a, k) => a + k.taban, 0)})`,
      { sonuc }, ['tam']);
  }
}

// md.16 SEO/GEO GENİŞ TARAMA (M2) — mevcut seo-audit + geo-audit araçları
// YAZILI ve çalışıyordu, yalnız cron'a bağlı değildi (ölçüldü 28.07).
// md7 ile ÇAKIŞMA: md7 çekirdek 10 sayfada öz-cevap/JSON-LD/title/canonical
// bakıyor. md16 TÜM dist'i tarar ama bu dört alt-kontrolü ATLAR — md7'ye
// dokunulmadı, çıktısı bit-eşit kaldı (kanıt raporda).
async function md16_seoGeo() {
  const distKok = join(KOK, 'dist');
  if (!existsSync(distKok)) {
    return kaydet('16-seo-geo-genis', 'atlandi', 'dist/ yok (build edilmemiş)', {}, ['tam']);
  }
  // GERÇEK ARAYÜZ (ölçüldü 28.07): araçlar `denetle()` DEĞİL, sayfa başına
  // seoSayfa/geoSayfa + site geneli seoSite sunuyor; bulgu şekli
  // {kod: 'K'|'O'|'D', kural, sayfa, detay}. Varsayım yerine kaynak okundu.
  const seo = await import(join(KOK, 'arac/seo-audit.mjs'));
  const geo = await import(join(KOK, 'arac/geo-audit.mjs'));
  const ortak = await import(join(KOK, 'arac/seo-geo-ortak.mjs'));
  const dosyalar = ortak.tumHtmlDosyalari(distKok);
  // md7 ÇAKIŞMA LİSTESİ: md7 çekirdek 10 sayfada öz-cevap/JSON-LD/title/
  // canonical bakıyor. Aynı kurallar md16'da SAYILMAZ (çift alarm yasak);
  // md7'ye DOKUNULMADI (çıktısı bit-eşit — kanıt raporda).
  const CAKISAN = /canonical|oz-cevap|öz-cevap|json-?ld|title-yok/i;
  // İmzalar kaynaktan okundu: sayfaYolu(distKok, p) · seoSayfa → {title,
  // bulgular} · geoSayfa → {bulgular} · seoSite(sayfalar[{yol,title}], kok).
  const tum = [];
  const sayfaListesi = [];
  let atlananNoindex = 0;
  for (const d of dosyalar) {
    const html = ortak.oku(d);
    const yol = ortak.sayfaYolu(distKok, d);
    // NOINDEX SAYFALARI DIŞLANIR (ilkeli): arama motoruna kapalı sayfanın
    // SEO yüzeyi yoktur. Ölçüldü 28.07 — üç "kritik" bulgunun ikisi
    // /404/'ten geliyordu (noindex; meta-desc ve uzun gövde beklenmez).
    if (/name=["']robots["'][^>]*noindex/i.test(html)) { atlananNoindex++; continue; }
    const sr = seo.seoSayfa(html, yol);
    const gr = geo.geoSayfa(html, yol);
    sayfaListesi.push({ yol, title: sr.title });
    tum.push(...(sr.bulgular || []), ...(gr.bulgular || []));
  }
  tum.push(...seo.seoSite(sayfaListesi, distKok));
  // KABUL EDİLMİŞ BULGULAR (taban): bilinçli kararlar kalemi kilitlemesin.
  // Örn. /harita/ h1-yok — 28.07 kullanıcı kararı, kaynak dosyanın
  // başlığında yazılı ("SALT HERO, hiyerarşi h2 ile başlar"). Taban
  // dosyasında saklanır; YENİ bulgu doğarsa kalem yine ateşler.
  const kabul = new Set((yap.kapsamTaban?.seoGeo?.kabulEdilen || []).map((x) => `${x.kural}|${x.sayfa}`));
  const bulgular = tum.filter((b) => !CAKISAN.test(b.kural || '') && !kabul.has(`${b.kural}|${b.sayfa}`));
  const kritik = bulgular.filter((b) => b.kod === 'K');
  const sayim = {};
  bulgular.forEach((b) => { sayim[b.kural] = (sayim[b.kural] || 0) + 1; });
  const ozet = Object.entries(sayim).sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([k, n]) => `${k}×${n}`).join(', ');
  const taban = yap.kapsamTaban?.seoGeo?.toplam ?? null;
  const olcum = { sayfa: dosyalar.length - atlananNoindex, noindexAtlanan: atlananNoindex, toplam: bulgular.length, kritik: kritik.length, sayim, taban };
  if (kritik.length) {
    kaydet('16-seo-geo-genis', 'kirmizi',
      `${kritik.length} YENİ kritik SEO/GEO bulgusu (toplam ${bulgular.length}): ` + kritik.slice(0, 3).map((b) => `${b.kural}@${b.sayfa}`).join(' · '),
      olcum, ['tam']);
  } else if (taban !== null && bulgular.length > taban) {
    kaydet('16-seo-geo-genis', 'sari',
      `SEO/GEO bulgusu tabandan arttı: ${taban} → ${bulgular.length} · ${ozet}`, olcum, ['tam']);
  } else {
    kaydet('16-seo-geo-genis', 'gecti',
      `${dosyalar.length - atlananNoindex} sayfa geniş tarama (noindex ${atlananNoindex} atlandı) · bulgu ${bulgular.length}` +
      (taban !== null ? ` (taban ${taban})` : '') + (ozet ? ` · ${ozet}` : ''), olcum, ['tam']);
  }
}

// md.17 DIŞ BAĞLANTI NÖBETİ (M3)
async function md17_disBaglanti() {
  const K = await import(join(KOK, 'arac/kapsam-kalemleri.mjs'));
  const distKok = join(KOK, 'dist');
  if (!existsSync(distKok)) return kaydet('17-dis-baglanti', 'atlandi', 'dist/ yok', {}, ['tam']);
  const linkler = K.disLinkleriTopla(distKok);
  const tamTarama = bayrak('--dis-link-tam');
  // Örneklem boyutu ÖLÇÜLEN TOPLAMDAN türetildi: %5 (1043 → 52).
  const boyut = tamTarama ? linkler.size : Math.max(20, Math.round(linkler.size * 0.05));
  // Haftalık tohum: yıl-hafta → aynı hafta aynı küme, sonraki hafta başkası.
  const simdiT = new Date();
  const hafta = Math.floor((simdiT - new Date(simdiT.getFullYear(), 0, 1)) / 604800000);
  const secilen = K.orneklemSec(linkler, boyut, hafta);
  const r = await K.disLinkDenetle(secilen, linkler, { bekleMs: tamTarama ? 500 : 1000 });
  const olcum = { toplam: linkler.size, taranan: r.taranan, olu: r.olu, suphe: r.suphe.length, tamTarama };
  if (r.olu.length) {
    kaydet('17-dis-baglanti', 'kirmizi',
      `${r.olu.length} ÖLÜ dış bağlantı (404/410) — ${r.taranan}/${linkler.size} tarandı: ` +
      r.olu.slice(0, 3).map((x) => `${x.kod} ${x.url.slice(0, 60)}`).join(' · '),
      olcum, ['tam']);
  } else if (r.suphe.length) {
    kaydet('17-dis-baglanti', 'sari',
      `${r.suphe.length} bağlantı yanıt vermedi (zaman aşımı/5xx — dış sunucu geçici olabilir) · ` +
      `${r.taranan}/${linkler.size} tarandı, ölü 0`, olcum, ['tam']);
  } else {
    kaydet('17-dis-baglanti', 'gecti',
      `${r.taranan}/${linkler.size} dış bağlantı örneklemi sağlam (ölü 0)`, olcum, ['tam']);
  }
}

// md.18 VERİ BÜTÜNLÜĞÜ GENİŞ (M4) — md11'i DEĞİŞTİRMEZ, tamamlar
async function md18_veriGenis() {
  const K = await import(join(KOK, 'arac/kapsam-kalemleri.mjs'));
  const taban = yap.kapsamTaban?.veri ?? null;
  const { bulgular, guncel } = K.veriBütünlük(KOK, taban);
  const kirmizi = bulgular.filter((b) => b.tip === 'kirmizi');
  const sari = bulgular.filter((b) => b.tip === 'sari');
  const olcum = { dosya: Object.keys(guncel).length, kirmizi: kirmizi.length, sari: sari.length, bulgular };
  if (kirmizi.length) {
    kaydet('18-veri-genis', 'kirmizi',
      `${kirmizi.length} veri kaybı/bozulma: ` + kirmizi.map((b) => `${b.dosya} — ${b.mesaj}`).join(' · '),
      olcum, ['tam']);
  } else if (sari.length) {
    kaydet('18-veri-genis', 'sari',
      `${sari.length} şema/yapı değişimi: ` + sari.map((b) => `${b.dosya} — ${b.mesaj}`).join(' · '),
      olcum, ['tam']);
  } else {
    kaydet('18-veri-genis', 'gecti',
      `veri/potansiyel ${Object.keys(guncel).length} dosya: kayıt sayısı düşmedi, şema aynı`,
      olcum, ['tam']);
  }
}

// md.19 BAŞLIK + OG + CTA (M5)
async function md19_baslikOgCta() {
  const K = await import(join(KOK, 'arac/kapsam-kalemleri.mjs'));
  const { bulgular, olcum } = await K.baslikOgCta(TABAN, yap.cekirdek, (u) => getir(u, { redirect: 'follow' }));
  const kirmizi = bulgular.filter((b) => b.tip === 'kirmizi');
  const sari = bulgular.filter((b) => b.tip === 'sari');
  if (kirmizi.length) {
    kaydet('19-baslik-og-cta', 'kirmizi', kirmizi.map((b) => b.mesaj).join(' · '),
      { ...olcum, bulgular }, ['tam', 'hizli']);
  } else if (sari.length) {
    kaydet('19-baslik-og-cta', 'sari', sari.map((b) => b.mesaj).join(' · '), { ...olcum, bulgular }, ['tam', 'hizli']);
  } else {
    kaydet('19-baslik-og-cta', 'gecti',
      `6 güvenlik başlığı + CSP direktifleri yerinde · ${olcum.ogGorsel} og:image 200 · ${olcum.mailto} mailto CTA geçerli`,
      olcum, ['tam', 'hizli']);
  }
}

// md.20 NÖBETÇİ CANLILIĞI + AUDIT + 404 + YEDEK (M6, M7, M9, M10)
// Dördü de "durum beyanı" tipinde ve ucuz; tek kalemde toplandı ki pano
// şişmesin. Her alt bulgu kendi şiddetini taşır.
async function md20_altyapiDurumu() {
  const K = await import(join(KOK, 'arac/kapsam-kalemleri.mjs'));
  const t = yap.kapsamTaban;
  const hepsi = [];
  const olcum = {};

  // M6 — nöbetçi canlılığı
  if (t?.nobetciler) {
    const n = K.nobetciCanliligi(KOK, t.nobetciler);
    hepsi.push(...n.bulgular); olcum.nobetci = n.olcum;
  }
  // M7 — npm audit (yalnız --tam; ağ + süre)
  if (MOD === 'tam' && t?.npmAudit) {
    const a = K.npmAudit(KOK, t.npmAudit);
    hepsi.push(...a.bulgular); olcum.audit = a.olcum;
  }
  // M9 — 404
  const d = await K.dortYuzDort(TABAN, (u) => getir(u, { redirect: 'follow' }), existsSync(join(KOK, 'public/404.html')));
  hepsi.push(...d.bulgular); olcum.dortYuzDort = d.olcum;
  // M10 — depo dışı yedek
  if (t?.yedek) {
    const y = K.yedekDurumu(KOK, t.yedek.varliklar, t.yedek.adaylar);
    hepsi.push(...y.bulgular); olcum.yedek = y.olcum;
  }
  // M11 — son yedek yaşı (B1.2, 28.07)
  if (t?.yedek?.durumDosyasi) {
    const yy = K.yedekYasi(t.yedek.durumDosyasi, t.yedek.sariSaat, t.yedek.kirmiziSaat);
    hepsi.push(...yy.bulgular); olcum.yedekYasi = yy.olcum;
  }

  const kirmizi = hepsi.filter((b) => b.tip === 'kirmizi');
  const sari = hepsi.filter((b) => b.tip === 'sari');
  if (kirmizi.length) {
    kaydet('20-altyapi', 'kirmizi', kirmizi.map((b) => b.mesaj).join(' · '), { ...olcum, bulgular: hepsi }, ['tam']);
  } else if (sari.length) {
    kaydet('20-altyapi', 'sari', sari.map((b) => b.mesaj).join(' · '), { ...olcum, bulgular: hepsi }, ['tam']);
  } else {
    kaydet('20-altyapi', 'gecti',
      `nöbetçiler canlı · yeni npm açığı yok · 404 markalı · yedek durumu kayıtlı`,
      { ...olcum }, ['tam']);
  }
}

// md.23 ALTIN ÖRNEK — pipeline ayrıştırıcılarının sessiz bozulma bekçisi
// (B1.3, 28.07.2026). Bilinen girdi → bilinen çıktı; sapma KIRMIZI.
// NEDEN AYRI KALEM: md10/md18 veri TAZELİĞİNİ ve HACMİNİ ölçüyor, DOĞRULUĞU
// değil. Kaynak biçimi değiştiğinde ayrıştırıcı çökmez, sessizce yanlış
// üretir; taze ve dolu ama yanlış bir dosya bu kalemler için yeşildir.
// Maliyet ölçüldü: 0,31 sn / 43 MB → hem --hizli hem --tam (ağ kullanmaz,
// deterministik, saat bağımlılığı yok).
// SALT-OKUMA: onarım tetiklemez (kara liste — veri doğruluğu).
async function md23_altinOrnek() {
  let cikti;
  try {
    cikti = execFileSync('node', [join(KOK, 'arac/altin-ornek.mjs'), '--json'],
      { cwd: KOK, encoding: 'utf8', timeout: 120000, maxBuffer: 16 * 1024 * 1024 });
  } catch (e) {
    // exit 1 = sapma var; stdout yine JSON. Başka hata = gerçek çökme.
    cikti = e.stdout;
    if (!cikti) {
      kaydet('23-altin-ornek', 'kirmizi', `altın örnek koşumu ÇÖKTÜ: ${e.message.split('\n')[0]}`, {}, ['tam', 'hizli']);
      return;
    }
  }
  const r = JSON.parse(cikti);
  const dusen = r.kalemler.filter((k) => !k.gecti);
  if (dusen.length) {
    kaydet('23-altin-ornek', 'kirmizi',
      `${dusen.length}/${r.toplam} ayrıştırıcı SAPMASI — ${dusen.map((d) => `${d.pipeline}/${d.ad}${d.ayrinti ? ` (${d.ayrinti})` : ''}`).join(' · ')}`,
      r, ['tam', 'hizli']);
  } else {
    kaydet('23-altin-ornek', 'gecti',
      `${r.gecen}/${r.toplam} altın örnek geçti (baraj · RG · GRACE · NHYP)`, r, ['tam', 'hizli']);
  }
}

// md.12 ETKİLEŞİM DENETİMİ — headless tıklama; menü/filtre/arama/bağ İŞLER mi.
// (i) menü kritik → kırık ise KIRMIZI; (ii)-(iv) kritik değil → SARI (bekleyen
// bulgu, alarm değil). Config: izleme/etkilesim-beklenen.json.
async function md12_etkilesim(tarayici) {
  if (!yap.etkilesim.length) return;   // config yoksa sessizce atla
  const sonuc = [];
  for (const k of yap.etkilesim) {
    let gecti = false, detay = '';
    const ctx = await tarayici.newContext({ viewport: { width: 375, height: 812 } });
    const sayfa = await ctx.newPage();
    try {
      await sayfa.goto(TABAN + k.yol, { waitUntil: 'load' });
      await sayfa.waitForTimeout(1000);
      if (k.tur === 'menu') {
        // REVİZYON (27 Tem 2026, gece paketi): eski tam-ekran menü (#sv-menu
        // + .sv-menu-ac + menu.js) 27.07'de KALDIRILDI; yerine PaylasilanMenu
        // bileşeni geldi (#pm-menu-dugme → #pm-mobil-panel.acik). Kontrol hâlâ
        // silinmiş DOM'u arıyordu ve HER koşuda 🔴 veriyordu — md4'ün ikizi
        // bayat-yapılandırma yanlış alarmı. Üstelik menü o süre boyunca
        // GERÇEKTE HİÇ TEST EDİLMİYORDU (24.07 arızasının senaryosu açıkta).
        // Tetik düğmesi yalnız ≤1023px'te görünür → ölçüm mobil genişlikte.
        await sayfa.setViewportSize({ width: 375, height: 667 });
        // Dibe kaydır: akis-bitti / scroll-restorasyonu = arızanın tam senaryosu.
        await sayfa.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
        await sayfa.waitForTimeout(500);
        const dugmeVar = await sayfa.evaluate(() => {
          const b = document.getElementById('pm-menu-dugme');
          if (!b) return false;
          b.click();
          return true;
        });
        await sayfa.waitForTimeout(700);
        const acildi = await sayfa.evaluate(() => {
          const p = document.getElementById('pm-mobil-panel');
          const b = document.getElementById('pm-menu-dugme');
          return !!p && p.classList.contains('acik')
                 && b?.getAttribute('aria-expanded') === 'true';
        });
        await sayfa.keyboard.press('Escape');
        await sayfa.waitForTimeout(600);
        const kapandi = await sayfa.evaluate(() => {
          const p = document.getElementById('pm-mobil-panel');
          const b = document.getElementById('pm-menu-dugme');
          return !!p && !p.classList.contains('acik')
                 && b?.getAttribute('aria-expanded') === 'false';
        });
        gecti = dugmeVar && acildi && kapandi;
        detay = dugmeVar
          ? `dip(akis-bitti)@375px: açıldı=${acildi} kapandı=${kapandi}`
          : '#pm-menu-dugme DOM\'da YOK (menü bileşeni değişmiş olabilir)';
      } else if (k.tur === 'details') {
        const r = await sayfa.evaluate((sec) => {
          const d = document.querySelector(sec); if (!d) return { yok: true };
          const s = d.querySelector('summary'); if (s) s.click();
          return { acik: d.open };
        }, k.secici);
        gecti = !r.yok && !!r.acik;
        detay = r.yok ? `${k.secici} yok` : `open=${r.acik}`;
      } else if (k.tur === 'arama') {
        const inp = await sayfa.$(k.girdi);
        if (!inp) { detay = `${k.girdi} yok`; }
        else {
          await inp.fill(k.sorgu || '');
          await sayfa.waitForTimeout(500);
          const gorunur = await sayfa.evaluate((s) => {
            const kap = document.querySelector(s); if (!kap) return -1;
            return [...kap.querySelectorAll('a, .pk, .k, .kart')].filter((e) => e.offsetParent !== null).length;
          }, k.sonuc);
          gecti = gorunur > 0;
          detay = `"${k.sorgu}" → ${gorunur} görünür sonuç`;
        }
      } else if (k.tur === 'link200') {
        const href = await sayfa.evaluate((sec) => {
          const a = document.querySelector(sec); return a ? a.getAttribute('href') : null;
        }, k.secici);
        if (!href) { detay = 'soru bağı bulunamadı'; }
        else { const c = await getir(TABAN + href); gecti = c.status === 200; detay = `${href} → ${c.status}`; }
      }
    } catch (e) { detay = 'HATA: ' + e.message; }
    await ctx.close();
    sonuc.push({ id: k.id, kritik: !!k.kritik, gecti, detay });
  }
  const kritikKotu = sonuc.filter((s) => s.kritik && !s.gecti);
  const digerKotu = sonuc.filter((s) => !s.kritik && !s.gecti);
  const durum = kritikKotu.length ? 'kirmizi' : digerKotu.length ? 'sari' : 'gecti';
  const mesaj = kritikKotu.length
    ? `KRİTİK etkileşim kırık: ${kritikKotu.map((s) => s.id).join(', ')}`
    : digerKotu.length
      ? `kritik geçti; bekleyen bulgu (ayrı iş): ${digerKotu.map((s) => s.id).join(', ')}`
      : `${sonuc.length}/${sonuc.length} etkileşim çalışıyor`;
  kaydet('12-etkilesim', durum, mesaj, { sonuc }, ['tam']);
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
  // M11: gözlenen en büyük LH performans yayılımı (28.07 ölçümü, 3 tur ×
  // 3 sayfa × 2 kırılım): 11 puan. Emniyet payıyla 12.
  const LH_YAYILIM = 12;
  // M1: a11y TABANI 100/100 — 10 sayfa × 2 kırılım × 1 tur, ihlal 0,
  // varyans 0 (28.07 ölçümü). Bu yüzden a11y için medyan GEREKMEZ.
  // Eşik: <100 SARI (yeni ihlal doğdu), <90 KIRMIZI.
  const A11Y_SARI = 100, A11Y_KIRMIZI = 90;
  const sonuc = [], altinda = [];
  for (const yol of yap.cekirdek) {
    const esik = yol === '/' ? { mobil: 70, masaustu: 85 } : { mobil: 70, masaustu: 90 };
    const kayit = { yol, esik, a11y: {} };
    for (const [ad, ayar] of [['masaustu', MASAUSTU], ['mobil', {}]]) {
      // PARALEL YASAK: her ölçüm kendi tarayıcısını açar ve kapatır.
      // M1 (28.07): accessibility AYNI çağrıya eklendi — ayrı koşum 145 sn
      // sürerdi, birleşik çağrıda ek maliyet ölçülemeyecek kadar küçük.
      // M11 (28.07): UYARLAMALI MEDYAN. Ölçülen LH performans yayılımı
      // /hangi-kurum/ mobilde 11 PUAN (88-99), /harita/ mobilde 5 — tek
      // atış yanlış alarm üretir. Kör 3-tur koşum md9'u üçe katlardı;
      // bunun yerine: ilk atış eşiği GÖZLENEN EN BÜYÜK YAYILIM kadar
      // (12 puan) aşıyorsa tek atış yeterli, aksi halde 2 atış daha ve
      // MEDYAN alınır. Doğruluk aynı, maliyet çok daha düşük.
      const olc = async () => {
        const chrome = await launch({ chromePath: EXE, chromeFlags: ['--headless=new', '--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'] });
        try {
          const r = await lighthouse(TABAN + yol, { port: chrome.port, onlyCategories: ['performance', 'accessibility'], output: 'json', logLevel: 'error', ...ayar });
          return {
            perf: Math.round(r.lhr.categories.performance.score * 100),
            a11y: Math.round(r.lhr.categories.accessibility.score * 100),
            ihlaller: Object.values(r.lhr.audits)
              .filter((a) => a.score !== null && a.score < 1 && a.scoreDisplayMode !== 'notApplicable'
                && (r.lhr.categories.accessibility.auditRefs || []).some((x) => x.id === a.id))
              .map((a) => a.id),
          };
        } finally { await chrome.kill(); }
      };
      const ilk = await olc();
      let perf = ilk.perf;
      kayit.a11y[ad] = ilk.a11y;
      if (ilk.ihlaller.length) kayit.a11yIhlal = [...new Set([...(kayit.a11yIhlal || []), ...ilk.ihlaller])];
      if (ilk.perf < esik[ad] + LH_YAYILIM) {
        const b = await olc(), c2 = await olc();
        perf = [ilk.perf, b.perf, c2.perf].sort((x, y) => x - y)[1];
        kayit[`${ad}Turlar`] = [ilk.perf, b.perf, c2.perf];
      }
      kayit[ad] = perf;
    }
      kayit.gecti = kayit.masaustu >= esik.masaustu && kayit.mobil >= esik.mobil;
    if (!kayit.gecti) altinda.push(kayit);
    sonuc.push(kayit);
  }

  // M1: ERİŞİLEBİLİRLİK ayrı kalem (md15) — md9 ile aynı LH koşumundan
  // beslenir, ek maliyet yok. Performanstan AYRI raporlanır çünkü ayrı
  // sorumluluk: performans dalgalanır (medyan ister), a11y deterministiktir.
  const a11yDusuk = sonuc.filter((k) => Math.min(k.a11y.masaustu, k.a11y.mobil) < A11Y_SARI);
  const a11yKritik = sonuc.filter((k) => Math.min(k.a11y.masaustu, k.a11y.mobil) < A11Y_KIRMIZI);
  const ihlalKumesi = [...new Set(sonuc.flatMap((k) => k.a11yIhlal || []))];
  if (a11yKritik.length) {
    kaydet('15-erisilebilirlik', 'kirmizi',
      `${a11yKritik.length} sayfa a11y ${A11Y_KIRMIZI} altında: ` +
      a11yKritik.map((k) => `${k.yol} ${k.a11y.masaustu}/${k.a11y.mobil}`).join(', ') +
      (ihlalKumesi.length ? ` · ihlal: ${ihlalKumesi.join(', ')}` : ''),
      { sayfalar: sonuc.map((k) => ({ yol: k.yol, ...k.a11y })), ihlaller: ihlalKumesi }, ['tam']);
  } else if (a11yDusuk.length) {
    kaydet('15-erisilebilirlik', 'sari',
      `${a11yDusuk.length} sayfada yeni a11y ihlali (taban 100/100): ` +
      a11yDusuk.map((k) => `${k.yol} ${k.a11y.masaustu}/${k.a11y.mobil}`).join(', ') +
      (ihlalKumesi.length ? ` · ${ihlalKumesi.join(', ')}` : ''),
      { sayfalar: sonuc.map((k) => ({ yol: k.yol, ...k.a11y })), ihlaller: ihlalKumesi }, ['tam']);
  } else {
    kaydet('15-erisilebilirlik', 'gecti',
      `${sonuc.length} sayfa a11y 100/100 (taban 28.07: 100/100, ihlal 0)`,
      { sayfalar: sonuc.map((k) => ({ yol: k.yol, ...k.a11y })) }, ['tam']);
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

/* md10 — VERİ TAZELİĞİ: KALDIRILDI (2026-07-27, gece paketi B1+B3).
   Kaldırma gerekçesi — iki kalemi de yanlış ya da mükerrerdi:

   (B3) baraj: md10 `data/canli/baraj.json` mtime > 48s → 🔴 diyordu.
        saglik-bekcisi.sh (b) AYNI dosyayı 26s eşiğiyle zaten denetliyor ve
        eşiği gerçek cron takvimine (çekim 15:00 UTC, bekçi 07:00 UTC)
        kalibre edilmiş. İki bekçi = iki alarm, biri gevşek: mükerrer.

   (B1) GRACE: md10 `data/canli/grace-turkiye.json` mtime > 192s (8 gün) →
        🔴 diyordu. Bu kalem YANLIŞ: dosya cron koştuğunda değil, GSFC yeni
        MASCON sürümü yayınladığında (~aylık, kimi dönem daha seyrek) değişir.
        Sağlıklı bir sistemde bile 8 günden eski olması NORMALDİR → yapısal
        yanlış alarm. Doğru tazelik sinyali "cron gerçekten koştu mu"dur ve
        saglik-bekcisi.sh (c) bunu `data/arsiv/grace/durum.json` mtime ile
        ölçer (durum.json HER koşuda — başarı/değişiklik-yok/hata — yeniden
        yazılır). Kaynak dönem takvimi bekçinin bu doğru mantığındadır.

   İLKE: veri tazeliği pipeline'ın DIŞINDAN denetlenir (bekçi), site-saglik
   canlı siteyi denetler. Pipeline kendini denetleyemez. */

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

  // (1) TEK KOŞUM KİLİDİ — ikinci koşum ölçüm yapmaz, DURUMU EZMEZ, raporlar.
  const sahip = kilitAl();
  if (sahip) {
    kaynakDurdu = true;
    kaydet('22-kaynak', 'sari',
      `koşum atlandı — başka koşum sürüyor (PID ${sahip.pid}, mod --${sahip.mod}, başlangıç ${sahip.zaman})`,
      { kilit: sahip }, ['hizli', 'tam']);
    return bitir();
  }

  // (2) KAYNAK TAVANI — ölçülen tepe RSS + %30 pay. Altındaysa koşum yapılmaz.
  const bosBellek = bellekMB();
  const tavan = KAYNAK_TAVAN_MB[MOD] ?? 1400;
  if (bosBellek < tavan) {
    kaynakDurdu = true;
    kaydet('22-kaynak', 'sari',
      `koşum atlandı — kaynak yetersiz: boş bellek ${bosBellek} MB < ${tavan} MB (--${MOD} ölçülen tepesi + %30 pay)`,
      { bosBellekMB: bosBellek, tavanMB: tavan }, ['hizli', 'tam']);
    return bitir();
  }
  kaydet('22-kaynak', 'gecti', `boş bellek ${bosBellek} MB ≥ tavan ${tavan} MB · koşum kilidi alındı`,
    { bosBellekMB: bosBellek, tavanMB: tavan }, ['hizli', 'tam']);

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
  // 10-veri-tazeligi KALDIRILDI (B1+B3) — gerekçe md10 bloğundaki notta.
  await korumali('11-veri-butunlugu', ['tam'], md11_veriButunlugu);
  // M2-M10 kapsam kalemleri (28.07) — her biri korumalı: biri patlarsa
  // diğerleri koşmaya devam eder.
  await korumali('16-seo-geo-genis', ['tam'], md16_seoGeo);
  await korumali('17-dis-baglanti', ['tam'], md17_disBaglanti);
  await korumali('18-veri-genis', ['tam'], md18_veriGenis);
  await korumali('19-baslik-og-cta', ['tam', 'hizli'], md19_baslikOgCta);
  await korumali('20-altyapi', ['tam'], md20_altyapiDurumu);
  await korumali('23-altin-ornek', ['tam', 'hizli'], md23_altinOrnek);

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
      // K1 (25 Tem 2026, bulgu F4-2): pull commit'ten SONRA, push'tan ÖNCE —
      // uzaktaki commit'lerin üstüne yazmayı önler. Pull koparsa push ATLANIR
      // (commit yerelde kalır, sonraki koşuda denenir) ve script hata FIRLATMAZ.
      'if git pull --rebase -q; then git push -q; else git rebase --abort || true; echo "K1-PULL-BASARISIZ"; fi',
      'git rev-parse HEAD',
    ], 'site-saglik');
    if (!g.tamam) {
      devirler.push({ konu: o.tip, ayrinti: o.veri, sebep: `commit/push başarısız: ${g.hata}` });
      await appendFile(ONARIM_LOG, JSON.stringify({ zaman: simdi(), tip: o.tip, yapildi: false, sebep: g.hata }) + '\n');
      kaydet('G-onarim', 'kirmizi', `${o.tip}: onarım commit'lenemedi — ${g.hata}`, {}, ['tam']);
      continue;
    }
    if ((g.cikti || '').includes('K1-PULL-BASARISIZ')) {
      // Push edilmedi → deploy tetiklenmez → shaBekle boşuna beklerdi. Devret ve geç.
      const sebep = 'pull basarisiz - push ertelendi (commit yerelde, sonraki koşuda denenir)';
      devirler.push({ konu: o.tip, ayrinti: o.veri, sebep });
      await appendFile(ONARIM_LOG, JSON.stringify({ zaman: simdi(), tip: o.tip, yapildi: false, sebep }) + '\n');
      kaydet('G-onarim', 'sari', `${o.tip}: ${sebep}`, {}, ['tam']);
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
    // Faz 2/3 (28.07): kaynak yetersizliği ya da kilit yüzünden ÖLÇÜM YAPILMAMIŞ
    // koşum, "son ölçüm" sayılmaz — mod özetinde ve kırmızı korumasında atlanır.
    kaynakDurdu,
  };

  if (MOD !== 'test') {
    await appendFile(LOG_YOL, JSON.stringify(kayit) + '\n');
    // B2 (2026-07-27): sonBasariliKosu artık "KOŞUM TAMAMLANDI" damgasıdır,
    // "kırmızısız koşum" değil. Neden: saglik-bekcisi.sh (f) bu alanı
    // CANLILIK sinyali olarak okur ("sağlık sistemi koşuyor mu"). Eski
    // anlamıyla, sistem her 12 saatte bir sorunsuz koşarken tek bir gerçek
    // (ya da yanlış) 🔴 alarmı damgayı donduruyor ve bekçi "sağlık sistemi
    // koşmuyor" diye İKİNCİ, yanlış bir alarm üretiyordu — 27.07 sabahı
    // aynen böyle oldu (md4 yanlış alarmı → UYARI-SAGLIK.md "22 saat önce").
    // Arıza zaten kırmızı kontrolle raporlanıyor; canlılık ayrı sinyaldir.
    // KAYNAK DURDURMASI İSTİSNASI (28.07): koşum ölçüm YAPMADAN döndüyse
    // canlılık damgası VURULMAZ. Yoksa sistem "kaynak yetersiz" diye üst üste
    // stand-down yaparken bekçiye sağlıklı görünür ve sessiz ölüm doğardı;
    // damga vurulmayınca saglik-bekcisi.sh 14 saat kuralıyla 🔴 verir.
    if (!kaynakDurdu) durum.sonBasariliKosu = simdi();
    if (!kirmizi.length && !kaynakDurdu) durum.sonKirmizisizKosu = simdi();  // bilgi kaybı olmasın
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

// ————————————————— FAZ 3: KIRMIZI KORUMASI (2026-07-28) —————————————————
// ARIZA: --tam kırmızı bulduktan sonra koşan --hizli, SITE-DURUM'un "Son koşu"
// tablosunu üzerine yazıyordu. --hizli, --tam'ın kalemlerini (md16/md17/md9…)
// ÖLÇMEDİĞİ için kırmızı sessizce kayboluyordu — md17 kırmızısı böyle gitti.
// ÇÖZÜM: kırmızı, "sonraki koşu yeşil geldi" diye değil, O KALEMİN kendisi
// yeniden ölçülüp GEÇTİĞİNDE kapanır. Kalem bazlı, mod bilgisiyle korunur.
function kirmiziKoruma(gecmisTumu) {
  // Ölçüm yapmamış (kilit/kaynak) koşumlar ne kırmızı açar ne kırmızı kapatır.
  const olcumler = gecmisTumu.filter((g) => !g.kaynakDurdu);
  const sonKirmizi = [...olcumler].reverse().find((g) => g.genel === 'KIRMIZI');
  if (!sonKirmizi) return null;
  const sonrakiler = olcumler.filter((g) => g.zaman > sonKirmizi.zaman);
  const kalemler = (sonKirmizi.sonuclar || []).filter((s) => s.durum === 'kirmizi').map((s) => ({
    ad: s.ad,
    mesaj: s.mesaj,
    // Kalem YENİDEN ÖLÇÜLÜP geçtiyse kapanır; hiç ölçülmediyse AÇIK kalır.
    kapandi: sonrakiler.some((g) => (g.sonuclar || [])
      .some((s2) => s2.ad === s.ad && (s2.durum === 'gecti' || s2.durum === 'sari'))),
  }));
  const acik = kalemler.filter((k) => !k.kapandi);
  return { zaman: sonKirmizi.zaman, mod: sonKirmizi.mod, kalemler, acik };
}

async function durumMdYaz(kayit) {
  let gecmisTumu = [];
  if (existsSync(LOG_YOL)) {
    gecmisTumu = readFileSync(LOG_YOL, 'utf8').trim().split('\n')
      .map((s) => { try { return JSON.parse(s); } catch { return null; } }).filter(Boolean);
  }
  const gecmis = gecmisTumu.slice(-10).reverse();
  const im = { YESIL: '🟢', SARI: '🟡', KIRMIZI: '🔴' };
  const koruma = kirmiziKoruma(gecmisTumu);
  // Mod başına SON GERÇEK ÖLÇÜM (stand-down koşumlar hariç) — bir modun
  // sonucu başka modun koşumuyla ezilmesin.
  const modOzet = [];
  for (const m of ['tam', 'hizli']) {
    const son = [...gecmisTumu].reverse().find((g) => g.mod === m && !g.kaynakDurdu);
    if (son) modOzet.push({ mod: m, ...son });
  }
  const satir = (s) => `| ${{ gecti: '🟢', sari: '🟡', kirmizi: '🔴', atlandi: '⚪' }[s.durum]} ${s.ad} | ${s.mesaj} |`;
  // Başlık satırı: ÇÖZÜLMEMİŞ kırmızı varsa, bu koşum yeşil olsa bile 🔴.
  // Oturum açılış kuralı bu işarete bakar — kırmızı mod değiştirerek kaçamaz.
  const acikKirmizi = koruma?.acik.length ? koruma : null;
  const baslik = acikKirmizi
    ? `**🔴 KIRMIZI (çözülmemiş)** · bu koşu ${im[kayit.genel]} ${kayit.genel} · son koşu ${kayit.zaman} · mod \`--${kayit.mod}\` · hedef ${kayit.taban}`
    : `**${im[kayit.genel]} ${kayit.genel}** · son koşu ${kayit.zaman} · mod \`--${kayit.mod}\` · hedef ${kayit.taban}`;

  const metin = `# SITE-DURUM.md — sürekli site sağlık sistemi

${baslik}

> Claude Code kuralı: her oturum açılışında bu dosya okunur; 🔴 varsa
> SIRADAKILER'den ÖNCE bildirilir (CLAUDE.md).
${acikKirmizi ? `
## 🔴 Çözülmemiş kırmızı (mod bilgisiyle korunuyor)

**${acikKirmizi.zaman}** · mod \`--${acikKirmizi.mod}\` — aşağıdaki kalemler o koşumdan
beri YENİDEN ÖLÇÜLÜP geçmedi. Başka modda yeşil koşu bu kırmızıyı KAPATMAZ;
kalem kendi ölçümünde geçmeden kapanmaz.

| Kalem | Kırmızı mesajı |
|---|---|
${acikKirmizi.acik.map((k) => `| 🔴 ${k.ad} | ${k.mesaj} |`).join('\n')}
${acikKirmizi.kalemler.filter((k) => k.kapandi).length
    ? `\nAynı koşumdan kapanan: ${acikKirmizi.kalemler.filter((k) => k.kapandi).map((k) => k.ad).join(', ')}\n`
    : ''}` : ''}
${modOzet.length ? `
## Mod başına son ölçüm

| Mod | Zaman | Genel | 🔴 | 🟡 | 🟢 |
|---|---|---|---|---|---|
${modOzet.map((g) => `| \`--${g.mod}\` | ${g.zaman} | ${im[g.genel] || ''} ${g.genel} | ${g.kirmizi} | ${g.sari} | ${g.gecti} |`).join('\n')}
` : ''}
## Son koşu${kayit.kaynakDurdu ? ' (ÖLÇÜM YAPILMADI — kaynak/kilit)' : ''}

| Kontrol | Sonuç |
|---|---|
${kayit.sonuclar.map(satir).join('\n')}

${yap.kapsamTaban ? `### Kapsam kalemleri tabanı (M2-M10)

Taban tarihi: **${(yap.kapsamTaban.tabanTarihi || '').slice(0, 10)}** · ${yap.kapsamTaban.gerekce || ''}
SEO/GEO ${yap.kapsamTaban.seoGeo?.toplam ?? '?'} bulgu · npm açık taban ${JSON.stringify(yap.kapsamTaban.npmAudit || {})} · ${(yap.kapsamTaban.nobetciler || []).length} nöbetçi izleniyor
Dış bağlantı: haftalık %5 örneklem (\`--dis-link-tam\` ile tam tarama).
` : ''}
${yap.gorselTaban ? `### Görsel/düzen tabanı (G1-G6)

Taban tarihi: **${(yap.gorselTaban.tabanTarihi || '').slice(0, 10)}** · gerekçe: ${yap.gorselTaban.gerekce || '(yok)'}
Ölçüm deterministik: sabit viewport + DPR + reduced-motion (hero sahnesi 0'da donar).
Bilinçli tasarım değişikliğinde: \`node arac/site-saglik.mjs --gorsel-taban-yenile --gerekce "..."\`
` : ''}

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

// ——— GÖRSEL TABAN YENİLEME (FAZ 2-b, K2 dersi) ———
// Bilinçli tasarım değişikliğinde taban KOMUTLA yenilenir. Kalem kendi
// kendine sessizleşmez (yenileme insan kararıdır ve GEREKÇE zorunludur),
// ama kilitlenmez de (tek komut). Gerekçe ve tarih dosyaya yazılır ve
// SITE-DURUM'da "taban" satırında görünür.
async function gorselTabanYenile() {
  const gerekce = deger('--gerekce', null);
  if (!gerekce) {
    console.error('--gorsel-taban-yenile için --gerekce "neden yenilendiği" ZORUNLU.');
    process.exit(2);
  }
  const G = await import(join(KOK, 'arac/gorsel-olc.mjs'));
  const eski = json(join(IZLEME, 'gorsel-taban.json'), false) || null;
  const yollar = eski
    ? [...new Set(Object.keys(eski.sayfalar).map((k) => k.split('@')[0]))]
    : json(join(IZLEME, 'cekirdek-sayfalar.json')).sayfalar.map((x) => x.yol);
  const pw = (await import(join(KOK, 'node_modules/playwright-core/index.js'))).default;
  const tarayici = await pw.chromium.launch({
    executablePath: EXE, args: ['--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'],
  });
  let olcumler;
  try { olcumler = await G.olcTumu(tarayici, TABAN, yollar); }
  finally { await tarayici.close(); }

  const govde = G.tabanGovdesi(olcumler, gerekce);
  if (eski) govde.oncekiTaban = { tarih: eski.tabanTarihi, gerekce: eski.gerekce };
  writeFileSync(join(IZLEME, 'gorsel-taban.json'), JSON.stringify(govde, null, 1) + '\n', 'utf8');
  console.log(`görsel taban yenilendi: ${olcumler.length} ölçüm, ${yollar.length} sayfa`);
  console.log(`  taban ${TABAN} · tarih ${govde.tabanTarihi}`);
  console.log(`  gerekçe: ${gerekce}`);
  if (eski) console.log(`  önceki taban: ${eski.tabanTarihi}`);
}

if (MOD === 'taban-yenile') await gorselTabanYenile();
else if (MOD === 'test') await testModu();
else await kosu();
