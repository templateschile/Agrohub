import { Radio, Smartphone, BellRing, Tractor, Palette, LayoutDashboard, Thermometer, CloudSun, Sparkles, Users } from "lucide-react"
import { HubMark } from "./HubMark"
import { useIdioma } from "../i18n"

// Dos diagramas simples en SVG, sin librerías: cómo fluye el dato (sensor → app → aviso → acción) y qué incluye
// un Centro Demostrativo (seis piezas alrededor de AgroHubs). Los textos vienen del diccionario (flujo.*, centro.*).

export function FlujoDato() {
  const { t } = useIdioma()
  const pasos = [
    { icono: Radio, clave: "flujo.1" }, { icono: Smartphone, clave: "flujo.2", fuerte: true },
    { icono: BellRing, clave: "flujo.3" }, { icono: Tractor, clave: "flujo.4" },
  ]
  const ancho = 1100, cajaW = 220, cajaH = 92, hueco = (ancho - 4 * cajaW) / 3
  return (
    <section className="ah-diag" aria-labelledby="flujo-titulo">
      <div className="container">
        <div className="ah-diag__cabeza"><h2 id="flujo-titulo" className="ah-seccion">{t("flujo.titulo")}</h2></div>
        <svg className="ah-diag__svg" viewBox={`0 0 ${ancho} ${cajaH}`} role="img" aria-label={t("flujo.aria")}>
          {pasos.map(({ icono: I, clave, fuerte }, i) => {
            const x = i * (cajaW + hueco)
            return (
              <g key={clave}>
                {i > 0 && <path className="ah-diag__flecha" d={`M ${x - hueco + 4} ${cajaH / 2} H ${x - 4}`} markerEnd="url(#punta)" />}
                <rect className={`ah-diag__caja${fuerte ? " ah-diag__caja--fuerte" : ""}`} x={x} y={0} width={cajaW} height={cajaH} rx={18} />
                <I className={`ah-diag__icono${fuerte ? " ah-diag__icono--claro" : ""}`} x={x + 20} y={cajaH / 2 - 16} width={32} height={32} strokeWidth={1.75} aria-hidden="true" />
                <text className={`ah-diag__texto${fuerte ? " ah-diag__texto--claro" : ""}`} x={x + 20 + 32 + (cajaW - 52) / 2} y={cajaH / 2 + 5}>{t(clave)}</text>
              </g>
            )
          })}
          <defs>
            <marker id="punta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-accent)" />
            </marker>
          </defs>
        </svg>
      </div>
    </section>
  )
}

export function CentroDemostrativo() {
  const { t } = useIdioma()
  const piezas = [
    { icono: Palette, clave: "centro.app" }, { icono: LayoutDashboard, clave: "centro.panel" }, { icono: Thermometer, clave: "centro.sensores" },
    { icono: CloudSun, clave: "centro.datos" }, { icono: Sparkles, clave: "centro.ia" }, { icono: Users, clave: "centro.equipo" },
  ]
  const R = 190, cajaW = 210, cajaH = 60, medio = 420
  return (
    <section className="ah-diag" aria-labelledby="centro-titulo">
      <div className="container">
        <div className="ah-diag__cabeza"><h2 id="centro-titulo" className="ah-seccion">{t("centro.titulo")}</h2></div>
        <svg className="ah-diag__svg ah-diag__svg--centro" viewBox={`0 0 ${medio * 2} ${medio * 2 - 120}`} role="img" aria-label={t("centro.aria")}>
          <g transform={`translate(${medio} ${medio - 60})`}>
            {piezas.map(({ icono: I, clave }, i) => {
              const ang = (-90 + i * 60) * Math.PI / 180
              const x = Math.cos(ang) * R, y = Math.sin(ang) * R
              return (
                <g key={clave}>
                  <line className="ah-diag__rayo" x1={0} y1={0} x2={x} y2={y} />
                  <rect className="ah-diag__caja" x={x - cajaW / 2} y={y - cajaH / 2} width={cajaW} height={cajaH} rx={14} />
                  <I className="ah-diag__icono" x={x - cajaW / 2 + 14} y={y - 13} width={26} height={26} strokeWidth={1.75} aria-hidden="true" />
                  <text className="ah-diag__texto" x={x + 20} y={y + 5}>{t(clave)}</text>
                </g>
              )
            })}
            <circle r={64} fill="var(--color-forest)" />
            <HubMark title={null} className="" x={-26} y={-30} width={52} height={52} style={{ color: "var(--color-mint)" }} />
            <text className="ah-diag__texto ah-diag__texto--claro" y={40} style={{ fontSize: 13 }}>AgroHubs</text>
          </g>
        </svg>
      </div>
    </section>
  )
}
