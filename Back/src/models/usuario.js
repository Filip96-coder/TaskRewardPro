import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: false, unique: true, trim: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ["Admin", "Lider", "Trabajador"], default: "Trabajador" },
  points: { type: Number, default: 0} 
} ,{
  timestamps: true,
});

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;