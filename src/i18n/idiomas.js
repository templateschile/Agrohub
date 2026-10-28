// Idiomas del sitio: español (sin prefijo), inglés (/en) y portugués (/pt).
// Funciones puras, sin React: las usan los componentes (src/i18n/index.jsx) y las pruebas (scripts/tests).

export const IDIOMAS = ["es", "en", "pt"]
export const PREDETERMINADO = "es"
export const NOMBRES = { es: "Español", en: "English", pt: "Português" }
export const CORTOS = { es: "ES", en: "EN", pt: "PT" }
// Locale para Intl (fechas y números) y para og:locale
export const LOCALES = { es: "es", en: "en", pt: "pt-BR" }
export const SITIO = "https://www.agrohubs.cl"
export const CLAVE_PREFERENCIA = "ah-idioma"

const PREFIJO = /^\/(en|pt)(?=\/|$|#|\?)/

// "/en/modulos" → "en"; "/modulos" → "es"
export const idiomaDeRuta = (pathname = "/") => (String(pathname).match(PREFIJO)?.[1]) || PREDETERMINADO

// "/en/modulos" → "/modulos"; "/en" → "/"
export function sinIdioma(pathname = "/") {
  const resto = String(pathname).replace(PREFIJO, "")
  return resto === "" || resto.startsWith("#") || resto.startsWith("?") ? `/${resto}` : resto
}

// ("/modulos", "en") → "/en/modulos"; ("/", "pt") → "/pt"; ("/#contacto", "en") → "/en#contacto".
// Las rutas externas (http), los anclas sueltos (#x) y el directorio /apis (solo en español) no cambian.
export function conIdioma(ruta, idioma) {
  const r = String(ruta)
  if (!r.startsWith("/") || r.startsWith("//") || /^\/apis(\/|$|#|\?)/.test(r) || /^\/api\//.test(r)) return r
  const base = sinIdioma(r)
  if (!idioma || idioma === PREDETERMINADO) return base
  if (base === "/") return `/${idioma}`
  if (base.startsWith("/#") || base.startsWith("/?")) return `/${idioma}${base.slice(1)}`
  return `/${idioma}${base}`
}

// Idioma sugerido por el navegador: el primero de la lista que sea en o pt; si no, español
export function idiomaDelNavegador(lista = []) {
  for (const l of lista) {
    const c = String(l || "").toLowerCase().slice(0, 2)
    if (c === "es") return "es"
    if (c === "en" || c === "pt") return c
  }
  return PREDETERMINADO
}

export const esRobot = (ua = "") => /bot|crawl|spider|slurp|lighthouse|headless|preview|facebookexternalhit|embedly/i.test(ua)

// Lee y guarda la preferencia sin romper si localStorage no está disponible (modo privado, iframes)
export function leerPreferencia(almacen) {
  try {
    const v = (almacen ?? globalThis.localStorage)?.getItem(CLAVE_PREFERENCIA)
    return IDIOMAS.includes(v) ? v : null
  } catch {
    return null
  }
}
export function guardarPreferencia(idioma, almacen) {
  try {
    if (IDIOMAS.includes(idioma)) (almacen ?? globalThis.localStorage)?.setItem(CLAVE_PREFERENCIA, idioma)
  } catch { /* sin almacenamiento: se elige de nuevo en la próxima visita */ }
}

// Dónde mandar a alguien que entra al sitio: solo se decide al cargar, en una ruta sin prefijo.
// Con preferencia guardada manda la preferencia; sin ella, el idioma del navegador (y se guarda).
export function destinoInicial({ pathname, preferencia, navegador, robot }) {
  if (robot || idiomaDeRuta(pathname) !== PREDETERMINADO) return null
  const elegido = preferencia || idiomaDelNavegador(navegador)
  return elegido === PREDETERMINADO ? null : elegido
}

// Diccionario plano: t("clave", { n: 3 }) → texto con {n} reemplazado. Si falta en el idioma, usa el
// español; si tampoco está, devuelve la clave (y las pruebas lo detectan).
export function traductor(dic, base = {}) {
  const t = (clave, vars) => {
    let s = dic[clave] ?? base[clave] ?? clave
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v))
    return s
  }
  // Plural: claves "x.uno" y "x.otros"
  t.plural = (clave, n, vars = {}) => t(`${clave}.${n === 1 ? "uno" : "otros"}`, { n, ...vars })
  return t
}

// Mezcla una traducción sobre los datos en español: mismos campos, solo cambian los textos.
// Arreglos: por posición; objetos: por clave. Lo que la traducción no trae queda en español.
export function localizar(base, traduccion) {
  if (traduccion === undefined || traduccion === null) return base
  if (Array.isArray(base)) return base.map((x, i) => localizar(x, Array.isArray(traduccion) ? traduccion[i] : undefined))
  if (base && typeof base === "object" && !(typeof base === "function") && !base.$$typeof) {
    if (typeof traduccion !== "object") return base
    const out = { ...base }
    for (const k of Object.keys(traduccion)) out[k] = k in base ? localizar(base[k], traduccion[k]) : traduccion[k]
    return out
  }
  return typeof traduccion === typeof base || base === undefined ? traduccion : base
}

// Etiquetas <link rel="alternate" hreflang> y canonical de una ruta (sin prefijo de idioma)
export function enlacesAlternos(pathname) {
  const base = sinIdioma(pathname).replace(/[#?].*$/, "")
  const url = (i) => SITIO + conIdioma(base, i)
  return {
    canonical: url(idiomaDeRuta(pathname)),
    alternos: [...IDIOMAS.map((i) => ({ hreflang: i, href: url(i) })), { hreflang: "x-default", href: url(PREDETERMINADO) }],
  }
}
