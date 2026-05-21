import { useInView } from '../hooks/useInView'
import { Calendar, MapPin, Users, Clock, Tag, ChevronRight } from 'lucide-react'

const events = [
  {
    date: 'Jun 14, 2025',
    title: 'Taller: Uso de sensores IoT en riego tecnificado',
    type: 'Capacitación',
    location: 'Hub Móvil — Zona Norte',
    duration: '4 horas',
    spots: 20,
    spotsLeft: 7,
    color: 'bg-agro-green-50 border-agro-green-100 text-agro-green-700',
  },
  {
    date: 'Jun 21, 2025',
    title: 'Demostración en terreno: IA aplicada al diagnóstico agrícola',
    type: 'Demostración',
    location: 'Hub Móvil — Zona Centro',
    duration: '3 horas',
    spots: 15,
    spotsLeft: 3,
    color: 'bg-agro-blue-50 border-agro-blue-100 text-agro-blue-700',
  },
  {
    date: 'Jul 5, 2025',
    title: 'Webinar: Comercialización B2B para pequeños productores',
    type: 'Webinar',
    location: 'Online',
    duration: '2 horas',
    spots: 100,
    spotsLeft: 45,
    color: 'bg-purple-50 border-purple-100 text-purple-700',
  },
  {
    date: 'Jul 19, 2025',
    title: 'Workshop: Gestión de documentos y protocolos en AgroHub',
    type: 'Workshop',
    location: 'Hub Móvil — Zona Sur',
    duration: '3 horas',
    spots: 25,
    spotsLeft: 12,
    color: 'bg-amber-50 border-amber-100 text-amber-700',
  },
]

const categories = ['Todos', 'Capacitación', 'Demostración', 'Webinar', 'Workshop']

export default function Eventos() {
  const [ref, visible] = useInView({ threshold: 0.1 })

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-agro-green-900 to-agro-green-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Calendar size={13} className="text-agro-green-300" />
            <span className="text-white/85 text-sm font-medium">Eventos y Capacitaciones</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 max-w-2xl">
            Aprende en terreno. <span className="text-agro-green-300">Crece con el hub.</span>
          </h1>
          <p className="text-white/65 text-xl max-w-xl leading-relaxed">
            Talleres, demostraciones y webinars para agricultores, técnicos y asesores.
            El hub se mueve hacia ti.
          </p>
        </div>
      </section>

      {/* Filters + Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-14">
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Event cards */}
          <div
            ref={ref}
                        className={`flex flex-col gap-4 transition-all duration-700`}
          >
            {events.map((e, i) => (
              <div
                key={e.title}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Date block */}
                  <div className="bg-agro-green-50 border border-agro-green-100 rounded-xl px-4 py-3 text-center shrink-0 min-w-[80px]">
                    <div className="text-agro-green-700 text-xs font-semibold">{e.date.split(' ')[0]}</div>
                    <div className="text-agro-green-900 text-2xl font-extrabold leading-none">{e.date.split(' ')[1].replace(',', '')}</div>
                    <div className="text-agro-green-600 text-xs">{e.date.split(' ')[2]}</div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${e.color}`}>
                        {e.type}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-3">{e.title}</h3>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-gray-400" />
                        {e.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-gray-400" />
                        {e.duration}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={12} className="text-gray-400" />
                        {e.spotsLeft} lugares disponibles
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="shrink-0 flex items-center">
                    <button className="flex items-center gap-2 bg-agro-green-600 hover:bg-agro-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
                      Inscribirse <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
