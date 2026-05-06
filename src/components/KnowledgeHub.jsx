import { useInView } from '../hooks/useInView'
import { Users, Building2, Sprout, GraduationCap, Share2, Database, BookOpen, MessageSquare } from 'lucide-react'

const pillars = [
  {
    icon: Database,
    color: 'text-agro-blue-600',
    bg: 'bg-agro-blue-50',
    title: 'Información centralizada',
    desc: 'Registros, documentos, historial de sensores, consultas y decisiones en un solo lugar. El conocimiento deja de vivir en carpetas, cuadernos o correos.',
  },
  {
    icon: MessageSquare,
    color: 'text-agro-green-600',
    bg: 'bg-agro-green-50',
    title: 'Aprendizaje orgánico',
    desc: 'La capacitación ocurre en el uso diario. Cada consulta es una oportunidad de aprender. Los agricultores avanzan a su propio ritmo, con apoyo experto.',
  },
  {
    icon: BookOpen,
    color: 'text-agro-earth-600',
    bg: 'bg-agro-earth-50',
    title: 'Conocimiento validado',
    desc: 'Las fuentes que alimentan el asistente son documentos técnicos verificados, experiencias de campo reales y el saber acumulado del territorio.',
  },
  {
    icon: Users,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    title: 'Colaboración territorial',
    desc: 'Agricultores, técnicos, extensionistas e instituciones en una red viva. El conocimiento puede permanecer privado o compartirse progresivamente.',
  },
]

function PillarItem({ item, index }) {
  const [ref, vis] = useInView({ threshold: 0.15 })
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
  { id: 'hub', x: 50, y: 50, label: 'Base de\nconocimiento', size: 22, color: '#2d7325', ring: '#86efac' },
  { id: 'p1', x: 22, y: 28, label: 'Agricultor\nSector A', size: 13, color: '#1e4aac', ring: '#93cbfb' },
  { id: 'p2', x: 78, y: 26, label: 'Agricultor\nSector B', size: 13, color: '#1e4aac', ring: '#93cbfb' },
  { id: 'p3', x: 16, y: 66, label: 'Agricultor\nSector C', size: 13, color: '#1e4aac', ring: '#93cbfb' },
  { id: 'p4', x: 84, y: 68, label: 'Agricultor\nSector D', size: 13, color: '#1e4aac', ring: '#93cbfb' },
  { id: 'tec', x: 34, y: 14, label: 'Equipo\nTécnico', size: 14, color: '#7d4f27', ring: '#d4b27a' },
  { id: 'uc', x: 66, y: 12, label: 'UC\nAcademia', size: 14, color: '#6d28d9', ring: '#c4b5fd' },
  { id: 'com', x: 50, y: 86, label: 'Comunidad\nAgrícola', size: 15, color: '#0f766e', ring: '#5eead4' },
]
const edges = [
  ['hub','p1'],['hub','p2'],['hub','p3'],['hub','p4'],
  ['hub','tec'],['hub','uc'],['hub','com'],
  ['tec','uc'],['p1','com'],['p2','p4'],
]
const getPos = id => nodes.find(n => n.id === id)

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
            <span className="text-teal-700 text-sm font-medium">Centralización y colaboración</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            El conocimiento agrícola en un solo lugar, al servicio de todos
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            AgroHub centraliza lo que antes estaba disperso — en documentos, en la memoria de técnicos,
            en cuadernos de campo — y lo convierte en un recurso vivo, accesible y colaborativo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Map */}
          <div
            ref={mapRef}
            className={`transition-all duration-700 ${mapVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-700">Red de conocimiento compartido</span>
                <span className="text-xs text-gray-400">Valle de Choapa · AgroHub</span>
              </div>
              <svg viewBox="0 0 100 100" className="w-full aspect-square">
                {edges.map(([a, b]) => {
                  const A = getPos(a), B = getPos(b)
                  if (!A || !B) return null
                  return (
                    <line key={`${a}-${b}`} x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                      stroke="#d1fae5" strokeWidth="0.6" strokeDasharray="2 1.5" opacity="0.8" />
                  )
                })}
                {nodes.map(node => (
                  <g key={node.id}>
                    <circle cx={node.x} cy={node.y} r={node.size / 2 + 2} fill={node.ring} opacity="0.25">
                      <animate attributeName="r" values={`${node.size/2+1};${node.size/2+3};${node.size/2+1}`}
                        dur={`${2.5 + (node.x % 1.8)}s`} repeatCount="indefinite"/>
                    </circle>
                    <circle cx={node.x} cy={node.y} r={node.size / 2} fill={node.color} opacity="0.9" />
                    <text x={node.x} y={node.y + node.size / 2 + 4} textAnchor="middle"
                      fontSize="3.2" fill="#374151" fontFamily="Inter,sans-serif" fontWeight="500">
                      {node.label.split('\n')[0]}
                    </text>
                    <text x={node.x} y={node.y + node.size / 2 + 7.5} textAnchor="middle"
                      fontSize="2.8" fill="#6b7280" fontFamily="Inter,sans-serif">
                      {node.label.split('\n')[1]}
                    </text>
                  </g>
                ))}
              </svg>
              <p className="text-center text-xs text-gray-400 mt-2">
                Todos conectados a la misma base de conocimiento
              </p>
            </div>
          </div>

          {/* Pillars */}
          <div className="flex flex-col gap-7">
            {pillars.map((item, i) => (
              <PillarItem key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
