// Apps del ecosistema, confianza, video y módulos del sitio. Uso: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { APPS, APPS_CON_PAGINA, appPorSlug } from '../../src/lib/apps.js'
import { CONFIAN, PARTNER } from '../../src/lib/confianza.js'
import { hayVideo } from '../../src/lib/video.js'
import { enviarLead, LEADS_URL, CORREO_CONTACTO } from '../../src/lib/lead.js'
import { destinoAdmin, PESTANAS_ADMIN } from '../../src/lib/admin.js'
import { enfocables, focoAtrapado } from '../../src/lib/foco.js'

const leer = (ruta) => readFileSync(new URL(ruta, import.meta.url), 'utf8')
const VERCEL = JSON.parse(leer('../../vercel.json'))
// Todos los .js/.jsx de src, con su contenido
const FUENTES = readdirSync(new URL('../../src/', import.meta.url), { recursive: true })
  .map((f) => String(f).replace(/\\/g, '/')).filter((f) => /\.jsx?$/.test(f))
  .map((f) => ({ f, texto: leer(`../../src/${f}`) }))

test('menú Apps: AgroHubs, AgroCiclo, DronX y AgroSeller; Fisaro no es una app', () => {
  assert.deepEqual(APPS.map((a) => [a.nombre, a.ruta]), [
    ['AgroHubs', '/'], ['AgroCiclo', '/apps/agrociclo'], ['DronX', '/apps/dronx'], ['AgroSeller', '/apps/agroseller'],
  ])
  assert.ok(!APPS.some((a) => /fisaro/i.test(a.nombre + a.slug)))
  assert.equal(appPorSlug('agrohubs').promesa, 'Crea tu Centro Demostrativo Agrícola')
  assert.equal(appPorSlug('agrociclo').promesa, 'Convierte tus residuos agrícolas en valor')
  assert.equal(appPorSlug('dronx').promesa, 'Servicios de dron a demanda')
})

test('sitios propios y CTA de cada app', () => {
  assert.equal(appPorSlug('agrociclo').sitio, 'https://agrociclo.oladigital.cl')
  assert.equal(appPorSlug('dronx').sitio, 'https://dsp.oladigital.cl')
  const seller = appPorSlug('agroseller')
  assert.equal(seller.sitio, undefined, 'AgroSeller aún no tiene sitio')
  assert.equal(seller.cta, 'Quiero ser parte')
  assert.equal(seller.nuevo, true)
  assert.equal(appPorSlug('dronx').modulo, 'drones', 'DronX reutiliza el módulo Drones')
})

test('cada página de app tiene todas las secciones de la plantilla', () => {
  assert.equal(APPS_CON_PAGINA.length, 3)
  for (const a of APPS_CON_PAGINA) {
    assert.ok(a.bajada && a.cta, `${a.slug}: hero`)
    assert.equal(a.problemas.length, 3, `${a.slug}: tres problemas`)
    assert.ok(a.problemas.every((p) => p.problema && p.solucion), `${a.slug}: problema → solución`)
    assert.equal(a.pasos.length, 3, `${a.slug}: cómo funciona en 3 pasos`)
    assert.ok(a.paraQuien.length > 0 && a.conexion.length > 0, `${a.slug}: para quién y conexión`)
    assert.ok(a.faq.length >= 2 && a.faq.every((f) => f.q.endsWith('?') && f.a), `${a.slug}: preguntas frecuentes`)
    assert.ok(a.cierre.titulo && a.cierre.texto, `${a.slug}: cierre`)
  }
})

test('AgroSeller cubre lotes, variantes, reservas y extras', () => {
  const texto = JSON.stringify(appPorSlug('agroseller'))
  for (const t of ['Especie', 'Variedad', 'Calibre', 'caja de 10 kg', 'bin', 'granel', 'tramos por volumen', 'Mínimo de compra',
    'Stock', 'Fecha de disponibilidad', 'exportación', 'mercado interno', 'comercial', 'Fotos', 'Punto de retiro',
    'cercanía', 'retiro (día y hora)', 'despacho', 'abono', 'WhatsApp', 'Confirmas o rechazas', 'vence', 'lista de espera',
    'todos los viernes para la feria', 'Calificaciones', 'ODEPA', 'AgroCiclo']) {
    assert.ok(texto.toLowerCase().includes(t.toLowerCase()), `falta: ${t}`)
  }
})

