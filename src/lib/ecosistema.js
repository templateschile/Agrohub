// Ecosistema de la portada (components/Ecosistema.jsx): AgroHubs al centro, los 12 módulos, los conectores
// y los servicios de terceros. Datos puros, sin JSX ni íconos, para probarlos en scripts/tests.
//
// De dónde sale cada dato (repo de la plataforma, templateschile/agrohubs-app):
// - Módulos: los 12 de api/src/predios/catalogo.js (MODULOS), los mismos `key` de src/lib/modulos.js.
// - Conectores: los de api/src/predios/catalogo.js (CONECTORES), api/src/sensors/connectors/index.js,
//   api/src/conectores/conectores.service.js y los proveedores de api/src/hub/providers/. `fuente` dice cuál.
// - Estado de cada integración:
//     conectada     hay código que la usa hoy (como "Ya conectada" en el directorio /apis)
//     proximamente  declarada como planificada en la plataforma o en el catálogo (/apis)
//     pedido        no está construida: AgroHubs la conecta si un cliente la pide
//   Nada "a pedido" ni "próximamente" se muestra como conectado.

export const ESTADOS = {
  conectada: { texto: "Conectada", detalle: "Funciona hoy" },
  proximamente: { texto: "Próximamente", detalle: "En desarrollo" },
  pedido: { texto: "A pedido", detalle: "La conectamos si la necesitas" },
}
const ORDEN_ESTADO = ["conectada", "proximamente", "pedido"]
export const mejorEstado = (estados) => ORDEN_ESTADO.find((e) => estados.includes(e)) || "pedido"

// Orden de los módulos en el anillo, elegido para que los que comparten conectores o servicios queden
// juntos (AI Chat y Avisos usan los mismos modelos de IA; Avisos y Clima, Open-Meteo; Clima, Fuentes y
// Biblioteca, INIA; Biblioteca y Sensores, AWS; Bitácora, Eventos y Mercado, el CRM y el ERP).
export const ORDEN_MODULOS = [
  "dashboard_sensores", "drones", "bitacora", "eventos", "tienda", "fenologia",
  "calculadoras", "chat_ia", "recomendaciones", "clima", "fuentes", "documentos",
]

// Slug de un módulo para la URL (?modulo=sensores): su nombre corto sin tildes
export const slugDe = (texto) => String(texto).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

// Categorías del directorio /apis (data/apis/categorias.json) que corresponden a cada módulo: con ellas la
// lista de integraciones de la región (components/Integraciones.jsx) sigue el mismo filtro.
export const CATEGORIAS_MODULO = {
  dashboard_sensores: ["sensores-iot", "riego-y-control"],
  bitacora: ["gestion-predial", "trazabilidad-y-certificacion"],
  chat_ia: ["ia-y-asistentes"],
  documentos: ["documentos-y-conocimiento"],
  fuentes: ["datos-publicos-y-estadisticas", "geodatos-y-territorio"],
  clima: ["clima-y-meteorologia"],
  recomendaciones: ["clima-y-meteorologia", "modelos-y-agronomia"],
  fenologia: ["modelos-y-agronomia"],
  calculadoras: ["modelos-y-agronomia", "suelo-y-agua"],
  eventos: [],
  tienda: ["mercados-y-precios"],
  drones: ["satelite-y-teledeteccion", "maquinaria-y-telematica"],
}

