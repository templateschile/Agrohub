// Los 10 módulos de la app AgroHubs que muestra el sitio, con las mismas `key` de la plataforma
// (templateschile/agrohubs-app: api/src/predios/catalogo.js, MODULOS). La plataforma tiene además
// las fases del cultivo y los drones: Fernando pidió sacarlos del sitio (nov. 2026), así que no van aquí.
// Fuente única para la portada (AppModulos y el diagrama del ecosistema), el menú, el índice /modulos
// y las páginas de los módulos.
// - `ruta`: página del módulo en este sitio. Las de Dashboard, AI Chat, Documentos y Eventos están
//   hechas a mano; el resto la arma ModuloPagina con `pagina`.
// - `bajada`: línea bajo el nombre (la Feria Digital lleva «Productos y Servicios»).
// - `corto`: nombre breve para el diagrama del ecosistema.
import {
  Radio, NotebookPen, Sparkles, FolderOpen, Globe, Sun,
  Lightbulb, Calculator, CalendarDays, Store,
} from "lucide-react"

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
    descripcion: "Datos de fuentes chilenas como INIA, CEAZA, ODEPA y CIREN junto a los de tu predio.",
    pagina: {
      badge: "Fuentes externas",
      titulo: "Boletines, clima y datos públicos de Chile,", destacado: "junto a tus datos",
      bajada: "AgroHubs reúne publicaciones técnicas, estaciones agrometeorológicas y datos públicos chilenos para que el asistente y tu equipo respondan citando la fuente.",
      features: [
        { titulo: "Publicaciones técnicas", desc: "Boletines y guías de INIA, buscables por tema y cultivo." },
        { titulo: "Agrometeorología", desc: "Estaciones de la Red Agroclimática Nacional y de CEAZA-Met junto al clima de tu predio." },
        { titulo: "Datos públicos de Chile", desc: "Precios de ODEPA, suelos y catastro frutícola de IDE Minagri y riesgo climático de ARClim." },
        { titulo: "Repositorio propio", desc: "Documentos del centro demostrativo, públicos o privados." },
      ],
      pasos: [
        "Elegimos con tu hub las fuentes que sirven a su zona.",
        "Las conectamos desde el panel de AgroHubs.",
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
    nombre: "Feria Digital", corto: "Feria Digital", bajada: "Productos y Servicios",
    descripcion: "Productos y servicios de todos los hubs de la red y de proveedores externos, en una tienda en línea.",
    pagina: {
      badge: "Feria Digital",
      titulo: "Feria Digital",
      bajada: "Productos y Servicios",
      texto: "Lo que ofrecen los hubs de la red y los proveedores externos, en una sola tienda en línea.",
      features: [
        { titulo: "Productos de los hubs", desc: "Cosechas e insumos que publican los agricultores de cada hub." },
        { titulo: "Servicios", desc: "Servicios para el campo, de la red y de proveedores externos." },
        { titulo: "Proveedores externos", desc: "Empresas fuera de la red venden en la misma feria." },
        { titulo: "Pedido y pago en línea", desc: "Carrito, pedido y enlace de pago." },
      ],
      pasos: [
        "Cada hub y cada proveedor publica sus productos y servicios.",
        "Los compradores de toda la red los encuentran en un solo catálogo.",
        "Piden, pagan en línea y coordinan la entrega con quien vende.",
      ],
    },
  },
]

export const moduloPorSlug = (slug) => MODULOS.find((m) => m.slug === slug)

// Rutas del sitio que pertenecen a un módulo (para marcar "Módulos" como activo en el menú)
export const esRutaDeModulo = (path) => path === "/modulos" || MODULOS.some((m) => m.ruta === path)
