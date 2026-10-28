import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Bell, Sparkles, LayoutDashboard, FolderOpen, Store, Wrench } from "lucide-react"
import { MODULOS } from "../lib/modulos"
import { HubMark } from "./HubMark"

// La app al centro y sus 12 módulos alrededor. Elegir un módulo lo muestra dentro de la pantalla.
// La pantalla es la del dashboard de la app (app-mobile/lib/screens/main), construida en HTML
// mientras no haya capturas: va en un data-slot para reemplazarla por una captura real.
const NAV_APP = [
  { icono: LayoutDashboard, label: "Dashboard" },
  { icono: Sparkles, label: "Chat" },
  { icono: FolderOpen, label: "Documentos" },
  { icono: Store, label: "Tienda" },
  { icono: Wrench, label: "Servicios" },
]

export default function AppModulos() {
  const [activo, setActivo] = useState(MODULOS[0].key)
  const pantalla = useRef(null)
  const m = MODULOS.find(x => x.key === activo)
  const Icono = m.icono

  const elegir = key => {
    setActivo(key)
    // En celular la pantalla queda arriba de la lista: se trae a la vista si no se ve
    const el = pantalla.current
    if (el && window.matchMedia("(max-width: 60rem)").matches) {
      const r = el.getBoundingClientRect()
      if (r.bottom < 80 || r.top > window.innerHeight) el.scrollIntoView({ block: "center", behavior: "smooth" })
    }
  }

  const boton = (x, lado) => {
    const I = x.icono
    return (
      <li key={x.key}>
        <button type="button" className={`ah-modulo ah-modulo--${lado}`} aria-pressed={activo === x.key} onClick={() => elegir(x.key)}>
          <I size={18} strokeWidth={1.75} aria-hidden="true" />
          <span>{x.nombre}</span>
        </button>
      </li>
    )
  }

  return (
    <div className="ah-mapa" role="group" aria-label="Diagrama: la app AgroHubs y sus 12 módulos">
      <ul className="ah-mapa__col ah-mapa__col--izq" aria-label="Módulos">{MODULOS.slice(0, 6).map(x => boton(x, "izq"))}</ul>

      <div className="ah-telefono" data-slot="app" data-kind="product" data-alt="Pantalla principal de la app AgroHubs" ref={pantalla}>
        <div className="ah-app" data-keep aria-live="polite">
          <div className="ah-app__barra">
            <span className="ah-app__marca">
              <HubMark className="ah-app__hub" title={null} />
              AgroHubs
            </span>
            <Bell size={16} strokeWidth={1.75} aria-hidden="true" />
          </div>
          <p className="ah-app__pregunta"><Sparkles size={14} strokeWidth={1.75} aria-hidden="true" />Pregúntale a AgroHubs</p>

          <div className="ah-app__detalle">
            <span className="ah-app__icono"><Icono size={20} strokeWidth={1.75} aria-hidden="true" /></span>
            <p className="ah-app__nombre">{m.nombre}</p>
            <p className="ah-app__texto">{m.descripcion}</p>
            {m.ruta && <Link className="ah-app__ver" to={m.ruta}>Ver el módulo</Link>}
          </div>

          <p className="ah-app__seccion">Tus módulos</p>
          <ul className="ah-app__grilla" aria-hidden="true">
            {MODULOS.map(x => {
              const I = x.icono
              return <li key={x.key} className={x.key === activo ? "es-activo" : undefined}><I size={16} strokeWidth={1.75} /></li>
            })}
          </ul>

          <ul className="ah-app__nav" aria-hidden="true">
            {NAV_APP.map(({ icono: I, label }, i) => (
              <li key={label} className={i === 0 ? "es-activo" : undefined}><I size={16} strokeWidth={1.75} /><span>{label}</span></li>
            ))}
          </ul>
        </div>
      </div>

      <ul className="ah-mapa__col ah-mapa__col--der" aria-label="Más módulos">{MODULOS.slice(6).map(x => boton(x, "der"))}</ul>
    </div>
  )
}
