// Idiomas del sitio (español, inglés y portugués): rutas, preferencia, diccionarios y subtítulos. Uso: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import {
  IDIOMAS, idiomaDeRuta, sinIdioma, conIdioma, idiomaDelNavegador, destinoInicial, leerPreferencia, guardarPreferencia,
  traductor, localizar, enlacesAlternos, esRobot,
} from '../../src/i18n/idiomas.js'
import { AREAS, TEXTOS } from '../../src/i18n/textos/index.js'
import { PLATAFORMAS, listaPlataformas } from '../../src/lib/plataformas.js'
import { SUBTITULOS } from '../../src/lib/video.js'

const leer = (ruta) => readFileSync(new URL(ruta, import.meta.url), 'utf8')
const FUENTES = readdirSync(new URL('../../src/', import.meta.url), { recursive: true })
  .map((f) => String(f).replace(/\\/g, '/')).filter((f) => /\.jsx?$/.test(f))
  .map((f) => ({ f, texto: leer(`../../src/${f}`) }))

test('rutas: español sin prefijo, /en y /pt', () => {
  assert.equal(idiomaDeRuta('/'), 'es')
  assert.equal(idiomaDeRuta('/en'), 'en')
  assert.equal(idiomaDeRuta('/pt/modulos'), 'pt')
  assert.equal(idiomaDeRuta('/entrada'), 'es', 'un prefijo tiene que ser un segmento completo')
  assert.equal(sinIdioma('/en/evaluacion'), '/evaluacion')
  assert.equal(sinIdioma('/pt'), '/')
  assert.equal(conIdioma('/modulos', 'en'), '/en/modulos')
  assert.equal(conIdioma('/', 'pt'), '/pt')
  assert.equal(conIdioma('/#contacto', 'en'), '/en#contacto')
  assert.equal(conIdioma('/en/modulos', 'es'), '/modulos')
  assert.equal(conIdioma('/apis/inia-agromet', 'en'), '/apis/inia-agromet', '/apis solo existe en español')
  assert.equal(conIdioma('https://dsp.oladigital.cl', 'pt'), 'https://dsp.oladigital.cl')
})

test('primera visita: el idioma del navegador; después, la elección guardada; los buscadores no se redirigen', () => {
  assert.equal(idiomaDelNavegador(['pt-BR', 'en']), 'pt')
  assert.equal(idiomaDelNavegador(['es-MX', 'en']), 'es')
  assert.equal(idiomaDelNavegador(['fr-FR']), 'es')
  assert.equal(destinoInicial({ pathname: '/', preferencia: null, navegador: ['en-US'] }), 'en')
  assert.equal(destinoInicial({ pathname: '/', preferencia: 'es', navegador: ['en-US'] }), null, 'la elección manda')
  assert.equal(destinoInicial({ pathname: '/modulos', preferencia: 'pt', navegador: ['es'] }), 'pt')
  assert.equal(destinoInicial({ pathname: '/en/modulos', preferencia: 'pt', navegador: [] }), null, 'una URL con idioma se respeta')
  assert.equal(destinoInicial({ pathname: '/', preferencia: null, navegador: ['en-US'], robot: true }), null)
  assert.ok(esRobot('Mozilla/5.0 (compatible; Googlebot/2.1)'))
})

test('la preferencia se guarda sin romper si localStorage falla', () => {
  const memoria = new Map()
  const almacen = { getItem: (k) => memoria.get(k) ?? null, setItem: (k, v) => memoria.set(k, v) }
  guardarPreferencia('pt', almacen)
  assert.equal(leerPreferencia(almacen), 'pt')
  const roto = { getItem() { throw new Error('bloqueado') }, setItem() { throw new Error('bloqueado') } }
  assert.equal(leerPreferencia(roto), null)
  assert.doesNotThrow(() => guardarPreferencia('en', roto))
})

test('hreflang y canonical para cada idioma, con x-default en español', () => {
  const { canonical, alternos } = enlacesAlternos('/en/modulos')
  assert.equal(canonical, 'https://www.agrohubs.cl/en/modulos')
  assert.deepEqual(alternos.map((a) => [a.hreflang, a.href]), [
    ['es', 'https://www.agrohubs.cl/modulos'], ['en', 'https://www.agrohubs.cl/en/modulos'],
    ['pt', 'https://www.agrohubs.cl/pt/modulos'], ['x-default', 'https://www.agrohubs.cl/modulos'],
  ])
})

test('traductor: interpola, hace plurales y cae al español', () => {
  const t = traductor({ 'a': 'Hola {n}', 'x.uno': '{n} cosa', 'x.otros': '{n} cosas' }, { 'b': 'base' })
  assert.equal(t('a', { n: 2 }), 'Hola 2')
  assert.equal(t.plural('x', 1), '1 cosa')
  assert.equal(t.plural('x', 3), '3 cosas')
  assert.equal(t('b'), 'base')
  assert.equal(t('nada'), 'nada')
  assert.deepEqual(localizar({ a: 'uno', l: ['x', 'y'], o: { k: 'v' }, n: 3 }, { a: 'one', l: ['ex'] }), { a: 'one', l: ['ex', 'y'], o: { k: 'v' }, n: 3 })
})

test('cada área del diccionario tiene las mismas claves en español, inglés y portugués', () => {
  for (const [nombre, area] of Object.entries(AREAS)) {
    const es = Object.keys(area.es).sort()
    assert.ok(es.length > 0, `${nombre} está vacía`)
    for (const i of ['en', 'pt']) {
      const otras = Object.keys(area[i]).sort()
      assert.deepEqual(otras.filter((k) => !es.includes(k)), [], `${nombre}.${i}: claves que no existen en español`)
      assert.deepEqual(es.filter((k) => !otras.includes(k)), [], `${nombre}.${i}: faltan claves`)
    }
  }
})

