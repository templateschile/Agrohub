import { useInView } from '../hooks/useInView'
import { MessageSquare, Wifi, FolderOpen, Bell, Star, Clock } from 'lucide-react'

function ChatBubble({ from, text, time }) {
  const isBot = from === 'bot'
  return (
    <div className={`flex gap-2 ${isBot ? '' : 'flex-row-reverse'}`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-agro-green-600 flex items-center justify-center shrink-0 mt-0.5">
          <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
            <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
        isBot
          ? 'bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-sm'
          : 'bg-agro-green-600 text-white rounded-tr-none'
      }`}>
        {text}
        <div className={`text-[10px] mt-1 ${isBot ? 'text-gray-400' : 'text-white/60'}`}>{time}</div>
      </div>
    </div>
  )
}

function SensorBar({ label, value, max, unit, color }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs font-semibold text-gray-700">{value}{unit}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function MockChat() {
  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-xl border border-gray-100 max-w-xs w-full">
      {/* Header */}
      <div className="bg-agro-green-700 px-4 py-3 flex items-center gap-2">
        <div className="w-2 h-2 bg-agro-green-300 rounded-full animate-pulse" />
        <span className="text-white text-xs font-medium">AgroHub – Asistente</span>
      </div>
      {/* Messages */}
      <div className="p-4 flex flex-col gap-3 min-h-[220px]">
        <ChatBubble from="user" text="¿Cuándo debo regar mis tomates?" time="09:14" />
        <ChatBubble
          from="bot"
          text="Basado en el sensor del Sector A: humedad 28%, temp 24°C. Te recomiendo regar hoy a las 12:00 hrs por 45 min."
          time="09:14"
        />
        <ChatBubble from="user" text="¿Y mañana también?" time="09:15" />
        <ChatBubble
          from="bot"
          text="Según el pronóstico habrá lluvias leves (~6mm). Puedes saltarte el riego del jueves."
          time="09:15"
        />
      </div>
      {/* Input */}
      <div className="px-4 pb-4">
        <div className="bg-white border border-gray-200 rounded-xl flex items-center gap-2 px-3 py-2">
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

function MockDashboard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 max-w-sm w-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">Panel de Monitoreo</span>
        <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={11} /> Tiempo real</span>
      </div>
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-0 border-b border-gray-50">
        {[
          { label: 'Humedad', value: '28%', note: 'Baja', color: 'text-amber-500' },
          { label: 'Temperatura', value: '24.3°', note: 'Normal', color: 'text-agro-green-600' },
          { label: 'Déficit', value: 'Mod.', note: 'Riego hoy', color: 'text-rose-500' },
        ].map(kpi => (
          <div key={kpi.label} className="px-4 py-3 text-center border-r last:border-0 border-gray-50">
            <div className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</div>
            <div className="text-xs text-gray-400">{kpi.label}</div>
            <div className={`text-[10px] font-medium ${kpi.color}`}>{kpi.note}</div>
          </div>
        ))}
      </div>
      {/* Bars */}
      <div className="p-5 flex flex-col gap-3">
        <SensorBar label="Humedad Sector A" value={28} max={100} unit="%" color="bg-agro-blue-400" />
        <SensorBar label="Humedad Sector B" value={41} max={100} unit="%" color="bg-agro-green-400" />
        <SensorBar label="Temp. Ambiente" value={24} max={40} unit="°C" color="bg-amber-400" />
        <SensorBar label="Batería sensor" value={72} max={100} unit="%" color="bg-teal-400" />
      </div>
      {/* Alert */}
      <div className="mx-5 mb-5 bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2">
        <Bell size={14} className="text-amber-500 shrink-0 mt-0.5" />
        <div>
          <div className="text-xs font-semibold text-amber-700">Déficit hídrico moderado</div>
          <div className="text-xs text-amber-600">Recomendación: regar hoy 12:00 hrs</div>
        </div>
      </div>
    </div>
  )
}

function MockDocs() {
  const docs = [
    { name: 'Protocolo Riego Tomate', type: 'PDF', starred: true, date: 'Hoy' },
    { name: 'Ficha Cultivo Berries', type: 'PDF', starred: false, date: 'Ayer' },
    { name: 'Guía Control Plagas', type: 'PDF', starred: true, date: '3 días' },
    { name: 'Manual Sensores IoT', type: 'PDF', starred: false, date: '1 semana' },
  ]
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 max-w-xs w-full">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">Repositorio</span>
        <FolderOpen size={16} className="text-agro-earth-500" />
      </div>
      <div className="divide-y divide-gray-50">
        {docs.map(doc => (
          <div key={doc.name} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-agro-earth-50 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-[9px] font-bold text-agro-earth-600">PDF</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-800 truncate">{doc.name}</div>
              <div className="text-[10px] text-gray-400">{doc.date}</div>
            </div>
            <Star size={12} className={doc.starred ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Platform() {
  const [titleRef, titleVisible] = useInView({ threshold: 0.2 })

  return (
    <section id="plataforma" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          ref={titleRef}
          className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-agro-blue-50 border border-agro-blue-100 rounded-full px-4 py-1.5 mb-5">
            <span className="text-agro-blue-700 text-sm font-medium">Visualización de la plataforma</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, accesible, diseñada para el campo
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            La plataforma fue diseñada pensando en el productor real. Sin tecnicismos, sin pantallas complejas.
            Información útil cuando se necesita.
          </p>
        </div>

        {/* Mockups */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          <MockChat />
          <MockDashboard />
          <MockDocs />
        </div>

        {/* Bottom row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: MessageSquare, label: 'Consultas 24/7', desc: 'Respuestas técnicas en segundos', color: 'text-agro-green-600', bg: 'bg-agro-green-50' },
            { icon: Wifi, label: 'Datos en tiempo real', desc: 'Sensores conectados al dashboard', color: 'text-agro-blue-600', bg: 'bg-agro-blue-50' },
            { icon: FolderOpen, label: 'Repositorio centralizado', desc: 'Todo el conocimiento accesible', color: 'text-agro-earth-600', bg: 'bg-agro-earth-50' },
            { icon: Bell, label: 'Alertas inteligentes', desc: 'Notificaciones cuando importan', color: 'text-rose-500', bg: 'bg-rose-50' },
          ].map(item => {
            const Icon = item.icon
            return (
              <div key={item.label} className="text-center">
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mx-auto mb-3`}>
                  <Icon size={22} className={item.color} />
                </div>
                <div className="font-semibold text-gray-800 text-sm">{item.label}</div>
                <div className="text-gray-500 text-xs mt-1">{item.desc}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
