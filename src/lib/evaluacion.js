// Preguntas del formulario de evaluacion (3 pasos + contacto), resumen para el aviso,
// reglas del "diagnostico preliminar" y lista de lo que el cliente respondio "No sé".
// Se comparten entre la pagina publica y el admin (generador de propuesta).

export const NO_SE = "No sé"

// ── Paso 1: estado actual ────────────────────────────────────────
export const CULTIVOS = [
  "Tomate industrial", "Hortalizas", "Frutales de carozo", "Frutales de pepita",
  "Cerezos", "Nogales y almendros", "Berries", "Vides / Viñas",
  "Cítricos y paltos", "Remolacha", "Cereales y granos", "Semilleros",
  "Praderas y forrajes", "Flores / Viveros",
]

export const MODELOS_PRODUCTIVOS = [
  { id: "propio",   label: "Solo campos propios",        desc: "Producimos toda la superficie con equipo propio" },
  { id: "asociado", label: "Productores asociados",      desc: "Entregamos insumos o apoyo y compramos su producción" },
  { id: "mixto",    label: "Mixto: propios + asociados", desc: "Parte propia y parte con productores bajo contrato" },
]

export const APOYOS_PRODUCTORES = [
  "Semillas / plantines", "Fertilizantes y fitosanitarios", "Equipos de riego",
  "Financiamiento / anticipos", "Maquinaria y cosecha", "Asistencia técnica",
]

export const TIPOS_RIEGO = ["Goteo", "Surco / tendido", "Aspersión / pivote", "Microaspersión", "Secano", NO_SE]

export const REGISTROS = ["WhatsApp", "Planillas Excel", "Cuaderno de campo", "Software / ERP agrícola", "No llevamos registros", NO_SE]

export const SI_NO = [
  { id: "si",   label: "Sí" },
  { id: "no",   label: "No" },
  { id: "nose", label: NO_SE },
]

export const MARCAS_SENSORES = [
  "HSTI", "WiseConn / DropControl", "CropX", "METER Group / ZENTRA Cloud", "Sencrop",
  "Pessl Instruments / METOS", "Davis Instruments / WeatherLink", "Sensoterr",
  "Sentek / IrriMAX Live", "Arable", "xFarm Technologies", "SupPlant", "Doktar",
  "EOS Data Analytics", "GeoPard Agriculture", "Teralytic", "AgriWebb",
  "John Deere Operations Center", "Trimble Agriculture", "Ranch Systems", "Hortau",
]

export const VARIABLES_SENSORES = [
  "Humedad de suelo", "Clima / estación meteorológica", "Caudal y presión de riego",
  "Heladas / temperatura", "Nutrientes / conductividad (EC)", "Imágenes satelitales o drones", NO_SE,
]

export const VER_DATA = [
  "App o web del proveedor", "Planillas / exporto a Excel", "Nos llegan reportes de un asesor",
  "Tenemos los sensores pero no revisamos la data", NO_SE,
]

export const QUIEN_REVISA = ["Gerencia", "Jefe de campo / administrador", "Asesor externo", "Nadie en particular", NO_SE]

export const CONECTIVIDAD = [
  { id: "buena",   label: "Buena en todo el campo" },
  { id: "parcial", label: "Solo en algunos sectores" },
  { id: "sin",     label: "Sin señal en el campo" },
  { id: "nose",    label: NO_SE },
]

// ── Paso 2: que buscas ───────────────────────────────────────────
export const PRIORIDADES = [
  "Rendimiento (t/ha)", "Calidad (Brix, calibre, pH)", "Ahorro de agua",
  "Reducir costos", "Trazabilidad campo a planta", "Coordinación de cosecha",
  "Sanidad y alertas tempranas", "Adopción tecnológica de productores", "Aún no lo tengo claro",
]

export const COMO_QUIERE_VER = [
  "Un panel central con todos los campos", "Alertas en el celular", "Reportes periódicos por email",
  "Comparar campos o productores", NO_SE,
]

