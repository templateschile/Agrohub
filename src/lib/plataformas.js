// Plataformas en que se ofrece la app AgroHubs. Es el único lugar donde se escriben: cambiarlas aquí
// cambia todo el sitio. Ojo: hasta este cambio el sitio decía "Android y web (iOS próximamente)"
// (commit 1895950); Fernando pidió decir "iOS y Android" y lo confirma antes de publicar.
export const PLATAFORMAS = ["iOS", "Android"]

// "iOS y Android" / "iOS and Android" / "iOS e Android" (con la conjunción del idioma)
export function listaPlataformas(y = "y", plataformas = PLATAFORMAS) {
  return plataformas.length > 1 ? `${plataformas.slice(0, -1).join(", ")} ${y} ${plataformas[plataformas.length - 1]}` : plataformas.join("")
}
