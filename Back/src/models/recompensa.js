import mongoose from "mongoose";

const recompensaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  puntosRequeridos: { type: Number, required: true },
  cantidadCanjes: { type: Number, default: 0 },
  limiteCanjes: { type: Number },
  fechaLimiteCanje: { type: Date }
});

const Recompensa = mongoose.model("Recompensa", recompensaSchema);
export default Recompensa;