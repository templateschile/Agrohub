// Ecosistema de la portada: resumen del catálogo por categoría (directorio /apis) y el diagrama interactivo
// (src/lib/ecosistema.js): datos, estados, filtro y geometría en los tres idiomas. Uso: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { partesNombre, resumenPorCategoria } from '../apis/ecosistema.mjs'
import { APIS, CATEGORIAS } from '../apis/lib.mjs'
import {
  ESTADOS, ORDEN_MODULOS, CONECTORES, SERVICIOS, INTEGRACIONES, GEO, integracionesDe,
  modulosDeServicio, estadoDeServicio, resumen, resaltado, plano, cajasDiagrama, solapes, dentroDelLienzo,
} from '../../src/lib/ecosistema.js'
import BASE from '../../src/i18n/datos/modulos-base.js'
import TRAD from '../../src/i18n/datos/ecosistema.js'
import { INTEGRACIONES as FICHAS } from '../../src/lib/integraciones.js'

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

test('el anillo tiene los 10 módulos del sitio y el que viene (Insumos y bodega), una vez cada uno', () => {
  assert.equal(Object.keys(CORTOS_ES).length, 10)
  assert.deepEqual([...ORDEN_MODULOS].sort(), [...Object.keys(CORTOS_ES), 'insumos'].sort())
  assert.ok(!('insumos' in CORTOS_ES), 'Insumos y bodega no está en la plataforma: no va en lib/modulos.js')
  for (const i of ['es', 'en', 'pt']) assert.ok(BASE[i].insumos?.nombre && BASE[i].insumos?.descripcion, `insumos (${i})`)
})

test('el cuaderno de campo es del predio, sin marcas de terceros: va en bitácora, no en Fuentes; Insumos no tiene nada conectado', () => {
  assert.ok(INTEGRACIONES.some((f) => f.modulo === 'bitacora' && f.conector === 'registros' && f.servicio === null && f.estado === 'conectada'))
  assert.ok(!integracionesDe('fuentes').some((f) => f.conector === 'registros'))
  assert.ok(!/kadi|modag/i.test(JSON.stringify([CONECTORES, SERVICIOS, INTEGRACIONES, TRAD])), 'sin Kadi ni MODAG en el sitio')
  assert.ok(integracionesDe('insumos').length > 0 && integracionesDe('insumos').every((f) => f.estado !== 'conectada'))
  assert.match(FUENTE_MODULOS, /nombre: "Cuaderno de campo"/)
  assert.equal(BASE.en.bitacora.nombre, 'Field notebook')
  assert.equal(BASE.pt.bitacora.nombre, 'Caderno de campo')
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
  for (const id of ['sii', 'kommo', 'aws', 'azure', 'sap', 'telegram', 'mercado-publico', 'fisaro']) {
    assert.equal(estadoDeServicio(id), 'pedido', `${id} es a pedido`)
  }
  for (const id of ['wiseconn', 'meter', 'sentek', 'cropx', 'pessl', 'davis', 'lorawan', 'ceaza', 'arclim', 'sag', 'dga', 'banco-central', 'cne']) {
    assert.equal(estadoDeServicio(id), 'proximamente', `${id} está planificado, no conectado`)
  }
  for (const id of ['claude', 'openai', 'google', 'inia', 'agromet-inia', 'dmc', 'open-meteo', 'odepa']) {
    assert.equal(estadoDeServicio(id), 'conectada', `${id} está en el código`)
  }
})

test('las agencias públicas dicen de qué país son: el sitio no presenta las de Chile como si fueran de todos', () => {
  for (const id of ['inia', 'agromet-inia', 'ceaza', 'dmc', 'ciren', 'conaf', 'odepa', 'arclim', 'sag', 'dga', 'banco-central', 'cne', 'mercado-publico', 'sii']) {
    const s = SERVICIOS.find((x) => x.id === id)
    assert.match(s.que, /Chile/, `${id} (es)`)
    assert.match(TRAD.en.servicios[id], /Chile/, `${id} (en)`)
    assert.match(TRAD.pt.servicios[id], /Chile/, `${id} (pt)`)
  }
})

test('traducciones del ecosistema completas en inglés y portugués', () => {
  for (const i of ['en', 'pt']) {
    for (const c of CONECTORES) assert.ok(TRAD[i].conectores[c.id]?.nombre && TRAD[i].conectores[c.id]?.etiqueta?.length, `${i}: conector ${c.id}`)
    for (const c of CONECTORES.filter((x) => x.propio)) assert.ok(TRAD[i].conectores[c.id]?.propio, `${i}: propio de ${c.id}`)
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
    assert.equal(modulos.length, 11)
    assert.equal(conectores.length, CONECTORES.length)
    assert.equal(servicios.length, SERVICIOS.length)
    for (const p of [...modulos, ...conectores, ...servicios]) assert.ok(Math.hypot(p.x, p.y) < GEO.medio, 'dentro del lienzo')
    assert.ok(lineas.every((l) => /^M [-\d.]+ [-\d.]+ Q /.test(l.d)))
  }
  assert.ok(dentroDelLienzo())
})

test('sin fases fenológicas ni drones, y la Feria Digital sin nombrar plataformas de comercio electrónico', () => {
  const todo = JSON.stringify([ORDEN_MODULOS, CONECTORES, SERVICIOS, INTEGRACIONES, TRAD, BASE])
  for (const x of [/fenolog/i, /phenolog/i, /\bdron/i, /\bdrone/i, /woocommerce/i, /mercado ?pago/i, /shopify/i]) assert.ok(!x.test(todo), `aparece ${x}`)
  for (const f of integracionesDe('tienda')) assert.ok(f.servicio === null || f.servicio === 'sii', `Feria Digital: ${f.servicio}`)
})

test('fuentes públicas de Chile alrededor del centro, cada una con su página de integración', () => {
  for (const id of ['agromet-inia', 'ceaza', 'dmc', 'odepa', 'ciren', 'arclim', 'sag', 'dga']) assert.ok(SERVICIOS.some((s) => s.id === id), `falta ${id}`)
  const slugs = new Set(FICHAS.map((f) => f.slug))
  for (const s of SERVICIOS.filter((x) => x.integracion)) assert.ok(slugs.has(s.integracion), `${s.id}: /integraciones/${s.integracion} no existe`)
  assert.equal(SERVICIOS.find((s) => s.id === 'agromet-inia').integracion, 'agrometeorologia-inia')
  assert.equal(SERVICIOS.find((s) => s.id === 'ceaza').integracion, 'ceaza-met')
})
