# Üçüncü Taraf Atıfları

## scroll-world scrub engine
- **Kaynak:** [oso95/scroll-world](https://github.com/oso95/scroll-world)
- **Telif:** © 2026 cyw
- **Lisans:** MIT
- **Kullanım:** ana sayfanın (`/`) 6 sahnelik scroll-scrub kamera akışı (23.07 öncesi `/deneyim/` rotasındaydı; o rota kapandı, 301 → `/`)
  (`src/scripts/scrub-engine.js`). Yukarı-akış dosyasının birebir kopyasıdır;
  tek uyarlama Astro ESM import'u için eklenen `export { mountScrollWorld }`
  satırıdır. Motorun asset-üretim pipeline'ı (Higgsfield tabanlı, ücretli
  harici servis) kopyalanmadı — suharitasi kendi Midjourney videolarını
  kullanır. Motorda harici servis/API çağrısı yoktur.

MIT lisans metni (yukarı-akış LICENSE dosyasından):

```
MIT License

Copyright (c) 2026 cyw

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
