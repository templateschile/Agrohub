// Llamadas autenticadas a los endpoints del admin (/api/admin, /api/correo, /api/boveda)
export async function adminApi(clave, ruta, { method = "GET", query, body } = {}) {
  const qs = query ? "?" + new URLSearchParams(query).toString() : ""
  const res = await fetch(`/api/${ruta}${qs}`, {
    method,
    headers: { Authorization: `Bearer ${clave}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw Object.assign(new Error(json.error || `Error ${res.status}`), { status: res.status })
  return json
}
