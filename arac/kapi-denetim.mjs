/* GİRİŞ KAPISI DENETİMİ — /nerede-su-cikar/ kanıt paketi (kapı briefi 3.1).
   Ölçtükleri: konsol hatası, 375px yatay taşma, iç link kırığı, WCAG AA
   kontrast (sayfadaki TÜM görünür metin düğümleri), tam sayfa kareler.

   CANLI KOŞUL İLKESİ: taban `arac/dist-sun.mjs` olmalıdır (CSP + _redirects
   uygular). `python3 -m http.server` üzerinde alınan kanıt geçersizdir.
   GPU KURALI: bu sunucuda yazılımsal GL var; kareler görsel KALİTE kanıtı
   değildir, yalnız yerleşim/taşma/varlık kanıtıdır (CLAUDE.md).

   Kullanım: node arac/kapi-denetim.mjs [taban] [ciktiDizini] */
import { chromium } from '/home/suha/projeler/suharitasi/node_modules/playwright-core/index.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const TABAN = (process.argv[2] || 'http://127.0.0.1:5197').replace(/\/$/, '');
const CIKTI = process.argv[3] || '/home/suha/projeler/suharitasi-kapi/cikti/denetim/kapi';
const YOL = '/nerede-su-cikar/';
const EXE = '/home/suha/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell';

mkdirSync(CIKTI, { recursive: true });

// Headless yazılımsal GL sürücüsünün kendi mesajları sitenin hatası değildir.
const GURULTU = /GL Driver Message .*(Performance|GPU stall)/;

const tarayici = await chromium.launch({
  executablePath: EXE,
  args: ['--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'],
});

const rapor = { taban: TABAN, yol: YOL, zaman: new Date().toISOString() };

// — Sayfada çalışacak kontrast ölçeri: her görünür metin düğümü —
const KONTRAST_OLC = () => {
  const lum = ([r, g, b]) => {
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const oran = (a, b) => { const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x); return (l1 + 0.05) / (l2 + 0.05); };
  const ayik = (s) => {
    const m = String(s).match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
    return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null;
  };
  const zincirOpaklik = (el) => { let o = 1; let x = el; while (x) { o *= parseFloat(getComputedStyle(x).opacity); x = x.parentElement; } return o; };
  // Zemin: ilk saydam-olmayan ata; saydam katmanlar sırayla üst üste bindirilir.
  const zeminBul = (el) => {
    const katmanlar = [];
    let x = el;
    while (x) {
      const bg = ayik(getComputedStyle(x).backgroundColor);
      if (bg && bg[3] > 0) { katmanlar.push(bg); if (bg[3] === 1) break; }
      x = x.parentElement;
    }
    if (!katmanlar.length) return [255, 255, 255];
    let taban = katmanlar[katmanlar.length - 1].slice(0, 3);
    for (let i = katmanlar.length - 2; i >= 0; i--) {
      const k = katmanlar[i];
      taban = taban.map((c, j) => Math.round(k[j] * k[3] + c * (1 - k[3])));
    }
    return taban;
  };

  const sonuc = [];
  // Menü (pm-*) bu işin kapsamı değil — ayrı denetimi var; sayfanın KENDİ
  // içeriği ölçülür.
  const kapsam = document.querySelector('main') || document.body;
  for (const el of kapsam.querySelectorAll('*')) {
    if (el.closest('[class*="pm-"]')) continue;
    // Yalnız kendi doğrudan metnini taşıyan düğümler (ata tekrarı olmasın)
    const kendiMetin = [...el.childNodes]
      .filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
    if (kendiMetin.length < 2) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const st = getComputedStyle(el);
    if (st.visibility === 'hidden' || st.display === 'none') continue;
    const op = zincirOpaklik(el);
    if (op < 0.05) continue;
    const metin = ayik(st.color);
    if (!metin) continue;
    const zemin = zeminBul(el);
    const a = (metin[3] ?? 1) * op;
    const etkin = metin.slice(0, 3).map((c, j) => Math.round(c * a + zemin[j] * (1 - a)));
    const px = parseFloat(st.fontSize);
    const kalin = parseInt(st.fontWeight, 10) >= 700;
    // WCAG: büyük metin = ≥24px veya ≥18.66px kalın
    const buyuk = px >= 24 || (px >= 18.66 && kalin);
    sonuc.push({
      etiket: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : ''),
      ornek: kendiMetin.slice(0, 45),
      px: Math.round(px * 10) / 10,
      buyuk,
      esik: buyuk ? 3 : 4.5,
      oran: Math.round(oran(etkin, zemin) * 100) / 100,
    });
  }
  return sonuc;
};

