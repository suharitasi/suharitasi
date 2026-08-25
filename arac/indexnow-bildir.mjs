#!/usr/bin/env node
/* INDEXNOW BİLDİRİCİ — yayımlanan sayfaları arama motorlarına otomatik bildirir.
 * (indeks-bildirimi briefi, 2026-08-25; rapor: rapor/indeks-bildirimi.md)
 *
 * ÇALIŞMA İLKESİ — yayın tetiği (b) sitemap farkı:
 * Deploy Cloudflare Pages'ta tetiklenir ve birden çok aktörden gelir (baraj/
 * su-izleme cron'ları + elle merge). Sunucuda tek bir "deploy bitti" kancası
 * YOKTUR; bu betik zamanlanmış koşar, CANLI sitemap'i CANLI sürüm imzasıyla
 * (surum.json) birlikte okur ve son bildirilen durumla farkını gönderir.
 * Böylece bildirim tanım gereği yalnız canlıda VAR OLAN sayfalar için çıkar
 * (var olmayan sayfayı bildirmek zarardır — brief 1.4).
 *
 * ANAHTAR SIR DEĞİLDİR: IndexNow anahtarı protokol gereği site kökünden
 * herkese açık yayımlanır (https://.../{anahtar}.txt). .env'e KONMAZ.
 *
 * Durum dosyası izleme/state/indexnow-durum.json GIT'E GİRMEZ (.gitignore) —
 * 6×/gün güncellenen state commit'lense her koşu gereksiz deploy tetiklerdi
 * (kirli-ağaç dersi, GUNLUK 24-25.08). Kaybolursa betik İLK KOŞUM moduna
 * döner ve tek seferde en çok CEKIRDEK_SINIR url bildirir (aşağıda).
 *
 * Kullanım:
 *   node arac/indexnow-bildir.mjs            # normal koşum (cron)
 *   node arac/indexnow-bildir.mjs --kuru     # farkı göster, gönderme
 *   node arac/indexnow-bildir.mjs --url-dosya <yol>  # yalnız listedeki URL'ler
 *   node arac/indexnow-bildir.mjs --sinir <n>        # bu koşumda en çok n URL
 *   node arac/indexnow-bildir.mjs --anahtar <k>      # anahtar override (falsifikasyon testi)
 */
import { readFile, writeFile, readdir, mkdir, rename } from 'node:fs/promises';
import { existsSync, appendFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://suharitasi.com';
const HOST = 'suharitasi.com';
// Genel uç nokta: buraya yapılan bildirim TÜM katılımcı motorlara paylaşılır
// (indexnow.org/documentation, okundu 2026-08-25).
// Env override YALNIZ falsifikasyon içindir (RG hattındaki SU_IZLEME_RG_CA
// deseninin aynısı): hata yolu gerçek uç noktaya zarar vermeden test edilir.
const UC_NOKTA = process.env.INDEXNOW_UC_NOKTA || 'https://api.indexnow.org/indexnow';
// Protokol tek istekte 10.000 URL'ye izin verir; kademeli kural gereği çok
// altında kalıyoruz. Partiler arası bekleme nezaket içindir (limit dayatılmadı).
const PARTI = 250;
const PARTI_BEKLE_MS = 3000;
// State yokken (ilk koşum / kayıp) tüm siteyi tek seferde bildirmeyi önler:
// önce en çok bu kadar URL gider, kalanlar sonraki koşumlara kalır (brief 1.3).
const CEKIRDEK_SINIR = 20;
const DURUM_YOL = join(KOK, 'izleme/state/indexnow-durum.json');
const LOG_YOL = join(KOK, 'log/indexnow.log');

const arg = process.argv.slice(2);
const argDeger = (ad) => { const i = arg.indexOf(ad); return i >= 0 ? arg[i + 1] : null; };
const KURU = arg.includes('--kuru');
const URL_DOSYA = argDeger('--url-dosya');
const SINIR = argDeger('--sinir') ? Number(argDeger('--sinir')) : null;
const ANAHTAR_OVERRIDE = argDeger('--anahtar');

function logla(satir) {
  const z = new Date().toISOString();
  appendFileSync(LOG_YOL, `${z} ${satir}\n`);
  console.log(satir);
}

function uyar(konu, govde) {
  // Telegram köprüsü: kurulmamışsa kendi log'una yazar ve 0 döner (sessiz değil).
  try {
    execFileSync('bash', [join(KOK, 'arac/uyari-gonder.sh'), konu, govde], { stdio: 'inherit' });
  } catch (e) {
    logla(`UYARI KANALI HATASI: ${e.message}`);
  }
}

async function getir(url) {
  const r = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'suharitasi-indexnow-bildirici' } });
  const govde = await r.text();
  return { kod: r.status, govde };
}

