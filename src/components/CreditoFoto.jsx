import { useIdioma, Enlace } from "../i18n"

// Crédito discreto de una foto de Unsplash: solo el nombre del autor, muy pequeño y casi transparente en la
// esquina inferior derecha; sube de opacidad al pasar el cursor o enfocar. El nombre lleva a /creditos, donde
// está la lista completa con el enlace a cada foto y a cada autor en Unsplash (condición de la licencia).
// El contenedor de la foto tiene que tener position: relative. `foto` viene de src/lib/fotos.js.
export default function CreditoFoto({ foto, className = "" }) {
  const { t } = useIdioma()
  if (!foto) return null
  return (
    <p className={`ah-credito ${className}`} data-keep>
      <Enlace to="/creditos" aria-label={t("foto.credito.aria", { autor: foto.autor })}>{foto.autor}</Enlace>
    </p>
  )
}
