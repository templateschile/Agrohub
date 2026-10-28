import { useIdioma } from "../i18n"

// Crédito de una foto de Unsplash: al final, sobre la imagen (abajo a la derecha). El contenedor de la
// foto tiene que tener position: relative. `foto` viene de src/lib/fotos.js.
const UTM = "?utm_source=agrohubs&utm_medium=referral"

export default function CreditoFoto({ foto, className = "" }) {
  const { t } = useIdioma()
  if (!foto) return null
  return (
    <p className={`ah-credito ${className}`} data-keep>
      {t("foto.credito.antes")}{" "}
      <a href={`https://unsplash.com/@${foto.perfil}${UTM}`} target="_blank" rel="noopener noreferrer">{foto.autor}</a>
      {" "}{t("foto.credito.en")}{" "}
      <a href={`https://unsplash.com/photos/${foto.id}${UTM}`} target="_blank" rel="noopener noreferrer">Unsplash</a>
    </p>
  )
}
