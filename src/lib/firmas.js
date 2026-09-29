// Firmas de correo del equipo. Lo usan el servidor (api/_lib/mail.js) al enviar y el admin
// para la vista previa, asi ambos muestran exactamente lo mismo.
const escapar = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

// Firmas del equipo (HTML para correos). El logo es un PNG a 3x con tamaño fijo: Gmail y Outlook
// no muestran SVG y asi no se deforma ni se desarma al achicar la firma.
// `whatsapp`: numero en formato internacional sin "+" (vacio = no se muestra)
export const FIRMAS = {
  marcos:   { nombre: 'Marcos Contreras',  cargo: 'Agricultura Digital y Transferencia Tecnológica', email: 'marcos@agrohubs.cl',   whatsapp: '56963731824' },
  cristian: { nombre: 'Cristián Betteley', cargo: 'Tech Lead · Plataforma y Datos',                 email: 'cristian@agrohubs.cl', whatsapp: '56987561075' },
  equipo:   { nombre: 'Equipo AgroHub',    cargo: 'Cotizaciones',                                   email: 'cotizaciones@agrohubs.cl', whatsapp: '' },
}

const whatsappVisible = n => `+${n.slice(0, 2)} ${n.slice(2, 3)} ${n.slice(3, 7)} ${n.slice(7)}`

export function firmaHtml(id = 'marcos', SITIO = 'https://www.agrohubs.cl') {
  const f = FIRMAS[id] || FIRMAS.marcos
  const wa = f.whatsapp
    ? `<div style="white-space:nowrap">📱 <a href="https://wa.me/${f.whatsapp}" style="color:#2d7325;text-decoration:none">WhatsApp ${whatsappVisible(f.whatsapp)}</a></div>`
    : ''
  return `
<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:13px;color:#374151;margin-top:18px">
  <tr>
    <td style="padding-right:14px;border-right:3px solid #2d7325;vertical-align:middle;width:150px">
      <img src="${SITIO}/logo-firma.png" width="150" height="42" alt="AgroHub · Centro Demostrativo Móvil" style="display:block;width:150px;height:42px;max-width:150px;border:0">
    </td>
    <td style="padding-left:14px;line-height:1.5;vertical-align:middle">
      <div style="font-size:15px;font-weight:bold;color:#111827">${escapar(f.nombre)}</div>
      <div style="color:#6b7280">${escapar(f.cargo)}</div>
      ${wa}
      <div style="white-space:nowrap">✉️ <a href="mailto:${f.email}" style="color:#2d7325;text-decoration:none">${f.email}</a></div>
      <div style="white-space:nowrap">🌐 <a href="${SITIO}" style="color:#2d7325;text-decoration:none">www.agrohubs.cl</a></div>
    </td>
  </tr>
</table>`
}
