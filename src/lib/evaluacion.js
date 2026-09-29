// Opciones del formulario de evaluacion y reglas del "diagnostico preliminar".
// Se comparten entre la pagina publica y el admin (generador de propuesta).

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

export const TIPOS_RIEGO = ["Goteo", "Surco / tendido", "Aspersión / pivote", "Microaspersión", "Secano"]

export const PRIORIDADES = [
  "Rendimiento (t/ha)", "Calidad (Brix, calibre, pH)", "Ahorro de agua",
  "Reducir costos", "Trazabilidad campo a planta", "Coordinación de cosecha",
  "Sanidad y alertas tempranas", "Adopción tecnológica de productores",
]

export const REGISTROS = ["WhatsApp", "Planillas Excel", "Cuaderno de campo", "Software / ERP agrícola", "No llevamos registros"]

export const SENSOR_DESTACADO = "HSTI"

export const SENSORES = [
  SENSOR_DESTACADO, "WiseConn / DropControl", "CropX", "METER Group / ZENTRA Cloud", "Sencrop",
  "Pessl Instruments / METOS", "Davis Instruments / WeatherLink", "Sensoterr",
  "Sentek / IrriMAX Live", "Arable", "xFarm Technologies", "SupPlant", "Doktar",
  "EOS Data Analytics", "GeoPard Agriculture", "Teralytic", "AgriWebb",
  "John Deere Operations Center", "Trimble Agriculture", "Ranch Systems", "Hortau",
]

export const MODULOS = [
  { id: "dashboard", label: "Dashboard y Sensores" },
  { id: "eventos",   label: "Eventos y Capacitaciones" },
  { id: "tienda",    label: "Tienda / Ecommerce" },
  { id: "ai",        label: "AI Chat agrícola" },
  { id: "docs",      label: "Biblioteca de documentos técnicos" },
]

export const LICENCIAS = [
  { id: "self", label: "Self Hosted",      desc: "Licencia compartida + soporte + código fuente admin y app", badge: "Código compartido" },
  { id: "full", label: "Full Hosted",      desc: "Código completo, licencia propia, un solo pago, documentación completa", badge: "Licencia exclusiva" },
  { id: "saas", label: "Mes a mes (SaaS)", desc: "Usuarios en la app AgroHub compartida, sin app propia", badge: "Sin inversión inicial" },
]

export const ETAPAS = [
  { titulo: "Diagnóstico previo",          texto: "Visita a terreno y levantamiento del nivel tecnológico, infraestructura y equipo." },
  { titulo: "Propuesta modular",           texto: "Kit tecnológico a tu medida: tomas solo lo que te sirve." },
  { titulo: "Instalación y capacitación",  texto: "Instalamos sensores y herramientas, y capacitamos en terreno." },
  { titulo: "Seguimiento y extensionistas", texto: "Acompañamos la adopción y formamos referentes en tu equipo." },
  { titulo: "Plataforma AgroHub",          texto: "Monitoreo centralizado, trazabilidad y conocimiento en un solo lugar." },
]

export const estadoInicial = {
  cultivos: [], otroCultivo: "", hectareas: 100, zonas: 1,
  modelo: "propio", haPropias: 50, productores: 10, apoyos: [],
  riegos: [], prioridades: [], registros: [], sensores: [SENSOR_DESTACADO],
  modulos: ["dashboard", "eventos", "ai", "docs"], licencia: "self", usuarios: 20, soporte: 1,
}

export const listaCultivos = r => [...(r.cultivos || []), ...(r.otroCultivo?.trim() ? [r.otroCultivo.trim()] : [])]
export const conAsociados = r => r.modelo === "asociado" || r.modelo === "mixto"
export const haAsociadas = r => r.modelo === "asociado" ? r.hectareas : Math.max(0, r.hectareas - r.haPropias)
export const modeloLabel = r => MODELOS_PRODUCTIVOS.find(m => m.id === r.modelo)?.label || ""
const plural = (n, s, p = s + "s") => `${n} ${n === 1 ? s : p}`
const fmt = n => Number(n).toLocaleString("es-CL")

// Lineas legibles con todas las respuestas (para el aviso y el admin)
export function resumenRespuestas(r) {
  const l = []
  const cultivos = listaCultivos(r)
  l.push(`Cultivos: ${cultivos.length ? cultivos.join(", ") : "sin especificar"}`)
  l.push(`Superficie: ${fmt(r.hectareas)} ha en ${plural(r.zonas, "zona")}/predios`)
  l.push(`Modelo: ${modeloLabel(r)}`)
  if (r.modelo === "mixto") l.push(`Hectáreas: ${fmt(r.haPropias)} propias + ${fmt(haAsociadas(r))} con productores`)
  if (conAsociados(r)) {
    l.push(`Productores asociados: ${r.productores}`)
    if (r.apoyos?.length) l.push(`Apoyo a productores: ${r.apoyos.join(", ")}`)
  }
  if (r.riegos?.length) l.push(`Riego: ${r.riegos.join(", ")}`)
  if (r.prioridades?.length) l.push(`Prioridades: ${r.prioridades.join(", ")}`)
  if (r.registros?.length) l.push(`Registros actuales: ${r.registros.join(", ")}`)
  if (r.sensores?.length) l.push(`Tecnología de sensores: ${r.sensores.join(", ")}`)
  const mods = (r.modulos || []).map(id => MODULOS.find(m => m.id === id)?.label).filter(Boolean)
  if (mods.length) l.push(`Módulos de interés: ${mods.join(", ")}`)
  l.push(`Licencia: ${LICENCIAS.find(x => x.id === r.licencia)?.label || "-"} · Usuarios: ${r.usuarios} · Soporte: ${plural(r.soporte, "año")}`)
  return l
}

