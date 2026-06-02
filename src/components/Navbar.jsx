import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Inicio',         to: '/' },
  { label: 'Dashboard',      to: '/dashboard' },
  { label: 'AI Chat',        to: '/ai-chat' },
  { label: 'Documentos',     to: '/documentos' },
  { label: 'Eventos',        to: '/eventos' },
  { label: 'Tienda',         to: '/tienda' },
  { label: 'Precios',        to: '/precios' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const transparent = isHome && !scrolled

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        transparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-agro-green-600 flex items-center justify-center shadow">
            <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
              <circle cx="16" cy="16" r="6" fill="white" opacity="0.9"/>
              <path d="M16 4 C16 4 10 8 10 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 4 C16 4 22 8 22 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M6 20 C8 24 12 28 16 28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M26 20 C24 24 20 28 16 28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className={`font-bold text-lg tracking-tight transition-colors leading-tight ${transparent ? 'text-white' : 'text-agro-green-700'}`}>
              Agro<span className={transparent ? 'text-agro-green-300' : 'text-agro-green-500'}>Hub</span>
            </span>
            <span className={`text-[10px] font-medium tracking-wide ${transparent ? 'text-white/50' : 'text-gray-400'}`}>
              Centro Demostrativo Móvil
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="hidden xl:flex items-center gap-6 shrink-0">
          {navLinks.map(link => {
            const active = location.pathname === link.to
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`text-sm font-medium transition-colors hover:text-agro-green-500 ${
                    active
                      ? transparent ? 'text-agro-green-300' : 'text-agro-green-600'
                      : transparent ? 'text-white/85' : 'text-gray-600'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* CTA */}
        <Link
          to="/precios"
          className="hidden xl:inline-flex shrink-0 items-center gap-2 bg-agro-green-600 hover:bg-agro-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow transition-all duration-200 hover:shadow-md"
        >
          Cotizador
        </Link>

        <div className="xl:hidden flex items-center gap-2">
          <Link
            to="/precios"
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              transparent
                ? 'bg-white/10 text-white border border-white/20'
                : 'bg-agro-green-50 text-agro-green-700 border border-agro-green-100'
            }`}
          >
            Precios / Cotizador
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className={`p-2 rounded-lg transition-colors ${transparent ? 'text-white' : 'text-gray-700'}`}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="xl:hidden bg-white border-t border-gray-100 shadow-lg">
          <ul className="flex flex-col py-4">
            {navLinks.map(link => {
              const active = location.pathname === link.to
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`block px-6 py-3 font-medium hover:text-agro-green-600 hover:bg-agro-green-50 transition-colors ${
                      active ? 'text-agro-green-600 bg-agro-green-50' : 'text-gray-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
            <li className="px-6 pt-2">
              <Link
                to="/precios"
                className="block text-center bg-agro-green-600 text-white font-semibold py-3 rounded-full"
              >
                Cotizador
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
