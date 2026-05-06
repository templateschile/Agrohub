import { useInView } from '../hooks/useInView'

const stages = [
  {
    number: '01',
    title: 'Centro Demostrativo',
    subtitle: 'La base que no se toca',
    description: 'Espacio físico de validación de tecnologías, aprendizaje práctico y confianza territorial. El corazón del proceso.',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=75&auto=format',
    benefit: 'Confianza, cercanía y aprendizaje en terreno',
    color: 'agro-green',
  },
  {
    number: '02',
    title: 'Capacitación Presencial',
    subtitle: 'Conocimiento adaptado',
    description: 'Transferencia de saber técnico adaptado a la realidad local. Aprendizaje colectivo y resolución de dudas en tiempo real.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=75&auto=format',
    benefit: 'Aprendizaje colectivo con expertos locales',
    color: 'agro-blue',
  },
  {
    number: '03',
    title: 'Seguimiento Digital',
    subtitle: 'La continuidad que faltaba',
    description: 'El conocimiento continúa después de la capacitación. Consultas, recomendaciones y material técnico siempre disponible.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=75&auto=format',
    benefit: 'Soporte continuo vía app y asistente',
    color: 'agro-earth',
  },
  {
    number: '04',
    title: 'Monitoreo de Sensores',
    subtitle: 'Datos que iluminan decisiones',
    description: 'Información de campo en tiempo real: humedad del suelo, temperatura, déficit hídrico. Datos que permiten anticiparse.',
    image: 'https://images.unsplash.com/photo-1584194014862-65c4cd8ae0ed?w=600&q=75&auto=format',
    benefit: 'Anticipar y optimizar el recurso hídrico',
    color: 'agro-blue',
  },
  {
    number: '05',
    title: 'Decisiones con Datos',
    subtitle: 'Menos incertidumbre',
    description: 'Información integrada para decidir mejor. Más eficiencia, menos riesgos, mejores resultados con menor incertidumbre.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=75&auto=format',
    benefit: 'Mayor eficiencia y reducción de pérdidas',
    color: 'agro-green',
  },
  {
    number: '06',
    title: 'Comunidad Conectada',
    subtitle: 'El territorio que aprende junto',
    description: 'Productores, técnicos e instituciones compartiendo conocimiento. Colaboración e intercambio para crecer de manera sostenible.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=75&auto=format',
    benefit: 'Red colaborativa y sostenible',
    color: 'agro-earth',
  },
]

function StageCard({ stage, index }) {
  const [ref, visible] = useInView({ threshold: 0.15 })
  return (
    <div
      ref={ref}
      className={`flex flex-col transition-all duration-600 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Number + connector */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-agro-green-600 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow">
          {stage.number}
        </div>
        {index < stages.length - 1 && (
          <div className="flex-1 h-px bg-gradient-to-r from-agro-green-300 to-transparent hidden md:block" />
        )}
      </div>

      {/* Image */}
      <div className="rounded-xl overflow-hidden aspect-[4/3] mb-4">
        <img
          src={stage.image}
          alt={stage.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="text-xs font-semibold text-agro-green-500 uppercase tracking-wider mb-1">
          {stage.subtitle}
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">{stage.title}</h3>
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

  return (
    <section id="modelo" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          ref={titleRef}
          className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-agro-green-50 border border-agro-green-100 rounded-full px-4 py-1.5 mb-5">
            <span className="text-agro-green-700 text-sm font-medium">Transformación progresiva</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Del centro demostrativo al territorio conectado
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            No comparamos lo viejo con lo nuevo. Mostramos cómo cada etapa construye sobre la anterior
            para lograr una agricultura más resiliente y mejor informada.
          </p>
        </div>

        {/* Stages grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {stages.map((stage, i) => (
            <StageCard key={stage.number} stage={stage} index={i} />
          ))}
        </div>

        {/* Bottom callout */}
        <div className="mt-16 bg-agro-green-50 border border-agro-green-100 rounded-2xl p-8 text-center max-w-3xl mx-auto">
          <p className="text-agro-green-800 text-lg font-medium leading-relaxed">
            "No se trata de reemplazar lo que ya funciona, sino de potenciarlo."
          </p>
          <p className="text-agro-green-600 text-base mt-2">
            AgroHub se integra al trabajo del Centro Demostrativo para acompañar al productor en cada paso de su evolución.
          </p>
        </div>
      </div>
    </section>
  )
}
