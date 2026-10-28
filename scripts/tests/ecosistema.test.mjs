// Ecosistema de la portada: resumen del catálogo por categoría (directorio /apis) y el diagrama interactivo
// (src/lib/ecosistema.js): datos, estados, filtro y geometría en los tres idiomas. Uso: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { partesNombre, resumenPorCategoria } from '../apis/ecosistema.mjs'
import { APIS, CATEGORIAS } from '../apis/lib.mjs'
import {
  ESTADOS, ORDEN_MODULOS, CONECTORES, SERVICIOS, INTEGRACIONES, CATEGORIAS_MODULO, GEO, integracionesDe,
  modulosDeServicio, estadoDeServicio, resumen, resaltado, plano, cajasDiagrama, solapes, dentroDelLienzo,
} from '../../src/lib/ecosistema.js'
import BASE from '../../src/i18n/datos/modulos-base.js'
import TRAD from '../../src/i18n/datos/ecosistema.js'

const leer = (ruta) => readFileSync(new URL(ruta, import.meta.url), 'utf8')
const DESTACADAS = JSON.parse(leer('../../data/apis/destacadas.json'))
// Nombre corto de cada módulo en español (src/lib/modulos.js importa un .jsx: se lee como texto)
const FUENTE_MODULOS = leer('../../src/lib/modulos.js')
const CORTOS_ES = Object.fromEntries([...FUENTE_MODULOS.matchAll(/key: "([^"]+)"[\s\S]*?corto: "([^"]+)"/g)].map((m) => [m[1], m[2]]))
// Etiqueta del diagrama por idioma: la `etiqueta` de modulos-base.js o, si no hay, el corto
const etiquetas = (i) => Object.fromEntries(ORDEN_MODULOS.map((k) => [k, BASE[i]?.[k]?.etiqueta || BASE.es?.[k]?.etiqueta || BASE[i]?.[k]?.corto || CORTOS_ES[k]]))

test('partesNombre separa el detalle de rayas y paréntesis', () => {
  assert.deepEqual(partesNombre('ODEPA — Datos Abiertos'), ['ODEPA', 'Datos Abiertos'])
  assert.deepEqual(partesNombre('CIREN / IDE MINAGRI (ArcGIS REST)'), ['CIREN / IDE MINAGRI', 'ArcGIS REST'])
  assert.deepEqual(partesNombre('Open-Meteo'), ['Open-Meteo', ''])
})

test('resumenPorCategoria cuenta, ordena por cantidad y elige las más recomendadas', () => {
  const api = (slug, categorias, relevancia, nombre = slug) => ({ slug, nombre, categorias, ranking: { relevancia } })
  const apis = [
    api('a', ['clima'], 50), api('b', ['clima', 'suelo'], 90, 'B — detalle'), api('c', ['clima'], 70),
    api('d', ['clima'], 10), api('e', ['suelo'], 40),
  ]
  const cats = [{ slug: 'suelo', nombre: 'Suelo' }, { slug: 'clima', nombre: 'Clima' }, { slug: 'vacia', nombre: 'Vacía' }]
  const r = resumenPorCategoria(apis, cats)
  assert.deepEqual(r.map((c) => [c.slug, c.total]), [['clima', 4], ['suelo', 2]], 'de más a menos y sin categorías vacías')
  assert.deepEqual(r[0].top, [{ slug: 'b', nombre: 'B' }, { slug: 'c', nombre: 'c' }, { slug: 'a', nombre: 'a' }])
})

test('destacadas.json trae el resumen por categoría al día con el catálogo, y las categorías de cada fila', () => {
  assert.deepEqual(DESTACADAS.categorias, resumenPorCategoria(APIS, CATEGORIAS), 'correr npm run apis')
  assert.equal(DESTACADAS.total_directorio, APIS.length)
  for (const f of [...DESTACADAS.chile, ...DESTACADAS.latam]) assert.ok(Array.isArray(f.categorias) && f.categorias.length, `${f.slug} sin categorías`)
})

test('el anillo tiene los 12 módulos de la app, una vez cada uno', () => {
  assert.equal(Object.keys(CORTOS_ES).length, 12)
  assert.deepEqual([...ORDEN_MODULOS].sort(), Object.keys(CORTOS_ES).sort())
})

test('cada integración apunta a un módulo, un conector y un servicio que existen, con un estado válido', () => {
  const conectores = new Set(CONECTORES.map((c) => c.id))
  const servicios = new Set(SERVICIOS.map((s) => s.id))
  for (const f of INTEGRACIONES) {
    const id = `${f.modulo}/${f.conector}/${f.servicio}`
    assert.ok(ORDEN_MODULOS.includes(f.modulo), `${id}: módulo`)
    assert.ok(conectores.has(f.conector), `${id}: conector`)
    assert.ok(f.servicio === null || servicios.has(f.servicio), `${id}: servicio`)
    assert.ok(f.estado in ESTADOS, `${id}: estado`)
    assert.ok(f.detalle && !/[—–]/.test(f.detalle), `${id}: detalle sin rayas`)
    if (f.estado === 'conectada') assert.ok(f.fuente, `${id}: falta la fuente en el código`)
  }
  const pares = INTEGRACIONES.map((f) => `${f.modulo}/${f.conector}/${f.servicio}`)
  assert.equal(new Set(pares).size, pares.length, 'sin filas repetidas')
  for (const s of SERVICIOS) assert.ok(INTEGRACIONES.some((f) => f.servicio === s.id), `${s.id} no se usa en ningún módulo`)
  for (const k of ORDEN_MODULOS) assert.ok(integracionesDe(k).length > 0, `${k} sin integraciones`)
})

