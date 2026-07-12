import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import illerUrl from '../src/data/tr-iller.json?url';
import nehirlerUrl from '../src/data/tr-nehirler.json?url';
import gollerUrl from '../src/data/tr-goller.json?url';

// Türkiye sınır kutusu (il verisinden hesaplandı: 25.67–44.83 / 35.82–42.11)
const TR_SINIR = [[25.67, 35.82], [44.83, 42.11]];
const KILIT = [[23.5, 34.3], [47.0, 43.6]];

const map = new maplibregl.Map({
  container: 'harita',
  attributionControl: false,
  bounds: TR_SINIR,
  fitBoundsOptions: { padding: 40 },
  maxBounds: KILIT,
  renderWorldCopies: false,
  dragRotate: false,
  pitchWithRotate: false,
  style: {
    version: 8,
    sources: {
      dem: {
        type: 'raster-dem',
        tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
        encoding: 'terrarium',
        tileSize: 256,
        maxzoom: 12,
        attribution: 'Arazi: Mapzen Terrain Tiles (AWS) — SRTM/NASA vd.',
      },
      iller: { type: 'geojson', data: illerUrl, generateId: true },
      nehirler: { type: 'geojson', data: nehirlerUrl, generateId: true },
      goller: { type: 'geojson', data: gollerUrl, generateId: true },
    },
    layers: [
      {
        id: 'zemin',
        type: 'background',
        paint: { 'background-color': '#04121F' },
      },
      {
        // Kara kütlesi: deniz ile kıyı ayrımı, rölyef bunun üstüne biner
        id: 'kara',
        type: 'fill',
        source: 'iller',
        paint: {
          'fill-color': '#071D2E',
          'fill-opacity': 0.75,
        },
      },
      {
        // Rölyef: dağlar kabartma gibi, derin-su tonlarında
        id: 'rolyef',
        type: 'hillshade',
        source: 'dem',
        paint: {
          'hillshade-shadow-color': '#020A12',
          'hillshade-highlight-color': '#12354A',
          'hillshade-accent-color': '#061A29',
          'hillshade-exaggeration': 0.55,
        },
      },
      {
        id: 'gol-dolgu',
        type: 'fill',
        source: 'goller',
        paint: {
          'fill-color': '#4FC3D0',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'canli'], false],
            0.4,
            0.22,
          ],
          'fill-opacity-transition': { duration: 450 },
        },
      },
      {
        // Göl kıyısında hafif ışıma
        id: 'gol-isilti',
        type: 'line',
        source: 'goller',
        paint: {
          'line-color': '#4FC3D0',
          'line-width': 1.6,
          'line-blur': 3,
          'line-opacity': 0.5,
        },
      },
      {
        // Nehir ışıltısı: geniş, bulanık, çok soluk alt çizgi
        id: 'nehir-isilti',
        type: 'line',
        source: 'nehirler',
        paint: {
          'line-color': '#4FC3D0',
          'line-width': ['interpolate', ['linear'], ['zoom'], 5, 2.5, 9, 5],
          'line-blur': 4,
          'line-opacity': 0.16,
        },
      },
      {
        id: 'nehir',
        type: 'line',
        source: 'nehirler',
        paint: {
          'line-color': '#4FC3D0',
          'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.6, 9, 1.6],
          'line-opacity': 0.55,
        },
      },
      {
        // Hover dolgusu: rölyef altından görünmeye devam etsin diye düşük opaklık
        id: 'il-dolgu',
        type: 'fill',
        source: 'iller',
        paint: {
          'fill-color': '#4FC3D0',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'canli'], false],
            0.18,
            0,
          ],
          'fill-opacity-transition': { duration: 450 },
        },
      },
      {
        id: 'il-sinir',
        type: 'line',
        source: 'iller',
        paint: {
          'line-color': '#0E3247',
          'line-width': 1,
          'line-opacity': 0.9,
        },
      },
      {
        id: 'il-sinir-canli',
        type: 'line',
        source: 'iller',
        paint: {
          'line-color': '#4FC3D0',
          'line-width': 1.4,
          'line-opacity': [
            'case',
            ['boolean', ['feature-state', 'canli'], false],
            0.85,
            0,
          ],
          'line-opacity-transition': { duration: 450 },
        },
      },
    ],
  },
});

map.touchZoomRotate.disableRotation();
map.addControl(new maplibregl.AttributionControl({ compact: true }));

// Yükleme durumu: DEM tile'ları harici kaynaktan gelir, ilk boya gecikebilir
const yukleniyor = document.getElementById('yukleniyor');
function yuklemeKapat() {
  yukleniyor.classList.add('bitti');
}
map.once('idle', yuklemeKapat);
setTimeout(yuklemeKapat, 8000); // ağ takılırsa kullanıcıyı bekletme

const kart = document.getElementById('kart');
const kartAd = document.getElementById('kart-ad');
let aktif = null; // { kaynak, id }

const KATMAN_KAYNAK = { 'gol-dolgu': 'goller', 'il-dolgu': 'iller' };

function canlandir(f) {
  const kaynak = KATMAN_KAYNAK[f.layer.id];
  if (aktif && aktif.kaynak === kaynak && aktif.id === f.id) return;
  if (aktif) {
    map.setFeatureState({ source: aktif.kaynak, id: aktif.id }, { canli: false });
  }
  aktif = { kaynak, id: f.id };
  map.setFeatureState({ source: kaynak, id: f.id }, { canli: true });
  kartAd.textContent = f.properties.ad || f.properties.name;
  kart.classList.add('acik');
}

function sondur() {
  if (aktif) {
    map.setFeatureState({ source: aktif.kaynak, id: aktif.id }, { canli: false });
    aktif = null;
  }
  kart.classList.remove('acik');
}

// Göl önceliklidir: il dolgusu render sırasında üstte olduğundan ayrı sorgula
function bul(nokta) {
  const gol = map.queryRenderedFeatures(nokta, { layers: ['gol-dolgu'] });
  if (gol.length) return gol[0];
  return map.queryRenderedFeatures(nokta, { layers: ['il-dolgu'] })[0];
}

map.on('mousemove', (e) => {
  const f = bul(e.point);
  if (f) {
    map.getCanvas().style.cursor = 'pointer';
    canlandir(f);
  } else {
    map.getCanvas().style.cursor = '';
    sondur();
  }
});

map.getCanvas().addEventListener('mouseleave', sondur);

// Dokunmatik: dokunma hover ile aynı etkiyi verir, boşluğa dokunma söndürür
map.on('click', (e) => {
  const f = bul(e.point);
  if (f) {
    canlandir(f);
  } else {
    sondur();
  }
});

// Konsoldan / testten erişim için
window.harita = map;
