/* Dalga 2 öz-denetimi: menü vitrini davranış testleri.
   Kullanım: dist'i 5197'de servis et, sonra: node arac/dalga2-denetim.mjs
   GPU YOK: su simülasyonunun görsel kalitesi burada YARGILANMAZ; test edilen
   davranış (aç/kapat, focus, ESC, reduced-motion) ve statik düzendir. */
import { chromium } from '/root/projeler/suharitasi/node_modules/playwright-core/index.mjs';
import { mkdirSync } from 'node:fs';

const TABAN = process.env.TABAN || 'http://localhost:5197';
const CIKTI = '/root/projeler/suharitasi/cikti/dalga2';
const EXE = '/root/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell';

mkdirSync(CIKTI, { recursive: true });
const sonuc = [];
const kaydet = (ad, ok, detay = '') =>
  (sonuc.push({ ad, ok, detay }), console.log(`   ${ok ? '✓' : '✗'} ${ad}${detay ? ' — ' + detay : ''}`));

const tarayici = await chromium.launch({
  executablePath: EXE,
  args: ['--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'],
});

/* ---------- 1) Masaüstü: içerik sayfasından aç ---------- */
console.log('\n[1] Masaüstü 1440x900 — /havzalar/ üzerinden');
{
  const c = await tarayici.newContext({ viewport: { width: 1440, height: 900 } });
  const s = await c.newPage();
  const hatalar = [];
  s.on('console', (m) => {
    if ((m.type() === 'error' || m.type() === 'warning') &&
        !/SwiftShader|GroupMarkerNotSet|Fontconfig|GPU stall/i.test(m.text()))
      hatalar.push(m.text());
  });
  s.on('pageerror', (e) => hatalar.push(e.message));
  await s.goto(TABAN + '/havzalar/', { waitUntil: 'networkidle' });

  await s.click('.sv-menu-ac');
  await s.waitForTimeout(1400); // overlay + 10 öğelik kademe bitsin
  kaydet('menü açıldı (sv-acik)', await s.$eval('#sv-menu', (e) => e.classList.contains('sv-acik')));
  kaydet('body scroll kilitli', await s.evaluate(() => document.body.style.overflow === 'hidden'));
  kaydet('arka alanlar aria-hidden', await s.evaluate(() =>
    ['main', 'footer', 'header.ust'].every((q) =>
      document.querySelector(q)?.getAttribute('aria-hidden') === 'true')));
  kaydet('açan buton aria-expanded=true', await s.$eval('.sv-menu-ac', (e) => e.getAttribute('aria-expanded') === 'true'));

  // Vitrin görünür ve kademe tamam mı
  const vitrin = await s.evaluate(() => {
    const oku = (q) => {
      const e = document.querySelector(q);
      return e ? { opak: getComputedStyle(e).opacity, metin: e.textContent.trim().slice(0, 40) } : null;
    };
    return {
      rehber: oku('.sv-vitrin-rehberler li a .sv-vitrin-ad'),
      kanun: oku('.sv-vitrin-kanun .sv-vitrin-tarih'),
      havza: oku('.sv-vitrin-havza .sv-vitrin-ad'),
      altNot: oku('.sv-alt-not'),
      ayracGorunur: (() => { const a = document.querySelector('.sv-ayrac'); return a && a.getBoundingClientRect().height > 100; })(),
    };
  });
  kaydet('vitrin: son rehber görünür (opak=1)', vitrin.rehber?.opak === '1', vitrin.rehber?.metin);
  kaydet('vitrin: kanun kaydı görünür', vitrin.kanun?.opak === '1', vitrin.kanun?.metin);
  kaydet('vitrin: havza görünür', vitrin.havza?.opak === '1', vitrin.havza?.metin);
  kaydet('sol: alt-etiket görünür', vitrin.altNot?.opak === '1', vitrin.altNot?.metin);
  kaydet('dikey ayraç çizili', vitrin.ayracGorunur === true);
  await s.screenshot({ path: `${CIKTI}/menu-masaustu.png` });

  // Focus trap: ilk öğe ↔ KAPAT
  const odaklar = await s.evaluate(() => {
    const odak = [...document.querySelectorAll('#sv-menu a[href], #sv-menu button:not([disabled])')];
    return { sayi: odak.length, ilk: odak[0]?.textContent.trim(), son: odak.at(-1)?.textContent.trim() };
  });
  kaydet('tab sırası: 10 link + kapat = 11 öğe', odaklar.sayi === 11, `${odaklar.sayi} öğe, ilk="${odaklar.ilk}", son="${odaklar.son}"`);
  await s.focus('.sv-menu-kapat');
  await s.keyboard.press('Tab'); // sondan ileri → başa sarmalı
  const trapIleri = await s.evaluate(() => document.activeElement.textContent.trim());
  await s.keyboard.press('Shift+Tab'); // baştan geri → sona sarmalı
  const trapGeri = await s.evaluate(() => document.activeElement.textContent.trim());
  kaydet('focus trap: kapat→Tab→ilk öğe', trapIleri === 'Harita', `"${trapIleri}"`);
  kaydet('focus trap: ilk→Shift+Tab→kapat', trapGeri === 'kapat', `"${trapGeri}"`);

  // Vitrin linki doğru yere gidiyor
  const vitrinHedef = await s.$eval('.sv-vitrin-havza a', (a) => a.getAttribute('href'));
  kaydet('vitrin havza linki /havzalar/sakarya/', vitrinHedef === '/havzalar/sakarya/', vitrinHedef);

  // ESC kapatır + focus iadesi
  await s.keyboard.press('Escape');
  await s.waitForTimeout(600);
  kaydet('ESC kapattı (hidden)', await s.$eval('#sv-menu', (e) => e.hidden));
  kaydet('focus açan butona döndü', await s.evaluate(() => document.activeElement.classList.contains('sv-menu-ac')));
  kaydet('scroll kilidi kalktı', await s.evaluate(() => document.body.style.overflow === ''));
  kaydet('arka alanlar aria-hidden temiz', await s.evaluate(() =>
    !document.querySelector('main')?.hasAttribute('aria-hidden')));
  kaydet('konsol hatasız', hatalar.length === 0, hatalar.join(' | ').slice(0, 120));
  await c.close();
}

