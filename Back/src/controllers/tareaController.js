import Tarea from "../models/tarea.js";


export const crearTarea = async (req, res) => {
  try {
    const tarea = new Tarea(req.body);
    const tareaGuardada = await tarea.save();
    res.status(201).json(tareaGuardada);
  } catch (error) {
    res.status(500).json({ msg: "Error al crear tarea", error });
  }
};


export const obtenerTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find();
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener tareas", error });
  }
};


export const actualizarTarea = async (req, res) => {
  try {
    const tarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(tarea);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const eliminarTarea = async (req, res) => {
  try {
    await Tarea.findByIdAndDelete(req.params.id);
    res.json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};