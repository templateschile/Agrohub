import {
  CloudSun, TrendingUp, Map, Droplets, Sprout, Satellite, BarChart3, Plug,
  CheckCircle2, Clock, PlusCircle, Link2,
} from "lucide-react"
import DESTACADAS from "../../data/apis/destacadas.json"

// Las integraciones más importantes de Chile y luego de Latinoamérica (del directorio /apis,
// generadas por scripts/build-apis.mjs). Cada tarjeta abre su ficha en el directorio.
const ICONO_CATEGORIA = {
  "clima-y-meteorologia": CloudSun, "mercados-y-precios": TrendingUp, "geodatos-y-territorio": Map,
  "suelo-y-agua": Droplets, "riego-y-control": Droplets, "modelos-y-agronomia": Sprout,
  "satelite-y-teledeteccion": Satellite, "gestion-predial": Satellite, "datos-publicos-y-estadisticas": BarChart3,
}
const ESTADO = {
  Conectada: { icono: CheckCircle2, clase: "es-conectada" },
  Próximamente: { icono: Clock, clase: "es-pronto" },
  "A pedido": { icono: PlusCircle, clase: "es-pedido" },
  Enlace: { icono: Link2, clase: "es-pedido" },
}

function Tarjeta({ f, conPais }) {
  const I = ICONO_CATEGORIA[f.categoria] || Plug
  const e = ESTADO[f.estado] || ESTADO["A pedido"]
  const E = e.icono
  return (
    <li>
      <a href={`/apis/${f.slug}`} className="ah-integ__tarjeta">
        <span className="ah-integ__icono"><I size={22} strokeWidth={1.75} aria-hidden="true" /></span>
        <span className="ah-integ__nombre">{f.nombre}<small>{[f.detalle, conPais && f.pais].filter(Boolean).join(", ")}</small></span>
        <span className={`ah-integ__estado ${e.clase}`}><E size={14} strokeWidth={2} aria-hidden="true" />{f.estado}</span>
      </a>
    </li>
  )
}

export default function Integraciones() {
  return (
    <section className="ah-integ" id="integraciones" aria-labelledby="integ-titulo">
      <div className="container">
        <div className="ah-integ__cabeza">
          <h2 id="integ-titulo" className="ah-seccion">{DESTACADAS.total_directorio} integraciones</h2>
          <p className="ah-lead">Chile primero, después Latinoamérica.</p>
        </div>
        <div className="ah-integ__grid">
          <div>
            <h3 className="ah-integ__titulo">Chile</h3>
            <ul className="ah-integ__lista">{DESTACADAS.chile.map(f => <Tarjeta key={f.slug} f={f} />)}</ul>
          </div>
          <div>
            <h3 className="ah-integ__titulo">Latinoamérica</h3>
            <ul className="ah-integ__lista">{DESTACADAS.latam.map(f => <Tarjeta key={f.slug} f={f} conPais />)}</ul>
          </div>
        </div>
        {/* Directorio estático (HTML generado en el build): enlace normal, no del router */}
        <a className="ah-btn ah-btn--quieto ah-integ__ver" href="/apis">Ver el directorio de APIs agro</a>
      </div>
    </section>
  )
}
