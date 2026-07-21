#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Su Kanunu izleme — saf fonksiyon motoru (fark motoru + RG fihrist + anahtar kelime).
Ağ/git YOK; yalnız stdin/dosya işler. su-izleme.sh bunu çağırır.

Alt komutlar:
  normalize <dosya>            -> gürültü envanteri silinmiş GÖRÜNÜR METİN (stdout)
  rg <fihrist.html> <kw.txt>   -> RG fihrist analizi + 'OLAY:' satırları (keyword)
  kw <metin.txt> <kw.txt>      -> genel TR-normalizeli anahtar kelime taraması

Çıkış kodu daima 0 (hatalar bash tarafında izole edilir); parse edilemeyen
girdi 'BOŞ'/uyarı satırı üretir, sessizce yutulmaz.

GÜRÜLTÜ ENVANTERİ (keşif raporu 700f216'dan birebir + T2 sonrası eklenenler):
  __VIEWSTATE / __VIEWSTATEGENERATOR / __EVENTVALIDATION  (SharePoint/ASP.NET)
  __RequestVerificationToken                              (ASP.NET anti-forgery)
  X-CSRF-TOKEN-*                                          (TBMM)
  formhelper_<id>                                         (RG iletişim formu)
  CssLink-<guid>                                          (SharePoint Themable CSS)
  Gösterim Sayısı : <n>   [KEŞİF-SONRASI EKLENEN, T2 — İYS haber görüntülenme
                          sayacı; her istekte +1 artar, görünür metinde kalır]
Not: normalize son adımda TÜM etiketleri atıp görünür metne indiği için
öznitelik/gizli-input gürültüsü zaten düşer; envanter silme belge + emniyet
katmanıdır (dinamik id'ler metne sızarsa diye açık desenler tutulur).
"""
import sys, re, html as H


def tr_lower(s: str) -> str:
    """Türkçe-doğru küçük harf: İ→i, I→ı, Ş/Ç/Ö/Ü/Ğ→küçük, sonra ASCII lower.
    'SU KANUNU' ↔ 'su kanunu', 'YERALTI' → 'yeraltı' eşleşsin."""
    ust = "İIŞÇÖÜĞ"
    alt = "iışçöüğ"
    s = s.translate(str.maketrans(ust, alt))
    return s.lower()


def _strip_noise(s: str) -> str:
    s = re.sub(r'(name="__(?:VIEWSTATE|VIEWSTATEGENERATOR|EVENTVALIDATION)"[^>]*value=")[^"]*"', r'\1"', s)
    s = re.sub(r'(name="__RequestVerificationToken"[^>]*value=")[^"]*"', r'\1"', s)
    s = re.sub(r'(name="X-CSRF-TOKEN[^"]*"[^>]*value=")[^"]*"', r'\1"', s)
    s = re.sub(r'formhelper_[A-Za-z0-9]+', 'formhelper_ID', s)
    s = re.sub(r'CssLink-[0-9a-fA-F]{32}', 'CssLink-GUID', s)
    return s


def normalize(s: str) -> str:
    """Gürültü envanteri sil -> script/style at -> etiket at -> görünür metin."""
    s = _strip_noise(s)
    s = re.sub(r'<script.*?</script>|<style.*?</style>', '', s, flags=re.S | re.I)
    s = re.sub(r'<[^>]+>', '\n', s)
    s = H.unescape(s)
    # KEŞİF-SONRASI EKLENEN desen (T2): İYS/SharePoint haber görüntülenme sayacı.
    s = re.sub(r'(Gösterim Sayısı\s*:\s*)\d+', r'\1N', s)
    out = []
    for line in s.splitlines():
        line = re.sub(r'[ \t ]+', ' ', line).strip()
        if line:
            out.append(line)
    return '\n'.join(out)


def _entries_from_text(norm_text: str):
    """Normalize metinden RG fihrist maddelerini bölüm etiketiyle çıkar.
    Döner: [(bolum, kategori, baslik), ...]"""
    BOLUM = {"YASAMA BÖLÜMÜ", "YÜRÜTME VE İDARE BÖLÜMÜ", "YARGI BÖLÜMÜ",
             "İLÂN BÖLÜMÜ", "İLAN BÖLÜMÜ"}
    KAT = {"KANUNLAR", "KANUN", "CUMHURBAŞKANLIĞI KARARNAMELERİ",
           "CUMHURBAŞKANI KARARLARI", "CUMHURBAŞKANI KARARI", "YÖNETMELİKLER",
           "YÖNETMELİK", "TEBLİĞLER", "TEBLİĞ", "GENELGE", "KURUL KARARLARI"}
    bolum, kat = "", ""
    ent = []
    for line in norm_text.splitlines():
        t = line.strip()
        up = t.upper()
        if up in BOLUM:
            bolum = up
            kat = ""
            continue
        if up in KAT:
            kat = up
            continue
        m = re.match(r'^[–—-]{1,2}\s*(.+)$', t)  # fihrist maddeleri "–– Başlık"
        if m and len(m.group(1)) >= 8:
            ent.append((bolum, kat, m.group(1).strip()))
    return ent


def _load_keywords(path: str):
    kws = []
    try:
        with open(path, encoding='utf-8') as f:
            for ln in f:
                ln = ln.strip()
                if ln and not ln.startswith('#'):
                    kws.append(ln)
    except OSError as e:
        print(f"UYARI: anahtar-kelime dosyası okunamadı: {e}", file=sys.stderr)
    return kws


def _match(hay: str, kws):
    hl = tr_lower(hay)
    return [k for k in kws if tr_lower(k) in hl]


def cmd_rg(fihrist_path, kw_path):
    try:
        raw = open(fihrist_path, encoding='utf-8', errors='replace').read()
    except OSError as e:
        print(f"UYARI: fihrist okunamadı: {e}")
        return
    norm = normalize(raw)
    ent = _entries_from_text(norm)
    kws = _load_keywords(kw_path)
    kanunlar = [e for e in ent if e[0] == "YASAMA BÖLÜMÜ" or e[1] in ("KANUNLAR", "KANUN")]

    print("=== RG FİHRİST ANALİZİ ===")
    bolumler = []
    for b, _, _ in ent:
        if b and b not in bolumler:
            bolumler.append(b)
    print("Bölümler: " + ("; ".join(bolumler) if bolumler else "(saptanamadı)"))
    print(f"Toplam madde: {len(ent)}")
    print(f"KANUN maddeleri: {len(kanunlar)}")
    for _, _, b in kanunlar:
        print(f"  - {b}")
    if not kanunlar:
        print("  (bugün KANUN/YASAMA bölümü yok — çoğu gün normaldir)")

    # OLAY: anahtar kelime eşleşmesi (önce KANUN maddeleri, sonra tüm fihrist metni)
    olay = False
    for _, _, b in kanunlar:
        for k in _match(b, kws):
            print(f"OLAY:{k}:KANUN:{b}")
            olay = True
    # KANUN dışı ama fihristte geçen (ör. ilgili yönetmelik/karar) — ikincil sinyal
    for bolum, kat, b in ent:
        if (bolum == "YASAMA BÖLÜMÜ") or (kat in ("KANUNLAR", "KANUN")):
            continue
        for k in _match(b, kws):
            print(f"OLAY:{k}:{kat or bolum or 'DIGER'}:{b}")
            olay = True
    print("KEYWORD-DURUM: " + ("EŞLEŞME VAR" if olay else "eşleşme yok"))


def cmd_kw(txt_path, kw_path):
    try:
        raw = open(txt_path, encoding='utf-8', errors='replace').read()
    except OSError as e:
        print(f"UYARI: metin okunamadı: {e}")
        return
    kws = _load_keywords(kw_path)
    hits = _match(raw, kws)
    for k in hits:
        print(f"OLAY:{k}")
    print("KEYWORD-DURUM: " + ("EŞLEŞME VAR" if hits else "eşleşme yok"))


def main():
    if len(sys.argv) < 2:
        print("kullanım: motor.py {normalize|rg|kw} ...", file=sys.stderr)
        sys.exit(0)
    cmd = sys.argv[1]
    if cmd == "normalize":
        raw = open(sys.argv[2], encoding='utf-8', errors='replace').read() if len(sys.argv) > 2 else sys.stdin.read()
        sys.stdout.write(normalize(raw) + "\n")
    elif cmd == "rg":
        cmd_rg(sys.argv[2], sys.argv[3])
    elif cmd == "kw":
        cmd_kw(sys.argv[2], sys.argv[3])
    else:
        print(f"bilinmeyen komut: {cmd}", file=sys.stderr)
    sys.exit(0)


if __name__ == "__main__":
    main()
