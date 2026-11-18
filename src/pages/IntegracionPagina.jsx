import { Navigate, useParams } from "react-router-dom"
import { Check, ArrowUpRight, ArrowLeft } from "lucide-react"
import { useIdioma, useIntegraciones, Enlace } from "../i18n"
import { seoIntegracion, ldTexto } from "../lib/integraciones-seo"
import { TarjetaIntegracion, CierreDemo, ICONO_GRUPO } from "./IntegracionesIndice"

// Página de una integración (/integraciones/<slug>), armada desde lib/integraciones.js: h1 con el nombre, qué
// datos trae, para qué le sirve al agricultor, cómo se conecta, la ficha con la fuente oficial y el estado, las
// otras del mismo grupo y la demo al cierre. Título, meta description y JSON-LD propios (WebPage, migas y
// Dataset); el build deja el mismo contenido en HTML (scripts/prerender-integraciones.mjs).
// Un slug desconocido vuelve al índice.
export default function IntegracionPagina() {
  const { slug } = useParams()
  const { t, idioma, ruta } = useIdioma()
  const lista = useIntegraciones()
  const i = lista.find((x) => x.slug === slug)
  if (!i) return <Navigate to={ruta("/integraciones")} replace />

  const seo = seoIntegracion(i, idioma, t)
  const otras = lista.filter((x) => x.grupo === i.grupo && x.slug !== i.slug)
  const Icono = ICONO_GRUPO[i.grupo]
  const textoEnlace = t(i.tipoEnlace === "sitio" ? "intg.pagina.sitio" : "intg.pagina.documentacion")
  const enlaceOficial = (clase) => (
    <a className={clase} href={i.enlace} target="_blank" rel="noopener noreferrer">
      {textoEnlace}<ArrowUpRight size={16} aria-hidden="true" /><span className="visually-hidden"> ({t("comun.otraPestana")})</span>
    </a>
  )

  return (
    <article data-meta-titulo={seo.titulo} data-meta-descripcion={seo.descripcion} aria-labelledby="intg-h1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldTexto(seo.ld) }} />
      <header className="ah-lic-cabeza ah-intg-cabeza">
        <div className="container">
          <p className="ah-intg-migas">
            <Enlace to="/integraciones" className="ah-intg-migas__enlace"><ArrowLeft size={16} aria-hidden="true" />{t("intg.migas")}</Enlace>
          </p>
          <h1 id="intg-h1" className="ah-display ah-intg__h1">{seo.h1}</h1>
          <p className="ah-lead ah-intg__bajada">{i.resumen}</p>
          <p className="ah-intg-cabeza__estado"><span className={`ah-intg-estado ah-intg-estado--${i.estado}`}>{t(`intg.estado.${i.estado}`)}</span></p>
          <div className="ah-acciones">
            <a className="ah-btn" href={ruta("/#contacto")}>{t("cta.demo")}</a>
            {enlaceOficial("ah-btn ah-btn--quieto")}
          </div>
        </div>
      </header>

      <div className="container ah-intg">
        <div className="ah-intg__cuerpo">
          <section aria-labelledby="intg-datos">
            <h2 id="intg-datos" className="ah-intg__h2">{t("intg.pagina.datos")}</h2>
            <ul className="ah-checks ah-intg__datos">
              {i.datos.map((d) => <li key={d}><Check size={18} aria-hidden="true" />{d}</li>)}
            </ul>
          </section>
          <section aria-labelledby="intg-usos">
            <h2 id="intg-usos" className="ah-intg__h2">{t("intg.pagina.usos")}</h2>
            <ul className="ah-checks">
              {i.usos.map((u) => <li key={u}><Check size={18} aria-hidden="true" />{u}</li>)}
            </ul>
          </section>
          <section aria-labelledby="intg-como">
            <h2 id="intg-como" className="ah-intg__h2">{t("intg.pagina.como")}</h2>
            <p className="ah-intg__texto">{i.como}</p>
            {i.estado === "cuenta" && <p className="ah-intg__texto ah-intg__credencial">{t("intg.credencial")}</p>}
          </section>
        </div>

        <aside className="ah-intg-ficha" aria-labelledby="intg-ficha">
          <h2 id="intg-ficha" className="ah-intg-ficha__titulo">{t("intg.pagina.ficha")}</h2>
          <dl className="ah-intg-ficha__lista">
            <div><dt>{t("intg.pagina.organizacion")}</dt><dd>{i.organizacion}</dd></div>
            {i.cobertura && <div><dt>{t("intg.pagina.cobertura")}</dt><dd>{i.cobertura}</dd></div>}
            <div><dt>{t("intg.pagina.grupo")}</dt><dd><Icono size={16} strokeWidth={1.75} aria-hidden="true" /> {t(`intg.grupo.${i.grupo}`)}</dd></div>
            <div><dt>{t("intg.pagina.estado")}</dt><dd>{t(`intg.estado.${i.estado}`)}</dd></div>
          </dl>
          {enlaceOficial("ah-enlace-plano")}
        </aside>
      </div>

      {otras.length > 0 && (
        <section className="ah-bloque ah-bloque--tinte" aria-labelledby="intg-otras">
          <div className="container">
            <h2 id="intg-otras" className="ah-intg__h2">{t("intg.pagina.otras", { grupo: t(`intg.grupo.${i.grupo}`) })}</h2>
            <ul className="ah-intg-lista">
              {otras.map((x) => <TarjetaIntegracion key={x.slug} i={x} />)}
            </ul>
            <p className="ah-intg-todas"><Enlace className="ah-enlace-plano" to="/integraciones">{t("intg.pagina.todas")}</Enlace></p>
          </div>
        </section>
      )}

      <CierreDemo titulo={t("intg.cta.titulo", { nombre: i.nombre })} />
    </article>
  )
}
