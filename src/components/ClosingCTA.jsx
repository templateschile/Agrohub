import { useInView } from '../hooks/useInView'
import { ArrowRight, Mail, Phone } from 'lucide-react'

const SUNSET_IMAGE = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1800&q=80&auto=format'

export default function ClosingCTA() {
  const [titleRef, titleVisible] = useInView({ threshold: 0.2 })

  return (
    <>
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={SUNSET_IMAGE} alt="Valle de Choapa al atardecer" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-agro-green-900/92 via-agro-green-800/65 to-agro-green-900/45" />
        </div>

        <div
          ref={titleRef}
          className={`relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <span className="text-white/90 text-sm font-medium">El compromiso de AgroHub UC</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            La tecnología al servicio de las personas.
            <br />
            <span className="text-agro-green-300">No al revés.</span>
          </h2>
          <p className="text-white/65 text-xl leading-relaxed max-w-2xl mx-auto mb-5">
            AgroHub UC digitaliza el conocimiento agrícola, lo centraliza y lo hace crecer
            con cada agricultor que se suma — de forma orgánica, práctica y continua.
          </p>
          <p className="text-white/45 text-base leading-relaxed max-w-xl mx-auto mb-12">
            El dato técnico conversa con la experiencia del campo.
            La plataforma simple facilita la adopción.
            El ecosistema colaborativo asegura que nadie quede solo.
          </p>
          <a
            href="#contacto"
            className="inline-flex items-center gap-3 bg-white text-agro-green-800 font-bold text-lg px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5"
          >
            Construyamos el ecosistema juntos
            <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* Contact */}
      <section id="contacto" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Conversemos sobre tu territorio</h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-4">
                El primer paso es entender tu realidad: quiénes son los agricultores,
                qué conocimiento existe hoy y qué brechas hay.
                Desde ahí construimos juntos.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                La implementación comienza con un diagnóstico territorial antes de instalar cualquier instrumento o plataforma.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-agro-green-50 border border-agro-green-100 rounded-xl flex items-center justify-center">
                    <Mail size={18} className="text-agro-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Email</div>
                    <div className="text-gray-700 font-medium">contacto@agrohub.cl</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-agro-green-50 border border-agro-green-100 rounded-xl flex items-center justify-center">
                    <Phone size={18} className="text-agro-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium">Teléfono / WhatsApp</div>
                    <div className="text-gray-700 font-medium">+56 9 0000 0000</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Déjanos tus datos</h3>
              <p className="text-gray-400 text-sm mb-6">Respondemos dentro de 48 horas hábiles.</p>
              <form className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Nombre</label>
                    <input type="text" placeholder="Juan Pérez"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-agro-green-400 focus:border-transparent placeholder-gray-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Organización</label>
                    <input type="text" placeholder="Institución / CD / SAG"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-agro-green-400 focus:border-transparent placeholder-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
                  <input type="email" placeholder="juan@ejemplo.cl"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-agro-green-400 focus:border-transparent placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Cuéntanos sobre tu territorio</label>
                  <textarea rows={4}
                    placeholder="¿Dónde están ubicados? ¿Qué agricultores atienden? ¿Qué brechas o desafíos identifican hoy?"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-agro-green-400 focus:border-transparent placeholder-gray-400 resize-none" />
                </div>
                <button type="submit"
                  className="w-full bg-agro-green-600 hover:bg-agro-green-700 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                  Enviar mensaje <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
