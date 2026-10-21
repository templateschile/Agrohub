// Utilidades compartidas del generador estático de /apis (www.agrohubs.cl).
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
export const ROOT = join(here, '..', '..')
export const SITE = 'https://www.agrohubs.cl'
export const UPDATED = '2026-10-20'

const read = (f) => JSON.parse(readFileSync(join(ROOT, 'data', 'apis', f), 'utf8'))
// Textos para el público: reemplazan los del catálogo técnico y ocultan fichas internas
const PUBLICO = read('publico.json')
export const APIS = read('integraciones.json')
  .filter((a) => !(PUBLICO[a.key] && PUBLICO[a.key].ocultar))
  .map((a) => {
    const o = PUBLICO[a.key] || {}
    return { ...a, resumen: o.resumen || a.resumen, descripcion: o.descripcion || a.descripcion, que_entrega: o.que_entrega || a.que_entrega, faq: o.faq || (o.descripcion ? [] : a.faq || []) }
  })
// Posiciones recalculadas sin las fichas ocultas
for (const dim of ['relevancia', 'popularidad', 'chile', 'latam']) {
  [...APIS].sort((x, y) => y.ranking[dim] - x.ranking[dim] || y.ranking.relevancia - x.ranking.relevancia || x.nombre.localeCompare(y.nombre, 'es'))
    .forEach((a, i) => { a.ranking['pos_' + dim] = i + 1 })
}
const visibles = new Set(APIS.map((a) => a.slug))
for (const a of APIS) a.relacionadas = a.relacionadas.filter((s) => visibles.has(s))
export const CATEGORIAS = read('categorias.json')
export const CASOS = read('casos_de_uso.json')

export const bySlug = Object.fromEntries(APIS.map((a) => [a.slug, a]))
export const cat = Object.fromEntries(CATEGORIAS.map((c) => [c.slug, c]))
export const caso = Object.fromEntries(CASOS.map((c) => [c.slug, c]))

