import Submission from "../models/submission.js"
import Tarea from "../models/tarea.js"
import Usuario from "../models/usuario.js"

export const submitTask = async (req, res) => {
  try {
    const taskId = req.params.id
    const userId = req.user.id

    if (!req.file) return res.status(400).json({ message: "Archivo requerido" })

    // eliminar entregas anteriores del mismo usuario para esa tarea
    await Submission.deleteMany({ task: taskId, user: userId })

    // crear nueva entrega
    const sub = await Submission.create({
      task: taskId,
      user: userId,
      filePath: `/uploads/submissions/${req.file.filename}`,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      status: "Pendiente",
      claimed: false
    })

    // asegurar que la tarea vuelva a "Pendiente"
    await Tarea.findByIdAndUpdate(taskId, { status: "Pendiente" })

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
    const sub = await Submission.findOne({ task: taskId, user: req.user.id })
    res.json(sub || null)
  } catch (e) {
    res.status(500).json({ message: "Error consultando mi entrega" })
  }
}


export const decideSubmission = async (req, res) => {
  try {
    const { taskId, subId } = req.params
    const { action, feedback } = req.body  

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Acción inválida" })
    }

    const sub = await Submission.findOne({ _id: subId, task: taskId })
    if (!sub) return res.status(404).json({ message: "Entrega no encontrada" })

    // actualizar estado de la entrega
    sub.status = action === "approve" ? "Aprobada" : "Rechazada"
    if (feedback) sub.feedback = feedback
    await sub.save()

    // actualizar estado de la tarea según la acción
    const tarea = await Tarea.findById(taskId)
    if (tarea) {
      tarea.status = action === "approve" ? "Completada" : "Pendiente"
      await tarea.save()
    }

    res.json({ ok: true, submission: sub })
  } catch (e) {
    console.error("❌ decideSubmission:", e)
    res.status(500).json({ message: "Error procesando decisión" })
  }
}





export const claimPoints = async (req, res) => {
  try {
    const { taskId } = req.params
    const userId = req.user.id

    const sub = await Submission.findOne({ task: taskId, user: userId, status: "Aprobada" })
    if (!sub) {
      return res.status(400).json({ message: "No tienes entregas aprobadas para reclamar." })
    }

    if (sub.claimed) {
      return res.status(400).json({ message: "Ya reclamaste tus puntos por esta tarea." })
    }

    const tarea = await Tarea.findById(taskId)
    if (!tarea) return res.status(404).json({ message: "Tarea no encontrada." })

    const usuario = await Usuario.findById(userId)
    usuario.points = (usuario.points || 0) + (tarea.points || 0)
    await usuario.save()

    sub.claimed = true
    await sub.save()

    res.json({ ok: true, claimed: true, message: "Puntos reclamados exitosamente." })
  } catch (e) {
    console.error("❌ claimPoints:", e)
    res.status(500).json({ message: "Error al reclamar puntos." })
  }
}




