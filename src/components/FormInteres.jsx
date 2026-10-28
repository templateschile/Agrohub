import { useEffect, useRef, useState } from "react"
import { CircleCheckBig } from "lucide-react"
import { enviarLead, emailValido, CORREO_CONTACTO } from "../lib/lead"
import { Enlace, useIdioma } from "../i18n"

// "Súmate para probarlo primero": formulario de interés de una app que aún no existe (AgroSeller).
// Nombre y email obligatorios; teléfono y qué vende, opcionales. Va al API de la plataforma
// (POST /api/v1/site/leads, lib/lead.js) como tipo "contacto", el que el API usa para los contactos
// del sitio (api/src/site/dto/site.dto.js acepta evaluacion, contacto y pedido). Los textos que llegan
// al equipo van en español; `respuestas.idioma` dice en qué idioma estaba el sitio.
export default function FormInteres({ app }) {
  const { t, idioma } = useIdioma()
  const [f, setF] = useState({ nombre: "", email: "", telefono: "", vende: "", website: "" })
  const [tocado, setTocado] = useState({})
  const [estado, setEstado] = useState("editando") // editando | revisar | enviando | enviado | error
  const listo = useRef(null)

  const set = (k) => (e) => setF((prev) => ({ ...prev, [k]: e.target.value }))
  const tocar = (k) => () => setTocado((prev) => ({ ...prev, [k]: true }))
  const id = (k) => `interes-${app.slug}-${k}`

  const errores = {
    nombre: !f.nombre.trim() && t("contacto.errorNombre"),
    email: !emailValido(f.email) && t("contacto.errorEmail"),
  }
  const error = (k) => (tocado[k] || estado === "revisar") && errores[k]

  // Al enviarse, el formulario desaparece: el foco pasa al mensaje de confirmación
  useEffect(() => { if (estado === "enviado") listo.current?.focus() }, [estado])

  const enviar = async (e) => {
    e.preventDefault()
    if (estado === "enviando") return
    if (errores.nombre || errores.email) {
      setEstado("revisar")
      document.getElementById(id(errores.nombre ? "nombre" : "email"))?.focus()
      return
    }
    setEstado("enviando")
    const vende = f.vende.trim()
    const ok = await enviarLead({
      tipo: "contacto",
      contacto: { nombre: f.nombre.trim(), email: f.email.trim(), telefono: f.telefono.trim() },
      mensaje: `Quiere probar ${app.nombre} primero.${vende ? `\nVende: ${vende}` : ""}`,
      resumen: [
        `Origen: página de la app ${app.nombre} (${app.ruta})`,
        `Interés: probar ${app.nombre} primero`,
        vende && `Vende: ${vende}`,
        `Idioma del sitio: ${idioma}`,
      ].filter(Boolean),
      respuestas: { origen: `app-${app.slug}`, app: app.slug, interes: "probar-primero", vende, idioma },
      website: f.website,
    })
    setEstado(ok ? "enviado" : "error")
  }

  if (estado === "enviado") {
    return (
      <div className="ah-interes ah-interes--listo" role="status">
        <CircleCheckBig size={32} aria-hidden="true" />
        <h3 ref={listo} tabIndex={-1} className="ah-interes__titulo">
          {t("apps.interes.listo.titulo", { nombre: f.nombre.trim().split(" ")[0] })}
        </h3>
        <p>{t("apps.interes.listo.texto", { email: f.email.trim(), app: app.nombre })}</p>
      </div>
    )
  }

  const enviando = estado === "enviando"
  // Aviso bajo el botón (región aria-live): el error de envío con el correo alternativo, el pedido de
  // revisar los campos mientras sigan con error o, si no, la nota de privacidad
  const fallo = estado === "error"
  const revisar = estado === "revisar" && Boolean(errores.nombre || errores.email)
  return (
    <form className="ah-interes" onSubmit={enviar} noValidate>
      <div className="ah-campo">
        <label className="ah-label" htmlFor={id("nombre")}>{t("contacto.nombre")}</label>
        <input className="ah-input" id={id("nombre")} name="nombre" autoComplete="name" value={f.nombre}
          onChange={set("nombre")} onBlur={tocar("nombre")} aria-required="true"
          aria-invalid={error("nombre") ? "true" : undefined} aria-describedby={id("nombre-ayuda")} />
        <p className="ah-ayuda" id={id("nombre-ayuda")}>{error("nombre")}</p>
      </div>
      <div className="ah-campo">
        <label className="ah-label" htmlFor={id("email")}>{t("contacto.email")}</label>
        <input className="ah-input" type="email" id={id("email")} name="email" autoComplete="email" inputMode="email"
          value={f.email} onChange={set("email")} onBlur={tocar("email")} aria-required="true"
          aria-invalid={error("email") ? "true" : undefined} aria-describedby={id("email-ayuda")} />
        <p className="ah-ayuda" id={id("email-ayuda")}>{error("email")}</p>
      </div>
      <div className="ah-campo">
        <label className="ah-label" htmlFor={id("telefono")}>{t("contacto.telefono")}</label>
        <input className="ah-input" type="tel" id={id("telefono")} name="telefono" autoComplete="tel" value={f.telefono}
          onChange={set("telefono")} aria-describedby={id("telefono-ayuda")} />
        <p className="ah-ayuda" id={id("telefono-ayuda")}>{t("contacto.telefonoAyuda")}</p>
      </div>
      <div className="ah-campo">
        <label className="ah-label" htmlFor={id("vende")}>{t("apps.interes.vende")}</label>
        <input className="ah-input" id={id("vende")} name="vende" value={f.vende} onChange={set("vende")}
          aria-describedby={id("vende-ayuda")} />
        <p className="ah-ayuda" id={id("vende-ayuda")}>{t("apps.interes.vendeAyuda")}</p>
      </div>
      <input className="ah-trampa" name="website" value={f.website} onChange={set("website")} tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="ah-interes__pie">
        <button className="ah-btn ah-btn--app" type="submit" disabled={enviando} aria-busy={enviando ? "true" : undefined}>
          {enviando ? t("contacto.enviando") : t("apps.interes.enviar")}
        </button>
        <p className={`ah-ayuda${fallo || revisar ? " ah-ayuda--error" : ""}`} aria-live="polite">
          {fallo
            ? <>{t("contacto.error")} <a href={`mailto:${CORREO_CONTACTO}`}>{CORREO_CONTACTO}</a>.</>
            : revisar
              ? t("contacto.revisar")
              : <>{t("contacto.privacidad")} <Enlace to="/terminos">{t("contacto.terminos")}</Enlace></>}
        </p>
      </div>
    </form>
  )
}