export const PLAZOS = [
  { id: "temporada",  label: "Esta temporada" },
  { id: "proxima",    label: "Próxima temporada" },
  { id: "explorando", label: "Solo estoy explorando" },
  { id: "nose",       label: NO_SE },
]

// ── Paso 3: modulos ──────────────────────────────────────────────
export const INTERES = [
  { id: "si",   label: "Me sirve" },
  { id: "no",   label: "No lo necesito" },
  { id: "nose", label: NO_SE },
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
  { id: NO_SE,         desc: "Lo definimos juntos." },
]

export const FUENTES = ["INIA", "INDAP", "FAO", "SAG", "ODEPA", "Clima (DMC / Agromet)", "CIREN", NO_SE]

export const LICENCIAS = [
  { id: "self", label: "Self Hosted",      desc: "Licencia compartida + soporte + código fuente admin y app", badge: "Código compartido" },
  { id: "full", label: "Full Hosted",      desc: "Código completo, licencia propia, un solo pago, documentación completa", badge: "Licencia exclusiva" },
  { id: "saas", label: "Mes a mes (SaaS)", desc: "Usuarios en la app AgroHub compartida, sin app propia", badge: "Sin inversión inicial" },
  { id: "nose", label: NO_SE,              desc: "Te explicamos las opciones en el diagnóstico" },
]

export const ETAPAS = [
  { titulo: "Diagnóstico previo",           texto: "Visita a terreno y levantamiento del nivel tecnológico, infraestructura y equipo." },
  { titulo: "Propuesta modular",            texto: "Kit tecnológico a tu medida: tomas solo lo que te sirve." },
  { titulo: "Instalación y capacitación",   texto: "Instalamos sensores y herramientas, y capacitamos en terreno." },
  { titulo: "Seguimiento y extensionistas", texto: "Acompañamos la adopción y formamos referentes en tu equipo." },
  { titulo: "Plataforma AgroHub",           texto: "Monitoreo centralizado, trazabilidad y conocimiento en un solo lugar." },
]

// Los numeros usan null para "No sé"
export const estadoInicial = {
  // Paso 1
  cultivos: [], otroCultivo: "", hectareas: 100, zonas: 1,
  modelo: "propio", haPropias: 50, productores: 10, apoyos: [],
  riegos: [], registros: [],
  tieneSensores: "", marcas: [], otraMarca: "", cantidadSensores: 5, variables: [],
  verData: [], quienRevisa: "", conectividad: "",
  // Paso 2
  prioridades: [], masSensores: "", medirMas: [], comoVer: [], plazo: "", capacitacion: "",
  // Paso 3
  modulos: {}, modoAi: NO_SE, modoDocs: NO_SE, fuentes: [], otrasFuentes: "",
  vistasKpi: 7, licencia: "", soporte: 1, admins: 1, agricultores: 20, asesores: 5,
}

// ── Helpers ──────────────────────────────────────────────────────
export const listaCultivos = r => [...(r.cultivos || []), ...(r.otroCultivo?.trim() ? [r.otroCultivo.trim()] : [])]
export const listaMarcas = r => [...(r.marcas || []), ...(r.otraMarca?.trim() ? [r.otraMarca.trim()] : [])]
export const conAsociados = r => r.modelo === "asociado" || r.modelo === "mixto"
export const haAsociadas = r => r.modelo === "asociado" ? r.hectareas : Math.max(0, (r.hectareas || 0) - (r.haPropias || 0))
export const modeloLabel = r => MODELOS_PRODUCTIVOS.find(m => m.id === r.modelo)?.label || ""
export const modulosPorInteres = (r, interes) => MODULOS.filter(m => r.modulos?.[m.id] === interes)
const siNo = v => SI_NO.find(x => x.id === v)?.label || ""
const etiqueta = (lista, v) => lista.find(x => x.id === v)?.label || ""
const fmt = n => n == null ? NO_SE : Number(n).toLocaleString("es-CL")
const plural = (n, s, p = s + "s") => n == null ? `${NO_SE} ${p}` : `${fmt(n)} ${n === 1 ? s : p}`
const lista = a => a?.length ? a.join(", ") : ""
const usaModulo = (r, id) => r.modulos?.[id] === "si" || r.modulos?.[id] === "nose"

