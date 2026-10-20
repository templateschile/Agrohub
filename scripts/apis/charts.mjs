// Gráficos SVG estáticos: radar tecnológico (anillos × cuadrantes) y radar de puntajes por API.
import { APIS, CUADRANTES, ANILLO, cuad, esc, accesibilidad } from './lib.mjs'

const RINGS = ['adoptar', 'probar', 'evaluar', 'resistir']
const BANDS = [[0, 0.3], [0.3, 0.52], [0.52, 0.86], [0.86, 1]]
// ángulos matemáticos (y hacia arriba): Q0 arriba-izq 90–180, Q1 arriba-der 0–90, Q2 abajo-izq 180–270, Q3 abajo-der 270–360
const Q_START = [90, 0, 180, 270]

/** Numeración estable: cuadrante → anillo → relevancia → nombre. */
export const RADAR_ITEMS = (() => {
  const items = APIS.map((a) => ({ a, q: cuad[a.radar.cuadrante].i, r: RINGS.indexOf(a.radar.anillo) }))
    .sort((x, y) => x.q - y.q || x.r - y.r || y.a.ranking.relevancia - x.a.ranking.relevancia || x.a.nombre.localeCompare(y.a.nombre, 'es'))
  items.forEach((it, i) => { it.n = i + 1 })
  return items
})()
export const radarNum = Object.fromEntries(RADAR_ITEMS.map((it) => [it.a.slug, it.n]))

export function techRadarSvg({ size = 720, highlight = null } = {}) {
  const W = size, cx = W / 2, cy = W / 2, R = W / 2 - 40
  const out = []
  out.push(`<svg class="radar" viewBox="0 0 ${W} ${W}" width="100%" role="img" aria-labelledby="radar-t radar-d"><title id="radar-t">Radar tecnológico de APIs agro de AgroHubs</title><desc id="radar-d">${APIS.length} APIs agrícolas ubicadas en cuatro cuadrantes (clima, suelo y agua; satélite y territorio; campo conectado; mercados, datos y plataforma) y cuatro anillos (adoptar, probar, evaluar, resistir).</desc>`)
  BANDS.slice().reverse().forEach(([, o], i) => out.push(`<circle cx="${cx}" cy="${cy}" r="${(o * R).toFixed(1)}" fill="${i % 2 ? '#ffffff' : '#f6faf4'}" stroke="#dcefd8"/>`))
  out.push(`<line x1="${cx - R}" x2="${cx + R}" y1="${cy}" y2="${cy}" stroke="#b9dfb1"/><line y1="${cy - R}" y2="${cy + R}" x1="${cx}" x2="${cx}" stroke="#b9dfb1"/>`)
  RINGS.forEach((k, i) => out.push(`<text x="${cx + 5}" y="${(cy - (BANDS[i][0] + (BANDS[i][1] - BANDS[i][0]) / 2) * R).toFixed(1)}" dy="0.35em" font-size="12" fill="#5b6b57">${ANILLO[k]}</text>`))
  const corners = [[10, 18, 'start'], [W - 10, 18, 'end'], [10, W - 10, 'start'], [W - 10, W - 10, 'end']]
  CUADRANTES.forEach((q, i) => out.push(`<text x="${corners[i][0]}" y="${corners[i][1]}" text-anchor="${corners[i][2]}" font-size="14" font-weight="700" fill="${q.color}">${esc(q.nombre)}</text>`))

  const groups = {}
  for (const it of RADAR_ITEMS) (groups[`${it.q}-${it.r}`] ||= []).push(it)
  for (const list of Object.values(groups)) {
    const { q, r } = list[0]
    const [i0, i1] = BANDS[r]
    const lanes = list.length > 10 ? 3 : list.length > 4 ? 2 : 1
    const perLane = Math.ceil(list.length / lanes)
    list.forEach((it, i) => {
      const lane = i % lanes, k = Math.floor(i / lanes), pad = 8
      const ang = (Q_START[q] + pad + (k + 0.5 + (lane % 2) * 0.5) * (90 - 2 * pad) / (perLane + 0.5)) * Math.PI / 180
      const rr = (i0 + (i1 - i0) * (lanes === 1 ? 0.5 : 0.18 + 0.64 * lane / (lanes - 1))) * R
      it.x = cx + rr * Math.cos(ang); it.y = cy - rr * Math.sin(ang)
    })
  }
  for (const it of RADAR_ITEMS) {
    const col = CUADRANTES[it.q].color
    const hollow = it.r === 3
    const hl = highlight && it.a.slug === highlight
    const rad = hl ? 13 : 10
    out.push(`<a href="/apis/${it.a.slug}" aria-label="${esc(`${it.n}. ${it.a.nombre} — ${ANILLO[it.a.radar.anillo]}`)}"><g transform="translate(${it.x.toFixed(1)},${it.y.toFixed(1)})"${highlight && !hl ? ' opacity="0.35"' : ''}><title>${esc(`${it.n}. ${it.a.nombre} · ${ANILLO[it.a.radar.anillo]}`)}</title><circle r="${rad}" fill="${hollow ? '#ffffff' : col}" stroke="${hl ? '#183c15' : col}" stroke-width="${hl ? 3 : 1.5}"/><text text-anchor="middle" dy="0.35em" font-size="${hl ? 11 : 9}" font-weight="700" fill="${hollow ? col : '#ffffff'}">${it.n}</text></g></a>`)
  }
  out.push('</svg>')
  return out.join('')
}

/** Radar de puntajes de una API: relevancia, popularidad, Chile, LatAm y accesibilidad de costo. */
export function scoreRadarSvg(a, size = 300) {
  const axes = [
    ['Relevancia', a.ranking.relevancia], ['Popularidad', a.ranking.popularidad], ['Chile', a.ranking.chile],
    ['LatAm', a.ranking.latam], ['Costo accesible', accesibilidad(a)]
  ]
  const W = size + 200, H = size + 40, cx = W / 2, cy = H / 2 + 4, R = size / 2 - 10
  const pt = (i, v) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / axes.length
    return [cx + (v / 100) * R * Math.cos(ang), cy + (v / 100) * R * Math.sin(ang)]
  }
  const out = [`<svg class="spider" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-labelledby="sp-t-${a.slug}"><title id="sp-t-${a.slug}">${esc(`Puntajes de ${a.nombre}: ` + axes.map(([k, v]) => `${k} ${v}`).join(', '))}</title>`]
  ;[25, 50, 75, 100].forEach((lv) => out.push(`<polygon points="${axes.map((_, i) => pt(i, lv).map((x) => x.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="#dcefd8"/>`))
  axes.forEach((_, i) => { const [x, y] = pt(i, 100); out.push(`<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#dcefd8"/>`) })
  out.push(`<polygon points="${axes.map(([, v], i) => pt(i, v).map((x) => x.toFixed(1)).join(',')).join(' ')}" fill="rgba(61,145,50,0.22)" stroke="#2d7325" stroke-width="2" stroke-linejoin="round"/>`)
  axes.forEach(([k, v], i) => {
    const [x, y] = pt(i, v)
    out.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" fill="#2d7325"/>`)
    const [lx, ly] = pt(i, 118)
    const anchor = Math.abs(lx - cx) < 8 ? 'middle' : lx > cx ? 'start' : 'end'
    out.push(`<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}" dy="0.35em" font-size="12" fill="#3b4a37">${esc(k)} <tspan font-weight="700">${v}</tspan></text>`)
  })
  out.push('</svg>')
  return out.join('')
}
