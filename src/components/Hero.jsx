import { ArrowDown, Play } from 'lucide-react'
import { useEffect, useRef } from 'react'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1800&q=80&auto=format'

export default function Hero() {
  const overlayRef = useRef(null)

  useEffect(() => {
    const el = overlayRef.current
    if (!el) return
    el.style.opacity = '0'
    const t = setTimeout(() => {
      el.style.transition = 'opacity 1.2s ease'
      el.style.opacity = '1'
    }, 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Agricultor en terreno con tecnología agrícola en el Valle de Choapa"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-agro-green-900/88 via-agro-green-800/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-agro-green-900/50 via-transparent to-transparent" />
      </div>

      {/* Animated nodes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" aria-hidden>
        <line x1="20%" y1="70%" x2="40%" y2="50%" stroke="#86efac" strokeWidth="1" strokeDasharray="6 4" opacity="0.6">
          <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="3s" repeatCount="indefinite" />
        </line>
        <line x1="40%" y1="50%" x2="60%" y2="35%" stroke="#86efac" strokeWidth="1" strokeDasharray="6 4" opacity="0.6">
          <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="3.5s" repeatCount="indefinite" />
        </line>
        <line x1="60%" y1="35%" x2="78%" y2="55%" stroke="#86efac" strokeWidth="1" strokeDasharray="6 4" opacity="0.6">
          <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2.8s" repeatCount="indefinite" />
        </line>
        {[['20%','70%','2.5'], ['40%','50%','3'], ['60%','35%','2'], ['78%','55%','3.2']].map(([cx,cy,dur], i) => (
          <circle key={i} cx={cx} cy={cy} r="5" fill={i%2===0?'#86efac':'#4ade80'} opacity="0.8">
            <animate attributeName="r" values="4;7;4" dur={`${dur}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>

      <div ref={overlayRef} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-20">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-agro-green-400 rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium">Centro Demostrativo AgroHub UC · Valle de Choapa</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            El conocimiento agrícola{' '}
            <span className="text-agro-green-300">centralizado, disponible y en constante crecimiento</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-4 max-w-xl">
            AgroHub UC digitaliza el saber del campo, lo centraliza y lo hace accesible
            a través de una conversación simple — como hablar con un técnico de confianza,
            siempre disponible.
          </p>
          <p className="text-base text-white/55 leading-relaxed mb-10 max-w-lg">
            Cada agricultor que participa enriquece el ecosistema. El aprendizaje es orgánico,
            apoyado por expertos, y crece con el territorio.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#conversacion"
              className="inline-flex items-center gap-2 bg-agro-green-600 hover:bg-agro-green-500 text-white font-semibold px-7 py-3.5 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
            >
              <Play size={16} className="fill-current" />
              Ver cómo funciona
            </a>
            <a
              href="#ecosistema"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-0.5"
            >
              El ecosistema
            </a>
          </div>

          {/* 3 pillars */}
          <div className="mt-14 pt-8 border-t border-white/20">
            <p className="text-white/40 text-xs uppercase tracking-widest font-medium mb-4">Los tres ejes</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Digitalización', sub: 'Del campo a la plataforma' },
                { label: 'Centralización', sub: 'Todo el conocimiento en un lugar' },
                { label: 'Ecosistema colaborativo', sub: 'Crece con cada agricultor' },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className="flex items-start gap-2.5 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15"
                >
                  <span className="w-2 h-2 bg-agro-green-400 rounded-full mt-1.5 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-white">{item.label}</div>
                    <div className="text-xs text-white/50">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50">
        <span className="text-xs uppercase tracking-widest font-medium">Descubrir</span>
        <ArrowDown size={16} className="animate-bounce" />
      </div>
    </section>
  )
}
