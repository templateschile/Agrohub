// Preguntas del formulario de evaluación (3 pasos + contacto), resumen para el aviso
// y reglas del "diagnóstico preliminar". El admin de la plataforma tiene una copia de los catálogos
// (admin-web/src/lib/site/evaluacion.ts).
// Toda pregunta ofrece "Otros" con texto libre (no hay opción "No sé").
//
// Idiomas: los textos en español de estas listas son también los valores que se envían al API y se
// guardan (el admin y api/src/predios/catalogo.js los usan como id). No se traducen aquí. Lo que se
// muestra en inglés y portugués está en src/i18n/datos/evaluacion.js (por texto en español) y los
// textos de la página y del diagnóstico preliminar en src/i18n/textos/evaluacion.js (claves "eval.").

export const OTROS = "Otros"

// ── Paso 1: estado actual ────────────────────────────────────────
// La página no muestra este orden: muestra los cuatro primeros y el resto por orden alfabético del
// idioma activo (cultivosEnOrden).
export const CULTIVOS = [
  "Palto", "Arándano", "Tomate", "Limonero",
  "Cerezo", "Uva de mesa", "Vid vinífera", "Nogal", "Manzano", "Avellano europeo",
  "Ciruelo", "Kiwi", "Mandarino y naranjo", "Olivo", "Almendro", "Peral",
  "Frambuesa y frutilla", "Hortalizas", "Papa", "Maíz", "Trigo y cereales",
  "Remolacha", "Semilleros", "Praderas y forrajes", "Flores / Viveros",
]
const CULTIVOS_PRIMEROS = 4

export const MODELOS_PRODUCTIVOS = [
  { id: "propio",   label: "Solo campos propios",        desc: "Producimos toda la superficie con equipo propio" },
  { id: "asociado", label: "Productores asociados",      desc: "Entregamos insumos o apoyo y compramos su producción" },
  { id: "mixto",    label: "Mixto: propios + asociados", desc: "Parte propia y parte con productores bajo contrato" },
]

export const APOYOS_PRODUCTORES = [
  "Semillas / plantines", "Fertilizantes y fitosanitarios", "Equipos de riego",
  "Financiamiento / anticipos", "Maquinaria y cosecha", "Asistencia técnica", OTROS,
]

export const TIPOS_RIEGO = ["Goteo", "Surco / tendido", "Aspersión / pivote", "Microaspersión", "Secano", OTROS]

export const FORMAS_FERTILIZACION = [
  "Fertirriego por goteo", "Al voleo manual", "Abonadora / trompo con tractor",
  "Localizado al trasplante o siembra", "Foliar con pulverizador", "Dron",
  "Aplicación aérea (avión / helicóptero)", "Enmiendas orgánicas (guano, compost)", OTROS,
]

export const FORMAS_APLICACION = [
  "Pulverizador de barra", "Nebulizador / turbonebulizador", "Bomba de espalda",
  "Dron", "Aplicación aérea", "Por el riego (quimigación)", OTROS,
]

export const ANALISIS = ["Suelo", "Foliar", "Agua de riego", "Solución de fertirriego", "Fruto / calidad de cosecha", "Ninguno", OTROS]

export const REGISTROS = ["WhatsApp", "Planillas Excel", "Cuaderno de campo", "Software / ERP agrícola", "No llevamos registros", OTROS]

// Seleccion unica: "otro" abre un campo de texto
export const SI_NO = [
  { id: "si",   label: "Sí" },
  { id: "no",   label: "No" },
  { id: "otro", label: OTROS },
]

// ── Tomate: preguntas que aparecen solo si se marca el cultivo ────
export const TOMATE_TIPOS = ["Industrial (pasta / concentrado)", "Consumo fresco al aire libre", "Invernadero", OTROS]

export const TOMATE_ESTABLECIMIENTO = [
  { id: "trasplante", label: "Trasplante de almácigo" },
  { id: "siembra",    label: "Siembra directa" },
  { id: "ambos",      label: "Ambos" },
  { id: "otro",       label: OTROS },
]

export const TOMATE_COSECHA = [
  { id: "mecanizada", label: "Mecanizada" },
  { id: "manual",     label: "Manual" },
  { id: "ambas",      label: "Ambas" },
  { id: "otro",       label: OTROS },
]

