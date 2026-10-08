// Integration testi — Ön Değerlendirme Köprüsü B2B alanları + İYUK kırmızı rozet
// + &kalan_gun köprü parametresi. dist'i CLOUDFLARE GİBİ servis eder (CSP dahil),
// headless Chromium'da gerçek sayfayı sürer. Kanıt: gerçek tıklama → yakalanan
// window.open URL'sinin çözümlenmiş base64url yükü + rozet DOM'u.
//
// Koşum: node arac/test/kopru-payload.test.mjs
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chromium } from '/home/suha/projeler/suharitasi/node_modules/playwright-core/index.mjs';

const PORT = 5391;
const TABAN = `http://127.0.0.1:${PORT}`;
import { tarayiciYolu } from '../tarayici-yolu.mjs';
const EXE = tarayiciYolu('chromium-headless-shell').yol ?? '';

if (!existsSync(EXE)) {
  console.error(`FAIL: headless chromium yok: ${EXE}`);
  process.exit(1);
}

let hata = 0;
const ok = (kosul, ad, ek = '') => {
  console.log(`${kosul ? 'GECTI' : 'FAIL '} ${ad}${ek ? ' — ' + ek : ''}`);
  if (!kosul) hata++;
};

// — dist'i servis et —
const sunucu = spawn('node', ['/home/suha/projeler/suharitasi/arac/dist-sun.mjs', String(PORT)],
  { stdio: ['ignore', 'pipe', 'pipe'] });
await new Promise((r) => setTimeout(r, 1200));
for (let i = 0; i < 40; i++) {
  try { await fetch(`${TABAN}/`); break; } catch { await new Promise((r) => setTimeout(r, 150)); }
}

const tarayici = await chromium.launch({
  executablePath: EXE,
  args: ['--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'],
});
const baglam = await tarayici.newContext({ viewport: { width: 1366, height: 900 } });
const hatalar = [];

const bugun = new Date();
const iso = (d) => d.toISOString().slice(0, 10);
const bugunIso = iso(bugun);

