import { ImapFlow } from 'imapflow'
import { simpleParser } from 'mailparser'
import MailComposer from 'nodemailer/lib/mail-composer/index.js'
import { autorizar } from './_lib/auth.js'
import { transporte, remitente, imapConfig, smtpConfigurado, configCorreo, firmaHtml, escapar, FIRMAS } from './_lib/mail.js'

const LIMITE = 40

async function conImap(cfg, fn) {
  const client = new ImapFlow(imapConfig(cfg))
  await client.connect()
  try { return await fn(client) } finally { await client.logout().catch(() => {}) }
}

async function carpetaEnviados(client) {
  const carpetas = await client.list()
  return (carpetas.find(c => c.specialUse === '\\Sent') || carpetas.find(c => /sent|enviados/i.test(c.path)))?.path
}

async function listar(cfg, carpeta) {
  return conImap(cfg, async client => {
    const lock = await client.getMailboxLock(carpeta)
    try {
      const total = client.mailbox.exists
      if (!total) return []
      const mensajes = []
      for await (const m of client.fetch(`${Math.max(1, total - LIMITE + 1)}:*`, { uid: true, envelope: true, flags: true, internalDate: true })) {
        const de = m.envelope.from?.[0] || {}
        const para = m.envelope.to?.[0] || {}
        mensajes.push({
          uid: m.uid,
          asunto: m.envelope.subject || '(sin asunto)',
          de: de.name || de.address || '',
          deEmail: de.address || '',
          para: para.address || '',
          fecha: (m.envelope.date || m.internalDate)?.toISOString?.() || null,
          leido: m.flags?.has('\\Seen') || false,
        })
      }
      return mensajes.reverse()
    } finally { lock.release() }
  })
}

// Adjunto de un correo recibido, en base64 para descargarlo desde el admin
async function adjunto(cfg, carpeta, uid, indice) {
  return conImap(cfg, async client => {
    const lock = await client.getMailboxLock(carpeta)
    try {
      const m = await client.fetchOne(String(uid), { source: true }, { uid: true })
      if (!m) return null
      const a = (await simpleParser(m.source)).attachments?.[indice]
      return a ? { nombre: a.filename || `adjunto-${indice + 1}`, tipo: a.contentType, base64: a.content.toString('base64') } : null
    } finally { lock.release() }
  })
}

// Adjuntos al enviar: llegan en base64 dentro del JSON. Vercel acepta ~4,5 MB por request,
// por eso el total queda en 3 MB (el base64 pesa un tercio mas).
const MAX_ADJUNTOS = 10
const MAX_BYTES = 3 * 1024 * 1024
function leerAdjuntos(lista) {
  if (!Array.isArray(lista) || !lista.length) return []
  if (lista.length > MAX_ADJUNTOS) throw Object.assign(new Error(`Máximo ${MAX_ADJUNTOS} adjuntos`), { status: 413 })
  const out = lista.map(a => ({
    filename: String(a.nombre || 'archivo').slice(0, 200),
    contentType: String(a.tipo || 'application/octet-stream').slice(0, 100),
    content: Buffer.from(String(a.base64 || ''), 'base64'),
  }))
  if (out.reduce((t, a) => t + a.content.length, 0) > MAX_BYTES) throw Object.assign(new Error('Los adjuntos superan 3 MB en total'), { status: 413 })
  return out
}

async function leer(cfg, carpeta, uid) {
  return conImap(cfg, async client => {
    const lock = await client.getMailboxLock(carpeta)
    try {
      const m = await client.fetchOne(String(uid), { source: true }, { uid: true })
      if (!m) return null
      await client.messageFlagsAdd(String(uid), ['\\Seen'], { uid: true }).catch(() => {})
      const p = await simpleParser(m.source)
      return {
        uid,
        asunto: p.subject || '(sin asunto)',
        de: p.from?.text || '',
        deEmail: p.from?.value?.[0]?.address || '',
        para: p.to?.text || '',
        cc: p.cc?.text || '',
        fecha: p.date?.toISOString() || null,
        messageId: p.messageId || '',
        referencias: [].concat(p.references || []),
        html: p.html || '',
        texto: p.text || '',
        adjuntos: (p.attachments || []).map(a => ({ nombre: a.filename, tamano: a.size })),
      }
    } finally { lock.release() }
  })
}

