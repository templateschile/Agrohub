import { Link } from "react-router-dom"
import { MODULOS } from "../lib/modulos"

// Los 12 módulos como un índice de líneas: cada uno con su color de línea, su ícono, su nombre y una
// frase corta; los que tienen página de demostración llevan su enlace.
export default function ModulosIndice() {
  return (
    <section className="ah-sitio ah-modulos" id="modulos" aria-labelledby="modulos-titulo">
      <div className="container">
        <div className="ah-cabeza">
          <h2 id="modulos-titulo" className="ah-seccion">12 módulos, una sola app</h2>
          <p className="ah-lead">Elige los que tu predio necesita.</p>
        </div>
        <ul className="ah-indice">
          {MODULOS.map(({ key, nombre, corto, breve, icono: I, color, ruta }) => (
            <li key={key}>
              <span className={`ah-cuadro ah-linea--${color}`} aria-hidden="true" />
              <I size={24} strokeWidth={1.75} aria-hidden="true" />
              <span className="ah-indice__nombre"><b>{nombre}</b><span>{breve}</span></span>
              {ruta ? <Link className="ah-enlace ah-indice__ir" to={ruta} aria-label={`Ver la demostración de ${corto}`}>Ver demo</Link> : <span aria-hidden="true" />}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
