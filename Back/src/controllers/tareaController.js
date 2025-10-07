import Tarea from "../models/tarea.js";


export const crearTarea = async (req, res) => {
  try {
    const nuevaTarea = new Tarea({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      points: req.body.points,
      attachments: req.body.attachments || [],
      createdBy: req.user?.id || null
    });
    const tareaGuardada = await nuevaTarea.save();
    res.status(201).json(tareaGuardada);
  } catch (error) {
    console.error("❌ Error al crear tarea:", error);
    res.status(500).json({ msg: "Error al crear tarea", error: error.message });
  }
};

export const obtenerTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find().sort({ createdAt: -1 });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener tareas", error: error.message });
  }
};


export const actualizarTarea = async (req, res) => {
  try {
    const tareaActualizada = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tareaActualizada) return res.status(404).json({ msg: "Tarea no encontrada" })
    res.json(tareaActualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const eliminarTarea = async (req, res) => {
  try {
    const tareaEliminada= await Tarea.findByIdAndDelete(req.params.id);
    if (!tareaEliminada) return res.status(404).json({ msg: "Tarea no encontrada" })
    res.json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};