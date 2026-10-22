// Los módulos de AgroHubs, cada uno con su página. Fuente única para el menú, el índice /modulos,
// la vista previa del inicio y las páginas de los módulos nuevos (ModuloPagina).
// Los cinco primeros tienen página propia hecha a mano; el resto usa `pagina`.
import {
  BarChart2, Sparkles, BellRing, CloudSunRain, FolderOpen, Satellite, Calculator, Calendar, ShoppingBag,
} from 'lucide-react'
import IconoDron from '../components/IconoDron'

export const MODULOS = [
  {
    slug: 'dashboard', href: '/dashboard', icon: BarChart2, destacado: true,
    titulo: 'Dashboard y Sensores',
    resumen: 'Humedad de suelo, clima y riego en tiempo real, con los sensores de la marca que ya usas.',
  },
  {
    slug: 'ai-chat', href: '/ai-chat', icon: Sparkles, destacado: true,
    titulo: 'Asistente IA',
    resumen: 'Pregunta en lenguaje simple y recibe respuestas con los datos de tu predio y fuentes confiables.',
  },
  {
    slug: 'recomendaciones', href: '/recomendaciones', icon: BellRing, destacado: true,
    titulo: 'Recomendaciones por clima',
    resumen: 'Avisos de heladas, calor, lluvia, viento y riego para tu predio, revisados por tu centro demostrativo.',
    pagina: {
      badge: 'Recomendaciones por clima',
      titulo: 'Avisos a tiempo,', destacado: 'antes de que el clima decida por ti',
      bajada: 'Dos veces al día AgroHubs revisa el pronóstico de cada predio y prepara recomendaciones concretas para tu cultivo. Tu centro demostrativo las aprueba, o se envían solas si así lo eliges.',
      features: [
        { titulo: 'Heladas', desc: 'Aviso con anticipación cuando la mínima baja de 2 °C, con las medidas de control a activar.' },
        { titulo: 'Calor', desc: 'Sobre 32 °C: ajusta horarios de riego y evita aplicaciones en las horas de más calor.' },
        { titulo: 'Lluvia', desc: 'Posterga fertilizaciones y aplicaciones foliares, y revisa drenajes antes de que llueva.' },
        { titulo: 'Viento', desc: 'Con viento fuerte no conviene aplicar ni volar drones: te avisamos qué días evitar.' },
        { titulo: 'Riego con ETo', desc: 'Cuántos milímetros reponer según la evapotranspiración y el coeficiente de tu cultivo.' },
        { titulo: 'Ventana de aplicación', desc: 'El mejor momento de la semana para aplicar: poco viento, sin lluvia y temperatura adecuada.' },
      ],
      pasos: [
        'AgroHubs cruza el pronóstico de tu predio con tu cultivo y tus datos.',
        'Prepara la recomendación con un texto claro y una acción concreta.',
        'Tu centro demostrativo la revisa y aprueba, o se envía automáticamente.',
        'Te llega a la app y al panel, con aviso en la campana.',
      ],
    },
  },
  {
    slug: 'clima', href: '/clima', icon: CloudSunRain,
    titulo: 'Clima y agrometeorología',
    resumen: 'Pronóstico por predio, estaciones agrometeorológicas cercanas y evapotranspiración.',
    pagina: {
      badge: 'Clima y agrometeorología',
      titulo: 'El clima de tu predio,', destacado: 'no el de la ciudad',
      bajada: 'Pronóstico a la ubicación exacta de tu campo, datos de estaciones agrometeorológicas cercanas y los indicadores que importan para regar y aplicar.',
      features: [
        { titulo: 'Pronóstico por predio', desc: 'Temperatura, lluvia, viento y humedad para las coordenadas de tu campo.' },
        { titulo: 'Estaciones cercanas', desc: 'Datos de la red agrometeorológica junto a tus propios sensores.' },
        { titulo: 'Evapotranspiración', desc: 'ETo diaria para calcular cuánta agua reponer en cada sector.' },
        { titulo: 'Alertas', desc: 'Heladas, calor y lluvia se convierten en recomendaciones para tu cultivo.' },
      ],
      pasos: [
        'Registras tu predio con su ubicación.',
        'AgroHubs consulta el pronóstico y las estaciones cercanas.',
        'Ves el clima en la app y en el panel, y recibes las alertas.',
      ],
    },
  },
  {
    slug: 'drones', href: '/drones', icon: IconoDron, destacado: true,
    titulo: 'Drones agrícolas (DronX)',
    resumen: 'Solicita aplicaciones, mapas NDVI, conteo de plantas y más. Integración con DronX ya operativa.',
    pagina: {
      badge: 'Drones agrícolas · integración DronX',
      titulo: 'Drones agrícolas on demand,', destacado: 'desde tu predio',
      bajada: 'AgroHubs ya está integrado con DronX: pides el servicio desde la app o el panel y la solicitud llega directo a la red de operadores, con los datos de tu predio.',
      aviso: {
        titulo: 'Ya tenemos integración con DronX',
        texto: 'DronX es un desarrollo de OlaDigital, con apps para iOS y Android, para solicitar drones agrícolas on demand. AgroHubs se conecta con DronX: tus solicitudes viajan con los datos del predio y su estado se actualiza solo en la app.',
      },
      features: [
        { titulo: 'Aplicación con dron', desc: 'Fumigación y aplicación de productos por hectárea, también en pendientes.' },
        { titulo: 'Mapas NDVI', desc: 'Vigor del cultivo y detección temprana de estrés hídrico o plagas.' },
        { titulo: 'Mapeo y topografía', desc: 'Ortofotos y modelos del terreno para planificar riego y plantación.' },
        { titulo: 'Conteo de plantas', desc: 'Plantas y fallas por cuartel para estimar producción y replantes.' },
        { titulo: 'Termografía', desc: 'Cámara térmica para revisar la uniformidad del riego.' },
        { titulo: 'Seguimiento', desc: 'Sigues el estado de cada solicitud y recibes mapas y reportes en AgroHubs.' },
      ],
      pasos: [
        'Pides el servicio desde la app o el panel de tu predio: cultivo, hectáreas, comuna y fecha.',
        'La solicitud llega a DronX con los datos de tu predio.',
        'Un operador de la red DronX la cotiza y agenda el vuelo.',
        'Sigues el estado en AgroHubs y recibes los mapas y reportes.',
      ],
    },
  },
  {
    slug: 'documentos', href: '/documentos', icon: FolderOpen, destacado: true,
    titulo: 'Documentos',
    resumen: 'Protocolos, guías técnicas e historiales del campo, organizados y fáciles de encontrar.',
  },
  {
    slug: 'fuentes', href: '/fuentes', icon: Satellite,
    titulo: 'Fuentes de información',
    resumen: 'INIA, agrometeorología y otras fuentes técnicas conectadas, junto a los documentos de tu hub.',
    pagina: {
      badge: 'Fuentes de información',
      titulo: 'Información confiable,', destacado: 'en un solo lugar',
      bajada: 'AgroHubs reúne publicaciones técnicas, datos agrometeorológicos y fuentes de tu territorio para que el Asistente IA y tu equipo respondan con respaldo.',
      features: [
        { titulo: 'Publicaciones técnicas', desc: 'Boletines y guías de instituciones agrícolas, buscables por tema y cultivo.' },
        { titulo: 'Agrometeorología', desc: 'Datos de estaciones públicas integrados al clima de tu predio.' },
        { titulo: 'Fuentes de tu territorio', desc: 'Conectores a instituciones locales, ministerios y universidades de cada hub.' },
        { titulo: 'Repositorio propio', desc: 'Documentos del centro demostrativo, públicos o privados.' },
      ],
      pasos: [
        'Elegimos con tu hub las fuentes relevantes para su territorio.',
        'Las conectamos por API o con un recolector automático.',
        'Quedan disponibles en el buscador y en las respuestas del Asistente IA.',
      ],
    },
  },
  {
    slug: 'calculadoras', href: '/calculadoras', icon: Calculator,
    titulo: 'Calculadoras',
    resumen: 'Dosis de fertilizantes, enmiendas y aplicaciones, con los parámetros de tu cultivo.',
    pagina: {
      badge: 'Calculadoras',
      titulo: 'Dosis correctas,', destacado: 'sin planillas',
      bajada: 'Calculadoras agronómicas para fertilización, enmiendas y aplicaciones, pensadas para usarse en terreno desde el celular.',
      features: [
        { titulo: 'Fertilización', desc: 'Cuánto aplicar según cultivo, etapa y superficie.' },
        { titulo: 'Enmiendas', desc: 'Dosis de cal y otras correcciones de suelo.' },
        { titulo: 'Aplicaciones', desc: 'Preparación de mezclas y volúmenes por hectárea.' },
        { titulo: 'Parámetros propios', desc: 'Cada hub puede ajustar las calculadoras a sus cultivos.' },
      ],
      pasos: [
        'Eliges la calculadora y tu cultivo.',
        'Ingresas superficie y etapa.',
        'Obtienes la dosis y la guardas en tu predio.',
      ],
    },
  },
  {
    slug: 'eventos', href: '/eventos', icon: Calendar, destacado: true,
    titulo: 'Eventos y Capacitaciones',
    resumen: 'Días de campo, talleres y capacitaciones del centro demostrativo, con inscripción.',
  },
  {
    slug: 'tienda', href: '/tienda', icon: ShoppingBag,
    titulo: 'Mercado de Cosecha',
    resumen: 'Vende tu cosecha y accede a insumos y servicios de terceros desde tu hub.',
  },
]

export const moduloPorSlug = (slug) => MODULOS.find((m) => m.slug === slug)
