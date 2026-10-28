import { useMemo, useState } from 'react'
import { useInView } from '../hooks/useInView'
import { useIdioma } from '../i18n'
import { HeroModulo } from './ModuloPagina'
import { MapPin, Users, Clock, Info } from 'lucide-react'

// Calendario de ejemplo: las fechas se calculan desde hoy (en `dias`) para que nunca queden en el pasado.
// Títulos y lugares en src/i18n/textos/modulos.js.
const EVENTOS = [
  { id: 'e1', tipo: 'capacitacion', lugar: 'norte',  dias: 12, horas: 4, quedan: 7,  color: 'bg-agro-green-50 border-agro-green-100 text-agro-green-800' },
  { id: 'e2', tipo: 'demostracion', lugar: 'centro', dias: 19, horas: 3, quedan: 3,  color: 'bg-agro-blue-50 border-agro-blue-100 text-agro-blue-800' },
  { id: 'e3', tipo: 'webinar',      lugar: 'linea',  dias: 33, horas: 2, quedan: 45, color: 'bg-purple-50 border-purple-100 text-purple-800' },
  { id: 'e4', tipo: 'taller',       lugar: 'sur',    dias: 47, horas: 3, quedan: 12, color: 'bg-amber-50 border-amber-100 text-amber-800' },
]

const TIPOS = ['todos', 'capacitacion', 'demostracion', 'webinar', 'taller']

const enDias = (dias) => {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() + dias)
  return d
}
const isoLocal = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export default function Eventos() {
  const { t, locale } = useIdioma()
  const [ref, visible] = useInView({ threshold: 0.1 })
  const [tipo, setTipo] = useState('todos')

  const eventos = useMemo(() => {
    const mes = new Intl.DateTimeFormat(locale, { month: 'short' })
    const completa = new Intl.DateTimeFormat(locale, { dateStyle: 'long' })
    return EVENTOS.map((e) => {
      const fecha = enDias(e.dias)
      return { ...e, fecha, iso: isoLocal(fecha), mes: mes.format(fecha).replace('.', ''), larga: completa.format(fecha) }
    })
  }, [locale])
  const visibles = tipo === 'todos' ? eventos : eventos.filter((e) => e.tipo === tipo)

  return (
    <div>
      <HeroModulo moduloKey="eventos" titulo={t('mod.ev.titulo')} destacado={t('mod.ev.destacado')} bajada={t('mod.ev.bajada')} />

      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('mod.ev.lista.titulo')}</h2>
          <p className="flex items-start gap-2 text-sm text-gray-700 mb-6">
            <Info size={16} className="text-agro-green-700 shrink-0 mt-0.5" aria-hidden="true" />
            {t('mod.ev.aviso')}
          </p>

          {/* Filtro por tipo */}
          <div role="group" aria-label={t('mod.ev.filtro.label')} className="flex flex-wrap gap-2 mb-8">
            {TIPOS.map((id) => {
              const activo = tipo === id
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={activo}
                  onClick={() => setTipo(id)}
                  className={`min-h-[44px] px-4 rounded-full text-sm font-medium border transition-colors ${activo ? 'bg-agro-green-700 text-white border-agro-green-700' : 'bg-white text-gray-700 border-gray-300 hover:border-agro-green-500'}`}
                >
                  {t(`mod.ev.tipo.${id}`)}
                </button>
              )
            })}
          </div>

          {/* Eventos */}
          <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {visibles.length === 0 ? (
              <p className="text-center py-12 text-sm text-gray-600">{t('mod.ev.vacio')}</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {visibles.map((e) => (
                  <li key={e.id} className="bg-white border border-gray-100 rounded-2xl p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Fecha */}
                      <time dateTime={e.iso} className="bg-agro-green-50 border border-agro-green-100 rounded-xl px-4 py-3 text-center shrink-0 min-w-[80px] self-start">
                        <span className="sr-only">{e.larga}</span>
                        <span aria-hidden="true" className="block text-agro-green-800 text-xs font-semibold uppercase">{e.mes}</span>
                        <span aria-hidden="true" className="block text-agro-green-900 text-2xl font-extrabold leading-none">{e.fecha.getDate()}</span>
                        <span aria-hidden="true" className="block text-agro-green-700 text-xs">{e.fecha.getFullYear()}</span>
                      </time>

                      {/* Datos */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${e.color}`}>
                            {t(`mod.ev.tipo.${e.tipo}`)}
                          </span>
                          <span className="text-[11px] font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-0.5">
                            {t('mod.ejemplo')}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-base mb-3">{t(`mod.ev.${e.id}`)}</h3>
                        <ul className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <li className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-gray-500" aria-hidden="true" />
                            {t(`mod.ev.lugar.${e.lugar}`)}
                          </li>
                          <li className="flex items-center gap-1.5">
                            <Clock size={13} className="text-gray-500" aria-hidden="true" />
                            {t.plural('mod.ev.horas', e.horas)}
                          </li>
                          <li className="flex items-center gap-1.5">
                            <Users size={13} className="text-gray-500" aria-hidden="true" />
                            {t.plural('mod.ev.cupos', e.quedan)}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
