import { useInView } from '../hooks/useInView'
import { Users, Building2, Sprout, GraduationCap, Share2, Lock, Unlock } from 'lucide-react'

const knowledgeFeatures = [
  {
    icon: Lock,
    color: 'text-agro-earth-600',
    bg: 'bg-agro-earth-50',
    title: 'Conocimiento privado',
    desc: 'Cada productor puede mantener sus datos y consultas de forma privada. Solo él y su técnico acceden.',
  },
  {
    icon: Unlock,
    color: 'text-agro-green-600',
    bg: 'bg-agro-green-50',
    title: 'Compartir progresivamente',
    desc: 'Cuando el productor decide, puede aportar su experiencia a la red territorial para que otros aprendan.',
  },
  {
    icon: Building2,
    color: 'text-agro-blue-600',
    bg: 'bg-agro-blue-50',
    title: 'Gestión institucional',
    desc: 'Las instituciones pueden publicar documentos, crear capacitaciones y acceder a estadísticas agregadas.',
  },
  {
    icon: Users,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    title: 'Comunidad activa',
    desc: 'Productores, técnicos e instituciones colaborando en una red viva que crece con el territorio.',
  },
]

function KnowledgeFeatureItem({ item, index }) {
  const [ref, vis] = useInView({ threshold: 0.2 })
  const Icon = item.icon
  return (
    <div
      ref={ref}
      className={`flex gap-4 transition-all duration-500 ${vis ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
        <Icon size={20} className={item.color} />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-base mb-1">{item.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
      </div>
    </div>
  )
}

const nodes = [
  { id: 'cd', x: 50, y: 50, label: 'Centro\nDemostrativo', icon: Building2, size: 20, color: '#2d7325', ring: '#86efac' },
  { id: 'p1', x: 22, y: 30, label: 'Productor\nSector A', icon: Sprout, size: 14, color: '#1e4aac', ring: '#93cbfb' },
  { id: 'p2', x: 78, y: 28, label: 'Productor\nSector B', icon: Sprout, size: 14, color: '#1e4aac', ring: '#93cbfb' },
  { id: 'p3', x: 18, y: 68, label: 'Productor\nSector C', icon: Sprout, size: 14, color: '#1e4aac', ring: '#93cbfb' },
  { id: 'p4', x: 82, y: 70, label: 'Productor\nSector D', icon: Sprout, size: 14, color: '#1e4aac', ring: '#93cbfb' },
  { id: 't1', x: 35, y: 16, label: 'Equipo\nTécnico', icon: GraduationCap, size: 15, color: '#7d4f27', ring: '#d4b27a' },
  { id: 'inst', x: 65, y: 14, label: 'Institución\nRegional', icon: Building2, size: 15, color: '#6d28d9', ring: '#c4b5fd' },
  { id: 'p5', x: 50, y: 85, label: 'Comunidad\nAgrícola', icon: Users, size: 16, color: '#0f766e', ring: '#5eead4' },
]

const edges = [
  ['cd', 'p1'], ['cd', 'p2'], ['cd', 'p3'], ['cd', 'p4'],
  ['cd', 't1'], ['cd', 'inst'], ['cd', 'p5'],
  ['t1', 'inst'], ['p1', 'p5'], ['p2', 'p4'],
]

function getPos(id) {
  return nodes.find(n => n.id === id)
}

export default function KnowledgeHub() {
  const [titleRef, titleVisible] = useInView({ threshold: 0.2 })
  const [mapRef, mapVisible] = useInView({ threshold: 0.1 })

  return (
    <section id="conocimiento" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          ref={titleRef}
          className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-full px-4 py-1.5 mb-5">
            <Share2 size={14} className="text-teal-600" />
            <span className="text-teal-700 text-sm font-medium">Conocimiento colaborativo</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Un territorio que aprende junto
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            El conocimiento puede permanecer privado o compartirse progresivamente.
            Cada productor decide qué aporta y qué accede.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Map visualization */}
          <div
            ref={mapRef}
            className={`transition-all duration-700 ${mapVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-700">Red del territorio</span>
                <span className="text-xs text-gray-400">Valle de Choapa · Mapa colaborativo</span>
              </div>
              <svg viewBox="0 0 100 100" className="w-full aspect-square">
                {/* Edge lines */}
                {edges.map(([a, b]) => {
                  const nodeA = getPos(a)
                  const nodeB = getPos(b)
                  if (!nodeA || !nodeB) return null
                  return (
                    <line
                      key={`${a}-${b}`}
                      x1={nodeA.x} y1={nodeA.y}
                      x2={nodeB.x} y2={nodeB.y}
                      stroke="#d1fae5" strokeWidth="0.6"
                      strokeDasharray="2 1.5"
                      opacity="0.8"
                    />
                  )
                })}
                {/* Nodes */}
                {nodes.map(node => (
                  <g key={node.id}>
                    <circle cx={node.x} cy={node.y} r={node.size / 2 + 2} fill={node.ring} opacity="0.3">
                      <animate attributeName="r" values={`${node.size/2+1};${node.size/2+3};${node.size/2+1}`} dur={`${2.5 + Math.random()}s`} repeatCount="indefinite"/>
                    </circle>
                    <circle cx={node.x} cy={node.y} r={node.size / 2} fill={node.color} opacity="0.9" />
                    <text x={node.x} y={node.y + node.size / 2 + 4} textAnchor="middle" fontSize="3.2" fill="#374151" fontFamily="Inter,sans-serif" fontWeight="500">
                      {node.label.split('\n')[0]}
                    </text>
                    <text x={node.x} y={node.y + node.size / 2 + 7.5} textAnchor="middle" fontSize="2.8" fill="#6b7280" fontFamily="Inter,sans-serif">
                      {node.label.split('\n')[1]}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Features list */}
          <div className="flex flex-col gap-6">
            {knowledgeFeatures.map((item, i) => (
              <KnowledgeFeatureItem key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