async function enviar(cfg, { para, cc, asunto, cuerpo, firma, responderA, referencias, adjuntos }) {
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#1f2937;line-height:1.6">${escapar(cuerpo).replace(/\n/g, '<br>')}</div>${firma ? firmaHtml(firma) : ''}`
  const mail = {
    from: remitente(cfg),
    to: para,
    cc: cc || undefined,
    subject: asunto,
    html,
    text: cuerpo,
    ...(responderA ? { inReplyTo: responderA, references: [...(referencias || []), responderA] } : {}),
    attachments: adjuntos,
  }
  const info = await transporte(cfg).sendMail(mail)
  // Copia en "Enviados" (el SMTP no la guarda solo); si falla, el envio igual se hizo
  try {
    const raw = await new MailComposer({ ...mail, messageId: info.messageId }).compile().build()
    await conImap(cfg, async client => {
      const enviados = await carpetaEnviados(client)
      if (enviados) await client.append(enviados, raw, ['\\Seen'])
    })
  } catch (e) { console.error('copia enviados', e.message) }
  return info.messageId
}

export default async function handler(req, res) {
  if (!(await autorizar(req, res))) return
  const cfg = await configCorreo(String(req.query.casilla || req.body?.casilla || ''))
  if (!smtpConfigurado(cfg)) return res.status(503).json({ ok: false, error: 'Falta configurar una casilla en Cuentas > Casillas de correo' })

  try {
    if (req.method === 'GET') {
      const carpeta = String(req.query.carpeta || 'INBOX')
      if (req.query.carpetas) {
        const lista = await conImap(cfg, c => c.list())
        return res.json({ ok: true, carpetas: lista.map(c => ({ path: c.path, nombre: c.name, especial: c.specialUse || '' })) })
      }
      if (req.query.uid && req.query.adjunto !== undefined) {
        const a = await adjunto(cfg, carpeta, Number(req.query.uid), Number(req.query.adjunto))
        return a ? res.json({ ok: true, adjunto: a }) : res.status(404).json({ ok: false })
      }
      if (req.query.uid) {
        const mensaje = await leer(cfg, carpeta, Number(req.query.uid))
        return mensaje ? res.json({ ok: true, mensaje }) : res.status(404).json({ ok: false })
      }
      return res.json({ ok: true, mensajes: await listar(cfg, carpeta), casilla: cfg.user, casillaId: cfg.id })
    }

    if (req.method === 'POST') {
      const b = req.body || {}
      const para = String(b.para || '').trim()
      if (!para || !String(b.asunto || '').trim()) return res.status(400).json({ ok: false, error: 'Falta destinatario o asunto' })
      const adjuntos = leerAdjuntos(b.adjuntos)
      const id = await enviar(cfg, {
        adjuntos,
        para, cc: String(b.cc || '').trim(),
        asunto: String(b.asunto).slice(0, 300),
        cuerpo: String(b.cuerpo || '').slice(0, 50000),
        // Sin firma elegida se usa la de la casilla; "" = sin firma
        firma: b.firma === undefined ? cfg.firma : FIRMAS[b.firma] ? b.firma : '',
        responderA: b.responderA || '', referencias: Array.isArray(b.referencias) ? b.referencias.slice(0, 20) : [],
      })
      return res.json({ ok: true, messageId: id })
    }

    res.status(405).end()
  } catch (e) {
    if (e.status === 413) return res.status(413).json({ ok: false, error: e.message })
    console.error('correo', e)
    res.status(500).json({ ok: false, error: e.authenticationFailed ? 'La casilla rechazó el usuario o la contraseña' : `Error de correo: ${e.message}` })
  }
}
