// Lighthouse 3-tur medyan: kuyu-tasima ↔ kuyu-ruhsati (referans). 4 kategori.
// GPU'suz headless: mutlak perf gürültülü — KARAR göreli (aynı kutu, aynı tur).
import lighthouse from '/home/suha/projeler/suharitasi/node_modules/lighthouse/core/index.js';
import { launch } from '/home/suha/projeler/suharitasi/node_modules/chrome-launcher/dist/index.js';
const PORT = process.env.PORT || '4321';
const EXE = '/home/suha/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome';
const SAYFALAR = [['/rehberler/kuyu-ruhsati/','kuyu-ruhsati (REFERANS)'],['/rehberler/kuyu-tasima/','kuyu-tasima (YENİ)']];
const CATS = ['performance','accessibility','best-practices','seo'];
const med = a => a.slice().sort((x,y)=>x-y)[Math.floor(a.length/2)];
const chrome = await launch({ chromePath: EXE, chromeFlags:['--headless=new','--no-sandbox','--use-gl=angle','--enable-unsafe-swiftshader'] });
const opts = { port: chrome.port, onlyCategories: CATS, output:'json', logLevel:'error' };
for (const [yol,ad] of SAYFALAR){
  const acc = {performance:[],accessibility:[],'best-practices':[],seo:[]};
  for (let i=0;i<3;i++){
    const r = await lighthouse(`http://localhost:${PORT}${yol}`, opts);
    for (const c of CATS) acc[c].push(Math.round(r.lhr.categories[c].score*100));
  }
  console.log(ad.padEnd(24), CATS.map(c=>`${c.slice(0,4)}:${med(acc[c])}`).join('  '), '| ham perf:', acc.performance.join('/'));
}
await chrome.kill();
