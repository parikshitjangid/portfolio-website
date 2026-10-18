import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import contactRouter from './routes/contact.js'
import cvRouter from './routes/cv.js'

const app = express()
const port = process.env.PORT || 5000

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
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
