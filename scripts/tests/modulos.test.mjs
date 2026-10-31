// Páginas de los módulos en español, inglés y portugués. Uso: npm test
// Solo importa archivos .js puros (src/lib/modulos.js importa un .jsx: se lee como texto).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import TEXTOS from '../../src/i18n/textos/modulos.js'
import PAGINAS from '../../src/i18n/datos/modulos-paginas.js'
import { PRODUCTOS_AGRO, PRODUCTOS_AGRO_TRAD, etiquetaProductoAgro } from '../../src/lib/productosAgro.js'

const leer = (ruta) => readFileSync(new URL(`../../${ruta}`, import.meta.url), 'utf8')
const IDIOMAS = ['es', 'en', 'pt']
const TRADUCIDOS = ['en', 'pt']

// Los 12 módulos con página armada por ModuloPagina (campo `pagina` en src/lib/modulos.js)
const CON_PAGINA = ['bitacora', 'fuentes', 'clima', 'recomendaciones', 'fenologia', 'calculadoras', 'drones', 'agroclima_viticola', 'cuarteles', 'muestras', 'cata', 'expediente_do']

// Archivos del área de módulos
const ARCHIVOS = [
  'src/pages/Modulos.jsx', 'src/pages/ModuloPagina.jsx', 'src/pages/Dashboard.jsx', 'src/pages/AIChat.jsx',
  'src/pages/Documentos.jsx', 'src/pages/Eventos.jsx', 'src/pages/Tienda.jsx', 'src/components/PedidoModal.jsx',
  'src/components/MultiSelectBusqueda.jsx',
]
const FUENTES = Object.fromEntries(ARCHIVOS.map((f) => [f, leer(f)]))

const variables = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()

test('textos mod.: mismas claves en es, en y pt, sin vacíos y con las mismas variables', () => {
  const es = Object.keys(TEXTOS.es).sort()
  assert.ok(es.length > 100, 'el diccionario del área tiene los textos de las páginas')
  for (const i of IDIOMAS) {
    const claves = Object.keys(TEXTOS[i]).sort()
    assert.deepEqual(claves, es, `${i}: mismas claves que es`)
    for (const k of claves) {
      assert.ok(k.startsWith('mod.'), `${k}: prefijo mod.`)
      assert.equal(typeof TEXTOS[i][k], 'string', `${i} ${k}`)
      assert.ok(TEXTOS[i][k].trim(), `${i} ${k} vacío`)
      assert.deepEqual(variables(TEXTOS[i][k]), variables(TEXTOS.es[k]), `${i} ${k}: mismas variables {x}`)
    }
  }
})

test('plurales completos: cada .uno tiene su .otros', () => {
  for (const k of Object.keys(TEXTOS.es).filter((x) => x.endsWith('.uno'))) {
    assert.ok(TEXTOS.es[k.replace(/\.uno$/, '.otros')], `${k} sin .otros`)
  }
})

