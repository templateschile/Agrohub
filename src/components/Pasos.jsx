import { LayoutGrid, Plug, Smartphone, ArrowRight } from "lucide-react"
import { useIdioma, Enlace } from "../i18n"
import { listaPlataformas } from "../lib/plataformas"

// Tres pasos sobre el teléfono de la portada (texto de Fernando): elegir módulos, elegir con qué conectarse
// y elegir cuántos usuarios. Cada paso lleva a donde se hace: los módulos, el filtro del ecosistema y la reunión.
// Las plataformas salen de lib/plataformas.js.
export default function Pasos() {
  const { t } = useIdioma()
  const pasos = [
    { n: 1, icono: LayoutGrid, texto: t("pasos.1"), ir: t("pasos.1.ir"), to: "/modulos" },
    { n: 2, icono: Plug, texto: t("pasos.2"), ir: t("pasos.2.ir"), href: "#ecosistema" },
    { n: 3, icono: Smartphone, texto: t("pasos.3", { plataformas: listaPlataformas(t("comun.y")) }), ir: t("pasos.3.ir"), href: "#contacto" },
  ]
  return (
    <div className="ah-tp">
      <h2 className="visually-hidden">{t("pasos.titulo")}</h2>
      <ol className="ah-tp__lista">
        {pasos.map(({ n, icono: I, texto, ir, to, href }) => (
          <li key={n} className="ah-tp__paso">
            <span className="ah-tp__n" aria-hidden="true">{n}</span>
            <span className="ah-tp__icono"><I size={20} strokeWidth={1.75} aria-hidden="true" /></span>
            <p className="ah-tp__texto"><span className="visually-hidden">{t("pasos.paso", { n })} </span>{texto}</p>
            {to
              ? <Enlace className="ah-tp__ir" to={to}>{ir}<ArrowRight size={16} aria-hidden="true" /></Enlace>
              : <a className="ah-tp__ir" href={href}>{ir}<ArrowRight size={16} aria-hidden="true" /></a>}
          </li>
        ))}
      </ol>
    </div>
  )
}
