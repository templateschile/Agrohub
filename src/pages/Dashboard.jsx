import WaterResilience from '../components/WaterResilience'
import { useInView } from '../hooks/useInView'
import { useIdioma } from '../i18n'
import { HeroModulo } from './ModuloPagina'
import { Wifi, BarChart2, Bell, Zap, Droplets, Activity } from 'lucide-react'

// Marcas con las que se integra el panel, en orden alfabético (sin preferencia por país de origen)
const SENSORES = [
  'Arable', 'CropX', 'Davis Instruments / WeatherLink', 'Doktar', 'Hortau', 'John Deere Operations Center',
  'METER Group / ZENTRA Cloud', 'Pessl Instruments / METOS', 'Ranch Systems', 'Sencrop', 'Sensoterr',
  'Sentek / IrriMAX Live', 'SupPlant', 'Trimble Agriculture', 'WiseConn / DropControl', 'xFarm Technologies',
].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))

const FEATURES = [
  { id: 'iot',       icon: Wifi,      color: 'text-agro-blue-600',  bg: 'bg-agro-blue-50' },
  { id: 'vivo',      icon: BarChart2, color: 'text-agro-green-600', bg: 'bg-agro-green-50' },
  { id: 'alertas',   icon: Bell,      color: 'text-rose-600',       bg: 'bg-rose-50' },
  { id: 'historico', icon: Activity,  color: 'text-purple-600',     bg: 'bg-purple-50' },
  { id: 'hidrica',   icon: Droplets,  color: 'text-teal-600',       bg: 'bg-teal-50' },
  { id: 'riego',     icon: Zap,       color: 'text-amber-600',      bg: 'bg-amber-50' },
]

export default function Dashboard() {
  const { t } = useIdioma()
  const [ref, visible] = useInView({ threshold: 0.15 })
  const [sensRef, sensVisible] = useInView({ threshold: 0.1 })

  return (
    <div>
      <HeroModulo moduloKey="dashboard_sensores" titulo={t('mod.dash.titulo')} destacado={t('mod.dash.destacado')} bajada={t('mod.dash.bajada')} />

      {/* Qué incluye */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <h2 className="sr-only">{t('mod.incluye')}</h2>
          <ul
            ref={ref}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <li
                  key={f.id}
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-6"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                    <Icon size={18} className={f.color} aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{t(`mod.dash.f.${f.id}.t`)}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{t(`mod.dash.f.${f.id}.d`)}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Demo en vivo */}
      <WaterResilience />

      {/* Sensores compatibles */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div
            ref={sensRef}
            className={`transition-all duration-700 ${sensVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="max-w-xl mx-auto text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('mod.dash.sensores.titulo')}</h2>
              <p className="text-gray-600 text-sm">{t('mod.dash.sensores.bajada')}</p>
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {SENSORES.map((s) => (
                <li key={s} className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                  <span className="w-2 h-2 bg-agro-green-500 rounded-full shrink-0" aria-hidden="true" />
                  <span className="text-gray-700 text-xs font-medium">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
