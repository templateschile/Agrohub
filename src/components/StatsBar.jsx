import { useInView } from '../hooks/useInView'
import { useEffect, useRef } from 'react'

function CountUp({ to, suffix = '', duration = 1800 }) {
  const [ref, visible] = useInView({ threshold: 0.5 })
  const spanRef = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    if (!visible || started.current) return
    started.current = true
    const el = spanRef.current
    if (!el) return
    const start = performance.now()
    const step = ts => {
      const progress = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      el.textContent = Math.round(ease * to) + suffix
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [visible, to, suffix, duration])

  return (
    <span ref={ref}>
      <span ref={spanRef} className="stat-shimmer">0{suffix}</span>
    </span>
  )
}

const stats = [
  { value: 10, suffix: '+', label: 'Problemáticas resueltas',   sub: 'Diagnóstico agrícola integral' },
  { value: 24, suffix: '/7', label: 'Acompañamiento continuo',  sub: 'Consultas sin horarios' },
  { value: 6,  suffix: '',   label: 'Semanas a operativo',       sub: 'Desde el diagnóstico' },
  { value: 4,  suffix: '',   label: 'Actores integrados',        sub: 'Agricultores, técnicos, instituciones, asesores' },
]

export default function StatsBar() {
  const [ref, visible] = useInView({ threshold: 0.2 })

  return (
    <section className="py-0 bg-white">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-6 lg:px-14 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100 border border-gray-100 rounded-2xl shadow-sm bg-white -mt-10 relative z-10">
          {stats.map((s, i) => (
            <div key={s.label} className={`px-6 py-7 text-center ${i === 0 ? 'rounded-tl-2xl rounded-bl-2xl' : ''} ${i === stats.length - 1 ? 'rounded-tr-2xl rounded-br-2xl' : ''}`}>
              <div className="text-4xl font-extrabold mb-1">
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div className="font-semibold text-gray-800 text-sm">{s.label}</div>
              <div className="text-gray-400 text-xs mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
