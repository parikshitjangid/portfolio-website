import { Router } from 'express'
import Contact from '../models/Contact.js'

const router = Router()

async function sendContactNotification({ name, email, message }) {
  const {
    GMAIL_USER,
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    GMAIL_REFRESH_TOKEN,
    CONTACT_NOTIFICATION_EMAIL,
  } = process.env

  if (!GMAIL_USER || !GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
    console.warn('Contact notification email skipped: Gmail API environment variables are not fully configured.')
    return false
  }

  const recipient = CONTACT_NOTIFICATION_EMAIL || GMAIL_USER

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GMAIL_CLIENT_ID,
      client_secret: GMAIL_CLIENT_SECRET,
      refresh_token: GMAIL_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
    signal: AbortSignal.timeout(10000),
  })

  const tokenData = await tokenResponse.json()

  if (!tokenResponse.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || tokenData.error || 'Google OAuth token request failed.')
  }

  const subject = Buffer.from(`New portfolio message from ${name}`, 'utf8').toString('base64')
  const body = [
    'You received a new message through your portfolio contact form.',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    'Message:',
    message,
  ].join('\n')

  const mimeMessage = [
    `From: Portfolio Contact Form <${GMAIL_USER}>`,
    `To: ${recipient}`,
    `Reply-To: ${name.replace(/[\r\n]+/g, ' ')} <${email}>`,
    `Subject: =?UTF-8?B?${subject}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    body,
  ].join('\r\n')

  const raw = Buffer.from(mimeMessage, 'utf8').toString('base64url')

  const mailResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
    signal: AbortSignal.timeout(10000),
  })

  if (!mailResponse.ok) {
    const errorData = await mailResponse.json().catch(() => ({}))
    throw new Error(errorData.error?.message || 'Gmail API send request failed.')
  }

  return true
}

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body ?? {}

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof message !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a name, email, and message.',
      })
    }

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()
    const cleanMessage = message.trim()

    if (
      !cleanName ||
      cleanName.length > 100 ||
      !cleanEmail ||
      cleanEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ||
      !cleanMessage ||
      cleanMessage.length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please check your form fields and try again.',
      })
    }

    await Contact.create({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
    })

    try {
      await sendContactNotification({
        name: cleanName,
        email: cleanEmail,
        message: cleanMessage,
      })
    } catch (emailError) {
      console.error('Contact notification email failed:', emailError.message)
    }

    return res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully.',
    })
  } catch (error) {
    console.error('Contact submission failed:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to send your message right now. Please try again later.',
    })
  }
})

export default router
