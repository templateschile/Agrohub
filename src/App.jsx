import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import Precios from './pages/Precios'

export default function App() {
  return (
    <BrowserRouter>
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
            <Route path="/precios" element={<Precios />} />
          </Routes>
        </main>
        <Footer />
        <FloatingCTA />
      </div>
    </BrowserRouter>
  )
}
