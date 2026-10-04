/* nasa-power-cek.mjs — NASA POWER iklim verisini 25 havza için çeker.
   Kaynak: NASA POWER (power.larc.nasa.gov), Langley/GMAO — KAMU MALI, anahtarsız.
   Parametreler (climatology, 1981-2010): PRECTOTCORR (mm/gün yağış),
   T2M (°C), GWETROOT (kök bölgesi toprak nemi 0-1).
   Çıktı: data/canli/nasa-power.json (provenance'lı, uydurma yok).
   Havza temsil noktası: havzalar-web.geojson poligon bbox merkezi.
   Kullanım: node arac/kesif/nasa-power-cek.mjs [--kuru] */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const KOK = '/home/suha/projeler/suharitasi';
const GEO = `${KOK}/data/havzalar/havzalar-web.geojson`;
const OUT = `${KOK}/data/canli/nasa-power.json`;
const KURU = process.argv.includes('--kuru');
const API = 'https://power.larc.nasa.gov/api/temporal/climatology/point';
const PARAM = 'PRECTOTCORR,T2M,GWETROOT';

function bboxMerkez(geom) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  const gez = (c) => {
    if (typeof c[0] === 'number') {
      x0 = Math.min(x0, c[0]); x1 = Math.max(x1, c[0]);
      y0 = Math.min(y0, c[1]); y1 = Math.max(y1, c[1]);
    } else for (const p of c) gez(p);
  };
  gez(geom.coordinates);
  return { lon: (x0 + x1) / 2, lat: (y0 + y1) / 2 };
}

async function cek(lat, lon) {
  const url = `${API}?parameters=${PARAM}&community=AG&longitude=${lon.toFixed(4)}&latitude=${lat.toFixed(4)}&format=JSON`;
  const r = await fetch(url, { headers: { 'User-Agent': 'suharitasi.com/kesif (mailto:iletisim@suharitasi.com)' } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const j = await r.json();
  const p = j.properties.parameter;
  return {
    yagis_ann_mm_gun: p.PRECTOTCORR.ANN,
    sicaklik_ann_c: p.T2M.ANN,
    toprak_nemi_ann: p.GWETROOT.ANN,
    yagis_aylik: Object.fromEntries(Object.entries(p.PRECTOTCORR).filter(([k]) => k !== 'ANN')),
    sicaklik_aylik: Object.fromEntries(Object.entries(p.T2M).filter(([k]) => k !== 'ANN')),
  };
}

async function main() {
  const geo = JSON.parse(readFileSync(GEO, 'utf8'));
  const havzalar = {};
  for (const f of geo.features) {
    const ad = String(f.properties.ad || '').replace(' Havzası', '').trim();
    const no = f.properties.no;
    const { lat, lon } = bboxMerkez(f.geometry);
    try {
      const v = await cek(lat, lon);
      havzalar[ad] = { no, lat: +lat.toFixed(3), lon: +lon.toFixed(3), ...v };
      console.log(`  ✓ ${ad} (${no}) yagis=${v.yagis_ann_mm_gun} sicak=${v.sicaklik_ann_c}`);
    } catch (e) {
      havzalar[ad] = { no, lat: +lat.toFixed(3), lon: +lon.toFixed(3), hata: String(e.message || e) };
      console.error(`  ✗ ${ad}: ${e.message || e}`);
    }
    await new Promise((r) => setTimeout(r, 700));
  }
  const cikti = {
    _not: 'NASA POWER klimatoloji (1981-2010) — 25 havza bbox merkezi. KAMU MALI (NASA). Uydurma yok; değerler doğrudan API yanıtıdır.',
    kaynak: {
      ad: 'NASA POWER (Prediction Of Worldwide Energy Resources)',
      kurum: 'NASA Langley Araştırma Merkezi / GMAO',
      url: 'https://power.larc.nasa.gov/',
      api: API,
      lisans: 'Kamu malı (NASA) — atıf: NASA POWER Project',
      cekim: new Date().toISOString(),
      parametreler: {
        PRECTOTCORR: 'Yağış (mm/gün, iklim ortalaması)',
        T2M: '2 m hava sıcaklığı (°C)',
        GWETROOT: 'Kök bölgesi toprak nemi (0-1)',
      },
    },
    havzalar,
  };
  const basarili = Object.values(havzalar).filter((h) => !h.hata).length;
  if (KURU) { console.log(`[kuru] ${basarili}/${Object.keys(havzalar).length} havza çekildi, yazılmadı`); return; }
  if (basarili < 20) throw new Error(`çok az havza başarılı (${basarili}) — yazılmadı`);
  mkdirSync(`${KOK}/data/canli`, { recursive: true });
  writeFileSync(OUT, JSON.stringify(cikti, null, 1));
  console.log(`yazıldı: ${OUT} · ${basarili} havza`);
}

main().catch((e) => { console.error('HATA:', e.message || e); process.exit(1); });
