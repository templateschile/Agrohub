import DESTACADAS from "../../data/apis/destacadas.json"

// Las integraciones más importantes de Chile y luego de Latinoamérica (del directorio /apis,
// generadas por scripts/build-apis.mjs). Cada fila abre su ficha en el directorio.
function Lista({ titulo, filas, conPais }) {
  return (
    <div className="ah-integ__col">
      <h3 className="ah-integ__titulo">{titulo}</h3>
      <ul className="ah-integ__lista">
        {filas.map(f => (
          <li key={f.slug}>
            <a href={`/apis/${f.slug}`} className="ah-integ__fila">
              <span className="ah-integ__nombre">{f.nombre}<small>{[f.detalle, conPais && f.pais].filter(Boolean).join(", ")}</small></span>
              <span className={`ah-integ__estado${f.estado === "Conectada" ? " es-conectada" : ""}`}>{f.estado}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Integraciones() {
  return (
    <section className="ah-integ" id="integraciones" aria-labelledby="integ-titulo">
      <div className="container">
        <div className="ah-integ__cabeza">
          <h2 id="integ-titulo" className="ah-seccion">Chile primero, después Latinoamérica</h2>
          <p className="ah-lead">Las integraciones más importantes, con sus datos en un solo formato.</p>
        </div>
        <div className="ah-integ__grid">
          <Lista titulo="Chile" filas={DESTACADAS.chile} />
          <Lista titulo="Latinoamérica" filas={DESTACADAS.latam} conPais />
        </div>
        {/* Directorio estático (HTML generado en el build): enlace normal, no del router */}
        <a className="ah-btn ah-btn--quieto ah-integ__ver" href="/apis">Ver el directorio de APIs agro</a>
      </div>
    </section>
  )
}
