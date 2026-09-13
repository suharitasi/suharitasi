#!/usr/bin/env bash
# TEMAS SAYACI — telefon/e-posta/WhatsApp/form tıklamalarını tek komutla okur
# (13.09.2026, ölçüm altyapısı). Kaynak: functions/olay.js (KV: WA_SAYAC).
# Anahtar: .env → WA_SAYAC_ANAHTAR (paneldeki SAYAC_ANAHTAR secret'ı ile AYNI).
# Kullanım: arac/temas-sayac.sh           → JSON {olaylar, toplam, okuma}
#           arac/temas-sayac.sh --ozet    → tek satır özet (olay başına toplam)
set -euo pipefail
KOK="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE="${WA_SAYAC_SITE:-https://suharitasi.com}"
ANAHTAR="${WA_SAYAC_ANAHTAR:-}"
if [ -z "$ANAHTAR" ] && [ -f "$KOK/.env" ]; then
  ANAHTAR=$(grep -E '^WA_SAYAC_ANAHTAR=' "$KOK/.env" | tail -1 | cut -d= -f2- | tr -d '"' || true)
fi
[ -n "$ANAHTAR" ] || { echo "HATA: WA_SAYAC_ANAHTAR yok (.env ya da ortam)"; exit 2; }

YANIT=$(mktemp); trap 'rm -f "$YANIT"' EXIT
KOD=$(curl -sS -m 30 -o "$YANIT" -w '%{http_code}' "$SITE/olay?sayac=$ANAHTAR")
case "$KOD" in
  200)
    if [ "${1:-}" = "--ozet" ]; then
      python3 -c 'import json,sys,datetime
d=json.load(open(sys.argv[1])); olaylar=d.get("olaylar",{})
bugun=(datetime.datetime.utcnow()+datetime.timedelta(hours=3)).strftime("%Y-%m-%d")
parca=[]
for ad,gunler in sorted(olaylar.items()):
    toplam=sum(gunler.values()); bugun_n=gunler.get(bugun,0)
    parca.append(f"{ad}: bugün {bugun_n} / toplam {toplam}")
print("Temas tıklamaları — " + (" · ".join(parca) if parca else "kayıt yok") + f" · okuma {d.get(\"okuma\",\"?\")}")' "$YANIT"
    else
      cat "$YANIT"; echo
    fi ;;
  204)
    echo "SAYAÇ HENÜZ KURULMADI: /olay 204 döndü — KV bağlaması (WA_SAYAC) ya da SAYAC_ANAHTAR secret'ı panelde eksik/uyuşmuyor."; exit 3 ;;
  *)
    echo "HATA: HTTP $KOD — $(head -c 300 "$YANIT")"; exit 1 ;;
esac
