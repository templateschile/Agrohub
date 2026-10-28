import { useId, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Sparkles } from "lucide-react"
import { HubMark } from "./HubMark"
import { MODULOS } from "../lib/modulos"
import {
  SISTEMAS_GENERALES, FISARO, GEO, BAJO_NODO, fisaroEnCatalogo, polar, arco, ranurasSistemas,
  anchoTexto, etiquetaAfuera, anilloAgro, lineasAgro, propsDetalle,
} from "../lib/ecosistema"
import DESTACADAS from "../../data/apis/destacadas.json"

// Diagrama concéntrico del ecosistema: AgroHubs al centro → 12 módulos → integraciones con el agro
// por categoría (resumen del catálogo en destacadas.json) → sistemas generales por tipo.
// Escritorio (≥ 70rem): SVG con anillos, navegable con Tab (módulos y categorías son enlaces; Fisaro y
// los grupos de sistemas, botones que muestran su detalle) y un panel que describe lo que está bajo el
// cursor o el foco. Celular y tablet: las mismas capas como listas.
// Sin logos de terceros: solo nombres en texto.

const CATEGORIAS = DESTACADAS.categorias || []
const TOTAL = DESTACADAS.total_directorio
const CON_FISARO = !fisaroEnCatalogo(CATEGORIAS)

// Anillo agro: una ranura por categoría y Fisaro justo después de la suya
const ANILLO_AGRO = anilloAgro(CATEGORIAS, CON_FISARO)

const RANURAS_SISTEMAS = ranurasSistemas()
const TOTAL_SISTEMAS = SISTEMAS_GENERALES.reduce((n, g) => n + g.items.length, 0)

// Geometría compartida con la prueba de solapes (lib/ecosistema.js)
const { R, nodo: NODO, insignia: INSIGNIA, medio: MEDIO } = GEO

const DETALLE_CENTRO = {
  titulo: "AgroHubs",
  texto: "La app y el panel de tu Centro Demostrativo Agrícola. Los módulos, las integraciones y los sistemas de tu equipo se conectan aquí.",
}

function Detalle({ foco, id }) {
  return (
    <div id={id} className="eco-detalle" aria-live="polite">
      <p className="eco-detalle__titulo">{foco.titulo}</p>
      <p className="eco-detalle__texto">{foco.texto}</p>
      {foco.lista && <p className="eco-detalle__lista"><b>Destacadas:</b> {foco.lista.join(", ")}</p>}
    </div>
  )
}