export const PAIS = { CL: 'Chile', AR: 'Argentina', BR: 'Brasil', CO: 'Colombia', MX: 'México', PE: 'Perú', UY: 'Uruguay', GLOBAL: 'Global' }
export const ESTADO = {
  integrada: 'Ya conectada en AgroHubs', proxy: 'Ya conectada en AgroHubs', scheduler: 'Ya conectada en AgroHubs',
  plataforma: 'Herramienta en uso en AgroHubs', planificada: 'Próximamente en AgroHubs', evaluacion: 'AgroHubs la conecta a pedido', enlace: 'Sin conexión automática'
}
export const ESTADO_TXT = {
  integrada: 'AgroHubs ya está conectado a esta fuente. Si integras tu sistema con AgroHubs, recibes estos datos junto a las demás fuentes, en un solo formato y sin tramitar claves ni mantener la conexión.',
  proxy: 'AgroHubs ya está conectado a esta fuente. Si integras tu sistema con AgroHubs, recibes estos datos junto a las demás fuentes, en un solo formato y sin tramitar claves ni mantener la conexión.',
  scheduler: 'AgroHubs ya trae estos datos de forma periódica. Si integras tu sistema con AgroHubs, los recibes listos y actualizados junto a las demás fuentes.',
  plataforma: 'AgroHubs usa esta herramienta en su propia plataforma, así que sabemos cómo integrarla en la tuya.',
  planificada: 'AgroHubs la conectará próximamente. Si la necesitas antes, podemos priorizarla dentro de tu proyecto.',
  evaluacion: 'AgroHubs todavía no la ofrece conectada por defecto, pero puede integrarla a pedido dentro de tu proyecto.',
  enlace: 'Esta fuente no ofrece una conexión automática: sus datos se consultan en el sitio del proveedor o se descargan. Podemos evaluar contigo si conviene automatizar la carga.'
}
export const TIPO = { api_rest: 'API (conexión directa)', web_service: 'Servicio web', portal_datos: 'Portal de datos descargables', sdk: 'Estándar o librería', conector_hardware: 'Equipo o sensor de campo', servicio_ia: 'Servicio de inteligencia artificial', plataforma: 'Plataforma o herramienta' }
export const MODELO = { gratis: 'Gratis', freemium: 'Gratis con límite de uso', pago: 'Pago mensual', uso: 'Pago según uso', cotizacion: 'Precio a pedido', convenio: 'Requiere acuerdo con el proveedor', propio: 'Incluido en AgroHubs' }
export const VERIF_COSTO = { oficial: 'precio publicado por el proveedor', terceros: 'precio confirmado por otros usuarios', estimado: 'precio aproximado, por confirmar con el proveedor', interno: 'incluido en AgroHubs', por_verificar: 'el proveedor no publica precio' }
export const VERIF = { verificado: 'Información confirmada', terceros: 'Confirmada por otros usuarios', por_verificar: 'Por confirmar con el proveedor' }
// Mapa de APIs (antes "radar"): cuatro niveles en lenguaje simple
export const ANILLO = { adoptar: 'Lista para usar', probar: 'Próxima a conectarse', evaluar: 'Disponible a pedido', resistir: 'No recomendada' }
export const ANILLO_CORTO = { adoptar: 'Lista para usar', probar: 'Próxima', evaluar: 'A pedido', resistir: 'No recomendada' }
export const ANILLO_TXT = {
  adoptar: 'puedes usarla hoy: está conectada en AgroHubs o lista para conectarse',
  probar: 'AgroHubs la conectará en los próximos meses',
  evaluar: 'AgroHubs puede conectarla si tu proyecto la necesita',
  resistir: 'hay alternativas mejores, más baratas o con menos restricciones'
}
export const CUADRANTES = [
  { slug: 'clima-suelo-agua', nombre: 'Clima, suelo y agua', color: '#2d7325' },
  { slug: 'satelite-territorio', nombre: 'Satélite y mapas', color: '#2570e8' },
  { slug: 'campo-conectado', nombre: 'Sensores, riego y maquinaria', color: '#9a6530' },
  { slug: 'mercados-datos-plataforma', nombre: 'Precios, datos y herramientas', color: '#6b4fa0' }
]
export const cuad = Object.fromEntries(CUADRANTES.map((c, i) => [c.slug, { ...c, i }]))
export const RANKINGS = [
  { dim: 'relevancia', nombre: 'Recomendadas por AgroHubs', corto: 'Recomendación', txt: 'las que más aportan a un sistema agrícola conectado, considerando utilidad y facilidad de conexión' },
  { dim: 'popularidad', nombre: 'Más usadas en el mundo', corto: 'Uso mundial', txt: 'las más adoptadas por empresas y desarrolladores a nivel global' },
  { dim: 'chile', nombre: 'Mejores para Chile', corto: 'Chile', txt: 'las más útiles para operar en Chile, por cobertura y uso local' },
  { dim: 'latam', nombre: 'Mejores para Latinoamérica', corto: 'Latinoamérica', txt: 'las más útiles para operar en la región' }
]

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
export const usd = (v) => v == null ? null : 'US$' + Number(v).toLocaleString('es-CL')
export const n = (v) => Number(v).toLocaleString('es-CL')
export const total = APIS.length

/** Puntaje 0–100 de accesibilidad de costo (para el radar de puntajes). */
export function accesibilidad(a) {
  const { modelo, mensual_usd: m } = a.costos
  if (modelo === 'gratis') return 100
  if (modelo === 'propio') return 90
  if (modelo === 'freemium') return 85
  if (modelo === 'cotizacion') return 30
  if (modelo === 'convenio') return m === 0 ? 70 : 35
  if (m == null) return 45
  return Math.round(Math.max(40, 90 - Math.log10(1 + m) * 18))
}

export const nivel = (s) => (s >= 80 ? 'alta' : s >= 50 ? 'media' : 'baja')
export const COTIZAR = '/apis/cotizar'

