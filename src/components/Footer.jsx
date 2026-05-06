export default function Footer() {
  return (
    <footer className="bg-agro-green-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
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
              <div className="font-bold text-lg">AgroHub</div>
              <div className="text-white/50 text-xs">Tecnología que acompaña</div>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-white/50 text-sm text-center max-w-md">
            Conocimiento que se comparte · Tecnología que acompaña · Decisiones que transforman.
            <br />Juntos construimos una agricultura más resiliente.
          </p>

          {/* Links */}
          <nav className="flex gap-6 text-white/60 text-sm">
            <a href="#desafio" className="hover:text-white transition-colors">El Desafío</a>
            <a href="#modelo" className="hover:text-white transition-colors">Modelo</a>
            <a href="#plataforma" className="hover:text-white transition-colors">Plataforma</a>
            <a href="#contacto" className="hover:text-white transition-colors">Contacto</a>
          </nav>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">© 2025 AgroHub · Valle de Choapa · Chile</p>
          <p className="text-white/30 text-xs">Personas que transforman · Territorios que crecen</p>
        </div>
      </div>
    </footer>
  )
}
