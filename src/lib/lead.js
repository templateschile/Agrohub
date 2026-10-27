// Envia un formulario al API de la plataforma AgroHubs (POST /api/v1/site/leads): se guarda para
// el admin (admin.agrohubs.cl › Sitio agrohubs.cl › Propuestas) y se avisa al equipo por email y Telegram.
// La URL se puede cambiar con VITE_LEADS_URL (p. ej. para probar contra un API local).
export const LEADS_URL = import.meta.env.VITE_LEADS_URL || "https://api.agrohubs.cl/api/v1/site/leads"

export async function enviarLead({ tipo, contacto, mensaje = "", resumen = [], respuestas = null, website = "" }) {
  try {
    const res = await fetch(LEADS_URL, {
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
