// Correo saliente (SMTP) y entrante (IMAP) de la casilla configurada en Vercel.
import nodemailer from 'nodemailer'

export const escapar = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

export const smtpConfigurado = () => Boolean(process.env.SMTP_USER && process.env.SMTP_PASS)

export function transporte() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST || 'smtp.gmail.com',
    port:   Number(process.env.SMTP_PORT) || 465,
    secure: (Number(process.env.SMTP_PORT) || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
}

export const remitente = () => process.env.SMTP_FROM || process.env.SMTP_USER

export const imapConfig = () => ({
  host: process.env.IMAP_HOST || process.env.SMTP_HOST,
  port: Number(process.env.IMAP_PORT) || 993,
  secure: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  logger: false,
})

// Firmas del equipo (HTML para correos). El logo es PNG porque Gmail y Outlook no muestran SVG.
// `whatsapp`: numero en formato internacional sin "+" (vacio = no se muestra)
const SITIO = process.env.SITE_URL || 'https://www.agrohubs.cl'
export const FIRMAS = {
  marcos:   { nombre: 'Marcos Contreras',  cargo: 'Agricultura Digital y Transferencia Tecnológica', email: 'marcos@agrohubs.cl',   whatsapp: '56963731824' },
  cristian: { nombre: 'Cristián Betteley', cargo: 'AgroHub',                                        email: 'cristian@agrohubs.cl', whatsapp: '' },
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
export async function enviarGracias({ nombre, email, tipo }) {
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
  await transporte().sendMail({
    from: remitente(),
    to: email,
    replyTo: FIRMAS.marcos.email,
    subject: `Gracias por ${que} · AgroHub`,
    html,
  })
}
