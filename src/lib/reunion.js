// Reunión de 30 minutos: se propone 2 días hábiles después de hoy (hora de Chile), a las 08:15 o 13:00.
// Misma regla que /apis/cotizar (scripts/build-apis.mjs); los feriados viven en data/feriados-cl.json.
import FERIADOS from "../../data/feriados-cl.json"

export const HORAS = ["08:15", "13:00"]
export const ZONA = "America/Santiago"
export const DURACION_MIN = 30

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]

const iso = d => d.toISOString().slice(0, 10)
const fecha = s => new Date(s + "T12:00:00Z")

export function hoyCL() {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone: ZONA, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date())
  } catch {
    return iso(new Date())
  }
}

export const esHabil = s => {
  const d = fecha(s).getUTCDay()
  return d !== 0 && d !== 6 && !FERIADOS.includes(s)
}

export function sumarHabiles(s, n) {
  const d = fecha(s)
  while (n > 0) {
    d.setUTCDate(d.getUTCDate() + 1)
    if (esHabil(iso(d))) n--
  }
  return iso(d)
}

// "miércoles 28 de octubre"
export const diaLargo = s => {
  const d = fecha(s)
  return `${DIAS[d.getUTCDay()]} ${d.getUTCDate()} de ${MESES[d.getUTCMonth()]}`
}

// "mié 28 oct", para los espacios angostos
export const diaCorto = s => {
  const d = fecha(s)
  return `${DIAS[d.getUTCDay()].slice(0, 3)} ${d.getUTCDate()} ${MESES[d.getUTCMonth()].slice(0, 3)}`
}

// El mismo día en el idioma de la página, para mostrarlo: "Wednesday, October 28" / "quarta-feira, 28 de outubro".
// Lo que se envía al equipo sigue en español (diaLargo, reunionTexto).
export function diaParaMostrar(s, locale = "es", corto = false) {
  if (!locale || locale === "es") return corto ? diaCorto(s) : diaLargo(s)
  try {
    const opciones = corto ? { weekday: "short", day: "numeric", month: "short" } : { weekday: "long", day: "numeric", month: "long" }
    return new Intl.DateTimeFormat(locale, { ...opciones, timeZone: "UTC" }).format(fecha(s))
  } catch {
    return s
  }
}

// Primer día que se puede agendar (hoy + 2 hábiles)
export const primerDia = () => sumarHabiles(hoyCL(), 2)

// Lo que se guarda en respuestas.reunion y la línea que lee el equipo
export const reunionDatos = ({ fecha, hora }, propuesta) => ({ fecha, hora, zona: ZONA, duracion_min: DURACION_MIN, propuesta })
export const reunionTexto = ({ fecha, hora }) => `Reunión: ${diaLargo(fecha)} de ${fecha.slice(0, 4)} a las ${hora} (hora de Chile), por confirmar`
