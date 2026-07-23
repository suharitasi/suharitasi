/* FAZ 0 — TEŞHİS (kod değiştirmez, salt ölçüm).
   Belirtiler: (a) kaydırınca sahneler açılmıyor, (b) sağda sahne adları
   görünüyor, (c) soru şeridi görülmüyor.
   Ölçüm ekran görüntüsüyle DEĞİL, DOM + ağ durumuyla yapılır.
   Kullanım: node arac/duzeltme-teshis.mjs [adres]
     adres verilmezse https://suharitasi.com/ ölçülür.                        */
import pw from '/home/suha/projeler/suharitasi/node_modules/playwright-core/index.js';
import { writeFileSync, mkdirSync } from 'node:fs';

const { chromium } = pw;
const KOK = '/home/suha/projeler/suharitasi';
const CIKTI = `${KOK}/cikti/denetim/anasayfa-duzeltme`;
const EXE = '/home/suha/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';
const ADRES = process.argv[2] || 'https://suharitasi.com/';
mkdirSync(CIKTI, { recursive: true });

const KIRILIMLAR = [
  { ad: '1440', viewport: { width: 1440, height: 900 } },
  { ad: '375', viewport: { width: 375, height: 667 } },
];

const rapor = { adres: ADRES, kirilimlar: {} };

const browser = await chromium.launch({
  executablePath: EXE,
  args: ['--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader',
         '--autoplay-policy=no-user-gesture-required'],
});

// Codec desteği: headless Chromium'da H.264 yoksa readyState 0 kalır —
// bu ölçümün YANLIŞ POZİTİF kaynağıdır, ayrıca kaydedilir.
{
  const p = await (await browser.newContext()).newPage();
  await p.goto('about:blank');
  rapor.codec = await p.evaluate(() => {
    const v = document.createElement('video');
    return {
      h264: v.canPlayType('video/mp4; codecs="avc1.42E01E"') || 'hayır',
      webm_vp9: v.canPlayType('video/webm; codecs="vp9"') || 'hayır',
      webm_vp8: v.canPlayType('video/webm; codecs="vp8"') || 'hayır',
    };
  });
  await p.context().close();
}

