// Preguntas del formulario de evaluacion (3 pasos + contacto), resumen para el aviso
// y reglas del "diagnostico preliminar". Se comparten entre la pagina publica y el admin.
// Toda pregunta ofrece "Otros" con texto libre (no hay opcion "No sé").

export const OTROS = "Otros"

// ── Paso 1: estado actual ────────────────────────────────────────
// Orden: palto, arandano, tomate y limonero primero; luego por relevancia en el mercado chileno
export const CULTIVOS = [
  "Palto", "Arándano", "Tomate", "Limonero",
  "Cerezo", "Uva de mesa", "Vid vinífera", "Nogal", "Manzano", "Avellano europeo",
  "Ciruelo", "Kiwi", "Mandarino y naranjo", "Olivo", "Almendro", "Peral",
  "Frambuesa y frutilla", "Hortalizas", "Papa", "Maíz", "Trigo y cereales",
  "Remolacha", "Semilleros", "Praderas y forrajes", "Flores / Viveros",
]

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
    desc: "Registro de labores, insumos y cosecha por cuartel o productor, desde el celular. Permite relacionar el manejo con el resultado en planta." },
  { id: "ai",           label: "AI Chat agrícola",
    desc: "Asistente que responde consultas técnicas en lenguaje simple, apoyado en documentos confiables." },
  { id: "docs",         label: "Biblioteca técnica",
    desc: "Documentos y fichas técnicas (INIA, FAO, entre otros) organizados y buscables para tu equipo." },
  { id: "fuentes",      label: "Fuentes externas de información",
    desc: "Conectamos clima, alertas y datos públicos (INIA, INDAP, FAO, DMC…) para verlos junto a tus datos." },
  { id: "eventos",      label: "Capacitaciones y eventos",
    desc: "Calendario de días de campo, videos demostrativos y formación de extensionistas en tu equipo." },
  { id: "tienda",       label: "Marketplace",
    desc: "Compra de insumos y oferta de productos entre productores de la red." },
]

export const MODOS_IA = [
  { id: "SLM (local)", desc: "Corre en tu servidor; los datos no salen de la empresa." },
  { id: "Cloud (API)", desc: "Más potente, requiere internet." },
  { id: "Híbrida",     desc: "Local para lo sensible, nube para lo demás." },
  { id: OTROS,         desc: "Cuéntanos qué necesitas." },
]

export const FUENTES = ["INIA", "INDAP", "FAO", "SAG", "ODEPA", "Clima (DMC / Agromet)", "CIREN", OTROS]

export const LICENCIAS = [
  { id: "self", label: "Self Hosted",      desc: "Licencia compartida + soporte + código fuente admin y app", badge: "Código compartido" },
  { id: "full", label: "Full Hosted",      desc: "Código completo, licencia propia, un solo pago, documentación completa", badge: "Licencia exclusiva" },
  { id: "saas", label: "Mes a mes (SaaS)", desc: "Usuarios en la app AgroHubs compartida, sin app propia", badge: "Sin inversión inicial" },
  { id: "otro", label: OTROS,              desc: "Cuéntanos qué modelo te acomoda" },
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
  { id: "agricultores",  label: "Agricultores",          hint: "Usan la app en terreno" },
  { id: "asesores",      label: "Asesores / técnicos",   hint: "Acompañan a productores" },
  { id: "capacitadores", label: "Capacitadores por zona", hint: "Forman a otros usuarios" },
]

export const ETAPAS = [
  { titulo: "Diagnóstico previo",           texto: "Visita a terreno y levantamiento del nivel tecnológico, infraestructura y equipo." },
  { titulo: "Propuesta modular",            texto: "Kit tecnológico a tu medida: tomas solo lo que te sirve." },
  { titulo: "Instalación y capacitación",   texto: "Instalamos sensores y herramientas, y capacitamos en terreno." },
  { titulo: "Seguimiento y extensionistas", texto: "Acompañamos la adopción y formamos referentes en tu equipo." },
  { titulo: "Plataforma AgroHubs",           texto: "Monitoreo centralizado, trazabilidad y conocimiento en un solo lugar." },
]

