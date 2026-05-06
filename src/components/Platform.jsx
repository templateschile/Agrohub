import { useInView } from '../hooks/useInView'
import { MessageSquare, Wifi, FolderOpen, Bell, CheckCircle, Star, BookOpen } from 'lucide-react'

/* ── Chat mockup ── */
const msgs = [
  { from: 'user', text: '¿Cuándo riego mis tomates esta semana?' },
  { from: 'bot',  text: 'Humedad actual 28% — bajo el umbral (35%). Riego hoy 12:00 hrs, 50 min. Mañana no: lluvia ~5mm prevista.', source: 'Sensor A + Protocolo Riego UC 2024' },
]

function ChatMock() {
  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-xl border border-gray-100 w-full max-w-xs">
      <div className="bg-agro-green-700 px-4 py-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-agro-green-300 rounded-full animate-pulse" />
        <span className="text-white text-xs font-semibold">AgroHub — Asistente</span>
      </div>
      <div className="p-4 flex flex-col gap-4">
        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.from === 'user' ? 'flex-row-reverse' : ''}`}>
            {m.from === 'bot' && (
              <div className="w-6 h-6 rounded-full bg-agro-green-600 flex items-center justify-center shrink-0 mt-1">
                <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3"><path d="M8 1L2 4.5v7L8 15l6-3.5v-7L8 1z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              </div>
            )}
            <div className="max-w-[80%] flex flex-col gap-1">
              <div className={`px-3 py-2 rounded-xl text-xs leading-relaxed ${
                m.from === 'bot'
                  ? 'bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-sm'
                  : 'bg-agro-green-600 text-white rounded-tr-none'
              }`}>{m.text}</div>
              {m.source && (
                <div className="flex items-center gap-1 pl-1">
                  <CheckCircle size={9} className="text-agro-green-500" />
                  <span className="text-[9px] text-gray-400 italic">{m.source}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4">
        <div className="bg-white border border-gray-200 rounded-xl flex items-center gap-2 px-3 py-2 shadow-sm">
          <span className="text-gray-400 text-xs flex-1">Escribe tu consulta…</span>
          <div className="w-5 h-5 bg-agro-green-600 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5"><path d="M2 6h8M7 3l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Docs mockup ── */
function DocsMock() {
  const docs = [
    { name: 'Protocolo Riego Tomate 2024', src: 'Validado UC', star: true, uses: '34 consultas' },
    { name: 'Guía Micorrizas – Valle Choapa', src: 'Experto UC', star: true, uses: '18 consultas' },
    { name: 'Historial hídrico Sector A', src: 'Datos propios', star: false, uses: 'Actualizado hoy' },
  ]
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 w-full max-w-xs">
      <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen size={14} className="text-agro-blue-600" />
          <span className="text-xs font-semibold text-gray-800">Base de conocimiento</span>
        </div>
        <span className="text-[10px] bg-agro-green-50 text-agro-green-700 font-semibold px-2 py-0.5 rounded-full">Fuentes verificadas</span>
      </div>
      {docs.map(d => (
        <div key={d.name} className="px-4 py-3 flex items-center gap-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 bg-agro-blue-50 rounded-lg flex items-center justify-center shrink-0">
            <BookOpen size={13} className="text-agro-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-800 truncate">{d.name}</div>
            <div className="text-[10px] text-gray-400">{d.src} · <span className="text-agro-green-600">{d.uses}</span></div>
          </div>
          <Star size={10} className={d.star ? 'text-amber-400 fill-amber-400 shrink-0' : 'text-gray-200 shrink-0'} />
        </div>
      ))}
    </div>
  )
}

/* ── Features strip ── */
const features = [
  { icon: MessageSquare, color: 'text-agro-green-600', bg: 'bg-agro-green-50', title: 'Conversación natural', desc: 'Lenguaje simple. Respuestas técnicas.' },
  { icon: Wifi,          color: 'text-agro-blue-600',  bg: 'bg-agro-blue-50',  title: 'Sensores en tiempo real', desc: 'Humedad, clima, evapotranspiración.' },
  { icon: Bell,          color: 'text-rose-500',        bg: 'bg-rose-50',        title: 'Alertas accionables', desc: 'Qué hacer, cuándo y cómo.' },
  { icon: FolderOpen,    color: 'text-agro-earth-600', bg: 'bg-agro-earth-50', title: 'Conocimiento centralizado', desc: 'Siempre disponible, siempre citado.' },
]

export default function Platform() {
  const [titleRef, titleVisible] = useInView({ threshold: 0.2 })

  return (
    <section id="conversacion" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-14">
        {/* Header */}
        <div
          ref={titleRef}
          className={`max-w-xl mx-auto text-center mb-14 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-agro-green-50 border border-agro-green-100 rounded-full px-4 py-1.5 mb-4">
            <MessageSquare size={13} className="text-agro-green-600" />
            <span className="text-agro-green-700 text-sm font-medium">La plataforma</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Pregunta como hablas.<br />Recibe como necesitas.
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            Respuestas en lenguaje simple, basadas en fuentes técnicas validadas y en los datos reales del predio.
          </p>
        </div>

        {/* Mockups */}
        <div className="flex flex-col sm:flex-row items-start justify-center gap-6 mb-14">
          <ChatMock />
          <DocsMock />
        </div>

        {/* Feature strip — 4 in a row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f, i) => {
            const [ref, vis] = useInView({ threshold: 0.1 })
            const Icon = f.icon
            return (
              <div
                key={f.title}
                ref={ref}
                className={`bg-gray-50 border border-gray-100 rounded-xl p-5 transition-all duration-500 ${
                  vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <div className={`w-9 h-9 rounded-lg ${f.bg} flex items-center justify-center mb-3`}>
                  <Icon size={16} className={f.color} />
                </div>
                <div className="font-semibold text-gray-900 text-sm mb-0.5">{f.title}</div>
                <div className="text-gray-400 text-xs">{f.desc}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
