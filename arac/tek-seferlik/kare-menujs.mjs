import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
const dizin='/home/suha/projeler/suharitasi-menujs/denetim/kare/menujs-sonrasi';
mkdirSync(dizin,{recursive:true});
const t=await chromium.launch({args:['--no-sandbox']});
for(const [ad,yol] of [['ana','/'],['rehber','/rehberler/kuyu-ruhsati/'],['harita','/harita/']]){
  for(const [et,w,h] of [['masaustu',1440,900],['mobil',390,844]]){
    const s=await t.newPage({viewport:{width:w,height:h}});
    const hat=[];s.on('console',m=>{if(m.type()==='error')hat.push(m.text());});
    const agHata=[];s.on('requestfailed',r=>agHata.push(r.url()));
    await s.goto('http://127.0.0.1:5197'+yol,{waitUntil:'networkidle',timeout:30000});
    await s.waitForTimeout(600);
    await s.screenshot({path:`${dizin}/${ad}-${et}.png`});
    // /harita/ ozel: yuzer bar var mi + menu acilir mi
    let ekstra='';
    if(ad==='harita'){
      const v=await s.evaluate(()=>({
        bar:!!document.getElementById('pm-bar'),
        yuzer:document.getElementById('pm-bar')?.classList.contains('pm-yuzer'),
        eskiTetik:!!document.querySelector('.sv-menu-ac')}));
      if(et==='masaustu'){await s.hover('.pm-veri-dugme');await s.waitForTimeout(300);
        v.verilerAcik=await s.evaluate(()=>getComputedStyle(document.getElementById('pm-veri-liste')).visibility==='visible');}
      ekstra=' harita:'+JSON.stringify(v);
    }
    const tasma=await s.evaluate(()=>Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth));
    console.log(`${ad}-${et}: konsol ${hat.length} agHata ${agHata.length} tasma ${tasma}${ekstra}`);
    await s.close();
  }
}
await t.close();
