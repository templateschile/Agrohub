// Las apps del ecosistema AgroHubs: el menú "Apps", la sección de la portada (AppsEcosistema) y las
// páginas /apps/<slug> (AppPagina). Datos puros (sin JSX ni íconos) para probarlos con node:test
// (scripts/tests). Los textos están en español; el inglés y el portugués van en src/i18n/datos/apps.js.
//
// Cada app con página sigue la misma plantilla: hero con foto, tres problemas con su solución, cómo
// funciona en 3 pasos, qué incluye (opcional), para quién es, cómo se conecta con AgroHubs, preguntas
// frecuentes y cierre (o el formulario de interés, si la app aún no existe).
// - `sitio`: sitio propio de la app (se abre en otra pestaña).
// - `cta` + `destino`: el botón principal. `otra`: el botón secundario. Un destino es { url } (sitio
//   externo, otra pestaña), { ruta } (página de este sitio, con el prefijo de idioma) o { ancla } (una
//   sección de la misma página: "como-funciona" o "interes").
// - `interes`: la página termina con el formulario "súmate para probarlo primero" (FormInteres).
// - `modulo`: la página muestra los servicios de ese módulo (lib/modulos.js), p. ej. DronX → Drones.
// - `icono`: "dron", "reciclaje" o "feria" (IconoApp en components/AppsEcosistema.jsx).
// - `foto` / `fotoRespaldo`: claves de FOTOS (lib/fotos.js); la segunda se usa si la primera no está.
// - El color de cada app está en ACENTOS, más abajo.
// Fisaro no es una app del ecosistema: aparece solo como integración en el diagrama de la portada.

const SITIO_AGROCICLO = "https://agrociclo.oladigital.cl"
const SITIO_DRONX = "https://dsp.oladigital.cl"

