import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  email: { type: String, required: false, unique: true, trim: true },
  password: { type: String, required: true },
  rol: { type: String, required: true, enum: ["Admin", "Lider", "Trabajador"] }, // Nuevo campo
}, {
  timestamps: true,
  discriminatorKey: "rol", // Importante para discriminadores
});

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;