// Anillo 2. `etiqueta`: líneas del chip en el diagrama.
export const CONECTORES = [
  { id: "ia", nombre: "Modelos de IA", etiqueta: ["Modelos", "de IA"], fuente: "api/src/asistente/llm.js" },
  { id: "reglas", nombre: "Reglas por clima", etiqueta: ["Reglas", "por clima"], fuente: "api/src/recomendaciones/clima.js" },
  { id: "mensajeria", nombre: "Mensajería", etiqueta: ["Mensajería"], fuente: "api/src/notificaciones/notificador.js" },
  { id: "agromet", nombre: "Red agrometeorológica", etiqueta: ["Red", "agromet"], fuente: "api/src/clima/agromet.sync.js" },
  { id: "pronostico", nombre: "Pronóstico", etiqueta: ["Pronóstico"], fuente: "api/src/clima/lugar.js" },
  { id: "agro", nombre: "Plataformas agro", etiqueta: ["Plataformas", "agro"], fuente: "api/src/predios/catalogo.js (modag, kadi)" },
  { id: "publicos", nombre: "Datos públicos", etiqueta: ["Datos", "públicos"], fuente: "api/src/hub/providers/" },
  { id: "inia", nombre: "Biblioteca INIA", etiqueta: ["Biblioteca", "INIA"], fuente: "api/src/inia-scheduler/" },
  { id: "archivos", nombre: "Archivos", etiqueta: ["Archivos"], fuente: "api/src/upload/" },
  { id: "http", nombre: "Push HTTP", etiqueta: ["Push HTTP"], fuente: "api/src/sensors/connectors/generic-http.js" },
  { id: "equipos", nombre: "Equipos de campo", etiqueta: ["Equipos", "de campo"], fuente: "api/src/sensors/connectors/index.js" },
  { id: "dronx", nombre: "API DronX", etiqueta: ["API DronX"], fuente: "api/src/drones/dronx.client.js" },
  { id: "satelite", nombre: "Satélite", etiqueta: ["Satélite"], fuente: "catálogo /apis (sentinel-hub-cdse)" },
  { id: "gestion", nombre: "CRM y ERP", etiqueta: ["CRM y ERP"], fuente: "a pedido" },
  { id: "tienda", nombre: "Tienda web", etiqueta: ["Tienda web"], fuente: "api/src/predios/catalogo.js (woocommerce)" },
  { id: "cobros", nombre: "Cobros y facturas", etiqueta: ["Cobros y", "facturas"], fuente: "api/src/common/utils/mercadopago.js" },
  { id: "compartir", nombre: "Compartir", etiqueta: ["Compartir"], fuente: "api/src/calculators/calculators.service.js" },
  { id: "terceros", nombre: "API de terceros", etiqueta: ["API de", "terceros"], fuente: "api/src/fuentes-externas/registro.js" },
]

// Anillo 3: nombres como texto, sin logos de marcas. `que`: qué es, en una línea, para quien no lo conoce.
export const SERVICIOS = [
  { id: "claude", nombre: "Claude", que: "Modelos de IA de Anthropic" },
  { id: "openai", nombre: "OpenAI", que: "Modelos de IA de OpenAI" },
  { id: "google", nombre: "Google", que: "Gemini, Firebase y búsqueda de Google" },
  { id: "perplexity", nombre: "Perplexity" },
  { id: "azure", nombre: "Azure", que: "Nube de Microsoft" },
  { id: "aws", nombre: "AWS", que: "Nube de Amazon" },
  { id: "whatsapp", nombre: "WhatsApp" },
  { id: "telegram", nombre: "Telegram" },
  { id: "open-meteo", nombre: "Open-Meteo" },
  { id: "openweather", nombre: "OpenWeather" },
  { id: "weatherapi", nombre: "WeatherAPI" },
  { id: "inia", nombre: "INIA", que: "Instituto de Investigaciones Agropecuarias de Chile" },
  { id: "dmc", nombre: "DMC", que: "Dirección Meteorológica de Chile" },
  { id: "modag", nombre: "MODAG" },
  { id: "kadi", nombre: "Kadi" },
  { id: "ciren", nombre: "CIREN", que: "Centro de Información de Recursos Naturales de Chile" },
  { id: "conaf", nombre: "CONAF", que: "Corporación Nacional Forestal de Chile" },
  { id: "odepa", nombre: "ODEPA", que: "Oficina de Estudios y Políticas Agrarias de Chile" },
  { id: "mercado-publico", nombre: "Mercado Público", que: "Compras públicas de Chile (ChileCompra)" },
  { id: "lorawan", nombre: "LoRaWAN", que: "Red de sensores de largo alcance, con The Things Stack" },
  { id: "wiseconn", nombre: "WiseConn" },
  { id: "meter", nombre: "METER" },
  { id: "sentek", nombre: "Sentek" },
  { id: "cropx", nombre: "CropX" },
  { id: "pessl", nombre: "Pessl" },
  { id: "davis", nombre: "Davis" },
  { id: "dronx", nombre: "DronX" },
  { id: "copernicus", nombre: "Copernicus", que: "Satélites Sentinel de la Unión Europea" },
  { id: "sap", nombre: "SAP" },
  { id: "kommo", nombre: "Kommo" },
  { id: "woocommerce", nombre: "WooCommerce" },
  { id: "mercado-pago", nombre: "Mercado Pago" },
  { id: "sii", nombre: "SII", que: "Servicio de Impuestos Internos de Chile" },
  { id: "fisaro", nombre: "Fisaro", que: "Asistente agrícola de otra empresa" },
]