// Porcentaje de avance del formulario
export function avance(r) {
  const pasos = [
    listaCultivos(r).length > 0,
    r.hectareas > 0,
    r.riegos.length > 0,
    r.prioridades.length > 0,
    r.registros.length > 0,
    r.sensores.length > 0,
  ]
  return Math.round(100 * pasos.filter(Boolean).length / pasos.length)
}

const CULTIVOS_AGROINDUSTRIA = ["Tomate industrial", "Remolacha", "Semilleros"]
const CULTIVOS_FRUTALES = ["Frutales de carozo", "Frutales de pepita", "Cerezos", "Nogales y almendros", "Berries", "Vides / Viñas", "Cítricos y paltos"]

const INSIGHT_PRIORIDAD = {
  "Rendimiento (t/ha)":                   "Comparamos sectores y campos para encontrar dónde se pierde rendimiento y por qué.",
  "Calidad (Brix, calibre, pH)":          "Relacionamos riego, nutrición y clima con la calidad que llega a planta.",
  "Ahorro de agua":                       "Regar según la humedad real del suelo, no por calendario, es la vía más directa para ahorrar agua.",
  "Reducir costos":                       "Identificamos aplicaciones y riegos que se pueden ajustar sin afectar la producción.",
  "Trazabilidad campo a planta":          "Registro de labores e insumos por cuartel, conectado con la recepción.",
  "Coordinación de cosecha":              "Datos de madurez y clima para planificar cosecha y entregas con anticipación.",
  "Sanidad y alertas tempranas":          "Alertas por clima (heladas, riesgo de enfermedades) antes de que el problema se vea en el campo.",
  "Adopción tecnológica de productores":  "Formamos técnicos referentes que acompañan a los productores: la tecnología se adopta cuando alguien cercano la usa.",
}

// Recomendaciones que se muestran en vivo mientras el usuario responde
export function insights(r) {
  const out = []
  const cultivos = listaCultivos(r)

  if (conAsociados(r)) {
    out.push({
      titulo: "Tu red de productores",
      texto: `Con ${plural(r.productores, "productor", "productores")} asociados, AgroHub centraliza el seguimiento de cada campo y lo que se les entrega, con tu equipo técnico como extensionistas.`,
    })
  }
  if (cultivos.some(c => CULTIVOS_AGROINDUSTRIA.includes(c))) {
    out.push({
      titulo: "Del campo a la planta",
      texto: "En cultivos para agroindustria, conectar las prácticas de cada campo con lo que se mide en recepción (Brix, pH, rechazos) muestra qué manejo da mejores resultados.",
    })
  }
  if (cultivos.some(c => CULTIVOS_FRUTALES.includes(c))) {
    out.push({
      titulo: "Frutales",
      texto: "Estaciones y sensores permiten anticipar heladas y ajustar el riego por sector durante la temporada.",
    })
  }
  if (r.riegos.some(x => x === "Goteo" || x === "Microaspersión")) {
    out.push({
      titulo: "Riego tecnificado",
      texto: "Ya tienes la base: con sondas de humedad de suelo (por ejemplo HSTI) se decide cuándo y cuánto regar con datos, sector por sector.",
    })
  } else if (r.riegos.some(x => x === "Surco / tendido")) {
    out.push({
      titulo: "Riego por surco",
      texto: "Medir humedad de suelo y caudal es el primer paso para detectar sobrerriego y justificar tecnificar.",
    })
  } else if (r.riegos.includes("Secano")) {
    out.push({
      titulo: "Secano",
      texto: "El clima manda: estaciones meteorológicas y pronóstico local ayudan a decidir siembra, aplicaciones y cosecha.",
    })
  }
  if (r.zonas > 1 || r.hectareas >= 500) {
    out.push({
      titulo: "Escala",
      texto: `Con ${fmt(r.hectareas)} ha${r.zonas > 1 ? ` en ${r.zonas} zonas` : ""}, conviene partir con un piloto en sitios representativos, medir resultados y luego escalar.`,
    })
  }
  if (r.registros.includes("No llevamos registros")) {
    out.push({ titulo: "Registros", texto: "Partimos por lo básico: una bitácora simple de labores en el celular." })
  } else if (r.registros.some(x => ["WhatsApp", "Cuaderno de campo", "Planillas Excel"].includes(x))) {
    out.push({ titulo: "Registros", texto: "Digitalizamos lo que ya haces, sin cambiar hábitos: registro desde el celular en pocos toques." })
  }
  r.prioridades.forEach(p => INSIGHT_PRIORIDAD[p] && out.push({ titulo: p, texto: INSIGHT_PRIORIDAD[p] }))

  return out
}
