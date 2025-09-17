import mongoose from "mongoose";

const rankingSchema = new mongoose.Schema({
  rankingId: { type: Number, required: true, unique: true },
  usuarios: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }],
  posicion: { type: Number },
  fechaActualizada: { type: Date, default: Date.now }
});

const Ranking = mongoose.model("Ranking", rankingSchema);
export default Ranking;