// Una fila por módulo, conector y servicio. `servicio: null` es un conector abierto, sin un tercero detrás.
const fila = (modulo, conector, servicio, detalle, estado, fuente) => ({ modulo, conector, servicio, detalle, estado, fuente })
export const INTEGRACIONES = [
  // AI Chat
  fila("chat_ia", "ia", "claude", "Asistente con herramientas y datos del predio", "conectada", "api/src/asistente/llm.js"),
  fila("chat_ia", "ia", "openai", "Asistente con herramientas y datos del predio", "conectada", "api/src/asistente/llm.js"),
  fila("chat_ia", "ia", "google", "Gemini", "conectada", "api/src/asistente/llm.js"),
  fila("chat_ia", "ia", "perplexity", "Sonar, con búsqueda web", "conectada", "api/src/asistente/llm.js"),
  fila("chat_ia", "ia", "azure", "Azure OpenAI", "pedido"),
  // Avisos (recomendaciones por clima)
  fila("recomendaciones", "reglas", "open-meteo", "Pronóstico para heladas, calor, lluvia y viento", "conectada", "api/src/recomendaciones/clima.js"),
  fila("recomendaciones", "ia", "claude", "Redacta el aviso según tus cultivos", "conectada", "api/src/recomendaciones/ + api/src/asistente/llm.js"),
  fila("recomendaciones", "ia", "openai", "Redacta el aviso según tus cultivos", "conectada", "api/src/recomendaciones/ + api/src/asistente/llm.js"),
  fila("recomendaciones", "mensajeria", "google", "Notificaciones push con Firebase", "conectada", "api/src/notificaciones/notificador.js"),
  fila("recomendaciones", "mensajeria", "whatsapp", "Avisos por WhatsApp", "pedido"),
  fila("recomendaciones", "mensajeria", "telegram", "Avisos por Telegram", "pedido", "bot en api/src/telegram/, hoy para otro uso"),
  // Clima
  fila("clima", "agromet", "inia", "Estaciones Agromet y alerta de tizón", "conectada", "api/src/clima/agromet.sync.js, api/src/clima/tizon.js"),
  fila("clima", "agromet", "dmc", "Pronóstico vía agrometeorologia.cl", "conectada", "api/src/clima/agromet.sync.js, api/src/hub/providers/dmc.js"),
  fila("clima", "pronostico", "open-meteo", "Pronóstico e histórico de cualquier punto", "conectada", "api/src/clima/lugar.js"),
  fila("clima", "pronostico", "openweather", "Pronóstico", "conectada", "api/src/integrations/clima/clima.controller.js"),
  fila("clima", "pronostico", "weatherapi", "Pronóstico", "conectada", "api/src/integrations/weather/weather.controller.js"),
  // Fuentes externas
  fila("fuentes", "agro", "modag", "Registros de campo del predio", "conectada", "api/src/predios/catalogo.js, api/src/hub/providers/modag.js"),
  fila("fuentes", "agro", "kadi", "Datos de sostenibilidad del predio", "conectada", "api/src/predios/catalogo.js, api/src/hub/providers/kadi.js"),
  fila("fuentes", "inia", "inia", "Publicaciones técnicas", "conectada", "api/src/inia-scheduler/inia-oai.js"),
  fila("fuentes", "publicos", "ciren", "Suelos y catastro frutícola", "conectada", "api/src/hub/providers/ciren-ide.js"),
  fila("fuentes", "publicos", "conaf", "Incendios forestales", "conectada", "api/src/hub/providers/conaf-geprif.js"),
  fila("fuentes", "publicos", "odepa", "Precios y mercados", "conectada", "api/src/hub/providers/odepa.js"),
  fila("fuentes", "publicos", "mercado-publico", "Licitaciones y compras ágiles del agro", "pedido", "api/src/oportunidades/, hoy solo en el panel interno"),
  // Biblioteca
  fila("documentos", "inia", "inia", "Biblioteca Digital INIA", "conectada", "api/src/inia-scheduler/inia-oai.js"),
  fila("documentos", "inia", "google", "Búsqueda en la biblioteca de INIA", "conectada", "api/src/inia-scheduler/inia-scheduler.service.js"),
  fila("documentos", "archivos", "aws", "Respaldo de documentos en S3", "pedido"),
  // Sensores
  fila("dashboard_sensores", "http", null, "Cualquier estación que envíe sus lecturas en JSON", "conectada", "api/src/sensors/connectors/generic-http.js"),
  fila("dashboard_sensores", "http", "lorawan", "Sensores LoRaWAN", "proximamente", "catálogo /apis (the-things-stack)"),
  fila("dashboard_sensores", "http", "aws", "AWS IoT Core", "pedido"),
  fila("dashboard_sensores", "equipos", "wiseconn", "DropControl, riego", "proximamente", "api/src/sensors/connectors/index.js"),
  fila("dashboard_sensores", "equipos", "meter", "ZENTRA Cloud, suelo", "proximamente", "api/src/sensors/connectors/index.js"),
  fila("dashboard_sensores", "equipos", "sentek", "IrriMAX Live, humedad de suelo", "proximamente", "api/src/sensors/connectors/index.js"),
  fila("dashboard_sensores", "equipos", "cropx", "Sensores de suelo", "proximamente", "api/src/sensors/connectors/index.js"),
  fila("dashboard_sensores", "equipos", "pessl", "FieldClimate, estaciones METOS", "proximamente", "api/src/sensors/connectors/index.js"),
  fila("dashboard_sensores", "equipos", "davis", "WeatherLink, estaciones", "proximamente", "api/src/sensors/connectors/index.js"),
  // Drones
  fila("drones", "dronx", "dronx", "Solicitudes de vuelo y su estado", "conectada", "api/src/drones/dronx.client.js"),
  fila("drones", "satelite", "copernicus", "Imágenes Sentinel para NDVI", "proximamente", "catálogo /apis (sentinel-hub-cdse)"),
  // Bitácora, Eventos y Mercado
  fila("bitacora", "gestion", "sap", "Labores, insumos y cosecha al ERP", "pedido"),
  fila("eventos", "gestion", "kommo", "Inscritos y seguimiento", "pedido"),
  fila("tienda", "tienda", "woocommerce", "Catálogo y pedidos de tu tienda", "conectada", "api/src/predios/catalogo.js (woocommerce)"),
  fila("tienda", "cobros", "mercado-pago", "Cobro de pedidos", "pedido", "hoy cobra suscripciones: api/src/common/utils/mercadopago.js"),
  fila("tienda", "cobros", "sii", "Boletas y facturas electrónicas", "pedido"),
  fila("tienda", "gestion", "kommo", "Compradores y ventas", "pedido"),
  fila("tienda", "gestion", "sap", "Pedidos al ERP", "pedido"),
  // Calculadoras y Fenología
  fila("calculadoras", "compartir", "whatsapp", "Envía el resultado por WhatsApp", "conectada", "api/src/calculators/calculators.service.js"),
  // Fisaro: el conector existe en la plataforma, apagado por defecto y solo con las credenciales que cargue el admin
  fila("calculadoras", "terceros", "fisaro", "Calculadoras particulares", "pedido", "api/src/fuentes-externas/registro.js, apagado por defecto"),
  fila("fenologia", "terceros", "fisaro", "Fases fenológicas por cultivo y zona", "pedido", "api/src/fuentes-externas/registro.js, apagado por defecto"),
]

