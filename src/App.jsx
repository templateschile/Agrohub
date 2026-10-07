import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FloatingCTA from './components/FloatingCTA'

// Pages
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import AIChat from './pages/AIChat'
import Documentos from './pages/Documentos'
import Eventos from './pages/Eventos'
import Tienda from './pages/Tienda'
import Evaluacion from './pages/Evaluacion'
import Terminos from './pages/Terminos'
import RedirigirAdmin from './pages/RedirigirAdmin'

export default function App() {
  return (
    <BrowserRouter>
      <Sitio />
    </BrowserRouter>
  )
}

function Sitio() {
  // El admin se movio a admin.agrohubs.cl (panel de la plataforma): /admin redirige alla
  if (useLocation().pathname.startsWith('/admin')) return <RedirigirAdmin />

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/documentos" element={<Documentos />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/evaluacion" element={<Evaluacion />} />
          <Route path="/precios" element={<Navigate to="/evaluacion" replace />} />
          <Route path="/terminos" element={<Terminos />} />
        </Routes>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  )
}
