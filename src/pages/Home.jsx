import { Link } from "react-router-dom"
import EjemploPablo from "../components/EjemploPablo"
import VideoExplicativo from "../components/VideoExplicativo"
import ModulosIndice from "../components/ModulosIndice"
import Formas from "../components/Formas"
import Integraciones from "../components/Integraciones"
import AgendarReunion from "../components/AgendarReunion"
import DESTACADAS from "../../data/apis/destacadas.json"
import { CAMPO, FOTOS, Foto } from "../lib/fotos"

// Portada: el huerto con el aviso de helada de Pablo, de dónde sale ese aviso, el video de cómo funciona,
// los 12 módulos, las tres formas de acercar la tecnología, las integraciones y la reunión.
export default function Home() {
  return (
    <>
      <section className="ah-sitio ah-hero" aria-labelledby="hero-titulo">
        <figure className="ah-hero__foto" data-slot="hero" data-alt="Tu campo: hileras de frutales de un predio que usa AgroHubs">
          <Foto foto={CAMPO} prioridad />
        </figure>
        <div className="container ah-hero__grid">
          <div className="ah-hero__cartel">
            <h1 id="hero-titulo" className="ah-display">Todo tu campo en un solo lugar</h1>
            <p className="ah-hero__linea">12 módulos, 1 app y {DESTACADAS.total_directorio} integraciones, con capacitación en terreno.</p>
            <div className="ah-acciones">
              <a className="ah-btn" href="#contacto">Agendar reunión</a>
              <a className="ah-btn ah-btn--claro" href="#video">Ver el video</a>
            </div>
          </div>
          <figure className="ah-aviso" data-slot="aviso" data-kind="product" data-alt="Captura del aviso de helada en la app" aria-label="Ejemplo de aviso en la app">
            <div className="ah-aviso__cabeza"><span>Aviso de helada</span><time>Hoy, 18:40</time></div>
            <p className="ah-aviso__titulo">Pablo, se viene una helada</p>
            <p className="ah-aviso__cifra"><b>−2<span className="ah-unidad">°C</span></b>a las 05:00</p>
            <p className="ah-aviso__sector"><span className="ah-cuadro ah-linea--ambar" aria-hidden="true" />Sector 5, en plena flor. Riesgo alto.</p>
            <a className="ah-aviso__ir" href="#ejemplo">Ver el checklist</a>
          </figure>
        </div>
      </section>

      <EjemploPablo />
      <VideoExplicativo />
      <ModulosIndice />
      <Formas />
      <Integraciones />

      <section className="ah-sitio ah-agenda" id="contacto" aria-labelledby="agenda-titulo">
        <div className="container ah-agenda__grid">
          <div className="ah-agenda__texto">
            <h2 id="agenda-titulo" className="ah-seccion">Conversemos 30 minutos</h2>
            <p className="ah-lead">Sin compromiso. Te escribe una persona del equipo en 24 horas hábiles.</p>
            <ol className="ah-ruta">
              <li><span><b>Agenda</b> una videollamada</span></li>
              <li><span><b>Diagnóstico</b> de lo que tienes y te falta</span></li>
              <li><span><b>Activamos</b> tus módulos</span></li>
            </ol>
            <figure className="ah-agenda__foto" data-slot="agenda" data-alt="Tu predio en temporada: flores de los frutales">
              <Foto foto={FOTOS.flor} sizes="(min-width: 60rem) 35vw, 100vw" />
            </figure>
            <div className="ah-agenda__eval"><p>Si prefieres una propuesta a tu medida, evalúa tu operación en 5 minutos.</p><Link className="ah-btn ah-btn--quieto" to="/evaluacion">Hacer la evaluación</Link></div>
          </div>
          <div className="ah-agenda__form">
            <AgendarReunion origen="portada" />
          </div>
        </div>
      </section>
    </>
  )
}
