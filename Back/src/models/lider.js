import Usuario from "./usuario.js";
import mongoose from "mongoose";

const liderSchema = new mongoose.Schema({
  area: { type: String },
  puntos: { type: Number, default: 0 },
  // Otros atributos específicos de Lider
});

const Lider = Usuario.discriminator("Lider", liderSchema);
export default Lider;