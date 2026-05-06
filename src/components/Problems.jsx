import { Droplets, Cpu, Database, Activity, Users, Smartphone, TrendingUp } from 'lucide-react'
import { useInView } from '../hooks/useInView'

const problems = [
  {
    icon: Droplets,
    color: 'text-agro-blue-500',
    bg: 'bg-agro-blue-50',
    border: 'border-agro-blue-100',
    title: 'Escasez y mal uso del agua',
    text: 'El riego se realiza por intuición, sin datos de humedad ni historial climático.',
    stat: 'Solo 4%',
    statLabel: 'monitorea humedad del suelo',
  },
  {
    icon: Cpu,
    color: 'text-agro-earth-600',
    bg: 'bg-agro-earth-50',
    border: 'border-agro-earth-100',
    title: 'Baja adopción tecnológica',
    text: 'Las herramientas digitales existen, pero no se adaptan al contexto real del productor.',
    stat: '< 10%',
    statLabel: 'usa sensores o plataformas digitales',
  },
  {
    icon: Database,
    color: 'text-agro-green-600',
    bg: 'bg-agro-green-50',
    border: 'border-agro-green-100',
    title: 'Información dispersa',
    text: 'El conocimiento técnico queda en documentos físicos, correos o en la memoria de los extensionistas.',
    stat: '0 registros',
    statLabel: 'centralizados en la mayoría de predios',
  },
  {
    icon: Activity,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    title: 'Bajo monitoreo de campo',
    text: 'Sin datos en tiempo real, las decisiones se toman tarde y con alta incertidumbre.',
    stat: '< 5%',
    statLabel: 'tiene monitoreo continuo de variables',
  },
  {
    icon: Users,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    title: 'Sin continuidad del apoyo',
    text: 'El seguimiento técnico termina al finalizar el proyecto o el taller. El productor queda solo.',
    stat: '0 canales',
    statLabel: 'de consulta activa post-capacitación',
  },
  {
    icon: Smartphone,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    title: 'Baja alfabetización digital',
    text: 'Muchos productores no tienen acceso o confianza para usar herramientas digitales complejas.',
    stat: 'Alta',
    statLabel: 'brecha digital en zonas rurales',
  },
  {
    icon: TrendingUp,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    title: 'Sin estrategia comercial',
    text: 'La producción mejora, pero la comercialización sigue siendo informal y sin planificación.',
    stat: '92%',
    statLabel: 'no posee estrategia comercial formal',
  },
]

function ProblemCard({ problem, index }) {
  const [ref, visible] = useInView({ threshold: 0.15 })
  const Icon = problem.icon
  return (
    <div
      ref={ref}
      className={`card-hover rounded-2xl border ${problem.border} bg-white p-6 flex flex-col gap-4 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className={`w-11 h-11 rounded-xl ${problem.bg} flex items-center justify-center`}>
        <Icon size={22} className={problem.color} />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 text-base mb-1.5">{problem.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{problem.text}</p>
      </div>
      <div className={`mt-auto pt-4 border-t border-gray-100`}>
        <div className={`text-xl font-bold ${problem.color}`}>{problem.stat}</div>
        <div className="text-xs text-gray-400 mt-0.5">{problem.statLabel}</div>
      </div>
    </div>
  )
}

export default function Problems() {
  const [titleRef, titleVisible] = useInView({ threshold: 0.2 })

  return (
    <section id="desafio" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          ref={titleRef}
          className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-full px-4 py-1.5 mb-5">
            <span className="text-rose-500 text-sm font-medium">El contexto real</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Los desafíos que enfrenta el agricultor hoy
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            No son problemas de tecnología. Son problemas de acompañamiento, continuidad y adaptación.
            AgroHub fue diseñado para responder a cada uno de ellos.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {problems.map((p, i) => (
            <ProblemCard key={p.title} problem={p} index={i} />
          ))}
          {/* Closing message card */}
          <div className="card-hover rounded-2xl bg-agro-green-700 p-6 flex flex-col justify-between text-white col-span-1">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" fill="white" opacity="0.7"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-lg leading-snug">
                AgroHub integra respuesta a cada uno de estos desafíos.
              </p>
              <p className="text-white/70 text-sm mt-2 leading-relaxed">
                Sin reemplazar lo que funciona. Acompañando su evolución.
              </p>
            </div>
            <a
              href="#modelo"
              className="mt-6 inline-block text-center bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm font-semibold py-2.5 px-5 rounded-full transition-colors"
            >
              Ver el modelo →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
