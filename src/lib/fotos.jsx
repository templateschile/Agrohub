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
  clima: { ...commons("a/a8/D%C3%BClmen%2C_B%C3%B6rnste%2C_Tropfen_am_Gatter_--_2020_--_3592.jpg"), alt: "Gotas de lluvia en la reja de un potrero", pos: "50% 40%",
    autor: "Dietmar Rabich", licencia: "CC BY-SA 4.0", pagina: "https://commons.wikimedia.org/wiki/File:D%C3%BClmen,_B%C3%B6rnste,_Tropfen_am_Gatter_--_2020_--_3592.jpg" },
  huerto: { ...commons("0/03/%C3%84pfel_P1260372.jpg"), alt: "Hilera de manzanos en espaldera cargados de fruta roja", pos: "50% 50%",
    autor: "Fischer.H", licencia: "CC BY-SA 4.0", pagina: "https://commons.wikimedia.org/wiki/File:%C3%84pfel_P1260372.jpg" },
  cosecha: { ...commons("c/ca/Javier_shows_part_of_the_grape_harvest_in_his_Lysekil_vineyard_1_-_cropped.jpg"), alt: "Manos con racimos de uva recién cosechados", pos: "50% 50%",
    autor: "W.carter", licencia: "CC0", pagina: "https://commons.wikimedia.org/wiki/File:Javier_shows_part_of_the_grape_harvest_in_his_Lysekil_vineyard_1_-_cropped.jpg" },
  mercado: { ...commons("a/a5/Sweet_cherries_in_basket_2018_G1.jpg"), alt: "Canasto lleno de cerezas sobre el pasto", pos: "50% 50%",
    autor: "George Chernilevsky", licencia: "Dominio público", pagina: "https://commons.wikimedia.org/wiki/File:Sweet_cherries_in_basket_2018_G1.jpg" },
  drones: { ...commons("0/09/Monteregie_farmland_aerial_1_2025.jpg"), alt: "Franjas de cultivos vistas desde el aire", pos: "50% 50%",
    autor: "Hayden Soloviev", licencia: "CC BY 4.0", pagina: "https://commons.wikimedia.org/wiki/File:Monteregie_farmland_aerial_1_2025.jpg" },
  terreno: { ...commons("f/f8/Grape_worker.jpg"), alt: "Trabajador sonriente entre hileras de una viña", pos: "50% 35%",
    autor: "Tomas Castelazo", licencia: "CC BY 3.0", pagina: "https://commons.wikimedia.org/wiki/File:Grape_worker.jpg" },
  vina: { ...commons("8/8b/Vineyard_in_Cabrerolles.jpg"), alt: "Viña en otoño con hileras amarillas", pos: "50% 60%",
    autor: "Christian Ferrer", licencia: "CC BY 4.0", pagina: "https://commons.wikimedia.org/wiki/File:Vineyard_in_Cabrerolles.jpg" },
}

// Foto que se oculta si no carga: queda el fondo de color y el ícono del bloque
export function Foto({ foto, sizes = "100vw", prioridad = false, className = "" }) {
  return (
    <img className={`ah-foto ${className}`} src={foto.src} srcSet={foto.srcSet} sizes={foto.srcSet ? sizes : undefined}
      alt={foto.alt} loading={prioridad ? "eager" : "lazy"} fetchpriority={prioridad ? "high" : undefined} decoding="async"
      style={foto.pos ? { objectPosition: foto.pos } : undefined}
      onError={e => { e.currentTarget.style.display = "none" }} />
  )
}
