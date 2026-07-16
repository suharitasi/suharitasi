/* HENDEK FAZ 1 — EPİAŞ günlük baraj verisi çekimi.
   Sıfır bağımlılık (Node 20 fetch). Günlük cron: arac/baraj-gunluk.sh

   Akış: .env → TGT (CAS) → basin-list → dam-list (havza başına)
         → active-fullness + daily-kot + daily-volume (tümü, sayfalı)
   Arşiv: data/arsiv/baraj/YYYY-MM-DD/  (EPİAŞ ham JSON, DEĞİŞTİRİLMEDEN)
   Seri : data/canli/baraj.json         (normalize, künyeli, birikir)

   UYDURMA YASAĞI: geriye dönük veri üretilmez; başarısız günde
   "veri alınamadı (sebep)" kaydı düşer, eski veri korunur.
   GÜVENLİK: EPIAS_PASS ve TGT hiçbir log/çıktıya yazılmaz. */

import { readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const KOK = process.env.BARAJ_TEST_KOK || '/root/projeler/suharitasi';
const GIRIS = process.env.BARAJ_TEST_GIRIS || 'https://giris.epias.com.tr/cas/v1/tickets';
const API = process.env.BARAJ_TEST_API || 'https://seffaflik.epias.com.tr/electricity-service';

const ARSIV = `${KOK}/data/arsiv/baraj`;
const CANLI = `${KOK}/data/canli/baraj.json`;
const DURUM = `${ARSIV}/durum.json`;

// Gün: TR saatiyle (UTC+3, sabit — Türkiye'de DST yok)
const simdi = new Date();
const trSimdi = new Date(simdi.getTime() + 3 * 3600 * 1000);
const BUGUN = trSimdi.toISOString().slice(0, 10);
const GUN_DIZIN = `${ARSIV}/${BUGUN}`;
const LOG = `${ARSIV}/log/${BUGUN}.log`;

mkdirSync(`${ARSIV}/log`, { recursive: true });

function log(m) {
  const satir = `[${new Date().toISOString()}] ${m}`;
  console.log(satir);
  appendFileSync(LOG, satir + '\n');
}

function envOku() {
  const yol = `${KOK}/.env`;
  if (!existsSync(yol)) return {};
  const e = {};
  for (const satir of readFileSync(yol, 'utf8').split('\n')) {
    const m = satir.match(/^([A-Z_]+)=(.*)$/);
    if (m) e[m[1]] = m[2].trim();
  }
  return e;
}

async function tgtAl(env) {
  const cevap = await fetch(GIRIS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'text/plain' },
    body: `username=${encodeURIComponent(env.EPIAS_USER)}&password=${encodeURIComponent(env.EPIAS_PASS)}`,
  });
  if (!cevap.ok) throw new Error(`TGT alınamadı: HTTP ${cevap.status}`);
  const tgt = (await cevap.text()).trim();
  if (!tgt.startsWith('TGT')) throw new Error('TGT cevabı beklenen biçimde değil');
  log(`TGT alındı (HTTP ${cevap.status})`); // bilet içeriği asla loglanmaz
  return tgt;
}