function DiagramaSvg({ setFoco, panelId }) {
  const navigate = useNavigate()
  const irA = ruta => e => { e.preventDefault(); navigate(ruta) }
  const pasoSis = 360 / RANURAS_SISTEMAS.length

  return (
    <svg className="eco-svg" viewBox={`${-MEDIO} ${-MEDIO} ${2 * MEDIO} ${2 * MEDIO}`} role="group" aria-labelledby="eco-svg-titulo eco-svg-desc">
      <title id="eco-svg-titulo">Ecosistema AgroHubs</title>
      <desc id="eco-svg-desc">
        {`AgroHubs al centro. Primer anillo: ${MODULOS.length} módulos. Segundo anillo: ${TOTAL} integraciones con el agro en ${CATEGORIAS.length} categorías${CON_FISARO ? ", más Fisaro" : ""}. Anillo exterior: ${TOTAL_SISTEMAS} sistemas generales agrupados por tipo.`}
      </desc>

      {/* Guías de los anillos */}
      <circle r={R.modulos} className="eco-guia" />
      <circle r={R.agro} className="eco-guia" />

      {/* Anillo 3: una banda por tipo de sistema, con su nombre y sus sistemas. Cada banda se enfoca
          con Tab (o el mouse) y muestra su detalle en el panel */}
      <g onMouseLeave={() => setFoco(DETALLE_CENTRO)}>
        {SISTEMAS_GENERALES.map((g, gi) => {
          const idx = RANURAS_SISTEMAS.map((r, i) => (r.grupo === gi ? i : -1)).filter(i => i >= 0)
          const rad = gr => (gr * Math.PI) / 180
          const desde = rad(-90 + idx[0] * pasoSis - pasoSis / 2 + 1.2)
          const hasta = rad(-90 + idx[idx.length - 1] * pasoSis + pasoSis / 2 - 1.2)
          const lista = g.items.join(", ")
          const mostrar = () => setFoco({ titulo: `Sistemas generales · ${g.tipo}`, texto: lista })
          return (
            <g key={g.tipo} className="eco-sistema" {...propsDetalle(mostrar, `Sistemas generales, ${g.tipo}: ${lista}`, panelId)}>
              <path d={arco(R.sistemas, desde, hasta)} className={`eco-banda eco-banda--${gi % 2 ? "b" : "a"}`} />
              {idx.map(i => {
                const r = RANURAS_SISTEMAS[i]
                const p = polar(R.sistemas, i, RANURAS_SISTEMAS.length)
                if (r.tipo === "grupo") {
                  return (
                    <text key={`g-${r.texto}`} x={p.x} y={p.y + 4} className="eco-grupo" textAnchor="middle">
                      {r.texto.toUpperCase()}
                    </text>
                  )
                }
                const w = anchoTexto(r.texto, GEO.pxChip) + 28
                return (
                  <g key={r.texto} transform={`translate(${p.x} ${p.y})`}>
                    <rect x={-w / 2} y={-17} width={w} height={34} rx={17} className="eco-chip" />
                    <text y={5} textAnchor="middle" className="eco-chip__texto">{r.texto}</text>
                  </g>
                )
              })}
            </g>
          )
        })}
      </g>

      {/* Anillo 2: integraciones con el agro, por categoría */}
      {ANILLO_AGRO.map((r, i) => {
        const p = polar(R.agro, i, ANILLO_AGRO.length)
        const lineas = lineasAgro(r)
        const t = etiquetaAfuera(p, lineas, GEO.pxAgro, INSIGNIA + 8)
        if (r.tipo === "fisaro") {
          const mostrar = () => setFoco({ titulo: FISARO.nombre, texto: `Integración: ${FISARO.detalle}.` })
          return (
            <g key="fisaro" className="eco-agro eco-agro--fisaro"
              {...propsDetalle(mostrar, `${FISARO.nombre}, integración: ${FISARO.detalle}`, panelId)}>
              <circle cx={p.x} cy={p.y} r={INSIGNIA} className="eco-n eco-n--fisaro" />
              <Sparkles x={p.x - 9} y={p.y - 9} size={18} strokeWidth={1.75} className="eco-n__icono" aria-hidden="true" />
              <text x={p.x + t.x} y={p.y + t.y} textAnchor="middle" className="eco-agro__texto">{lineas[0]}</text>
            </g>
          )
        }
        const c = r.c
        const detalle = { titulo: c.nombre, texto: `${c.total} integraciones en el directorio.`, lista: c.top.map(x => x.nombre) }
        return (
          <a key={c.slug} href={`/apis/categoria/${c.slug}`} className="eco-agro" aria-label={`${c.nombre}: ${c.total} integraciones`}
            onMouseEnter={() => setFoco(detalle)} onFocus={() => setFoco(detalle)}>
            <circle cx={p.x} cy={p.y} r={INSIGNIA} className="eco-n eco-n--agro" />
            <text x={p.x} y={p.y + 4.5} textAnchor="middle" className="eco-n__num">{c.total}</text>
            <text x={p.x + t.x} y={p.y + t.y} textAnchor="middle" className="eco-agro__texto">
              {lineas.map((l, k) => <tspan key={k} x={p.x + t.x} dy={k ? 15 : 0}>{l}</tspan>)}
            </text>
          </a>
        )
      })}

      {/* Anillo 1: los módulos */}
      {MODULOS.map((m, i) => {
        const p = polar(R.modulos, i, MODULOS.length)
        const Icono = m.icono
        const detalle = { titulo: m.nombre, texto: m.descripcion }
        return (
          <g key={m.key}>
            <line x1={(p.x * R.centro) / R.modulos} y1={(p.y * R.centro) / R.modulos} x2={(p.x * (R.modulos - NODO)) / R.modulos} y2={(p.y * (R.modulos - NODO)) / R.modulos} className="eco-radio" />
            <a href={m.ruta} onClick={irA(m.ruta)} className="eco-modulo" aria-label={m.nombre}
              onMouseEnter={() => setFoco(detalle)} onFocus={() => setFoco(detalle)}>
              <circle cx={p.x} cy={p.y} r={NODO} className="eco-n eco-n--modulo" />
              <Icono x={p.x - 11} y={p.y - 11} size={22} strokeWidth={1.75} className="eco-n__icono" aria-hidden="true" />
              <text x={p.x} y={p.y + NODO + BAJO_NODO} textAnchor="middle" className="eco-modulo__texto">{m.corto}</text>
            </a>
          </g>
        )
      })}

      {/* Centro */}
      <g className="eco-centro" onMouseEnter={() => setFoco(DETALLE_CENTRO)}>
        <circle r={R.centro} className="eco-centro__fondo" />
        <HubMark x={-30} y={-58} width={60} height={60} className="eco-centro__logo" title={null} />
        <text y={26} textAnchor="middle" className="eco-centro__nombre">AgroHubs</text>
        <text y={48} textAnchor="middle" className="eco-centro__bajada">Centro Demostrativo</text>
      </g>
    </svg>
  )
}

