// Seguimiento de correos enviados desde el admin (estilo Mailtrack): un pixel de 1x1 registra
// las aperturas y los links pasan por /api/t para registrar clics. Los links van firmados (HMAC)
// para que /api/t no sirva como redireccion abierta hacia cualquier sitio.
import { randomBytes, createHmac, timingSafeEqual } from 'node:crypto'
import { redis } from './store.js'
import { escapar } from './mail.js'

const SITIO = () => process.env.SITE_URL || 'https://www.agrohubs.cl'
const LISTA = 'seguimiento'
const clave = id => `seg:${id}`
const MAX_EVENTOS = 200

const secreto = () => process.env.VAULT_KEY || process.env.ADMIN_PASSWORD || 'agrohubs'
const firmar = (id, url) => createHmac('sha256', secreto()).update(`${id}|${url}`).digest('base64url').slice(0, 22)

export function firmaValida(id, url, firma) {
  const a = Buffer.from(firmar(id, url)), b = Buffer.from(String(firma || ''))
  return a.length === b.length && timingSafeEqual(a, b)
}

export const nuevoId = () => randomBytes(12).toString('base64url')

export async function crearSeguimiento(id, datos) {
  await redis(['SET', clave(id), JSON.stringify({ id, ...datos, aperturas: [], clics: [] })])
  await redis(['LPUSH', LISTA, id])
  await redis(['LTRIM', LISTA, '0', '499'])
}

export async function obtenerSeguimiento(id) {
  const raw = await redis(['GET', clave(id)])
  return raw ? JSON.parse(raw) : null
}

// Registra un evento; devuelve el registro y si fue la primera apertura
export async function registrar(id, tipo, evento) {
  const s = await obtenerSeguimiento(id)
  if (!s) return { s: null, primera: false }
  const lista = tipo === 'clic' ? s.clics : s.aperturas
  const primera = tipo === 'apertura' && s.aperturas.length === 0
  lista.push({ ...evento, t: new Date().toISOString() })
  if (lista.length > MAX_EVENTOS) lista.splice(0, lista.length - MAX_EVENTOS)
  await redis(['SET', clave(id), JSON.stringify(s)])
  return { s, primera }
}

export async function listarSeguimiento(max = 100) {
  const ids = await redis(['LRANGE', LISTA, '0', String(max - 1)])
  if (!ids?.length) return []
  const raws = await redis(['MGET', ...ids.map(clave)])
  return raws.filter(Boolean).map(r => JSON.parse(r))
}

// Texto del correo -> HTML. Con `id`, cada URL pasa por /api/t (clic registrado).
const URL_RE = /\bhttps?:\/\/[^\s<>"']+[^\s<>"'.,;:!?)]/g
export function cuerpoHtml(texto, id) {
  const html = escapar(texto).replace(URL_RE, url => {
    const destino = url.replace(/&amp;/g, '&')
    const href = id ? `${SITIO()}/api/t?i=${id}&u=${encodeURIComponent(destino)}&s=${firmar(id, destino)}` : destino
    return `<a href="${escapar(href)}" style="color:#2d7325">${url}</a>`
  })
  return html.replace(/\n/g, '<br>')
}

export const pixelHtml = id =>
  `<img src="${SITIO()}/api/t?i=${id}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;opacity:0">`
