# Çapraz Ağ (Topic Cluster) Denetimi — 21.09.2026

**Kapsam:** FAZ 5 (v5.2) — iç link ağı bütünlüğü + kırık iç link taraması.
**Araç:** `arac/capraz-ag-denetim.mjs` (statik, ağ kullanmaz, salt okunur).
**Çıktı tabanı:** `npm run build` sonrası `dist/` (1011 sayfa üretildi, 1012 HTML).

## Yöntem

1. `dist/**/*.html` gezilir; `href="..."` iç linkleri çıkarılır.
2. Yalnız gerçek `<link>` içeriği sayılır: `<script>`/`<style>` gövdeleri
   ayıklanır (inline JS şablon literalleri — `/havzalar/${e.slug}/` — sahte
   kırık üretmesin).
3. Her hedef `dist/` içinde fiziksel dosyaya çözülür; `_redirects` tam-yol
   kuralları geçerli sayılır.
4. Küme düğümleri (göl · nehir · havza · kuyu-ruhsatı ili · sihirbaz · kısıt)
   sınıflanır; gelen kenar (in-degree), yalnız düğüm ve beklenen kenar
   (göl→il/havza, nehir→havza/il, havza→il/göl/nehir, il→havza/sihirbaz)
   ölçülür.

## Bulgular

### 1. Kırık iç link — 3 (DÜZELTİLDİ)

`/veri/gundem/` sayfası üç havza bağlantısını **Türkçe karakterleri düşüren
ad-hoc slugify** ile üretiyordu:

| Sayfadaki href (kırık) | Kanonik hedef | Neden |
|---|---|---|
| `/havzalar/bat-akdeniz/` | `/havzalar/bati-akdeniz/` | `ı` → `-` |
| `/havzalar/b-y-k-menderes/` | `/havzalar/buyuk-menderes/` | `ü` → `-` |
| `/havzalar/konya-kapal-/` | `/havzalar/konya-kapali/` | `ı` → `-` (sonda `-`) |

**Kök neden:** `gundem.astro` içinde `ad.toLowerCase().replace(/[^a-z0-9]+/g,'-')`
— TR_ASCII eşlemesi yok. Kanonik havza slug'ı içerik koleksiyonunun
dosya adıdır (`src/content/havzalar/*.md`).

**Düzeltme:** sayfa artık kanonik yolu TEK KAYNAKTAN alır —
`getCollection('havzalar')` → `no → /havzalar/<id>/` eşlemesi. Karşılığı
olmayan havza **düz metin** kalır (kırık link üretilmez). Aynı eşlemeyle
"Rezervi en hızlı azalan" ve "En kurak" bölümlerindeki havza adları da
veri-koşullu bağlandı (küme yoğunluğu).

### 2. Küme bütünlüğü — TEMİZ

| Ölçüm | Değer |
|---|---|
| Küme sayfası | 450 |
| **Yalnız düğüm (in-degree 0)** | **0** |
| Gelen kenar — sihirbaz | 1010 |
| Gelen kenar — kısıt sorgu | 1008 |
| Gelen kenar — kuyu-ruhsatı ili | 1167 |
| Gelen kenar — havza | 724 |
| Gelen kenar — göl | 494 |
| Gelen kenar — nehir | 191 |
| **Kırık iç link** | **0** |

FAZ 5 sözleşmesindeki kenarlar mevcut: göl→il (kuyu-ruhsatı) + göl→havza;
nehir→havza + nehir→il; havza→il + havza→göl + havza→nehir;
il→havza + il→sihirbaz. "Havzanın il sayfaları" kenarı havza sayfası
üzerinden kuruludur (göl→havza→il); her göl sayfasına havzanın tüm illerini
basmak bağlantı yığını (link farm) olur ve havza sayfasının rolünü
mükerrerleştirir — bu yüzden eklenmedi.

### 3. Veri-koşullu eksik kenar — 7 (kusur DEĞİL)

| Sayfa | Eksik hedef türü | Neden |
|---|---|---|
| `/goller/gokceada-baraj-golu/` | havza | Gökçeada 25 havza çokgeni dışında (ada) — eşleme yok |
| `/goller/gol-1/` | havza | Örnek noktalar hiçbir havza çokgenine düşmüyor |
| `/havzalar/akarcay/` | göl · nehir | Havzaya eşlenmiş göl/nehir yok |
| `/havzalar/burdur/` | nehir | Havzaya eşlenmiş nehir yok |
| `/havzalar/konya-kapali/` | nehir | Havzaya eşlenmiş nehir yok |
| `/havzalar/kucuk-menderes/` | nehir | Havzaya eşlenmiş nehir yok |

Hepsi `gol-nehir-cografya.js` geometrik eşlemesinin doğal sonucu: veri yoksa
bağ YOK (uydurma yasağı). Hiçbiri şablon kusuru değil.

## Kanıt

- `npm run build` → exit 0 · 1011 sayfa · sitemap 1007.
- `node arac/capraz-ag-denetim.mjs` → YEŞİL · 1012 sayfa · kırık 0 · yalnız
  düğüm 0 · eksik kenar 7 (veri-koşullu).
- `/veri/gundem/` bağlantıları kanonik slug'a döndü
  (`bati-akdeniz`, `buyuk-menderes`, `konya-kapali`, `kuzey-ege`, `marmara`).
- Etkilenen sayfalarda tarayıcı konsol hatası 0 (Playwright, CSP'li
  `arac/dist-sun.mjs`).

## Süreklilik

Kırık link denetimi zaten `arac/site-saglik.mjs` md6'da vardır (--tam).
Küme bütünlüğü (yalnız düğüm/eksik kenar) ölçümü bu işle kalıcı araca alındı:
`arac/capraz-ag-denetim.mjs` (kırık veya yalnız düğümde exit 1).
