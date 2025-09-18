import mongoose from "mongoose";

const historialCanjeSchema = new mongoose.Schema({
  historialId: { type: Number, required: true, unique: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  recompensa: { type: mongoose.Schema.Types.ObjectId, ref: "Recompensa" },
  fechaCanje: { type: Date, default: Date.now }
});

const HistorialCanje = mongoose.model("HistorialCanje", historialCanjeSchema);
export default HistorialCanje;