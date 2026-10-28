// Evaluación (/evaluacion): textos en es/en/pt, opciones que se envían al API y estado inicial.
// Uso: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import * as E from '../../src/lib/evaluacion.js'
import TEXTOS from '../../src/i18n/textos/evaluacion.js'
import OPCIONES from '../../src/i18n/datos/evaluacion.js'

const leer = (ruta) => readFileSync(new URL(ruta, import.meta.url), 'utf8')
const IDIOMAS = ['es', 'en', 'pt']
const variables = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()

// Valores que guarda y lee la plataforma (admin y api/src/predios/catalogo.js): el texto en español de
// cada opción, o su id. No se traducen ni se renombran.
const VALORES = {
  ANALISIS: ["Suelo","Foliar","Agua de riego","Solución de fertirriego","Fruto / calidad de cosecha","Ninguno","Otros"],
  APOYOS_PRODUCTORES: ["Semillas / plantines","Fertilizantes y fitosanitarios","Equipos de riego","Financiamiento / anticipos","Maquinaria y cosecha","Asistencia técnica","Otros"],
  COMO_QUIERE_VER: ["Un panel central con todos los campos","Alertas en el celular","Reportes periódicos por email","Comparar campos o productores","Reuniones semanales con el experto"],
  CONECTIVIDAD: ["buena","parcial","sin","otro"],
  CULTIVOS: ["Palto","Arándano","Tomate","Limonero","Cerezo","Uva de mesa","Vid vinífera","Nogal","Manzano","Avellano europeo","Ciruelo","Kiwi","Mandarino y naranjo","Olivo","Almendro","Peral","Frambuesa y frutilla","Hortalizas","Papa","Maíz","Trigo y cereales","Remolacha","Semilleros","Praderas y forrajes","Flores / Viveros"],
  FORMAS_APLICACION: ["Pulverizador de barra","Nebulizador / turbonebulizador","Bomba de espalda","Dron","Aplicación aérea","Por el riego (quimigación)","Otros"],
  FORMAS_FERTILIZACION: ["Fertirriego por goteo","Al voleo manual","Abonadora / trompo con tractor","Localizado al trasplante o siembra","Foliar con pulverizador","Dron","Aplicación aérea (avión / helicóptero)","Enmiendas orgánicas (guano, compost)","Otros"],
  FUENTES: ["INIA","INDAP","FAO","SAG","ODEPA","Clima (DMC / Agromet)","CIREN","Otros"],
  INTERES: ["si","tal","no"],
  LICENCIAS: ["self","full","saas","otro"],
  MARCAS_SENSORES: ["HSTI","WiseConn / DropControl","CropX","METER Group / ZENTRA Cloud","Sencrop","Pessl Instruments / METOS","Davis Instruments / WeatherLink","Sensoterr","Sentek / IrriMAX Live","Arable","xFarm Technologies","SupPlant","Doktar","EOS Data Analytics","GeoPard Agriculture","Teralytic","AgriWebb","John Deere Operations Center","Trimble Agriculture","Ranch Systems","Hortau"],
  MEDIR: ["Humedad de suelo","Clima / estación meteorológica","Caudal y presión de riego","Heladas / temperatura","Nutrientes / conductividad (EC)","Imágenes satelitales o drones"],
  MODELOS_PRODUCTIVOS: ["propio","asociado","mixto"],
  MODOS_IA: ["SLM (local)","Cloud (API)","Híbrida","Otros"],
  MODULOS: ["dashboard","trazabilidad","ai","docs","fuentes","eventos","tienda"],
  PLAZOS: ["temporada","proxima","explorando","otro"],
  PRIORIDADES: ["Rendimiento (t/ha)","Calidad (Brix, calibre, pH)","Ahorro de agua","Reducir costos","Trazabilidad campo a planta","Coordinación de cosecha","Sanidad y alertas tempranas","Adopción tecnológica de productores"],
  QUIEN_REVISA: ["gerencia","jefe","asesor","nadie","otro"],
  REGISTROS: ["WhatsApp","Planillas Excel","Cuaderno de campo","Software / ERP agrícola","No llevamos registros","Otros"],
  SI_NO: ["si","no","otro"],
  TIPOS_RIEGO: ["Goteo","Surco / tendido","Aspersión / pivote","Microaspersión","Secano","Otros"],
  TOMATE_COSECHA: ["mecanizada","manual","ambas","otro"],
  TOMATE_ESTABLECIMIENTO: ["trasplante","siembra","ambos","otro"],
  TOMATE_PROBLEMAS: ["Polilla del tomate (Tuta absoluta)","Gusano del fruto (Helicoverpa)","Mosquita blanca","Nematodos","Tizón tardío (Phytophthora)","Tizón temprano (Alternaria)","Oídio","Cancro bacteriano (Clavibacter)","Peca / mancha bacteriana","Virosis","Pudrición apical","Golpe de sol","Partidura de fruto","Madurez dispareja a cosecha","Bajo °Brix en recepción","Malezas (correhuela, chufa)","Otros"],
  TOMATE_RECEPCION: ["°Brix","Color","pH","Defectos y daño","Mohos","Descuentos / rechazos por carga","Otros"],
  TOMATE_TIPOS: ["Industrial (pasta / concentrado)","Consumo fresco al aire libre","Invernadero","Otros"],
  USUARIOS: ["admins","agricultores","asesores","capacitadores"],
  VARIABLES_SENSORES: ["Humedad de suelo","Clima / estación meteorológica","Caudal y presión de riego","Heladas / temperatura","Nutrientes / conductividad (EC)","Imágenes satelitales o drones","Otros"],
  VER_DATA: ["App o web del proveedor","Planillas / exporto a Excel","Nos llegan reportes de un asesor","Tenemos los sensores pero no revisamos la data","Otros"],
}