/* ---------- 2) /harita/ aynı menüyü kullanıyor ---------- */
console.log('\n[2] /harita/ — ortak menü (KOD-8)');
{
  const c = await tarayici.newContext({ viewport: { width: 1440, height: 900 } });
  const s = await c.newPage();
  const hatalar = [];
  s.on('pageerror', (e) => hatalar.push(e.message));
  await s.goto(TABAN + '/harita/', { waitUntil: 'networkidle' });
  kaydet('eski .menu-katman YOK', (await s.$('.menu-katman')) === null);
  kaydet('ortak #sv-menu VAR', (await s.$('#sv-menu')) !== null);
  await s.click('.sv-menu-ac');
  await s.waitForTimeout(1400);
  kaydet('menü açıldı', await s.$eval('#sv-menu', (e) => e.classList.contains('sv-acik')));
  kaydet('vitrin harita sayfasında da dolu', await s.$eval('.sv-vitrin-havza .sv-vitrin-ad', (e) => e.textContent.includes('Sakarya')));
  kaydet('aktif sayfa işareti Harita\'da', await s.$eval('.sv-menu-icerik a[aria-current="page"]', (e) => e.textContent.trim() === 'Harita'));
  kaydet('hero figürü aria-hidden (data-menu-dis)', await s.$eval('.cerceve', (e) => e.getAttribute('aria-hidden') === 'true'));
  await s.screenshot({ path: `${CIKTI}/menu-harita.png` });
  await s.keyboard.press('Escape');
  await s.waitForTimeout(600);
  kaydet('ESC harita menüsünü kapattı', await s.$eval('#sv-menu', (e) => e.hidden));
  kaydet('konsol/page hatasız', hatalar.length === 0, hatalar.join('|').slice(0, 120));
  await c.close();
}