/** Bloque de llamado a la acción, presente en todas las páginas del directorio. */
export function cta(slug = '', variante = '') {
  const href = slug ? `${COTIZAR}?api=${slug}` : COTIZAR
  return `<section class="cta ${variante}" aria-labelledby="cta-${slug || 'general'}-${variante || 'b'}"><div class="wrap cta-in">
  <div><h2 id="cta-${slug || 'general'}-${variante || 'b'}">¿Quieres integrar tu software con múltiples fuentes y herramientas?</h2>
  <p>Conectamos tu sistema con clima, satélite, sensores, riego, precios y más, en una sola API. Tú eliges las fuentes; nosotros nos encargamos de la conexión y el mantenimiento.</p></div>
  <a class="btn btn-cta" href="${href}">Cotiza aquí</a>
</div></section>`
}

export function costoFrase(a) {
  const c = a.costos
  if (c.mensual_usd === 0) return `${a.nombre} se puede usar gratis (${c.plan.charAt(0).toLowerCase() + c.plan.slice(1)}).`
  if (c.mensual_usd != null) return `El plan de entrada cuesta cerca de ${usd(c.mensual_usd)} al mes, ${usd(c.anual_usd)} al año (${c.plan.charAt(0).toLowerCase() + c.plan.slice(1)}). Es un ${VERIF_COSTO[c.verificacion]}.`
  return `${a.nombre} no publica su precio: se acuerda directamente con ${a.proveedor}.`
}

export function chileFrase(a) {
  const pos = a.ranking.pos_chile
  if (a.pais === 'CL') return `Sí. Es una fuente chilena (${a.alcance}) y está en el lugar ${pos} de ${total} entre las mejores para Chile.`
  if (a.pais === 'GLOBAL') return `Sí, funciona en todo el mundo, Chile incluido. Su utilidad en Chile es ${nivel(a.ranking.chile)}: está en el lugar ${pos} de ${total} entre las mejores para Chile.`
  return `Su cobertura es ${a.alcance}. Para operar en Chile su utilidad es ${nivel(a.ranking.chile)} (lugar ${pos} de ${total}); en Latinoamérica está en el lugar ${a.ranking.pos_latam}.`
}

/** Preguntas frecuentes generadas desde los datos + las de la ficha. */
export function faqs(a) {
  const rel = a.relacionadas.map((s) => bySlug[s]).filter(Boolean).map((r) => r.nombre)
  const integ = `${ESTADO[a.estado_agrohubs]}. ${ESTADO_TXT[a.estado_agrohubs]}`
  const list = [
    { q: `¿Qué es ${a.nombre}?`, a: a.resumen },
    { q: `¿Cuánto cuesta ${a.nombre}?`, a: costoFrase(a) },
    { q: `¿${a.nombre} sirve para agricultores en Chile?`, a: chileFrase(a) },
    { q: `¿Cómo conecto ${a.nombre} con mi sistema?`, a: integ }
  ]
  if (rel.length) list.push({ q: `¿Qué alternativas hay a ${a.nombre}?`, a: `Alternativas o complementos: ${rel.join(', ')}.` })
  list.push({ q: `¿Cuánto cuesta integrar ${a.nombre} con AgroHubs?`, a: 'Depende de cuántas fuentes y sistemas quieras conectar. Cuéntanos tu caso en el formulario de cotización y te enviamos una propuesta.' })
  for (const f of a.faq || []) list.push({ q: f.q, a: f.a })
  return list
}

export const CSS_HREF = '/apis/apis.css'

const NAV = [
  ['Inicio', '/'], ['Dashboard', '/dashboard'], ['AI Chat', '/ai-chat'], ['Documentos', '/documentos'],
  ['Eventos', '/eventos'], ['Tienda', '/tienda'], ['Evaluación', '/evaluacion'], ['APIs', '/apis']
]

const LOGO = `<svg viewBox="0 0 32 32" fill="none" width="20" height="20" aria-hidden="true"><circle cx="16" cy="16" r="6" fill="white" opacity="0.9"/><path d="M16 4 C16 4 10 8 10 16" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M16 4 C16 4 22 8 22 16" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M6 20 C8 24 12 28 16 28" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M26 20 C24 24 20 28 16 28" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`

