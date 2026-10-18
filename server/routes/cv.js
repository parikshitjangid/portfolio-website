import { Router } from 'express'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const router = Router()
const filesDir = fileURLToPath(new URL('../files/', import.meta.url))

const files = {
  pdf: {
    path: path.join(filesDir, 'cv.pdf'),
    name: 'Parikshit-Jangid-CV.pdf',
    type: 'application/pdf',
  },
  docx: {
    path: path.join(filesDir, 'cv.docx'),
    name: 'Parikshit-Jangid-CV.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
}

router.get('/:format', (req, res) => {
  const file = files[req.params.format]

  if (!file) {
    return res.status(404).json({
      success: false,
      message: 'CV format not found.',
    })
  }

  if (!fs.existsSync(file.path)) {
    return res.status(404).json({
      success: false,
      message: 'CV file is not available.',
    })
  }

  res.download(file.path, file.name, (error) => {
    if (error && !res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Unable to download the CV.',
      })
    }
  })
})

export default router
