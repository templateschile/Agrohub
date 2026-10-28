// Datos y geometría del diagrama del ecosistema de la portada (EcosystemDiagram).
// Datos puros (se prueban en scripts/tests): sin JSX ni íconos.
//
// Anillos: centro AgroHubs → 12 módulos (lib/modulos.js) → integraciones con el agro, por categoría
// (data/apis/destacadas.json, que genera scripts/build-apis.mjs desde el catálogo) → sistemas generales.

// Anillo 3: sistemas generales, agrupados por tipo. Solo nombres (chips de texto), sin logos de marcas.
export const SISTEMAS_GENERALES = [
  { tipo: "IA", items: ["Claude", "OpenAI", "Higgsfield"] },
  { tipo: "Mensajería", items: ["WhatsApp", "Telegram"] },
  { tipo: "CRM / ventas", items: ["HubSpot", "Salesforce", "Kommo"] },
  { tipo: "ERP / facturación", items: ["Odoo", "Lioren", "Manager"] },
  { tipo: "Redes", items: ["Instagram", "Facebook"] },
]

// Fisaro va como integración solo en el diagrama: no está en el catálogo sincronizado
// (data/apis se copia desde agrohubs-app y no se edita aquí). Si el catálogo la suma, se deja de agregar.
export const FISARO = {
  nombre: "Fisaro",
  detalle: "asistente agrícola: documentos técnicos, calculadoras, clima",
  categoria: "ia-y-asistentes",
}

export const fisaroEnCatalogo = (categorias) =>
  categorias.some((c) => (c.top || []).some((t) => /fisaro/i.test(`${t.nombre} ${t.slug}`)))

// Parte un nombre en hasta `maxLineas` líneas de `ancho` caracteres (para los textos del SVG).
// Si no cabe, la última línea termina en "…".
export function envolver(texto, ancho = 14, maxLineas = 2) {
  const lineas = []
  for (const palabra of String(texto).split(/\s+/).filter(Boolean)) {
    const ultima = lineas[lineas.length - 1]
    if (ultima !== undefined && (ultima + " " + palabra).length <= ancho) lineas[lineas.length - 1] = ultima + " " + palabra
    else lineas.push(palabra)
  }
  if (lineas.length <= maxLineas) return lineas
  const cortadas = lineas.slice(0, maxLineas)
  const resto = lineas.slice(maxLineas - 1).join(" ")
  cortadas[maxLineas - 1] = resto.slice(0, ancho - 1).trimEnd() + "…"
  return cortadas
}

// Posición en un anillo: `i` de `n` puntos, partiendo arriba (‑90°) y en sentido horario.
export function polar(radio, i, n, desfaseGrados = 0) {
  const ang = ((-90 + desfaseGrados + (360 * i) / n) * Math.PI) / 180
  return { x: +(radio * Math.cos(ang)).toFixed(2), y: +(radio * Math.sin(ang)).toFixed(2), ang }
}

// Arco (path SVG) entre dos ángulos en radianes, en sentido horario.
export function arco(radio, desde, hasta) {
  const p = (a) => `${(radio * Math.cos(a)).toFixed(2)} ${(radio * Math.sin(a)).toFixed(2)}`
  const grande = hasta - desde > Math.PI ? 1 : 0
  return `M ${p(desde)} A ${radio} ${radio} 0 ${grande} 1 ${p(hasta)}`
}

// Ranuras del anillo 3: cada grupo ocupa una ranura con su nombre y una por sistema.
export function ranurasSistemas(grupos = SISTEMAS_GENERALES) {
  const ranuras = []
  grupos.forEach((g, gi) => {
    ranuras.push({ tipo: "grupo", texto: g.tipo, grupo: gi })
    g.items.forEach((item) => ranuras.push({ tipo: "item", texto: item, grupo: gi }))
  })
  return ranuras
}

// ── Geometría del SVG (unidades del viewBox: un cuadrado de 2 × MEDIO con el centro en 0,0) ──
// Radios elegidos para que ninguna etiqueta se toque con los datos actuales: lo revisa
// scripts/tests/ecosistema.test.mjs con las cajas de texto estimadas (cajasDiagrama + solapes).
export const GEO = {
  medio: 560,
  R: { centro: 92, modulos: 200, agro: 330, sistemas: 520 },
  nodo: 26, // radio de los nodos de módulo
  insignia: 18, // radio de los nodos de categoría
  pxModulo: 14, pxAgro: 13, pxChip: 14, pxGrupo: 11.5,
}

// Ancho estimado de un texto en Manrope semibold (para ubicar etiquetas sin medir el DOM)
// Distancia entre el borde de un nodo de módulo y la línea base de su nombre
export const BAJO_NODO = 19

export const anchoTexto = (texto, px, factor = 0.56) => String(texto).length * px * factor

// Etiqueta hacia afuera de un nodo: el centro del bloque de texto se aleja según el ángulo
// para que el texto no pise su propio nodo. Devuelve el desplazamiento del primer renglón.
export function etiquetaAfuera(p, lineas, px, separacion) {
  const w = Math.max(...lineas.map((l) => anchoTexto(l, px)))
  const h = lineas.length * (px + 2)
  const d = separacion + Math.abs(Math.cos(p.ang)) * (w / 2) + Math.abs(Math.sin(p.ang)) * (h / 2)
  return { x: Math.cos(p.ang) * d, y: Math.sin(p.ang) * d - h / 2 + px * 0.8, w, h, cx: Math.cos(p.ang) * d, cy: Math.sin(p.ang) * d }
}

