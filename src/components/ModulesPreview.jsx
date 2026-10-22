import { Link } from "react-router-dom"
import { useInView } from "../hooks/useInView"
import { MODULOS } from "../lib/modulos"

const modules = MODULOS.filter((m) => m.destacado)

export default function ModulesPreview() {
  const [ref, visible] = useInView({ threshold: 0.15 })

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-14">
        <div
          ref={ref}
          className={`max-w-xl mx-auto text-center mb-12 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-agro-green-50 border border-agro-green-100 rounded-full px-4 py-1.5 mb-4">
            <span className="text-agro-green-700 text-sm font-medium">Módulos de la plataforma</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Un hub. Múltiples herramientas.
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            Cada módulo resuelve una necesidad concreta. Activa los que necesitas
            y escala cuando estés listo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m, i) => {
            const Icon = m.icon
            return (
              <Link
                key={m.slug}
                to={m.href}
                className="group bg-white border border-gray-100 hover:border-agro-green-200 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="w-11 h-11 rounded-xl bg-agro-green-50 text-agro-green-700 flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-1.5 group-hover:text-agro-green-700 transition-colors">
                    {m.titulo}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{m.resumen}</p>
                </div>
                <span className="text-sm font-semibold text-agro-green-700 flex items-center gap-1 mt-auto">
                  Ver módulo <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </span>
              </Link>
            )
          })}
        </div>
        <div className="text-center mt-10">
          <Link to="/modulos" className="inline-flex items-center gap-2 text-agro-green-700 font-semibold hover:text-agro-green-800">
            Ver los {MODULOS.length} módulos <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}