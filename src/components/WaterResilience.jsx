import { Droplets, TrendingDown, TrendingUp, Zap, Thermometer, BarChart2, Wind } from 'lucide-react'
import { useInView } from '../hooks/useInView'

/* Use a reliable Unsplash URL with explicit format */
const FIELD_IMAGE = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1400&q=80'

function MetricCard({ icon: Icon, label, value, trend, trendLabel, color, bg }) {
  const [ref, visible] = useInView({ threshold: 0.1 })
  return (
    <div
      ref={ref}
      className={`bg-white/90 backdrop-blur-sm border border-white/60 rounded-xl p-4 shadow-sm transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
          <Icon size={16} className={color} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${
            trend === 'up' ? 'text-agro-green-600' : 'text-rose-500'
          }`}>
            {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trendLabel}
          </div>
        )}
      </div>
      <div className={`text-xl font-bold ${color} mb-0.5`}>{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  )
}

function SensorBar({ label, value, max, unit, color }) {
  const [ref, visible] = useInView({ threshold: 0.1 })
  const pct = Math.round((value / max) * 100)
  return (
    <div ref={ref}>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-white/70">{label}</span>
        <span className="text-xs font-bold text-white">{value}{unit}</span>
      </div>
      <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000`}
          style={{ width: visible ? `${pct}%` : '0%' }}
        />
      </div>
    </div>
  )
}

export default function WaterResilience() {
  const [titleRef, titleVisible] = useInView({ threshold: 0.15 })
  const [panelRef, panelVisible] = useInView({ threshold: 0.1 })

  const metrics = [
    { icon: Droplets, label: 'Humedad suelo', value: '28%', trend: 'down', trendLabel: 'Bajo', color: 'text-agro-blue-600', bg: 'bg-agro-blue-50' },
    { icon: Thermometer, label: 'Temperatura', value: '24.3°C', trend: null, trendLabel: '', color: 'text-amber-600', bg: 'bg-amber-50' },
    { icon: Wind, label: 'Viento', value: '12 km/h', trend: null, trendLabel: '', color: 'text-teal-600', bg: 'bg-teal-50' },
    { icon: Zap, label: 'Eficiencia riego', value: '+34%', trend: 'up', trendLabel: 'Mejora', color: 'text-agro-green-600', bg: 'bg-agro-green-50' },
  ]

  return (
    <section id="agua" className="py-24 relative overflow-hidden">
      {/* Background image — explicit inline style to ensure it loads */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${FIELD_IMAGE}')` }}
        role="img"
        aria-label="Campo agrícola con sistema de riego"
      />
      {/* Strong overlay for text legibility */}
      <div className="absolute inset-0 bg-agro-green-950/80" />
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 90% 80% at 20% 50%, rgba(30,74,172,0.25) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-14">
        {/* Header */}
        <div
          ref={titleRef}
          className={`max-w-xl mb-12 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-white/12 border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <Droplets size={13} className="text-agro-blue-300" />
            <span className="text-white text-sm font-medium">Resiliencia hídrica</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Del dato del campo a la decisión de riego
          </h2>
          <p className="text-white/65 text-base leading-relaxed">
            AgroHub UC transforma mediciones en tiempo real en recomendaciones prácticas.
            Sin esperar al técnico. Sin intuición.
          </p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: metric cards */}
          <div className="grid grid-cols-2 gap-3">
            {metrics.map(m => <MetricCard key={m.label} {...m} />)}
            {/* Alert banner */}
            <div className="col-span-2 bg-amber-500/25 border border-amber-400/40 rounded-xl p-4 flex gap-3 items-start">
              <BarChart2 size={18} className="text-amber-300 shrink-0 mt-0.5" />
              <div>
                <div className="text-amber-200 text-sm font-semibold">Recomendación automática</div>
                <div className="text-white/70 text-xs mt-0.5 leading-relaxed">
                  Déficit hídrico moderado en Sector A. Regar hoy 12:00–13:00 hrs · 50 minutos.
                </div>
              </div>
            </div>
          </div>

          {/* Right: bar chart panel */}
          <div
            ref={panelRef}
            className={`bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 transition-all duration-700 ${
              panelVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-white text-sm">Humedad – últimos 7 días</h3>
                <p className="text-white/45 text-xs">Sector El Molino · Sensor A</p>
              </div>
              <span className="text-rose-300 text-xs font-medium bg-rose-500/20 border border-rose-400/30 rounded-full px-3 py-0.5">
                Tendencia ↓
              </span>
            </div>
            <div className="flex flex-col gap-3 mb-6">
              <SensorBar label="Humedad Sector A" value={28} max={100} unit="%" color="bg-agro-blue-400" />
              <SensorBar label="Humedad Sector B" value={42} max={100} unit="%" color="bg-agro-green-400" />
              <SensorBar label="Temperatura" value={24} max={45} unit="°C" color="bg-amber-400" />
              <SensorBar label="Evapotranspiración" value={6} max={15} unit=" mm/d" color="bg-teal-400" />
            </div>
            {/* Benefit row */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
              {[
                { label: 'Monitoreo continuo', desc: 'Sin visitar el predio' },
                { label: 'Ahorro de agua', desc: 'Riego cuando corresponde' },
                { label: 'Historial hídrico', desc: 'Últimos 30 días' },
                { label: 'Alertas automáticas', desc: 'Solo cuando importan' },
              ].map(b => (
                <div key={b.label}>
                  <div className="text-white text-xs font-semibold">{b.label}</div>
                  <div className="text-white/40 text-[10px]">{b.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
