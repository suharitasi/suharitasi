/* Dalga 1 öz-denetimi: konsol, kırık link, görüntüler, yazdırma kanıtı.
   Kullanım: dist'i bir portta servis et, sonra:
     node arac/dalga1-denetim.mjs                                        */
import { chromium } from '/root/projeler/suharitasi/node_modules/playwright-core/index.mjs';
import { mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const TABAN = process.env.TABAN || 'http://localhost:5197';
const KOK = '/root/projeler/suharitasi';
const CIKTI = `${KOK}/cikti/dalga1`;
const EXE = '/root/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell';

const YOLLAR = [
  ['/', 'landing'],
  ['/harita/', 'harita'],
  ['/havzalar/', 'havzalar'],
  ['/havzalar/sakarya/', 'havza-sakarya'],
  ['/rehberler/', 'rehberler'],
  ['/rehberler/kuyu-ruhsati/', 'rehber-kuyu-ruhsati'],
  ['/su-kanunu/', 'su-kanunu'],
  ['/su-kanunu/taslak-takibi/', 'su-kanunu-taslak'],
  ['/hakkinda/', 'hakkinda'],
];

mkdirSync(CIKTI, { recursive: true });

const tarayici = await chromium.launch({
  executablePath: EXE,
  args: ['--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'],
});
const baglam = await tarayici.newContext({ viewport: { width: 1440, height: 900 } });

const konsol = [];
const linkler = new Set();
let sayfaSayisi = 0;

for (const [yol, ad] of YOLLAR) {
  const sayfa = await baglam.newPage();
  const olaylar = [];
  sayfa.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') {
      const t = m.text();
      // Yazılımsal GL sürücü gürültüsü (GPU'suz sunucu) denetim konusu değil.
      if (/SwiftShader|GroupMarkerNotSet|Fontconfig|GPU stall/i.test(t)) return;
      olaylar.push(`[${m.type()}] ${t}`);
    }
  });
  sayfa.on('pageerror', (e) => olaylar.push(`[pageerror] ${e.message}`));

  const yanit = await sayfa.goto(TABAN + yol, { waitUntil: 'networkidle' });
  if (yanit.status() >= 400) olaylar.push(`[http] ${yanit.status()}`);
  sayfaSayisi++;

  // Scroll reveal'ı tetikle: tam sayfa görüntüde içerik dolu çıksın.
  await sayfa.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await sayfa.waitForTimeout(400);

  for (const h of await sayfa.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')))) {
    if (h && !/^(https?:|mailto:|tel:|#)/.test(h)) linkler.add(new URL(h, TABAN + yol).pathname);
  }

  await sayfa.screenshot({ path: `${CIKTI}/${ad}.png`, fullPage: true });
  if (olaylar.length) konsol.push(`${yol}: ${olaylar.join(' | ')}`);
  await sayfa.close();
}

// — Mobil landing
const mob = await tarayici.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const ms = await mob.newPage();
await ms.goto(TABAN + '/', { waitUntil: 'networkidle' });
await ms.waitForTimeout(2600); // giriş koreografisi otursun
await ms.screenshot({ path: `${CIKTI}/landing-mobil.png`, fullPage: true });
await mob.close();

// — Kırık link taraması
const kirik = [];
for (const l of [...linkler].sort()) {
  const r = await baglam.request.get(TABAN + l);
  if (r.status() >= 400) kirik.push(`${l} → ${r.status()}`);
}

// — YAZDIRMA KANITI (rapor KOD-5)
// 1) print medyasında .sv-reveal opaklığı ölçülür
// 2) gerçek PDF üretilip metni çıkarılır: tablo satırları kâğıtta mı?
const yazdirma = {};
for (const [yol, ad] of [['/rehberler/kuyu-ruhsati/', 'rehber-kuyu-ruhsati'], ['/havzalar/', 'havzalar']]) {
  const s = await baglam.newPage();
  await s.goto(TABAN + yol, { waitUntil: 'networkidle' });
  const toplam = await s.$$eval('.sv-reveal', (es) => es.length);

  /* YÜK TAŞIYAN KANIT: print medyasında hesaplanmış opaklık.
     PDF metin çıkarımı görünürlüğü KANITLAMAZ — pdftotext opacity:0 metni de
     çıkarır; o kontroller içeriğin belgede olduğunu gösterir, kâğıtta
     göründüğünü değil. Görünürlüğün tek ölçüsü burasıdır. */
  await s.emulateMedia({ media: 'print' });
  const yazdirmada = await s.$$eval('.sv-reveal', (es) =>
    es.filter((e) => getComputedStyle(e).opacity !== '1').length);
  // Görsel kanıt: print medyasında, hiç kaydırmadan alınan tam sayfa kare.
  await s.screenshot({ path: `${CIKTI}/${ad}-yazdirma.png`, fullPage: true });

  await s.emulateMedia({ media: 'screen' });
  const pdf = `${CIKTI}/${ad}.pdf`;
  await s.pdf({ path: pdf, format: 'A4', printBackground: true });
  const metin = execFileSync('pdftotext', [pdf, '-']).toString();
  yazdirma[yol] = { toplam, yazdirmadaGizli: yazdirmada, metin };
  await s.close();
}

await tarayici.close();

// — Rapor
const satir = (b) => (b ? 'GEÇTİ' : 'KALDI');
console.log(`\n=== DALGA 1 ÖZ-DENETİM (${sayfaSayisi} sayfa) ===\n`);
console.log(`Konsol hata/uyarı : ${satir(konsol.length === 0)} (${konsol.length})`);
konsol.forEach((k) => console.log('   ! ' + k));
console.log(`Kırık iç link     : ${satir(kirik.length === 0)} (${kirik.length}/${linkler.size} tekil link)`);
kirik.forEach((k) => console.log('   ! ' + k));

console.log('\n--- Yazdırma kanıtı (KOD-5) ---');
console.log('Ölçüt: print medyasında opaklığı 1 olmayan .sv-reveal öğesi sayısı.');
let yazdirmaTamam = true;
for (const [yol, d] of Object.entries(yazdirma)) {
  console.log(`${yol}`);
  console.log(`   .sv-reveal öğe   : ${d.toplam}`);
  console.log(`   yazdırmada gizli : ${d.yazdirmadaGizli}  ${d.yazdirmadaGizli === 0 ? '← tamamı görünür' : '← HÂLÂ GİZLİ'}`);
  if (d.yazdirmadaGizli !== 0) yazdirmaTamam = false;
}
console.log('\nPDF metin kontrolü (destekleyici — görünürlük değil, içeriğin');
console.log('belgede bulunduğu kanıtı; pdftotext saydam metni de çıkarır):');

/* PDF metnini kıyasa hazırla: pdftotext dar tablo hücresini satırlara böler
   ("Ölçüm\nsistemi\nşarttır") ve letter-spacing'li başlığı harf harf ayırır
   ("B U R E H B E R İ..."). Ayrıca CSS text-transform büyütür. Bu yüzden
   boşluklar atılır ve i/ı/İ/I tek harfe indirgenir — aksi halde var olan
   içerik "yok" sanılır (ilk turda tam bu oldu). */
const kats = (s) =>
  s.replace(/\s+/g, '').replace(/[ıIİ]/g, 'i').toLowerCase();

const r = kats(yazdirma['/rehberler/kuyu-ruhsati/'].metin);
const h = kats(yazdirma['/havzalar/'].metin);
const var_ = (metin, aranan) => metin.includes(kats(aranan));
const kanit = [
  ['PDF: rehber tablo başlığı "Islah-tadil belgesi"', var_(r, 'Islah-tadil belgesi')],
  ['PDF: rehber tablo hücresi "Ölçüm sistemi şarttır"', var_(r, 'Ölçüm sistemi şarttır')],
  ['PDF: rehber tablo hücresi "Belgesiz açım yasaktır"', var_(r, 'Belgesiz açım yasaktır')],
  ['PDF: 81 il tablosundan "Eskişehir"', var_(r, 'Eskişehir')],
  ['PDF: yazar kutusu etiketi "Bu rehberi hazırlayan"', var_(r, 'Bu rehberi hazırlayan')],
  ['PDF: yazar kutusu adı "Av. Serdar Arslan"', var_(r, 'Av. Serdar Arslan')],
  ['PDF: "İlgili rehberler" bloğu', var_(r, 'İlgili rehberler')],
  ['PDF: havza listesinde 25. havza "Van Gölü"', var_(h, 'Van Gölü')],
  ['PDF: havza listesinde 13. havza "Kızılırmak"', var_(h, 'Kızılırmak')],
  ['PDF: havza listesinde 1. havza "Meriç-Ergene"', var_(h, 'Meriç-Ergene')],
];
kanit.forEach(([ad, ok]) => { console.log(`   ${ok ? '✓' : '✗'} ${ad}`); if (!ok) yazdirmaTamam = false; });
console.log(`\nYazdırma : ${satir(yazdirmaTamam)}`);
console.log(`Görüntüler: ${CIKTI}/`);

const tamam = konsol.length === 0 && kirik.length === 0 && yazdirmaTamam;
console.log(`\n=== SONUÇ: ${satir(tamam)} ===`);
process.exit(tamam ? 0 : 1);