test('los servicios que pidió Fernando están, y lo que no está construido no aparece como conectado', () => {
  for (const id of ['claude', 'openai', 'whatsapp', 'sii', 'kommo', 'aws', 'google', 'azure', 'sap']) {
    assert.ok(SERVICIOS.some((s) => s.id === id), `falta ${id}`)
  }
  for (const id of ['sii', 'kommo', 'aws', 'azure', 'sap', 'telegram', 'mercado-pago', 'mercado-publico', 'fisaro']) {
    assert.equal(estadoDeServicio(id), 'pedido', `${id} es a pedido`)
  }
  for (const id of ['wiseconn', 'meter', 'sentek', 'cropx', 'pessl', 'davis', 'lorawan', 'copernicus']) {
    assert.equal(estadoDeServicio(id), 'proximamente', `${id} está planificado, no conectado`)
  }
  for (const id of ['claude', 'openai', 'google', 'inia', 'dmc', 'open-meteo', 'dronx', 'woocommerce', 'odepa']) {
    assert.equal(estadoDeServicio(id), 'conectada', `${id} está en el código`)
  }
})

test('las agencias públicas dicen de qué país son: el sitio no presenta las de Chile como si fueran de todos', () => {
  for (const id of ['inia', 'dmc', 'ciren', 'conaf', 'odepa', 'mercado-publico', 'sii']) {
    const s = SERVICIOS.find((x) => x.id === id)
    assert.match(s.que, /Chile/, `${id} (es)`)
    assert.match(TRAD.en.servicios[id], /Chile/, `${id} (en)`)
    assert.match(TRAD.pt.servicios[id], /Chile/, `${id} (pt)`)
  }
})

test('traducciones del ecosistema completas en inglés y portugués', () => {
  for (const i of ['en', 'pt']) {
    for (const c of CONECTORES) assert.ok(TRAD[i].conectores[c.id]?.nombre && TRAD[i].conectores[c.id]?.etiqueta?.length, `${i}: conector ${c.id}`)
    for (const s of SERVICIOS.filter((x) => x.que)) assert.ok(TRAD[i].servicios[s.id], `${i}: servicio ${s.id}`)
    for (const f of INTEGRACIONES) assert.ok(TRAD[i].filas[`${f.modulo}/${f.conector}/${f.servicio}`], `${i}: fila ${f.modulo}/${f.conector}/${f.servicio}`)
    for (const k of ORDEN_MODULOS) assert.ok(BASE[i][k]?.nombre && BASE[i][k]?.corto && BASE[i][k]?.descripcion, `${i}: módulo ${k}`)
  }
  assert.ok(!/[—–]/.test(JSON.stringify(TRAD) + JSON.stringify(BASE)), 'sin rayas largas')
})

test('filtro por módulo: Sensores trae solo lo suyo; filtro por servicio: Google en AI Chat, Avisos y Biblioteca', () => {
  const sensores = integracionesDe('dashboard_sensores')
  assert.equal(sensores.length, 9)
  const luz = resaltado({ tipo: 'modulo', id: 'dashboard_sensores' })
  assert.deepEqual([...luz.modulos], ['dashboard_sensores'])
  assert.deepEqual([...luz.conectores].sort(), ['equipos', 'http'])
  assert.ok(luz.servicios.has('wiseconn') && !luz.servicios.has('claude'))
  assert.deepEqual(modulosDeServicio('google').sort(), ['chat_ia', 'documentos', 'recomendaciones'])
  const g = resaltado({ tipo: 'servicio', id: 'google' })
  assert.ok(g.lineas.has('c:ia>google') && !g.lineas.has('c:ia>claude'))
})

test('la lista de integraciones de la región sigue el filtro con categorías que existen en el directorio', () => {
  const slugs = new Set(CATEGORIAS.map((c) => c.slug))
  assert.deepEqual(Object.keys(CATEGORIAS_MODULO).sort(), [...ORDEN_MODULOS].sort())
  for (const [k, cats] of Object.entries(CATEGORIAS_MODULO)) for (const c of cats) assert.ok(slugs.has(c), `${k}: ${c} no es una categoría`)
  const filas = [...DESTACADAS.chile, ...DESTACADAS.latam]
  assert.ok(filas.some((f) => f.categorias.some((c) => CATEGORIAS_MODULO.dashboard_sensores.includes(c))), 'Sensores tiene al menos una destacada')
})

test('las cifras de la portada salen de los datos y no mezclan integraciones activas con el directorio', () => {
  const r = resumen()
  assert.equal(r.servicios, SERVICIOS.length)
  assert.equal(r.activas + r.porEstado.proximamente + r.porEstado.pedido, SERVICIOS.length)
  const comun = leer('../../src/i18n/textos/comun.js')
  assert.ok(!new RegExp(`${DESTACADAS.total_directorio} integraciones`).test(comun + leer('../../src/pages/Home.jsx')))
})

test('diagrama: nada se pisa y las etiquetas caben en el lienzo, en los tres idiomas', () => {
  for (const i of ['es', 'en', 'pt']) {
    const cortos = etiquetas(i)
    assert.deepEqual(solapes(cajasDiagrama(cortos)), [], `solapes en ${i}`)
    const { modulos, conectores, servicios, lineas } = plano(cortos)
    assert.equal(modulos.length, 12)
    assert.equal(conectores.length, CONECTORES.length)
    assert.equal(servicios.length, SERVICIOS.length)
    for (const p of [...modulos, ...conectores, ...servicios]) assert.ok(Math.hypot(p.x, p.y) < GEO.medio, 'dentro del lienzo')
    assert.ok(lineas.every((l) => /^M [-\d.]+ [-\d.]+ Q /.test(l.d)))
  }
  assert.ok(dentroDelLienzo())
})
