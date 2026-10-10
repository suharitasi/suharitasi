/* nasa-power-cek.mjs — NASA POWER iklim verisini 25 havza için çeker.
   Kaynak: NASA POWER (power.larc.nasa.gov), Langley/GMAO — KAMU MALI, anahtarsız.
   Parametreler (climatology, 1981-2010): PRECTOTCORR (mm/gün yağış),
   T2M (°C), GWETROOT (kök bölgesi toprak nemi 0-1).
   Çıktı: data/canli/nasa-power.json (provenance'lı, uydurma yok).
   Havza temsil noktası: havzalar-web.geojson poligon bbox merkezi.
   Kullanım: node arac/kesif/nasa-power-cek.mjs [--kuru] */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const KOK = process.env.KOK || process.cwd();
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

// 10.10.2026 brifi 1.4: tek bbox-merkez noktası havzayı temsil etmiyordu (Doğu
// Karadeniz = Çoruh, Meriç-Ergene = ülke ortalaması gibi çakışmalar). Artık havza
// çokgeninin İÇİNDE kalan düzenli ızgara noktaları (en çok 3×3) örneklenir ve
// basit ortalama alınır; nokta sayısı ve koordinatlar provenance olarak yazılır.
function noktaIcindeMi(lon, lat, geom) {
  const halkaIcinde = (halka) => {
    let icinde = false;
    for (let i = 0, j = halka.length - 1; i < halka.length; j = i++) {
      const [xi, yi] = halka[i], [xj, yj] = halka[j];
      if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) icinde = !icinde;
    }
    return icinde;
  };
  const poligonlar = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
  for (const p of poligonlar) {
    if (halkaIcinde(p[0]) && !p.slice(1).some((d) => halkaIcinde(d))) return true;
  }
  return false;
}
function ornekNoktalar(geom, n = 3) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  const gez = (c) => { if (typeof c[0] === 'number') { x0 = Math.min(x0, c[0]); x1 = Math.max(x1, c[0]); y0 = Math.min(y0, c[1]); y1 = Math.max(y1, c[1]); } else for (const p of c) gez(p); };
  gez(geom.coordinates);
  const noktalar = [];
  for (let i = 1; i <= n; i++) for (let j = 1; j <= n; j++) {
    const lon = x0 + ((x1 - x0) * i) / (n + 1), lat = y0 + ((y1 - y0) * j) / (n + 1);
    if (noktaIcindeMi(lon, lat, geom)) noktalar.push({ lon, lat });
  }
  if (!noktalar.length) noktalar.push(bboxMerkez(geom));
  return noktalar;
}
const ort = (dizi) => dizi.reduce((t, v) => t + v, 0) / dizi.length;
function ortalaVeri(liste) {
  const aySoz = (anahtar) => Object.fromEntries(Object.keys(liste[0][anahtar]).map((ay) => [ay, +ort(liste.map((v) => v[anahtar][ay])).toFixed(2)]));
  return {
    yagis_ann_mm_gun: +ort(liste.map((v) => v.yagis_ann_mm_gun)).toFixed(2),
    sicaklik_ann_c: +ort(liste.map((v) => v.sicaklik_ann_c)).toFixed(2),
    toprak_nemi_ann: +ort(liste.map((v) => v.toprak_nemi_ann)).toFixed(3),
    yagis_aylik: aySoz('yagis_aylik'),
    sicaklik_aylik: aySoz('sicaklik_aylik'),
  };
}

async function main() {
  const geo = JSON.parse(readFileSync(GEO, 'utf8'));
  const havzalar = {};
  for (const f of geo.features) {
    const ad = String(f.properties.ad || '').replace(' Havzası', '').trim();
    const no = f.properties.no;
    const noktalar = ornekNoktalar(f.geometry);
    const degerler = [];
    for (const { lat, lon } of noktalar) {
      try { degerler.push(await cek(lat, lon)); } catch (e) { console.error(`  ✗ ${ad} nokta ${lat.toFixed(2)},${lon.toFixed(2)}: ${e.message || e}`); }
      await new Promise((r) => setTimeout(r, 700));
    }
    const merkez = bboxMerkez(f.geometry);
    if (degerler.length) {
      havzalar[ad] = { no, lat: +merkez.lat.toFixed(3), lon: +merkez.lon.toFixed(3), nokta_sayisi: degerler.length,
        noktalar: noktalar.map((p) => [+p.lon.toFixed(3), +p.lat.toFixed(3)]), ornekleme: 'havza içi ızgara noktalarının basit ortalaması', ...ortalaVeri(degerler) };
      console.log(`  ✓ ${ad} (${no}) nokta=${degerler.length} yagis=${havzalar[ad].yagis_ann_mm_gun} sicak=${havzalar[ad].sicaklik_ann_c}`);
    } else {
      havzalar[ad] = { no, lat: +merkez.lat.toFixed(3), lon: +merkez.lon.toFixed(3), hata: 'hiçbir nokta çekilemedi' };
    }
  }
  const cikti = {
    _not: 'NASA POWER klimatoloji (1981-2010) — 25 havza, havza içi ızgara noktalarının (en çok 9) basit ortalaması (10.10.2026; önceki sürüm tek bbox-merkez noktasıydı). KAMU MALI (NASA). Uydurma yok; nokta değerleri API yanıtıdır, havza değeri bunların ortalamasıdır.',
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
