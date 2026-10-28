// Las apps del ecosistema AgroHubs: el menú "Apps" y las páginas /apps/<slug> (AppPagina).
// Datos puros (sin JSX ni íconos) para poder probarlos con node:test (scripts/tests).
//
// Cada app con página sigue la misma plantilla: hero, video (/videos/<slug>.mp4 y .jpg),
// tres problemas con su solución, cómo funciona en 3 pasos, para quién es, cómo se conecta
// con AgroHubs, preguntas frecuentes y cierre. `incluye` es opcional.
// - `sitio`: sitio propio de la app (se abre en otra pestaña). Sin sitio, el CTA abre el contacto.
// - `modulo`: la página reutiliza el contenido de ese módulo (lib/modulos.js), p. ej. DronX → Drones.
// Fisaro no es una app del ecosistema: aparece solo como integración en el diagrama de la portada.

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
    sitio: "https://agrociclo.oladigital.cl",
    bajada: "AgroCiclo conecta a agricultores con recicladores para retirar, valorizar y reciclar los materiales del agro de forma simple, desde el celular.",
    cta: "Ir a AgroCiclo",
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
      "AgroHubs ordena el predio y sus datos; AgroCiclo se encarga de lo que sale del predio como residuo.",
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
        a: "Depende del material y de su valor: puedes recibir un pago neto o puede haber un cobro mínimo por el servicio. Siempre ves la valorización antes de confirmar.",
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
    sitio: "https://dsp.oladigital.cl",
    modulo: "drones",
    bajada: "DronX, desarrollado por OlaDigital, conecta a quienes necesitan un servicio de dron con operadores de su red. AgroHubs ya está integrado: pides el servicio desde tu predio y la solicitud llega con sus datos.",
    cta: "Ir a DronX",
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
      "Pides el servicio desde la app o el panel de tu predio en AgroHubs: cultivo, hectáreas, comuna y fecha.",
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
      texto: "Entra a DronX o pídelo desde el módulo Drones de AgroHubs.",
    },
  },
  {
    slug: "agroseller",
    nombre: "AgroSeller",
    nuevo: true,
    promesa: "Vende tu fruta directo a feriantes, por lotes y con reserva",
    ruta: "/apps/agroseller",
    bajada: "AgroSeller nace de AgroCiclo para que productores y packings vendan fruta a feriantes y comerciantes: publicas lotes con precio y mínimo de compra, y el comprador reserva, retira o pide despacho. Está en desarrollo: súmate para probarlo primero.",
    cta: "Quiero ser parte",
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
            "Precio de referencia de ODEPA junto a cada lote",
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
      "Nace de AgroCiclo: lo que no se vende en AgroSeller se deriva a AgroCiclo.",
      "Usa el precio de referencia de ODEPA, una de las fuentes que AgroHubs ya integra.",
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
        q: "¿Qué es el precio de referencia de ODEPA?",
        a: "Es el precio que publica la Oficina de Estudios y Políticas Agrarias para cada producto y mercado. Se muestra junto al precio del lote para comparar.",
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
