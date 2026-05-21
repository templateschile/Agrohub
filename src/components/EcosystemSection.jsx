import { useInView } from '../hooks/useInView'
import { Sprout, GraduationCap, Building2, Users } from 'lucide-react'

const insights = [
  { value: 'Mas', label: 'Conocimiento acumulado', desc: 'Cada consulta enriquece la base para toda la red.' },
  { value: 'Inf', label: 'Aprendizaje continuo',   desc: 'El sistema mejora con cada agricultor que se suma.' },
  { value: '1-N', label: 'Modelo replicable',      desc: 'Instalable en cualquier territorio con contexto local.' },
]

const actors = [
  { icon: Sprout,        bg: 'bg-agro-green-100', color: 'text-agro-green-700', label: 'Agricultores',   sub: 'Usan y aportan' },
  { icon: GraduationCap, bg: 'bg-agro-earth-100', color: 'text-agro-earth-700', label: 'Tecnicos',       sub: 'Validan y acompanan' },
  { icon: Building2,     bg: 'bg-agro-blue-100',  color: 'text-agro-blue-700',  label: 'Instituciones',  sub: 'Estructuran conocimiento' },
  { icon: Users,         bg: 'bg-purple-100',      color: 'text-purple-700',     label: 'Asesores',       sub: 'Investigan y certifican' },
]

export default function EcosystemSection() {
  const [ref, visible] = useInView({ threshold: 0.15 })

  return (
    <section id="ecosistema" className="py-20 bg-agro-green-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-14">
        <div
          ref={ref}
          className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="max-w-xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Cada agricultor hace el sistema mas inteligente
            </h2>
            <p className="text-white/55 text-base">
              AgroHub es un ecosistema vivo. El conocimiento se acumula, las respuestas mejoran
              y el modelo escala a cualquier territorio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {insights.map((ins, i) => (
              <div
                key={ins.label}
                className="bg-white/8 border border-white/12 rounded-2xl p-6 text-center"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="stat-shimmer text-4xl font-extrabold mb-2">{ins.value}</div>
                <div className="text-white font-semibold text-sm mb-1">{ins.label}</div>
                <div className="text-white/45 text-xs leading-relaxed">{ins.desc}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {actors.map((a) => {
              const Icon = a.icon
              return (
                <div key={a.label} className="bg-white/6 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${a.bg} flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={a.color} />
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{a.label}</div>
                    <div className="text-white/40 text-xs">{a.sub}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

