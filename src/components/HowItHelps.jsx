import {
  MessageSquare, FolderOpen, BookOpen, Users,
  Wifi, Bell, Smartphone, Monitor, ShoppingBag, Leaf
} from 'lucide-react'
import { useInView } from '../hooks/useInView'

const modules = [
  {
    icon: MessageSquare,
    color: 'text-agro-green-600',
    bg: 'bg-agro-green-50',
    size: 'large',
    title: 'Conversación en lenguaje natural',
    benefit: 'La puerta de entrada a la adopción',
    useCase: 'El agricultor escribe o habla como habla. Pregunta "¿cuándo riego?" y recibe una respuesta técnica precisa, basada en sus datos reales y en fuentes confiables validadas por expertos.',
    tag: 'Adopción temprana',
    tagColor: 'bg-agro-green-100 text-agro-green-700',
  },
  {
    icon: FolderOpen,
    color: 'text-agro-blue-600',
    bg: 'bg-agro-blue-50',
    size: 'large',
    title: 'Centralización del conocimiento',
    benefit: 'Todo en un solo lugar, siempre disponible',
    useCase: 'Protocolos técnicos, fichas de cultivo, registros históricos, recomendaciones y decisiones pasadas. El saber del territorio deja de estar disperso y empieza a acumularse.',
    tag: 'Digitalización',
    tagColor: 'bg-agro-blue-100 text-agro-blue-700',
  },
  {
    icon: BookOpen,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    size: 'large',
    title: 'Capacitación orgánica por etapas',
    benefit: 'Aprender sin sentir que se está estudiando',
    useCase: 'El aprendizaje ocurre en el uso diario. Guías cortas, respuestas contextuales y materiales adaptados al nivel y cultivo de cada agricultor, siempre apoyado por técnicos expertos.',
    tag: 'Aprendizaje continuo',
    tagColor: 'bg-amber-100 text-amber-700',
  },
  {
    icon: Users,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    size: 'large',
    title: 'Colaboración entre agricultores',
    benefit: 'El conocimiento de uno enriquece a todos',
    useCase: 'Lo que aprende un agricultor en un sector puede ayudar a otro con el mismo cultivo. La experiencia colectiva se convierte en conocimiento estructurado y accesible.',
    tag: 'Ecosistema',
    tagColor: 'bg-teal-100 text-teal-700',
  },
  {
    icon: Wifi,
    color: 'text-agro-blue-500',
    bg: 'bg-agro-blue-50',
    size: 'normal',
    title: 'Sensores y monitoreo',
    benefit: 'Datos que orientan decisiones',
    useCase: 'Humedad, temperatura, viento y ET en tiempo real. El instrumento mide, la plataforma interpreta.',
  },
  {
    icon: Bell,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    size: 'normal',
    title: 'Alertas inteligentes',
    benefit: 'Actuar antes de que sea tarde',
    useCase: 'Notificaciones prácticas con recomendación lista: qué hacer, cuándo y cómo.',
  },
  {
    icon: Leaf,
    color: 'text-agro-green-700',
    bg: 'bg-agro-green-50',
    size: 'normal',
    title: 'Micorrizas y bioinsumos',
    benefit: 'Resiliencia biológica',
    useCase: 'Fortalecimiento del sistema suelo-planta con seguimiento técnico y validación en terreno.',
  },
  {
    icon: Smartphone,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    size: 'normal',
    title: 'App móvil simple',
    benefit: 'Para el campo, no para la oficina',
    useCase: 'Interfaz diseñada para el agricultor real. Sin tecnicismos, sin pantallas complejas.',
  },
  {
    icon: Monitor,
    color: 'text-agro-blue-700',
    bg: 'bg-agro-blue-50',
    size: 'normal',
    title: 'Panel para técnicos',
    benefit: 'Visión territorial completa',
    useCase: 'Técnicos e instituciones ven todos los predios, sensores, alertas y actividad de la red.',
  },
  {
    icon: ShoppingBag,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    size: 'normal',
    title: 'Marketplace',
    benefit: 'Salida comercial integrada',
    useCase: 'Productores, servicios e insumos en un canal digital sencillo dentro de la misma plataforma.',
  },
]

function ModuleCard({ mod, index }) {
  const [ref, visible] = useInView({ threshold: 0.08 })
  const Icon = mod.icon
  const isLarge = mod.size === 'large'

  return (
    <div
      ref={ref}
      className={`card-hover group bg-white border border-gray-100 rounded-2xl flex flex-col gap-4 cursor-default transition-all duration-500 ${
        isLarge ? 'p-7' : 'p-5'
      } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 45}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`${isLarge ? 'w-13 h-13' : 'w-11 h-11'} w-12 h-12 rounded-xl ${mod.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0`}>
          <Icon size={isLarge ? 24 : 20} className={mod.color} />
        </div>
        {mod.tag && (
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${mod.tagColor} shrink-0`}>
            {mod.tag}
          </span>
        )}
      </div>
      <div>
        <div className={`text-xs font-semibold ${mod.color} mb-1`}>{mod.benefit}</div>
        <h3 className={`font-bold text-gray-900 mb-2 ${isLarge ? 'text-lg' : 'text-sm'}`}>{mod.title}</h3>
        <p className={`text-gray-500 leading-relaxed ${isLarge ? 'text-sm' : 'text-xs'}`}>{mod.useCase}</p>
      </div>
    </div>
  )
}

export default function HowItHelps() {
  const [titleRef, titleVisible] = useInView({ threshold: 0.2 })
  const large = modules.filter(m => m.size === 'large')
  const normal = modules.filter(m => m.size === 'normal')

  return (
    <section id="herramientas" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          ref={titleRef}
          className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-agro-green-50 border border-agro-green-100 rounded-full px-4 py-1.5 mb-5">
            <span className="text-agro-green-700 text-sm font-medium">Componentes de la solución</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Herramientas pensadas para la adopción real
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            La tecnología no sirve si no se usa. Por eso cada componente prioriza la simplicidad,
            el lenguaje natural y el aprendizaje gradual — para que el agricultor adopte sin esfuerzo.
          </p>
        </div>

        {/* Large cards — core 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          {large.map((mod, i) => (
            <ModuleCard key={mod.title} mod={mod} index={i} />
          ))}
        </div>

        {/* Normal cards — supporting */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {normal.map((mod, i) => (
            <ModuleCard key={mod.title} mod={mod} index={i + large.length} />
          ))}
        </div>

        {/* Note */}
        <div className="mt-10 bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-start max-w-3xl mx-auto shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-agro-green-50 flex items-center justify-center shrink-0 mt-0.5">
            <MessageSquare size={18} className="text-agro-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1">La conversación es la puerta de entrada</h4>
            <p className="text-gray-500 text-sm leading-relaxed">
              Un agricultor no necesita aprender a usar una plataforma. Solo necesita poder preguntarle
              a alguien de confianza, en su propio lenguaje, y recibir una respuesta útil.
              AgroHub UC hace exactamente eso.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
