import { useInView } from '../hooks/useInView'
import { ArrowRight, Mail, Phone } from 'lucide-react'

const BG = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1800&q=80&auto=format'

export default function ClosingCTA() {
  const [ref, visible] = useInView({ threshold: 0.2 })

  return (
    <>
      {/* Emotional close */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={BG} alt="Valle de Choapa" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-agro-green-900/88" />
        </div>
        <div
          ref={ref}
          className={`relative z-10 max-w-3xl mx-auto px-6 text-center transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            La tecnología al servicio de las personas.{' '}
            <span className="text-agro-green-300">No al revés.</span>
          </h2>
          <p className="text-white/55 text-lg mb-10 max-w-xl mx-auto">
            AgroHub digitaliza el conocimiento agrícola y lo hace crecer con cada agricultor del territorio.
          </p>
          <a
            href="#contacto"
            className="inline-flex items-center gap-3 bg-white text-agro-green-800 font-bold text-base px-10 py-4 rounded-full shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            Construyamos el ecosistema juntos <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* Contact */}
      <section id="contacto" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Conversemos</h2>
              <p className="text-gray-500 text-base leading-relaxed mb-8">
                El primer paso es entender tu territorio. Diagnóstico antes de cualquier instalación.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { icon: Mail,  label: 'Email',              value: 'contacto@agrohub.cl' },
                  { icon: Phone, label: 'Teléfono / WhatsApp', value: '+56 9 0000 0000' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-agro-green-50 border border-agro-green-100 rounded-xl flex items-center justify-center">
                      <Icon size={17} className="text-agro-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">{label}</div>
                      <div className="text-gray-800 font-medium text-sm">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
              <form className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Nombre',        ph: 'Juan Pérez', type: 'text' },
                    { label: 'Organización',  ph: 'UC / SAG / CD', type: 'text' },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">{f.label}</label>
                      <input type={f.type} placeholder={f.ph}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400 placeholder-gray-400" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
                  <input type="email" placeholder="juan@uc.cl"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400 placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Mensaje</label>
                  <textarea rows={3} placeholder="¿Qué territorio? ¿Qué desafío?"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-agro-green-400 placeholder-gray-400 resize-none" />
                </div>
                <button type="submit"
                  className="w-full bg-agro-green-600 hover:bg-agro-green-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                  Enviar <ArrowRight size={15} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
