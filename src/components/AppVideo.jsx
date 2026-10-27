import { useEffect, useState } from "react"
import { Clapperboard } from "lucide-react"
import { hayVideo } from "../lib/video"

// Video de una app: lee /videos/<app>.mp4 con portada /videos/<app>.jpg (carpeta public/videos).
// Parte en silencio, con controles y preload="metadata" (no descarga el video hasta que se reproduce).
// Si el archivo no existe muestra "Video próximamente" en el mismo recuadro 16:9, sin mover el layout.

export default function AppVideo({ app, nombre }) {
  const src = `/videos/${app}.mp4`
  const [estado, setEstado] = useState("revisando") // revisando | listo | sin-video

  useEffect(() => {
    let vigente = true
    setEstado("revisando")
    hayVideo(src).then(ok => { if (vigente) setEstado(ok ? "listo" : "sin-video") })
    return () => { vigente = false }
  }, [src])

  if (estado === "listo") {
    return (
      <div className="ah-video">
        <video className="ah-video__medio" src={src} poster={`/videos/${app}.jpg`} controls muted playsInline
          preload="metadata" aria-label={`Video de ${nombre}`} onError={() => setEstado("sin-video")} />
      </div>
    )
  }

  return (
    <div className="ah-video ah-video--vacio" aria-busy={estado === "revisando" || undefined}>
      {estado === "sin-video" && (
        <div className="ah-video__pronto">
          <Clapperboard size={32} strokeWidth={1.5} aria-hidden="true" />
          <p className="ah-video__titulo">Video próximamente</p>
          <p className="ah-video__texto">Estamos preparando un video corto de {nombre}. Mientras tanto, te lo mostramos en una reunión.</p>
        </div>
      )}
    </div>
  )
}
