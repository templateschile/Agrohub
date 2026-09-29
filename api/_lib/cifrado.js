// Cifrado AES-256-GCM para la boveda de cuentas. La llave vive solo en Vercel (VAULT_KEY,
// 32 bytes en base64): si se pierde, lo guardado no se puede recuperar.
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

function llave() {
  const k = Buffer.from(process.env.VAULT_KEY || '', 'base64')
  if (k.length !== 32) throw new Error('VAULT_KEY no configurada')
  return k
}

export const cifradoConfigurado = () => {
  try { llave(); return true } catch { return false }
}

export function cifrar(texto) {
  const iv = randomBytes(12)
  const c = createCipheriv('aes-256-gcm', llave(), iv)
  const datos = Buffer.concat([c.update(String(texto), 'utf8'), c.final()])
  return [iv, c.getAuthTag(), datos].map(b => b.toString('base64')).join('.')
}

export function descifrar(paquete) {
  const [iv, tag, datos] = String(paquete).split('.').map(p => Buffer.from(p, 'base64'))
  const d = createDecipheriv('aes-256-gcm', llave(), iv)
  d.setAuthTag(tag)
  return Buffer.concat([d.update(datos), d.final()]).toString('utf8')
}
