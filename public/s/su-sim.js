/* Gerçek zamanlı su yüzeyi simülasyonu (menü zemini) — raw WebGL2, bağımlısız.
   Yöntem: klasik yükseklik alanı dalga denklemi, RG16F ping-pong dokular
   (r = yükseklik, g = hız). Render geçişi yükseklikten normal türetip
   #04121F derin zemin üzerine akuamarin kırılma parıltısı bindirir.
   WebGL2 veya EXT_color_buffer_float yoksa null döner; çağıran fallback
   zemini gösterir (three.js'e gerek kalmadı — gerekçe raporda). */

const VERT = `#version 300 es
precision highp float;
const vec2 K[3] = vec2[3](vec2(-1.,-1.), vec2(3.,-1.), vec2(-1.,3.));
void main(){ gl_Position = vec4(K[gl_VertexID], 0., 1.); }`;

const SIM_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uOnceki;
uniform vec2 uTexel;
uniform vec3 uDamla;   /* x,y: uv; z: güç (0 = yok) */
out vec4 o;
void main(){
  vec2 uv = gl_FragCoord.xy * uTexel;
  vec2 c  = texture(uOnceki, uv).rg;
  float l = texture(uOnceki, uv - vec2(uTexel.x, 0.)).r;
  float r = texture(uOnceki, uv + vec2(uTexel.x, 0.)).r;
  float b = texture(uOnceki, uv - vec2(0., uTexel.y)).r;
  float t = texture(uOnceki, uv + vec2(0., uTexel.y)).r;
  float lap = (l + r + b + t) - 4. * c.r;
  float hiz = (c.g + lap * 0.5) * 0.986;
  float yuk = (c.r + hiz) * 0.9985;
  if (uDamla.z != 0.) {
    float d = distance(uv, uDamla.xy);
    yuk += uDamla.z * exp(-d * d * 1400.);
  }
  o = vec4(yuk, hiz, 0., 1.);
}`;

const CIZ_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uYuzey;
uniform vec2 uEkran;
uniform vec2 uTexel;
uniform float uGorunum;
uniform float uZaman;
out vec4 o;
void main(){
  vec2 uv = gl_FragCoord.xy / uEkran;
  float l = texture(uYuzey, uv - vec2(uTexel.x, 0.)).r;
  float r = texture(uYuzey, uv + vec2(uTexel.x, 0.)).r;
  float b = texture(uYuzey, uv - vec2(0., uTexel.y)).r;
  float t = texture(uYuzey, uv + vec2(0., uTexel.y)).r;

  /* Idle swell: simden bağımsız, durağanken bile fark edilen ambient
     dalgalanma — büyük ölçekli, yavaş, küçük genlik. */
  vec2 sw = vec2(
    sin(uv.x * 7.0 + uZaman * 0.55) * sin(uv.y * 5.0 - uZaman * 0.38),
    sin(uv.x * 5.5 - uZaman * 0.42) * sin(uv.y * 6.5 + uZaman * 0.5)
  ) * 0.016;

  vec2 grad = vec2(l - r, b - t) + sw;
  vec3 n = normalize(vec3(grad, 0.12));

  /* Derinlik zemini: #04121F, merkeze doğru hafif aydınlanan */
  vec3 derin = vec3(0.0157, 0.0706, 0.1216);
  vec3 orta  = vec3(0.0431, 0.1451, 0.2118);
  float m = 1.0 - smoothstep(0.0, 0.85, distance(uv, vec2(0.5, 0.42)));
  vec3 col = mix(derin, orta, m * 0.6);

  /* Dalga tepelerinde akuamarin kırılma parıltısı (#4FC3D0) — net seçilir */
  vec3 aqua = vec3(0.310, 0.765, 0.816);
  float egim = length(grad);
  col += aqua * min(egim * 17.0, 0.85);

  /* Tek alçak ışıktan yumuşak yansıma */
  float spec = pow(max(dot(n, normalize(vec3(0.25, 0.4, 0.88))), 0.0), 50.0);
  col += aqua * spec * 0.4;

  o = vec4(col * uGorunum, 1.0);
}`;

function derle(gl, tip, kaynak) {
  const s = gl.createShader(tip);
  gl.shaderSource(s, kaynak);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
  return s;
}

