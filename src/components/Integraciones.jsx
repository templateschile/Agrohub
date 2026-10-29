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
].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))

// El catálogo trae el país en español: se muestra en el idioma de la página
const ISO = { Chile: "CL", Brasil: "BR", Argentina: "AR", Colombia: "CO", Perú: "PE", México: "MX", Uruguay: "UY", Paraguay: "PY", Bolivia: "BO", Ecuador: "EC" }
function nombrePais(pais, locale) {
  try { return ISO[pais] ? new Intl.DisplayNames([locale], { type: "region" }).of(ISO[pais]) : pais } catch { return pais }
}

// Un país = una tarjeta con su código y sus servicios como píldoras, todos por igual (sin estado: el detalle
// técnico está en la ficha de /apis). Menos texto que una tabla.
function Paises({ filas }) {
  const { locale } = useIdioma()
  const grupos = []
  for (const f of filas) {
    let g = grupos.find(x => x.pais === f.pais)
    if (!g) grupos.push(g = { pais: f.pais, filas: [] })
    g.filas.push(f)
  }
  grupos.sort((a, b) => b.filas.length - a.filas.length || a.pais.localeCompare(b.pais, "es"))
  return (
    <ul className="ah-paises">
      {grupos.map(g => (
        <li key={g.pais} className="ah-pais">
          <p className="ah-pais__cabeza"><span className="ah-pais__iso" aria-hidden="true">{ISO[g.pais] || g.pais.slice(0, 2).toUpperCase()}</span>{nombrePais(g.pais, locale)}</p>
          <ul className="ah-pais__apis">
            {g.filas.map(f => (
              <li key={f.slug}>
                <a href={`/apis/${f.slug}`} hrefLang="es" className="ah-pais__api" title={f.detalle || undefined}>
                  <span className="ah-pais__punto" aria-hidden="true" />{f.nombre.split(" / ")[0]}
                </a>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

function Leyenda() { return null }

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
