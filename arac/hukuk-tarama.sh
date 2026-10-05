#!/bin/bash
# HUKUK-DİLİ TARAMASI (P5, 05.10.2026) — repo sürekliliği sürümü.
#
# Skill'deki dar sürümün (yalnız 4 sayfa) genişletilmiş hâli:
#   (1) TÜM dist HTML'de yasak vaat dili,
#   (2) hukuk ailelerinde disclaimer varlığı (aile başına en az bir eşleşme).
# Uydurma yasağı: tarayıcı yalnız mevcut görünür metni arar; yorum/bulgu üretmez.
# Kullanım: bash arac/hukuk-tarama.sh [dist]   · bulgu>0 ise exit 1.
set -euo pipefail
KOK="$(cd "$(dirname "$0")/.." && pwd)"
DIST="${1:-$KOK/dist}"
python3 - "$DIST" <<'PY'
import pathlib, re, sys

dist = pathlib.Path(sys.argv[1])
if not dist.is_dir():
    print(f'HATA: dist yok: {dist}')
    sys.exit(2)

# Yasak vaat dili — küçük harf eşleşme; `\b` ile "arama/arayın" ayrımı korunur.
YASAK = [
    (r'hemen ara\b', 'hemen ara'),
    (r'hemen arayın', 'hemen arayın'),
    (r'kazanın', 'kazanın'),
    (r'garanti sonuç', 'garanti sonuç'),
    (r'kesin kazanç', 'kesin kazanç'),
    (r'davan[ıi]z?ı? alırız', 'davan(ız)ı alırız'),
    (r'en iyi avukat', 'en iyi avukat'),
]
# Disclaimer zorunlu aileler (üst dizin adı).
AILELER = {'mevzuat', 'rehberler', 'kuyu-ruhsati', 'kuyu-kisit-sorgu',
           'kuyu-karar-motoru', 'su-hukuku', 'emsal-kararlar'}
DISCLAIMER = ('hukuki görüş', 'bilgilendirme amaçlıdır')

sayfa = 0
bulgu = 0
for p in sorted(dist.rglob('index.html')):
    h = p.read_text(encoding='utf-8', errors='ignore').lower()
    sayfa += 1
    yol = p.relative_to(dist).parent.as_posix()
    for kalip, ad in YASAK:
        if re.search(kalip, h):
            print(f'BULGU vaat dili ("{ad}"): /{yol}/')
            bulgu += 1
    if yol.split('/')[0] in AILELER and not any(d in h for d in DISCLAIMER):
        print(f'BULGU disclaimer yok: /{yol}/')
        bulgu += 1

print(f'--- hukuk-dili taraması: {sayfa} sayfa · {bulgu} bulgu')
sys.exit(1 if bulgu else 0)
PY
