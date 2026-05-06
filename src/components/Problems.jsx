import {
  Droplets, Cpu, Database, Activity, Users,
  Smartphone, TrendingUp, Leaf, BookOpen, Network
} from 'lucide-react'
import { useInView } from '../hooks/useInView'

const problems = [
  {
    icon: Droplets,
    color: 'text-agro-blue-500',
    bg: 'bg-agro-blue-50',
    border: 'border-agro-blue-100',
    title: 'Escasez hídrica',
    text: 'El riego se realiza por intuición, sin datos de humedad, clima ni evapotranspiración.',
    solution: 'Medición de humedad, clima y ET para apoyar mejores decisiones de riego.',
    stat: 'Solo 4%',
    statLabel: 'monitorea humedad del suelo',
  },
  {
    icon: Activity,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    title: 'Baja eficiencia en el uso del agua',
    text: 'Sin información de terreno, el agua se aplica en exceso o en momentos equivocados.',
    solution: 'Visualización de datos en terreno y capacitación en manejo hídrico.',
    stat: '< 15%',
    statLabel: 'usa monitoreo para optimizar riego',
  },
  {
    icon: Cpu,
    color: 'text-agro-earth-600',
    bg: 'bg-agro-earth-50',
    border: 'border-agro-earth-100',
    title: 'Brecha tecnológica',
    text: 'Las herramientas digitales existen, pero no se adaptan al contexto real del productor.',
    solution: 'Uso progresivo de herramientas digitales con acompañamiento técnico.',
    stat: '< 10%',
    statLabel: 'usa plataformas digitales agrícolas',
  },
  {
    icon: Smartphone,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    title: 'Baja alfabetización digital',
    text: 'Muchos productores no tienen confianza ni acceso para usar herramientas digitales complejas.',
    solution: 'Plataforma simple, modular y con capacitación por etapas.',
    stat: 'Alta',
    statLabel: 'brecha digital en zonas rurales',
  },
  {
    icon: Leaf,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    title: 'Suelos con menor resiliencia',
    text: 'Suelos debilitados por sobreuso, falta de materia orgánica y manejo convencional.',
    solution: 'Implementación de micorrizas, bioinsumos y seguimiento agronómico.',
    stat: 'Creciente',
    statLabel: 'degradación de suelos productivos',
  },
  {
    icon: Database,
    color: 'text-agro-green-600',
    bg: 'bg-agro-green-50',
    border: 'border-agro-green-100',
    title: 'Información dispersa',
    text: 'El conocimiento técnico queda en documentos físicos, correos o en la memoria de los extensionistas.',
    solution: 'App centralizada con sensores, documentos, alertas, capacitaciones y registros.',
    stat: '0 registros',
    statLabel: 'centralizados en la mayoría de predios',
  },
  {
    icon: TrendingUp,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    title: 'Falta de comercialización directa',
    text: 'La producción mejora, pero la salida comercial sigue siendo informal y sin planificación.',
    solution: 'Marketplace para productos, servicios e insumos agrícolas.',
    stat: '92%',
    statLabel: 'no posee estrategia comercial formal',
  },
  {
    icon: Network,
    color: 'text-agro-blue-600',
    bg: 'bg-agro-blue-50',
    border: 'border-agro-blue-100',
    title: 'Dificultad para escalar soluciones',
    text: 'Las innovaciones quedan en un predio, sin un modelo replicable para otros agricultores.',
    solution: 'Validación en centros demostrativos y posterior réplica a otros agricultores.',
    stat: 'Sin modelo',
    statLabel: 'de escalamiento territorial',
  },
  {
    icon: BookOpen,
    color: 'text-agro-earth-700',
    bg: 'bg-agro-earth-50',
    border: 'border-agro-earth-100',
    title: 'Capacitaciones desconectadas de la práctica',
    text: 'Los talleres entregan conocimiento teórico que no siempre se traslada al trabajo real en terreno.',
    solution: 'Formación aplicada en terreno, con casos reales y lenguaje agrícola.',
    stat: 'Bajo',
    statLabel: 'nivel de aplicación post-capacitación',
  },
  {
    icon: Users,
    color: 'text-agro-green-700',
    bg: 'bg-agro-green-50',
    border: 'border-agro-green-100',
    title: 'Falta de coordinación entre actores',
    text: 'Agricultores, técnicos, instituciones y academia operan en silos sin espacio común.',
    solution: 'Espacio común para agricultores, técnicos, instituciones y academia.',
    stat: 'Sin plataforma',
    statLabel: 'de coordinación territorial',
  },
]

function ProblemCard({ problem, index }) {
  const [ref, visible] = useInView({ threshold: 0.12 })
  const Icon = problem.icon
  return (
    <div
      ref={ref}
      className={`card-hover rounded-2xl border ${problem.border} bg-white p-5 flex flex-col gap-4 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${index * 55}ms` }}
    >
      <div className={`w-11 h-11 rounded-xl ${problem.bg} flex items-center justify-center`}>
        <Icon size={20} className={problem.color} />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 text-sm mb-1.5">{problem.title}</h3>
        <p className="text-gray-500 text-xs leading-relaxed">{problem.text}</p>
      </div>
      {/* Solution hint */}
      <div className="bg-agro-green-50 border border-agro-green-100 rounded-xl p-3">
        <div className="text-[10px] text-agro-green-600 font-semibold uppercase tracking-wider mb-1">AgroHub UC responde</div>
        <p className="text-agro-green-800 text-xs leading-relaxed">{problem.solution}</p>
      </div>
      <div className="mt-auto pt-3 border-t border-gray-100">
        <div className={`text-lg font-bold ${problem.color}`}>{problem.stat}</div>
        <div className="text-[10px] text-gray-400 mt-0.5">{problem.statLabel}</div>
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
            <span className="text-rose-500 text-sm font-medium">Diagnóstico del Valle de Choapa</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Las problemáticas reales que AgroHub UC enfrenta
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            El diagnóstico del Valle de Choapa muestra una necesidad clara. Cada problemática
            tiene una respuesta concreta dentro del Centro Demostrativo AgroHub UC.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {problems.slice(0, 8).map((p, i) => (
            <ProblemCard key={p.title} problem={p} index={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {problems.slice(8).map((p, i) => (
            <ProblemCard key={p.title} problem={p} index={i + 8} />
          ))}
          {/* Summary card */}
          <div className="card-hover rounded-2xl bg-agro-green-700 p-6 flex flex-col justify-between text-white">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" fill="white" opacity="0.7"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-base leading-snug mb-2">
                AgroHub UC integra respuesta a cada uno de estos desafíos.
              </p>
              <p className="text-white/65 text-sm leading-relaxed">
                Tecnología, datos, personas y procesos unidos en un solo modelo funcional en terreno.
              </p>
            </div>
            <a
              href="#modelo"
              className="mt-5 inline-block text-center bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm font-semibold py-2.5 px-5 rounded-full transition-colors"
            >
              Ver el Centro Demostrativo →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
