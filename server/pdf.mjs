/**
 * pdf.mjs — Puppeteer ile filigranli PDF + guvenlik kisitlamalari
 */
import { launch } from 'puppeteer';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PDF_DIR = join(__dirname, '..', 'data', 'raporlar');
if (!existsSync(PDF_DIR)) mkdirSync(PDF_DIR, { recursive: true });

const LOGO_BASE64 = ''; // opsiyonel: suharitasi logosu base64

function buildHTML(order) {
  const pkg = {
    paket_1: { ad: 'Ön Değerlendirme & Risk Raporu', aciklama: 'Temel su potansiyeli değerlendirmesi ve risk skorlaması.' },
    paket_2: { ad: 'Detaylı B2B Su Potansiyeli & Ruhsat Analizi', aciklama: 'İlçe bazlı AHP skoru, akifer analizi, ruhsat risk değerlendirmesi.' },
    paket_3: { ad: 'Kurumsal Hukuki Görüş & Resmi Başvuru Paketi', aciklama: 'Tam kapsamlı hukuki analiz, başvuru dosyası hazırlığı, DSİ yazışma desteği.' },
  }[order.package_id] || { ad: 'B2B Rapor', aciklama: '' };

  const tarih = new Date().toLocaleDateString('tr-TR', { year:'numeric', month:'long', day:'numeric' });

  return `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><style>
    @page { size: A4; margin: 2.5cm 2cm 3cm 2cm; @bottom-center { content: "Müşteri: ${order.customer_name} | VKN/TCKN: ${order.customer_tax_id} | Sipariş: ${order.merchant_oid}"; font-size: 7pt; color: #999; } }
    body { font-family: "DejaVu Sans", Arial, sans-serif; font-size: 11pt; color: #1a1a1a; line-height: 1.6; }
    .watermark { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999; }
    .watermark-inner { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(-35deg); font-size: 64pt; color: rgba(0,0,0,0.06); white-space: nowrap; font-weight: bold; letter-spacing: 0.3em; }
    h1 { font-size: 22pt; color: #0C3B4E; border-bottom: 2px solid #2E7EA0; padding-bottom: 8pt; margin-bottom: 16pt; }
    h2 { font-size: 14pt; color: #0C5A7C; margin-top: 20pt; }
    .musteri-bilgi { margin: 12pt 0; padding: 10pt; background: #f5f8fa; border-left: 3px solid #2E7EA0; font-size: 9pt; }
    .musteri-bilgi strong { display: inline-block; width: 90pt; }
    .uyari { margin-top: 30pt; padding: 8pt 12pt; background: #fff8e1; border: 1px solid #e6c340; font-size: 8pt; color: #6d5200; }
    table { width: 100%; border-collapse: collapse; margin: 10pt 0; font-size: 9pt; }
    th { background: #0C5A7C; color: #fff; padding: 6pt 8pt; text-align: left; }
    td { padding: 5pt 8pt; border-bottom: 1px solid #e0e0e0; }
    .footer { margin-top: 40pt; padding-top: 8pt; border-top: 1px solid #ccc; font-size: 7pt; color: #888; }
  </style></head><body>
    <div class="watermark"><div class="watermark-inner">ARSLAN HUKUK BÜROSU</div></div>
    <h1>${pkg.ad}</h1>
    <p><em>Rapor Tarihi: ${tarih} | Sipariş No: ${order.merchant_oid}</em></p>

    <h2>Müşteri Bilgileri</h2>
    <div class="musteri-bilgi">
      <div><strong>Ad Soyad:</strong> ${order.customer_name || '—'}</div>
      <div><strong>E-posta:</strong> ${order.customer_email || '—'}</div>
      <div><strong>Telefon:</strong> ${order.customer_phone || '—'}</div>
      <div><strong>VKN/TCKN:</strong> ${order.customer_tax_id || '—'}</div>
      <div><strong>Bilgi Notu:</strong> ${order.parcel_info || '—'}</div>
    </div>

    <h2>Paket Kapsami</h2>
    <p>${pkg.aciklama}</p>
    <table><tr><th>Kalem</th><th>Tutar</th></tr><tr><td>${pkg.ad}</td><td>${(order.amount / 100).toLocaleString('tr-TR')} TL</td></tr></table>

    <h2>Rapor İçeriği</h2>
    <p>Bu bölüm seçtiğiniz pakete göre detaylandırılacaktır. Kurumsal hukuki görüş ve resmi başvuru paketlerinde Av. Serdar Arslan tarafından hazırlanan kişiselleştirilmiş analiz, bölgenizdeki DSİ kısıtlamaları, ruhsat risk değerlendirmesi ve başvuru stratejisi yer alacaktır.</p>

    <div class="uyari">
      <strong>YASAL UYARI:</strong> Bu rapor bilgilendirme amaçlıdır; hukuki görüş veya resmi kurum kararı niteliği TAŞIMAZ. Su hukuku konularında nihai karar vermeden önce Av. Serdar Arslan (Arslan Hukuk Bürosu) ile görüşünüz. Rapor içeriği gizlidir ve yalnızca muhatabına özeldir.
    </div>

    <div class="footer">© Arslan Hukuk Bürosu — suharitasi.com | Bu rapor ${tarih} tarihinde otomatik üretilmiştir.</div>
  </body></html>`;
}

export async function generatePDF(order) {
  const browser = await launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(buildHTML(order), { waitUntil: 'networkidle0' });

    const pdfPath = join(PDF_DIR, `${order.merchant_oid}.pdf`);
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: `<span style="font-size:7pt;color:#999;width:100%;text-align:center;">Müşteri: ${order.customer_name} | VKN/TCKN: ${order.customer_tax_id} | Sipariş: ${order.merchant_oid}</span>`,
      margin: { top: '2.5cm', bottom: '3cm', left: '2cm', right: '2cm' },
    });

    console.log('[PDF] Uretildi:', pdfPath);
    return pdfPath;
  } finally {
    await browser.close();
  }
}
