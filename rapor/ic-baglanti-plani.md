# İÇ BAĞLANTI DOKUSU PLANI (GEO zayıf noktası)
*ODUL-USTU FAZ 7 AŞAMA 1 · madde 9 · PLAN (link ekleme AŞAMA 2)*

**Sorun:** 130+ sayfa var ama çapraz bağ dokusu zayıf; GEO/otorite için
havza→rehber→vaka→persona zinciri örülmeli. Aşağıdaki tablo sayfa başına 2-4
bağ önerir. Linkler AŞAMA 2'de (kod) eklenir; burada plandır. Her bağ mevcut
gerçek sayfaya işaret eder (kırık öneri yok).

## 1. Havza sayfası → rehber (25 havza sayfası, kalıp)
Her havza sayfasının hukuki bloğuna 2-3 rehber bağı:
| Bağlam | Hedef rehber |
|---|---|
| Kapalı havza / tahsis kısıtı | /rehberler/su-tahsisinde-oncelik-sirasi/ |
| Yeraltı suyu işletme sahası ilanı olan havza | /rehberler/yeralti-suyu-isletme-sahasi/ |
| Kuyu yoğun havza | /rehberler/kuyu-ruhsati/ · /rehberler/ruhsatsiz-kuyu-cezalari/ |

## 2. Rehber → vaka + rehber (9 rehber)
| Rehber | Önerilen bağlar |
|---|---|
| kaynak-suyu-kiralama | → /vaka/meysu/ (canlı örnek) · → kuyu-ruhsati |
| kuyu-ruhsati | → ruhsatsiz-kuyu-cezalari · → kuyu-belgesi-iptal-davalari · → /kuyu-ruhsati/[il]/ |
| ruhsatsiz-kuyu-cezalari | → kuyu-belgesi-iptal-davalari · → kuyu-ruhsati |
| su-tahsisinde-oncelik | → yeralti-suyu-isletme-sahasi · → jeotermal-ruhsat |
| jeotermal-ruhsat | → su-tahsisinde-oncelik · → baraj-kamulastirma |
| baraj-kamulastirma | → kaynak-hakki-mecra-irtifaki |
| kaynak-hakki-mecra-irtifaki | → kuyu-ruhsati · → su-tahsisinde-oncelik |
| yeralti-suyu-isletme-sahasi | → kuyu-ruhsati · → ruhsatsiz-kuyu-cezalari |
| kuyu-belgesi-iptal-davalari | → ruhsatsiz-kuyu-cezalari · → kuyu-ruhsati |

## 3. Vaka → rehber (mevcut + gelecek)
| Vaka | Bağlar |
|---|---|
| meysu | → kaynak-suyu-kiralama · → su-tahsisinde-oncelik · persona: Gıda-içecek |

## 4. Persona (FAZ 7) → mevcut içerik
data/lead/persona.json `ilgiliIcerik` alanı bu eşlemenin veri kaynağıdır; her
persona sonuç sayfası 2-4 rehber/vaka bağı taşır (ör. Sondaj/arıtma →
kuyu-ruhsati + ruhsatsiz-kuyu-cezalari; Gıda-içecek → kaynak-suyu-kiralama +
/vaka/meysu/; Enerji HES/JES → jeotermal-ruhsat + baraj-kamulastirma).

## 5. Rehber/vaka/persona → Su Kanunu merkezi
Yükümlülük/son-tarih içeren her sayfa → /su-kanunu/ (taslak takibi) bağı;
Su Verimliliği Belgesi yükümlüsü personalar → gelecek "su verimliliği belgesi"
rehberi (FAZ 6, henüz yok — bağ o sayfa üretilince).

## 6. Ana/harita → derinlik
- /harita/ havza kartları → havza sayfaları (MEVCUT, canlı).
- Landing üç kapı → rehberler/havzalar/su-kanunu (MEVCUT).
- Öneri: landing'e "sektörünüz" girişi (FAZ 7 giriş sayfası) — rota onayına bağlı.

## Ölçüt (AŞAMA 2 bitti-tanımı)
Her içerik sayfası ≥2 giden bağ + ≥1 gelen bağ; kırık link 0; bağlar
gövdede anlamlı bağlamda (link çiftliği değil). Uygulama tek kaynaktan
(IlgiliRehberler bileşeni + persona.ilgiliIcerik) türetilir, elle liste değil.
