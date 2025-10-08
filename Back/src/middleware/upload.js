import multer from "multer"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// carpeta donde quedarán las evidencias
const uploadDir = path.resolve(__dirname, "../../uploads/submissions")
fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const time = Date.now()
    const safe = file.originalname.replace(/\s+/g, "_")
    cb(null, `${time}__${safe}`)
  }
})

function fileFilter(_req, file, cb) {
  const allowed = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "text/plain"
  ]
  if (allowed.includes(file.mimetype)) cb(null, true)
  else cb(new Error("Tipo de archivo no permitido"), false)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
})
