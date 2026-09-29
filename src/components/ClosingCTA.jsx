import { useInView } from '../hooks/useInView'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardCheck, ShieldCheck, Clock, CheckCircle } from 'lucide-react'
import { enviarLead, emailValido } from '../lib/lead'

const BG = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1800&q=80&auto=format'

export default function ClosingCTA() {
  const [ref, visible] = useInView({ threshold: 0.2 })

  return (
    <>
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={BG} alt="Campo agricola" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-agro-green-900/88" />
        </div>
        <div
          ref={ref}
                    className={`relative z-10 max-w-3xl mx-auto px-6 text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            La tecnología al servicio de las personas.{' '}
            <span className="text-agro-green-300">No al revés.</span>
          </h2>
          <p className="text-white/55 text-lg mb-10 max-w-xl mx-auto">
            AgroHubs digitaliza el conocimiento agrícola y lo hace crecer con cada agricultor del territorio.
          </p>
          <a
            href="#contacto"
            className="inline-flex items-center gap-3 bg-white text-agro-green-800 font-bold text-base px-10 py-4 rounded-full shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            Construyamos el ecosistema juntos <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <section id="contacto" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Conversemos</h2>
              <p className="text-gray-500 text-base leading-relaxed mb-8">
                El primer paso es entender tu territorio y tus necesidades. Diagnóstico antes de cualquier instalación.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { icon: ClipboardCheck, titulo: 'Diagnóstico sin compromiso', texto: 'Primero entendemos tu operación; después proponemos.' },
                  { icon: ShieldCheck,    titulo: 'Tus datos son confidenciales', texto: 'Solo los usa nuestro equipo para contactarte.' },
                  { icon: Clock,          titulo: 'Respuesta en 24 horas hábiles', texto: 'Te escribe una persona del equipo, no un bot.' },
                ].map(({ icon: Icon, titulo, texto }) => (
                  <div key={titulo} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-agro-green-50 border border-agro-green-100 rounded-xl flex items-center justify-center shrink-0">
                      <Icon size={17} className="text-agro-green-600" />
                    </div>
                    <div>
                      <div className="text-gray-800 font-medium text-sm">{titulo}</div>
                      <div className="text-xs text-gray-400">{texto}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/evaluacion" className="inline-flex items-center gap-2 mt-8 text-agro-green-700 font-semibold text-sm hover:underline">
                ¿Prefieres evaluar tu operación en 3 minutos? <ArrowRight size={14} />
              </Link>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
              <FormContacto />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400 placeholder-gray-400'

function FormContacto() {
  const [f, setF] = useState({ nombre: '', empresa: '', email: '', mensaje: '', website: '' })
  const [estado, setEstado] = useState('editando')
  const set = k => e => setF(prev => ({ ...prev, [k]: e.target.value }))
  const valido = f.nombre.trim() && emailValido(f.email)

  const enviar = async e => {
    e.preventDefault()
    if (!valido) return
    setEstado('enviando')
    const ok = await enviarLead({
      tipo: 'contacto',
      contacto: { nombre: f.nombre, empresa: f.empresa, email: f.email },
      mensaje: f.mensaje, website: f.website,
    })
    setEstado(ok ? 'enviado' : 'error')
  }

  if (estado === 'enviado') {
    return (
      <div className="text-center py-8">
        <CheckCircle size={44} className="text-agro-green-500 mx-auto mb-3" />
        <h3 className="font-bold text-gray-900 text-lg mb-1">¡Mensaje recibido!</h3>
        <p className="text-gray-500 text-sm">Te contactaremos dentro de las próximas 24 horas hábiles.</p>
      </div>
    )
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={enviar}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Nombre *</label>
          <input value={f.nombre} onChange={set('nombre')} placeholder="Juan Pérez" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Organización</label>
          <input value={f.empresa} onChange={set('empresa')} placeholder="Empresa / Cooperativa" className={inputCls} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Email *</label>
        <input type="email" value={f.email} onChange={set('email')} placeholder="juan@ejemplo.cl" className={inputCls} />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Mensaje</label>
        <textarea rows={3} value={f.mensaje} onChange={set('mensaje')} placeholder="¿Qué territorio? ¿Qué desafío?" className={`${inputCls} resize-none`} />
      </div>
      <input value={f.website} onChange={set('website')} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {estado === 'error' && <p className="text-xs text-red-600">No pudimos enviar tu mensaje. Inténtalo nuevamente en unos minutos.</p>}
      <button type="submit" disabled={!valido || estado === 'enviando'}
        className="w-full bg-agro-green-600 hover:bg-agro-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
        {estado === 'enviando' ? 'Enviando...' : 'Enviar'} <ArrowRight size={15} />
      </button>
    </form>
  )
}
