// Los 12 módulos de la app AgroHubs, tal como los ofrece la plataforma
// (templateschile/agrohubs-app: api/src/predios/catalogo.js, MODULOS). Mismas `key`, nombres y textos.
// Fuente única para la portada (AppModulos y el diagrama del ecosistema), el menú, el índice /modulos
// y las páginas de los módulos.
// - `ruta`: página del módulo en este sitio. Las de Dashboard, AI Chat, Documentos, Eventos y Tienda
//   están hechas a mano; el resto la arma ModuloPagina con `pagina`.
// - `corto`: nombre breve para el diagrama del ecosistema.
import {
  Radio, NotebookPen, Sparkles, FolderOpen, Globe, Sun,
  Lightbulb, Flower2, Calculator, CalendarDays, Store,
} from "lucide-react"
import IconoDron from "../components/IconoDron"

export const MODULOS = [
  {
    key: "dashboard_sensores", slug: "dashboard", ruta: "/dashboard", icono: Radio,
    nombre: "Dashboard y sensores", corto: "Sensores",
    descripcion: "Tus estaciones y sensores en un solo panel, con lecturas, gráficos y alertas. Se conecta con las marcas que ya usas.",
  },
  {
    key: "bitacora", slug: "bitacora", ruta: "/bitacora", icono: NotebookPen,
    nombre: "Cuaderno de campo", corto: "Cuaderno de campo",
    descripcion: "La bitácora del predio: labores, aplicaciones, insumos y cosecha desde el celular, por lote.",
    pagina: {
      badge: "Cuaderno de campo (bitácora)",
      titulo: "Lo que pasa en el campo,", destacado: "registrado por lote",
      bajada: "Anota labores, insumos y cosecha desde el celular, en el mismo momento en que ocurren. Cada registro queda asociado al lote (cuartel o sector) y al predio.",
      features: [
        { titulo: "Registro de labores", desc: "Poda, riego, aplicaciones y cualquier labor, con fecha y responsable." },
        { titulo: "Insumos", desc: "Qué se aplicó, cuánto y dónde, para tener el historial a mano." },
        { titulo: "Cosecha", desc: "Lo cosechado en cada lote, para comparar temporadas." },
        { titulo: "Trazabilidad por lote", desc: "El historial completo de cada lote en un solo lugar." },
        { titulo: "Exportación", desc: "Descarga los registros para auditorías, certificaciones o tu asesor." },
      ],
      pasos: [
        "Defines los lotes de tu predio.",
        "Registras labores, insumos y cosecha desde el celular.",
        "Revisas el historial por lote y lo exportas cuando lo necesitas.",
      ],
    },
  },
  {
    key: "chat_ia", slug: "ai-chat", ruta: "/ai-chat", icono: Sparkles,
    nombre: "AI Chat agrícola", corto: "Chat IA",
    descripcion: "Asistente que responde consultas técnicas en lenguaje simple, apoyado en documentos confiables.",
  },
  {
    key: "documentos", slug: "documentos", ruta: "/documentos", icono: FolderOpen,
    nombre: "Biblioteca técnica", corto: "Biblioteca",
    descripcion: "Documentos y fichas técnicas organizados y buscables. Sube los tuyos y decide si son públicos o privados.",
  },
  {
    key: "fuentes", slug: "fuentes", ruta: "/fuentes", icono: Globe,
    nombre: "Fuentes externas", corto: "Fuentes",
    descripcion: "Información de fuentes externas (MODAG, Kadi, INIA y otras) junto a tus datos.",
    pagina: {
      badge: "Fuentes externas",
      titulo: "Boletines, clima y datos públicos,", destacado: "junto a tus datos",
      bajada: "AgroHubs reúne publicaciones técnicas, datos agrometeorológicos y fuentes de tu territorio para que el asistente y tu equipo respondan citando la fuente.",
      features: [
        { titulo: "Publicaciones técnicas", desc: "Boletines y guías de instituciones agrícolas, buscables por tema y cultivo." },
        { titulo: "Agrometeorología", desc: "Datos de estaciones públicas integrados al clima de tu predio." },
        { titulo: "Fuentes de tu territorio", desc: "Conectores a instituciones locales, ministerios y universidades de cada hub." },
        { titulo: "Repositorio propio", desc: "Documentos del centro demostrativo, públicos o privados." },
      ],
      pasos: [
        "Elegimos con tu hub las fuentes relevantes para su territorio.",
        "Las conectamos por API o con un recolector automático.",
        "Quedan disponibles en el buscador y en las respuestas del asistente.",
      ],
    },
  },
  {
    key: "clima", slug: "clima", ruta: "/clima", icono: Sun,
    nombre: "Clima y agrometeorología", corto: "Clima",
    descripcion: "Pronóstico y datos agrometeorológicos para tu zona.",
    pagina: {
      badge: "Clima y agrometeorología",
      titulo: "Pronóstico y estaciones", destacado: "para tu predio",
      bajada: "Pronóstico a la ubicación exacta de tu campo, datos de estaciones agrometeorológicas cercanas y los indicadores que importan para regar y aplicar.",
      features: [
        { titulo: "Pronóstico por predio", desc: "Temperatura, lluvia, viento y humedad para las coordenadas de tu campo." },
        { titulo: "Estaciones cercanas", desc: "Datos de la red agrometeorológica junto a tus propios sensores." },
        { titulo: "Evapotranspiración", desc: "ETo diaria para calcular cuánta agua reponer en cada sector." },
        { titulo: "Alertas", desc: "Heladas, calor y lluvia se convierten en recomendaciones para tu cultivo." },
      ],
      pasos: [
        "Registras tu predio con su ubicación.",
        "AgroHubs consulta el pronóstico y las estaciones cercanas.",
        "Ves el clima en la app y en el panel, y recibes las alertas.",
      ],
    },
  },
  {
    key: "recomendaciones", slug: "recomendaciones", ruta: "/recomendaciones", icono: Lightbulb,
    nombre: "Recomendaciones por clima", corto: "Recomendaciones",
    descripcion: "Avisos agronómicos según el pronóstico de tu predio: heladas, calor, lluvia, viento, riego y ventanas para aplicar.",
    pagina: {
      badge: "Recomendaciones por clima",
      titulo: "Avisos a tiempo", destacado: "para heladas, calor, lluvia y viento",
      bajada: "Dos veces al día AgroHubs revisa el pronóstico de cada predio y prepara recomendaciones concretas para tu cultivo. Tu centro demostrativo las aprueba, o se envían solas si así lo eliges.",
      features: [
        { titulo: "Heladas", desc: "Aviso con anticipación cuando la mínima baja de 2 °C, con las medidas de control a activar." },
        { titulo: "Calor", desc: "Sobre 32 °C: ajusta horarios de riego y evita aplicaciones en las horas de más calor." },
        { titulo: "Lluvia", desc: "Posterga fertilizaciones y aplicaciones foliares, y revisa drenajes antes de que llueva." },
        { titulo: "Viento", desc: "Con viento fuerte no conviene aplicar ni volar drones. Te avisamos qué días evitar." },
        { titulo: "Riego con ETo", desc: "Cuántos milímetros reponer según la evapotranspiración y el coeficiente de tu cultivo." },
        { titulo: "Ventana de aplicación", desc: "El mejor momento de la semana para aplicar: poco viento, sin lluvia y temperatura adecuada." },
      ],
      pasos: [
        "AgroHubs cruza el pronóstico de tu predio con tu cultivo y tus datos.",
        "Prepara la recomendación con un texto claro y una acción concreta.",
        "Tu centro demostrativo la revisa y aprueba, o se envía automáticamente.",
        "Te llega a la app y al panel, con aviso en la campana.",
      ],
    },
  },
  {
    key: "fenologia", slug: "fenologia", ruta: "/fenologia", icono: Flower2,
    nombre: "Fases fenológicas", corto: "Fenología",
    descripcion: "Fases fenológicas por cultivo con sus recomendaciones de manejo.",
    pagina: {
      badge: "Fases fenológicas",
      titulo: "Cada etapa del cultivo,", destacado: "con su manejo",
      bajada: "Las fases fenológicas de tus cultivos, de la brotación a la cosecha, con las recomendaciones de manejo que corresponden a cada una.",
      features: [
        { titulo: "Fases por cultivo", desc: "El calendario de fases de cada cultivo, preparado por el equipo AgroHubs." },
        { titulo: "Manejo por fase", desc: "Qué revisar y qué labores priorizar en cada etapa." },
        { titulo: "Fases propias del predio", desc: "Ajusta las fases a tu zona, tu variedad y lo que observas en terreno." },
      ],
      pasos: [
        "Eliges los cultivos de tu predio.",
        "Ves en qué fase está cada uno y qué manejo corresponde.",
        "Ajustas las fases con lo que observas en terreno.",
      ],
    },
  },
  {
    key: "calculadoras", slug: "calculadoras", ruta: "/calculadoras", icono: Calculator,
    nombre: "Calculadoras", corto: "Calculadoras",
    descripcion: "Calculadoras agronómicas de dosis y costos.",
    pagina: {
      badge: "Calculadoras",
      titulo: "Dosis correctas,", destacado: "sin planillas",
      bajada: "Calculadoras agronómicas para fertilización, enmiendas y aplicaciones, pensadas para usarse en terreno desde el celular.",
      features: [
        { titulo: "Fertilización", desc: "Cuánto aplicar según cultivo, etapa y superficie." },
        { titulo: "Enmiendas", desc: "Dosis de cal y otras correcciones de suelo." },
        { titulo: "Aplicaciones", desc: "Preparación de mezclas y volúmenes por hectárea." },
        { titulo: "Parámetros propios", desc: "Cada hub puede ajustar las calculadoras a sus cultivos." },
      ],
      pasos: [
        "Eliges la calculadora y tu cultivo.",
        "Ingresas superficie y etapa.",
        "Obtienes la dosis y la guardas en tu predio.",
      ],
    },
  },
  {
    key: "eventos", slug: "eventos", ruta: "/eventos", icono: CalendarDays,
    nombre: "Capacitaciones y eventos", corto: "Eventos",
    descripcion: "Días de campo, capacitaciones y eventos de tu hub.",
  },
  {
    key: "tienda", slug: "tienda", ruta: "/tienda", icono: Store,
    nombre: "Mercado de cosecha / tienda", corto: "Mercado",
    descripcion: "Catálogo de productos e insumos y venta de cosecha entre productores de la red.",
  },
  {
    key: "drones", slug: "drones", ruta: "/drones", icono: IconoDron,
    nombre: "Solicitar drones (DronX)", corto: "Drones",
    descripcion: "Pide servicios con dron (aplicación, NDVI, mapeo, conteo) a operadores de DronX.",
    pagina: {
      badge: "Drones agrícolas · integración DronX",
      titulo: "Drones agrícolas a demanda,", destacado: "desde tu predio",
      bajada: "Pides el servicio desde la app o el panel de AgroHubs y la solicitud llega a la red de operadores de DronX con los datos de tu predio.",
      aviso: {
        titulo: "Integrado con DronX",
        texto: "DronX es de OlaDigital y tiene app Android y web (iOS próximamente). Tus solicitudes salen con los datos del predio y su estado se actualiza solo en AgroHubs.",
        enlace: { texto: "Conoce la app DronX", ruta: "/apps/dronx" },
      },
      features: [
        { titulo: "Aplicación con dron", desc: "Fumigación y aplicación de productos por hectárea, también en pendientes." },
        { titulo: "Mapas NDVI", desc: "Vigor del cultivo y detección temprana de estrés hídrico o plagas." },
        { titulo: "Mapeo y topografía", desc: "Ortofotos y modelos del terreno para planificar riego y plantación." },
        { titulo: "Conteo de plantas", desc: "Plantas y fallas por lote para estimar producción y replantes." },
        { titulo: "Termografía", desc: "Cámara térmica para revisar la uniformidad del riego." },
        { titulo: "Seguimiento", desc: "Sigues el estado de cada solicitud y recibes mapas y reportes en AgroHubs." },
      ],
      pasos: [
        "Pides el servicio desde la app o el panel de tu predio: cultivo, hectáreas, ubicación y fecha.",
        "La solicitud llega a DronX con los datos de tu predio.",
        "Un operador de la red DronX la cotiza y agenda el vuelo.",
        "Sigues el estado en AgroHubs y recibes los mapas y reportes.",
      ],
    },
  },
]

export const moduloPorSlug = (slug) => MODULOS.find((m) => m.slug === slug)

// Rutas del sitio que pertenecen a un módulo (para marcar "Módulos" como activo en el menú)
export const esRutaDeModulo = (path) => path === "/modulos" || MODULOS.some((m) => m.ruta === path)