test('es, en y pt tienen las mismas claves "eval." y las mismas variables', () => {
  const es = Object.keys(TEXTOS.es)
  assert.ok(es.length > 100)
  for (const i of IDIOMAS) {
    const claves = Object.keys(TEXTOS[i])
    assert.ok(claves.every((k) => k.startsWith('eval.')), `${i}: toda clave empieza con eval.`)
    assert.deepEqual([...claves].sort(), [...es].sort(), `${i}: mismas claves que es`)
    for (const k of es) {
      assert.equal(typeof TEXTOS[i][k], 'string', `${i} ${k}`)
      assert.ok(TEXTOS[i][k].trim(), `${i} ${k} vacío`)
      assert.deepEqual(variables(TEXTOS[i][k]), variables(TEXTOS.es[k]), `${i} ${k}: variables`)
    }
  }
})

test('las opciones que se envían al API siguen siendo las de antes', () => {
  for (const [lista, valores] of Object.entries(VALORES)) {
    const actual = E[lista].map((x) => (typeof x === 'string' ? x : x.id))
    assert.deepEqual(actual, valores, lista)
  }
  assert.equal(E.OTROS, 'Otros')
  assert.deepEqual([...E.FUENTES_EN_PANTALLA].sort(), [...E.FUENTES].sort(), 'FUENTES_EN_PANTALLA solo reordena')
})

test('el orden en pantalla no cambia los valores', () => {
  const etiqueta = (s) => OPCIONES.en[s] ?? s
  const cultivos = E.cultivosEnOrden(etiqueta, 'en')
  assert.deepEqual([...cultivos].sort(), [...E.CULTIVOS].sort())
  assert.deepEqual(cultivos.slice(0, 4), E.CULTIVOS.slice(0, 4))
  const resto = cultivos.slice(4).map(etiqueta)
  assert.deepEqual(resto, [...resto].sort((a, b) => a.localeCompare(b, 'en')), 'el resto va en orden alfabético')
  assert.deepEqual([...E.marcasEnOrden('es')].sort(), [...E.MARCAS_SENSORES].sort())
})

