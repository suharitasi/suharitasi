#!/usr/bin/env node
// VERİ TAZELİK PANOSU (P6-B, 05.10.2026)
//
// TEK KAYNAK: hem /acik-veri/ panosu (build-time) hem sağlık bekçisi
// `--kontrol` hem /veri/veri-tazelik.json ucu bu modülden beslenir.
// UYDURMA YASAĞI: as-of YALNIZ veri künyesinden okunur; okunamayan alan
// "bilinmiyor" basar, tarih ÜRETİLMEZ. İş takvimleri crontab ile birebir
// (05.10.2026 ölçümü). Statik/manuel sınıf eşik denetimine GİRMEZ.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// KOK çözümü (P6-B düzeltme): Astro build'de `import.meta.url` paket çıktısına
// yeniden yazılabiliyor — sırayla env → cwd → modül konumu denenir; proje kökü
// package.json + data işaretleriyle doğrulanır (yanlış kök SESSİZCE null üretmez).
const KOK_ADAYLAR = [
  process.env.SUHARITASI_KOK,
  process.cwd(),
  (() => { try { return join(dirname(fileURLToPath(import.meta.url)), '..'); } catch { return null; } })(),
].filter(Boolean);
const KOK = KOK_ADAYLAR.find((k) => existsSync(join(k, 'package.json')) && existsSync(join(k, 'data'))) || process.cwd();
const oku = (y) => { try { return JSON.parse(readFileSync(join(KOK, y), 'utf8')); } catch { return null; } };
const gun = (t) => { if (!t) return null; const m = String(t).match(/\d{4}-\d{2}-\d{2}/); return m ? m[0] : null; };
const farkGun = (iso, bugun) => Math.round((Date.parse(bugun + 'T00:00:00Z') - Date.parse(iso + 'T00:00:00Z')) / 86400000);
const enYeni = (...a) => { const g = a.map(gun).filter(Boolean).sort(); return g.length ? g.at(-1) : null; };
const ddmmyyyy = (t) => { const m = String(t || '').match(/(\d{2})\.(\d{2})\.(\d{4})/); return m ? `${m[3]}-${m[2]}-${m[1]}` : null; };

const POTANSIYEL = [
  'veri/potansiyel/zenginlestirme.json',
  'veri/potansiyel/kutle-il.json',
  'veri/potansiyel/morfoloji.json',
  'veri/potansiyel/akademik-kunye.json',
  'veri/potansiyel/mta-katalog.json',
  'veri/potansiyel/isletme-sahalari.json',
  'veri/potansiyel/isletme-sahalari-ek.json',
];