export const nuevaZona = n => ({ nombre: `Zona ${n}`, hectareas: 0, agricultores: 0 })

// `otros` guarda el texto de cada "Otros" por clave de pregunta
export const estadoInicial = {
  // Paso 1
  cultivos: [], otroCultivo: "", hectareas: 5000,
  zonas: [{ nombre: "Zona 1", hectareas: 5000, agricultores: 10 }],
  modelo: "propio", haPropias: 2000, productores: 10, apoyos: [],
  tomateTipos: [], tomateEstablecimiento: "", tomateDensidad: 30000, tomateCosecha: "",
  tomateVariedad: "", tomateProblemas: [], tomateRecepcion: [],
  riegos: [], programadorRiego: "", programadorFerti: "",
  fertilizacion: [], aplicacion: [], analisis: [], productos: [], registros: [],
  tieneSensores: "", marcas: [], otraMarca: "", cantidadSensores: 5, variables: [],
  verData: [], quienRevisa: "", conectividad: "",
  // Paso 2 (puntajes 1-5 por opcion)
  prioridades: {}, masSensores: "", medir: {}, comoVer: {}, plazo: "", capacitacion: "",
  puntajeOtros: {},
  // Paso 3
  modulos: {}, modoAi: "Híbrida", modoDocs: "Híbrida", fuentes: [], otrasFuentes: "",
  vistasKpi: 7, licencia: "", soporte: 1, admins: 1, agricultores: 20, asesores: 5, capacitadores: 3,
  // Textos de "Otros"
  otros: {},
}

// ── Helpers ──────────────────────────────────────────────────────
export const listaCultivos = r => [...(r.cultivos || []), ...(r.otroCultivo?.trim() ? [r.otroCultivo.trim()] : [])]
export const listaMarcas = r => [...(r.marcas || []), ...(r.otraMarca?.trim() ? [r.otraMarca.trim()] : [])]
export const cultivaTomate = r => (r.cultivos || []).includes("Tomate")
export const tomateIndustrial = r => cultivaTomate(r) && (r.tomateTipos || []).includes(TOMATE_TIPOS[0])
export const conAsociados = r => r.modelo === "asociado" || r.modelo === "mixto"
export const haAsociadas = r => r.modelo === "asociado" ? r.hectareas : Math.max(0, (r.hectareas || 0) - (r.haPropias || 0))
export const modeloLabel = r => MODELOS_PRODUCTIVOS.find(m => m.id === r.modelo)?.label || ""
export const modulosPorInteres = (r, interes) => MODULOS.filter(m => r.modulos?.[m.id] === interes)
const fmt = n => Number(n || 0).toLocaleString("es-CL")

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

