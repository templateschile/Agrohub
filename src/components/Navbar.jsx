import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

// Menú corto: lo que la mayoría viene a hacer. Los demás módulos del sitio siguen en el pie de página.
const navLinks = [
  { label: 'Evaluación', to: '/evaluacion' },
  { label: 'Tienda',     to: '/tienda' },
]

function Marca() {
  return (
    <Link to="/" className="ah-nav__marca" aria-label="AgroHubs, inicio">
      <span className="ah-nav__logo">
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <circle cx="16" cy="16" r="6" fill="currentColor" opacity="0.9"/>
          <path d="M16 4 C16 4 10 8 10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M16 4 C16 4 22 8 22 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M6 20 C8 24 12 28 16 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M26 20 C24 24 20 28 16 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </span>
      <span className="ah-nav__nombre">AgroHubs<small>Centro Demostrativo Móvil</small></span>
    </Link>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const enlaces = navLinks.map(link => (
    <li key={link.to}>
      <Link to={link.to} className="ah-nav__link" aria-current={location.pathname === link.to ? 'page' : undefined}>{link.label}</Link>
    </li>
  ))

  return (
    <nav className="ah-nav" aria-label="Principal">
      <div className="container ah-nav__barra">
        <Marca />
        <ul className="ah-nav__links">
          {enlaces}
          <li><a href="/apis" className="ah-nav__link">APIs agro</a></li>
          <li><a href="/#contacto" className="ah-btn ah-btn--chico">Agendar reunión</a></li>
        </ul>
        <button type="button" onClick={() => setMenuOpen(v => !v)} className="ah-nav__toggle"
          aria-expanded={menuOpen} aria-controls="menu-movil" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}>
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <ul className="ah-nav__movil" id="menu-movil">
          {enlaces}
          <li><a href="/apis" className="ah-nav__link">APIs agro</a></li>
          <li><a href="/#contacto" className="ah-btn" onClick={() => setMenuOpen(false)}>Agendar reunión</a></li>
        </ul>
      )}
    </nav>
  )
}
