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
  if (d.user && !d.casillas) return { casillas: [{ id: 'c1', firma: 'cristian', ...d }], principal: 'c1' }
  return { casillas: d.casillas || [], principal: d.principal || d.casillas?.[0]?.id || '' }
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

// Casilla pedida por id; sin id, la principal. Si no hay ninguna con clave, se usa Vercel.
export async function configCorreo(id) {
  const { casillas, principal } = await leerCasillas()
  const conClave = casillas.filter(c => c.user && c.pass)
  const c = conClave.find(x => x.id === id) || conClave.find(x => x.id === principal) || conClave[0]
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

// Firmas del equipo (HTML para correos). El logo es PNG porque Gmail y Outlook no muestran SVG.
// `whatsapp`: numero en formato internacional sin "+" (vacio = no se muestra)
const SITIO = process.env.SITE_URL || 'https://www.agrohubs.cl'
export const FIRMAS = {
  marcos:   { nombre: 'Marcos Contreras',  cargo: 'Agricultura Digital y Transferencia Tecnológica', email: 'marcos@agrohubs.cl',   whatsapp: '56963731824' },
  cristian: { nombre: 'Cristián Betteley', cargo: 'Tech Lead · Plataforma y Datos',                 email: 'cristian@agrohubs.cl', whatsapp: '56987561075' },
  equipo:   { nombre: 'Equipo AgroHub',    cargo: 'Cotizaciones',                                   email: 'cotizaciones@agrohubs.cl', whatsapp: '' },
}

const whatsappVisible = n => `+${n.slice(0, 2)} ${n.slice(2, 3)} ${n.slice(3, 7)} ${n.slice(7)}`

export function firmaHtml(id = 'marcos') {
  const f = FIRMAS[id] || FIRMAS.marcos
  const wa = f.whatsapp
    ? `<div>📱 <a href="https://wa.me/${f.whatsapp}" style="color:#2d7325;text-decoration:none">WhatsApp ${whatsappVisible(f.whatsapp)}</a></div>`
    : ''
  return `
<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:13px;color:#374151;margin-top:18px">
  <tr>
    <td style="padding-right:14px;border-right:3px solid #2d7325;vertical-align:middle">
      <img src="${SITIO}/logo-email.png" width="56" height="56" alt="AgroHub" style="display:block;border-radius:12px">
    </td>
    <td style="padding-left:14px;line-height:1.5;vertical-align:middle">
      <div style="font-size:15px;font-weight:bold;color:#111827">${escapar(f.nombre)}</div>
      <div style="color:#6b7280">${escapar(f.cargo)}</div>
      <div style="font-weight:bold;color:#245b1e">Agro<span style="color:#3d9132">Hub</span> <span style="font-weight:normal;color:#9ca3af;font-size:11px">· Centro Demostrativo Móvil</span></div>
      ${wa}
      <div>✉️ <a href="mailto:${f.email}" style="color:#2d7325;text-decoration:none">${f.email}</a></div>
      <div>🌐 <a href="${SITIO}" style="color:#2d7325;text-decoration:none">www.agrohubs.cl</a></div>
    </td>
  </tr>
</table>`
}

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
    subject: `Gracias por ${que} · AgroHub`,
    html,
  })
}