export const APPS = [
  {
    slug: "agrohubs",
    nombre: "AgroHubs",
    promesa: "Crea tu Centro Demostrativo Agrícola",
    ruta: "/",
  },
  {
    slug: "agrociclo",
    nombre: "AgroCiclo",
    promesa: "Convierte tus residuos agrícolas en valor",
    ruta: "/apps/agrociclo",
    sitio: SITIO_AGROCICLO,
    icono: "reciclaje",
    foto: "residuos",
    fotoRespaldo: "lechugas",
    bajada: "AgroCiclo conecta a agricultores con recicladores para retirar, valorizar y reciclar los residuos del predio desde el celular.",
    cta: "Ir a AgroCiclo",
    destino: { url: SITIO_AGROCICLO },
    otra: { texto: "Cómo funciona", destino: { ancla: "como-funciona" } },
    problemas: [
      {
        problema: "Plásticos de riego, envases y metales se acumulan en el predio sin un retiro claro.",
        solucion: "Publicas los materiales con fotos y ubicación, y pides el retiro desde el celular.",
      },
      {
        problema: "No sabes cuánto vale lo que entregas.",
        solucion: "El reciclador registra el peso real y aplica el valor por kilo de cada material. Ves el detalle antes de confirmar.",
      },
      {
        problema: "Para el reciclador, encontrar material cerca significa llamadas y viajes perdidos.",
        solucion: "Ve las solicitudes cercanas a medida que llegan y va directo al predio.",
      },
    ],
    pasos: [
      { titulo: "Registra tu predio", texto: "Indica la ubicación, el tipo de cultivo y los materiales que tienes para retirar." },
      { titulo: "Pide el retiro", texto: "Se avisa a los recicladores cercanos. Uno verifica la solicitud, va al predio y retira el material." },
      { titulo: "Recibe la valorización", texto: "Se calcula el valor del material. Lo confirmas y sumas puntos por cada retiro completado." },
    ],
    paraQuien: [
      { titulo: "Agricultores", texto: "Que quieren sacar del predio los residuos de la temporada y recibir algo a cambio." },
      { titulo: "Recicladores", texto: "Que buscan material cerca y quieren generar ingresos con cada retiro." },
      { titulo: "Centros demostrativos", texto: "Que quieren ordenar el retiro de residuos de los agricultores de su red." },
    ],
    conexion: [
      "AgroHubs ordena el predio y sus datos, y AgroCiclo se encarga de lo que sale del predio como residuo.",
      "Tu centro demostrativo puede sumar AgroCiclo como el canal de retiro de residuos para sus agricultores.",
      "Lo que no se vende en AgroSeller se puede derivar a AgroCiclo.",
    ],
    faq: [
      {
        q: "¿Qué materiales se pueden reciclar?",
        a: "Plásticos de riego (film, cintas y mangueras), envases de agroquímicos vacíos y bien lavados, tubería de PVC, metales agrícolas y otros residuos del agro. El reciclador confirma los materiales al llegar.",
      },
      {
        q: "¿Cuánto cuesta?",
        a: "Depende del material y de su valor. Puedes recibir un pago neto o puede haber un cobro mínimo por el servicio, y siempre ves la valorización antes de confirmar.",
      },
      {
        q: "¿Cómo se calcula la valorización?",
        a: "El reciclador registra el peso real, aplica el valor por kilo según el tipo de material y descuenta la logística si corresponde. Recibes el detalle completo.",
      },
      {
        q: "¿Qué pasa si en mi zona todavía no hay recicladores?",
        a: "Igual puedes registrarte. La cobertura está creciendo y te avisaremos cuando haya recicladores cerca.",
      },
    ],
    cierre: {
      titulo: "Saca los residuos del predio y dales valor",
      texto: "Registra tu predio en AgroCiclo y pide tu primer retiro.",
    },
  },
  {
    slug: "dronx",
    nombre: "DronX",
    promesa: "Servicios de dron a demanda",
    ruta: "/apps/dronx",
    sitio: SITIO_DRONX,
    modulo: "drones",
    icono: "dron",
    foto: "dron",
    fotoRespaldo: "hortalizas",
    bajada: "DronX, de OlaDigital, conecta a quienes necesitan un servicio de dron con los operadores de su red. Como AgroHubs ya está integrado con DronX, pides el servicio desde tu predio y la solicitud llega con sus datos.",
    cta: "Pedir desde AgroHubs",
    destino: { ruta: "/drones" },
    otra: { texto: "Ir al sitio de DronX", destino: { url: SITIO_DRONX } },
    problemas: [
      {
        problema: "Encontrar un operador de drones disponible cerca del predio toma tiempo.",
        solucion: "Pides el servicio y la solicitud llega a los operadores de la red DronX.",
      },
      {
        problema: "Cada vuelo se cotiza y se coordina por teléfono.",
        solucion: "Cada tipo de servicio muestra un precio base estimado antes de reservar. Las misiones a medida reciben la cotización del operador.",
      },
      {
        problema: "Los mapas y reportes quedan repartidos en correos y pendrives.",
        solucion: "Descargas los entregables en la app y, si pediste desde AgroHubs, los ves junto a tu predio.",
      },
    ],
    pasos: [
      { titulo: "Elige el servicio", texto: "Indica el tipo de servicio, la ubicación, la fecha y la hora. Puedes agregar instrucciones e imágenes de referencia." },
      { titulo: "Un operador lo realiza", texto: "Un operador de la red acepta la misión y la ejecuta." },
      { titulo: "Recibe los entregables", texto: "Descargas fotos, videos, mapas o reportes, apruebas la misión y calificas el servicio." },
    ],
    paraQuien: [
      { titulo: "Agricultores y administradores de predios", texto: "Que necesitan aplicaciones, mapas o conteos sin comprar un dron." },
      { titulo: "Centros demostrativos y asesores", texto: "Que quieren ofrecer servicios con dron a los agricultores de su red." },
      { titulo: "Operadores de drones", texto: "Que reciben solicitudes cercanas y cobran por cada misión completada." },
    ],
    conexion: [
      "Pides el servicio desde la app o el panel de tu predio en AgroHubs, con el cultivo, las hectáreas, la ubicación y la fecha.",
      "La solicitud llega a DronX con los datos de tu predio.",
      "El estado de la solicitud y los entregables vuelven a AgroHubs.",
    ],
    faq: [
      {
        q: "¿Qué servicios agrícolas puedo pedir?",
        a: "Aplicación con dron, mapas NDVI, mapeo y topografía, conteo de plantas y termografía, entre otros.",
      },
      {
        q: "¿Cuánto cuesta un servicio?",
        a: "Cada tipo de servicio tiene un precio base que ves como estimación antes de reservar. Para misiones a medida, un operador te envía una cotización que puedes aceptar.",
      },
      {
        q: "¿Cómo recibo los entregables?",
        a: "El operador los sube a la app y tú los descargas desde ahí. Si pediste desde AgroHubs, también quedan asociados a tu predio.",
      },
      {
        q: "¿Hay operadores en mi zona?",
        a: "La red está creciendo. Si en tu zona aún no hay operadores, puedes registrarte para que te avisemos cuando haya uno cerca.",
      },
    ],
    cierre: {
      titulo: "Pide tu próximo servicio con dron",
      texto: "Pídelo desde el módulo Drones de AgroHubs o entra al sitio de DronX.",
    },
  },
  {
    slug: "agroseller",
    nombre: "AgroSeller",
    nuevo: true,
    estado: "En desarrollo",
    promesa: "Vende tu fruta directo a feriantes, por lotes y con reserva",
    ruta: "/apps/agroseller",
    icono: "feria",
    foto: "feria",
    fotoRespaldo: "paltos",
    bajada: "AgroSeller nace de AgroCiclo para que productores y packings vendan fruta a feriantes y comerciantes. Publicas lotes con precio y mínimo de compra, y el comprador reserva, retira o pide despacho. Está en desarrollo y puedes sumarte para probarlo primero.",
    cta: "Quiero ser parte",
    destino: { ancla: "interes" },
    otra: { texto: "Cómo funciona", destino: { ancla: "como-funciona" } },
    interes: true,
    problemas: [
      {
        problema: "El feriante llama a varios productores para saber qué fruta hay, a qué precio y cuándo.",
        solucion: "Busca por fruta, cercanía y fecha, y ve en un solo lugar el precio, el mínimo de compra y el punto de retiro de cada lote.",
      },
      {
        problema: "El productor vende por teléfono y pierde el control del stock y de lo comprometido.",
        solucion: "Las reservas llegan sobre el mínimo de compra. Las confirmas o rechazas, y el stock se descuenta solo al confirmar.",
      },
      {
        problema: "La fruta que no se vende a tiempo se pierde.",
        solucion: "Las reservas sin confirmar vencen y pasan a la lista de espera. Lo que no se vende se deriva a AgroCiclo.",
      },
    ],
    pasos: [
      { titulo: "Publica tus lotes", texto: "Por especie, variedad, calibre y formato. Cada variante lleva su precio, mínimo de compra, stock, fecha de disponibilidad, fotos y punto de retiro." },
      { titulo: "El feriante reserva", texto: "Reserva sobre el mínimo, elige retiro (día y hora) o despacho, puede dejar un abono y recibe la confirmación por WhatsApp." },
      { titulo: "Confirmas y entregas", texto: "Confirmas o rechazas la reserva. Al confirmar se descuenta el stock; si no confirmas a tiempo, la reserva vence." },
    ],
    incluye: {
      titulo: "Cómo se publica un lote",
      etiqueta: "Cada lote se ordena por",
      jerarquia: ["Especie", "Variedad", "Calibre", "Formato: caja de 10 kg, bin o granel"],
      grupos: [
        {
          titulo: "Cada variante tiene",
          items: [
            "Precio, con tramos por volumen",
            "Mínimo de compra",
            "Stock",
            "Fecha de disponibilidad",
            "Categoría: exportación, mercado interno o comercial",
            "Fotos",
            "Punto de retiro",
          ],
        },
        {
          titulo: "El feriante",
          items: [
            "Busca por fruta, cercanía y fecha",
            "Reserva sobre el mínimo de compra",
            "Elige retiro (día y hora) o despacho",
            "Puede dejar un abono",
            "Recibe la confirmación por WhatsApp",
          ],
        },
        {
          titulo: "Además",
          items: [
            "Reservas recurrentes, por ejemplo «todos los viernes para la feria»",
            "Lista de espera cuando no queda stock",
            "Calificaciones de productores y compradores",
            "Precio de referencia oficial junto a cada lote, como el de ODEPA en Chile",
            "Lo que no se vende se deriva a AgroCiclo",
          ],
        },
      ],
    },
    paraQuien: [
      { titulo: "Productores y packings", texto: "Con fruta para mercado interno, comercial o saldos de exportación, que quieren vender por lotes con reglas claras." },
      { titulo: "Feriantes y comerciantes", texto: "Que compran volumen cada semana y necesitan saber qué hay, dónde y cuándo." },
      { titulo: "Centros demostrativos", texto: "Que quieren abrir un canal de venta para los productores de su red." },
    ],
    conexion: [
      "Nace de AgroCiclo, y lo que no se vende en AgroSeller se deriva a AgroCiclo.",
      "Muestra el precio de referencia de ODEPA, en Chile, una de las fuentes que AgroHubs ya integra.",
      "Complementa el Mercado de cosecha de AgroHubs con reservas por lote para feriantes.",
    ],
    faq: [
      {
        q: "¿Ya puedo usar AgroSeller?",
        a: "Todavía no. Lo estamos diseñando con productores y feriantes. Si quieres participar en las primeras pruebas, déjanos tus datos.",
      },
      {
        q: "¿Puedo comprar menos del mínimo?",
        a: "No. Cada variante tiene un mínimo de compra que define el productor, y la reserva se hace desde ese mínimo.",
      },
      {
        q: "¿Qué pasa si el productor no confirma mi reserva?",
        a: "La reserva vence y el stock vuelve a quedar disponible. Si hay lista de espera, se avisa a la siguiente persona.",
      },
      {
        q: "¿Qué es el precio de referencia?",
        a: "Es el precio que publica una fuente oficial para cada producto y mercado, como ODEPA (Oficina de Estudios y Políticas Agrarias) en Chile. Se muestra junto al precio del lote para comparar.",
      },
    ],
    cierre: {
      titulo: "Sé parte de las primeras pruebas",
      texto: "Si produces fruta o compras para la feria, cuéntanos tu caso y te avisamos cuando AgroSeller esté listo.",
    },
  },
]

