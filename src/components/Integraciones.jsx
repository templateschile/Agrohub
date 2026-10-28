import { useSearchParams } from "react-router-dom"
import DESTACADAS from "../../data/apis/destacadas.json"
import { CATEGORIAS_MODULO } from "../lib/ecosistema"
import { moduloDeSlug } from "./Ecosistema"
import { useIdioma, useModulos } from "../i18n"

// Las integraciones destacadas de la región (del directorio /apis, generadas por scripts/build-apis.mjs), en una
// sola lista sin preferir un país: primero las conectadas y luego por nombre. Cada fila abre su ficha (en español).
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

function Lista({ filas }) {
  const { t, locale } = useIdioma()
  return (
    <div className="ah-integ__col">
      <ul className="ah-integ__lista">
        {filas.map(f => (
          <li key={f.slug}>
            <a href={`/apis/${f.slug}`} hrefLang="es" className="ah-integ__fila">
              <span className="ah-integ__nombre">{f.nombre}<small>{[f.detalle, nombrePais(f.pais, locale)].filter(Boolean).join(", ")}</small></span>
              <span className={`ah-integ__estado${f.estado === "Conectada" ? " es-conectada" : ""}`}>{t(`integ.estado.${f.estado}`)}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Integraciones() {
  const { t } = useIdioma()
  const modulos = useModulos()
  const [params, setParams] = useSearchParams()
  const modulo = moduloDeSlug(params.get("modulo"))
  const categorias = modulo ? CATEGORIAS_MODULO[modulo] || [] : null
  const filas = categorias ? FILAS.filter(f => (f.categorias || []).some(c => categorias.includes(c))) : FILAS
  const mitad = Math.ceil(filas.length / 2)
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
        </div>
        {modulo && (
          <div className="ah-integ__filtro">
            <p aria-live="polite">{filas.length ? t("integ.filtradas", { modulo: nombre, n: filas.length, total: FILAS.length }) : t("integ.ninguna", { modulo: nombre })}</p>
            <button type="button" className="ah-btn ah-btn--quieto ah-btn--chico" onClick={verTodas}>{t("integ.verTodas")}</button>
            {categorias[0] && <a className="eco-enlace" href={`/apis/categoria/${categorias[0]}`} hrefLang="es">{t("integ.categoria", { modulo: nombre })}</a>}
          </div>
        )}
        {filas.length > 0 && (
          <div className="ah-integ__grid">
            <Lista filas={filas.slice(0, mitad)} />
            {filas.length > 1 && <Lista filas={filas.slice(mitad)} />}
          </div>
        )}
        {/* Directorio estático (HTML generado en el build): enlace normal, no del router */}
        <a className="ah-btn ah-btn--quieto ah-integ__ver" href="/apis" hrefLang="es">{t("integ.ver")}</a>
      </div>
    </section>
  )
}