// Lineas legibles con todas las respuestas (para el aviso y el admin)
export function resumenRespuestas(r) {
  const l = []
  const add = (titulo, v) => v && l.push(`${titulo}: ${v}`)
  add("Cultivos", lista(listaCultivos(r)) || "sin especificar")
  add("Superficie total", `${fmt(r.hectareas)} ha`)
  ;(r.zonas || []).forEach(z => add(`Zona ${z.nombre || "sin nombre"}`, `${fmt(z.hectareas)} ha · ${fmt(z.agricultores)} agricultores`))
  add("Modelo", modeloLabel(r))
  if (r.modelo === "mixto") add("Hectáreas", `${fmt(r.haPropias)} propias + ${fmt(haAsociadas(r))} con productores`)
  if (conAsociados(r)) {
    add("Productores asociados", fmt(r.productores))
    add("Apoyo a productores", lista(conOtros(r, "apoyos")))
  }
  if (cultivaTomate(r)) {
    add("Tomate · tipo", lista(conOtros(r, "tomateTipos")))
    add("Tomate · establecimiento", unica(r, "tomateEstablecimiento", TOMATE_ESTABLECIMIENTO))
    add("Tomate · densidad (plantas/ha)", fmt(r.tomateDensidad))
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
    add("Cantidad aprox. de sensores", fmt(r.cantidadSensores))
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
  if (usa("dashboard")) add("Vistas KPI", fmt(r.vistasKpi))
  add("Licencia", unica(r, "licencia", LICENCIAS))
  if (requiereTraspaso(r)) add("Incluye", "capacitación para migración y traspaso técnico de fuentes")
  add("Soporte", `${fmt(r.soporte)} año(s)`)
  add("Usuarios", USUARIOS.map(u => `${fmt(r[u.id])} ${u.label.toLowerCase()}`).join(", "))
  return l
}

// Porcentaje de avance: preguntas principales respondidas
export function avance(r) {
  const hechas = [
    listaCultivos(r).length > 0, r.riegos.length > 0, r.fertilizacion.length > 0, r.registros.length > 0,
    Boolean(r.tieneSensores), Boolean(r.conectividad),
    puntajes(r, "prioridades").length > 0, Boolean(r.masSensores), puntajes(r, "comoVer").length > 0, Boolean(r.plazo),
    Object.keys(r.modulos).length >= 3, Boolean(r.licencia),
  ]
  return Math.round(100 * hechas.filter(Boolean).length / hechas.length)
}

const CULTIVOS_AGROINDUSTRIA = ["Remolacha", "Semilleros"]
const CULTIVOS_FRUTALES = ["Uva de mesa", "Vid vinífera", "Nogal", "Manzano", "Avellano europeo", "Ciruelo", "Kiwi", "Mandarino y naranjo", "Olivo", "Almendro", "Peral"]

const INSIGHT_CULTIVO = {
  "Palto": "El palto es muy sensible a la asfixia radicular y a la salinidad: sondas a dos profundidades muestran si el agua se queda en la zona de raíces o se pierde por percolación.",
  "Arándano": "En arándano mandan el pH y la conductividad del agua y del bulbo mojado: monitorearlos evita bloqueos de hierro y manganeso, sobre todo en maceta o sustrato.",
  "Limonero": "En limonero, el estrés hídrico controlado y las alertas de helada en invierno marcan la diferencia en floración y calibre.",
  "Cerezo": "En cerezo, el riesgo está en heladas de floración y lluvias cerca de cosecha (partidura): alertas con horas de anticipación permiten activar control o cubiertas a tiempo.",
}

const INSIGHT_PRIORIDAD = {
  "Rendimiento (t/ha)":                  "Comparamos sectores y campos para encontrar dónde se pierde rendimiento y por qué.",
  "Calidad (Brix, calibre, pH)":         "Relacionamos riego, nutrición y clima con la calidad que llega a planta.",
  "Ahorro de agua":                      "Regar según la humedad real del suelo, no por calendario, es la vía más directa para ahorrar agua.",
  "Reducir costos":                      "Identificamos aplicaciones y riegos que se pueden ajustar sin afectar la producción.",
  "Trazabilidad campo a planta":         "Registro de labores e insumos por cuartel, conectado con la recepción.",
  "Coordinación de cosecha":             "Datos de madurez y clima para planificar cosecha y entregas con anticipación.",
  "Sanidad y alertas tempranas":         "Alertas por clima (heladas, riesgo de enfermedades) antes de que el problema se vea en el campo.",
  "Adopción tecnológica de productores": "Formamos técnicos referentes que acompañan a los productores: la tecnología se adopta cuando alguien cercano la usa.",
}

function insightsTomate(r) {
  const out = []
  const industrial = tomateIndustrial(r)
  if (industrial) {
    out.push({ titulo: "Tomate industrial: °Brix sin perder kilos",
      texto: "El corte de riego antes de cosecha sube el °Brix, pero hecho a ciegas castiga el rendimiento. Con humedad de suelo por cuartel se decide cuándo y cuánto cortar en cada campo." })
    out.push({ titulo: "Fecha de cosecha y entrega a planta",
      texto: "Los grados-día acumulados desde el trasplante permiten estimar la cosecha de cada cuartel y escalonar las entregas según la capacidad diaria de la planta." })
  }
  if (r.tomateCosecha === "mecanizada" || r.tomateCosecha === "ambas") {
    out.push({ titulo: "Cosecha mecanizada",
      texto: "La cosecha única exige madurez concentrada: el seguimiento del % de fruto rojo y sobremaduro por cuartel define el día óptimo de entrada de la cosechadora." })
  }
  const pb = r.tomateProblemas || []
  if (pb.includes("Polilla del tomate (Tuta absoluta)")) {
    out.push({ titulo: "Tuta absoluta", texto: "Trampas de feromona registradas en la app por cuartel permiten aplicar solo sobre el umbral y rotar modos de acción para no generar resistencia." })
  }
  if (pb.includes("Tizón tardío (Phytophthora)")) {
    out.push({ titulo: "Tizón tardío", texto: "Con humedad relativa y temperatura de estaciones locales se calculan las horas de riesgo y se adelanta la aplicación preventiva antes de la infección." })
  }
  if (pb.includes("Pudrición apical")) {
    out.push({ titulo: "Pudrición apical", texto: "Suele estar más ligada a riegos irregulares y al transporte de calcio que a falta de calcio en el suelo: la humedad de suelo constante es parte de la solución." })
  }
  if (pb.includes("Bajo °Brix en recepción") || (industrial && (r.tomateRecepcion || []).length)) {
    out.push({ titulo: "Del potrero a la romana", texto: "Cruzar el °Brix, el color y los descuentos de cada carga con el riego y la fertilización de su cuartel muestra qué manejo paga y cuál no." })
  }
  if ((r.tomateTipos || []).includes("Invernadero")) {
    out.push({ titulo: "Tomate en invernadero", texto: "Temperatura, humedad y déficit de presión de vapor (DPV) al interior definen cuaja y enfermedades: el monitoreo continuo guía la ventilación y el riego." })
  }
  if (!out.length) {
    out.push({ titulo: "Tomate", texto: "Cuéntanos tipo de tomate, cosecha y problemas principales: con eso ajustamos riego, nutrición y alertas a tu ciclo." })
  }
  return out
}

// Recomendaciones que se muestran en vivo mientras el usuario responde
export function insights(r) {
  const out = []
  const cultivos = listaCultivos(r)
  const zonas = r.zonas?.length || 0

  if (conAsociados(r)) {
    out.push({ titulo: "Tu red de productores",
      texto: `Con ${fmt(r.productores)} productores asociados, AgroHubs centraliza el seguimiento de cada campo y lo que se les entrega, con tu equipo técnico como extensionistas.` })
  }
  if (cultivaTomate(r)) out.push(...insightsTomate(r))
  Object.entries(INSIGHT_CULTIVO).forEach(([c, texto]) => cultivos.includes(c) && out.push({ titulo: c, texto }))
  if (cultivos.some(c => CULTIVOS_AGROINDUSTRIA.includes(c))) {
    out.push({ titulo: "Del campo a la planta", texto: "En cultivos para agroindustria, conectar las prácticas de cada campo con lo que se mide en recepción muestra qué manejo da mejores resultados." })
  }
  if (cultivos.some(c => CULTIVOS_FRUTALES.includes(c))) {
    out.push({ titulo: "Frutales", texto: "Estaciones y sensores permiten anticipar heladas y ajustar el riego por sector durante la temporada." })
  }
  if (r.riegos.some(x => x === "Goteo" || x === "Microaspersión")) {
    out.push({ titulo: "Riego tecnificado", texto: "Ya tienes la base: con sondas de humedad de suelo se decide cuándo y cuánto regar con datos, sector por sector." })
  } else if (r.riegos.includes("Surco / tendido")) {
    out.push({ titulo: "Riego por surco", texto: "Medir humedad de suelo y caudal es el primer paso para detectar sobrerriego y justificar tecnificar." })
  } else if (r.riegos.includes("Secano")) {
    out.push({ titulo: "Secano", texto: "El clima manda: estaciones meteorológicas y pronóstico local ayudan a decidir siembra, aplicaciones y cosecha." })
  }
  if (r.programadorRiego?.trim() || r.programadorFerti?.trim()) {
    out.push({ titulo: "Tu programador", texto: "Revisamos si tu programador permite integración (API, Modbus o exportación): así las alertas y la ejecución del riego quedan conectadas." })
  }
  if (r.fertilizacion.includes("Dron") || r.aplicacion.includes("Dron")) {
    out.push({ titulo: "Aplicaciones con dron", texto: "Registramos cada vuelo con su polígono, dosis y producto: queda la trazabilidad por cuartel sin papeleo extra." })
  }
  if (r.fertilizacion.includes("Fertirriego por goteo") && !r.analisis.includes("Solución de fertirriego")) {
    out.push({ titulo: "Fertirriego", texto: "Medir la conductividad y el pH de la solución que sale por el gotero es la forma más barata de confirmar que la dosis programada llega a la planta." })
  }
  if (r.analisis.includes("Ninguno")) {
    out.push({ titulo: "Análisis", texto: "Un análisis de suelo y agua al inicio es la línea base para medir después el efecto de cada cambio." })
  }
  if (r.tieneSensores === "si") {
    if (r.verData.includes("Tenemos los sensores pero no revisamos la data")) {
      out.push({ titulo: "Tus sensores", texto: "Es muy común: hay sensores, pero la data no llega a quien decide. Un panel único con alertas simples hace que se use." })
    } else if (listaMarcas(r).length > 1) {
      out.push({ titulo: "Tus sensores", texto: `Usas ${listaMarcas(r).length} marcas distintas: AgroHubs las reúne en un solo panel en vez de revisar una app por proveedor.` })
    } else {
      out.push({ titulo: "Tus sensores", texto: "Aprovechamos lo que ya tienes instalado: lo integramos antes de sumar equipos nuevos." })
    }
  } else if (r.tieneSensores === "no") {
    out.push({ titulo: "Sin sensores aún", texto: "Partimos con pocos puntos bien ubicados en sitios representativos, y crecemos según resultados." })
  }
  if (r.conectividad === "sin" || r.conectividad === "parcial") {
    out.push({ titulo: "Conectividad", texto: "Hay sensores con transmisión de largo alcance (LoRa) o satelital para sectores sin señal celular." })
  }
  if (zonas > 1 || r.hectareas >= 500) {
    out.push({ titulo: "Escala",
      texto: `Con ${fmt(r.hectareas)} ha${zonas > 1 ? ` en ${zonas} zonas` : ""}, conviene partir con un piloto en sitios representativos, medir resultados y luego escalar.` })
  }
  if (r.registros.includes("No llevamos registros")) {
    out.push({ titulo: "Registros", texto: "Partimos por lo básico: una bitácora simple de labores en el celular." })
  } else if (r.registros.some(x => ["WhatsApp", "Cuaderno de campo", "Planillas Excel"].includes(x))) {
    out.push({ titulo: "Registros", texto: "Digitalizamos lo que ya haces, sin cambiar hábitos: registro desde el celular en pocos toques." })
  }
  puntajes(r, "prioridades").filter(([, v]) => v >= 4).forEach(([p]) => INSIGHT_PRIORIDAD[p] && out.push({ titulo: p, texto: INSIGHT_PRIORIDAD[p] }))
  if ((r.comoVer?.["Reuniones semanales con el experto"] || 0) >= 4) {
    out.push({ titulo: "Reuniones con el experto", texto: "Una revisión semanal de tus datos con un especialista convierte los paneles en decisiones concretas para la semana." })
  }
  if (r.capacitacion === "si" || r.capacitadores > 0) {
    out.push({ titulo: "Extensionistas", texto: "Formamos a tus capacitadores por zona para que acompañen a otros: así la adopción se sostiene cuando nos vamos." })
  }
  if (requiereTraspaso(r)) {
    out.push({ titulo: "Traspaso técnico", texto: "Con licencia propia incluimos onboarding de tu equipo TI, handover del código y soporte a la migración." })
  }
  return out
}
