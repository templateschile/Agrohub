import { useInView } from '../hooks/useInView'
import { MessageSquare, FolderOpen, Star, BookOpen, CheckCircle, Wifi } from 'lucide-react'

/* ── Chat mockup ─────────────────────────────────────────────── */
const conversation = [
  { from: 'user', text: '¿Cuándo debería regar mis tomates esta semana?', time: '09:12' },
  {
    from: 'bot',
    text: 'Según el sensor del Sector A, la humedad del suelo está en 28% — bajo el umbral recomendado (35–45%). Te recomiendo regar hoy entre 12:00 y 13:00 hrs por 50 minutos.',
    time: '09:12',
    source: 'Datos sensor + Protocolo Riego Tomate 2024',
  },
  { from: 'user', text: '¿Y si llueve mañana?', time: '09:13' },
  {
    from: 'bot',
    text: 'El pronóstico indica lluvias leves (~5mm) para el jueves. Con ese aporte, puedes cancelar el riego del viernes. Te aviso si cambia el pronóstico.',
    time: '09:13',
    source: 'Pronóstico meteorológico + historial hídrico del predio',
  },
]

function ChatBubble({ msg }) {
  const isBot = msg.from === 'bot'
  return (
    <div className={`flex gap-2 ${isBot ? '' : 'flex-row-reverse'}`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-agro-green-600 flex items-center justify-center shrink-0 mt-1">
          <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
            <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      <div className="max-w-[80%] flex flex-col gap-1">
        <div className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
          isBot
            ? 'bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-sm'
            : 'bg-agro-green-600 text-white rounded-tr-none'
        }`}>
          {msg.text}
        </div>
        {msg.source && (
          <div className="flex items-center gap-1 pl-1">
            <CheckCircle size={10} className="text-agro-green-500" />
            <span className="text-[10px] text-gray-400 italic">{msg.source}</span>
          </div>
        )}
        <div className={`text-[10px] ${isBot ? 'text-gray-400 pl-1' : 'text-right text-white/60'}`}>{msg.time}</div>
      </div>
    </div>
  )
}

function MockChat() {
  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-2xl border border-gray-100 w-full max-w-sm">
      <div className="bg-agro-green-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-agro-green-300 rounded-full animate-pulse" />
          <span className="text-white text-xs font-semibold">AgroHub UC — Asistente técnico</span>
        </div>
        <span className="text-white/50 text-[10px]">En línea</span>
      </div>
      <div className="p-4 flex flex-col gap-4 min-h-[300px]">
        {conversation.map((msg, i) => (
          <ChatBubble key={i} msg={msg} />
        ))}
      </div>
      <div className="px-4 pb-4">
        <div className="bg-white border border-gray-200 rounded-xl flex items-center gap-2 px-3 py-2.5 shadow-sm">
          <span className="text-gray-400 text-xs flex-1">Escribe tu consulta…</span>
          <div className="w-6 h-6 bg-agro-green-600 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Knowledge base mockup ───────────────────────────────────── */
function MockKnowledgeBase() {
  const docs = [
    { name: 'Protocolo Riego Tomate 2024', type: 'Validado en terreno', starred: true, uses: '34 consultas' },
    { name: 'Guía Manejo de Micorrizas', type: 'Experto UC', starred: true, uses: '18 consultas' },
    { name: 'Ficha Cultivo Berries – Choapa', type: 'Territorio', starred: false, uses: '27 consultas' },
    { name: 'Historial hídrico Sector A', type: 'Datos propios', starred: false, uses: 'Actualizado hoy' },
    { name: 'Manual Sensores IoT', type: 'Capacitación', starred: false, uses: '12 consultas' },
  ]
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 w-full max-w-xs">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen size={16} className="text-agro-blue-600" />
          <span className="text-sm font-semibold text-gray-800">Base de conocimiento</span>
        </div>
        <span className="text-[10px] text-agro-green-600 font-semibold bg-agro-green-50 px-2 py-0.5 rounded-full">
          {docs.length} fuentes
        </span>
      </div>
      <div className="divide-y divide-gray-50">
        {docs.map(doc => (
          <div key={doc.name} className="px-5 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-agro-blue-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <BookOpen size={13} className="text-agro-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-800 leading-snug mb-0.5">{doc.name}</div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400">{doc.type}</span>
                <span className="text-[10px] text-agro-green-600 font-medium">{doc.uses}</span>
              </div>
            </div>
            <Star size={11} className={doc.starred ? 'text-amber-400 fill-amber-400 shrink-0 mt-1' : 'text-gray-200 shrink-0 mt-1'} />
          </div>
        ))}
      </div>
      <div className="p-4 bg-agro-green-50 border-t border-agro-green-100">
        <p className="text-agro-green-700 text-[11px] leading-relaxed">
          El asistente responde <strong>solo con fuentes validadas</strong> — documentos técnicos, datos del predio y conocimiento del territorio.
        </p>
      </div>
    </div>
  )
}

/* ── Sensor summary panel ────────────────────────────────────── */
function MockSensors() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 w-full max-w-[220px]">
      <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
        <Wifi size={14} className="text-agro-blue-500" />
        <span className="text-xs font-semibold text-gray-800">Sensores activos</span>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {[
          { label: 'Humedad Sector A', value: '28%', status: 'Bajo', dot: 'bg-rose-400' },
          { label: 'Humedad Sector B', value: '41%', status: 'Normal', dot: 'bg-agro-green-400' },
          { label: 'Temp. ambiente', value: '24°C', status: 'Normal', dot: 'bg-agro-green-400' },
          { label: 'Viento', value: '12 km/h', status: 'Calma', dot: 'bg-agro-blue-400' },
        ].map(s => (
          <div key={s.label} className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-gray-500">{s.label}</div>
              <div className="text-sm font-bold text-gray-800">{s.value}</div>
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              <span className="text-[10px] text-gray-400">{s.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Section ─────────────────────────────────────────────────── */
export default function Platform() {
  const [titleRef, titleVisible] = useInView({ threshold: 0.2 })

  return (
    <section id="conversacion" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          ref={titleRef}
          className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-agro-green-50 border border-agro-green-100 rounded-full px-4 py-1.5 mb-5">
            <MessageSquare size={13} className="text-agro-green-600" />
            <span className="text-agro-green-700 text-sm font-medium">Conversación simple, respuestas confiables</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pregunta como hablas. Recibe como necesitas.
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            El agricultor no necesita aprender tecnología. Solo necesita hacer su pregunta.
            AgroHub UC responde en lenguaje simple, apoyado en fuentes técnicas validadas
            por expertos y en los datos reales del predio.
          </p>
        </div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
          {/* Chat — hero */}
          <div className="flex flex-col items-center gap-4 flex-1 max-w-sm">
            <MockChat />
            <div className="text-center">
              <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                Disponible 24/7 · Responde en segundos · Aprende con cada interacción
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6 items-center lg:items-start">
            <MockKnowledgeBase />
            <MockSensors />
          </div>
        </div>

        {/* Trust pillars */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {[
            {
              icon: CheckCircle,
              color: 'text-agro-green-600',
              bg: 'bg-agro-green-50',
              title: 'Fuentes verificadas',
              desc: 'Cada respuesta cita la fuente: protocolo técnico, dato del sensor o experiencia del territorio.',
            },
            {
              icon: BookOpen,
              color: 'text-agro-blue-600',
              bg: 'bg-agro-blue-50',
              title: 'Conocimiento local',
              desc: 'Las respuestas no son genéricas. Se construyen sobre el contexto real del Valle de Choapa.',
            },
            {
              icon: MessageSquare,
              color: 'text-amber-600',
              bg: 'bg-amber-50',
              title: 'Lenguaje del campo',
              desc: 'Sin tecnicismos innecesarios. La plataforma habla como habla el agricultor.',
            },
          ].map((p, i) => {
            const [ref, vis] = useInView({ threshold: 0.15 })
            const Icon = p.icon
            return (
              <div
                key={p.title}
                ref={ref}
                className={`flex gap-4 bg-gray-50 border border-gray-100 rounded-2xl p-5 transition-all duration-500 ${
                  vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className={`w-10 h-10 rounded-xl ${p.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={18} className={p.color} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{p.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{p.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
