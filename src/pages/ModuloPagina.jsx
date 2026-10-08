import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight, Smartphone } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import { MODULOS, moduloPorSlug } from '../lib/modulos'

// Página de un módulo a partir de su ficha en lib/modulos.js (Recomendaciones, Clima, Drones,
// Fuentes, Calculadoras). Mismo estilo que las páginas hechas a mano (Dashboard, AI Chat...).
export default function ModuloPagina({ slug }) {
  const m = moduloPorSlug(slug)
  const [ref, visible] = useInView({ threshold: 0.12 })
  if (!m || !m.pagina) return null
  const p = m.pagina
  const Icon = m.icon
  const otros = MODULOS.filter((x) => x.slug !== m.slug)

  return (
    <div>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-agro-green-900 to-agro-green-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Icon size={14} className="text-agro-green-300" />
            <span className="text-white/85 text-sm font-medium">{p.badge}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 max-w-3xl" style={{ textWrap: 'balance' }}>
            {p.titulo} <span className="text-agro-green-300">{p.destacado}</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl leading-relaxed">{p.bajada}</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link to="/evaluacion" className="inline-flex items-center gap-2 bg-agro-green-500 hover:bg-agro-green-400 text-white font-bold px-6 py-3 rounded-full transition-colors">
              Quiero este módulo <ArrowRight size={16} />
            </Link>
            <Link to="/modulos" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold px-6 py-3 rounded-full transition-colors">
              Ver todos los módulos
            </Link>
          </div>
        </div>
      </section>

      {/* Aviso destacado (p. ej. integración DronX) */}
      {p.aviso && (
        <section className="bg-white pt-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-14">
            <div className="rounded-3xl border border-agro-green-200 bg-agro-green-50 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center">
              <div className="w-14 h-14 rounded-2xl bg-agro-green-700 text-white flex items-center justify-center shrink-0">
                <Icon size={28} />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl md:text-2xl font-bold text-agro-green-900 mb-2">{p.aviso.titulo}</h2>
                <p className="text-agro-green-900/80 leading-relaxed max-w-3xl">{p.aviso.texto}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {['iOS', 'Android', 'Integrado con AgroHubs'].map((t) => (
                    <span key={t} className="inline-flex items-center gap-1.5 bg-white border border-agro-green-200 text-agro-green-800 text-xs font-semibold rounded-full px-3 py-1">
                      {t !== 'Integrado con AgroHubs' ? <Smartphone size={12} /> : <CheckCircle2 size={12} />} {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Qué incluye */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Qué incluye</h2>
          <div
            ref={ref}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {p.features.map((f) => (
              <div key={f.titulo} className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                <CheckCircle2 size={20} className="text-agro-green-600 mb-3" />
                <h3 className="font-bold text-gray-900 mb-1">{f.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-16 bg-agro-green-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Cómo funciona</h2>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {p.pasos.map((paso, i) => (
              <li key={paso} className="flex gap-4 bg-white rounded-2xl p-5 border border-agro-green-100">
                <span className="w-8 h-8 rounded-full bg-agro-green-700 text-white font-bold text-sm flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-gray-700 leading-relaxed">{paso}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Otros módulos */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Otros módulos de AgroHubs</h2>
          <div className="flex flex-wrap gap-2">
            {otros.map((o) => {
              const I = o.icon
              return (
                <Link key={o.slug} to={o.href} className="inline-flex items-center gap-2 bg-gray-50 hover:bg-agro-green-50 border border-gray-100 hover:border-agro-green-200 text-gray-700 hover:text-agro-green-800 text-sm font-medium rounded-full px-4 py-2 transition-colors">
                  <I size={15} /> {o.titulo}
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