export const TOMATE_PROBLEMAS = [
  "Polilla del tomate (Tuta absoluta)", "Gusano del fruto (Helicoverpa)", "Mosquita blanca",
  "Nematodos", "Tizón tardío (Phytophthora)", "Tizón temprano (Alternaria)", "Oídio",
  "Cancro bacteriano (Clavibacter)", "Peca / mancha bacteriana", "Virosis",
  "Pudrición apical", "Golpe de sol", "Partidura de fruto", "Madurez dispareja a cosecha",
  "Bajo °Brix en recepción", "Malezas (correhuela, chufa)", OTROS,
]

export const TOMATE_RECEPCION = ["°Brix", "Color", "pH", "Defectos y daño", "Mohos", "Descuentos / rechazos por carga", OTROS]

// ── Sensores ─────────────────────────────────────────────────────
// La página las muestra en orden alfabético
export const MARCAS_SENSORES = [
  "HSTI", "WiseConn / DropControl", "CropX", "METER Group / ZENTRA Cloud", "Sencrop",
  "Pessl Instruments / METOS", "Davis Instruments / WeatherLink", "Sensoterr",
  "Sentek / IrriMAX Live", "Arable", "xFarm Technologies", "SupPlant", "Doktar",
  "EOS Data Analytics", "GeoPard Agriculture", "Teralytic", "AgriWebb",
  "John Deere Operations Center", "Trimble Agriculture", "Ranch Systems", "Hortau",
]

export const VARIABLES_SENSORES = [
  "Humedad de suelo", "Clima / estación meteorológica", "Caudal y presión de riego",
  "Heladas / temperatura", "Nutrientes / conductividad (EC)", "Imágenes satelitales o drones", OTROS,
]

export const VER_DATA = [
  "App o web del proveedor", "Planillas / exporto a Excel", "Nos llegan reportes de un asesor",
  "Tenemos los sensores pero no revisamos la data", OTROS,
]

export const QUIEN_REVISA = [
  { id: "gerencia",  label: "Gerencia" },
  { id: "jefe",      label: "Jefe de campo / administrador" },
  { id: "asesor",    label: "Asesor externo" },
  { id: "nadie",     label: "Nadie en particular" },
  { id: "otro",      label: OTROS },
]

export const CONECTIVIDAD = [
  { id: "buena",   label: "Buena en todo el campo" },
  { id: "parcial", label: "Solo en algunos sectores" },
  { id: "sin",     label: "Sin señal en el campo" },
  { id: "otro",    label: OTROS },
]

// ── Paso 2: que buscas (con puntaje 1 a 5) ───────────────────────
export const PRIORIDADES = [
  "Rendimiento (t/ha)", "Calidad (Brix, calibre, pH)", "Ahorro de agua",
  "Reducir costos", "Trazabilidad campo a planta", "Coordinación de cosecha",
  "Sanidad y alertas tempranas", "Adopción tecnológica de productores",
]

export const MEDIR = VARIABLES_SENSORES.filter(v => v !== OTROS)

export const COMO_QUIERE_VER = [
  "Un panel central con todos los campos", "Alertas en el celular", "Reportes periódicos por email",
  "Comparar campos o productores", "Reuniones semanales con el experto",
]

export const PLAZOS = [
  { id: "temporada",  label: "Esta temporada" },
  { id: "proxima",    label: "Próxima temporada" },
  { id: "explorando", label: "Solo estoy explorando" },
  { id: "otro",       label: OTROS },
]

// ── Paso 3: modulos ──────────────────────────────────────────────
export const INTERES = [
  { id: "si",    label: "Me sirve" },
  { id: "tal",   label: "Tal vez" },
  { id: "no",    label: "No lo necesito" },
]

