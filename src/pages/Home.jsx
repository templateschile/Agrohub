import { Link } from "react-router-dom"
import AppModulos from "../components/AppModulos"
import AgendarReunion from "../components/AgendarReunion"

// Portada en tres pasos: la app con sus módulos, agendar la reunión y, si se quiere, la evaluación.
export default function Home() {
  return (
    <>
      <section className="ah-hero" id="modulos" aria-labelledby="hero-titulo">
        <div className="container ah-hero__grid">
          <div className="ah-hero__texto">
            <h1 id="hero-titulo" className="ah-display">Doce módulos, una sola app</h1>
            <p className="ah-lead">Activa los que necesita tu predio; toca uno para verlo.</p>
            <div className="ah-acciones">
              <a className="ah-btn" href="#contacto">Agendar reunión</a>
              <Link className="ah-btn ah-btn--quieto" to="/evaluacion">Evaluar mi operación</Link>
            </div>
          </div>
          <AppModulos />
        </div>
      </section>

      <section className="ah-agenda" id="contacto" aria-labelledby="agenda-titulo">
        <div className="container ah-agenda__grid">
          <div className="ah-agenda__texto">
            <h2 id="agenda-titulo" className="ah-seccion">Conversemos 30 minutos</h2>
            <p className="ah-lead">Elige un horario y te confirmamos por correo.</p>
            <ul className="ah-hechos">
              <li><b>Sin compromiso</b>Primero entendemos tu operación; después proponemos.</li>
              <li><b>Te escribe una persona</b>Del equipo AgroHubs, en menos de 24 horas hábiles.</li>
            </ul>
          </div>
          <AgendarReunion origen="portada" />
        </div>
      </section>

      <section className="ah-banda" aria-labelledby="banda-titulo">
        <div className="container ah-banda__grid">
          <h2 id="banda-titulo" className="ah-banda__frase">¿Prefieres llegar a la reunión con una propuesta? Cuéntanos tu operación en 5 minutos.</h2>
          <Link className="ah-btn ah-btn--claro" to="/evaluacion">Hacer la evaluación</Link>
        </div>
      </section>
    </>
  )
}
