import Usuario from "./usuario.js";
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  // Puedes agregar atributos específicos de Admin aquí
});

const Admin = Usuario.discriminator("Admin", adminSchema);
export default Admin;