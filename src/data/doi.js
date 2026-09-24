// DOI AKTİVASYON KANCASI (Adım 3, 24.09.2026).
// Veri seti DOI'si HENÜZ ATANMADI (Zenodo deposu kullanıcı hesabı gerektirir).
// DOI alındığında yalnız aşağıdaki satır doldurulur ve build alınır; basın
// kiti, JSON-LD ve Zenodo metadata'sı bu tek kaynaktan beslenir.
// ATANMADAN DOI iddiası YAZILMAZ (uydurma yasağı).
export const DOI = null;

export const DOI_URL = DOI ? `https://doi.org/${DOI}` : null;
export const DOI_ATANDI = DOI != null;
