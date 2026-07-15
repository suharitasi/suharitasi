// Su Kanunu bülteni — bağlantı noktası.
//
// Buttondown hesabı açıldığında kullanıcı adını AŞAĞIYA yaz; form o anda
// /su-kanunu/ ve /su-kanunu/taslak-takibi/ sayfalarında canlanır.
// Kurulum adımları: README-BULTEN.md
//
// BOŞ bırakıldığı sürece form HİÇBİR sayfada render EDİLMEZ. Bu bilinçli:
// e-posta toplayıp hiçbir yere göndermeyen bir form, hukuk portalında
// sessiz başarısızlıktır — kullanıcıya söz verip sözü tutmamaktır.
export const BUTTONDOWN_KULLANICI = '';

export const BULTEN_AKTIF = BUTTONDOWN_KULLANICI.length > 0;
