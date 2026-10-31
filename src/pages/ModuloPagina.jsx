import { CheckCircle2, ArrowRight, Smartphone, Globe } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import { useIdioma, useModulos, Enlace } from '../i18n'
import Captura from '../components/Captura'
import { capturasDeModulo } from '../lib/capturas'
import Foto from '../components/Foto'
import CreditoFoto from '../components/CreditoFoto'
import { FOTOS } from '../lib/fotos'

// Foto de gente del campo detrás de la cabecera de cada módulo (lib/fotos.js)
const FOTO_MODULO = {
  dashboard_sensores: 'riegoPersona', bitacora: 'cosechaManos', chat_ia: 'agricultorTablet', documentos: 'asesorCampo',
  fuentes: 'capacitacion', clima: 'cereales', recomendaciones: 'frutales', fenologia: 'vinas', calculadoras: 'familiaCampo',
  eventos: 'capacitacion', tienda: 'feriaVendedor', drones: 'operadorDron',
  agroclima_viticola: 'vinas', cuarteles: 'vinas', muestras: 'asesorCampo', cata: 'vinas', expediente_do: 'vinas',
}

// Cabecera común de las páginas de módulo (las armadas aquí y las hechas a mano: Dashboard, AI Chat,
// Documentos, Eventos y Tienda): nombre del módulo, h1 (el único de la página), bajada y botones.
// Capturas reales del módulo (lib/capturas.js): la vista de escritorio en una ventana y la del celular
// en un teléfono, a la derecha del texto. Sin captura, la cabecera queda de una columna.
function CapturasModulo({ moduloKey }) {
  const { escritorio, movil } = capturasDeModulo(moduloKey)
  if (!escritorio && !movil) return null
  return (
    <div className={`ah-modcap${escritorio ? "" : " ah-modcap--solo-movil"}`}>
      {escritorio && <Captura captura={escritorio} vista="escritorio" prioridad className="ah-modcap__escritorio" />}
      {movil && <Captura captura={movil} vista="movil" prioridad className="ah-modcap__movil" />}
    </div>
  )
}

export function HeroModulo({ moduloKey, badge, titulo, destacado, bajada }) {
  const { t } = useIdioma()
  const m = useModulos().find((x) => x.key === moduloKey)
  const Icon = m?.icono
  const conCaptura = Boolean(capturasDeModulo(moduloKey).escritorio || capturasDeModulo(moduloKey).movil)
  const fondo = FOTO_MODULO[moduloKey] && FOTOS[FOTO_MODULO[moduloKey]]
  return (
    <section className={`pt-32 pb-16 bg-agro-green-900 ah-modhero-fondo${fondo ? " ah-modhero-fondo--foto" : ""}`}>
      {fondo && <div className="ah-modhero-fondo__foto"><Foto foto={fondo} prioridad sizes="100vw" /><CreditoFoto foto={fondo} /></div>}
      <div className={`relative max-w-7xl mx-auto px-6 lg:px-14${conCaptura ? " ah-modhero" : ""}`}>
        <div>
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
          {Icon && <Icon size={14} className="text-agro-green-300" aria-hidden="true" />}
          <span className="text-white/85 text-sm font-medium">{badge || m?.nombre}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 max-w-3xl" style={{ textWrap: 'balance' }}>
          {titulo} <span className="text-agro-green-300">{destacado}</span>
        </h1>
        <p className="text-white/75 text-lg md:text-xl max-w-2xl leading-relaxed">{bajada}</p>
        <div className="flex flex-wrap gap-3 mt-8">
          <Enlace to="/evaluacion" className="inline-flex items-center gap-2 min-h-[44px] bg-agro-green-500 hover:bg-agro-green-400 text-white font-bold px-6 py-3 rounded-full transition-colors">
            {t('mod.cta.quiero')} <ArrowRight size={16} aria-hidden="true" />
          </Enlace>
          <Enlace to="/modulos" className="inline-flex items-center gap-2 min-h-[44px] bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold px-6 py-3 rounded-full transition-colors">
            {t('mod.cta.todos')}
          </Enlace>
        </div>
        </div>
        <CapturasModulo moduloKey={moduloKey} />
      </div>
    </section>
  )
}

