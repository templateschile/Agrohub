import { randomUUID } from 'node:crypto'
import { autorizar } from './_lib/auth.js'
import { storeConfigurado, listarBoveda, guardarBoveda, borrarBoveda } from './_lib/store.js'
import { cifrar, descifrar, cifradoConfigurado } from './_lib/cifrado.js'

const texto = (v, max) => String(v ?? '').slice(0, max)

// Cuentas del equipo (servicio, usuario, clave y notas), cifradas en reposo.
export default async function handler(req, res) {
  if (!(await autorizar(req, res))) return
  if (!storeConfigurado()) return res.status(503).json({ ok: false, error: 'Base de datos no configurada en Vercel' })
  if (!cifradoConfigurado()) return res.status(503).json({ ok: false, error: 'Falta VAULT_KEY en Vercel' })

  try {
    if (req.method === 'GET') {
      const cuentas = (await listarBoveda()).map(({ id, paquete }) => {
        try { return { id, ...JSON.parse(descifrar(paquete)) } } catch { return { id, servicio: '(no se pudo descifrar)' } }
      })
      cuentas.sort((a, b) => String(a.servicio).localeCompare(String(b.servicio), 'es'))
      return res.json({ ok: true, cuentas })
    }

    if (req.method === 'POST') {
      const b = req.body || {}
      if (!String(b.servicio || '').trim()) return res.status(400).json({ ok: false, error: 'Falta el nombre del servicio' })
      const id = b.id && /^[\w-]{8,64}$/.test(b.id) ? b.id : randomUUID()
      const cuenta = {
        servicio: texto(b.servicio, 120).trim(),
        url:      texto(b.url, 300).trim(),
        usuario:  texto(b.usuario, 200),
        clave:    texto(b.clave, 500),
        notas:    texto(b.notas, 5000),
        actualizado: new Date().toISOString(),
      }
      await guardarBoveda(id, cifrar(JSON.stringify(cuenta)))
      return res.json({ ok: true, cuenta: { id, ...cuenta } })
    }

    if (req.method === 'DELETE') {
      const id = String(req.query.id || '')
      if (!id) return res.status(400).json({ ok: false })
      await borrarBoveda(id)
      return res.json({ ok: true })
    }

    res.status(405).end()
  } catch (e) {
    console.error('boveda', e)
    res.status(500).json({ ok: false, error: 'Error de servidor' })
  }
}
