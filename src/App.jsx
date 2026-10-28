import { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Pages
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import AIChat from './pages/AIChat'
import Documentos from './pages/Documentos'
import Eventos from './pages/Eventos'
import Tienda from './pages/Tienda'
import Evaluacion from './pages/Evaluacion'
import Terminos from './pages/Terminos'
import Licencias from './pages/Licencias'
import RedirigirAdmin from './pages/RedirigirAdmin'
import Modulos from './pages/Modulos'
import ModuloPagina from './pages/ModuloPagina'
import AppPagina from './pages/AppPagina'
import { MODULOS } from './lib/modulos'
import { useIdioma, textosDe } from './i18n'
import { IDIOMAS, PREDETERMINADO, LOCALES, enlacesAlternos, destinoInicial, leerPreferencia, guardarPreferencia, conIdioma, esRobot } from './i18n/idiomas'

export default function App() {
  return (
    <BrowserRouter>
      <Sitio />
    </BrowserRouter>
  )
}

// Al entrar sin prefijo de idioma, una sola vez: la preferencia guardada o, en la primera visita, el idioma
// del navegador (solo inglés o portugués cambian la ruta). Los buscadores se quedan en la URL pedida.
function IdiomaInicial() {
  const navegar = useNavigate()
  const { pathname, search, hash } = useLocation()
  const hecho = useRef(false)
  useEffect(() => {
    if (hecho.current) return
    hecho.current = true
    const preferencia = leerPreferencia()
    const navegador = typeof navigator !== 'undefined' ? (navigator.languages?.length ? navigator.languages : [navigator.language]) : []
    const destino = destinoInicial({ pathname, preferencia, navegador, robot: esRobot(navigator?.userAgent) })
    if (!preferencia) guardarPreferencia(destino || PREDETERMINADO)
    if (destino) navegar(conIdioma(pathname, destino) + search + hash, { replace: true })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

// Cabecera de cada página: <html lang>, título (el h1 de la página), canonical y hreflang. Al cambiar de
// página se parte arriba (salvo enlaces a una sección, como /#contacto) y el foco va al h1, para que el
// lector de pantalla anuncie la página nueva.
function Cabecera() {
  const { pathname, hash } = useLocation()
  const { idioma } = useIdioma()
  const primera = useRef(true)

  useEffect(() => {
    document.documentElement.lang = idioma
    const t = textosDe(idioma)
    const fijar = (sel, crear) => {
      let el = document.head.querySelector(sel)
      if (!el) { el = crear(); document.head.appendChild(el) }
      return el
    }
    const { canonical, alternos } = enlacesAlternos(pathname)
    fijar('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' })).href = canonical
    document.head.querySelectorAll('link[rel="alternate"][data-ah]').forEach(el => el.remove())
    for (const a of alternos) {
      const el = Object.assign(document.createElement('link'), { rel: 'alternate', hreflang: a.hreflang, href: a.href })
      el.dataset.ah = ''
      document.head.appendChild(el)
    }
    fijar('meta[name="description"]', () => Object.assign(document.createElement('meta'), { name: 'description' })).content = t('meta.descripcion')
    fijar('meta[property="og:locale"]', () => { const m = document.createElement('meta'); m.setAttribute('property', 'og:locale'); return m }).content = LOCALES[idioma].replace('-', '_')

    // Título: el h1 de la página, una vez que la página lo pintó
    const id = requestAnimationFrame(() => {
      const h1 = document.querySelector('main h1')
      const nombre = h1?.textContent.trim().replace(/\s+/g, ' ')
      const esInicio = pathname === '/' || IDIOMAS.some(i => pathname === `/${i}`)
      document.title = esInicio || !nombre ? t('meta.titulo') : `${nombre} | AgroHubs`
      if (primera.current) { primera.current = false; return }
      if (hash) return
      window.scrollTo({ top: 0, behavior: 'instant' })
      if (h1) {
        if (!h1.hasAttribute('tabindex')) h1.setAttribute('tabindex', '-1')
        h1.focus({ preventScroll: true })
      }
    })
    return () => cancelAnimationFrame(id)
  }, [pathname, hash, idioma])
  return null
}

// Las mismas páginas en cada idioma: sin prefijo en español, /en y /pt
function rutas(prefijo) {
  const p = r => (prefijo + r).replace(/\/$/, '') || '/'
  return [
    <Route key={p('/')} path={p('/')} element={<Home />} />,
    <Route key={p('/dashboard')} path={p('/dashboard')} element={<Dashboard />} />,
    <Route key={p('/ai-chat')} path={p('/ai-chat')} element={<AIChat />} />,
    <Route key={p('/documentos')} path={p('/documentos')} element={<Documentos />} />,
    <Route key={p('/eventos')} path={p('/eventos')} element={<Eventos />} />,
    <Route key={p('/tienda')} path={p('/tienda')} element={<Tienda />} />,
    <Route key={p('/modulos')} path={p('/modulos')} element={<Modulos />} />,
    // Módulos con página armada desde lib/modulos.js (los demás tienen página propia arriba)
    ...MODULOS.filter(m => m.pagina).map(m => (
      <Route key={p(m.ruta)} path={p(m.ruta)} element={<ModuloPagina slug={m.slug} />} />
    )),
    // Apps del ecosistema (lib/apps.js); un slug desconocido vuelve a la portada
    <Route key={p('/apps/:slug')} path={p('/apps/:slug')} element={<AppPagina />} />,
    <Route key={p('/evaluacion')} path={p('/evaluacion')} element={<Evaluacion />} />,
    <Route key={p('/precios')} path={p('/precios')} element={<Navigate to={p('/evaluacion')} replace />} />,
    <Route key={p('/terminos')} path={p('/terminos')} element={<Terminos />} />,
    <Route key={p('/licencias')} path={p('/licencias')} element={<Licencias />} />,
  ]
}

function Sitio() {
  const { t } = useIdioma()
  // El admin se movio a admin.agrohubs.cl (panel de la plataforma): /admin redirige alla
  if (useLocation().pathname.startsWith('/admin')) return <RedirigirAdmin />

  return (
    <div className="min-h-screen flex flex-col">
      <IdiomaInicial />
      <Cabecera />
      <a className="ah-saltar" href="#main">{t('nav.saltar')}</a>
      <Navbar />
      <main className="flex-1" id="main">
        <Routes>
          {rutas('')}
          {IDIOMAS.filter(i => i !== PREDETERMINADO).flatMap(i => rutas(`/${i}`))}
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
