import { MapPin, CloudSun, Satellite, Radio, ArrowRight } from "lucide-react"
import { useIdioma, useIntegraciones, Enlace } from "../i18n"
import { GRUPOS } from "../lib/integraciones"
import { seoIndice, ldTexto } from "../lib/integraciones-seo"

// Índice de integraciones (/integraciones): las fuentes de lib/integraciones.js en cuatro grupos (Chile, Heladas
// y clima, Satélite, suelo y agua, y Estaciones propias), cada una con su página. Termina en la demo.
// Título, descripción y JSON-LD propios (lib/integraciones-seo.js); el build deja el mismo contenido en HTML
// (scripts/prerender-integraciones.mjs) para buscadores y LLM.

export const ICONO_GRUPO = { chile: MapPin, clima: CloudSun, satelite: Satellite, estaciones: Radio }

// Una integración en la lista: toda la ficha es el enlace a su página (el ::after del nombre la cubre)
export function TarjetaIntegracion({ i, nivel = 3 }) {
  const { t } = useIdioma()
  const Titulo = `h${nivel}`
  const tema = i.tema.charAt(0).toUpperCase() + i.tema.slice(1)
  return (
    <li className="ah-intg-tarjeta">
      <Titulo className="ah-intg-tarjeta__nombre">
        <Enlace to={`/integraciones/${i.slug}`} className="ah-intg-tarjeta__enlace">{i.nombre}</Enlace>
      </Titulo>
      <p className="ah-intg-tarjeta__tema">{tema}</p>
      <p className="ah-intg-tarjeta__pie">
        <span className="ah-intg-tarjeta__org">{i.organizacion}</span>
        <span className={`ah-intg-estado ah-intg-estado--${i.estado}`}>{t(`intg.estado.${i.estado}`)}</span>
      </p>
    </li>
  )
}

// Cierre de las páginas de integraciones: la demo, que es la acción principal del sitio
export function CierreDemo({ titulo }) {
  const { t, ruta } = useIdioma()
  return (
    <section className="ah-banda" aria-labelledby="intg-cta">
      <div className="container ah-banda__grid">
        <h2 id="intg-cta" className="ah-banda__frase">{titulo}</h2>
        <p className="ah-lic__cta-texto">{t("intg.cta.texto")}</p>
        <a className="ah-btn ah-btn--invertido" href={ruta("/#contacto")}>{t("cta.demo")}</a>
      </div>
    </section>
  )
}

export default function IntegracionesIndice() {
  const { t, idioma } = useIdioma()
  const lista = useIntegraciones()
  const seo = seoIndice(lista, idioma, t)
  return (
    <div data-meta-titulo={seo.titulo} data-meta-descripcion={seo.descripcion}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldTexto(seo.ld) }} />
      <section className="ah-lic-cabeza" aria-labelledby="intg-titulo">
        <div className="container">
          <h1 id="intg-titulo" className="ah-display">{t("intg.indice.titulo")}</h1>
          <p className="ah-lead ah-intg__bajada">{t("intg.indice.bajada")}</p>
          <ul className="ah-intg-saltos">
            {GRUPOS.map((g) => {
              const I = ICONO_GRUPO[g]
              return (
                <li key={g}>
                  <a className="ah-intg-salto" href={`#grupo-${g}`}><I size={16} strokeWidth={1.75} aria-hidden="true" />{t(`intg.grupo.${g}`)}</a>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {GRUPOS.map((g) => {
        const del = lista.filter((x) => x.grupo === g)
        const I = ICONO_GRUPO[g]
        return (
          <section key={g} id={`grupo-${g}`} className="ah-intg-grupo" aria-labelledby={`grupo-${g}-titulo`}>
            <div className="container">
              <div className="ah-intg-grupo__cabeza">
                <span className="ah-intg-grupo__icono" aria-hidden="true"><I size={22} strokeWidth={1.75} /></span>
                <h2 id={`grupo-${g}-titulo`} className="ah-intg-grupo__titulo">{t(`intg.grupo.${g}`)}</h2>
                <p className="ah-intg-grupo__bajada">{t(`intg.grupo.${g}.bajada`)}</p>
              </div>
              <ul className="ah-intg-lista">
                {del.map((i) => <TarjetaIntegracion key={i.slug} i={i} />)}
              </ul>
            </div>
          </section>
        )
      })}

      <div className="container ah-intg-directorio">
        {/* Directorio estático (HTML generado en el build, en español): enlace normal, no del router */}
        <p>{t("intg.indice.directorio")}</p>
        <a className="ah-enlace-plano" href="/apis" hrefLang="es">{t("integ.ver")}<ArrowRight size={16} aria-hidden="true" /></a>
      </div>

      <CierreDemo titulo={t("intg.cta.indice")} />
    </div>
  )
}
