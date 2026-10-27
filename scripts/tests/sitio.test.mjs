// Apps del ecosistema, confianza, video y módulos del sitio. Uso: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { APPS, APPS_CON_PAGINA, appPorSlug } from '../../src/lib/apps.js'
import { CONFIAN, PARTNER } from '../../src/lib/confianza.js'
import { hayVideo } from '../../src/lib/video.js'

const leer = (ruta) => readFileSync(new URL(ruta, import.meta.url), 'utf8')

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

test('el video de AgroHubs está publicado con su portada', () => {
  assert.ok(readFileSync(new URL('../../public/videos/agrohubs.mp4', import.meta.url)).length > 0)
  assert.ok(readFileSync(new URL('../../public/videos/agrohubs.jpg', import.meta.url)).length > 0)
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
    const propia = app.includes(`path="${ruta}"`)
    assert.ok(propia || b.includes('pagina: {'), `${ruta} no tiene página`)
    assert.ok(!(propia && b.includes('pagina: {')), `${ruta} tiene dos páginas`)
  }
  assert.ok(app.includes('path="/apps/:slug"'), 'ruta de las apps')
})