export const conectorPorId = (id) => CONECTORES.find((c) => c.id === id)
export const servicioPorId = (id) => SERVICIOS.find((s) => s.id === id)
export const integracionesDe = (modulo) => INTEGRACIONES.filter((f) => f.modulo === modulo)
export const integracionesDeServicio = (servicio) => INTEGRACIONES.filter((f) => f.servicio === servicio)
export const modulosDeServicio = (servicio) => [...new Set(integracionesDeServicio(servicio).map((f) => f.modulo))]
export const estadoDeServicio = (servicio) => mejorEstado(integracionesDeServicio(servicio).map((f) => f.estado))
export const estadoDeConector = (conector) => mejorEstado(INTEGRACIONES.filter((f) => f.conector === conector).map((f) => f.estado))

// Cifras de la portada: servicios con al menos una conexión activa ("integraciones activas")
export function resumen() {
  const porEstado = { conectada: 0, proximamente: 0, pedido: 0 }
  SERVICIOS.forEach((s) => { porEstado[estadoDeServicio(s.id)]++ })
  return { servicios: SERVICIOS.length, conectores: CONECTORES.length, activas: porEstado.conectada, porEstado }
}

// Lo que queda resaltado con un módulo o un servicio elegido (null: todo)
export function resaltado(sel) {
  if (!sel) return null
  const filas = sel.tipo === "modulo" ? integracionesDe(sel.id) : integracionesDeServicio(sel.id)
  return {
    filas,
    modulos: new Set(sel.tipo === "modulo" ? [sel.id] : filas.map((f) => f.modulo)),
    conectores: new Set(filas.map((f) => f.conector)),
    servicios: new Set(filas.map((f) => f.servicio).filter(Boolean)),
    lineas: new Set(filas.flatMap((f) => [`m:${f.modulo}>${f.conector}`, f.servicio ? `c:${f.conector}>${f.servicio}` : null]).filter(Boolean)),
  }
}

