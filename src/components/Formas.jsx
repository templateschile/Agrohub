import { LayoutGrid, Plug } from "lucide-react"
import { FOTOS, Foto } from "../lib/fotos"

// Las tres formas en que AgroHubs acerca la tecnología: la capacitación en terreno con su foto, grande,
// y al lado los módulos y la tecnología a medida como filas.
export default function Formas() {
  return (
    <section className="ah-sitio ah-formas" id="formas" aria-labelledby="formas-titulo">
      <div className="container">
        <div className="ah-cabeza">
          <h2 id="formas-titulo" className="ah-seccion">Días de campo, módulos y lo que falte</h2>
        </div>
        <div className="ah-formas__grid">
          <article className="ah-forma ah-forma--foto">
            <figure className="ah-forma__visual" data-slot="capacitacion" data-alt="Una capacitación o un día de campo de AgroHubs con productores">
              <Foto foto={FOTOS.terreno} sizes="(min-width: 60rem) 55vw, 100vw" />
            </figure>
            <div className="ah-forma__texto">
              <h3>Capacitación en terreno</h3>
              <p>Días de campo y cursos para que tu equipo use cada módulo.</p>
            </div>
          </article>
          <ul className="ah-formas__filas">
            <li>
              <LayoutGrid size={32} strokeWidth={1.75} aria-hidden="true" />
              <h3>Módulos listos para usar</h3>
              <p>Activamos los tuyos con tus sensores y sistemas conectados.</p>
            </li>
            <li>
              <Plug size={32} strokeWidth={1.75} aria-hidden="true" />
              <h3>Tecnología a medida</h3>
              <p>Conectamos lo que ya usas o desarrollamos lo que falte.</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
