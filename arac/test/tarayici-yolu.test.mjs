import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import os from 'node:os';
import { tarayiciYolu, tarayiciYoluZorunlu } from '../tarayici-yolu.mjs';

test('SAGLIK_CHROME önceliklidir; var olmayan yol atlanır; hiçbir aday yoksa null ve zorunlu sürüm hata fırlatır', () => {
  const tmp = mkdtempSync(join(os.tmpdir(), 'pw-'));
  const sahte = join(tmp, 'sahte-chrome'); writeFileSync(sahte, '');
  const bos = mkdtempSync(join(os.tmpdir(), 'pw-bos-'));
  assert.equal(tarayiciYolu('chromium', { env: { SAGLIK_CHROME: sahte, PLAYWRIGHT_BROWSERS_PATH: bos } }).yol, sahte);
  const s = tarayiciYolu('chromium', { env: { SAGLIK_CHROME: join(tmp, 'yok'), PLAYWRIGHT_BROWSERS_PATH: bos } });
  assert.equal(s.yol, null); assert.equal(s.kaynak, 'yok'); assert.equal(s.adaylar.length, 1);
  assert.throws(
    () => tarayiciYoluZorunlu('chromium', { env: { PLAYWRIGHT_BROWSERS_PATH: bos }, pw: { chromium: { executablePath: () => join(tmp, 'yok') } } }),
    /Chromium bulunamadı/,
  );
});

test('önbellek taraması: en yeni sürüm numarası, yalnız var olan yürütülebilir; headless shell deseni ayrı', () => {
  const tmp = mkdtempSync(join(os.tmpdir(), 'pw-'));
  for (const r of ['1228', '1243']) {
    mkdirSync(join(tmp, `chromium-${r}`, 'chrome-linux64'), { recursive: true });
  }
  writeFileSync(join(tmp, 'chromium-1228', 'chrome-linux64', 'chrome'), '');
  mkdirSync(join(tmp, 'chromium_headless_shell-1243', 'chrome-headless-shell-linux64'), { recursive: true });
  writeFileSync(join(tmp, 'chromium_headless_shell-1243', 'chrome-headless-shell-linux64', 'chrome-headless-shell'), '');
  const env = { PLAYWRIGHT_BROWSERS_PATH: tmp };
  assert.equal(tarayiciYolu('chromium', { env }).yol, join(tmp, 'chromium-1228', 'chrome-linux64', 'chrome'));
  assert.equal(tarayiciYolu('chromium', { env }).kaynak, 'onbellek');
  assert.equal(tarayiciYolu('chromium-headless-shell', { env }).yol, join(tmp, 'chromium_headless_shell-1243', 'chrome-headless-shell-linux64', 'chrome-headless-shell'));
  const pw = { chromium: { executablePath: () => join(tmp, 'chromium-1228', 'chrome-linux64', 'chrome') } };
  assert.equal(tarayiciYolu('chromium', { env, pw }).kaynak, 'playwright-core');
});

test('bu sunucuda gerçek Chromium bulunur (sağlık sistemi koşabilir)', () => {
  const s = tarayiciYolu('chromium');
  assert.ok(s.yol, `Chromium yok: ${s.adaylar.join(', ')}`);
});
