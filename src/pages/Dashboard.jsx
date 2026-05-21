import WaterResilience from '../components/WaterResilience'
import { useInView } from '../hooks/useInView'
import { Wifi, BarChart2, Bell, Zap, Droplets, Activity } from 'lucide-react'

const sensors = [
  { name: 'WiseConn / DropControl', compatible: true },
  { name: 'CropX', compatible: true },
  { name: 'METER Group / ZENTRA Cloud', compatible: true },
  { name: 'Sencrop', compatible: true },
  { name: 'Pessl Instruments / METOS', compatible: true },
  { name: 'Davis Instruments / WeatherLink', compatible: true },
  { name: 'Sensoterr', compatible: true },
  { name: 'Sentek / IrriMAX Live', compatible: true },
  { name: 'Arable', compatible: true },
  { name: 'xFarm Technologies', compatible: true },
  { name: 'SupPlant', compatible: true },
  { name: 'Doktar', compatible: true },
  { name: 'John Deere Operations Center', compatible: true },
  { name: 'Trimble Agriculture', compatible: true },
  { name: 'Ranch Systems', compatible: true },
  { name: 'Hortau', compatible: true },
]

const features = [
  { icon: Wifi,      title: 'Integracion IoT',              desc: 'Conecta tus sensores existentes sin cambiar hardware.',       color: 'text-agro-blue-600',  bg: 'bg-agro-blue-50' },
  { icon: BarChart2, title: 'Visualizacion en tiempo real', desc: 'Panel interactivo con datos actualizados al instante.',       color: 'text-agro-green-600', bg: 'bg-agro-green-50' },
  { icon: Bell,      title: 'Alertas inteligentes',         desc: 'Notificaciones cuando el predio necesita atencion.',          color: 'text-rose-500',       bg: 'bg-rose-50' },
  { icon: Activity,  title: 'Historico de datos',           desc: 'Analisis de tendencias con hasta 2 anos de historial.',       color: 'text-purple-600',     bg: 'bg-purple-50' },
  { icon: Droplets,  title: 'Gestion hidrica',              desc: 'Calculo de evapotranspiracion y deficit hidrico automatico.', color: 'text-teal-600',       bg: 'bg-teal-50' },
  { icon: Zap,       title: 'Automatizacion de riego',      desc: 'Integra con controladores y programa riegos desde la app.',   color: 'text-amber-600',      bg: 'bg-amber-50' },
]

export default function Dashboard() {
  const [ref, visible] = useInView({ threshold: 0.15 })
  const [sensRef, sensVisible] = useInView({ threshold: 0.1 })

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-agro-green-900 to-agro-green-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <BarChart2 size={13} className="text-agro-green-300" />
            <span className="text-white/85 text-sm font-medium">Dashboard y Sensores</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 max-w-2xl">
            Tu predio en tiempo real, <span className="text-agro-green-300">desde cualquier lugar</span>
          </h1>
          <p className="text-white/65 text-xl max-w-xl leading-relaxed">
            Conecta tus sensores al hub y visualiza humedad, temperatura, clima y eficiencia de riego
            en un panel unificado.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div
            ref={ref}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-6"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                    <Icon size={18} className={f.color} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Live demo section */}
      <WaterResilience />

      {/* Sensors compatibility */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div
            ref={sensRef}
            className={`transition-all duration-700 ${sensVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="max-w-xl mx-auto text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Sensores compatibles</h2>
              <p className="text-gray-500 text-sm">
                AgroHub se integra con los principales proveedores de sensores agricolas del mundo.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {sensors.map((s, i) => (
                <div
                  key={s.name}
                  className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  <span className="w-2 h-2 bg-agro-green-500 rounded-full shrink-0" />
                  <span className="text-gray-700 text-xs font-medium">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
