import { ImapFlow } from 'imapflow'
import { simpleParser } from 'mailparser'
import MailComposer from 'nodemailer/lib/mail-composer/index.js'
import { autorizar } from './_lib/auth.js'
import { transporte, remitente, imapConfig, smtpConfigurado, configCorreo, firmaHtml, escapar } from './_lib/mail.js'

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

async function enviar(cfg, { para, cc, asunto, cuerpo, firma, responderA, referencias }) {
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#1f2937;line-height:1.6">${escapar(cuerpo).replace(/\n/g, '<br>')}</div>${firma ? firmaHtml(firma) : ''}`
  const mail = {
    from: remitente(cfg),
    to: para,
    cc: cc || undefined,
    subject: asunto,
    html,
    text: cuerpo,
    ...(responderA ? { inReplyTo: responderA, references: [...(referencias || []), responderA] } : {}),
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
  const cfg = await configCorreo()
  if (!smtpConfigurado(cfg)) return res.status(503).json({ ok: false, error: 'Falta configurar la casilla en Cuentas > Correo del sitio' })

  try {
    if (req.method === 'GET') {
      const carpeta = String(req.query.carpeta || 'INBOX')
      if (req.query.carpetas) {
        const lista = await conImap(cfg, c => c.list())
        return res.json({ ok: true, carpetas: lista.map(c => ({ path: c.path, nombre: c.name, especial: c.specialUse || '' })) })
      }
      if (req.query.uid) {
        const mensaje = await leer(cfg, carpeta, Number(req.query.uid))
        return mensaje ? res.json({ ok: true, mensaje }) : res.status(404).json({ ok: false })
      }
      return res.json({ ok: true, mensajes: await listar(cfg, carpeta), casilla: cfg.user })
    }

    if (req.method === 'POST') {
      const b = req.body || {}
      const para = String(b.para || '').trim()
      if (!para || !String(b.asunto || '').trim()) return res.status(400).json({ ok: false, error: 'Falta destinatario o asunto' })
      const id = await enviar(cfg, {
        para, cc: String(b.cc || '').trim(),
        asunto: String(b.asunto).slice(0, 300),
        cuerpo: String(b.cuerpo || '').slice(0, 50000),
        firma: ['marcos', 'cristian'].includes(b.firma) ? b.firma : '',
        responderA: b.responderA || '', referencias: Array.isArray(b.referencias) ? b.referencias.slice(0, 20) : [],
      })
      return res.json({ ok: true, messageId: id })
    }

    res.status(405).end()
  } catch (e) {
    console.error('correo', e)
    res.status(500).json({ ok: false, error: e.authenticationFailed ? 'La casilla rechazó el usuario o la contraseña' : `Error de correo: ${e.message}` })
  }
}