// Lineas legibles con todas las respuestas (para el aviso y el admin)
export function resumenRespuestas(r) {
  const l = []
  const add = (titulo, v) => v && l.push(`${titulo}: ${v}`)
  add("Cultivos", lista(listaCultivos(r)) || "sin especificar")
  add("Superficie", `${fmt(r.hectareas)} ha en ${plural(r.zonas, "zona")}`)
  add("Modelo", modeloLabel(r))
  if (r.modelo === "mixto") add("Hectáreas", `${fmt(r.haPropias)} propias + ${fmt(haAsociadas(r))} con productores`)
  if (conAsociados(r)) {
    add("Productores asociados", fmt(r.productores))
    add("Apoyo a productores", lista(r.apoyos))
  }
  add("Riego", lista(r.riegos))
  add("Registros actuales", lista(r.registros))
  add("¿Tiene sensores?", siNo(r.tieneSensores))
  if (r.tieneSensores === "si") {
    add("Marcas", lista(listaMarcas(r)))
    add("Cantidad aprox. de sensores", fmt(r.cantidadSensores))
    add("Qué miden", lista(r.variables))
    add("Cómo ve la data", lista(r.verData))
    add("Quién la revisa", r.quienRevisa)
  }
  add("Conectividad en campo", etiqueta(CONECTIVIDAD, r.conectividad))
  add("Prioridades", lista(r.prioridades))
  add("¿Quiere más sensores?", siNo(r.masSensores))
  if (r.masSensores === "si") add("Quiere medir", lista(r.medirMas))
  add("Cómo quiere ver la información", lista(r.comoVer))
  add("Plazo", etiqueta(PLAZOS, r.plazo))
  add("¿Capacitar equipo como extensionistas?", siNo(r.capacitacion))
  add("Módulos que le sirven", lista(modulosPorInteres(r, "si").map(m => m.label)))
  add("Módulos que no necesita", lista(modulosPorInteres(r, "no").map(m => m.label)))
  add("Módulos que no sabe", lista(modulosPorInteres(r, "nose").map(m => m.label)))
  if (usaModulo(r, "ai")) add("Modo AI Chat", r.modoAi)
  if (usaModulo(r, "docs")) add("Modo biblioteca", r.modoDocs)
  if (usaModulo(r, "fuentes")) add("Fuentes externas", lista([...(r.fuentes || []), ...(r.otrasFuentes?.trim() ? [r.otrasFuentes.trim()] : [])]))
  if (usaModulo(r, "dashboard")) add("Vistas KPI", fmt(r.vistasKpi))
  add("Licencia", LICENCIAS.find(x => x.id === r.licencia)?.label)
  add("Soporte", plural(r.soporte, "año"))
  add("Usuarios", `${fmt(r.admins)} admins, ${fmt(r.agricultores)} agricultores, ${fmt(r.asesores)} asesores`)
  return l
}