export const MODULOS = [
  { id: "dashboard",    label: "Dashboard de sensores",
    desc: "Todos tus sensores y campos en un solo panel, con alertas cuando algo se sale de rango. Se conecta con las marcas que ya usas." },
  { id: "trazabilidad", label: "Bitácora y trazabilidad",
    desc: "Registro de labores, insumos y cosecha por sector o productor, desde el celular. Permite relacionar el manejo con el resultado en planta." },
  { id: "ai",           label: "AI Chat agrícola",
    desc: "Asistente que responde consultas técnicas en lenguaje simple, apoyado en documentos confiables." },
  { id: "docs",         label: "Biblioteca técnica",
    desc: "Documentos y fichas técnicas (FAO, institutos agrícolas y otros), ordenados y con buscador para tu equipo." },
  { id: "fuentes",      label: "Fuentes externas de información",
    desc: "Clima, alertas y datos públicos de la FAO, institutos agrícolas y servicios meteorológicos, junto a tus datos." },
  { id: "eventos",      label: "Capacitaciones y eventos",
    desc: "Calendario de días de campo, videos demostrativos y formación de extensionistas en tu equipo." },
  { id: "tienda",       label: "Marketplace",
    desc: "Compra de insumos y oferta de productos entre productores de la red." },
]

export const MODOS_IA = [
  { id: "SLM (local)", desc: "Corre en tu servidor. Los datos no salen de la empresa." },
  { id: "Cloud (API)", desc: "Más potente, requiere internet." },
  { id: "Híbrida",     desc: "Local para lo sensible, nube para lo demás." },
  { id: OTROS,         desc: "Cuéntanos qué necesitas." },
]

export const FUENTES = ["INIA", "INDAP", "FAO", "SAG", "ODEPA", "Clima (DMC / Agromet)", "CIREN", OTROS]
// Orden en pantalla: primero las fuentes que sirven en cualquier país; las de un solo país llevan el
// país en su etiqueta (src/i18n/datos/evaluacion.js)
export const FUENTES_EN_PANTALLA = ["FAO", "INIA", "Clima (DMC / Agromet)", "INDAP", "SAG", "ODEPA", "CIREN", OTROS]

export const LICENCIAS = [
  { id: "self", label: "Self Hosted",      desc: "Licencia compartida + soporte + código fuente admin y app", badge: "Código compartido" },
  { id: "full", label: "Full Hosted",      desc: "Código completo, licencia propia, un solo pago, documentación completa", badge: "Licencia exclusiva" },
  { id: "saas", label: "Mes a mes (SaaS)", desc: "Usuarios en la app AgroHubs compartida, sin app propia", badge: "Sin inversión inicial" },
  { id: "otro", label: OTROS,              desc: "Cuéntanos qué modelo te conviene" },
]

// Traspaso tecnico incluido cuando el cliente opera su propia instancia
export const TRASPASO_TI = [
  "Onboarding técnico del equipo TI y capacitación para la migración a su infraestructura (cloud u on-premise).",
  "Handover de código fuente: repositorios, ramas, pipeline CI/CD y guía de despliegue.",
  "Documentación de arquitectura, modelo de datos, APIs y variables de entorno.",
  "Migración de datos, configuración de backups, monitoreo y logs.",
  "Transferencia de conocimiento en sesiones de pair programming y runbooks de operación.",
]
export const requiereTraspaso = r => r.licencia === "self" || r.licencia === "full"

export const USUARIOS = [
  { id: "admins",        label: "Administradores",       hint: "Gestionan la plataforma" },
  { id: "agricultores",  label: "Agricultores",          hint: "Usan la app en el campo" },
  { id: "asesores",      label: "Asesores / técnicos",   hint: "Acompañan a productores" },
  { id: "capacitadores", label: "Capacitadores por zona", hint: "Forman a otros usuarios" },
]

export const ETAPAS = [
  { titulo: "Diagnóstico previo",           texto: "Visita al campo y revisión del nivel tecnológico, la infraestructura y el equipo." },
  { titulo: "Propuesta modular",            texto: "Un kit tecnológico a tu medida. Tomas solo lo que te sirve." },
  { titulo: "Instalación y capacitación",   texto: "Instalamos sensores y herramientas, y capacitamos en el campo." },
  { titulo: "Seguimiento y extensionistas", texto: "Acompañamos la adopción y formamos referentes en tu equipo." },
  { titulo: "Plataforma AgroHubs",          texto: "Monitoreo centralizado, trazabilidad y conocimiento en un solo lugar." },
]

// Sin respuestas precargadas: el usuario elige todo. Los números sin responder son null.
export const nuevaZona = () => ({ nombre: "", hectareas: null, agricultores: null })

