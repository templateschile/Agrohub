// Correo saliente (SMTP) y entrante (IMAP). La configuracion se toma del admin
// (pestana Cuentas > Correo del sitio, guardada cifrada) y, si no existe, de Vercel.
import nodemailer from 'nodemailer'
import { redis, storeConfigurado } from './store.js'
import { cifrar, descifrar, cifradoConfigurado } from './cifrado.js'

export const escapar = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const CLAVE_CONFIG = 'config:correo'

// Valores por defecto: mismo servidor Namecheap que compararepuestos.cl (el certificado es
// *.web-hosting.com, por eso no se usa mail.agrohubs.cl como host)
export const SERVIDOR_POR_DEFECTO = { host: 'premium224.web-hosting.com', port: 465, imapPort: 993 }

// Casillas guardadas: { casillas: [{ id, user, from, pass, firma, host, port, imapPort }], principal }
// La principal envia los avisos automaticos y el agradecimiento al cliente.
export async function leerCasillas() {
  const vacio = { casillas: [], principal: '' }
  if (!storeConfigurado() || !cifradoConfigurado()) return vacio
  const raw = await redis(['GET', CLAVE_CONFIG]).catch(() => null)
  if (!raw) return vacio
  let d
  try { d = JSON.parse(descifrar(raw)) } catch { return vacio }
  // Formato anterior: una sola casilla en la raiz
  if (d.user && !d.casillas) return { casillas: [{ id: 'c1', firma: 'cristian', ...d, from: String(d.from || '').replace(/AgroHub(?![\w])/g, 'AgroHubs') }], principal: 'c1' }
  // Remitentes guardados antes del cambio de marca AgroHub -> AgroHubs
  const casillas = (d.casillas || []).map(c => ({ ...c, from: String(c.from || '').replace(/AgroHub(?![\w])/g, 'AgroHubs') }))
  return { casillas, principal: d.principal || d.casillas?.[0]?.id || '' }
}

export async function guardarCasillas(datos) {
  await redis(['SET', CLAVE_CONFIG, cifrar(JSON.stringify(datos))])
}

const desdeVercel = () => ({
  id: 'vercel',
  host: process.env.SMTP_HOST || SERVIDOR_POR_DEFECTO.host,
  port: Number(process.env.SMTP_PORT) || 465,
  imapPort: Number(process.env.IMAP_PORT) || 993,
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
  from: process.env.SMTP_FROM || process.env.SMTP_USER || '',
  firma: 'marcos',
  origen: 'vercel',
})

// Clave compartida: las casillas sin clave propia usan la de cristian@agrohubs.cl
// (o, si no esta, la de la principal). Todas viven en el mismo hosting.
export const CASILLA_CLAVE_COMPARTIDA = 'cristian@agrohubs.cl'
export function claveCompartida({ casillas, principal }) {
  const fuente = casillas.find(c => c.user === CASILLA_CLAVE_COMPARTIDA && c.pass)
    || casillas.find(c => c.id === principal && c.pass)
    || casillas.find(c => c.pass)
  return fuente?.pass || ''
}

// Casilla pedida por id (o por email); sin id, la principal. Si no hay ninguna usable, se usa Vercel.
export async function configCorreo(id) {
  const datos = await leerCasillas()
  const compartida = claveCompartida(datos)
  const usables = datos.casillas.filter(c => c.user).map(c => ({ ...c, pass: c.pass || compartida })).filter(c => c.pass)
  const c = usables.find(x => x.id === id || x.user === id) || usables.find(x => x.id === datos.principal) || usables[0]
  return c ? { ...SERVIDOR_POR_DEFECTO, ...c, origen: 'admin' } : desdeVercel()
}

export const smtpConfigurado = cfg => Boolean(cfg?.user && cfg?.pass)

export const transporte = cfg => nodemailer.createTransport({
  host: cfg.host, port: Number(cfg.port) || 465,
  secure: (Number(cfg.port) || 465) === 465,
  auth: { user: cfg.user, pass: cfg.pass },
})

export const remitente = cfg => cfg.from || cfg.user

export const imapConfig = cfg => ({
  host: cfg.imapHost || cfg.host,
  port: Number(cfg.imapPort) || 993,
  secure: true,
  auth: { user: cfg.user, pass: cfg.pass },
  logger: false,
})

// Firmas: modulo compartido con el admin (vista previa al redactar)
import { FIRMAS, firmaHtml as firmaBase } from '../../src/lib/firmas.js'
export { FIRMAS }
export const firmaHtml = id => firmaBase(id, process.env.SITE_URL || 'https://www.agrohubs.cl')

// Agradecimiento al cliente que envio el formulario, firmado por Marcos
export async function enviarGracias(cfg, { nombre, email, tipo }) {
  const primer = String(nombre || '').trim().split(/\s+/)[0] || ''
  const que = tipo === 'evaluacion' ? 'tu evaluación' : tipo === 'pedido' ? 'tu pedido' : 'tu mensaje'
  const html = `
<div style="font-family:Arial,sans-serif;font-size:14px;color:#1f2937;line-height:1.6">
  <p>Hola ${escapar(primer)}:</p>
  <p>Muchas gracias por ${que}. Ya la recibimos y nuestro equipo la está revisando.</p>
  <p>Prontamente nos contactaremos con tu equipo para coordinar los próximos pasos.</p>
  <p>Saludos cordiales,</p>
  ${firmaHtml('marcos')}
</div>`
  await transporte(cfg).sendMail({
    from: remitente(cfg),
    to: email,
    replyTo: FIRMAS.marcos.email,
    subject: `Gracias por ${que} · AgroHubs`,
    html,
  })
}
