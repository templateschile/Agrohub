// Idioma del sitio en React: el idioma sale de la URL (/en, /pt o sin prefijo para español).
//   const { idioma, t, ruta, fecha } = useIdioma()
//   t("nav.modulos")            texto del diccionario (src/i18n/textos)
//   t.plural("eco.n", 3)        claves "eco.n.uno" / "eco.n.otros"
//   ruta("/modulos")            "/en/modulos" en inglés (para <Link to> y <a href>)
//   <Enlace to="/modulos">      un <Link> que agrega el prefijo solo
// Los datos con texto (módulos, apps) se piden ya traducidos: useModulos(), useApps().
import { useMemo } from "react"
import { Link, useLocation } from "react-router-dom"
import { idiomaDeRuta, conIdioma, traductor, localizar, LOCALES, PREDETERMINADO } from "./idiomas"
import { TEXTOS } from "./textos/index.js"
import MODULOS_BASE from "./datos/modulos-base.js"
import MODULOS_PAGINAS from "./datos/modulos-paginas.js"
import APPS_TRAD from "./datos/apps.js"
import { MODULOS } from "../lib/modulos"
import { APPS } from "../lib/apps"

const TRADUCTORES = Object.fromEntries(Object.keys(TEXTOS).map((i) => [i, traductor(TEXTOS[i], TEXTOS[PREDETERMINADO])]))

export function textosDe(idioma) {
  return TRADUCTORES[idioma] || TRADUCTORES[PREDETERMINADO]
}

export function useIdioma() {
  const { pathname } = useLocation()
  const idioma = idiomaDeRuta(pathname)
  return useMemo(() => ({
    idioma,
    locale: LOCALES[idioma],
    t: textosDe(idioma),
    ruta: (to) => conIdioma(to, idioma),
  }), [idioma])
}

export function Enlace({ to, ...props }) {
  const { ruta } = useIdioma()
  return <Link to={typeof to === "string" ? ruta(to) : to} {...props} />
}

// Módulos con nombre, corto, descripción y página en el idioma activo. `etiqueta`: para el diagrama.
export function modulosDe(idioma) {
  return MODULOS.map((m) => {
    const base = { ...MODULOS_BASE[idioma]?.[m.key], ...MODULOS_PAGINAS[idioma]?.[m.key] }
    const l = localizar(m, base)
    return { ...l, etiqueta: base.etiqueta || MODULOS_BASE.es?.[m.key]?.etiqueta || l.corto }
  })
}
const CACHE_MODULOS = {}
export function useModulos() {
  const { idioma } = useIdioma()
  return (CACHE_MODULOS[idioma] ||= modulosDe(idioma))
}

export function appsDe(idioma) {
  return APPS.map((a) => localizar(a, APPS_TRAD[idioma]?.[a.slug]))
}
const CACHE_APPS = {}
export function useApps() {
  const { idioma } = useIdioma()
  return (CACHE_APPS[idioma] ||= appsDe(idioma))
}
