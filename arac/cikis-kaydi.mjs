/* ORTAK ÇIKIŞ KAYDI — NODE UYGULAMASI (26.08.2026, kuyruk kapatma Faz B).
 *
 * SÖZLEŞME arac/cikis-kaydi.sh ile AYNIDIR (paylaşılan şey kod değil sözleşme):
 *   <ISO-8601 UTC> <ad>: ÇIKIŞ · exit=<kod> · dosya=<yol> · bayt=<n>
 *   Çıktı üretilmemişse dosya/bayt alanları "-"; satır YİNE yazılır.
 *   Log tavanı 512 KB · en fazla 5 kayan arşiv · KIRPMA YOK.
 *
 * BASH'TEN FARK (envanter §4 ölçümü): node `process.on('exit')` YIĞILIR —
 * mevcut dinleyiciler (örn. site-saglik'in kilitBirak'ı) EZİLMEZ, ikisi de
 * çalışır. Zincirleme gerekmez.
 *
 * SİNYAL: node'da SIGTERM/SIGINT/SIGHUP varsayılanı 'exit' olayını
 * ÇALIŞTIRMADAN öldürür (site-saglik SIGTERM kilit bulgusu, Faz 1).
 * Bu yüzden sinyal dinleyicisi YALNIZ o sinyalde başka dinleyici YOKSA
 * kurulur ve sinyali process.exit(128+n)'e çevirir — böylece hem çıkış
 * satırı yazılır hem mevcut 'exit' dinleyicileri (kilit bırakma) çalışır.
 *
 * Kullanım:
 *   import { cikisKaydiKur, cikisKaydiDosya } from './cikis-kaydi.mjs';
 *   cikisKaydiKur('site-saglik', '/yol/log');
 *   ...
 *   cikisKaydiDosya(dosyaYolu, bayt);   // başarı yolunda, isteğe bağlı
 */
import { appendFileSync, existsSync, statSync, renameSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

// Eşikler env ile ezilebilir — YALNIZ SINAMA İÇİN (üretimde ayarlanmaz).
const TAVAN = Number(process.env.CIKIS_KAYDI_TAVAN || 512 * 1024);
const ARSIV = Number(process.env.CIKIS_KAYDI_ARSIV || 5);

let AD = null, LOG = null, DOSYA = '-', BOYUT = '-';

const damga = () => new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
const logla = (m) => { try { appendFileSync(LOG, `${damga()} ${AD}: ${m}\n`); } catch { /* log yazılamıyorsa süreci düşürme */ } };

// Kayan arşiv — cikis-kaydi.sh._cikis_kaydi_dondur ile aynı kural.
function dondur() {
  if (!existsSync(LOG)) return;
  const b = statSync(LOG).size;
  if (b <= TAVAN) return;
  if (existsSync(`${LOG}.${ARSIV}`)) rmSync(`${LOG}.${ARSIV}`);
  for (let i = ARSIV - 1; i >= 1; i--) {
    if (existsSync(`${LOG}.${i}`)) renameSync(`${LOG}.${i}`, `${LOG}.${i + 1}`);
  }
  renameSync(LOG, `${LOG}.1`);
  writeFileSync(LOG, '');
  logla(`log döndürüldü (${b} > ${TAVAN} bayt) → ${LOG}.1 · arşiv tavanı ${ARSIV}`);
}

export function cikisKaydiKur(ad, logYolu) {
  AD = ad; LOG = logYolu;
  mkdirSync(dirname(LOG), { recursive: true });
  dondur();
  process.on('exit', (kod) => {
    logla(`ÇIKIŞ · exit=${kod ?? 0} · dosya=${DOSYA} · bayt=${BOYUT}`);
  });
  for (const [sinyal, kod] of [['SIGHUP', 129], ['SIGINT', 130], ['SIGTERM', 143]]) {
    // Mevcut dinleyici varsa DOKUNMA (betiğin kendi sinyal mantığı ezilmesin).
    if (process.listenerCount(sinyal) === 0) {
      process.on(sinyal, () => process.exit(kod));
    }
  }
}

export function cikisKaydiDosya(yol, bayt) { DOSYA = yol; BOYUT = bayt; }
