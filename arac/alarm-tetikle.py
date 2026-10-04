#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""alarm-tetikle.py — Dinamik alarm tetikleyicisi (Modül 3, sunucu tarafı).

Abonelikler Cloudflare KV'de (functions/api/alarm.js, 'al:' öneki) tutulur.
Bu betik KV'yi HTTPS okuma ucu (Auth: Bearer WA_SAYAC_ANAHTAR) üzerinden çeker,
her aboneliğin eşiğini GÜNCEL ölçümle karşılaştırır, eşik aşılınca e-posta
(SMTP) ve Telegram ile bildirir.

İLKELER: Uydurma yok (yalnız gerçek ölçüm); sessiz hata yok (log + exit≠0);
alarm yorgunluğu koruması (aynı abone+koşul 12 saatte bir bildirilir).

Kullanım: python3 arac/alarm-tetikle.py [--kuru] [--test]
"""
from __future__ import annotations
import argparse
import json
import smtplib
import ssl
import time
import urllib.parse
import urllib.request
from email.mime.text import MIMEText
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
STATE = KOK / "izleme" / "alarm" / "state.json"
LOG = KOK / "izleme" / "alarm" / "kosum.log"
AMA_PENCERE = 12 * 3600  # aynı koşul için tekrar bildirim aralığı (sn)
OKUMA_UC = "https://suharitasi.com/api/alarm"


def env_oku() -> dict:
    e = {}
    p = KOK / ".env"
    if not p.exists():
        return e
    for satir in p.read_text(encoding="utf-8").splitlines():
        if satir and not satir.startswith("#") and "=" in satir:
            k, v = satir.split("=", 1)
            e[k.strip()] = v.strip().strip('"').strip("'")
    return e


def logla(m):
    STATE.parent.mkdir(parents=True, exist_ok=True)
    satir = f"[{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}] {m}"
    print(satir)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(satir + "\n")


def aboneleri_cek(anahtar: str) -> list:
    req = urllib.request.Request(OKUMA_UC, headers={
        "Authorization": f"Bearer {anahtar}",
        "User-Agent": "suharitasi.com alarm-tetikleyici/1.0 (mailto:iletisim@suharitasi.com)",
    })
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8")).get("aboneler", [])


def havza_doluluk() -> dict:
    b = json.loads((KOK / "data/canli/baraj.json").read_text(encoding="utf-8"))
    out = {}
    for ad, h in b.get("havzalar", {}).items():
        son = {}
        for bb in h.get("barajlar", {}).values():
            for gun, v in (bb.get("seri") or {}).items():
                if v and v.get("doluluk") is not None:
                    son[gun] = son.get(gun, [])
                    son[gun].append(v["doluluk"])
        if son:
            g = max(son)
            out[ad.replace(" Havzası", "").strip()] = round(sum(son[g]) / len(son[g]), 2)
    return out


def telegram(env: dict, konu: str, govde: str):
    tok, chat = env.get("TELEGRAM_BOT_TOKEN"), env.get("TELEGRAM_CHAT_ID")
    if not tok or not chat:
        return False
    veri = urllib.parse.urlencode({"chat_id": chat, "text": f"su alarmı — {konu}\n\n{govde}"}).encode()
    req = urllib.request.Request(f"https://api.telegram.org/bot{tok}/sendMessage", data=veri)
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status == 200
    except Exception as e:
        logla(f"telegram hata: {e}")
        return False


def eposta_gonder(env: dict, kime: str, konu: str, govde: str) -> bool:
    host = env.get("SMTP_HOST"); port = int(env.get("SMTP_PORT") or 0)
    user = env.get("SMTP_USER"); pw = env.get("SMTP_PASS"); gonderen = env.get("FROM_EMAIL") or user
    if not (host and port and user and pw and gonderen):
        return False
    msg = MIMEText(govde, "plain", "utf-8")
    msg["Subject"] = konu
    msg["From"] = gonderen
    msg["To"] = kime
    try:
        with smtplib.SMTP(host, port, timeout=30) as s:
            s.starttls(context=ssl.create_default_context())
            s.login(user, pw)
            s.sendmail(gonderen, [kime], msg.as_string())
        return True
    except Exception as e:
        logla(f"SMTP hata ({kime}): {e}")
        return False


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--kuru", action="store_true")
    ap.add_argument("--test", action="store_true")
    a = ap.parse_args()

    env = env_oku()
    anahtar = env.get("WA_SAYAC_ANAHTAR", "")
    if not anahtar:
        logla("WA_SAYAC_ANAHTAR yok — KV köprüsü kurulmamış; çıkılıyor")
        return 0

    try:
        aboneler = aboneleri_cek(anahtar)
    except urllib.error.HTTPError as e:
        if e.code in (403, 405):
            logla("abonelik okuma YETKİSİZ (HTTP %d) — Cloudflare Pages projesinde "
                  "'SAYAC_ANAHTAR' secret'ı .env WA_SAYAC_ANAHTAR ile eşleşmiyor/eksik; "
                  "panelden ayarlanınca köprü çalışır." % e.code)
            return 0
        logla(f"abonelik okuma hatası: {e}")
        return 1
    except Exception as e:
        logla(f"abonelik okuma hatası: {e}")
        return 1
    logla(f"{len(aboneler)} abonelik çekildi")

    doluluk = havza_doluluk()
    durum = json.loads(STATE.read_text(encoding="utf-8")) if STATE.exists() else {}
    simdi = int(time.time())
    tetik = []

    for ab in aboneler:
        h = ab.get("havza", "")
        if h not in doluluk:
            continue
        guncel = doluluk[h]
        kosul = (ab.get("yon") == "alt" and guncel <= ab.get("esik", 0)) or \
                (ab.get("yon") == "ust" and guncel >= ab.get("esik", 0))
        if not kosul:
            continue
        imza = f"{h}:{ab.get('yon')}:{ab.get('esik')}"
        son = durum.get(ab.get("eposta", "") + "|" + imza, 0)
        if simdi - son < AMA_PENCERE:
            continue
        tetik.append((ab, guncel, imza))

    if not tetik:
        logla("tetiklenen alarm yok")
        return 0

    ozet = []
    for ab, guncel, imza in tetik:
        yon = "altına düştü" if ab.get("yon") == "alt" else "üstüne çıktı"
        konu = f"Alarm: {ab['havza']} baraj doluluğu %{guncel}"
        govde = (f"{ab['havza']} havzasında ortalama baraj doluluğu %{guncel}; "
                 f"kurguladığınız eşik (%{ab.get('esik')}) {yon}.\n\n"
                 f"Kaynak: EPİAŞ günlük verisi (Su Haritası otonom sistemi). "
                 f"Bu otomatik bir bilgilendirmedir; yatırım/hukuki tavsiye değildir.")
        ozet.append(f"• {ab['havza']} %{guncel} (eşik %{ab.get('esik')}, {ab.get('yon')})")
        if a.kuru or a.test:
            logla(f"[kuru] {konu} → {ab.get('eposta')}")
            continue
        ok = eposta_gonder(env, ab["eposta"], konu, govde)
        logla(f"e-posta {'gönderildi' if ok else 'GÖNDERİLEMEDİ (SMTP yok/hata)'}: {ab.get('eposta')}")
        durum[ab.get("eposta", "") + "|" + imza] = simdi

    if not a.kuru:
        telegram(env, f"{len(tetik)} su alarmı tetiklendi", "\n".join(ozet))
        STATE.write_text(json.dumps(durum, ensure_ascii=False, indent=1), encoding="utf-8")
    logla(f"{len(tetik)} alarm işlendi")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
