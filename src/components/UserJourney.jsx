import { useInView } from '../hooks/useInView'
import { Eye, Brain, MessageSquare, TrendingUp, FolderOpen, ShoppingBag, Users } from 'lucide-react'

const steps = [
  {
    icon: Eye,
    color: 'text-agro-blue-600',
    bg: 'bg-agro-blue-50',
    ring: 'ring-agro-blue-100',
    step: 'Observa',
    desc: 'Ve qué ocurre en su cultivo con datos de sensores en tiempo real.',
  },
  {
    icon: Brain,
    color: 'text-agro-green-600',
    bg: 'bg-agro-green-50',
    ring: 'ring-agro-green-100',
    step: 'Entiende',
    desc: 'Interpreta la información con apoyo técnico y del asistente.',
  },
  {
    icon: MessageSquare,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    ring: 'ring-teal-100',
    step: 'Recibe orientación',
    desc: 'Obtiene recomendaciones prácticas adaptadas a su realidad productiva.',
  },
  {
    icon: TrendingUp,
    color: 'text-agro-earth-600',
    bg: 'bg-agro-earth-50',
    ring: 'ring-agro-earth-100',
    step: 'Mejora su manejo',
    desc: 'Aplica cambios en riego, nutrición y manejo con mayor seguridad.',
  },
  {
    icon: FolderOpen,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    ring: 'ring-amber-100',
    step: 'Organiza su información',
    desc: 'Centraliza registros, documentos y historial productivo en la plataforma.',
  },
  {
    icon: ShoppingBag,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    ring: 'ring-purple-100',
    step: 'Ofrece su producción',
    desc: 'Publica productos, servicios o insumos en el marketplace agrícola.',
  },
  {
    icon: Users,
    color: 'text-agro-green-700',
    bg: 'bg-agro-green-50',
    ring: 'ring-agro-green-200',
    step: 'Conecta con compradores',
    desc: 'Establece contacto directo con compradores e instituciones de apoyo.',
  },
]

export default function UserJourney() {
  const [titleRef, titleVisible] = useInView({ threshold: 0.2 })

  return (
    <section className="py-24 bg-agro-green-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          ref={titleRef}
          className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <span className="text-white/90 text-sm font-medium">La experiencia del agricultor</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            De la observación a la conexión comercial
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">
            AgroHub no solo acompaña la producción — acompaña todo el recorrido del agricultor,
            desde que observa su cultivo hasta que conecta con compradores.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-10 left-[calc(100%/14)] right-[calc(100%/14)] h-0.5 bg-gradient-to-r from-agro-blue-400/30 via-agro-green-400/50 to-purple-400/30" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6">
            {steps.map((step, i) => {
              const [ref, visible] = useInView({ threshold: 0.1 })
              const Icon = step.icon
              return (
                <div
                  key={step.step}
                  ref={ref}
                  className={`flex flex-col items-center text-center transition-all duration-500 ${
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <div className={`w-20 h-20 rounded-2xl ${step.bg} ring-2 ${step.ring} flex items-center justify-center mb-4 relative z-10 shadow-sm`}>
                    <Icon size={26} className={step.color} />
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider ${step.color} mb-1`}>
                    Paso {i + 1}
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1.5">{step.step}</h4>
                  <p className="text-white/50 text-xs leading-relaxed">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom message */}
        <div className="mt-16 text-center">
          <p className="text-white/40 text-sm max-w-xl mx-auto leading-relaxed">
            AgroHub acompaña la evolución completa del agricultor — desde la primera medición
            hasta la primera venta digital. Sin saltarse etapas, sin dejar a nadie solo.
          </p>
        </div>
      </div>
    </section>
  )
}
