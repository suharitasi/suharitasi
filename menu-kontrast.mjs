import { chromium } from 'playwright-core';
function lum([r,g,b]){const f=c=>{c/=255;return c<=0.03928?c/12.92:((c+0.055)/1.055)**2.4};return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b);}
function oran(a,b){const[l1,l2]=[lum(a),lum(b)].sort((x,y)=>y-x);return (l1+0.05)/(l2+0.05);}
const ayik=s=>{const m=s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);return m?[+m[1],+m[2],+m[3],m[4]===undefined?1:+m[4]]:null;};
const t=await chromium.launch({args:['--no-sandbox']});
const s=await t.newPage({viewport:{width:1440,height:900}});
for(const [ad,yol] of [['ana','/'],['rehber','/rehberler/kuyu-ruhsati/'],['il','/kuyu-ruhsati/konya/']]){
  await s.goto('http://127.0.0.1:8899'+yol,{waitUntil:'domcontentloaded',timeout:20000});
  await s.waitForTimeout(400);
  const v=await s.evaluate(()=>{
    const a=document.querySelector('.pm-nav a');
    const bar=document.getElementById('pm-bar');
    return {metin:getComputedStyle(a).color, bar:getComputedStyle(bar).backgroundColor};
  });
  const m=ayik(v.metin), b=ayik(v.bar);
  // bar yarı saydamsa altındaki en kötü durum: açık zemin [233,240,244]
  const taban=b[3]<1?b.slice(0,3).map((c,i)=>Math.round(c*b[3]+[233,240,244][i]*(1-b[3]))):b.slice(0,3);
  const etkin=m.slice(0,3).map((c,i)=>Math.round(c*(m[3]??1)+taban[i]*(1-(m[3]??1))));
  console.log(ad,'menu oran:',oran(etkin,taban).toFixed(2));
}
await t.close();
