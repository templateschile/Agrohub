import { useState } from "react"
import { MessageCircle } from "lucide-react"
import { enviarLead, emailValido, CORREO_CONTACTO, WHATSAPP } from "../lib/lead"
import { useIdioma } from "../i18n"

// Formulario corto para pedir una demo: nombre, correo o WhatsApp, cultivo o empresa y qué le interesa ver.
// Usa el API de leads existente (tipo "contacto"); lo que llega al equipo va en español, con el idioma anotado.
const INTERESES = ["sensores", "cuaderno", "ia", "app", "otro"]

export default function FormDemo({ origen = "portada" }) {
  const { t, idioma } = useIdioma()
  const [f, setF] = useState({ nombre: "", contacto: "", cultivo: "", website: "" })
  const [interes, setInteres] = useState([])
  const [tocado, setTocado] = useState({})
  const [estado, setEstado] = useState("editando")
  const id = k => `demo-${origen}-${k}`
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))
  const tocar = k => () => setTocado(p => ({ ...p, [k]: true }))

  const esEmail = emailValido(f.contacto)
  const esTelefono = /^\+?[\d\s().-]{7,}$/.test(f.contacto.trim())
  const errores = { nombre: !f.nombre.trim() && t("demo.err.nombre"), contacto: !(esEmail || esTelefono) && t("demo.err.contacto") }
  const error = k => (tocado[k] || estado === "revisar") && errores[k]

  const enviar = async e => {
    e.preventDefault()
    if (errores.nombre || errores.contacto) {
      setEstado("revisar")
      document.getElementById(id(errores.nombre ? "nombre" : "contacto"))?.focus()
      return
    }
    setEstado("enviando")
    const intereses = interes.map(k => t(`demo.interes.${k}`)).join(", ")
    const resumen = [`Origen: demo (${origen})`, `Contacto: ${f.contacto.trim()}`, f.cultivo.trim() && `Cultivo o empresa: ${f.cultivo.trim()}`, intereses && `Le interesa: ${intereses}`, `Idioma del sitio: ${idioma}`].filter(Boolean)
    const ok = await enviarLead({
      tipo: "contacto",
      contacto: { nombre: f.nombre.trim(), email: esEmail ? f.contacto.trim() : "", telefono: esTelefono ? f.contacto.trim() : "" },
      mensaje: `Pide una demo.\n${resumen.join("\n")}`,
      resumen,
      respuestas: { origen: `demo-${origen}`, cultivo: f.cultivo.trim(), interes },
      website: f.website,
      idioma,
    })
    setEstado(ok ? "enviado" : "error")
  }

  if (estado === "enviado") {
    return (
      <div className="ah-demo" role="status">
        <h3 className="ah-demo__titulo">{t("demo.listo.titulo", { nombre: f.nombre.trim().split(" ")[0] })}</h3>
        <p>{t("demo.listo.texto")}</p>
      </div>
    )
  }

  return (
    <form className="ah-demo" onSubmit={enviar} noValidate>
      <div className="ah-campo">
        <label className="ah-label" htmlFor={id("nombre")}>{t("demo.nombre")}</label>
        <input className="ah-input" id={id("nombre")} autoComplete="name" value={f.nombre} onChange={set("nombre")} onBlur={tocar("nombre")}
          aria-required="true" aria-invalid={error("nombre") ? "true" : undefined} aria-describedby={id("nombre-ayuda")} />
        <p className="ah-ayuda" id={id("nombre-ayuda")}>{error("nombre")}</p>
      </div>
      <div className="ah-campo">
        <label className="ah-label" htmlFor={id("contacto")}>{t("demo.contacto")}</label>
        <input className="ah-input" id={id("contacto")} autoComplete="email" inputMode="email" placeholder={t("demo.contactoEjemplo")} value={f.contacto} onChange={set("contacto")} onBlur={tocar("contacto")}
          aria-required="true" aria-invalid={error("contacto") ? "true" : undefined} aria-describedby={id("contacto-ayuda")} />
        <p className="ah-ayuda" id={id("contacto-ayuda")}>{error("contacto")}</p>
      </div>
      <div className="ah-campo">
        <label className="ah-label" htmlFor={id("cultivo")}>{t("demo.cultivo")}</label>
        <input className="ah-input" id={id("cultivo")} autoComplete="organization" placeholder={t("demo.cultivoEjemplo")} value={f.cultivo} onChange={set("cultivo")} />
      </div>
      <fieldset className="ah-demo__interes">
        <legend className="ah-label">{t("demo.interes")}</legend>
        {INTERESES.map(k => (
          <span key={k} className="ah-demo__chip">
            <input type="checkbox" id={id(`i-${k}`)} checked={interes.includes(k)} onChange={e => setInteres(p => e.target.checked ? [...p, k] : p.filter(x => x !== k))} />
            <label htmlFor={id(`i-${k}`)}>{t(`demo.interes.${k}`)}</label>
          </span>
        ))}
      </fieldset>
      <input className="ah-trampa" value={f.website} onChange={set("website")} tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" />
      <div className="ah-demo__pie">
        <button className="ah-btn" type="submit" disabled={estado === "enviando"} aria-busy={estado === "enviando" ? "true" : undefined}>
          {estado === "enviando" ? t("demo.enviando") : t("demo.enviar")}
        </button>
        <p className="ah-ayuda" aria-live="polite">{estado === "error" ? t("demo.error", { correo: CORREO_CONTACTO }) : t("reunion.privacidad")}</p>
        {WHATSAPP && (
          <a className="ah-demo__wa" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} aria-hidden="true" />{t("demo.whatsapp")}
          </a>
        )}
      </div>
    </form>
  )
}
