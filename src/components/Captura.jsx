import { useIdioma } from "../i18n"

// Una captura real de la plataforma en su marco: un teléfono (vista "movil") o una ventana (vista
// "escritorio"). `captura` viene de lib/capturas.js. Carga diferida salvo `prioridad`.
export default function Captura({ captura, vista = "movil", prioridad = false, className = "" }) {
  const { idioma } = useIdioma()
  if (!captura) return null
  const img = (
    <img src={captura.src} width={captura.ancho} height={captura.alto} alt={captura.alt?.[idioma] || captura.alt?.es || ""}
      loading={prioridad ? "eager" : "lazy"} decoding="async" />
  )
  if (vista === "escritorio") {
    return (
      <figure className={`ah-ventana ${className}`}>
        <span className="ah-ventana__barra" aria-hidden="true"><i /><i /><i /></span>
        {img}
      </figure>
    )
  }
  return <figure className={`ah-movil ${className}`}>{img}</figure>
}
