import { useInView } from '../hooks/useInView'
import { Cpu, Database, Users, GitMerge, CheckCircle } from 'lucide-react'

/* ── The 3-level ladder ─────────────────────────────────────────── */
const levels = [
  {
    label: 'Kit tecnológico',
    sub: 'Equipos, sensores o instrumentos instalados.',
    outcome: 'Genera datos.',
    active: false,
  },
  {
    label: 'Centro Demostrativo',
    sub: 'Uso práctico de esos instrumentos en terreno, con capacitación y acompañamiento.',
    outcome: 'Genera aprendizaje.',
    active: false,
  },
  {
    label: 'AgroHub UC',
    sub: 'Sistema integrado: tecnología, datos, personas, procesos y comercialización.',
    outcome: 'Genera decisiones e impacto.',
    active: true,
  },
]

/* ── 4 elements of a Centro Demostrativo ───────────────────────── */
const elements = [
  {
    icon: Cpu,
    color: 'text-agro-blue-600',
    bg: 'bg-agro-blue-50',
    title: 'Tecnología',
    desc: 'Sensores, instrumentos, plataforma, IA, visualización de datos y marketplace.',
  },
  {
    icon: Database,
    color: 'text-agro-green-600',
    bg: 'bg-agro-green-50',
    title: 'Datos',
    desc: 'Humedad, temperatura, viento, evapotranspiración, alertas e historial productivo.',
  },
  {
    icon: Users,
    color: 'text-agro-earth-600',
    bg: 'bg-agro-earth-50',
    title: 'Personas',
    desc: 'Agricultores, técnicos, extensionistas, estudiantes, instituciones y compradores.',
  },
  {
    icon: GitMerge,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    title: 'Procesos',
    desc: 'Uso, interpretación, capacitación, acompañamiento, comercialización y decisiones.',
  },
]

/* ── 6-stage progressive flow ───────────────────────────────────── */
const stages = [
  {
    number: '01',
    title: 'Centro Demostrativo',
    subtitle: 'La base que no se toca',
    description: 'Espacio físico de validación de tecnologías, aprendizaje práctico y confianza territorial. El corazón del proceso.',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=75&auto=format',
    benefit: 'Confianza, cercanía y aprendizaje en terreno',
  },
  {
    number: '02',
    title: 'Capacitación Presencial',
    subtitle: 'Conocimiento adaptado',
    description: 'Transferencia de conocimiento técnico adaptado a la realidad local. Formación aplicada con casos reales y lenguaje agrícola.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=75&auto=format',
    benefit: 'Aprendizaje colectivo con expertos locales',
  },
  {
    number: '03',
    title: 'Seguimiento Digital',
    subtitle: 'La continuidad que faltaba',
    description: 'El conocimiento continúa después de la capacitación. Consultas, recomendaciones y material técnico siempre disponible.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=75&auto=format',
    benefit: 'Soporte continuo vía app y asistente',
  },
  {
    number: '04',
    title: 'Monitoreo de Sensores',
    subtitle: 'Datos que iluminan decisiones',
    description: 'Humedad del suelo, temperatura, viento y evapotranspiración en tiempo real. El instrumento mide, el dato orienta.',
    image: 'https://images.unsplash.com/photo-1584194014862-65c4cd8ae0ed?w=600&q=75&auto=format',
    benefit: 'Anticipar y optimizar el recurso hídrico',
  },
  {
    number: '05',
    title: 'Decisiones Informadas',
    subtitle: 'Menos incertidumbre',
    description: 'Información integrada para decidir mejor. El dato técnico conversa con la experiencia de campo del agricultor.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=75&auto=format',
    benefit: 'Mayor eficiencia y reducción de pérdidas',
  },
  {
    number: '06',
    title: 'Comunidad Conectada',
    subtitle: 'El territorio que aprende junto',
    description: 'Productores, técnicos e instituciones compartiendo conocimiento. Validación y réplica del modelo a otros agricultores.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=75&auto=format',
    benefit: 'Red colaborativa y modelo escalable',
  },
]

