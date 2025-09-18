import mongoose from "mongoose";

const tareaSchema = new mongoose.Schema({
  tareaId: { type: Number, required: true, unique: true },
  titulo: { type: String, required: true },
  descripcion: { type: String },
  estado: { type: Boolean, default: false },
  fechaInicio: { type: Date },
  fechaFin: { type: Date }
});

const Tarea = mongoose.model("Tarea", tareaSchema);
export default Tarea;