// ── Geometría (unidades del viewBox: un cuadrado de 2 × MEDIO con AgroHubs en 0,0) ──
// Medidas elegidas para que nada se toque con estos datos: lo revisa scripts/tests/ecosistema.test.mjs
// con las cajas estimadas (cajasDiagrama + solapes). Chivo Mono: cada carácter mide 0,6 em.
export const GEO = {
  medio: 530,
  R: { centro: 76, modulos: 206, conectores: 298, servicios: 372 },
  baldosa: { alto: 50, minAncho: 72, relleno: 16 }, // módulos: ícono arriba y nombre abajo
  conector: 8, // medio lado del cuadrado de cada conector
  punto: 12, // radio del círculo de cada servicio (lleva su inicial)
  px: { modulo: 14, servicio: 15, conector: 13 },
}
export const anchoTexto = (texto, px) => String(texto).length * px * 0.6
export const anchoBaldosa = (corto, geo = GEO) => Math.max(geo.baldosa.minAncho, anchoTexto(corto, geo.px.modulo) + geo.baldosa.relleno)

const rad = (g) => (g * Math.PI) / 180
const norm = (g) => ((g % 360) + 360) % 360
export const punto = (radio, grados) => ({ x: +(radio * Math.cos(rad(grados))).toFixed(2), y: +(radio * Math.sin(rad(grados))).toFixed(2) })

