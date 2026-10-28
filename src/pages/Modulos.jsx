import { ArrowRight } from 'lucide-react'
import { useIdioma, useModulos, useModulosProximos, Enlace } from '../i18n'
import { listaPlataformas } from '../lib/plataformas'

// Índice de todos los módulos: cada uno con su página.
export default function Modulos() {
  const { t } = useIdioma()
  const modulos = useModulos()
  const proximos = useModulosProximos()
  return (
    <div>
      <section className="pt-32 pb-14 bg-gradient-to-b from-agro-green-900 to-agro-green-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 max-w-3xl" style={{ textWrap: 'balance' }}>
            {t('mod.indice.titulo')} <span className="text-agro-green-300">{t('mod.indice.destacado')}</span>
          </h1>
          <p className="text-white/75 text-lg md:text-xl max-w-2xl leading-relaxed">{t('mod.indice.bajada', { plataformas: listaPlataformas(t('comun.y')) })}</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <ul className="max-w-7xl mx-auto px-6 lg:px-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modulos.map((m) => {
            const Icon = m.icono
            return (
              <li key={m.slug} className="flex">
                <Enlace
                  to={m.ruta}
                  className="group w-full bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md hover:border-agro-green-200 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-11 h-11 rounded-xl bg-agro-green-50 text-agro-green-700 flex items-center justify-center">
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-bold text-gray-900 text-base mb-1.5 group-hover:text-agro-green-700 transition-colors">{m.nombre}</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">{m.descripcion}</p>
                  </div>
                  <span className="text-sm font-semibold text-agro-green-700 flex items-center gap-1 mt-auto">
                    {t('mod.verModulo')} <ArrowRight size={15} aria-hidden="true" className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Enlace>
              </li>
            )
          })}
          {/* Módulos anunciados (lib/modulos-proximos.js): sin página ni funciones todavía */}
          {proximos.map((m) => {
            const Icon = m.icono
            return (
              <li key={m.slug} className="flex">
                <div className="w-full bg-white/70 border border-dashed border-gray-300 rounded-2xl p-6 flex flex-col gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-bold text-gray-900 text-base mb-1.5">{m.nombre}</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">{m.descripcion}</p>
                  </div>
                  <span className="mt-auto self-start inline-flex items-center min-h-[28px] px-3 rounded-full border border-gray-400 text-gray-700 text-xs font-bold">{t('eco.estado.proximamente')}</span>
                </div>
              </li>
            )
          })}
          {/* Cierra la grilla: la evaluación ocupa el espacio que queda en la última fila */}
          <li className="flex sm:col-span-2">
            <Enlace
              to="/evaluacion"
              className="group w-full rounded-2xl p-6 md:p-8 flex flex-col justify-center gap-3 bg-agro-green-900 text-white hover:bg-agro-green-800 transition-colors"
            >
              <span className="text-agro-green-300 text-sm font-semibold">{t('mod.indice.cta.pregunta')}</span>
              <span className="text-xl md:text-2xl font-bold" style={{ textWrap: 'balance' }}>{t('mod.indice.cta.titulo')}</span>
              <span className="inline-flex items-center gap-2 font-semibold text-agro-green-300">
                {t('mod.indice.cta.boton')} <ArrowRight size={16} aria-hidden="true" className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Enlace>
          </li>
        </ul>
      </section>
    </div>
  )
}