/**
 * Documento HTML completo. `path` sin dominio (p. ej. "/apis/open-meteo").
 * `md` = ruta de la versión Markdown para motores de IA.
 */
export function page({ path, title, description, body, jsonld = [], md = null, ogType = 'website', script = '' }) {
  const url = SITE + path
  const ld = jsonld.filter(Boolean).map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n')
  const nav = NAV.map(([l, h]) => `<a href="${h}"${h === '/apis' ? ' aria-current="page"' : ''}>${l}</a>`).join('')
  return `<!doctype html>
<html lang="es-CL">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="es-CL" href="${url}">
<link rel="alternate" hreflang="x-default" href="${url}">
${md ? `<link rel="alternate" type="text/markdown" href="${md}" title="Versión Markdown para motores de IA">` : ''}
<link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta name="geo.region" content="CL">
<meta name="geo.placename" content="Chile">
<meta name="language" content="es-CL">
<meta name="author" content="AgroHubs">
<meta property="og:site_name" content="AgroHubs">
<meta property="og:locale" content="es_CL">
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="theme-color" content="#183c15">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${CSS_HREF}">
${ld}
</head>
<body>
<a class="skip" href="#contenido">Saltar al contenido</a>
<header class="top">
  <div class="wrap top-in">
    <a class="brand" href="/" aria-label="AgroHubs — inicio"><span class="logo">${LOGO}</span><span><b>Agro<em>Hubs</em></b><small>Centro Demostrativo Móvil</small></span></a>
    <nav aria-label="Principal" class="nav">${nav}</nav>
  </div>
</header>
<main id="contenido">
${body}
</main>
<footer class="foot">
  <div class="wrap foot-in">
    <div><b>AgroHubs</b><p>Conocimiento que se comparte · Tecnología que acompaña · Decisiones que transforman.</p></div>
    <nav aria-label="Pie de página" class="foot-nav">
      <a href="/">Inicio</a><a href="/dashboard">Dashboard</a><a href="/tienda">Tienda</a><a href="/evaluacion">Evaluación</a>
      <a href="/apis">APIs agro</a><a href="/apis/radar">Mapa de APIs</a><a href="/apis/ranking">Ranking y costos</a><a href="${COTIZAR}">Cotiza tu integración</a>
    </nav>
  </div>
  <div class="wrap foot-base"><span>&copy; ${UPDATED.slice(0, 4)} AgroHubs · Chile</span><span>Directorio actualizado el ${fechaLarga(UPDATED)}</span></div>
</footer>
${script}
<script src="/apis/asesor.js" defer></script>
</body>
</html>
`
}

export function fechaLarga(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  const M = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  return `${d} de ${M[m - 1]} de ${y}`
}

export const breadcrumbLd = (items) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + path }))
})
export const faqLd = (list) => list.length ? ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: list.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
}) : null
export const orgLd = { '@type': 'Organization', name: 'AgroHubs', url: SITE, areaServed: { '@type': 'Country', name: 'Chile' } }

export const crumbs = (items) => `<nav class="crumbs" aria-label="Migas de pan"><ol>${items.map(([l, h], i) => i === items.length - 1 ? `<li aria-current="page">${esc(l)}</li>` : `<li><a href="${h}">${esc(l)}</a></li>`).join('')}</ol></nav>`

export const chipEstado = (a) => `<span class="chip st-${a.estado_agrohubs}">${esc(ESTADO[a.estado_agrohubs])}</span>`
export const chipAnillo = (a) => `<span class="chip ring-${a.radar.anillo}">${ANILLO[a.radar.anillo]}</span>`

export function costoCelda(a, k = 'mensual_usd') {
  const v = a.costos[k]
  if (v == null) return `<span class="muted">${a.costos.modelo === 'convenio' ? 'Con acuerdo' : 'A pedido'}</span>`
  if (v === 0) return 'US$0'
  return usd(v)
}

export const sortedBy = (dim) => [...APIS].sort((x, y) => x.ranking['pos_' + dim] - y.ranking['pos_' + dim])