// Ángulo medio de varios ángulos (en grados), sin el salto de 360 a 0
export function anguloMedio(angulos) {
  const x = angulos.reduce((s, a) => s + Math.cos(rad(a)), 0)
  const y = angulos.reduce((s, a) => s + Math.sin(rad(a)), 0)
  return norm((Math.atan2(y, x) * 180) / Math.PI)
}

// Reparte puntos en un anillo: parten en su ángulo deseado y se empujan hasta quedar a `gap` grados del
// vecino, sin cambiar el orden. Devuelve { id: ángulo }.
export function separar(items, gap) {
  const a = items.map((x, i) => ({ ...x, i, ang: norm(x.deseado) })).sort((p, q) => p.ang - q.ang || p.i - q.i)
  for (let vuelta = 0; vuelta < 2000; vuelta++) {
    let movio = false
    for (let i = 0; i < a.length; i++) {
      const p = a[i], q = a[(i + 1) % a.length]
      const d = q.ang - p.ang + (i === a.length - 1 ? 360 : 0)
      if (d < gap - 1e-6) { const m = (gap - d) / 2; p.ang -= m; q.ang += m; movio = true }
    }
    if (!movio) break
  }
  return Object.fromEntries(a.map((x) => [x.id, norm(x.ang)]))
}

// Posiciones de todo el diagrama. `cortos`: { key: nombre corto } de los módulos (lib/modulos.js).
export function plano(cortos, geo = GEO) {
  const { R } = geo
  const paso = 360 / ORDEN_MODULOS.length
  // Primer módulo medio paso a la derecha de arriba: así ninguno queda justo en la cima
  const angModulo = Object.fromEntries(ORDEN_MODULOS.map((k, i) => [k, norm(-90 + paso / 2 + i * paso)]))
  const usados = CONECTORES.filter((c) => INTEGRACIONES.some((f) => f.conector === c.id))
  const angConector = separar(usados.map((c) => ({
    id: c.id, deseado: anguloMedio([...new Set(INTEGRACIONES.filter((f) => f.conector === c.id).map((f) => f.modulo))].map((m) => angModulo[m])),
  })), 360 / usados.length * 0.8)
  const angServicio = separar(SERVICIOS.map((s) => ({
    id: s.id, deseado: anguloMedio([...new Set(integracionesDeServicio(s.id).map((f) => f.conector))].map((c) => angConector[c])),
  })), 360 / SERVICIOS.length * 0.9)

  const modulos = ORDEN_MODULOS.map((key) => ({ key, ang: angModulo[key], ...punto(R.modulos, angModulo[key]), ancho: anchoBaldosa(cortos[key] || key, geo) }))
  const conectores = usados.map((c) => ({ ...c, ang: angConector[c.id], ...punto(R.conectores, angConector[c.id]) }))
  const servicios = SERVICIOS.map((s) => ({ ...s, ang: angServicio[s.id], ...punto(R.servicios, angServicio[s.id]) }))
  const pos = Object.fromEntries([...modulos.map((m) => [`m:${m.key}`, m]), ...conectores.map((c) => [`c:${c.id}`, c]), ...servicios.map((s) => [`s:${s.id}`, s])])

  const lineas = []
  const vistas = new Set()
  for (const f of INTEGRACIONES) {
    const a = `m:${f.modulo}>${f.conector}`
    if (!vistas.has(a)) { vistas.add(a); lineas.push({ id: a, tipo: "modulo", d: curva(pos[`m:${f.modulo}`], pos[`c:${f.conector}`], R.modulos, R.conectores) }) }
    if (!f.servicio) continue
    const b = `c:${f.conector}>${f.servicio}`
    if (!vistas.has(b)) { vistas.add(b); lineas.push({ id: b, tipo: "servicio", d: curva(pos[`c:${f.conector}`], pos[`s:${f.servicio}`], R.conectores, R.servicios) }) }
  }
  const rayos = modulos.map((m) => ({ id: `r:${m.key}`, modulo: m.key, d: `M 0 0 L ${m.x} ${m.y}` }))
  return { modulos, conectores, servicios, lineas, rayos }
}

