import Platform from '../components/Platform'
import { useInView } from '../hooks/useInView'
import { useIdioma } from '../i18n'
import { HeroModulo } from './ModuloPagina'
import { BookOpen, Wifi, Database, Globe } from 'lucide-react'

const FUENTES = [
  { id: 'protocolos', icon: BookOpen },
  { id: 'sensores',   icon: Wifi },
  { id: 'historial',  icon: Database },
  { id: 'externas',   icon: Globe },
]

// Preguntas y respuestas de ejemplo (textos en src/i18n/textos/modulos.js)
const CASOS = [1, 2, 3, 4]

export default function AIChat() {
  const { t } = useIdioma()
  const [ref, visible] = useInView({ threshold: 0.15 })
  const [casesRef, casesVisible] = useInView({ threshold: 0.1 })

  return (
    <div>
      <HeroModulo moduloKey="chat_ia" titulo={t('mod.chat.titulo')} destacado={t('mod.chat.destacado')} bajada={t('mod.chat.bajada')} />

      {/* Demo de la plataforma */}
      <Platform />

      {/* Fuentes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <div
            ref={ref}
            className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="max-w-xl mx-auto text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('mod.chat.fuentes.titulo')}</h2>
              <p className="text-gray-600 text-sm">{t('mod.chat.fuentes.bajada')}</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FUENTES.map((s, i) => {
                const Icon = s.icon
                return (
                  <li
                    key={s.id}
                    className="bg-white border border-gray-100 rounded-2xl p-6"
                    style={{ transitionDelay: `${i * 70}ms` }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-agro-green-50 flex items-center justify-center mb-4">
                      <Icon size={18} className="text-agro-green-600" aria-hidden="true" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{t(`mod.chat.f.${s.id}.t`)}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{t(`mod.chat.f.${s.id}.d`)}</p>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Preguntas de ejemplo */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-14">
          <div
            ref={casesRef}
            className={`transition-all duration-700 ${casesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="max-w-xl mx-auto text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('mod.chat.casos.titulo')}</h2>
              <p className="text-gray-600 text-sm">{t('mod.chat.casos.bajada')}</p>
            </div>
            <ul className="flex flex-col gap-4">
              {CASOS.map((n, i) => (
                <li
                  key={n}
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row gap-4"
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <dl className="flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide shrink-0 pt-0.5">{t('mod.chat.productor')}</dt>
                      <dd className="text-gray-800 text-sm">{t(`mod.chat.caso${n}.p`)}</dd>
                    </div>
                    <div className="flex items-start gap-2">
                      <dt className="text-xs font-semibold text-agro-green-700 uppercase tracking-wide shrink-0 pt-0.5">AgroHubs</dt>
                      <dd className="text-gray-700 text-sm leading-relaxed">{t(`mod.chat.caso${n}.r`)}</dd>
                    </div>
                  </dl>
                  <span className="self-start shrink-0 text-[11px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-full px-2.5 py-0.5">
                    {t('mod.ejemplo')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
