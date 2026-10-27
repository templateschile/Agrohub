import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { HubMark } from './HubMark'
import { esRutaDeModulo } from '../lib/modulos'

// Menú corto: lo que la mayoría viene a hacer. Los módulos tienen su índice en /modulos y
// el resto del sitio sigue en el pie de página.
const navLinks = [
  { label: 'Módulos',    to: '/modulos', activo: esRutaDeModulo },
  { label: 'Evaluación', to: '/evaluacion' },
  { label: 'Tienda',     to: '/tienda' },
]

function Marca() {
  return (
    <Link to="/" className="ah-nav__marca" aria-label="AgroHubs, inicio">
      <span className="ah-nav__logo"><HubMark className="ah-nav__hub" title={null} /></span>
      <span className="ah-nav__nombre">AgroHubs<small>Centro Demostrativo Agrícola</small></span>
    </Link>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const esActivo = link => (link.activo ? link.activo(location.pathname) : location.pathname === link.to)
  const enlaces = navLinks.map(link => (
    <li key={link.to}>
      <Link to={link.to} className="ah-nav__link" aria-current={esActivo(link) ? 'page' : undefined}>{link.label}</Link>
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