// `otros` guarda el texto de cada "Otros" por clave de pregunta
export const estadoInicial = {
  // Paso 1
  cultivos: [], otroCultivo: "", hectareas: null,
  zonas: [nuevaZona()],
  modelo: "", haPropias: null, productores: null, apoyos: [],
  tomateTipos: [], tomateEstablecimiento: "", tomateDensidad: null, tomateCosecha: "",
  tomateVariedad: "", tomateProblemas: [], tomateRecepcion: [],
  riegos: [], programadorRiego: "", programadorFerti: "",
  fertilizacion: [], aplicacion: [], analisis: [], productos: [], registros: [],
  tieneSensores: "", marcas: [], otraMarca: "", cantidadSensores: null, variables: [],
  verData: [], quienRevisa: "", conectividad: "",
  // Paso 2 (puntajes 1-5 por opcion)
  prioridades: {}, masSensores: "", medir: {}, comoVer: {}, plazo: "", capacitacion: "",
  puntajeOtros: {},
  // Paso 3
  modulos: {}, modoAi: "", modoDocs: "", fuentes: [], otrasFuentes: "",
  vistasKpi: null, licencia: "", soporte: null, admins: null, agricultores: null, asesores: null, capacitadores: null,
  // Textos de "Otros"
  otros: {},
}

// ── Helpers ──────────────────────────────────────────────────────
// Cultivos en pantalla: los cuatro primeros fijos y el resto por orden alfabético de su etiqueta
export const cultivosEnOrden = (etiqueta = x => x, locale = "es") => [
  ...CULTIVOS.slice(0, CULTIVOS_PRIMEROS),
  ...CULTIVOS.slice(CULTIVOS_PRIMEROS).sort((a, b) => etiqueta(a).localeCompare(etiqueta(b), locale)),
]
export const marcasEnOrden = (locale = "es") => [...MARCAS_SENSORES].sort((a, b) => a.localeCompare(b, locale, { sensitivity: "base" }))

export const listaCultivos = r => [...(r.cultivos || []), ...(r.otroCultivo?.trim() ? [r.otroCultivo.trim()] : [])]
export const listaMarcas = r => [...(r.marcas || []), ...(r.otraMarca?.trim() ? [r.otraMarca.trim()] : [])]
export const cultivaTomate = r => (r.cultivos || []).includes("Tomate")
export const tomateIndustrial = r => cultivaTomate(r) && (r.tomateTipos || []).includes(TOMATE_TIPOS[0])
export const conAsociados = r => r.modelo === "asociado" || r.modelo === "mixto"
export const haAsociadas = r => r.modelo === "asociado" ? r.hectareas : Math.max(0, (r.hectareas || 0) - (r.haPropias || 0))
export const modeloLabel = r => MODELOS_PRODUCTIVOS.find(m => m.id === r.modelo)?.label || ""
export const modulosPorInteres = (r, interes) => MODULOS.filter(m => r.modulos?.[m.id] === interes)
export const respondido = v => v !== null && v !== undefined && v !== ""
const fmt = n => Number(n || 0).toLocaleString("es-CL")
// Número para el resumen: vacío si no se respondió
const num = v => respondido(v) ? fmt(v) : ""
const conUnidad = (v, unidad) => respondido(v) ? `${fmt(v)} ${unidad}` : ""

// Lista multiple: reemplaza "Otros" por el texto que escribio el usuario
export const conOtros = (r, k) => (r[k] || []).map(x => x === OTROS ? `Otros: ${r.otros?.[k]?.trim() || "sin detalle"}` : x)
// Seleccion unica
export const unica = (r, k, opciones) => r[k] === "otro"
  ? `Otros: ${r.otros?.[k]?.trim() || "sin detalle"}`
  : opciones.find(o => o.id === r[k])?.label || ""
// Puntajes: "Rendimiento 5/5, Agua 4/5" ordenado de mayor a menor, incluye el "Otros" puntuado
export function puntajes(r, k) {
  const base = Object.entries(r[k] || {}).filter(([, v]) => v > 0)
  const otro = r.otros?.[k]?.trim()
  if (otro && r.puntajeOtros?.[k] > 0) base.push([`Otros: ${otro}`, r.puntajeOtros[k]])
  return base.sort((a, b) => b[1] - a[1])
}
const txtPuntajes = (r, k) => puntajes(r, k).map(([n, v]) => `${n} ${v}/5`).join(", ")
const lista = a => a?.length ? a.join(", ") : ""

