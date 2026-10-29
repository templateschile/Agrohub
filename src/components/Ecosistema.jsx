import { useEffect, useMemo, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Pause, Play } from "lucide-react"
import { HubMark } from "./HubMark"
import DESTACADAS from "../../data/apis/destacadas.json"
import { useIdioma, useModulos, useModulosProximos, Enlace } from "../i18n"
import TRAD from "../i18n/datos/ecosistema.js"
import {
  ESTADOS, SERVICIOS, GEO, ORDEN_MODULOS, conectorPorId, servicioPorId, integracionesDe, integracionesDeServicio,
  modulosDeServicio, estadoDeServicio, estadoDeConector, resumen, resaltado, plano, etiquetaServicio,
} from "../lib/ecosistema"

// El ecosistema de AgroHubs: el centro, los 12 módulos, sus conectores y los servicios de terceros.
// Lo principal es el filtro: al elegir un módulo (en la fila de botones o en el diagrama) queda resaltado
// solo lo suyo y la lista muestra solo sus integraciones. Al elegir un servicio se ve en qué módulos se usa.
// El filtro queda en la URL (?modulo=sensores o ?servicio=google) y lo sigue también la lista de
// integraciones de la región (components/Integraciones.jsx).
// El diagrama es para mirar y tocar con el mouse; con teclado y lector de pantalla se usa la fila de
// módulos y la lista, que dicen lo mismo.

const RESUMEN = resumen()
const SERV_POR_ESTADO = Object.keys(ESTADOS).map(e => ({ estado: e, servicios: SERVICIOS.filter(s => estadoDeServicio(s.id) === e) }))
// El filtro de la URL usa el nombre corto en español, igual en los tres idiomas
export const SLUG_MODULO = {
  dashboard_sensores: "sensores", bitacora: "bitacora", chat_ia: "chat-ia", documentos: "biblioteca", fuentes: "fuentes",
  clima: "clima", recomendaciones: "recomendaciones", fenologia: "fenologia", calculadoras: "calculadoras",
  eventos: "eventos", tienda: "mercado", drones: "drones", insumos: "insumos",
}
export const moduloDeSlug = slug => Object.keys(SLUG_MODULO).find(k => SLUG_MODULO[k] === slug) || null

const PLANOS = {}
const planoDe = (idioma, modulos) => (PLANOS[idioma] ||= plano(Object.fromEntries(modulos.map(m => [m.key, m.etiqueta]))))

// Mouse de escritorio (no táctil): ahí el diagrama y la lista se adelantan al pasar el cursor
function usePunteroFino() {
  const consulta = "(hover: hover) and (pointer: fine)"
  const [fino, setFino] = useState(() => typeof window !== "undefined" && window.matchMedia(consulta).matches)
  useEffect(() => {
    const mq = window.matchMedia(consulta)
    const cambio = () => setFino(mq.matches)
    mq.addEventListener("change", cambio)
    return () => mq.removeEventListener("change", cambio)
  }, [])
  return fino
}

function useCompacto() {
  const consulta = "(max-width: 40rem)"
  const [compacto, setCompacto] = useState(() => typeof window !== "undefined" && window.matchMedia(consulta).matches)
  useEffect(() => {
    const mq = window.matchMedia(consulta)
    const cambio = () => setCompacto(mq.matches)
    mq.addEventListener("change", cambio)
    return () => mq.removeEventListener("change", cambio)
  }, [])
  return compacto
}

// Textos del ecosistema en el idioma activo (los datos están en español en lib/ecosistema.js)
function useTextosEco() {
  const { idioma, t } = useIdioma()
  const tr = TRAD[idioma]
  return {
    t,
    conector: c => tr?.conectores[c.id]?.nombre || c.nombre,
    etiquetaConector: c => tr?.conectores[c.id]?.etiqueta || c.etiqueta,
    que: s => tr?.servicios[s.id] || s.que,
    detalle: f => tr?.filas[`${f.modulo}/${f.conector}/${f.servicio}`] || f.detalle,
    estado: e => t(`eco.estado.${e}`),
  }
}

function Estado({ estado }) {
  const { estado: texto } = useTextosEco()
  return <span className={`eco-estado eco-estado--${estado}`}>{texto(estado)}</span>
}

