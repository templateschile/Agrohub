import { useEffect, useId, useRef, useState } from "react"
import { X, Send, CircleCheckBig } from "lucide-react"
import { enviarLead, emailValido, CORREO_CONTACTO } from "../lib/lead"
import { enfocables, focoAtrapado } from "../lib/foco"
import { Enlace, useIdioma } from "../i18n"

// Diálogo de contacto: nombre y email obligatorios; empresa, teléfono y mensaje opcionales.
// Va al API de la plataforma (lib/lead.js) como tipo "contacto". `resumen` y `origen` le dicen al equipo
// desde dónde escribieron; los textos que llegan al equipo van en español y `respuestas.idioma` dice en
// qué idioma estaba el sitio. Sin `titulo` ni `subtitulo` usa los textos generales (contacto.*).
export default function ContactModal({ onClose, titulo, subtitulo, resumen = [], origen = "contacto" }) {
  const { t, idioma } = useIdioma()
  const [f, setF] = useState({ nombre: "", empresa: "", email: "", telefono: "", mensaje: "", website: "" })
  const [tocado, setTocado] = useState({})
  const [estado, setEstado] = useState("editando") // editando | revisar | enviando | enviado | error

  const set = k => e => setF(prev => ({ ...prev, [k]: e.target.value }))
  const tocar = k => () => setTocado(prev => ({ ...prev, [k]: true }))
  const base = useId()
  const id = k => `${base}-${k}`
  const tituloId = id("titulo")

  const errores = {
    nombre: !f.nombre.trim() && t("contacto.errorNombre"),
    email: !emailValido(f.email) && t("contacto.errorEmail"),
  }
  const error = k => (tocado[k] || estado === "revisar") && errores[k]

  // Diálogo accesible: foco en el primer campo al abrir, Tab y Shift+Tab no salen del diálogo,
  // Escape cierra y el foco vuelve al botón que lo abrió
  const caja = useRef(null)
  const botonListo = useRef(null)
  const cerrar = useRef(onClose)
  cerrar.current = onClose
  useEffect(() => {
    const previo = document.activeElement
    caja.current?.querySelector("input")?.focus()
    const tecla = e => {
      if (e.key === "Escape") return cerrar.current()
      if (e.key !== "Tab") return
      const destino = focoAtrapado(enfocables(caja.current), document.activeElement, e.shiftKey)
      if (destino) { e.preventDefault(); destino.focus() }
    }
    document.addEventListener("keydown", tecla)
    return () => { document.removeEventListener("keydown", tecla); if (previo?.isConnected) previo.focus?.() }
  }, [])
  // Al enviarse, el formulario desaparece: el foco pasa al botón Cerrar del mensaje de éxito
  useEffect(() => { if (estado === "enviado") botonListo.current?.focus() }, [estado])

  const handleEnviar = async e => {
    e.preventDefault()
    if (estado === "enviando") return
    if (errores.nombre || errores.email) {
      setEstado("revisar")
      document.getElementById(id(errores.nombre ? "nombre" : "email"))?.focus()
      return
    }
    setEstado("enviando")
    const ok = await enviarLead({
      tipo: "contacto",
      contacto: { nombre: f.nombre.trim(), empresa: f.empresa.trim(), email: f.email.trim(), telefono: f.telefono.trim() },
      mensaje: f.mensaje.trim(),
      resumen: [...resumen, `Idioma del sitio: ${idioma}`],
      respuestas: { origen, idioma },
      website: f.website,
    })
    setEstado(ok ? "enviado" : "error")
  }

  const enviando = estado === "enviando"
  const fallo = estado === "error"
  const revisar = estado === "revisar" && Boolean(errores.nombre || errores.email)
  const campo = (k, etiqueta, props = {}, ayuda = null) => (
    <div className="ah-campo">
      <label className="ah-label" htmlFor={id(k)}>{etiqueta}</label>
      <input className="ah-input" id={id(k)} name={k} value={f[k]} onChange={set(k)} aria-describedby={id(`${k}-ayuda`)} {...props} />
      <p className="ah-ayuda" id={id(`${k}-ayuda`)}>{ayuda}</p>
    </div>
  )

  // --z-modal (400): sobre el menú fijo, que está en --z-sticky-nav (300)
  return (
    <div className="ah-modal">
      <div className="ah-modal__fondo" onClick={onClose} />
      <div ref={caja} role="dialog" aria-modal="true" aria-labelledby={tituloId} className="ah-modal__caja">
        <button type="button" onClick={onClose} aria-label={t("contacto.cerrar")} className="ah-modal__cerrar">
          <X size={20} aria-hidden="true" />
        </button>

        {estado === "enviado" ? (
          <div className="ah-modal__listo" role="status">
            <CircleCheckBig size={40} aria-hidden="true" />
            <h2 id={tituloId} className="ah-modal__titulo">{t("contacto.listo.titulo")}</h2>
            <p className="ah-modal__bajada">{t("contacto.listo.texto")}</p>
            <button ref={botonListo} type="button" onClick={onClose} className="ah-btn ah-btn--app">{t("contacto.cerrar")}</button>
          </div>
        ) : (
          <form onSubmit={handleEnviar} noValidate className="ah-modal__form">
            <h2 id={tituloId} className="ah-modal__titulo">{titulo || t("contacto.titulo")}</h2>
            <p className="ah-modal__bajada">{subtitulo || t("contacto.subtitulo")}</p>
            {campo("nombre", t("contacto.nombre"), {
              autoComplete: "name", onBlur: tocar("nombre"), "aria-required": "true",
              "aria-invalid": error("nombre") ? "true" : undefined,
            }, error("nombre"))}
            {campo("email", t("contacto.email"), {
              type: "email", inputMode: "email", autoComplete: "email", onBlur: tocar("email"), "aria-required": "true",
              "aria-invalid": error("email") ? "true" : undefined,
            }, error("email"))}
            {campo("empresa", t("contacto.empresa"), { autoComplete: "organization" })}
            {campo("telefono", t("contacto.telefono"), { type: "tel", autoComplete: "tel" }, t("contacto.telefonoAyuda"))}
            <div className="ah-campo">
              <label className="ah-label" htmlFor={id("mensaje")}>{t("contacto.mensaje")}</label>
              <textarea className="ah-input ah-input--texto" id={id("mensaje")} name="mensaje" rows={3} value={f.mensaje} onChange={set("mensaje")} />
            </div>
            <input className="ah-trampa" name="website" value={f.website} onChange={set("website")} tabIndex={-1} autoComplete="off" aria-hidden="true" />

            <div className="ah-modal__pie">
              <button type="submit" disabled={enviando} aria-busy={enviando ? "true" : undefined} className="ah-btn ah-btn--app">
                <Send size={16} aria-hidden="true" />
                {enviando ? t("contacto.enviando") : t("contacto.enviar")}
              </button>
              <p className={`ah-ayuda${fallo || revisar ? " ah-ayuda--error" : ""}`} aria-live="polite">
                {fallo
                  ? <>{t("contacto.error")} <a href={`mailto:${CORREO_CONTACTO}`}>{CORREO_CONTACTO}</a>.</>
                  : revisar
                    ? t("contacto.revisar")
                    : <>{t("contacto.privacidad")} <Enlace to="/terminos" onClick={onClose}>{t("contacto.terminos")}</Enlace></>}
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
