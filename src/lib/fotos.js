// Fotos reales de campo, todas de Unsplash (licencia Unsplash: uso libre, crédito voluntario que igual damos).
// Cada una: `imagen` (id en images.unsplash.com), `autor`, `perfil` (usuario), `id` (página de la foto) y
// `alt` en los tres idiomas. Se muestran con <Foto> (WebP, srcset y carga diferida) y <CreditoFoto>.
// Nada enlazado desde Wikimedia.
export const FOTOS = {
  paltos: {
    imagen: "photo-1789919350057-cf61e32bf138", autor: "Timur Seyfelmlyukov", perfil: "timurse", id: "JA95LH6tfI4", pos: "50% 38%",
    alt: { es: "Paltos con fruta colgando de las ramas, a contraluz", en: "Avocado trees with fruit hanging from the branches, backlit", pt: "Abacateiros com frutos pendurados nos galhos, contra a luz" },
  },
  hortalizas: {
    imagen: "photo-1788122137594-f1c1cfda2a74", autor: "Bernd Dittrich", perfil: "hdbernd", id: "P85kHT2SlxU",
    alt: { es: "Hileras de hortalizas vistas desde el aire", en: "Rows of vegetables seen from the air", pt: "Fileiras de hortaliças vistas do alto" },
  },
  lechugas: {
    imagen: "photo-1791214561246-b09c29d93a24", autor: "Divaris Shirichena", perfil: "divaris", id: "4pHBWzgLHiU",
    alt: { es: "Hileras de lechugas en un campo con riego", en: "Rows of lettuce in an irrigated field", pt: "Fileiras de alface em um campo irrigado" },
  },
  vinas: {
    imagen: "photo-1563514227147-6d2ff665a6a0", autor: "Dan Meyers", perfil: "dmey503", id: "0AgtPoAARtE", pos: "50% 60%",
    alt: { es: "Hileras de viñedo en una ladera, con lomas boscosas al fondo", en: "Rows of vines on a slope, with wooded hills in the background", pt: "Fileiras de videiras em uma encosta, com colinas arborizadas ao fundo" },
  },
  frutales: {
    imagen: "photo-1780621752668-8e8a9865dc1e", autor: "nhxl bdl", perfil: "nnulll___", id: "ka_OiW3I_uE",
    alt: { es: "Naranjos cargados de fruta madura en un huerto", en: "Orange trees laden with ripe fruit in an orchard", pt: "Laranjeiras carregadas de frutos maduros em um pomar" },
  },
  cereales: {
    imagen: "photo-1567547921486-f280c2f53b5d", autor: "Jesse Gardner", perfil: "plasticmind", id: "JYU14tnbfOA",
    alt: { es: "Plantas de maíz altas en un campo bajo un cielo nublado", en: "Tall corn plants in a field under a cloudy sky", pt: "Pés de milho altos em uma lavoura sob céu nublado" },
  },
  ganado: {
    imagen: "photo-1783908721710-692d18918efd", autor: "SOL", perfil: "sol_kk", id: "vpfBsRsXPng", pos: "50% 65%",
    alt: { es: "Vacas lecheras pastando en una pradera verde junto a un gran árbol", en: "Dairy cows grazing in a green pasture beside a large tree", pt: "Vacas leiteiras pastando em um pasto verde ao lado de uma grande árvore" },
  },
  cosecha: {
    imagen: "photo-1602491399366-770fb37c7c76", autor: "Andrea Cairone", perfil: "kaicaironejpg", id: "rJuUTnD9Ei8",
    alt: { es: "Trabajador levantando una caja de uvas recién cosechadas en el viñedo", en: "Worker lifting a crate of freshly harvested grapes in the vineyard", pt: "Trabalhador levantando uma caixa de uvas recém-colhidas no vinhedo" },
  },
  capacitacion: {
    imagen: "photo-1791570923966-e113b13766a7", autor: "David Maillard", perfil: "orubecoffee", id: "Ft6VsaJYdBo", pos: "45% 40%",
    alt: { es: "Tres productores revisan una planta de café mientras conversan en una ladera", en: "Three growers examine a coffee plant while talking on a hillside", pt: "Três produtores examinam um pé de café enquanto conversam em uma encosta" },
  },
  dron: {
    imagen: "photo-1713952160156-bb59cac789a9", autor: "DRONE EFT", perfil: "eftdrone", id: "nMDwrS1NsIE", pos: "50% 40%",
    alt: { es: "Dron agrícola pulverizando sobre las hileras de un cultivo verde", en: "Agricultural drone spraying over the rows of a green crop", pt: "Drone agrícola pulverizando sobre as fileiras de uma lavoura verde" },
  },
  residuos: {
    imagen: "photo-1759950345204-dae34876d9cb", autor: "Sergej *****", perfil: "skstrannik", id: "8rpBgbnM8Ps", pos: "50% 60%",
    alt: { es: "Rollos de tubería plástica corrugada dejados sobre tierra y pasto seco", en: "Coils of corrugated plastic pipe left on soil and dry grass", pt: "Rolos de tubo plástico corrugado deixados sobre terra e capim seco" },
  },
  feria: {
    imagen: "photo-1729622493745-03ca9590c64a", autor: "Ricky Beron", perfil: "nacio1966", id: "V0sZeTunIvY",
    alt: { es: "Puesto de feria repleto de fruta fresca a la venta: uvas, mangos, manzanas y cerezas", en: "Market stall packed with fresh fruit for sale: grapes, mangoes, apples and cherries", pt: "Banca de feira repleta de frutas frescas à venda: uvas, mangas, maçãs e cerejas" },
  },
}

// URL de una foto de Unsplash en un ancho dado; `alto` recorta en el servidor (fit=crop)
export function urlFoto(foto, ancho, { alto, formato = "webp", calidad = 70 } = {}) {
  const h = alto ? `&h=${Math.round(alto)}` : ""
  return `https://images.unsplash.com/${foto.imagen}?w=${ancho}${h}&q=${calidad}&fm=${formato}&fit=crop&crop=entropy`
}
