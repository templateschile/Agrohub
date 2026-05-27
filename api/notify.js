import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { emailSubject, emailHtml, telegramMsg } = req.body
  const errors = []
  const results = {}

  // ── EMAIL ──────────────────────────────────────────────
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS

  if (!smtpUser || !smtpPass) {
    errors.push('email: faltan variables SMTP_USER / SMTP_PASS')
  } else {
    try {
      const transporter = nodemailer.createTransport({
        host:   process.env.SMTP_HOST || 'smtp.gmail.com',
        port:   Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: { user: smtpUser, pass: smtpPass },
      })
      await transporter.sendMail({
        from:    process.env.SMTP_FROM || smtpUser,
        to:      process.env.NOTIFY_TO || smtpUser,
        subject: emailSubject,
        html:    emailHtml,
      })
      results.email = 'ok'
    } catch (e) {
      errors.push('email: ' + e.message)
    }
  }

  // ── TELEGRAM ───────────────────────────────────────────
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId   = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    errors.push('telegram: faltan variables TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID')
  } else {
    try {
      // Sin parse_mode para evitar errores por HTML invalido
      const tgRes = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text:    telegramMsg,
          }),
        }
      )
      const tgJson = await tgRes.json()
      if (tgJson.ok) {
        results.telegram = 'ok'
      } else {
        errors.push('telegram: ' + tgJson.description)
      }
    } catch (e) {
      errors.push('telegram: ' + e.message)
    }
  }

  res.status(200).json({ ok: errors.length === 0, results, errors })
}
