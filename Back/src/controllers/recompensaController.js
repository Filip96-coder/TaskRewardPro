import Recompensa from "../models/recompensa.js";

export const crearRecompensa = async (req, res) => {
  try {
    const recompensa = new Recompensa(req.body);
    const recompensaGuardada = await recompensa.save();
    res.status(201).json(recompensaGuardada);
  } catch (error) {
    res.status(500).json({ msg: "Error al crear recompensa", error });
  }
};


export const obtenerRecompensas = async (req, res) => {
  try {
    const recompensas = await Recompensa.find();
    res.json(recompensas);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener recompensas", error });
  }
};


export const actualizarRecompensa = async (req, res) => {
  try {
    const { id } = req.params;
    const recompensa = await Recompensa.findByIdAndUpdate(id, req.body, { new: true, runValidators: true, });
    if (!recompensa) {
      return res.status(404).json({ msg: "Recompensa no encontrada" });
    }
    
    res.json(recompensa);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const eliminarRecompensa = async (req, res) => {
  try {

    const {id} = req.params;
   
    const recompensa = await Recompensa.findByIdAndDelete(id);

    if (!recompensa) {
      return res.status(404).json({ msg: "Recompensa no encontrada" });
    }
    
    res.json({ message: "Recompensa eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};