import DESTACADAS from "../../data/apis/destacadas.json"

// Las integraciones destacadas de la región (del directorio /apis, generadas por scripts/build-apis.mjs), en una
// sola lista sin preferir un país: primero las conectadas y luego por nombre. Cada fila abre su ficha.
const FILAS = [
  ...DESTACADAS.chile.map(f => ({ ...f, pais: f.pais || "Chile" })),
  ...DESTACADAS.latam,
].sort((a, b) => (a.estado === "Conectada" ? 0 : 1) - (b.estado === "Conectada" ? 0 : 1) || a.nombre.localeCompare(b.nombre, "es"))
const MITAD = Math.ceil(FILAS.length / 2)

function Lista({ filas, conPais }) {
  return (
    <div className="ah-integ__col">
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
          <h2 id="integ-titulo" className="ah-seccion">Integraciones con servicios de la región</h2>
          <p className="ah-lead">Las más usadas en el agro latinoamericano, con sus datos en un solo formato.</p>
        </div>
        <div className="ah-integ__grid">
          <Lista filas={FILAS.slice(0, MITAD)} conPais />
          <Lista filas={FILAS.slice(MITAD)} conPais />
        </div>
        {/* Directorio estático (HTML generado en el build): enlace normal, no del router */}
        <a className="ah-btn ah-btn--quieto ah-integ__ver" href="/apis">Ver el directorio de APIs agro</a>
      </div>
    </section>
  )
}
