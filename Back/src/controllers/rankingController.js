import Ranking from "../models/ranking.js";


export const crearRanking = async (req, res) => {
  try {
    const ranking = new Ranking(req.body);
    const rankingGuardado = await ranking.save();
    res.status(201).json(rankingGuardado);
  } catch (error) {
    res.status(500).json({ msg: "Error al crear ranking", error });
  }
};


export const obtenerRankings = async (req, res) => {
  try {
    const rankings = await Ranking.find().populate("usuarios");
    res.json(rankings);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener rankings", error });
  }
};


export const actualizarRanking = async (req, res) => {
  try {
    const ranking = await Ranking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ranking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const eliminarRanking = async (req, res) => {
  try {
    await Ranking.findByIdAndDelete(req.params.id);
    res.json({ message: "Ranking eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};