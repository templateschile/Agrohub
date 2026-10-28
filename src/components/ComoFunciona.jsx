import { CalendarCheck, ClipboardCheck, Rocket } from "lucide-react"

// Los tres pasos reales con el equipo (los mismos que promete la Evaluación).
const PASOS = [
  { icono: CalendarCheck, titulo: "Agenda 30 minutos", texto: "Una videollamada para conocer tu predio" },
  { icono: ClipboardCheck, titulo: "Diagnóstico", texto: "Vemos qué tienes y qué te falta" },
  { icono: Rocket, titulo: "Activamos tus módulos", texto: "Con tus sensores y sistemas conectados" },
]

export default function ComoFunciona() {
  return (
    <section className="ah-pasos" aria-labelledby="pasos-titulo">
      <div className="container">
        <h2 id="pasos-titulo" className="ah-seccion">Así partimos</h2>
        <ol className="ah-pasos__lista">
          {PASOS.map(({ icono: I, titulo, texto }) => (
            <li key={titulo}>
              <span className="ah-pasos__icono"><I size={32} strokeWidth={1.75} aria-hidden="true" /></span>
              <b>{titulo}</b>
              <span>{texto}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
