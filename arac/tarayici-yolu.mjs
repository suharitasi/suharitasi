// TARAYICI YOLU ÇÖZÜMLEYİCİ (07.10.2026 denetimi).
// NEDEN: arac/*.mjs içinde Playwright Chromium yolu sabit yazılıydı
// (~/.cache/ms-playwright/chromium-1228/...). 06.10.2026 19:35'te başka bir
// projenin `playwright install` koşumu, kayıtsız 1228 sürümünü sildi; sağlık
// sistemi üç koşum üst üste çöktü (log/site-saglik-cron.log). Yol artık
// sırayla çözülür: SAGLIK_CHROME ortam değişkeni → playwright-core'un kendi
// beklediği sürüm → önbellekteki en yeni uyumlu kurulum. Hiçbiri yoksa null
// döner; çağıran bunu KIRMIZI olarak raporlar, çökmez.
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import os from 'node:os';

const onbellekDizini = (env) => env.PLAYWRIGHT_BROWSERS_PATH || join(os.homedir(), '.cache', 'ms-playwright');
const DESEN = {
  chromium: { dizin: /^chromium-(\d+)$/, dosya: join('chrome-linux64', 'chrome') },
  'chromium-headless-shell': { dizin: /^chromium_headless_shell-(\d+)$/, dosya: join('chrome-headless-shell-linux64', 'chrome-headless-shell') },
};

function onbellekAdaylari(tip, env) {
  const d = DESEN[tip];
  const kok = onbellekDizini(env);
  let girisler = [];
  try { girisler = readdirSync(kok); } catch { return []; }
  return girisler
    .map((ad) => ({ ad, m: d.dizin.exec(ad) }))
    .filter((x) => x.m)
    .sort((a, b) => Number(b.m[1]) - Number(a.m[1]))
    .map((x) => join(kok, x.ad, d.dosya))
    .filter((y) => existsSync(y));
}

/** @param {'chromium'|'chromium-headless-shell'} tip
 *  @param {{ pw?: any, env?: NodeJS.ProcessEnv }} [secenek] pw: playwright-core modülü (varsa executablePath() denenir)
 *  @returns {{ yol: string|null, kaynak: string, adaylar: string[] }} */
export function tarayiciYolu(tip = 'chromium', secenek = {}) {
  const env = secenek.env ?? process.env;
  const adaylar = [];
  if (env.SAGLIK_CHROME) adaylar.push({ yol: env.SAGLIK_CHROME, kaynak: 'SAGLIK_CHROME' });
  if (secenek.pw?.chromium?.executablePath) {
    try { adaylar.push({ yol: secenek.pw.chromium.executablePath(), kaynak: 'playwright-core' }); } catch { /* yoksay */ }
  }
  for (const y of onbellekAdaylari(tip, env)) adaylar.push({ yol: y, kaynak: 'onbellek' });
  const bulunan = adaylar.find((a) => a.yol && existsSync(a.yol));
  return {
    yol: bulunan?.yol ?? null,
    kaynak: bulunan?.kaynak ?? 'yok',
    adaylar: adaylar.map((a) => a.yol),
  };
}

/** Bulunamazsa açıklayıcı hata fırlatır (çağıranın korumalı bloğu yakalar). */
export function tarayiciYoluZorunlu(tip = 'chromium', secenek = {}) {
  const s = tarayiciYolu(tip, secenek);
  if (!s.yol) {
    throw new Error(`Chromium bulunamadı (${tip}); denenen: ${s.adaylar.join(', ') || 'aday yok'}. `
      + 'Kurulum: node node_modules/playwright-core/cli.js install chromium');
  }
  return s.yol;
}
