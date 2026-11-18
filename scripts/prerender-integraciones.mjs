// HTML previo de las páginas de integraciones, para buscadores y motores de IA que no ejecutan JavaScript.
// Corre después de `vite build` (npm run build): toma dist/index.html y escribe dist/integraciones.html y
// dist/integraciones/<slug>.html con su <title>, meta description, canonical, hreflang, Open Graph, el JSON-LD
// y el contenido de la página en español dentro de #root. Al cargar, React reemplaza ese contenido por la
// misma página (src/pages/IntegracionesIndice.jsx e IntegracionPagina.jsx), ya con el menú y el pie.
// Vercel sirve /integraciones/<slug> desde <slug>.html (cleanUrls), antes que el rewrite de la SPA.
// Solo español: /en y /pt quedan en la SPA (sin crear carpetas dist/en ni dist/pt).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { INTEGRACIONES, GRUPOS } from '../src/lib/integraciones.js'
import { seoIndice, seoIntegracion, ldTexto } from '../src/lib/integraciones-seo.js'
import { TEXTOS } from '../src/i18n/textos/index.js'
import { traductor, enlacesAlternos } from '../src/i18n/idiomas.js'

const DIST = fileURLToPath(new URL('../dist/', import.meta.url))
const PLANTILLA = readFileSync(join(DIST, 'index.html'), 'utf8')
const t = traductor(TEXTOS.es)
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const mayuscula = (s) => s.charAt(0).toUpperCase() + s.slice(1)

function pagina(ruta, seo, cuerpo) {
  const { canonical, alternos } = enlacesAlternos(ruta)
  const cabeza = [
    `<link rel="canonical" href="${esc(canonical)}" />`,
    ...alternos.map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${esc(a.href)}" data-ah="" />`),
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="AgroHubs" />`,
    `<meta property="og:title" content="${esc(seo.titulo)}" />`,
    `<meta property="og:description" content="${esc(seo.descripcion)}" />`,
    `<meta property="og:url" content="${esc(seo.url)}" />`,
    `<meta property="og:locale" content="es" />`,
  ].join('\n    ')
  const html = PLANTILLA
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(seo.titulo)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(seo.descripcion)}" />\n    ${cabeza}`)
    .replace('<div id="root"></div>', `<div id="root"><main class="flex-1" id="main">${cuerpo}<script type="application/ld+json">${ldTexto(seo.ld)}</script></main></div>`)
  if (html === PLANTILLA || !html.includes(seo.titulo.slice(0, 10))) throw new Error(`No se pudo armar ${ruta}`)
  return html
}

const tarjeta = (i) => `<li class="ah-intg-tarjeta"><h3 class="ah-intg-tarjeta__nombre"><a class="ah-intg-tarjeta__enlace" href="/integraciones/${i.slug}">${esc(i.nombre)}</a></h3>`
  + `<p class="ah-intg-tarjeta__tema">${esc(mayuscula(i.tema))}</p><p class="ah-intg-tarjeta__pie"><span class="ah-intg-tarjeta__org">${esc(i.organizacion)}</span>`
  + `<span class="ah-intg-estado ah-intg-estado--${i.estado}">${esc(t(`intg.estado.${i.estado}`))}</span></p></li>`

const cierre = (titulo) => `<section class="ah-banda"><div class="container ah-banda__grid"><h2 class="ah-banda__frase">${esc(titulo)}</h2>`
  + `<p class="ah-lic__cta-texto">${esc(t('intg.cta.texto'))}</p><a class="ah-btn ah-btn--invertido" href="/#contacto">${esc(t('cta.demo'))}</a></div></section>`

// Índice
{
  const seo = seoIndice(INTEGRACIONES, 'es', t)
  const grupos = GRUPOS.map((g) => `<section id="grupo-${g}" class="ah-intg-grupo"><div class="container"><div class="ah-intg-grupo__cabeza">`
    + `<h2 class="ah-intg-grupo__titulo">${esc(t(`intg.grupo.${g}`))}</h2><p class="ah-intg-grupo__bajada">${esc(t(`intg.grupo.${g}.bajada`))}</p></div>`
    + `<ul class="ah-intg-lista">${INTEGRACIONES.filter((i) => i.grupo === g).map(tarjeta).join('')}</ul></div></section>`).join('')
  const cuerpo = `<div><section class="ah-lic-cabeza"><div class="container"><h1 class="ah-display">${esc(t('intg.indice.titulo'))}</h1>`
    + `<p class="ah-lead ah-intg__bajada">${esc(t('intg.indice.bajada'))}</p></div></section>${grupos}`
    + `<div class="container ah-intg-directorio"><p>${esc(t('intg.indice.directorio'))}</p><a class="ah-enlace-plano" href="/apis" hreflang="es">${esc(t('integ.ver'))}</a></div>`
    + `${cierre(t('intg.cta.indice'))}</div>`
  writeFileSync(join(DIST, 'integraciones.html'), pagina('/integraciones', seo, cuerpo))
}