// Celular y tablet: las capas apiladas, de adentro hacia afuera
function Capas() {
  return (
    <ol className="eco-capas">
      <li className="eco-capa eco-capa--centro">
        <span className="eco-capa__logo"><HubMark className="eco-capa__hub" title={null} /></span>
        <div>
          <h3 className="eco-capa__titulo">AgroHubs, al centro</h3>
          <p className="eco-capa__texto">{DETALLE_CENTRO.texto}</p>
        </div>
      </li>
      <li className="eco-capa">
        <h3 className="eco-capa__titulo">{MODULOS.length} módulos</h3>
        <ul className="eco-chips">
          {MODULOS.map(m => {
            const Icono = m.icono
            return (
              <li key={m.key}>
                <Link to={m.ruta} className="eco-chip-link"><Icono size={16} strokeWidth={1.75} aria-hidden="true" />{m.nombre}</Link>
              </li>
            )
          })}
        </ul>
      </li>
      <li className="eco-capa">
        <h3 className="eco-capa__titulo">{TOTAL} integraciones con el agro</h3>
        <p className="eco-capa__texto">Agrupadas en {CATEGORIAS.length} categorías, con las más recomendadas de cada una.</p>
        <ul className="eco-cats">
          {CATEGORIAS.map(c => (
            <li key={c.slug} className="eco-cat">
              <a href={`/apis/categoria/${c.slug}`} className="eco-cat__nombre">{c.nombre}</a>
              <span className="eco-cat__total">{c.total}<span className="visually-hidden"> integraciones</span></span>
              <p className="eco-cat__top">
                {CON_FISARO && c.slug === FISARO.categoria && <><b>{FISARO.nombre}</b>, {FISARO.detalle}. </>}
                {c.top.map((t, k) => <span key={t.slug}>{k ? ", " : ""}<a href={`/apis/${t.slug}`}>{t.nombre}</a></span>)}
              </p>
            </li>
          ))}
        </ul>
      </li>
      <li className="eco-capa">
        <h3 className="eco-capa__titulo">Sistemas generales</h3>
        <ul className="eco-sistemas">
          {SISTEMAS_GENERALES.map(g => (
            <li key={g.tipo}>
              <h4 className="eco-sistemas__tipo">{g.tipo}</h4>
              <ul className="eco-chips eco-chips--texto">{g.items.map(s => <li key={s}><span className="eco-chip-texto">{s}</span></li>)}</ul>
            </li>
          ))}
        </ul>
      </li>
    </ol>
  )
}

export default function EcosystemDiagram() {
  const [foco, setFoco] = useState(DETALLE_CENTRO)
  const panelId = useId()
  return (
    <div className="eco">
      <figure className="eco-figura">
        <DiagramaSvg setFoco={setFoco} panelId={panelId} />
        <figcaption className="eco-figura__pie">
          <ul className="eco-leyenda" aria-label="Anillos del diagrama">
            <li><span className="eco-leyenda__marca eco-leyenda__marca--modulo" aria-hidden="true" />{MODULOS.length} módulos</li>
            <li><span className="eco-leyenda__marca eco-leyenda__marca--agro" aria-hidden="true" />{TOTAL} integraciones con el agro, por categoría</li>
            <li><span className="eco-leyenda__marca eco-leyenda__marca--sistema" aria-hidden="true" />{TOTAL_SISTEMAS} sistemas generales</li>
          </ul>
          <Detalle foco={foco} id={panelId} />
        </figcaption>
      </figure>
      <Capas />
    </div>
  )
}