async function anahtarBul() {
  if (ANAHTAR_OVERRIDE) return ANAHTAR_OVERRIDE;
  // Tek gerçek kaynak public/ altındaki anahtar dosyasıdır (dosya adı = anahtar).
  const adaylar = (await readdir(join(KOK, 'public'))).filter((d) => /^[0-9a-f]{16,128}\.txt$/.test(d));
  if (adaylar.length !== 1) throw new Error(`public/ altında tam 1 anahtar dosyası beklenir, ${adaylar.length} bulundu`);
  return adaylar[0].replace(/\.txt$/, '');
}

function sitemapCoz(xml) {
  // <url><loc>..</loc><lastmod>..</lastmod></url> — lastmod isteğe bağlı.
  const kayitlar = new Map();
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = m[1].match(/<loc>([^<]+)<\/loc>/)?.[1];
    const lastmod = m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] ?? '';
    if (loc) kayitlar.set(loc.trim(), lastmod.trim());
  }
  return kayitlar;
}

async function durumOku() {
  if (!existsSync(DURUM_YOL)) return null;
  return JSON.parse(await readFile(DURUM_YOL, 'utf8'));
}

async function durumYaz(d) {
  await mkdir(dirname(DURUM_YOL), { recursive: true });
  // Yarıda kesilen yazım state'i bozmasın: önce geçici dosya, sonra atomik taşıma.
  const gecici = `${DURUM_YOL}.gecici`;
  await writeFile(gecici, JSON.stringify(d, null, 2) + '\n', 'utf8');
  await rename(gecici, DURUM_YOL);
}

async function parti(anahtar, urller) {
  const govde = JSON.stringify({ host: HOST, key: anahtar, urlList: urller });
  const r = await fetch(UC_NOKTA, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: govde,
  });
  const metin = await r.text();
  return { kod: r.status, metin: metin.slice(0, 300) };
}

