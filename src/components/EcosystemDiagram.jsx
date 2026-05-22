import { useInView } from '../hooks/useInView'
import { GitPullRequest, Database, Cpu, Users, Lock, Globe, Coins, Code2, ArrowRight } from 'lucide-react'

const hubs = [
  { id: 'hub-a', label: 'Hub Norte', x: 18, y: 28, color: '#2d7325', ring: '#86efac' },
  { id: 'hub-b', label: 'Hub Centro', x: 50, y: 18, color: '#2d7325', ring: '#86efac' },
  { id: 'hub-c', label: 'Hub Sur', x: 82, y: 28, color: '#2d7325', ring: '#86efac' },
  { id: 'hub-d', label: 'Hub Maule', x: 25, y: 72, color: '#2d7325', ring: '#86efac' },
  { id: 'hub-e', label: 'Hub O\'Higgins', x: 75, y: 72, color: '#2d7325', ring: '#86efac' },
  { id: 'core', label: 'Backend\nAPI', x: 50, y: 50, color: '#1e4aac', ring: '#93cbfb', isCore: true },
]

const edges = [
  ['hub-a', 'core'], ['hub-b', 'core'], ['hub-c', 'core'],
  ['hub-d', 'core'], ['hub-e', 'core'],
]

const getPos = id => hubs.find(n => n.id === id)

const features = [
  {
    icon: GitPullRequest,
    color: 'text-agro-green-300',
    bg: 'bg-agro-green-900/60',
    border: 'border-agro-green-700',
    title: 'Features compartidos via PR',
    desc: 'Cada hub puede desarrollar mejoras y proponerlas al ecosistema mediante Pull Request. Si es aprobado, queda disponible para toda la red.',
  },
  {
    icon: Database,
    color: 'text-agro-blue-300',
    bg: 'bg-agro-blue-900/60',
    border: 'border-agro-blue-700',
    title: 'Data privada o compartida',
    desc: 'Cada hub es dueño de su información. Puede mantenerla privada o disponibilizarla voluntariamente a otros hubs de la red.',
  },
  {
    icon: Cpu,
    color: 'text-amber-300',
    bg: 'bg-amber-900/50',
    border: 'border-amber-700',
    title: 'IA con tokens por hub',
    desc: 'Cada hub tiene un límite de tokens de IA incluidos. Se pueden comprar tokens adicionales o integrar un modelo propio sin consumir el pool compartido.',
  },
  {
    icon: Lock,
    color: 'text-rose-300',
    bg: 'bg-rose-900/50',
    border: 'border-rose-700',
    title: 'Soporte condicionado',
    desc: 'Si se edita el código sin hacer PR al ecosistema, se pierde el soporte oficial. El código editado pasa a ser responsabilidad del hub.',
  },
  {
    icon: Code2,
    color: 'text-purple-300',
    bg: 'bg-purple-900/50',
    border: 'border-purple-700',
    title: 'Backend API cotizable aparte',
    desc: 'El backend (Node.js) se cotiza por separado e incluye todos los features desarrollados por la red de hubs hasta la fecha de entrega.',
  },
  {
    icon: Globe,
    color: 'text-teal-300',
    bg: 'bg-teal-900/50',
    border: 'border-teal-700',
    title: 'Flutter + React incluidos',
    desc: 'La licencia incluye el panel admin en React y la app móvil en Flutter. Sin backend: acceso a la red de features existentes.',
  },
]

export default function EcosystemDiagram() {
  const [ref, visible] = useInView({ threshold: 0.1 })
  const [cardsRef, cardsVisible] = useInView({ threshold: 0.05 })

  return (
    <section className="py-24 bg-agro-green-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-14">

        {/* Header */}
        <div
          ref={ref}
          className={`max-w-2xl mx-auto text-center mb-14 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 mb-5">
            <Globe size={13} className="text-agro-green-300" />
            <span className="text-white/85 text-sm font-medium">Red de hubs AgroHub</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Un ecosistema vivo de hubs interconectados
          </h2>
          <p className="text-white/55 text-base leading-relaxed">
            Cada hub es independiente pero comparte un backend común, un stack de features colaborativo
            y una red de datos voluntariamente compartida.
          </p>
        </div>

        {/* Network diagram */}
        <div className="max-w-2xl mx-auto mb-14">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-semibold text-white/60">Red de hubs — visión global</span>
              <span className="text-[10px] text-agro-green-400 bg-agro-green-900/60 border border-agro-green-700 rounded-full px-2.5 py-0.5">En producción</span>
            </div>
            <svg viewBox="0 0 100 100" className="w-full aspect-square">
              {/* Edges */}
              {edges.map(([a, b]) => {
                const A = getPos(a), B = getPos(b)
                if (!A || !B) return null
                return (
                  <line key={`${a}-${b}`}
                    x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                    stroke="#86efac" strokeWidth="0.5"
                    strokeDasharray="2 1.5" opacity="0.4"
                  />
                )
              })}
              {/* Nodes */}
              {hubs.map(node => (
                <g key={node.id}>
                  {/* Pulse ring */}
                  <circle cx={node.x} cy={node.y} r={node.isCore ? 10 : 7} fill={node.ring} opacity="0.15">
                    <animate attributeName="r"
                      values={node.isCore ? "9;12;9" : "6;8.5;6"}
                      dur={node.isCore ? "2.5s" : "3s"} repeatCount="indefinite" />
                  </circle>
                  {/* Node */}
                  <circle cx={node.x} cy={node.y} r={node.isCore ? 8 : 5.5}
                    fill={node.color} opacity="0.9" />
                  {/* Label */}
                  {node.label.split('\n').map((line, li) => (
                    <text key={li}
                      x={node.x} y={node.y + (node.isCore ? 8 : 5.5) + 3.5 + li * 3.5}
                      textAnchor="middle" fontSize={node.isCore ? "3.5" : "3"}
                      fill={node.isCore ? "#93cbfb" : "#bbf7d0"}
                      fontFamily="Inter,sans-serif" fontWeight="600">
                      {line}
                    </text>
                  ))}
                </g>
              ))}
            </svg>
            <p className="text-center text-xs text-white/30 mt-1">
              Cada nodo verde es un hub autónomo · El nodo azul es el backend compartido
            </p>
          </div>
        </div>

        {/* Feature cards */}
        <div
          ref={cardsRef}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-700 ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className={`${f.bg} border ${f.border} rounded-2xl p-5 flex flex-col gap-3`}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Icon size={17} className={f.color} />
                  </div>
                  <h3 className="text-white font-semibold text-sm leading-tight">{f.title}</h3>
                </div>
                <p className="text-white/50 text-xs leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center flex flex-wrap justify-center gap-4">
          <a
            href="/terminos"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white/85 font-semibold text-sm px-6 py-3 rounded-full transition-colors"
          >
            Leer Términos y Condiciones <ArrowRight size={14} />
          </a>
          <a
            href="/precios"
            className="inline-flex items-center gap-2 bg-agro-green-600 hover:bg-agro-green-500 text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors"
          >
            Ver cotizador <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
