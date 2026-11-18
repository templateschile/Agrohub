// Título, descripción, URL y datos estructurados (JSON-LD) del índice /integraciones y de cada página
// /integraciones/<slug>. Funciones puras: las usan las páginas en React (src/pages/Integracion*.jsx) y el HTML
// previo del build (scripts/prerender-integraciones.mjs), así buscadores y LLM leen lo mismo que la persona.
// `i`: una integración ya traducida (integracionesDe(idioma)); `t`: el traductor del idioma.
import { SITIO, LOCALES, conIdioma } from "../i18n/idiomas.js"

const url = (ruta, idioma) => SITIO + conIdioma(ruta, idioma)

export function seoIndice(integraciones, idioma, t) {
  const n = integraciones.length
  const enlace = url("/integraciones", idioma)
  return {
    titulo: t("intg.indice.metaTitulo", { n }),
    descripcion: t("intg.indice.metaDescripcion", { n }),
    url: enlace,
    ld: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage", "@id": enlace, url: enlace, name: t("intg.indice.titulo"), description: t("intg.indice.metaDescripcion", { n }),
          inLanguage: LOCALES[idioma], isPartOf: { "@type": "WebSite", name: "AgroHubs", url: url("/", idioma) },
          mainEntity: {
            "@type": "ItemList", numberOfItems: n,
            itemListElement: integraciones.map((x, k) => ({ "@type": "ListItem", position: k + 1, name: x.nombre, url: url(`/integraciones/${x.slug}`, idioma) })),
          },
        },
        migas([[t("nav.inicio").replace(/,.*$/, ""), url("/", idioma)], [t("intg.migas"), enlace]], enlace),
      ],
    },
  }
}

export function seoIntegracion(i, idioma, t) {
  const enlace = url(`/integraciones/${i.slug}`, idioma)
  const titulo = t("intg.pagina.metaTitulo", { nombre: i.nombre, tema: i.tema })
  return {
    titulo,
    h1: t("intg.pagina.titulo", { nombre: i.nombre }),
    descripcion: i.resumen,
    url: enlace,
    ld: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage", "@id": enlace, url: enlace, name: titulo, description: i.resumen, inLanguage: LOCALES[idioma],
          isPartOf: { "@type": "WebSite", name: "AgroHubs", url: url("/", idioma) },
          breadcrumb: { "@id": `${enlace}#migas` }, about: { "@id": `${enlace}#fuente` },
        },
        migas([[t("nav.inicio").replace(/,.*$/, ""), url("/", idioma)], [t("intg.migas"), url("/integraciones", idioma)], [i.nombre, enlace]], enlace),
        {
          "@type": "Dataset", "@id": `${enlace}#fuente`, name: i.nombre, description: i.resumen, url: i.enlace,
          creator: { "@type": "Organization", name: i.organizacion }, variableMeasured: i.datos,
          ...(i.cobertura ? { spatialCoverage: { "@type": "Place", name: i.cobertura } } : {}),
        },
      ],
    },
  }
}

function migas(pasos, enlace) {
  return {
    "@type": "BreadcrumbList", "@id": `${enlace}#migas`,
    itemListElement: pasos.map(([name, item], k) => ({ "@type": "ListItem", position: k + 1, name, item })),
  }
}

// JSON-LD listo para <script type="application/ld+json">: sin "<" que pueda cerrar la etiqueta
export const ldTexto = (ld) => JSON.stringify(ld).replace(/</g, "\\u003c")