async function ana() {
  await mkdir(dirname(LOG_YOL), { recursive: true });
  const anahtar = await anahtarBul();

  // 1) Anahtar dosyası CANLIDA erişilebilir mi? (canlı-koşul: anahtar canlıda
  //    yoksa uç nokta 403 verir; deploy'dan önce bildirim çıkmaz.)
  const anahtarCanli = await getir(`${SITE}/${anahtar}.txt`);
  if (ANAHTAR_OVERRIDE == null && (anahtarCanli.kod !== 200 || anahtarCanli.govde.trim() !== anahtar)) {
    logla(`DUR: anahtar dosyası canlıda doğrulanamadı (HTTP ${anahtarCanli.kod}) — bildirim yapılmadı`);
    uyar('IndexNow: anahtar canlıda yok', `${SITE}/${anahtar}.txt HTTP ${anahtarCanli.kod} — deploy eksik olabilir.`);
    process.exit(1);
  }

  // 2) Canlı sürüm imzası (hangi commit yayında — kanıt için kaydedilir).
  const surum = await getir(`${SITE}/surum.json`);
  const canliCommit = surum.kod === 200 ? JSON.parse(surum.govde).kisa : `okunamadı(${surum.kod})`;

  // 3) Canlı sitemap.
  const sm = await getir(`${SITE}/sitemap.xml`);
  if (sm.kod !== 200) {
    logla(`DUR: canlı sitemap HTTP ${sm.kod} — bildirim yapılmadı`);
    uyar('IndexNow: sitemap okunamadı', `${SITE}/sitemap.xml HTTP ${sm.kod}`);
    process.exit(1);
  }
  const canli = sitemapCoz(sm.govde);
  if (canli.size === 0) {
    logla('DUR: canlı sitemap 0 URL çözdü (biçim değişmiş olabilir) — bildirim yapılmadı');
    uyar('IndexNow: sitemap boş çözüldü', 'sitemap.xml çözümlemesi 0 URL verdi; betik biçimi kontrol edilmeli.');
    process.exit(1);
  }

  // 4) Fark hesabı.
  const durum = (await durumOku()) ?? { bilinen: {}, sonKosum: null, sonBasariliBildirim: null };
  const ilkKosum = Object.keys(durum.bilinen).length === 0;
  let hedefler;
  if (URL_DOSYA) {
    const liste = (await readFile(URL_DOSYA, 'utf8')).split('\n').map((s) => s.trim()).filter(Boolean);
    const disarida = liste.filter((u) => !canli.has(u));
    if (disarida.length) throw new Error(`--url-dosya listesinde canlı sitemap'te olmayan URL var: ${disarida.join(' ')}`);
    hedefler = liste;
  } else {
    hedefler = [...canli.keys()].filter((u) => !(u in durum.bilinen) || durum.bilinen[u] !== canli.get(u));
  }
  const sinir = SINIR ?? (ilkKosum && !URL_DOSYA ? CEKIRDEK_SINIR : null);
  if (sinir != null && hedefler.length > sinir) {
    logla(`sınır: ${hedefler.length} adaydan ilk ${sinir} bildirilecek (kalan sonraki koşuma)`);
    hedefler = hedefler.slice(0, sinir);
  }

  logla(`koşum: canlı=${canliCommit} sitemap=${canli.size} URL, fark=${hedefler.length}${KURU ? ' [KURU]' : ''}`);
  if (hedefler.length === 0) {
    durum.sonKosum = new Date().toISOString();
    if (!KURU) await durumYaz(durum);
    logla('değişiklik yok — bildirim çıkmadı');
    return;
  }

  // 5) YENİ URL'ler canlıda 200 mü? (Sitemap dist taramasından üretilir; yine
  //    de var-olmayanı bildirmemek için yeni URL tek tek doğrulanır.)
  const yeniler = hedefler.filter((u) => !(u in durum.bilinen));
  for (const u of yeniler) {
    const y = await getir(u);
    if (y.kod !== 200) throw new Error(`yeni URL canlıda 200 değil (${y.kod}): ${u} — bildirim iptal`);
  }

  if (KURU) {
    hedefler.slice(0, 30).forEach((u) => logla(`  KURU aday: ${u}`));
    logla(`KURU koşum: ${hedefler.length} URL gönderilMEdi, state değişmedi`);
    return;
  }

  // 6) Partiler hâlinde gönder; her yanıt kaydedilir, hata gelirse durulur
  //    (gönderilemeyen URL'ler state'e yazılmaz → sonraki koşumda yeniden denenir).
  for (let i = 0; i < hedefler.length; i += PARTI) {
    const dilim = hedefler.slice(i, i + PARTI);
    const y = await parti(anahtar, dilim);
    logla(`parti ${i / PARTI + 1}: ${dilim.length} URL → HTTP ${y.kod}${y.metin ? ` (${y.metin})` : ''}`);
    if (y.kod !== 200 && y.kod !== 202) {
      uyar('IndexNow bildirimi başarısız', `HTTP ${y.kod} — parti ${i / PARTI + 1}, ${dilim.length} URL. ${y.metin}`);
      process.exit(1);
    }
    for (const u of dilim) durum.bilinen[u] = canli.get(u);
    durum.sonBasariliBildirim = new Date().toISOString();
    durum.sonKosum = new Date().toISOString();
    durum.sonYanit = y.kod;
    await durumYaz(durum);
    if (i + PARTI < hedefler.length) await new Promise((c) => setTimeout(c, PARTI_BEKLE_MS));
  }
  // Sitemap'ten düşen URL'ler state'ten temizlenir (silinen sayfa yeniden
  // doğduğunda "yeni" sayılıp bildirilsin diye).
  if (!URL_DOSYA) {
    for (const u of Object.keys(durum.bilinen)) if (!canli.has(u)) delete durum.bilinen[u];
    await durumYaz(durum);
  }
  logla(`bitti: ${hedefler.length} URL bildirildi`);
}

ana().catch((e) => {
  logla(`HATA: ${e.message}`);
  uyar('IndexNow betiği hata verdi', e.message);
  process.exit(1);
});
