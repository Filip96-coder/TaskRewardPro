import mongoose from "mongoose";

const metaSchema = new mongoose.Schema({
  metaId: { type: Number, required: true, unique: true },
  nombreMeta: { type: String, required: true },
  descripcion: { type: String },
  estado: { type: Boolean, default: false },
  tareas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tarea" }]
});

const Meta = mongoose.model("Meta", metaSchema);
export default Meta;