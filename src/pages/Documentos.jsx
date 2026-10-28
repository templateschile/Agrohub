import { useId, useState } from 'react'
import { useInView } from '../hooks/useInView'
import { useIdioma } from '../i18n'
import { HeroModulo } from './ModuloPagina'
import { FolderOpen, Search, Share2, Star, FileText, UploadCloud, Users } from 'lucide-react'

// Documentos de ejemplo de un hub (nombres y categorías en src/i18n/textos/modulos.js).
// consultas: null = "Actualizado hoy"
const DOCS = [
  { id: 'd1', cat: 'riego',      consultas: 34,   destacado: true },
  { id: 'd2', cat: 'nutricion',  consultas: 18,   destacado: true },
  { id: 'd3', cat: 'sanidad',    consultas: 27,   destacado: false },
  { id: 'd4', cat: 'datos',      consultas: null, destacado: false },
  { id: 'd5', cat: 'tecnologia', consultas: 9,    destacado: true },
  { id: 'd6', cat: 'normativa',  consultas: 15,   destacado: false },
]

const FEATURES = [
  { id: 'buscar',    icon: Search },
  { id: 'compartir', icon: Share2 },
  { id: 'subir',     icon: UploadCloud },
  { id: 'acceso',    icon: Users },
]

// Para buscar sin tildes ni mayúsculas
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function Documentos() {
  const { t } = useIdioma()
  const [ref, visible] = useInView({ threshold: 0.15 })
  const [q, setQ] = useState('')
  const idBuscar = useId()

  const docs = DOCS.map((d) => ({ ...d, nombre: t(`mod.docs.${d.id}`), categoria: t(`mod.docs.cat.${d.cat}`) }))
  const filtro = norm(q.trim())
  const visibles = filtro ? docs.filter((d) => norm(`${d.nombre} ${d.categoria}`).includes(filtro)) : docs

  return (
    <div>
      <HeroModulo moduloKey="documentos" titulo={t('mod.docs.titulo')} destacado={t('mod.docs.destacado')} bajada={t('mod.docs.bajada')} />

      {/* Qué incluye */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <h2 className="sr-only">{t('mod.incluye')}</h2>
          <ul
            ref={ref}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <li
                  key={f.id}
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-6"
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-agro-earth-50 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-agro-earth-600" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{t(`mod.docs.f.${f.id}.t`)}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{t(`mod.docs.f.${f.id}.d`)}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Biblioteca de ejemplo */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-14">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('mod.docs.lista.titulo')}</h2>
            <p className="text-gray-600 text-sm">{t('mod.docs.lista.bajada')}</p>
          </div>

          <label htmlFor={idBuscar} className="sr-only">{t('mod.docs.buscar.label')}</label>
          <div className="bg-white border border-gray-200 rounded-2xl flex items-center gap-3 px-5 mb-5 shadow-sm focus-within:ring-2 focus-within:ring-agro-green-500">
            <Search size={16} className="text-gray-500 shrink-0" aria-hidden="true" />
            <input
              id={idBuscar}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('mod.docs.buscar.placeholder')}
              className="flex-1 min-h-[48px] bg-transparent text-sm text-gray-800 placeholder-gray-500 focus:outline-none"
            />
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen size={14} className="text-agro-earth-600" aria-hidden="true" />
                <h3 className="text-xs font-semibold text-gray-800">{t('mod.docs.carpeta')}</h3>
              </div>
              <span className="text-[11px] bg-agro-green-50 text-agro-green-800 font-semibold px-2 py-0.5 rounded-full" aria-live="polite">
                {t.plural('mod.docs.archivos', visibles.length)}
              </span>
            </div>
            {visibles.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-gray-600">{t('mod.docs.vacio')}</p>
            ) : (
              <ul>
                {visibles.map((d) => (
                  <li key={d.id} className="px-5 py-3.5 flex items-center gap-3 border-b border-gray-100 last:border-0">
                    <div className="w-9 h-9 bg-agro-earth-50 rounded-lg flex items-center justify-center shrink-0">
                      <FileText size={14} className="text-agro-earth-600" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">{d.nombre}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{d.categoria}</span>
                        <span className="text-[11px] text-agro-green-700">
                          {d.consultas === null ? t('mod.docs.actualizadoHoy') : t.plural('mod.docs.consultas', d.consultas)}
                        </span>
                      </div>
                    </div>
                    {d.destacado && (
                      <Star size={12} className="text-amber-500 fill-amber-400 shrink-0" role="img" aria-label={t('mod.docs.destacadoDoc')} />
                    )}
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
