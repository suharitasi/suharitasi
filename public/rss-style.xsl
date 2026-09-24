<?xml version="1.0" encoding="UTF-8"?>
<!-- RSS OKUNUR GÖRÜNÜM (Adım 5, 24.09.2026). Tarayıcı bir .xml akışına
     gidince ham kod yerine bu şablon uygulanır. Tasarım anayasası: radius 0,
     1px keskin çizgi, serif başlık, mono künye. Harici kaynak/script YOK.
     Okuyucular (Feedly vb.) bu şablonu yok sayar; yalnız tarayıcı görünümü. -->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  exclude-result-prefixes="atom">
  <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat"/>

  <xsl:template match="/rss/channel">
    <html lang="tr">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex, follow"/>
        <title><xsl:value-of select="title"/></title>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; background: #E9F0F4; color: #132A3F;
                 font-family: Georgia, "Times New Roman", serif; line-height: 1.6; }
          .bar { border-bottom: 1px solid #0C5A7C; background: #0C5A7C; color: #fff; }
          .bar span { display: block; max-width: 46rem; margin: 0 auto;
                      padding: 0.5rem 1.25rem; font-family: ui-monospace, monospace;
                      font-size: 0.7rem; letter-spacing: 0.16em; text-transform: uppercase; }
          main { max-width: 46rem; margin: 0 auto; padding: 2.2rem 1.25rem 3rem; }
          h1 { font-size: clamp(1.5rem, 4vw, 2rem); margin: 0 0 0.4rem; border-bottom: 1px solid #0C5A7C; padding-bottom: 0.5rem; }
          .aciklama { margin: 0.8rem 0 0.4rem; color: #48627A; }
          .kaynak { margin: 0 0 1.6rem; font-family: ui-monospace, monospace; font-size: 0.72rem; }
          .kaynak a { color: #0C5A7C; text-decoration: none; border-bottom: 1px solid currentColor; }
          .liste { list-style: none; margin: 0; padding: 0; }
          .kayit { border: 1px solid #A9C2D2; border-left: 3px solid #0C5A7C; background: #fff; padding: 0.9rem 1rem; margin-bottom: 0.6rem; }
          .kayit h2 { margin: 0; font-size: 1.05rem; }
          .kayit h2 a { color: #0C5A7C; text-decoration: none; }
          .kayit h2 a:hover { text-decoration: underline; }
          .tarih { margin: 0.3rem 0 0.4rem; font-family: ui-monospace, monospace; font-size: 0.68rem; color: #48627A; }
          .ozet { margin: 0; font-size: 0.9rem; color: #132A3F; }
          .bos { border: 1px solid #C0883A; background: #fff; padding: 0.9rem 1rem; }
          footer { max-width: 46rem; margin: 0 auto; padding: 0 1.25rem 2.5rem;
                   font-family: ui-monospace, monospace; font-size: 0.68rem; color: #48627A; }
        </style>
      </head>
      <body>
        <div class="bar"><span>Su Haritası · Su İstihbarat Bülteni</span></div>
        <main>
          <h1><xsl:value-of select="title"/></h1>
          <p class="aciklama"><xsl:value-of select="description"/></p>
          <p class="kaynak">
            <a href="{link}">Siteye git</a> ·
            <a href="/istihbarat/">İstihbarat merkezi</a> ·
            <a href="{atom:link/@href}">Akışı bir okuyucuya ekle</a>
          </p>
          <xsl:choose>
            <xsl:when test="item">
              <ol class="liste">
                <xsl:apply-templates select="item"/>
              </ol>
            </xsl:when>
            <xsl:otherwise>
              <p class="bos">Bu akışta henüz kayıt yok. Yeni Resmî Gazete veya mevzuat kaydı eklendiğinde burada görünür.</p>
            </xsl:otherwise>
          </xsl:choose>
        </main>
        <footer>
          Bu sayfa bir RSS akışının okunur görünümüdür; bir RSS okuyucusuna
          eklemek için "Akışı bir okuyucuya ekle" bağlantısını kullanın.
        </footer>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="item">
    <li class="kayit">
      <h2><a href="{link}"><xsl:value-of select="title"/></a></h2>
      <p class="tarih"><xsl:value-of select="pubDate"/></p>
      <p class="ozet"><xsl:value-of select="description"/></p>
    </li>
  </xsl:template>
</xsl:stylesheet>
