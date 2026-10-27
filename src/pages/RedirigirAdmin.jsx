import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { destinoAdmin } from "../lib/admin"

// El admin del sitio se movió al panel de la plataforma (admin.agrohubs.cl › Sitio agrohubs.cl).
// vercel.json ya redirige /admin en el servidor; esto cubre la navegación dentro de la SPA.
// La tabla de links antiguos (?id= y ?tab=) está en lib/admin.js.

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
