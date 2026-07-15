/* og:image üretici — 1200x630, marka fontlarıyla.
   ImageMagick sunucuda Cormorant/Manrope taşımadığından sahne gerçek
   tarayıcıda kurulur ve tek kare alınır. Landing'in görsel dili:
   gece denizi zemini, derinlik konturları, akuamarin damar, Cormorant başlık.

   Çalıştır:  node arac/og-uret.mjs
   Çıktı:     public/og-suharitasi.v1.png  (dosya adı sürümlü: cache-bust) */
import { chromium } from '/root/projeler/suharitasi/node_modules/playwright-core/index.mjs';
import { mkdir } from 'node:fs/promises';

const CIKTI = '/root/projeler/suharitasi/public/og-suharitasi.v1.png';
const EXE = '/root/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell';

const sahne = `<!DOCTYPE html>
<html lang="tr"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,500;1,500&family=Manrope:wght@500&display=swap&subset=latin-ext" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden; position: relative;
    background: #04121F;
    background-image:
      radial-gradient(120vw 70vh at 50% -18vh, #071D2E 0%, rgba(7,29,46,0) 62%),
      linear-gradient(180deg, #04121F 0%, #030D17 100%);
    font-family: "Manrope", system-ui, sans-serif;
    display: flex; flex-direction: column; justify-content: center;
    padding: 0 84px;
  }
  svg.dalgalar { position: absolute; inset: 0; width: 100%; height: 100%; }
  svg.dalgalar path { fill: none; stroke: #0E3247; stroke-width: 1.1; }
  .marka {
    position: absolute; top: 52px; left: 84px;
    font-size: 15px; font-weight: 500; letter-spacing: 0.3em;
    text-transform: uppercase; color: #6C8A96;
  }
  h1 {
    position: relative; z-index: 2;
    font-family: "Cormorant", Georgia, serif; font-weight: 500;
    font-size: 92px; line-height: 1.1; letter-spacing: -0.012em;
    color: #DCE9ED; max-width: 15ch;
  }
  h1 em { font-style: italic; color: #A8DDE0; }
  .damar {
    position: relative; z-index: 2;
    width: 420px; height: 1px; margin: 34px 0;
    background: linear-gradient(90deg, transparent, #4FC3D0 35%, #A8DDE0 50%, #4FC3D0 65%, transparent);
    filter: drop-shadow(0 0 7px rgba(79,195,208,0.8));
  }
  p.alt {
    position: relative; z-index: 2;
    font-size: 25px; line-height: 1.5; color: #6C8A96; max-width: 30ch;
  }
  .imza {
    position: absolute; bottom: 48px; left: 84px;
    font-size: 15px; letter-spacing: 0.06em; color: #4A6673;
  }
</style></head>
<body>
  <svg class="dalgalar" viewBox="0 0 1200 630" preserveAspectRatio="xMidYMid slice">
    <path d="M -60 70  C 200 58,  400 82,  640 68  S 1040 56, 1260 72"/>
    <path d="M -60 140 C 220 152, 440 126, 680 142 S 1060 154, 1260 138"/>
    <path d="M -60 236 C 190 222, 420 250, 660 234 S 1050 220, 1260 238"/>
    <path d="M -60 344 C 230 358, 460 330, 700 346 S 1080 360, 1260 342"/>
    <path d="M -60 462 C 210 446, 440 478, 690 460 S 1060 444, 1260 464"/>
    <path d="M -60 588 C 240 604, 480 572, 720 590 S 1090 606, 1260 586"/>
  </svg>
  <span class="marka">Su Haritası</span>
  <h1>Su, yerin altında <em>konuşur.</em></h1>
  <div class="damar"></div>
  <p class="alt">Türkiye'nin su verisi, havzaları ve su mevzuatı — tek haritada.</p>
  <span class="imza">suharitasi.com</span>
</body></html>`;

const tarayici = await chromium.launch({
  executablePath: EXE,
  args: ['--no-sandbox'],
});
const sayfa = await tarayici.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await sayfa.setContent(sahne, { waitUntil: 'networkidle' });
// Google Fonts inip yerleşmeden kare alınırsa başlık fallback serif çıkar.
await sayfa.evaluate(() => document.fonts.ready);
await mkdir('/root/projeler/suharitasi/public', { recursive: true });
await sayfa.screenshot({ path: CIKTI });
await tarayici.close();
console.log(`og:image yazıldı → ${CIKTI} (1200x630)`);