/* Tek istek; 401'de bir kez TGT yenileyip tekrar dener. */
async function iste(yol, govde, ctx) {
  const yap = () =>
    fetch(`${API}${yol}`, {
      method: govde === undefined ? 'GET' : 'POST',
      headers: { TGT: ctx.tgt, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: govde === undefined ? undefined : JSON.stringify(govde),
    });
  let cevap = await yap();
  if (cevap.status === 401) {
    log(`401 — TGT yenileniyor (${yol})`);
    ctx.tgt = await tgtAl(ctx.env);
    cevap = await yap();
  }
  if (!cevap.ok) throw new Error(`${yol}: HTTP ${cevap.status}`);
  return cevap.text(); // ham metin: arşive dokunulmadan yazılır
}

/* Sayfalı POST: tüm sayfaları çeker; ham sayfa gövdeleri ayrı ayrı döner. */
async function sayfaliCek(yol, ctx) {
  const hamSayfalar = [];
  const tumKayitlar = [];
  for (let no = 1; no <= 50; no++) {
    const ham = await iste(yol, { page: { number: no, size: 1000 } }, ctx);
    hamSayfalar.push(ham);
    const veri = JSON.parse(ham);
    const kayitlar = veri.items ?? [];
    tumKayitlar.push(...kayitlar);
    const toplam = veri.page?.total ?? kayitlar.length;
    if (kayitlar.length < 1000 || tumKayitlar.length >= toplam) break;
  }
  return { hamSayfalar, tumKayitlar };
}

function hamYaz(ad, icerik) {
  mkdirSync(GUN_DIZIN, { recursive: true });
  writeFileSync(`${GUN_DIZIN}/${ad}`, icerik);
}

function canliOku() {
  return JSON.parse(readFileSync(CANLI, 'utf8'));
}

function durumOku() {
  return existsSync(DURUM) ? JSON.parse(readFileSync(DURUM, 'utf8')) : { ardisikHata: 0 };
}

function uyar(mesaj) {
  /* 3 ardışık başarısızlıkta kullanıcıya uyarı. Sunucuda MTA yok (tespit:
     2026-07-16); sendmail varsa kullanılır, yoksa repoya UYARI dosyası
     düşer — günlük push'la görünür olur. Gerçek e-posta için kullanıcının
     SMTP bilgisi gerekir (README-BARAJ.md). */
  try {
    execFileSync('sendmail', ['-t'], {
      input: `To: root\nSubject: suharitasi baraj pipeline UYARI\n\n${mesaj}\n`,
      timeout: 10000,
    });
    log('uyarı sendmail ile gönderildi');
  } catch {
    writeFileSync(`${KOK}/UYARI-BARAJ.md`, `# BARAJ PIPELINE UYARISI\n\n${new Date().toISOString()}\n\n${mesaj}\n`);
    log('sendmail yok — UYARI-BARAJ.md yazıldı (push ile görünür)');
  }
}

async function calis() {
  const env = envOku();
  if (!env.EPIAS_USER || !env.EPIAS_PASS) {
    // Kurulum eksik — bu bir "kaynak arızası" değildir: gün kaydı düşülmez,
    // hata sayacı artmaz. Kullanıcı .env'i doldurunca pipeline çalışır.
    log('EPIAS_USER / EPIAS_PASS boş — .env doldurulmalı (cp .env.example .env). Çekim yapılmadı.');
    process.exit(2);
  }

  const ctx = { env, tgt: await tgtAl(env) };

  // 1) Havza listesi (ham + parse)
  const havzaHam = await iste('/v1/dams/data/basin-list', undefined, ctx);
  hamYaz('basin-list.json', havzaHam);
  const havzalar = JSON.parse(havzaHam);
  log(`havza listesi: ${havzalar.length} havza`);

  // 2) Havza → baraj eşlemesi
  const eslesme = {};
  for (const h of havzalar) {
    const ham = await iste('/v1/dams/data/dam-list', { basinName: h }, ctx);
    hamYaz(`dam-list.${h.replace(/[^\wçğıöşüÇĞİÖŞÜ-]/g, '_')}.json`, ham);
    eslesme[h] = JSON.parse(ham).damList ?? [];
  }
  hamYaz('_eslesme-ozet.json', JSON.stringify(
    { cekimUTC: new Date().toISOString(), havzaSayisi: havzalar.length,
      barajSayisi: Object.values(eslesme).flat().length }, null, 2));
  log(`eşleme: ${Object.values(eslesme).flat().length} baraj`);

  // 3) Günlük veri: doluluk + kot + hacim (tümü, sayfalı)
  const setler = {};
  for (const [ad, yol] of [
    ['active-fullness', '/v1/dams/data/active-fullness'],
    ['daily-kot', '/v1/dams/data/daily-kot'],
    ['daily-volume', '/v1/dams/data/daily-volume'],
  ]) {
    const { hamSayfalar, tumKayitlar } = await sayfaliCek(yol, ctx);
    hamSayfalar.forEach((s, i) => hamYaz(`${ad}.s${i + 1}.json`, s));
    setler[ad] = tumKayitlar;
    log(`${ad}: ${tumKayitlar.length} kayıt, ${hamSayfalar.length} sayfa`);
  }

  // 4) Normalize seriye işle (birikir; eski günlere dokunulmaz)
  const canli = canliOku();
  const c = canli.kunye;
  if (!c.kayitBaslangici) c.kayitBaslangici = BUGUN;
  c.sonGuncelleme = BUGUN;
  c.sonDurum = 'ok';

  const dolulukla = new Map(setler['active-fullness'].map((k) => [`${k.basin}|${k.dam}`, k]));
  const kotla = new Map(setler['daily-kot'].map((k) => [`${k.basin}|${k.dam}`, k]));

  let islenen = 0;
  for (const [havza, barajlar] of Object.entries(eslesme)) {
    const H = (canli.havzalar[havza] ??= { barajlar: {} });
    for (const baraj of barajlar) {
      const B = (H.barajlar[baraj] ??= { seri: {} });
      const d = dolulukla.get(`${havza}|${baraj}`);
      const k = kotla.get(`${havza}|${baraj}`);
      if (d || k) {
        B.seri[BUGUN] = {
          ...(d?.activeFullnessAmount != null && { doluluk: d.activeFullnessAmount }),
          ...(k?.dailyKot != null && { kot: k.dailyKot }),
        };
        islenen++;
      }
      // veri gelmeyen baraja o gün için kayıt YAZILMAZ (boş obje bile değil)
    }
  }
  canli.gunler[BUGUN] = {
    cekimUTC: new Date().toISOString(),
    durum: 'ok',
    barajKaydi: islenen,
  };
  writeFileSync(CANLI, JSON.stringify(canli, null, 1));
  writeFileSync(DURUM, JSON.stringify({ ardisikHata: 0, sonBasari: BUGUN }, null, 2));
  log(`normalize tamam: ${islenen} baraj kaydı → data/canli/baraj.json`);
}

calis().catch((h) => {
  // Kaynak arızası: gün "veri alınamadı" olarak işaretlenir, seri bozulmaz.
  log(`HATA: ${h.message}`);
  try {
    const canli = canliOku();
    canli.gunler[BUGUN] = { cekimUTC: new Date().toISOString(), durum: 'veri alınamadı', sebep: h.message };
    canli.kunye.sonDurum = `veri alınamadı (${BUGUN}): ${h.message}`;
    writeFileSync(CANLI, JSON.stringify(canli, null, 1));
    const d = durumOku();
    d.ardisikHata = (d.ardisikHata ?? 0) + 1;
    writeFileSync(DURUM, JSON.stringify(d, null, 2));
    if (d.ardisikHata >= 3) {
      uyar(`Baraj çekimi ${d.ardisikHata} gündür başarısız. Son hata: ${h.message}\nSon başarılı: ${d.sonBasari ?? 'hiç'}`);
    }
  } catch (e2) {
    log(`hata kaydı da yazılamadı: ${e2.message}`);
  }
  process.exit(1);
});