/** Kayıt defteri: asOf yalnız veri künyesinden; job crontab satırının özeti. */
export const KUMELER = [
  { id: 'baraj', ad: 'Baraj doluluk (EPİAŞ)', kaynak: 'EPİAŞ Şeffaflık', dosya: 'data/canli/baraj.json', asOf: () => gun(oku('data/canli/baraj.json')?.kunye?.sonGuncelleme), job: 'baraj-gunluk.sh · her gün 15:05 UTC', periyot: 'günlük', esikGun: 2, sinif: 'otomatik' },
  { id: 'chirps', ad: 'Yağış verisi (CHIRPS v2.0)', kaynak: 'UCSB/CHG', dosya: 'data/canli/chirps.json', asOf: () => gun(oku('data/canli/chirps.json')?.kunye?.son_guncelleme), job: 'chirps-guncelle.sh · ayın 5’i 04:40 UTC', periyot: 'aylık', esikGun: 45, sinif: 'otomatik' },
  { id: 'grace', ad: 'Uydu su depolaması (GRACE)', kaynak: 'NASA GSFC mascon', dosya: 'data/canli/grace-turkiye.json', asOf: () => gun(oku('data/canli/grace-turkiye.json')?.kunye?.islemeTarihi), job: 'grace-guncelle.sh · Pzt 02:40 UTC', periyot: 'haftalık', esikGun: 120, sinif: 'otomatik', not: 'Kaynak serisi aylar geriden gelir; eşik buna göre geniş.' },
  { id: 'mevzuat', ad: 'Mevzuat radarı', kaynak: 'mevzuat.gov.tr', dosya: 'data/kamu/mevzuat-surum.json', asOf: () => gun(oku('data/kamu/mevzuat-surum.json')?.son_kontrol), job: 'mevzuat-radar.sh · Çar 05:20 UTC', periyot: 'haftalık', esikGun: 9, sinif: 'otomatik' },
  { id: 'rg', ad: 'RG işletme-sahası nöbetçisi', kaynak: 'Resmî Gazete', dosya: 'izleme/state/rg-nobetci-durum.json', asOf: () => gun(oku('izleme/state/rg-nobetci-durum.json')?.son_kosum), job: 'rg-nobetci.py · Sal 04:20 UTC', periyot: 'haftalık', esikGun: 9, sinif: 'otomatik' },
  { id: 'nhyp', ad: 'NHYP yayın nöbetçisi', kaynak: 'tarimorman.gov.tr', dosya: 'izleme/state/nhyp-yayin-durum.json', asOf: () => gun(oku('izleme/state/nhyp-yayin-durum.json')?.son_kosum), job: 'nhyp-yayin-nobetci.py · Çar 04:40 UTC', periyot: 'haftalık', esikGun: 9, sinif: 'otomatik' },
  { id: 'yargi', ad: 'Yargı karar aday havuzu', kaynak: 'Danıştay / UYAP Emsal', dosya: 'data/emsal-adaylari.json', asOf: () => gun(oku('data/emsal-adaylari.json')?.son_guncelleme ?? oku('data/emsal-adaylari.json')?.olusturma), job: 'yargi-aylik.sh · her ayın 3’ü 01:30 UTC', periyot: 'aylık', esikGun: 40, sinif: 'otomatik' },
  { id: 'emsal', ad: 'Emsal karar veritabanı', kaynak: 'elden derleme (onaylı)', dosya: 'data/kamu/emsal-kararlar.json', asOf: () => gun(oku('data/kamu/emsal-kararlar.json')?.olusturma), job: 'yargi-aylik + insan onayı', periyot: 'düzenli değil', esikGun: null, sinif: 'manuel' },
  { id: 'potansiyel', ad: 'İl potansiyel derlemeleri', kaynak: 'derleme', dosya: 'veri/potansiyel/', asOf: () => enYeni(...POTANSIYEL.map((y) => oku(y)?.uretim_tarihi)), job: 'elle derleme', periyot: 'düzenli değil', esikGun: null, sinif: 'statik' },
  { id: 'golnehir', ad: 'Göl/nehir geometrileri (OSM)', kaynak: 'OpenStreetMap', dosya: 'src/data/tr-nehirler.json', asOf: () => { try { const s = readFileSync(join(KOK, 'src/data/gol-nehir.js'), 'utf8'); return ddmmyyyy(s.match(/GOLNEHIR_ERISIM\s*=\s*'([^']+)'/)?.[1]); } catch { return null; } }, job: 'elle çekim', periyot: 'düzenli değil', esikGun: null, sinif: 'statik' },
  { id: 'nasa', ad: 'İklim normaları (NASA POWER)', kaynak: 'NASA POWER 1981–2010', dosya: 'data/canli/nasa-power.json', asOf: () => null, job: 'statik klimatoloji', periyot: 'düzenli değil', esikGun: null, sinif: 'statik', not: 'Klimatoloji derlemesi — tarih damgası yok.' },
];

/** Panonun satırları (bugün = verilirse test/simülasyon; aksi hâlde sistem tarihi). */
export function tazelikTablosu(bugun) {
  const b = bugun || new Date().toISOString().slice(0, 10);
  return KUMELER.map((k) => {
    const asOf = k.asOf();
    const yasGun = asOf ? farkGun(asOf, b) : null;
    let durum;
    if (k.sinif !== 'otomatik') durum = 'bilgi';
    else if (!asOf) durum = 'bilinmiyor';
    else durum = yasGun <= k.esikGun ? 'guncel' : 'gecikmis';
    return { ...k, asOf, yasGun, durum, bugun: b };
  });
}

function main() {
  const args = process.argv.slice(2);
  const tablo = tazelikTablosu(process.env.VT_SAHTE_GUN || undefined);
  if (args.includes('--kontrol')) {
    const kotu = tablo.filter((r) => r.durum === 'gecikmis' || r.durum === 'bilinmiyor');
    for (const r of kotu) {
      console.log(`GECIKMIS ${r.id}: as-of ${r.asOf ?? 'bilinmiyor'} · ${r.yasGun ?? '?'} gün · ${r.ad}`);
    }
    console.log(`--- veri tazeliği: ${tablo.length} küme · ${kotu.length} sorun`);
    process.exit(kotu.length ? 1 : 0);
  }
  if (args.includes('--json')) {
    const yol = args[args.indexOf('--json') + 1] || join(KOK, 'izleme/veri-tazelik.json');
    writeFileSync(yol, JSON.stringify({ uretildi: new Date().toISOString(), veri: tablo }, null, 2));
    console.log(`yazıldı: ${yol}`);
    return;
  }
  for (const r of tablo) {
    console.log(`${r.durum.padEnd(10)} ${r.id.padEnd(12)} ${(r.asOf ?? '-').padEnd(10)} ${r.yasGun !== null ? String(r.yasGun) + 'g' : '-'.padEnd(3)}  ${r.ad}`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
