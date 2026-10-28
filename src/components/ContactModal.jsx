import { useEffect, useId, useRef, useState } from "react"
import { X, User, Phone, Mail, Building2, Send, CheckCircle } from "lucide-react"
import { enviarLead, emailValido, CORREO_CONTACTO } from "../lib/lead"
import { enfocables, focoAtrapado } from "../lib/foco"

const inputCls = "w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400"

export default function ContactModal({ onClose, titulo = "¿Hablamos?", subtitulo = "Déjanos tus datos y te contactamos en menos de 24 horas hábiles.", resumen = [] }) {
  const [nombre,   setNombre]   = useState("")
  const [empresa,  setEmpresa]  = useState("")
  const [email,    setEmail]    = useState("")
  const [telefono, setTelefono] = useState("")
  const [mensaje,  setMensaje]  = useState("")
  const [website,  setWebsite]  = useState("")
  const [enviando, setEnviando] = useState(false)
  const [enviado,  setEnviado]  = useState(false)
  const [error,    setError]    = useState(false)

  const valido = nombre.trim() && emailValido(email)

  // Diálogo accesible: foco en el primer campo al abrir, Tab y Shift+Tab no salen del diálogo,
  // Escape cierra y el foco vuelve al botón que lo abrió
  const tituloId = useId()
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
  useEffect(() => { if (enviado) botonListo.current?.focus() }, [enviado])

  const handleEnviar = async () => {
    if (!valido) return
    setEnviando(true)
    setError(false)
    const ok = await enviarLead({
      tipo: "contacto",
      contacto: { nombre, empresa, email, telefono },
      mensaje, resumen, website,
    })
    setEnviando(false)
    if (ok) setEnviado(true)
    else setError(true)
  }

  // z-[400] (--z-modal): sobre el menú fijo, que está en --z-sticky-nav (300)
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div ref={caja} role="dialog" aria-modal="true" aria-labelledby={tituloId} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[92vh] overflow-y-auto">
        <button type="button" onClick={onClose} aria-label="Cerrar" className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={18} />
        </button>

        {enviado ? (
          <div className="text-center py-6">
            <CheckCircle size={48} className="text-agro-green-500 mx-auto mb-3" />
            <h3 id={tituloId} className="font-bold text-gray-900 text-lg mb-2">¡Mensaje recibido!</h3>
            <p className="text-gray-500 text-sm">Nuestro equipo te contactará a la brevedad por email o teléfono.</p>
            <button ref={botonListo} onClick={onClose} className="mt-5 bg-agro-green-600 text-white font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-agro-green-700 transition-colors">
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <h3 id={tituloId} className="font-bold text-gray-900 text-lg mb-1">{titulo}</h3>
            <p className="text-gray-500 text-sm mb-5">{subtitulo}</p>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre *" aria-label="Tu nombre (obligatorio)" className={inputCls} />
              </div>
              <div className="relative">
                <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={empresa} onChange={e => setEmpresa(e.target.value)} placeholder="Empresa u organización" aria-label="Empresa u organización" className={inputCls} />
              </div>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Tu email *" aria-label="Tu email (obligatorio)" type="email" className={inputCls} />
              </div>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Teléfono (opcional)" aria-label="Teléfono (opcional)" className={inputCls} />
              </div>
              <textarea value={mensaje} onChange={e => setMensaje(e.target.value)} rows={3} placeholder="¿En qué te podemos ayudar?" aria-label="Mensaje"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400 resize-none" />
              <input value={website} onChange={e => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
            </div>
            {error && (
              <p role="alert" className="text-xs text-red-600 mt-3">
                No pudimos enviar tu mensaje. Inténtalo de nuevo en unos minutos o escríbenos a{" "}
                <a href={`mailto:${CORREO_CONTACTO}`} className="underline font-semibold">{CORREO_CONTACTO}</a>.
              </p>
            )}
            <button onClick={handleEnviar} disabled={!valido || enviando}
              className="mt-5 w-full flex items-center justify-center gap-2 bg-agro-green-600 hover:bg-agro-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-colors">
              <Send size={15} />
              {enviando ? "Enviando..." : "Enviar"}
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              Tus datos solo se usan para contactarte. <a href="/terminos" className="underline">Ver términos</a>.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
