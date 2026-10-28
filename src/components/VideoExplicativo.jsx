import { useEffect, useRef, useState } from "react"
import { Play, Pause, RotateCcw } from "lucide-react"
import { MODULOS } from "../lib/modulos"
import { FOTOS, Foto } from "../lib/fotos"

// Video explicativo hecho con la app misma (HTML, no un archivo): qué hace AgroHubs, cada módulo, el aviso de
// helada de Pablo, la capacitación y la tecnología a medida. Parte solo cuando lo piden, se pausa al salir de
// la pantalla y cada capítulo se puede abrir directo. El subtítulo dice lo que muestra cada escena.
const POR_MODULO = 1.5

const ESCENAS = [
  { id: "disperso", capitulo: "Disperso", dur: 8, sub: "Hoy cada dato vive en otro lado: el WhatsApp del asesor, la planilla, la estación, el cuaderno." },
  { id: "junto", capitulo: "Un solo lugar", dur: 7, sub: "AgroHubs lo junta en un solo lugar: tu predio, tus datos y tus avisos." },
  { id: "modulos", capitulo: "12 módulos", dur: MODULOS.length * POR_MODULO },
  { id: "helada", capitulo: "La helada", dur: 11, sub: "Pablo, se viene una helada. El sector 5 está en plena flor y en riesgo. Enciende los ventiladores, parte el riego y aquí tienes el checklist." },
  { id: "capacitacion", capitulo: "Capacitación", dur: 7, sub: "Te enseñamos a usarla en tu campo: días de campo, capacitación para tu equipo y acompañamiento." },
  { id: "medida", capitulo: "A tu medida", dur: 8, sub: "Y si algo falta, conectamos tus sistemas o lo desarrollamos a tu medida." },
]
let acumulado = 0
for (const e of ESCENAS) { e.inicio = acumulado; acumulado += e.dur }
const TOTAL = acumulado

const SUELTOS = [
  { texto: "WhatsApp del asesor", x: "3cqw", y: "34cqh" },
  { texto: "Planilla de riego", x: "38cqw", y: "26cqh" },
  { texto: "Estación del predio", x: "66cqw", y: "40cqh" },
  { texto: "Cuaderno de campo", x: "8cqw", y: "62cqh" },
  { texto: "Pronóstico en el celular", x: "40cqw", y: "56cqh" },
  { texto: "Correo con precios", x: "62cqw", y: "76cqh" },
]

const TAREAS = ["Enciende los ventiladores a 2\u00a0°C", "Parte el riego por aspersión a 1\u00a0°C", "Revisa los termómetros del sector", "Anota en bitácora lo que hiciste"]

const FILAS = {
  capacitacion: [
    { titulo: "Días de campo", texto: "En tu hub, con tu cultivo" },
    { titulo: "Capacitación", texto: "Para tu equipo, módulo por módulo" },
    { titulo: "Acompañamiento", texto: "Mientras activamos tus módulos" },
  ],
  medida: [
    { titulo: "Tus sensores", texto: "Las marcas que ya usas" },
    { titulo: "89 integraciones", texto: "Chile primero, después Latinoamérica" },
    { titulo: "Desarrollo a medida", texto: "Lo que tu operación necesite" },
  ],
}