test('toda clave literal usada con t() existe en el diccionario', () => {
  const faltan = []
  // src/i18n tiene ejemplos en sus comentarios: no cuentan
  for (const { f, texto } of FUENTES.filter((x) => !x.f.startsWith('i18n/'))) {
    for (const m of texto.matchAll(/\bt\(\s*["'`]([a-zA-Z][\w.]+)["'`]/g)) {
      if (!(m[1] in TEXTOS.es)) faltan.push(`${f}: ${m[1]}`)
    }
    for (const m of texto.matchAll(/\bt\.plural\(\s*["'`]([a-zA-Z][\w.]+)["'`]/g)) {
      if (!(`${m[1]}.uno` in TEXTOS.es && `${m[1]}.otros` in TEXTOS.es)) faltan.push(`${f}: ${m[1]} (plural)`)
    }
  }
  assert.deepEqual(faltan, [])
})

test('los textos nuevos no usan rayas largas ni datos de ejemplo de un solo país', () => {
  const comun = JSON.stringify(AREAS.comun)
  assert.ok(!/—/.test(comun), 'sin rayas largas')
  assert.ok(!/\+56/.test(comun), 'sin teléfonos chilenos de ejemplo')
  assert.ok(!/@empresa\.cl/.test(comun), 'sin correos .cl de ejemplo')
})

test('las plataformas de la app se escriben en un solo lugar', () => {
  assert.deepEqual(PLATAFORMAS, ['iOS', 'Android'])
  assert.equal(listaPlataformas('y'), 'iOS y Android')
  assert.equal(listaPlataformas('and'), 'iOS and Android')
  for (const i of IDIOMAS) {
    assert.match(TEXTOS[i]['pasos.3.bajada'], /\{plataformas\}/, `pasos.3.bajada (${i}) usa la constante`)
    assert.match(TEXTOS[i]['marca.texto'], /\{plataformas\}/, `marca.texto (${i}) usa la constante`)
  }
  for (const i of IDIOMAS) assert.match(TEXTOS[i]['mod.indice.bajada'], /\{plataformas\}/, `mod.indice.bajada (${i}) usa la constante`)
})

test('subtítulos WebVTT: los tres idiomas, mismos cortes y tiempos que avanzan dentro del video', () => {
  const tiempo = (s) => { const [h, m, r] = s.split(':'); return +h * 3600 + +m * 60 + +r }
  for (const [video, idiomas] of Object.entries(SUBTITULOS)) {
    assert.deepEqual(idiomas, ['es', 'en', 'pt'])
    const cortes = idiomas.map((i) => {
      const vtt = leer(`../../public/videos/${video}.${i}.vtt`)
      assert.match(vtt, /^WEBVTT/, `${video}.${i}.vtt`)
      return [...vtt.matchAll(/(\d\d:\d\d:\d\d\.\d{3}) --> (\d\d:\d\d:\d\d\.\d{3})/g)].map((m) => [tiempo(m[1]), tiempo(m[2])])
    })
    for (const c of cortes) {
      assert.deepEqual(c, cortes[0], 'mismos tiempos en los tres idiomas')
      let fin = 0
      for (const [a, b] of c) { assert.ok(a >= fin && b > a, 'los cortes avanzan y no se pisan'); fin = b }
      assert.ok(fin <= 77.1, 'terminan dentro del video (1:17)')
    }
  }
})

test('Políticas y licencias: ruta en los tres idiomas, diez puntos, titular AgroHubs SpA y enlace en el pie', () => {
  const app = leer('../../src/App.jsx')
  assert.ok(app.includes("p('/licencias')"))
  for (const i of IDIOMAS) {
    for (let n = 1; n <= 10; n++) assert.ok(TEXTOS[i][`lic.${n}.titulo`] && TEXTOS[i][`lic.${n}.texto`], `lic.${n} (${i})`)
    assert.match(TEXTOS[i]['lic.titular'], /AgroHubs SpA/)
  }
  assert.ok(!/\$|USD|CLP|precio|price|preço/i.test(JSON.stringify(AREAS.licencias)), 'sin precios')
  assert.match(leer('../../src/components/Footer.jsx'), /to="\/licencias"/)
})

test('capturas reales: cada archivo del manifiesto existe, pesa poco y tiene alt en los tres idiomas', async () => {
  const { statSync } = await import('node:fs')
  const lista = JSON.parse(leer('../../src/lib/capturas.json'))
  assert.ok(lista.length >= 8)
  for (const c of lista) {
    const ruta = new URL(`../../public/capturas/${c.archivo}`, import.meta.url)
    assert.ok(statSync(ruta).size < 300 * 1024, `${c.archivo} pesa demasiado`)
    for (const i of IDIOMAS) assert.ok(c.alt?.[i], `${c.archivo}: alt ${i}`)
  }
})

test('la idea principal va bajo el H1 y como descripción de la portada, sin repetirse en la franja del equipo', () => {
  for (const i of IDIOMAS) {
    assert.equal(TEXTOS[i]['meta.descripcion'], TEXTOS[i]['hero.bajada'], `meta.descripcion = hero.bajada (${i})`)
    assert.ok(TEXTOS[i]['meta.descripcion'].length <= 155, `meta.descripcion corta (${i})`)
    assert.notEqual(TEXTOS[i]['pasos.equipo'], TEXTOS[i]['hero.bajada'])
  }
  assert.match(TEXTOS.es['hero.bajada'], /optimicen sus recursos/)
  assert.match(leer('../../index.html'), /Acompañamos a los agricultores/)
})
