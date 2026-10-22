import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { MODULOS } from '../lib/modulos'

// Índice de todos los módulos: cada uno con su página.
export default function Modulos() {
  return (
    <div>
      <section className="pt-32 pb-14 bg-gradient-to-b from-agro-green-900 to-agro-green-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 max-w-3xl" style={{ textWrap: 'balance' }}>
            Los módulos de tu <span className="text-agro-green-300">Centro Demostrativo Agrícola</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl leading-relaxed">
            Activa los que necesitas y suma más cuando estés listo. Cada módulo funciona en la app (iOS y Android) y en la web, para todos los cultivos.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULOS.map((m) => {
            const Icon = m.icon
            return (
              <Link
                key={m.slug}
                to={m.href}
                className="group bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md hover:border-agro-green-200 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-11 h-11 rounded-xl bg-agro-green-50 text-agro-green-700 flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-gray-900 text-base mb-1.5 group-hover:text-agro-green-700 transition-colors">{m.titulo}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">{m.resumen}</p>
                </div>
                <span className="text-sm font-semibold text-agro-green-700 flex items-center gap-1 mt-auto">
                  Ver módulo <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            )
          })}
          {/* Cierra la grilla: la evaluación ocupa el espacio que queda en la última fila */}
          <Link
            to="/evaluacion"
            className="group sm:col-span-2 rounded-2xl p-6 md:p-8 flex flex-col justify-center gap-3 bg-agro-green-900 text-white hover:bg-agro-green-800 transition-colors"
          >
            <span className="text-agro-green-300 text-sm font-semibold">¿No sabes por dónde partir?</span>
            <span className="text-xl md:text-2xl font-bold" style={{ textWrap: 'balance' }}>Arma tu solución con la evaluación: te recomendamos los módulos para tu cultivo.</span>
            <span className="inline-flex items-center gap-2 font-semibold text-agro-green-300">
              Hacer la evaluación <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  )
}
