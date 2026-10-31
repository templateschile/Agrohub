// Los 17 módulos de la app AgroHubs, tal como los ofrece la plataforma
// (templateschile/agrohubs-app: api/src/predios/catalogo.js, MODULOS). Mismas `key`, nombres y textos.
// Fuente única para la portada (AppModulos y el diagrama del ecosistema), el menú, el índice /modulos
// y las páginas de los módulos.
// - `ruta`: página del módulo en este sitio. Las de Dashboard, AI Chat, Documentos, Eventos y Tienda
//   están hechas a mano; el resto la arma ModuloPagina con `pagina`.
// - `corto`: nombre breve para el diagrama del ecosistema.
import {
  Radio, NotebookPen, Sparkles, FolderOpen, Globe, Sun,
  Lightbulb, Flower2, Calculator, CalendarDays, Store,
  ThermometerSun, LandPlot, FlaskConical, Wine, FileBadge,
} from "lucide-react"
import IconoDron from "../components/IconoDron"

export const MODULOS = [
  {
    key: "chat_ia", slug: "ai-chat", ruta: "/ai-chat", icono: Sparkles,
    nombre: "IA agrícola", corto: "IA agrícola",
    descripcion: "Asistente que responde consultas técnicas en lenguaje simple, apoyado en documentos confiables.",
  },
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
  // Vitivinicultura: viñas, asociaciones de productores y denominaciones de origen
  {
    key: "agroclima_viticola", slug: "agroclima-viticola", ruta: "/agroclima-viticola", icono: ThermometerSun,
    nombre: "Agroclima vitícola", corto: "Agroclima vitícola",
    descripcion: "Índices Winkler, Huglin, frescor nocturno, sequía y multicriterio, y riesgo de heladas por estación y cuartel.",
    pagina: {
      badge: "Agroclima vitícola",
      titulo: "Los índices de tu zona,", destacado: "por estación y cuartel",
      bajada: "AgroHubs calcula los índices bioclimáticos de la viña con las estaciones cercanas y las tuyas, y los lleva a cada cuartel para comparar temporadas y anticipar heladas.",
      features: [
        { titulo: "Winkler y Huglin", desc: "Grados día acumulados y potencial heliotérmico por temporada, con la clase climática de cada zona." },
        { titulo: "Frescor nocturno", desc: "Mínimas del periodo de maduración, que anticipan aromas y acidez." },
        { titulo: "Sequía", desc: "Balance hídrico de la temporada con lluvia y evapotranspiración." },
        { titulo: "Índice multicriterio", desc: "Los índices juntos en una sola clasificación climática de la zona." },
        { titulo: "Riesgo de heladas", desc: "Probabilidad de helada por estación y cuartel, con la fecha de la última helada de primavera." },
        { titulo: "Por estación y cuartel", desc: "Agromet INIA, Open-Meteo y tus estaciones, asignadas a cada cuartel." },
      ],
      pasos: [
        "Registras tus cuarteles y eliges la estación que representa a cada uno.",
        "AgroHubs calcula los índices con los datos de cada temporada.",
        "Comparas zonas y temporadas, y recibes el aviso de riesgo de helada.",
      ],
    },
  },
  {
    key: "cuarteles", slug: "cuarteles", ruta: "/cuarteles", icono: LandPlot,
    nombre: "Cuarteles y levantamiento", corto: "Cuarteles",
    descripcion: "Ficha de cada cuartel con variedad, plantación, riego y suelo; polígono en el mapa, levantamiento en terreno con fotos y GPS sin señal, y vigor NDVI por cuartel.",
    pagina: {
      badge: "Cuarteles y levantamiento",
      titulo: "Cada cuartel en el mapa,", destacado: "con su ficha y su vigor",
      bajada: "Dibujas el polígono de cada cuartel, completas su ficha y la actualizas en terreno desde el celular, con fotos y GPS aunque no haya señal. El vigor NDVI llega del satélite.",
      features: [
        { titulo: "Ficha del cuartel", desc: "Variedad, portainjerto, año de plantación, marco, riego y suelo." },
        { titulo: "Polígono en el mapa", desc: "Dibujas o importas el contorno y AgroHubs calcula la superficie." },
        { titulo: "Levantamiento en terreno", desc: "Fotos y punto GPS desde el celular, sin señal; se sincroniza al volver a tener red." },
        { titulo: "Vigor NDVI", desc: "Imágenes Sentinel-2 por cuartel para comparar vigor entre sectores y fechas." },
        { titulo: "Historial", desc: "Cada cambio de la ficha queda con fecha y responsable." },
      ],
      pasos: [
        "Dibujas los cuarteles del predio en el mapa.",
        "Completas la ficha y la revisas en terreno con fotos y GPS.",
        "Sigues el vigor NDVI de cada cuartel a lo largo de la temporada.",
      ],
    },
  },
  {
    key: "muestras", slug: "muestras", ruta: "/muestras", icono: FlaskConical,
    nombre: "Muestras y laboratorio", corto: "Muestras",
    descripcion: "Toma de muestras con código y QR, cadena de custodia, envío al laboratorio y resultados analíticos de vinos, mostos, suelo y agua.",
    pagina: {
      badge: "Muestras y laboratorio",
      titulo: "De la muestra al resultado,", destacado: "sin perder la pista",
      bajada: "Cada muestra nace con un código y un QR, pasa por la cadena de custodia hasta el laboratorio y vuelve con sus resultados analíticos al cuartel de donde salió.",
      features: [
        { titulo: "Código y QR", desc: "Etiqueta impresa para cada muestra de vino, mosto, suelo o agua." },
        { titulo: "Cadena de custodia", desc: "Quién tomó, transportó y recibió cada muestra, con fecha y hora." },
        { titulo: "Envío al laboratorio", desc: "Lotes de muestras con guía de despacho y aviso de recepción." },
        { titulo: "Resultados analíticos", desc: "pH, acidez, azúcares, alcohol y el resto de los parámetros, por muestra." },
        { titulo: "Trazabilidad al cuartel", desc: "Cada resultado queda asociado al cuartel y a la temporada." },
      ],
      pasos: [
        "Tomas la muestra y escaneas su QR desde el celular.",
        "La envías al laboratorio con la cadena de custodia registrada.",
        "Los resultados llegan a AgroHubs y quedan en la ficha del cuartel.",
      ],
    },
  },
  {
    key: "cata", slug: "cata", ruta: "/cata", icono: Wine,
    nombre: "Evaluación sensorial", corto: "Cata",
    descripcion: "Panel de cata, sesiones con codificación ciega, fichas OIV y descriptivas, consistencia entre jueces y acta de resultados.",
    pagina: {
      badge: "Evaluación sensorial",
      titulo: "Sesiones de cata", destacado: "con resultados comparables",
      bajada: "Armas el panel, codificas las muestras a ciegas y cada juez completa su ficha desde el celular. AgroHubs calcula la consistencia entre jueces y emite el acta.",
      features: [
        { titulo: "Panel de cata", desc: "Jueces, roles y calendario de sesiones." },
        { titulo: "Codificación ciega", desc: "Cada muestra recibe un código aleatorio para la sesión." },
        { titulo: "Fichas OIV y descriptivas", desc: "Ficha OIV de 100 puntos o fichas descriptivas propias." },
        { titulo: "Consistencia entre jueces", desc: "Dispersión por atributo y jueces fuera de rango." },
        { titulo: "Acta de resultados", desc: "Resumen de la sesión, listo para compartir." },
      ],
      pasos: [
        "Creas la sesión, eliges la ficha y codificas las muestras.",
        "Cada juez completa su ficha desde el celular.",
        "Revisas la consistencia y emites el acta.",
      ],
    },
  },
  {
    key: "expediente_do", slug: "expediente-de-origen", ruta: "/expediente-de-origen", icono: FileBadge,
    nombre: "Expediente de origen", corto: "Expediente DO",
    descripcion: "Arma la solicitud de Denominación de Origen o Indicación Geográfica para el SAG con los datos del hub: zonificación, agroclima, análisis, cata y productores.",
    pagina: {
      badge: "Expediente de origen",
      titulo: "La solicitud de origen,", destacado: "armada con tus datos",
      bajada: "El expediente para pedir una Denominación de Origen o una Indicación Geográfica reúne lo que el hub ya registró: cuarteles, índices agroclimáticos, análisis de laboratorio, actas de cata y padrón de productores.",
      features: [
        { titulo: "Zonificación", desc: "Mapa y superficie de los cuarteles que forman la zona." },
        { titulo: "Agroclima", desc: "Índices Winkler, Huglin y frescor nocturno de las temporadas que respaldan la zona." },
        { titulo: "Análisis", desc: "Resultados de laboratorio de vinos, mostos, suelo y agua." },
        { titulo: "Cata", desc: "Actas de las sesiones de evaluación sensorial." },
        { titulo: "Productores", desc: "Padrón de productores y viñas que integran la solicitud." },
        { titulo: "Expediente listo", desc: "Documento ordenado según lo que pide la autoridad, con sus anexos." },
      ],
      pasos: [
        "Eliges la zona y los cuarteles que la componen.",
        "AgroHubs reúne agroclima, análisis, cata y productores.",
        "Revisas el expediente y lo presentas a la autoridad.",
      ],
    },
  },
]

export const moduloPorSlug = (slug) => MODULOS.find((m) => m.slug === slug)

// Rutas del sitio que pertenecen a un módulo (para marcar "Módulos" como activo en el menú)
export const esRutaDeModulo = (path) => path === "/modulos" || MODULOS.some((m) => m.ruta === path)