for (const k of KIRILIMLAR) {
  const ctx = await browser.newContext({ viewport: k.viewport });
  const page = await ctx.newPage();
  const ag = [];
  page.on('response', (r) => {
    const u = new URL(r.url()).pathname;
    if (/sahne\d+\.(mp4|jpg|webm)$/.test(u)) ag.push({ yol: u, kod: r.status() });
  });
  await page.goto(ADRES, { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  const k_rapor = { geometri: {}, sahneler: [], serit: {}, etiketler: {}, alt_metinler: [] };

  // — 4) Mevcut geometri (regresyon tabanı) —
  k_rapor.geometri = await page.evaluate(() => {
    const t = document.querySelector('#world .sw-track');
    const sahne = [...document.querySelectorAll('#world .sw-scene')];
    return {
      vh: innerHeight,
      track_yuksekligi_px: t ? t.offsetHeight : null,
      belge_yuksekligi_px: document.documentElement.scrollHeight,
      akis_kaydirma_px: t ? t.offsetHeight - innerHeight : null,
      akis_kaydirma_vh: t ? +((t.offsetHeight - innerHeight) / innerHeight).toFixed(2) : null,
      sahne_sayisi: sahne.length,
      sahne_basina_vh: 1.6,
      dilim_uzunlugu_px: t ? Math.round((t.offsetHeight - innerHeight) / 7) : null,
      soru_sirasi: [...document.querySelectorAll('.soru-serit .soru')]
        .map((a) => ({ soru: a.querySelector('.soru-metin').textContent.trim(),
                       hedef: a.getAttribute('href') })),
    };
  });

  // — 3) Şerit fold ölçümü (ilk ekranda mı) —
  k_rapor.serit = await page.evaluate(() => {
    const s = document.querySelector('.soru-serit');
    const st = getComputedStyle(s);
    const r = s.getBoundingClientRect();
    const gorunurler = [...s.querySelectorAll('.soru')]
      .filter((a) => getComputedStyle(a).opacity === '1');
    return {
      position: st.position,
      opacity: st.opacity,
      kutu: { top: Math.round(r.top), bottom: Math.round(r.bottom), yukseklik: Math.round(r.height) },
      viewport_yuksekligi: innerHeight,
      fold_icinde: r.top >= 0 && r.bottom <= innerHeight,
      alt_kenardan_uzaklik_px: Math.round(innerHeight - r.bottom),
      gorunur_soru: gorunurler.map((a) => a.querySelector('.soru-metin').textContent.trim()),
      // Şeridin ÜSTÜNDEKİ nokta neyi döndürüyor (örtülme var mı)
      ustundeki_eleman: (() => {
        const e = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
        return e ? (e.className || e.tagName) : null;
      })(),
    };
  });

  // — 1) Kök neden hipotezi: "göl kasabası" yazısı ALT METİN mi, ETİKET mi —
  k_rapor.alt_metinler = await page.evaluate(() =>
    [...document.querySelectorAll('#world .sw-scene__still')].map((i, n) => ({
      sira: n, alt: i.getAttribute('alt'), src_var_mi: !!i.getAttribute('src'),
    })));
  k_rapor.etiketler = await page.evaluate(() => {
    const bul = (metin) => [...document.querySelectorAll('*')]
      .filter((e) => e.children.length === 0 && e.textContent.trim().toLocaleLowerCase('tr-TR') === metin)
      .map((e) => {
        const st = getComputedStyle(e);
        const r = e.getBoundingClientRect();
        return { sinif: e.className, etiket: e.tagName, opacity: st.opacity,
                 gorunur: st.opacity !== '0' && st.visibility !== 'hidden' && r.width > 0,
                 kutu: { x: Math.round(r.x), y: Math.round(r.y) } };
      });
    return {
      'gol kasabası': bul('göl kasabası'),
      sondaj: bul('sondaj'),
      rota_etiketi_sayisi: document.querySelectorAll('.sw-route__label').length,
      rota_aktif_etiket: [...document.querySelectorAll('.sw-route__dot.is-active .sw-route__label')]
        .map((e) => ({ metin: e.textContent, opacity: getComputedStyle(e).opacity })),
    };
  });

  // — 2) 6 sahne oynama ölçümü: her sahnenin ORTASINA kaydır, oku —
  const akis = k_rapor.geometri.akis_kaydirma_px || 0;
  for (let i = 0; i < 6; i++) {
    const hedefY = Math.round((i + 0.5) * 1.6 * k_rapor.geometri.vh);
    await page.evaluate((y) => scrollTo(0, y), hedefY);
    await page.waitForTimeout(2200);
    const olcum = await page.evaluate((idx) => {
      const sahne = [...document.querySelectorAll('#world .sw-scene')][idx];
      if (!sahne) return { hata: 'sahne yok' };
      const v = sahne.querySelector('video');
      const img = sahne.querySelector('.sw-scene__still');
      return {
        sahne_opacity: +getComputedStyle(sahne).opacity,
        has_clip_sinifi: sahne.classList.contains('has-clip'),
        video_var: !!v,
        readyState: v ? v.readyState : null,
        currentTime: v ? +v.currentTime.toFixed(3) : null,
        duration: v ? (v.duration || null) : null,
        videoWidth: v ? v.videoWidth : null,
        video_hata: v && v.error ? `${v.error.code}: ${v.error.message}` : null,
        img_complete: img ? img.complete : null,
        img_naturalWidth: img ? img.naturalWidth : null,
        img_src: img ? (img.getAttribute('src') || '(src YOK)') : null,
      };
    }, i);
    k_rapor.sahneler.push({ sahne: i + 1, kaydirma_px: hedefY, ...olcum });
  }

  k_rapor.ag = ag;
  rapor.kirilimlar[k.ad] = k_rapor;
  await ctx.close();
}

await browser.close();
writeFileSync(`${CIKTI}/faz0-teshis.json`, JSON.stringify(rapor, null, 2));

// — konsol özeti —
console.log('CODEC:', JSON.stringify(rapor.codec));
for (const [ad, r] of Object.entries(rapor.kirilimlar)) {
  console.log(`\n===== ${ad} =====`);
  console.log('GEOMETRİ:', JSON.stringify({
    vh: r.geometri.vh, akis_vh: r.geometri.akis_kaydirma_vh,
    akis_px: r.geometri.akis_kaydirma_px, dilim_px: r.geometri.dilim_uzunlugu_px,
    belge_px: r.geometri.belge_yuksekligi_px,
  }));
  console.log('ŞERİT:', JSON.stringify(r.serit));
  console.log('ALT METİNLER:', JSON.stringify(r.alt_metinler));
  console.log('ETİKET "göl kasabası":', JSON.stringify(r.etiketler['gol kasabası']));
  console.log('ROTA aktif etiket:', JSON.stringify(r.etiketler.rota_aktif_etiket));
  console.log('SAHNE OYNAMA:');
  console.table(r.sahneler.map((s) => ({
    sahne: s.sahne, opacity: s.sahne_opacity, video: s.video_var,
    readyState: s.readyState, currentTime: s.currentTime, vW: s.videoWidth,
    hata: s.video_hata, has_clip: s.has_clip_sinifi,
    img_nW: s.img_naturalWidth, img_src: s.img_src,
  })));
  console.log('AĞ:', JSON.stringify(r.ag));
}
