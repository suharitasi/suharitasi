// "SONRA" denetimi (brief 3.4 + öz-denetim protokolü + görüntü-kanıt-değildir):
// kareler + konsol hataları + video ÖLÇÜMÜ (readyState/currentTime) +
// menü etkileşim testi (aç/Esc). Sunucu: arac/dist-sun.mjs (CSP uygulanır —
// CANLI KOŞUL İLKESİ; python http.server _headers uygulamaz).
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const KOK = '/home/suha/projeler/suharitasi-donusum';
const dizin = `${KOK}/denetim/kare/anasayfa-sonra`;
mkdirSync(dizin, { recursive: true });
const ADRES = 'http://127.0.0.1:5197/';

const tarayici = await chromium.launch({ args: ['--no-sandbox'] });
const rapor = [];

// — MASAÜSTÜ 1440×900 —
{
  const s = await tarayici.newPage({ viewport: { width: 1440, height: 900 } });
  const hatalar = [];
  s.on('console', (m) => { if (m.type() === 'error') hatalar.push(m.text()); });
  await s.goto(ADRES, { waitUntil: 'networkidle', timeout: 30000 });
  await s.screenshot({ path: `${dizin}/masaustu-hero-0sn.png` });
  // 5sn sonra (FAZ B başlamış olmalı: 3800ms + geçiş içinde)
  await s.waitForTimeout(5200);
  await s.screenshot({ path: `${dizin}/masaustu-hero-5sn.png` });
  // VİDEO ÖLÇÜMÜ (görüntü kanıt değildir)
  const video = await s.evaluate(() => {
    const aktif = document.querySelector('#v2-videolar video.aktif');
    const hepsi = [...document.querySelectorAll('#v2-videolar video')];
    return {
      aktifVar: !!aktif,
      readyState: aktif ? aktif.readyState : null,
      currentTime: aktif ? aktif.currentTime : null,
      paused: aktif ? aktif.paused : null,
      srcDolu: hepsi.filter(v => v.getAttribute('src')).length,
      posterGizli: document.getElementById('v2-posterler').classList.contains('gizli'),
    };
  });
  rapor.push(['video-olcum', video]);
  // Veriler menüsü açık karesi + Esc testi
  await s.hover('.v2-veri-dugme');
  await s.waitForTimeout(400);
  const acikDurum = await s.evaluate(() => {
    const l = document.getElementById('v2-veri-liste');
    const st = getComputedStyle(l);
    return { opacity: st.opacity, visibility: st.visibility,
             aria: document.querySelector('.v2-veri-dugme').getAttribute('aria-expanded') };
  });
  rapor.push(['veriler-acik', acikDurum]);
  await s.screenshot({ path: `${dizin}/masaustu-veriler-acik.png` });
  await s.focus('.v2-veri-dugme');
  await s.keyboard.press('Escape');
  await s.waitForTimeout(300);
  const kapali = await s.evaluate(() => {
    const st = getComputedStyle(document.getElementById('v2-veri-liste'));
    return { opacity: st.opacity, visibility: st.visibility };
  });
  rapor.push(['veriler-esc-kapandi', kapali]);
  // Kaydırınca bar zemini
  await s.mouse.wheel(0, 300);
  await s.waitForTimeout(350);
  rapor.push(['bar-kaydi', await s.evaluate(() =>
    document.getElementById('v2-ustbar').classList.contains('kaydi'))]);
  await s.screenshot({ path: `${dizin}/masaustu-tamsayfa.png`, fullPage: true });
  rapor.push(['masaustu-konsol-hata', hatalar]);
  await s.close();
}

// — MOBİL 390×844 —
{
  const s = await tarayici.newPage({ viewport: { width: 390, height: 844 } });
  const hatalar = [];
  s.on('console', (m) => { if (m.type() === 'error') hatalar.push(m.text()); });
  await s.goto(ADRES, { waitUntil: 'networkidle', timeout: 30000 });
  await s.waitForTimeout(1200);
  await s.screenshot({ path: `${dizin}/mobil-hero-ustu.png` });
  // Soru listesi (hero altı ilk blok) karesi
  await s.evaluate(() => document.querySelector('.v2-mobil-sorular').scrollIntoView());
  await s.waitForTimeout(400);
  await s.screenshot({ path: `${dizin}/mobil-soru-listesi.png` });
  // Taşma ölçümü
  rapor.push(['mobil-tasma-px', await s.evaluate(() =>
    Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth))]);
  // Hamburger aç/kapa testi
  await s.evaluate(() => scrollTo(0, 0));
  await s.waitForTimeout(300);
  await s.click('#v2-menu-dugme');
  await s.waitForTimeout(350);
  const panel = await s.evaluate(() => ({
    acik: document.getElementById('v2-mobil-panel').classList.contains('acik'),
    aria: document.getElementById('v2-menu-dugme').getAttribute('aria-expanded'),
    veriLinkSayisi: document.querySelectorAll('#v2-mobil-panel .v2-mobil-veri a').length,
  }));
  rapor.push(['mobil-panel-acik', panel]);
  await s.screenshot({ path: `${dizin}/mobil-menu-acik.png` });
  await s.keyboard.press('Escape');
  await s.waitForTimeout(300);
  rapor.push(['mobil-panel-esc', await s.evaluate(() =>
    document.getElementById('v2-mobil-panel').classList.contains('acik'))]);
  await s.screenshot({ path: `${dizin}/mobil-tamsayfa.png`, fullPage: true });
  rapor.push(['mobil-konsol-hata', hatalar]);
  await s.close();
}

await tarayici.close();
for (const [ad, deger] of rapor) console.log(ad + ':', JSON.stringify(deger));
