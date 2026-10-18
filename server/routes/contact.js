import { Router } from 'express'
import Contact from '../models/Contact.js'

const router = Router()

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
