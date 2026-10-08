import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Wordmark } from './HubMark'
import { MODULOS } from '../lib/modulos'
import { ChevronDown } from 'lucide-react'

const navLinks = [
  { label: 'Inicio',     to: '/' },
  { label: 'Módulos',    to: '/modulos', menu: true },
  { label: 'Drones',     to: '/drones' },
  { label: 'Evaluación', to: '/evaluacion' },
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
            const enModulo = link.menu && MODULOS.some(m => m.href === location.pathname)
            const active = location.pathname === link.to || enModulo
            const clase = `text-sm font-medium transition-colors hover:text-agro-green-500 ${
              active
                ? transparent ? 'text-agro-green-300' : 'text-agro-green-600'
                : transparent ? 'text-white/85' : 'text-gray-600'
            }`
            if (!link.menu) {
              return (
                <li key={link.to}>
                  <Link to={link.to} className={clase}>{link.label}</Link>
                </li>
              )
            }
            return (
              <li key={link.to} className="relative group">
                <Link to={link.to} className={`${clase} inline-flex items-center gap-1`} aria-haspopup="true">
                  {link.label} <ChevronDown size={14} className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                </Link>
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-all duration-150">
                  <ul className="w-[34rem] grid grid-cols-2 gap-1 bg-white rounded-2xl shadow-xl border border-gray-100 p-3">
                    {MODULOS.map(m => {
                      const Icon = m.icon
                      return (
                        <li key={m.slug}>
                          <Link to={m.href} className="flex gap-3 items-start rounded-xl px-3 py-2.5 hover:bg-agro-green-50 transition-colors">
                            <span className="w-8 h-8 rounded-lg bg-agro-green-50 text-agro-green-700 flex items-center justify-center shrink-0"><Icon size={16} /></span>
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-gray-900">{m.titulo}</span>
                              <span className="block text-xs text-gray-500 leading-snug">{m.resumen}</span>
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                    <li className="col-span-2 border-t border-gray-100 mt-1 pt-2">
                      <Link to="/modulos" className="block text-center text-sm font-semibold text-agro-green-700 rounded-xl px-3 py-2 hover:bg-agro-green-50">Ver todos los módulos →</Link>
                    </li>
                  </ul>
                </div>
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
                  {link.menu && (
                    <ul className="pb-2">
                      {MODULOS.map(m => (
                        <li key={m.slug}>
                          <Link
                            to={m.href}
                            className={`block pl-10 pr-6 py-2 text-sm hover:text-agro-green-600 hover:bg-agro-green-50 transition-colors ${
                              location.pathname === m.href ? 'text-agro-green-600 bg-agro-green-50' : 'text-gray-600'
                            }`}
                          >
                            {m.titulo}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </nav>
  )
}
