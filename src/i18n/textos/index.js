// Todos los textos del sitio, por área. Cada área exporta { es: {...}, en: {...}, pt: {...} } con claves
// planas y prefijo propio ("eval.", "apps.", "mod.", ...). Las pruebas revisan que en y pt tengan las
// mismas claves que es (scripts/tests/i18n.test.mjs).
import comun from "./comun.js"
import evaluacion from "./evaluacion.js"
import apps from "./apps.js"
import modulos from "./modulos.js"

export const AREAS = { comun, evaluacion, apps, modulos }

export const TEXTOS = Object.fromEntries(
  ["es", "en", "pt"].map((i) => [i, Object.assign({}, ...Object.values(AREAS).map((a) => a[i] || {}))]),
)
