import { useEffect, useState } from "react"
import { Clapperboard } from "lucide-react"
import { hayVideo, SUBTITULOS } from "../lib/video"
import { useIdioma } from "../i18n"
import { IDIOMAS, NOMBRES, LOCALES } from "../i18n/idiomas"

// Video de una app: lee /videos/<app>.mp4 con portada /videos/<app>.jpg (carpeta public/videos).
// Parte en silencio, con controles y preload="metadata" (no descarga el video hasta que se reproduce).
// Si tiene subtítulos (/videos/<app>.<idioma>.vtt, lista en lib/video.js) van las tres pistas, con la del
// idioma de la página activa por defecto; el botón de subtítulos de los controles cambia de pista.
// Si el archivo no existe muestra "Video próximamente" en el mismo recuadro 16:9, sin mover el layout.

export default function AppVideo({ app, nombre }) {
  const { idioma, t } = useIdioma()
  const src = `/videos/${app}.mp4`
  const [estado, setEstado] = useState("revisando") // revisando | listo | sin-video

  useEffect(() => {
    let vigente = true
    setEstado("revisando")
    hayVideo(src).then(ok => { if (vigente) setEstado(ok ? "listo" : "sin-video") })
    return () => { vigente = false }
  }, [src])

  if (estado === "listo") {
    const pistas = SUBTITULOS[app] || []
    return (
      <div className="ah-video-caja">
      <div className="ah-video">
        {/* key: al cambiar de idioma se vuelve a montar para que la pista por defecto sea la nueva */}
        <video key={idioma} className="ah-video__medio" src={src} poster={`/videos/${app}.jpg`} controls muted playsInline
          preload="metadata" aria-label={t("video.aria", { nombre })} onError={() => setEstado("sin-video")}>
          {IDIOMAS.filter(i => pistas.includes(i)).map(i => (
            <track key={i} kind="subtitles" src={`/videos/${app}.${i}.vtt`} srcLang={LOCALES[i]} label={NOMBRES[i]} default={i === idioma} />
          ))}
        </video>
      </div>
      {pistas.length > 0 && <p className="ah-video__nota">{t("video.subtitulos")}</p>}
      </div>
    )
  }

  return (
    <div className="ah-video ah-video--vacio" aria-busy={estado === "revisando" || undefined}>
      {estado === "sin-video" && (
        <div className="ah-video__pronto">
          <Clapperboard size={32} strokeWidth={1.5} aria-hidden="true" />
          <p className="ah-video__titulo">{t("video.pronto.titulo")}</p>
          <p className="ah-video__texto">{t("video.pronto.texto", { nombre })}</p>
        </div>
      )}
    </div>
  )
}
