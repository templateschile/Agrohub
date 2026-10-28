// Crédito de una foto de Unsplash: va al final de la sección, sobre la imagen (abajo a la derecha).
const UTM = "?utm_source=agrohubs&utm_medium=referral"

export default function CreditoFoto({ autor, perfil, foto }) {
  return (
    <p className="absolute bottom-2 right-3 z-20 text-[11px] leading-none text-white/60">
      Foto:{" "}
      <a href={`https://unsplash.com/@${perfil}${UTM}`} target="_blank" rel="noopener noreferrer" className="underline decoration-white/30 hover:text-white">{autor}</a>
      {" "}en{" "}
      <a href={`https://unsplash.com/photos/${foto}${UTM}`} target="_blank" rel="noopener noreferrer" className="underline decoration-white/30 hover:text-white">Unsplash</a>
    </p>
  )
}
