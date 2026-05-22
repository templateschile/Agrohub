import { useInView } from '../hooks/useInView'

const DESAFIOS = [
  {
    n: '01',
    problema: 'Información técnica dispersa',
    solucion: 'Centraliza sensores, alertas, documentos, capacitaciones e historial productivo en una sola herramienta.',
  },
  {
    n: '02',
    problema: 'Baja alfabetización digital',
    solucion: 'Diseño simple, lenguaje comprensible y aprendizaje progresivo pensado para agricultores, no para especialistas.',
  },
  {
    n: '03',
    problema: 'Datos que nadie sabe interpretar',
    solucion: 'Transforma datos en decisiones: gráficos simples, alertas e IA que dice qué hacer, no solo qué pasó.',
  },
  {
    n: '04',
    problema: 'Sin acompañamiento post-instalación',
    solucion: 'Soporte técnico, asesor virtual IA y capacitación continua que acompañan todo el proceso de adopción.',
  },
  {
    n: '05',
    problema: 'Tecnología desconectada del campo',
    solucion: 'Diseñada desde la experiencia real: cultivos, tiempos y problemas del agricultor. La tecnología se adapta a la agricultura.',
  },
  {
    n: '06',
    problema: 'Fuentes de información no validadas',
    solucion: 'Conecta INIA, ODEPA, FIA, INDAP, CIREN, SAG y Centros Demostrativos en una fuente organizada y validada.',
  },
  {
    n: '07',
    problema: 'Cálculos manuales y errores de aplicación',
    solucion: 'Calculadoras integradas de fertilizantes, plaguicidas, herbicidas y conversión de dosis directamente en la app.',
  },
  {
    n: '08',
    problema: 'Sin canal de comercialización digital',
    solucion: 'Marketplace B2B que conecta productores con compradores, visibiliza productos y profesionaliza la oferta.',
  },
  {
    n: '09',
    problema: 'Capacitación desconectada de la práctica',
    solucion: 'Sensores, datos, IA, marketplace y capacitación integrados: el agricultor aprende usando herramientas reales sobre su propio sistema.',
  },
  {
    n: '10',
    problema: 'Proyectos que mueren al terminar',
    solucion: 'Seguimiento permanente, actualización de contenidos, comunidad digital y soporte que evoluciona con el agricultor.',
  },
]

function Card({ d, i }) {
  const [ref, visible] = useInView({ threshold: 0.1 })
  return (
    <div
      ref={ref}
      className={`group bg-white border border-gray-100 rounded-2xl p-5 flex gap-4 transition-all duration-500 hover:shadow-md hover:border-agro-green-200 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={{ transitionDelay: `${(i % 5) * 60}ms` }}
    >
      <span className="text-2xl font-black text-agro-green-100 group-hover:text-agro-green-200 transition-colors shrink-0 leading-none mt-0.5 select-none">
        {d.n}
      </span>
      <div>
        <div className="font-bold text-gray-900 text-sm mb-1">{d.problema}</div>
        <p className="text-gray-500 text-xs leading-relaxed">{d.solucion}</p>
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
          className={`max-w-xl mb-12 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-full px-4 py-1.5 mb-4">
            <span className="text-rose-500 text-sm font-medium">Diagnóstico agrícola</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            10 desafíos que AgroHub resuelve
          </h2>
          <p className="text-gray-500 text-base">
            Cada problema real del agricultor tiene una respuesta concreta en la plataforma.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {DESAFIOS.map((d, i) => <Card key={d.n} d={d} i={i} />)}
          {/* CTA card */}
          <div className="bg-agro-green-700 rounded-2xl p-5 flex flex-col justify-between">
            <p className="font-semibold text-white text-sm leading-snug mb-4">
              Una sola plataforma que responde a cada problemática del territorio agrícola.
            </p>
            <a href="#modelo" className="text-agro-green-300 text-sm font-semibold hover:text-white transition-colors">
              Ver cómo funciona →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

