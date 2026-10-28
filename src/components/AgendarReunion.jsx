import { useMemo, useState } from "react"
import { enviarLead, emailValido, CORREO_CONTACTO } from "../lib/lead"
import { HORAS, primerDia, sumarHabiles, esHabil, diaParaMostrar, reunionDatos, reunionTexto } from "../lib/reunion"
import { useIdioma, Enlace } from "../i18n"

// Formulario corto para agendar una reunión: horario, nombre y email (teléfono opcional).
// Lo usan la portada (#contacto) y la Evaluación ("solo quiero una reunión").
export default function AgendarReunion({ origen = "portada", compacto = false }) {
  const { t, idioma, locale } = useIdioma()
  const diaLargo = s => diaParaMostrar(s, locale)
  const diaCorto = s => diaParaMostrar(s, locale, true)
  const dia = useMemo(primerDia, [])
  const [horario, setHorario] = useState(`${dia} ${HORAS[0]}`)
  const [otroDia, setOtroDia] = useState(() => sumarHabiles(dia, 1))
  const [otraHora, setOtraHora] = useState(HORAS[0])
  const [f, setF] = useState({ nombre: "", email: "", telefono: "", website: "" })
  const [tocado, setTocado] = useState({})
  const [estado, setEstado] = useState("editando")
  const [enviada, setEnviada] = useState(null)

  const set = k => e => setF(prev => ({ ...prev, [k]: e.target.value }))
  const tocar = k => () => setTocado(prev => ({ ...prev, [k]: true }))
  const id = k => `reunion-${origen}-${k}`

  const elegida = horario === "otro" ? { fecha: otroDia, hora: otraHora } : { fecha: horario.split(" ")[0], hora: horario.split(" ")[1] }
  const errores = {
    nombre: !f.nombre.trim() && t("reunion.err.nombre"),
    email: !emailValido(f.email) && t("reunion.err.email"),
    fecha: horario === "otro" && (!otroDia || otroDia < dia || !esHabil(otroDia)) && t("reunion.err.fecha", { dia: diaLargo(dia) }),
  }
  const error = k => (tocado[k] || estado === "revisar") && errores[k]

  const enviar = async e => {
    e.preventDefault()
    if (errores.nombre || errores.email || errores.fecha) {
      setEstado("revisar")
      const primero = ["nombre", "email", "fecha"].find(k => errores[k])
      document.getElementById(id(primero === "fecha" ? "otro-dia" : primero))?.focus()
      return
    }
    setEstado("enviando")
    const linea = reunionTexto(elegida)
    const resumen = [`Origen: agendar reunión (${origen === "evaluacion" ? "página de Evaluación" : "portada"})`, linea, `Idioma del sitio: ${idioma}`]
    const ok = await enviarLead({
      tipo: "contacto",
      contacto: { nombre: f.nombre.trim(), email: f.email.trim(), telefono: f.telefono.trim() },
      mensaje: `Quiere agendar una reunión.\n${linea}`,
      resumen,
      respuestas: { origen: `reunion-${origen}`, reunion: reunionDatos(elegida, horario !== "otro") },
      website: f.website,
      idioma,
    })
    if (ok) { setEnviada(elegida); setEstado("enviado") } else setEstado("error")
  }

  if (estado === "enviado") {
    return (
      <div className={`ah-reunion ah-reunion--listo${compacto ? " ah-reunion--compacto" : ""}`} role="status">
        <h3 className="ah-reunion__titulo">{t("reunion.listo.titulo", { nombre: f.nombre.trim().split(" ")[0] })}</h3>
        <p>{t("reunion.listo.texto", { dia: diaLargo(enviada.fecha), hora: enviada.hora, email: f.email.trim() })}</p>
      </div>
    )
  }

  return (
    <form className={`ah-reunion${compacto ? " ah-reunion--compacto" : ""}`} onSubmit={enviar} noValidate>
      <fieldset className="ah-horas">
        <legend className="ah-label">{t("reunion.legend")}</legend>
        <div className="ah-horas__opciones">
          {HORAS.map(h => {
            const v = `${dia} ${h}`
            return (
              <span key={v} className="ah-hora">
                <input type="radio" name={`horario-${origen}`} id={id(h)} value={v} checked={horario === v} onChange={() => setHorario(v)} />
                <label htmlFor={id(h)}><b>{compacto ? diaCorto(dia) : diaLargo(dia)}</b>{t("reunion.hora", { hora: h })}</label>
              </span>
            )
          })}
          <span className="ah-hora">
            <input type="radio" name={`horario-${origen}`} id={id("otro")} value="otro" checked={horario === "otro"} onChange={() => setHorario("otro")} />
            <label htmlFor={id("otro")}><b>{t("reunion.otroDia")}</b>{t("reunion.tuEliges")}</label>
          </span>
        </div>
        {horario === "otro" && (
          <div className="ah-horas__otro">
            <div className="ah-campo">
              <label className="ah-label" htmlFor={id("otro-dia")}>{t("reunion.dia")}</label>
              <input className="ah-input" type="date" id={id("otro-dia")} min={dia} value={otroDia}
                onChange={e => setOtroDia(e.target.value)} onBlur={tocar("fecha")}
                aria-invalid={error("fecha") ? "true" : undefined} aria-describedby={id("fecha-ayuda")} />
            </div>
            <div className="ah-campo">
              <label className="ah-label" htmlFor={id("otra-hora")}>{t("reunion.horaLabel")}</label>
              <select className="ah-input" id={id("otra-hora")} value={otraHora} onChange={e => setOtraHora(e.target.value)}>
                {HORAS.map(h => <option key={h}>{h}</option>)}
              </select>
            </div>
            <p className="ah-ayuda" id={id("fecha-ayuda")}>{error("fecha") || t("reunion.ayudaFecha")}</p>
          </div>
        )}
      </fieldset>

      <div className="ah-campos">
        <div className="ah-campo">
          <label className="ah-label" htmlFor={id("nombre")}>{t("reunion.nombre")}</label>
          <input className="ah-input" id={id("nombre")} autoComplete="name" value={f.nombre} onChange={set("nombre")} onBlur={tocar("nombre")}
            aria-required="true" aria-invalid={error("nombre") ? "true" : undefined} aria-describedby={id("nombre-ayuda")} />
          <p className="ah-ayuda" id={id("nombre-ayuda")}>{error("nombre")}</p>
        </div>
        <div className="ah-campo">
          <label className="ah-label" htmlFor={id("email")}>{t("reunion.email")}</label>
          <input className="ah-input" type="email" id={id("email")} autoComplete="email" inputMode="email" value={f.email} onChange={set("email")} onBlur={tocar("email")}
            aria-required="true" aria-invalid={error("email") ? "true" : undefined} aria-describedby={id("email-ayuda")} />
          <p className="ah-ayuda" id={id("email-ayuda")}>{error("email")}</p>
        </div>
        {!compacto && (
          <div className="ah-campo">
            <label className="ah-label" htmlFor={id("telefono")}>{t("reunion.telefono")}</label>
            <input className="ah-input" type="tel" id={id("telefono")} autoComplete="tel" placeholder={t("reunion.telefonoEjemplo")} value={f.telefono} onChange={set("telefono")} />
          </div>
        )}
      </div>
      <input className="ah-trampa" value={f.website} onChange={set("website")} tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" />

      <div className="ah-reunion__pie">
        <button className="ah-btn" type="submit" disabled={estado === "enviando"} aria-busy={estado === "enviando" ? "true" : undefined}>
          {estado === "enviando" ? t("reunion.enviando") : t("reunion.enviar")}
        </button>
        <p className="ah-ayuda" aria-live="polite">
          {estado === "error" ? t("reunion.error", { correo: CORREO_CONTACTO }) : <>{t("reunion.privacidad")} <Enlace to="/terminos">{t("reunion.terminos")}</Enlace></>}
        </p>
      </div>
    </form>
  )
}