// Todo texto en español de las listas que se ve en la página. Las marcas de sensores no se traducen; los
// insumos los traduce src/lib/productosAgro.js.
function textosVisibles() {
  const out = new Set()
  const agregar = (s) => s && out.add(s)
  for (const [k, v] of Object.entries(E)) {
    if (!Array.isArray(v) || k === 'MARCAS_SENSORES') continue
    for (const x of v) {
      if (typeof x === 'string') agregar(x)
      else ['label', 'desc', 'hint', 'badge', 'titulo', 'texto'].forEach((c) => agregar(x[c]))
    }
  }
  E.MODOS_IA.forEach((m) => agregar(m.id))
  return out
}

test('cada opción visible tiene texto en inglés y portugués', () => {
  const visibles = textosVisibles()
  for (const i of ['en', 'pt']) {
    const faltan = [...visibles].filter((s) => !(typeof OPCIONES[i][s] === 'string' && OPCIONES[i][s].trim()))
    assert.deepEqual(faltan, [], `${i}: faltan traducciones`)
  }
  for (const i of IDIOMAS) {
    const sobran = Object.keys(OPCIONES[i]).filter((s) => !visibles.has(s))
    assert.deepEqual(sobran, [], `${i}: claves que no son un texto de las listas (¿cambió el español?)`)
  }
})

test('src/i18n/datos/evaluacion.js no repite claves dentro de un idioma', () => {
  const fuente = leer('../../src/i18n/datos/evaluacion.js')
  const bloques = fuente.split(/^ {2}(?:es|en|pt): \{\r?$/m).slice(1)
  assert.equal(bloques.length, 3)
  for (const b of bloques) {
    const claves = [...b.matchAll(/^ {4}"((?:[^"\\]|\\.)+)":/gm)].map((m) => m[1])
    assert.ok(claves.length > 10)
    const repetidas = claves.filter((k, i) => claves.indexOf(k) !== i)
    assert.deepEqual(repetidas, [])
  }
})

test('estado inicial sin respuestas precargadas', () => {
  for (const [k, v] of Object.entries(E.estadoInicial)) {
    if (k === 'zonas') continue
    if (Array.isArray(v)) assert.deepEqual(v, [], k)
    else if (v && typeof v === 'object') assert.deepEqual(v, {}, k)
    else assert.ok(v === '' || v === null, `${k} = ${v}`)
  }
  assert.deepEqual(E.estadoInicial.zonas, [{ nombre: '', hectareas: null, agricultores: null }])
  assert.equal(E.avance(E.estadoInicial), 0)
  assert.deepEqual(E.insights(E.estadoInicial), [])
})

test('el resumen para el equipo no inventa números sin responder e indica el idioma', () => {
  assert.deepEqual(E.resumenRespuestas(E.estadoInicial), ['Cultivos: sin especificar'])
  const r = {
    ...E.estadoInicial, idioma: 'pt', hectareas: 1200, licencia: 'saas', soporte: 2, agricultores: 30,
    zonas: [{ nombre: 'Norte', hectareas: 800, agricultores: null }, E.nuevaZona()],
  }
  const l = E.resumenRespuestas(r)
  assert.ok(l.includes('Idioma del formulario: portugués'))
  assert.ok(l.includes('Superficie total: 1.200 ha'))
  assert.ok(l.includes('Zona Norte: 800 ha'), 'la zona vacía no aparece')
  assert.equal(l.filter((x) => x.startsWith('Zona ')).length, 1)
  assert.ok(l.includes('Licencia: Mes a mes (SaaS)'))
  assert.ok(l.includes('Soporte: 2 año(s)'))
  assert.ok(l.includes('Usuarios: 30 agricultores'))
})

