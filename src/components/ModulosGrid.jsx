import { Link } from "react-router-dom"
import { MODULOS } from "../lib/modulos"

// Los 12 módulos de un vistazo: ícono grande, nombre y una línea.
export default function ModulosGrid() {
  return (
    <section className="ah-mods" aria-labelledby="mods-titulo">
      <div className="container">
        <h2 id="mods-titulo" className="ah-seccion">Lo que hace la app</h2>
        <ul className="ah-mods__grid">
          {MODULOS.map(m => {
            const I = m.icono
            const cuerpo = (
              <>
                <span className={`ah-mods__icono ah-color--${m.color}`}><I size={28} strokeWidth={1.75} aria-hidden="true" /></span>
                <span className="ah-mods__nombre">{m.nombre}</span>
                <span className="ah-mods__linea">{m.linea}</span>
              </>
            )
            return (
              <li key={m.key}>
                {m.ruta ? <Link to={m.ruta} className="ah-mods__item es-enlace">{cuerpo}</Link> : <div className="ah-mods__item">{cuerpo}</div>}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
