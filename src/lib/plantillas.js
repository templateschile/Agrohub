// Plantillas de correo por defecto para el admin (pestaña Correo).
// {nombre} y {empresa} se reemplazan con los datos del cliente cuando se conocen;
// lo que va entre [corchetes] se completa a mano antes de enviar.
// La firma no va aqui: se agrega sola segun la casilla elegida.

export const PLANTILLAS = [
  {
    id: "evaluacion",
    nombre: "Respuesta a evaluación recibida",
    asunto: "Tu evaluación AgroHub · próximos pasos",
    cuerpo: `Hola {nombre}:

Gracias por completar la evaluación de AgroHub. Revisamos tus respuestas y vemos oportunidades concretas para {empresa}, especialmente en [tema principal: riego, calidad, trazabilidad, seguimiento de productores].

Te propongo una reunión de 45 minutos para conocer mejor tu operación y definir el alcance de un diagnóstico previo en terreno. ¿Te acomoda alguno de estos horarios?

- [día y hora 1]
- [día y hora 2]
- [día y hora 3]

Si prefieres otro momento, dime y lo coordinamos.

Saludos,`,
  },
  {
    id: "reunion",
    nombre: "Coordinar reunión con el equipo",
    asunto: "AgroHub × {empresa} · coordinemos una reunión",
    cuerpo: `Hola {nombre}:

Gracias por tu interés en AgroHub. Nos gustaría reunirnos con tu equipo agrícola y técnico para entender cómo trabajan hoy y dónde ven las mayores oportunidades de mejora.

La idea es una conversación de 60 minutos: te presentamos brevemente el enfoque de AgroHub y, sobre todo, escuchamos sus prioridades. Con eso diseñamos un diagnóstico previo y una propuesta modular a la medida de {empresa}.

Para aprovechar mejor la reunión, pueden completar antes esta evaluación de 5 minutos: https://www.agrohubs.cl/evaluacion

¿Me compartes dos o tres horarios posibles para la próxima semana?

Un abrazo,`,
  },
  {
    id: "propuesta",
    nombre: "Envío de propuesta de diagnóstico previo",
    asunto: "Propuesta de diagnóstico previo · {empresa}",
    cuerpo: `Hola {nombre}:

Como conversamos, te comparto la propuesta de diagnóstico previo para {empresa}. Incluye la visita a terreno, lo que levantaremos en cada zona, los entregables y los próximos pasos.

[Pega aquí la propuesta desde Evaluaciones › Copiar para email, o indica que va adjunta]

Si te parece bien, coordinamos la fecha de la visita y una contraparte por zona. Quedo atento a tus comentarios o ajustes.

Saludos,`,
  },
  {
    id: "visita",
    nombre: "Confirmación de visita a terreno",
    asunto: "Confirmación visita a terreno · {empresa}",
    cuerpo: `Hola {nombre}:

Te confirmo la visita de diagnóstico:

- Fecha: [fecha]
- Hora de llegada: [hora]
- Lugar: [predio / dirección]
- Equipo AgroHub: [nombres]

Para aprovechar la jornada, te pedimos tener a mano, si es posible:
- Mapa o listado de predios y cuarteles.
- Datos de riego: programador, caudales y turnos.
- Registros de la última temporada (labores, aplicaciones, cosecha y calidad).
- Acceso a los sensores o plataformas que usen hoy.

Cualquier cambio, avísame por este medio.

Saludos,`,
  },
  {
    id: "post-visita",
    nombre: "Agradecimiento después de la visita",
    asunto: "Gracias por recibirnos · próximos pasos",
    cuerpo: `Hola {nombre}:

Muchas gracias a ti y a tu equipo por recibirnos. Fue muy útil ver en terreno cómo trabajan en {empresa}.

Lo que levantamos:
- [hallazgo 1]
- [hallazgo 2]
- [hallazgo 3]

Próximos pasos:
1. Te enviamos el informe de diagnóstico y la propuesta modular antes del [fecha].
2. Definimos juntos el piloto: sitios, línea base y métricas de éxito.

Quedo atento a cualquier comentario.

Saludos,`,
  },
  {
    id: "seguimiento",
    nombre: "Seguimiento (sin respuesta)",
    asunto: "Seguimiento · AgroHub y {empresa}",
    cuerpo: `Hola {nombre}:

Te escribo para retomar nuestra conversación sobre AgroHub para {empresa}. Sé que la temporada tiene muchas urgencias, así que te propongo algo simple: una llamada de 20 minutos para ver si tiene sentido avanzar con el diagnóstico previo.

¿Te acomoda [día y hora]? Si no es buen momento, dime cuándo te escribo de nuevo.

Saludos,`,
  },
  {
    id: "cotizacion",
    nombre: "Envío de cotización",
    asunto: "Cotización AgroHub · {empresa}",
    cuerpo: `Hola {nombre}:

Adjuntamos la cotización solicitada para {empresa}.

Resumen:
- Alcance: [módulos / kit tecnológico / servicios]
- Plazo de implementación: [semanas]
- Validez de la cotización: [días]
- Condiciones de pago: [condiciones]

Los valores consideran lo conversado en el diagnóstico. Si necesitas ajustar el alcance o separar por etapas, lo revisamos sin problema.

Saludos,`,
  },
  {
    id: "contacto",
    nombre: "Respuesta a contacto desde la web",
    asunto: "Gracias por escribirnos · AgroHub",
    cuerpo: `Hola {nombre}:

Gracias por escribirnos a través de agrohubs.cl. Para orientarte mejor, ¿me cuentas brevemente qué cultivo tienes, cuántas hectáreas y qué te gustaría mejorar?

Si prefieres, puedes completar nuestra evaluación de 5 minutos y te respondemos con una recomendación: https://www.agrohubs.cl/evaluacion

Saludos,`,
  },
]

// Reemplaza {nombre} y {empresa}; si no se conocen quedan como [Nombre] / [Empresa]
export function aplicarPlantilla(p, { nombre = "", empresa = "" } = {}) {
  const primer = nombre.trim().split(/\s+/)[0]
  const rellenar = t => t
    .replaceAll("{nombre}", primer || "[Nombre]")
    .replaceAll("{empresa}", empresa.trim() || "[Empresa]")
  return { asunto: rellenar(p.asunto), cuerpo: rellenar(p.cuerpo) }
}
