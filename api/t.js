// Links de seguimiento de los correos enviados desde el admin antiguo (www.agrohubs.cl/api/t?i=&u=&s=).
// El admin y el seguimiento ahora viven en la plataforma AgroHubs: se reenvía la misma consulta
// (pixel de apertura o clic firmado) al API, que valida la firma, registra el evento y redirige.
const API = (process.env.AGROHUBS_API_URL || 'https://api.agrohubs.cl').replace(/\/+$/, '')

export default function handler(req, res) {
  const i = (req.url || '').indexOf('?')
  const qs = i >= 0 ? req.url.slice(i) : ''
  res.setHeader('Cache-Control', 'no-store')
  res.redirect(302, `${API}/api/v1/site/t${qs}`)
}
