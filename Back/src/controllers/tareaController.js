import Tarea from "../models/tarea.js";
import Submission from "../models/submission.js"

export const crearTarea = async (req, res) => {
  try {
    const nuevaTarea = new Tarea({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      points: req.body.points,
      attachments: req.body.attachments || [],
      createdBy: req.user?.id || null,
      status: "Pendiente" 
    });
    const tareaGuardada = await nuevaTarea.save();
    res.status(201).json(tareaGuardada);
  } catch (error) {
    console.error("Error al crear tarea:", error);
    res.status(500).json({ msg: "Error al crear tarea", error: error.message });
  }
};
export const obtenerTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find(); 
    res.json(tareas);
  } catch (e) {
    res.status(500).json({ msg: "Error al obtener tareas" });
  }
}

export const obtenerTareasUsuario = async (req, res) => {
  try {
    const userId = req.user.id


    const tareas = await Tarea.find().sort({ createdAt: -1 })


    const submissions = await Submission.find({ user: userId })


    const tareasConEntrega = tareas.map((t) => {
      const sub = submissions.find((s) => s.task.toString() === t._id.toString())
      return {
        ...t._doc,
        mySubmission: sub
          ? {
            status: sub.status,
            claimed: sub.claimed,
          }
          : null,
      }
    })

    res.json(tareasConEntrega)
  } catch (e) {
    console.error("obtenerTareasUsuario:", e)
    res.status(500).json({ message: "Error al obtener tareas del usuario" })
  }
}



export const actualizarTarea = async (req, res) => {
  try {
    const tareaActualizada = await Tarea.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!tareaActualizada) return res.status(404).json({ msg: "Tarea no encontrada" })
    res.json(tareaActualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const eliminarTarea = async (req, res) => {
  try {
    const tareaEliminada = await Tarea.findByIdAndDelete(req.params.id);
    if (!tareaEliminada) return res.status(404).json({ msg: "Tarea no encontrada" })
    res.json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