// Todo lo que el cliente respondio "No sé": se convierte en puntos a definir en el diagnostico
export function puntosNoSabe(r) {
  const p = []
  const noSeEn = (arr, titulo) => arr?.includes(NO_SE) && p.push(titulo)
  if (r.hectareas == null) p.push("Superficie total")
  if (r.zonas == null) p.push("Número de zonas o predios")
  if (conAsociados(r) && r.productores == null) p.push("Número de productores asociados")
  noSeEn(r.riegos, "Tipo de riego")
  noSeEn(r.registros, "Cómo se registran las labores")
  if (r.tieneSensores === "nose") p.push("Si existen sensores instalados")
  if (r.tieneSensores === "si") {
    if (r.marcas?.includes("No sé la marca")) p.push("Marca de los sensores instalados")
    if (r.cantidadSensores == null) p.push("Cantidad de sensores instalados")
    noSeEn(r.variables, "Qué miden los sensores actuales")
    noSeEn(r.verData, "Cómo se visualiza la data de los sensores")
    if (r.quienRevisa === NO_SE) p.push("Quién revisa la data")
  }
  if (r.conectividad === "nose") p.push("Conectividad en el campo")
  if (r.prioridades?.includes("Aún no lo tengo claro")) p.push("Prioridades de mejora")
  if (r.masSensores === "nose") p.push("Necesidad de sensores adicionales")
  noSeEn(r.medirMas, "Qué variables adicionales medir")
  noSeEn(r.comoVer, "Cómo quiere ver la información")
  if (r.plazo === "nose") p.push("Plazo de implementación")
  if (r.capacitacion === "nose") p.push("Formación de extensionistas")
  modulosPorInteres(r, "nose").forEach(m => p.push(`Utilidad del módulo ${m.label}`))
  if (usaModulo(r, "ai") && r.modoAi === NO_SE) p.push("Modo de operación del AI Chat")
  if (usaModulo(r, "docs") && r.modoDocs === NO_SE) p.push("Modo de operación de la biblioteca")
  if (usaModulo(r, "fuentes")) noSeEn(r.fuentes, "Fuentes externas a integrar")
  if (usaModulo(r, "dashboard") && r.vistasKpi == null) p.push("Cantidad de vistas KPI")
  if (r.licencia === "nose") p.push("Tipo de licencia")
  if (r.soporte == null) p.push("Años de soporte")
  if ([r.admins, r.agricultores, r.asesores].some(v => v == null)) p.push("Número de usuarios por rol")
  return p
}

// Porcentaje de avance: preguntas principales respondidas (un "No sé" cuenta como respuesta)
export function avance(r) {
  const hechas = [
    listaCultivos(r).length > 0, r.riegos.length > 0, r.registros.length > 0,
    Boolean(r.tieneSensores), Boolean(r.conectividad),
    r.prioridades.length > 0, Boolean(r.masSensores), r.comoVer.length > 0, Boolean(r.plazo),
    Object.keys(r.modulos).length >= 3, Boolean(r.licencia),
  ]
  return Math.round(100 * hechas.filter(Boolean).length / hechas.length)
}

const CULTIVOS_AGROINDUSTRIA = ["Tomate industrial", "Remolacha", "Semilleros"]
const CULTIVOS_FRUTALES = ["Frutales de carozo", "Frutales de pepita", "Cerezos", "Nogales y almendros", "Berries", "Vides / Viñas", "Cítricos y paltos"]

const INSIGHT_PRIORIDAD = {
  "Rendimiento (t/ha)":                  "Comparamos sectores y campos para encontrar dónde se pierde rendimiento y por qué.",
  "Calidad (Brix, calibre, pH)":         "Relacionamos riego, nutrición y clima con la calidad que llega a planta.",
  "Ahorro de agua":                      "Regar según la humedad real del suelo, no por calendario, es la vía más directa para ahorrar agua.",
  "Reducir costos":                      "Identificamos aplicaciones y riegos que se pueden ajustar sin afectar la producción.",
  "Trazabilidad campo a planta":         "Registro de labores e insumos por cuartel, conectado con la recepción.",
  "Coordinación de cosecha":             "Datos de madurez y clima para planificar cosecha y entregas con anticipación.",
  "Sanidad y alertas tempranas":         "Alertas por clima (heladas, riesgo de enfermedades) antes de que el problema se vea en el campo.",
  "Adopción tecnológica de productores": "Formamos técnicos referentes que acompañan a los productores: la tecnología se adopta cuando alguien cercano la usa.",
  "Aún no lo tengo claro":               "Está bien: el diagnóstico sirve justamente para priorizar dónde está la mayor oportunidad.",
}

