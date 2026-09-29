import { listarLeads, obtenerLead, actualizarLead, storeConfigurado } from './_lib/store.js'
import { autorizar } from './_lib/auth.js'

const ESTADOS = ['nueva', 'en revisión', 'propuesta enviada', 'ganada', 'descartada']

export default async function handler(req, res) {
  if (!(await autorizar(req, res))) return
  if (!storeConfigurado()) return res.status(503).json({ ok: false, error: 'Base de datos no configurada en Vercel' })

  try {
    if (req.method === 'GET') {
      const { id } = req.query
      if (id) {
        const lead = await obtenerLead(String(id))
        return lead ? res.json({ ok: true, lead }) : res.status(404).json({ ok: false })
      }
      return res.json({ ok: true, leads: await listarLeads() })
    }

    if (req.method === 'PUT') {
      const { id, propuestaHtml, estado, notas } = req.body || {}
      if (!id) return res.status(400).json({ ok: false })
      const cambios = {}
      if (typeof propuestaHtml === 'string') cambios.propuestaHtml = propuestaHtml.slice(0, 200000)
      if (ESTADOS.includes(estado)) cambios.estado = estado
      if (typeof notas === 'string') cambios.notas = notas.slice(0, 5000)
      const lead = await actualizarLead(String(id), cambios)
      return lead ? res.json({ ok: true, lead }) : res.status(404).json({ ok: false })
    }

    res.status(405).end()
  } catch (e) {
    console.error('admin', e)
    res.status(500).json({ ok: false, error: 'Error de servidor' })
  }
}