function program(gl, fs) {
  const p = gl.createProgram();
  const v = derle(gl, gl.VERTEX_SHADER, VERT);
  const f = derle(gl, gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return null;
  gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
  return p;
}

/* canvas: overlay içindeki canvas; secenekler.hata(): geri dönüşsüz arıza
   (context loss / düşük FPS) — çağıran fallback'e geçer. */
export function baslat(canvas, secenekler = {}) {
  const gl = canvas.getContext('webgl2', {
    alpha: false, antialias: false, depth: false, stencil: false,
    powerPreference: 'low-power',
  });
  if (!gl || !gl.getExtension('EXT_color_buffer_float')) return null;

  const simP = program(gl, SIM_FRAG);
  const cizP = program(gl, CIZ_FRAG);
  if (!simP || !cizP) return null;

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  let genis = 288, yuksek = 162;   // sim grid; FPS'e göre yarıya iner
  let dokular = [], fbolar = [], aktifDoku = 0;
  let dongu = 0, calisiyor = false, gorunum = 0;
  let bekleyen = [];               // damla kuyruğu {x,y,g}
  let kare = 0, olcumBasi = 0, seviye = 0; // seviye 0: tam, 1: yarım, 2: durdu

  function dokuKur() {
    dokular.forEach((d) => gl.deleteTexture(d));
    fbolar.forEach((f) => gl.deleteFramebuffer(f));
    dokular = []; fbolar = [];
    for (let i = 0; i < 2; i++) {
      const d = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, d);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, genis, yuksek, 0, gl.RG, gl.HALF_FLOAT, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const f = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, f);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, d, 0);
      gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
      dokular.push(d); fbolar.push(f);
    }
    aktifDoku = 0;
  }

  function boyutla() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
    }
  }

  function ariza() {
    calisiyor = false;
    if (secenekler.hata) secenekler.hata();
  }

  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); ariza(); });

  const gorunurluk = () => {
    if (document.hidden) calisiyor = false;
    else if (seviye < 2 && acik) { calisiyor = true; olcumSifirla(); requestAnimationFrame(adim); }
  };
  document.addEventListener('visibilitychange', gorunurluk);

  let acik = false;
  let sonAmbient = 0;

  function olcumSifirla() { kare = 0; olcumBasi = performance.now(); }

  function adim(t) {
    if (!calisiyor) return;
    /* FPS ölçümü: ilk 20 kare ISINMA (menü giriş animasyonu + derleme ana
       thread'i meşgul eder; erken karelerle ölçüm yanıltır — canlıda erken
       fallback'in kökü buydu). Sonraki 60 kare ölçülür. Eşikler kasıtlı
       düşük: gerçek GPU'lu tarayıcı bunlara asla takılmaz; yalnız gerçekten
       aciz cihaz korunur. Headless ölçümüne göre eşik AYARLANMAZ. */
    kare++;
    if (kare === 20) olcumBasi = performance.now();
    if (kare === 80) {
      const fps = 60000 / (performance.now() - olcumBasi);
      if (secenekler.fps) secenekler.fps(Math.round(fps));
      if (fps < 16 && seviye >= 1) { ariza(); return; }
      if (fps < 26 && seviye === 0) {
        seviye = 1; genis = 144; yuksek = 81; dokuKur(); olcumSifirla();
      }
    }

    // Ambient: yüzey ölü kalmasın — ~0.7 sn'de bir belirgin küçük damla.
    if (t - sonAmbient > 700) {
      sonAmbient = t;
      const a = t * 0.00037;
      bekleyen.push({
        x: 0.5 + 0.42 * Math.sin(a * 1.7) * Math.cos(a * 0.6),
        y: 0.5 + 0.36 * Math.cos(a * 2.3),
        g: 0.028,
      });
    }

    // Sim geçişi
    const kayan = bekleyen.shift();
    gl.useProgram(simP);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbolar[1 - aktifDoku]);
    gl.viewport(0, 0, genis, yuksek);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, dokular[aktifDoku]);
    gl.uniform1i(gl.getUniformLocation(simP, 'uOnceki'), 0);
    gl.uniform2f(gl.getUniformLocation(simP, 'uTexel'), 1 / genis, 1 / yuksek);
    gl.uniform3f(gl.getUniformLocation(simP, 'uDamla'),
      kayan ? kayan.x : 0, kayan ? 1 - kayan.y : 0, kayan ? kayan.g : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    aktifDoku = 1 - aktifDoku;

    // Ekrana çizim (yumuşak fade-in)
    if (gorunum < 1) gorunum = Math.min(1, gorunum + 0.03);
    boyutla();
    gl.useProgram(cizP);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.bindTexture(gl.TEXTURE_2D, dokular[aktifDoku]);
    gl.uniform1i(gl.getUniformLocation(cizP, 'uYuzey'), 0);
    gl.uniform2f(gl.getUniformLocation(cizP, 'uEkran'), canvas.width, canvas.height);
    gl.uniform2f(gl.getUniformLocation(cizP, 'uTexel'), 1 / genis, 1 / yuksek);
    gl.uniform1f(gl.getUniformLocation(cizP, 'uGorunum'), gorunum);
    gl.uniform1f(gl.getUniformLocation(cizP, 'uZaman'), t * 0.001);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimationFrame(adim);
  }

  dokuKur();

  return {
    /* Menü açıldığında: temiz yüzeyden başla (birikmiş dalga patlaması olmaz). */
    ac() {
      acik = true; dokuKur(); bekleyen = []; gorunum = 0;
      if (!calisiyor && seviye < 2) {
        calisiyor = true; olcumSifirla(); sonAmbient = 0;
        requestAnimationFrame(adim);
      }
    },
    kapa() { acik = false; calisiyor = false; },
    /* x, y: 0-1 aralığında overlay koordinatı */
    damla(x, y, guc = 0.05) {
      if (calisiyor && bekleyen.length < 12) bekleyen.push({ x, y, g: guc });
    },
    calisiyorMu: () => calisiyor,
  };
}
