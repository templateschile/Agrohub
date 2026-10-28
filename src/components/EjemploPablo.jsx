import { useState } from "react"
import { Sun, Radio, Flower2, Lightbulb } from "lucide-react"

// El ejemplo de Pablo: cuatro módulos aportan un dato cada uno y la app los junta en un solo aviso,
// con el checklist de lo que hay que hacer. Es una muestra hecha con la app; los valores son de ejemplo.
const FUENTES = [
  { modulo: "Clima", color: "ambar", icono: Sun, dato: "Mínima de esta noche", valor: "−2\u00a0°C", nota: "a las 05:00" },
  { modulo: "Sensores", color: "bosque", icono: Radio, dato: "Estación del sector 5", valor: "3\u00a0°C", nota: "y bajando" },
  { modulo: "Fenología", color: "bosque", icono: Flower2, dato: "Cerezos del sector 5", valor: "Plena flor" },
  { modulo: "Avisos", color: "ambar", icono: Lightbulb, dato: "La flor se daña desde −2\u00a0°C", valor: "Riesgo alto", riesgo: true },
]

const TAREAS = [
  "Enciende los ventiladores a 2\u00a0°C",
  "Parte el riego por aspersión a 1\u00a0°C",
  "Revisa los termómetros del sector",
  "Anota en bitácora lo que hiciste",
]

export default function EjemploPablo() {
  const [hechas, setHechas] = useState(() => TAREAS.map(() => false))
  const listas = hechas.filter(Boolean).length
  const marcar = i => () => setHechas(prev => prev.map((v, j) => (j === i ? !v : v)))

  return (
    <section className="ah-sitio ah-ejemplo" id="ejemplo" aria-labelledby="ejemplo-titulo">
      <div className="container">
        <div className="ah-cabeza">
          <h2 id="ejemplo-titulo" className="ah-seccion">Un aviso que junta todo</h2>
          <p className="ah-lead">Lo que le llega a Pablo una noche de helada.</p>
        </div>

        <div className="ah-ejemplo__grid">
          <figure className="ah-tablero ah-ejemplo__tablero">
            <table>
              <caption>De dónde sale el aviso</caption>
              <thead>
                <tr><th scope="col">Módulo</th><th scope="col">Qué mira</th><th scope="col">Hoy</th></tr>
              </thead>
              <tbody>
                {FUENTES.map(({ modulo, color, icono: I, dato, valor, nota, riesgo }) => (
                  <tr key={modulo} className={riesgo ? "es-riesgo" : undefined}>
                    <th scope="row">
                      <span className="ah-tablero__modulo">
                        <span className={`ah-cuadro ah-linea--${color}`} aria-hidden="true" />
                        <I size={20} strokeWidth={2} aria-hidden="true" />{modulo}
                      </span>
                    </th>
                    <td className="ah-tablero__dato">{dato}</td>
                    <td className="ah-tablero__valor">{valor}{nota && <small>{nota}</small>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </figure>

          <div className="ah-ejemplo__telefono">
            <div className="ah-pantalla" data-slot="telefono" data-kind="product" data-alt="Captura del aviso de helada con su checklist en la app">
              <div className="ah-pantalla__barra"><span>AgroHubs</span><span>Sector 5</span></div>
              <div className="ah-pantalla__aviso">
                <b>Pablo, se viene una helada</b>
                <span>El sector 5 está en plena flor y en riesgo.</span>
              </div>
              <fieldset className="ah-checklist">
                <legend>Haz esto antes de las 02:00</legend>
                {TAREAS.map((t, i) => (
                  <div className="ah-check" key={t}>
                    <input type="checkbox" id={`tarea-${i}`} checked={hechas[i]} onChange={marcar(i)} />
                    <label htmlFor={`tarea-${i}`}>{t}</label>
                  </div>
                ))}
              </fieldset>
              <p className="ah-pantalla__pie" aria-live="polite">{listas} de {TAREAS.length} listas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
