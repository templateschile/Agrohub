import { useSearchParams } from "react-router-dom"
import DESTACADAS from "../../data/apis/destacadas.json"
import { CATEGORIAS_MODULO } from "../lib/ecosistema"
import { moduloDeSlug } from "./Ecosistema"
import { useIdioma, useModulos } from "../i18n"

// Las integraciones destacadas de la región (del directorio /apis, generadas por scripts/build-apis.mjs), agrupadas
// por país: primero las conectadas y luego por nombre. Cada píldora abre su ficha (en español).
// Sigue el filtro del ecosistema (?modulo=): con un módulo elegido muestra solo las de sus categorías.
const FILAS = [
  ...DESTACADAS.chile.map(f => ({ ...f, pais: f.pais || "Chile" })),
  ...DESTACADAS.latam,
].sort((a, b) => (a.estado === "Conectada" ? 0 : 1) - (b.estado === "Conectada" ? 0 : 1) || a.nombre.localeCompare(b.nombre, "es"))

// El catálogo trae el país en español: se muestra en el idioma de la página
const ISO = { Chile: "CL", Brasil: "BR", Argentina: "AR", Colombia: "CO", Perú: "PE", México: "MX", Uruguay: "UY", Paraguay: "PY", Bolivia: "BO", Ecuador: "EC" }
function nombrePais(pais, locale) {
  try { return ISO[pais] ? new Intl.DisplayNames([locale], { type: "region" }).of(ISO[pais]) : pais } catch { return pais }
}

// Un país = una tarjeta con su código y sus servicios como píldoras; el punto dice el estado (lleno = conectada,
// borde = próximamente, punteado = a pedido). Menos texto que una tabla: el detalle está en la ficha.
const CLASE_ESTADO = { Conectada: "es-conectada", Próximamente: "es-pronto", "A pedido": "es-pedido" }
function Paises({ filas }) {
  const { t, locale } = useIdioma()
  const grupos = []
  for (const f of filas) {
    let g = grupos.find(x => x.pais === f.pais)
    if (!g) grupos.push(g = { pais: f.pais, filas: [] })
    g.filas.push(f)
  }
  // Primero los países con más conectadas
  const conectadas = g => g.filas.filter(f => f.estado === "Conectada").length
  grupos.sort((a, b) => conectadas(b) - conectadas(a) || b.filas.length - a.filas.length)
  return (
    <ul className="ah-paises">
      {grupos.map(g => (
        <li key={g.pais} className="ah-pais">
          <p className="ah-pais__cabeza"><span className="ah-pais__iso" aria-hidden="true">{ISO[g.pais] || g.pais.slice(0, 2).toUpperCase()}</span>{nombrePais(g.pais, locale)}</p>
          <ul className="ah-pais__apis">
            {g.filas.map(f => (
              <li key={f.slug}>
                <a href={`/apis/${f.slug}`} hrefLang="es" className={`ah-pais__api ${CLASE_ESTADO[f.estado] || ""}`} title={f.detalle || undefined}>
                  <span className="ah-pais__punto" aria-hidden="true" />{f.nombre.split(" / ")[0]}
                  <span className="visually-hidden">, {t(`integ.estado.${f.estado}`)}</span>
                </a>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

function Leyenda() {
  const { t } = useIdioma()
  return (
    <ul className="ah-paises__leyenda" aria-hidden="true">
      {Object.entries(CLASE_ESTADO).map(([estado, clase]) => (
        <li key={estado} className={clase}><span className="ah-pais__punto" />{t(`integ.estado.${estado}`)}</li>
      ))}
    </ul>
  )
}

export default function Integraciones() {
  const { t } = useIdioma()
  const modulos = useModulos()
  const [params, setParams] = useSearchParams()
  const modulo = moduloDeSlug(params.get("modulo"))
  const categorias = modulo ? CATEGORIAS_MODULO[modulo] || [] : null
  const filas = categorias ? FILAS.filter(f => (f.categorias || []).some(c => categorias.includes(c))) : FILAS
  const nombre = modulo && modulos.find(m => m.key === modulo)?.corto
  const verTodas = () => {
    const p = new URLSearchParams(params)
    p.delete("modulo")
    setParams(p, { replace: true, preventScrollReset: true })
  }

  return (
    <section className="ah-integ" id="integraciones" aria-labelledby="integ-titulo">
      <div className="container">
        <div className="ah-integ__cabeza">
          <h2 id="integ-titulo" className="ah-seccion">{t("integ.titulo")}</h2>
          <p className="ah-lead">{t("integ.bajada")}</p>
          <Leyenda />
        </div>
        {modulo && (
          <div className="ah-integ__filtro">
            <p aria-live="polite">{filas.length ? t("integ.filtradas", { modulo: nombre, n: filas.length, total: FILAS.length }) : t("integ.ninguna", { modulo: nombre })}</p>
            <button type="button" className="ah-btn ah-btn--quieto ah-btn--chico" onClick={verTodas}>{t("integ.verTodas")}</button>
            {categorias[0] && <a className="eco-enlace" href={`/apis/categoria/${categorias[0]}`} hrefLang="es">{t("integ.categoria", { modulo: nombre })}</a>}
          </div>
        )}
        {filas.length > 0 && <Paises filas={filas} />}
        {/* Directorio estático (HTML generado en el build): enlace normal, no del router */}
        <a className="ah-btn ah-btn--quieto ah-integ__ver" href="/apis" hrefLang="es">{t("integ.ver")}</a>
      </div>
    </section>
  )
}
