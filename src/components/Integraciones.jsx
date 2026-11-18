import { ArrowRight } from "lucide-react"
import { useIdioma, useIntegraciones, Enlace } from "../i18n"
import { GRUPOS } from "../lib/integraciones"
import { ICONO_GRUPO } from "../pages/IntegracionesIndice"

// Integraciones en la portada: las fuentes de lib/integraciones.js por grupo (Chile primero), cada una como
// píldora que abre su página en /integraciones/<slug>. Debajo, el índice completo y el directorio de APIs agro.
// Para sumar una fuente basta con agregarla en lib/integraciones.js.
export default function Integraciones() {
  const { t } = useIdioma()
  const lista = useIntegraciones()
  return (
    <section className="ah-integ" id="integraciones" aria-labelledby="integ-titulo">
      <div className="container">
        <div className="ah-integ__cabeza">
          <h2 id="integ-titulo" className="ah-seccion">{t("integ.titulo")}</h2>
          <p className="ah-lead">{t("integ.bajada")}</p>
        </div>
        <ul className="ah-integ__grupos">
          {GRUPOS.map(g => {
            const I = ICONO_GRUPO[g]
            return (
              <li key={g} className="ah-integ__grupo">
                <h3 className="ah-integ__grupo-cabeza"><span className="ah-pais__iso" aria-hidden="true"><I size={20} strokeWidth={1.75} /></span>{t(`intg.grupo.${g}`)}</h3>
                <ul className="ah-pais__apis">
                  {lista.filter(i => i.grupo === g).map(i => (
                    <li key={i.slug}>
                      <Enlace to={`/integraciones/${i.slug}`} className="ah-pais__api"><span className="ah-pais__punto" aria-hidden="true" />{i.nombre}</Enlace>
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>
        <div className="ah-integ__acciones">
          <Enlace className="ah-btn" to="/integraciones">{t("integ.verTodas", { n: lista.length })}<ArrowRight size={16} aria-hidden="true" /></Enlace>
          {/* Directorio estático (HTML generado en el build): enlace normal, no del router */}
          <a className="ah-enlace-plano" href="/apis" hrefLang="es">{t("integ.ver")}</a>
        </div>
      </div>
    </section>
  )
}