// Anillo agro: una ranura por categoría y Fisaro justo después de la suya (o al final)
export function anilloAgro(categorias, conFisaro = !fisaroEnCatalogo(categorias)) {
  const anillo = categorias.flatMap((c) =>
    conFisaro && c.slug === FISARO.categoria ? [{ tipo: "cat", c }, { tipo: "fisaro" }] : [{ tipo: "cat", c }])
  if (conFisaro && !anillo.some((r) => r.tipo === "fisaro")) anillo.push({ tipo: "fisaro" })
  return anillo
}
export const lineasAgro = (r) => (r.tipo === "fisaro" ? [FISARO.nombre] : envolver(r.c.nombre, 14, 2))

// Props de lo que tiene detalle pero no es enlace (Fisaro y los grupos de sistemas generales): se llega
// con Tab y el detalle se muestra al recibir el foco, con Enter o Espacio, con un clic o al pasar el mouse.
// `panelId` es el panel del detalle (aria-live), que lo anuncia al cambiar.
export function propsDetalle(mostrar, etiqueta, panelId) {
  return {
    tabIndex: 0,
    role: "button",
    "aria-label": etiqueta,
    "aria-controls": panelId,
    onFocus: mostrar,
    onMouseEnter: mostrar,
    onClick: mostrar,
    onKeyDown: (e) => {
      if (e.key !== "Enter" && e.key !== " ") return
      e.preventDefault()
      mostrar()
    },
  }
}

// Cajas (x0, y0, x1, y1) de todo lo que tiene texto en el SVG, para revisar que nada se pise.
export function cajasDiagrama({ cortos, anillo, ranuras = ranurasSistemas(), geo = GEO }) {
  const { R, nodo, insignia, pxModulo, pxAgro, pxChip, pxGrupo } = geo
  const cajas = []
  const caja = (n, cx, cy, w, h) => cajas.push({ n, x0: cx - w / 2, x1: cx + w / 2, y0: cy - h / 2, y1: cy + h / 2 })
  const circulo = (n, cx, cy, r) => cajas.push({ n, cx, cy, r, x0: cx - r, x1: cx + r, y0: cy - r, y1: cy + r })
  cortos.forEach((t, i) => {
    const p = polar(R.modulos, i, cortos.length)
    circulo(`nodo ${t}`, p.x, p.y, nodo)
    // El nombre va bajo el nodo, con la línea base en y + nodo + BAJO_NODO
    caja(`etiqueta ${t}`, p.x, p.y + nodo + BAJO_NODO - pxModulo * 0.3, anchoTexto(t, pxModulo), pxModulo + 2)
  })
  anillo.forEach((r, i) => {
    const p = polar(R.agro, i, anillo.length)
    const lineas = lineasAgro(r)
    const e = etiquetaAfuera(p, lineas, pxAgro, insignia + 8)
    const nombre = r.tipo === "fisaro" ? FISARO.nombre : r.c.nombre
    circulo(`nodo ${nombre}`, p.x, p.y, insignia)
    caja(`etiqueta ${nombre}`, p.x + e.cx, p.y + e.cy, e.w, e.h)
  })
  ranuras.forEach((r, i) => {
    const p = polar(R.sistemas, i, ranuras.length)
    if (r.tipo === "grupo") caja(`grupo ${r.texto}`, p.x, p.y, anchoTexto(r.texto.toUpperCase(), pxGrupo, 0.72), pxGrupo + 2)
    else caja(`sistema ${r.texto}`, p.x, p.y, anchoTexto(r.texto, pxChip) + 28, 34)
  })
  return cajas
}

// Pares de figuras que se tocan (con `margen` de aire). Los nodos son círculos; los textos, cajas.
// La etiqueta de cada nodo va pegada a su nodo y no cuenta.
function seTocan(a, b, margen) {
  if (a.r && b.r) return Math.hypot(a.cx - b.cx, a.cy - b.cy) < a.r + b.r + margen
  if (a.r || b.r) {
    const [c, k] = a.r ? [a, b] : [b, a]
    const dx = Math.max(k.x0 - c.cx, 0, c.cx - k.x1), dy = Math.max(k.y0 - c.cy, 0, c.cy - k.y1)
    return Math.hypot(dx, dy) < c.r + margen
  }
  return a.x0 < b.x1 + margen && b.x0 < a.x1 + margen && a.y0 < b.y1 + margen && b.y0 < a.y1 + margen
}

export function solapes(cajas, margen = 4) {
  const malos = []
  for (let i = 0; i < cajas.length; i++) {
    for (let j = i + 1; j < cajas.length; j++) {
      const a = cajas[i], b = cajas[j]
      const propio = a.n.replace(/^nodo /, "etiqueta ") === b.n || b.n.replace(/^nodo /, "etiqueta ") === a.n
      if (!propio && seTocan(a, b, margen)) malos.push(`${a.n} × ${b.n}`)
    }
  }
  return malos
}
