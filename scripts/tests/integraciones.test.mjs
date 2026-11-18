// Integraciones con fuentes externas (src/lib/integraciones.js): lista verificada, estados, textos en tres
// idiomas, páginas /integraciones/<slug>, JSON-LD, llms.txt, sitemap y HTML previo. Uso: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { INTEGRACIONES, GRUPOS, ESTADOS_INTEGRACION } from '../../src/lib/integraciones.js'
import { seoIntegracion, seoIndice, ldTexto } from '../../src/lib/integraciones-seo.js'
import TRAD from '../../src/i18n/datos/integraciones.js'
import { TEXTOS } from '../../src/i18n/textos/index.js'
import { traductor, localizar } from '../../src/i18n/idiomas.js'

const leer = (ruta) => readFileSync(new URL(`../../${ruta}`, import.meta.url), 'utf8')
const IDIOMAS = ['es', 'en', 'pt']
const trad = (i, idioma) => (idioma === 'es' ? i : localizar(i, TRAD[idioma][i.slug]))

// Las que funcionan sin clave o ya están en AgroHubs; el resto se activa con la credencial del proveedor
const DISPONIBLES = ['agrometeorologia-inia', 'ceaza-met', 'odepa-precios', 'ide-minagri', 'arclim', 'datos-gob-cl', 'open-meteo',
  'nasa-power', 'earth-search', 'soilgrids', 'fao-wapor']

test('la lista verificada: 28 fuentes en cuatro grupos, Chile primero y partiendo por Agrometeorología y CEAZA-Met', () => {
  assert.equal(INTEGRACIONES.length, 28)
  assert.deepEqual(GRUPOS, ['chile', 'clima', 'satelite', 'estaciones'])
  assert.deepEqual(INTEGRACIONES.slice(0, 2).map((i) => i.slug), ['agrometeorologia-inia', 'ceaza-met'])
  const slugs = INTEGRACIONES.map((i) => i.slug)
  assert.equal(new Set(slugs).size, slugs.length, 'sin slugs repetidos')
  // Los grupos van seguidos y en el orden de GRUPOS
  const orden = INTEGRACIONES.map((i) => GRUPOS.indexOf(i.grupo))
  assert.ok(orden.every((g, k) => g >= 0 && (k === 0 || g >= orden[k - 1])), 'grupos en orden')
  assert.deepEqual(GRUPOS.map((g) => INTEGRACIONES.filter((i) => i.grupo === g).length), [11, 8, 7, 2])
})

test('estados: «Disponible» o «Disponible con cuenta del proveedor», y la línea de la credencial solo donde se pide', () => {
  for (const i of INTEGRACIONES) assert.ok(ESTADOS_INTEGRACION.includes(i.estado), `${i.slug}: estado`)
  assert.deepEqual(INTEGRACIONES.filter((i) => i.estado === 'disponible').map((i) => i.slug).sort(), [...DISPONIBLES].sort())
  assert.equal(TEXTOS.es['intg.estado.disponible'], 'Disponible')
  assert.equal(TEXTOS.es['intg.estado.cuenta'], 'Disponible con cuenta del proveedor')
  assert.equal(TEXTOS.es['intg.credencial'], 'Se activa desde el panel de AgroHubs con la credencial del proveedor.')
  const pagina = leer('src/pages/IntegracionPagina.jsx')
  assert.ok(pagina.includes('{i.estado === "cuenta" && <p className="ah-intg__texto ah-intg__credencial">{t("intg.credencial")}</p>}'))
})

test('cada fuente trae lo que pide su página: datos, usos, cómo se conecta, enlace oficial y resumen corto', () => {
  for (const i of INTEGRACIONES) {
    for (const k of ['nombre', 'organizacion', 'tema', 'resumen', 'como']) assert.ok(i[k]?.trim(), `${i.slug}: ${k}`)
    assert.ok(i.datos.length > 0 && i.usos.length > 0, `${i.slug}: datos y usos`)
    assert.match(i.enlace, /^https:\/\/[^/]+/, `${i.slug}: enlace oficial con https`)
    assert.ok(['documentacion', 'sitio'].includes(i.tipoEnlace), `${i.slug}: tipo de enlace`)
    assert.ok(i.resumen.length <= 155, `${i.slug}: resumen de ${i.resumen.length} caracteres (meta description)`)
  }
})

