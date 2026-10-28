import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { HubMark } from './HubMark'
import { esRutaDeModulo } from '../lib/modulos'
import { useIdioma, useApps, Enlace } from '../i18n'
import { IDIOMAS, NOMBRES, CORTOS, conIdioma, sinIdioma, guardarPreferencia } from '../i18n/idiomas'

// Menú corto: lo que la mayoría viene a hacer. Los módulos tienen su índice en /modulos y
// el resto del sitio sigue en el pie de página. "Apps" despliega las apps del ecosistema.
// El selector de idioma lleva a la misma página en español, inglés o portugués y recuerda la elección.
const navLinks = [
  { clave: 'nav.modulos',    to: '/modulos', activo: esRutaDeModulo },
  { clave: 'nav.evaluacion', to: '/evaluacion' },
  { clave: 'nav.tienda',     to: '/tienda' },
]

function Marca() {
  const { t } = useIdioma()
  return (
    <Enlace to="/" className="ah-nav__marca" aria-label={t('nav.inicio')}>
      <span className="ah-nav__logo"><HubMark className="ah-nav__hub" title={null} /></span>
      <span className="ah-nav__nombre">AgroHubs<small>{t('nav.lema')}</small></span>
    </Enlace>
  )
}

export function SelectorIdioma({ onElegir }) {
  const { idioma, t } = useIdioma()
  const { pathname, search, hash } = useLocation()
  return (
    <ul className="ah-idiomas" aria-label={t('nav.idioma')}>
      {IDIOMAS.map(i => (
        <li key={i}>
          <Link to={conIdioma(sinIdioma(pathname), i) + search + hash} className="ah-idiomas__item" lang={i} hrefLang={i}
            aria-label={NOMBRES[i]} aria-current={i === idioma ? 'true' : undefined}
            onClick={() => { guardarPreferencia(i); onElegir?.() }}>{CORTOS[i]}</Link>
        </li>
      ))}
    </ul>
  )
}

function ItemApp({ app, onElegir }) {
  const { t } = useIdioma()
  return (
    <Enlace to={app.ruta} className="ah-apps__item" onClick={onElegir}>
      <span className="ah-apps__nombre">
        {app.nombre}
        {app.nuevo && <span className="ah-insignia">{t('nav.nuevo')}</span>}
      </span>
      <span className="ah-apps__promesa">{app.promesa}</span>
    </Enlace>
  )
}

// Desplegable "Apps" (patrón de divulgación: botón + lista de enlaces). Se abre con clic, Enter o
// Espacio; Escape lo cierra y devuelve el foco al botón; se cierra al hacer clic fuera o al salir con Tab.
function MenuApps({ pathname }) {
  const [abierto, setAbierto] = useState(false)
  const caja = useRef(null)
  const boton = useRef(null)
  const { t } = useIdioma()
  const apps = useApps()
  const activo = sinIdioma(pathname).startsWith('/apps/')

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
        {t('nav.apps')} <ChevronDown size={16} aria-hidden="true" className="ah-apps__flecha" />
      </button>
      <ul id="menu-apps" className="ah-apps__panel" hidden={!abierto}>
        {apps.map(app => (
          <li key={app.slug}><ItemApp app={app} onElegir={() => setAbierto(false)} /></li>
        ))}
      </ul>
    </div>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { t, ruta } = useIdioma()
  const apps = useApps()
  const actual = sinIdioma(location.pathname)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const esActivo = link => (link.activo ? link.activo(actual) : actual === link.to)
  const enlaces = navLinks.map(link => (
    <li key={link.to}>
      <Enlace to={link.to} className="ah-nav__link" aria-current={esActivo(link) ? 'page' : undefined}>{t(link.clave)}</Enlace>
    </li>
  ))

  return (
    <nav className="ah-nav" aria-label={t('nav.principal')}>
      <div className="container ah-nav__barra">
        <Marca />
        <ul className="ah-nav__links">
          {enlaces.slice(0, 1)}
          <li><MenuApps pathname={location.pathname} /></li>
          {enlaces.slice(1)}
          <li><a href="/apis" className="ah-nav__link" hrefLang="es">{t('nav.apis')}</a></li>
          <li><SelectorIdioma /></li>
          <li><a href={ruta('/#contacto')} className="ah-btn ah-btn--chico">{t('nav.agendar')}</a></li>
        </ul>
        <button type="button" onClick={() => setMenuOpen(v => !v)} className="ah-nav__toggle"
          aria-expanded={menuOpen} aria-controls="menu-movil" aria-label={menuOpen ? t('nav.cerrar') : t('nav.abrir')}>
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <ul className="ah-nav__movil" id="menu-movil">
          {enlaces}
          <li><a href="/apis" className="ah-nav__link" hrefLang="es">{t('nav.apis')}</a></li>
          <li className="ah-nav__grupo">
            <p className="ah-nav__grupo-titulo" id="movil-apps">{t('nav.apps')}</p>
            <ul className="ah-nav__apps" aria-labelledby="movil-apps">
              {apps.map(app => <li key={app.slug}><ItemApp app={app} onElegir={() => setMenuOpen(false)} /></li>)}
            </ul>
          </li>
          <li><SelectorIdioma onElegir={() => setMenuOpen(false)} /></li>
          <li><a href={ruta('/#contacto')} className="ah-btn" onClick={() => setMenuOpen(false)}>{t('nav.agendar')}</a></li>
        </ul>
      )}
    </nav>
  )
}