// Línea entre dos anillos: casi recta si los puntos están alineados; si no, se curva hacia adentro
function curva(a, b, ra, rb) {
  let delta = norm(b.ang - a.ang)
  if (delta > 180) delta -= 360
  const medio = a.ang + delta / 2
  const r = ((ra + rb) / 2) * (1 - Math.min(Math.abs(delta), 150) / 400)
  const c = punto(r, medio)
  return `M ${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}`
}

// Etiqueta de un servicio: sale hacia afuera del círculo, a lo largo del radio. En la mitad izquierda se
// gira 180° para que se lea de izquierda a derecha.
export function etiquetaServicio(s, geo = GEO) {
  const izquierda = s.ang > 90 && s.ang < 270
  const r = geo.R.servicios + geo.punto + 6
  const p = punto(r, s.ang)
  return { x: p.x, y: p.y, rot: izquierda ? s.ang - 180 : s.ang, ancla: izquierda ? "end" : "start" }
}

// Cajas de todo lo que tiene texto o forma en el diagrama, para revisar que nada se pise
export function cajasDiagrama(cortos, geo = GEO) {
  const { modulos, conectores, servicios } = plano(cortos, geo)
  const cajas = []
  const caja = (n, cx, cy, w, h) => cajas.push({ n, x0: cx - w / 2, x1: cx + w / 2, y0: cy - h / 2, y1: cy + h / 2 })
  caja("centro", 0, 0, geo.R.centro * 2, geo.R.centro * 2)
  modulos.forEach((m) => caja(`módulo ${m.key}`, m.x, m.y, m.ancho, geo.baldosa.alto))
  conectores.forEach((c) => caja(`conector ${c.id}`, c.x, c.y, geo.conector * 2, geo.conector * 2))
  servicios.forEach((s) => {
    caja(`servicio ${s.id}`, s.x, s.y, geo.punto * 2, geo.punto * 2)
    // La etiqueta radial, como una serie de cajitas a lo largo del radio
    const largo = anchoTexto(s.nombre, geo.px.servicio)
    for (let d = 0; d <= largo; d += geo.px.servicio * 0.6) {
      const p = punto(geo.R.servicios + geo.punto + 6 + d, s.ang)
      caja(`etiqueta ${s.id}`, p.x, p.y, 2, 2)
    }
  })
  return cajas
}

// Pares de cajas que se tocan (con `margen` de aire). Las partes de una misma etiqueta, y la etiqueta con
// su propio círculo, no cuentan.
export function solapes(cajas, margen = 2) {
  const malos = new Set()
  for (let i = 0; i < cajas.length; i++) {
    for (let j = i + 1; j < cajas.length; j++) {
      const a = cajas[i], b = cajas[j]
      if (a.n === b.n || a.n.split(" ")[1] === b.n.split(" ")[1] && /^(servicio|etiqueta) /.test(a.n) && /^(servicio|etiqueta) /.test(b.n)) continue
      if (a.x0 < b.x1 + margen && b.x0 < a.x1 + margen && a.y0 < b.y1 + margen && b.y0 < a.y1 + margen) malos.add(`${a.n} × ${b.n}`)
    }
  }
  return [...malos]
}

// Lo que se ve de una etiqueta de servicio: ¿cabe dentro del viewBox?
export function dentroDelLienzo(geo = GEO) {
  return SERVICIOS.every((s) => geo.R.servicios + geo.punto + 6 + anchoTexto(s.nombre, geo.px.servicio) <= geo.medio)
}
