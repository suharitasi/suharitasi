// DOI AKTİVASYON KANCASI (Adım 3, 24.09.2026).
// 04.10.2026 — DOI ATANDI VE DOĞRULANDI: Zenodo kaydı 27.09.2026'da
// yayımlandı (kaynaktan çözüldü: https://doi.org/10.5281/zenodo.23002678 →
// https://zenodo.org/records/23002678, başlık "suharitasi/suharitasi v1.0.0").
// Basın kiti, JSON-LD ve Zenodo metadata'sı bu tek kaynaktan beslenir.
// UYDURMA YASAĞI: yalnız GERÇEKTEN çözülen DOI yazılır.
export const DOI = '10.5281/zenodo.23002678';

export const DOI_URL = DOI ? `https://doi.org/${DOI}` : null;
export const DOI_ATANDI = DOI != null;
