/* ALTIN ÖRNEK TESTLERİ — pipeline ayrıştırıcılarının sessiz bozulma bekçisi
 * (B1.3, 2026-07-28)
 *
 * NEDEN: bir kaynak sayfasının/API'sinin biçimi değiştiğinde ayrıştırıcı
 * çoğu zaman ÇÖKMEZ — sessizce yanlış ya da boş çıktı üretir. Pipeline
 * "başarılı" der, commit atar, veri bozulur. Sağlık sistemi bunu
 * göremiyordu: tazelik ölçüyor, DOĞRULUK ölçmüyordu.
 *
 * NE YAPAR: her pipeline için BİLİNEN GİRDİ → BİLİNEN ÇIKTI. Sapma =
 * KIRMIZI. Ağ yok, dosya yazımı yok, saat bağımlılığı yok — bit-eşit
 * tekrarlanabilir.
 *
 * KAPSAM ve DÜRÜST SINIR:
 *   baraj  — normalize çekirdeği (arac/baraj-birlestir.mjs). EPİAŞ ağ
 *            katmanı KAPSAM DIŞI (kimlik doğrulama gerekir).
 *   RG     — satırlari_coz(), GERÇEK yakalanmış API cevabıyla
 *            (arac/test/altin/rg-cevap.json, 28.07.2026 canlı çekim).
 *   GRACE  — havza ağırlıklarının geometri çekirdeği
 *            (arac/grace_geometri.py). NetCDF okuma KAPSAM DIŞI (507 MB).
 *   NHYP   — saf ayrıştırma yardımcıları + ÇIKTI DEĞİŞMEZİ + kaynak
 *            varlığı. 29.07.2026'da kaynak PDF'ler geri getirildi (41/41)
 *            ve UÇTAN UCA TEKRAR koşuldu: 12/12 YEŞİL, 472 kütle, çıktı
 *            depodakiyle BİT-EŞİT (rapor/nhyp-geri-getirme.md). Zincirin
 *            tamamı yeniden üretilebilir: nhyp-manifest-uret.py →
 *            nhyp-indir.sh → nhyp-metne-cevir.sh → nhyp-cikar.py.
 *            Tekrarın KENDİSİ bu teste dahil DEĞİLDİR: 1,1 GB kaynak +
 *            dakikalarca CPU, sağlık koşusunun bütçesine sığmaz.
 *
 * KULLANIM:  node arac/altin-ornek.mjs            (tümü)
 *            node arac/altin-ornek.mjs --json     (makine okunur)
 * ÇIKIŞ:     0 = tümü geçti · 1 = en az bir sapma
 */
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ARAC = dirname(fileURLToPath(import.meta.url));
const KOK = join(ARAC, '..');
const ALTIN = join(ARAC, 'test/altin');
const JSONMOD = process.argv.includes('--json');

const sonuc = [];
const oku = (a) => JSON.parse(readFileSync(join(ALTIN, a), 'utf8'));
const esit = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function kalem(pipeline, ad, gecti, ayrinti = '') {
  sonuc.push({ pipeline, ad, gecti, ayrinti });
  if (!JSONMOD) {
    console.log(`  ${gecti ? '🟢' : '🔴'} ${ad}${ayrinti ? ` — ${ayrinti}` : ''}`);
  }
}

/* Python tarafı: modülü import edip JSON basan tek satırlık koşucu.
 *
 * stderr YUTULMAZ ama YÖNLENDİRİLİR (sessiz hata yasağı, "2>/dev/null
 * yalnız GERÇEK beklenen gürültü için" kuralı): RG testi ayrıştırıcıyı
 * KASTEN bozuk girdiyle çağırıyor ve ayrıştırıcı doğru davranıp stderr'e
 * "UYARI: beklenmeyen satır tipi" yazıyor. Bu BEKLENEN gürültüdür; sağlık
 * koşusu log'unda gerçek uyarı gibi görünmemeli. Süreç ÇÖKERSE stderr
 * olduğu gibi hata mesajına konur — hiçbir şey gizlenmez. */
function python(kod) {
  try {
    return JSON.parse(execFileSync('python3', ['-c', kod], {
      cwd: KOK, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    }));
  } catch (e) {
    const hata = (e.stderr || '').toString().trim().split('\n').slice(-3).join(' | ');
    throw new Error(`${e.message.split('\n')[0]}${hata ? ` — python stderr: ${hata}` : ''}`);
  }
}

