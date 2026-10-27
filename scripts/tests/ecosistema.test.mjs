// Diagrama del ecosistema: resumen del catálogo por categoría, Fisaro, sistemas generales y geometría.
// Uso: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { partesNombre, resumenPorCategoria } from '../apis/ecosistema.mjs'
import { APIS, CATEGORIAS } from '../apis/lib.mjs'
import {
  SISTEMAS_GENERALES, FISARO, GEO, fisaroEnCatalogo, envolver, anilloAgro, ranurasSistemas, cajasDiagrama, solapes,
  propsDetalle,
} from '../../src/lib/ecosistema.js'

const leer = (ruta) => readFileSync(new URL(ruta, import.meta.url), 'utf8')
const DESTACADAS = JSON.parse(leer('../../data/apis/destacadas.json'))
const CORTOS = [...leer('../../src/lib/modulos.js').matchAll(/corto: "([^"]+)"/g)].map((m) => m[1])

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

test('destacadas.json trae el resumen por categoría al día con el catálogo', () => {
  assert.deepEqual(DESTACADAS.categorias, resumenPorCategoria(APIS, CATEGORIAS), 'correr npm run apis')
  assert.equal(DESTACADAS.total_directorio, APIS.length)
  assert.equal(DESTACADAS.categorias.length, CATEGORIAS.length, 'todas las categorías tienen integraciones')
})

test('Fisaro no está en el catálogo sincronizado: el diagrama lo agrega solo ahí', () => {
  const crudo = JSON.parse(leer('../../data/apis/integraciones.json'))
  assert.ok(!crudo.some((a) => /fisaro/i.test(`${a.nombre} ${a.slug} ${a.proveedor}`)),
    'si el catálogo suma Fisaro, quitar FISARO de src/lib/ecosistema.js')
  assert.equal(fisaroEnCatalogo(DESTACADAS.categorias), false)
  assert.ok(CATEGORIAS.some((c) => c.slug === FISARO.categoria), 'la categoría de Fisaro existe')
})

test('anilloAgro ubica a Fisaro después de su categoría, o al final, y lo omite si ya está', () => {
  const cats = [{ slug: 'x' }, { slug: FISARO.categoria }, { slug: 'y' }]
  assert.deepEqual(anilloAgro(cats, true).map((r) => r.tipo === 'fisaro' ? 'F' : r.c.slug), ['x', FISARO.categoria, 'F', 'y'])
  assert.deepEqual(anilloAgro([{ slug: 'x' }], true).map((r) => r.tipo), ['cat', 'fisaro'])
  assert.deepEqual(anilloAgro(cats, false).map((r) => r.tipo), ['cat', 'cat', 'cat'])
  assert.equal(fisaroEnCatalogo([{ top: [{ slug: 'fisaro', nombre: 'Fisaro' }] }]), true)
})

test('sistemas generales agrupados por tipo, solo texto', () => {
  assert.deepEqual(SISTEMAS_GENERALES, [
    { tipo: 'IA', items: ['Claude', 'OpenAI', 'Higgsfield'] },
    { tipo: 'Mensajería', items: ['WhatsApp', 'Telegram'] },
    { tipo: 'CRM / ventas', items: ['HubSpot', 'Salesforce', 'Kommo'] },
    { tipo: 'ERP / facturación', items: ['Odoo', 'Lioren', 'Manager'] },
    { tipo: 'Redes', items: ['Instagram', 'Facebook'] },
  ])
  assert.equal(ranurasSistemas().length, 5 + 13)
})

test('envolver deja los nombres en hasta 2 líneas de 14 caracteres', () => {
  for (const c of CATEGORIAS) {
    const l = envolver(c.nombre, 14, 2)
    assert.ok(l.length <= 2 && l.every((x) => x.length <= 14), `${c.nombre} → ${JSON.stringify(l)}`)
  }
  // Si no cabe, la última línea se corta con "…" sin pasarse del ancho
  assert.deepEqual(envolver('uno dos tres cuatro cinco seis', 8, 2), ['uno dos', 'tres cu…'])
})

test('el SVG no tiene textos que se pisen y cabe en el viewBox', () => {
  assert.equal(CORTOS.length, 12, '12 módulos con nombre corto')
  const cajas = cajasDiagrama({ cortos: CORTOS, anillo: anilloAgro(DESTACADAS.categorias) })
  assert.deepEqual(solapes(cajas), [])
  const extremo = Math.max(...cajas.map((b) => Math.max(-b.x0, b.x1, -b.y0, b.y1)))
  assert.ok(extremo <= GEO.medio, `extremo ${extremo.toFixed(0)} > ${GEO.medio}`)
  // Con los radios anteriores había dos textos encimados: la prueba los detecta
  const antes = cajasDiagrama({ cortos: CORTOS, anillo: anilloAgro(DESTACADAS.categorias), geo: { ...GEO, R: { centro: 92, modulos: 205, agro: 350, sistemas: 505 } } })
  assert.ok(solapes(antes).length > 0)
})

test('Fisaro y los sistemas generales muestran su detalle con teclado y foco, no solo con el mouse', () => {
  let veces = 0
  const p = propsDetalle(() => veces++, 'Fisaro, integración: asistente', 'panel-1')
  assert.equal(p.tabIndex, 0, 'se llega con Tab')
  assert.equal(p.role, 'button')
  assert.equal(p['aria-label'], 'Fisaro, integración: asistente')
  assert.equal(p['aria-controls'], 'panel-1')
  p.onFocus(); p.onMouseEnter(); p.onClick()
  assert.equal(veces, 3)
  let prevenidas = 0
  for (const key of ['Enter', ' ', 'Tab', 'Escape', 'a']) p.onKeyDown({ key, preventDefault: () => prevenidas++ })
  assert.equal(veces, 5, 'Enter y Espacio muestran el detalle')
  assert.equal(prevenidas, 2, 'Tab y las demás teclas siguen su curso')
  const diagrama = leer('../../src/components/EcosystemDiagram.jsx')
  assert.equal(diagrama.match(/\{\.\.\.propsDetalle\(/g).length, 2, 'Fisaro y cada grupo de sistemas')
  assert.ok(diagrama.includes('<Detalle foco={foco} id={panelId} />'), 'el panel del detalle tiene el id de aria-controls')
})