test('los textos de las apps no inventan cifras', () => {
  for (const a of APPS_CON_PAGINA) {
    const cifras = JSON.stringify(a).replace(/caja de 10 kg/g, '').match(/\d+/g)
    assert.equal(cifras, null, `${a.slug} trae cifras: ${cifras}`)
  }
})

test('Confían en nosotros: wordmarks de texto, listos para cambiar por logos', () => {
  assert.deepEqual(CONFIAN.map((m) => m.nombre), ['UC', 'FAO', 'Beemining', 'QTI Works', 'OlaDigital', 'Telefónica'])
  assert.ok(CONFIAN.every((m) => m.logo === null), 'sin logos hasta tener autorización')
  assert.equal(PARTNER.url, 'https://oladigital.cl')
})

test('hayVideo exige un archivo de video (Vercel responde el index.html si no existe)', async () => {
  const resp = (ok, tipo) => async () => ({ ok, headers: { get: () => tipo } })
  assert.equal(await hayVideo('/videos/a.mp4', resp(true, 'video/mp4')), true)
  assert.equal(await hayVideo('/videos/a.mp4', resp(true, 'text/html; charset=utf-8')), false)
  assert.equal(await hayVideo('/videos/a.mp4', resp(false, 'video/mp4')), false)
  assert.equal(await hayVideo('/videos/a.mp4', async () => { throw new Error('red') }), false)
})

test('el video real de la app está publicado con su portada', () => {
  assert.ok(readFileSync(new URL('../../public/videos/app.mp4', import.meta.url)).length > 0)
  assert.ok(readFileSync(new URL('../../public/videos/app.jpg', import.meta.url)).length > 0)
})

test('los 12 módulos tienen página: propia o armada por ModuloPagina', () => {
  const fuente = leer('../../src/lib/modulos.js')
  const app = leer('../../src/App.jsx')
  const bloques = fuente.split(/\r?\n  \{\r?\n/).slice(1)
  assert.equal(bloques.length, 12)
  const keys = bloques.map((b) => b.match(/key: "([^"]+)"/)[1])
  assert.deepEqual(keys, ['dashboard_sensores', 'bitacora', 'chat_ia', 'documentos', 'fuentes', 'clima', 'recomendaciones',
    'fenologia', 'calculadoras', 'eventos', 'tienda', 'drones'], 'mismas key que la plataforma')
  for (const b of bloques) {
    const ruta = b.match(/ruta: "([^"]+)"/)[1]
    const propia = app.includes(`path="${ruta}"`) || app.includes(`p('${ruta}')`)
    assert.ok(propia || b.includes('pagina: {'), `${ruta} no tiene página`)
    assert.ok(!(propia && b.includes('pagina: {')), `${ruta} tiene dos páginas`)
  }
  assert.ok(app.includes('path="/apps/:slug"') || app.includes("p('/apps/:slug')"), 'ruta de las apps')
})

// ── Revisión QA del PR #24 ──

test('vercel.json: las rutas de la SPA cargan directo (sin pasar por /index.html)', () => {
  // Con cleanUrls, /index.html responde 308 hacia /: un rewrite a /index.html dejaba en 404 la carga
  // directa de /evaluacion, /terminos, /dashboard, /modulos, /apps/*. Los archivos (assets, /apis,
  // /videos) tienen prioridad sobre los rewrites, así que se siguen sirviendo tal cual.
  assert.equal(VERCEL.cleanUrls, true)
  // La regla de la SPA deja fuera /api, /assets y /apis: un archivo que no existe ahí da 404, no la portada.
  // Las rutas en inglés y portugués (/en, /pt) cargan igual que las en español.
  const spa = VERCEL.rewrites[VERCEL.rewrites.length - 1]
  assert.deepEqual(spa, { source: '/((?!api/|assets/|apis/).*)', destination: '/' })
  const re = new RegExp(`^${spa.source}$`)
  for (const r of ['/', '/evaluacion', '/terminos', '/modulos', '/apps/dronx', '/en', '/en/evaluacion', '/pt/terminos', '/pt/apps/agroseller']) {
    assert.ok(re.test(r), `${r} va a la SPA`)
  }
  for (const r of ['/api/correo', '/assets/index.js', '/apis/inia-agromet', '/apis/categoria/clima-y-meteorologia']) {
    assert.ok(!re.test(r), `${r} no pasa por la SPA`)
  }
  assert.ok(!VERCEL.rewrites.some((r) => /\.html$/.test(r.destination)), 'ningún rewrite apunta a un .html')
  assert.deepEqual(VERCEL.rewrites[0], { source: '/api/:path*', destination: '/api/:path*' }, '/api sigue yendo a las funciones')
})

