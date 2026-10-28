import { urlFoto } from "../lib/fotos"
import { useIdioma } from "../i18n"

// Foto de Unsplash: WebP con respaldo JPG, srcset en cuatro anchos y carga diferida (salvo `prioridad`).
// `proporcion` (ancho / alto, p. ej. 4 / 3) recorta en el servidor y reserva el espacio, sin saltos.
const ANCHOS = [480, 800, 1200, 1800]

export default function Foto({ foto, sizes = "100vw", proporcion, prioridad = false, className = "" }) {
  const { idioma } = useIdioma()
  if (!foto) return null
  const alto = w => (proporcion ? w / proporcion : undefined)
  const set = formato => ANCHOS.map(w => `${urlFoto(foto, w, { alto: alto(w), formato })} ${w}w`).join(", ")
  return (
    <picture className={`ah-foto ${className}`}>
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img src={urlFoto(foto, 1200, { alto: alto(1200), formato: "jpg" })} srcSet={set("jpg")} sizes={sizes}
        alt={foto.alt?.[idioma] || foto.alt?.es || ""} width={1200} height={proporcion ? Math.round(1200 / proporcion) : 800}
        loading={prioridad ? "eager" : "lazy"} fetchPriority={prioridad ? "high" : undefined} decoding="async"
        style={foto.pos ? { objectPosition: foto.pos } : undefined} />
    </picture>
  )
}
