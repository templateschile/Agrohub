import { useRef, useState } from "react"
import { useIdioma, useModulos, Enlace } from "../i18n"
import { capturasDeModulo, capturasDe } from "../lib/capturas"

// La app al centro y sus 12 módulos alrededor. Elegir un módulo muestra en el teléfono su pantalla real
// (captura de la app con datos de ejemplo, lib/capturas.js); los módulos sin pantalla propia muestran
// "Mi predio", donde se activan. Debajo del teléfono, el nombre del módulo, una línea y su página.
const PREDIO = capturasDe("predio").movil

export default function AppModulos() {
  const { t, idioma } = useIdioma()
  const MODULOS = useModulos()
  const [activo, setActivo] = useState(MODULOS[0].key)
  const pantalla = useRef(null)
  const m = MODULOS.find(x => x.key === activo)
  const captura = capturasDeModulo(activo).movil || PREDIO

  const elegir = key => {
    setActivo(key)
    // En celular el teléfono queda arriba de la lista: se trae a la vista si no se ve
    const el = pantalla.current
    if (el && window.matchMedia("(max-width: 60rem)").matches) {
      const r = el.getBoundingClientRect()
      if (r.bottom < 80 || r.top > window.innerHeight) el.scrollIntoView({ block: "center", behavior: "smooth" })
    }
  }

  const boton = (x, lado) => {
    const I = x.icono
    return (
      <li key={x.key}>
        <button type="button" className={`ah-modulo ah-modulo--${lado}`} aria-pressed={activo === x.key} onClick={() => elegir(x.key)}>
          <I size={18} strokeWidth={1.75} aria-hidden="true" />
          <span>{x.nombre}</span>
        </button>
      </li>
    )
  }

  return (
    <div className="ah-mapa" role="group" aria-label={t("app.diagrama")}>
      <ul className="ah-mapa__col ah-mapa__col--izq" aria-label={t("app.modulos")}>{MODULOS.slice(0, 6).map(x => boton(x, "izq"))}</ul>

      <div className="ah-mapa__centro" ref={pantalla}>
        <div className="ah-telefono ah-telefono--real">
          {captura && (
            <img key={captura.src} src={captura.src} width={captura.ancho} height={captura.alto}
              alt={captura.alt?.[idioma] || captura.alt?.es || ""} decoding="async" fetchPriority="high" />
          )}
        </div>
        <div className="ah-telefono__pie" aria-live="polite">
          <p className="ah-telefono__nombre">{m.nombre}</p>
          {/* Sin la descripción larga: el teléfono ya muestra el módulo; el detalle está en su página */}
          {m.ruta && <Enlace className="ah-telefono__ver" to={m.ruta}>{t("app.verModulo")}</Enlace>}
        </div>
      </div>

      <ul className="ah-mapa__col ah-mapa__col--der" aria-label={t("app.masModulos")}>{MODULOS.slice(6).map(x => boton(x, "der"))}</ul>
    </div>
  )
}
