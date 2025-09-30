import mongoose from "mongoose";

const tareaSchema = new mongoose.Schema({
  title: { type: String, required: true },            
  description: { type: String, required: true },
  dueDate: { type: Date },                             
  points: { type: Number, default: 0 },
  attachments: [{ name: String, type: String, size: Number }],
  status: { type: String, enum: ["Pendiente", "Completada"], default: "Pendiente" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }
},{timestamps:true

});

const Tarea = mongoose.model("Tarea", tareaSchema);
export default Tarea;