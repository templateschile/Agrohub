import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'El Desafío', href: '#desafio' },
  { label: 'Centro Demostrativo', href: '#modelo' },
  { label: 'Plataforma', href: '#plataforma' },
  { label: 'Marketplace', href: '#marketplace' },
  { label: 'Agua', href: '#agua' },
  { label: 'Implementación', href: '#implementacion' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
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
            <span className={`font-bold text-lg tracking-tight transition-colors leading-tight ${scrolled ? 'text-agro-green-700' : 'text-white'}`}>
              Agro<span className={scrolled ? 'text-agro-green-500' : 'text-agro-green-300'}>Hub</span>{' '}
              <span className={`text-xs font-semibold tracking-widest uppercase ${scrolled ? 'text-agro-green-400' : 'text-white/60'}`}>UC</span>
            </span>
            <span className={`text-[10px] font-medium tracking-wide ${scrolled ? 'text-gray-400' : 'text-white/50'}`}>Valle de Choapa</span>
          </div>
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-7">
          {navLinks.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-agro-green-500 ${
                  scrolled ? 'text-gray-600' : 'text-white/90'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#contacto"
          className="hidden lg:inline-flex items-center gap-2 bg-agro-green-600 hover:bg-agro-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow transition-all duration-200 hover:shadow-md"
        >
          Comenzar
        </a>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <ul className="flex flex-col py-4">
            {navLinks.map(link => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-6 py-3 text-gray-700 font-medium hover:text-agro-green-600 hover:bg-agro-green-50 transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="px-6 pt-2">
              <a
                href="#contacto"
                onClick={() => setMenuOpen(false)}
                className="block text-center bg-agro-green-600 text-white font-semibold py-3 rounded-full"
              >
                Comenzar
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
