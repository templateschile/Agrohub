import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { emailSubject, emailHtml, telegramMsg } = req.body
  const errors = []

  // ── EMAIL ──────────────────────────────────────────────
  try {
    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
    await transporter.sendMail({
      from:    process.env.SMTP_FROM    || process.env.SMTP_USER,
      to:      process.env.NOTIFY_TO    || 'cotizaciones@agrohubs.cl',
      subject: emailSubject,
      html:    emailHtml,
    })
  } catch (e) {
    errors.push('email: ' + e.message)
  }

  // ── TELEGRAM ───────────────────────────────────────────
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId   = process.env.TELEGRAM_CHAT_ID
  if (botToken && chatId) {
    try {
      await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id:    chatId,
            text:       telegramMsg,
            parse_mode: 'HTML',
          }),
        }
      )
    } catch (e) {
      errors.push('telegram: ' + e.message)
    }
  }

  res.status(200).json({ ok: true, errors })
}
