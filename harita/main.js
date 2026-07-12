import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import illerUrl from '../src/data/tr-iller.json?url';

// Türkiye sınır kutusu (veriden hesaplandı: 25.67–44.83 / 35.82–42.11)
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
      iller: { type: 'geojson', data: illerUrl, generateId: true },
    },
    layers: [
      {
        id: 'zemin',
        type: 'background',
        paint: { 'background-color': '#04121F' },
      },
      {
        id: 'il-dolgu',
        type: 'fill',
        source: 'iller',
        paint: {
          // Hover'da suyla dolma hissinin ilk hali: akuamarine yumuşak geçiş
          'fill-color': [
            'case',
            ['boolean', ['feature-state', 'canli'], false],
            'rgba(79, 195, 208, 0.26)',
            '#071D2E',
          ],
          'fill-color-transition': { duration: 450 },
        },
      },
      {
        id: 'il-sinir',
        type: 'line',
        source: 'iller',
        paint: {
          'line-color': '#0E3247',
          'line-width': 1,
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

const kart = document.getElementById('kart');
const kartAd = document.getElementById('kart-ad');
let aktifId = null;

function canlandir(f) {
  if (f.id === aktifId) return;
  if (aktifId !== null) {
    map.setFeatureState({ source: 'iller', id: aktifId }, { canli: false });
  }
  aktifId = f.id;
  map.setFeatureState({ source: 'iller', id: aktifId }, { canli: true });
  kartAd.textContent = f.properties.name;
  kart.classList.add('acik');
}

function sondur() {
  if (aktifId !== null) {
    map.setFeatureState({ source: 'iller', id: aktifId }, { canli: false });
    aktifId = null;
  }
  kart.classList.remove('acik');
}

map.on('mousemove', 'il-dolgu', (e) => {
  map.getCanvas().style.cursor = 'pointer';
  canlandir(e.features[0]);
});

map.on('mouseleave', 'il-dolgu', () => {
  map.getCanvas().style.cursor = '';
  sondur();
});

// Dokunmatik: dokunma hover ile aynı etkiyi verir, boşluğa dokunma söndürür
map.on('click', (e) => {
  const bulunan = map.queryRenderedFeatures(e.point, { layers: ['il-dolgu'] });
  if (bulunan.length) {
    canlandir(bulunan[0]);
  } else {
    sondur();
  }
});