// Página de un módulo a partir de su ficha en lib/modulos.js (Bitácora, Fuentes, Clima, Recomendaciones,
// Fenología, Calculadoras, Drones y los cinco de vitivinicultura), con el texto de `pagina` en el idioma activo
// (src/i18n/datos/modulos-paginas.js). Mismo estilo que las páginas hechas a mano.
export default function ModuloPagina({ slug }) {
  const { t } = useIdioma()
  const modulos = useModulos()
  const m = modulos.find((x) => x.slug === slug)
  const [ref, visible] = useInView({ threshold: 0.12 })
  if (!m || !m.pagina) return null
  const p = m.pagina
  const Icon = m.icono
  const otros = modulos.filter((x) => x.slug !== m.slug)

  return (
    <div>
      <HeroModulo moduloKey={m.key} badge={p.badge} titulo={p.titulo} destacado={p.destacado} bajada={p.bajada} />

      {/* Aviso destacado (p. ej. integración DronX) */}
      {p.aviso && (
        <section className="bg-white pt-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-14">
            <div className="rounded-3xl border border-agro-green-200 bg-agro-green-50 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center">
              <div className="w-14 h-14 rounded-2xl bg-agro-green-700 text-white flex items-center justify-center shrink-0">
                <Icon size={28} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl md:text-2xl font-bold text-agro-green-900 mb-2">{p.aviso.titulo}</h2>
                <p className="text-agro-green-900/80 leading-relaxed max-w-3xl">{p.aviso.texto}</p>
                {p.aviso.enlace && (
                  <Enlace to={p.aviso.enlace.ruta} className="inline-flex items-center gap-1.5 min-h-[44px] mt-1 font-semibold text-agro-green-800 underline underline-offset-4 hover:text-agro-green-900">
                    {p.aviso.enlace.texto} <ArrowRight size={15} aria-hidden="true" />
                  </Enlace>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {/* La app iOS aún no está publicada: Android y web */}
                  {[[t('mod.chip.android'), Smartphone], [t('mod.chip.web'), Globe], [t('mod.chip.integrado'), CheckCircle2]].map(([texto, Chip]) => (
                    <span key={texto} className="inline-flex items-center gap-1.5 bg-white border border-agro-green-200 text-agro-green-800 text-xs font-semibold rounded-full px-3 py-1">
                      <Chip size={12} aria-hidden="true" /> {texto}
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
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">{t('mod.incluye')}</h2>
          <ul
            ref={ref}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {p.features.map((f) => (
              <li key={f.titulo} className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                <CheckCircle2 size={20} className="text-agro-green-600 mb-3" aria-hidden="true" />
                <h3 className="font-bold text-gray-900 mb-1">{f.titulo}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-16 bg-agro-green-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">{t('mod.comoFunciona')}</h2>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {p.pasos.map((paso, i) => (
              <li key={paso} className="flex gap-4 bg-white rounded-2xl p-5 border border-agro-green-100">
                <span className="w-8 h-8 rounded-full bg-agro-green-700 text-white font-bold text-sm flex items-center justify-center shrink-0" aria-hidden="true">{i + 1}</span>
                <span className="text-gray-700 leading-relaxed">{paso}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Otros módulos */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-14">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t('mod.otros')}</h2>
          <ul className="flex flex-wrap gap-2">
            {otros.map((o) => {
              const I = o.icono
              return (
                <li key={o.slug}>
                  <Enlace to={o.ruta} className="inline-flex items-center gap-2 min-h-[44px] bg-gray-50 hover:bg-agro-green-50 border border-gray-100 hover:border-agro-green-200 text-gray-700 hover:text-agro-green-800 text-sm font-medium rounded-full px-4 py-2 transition-colors">
                    <I size={15} aria-hidden="true" /> {o.nombre}
                  </Enlace>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </div>
  )
}