// ─────────────────────────── BARAJ ───────────────────────────
async function baraj() {
  if (!JSONMOD) console.log('\nBARAJ — normalize çekirdeği');
  const { birlestir } = await import(join(ARAC, 'baraj-birlestir.mjs'));
  const g = oku('baraj-girdi.json');
  const b = oku('baraj-beklenen.json');
  const { canli, islenen } = birlestir({
    eslesme: g.eslesme, setler: g.setler, canli: g.canli,
    bugun: g.bugun, cekimUTC: g.cekimUTC,
  });
  kalem('baraj', 'işlenen kayıt sayısı', islenen === b.islenen, `${islenen} (beklenen ${b.islenen})`);
  kalem('baraj', 'künye güncellendi', esit(canli.kunye, b.canli.kunye));
  kalem('baraj', 'gün kaydı eklendi, eski gün korundu', esit(canli.gunler, b.canli.gunler));
  kalem('baraj', 'havza/baraj serileri birebir', esit(canli.havzalar, b.canli.havzalar),
    esit(canli.havzalar, b.canli.havzalar) ? '' : `çıkan: ${JSON.stringify(canli.havzalar)}`);
  // Sözleşmenin en kolay sessizce kırılan yeri: veri gelmeyen baraja kayıt yazılmamalı
  const kuru = canli.havzalar['Sakarya'].barajlar['Kuru Baraj'].seri;
  kalem('baraj', 'veri gelmeyen baraja gün kaydı YAZILMADI', Object.keys(kuru).length === 0);
  // doluluk 0 gerçek bir değerdir, null değil
  const seyhan = canli.havzalar['Seyhan'].barajlar['Seyhan Barajı'].seri[g.bugun];
  kalem('baraj', 'doluluk 0 kaydı korundu (0 !== yok)', seyhan?.doluluk === 0);
}

// ──────────────────────────── RG ─────────────────────────────
function rg() {
  if (!JSONMOD) console.log('\nRG — Resmî Gazete satır ayrıştırıcısı');
  const cikan = python(`
import json, importlib.util, sys
spec = importlib.util.spec_from_file_location('rg', 'arac/rg-nobetci.py')
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
cevap = json.load(open('arac/test/altin/rg-cevap.json'))
print(json.dumps(m.satirlari_coz(cevap), ensure_ascii=False))
`);
  const beklenen = oku('rg-beklenen.json');
  kalem('rg', 'satır sayısı', cikan.length === beklenen.length, `${cikan.length} (beklenen ${beklenen.length})`);
  kalem('rg', 'alanlar birebir', esit(cikan, beklenen));
  // 27.07 hatasının ikizi: sözlük yerine dizi gelirse 0 satır ayrıştırılıyordu
  const dizi = python(`
import json, importlib.util
spec = importlib.util.spec_from_file_location('rg', 'arac/rg-nobetci.py')
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
print(json.dumps(m.satirlari_coz({"data": [["dizi", "satiri"]]})))
`);
  kalem('rg', 'beklenmeyen satır tipi sessizce yutulmuyor', dizi.length === 0,
    'dizi satır → 0 kayıt + stderr uyarısı (27.07 hatasının bekçisi)');
  kalem('rg', 'her kayıtta kaynak URL var', cikan.every((k) => k.kaynak_url?.startsWith('https://')));
  kalem('rg', 'her kayıtta RG tarih + sayı var', cikan.every((k) => k.rg_tarih && k.rg_sayi));
}

// ─────────────────────────── GRACE ───────────────────────────
function grace() {
  if (!JSONMOD) console.log('\nGRACE — havza geometri çekirdeği');
  const f = oku('grace-geometri.json');
  const cikan = python(`
import json, sys
sys.path.insert(0, 'arac')
from grace_geometri import halkalar, icinde
f = json.load(open('arac/test/altin/grace-geometri.json'))
print(json.dumps({
  'halkalar': [len(halkalar(h['geom'])) for h in f['halkalar']],
  'icinde': [icinde(c['x'], c['y'], c['halka']) for c in f['icinde']],
}))
`);
  f.halkalar.forEach((h, i) => {
    kalem('grace', `halka çıkarımı: ${h.ad}`, cikan.halkalar[i] === h.beklenenHalkaSayisi,
      `${cikan.halkalar[i]} (beklenen ${h.beklenenHalkaSayisi})`);
  });
  const sapan = f.icinde.filter((c, i) => cikan.icinde[i] !== c.beklenen);
  kalem('grace', `nokta-poligon testi (${f.icinde.length} vaka)`, sapan.length === 0,
    sapan.length ? `SAPAN: ${sapan.map((s) => s.ad).join(' · ')}` : 'kenar/köşe sözleşmesi dahil');
}