// Respuestas que activan todas las recomendaciones del diagnóstico preliminar
function escenarios() {
  const base = E.estadoInicial
  const zona = (ha) => ({ nombre: 'x', hectareas: ha, agricultores: null })
  const cinco = (lista) => Object.fromEntries(lista.map((x) => [x, 5]))
  return [
    { ...base, modelo: 'asociado', productores: 1 },
    { ...base, modelo: 'mixto', productores: 12 },
    { ...base, modelo: 'asociado' },
    { ...base, cultivos: ['Tomate'] },
    { ...base, cultivos: [...E.CULTIVOS], tomateTipos: [...E.TOMATE_TIPOS], tomateCosecha: 'mecanizada', tomateProblemas: [...E.TOMATE_PROBLEMAS] },
    { ...base, riegos: ['Goteo'], programadorRiego: 'x', fertilizacion: ['Fertirriego por goteo', 'Dron'], analisis: ['Ninguno'] },
    { ...base, riegos: ['Surco / tendido'], registros: ['No llevamos registros'] },
    { ...base, riegos: ['Secano'], registros: ['WhatsApp'] },
    { ...base, tieneSensores: 'si', verData: ['Tenemos los sensores pero no revisamos la data'] },
    { ...base, tieneSensores: 'si', marcas: ['HSTI', 'CropX'] },
    { ...base, tieneSensores: 'si' },
    { ...base, tieneSensores: 'no', conectividad: 'sin' },
    { ...base, hectareas: 900 },
    { ...base, hectareas: 900, zonas: [zona(400), zona(500)] },
    { ...base, zonas: [{ nombre: 'a', hectareas: null, agricultores: 3 }, { nombre: 'b', hectareas: null, agricultores: 2 }] },
    { ...base, prioridades: cinco(E.PRIORIDADES), comoVer: cinco(E.COMO_QUIERE_VER), capacitacion: 'si', licencia: 'self' },
  ]
}

test('cada recomendación tiene su texto en el diccionario, y no sobran textos', () => {
  const usadas = new Set()
  for (const r of escenarios()) {
    for (const x of E.insights(r)) {
      const base = `eval.ins.${x.clave}`
      if (x.opcion) assert.ok(OPCIONES.en[x.opcion], `${base}: la opción ${x.opcion} tiene etiqueta`)
      else { assert.ok(TEXTOS.es[`${base}.titulo`], `${base}.titulo`); usadas.add(`${base}.titulo`) }
      const textos = x.n !== undefined ? [`${base}.texto.uno`, `${base}.texto.otros`] : [`${base}.texto`]
      for (const k of textos) {
        assert.ok(TEXTOS.es[k], k)
        usadas.add(k)
        for (const v of variables(TEXTOS.es[k])) {
          assert.ok(v === 'n' && x.n !== undefined ? true : x.vars?.[v] !== undefined, `${k}: falta {${v}}`)
        }
      }
    }
  }
  const sobran = Object.keys(TEXTOS.es).filter((k) => k.startsWith('eval.ins.') && !usadas.has(k))
  assert.deepEqual(sobran, [])
})

test('textos sin rayas largas ni ejemplos de un solo país', () => {
  const todos = IDIOMAS.flatMap((i) => [...Object.values(TEXTOS[i]), ...Object.values(OPCIONES[i])])
  assert.deepEqual(todos.filter((s) => s.includes('—')), [], 'sin rayas largas (no-ai-slop)')
  assert.deepEqual(todos.filter((s) => /\+56|Tilcoco|\.cl\b/.test(s)), [])
  const pagina = leer('../../src/pages/Evaluacion.jsx')
  assert.ok(!/es-CL|\+56|Tilcoco/.test(pagina), 'la página no fija formato ni ejemplos de Chile')
  const placeholders = [...pagina.matchAll(/placeholder="([^"]*)"/g)].map((m) => m[1])
  assert.deepEqual(placeholders, ['ha'], 'los placeholders con texto salen del diccionario')
})
