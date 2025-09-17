import HistorialCanje from "../models/historialCanje.js";


export const crearHistorialCanje = async (req, res) => {
  try {
    const historial = new HistorialCanje(req.body);
    const historialGuardado = await historial.save();
    res.status(201).json(historialGuardado);
  } catch (error) {
    res.status(500).json({ msg: "Error al crear historial de canje", error });
  }
};


export const obtenerHistorialesCanje = async (req, res) => {
  try {
    const historiales = await HistorialCanje.find()
      .populate("usuario")
      .populate("recompensa");
    res.json(historiales);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener historiales", error });
  }
};


export const actualizarHistorialCanje = async (req, res) => {
  try {
    const historial = await HistorialCanje.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(historial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const eliminarHistorialCanje = async (req, res) => {
  try {
    await HistorialCanje.findByIdAndDelete(req.params.id);
    res.json({ message: "Historial de canje eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};