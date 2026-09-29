import nodemailer from 'nodemailer'
import { ImapFlow } from 'imapflow'
import { autorizar } from './_lib/auth.js'
import { storeConfigurado } from './_lib/store.js'
import { cifradoConfigurado } from './_lib/cifrado.js'
import { CORREO_POR_DEFECTO, leerConfigGuardada, guardarConfig, configCorreo, imapConfig } from './_lib/mail.js'

const limpio = b => ({
  host:     String(b.host || CORREO_POR_DEFECTO.host).trim(),
  port:     Number(b.port) || CORREO_POR_DEFECTO.port,
  imapPort: Number(b.imapPort) || CORREO_POR_DEFECTO.imapPort,
  user:     String(b.user || '').trim(),
  from:     String(b.from || '').trim(),
})

async function probar(cfg) {
  const r = {}
  try {
    await nodemailer.createTransport({ host: cfg.host, port: cfg.port, secure: cfg.port === 465, auth: { user: cfg.user, pass: cfg.pass } }).verify()
    r.smtp = 'ok'
  } catch (e) { r.smtp = e.message }
  try {
    const c = new ImapFlow(imapConfig(cfg))
    await c.connect(); await c.logout()
    r.imap = 'ok'
  } catch (e) { r.imap = e.authenticationFailed ? 'Usuario o contraseña incorrectos' : e.message }
  return r
}

// Configuracion de la casilla que usa el sitio (avisos, agradecimientos y pestana Correo).
// La contraseña nunca se devuelve al navegador.
export default async function handler(req, res) {
  if (!(await autorizar(req, res))) return
  if (!storeConfigurado() || !cifradoConfigurado()) return res.status(503).json({ ok: false, error: 'Falta la base de datos o VAULT_KEY en Vercel' })

  try {
    if (req.method === 'GET') {
      const g = await leerConfigGuardada()
      const activa = await configCorreo()
      const { pass, ...sinClave } = g || { ...CORREO_POR_DEFECTO, pass: '' }
      return res.json({ ok: true, config: sinClave, tieneClave: Boolean(g?.pass), origen: activa.origen })
    }

    const b = req.body || {}
    const anterior = await leerConfigGuardada()
    const cfg = { ...limpio(b), pass: b.pass ? String(b.pass) : anterior?.pass || '' }
    if (!cfg.from) cfg.from = `AgroHub <${cfg.user}>`

    if (req.method === 'POST') {
      if (!cfg.user || !cfg.pass) return res.status(400).json({ ok: false, error: 'Falta usuario o contraseña' })
      return res.json({ ok: true, prueba: await probar(cfg) })
    }

    if (req.method === 'PUT') {
      if (!cfg.user) return res.status(400).json({ ok: false, error: 'Falta el usuario (email)' })
      await guardarConfig(cfg)
      const { pass, ...sinClave } = cfg
      return res.json({ ok: true, config: sinClave, tieneClave: Boolean(pass) })
    }

    res.status(405).end()
  } catch (e) {
    console.error('config', e)
    res.status(500).json({ ok: false, error: 'Error de servidor' })
  }
}
