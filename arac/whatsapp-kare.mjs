// WhatsApp düğmesi kıyas kareleri (D8, 08.09.2026).
// Kullanım: node arac/whatsapp-kare.mjs <etiket: once|sonra> <kokUrl>
// Üç sayfa × iki genişlik (430 / 1440): tam sayfa + sayfa sonu görünümü.
// Çıktı: cikti/denetim/whatsapp-dugme/<etiket>-<sayfa>-<genislik>[-son].png
// Ölçüm de yazar: düğme kutusu, viewport kapladığı yüzde, footer kesişimi
// (D5), odak halkası (D3) — JSON olarak aynı dizine.
import { chromium } from '/home/suha/projeler/suharitasi/node_modules/playwright-core/index.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';

const EXE = '/home/suha/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell';
const [etiket, kok] = process.argv.slice(2);
if (!etiket || !kok) { console.error('kullanım: etiket kokUrl'); process.exit(2); }
const DIZIN = 'cikti/denetim/whatsapp-dugme';
mkdirSync(DIZIN, { recursive: true });
const SAYFALAR = [
  ['anasayfa', '/'],
  ['havza-gediz', '/havzalar/gediz/'],
  ['rehber-iptal', '/rehberler/kuyu-belgesi-iptal-davalari/'],
];
const GENISLIK = [[430, 932], [1440, 900]];
const tarayici = await chromium.launch({ executablePath: EXE });
const olcumler = [];
for (const [ad, yol] of SAYFALAR) {
  for (const [w, h] of GENISLIK) {
    const ctx = await tarayici.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const sayfa = await ctx.newPage();
    const konsol = [];
    sayfa.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') konsol.push(m.text()); });
    sayfa.on('pageerror', (e) => konsol.push('pageerror: ' + e.message));
    await sayfa.goto(kok + yol, { waitUntil: 'networkidle' });
    await sayfa.waitForTimeout(400);
    await sayfa.screenshot({ path: `${DIZIN}/${etiket}-${ad}-${w}.png`, fullPage: false });
    // `html { scroll-behavior: smooth }` yüzünden düz scrollTo kareyi
    // animasyon ortasında yakalıyordu (ilk koşumda ölçüldü): anlık kaydır.
    await sayfa.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }); });
    await sayfa.waitForTimeout(500);
    await sayfa.screenshot({ path: `${DIZIN}/${etiket}-${ad}-${w}-son.png`, fullPage: false });
    const o = await sayfa.evaluate(() => {
      const d = document.querySelector('.wa-dugme');
      if (!d) return { dugme: null };
      const r = d.getBoundingClientRect();
      const vw = innerWidth, vh = innerHeight;
      const alan = r.width * r.height, yuzde = +(100 * alan / (vw * vh)).toFixed(2);
      const kesisen = [];
      for (const el of document.querySelectorAll('footer a, footer p, .alt-imza, .serh, .hukuki-serh, main p, main a, main li')) {
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) continue;
        const kes = !(b.right < r.left || b.left > r.right || b.bottom < r.top || b.top > r.bottom);
        if (kes) kesisen.push((el.tagName + ' ' + (el.textContent || '').trim().slice(0, 60)));
      }
      const cs = getComputedStyle(d);
      return { dugme: { x: r.x, y: r.y, w: r.width, h: r.height }, yuzde, kesisen, zIndex: cs.zIndex, position: cs.position,
        arka: cs.backgroundColor, on: cs.color, ariaLabel: d.getAttribute('aria-label'), href: d.getAttribute('href'), metin: d.textContent.trim() };
    });
    let odak = null;
    if (o.dugme) {
      await sayfa.focus('.wa-dugme');
      odak = await sayfa.evaluate(() => { const cs = getComputedStyle(document.querySelector('.wa-dugme')); return { outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor, offset: cs.outlineOffset, aktif: document.activeElement.classList.contains('wa-dugme') }; });
      await sayfa.screenshot({ path: `${DIZIN}/${etiket}-${ad}-${w}-odak.png`, fullPage: false });
    }
    olcumler.push({ sayfa: yol, genislik: w, ...o, odak, konsol });
    await ctx.close();
  }
}
await tarayici.close();
writeFileSync(`${DIZIN}/${etiket}-olcum.json`, JSON.stringify(olcumler, null, 2));
console.log(JSON.stringify(olcumler, null, 1));
