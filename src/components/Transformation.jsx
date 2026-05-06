import { useInView } from '../hooks/useInView'

const levels = [
  {
    step: '01',
    label: 'Kit tecnológico',
    desc: 'Equipos e instrumentos instalados.',
    outcome: 'Genera datos',
    active: false,
  },
  {
    step: '02',
    label: 'Centro Demostrativo',
    desc: 'Uso práctico con capacitación y acompañamiento.',
    outcome: 'Genera aprendizaje',
    active: false,
  },
  {
    step: '03',
    label: 'AgroHub',
    desc: 'Tecnología, datos, personas, procesos y comercialización integrados.',
    outcome: 'Genera decisiones e impacto',
    active: true,
  },
]

const elements = [
  { emoji: '📡', label: 'Tecnología',     sub: 'Sensores, plataforma, IA' },
  { emoji: '📊', label: 'Datos',          sub: 'Humedad, clima, historial' },
  { emoji: '👥', label: 'Personas',       sub: 'Agricultores, técnicos, UC' },
  { emoji: '⚙️', label: 'Procesos',       sub: 'Capacitación, decisiones' },
]

export default function Transformation() {
  const [ref, visible] = useInView({ threshold: 0.15 })

  return (
    <section id="modelo" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-14">
        <div
          ref={ref}
          className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Header */}
          <div className="max-w-xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-agro-green-50 border border-agro-green-100 rounded-full px-4 py-1.5 mb-4">
              <span className="text-agro-green-700 text-sm font-medium">El modelo</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Más que un kit tecnológico
            </h2>
            <p className="text-gray-500 text-base">
              AgroHub integra los cuatro elementos que transforman instrumentos en impacto real.
            </p>
          </div>

          {/* 3-level ladder */}
          <div className="flex flex-col md:flex-row max-w-4xl mx-auto rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-12">
            {levels.map((l, i) => (
              <div
                key={l.label}
                className={`flex-1 p-6 flex flex-col gap-2 border-b md:border-b-0 md:border-r last:border-0 border-gray-100 ${
                  l.active ? 'bg-agro-green-700' : 'bg-gray-50'
                }`}
              >
                <span className={`text-xs font-bold uppercase tracking-widest ${l.active ? 'text-agro-green-300' : 'text-gray-400'}`}>
                  Nivel {l.step}
                </span>
                <h3 className={`font-bold text-lg ${l.active ? 'text-white' : 'text-gray-600'}`}>{l.label}</h3>
                <p className={`text-sm flex-1 ${l.active ? 'text-white/70' : 'text-gray-400'}`}>{l.desc}</p>
                <div className={`flex items-center gap-2 text-sm font-semibold pt-2 ${l.active ? 'text-agro-green-300' : 'text-gray-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${l.active ? 'bg-agro-green-300' : 'bg-gray-300'}`} />
                  {l.outcome}
                </div>
              </div>
            ))}
          </div>

          {/* 4 elements */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {elements.map((el, i) => (
              <div
                key={el.label}
                className="bg-gray-50 border border-gray-100 rounded-xl p-5 text-center"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="text-2xl mb-2">{el.emoji}</div>
                <div className="font-bold text-gray-900 text-sm mb-0.5">{el.label}</div>
                <div className="text-gray-400 text-xs">{el.sub}</div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400 text-sm mt-6 italic">
            "El instrumento mide. El dato orienta. El técnico acompaña. El agricultor decide."
          </p>
        </div>
      </div>
    </section>
  )
}