const reloj = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`

export default function VideoExplicativo() {
  const [t, setT] = useState(0)
  const [reproduciendo, setReproduciendo] = useState(false)
  const [empezado, setEmpezado] = useState(false)
  const caja = useRef(null)

  // Avanza el tiempo diez veces por segundo mientras se reproduce
  useEffect(() => {
    if (!reproduciendo) return
    let antes = performance.now()
    const id = setInterval(() => {
      const ahora = performance.now()
      const paso = (ahora - antes) / 1000
      antes = ahora
      setT(prev => {
        const sig = prev + paso
        if (sig >= TOTAL) { setReproduciendo(false); return TOTAL }
        return sig
      })
    }, 100)
    return () => clearInterval(id)
  }, [reproduciendo])

  // Se pausa cuando sale de la pantalla
  useEffect(() => {
    const el = caja.current
    if (!el || !("IntersectionObserver" in window)) return
    const io = new IntersectionObserver(([e]) => { if (!e.isIntersecting) setReproduciendo(false) }, { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const n = Math.max(0, ESCENAS.findIndex(e => t < e.inicio + e.dur))
  // Antes de partir, la portada del video es la grilla de los 12 módulos
  const escena = !empezado ? ESCENAS[2] : t >= TOTAL ? ESCENAS[ESCENAS.length - 1] : ESCENAS[n]
  const local = empezado ? t - escena.inicio : 0
  const modulo = Math.min(MODULOS.length - 1, Math.floor((escena.id === "modulos" ? local : 0) / POR_MODULO))
  const subtitulo = escena.id === "modulos" ? `${MODULOS[modulo].nombre}: ${MODULOS[modulo].linea.toLowerCase()}.` : escena.sub
  const terminado = t >= TOTAL

  const reproducir = () => {
    if (terminado) setT(0)
    setEmpezado(true)
    setReproduciendo(true)
  }
  const irA = e => () => { setT(e.inicio + 0.01); setEmpezado(true); setReproduciendo(true) }
  const activa = id => (escena.id === id ? " es-activa" : "")

  const enSueltos = escena.id === "disperso" || escena.id === "junto"
  const juntos = escena.id === "junto"
  // Antes de partir se ven todos; al reproducir aparecen de a uno por segundo
  const vistos = escena.id === "disperso" ? Math.floor(local) : SUELTOS.length

  return (
    <section className="ah-sitio ah-video" id="video" aria-labelledby="video-titulo">
      <div className="container">
        <div className="ah-cabeza">
          <h2 id="video-titulo" className="ah-seccion">Un minuto con AgroHubs</h2>
          <p className="ah-lead">Cada módulo, un día con helada y cómo te acompañamos.</p>
        </div>

        <figure className="ah-player" ref={caja} aria-label="Video: cómo funciona AgroHubs">
          <div className="ah-player__pantalla">
            <div className={`ah-escena ah-sueltos${enSueltos ? " es-activa" : ""}${juntos ? " es-juntos" : ""}`} aria-hidden={!enSueltos}>
              <p className="ah-escena__titulo ah-sueltos__titulo">{juntos ? "Todo en un solo lugar" : "Hoy, cada dato está en otro lado"}</p>
              <div className="ah-sueltos__app" aria-hidden="true"><b>AgroHubs</b><span className="ah-escena__chico">Tu predio</span></div>
              <ul style={{ containerType: "size" }}>
                {SUELTOS.map((s, i) => (
                  <li key={s.texto} className={i < vistos ? undefined : "es-oculto"}
                    style={{ "--x": s.x, "--y": s.y, "--jx": "61cqw", "--jy": `${26 + i * 10}cqh` }}>{s.texto}</li>
                ))}
              </ul>
            </div>

            <div className={`ah-escena ah-escena--modulos${activa("modulos")}`} aria-hidden={escena.id !== "modulos"}>
              <ul className="ah-tablas">
                {MODULOS.map(({ key, corto, icono: I, color }, i) => (
                  <li key={key} className={i === modulo ? "es-actual" : undefined}>
                    <span className={`ah-cuadro ah-linea--${color}`} aria-hidden="true" />
                    <I size={24} strokeWidth={1.75} aria-hidden="true" /><span className="ah-tablas__nombre">{corto}</span>
                  </li>
                ))}
              </ul>
              <div className="ah-modulo-grande">
                <p className="ah-modulo-grande__cuenta">{modulo + 1}<span className="ah-escena__chico"> de {MODULOS.length}</span></p>
                <p className="ah-modulo-grande__nombre"><span className={`ah-cuadro ah-linea--${MODULOS[modulo].color}`} aria-hidden="true" />{MODULOS[modulo].corto}</p>
                <p>{MODULOS[modulo].breve}</p>
              </div>
            </div>

            <div className={`ah-escena ah-escena--helada${activa("helada")}`} aria-hidden={escena.id !== "helada"}>
              <figure className="ah-escena__foto" data-slot="video-helada" data-alt="Una helada en tu campo: escarcha sobre las plantas al amanecer">
                <Foto foto={FOTOS.helada} sizes="(min-width: 60rem) 40vw, 100vw" />
              </figure>
              <div className="ah-helada">
                <p className="ah-escena__titulo">Pablo, se viene una helada</p>
                <p className="ah-helada__cifra">−2<span className="ah-unidad">°C</span></p>
                <p className="ah-escena__chico">A las 05:00. Sector 5, en plena flor.</p>
                <ol>
                  {TAREAS.map((x, i) => <li key={x} className={escena.id === "helada" && local > 3 + i * 1.8 ? "es-hecho" : undefined}>{x}</li>)}
                </ol>
              </div>
            </div>

            {["capacitacion", "medida"].map(id => (
              <div key={id} className={`ah-escena ah-escena--filas${activa(id)}`} aria-hidden={escena.id !== id}>
                <div className="ah-escena__arriba">
                  <p className="ah-escena__titulo">{id === "capacitacion" ? "Te enseñamos a usarla en tu campo" : "Y lo que falte, a tu medida"}</p>
                  {id === "capacitacion" ? (
                    <figure className="ah-escena__foto" data-slot="video-capacitacion" data-alt="Un día de campo o una capacitación de AgroHubs">
                      <Foto foto={FOTOS.terreno} sizes="(min-width: 60rem) 30vw, 100vw" />
                    </figure>
                  ) : (
                    <div className="ah-conexion" role="img" aria-label="Diagrama: tus sensores, tus planillas y tus sistemas se conectan a AgroHubs">
                      <ul>{["Tus sensores", "Tus planillas", "Tus sistemas"].map(x => <li key={x}>{x}</li>)}</ul>
                      <span className="ah-conexion__centro">AgroHubs</span>
                    </div>
                  )}
                </div>
                <ul className="ah-filas">
                  {FILAS[id].map((f, i) => (
                    <li key={f.titulo} className={escena.id === id && local > 0.6 + i * 1.2 ? "es-visible" : undefined}><b>{f.titulo}</b><span>{f.texto}</span></li>
                  ))}
                </ul>
                {id === "medida" && (
                  <div className="ah-escena__cierre">
                    <a className="ah-btn" href="#contacto" tabIndex={escena.id === "medida" ? 0 : -1}>Agendar reunión</a>
                  </div>
                )}
              </div>
            ))}

          </div>

          <p className="ah-player__subtitulo" aria-live={reproduciendo ? "off" : "polite"}>{empezado ? subtitulo : "Qué hace AgroHubs, cada módulo y un ejemplo de un día con helada."}</p>

          <div className="ah-player__controles">
            <button type="button" className={`ah-player__boton${empezado ? "" : " es-inicio"}`} onClick={reproduciendo ? () => setReproduciendo(false) : reproducir}>
              {reproduciendo ? <Pause size={18} strokeWidth={2} aria-hidden="true" /> : terminado ? <RotateCcw size={18} strokeWidth={2} aria-hidden="true" /> : <Play size={18} strokeWidth={2} aria-hidden="true" />}
              {reproduciendo ? "Pausar" : terminado ? "Ver de nuevo" : empezado ? "Reproducir" : `Ver el video (${reloj(TOTAL)})`}
            </button>
            <label className="ah-player__barra">
              <span className="visually-hidden">Avance del video</span>
              <input type="range" min="0" max={TOTAL} step="0.1" value={t}
                onChange={e => { setT(Number(e.target.value)); setEmpezado(true) }}
                aria-valuetext={`${reloj(t)} de ${reloj(TOTAL)}, ${escena.capitulo}`} />
            </label>
            <span className="ah-player__tiempo">{reloj(t)} / {reloj(TOTAL)}</span>
          </div>
        </figure>

        <ol className="ah-capitulos" aria-label="Capítulos del video">
          {ESCENAS.map((e, i) => (
            <li key={e.id}>
              <button type="button" onClick={irA(e)} aria-current={escena.id === e.id && empezado ? "true" : undefined}>
                <span>{reloj(e.inicio)}</span><b>{i + 1}. {e.capitulo}</b>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
