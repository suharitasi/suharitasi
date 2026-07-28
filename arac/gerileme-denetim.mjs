#!/usr/bin/env node
/* TABAN-GERİLEME DENETİMİ (28 Tem 2026, K4).
   ---------------------------------------------------------------------------
   Soru: worktree'deki dist, CANLI sürüme göre bir şey KAYBETTİ mi?
   Taban = canlı site (şu an yayında olan sürüm). Karşılaştırma sayfa sayfa.

   Ölçülen boyutlar (kullanıcı listesi):
     h2 sırası     — başlık hiyerarşisinde atlama (h1→h3 gibi) sayısı
     soru başlığı  — '?' ile biten başlık sayısı (GEO/AI-alıntı yüzeyi)
     şema          — JSON-LD blok sayısı + @type kümesi
     llms.txt      — satır/URL sayısı
     sitemap       — URL kümesi
   Ek taban ölçüleri: title/canonical/öz-cevap/OG varlığı, iç link sayısı.

   GERİLEME = bir ölçünün canlıdan DÜŞMESİ. Artış gerileme değildir (raporlanır).
   Kullanım: node arac/gerileme-denetim.mjs <yerel-taban> [canli-taban]
*/
import { writeFile, mkdir } from 'node:fs/promises';

const YEREL = (process.argv[2] || 'http://127.0.0.1:5197').replace(/\/$/, '');
const CANLI = (process.argv[3] || 'https://suharitasi.com').replace(/\/$/, '');
const ESZAMANLI = 6;

async function metin(url) {
  const c = await fetch(url, { redirect: 'follow' });
  if (!c.ok) return { hata: `HTTP ${c.status}` };
  return { govde: await c.text() };
}

function olc(html) {
  const basliklar = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((m) => ({ dz: +m[1], metin: m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() }));
  // h sırası atlaması: bir sonraki başlık, öncekinden 1'den fazla derinse
  let atlama = 0;
  for (let i = 1; i < basliklar.length; i++) {
    if (basliklar[i].dz - basliklar[i - 1].dz > 1) atlama++;
  }
  const ld = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
  const tipler = new Set();
  for (const m of ld) {
    try {
      const j = JSON.parse(m[1]);
      for (const o of Array.isArray(j) ? j : [j]) {
        if (o['@type']) (Array.isArray(o['@type']) ? o['@type'] : [o['@type']]).forEach((t) => tipler.add(t));
        for (const g of o['@graph'] || []) if (g['@type']) tipler.add(g['@type']);
      }
    } catch { tipler.add('GEÇERSİZ-JSON'); }
  }
  return {
    h1: (html.match(/<h1[\s>]/gi) || []).length,
    baslik: basliklar.length,
    hAtlama: atlama,
    soruBaslik: basliklar.filter((b) => /\?\s*$/.test(b.metin)).length,
    ldBlok: ld.length,
    ldTip: [...tipler].sort(),
    title: /<title[^>]*>[^<]{5,}<\/title>/i.test(html),
    canonical: /rel="canonical"/i.test(html),
    ozCevap: /doc-abstract|oz-cevap/i.test(html),
    og: /property="og:title"/i.test(html),
    /* İÇ LİNK — yalnız GERÇEK sayfa bağlantıları.
       İlk sürüm ham href sayıyordu ve 10 rehber sayfasında yanlış "gerileme"
       verdi (28.07 ölçümü): kaybolan "link" Cloudflare'in kenarda enjekte
       ettiği /cdn-cgi/l/email-protection idi, /_astro/*.css adları da içerik
       değişince hash aldığı için oynuyordu. İkisi de sayfa bağlantısı DEĞİL.
       Vekil kriter yasağı: ölçmek istediğimiz şey iç gezinme yüzeyi. */
    icLink: new Set([...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1])
      .filter((u) => !u.startsWith('/_astro/') && !u.startsWith('/cdn-cgi/')
                     && !/\.(css|js|png|jpe?g|webp|avif|svg|ico|woff2?|mp4|webm|xml|txt|json|pdf)$/i.test(u))).size,
  };
}

async function havuz(isler, n) {
  const sonuc = [];
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < isler.length) sonuc.push(await isler[i++]());
  }));
  return sonuc;
}

const sm = await (await fetch(`${CANLI}/sitemap.xml`)).text();
const canliUrl = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(CANLI, ''));
const sm2 = await (await fetch(`${YEREL}/sitemap.xml`)).text();
const yerelUrl = [...sm2.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/https?:\/\/[^/]+/, ''));

