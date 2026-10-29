// Apps del ecosistema (DronX, AgroCiclo, AgroSeller): colores, destinos de los botones, traducciones y
// formularios. Solo importa archivos .js puros; los .jsx se leen como texto. Uso: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { APPS, APPS_CON_PAGINA, ACENTOS, acentoDe, estiloAcento } from '../../src/lib/apps.js'
import { FOTOS } from '../../src/lib/fotos.js'
import { localizar, conIdioma } from '../../src/i18n/idiomas.js'
import TEXTOS_APPS from '../../src/i18n/textos/apps.js'
import DATOS_APPS from '../../src/i18n/datos/apps.js'

const leer = (ruta) => readFileSync(new URL(ruta, import.meta.url), 'utf8')
const PAGINA = leer('../../src/pages/AppPagina.jsx')
const PORTADA = leer('../../src/components/AppsEcosistema.jsx')
const INTERES = leer('../../src/components/FormInteres.jsx')
const CONTACTO = leer('../../src/components/ContactModal.jsx')
const MODULOS = leer('../../src/lib/modulos.js')
const IDIOMAS_TRAD = ['en', 'pt']

// ── Contraste WCAG ──
// Colores de la marca en sRGB (tokens.css está en oklch): papel, bosque y bosque oscuro
const PAPEL = '#f4f8f3'
const BOSQUE = '#0b3b24'
const BOSQUE_OSCURO = '#062716'
const luminancia = (hex) => {
  const [r, g, b] = hex.slice(1).match(/../g).map((x) => parseInt(x, 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contraste = (a, b) => {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

test('cada app tiene su color, con contraste AA donde se usa', () => {
  const hex = /^#[0-9a-f]{6}$/
  for (const a of APPS) {
    const c = ACENTOS[a.slug]
    assert.ok(c, `${a.slug}: sin color en ACENTOS`)
    for (const k of ['color', 'suave', 'claro']) assert.match(c[k], hex, `${a.slug}.${k}`)
    // Botón y etiquetas: texto claro sobre el color; íconos y enlaces: el color sobre el papel y sobre el suave
    assert.ok(contraste(c.color, '#ffffff') >= 4.5, `${a.slug}: texto blanco sobre ${c.color}`)
    assert.ok(contraste(c.color, PAPEL) >= 4.5, `${a.slug}: ${c.color} sobre el papel`)
    assert.ok(contraste(c.color, c.suave) >= 4.5, `${a.slug}: ${c.color} sobre ${c.suave}`)
    // Banda bosque del cierre: botón del color claro con texto bosque oscuro
    assert.ok(contraste(c.claro, BOSQUE_OSCURO) >= 4.5, `${a.slug}: bosque oscuro sobre ${c.claro}`)
    assert.ok(contraste(c.claro, BOSQUE) >= 4.5, `${a.slug}: ${c.claro} sobre la banda bosque`)
  }
  const colores = APPS_CON_PAGINA.map((a) => ACENTOS[a.slug].color)
  assert.equal(new Set([...colores, ACENTOS.agrohubs.color]).size, colores.length + 1, 'cada app con un color distinto al de AgroHubs y al de las otras')
  assert.equal(acentoDe('no-existe'), ACENTOS.agrohubs)
  assert.deepEqual(Object.keys(estiloAcento('dronx')), ['--app-acento', '--app-suave', '--app-claro'])
})

// Un destino: { url } (sitio externo), { ruta } (página de este sitio) o { ancla } (sección de la página)
function revisarDestino(app, d, que) {
  const tipos = ['url', 'ruta', 'ancla'].filter((k) => d?.[k])
  assert.equal(tipos.length, 1, `${app.slug} ${que}: un destino y solo uno`)
  if (d.url) {
    assert.match(d.url, /^https:\/\/[^/]+/, `${app.slug} ${que}: https`)
    assert.equal(d.url, app.sitio, `${app.slug} ${que}: el sitio de la app (lib/apps.js)`)
    assert.ok(!/wikimedia|wikipedia/i.test(d.url))
  }
  if (d.ruta) {
    const rutas = [...MODULOS.matchAll(/ruta: "([^"]+)"/g)].map((m) => m[1]).concat(APPS.map((x) => x.ruta))
    assert.ok(rutas.includes(d.ruta), `${app.slug} ${que}: ${d.ruta} no es una página del sitio`)
  }
  if (d.ancla) {
    assert.ok(PAGINA.includes(`id="${d.ancla}"`), `${app.slug} ${que}: AppPagina no tiene la sección #${d.ancla}`)
    if (d.ancla === 'interes') assert.equal(app.interes, true, `${app.slug} ${que}: #interes solo existe con el formulario`)
  }
}

test('cada botón de las apps lleva a un destino que existe', () => {
  for (const a of APPS_CON_PAGINA) {
    assert.ok(a.cta, `${a.slug}: texto del botón principal`)
    revisarDestino(a, a.destino, 'botón principal')
    if (a.otra) {
      assert.ok(a.otra.texto, `${a.slug}: texto del botón secundario`)
      revisarDestino(a, a.otra.destino, 'botón secundario')
    }
  }
  // DronX: se pide desde el módulo Drones de AgroHubs y su sitio se abre aparte
  const dronx = APPS.find((a) => a.slug === 'dronx')
  assert.deepEqual(dronx.destino, { ruta: '/drones' })
  assert.deepEqual(dronx.otra.destino, { url: 'https://dsp.oladigital.cl' })
  // AgroCiclo: su sitio
  assert.deepEqual(APPS.find((a) => a.slug === 'agrociclo').destino, { url: 'https://agrociclo.oladigital.cl' })
  // AgroSeller: en desarrollo, el botón lleva al formulario de interés de la misma página
  const seller = APPS.find((a) => a.slug === 'agroseller')
  assert.deepEqual(seller.destino, { ancla: 'interes' })
  assert.ok(seller.interes && seller.estado, 'AgroSeller muestra que está en desarrollo y pide interés')
  // Las rutas internas llevan el prefijo del idioma
  assert.equal(conIdioma('/drones', 'en'), '/en/drones')
  assert.equal(conIdioma('/apps/agroseller', 'pt'), '/pt/apps/agroseller')
})

test('cada app tiene ícono y foto (con respaldo mientras la propia no esté)', () => {
  for (const a of APPS_CON_PAGINA) {
    assert.ok(['dron', 'reciclaje', 'feria'].includes(a.icono), `${a.slug}: ícono`)
    assert.ok(PORTADA.includes(`${a.icono}:`), `${a.slug}: IconoApp no conoce "${a.icono}"`)
    assert.ok(FOTOS[a.foto] || FOTOS[a.fotoRespaldo], `${a.slug}: ni ${a.foto} ni ${a.fotoRespaldo} están en lib/fotos.js`)
    assert.ok(FOTOS[a.fotoRespaldo], `${a.slug}: la foto de respaldo (${a.fotoRespaldo}) tiene que existir`)
  }
  // Fotos con personas (lib/fotos.js): quien recoge en el campo, el dron en vuelo y la vendedora de feria
  assert.deepEqual(APPS_CON_PAGINA.map((a) => a.foto), ['recicladorCampo', 'dron', 'feriaVendedor'])
})

// ── Traducciones ──

test('textos de las apps: mismas claves en español, inglés y portugués', () => {
  const es = Object.keys(TEXTOS_APPS.es).sort()
  assert.ok(es.length > 0)
  for (const i of IDIOMAS_TRAD) assert.deepEqual(Object.keys(TEXTOS_APPS[i]).sort(), es, `textos/apps.js: claves de ${i}`)
  for (const i of ['es', ...IDIOMAS_TRAD]) {
    for (const [k, v] of Object.entries(TEXTOS_APPS[i])) {
      assert.ok(k.startsWith('apps.') || k.startsWith('contacto.'), `${k}: prefijo del área`)
      assert.ok(typeof v === 'string' && v.trim(), `${i} ${k}: vacío`)
      // Las variables ({app}, {nombre}, {email}) son las mismas en los tres idiomas
      const vars = (s) => (s.match(/\{\w+\}/g) || []).sort().join()
      assert.equal(vars(v), vars(TEXTOS_APPS.es[k]), `${i} ${k}: variables`)
    }
  }
})

test('cada clave que usan las páginas de apps, la portada y los formularios existe', () => {
  const usadas = new Set()
  for (const fuente of [PAGINA, PORTADA, INTERES, CONTACTO]) {
    for (const m of fuente.matchAll(/\bt\("((?:apps|contacto|comun)\.[\w.]+)"/g)) usadas.add(m[1])
  }
  assert.ok(usadas.size > 20)
  for (const k of usadas) {
    if (k.startsWith('comun.')) continue // área común (textos/comun.js)
    assert.ok(k in TEXTOS_APPS.es, `falta "${k}" en textos/apps.js`)
  }
  const comun = leer('../../src/i18n/textos/comun.js')
  assert.ok(comun.includes('"comun.otraPestana"'), 'el aviso "se abre en otra pestaña" está en comun.js')
})

// Campos de lib/apps.js que no son texto (no se traducen)
const NO_TEXTO = new Set(['slug', 'nombre', 'ruta', 'sitio', 'modulo', 'icono', 'foto', 'fotoRespaldo', 'nuevo', 'interes', 'destino'])

// Rutas de los textos en español que no tienen traducción (y arreglos de otro largo, o claves de más)
function faltantes(base, trad, ruta = '') {
  if (typeof base === 'string') return typeof trad === 'string' && trad.trim() ? [] : [ruta]
  if (Array.isArray(base)) {
    if (!Array.isArray(trad) || trad.length !== base.length) return [`${ruta} (largo)`]
    return base.flatMap((x, i) => faltantes(x, trad[i], `${ruta}[${i}]`))
  }
  if (base && typeof base === 'object') {
    if (!trad || typeof trad !== 'object') return [ruta || '(app)']
    const sobran = Object.keys(trad).filter((k) => !(k in base)).map((k) => `${ruta}.${k} (no existe en español)`)
    return sobran.concat(Object.keys(base).filter((k) => !NO_TEXTO.has(k)).flatMap((k) => faltantes(base[k], trad[k], `${ruta}.${k}`)))
  }
  return []
}

test('datos de las apps: traducción completa al inglés y al portugués', () => {
  for (const i of IDIOMAS_TRAD) {
    for (const a of APPS) {
      assert.deepEqual(faltantes(a, DATOS_APPS[i][a.slug]), [], `${i} ${a.slug}`)
      const l = localizar(a, DATOS_APPS[i][a.slug])
      assert.notEqual(l.promesa, a.promesa, `${i} ${a.slug}: promesa sin traducir`)
      assert.equal(l.nombre, a.nombre, 'el nombre de la app no se traduce')
      if (a.destino) assert.deepEqual(l.destino, a.destino, `${i} ${a.slug}: el destino no cambia`)
      if (a.otra) assert.deepEqual(l.otra.destino, a.otra.destino, `${i} ${a.slug}: el destino secundario no cambia`)
    }
  }
})

// Todos los textos visibles de las apps (datos y diccionario) en los tres idiomas
const textosDe = (x) => (typeof x === 'string' ? [x] : Array.isArray(x) ? x.flatMap(textosDe)
  : x && typeof x === 'object' ? Object.entries(x).filter(([k]) => !NO_TEXTO.has(k)).flatMap(([, v]) => textosDe(v)) : [])
const TODOS = [
  ...textosDe(APPS_CON_PAGINA),
  ...IDIOMAS_TRAD.flatMap((i) => textosDe(DATOS_APPS[i])),
  ...['es', ...IDIOMAS_TRAD].flatMap((i) => Object.values(TEXTOS_APPS[i])),
]

test('textos sin rayas largas ni datos de ejemplo de un solo país', () => {
  for (const s of TODOS) {
    assert.ok(!s.includes('—'), `raya larga: ${s}`)
    assert.ok(!/\+\s?56|\.cl\b/.test(s), `dato de ejemplo chileno: ${s}`)
  }
  for (const [f, fuente] of [['FormInteres', INTERES], ['ContactModal', CONTACTO], ['AppPagina', PAGINA]]) {
    assert.ok(!/\+56|placeholder="\+/.test(fuente), `${f}: teléfono de ejemplo con código de un país`)
  }
})

test('las traducciones de las apps tampoco inventan cifras', () => {
  for (const i of IDIOMAS_TRAD) {
    for (const a of APPS_CON_PAGINA) {
      const cifras = JSON.stringify(DATOS_APPS[i][a.slug]).replace(/10 kg/g, '').match(/\d+/g)
      assert.equal(cifras, null, `${i} ${a.slug} trae cifras: ${cifras}`)
    }
  }
})

// ── Formularios: el API de la plataforma, sin endpoints nuevos ──

test('formulario de interés y contacto: tipo válido del API, idioma y alternativa por correo', () => {
  // api/src/site/dto/site.dto.js (TIPOS): un tipo desconocido se guarda como "contacto"
  const TIPOS_API = ['evaluacion', 'contacto', 'pedido']
  for (const [f, fuente] of [['FormInteres', INTERES], ['ContactModal', CONTACTO]]) {
    const tipos = [...fuente.matchAll(/tipo: "(\w+)"/g)].map((m) => m[1])
    assert.ok(tipos.length > 0 && tipos.every((t) => TIPOS_API.includes(t)), `${f}: tipo ${tipos}`)
    assert.ok(fuente.includes('enviarLead({'), `${f}: usa enviarLead (lib/lead.js)`)
    assert.ok(!/fetch\(/.test(fuente), `${f}: sin llamadas propias`)
    assert.ok(/respuestas: \{[^\n]*\bidioma\b/.test(fuente), `${f}: manda el idioma en respuestas`)
    assert.ok(fuente.includes('mailto:${CORREO_CONTACTO}'), `${f}: correo alternativo si falla`)
    assert.ok(fuente.includes('aria-invalid') && fuente.includes('aria-describedby') && fuente.includes('aria-live'), `${f}: errores accesibles`)
    assert.ok(fuente.includes('aria-busy'), `${f}: estado enviando`)
    assert.ok(fuente.includes('name="website"'), `${f}: campo trampa para bots`)
  }
  assert.ok(INTERES.includes('t("apps.interes.vende")'), 'FormInteres pregunta qué vende')
  assert.ok(PAGINA.includes('<FormInteres app={app} />') && PAGINA.includes('id="interes"'))
})

test('AppsEcosistema: sección de la portada con id="apps", un h2 y enlaces a cada app', () => {
  assert.ok(PORTADA.includes('id = "apps"'))
  assert.ok(PORTADA.includes('<h2'))
  assert.ok(PORTADA.includes('<Enlace to={app.ruta}'))
  assert.ok(PORTADA.includes('<CreditoFoto foto={foto} />') && PORTADA.includes('<Foto foto={foto}'))
})
