// Fotos de la portada. La del huerto es de AgroHubs (public/img/campo.jpg); las demás son de
// Wikimedia Commons con licencia libre y van con su crédito en el pie de página.
const COMMONS = "https://upload.wikimedia.org/wikipedia/commons/"

// Miniatura de Commons en un ancho estándar (960, 1280 o 1920)
const mini = (ruta, ancho) => {
  const archivo = ruta.split("/").pop()
  return `${COMMONS}thumb/${ruta}/${ancho}px-${archivo}`
}
const commons = ruta => ({
  src: mini(ruta, 960),
  srcSet: [960, 1280, 1920].map(w => `${mini(ruta, w)} ${w}w`).join(", "),
})

export const CAMPO = { src: "/img/campo.jpg", alt: "Hileras de frutales en un huerto, con el cielo despejado" }

export const FOTOS = {
  helada: { ...commons("1/16/D%C3%BClmen%2C_Hausd%C3%BClmen%2C_Zaun_einer_Wiese_--_2021_--_5083.jpg"), alt: "Escarcha en un alambre de púas al amanecer", pos: "50% 50%",
    autor: "Dietmar Rabich", licencia: "CC BY-SA 4.0", pagina: "https://commons.wikimedia.org/wiki/File:D%C3%BClmen,_Hausd%C3%BClmen,_Zaun_einer_Wiese_--_2021_--_5083.jpg" },
  terreno: { ...commons("f/f8/Grape_worker.jpg"), alt: "Trabajador entre hileras de una viña", pos: "50% 35%",
    autor: "Tomas Castelazo", licencia: "CC BY 3.0", pagina: "https://commons.wikimedia.org/wiki/File:Grape_worker.jpg" },
  flor: { ...commons("8/86/Apple-tree_blossoms_2017_G3.jpg"), alt: "Flores de manzano en una rama, con el cielo despejado", pos: "50% 45%",
    autor: "George Chernilevsky", licencia: "Dominio público", pagina: "https://commons.wikimedia.org/wiki/File:Apple-tree_blossoms_2017_G3.jpg" },
}

// Foto que se oculta si no carga: queda el marco con su fondo
export function Foto({ foto, sizes = "100vw", prioridad = false, className = "" }) {
  return (
    <img className={`ah-foto ${className}`} src={foto.src} srcSet={foto.srcSet} sizes={foto.srcSet ? sizes : undefined}
      alt={foto.alt} loading={prioridad ? "eager" : "lazy"} fetchpriority={prioridad ? "high" : undefined} decoding="async"
      style={foto.pos ? { objectPosition: foto.pos } : undefined}
      onError={e => { e.currentTarget.hidden = true }} />
  )
}
