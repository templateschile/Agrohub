import {
  MessageSquare, Wifi, FolderOpen, ShoppingBag,
  Bell, BookOpen, Smartphone, Monitor, MapPin
} from 'lucide-react'
import { useInView } from '../hooks/useInView'

const modules = [
  {
    icon: MessageSquare,
    color: 'text-agro-green-600',
    bg: 'bg-agro-green-50',
    title: 'Asistente Conversacional',
    benefit: 'Consultas 24/7',
    useCase: 'El productor pregunta "¿cuándo riego mis tomates?" y recibe respuesta técnica adaptada a sus datos de campo.',
  },
  {
    icon: Wifi,
    color: 'text-agro-blue-600',
    bg: 'bg-agro-blue-50',
    title: 'Sensores y Dashboards',
    benefit: 'Monitoreo en tiempo real',
    useCase: 'Humedad del suelo, temperatura y déficit hídrico visibles desde el celular. Sin visitar el predio.',
  },
  {
    icon: FolderOpen,
    color: 'text-agro-earth-600',
    bg: 'bg-agro-earth-50',
    title: 'Repositorio de Documentos',
    benefit: 'Conocimiento siempre disponible',
    useCase: 'Protocolos técnicos, fichas de cultivo y guías de riego accesibles desde cualquier dispositivo.',
  },
  {
    icon: ShoppingBag,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    title: 'Marketplace Agrícola',
    benefit: 'Conecta oferta y demanda',
    useCase: 'Productores publican su cosecha, compran insumos y contratan servicios técnicos en un solo lugar.',
  },
  {
    icon: Bell,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    title: 'Alertas y Recomendaciones',
    benefit: 'Decisiones a tiempo',
    useCase: 'Alerta de déficit hídrico moderado con recomendación: "Programar riego hoy 12:00 hrs."',
  },
  {
    icon: BookOpen,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    title: 'Capacitación y Guías',
    benefit: 'Aprendizaje continuo',
    useCase: 'Videos cortos, tutoriales y fichas técnicas organizados por cultivo, etapa y necesidad.',
  },
  {
    icon: Smartphone,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    title: 'App Móvil',
    benefit: 'Todo desde el campo',
    useCase: 'Interfaz simple pensada para agricultores. Sin tecnicismos, sin curvas de aprendizaje complejas.',
  },
  {
    icon: Monitor,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    title: 'Plataforma Web',
    benefit: 'Visión completa del territorio',
    useCase: 'Panel para técnicos e instituciones: ver todos los predios, sensores, alertas y actividad.',
  },
  {
    icon: MapPin,
    color: 'text-agro-green-700',
    bg: 'bg-agro-green-50',
    title: 'Hubs Replicables',
    benefit: 'Crecimiento territorial',
    useCase: 'El modelo AgroHub puede instalarse en cada Centro Demostrativo de la región con configuración local.',
  },
]

function ModuleCard({ mod, index }) {
  const [ref, visible] = useInView({ threshold: 0.1 })
  const Icon = mod.icon
  return (
    <div
      ref={ref}
      className={`card-hover group bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 cursor-default transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className={`w-12 h-12 rounded-xl ${mod.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
        <Icon size={22} className={mod.color} />
      </div>
      <div>
        <div className={`text-xs font-semibold ${mod.color} mb-1`}>{mod.benefit}</div>
        <h3 className="font-semibold text-gray-900 text-base mb-2">{mod.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{mod.useCase}</p>
      </div>
    </div>
  )
}

export default function HowItHelps() {
  const [titleRef, titleVisible] = useInView({ threshold: 0.2 })

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
            <span className="text-agro-green-700 text-sm font-medium">Módulos de la plataforma</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Las herramientas que acompañan cada etapa
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Cada módulo fue diseñado para resolver un problema real del productor y del técnico.
            Simples, prácticos, adaptables.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod, i) => (
            <ModuleCard key={mod.title} mod={mod} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