// Mini evaluador de los redirects de vercel.json: source exacto o con /:path* y condiciones `has` de query
// (Vercel compara el valor completo). Devuelve el destino con los grupos reemplazados.
function redirigeVercel(ruta) {
  const u = new URL(ruta, 'https://www.agrohubs.cl')
  for (const r of VERCEL.redirects) {
    if (!new RegExp(`^${r.source.replace('/:path*', '(?:/.*)?')}$`).test(u.pathname)) continue
    const grupos = {}
    const cumple = (r.has || []).every((h) => {
      const v = u.searchParams.get(h.key)
      if (h.type !== 'query' || v === null) return false
      const m = h.value === undefined ? [] : new RegExp(`^(?:${h.value})$`).exec(v)
      if (m) Object.assign(grupos, m.groups)
      return Boolean(m)
    })
    if (cumple) return r.destination.replace(/:(\w+)/g, (_, k) => grupos[k] ?? `:${k}`)
  }
  return null
}

test('/admin?tab=… y /admin?id=… llegan a la misma página del panel desde el servidor y desde la SPA', () => {
  const casos = ['/admin', '/admin?id=abc-123', '/admin?id=abc&tab=correo', '/admin?tab=otra', '/admin?tab=correos',
    '/admin/correo', ...Object.keys(PESTANAS_ADMIN).map((t) => `/admin?tab=${t}`)]
  for (const ruta of casos) {
    const servidor = new URL(redirigeVercel(ruta))
    const spa = new URL(destinoAdmin(new URL(ruta, 'https://www.agrohubs.cl').search))
    assert.equal(servidor.origin + servidor.pathname, spa.origin + spa.pathname, ruta)
    assert.equal(servidor.searchParams.get('id'), spa.searchParams.get('id'), ruta)
  }
  assert.equal(destinoAdmin('?tab=correo'), 'https://admin.agrohubs.cl/site/correo')
  assert.equal(destinoAdmin('?tab=seguimiento'), 'https://admin.agrohubs.cl/site/seguimiento')
  assert.equal(destinoAdmin('?tab=cuentas'), 'https://admin.agrohubs.cl/site/boveda')
  assert.equal(destinoAdmin('?id=a b'), 'https://admin.agrohubs.cl/site/propuestas?id=a%20b')
  assert.equal(destinoAdmin('?tab=constructor'), 'https://admin.agrohubs.cl/', 'solo pestañas conocidas')
  assert.equal(destinoAdmin(''), 'https://admin.agrohubs.cl/')
})

test('enviarLead: solo al API de la plataforma y solo cuenta como enviado con ok === true', async () => {
  const llamadas = []
  const api = (status, cuerpo) => async (url, opciones) => {
    llamadas.push({ url, metodo: opciones.method, body: JSON.parse(opciones.body) })
    return { ok: status >= 200 && status < 300, status, json: async () => { if (cuerpo instanceof Error) throw cuerpo; return cuerpo } }
  }
  const datos = { tipo: 'contacto', contacto: { nombre: 'Ana', email: 'ana@ejemplo.cl' } }
  assert.equal(LEADS_URL, 'https://api.agrohubs.cl/api/v1/site/leads')
  assert.equal(await enviarLead(datos, api(200, { ok: true })), true)
  assert.equal(await enviarLead(datos, api(200, {})), false, 'sin ok')
  assert.equal(await enviarLead(datos, api(200, { ok: 'true' })), false, 'ok tiene que ser true')
  assert.equal(await enviarLead(datos, api(200, null)), false, 'cuerpo vacío')
  assert.equal(await enviarLead(datos, api(200, new SyntaxError('HTML'))), false, 'respuesta que no es JSON')
  assert.equal(await enviarLead(datos, api(429, { ok: false, message: 'Demasiados envíos' })), false)
  assert.equal(await enviarLead(datos, api(500, { ok: true })), false, 'error HTTP')
  assert.equal(await enviarLead(datos, async () => { throw new TypeError('Failed to fetch') }), false, 'sin red o CORS')
  assert.equal(llamadas.length, 7, 'un envío por intento, sin probar otro destino')
  assert.ok(llamadas.every((l) => l.url === LEADS_URL && l.metodo === 'POST'))
  assert.equal(llamadas[0].body.contacto.nombre, 'Ana')
})