test('sin promesas que la documentación no respalda: INIA no es una API pública, SoilGrids no es REST, sin precios', () => {
  const inia = INTEGRACIONES[0]
  for (const idioma of IDIOMAS) {
    const texto = JSON.stringify(trad(inia, idioma))
    assert.ok(!/API p[uú]blica|public API|\bAPI\b/i.test(texto), `INIA (${idioma}) no se presenta como API`)
    assert.match(texto, /agrometeorologia\.cl/)
    assert.match(texto, /486/)
  }
  for (const idioma of IDIOMAS) assert.ok(!/REST/.test(JSON.stringify(trad(INTEGRACIONES.find((i) => i.slug === 'soilgrids'), idioma))), `SoilGrids (${idioma})`)
  const textos = JSON.stringify([INTEGRACIONES.map(({ enlace, ...x }) => x), TRAD]) + JSON.stringify(Object.fromEntries(IDIOMAS.map((i) => [i, Object.entries(TEXTOS[i]).filter(([k]) => k.startsWith('intg.'))])))
  assert.ok(!/US\$|USD|\$\s?\d|gratis|\bfree\b|grátis|plan pago|paid plan/i.test(textos), 'sin precios de los proveedores')
  assert.ok(!/—|–/.test(textos), 'sin rayas largas en las integraciones')
})

test('traducción completa al inglés y al portugués, con arreglos del mismo largo', () => {
  for (const idioma of ['en', 'pt']) {
    assert.deepEqual(Object.keys(TRAD[idioma]).sort(), INTEGRACIONES.map((i) => i.slug).sort(), `${idioma}: una entrada por integración`)
    for (const i of INTEGRACIONES) {
      const t = TRAD[idioma][i.slug]
      for (const k of ['tema', 'resumen', 'como']) assert.ok(t[k]?.trim(), `${idioma} ${i.slug}: ${k}`)
      for (const k of ['resumen', 'como']) assert.notEqual(t[k], i[k], `${idioma} ${i.slug}: ${k} sin traducir`)
      for (const k of ['datos', 'usos']) assert.equal(t[k]?.length, i[k].length, `${idioma} ${i.slug}: ${k} del mismo largo`)
      if (i.cobertura) assert.ok(t.cobertura?.trim(), `${idioma} ${i.slug}: cobertura`)
      assert.ok(t.resumen.length <= 160, `${idioma} ${i.slug}: resumen de ${t.resumen.length} caracteres`)
      for (const k of Object.keys(t)) assert.ok(k in i, `${idioma} ${i.slug}: ${k} no existe en español`)
    }
  }
})

test('página de cada integración: título, descripción, h1 y JSON-LD con WebPage, migas y Dataset', () => {
  for (const idioma of IDIOMAS) {
    const t = traductor(TEXTOS[idioma], TEXTOS.es)
    for (const i of INTEGRACIONES.map((x) => trad(x, idioma))) {
      const seo = seoIntegracion(i, idioma, t)
      assert.ok(seo.titulo.startsWith(i.nombre) && seo.titulo.includes(i.tema), `${idioma} ${i.slug}: título`)
      assert.equal(seo.descripcion, i.resumen)
      assert.equal(seo.url, `https://www.agrohubs.cl${idioma === 'es' ? '' : `/${idioma}`}/integraciones/${i.slug}`)
      const tipos = seo.ld['@graph'].map((n) => n['@type'])
      assert.deepEqual(tipos, ['WebPage', 'BreadcrumbList', 'Dataset'])
      const dataset = seo.ld['@graph'][2]
      assert.equal(dataset.url, i.enlace)
      assert.deepEqual(dataset.variableMeasured, i.datos)
      assert.ok(!ldTexto(seo.ld).includes('<'), 'JSON-LD sin "<"')
    }
    const indice = seoIndice(INTEGRACIONES, idioma, t)
    assert.equal(indice.ld['@graph'][0].mainEntity.numberOfItems, 28)
    assert.match(indice.titulo, /28/)
  }
})

test('rutas en los tres idiomas, el menú y el pie, llms.txt, sitemap y HTML previo en el build', () => {
  const app = leer('src/App.jsx')
  assert.ok(app.includes("p('/integraciones')") && app.includes("p('/integraciones/:slug')"))
  assert.ok(app.includes('data-meta-titulo') && app.includes('metaDescripcion'), 'la cabecera usa el título y la descripción de la página')
  assert.ok(leer('src/components/Navbar.jsx').includes("to: '/integraciones'"))
  assert.ok(leer('src/components/Footer.jsx').includes('to="/integraciones"'))
  const build = leer('scripts/build-apis.mjs')
  assert.ok(build.includes('integracionesLlms') && build.includes('INTEGRACIONES.map(integracionMd)'), 'llms.txt y llms-full.txt')
  assert.ok(build.includes("'/integraciones', ...INTEGRACIONES.map((i) => `/integraciones/${i.slug}`)"), 'sitemap')
  assert.match(JSON.parse(leer('package.json')).scripts.build, /vite build && node scripts\/prerender-integraciones\.mjs$/)
  // El HTML previo no crea dist/en ni dist/pt: esas rutas siguen en la SPA
  const pre = leer('scripts/prerender-integraciones.mjs')
  assert.ok(!/join\(DIST, '(en|pt)'/.test(pre))
  // La sección de la portada enlaza cada integración a su página
  assert.ok(leer('src/components/Integraciones.jsx').includes('to={`/integraciones/${i.slug}`}'))
})
