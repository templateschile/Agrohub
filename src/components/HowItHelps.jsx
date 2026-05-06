import {
  MessageSquare, Wifi, FolderOpen, ShoppingBag,
  Bell, BookOpen, Smartphone, Monitor, Leaf, BarChart2
} from 'lucide-react'
import { useInView } from '../hooks/useInView'

const modules = [
  {
    icon: Wifi,
    color: 'text-agro-blue-600',
    bg: 'bg-agro-blue-50',
    title: 'Sensores e Instrumentos',
    benefit: 'El instrumento mide',
    useCase: 'Humedad del suelo, temperatura, viento, evapotranspiración y alertas. Información de campo que antes era invisible.',
  },
  {
    icon: BarChart2,
    color: 'text-agro-green-600',
    bg: 'bg-agro-green-50',
    title: 'Dashboard de Monitoreo',
    benefit: 'El dato orienta',
    useCase: 'Visualización simple de variables productivas en tiempo real. El agricultor entiende qué ocurre sin necesidad de intermediarios.',
  },
  {
    icon: MessageSquare,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    title: 'Asistente con IA',
    benefit: 'Consultas 24/7',
    useCase: 'El agricultor pregunta "¿cuándo riego mis tomates?" y recibe respuesta técnica adaptada a sus datos de campo en segundos.',
  },
  {
    icon: Bell,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    title: 'Alertas y Recomendaciones',
    benefit: 'Decisiones a tiempo',
    useCase: 'Alerta de déficit hídrico moderado con recomendación práctica: "Programar riego hoy 12:00 hrs por 50 minutos."',
  },
  {
    icon: FolderOpen,
    color: 'text-agro-earth-600',
    bg: 'bg-agro-earth-50',
    title: 'Repositorio de Documentos',
    benefit: 'Conocimiento siempre disponible',
    useCase: 'Protocolos técnicos, fichas de cultivo y guías de riego accesibles desde cualquier dispositivo, en cualquier momento.',
  },
  {
    icon: BookOpen,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    title: 'Capacitación por Etapas',
    benefit: 'Adopción gradual',
    useCase: 'Videos cortos, tutoriales y fichas técnicas organizados por cultivo, etapa y nivel de adopción tecnológica.',
  },
  {
    icon: ShoppingBag,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    title: 'Marketplace Agrícola',
    benefit: 'La mejora productiva tiene salida comercial',
    useCase: 'Agricultores publican cosechas, ofrecen servicios, acceden a insumos y conectan con compradores en un solo lugar.',
  },
  {
    icon: Leaf,
    color: 'text-agro-green-700',
    bg: 'bg-agro-green-50',
    title: 'Micorrizas y Bioinsumos',
    benefit: 'Resiliencia biológica',
    useCase: 'Fortalecimiento del sistema suelo-planta. Implementación con seguimiento técnico y validación en terreno.',
  },
  {
    icon: Smartphone,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    title: 'App Móvil',
    benefit: 'Todo desde el campo',
    useCase: 'Interfaz simple pensada para el agricultor real. Sin tecnicismos, sin curvas complejas. La herramienta respeta sus tiempos.',
  },
  {
    icon: Monitor,
    color: 'text-agro-blue-700',
    bg: 'bg-agro-blue-50',
    title: 'Plataforma Web',
    benefit: 'Visión completa del territorio',
    useCase: 'Panel para técnicos e instituciones: ver todos los predios, sensores, alertas y actividad en un solo lugar.',
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
      style={{ transitionDelay: `${index * 45}ms` }}
    >
      <div className={`w-12 h-12 rounded-xl ${mod.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
        <Icon size={22} className={mod.color} />
      </div>
      <div>
        <div className={`text-xs font-semibold ${mod.color} mb-1`}>{mod.benefit}</div>
        <h3 className="font-semibold text-gray-900 text-sm mb-2">{mod.title}</h3>
        <p className="text-gray-500 text-xs leading-relaxed">{mod.useCase}</p>
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
            <span className="text-agro-green-700 text-sm font-medium">Componentes de la solución</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Las herramientas que acompañan cada necesidad
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Cada componente fue diseñado para responder a un problema real del agricultor y del técnico.
            Técnicamente robusto, visualmente simple.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {modules.map((mod, i) => (
            <ModuleCard key={mod.title} mod={mod} index={i} />
          ))}
        </div>

        {/* Note */}
        <div className="mt-10 bg-white border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-start max-w-3xl mx-auto shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-agro-green-50 flex items-center justify-center shrink-0 mt-0.5">
            <Leaf size={18} className="text-agro-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1">Diseño centrado en el usuario principal: el agricultor del Valle de Choapa</h4>
            <p className="text-gray-500 text-sm leading-relaxed">
              El diseño respeta su lenguaje, sus tiempos, su realidad productiva y su forma de aprender.
              La tecnología acompaña la experiencia agrícola, no la reemplaza.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