const kayipUrl = canliUrl.filter((u) => !yerelUrl.includes(u));
const yeniUrl = yerelUrl.filter((u) => !canliUrl.includes(u));
console.log(`sitemap: canlı ${canliUrl.length} · yerel ${yerelUrl.length} · KAYIP ${kayipUrl.length} · yeni ${yeniUrl.length}`);
if (kayipUrl.length) console.log('  KAYIP:', kayipUrl.slice(0, 20));
if (yeniUrl.length) console.log('  yeni :', yeniUrl.slice(0, 20));

const llmsC = await (await fetch(`${CANLI}/llms.txt`)).text();
const llmsY = await (await fetch(`${YEREL}/llms.txt`)).text();
// URL sayımı satır BAŞI değil, metnin TAMAMI üzerinden — llms.txt markdown
// biçiminde URL'leri satır içinde taşıyor (ilk sürüm 0 sayıyordu: vekil ölçüt).
const llmsCs = new Set(llmsC.match(/https?:\/\/[^\s)<]+/g) || []).size;
const llmsYs = new Set(llmsY.match(/https?:\/\/[^\s)<]+/g) || []).size;
console.log(`llms.txt: canlı ${llmsC.split('\n').length} satır/${llmsCs} benzersiz URL · yerel ${llmsY.split('\n').length} satır/${llmsYs} benzersiz URL`
  + (llmsYs < llmsCs ? '  🔴 GERİLEME' : ''));

const ortak = canliUrl.filter((u) => yerelUrl.includes(u));
console.log(`\nsayfa karşılaştırması: ${ortak.length} ortak URL\n`);

const gerilemeler = [];
const artislar = [];
const hatalar = [];
await havuz(ortak.map((yol) => async () => {
  const [c, y] = await Promise.all([metin(CANLI + yol), metin(YEREL + yol)]);
  if (c.hata || y.hata) { hatalar.push({ yol, canli: c.hata, yerel: y.hata }); return; }
  const a = olc(c.govde), b = olc(y.govde);
  const dusen = [];
  for (const k of ['h1', 'baslik', 'soruBaslik', 'ldBlok', 'icLink']) {
    if (b[k] < a[k]) dusen.push(`${k} ${a[k]}→${b[k]}`);
  }
  if (b.hAtlama > a.hAtlama) dusen.push(`hAtlama ${a.hAtlama}→${b.hAtlama}`);
  for (const k of ['title', 'canonical', 'ozCevap', 'og']) {
    if (a[k] && !b[k]) dusen.push(`${k} VAR→YOK`);
  }
  const kayipTip = a.ldTip.filter((t) => !b.ldTip.includes(t));
  if (kayipTip.length) dusen.push(`ld-tip kayıp: ${kayipTip.join(',')}`);
  if (dusen.length) gerilemeler.push({ yol, dusen });
  const artan = [];
  for (const k of ['soruBaslik', 'ldBlok', 'icLink']) if (b[k] > a[k]) artan.push(`${k} ${a[k]}→${b[k]}`);
  if (artan.length) artislar.push({ yol, artan });
}), ESZAMANLI);

console.log(`GERİLEME : ${gerilemeler.length}`);
for (const g of gerilemeler.slice(0, 30)) console.log(`  🔴 ${g.yol} — ${g.dusen.join(' · ')}`);
console.log(`artış    : ${artislar.length}`);
for (const a of artislar.slice(0, 8)) console.log(`  + ${a.yol} — ${a.artan.join(' · ')}`);
if (hatalar.length) { console.log(`HATA     : ${hatalar.length}`); hatalar.slice(0, 10).forEach((h) => console.log('  ', h)); }

await mkdir('cikti/denetim/gerileme', { recursive: true });
await writeFile('cikti/denetim/gerileme/sonuc.json', JSON.stringify({
  tarih: new Date().toISOString(), yerel: YEREL, canli: CANLI,
  sitemap: { canli: canliUrl.length, yerel: yerelUrl.length, kayip: kayipUrl, yeni: yeniUrl },
  llms: { canliSatir: llmsC.split('\n').length, yerelSatir: llmsY.split('\n').length, canliUrl: llmsCs, yerelUrl: llmsYs },
  ortakSayfa: ortak.length, gerilemeler, artislar, hatalar,
}, null, 1));
console.log('\nyazıldı: cikti/denetim/gerileme/sonuc.json');
process.exitCode = (gerilemeler.length || kayipUrl.length || hatalar.length) ? 1 : 0;
