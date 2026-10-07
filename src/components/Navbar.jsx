import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Wordmark } from './HubMark'

const navLinks = [
  { label: 'Inicio',         to: '/' },
  { label: 'Dashboard',      to: '/dashboard' },
  { label: 'AI Chat',        to: '/ai-chat' },
  { label: 'Documentos',     to: '/documentos' },
  { label: 'Eventos',        to: '/eventos' },
  { label: 'Tienda',         to: '/tienda' },
  { label: 'Evaluación',     to: '/evaluacion' },
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
        {/* Logo (el mismo de admin.agrohubs.cl) */}
        <Link to="/" className="group shrink-0" aria-label="AgroHubs, inicio">
          <Wordmark oscuro={transparent} />
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-4 xl:gap-6 shrink-0">
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

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          className={`lg:hidden p-2 rounded-lg transition-colors ${transparent ? 'text-white' : 'text-gray-700'}`}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
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
          </ul>
        </div>
      )}
    </nav>
  )
}
