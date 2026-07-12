import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import illerUrl from '../src/data/tr-iller.json?url';
import nehirlerUrl from '../src/data/tr-nehirler.json?url';
import gollerUrl from '../src/data/tr-goller.json?url';
import atlasUrl from '../src/assets/tr-atlas.webp';
import { atmosferKur } from './atmosfer.js';

atmosferKur();

// Türkiye sınır kutusu (il verisinden hesaplandı: 25.67–44.83 / 35.82–42.11)
const TR_SINIR = [[25.67, 35.82], [44.83, 42.11]];
const KILIT = [[23.5, 34.3], [47.0, 43.6]];

// Atlas görselinin coğrafi kapsamı (z9 tile kenarları, üretim script'inden)
const ATLAS_BATI = 24.609375;
const ATLAS_DOGU = 45.703125;
const ATLAS_KUZEY = 43.06888777416962;
const ATLAS_GUNEY = 34.885930940753155;

const map = new maplibregl.Map({
  container: 'harita',
  attributionControl: false,
  bounds: TR_SINIR,
  fitBoundsOptions: { padding: 40 },
  maxBounds: KILIT,
  minZoom: 5,
  maxZoom: 8.6, // atlas görselinin keskin kaldığı bant
  renderWorldCopies: false,
  dragRotate: false,
  pitchWithRotate: false,
  style: {
    version: 8,
    sources: {
      atlas: {
        type: 'image',
        url: atlasUrl,
        coordinates: [
          [ATLAS_BATI, ATLAS_KUZEY],
          [ATLAS_DOGU, ATLAS_KUZEY],
          [ATLAS_DOGU, ATLAS_GUNEY],
          [ATLAS_BATI, ATLAS_GUNEY],
        ],
      },
      iller: { type: 'geojson', data: illerUrl, generateId: true },
      nehirler: { type: 'geojson', data: nehirlerUrl, generateId: true },
      goller: { type: 'geojson', data: gollerUrl, generateId: true },
    },
    layers: [
      {
        // Deniz: atlas görselinin dışında kalan alan da adaçayı kalsın
        id: 'zemin',
        type: 'background',
        paint: { 'background-color': '#A9C3B4' },
      },
      {
        id: 'rolyef',
        type: 'raster',
        source: 'atlas',
        paint: { 'raster-fade-duration': 0 },
      },
      {
        id: 'gol-dolgu',
        type: 'fill',
        source: 'goller',
        paint: {
          'fill-color': '#5E8A87',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'canli'], false],
            0.85,
            0.6,
          ],
          'fill-opacity-transition': { duration: 450 },
        },
      },
      {
        id: 'gol-kiyi',
        type: 'line',
        source: 'goller',
        paint: {
          'line-color': '#5E8A87',
          'line-width': 1,
          'line-opacity': 0.7,
        },
      },
      {
        id: 'nehir',
        type: 'line',
        source: 'nehirler',
        paint: {
          'line-color': '#5E8A87',
          'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.7, 8.6, 1.8],
          'line-opacity': 0.7,
        },
      },
      {
        // Hover dolgusu: rölyef altta görünür kalsın
        id: 'il-dolgu',
        type: 'fill',
        source: 'iller',
        paint: {
          'fill-color': '#D9A05B',
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
          'line-color': '#6E5238',
          'line-width': 0.7,
          'line-opacity': 0.35,
        },
      },
      {
        id: 'il-sinir-canli',
        type: 'line',
        source: 'iller',
        paint: {
          'line-color': '#D9A05B',
          'line-width': 1.4,
          'line-opacity': [
            'case',
            ['boolean', ['feature-state', 'canli'], false],
            0.9,
            0,
          ],
          'line-opacity-transition': { duration: 450 },
        },
      },
    ],
  },
});

map.touchZoomRotate.disableRotation();
map.addControl(new maplibregl.AttributionControl({
  compact: true,
  customAttribution: 'Arazi: Mapzen Terrain Tiles (AWS) verisinden türetildi — SRTM/NASA vd.',
}));

// Yükleme durumu
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
