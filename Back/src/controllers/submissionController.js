import Submission from "../models/submission.js"
import Tarea from "../models/tarea.js"
import Usuario from "../models/usuario.js"

export const submitTask = async (req, res) => {
  try {
    const taskId = req.params.id
    if (!req.file) return res.status(400).json({ message: "Archivo requerido" })

    // crear registro de entrega
    const sub = await Submission.create({
      task: taskId,
      user: req.user.id,
      filePath: `/uploads/submissions/${req.file.filename}`,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size
    })

    res.status(201).json(sub)
  } catch (e) {
    console.error("❌ submitTask:", e)
    res.status(500).json({ message: "Error subiendo entrega" })
  }
}

export const listSubmissionsForTask = async (req, res) => {
  try {
    const taskId = req.params.id
    const list = await Submission.find({ task: taskId })
      .populate("user", "name email rol")
      .sort({ createdAt: -1 })
    res.json(list)
  } catch (e) {
    res.status(500).json({ message: "Error listando entregas" })
  }
}

export const mySubmissionForTask = async (req, res) => {
  try {
    const taskId = req.params.id
    const s = await Submission.findOne({ task: taskId, user: req.user.id })
    res.json(s || null)
  } catch (e) {
    res.status(500).json({ message: "Error consultando mi entrega" })
  }
}

// aprobar o rechazar
export const decideSubmission = async (req, res) => {
  try {
    const { taskId, subId } = req.params
    const { action, feedback } = req.body // action: "approve" | "reject"
    const sub = await Submission.findOne({ _id: subId, task: taskId })
    if (!sub) return res.status(404).json({ message: "Entrega no encontrada" })

    if (action === "approve") {
      // marcar aprobada
      sub.status = "Aprobada"
      if (feedback) sub.feedback = feedback
      await sub.save()

      // sumar puntos al usuario sólo si NO estaba ya aprobada
      const tarea = await Tarea.findById(taskId)
      if (tarea && tarea.points && sub.status === "Aprobada") {
        const u = await Usuario.findById(sub.user)
        // (opcional) evitar dobles sumas si ya había una aprobada:
        const alreadyApproved = await Submission.findOne({
          task: taskId, user: sub.user, _id: { $ne: subId }, status: "Aprobada"
        })
        if (!alreadyApproved) {
          u.points = (u.points || 0) + (tarea.points || 0)
          await u.save()
        }
      }
    } else if (action === "reject") {
      sub.status = "Rechazada"
      if (feedback) sub.feedback = feedback
      await sub.save()
    } else {
      return res.status(400).json({ message: "Acción inválida" })
    }

    res.json(sub)
  } catch (e) {
    console.error("❌ decideSubmission:", e)
    res.status(500).json({ message: "Error procesando decisión" })
  }
}
