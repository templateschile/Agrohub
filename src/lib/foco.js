// Foco atrapado en un diálogo modal (ContactModal): Tab y Shift+Tab ciclan entre sus controles
// y no se escapan a la página de atrás. Funciones puras: se prueban en scripts/tests.

const SELECTOR = 'a[href], button, input, select, textarea, [tabindex]'

// Controles del contenedor a los que se llega con Tab: habilitados, visibles y sin tabindex negativo
// (deja fuera el campo trampa para bots, que es oculto y tiene tabIndex -1).
export function enfocables(contenedor) {
  if (!contenedor) return []
  return [...contenedor.querySelectorAll(SELECTOR)].filter((el) =>
    !el.disabled && el.tabIndex >= 0 && el.getClientRects().length > 0)
}

// A qué control mover el foco al apretar Tab (`atras` = Shift+Tab) para no salir del diálogo.
// null: el foco está entre el primero y el último, y el navegador lo mueve solo.
export function focoAtrapado(lista, activo, atras = false) {
  if (!lista.length) return null
  const i = lista.indexOf(activo)
  if (atras) return i <= 0 ? lista[lista.length - 1] : null
  return i === -1 || i === lista.length - 1 ? lista[0] : null
}