// — 1440 masaüstü: konsol + kontrast + link + kare —
{
  const baglam = await tarayici.newContext({ viewport: { width: 1440, height: 900 } });
  const s = await baglam.newPage();
  const konsol = [];
  const gurultu = [];
  s.on('console', (m) => {
    if (m.type() !== 'error' && m.type() !== 'warning') return;
    (GURULTU.test(m.text()) ? gurultu : konsol).push(`${m.type()}: ${m.text()}`);
  });
  s.on('pageerror', (e) => konsol.push(`pageerror: ${e.message}`));

  const c = await s.goto(TABAN + YOL, { waitUntil: 'load', timeout: 30000 });
  rapor.http = c.status();
  await s.waitForTimeout(600);

  rapor.konsolHatasi = konsol;
  rapor.ortamGurultusu = gurultu.length;

  // İç linkler — hepsi tek tek istenir (kırık 0 şartı)
  const hedefler = await s.$$eval('a[href^="/"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))]);
  const kirik = [];
  for (const h of hedefler) {
    const y = await fetch(TABAN + h, { redirect: 'follow' });
    if (!y.ok) kirik.push({ yol: h, kod: y.status });
  }
  rapor.icLink = { benzersiz: hedefler.length, kirik };

  const kont = await s.evaluate(KONTRAST_OLC);
  const ihlal = kont.filter((x) => x.oran < x.esik);
  const enDar = kont.reduce((m, x) => (x.oran - x.esik < m.oran - m.esik ? x : m), kont[0]);
  rapor.kontrast = { olculen: kont.length, ihlal, enDarPay: enDar, hepsi: kont };

  await s.screenshot({ path: join(CIKTI, 'kapi-1440-tam.png'), fullPage: true });

  // İl seçici: ızgara her zaman AÇIK (katlanma yok — /kuyu-ruhsati/ deseni).
  // Kanıt için ızgaranın kendi kutusu ayrıca kırpılır.
  const izgara = await s.$('.il-listesi');
  if (izgara) await izgara.screenshot({ path: join(CIKTI, 'kapi-1440-il-secici.png') });
  rapor.ilSecici = {
    kapsayiciVar: Boolean(izgara),
    katlanirMi: await s.evaluate(() => Boolean(document.querySelector('.il-listesi')?.closest('details'))),
    gorunurLink: await s.$$eval('.il-listesi a', (as) => as.filter((a) => a.getBoundingClientRect().height > 0).length),
  };

  await baglam.close();
}

// — 375 mobil: taşma + kare —
{
  const baglam = await tarayici.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
  const s = await baglam.newPage();
  const konsol = [];
  s.on('console', (m) => { if ((m.type() === 'error' || m.type() === 'warning') && !GURULTU.test(m.text())) konsol.push(`${m.type()}: ${m.text()}`); });
  s.on('pageerror', (e) => konsol.push(`pageerror: ${e.message}`));
  await s.goto(TABAN + YOL, { waitUntil: 'load', timeout: 30000 });
  await s.waitForTimeout(600);

  rapor.mobil = await s.evaluate(() => {
    const kok = document.documentElement;
    const ad = (el) => el.tagName.toLowerCase() +
      (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/)[0] : '');
    // SAĞ taşma = kadraj dışına çıkan içerik (kullanıcının gördüğü arıza).
    // SOL park ayrı tutulur: .sv-damla imleç damlası her sayfada -108px'e
    // park edilmiş 6 öğedir (site geneli, bu işten önce de var) ve yatay
    // kaydırma yaratmaz. İkisini aynı sayaçta toplamak yanlış alarm üretir
    // (28.07 ölçümü: taban sayfalarda da 6 sol-park var).
    const sagTasan = [];
    const solPark = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      if (r.right > kok.clientWidth + 1) sagTasan.push({ etiket: ad(el), sag: Math.round(r.right) });
      if (r.left < -1) solPark.push({ etiket: ad(el), sol: Math.round(r.left) });
    }
    return {
      belgeGenislik: kok.scrollWidth,
      gorunumGenislik: kok.clientWidth,
      yatayTasmaPx: Math.max(0, kok.scrollWidth - kok.clientWidth),
      sagTasanOge: sagTasan.slice(0, 10),
      sagTasanSayisi: sagTasan.length,
      solParkSayisi: solPark.length,
      solParkOrnek: [...new Set(solPark.map((x) => x.etiket))].slice(0, 4),
    };
  });
  rapor.mobilKonsol = konsol;
  await s.screenshot({ path: join(CIKTI, 'kapi-375-tam.png'), fullPage: true });
  await baglam.close();
}

