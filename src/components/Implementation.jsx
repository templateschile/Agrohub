import { useInView } from '../hooks/useInView'
import { Rocket, Link, Cpu, Globe, Smartphone, GraduationCap, Heart } from 'lucide-react'

const phases = [
  {
    icon: Rocket,
    number: '01',
    title: 'Kickoff',
    duration: 'Semana 1',
    desc: 'Diagnóstico del territorio, reunión con el Centro Demostrativo y definición de objetivos.',
    color: 'text-agro-green-600',
    bg: 'bg-agro-green-50',
    border: 'border-agro-green-100',
  },
  {
    icon: Link,
    number: '02',
    title: 'Integración',
    duration: 'Semana 2–3',
    desc: 'Conexión de fuentes de información existentes: documentos, protocolos y bases de datos.',
    color: 'text-agro-blue-600',
    bg: 'bg-agro-blue-50',
    border: 'border-agro-blue-100',
  },
  {
    icon: Cpu,
    number: '03',
    title: 'Sensores',
    duration: 'Semana 3–4',
    desc: 'Instalación de sensores IoT en los predios priorizados. Calibración y primera lectura.',
    color: 'text-agro-earth-600',
    bg: 'bg-agro-earth-50',
    border: 'border-agro-earth-100',
  },
  {
    icon: Globe,
    number: '04',
    title: 'Despliegue web',
    duration: 'Semana 4',
    desc: 'Lanzamiento del panel de monitoreo y repositorio de documentos en la plataforma web.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
  },
  {
    icon: Smartphone,
    number: '05',
    title: 'App móvil',
    duration: 'Semana 5',
    desc: 'Onboarding de productores en la aplicación. Configuración de alertas y acceso personal.',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
  },
  {
    icon: GraduationCap,
    number: '06',
    title: 'Capacitación',
    duration: 'Semana 5–6',
    desc: 'Talleres prácticos para productores y técnicos. Uso guiado de la plataforma en terreno.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    icon: Heart,
    number: '07',
    title: 'Acompañamiento continuo',
    duration: 'Mes 2 en adelante',
    desc: 'Soporte activo, mejoras iterativas y seguimiento mensual del uso y los resultados.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
  },
]

function PhaseCard({ phase, index }) {
  const [ref, visible] = useInView({ threshold: 0.1 })
  const Icon = phase.icon
  return (
    <div
      ref={ref}
      className={`flex flex-col transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <div className="flex justify-center mb-4 relative z-10">
        <div className={`w-20 h-20 rounded-2xl ${phase.bg} border ${phase.border} flex flex-col items-center justify-center shadow-sm`}>
          <Icon size={22} className={phase.color} />
          <span className={`text-xs font-bold ${phase.color} mt-1`}>{phase.number}</span>
        </div>
      </div>
      <div className="text-center px-1">
        <div className={`text-[10px] font-semibold uppercase tracking-wider ${phase.color} mb-1`}>
          {phase.duration}
        </div>
        <h3 className="font-semibold text-gray-900 text-sm mb-2">{phase.title}</h3>
        <p className="text-gray-500 text-xs leading-relaxed">{phase.desc}</p>
      </div>
    </div>
  )
}

export default function Implementation() {
  const [titleRef, titleVisible] = useInView({ threshold: 0.2 })

  return (
    <section id="implementacion" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          ref={titleRef}
          className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-agro-earth-50 border border-agro-earth-100 rounded-full px-4 py-1.5 mb-5">
            <span className="text-agro-earth-700 text-sm font-medium">Proceso de implementación</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            De cero a operativo en 6 semanas
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Un proceso claro, sin sorpresas. Acompañamos cada fase para asegurar que el territorio
            adopte la plataforma de forma gradual y sostenible.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-agro-green-100 via-agro-earth-200 to-rose-100" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6">
            {phases.map((phase, i) => (
              <PhaseCard key={phase.number} phase={phase} index={i} />
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="mt-14 bg-agro-green-50 border border-agro-green-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center max-w-4xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-agro-green-600 flex items-center justify-center shrink-0">
            <Heart size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-agro-green-900 text-lg mb-1">El acompañamiento no termina</h3>
            <p className="text-agro-green-700 leading-relaxed">
              A diferencia de los proyectos tradicionales, AgroHub no tiene una fecha de cierre.
              El soporte continúa activo y el modelo crece con el territorio.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
