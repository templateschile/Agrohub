import { CloudRain, Flower2, NotebookPen, Store, PlaneTakeoff, CalendarDays } from "lucide-react"
import { FOTOS, Foto } from "../lib/fotos"

// Mosaico de fotos: cada una con el módulo que la acompaña en terreno.
const TEJAS = [
  { foto: FOTOS.clima, icono: CloudRain, titulo: "Clima y avisos", texto: "Helada, lluvia o calor: te avisa a tiempo", color: "ambar", clase: "es-grande" },
  { foto: FOTOS.huerto, icono: Flower2, titulo: "Fenología", texto: "Cada fase del cultivo con su manejo", color: "bosque", clase: "es-alta" },
  { foto: FOTOS.cosecha, icono: NotebookPen, titulo: "Bitácora", texto: "Labores y cosecha desde el celular", color: "tierra" },
  { foto: FOTOS.mercado, icono: Store, titulo: "Mercado de cosecha", texto: "Vende tu fruta en la red", color: "bosque" },
  { foto: FOTOS.drones, icono: PlaneTakeoff, titulo: "Drones", texto: "NDVI, mapeo y aplicación", color: "cielo", clase: "es-ancha" },
  { foto: FOTOS.terreno, icono: CalendarDays, titulo: "Capacitaciones", texto: "Días de campo con tu equipo", color: "tierra", clase: "es-ancha" },
]

export default function EnTerreno() {
  return (
    <section className="ah-terreno" aria-labelledby="terreno-titulo">
      <div className="container">
        <h2 id="terreno-titulo" className="ah-seccion">Hecha para el campo</h2>
        <ul className="ah-terreno__grid">
          {TEJAS.map(t => {
            const I = t.icono
            return (
              <li key={t.titulo} className={`ah-teja ${t.clase || ""}`}>
                <figure className={`ah-teja__foto ah-color--${t.color}`}>
                  <I className="ah-teja__respaldo" size={64} strokeWidth={1.25} aria-hidden="true" />
                  <Foto foto={t.foto} sizes="(min-width: 60rem) 33vw, 100vw" />
                  <figcaption className="ah-teja__texto">
                    <span className={`ah-teja__icono ah-color--${t.color}`}><I size={20} strokeWidth={1.75} aria-hidden="true" /></span>
                    <b>{t.titulo}</b>
                    <span>{t.texto}</span>
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
