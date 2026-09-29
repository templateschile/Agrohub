import { transporte, remitente, smtpConfigurado, configCorreo } from './mail.js'
export { escapar } from './mail.js'

const lista = v => (v || '').split(',').map(s => s.trim()).filter(Boolean)

// Destinatarios por variables de entorno (el repo es publico):
//   NOTIFY_TO         correos que reciben el aviso (separados por coma)
//   NOTIFY_BCC        copia oculta (separados por coma)
//   TELEGRAM_CHAT_ID  uno o varios chat IDs (separados por coma)
export async function notificar({ asunto, html, texto }) {
  const errors = []
  const results = {}

  const cfg = await configCorreo()
  if (!smtpConfigurado(cfg)) {
    errors.push('email: falta configurar la casilla (admin > Cuentas > Correo del sitio)')
  } else {
    try {
      const to = lista(process.env.NOTIFY_TO)
      await transporte(cfg).sendMail({
        from:    remitente(cfg),
        to:      to.length ? to : cfg.user,
        bcc:     lista(process.env.NOTIFY_BCC),
        subject: asunto,
        html,
      })
      results.email = 'ok'
    } catch (e) {
      errors.push('email: ' + e.message)
    }
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatIds  = lista(process.env.TELEGRAM_CHAT_ID)
  if (!botToken || !chatIds.length) {
    errors.push('telegram: faltan variables TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID')
  } else {
    for (const chatId of chatIds) {
      try {
        // Sin parse_mode para evitar errores por HTML invalido
        const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: texto.slice(0, 4000) }),
        })
        const tgJson = await tgRes.json()
        if (tgJson.ok) results[`telegram:${chatId}`] = 'ok'
        else errors.push(`telegram ${chatId}: ${tgJson.description}`)
      } catch (e) {
        errors.push(`telegram ${chatId}: ${e.message}`)
      }
    }
  }

  return { results, errors }
}
