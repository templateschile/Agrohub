import { Link } from 'react-router-dom'
import { HubMark } from './HubMark'
import { Partner } from './Confianza'
import { APPS_CON_PAGINA } from '../lib/apps'

export default function Footer() {
  return (
    <footer className="ah-pie">
      <div className="container ah-pie__grid">
        <div>
          <p className="ah-pie__marca">
            <span className="ah-pie__logo"><HubMark className="ah-pie__hub" title={null} /></span>
            AgroHubs
          </p>
          <p className="ah-pie__linea">Crea tu Centro Demostrativo Agrícola y entrega a tus agricultores el poder de decidir.</p>
          <Partner variante="linea" />
        </div>

        <div className="ah-pie__navs">
          <nav className="ah-pie__links" aria-label="Sitio">
            <Link to="/modulos">Módulos</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/ai-chat">AI Chat</Link>
            <Link to="/documentos">Documentos</Link>
            <Link to="/eventos">Eventos</Link>
            <Link to="/tienda">Tienda</Link>
            <Link to="/drones">Drones</Link>
            <Link to="/evaluacion">Evaluación</Link>
            {/* Directorio estático (HTML generado en el build): enlace normal, no del router */}
            <a href="/apis">APIs agro</a>
            <a href="/apis/cotizar">Cotiza tu integración</a>
            <a href="/#contacto">Contacto</a>
            <Link to="/terminos">Términos</Link>
          </nav>
          <nav className="ah-pie__apps" aria-labelledby="pie-apps">
            <p id="pie-apps" className="ah-pie__subtitulo">Apps del ecosistema</p>
            <ul>
              {APPS_CON_PAGINA.map(app => <li key={app.slug}><Link to={app.ruta}>{app.nombre}</Link></li>)}
            </ul>
          </nav>
        </div>
      </div>
      <div className="container">
        <p className="ah-pie__legal">&copy; {new Date().getFullYear()} AgroHubs, Chile</p>
      </div>
    </footer>
  )
}
