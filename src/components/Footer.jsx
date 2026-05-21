import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-agro-green-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
                <circle cx="16" cy="16" r="6" fill="white" opacity="0.9"/>
                <path d="M16 4 C16 4 10 8 10 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 4 C16 4 22 8 22 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M6 20 C8 24 12 28 16 28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M26 20 C24 24 20 28 16 28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="font-bold text-lg leading-tight">AgroHub</div>
              <div className="text-white/50 text-xs">Centro Demostrativo Movil</div>
            </div>
          </div>

          <p className="text-white/50 text-sm text-center max-w-md">
            Conocimiento que se comparte &middot; Tecnologia que acompana &middot; Decisiones que transforman.
          </p>

          <nav className="flex flex-wrap gap-5 text-white/60 text-sm justify-center">
            <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/tienda" className="hover:text-white transition-colors">Tienda</Link>
            <Link to="/precios" className="hover:text-white transition-colors">Precios</Link>
          </nav>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">&copy; 2025 AgroHub &middot; Chile</p>
          <p className="text-white/40 text-xs">
            <a href="tel:+56987561075" className="hover:text-white/70 transition-colors">+56 9 8756 1075</a>
            {' &middot; '}
            <a href="mailto:contacto@agrohub.cl" className="hover:text-white/70 transition-colors">contacto@agrohub.cl</a>
          </p>
          <p className="text-white/30 text-xs">Digitalizacion &middot; Transferencia tecnologica &middot; Acompanamiento</p>
        </div>
      </div>
    </footer>
  )
}