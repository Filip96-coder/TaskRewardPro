import Ranking from "../models/ranking.js";
import Usuario from "../models/usuario.js";


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
    // Traemos usuarios y nos aseguramos de incluir el campo "points"
    const usuarios = await Usuario.find()
      .select("nombre email avatar points puntos puntosTotales totalPoints")
      .lean();

    const sorted = usuarios.sort((a, b) => {
      const puntosA =
        (a.points ?? a.puntos ?? a.puntosTotales ?? a.totalPoints ?? 0);
      const puntosB =
        (b.points ?? b.puntos ?? b.puntosTotales ?? b.totalPoints ?? 0);
      return puntosB - puntosA; // mayor a menor
    });

    res.json(sorted.slice(0, 50)); // Top 50
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