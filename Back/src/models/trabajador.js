import Usuario from "./usuario.js";
import mongoose from "mongoose";

const trabajadorSchema = new mongoose.Schema({
  cargo: { type: String },
  puntos: { type: Number, default: 0 },
});

const Trabajador = Usuario.discriminator("Trabajador", trabajadorSchema);
export default Trabajador;