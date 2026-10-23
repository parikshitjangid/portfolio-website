import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import contactRouter from './routes/contact.js'
import cvRouter from './routes/cv.js'

const app = express()
const port = process.env.PORT || 5000
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim().replace(/\/$/, ''))
  .filter(Boolean)

const productionOrigin = 'https://portfolio-website-murex-beta-82.vercel.app'

app.use(cors({
  origin(origin, callback) {
    const normalizedOrigin = origin?.replace(/\/$/, '')
    const isConfiguredOrigin = !origin || allowedOrigins.includes(normalizedOrigin)
    const isProductionOrigin = normalizedOrigin === productionOrigin
    const isVercelPreview = /^https:\/\/portfolio-website-[a-z0-9-]+-keyzorkinza-gmailcoms-projects\.vercel\.app$/.test(normalizedOrigin || '')

    callback(null, isConfiguredOrigin || isProductionOrigin || isVercelPreview)
  },
}))
app.use(express.json({ limit: '10kb' }))

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running.' })
})

app.use('/api/contact', contactRouter)
app.use('/api/cv', cvRouter)

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing from server/.env')
  }

  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start server:', error.message)
  process.exit(1)
})
