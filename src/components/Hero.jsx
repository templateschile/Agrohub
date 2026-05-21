import { useEffect, useRef } from 'react'
import { ArrowDown } from 'lucide-react'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=85&auto=format&fit=crop'

export default function Hero() {
  const bgRef = useRef(null)

  useEffect(() => {
    const el = bgRef.current
    if (!el) return
    const onScroll = () => {
      const y = window.scrollY
      el.style.transform = `translateY(${y * 0.35}px) scale(1.15)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden grain">
      <div className="absolute inset-0 overflow-hidden">
        <img
          ref={bgRef}
          src={HERO_IMAGE}
          alt="Agricultor trabajando en campo"
          className="w-full h-full object-cover object-center scale-110 will-change-transform"
          loading="eager"
          fetchpriority="high"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-agro-green-950/90 via-agro-green-900/75 to-agro-green-800/50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 60%, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />

      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {[
          { x1:'18%', y1:'72%', x2:'38%', y2:'52%', dur:'3' },
          { x1:'38%', y1:'52%', x2:'58%', y2:'36%', dur:'3.8' },
          { x1:'58%', y1:'36%', x2:'76%', y2:'56%', dur:'2.9' },
        ].map((l, i) => (
          <line key={i} {...l} stroke="#86efac" strokeWidth="1.2" strokeDasharray="6 4" opacity="0.35" filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="0" to="-20" dur={`${l.dur}s`} repeatCount="indefinite"/>
          </line>
        ))}
        {[
          { cx:'18%', cy:'72%', r:'4', dur:'2.4', fill:'#86efac' },
          { cx:'38%', cy:'52%', r:'5', dur:'3.1', fill:'#4ade80' },
          { cx:'58%', cy:'36%', r:'4', dur:'2.7', fill:'#86efac' },
          { cx:'76%', cy:'56%', r:'4.5', dur:'3.5', fill:'#4ade80' },
        ].map((c, i) => (
          <circle key={i} cx={c.cx} cy={c.cy} fill={c.fill} opacity="0.7" filter="url(#glow)">
            <animate attributeName="r" values={`${parseFloat(c.r)-1};${parseFloat(c.r)+2};${parseFloat(c.r)-1}`} dur={`${c.dur}s`} repeatCount="indefinite"/>
          </circle>
        ))}
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-14 pt-32 pb-24">
        <div className="max-w-[680px]">
          <div className="hero-line-1 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-8 pulse-badge">
            <span className="w-1.5 h-1.5 bg-agro-green-400 rounded-full" />
            <span className="text-white/85 text-sm font-medium tracking-wide">
              Centro Demostrativo Movil · Para cualquier agricultor
            </span>
          </div>

          <h1 className="hero-line-2 font-extrabold leading-[1.05] text-white mb-6"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}>
            El saber agricola,{' '}
            <span className="text-agro-green-300">
              digitalizado y siempre disponible
            </span>
          </h1>

          <p className="hero-line-3 text-white/70 text-xl leading-relaxed mb-10 max-w-lg">
            AgroHub es un hub demostrativo movil que centraliza tecnologia, datos y conocimiento
            para que cualquier grupo de agricultores optimice su operacion y comercialice sus productos.
          </p>

          <div className="hero-line-4 flex flex-wrap gap-4 mb-14">
            <a href="#conversacion"
               className="inline-flex items-center gap-2 bg-agro-green-500 hover:bg-agro-green-400 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-agro-green-900/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl text-base">
              Ver como funciona
            </a>
            <a href="#contacto"
               className="inline-flex items-center gap-2 bg-white/12 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5 text-base">
              Hablar con el equipo
            </a>
          </div>

          <div className="hero-line-5 flex flex-wrap gap-6 pt-8 border-t border-white/15">
            {[
              { value: 'Hub Movil',      label: 'Va donde el agricultor' },
              { value: 'Centralizacion', label: 'Todo el conocimiento unido' },
              { value: 'Ecosistema',     label: 'Crece con cada agricultor' },
            ].map(item => (
              <div key={item.value}>
                <div className="text-agro-green-300 font-bold text-base">{item.value}</div>
                <div className="text-white/45 text-xs mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-white/40">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Descubrir</span>
        <ArrowDown size={15} className="animate-bounce" />
      </div>

      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  )
}