try {
  // — /kuyu-karar-motoru — köprü + rozet + B2B alanları —
  const s = await baglam.newPage();
  s.on('pageerror', (e) => hatalar.push(`pageerror: ${e.message}`));
  s.on('console', (m) => { if (m.type() === 'error') hatalar.push(`console: ${m.text()}`); });
  await s.goto(`${TABAN}/kuyu-karar-motoru/`, { waitUntil: 'networkidle' });

  // Rozet: tebliğ tarihi girilince görünür ve kalan=60 olmalı.
  await s.evaluate((tarih) => {
    const t = document.getElementById('km-teblig');
    t.value = tarih;
    t.dispatchEvent(new Event('input', { bubbles: true }));
  }, bugunIso);
  const rozet = await s.evaluate(() => {
    const r = document.querySelector('[data-isr-rozet]');
    return { gizli: r.hidden, metin: r.textContent, acil: r.classList.contains('isr-acil') };
  });
  ok(rozet.gizli === false, 'rozet görünür (tebliğ tarihi girildi)');
  ok(/60 gün kaldı/.test(rozet.metin), 'rozet kalan günü hesapladı (60)', rozet.metin);
  ok(/İYUK m\.7/.test(rozet.metin), 'rozet İYUK m.7 atfı taşır');

  // Köprü tıklaması → window.open URL'sini yakala.
  await s.evaluate(() => {
    window.__acilan = null;
    window.open = (url) => { window.__acilan = url; return null; };
    const set = (id, v) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event('change', { bubbles: true })); };
    document.getElementById('km-il').value = document.getElementById('km-il').options[1].value;
    set('km-islem', 'ruhsatsiz');
    set('km-tesis', 'jeotermal');
    set('km-tuketim', '10000+');
    set('km-durum', 'ceza');
  });
  await s.click('[data-oi-gonder]');
  const url = await s.evaluate(() => window.__acilan);
  ok(!!url && url.startsWith('https://arslanhukuk.tr/randevu/?on-inceleme='), 'köprü URL üretildi');

  const u = new URL(url);
  ok(u.searchParams.get('kalan_gun') === '60', 'köprü URL &kalan_gun=60 taşır', u.searchParams.get('kalan_gun'));
  const ham = u.searchParams.get('on-inceleme');
  const b64 = ham.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(ham.length / 4) * 4, '=');
  const yuk = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  ok(yuk.tesis_turu === 'Jeotermal', 'yük tesis_turu', yuk.tesis_turu);
  ok(yuk.aylik_tuketim === '10.000+ m³', 'yük aylik_tuketim', yuk.aylik_tuketim);
  ok(yuk.hukuki_durum === 'Ceza Tebliği', 'yük hukuki_durum', yuk.hukuki_durum);
  ok(yuk.kalan_dava_suresi_gun === 60, 'yük kalan_dava_suresi_gun', String(yuk.kalan_dava_suresi_gun));
  // Kısa şema (brief §2C) — eski anahtarlarla birlikte
  ok(typeof yuk.havza === 'string' && yuk.havza !== 'Belirtilmedi', 'kısa şema havza', yuk.havza);
  ok(yuk.tesis === 'Jeotermal', 'kısa şema tesis', yuk.tesis);
  ok(yuk.tuketim === '10.000+ m³', 'kısa şema tuketim', yuk.tuketim);
  ok(yuk.durum === 'Ceza Tebliği', 'kısa şema durum', yuk.durum);
  ok(yuk.teblig === bugunIso, 'kısa şema teblig', String(yuk.teblig));
  ok(yuk.kalan_gun === 60, 'kısa şema kalan_gun', String(yuk.kalan_gun));
  ok(Number.isInteger(yuk.ts) && yuk.ts > 1700000000, 'kısa şema ts (epoch sn)', String(yuk.ts));
  await s.close();

  // — /kuyu-kisit-sorgu — kendi girdili rozet + watermark kaynağı —
  const s2 = await baglam.newPage();
  s2.on('pageerror', (e) => hatalar.push(`pageerror(kisit): ${e.message}`));
  await s2.goto(`${TABAN}/kuyu-kisit-sorgu/`, { waitUntil: 'networkidle' });
  const rozetVar = await s2.evaluate(() => !!document.querySelector('[data-isr][data-isr-girdi="1"] #isr-tarih'));
  ok(rozetVar, 'kısıt-sorgu: kendi tebliğ tarihi girdisi + rozet');
  await s2.evaluate((tarih) => {
    const t = document.getElementById('isr-tarih');
    t.value = tarih;
    t.dispatchEvent(new Event('input', { bubbles: true }));
  }, bugunIso);
  const r2 = await s2.evaluate(() => {
    const r = document.querySelector('[data-isr-rozet]');
    return { gizli: r.hidden, metin: r.textContent };
  });
  ok(r2.gizli === false && /60 gün kaldı/.test(r2.metin), 'kısıt-sorgu rozeti hesapladı', r2.metin);

  // Watermark kaynağı: yazdırma belgesini üreten scriptte metin var mı?
  // (esbuild ASCII benimser; Türkçe karakterler \xXX / \uXXXX'e kaçırılır → çöz.)
  const kaynak = (await (await fetch(`${TABAN}/s/kisit-sorgu.js`)).text())
    .replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
  ok(kaynak.includes('kamuya açık hidrojeolojik veriler, uydu spektral taramaları'),
    'yazdırma belgesi yeni filigran metnini taşır');
  ok(kaynak.includes('yetkili hukuk masası: Arslan Hukuk Bürosu (arslanhukuk.tr)'),
    'filigran yetkili hukuk masası bağlantısını taşır');
  await s2.close();

  ok(hatalar.length === 0, 'konsol/page hata yok', hatalar.join(' | '));
} finally {
  await tarayici.close();
  sunucu.kill('SIGTERM');
}

console.log(hata ? `\n${hata} sınama BAŞARISIZ` : '\nTÜM SINAMALAR GEÇTİ');
process.exit(hata ? 1 : 0);