// Recomendaciones que se muestran en vivo mientras el usuario responde
export function insights(r) {
  const out = []
  const cultivos = listaCultivos(r)

  if (conAsociados(r)) {
    out.push({ titulo: "Tu red de productores",
      texto: `Con ${plural(r.productores, "productor", "productores")} asociados, AgroHub centraliza el seguimiento de cada campo y lo que se les entrega, con tu equipo técnico como extensionistas.` })
  }
  if (cultivos.some(c => CULTIVOS_AGROINDUSTRIA.includes(c))) {
    out.push({ titulo: "Del campo a la planta",
      texto: "En cultivos para agroindustria, conectar las prácticas de cada campo con lo que se mide en recepción (Brix, pH, rechazos) muestra qué manejo da mejores resultados." })
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

  if (r.tieneSensores === "si") {
    if (r.verData.includes("Tenemos los sensores pero no revisamos la data")) {
      out.push({ titulo: "Tus sensores", texto: "Es muy común: hay sensores, pero la data no llega a quien decide. Un panel único con alertas simples hace que se use." })
    } else if (listaMarcas(r).length > 1) {
      out.push({ titulo: "Tus sensores", texto: `Usas ${listaMarcas(r).length} marcas distintas: AgroHub las reúne en un solo panel en vez de revisar una app por proveedor.` })
    } else {
      out.push({ titulo: "Tus sensores", texto: "Aprovechamos lo que ya tienes instalado: lo integramos antes de sumar equipos nuevos." })
    }
  } else if (r.tieneSensores === "no") {
    out.push({ titulo: "Sin sensores aún", texto: "Partimos con pocos puntos bien ubicados en sitios representativos, y crecemos según resultados." })
  } else if (r.tieneSensores === "nose") {
    out.push({ titulo: "Sensores", texto: "En la visita revisamos qué hay instalado y si se puede aprovechar." })
  }
  if (r.conectividad === "sin" || r.conectividad === "parcial") {
    out.push({ titulo: "Conectividad", texto: "Hay sensores con transmisión de largo alcance (LoRa) o satelital para sectores sin señal celular." })
  }

  if (r.zonas > 1 || r.hectareas >= 500) {
    out.push({ titulo: "Escala",
      texto: `Con ${fmt(r.hectareas)} ha${r.zonas > 1 ? ` en ${r.zonas} zonas` : ""}, conviene partir con un piloto en sitios representativos, medir resultados y luego escalar.` })
  }
  if (r.registros.includes("No llevamos registros")) {
    out.push({ titulo: "Registros", texto: "Partimos por lo básico: una bitácora simple de labores en el celular." })
  } else if (r.registros.some(x => ["WhatsApp", "Cuaderno de campo", "Planillas Excel"].includes(x))) {
    out.push({ titulo: "Registros", texto: "Digitalizamos lo que ya haces, sin cambiar hábitos: registro desde el celular en pocos toques." })
  }
  r.prioridades.forEach(p => INSIGHT_PRIORIDAD[p] && out.push({ titulo: p, texto: INSIGHT_PRIORIDAD[p] }))
  if (r.capacitacion === "si") {
    out.push({ titulo: "Extensionistas", texto: "Formamos a tu equipo para que acompañe a otros: así la adopción se sostiene cuando nos vamos." })
  }

  const noSe = puntosNoSabe(r).length
  if (noSe > 0) {
    out.push({ titulo: `${noSe} punto${noSe > 1 ? "s" : ""} por definir`, texto: "Lo que marcaste como “No sé” lo resolvemos juntos en el diagnóstico. No necesitas tener todo claro para empezar." })
  }
  return out
}
