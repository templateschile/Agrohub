import { Link } from "react-router-dom"
import { LayoutGrid, Smartphone, Plug, ShieldCheck, Clock, UserRound } from "lucide-react"
import AppModulos from "../components/AppModulos"
import ModulosGrid from "../components/ModulosGrid"
import EnTerreno from "../components/EnTerreno"
import Integraciones from "../components/Integraciones"
import ComoFunciona from "../components/ComoFunciona"
import AgendarReunion from "../components/AgendarReunion"
import DESTACADAS from "../../data/apis/destacadas.json"
import { CAMPO, FOTOS, Foto } from "../lib/fotos"

// Portada de lectura rápida: la app y sus módulos sobre el huerto, los módulos con íconos,
// fotos en terreno, integraciones, cómo partimos, agendar la reunión y la evaluación.
export default function Home() {
  const cifras = [
    { icono: LayoutGrid, valor: "12", texto: "módulos" },
    { icono: Smartphone, valor: "1", texto: "app" },
    { icono: Plug, valor: String(DESTACADAS.total_directorio), texto: "integraciones" },
  ]
  return (
    <>
      <section className="ah-hero" id="modulos" aria-labelledby="hero-titulo">
        <Foto foto={CAMPO} prioridad className="ah-hero__fondo" />
        <div className="container ah-hero__grid">
          <div className="ah-hero__texto">
            <h1 id="hero-titulo" className="ah-display">Todo tu campo en una app</h1>
            <ul className="ah-cifras">
              {cifras.map(({ icono: I, valor, texto }) => (
                <li key={texto}><I size={22} strokeWidth={1.75} aria-hidden="true" /><b>{valor}</b>{texto}</li>
              ))}
            </ul>
            <div className="ah-acciones">
              <a className="ah-btn ah-btn--menta" href="#contacto">Agendar reunión</a>
              <Link className="ah-btn ah-btn--claro" to="/evaluacion">Evaluar mi operación</Link>
            </div>
          </div>
          <AppModulos />
        </div>
      </section>

      <ModulosGrid />
      <EnTerreno />
      <Integraciones />
      <ComoFunciona />

      <section className="ah-agenda" id="contacto" aria-labelledby="agenda-titulo">
        <div className="container ah-agenda__grid">
          <div className="ah-agenda__texto">
            <h2 id="agenda-titulo" className="ah-seccion">Conversemos 30 minutos</h2>
            <ul className="ah-hechos">
              <li><span className="ah-hechos__icono"><ShieldCheck size={22} strokeWidth={1.75} aria-hidden="true" /></span><b>Sin compromiso</b></li>
              <li><span className="ah-hechos__icono"><UserRound size={22} strokeWidth={1.75} aria-hidden="true" /></span><b>Te escribe una persona del equipo</b></li>
              <li><span className="ah-hechos__icono"><Clock size={22} strokeWidth={1.75} aria-hidden="true" /></span><b>Respuesta en 24 horas hábiles</b></li>
            </ul>
          </div>
          <AgendarReunion origen="portada" />
        </div>
      </section>

      <section className="ah-banda" aria-labelledby="banda-titulo">
        <Foto foto={FOTOS.vina} className="ah-banda__fondo" />
        <div className="container ah-banda__grid">
          <h2 id="banda-titulo" className="ah-banda__frase">¿Quieres una propuesta a tu medida? Evalúa tu operación en 5 minutos.</h2>
          <Link className="ah-btn ah-btn--menta" to="/evaluacion">Hacer la evaluación</Link>
        </div>
      </section>
    </>
  )
}