test('nada envía a /api/lead (ya no existe) y los formularios ofrecen otro contacto si falla', () => {
  assert.ok(!existsSync(new URL('../../api/lead.js', import.meta.url)))
  for (const { f, texto } of FUENTES) assert.ok(!/['"]\/api\/lead['"]/.test(texto), `src/${f}`)
  const build = leer('../../scripts/build-apis.mjs')
  assert.ok(!/['"]\/api\/lead['"]/.test(build), 'cotizar (/apis/cotizar) solo usa el API de la plataforma')
  assert.ok(build.includes(`var LEADS_URL='${LEADS_URL}'`))
  assert.ok(build.includes('j.ok===true'))
  assert.equal(CORREO_CONTACTO, 'cotizaciones@agrohubs.cl')
  for (const f of ['components/ContactModal.jsx', 'pages/Evaluacion.jsx', 'components/PedidoModal.jsx']) {
    assert.ok(leer(`../../src/${f}`).includes('mailto:${CORREO_CONTACTO}'), `${f}: sin contacto alternativo`)
  }
})

test('ContactModal: Tab y Shift+Tab ciclan dentro del diálogo', () => {
  const lista = ['cerrar', 'nombre', 'enviar']
  assert.equal(focoAtrapado(lista, 'enviar'), 'cerrar', 'Tab en el último vuelve al primero')
  assert.equal(focoAtrapado(lista, 'cerrar', true), 'enviar', 'Shift+Tab en el primero va al último')
  assert.equal(focoAtrapado(lista, 'nombre'), null, 'en medio, el navegador lo mueve solo')
  assert.equal(focoAtrapado(lista, 'nombre', true), null)
  assert.equal(focoAtrapado(lista, 'body'), 'cerrar', 'si el foco quedó fuera, vuelve al diálogo')
  assert.equal(focoAtrapado(lista, 'body', true), 'enviar')
  assert.equal(focoAtrapado([], 'body'), null)
  const el = (n, extra = {}) => ({ n, disabled: false, tabIndex: 0, getClientRects: () => [{}], ...extra })
  const caja = { querySelectorAll: () => [el('cerrar'), el('nombre'), el('trampa', { tabIndex: -1 }),
    el('oculto', { getClientRects: () => [] }), el('enviar', { disabled: true })] }
  assert.deepEqual(enfocables(caja).map((e) => e.n), ['cerrar', 'nombre'], 'sin el campo trampa, ocultos ni deshabilitados')
  assert.deepEqual(enfocables(null), [])
  const modal = leer('../../src/components/ContactModal.jsx')
  assert.ok(modal.includes('focoAtrapado(enfocables(caja.current), document.activeElement, e.shiftKey)'))
  assert.ok(modal.includes('previo.focus'), 'al cerrar, el foco vuelve al botón que lo abrió')
})

// Fernando pidió decir "iOS y Android" en los tres pasos de la portada (PR #28). Las plataformas de la app
// quedan en un solo lugar, src/lib/plataformas.js, para cambiarlas ahí si iOS todavía no está publicada.
test('las plataformas de la app AgroHubs solo se escriben en lib/plataformas.js', () => {
  for (const { f, texto } of FUENTES) {
    if (f === 'lib/plataformas.js') continue
    assert.ok(!/iOS y Android|iOS and Android|iOS e Android|['"]iOS['"]/.test(texto), `src/${f}`)
  }
})
