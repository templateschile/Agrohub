// Envia un formulario al API de la plataforma AgroHubs (POST /api/v1/site/leads): se guarda para
// el admin (admin.agrohubs.cl › Sitio agrohubs.cl › Propuestas) y se avisa al equipo por email y Telegram.
// La URL se puede cambiar con VITE_LEADS_URL (p. ej. para probar contra un API local).
// (`?.`: fuera de Vite, en las pruebas de scripts/tests, import.meta.env no existe)
export const LEADS_URL = import.meta.env?.VITE_LEADS_URL || "https://api.agrohubs.cl/api/v1/site/leads"

// Alternativa que muestran los formularios si el envío falla
export const CORREO_CONTACTO = "cotizaciones@agrohubs.cl"

// Solo cuenta como enviado si el API responde { ok: true }. Un error HTTP, una respuesta que no es
// JSON (p. ej. una página HTML) o un fallo de red devuelven false. Se prueba en scripts/tests.
// `idioma` (es, en o pt): el idioma de la página. Va dentro de `respuestas`, que el API guarda tal cual
// (un campo nuevo en la raíz lo descartaría); el resumen para el equipo sigue en español.
export async function enviarLead({ tipo, contacto, mensaje = "", resumen = [], respuestas = null, website = "", idioma }, pedir = fetch) {
  try {
    const conIdioma = idioma ? { ...(respuestas || {}), idioma } : respuestas
    const res = await pedir(LEADS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, contacto, mensaje, resumen, respuestas: conIdioma, website }),
    })
    const json = await res.json().catch(() => null)
    return res.ok && json?.ok === true
  } catch (_) {
    return false
  }
}

export const emailValido = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())

// Número de WhatsApp del equipo para el enlace "Escríbenos por WhatsApp" (solo dígitos, con código de país,
// p. ej. "56912345678"). No hay ninguno en el repo: queda vacío y el enlace no se muestra hasta que se cargue.
export const WHATSAPP = import.meta.env?.VITE_WHATSAPP || ""
