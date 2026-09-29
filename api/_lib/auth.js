import { timingSafeEqual } from 'node:crypto'
import { redis, storeConfigurado } from './store.js'

const MAX_INTENTOS = 10
const VENTANA_SEG = 15 * 60

const ip = req => String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim()

function claveCorrecta(req) {
  const clave = process.env.ADMIN_PASSWORD
  const recibido = (req.headers.authorization || '').replace(/^Bearer /, '')
  if (!clave || !recibido) return false
  const a = Buffer.from(clave), b = Buffer.from(recibido)
  return a.length === b.length && timingSafeEqual(a, b)
}

// Valida la clave del admin y bloquea la IP tras varios intentos fallidos.
// Responde por si mismo y devuelve false cuando no autoriza.
export async function autorizar(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  const clave = `fallos:${ip(req)}`
  if (storeConfigurado()) {
    const fallos = Number(await redis(['GET', clave]).catch(() => 0)) || 0
    if (fallos >= MAX_INTENTOS) {
      res.status(429).json({ ok: false, error: 'Demasiados intentos. Espera 15 minutos.' })
      return false
    }
  }
  if (claveCorrecta(req)) return true
  if (storeConfigurado()) {
    await redis(['INCR', clave]).catch(() => {})
    await redis(['EXPIRE', clave, String(VENTANA_SEG)]).catch(() => {})
  }
  res.status(401).json({ ok: false, error: 'Clave incorrecta' })
  return false
}
