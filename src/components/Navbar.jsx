import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { HubMark } from './HubMark'
import { esRutaDeModulo } from '../lib/modulos'
import { APPS } from '../lib/apps'

// Menú corto: lo que la mayoría viene a hacer. Los módulos tienen su índice en /modulos y
// el resto del sitio sigue en el pie de página. "Apps" despliega las apps del ecosistema.
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

function ItemApp({ app, onElegir }) {
  return (
    <Link to={app.ruta} className="ah-apps__item" onClick={onElegir}>
      <span className="ah-apps__nombre">
        {app.nombre}
        {app.nuevo && <span className="ah-insignia">Nuevo</span>}
      </span>
      <span className="ah-apps__promesa">{app.promesa}</span>
    </Link>
  )
}

// Desplegable "Apps" (patrón de divulgación: botón + lista de enlaces). Se abre con clic, Enter o
// Espacio; Escape lo cierra y devuelve el foco al botón; se cierra al hacer clic fuera o al salir con Tab.
function MenuApps({ pathname }) {
  const [abierto, setAbierto] = useState(false)
  const caja = useRef(null)
  const boton = useRef(null)
  const activo = pathname.startsWith('/apps/')

  useEffect(() => { setAbierto(false) }, [pathname])

  useEffect(() => {
    if (!abierto) return
    const fuera = e => { if (caja.current && !caja.current.contains(e.target)) setAbierto(false) }
    document.addEventListener('pointerdown', fuera)
    return () => document.removeEventListener('pointerdown', fuera)
  }, [abierto])

  const teclado = e => {
    if (e.key === 'Escape' && abierto) {
      e.stopPropagation()
      setAbierto(false)
      boton.current?.focus()
    }
    if (e.key === 'ArrowDown' && e.target === boton.current) {
      e.preventDefault()
      setAbierto(true)
      requestAnimationFrame(() => caja.current?.querySelector('.ah-apps__item')?.focus())
    }
  }

  // Solo al pasar el foco a otro elemento con Tab: un clic sin foco (Safari no enfoca enlaces) lo maneja `fuera`
  const salir = e => { if (e.relatedTarget && !caja.current?.contains(e.relatedTarget)) setAbierto(false) }

  return (
    <div className="ah-apps" ref={caja} onKeyDown={teclado} onBlur={salir}>
      <button type="button" ref={boton} className="ah-nav__link ah-apps__boton" aria-expanded={abierto}
        aria-controls="menu-apps" data-activo={activo || undefined} onClick={() => setAbierto(v => !v)}>
        Apps <ChevronDown size={16} aria-hidden="true" className="ah-apps__flecha" />
      </button>
      <ul id="menu-apps" className="ah-apps__panel" hidden={!abierto}>
        {APPS.map(app => (
          <li key={app.slug}><ItemApp app={app} onElegir={() => setAbierto(false)} /></li>
        ))}
      </ul>
    </div>
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
          {enlaces.slice(0, 1)}
          <li><MenuApps pathname={location.pathname} /></li>
          {enlaces.slice(1)}
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
          <li className="ah-nav__grupo">
            <p className="ah-nav__grupo-titulo" id="movil-apps">Apps</p>
            <ul className="ah-nav__apps" aria-labelledby="movil-apps">
              {APPS.map(app => <li key={app.slug}><ItemApp app={app} onElegir={() => setMenuOpen(false)} /></li>)}
            </ul>
          </li>
          <li><a href="/#contacto" className="ah-btn" onClick={() => setMenuOpen(false)}>Agendar reunión</a></li>
        </ul>
      )}
    </nav>
  )
}
