import { Droplets, Cpu, Database, Activity, TrendingUp, Users } from 'lucide-react'
import { useInView } from '../hooks/useInView'

const problems = [
  { icon: Droplets,   color: 'text-agro-blue-500', bg: 'bg-agro-blue-50',   title: 'Escasez hidrica',           stat: '4%',   sub: 'monitorea humedad del suelo' },
  { icon: Activity,   color: 'text-rose-500',       bg: 'bg-rose-50',        title: 'Riego ineficiente',         stat: '<15%', sub: 'usa datos para regar' },
  { icon: Cpu,        color: 'text-agro-earth-600', bg: 'bg-agro-earth-50',  title: 'Baja adopcion tecnologica', stat: '<10%', sub: 'usa plataformas digitales' },
  { icon: Database,   color: 'text-agro-green-600', bg: 'bg-agro-green-50',  title: 'Informacion dispersa',      stat: '0',    sub: 'registros centralizados' },
  { icon: TrendingUp, color: 'text-purple-600',     bg: 'bg-purple-50',      title: 'Sin salida comercial',      stat: '92%',  sub: 'sin estrategia comercial' },
  { icon: Users,      color: 'text-teal-600',       bg: 'bg-teal-50',        title: 'Actores descoordinados',    stat: '-',    sub: 'sin plataforma comun' },
]

function Card({ p, i }) {
  const [ref, visible] = useInView({ threshold: 0.1 })
  const Icon = p.icon
  return (
    <div
      ref={ref}
      className={`card-hover bg-white border border-gray-100 rounded-2xl p-5 flex gap-4 items-center transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
      style={{ transitionDelay: `${(i % 3) * 80}ms` }}
    >
      <div className={`w-10 h-10 rounded-xl ${p.bg} flex items-center justify-center shrink-0`}>
        <Icon size={18} className={p.color} />
      </div>
      <div>
        <div className="font-semibold text-gray-800 text-sm">{p.title}</div>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className={`text-base font-bold ${p.color}`}>{p.stat}</span>
          <span className="text-gray-400 text-xs">{p.sub}</span>
        </div>
      </div>
    </div>
  )
}

export default function Problems() {
  const [ref, visible] = useInView({ threshold: 0.2 })

  return (
    <section id="desafio" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-14">
        <div
          ref={ref}
          className={`max-w-xl mx-auto text-center mb-10 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-full px-4 py-1.5 mb-4">
            <span className="text-rose-500 text-sm font-medium">Diagnostico agricola</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Los desafios que AgroHub resuelve
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {problems.slice(0, 3).map((p, i) => <Card key={p.title} p={p} i={i} />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {problems.slice(3, 5).map((p, i) => <Card key={p.title} p={p} i={i} />)}
          <div className="bg-agro-green-700 rounded-2xl p-5 flex flex-col justify-between">
            <p className="font-semibold text-white text-sm leading-snug mb-3">
              Respuesta integrada a cada problematica del territorio agricola.
            </p>
            <a href="#modelo" className="text-agro-green-300 text-sm font-semibold hover:text-white transition-colors">
              Ver el modelo ->
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
