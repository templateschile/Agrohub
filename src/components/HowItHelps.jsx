import { MessageSquare, FolderOpen, BookOpen, Users, Wifi, Bell, Leaf } from 'lucide-react'
import { useInView } from '../hooks/useInView'

/* Row 1 — the 3 core pillars (large) */
const core = [
  {
    icon: MessageSquare,
    color: 'text-agro-green-600',
    bg: 'bg-agro-green-50',
    border: 'border-agro-green-100',
    tag: 'Adopción temprana',
    tagBg: 'bg-agro-green-100 text-agro-green-700',
    title: 'Conversación natural',
    desc: 'El agricultor pregunta como habla. El asistente responde con precisión técnica, basado en datos reales del predio y fuentes validadas por expertos.',
  },
  {
    icon: FolderOpen,
    color: 'text-agro-blue-600',
    bg: 'bg-agro-blue-50',
    border: 'border-agro-blue-100',
    tag: 'Digitalización',
    tagBg: 'bg-agro-blue-100 text-agro-blue-700',
    title: 'Conocimiento centralizado',
    desc: 'Protocolos, historiales, registros y documentos en un solo lugar accesible. El saber del territorio deja de estar disperso.',
  },
  {
    icon: BookOpen,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    tag: 'Aprendizaje continuo',
    tagBg: 'bg-amber-100 text-amber-700',
    title: 'Capacitación orgánica',
    desc: 'El aprendizaje ocurre en el uso diario. Guías cortas y contextuales, adaptadas al cultivo y nivel de cada agricultor.',
  },
]

/* Row 2 — 3 supporting modules (compact) */
const supporting = [
  {
    icon: Users,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    title: 'Colaboración entre agricultores',
    desc: 'Lo que aprende uno, enriquece a todos.',
  },
  {
    icon: Wifi,
    color: 'text-agro-blue-500',
    bg: 'bg-agro-blue-50',
    title: 'Sensores y monitoreo',
    desc: 'Humedad, temperatura, viento en tiempo real.',
  },
  {
    icon: Bell,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    title: 'Alertas y recomendaciones',
    desc: 'Notificaciones prácticas cuando importan.',
  },
]

function CoreCard({ item, index }) {
  const [ref, visible] = useInView({ threshold: 0.1 })
  const Icon = item.icon
  return (
    <div
      ref={ref}
      className={`card-hover bg-white border ${item.border} rounded-2xl p-7 flex flex-col gap-5 transition-all duration-600 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`w-13 h-13 w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center`}>
          <Icon size={24} className={item.color} />
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${item.tagBg}`}>
          {item.tag}
        </span>
      </div>
      <div>
        <h3 className="font-bold text-gray-900 text-xl mb-2">{item.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
      </div>
    </div>
  )
}

function SupportCard({ item, index }) {
  const [ref, visible] = useInView({ threshold: 0.1 })
  const Icon = item.icon
  return (
    <div
      ref={ref}
      className={`card-hover bg-gray-50 border border-gray-100 rounded-2xl p-6 flex gap-4 items-start transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
        <Icon size={20} className={item.color} />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h4>
        <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
      </div>
    </div>
  )
}

export default function HowItHelps() {
  const [titleRef, titleVisible] = useInView({ threshold: 0.2 })

  return (
    <section id="herramientas" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-14">
        {/* Header */}
        <div
          ref={titleRef}
          className={`max-w-xl mx-auto text-center mb-14 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-agro-green-50 border border-agro-green-100 rounded-full px-4 py-1.5 mb-4">
            <span className="text-agro-green-700 text-sm font-medium">Herramientas que generan adopción real</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Simple de usar. Poderoso por dentro.
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            Cada componente prioriza la simplicidad para que el agricultor adopte sin esfuerzo.
          </p>
        </div>

        {/* Row 1: 3 core */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          {core.map((item, i) => <CoreCard key={item.title} item={item} index={i} />)}
        </div>

        {/* Row 2: 3 supporting */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {supporting.map((item, i) => <SupportCard key={item.title} item={item} index={i} />)}
        </div>

        {/* Bottom note */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Un agricultor no necesita aprender tecnología —
            <span className="text-agro-green-600 font-medium"> solo necesita hacer su pregunta.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