export const appPorSlug = (slug) => APPS.find((a) => a.slug === slug)

// Apps con página propia en /apps/<slug> (AgroHubs es el sitio completo)
export const APPS_CON_PAGINA = APPS.filter((a) => a.ruta.startsWith("/apps/"))

// Color de cada app, en hex sRGB (va aparte de APPS porque los textos de las apps no llevan cifras;
// ver scripts/tests/sitio.test.mjs). Los contrastes se prueban en scripts/tests/apps.test.mjs:
// - color: botón principal, íconos y etiquetas. Texto blanco encima y el color sobre el papel: 4,5:1 o más.
// - suave: fondo de la ficha del ícono y de "Con <app>". El color encima: 4,5:1 o más.
// - claro: el acento sobre la banda bosque (botón con texto bosque oscuro): 4,5:1 o más.
// AgroHubs usa los tokens de la marca (--color-accent, --color-paper-2 y --color-mint).
export const ACENTOS = {
  agrohubs: { color: "#17663c", suave: "#eaf6ec", claro: "#6ee7a8" },
  dronx: { color: "#1f5aa6", suave: "#e4eefa", claro: "#9cc7f5" },
  agrociclo: { color: "#0b6b73", suave: "#dff2ef", claro: "#86dccf" },
  agroseller: { color: "#b0431a", suave: "#fbe9e1", claro: "#f6b393" },
}
export const acentoDe = (slug) => ACENTOS[slug] || ACENTOS.agrohubs

// Variables CSS de una app para el atributo style (apps.css usa --app-acento, --app-suave y --app-claro)
export const estiloAcento = (slug) => {
  const a = acentoDe(slug)
  return { "--app-acento": a.color, "--app-suave": a.suave, "--app-claro": a.claro }
}