export const totalHaZonas = r => (r.zonas || []).reduce((a, z) => a + (Number(z.hectareas) || 0), 0)
export const totalAgricultoresZonas = r => (r.zonas || []).reduce((a, z) => a + (Number(z.agricultores) || 0), 0)
const zonaVacia = z => !z.nombre?.trim() && !respondido(z.hectareas) && !respondido(z.agricultores)

const IDIOMA_RESUMEN = { es: "español", en: "inglés", pt: "portugués" }

// Lineas legibles con todas las respuestas (para el aviso y el admin). Quedan en español: las lee el equipo.
export function resumenRespuestas(r) {
  const l = []
  const add = (titulo, v) => v && l.push(`${titulo}: ${v}`)
  add("Idioma del formulario", IDIOMA_RESUMEN[r.idioma])
  add("Cultivos", lista(listaCultivos(r)) || "sin especificar")
  add("Superficie total", conUnidad(r.hectareas, "ha"))
  ;(r.zonas || []).forEach((z, i) => !zonaVacia(z) && add(`Zona ${z.nombre?.trim() || i + 1}`,
    [conUnidad(z.hectareas, "ha"), conUnidad(z.agricultores, "agricultores")].filter(Boolean).join(" · ") || "sin datos"))
  add("Modelo", modeloLabel(r))
  if (r.modelo === "mixto" && respondido(r.haPropias)) add("Hectáreas", `${fmt(r.haPropias)} propias + ${fmt(haAsociadas(r))} con productores`)
  if (conAsociados(r)) {
    add("Productores asociados", num(r.productores))
    add("Apoyo a productores", lista(conOtros(r, "apoyos")))
  }
  if (cultivaTomate(r)) {
    add("Tomate · tipo", lista(conOtros(r, "tomateTipos")))
    add("Tomate · establecimiento", unica(r, "tomateEstablecimiento", TOMATE_ESTABLECIMIENTO))
    add("Tomate · densidad (plantas/ha)", num(r.tomateDensidad))
    add("Tomate · cosecha", unica(r, "tomateCosecha", TOMATE_COSECHA))
    add("Tomate · híbrido/variedad", r.tomateVariedad?.trim())
    add("Tomate · problemas", lista(conOtros(r, "tomateProblemas")))
    if (tomateIndustrial(r)) add("Tomate · descuentos en recepción", lista(conOtros(r, "tomateRecepcion")))
  }
  add("Riego", lista(conOtros(r, "riegos")))
  add("Programador de riego", r.programadorRiego?.trim())
  add("Programador de fertirriego", r.programadorFerti?.trim())
  add("Cómo fertiliza", lista(conOtros(r, "fertilizacion")))
  add("Cómo aplica fitosanitarios", lista(conOtros(r, "aplicacion")))
  add("Análisis que realiza", lista(conOtros(r, "analisis")))
  add("Productos que usa", lista(r.productos))
  add("Registros actuales", lista(conOtros(r, "registros")))
  add("¿Tiene sensores?", unica(r, "tieneSensores", SI_NO))
  if (r.tieneSensores === "si") {
    add("Marcas", lista(listaMarcas(r)))
    add("Cantidad aprox. de sensores", num(r.cantidadSensores))
    add("Qué miden", lista(conOtros(r, "variables")))
    add("Cómo ve la data", lista(conOtros(r, "verData")))
    add("Quién la revisa", unica(r, "quienRevisa", QUIEN_REVISA))
  }
  add("Conectividad en campo", unica(r, "conectividad", CONECTIVIDAD))
  add("Qué quiere mejorar", txtPuntajes(r, "prioridades"))
  add("¿Quiere más sensores?", unica(r, "masSensores", SI_NO))
  add("Qué quiere medir", txtPuntajes(r, "medir"))
  add("Cómo quiere ver la información", txtPuntajes(r, "comoVer"))
  add("Plazo", unica(r, "plazo", PLAZOS))
  add("¿Formar extensionistas?", unica(r, "capacitacion", SI_NO))
  add("Módulos que le sirven", lista(modulosPorInteres(r, "si").map(m => m.label)))
  add("Módulos que tal vez", lista(modulosPorInteres(r, "tal").map(m => m.label)))
  add("Módulos que no necesita", lista(modulosPorInteres(r, "no").map(m => m.label)))
  const usa = id => ["si", "tal"].includes(r.modulos?.[id])
  if (usa("ai")) add("Modo AI Chat", r.modoAi === OTROS ? `Otros: ${r.otros?.modoAi || ""}` : r.modoAi)
  if (usa("docs")) add("Modo biblioteca", r.modoDocs === OTROS ? `Otros: ${r.otros?.modoDocs || ""}` : r.modoDocs)
  if (usa("fuentes")) add("Fuentes externas", lista([...conOtros(r, "fuentes"), ...(r.otrasFuentes?.trim() ? [r.otrasFuentes.trim()] : [])]))
  if (usa("dashboard")) add("Vistas KPI", num(r.vistasKpi))
  add("Licencia", unica(r, "licencia", LICENCIAS))
  if (requiereTraspaso(r)) add("Incluye", "capacitación para migración y traspaso técnico de fuentes")
  add("Soporte", conUnidad(r.soporte, "año(s)"))
  add("Usuarios", USUARIOS.filter(u => respondido(r[u.id])).map(u => `${fmt(r[u.id])} ${u.label.toLowerCase()}`).join(", "))
  return l
}

