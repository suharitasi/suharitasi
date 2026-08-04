/**
 * email.mjs — Nodemailer ile PDF rapor email teslimati
 */
import nodemailer from 'nodemailer';
import { readFileSync, existsSync } from 'fs';

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'rapor@suharitasi.com';

const transporter = SMTP_HOST ? nodemailer.createTransport({
  host: SMTP_HOST, port: SMTP_PORT, secure: SMTP_PORT === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
}) : null;

export async function sendReportEmail(order, pdfPath) {
  if (!transporter) {
    console.log('[email] SMTP yapilandirilmadi — email atlanmistir');
    return;
  }

  const pkg = {
    paket_1: 'Ön Değerlendirme & Risk Raporu',
    paket_2: 'Detaylı B2B Su Potansiyeli & Ruhsat Analizi',
    paket_3: 'Kurumsal Hukuki Görüş & Resmi Başvuru Paketi',
  }[order.package_id] || 'B2B Rapor';

  const attachments = [];
  if (existsSync(pdfPath)) {
    attachments.push({
      filename: `ArslanHukuk_${order.merchant_oid}.pdf`,
      content: readFileSync(pdfPath),
      contentType: 'application/pdf',
    });
  }

  await transporter.sendMail({
    from: `"Su Haritası Rapor" <${FROM_EMAIL}>`,
    to: order.customer_email,
    subject: `${pkg} — Sipariş No: ${order.merchant_oid}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#0C3B4E">Su Haritası — ${pkg}</h2>
        <p>Sayın ${order.customer_name || 'yetkili'},</p>
        <p><strong>${pkg}</strong> talebinize istinaden raporunuz ekte sunulmuştur.</p>
        <p>Sipariş No: <strong>${order.merchant_oid}</strong></p>
        <p>Raporunuzun hukuki değerlendirmesi ve sonraki adımlar için ofisimizle iletişime geçebilirsiniz.</p>
        <hr style="border:0;border-top:1px solid #ddd;margin:20px 0">
        <p style="color:#888;font-size:12px">Arslan Hukuk Bürosu — Av. Serdar Arslan<br>suharitasi.com | arslanhukuk.tr</p>
      </div>
    `,
    attachments,
  });

  console.log('[email] Gonderildi:', order.customer_email);
}
