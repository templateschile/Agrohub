import { LayoutGrid, Plug, Smartphone, ArrowRight, Wrench, GraduationCap, LifeBuoy } from "lucide-react"
import { useIdioma, Enlace } from "../i18n"
import Foto from "./Foto"
import CreditoFoto from "./CreditoFoto"
import { FOTOS } from "../lib/fotos"

// Tres pasos sobre el teléfono de la portada (texto de Fernando): elegir módulos, elegir con qué conectarse
// y elegir cuántos usuarios, solo con su título e ícono; debajo, el equipo que acompaña (implementación,
// capacitación y soporte, componente Equipo). Cada paso lleva a donde se hace.
export default function Pasos() {
  const { t } = useIdioma()
  const pasos = [
    { n: 1, icono: LayoutGrid, to: "/modulos" },
    { n: 2, icono: Plug, href: "#ecosistema" },
    { n: 3, icono: Smartphone, href: "#contacto" },
  ]
  return (
    <div className="ah-tp">
      <h2 className="visually-hidden">{t("pasos.titulo")}</h2>
      <ol className="ah-tp__lista">
        {pasos.map(({ n, icono: I, to, href }) => {
          // Toda la tarjeta es el enlace (::after sobre la tarjeta); el texto del enlace queda para el lector de pantalla
          const ir = <><span className="visually-hidden">{t(`pasos.${n}.ir`)}</span><ArrowRight size={18} aria-hidden="true" /></>
          return (
            <li key={n} className="ah-tp__paso">
              <span className="ah-tp__n" aria-hidden="true">{n}</span>
              <span className="ah-tp__icono"><I size={20} strokeWidth={1.75} aria-hidden="true" /></span>
              <p className="ah-tp__texto"><span className="visually-hidden">{t("pasos.paso", { n })} </span>{t(`pasos.${n}`)}</p>
              {to ? <Enlace className="ah-tp__ir" to={to}>{ir}</Enlace> : <a className="ah-tp__ir" href={href}>{ir}</a>}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

// El equipo que acompaña (implementación, capacitación y soporte), con foto. Va junto a «Agendar reunión»: así el
// héroe queda en una pantalla y el acompañamiento aparece donde se decide.
export function Equipo() {
  const { t } = useIdioma()
  const equipo = [
    { icono: Wrench, clave: "pasos.equipo.implementacion" },
    { icono: GraduationCap, clave: "pasos.equipo.capacitacion" },
    { icono: LifeBuoy, clave: "pasos.equipo.soporte" },
  ]
  return (
    <div className="ah-tp__equipo">
      <div className="ah-tp__equipo-foto">
        <Foto foto={FOTOS.familiaCampo} proporcion={1} sizes="120px" />
        <CreditoFoto foto={FOTOS.familiaCampo} />
      </div>
      <div className="ah-tp__equipo-texto">
        <p className="ah-tp__equipo-titulo">{t("pasos.equipo")}</p>
      </div>
      <ul className="ah-tp__equipo-lista">
        {equipo.map(({ icono: I, clave }) => (
          <li key={clave}><I size={16} strokeWidth={1.75} aria-hidden="true" />{t(clave)}</li>
        ))}
      </ul>
    </div>
  )
}
