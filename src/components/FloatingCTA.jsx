import { useState, useEffect } from 'react'
import { MessageSquare, X } from 'lucide-react'

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if (!dismissed) setVisible(window.scrollY > 500)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [dismissed])

  if (dismissed) return null

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
    >
      {/* Expanded card */}
      {expanded && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl p-5 w-72 animate-[slideUp_0.3s_ease]">
          <button
            onClick={() => setExpanded(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={15} />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-agro-green-600 flex items-center justify-center">
              <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
                <circle cx="16" cy="16" r="6" fill="white" opacity="0.9"/>
                <path d="M16 4 C16 4 10 8 10 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 4 C16 4 22 8 22 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">AgroHub</div>
              <div className="text-gray-400 text-xs">Respondemos en 24–48 hrs</div>
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            ¿Quieres saber cómo AgroHub puede integrarse a tu territorio?
          </p>
                    <a
            href="https://wa.me/56987561075?text=Hola%2C%20me%20interesa%20saber%20m%C3%A1s%20sobre%20AgroHub%20para%20mi%20territorio"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setExpanded(false)}
            className="block w-full text-center bg-agro-green-600 hover:bg-agro-green-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
          >
            Escribir por WhatsApp →
          </a>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="flex items-center gap-2.5 bg-agro-green-600 hover:bg-agro-green-700 text-white font-semibold px-5 py-3 rounded-full shadow-lg shadow-agro-green-900/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
      >
        <MessageSquare size={17} />
        <span className="text-sm">¿Hablamos?</span>
        <span className="w-2 h-2 bg-agro-green-300 rounded-full animate-pulse" />
      </button>
    </div>
  )
}
