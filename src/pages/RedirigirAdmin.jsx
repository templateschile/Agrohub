import { useEffect } from "react"
import { useLocation } from "react-router-dom"

// El admin del sitio se movió al panel de la plataforma (admin.agrohubs.cl › Sitio agrohubs.cl).
// vercel.json ya redirige /admin en el servidor; esto cubre la navegación dentro de la SPA.
export const ADMIN_URL = "https://admin.agrohubs.cl"

// Links antiguos: /admin?id=<lead> (avisos por email/Telegram) y /admin?tab=correo|seguimiento|cuentas
export function destinoAdmin(search) {
  const p = new URLSearchParams(search)
  const id = p.get("id")
  if (id) return `${ADMIN_URL}/site/propuestas?id=${encodeURIComponent(id)}`
  const tab = p.get("tab")
  if (tab === "correo") return `${ADMIN_URL}/site/correo`
  if (tab === "seguimiento") return `${ADMIN_URL}/site/seguimiento`
  if (tab === "cuentas") return `${ADMIN_URL}/site/boveda`
  return `${ADMIN_URL}/`
}

export default function RedirigirAdmin() {
  const { search } = useLocation()
  const destino = destinoAdmin(search)
  useEffect(() => { window.location.replace(destino) }, [destino])
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <p className="text-sm text-gray-600">
        El admin ahora está en <a href={destino} className="text-agro-green-700 underline font-semibold">admin.agrohubs.cl</a>. Redirigiendo…
      </p>
    </div>
  )
}
