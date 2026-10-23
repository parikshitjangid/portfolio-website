import { Router } from 'express'
import nodemailer from 'nodemailer'
import Contact from '../models/Contact.js'

const router = Router()

function createMailer() {
  const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    return null
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD.replace(/\s/g, ''),
    },
  })
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

    const mailer = createMailer()
    const recipient = process.env.CONTACT_NOTIFICATION_EMAIL || process.env.GMAIL_USER

    if (mailer && recipient) {
      try {
        await mailer.sendMail({
          from: {
            name: 'Portfolio Contact Form',
            address: process.env.GMAIL_USER,
          },
          to: recipient,
          replyTo: {
            name: cleanName,
            address: cleanEmail,
          },
          subject: `New portfolio message from ${cleanName}`,
          text: `You received a new message through your portfolio contact form.\n\nName: ${cleanName}\nEmail: ${cleanEmail}\n\nMessage:\n${cleanMessage}\n`,
        })
      } catch (emailError) {
        console.error('Contact notification email failed:', emailError.message)
      }
    } else {
      console.warn('Contact notification email skipped: Gmail environment variables are not configured.')
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
