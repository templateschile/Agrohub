import { Smartphone, Palette, ArrowRight } from "lucide-react"
import { useIdioma, Enlace } from "../i18n"
import { listaPlataformas } from "../lib/plataformas"

// "¿Quieres una app para tu empresa?": la app AgroHubs con la marca del cliente, y el enlace a /licencias.
// Las plataformas salen de lib/plataformas.js. En la portada va dentro de «Apps del ecosistema» (incrustada):
// un bloque y no una sección aparte, para no sumar una franja delgada.
export default function MarcaPropia({ incrustada = false }) {
  const { t } = useIdioma()
  const Caja = incrustada ? "div" : "section"
  return (
    <Caja className={`ah-marca${incrustada ? " ah-marca--incrustada" : ""}`} {...(incrustada ? {} : { "aria-labelledby": "marca-titulo" })}>
      <div className={`${incrustada ? "" : "container "}ah-marca__caja`}>
        <span className="ah-marca__iconos" aria-hidden="true"><Smartphone size={28} strokeWidth={1.75} /><Palette size={28} strokeWidth={1.75} /></span>
        <div className="ah-marca__texto">
          <h2 id="marca-titulo" className="ah-marca__titulo">{t("marca.titulo")}</h2>
          <p>{t("marca.texto", { plataformas: listaPlataformas(t("comun.y")) })}</p>
        </div>
        <Enlace className="ah-btn ah-btn--claro" to="/licencias">{t("marca.cta")}<ArrowRight size={16} aria-hidden="true" /></Enlace>
      </div>
    </Caja>
  )
}
