// Resúmenes del catálogo para la portada del sitio (data/apis/destacadas.json).
// Funciones puras: se prueban en scripts/tests/ecosistema.test.mjs.

// "ODEPA — Datos Abiertos" → ["ODEPA", "Datos Abiertos"]; "CIREN / IDE MINAGRI (ArcGIS REST)" →
// ["CIREN / IDE MINAGRI", "ArcGIS REST"]. Sin rayas ni paréntesis en la portada.
export function partesNombre(nombre) {
  const m = String(nombre).match(/^(.*?)\s+(?:—\s+(.*)|\((.*)\))$/)
  return m ? [m[1], m[2] || m[3]] : [String(nombre), '']
}

const porRelevancia = (x, y) => (y.ranking?.relevancia ?? 0) - (x.ranking?.relevancia ?? 0) || x.nombre.localeCompare(y.nombre, 'es')

// Integraciones agrupadas por categoría para el anillo "agro" del diagrama del ecosistema:
// cuántas hay en cada categoría (las mismas que lista /apis/categoria/<slug>) y las `k` más
// recomendadas según el ranking del catálogo. Categorías ordenadas de más a menos integraciones;
// las vacías no se muestran.
export function resumenPorCategoria(apis, categorias, k = 3) {
  return categorias
    .map((c) => {
      const items = apis.filter((a) => (a.categorias || []).includes(c.slug)).sort(porRelevancia)
      return {
        slug: c.slug,
        nombre: c.nombre,
        total: items.length,
        top: items.slice(0, k).map((a) => ({ slug: a.slug, nombre: partesNombre(a.nombre)[0] })),
      }
    })
    .filter((c) => c.total > 0)
    .sort((x, y) => y.total - x.total || x.nombre.localeCompare(y.nombre, 'es'))
}
