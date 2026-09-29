// Envia un formulario al backend (/api/lead): se guarda para el admin
// y se notifica al equipo por email y Telegram.
export async function enviarLead({ tipo, contacto, mensaje = "", resumen = [], respuestas = null, website = "" }) {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, contacto, mensaje, resumen, respuestas, website }),
    })
    const json = await res.json().catch(() => ({}))
    return res.ok && json.ok !== false
  } catch (_) {
    return false
  }
}

export const emailValido = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())