test('las claves que usan las páginas existen en el diccionario', () => {
  for (const [f, texto] of Object.entries(FUENTES)) {
    for (const [, k] of texto.matchAll(/\bt\(\s*["'](mod\.[\w.]+)["']/g)) assert.ok(k in TEXTOS.es, `${f}: falta ${k}`)
    for (const [, k] of texto.matchAll(/\bt\.plural\(\s*["'](mod\.[\w.]+)["']/g)) {
      assert.ok(`${k}.uno` in TEXTOS.es && `${k}.otros` in TEXTOS.es, `${f}: falta el plural ${k}`)
    }
  }
  // Claves armadas con variables: productos de la Tienda y fichas de las páginas hechas a mano
  for (const [, clave] of FUENTES['src/pages/Tienda.jsx'].matchAll(/clave: "(\w+)"/g)) assert.ok(`mod.prod.${clave}` in TEXTOS.es, `producto ${clave}`)
  for (const id of ['iot', 'vivo', 'alertas', 'historico', 'hidrica', 'riego']) assert.ok(`mod.dash.f.${id}.t` in TEXTOS.es && `mod.dash.f.${id}.d` in TEXTOS.es)
  for (const id of ['protocolos', 'sensores', 'historial', 'externas']) assert.ok(`mod.chat.f.${id}.t` in TEXTOS.es && `mod.chat.f.${id}.d` in TEXTOS.es)
  for (const n of [1, 2, 3, 4]) assert.ok(`mod.chat.caso${n}.p` in TEXTOS.es && `mod.chat.caso${n}.r` in TEXTOS.es)
  for (const n of [1, 2, 3, 4, 5, 6]) assert.ok(`mod.docs.d${n}` in TEXTOS.es)
  for (const n of [1, 2, 3, 4]) assert.ok(`mod.ev.e${n}` in TEXTOS.es)
  for (const tipo of ['todos', 'capacitacion', 'demostracion', 'webinar', 'taller']) assert.ok(`mod.ev.tipo.${tipo}` in TEXTOS.es)
})

// Cuántas features y pasos tiene cada `pagina` en español (se lee src/lib/modulos.js como texto)
function paginasEnEspanol() {
  const bloques = leer('src/lib/modulos.js').split(/\r?\n {2}\{\r?\n/).slice(1)
  const out = {}
  for (const b of bloques) {
    if (!b.includes('pagina: {')) continue
    const key = b.match(/key: "([^"]+)"/)[1]
    const pasos = b.slice(b.indexOf('pasos: ['), b.indexOf('],', b.indexOf('pasos: [')))
    out[key] = {
      features: (b.match(/desc: "/g) || []).length,
      pasos: (pasos.match(/^\s+"/gm) || []).length,
      aviso: b.includes('aviso: {'),
    }
  }
  return out
}

test('modulos-paginas.js traduce la página completa de los 12 módulos', () => {
  const es = paginasEnEspanol()
  assert.deepEqual(Object.keys(es).sort(), [...CON_PAGINA].sort(), 'los 12 módulos con página')
  for (const i of TRADUCIDOS) {
    assert.deepEqual(Object.keys(PAGINAS[i]).sort(), [...CON_PAGINA].sort(), `${i}: solo y todos los módulos con página`)
    for (const key of CON_PAGINA) {
      const p = PAGINAS[i][key]?.pagina
      const ref = `${i} ${key}`
      assert.ok(p, `${ref}: sin pagina`)
      for (const campo of ['badge', 'titulo', 'destacado', 'bajada']) assert.ok(p[campo]?.trim(), `${ref}: falta ${campo}`)
      assert.equal(p.features.length, es[key].features, `${ref}: mismas features que en español`)
      assert.ok(p.features.every((f) => f.titulo?.trim() && f.desc?.trim()), `${ref}: features con titulo y desc`)
      assert.equal(p.pasos.length, es[key].pasos, `${ref}: mismos pasos que en español`)
      assert.ok(p.pasos.every((x) => typeof x === 'string' && x.trim()), `${ref}: pasos con texto`)
      assert.equal(Boolean(p.aviso), es[key].aviso, `${ref}: aviso`)
      if (p.aviso) {
        assert.ok(p.aviso.titulo && p.aviso.texto && p.aviso.enlace?.texto, `${ref}: aviso completo`)
        assert.equal(p.aviso.enlace.ruta, undefined, `${ref}: la ruta del enlace no se traduce`)
      }
    }
  }
})

test('textos sin rayas largas (—) y sin anunciar la app iOS como disponible', () => {
  const todo = JSON.stringify([TEXTOS, PAGINAS, PRODUCTOS_AGRO_TRAD])
  assert.ok(!todo.includes('—'), 'sin rayas largas')
  assert.ok(!/iOS (y|and|e) Android/.test(todo))
  for (const [f, texto] of Object.entries(FUENTES)) assert.ok(!/—/.test(texto.replace(/\/\/.*$|\{\/\*.*?\*\/\}/gm, '')), `${f}: raya larga en un texto`)
})

test('sin preferencia por Chile en los datos de ejemplo', () => {
  const chile = /\+56|es-CL|\bCLP\b|INDAP|\bSAG\b|comunas?\b|Curic[oó]|Rancagua|Chill[aá]n|Temuco|Osorno|Ovalle/i
  for (const [f, texto] of Object.entries(FUENTES)) assert.ok(!chile.test(texto), `${f}: ${texto.match(chile)?.[0]}`)
  const textos = JSON.stringify([TEXTOS, PAGINAS])
  assert.ok(!chile.test(textos), `textos: ${textos.match(chile)?.[0]}`)
  // La Tienda muestra productores de varios países, marcados como ejemplo, con precios en USD
  const tienda = FUENTES['src/pages/Tienda.jsx']
  const paises = new Set([...tienda.matchAll(/pais: "([A-Z]{2})"/g)].map((m) => m[1]))
  assert.ok(paises.size >= 5, `productores de varios países: ${[...paises]}`)
  assert.ok(FUENTES['src/components/PedidoModal.jsx'].includes('currency: "USD"'))
  assert.ok(tienda.includes('t("mod.ejemplo")'), 'cada productor se marca como ejemplo')
})

test('el pedido se envía al API en español y con el idioma del sitio', () => {
  const modal = FUENTES['src/components/PedidoModal.jsx']
  assert.ok(modal.includes('textosDe("es")'), 'nombres de productos en español para el resumen')
  assert.ok(/enviarLead\(\{ tipo: "pedido",.*\bresumen, idioma \}\)/.test(modal), 'enviarLead recibe idioma')
  assert.ok(modal.includes('Idioma del sitio: ${idioma}'), 'el resumen dice en qué idioma se pidió')
})

test('accesibilidad: un h1 por página, filtros con aria-pressed, controles de 44 px y etiquetas', () => {
  // El h1 está solo en HeroModulo (ModuloPagina.jsx) y en el índice; las páginas a mano usan HeroModulo
  assert.equal((FUENTES['src/pages/ModuloPagina.jsx'].match(/<h1\b/g) || []).length, 1)
  assert.equal((FUENTES['src/pages/Modulos.jsx'].match(/<h1\b/g) || []).length, 1)
  for (const f of ['Dashboard', 'AIChat', 'Documentos', 'Eventos', 'Tienda']) {
    const texto = FUENTES[`src/pages/${f}.jsx`]
    assert.ok(!/<h1\b/.test(texto) && texto.includes('<HeroModulo'), `${f}: h1 de HeroModulo`)
  }
  assert.ok(FUENTES['src/pages/Eventos.jsx'].includes('aria-pressed={activo}'), 'filtro de eventos')
  assert.ok(FUENTES['src/pages/Tienda.jsx'].includes('aria-pressed={f.soloDisponibles}'), 'filtro con cupos')
  assert.ok(FUENTES['src/components/MultiSelectBusqueda.jsx'].includes('aria-pressed={activo}'), 'opciones del selector')
  // Botones de solo ícono con nombre accesible
  assert.ok(/aria-label=\{t\("mod\.pedido\.cerrar"\)\}/.test(FUENTES['src/components/PedidoModal.jsx']))
  assert.ok(/aria-label=\{t\("mod\.tienda\.cerrarFiltros"\)\}/.test(FUENTES['src/pages/Tienda.jsx']))
  // Campos del pedido con label asociado
  const modal = FUENTES['src/components/PedidoModal.jsx']
  for (const c of ['nombre', 'telefono', 'email']) {
    assert.ok(modal.includes(`htmlFor={\`\${ids}-${c}\`}`) && modal.includes(`id={\`\${ids}-${c}\`}`), `pedido: label de ${c}`)
  }
  // Los botones de los formularios y filtros miden al menos 44 px (min-h-[44px], w-11/h-11 o más)
  for (const f of ['src/pages/Eventos.jsx', 'src/pages/Tienda.jsx', 'src/components/PedidoModal.jsx', 'src/components/MultiSelectBusqueda.jsx']) {
    const texto = FUENTES[f]
    for (const { index } of texto.matchAll(/<button\b/g)) {
      const clases = texto.slice(index).match(/className=(?:"([^"]*)"|\{`([^`]*)`\})/)
      const c = clases?.[1] ?? clases?.[2] ?? ''
      // ${campo}: alto de los campos de filtro de la Tienda (min-h-[44px] o min-h-[48px])
      assert.ok(/min-h-\[(44|48)px\]|\bh-11\b|\bh-12\b|\$\{campo\}/.test(c), `${f}: botón de menos de 44 px: ${c.slice(0, 80)}`)
    }
  }
})

test('insumos: valores en español y nombre en inglés y portugués para cada categoría e insumo', () => {
  const textos = PRODUCTOS_AGRO.flatMap((g) => [g.categoria, ...g.items])
  assert.equal(new Set(textos).size, textos.length, 'sin repetidos')
  for (const i of TRADUCIDOS) {
    for (const x of textos) assert.ok(PRODUCTOS_AGRO_TRAD[i][x]?.trim(), `${i}: falta "${x}"`)
    assert.deepEqual(Object.keys(PRODUCTOS_AGRO_TRAD[i]).filter((k) => !textos.includes(k)), [], `${i}: traducciones sobrantes`)
  }
  assert.equal(etiquetaProductoAgro('Urea', 'pt'), 'Ureia')
  assert.equal(etiquetaProductoAgro('Urea', 'es'), 'Urea')
  assert.equal(etiquetaProductoAgro('Insumo propio', 'en'), 'Insumo propio', 'lo agregado a mano queda igual')
})
