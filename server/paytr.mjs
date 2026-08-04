/**
 * paytr.mjs — PayTR API entegrasyonu
 */
import crypto from 'crypto';

const MERCHANT_ID   = process.env.PAYTR_MERCHANT_ID   || '564252';
const MERCHANT_KEY  = process.env.PAYTR_MERCHANT_KEY  || 'GrZx4torgMXQgGsR';
const MERCHANT_SALT = process.env.PAYTR_MERCHANT_SALT || 'Ebk8Pfzt99SdnX6N';
const OK_URL        = process.env.PAYTR_OK_URL  || 'https://arslanhukuk.tr/rapor-indir?status=success';
const FAIL_URL      = process.env.PAYTR_FAIL_URL || 'https://arslanhukuk.tr/rapor-indir?status=failed';
const PAYTR_URL     = 'https://www.paytr.com/odeme/api/get-token';

function paytrHash(str) {
  return crypto.createHmac('sha256', MERCHANT_KEY).update(str).digest('base64');
}

export async function createCharge({ merchant_oid, user_ip, email, payment_amount, user_basket, package_name }) {
  const basketJson = JSON.stringify(user_basket);
  const testMode = process.env.PAYTR_TEST_MODE === '1' ? '1' : '0';
  const noInstallment = '1';
  const maxInstallment = '1';
  const currency = 'TL';

  const hashStr = MERCHANT_ID + user_ip + merchant_oid + email +
    payment_amount + basketJson + noInstallment + maxInstallment + currency + testMode;
  const token = paytrHash(hashStr + MERCHANT_SALT);

  const body = new URLSearchParams({
    merchant_id: MERCHANT_ID,
    user_ip,
    merchant_oid,
    email,
    payment_amount: String(payment_amount),
    paytr_token: token,
    user_basket: basketJson,
    no_installment: noInstallment,
    max_installment: maxInstallment,
    currency,
    test_mode: testMode,
    merchant_ok_url: OK_URL,
    merchant_fail_url: FAIL_URL,
    user_name: '',
    user_address: '',
    user_phone: '',
    lang: 'tr',
    debug_on: '1',
  });

  try {
    const resp = await fetch(PAYTR_URL, { method: 'POST', body });
    const data = await resp.json();
    if (data.status === 'success') return { token: data.token, merchant_oid };
    return { error: data.reason || 'PayTR hatasi' };
  } catch (e) {
    return { error: e.message };
  }
}

export function verifyCallback({ merchant_oid, status, total_amount }, paytrHashReceived) {
  const hashStr = merchant_oid + MERCHANT_SALT + status + total_amount;
  const expected = paytrHash(hashStr);
  return expected === paytrHashReceived;
}
