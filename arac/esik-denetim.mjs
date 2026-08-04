#!/usr/bin/env node
/**
 * esik-denetim.mjs — Kritik esik asimlarini izler ve Telegram uyarisi gonderir.
 * Her pipeline kosumunda (baraj, GRACE, CHIRPS) cagrilir.
 *
 * Esikler:
 *   BARAJ_KRITIK: doluluk %20 alti → 🔴
 *   GRACE_USTUSTE: 3 ay ust uste dusus → 🟡
 *   YAGIS_KURAK: son 6 ay normalin %50 altinda → 🟠
 *
 * Cikti: izleme/esik-durum.json + Telegram mesaji (kopru kuruluysa)
 */
import { readFile, writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const DURUM_PATH = join(ROOT, 'izleme', 'esik-durum.json');
const UYARI_SCRIPT = join(ROOT, 'arac', 'uyari-gonder.sh');

const ESIK = {
  BARAJ_KRITIK_PCT: 20,
  GRACE_USTUSTE_AY: 3,
  YAGIS_KURAK_AY: 6,
  YAGIS_KURAK_PCT: 50,
};

async function mevcutDurum() {
  try {
    const raw = await readFile(DURUM_PATH, 'utf8');
    return JSON.parse(raw);
  } catch { return {}; }
}

async function kaydet(durum) {
  const dir = dirname(DURUM_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  await writeFile(DURUM_PATH, JSON.stringify({ ...durum, son_kosu: new Date().toISOString() }, null, 2));
}

async function uyariGonder(mesaj) {
  if (!existsSync(UYARI_SCRIPT)) {
    console.log(`  [uyari] Telegram koprusu yok: ${mesaj}`);
    return;
  }
  try {
    execSync(`bash "${UYARI_SCRIPT}" "${mesaj}"`, { cwd: ROOT, timeout: 10000 });
  } catch (e) {
    console.error(`  [uyari] Gonderilemedi: ${e.message}`);
  }
}

async function denetleBaraj() {
  const barajPath = join(ROOT, 'data', 'canli', 'baraj.json');
  if (!existsSync(barajPath)) return [];
  const bj = JSON.parse(await readFile(barajPath, 'utf8'));
  const alarmlar = [];

  for (const [havza, h] of Object.entries(bj.havzalar || {})) {
    for (const [ad, b] of Object.entries(h.barajlar || {})) {
      const dol = b.doluluk;
      if (dol != null && dol < ESIK.BARAJ_KRITIK_PCT) {
        alarmlar.push({ tip: 'BARAJ_KRITIK', havza, baraj: ad, deger: dol,
                        mesaj: `🔴 ${havza} / ${ad}: doluluk %${dol.toFixed(1)} (esik: %${ESIK.BARAJ_KRITIK_PCT})` });
      }
    }
  }
  return alarmlar;
}

async function denetleGrace() {
  const path = join(ROOT, 'data', 'canli', 'grace-havza.json');
  if (!existsSync(path)) return [];
  const gr = JSON.parse(await readFile(path, 'utf8'));
  const alarmlar = [];

  for (const [ad, h] of Object.entries(gr.havzalar || {})) {
    const aylar = Object.keys(h.seri || {}).sort();
    if (aylar.length < ESIK.GRACE_USTUSTE_AY + 1) continue;
    const son = aylar.slice(-ESIK.GRACE_USTUSTE_AY);
    const hepsiDusus = son.every((a, i) => i === 0 || h.seri[a] < h.seri[son[i - 1]]);
    if (hepsiDusus) {
      alarmlar.push({ tip: 'GRACE_USTUSTE', havza: ad, ay: ESIK.GRACE_USTUSTE_AY,
                      mesaj: `🟡 ${ad}: GRACE ${ESIK.GRACE_USTUSTE_AY} aydir ust uste dusuyor` });
    }
  }
  return alarmlar;
}

async function denetleYagis() {
  const path = join(ROOT, 'data', 'canli', 'chirps.json');
  if (!existsSync(path)) return [];
  const ch = JSON.parse(await readFile(path, 'utf8'));
  const alarmlar = [];

  for (const [ad, h] of Object.entries(ch.havzalar || {})) {
    const aylik = h.aylik || {};
    const aylar = Object.keys(aylik).sort();
    if (aylar.length < ESIK.YAGIS_KURAK_AY + 12) continue;

    const sonAylar = aylar.slice(-ESIK.YAGIS_KURAK_AY);
    const oncekiYillar = {};
    for (const ay of aylar) {
      const m = ay.slice(5, 7);
      oncekiYillar[m] = oncekiYillar[m] || [];
      oncekiYillar[m].push(aylik[ay]);
    }

    let kurakSay = 0;
    for (const ay of sonAylar) {
      const m = ay.slice(5, 7);
      const tarihsel = oncekiYillar[m] || [];
      if (tarihsel.length < 3) continue;
      const medyan = tarihsel.sort((a, b) => a - b)[Math.floor(tarihsel.length / 2)];
      if (medyan > 0 && aylik[ay] < medyan * (ESIK.YAGIS_KURAK_PCT / 100)) {
        kurakSay++;
      }
    }
    if (kurakSay >= ESIK.YAGIS_KURAK_AY) {
      alarmlar.push({ tip: 'YAGIS_KURAK', havza: ad, ay: kurakSay,
                      mesaj: `🟠 ${ad}: son ${ESIK.YAGIS_KURAK_AY} ayin tumu tarihsel medyanin <%${ESIK.YAGIS_KURAK_PCT}'inde` });
    }
  }
  return alarmlar;
}

async function main() {
  const onceki = await mevcutDurum();
  const oncekiAlarmlar = new Set((onceki.alarmlar || []).map(a => a.mesaj));

  console.log('Eşik denetimi...');
  const barajA = await denetleBaraj();
  const graceA = await denetleGrace();
  const yagisA = await denetleYagis();
  const tumAlarmlar = [...barajA, ...graceA, ...yagisA];

  console.log(`  Baraj kritik: ${barajA.length}`);
  console.log(`  GRACE dusus: ${graceA.length}`);
  console.log(`  Yagis kurak: ${yagisA.length}`);

  const yeniAlarmlar = tumAlarmlar.filter(a => !oncekiAlarmlar.has(a.mesaj));
  const aktifAlarmlar = tumAlarmlar.filter(a => oncekiAlarmlar.has(a.mesaj));

  for (const a of yeniAlarmlar) {
    console.log(`  YENi: ${a.mesaj}`);
    await uyariGonder(a.mesaj);
  }

  if (yeniAlarmlar.length === 0 && aktifAlarmlar.length > 0) {
    console.log(`  ${aktifAlarmlar.length} aktif alarm (once bildirildi)`);
  }

  await kaydet({
    son_kosu: new Date().toISOString(),
    alarm_sayisi: tumAlarmlar.length,
    yeni: yeniAlarmlar.length,
    alarmlar: tumAlarmlar.map(a => ({ tip: a.tip, mesaj: a.mesaj })),
  });
}

main().catch(e => { console.error(e); process.exit(1); });
