import { Link } from 'react-router-dom'
import { FOTOS } from '../lib/fotos'

export default function Footer() {
  return (
    <footer className="ah-pie">
      <div className="container ah-pie__grid">
        <div>
          <p className="ah-pie__marca">AgroHubs</p>
          <p className="ah-pie__linea">Tecnología, datos y conocimiento agrícola para cualquier agricultor, en cualquier territorio.</p>
        </div>

        <nav className="ah-pie__links" aria-label="Sitio">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/ai-chat">AI Chat</Link>
          <Link to="/documentos">Documentos</Link>
          <Link to="/eventos">Eventos</Link>
          <Link to="/tienda">Tienda</Link>
          <Link to="/evaluacion">Evaluación</Link>
          {/* Directorio estático (HTML generado en el build): enlace normal, no del router */}
          <a href="/apis">APIs agro</a>
          <a href="/apis/cotizar">Cotiza tu integración</a>
          <a href="/#contacto">Contacto</a>
          <Link to="/terminos">Términos</Link>
        </nav>
      </div>
      <div className="container">
        <p className="ah-pie__legal">&copy; {new Date().getFullYear()} AgroHubs, Chile</p>
        <p className="ah-pie__creditos">
          Fotografías de Wikimedia Commons:{' '}
          {Object.values(FOTOS).map((f, i, todas) => (
            <span key={f.pagina}><a href={f.pagina} rel="noopener">{f.autor}</a> ({f.licencia}){i < todas.length - 1 ? ', ' : '.'}</span>
          ))}
        </p>
      </div>
    </footer>
  )
}
