// Capturas reales de la plataforma (panel web y app Flutter en vista previa, con datos ficticios), en
// public/capturas. capturas.json es el manifiesto: archivo, pantalla, vista (escritorio o movil), tamaño y alt
// en es/en/pt. Se sacaron con el panel servido localmente y un API simulado, sin datos reales.
import MANIFIESTO from "./capturas.json"

const LISTA = Array.isArray(MANIFIESTO) ? MANIFIESTO : []

// Pantalla que muestra cada módulo. Los que no tienen pantalla propia en la plataforma (cuaderno de campo,
// fuentes, fenología, calculadoras, eventos, insumos) no llevan captura.
export const CAPTURA_MODULO = {
  dashboard_sensores: "sensores", chat_ia: "chat", documentos: "documentos", clima: "clima",
  recomendaciones: "recomendaciones", tienda: "tienda", drones: "drones",
}

// { escritorio, movil } de una pantalla: { src, ancho, alto, alt: { es, en, pt } }
export function capturasDe(pantalla) {
  const de = (vista) => {
    const c = LISTA.find((x) => x.pantalla === pantalla && x.vista === vista)
    return c && { src: `/capturas/${c.archivo}`, ancho: c.ancho, alto: c.alto, alt: c.alt }
  }
  return { escritorio: de("escritorio"), movil: de("movil") }
}

export const capturasDeModulo = (key) => (CAPTURA_MODULO[key] ? capturasDe(CAPTURA_MODULO[key]) : { escritorio: null, movil: null })
export const PANTALLAS = [...new Set(LISTA.map((c) => c.pantalla))]
export const ARCHIVOS = LISTA.map((c) => c.archivo)
