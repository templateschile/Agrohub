import { randomUUID } from 'node:crypto'
import nodemailer from 'nodemailer'
import { ImapFlow } from 'imapflow'
import { autorizar } from './_lib/auth.js'
import { storeConfigurado } from './_lib/store.js'
import { cifradoConfigurado } from './_lib/cifrado.js'
import { SERVIDOR_POR_DEFECTO, FIRMAS, leerCasillas, guardarCasillas, configCorreo, imapConfig, claveCompartida, CASILLA_CLAVE_COMPARTIDA } from './_lib/mail.js'
import { redis } from './_lib/store.js'

const sinClave = compartida => ({ pass, ...c }) => ({ ...c, tieneClave: Boolean(pass), usaCompartida: !pass && Boolean(compartida) })

// Casillas del equipo que se crean una sola vez, sin clave propia (usan la compartida)
const SEMILLA = [
  { user: 'marcos@agrohubs.cl',       from: 'Marcos Contreras · AgroHubs <marcos@agrohubs.cl>', firma: 'marcos' },
  { user: 'cotizaciones@agrohubs.cl', from: 'AgroHubs Cotizaciones <cotizaciones@agrohubs.cl>', firma: 'equipo' },
]
async function sembrar(datos) {
  if (!datos.casillas.length) return false
  if (await redis(['SET', 'config:casillas:semilla:v1', '1', 'NX']) !== 'OK') return false
  for (const s of SEMILLA) {
    if (!datos.casillas.some(c => c.user === s.user)) datos.casillas.push({ id: randomUUID(), ...SERVIDOR_POR_DEFECTO, ...s, pass: '' })
  }
  return true
}

function limpia(b, anterior) {
  const user = String(b.user || '').trim().toLowerCase()
  return {
    id:       anterior?.id || randomUUID(),
    host:     String(b.host || SERVIDOR_POR_DEFECTO.host).trim(),
    port:     Number(b.port) || SERVIDOR_POR_DEFECTO.port,
    imapPort: Number(b.imapPort) || SERVIDOR_POR_DEFECTO.imapPort,
    user,
    from:     String(b.from || '').trim() || `AgroHubs <${user}>`,
    firma:    FIRMAS[b.firma] ? b.firma : '',
    // Sin clave nueva se conserva la guardada
    pass:     b.pass ? String(b.pass) : anterior?.pass || '',
  }
}

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

// Casillas de correo del equipo (enviar/recibir desde el admin, avisos y agradecimientos).
// Las contraseñas nunca se devuelven al navegador.
export default async function handler(req, res) {
  if (!(await autorizar(req, res))) return
  if (!storeConfigurado() || !cifradoConfigurado()) return res.status(503).json({ ok: false, error: 'Falta la base de datos o VAULT_KEY en Vercel' })

  try {
    const datos = await leerCasillas()
    const responder = async () => {
      const activa = await configCorreo()
      const compartida = claveCompartida(datos)
      res.json({ ok: true, casillas: datos.casillas.map(sinClave(compartida)), principal: datos.principal, origen: activa.origen, servidor: SERVIDOR_POR_DEFECTO, claveCompartidaDe: compartida ? CASILLA_CLAVE_COMPARTIDA : '' })
    }

    if (req.method === 'GET') {
      if (await sembrar(datos)) await guardarCasillas(datos)
      return responder()
    }

    const b = req.body || {}

    // Probar credenciales sin enviar correos (con la clave escrita o la guardada)
    if (req.method === 'POST') {
      const cfg = limpia(b, datos.casillas.find(c => c.id === b.id))
      if (!cfg.pass) cfg.pass = claveCompartida(datos)
      if (!cfg.user || !cfg.pass) return res.status(400).json({ ok: false, error: 'Falta usuario o contraseña' })
      return res.json({ ok: true, prueba: await probar(cfg) })
    }

    if (req.method === 'PUT') {
      if (b.principal) {
        if (!datos.casillas.some(c => c.id === b.principal)) return res.status(404).json({ ok: false })
        datos.principal = b.principal
      } else {
        const anterior = datos.casillas.find(c => c.id === b.id)
        const cfg = limpia(b, anterior)
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cfg.user)) return res.status(400).json({ ok: false, error: 'La casilla debe ser un email' })
        if (!anterior && datos.casillas.some(c => c.user === cfg.user)) return res.status(409).json({ ok: false, error: 'Esa casilla ya está agregada' })
        datos.casillas = anterior ? datos.casillas.map(c => c.id === cfg.id ? cfg : c) : [...datos.casillas, cfg]
        if (!datos.principal) datos.principal = cfg.id
      }
      await guardarCasillas(datos)
      return responder()
    }

    if (req.method === 'DELETE') {
      const id = String(req.query.id || '')
      datos.casillas = datos.casillas.filter(c => c.id !== id)
      if (datos.principal === id) datos.principal = datos.casillas[0]?.id || ''
      await guardarCasillas(datos)
      return responder()
    }

    res.status(405).end()
  } catch (e) {
    console.error('config', e)
    res.status(500).json({ ok: false, error: 'Error de servidor' })
  }
}
