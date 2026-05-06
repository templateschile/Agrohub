import { Droplets, Cpu, Database, Activity, Leaf, TrendingUp, BookOpen, Users, Network, Smartphone } from 'lucide-react'
import { useInView } from '../hooks/useInView'

const problems = [
  { icon: Droplets,   color: 'text-agro-blue-500', bg: 'bg-agro-blue-50',   title: 'Escasez hídrica',              stat: '4%',       statLabel: 'monitorea humedad del suelo' },
  { icon: Activity,   color: 'text-rose-500',       bg: 'bg-rose-50',        title: 'Riego ineficiente',            stat: '<15%',     statLabel: 'optimiza con datos' },
  { icon: Cpu,        color: 'text-agro-earth-600', bg: 'bg-agro-earth-50',  title: 'Brecha tecnológica',           stat: '<10%',     statLabel: 'usa plataformas digitales' },
  { icon: Smartphone, color: 'text-amber-500',      bg: 'bg-amber-50',       title: 'Baja adopción digital',        stat: 'Alta',     statLabel: 'brecha digital rural' },
  { icon: Leaf,       color: 'text-teal-600',       bg: 'bg-teal-50',        title: 'Suelos debilitados',           stat: 'Creciente',statLabel: 'degradación de suelos' },
  { icon: Database,   color: 'text-agro-green-600', bg: 'bg-agro-green-50',  title: 'Información dispersa',         stat: '0',        statLabel: 'registros centralizados' },
  { icon: TrendingUp, color: 'text-purple-600',     bg: 'bg-purple-50',      title: 'Sin estrategia comercial',     stat: '92%',      statLabel: 'sin estrategia formal' },
  { icon: Network,    color: 'text-agro-blue-600',  bg: 'bg-agro-blue-50',   title: 'Soluciones no escalables',     stat: 'Sin modelo',statLabel: 'de escalamiento' },
  { icon: BookOpen,   color: 'text-agro-earth-700', bg: 'bg-agro-earth-50',  title: 'Capacitación desconectada',    stat: 'Bajo',     statLabel: 'nivel de aplicación práctica' },
  { icon: Users,      color: 'text-agro-green-700', bg: 'bg-agro-green-50',  title: 'Actores descoordinados',       stat: 'Sin plataforma', statLabel: 'de coordinación' },
]

function ProblemCard({ p, index }) {
  const [ref, visible] = useInView({ threshold: 0.1 })
  const Icon = p.icon
  return (
    <div
      ref={ref}
      className={`card-hover bg-white border border-gray-100 rounded-2xl p-5 flex gap-4 items-start transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}
    >
      <div className={`w-10 h-10 rounded-xl ${p.bg} flex items-center justify-center shrink-0`}>
        <Icon size={18} className={p.color} />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-800 text-sm mb-1">{p.title}</h3>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-base font-bold ${p.color}`}>{p.stat}</span>
          <span className="text-gray-400 text-xs truncate">{p.statLabel}</span>
        </div>
      </div>
    </div>
  )
}

export default function Problems() {
  const [titleRef, titleVisible] = useInView({ threshold: 0.2 })

  /* Split into rows of 3+3+3+1 → show as 3 columns */
  const rows = [problems.slice(0,3), problems.slice(3,6), problems.slice(6,9)]
  const last = problems.slice(9)

  return (
    <section id="desafio" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-14">
        {/* Header */}
        <div
          ref={titleRef}
          className={`max-w-xl mx-auto text-center mb-12 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-full px-4 py-1.5 mb-4">
            <span className="text-rose-500 text-sm font-medium">Diagnóstico · Valle de Choapa</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Los desafíos que AgroHub UC responde
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            Cada problemática del territorio tiene una respuesta concreta dentro del Centro Demostrativo.
          </p>
        </div>

        {/* 3 rows of 3 cards */}
        {rows.map((row, ri) => (
          <div key={ri} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {row.map((p, i) => <ProblemCard key={p.title} p={p} index={i} />)}
          </div>
        ))}

        {/* Last row: 1 card + summary CTA */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {last.map((p, i) => <ProblemCard key={p.title} p={p} index={i} />)}
          <div className="col-span-2 bg-agro-green-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
            <div className="flex-1">
              <p className="font-semibold text-white text-base mb-1">AgroHub UC integra respuesta a cada uno.</p>
              <p className="text-white/60 text-sm">Tecnología, datos, personas y procesos unidos en un modelo funcional en terreno.</p>
            </div>
            <a
              href="#modelo"
              className="shrink-0 bg-white text-agro-green-800 font-semibold text-sm px-6 py-3 rounded-full hover:bg-agro-green-50 transition-colors"
            >
              Ver el modelo →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
