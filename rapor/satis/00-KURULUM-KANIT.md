# 00 — FAZ 1 kurulum kanıtı + güvenlik kapısı (satis briefi, 2026-07-28)

## Ön kapı
Brief denetçisi: ilk koşu 1 ENGEL (T5 DUR kapısı) + 6 UYARI → ekleme-yalnız
düzeltmeyle **ENGEL 0, 4 UYARI** (kalanlar üretim-çıktısı yanlış pozitifi).
Düşman geçişi: D2'nin "Claude Code görüyor" testi oturum-içi sınırıyla
tanımlandı; aşağıda beklenenden güçlü kanıtla kapandı.

## Kurulum [VERİ]
Hedef dizin: `~/.claude/skills/` (Claude Code kullanıcı-kapsamı skill
dizini). `npx skills` KULLANILMADI (brief'in uyardığı `.agents/skills`
tuzağına girilmedi); klonlardan doğrudan kopya.

| Depo | Getirdiği skill | Kurulum |
|---|---|---|
| coreyhaines31/marketingskills (428 dosya) | **49 skill** (ab-testing … video) | 49/49 kopyalandı |
| avectats7/copy-that-sells (51 dosya) | **1 skill** (copy-that-sells + references/templates/cookbook/scripts) | 1/1 |
| robpalmer99/claude-code-copywriting-skills (9 dosya) | **5 skill** (ad-copy, compliance-checker, copychief, direct-response-copy, landing-page-copy) | 5/5 |

Toplam **55 skill**; `SKILL.md` eksik olan **0/55** (ölçüldü).

## "Claude Code görüyor" doğrulaması [VERİ]
Kurulumdan hemen sonra harness, oturumun kullanılabilir-skill listesini
YENİDEN YÜKLEDİ ve 55 skill açıklamalarıyla listede belirdi (ab-testing,
ad-copy, … copy-that-sells, copychief, direct-response-copy …). Bu,
"dosya doğru dizinde" kanıtından güçlüdür: Claude Code'un kendisi listeledi.

## İsim çakışmaları [VERİ]
1. **Oturumda önceden görünen plugin skill'leriyle çakışan adlar:**
   `content-strategy`, `cro`, `marketing-council`, `site-architecture`
   (aynı Corey Haines ailesinin plugin kopyaları). Aynı içerik ailesi —
   davranış riski düşük, ama iki kaynaktan aynı ad listelenebilir.
2. **GERÇEK çakışma — `seo-audit`:** projede zaten `seo-audit` adlı,
   İŞLEVİ FARKLI bir skill var ("dist/ üzerinde SEO denetimi — salt-okunur
   tespit"). marketingskills'in `seo-audit`'i genel SEO denetim skill'i.
   Aynı adla iki farklı araç → karışma riski. Öneri (uygulanmadı): proje
   skill'i öncelikli kalmalı; gerekirse kullanıcı marketingskills
   kopyasını `~/.claude/skills/seo-audit`ten kaldırır ya da yeniden adlandırır.
3. `schema` (marketingskills) ↔ `geo-schema` (plugin): ad farklı, işlev
   yakın — çakışma değil, bilgi notu.

## Güvenlik kapısı [VERİ]
55 SKILL.md + eşlik eden dosyalar tehlikeli talimat kalıpları için tarandı
(ağ isteği, kimlik/anahtar okuma, dosya silme, dış servise veri gönderme):
- Zararlı talimat: **bulunamadı.** İsabetler zararsızdı: `directory-submissions`
  ve `image` kendi siteni curl'lama örnekleri; `video`/`image` "API anahtarın
  var mı?" SORUSU (anahtar okuma talimatı değil); `attribution` webhook
  mimarisi ANLATIMI.
- Çalıştırılabilir dosyalar: yalnız `copy-that-sells/scripts/validate.py`
  ve `tests/run-tests.py`. İkisi de okundu: import seti re/sys/argparse/
  pathlib — **ağ yok, subprocess yok, yalnız yerel referans dosyası okur.**
  Bu nedenle validate.py denetimde backstop olarak KOŞULDU (rapor 02).
- Skill talimatlarından uygulanması REDDEDİLEN oldu mu: hayır — hiçbir
  skill site kodu değişikliği/silme/dış gönderim istemedi. (Skill'lerin
  "canlı sayfayı fetch et" türü araştırma önerileri zaten briefin izin
  verdiği curl çekimiyle karşılandı.)

## Girdi kanıtı [VERİ]
- 6 sayfanın canlı HTML'i: `cikti/denetim/satis/html/` (tümü HTTP 200).
- 12 kare (1440+375 × 6 sayfa): `cikti/denetim/satis/` — mevcut
  `arac/pazarlama-kare.mjs` ile; worktree kopyasında YALNIZ `SAYFALAR`
  dizisi ve `CIKTI` yolu güncellendi (düzeltilmiş brief eki uyarınca;
  ana depodaki araç değişmedi). Konsol 6 sayfada 0.

## Sınırlar (dürüstlük)
- Denetimler davranış verisi OLMADAN yapıldı (analytics yok) — üç rapor da
  bunu kendi diliyle not eder.
- Kurulan 55 skill KALICIDIR (`~/.claude/skills` worktree dışıdır);
  kaldırma kararı kullanıcıya aittir. Kaldırma tek komut:
  bu üç deponun getirdiği dizinleri silmek.