// Una página por integración
mkdirSync(join(DIST, 'integraciones'), { recursive: true })
for (const i of INTEGRACIONES) {
  const seo = seoIntegracion(i, 'es', t)
  const lista = (xs) => `<ul class="ah-checks">${xs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`
  const oficial = (clase) => `<a class="${clase}" href="${esc(i.enlace)}" target="_blank" rel="noopener noreferrer">${esc(t(i.tipoEnlace === 'sitio' ? 'intg.pagina.sitio' : 'intg.pagina.documentacion'))}</a>`
  const otras = INTEGRACIONES.filter((x) => x.grupo === i.grupo && x.slug !== i.slug)
  const cuerpo = `<article><header class="ah-lic-cabeza ah-intg-cabeza"><div class="container">`
    + `<p class="ah-intg-migas"><a class="ah-intg-migas__enlace" href="/integraciones">${esc(t('intg.migas'))}</a></p>`
    + `<h1 class="ah-display ah-intg__h1">${esc(seo.h1)}</h1><p class="ah-lead ah-intg__bajada">${esc(i.resumen)}</p>`
    + `<p class="ah-intg-cabeza__estado"><span class="ah-intg-estado ah-intg-estado--${i.estado}">${esc(t(`intg.estado.${i.estado}`))}</span></p>`
    + `<div class="ah-acciones"><a class="ah-btn" href="/#contacto">${esc(t('cta.demo'))}</a>${oficial('ah-btn ah-btn--quieto')}</div></div></header>`
    + `<div class="container ah-intg"><div class="ah-intg__cuerpo">`
    + `<section><h2 class="ah-intg__h2">${esc(t('intg.pagina.datos'))}</h2>${lista(i.datos)}</section>`
    + `<section><h2 class="ah-intg__h2">${esc(t('intg.pagina.usos'))}</h2>${lista(i.usos)}</section>`
    + `<section><h2 class="ah-intg__h2">${esc(t('intg.pagina.como'))}</h2><p class="ah-intg__texto">${esc(i.como)}</p>`
    + `${i.estado === 'cuenta' ? `<p class="ah-intg__texto ah-intg__credencial">${esc(t('intg.credencial'))}</p>` : ''}</section></div>`
    + `<aside class="ah-intg-ficha"><h2 class="ah-intg-ficha__titulo">${esc(t('intg.pagina.ficha'))}</h2><dl class="ah-intg-ficha__lista">`
    + `<div><dt>${esc(t('intg.pagina.organizacion'))}</dt><dd>${esc(i.organizacion)}</dd></div>`
    + `${i.cobertura ? `<div><dt>${esc(t('intg.pagina.cobertura'))}</dt><dd>${esc(i.cobertura)}</dd></div>` : ''}`
    + `<div><dt>${esc(t('intg.pagina.grupo'))}</dt><dd>${esc(t(`intg.grupo.${i.grupo}`))}</dd></div>`
    + `<div><dt>${esc(t('intg.pagina.estado'))}</dt><dd>${esc(t(`intg.estado.${i.estado}`))}</dd></div></dl>${oficial('ah-enlace-plano')}</aside></div>`
    + `${otras.length ? `<section class="ah-bloque ah-bloque--tinte"><div class="container"><h2 class="ah-intg__h2">${esc(t('intg.pagina.otras', { grupo: t(`intg.grupo.${i.grupo}`) }))}</h2>`
      + `<ul class="ah-intg-lista">${otras.map(tarjeta).join('')}</ul><p class="ah-intg-todas"><a class="ah-enlace-plano" href="/integraciones">${esc(t('intg.pagina.todas'))}</a></p></div></section>` : ''}`
    + `${cierre(t('intg.cta.titulo', { nombre: i.nombre }))}</article>`
  writeFileSync(join(DIST, 'integraciones', `${i.slug}.html`), pagina(`/integraciones/${i.slug}`, seo, cuerpo))
}

console.log(`✓ HTML previo de /integraciones y ${INTEGRACIONES.length} páginas de integración`)