/* ---------- 3) Mobil 390x844 ---------- */
console.log('\n[3] Mobil 390x844');
{
  const c = await tarayici.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const s = await c.newPage();
  await s.goto(TABAN + '/rehberler/', { waitUntil: 'networkidle' });
  await s.tap('.sv-menu-ac');
  await s.waitForTimeout(1400);
  const mobil = await s.evaluate(() => {
    const gizli = (q) => { const e = document.querySelector(q); return !e || getComputedStyle(e).display === 'none'; };
    const gorunur = (q) => { const e = document.querySelector(q); return !!e && getComputedStyle(e).display !== 'none' && getComputedStyle(e).opacity === '1'; };
    return {
      kanunGizli: gizli('.sv-vitrin-kanun'),
      havzaGizli: gizli('.sv-vitrin-havza'),
      altNotGizli: gizli('.sv-alt-not'),
      ozetGizli: gizli('.sv-vitrin-ozet'),
      rehberlerGorunur: gorunur('.sv-vitrin-rehberler li a'),
      ayracGizli: gizli('.sv-ayrac'),
      tasmaYok: document.getElementById('sv-menu').scrollWidth <= window.innerWidth,
    };
  });
  kaydet('mobil: kanun bloğu gizli', mobil.kanunGizli);
  kaydet('mobil: havza bloğu gizli', mobil.havzaGizli);
  kaydet('mobil: alt-etiketler gizli', mobil.altNotGizli);
  kaydet('mobil: rehber özetleri gizli (yalnız başlık)', mobil.ozetGizli);
  kaydet('mobil: son rehberler görünür', mobil.rehberlerGorunur);
  kaydet('mobil: ayraç gizli', mobil.ayracGizli);
  kaydet('mobil: yatay taşma yok', mobil.tasmaYok);
  await s.screenshot({ path: `${CIKTI}/menu-mobil.png` });
  await c.close();
}

/* ---------- 4) prefers-reduced-motion ---------- */
console.log('\n[4] prefers-reduced-motion: reduce');
{
  const c = await tarayici.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const s = await c.newPage();
  await s.goto(TABAN + '/havzalar/', { waitUntil: 'networkidle' });
  await s.click('.sv-menu-ac');
  await s.waitForTimeout(120); // kademe YOK: hemen ölç
  const anlik = await s.evaluate(() =>
    [...document.querySelectorAll('.sv-kademe')].every((e) => getComputedStyle(e).opacity === '1'));
  kaydet('tüm öğeler ANINDA görünür (kademe yok)', anlik);
  kaydet('canvas hiç eklenmedi (sim kapalı)', (await s.$('.sv-menu-canvas')) === null);
  await c.close();
}

/* ---------- 4b) Kısa viewport: kaydırmada KAPAT ve zemin sabit ---------- */
console.log('\n[4b] Kısa viewport 900x480 — kaydırma');
{
  const c = await tarayici.newContext({ viewport: { width: 900, height: 480 } });
  const s = await c.newPage();
  await s.goto(TABAN + '/havzalar/', { waitUntil: 'networkidle' });
  await s.click('.sv-menu-ac');
  await s.waitForTimeout(1400);
  const kaydirilabilir = await s.$eval('.sv-menu-kaydirici', (e) => e.scrollHeight > e.clientHeight);
  await s.$eval('.sv-menu-kaydirici', (e) => (e.scrollTop = e.scrollHeight));
  await s.waitForTimeout(150);
  const kapatKonum = await s.$eval('.sv-menu-kapat', (e) => {
    const r = e.getBoundingClientRect();
    return r.top >= 0 && r.top < 80 && r.right <= window.innerWidth;
  });
  kaydet('içerik kaydırılabilir (taşma bu boyutta doğal)', kaydirilabilir);
  kaydet('kaydırma sonrası KAPAT sağ üstte sabit', kapatKonum);
  await c.close();
}

/* ---------- 5) Kırık link: menüdeki tüm hedefler ---------- */
console.log('\n[5] Menü linkleri');
{
  const c = await tarayici.newContext();
  const s = await c.newPage();
  await s.goto(TABAN + '/havzalar/', { waitUntil: 'networkidle' });
  const hedefler = await s.$$eval('#sv-menu a[href]', (as) => as.map((a) => a.getAttribute('href')));
  let kirik = 0;
  for (const h of hedefler) {
    const r = await c.request.get(TABAN + h);
    if (r.status() >= 400) { kirik++; console.log('   ! kırık:', h, r.status()); }
  }
  kaydet(`menüdeki ${hedefler.length} link sağlam`, kirik === 0);
  await c.close();
}

await tarayici.close();
const kalan = sonuc.filter((s) => !s.ok);
console.log(`\n=== SONUÇ: ${kalan.length === 0 ? 'GEÇTİ' : 'KALDI'} (${sonuc.length - kalan.length}/${sonuc.length}) ===`);
console.log(`Görüntüler: ${CIKTI}/`);
process.exit(kalan.length === 0 ? 0 : 1);