// Porcentaje de avance: preguntas principales respondidas
export function avance(r) {
  const hechas = [
    listaCultivos(r).length > 0, Number(r.hectareas) > 0, Boolean(r.modelo),
    (r.riegos || []).length > 0, (r.fertilizacion || []).length > 0, (r.registros || []).length > 0,
    Boolean(r.tieneSensores), Boolean(r.conectividad),
    puntajes(r, "prioridades").length > 0, Boolean(r.masSensores), puntajes(r, "comoVer").length > 0, Boolean(r.plazo),
    Object.values(r.modulos || {}).filter(Boolean).length >= 3, Boolean(r.licencia),
  ]
  return Math.round(100 * hechas.filter(Boolean).length / hechas.length)
}

// ── Diagnóstico preliminar ───────────────────────────────────────
// Cada recomendación es { clave, vars?, n?, opcion? }. El texto está en src/i18n/textos/evaluacion.js:
// "eval.ins.<clave>.titulo" y "eval.ins.<clave>.texto" (con `n`: ".texto.uno" / ".texto.otros").
// Con `opcion`, el título es la etiqueta de esa opción (un cultivo o una prioridad).
const CULTIVOS_AGROINDUSTRIA = ["Remolacha", "Semilleros"]
const CULTIVOS_FRUTALES = ["Uva de mesa", "Vid vinífera", "Nogal", "Manzano", "Avellano europeo", "Ciruelo", "Kiwi", "Mandarino y naranjo", "Olivo", "Almendro", "Peral"]

export const INSIGHT_CULTIVO = { "Palto": "palto", "Arándano": "arandano", "Limonero": "limonero", "Cerezo": "cerezo" }

export const INSIGHT_PRIORIDAD = {
  "Rendimiento (t/ha)":                  "rendimiento",
  "Calidad (Brix, calibre, pH)":         "calidad",
  "Ahorro de agua":                      "agua",
  "Reducir costos":                      "costos",
  "Trazabilidad campo a planta":         "trazabilidad",
  "Coordinación de cosecha":             "cosecha",
  "Sanidad y alertas tempranas":         "sanidad",
  "Adopción tecnológica de productores": "adopcion",
}

function insightsTomate(r) {
  const out = []
  const industrial = tomateIndustrial(r)
  if (industrial) out.push({ clave: "tomateBrix" }, { clave: "tomateEntregas" })
  if (r.tomateCosecha === "mecanizada" || r.tomateCosecha === "ambas") out.push({ clave: "tomateMecanizada" })
  const pb = r.tomateProblemas || []
  if (pb.includes("Polilla del tomate (Tuta absoluta)")) out.push({ clave: "tuta" })
  if (pb.includes("Tizón tardío (Phytophthora)")) out.push({ clave: "tizon" })
  if (pb.includes("Pudrición apical")) out.push({ clave: "apical" })
  if (pb.includes("Bajo °Brix en recepción") || (industrial && (r.tomateRecepcion || []).length)) out.push({ clave: "recepcion" })
  if ((r.tomateTipos || []).includes("Invernadero")) out.push({ clave: "invernadero" })
  if (!out.length) out.push({ clave: "tomate" })
  return out
}

