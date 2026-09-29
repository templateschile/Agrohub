import { randomUUID } from 'node:crypto'
import { notificar, escapar } from './_lib/notify.js'
import { guardarLead, storeConfigurado } from './_lib/store.js'

const TIPOS = {
  evaluacion: 'Nueva evaluación AgroHub',
  contacto:   'Nuevo contacto AgroHub',
  pedido:     'Nuevo pedido Tienda AgroHub',
}

const texto = (v, max = 300) => String(v ?? '').trim().slice(0, max)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const body = req.body || {}
  if (JSON.stringify(body).length > 30000) return res.status(413).json({ ok: false })
  // Honeypot: los bots llenan este campo oculto
  if (body.website) return res.status(200).json({ ok: true })

  const tipo = TIPOS[body.tipo] ? body.tipo : 'contacto'
  const c = body.contacto || {}
  const contacto = {
    nombre:   texto(c.nombre, 120),
    empresa:  texto(c.empresa, 160),
    cargo:    texto(c.cargo, 120),
    email:    texto(c.email, 160),
    telefono: texto(c.telefono, 40),
  }
  if (!contacto.nombre || !(contacto.email || contacto.telefono)) {
    return res.status(400).json({ ok: false, error: 'Faltan nombre y email o teléfono' })
  }

  const lead = {
    id:         randomUUID(),
    tipo,
    creado:     new Date().toISOString(),
    estado:     'nueva',
    contacto,
    mensaje:    texto(body.mensaje, 3000),
    resumen:    (Array.isArray(body.resumen) ? body.resumen : []).slice(0, 60).map(l => texto(l, 500)),
    respuestas: body.respuestas && typeof body.respuestas === 'object' ? body.respuestas : null,
  }

  let guardado = false
  if (storeConfigurado()) {
    try { await guardarLead(lead); guardado = true } catch (e) { console.error('store', e) }
  }

  const sitio = process.env.SITE_URL || 'https://www.agrohubs.cl'
  const linkAdmin = guardado ? `${sitio}/admin?id=${lead.id}` : ''
  const nombreEmpresa = contacto.empresa ? `${contacto.nombre} (${contacto.empresa})` : contacto.nombre

  const datos = [
    ['Nombre', contacto.nombre], ['Empresa', contacto.empresa], ['Cargo', contacto.cargo],
    ['Email', contacto.email], ['Teléfono', contacto.telefono],
  ].filter(([, v]) => v)

  const fuente = 'font-family:Arial,sans-serif;font-size:14px'
  const html = `
    <h2 style="color:#166534;font-family:Arial,sans-serif">${escapar(TIPOS[tipo])}</h2>
    <table style="${fuente}">
      ${datos.map(([k, v]) => `<tr><td style="padding:2px 12px 2px 0;color:#6b7280">${k}</td><td><b>${escapar(v)}</b></td></tr>`).join('')}
    </table>
    ${lead.mensaje ? `<p style="${fuente};white-space:pre-wrap"><b>Mensaje:</b><br>${escapar(lead.mensaje)}</p>` : ''}
    ${lead.resumen.length ? `<ul style="${fuente}">${lead.resumen.map(l => `<li>${escapar(l)}</li>`).join('')}</ul>` : ''}
    ${linkAdmin ? `<p style="font-family:Arial,sans-serif"><a href="${linkAdmin}" style="background:#2d7325;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Abrir en el admin y editar propuesta</a></p>` : ''}
  `
  const tg = [
    `📩 ${TIPOS[tipo]}`,
    ...datos.map(([k, v]) => `${k}: ${v}`),
    lead.mensaje ? `\nMensaje: ${lead.mensaje}` : '',
    lead.resumen.length ? '\n' + lead.resumen.map(l => `• ${l}`).join('\n') : '',
    linkAdmin ? `\nAdmin: ${linkAdmin}` : '',
  ].filter(Boolean).join('\n')

  const { errors } = await notificar({ asunto: `${TIPOS[tipo]} — ${nombreEmpresa}`, html, texto: tg })
  if (errors.length) console.error('notify', errors)

  res.status(200).json({ ok: true, guardado })
}
