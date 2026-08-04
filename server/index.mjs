#!/usr/bin/env node
/**
 * suharitasi API — Hetzner VPS
 * PayTR odeme + PDF rapor uretimi + email teslimati
 *
 * Baslatma: cd server && npm start
 * Port: 3099 (Cloudflare'den proxy)
 */
import express from 'express';
import { initDB, createOrder, getOrder, updateOrderStatus } from './db.mjs';
import { createCharge, verifyCallback } from './paytr.mjs';
import { generatePDF } from './pdf.mjs';
import { sendReportEmail } from './email.mjs';

const PORT = process.env.API_PORT || 3099;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initDB();

// CORS — Cloudflare Pages frontend'den gelen isteklere izin
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://suharitasi.com');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const PAKETLER = {
  paket_1: { ad: 'Ön Değerlendirme & Risk Raporu', fiyat: 350000 },
  paket_2: { ad: 'Detaylı B2B Su Potansiyeli & Ruhsat Analizi', fiyat: 800000 },
  paket_3: { ad: 'Kurumsal Hukuki Görüş & Resmi Başvuru Paketi', fiyat: 1500000 },
};

/** POST /api/paytr/create-charge — odeme baslatma */
app.post('/api/paytr/create-charge', async (req, res) => {
  try {
    const { package_id, customer_name, customer_email, customer_phone, customer_tax_id, parcel_info } = req.body;
    const user_ip = req.headers['x-forwarded-for'] || req.ip || '127.0.0.1';

    const paket = PAKETLER[package_id];
    if (!paket) return res.status(400).json({ error: 'Gecersiz paket' });

    const ts = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const rnd = Math.random().toString(36).slice(2, 8).toUpperCase();
    const merchant_oid = `AH-${ts}-${rnd}`;

    createOrder({
      merchant_oid, package_id, amount: paket.fiyat,
      customer_name, customer_email, customer_phone, customer_tax_id,
      parcel_info: parcel_info || '', status: 'PENDING',
    });

    const basket = [[`Arslan Hukuk B2B Raporu — ${paket.ad}`, paket.fiyat, 1]];
    const result = await createCharge({
      merchant_oid, user_ip, email: customer_email,
      payment_amount: paket.fiyat, user_basket: basket, package_name: paket.ad,
    });

    if (result.error) return res.status(400).json({ error: result.error });
    res.json({ token: result.token, merchant_oid });
  } catch (e) {
    console.error('[create-charge]', e);
    res.status(500).json({ error: 'Sunucu hatasi' });
  }
});

/** POST /api/paytr/callback — PayTR webhook */
app.post('/api/paytr/callback', async (req, res) => {
  try {
    const { merchant_oid, status, total_amount, hash } = req.body;
    console.log('[callback]', merchant_oid, status);

    const verified = verifyCallback({ merchant_oid, status, total_amount }, hash);
    if (!verified) {
      console.error('[callback] BAD HASH');
      return res.status(400).send('PAYTR notification failed: bad hash');
    }

    if (status === 'success') {
      updateOrderStatus(merchant_oid, 'PAID');
      const order = getOrder(merchant_oid);

      // PDF'i async uret ve email gonder (callback'i bloklama)
      setImmediate(async () => {
        try {
          const pdfPath = await generatePDF(order);
          updateOrderStatus(merchant_oid, 'COMPLETED', pdfPath);
          await sendReportEmail(order, pdfPath);
        } catch (e) {
          console.error('[pdf-email]', merchant_oid, e.message);
        }
      });
    } else {
      updateOrderStatus(merchant_oid, 'FAILED');
    }

    res.send('OK');
  } catch (e) {
    console.error('[callback]', e);
    res.status(500).send('OK'); // PayTR OK bekler
  }
});

/** GET /api/order-status/:oid — siparis durumu sorgulama */
app.get('/api/order-status/:oid', (req, res) => {
  const order = getOrder(req.params.oid);
  if (!order) return res.status(404).json({ error: 'Siparis bulunamadi' });
  res.json({
    status: order.status,
    pdf_ready: order.status === 'COMPLETED',
    package_id: order.package_id,
  });
});

app.listen(PORT, () => console.log(`[API] suharitasi-api :${PORT}`));
