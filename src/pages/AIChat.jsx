import Platform from '../components/Platform'
import { useInView } from '../hooks/useInView'
import { MessageSquare, BookOpen, Wifi, CheckCircle, Database, Globe } from 'lucide-react'

const sources = [
              { icon: BookOpen, label: 'Protocolos técnicos',      desc: 'Documentos validados por agrónomos y especialistas.' },
  { icon: Wifi,     label: 'Sensores en tiempo real',  desc: 'Humedad, temperatura, evapotranspiración en vivo.' },
  { icon: Database, label: 'Historial del predio',      desc: 'Datos propios acumulados de temporadas anteriores.' },
  { icon: Globe,    label: 'Fuentes externas',          desc: 'APIs meteorológicas, alertas SAG y datos públicos.' },
]

const useCases = [
  { q: 'Cuándo riego mis tomates esta semana?',    a: 'Riego hoy 12:00 hrs · 50 min. Humedad 28%, lluvia mañana 5mm.' },
  { q: '¿Qué dosis de fertilizante aplico en maíz?', a: 'Según historial de suelo: 80 kg/ha de Urea. Aplicar post emergencia.' },
  { q: '¿Hay riesgo de helada este fin de semana?', a: 'Sí. Temperatura mínima 1°C el sábado. Recomiendo protección nocturna.' },
  { q: '¿Cómo mejoro el rendimiento de mi vid?',    a: 'Déficit hídrico moderado detectado. Ajustar riego y revisar nutrición foliar.' },
]

export default function AIChat() {
  const [ref, visible] = useInView({ threshold: 0.15 })
  const [casesRef, casesVisible] = useInView({ threshold: 0.1 })

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-agro-green-900 to-agro-green-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <MessageSquare size={13} className="text-agro-green-300" />
            <span className="text-white/85 text-sm font-medium">AI Chat agrícola</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 max-w-2xl">
            Pregunta como hablas. <span className="text-agro-green-300">Recibe como necesitas.</span>
          </h1>
          <p className="text-white/65 text-xl max-w-xl leading-relaxed">
            El asistente de IA de AgroHub responde con datos reales de tu predio, fuentes validadas
            y contexto técnico. Sin tecnicismos innecesarios.
          </p>
        </div>
      </section>

      {/* Platform demo */}
      <Platform />

      {/* Fuentes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div
            ref={ref}
            className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="max-w-xl mx-auto text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Fuentes que alimentan la IA</h2>
              <p className="text-gray-500 text-sm">Cada respuesta cita su fuente. Nada inventado.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {sources.map((s, i) => {
                const Icon = s.icon
                return (
                  <div
                    key={s.label}
                    className="bg-white border border-gray-100 rounded-2xl p-6"
                    style={{ transitionDelay: `${i * 70}ms` }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-agro-green-50 flex items-center justify-center mb-4">
                      <Icon size={18} className="text-agro-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{s.label}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Casos de uso */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-14">
          <div
            ref={casesRef}
            className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="max-w-xl mx-auto text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Preguntas reales, respuestas concretas</h2>
            </div>
            <div className="flex flex-col gap-4">
              {useCases.map((c, i) => (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row gap-4"
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide shrink-0 pt-0.5">Agricultor</span>
                      <span className="text-gray-800 text-sm">{c.q}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold text-agro-green-600 uppercase tracking-wide shrink-0 pt-0.5">AgroHub</span>
                      <span className="text-gray-600 text-sm leading-relaxed">{c.a}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <CheckCircle size={14} className="text-agro-green-500" />
                    <span className="text-xs text-gray-400">Verificado</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
