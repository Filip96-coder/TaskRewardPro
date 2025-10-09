import mongoose from "mongoose";

const tareaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  points: {
    type: Number,
    required: true,
    min: [1, "Los puntos no pueden ser negativos"]
  },
  attachments: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  status: { type: String, default: "Pendiente" } // <-- Agrega este campo
});
const Tarea = mongoose.model("Tarea", tareaSchema);
export default Tarea;