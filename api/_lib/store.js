// Almacenamiento en Upstash Redis (Vercel Marketplace) via REST, sin dependencias.
const URL   = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

const LISTA = 'leads'
const clave = id => `lead:${id}`

export const storeConfigurado = () => Boolean(URL && TOKEN)

async function redis(cmd) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify(cmd),
  })
  const json = await res.json()
  if (json.error) throw new Error(json.error)
  return json.result
}

export async function guardarLead(lead) {
  await redis(['SET', clave(lead.id), JSON.stringify(lead)])
  await redis(['LPUSH', LISTA, lead.id])
}

export async function obtenerLead(id) {
  const raw = await redis(['GET', clave(id)])
  return raw ? JSON.parse(raw) : null
}

export async function actualizarLead(id, cambios) {
  const lead = await obtenerLead(id)
  if (!lead) return null
  const nuevo = { ...lead, ...cambios, actualizado: new Date().toISOString() }
  await redis(['SET', clave(id), JSON.stringify(nuevo)])
  return nuevo
}

export async function listarLeads(max = 200) {
  const ids = await redis(['LRANGE', LISTA, '0', String(max - 1)])
  if (!ids?.length) return []
  const raws = await redis(['MGET', ...ids.map(clave)])
  return raws.filter(Boolean).map(r => JSON.parse(r))
}