// ─────────────────────────── NHYP ────────────────────────────
function nhyp() {
  if (!JSONMOD) console.log('\nNHYP — ayrıştırma yardımcıları + çıktı değişmezi');
  const f = oku('nhyp.json');
  const cikan = python(`
import json, importlib.util
spec = importlib.util.spec_from_file_location('nh', 'arac/nhyp-cikar.py')
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
f = json.load(open('arac/test/altin/nhyp.json'))
print(json.dumps({
  'ke_duzelt': [m.ke_duzelt(x['girdi']) for x in f['ke_duzelt']],
  'num_tr': [m.num_tr(x['girdi']) for x in f['num_tr']],
  'sayfa_indeksi': [m.sayfa_indeksi(x['girdi']) for x in f['sayfa_indeksi']],
}, ensure_ascii=False))
`);
  for (const [ad, vakalar] of [['ke_duzelt', f.ke_duzelt], ['num_tr', f.num_tr], ['sayfa_indeksi', f.sayfa_indeksi]]) {
    const sapan = vakalar.filter((v, i) => !esit(cikan[ad][i], v.beklenen));
    kalem('nhyp', `${ad}() — ${vakalar.length} vaka`, sapan.length === 0,
      sapan.length ? `SAPAN: ${sapan.map((s) => JSON.stringify(s.girdi)).join(' · ')}` : '');
  }
  // Çıktı değişmezi — kalite kapısı 12/12 yeşilken donmuş sayılar
  const d = JSON.parse(readFileSync(join(KOK, f.ciktiDegismezi.dosya), 'utf8'));
  const havzalar = d.havzalar ?? {};
  kalem('nhyp', 'havza sayısı', Object.keys(havzalar).length === f.ciktiDegismezi.havzaSayisi,
    `${Object.keys(havzalar).length} (beklenen ${f.ciktiDegismezi.havzaSayisi})`);
  const sapanH = [], kapiDusen = [], beyanSapan = [];
  let toplam = 0;
  for (const [h, bek] of Object.entries(f.ciktiDegismezi.kutleSayisi)) {
    const H = havzalar[h] ?? {};
    const n = (H.kutleler ?? []).length;
    toplam += n;
    if (n !== bek) sapanH.push(`${h}: ${n}≠${bek}`);
    if (H.kalite_kapisi !== 'YESIL') kapiDusen.push(`${h}: ${H.kalite_kapisi}`);
    // Kalite kapısının kendisi: PDF'in BEYAN ettiği sayı = çıkarılan sayı =
    // gerçek kütle sayısı. Üçü ayrışırsa çıkarım sessizce eksik/fazla demektir.
    if (H.beyan?.sayi !== H.cikarilan_sayi || H.cikarilan_sayi !== n) {
      beyanSapan.push(`${h}: beyan ${H.beyan?.sayi} / çıkarılan ${H.cikarilan_sayi} / kütle ${n}`);
    }
  }
  kalem('nhyp', 'havza başına kütle sayısı', sapanH.length === 0, sapanH.join(' · '));
  kalem('nhyp', 'toplam kütle', toplam === f.ciktiDegismezi.toplam, `${toplam} (beklenen ${f.ciktiDegismezi.toplam})`);
  kalem('nhyp', 'kalite kapısı 12/12 YEŞİL', kapiDusen.length === 0, kapiDusen.join(' · '));
  kalem('nhyp', 'beyan = çıkarılan = kütle sayısı', beyanSapan.length === 0, beyanSapan.join(' · '));

  /* KAYNAK VARLIĞI — BİLGİ kalemi, arıza kalemi DEĞİL.
     veri/ham/ gitignore'da: temiz bir klonda bu dosyalar YOKTUR ve bu
     normaldir. Ama 27.07'de dosyalar worktree silinirken sessizce
     kayboldu ve haftalarca kimse görmedi. Kalem "hepsi var" ya da
     "hiçbiri yok" durumunu geçer sayar; KISMEN eksik olması gerçek bir
     bozulmadır (yarısı silinmiş bir kaynak kümesi) ve DÜŞER. */
  const kv = f.kaynakVarligi;
  if (kv) {
    const varOlan = Object.entries(kv.dosyalar)
      .filter(([h, d]) => existsSync(join(KOK, kv.dizin, h, d))).length;
    const toplamK = Object.keys(kv.dosyalar).length;
    const durum = varOlan === toplamK ? 'tam' : varOlan === 0 ? 'yok (temiz klon)' : 'KISMEN EKSİK';
    kalem('nhyp', 'kaynak metinleri', varOlan === toplamK || varOlan === 0,
      `${varOlan}/${toplamK} — ${durum}${varOlan > 0 && varOlan < toplamK
        ? ' · geri getirme: node/bash zinciri rapor/nhyp-geri-getirme.md §4' : ''}`);
  }
}

// ─────────────────────────── koşum ───────────────────────────
const hatalar = [];
for (const [ad, fn] of [['baraj', baraj], ['rg', rg], ['grace', grace], ['nhyp', nhyp]]) {
  try {
    await fn();
  } catch (e) {
    // Çöken pipeline testi sessizce atlanmaz: kalem KIRMIZI olur.
    kalem(ad, 'test koşumu ÇÖKTÜ', false, e.message.split('\n')[0]);
    hatalar.push(`${ad}: ${e.message}`);
  }
}

const dusen = sonuc.filter((s) => !s.gecti);
if (JSONMOD) {
  console.log(JSON.stringify({
    zaman: new Date().toISOString(),
    toplam: sonuc.length, gecen: sonuc.length - dusen.length, dusen: dusen.length,
    kalemler: sonuc,
  }, null, 1));
} else {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(dusen.length
    ? `🔴 ALTIN ÖRNEK: ${dusen.length}/${sonuc.length} SAPMA — ${dusen.map((d) => `${d.pipeline}/${d.ad}`).join(' · ')}`
    : `🟢 ALTIN ÖRNEK: ${sonuc.length}/${sonuc.length} geçti`);
}
process.exit(dusen.length ? 1 : 0);
