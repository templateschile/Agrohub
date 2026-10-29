import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { CalendarCheck } from "lucide-react"
import { useIdioma } from "../i18n"

// Botón flotante "Agenda una demo", solo en pantallas chicas (CSS) y una vez que se pasó el héroe.
// Lleva al formulario de demo de la portada (#contacto). Se oculta cuando el formulario ya está a la vista.
export default function BotonDemo() {
  const { t, ruta } = useIdioma()
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const al = () => {
      const contacto = document.getElementById("contacto")
      const enVista = contacto && contacto.getBoundingClientRect().top < window.innerHeight * 0.8
      setVisible(window.scrollY > 400 && !enVista)
    }
    al()
    window.addEventListener("scroll", al, { passive: true })
    return () => window.removeEventListener("scroll", al)
  }, [pathname])
  if (!visible) return null
  return (
    <a className="ah-flotante" href={ruta("/#contacto")}>
      <CalendarCheck size={20} strokeWidth={1.75} aria-hidden="true" />{t("cta.demo.flotante")}
    </a>
  )
}