await tarayici.close();

writeFileSync(join(CIKTI, 'kapi-denetim.json'), JSON.stringify(rapor, null, 2) + '\n', 'utf8');

// — Özet + çıkış kodu (sessiz hata yasağı: başarısızlık exit≠0) —
const hatalar = [];
if (rapor.http !== 200) hatalar.push(`HTTP ${rapor.http}`);
if (rapor.konsolHatasi.length) hatalar.push(`konsol ${rapor.konsolHatasi.length}`);
if (rapor.mobilKonsol.length) hatalar.push(`mobil konsol ${rapor.mobilKonsol.length}`);
if (rapor.icLink.kirik.length) hatalar.push(`kırık link ${rapor.icLink.kirik.length}`);
if (rapor.kontrast.ihlal.length) hatalar.push(`kontrast ihlali ${rapor.kontrast.ihlal.length}`);
if (rapor.mobil.yatayTasmaPx > 0) hatalar.push(`375 taşma ${rapor.mobil.yatayTasmaPx}px`);
if (rapor.mobil.sagTasanSayisi > 0) hatalar.push(`375 sağ taşan öğe ${rapor.mobil.sagTasanSayisi}`);

console.log(`HTTP ${rapor.http} · konsol ${rapor.konsolHatasi.length} (ortam gürültüsü ${rapor.ortamGurultusu})`);
console.log(`iç link ${rapor.icLink.benzersiz} benzersiz, kırık ${rapor.icLink.kirik.length}`);
console.log(`il seçici: ${rapor.ilSecici.gorunurLink} görünür link, katlanır mı: ${rapor.ilSecici.katlanirMi}`);
console.log(`kontrast: ${rapor.kontrast.olculen} düğüm ölçüldü, ihlal ${rapor.kontrast.ihlal.length}, en dar pay ${rapor.kontrast.enDarPay.oran}:1 (eşik ${rapor.kontrast.enDarPay.esik}) ${rapor.kontrast.enDarPay.etiket}`);
console.log(`375: belge ${rapor.mobil.belgeGenislik}px / görünüm ${rapor.mobil.gorunumGenislik}px, yatay taşma ${rapor.mobil.yatayTasmaPx}px, sağ taşan öğe ${rapor.mobil.sagTasanSayisi} (sola park edilmiş dekoratif öğe ${rapor.mobil.solParkSayisi} — site geneli, taban)`);
console.log(`kareler: ${CIKTI}`);

if (hatalar.length) { console.error('DENETİM DÜŞTÜ: ' + hatalar.join(' · ')); process.exit(1); }
console.log('DENETİM GEÇTİ');
