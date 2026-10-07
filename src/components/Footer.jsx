import { Link } from 'react-router-dom'
import { Wordmark } from './HubMark'

export default function Footer() {
  return (
    <footer className="bg-agro-green-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Wordmark oscuro />

          <p className="text-white/50 text-sm text-center max-w-md">
            Conocimiento que se comparte · Tecnología que acompaña · Decisiones que transforman.
          </p>

          <nav className="flex flex-wrap gap-5 text-white/60 text-sm justify-center">
            <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/tienda" className="hover:text-white transition-colors">Tienda</Link>
            <Link to="/evaluacion" className="hover:text-white transition-colors">Evaluación</Link>
          </nav>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">&copy; 2025 AgroHubs &middot; Chile</p>
          <p className="text-white/40 text-xs">
            <a href="/#contacto" className="hover:text-white/70 transition-colors">Contacto</a>
          </p>
          <p className="text-white/30 text-xs">Digitalización · Transferencia tecnológica · Acompañamiento</p>
        </div>
      </div>
    </footer>
  )
}