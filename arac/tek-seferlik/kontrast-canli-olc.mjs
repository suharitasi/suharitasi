import { chromium } from 'playwright-core';
const SAYFALAR = [
  ['ana','/'],['rehber','/rehberler/kuyu-ruhsati/'],['havza','/havzalar/sakarya/'],
  ['il','/kuyu-ruhsati/konya/'],['persona','/durumum/agac-ve-agac-urunleri-imalati-nace-16/'],
  ['su-kanunu','/su-kanunu/'],['vaka','/vaka/meysu/'],['durumum','/durumum/'],
  ['hangi-kurum','/hangi-kurum/'],['hakkinda','/hakkinda/'],
];
function lum([r,g,b]){const f=c=>{c/=255;return c<=0.03928?c/12.92:((c+0.055)/1.055)**2.4};return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b);}
function oran(a,b){const[l1,l2]=[lum(a),lum(b)].sort((x,y)=>y-x);return (l1+0.05)/(l2+0.05);}
const ayik=s=>{const m=s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);return m?[+m[1],+m[2],+m[3],m[4]===undefined?1:+m[4]]:null;};
const t = await chromium.launch({ args: ['--no-sandbox'] });
const s = await t.newPage({ viewport: { width: 1440, height: 900 } });
for (const [ad, yol] of SAYFALAR) {
  await s.goto('https://suharitasi.com' + yol + '?cb=' + Date.now(), { waitUntil: 'load', timeout: 30000 });
  const v = await s.evaluate(() => {
    // gövde paragrafı: main içindeki ilk anlamlı <p>
    // GÖRÜNÜR gövde paragrafı: menü (pm-*) dışında, opaklık zinciri>0.05
    const adaylar=[...document.querySelectorAll('p')];
    function zincir(el){let o=1;while(el){o*=parseFloat(getComputedStyle(el).opacity);el=el.parentElement;}return o;}
    const p=adaylar.find(x=>!x.closest('[class*="pm-"]')&&x.textContent.trim().length>40&&zincir(x)>0.05&&x.getBoundingClientRect().height>0);
    function zincirOpaklik(el){let o=1;while(el){const st=getComputedStyle(el);o*=parseFloat(st.opacity);el=el.parentElement;}return o;}
    function zeminBul(el){
      while(el){const st=getComputedStyle(el);const bg=st.backgroundColor;
        if(bg&&!bg.startsWith('rgba(0, 0, 0, 0)')&&bg!=='transparent')return bg;
        el=el.parentElement;}
      return getComputedStyle(document.body).backgroundColor;
    }
    const st = p?getComputedStyle(p):null;
    return {
      bodyBg: getComputedStyle(document.body).backgroundColor,
      htmlBg: getComputedStyle(document.documentElement).backgroundColor,
      pRenk: st?st.color:null,
      pOpaklik: p?zincirOpaklik(p):null,
      pZemin: p?zeminBul(p):null,
      pOrnek: p?p.textContent.trim().slice(0,40):null,
    };
  });
  const metin=ayik(v.pRenk||''), zemin=ayik(v.pZemin||''), govde=ayik(v.bodyBg||'');
  let etkin=metin, taban=zemin&&zemin[3]<1&&govde?zemin.slice(0,3).map((c,i)=>Math.round(c*zemin[3]+govde[i]*(1-zemin[3]))):zemin?.slice(0,3);
  if(metin&&taban){
    const a=(metin[3]??1)*(v.pOpaklik??1);
    etkin=metin.slice(0,3).map((c,i)=>Math.round(c*a+taban[i]*(1-a)));
    console.log(`${ad}\tzemin=${JSON.stringify(taban)}\tmetin=${JSON.stringify(metin)}\topaklik=${(v.pOpaklik??1).toFixed(2)}\tetkin=${JSON.stringify(etkin)}\toran=${oran(etkin,taban).toFixed(2)}\t"${v.pOrnek}"`);
  } else console.log(ad,'OLCULEMEDI',JSON.stringify(v));
}
await t.close();
