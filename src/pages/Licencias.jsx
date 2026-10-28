import { Database, Lock, KeyRound, Server, GitPullRequest, Share2, LifeBuoy, Plug, Users, Building2 } from "lucide-react"
import { useIdioma } from "../i18n"

// Políticas y licencias: la licencia compartida del panel y la app con la marca del cliente, en diez puntos
// cortos con un ícono cada uno (src/i18n/textos/licencias.js). Sin precios ni datos de clientes.
const PUNTOS = [Database, Lock, KeyRound, Server, GitPullRequest, Share2, LifeBuoy, Plug, Users, Building2]

export default function Licencias() {
  const { t, ruta } = useIdioma()
  return (
    <>
      <section className="ah-lic-cabeza" aria-labelledby="lic-titulo">
        <div className="container">
          <p className="ah-eyebrow">{t("lic.titular")}</p>
          <h1 id="lic-titulo" className="ah-display">{t("lic.titulo")}</h1>
          <p className="ah-lead">{t("lic.bajada")}</p>
        </div>
      </section>

      <section className="ah-lic">
        <div className="container">
          <p className="ah-lic__contexto">{t("lic.contexto")}</p>
          <ol className="ah-lic__lista">
            {PUNTOS.map((I, i) => (
              <li key={i} className="ah-lic__punto">
                <span className="ah-lic__icono" aria-hidden="true"><I size={22} strokeWidth={1.75} /></span>
                <h2 className="ah-lic__titulo"><span className="ah-lic__n">{i + 1}</span>{t(`lic.${i + 1}.titulo`)}</h2>
                <p>{t(`lic.${i + 1}.texto`)}</p>
              </li>
            ))}
          </ol>
          <p className="ah-lic__nota">{t("lic.nota")}</p>
        </div>
      </section>

      <section className="ah-banda" aria-labelledby="lic-cta">
        <div className="container ah-banda__grid">
          <h2 id="lic-cta" className="ah-banda__frase">{t("lic.cta.titulo")}</h2>
          <p className="ah-lic__cta-texto">{t("lic.cta.texto")}</p>
          <a className="ah-btn ah-btn--claro" href={ruta("/#contacto")}>{t("lic.cta.boton")}</a>
        </div>
      </section>
    </>
  )
}
