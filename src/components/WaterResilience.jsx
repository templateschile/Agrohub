import { Droplets, TrendingDown, TrendingUp, Zap, Thermometer, BarChart2 } from 'lucide-react'
import { useInView } from '../hooks/useInView'

const FIELD_IMAGE = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80&auto=format'

function MetricCard({ icon: Icon, label, value, trend, trendLabel, color, bg }) {
  return (
    <div className={`bg-white border border-gray-100 rounded-xl p-5 shadow-sm`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
          <Icon size={18} className={color} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold ${trend === 'up' ? 'text-agro-green-600' : trend === 'down' ? 'text-rose-500' : 'text-gray-400'}`}>
          {trend === 'up' ? <TrendingUp size={13} /> : trend === 'down' ? <TrendingDown size={13} /> : null}
          {trendLabel}
        </div>
      </div>
      <div className={`text-2xl font-bold ${color} mb-1`}>{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  )
}

export default function WaterResilience() {
  const [titleRef, titleVisible] = useInView({ threshold: 0.2 })
  const [chartRef, chartVisible] = useInView({ threshold: 0.15 })

  const metrics = [
    { icon: Droplets, label: 'Humedad actual del suelo', value: '28%', trend: 'down', trendLabel: '-12%', color: 'text-agro-blue-600', bg: 'bg-agro-blue-50' },
    { icon: Thermometer, label: 'Temperatura ambiente', value: '24.3°C', trend: null, trendLabel: 'Estable', color: 'text-amber-600', bg: 'bg-amber-50' },
    { icon: BarChart2, label: 'Déficit hídrico', value: 'Moderado', trend: 'down', trendLabel: 'Alerta', color: 'text-rose-500', bg: 'bg-rose-50' },
    { icon: Zap, label: 'Eficiencia de riego', value: '+34%', trend: 'up', trendLabel: 'Con AgroHub', color: 'text-agro-green-600', bg: 'bg-agro-green-50' },
  ]

  const weekData = [62, 58, 51, 44, 38, 32, 28]
  const maxVal = 80
  const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Hoy']

  return (
    <section id="agua" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={FIELD_IMAGE} alt="Campo agrícola con sistema de riego" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-agro-blue-900/85" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          ref={titleRef}
          className={`max-w-2xl mb-12 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <Droplets size={14} className="text-agro-blue-300" />
            <span className="text-white text-sm font-medium">Resiliencia hídrica</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Del dato del campo a la decisión de riego
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            AgroHub transforma datos del terreno en decisiones prácticas. Sin intermediarios,
            sin esperar al técnico. La información correcta, en el momento correcto.
          </p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: metrics */}
          <div className="grid grid-cols-2 gap-4">
            {metrics.map(m => (
              <MetricCard key={m.label} {...m} />
            ))}
          </div>

          {/* Right: chart */}
          <div
            ref={chartRef}
            className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 transition-all duration-700 ${
              chartVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-white text-base">Evolución humedad (7 días)</h3>
                <p className="text-white/50 text-xs">Sector El Molino – Sensor A</p>
              </div>
              <div className="bg-rose-500/20 border border-rose-400/30 rounded-full px-3 py-1">
                <span className="text-rose-300 text-xs font-medium">Tendencia a la baja</span>
              </div>
            </div>

            {/* Bar chart */}
            <div className="flex items-end gap-2 h-40 mb-3">
              {weekData.map((val, i) => {
                const h = Math.round((val / maxVal) * 100)
                const isToday = i === weekData.length - 1
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-white/60">{val}%</span>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-700 ${isToday ? 'bg-rose-400' : 'bg-agro-blue-400/60'}`}
                      style={{
                        height: chartVisible ? `${h}%` : '0%',
                        transitionDelay: `${i * 80}ms`,
                      }}
                    />
                  </div>
                )
              })}
            </div>
            <div className="flex gap-2">
              {dayLabels.map((d, i) => (
                <div key={i} className={`flex-1 text-center text-[10px] ${i === dayLabels.length - 1 ? 'text-rose-300 font-semibold' : 'text-white/40'}`}>
                  {d}
                </div>
              ))}
            </div>

            {/* Alert */}
            <div className="mt-5 bg-amber-500/20 border border-amber-400/30 rounded-xl p-4">
              <div className="text-amber-300 text-xs font-semibold mb-1">Recomendación automática</div>
              <div className="text-white/80 text-sm">
                Déficit hídrico moderado detectado. Programar riego hoy a las 12:00 hrs por 50 minutos en Sector El Molino.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom benefits */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { label: 'Monitoreo continuo', desc: 'Sin visitar el predio cada día' },
            { label: 'Alertas automáticas', desc: 'Notificaciones cuando se necesitan' },
            { label: 'Historial hídrico', desc: 'Datos de los últimos 30 días' },
            { label: 'Optimización del riego', desc: 'Ahorro de agua comprobable' },
          ].map(b => (
            <div key={b.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-4">
              <div className="text-white font-semibold text-sm mb-1">{b.label}</div>
              <div className="text-white/55 text-xs">{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
