import Meta from "../models/meta.js";


export const crearMeta = async (req, res) => {
  try {
    const meta = new Meta(req.body);
    const metaGuardada = await meta.save();
    res.status(201).json(metaGuardada);
  } catch (error) {
    res.status(500).json({ msg: "Error al crear meta", error });
  }
};


export const obtenerMetas = async (req, res) => {
  try {
    const metas = await Meta.find().populate("tareas");
    res.json(metas);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener metas", error });
  }
};

export const actualizarMeta = async (req, res) => {
  try {
    const meta = await Meta.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(meta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const eliminarMeta = async (req, res) => {
  try {
    await Meta.findByIdAndDelete(req.params.id);
    res.json({ message: "Meta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};