export default function Ecosistema() {
  const [params, setParams] = useSearchParams()
  const [vista, setVista] = useState(null)
  const [pausado, setPausado] = useState(false)
  const compacto = useCompacto()
  const fino = usePunteroFino()
  const seccion = useRef(null)
  const reloj = useRef(null)
  const { idioma, t } = useIdioma()
  const disponibles = useModulos()
  const proximos = useModulosProximos()
  const modulos = useMemo(() => [...disponibles, ...proximos], [disponibles, proximos])
  const MOD = Object.fromEntries(modulos.map(m => [m.key, m]))
  useEffect(() => () => clearTimeout(reloj.current), [])

  const modulo = moduloDeSlug(params.get("modulo"))
  const servicio = !modulo && servicioPorId(params.get("servicio")) ? params.get("servicio") : null
  const sel = modulo ? { tipo: "modulo", id: modulo } : servicio ? { tipo: "servicio", id: servicio } : null
  // Adelanto: en escritorio, pasar el cursor por un módulo o servicio resalta lo suyo y cambia la lista, con
  // una pequeña demora para no parpadear; al salir vuelve lo elegido. Con teclado, el foco en un botón hace lo
  // mismo. Solo el clic (o Enter) fija la selección y cambia la URL.
  const previsualizar = (x, { puntero = true } = {}) => {
    if (puntero && !fino) return
    clearTimeout(reloj.current)
    reloj.current = setTimeout(() => setVista(x), x ? 140 : 260)
  }
  const mostrado = vista || sel
  const luz = resaltado(mostrado)

  // Si llegan con un filtro en el enlace, se abre el diagrama (solo al cargar: por eso no depende de `sel`)
  const alCargar = useRef(Boolean(sel))
  useEffect(() => {
    if (alCargar.current && seccion.current) seccion.current.scrollIntoView({ block: "start" })
  }, [])

  const filtrar = (clave, valor) => {
    const p = new URLSearchParams(params)
    p.delete("modulo"); p.delete("servicio")
    if (valor) p.set(clave, valor)
    setParams(p, { replace: true, preventScrollReset: true })
    clearTimeout(reloj.current)
    setVista(null)
  }
  const elegirModulo = key => filtrar("modulo", key && key !== modulo ? SLUG_MODULO[key] : null)
  const elegirServicio = id => filtrar("servicio", id && id !== servicio ? id : null)
  const verTodo = () => filtrar(null, null)

  const clase = (activo, extra = "") => `${extra}${luz ? (activo ? " es-activo" : " es-tenue") : ""}`
  const ordenChips = ORDEN_MODULOS.filter(k => MOD[k])

  return (
    <section ref={seccion} className="eco" id="ecosistema" aria-labelledby="eco-titulo">
      <div className="container">
        <div className="eco-cabeza">
          <h2 id="eco-titulo" className="ah-seccion">{t("eco.titulo")}</h2>
          <ul className="eco-cifras">
            <li><b>{disponibles.length}</b>{t("eco.cifra.modulos")}</li>
            <li><b>{RESUMEN.conectores}</b>{t("eco.cifra.conectores")}</li>
            <li><b>{RESUMEN.servicios}</b>{t("eco.cifra.servicios")}</li>
          </ul>
        </div>

        <div className="eco-filtro" role="group" aria-labelledby="eco-filtro-titulo">
          <p id="eco-filtro-titulo" className="eco-filtro__titulo">{t("eco.filtrar")} <span className="eco-filtro__ayuda">{t("eco.bajada")}</span></p>
          <ul className="eco-chips">
            <li>
              <button type="button" className="eco-chip eco-chip--todo" aria-pressed={!sel} onClick={verTodo}>{t("eco.todos")}</button>
            </li>
            {ordenChips.map(key => {
              const { corto, icono: I, proximamente } = MOD[key]
              const n = integracionesDe(key).length
              const x = { tipo: "modulo", id: key }
              return (
                <li key={key}>
                  <button type="button" className={`eco-chip${proximamente ? " eco-chip--proximo" : ""}`} aria-pressed={modulo === key} onClick={() => elegirModulo(key)}
                    onMouseEnter={() => previsualizar(x)} onMouseLeave={() => previsualizar(null)}
                    onFocus={() => previsualizar(x, { puntero: false })} onBlur={() => previsualizar(null, { puntero: false })}>
                    <I size={18} strokeWidth={1.75} aria-hidden="true" />
                    <span>{corto}</span>{" "}
                    {proximamente && <span className="eco-chip__pronto">{t("eco.pronto")}</span>}
                    <span className="eco-chip__n">{n}<span className="visually-hidden"> {t.plural("eco.integraciones", n).replace(/^\d+\s*/, "")}</span></span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="eco-grid">
          <figure className={`eco-mapa${luz ? " hay-luz" : ""}${pausado ? " es-pausado" : ""}`} aria-labelledby="eco-mapa-desc">
            <Diagrama idioma={idioma} modulos={modulos} MOD={MOD} luz={luz} compacto={compacto} clase={clase}
              elegirModulo={elegirModulo} elegirServicio={elegirServicio} setHover={previsualizar} />
            <figcaption id="eco-mapa-desc" className="visually-hidden">
              {t("eco.descripcionDiagrama", { modulos: modulos.length, conectores: RESUMEN.conectores, servicios: RESUMEN.servicios })}
            </figcaption>
            <div className="eco-mapa__pie">
              <ul className="eco-leyenda" aria-label={t("eco.leyenda")}>
                {Object.keys(ESTADOS).map(e => (
                  <li key={e}><span className={`eco-leyenda__punto eco-leyenda__punto--${e}`} aria-hidden="true" /><b>{t(`eco.estado.${e}`)}</b> {t(`eco.estado.${e}.detalle`)}</li>
                ))}
              </ul>
              <button type="button" className="eco-pausa" aria-pressed={pausado} onClick={() => setPausado(p => !p)}>
                {pausado ? <Play size={16} strokeWidth={2} aria-hidden="true" /> : <Pause size={16} strokeWidth={2} aria-hidden="true" />}
                {t("eco.pausar")}
              </button>
            </div>
          </figure>

          <Panel sel={mostrado} MOD={MOD} disponibles={disponibles.length} verTodo={verTodo} elegirModulo={elegirModulo} elegirServicio={elegirServicio} />
        </div>
      </div>
    </section>
  )
}

function Diagrama({ idioma, modulos, MOD, luz, compacto, clase, elegirModulo, elegirServicio, setHover }) {
  const { etiquetaConector } = useTextosEco()
  const PLANO = planoDe(idioma, modulos)
  const { medio, R, baldosa, conector: lado, punto: rp } = GEO
  const r = compacto ? { modulo: 40, servicio: 18 } : { modulo: 0, servicio: rp }
  // En pantallas chicas no hay etiquetas: el lienzo se ajusta al último anillo
  const lienzo = compacto ? R.servicios + r.servicio + 6 : medio
  return (
    <svg className={`eco-svg${compacto ? " es-compacto" : ""}`} viewBox={`${-lienzo} ${-lienzo} ${lienzo * 2} ${lienzo * 2}`} aria-hidden="true" focusable="false">
      <g className="eco-orbitas">
        {[R.modulos, R.conectores, R.servicios].map((radio, i) => (
          <circle key={radio} className={`eco-orbita eco-orbita--${i + 1}`} r={radio} />
        ))}
      </g>

      <g className="eco-lineas">
        {PLANO.rayos.map(l => (
          <path key={l.id} d={l.d} className={clase(luz?.modulos.has(l.modulo), "eco-linea eco-linea--rayo")} />
        ))}
        {PLANO.lineas.map(l => (
          <path key={l.id} d={l.d} className={clase(luz?.lineas.has(l.id), `eco-linea eco-linea--${l.tipo}`)} />
        ))}
      </g>

      <g className="eco-servicios">
        {PLANO.servicios.map(s => {
          const e = etiquetaServicio(s)
          const activo = luz?.servicios.has(s.id)
          return (
            <g key={s.id} data-servicio={s.id} className={clase(activo, `eco-serv eco-serv--${estadoDeServicio(s.id)}`)} onClick={() => elegirServicio(s.id)}
              onMouseEnter={() => setHover({ tipo: "servicio", id: s.id })} onMouseLeave={() => setHover(null)}>
              <circle cx={s.x} cy={s.y} r={r.servicio} />
              {!compacto && <text className="eco-serv__inicial" x={s.x} y={s.y} dy="0.36em">{s.nombre[0]}</text>}
              {!compacto && (
                <text className="eco-serv__nombre" textAnchor={e.ancla} dy="0.34em" transform={`translate(${e.x} ${e.y}) rotate(${e.rot.toFixed(1)})`}>{s.nombre}</text>
              )}
            </g>
          )
        })}
      </g>

      <g className="eco-conectores">
        {PLANO.conectores.map(c => {
          const activo = luz?.conectores.has(c.id)
          const lineas = etiquetaConector(c)
          const ancho = Math.max(...lineas.map(x => x.length)) * GEO.px.conector * 0.6 + 18
          const alto = lineas.length * (GEO.px.conector + 3) + 10
          return (
            <g key={c.id} className={clase(activo, `eco-con eco-con--${estadoDeConector(c.id)}`)}>
              <rect x={c.x - lado} y={c.y - lado} width={lado * 2} height={lado * 2} rx={3} />
              {activo && !compacto && (
                <g className="eco-con__chip">
                  <rect x={c.x - ancho / 2} y={c.y - alto / 2} width={ancho} height={alto} rx={8} />
                  {lineas.map((x, i) => (
                    <text key={x} x={c.x} y={c.y - alto / 2 + 5 + (i + 0.8) * (GEO.px.conector + 3)}>{x}</text>
                  ))}
                </g>
              )}
            </g>
          )
        })}
      </g>

      <g className="eco-modulos">
        {PLANO.modulos.map(m => {
          const { etiqueta, icono: I, proximamente } = MOD[m.key]
          const activo = luz?.modulos.has(m.key)
          return (
            <g key={m.key} data-modulo={m.key} className={clase(activo, `eco-mod${proximamente ? " eco-mod--proximo" : ""}`)} transform={`translate(${m.x} ${m.y})`}
              onClick={() => elegirModulo(m.key)} onMouseEnter={() => setHover({ tipo: "modulo", id: m.key })} onMouseLeave={() => setHover(null)}>
              {compacto ? (
                <>
                  <circle r={r.modulo} />
                  <I x={-24} y={-24} width={48} height={48} strokeWidth={2} aria-hidden="true" />
                </>
              ) : (
                <>
                  <rect className="eco-mod__marco" x={-m.ancho / 2} y={-baldosa.alto / 2} width={m.ancho} height={baldosa.alto} rx={12} />
                  <I x={-10} y={-baldosa.alto / 2 + 8} width={20} height={20} strokeWidth={1.75} aria-hidden="true" />
                  <text y={baldosa.alto / 2 - 9}>{etiqueta}</text>
                </>
              )}
            </g>
          )
        })}
      </g>

      <g className="eco-centro">
        <circle r={R.centro} />
        <HubMark title={null} className="" x={compacto ? -44 : -32} y={compacto ? -46 : -54} width={compacto ? 88 : 64} height={compacto ? 88 : 64} />
        {!compacto && <text y={34}>AgroHubs</text>}
      </g>
    </svg>
  )
}

function Panel({ sel, MOD, disponibles, verTodo, elegirModulo, elegirServicio }) {
  const { t, conector, que, detalle } = useTextosEco()
  let titulo, cuerpo
  if (sel?.tipo === "modulo") {
    const m = MOD[sel.id]
    const filas = integracionesDe(sel.id)
    const grupos = [...new Set(filas.map(f => f.conector))].map(c => ({ c: conectorPorId(c), filas: filas.filter(f => f.conector === c) }))
    titulo = `${m.corto}: ${t.plural("eco.integraciones", filas.length)}`
    cuerpo = (
      <>
        <p className="eco-panel__bajada">{m.descripcion}</p>
        {m.proximamente && <p className="eco-panel__pronto"><span className="eco-estado eco-estado--proximamente">{t("eco.estado.proximamente")}</span> {t("eco.moduloProximo")}</p>}
        {grupos.map(({ c, filas }) => (
          <div key={c.id} className="eco-grupo">
            <p className="eco-grupo__titulo">{t("eco.conector", { nombre: conector(c) })}</p>
            <ul className="eco-lista">
              {filas.map(f => {
                const s = servicioPorId(f.servicio)
                return (
                  <li key={`${f.conector}-${f.servicio}`} className="eco-fila">
                    <span className="eco-fila__nombre">
                      {s ? <button type="button" className="eco-fila__boton" onClick={() => elegirServicio(s.id)}>{s.nombre}</button> : <b>{t("eco.tuEstacion")}</b>}
                      <small>{detalle(f)}</small>
                    </span>
                    <Estado estado={f.estado} />
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
        {m.ruta && <p className="eco-panel__demo"><Enlace className="eco-enlace" to={m.ruta}>{t("eco.verModulo", { modulo: m.corto })}</Enlace></p>}
      </>
    )
  } else if (sel?.tipo === "servicio") {
    const s = servicioPorId(sel.id)
    const filas = integracionesDeServicio(sel.id)
    titulo = `${s.nombre}: ${t.plural("eco.enModulos", modulosDeServicio(sel.id).length)}`
    cuerpo = (
      <>
        {s.que && <p className="eco-panel__bajada">{que(s)}.</p>}
        <ul className="eco-lista">
          {filas.map(f => (
            <li key={`${f.modulo}-${f.conector}`} className="eco-fila">
              <span className="eco-fila__nombre">
                <button type="button" className="eco-fila__boton" onClick={() => elegirModulo(f.modulo)}>{MOD[f.modulo].corto}</button>
                <small>{detalle(f)}. {t("eco.conector", { nombre: conector(conectorPorId(f.conector)) })}.</small>
              </span>
              <Estado estado={f.estado} />
            </li>
          ))}
        </ul>
      </>
    )
  } else {
    const { porEstado } = RESUMEN
    titulo = t("eco.resumen.titulo", { modulos: disponibles, servicios: RESUMEN.servicios })
    cuerpo = (
      <>
        {/* Barra de proporciones: cuántos servicios están conectados, en desarrollo o a pedido. Los nombres quedan
            plegados para no llenar el panel de texto. */}
        <p className="visually-hidden">{t("eco.resumen.bajada", { conectadas: porEstado.conectada, proximas: porEstado.proximamente, pedido: porEstado.pedido })}</p>
        <div className="eco-barra" aria-hidden="true">
          {SERV_POR_ESTADO.map(({ estado, servicios }) => (
            <span key={estado} className={`eco-barra__tramo eco-barra__tramo--${estado}`} style={{ flexGrow: servicios.length }} />
          ))}
        </div>
        <ul className="eco-barra__leyenda" aria-hidden="true">
          {SERV_POR_ESTADO.map(({ estado, servicios }) => (
            <li key={estado}><b>{servicios.length}</b><Estado estado={estado} /></li>
          ))}
        </ul>
        <details className="eco-todos">
          <summary className="eco-enlace">{t("eco.resumen.ver", { n: RESUMEN.servicios })}</summary>
          {SERV_POR_ESTADO.map(({ estado, servicios }) => (
            <div key={estado} className="eco-grupo">
              <p className="eco-grupo__titulo"><Estado estado={estado} /> {servicios.length}</p>
              <ul className="eco-servchips">
                {servicios.map(s => (
                  <li key={s.id}><button type="button" className="eco-servchip" onClick={() => elegirServicio(s.id)}>{s.nombre}</button></li>
                ))}
              </ul>
            </div>
          ))}
        </details>
      </>
    )
  }

  return (
    <div className="eco-panel">
      <div className="eco-panel__cabeza">
        {/* El mismo párrafo en todos los estados: así el lector de pantalla anuncia cada cambio */}
        <p className="eco-panel__titulo" aria-live="polite" aria-atomic="true">{titulo}</p>
        {sel && <button type="button" className="ah-btn ah-btn--quieto ah-btn--chico" onClick={verTodo}>{t("eco.verTodo")}</button>}
      </div>
      {cuerpo}
      <p className="eco-panel__pie">
        {/* Directorio estático (HTML generado en el build): enlace normal, no del router */}
        <a className="eco-enlace" href="/apis">{t("eco.directorio", { n: DESTACADAS.total_directorio })}</a>
      </p>
    </div>
  )
}

