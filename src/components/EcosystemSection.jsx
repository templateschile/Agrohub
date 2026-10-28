import EcosystemDiagram from "./EcosystemDiagram"
import DESTACADAS from "../../data/apis/destacadas.json"

// Sección del ecosistema en la portada: el diagrama concéntrico y el enlace al directorio /apis.
export default function EcosystemSection() {
  return (
    <section className="ah-eco" id="ecosistema" aria-labelledby="eco-titulo">
      <div className="container">
        <div className="ah-eco__cabeza">
          <h2 id="eco-titulo" className="ah-seccion">Todo se conecta con tu centro demostrativo</h2>
          <p className="ah-lead">AgroHubs al centro, sus módulos alrededor, las integraciones con el agro y los sistemas que tu equipo ya usa.</p>
        </div>
        <EcosystemDiagram />
        {/* Directorio estático (HTML generado en el build): enlace normal, no del router */}
        <a className="ah-btn ah-btn--quieto ah-eco__ver" href="/apis">Ver las {DESTACADAS.total_directorio} integraciones</a>
      </div>
    </section>
  )
}
