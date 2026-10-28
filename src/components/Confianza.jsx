import { ArrowUpRight } from "lucide-react"
import { CONFIAN, PARTNER } from "../lib/confianza"
import { useIdioma } from "../i18n"

// Franja "Confían en nosotros": wordmarks de texto en gris mientras no haya autorización de uso
// de los logos. Si una entrada trae `logo` (lib/confianza.js), se muestra la imagen.
export function ConfianStrip({ id = "confian" }) {
  const { t } = useIdioma()
  return (
    <section className="ah-confian" aria-labelledby={`${id}-titulo`}>
      <div className="container ah-confian__grid">
        <h2 id={`${id}-titulo`} className="ah-confian__titulo">{t("confian.titulo")}</h2>
        <ul className="ah-confian__lista">
          {CONFIAN.map(m => (
            <li key={m.nombre} className="ah-confian__marca">
              {m.logo
                ? <img src={m.logo} alt={m.titulo || m.nombre} loading="lazy" />
                : <span title={m.titulo !== m.nombre ? m.titulo : undefined}>{m.nombre}</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// Partner estratégico. `bloque`: sección de la portada; `linea`: una línea en el pie.
export function Partner({ variante = "bloque" }) {
  const { t } = useIdioma()
  const enlace = (
    <a className="ah-partner__enlace" href={PARTNER.url} target="_blank" rel="noopener noreferrer">
      {PARTNER.nombre}<span className="visually-hidden"> ({t("comun.otraPestana")})</span>
      <ArrowUpRight size={16} aria-hidden="true" />
    </a>
  )
  const frase = <>{t("partner.antes")} <span className="ah-sin-corte">{enlace},</span> {t("partner.despues")}</>
  if (variante === "linea") return <p className="ah-partner--linea">{frase}</p>
  return (
    <section className="ah-partner" aria-labelledby="partner-titulo">
      <div className="container ah-partner__grid">
        <p className="ah-partner__eyebrow" id="partner-titulo">{t("partner.eyebrow")}</p>
        <p className="ah-partner__frase">{frase}</p>
      </div>
    </section>
  )
}
