import { useState } from "react"
import { X, User, Phone, Mail, MessageCircle, CheckCircle } from "lucide-react"

export async function notificar(emailSubject, emailHtml, telegramMsg) {
  try {
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailSubject, emailHtml, telegramMsg }),
    })
  } catch (_) {}
}

export default function ContactModal({ onClose, titulo = "¿Hablamos?", subtitulo = "Te contactamos en menos de 24 hrs.", origen = "", whatsappMsg = "" }) {
  const [nombre,   setNombre]   = useState("")
  const [telefono, setTelefono] = useState("")
  const [email,    setEmail]    = useState("")
  const [enviando, setEnviando] = useState(false)
  const [enviado,  setEnviado]  = useState(false)

  const valido = nombre.trim() && telefono.trim() && email.trim()

  const handleEnviar = async () => {
    if (!valido) return
    setEnviando(true)

    const asunto = `Contacto AgroHub — ${nombre}`
    const html = `
      <h2 style="color:#166534">Nuevo contacto desde AgroHub</h2>
      <p><b>Nombre:</b> ${nombre}</p>
      <p><b>Teléfono/WhatsApp:</b> ${telefono}</p>
      <p><b>Email:</b> ${email}</p>
      ${origen ? `<p><b>Origen:</b> ${origen}</p>` : ""}
    `
    const telegram = `📩 <b>Nuevo contacto AgroHub</b>\n👤 <b>${nombre}</b>\n📱 ${telefono}\n📧 ${email}${origen ? `\n📌 ${origen}` : ""}`

    await notificar(asunto, html, telegram)

        const msgFinal = whatsappMsg
      ? whatsappMsg.replace("[NOMBRE]", nombre).replace("[TEL]", telefono).replace("[EMAIL]", email)
      : `Hola AgroHub! Mi nombre es ${nombre}. Me gustaria saber mas sobre la plataforma para mi territorio.`
    window.open(`https://wa.me/56987561075?text=${encodeURIComponent(msgFinal)}`, "_blank")
    setEnviando(false)
    setEnviado(true)
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={18} />
        </button>

        {enviado ? (
          <div className="text-center py-6">
            <CheckCircle size={48} className="text-agro-green-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 text-lg mb-2">¡Listo!</h3>
            <p className="text-gray-500 text-sm">Nos contactaremos contigo a la brevedad. También se abrió WhatsApp.</p>
            <button onClick={onClose} className="mt-5 bg-agro-green-600 text-white font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-agro-green-700 transition-colors">
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-bold text-gray-900 text-lg mb-1">{titulo}</h3>
            <p className="text-gray-500 text-sm mb-5">{subtitulo}</p>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre completo"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400" />
              </div>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="WhatsApp o teléfono"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400" />
              </div>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Tu email" type="email"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400" />
              </div>
            </div>
            <button onClick={handleEnviar} disabled={!valido || enviando}
              className="mt-5 w-full flex items-center justify-center gap-2 bg-agro-green-600 hover:bg-agro-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-colors">
              <MessageCircle size={15} />
              {enviando ? "Enviando..." : "Enviar y abrir WhatsApp"}
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