// Recomendaciones que se muestran en vivo mientras el usuario responde
export function insights(r) {
  const out = []
  const cultivos = listaCultivos(r)
  const zonas = (r.zonas || []).filter(z => !zonaVacia(z)).length
  const riegos = r.riegos || [], fertilizacion = r.fertilizacion || [], aplicacion = r.aplicacion || []
  const analisis = r.analisis || [], registros = r.registros || [], verData = r.verData || []

  if (conAsociados(r)) {
    out.push(Number(r.productores) > 0 ? { clave: "red", n: Number(r.productores) } : { clave: "redSinNumero" })
  }
  if (cultivaTomate(r)) out.push(...insightsTomate(r))
  Object.entries(INSIGHT_CULTIVO).forEach(([c, clave]) => cultivos.includes(c) && out.push({ clave: `cultivo.${clave}`, opcion: c }))
  if (cultivos.some(c => CULTIVOS_AGROINDUSTRIA.includes(c))) out.push({ clave: "agroindustria" })
  if (cultivos.some(c => CULTIVOS_FRUTALES.includes(c))) out.push({ clave: "frutales" })
  if (riegos.some(x => x === "Goteo" || x === "Microaspersión")) out.push({ clave: "riegoTecnificado" })
  else if (riegos.includes("Surco / tendido")) out.push({ clave: "riegoSurco" })
  else if (riegos.includes("Secano")) out.push({ clave: "secano" })
  if (r.programadorRiego?.trim() || r.programadorFerti?.trim()) out.push({ clave: "programador" })
  if (fertilizacion.includes("Dron") || aplicacion.includes("Dron")) out.push({ clave: "dron" })
  if (fertilizacion.includes("Fertirriego por goteo") && !analisis.includes("Solución de fertirriego")) out.push({ clave: "fertirriego" })
  if (analisis.includes("Ninguno")) out.push({ clave: "analisis" })
  if (r.tieneSensores === "si") {
    if (verData.includes("Tenemos los sensores pero no revisamos la data")) out.push({ clave: "sensoresSinUso" })
    else if (listaMarcas(r).length > 1) out.push({ clave: "sensoresMarcas", vars: { n: listaMarcas(r).length } })
    else out.push({ clave: "sensoresIntegrar" })
  } else if (r.tieneSensores === "no") {
    out.push({ clave: "sinSensores" })
  }
  if (r.conectividad === "sin" || r.conectividad === "parcial") out.push({ clave: "conectividad" })
  const ha = Number(r.hectareas) || totalHaZonas(r)
  if (zonas > 1 || ha >= 500) {
    if (zonas > 1 && ha > 0) out.push({ clave: "escalaZonas", vars: { ha, zonas } })
    else if (zonas > 1) out.push({ clave: "escalaSoloZonas", vars: { zonas } })
    else out.push({ clave: "escala", vars: { ha } })
  }
  if (registros.includes("No llevamos registros")) out.push({ clave: "registrosNinguno" })
  else if (registros.some(x => ["WhatsApp", "Cuaderno de campo", "Planillas Excel"].includes(x))) out.push({ clave: "registrosDigitalizar" })
  puntajes(r, "prioridades").filter(([, v]) => v >= 4)
    .forEach(([p]) => INSIGHT_PRIORIDAD[p] && out.push({ clave: `prioridad.${INSIGHT_PRIORIDAD[p]}`, opcion: p }))
  if ((r.comoVer?.["Reuniones semanales con el experto"] || 0) >= 4) out.push({ clave: "reuniones" })
  if (r.capacitacion === "si" || Number(r.capacitadores) > 0) out.push({ clave: "extensionistas" })
  if (requiereTraspaso(r)) out.push({ clave: "traspaso" })
  return out
}
