import { useInView } from '../hooks/useInView'
import { Users, Database, TrendingUp, RefreshCw, Sprout, GraduationCap, Building2 } from 'lucide-react'

/* ── Flywheel visual ─────────────────────────────────────────── */
function Flywheel() {
  const [ref, visible] = useInView({ threshold: 0.15 })
  const steps = [
    { label: 'Agricultor usa la plataforma', color: '#3d9132', angle: 0 },
    { label: 'Genera datos y consultas', color: '#2570e8', angle: 60 },
    { label: 'El conocimiento se centraliza', color: '#7d4f27', angle: 120 },
    { label: 'Las respuestas mejoran', color: '#0f766e', angle: 180 },
    { label: 'Más agricultores se suman', color: '#6d28d9', angle: 240 },
    { label: 'El ecosistema se fortalece', color: '#3d9132', angle: 300 },
  ]

  const cx = 50, cy = 50, r = 32
  const toRad = deg => (deg - 90) * Math.PI / 180
  const nodePos = angle => ({
    x: cx + r * Math.cos(toRad(angle)),
    y: cy + r * Math.sin(toRad(angle)),
  })

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
    >
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="text-center mb-4">
          <span className="text-sm font-semibold text-gray-700">El ciclo del ecosistema AgroHub UC</span>
        </div>
        <svg viewBox="0 0 100 100" className="w-full aspect-square max-w-xs mx-auto">
          {/* Outer ring */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5f0e3" strokeWidth="0.8" strokeDasharray="3 2" />
          {/* Center */}
          <circle cx={cx} cy={cy} r="10" fill="#3d9132" opacity="0.9" />
          <text x={cx} y={cy - 1.5} textAnchor="middle" fontSize="3" fill="white" fontWeight="bold" fontFamily="Inter,sans-serif">AgroHub</text>
          <text x={cx} y={cy + 4} textAnchor="middle" fontSize="2.5" fill="white" fontFamily="Inter,sans-serif">UC</text>
          {/* Arrows on ring */}
          {[30, 90, 150, 210, 270, 330].map((angle, i) => {
            const pos = nodePos(angle)
            return (
              <g key={i}>
                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="30s" repeatCount="indefinite" />
                <polygon
                  points="0,-1.2 1,-0.3 -1,-0.3"
                  fill="#86efac"
                  opacity="0.6"
                  transform={`translate(${pos.x},${pos.y}) rotate(${angle})`}
                />
              </g>
            )
          })}
          {/* Step nodes */}
          {steps.map((step, i) => {
            const pos = nodePos(step.angle)
            const innerPos = { x: cx + (r * 0.46) * Math.cos(toRad(step.angle)), y: cy + (r * 0.46) * Math.sin(toRad(step.angle)) }
            return (
              <g key={i}>
                {/* Line from center to node */}
                <line x1={cx} y1={cy} x2={innerPos.x} y2={innerPos.y} stroke={step.color} strokeWidth="0.4" opacity="0.3" />
                {/* Node circle */}
                <circle cx={pos.x} cy={pos.y} r="6" fill={step.color} opacity="0.9">
                  <animate attributeName="r" values="5.5;7;5.5" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
                </circle>
                <circle cx={pos.x} cy={pos.y} r="9" fill={step.color} opacity="0.12">
                  <animate attributeName="r" values="8;11;8" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
                </circle>
                {/* Label */}
                {(() => {
                  const labelR = r + 12
                  const lx = cx + labelR * Math.cos(toRad(step.angle))
                  const ly = cy + labelR * Math.sin(toRad(step.angle))
                  const anchor = lx < cx - 2 ? 'end' : lx > cx + 2 ? 'start' : 'middle'
                  const words = step.label.split(' ')
                  const mid = Math.ceil(words.length / 2)
                  const line1 = words.slice(0, mid).join(' ')
                  const line2 = words.slice(mid).join(' ')
                  return (
                    <g>
                      <text x={lx} y={ly - 1.5} textAnchor={anchor} fontSize="3.2" fill="#374151" fontFamily="Inter,sans-serif" fontWeight="600">
                        {line1}
                      </text>
                      <text x={lx} y={ly + 2.5} textAnchor={anchor} fontSize="3" fill="#6b7280" fontFamily="Inter,sans-serif">
                        {line2}
                      </text>
                    </g>
                  )
                })()}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

/* ── Growth stats ───────────────────────────────────────────── */
function GrowthCard({ icon: Icon, color, bg, value, label, detail, index }) {
  const [ref, visible] = useInView({ threshold: 0.15 })
  return (
    <div
      ref={ref}
      className={`bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-3 shadow-sm transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
        <Icon size={20} className={color} />
      </div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div>
        <div className="font-semibold text-gray-900 text-sm">{label}</div>
        <div className="text-gray-500 text-xs mt-0.5">{detail}</div>
      </div>
    </div>
  )
}

const growthStats = [
  { icon: Users, color: 'text-agro-green-600', bg: 'bg-agro-green-50', value: '1→N', label: 'Agricultores conectados', detail: 'Cada nuevo usuario enriquece la red para todos.' },
  { icon: Database, color: 'text-agro-blue-600', bg: 'bg-agro-blue-50', value: '+∞', label: 'Base de conocimiento', detail: 'Crece con cada consulta, dato y capacitación registrada.' },
  { icon: TrendingUp, color: 'text-agro-earth-600', bg: 'bg-agro-earth-50', value: '↑', label: 'Calidad de respuestas', detail: 'Las recomendaciones mejoran con más datos territoriales.' },
  { icon: RefreshCw, color: 'text-teal-600', bg: 'bg-teal-50', value: '∞', label: 'Ciclo de aprendizaje', detail: 'El ecosistema no se detiene. Aprende y se adapta continuamente.' },
]

/* ── Actor network ──────────────────────────────────────────── */
const actors = [
  { icon: Sprout, color: 'text-agro-green-700', bg: 'bg-agro-green-100', label: 'Agricultores', sub: 'Usan y aportan datos' },
  { icon: GraduationCap, color: 'text-agro-earth-700', bg: 'bg-agro-earth-100', label: 'Técnicos y expertos', sub: 'Validan y acompañan' },
  { icon: Building2, color: 'text-agro-blue-700', bg: 'bg-agro-blue-100', label: 'Instituciones y UC', sub: 'Estructuran conocimiento' },
  { icon: Users, color: 'text-purple-700', bg: 'bg-purple-100', label: 'Comunidad territorial', sub: 'Comparte y aprende' },
]

export default function EcosystemSection() {
  const [titleRef, titleVisible] = useInView({ threshold: 0.2 })

  return (
    <section id="ecosistema" className="py-24 bg-agro-green-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          ref={titleRef}
          className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <RefreshCw size={13} className="text-agro-green-300" />
            <span className="text-white/90 text-sm font-medium">Ecosistema escalable</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Cada agricultor que se suma hace el sistema más inteligente para todos
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">
            AgroHub UC no es una herramienta estática. Es un ecosistema vivo donde la sinergia
            entre agricultores, datos y conocimiento técnico genera un ciclo de mejora continua
            que crece con el territorio.
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <Flywheel />
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-bold text-white mb-2">El efecto red del conocimiento agrícola</h3>
            {[
              {
                title: 'El conocimiento no desaparece',
                desc: 'Lo que aprende un técnico, una institución o un agricultor queda registrado, estructurado y disponible para toda la red — no solo en la memoria de una persona.',
              },
              {
                title: 'Cada dato mejora las recomendaciones',
                desc: 'A medida que se acumulan registros de sensores, consultas y decisiones, el asistente responde con mayor precisión y contexto local.',
              },
              {
                title: 'El aprendizaje escala sin multiplicar costos',
                desc: 'Un nuevo agricultor que entra a la plataforma accede de inmediato a la experiencia acumulada del territorio. No empieza desde cero.',
              },
              {
                title: 'Replicable a cualquier territorio',
                desc: 'El modelo Centro Demostrativo AgroHub UC puede instalarse en cualquier valle o región con su propia base de conocimiento local.',
              },
            ].map((item, i) => {
              const [ref, vis] = useInView({ threshold: 0.15 })
              return (
                <div
                  key={item.title}
                  ref={ref}
                  className={`flex gap-4 transition-all duration-500 ${vis ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <div className="w-2 h-2 bg-agro-green-400 rounded-full mt-2 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-1">{item.title}</h4>
                    <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Growth stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {growthStats.map((s, i) => (
            <GrowthCard key={s.label} {...s} index={i} />
          ))}
        </div>

        {/* Actor row */}
        <div className="bg-white/8 border border-white/15 rounded-2xl p-6">
          <p className="text-white/50 text-xs uppercase tracking-widest font-medium mb-5 text-center">Los actores del ecosistema</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {actors.map((actor, i) => {
              const [ref, vis] = useInView({ threshold: 0.1 })
              const Icon = actor.icon
              return (
                <div
                  key={actor.label}
                  ref={ref}
                  className={`flex flex-col items-center gap-2 text-center transition-all duration-500 ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className={`w-12 h-12 rounded-2xl ${actor.bg} flex items-center justify-center`}>
                    <Icon size={22} className={actor.color} />
                  </div>
                  <div className="text-white font-semibold text-sm">{actor.label}</div>
                  <div className="text-white/45 text-xs">{actor.sub}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
