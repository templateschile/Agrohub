// El admin del sitio se movió al panel de la plataforma (admin.agrohubs.cl › Sitio agrohubs.cl).
// Links antiguos: /admin?id=<lead> (avisos por email/Telegram) y /admin?tab=correo|seguimiento|cuentas.
// vercel.json aplica la misma tabla en el servidor y RedirigirAdmin.jsx dentro de la SPA;
// scripts/tests/sitio.test.mjs revisa que ambos lleven al mismo lugar.
export const ADMIN_URL = "https://admin.agrohubs.cl"

export const PESTANAS_ADMIN = {
  correo: "/site/correo",
  seguimiento: "/site/seguimiento",
  cuentas: "/site/boveda",
}

export function destinoAdmin(search) {
  const p = new URLSearchParams(search)
  const id = p.get("id")
  if (id) return `${ADMIN_URL}/site/propuestas?id=${encodeURIComponent(id)}`
  const tab = p.get("tab")
  const conocida = tab && Object.prototype.hasOwnProperty.call(PESTANAS_ADMIN, tab)
  return ADMIN_URL + (conocida ? PESTANAS_ADMIN[tab] : "/")
}
