import { storeConfigurado } from './_lib/store.js'
import { registrar, firmaValida } from './_lib/seguimiento.js'
import { enviarTelegram } from './_lib/notify.js'

// GIF transparente de 1x1
const PIXEL = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64')

const cliente = req => ({
  ua: String(req.headers['user-agent'] || '').slice(0, 200),
  ip: String(req.headers['x-forwarded-for'] || '').split(',')[0].trim(),
})

// Publico (lo llaman los programas de correo): /api/t?i=ID registra apertura y devuelve el pixel;
// /api/t?i=ID&u=URL&s=FIRMA registra el clic y redirige a URL si la firma es valida.
export default async function handler(req, res) {
  const id = String(req.query.i || '').slice(0, 40)
  const url = req.query.u ? String(req.query.u) : ''

  if (url) {
    if (!/^https?:\/\//i.test(url) || !firmaValida(id, url, req.query.s)) return res.status(400).end('Link no válido')
    if (storeConfigurado()) await registrar(id, 'clic', { url, ...cliente(req) }).catch(() => {})
    res.setHeader('Cache-Control', 'no-store')
    return res.redirect(302, url)
  }

  if (id && storeConfigurado()) {
    try {
      const { s, primera } = await registrar(id, 'apertura', cliente(req))
      if (s && primera) {
        await enviarTelegram(`📬 Abrieron tu correo\n${s.para}\nAsunto: ${s.asunto}\nDesde: ${s.desde}`).catch(() => {})
      }
    } catch (e) { console.error('seguimiento', e.message) }
  }
  res.setHeader('Content-Type', 'image/gif')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  res.status(200).end(PIXEL)
}