function ElementCard({ el, index }) {
  const [ref, visible] = useInView({ threshold: 0.15 })
  const Icon = el.icon
  return (
    <div
      ref={ref}
      className={`bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 shadow-sm transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className={`w-11 h-11 rounded-xl ${el.bg} flex items-center justify-center`}>
        <Icon size={20} className={el.color} />
      </div>
      <div>
        <div className={`text-xs font-bold uppercase tracking-wider ${el.color} mb-1`}>Elemento {index + 1}</div>
        <h3 className="font-bold text-gray-900 text-base mb-1.5">{el.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{el.desc}</p>
      </div>
      <div className="mt-auto pt-3 border-t border-gray-50 flex items-center gap-2">
        <CheckCircle size={14} className="text-agro-green-500" />
        <span className="text-agro-green-700 text-xs font-medium">Integrado en AgroHub UC</span>
      </div>
    </div>
  )
}

function StageCard({ stage, index }) {
  const [ref, visible] = useInView({ threshold: 0.12 })
  return (
    <div
      ref={ref}
      className={`flex flex-col transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-agro-green-600 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow">
          {stage.number}
        </div>
        {index < stages.length - 1 && (
          <div className="flex-1 h-px bg-gradient-to-r from-agro-green-300 to-transparent hidden md:block" />
        )}
      </div>
      <div className="rounded-xl overflow-hidden aspect-[4/3] mb-4">
        <img
          src={stage.image}
          alt={stage.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex-1">
        <div className="text-xs font-semibold text-agro-green-500 uppercase tracking-wider mb-1">{stage.subtitle}</div>
        <h3 className="font-bold text-gray-900 text-base mb-2">{stage.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-3">{stage.description}</p>
        <div className="inline-flex items-center gap-1.5 bg-agro-green-50 border border-agro-green-100 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 bg-agro-green-500 rounded-full" />
          <span className="text-agro-green-700 text-xs font-medium">{stage.benefit}</span>
        </div>
      </div>
    </div>
  )
}

export default function Transformation() {
  const [titleRef, titleVisible] = useInView({ threshold: 0.2 })
  const [levelsRef, levelsVisible] = useInView({ threshold: 0.15 })
  const [elementsRef, elementsVisible] = useInView({ threshold: 0.15 })

  return (
    <section id="modelo" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Header ── */}
        <div
          ref={titleRef}
          className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-agro-green-50 border border-agro-green-100 rounded-full px-4 py-1.5 mb-5">
            <span className="text-agro-green-700 text-sm font-medium">El modelo Centro Demostrativo</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Qué es un Centro Demostrativo AgroHub UC?
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Un espacio físico y operativo donde se integran tecnologías, conocimiento, agricultores,
            técnicos e instituciones para resolver problemáticas reales del territorio.
            No es solo donde se instalan instrumentos — es donde se aprende, se mide, se valida y se decide.
          </p>
        </div>

        {/* ── 3-level distinction ── */}
        <div
          ref={levelsRef}
          className={`mb-16 transition-all duration-700 ${levelsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="flex flex-col md:flex-row items-stretch gap-0 max-w-4xl mx-auto rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            {levels.map((level, i) => (
              <div
                key={level.label}
                className={`flex-1 p-6 flex flex-col gap-2 ${
                  level.active
                    ? 'bg-agro-green-700 text-white'
                    : 'bg-gray-50 text-gray-700'
                } ${i < levels.length - 1 ? 'border-b md:border-b-0 md:border-r border-gray-100' : ''}`}
              >
                <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${level.active ? 'text-agro-green-300' : 'text-gray-400'}`}>
                  Nivel {i + 1}
                </div>
                <h3 className={`font-bold text-lg ${level.active ? 'text-white' : 'text-gray-600'}`}>{level.label}</h3>
                <p className={`text-sm leading-relaxed flex-1 ${level.active ? 'text-white/75' : 'text-gray-500'}`}>{level.sub}</p>
                <div className={`inline-flex items-center gap-2 mt-2 text-sm font-semibold ${level.active ? 'text-agro-green-200' : 'text-gray-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${level.active ? 'bg-agro-green-300' : 'bg-gray-300'}`} />
                  {level.outcome}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4 Elements ── */}
        <div
          ref={elementsRef}
          className={`mb-20 transition-all duration-700 ${elementsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Los 4 elementos del Centro Demostrativo</h3>
            <p className="text-gray-500">La clave está en que estos elementos no funcionen separados. El valor está en integrarlos.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {elements.map((el, i) => (
              <ElementCard key={el.title} el={el} index={i} />
            ))}
          </div>
        </div>

        {/* ── 6-stage progressive flow ── */}
        <div className="pt-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-agro-green-50 border border-agro-green-100 rounded-full px-4 py-1.5 mb-4">
              <span className="text-agro-green-700 text-sm font-medium">Transformación progresiva</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Del centro al territorio conectado</h3>
            <p className="text-gray-500 max-w-xl mx-auto">Cada etapa construye sobre la anterior para lograr una agricultura más resiliente e informada.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {stages.map((stage, i) => (
              <StageCard key={stage.number} stage={stage} index={i} />
            ))}
          </div>
        </div>

        {/* Callout */}
        <div className="mt-16 bg-agro-green-50 border border-agro-green-100 rounded-2xl p-8 text-center max-w-3xl mx-auto">
          <p className="text-agro-green-800 text-lg font-semibold leading-relaxed">
            "El instrumento mide. El dato orienta. El técnico acompaña. El agricultor valida con su experiencia."
          </p>
          <p className="text-agro-green-600 text-base mt-2">
            La transferencia tecnológica facilita el aprendizaje. La colaboración permite mejorar y replicar.
          </p>
        </div>
      </div>
    </section>
  )
}
